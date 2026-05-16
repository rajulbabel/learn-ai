# Section 12 Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** When you dispatch a subagent for a task, the subagent prompt MUST include: (a) the verbatim Files: list from the task, (b) the instruction "modify ONLY files in the Files: list; if you find other defects, document them but do NOT fix them in this task", and (c) the instruction "run `git diff --stat` before committing; abort if any file outside the Files: list shows as modified". The parent reviews `git diff --stat` after each subagent finishes. Scope violations are rejected and the subagent re-dispatched with the same strict prompt.
>
> **Two-stage review per task:** Stage 1 SCOPE - did the subagent modify only the listed files? Are commits clean? Stage 2 CORRECTNESS - do tests pass, does behavior match the spec? Both stages must pass before moving to the next task.

**Goal:** Add Section 12 "Retrieval-Augmented Generation" scaffolding plus the first three chapters (Act 1 - The RAG Problem: 12.1 WhyLLMsNeedRetrieval, 12.2 NaiveRAGPipeline, 12.3 WhereNaiveRAGBreaks). The app should ship at end of this milestone with a visible Section 12 in the TOC and 3 navigable chapters.

**Architecture:** Chapters live in a new section file `src/sections/rag-foundations.jsx` (will eventually hold chapters 12.1-12.3 + 12.7-12.13 = Acts 1+3 after Milestone 2; Act 2 ingestion chapters 12.4-12.6 live in a separate `rag-ingestion.jsx` added in M2). Section registration follows the same pattern as Section 11: add entries to `chapters[]`, `sectionNames`, and `sectionColors` in `src/config.js`; register a lazy loader in `src/learn-ai.jsx`; add the import to `src/__tests__/sections.test.jsx`. All chapter content follows the learn-ai visual rules in `CLAUDE.md` (progressive Reveal sub-steps, colored Boxes, real numbers, center-aligned titles, title-case for diagram boxes, zero-overlap diagrams, Chrome visual validation).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md`

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- All tests currently pass on `main` (verify in Task 1).
- Brainstormed spec is committed (done: commit `051ea38`).
- Working directly on `main`.

## File Structure

### New files

- `src/sections/rag-foundations.jsx` - Acts 1+2 chapter functions. In Milestone 1 this file contains 3 exports (WhyLLMsNeedRetrieval, NaiveRAGPipeline, WhereNaiveRAGBreaks). Milestone 2 adds 7 more (chunking chapters).

### Modified files

- `src/config.js` - add 3 entries to `chapters[]`, add entry to `sectionNames`, add entry to `sectionColors`.
- `src/learn-ai.jsx` - add loader for section 12 in `sectionLoaders`.
- `src/__tests__/sections.test.jsx` - import `RagFoundations` and add to `lookup`. Add content tests for the 3 new chapters.
- `src/__tests__/config.test.js` - add tests for Section 12 metadata + Act 1 chapter entries.
- `src/data/svg-descriptions.json` - add entries only if new `<svg>` elements are introduced (most Act 1 chapters use div-based visuals; Task 12 covers this conditionally).
- `CLAUDE.md` - add Section 12 mapping table (Act 1 only) and update project structure tree to include `rag-foundations.jsx`.
- `public/llms.txt` - add Section 12 to topic list.
- `index.html` - add "Retrieval-Augmented Generation" to JSON-LD `teaches` array.

### Unchanged

All existing section files (sections 1-11).

---

## Standard running-example values (reference during implementation)

From the spec. Use consistently across 12.1-12.3 (and the rest of the section):

- **Primary corpus:** 30-doc customer support knowledge base for fictional SaaS "Habuild Cloud" - 10 account/billing docs, 10 product feature docs, 10 troubleshooting docs.
- **Standard queries:**
  - "How do I reset my password?" (single-doc lookup baseline)
  - "How do I reset my password if I forgot my email?" (multi-hop)
  - "Why is my dashboard slow and showing 500 errors?" (multi-issue)
  - "Cancel my subscription and get a refund" (multi-step)
  - "Compare the Pro and Enterprise plans" (aggregation)
- **Embedding dim:** 8 (drawable on screen) / 1024 (production-typical e.g., Cohere v3).
- **Chunk size (tokens):** 64-128 (visible) / 512 (production typical).
- **Top-k:** 3-5 (visible) / 20-50 (production before rerank).

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Earlier sections suffered overlap defects fixed one-by-one. Validate in Chrome.
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Retrieve Top K Documents" not "retrieve top k documents". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors.
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text.
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 12 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding a NEW section file (e.g., `src/sections/rag-foundations.jsx`), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as NewSection from "../sections/new-section.jsx"`, (b) presence test asserting `typeof mod.ChapterName === "function"`, AND (c) spread `...NewSection` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as NewSection`, (b) spread `...NewSection` into the `lookup` object.
- `src/learn-ai.jsx` - register the new file in `sectionLoaders` (either single import or as part of a Promise.all if section already has multiple files).

### When adding chapters to `chapters[]` (without a new section file):

- `src/__tests__/config.test.js` - add a "Section N chapters" describe block testing the specific new entries.
- The relevant section file must already export each new `component`. If it doesn't, the lookup-spread will resolve the symbol as `undefined` and sections.test.jsx generic test fails with "fn is not a function".
- If the new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

- If the section is now multi-file, the loader becomes `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. Any earlier single-file loader for that section is REPLACED.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Tasks

### Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section12-milestone1`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section12-milestone1` (if your Claude Code build supports it)
- Settings: set the session title via `/config` or the IDE extension's session pane
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section12-milestone1" so future searches catch it

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section12-milestone1` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section12-milestone1`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

### Task 1: Verify green baseline

**Files:** none (git state + run tests)

- [ ] **Step 1: Confirm we're on main with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass. This confirms we're starting from a known-good state.

- [ ] **Step 3: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: No commit yet** - this task only verifies baseline.

---

### Task 2: Add Section 12 to sectionNames and sectionColors

