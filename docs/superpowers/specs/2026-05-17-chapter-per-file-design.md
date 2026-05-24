# One JSX File Per Chapter - Refactor Design

Date: 2026-05-17
Status: Approved (brainstorming complete, ready for implementation plan)

## Goal

Refactor the learn-ai source so that every chapter lives in its own JSX file. Keep all content and runtime behavior **exactly** the same. No semantic, visual, or user-facing changes.

## Why

- Today: 27 section JSX files, the largest is `attention-computation.jsx` at 9060 lines (20 chapters).
- A chapter edit forces reading and diffing a large file; git blame and history are coarse-grained per section, not per chapter.
- A per-chapter file gives one editable unit per chapter, cleaner diffs, finer git history, finer search-index cache invalidation, and matches the project's existing kebab-case-by-topic naming convention.

## Non-goals

- Renaming chapter functions, changing chapter IDs, or altering the `section` field of any chapter.
- Changing rendered output for any chapter.
- Changing test assertions (only file layout changes).
- Promoting helpers to npm packages or introducing new abstractions.
- Updating section copy, visuals, or behavior.
- Refactoring the search runtime (`search.js`), nav-persistence, or components in `src/components.jsx`.

## Decisions (locked, from brainstorm)

| # | Decision | Choice |
|---|----------|--------|
| 1 | File layout | Nested by section topic folder: `src/chapters/<section-topic>/<chapter-kebab>.jsx` |
| 2 | Shared helpers | Top-level `src/shared/<topic>.jsx` grouping (chapter folders stay 100% chapter files) |
| 3 | Lookup mechanism | Vite `import.meta.glob('./chapters/**/*.jsx')` + per-file default export + new `file` field in config |
| 4 | Test layout | 232 per-chapter test files mirroring chapter folder structure at `src/__tests__/chapters/<section-topic>/<chapter>.test.jsx` |
| 5 | Search build cache | Per-chapter cache keyed by chapter file hash |
| 6 | Rollout | Single PR, single session |

## Target source tree

