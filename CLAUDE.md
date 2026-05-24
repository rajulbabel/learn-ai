# Claude Code Project Instructions

## Overview

Learn AI is an interactive, single-page React application that teaches AI concepts
from neural network basics through the Transformer architecture.

## Tech Stack

- **React 18** with hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- **Vite** for build toolchain (with vendor chunk splitting)
- **GitHub Actions** for CI/CD to GitHub Pages
- **ESLint + Prettier** for code quality
- **Vitest** for unit testing
- No external UI libraries - all styling is inline

## Architecture

The app uses a **section/chapter** hierarchy:

- **Section** = a big topic grouping (e.g., Section 7: "Attention - The Full Computation")
- **Chapter** = one screen/page within a section (e.g., 7.4: "Why Do We Need Softmax?")
- **Sub-step** = progressive "Continue" reveals within a chapter (managed by `sub` state)

### How It Works

**config.js is the single source of truth** for chapter ordering, numbering, and
section assignments. Each entry has a `component` field (the function name, used
for debugging) and a `file` field that points to the chapter file path under
`src/chapters/`.

```js
// config.js
{ id: "7.4", title: "Why Do We Need Softmax?", section: 7,
  component: "WhySoftmax", file: "attention-computation/why-softmax" }
```

**Each chapter lives in its own file** at
`src/chapters/<topic>/<chapter-kebab>.jsx` and is the file's default export.
This gives every chapter its own Vite chunk (lazy-loaded on demand) and isolates
edits to a single small file.

**learn-ai.jsx** uses `import.meta.glob` to register all chapter files and
loads the active chapter at render time via its `file` path. There is no
manually maintained chapter array or sections lookup.

```jsx
// learn-ai.jsx
const chapterLoaders = import.meta.glob("./chapters/**/*.jsx");

async function loadChapterByFile(file) {
  const loader = chapterLoaders[`./chapters/${file}.jsx`];
  const mod = await loader();
  return mod.default || null;
}
```

### Naming Convention

| Concept | Where | Naming rule | Example |
|---------|-------|-------------|---------|
| Component file (default export) | `src/` | kebab-case | `learn-ai.jsx` |
| Multi-export module file | `src/` | lowercase | `components.jsx`, `config.js` |
| Chapter folder | `src/chapters/` | kebab-case, topic name | `attention-computation/` |
| Chapter file | `src/chapters/<topic>/` | kebab-case, content name | `why-softmax.jsx` |
| Chapter function | default export in chapter file | PascalCase, topic name | `WhySoftmax` |
| Shared helper file | `src/shared/` | kebab-case, topic name | `vector-graphs.jsx` |
| Chapter ID | `chapters` array in config.js | `section.chapter` number | `"7.4"` |
| Entry point | `src/` | lowercase | `main.jsx` |

**All filenames are lowercase or kebab-case.** Only function/component names inside
files use PascalCase. This keeps the filesystem consistent across all operating systems.

Function names and file names describe **what the content is about**. They never
contain numbers and never need to be renamed when chapters are reordered or inserted.
Only config.js IDs change.

### Complete Mapping

The full chapter list (ID, title, section, component, file) lives in
`src/config.js` (the `chapters` array). It is the single source of truth.
Grep there for any chapter ID, component name, file path, or title. Section
names and colors live in `sectionNames` and `sectionColors` in the same
file. Do not duplicate the mapping here.

## Project Structure

Each chapter lives at `src/chapters/<topic>/<chapter>.jsx` (one
default-export function per file). Cross-chapter helpers live in
`src/shared/`. Tests mirror that layout under `src/__tests__/chapters/` and
`src/__tests__/shared/`. Run `find src -type d` to see current folders.

Key entry points:
- `src/learn-ai.jsx` - shell: state, navigation, chapter loader via `import.meta.glob`
- `src/config.js` - `chapters` array (single source of truth), `sectionNames`, `sectionColors`, color palette `C`
- `src/components.jsx` - shared components: `Box`, `T`, `Reveal`, `SubBtn`, `Tag`, `ErrorBoundary`
- `src/nav-persistence.js` - `saveNav` / `loadNav` (localStorage with config fingerprint)
- `src/search-overlay.jsx`, `src/search.js`, `src/embedding-cache.js` - search
- `src/data/` - `chunks.json`, `embeddings.bin`, `chunk-cache.json`, `svg-descriptions.json`
- `src/__tests__/chapter-test-helpers.js` - `makeCtx` factory (used by every per-chapter test)