**Files:**
- Modify: `src/config.js` (sectionNames object around line 170-183, sectionColors object around line 186-198)
- Modify: `src/__tests__/config.test.js`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Write failing test for Section 12 in config**

Add this test to `src/__tests__/config.test.js`. If `sectionNames`/`sectionColors` are not already imported at the top, add them to the import (most likely already imported - check first):

```js
describe("Section 12 registration", () => {
  it("has section 12 in sectionNames", () => {
    expect(sectionNames[12]).toBe("Retrieval-Augmented Generation");
  });

  it("has section 12 in sectionColors", () => {
    expect(sectionColors[12]).toBe("#7c4dff");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL - `sectionNames[12]` is `undefined`.

- [ ] **Step 3: Add Section 12 to sectionNames and sectionColors in config.js**

Edit `src/config.js`. In the `sectionNames` object, add the entry after `11: "Vector Databases"`:

```js
export const sectionNames = {
  0: "Overview",
  1: "Neural Network Foundations",
  2: "How LLMs Actually Train",
  3: "Scaling & Modern Techniques",
  4: "The Road to Transformers",
  5: "Transformer Input Pipeline",
  6: "Attention - Understanding Q, K, V",
  7: "Attention - The Full Computation",
  8: "The Encoder",
  9: "The Decoder",
  10: "Modern LLM Techniques",
  11: "Vector Databases",
  12: "Retrieval-Augmented Generation",
};
```

In the `sectionColors` object, add the entry after `11: "#f06292"`:

```js
export const sectionColors = {
  1: "#ff6b6b",
  2: "#00b8d4",
  3: "#ffd740",
  4: "#a78bfa",
  5: "#ffab40",
  6: "#00e676",
  7: "#e040fb",
  8: "#42a5f5",
  9: "#ef5350",
  10: "#26a69a",
  11: "#f06292",
  12: "#7c4dff",
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 6: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Register Section 12 in sectionNames and sectionColors"
```

---

### Task 3: Create `src/sections/rag-foundations.jsx` scaffold with 3 stub exports

**Files:**
- Create: `src/sections/rag-foundations.jsx`
- Modify: `src/__tests__/lookup.test.js`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Write failing test for the new section file**

Add to `src/__tests__/lookup.test.js` (or wherever the per-file presence checks live - scan the file first to follow the existing pattern):

```js
it("rag-foundations.jsx exports the Act 1 chapter components", async () => {
  const mod = await import("../sections/rag-foundations.jsx");
  expect(typeof mod.WhyLLMsNeedRetrieval).toBe("function");
  expect(typeof mod.NaiveRAGPipeline).toBe("function");
  expect(typeof mod.WhereNaiveRAGBreaks).toBe("function");
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: FAIL - `Cannot find module '../sections/rag-foundations.jsx'`.

- [ ] **Step 3: Create the stub file**

Create `src/sections/rag-foundations.jsx` with this content:

```jsx
import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const WhyLLMsNeedRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Why LLMs Need Retrieval (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const NaiveRAGPipeline = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Naive RAG Pipeline (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const WhereNaiveRAGBreaks = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Where Naive RAG Breaks (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 6: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-foundations.jsx src/__tests__/lookup.test.js
git commit -m "Add stub exports for rag-foundations.jsx (12.1-12.3)"
```

---

### Task 4: Register rag-foundations.jsx in learn-ai.jsx sectionLoaders

**Files:**
- Modify: `src/learn-ai.jsx` (sectionLoaders object)

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Add loader entry**

Edit `src/learn-ai.jsx`. Find `const sectionLoaders = {` and add a section 12 loader after the section 11 entry. The exact lines to add:

```js
  12: () => import("./sections/rag-foundations.jsx"),
```

The full sectionLoaders object will look like (Section 11 may itself be a multi-file Promise.all - leave that pattern intact and just add the section 12 line):

```js
const sectionLoaders = {
  // ... existing entries through section 11 ...
  12: () => import("./sections/rag-foundations.jsx"),
};
```

- [ ] **Step 2: Run lint to verify**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Boot dev server, navigate to base URL, verify no console errors**

```bash
npm run dev
```

Open `http://localhost:5173/learn-ai/` in a browser. The Section 12 chapters won't be in `chapters[]` yet (next task), so this is just a smoke check that the app still loads.

Stop the server (Ctrl-C) after verifying.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 6: Commit**

```bash
git add src/learn-ai.jsx
git commit -m "Register Section 12 loader in learn-ai.jsx"
```

---

### Task 5: Add 12.1-12.3 entries to chapters array in config.js

**Files:**
- Modify: `src/config.js` (chapters array, after Section 11 entries)
- Modify: `src/__tests__/config.test.js`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Write failing test**

Add to `src/__tests__/config.test.js`:

```js
describe("Section 12 chapters", () => {
  it("has chapters 12.1 through 12.3 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(3);
    expect(section12[0].id).toBe("12.1");
    expect(section12[0].component).toBe("WhyLLMsNeedRetrieval");
    expect(section12[0].title).toBe("Why LLMs Need Retrieval");
    expect(section12[1].id).toBe("12.2");
    expect(section12[1].component).toBe("NaiveRAGPipeline");
    expect(section12[1].title).toBe("The Naive RAG Pipeline");
    expect(section12[2].id).toBe("12.3");
    expect(section12[2].component).toBe("WhereNaiveRAGBreaks");
    expect(section12[2].title).toBe("Where Naive RAG Breaks");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL - `section12.length` is 0.

- [ ] **Step 3: Add chapter entries to config.js**

Edit `src/config.js`. Find the last Section 11 entry (around line 167 ending with `DecisionFramework`). Add Section 12 entries right after, before the closing `];`:

```js
  { id: "11.36", title: "The Decision Framework", section: 11, component: "DecisionFramework" },
  // Section 12: Retrieval-Augmented Generation
  { id: "12.1", title: "Why LLMs Need Retrieval", section: 12, component: "WhyLLMsNeedRetrieval" },
  { id: "12.2", title: "The Naive RAG Pipeline", section: 12, component: "NaiveRAGPipeline" },
  { id: "12.3", title: "Where Naive RAG Breaks", section: 12, component: "WhereNaiveRAGBreaks" },
];
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 6: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 12.1-12.3 to config"
```

---

### Task 6: Add RagFoundations to sections.test.jsx lookup

**Files:**
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

The generic test block in sections.test.jsx iterates over `chapters` and looks up each component in `lookup`. Without this import, generic tests for 12.1-12.3 will fail with "fn is not a function".

- [ ] **Step 1: Run sections.test.jsx to confirm failure before change**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: FAIL - the generic "All chapters" describe block will try to call `fn()` for 12.1-12.3 where `fn` is undefined.

- [ ] **Step 2: Add the import and spread**

Edit `src/__tests__/sections.test.jsx`. Find the existing import block at the top (after the other section imports) and add:

```js
import * as RagFoundations from "../sections/rag-foundations.jsx";
```

Then find the `lookup` object and spread `RagFoundations` into it (last spread, after the most recent vector section):

```js
const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
  ...TransformerBlock,
  ...EncoderDecoderDiagrams,
  ...ModernLLMTechniques,
  ...VectorFoundations,
  ...VectorCompression,
  ...VectorProduction,
  ...VectorSystems,
  ...RagFoundations,
};
```

(The existing list of vector imports may differ - keep them as-is and just add `...RagFoundations` at the end.)

- [ ] **Step 3: Run sections.test.jsx to verify it passes**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: PASS. The generic test now runs against 12.1-12.3 stubs which render empty sub-levels without crashing.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 6: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Register RagFoundations in sections.test lookup"
```

