/**
 * Read chunks.json, embed every representation per chunk with the
 * local q4 ONNX bge-base, int8-quantize, and write:
 *
 *   src/data/embeddings.bin             (Int8Array, contiguous: count * dim bytes)
 *   src/data/embeddings-manifest.json   (per-vector metadata + modelChecksum)
 *
 * Reuses any vector whose (chunkId, reprKind, reprIndex, contentHash) is
 * unchanged since the previous manifest. New/changed reprs are embedded
 * and overwritten; removed reprs are dropped.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";
const META_PATH = "public/models/bge-base-en-v1.5-q4/model-meta.json";
const MODEL_DIR = "public/models/bge-base-en-v1.5-q4";

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function atomicWrite(path, data) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, data);
  renameSync(tmp, path);
}

// Generate (reprKind, reprIndex, content) tuples for one chunk
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

// int8 quantize a float vector. Returns { bytes: Int8Array, scale }.
// scale = max(|v|) / 127; float[i] ≈ int8[i] * scale.
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

export async function runEmbed({ rootDir = process.cwd(), log = console.log } = {}) {
  const meta = JSON.parse(readFileSync(join(rootDir, META_PATH), "utf-8"));
  const chunks = JSON.parse(readFileSync(join(rootDir, CHUNKS_PATH), "utf-8"));

  // Build the desired representation list with content hashes.
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

  // Load existing manifest + bin to reuse vectors when possible.
  let oldManifest = null;
  let oldBin = null;
  if (existsSync(join(rootDir, MANIFEST_PATH)) && existsSync(join(rootDir, BIN_PATH))) {
    try {
      oldManifest = JSON.parse(readFileSync(join(rootDir, MANIFEST_PATH), "utf-8"));
    } catch (e) {
      log(`[warn] manifest corrupt (${e.message}); rebuilding all vectors.`);
      oldManifest = null;
    }
    if (oldManifest && oldManifest.modelChecksum === meta.checksum && oldManifest.dim === meta.dim) {
      oldBin = readFileSync(join(rootDir, BIN_PATH));
    } else {
      log("Model checksum or dim changed; re-embedding everything.");
      oldManifest = null;
    }
  }

  const oldByKey = new Map();
  if (oldManifest && oldBin) {
    for (const v of oldManifest.vectors) {
      const key = `${v.chunkId}|${v.reprKind}|${v.reprIndex}|${v.contentHash}`;
      oldByKey.set(key, v);
    }
  }

  const reusableCount = desired.filter((d) =>
    oldByKey.has(`${d.chunkId}|${d.reprKind}|${d.reprIndex}|${d.contentHash}`),
  ).length;
  const toEmbedCount = desired.length - reusableCount;
  log(`${desired.length} reprs total: ${reusableCount} reused, ${toEmbedCount} to embed.`);

  // Embed only what's needed
  let embedFn = null;
  if (toEmbedCount > 0) {
    const { pipeline } = await import("@huggingface/transformers");
    embedFn = await pipeline("feature-extraction", join(rootDir, MODEL_DIR), {
      dtype: meta.dtype,
      local_files_only: true,
    });
  }

  // Build new bin + manifest in desired order
  const dim = meta.dim;
  const newBin = Buffer.alloc(desired.length * dim);
  const newVectors = [];
  const BATCH_SIZE = 32;

  // ── First pass: reuse what we can, queue the rest ──
  const pending = [];
  for (let i = 0; i < desired.length; i++) {
    const d = desired[i];
    const key = `${d.chunkId}|${d.reprKind}|${d.reprIndex}|${d.contentHash}`;
    const reused = oldByKey.get(key);
    if (reused && oldBin) {
      const oldOffset = reused.vectorIndex * dim;
      oldBin.copy(newBin, i * dim, oldOffset, oldOffset + dim);
      newVectors.push({
        chunkId: d.chunkId,
        reprKind: d.reprKind,
        reprIndex: d.reprIndex,
        contentHash: d.contentHash,
        vectorIndex: i,
        scale: reused.scale,
      });
    } else {
      // Reserve a slot in newVectors at position i; we'll fill it during pass 2.
      newVectors.push(null);
      pending.push({ index: i, descriptor: d });
    }
  }

  // ── Second pass: embed pending in batches ──
  let embedded = 0;
  for (let bStart = 0; bStart < pending.length; bStart += BATCH_SIZE) {
    const batch = pending.slice(bStart, bStart + BATCH_SIZE);
    const texts = batch.map((p) => p.descriptor.content);
    let results;
    try {
      const tensor = await embedFn(texts, { pooling: "mean", normalize: true });
      results = tensor.tolist();
    } catch (err) {
      const culprits = batch
        .map((p) => `${p.descriptor.chunkId}/${p.descriptor.reprKind}#${p.descriptor.reprIndex}`)
        .join(", ");
      throw new Error(`embedding batch failed (${culprits}): ${err.message}`);
    }
    for (let bi = 0; bi < batch.length; bi++) {
      const { index, descriptor: d } = batch[bi];
      const vec = results[bi];
      const { bytes, scale } = quantizeInt8(vec);
      Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).copy(newBin, index * dim);
      newVectors[index] = {
        chunkId: d.chunkId,
        reprKind: d.reprKind,
        reprIndex: d.reprIndex,
        contentHash: d.contentHash,
        vectorIndex: index,
        scale,
      };
    }
    embedded += batch.length;
    log(`  embedded ${embedded}/${pending.length}`);
  }

  if (newVectors.some((v) => v === null)) {
    throw new Error("internal: some vectors were not filled");
  }

  const newManifest = {
    modelChecksum: meta.checksum,
    dim,
    count: desired.length,
    vectors: newVectors,
  };

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  atomicWrite(join(rootDir, BIN_PATH), newBin);
  atomicWrite(join(rootDir, MANIFEST_PATH), JSON.stringify(newManifest));
  log(`Wrote ${BIN_PATH} (${newBin.byteLength} bytes) + ${MANIFEST_PATH} (${newVectors.length} vectors).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmbed().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
