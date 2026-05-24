# Deep-linkable URLs - Design

**Date:** 2026-05-20
**Status:** Draft for review

## Goal

Make every visible navigation state shareable via URL. Visiting a shared URL
opens the app at the exact chapter, sub-step, or Table-of-Contents expansion
shown when the link was copied.

Today the app keeps `ch` (chapter index) and `sub` (sub-step) in React state
and mirrors them only to `localStorage`. The URL stays at `/learn-ai/`
regardless of where the learner is. There is no way to share a link that
points to "chapter 7.4, sub-step 3" or to "Super C with Section 9 expanded
on the TOC".

The new behavior:

- URL reflects the current view at all times
- All updates use `history.replaceState` - no history entries are added; the
  browser's back button continues to behave as if the app were a single page
- URL is the source of truth on load
- `localStorage` is kept as a fallback: a bare `/learn-ai/` redirects to the
  last saved position (via `replaceState`) if one exists

## URL scheme

```
/learn-ai/                                         TOC, all collapsed
/learn-ai/<super-slug>                             TOC, super open
/learn-ai/<super-slug>/<section-slug>              TOC, super + section open
/learn-ai/<topic>/<chapter>                        Chapter, sub = 0
/learn-ai/<topic>/<chapter>/<sub>                  Chapter, sub > 0
```

`<topic>/<chapter>` is the existing chapter `slug` field from `config.js`.
Two-segment chapter paths and two-segment TOC paths share the same shape, so
the parser must try chapter lookup first and fall back to super+section.

Sub-step `0` is omitted from the URL for cleanliness.

### Worked examples

| URL | State |
|---|---|
| `/learn-ai/` | TOC, nothing expanded |
| `/learn-ai/transformers` | TOC, Super C expanded |
| `/learn-ai/transformers/attention` | TOC, Super C + Section 10 expanded |
| `/learn-ai/neural-foundations/what-is-nn` | Chapter 1.1, first reveal |
| `/learn-ai/attention-computation/qkv-concepts/3` | Chapter 10.2, sub-step 3 |

## Slugs for super-sections and sections

Add a `slug` field to each entry in `superSections` and to each entry in the
`sections` array in `config.js`. The slug is stable across renames and
reorders, exactly like the chapter `slug`.

### Super-section slugs (final)

| ID | Name | Slug |
|---|---|---|
| A | Foundations of Deep Learning | `deep-learning` |
| B | The Rise of LLMs | `llm-rise` |
| C | The Transformer Era | `transformers` |
| D | Vector Databases at Depth | `vector-databases` |
| E | Retrieval Augmented Generation (RAG) | `rag` |
| F | Agentic AI | `agents` |

### Section slugs (proposed - review during implementation)

| # | Name | Slug |
|---|---|---|
| 1 | Neural Networks - The Mechanics | `neural-networks` |
| 2 | Learning & Backprop | `backprop` |
| 3 | Linear Algebra for Deep Learning | `linear-algebra` |
| 4 | Training Deep Networks | `training` |
| 5 | How LLMs Actually Train | `pretraining` |
| 6 | Scaling & Modern Techniques | `scaling` |
| 7 | The Road to Transformers | `road-to-transformers` |
| 8 | Transformer Input Pipeline | `input-pipeline` |
| 9 | Attention - Understanding Q, K, V | `qkv` |
| 10 | Computing Attention | `attention` |
| 11 | Multi-Head Attention | `multi-head` |
| 12 | The Encoder | `encoder` |
| 13 | The Decoder | `decoder` |
| 14 | Modern LLM Techniques | `modern-techniques` |
| 15 | Vector Search - From Brute Force to ANN | `vector-search` |
| 16 | Vector Compression - Quantization & Matryoshka | `compression` |
| 17 | Vector DBs in Production | `production` |
| 18 | Picking a Vector Database | `picking-db` |
| 19 | The RAG Pipeline - Why & How It Breaks | `pipeline` |
| 20 | RAG Data Prep - Ingestion & Chunking | `ingestion` |
| 21 | RAG Retrieval - Embeddings, Hybrid & Query Tricks | `retrieval` |
| 22 | RAG Generation - Naive to Advanced Patterns | `generation` |
| 23 | RAG in Production - Eval, Cost & Shipping | `shipping` |
| 24 | Prompting LLMs - The Foundation | `prompting` |
| 25 | Tools & Protocols - MCP, A2A | `tools` |
| 26 | Agent Mechanics - Loops & Memory | `mechanics` |
| 27 | Multi-Agent Systems | `multi-agent` |
| 28 | Shipping Agents - Eval, Safety, Frameworks | `shipping` |

