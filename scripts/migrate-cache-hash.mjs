/**
 * One-shot migration: re-key src/data/chunk-cache.json from raw-source SHA
 * (legacy) to whitespace-normalized SHA (new). Avoids re-running every
 * chapter through the LLM after the hash function change.
 *
 * Usage: node scripts/migrate-cache-hash.mjs
 *
 * Safe to re-run: idempotent. Files already keyed correctly are left alone.
 */
import { readFileSync, writeFileSync, readdirSync, renameSync, existsSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const CACHE_PATH = "src/data/chunk-cache.json";
const SECTIONS_DIR = "src/sections";

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function rawHash(source) {
  return sha256_16(source);
}

function normalizedHash(source) {
  return sha256_16(source.replace(/\s+/g, " ").trim());
}

function atomicWrite(path, contents) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, contents);
  renameSync(tmp, path);
}

function main() {
  if (!existsSync(CACHE_PATH)) {
    console.log(`No ${CACHE_PATH} to migrate.`);
    return;
  }
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
  const before = Object.keys(cache).length;

  const files = readdirSync(SECTIONS_DIR).filter((f) => f.endsWith(".jsx"));
  let remapped = 0;
  let alreadyMigrated = 0;
  let unmatched = [];

  for (const file of files) {
    const source = readFileSync(join(SECTIONS_DIR, file), "utf-8");
    const oldKey = rawHash(source);
    const newKey = normalizedHash(source);

    if (cache[newKey]) {
      alreadyMigrated++;
      continue;
    }
    if (cache[oldKey] && oldKey !== newKey) {
      cache[newKey] = cache[oldKey];
      delete cache[oldKey];
      remapped++;
      console.log(`  ${file}: ${oldKey} → ${newKey} (${Object.keys(cache[newKey]).length} chapters)`);
    } else {
      unmatched.push(file);
    }
  }

  atomicWrite(CACHE_PATH, JSON.stringify(cache, null, 2));

  console.log();
  console.log(`Cache entries before: ${before}`);
  console.log(`Cache entries after: ${Object.keys(cache).length}`);
  console.log(`Remapped: ${remapped}`);
  console.log(`Already at new key: ${alreadyMigrated}`);
  if (unmatched.length) {
    console.log(`Unmatched files (cache miss expected on next build): ${unmatched.join(", ")}`);
  }
}

main();
