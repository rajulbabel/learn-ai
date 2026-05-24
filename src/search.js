/**
 * Hybrid search: MiniSearch BM25 + multi-vector cosine + Reciprocal Rank Fusion.
 *
 * Data files (built by scripts/build-search-index.mjs + embed-chunks-remote.mjs):
 *   src/data/chunks.json                  - chunk metadata + text + queries + summary + terms
 *   src/data/embeddings.bin               - Int8Array of all repr vectors, contiguous (count * dim bytes)
 *   src/data/embeddings-manifest.json     - per-vector entries + modelChecksum + dim
 *
 * Query-time embedding: Cloudflare Workers AI (@cf/baai/bge-base-en-v1.5)
 * reached through the cf-worker/ proxy. URL injected at build time via
 * VITE_EMBED_API_URL. When unset, the site runs text-only search.
 */
import MiniSearch from "minisearch";
import { getCachedSearchAssets, cacheSearchAssets } from "./embedding-cache.js";
import { chapters, sectionNames } from "./config.js";

const chapterBySlug = new Map(chapters.map((c) => [c.file, c]));

// Short content fingerprint of an embeddings manifest. Combined with the model
// checksum it forms the IndexedDB cache key for embeddings.bin so the cache
// invalidates automatically whenever the embedding set changes between deploys.
function manifestFingerprint(m) {
  const vs = m.vectors;
  const first = vs[0].chunkId;
  const last = vs[vs.length - 1].chunkId;
  return `${m.count}-${first}-${last}`;
}

let miniSearch = null;
let chunks = [];
let chunkById = new Map();
let manifest = null;
let bin = null; // Uint8Array
let dim = 0;
let modelMeta = null;

let textReady = false;
let semanticReady = false;
let semanticLoading = false;
let loadProgress = 0;

export function getSearchStatus() {
  if (semanticReady) return { mode: "semantic", progress: 100 };
  if (semanticLoading) return { mode: "loading", progress: loadProgress };
  if (textReady) return { mode: "text", progress: 0 };
  return { mode: "off", progress: 0 };
}

