/**
 * Pre-commit guard: verifies embeddings.json has exactly the same number of
 * vectors as chunks.json has chunks, and that the checksum file is consistent.
 *
 * Exits 0 if in sync, exits 1 (blocking commit) if out of sync.
 * Run manually: node scripts/check-embeddings.mjs
 */
import { readFileSync } from "fs";
import { createHash } from "crypto";

const CHUNKS_PATH = "src/data/chunks.json";
const EMBEDDINGS_PATH = "src/data/embeddings.json";
const CHECKSUM_PATH = "src/data/embeddings-checksum.json";

try {
  const chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));
  const embeddingsRaw = readFileSync(EMBEDDINGS_PATH, "utf-8");
  const embeddings = JSON.parse(embeddingsRaw);

  const chunkCount = Array.isArray(chunks) ? chunks.length : 0;
  const vectorCount = Array.isArray(embeddings.vectors) ? embeddings.vectors.length : 0;

  if (chunkCount === 0) {
    console.error(`\x1b[31m[pre-commit] ${CHUNKS_PATH} has 0 chunks. Run: npm run search:build\x1b[0m`);
    process.exit(1);
  }

  if (vectorCount === 0) {
    console.error(`\x1b[31m[pre-commit] ${EMBEDDINGS_PATH} has 0 vectors. Run: npm run search:build\x1b[0m`);
    process.exit(1);
  }

  if (chunkCount !== vectorCount) {
    console.error(
      `\x1b[31m[pre-commit] Embedding mismatch: ${chunkCount} chunks vs ${vectorCount} vectors.\n` +
      `  Run: npm run search:build\x1b[0m`,
    );
    process.exit(1);
  }

  // Verify checksum file exists and matches actual embeddings content
  let checksumData;
  try {
    checksumData = JSON.parse(readFileSync(CHECKSUM_PATH, "utf-8"));
  } catch {
    console.error(`\x1b[31m[pre-commit] ${CHECKSUM_PATH} missing or invalid. Run: npm run search:build\x1b[0m`);
    process.exit(1);
  }

  const actualChecksum = createHash("sha256").update(embeddingsRaw).digest("hex").slice(0, 16);
  if (checksumData.checksum !== actualChecksum) {
    console.error(
      `\x1b[31m[pre-commit] Checksum mismatch: ${CHECKSUM_PATH} says "${checksumData.checksum}" but actual is "${actualChecksum}".\n` +
      `  Run: npm run search:build\x1b[0m`,
    );
    process.exit(1);
  }

  if (checksumData.count !== vectorCount) {
    console.error(
      `\x1b[31m[pre-commit] Checksum count mismatch: ${CHECKSUM_PATH} says ${checksumData.count} but actual is ${vectorCount}.\n` +
      `  Run: npm run search:build\x1b[0m`,
    );
    process.exit(1);
  }

  console.log(`\x1b[32m[pre-commit] Embeddings in sync: ${chunkCount} chunks, ${vectorCount} vectors, checksum ${actualChecksum}.\x1b[0m`);
} catch (err) {
  console.error(`\x1b[31m[pre-commit] Could not verify embeddings: ${err.message}\n  Run: npm run search:build\x1b[0m`);
  process.exit(1);
}