Shared helpers (`src/shared/`) and what they export:
- `plot.jsx` - `Graph`
- `agent-styles.jsx` - `SOFT`, `tintedCard`, `pill`, `DIM_BG`, `DIM_BORDER`
- `agent-helpers.jsx` - `HighlightedJson`, `monoArtifact`
- `vector-graphs.jsx` - `Triangle`, `IVFScatter`, `HNSWLayeredGraph`, `fmtVec`, `docCluster`, `computeFlatEdges`, `IVF_CLUSTERS`, `HNSW_CORPUS_XY`, `FLAT_GRAPH_EDGES`, `HNSW_LAYER_1`, `HNSW_LAYER_2`
- `rag-helpers.jsx` - `FormulaBox`, `CapstoneDecisionCard`
- `llm-training-helpers.jsx` - `SCORES`, `EXP_SCORES`, `EXP_SUM`, `SORTED_SCORES`, `SORTED_PROBS`

## How To: Add a New Chapter

Example: insert a new chapter "Score Normalization" between 7.2 and 7.3.

1. **Create the chapter file** at
   `src/chapters/attention-computation/score-normalization.jsx` with a default
   export:
   ```jsx
   const ScoreNormalization = (ctx) => { ... };
   export default ScoreNormalization;
   ```
2. **Add one entry to the section's `chapters` array in `config.js`** - no ID
   renumbering, no manual ID at all. Drop a new `{ file, title, component }`
   object into the array at the desired position; IDs are derived from position.
   ```js
   sections = [
     ...
     {
       num: 7,
       name: "Computing Attention",
       chapters: [
         { file: "attention-computation/why-attention",       title: "Why Attention",  component: "WhyAttention" },
         { file: "attention-computation/qkv-concepts",        title: "Q, K, V",        component: "QKVConcepts" },
         { file: "attention-computation/score-normalization", title: "Score Normalization", component: "ScoreNormalization" },  // NEW
         { file: "attention-computation/k-transpose",         title: "K Transpose",    component: "KTranspose" },
         ...
       ],
     },
   ]
   ```
3. **Add a per-chapter test file** at
   `src/__tests__/chapters/attention-computation/score-normalization.test.jsx`
   covering every sub-step and interaction. Use the `makeCtx` factory in
   `src/__tests__/chapter-test-helpers.js`.
4. **No other files change.** learn-ai.jsx auto-resolves the chapter via
   `import.meta.glob` using the `file` field.

## How To: Add a New Section

Example: insert a new Section 5 "Layer Normalization" between current Sections 4 and 5.

1. **Create the folder** `src/chapters/layer-norm/` and add one file per chapter
   inside (each with a default-export function).
2. **Add chapter entries to `chapters` in `config.js`** with `section: 5` and
   `file: "layer-norm/<chapter-kebab>"`. Renumber the IDs and `section`
   numbers for chapters in later sections.
3. **Update `sectionNames` and `sectionColors`** in `config.js` with the new
   section number and any renumbered higher sections.
4. **Add per-chapter test files** under `src/__tests__/chapters/layer-norm/`.
5. **Update the project structure tree in this file** (CLAUDE.md).
6. **No other source files change.** learn-ai.jsx picks up the new chapter
   folder automatically via `import.meta.glob`.

## How To: Reorder Chapters

Reorder entries inside a section's `chapters` array in config.js. IDs are
derived from position, so no renumbering is needed anywhere. Chapter files
and test files do not move - their content is identity-free. Moving a
chapter between sections is just cutting/pasting between two arrays.

The search index identifies chapters by stable file path, so
reordering does not require re-embedding. Run `npm run search:build` once
after the reorder to refresh `chunks.json`'s sort order (cache-only,
zero LLM cost).

## How To: Cross-Reference Another Chapter

For in-content references (anything the reader sees), use the
`ChapterLink` component from `src/components.jsx`:

```jsx
import { ChapterLink } from "../../components.jsx";

<ChapterLink to="7.4">chapter 7.4</ChapterLink>
```