Section slugs are scoped under their super-section in the URL, so two
sections in different supers may safely share a slug. The validator (see
below) still requires section slugs to be unique within a super.

### Collision rules (enforced by config validation)

A new test in `src/__tests__/config.test.js` asserts:

1. Every super-section has a non-empty kebab-case `slug`.
2. Every section has a non-empty kebab-case `slug`.
3. Super-section slugs are pairwise unique.
4. Section slugs are pairwise unique **within** their super.
5. No super-section slug equals any chapter topic
   (the first segment of any chapter `slug`).
6. No super-section slug equals the string `learn-ai` or any reserved
   route name (currently none, but the test leaves room).

Rule 5 is the one that just bit `llm-training` - it is a chapter topic
folder, so super B cannot use it. The validation prevents the same mistake
on future renames.

## Architecture

### New module: `src/url-routing.js`

A single pure module owns URL parsing and building. No React, no DOM. Pure
functions of `(pathname, chapters, superSections, sections)` in and out.
This keeps it trivial to test.

Exports:

```js
// Parse the current path into one of three shapes
parsePath(pathname, { chapters, superSections, sections })
// → { kind: "toc", super: null|"A".."F", section: null|number }
// → { kind: "chapter", ch: number, sub: number }
// → { kind: "invalid" }

// Build a path from current state
buildPath(state, { chapters, superSections, sections })
// → "/learn-ai/" or "/learn-ai/foo" or "/learn-ai/foo/bar" or "/learn-ai/foo/bar/3"

// Base path constant - "/learn-ai/" in production, "/" in tests
BASE_PATH
```

`BASE_PATH` is read from `import.meta.env.BASE_URL` (Vite already exposes
it). Tests pass an override.

### New module: `src/url-sync.js`

A tiny React hook `useUrlSync({ ch, sub, expanded })` that runs an effect:

1. On state change, compute the new path via `buildPath`.
2. If it differs from `window.location.pathname`, call
   `history.replaceState(null, "", newPath)`.

No `pushState`. No `popstate` listener (back/forward never push a new
in-app entry, so `popstate` only ever fires when the user explicitly leaves
the app - we let the browser handle it).

### Bootstrap (in `learn-ai.jsx`)

Replace the current `useState(() => loadNav(chapters))` initializers with a
single resolved initial state computed at module load:

```js
function resolveInitialState() {
  const parsed = parsePath(window.location.pathname, { chapters, superSections, sections });
  if (parsed.kind === "chapter") return { ch: parsed.ch, sub: parsed.sub, expanded: null };
  if (parsed.kind === "toc")     return { ch: 0, sub: 0, expanded: parsed.super ? { super: parsed.super, section: parsed.section } : null };
  // invalid → fall through to localStorage / TOC
  const saved = loadNav(chapters);
  if (saved) {
    // bare URL + saved state → redirect via replaceState (done in an effect on mount)
    return { ch: saved.ch, sub: saved.sub, expanded: null, _redirect: true };
  }
  return { ch: 0, sub: 0, expanded: null };
}
```

A small `useEffect` on mount handles the `_redirect` case: if the parser
returned invalid for a bare URL but we loaded from localStorage, call
`buildPath` and `replaceState` once so the URL bar matches.

### TOC integration

`src/chapters/table-of-contents/toc.jsx` already receives `expanded` /
`setExpanded` from `ctx`. The `useUrlSync` hook watches `expanded` along
with `ch`/`sub`, so clicking a super or section auto-syncs the URL. No
changes needed inside `toc.jsx`.

### Removed / changed call sites

- `saveNav(ch, sub, chapters)` still runs - localStorage stays as the
  bare-URL fallback. No change.
- `loadNav` is now used only inside `resolveInitialState`. The current
  inline `useState(() => loadNav(...))` calls in `learn-ai.jsx` are
  replaced.
- `useEffect` that calls `saveNav` stays.

## GitHub Pages SPA fallback

GitHub Pages serves `index.html` only at the exact `BASE_PATH`. Any deeper
path like `/learn-ai/foo/bar` returns a 404. The standard fix is to add a
`public/404.html` that copies the requested path into `sessionStorage` and
redirects to the base index, which on boot reads `sessionStorage` and calls
`replaceState` back to the original path.

Plan:

1. Add `public/404.html` using the standard SPA-on-GitHub-Pages fallback
   pattern, adapted for `BASE_PATH = /learn-ai/`. The shim is ~20 lines and
   writes the requested pathname to `sessionStorage` before redirecting to
   the base index. It lives in `public/` so Vite copies it verbatim.