```
src/
  chapters/
    table-of-contents/
      toc.jsx
    neural-foundations/        (26 chapters: 1.1-1.26)
      what-is-nn.jsx
      inside-neuron.jsx
      ...
    llm-training/              (10 chapters: 2.1-2.10)
      tokenization.jsx
      batch-training.jsx       <- referenced by section 3 config entry 3.3
      ...
    scaling/                   (5 chapters: 3.1, 3.2, 3.4, 3.5, 3.6 -- 3.3 lives in llm-training/)
      scaling-laws.jsx
      ...
    road-to-transformers/      (4 + EncoderDecoder + DecoderOnly + WhatTransformerDoes)
    transformer-input/         (9 + WhatTransformerDoes)
    attention-qkv/             (12)
    attention-computation/     (16 + CausalMask, CrossAttention, KVCache, GroupedQueryAttention)
    transformer-block/         (8: 8.2-8.9)
    encoder-decoder-diagrams/  (2: 9.6, 9.7)
    modern-llm-techniques/     (2: 10.3, 10.4)
    vector-foundations/        (11: 11.1-11.11)
    vector-compression/        (7: 11.12-11.18)
    vector-production/         (10: 11.19-11.28)
    vector-systems/            (7: 11.29-11.35; 11.36 lives elsewhere if applicable)
    rag-foundations/           (10: 12.1-12.3, 12.7-12.13)
    rag-ingestion/             (3: 12.4-12.6)
    rag-retrieval/             (8: 12.14-12.21)
    rag-generation/            (9: 12.22-12.30)
    rag-evaluation/            (5: 12.31-12.35)
    rag-production/            (6: 12.36-12.41)
    agent-prompting/           (6: 13.1-13.6)
    agent-tools/               (11: 13.7-13.17)
    agent-loops/               (12: 13.18-13.29)
    multi-agent/               (7: 13.30-13.36)
    agent-evals/               (5: 13.37-13.41)
    agent-production/          (11: 13.42-13.52)
  shared/
    plot.jsx                   (Graph from neural-foundations)
    agent-styles.jsx           (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER)
    agent-helpers.jsx          (HighlightedJson, LIFECYCLE_TRANSITIONS, monoArtifact)
    vector-graphs.jsx          (Triangle, IVFScatter, HNSWLayeredGraph, fmtVec, docCluster, computeFlatEdges)
    vector-helpers.jsx         (COLBERT_MAX_PER_Q, other vector-production constants)
    rag-helpers.jsx            (FormulaBox, CapstoneDecisionCard, TREE_*, BENCH_*, LATENCY_*, COST_*, GD_*)
    llm-training-helpers.jsx   (SCORES, SORTED_SCORES, SORTED_PROBS)
    (other section-specific helper modules as they emerge during extraction)
  config.js                    (gains `file` field per entry; `component` field retained as documentation)
  learn-ai.jsx                 (lookup rewrite -- see Section "Lookup")
  components.jsx               (Box, T, Reveal, SubBtn, Tag, ErrorBoundary -- unchanged location and contents)
  main.jsx                     (unchanged)
  nav-persistence.js           (unchanged)
  search.js                    (unchanged at runtime; reads chunks.json regardless of source layout)
  search-overlay.jsx           (unchanged)
  embedding-cache.js           (unchanged)
  data/                        (chunks.json + cache rebuilt; same shape externally)
  __tests__/
    chapters/                  (NEW: 232 test files mirroring src/chapters/)
      neural-foundations/
        what-is-nn.test.jsx
        ...
      attention-computation/
        why-softmax.test.jsx
        ...
    chapter-test-helpers.js    (NEW: extracted makeCtx + common stubs)
    (existing non-chapter tests untouched: config.test.js, lookup.test.js, components.test.jsx,
     nav-persistence.test.js, svg-descriptions.test.js, build-search-index.test.js,
     chunk-schema.test.js, embed-chunks.test.js, embedding-cache.test.js,
     hnsw-planarity.test.js, learn-ai-prefetch.test.jsx, learn-ai.test.jsx, llm-chunk.test.js,
     manifest.test.js, model-meta.test.js, search-golden.test.js, search-overlay.test.jsx,
     section11-capitalization.test.js, coverage.test.js, check-embeddings.test.js, setup.js)
```

`src/sections/` is **deleted** at the end of the PR.

## Chapter file template

```jsx
// src/chapters/attention-computation/why-softmax.jsx
import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";
// Optional, only if used:
// import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

export default function WhySoftmax(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* body identical to current implementation */}
    </div>
  );
}
```

Rules for chapter files:

- One default export only. The function keeps its original PascalCase name for stack traces, devtools, and grep-ability.
- No exported helpers, no exported constants, no exported sub-components. If something is used by 2+ chapter files, it lives in `src/shared/`. If used by exactly one chapter, it lives module-private inside that chapter file.
- Relative imports use `../../config.js`, `../../components.jsx`, `../../shared/X.jsx` from chapter files (chapter files are two directories deep under `src/`).

## config.js schema

```js
{
  id: "7.4",
  title: "Why Do We Need Softmax?",
  section: 7,
  component: "WhySoftmax",                   // retained, used by config.test.js, docs, search build
  file: "attention-computation/why-softmax"  // NEW: path under src/chapters/ without .jsx extension
}
```

- `file` is mandatory for every chapter (incl. the TOC entry: `file: "table-of-contents/toc"`). The TOC keeps its own folder for layout consistency; flat `src/chapters/toc.jsx` was rejected to keep the chapters tree fully uniform.
- `section` field is unchanged. It controls coloring and progress; it does NOT determine which folder a chapter lives in. A chapter assigned to `section: 3` can have `file: "llm-training/batch-training"`.
- The TOC entry (id `0`) sets `section: 0` and gets `file: "table-of-contents/toc"`.