`to` is the destination chapter's ID. `ChapterLink` reads `goTo` from
`NavContext` (provided by `learn-ai.jsx`) and renders a styled clickable
span. Plain "chapter X.Y" text strings should be converted to
`ChapterLink` whenever they refer to a real chapter.

For programmatic navigation in code, shared helpers, or deep links, look
the chapter up by its **file path** - never by chapter ID (`"7.4"`) or
array index:

```js
const idx = chapters.findIndex((c) => c.file === "attention-computation/why-softmax");
if (idx >= 0) goTo(idx);
```

File paths equal `"<topic>/<chapter-kebab>"` and are stable across
reorders, insertions, deletions, and section renumbering. IDs and
indices shift whenever chapters move; URLs or hard-coded indices break
silently. The search overlay already follows this rule
(`src/search-overlay.jsx`). Apply it anywhere a chapter is referenced
from outside its own file.

## How To: Add a New Super-Section

Super-sections group related sections in the TOC. The 6 default groups are
defined in `superSections` in `config.js`.

To add a new super-section:

1. Insert a new entry into `superSections` with `id`, `name`, `color`, and
   the `sections: [...]` list it owns. Pick an id letter not already used.
2. Remove those section numbers from whichever super-section previously
   owned them.
3. Run `npm run test` - validation will catch any section that is now
   orphaned or double-claimed.

No chunk regeneration is required. Super-sections are a pure TOC overlay.

## Development

```bash
npm install
npm run dev          # Start dev server at localhost:5173/learn-ai/
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run test         # Run unit tests
npm run lint         # Lint source files
npm run format       # Format source files with Prettier
```


## Test-Driven Development (TDD) - MANDATORY

**Every code change MUST follow TDD.** No exceptions, no matter how small the change.

The workflow for any addition, deletion, or update is:

1. **Write the test first** - add or update tests in `src/__tests__/` that describe
   the expected behavior of the change. The test should fail at this point.
2. **Write the code** - implement the minimum code to make the test pass.
3. **Run tests** - `npm run test` must pass. Run `npx vitest run --coverage` to
   verify coverage.
4. **Refactor** - clean up while keeping tests green.

This applies to everything: new chapters, config changes, component updates, bug
fixes, style changes. If it touches source code, it gets a test first.

**NEVER skip this. Not for "just a style fix". Not for "one line". Not for a single
character change. ALWAYS: test first, code second. No exceptions.**

### Coverage targets

Coverage thresholds (enforced by `vite.config.js`) over `src/config.js`,
`src/components.jsx`, `src/nav-persistence.js`, `src/chapters/**/*.jsx`, and
`src/shared/**/*.jsx` (excluding `src/main.jsx` and `src/learn-ai.jsx`):

- **Lines: 100%**
- **Branches: 100%**
- **Functions: 100%**
- **Statements: 100%**

Coverage must not drop below these thresholds. Any new code must have
corresponding tests. The per-chapter file layout means each chapter file has
its own focused test file under `src/__tests__/chapters/<topic>/`, which keeps
coverage local and easy to reason about.

## Key Design Decisions

- **Inline styles everywhere** - no CSS files or CSS-in-JS libraries. Styles are
  passed as `style={{}}` props directly on elements.
- **Dark theme** - background `#08080d`, light text. All colors are defined in
  the `C` object in config.js.
- **Mobile-first** - responsive sizing, viewport meta tag for mobile devices.
- **Navigation** - Prev/Next via side zones, keyboard arrows, and spacebar.
  Chapter state managed via `useState`.
- **Chapter context** - all chapter functions receive a `ctx` object with shared
  state (`sub`, `setSub`, `navigate`, `goTo`, `bankIdx`, `setBankIdx`, `hovered`,
  `setHovered`, `expanded`, `setExpanded`, `subBtnRipple`, `setSubBtnRipple`,
  `registerSubBtn`).
- **Error boundary** - chapter rendering is wrapped in `<ErrorBoundary>` to
  catch crashes gracefully without breaking the entire app.
- **Config validation** - in dev mode, config.js and the lookup object are
  validated at import time (duplicate IDs, missing components).

## Style Rules

- **No em-dashes** - never use the em-dash character anywhere in the codebase.
  Use `-` (hyphen) or rewrite the sentence instead.
