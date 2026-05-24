# Section 12 Milestone 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** When you dispatch a subagent for a task, the subagent prompt MUST include: (a) the verbatim Files: list from the task, (b) the instruction "modify ONLY files in the Files: list; if you find other defects, document them but do NOT fix them in this task", and (c) the instruction "run `git diff --stat` before committing; abort if any file outside the Files: list shows as modified". The parent reviews `git diff --stat` after each subagent finishes. Scope violations are rejected and the subagent re-dispatched with the same strict prompt.
>
> **Two-stage review per task:** Stage 1 SCOPE - did the subagent modify only the listed files? Are commits clean? Stage 2 CORRECTNESS - do tests pass, does behavior match the spec? Both stages must pass before moving to the next task.

**Goal:** Add Act 2 (Ingestion - 3 chapters) and Act 3 (Chunking - 7 chapters) of Section 12. Total 10 new chapters this milestone (12.4-12.13). The app ships at end of this milestone with Section 12 reaching 13 navigable chapters.

**Architecture:** Section 12 now has two files. The existing `src/sections/rag-foundations.jsx` (created in M1, holding 12.1-12.3) is extended with the chunking chapters 12.7-12.13. A NEW file `src/sections/rag-ingestion.jsx` holds the ingestion chapters 12.4-12.6. The Section 12 loader in `learn-ai.jsx` becomes a 2-file `Promise.all` that merges both namespaces. Each chapter follows the same pattern used in 12.1-12.3: `ctx`-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real artifacts, concrete numbers from the customer support corpus.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md` - chapters 12.4 through 12.13, Acts 2 (Ingestion) and 3 (Chunking).

**Milestone 1 reference:** `docs/superpowers/plans/2026-05-16-section-12-milestone-1.md` - same patterns, same testing cadence; this plan assumes M1 is merged on `main` (`rag-foundations.jsx` already contains 12.1-12.3, config has 12.1-12.3 entries, lookup is wired).

**Branch policy:** Per user instruction, work directly on `main`. No feature branch. Commit after each chapter.

---

## Prerequisites

- M1 merged on `main`. Verify in Task 1:
  - `src/sections/rag-foundations.jsx` exists with exports `WhyLLMsNeedRetrieval`, `NaiveRAGPipeline`, `WhereNaiveRAGBreaks`.
  - `src/config.js` has Section 12 in `sectionNames` (`12: "Retrieval-Augmented Generation"`) and `sectionColors` (`12: "#7c4dff"`), plus chapter entries 12.1-12.3.
  - `src/learn-ai.jsx` registers section 12 in `sectionLoaders` mapping to `rag-foundations.jsx`.
  - `src/__tests__/sections.test.jsx` imports `RagFoundations` into its `lookup`.
  - CLAUDE.md already has a Section 12 mapping table with 12.1-12.3 in it.
- All tests currently pass on `main` (verified in Task 1).
- Working directly on `main` (no feature branch).

---

## File Structure

### New files

- `src/sections/rag-ingestion.jsx` - holds the 3 ingestion chapters (12.4 ParsingExtraction, 12.5 DeduplicationCleaning, 12.6 RefreshSync). Created as a scaffold with 3 stub exports in Task 2, then each chapter is implemented in Tasks 3-5.

### Modified files

- `src/sections/rag-foundations.jsx` - append 7 new exports for the chunking chapters (WhyChunkFixedSize, RecursiveStructuralChunking, SemanticChunking, LateChunking, HierarchicalChunking, ContextualRetrieval, ChunkingDecision). File grows from ~3 chapters' worth (~900-1500 lines after M1) to roughly double that after the chunking tasks.
- `src/learn-ai.jsx` - Section 12 entry in `sectionLoaders` becomes a 2-file `Promise.all` over `rag-foundations.jsx` + `rag-ingestion.jsx`, merging the namespaces. (Updated once in Task 2.)
- `src/config.js` - add 10 entries to `chapters[]`: 3 ingestion entries inserted immediately after `{ id: "12.3", component: "WhereNaiveRAGBreaks", ... }`, then 7 chunking entries immediately after `12.6`.
- `src/__tests__/lookup.test.js` - add static `import * as RagIngestion from "../sections/rag-ingestion.jsx"`, presence tests asserting each ingestion component is a function, and spread `...RagIngestion` into the lookup object alongside RagFoundations.
- `src/__tests__/sections.test.jsx` - import `RagIngestion`, spread it into the `lookup` object, append content-test `describe` blocks for each of the 10 new chapters (5-7 sub-step tests each = ~55 new test cases).
- `src/__tests__/config.test.js` - extend the Section 12 chapter-count/id test from 3 (M1) up to 13 (end of M2) entries, growing one task at a time.
- `src/data/svg-descriptions.json` - add entries for new SVGs introduced in 12.4-12.13 keyed by chapter ID.
- `CLAUDE.md` - extend the Section 12 mapping table from 3 rows to 13 rows. Update the inline annotation on `rag-foundations.jsx` and ADD a new line for `rag-ingestion.jsx` in the Project Structure tree.

### Unchanged

- All prior section files (Sections 1-11) and their tests.
- The customer support corpus references and 5 standard queries are reused as-is from M1 - no new shared constants needed at file top. (If a particular chapter benefits from a shared chunk constant, add it locally to that chapter's section.)

---

## Standard running-example values (reference during implementation)

From the spec, identical to M1. Use consistently across 12.4-12.13:

- **Primary corpus:** 30-doc customer support knowledge base - 10 account/billing docs, 10 product feature docs, 10 troubleshooting docs.
- **Running docs (re-used across chapters):**
  - doc-1: Password reset article (used in 12.4 parsing, 12.7 fixed-size, 12.8 recursive, 12.10 late chunking, 12.11 hierarchical).
  - doc-4: Refunds policy (used in 12.11 parent-child).
  - doc-7: Login troubleshooting (used in 12.8 to show structural chunking on a heterogeneous markdown doc).
  - doc-12: API keys feature (used in 12.9 semantic chunking + 12.12 contextual augmentation).
  - doc-23: 500 errors troubleshooting (used in 12.13 decision matrix).
- **Standard queries:**
  - "How do I reset my password?" (single-doc lookup baseline).
  - "How do I reset my password if I forgot my email?" (multi-hop - used in 12.10 late chunking, 12.11 hierarchical).
  - "Why is my dashboard slow and showing 500 errors?" (multi-issue).
  - "Cancel my subscription and get a refund" (multi-step).
  - "Compare the Pro and Enterprise plans" (aggregation).
- **Chunk size (tokens):** 64-128 (visible in diagrams) / 512 (production typical, mentioned in scaling math).
- **Chunk overlap:** 0 or 16 (visible) / 50-100 (production).
- **Top-k:** 3-5 (visible) / 20-50 (production before rerank).
- **Per-act color scheme (from spec):** Act 2 (Ingestion) uses red/cyan as anchors. Act 3 (Chunking) uses cyan as its primary color family. Use `C.cyan` for the "anchor" sub-step in each chunking chapter (typically sub=0 or the title sub-step). Sub-steps within each chapter still rotate through (cyan, green, purple, orange, yellow, pink, red, blue).

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Earlier sections suffered overlap defects fixed one-by-one. Validate in Chrome (Task 14).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Retrieve Top K Documents" not "retrieve top k documents". Exceptions: lowercase brand names (pgvector, numpy, langchain), variable identifiers (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors.
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json` keyed by chapter ID.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Use hyphen (`-`) or rewrite the sentence.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts like "Chapters 12.14-12.21 fix this" or "covered in chapter 12.13" are allowed; future-tense "next" / "coming" forward-references to chapters not yet on screen are forbidden. Never use the literal phrase "Act N" in chapter-visible content - learners only see chapter numbers like 12.4.
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose". A chapter with 5 paragraphs of text and 1 diagram fails this rule. A chapter with 1 paragraph and 5 diagrams succeeds.

### Prompt-template & metadata-artifact treatment (Section-12-specific)

Prompt templates, metadata schemas, and contextual-augmentation blocks are TEXT artifacts, NOT code blocks. Render in styled monospace blocks visually distinct from any code:

- Background tint matching the box color (e.g., `${C.purple}06`).
- Soft border `1px solid ${C.purple}12`.
- Monospace font (`fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"`), 14-16px.
- Highlight variable placeholders (`{document_title}`, `{section_heading}`, `{chunk}`, JSON field names like `source_url`) in a distinct accent color.
- Label the block as "Prompt Template" / "Augmentation Template" / "Metadata Schema" / "Eval Rubric" in the title.
- Never show executable code (no Python, no JS, no SDK calls).

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 12 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding a NEW section file (e.g., `src/sections/rag-ingestion.jsx`), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as NewSection from "../sections/new-section.jsx"`, (b) presence test asserting `typeof mod.ChapterName === "function"`, AND (c) spread `...NewSection` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as NewSection`, (b) spread `...NewSection` into the `lookup` object.
- `src/learn-ai.jsx` - register the new file in `sectionLoaders` (either single import or as part of a Promise.all if section already has multiple files).

### When the section is now multi-file:

- The loader becomes `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. Any earlier single-file loader for that section is REPLACED.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

M2 ships ten chapters across two acts. After baseline verification and the new-file scaffold, ingestion chapters come first (they precede chunking in the learner's reading order), then chunking. Each chapter is its own task.

1. Task 0 - Name session.
2. Task 1 - Verify green baseline (no commit).
3. Task 2 - Create `rag-ingestion.jsx` scaffold + register 2-file Promise.all loader + update lookup/sections tests.
4. Task 3 - Chapter 12.4 ParsingExtraction.
5. Task 4 - Chapter 12.5 DeduplicationCleaning.
6. Task 5 - Chapter 12.6 RefreshSync.
7. Task 6 - Chapter 12.7 WhyChunkFixedSize.
8. Task 7 - Chapter 12.8 RecursiveStructuralChunking.
9. Task 8 - Chapter 12.9 SemanticChunking.
10. Task 9 - Chapter 12.10 LateChunking.
11. Task 10 - Chapter 12.11 HierarchicalChunking.
12. Task 11 - Chapter 12.12 ContextualRetrieval.
13. Task 12 - Chapter 12.13 ChunkingDecision.
14. Task 13 - Update CLAUDE.md mapping table.
15. Task 14 - Final M2 verification (test, coverage, lint, format, build, Chrome visual validation).
16. Task 15 - Lessons capture + M3 starter prompt.

Each chapter task internally follows the same 9-step cadence: write content tests → run-fail → implement → run-pass → svg-descriptions update (if SVG added) → full test + lint + format → full smoke gate → scope verify → commit. One commit per chapter.

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section12-milestone2`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section12-milestone2` (if your Claude Code build supports it)
- Settings: set the session title via `/config` or the IDE extension's session pane
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section12-milestone2" so future searches catch it

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section12-milestone2` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section12-milestone2`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify green baseline

**Files:** none (git state + run tests + sanity-check M1 artifacts).

- [ ] **Step 1: Confirm we're on main with clean working tree**

```bash
git status
git log --oneline -5
```

Expected: `On branch main`, `nothing to commit, working tree clean`. The last few commits should include M1 chapter commits (e.g., "Implement chapter 12.3 Where Naive RAG Breaks", "Document Section 12 Act 1 in CLAUDE.md mapping").

- [ ] **Step 2: Confirm M1 artifacts are in place**

```bash
grep -n "WhyLLMsNeedRetrieval\|NaiveRAGPipeline\|WhereNaiveRAGBreaks" src/sections/rag-foundations.jsx
grep -n "12.1\|12.2\|12.3" src/config.js
grep -n "RagFoundations" src/__tests__/sections.test.jsx
grep -n "Retrieval-Augmented Generation" src/config.js
```

Expected: each grep returns matches. If any returns no matches, stop and surface "M1 not merged" - M2 cannot proceed.

- [ ] **Step 3: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass (M1's 3 chapters + everything from Sections 1-11).

- [ ] **Step 4: Run linter and formatter baselines**

```bash
npm run lint
npm run format
```

Expected: no lint errors; format clean (no changes).

- [ ] **Step 5: No commit yet** - this task only verifies baseline.

---

## Task 2: Create rag-ingestion.jsx scaffold and 2-file loader

**Files:**
- Create: `src/sections/rag-ingestion.jsx` (new file with 3 stub exports).
- Modify: `src/learn-ai.jsx` (Section 12 loader becomes a 2-file `Promise.all`).
- Modify: `src/__tests__/lookup.test.js` (static import + presence tests + lookup spread).
- Modify: `src/__tests__/sections.test.jsx` (static import + lookup spread).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Purpose:** Stand up the second section file for Section 12 with stub exports so the 3 ingestion chapters in Tasks 3-5 can each be a single-file Edit. Also wire the 2-file Promise.all loader once, so chapter tasks don't have to touch `learn-ai.jsx`. Pattern mirrors M1's "Create rag-foundations.jsx scaffold + register loader" infrastructure task.

- [ ] **Step 1: Create `src/sections/rag-ingestion.jsx`**

Create the new file with React imports (matching the pattern used in `rag-foundations.jsx`) and 3 stub exports. Each stub takes `ctx` and returns an empty fragment - just enough for `typeof === "function"` presence tests to pass before chapters are implemented in Tasks 3-5.

```jsx
import React from "react";
import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

