/**
 * Build src/data/chunks.json by:
 *   1. Grouping chapters by their section file.
 *   2. For each section file, hashing the source.
 *   3. For each chapter in that file:
 *      - On cache hit: reuse cached chunks for that chapter.
 *      - On cache miss: ask Claude (via llm-chunk.mjs) for chunks for that chapter only.
 *        One LLM call per chapter keeps each call's output well within the 16K token
 *        budget, so dense chapters never overflow.
 *   4. Stamping every chunk with stable id, chapterTitle, sectionName, and writing the
 *      merged array sorted by (chapterId, sub).
 *
 * Cache shape: { "<sectionFileHash>": { "<chapterId>": Chunk[] } }
 *   Editing a section file changes its hash, invalidating ALL chapters in it.
 *   Edits typically affect a whole file's interleaved helpers anyway, so this is fine.
 *
 * Run via: node scripts/build-search-index.mjs (or via npm run search:index).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, renameSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import { chunkSection } from "./llm-chunk.mjs";

const CHUNKS_PATH = "src/data/chunks.json";
const CACHE_PATH = "src/data/chunk-cache.json";
const SVG_PATH = "src/data/svg-descriptions.json";
const SECTIONS_DIR = "src/sections";

function atomicWrite(path, contents) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, contents);
  renameSync(tmp, path);
}

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

// Hash on whitespace-normalized source. Prettier reformats and indentation
// changes do NOT invalidate the cache — only real content changes do.
function contentHash(source) {
  return sha256_16(source.replace(/\s+/g, " ").trim());
}

function chunkId(chapterId, sub, kind, text) {
  return sha256_16(`${chapterId}|${sub}|${kind}|${sha256_16(text)}`);
}

function chapterCmp(a, b) {
  // Numeric chapter sort: "1.2" < "1.10" < "2.1". Defensive against undefined/NaN.
  const parse = (id) => {
    const [s, c] = String(id).split(".").map((p) => Number(p));
    return [Number.isFinite(s) ? s : 0, Number.isFinite(c) ? c : 0];
  };
  const [as, ac] = parse(a.chapterId);
  const [bs, bc] = parse(b.chapterId);
  if (as !== bs) return as - bs;
  if (ac !== bc) return ac - bc;
  const sa = Number.isFinite(a.sub) ? a.sub : 0;
  const sb = Number.isFinite(b.sub) ? b.sub : 0;
  return sa - sb;
}

export async function runBuild({ rootDir = process.cwd(), chapters, sectionNames, log = console.log }) {
  const cachePath = join(rootDir, CACHE_PATH);
  const chunksPath = join(rootDir, CHUNKS_PATH);
  const svgPath = join(rootDir, SVG_PATH);

  let cache = {};
  if (existsSync(cachePath)) {
    try {
      cache = JSON.parse(readFileSync(cachePath, "utf-8"));
    } catch (e) {
      log(`[warn] ${cachePath} corrupt (${e.message}); rebuilding cache from scratch.`);
      cache = {};
    }
  }
  const svgDescriptionsAll = existsSync(svgPath) ? JSON.parse(readFileSync(svgPath, "utf-8")) : {};

  // Group chapters by section file
  const byFile = new Map();
  for (const ch of chapters) {
    if (!ch.sectionFile) continue;
    if (!byFile.has(ch.sectionFile)) byFile.set(ch.sectionFile, []);
    byFile.get(ch.sectionFile).push(ch);
  }

  // Concurrency limit (default 4). Set LEARN_AI_BUILD_CONCURRENCY=N to override.
  const concurrency = Number(process.env.LEARN_AI_BUILD_CONCURRENCY) || 4;

  // Pre-resolve every chapter's source + fileHash so the worker pool can grab work freely.
  const fileSourceCache = new Map();
  const tasks = [];
  for (const [file, chs] of byFile.entries()) {
    const path = join(rootDir, SECTIONS_DIR, file);
    const source = readFileSync(path, "utf-8");
    const fileHash = contentHash(source);
    fileSourceCache.set(file, { source, fileHash });
    if (!cache[fileHash]) cache[fileHash] = {};
    for (const ch of chs) tasks.push({ ch, file });
  }

  // Serialize cache writes via a single-slot promise chain.
  let cacheWriteChain = Promise.resolve();
  function writeCache() {
    cacheWriteChain = cacheWriteChain.then(() => {
      atomicWrite(cachePath, JSON.stringify(cache, null, 2));
    });
    return cacheWriteChain;
  }

  // Stable index → results slot mapping so output order is deterministic regardless of race.
  const slot = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= tasks.length) return;
      const { ch, file } = tasks[i];
      const { source, fileHash } = fileSourceCache.get(file);
      let chunks;
      if (cache[fileHash][ch.id]) {
        chunks = cache[fileHash][ch.id];
        log(`  [cache hit] ${ch.id} ${ch.title}`);
      } else {
        log(`  [LLM] ${ch.id} ${ch.title}`);
        const svgForChapter = svgDescriptionsAll[ch.id]
          ? { [ch.id]: svgDescriptionsAll[ch.id] }
          : {};
        const result = await chunkSection({
          filePath: file,
          source,
          chapters: [
            {
              id: ch.id,
              title: ch.title,
              section: ch.section,
              sectionName: sectionNames[ch.section] || "",
            },
          ],
          svgDescriptions: svgForChapter,
        });
        chunks = result[ch.id] || [];
        cache[fileHash][ch.id] = chunks;
        await writeCache();
      }
      slot[i] = { ch, chunks };
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const all = [];
  for (const entry of slot) {
    if (!entry) continue;
    const { ch, chunks } = entry;
    for (const c of chunks) {
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

  all.sort(chapterCmp);

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  atomicWrite(chunksPath, JSON.stringify(all, null, 2));
  atomicWrite(cachePath, JSON.stringify(cache, null, 2));
  log(`Wrote ${chunksPath} (${all.length} chunks)`);
  return all;
}

// CLI entry: read config + section names from src
async function main() {
  const cfgUrl = new URL("../src/config.js", import.meta.url).href;
  const { chapters, sectionNames } = await import(cfgUrl);

  // Build componentToFile by scanning every section file's exported PascalCase identifiers.
  // No need to encode section→file mapping by hand: any section file is fair game,
  // and a chapter's `component` already uniquely identifies its file.
  const sectionFiles = readdirSync("src/sections").filter((f) => f.endsWith(".jsx"));
  const componentToFile = {};
  for (const file of sectionFiles) {
    const src = readFileSync(`src/sections/${file}`, "utf-8");
    for (const m of src.matchAll(/export\s+(?:const|function|let|var)\s+([A-Z][A-Za-z0-9_]*)/g)) {
      const name = m[1];
      if (componentToFile[name] && componentToFile[name] !== file) {
        console.warn(`[warn] component ${name} exported by both ${componentToFile[name]} and ${file}; using ${file}.`);
      }
      componentToFile[name] = file;
    }
  }

  const indexable = chapters
    .filter((c) => c.id !== "0" && c.component)
    .map((c) => ({ ...c, sectionFile: componentToFile[c.component] }))
    .filter((c) => {
      if (!c.sectionFile) {
        console.warn(`[warn] chapter ${c.id} component ${c.component} not found in src/sections/*.jsx; skipping`);
        return false;
      }
      return true;
    });

  await runBuild({ chapters: indexable, sectionNames });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
