/**
 * Re-embed every chunk representation by calling the Cloudflare Worker
 * proxy (cf-worker/worker.js), which routes to Workers AI's
 * @cf/baai/bge-base-en-v1.5. After this runs, the query path (browser ->
 * CF Worker) and the corpus path (this script -> CF Worker) sit on the
 * exact same model so cosine similarity is consistent.
 *
 * Usage:
 *   EMBED_API_URL=https://learn-ai-embed.<acct>.workers.dev \
 *     node scripts/embed-chunks-remote.mjs
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

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";
const META_PATH = "public/models/bge-base-en-v1.5-q4/model-meta.json";

const DIM = 768;
const REMOTE_MODEL_ID = "cf-workers-ai-bge-base-en-v1.5";
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

async function embedOne(url, text) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!Array.isArray(data?.vector) || data.vector.length !== DIM) {
    throw new Error(`bad vector shape: got ${data?.vector?.length}, want ${DIM}`);
  }
  // Workers AI may return un-normalized vectors. Force unit length so the
  // int8 quantization step preserves cosine similarity.
  return l2Normalize(data.vector);
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

export async function runRemoteEmbed({ rootDir = process.cwd(), url, log = console.log } = {}) {
  if (!url) throw new Error("EMBED_API_URL not set");
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

  const bin = Buffer.alloc(desired.length * DIM);
  const newVectors = [];
  for (let i = 0; i < desired.length; i++) {
    const { bytes, scale } = quantizeInt8(vectors[i]);
    Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).copy(bin, i * DIM);
    newVectors.push({
      chunkId: desired[i].chunkId,
      reprKind: desired[i].reprKind,
      reprIndex: desired[i].reprIndex,
      contentHash: desired[i].contentHash,
      vectorIndex: i,
      scale,
    });
  }

  const checksum = `cf:${sha256_16(REMOTE_MODEL_ID + ":" + DIM)}`;
  const newManifest = {
    modelChecksum: checksum,
    dim: DIM,
    count: desired.length,
    vectors: newVectors,
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
  log(`Wrote ${BIN_PATH} (${bin.byteLength} bytes), ${MANIFEST_PATH} (${newVectors.length} vectors), ${META_PATH}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.env.EMBED_API_URL || process.argv[2];
  runRemoteEmbed({ url }).catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
