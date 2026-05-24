# Section-Parent Restructure + Super-Sections — Design Spec

**Date:** 2026-05-19
**Status:** Approved, ready for implementation plan
**Scope:** Single PR

## Problem

Two coupled pains in the current config:

1. **TOC overwhelm.** After splitting mega-sections into 28, the TOC shows a flat list of 28 rows. Hard to scan, no high-level grouping.
2. **Manual renumbering.** Inserting a new chapter between `7.2` and `7.3` requires renumbering every later ID by hand. Chapter ID is stored on each chapter entry in `config.js`.

Both are config-shape problems. Solve together in one PR.

## Goals

- Reduce TOC cognitive load by grouping the 28 sections under 6 narrative super-sections.
- Make reordering / inserting / moving chapters a one-line config edit. No manual ID renumbering.
- Decouple search index from chapter IDs so reorder costs zero re-embed.
- Preserve all current chapter IDs (`1.x..28.x`) and section colors so no external metadata churns (llms.txt, JSON-LD, search display, prose cross-references all stay valid).

## Non-Goals

- Renaming chapter IDs to three-level format (`C.7.4`). Out of scope.
- Changing the per-section progress bar in `learn-ai.jsx`. Stays per-section.
- Changing chapter files. They stay pure dumb components — they have never known their section/ID.
- Persisting TOC expand state across sessions. Stays per-render.

## Design

### Section 1 — New config.js shape

`config.js` flips from "flat chapter list with section pointer" to "section owns ordered chapter list." Chapter ID auto-derives from position. A new top-level `superSections` array groups sections.

```js
export const sections = [
  {
    num: 1,
    name: "Neural Networks - The Mechanics",
    color: "#ff6b6b",
    desc: "Neuron, layer, weights/biases, ReLU, forward pass",
    super: "A",
    chapters: [
      { slug: "single-neuron",  file: "neural-network/single-neuron",  title: "...", component: "SingleNeuron" },
      { slug: "neural-layer",   file: "neural-network/neural-layer",   title: "...", component: "NeuralLayer"  },
      // ...
    ],
  },
  // ... sections 2..28
];

export const superSections = [
  { id: "A", name: "Foundations of Deep Learning",         sections: [1,2,3,4],              color: "#ff6b6b" },
  { id: "B", name: "The Rise of LLMs",                     sections: [5,6],                  color: "#00b8d4" },
  { id: "C", name: "The Transformer Era",                  sections: [7,8,9,10,11,12,13,14], color: "#a78bfa" },
  { id: "D", name: "Vector Databases at Depth",            sections: [15,16,17,18],          color: "#f06292" },
  { id: "E", name: "Retrieval-Augmented Generation (RAG)", sections: [19,20,21,22,23],       color: "#9ccc65" },
  { id: "F", name: "Agentic AI",                           sections: [24,25,26,27,28],       color: "#4fc3f7" },
];
```

#### ID derivation

Walk sections in order. For each section, walk its `chapters` array. The chapter's display ID is `${section.num}.${1 + position_in_section_chapters}`. IDs are never stored in source — they exist only on the derived `chapters` export.

#### Slug

Each chapter entry has a stable `slug` field. It is the unique identity used by the search index and by `nav-persistence`'s fingerprint. Source = the full `file` path (e.g. `"attention-computation/why-softmax"`) — guaranteed unique because two chapters cannot share the same file path. (Bare filenames are not unique: today `agentic-rag` and `llm-as-judge` each appear under two different folders.) Slugs never change casually — renaming a slug is treated like deleting and re-adding a chapter (forces re-embed for that one entry).

Practically: the `slug` field can be omitted from each chapter entry in source — if absent, the derived `chapters` export computes `slug = chapter.file`. This keeps source compact and the slug always in sync with the file path. An explicit `slug` field is still supported for the rare case where a chapter file is moved on disk but should keep its old slug (preserves search-index continuity).

#### Section 0 / Overview / TOC

Section 0 (Overview) keeps its current special-case handling. `chapters[0]` (the TOC chapter) keeps its current shape. They are not part of `sections` and not part of any super-section.

#### Back-compat derived exports

To avoid touching every call site in one PR, compute and export the old shapes from the new source:

```js
export const chapters       = flattenWithDerivedIds(sections);
// [{id: "1.1", slug, file, title, section, component}, ...]

export const sectionNames   = Object.fromEntries(sections.map(s => [s.num, s.name]));
export const sectionColors  = Object.fromEntries(sections.map(s => [s.num, s.color]));
```

