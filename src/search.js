/**
 * Hybrid search: MiniSearch BM25 + multi-vector cosine + Reciprocal Rank Fusion.
 *
 * Data files (built by scripts/build-search-index.mjs + embed-chunks.mjs):
 *   src/data/chunks.json                  - chunk metadata + text + queries + summary + terms
 *   src/data/embeddings.bin               - Int8Array of all repr vectors, contiguous (count * dim bytes)
 *   src/data/embeddings-manifest.json     - per-vector entries + modelChecksum + dim
 *
 * Query-time embedding model: q4 ONNX bge-base from /models/bge-base-en-v1.5-q4/
 * (loaded via @huggingface/transformers, dtype from model-meta.json).
 */
import MiniSearch from "minisearch";
import { getCachedSearchAssets, cacheSearchAssets } from "./embedding-cache.js";
import { chapters, sectionNames } from "./config.js";

const chapterBySlug = new Map(chapters.map((c) => [c.slug, c]));

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
let embedPipeline = null;
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

/** Idle-time semantic pre-fetch. Silent. */
export async function prefetchSearch() {
  if (!textReady) await initSearch();
  if (semanticReady || semanticLoading) return;
  semanticLoading = true;
  loadProgress = 0;
  try {
    // 1. Model meta
    const metaRes = await fetch(`${BASE}models/bge-base-en-v1.5-q4/model-meta.json`);
    if (!metaRes.ok) throw new Error("model-meta.json missing");
    modelMeta = await metaRes.json();
    dim = modelMeta.dim;

    // 2. Always load manifest fresh from disk (cheap, ~1 MB gzipped, ships with
    //    the JS bundle). The manifest's content fingerprint is part of the cache
    //    key so the cached embeddings.bin auto-invalidates whenever chunks or
    //    embeddings change in a new deploy.
    manifest = await import("./data/embeddings-manifest.json").then((m) => m.default || m);
    const cacheKey = `${modelMeta.checksum}:${manifestFingerprint(manifest)}`;

    // 3. Try the embeddings cache under the compound key.
    const cached = await getCachedSearchAssets(cacheKey);
    if (cached && cached.bin instanceof Uint8Array) {
      bin = cached.bin;
    } else {
      const binBuf = await fetch(new URL("./data/embeddings.bin", import.meta.url).href).then((r) => r.arrayBuffer());
      bin = new Uint8Array(binBuf);
      cacheSearchAssets(cacheKey, { bin, manifest }).catch(() => {});
    }
    loadProgress = 30;

    // 3. Lazy-load transformers.js + load model from local path
    const { pipeline, env } = await import("@huggingface/transformers");
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = `${BASE}models/`;
    embedPipeline = await pipeline("feature-extraction", "bge-base-en-v1.5-q4", {
      dtype: modelMeta.dtype,
      progress_callback: (p) => {
        if (p.status === "progress" && typeof p.progress === "number") {
          loadProgress = 30 + Math.round(p.progress * 0.65);
        }
      },
    });
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
  if (!embedPipeline) return null;
  const prefixed = (modelMeta?.queryInstruction || "") + text;
  const res = await embedPipeline(prefixed, { pooling: "mean", normalize: true });
  return res.tolist()[0];
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

// 80% vector / 20% BM25. LLM-authored chunks favor semantic match; keyword
// path retained for exact-term queries (HNSW, RoPE, FAISS, etc.).
const W_TEXT = 0.2;
const W_VEC = 0.8;

function rrfMerge(textResults, vectorResults, k = 60) {
  const score = new Map();
  const data = new Map();
  textResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + W_TEXT / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  });
  vectorResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + W_VEC / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  });
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
