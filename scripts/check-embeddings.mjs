/**
 * Pre-commit guard: verifies embeddings.bin + embeddings-manifest.json are
 * consistent with chunks.json (every chunk id covered by ≥1 vector; bin
 * size matches count × dim).
 *
 * Exits 0 if in sync, exits 1 (blocking commit) if out of sync.
 */
import { readFileSync, statSync } from "fs";

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";

function fail(msg) {
  console.error(`\x1b[31m[pre-commit] ${msg}\n  Run: npm run search:build\x1b[0m`);
  process.exit(1);
}

try {
  const chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const binSize = statSync(BIN_PATH).size;

  if (!Array.isArray(chunks) || chunks.length === 0) fail(`${CHUNKS_PATH} has 0 chunks.`);
  if (!Array.isArray(manifest.vectors)) fail(`${MANIFEST_PATH} missing 'vectors'.`);
  if (typeof manifest.dim !== "number") fail(`${MANIFEST_PATH} missing 'dim'.`);
  if (typeof manifest.count !== "number") fail(`${MANIFEST_PATH} missing 'count'.`);
  if (manifest.count !== manifest.vectors.length)
    fail(`Manifest count (${manifest.count}) != vectors length (${manifest.vectors.length}).`);
  if (binSize !== manifest.count * manifest.dim)
    fail(`Bin size (${binSize}) != count × dim (${manifest.count * manifest.dim}).`);

  const chunkIds = new Set(chunks.map((c) => c.id));
  const covered = new Set(manifest.vectors.map((v) => v.chunkId));
  for (const id of chunkIds) {
    if (!covered.has(id)) fail(`Chunk id ${id} has no vectors in manifest.`);
  }
  for (const v of manifest.vectors) {
    if (!chunkIds.has(v.chunkId)) fail(`Manifest vector references unknown chunk id ${v.chunkId}.`);
    if (v.vectorIndex < 0 || v.vectorIndex >= manifest.count)
      fail(`Vector index ${v.vectorIndex} out of bounds.`);
  }

  console.log(
    `\x1b[32m[pre-commit] Embeddings in sync: ${chunks.length} chunks, ${manifest.count} vectors, dim ${manifest.dim}, model ${manifest.modelChecksum}.\x1b[0m`,
  );
} catch (err) {
  fail(`Could not verify embeddings: ${err.message}`);
}