These derived exports keep the existing public surface of `config.js` intact. Consumers like `learn-ai.jsx`, `search-overlay.jsx`, `nav-persistence.js`, `build-search-index.mjs`, the TOC component, and existing tests need only narrow targeted edits (slug-aware lookups, super-section rendering).

#### Validation (dev only)

At module load, validate:
- All slugs unique across all sections.
- Every section has a `super` field pointing to a valid `superSections[].id`.
- Each `superSections[].sections` list exactly matches the set of sections whose `super` field equals that super-section's `id`.
- Section nums are unique and contiguous starting at 1.
- Every chapter has a `file` and `component` and `title`.

Throw on violation in dev. Production silently degrades (skip validation).

### Section 2 — Slug-based search index

The chunk hash currently bakes `chapterId` ("7.4") into the chunk ID. With auto-derived IDs, any reorder flips every hash → embeddings.bin invalidates. Replace `chapterId` with stable `slug` in the hash.

#### Hash change

```js
// scripts/build-search-index.mjs

// before
function chunkId(chapterId, sub, kind, text) {
  return sha256_16(`${chapterId}|${sub}|${kind}|${sha256_16(text)}`);
}

// after
function chunkId(chapterSlug, sub, kind, text) {
  return sha256_16(`${chapterSlug}|${sub}|${kind}|${sha256_16(text)}`);
}
```

`sha256_16` (16-hex truncated SHA-256) is kept. Reasons:
- Content-addressable: same chunk text → same ID across rebuilds. Chunker hiccup that reshuffles wording doesn't invalidate unchanged chunks.
- Compact: 16 hex per ID vs ~30-50 chars for `slug-sub-kind-index` tuple format. Smaller `chunks.json` shipped to client.
- 64-bit collision space is safe for ~thousands of chunks.

#### chunks.json shape

```json
// before
{ "id": "...", "chapterId": "7.4", "chapterTitle": "...", "section": 7, "sectionName": "...", "sub": 0, "kind": "...", "text": "...", ... }

// after
{ "id": "...", "chapterSlug": "why-softmax", "chapterTitle": "...", "sub": 0, "kind": "...", "text": "...", ... }
```

Removed: `chapterId`, `section`, `sectionName`. All three derive from the current config at search-render time via `chapters.find(c => c.slug === r.chapterSlug)`.

`chapterTitle` is kept for two reasons:
- Search results render before the React app fully resolves the chapter from config — a stamped title avoids a blank flash.
- The MiniSearch index uses `chapterTitle` as a `storeField`.

If the chapter title is renamed, the stale title in chunks.json is shown until next `search:build`. Acceptable.

#### search-overlay.jsx changes

```js
// click handler
const handleSelect = (slug, sub) => {
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx < 0) return;          // chapter removed since index built — skip silently
  goTo(idx, sub);
};

// result row render
const ch = chapters.find(c => c.slug === r.chapterSlug);
if (!ch) return null;            // skip stale entry
// show ch.id (current derived "7.4"), ch.title, sectionNames[ch.section]
```

#### nav-persistence.js fingerprint

```js
// before
function fingerprint(chapters) {
  return chapters.map((c) => c.id).join(",");
}

// after
function fingerprint(chapters) {
  return chapters.map((c) => c.slug).join(",");
}
```

Reorder no longer wipes saved nav. Add / remove / rename-slug still invalidates (correct).

#### build-search-index.mjs

- Reads new section-parent config. Flattens to chapter list with `slug`, derived `id`, `title`, `file`.
- `chunkId` uses slug. `chunkSection({ chapters: [{id, title, ...}] })` LLM call still passes derived `id` and `title` because the LLM chunker uses them for context — does not affect the chunk ID.
- Output sort key: `(section.num, position_in_section, sub, kind)` — deterministic git diff.
- chunk-cache key unchanged (already keyed by chapter file content hash via `contentHash`).

#### One-time regen after merge

1. `npm run search:build` — chunk-cache hits everywhere (chapter content untouched). Zero LLM calls.
2. `npm run embed:chunks` — embeddings.bin rewrites because every chunk ID changed once. One full embedding pass.
3. Commit regenerated `chunks.json`, `embeddings.bin`, `chunk-cache.json`, `embeddings-manifest.json` alongside the code changes.

After this one-time pass: reorder / rename section / insert chapter ⇒ zero re-embed.

#### Edge cases

