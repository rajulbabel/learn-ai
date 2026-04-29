/**
 * Build src/data/chunks.json by:
 *   1. Grouping chapters by their section file.
 *   2. For each section file, hashing the source.
 *   3. On cache hit: reuse cached chunks.
 *   4. On cache miss: ask Claude (via llm-chunk.mjs) to author chunks
 *      for every chapter in that file in a single call.
 *   5. Stamping every chunk with stable id, chapterTitle, sectionName,
 *      and writing the merged array sorted by (chapterId, sub).
 *
 * Run via: npm run search:index (or npm run search:build).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import { chunkSection } from "./llm-chunk.mjs";

const CHUNKS_PATH = "src/data/chunks.json";
const CACHE_PATH = "src/data/chunk-cache.json";
const SVG_PATH = "src/data/svg-descriptions.json";
const SECTIONS_DIR = "src/sections";

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function chunkId(chapterId, sub, kind, text) {
  return sha256_16(`${chapterId}|${sub}|${kind}|${sha256_16(text)}`);
}

function chapterCmp(a, b) {
  // Numeric chapter sort: "1.2" < "1.10" < "2.1"
  const [as, ac] = a.chapterId.split(".").map(Number);
  const [bs, bc] = b.chapterId.split(".").map(Number);
  if (as !== bs) return as - bs;
  if (ac !== bc) return ac - bc;
  return a.sub - b.sub;
}

export async function runBuild({ rootDir = process.cwd(), chapters, sectionNames, log = console.log }) {
  const cachePath = join(rootDir, CACHE_PATH);
  const chunksPath = join(rootDir, CHUNKS_PATH);
  const svgPath = join(rootDir, SVG_PATH);

  const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf-8")) : {};
  const svgDescriptionsAll = existsSync(svgPath) ? JSON.parse(readFileSync(svgPath, "utf-8")) : {};

  // Group chapters by section file
  const byFile = new Map();
  for (const ch of chapters) {
    if (!ch.sectionFile) continue;
    if (!byFile.has(ch.sectionFile)) byFile.set(ch.sectionFile, []);
    byFile.get(ch.sectionFile).push(ch);
  }

  const all = [];
  for (const [file, chs] of byFile.entries()) {
    const path = join(rootDir, SECTIONS_DIR, file);
    const source = readFileSync(path, "utf-8");
    const fileHash = sha256_16(source);

    let chapterChunks;
    if (cache[fileHash]) {
      chapterChunks = cache[fileHash];
      log(`  [cache hit] ${file}`);
    } else {
      log(`  [LLM] ${file} (${chs.length} chapters)`);
      const svgForFile = {};
      for (const ch of chs) {
        if (svgDescriptionsAll[ch.id]) svgForFile[ch.id] = svgDescriptionsAll[ch.id];
      }
      chapterChunks = await chunkSection({
        filePath: file,
        source,
        chapters: chs.map((c) => ({
          id: c.id,
          title: c.title,
          section: c.section,
          sectionName: sectionNames[c.section] || "",
        })),
        svgDescriptions: svgForFile,
      });
      cache[fileHash] = chapterChunks;
    }

    for (const ch of chs) {
      const arr = chapterChunks[ch.id] || [];
      for (const c of arr) {
        all.push({
          id: chunkId(ch.id, c.sub, c.kind, c.text),
          chapterId: ch.id,
          chapterTitle: ch.title,
          section: ch.section,
          sectionName: sectionNames[ch.section] || "",
          sub: c.sub,
          kind: c.kind,
          text: c.text,
          summary: c.summary,
          queries: c.queries,
          terms: c.terms,
        });
      }
    }
  }

  all.sort(chapterCmp);

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  writeFileSync(chunksPath, JSON.stringify(all, null, 2));
  writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  log(`Wrote ${chunksPath} (${all.length} chunks)`);
  return all;
}

// CLI entry: read config + section names from src
async function main() {
  const cfgUrl = new URL("../src/config.js", import.meta.url).href;
  const { chapters, sectionNames } = await import(cfgUrl);

  // Mirror learn-ai.jsx's section→file mapping.
  const sectionToFile = {
    0: "../sections/toc.jsx",
    1: "neural-foundations.jsx",
    2: "llm-training.jsx",
    3: "scaling.jsx",
    4: "road-to-transformers.jsx",
    5: "transformer-input.jsx",
    6: "attention-qkv.jsx",
    7: "attention-computation.jsx",
    8: "transformer-block.jsx",
    9: "encoder-decoder-diagrams.jsx",
    10: "modern-llm-techniques.jsx",
    11: ["vector-foundations.jsx", "vector-compression.jsx", "vector-production.jsx", "vector-systems.jsx"],
  };

  // For sections with multiple files, we need a per-component mapping.
  // Build it by reading each candidate file once and looking up the export.
  const componentToFile = {};
  for (const [, fileOrFiles] of Object.entries(sectionToFile)) {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    for (const file of files) {
      const path = `src/sections/${file}`;
      if (!existsSync(path)) continue;
      const src = readFileSync(path, "utf-8");
      // crude but reliable: regex-find every exported PascalCase identifier
      for (const m of src.matchAll(/export\s+(?:const|function|let|var)\s+([A-Z][A-Za-z0-9_]*)/g)) {
        componentToFile[m[1]] = file;
      }
    }
  }

  const indexable = chapters
    .filter((c) => c.id !== "0" && c.component)
    .map((c) => ({ ...c, sectionFile: componentToFile[c.component] }));

  await runBuild({ chapters: indexable, sectionNames });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