export const ParsingExtraction = (_ctx) => <></>;
export const DeduplicationCleaning = (_ctx) => <></>;
export const RefreshSync = (_ctx) => <></>;
```

(The exact import list should match the imports `rag-foundations.jsx` uses - copy that file's import block. If `Reveal`/`Box`/`T`/`C` are imported from different paths there, mirror it.)

- [ ] **Step 2: Update `src/learn-ai.jsx` Section 12 loader**

Find the `sectionLoaders` mapping in `learn-ai.jsx`. The M1 entry for Section 12 looks something like `12: () => import("./sections/rag-foundations.jsx"),`. Replace it with a 2-file Promise.all that merges both modules' namespaces:

```js
  12: () =>
    Promise.all([
      import("./sections/rag-foundations.jsx"),
      import("./sections/rag-ingestion.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
```

This shape is the same one Sections 8, 9, 10, 11 use when they span multiple files. Each `mod` is a module namespace whose own-enumerable properties are the named exports; `Object.assign({}, ...mods)` flattens them into a single lookup-compatible object.

- [ ] **Step 3: Update `src/__tests__/lookup.test.js`**

Add a static import for the new file at the top alongside the other section namespace imports:

```js
import * as RagIngestion from "../sections/rag-ingestion.jsx";
```

Find the test's `lookup` object (the spread of all section namespaces). Add `...RagIngestion` immediately after `...RagFoundations` so the generic "every chapter component exists in lookup" test can resolve the future ingestion chapters once they're in config.

Add presence assertions for each ingestion stub (these guarantee the scaffold exposes the three expected names):

```js
describe("RagIngestion exports", () => {
  it("exposes ParsingExtraction", () => {
    expect(typeof RagIngestion.ParsingExtraction).toBe("function");
  });
  it("exposes DeduplicationCleaning", () => {
    expect(typeof RagIngestion.DeduplicationCleaning).toBe("function");
  });
  it("exposes RefreshSync", () => {
    expect(typeof RagIngestion.RefreshSync).toBe("function");
  });
});
```

- [ ] **Step 4: Update `src/__tests__/sections.test.jsx`**

Add a static import at the top:

```js
import * as RagIngestion from "../sections/rag-ingestion.jsx";
```

Find the `lookup` object in this test file (which spreads each section namespace for the generic per-chapter render test). Add `...RagIngestion` alongside `...RagFoundations`.

No content-test `describe` blocks for the ingestion chapters yet - those go in Tasks 3-5 once chapters are real. The stubs return `<></>`, which the generic per-chapter render test would normally iterate; however, the generic test iterates `chapters[]` from config and the ingestion chapters are not yet in config, so nothing tries to render the stubs.

- [ ] **Step 5: Run tests to verify pass**

```bash
npm run test
```

Expected: PASS. The stubs are valid functions, the lookup includes the new namespace, and no chapter in config references the new names yet, so nothing tries to render an empty fragment.

If any test fails, the most likely cause is the import-path or named-export name mismatching what `learn-ai.jsx` expects. Trace the failure to the right file.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

Expected: clean. If `npm run format` modifies files, re-stage them.

- [ ] **Step 7: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new (the new `rag-ingestion.jsx`, `learn-ai.jsx`, `lookup.test.js`, `sections.test.jsx`). If any file outside the list appears, abort: either move the change to the correct task or revert it.

- [ ] **Step 8: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones touched in this task.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-ingestion.jsx src/learn-ai.jsx src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Add rag-ingestion.jsx scaffold and 2-file loader for Section 12"
```

---

## Task 3: Implement Chapter 12.4 ParsingExtraction

**Files:**
- Modify: `src/sections/rag-ingestion.jsx` (replace stub `ParsingExtraction` export with full implementation).
- Modify: `src/config.js` (append chapter entry after `12.3`).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 4).
- Modify: `src/__tests__/sections.test.jsx` (append content tests for `ParsingExtraction`).
- Modify: `src/data/svg-descriptions.json` (add entries for any new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Show that before chunking, raw sources (PDFs, HTML, DOCX, Confluence) must be turned into clean text + metadata. Each format has failure modes (PDF 2-column, tables, OCR; HTML boilerplate; missing metadata). Walk away knowing the 5 parsing failure modes that silently kill recall before any chunker runs. Bad parsing is unrecoverable - no chunker, reranker, or LLM fixes garbage text.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.red) - The garbage-in problem**
  Title: "Bad Parsing Is Unrecoverable - The Garbage-In Problem"
  Visual: scanned PDF rendered as image. Naive parser returns OCR errors: `"Pgssword resel: cIick the link"`. Show the broken text → chunks of nonsense → embedding vector that doesn't match the query "How do I reset my password?". Red callout: "No chunker, reranker, or LLM fixes this. The recall is gone before chunking starts."
  Key content: "garbage", "unrecoverable", "OCR", "PDF", "cannot recover" or "broken text".

- **sub=1 (C.cyan) - The source zoo**
  Title: "Production RAG Ingests From 5+ Format Families"
  Visual: 5-card horizontal grid. Each card: format name (title-case), one-line description, parser tool example. Cards:
  - PDFs: "Manuals, contracts, research papers." Tool: "PyMuPDF / Unstructured / Docling"
  - HTML: "Web pages, wikis, public docs." Tool: "Readability / Trafilatura"
  - DOCX / PPTX: "Internal docs, slide decks." Tool: "python-docx / Unstructured"
  - Markdown: "Engineering docs, READMEs, knowledge bases." Tool: "Native parsers (mistletoe, marko)"
  - Structured APIs: "Confluence, Notion, Salesforce, Zendesk, Jira." Tool: "Vendor SDK or REST connector"
  Cards use tinted background `${C.cyan}06`, border `1px solid ${C.cyan}12`, `textAlign: "center"`.
  Key content: "PDF", "HTML", "DOCX", "Markdown", "Confluence" or "Notion", "parser" or "tool" or "connector", "5" or "five".

- **sub=2 (C.purple) - PDF: where parsers go to die**
  Title: "PDF: Three Failure Modes That Silently Wreck Recall"
  Visual: 3-row layout. Each row shows a PDF failure with before/after text.
  Row 1: 2-column physics paper layout. Naive parser reads left col then right col as one stream → jumbled sentences mixing topic A with topic B. "Before: Section 2.1 The model is trained on... Method We use stochastic gradient. After: 'The model is trained on Method We use stochastic gradient...'". Fix: layout-aware parser (Unstructured, Docling).
  Row 2: 5x3 table in a financial report. Naive parser flattens to `"Q1, Q2, Q3, Revenue, 100, 110, 105, Costs, 80, 75, 78"` losing the column-header relationship. Fix: table-extracting parser (LlamaParse, Unstructured `partition_table`).
  Row 3: scanned receipt PDF, OCR returns `"rn"` instead of `"m"` and skips diacritics → "amount due" becomes "arnount due". Fix: better OCR (Tesseract 5, AWS Textract, Azure Document Intelligence).
  Side panel: "Tool choice matters. Production RAG uses layout-aware + table-aware + OCR-aware parsers, not pdf2text."
  Key content: "two-column" or "2-column", "table", "OCR", at least one of "Unstructured" / "Docling" / "PyMuPDF" / "LlamaParse" / "Tesseract".

- **sub=3 (C.orange) - HTML: strip boilerplate, keep content**
  Title: "HTML: Strip The Boilerplate Or Dilute Your Chunks"
  Visual: stylized web page mockup as SVG. 4 zones:
  - Top nav bar (red overlay, "DROP")
  - Left sidebar with ads (red, "DROP")
  - Main article zone (green, "KEEP")
  - Footer with newsletter signup + © notice (red, "DROP")
  Below the mockup: 2 chunk comparisons.
  - Bad chunk (no boilerplate strip): `"Home Products Pricing Subscribe to our newsletter | How do I reset my password? Click the link in your email... © 2024 Acme Inc."`
  - Good chunk (with Readability): `"How do I reset my password? Click the link in your email within 24 hours to set a new password..."`
  Side panel: "Tools: Readability, Trafilatura, BoilerNet. They detect main-content zones via DOM heuristics + ML. Without them, retrieval matches 'subscribe' instead of the actual answer."
  Key content: "HTML" or "web page", "boilerplate" / "nav" / "sidebar" / "footer", "Readability" or "Trafilatura" or "main content", "dilute" or "pollute".

- **sub=4 (C.yellow) - Metadata: not optional**
  Title: "Metadata Extraction: The Required Sidecar"
  Visual: a TEXT artifact block (NOT a code block - styled monospace with tinted background `${C.yellow}06`, border `1px solid ${C.yellow}12`, label "Metadata Schema" at top, placeholders highlighted in `${C.cyan}`):
  ```
  {
    "source_url": "https://docs.example.com/account/password-reset",
    "title": "Reset Your Password",
    "doc_type": "kb_article",
    "section_path": "Account > Security > Password",
    "updated_at": "2026-04-12T14:22:00Z",
    "author": "support-team",
    "permissions": ["public", "logged-in"],
    "language": "en",
    "version": "v3.1"
  }
  ```
  Below the artifact: 4 use cases, each as a labeled row:
  - "Filtering (covered in Section 11.20): `updated_at > 2026-01-01` to exclude stale docs."
  - "Citations (covered in chapter 12.24): the source_url lets the LLM cite where the answer came from."
  - "Permission gating: never retrieve docs whose permissions don't include the current user's role."
  - "Multilingual routing: detect language at ingest time, route to per-language indexes."
  Side panel: "Metadata is parsed at ingest, attached to every chunk vector, and queried at retrieval time. Skip it = no filtering, no citations, no permission boundaries."
  Key content: "metadata", "source_url" or "URL", "updated_at" or "timestamp", "permissions" or "ACL" or "access control", "filtering" or "citation" or "gating".

- **sub=5 (C.green) - The 5 parsing failure modes checklist**
  Title: "The Five Parsing Failures Every Production RAG Must Handle"
  Visual: a 5-row decision table. Columns: "Failure Mode" | "Symptom" | "Fix". Rows:
  1. "Two-Column PDF Layout" | "Sentences jumbled across columns" | "Layout-aware parser (Unstructured, Docling)"
  2. "Tables Flattened To Prose" | "Lost row/column structure" | "Table-extracting parser (LlamaParse, Unstructured.partition_table)"
  3. "Scanned PDF / OCR Errors" | "Garbled tokens (rn → m, missing diacritics)" | "Modern OCR (Tesseract 5, AWS Textract)"
  4. "HTML Boilerplate Not Stripped" | "Chunks polluted with nav/ads/footers" | "Readability / Trafilatura extraction"
  5. "Missing Or Sparse Metadata" | "No filtering, citations, or permission gating possible" | "Mandatory metadata schema at ingest"
  Bottom callout (large, centered): "Every production RAG has this checklist. Skip one row = silent recall killer. Bad parsing is the gap reranker cannot fix."
  Key content: "five" or "5", "checklist" or "failure mode", "silent" or "unrecoverable", "recall".

- [ ] **Step 1: Write content tests for 12.4**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ParsingExtraction (12.4) content", () => {
  const fn = RagIngestion.ParsingExtraction;

  it("sub=0 frames the garbage-in problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/garbage|unrecoverable/i);
    expect(container.textContent).toMatch(/OCR|broken text|PDF/i);
    expect(container.textContent).toMatch(/password/i);
  });

  it("sub=1 lists 5+ source format families", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/PDF/);
    expect(container.textContent).toMatch(/HTML/);
    expect(container.textContent).toMatch(/DOCX/);
    expect(container.textContent).toMatch(/Markdown/);
    expect(container.textContent).toMatch(/Confluence|Notion|API/);
  });

  it("sub=2 shows three PDF failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/two[- ]?column|2[- ]?column/i);
    expect(container.textContent).toMatch(/table/i);
    expect(container.textContent).toMatch(/OCR/);
    expect(container.textContent).toMatch(/Unstructured|Docling|PyMuPDF|LlamaParse|Tesseract/);
  });

  it("sub=3 contrasts HTML boilerplate vs main content", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/boilerplate|nav|sidebar|footer/i);
    expect(container.textContent).toMatch(/Readability|Trafilatura/);
    expect(container.textContent).toMatch(/dilut|pollut|main content/i);
  });

  it("sub=4 shows the metadata schema artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/metadata/i);
    expect(container.textContent).toMatch(/source_url|URL/i);
    expect(container.textContent).toMatch(/updated_at|timestamp/i);
    expect(container.textContent).toMatch(/permissions|ACL/i);
  });

  it("sub=5 lists the 5 parsing failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/five|5/i);
    expect(container.textContent).toMatch(/checklist|failure mode/i);
    expect(container.textContent).toMatch(/silent|recall/i);
  });
});
```

Also extend the Section 12 config test in `src/__tests__/config.test.js`. Update the expected count to 4 and append the new entry:

```js
describe("Section 12 chapters", () => {
  it("has chapters 12.1 through 12.4 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(4);
    const expected = [
      { id: "12.1", component: "WhyLLMsNeedRetrieval", title: "Why LLMs Need Retrieval" },
      { id: "12.2", component: "NaiveRAGPipeline", title: "The Naive RAG Pipeline" },
      { id: "12.3", component: "WhereNaiveRAGBreaks", title: "Where Naive RAG Breaks" },
      { id: "12.4", component: "ParsingExtraction", title: "Parsing - Raw Sources to Clean Text" },
    ];
    expected.forEach((exp, i) => {
      expect(section12[i].id).toBe(exp.id);
      expect(section12[i].component).toBe(exp.component);
      expect(section12[i].title).toBe(exp.title);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ParsingExtraction"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected for `sections.test.jsx`: FAIL - the stub returns `<></>` so no asserted strings appear.
Expected for `config.test.js`: FAIL - section12.length is 3, not 4.

- [ ] **Step 3: Implement the full ParsingExtraction chapter**

Edit `src/config.js`. Insert the new entry immediately after the 12.3 entry:

```js
  { id: "12.3", title: "Where Naive RAG Breaks", section: 12, component: "WhereNaiveRAGBreaks" },
  { id: "12.4", title: "Parsing - Raw Sources to Clean Text", section: 12, component: "ParsingExtraction" },
```

Edit `src/sections/rag-ingestion.jsx`. Replace the `ParsingExtraction` stub with the full implementation. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (red, cyan, purple, orange, yellow, green).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Two-Column PDF Layout", "Tables Flattened To Prose", etc.
- Inner element tinted backgrounds: `background: \`${C.X}06\`` and `border: \`1px solid ${C.X}12\``.
- The 5-card grid in sub=1 must use CSS grid: `display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12` (or `repeat(auto-fit, minmax(180px, 1fr))` for mobile-safety).
- The HTML mockup in sub=3 MUST be an SVG with non-overlapping zones for nav/sidebar/main/footer. Add `<desc>` first child + manifest entry.
- The metadata JSON artifact in sub=4 must be visually distinct from a code block (tinted bg, soft border, monospace 14-16px). Placeholder field names (e.g., `source_url`, `updated_at`) styled in `C.cyan`.
- The 5-row table in sub=5 may be an HTML `<table>` or a CSS grid. Title-case headers.
- No em-dashes. No "Preview:" / "Next:" forward refs.
- Body text 16-19px, titles 22px.
- Content must include the strings the tests assert on (see test regexes in Step 1).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ParsingExtraction"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

Count SVGs introduced in this chapter:

```bash
grep -c "<svg" src/sections/rag-ingestion.jsx
```

Likely 1-2 (the HTML mockup in sub=3; optionally a diagram in sub=0 or sub=5). Add an entry to `src/data/svg-descriptions.json` under key `"12.4"`:

```json
"12.4": [
  "Stylized web page mockup showing four colored zones: a top nav bar in red marked DROP, a left sidebar with ads in red marked DROP, a central main article zone in green marked KEEP, and a bottom footer with newsletter signup in red marked DROP"
]
```

Add more entries to the array if additional SVGs were used.

Run the SVG-descriptions validation test:

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

Expected: all green. If `npm run format` modifies files, re-stage them.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-ingestion.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.4 Parsing - Raw Sources to Clean Text"
```

---

## Task 4: Implement Chapter 12.5 DeduplicationCleaning

**Files:**
- Modify: `src/sections/rag-ingestion.jsx` (replace stub `DeduplicationCleaning` export with full implementation).
- Modify: `src/config.js` (append chapter entry after `12.4`).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 5).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Same doc indexed multiple times pollutes top-k results, wastes context-window budget, and kills diversity in retrieval. Show 3 dedup strategies (exact-hash, MinHash+LSH near-dup, embedding-cosine paraphrase) plus the cleaning steps (Unicode, encoding, PII scrubbing, watermark stripping) that decide whether eval scores stabilize. Walk away knowing which dedup strategy to apply per data source.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - The duplicate disaster**
  Title: "The Same Article In Three Systems Eats Your Context Budget"
  Visual: 3 source-system icons (Zendesk, Confluence, Notion) each containing the same "Reset Your Password" KB article. Arrow flow: all 3 → ingestion → 3 nearly-identical chunks in the vector DB. Query "How do I reset my password?" → top-5 retrieval returns 3× duplicate-password chunks + 2 unrelated. Visualize a context-window bar: 3 chunks of ~512 tokens each = 1,536 tokens wasted on duplicates, leaving 2,560 tokens for distinct answers. Red callout: "3× same answer = wasted tokens, no diversity, and the LLM has nothing to triangulate against."
  Key content: "duplicate" or "copies" or "redundant", "Zendesk" / "Confluence" / "Notion", "context" / "tokens" / "budget", "diversity".

- **sub=1 (C.cyan) - Exact-match dedup with SHA-256**
  Title: "Exact-Hash Dedup: Cheap And Catches The Easy 80%"
  Visual: 3-step flow shown left-to-right:
  Step 1 (Normalize): doc text → strip whitespace, lowercase, remove punctuation → `"reset your password click the link"`.
  Step 2 (Hash): normalized text → SHA-256 → hex digest like `a3f2b9...`.
  Step 3 (Dedup): hash table lookup. New doc hash matches existing → drop. New hash → keep.
  Show 3 docs (Zendesk copy, Confluence copy, Notion copy) all producing the same hash `a3f2b9...` → 2 dropped, 1 kept.
  Centered monospace formula: `hash = sha256(normalize(doc.content))`
  Tradeoff line: "Cost: O(N) hash compute + O(1) lookup. Misses: 'same content with one typo fixed' produces a different hash."
  Key content: "exact" or "hash", "SHA-256", "normalize", "byte-identical" or "same hash".

- **sub=2 (C.purple) - Near-dup dedup with MinHash + LSH**
  Title: "MinHash + LSH: Catching Near-Duplicates"
  Visual: 2 docs side-by-side.
  - Doc A: "Reset your password by clicking the link in your email within 24 hours."
  - Doc B: "Reset the password by clicking the link in your email within 24 hours." (one word different)
  SHA: different hashes → exact dedup misses.
  Show the MinHash flow:
  Step 1: tokenize into 3-gram shingles. Doc A: `{"reset your password", "your password by", "password by clicking", ...}`. Doc B: similar set with one different shingle.
  Step 2: MinHash signature of K=128 hash functions over each shingle set. Doc A signature ≈ Doc B signature for ~125/128 positions → Jaccard estimate ~0.97.
  Step 3: LSH banding (bands=16, rows=8). Both docs hash into the SAME bucket because most band-rows match. Bucket query → "candidate near-duplicate pair found".
  Side panel: "MinHash + LSH = sub-linear near-dup detection at scale (1B docs feasible). Threshold tuneable via Jaccard cutoff (e.g., 0.85)."
  Key content: "MinHash", "LSH" or "locality-sensitive", "Jaccard", "shingle", "near-dup" or "near.duplicate", a decimal number like "0.85" or "0.97".

- **sub=3 (C.orange) - Embedding-cosine dedup for paraphrases**
  Title: "Embedding Dedup: The Only Way To Catch Paraphrases"
  Visual: 2 docs with the same MEANING but different WORDS:
  - KB article (formal): "To reset your password, click the password reset link delivered to your registered email address."
  - Forum post (casual): "Yo if you forgot your password just hit the reset thing they sent to your email."
  MinHash misses (almost no shingles overlap). Embedding cosine = 0.94 → flagged as semantic duplicate.
  Show a similarity ladder:
  - cosine ≥ 0.97 → "Definite duplicate, drop one"
  - 0.90 ≤ cosine < 0.97 → "Near-dup, send for human review"
  - 0.85 ≤ cosine < 0.90 → "Topically similar, keep both"
  - cosine < 0.85 → "Distinct, keep"
  Cost note: embedding pass over the full corpus adds $0.10/1M tokens × corpus size. For 10M docs at 512 tokens each = 5B tokens = $500 just to dedup. Cheaper than embedding twice but real.
  Side panel: "Use embedding dedup when corpus has paraphrases (KB + forum posts, multi-author docs, translations). Skip when content is byte-stable (PDFs from authoritative sources)."
  Key content: "embedding" or "cosine", "paraphrase" or "semantic", a decimal number like "0.94" or "0.97", "human review" or "threshold", "$" or "cost".

- **sub=4 (C.green) - Cleaning beyond dedup**
  Title: "Cleaning: The Unsexy 30% That Decides Whether Eval Stabilizes"
  Visual: 4-card grid. Each card has title (title-case), one-line description, and a tiny before/after example.
  Card 1: "Unicode Normalization (NFC)"
    "Two strings that look identical can have different byte sequences."
    Before: `café` (composed) vs `café` (decomposed). After NFC: identical bytes.
  Card 2: "Encoding Fix-Up"
    "Mojibake from latin-1 / UTF-8 mix breaks tokenization."
    Before: `"naïve résumé"` rendered as `"naïve résumé"`. After: original characters restored.
  Card 3: "Strip Headers, Footers, Page Numbers, Watermarks"
    "Boilerplate per page bloats chunks with noise."
    Before: every chunk starts with "CONFIDENTIAL - DRAFT 2026 - Page 3 of 47". After: stripped.
  Card 4: "PII Scrubbing"
    "Emails, SSNs, phone numbers, credit cards leak into the index."
    Before: "Contact john@acme.com or call 555-1234". After: "Contact [EMAIL_REDACTED] or call [PHONE_REDACTED]". Tool: regex + LLM-based NER (e.g., Presidio).
  Bottom callout: "Cleaning is invisible when it works and catastrophic when skipped. Stabilizes eval scores by removing irrelevant tokens that fool similarity metrics."
  Key content: "Unicode" or "NFC", "encoding" or "mojibake", "header" / "footer" / "watermark" / "page number", "PII" or "redact" or "SSN" or "email" or "Presidio".

- [ ] **Step 1: Write content tests for 12.5**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("DeduplicationCleaning (12.5) content", () => {
  const fn = RagIngestion.DeduplicationCleaning;

  it("sub=0 frames the duplicate-disaster context-budget waste", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/duplicate|copies/i);
    expect(container.textContent).toMatch(/Zendesk|Confluence|Notion/);
    expect(container.textContent).toMatch(/context|tokens|budget/i);
    expect(container.textContent).toMatch(/diversity/i);
  });

  it("sub=1 shows exact-hash dedup with SHA-256", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/SHA[- ]?256/);
    expect(container.textContent).toMatch(/normalize/i);
    expect(container.textContent).toMatch(/hash/i);
  });

  it("sub=2 explains MinHash + LSH for near-duplicates", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/MinHash/i);
    expect(container.textContent).toMatch(/LSH|locality/i);
    expect(container.textContent).toMatch(/Jaccard|shingle/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 introduces embedding-cosine dedup for paraphrases", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/embedding|cosine/i);
    expect(container.textContent).toMatch(/paraphrase|semantic/i);
    expect(container.textContent).toMatch(/0\.9\d?/);
  });

  it("sub=4 lists the 4 cleaning steps beyond dedup", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Unicode|NFC/);
    expect(container.textContent).toMatch(/encoding|mojibake/i);
    expect(container.textContent).toMatch(/header|footer|watermark/i);
    expect(container.textContent).toMatch(/PII|redact|SSN/i);
  });
});
```

Update `src/__tests__/config.test.js` Section-12 test to expect 5 entries:

```js
expect(section12.length).toBe(5);
// add to expected:
{ id: "12.5", component: "DeduplicationCleaning", title: "Deduplication & Cleaning" },
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DeduplicationCleaning"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full DeduplicationCleaning chapter**

Add config entry after `12.4`:

```js
  { id: "12.5", title: "Deduplication & Cleaning", section: 12, component: "DeduplicationCleaning" },
```

Replace the `DeduplicationCleaning` stub in `src/sections/rag-ingestion.jsx`. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (red, cyan, purple, orange, green).
- The 3-source-system diagram in sub=0 should be SVG (3 system icons → ingestion → 3 chunks → context-window bar). Add `<desc>` + manifest entry.
- The MinHash + LSH flow in sub=2 should be SVG showing shingles → 128-signature → LSH bucketing. Add `<desc>` + manifest entry.
- The similarity ladder in sub=3 may be HTML rows or SVG; either way, the 4 cosine bands must be clearly stratified.
- The 4-card grid in sub=4 uses `gridTemplateColumns: "repeat(2, 1fr)", gap: 12` (2×2 layout) for clean alignment.
- Tinted artifact for the SHA-256 formula in sub=1 (centered, monospace, `${C.cyan}06` bg).
- Title-case for all diagram box text. No em-dashes. No forward refs.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DeduplicationCleaning"
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.5": [
  "Three source systems (Zendesk, Confluence, Notion) each containing the same password-reset article flowing into an ingestion pipeline that produces three nearly-identical chunks in the vector DB, with a context-window bar below showing 1,536 tokens wasted on duplicates",
  "MinHash + LSH flow showing two near-duplicate docs being tokenized into 3-gram shingles, processed through a 128-function MinHash signature with Jaccard estimate around 0.97, and bucketed by LSH banding (16 bands, 8 rows) into the same candidate bucket"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

Expected: all green.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-ingestion.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.5 Deduplication & Cleaning"
```

---

## Task 5: Implement Chapter 12.6 RefreshSync

**Files:**
- Modify: `src/sections/rag-ingestion.jsx` (replace stub `RefreshSync` export with full implementation).
- Modify: `src/config.js` (append chapter entry after `12.5`).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 6).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Docs change. Index goes stale. RAG hallucinates with confidence on outdated content. Show 3 sync strategies (full re-index, webhook-driven incremental, polling on `updated_at`) and the delete-propagation + versioning problem that 90% of in-house RAG systems get wrong on day one.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - The stale-index problem**
  Title: "Stale RAG Hallucinates With Confidence"
  Visual: a timeline. 2026-04-12: customer support team publishes "Reset Your Password" v1 (no MFA mention). 2026-05-01: they edit to v2 (adds "MFA setup is preserved through password reset"). RAG ingested v1, never re-ingested. 2026-05-10: customer asks "Do I lose my MFA after password reset?". RAG returns v1 chunk → LLM answers "MFA may need re-setup" (WRONG - v2 says it persists). Visualize: source-of-truth doc (green, v2) vs index doc (red, stale v1). Customer trust hit.
  Bottom callout: "Every doc has an expiry date. Stale answers feel correct because the LLM is confident. There is no automatic stale signal."
  Key content: "stale" or "outdated", "edit" / "updated" / "version", "MFA" or "password reset", "hallucinate" or "wrong" or "confident".

- **sub=1 (C.cyan) - Full re-index: the heavy hammer**
  Title: "Strategy 1: Full Re-Index On A Schedule"
  Visual: 2-panel layout.
  Left panel (Mechanism): nightly cron at 2 AM → fetch all 10,000 docs from source → re-parse → re-chunk → re-embed → swap into a shadow index → atomic pointer flip at 6 AM. No retrieval gap if shadow-index pattern is used; otherwise 4-hour downtime.
  Right panel (Math): per-night cost = 10K docs × 1K tokens/doc × $0.10/1M tokens = $1/night ≈ $30/month. At 1M docs scale: $3,000/month just for re-embedding.
  Decision card at bottom: "Use full re-index if: corpus is small (<10K docs), changes are infrequent (weekly batch updates), simplicity beats freshness. Avoid if: real-time updates needed, corpus large enough for re-embed to dominate budget."
  Key content: "full re-index" or "rebuild", "nightly" or "cron" or "batch", "shadow" or "atomic", "$" or "cost", "3000" or "30", "simple" or "simplicity".

- **sub=2 (C.purple) - Incremental with webhooks**
  Title: "Strategy 2: Webhook-Driven Incremental Sync"
  Visual: sequence diagram (top-to-bottom timeline).
  T=0:00 - User edits doc-1 password-reset article in Confluence.
  T=0:01 - Confluence fires webhook POST to ingestion service: `{event: "page.updated", page_id: "doc-1", revision: 42}`.
  T=0:02 - Ingestion service fetches doc-1 v42 from Confluence API.
  T=0:05 - Re-parse → re-chunk → re-embed (3 chunks, ~150ms total).
  T=0:08 - Upsert chunks in vector DB (referencing Section 11.21 deletes/updates). Old chunks dropped, new chunks inserted, same `doc_id`.
  T=0:10 - Fresh chunks queryable. Total propagation lag: ~10 seconds.
  Side panel: "Pros: real-time freshness, no wasted re-embedding on unchanged docs. Cons: requires webhook support in source system (Confluence yes, raw S3 no), retry / DLQ handling for webhook failures, idempotent upserts to avoid duplicate writes."
  Key content: "webhook", "incremental", "upsert", "11.21" or "deletes", "seconds" or "real-time".

- **sub=3 (C.orange) - Polling on updated_at**
  Title: "Strategy 3: Polling - The Fallback For Webhook-Less Sources"
  Visual: timeline showing poll cadence.
  Ingestion service tracks `last_synced_at = 2026-05-10T14:00:00Z` per source.
  Every 15 minutes: query source API `WHERE updated_at > 2026-05-10T14:00:00Z LIMIT 1000`.
  Returns 7 changed docs since last poll. Process them. Update `last_synced_at` to the max `updated_at` in the batch.
  Edge-case visualization: doc-12 edited at t=2 min (between polls). Picked up at t=15 min. Freshness lag = 13 min on average, 15 min worst case.
  Decision card at bottom: "Use polling when: source has no webhooks but has a queryable `updated_at` field (most REST APIs, SQL databases). Tune the poll interval to your freshness budget. Cost: API calls every interval whether or not anything changed. Throttle to source's rate limits."
  Key content: "poll" or "polling", "updated_at" or "timestamp", "15" or "interval", "lag" or "delay", "rate limit" or "throttle".

- **sub=4 (C.yellow) - Delete propagation + versioning**
  Title: "Delete Propagation And Versioning: Where 90% Of In-House RAG Breaks"
  Visual: 3-row timeline diagram.
  Row 1 (t=0): doc-1 v1 indexed. Chunks `[c1_v1, c2_v1, c3_v1]` queryable. Tag: `status=active`.
  Row 2 (t=+1min, during re-embed): doc-1 v2 ingested. Chunks `[c1_v2, c2_v2, c3_v2]` inserted with `status=active`. Old v1 chunks tagged `status=deprecated` but NOT dropped yet (otherwise retrieval has a gap during the re-embed window). Queries still hit v1 OR v2.
  Row 3 (t=+15min, after grace period): v1 chunks dropped. Only v2 active.
  Plus a fourth scenario: doc-1 DELETED at source. Webhook fires `event: "page.deleted"` → tombstone in vector DB → propagation to all replicas → 100% remove (covered in Section 11.21).
  Side panel: "Without delete propagation: deleted docs still served (ghost chunks). Without versioning: retrieval gap during re-embed. Both are silent failures - eval catches them, customers don't."
  Bottom callout: "Build delete propagation + versioning from day one. Retro-fitting them after launch costs 10x the dev time."
  Key content: "delete" or "deletion" or "tombstone", "ghost" or "stale", "version" or "v1" or "v2", "grace period" or "propagation", "11.21" or "Section 11".

- [ ] **Step 1: Write content tests for 12.6**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("RefreshSync (12.6) content", () => {
  const fn = RagIngestion.RefreshSync;

  it("sub=0 frames the stale-index hallucination problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/stale|outdated/i);
    expect(container.textContent).toMatch(/MFA|password reset/i);
    expect(container.textContent).toMatch(/hallucinate|wrong|confident/i);
  });

  it("sub=1 explains full re-index cost and tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/full re[- ]?index|rebuild/i);
    expect(container.textContent).toMatch(/nightly|cron|batch/i);
    expect(container.textContent).toMatch(/\$|cost/);
    expect(container.textContent).toMatch(/shadow|atomic|swap/i);
  });

  it("sub=2 details webhook-driven incremental sync", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/webhook/i);
    expect(container.textContent).toMatch(/incremental|upsert/i);
    expect(container.textContent).toMatch(/seconds|real[- ]?time/i);
    expect(container.textContent).toMatch(/11\.21|deletes/);
  });

  it("sub=3 details polling on updated_at with interval lag", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/poll/i);
    expect(container.textContent).toMatch(/updated_at|timestamp/i);
    expect(container.textContent).toMatch(/15|interval/i);
    expect(container.textContent).toMatch(/lag|delay/i);
  });

  it("sub=4 covers delete propagation and versioning", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/delete|tombstone/i);
    expect(container.textContent).toMatch(/version|v1|v2/i);
    expect(container.textContent).toMatch(/grace|propagation/i);
    expect(container.textContent).toMatch(/11\.21|Section 11/);
  });
});
```

Update config test to expect 6 entries (append `{ id: "12.6", component: "RefreshSync", title: "Refresh & Sync Schedules" }`).

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RefreshSync"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full RefreshSync chapter**

Add config entry after `12.5`:

```js
  { id: "12.6", title: "Refresh & Sync Schedules", section: 12, component: "RefreshSync" },
