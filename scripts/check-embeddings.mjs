/**
 * Pre-push guard: verifies embeddings.bin + embeddings-manifest.json are
 * consistent with chunks.json (every chunk id covered by ≥1 vector; bin
 * size matches count × (dim + 4) since each row stores an int8 vector
 * followed by a float32 scale).
 *
 * Exits 0 if in sync, exits 1 (blocking push) if out of sync.
 */
import { readFileSync, statSync } from "fs";

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";

function fail(msg) {
  console.error(`\x1b[31m[pre-push] ${msg}\n  Run: npm run search:build\x1b[0m`);
  process.exit(1);
}

try {
  const chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const binSize = statSync(BIN_PATH).size;

  if (!Array.isArray(chunks) || chunks.length === 0) fail(`${CHUNKS_PATH} has 0 chunks.`);
  if (!Array.isArray(manifest.chunkIds)) fail(`${MANIFEST_PATH} missing 'chunkIds'.`);
  if (typeof manifest.dim !== "number") fail(`${MANIFEST_PATH} missing 'dim'.`);
  if (typeof manifest.count !== "number") fail(`${MANIFEST_PATH} missing 'count'.`);

  // Bin = [count × (dim + 4) vec rows][count × 2 Uint16 chunkIdx].
  const expectedBinSize = manifest.count * (manifest.dim + 4) + manifest.count * 2;
  if (binSize !== expectedBinSize)
    fail(`Bin size (${binSize}) != count × (dim + 4) + count × 2 (${expectedBinSize}).`);

  const chunkIds = new Set(chunks.map((c) => c.id));
  for (const id of chunkIds) {
    if (!manifest.chunkIds.includes(id)) fail(`Chunk id ${id} has no vectors in manifest.`);
  }
  for (const id of manifest.chunkIds) {
    if (!chunkIds.has(id)) fail(`Manifest references unknown chunk id ${id}.`);
  }

  console.log(
    `\x1b[32m[pre-push] Embeddings in sync: ${chunks.length} chunks, ${manifest.count} vectors, dim ${manifest.dim}, model ${manifest.modelChecksum}.\x1b[0m`,
  );
} catch (err) {
  fail(`Could not verify embeddings: ${err.message}`);
}
