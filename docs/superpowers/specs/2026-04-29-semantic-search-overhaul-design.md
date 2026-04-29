# Semantic Search Overhaul - Design Spec

**Date:** 2026-04-29
**Status:** Approved (pending user spec review)
**Author:** Brainstorm session, locked decisions

## Goal

Replace the current DOM-scrape based search with an LLM-authored, multi-vector retrieval pipeline. Maximize semantic search accuracy under a fully API-independent runtime. Make the system future-proof: adding chapters, refactoring UI, or swapping embedding models must require no manual reindexing.

## Why

Current search is "not at all accurate" because:
1. **Section 11 (36 vector-database chapters) is entirely missing from the index.** `scripts/extract-content.test.jsx` does not import any of `vector-foundations`, `vector-compression`, `vector-production`, `vector-systems`. ~33% of chapter content invisible to search.
2. **DOM-scraped chunks mash text without spaces** ("Pattern Recognition MachinesYou've used AI"), losing word boundaries that both BM25 and the embedding model rely on.
3. **"Continue" button text bleeds into every chunk**, polluting embeddings.
4. **Embedding script truncates each chunk at 512 chars**; chunks are up to 2594 chars. Long-form content silently dropped.
5. **Only the default render state is captured.** `bankIdx`, `expanded`, `hovered` interactive content never reaches the index.
6. **`Xenova/all-MiniLM-L6-v2` q8** is a small, general-purpose, further-quantized model. Weak on technical AI content.
7. **No query expansion / no synthetic query coverage.** A user typing "why divide by sqrt of d_k" must phrase-match the corpus exactly.

## Non-Goals

- Reranker (cross-encoder). Excluded; LLM-authored synthetic queries substitute for rerank quality.
- Server-side embedding API at runtime. Excluded; runtime must be fully local.
- Multi-language support. Out of scope.

## Locked Decisions

| Decision | Choice |
|----------|--------|
| Build-time chunking | Claude API (Anthropic SDK) on pre-commit |
| Cache strategy | Hash each section file; reuse cached chunks on hit |
| Embedding model | `Xenova/bge-base-en-v1.5` q4 (~55 MB, 768d) |
| Stored vectors | int8 quantized, multi-vector per chunk |
| Retrieval | BM25 + multi-vector cosine + RRF; no reranker |
| Browser load | Silent idle pre-fetch; invisible upgrade from text → semantic |
| Runtime API dependency | None. Everything local in browser after first load. |

## Architecture

### High-Level Flow

```
git commit
   |
   v
.githooks/pre-commit
   |---> npm run search:build
            |---> scripts/build-search-index.mjs
            |        - For each section file changed, hash + LLM-chunk via Claude
            |        - Reuse cached chunks for unchanged files
            |        - Output: src/data/chunks.json + src/data/chunk-cache.json
            |---> scripts/embed-chunks.mjs
            |        - Diff chunks against last embeddings manifest
            |        - Embed only new/changed chunk representations
            |        - Output: src/data/embeddings.bin (int8) + src/data/embeddings-manifest.json
            |---> git add src/data/
   |
   v
git commit succeeds; chunks + embeddings shipped with code
```

### Runtime Flow

```
page first paint  (~180 KB main bundle, no search code)
   |
   v
section + chapter render
   |
   v
window.load fires
   |
   v
requestIdleCallback (silent, in background)
   |---> import('./data/chunks.json')          ← ~600 KB, builds MiniSearch index
   |---> import('./data/embeddings.bin')        ← ~14 MB int8 vectors
   |---> import('@huggingface/transformers')   ← lazy chunk
   |---> pipeline('feature-extraction', 'bge-base q4')  ← ~55 MB from HF CDN
                                                              + ~22 MB ort-wasm
   |
   v
all cached in IndexedDB by checksum; subsequent visits = 0 download
   |
   v
user opens overlay
   |---> if model + vectors not yet loaded: instant text-only results,
         no spinner, results silently swap to hybrid when ready
   |---> if ready: full hybrid pipeline (BM25 + multi-vector + RRF)
```

## Components

### 1. Build-Time Pipeline

**`scripts/build-search-index.mjs`** (replaces `scripts/extract-content.test.jsx`)