- **Dot product notation** - use the middle dot, not the multiplication sign,
  when referring to dot products (e.g., Q followed by middle dot followed by K
  transpose, not Q times K transpose).
- **Always refer to chapters by their visible IDs** (e.g., "chapter 7.4"), never
  by internal function names in conversation with the user.

## Visual Design Rules - MANDATORY

Every chapter, sub-step, and visual in the app MUST follow these rules - whether
being added, updated, redesigned, or fixed. No exceptions. Do not wait for the
user to remind you.

- **Illustrative first** - every concept must be shown visually, not just
  described in text. Use colored bars, grids, split diagrams, progress bars,
  side-by-side comparisons, and inline calculations. Text alone is never enough.
- **Simple language, advanced content** - explain in plain language that a
  first-time learner can follow, but NEVER simplify the actual concept. Always
  show the real formula, the real math, the real mechanism. The goal is advanced
  understanding delivered through simple explanations - NOT watered-down
  versions of the truth. If a formula has gamma, beta, epsilon - show them all
  and explain what each does. If a step has edge cases - mention them. Never
  leave a concept incomplete because "it's too advanced." Instead, make the
  advanced content accessible through clear language, concrete numbers, and
  step-by-step breakdowns. The learner should walk away with knowledge they
  could use in a technical interview or research paper, not a vague intuition.
- **Build up piece by piece** - use progressive sub-steps (Reveal). Each click
  should add one clear idea. Never dump everything on screen at once.
- **Concrete over abstract** - always use real numbers, real words, real
  sentences. Never say "some value" or "a vector" when you can say "[0.8, 0.2]"
  or "cat's Query."
- **Show the WHY, not just the WHAT** - if something is split, scaled, or
  chosen, explain the tradeoff. Why 8 heads and not 16? Why split instead of
  duplicate? The reasoning matters as much as the mechanics.
- **Consistent example sentences** - use "I love cats" and "The cat sat on the
  mat last week" as running examples throughout. Reuse the same numbers so the
  learner sees how concepts connect across chapters.