```

Replace the `RefreshSync` stub in `src/sections/rag-ingestion.jsx`. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (red, cyan, purple, orange, yellow).
- The stale-timeline visualization in sub=0 should be SVG (3 time markers, v1/v2 side-by-side comparison). Add `<desc>` + manifest entry.
- The sequence diagram in sub=2 MUST be SVG (top-to-bottom flow with T=0:00, T=0:01, T=0:02, T=0:05, T=0:08, T=0:10 time markers). Add `<desc>` + manifest entry.
- The polling timeline in sub=3 can be SVG or HTML; the 15-min poll cadence + lag-window must be visible.
- The 3-row timeline diagram in sub=4 MUST be SVG with clearly stratified rows for t=0, t=+1min, t=+15min. The overlap window must be visually obvious. Add `<desc>` + manifest entry.
- 2-panel layout in sub=1 uses `gridTemplateColumns: "1fr 1fr", gap: 16`. Decision card centered below.
- Title-case for all diagram box text. No em-dashes. No forward refs.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RefreshSync"
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.6": [
  "Timeline showing a password-reset article version v1 published on 2026-04-12, edited to v2 on 2026-05-01 adding MFA-preservation note, with a stale-index v1 chunk being retrieved on 2026-05-10 causing the LLM to give the wrong answer",
  "Webhook-driven incremental sync sequence diagram with time markers T=0:00 through T=0:10 showing user edit, Confluence webhook fire, ingestion fetch, re-parse and re-chunk and re-embed, upsert into vector DB referencing Section 11.21 deletes-updates, and final queryable state",
  "Three-row versioning timeline showing doc-1 v1 chunks active at t=0, both v1 (deprecated) and v2 (active) chunks present during the t=+1min re-embed window for retrieval-gap avoidance, and only v2 active at t=+15min after the grace period"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-ingestion.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.6 Refresh & Sync Schedules"
```