---

### Task 7: Implement Chapter 12.1 WhyLLMsNeedRetrieval

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (replace stub `WhyLLMsNeedRetrieval`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** The opening chapter. A bare LLM has serious limitations for production Q&A: training-data cutoff, hallucination, no provenance, no access to private data. RAG addresses each by grounding the answer in retrieved documents. Walk away knowing the 5 reasons production systems use RAG instead of (or alongside) fine-tuning.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - Bare LLM in production: where it breaks**
  Title: "Bare LLMs Have Hard Limits"
  Visual: a card grid of 5 production failure modes of bare LLM Q&A:
  - Knowledge cutoff (icon: clock; text: "Trained on data through 2023; can't answer about 2025 events")
  - Hallucination (icon: warning; text: "Will confidently invent plausible-sounding facts")
  - No citations (icon: question mark; text: "Cannot point to sources for verification")
  - Private data unknown (icon: lock; text: "Knows nothing about your internal docs")
  - Stale facts (icon: dust; text: "Public info from years ago, not last week")
  Each card uses tinted background (`${C.red}06`).
  Key content: "knowledge cutoff", "hallucination", "no citations", "private data", "stale".

- **sub=1 (C.orange) - Fine-tuning is not enough**
  Title: "Fine-Tuning Doesn't Solve The Problem"
  Visual: a 3-row comparison table: [Property | Fine-Tuning | RAG]. Rows:
  - Cost: "Tens of thousands of dollars per refresh" | "Cents per query"
  - Freshness: "Frozen at training time" | "Reflects index updates instantly"
  - Traceability: "No source attribution" | "Cite the chunk used"
  Plus brief explanation: fine-tuning bakes knowledge INTO weights (expensive to update, no audit trail). RAG keeps knowledge OUTSIDE the model in a retrievable index (cheap, fresh, traceable).
  Key content: "fine-tuning", "expensive", "freshness", "traceability", "cite".

- **sub=2 (C.cyan) - The RAG promise**
  Title: "RAG: Ground The Answer In Retrieved Documents"
  Visual: a 3-step flow diagram: [User Question] -> [Retrieve Relevant Docs] -> [LLM Reads Docs + Answers]. Each box title-case, arrows centered.
  Key content: "retrieve", "ground", "answer".

- **sub=3 (C.purple) - Side-by-side: bare vs RAG**
  Title: "Same Question, Two Answers"
  Visual: two-column comparison using the question "What is our refund policy?":
  - Left (Bare LLM): hallucinated answer ("Our standard refund policy offers a 30-day money-back guarantee on all subscriptions...") - in red text with a "MADE UP" tag.
  - Right (RAG): grounded answer with citation ("Per doc-4 (refunds.md): Refunds are issued for cancellations within 14 days of payment, prorated for annual plans.") - in green text with the cited chunk shown.
  Key content: "refund policy", "made up" / "hallucinated", "doc-4" or "[doc-4]" citation marker, "14 days".

- **sub=4 (C.green) - The 5 reasons**
  Title: "Why Production Systems Use RAG"
  Visual: a 5-card grid of the production wins:
  - Knowledge cutoff -> Solved (index is fresh)
  - Hallucination -> Reduced (model anchored to retrieved text)
  - No citation -> Solved (cite the chunk used)
  - Private data -> Solved (index your own docs)
  - Cheap to refresh -> Re-embed only changed docs
  Each card title-case, tinted background (`${C.green}06`), border (`1px solid ${C.green}12`).
  Key content: "5 reasons" or list of the 5 wins, "production".

- [ ] **Step 1: Write content tests for 12.1**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("WhyLLMsNeedRetrieval (12.1) content", () => {
  const fn = RagFoundations.WhyLLMsNeedRetrieval;

  it("sub=0 lists bare-LLM production failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/knowledge cutoff/i);
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/private/i);
  });

  it("sub=1 contrasts fine-tuning vs RAG on cost/freshness/traceability", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fine-?tun/i);
    expect(container.textContent).toMatch(/freshness|fresh/i);
    expect(container.textContent).toMatch(/cite|trace|attribution/i);
  });

  it("sub=2 shows the 3-step RAG ground-the-answer flow", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/ground|anchor/i);
  });

  it("sub=3 shows side-by-side bare-LLM vs RAG on refund policy", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/made up|hallucinat|invent/i);
    expect(container.textContent).toMatch(/doc-?4|\[doc/i);
  });

  it("sub=4 lists the 5 production reasons", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/5 reasons|five reasons/i);
    expect(container.textContent).toMatch(/private data/i);
    expect(container.textContent).toMatch(/refresh/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyLLMsNeedRetrieval"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full WhyLLMsNeedRetrieval chapter**

Replace the stub export in `src/sections/rag-foundations.jsx` with the full implementation. Use the existing pattern in `src/sections/vector-foundations.jsx` (e.g., `RetrievalProblem`) as a reference. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (red, orange, cyan, purple, green).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Knowledge Cutoff", "No Citations", "Bare LLM", "Refund Policy" - every word capitalized.
- Inner element tinted backgrounds: `background: \`${C.X}06\`` and `border: \`1px solid ${C.X}12\``.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include the strings the tests assert on (see test regexes above).
- Standalone formulas/comparison tables centered with `textAlign: "center"`.
- No "Preview:" / "Next:" / "Coming up:" forward references.

Follow the spec's chapter 12.1 description and the sub-step structure above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyLLMsNeedRetrieval"
```

Expected: PASS. Both generic sub coverage and specific content tests pass.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

Expected: all tests pass. No regressions in other sections.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

Expected: no errors. `npm run format` may modify the files; re-add after formatting.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 12.1 Why LLMs Need Retrieval"
```

---

### Task 8: Implement Chapter 12.2 NaiveRAGPipeline

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (replace stub `NaiveRAGPipeline`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Show the canonical 5-stage RAG pipeline end-to-end on the support corpus. Each stage gets its own sub-step revealing what it does, what its input/output is, and which Section 11 / Section 5 chapter taught its primitives. Walk away with a complete mental model of how a RAG system processes a single query from start to finish.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.cyan) - The 5-stage pipeline at a glance**
  Title: "The Naive RAG Pipeline"
  Visual: a horizontal flow diagram with 5 boxes left-to-right: [Chunk] -> [Embed] -> [Store] -> [Retrieve] -> [Generate]. Each box title-case, arrows centered, equal spacing. Below each box: one-word what-it-takes / what-it-returns label. Ingest pipeline (Chunk, Embed, Store) shown in one color tint; query-time pipeline (Retrieve, Generate) shown in another tint.
  Key content: "5 stages", "chunk", "embed", "store", "retrieve", "generate".

- **sub=1 (C.green) - Stage 1: Chunk**
  Title: "Stage 1: Chunk Documents Into Pieces"
  Visual: take doc-1 (password reset article from the corpus) and show it sliced into 3 chunks of ~80 tokens each. Each chunk shown as a tinted block with a chunk number label.
  Brief explanation: docs are usually too long to retrieve as a unit; we cut them into chunks small enough that one chunk is mostly about one thing.
  Brief recap: "Chunking strategies covered in detail in Acts 2 of this section."
  Key content: "chunk", "doc-1" or "password reset", "tokens", "80 tokens" or similar.

- **sub=2 (C.purple) - Stage 2: Embed**
  Title: "Stage 2: Turn Each Chunk Into A Vector"
  Visual: each of the 3 chunks from stage 1 turned into an 8-dim vector via the embedding model. Vectors shown as `[0.81, 0.12, ...]` next to each chunk.
  Brief recap: "Embeddings - covered in Section 5.2 - turn text into dense vectors. RAG uses retrieval-tuned embeddings (more in chapter 12.11)."
  Key content: "embed", "vector", "Section 5.2", reference to dim like "8" or "1024".

- **sub=3 (C.orange) - Stage 3: Store**
  Title: "Stage 3: Store Vectors In A Vector Database"
  Visual: the 3 chunk vectors (and a hint of more from other docs) populating a vector index visualization. Box labeled "Vector Index (HNSW)" with the chunks as colored dots inside.
  Brief recap: "Vector indexes (HNSW, IVF, hybrid, compression) - covered in Section 11."
  Key content: "vector database" or "vector index", "HNSW", "Section 11".

- **sub=4 (C.yellow) - Stage 4: Retrieve**
  Title: "Stage 4: Retrieve The Top-K Most Similar Chunks"
  Visual: query "How do I reset my password?" turns into a query vector via the same embedding model. Query vector finds top-3 most similar chunks in the index. Show the 3 retrieved chunks side-by-side with their similarity scores (e.g., 0.91, 0.84, 0.77).
  Key content: "How do I reset my password?", "top-3" or "top-k", "similarity", a score like "0.91".

- **sub=5 (C.pink) - Stage 5: Generate**
  Title: "Stage 5: Pack Chunks Into Prompt + LLM Generates Answer"
  Visual: a prompt-template artifact (styled monospace text block, NOT a code block) showing the template:

```
You are a helpful support assistant. Use the following documentation to
answer the user's question. If the docs don't answer, say "I don't know".

Documentation:
[doc-1, chunk 1] To reset your password, go to Settings > Security and click...
[doc-1, chunk 2] An email will be sent to your registered address with...
[doc-1, chunk 3] Click the link in that email within 24 hours to set a...

Question: How do I reset my password?
Answer:
```
  Below the template: the LLM's grounded answer with citation `[doc-1]`.
  Style: monospace 14-16px, tinted background `${C.pink}06`, border `1px solid ${C.pink}12`. Title says "Prompt Template" or similar.
  Key content: "prompt", "documentation", "answer", "doc-1" citation, "I don't know" instruction (groundedness teaser).

- **sub=6 (C.blue) - End-to-end on the running query**
  Title: "End To End: One Query, Five Stages"
  Visual: a single horizontal strip showing all 5 stages with the actual data flowing through for "How do I reset my password?". Each stage labeled with its title-case name and shows a tiny preview of the artifact at that stage (chunks -> vectors -> stored -> retrieved -> answer).
  Key content: "How do I reset my password?", all 5 stage names, the final answer or final chunk text.

- [ ] **Step 1: Write content tests for 12.2**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("NaiveRAGPipeline (12.2) content", () => {
  const fn = RagFoundations.NaiveRAGPipeline;

  it("sub=0 shows the 5-stage pipeline overview", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/store/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
  });

  it("sub=1 demonstrates chunking on doc-1 password reset", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/password reset|reset.*password|doc-?1/i);
    expect(container.textContent).toMatch(/chunk/i);
  });

  it("sub=2 references Section 5.2 for embeddings", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/section 5\.2|5\.2/i);
    expect(container.textContent).toMatch(/embed|vector/i);
  });

  it("sub=3 references Section 11 for vector storage / HNSW", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/section 11/i);
    expect(container.textContent).toMatch(/HNSW|vector (database|index)/i);
  });

  it("sub=4 retrieves top-k for the password reset query", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/top-?k|top-?3/i);
    expect(container.textContent).toMatch(/0\.\d+/); // some similarity score
  });

  it("sub=5 shows a prompt template with citation marker and I-don't-know clause", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/i don'?t know|don'?t answer/i);
    expect(container.textContent).toMatch(/\[doc-?1/i);
    expect(container.textContent).toMatch(/documentation|context/i);
  });

  it("sub=6 walks the running query end to end across all 5 stages", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "NaiveRAGPipeline"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full NaiveRAGPipeline chapter**

Replace the stub. Required (in addition to the standard rules from Task 7):

- 7 sub-steps (sub >= 0 through sub >= 6).
- Colors per sub-step as specified above (cyan, green, purple, orange, yellow, pink, blue).
- The prompt-template block in sub=5 MUST be a styled monospace block, visually distinct from a code block. Title it "Prompt Template" (title-case). Background `${C.pink}06`, border `1px solid ${C.pink}12`, font-family monospace, 14-16px.
- The pipeline diagram in sub=0 must use SVG with proper `viewBox` centering (`x_start = (viewBox_width - element_span) / 2`). Add a `<desc>` first child describing the diagram. Add the entry to `src/data/svg-descriptions.json`.
- Section 5.2 and Section 11 references in sub=2 and sub=3 use the format "Section X.Y" or "covered in Section X.Y".

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "NaiveRAGPipeline"
```

Expected: PASS.

- [ ] **Step 5: If new SVG was added, update svg-descriptions.json + verify**

If the pipeline diagram in sub=0 uses an SVG, add an entry to `src/data/svg-descriptions.json`:

```json
{
  "id": "naive-rag-pipeline-flow",
  "description": "Five-stage RAG pipeline: chunk, embed, store, retrieve, generate, shown as a horizontal flow with labeled boxes and arrows."
}
```

(Use whatever ID matches the SVG's id attribute.)

Run the SVG-descriptions test:

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Run the full test suite, lint, format**

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

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.2 The Naive RAG Pipeline"
```

---

### Task 9: Implement Chapter 12.3 WhereNaiveRAGBreaks

**Files:**
- Modify: `src/sections/rag-foundations.jsx` (replace stub `WhereNaiveRAGBreaks`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

**Chapter purpose (from spec):** Take the naive pipeline from 12.2 and show it failing across 7 named modes. Each failure mode is shown on an actual query from the standard query set, with the broken artifact made visible. Walk away knowing what the rest of Section 12 has to fix - and which act fixes which failure.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.red) - 7 failure modes overview**
  Title: "Naive RAG Has 7 Failure Modes"
  Visual: a 3x3 grid (with 2 cells empty for spacing) showing the 7 failures as cards. Each card: failure name (title-case), one-line symptom. Failures: Bad Chunking, Low Recall, Lost In Middle, No Citation, Hallucination, Stale Index, Cost / Latency.
  Key content: "7 failure modes" or "seven", at least 4 failure names visible.

- **sub=1 (C.orange) - Failure 1: Bad Chunking**
  Title: "Failure 1: Bad Chunking"
  Visual: take doc-1 (password reset) and show a fixed-size split that lands mid-sentence between "Click the link" and "within 24 hours". Show the retrieved chunk to the LLM ends mid-sentence; the LLM has to guess and produces a confused answer.
  Symptom: query "How long do I have to use the password reset link?" - retrieved chunk is split across two pieces, neither is retrieved together, model says "I don't see a time limit in the docs" (wrong - the limit is in the doc).
  Brief signpost: "Chapters 12.4-12.10 (chunking) fix this."
  Key content: "bad chunking" or "chunking", "mid-sentence" or "split", "12.4-12.10" or "chunking".

- **sub=2 (C.yellow) - Failure 2: Low Recall**
  Title: "Failure 2: Low Recall"
  Visual: query "I can't sign in to my account" embedded; the most relevant doc is titled "Login Troubleshooting" but uses the word "log in" not "sign in". Embedding-only retrieval scores it lower than less-relevant docs that share "sign in" lexically. The right doc is missed entirely from top-3.
  Symptom: model gets the wrong context, answers the wrong question.
  Brief signpost: "Chapters 12.11-12.14 (hybrid + reranker recap) and 12.15-12.18 (query transformation) fix this."
  Key content: "recall", "sign in" or "log in", "missed" or "not retrieved", "12.11-12.14" or "12.15-12.18" or "hybrid" or "reranker" or "query transformation".

- **sub=3 (C.green) - Failure 3: Lost In The Middle**
  Title: "Failure 3: Lost In The Middle"
  Visual: 10 chunks packed into a prompt. Show the U-shaped attention curve: model attends well to chunks 1-2 (start) and 9-10 (end), attention dips for chunks 4-7 (middle). The relevant chunk for the query happens to be chunk 5 - it gets ignored.
  Symptom: model has the answer in context but skips it.
  Brief signpost: "Chapters 12.19-12.21 (context packing + lost-in-middle) fix this."
  Key content: "lost in the middle", "U-shaped" or "middle", "attention", "12.19-12.21" or "context packing".

- **sub=4 (C.cyan) - Failure 4: No Citation**
  Title: "Failure 4: No Citation"
  Visual: a generated answer with no source attribution. User asks "Why is my account suspended?" - model responds with a paragraph but no `[doc-X]` markers. Reviewer cannot verify which doc the answer came from. If the model hallucinated half of it, no one can tell.
  Symptom: ungrounded, unverifiable answer.
  Brief signpost: "Chapters 12.19-12.21 (citations + groundedness) fix this."
  Key content: "citation" or "citations", "verify" or "verifiable", "12.19-12.21" or "citations" or "groundedness".

- **sub=5 (C.purple) - Failure 5: Hallucination On Partial Info**
  Title: "Failure 5: Hallucination On Partial Info"
  Visual: query "Does the Pro plan include SSO?" - retrieved chunks mention SSO is available on Enterprise but say nothing about Pro. Model fills in: "Yes, the Pro plan includes SSO" (wrong - it's Enterprise-only). Side-by-side: retrieved context (no Pro+SSO mention) vs model output (claims Pro+SSO).
  Brief signpost: "Chapters 12.19-12.21 (refusal + groundedness instruction) and 12.28-12.32 (faithfulness eval) fix this."
  Key content: "hallucinat", "Pro" and "SSO" and "Enterprise", "12.19-12.21" or "12.28-12.32" or "groundedness" or "faithfulness".

- **sub=6 (C.pink) - Failures 6 & 7: Stale Index + Cost/Latency**
  Title: "Failures 6 & 7: Stale Index, Cost, Latency"
  Visual: two side-by-side panels.
  - Left panel (Stale Index): a doc was updated 2 days ago but the embedding index hasn't been refreshed. User asks about the new policy, gets the old answer. "Embedding lifecycle - covered in Section 11.27 - and chapters 12.33-12.37 detection of drift fix this."
  - Right panel (Cost / Latency): a per-query cost breakdown showing embedding ($0.0001) + retrieval ($0.0002) + LLM tokens ($0.012 at 4000 tokens in context). At 1000 QPS this adds up. Latency: 50ms retrieval + 800ms generation = 850ms p50. "Chapters 12.33-12.37 (caching, cost models, observability) fix this."
  Key content: "stale" or "stale index", "Section 11.27", "cost", "latency", "12.33-12.37" or "caching" or "observability".

- [ ] **Step 1: Write content tests for 12.3**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("WhereNaiveRAGBreaks (12.3) content", () => {
  const fn = RagFoundations.WhereNaiveRAGBreaks;

  it("sub=0 lists the 7 failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/7|seven/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/citation|citation/i);
    expect(container.textContent).toMatch(/hallucinat/i);
  });

  it("sub=1 shows bad chunking on the password reset doc", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunking|chunk/i);
    expect(container.textContent).toMatch(/mid-?sentence|split/i);
    expect(container.textContent).toMatch(/12\.4-12\.10|chunking/i);
  });

  it("sub=2 shows low recall on sign-in vs log-in lexical mismatch", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/sign.?in/i);
    expect(container.textContent).toMatch(/12\.11-12\.18|hybrid|reranker|query.{0,20}transform/i);
  });

  it("sub=3 shows lost-in-the-middle attention U-curve", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/middle/i);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/12\.19-12\.21|context packing|lost.?in.?middle/i);
  });

  it("sub=4 shows missing citation on suspended account query", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/verify|verifiable/i);
    expect(container.textContent).toMatch(/12\.19-12\.21|citations|groundedness/i);
  });

  it("sub=5 shows hallucination on Pro vs Enterprise SSO", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/SSO/);
    expect(container.textContent).toMatch(/Pro|Enterprise/);
  });

  it("sub=6 shows stale index + cost/latency with Section 11.27 + chapter 12.33-12.37 references", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/stale/i);
    expect(container.textContent).toMatch(/Section 11\.27|11\.27/);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/12\.33-12\.37|caching|observability/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhereNaiveRAGBreaks"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WhereNaiveRAGBreaks chapter**