- **Titles always center-aligned** - every Box title, sub-step title, or section
  heading inside a Box MUST use `center` (the T component's center prop). No
  exceptions. This applies to the first bold T element inside every Box AND to
  any title T inside grid/flex card layouts (multi-column cards inside a Box).
  Inside a card div, the title T MUST have `center`, the description T MUST have
  `center`, and the parent card div MUST also have `textAlign: "center"`. No
  exceptions for "card-style" layouts - if it has a title, it gets centered.
- **Capitalize first letter of every visible text fragment** - every line of
  monospace formula boxes, every cell in tables, every bullet point, every
  column header, every card name/description/note, every SVG text label MUST
  start with a capital letter. Examples that MUST be capitalized: `name:
  "Cosine"`, `latency: "Normal"`, `params: ["Fast to build"]`, `pain: "Queries
  on tenant_id..."`, `tech: "Cross-encoder"`, `year: "Today"`, SVG `<text>`
  labels like "Query" / "Doc" / "Score". Exceptions: brand names that are
  officially lowercase (pgvector, numpy, iPhone), variable identifiers inside a
  math formula expression (the `q_vec` in `Score = cosine(q_vec, d_vec)`),
  parameter syntax (`m = 16`, `ef_search = 40`), tokens like `[CLS]` / `[SEP]`.
  When unsure, capitalize. The first letter of a LINE is what counts -
  everything after a colon or first word does not need re-capitalization.
- **Title-case for diagram box text** - inside any diagram box, decision-tree
  node, flow-chart node, matrix cell, or named card, EVERY WORD has its first
  letter capitalized, not just the first word of the line. Example: a diagram
  box labeled "Retrieve Top K Documents" not "Retrieve top k documents".
  Examples that MUST be title-case: "Cache Hits", "Vector Search", "Prompt
  Cache Only", "Lock-In Risk", "Smaller Embedding", "User Question", "Cosine
  Search In Cache Store", "Eviction", "False-Hit Risk". This rule is stricter
  than the previous "first letter of line" rule and supersedes it specifically
  inside diagram boxes. Exceptions: officially lowercase brand names
  (pgvector, numpy, iPhone, LlamaIndex/LangChain/LangGraph use their official
  capitalizations), variable identifiers in formulas (`q_vec`,
  `embedding_model_version`), parameter syntax (`m = 16`, `ef_search = 40`),
  tokens like `[CLS]` / `[SEP]`. The "first letter of line" rule still
  applies outside diagram boxes (monospace formula lines, bullet text,
  paragraph fragments). When unsure: in a diagram box, capitalize every word;
  outside a diagram box, capitalize only the first word.
- **SVG diagrams must be horizontally centered in their viewBox** - never
  hardcode `x = 40` for elements in a `viewBox 0 0 520 ...`. Compute symmetric
  padding: `x_start = (viewBox_width - element_span) / 2`. Token rows,
  transformer boxes, score circles, and any element-row layout must have equal
  left/right margins. After placing, verify visually in Chrome - do not trust
  the math alone.
- **Colored boxes, not invisible ones** - always use actual colors for Box
  (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
  NEVER use `Box color={C.card}` - it makes the box invisible against the dark
  background. Text inside a Box should use a matching lighter shade of the box
  color (e.g., `#80deea` for cyan, `#b8a9ff` for purple, `#ef9a9a` for red).
- **No next-chapter hints** - never reference upcoming chapters inside content
  (no "Next chapter:", "Coming up:", or "Preview:" text). Navigation is handled
  by the app shell.
- **Font sizes 16-20 for content** - body text should be 16-19px, titles 20-24px.
  Never use sizes below 14px except for tiny annotations. The attention sections
  are the gold standard for sizing.
- **Inner element pattern** - for highlighted sub-elements inside a Box, use
  tinted backgrounds: `background: \`\${color}06\``, `border: \`1px solid \${color}12\``,
  `borderRadius: 8`. Never use `opacity` on elements to create transparency -
  use hex alpha instead.
- **Standalone formulas always centered** - any formula, equation, vector
  display, or worked computation in its own dark/tinted box MUST have
  `textAlign: "center"` on the container div. This includes monospace math
  like `new_weight = old_weight - lr x gradient` and vector displays like
  `[0.2, 0.9, 0.4]`. Inline formulas within flowing text sentences are exempt.
- **SVG search metadata** - every `<svg>` element MUST have a `<desc>` child as
  its first element, describing what the diagram shows in plain language (1-2
  sentences). For JSX SVGs, add `<desc>text</desc>`. For the Graph component,
  pass a `desc` prop. For imperative SVGs (B() factory), call `desc("text")`.
  When adding or modifying an SVG, also add/update the corresponding entry in
  `src/data/svg-descriptions.json`. Descriptions should use terms a learner
  would search for. This is invisible metadata that powers semantic search -
  it never renders visually.

**The goal is advanced-level understanding through the most illustrative,
visual, and clear explanations possible.** Every formula must be the real
formula. Every computation must use the actual math. Every concept must be
complete - no "simplified versions" that leave out parameters, edge cases, or
nuance. The learner should walk away with knowledge accurate enough for a
research paper or technical interview. If a visual only describes something
in words when it could show it with a diagram, colored bars, a side-by-side
comparison, or a step-by-step calculation - it is not done yet. Always ask:
"Can I SHOW this instead of just TELLING it?" and "Is this the REAL formula
or a dumbed-down version?"

## Discoverability Sync Rules - MANDATORY (SEO + AEO)

The site's discoverability across both **SEO** (Google, Bing, DuckDuckGo) and
**AEO / Answer Engine Optimization** (ChatGPT search, Claude web, Gemini,
Perplexity, and other LLM crawlers) depends on metadata and static text staying
in sync with content. Because the app is a client-rendered SPA, the `<body>`
served by GitHub Pages is **the only content crawlers see without executing
JS**. Treat the static body inside `#root`, the `<noscript>` block, and
`public/llms.txt` as **authoritative** for crawlers - if they fall out of sync
with config / content, the site loses ranking.

Whenever a code change touches any trigger below, update the listed companion
files in the SAME commit. Apply automatically without asking the user.

| If you change... | You MUST also update... |
|---|---|
| `src/config.js` chapters or sectionNames (add / rename / remove / reorder) | `public/llms.txt` "What it covers" topic list, `index.html` JSON-LD `teaches` array, the `.seo-fallback` curriculum topic list inside `#root` in `index.html`, and bump `<lastmod>` in `public/sitemap.xml` |
| Site title, meta description, author name, or tagline (anywhere) | `index.html` (`<title>`, `<meta name="description">`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, JSON-LD `name` / `description`), the static `<h1>` + intro inside `#root` in `index.html`, the `<noscript>` block in `index.html`, `public/llms.txt` heading + summary line, footer in `src/learn-ai.jsx`, and bump `<lastmod>` in `public/sitemap.xml` |
| Visual identity (logo, hero gradient, primary colors, favicon) | Regenerate `public/og.png` so social shares look right |
| Site goes from SPA to multi-page routing | `public/sitemap.xml` to list each new URL (one `<url>` block per route, each with its own `<lastmod>`) |
| Author social links (LinkedIn, GitHub, Twitter, etc.) | `index.html` JSON-LD `sameAs` array, the static About / author section inside `#root` in `index.html`, the `<noscript>` block, `public/llms.txt` Author section, footer in `src/learn-ai.jsx` |
| Any change to the static body content inside `#root` or `<noscript>` in `index.html` | Bump `<lastmod>` in `public/sitemap.xml` to today's date (YYYY-MM-DD) so Google recrawls |
| Any push to `main` that changes user-visible content, chapter set, or site identity | Bump `<lastmod>` in `public/sitemap.xml` to today's date (YYYY-MM-DD) |

### Why the static `#root` fallback matters

`index.html` ships an `.seo-fallback` block inside `<div id="root">` containing
a real `<h1>`, an intro paragraph, the full curriculum topic list, and an
author section. React's `createRoot(...).render(...)` replaces this content on
first paint, so users never see it - but crawlers that don't execute JS (and
even those that do, since JS-rendered content is deprioritized) see real text.
A second `<noscript>` block backs this up for strictly-no-JS clients. **Never
revert `<div id="root">` to empty** - that's what previously dropped the site
out of Google for the "rajul babel" query. If you add/rename/remove chapters
or sections, the topic list inside `.seo-fallback` must be updated to match
`src/config.js`. Same for the `<noscript>` summary.

### AEO files - LLM-readable surfaces

- `public/llms.txt` - the canonical machine-readable site map for LLM
  crawlers (Anthropic, OpenAI, Google-Extended, Perplexity, Common Crawl).
  Must mirror `src/config.js` sections/chapters in its "What it covers" list
  and stay aligned with site title/description and author social links.
- `public/robots.txt` - explicitly allow LLM crawlers (`GPTBot`,
  `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `Claude-Web`, `anthropic-ai`,
  `Google-Extended`, `PerplexityBot`, `CCBot`). Do not regress these allow
  lines.
- JSON-LD in `index.html` (Person, WebSite, LearningResource graph) - the
  schema.org payload LLMs and Google use for entity recognition. The
  `teaches` array MUST match `sectionNames` in `src/config.js`.

### TDD coverage for SEO/AEO rules

Per the mandatory TDD policy, the following test files lock these rules in
place. When you change any of the above files, the relevant test must be
updated in the same commit so that drift is caught at CI:

- `src/__tests__/index-seo.test.js` - asserts `<h1>`, `.seo-fallback` content,
  `<noscript>` block, and curriculum topic mentions inside `index.html`.
- `src/__tests__/sitemap.test.js` - asserts canonical URL and well-formed
  ISO `<lastmod>` in `public/sitemap.xml`.
- `src/__tests__/claudemd-seo-rules.test.js` - asserts that this section of
  CLAUDE.md continues to document the SEO + AEO sync rules.
- `src/__tests__/llm-chunk.test.js`, `src/__tests__/manifest.test.js`,
  `src/__tests__/svg-descriptions.test.js` - existing tests covering
  llms.txt-adjacent search artifacts and SVG `<desc>` metadata.

After any of these changes are pushed, remind the user (one sentence, end of
turn) to:
- Request re-indexing in Google Search Console (URL Inspection → Request indexing).
- Submit URL in Bing Webmaster Tools (URL Submission).
- For major curriculum changes, optionally re-share on LinkedIn / GitHub
  profile so LLM crawlers and AEO surfaces re-fetch.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Deploys the `dist/` folder to GitHub Pages

## Commit Conventions

- Use imperative mood ("Add chapter", not "Added chapter")
- Keep subject line under 72 characters