---

## Task 6: Implement Chapter 12.7 WhyChunkFixedSize

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `WhyChunkFixedSize` at the end of file).
- Modify: `src/config.js` (append chapter entry after `12.6`).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 7).
- Modify: `src/__tests__/sections.test.jsx` (append content tests for `WhyChunkFixedSize`).
- Modify: `src/data/svg-descriptions.json` (add entries for any new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Combine "why chunk at all" (context window limits, retrieval granularity, the impossibility of one giant embedding) with the fixed-size baseline strategy (token-window with overlap, where it breaks). Walk away knowing why chunking is the highest-leverage decision and what the naive baseline gives you.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.red) - The whole-doc embedding is impossible**
  Title: "Why Can't We Just Embed The Whole Document?"
  Visual: a horizontal bar showing a 500-page product manual scaled to 250,000 tokens. Underneath, a much shorter bar showing the embedding model's input ceiling (8,192 tokens for OpenAI ada-3). Red "OVERFLOW" zone marked on the long bar where it exceeds the ceiling. Also: a single vector with `[0.21, 0.84, ...]` next to a question mark - "One vector for 500 pages? It would mean nothing specific."
  Key content: "250,000 tokens", "8,192 tokens" or "8192", "overflow", "one vector", "500 pages" or "500-page".

- **sub=1 (C.cyan) - Three reasons we must chunk**
  Title: "Three Reasons Production RAG Always Chunks"
  Visual: a 3-card horizontal grid. Each card has a title (title-case), an icon-like emoji-free glyph (just bold text or a colored bullet), and one-line text. Cards:
  - Context Limits: "Embedding models cap at 8K tokens; LLMs cap at context-window length."
  - Retrieval Granularity: "Top-K retrieval returns chunks, not whole docs. Smaller chunks = more focused matches."
  - Signal Dilution: "Averaging 500 pages into one vector buries any specific fact. Smaller chunks keep semantic density."
  Cards use tinted background `${C.cyan}06`, border `1px solid ${C.cyan}12`, `textAlign: "center"`.
  Key content: "context limits", "retrieval granularity", "signal dilution" or "dilution", "8K" or "8,000".

- **sub=2 (C.green) - Fixed-size baseline: the sliding window**
  Title: "Fixed-Size Chunking: A Sliding Window With Overlap"
  Visual: take doc-1 (the password reset article rendered as ~480 tokens of text in a wrapped block). Below it, three colored bars representing chunks of 128 tokens each, with 16-token overlap shaded darker between adjacent chunks. Each chunk labeled "Chunk 1 (tokens 0-128)", "Chunk 2 (tokens 112-240)", "Chunk 3 (tokens 224-352)", "Chunk 4 (tokens 336-464)". A centered monospace formula box: `chunks = slide(doc, size=128, overlap=16)`.
  Key content: "fixed-size" or "fixed size", "sliding window", "overlap", "128 tokens" or "128", "16" (overlap), "doc-1" or "password reset".

- **sub=3 (C.orange) - Where the cut lands matters: the mid-sentence break**
  Title: "Fixed-Size Cuts Land Anywhere - Including Mid-Sentence"
  Visual: zoom into doc-1 around the 128-token boundary. Show the actual prose: `"...click the reset link in the email within 24 hours to set a new"` and then on the next chunk `"password. The link expires after that..."`. Color the chunk boundary as a red vertical line slicing the sentence "set a new password" in half. Labels: "Chunk 1 ends mid-phrase" / "Chunk 2 starts mid-phrase". Below: a short red-tinted callout: "The chunk that ends with `set a new` has no idea what the user is setting. Retrieval cannot match `password reset expiry` to either piece alone."
  Key content: "mid-sentence" or "mid sentence", "password", "boundary" or "cut", "set a new password" (the example phrase split).

- **sub=4 (C.yellow) - Overlap softens the break but does not fix it**
  Title: "Overlap Helps - But Only Partially"
  Visual: side-by-side bar diagram. Left panel: overlap=0, chunks are clean rectangles with hard borders; the red mid-sentence break is highlighted. Right panel: overlap=16 tokens, chunks now share the `set a new password. The link expires` text in both adjacent chunks (visualized as a darker overlap band). Below each panel: a small table of consequences:
  - Left: "Cuts can lose context entirely", "Recall drops on cross-chunk facts".
  - Right: "Overlap = duplicate storage cost", "Overlap = ~12% more vectors at 128/16", "Still breaks long-range references (entity earlier in doc, pronoun later)".
  Key content: "overlap", "0" and "16" (or "16 tokens"), "duplicate" or "redundant", "12%" or similar overhead number.

- **sub=5 (C.purple) - When fixed-size is good enough; when to move on**
  Title: "Fixed-Size: The Baseline To Beat"
  Visual: a 2-column "use this if / move to better if" table.
  - Use Fixed-Size If: "Docs are short (< 2K tokens each).", "Content is homogeneous (uniform paragraphs).", "You need a baseline to measure other strategies against.", "Budget = zero engineering time."
  - Move To Structural / Semantic If: "Docs have clear structural markers (markdown, HTML headings).", "Content is heterogeneous (one doc = manual + FAQ + changelog).", "Cross-chunk facts hurt recall in your eval set."
  A small green check-mark column for the left, a small arrow column for the right, both center-aligned. Below: "Chapters 12.8-12.12 each fix one weakness of fixed-size."
  Key content: "baseline", "2K" or "2,000", "homogeneous" or "heterogeneous", "12.8" reference or "structural" / "semantic".

- [ ] **Step 1: Write content tests for 12.7**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("WhyChunkFixedSize (12.7) content", () => {
  const fn = RagFoundations.WhyChunkFixedSize;

  it("sub=0 shows why a whole-doc embedding is impossible", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/250,000|250000|500 pages?|500-page/i);
    expect(container.textContent).toMatch(/8,?192|8K/);
    expect(container.textContent).toMatch(/overflow|exceed|too (long|big)/i);
  });

  it("sub=1 lists the three reasons we must chunk", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context limits?/i);
    expect(container.textContent).toMatch(/granular/i);
    expect(container.textContent).toMatch(/dilut|signal/i);
  });

  it("sub=2 introduces the fixed-size sliding window on doc-1", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sliding window|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/128/);
    expect(container.textContent).toMatch(/doc-?1|password reset/i);
  });

  it("sub=3 shows the mid-sentence break on the password reset doc", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/mid[- ]?sentence|boundary|cut/i);
    expect(container.textContent).toMatch(/password/i);
    expect(container.textContent).toMatch(/set a new/i);
  });

  it("sub=4 compares overlap 0 vs overlap 16 with cost tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/0/);
    expect(container.textContent).toMatch(/16/);
    expect(container.textContent).toMatch(/duplicate|redundant|cost|more vectors/i);
  });

  it("sub=5 lists when fixed-size is enough vs when to move on", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/baseline/i);
    expect(container.textContent).toMatch(/homogeneous|heterogeneous/i);
    expect(container.textContent).toMatch(/structural|semantic/i);
  });
});
```

Also extend the Section 12 config test in `src/__tests__/config.test.js`. Find the existing Section-12 chapter test and update it to expect 7 entries:

```js
describe("Section 12 chapters", () => {
  it("has chapters 12.1 through 12.7 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(7);
    const expected = [
      { id: "12.1", component: "WhyLLMsNeedRetrieval", title: "Why LLMs Need Retrieval" },
      { id: "12.2", component: "NaiveRAGPipeline", title: "The Naive RAG Pipeline" },
      { id: "12.3", component: "WhereNaiveRAGBreaks", title: "Where Naive RAG Breaks" },
      { id: "12.4", component: "ParsingExtraction", title: "Parsing - Raw Sources to Clean Text" },
      { id: "12.5", component: "DeduplicationCleaning", title: "Deduplication & Cleaning" },
      { id: "12.6", component: "RefreshSync", title: "Refresh & Sync Schedules" },
      { id: "12.7", component: "WhyChunkFixedSize", title: "Why Chunk At All + Fixed-Size Baseline" },
    ];
    expected.forEach((exp, i) => {
      expect(section12[i].id).toBe(exp.id);
      expect(section12[i].component).toBe(exp.component);
      expect(section12[i].title).toBe(exp.title);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyChunkFixedSize"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected for `sections.test.jsx`: FAIL - "fn is not a function" because the export doesn't exist yet.
Expected for `config.test.js`: FAIL - section12.length is 6, not 7.

- [ ] **Step 3: Implement the full WhyChunkFixedSize chapter**

Edit `src/config.js`. Add the new entry immediately after `12.6`:

```js
  { id: "12.6", title: "Refresh & Sync Schedules", section: 12, component: "RefreshSync" },
  { id: "12.7", title: "Why Chunk At All + Fixed-Size Baseline", section: 12, component: "WhyChunkFixedSize" },
```

Edit `src/sections/rag-foundations.jsx`. Append a new export at the end of the file. Use the existing pattern from `WhereNaiveRAGBreaks` as the reference. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (red, cyan, green, orange, yellow, purple).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Sliding Window", "Mid-Sentence Break", "Use This If" - every word capitalized.
- Inner element tinted backgrounds: `background: \`${C.X}06\`` and `border: \`1px solid ${C.X}12\``.
- Body text 16-19px, titles 22px.
- No em-dashes.
- No "Preview:" / "Next:" / "Coming up:" forward references. (The "Chapters 12.8-12.12 each fix one weakness" line in sub=5 is allowed: it's a within-section signpost pointing to chapters listed in the visible TOC, not a "coming up" preview.)
- Standalone formulas centered with container `textAlign: "center"`.
- The fixed-size bar diagram in sub=2 may be implemented as either an SVG (preferred for precise overlap shading) or as nested `<div>`s with flex.
- The mid-sentence break visualization in sub=3 may also be SVG (recommended for the vertical red line slicing the prose) or styled HTML with a red border-left on the second chunk.
- The 3-card grid in sub=1 must NOT overlap. Use CSS grid: `display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12`.
- Content must include the strings the tests assert on (see test regexes in Step 1).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyChunkFixedSize"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json if new SVGs added**

If sub=0, sub=2, sub=3, or sub=4 used `<svg>` elements, list them in document order. For example:

```bash
grep -c "<svg" src/sections/rag-foundations.jsx
```

If the chapter introduced (say) 2 new SVGs, add an entry to `src/data/svg-descriptions.json` under key `"12.7"`:

```json
"12.7": [
  "Horizontal token-count bar showing a 500-page document at 250,000 tokens overflowing the 8,192-token embedding model ceiling, with the overflow region marked in red",
  "Wrapped paragraph of doc-1 password reset prose with four colored chunk bars below indicating 128-token windows and 16-token overlap zones in darker tint"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

Expected: all green.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.7 Why Chunk At All + Fixed-Size Baseline"
```

---

## Task 7: Implement Chapter 12.8 RecursiveStructuralChunking

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `RecursiveStructuralChunking`).
- Modify: `src/config.js` (append chapter entry after `12.7`).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 8).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Recursive structural chunking - try the most structural split first (`\n\n` paragraph breaks), fall back through `\n` (line) → `. ` (sentence) → ` ` (word). Preserves sentence and paragraph boundaries. This is the 80% baseline that most production RAG systems use as their default. The standard LangChain `RecursiveCharacterTextSplitter` works this way.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - The structural priority tree**
  Title: "Split By Structure, Not By Token Count"
  Visual: a vertical tree diagram. Top node: "Try Paragraph Break First (\\n\\n)". Below it (if too big, fall back to): "Try Line Break (\\n)". Below: "Try Sentence Break (. )". Bottom: "Last Resort: Word Break ( )". Arrows labeled "If Chunk Too Big". A side-panel callout: "Recursive = try the most structural separator first; only fall back if the resulting chunk still exceeds size limit."
  Key content: "structural" or "structure", "paragraph", "line", "sentence", "word", at least one of "\\n\\n" or "newline".

- **sub=1 (C.green) - The fixed-size disaster, revisited**
  Title: "Fixed-Size Breaks Doc-7 In The Wrong Places"
  Visual: take doc-7 (login troubleshooting article) shown as a heterogeneous markdown doc with three sections: `## Common Login Errors`, `## Browser Compatibility`, `## Resetting Account Lockout`. Each section has 2-3 short paragraphs. Apply fixed-size chunking (size=128, overlap=0) on top of this doc and show the resulting chunks: chunk 1 covers part of "Common Login Errors" + start of "Browser Compatibility" (a chunk spanning two unrelated topics). Color the cross-topic mixing zone red. Caption: "Chunk 2 mixes browser compatibility with account lockout - retrieval cannot answer either cleanly."
  Key content: "doc-7" or "login troubleshooting", "mixing" or "mixes" or "spans", "common login errors" or "browser compatibility" or "account lockout".

- **sub=2 (C.purple) - Recursive structural pass on the same doc**
  Title: "Recursive Structural Splits The Same Doc Cleanly"
  Visual: same doc-7 markdown. Apply recursive structural chunking with target size=128. Show that the splitter first tries the section-heading break (`\n## `), produces 3 chunks (one per section), each within 128 tokens. Color each section's chunk a distinct color matching its heading. Side annotation: "Each chunk = exactly one topic. Retrieval matches the topic cleanly."
  Key content: "recursive structural" or "recursive" + "structural", "exactly one topic" or "one topic", "3 chunks" or "three chunks".

- **sub=3 (C.orange) - When a section is too big, recurse further**
  Title: "If A Section Is Too Big, Recurse Into Paragraphs"
  Visual: take a longer doc (e.g., doc-12 API keys with a 300-token "Authentication Header Format" section). Show the recursion: try `## ` split → section is 300 tokens > 128, so recurse → try `\n\n` paragraph split → produces 3 sub-chunks of 100/110/90 tokens each, all under 128. A tree diagram on the side traces the recursion: `doc-12 → "Authentication Header Format" section (300 tokens, too big) → 3 paragraphs (each fits)`.
  Key content: "recurse" or "recursion" or "fall back", "paragraph", "300 tokens" or "300", "128".

- **sub=4 (C.red) - Why this is the 80% baseline**
  Title: "Recursive Structural: The 80% Baseline"
  Visual: a 2-column comparison table.
  - Left (Pros): "Preserves sentence + paragraph boundaries.", "Respects markdown / HTML structure for free.", "Zero embedding cost at chunk time (just string ops).", "Implemented by every major RAG framework (LangChain `RecursiveCharacterTextSplitter`, LlamaIndex `SentenceSplitter`)."
  - Right (Cons): "Doesn't understand semantic boundaries (a topic spanning 4 paragraphs gets split).", "Heading-aware but not heading-equivalent (two `##` sections on the same theme are split into two chunks).", "Plain-text docs without structural markers fall through to sentence/word splits (closer to fixed-size)."
  Bottom signpost: "Chapter 12.9 fixes the semantic-boundary gap. Chapter 12.11 fixes the parent-child gap."
  Key content: "80%" or "eighty percent" or "default", "sentence" + "paragraph", "LangChain" or "LlamaIndex", "semantic" (used in con list).

- [ ] **Step 1: Write content tests for 12.8**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("RecursiveStructuralChunking (12.8) content", () => {
  const fn = RagFoundations.RecursiveStructuralChunking;

  it("sub=0 shows the priority tree of structural separators", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/structural|structure/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/line/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/word/i);
  });

  it("sub=1 demonstrates fixed-size failure on heterogeneous doc-7", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/doc-?7|login troubleshooting/i);
    expect(container.textContent).toMatch(/mix|span|across topic/i);
  });

  it("sub=2 shows recursive structural produces one chunk per section", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recursive/i);
    expect(container.textContent).toMatch(/structural/i);
    expect(container.textContent).toMatch(/one topic|exactly one|3 chunks|three chunks/i);
  });

  it("sub=3 traces the recursion when a section exceeds size", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recurse|recursion|fall back/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/300/);
    expect(container.textContent).toMatch(/128/);
  });

  it("sub=4 frames recursive structural as the 80% baseline", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/80%|eighty percent|default/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
    expect(container.textContent).toMatch(/semantic/i);
  });
});
```

Update `src/__tests__/config.test.js` Section-12 test to expect 8 entries:

```js
expect(section12.length).toBe(8);
// ... add to the expected array:
{ id: "12.8", component: "RecursiveStructuralChunking", title: "Recursive Structural Chunking" },
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RecursiveStructuralChunking"
npx vitest run src/__tests__/config.test.js -t "Section 12"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full RecursiveStructuralChunking chapter**