## Lookup (`learn-ai.jsx`)

Replace the existing `sectionLoaders` dictionary and `sectionCache` Map with a glob-driven lookup:

```jsx
// Map of "./chapters/<file>.jsx" -> lazy loader. Each entry is a separate Vite chunk.
const chapterLoaders = import.meta.glob('./chapters/**/*.jsx');

async function loadChapter(file) {
  const key = `./chapters/${file}.jsx`;
  const loader = chapterLoaders[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default || null;
}

// In the chapter-load useEffect:
useEffect(() => {
  const entry = chapters[ch];
  if (!entry) return;
  let cancelled = false;
  setRenderChapter(null);
  loadChapter(entry.file).then((fn) => {
    if (cancelled) return;
    if (fn) {
      setRenderChapter(() => fn);
    } else if (import.meta.env.DEV) {
      console.error(`[lookup] Failed to resolve chapter "${entry.id}" file "${entry.file}"`);
    }
    // ...existing post-first-load search-prefetch idle code, unchanged
  });
  return () => { cancelled = true; };
}, [ch, startSemanticPoll]);
```

Dev-mode validator (top of file) iterates `chapters` once and asserts each `file` key exists in `chapterLoaders`. The validator currently checks `component`; both checks can run, or the `component` check can be removed in favor of the new one. Decision: **keep both** so existing diagnostics stay informative.

The 13 `Promise.all` cross-section coalescings disappear. Each chapter is its own chunk, fetched on demand.

## Shared helpers (`src/shared/`)

One file per topic. Each file imports only what it needs from `src/components.jsx` and `src/config.js`. No file in `src/shared/` exports a chapter function.

Inventory (refined during execution; this is the starting cut):

| File | Symbols | Origin file |
|------|---------|-------------|
| `plot.jsx` | `Graph` | `neural-foundations.jsx` |
| `agent-styles.jsx` | `SOFT, tintedCard, pill, DIM_BG, DIM_BORDER` | `agent-prompting.jsx` |
| `agent-helpers.jsx` | `HighlightedJson, LIFECYCLE_TRANSITIONS, monoArtifact` | `agent-tools.jsx`, `agent-loops.jsx` |
| `vector-graphs.jsx` | `Triangle, IVFScatter, HNSWLayeredGraph, fmtVec, docCluster, computeFlatEdges` | `vector-foundations.jsx` |
| `vector-helpers.jsx` | `COLBERT_MAX_PER_Q` plus any other vector-production cross-chapter constants | `vector-production.jsx` |
| `rag-helpers.jsx` | `FormulaBox, CapstoneDecisionCard, TREE_*, BENCH_*, LATENCY_*, COST_*, GD_*, GRAG_SUBGRAPH_NODES, METADATA_HIGHLIGHTED` | `rag-foundations.jsx`, `rag-evaluation.jsx`, `rag-retrieval.jsx`, `rag-ingestion.jsx`, `rag-production.jsx`, `rag-generation.jsx` |
| `llm-training-helpers.jsx` | `SCORES, SORTED_SCORES, SORTED_PROBS` | `llm-training.jsx` |

Rule applied during extraction: any const/component/function in a section file that is referenced by 2+ chapter functions in that file (or by any other section file) is moved to a `src/shared/*` module. Symbols used by exactly one chapter stay module-private inside that chapter file. Trivial inline constants stay inline.

The exact `src/shared/` file split may evolve during execution to keep each shared module focused. Any reorganization is internal to `src/shared/`; chapter file behavior is unaffected.

## Tests

