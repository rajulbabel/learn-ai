/**
 * Embedding generation script.
 *
 * Run via: node scripts/generate-embeddings.mjs
 *
 * Reads src/data/chunks.json (from extract-content), embeds each chunk
 * using all-MiniLM-L6-v2, and writes src/data/embeddings.json.
 *
 * Output format (embeddings only - chunks stay in chunks.json):
 * {
 *   model: "Xenova/all-MiniLM-L6-v2",
 *   dimensions: 384,
 *   vectors: [[0.01, -0.03, ...], ...]   // Float32 arrays, one per chunk (parallel index)
 * }
 */
import { readFileSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import { pipeline } from "@huggingface/transformers";

const MODEL = "Xenova/all-MiniLM-L6-v2";
const BATCH_SIZE = 32;

async function main() {
  console.log("Loading chunks...");
  const chunks = JSON.parse(readFileSync("src/data/chunks.json", "utf-8"));
  console.log(`  ${chunks.length} chunks loaded`);

  console.log(`Loading model: ${MODEL}...`);
  const embedder = await pipeline("feature-extraction", MODEL, {
    dtype: "q8",
  });
  console.log("  Model loaded");

  console.log("Generating embeddings...");
  const vectors = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.text.slice(0, 512)); // Truncate long chunks
    const results = await embedder(texts, {
      pooling: "mean",
      normalize: true,
    });
    // results.tolist() gives [[384 floats], [384 floats], ...]
    const batchEmbeddings = results.tolist();
    for (const emb of batchEmbeddings) {
      // Round to 6 decimal places to save space
      vectors.push(emb.map((v) => Math.round(v * 1e6) / 1e6));
    }
    const progress = Math.min(i + BATCH_SIZE, chunks.length);
    process.stdout.write(
      `\r  ${progress}/${chunks.length} chunks embedded (${Math.round((progress / chunks.length) * 100)}%)`,
    );
  }
  console.log("\n  Done!");

  const output = {
    model: MODEL,
    dimensions: vectors[0].length,
    vectors,
  };

  const json = JSON.stringify(output);
  writeFileSync("src/data/embeddings.json", json);

  // Generate checksum of the vectors for browser-side caching.
  // The browser stores vectors in IndexedDB keyed by this checksum.
  // On repeat visits, if the checksum matches, the full embeddings.json
  // download (~1.6MB) is skipped entirely.
  const checksum = createHash("sha256").update(json).digest("hex").slice(0, 16);
  const checksumData = JSON.stringify({ checksum, count: vectors.length });
  writeFileSync("src/data/embeddings-checksum.json", checksumData);

  const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(2);
  console.log(
    `\nOutput: src/data/embeddings.json (${sizeMB} MB, ${chunks.length} chunks, ${vectors[0].length}d)`,
  );
  console.log(`Checksum: ${checksum} (written to src/data/embeddings-checksum.json)`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