Replace the stub. Required (in addition to the standard rules from Task 7):

- 7 sub-steps (sub >= 0 through sub >= 6).
- Colors per sub-step as specified above (red, orange, yellow, green, cyan, purple, pink).
- The 7-failure overview grid in sub=0 must NOT have overlapping cards. Use CSS grid `display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 12`. Cards centered horizontally + vertically.
- Forward references to later chapter ranges (e.g., "Chapters 12.4-12.10") are NOT next-chapter hints (those are forbidden). They are within-section signposts pointing to which later chapters in this same Section 12 will solve each failure. Phrase as "Chapters 12.4-12.10 (chunking) fix this" or "Chapters 12.19-12.21 (citations + groundedness) fix this" - past/present tense, not "Coming up:" / "Next:". Never use the literal phrase "Act N" in chapter-visible text; learners only see chapter numbers.
- The U-curve diagram in sub=3 should be an SVG. Add `<desc>` and svg-descriptions.json entry.
- Side-by-side panels in sub=5 and sub=6 must use proper centered layout, no overlap.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhereNaiveRAGBreaks"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json if new SVGs introduced**

For any new `<svg>` elements, add an entry. For example:

```json
{
  "id": "lost-in-middle-attention-curve",
  "description": "U-shaped attention curve showing high attention at the start and end of context, low attention in the middle. The relevant chunk is in position 5 and is missed."
}
```

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS.