- Delete `src/__tests__/sections.test.jsx`.
- Create `src/__tests__/chapter-test-helpers.js` exporting `makeCtx({ overrides } = {})` (currently defined at the top of `sections.test.jsx`, identical signature).
- For each chapter in `config.js`, create `src/__tests__/chapters/<folder>/<chapter>.test.jsx`. Each contains the `describe(...)` block (or unwrapped `it(...)` blocks) that the mega test had for that chapter, with imports updated to the chapter's default export.
- Update `src/__tests__/lookup.test.js`: replace `import * as Section from "../sections/..."` blocks with an `import.meta.glob('../chapters/**/*.jsx', { eager: true })` build of the same lookup shape, then run the same assertions.
- `learn-ai.test.jsx`, `learn-ai-prefetch.test.jsx`, `search-overlay.test.jsx`: update any mocks of `./sections/*.jsx` to mock `./chapters/<file>.jsx` instead. Verify with a grep that no test file references `src/sections/` after refactor.
- `vite.config.js` coverage `include`: replace `"src/sections/**/*.jsx"` with `"src/chapters/**/*.jsx"` and add `"src/shared/**/*.jsx"`.
- Coverage targets unchanged: lines 100%, branches 100% (current is 97.7% effective, threshold 100; the threshold stays at 100).

## Search build (`scripts/build-search-index.mjs`)

```js
// New skeleton (replaces the current section-grouped loop)
for (const ch of chapters) {
  if (!ch.file) continue; // skip TOC if it has no chunks (current behavior preserved via the sectionFile guard)
  const path = join(rootDir, 'src/chapters', `${ch.file}.jsx`);
  const source = readFileSync(path, 'utf-8');
  const hash = contentHash(source);
  if (cache[hash]) {
    // reuse cached chunks for this chapter
    chunksOut.push(...cache[hash]);
  } else {
    const newChunks = await chunkSection({ source, chapter: ch });
    cache[hash] = newChunks;
    chunksOut.push(...newChunks);
  }
}
```

- `chunk-cache.json` shape changes from `{ [sectionFileHash]: { [chapterId]: Chunk[] } }` to `{ [chapterFileHash]: Chunk[] }`.
- The `sectionFile` field on chapter objects is no longer used by the build script; it is replaced by `file`. If `sectionFile` is set elsewhere (e.g., by a wrapper script that calls `runBuild`), update that caller too.
- First post-refactor run rebuilds every chunk (chapter file hashes differ from section file hashes). After that, edits to one chapter invalidate only that chapter's chunks.
- Concurrency limit logic (`LEARN_AI_BUILD_CONCURRENCY`) is preserved.
- `build-search-index.test.js`, `llm-chunk.test.js`, `chunk-schema.test.js`, `embed-chunks.test.js`, `check-embeddings.test.js`, `manifest.test.js` are inspected; any that assert on cache shape or section file paths are updated.
- After refactor, run `npm run search:build` and commit refreshed `src/data/chunks.json` + `src/data/chunk-cache.json`.

## Migration sequence within the PR

Performed in one session by one agent, but ordered so test failures surface progressively:

1. **Add `file` field to every config entry.** Update `src/__tests__/config.test.js` to require it (new validation). Verify: `npm run test src/__tests__/config.test.js` passes.
2. **Create `src/shared/*.jsx` files** with extracted helpers. Existing section files temporarily re-export the same symbols (`export { Graph } from '../shared/plot.jsx'`) so all consumers keep working. Verify: full test suite still green.
3. **Switch lookup in `learn-ai.jsx`** to a dual-mode resolver: try `import.meta.glob('./chapters/**/*.jsx')` first using `entry.file`; on miss, fall back to the old `sectionLoaders` map by `entry.component`. Verify: app renders identically (manual smoke + tests).
4. **For each of the 27 section folder topics**, in any order:
   - Create the `src/chapters/<topic>/` folder.
   - For each chapter belonging to that topic by current `file` field (note: a chapter's topic folder is determined by where its code lives today, not by its `section` number), create the chapter file with the template above. Copy the function body verbatim from the section file.
   - Delete the named export from the old section file once the chapter file exists and tests pass. (Old file stays around for any remaining helpers/exports until those move.)
   - Run the impacted test suite: `npm run test -- <chapter>`.
5. **Generate per-chapter test files** under `src/__tests__/chapters/<folder>/<chapter>.test.jsx`. Each one imports the new chapter file's default export and runs the exact assertions the mega file ran for that chapter. Delete `src/__tests__/sections.test.jsx` once every chapter test has its replacement. Verify: `npm run test` green, coverage 100/100.
6. **Drop the dual-mode lookup**: remove the section-file fallback in `learn-ai.jsx` and the `sectionLoaders` dictionary. Delete `src/sections/` directory.
7. **Update `scripts/build-search-index.mjs`** to per-chapter cache. Run `npm run search:build`. Commit refreshed `chunks.json` and `chunk-cache.json`.
8. **Update `vite.config.js`** coverage include paths.
9. **Update `CLAUDE.md`** mapping tables and project structure tree to point at `src/chapters/<folder>/<chapter>.jsx` instead of `src/sections/<file>.jsx`.
10. **Run final verification gate** (Section "Verification" below).

## Verification

Before declaring done:

- `npm run test` passes; coverage report shows 100% lines, branches at or above current baseline (97.7% effective).
- `npm run lint` clean.
- `npm run build` succeeds; `dist/` size within +/- 5% of pre-refactor (vendor chunk + per-chapter chunks).
- Dev server smoke test: open `localhost:5173/learn-ai/`, navigate from chapter 0 through several sections (TOC -> 1.1 -> 1.5 -> 2.1 -> 7.4 -> 11.7 -> 12.32 -> 13.39), confirm each renders with no console errors. Confirm sub-step navigation, search overlay (Cmd+K), and localStorage restore on reload all work.
- `npm run search:build` succeeds; `src/data/chunks.json` chunk count is within +/- 2% of pre-refactor (chunk IDs may differ if chapter file source differs from section slice; chunk count should be stable).
- A `grep -rn "src/sections/" src/ scripts/` returns no hits.

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Mechanical copy mistakes drop a chapter or wire it to the wrong default export | Step 4 of migration runs the test suite after each chapter is moved; mismatch is caught immediately |
| Helper extraction misses a cross-section consumer | Step 2 temporary re-exports from old section files keep consumers green until each is updated explicitly |
| Vite glob bundles all chapters into one chunk in production | Verify in `npm run build` output that `dist/assets/` contains per-chapter chunks (lazy=true is the default for `import.meta.glob`) |
| Search index churn invalidates the entire LLM-built chunk cache once | Accepted one-time cost. First post-refactor `npm run search:build` rebuilds. Cost: same as a from-scratch index build today. |
| Test split mis-copies a `describe` block | Per-chapter test passes only if its specific assertions pass; cross-chapter regressions caught by the full suite still running |
| Default-vs-named export change breaks an external consumer | Only consumer is `learn-ai.jsx` lookup and tests; both updated in the same PR |

## Out of scope (explicit)

- Adding new chapters, rewriting content, regenerating visuals.
- Restyling `src/shared/` over time -- internal reorganization is allowed but not specified here.
- Migrating to TypeScript, adding Storybook, or any tooling beyond what's needed for this refactor.
- Touching the embeddings model, ONNX assets under `public/models/`, or `embed-chunks.mjs` (other than passing-through new chapter ids if its loader needs updating).
- Splitting `src/components.jsx` or moving it. It stays at `src/components.jsx`.

## Open items deferred to writing-plans

- Exact final list of `src/shared/*.jsx` modules. Starting cut is defined above; the implementation plan will refine after a pass over each section file's private helpers.
- Order of section folder migrations in step 4 of the migration sequence. Any order works because step 2 has already extracted helpers to `src/shared/`. The implementation plan picks an order that keeps each commit small and reviewable (e.g., smallest sections first to validate the mechanical pattern before tackling neural-foundations and attention-computation).
- Whether to keep the `component` field in `config.js` permanently or remove it once all consumers point at `file`. Defaulted to **keep** for this refactor; removal can be a follow-up.