Add config entry:

```js
  { id: "12.8", title: "Recursive Structural Chunking", section: 12, component: "RecursiveStructuralChunking" },
```

Append the new export to `src/sections/rag-foundations.jsx`. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (cyan, green, purple, orange, red).
- The priority tree in sub=0 must be an SVG. Add `<desc>` and svg-descriptions.json entry.
- The doc-7 markdown text shown in sub=1 and sub=2 must be visibly distinct - use a monospace block with section headings rendered in bold + matched colors. Background `${C.X}06`, border `1px solid ${C.X}12`.
- The recursion-tree diagram in sub=3 may be SVG or nested divs; if SVG, add `<desc>` + manifest entry.
- Title-case for diagram box text: "Recursive Structural", "Common Login Errors", "Browser Compatibility", "Account Lockout".
- No em-dashes. No "Preview:" / "Next:" forward refs. (The "Chapter 12.9 fixes ..." and "Chapter 12.11 fixes ..." signposts are allowed because they reference explicit chapter IDs in the published TOC.)
- "LangChain" and "LlamaIndex" are case-sensitive brand names; render exactly.
- Per-element backgrounds tinted, borders tinted, container `textAlign: "center"` for any standalone formula or recursion trace.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RecursiveStructuralChunking"
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

Add `"12.8"` key with descriptions in document order. Example:

```json
"12.8": [
  "Vertical priority tree of structural separators starting with paragraph break, falling back through line break, sentence break, to word break, each arrow labeled with the fallback condition",
  "Recursion trace tree showing doc-12 API keys section at 300 tokens being split by paragraph break into three sub-chunks of 100, 110, 90 tokens that each fit the 128-token target"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

Expected: all green.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.8 Recursive Structural Chunking"
```

---

## Task 8: Implement Chapter 12.9 SemanticChunking

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `SemanticChunking`).
- Modify: `src/config.js` (append chapter entry).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 9).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Split a doc where the embedding cosine distance between adjacent sentences jumps above a threshold. Each cluster of consecutive sentences with similar embeddings becomes one chunk. More expensive than structural (you have to embed candidates first) but adapts to semantic boundaries even when no structural markers exist.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - The structural gap: a flat narrative**
  Title: "What If The Doc Has No Structural Markers?"
  Visual: take a doc that's pure prose - say, a 6-paragraph narrative of doc-12 (API keys) written without headings, just paragraphs of running text. First 3 paragraphs are about "creating an API key"; last 3 are about "revoking an API key" - same topic family but different concrete actions. Apply recursive structural chunking with size=128 → it would split on paragraph boundaries but it doesn't know that paragraph 3 and paragraph 4 are on different sub-topics. The semantic shift in the middle is invisible to a structural splitter.
  Key content: "no structural" or "no headings" or "no markers", "flat" or "narrative" or "running text", "semantic shift" or "shift in topic".

- **sub=1 (C.green) - Embed each sentence**
  Title: "Step 1: Embed Every Sentence Independently"
  Visual: the 6-paragraph doc broken into ~12 sentences (2 per paragraph). Each sentence shown as a row with an 8-dim vector next to it (e.g., `s1: [0.81, 0.12, 0.45, ...]`). Sentences from the "creating" half use similar vectors (cluster A); sentences from the "revoking" half use different vectors (cluster B). Below: a centered formula `embed(sentence_i) -> v_i` and the count "12 sentences → 12 vectors".
  Key content: "embed", "sentence" (multiple), "vector", "12 sentences" or "12 vectors".

- **sub=2 (C.purple) - Plot pairwise cosine similarity along the doc**
  Title: "Step 2: Plot Cosine Similarity Between Adjacent Sentences"
  Visual: a line chart SVG. X axis = sentence boundary index (1-2, 2-3, 3-4, ..., 11-12). Y axis = cosine similarity (0.0 to 1.0). The line stays around 0.85-0.92 for boundaries 1-2 through 5-6 (within the "creating" cluster). At boundary 6-7 it drops sharply to ~0.41 (the shift to "revoking"). Then back up to 0.83-0.91 for boundaries 7-8 through 11-12 (within the "revoking" cluster). A horizontal red threshold line at 0.7 - any boundary scoring below it becomes a chunk break.
  Key content: "cosine similarity" or "cosine", "threshold" or "0.7", "drop" or "jump" or "dip", at least one specific number like "0.41" or "0.85".

- **sub=3 (C.orange) - The chunks emerge from the breaks**
  Title: "Step 3: Each Cluster Of High-Similarity Sentences = One Chunk"
  Visual: same doc, now visually grouped into 2 chunks based on where the threshold was crossed. Chunk 1 (sentences 1-6, "creating" topic) shown in green; chunk 2 (sentences 7-12, "revoking" topic) shown in orange. Side panel: "Semantic chunking found the topic shift that structural chunking would miss - even though there are no headings, no `\\n\\n`, no markers."
  Key content: "2 chunks" or "two chunks", "creating" + "revoking" or similar topic names, "threshold" or "break".

- **sub=4 (C.red) - The cost: you must embed before you chunk**
  Title: "The Cost: Embed-Before-Chunk Is 10-50x More Expensive"
  Visual: a side-by-side cost comparison.
  - Left (Structural / Fixed-Size): "Per doc: 1 pass of string-splitting. ~0.1 ms. Embedding cost = $0 at chunk time (embedding happens later, once, on final chunks)."
  - Right (Semantic): "Per doc: split into sentences (~0.5 ms) + embed each sentence (~5 ms per sentence × 12 = ~60 ms) + cosine math (~0.1 ms). At $0.10 per 1M tokens for embeddings, a 30-doc corpus chunked semantically costs ~$0.04 - but at production scale of 10M docs, that's $13,000 just to chunk. Then you re-embed the final chunks for the index."
  Bottom callout: "Use semantic chunking when retrieval quality matters more than indexing budget, and when structural markers are absent."
  Key content: "cost" or "expensive", "embed" + "before" or "first", "$0" + "structural", at least one production-scale figure like "$13,000" or "10M docs" or "10x" / "50x".

- [ ] **Step 1: Write content tests for 12.9**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("SemanticChunking (12.9) content", () => {
  const fn = RagFoundations.SemanticChunking;

  it("sub=0 frames the no-structural-markers gap", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no structural|no headings|no markers|flat/i);
    expect(container.textContent).toMatch(/semantic|topic shift/i);
  });

  it("sub=1 embeds every sentence", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/12 sentences?|12 vectors?/i);
  });

  it("sub=2 plots cosine similarity with a threshold", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/threshold|0\.7/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 derives 2 chunks from the cosine dip", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/2 chunks?|two chunks?/i);
    expect(container.textContent).toMatch(/creating|revoking/i);
  });

  it("sub=4 quantifies the embed-before-chunk cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|expensive/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/structural|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/\$|10x|50x|million|M docs/i);
  });
});
```

Update config test to expect 9 entries (append `{ id: "12.9", component: "SemanticChunking", title: "Semantic Chunking" }`).

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SemanticChunking"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full SemanticChunking chapter**

Add config entry:

```js
  { id: "12.9", title: "Semantic Chunking", section: 12, component: "SemanticChunking" },
```

Append the new export. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (cyan, green, purple, orange, red).
- The cosine-similarity line chart in sub=2 must be an SVG with proper viewBox centering, axis labels in title-case ("Sentence Boundary", "Cosine Similarity"), and a labeled threshold line at y=0.7. Add `<desc>` first child + manifest entry.
- The sentence-embedding visualization in sub=1 should use a 2-column layout: sentence text on left (smaller font), 8-dim vector on right (monospace). 12 rows, no overlap. Use CSS grid `gridTemplateColumns: "1fr auto"` for clean alignment.
- The 2-chunk visualization in sub=3 should group sentence cards with a clear chunk-1 / chunk-2 boundary (e.g., a colored vertical line + chunk label).
- The cost comparison in sub=4 uses CSS grid `gridTemplateColumns: "1fr 1fr"` for two equal panels, gap 12, no overlap.
- Title-case for diagram box text. No em-dashes. No forward "Preview:" / "Next:" refs.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SemanticChunking"
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.9": [
  "Line chart of cosine similarity between adjacent sentences along a 12-sentence document, with similarity staying around 0.85 within topic clusters and dropping to 0.41 at the topic-shift boundary, with a red threshold line at 0.7"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.9 Semantic Chunking"
```

---

## Task 9: Implement Chapter 12.10 LateChunking

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `LateChunking`).
- Modify: `src/config.js` (append chapter entry).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 10).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Late chunking (Jina AI, 2024) - embed the full document with the embedding model first so every token's hidden state sees the whole-doc context, THEN mean-pool the token hidden states into chunk vectors at the chunk-boundary positions. The chunk vector for chunk 3 still encodes information from chunk 1, because all the token embeddings saw each other through attention before being pooled. Solves the cross-chunk reference problem.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - The cross-chunk reference problem**
  Title: "Chunk-Then-Embed Loses Cross-Chunk Context"
  Visual: take doc-1 (password reset) chunked into 3 pieces. Chunk 1 introduces: "When a user named Sarah forgets her password, the system generates a one-time token." Chunk 3 contains the pronoun: "The link expires after 24 hours; she must request a new one if she misses the window." With chunk-then-embed, chunk 3's vector has no idea "she" refers to Sarah from chunk 1 - the chunk vector encodes only chunk-3 tokens. Color the pronoun "she" in red on chunk 3 with a callout: "Without context, this vector matches `she/her` queries weakly."
  Key content: "cross-chunk" or "cross chunk", "pronoun" or "she" or "reference", "chunk 1" + "chunk 3", "context".

- **sub=1 (C.green) - Two embedding orderings, side by side**
  Title: "Chunk-Then-Embed Vs. Embed-Then-Chunk"
  Visual: a 2-column side-by-side diagram, each in its own colored panel.
  - Left (Chunk-Then-Embed): doc → split into 3 chunks → 3 separate embedding passes → 3 vectors. Each pass sees only its own chunk's tokens. Arrows show each chunk going through the embedding model independently.
  - Right (Late Chunking / Embed-Then-Chunk): doc → ONE embedding pass over the whole doc → token-level hidden states (N tokens × hidden_dim) → mean-pool the hidden states at the chunk boundaries → 3 chunk vectors. Arrows show a single embedding pass with attention covering all tokens, then a pooling step that produces chunk vectors at the end.
  Key content: "chunk-then-embed" or "chunk then embed", "embed-then-chunk" or "embed then chunk", "attention" or "whole doc" or "all tokens", "mean-pool" or "pool" or "pooling".

- **sub=2 (C.purple) - Trace it on the Sarah doc**
  Title: "Late Chunking On Doc-1: Chunk 3's Vector Now Encodes Sarah"
  Visual: 2-row diagram for late chunking.
  - Top row: 3-chunk doc-1 text shown with all tokens. An overhead arrow labeled "Single Attention Pass" sweeping from token 1 to token N. Below each token: a small hidden-state vector indicator.
  - Bottom row: pooling boundaries at token positions ~128 and ~256. Three chunk vectors emerge: v_chunk1, v_chunk2, v_chunk3. Annotation on v_chunk3: "Even though this vector pools tokens 256-384, those token hidden states attended to tokens 0-128 (where 'Sarah' lives) - so v_chunk3 still encodes 'Sarah'."
  Key content: "Sarah", "attention" + "all tokens" or "whole doc", "v_chunk3" or "chunk 3", "encodes" or "preserves".

- **sub=3 (C.orange) - The retrieval impact**
  Title: "Query 'Did Sarah Get Her Reset Email?' Now Matches Chunk 3"
  Visual: a 2-row comparison of retrieval results.
  - Top row (Chunk-Then-Embed): query embedded, matched against the 3 vectors. Chunk 1 scores 0.78 (mentions Sarah but not the email). Chunk 2 scores 0.65. Chunk 3 scores 0.34 (talks about the link expiry but the vector doesn't know "she" = Sarah). Top-1 is chunk 1 - misses the answer.
  - Bottom row (Late Chunking): same query, same 3 chunks, but vectors encoded via late chunking. Chunk 3 now scores 0.81 (the vector knows "she" refers to Sarah from the attention pass). Top-1 is chunk 3 - hits the answer.
  Key content: "0.34" or "0.81" or similar scores, "chunk 3", "matches" or "retrieval", "Sarah".

- **sub=4 (C.red) - When late chunking pays off; tradeoffs**
  Title: "Late Chunking: Pros, Cons, When To Use"
  Visual: a 2-card grid (use grid not flex).
  - Card 1 (Wins): "Preserves cross-chunk pronouns and references.", "Single embedding pass = same compute as chunk-then-embed for the same doc.", "Significant recall gains on docs with anaphora (he/she/it/this/that/the X).", "Released 2024 by Jina AI for the jina-embeddings-v2 model family."
  - Card 2 (Limits): "Requires an embedding model that exposes token-level hidden states (most OpenAI / Cohere APIs return only the pooled final vector - you can't late-chunk with them).", "Requires the whole doc to fit in one embedding pass (8K-32K token ceilings).", "Pooling strategy matters (mean-pool vs CLS vs attention-weighted - jina v2 uses mean-pool)."
  Key content: "Jina" + "2024", "anaphora" or "pronoun" or "reference", "token-level" or "hidden state", "8K" or "32K" or "ceiling", "mean-pool".

- [ ] **Step 1: Write content tests for 12.10**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("LateChunking (12.10) content", () => {
  const fn = RagFoundations.LateChunking;

  it("sub=0 frames cross-chunk reference loss on the Sarah doc", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cross[- ]?chunk/i);
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/pronoun|reference|she/i);
  });

  it("sub=1 contrasts chunk-then-embed vs embed-then-chunk", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunk[- ]?then[- ]?embed/i);
    expect(container.textContent).toMatch(/embed[- ]?then[- ]?chunk|late chunk/i);
    expect(container.textContent).toMatch(/attention|whole doc|all tokens/i);
    expect(container.textContent).toMatch(/pool/i);
  });

  it("sub=2 traces the late-chunking pass on doc-1", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/chunk 3|v_chunk3/i);
  });

  it("sub=3 shows the retrieval-score reversal", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/0\.\d+/);
    expect(container.textContent).toMatch(/chunk 3/i);
    expect(container.textContent).toMatch(/Sarah/);
  });

  it("sub=4 lists pros, cons, and notes Jina 2024 origin", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Jina/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/pronoun|anaphora|reference/i);
    expect(container.textContent).toMatch(/token[- ]?level|hidden state/i);
  });
});
```

Update config test to expect 10 entries.

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LateChunking"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full LateChunking chapter**

Add config entry:

```js
  { id: "12.10", title: "Late Chunking (Jina 2024)", section: 12, component: "LateChunking" },
