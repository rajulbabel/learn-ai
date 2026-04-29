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
    fields: ["text", "summary", "terms_joined", "chapterTitle", "sectionName"],
    storeFields: ["chapterId", "chapterTitle", "section", "sectionName", "sub", "text", "summary"],
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

    // 2. Load embeddings (cache hit by modelChecksum, else download)
    const cached = await getCachedSearchAssets(modelMeta.checksum);
    if (cached) {
      manifest = cached.manifest;
      bin = cached.bin;
    } else {
      const [manifestMod, binBuf] = await Promise.all([
        import("./data/embeddings-manifest.json").then((m) => m.default || m),
        // Vite serves src/data/* as static assets via the bundler; fetch via the runtime URL.
        fetch(new URL("./data/embeddings.bin", import.meta.url).href).then((r) => r.arrayBuffer()),
      ]);
      manifest = manifestMod;
      bin = new Uint8Array(binBuf);
      cacheSearchAssets(modelMeta.checksum, { bin, manifest }).catch(() => {});
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
  return ranked.map((r) => ({ ...chunkById.get(r.chunkId), vectorScore: r.score }));
}

function textSearchInternal(query, topK = 30) {
  if (!miniSearch) return [];
  return miniSearch.search(query, { limit: topK }).map((r) => ({
    ...chunkById.get(r.id),
    textScore: r.score,
  }));
}

function rrfMerge(textResults, vectorResults, k = 60) {
  const score = new Map();
  const data = new Map();
  textResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + 1 / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  });
  vectorResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + 1 / (k + i + 1));
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
    const key = `${r.chapterId}:${r.sub}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

function shape(r) {
  return {
    chapterId: r.chapterId,
    title: r.chapterTitle,
    section: r.section,
    sectionName: r.sectionName,
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
