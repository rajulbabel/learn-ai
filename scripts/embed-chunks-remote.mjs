/**
 * Re-embed every chunk representation by calling the Cloudflare Worker
 * proxy (cf-worker/worker.js), which routes to Workers AI's
 * @cf/baai/bge-base-en-v1.5. After this runs, the query path (browser ->
 * CF Worker) and the corpus path (this script -> CF Worker) sit on the
 * exact same model so cosine similarity is consistent.
 *
 * Usage:
 *   node scripts/embed-chunks-remote.mjs
 *
 * Uses the production Cloudflare Worker URL (DEFAULT_EMBED_API_URL below)
 * by default. Override with `EMBED_API_URL=http://localhost:8787` when
 * pointing at a `wrangler dev` instance for testing.
 *
 * Output (same paths as embed-chunks.mjs, so build/preview just works):
 *   src/data/embeddings.bin             (Int8Array, count * dim bytes)
 *   src/data/embeddings-manifest.json   (per-vector metadata)
 *   public/models/bge-base-en-v1.5-q4/model-meta.json  (checksum stamped
 *                                                       to cf:* so the
 *                                                       browser cache key
 *                                                       invalidates)
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const CHUNKS_PATH = "src/data/chunks-full.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";
const META_PATH = "public/models/bge-base-en-v1.5-q4/model-meta.json";

// Deployed Cloudflare Worker that proxies Workers AI BGE-base. Hardcoded so
// `node scripts/embed-chunks-remote.mjs` works with zero env / argv setup;
// EMBED_API_URL env or CLI arg can still override for local CF Worker testing.
const DEFAULT_EMBED_API_URL = "https://learn-ai-embed.rajul-babel.workers.dev";

// BGE-base produces 768-dim vectors; we keep the first 256 (Matryoshka cut).
// Re-normalize after truncation so cosine over the prefix matches the model's
// intended similarity space. Storage savings: 768 -> 256 = 3x smaller bin.
const FULL_DIM = 768;
const DIM = 256;
const SCALE_BYTES = 4; // float32 scale appended after each int8 row
const VEC_STRIDE = DIM + SCALE_BYTES; // bytes per vector row in the bin
const REMOTE_MODEL_ID = "cf-workers-ai-bge-base-en-v1.5-mrl256";
// BGE-base recommends prefixing queries (not passages) with this instruction.
// We embed passages here so we DO NOT prefix; the browser side prefixes
// queries before sending to the worker.
const QUERY_INSTRUCTION = "Represent this sentence for searching relevant passages: ";

const CONCURRENCY = 8;

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function atomicWrite(path, data) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, data);
  renameSync(tmp, path);
}

function representationsOf(chunk) {
  const out = [];
  out.push({ reprKind: "text", reprIndex: 0, content: chunk.text });
  out.push({ reprKind: "summary", reprIndex: 0, content: chunk.summary });
  for (let i = 0; i < (chunk.queries || []).length; i++) {
    out.push({ reprKind: "query", reprIndex: i, content: chunk.queries[i] });
  }
  out.push({ reprKind: "terms", reprIndex: 0, content: (chunk.terms || []).join(" ") });
  return out;
}

function quantizeInt8(vec) {
  let maxAbs = 0;
  for (const x of vec) if (Math.abs(x) > maxAbs) maxAbs = Math.abs(x);
  const scale = maxAbs > 0 ? maxAbs / 127 : 1 / 127;
  const out = new Int8Array(vec.length);
  for (let i = 0; i < vec.length; i++) {
    const q = Math.round(vec[i] / scale);
    out[i] = q > 127 ? 127 : q < -128 ? -128 : q;
  }
  return { bytes: out, scale };
}

function l2Normalize(vec) {
  let s = 0;
  for (const x of vec) s += x * x;
  const n = Math.sqrt(s) || 1;
  return vec.map((x) => x / n);
}

async function embedOnce(url, text) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!Array.isArray(data?.vector) || data.vector.length !== FULL_DIM) {
    throw new Error(`bad vector shape: got ${data?.vector?.length}, want ${FULL_DIM}`);
  }
  // Matryoshka: keep the first DIM dims, then L2-renormalize so cosine over
  // the truncated prefix is unit-length consistent. Workers AI may return
  // un-normalized vectors either way, so the renormalize doubles as the
  // standard unit-length step.
  return l2Normalize(data.vector.slice(0, DIM));
}

// Wrap embedOnce with exponential backoff. Workers AI and the network can
// drop the occasional request; without retries a single failure aborts the
// whole ~30 k embed run.
async function embedOne(url, text) {
  const delays = [500, 1500, 3000, 6000];
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await embedOnce(url, text);
    } catch (err) {
      lastErr = err;
      if (attempt === delays.length) break;
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastErr;
}

async function embedAll(url, items, log) {
  const out = new Array(items.length);
  let next = 0;
  let done = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try {
        out[i] = await embedOne(url, items[i].content);
      } catch (err) {
        throw new Error(`embed failed for ${items[i].chunkId}/${items[i].reprKind}#${items[i].reprIndex}: ${err.message}`);
      }
      done++;
      if (done % 50 === 0 || done === items.length) log(`  embedded ${done}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return out;
}

export async function runRemoteEmbed({ rootDir = process.cwd(), url = DEFAULT_EMBED_API_URL, log = console.log } = {}) {
  const chunks = JSON.parse(readFileSync(join(rootDir, CHUNKS_PATH), "utf-8"));

  const desired = [];
  for (const chunk of chunks) {
    for (const r of representationsOf(chunk)) {
      desired.push({
        chunkId: chunk.id,
        reprKind: r.reprKind,
        reprIndex: r.reprIndex,
        content: r.content,
        contentHash: sha256_16(r.content),
      });
    }
  }
  log(`${desired.length} reprs to embed via ${url}`);

  const vectors = await embedAll(url, desired, log);

  // Unique chunk ids in stable encounter order (smaller than per-vector array).
  // 1844 strings ≈ 35 KB vs ~1.6 MB previously.
  const chunkIds = [];
  const chunkIdToIdx = new Map();
  for (const d of desired) {
    if (!chunkIdToIdx.has(d.chunkId)) {
      chunkIdToIdx.set(d.chunkId, chunkIds.length);
      chunkIds.push(d.chunkId);
    }
  }

  // Bin layout:
  //   [vector rows]  → `count` rows of [int8 × DIM][float32 scale]
  //   [chunkIdx]     → Uint16 × count, little-endian, mapping vectorIndex → chunkIds[i]
  // Packing the chunkIdx into the bin lets the manifest collapse to a header
  // plus the unique chunkIds list (~35 KB), down from ~1.6 MB.
  const vecBytes = desired.length * VEC_STRIDE;
  const idxBytes = desired.length * 2;
  const bin = Buffer.alloc(vecBytes + idxBytes);
  for (let i = 0; i < desired.length; i++) {
    const { bytes, scale } = quantizeInt8(vectors[i]);
    const rowBase = i * VEC_STRIDE;
    Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).copy(bin, rowBase);
    bin.writeFloatLE(scale, rowBase + DIM);
    bin.writeUInt16LE(chunkIdToIdx.get(desired[i].chunkId), vecBytes + i * 2);
  }

  const checksum = `cf256:${sha256_16(REMOTE_MODEL_ID + ":" + DIM)}`;
  const newManifest = {
    modelChecksum: checksum,
    dim: DIM,
    count: desired.length,
    chunkIds,
  };

  const newMeta = {
    name: REMOTE_MODEL_ID,
    dim: DIM,
    checksum,
    dtype: "fp32",
    queryInstruction: QUERY_INSTRUCTION,
  };

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  mkdirSync(join(rootDir, "public/models/bge-base-en-v1.5-q4"), { recursive: true });
  atomicWrite(join(rootDir, BIN_PATH), bin);
  atomicWrite(join(rootDir, MANIFEST_PATH), JSON.stringify(newManifest));
  atomicWrite(join(rootDir, META_PATH), JSON.stringify(newMeta, null, 2));
  log(`Wrote ${BIN_PATH} (${bin.byteLength} bytes), ${MANIFEST_PATH} (${desired.length} vectors), ${META_PATH}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.env.EMBED_API_URL || process.argv[2] || DEFAULT_EMBED_API_URL;
  runRemoteEmbed({ url }).catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