- [ ] **Step 6: Run the full test suite, lint, format**

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

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 9: Commit**

```bash
git add src/sections/rag-foundations.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.3 Where Naive RAG Breaks"
```

---

### Task 10: Update CLAUDE.md mapping table for Section 12 Act 1

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Add the Section 12 mapping table**

In `CLAUDE.md`, find the "Complete Mapping" section. After the Section 11 table (which ends with `11.36 | DecisionFramework | The Decision Framework`), add a new Section 12 table:

```markdown
**Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` - Act 1 only in Milestone 1; Acts 2-9 added in Milestones 2-6)

| Chapter | Component | Title |
|---------|-----------|-------|
| 12.1 | WhyLLMsNeedRetrieval | Why LLMs Need Retrieval |
| 12.2 | NaiveRAGPipeline | The Naive RAG Pipeline |
| 12.3 | WhereNaiveRAGBreaks | Where Naive RAG Breaks |
```

- [ ] **Step 2: Update the Project Structure tree**

Find the `## Project Structure` section. In the `src/sections/` block, add `rag-foundations.jsx` after the vector files:

```
│       ├── vector-systems.jsx            # Section 11 (Act 6, chapters 11.29-11.35)
│       └── rag-foundations.jsx           # Section 12 (Act 1, chapters 12.1-12.3 - in progress; Acts 2+3 added in M2)
```