/** Lazy: load chunks.json + build MiniSearch index. */
export async function initSearch() {
  if (textReady) return;
  let chunkData;
  try {
    const mod = await import("./data/chunks.json");
    chunkData = mod.default || mod;
  } catch {
    console.warn("[search] chunks.json missing - run npm run search:build");
    return;
  }
  chunks = Array.isArray(chunkData) ? chunkData : [];
  chunkById = new Map(chunks.map((c) => [c.id, c]));

  miniSearch = new MiniSearch({
    fields: ["text", "summary", "terms_joined", "chapterTitle"],
    storeFields: ["chapterSlug", "chapterTitle", "sub", "text", "summary"],
    idField: "id",
    extractField: (doc, field) => (field === "terms_joined" ? (doc.terms || []).join(" ") : doc[field]),
    searchOptions: {
      boost: { chapterTitle: 4, terms_joined: 3, summary: 2, text: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  miniSearch.addAll(chunks);
  textReady = true;
}

const BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/learn-ai/";

// Cloudflare Worker that hosts BGE-base via Workers AI. When unset (dev
// without VITE_EMBED_API_URL), semantic init is skipped and the site falls
// back to text-only search.
const REMOTE_EMBED_URL =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_EMBED_API_URL || "" : "";

/** Semantic pre-fetch: warm the corpus bin + meta in parallel. */
export async function prefetchSearch() {
  if (semanticReady || semanticLoading) return;
  if (!REMOTE_EMBED_URL) return; // No remote endpoint configured → text-only.
  semanticLoading = true;
  loadProgress = 0;
  try {
    // Fire every independent fetch in the same tick so the network handles
    // them in parallel: text index (chunks.json), model meta (dim + query
    // instruction), manifest (vector ids + scales), and the int8 corpus
    // bin (gated only on meta+manifest for the cache key).
    const textPromise = initSearch();
    const metaPromise = fetch(`${BASE}models/bge-base-en-v1.5-q4/model-meta.json`).then((r) => {
      if (!r.ok) throw new Error("model-meta.json missing");
      return r.json();
    });
    const manifestPromise = import("./data/embeddings-manifest.json").then((m) => m.default || m);
    const setMetaPromise = metaPromise.then((meta) => {
      modelMeta = meta;
      dim = meta.dim;
    });
    const binPromise = Promise.all([metaPromise, manifestPromise]).then(async ([meta, mf]) => {
      manifest = mf;
      const cacheKey = `${meta.checksum}:${manifestFingerprint(mf)}`;
      const cached = await getCachedSearchAssets(cacheKey);
      if (cached && cached.bin instanceof Uint8Array) {
        bin = cached.bin;
        return;
      }
      const binBuf = await fetch(new URL("./data/embeddings.bin", import.meta.url).href).then((r) => r.arrayBuffer());
      bin = new Uint8Array(binBuf);
      cacheSearchAssets(cacheKey, { bin, manifest }).catch(() => {});
    });

    await Promise.all([textPromise, setMetaPromise, binPromise]);
    loadProgress = 100;
    semanticReady = true;
    semanticLoading = false;
  } catch (e) {
    console.warn("[search] semantic init failed:", e.message);
    semanticLoading = false;
    loadProgress = 0;
  }
}

// ── int8 cosine over the flat bin ──
function int8Cosine(qFloat, qNorm, vecOffset, vecScale) {
  let dot = 0;
  let vNormSq = 0;
  for (let i = 0; i < dim; i++) {
    const v8 = (bin[vecOffset + i] << 24) >> 24; // sign-extend int8
    const v = v8 * vecScale;
    dot += qFloat[i] * v;
    vNormSq += v * v;
  }
  const vNorm = Math.sqrt(vNormSq);
  return dot / (qNorm * vNorm + 1e-8);
}

async function embedQuery(text) {
  if (!REMOTE_EMBED_URL) return null;
  const prefixed = (modelMeta?.queryInstruction || "") + text;
  const res = await fetch(REMOTE_EMBED_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: prefixed }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data?.vector) ? data.vector : null;
}

// Multi-vector retrieval: per chunk, take MAX similarity across all reprs. Top-K chunks.
function vectorSearchMaxSim(qFloat, topK = 30) {
  let qNorm = 0;
  for (const x of qFloat) qNorm += x * x;
  qNorm = Math.sqrt(qNorm);
  const best = new Map();
  for (const v of manifest.vectors) {
    const offset = v.vectorIndex * dim;
    const s = int8Cosine(qFloat, qNorm, offset, v.scale);
    const cur = best.get(v.chunkId);
    if (cur === undefined || s > cur) best.set(v.chunkId, s);
  }
  const ranked = [...best.entries()]
    .map(([chunkId, score]) => ({ chunkId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return ranked
    .map((r) => {
      const c = chunkById.get(r.chunkId);
      return c ? { ...c, vectorScore: r.score } : null;
    })
    .filter(Boolean);
}

function textSearchInternal(query, topK = 30) {
  if (!miniSearch) return [];
  return miniSearch.search(query, { limit: topK }).map((r) => ({
    ...chunkById.get(r.id),
    textScore: r.score,
  }));
}

// Pure Reciprocal Rank Fusion (Cormack, Clarke & Buettcher, 2009): equal
// weight, rank-only, k=60. Scale-free across heterogeneous scorers.
function rrfMerge(textResults, vectorResults, k = 60) {
  const score = new Map();
  const data = new Map();
  const add = (r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + 1 / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  };
  textResults.forEach(add);
  vectorResults.forEach(add);
  return [...score.entries()]
    .map(([id, s]) => ({ ...data.get(id), fusedScore: s }))
    .sort((a, b) => b.fusedScore - a.fusedScore);
}

function dedupeByChapter(items) {
  const seen = new Set();
  const out = [];
  for (const r of items) {
    const key = `${r.chapterSlug}:${r.sub}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

function shape(r) {
  const ch = chapterBySlug.get(r.chapterSlug);
  return {
    chapterSlug: r.chapterSlug,
    chapterId: ch ? ch.id : null,
    title: r.chapterTitle,
    section: ch ? ch.section : null,
    sectionName: ch ? sectionNames[ch.section] : null,
    sub: r.sub,
    text: r.text || r.summary || "",
    score: r.fusedScore || r.vectorScore || r.textScore || 0,
    source: r.fusedScore != null ? "hybrid" : r.vectorScore != null ? "semantic" : "text",
  };
}

export async function search(query, { limit = 10 } = {}) {
  if (!textReady) await initSearch();
  if (!miniSearch) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];

  const text = textSearchInternal(trimmed, 30);
  if (!semanticReady) {
    return dedupeByChapter(text).slice(0, limit).map(shape);
  }
  let vec = [];
  try {
    const q = await embedQuery(trimmed);
    if (q) vec = vectorSearchMaxSim(q, 30);
  } catch {
    // fall back to text
  }
  const merged = vec.length === 0 ? text : rrfMerge(text, vec);
  return dedupeByChapter(merged).slice(0, limit).map(shape);
}

export function searchText(query, limit = 10) {
  if (!miniSearch) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];
  const results = textSearchInternal(trimmed, 30);
  return dedupeByChapter(results).slice(0, limit).map(shape);
}