- No DOM rendering. Reads section file source directly as text.
- Group chapters by their section file (per the lookup map). For each section file:
  1. Compute SHA-256 of the source file.
  2. If hash matches `chunk-cache.json` entry, reuse cached chunks (entire `{chapterId: chunks[]}` map for that file). No LLM call.
  3. On miss, call Claude once with the full section source + the list of chapters in that file + their metadata + relevant SVG descriptions. Claude returns a single JSON object: `{ "<chapterId>": Chunk[], ... }` covering all chapters in the file.
  4. Write `(hash → {chapterId: chunks[]})` back into `chunk-cache.json`.
- Note: Claude reads the JSX source directly. All `<text>` elements, labels, numbers, code blocks, formulas, and prop strings inside diagrams are visible. SVG descriptions from `src/data/svg-descriptions.json` are appended for diagram chunks. No content (visible or interactive-state-only) is hidden because the source is the index input, not the rendered DOM.
- Merge all section-file chunk maps into a single ordered `chunks.json` (sorted by chapterId, then sub).
- Validate every chunk against the schema (see Chunk Schema below). Fail commit on schema violation.

**`scripts/llm-chunk.mjs`**

- Thin wrapper around the Anthropic SDK.
- Reads `ANTHROPIC_API_KEY` from environment. If missing, fail with clear message.
- Default model: `claude-sonnet-4-6`. Override via env var `LEARN_AI_CHUNK_MODEL`.
- Uses prompt caching (`cache_control` on the stable preamble: instructions + schema + examples) to keep per-chapter cost minimal.
- Structured-output enforced via tool-use schema (Anthropic's tool-call mechanism producing JSON conforming to the chunk schema).
- Retries on rate-limit; aborts on auth or schema-validation failure.
- Per-chapter cost: ~3 K input tokens × Sonnet input rate ≈ $0.01. First full build ~$1; subsequent commits typically $0-0.05.

**`scripts/embed-chunks.mjs`** (replaces `scripts/generate-embeddings.mjs`)

- Loads `chunks.json`. For each chunk, generates representation strings:
  - `text` (canonical content prose)
  - `summary` (one-sentence plain-English summary)
  - each entry of `queries[]` (15-20 synthetic queries)
  - joined `terms` (key terms + synonyms, single string)
- Each representation gets its own vector. Each vector tagged with `chunk_id` and `repr_kind`.
- Hash each `(chunk_id, repr_kind, content)` tuple. Diff against `embeddings-manifest.json`. Only embed new/changed reprs.
- Embedding model: **`bge-base-en-v1.5` q4 ONNX, the exact same artifact the browser uses.** Loaded in Node via the same `@huggingface/transformers` package. This guarantees query-time and build-time embeddings live in identical vector space; no drift, no mismatch from different quantization levels.
- Each vector quantized to int8 with per-vector scale factor stored alongside (output, not the model).
- Output:
  - `src/data/embeddings.bin`: contiguous Int8Array of all vectors, plus per-vector scales.
  - `src/data/embeddings-manifest.json`: `[{ chunkId, reprKind, vectorIndex, scale }]` and `{ dim: 768, count: N, modelChecksum: "..." }`.

**`scripts/check-embeddings.mjs`** (kept, updated)

- Verifies `embeddings.bin` count matches manifest count and all chunk IDs covered.
- Run at end of pre-commit; fail commit on inconsistency.

**`scripts/quantize-model.mjs`**

- One-shot script. Fetches `Xenova/bge-base-en-v1.5` ONNX, runs ONNX-runtime quantization to q4, writes `public/models/bge-base-en-v1.5-q4/` (model files + tokenizer).
- Run manually when initially adding the model and when upgrading. Output is committed.
- transformers.js is configured to load from this local path so the browser fetches it from the app's own origin (cached, deterministic) rather than HuggingFace CDN.

**Updated `.githooks/pre-commit`**

- Detects whether any file in `src/sections/`, `src/config.js`, or `src/data/svg-descriptions.json` is staged.
- If yes: `npm run search:build` (which runs both build-search-index + embed-chunks). Stage outputs.
- If no: skip rebuild.
- Existing flow (extract → embed → check → stage) replaced; new flow has the same shape but stronger primitives.

### 2. Chunk Schema

```typescript
type Chunk = {
  id: string;                    // sha256(chapterId + sub + kind + textHash), stable across runs
  chapterId: string;             // "7.4"
  chapterTitle: string;          // "Why Do We Need Softmax?"
  section: number;               // 7
  sectionName: string;           // "Attention - The Full Computation"
  sub: number;                   // 0..N for sub-step, -1 for chapter-level summary, -2 for diagram
  kind: "concept" | "formula" | "example" | "diagram" | "summary";
  text: string;                  // canonical content prose (Claude-cleaned, no UI noise)
  summary: string;               // one-sentence plain-English summary
  queries: string[];             // 15-20 synthetic user queries this chunk answers
  terms: string[];               // key terms + synonyms
};
```

A chapter typically yields ~6-12 chunks (one per sub-step + a chapter-level summary + per-diagram chunks where SVG descriptions exist).

### 3. Embeddings Format

```typescript
// embeddings-manifest.json
type Manifest = {
  modelChecksum: string;     // sha256 of model files; changes invalidate IndexedDB cache
  dim: 768;
  count: number;             // total vector count
  vectors: Array<{
    chunkId: string;
    reprKind: "text" | "summary" | "query" | "terms";
    reprIndex: number;       // for queries: which query (0..N); 0 for others
    vectorIndex: number;     // 0..count-1; byte offset into embeddings.bin = vectorIndex * dim
    scale: number;           // dequant: float[i] = int8[i] * scale
  }>;
};

// embeddings.bin layout
//   [int8 vector 0 (768 bytes)]
//   [int8 vector 1 (768 bytes)]
//   ...
//   [int8 vector N-1]
// Total: count * 768 bytes.
```

For ~1k chunks × ~18 reprs/chunk = ~18 K vectors × 768 B = ~13.8 MB. Gzip on Vite serve → ~5-7 MB on the wire.

### 4. Browser Runtime

**`src/search.js`** (rewritten)

- New API:
  - `prefetchSearch()` — kicked off from `window.load` + `requestIdleCallback`. Loads chunks.json → builds MiniSearch → loads embeddings.bin → loads transformers.js → pipeline. All silent.
  - `search(query, opts)` — returns ranked results; falls back to text-only if embeddings/model not ready.
  - `searchText(query, opts)` — instant text-only (kept).
  - `getSearchStatus()` — kept; UI uses sparingly.
- int8 dequant on cosine path: `dot += (q[i] * v[i] * scale) / (qScale * vScale)` etc. Query vector itself stored as float (single vector, no need to quantize).
- Multi-vector retrieval: per chunk, take **max-sim** across all its representation vectors. Top-30 chunks by max-sim.
- BM25 over `text + summary + terms + chapterTitle` (MiniSearch fields). Top-30 chunks.
- RRF merge BM25 + vector top-30; dedupe by `chapterId + sub`; return top-N.

**`src/embedding-cache.js`** (extended)

- Caches `embeddings.bin` (Uint8Array) + manifest by `modelChecksum`.
- Skips download on cache hit; same pattern as today, just byte-array.

**`src/learn-ai.jsx`** (load trigger updated)

```js
useEffect(() => {
  const trigger = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => getSearchModule().then(m => m.prefetchSearch()), { timeout: 3000 });
    } else {
      setTimeout(() => getSearchModule().then(m => m.prefetchSearch()), 1000);
    }
  };
  if (document.readyState === "complete") trigger();
  else window.addEventListener("load", trigger, { once: true });
}, []);
```

**`src/search-overlay.jsx`**

- Drop the visible "Loading semantic model..." status text. Status dot stays.
- Remove the "Searching..." label flicker by always showing text results immediately, then swapping to hybrid when ready (no intermediate empty/loading state).
- Otherwise unchanged.

### 5. Files Changed

| Path | Action |
|------|--------|
| `scripts/extract-content.test.jsx` | Delete |
| `scripts/generate-embeddings.mjs` | Delete |
| `scripts/build-search-index.mjs` | New |
| `scripts/llm-chunk.mjs` | New |
| `scripts/embed-chunks.mjs` | New |
| `scripts/quantize-model.mjs` | New |
| `scripts/check-embeddings.mjs` | Update for new manifest format |
| `.githooks/pre-commit` | Update to call new scripts |
| `package.json` | Add `@anthropic-ai/sdk`; replace `search:extract` + `search:embed` with `search:build`; keep `search:check` |
| `src/search.js` | Rewrite for multi-vector + int8 + new manifest |
| `src/embedding-cache.js` | Extend for byte-array caching |
| `src/search-overlay.jsx` | Remove visible loading text; idle pre-fetch trigger lives in learn-ai.jsx |
| `src/learn-ai.jsx` | Replace eager `firstLoadDone`-gated init with `window.load` + idle trigger |
| `src/data/chunks.json` | Regenerated by new pipeline |
| `src/data/chunk-cache.json` | New: hash → chunk array cache |
| `src/data/embeddings.bin` | New (replaces embeddings.json) |
| `src/data/embeddings-manifest.json` | New (replaces embeddings-checksum.json) |
| `src/data/embeddings.json` | Delete |
| `src/data/embeddings-checksum.json` | Delete |
| `public/models/bge-base-en-v1.5-q4/` | New committed model files |

### 6. Tests

Per `CLAUDE.md` TDD mandate. All in `src/__tests__/`.

| Test | Coverage |
|------|----------|
| `chunk-schema.test.js` | Every chunk in `chunks.json` validates against schema; `id` unique; `queries.length >= 5`; `terms.length >= 1` |
| `coverage.test.js` | Every chapter in `config.js` has at least one chunk; `chapterId`s match config |
| `manifest.test.js` | Every chunk id in `chunks.json` has at least one entry in manifest; every manifest entry references a real chunk; `dim === 768`; vector count matches |
| `search.test.js` (new) | Mocked vectors. Golden queries return expected `chapterId`s in top 5 (e.g., "why scale by sqrt dk" → 7.5; "HNSW" → 11.7-11.10; "RoPE" → 5.9). 10-20 golden cases. |
| `embedding-cache.test.js` (extend) | Byte-array caching round-trips correctly |
| `search-overlay.test.jsx` (extend) | No visible loading-text element; results swap silently |
| `llm-chunk.test.js` (new) | Mocked Anthropic SDK; verifies prompt structure, schema enforcement, cache reuse |

Coverage must not drop. New code adds tests; deleted code's tests removed.

### 7. Cost / Cache Behavior

| Event | Cost |
|-------|------|
| First full rebuild (one-time) | ~$1 (Sonnet 4.6, ~3K tokens × ~106 chapters) |
| Per-commit (typical: 1 chapter changed) | ~$0.01 |
| Per-commit (no chapter changes) | $0 (cache hit on every file) |
| User first visit | ~95 MB background download (chunks 600 KB + vectors 14 MB + transformers.js 900 KB + ort-wasm 22 MB + bge-base q4 55 MB + tokenizer ~3 MB) |
| User subsequent visits | 0 MB (IndexedDB cache hit by `modelChecksum`) |

### 8. Migration / Rollout

Single PR (this is `main`-only):

1. Implement new scripts + tests.
2. Run `npm run search:build` locally, commit generated `chunks.json` + `embeddings.bin`.
3. Manual smoke test: open dev server, page loads fast, open search after a few seconds, semantic results work for a handful of golden queries.
4. Delete obsolete files.
5. Push.

If something is wrong post-deploy, the old hook + scripts can be temporarily restored by reverting the PR. The old `embeddings.json` no longer exists in `main`, so a true rollback requires git revert.

## Failure Modes

| Failure | Behavior |
|---------|----------|
| `ANTHROPIC_API_KEY` missing on commit | Pre-commit fails with clear message |
| Claude returns invalid JSON / schema violation | Pre-commit fails; user re-runs after fix |
| `chunks.json` exists but no API key on a commit that touches no section files | Cache hit on all files; no LLM call needed; commit proceeds |
| `embeddings.bin` corrupt | `check-embeddings.mjs` fails commit |
| Model fetch fails at runtime | Falls back to text-only search silently; status dot indicates non-semantic mode |
| `requestIdleCallback` not supported (older Safari) | `setTimeout(..., 1000)` fallback |
| User opens overlay before load complete | Text-only results immediately; results swap to hybrid when ready, no spinner |

## Future-Proof Properties

- **Adding a chapter:** write JSX, commit. Pre-commit hashes the file, calls Claude on it only, re-embeds only its chunks. Zero manual indexing.
- **Editing a chapter:** same — only the changed file is re-embedded.
- **Renaming or refactoring UI:** zero impact (no DOM scrape).
- **Swapping embedding model:** re-run `quantize-model.mjs` + `embed-chunks.mjs --force-rebuild`. Manifest's `modelChecksum` invalidates user IndexedDB caches automatically.
- **Swapping LLM provider:** replace `llm-chunk.mjs` body. Schema unchanged.
- **Swapping retrieval algorithm:** all logic isolated in `src/search.js`.
- **Increasing chunk richness (more synthetic queries):** raise the prompt's target count; only changed chapters re-embed on next commit.