- **Slug collision** → validation throws in dev at module load.
- **Slug deleted** (chapter removed since index built) → search overlay filters out stale row at render (`if (!ch) return null`). No crash.
- **Slug renamed** → counts as new chapter; needs re-chunk + re-embed for that one entry. Documented in CLAUDE.md as "don't rename slugs casually."

### Section 3 — TOC super-section UI

Two-level accordion. Three rendered tiers: super-section → section → chapter.

#### Default state

All 6 super-sections collapsed on first render. Section rows inside each super-section also collapsed until tapped.

#### Auto-open-current

When the user opens the TOC and a current chapter exists, auto-expand the super-section + section containing that chapter. The `expanded` state in `ctx` becomes:

```js
expanded = { super: "C" | null, section: 10 | null }
```

(Replaces today's `expanded: number | null`.)

#### Visual sketch — collapsed

```
[A]  Foundations of Deep Learning              4 sections · 18 chapters  ▼
[B]  The Rise of LLMs                          2 sections ·  9 chapters  ▼
[C]  The Transformer Era                       8 sections · 32 chapters  ▼
[D]  Vector Databases at Depth                 4 sections · 14 chapters  ▼
[E]  Retrieval-Augmented Generation (RAG)      5 sections · 18 chapters  ▼
[F]  Agentic AI                                5 sections · 19 chapters  ▼
```

#### Visual sketch — one super-section expanded

```
[C]  The Transformer Era                                                  ▲
       7  The Road to Transformers                 5 chapters  ▼
       8  Transformer Input Pipeline               4 chapters  ▼
       9  Attention - Understanding Q, K, V        3 chapters  ▼
      10  Computing Attention                      6 chapters  ▼
      ...
[D]  Vector Databases at Depth                  4 sections · 14 chapters  ▼
```

#### Visual sketch — one section drilled into

```
[C]  The Transformer Era                                                  ▲
       7  The Road to Transformers                 5 chapters  ▼
       8  Transformer Input Pipeline                              ▲
              8.1  Architecture overview
              8.2  Embeddings
              8.3  Positional encoding
              8.4  Putting it together
       9  Attention - Understanding Q, K, V        3 chapters  ▼
       ...
```

#### Color & badge

- Super-section row badge `[A]..[F]` uses the **super-section color**.
- Super-section row tint / border at low alpha (`${color}15` / `${color}35` when open).
- Section rows inside keep **their existing per-section colors** (preserves today's recognisability).
- Chapter row hover tint uses parent section color (today's behavior).

#### Counts

- Super-section: `N sections · M chapters` (M = sum of chapter counts across its sections).
- Section: `M chapters` (today's behavior).

#### Progress bar in learn-ai.jsx

Unchanged. Stays per-section. Granularity preserved — super-section grouping is TOC-only.

#### `expanded` state in ctx

Shape becomes `{ super, section } | { super: null, section: null }`. All consumers (TOC component, anywhere else that reads `expanded`) updated to the new shape. Currently only `toc.jsx` reads it.

### Visual rules conformance (CLAUDE.md)

- Titles inside the TOC Box use `<T center>` (rule already followed by existing TOC).
- First letter of every visible text fragment is capitalized — applies to new super-section names (already capitalized) and any new diagram-box-style labels.
- No em-dashes anywhere in the new strings (note "Retrieval-Augmented Generation" uses a hyphen, not an em-dash).
- New SVG elements: none introduced in this PR. No new svg-descriptions.json entries needed.

### Discoverability sync (CLAUDE.md rules)

This PR changes the config shape but does **not** change:
- Chapter IDs (still `1.x..28.x`).
- Section names or section count (still 28).
- Section numbers.
- Site title, description, author.

Therefore the following stay untouched:
- `public/llms.txt` — section names unchanged.
- `index.html` JSON-LD `teaches` — chapter list unchanged.
- `public/og.png`, favicons — unchanged.
- `public/sitemap.xml` — unchanged.

The PR is invisible to crawlers and external systems. No re-indexing request needed.

## Migration plan (inside the PR)

1. **Convert `config.js`.** Group current `chapters` array entries by their `section` field. Build the new `sections = [...]` shape with each chapter as `{slug, file, title, component}`. Slug = last path segment of `file`. Add `super: "A".."F"` to each section. Add `superSections = [...]`. Add derived `chapters` / `sectionNames` / `sectionColors` exports.
2. **Add validation** for unique slugs and super-section membership.
3. **Update `nav-persistence.js`** fingerprint to slug-based.
4. **Update `scripts/build-search-index.mjs`** to consume new config shape and switch `chunkId` to slug.
5. **Update `chunks.json` writers** to emit `chapterSlug` instead of `chapterId` / `section` / `sectionName`.
6. **Update `search-overlay.jsx`** lookups to use `slug`.
7. **Update `toc.jsx`** for two-level accordion + auto-open-current.
8. **Update `learn-ai.jsx`** to read `expanded.section` (the only `expanded` consumer outside TOC, if any).
9. **Update tests.** Per-chapter tests are untouched (chapter files don't change). `config.test.js`, `toc.test.jsx`, `nav-persistence.test.js`, `search.test.js`, `search-overlay.test.jsx`, `build-search-index.test.js` get targeted updates.
10. **Regen search index.** Run `npm run search:build && npm run embed:chunks`. Commit regenerated files.
11. **Verify.** `npm run test`, `npm run lint`, `npm run build`. Coverage must still be 100% on the gated paths.

## Acceptance criteria

- `config.js` exports `sections`, `superSections`, plus derived `chapters` / `sectionNames` / `sectionColors`. Validation throws in dev on inconsistency.
- Adding a new chapter at any position requires editing exactly one section's `chapters` array. No ID renumbering anywhere else in source.
- Reordering chapters inside a section / moving a chapter to a different section requires no edit outside `config.js`.
- `nav-persistence` fingerprint is slug-based. Reorder no longer wipes saved nav.
- `chunks.json` carries `chapterSlug` per chunk. No `chapterId` / `section` / `sectionName` fields per chunk.
- `chunkId` is computed from `chapterSlug`. Reorder a chapter → its chunk IDs unchanged.
- `embeddings.bin` is regenerated once during this PR. After the PR, reorders do not require re-embed.
- TOC renders 6 super-section rows. Tap expands to section rows. Tap section expands to chapters. Auto-opens super + section of current chapter on TOC visit.
- Super-section rows show `[A]..[F]` badge in super-section color. Section rows keep their existing colors.
- Progress bar in `learn-ai.jsx` still shows per-section progress.
- Chapter IDs visible in search results, prose, llms.txt, JSON-LD stay as `1.x..28.x`.
- `npm run test`, `npm run lint`, `npm run build` all pass. 100% coverage on gated paths.

## Risk register

| Risk | Mitigation |
|---|---|
| Slug collision after migration | Validation throws in dev at module load. Migration script asserts uniqueness. |
| Stale chunks.json after merge before regen | Regen + commit done as part of the same PR. No interim state. |
| Embedding pass cost | Single one-time pass over ~thousands of chunks. Acceptable. |
| Forgotten consumer of old `chapter.id` field | Derived `chapters` export keeps the shape. Grep for `c.id`, `ch.id`, `chapter.id`, `r.chapterId` covered in migration step 6. |
| `expanded` state shape change breaks tests | `toc.test.jsx` is the only consumer. Update in same PR. |
| Coverage gate dip during refactor | Per-chapter test files untouched. Targeted updates to a small set of test files. Coverage stays at 100%. |

## Files touched

- `src/config.js` (rewrite shape, add `superSections`, add validation, keep derived exports)
- `src/learn-ai.jsx` (read `expanded.section` if today's `expanded` is consumed there; otherwise untouched)
- `src/chapters/table-of-contents/toc.jsx` (two-level accordion, auto-open-current, super-section rendering)
- `src/nav-persistence.js` (slug-based fingerprint)
- `src/search-overlay.jsx` (slug lookup)
- `scripts/build-search-index.mjs` (consume new config, slug-based chunkId, emit `chapterSlug`)
- `src/data/chunks.json` (regenerated)
- `src/data/embeddings.bin` (regenerated)
- `src/data/chunk-cache.json` (regenerated — content keys unchanged, but a fresh write is harmless)
- `src/data/embeddings-manifest.json` (regenerated)
- `CLAUDE.md` (update "How To: Add a New Chapter" and "How To: Reorder Chapters" sections to reflect new shape)
- Tests: `src/__tests__/config.test.js`, `src/__tests__/chapters/table-of-contents/toc.test.jsx`, `src/__tests__/nav-persistence.test.js`, `src/__tests__/search.test.js`, `src/__tests__/search-overlay.test.jsx`, `src/__tests__/build-search-index.test.js`

## Out of scope (explicit)

- Renumbering chapter IDs to three-level format.
- Persisting TOC expand state.
- Changing the per-section progress bar.
- Touching individual chapter files in `src/chapters/`.
- Updating llms.txt, JSON-LD, sitemap, og.png.