2. Add a tiny inline script in `index.html` (before any module loads) that
   reads the redirected path out of `sessionStorage` and `replaceState`s
   it. Without this step, `parsePath` would see the wrong URL.

Both files are static and version-controlled. No build-time generation.

### Local dev

`vite preview` and `vite dev` both serve `index.html` for unknown paths via
the `appType: "spa"` default. No extra config required. Tests can simulate
the 404 redirect by writing `sessionStorage` directly.

## Edge cases

| Case | Behavior |
|---|---|
| Bare URL, no localStorage | Show TOC. URL stays `/learn-ai/`. |
| Bare URL, localStorage present | Redirect (via `replaceState`) to the saved chapter's URL. |
| URL has unknown super slug | Redirect to `/learn-ai/`. Console warn in dev only. |
| URL has known super slug + unknown section slug | Redirect to `/learn-ai/<super>` (super open, section dropped). |
| URL has section that doesn't belong to that super | Same: redirect to `/learn-ai/<super>`. |
| URL has unknown chapter slug | Redirect to `/learn-ai/`. |
| URL has known chapter slug + non-numeric sub | Drop the sub: render at `sub = 0`, replaceState removes the sub. |
| URL has known chapter slug + negative sub | Same as above. |
| URL has known chapter slug + sub larger than max revealed | Render at that sub - chapters render correctly at any non-negative sub because Reveal counts from 0. `maxSubs[ch]` is set so back-navigation works. |
| User opens TOC chapter (`ch = 0`) | URL is `/learn-ai/` (TOC slug is never written). |
| User navigates Prev from chapter 1.1 sub 0 | Goes to TOC; URL becomes `/learn-ai/`. |

## Testing strategy

All new code is covered to 100% per CLAUDE.md.

### New unit tests

- `src/__tests__/url-routing.test.js` - exhaustive parse/build round-trip
  cases including every shape in the URL scheme table plus every edge case.
- `src/__tests__/url-sync.test.jsx` - mount a component with the
  `useUrlSync` hook, change state, assert `window.history.replaceState`
  was called with the right path and never `pushState`.
- `src/__tests__/config.test.js` - new assertions for the collision rules
  listed in "Slugs for super-sections and sections".

### Updated tests

- `src/__tests__/learn-ai.test.jsx` - add cases for:
  - Boot with a chapter URL: state matches.
  - Boot with a super-section URL: TOC `expanded` matches.
  - Boot with bare URL + saved localStorage: redirects to saved.
  - Boot with invalid URL: redirects to TOC.
  - Click Continue: URL updates with `replaceState`, never `pushState`.
  - Click chapter in TOC: URL updates.
  - Click super/section in TOC: URL updates.

- `src/__tests__/nav-persistence.test.js` - unchanged in behavior; tests
  still pass.

### Out of scope

- Search-overlay URL state (search query in URL): not requested, do not
  add.
- Smooth-scroll position in URL: not requested.
- Open Graph / metadata per chapter URL: not requested. (Discoverability
  rules in CLAUDE.md still apply for global metadata when chapters change.)

## Files touched

| File | Change |
|---|---|
| `src/config.js` | Add `slug` to each `superSections` entry and each `sections` entry. Add validation. |
| `src/url-routing.js` | New. Parser + builder + BASE_PATH. |
| `src/url-sync.js` | New. `useUrlSync` hook. |
| `src/learn-ai.jsx` | Use `resolveInitialState` for initial `ch`/`sub`/`expanded`. Mount `useUrlSync`. Handle bare-URL-redirect effect. |
| `src/nav-persistence.js` | Unchanged. |
| `index.html` | Inline SPA redirect script (reads `sessionStorage` from 404 shim and `replaceState`s). |
| `public/404.html` | New. SPA fallback shim. |
| `src/__tests__/url-routing.test.js` | New. |
| `src/__tests__/url-sync.test.jsx` | New. |
| `src/__tests__/config.test.js` | Add slug validation tests. |
| `src/__tests__/learn-ai.test.jsx` | Add boot + sync tests. |

## Non-goals

- Changing how chapters reference each other internally - they continue to
  use `chapters.findIndex((c) => c.slug === ...)` per CLAUDE.md.
- Persisting the search overlay's state to URL.
- Adding pretty URL labels (titles in URL): the slug is enough.
- Changing the TOC visual or interaction.
- Adding analytics on URL changes.

## Discoverability sync

This change does not add or remove chapters or sections, so no updates to
`public/llms.txt` or `index.html` JSON-LD are required. (CLAUDE.md's
discoverability rules trigger on chapter / section / metadata edits, none
of which apply here.)