```

Append the new export. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (cyan, green, purple, orange, red).
- The side-by-side panel in sub=1 must use CSS grid `gridTemplateColumns: "1fr 1fr"` with `gap: 16`, no overlap. Each panel is its own tinted card with center-aligned title.
- The token-attention diagram in sub=2 must be SVG. Show the sweeping attention arc over the doc tokens; mean-pool boundaries clearly marked. Add `<desc>` + manifest entry.
- The 2-row retrieval comparison in sub=3 must use clear row separators (border-bottom or distinct panel backgrounds). Score numbers must be visibly aligned in columns.
- The 2-card grid in sub=4 uses `gridTemplateColumns: "1fr 1fr"`, no overlap.
- Title-case for all box text. No em-dashes. The "Released 2024 by Jina AI" line is a present-tense factual statement, not a forward reference.
- "Jina" and "jina-embeddings-v2" are case-exact brand names.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LateChunking"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.10": [
  "Side-by-side comparison: left shows chunk-then-embed with three independent embedding passes per chunk, right shows late chunking with one whole-doc attention pass followed by chunk-boundary mean pooling",
  "Token-attention sweep diagram over doc-1 password reset showing a single attention arc covering all tokens, with mean-pool boundaries at token positions 128 and 256 producing three chunk vectors, with annotation that chunk 3's vector still encodes 'Sarah' from chunk 1"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.10 Late Chunking"
```

---

## Task 10: Implement Chapter 12.11 HierarchicalChunking

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `HierarchicalChunking`).
- Modify: `src/config.js` (append chapter entry).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 11).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Two-level chunking - small leaf chunks for retrieval precision, large parent chunks (sections or whole docs) sent to the LLM for context coverage. The index stores leaf vectors; retrieval returns leaf hits; the system swaps each leaf for its parent before LLM generation. Also covers summary chunks (parent-summary vectors as an alternative retrieval target).

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The small-vs-large chunk tension**
  Title: "Small Chunks Retrieve Better; Large Chunks Generate Better"
  Visual: a 2-column comparison.
  - Left (Small chunks, 64 tokens): "Retrieval Precision: high. Each chunk is one focused fact.", "Generation Context: low. The LLM may need surrounding paragraphs to answer fully."
  - Right (Large chunks, 1024 tokens): "Retrieval Precision: low. Many topics per chunk, vector averages them.", "Generation Context: high. The LLM has the whole section."
  Bottom: "Pick one and you're forced to compromise. What if you didn't have to?"
  Key content: "small chunks" and "large chunks", "retrieval" or "precision", "generation" or "context", at least one specific token size like "64" or "1024".

- **sub=1 (C.green) - The hierarchy: leaves and parents**
  Title: "Hierarchical: Leaves Are Small, Parents Are Big"
  Visual: a tree diagram (SVG). Top: a parent node labeled "Doc-4 Refunds Policy (3 sections, 900 tokens)". Below it, 3 mid-level "Section" nodes (Eligibility / Process / Edge Cases), each ~300 tokens. Below each section: 4-6 leaf chunk nodes of 64 tokens each. Total: 1 root + 3 sections + ~15 leaves. Color leaves cyan, sections purple, root green. Annotation: "Index stores leaf vectors. Retrieval finds leaves. We swap each leaf for its parent before sending to the LLM."
  Key content: "leaf" or "leaves" + "parent" or "parents", "doc-?4|refund", "tree" or "hierarchy", concrete sizes "64" + "300" + "900".

- **sub=2 (C.purple) - Retrieval finds a leaf**
  Title: "Step 1: Retrieval Finds The Best Leaf"
  Visual: query "Can I get a refund if I cancel after 30 days?" embedded. The query vector matches leaf chunk `L7` (which contains "...full refunds within 14 days; prorated refunds 15-30 days; no refunds after 30 days..."). Show the top-3 leaves with scores: L7=0.89, L3=0.74, L12=0.68. Highlight L7 as the winner.
  Key content: "refund" + "30 days" or similar query, "leaf" or "L7" or "top-3" + score like "0.89".

- **sub=3 (C.orange) - The parent swap before generation**
  Title: "Step 2: Swap The Leaf For Its Parent Before The LLM"
  Visual: a flow diagram. Left: retrieved leaf L7 (64 tokens, just the "no refunds after 30 days" sentence). An arrow labeled "Parent Lookup" pointing right to the parent node (the entire 300-token "Edge Cases" section of doc-4, which includes context like the appeal process, special-case carve-outs, and how to request manual review). The 300-token parent is what gets packed into the prompt.
  Annotation: "The LLM now has the eligibility nuance to give the user a real answer, not just `no refunds after 30 days`."
  Key content: "parent" + "swap" or "lookup", "300" or "section", "context" or "nuance" or "eligibility".

- **sub=4 (C.yellow) - Summary chunks: an alternative retrieval target**
  Title: "Variation: Index Summary Chunks Instead Of Leaves"
  Visual: same hierarchy as sub=1 but with a new node alongside each section: a small "Summary" card showing 1-2 sentences of LLM-generated summary of that section. Arrows: index the summaries, retrieve over summaries, swap to the full parent on a hit. Trade-off note: "Summaries are denser semantically but require an LLM pass at index time to generate."
  Key content: "summary" or "summaries", "LLM" + "generate" or "summarize", "index" + "summary".

- **sub=5 (C.red) - When to use hierarchical; cost**
  Title: "Hierarchical: When And At What Cost"
  Visual: a 2-card grid.
  - Card 1 (Use Hierarchical When): "Docs are long and have natural section structure (manuals, policies, RFCs).", "Queries need surrounding context to answer well (legal, medical, technical docs where one sentence is rarely enough).", "Storage cost for storing parent texts is acceptable (~2-3x raw doc size)."
  - Card 2 (Cost & Implementation): "Storage: index + parent-text store. Roughly 2-3x raw corpus size.", "Latency: one extra lookup per hit (parent-from-leaf-id). Sub-millisecond.", "Implementation: every major framework has this pattern. LangChain `ParentDocumentRetriever`, LlamaIndex `RecursiveRetriever`."
  Key content: "hierarchical", "parent" + "store" or "storage", "LangChain" or "LlamaIndex" + class name, "section structure" or "manual" or "policy".

- [ ] **Step 1: Write content tests for 12.11**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("HierarchicalChunking (12.11) content", () => {
  const fn = RagFoundations.HierarchicalChunking;

  it("sub=0 frames the small-vs-large chunk tension", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/small chunks?/i);
    expect(container.textContent).toMatch(/large chunks?/i);
    expect(container.textContent).toMatch(/retrieval|precision/i);
    expect(container.textContent).toMatch(/generation|context/i);
  });

  it("sub=1 introduces the leaf-and-parent hierarchy on doc-4", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/leaf|leaves/i);
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/doc-?4|refund/i);
    expect(container.textContent).toMatch(/64/);
    expect(container.textContent).toMatch(/300/);
  });

  it("sub=2 retrieves a leaf chunk for the refund query", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/30 days|L7|leaf/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 swaps leaf for parent before the LLM", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/swap|lookup|replace/i);
    expect(container.textContent).toMatch(/LLM|prompt|context/i);
  });

  it("sub=4 introduces summary chunks as a variant", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/summary|summaries/i);
    expect(container.textContent).toMatch(/LLM|generate/i);
  });

  it("sub=5 explains when and at what cost", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/storage|cost/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
  });
});
```

Update config test to expect 11 entries.

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HierarchicalChunking"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full HierarchicalChunking chapter**

Add config entry:

```js
  { id: "12.11", title: "Hierarchical / Parent-Child Chunking", section: 12, component: "HierarchicalChunking" },
```

Append the new export. Required:

- 6 sub-steps (sub >= 0 through sub >= 5).
- Colors per sub-step (cyan, green, purple, orange, yellow, red).
- The hierarchy tree in sub=1 MUST be an SVG with proper viewBox centering. Root at the top center, 3 section nodes evenly spaced below, leaves below each section in a clean fan-out. No edge crossings. Add `<desc>` first child + manifest entry.
- The summary-chunk diagram in sub=4 extends sub=1's tree by adding a "Summary" card next to each section. Re-use the tree visual rather than redrawing.
- The leaf-to-parent swap diagram in sub=3 can be a horizontal flow with a clear "Parent Lookup" arrow.
- The 2-card grid in sub=5 uses CSS grid `gridTemplateColumns: "1fr 1fr"`, no overlap.
- "LangChain", "LlamaIndex", "ParentDocumentRetriever", "RecursiveRetriever" are case-exact.
- Title-case for diagram box text. No em-dashes. No forward "Next:" / "Preview:" refs.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HierarchicalChunking"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.11": [
  "Tree hierarchy diagram with doc-4 refunds policy as the root node, three section nodes below for eligibility, process, and edge cases, and four to six leaf chunk nodes below each section, with leaves colored cyan, sections purple, and root green",
  "Leaf-to-parent swap flow diagram showing retrieved leaf L7 with the 'no refunds after 30 days' sentence on the left, a parent-lookup arrow in the middle, and the full 300-token edge-cases section on the right being sent to the LLM"
]
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.11 Hierarchical / Parent-Child Chunking"
```

---

## Task 11: Implement Chapter 12.12 ContextualRetrieval

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `ContextualRetrieval`).
- Modify: `src/config.js` (append chapter entry).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 12).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Contextual Retrieval (Anthropic, 2024). Each chunk gets prepended at index time with an LLM-generated 1-2 sentence "context" describing what doc and section it came from and what it's about. The augmented chunk is then embedded and indexed. Reported by Anthropic to improve retrieval recall by 49% (and stack on top of hybrid search + reranking for combined wins).

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.cyan) - The orphan-chunk problem**
  Title: "Chunks Out Of Context Look Identical To The Embedding Model"
  Visual: take 3 chunks from 3 different docs of the customer support corpus, all of which contain the phrase "click Save to confirm".
  - Chunk A (from doc-2 - email change): "...verify your new email address, then click Save to confirm."
  - Chunk B (from doc-15 - role permissions): "...assign the new role to the user, then click Save to confirm."
  - Chunk C (from doc-18 - notifications): "...select the channels you want notifications on, then click Save to confirm."
  Show their 8-dim embeddings: all three vectors are nearly identical because the chunks are nearly identical token sequences. Query "How do I change my email?" matches all three at ~0.71, retrieving the wrong chunk half the time.
  Key content: "click Save" or "Save to confirm" or "Save", "email" + "role" + "notifications", "identical" or "nearly identical" or "indistinguishable".

- **sub=1 (C.green) - Prepend a context line at index time**
  Title: "Solution: Prepend An LLM-Generated Context Line"
  Visual: same chunk A from sub=0, augmented. Show the augmented chunk as: a colored "Context" prefix line on top (in green tint) saying "Document: Email Change Guide. Section: Step 4 - Verify New Address. This chunk is about confirming the new email after verification.", followed by the original chunk text below. Label the green prefix "LLM-generated context (1-2 sentences)". The full augmented chunk is what gets embedded.
  Key content: "context" + "prepend" or "prefix" or "prepended", "Document:" or "Section:", "LLM-generated" or "generated".

- **sub=2 (C.purple) - The augmentation prompt template**
  Title: "The Augmentation Prompt Template (Run Once Per Chunk)"
  Visual: a styled monospace prompt-template block (NOT a code block). Background `${C.purple}06`, border `1px solid ${C.purple}12`, monospace 14-16px. Highlight `{document_title}`, `{section_heading}`, `{chunk}` placeholders in a distinct accent color (e.g., `C.orange`). The template body:

  ```
  Here is a chunk from a documentation page.

  <document_title>{document_title}</document_title>
  <section_heading>{section_heading}</section_heading>
  <chunk>
  {chunk}
  </chunk>

  Write a short (1-2 sentence) context that situates this chunk within
  the document and section so retrieval models can find it. Output
  only the context, no preamble.
  ```

  Below the template: "Cost: one cheap-model call per chunk at index time (Anthropic recommends Claude Haiku). Roughly $0.001 per chunk. For 100K chunks, that's $100 one-time."
  Label the block "Augmentation Prompt Template" in title-case.
  Key content: "prompt" or "template" or "augmentation", placeholder names like "{chunk}" or "{document_title}", "Haiku" or "cheap model" or "cost", "$0.001" or "$100" or similar.

- **sub=3 (C.orange) - Before vs after augmentation, on the same query**
  Title: "Before Vs. After: Recall On The Email-Change Query"
  Visual: a 2-row comparison.
  - Top row (Without Augmentation): the 3 chunks A/B/C all score 0.71 against "How do I change my email?". Top-1 is whichever was indexed first; effectively random. Recall@1 = 33%.
  - Bottom row (With Augmentation): chunk A now scores 0.93 (its augmentation explicitly mentions "Email Change Guide"), chunks B and C score 0.42 and 0.39. Top-1 = chunk A every time. Recall@1 = 100%.
  Key content: "recall", "33%" + "100%" or similar before/after, "augmentation" or "augmented".

- **sub=4 (C.yellow) - The 49% recall lift Anthropic reported**
  Title: "Anthropic's 2024 Benchmark: 49% Recall Improvement"
  Visual: a horizontal bar chart. 3 bars showing top-20 retrieval failure rate (lower is better) across:
  - Bar 1: Naive Embedding-Only - failure rate 5.7% (baseline).
  - Bar 2: + Contextual Embedding - failure rate 3.7% (a 35% reduction in failures).
  - Bar 3: + Contextual Embedding + Contextual BM25 - failure rate 2.9% (a 49% reduction in failures).
  - Bar 4: + Contextual Embedding + Contextual BM25 + Reranking - failure rate 1.9% (a 67% reduction in failures).
  Below: "From the Anthropic Contextual Retrieval blog post, September 2024."
  Key content: "Anthropic" + "2024", "49%" or "49 percent", "BM25" or "hybrid" or "reranking", "failure rate" or "recall".

- **sub=5 (C.red) - When NOT to use contextual retrieval**
  Title: "When Contextual Retrieval Is Overkill"
  Visual: a 2-column "skip if / use if" table.
  - Skip If: "Corpus is fully homogeneous (one product manual; no risk of cross-doc duplicate phrases).", "Index size is small (< 1K chunks; recall problems can be solved by hand-tuning).", "Index budget is hard (the one-time $100-1000 augmentation cost is too high for a prototype)."
  - Use If: "Corpus has many docs with similar surface phrases (FAQ + support + product = lots of `click Save to confirm` style overlap).", "Recall is the bottleneck in your eval metrics.", "Hybrid + reranking already in place and you want one more lever."
  Key content: "overkill" or "skip" or "when not", "homogeneous", "recall" or "bottleneck", "hybrid" + "rerank" or "reranking".

- **sub=6 (C.pink) - Combining contextual retrieval with hybrid + rerankers**
  Title: "Stacks With Hybrid Search And Rerankers For The Full 67%"
  Visual: a 3-step stack diagram.
  - Step 1: Contextual augmentation at index time (prepends context to every chunk).
  - Step 2: Hybrid retrieval at query time (dense + BM25, both running on the augmented chunks). Recap: "Hybrid - covered in Section 11.24 - merges semantic and lexical recall."
  - Step 3: Reranker on top-20 → top-3. Recap: "Rerankers - covered in Section 11.25 - cross-encoder scores each query-chunk pair."
  Final box: "Combined: 67% recall improvement over naive (per Anthropic 2024)."
  Key content: "hybrid" + "Section 11.24" or "11.24", "rerank" + "Section 11.25" or "11.25", "67%" or "combined", "stack" or "stacks".