- [ ] **Step 3: No test required for CLAUDE.md (it's documentation only)**

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "Document Section 12 Act 1 in CLAUDE.md mapping"
```

---

### Task 11: Update llms.txt and index.html JSON-LD for Section 12

**Files:**
- Modify: `public/llms.txt`
- Modify: `index.html`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

Per the discoverability sync rules in CLAUDE.md, any change to chapters/sectionNames must update `public/llms.txt` and `index.html` JSON-LD `teaches`. We only have 3 chapters in M1 - Section 12 itself goes into both files now; chapter-list updates can wait until M6 if preferred, OR happen incrementally. We'll do incremental: add Section 12 topic mention now.

- [ ] **Step 1: Add Section 12 to llms.txt topic list**

Open `public/llms.txt`. Find the "What it covers" section / topic list. Add a Section 12 entry after Section 11's entry. Example:

```
- Section 11: Vector Databases - HNSW, IVF, compression (PQ/SQ), hybrid search, rerankers, multi-vector retrieval, FAISS / pgvector / Qdrant / Pinecone / Weaviate / Milvus / Chroma decision framework.
- Section 12: Retrieval-Augmented Generation - chunking strategies, query transformation, context construction, citations, advanced retrieval (Self-RAG, CRAG, GraphRAG, agentic, long-context tradeoff), evaluation (LLM-as-judge, RAGAS), production operations (caching, observability, hallucination + drift), and decision framework.
```

(Adjust to match the existing llms.txt formatting style.)

- [ ] **Step 2: Add Section 12 to index.html JSON-LD `teaches` array**

Open `index.html`. Find the JSON-LD `<script type="application/ld+json">` block containing the `teaches` array. Add `"Retrieval-Augmented Generation"` to the array (after the existing Section 11 / Vector Databases entry):

```json
"teaches": [
  ...,
  "Vector Databases",
  "Retrieval-Augmented Generation"
]
```

(Adjust to match the existing array format.)

- [ ] **Step 3: Verify HTML still valid (no syntax error)**

```bash
npm run build
```

Expected: build succeeds. No JSON-LD parse error in any prerender step.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 6: Commit**

```bash
git add public/llms.txt index.html
git commit -m "Add Section 12 to llms.txt and JSON-LD teaches array"
```

---

### Task 12: Chrome browser visual validation of all 3 Act 1 chapters

**Files:** none (visual validation only); may require Bash returns to fix issues found

This is the MANDATORY validation gate from the spec. A chapter that passes tests but fails Chrome validation is NOT done.

- [ ] **Step 1: Boot the dev server**

```bash
npm run dev
```

Server should start at `http://localhost:5173/learn-ai/`. Leave it running for the rest of this task.

- [ ] **Step 2: Navigate to chapter 12.1 in Chrome via MCP**

Use `mcp__claude-in-chrome__tabs_context_mcp` first to get current tab context, then `mcp__claude-in-chrome__tabs_create_mcp` if needed to open the URL `http://localhost:5173/learn-ai/`. Use the app's keyboard navigation (right-arrow) to advance to chapter 12.1, OR use the URL/state to jump there.

- [ ] **Step 3: Step through every sub-step of 12.1 (sub=0 through sub=4)**

For each sub-step, take a screenshot via `mcp__claude-in-chrome__computer` (screenshot action) and visually check:

  - **No overlapping elements** - cards, boxes, text, SVGs do not overlap.
  - **Diagrams horizontally + vertically centered** within their containers.
  - **Title-case for diagram box text** - every word capitalized inside boxes.
  - **First letter of every line capitalized** - bullets, table cells, formula lines.
  - **All Box elements have real colors** (no `C.card` showing as gray-on-dark).
  - **Standalone formulas centered** with `textAlign: "center"`.
  - **No em-dashes** anywhere.

- [ ] **Step 4: Step through every sub-step of 12.2 (sub=0 through sub=6)**

Same checklist as Step 3. Pay extra attention to:

  - The pipeline diagram in sub=0: 5 boxes evenly spaced, equal padding left/right of the SVG.
  - The prompt-template block in sub=5: monospace, distinct from a code block, label "Prompt Template" centered.
  - The end-to-end strip in sub=6: all 5 stages visible, equal spacing, no overlap.

- [ ] **Step 5: Step through every sub-step of 12.3 (sub=0 through sub=6)**

Same checklist. Pay extra attention to:

  - The 7-failure grid in sub=0: 3-column grid, no overlap, even gaps.
  - The U-curve SVG in sub=3: properly centered in its viewBox, axis labels readable, position-5 marker visible.
  - The side-by-side panels in sub=5 and sub=6: equal width, no overlap, both panels fully visible without scroll.

- [ ] **Step 6: If any visual defect found**

Stop. Document the defect (which chapter, which sub-step, what's wrong). Fix in the chapter source file. Re-run `npm run test` to ensure no regression. Restart this task from Step 2.

- [ ] **Step 7: If all 3 chapters pass visual validation**

Stop the dev server (Ctrl-C in the dev-server terminal).

Save the final screenshots to `docs/superpowers/screenshots/section-12-m1/` for reference (create the directory if needed):

```bash
mkdir -p docs/superpowers/screenshots/section-12-m1
# Save chrome screenshots from MCP captures into this directory
```

- [ ] **Step 8: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 9: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 10: Commit screenshots (optional)**

If screenshots were saved:

```bash
git add docs/superpowers/screenshots/section-12-m1/
git commit -m "Add Section 12 M1 visual validation screenshots"
```

---

### Task 13: Final M1 verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 2: Coverage check**

```bash
npx vitest run --coverage
```

Expected: lines 100%, branches >= 97.7% (per CLAUDE.md target). If branches dropped, identify uncovered branches in new code; either add tests or document the unreachable defensive branches.

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

- [ ] **Step 6: Verify TOC shows Section 12**

Boot dev server (`npm run dev`), open `http://localhost:5173/learn-ai/`, confirm the TOC lists "Retrieval-Augmented Generation" with 3 chapters (12.1, 12.2, 12.3). Stop server.

- [ ] **Step 7: Milestone marker commit (if any unstaged docs/format-only changes remain)**

If everything is already committed from earlier tasks, no marker commit is needed. If any small drift exists (formatting, etc.):

```bash
git status
git add -p  # carefully review what to stage
git commit -m "Section 12 Milestone 1 complete: Act 1 (12.1-12.3) shipped"
```

- [ ] **Step 8: Update task status & confirm M1 done**

Verify via `git log` that the M1 commit history is clean and well-structured. Confirm the spec's M1 success criteria are met:

- [x] 3 chapters implemented in `rag-foundations.jsx`
- [x] Section 12 registered in `config.js`, `learn-ai.jsx`, `sections.test.jsx`
- [x] Tests added for every chapter at every sub-level
- [x] Coverage 100% lines, branches >= 97.7%
- [x] Lint + format clean
- [x] Every SVG has `<desc>` + `svg-descriptions.json` entry
- [x] `llms.txt` + `index.html` JSON-LD updated
- [x] CLAUDE.md mapping + project tree updated
- [x] Chrome browser visual validation passed for all 3 chapters

M1 complete. Ready to write Milestone 2 plan (Acts 2 - the 7 chunking chapters).

---

### Task 14: Plan Refinement Checkpoint for M2

**Files:**
- Create: `docs/superpowers/lessons/section-12-m1-lessons.md` (new lessons file)
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-12-milestone-2.md`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

Per the section's "lessons-feed-forward" rule, before executing M2, do a quick refinement pass on the M2 plan using what M1 taught us. The plans are editable artifacts, not contracts - this checkpoint is where M1's real-world experience gets folded into M2's plan.

- [ ] **Step 1: Lessons capture from M1 (5-10 minutes, write it down)**

Create `docs/superpowers/lessons/section-12-m1-lessons.md` with 3-5 honest bullet observations from executing M1:

- Which visual patterns rendered cleanly in Chrome and which needed iteration?
- Which test regexes were too brittle (false fail) or too loose (let bugs through)?
- Which sub-step structures landed clean and which needed re-org during implementation?
- Anything in the per-chapter task pattern that felt awkward or could be tightened?
- Anything in the visual rules that proved especially load-bearing or surprisingly easy to violate?
- Any pattern (color choice, diagram structure, prompt-template treatment, etc.) that worked better than what the plan specified?

The lessons are only useful if they're real. Skip a bullet if it doesn't apply. Add bullets the prompts don't cover if something else stood out.

- [ ] **Step 2: Read M2 plan with M1 lessons in mind**

Open `docs/superpowers/plans/2026-05-16-section-12-milestone-2.md`. Scan for places where the M1 lessons would apply:

- If M1 showed a visual pattern works better than what M2 specifies, update the relevant sub-step descriptions in M2.
- If M1 showed a test regex pattern catches more bugs, update M2's test patterns.
- If M1 showed a task structure was awkward, simplify the equivalent structure in M2.
- If M1 introduced a useful helper / convention / utility not anticipated in M2, thread it into the M2 plan.

- [ ] **Step 3: Edit M2 plan if needed**

If lessons translate to plan edits, make them inline in `docs/superpowers/plans/2026-05-16-section-12-milestone-2.md`. Keep edits scoped: only change what M1 directly informs. Do NOT rewrite M2 wholesale.

If no edits are warranted, skip and proceed to commit.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 5: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 6: Commit the lessons file + any plan edits**

```bash
git add docs/superpowers/lessons/section-12-m1-lessons.md docs/superpowers/plans/2026-05-16-section-12-milestone-2.md
git commit -m "Capture M1 lessons and refine M2 plan"
```

If only the lessons file changed and no M2 plan edits were made:

```bash
git add docs/superpowers/lessons/section-12-m1-lessons.md
git commit -m "Capture M1 lessons; no M2 plan edits needed"
```

- [ ] **Step 7: Generate beautiful starter prompt for M2**

Create `docs/superpowers/starter-prompts/section-12-m2-starter.md` (create the `starter-prompts/` directory if it doesn't exist).

The file content should be a ready-to-paste prompt for starting M2 in a fresh Claude Code session:

`````markdown
# M2 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 2 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-2.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m1-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone2"
- After M2 ships, execute the final refinement task before starting M3

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m1-lessons.md` to know what M1 taught
- Confirmed `git log` shows M1 commits cleanly merged on main
- Verified `npm run test` is green on main
`````

Commit the starter prompt file:

```bash
git add docs/superpowers/starter-prompts/section-12-m2-starter.md
git commit -m "Add M2 starter prompt for next session"
```

- [ ] **Step 8: M1 complete. Ready to start M2.**

---

## What Comes Next

After this milestone, the remaining sections of the implementation will be planned just-in-time:

| Milestone | Acts | Chapters | When planned |
|---|---|---|---|
| M2 | Act 2 (chunking) | 12.4-12.10 (7 ch) | After M1 ships |
| M3 | Acts 3+4 | 12.11-12.18 (8 ch) | After M2 ships |
| M4 | Acts 5+6 | 12.19-12.27 (9 ch) | After M3 ships |
| M5 | Act 7 (eval) | 12.28-12.32 (5 ch) | After M4 ships |
| M6 | Acts 8+9 | 12.33-12.38 (6 ch) | After M5 ships |

After M6: a final pass updates CLAUDE.md mapping with all 38 chapters, runs full discoverability sync, and applies the title-case-for-diagram-boxes rule to CLAUDE.md (per spec's flagged update).
