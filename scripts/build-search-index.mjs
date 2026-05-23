/**
 * Build src/data/chunks.json by:
 *   1. For each chapter, hashing its own source file (src/chapters/<file>.jsx).
 *   2. On cache hit: reuse cached chunks for that chapter.
 *   3. On cache miss: ask Claude (via llm-chunk.mjs) for chunks for that chapter only.
 *      One LLM call per chapter keeps each call's output well within the 16K token
 *      budget, so dense chapters never overflow.
 *   4. Stamping every chunk with stable id, chapterTitle, chapterSlug, and writing the
 *      merged array sorted by (input chapter order, sub, kind).
 *
 * Cache shape: { "<chapterFileHash>": Chunk[] }
 *   Editing a chapter file changes its hash, invalidating only that chapter.
 *
 * Run via: node scripts/build-search-index.mjs (or via npm run search:index).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import { chunkSection } from "./llm-chunk.mjs";

const CHUNKS_PATH = "src/data/chunks.json";
const CACHE_PATH = "src/data/chunk-cache.json";
const SVG_PATH = "src/data/svg-descriptions.json";
const CHAPTERS_DIR = "src/chapters";

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

function chunkId(chapterSlug, sub, kind, text) {
  return sha256_16(`${chapterSlug}|${sub}|${kind}|${sha256_16(text)}`);
}

// Strip hardcoded chapter IDs (e.g. "Chapter 5.5") from cached LLM-authored
// prose. Chapter IDs change when content is reordered; the cache key is the
// chapter source-file hash, so reorders don't invalidate cached text and stale
// IDs would otherwise surface in search results. Applied at output time so the
// raw cache stays intact for debugging while chunks.json is always clean.
export function scrubChapterIds(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/\b[Cc]hapter\s+\d+\.\d+\b/g, "this chapter")
    .replace(/^this chapter/, "This chapter")
    .replace(/([.!?]\s+)this chapter/g, "$1This chapter");
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

  // Concurrency limit (default 3, safe under subscription rate limits).
  // Set LEARN_AI_BUILD_CONCURRENCY=N to override.
  const concurrency = Number(process.env.LEARN_AI_BUILD_CONCURRENCY) || 3;

  // Resolve every chapter's source + chapterHash up front so the worker pool can grab work freely.
  const tasks = [];
  for (const ch of chapters) {
    if (!ch.file) continue;
    const path = join(rootDir, CHAPTERS_DIR, `${ch.file}.jsx`);
    const source = readFileSync(path, "utf-8");
    const chapterHash = contentHash(source);
    tasks.push({ ch, source, chapterHash });
  }

  // Build a map slug → reading-order index. Reading order is section-major:
  // chapters from section 1 come first (in their input order within that
  // section), then section 2, etc. This keeps chunks.json output stable in
  // section order regardless of how chapters are listed in config.
  const orderedTasks = tasks
    .map((t, i) => ({ t, i }))
    .sort((a, b) => {
      const sa = a.t.ch.section;
      const sb = b.t.ch.section;
      if (sa !== sb) return sa - sb;
      return a.i - b.i;
    });
  const slugOrder = new Map(orderedTasks.map(({ t }, i) => [t.ch.file, i]));

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
      const { ch, source, chapterHash } = tasks[i];
      let chunks;
      if (cache[chapterHash]) {
        chunks = cache[chapterHash];
        log(`  [cache hit] ${ch.id} ${ch.title}`);
      } else {
        log(`  [LLM] ${ch.id} ${ch.title}`);
        const svgForChapter = svgDescriptionsAll[ch.id] ? { [ch.id]: svgDescriptionsAll[ch.id] } : {};
        const result = await chunkSection({
          filePath: `${CHAPTERS_DIR}/${ch.file}.jsx`,
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
        cache[chapterHash] = chunks;
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
      const text = scrubChapterIds(c.text);
      all.push({
        id: chunkId(ch.file, c.sub, c.kind, text),
        chapterSlug: ch.file,
        chapterTitle: ch.title,
        sub: c.sub,
        kind: c.kind,
        text,
        summary: scrubChapterIds(c.summary),
        queries: c.queries,
        terms: c.terms,
      });
    }
  }

  const KIND_ORDER = { concept: 0, formula: 1, example: 2, diagram: 3, summary: 4 };
  all.sort((a, b) => {
    const ia = slugOrder.get(a.chapterSlug);
    const ib = slugOrder.get(b.chapterSlug);
    if (ia !== ib) return ia - ib;
    if (a.sub !== b.sub) return a.sub - b.sub;
    return (KIND_ORDER[a.kind] ?? 99) - (KIND_ORDER[b.kind] ?? 99);
  });

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

  const indexable = chapters
    .filter((c) => c.id !== "0" && c.file)
    .filter((c) => {
      if (!c.file) {
        console.warn(`[warn] chapter ${c.id} has no file field; skipping`);
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