- [ ] **Step 1: Write content tests for 12.12**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ContextualRetrieval (12.12) content", () => {
  const fn = RagFoundations.ContextualRetrieval;

  it("sub=0 shows the orphan-chunk identical-text problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/click Save|Save to confirm/i);
    expect(container.textContent).toMatch(/email/i);
    expect(container.textContent).toMatch(/identical|same|indistinguishable|nearly/i);
  });

  it("sub=1 prepends an LLM-generated context line", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context/i);
    expect(container.textContent).toMatch(/prepend|prefix/i);
    expect(container.textContent).toMatch(/LLM[- ]?generated|generated/i);
  });

  it("sub=2 shows the augmentation prompt template with cost note", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/\{chunk\}|\{document_title\}/);
    expect(container.textContent).toMatch(/Haiku|cheap model|cost/i);
    expect(container.textContent).toMatch(/\$0\.001|\$100/);
  });

  it("sub=3 contrasts recall@1 before vs after augmentation", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall|augment/i);
    expect(container.textContent).toMatch(/33%|100%/);
  });

  it("sub=4 cites Anthropic's 2024 49% improvement", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Anthropic/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/49%|49 percent/);
    expect(container.textContent).toMatch(/BM25|hybrid|rerank/i);
  });

  it("sub=5 lists when contextual retrieval is overkill", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/overkill|skip|when not/i);
    expect(container.textContent).toMatch(/homogeneous/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=6 stacks contextual + hybrid + reranker with Section 11 refs", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Section 11\.24|11\.24/);
    expect(container.textContent).toMatch(/Section 11\.25|11\.25/);
    expect(container.textContent).toMatch(/67%|combined/);
  });
});
```

Update config test to expect 12 entries.

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ContextualRetrieval"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ContextualRetrieval chapter**

Add config entry:

```js
  { id: "12.12", title: "Contextual Retrieval (Anthropic 2024)", section: 12, component: "ContextualRetrieval" },
```

Append the new export. Required:

- 7 sub-steps (sub >= 0 through sub >= 6).
- Colors per sub-step (cyan, green, purple, orange, yellow, red, pink).
- The 3-chunk identical-phrasing visualization in sub=0 must arrange the chunks in a 3-column grid (`gridTemplateColumns: "1fr 1fr 1fr"`, gap 12). Each chunk's 8-dim vector shown below it in monospace; the near-identicality is the visual punchline.
- The augmented-chunk visualization in sub=1 stacks a green "Context" prefix above the original chunk text, with a distinct background tint for the prefix (`${C.green}10`) vs the body (`${C.green}06`). Labels in title-case.
- The augmentation prompt template in sub=2 is a STYLED MONOSPACE BLOCK, not a code block. Background `${C.purple}06`, border `1px solid ${C.purple}12`, monospace font, 14-16px. Placeholder variables `{document_title}`, `{section_heading}`, `{chunk}` highlighted in `C.orange` color. Title above: "Augmentation Prompt Template" (centered).
- The before/after 2-row comparison in sub=3 uses clear row separators. Scores in monospace.
- The horizontal bar chart in sub=4 must be an SVG with title-case axis labels. Bar lengths proportional to failure rates. Add `<desc>` first child + manifest entry.
- The 2-column skip/use table in sub=5 uses CSS grid with equal columns.
- The 3-step stack diagram in sub=6 may be SVG or a vertical flow of tinted cards. The Section 11.24 and 11.25 references are inline within the body text of each step.
- No em-dashes. "Anthropic" is a case-exact brand name.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ContextualRetrieval"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.12": [
  "Horizontal bar chart showing four bars of retrieval failure rate from Anthropic's September 2024 Contextual Retrieval benchmark: naive embedding 5.7%, plus contextual embedding 3.7%, plus contextual BM25 2.9%, plus reranking 1.9%, with title-case axis labels"
]
```

(If sub=6's stack diagram is also an SVG, add a second entry to the array.)

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.12 Contextual Retrieval"
```

---

## Task 12: Implement Chapter 12.13 ChunkingDecision

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (append new export `ChunkingDecision`).
- Modify: `src/config.js` (append chapter entry).
- Modify: `src/__tests__/config.test.js` (extend Section 12 chapter count to 13).
- Modify: `src/__tests__/sections.test.jsx` (append content tests).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs if any).

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Synthesize all 6 prior chunking chapters (12.7-12.12) into a decision framework. Decision matrix axes: doc structure (markdown / HTML / PDF / code / flat-text) × query type (factual / relational / comparative) × cost budget (lab / startup / enterprise). End with a worked walkthrough on the customer support corpus where the answer is "Recursive Structural baseline + Hierarchical for long policies + Contextual Retrieval to disambiguate FAQ + Semantic for the runbook narrative". Show how a real production system mixes strategies per doc-type.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - All 6 strategies on one page**
  Title: "Six Strategies, One Page"
  Visual: a 6-card horizontal grid (or 3x2 if width-constrained). Each card has the strategy name in title-case, a one-line "what it does", and 3 tiny meter bars for [Quality / Cost / Implementation Difficulty] (low/med/high). Strategies in order:
  - Fixed-Size: "Sliding window, no structure awareness." Q=low, C=low, D=low.
  - Recursive Structural: "Tries paragraph → line → sentence → word." Q=med, C=low, D=low.
  - Semantic: "Embed sentences, split where cosine dips." Q=high, C=med, D=med.
  - Late: "One whole-doc attention pass, then pool per chunk." Q=high, C=med, D=high.
  - Hierarchical: "Small chunks retrieve; parents go to LLM." Q=high, C=med, D=med.
  - Contextual Retrieval: "LLM-generated context prefixed to each chunk." Q=very high, C=high, D=med.
  Key content: at least 5 of the 6 strategy names, "quality" + "cost" + "implementation" or similar axes.

- **sub=1 (C.green) - Doc structure axis**
  Title: "Axis 1: What Structure Do Your Docs Have?"
  Visual: a vertical list of doc-structure categories, each with a recommended starting strategy.
  - Markdown / HTML: "Recursive Structural (uses heading + paragraph markers natively)."
  - PDF (scanned or extracted): "Recursive Structural after extraction, OR Semantic if extraction quality is bad."
  - Code: "Recursive Structural with language-aware separators (function defs, class declarations)."
  - Flat-Text Narrative (no headings, no markdown): "Semantic Chunking (the only way to find topic boundaries)."
  - Mixed / Heterogeneous Corpus: "Apply different strategies per doc-type. Don't force one strategy."
  Key content: "markdown" + "HTML", "PDF", "code", "flat-text" or "narrative", "Recursive Structural" + "Semantic" mentions.

- **sub=2 (C.purple) - Query type axis**
  Title: "Axis 2: What Kinds Of Queries Will You Get?"
  Visual: a 3-row table.
  - Factual ("What is X?"): "Small chunks are fine. Recursive Structural + Contextual if FAQ-style overlap. Hierarchical optional for context-heavy answers."
  - Relational ("How does X relate to Y?"): "Hierarchical helps (LLM needs the whole relationship section). Late Chunking helps when entities are referenced across chunks."
  - Comparative ("Compare X and Y."): "Multi-hop retrieval (covered in chapter 12.28) on top of any chunking. Bigger chunks help.  Hierarchical preferred."
  Key content: "factual" + "relational" + "comparative", "Hierarchical", "12.28" or "multi-hop" reference.

- **sub=3 (C.orange) - Cost budget axis**
  Title: "Axis 3: What's Your Indexing Budget?"
  Visual: a horizontal scale from "Lab / Prototype" → "Startup" → "Enterprise" with recommended stack at each tier.
  - Lab / Prototype: "Recursive Structural only. Zero embedding cost at chunk time. Iterate fast."
  - Startup: "Recursive Structural + Hierarchical for long-form docs. Skip semantic and contextual until you see recall problems in your eval."
  - Enterprise: "Recursive Structural baseline + Hierarchical + Contextual Retrieval + (Semantic where prose dominates). Stack with hybrid + rerankers. Budget for the one-time $100-$10K augmentation cost."
  Key content: "lab" or "prototype", "startup", "enterprise", at least one cost figure like "$100" or "$10K" or "free".

- **sub=4 (C.red) - Worked walkthrough on the customer support corpus**
  Title: "Walkthrough: Picking Strategies For The Customer Support Corpus"
  Visual: a 3-row recommendation table, one row per corpus category.
  - Account & Billing (10 docs, FAQ-style, lots of repeated phrases like "click Save"): "Recursive Structural + Contextual Retrieval. Contextual disambiguates the duplicate phrases across email/role/notifications docs."
  - Product Features (10 docs, longer technical pages with sections and code samples): "Recursive Structural + Hierarchical. Sections give clean splits; parent-swap gives the LLM context for technical answers."
  - Troubleshooting (10 docs, free-form runbooks, narrative paragraphs): "Recursive Structural + Semantic for the longer narratives. Semantic catches topic shifts within a runbook."
  Below the table: a one-line synthesis: "Production chunking is rarely one strategy. Mix per doc-type, measure recall, iterate."
  Bottom signpost: "Chapters 12.14-12.17 move to embedding model choice and how chunking interacts with embedding quality."
  Key content: "customer support" or "support corpus", "Account" + "Product Features" + "Troubleshooting", "mix" or "rarely one strategy", "12.14" or "embedding model" reference (allowed within-section signpost).

- [ ] **Step 1: Write content tests for 12.13**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ChunkingDecision (12.13) content", () => {
  const fn = RagFoundations.ChunkingDecision;

  it("sub=0 lists at least five of the six chunking strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    const text = container.textContent;
    const names = [/fixed[- ]?size/i, /recursive structural/i, /semantic/i, /late/i, /hierarchical/i, /contextual/i];
    const hits = names.filter((re) => re.test(text)).length;
    expect(hits).toBeGreaterThanOrEqual(5);
    expect(text).toMatch(/quality|cost|implementation/i);
  });

  it("sub=1 covers the doc-structure axis (markdown, PDF, code, flat)", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/markdown|HTML/i);
    expect(container.textContent).toMatch(/PDF/);
    expect(container.textContent).toMatch(/code/i);
    expect(container.textContent).toMatch(/flat|narrative/i);
  });

  it("sub=2 covers the query-type axis (factual, relational, comparative)", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/factual/i);
    expect(container.textContent).toMatch(/relational/i);
    expect(container.textContent).toMatch(/comparative/i);
    expect(container.textContent).toMatch(/hierarchical/i);
  });

  it("sub=3 covers the cost-budget axis (lab, startup, enterprise)", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lab|prototype/i);
    expect(container.textContent).toMatch(/startup/i);
    expect(container.textContent).toMatch(/enterprise/i);
    expect(container.textContent).toMatch(/\$|free|cost/i);
  });

  it("sub=4 walks through strategy choice on the customer support corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/customer support|support corpus/i);
    expect(container.textContent).toMatch(/Account|Billing/i);
    expect(container.textContent).toMatch(/Product Features|Troubleshooting/i);
    expect(container.textContent).toMatch(/mix|rarely one|iterate/i);
  });
});
```

Update config test to expect 13 entries.

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ChunkingDecision"
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ChunkingDecision chapter**

Add config entry:

```js
  { id: "12.13", title: "The Chunking Decision", section: 12, component: "ChunkingDecision" },
```

Append the new export. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step (cyan, green, purple, orange, red).
- The 6-card grid in sub=0 uses CSS grid `gridTemplateColumns: "repeat(3, 1fr)"` (3 columns × 2 rows). Each card center-aligned, title-case title, the 3 mini-meters as small horizontal bars (e.g., 3 colored rectangles per meter; low=1 filled, med=2 filled, high=3 filled).
- The doc-structure list in sub=1 is a vertical stack of tinted rows, each with the doc-type bold and the recommendation below. No bullet characters - use spacing/border-left as the visual separator.
- The 3-row query-type table in sub=2 may be an HTML table or a CSS grid table with header row. Title-case column headers.
- The horizontal cost scale in sub=3 may be SVG (a labeled axis with tier markers) or three tinted vertical cards in a row. If SVG, add `<desc>` + manifest entry.
- The 3-row walkthrough table in sub=4 follows the same pattern as sub=2.
- No em-dashes. The "Chapters 12.14-12.17 move to embedding model choice" line is an allowed within-section signpost (it references later chapter numbers in this same section, not a "Next:" or "Coming up:" preview).
- All tables centered, all card-grid titles centered (`textAlign: "center"` on card div + `T center` on title).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ChunkingDecision"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

If sub=3 used an SVG for the cost scale, add an entry:

```json
"12.13": [
  "Horizontal cost-budget scale with three tier markers labeled lab, startup, and enterprise, each with a recommended chunking stack listed underneath"
]
```

If no SVGs were introduced in this chapter, skip the manifest update (the SVG-descriptions test only requires entries for chapters that have SVGs).

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Full test, lint, format**

```bash
npm run test
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/config.js src/__tests__/sections.test.jsx src/__tests__/config.test.js src/data/svg-descriptions.json
git commit -m "Implement chapter 12.13 The Chunking Decision"
```

---

## Task 13: Update CLAUDE.md mapping table for chapters 12.4-12.13

**Files:**
- Modify: `CLAUDE.md`.

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Extend the Section 12 mapping table from 3 to 13 rows**

Find the existing Section 12 mapping table (added in M1; currently shows 12.1-12.3). Replace the body of the table with the full 13-row version, AND update the table's heading line so it reflects two section files plus the new act labels:

```markdown
**Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` + `rag-ingestion.jsx` - Acts 1-3 complete; Acts 4-10 added in Milestones 3-6)

| Chapter | Component | Title |
|---------|-----------|-------|
| 12.1 | WhyLLMsNeedRetrieval | Why LLMs Need Retrieval |
| 12.2 | NaiveRAGPipeline | The Naive RAG Pipeline |
| 12.3 | WhereNaiveRAGBreaks | Where Naive RAG Breaks |
| 12.4 | ParsingExtraction | Parsing - Raw Sources to Clean Text |
| 12.5 | DeduplicationCleaning | Deduplication & Cleaning |
| 12.6 | RefreshSync | Refresh & Sync Schedules |
| 12.7 | WhyChunkFixedSize | Why Chunk At All + Fixed-Size Baseline |
| 12.8 | RecursiveStructuralChunking | Recursive Structural Chunking |
| 12.9 | SemanticChunking | Semantic Chunking |
| 12.10 | LateChunking | Late Chunking (Jina 2024) |
| 12.11 | HierarchicalChunking | Hierarchical / Parent-Child Chunking |
| 12.12 | ContextualRetrieval | Contextual Retrieval (Anthropic 2024) |
| 12.13 | ChunkingDecision | The Chunking Decision |
```

- [ ] **Step 2: Update the Project Structure tree**

Find the `## Project Structure` section. The line for `rag-foundations.jsx` was added in M1 with a comment like `# Section 12 (Act 1 only ...)`. Update its comment AND add a NEW line for `rag-ingestion.jsx` immediately above or below it (keeping the alphabetical-ish order used in the tree):

```
│       ├── rag-foundations.jsx           # Section 12 Acts 1+3: Problem + Chunking, 12.1-12.3 + 12.7-12.13
│       └── rag-ingestion.jsx             # Section 12 Act 2: Ingestion, 12.4-12.6
```

(Exact tree-character alignment depends on what's around it in the current CLAUDE.md - mirror the indentation/glyphs of the surrounding entries. The important part is that BOTH files appear and their annotations are accurate.)

- [ ] **Step 3: No automated test required for CLAUDE.md changes** - it's documentation.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only `CLAUDE.md`.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "Document Section 12 Acts 2-3 in CLAUDE.md mapping (12.4-12.13)"
```

---

## Task 14: Final M2 verification

**Files:** none (verification only; visual validation via Chrome).

This is the MANDATORY validation gate. A chapter that passes tests but fails Chrome validation is NOT done.

- [ ] **Step 1: Full test suite**

```bash
npm run test
```

Expected: all tests pass (Section 1-11 tests + M1's 12.1-12.3 tests + M2's new 12.4-12.13 tests).

- [ ] **Step 2: Coverage check**

```bash
npx vitest run --coverage
```

Expected: lines 100%, branches >= 97.7% (per CLAUDE.md target). If branches dropped, identify uncovered branches in the new code; either add tests or document the structurally unreachable defensive branches.

- [ ] **Step 3: Lint clean**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Format clean**

```bash
npm run format
```

Expected: no changes (or only trivial whitespace). If changes were made, re-run `npm run test` and stage them.

- [ ] **Step 5: Production build smoke test**

```bash
npm run build
```

Expected: build succeeds. No errors in vendor chunking or asset processing.

- [ ] **Step 6: Em-dash + C.card guard checks**

```bash
grep -n "—" src/sections/rag-foundations.jsx src/sections/rag-ingestion.jsx
grep -n "Box color={C.card}" src/sections/rag-foundations.jsx src/sections/rag-ingestion.jsx
grep -nE "Coming up:|Next chapter:|Preview:" src/sections/rag-foundations.jsx src/sections/rag-ingestion.jsx
```

Expected: no matches in any of the three greps. If any are found, fix in the chapter source and re-run from Step 1.

- [ ] **Step 7: Boot dev server for Chrome visual validation**

```bash
npm run dev
```

Expected: `Local: http://localhost:5173/learn-ai/`. Leave running for the rest of this task.

- [ ] **Step 8: Chrome visual validation of all 10 new chapters**

For each chapter (12.4 through 12.13), use the claude-in-chrome MCP tools:

- Use `mcp__claude-in-chrome__tabs_context_mcp` to get current tab context.
- Use `mcp__claude-in-chrome__tabs_create_mcp` (or navigate an existing tab) to open `http://localhost:5173/learn-ai/`.
- Navigate to chapter 12.4 via the app's chapter list or keyboard arrows.
- Step through every sub-step (Continue / Reveal click). For each sub-step:
  - Take a screenshot via the chrome browser tool.
  - Visually check:
    1. No overlapping elements anywhere on the page (cards, tables, SVGs, prompt-template blocks, metadata artifacts).
    2. Every diagram horizontally + vertically centered within its container.
    3. Every diagram box label is title-case (every word capitalized).
    4. Every line of text starts with a capital letter.
    5. Every Box has a real color (not gray `C.card`).
    6. Every standalone formula and table is centered.
    7. No em-dashes visible.
    8. No "Next chapter:" / "Coming up:" / "Preview:" text.
- Read browser console messages via `mcp__claude-in-chrome__read_console_messages` and check for runtime errors.
- Repeat for 12.5 through 12.13.

Particularly scrutinize:
- **12.4 sub=3 and sub=4:** The HTML mockup zones must have non-overlapping nav/sidebar/main/footer overlays. The metadata JSON artifact must be visually distinct from a code block (tinted bg, soft border, monospace, placeholder highlighting).
- **12.5 sub=2:** The MinHash + LSH flow must show shingles → signature → bucket clearly. The Jaccard estimate number visible.
- **12.5 sub=3:** The 4-row similarity ladder must be clearly stratified by cosine threshold.
- **12.6 sub=2 and sub=3:** The sequence diagrams must read top-to-bottom cleanly. Time annotations (T=0:00, T=+15min) visible.
- **12.6 sub=4:** The 3-row timeline for v1/v2/grace period must clearly show the overlap window.
- **12.7 sub=2 and sub=3:** The sliding-window bar diagram and the mid-sentence break should be pixel-accurate. The red break line in sub=3 must cleanly slice the example sentence.
- **12.8 sub=0:** The priority tree's arrows should not overlap node text. SVG must be centered in its viewBox.
- **12.9 sub=2:** The cosine-similarity line chart must show the dip at the right x-position. Threshold line must be visible. Axis labels in title-case.
- **12.10 sub=1:** The two-panel side-by-side must be equal width with no horizontal scroll. Arrows in both panels visually parallel.
- **12.11 sub=1:** The hierarchy tree must have no edge crossings. Leaves evenly fanned out below each section.
- **12.12 sub=2:** The augmentation prompt template must be visually distinct from a code block - tinted background, soft border, monospace, placeholders in accent color. NOT a stark code-block style.
- **12.12 sub=4:** The bar chart bars must be proportional to the failure rate numbers; labels visible without overlapping bars.
- **12.13 sub=0:** The 6-card grid must wrap cleanly to 3×2 if width-constrained. Mini-meters consistent across cards.

- [ ] **Step 9: If any visual defect found**

Stop. Document the defect (which chapter, which sub-step, what's wrong). Fix in the chapter source file. If the fix changes content the tests verified, update tests first (TDD). Re-run `npm run test` to confirm no regression. Restart Chrome validation from Step 7 for the affected chapter.

- [ ] **Step 10: Stop the dev server**

Stop with Ctrl-C in the dev-server terminal.

- [ ] **Step 11: (Optional) Save screenshots for reference**

If the validation surfaced anything noteworthy, save screenshots:

```bash
mkdir -p docs/superpowers/screenshots/section-12-m2
```

Save Chrome captures into this directory. Commit if desired:

```bash
git add docs/superpowers/screenshots/section-12-m2/
git commit -m "Add Section 12 M2 visual validation screenshots"
```

- [ ] **Step 12: Verify TOC shows 13 chapters in Section 12**

Boot the dev server again briefly:

```bash
npm run dev
```

Open `http://localhost:5173/learn-ai/`, navigate to the table of contents, and confirm Section 12 lists 13 chapters (12.1 through 12.13) with the correct titles. Stop the server.

- [ ] **Step 13: Confirm M2 success criteria**

Verify via `git log --oneline -20` that M2 commit history is clean and well-structured (one commit per chapter + scaffold + CLAUDE.md commit):

- [x] 10 new chapters (12.4-12.13) implemented: 3 ingestion in `rag-ingestion.jsx`, 7 chunking in `rag-foundations.jsx`.
- [x] Section 12 chapter entries 12.4-12.13 added to `config.js` in the correct order.
- [x] New file `rag-ingestion.jsx` exists; `learn-ai.jsx` Section 12 loader merges both files via `Promise.all`.
- [x] `lookup.test.js` and `sections.test.jsx` both import and spread `RagIngestion`.
- [x] Tests added for every new chapter at every sub-level.
- [x] Coverage 100% lines, branches >= 97.7%.
- [x] Lint + format clean.
- [x] Every SVG has `<desc>` + entry in `svg-descriptions.json`.
- [x] CLAUDE.md mapping extended from 3 rows to 13 rows.
- [x] CLAUDE.md Project Structure has two Section-12 file entries (`rag-foundations.jsx` Acts 1+3, `rag-ingestion.jsx` Act 2).
- [x] Chrome visual validation passed for all 10 new chapters.
- [x] No em-dashes, no `Box color={C.card}`, no "Next:" / "Coming up:" / "Preview:" forward refs.

- [ ] **Step 14: (No marker commit needed unless drift exists)**

If everything is already committed from earlier tasks, no marker commit is needed. If any trivial drift exists (formatting, etc.):

```bash
git status
git add -p   # carefully review what to stage
git commit -m "Section 12 Milestone 2 complete: Acts 2-3 (12.4-12.13) shipped"
```

M2 complete. Section 12 now has 13 navigable chapters (Acts 1-3). Ready to write Milestone 3 plan (Acts 4+5 - embed/index choices + query transformation).

---

## Task 15: Plan Refinement Checkpoint for M3

**Files:**
- Create: `docs/superpowers/lessons/section-12-m2-lessons.md` (new lessons file)
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-12-milestone-3.md`
- Create: `docs/superpowers/starter-prompts/section-12-m3-starter.md`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

Per the section's "lessons-feed-forward" rule, before executing M3, do a quick refinement pass on the M3 plan using what M2 taught us. The plans are editable artifacts, not contracts - this checkpoint is where M2's real-world experience gets folded into M3's plan.

- [ ] **Step 1: Lessons capture from M2 (5-10 minutes, write it down)**

Create `docs/superpowers/lessons/section-12-m2-lessons.md` with 3-5 honest bullet observations from executing M2:

- Which visual patterns rendered cleanly in Chrome and which needed iteration?
- Which test regexes were too brittle (false fail) or too loose (let bugs through)?
- Which sub-step structures landed clean and which needed re-org during implementation?
- Anything in the per-chapter task pattern that felt awkward or could be tightened?
- Anything in the visual rules that proved especially load-bearing or surprisingly easy to violate?
- Any pattern (color choice, diagram structure, prompt-template / metadata-schema treatment, sequence-diagram time markers, etc.) that worked better than what the plan specified?
- For the new 2-file Section-12 split: did the Promise.all loader interact cleanly with the test harness? Any surprises in the spread-merging of two section namespaces?

The lessons are only useful if they're real. Skip a bullet if it doesn't apply. Add bullets the prompts don't cover if something else stood out.

- [ ] **Step 2: Read M3 plan with M2 lessons in mind**

Open `docs/superpowers/plans/2026-05-16-section-12-milestone-3.md`. Scan for places where the M2 lessons would apply:

- If M2 showed a visual pattern works better than what M3 specifies, update the relevant sub-step descriptions in M3.
- If M2 showed a test regex pattern catches more bugs, update M3's test patterns.
- If M2 showed a task structure was awkward, simplify the equivalent structure in M3.
- If M2 introduced a useful helper / convention / utility not anticipated in M3, thread it into the M3 plan.

- [ ] **Step 3: Edit M3 plan if needed**

If lessons translate to plan edits, make them inline in `docs/superpowers/plans/2026-05-16-section-12-milestone-3.md`. Keep edits scoped: only change what M2 directly informs. Do NOT rewrite M3 wholesale.

If no edits are warranted, skip and proceed to commit.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list.

- [ ] **Step 6: Commit the lessons file + any plan edits**

```bash
git add docs/superpowers/lessons/section-12-m2-lessons.md docs/superpowers/plans/2026-05-16-section-12-milestone-3.md
git commit -m "Capture M2 lessons and refine M3 plan"
```

If only the lessons file changed and no M3 plan edits were made:

```bash
git add docs/superpowers/lessons/section-12-m2-lessons.md
git commit -m "Capture M2 lessons; no M3 plan edits needed"
```

- [ ] **Step 7: Generate beautiful starter prompt for M3**

Create `docs/superpowers/starter-prompts/section-12-m3-starter.md` (create the `starter-prompts/` directory if it doesn't exist).

The file content should be a ready-to-paste prompt for starting M3 in a fresh Claude Code session:

`````markdown
# M3 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 3 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-3.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m2-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone3"
- After M3 ships, execute the final refinement task before starting M4

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m2-lessons.md` to know what M2 taught
- Confirmed `git log` shows M2 commits cleanly merged on main
- Verified `npm run test` is green on main
`````

Commit the starter prompt file:

```bash
git add docs/superpowers/starter-prompts/section-12-m3-starter.md
git commit -m "Add M3 starter prompt for next session"
```

- [ ] **Step 8: M2 complete. Ready to start M3.**

---

## What Comes Next

After this milestone, remaining sections are planned just-in-time:

| Milestone | Acts | Chapters | When planned |
|---|---|---|---|
| M3 | Acts 4+5 (embed/index choices, query transformation) | 12.14-12.21 (8 ch) | After M2 ships |
| M4 | Acts 6+7 (context/generation, advanced retrieval) | 12.22-12.30 (9 ch) | After M3 ships |
| M5 | Act 8 (evaluation) | 12.31-12.35 (5 ch) | After M4 ships |
| M6 | Acts 9+10 (production ops, decision framework + capstone) | 12.36-12.41 (6 ch) | After M5 ships |

M3 may introduce additional section files per the spec's file-split plan (e.g., `src/sections/rag-retrieval.jsx`). If so, the M3 plan should mirror M2 Task 2's scaffold-and-loader-rewire infrastructure pattern: create the new file with stubs, extend Section 12's Promise.all in `learn-ai.jsx` to a 3-file (or more) merge, update both `lookup.test.js` and `sections.test.jsx` imports + lookup spreads.

After M6: a final pass updates CLAUDE.md mapping with all 41 chapters, runs full discoverability sync (`public/llms.txt` and `index.html` JSON-LD `teaches` array - though M1 already seeded the section-level entries), and applies the title-case-for-diagram-boxes rule globally to CLAUDE.md (per spec's flagged update).

---

## Self-Review Notes

**Spec coverage:** All 10 new chapters (3 ingestion + 7 chunking) from the spec are implemented as tasks. Sub-step counts: 12.4=6, 12.5=5, 12.6=5 (ingestion subtotal 16); 12.7=6, 12.8=5, 12.9=5, 12.10=5, 12.11=6, 12.12=7, 12.13=5 (chunking subtotal 39); total 55 new sub-steps.

**Component-name consistency:**
- Ingestion component names match spec exactly: `ParsingExtraction`, `DeduplicationCleaning`, `RefreshSync`.
- Chunking component names match spec exactly: `WhyChunkFixedSize`, `RecursiveStructuralChunking`, `SemanticChunking`, `LateChunking`, `HierarchicalChunking`, `ContextualRetrieval`, `ChunkingDecision`.
- Chapter IDs match spec: 12.4 through 12.13 with ingestion as 12.4-12.6 and chunking as 12.7-12.13.
- Titles match spec exactly (including parentheticals: "(Jina 2024)", "(Anthropic 2024)", "/ Parent-Child Chunking", "& Cleaning", "& Sync Schedules").
- All Box colors used (`C.cyan`, `C.green`, `C.purple`, `C.orange`, `C.yellow`, `C.red`, `C.pink`, `C.blue`) exist in the palette.

**File split:** Section 12 now has TWO files. `rag-ingestion.jsx` is new in M2 and holds Act 2. `rag-foundations.jsx` retains Acts 1 + 3 (the existing 12.1-12.3 plus the new 12.7-12.13). The 2-file Promise.all loader pattern matches what Sections 8, 9, 10, 11 use.

**No placeholders:** Every test contains concrete regex assertions. Every sub-step has a titled color and concrete content spec with key strings/numbers spelled out. Every Step 5 svg-descriptions.json update gives a concrete example JSON entry. Every Step 9 commit has an exact commit message.

**Running-example coherence:** All chapters reference the customer support corpus. The Sarah-in-doc-1 narrative is introduced in 12.10 and referenced consistently. The doc-1 (password reset), doc-4 (refunds), doc-7 (login troubleshooting), doc-12 (API keys) references are used across chapters. The 5 standard queries from M1 are reused where applicable. The same password-reset article is the running ingestion example across 12.4 (parsing), 12.5 (dedup across Zendesk/Confluence/Notion), and 12.6 (v1→v2 refresh).

**Prompt-template / metadata-artifact treatment:** 12.4 sub=4 (metadata JSON) and 12.12 sub=2 (augmentation prompt) explicitly call out their artifacts as styled monospace blocks (not code blocks) per the spec's Section-12-specific rule. Background tint, soft border, monospace font, placeholder highlighting, title labeling.

**Within-section signposts:** Several chapters use "Chapter 12.X fixes this" signposts. These are allowed under rule 11 because they reference explicit chapter IDs in the visible TOC, NOT future-tense "next" / "coming up" previews. The plan explicitly forbids "Preview:" / "Next:" / "Coming up:" in Step 3 of every task.

**Test-suite scale:** M2 adds approximately 55 new content tests (5-7 per chapter × 10 chapters). Combined with M1's content tests (~17) and the generic per-sub render tests automatically added by extending `chapters[]`, the total Section 12 test count after M2 should be roughly 130+ new tests over the pre-Section-12 baseline.
