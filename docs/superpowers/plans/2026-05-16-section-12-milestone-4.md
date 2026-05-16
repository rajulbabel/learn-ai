# Section 12 Milestone 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Acts 5 (Context & Generation) and 6 (Advanced Retrieval Patterns) of Section 12 "Retrieval-Augmented Generation" - 9 chapters total (12.19 through 12.27). This milestone introduces a new section file `src/sections/rag-generation.jsx` and wires it into the Section 12 loader (which now spans 3 files). The app ships at end of M4 with Section 12 reaching 27 navigable chapters out of 38 total.

**Architecture:** The 9 new chapters live in a brand-new section file `src/sections/rag-generation.jsx`. Section 12 already has loaders for `rag-foundations.jsx` (M1+M2: 12.1-12.10) and `rag-retrieval.jsx` (M3: 12.11-12.18); M4 expands the Section 12 entry in `sectionLoaders` to a 3-file `Promise.all`. Each chapter follows the established Section 12 pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real artifacts (prompt templates as styled monospace text blocks - NOT code blocks), concrete support-corpus examples, plus the two secondary corpora (15-node legal citation network for GraphRAG, single 200-page product manual for Long-Context vs RAG).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md` - Acts 5 + 6.

**Prior-milestone references:**

- `docs/superpowers/plans/2026-05-16-section-12-milestone-1.md` - full per-chapter task template (Tasks 7-9 are the canonical pattern).
- `docs/superpowers/plans/2026-05-16-section-12-milestone-2.md` - chunking chapters (continuation pattern inside same section file).
- `docs/superpowers/plans/2026-05-16-section-12-milestone-3.md` - introduction of `rag-retrieval.jsx` and Section 12 loader expansion to a 2-file `Promise.all` (Task 3 there mirrors Task 3 here, but with 2 files instead of 3).

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- M1 complete and merged on `main`: `src/sections/rag-foundations.jsx` exists with chapters 12.1-12.3 (Act 1).
- M2 complete and merged on `main`: `rag-foundations.jsx` extended with chapters 12.4-12.10 (Act 2 - chunking).
- M3 complete and merged on `main`: `src/sections/rag-retrieval.jsx` exists with chapters 12.11-12.18 (Acts 3 + 4), Section 12 loader in `learn-ai.jsx` is a 2-file `Promise.all`, `sections.test.jsx` and `lookup.test.js` both import `RagFoundations` and `RagRetrieval`.
- `npm run test` green on `main`. Coverage 100% lines / >= 97.7% branches.
- `npm run lint` clean.
- Working directly on `main`, clean working tree.

## File Structure

### New files

- `src/sections/rag-generation.jsx` - Acts 5 + 6 chapter functions. In Milestone 4 this file contains 9 exports (ContextPacking, LostInTheMiddle, CitationsRefusal, MultiHopRetrieval, SelfRAG, CorrectiveRAG, GraphRAG, AgenticRAG, LongContextVsRAG). M5 introduces a separate `rag-evaluation.jsx`; no further changes to `rag-generation.jsx` planned.

### Modified files

- `src/config.js` - append 9 entries to `chapters[]` after the last Section 12 / M3 entry (12.18 QueryRoutingDecomposition).
- `src/learn-ai.jsx` - expand the Section 12 loader entry from a 2-file `Promise.all` to a 3-file `Promise.all` that also includes `rag-generation.jsx`.
- `src/__tests__/sections.test.jsx` - add `import * as RagGeneration from "../sections/rag-generation.jsx"`, spread into `lookup`, and append content-test blocks for each of the 9 new chapters.
- `src/__tests__/lookup.test.js` - add `import * as RagGeneration from "../sections/rag-generation.jsx"`, spread into `lookup`, and add a `rag-generation.jsx` presence test mirroring the M3 `rag-retrieval.jsx` presence test.
- `src/__tests__/config.test.js` - extend the Section 12 chapter-count / chapter-list test to cover the new 12.19-12.27 entries.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` to include the new SVG-bearing chapter IDs (any of `"12.19"`-`"12.27"` that introduce an SVG).
- `src/data/svg-descriptions.json` - add entries (keyed by chapter ID, value is an array of description strings, each >20 chars) for every new `<svg>` element introduced in any of the 9 new chapters.
- `CLAUDE.md` - extend Section 12 mapping table to include 12.19-12.27, update milestones annotation, and update project structure tree to include `rag-generation.jsx`.

### Unchanged

- `public/llms.txt` and `index.html` JSON-LD - Section 12 itself was registered in M1. The discoverability sync rule covers "add / rename / remove / reorder" of chapters or sectionNames. Chapter-level additions inside a registered section do not require llms.txt / JSON-LD updates per the existing pattern used in Section 11 milestones (the section's topic summary already enumerates RAG capabilities; no further granularity needed mid-section). A discoverability pass happens in M6 after the full 38-chapter section ships.
- `src/sections/rag-foundations.jsx` (do not edit; 12.1-12.10 are stable).
- `src/sections/rag-retrieval.jsx` (do not edit; 12.11-12.18 are stable).
- All pre-Section-12 section files.

---

## Standard running-example values (reference during implementation)

From the spec. Use consistently across 12.19-12.27 (and the rest of the section):

- **Primary corpus:** 30-doc customer support knowledge base for fictional SaaS "Habuild Cloud" - 10 account/billing docs, 10 product feature docs, 10 troubleshooting docs.
- **Standard queries:**
  - "How do I reset my password?" (single-doc lookup baseline)
  - "How do I reset my password if I forgot my email?" (multi-hop)
  - "Why is my dashboard slow and showing 500 errors?" (multi-issue)
  - "Cancel my subscription and get a refund" (multi-step)
  - "Compare the Pro and Enterprise plans" (aggregation)
- **Secondary corpora (this milestone uses both):**
  - **15-node legal citation network** - used ONLY in chapter 12.25 GraphRAG. Entity-relationship structure that the support corpus lacks. Mention this corpus switch in the chapter intro.
  - **Single 200-page product manual** - used ONLY in chapter 12.27 LongContextVsRAG. Demonstrates the "fits in context window" tradeoff. Mention this corpus switch in the chapter intro.
- **Embedding dim:** 8 (drawable on screen) / 1024 (production-typical e.g., Cohere v3).
- **Chunk size (tokens):** 64-128 (visible) / 512 (production typical).
- **Top-k:** 3-5 (visible) / 20-50 (production before rerank).
- **LLM context window:** 8k (visuals) / 200k (model-agnostic mention).

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Earlier sections suffered overlap defects fixed one-by-one. Validate in Chrome.
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Retrieve Top K Documents" not "retrieve top k documents". Exceptions: lowercase brand names (pgvector, numpy, iPhone), variable identifiers in formulas (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`, `[SEP]`, `<retrieve>`).
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`, `C.pink`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json` (>20 chars each).
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts pointing to later acts ("Act 7 covers the eval triangle") are permitted as past/present-tense statements about section structure, not as forward teasers.
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose". A chapter with 5 paragraphs of text and 1 diagram is failing this rule. A chapter with 1 paragraph and 5 diagrams is succeeding.

### Prompt-template artifact treatment (Section-12-specific rule)

Several Act 5/6 chapters render prompt-template artifacts (CitationsRefusal especially). Prompt templates are TEXT artifacts, NOT code blocks. Render in styled monospace blocks visually distinct from code:

- Background tint matching the box color (e.g., `${C.purple}06`).
- Soft border `1px solid ${C.purple}12`.
- Monospace font, 14-16px.
- Highlight variable placeholders (`{context}`, `{query}`, `[doc-N]`) in a distinct color.
- Label the block as "Prompt Template" (title-case) in its title T.
- Never show executable code (no Python, no JS, no SDK calls).

---

## Implementation order

1. Task 1 - Verify green baseline
2. Task 2 - Create `rag-generation.jsx` scaffold with 9 stubs
3. Task 3 - Update `learn-ai.jsx` Section 12 loader (3-file `Promise.all`)
4. Task 4 - Add 12.19-12.27 entries to `chapters[]` in `config.js`
5. Task 5 - Register `RagGeneration` in `sections.test.jsx`
6. Task 6 - Chapter 12.19 ContextPacking
7. Task 7 - Chapter 12.20 LostInTheMiddle
8. Task 8 - Chapter 12.21 CitationsRefusal
9. Task 9 - Chapter 12.22 MultiHopRetrieval
10. Task 10 - Chapter 12.23 SelfRAG
11. Task 11 - Chapter 12.24 CorrectiveRAG
12. Task 12 - Chapter 12.25 GraphRAG
13. Task 13 - Chapter 12.26 AgenticRAG
14. Task 14 - Chapter 12.27 LongContextVsRAG
15. Task 15 - Update CLAUDE.md
16. Task 16 - Final M4 verification (full suite, coverage, lint, format, build, Chrome visual validation)

Commit cadence: one commit per Task (Tasks 2-15) + one optional cleanup commit in Task 16 if any drift remains. Chrome visual validation runs at the end of each per-chapter task (Tasks 6-14) AND a final full sweep in Task 16.

---

## Task 1: Verify green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm clean state on main**

  ```bash
  git status
  git log --oneline -10
  ```

  Expected: `On branch main`, `nothing to commit, working tree clean`. Most recent commits should include the M3 final commits ("Implement chapter 12.18 Query Routing and Decomposition" or similar).

- [ ] **Step 2: Run full test suite**

  ```bash
  npm run test
  ```

  Expected: all tests pass.

- [ ] **Step 3: Run linter**

  ```bash
  npm run lint
  ```

  Expected: no errors.

- [ ] **Step 4: Coverage baseline**

  ```bash
  npx vitest run --coverage
  ```

  Expected: 100% lines, branches >= 97.7%. Record the exact branch percentage so we can verify it does not drop in Task 16.

- [ ] **Step 5: No commit yet** - this task only verifies baseline.

---

## Task 2: Create `rag-generation.jsx` scaffold with 9 stub exports

**Files:**

- Create: `src/sections/rag-generation.jsx`
- Modify: `src/__tests__/lookup.test.js`

This task creates the new section file with 9 named stub exports so subsequent tasks can implement them one chapter at a time. Each stub renders a single colored Box at sub=0 so the generic "All chapters" render test in `sections.test.jsx` does not crash once the chapters are added to config.

- [ ] **Step 1: Write failing presence test in `lookup.test.js`**

  Add this test at the bottom of `src/__tests__/lookup.test.js` (after the existing `rag-foundations.jsx` and `rag-retrieval.jsx` presence tests). Also add the import for `RagGeneration` at the top and spread it into the local `lookup` object:

  Top-of-file import block (add the new line at the end of the section imports, after `RagRetrieval`):

  ```js
  import * as RagGeneration from "../sections/rag-generation.jsx";
  ```

  Lookup object (add `...RagGeneration` as the last spread):

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
    ...RagRetrieval,
    ...RagGeneration,
  };
  ```

  Presence test (append after the existing `rag-retrieval.jsx exports the M3 chapter components` test):

  ```js
  it("rag-generation.jsx exports all Milestone 4 chapter components", async () => {
    const mod = await import("../sections/rag-generation.jsx");
    expect(typeof mod.ContextPacking).toBe("function");
    expect(typeof mod.LostInTheMiddle).toBe("function");
    expect(typeof mod.CitationsRefusal).toBe("function");
    expect(typeof mod.MultiHopRetrieval).toBe("function");
    expect(typeof mod.SelfRAG).toBe("function");
    expect(typeof mod.CorrectiveRAG).toBe("function");
    expect(typeof mod.GraphRAG).toBe("function");
    expect(typeof mod.AgenticRAG).toBe("function");
    expect(typeof mod.LongContextVsRAG).toBe("function");
  });
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  npx vitest run src/__tests__/lookup.test.js
  ```

  Expected: FAIL with `Cannot find module '../sections/rag-generation.jsx'`.

- [ ] **Step 3: Create the stub file**

  Create `src/sections/rag-generation.jsx` with this content:

  ```jsx
  import { Box, T } from "../components.jsx";
  import { C } from "../config.js";

  // Stub exports - full chapter content added in subsequent M4 tasks.

  export const ContextPacking = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={22}>
              Context Packing (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const LostInTheMiddle = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={22}>
              The Lost-in-the-Middle Problem (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const CitationsRefusal = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={22}>
              Citations, Refusal and Groundedness (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const MultiHopRetrieval = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              Multi-Hop Retrieval (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const SelfRAG = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              Self-RAG (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const CorrectiveRAG = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              CRAG - Corrective RAG (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const GraphRAG = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              GraphRAG (Microsoft 2024) (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const AgenticRAG = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              Tool-Augmented and Agentic RAG (stub)
            </T>
          </Box>
        )}
      </div>
    );
  };

  export const LongContextVsRAG = (ctx) => {
    const { sub } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.blue} style={{ width: "100%" }}>
            <T color={C.blue} bold center size={22}>
              Long-Context vs RAG (stub)
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

- [ ] **Step 5: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/lookup.test.js
  git commit -m "Add stub exports for rag-generation.jsx (12.19-12.27)"
  ```

---

## Task 3: Update `learn-ai.jsx` Section 12 loader to a 3-file `Promise.all`

**Files:**

- Modify: `src/learn-ai.jsx` (sectionLoaders object)

After M3, the Section 12 loader is a 2-file `Promise.all` of `rag-foundations.jsx` and `rag-retrieval.jsx`. M4 expands it to 3 files by adding `rag-generation.jsx`.

- [ ] **Step 1: Update the section 12 loader entry**

  Edit `src/learn-ai.jsx`. Find the `const sectionLoaders = { ... }` object. The Section 12 entry currently looks like (after M3):

  ```js
    12: () =>
      Promise.all([
        import("./sections/rag-foundations.jsx"),
        import("./sections/rag-retrieval.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

  Change it to:

  ```js
    12: () =>
      Promise.all([
        import("./sections/rag-foundations.jsx"),
        import("./sections/rag-retrieval.jsx"),
        import("./sections/rag-generation.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

- [ ] **Step 2: Run lint to verify**

  ```bash
  npm run lint
  ```

  Expected: no errors.

- [ ] **Step 3: Run the dev-mode lookup validation (via tests)**

  ```bash
  npm run test
  ```

  Expected: all tests pass. The dev-mode `[lookup]` validator in `learn-ai.jsx` will not complain because all 9 stub exports exist (Task 2) but config entries (Task 4) are not yet added - lookup just iterates `chapters[]`, so missing entries cause no error here.

- [ ] **Step 4: Boot dev server smoke check (optional)**

  ```bash
  npm run dev
  ```

  Open `http://localhost:5173/learn-ai/`, navigate to any Section 12 chapter that already exists (e.g., 12.1, 12.5, 12.15). Confirm the app still loads, no console errors. Stop the server (Ctrl-C).

- [ ] **Step 5: Commit**

  ```bash
  git add src/learn-ai.jsx
  git commit -m "Expand Section 12 loader to include rag-generation.jsx"
  ```

---

## Task 4: Add 12.19-12.27 entries to chapters array in config.js

**Files:**

- Modify: `src/config.js` (chapters array, after Section 12 / M3 entries)
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write failing test**

  Find the existing `describe("Section 12 chapters", ...)` block in `src/__tests__/config.test.js` (added in M1, extended in M2 + M3). Extend the test to assert all 27 chapters now present (M1 added 12.1-12.3, M2 added 12.4-12.10, M3 added 12.11-12.18, M4 adds 12.19-12.27). Replace the existing expected array with the full 27-entry list:

  ```js
  describe("Section 12 chapters", () => {
    it("has chapters 12.1 through 12.27 in order", () => {
      const section12 = chapters.filter((ch) => ch.section === 12);
      const expected = [
        { id: "12.1", component: "WhyLLMsNeedRetrieval", title: "Why LLMs Need Retrieval" },
        { id: "12.2", component: "NaiveRAGPipeline", title: "The Naive RAG Pipeline" },
        { id: "12.3", component: "WhereNaiveRAGBreaks", title: "Where Naive RAG Breaks" },
        { id: "12.4", component: "WhyChunkFixedSize", title: "Why Chunk At All + Fixed-Size Baseline" },
        { id: "12.5", component: "RecursiveStructuralChunking", title: "Recursive Structural Chunking" },
        { id: "12.6", component: "SemanticChunking", title: "Semantic Chunking" },
        { id: "12.7", component: "LateChunking", title: "Late Chunking (Jina 2024)" },
        { id: "12.8", component: "HierarchicalChunking", title: "Hierarchical / Parent-Child Chunking" },
        { id: "12.9", component: "ContextualRetrieval", title: "Contextual Retrieval (Anthropic 2024)" },
        { id: "12.10", component: "ChunkingDecision", title: "The Chunking Decision" },
        { id: "12.11", component: "EmbeddingModelChoice", title: "Picking an Embedding Model" },
        { id: "12.12", component: "DomainAdaptation", title: "Domain Adaptation - Fine-Tuning Embeddings" },
        { id: "12.13", component: "HybridForRAG", title: "Hybrid Retrieval for RAG" },
        { id: "12.14", component: "RerankerCascade", title: "The Reranker Cascade" },
        { id: "12.15", component: "WhyTransformQueries", title: "Why Transform Queries" },
        { id: "12.16", component: "HyDE", title: "HyDE - Hypothetical Document Embeddings" },
        { id: "12.17", component: "MultiQueryExpansion", title: "Multi-Query Expansion" },
        { id: "12.18", component: "QueryRoutingDecomposition", title: "Query Routing & Decomposition" },
        { id: "12.19", component: "ContextPacking", title: "Context Packing" },
        { id: "12.20", component: "LostInTheMiddle", title: "The Lost-in-the-Middle Problem" },
        { id: "12.21", component: "CitationsRefusal", title: "Citations, Refusal & Groundedness" },
        { id: "12.22", component: "MultiHopRetrieval", title: "Multi-Hop Retrieval" },
        { id: "12.23", component: "SelfRAG", title: "Self-RAG" },
        { id: "12.24", component: "CorrectiveRAG", title: "CRAG - Corrective RAG" },
        { id: "12.25", component: "GraphRAG", title: "GraphRAG (Microsoft 2024)" },
        { id: "12.26", component: "AgenticRAG", title: "Tool-Augmented & Agentic RAG" },
        { id: "12.27", component: "LongContextVsRAG", title: "Long-Context vs RAG" },
      ];
      expect(section12.length).toBe(expected.length);
      expected.forEach((exp, i) => {
        expect(section12[i].id).toBe(exp.id);
        expect(section12[i].component).toBe(exp.component);
        expect(section12[i].title).toBe(exp.title);
      });
    });
  });
  ```

  (If the prior M3 expected array used slightly different titles for 12.1-12.18 verbatim, keep those exact titles. Match the existing config.js text exactly. Only the new 12.19-12.27 lines are M4 additions.)

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  npx vitest run src/__tests__/config.test.js -t "Section 12"
  ```

  Expected: FAIL - `section12.length` is 18, not 27.

- [ ] **Step 3: Add chapter entries to config.js**

  Edit `src/config.js`. Find the last Section 12 entry from M3 (`{ id: "12.18", title: "Query Routing & Decomposition", section: 12, component: "QueryRoutingDecomposition" },`). Add Section 12 M4 entries right after, before the closing `];`:

  ```js
    { id: "12.18", title: "Query Routing & Decomposition", section: 12, component: "QueryRoutingDecomposition" },
    { id: "12.19", title: "Context Packing", section: 12, component: "ContextPacking" },
    { id: "12.20", title: "The Lost-in-the-Middle Problem", section: 12, component: "LostInTheMiddle" },
    { id: "12.21", title: "Citations, Refusal & Groundedness", section: 12, component: "CitationsRefusal" },
    { id: "12.22", title: "Multi-Hop Retrieval", section: 12, component: "MultiHopRetrieval" },
    { id: "12.23", title: "Self-RAG", section: 12, component: "SelfRAG" },
    { id: "12.24", title: "CRAG - Corrective RAG", section: 12, component: "CorrectiveRAG" },
    { id: "12.25", title: "GraphRAG (Microsoft 2024)", section: 12, component: "GraphRAG" },
    { id: "12.26", title: "Tool-Augmented & Agentic RAG", section: 12, component: "AgenticRAG" },
    { id: "12.27", title: "Long-Context vs RAG", section: 12, component: "LongContextVsRAG" },
  ];
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  npx vitest run src/__tests__/config.test.js
  ```

  Expected: PASS.

- [ ] **Step 5: Commit**

  ```bash
  git add src/config.js src/__tests__/config.test.js
  git commit -m "Add chapter entries 12.19-12.27 to config"
  ```

---

## Task 5: Register RagGeneration in sections.test.jsx lookup

**Files:**

- Modify: `src/__tests__/sections.test.jsx`

The generic `describe("All chapters - full sub + interaction coverage", ...)` block iterates `chapters[]` and looks up each component in `lookup`. Without registering `RagGeneration`, 12.19-12.27 will fail with "fn is not a function" because the `chapters[]` entries now reference components that aren't in the test-side lookup.

- [ ] **Step 1: Run sections.test.jsx to confirm failure before change**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx
  ```

  Expected: FAIL - the generic "All chapters" describe block will throw on the new 12.19-12.27 entries.

- [ ] **Step 2: Add the import and spread**

  Edit `src/__tests__/sections.test.jsx`. Find the existing import block at the top (after `RagRetrieval`) and add:

  ```js
  import * as RagGeneration from "../sections/rag-generation.jsx";
  ```

  Then find the `lookup` object and add `...RagGeneration` as the last spread (after `...RagRetrieval`):

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
    ...RagRetrieval,
    ...RagGeneration,
  };
  ```

- [ ] **Step 3: Run sections.test.jsx to verify it passes**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx
  ```

  Expected: PASS. The generic test now runs against 12.19-12.27 stubs which render only sub=0 without crashing.

- [ ] **Step 4: Commit**

  ```bash
  git add src/__tests__/sections.test.jsx
  git commit -m "Register RagGeneration in sections.test lookup"
  ```

---

## Task 6: Implement Chapter 12.19 ContextPacking

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `ContextPacking`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add new SVG descriptions)
- Modify: `src/__tests__/svg-descriptions.test.js` (extend `expectedChapters` to include `"12.19"`)

**Chapter purpose (from spec):** Pack the top-k retrieved chunks into the LLM prompt under a fixed token budget. Show the structural template (system prompt + retrieved context + question + reserved completion tokens), three ordering strategies (relevance-first, chronological, deduplicated), and MMR (maximal marginal relevance) for diverse-not-redundant packing. Walk away knowing exactly what goes into the prompt, why ordering matters, and what to drop when the budget overflows.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.yellow) - The token budget**
  Title: "Every Prompt Has A Token Budget"
  Visual: a stacked horizontal bar showing the 8k-token budget split: System Prompt (200 tokens, 2.5%), Retrieved Context (5000 tokens, 62.5%), User Question (50 tokens, 0.6%), Reserved Completion (1500 tokens, 18.75%), Headroom (1250 tokens, 15.6%). Bar segments use real percentage widths. Each segment labeled with both token count and percentage. Below the bar: a 4-row table breaking out the same numbers explicitly.
  Key content: "token budget", "system prompt", "retrieved context", "completion", numbers like "8000" or "8k", percentages.

- **sub=1 (C.cyan) - The 3 retrieved chunks for our running query**
  Title: "Pack Top-3 Chunks For The Password Reset Query"
  Visual: 3 chunk cards stacked vertically, each labeled with chunk ID, source doc, relevance score, and a preview of the text:
  - `[doc-1, chunk 1]` (score 0.91): "To reset your password, go to Settings then Security..."
  - `[doc-1, chunk 2]` (score 0.84): "An email with a reset link will be sent to your registered address..."
  - `[doc-1, chunk 3]` (score 0.77): "Click the link within 24 hours to set a new password."
  Each card has title-case header, tinted background `${C.cyan}06`, border `1px solid ${C.cyan}12`.
  Key content: "doc-1", "chunk 1" / "chunk 2" / "chunk 3", scores "0.91" / "0.84" / "0.77", "password reset" or "How do I reset my password?".

- **sub=2 (C.purple) - Ordering option 1: Relevance-first**
  Title: "Ordering Option 1: Relevance-First"
  Visual: same 3 chunks reordered by score descending (already 0.91, 0.84, 0.77 - so unchanged), placed inside a mock prompt frame. Label below: "Default. Most-relevant chunk goes first - good when the model attends well to the start."
  Key content: "relevance-first" or "relevance first", "most relevant".

- **sub=3 (C.green) - Ordering option 2: Chronological**
  Title: "Ordering Option 2: Chronological"
  Visual: same 3 chunks reordered by publication date (or document position): chunk 1 -> chunk 2 -> chunk 3 from the doc. Label: "Useful for time-sensitive docs (changelogs, policy histories, incident timelines). Preserves natural reading order so the model can follow cause-effect."
  Key content: "chronological", "chronological order" or "timeline" or "time-sensitive".

- **sub=4 (C.orange) - Ordering option 3: Deduplicated + MMR**
  Title: "Ordering Option 3: Deduplicate With MMR"
  Visual: two side-by-side panels.
  - Left panel ("Before MMR"): 5 chunks where chunks 2 and 4 say essentially the same thing about the reset link. Show both with a red strikethrough on the redundant one. "60% of token budget wasted on a duplicate."
  - Right panel ("After MMR"): 4 chunks - the duplicate is dropped, and a chunk about MFA (related but different) takes its slot. "Same budget, more unique information."
  Brief formula:
  ```
  MMR = lambda * sim(chunk, query) - (1 - lambda) * max(sim(chunk, already-picked))
  ```
  centered with `textAlign: "center"`, monospace, tinted background `${C.orange}06`. Caption: "Lambda = 0.7 weights relevance over diversity; lambda = 0.3 weights diversity over relevance."
  Key content: "MMR" or "maximal marginal relevance", "duplicate" or "redundant", "lambda", "diversity".

- **sub=5 (C.pink) - The final packed prompt**
  Title: "The Final Packed Prompt"
  Visual: a styled monospace prompt-template block (NOT a code block) showing the complete packed prompt:
  ```
  You are a helpful support assistant. Use the documentation below to answer.
  If the docs don't contain the answer, say "I don't have enough information".

  Documentation:
  [doc-1, chunk 1] To reset your password, go to Settings then Security...
  [doc-1, chunk 2] An email with a reset link will be sent to your address...
  [doc-1, chunk 3] Click the link within 24 hours to set a new password.

  Question: How do I reset my password?
  Answer:
  ```
  Background tint `${C.pink}06`, border `1px solid ${C.pink}12`, monospace 14-16px. Below the template: total token count "Total: ~4,800 tokens of 8,000 budget (60% used)" and a green "Within budget" badge.
  Key content: "How do I reset my password", "doc-1", "I don't have enough information" or "I don't know", "tokens" / "budget".

- [ ] **Step 1: Write content tests for 12.19**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("ContextPacking (12.19) content", () => {
    const fn = RagGeneration.ContextPacking;

    it("sub=0 shows the token budget breakdown with completion reservation", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/token budget|budget/i);
      expect(container.textContent).toMatch(/system prompt/i);
      expect(container.textContent).toMatch(/completion|reserved/i);
      expect(container.textContent).toMatch(/8000|8k|8,000/i);
    });

    it("sub=1 shows top-3 chunks for the password reset query with scores", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/how do i reset my password|password reset/i);
      expect(container.textContent).toMatch(/doc-?1/i);
      expect(container.textContent).toMatch(/0\.\d+/);
    });

    it("sub=2 explains relevance-first ordering", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/relevance.?first|most relevant/i);
    });

    it("sub=3 explains chronological ordering", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/chronological|timeline|time.?sensitive/i);
    });

    it("sub=4 shows MMR deduplication with lambda parameter", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/MMR|maximal marginal/i);
      expect(container.textContent).toMatch(/lambda/i);
      expect(container.textContent).toMatch(/duplicate|redundant|diversity/i);
    });

    it("sub=5 shows the final packed prompt with budget badge", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/documentation|context/i);
      expect(container.textContent).toMatch(/\[doc-?1/i);
      expect(container.textContent).toMatch(/i don'?t (have|know)|don'?t.{0,10}answer/i);
      expect(container.textContent).toMatch(/tokens?|budget/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "ContextPacking"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full ContextPacking chapter**

  Replace the stub export in `src/sections/rag-generation.jsx`. Required:

  - 6 sub-steps total (sub >= 0 through sub >= 5).
  - Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
  - Colors per sub-step as specified above (yellow, cyan, purple, green, orange, pink).
  - Center-aligned titles: `<T color={C.X} bold center size={22}>`.
  - Title-case for all diagram box text: "Token Budget", "System Prompt", "Retrieved Context", "Relevance-First", "Chronological", "Final Packed Prompt".
  - Inner element tinted backgrounds: `background: \`${C.X}06\``, `border: \`1px solid ${C.X}12\``, `borderRadius: 8`.
  - No em-dashes anywhere.
  - The token-budget stacked bar in sub=0 SHOULD be an SVG (so dimensions are precise). Add `<desc>` as first child and add entry to `svg-descriptions.json` (Step 5).
  - The MMR formula in sub=4 is a standalone monospace block centered with `textAlign: "center"`.
  - The final packed prompt in sub=5 is a styled monospace block, NOT a code block. Title it via a T element above ("The Final Packed Prompt").
  - Body text 16-19px, titles 22px.
  - No "Coming up:" / "Next:" / "Preview:" forward references.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "ContextPacking"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description for the token-budget bar**

  In `src/data/svg-descriptions.json`, add a key `"12.19"` with an array of description strings. Example:

  ```json
  "12.19": [
    "Stacked horizontal bar visualizing how an 8000-token LLM context budget splits across system prompt, retrieved chunks, user question, and reserved completion tokens."
  ]
  ```

  Then extend `src/__tests__/svg-descriptions.test.js` `expectedChapters` array to include `"12.19"`. Find the existing test `it("covers all chapters known to have SVGs", ...)`, locate the `expectedChapters` array, and add `"12.19"` in section-12 order.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green. Format may modify files; re-stage if so.

- [ ] **Step 8: Chrome visual validation for 12.19**

  Boot `npm run dev`. In Chrome via MCP (load tools via ToolSearch first), navigate to chapter 12.19. Step through sub=0 to sub=5. Check:

  - No overlap.
  - All boxes have real colors (not C.card).
  - Token-budget bar is horizontally centered in its container; segment widths sum to 100%.
  - Prompt template block in sub=5 is monospace, visually distinct from a code block.
  - All diagram-box text title-case.
  - All standalone formulas (the MMR line) centered.

  Fix any issues in source; re-run tests; re-validate. Stop dev server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.19 Context Packing"
  ```

---

## Task 7: Implement Chapter 12.20 LostInTheMiddle

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `LostInTheMiddle`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.20"` to `expectedChapters`)

**Chapter purpose (from spec):** The U-shaped attention curve. LLMs attend best to the start and end of a long context window; the middle gets ignored. Empirical finding from Liu et al. 2023 ("Lost in the Middle"). Show the curve, the consequence on retrieval-augmented answers, and two mitigation strategies: highest-relevance-first (front-load) and sandwich (best at start AND end). Walk away knowing why position-of-relevant-chunk matters and what to do about it.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.yellow) - The U-shaped accuracy curve**
  Title: "Accuracy By Position Of The Relevant Chunk"
  Visual: SVG plot of the U-curve. X-axis: position of relevant chunk among 20 packed chunks (1-20). Y-axis: answer accuracy (0-100%). Curve starts high (~85% at position 1), dips to ~55% around positions 8-12, climbs back to ~80% at position 20. Mark the position-5 baseline as "Middle - 60% accuracy". Annotate with "Liu et al. 2023".
  Key content: "U-shaped" or "lost in the middle", "position", "accuracy", "Liu et al" or "2023".

- **sub=1 (C.red) - The consequence on a real query**
  Title: "Same Answer In Context, Two Outcomes"
  Visual: two stacked rows showing the same 10-chunk packed prompt for "Does the Pro plan include SSO?". The answer-bearing chunk is chunk 5 (middle) in row A and chunk 1 (front) in row B. Row A's output: "I don't see SSO mentioned for the Pro plan" (wrong - the doc is right there, model ignored it). Row B's output: "No, SSO is Enterprise-only" (correct). Label each row with the position of the relevant chunk.
  Key content: "Pro" and "SSO" and "Enterprise", "ignored" or "missed" or "wrong", "position".

- **sub=2 (C.green) - Strategy 1: Relevance-first (front-load)**
  Title: "Strategy 1: Front-Load The Most Relevant Chunk"
  Visual: a horizontal strip of 10 chunk slots, sorted by retrieval score descending. Top-scored chunk at position 1 (green highlight), lowest-scored at position 10. Caption: "Cheap. Helps for single-best-answer queries. Risk: tail context still ignored."
  Key content: "front-load" or "front load" or "first" or "relevance-first", "strategy 1" or "first strategy".

- **sub=3 (C.cyan) - Strategy 2: Sandwich (best at start AND end)**
  Title: "Strategy 2: Sandwich The Best Chunks At Start And End"
  Visual: a horizontal strip of 10 chunk slots. Slots 1, 2 (front sandwich): top-2 scored chunks. Slots 9, 10 (back sandwich): chunks 3-4 scored. Middle slots: tail. The middle dip on the U-curve becomes the least-relevant region. Caption: "More robust for multi-fact queries. Same total tokens. Costs reordering compute (negligible)."
  Key content: "sandwich", "start and end" or "front and back", "multi-fact" or "multiple".

- **sub=4 (C.purple) - When neither helps**
  Title: "When Reordering Isn't Enough"
  Visual: a 3-card grid of failure modes:
  - "Truly Long Multi-Fact Queries" - 30 chunks all needed; even sandwich leaves middle facts ignored. Fix: hierarchical summarization or multi-hop retrieval (12.22).
  - "Tail-Buried Critical Detail" - the killer fact is in chunk 18; both strategies miss it. Fix: rerank harder, fetch fewer.
  - "Model-Specific Curve Shape" - some models have flatter curves than others; benchmark on your own model. Caption: "Lost-in-middle is a model fingerprint, not a universal law."
  Key content: "multi-fact" or "long" or "30 chunks", "rerank" or "fetch fewer", "model" or "benchmark", reference to "12.22" or "multi-hop".

- [ ] **Step 1: Write content tests for 12.20**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("LostInTheMiddle (12.20) content", () => {
    const fn = RagGeneration.LostInTheMiddle;

    it("sub=0 shows the U-shaped accuracy curve with Liu et al reference", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/U-?shaped|middle|position/i);
      expect(container.textContent).toMatch(/accuracy/i);
      expect(container.textContent).toMatch(/Liu|2023/i);
    });

    it("sub=1 shows the Pro+SSO query failing when answer chunk is in middle", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/SSO/);
      expect(container.textContent).toMatch(/Pro|Enterprise/);
      expect(container.textContent).toMatch(/position|chunk 5|middle/i);
    });

    it("sub=2 explains the front-load / relevance-first strategy", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/front-?load|relevance.?first|strategy 1|first strategy/i);
    });

    it("sub=3 explains the sandwich strategy with best at start and end", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/sandwich/i);
      expect(container.textContent).toMatch(/start and end|front and back/i);
    });

    it("sub=4 covers failure modes including reference to multi-hop 12.22", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/multi-?fact|multi-?hop|long/i);
      expect(container.textContent).toMatch(/rerank|fetch|benchmark/i);
      expect(container.textContent).toMatch(/12\.22|multi-hop/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LostInTheMiddle"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full LostInTheMiddle chapter**

  Replace the stub. Required:

  - 5 sub-steps (sub >= 0 through sub >= 4).
  - Colors per sub-step as specified (yellow, red, green, cyan, purple).
  - The U-curve plot in sub=0 MUST be an SVG with proper `viewBox` centering (`x_start = (viewBox_width - element_span) / 2`). Add `<desc>` first child.
  - Axis labels in the U-curve SVG title-case ("Position In Context", "Accuracy (%)").
  - Forward reference to "12.22 multi-hop retrieval" is permitted as a within-section signpost, NOT a "Next chapter:" hint.
  - Standalone formulas / score comparisons centered.
  - Body text 16-19px, titles 22px.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LostInTheMiddle"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.20"`:

  ```json
  "12.20": [
    "U-shaped accuracy curve plotting answer correctness against the position of the relevant chunk within a 20-chunk context, showing high accuracy at the start and end and a dip in the middle from the Liu et al. 2023 lost-in-the-middle finding."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.20"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.20**

  Boot dev server. Navigate to 12.20. Step sub=0 to sub=4. Check: U-curve SVG centered and readable; axis labels visible; sandwich diagram in sub=3 evenly spaced 10 slots, no overlap; failure-mode cards in sub=4 in 3-column grid no overlap. Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.20 The Lost-in-the-Middle Problem"
  ```

---

## Task 8: Implement Chapter 12.21 CitationsRefusal

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `CitationsRefusal`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry if introduced)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.21"` if SVG introduced)

**Chapter purpose (from spec):** The prompt-template artifact for inline citations and refusal. Show the production-grade template: instruct the model to emit `[doc-N]` markers, output structured citation JSON, and refuse to answer when context is insufficient. Faithfulness measurement preview (each claim must trace to a chunk). Walk away with the exact wording every production RAG should use. NOTE: The prompt-template block MUST be a styled monospace text artifact, NOT a code block.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.yellow) - Why citations matter**
  Title: "Why Citations Are A Production Requirement"
  Visual: side-by-side comparison of two answers to "Why is my account locked?".
  - Left ("No Citations"): "Your account may be locked due to too many failed logins or a billing issue." User cannot verify. Reviewer cannot audit. If hallucinated, no one catches it.
  - Right ("With Citations"): "Your account locks after 5 failed logins [doc-12]. Billing issues trigger a 24-hour hold [doc-7]." Each claim traceable to a specific chunk. Audit-friendly. Hallucinations exposed.
  Key content: "citation" or "citations", "verify" or "audit" or "trace", "doc-12" or "[doc" marker.

- **sub=1 (C.cyan) - The citation instruction in the prompt template**
  Title: "Tell The Model To Cite Inline"
  Visual: a styled monospace Prompt Template block (NOT a code block) showing:
  ```
  You are a helpful support assistant. Use the documentation below
  to answer the user's question.

  For every claim you make, cite the source as [doc-N], where N is
  the doc number from the Documentation section. Do NOT cite a doc
  you did not use.

  Documentation:
  {context}

  Question: {query}
  Answer:
  ```
  Background tint `${C.cyan}06`, border `1px solid ${C.cyan}12`, monospace 14-16px. Variable placeholders `{context}` and `{query}` and `[doc-N]` highlighted in a distinct color. Title T above the block: "Prompt Template" (title-case).
  Key content: "Prompt Template" (title case in title), "documentation", "[doc-N]" or "[doc", "{context}" or "{query}".

- **sub=2 (C.purple) - Structured citation JSON output**
  Title: "Or Ask For Structured Citations"
  Visual: a styled monospace block showing a JSON-shape output schema (NOT a code block - render as a styled text artifact with the same monospace + tinted-background pattern):
  ```
  {
    "answer": "Your account locks after 5 failed logins.",
    "citations": [
      { "doc_id": "doc-12", "chunk_id": 3, "quote": "5 failed login attempts" }
    ],
    "confidence": 0.92
  }
  ```
  Caption: "Structured output makes citations machine-parseable. Better for downstream audit pipelines."
  Key content: "structured", "JSON" or "citations", "doc_id" or "confidence", "audit" or "machine".

- **sub=3 (C.red) - The refusal instruction**
  Title: "Tell The Model To Refuse When Context Is Missing"
  Visual: another styled monospace Prompt Template block showing:
  ```
  If the documentation does not contain enough information to answer,
  respond with EXACTLY this sentence and nothing else:
  "I don't have enough information to answer that."

  Do not invent facts. Do not guess. Do not cite a doc you didn't use.
  ```
  Background tint `${C.red}06`. Below: a side-by-side comparison.
  - Left ("Without Refusal Instruction"): query "What's the refund window for monthly plans?" with no matching doc -> model invents "Monthly plans have a 7-day refund window" (hallucination).
  - Right ("With Refusal Instruction"): same query -> "I don't have enough information to answer that." (safe).
  Key content: "refuse" or "refusal", "I don't have enough information" or "don't invent", "hallucinat" or "guess", "7-day" or "refund".

- **sub=4 (C.green) - Faithfulness preview**
  Title: "Faithfulness: Every Claim Must Trace To A Chunk"
  Visual: a 3-step audit diagram:
  - Step 1: Parse model answer into atomic claims (e.g., "5 failed logins" / "24-hour hold").
  - Step 2: For each claim, locate the cited chunk.
  - Step 3: Score: claim_supported = LLM-judge(claim, chunk). Aggregate -> faithfulness score (0-1).
  Caption: "Act 7 of this section covers RAGAS faithfulness in depth."
  Key content: "faithfulness", "claim" or "claims", "trace" or "cited", "RAGAS" or "score", "Act 7".

- **sub=5 (C.orange) - The citation parser**
  Title: "Parse Citations Back Out Of The Answer"
  Visual: a 2-row diagram:
  - Row 1: model output text with `[doc-12]` and `[doc-7]` markers highlighted in orange.
  - Row 2: arrows pointing down to a citation-list table with columns [Marker | Doc | Chunk | Quoted Span]. Each marker resolved to the actual chunk it came from.
  Caption: "Regex `\\[doc-\\d+\\]` extracts inline markers. Map back to retrieved chunks. Render as footnotes or inline tooltips in your UI."
  Key content: "parser" or "parse", "[doc-12]" or "[doc-7]", "footnote" or "tooltip" or "UI", "regex" or "extract".

- **sub=6 (C.pink) - The complete citation + refusal template**
  Title: "Production Template: Citations Plus Refusal"
  Visual: ONE final styled monospace Prompt Template block combining everything:
  ```
  You are a helpful support assistant. Use ONLY the documentation
  below to answer the user's question.

  RULES:
  1. Cite every claim inline as [doc-N], where N is the doc number.
  2. Quote 3-7 words from the cited chunk after each [doc-N].
  3. If the docs do not answer the question, respond with EXACTLY:
     "I don't have enough information to answer that."
  4. Do not invent facts. Do not paraphrase what isn't in the docs.

  Documentation:
  {context}

  Question: {query}
  Answer:
  ```
  Background tint `${C.pink}06`, border `1px solid ${C.pink}12`. Title T above: "Prompt Template - Production".
  Key content: "RULES" or "rules", "[doc-N]", "I don't have enough information", "{context}" and "{query}", "Production" (title text).

- [ ] **Step 1: Write content tests for 12.21**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("CitationsRefusal (12.21) content", () => {
    const fn = RagGeneration.CitationsRefusal;

    it("sub=0 contrasts no-citation vs cited answer for account-locked query", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/citation/i);
      expect(container.textContent).toMatch(/verify|audit|trace/i);
      expect(container.textContent).toMatch(/\[doc-?\d+/);
    });

    it("sub=1 shows a prompt template with [doc-N] citation instruction", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/prompt template/i);
      expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
      expect(container.textContent).toMatch(/\{context\}|\{query\}/);
    });

    it("sub=2 shows structured citation JSON output", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/structured|JSON/i);
      expect(container.textContent).toMatch(/doc_id|citations|confidence/i);
    });

    it("sub=3 shows refusal instruction and 'I don't have enough information' phrase", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/refuse|refusal/i);
      expect(container.textContent).toMatch(/i don'?t have enough information|don'?t invent/i);
      expect(container.textContent).toMatch(/hallucinat|guess|invent/i);
    });

    it("sub=4 introduces faithfulness with claim tracing and Act 7 reference", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/faithfulness/i);
      expect(container.textContent).toMatch(/claim|trace|cited/i);
      expect(container.textContent).toMatch(/Act 7|RAGAS/i);
    });

    it("sub=5 explains parsing [doc-N] markers back to chunks", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/parse|parser/i);
      expect(container.textContent).toMatch(/\[doc-?\d+/);
      expect(container.textContent).toMatch(/footnote|tooltip|UI|regex|extract/i);
    });

    it("sub=6 shows the production combined template with rules and refusal", () => {
      const { container } = render(fn(makeCtx({ sub: 6 })));
      expect(container.textContent).toMatch(/RULES|rules/);
      expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
      expect(container.textContent).toMatch(/i don'?t have enough information/i);
      expect(container.textContent).toMatch(/\{context\}|\{query\}/);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "CitationsRefusal"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full CitationsRefusal chapter**

  Replace the stub. Required:

  - 7 sub-steps (sub >= 0 through sub >= 6).
  - Colors per sub-step (yellow, cyan, purple, red, green, orange, pink).
  - All prompt-template blocks rendered as STYLED MONOSPACE TEXT ARTIFACTS, never as code blocks. Pattern (re-stated):
    - Container div: `padding: 16`, `borderRadius: 8`, `background: \`${C.X}06\``, `border: \`1px solid ${C.X}12\``.
    - Inner pre/div: `fontFamily: "ui-monospace, SFMono-Regular, monospace"`, `fontSize: 14-16`, `lineHeight: 1.5`, `whiteSpace: "pre"`, `textAlign: "left"`.
    - Variable placeholders `{context}` / `{query}` / `[doc-N]` rendered in a distinct color (e.g., `${C.X}` text on the tinted background) via inline `<span>` wrapping.
    - Title T above the block must be `bold center` and use the label "Prompt Template" or "Prompt Template - Production" (title-case).
  - The JSON-shape block in sub=2 follows the same styled-monospace-text-artifact pattern (NOT a code block).
  - Faithfulness diagram in sub=4 can be plain divs or SVG; if SVG, register description in svg-descriptions.json.
  - Within-section reference to Act 7 / RAGAS in sub=4 is a signpost, not a forward "Next" hint.
  - Standalone formulas and JSON blocks center-aligned with `textAlign: "center"` on the OUTER container; the inner monospace `<pre>` stays `textAlign: "left"` so the text remains readable.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "CitationsRefusal"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description if introduced**

  If the faithfulness diagram in sub=4 OR the parser diagram in sub=5 is an SVG, add an entry to `src/data/svg-descriptions.json`:

  ```json
  "12.21": [
    "Three-step faithfulness audit diagram: parse the LLM answer into atomic claims, locate each claim's cited chunk, score support via an LLM judge."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.21"` only if an SVG was added.

- [ ] **Step 6: Run svg-descriptions test if updated**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.21**

  Boot dev server. Navigate to 12.21. Step sub=0 to sub=6. Check:

  - Every prompt-template block is monospace and visually distinct from the surrounding paragraphs.
  - Prompt-template title T says "Prompt Template" (title-case) above each artifact.
  - Variable placeholders highlighted in a distinct color.
  - No overlap of any element.
  - The structured JSON block in sub=2 also styled as monospace text artifact.
  - The production combined template in sub=6 fits within typical viewport width without horizontal scroll on a 14-inch display.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.21 Citations, Refusal and Groundedness"
  ```

---

## Task 9: Implement Chapter 12.22 MultiHopRetrieval

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `MultiHopRetrieval`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.22"`)

**Chapter purpose (from spec):** Some queries need a chain of retrievals. "How do I reset my password if I forgot my email?" needs (1) the password-reset doc AND (2) the email-recovery doc. The iterative pattern: retrieve -> evaluate sufficiency -> retrieve again or answer. Walk away knowing the loop structure, when to use it, and the failure modes (infinite loop, divergence, cost blow-up).

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.blue) - Why one retrieval isn't always enough**
  Title: "Some Queries Need More Than One Retrieval"
  Visual: side-by-side.
  - Left ("Single-Hop Works"): "How do I reset my password?" -> 1 retrieval -> doc-1 (password reset) -> answer.
  - Right ("Multi-Hop Needed"): "How do I reset my password if I forgot my email?" -> 1 retrieval only finds doc-1 (password reset). But the question also needs doc-3 (email change / recovery). One retrieval misses half.
  Key content: "multi-hop" or "multiple retrievals" or "chain", "How do I reset my password if I forgot my email", "doc-1" and "doc-3".

- **sub=1 (C.cyan) - The 2-hop trace on the running query**
  Title: "Two Hops On The Running Query"
  Visual: a vertical flow diagram with two boxes labeled "Hop 1" and "Hop 2".
  - Hop 1: Query "How do I reset my password if I forgot my email?" -> retrieve top-3 -> doc-1 (password reset) returned. Model reads doc-1 and realizes: "Reset requires email access. User says they forgot email - need email recovery info."
  - Hop 2: Reformulated query "How do I recover access if I forgot my email?" -> retrieve top-3 -> doc-3 (email change / recovery) returned. Now model has both pieces.
  - Final answer: combines doc-1 + doc-3 with citations.
  Key content: "Hop 1", "Hop 2", "doc-1" and "doc-3", "email recovery" or "recover" or "forgot email", "reformulate" or "reformulation".

- **sub=2 (C.purple) - The control loop**
  Title: "The Multi-Hop Control Loop"
  Visual: a flowchart SVG.
  - Start -> Retrieve top-k for current query
  - -> "Does context answer the question?" diamond
  - -> If YES -> Generate answer -> End
  - -> If NO and hops < max_hops -> Reformulate query (LLM call) -> back to Retrieve
  - -> If NO and hops >= max_hops -> Refuse ("I don't have enough information") -> End
  Annotate with: max_hops typically 3-5; each hop adds 1 retrieval + 1 LLM call latency.
  Key content: "loop" or "control loop", "max_hops" or "max hops", "reformulate", "refuse" or "I don't have", "latency".

- **sub=3 (C.green) - The sufficiency-check prompt**
  Title: "Asking The Model: 'Do You Have Enough?'"
  Visual: a styled monospace Prompt Template block (NOT code):
  ```
  You are an assistant deciding whether you have enough information.

  Question: {query}
  Retrieved so far:
  {context}

  Respond with EXACTLY one of:
  - SUFFICIENT (you can answer the question from the retrieved text)
  - INSUFFICIENT: <one short follow-up query to retrieve more>

  Do not answer the question yet.
  ```
  Background tint `${C.green}06`. Below: an example trace - hop 1 emits "INSUFFICIENT: How do I recover access if I forgot my email?"; hop 2 emits "SUFFICIENT".
  Key content: "SUFFICIENT", "INSUFFICIENT", "follow-up" or "follow up", "Prompt Template" (title).

- **sub=4 (C.orange) - When multi-hop is worth it**
  Title: "When To Reach For Multi-Hop"
  Visual: a 2x2 grid.
  - Top-left ("Worth It"): "Compound questions" (your password reset if you forgot your email), "Cross-doc reasoning" (compare Pro vs Enterprise plans), "Step-dependent flows" (cancel subscription then refund).
  - Top-right ("Not Worth It"): "Single-doc lookups", "Simple FAQ-style queries" (cost outweighs benefit).
  - Bottom-left ("Cost Multiplier"): "Each hop = 1 retrieval + 1 LLM call. 3 hops = ~3x latency + 3x cost vs single-hop."
  - Bottom-right ("Mitigations"): "Cap max_hops at 3", "Cache reformulated queries", "Use a smaller model for the sufficiency check".
  Key content: "worth it" or "compound", "single-doc" or "simple", "cost" or "latency", "max_hops" or "cap".

- **sub=5 (C.red) - The failure modes**
  Title: "Failure Modes: Infinite Loops And Divergence"
  Visual: a 3-card grid.
  - "Infinite Loop": model never says SUFFICIENT. Each hop reformulates without making progress. Mitigation: hard cap on max_hops + log every reformulation.
  - "Divergence": each reformulation drifts farther from the original intent. Query "How do I reset my password?" becomes "How do I configure SSO?" by hop 3. Mitigation: keep the ORIGINAL query in the reformulation prompt as an anchor.
  - "Stuck Sufficiency Judge": model always says SUFFICIENT after hop 1 even when context is incomplete (overconfident). Mitigation: separate judge model, calibration via golden dataset.
  Key content: "infinite loop", "divergence" or "drift", "stuck" or "overconfident", "max_hops" or "cap", "original query" or "anchor".

- [ ] **Step 1: Write content tests for 12.22**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("MultiHopRetrieval (12.22) content", () => {
    const fn = RagGeneration.MultiHopRetrieval;

    it("sub=0 contrasts single-hop with the forgot-email multi-hop case", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/multi-?hop|multiple retrievals/i);
      expect(container.textContent).toMatch(/how do i reset my password.*forgot my email/i);
      expect(container.textContent).toMatch(/doc-?1/i);
      expect(container.textContent).toMatch(/doc-?3/i);
    });

    it("sub=1 traces 2 hops with reformulation", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/hop 1/i);
      expect(container.textContent).toMatch(/hop 2/i);
      expect(container.textContent).toMatch(/reformulat/i);
    });

    it("sub=2 shows the control loop with max_hops and refuse branches", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/loop|control/i);
      expect(container.textContent).toMatch(/max_?hops/i);
      expect(container.textContent).toMatch(/refuse|i don'?t have/i);
    });

    it("sub=3 shows the sufficiency-check prompt template", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/prompt template/i);
      expect(container.textContent).toMatch(/SUFFICIENT/);
      expect(container.textContent).toMatch(/INSUFFICIENT/);
    });

    it("sub=4 lists when multi-hop is worth the cost", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/worth it|compound|cross-doc/i);
      expect(container.textContent).toMatch(/cost|latency/i);
      expect(container.textContent).toMatch(/max_?hops|cap/i);
    });

    it("sub=5 covers infinite loop, divergence, and stuck judge failure modes", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/infinite loop/i);
      expect(container.textContent).toMatch(/divergence|drift/i);
      expect(container.textContent).toMatch(/stuck|overconfident/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "MultiHopRetrieval"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full MultiHopRetrieval chapter**

  Replace the stub. Required:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step (blue, cyan, purple, green, orange, red).
  - The 2-hop trace in sub=1 must use a vertical flow with clear "Hop 1" / "Hop 2" labels (title-case).
  - The control loop in sub=2 MUST be an SVG flowchart with proper centering and a `<desc>` first child. Diamond decision shapes labeled "Sufficient?" (title-case).
  - The sufficiency-check prompt in sub=3 is a styled monospace text artifact, NOT a code block (same pattern as 12.21).
  - The 2x2 grid in sub=4 must use `display: grid; gridTemplateColumns: 1fr 1fr; gap: 12` with each cell having `textAlign: "center"`.
  - The 3-card grid in sub=5 must not overlap; use `gridTemplateColumns: repeat(3, 1fr)`.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "MultiHopRetrieval"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.22"`:

  ```json
  "12.22": [
    "Multi-hop retrieval control-loop flowchart: retrieve, check sufficiency, either generate the answer or reformulate the query and loop again until max_hops is reached."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.22"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.22**

  Navigate to 12.22 in Chrome. Step sub=0 to sub=5. Check: 2-hop vertical flow in sub=1 has clear top-to-bottom direction with arrows; control loop SVG in sub=2 centered with all diamond/box edges aligned; prompt template in sub=3 properly styled monospace artifact; 2x2 grid in sub=4 and 3-card grid in sub=5 each have no overlap.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.22 Multi-Hop Retrieval"
  ```

---

## Task 10: Implement Chapter 12.23 SelfRAG

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `SelfRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.23"`)

**Chapter purpose (from spec):** Self-RAG (Asai et al. 2023): the model itself decides whether to retrieve, how many docs to retrieve, and self-critiques each retrieved doc with special tokens. Token-level decisions: `<retrieve>`, `<no-retrieve>`, `<isrel>`, `<issup>`. Trained via instruction tuning + RL on retrieval decisions. Walk away knowing the token vocabulary, the gate diagram, and when Self-RAG outperforms naive RAG.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.blue) - The retrieval gate problem**
  Title: "Should The Model Retrieve, Or Just Answer?"
  Visual: 3 query cards.
  - "What is 2 + 2?" -> No retrieval needed (factoid, common knowledge).
  - "How do I reset my password?" -> Retrieval needed (custom corpus).
  - "Summarize what we just discussed." -> No retrieval needed (already in context).
  Caption: "Always-retrieve wastes tokens and latency. Never-retrieve risks hallucination. Self-RAG learns to decide per token."
  Key content: "retrieve" or "retrieval", "always-retrieve" or "always retrieve", "never-retrieve" or "never retrieve", "decide" or "decision".

- **sub=1 (C.cyan) - The Self-RAG token vocabulary**
  Title: "Four Special Tokens"
  Visual: a 2x2 grid of tokens with one-line definitions:
  - `<retrieve>` - "Retrieve a document now." (title-case caption)
  - `<no-retrieve>` - "Do not retrieve. Answer from the model's own knowledge."
  - `<isrel>` - "Is this retrieved doc relevant? Emitted after each retrieved doc."
  - `<issup>` - "Is the answer supported by the retrieved doc? Emitted with the answer."
  Each token shown in a monospace font on tinted card.
  Note: the angle-bracket tokens are token names - the surrounding card text is title-case.
  Key content: all four token names: `<retrieve>`, `<no-retrieve>`, `<isrel>`, `<issup>`.

- **sub=2 (C.purple) - Token emission timeline**
  Title: "Token Emission Timeline On A Real Query"
  Visual: a horizontal timeline SVG. X-axis: token emission order. Markers along the line:
  - Token 1: `<retrieve>` (model decides to fetch)
  - Token 2-3: query reformulation
  - Token 4: doc-1 retrieved (off-line callout)
  - Token 5: `<isrel>` (model judges doc-1 relevant)
  - Tokens 6-20: answer text generated
  - Token 21: `<issup>` (model judges answer supported)
  Below the timeline: short caption explaining each token's role.
  Key content: "timeline", "token", at least 2 of the 4 special tokens.

- **sub=3 (C.green) - The decision diamond at the retrieve gate**
  Title: "The Retrieve / No-Retrieve Gate"
  Visual: an SVG flowchart with a diamond at the top: "Need External Knowledge?".
  - YES branch -> emit `<retrieve>` -> fetch docs -> emit `<isrel>` for each -> generate answer with `<issup>`.
  - NO branch -> emit `<no-retrieve>` -> generate answer from internal knowledge.
  Caption: "Trained via instruction tuning plus RL on retrieval decisions. Reduces unnecessary retrievals by ~40% in the original paper."
  Key content: "retrieve" and "no-retrieve" (the tokens), "gate" or "decision", "RL" or "instruction tuning", "40%" or "paper" or "Asai".

- **sub=4 (C.orange) - The self-critique loop**
  Title: "Self-Critique: Re-Score Every Retrieved Doc"
  Visual: a per-doc table showing `<isrel>` scores for 3 retrieved docs:
  - doc-1 (password reset) -> `<isrel> = RELEVANT` -> keep
  - doc-9 (login troubleshooting) -> `<isrel> = PARTIALLY RELEVANT` -> keep but de-weight
  - doc-22 (rate limits) -> `<isrel> = IRRELEVANT` -> drop
  Below: the model writes the answer using only the kept docs. After the answer, it emits `<issup>` with one of {FULLY-SUPPORTED, PARTIALLY-SUPPORTED, NO-SUPPORT}.
  Key content: "isrel" or "<isrel>", "RELEVANT" or "IRRELEVANT" or "PARTIALLY", "issup" or "<issup>", "FULLY-SUPPORTED" or "SUPPORTED".

- **sub=5 (C.pink) - When Self-RAG wins and when it doesn't**
  Title: "Self-RAG Wins And Limits"
  Visual: a 2-column comparison.
  - Left ("Wins"): "Mixed-knowledge corpora (some queries need retrieval, some don't)", "Latency-sensitive (skips retrieval for ~40% of queries)", "Adaptive depth (decides how many docs to fetch)".
  - Right ("Limits"): "Requires a model trained for Self-RAG (not plug-and-play)", "Token vocabulary increases serialization cost", "Calibration of the special-token classifier is the bottleneck".
  Caption: "Self-RAG is a model contract, not a prompting trick. Use it when you can fine-tune."
  Key content: "wins" or "limits" or "tradeoff", "fine-tune" or "train", "40%" or "latency", "calibration" or "classifier" or "contract".

- [ ] **Step 1: Write content tests for 12.23**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("SelfRAG (12.23) content", () => {
    const fn = RagGeneration.SelfRAG;

    it("sub=0 shows when to retrieve vs not", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/retriev/i);
      expect(container.textContent).toMatch(/always.?retrieve|never.?retrieve|decide/i);
    });

    it("sub=1 lists the four Self-RAG special tokens", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/<retrieve>/);
      expect(container.textContent).toMatch(/<no-retrieve>/);
      expect(container.textContent).toMatch(/<isrel>/);
      expect(container.textContent).toMatch(/<issup>/);
    });

    it("sub=2 shows the token emission timeline", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/timeline|token/i);
      expect(container.textContent).toMatch(/<(retrieve|isrel|issup)>/);
    });

    it("sub=3 shows the retrieve/no-retrieve gate with RL/instruction tuning reference", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/gate|decision/i);
      expect(container.textContent).toMatch(/<retrieve>|<no-retrieve>|retrieve/i);
      expect(container.textContent).toMatch(/RL|instruction.?tun|reinforcement/i);
    });

    it("sub=4 shows self-critique with isrel and issup token outputs", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/isrel|<isrel>/i);
      expect(container.textContent).toMatch(/issup|<issup>/i);
      expect(container.textContent).toMatch(/RELEVANT|IRRELEVANT|SUPPORTED/);
    });

    it("sub=5 lists wins and limits including fine-tune requirement", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/wins|limits|tradeoff/i);
      expect(container.textContent).toMatch(/fine-?tune|train/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "SelfRAG"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full SelfRAG chapter**

  Replace the stub. Required:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step (blue, cyan, purple, green, orange, pink).
  - The special tokens `<retrieve>`, `<no-retrieve>`, `<isrel>`, `<issup>` are token literals - render in monospace, with the angle brackets visible.
  - Per the visual rules, the special-token names are exempt from the title-case rule (they're tokens like `[CLS]`). Surrounding card titles and captions are title-case.
  - The timeline in sub=2 MUST be an SVG with proper viewBox centering and `<desc>`.
  - The gate flowchart in sub=3 can be reused-pattern SVG (or a second SVG). Add `<desc>` to each.
  - Standalone score tables centered with `textAlign: "center"`.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "SelfRAG"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.23"`:

  ```json
  "12.23": [
    "Self-RAG token-emission timeline showing the model alternating between special control tokens like <retrieve>, <isrel>, and <issup> across the generation sequence.",
    "Retrieve / no-retrieve decision diamond that gates whether the Self-RAG model fetches external context for a given query."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.23"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.23**

  Navigate to 12.23. Step sub=0 to sub=5. Check: special tokens visible with angle brackets in monospace; timeline SVG in sub=2 centered with all 6+ markers evenly spaced; decision diamond in sub=3 with clear YES/NO branches; per-doc table in sub=4 with 3 rows and no overlap.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.23 Self-RAG"
  ```

---

## Task 11: Implement Chapter 12.24 CorrectiveRAG (CRAG)

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `CorrectiveRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.24"`)

**Chapter purpose (from spec):** Corrective RAG (CRAG, Yan et al. 2024): a retrieval evaluator scores each retrieved doc as Correct / Ambiguous / Incorrect. If Incorrect: fall back to web search or expanded query. If Ambiguous: combine internal + external. Knowledge refinement: decompose retrieved docs into strips and keep only the relevant strips. Walk away knowing the 3-branch decision tree and when CRAG outperforms baseline.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.blue) - The retrieval evaluator**
  Title: "Score Every Retrieved Doc Before Using It"
  Visual: 3 retrieved docs for query "What is our cancellation policy for monthly plans?":
  - doc-7 (refunds, mentions cancellation) -> score 0.92 -> CORRECT (green).
  - doc-22 (rate limits) -> score 0.31 -> INCORRECT (red).
  - doc-15 (subscription tiers, partial overlap) -> score 0.62 -> AMBIGUOUS (yellow).
  The evaluator can be a small classifier model or LLM judge.
  Key content: "evaluator" or "score", "CORRECT" and "AMBIGUOUS" and "INCORRECT", at least one score like "0.92".

- **sub=1 (C.green) - Branch 1: CORRECT path**
  Title: "Correct: Use Retrieved Docs Directly"
  Visual: a flow box: retrieved doc -> knowledge refinement (strip extraction, next sub) -> generate answer with citations.
  Caption: "Highest-confidence path. Same as baseline RAG once the docs pass the evaluator."
  Key content: "correct", "directly" or "use" or "baseline", "citations" or "refine".

- **sub=2 (C.red) - Branch 2: INCORRECT path**
  Title: "Incorrect: Fall Back To Web Search"
  Visual: a flow box: doc fails evaluator -> rewrite query for web search -> external search -> use external results -> generate answer.
  Annotate: "Web fallback costs latency (300-800ms) and requires a search API. Trade-off vs admitting 'I don't know'."
  Key content: "incorrect", "web search" or "fallback", "latency" or "300" or "800", "search API" or "external".

- **sub=3 (C.orange) - Branch 3: AMBIGUOUS path**
  Title: "Ambiguous: Combine Internal + Web"
  Visual: a flow box: doc partial -> retain doc + also fetch web -> merge both into context -> generate answer.
  Caption: "Hedge bet. Highest cost. Use when refusal is unacceptable but confidence is low."
  Key content: "ambiguous", "combine" or "merge" or "hedge", "internal" and "web".

- **sub=4 (C.purple) - Knowledge refinement: strip-level filtering**
  Title: "Decompose Retrieved Docs Into Strips"
  Visual: take doc-7 (refunds) - originally 800 tokens. Split into 6 strips of 100-150 tokens each. Evaluator scores each strip individually:
  - Strip 1 (refund eligibility) -> KEEP
  - Strip 2 (annual plans prorating) -> KEEP
  - Strip 3 (refund processing time) -> KEEP
  - Strip 4 (tax handling) -> DROP (off-topic for query)
  - Strip 5 (legal disclaimers) -> DROP
  - Strip 6 (chargeback policy) -> DROP
  Final: 3 kept strips, 50% of original tokens, all on-topic. Pack into prompt.
  Key content: "strip" or "strips", "decompose" or "decomposition", "KEEP" and "DROP", "on-topic" or "off-topic".

- **sub=5 (C.cyan) - The 3-branch decision tree**
  Title: "The CRAG Decision Tree"
  Visual: an SVG flowchart.
  - Top: Query + Retrieved Docs.
  - Diamond: Evaluator Score.
  - 3 branches: CORRECT (down-left to "Use Docs"), AMBIGUOUS (down to "Combine Internal + Web"), INCORRECT (down-right to "Web Search Fallback").
  - All 3 branches converge into: Knowledge Refinement -> Generate Answer.
  Caption: "3 branches. 1 evaluator. Yan et al. 2024."
  Key content: "decision tree", all 3 branches "CORRECT" and "AMBIGUOUS" and "INCORRECT", "evaluator", "Yan" or "2024".

- [ ] **Step 1: Write content tests for 12.24**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("CorrectiveRAG (12.24) content", () => {
    const fn = RagGeneration.CorrectiveRAG;

    it("sub=0 shows retrieval evaluator scoring 3 docs", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/evaluator|score/i);
      expect(container.textContent).toMatch(/CORRECT/);
      expect(container.textContent).toMatch(/AMBIGUOUS/);
      expect(container.textContent).toMatch(/INCORRECT/);
    });

    it("sub=1 explains the CORRECT branch using docs directly", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/correct/i);
      expect(container.textContent).toMatch(/directly|use|baseline/i);
    });

    it("sub=2 explains the INCORRECT branch with web search fallback", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/incorrect/i);
      expect(container.textContent).toMatch(/web search|fallback/i);
    });

    it("sub=3 explains the AMBIGUOUS branch combining internal and web", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/ambiguous/i);
      expect(container.textContent).toMatch(/combine|merge|hedge/i);
    });

    it("sub=4 shows strip-level decomposition and per-strip KEEP/DROP", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/strip|strips/i);
      expect(container.textContent).toMatch(/KEEP/);
      expect(container.textContent).toMatch(/DROP/);
    });

    it("sub=5 shows the 3-branch CRAG decision tree with Yan et al reference", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/decision tree|decision/i);
      expect(container.textContent).toMatch(/CORRECT/);
      expect(container.textContent).toMatch(/AMBIGUOUS/);
      expect(container.textContent).toMatch(/INCORRECT/);
      expect(container.textContent).toMatch(/Yan|2024/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "CorrectiveRAG"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full CorrectiveRAG chapter**

  Replace the stub. Required:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step (blue, green, red, orange, purple, cyan).
  - The 3 scored doc cards in sub=0 use color-coded backgrounds (green CORRECT, red INCORRECT, yellow AMBIGUOUS) but the parent Box still uses C.blue.
  - The strip table in sub=4 uses a 6-row layout with KEEP/DROP badges in distinct colors.
  - The decision tree SVG in sub=5 MUST have proper viewBox centering and `<desc>`. 3 branches symmetric (left/center/right) with equal-length arrows.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "CorrectiveRAG"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.24"`:

  ```json
  "12.24": [
    "CRAG three-branch decision tree: an evaluator score routes retrieved docs to a CORRECT path (use directly), an AMBIGUOUS path (combine internal + web), or an INCORRECT path (web-search fallback), all converging into knowledge refinement before generation."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.24"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.24**

  Navigate to 12.24. Step sub=0 to sub=5. Check: the 3 scored doc cards in sub=0 visually distinct (green/yellow/red); the strip table in sub=4 has 6 visible rows with no overlap; the 3-branch decision tree in sub=5 is symmetric, equal arrow lengths, all branches converge properly.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.24 CRAG - Corrective RAG"
  ```

---

## Task 12: Implement Chapter 12.25 GraphRAG

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `GraphRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.25"`)

**Chapter purpose (from spec):** GraphRAG (Microsoft, Edge et al. 2024): build an entity-relationship graph from the corpus offline (LLM extracts entities + relations), then at query time retrieve a subgraph. Community detection + per-community summarization enables global queries ("what are the main themes?"). This chapter uses the SECONDARY CORPUS: 15-node legal-citation network. Mention in chapter intro that the customer-support corpus does NOT have rich enough relationships, so this chapter switches to the legal-citation secondary corpus where entity-relationship structure exists naturally.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.blue) - Why customer-support corpus doesn't fit GraphRAG**
  Title: "Why This Chapter Uses A Different Corpus"
  Visual: a 2-column comparison.
  - Left ("Customer Support Corpus - Won't Fit"): 30 docs, mostly self-contained how-to pages. Relationships are sparse (Account section docs reference each other a bit, but no rich graph). GraphRAG over this corpus would build a thin graph - not enough to demonstrate the technique.
  - Right ("Legal Citation Network - Fits"): 15 case decisions where each cites 2-5 prior cases. Rich entity-relationship structure (Plaintiff, Defendant, Court, Statute, Holding). Citations form a real graph. This is the corpus for this chapter.
  Caption: "Same support corpus returns in 12.26. This chapter only uses the legal-citation secondary corpus."
  Key content: "legal" or "legal citation", "15" or "fifteen", "citation network" or "graph", "secondary corpus" or "different corpus".

- **sub=1 (C.cyan) - Offline: entity + relation extraction**
  Title: "Offline: Extract Entities And Relations With An LLM"
  Visual: take one example case "Smith v Jones (2018)". Show LLM extraction:
  - Entities: Smith (Plaintiff), Jones (Defendant), Northern District Court (Court), Title VII (Statute), "Discrimination Found" (Holding).
  - Relations: Smith -- sued --> Jones, Smith v Jones -- decided-in --> Northern District Court, Smith v Jones -- applies --> Title VII, Smith v Jones -- holding --> Discrimination Found.
  Caption: "Each doc runs through an LLM extraction prompt once at index time. Cost ~$0.02 per doc."
  Key content: "extraction" or "extract", "entities" and "relations", "LLM" or "extraction prompt", "Smith" or "Jones" or "Title VII".

- **sub=2 (C.purple) - The graph: 15 nodes, citations as edges**
  Title: "The 15-Node Citation Graph"
  Visual: an SVG graph diagram. 15 nodes labeled with case names (Smith v Jones, Brown v Board, etc.) positioned in a force-layout style. Edges = citations (directed arrows). Show 25-30 edges total. Hover-able would be nice but not required.
  Caption: "Built once offline. Updated incrementally as new cases come in."
  Key content: "15 nodes" or "15 cases", "edges" or "citations", "graph".

- **sub=3 (C.green) - Query time: retrieve a subgraph**
  Title: "Query Time: Retrieve A Subgraph"
  Visual: query "What is the precedent chain for workplace discrimination cases?" Highlight (orange overlay) a 5-node subgraph: Smith v Jones -> cited-by Doe v Acme -> cited-by Roe v Tech Corp; with Brown v Board cited by 3 of these. Show only this subgraph as the retrieved context.
  Caption: "Entity-aware retrieval. The graph topology IS the signal."
  Key content: "subgraph" or "5 nodes", "precedent" or "discrimination", "highlight" or "retrieved".

- **sub=4 (C.orange) - Community detection + summarization**
  Title: "Communities: Cluster The Graph For Global Queries"
  Visual: same 15-node graph from sub=2, now colored into 3 detected communities (e.g., Civil Rights cluster, Contract Law cluster, IP Law cluster). Below: each community has an LLM-generated 2-sentence summary, generated offline.
  - Community A (Civil Rights, 6 nodes): "Cases established protected-class precedents..."
  - Community B (Contract Law, 5 nodes): "Cases interpreted breach-of-contract remedies..."
  - Community C (IP Law, 4 nodes): "Cases shaped fair-use boundaries..."
  Key content: "communities" or "community", "summarization" or "summary", "detection" or "cluster" or "3 communities".

- **sub=5 (C.pink) - Global vs local queries**
  Title: "Global Queries Use Communities, Local Queries Use Subgraphs"
  Visual: 2 query examples side-by-side.
  - Local query ("How did the court rule in Smith v Jones?"): retrieve the Smith v Jones node + 1-hop neighbors -> 5 nodes -> direct answer.
  - Global query ("What are the main themes across this corpus?"): retrieve all 3 community summaries -> map-reduce summarize -> high-level answer.
  Caption: "Global queries are GraphRAG's killer feature. Naive RAG cannot answer them without retrieving everything."
  Key content: "global" or "themes", "local" or "subgraph", "map-reduce" or "summarize" or "summary".

- **sub=6 (C.red) - When GraphRAG is worth the cost**
  Title: "When To Reach For GraphRAG"
  Visual: a 2x2 grid.
  - "Worth It": "Rich entity-relationship corpus (legal, biomedical, code)", "Global queries common", "Long-term value (build the graph once, query many times)".
  - "Not Worth It": "Mostly self-contained docs (FAQ, support KB - like our primary corpus)", "Only local/factoid queries", "Schema churn (entities change weekly)".
  - "Cost": "Per-doc LLM extraction at index time (~$0.02/doc)", "Re-extract on doc changes", "Graph storage + community detection compute".
  - "Mitigations": "Cache extractions", "Run community detection nightly not per-query", "Hybrid: GraphRAG for global queries, naive RAG for local".
  Key content: "worth it" or "not worth it", "rich" or "entity" or "biomedical" or "legal", "FAQ" or "self-contained", "cost" or "$0.02".

- [ ] **Step 1: Write content tests for 12.25**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("GraphRAG (12.25) content", () => {
    const fn = RagGeneration.GraphRAG;

    it("sub=0 explains the switch to the legal-citation secondary corpus", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/legal|citation network/i);
      expect(container.textContent).toMatch(/15|fifteen/i);
      expect(container.textContent).toMatch(/secondary corpus|different corpus|support corpus/i);
    });

    it("sub=1 shows entity + relation extraction on a sample case", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/extract|extraction/i);
      expect(container.textContent).toMatch(/entities|relations/i);
      expect(container.textContent).toMatch(/Smith|Jones|Title VII/);
    });

    it("sub=2 shows the 15-node citation graph", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/15|fifteen/i);
      expect(container.textContent).toMatch(/graph/i);
      expect(container.textContent).toMatch(/citation|edge/i);
    });

    it("sub=3 retrieves a subgraph for the precedent chain query", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/subgraph|sub-graph/i);
      expect(container.textContent).toMatch(/precedent|discrimination/i);
    });

    it("sub=4 explains community detection and per-community summarization", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/communit|cluster/i);
      expect(container.textContent).toMatch(/summar/i);
    });

    it("sub=5 contrasts global vs local queries", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/global/i);
      expect(container.textContent).toMatch(/local|subgraph/i);
      expect(container.textContent).toMatch(/themes|map-?reduce|summar/i);
    });

    it("sub=6 lists when GraphRAG is worth the cost", () => {
      const { container } = render(fn(makeCtx({ sub: 6 })));
      expect(container.textContent).toMatch(/worth it|not worth it/i);
      expect(container.textContent).toMatch(/legal|biomedical|entity/i);
      expect(container.textContent).toMatch(/cost|extraction/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "GraphRAG"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full GraphRAG chapter**

  Replace the stub. Required:

  - 7 sub-steps (sub >= 0 through sub >= 6).
  - Colors per sub-step (blue, cyan, purple, green, orange, pink, red).
  - The chapter intro (sub=0) MUST explicitly explain the corpus switch. Use phrasing like "This chapter switches to a 15-node legal-citation network because the customer-support corpus lacks rich entity-relationship structure."
  - The 15-node graph in sub=2 MUST be an SVG with proper viewBox centering and a `<desc>` first child. Use a hand-laid-out positioning (not random) so nodes don't overlap. Use about 800x500 viewBox, 15 nodes spaced symmetrically.
  - The subgraph highlight in sub=3 reuses the same SVG structure with the 5-node subset highlighted in orange overlay (e.g., orange stroke or background tint on those 5 node circles).
  - The community-colored graph in sub=4 reuses the layout, colors 6 / 5 / 4 nodes in 3 distinct colors.
  - The 2x2 grid in sub=6 uses `gridTemplateColumns: 1fr 1fr`, no overlap.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "GraphRAG"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.25"`:

  ```json
  "12.25": [
    "Fifteen-node legal citation graph used as the GraphRAG running corpus, with cases as nodes and directed citation edges between them.",
    "Subgraph retrieval highlight on the 15-node citation graph showing how a query selects a 5-node connected component (a precedent chain) as the retrieved context.",
    "Same 15-node citation graph re-colored into three communities (Civil Rights, Contract Law, IP Law) for global-query summarization."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.25"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.25**

  Navigate to 12.25. Step sub=0 to sub=6. Check: corpus-switch explanation visible in sub=0; 15-node graph SVG has no overlapping nodes or labels; subgraph highlight in sub=3 visually distinct; community coloring in sub=4 clearly partitions the 15 nodes into 3 groups; global vs local examples in sub=5 side-by-side with no overlap.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.25 GraphRAG (Microsoft 2024)"
  ```

---

## Task 13: Implement Chapter 12.26 AgenticRAG

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `AgenticRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.26"`)

**Chapter purpose (from spec):** Tool-augmented and agentic RAG. Retrieval is one tool the LLM can call - alongside SQL, calculators, web search, internal APIs. Function-calling pattern. Loop control with max-iterations and termination criteria. Brief mention of LangGraph as one orchestration option (no implementation). Walk away knowing the tool-call loop, the multi-tool decision pattern, and the cost/divergence risks.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.blue) - Retrieval as just one tool**
  Title: "Retrieval Is One Tool. Add More."
  Visual: a 4-card row of tools the LLM can call:
  - "Vector Search" (icon: magnifying glass) - the RAG we've been building.
  - "SQL Query" (icon: database) - structured data lookups (pricing table, user accounts).
  - "Calculator" (icon: plus) - precise arithmetic.
  - "Web Search" (icon: globe) - fresh / out-of-corpus info.
  Caption: "The LLM decides which tool to call. Function-calling pattern. Each tool returns text the model can read."
  Key content: "tool" or "tools", "vector search" or "vector-search", "SQL", "calculator", "web search".

- **sub=1 (C.cyan) - The function-calling pattern**
  Title: "Function-Calling: How The Model Picks A Tool"
  Visual: a styled monospace text artifact (NOT code) showing a tool-call trace:
  ```
  User: Compare the Pro and Enterprise plans.

  Model: I need the pricing table. Calling tool.
    tool_call: sql_query(table="plans", filter="name in ('Pro','Enterprise')")
    tool_response: [{"plan":"Pro","price":29,"users":10}, {"plan":"Enterprise","price":199,"users":"unlimited"}]

  Model: I also need feature comparison docs. Calling tool.
    tool_call: vector_search(query="Pro vs Enterprise features", k=3)
    tool_response: [doc-15 chunk 1, doc-15 chunk 2, doc-19 chunk 1]

  Model: Now I can answer. Generating response with citations.
  ```
  Caption: "Model emits tool_call tokens. Runtime intercepts, executes the tool, feeds the response back. Loop continues until model emits 'final answer' or hits max_iterations."
  Key content: "function-calling" or "function call" or "tool_call", "tool_response", "sql_query" or "vector_search", at least one of the 5 standard queries (Compare the Pro and Enterprise plans).

- **sub=2 (C.purple) - The loop diagram**
  Title: "The Tool-Call Loop"
  Visual: an SVG flowchart.
  - User query -> Model -> "Need a tool?" diamond.
  - YES branch -> "Pick tool + emit tool_call" -> "Runtime executes tool" -> "Feed tool_response back to model" -> loop back to "Need a tool?"
  - NO branch -> "Generate final answer" -> End.
  - Side annotation: "max_iterations = 10" cap.
  Key content: "loop", "tool_call" or "tool call", "max_iterations" or "max iterations", "final answer".

- **sub=3 (C.green) - Multi-tool decision example**
  Title: "Worked Example: Multi-Tool Trace"
  Visual: vertical trace showing 4 turns for query "Compare Pro and Enterprise plans, then estimate cost for 25 users on Pro":
  - Turn 1: vector_search("Pro Enterprise comparison") -> 3 chunks.
  - Turn 2: sql_query(SELECT price FROM plans WHERE name='Pro') -> $29 per seat.
  - Turn 3: calculator(25 * 29) -> 725.
  - Turn 4: final answer combining all 3 tool outputs with citations.
  Each turn shown as a colored block (cyan / purple / green / pink).
  Key content: "Compare", "Pro" and "Enterprise", "25 users" or "725" or "calculator", at least 2 different tool names.

- **sub=4 (C.orange) - Loop control: termination and limits**
  Title: "Loop Control: Termination Criteria"
  Visual: a 2x2 grid.
  - "Hard Caps": "max_iterations (typically 5-10)", "Total tool calls per query (rate-limit by tool)", "Wall-clock budget (timeout in seconds)".
  - "Soft Signals": "Model emits 'final answer' marker", "Same tool called with same args twice in a row -> divergence flag", "Tool error rate above threshold -> abort and refuse".
  - "Cost Tracking": "Each tool call has a fixed cost. Sum across iterations. Alert if over budget.".
  - "Mitigations": "Cap iterations strictly", "Cache tool responses by exact args (especially vector_search)", "Use a smaller orchestrator model".
  Key content: "max_iterations" or "termination", "final answer" or "final-answer", "cost" or "budget", "cache" or "cap".

- **sub=5 (C.pink) - Orchestration: LangGraph and the brief mention**
  Title: "Orchestration: Frameworks Like LangGraph"
  Visual: a 2-column summary.
  - Left ("DIY"): A custom while-loop in your own code. You implement the function-calling parse, tool dispatch, max_iterations check, response merge. Full control. More code.
  - Right ("LangGraph and similar"): A graph-shaped state machine for tool flows. Nodes are tool calls, edges are transitions. Built-in checkpointing, retries, human-in-the-loop. Less code. Framework lock-in.
  Caption: "Pick orchestration last. The patterns above work without any framework. Frameworks are a productivity choice, not a correctness one. Act 8 covers framework choice in depth."
  Key content: "LangGraph" or "orchestration", "DIY" or "while loop" or "custom", "framework", "Act 8".

- [ ] **Step 1: Write content tests for 12.26**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("AgenticRAG (12.26) content", () => {
    const fn = RagGeneration.AgenticRAG;

    it("sub=0 lists multiple tools beyond vector search", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/vector search/i);
      expect(container.textContent).toMatch(/SQL/);
      expect(container.textContent).toMatch(/calculator/i);
      expect(container.textContent).toMatch(/web search/i);
    });

    it("sub=1 shows the function-calling pattern with tool_call trace", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/function-?calling|tool_call/i);
      expect(container.textContent).toMatch(/tool_response/i);
      expect(container.textContent).toMatch(/sql_query|vector_search/i);
      expect(container.textContent).toMatch(/Compare.*Pro.*Enterprise/i);
    });

    it("sub=2 shows the tool-call loop with max_iterations", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/loop/i);
      expect(container.textContent).toMatch(/max_?iterations/i);
      expect(container.textContent).toMatch(/final answer/i);
    });

    it("sub=3 shows a multi-tool worked example for Pro vs Enterprise + 25 users", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/Compare|Pro|Enterprise/);
      expect(container.textContent).toMatch(/25 users|725|calculator/i);
    });

    it("sub=4 covers termination criteria including hard caps and cost", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/max_?iterations|termination|cap/i);
      expect(container.textContent).toMatch(/cost|budget/i);
    });

    it("sub=5 mentions LangGraph as one orchestration option and Act 8", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/LangGraph|orchestration/i);
      expect(container.textContent).toMatch(/framework/i);
      expect(container.textContent).toMatch(/Act 8/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "AgenticRAG"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full AgenticRAG chapter**

  Replace the stub. Required:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step (blue, cyan, purple, green, orange, pink).
  - The 4-tool card row in sub=0 must use grid layout, no overlap, each card centered.
  - The function-calling trace in sub=1 is a styled monospace text artifact (NOT code). Pattern: tinted background `${C.cyan}06`, monospace font, `tool_call:` / `tool_response:` lines.
  - The loop diagram in sub=2 MUST be an SVG with `<desc>` first child.
  - The multi-tool trace in sub=3 shows 4 distinct turn-blocks vertically.
  - The 2x2 grid in sub=4 and 2-column in sub=5 must not overlap.
  - The Act 8 reference in sub=5 is a within-section signpost, not a forward "Next" hint.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "AgenticRAG"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.26"`:

  ```json
  "12.26": [
    "Tool-call loop flowchart for agentic RAG: model emits a tool_call, the runtime executes the tool and feeds the response back, looping until the model emits a final answer or hits max_iterations."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.26"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.26**

  Navigate to 12.26. Step sub=0 to sub=5. Check: 4-tool card row evenly spaced no overlap; function-calling trace in sub=1 is monospace styled (NOT code block); tool-call loop SVG centered; multi-tool trace in sub=3 has 4 clearly separated turn-blocks.

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.26 Tool-Augmented and Agentic RAG"
  ```

---

## Task 14: Implement Chapter 12.27 LongContextVsRAG

**Files:**

- Modify: `src/sections/rag-generation.jsx` (replace stub `LongContextVsRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entry)
- Modify: `src/__tests__/svg-descriptions.test.js` (add `"12.27"`)

**Chapter purpose (from spec):** When to use long-context-only, when to use RAG, when to use both. Cost x latency x accuracy chart. The "stuff everything in 200k context" failure modes (lost-in-middle, cost, latency, no citation). Hybrid pattern: retrieve broadly, then stuff 50k tokens. Uses the SECONDARY CORPUS: single 200-page product manual. Mention in chapter intro that the support corpus has too many distinct docs - the long-context demo needs a single long document.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.blue) - Why this chapter uses a different corpus**
  Title: "This Chapter Uses A 200-Page Product Manual"
  Visual: comparison.
  - Left ("Customer Support Corpus - 30 Small Docs"): 30 docs at 500-2000 tokens each. Total maybe 50k tokens. Already fits in modern context windows BUT distributed across 30 distinct docs - retrieval is the natural pattern.
  - Right ("200-Page Product Manual - 1 Large Doc"): A single 200-page reference, ~120k tokens. Fits in 200k context window. The "do I even need RAG?" test case.
  Caption: "When the entire knowledge base is one long document and fits in the context window, the retrieval question changes."
  Key content: "200-page" or "200 page" or "long document", "context window" or "fits", "secondary corpus" or "different corpus".

- **sub=1 (C.red) - Long-context-only: stuff everything**
  Title: "Long-Context Only: Stuff Everything In"
  Visual: a flow diagram.
  - User query -> Pack ALL 120k tokens of the manual into the prompt -> LLM reads -> answer.
  - Annotate cost: at $3 per 1M input tokens, this is $0.36 per query.
  - Annotate latency: 120k tokens to read in -> 5-8 seconds first-token latency.
  Caption: "Simple. Expensive. Slow. And subject to lost-in-the-middle (12.20) for facts buried in the middle pages."
  Key content: "stuff" or "everything", "120k" or "200k" or "long-context", "lost in the middle" or "12.20", "cost" or "$0.36", "latency" or "5" or "8".

- **sub=2 (C.green) - RAG-only: chunk + retrieve + small prompt**
  Title: "RAG Only: Chunk, Retrieve, Pack Small"
  Visual: same query but RAG path.
  - Chunk the 200-page manual into 240 chunks of 512 tokens.
  - At query time: embed query, retrieve top-5 chunks (2,560 tokens).
  - Pack just those 5 chunks + query into prompt.
  - Cost: ~$0.008 per query (~45x cheaper than long-context-only).
  - Latency: 50ms retrieval + 1-2s generation = ~1.5s.
  - Risk: if the relevant chunk isn't in top-5, you get the wrong answer.
  Key content: "RAG only" or "retrieve", "chunks" or "top-5" or "5 chunks", "cheaper" or "$0.008", "latency" or "1.5", "missed" or "wrong" or "risk".

- **sub=3 (C.purple) - Hybrid: retrieve broadly, stuff 50k tokens**
  Title: "Hybrid: Retrieve Top-30, Pack 50k Tokens"
  Visual: a third flow.
  - Retrieve top-30 chunks (15,000 tokens).
  - Optional rerank to top-50 if more depth needed (25,000 tokens).
  - Pack into 50k context window slot.
  - Reorder using lost-in-middle strategy (front-load or sandwich, from 12.20).
  - Cost: ~$0.15 per query (5x cheaper than long-context-only, 18x more than RAG-only).
  - Latency: 80ms retrieval + 3s generation = ~3s.
  - Accuracy: highest, because more candidate chunks = lower miss rate.
  Caption: "The pragmatic middle. Most production systems land here."
  Key content: "hybrid", "top-30" or "broadly", "50k" or "rerank", "front-load" or "sandwich" or "12.20", "production".

- **sub=4 (C.orange) - The cost / latency / accuracy chart**
  Title: "Cost, Latency, Accuracy: Side By Side"
  Visual: an SVG bar chart with 3 grouped bars per metric.
  - Cost (per query): RAG-only ~$0.008 (short green bar), Hybrid ~$0.15 (medium yellow), Long-Context-Only ~$0.36 (tall red).
  - Latency (p50): RAG-only ~1.5s (short green), Hybrid ~3s (medium yellow), Long-Context-Only ~6s (tall red).
  - Accuracy (golden-dataset recall, illustrative): RAG-only 78% (medium green), Hybrid 92% (tall green), Long-Context-Only 84% (medium yellow - lost-in-middle hurts).
  Annotate each bar with its value.
  Key content: "cost" and "latency" and "accuracy", at least 2 of "RAG-only" / "Hybrid" / "Long-Context-Only", numeric values.

- **sub=5 (C.cyan) - The decision: when each one wins**
  Title: "Decision: When Each One Wins"
  Visual: a 3-card layout.
  - "RAG Only" (green): "Cost-critical at scale (~$0.008/query)", "Latency-critical (~1.5s p50)", "Large multi-doc corpus", "Citations required (chunk-level provenance)".
  - "Hybrid" (yellow): "Default for production", "Best accuracy on accuracy-critical workloads", "Acceptable cost + latency tradeoff", "Citations still feasible".
  - "Long-Context Only" (red): "Single long document corpus", "Low query volume (cost not pressing)", "Citations not required (or citations can be post-extracted from the answer)", "No retrieval infrastructure available".
  Caption: "Hybrid is the production default. Long-context-only is a niche. RAG-only is for high-volume cost-sensitive systems."
  Key content: "decision" or "wins" or "when", at least 2 of "RAG only" / "Hybrid" / "Long-Context", "citation" or "cost" or "latency", "production default" or "default" or "niche".

- [ ] **Step 1: Write content tests for 12.27**

  Append to `src/__tests__/sections.test.jsx`:

  ```js
  describe("LongContextVsRAG (12.27) content", () => {
    const fn = RagGeneration.LongContextVsRAG;

    it("sub=0 explains switch to the 200-page product manual corpus", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/200-?page|200 pages?/i);
      expect(container.textContent).toMatch(/context window|fits/i);
      expect(container.textContent).toMatch(/secondary corpus|different corpus|product manual/i);
    });

    it("sub=1 shows the stuff-everything long-context approach with cost and latency", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/stuff|everything/i);
      expect(container.textContent).toMatch(/120k|200k|long-?context/i);
      expect(container.textContent).toMatch(/lost in the middle|12\.20/i);
      expect(container.textContent).toMatch(/cost|\$0\.36|latency/i);
    });

    it("sub=2 shows the RAG-only approach as cheaper alternative", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/RAG.?only|retrieve/i);
      expect(container.textContent).toMatch(/chunk|top-?5/i);
      expect(container.textContent).toMatch(/cheaper|\$0\.008|latency/i);
    });

    it("sub=3 shows the hybrid retrieve-broadly approach", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/hybrid/i);
      expect(container.textContent).toMatch(/top-?30|broadly|50k/i);
      expect(container.textContent).toMatch(/front-?load|sandwich|12\.20/i);
    });

    it("sub=4 shows the cost / latency / accuracy comparison chart", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/cost/i);
      expect(container.textContent).toMatch(/latency/i);
      expect(container.textContent).toMatch(/accuracy/i);
      expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
    });

    it("sub=5 shows the decision matrix with hybrid as production default", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/decision|when/i);
      expect(container.textContent).toMatch(/production default|default|niche/i);
      expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to verify failures**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LongContextVsRAG"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the full LongContextVsRAG chapter**

  Replace the stub. Required:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step (blue, red, green, purple, orange, cyan).
  - The chapter intro (sub=0) MUST explicitly explain the corpus switch to the 200-page product manual. Same pattern as 12.25.
  - The cost / latency / accuracy chart in sub=4 MUST be an SVG bar chart with proper viewBox centering and `<desc>`. 3 metric groups (cost, latency, accuracy), each with 3 bars (RAG-only / Hybrid / Long-Context-Only). Each bar annotated with its value.
  - References to 12.20 (lost-in-middle, front-load, sandwich) are within-section back-references.
  - 3-card decision layout in sub=5 evenly spaced, each card centered, color-coded.

- [ ] **Step 4: Run tests to verify pass**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LongContextVsRAG"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description**

  In `src/data/svg-descriptions.json`, add `"12.27"`:

  ```json
  "12.27": [
    "Grouped bar chart comparing cost, latency, and accuracy across three strategies for the 200-page product manual: RAG-only, hybrid retrieve-broadly, and long-context-only stuffing of the full document."
  ]
  ```

  Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` to include `"12.27"`.

- [ ] **Step 6: Run svg-descriptions test**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Run full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green.

- [ ] **Step 8: Chrome visual validation for 12.27**

  Navigate to 12.27. Step sub=0 to sub=5. Check: corpus-switch explanation visible in sub=0; flow diagrams in sub=1/2/3 evenly proportioned; cost/latency/accuracy chart in sub=4 readable with all 9 bars labeled; 3-card decision layout in sub=5 visually distinct (color-coded green/yellow/red).

  Stop server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-generation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.27 Long-Context vs RAG"
  ```

---

## Task 15: Update CLAUDE.md mapping for Section 12 Acts 5 + 6

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Extend the Section 12 mapping table**

  In `CLAUDE.md`, find the existing Section 12 mapping table (added/extended in M1+M2+M3). It currently covers 12.1-12.18. Extend it to cover 12.19-12.27. The header line above the table also needs updating to mention the new `rag-generation.jsx` file:

  Replace the existing header line for Section 12 with:

  ```markdown
  **Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` + `rag-retrieval.jsx` + `rag-generation.jsx` - Milestones 1-4 of 6 complete; Acts 1-6 implemented, Acts 7-9 pending in Milestones 5-6)
  ```

  Append the following rows to the existing table (after 12.18):

  ```markdown
  | 12.19 | ContextPacking | Context Packing |
  | 12.20 | LostInTheMiddle | The Lost-in-the-Middle Problem |
  | 12.21 | CitationsRefusal | Citations, Refusal & Groundedness |
  | 12.22 | MultiHopRetrieval | Multi-Hop Retrieval |
  | 12.23 | SelfRAG | Self-RAG |
  | 12.24 | CorrectiveRAG | CRAG - Corrective RAG |
  | 12.25 | GraphRAG | GraphRAG (Microsoft 2024) |
  | 12.26 | AgenticRAG | Tool-Augmented & Agentic RAG |
  | 12.27 | LongContextVsRAG | Long-Context vs RAG |
  ```

- [ ] **Step 2: Update the Project Structure tree**

  Find the `## Project Structure` section. In the `src/sections/` block, add `rag-generation.jsx` after `rag-retrieval.jsx`. The relevant tree lines after this change should look like:

  ```
  │       ├── rag-foundations.jsx          # Section 12 (Acts 1+2, chapters 12.1-12.10)
  │       ├── rag-retrieval.jsx            # Section 12 (Acts 3+4, chapters 12.11-12.18)
  │       └── rag-generation.jsx           # Section 12 (Acts 5+6, chapters 12.19-12.27)
  ```

  (Adjust the `└──` / `├──` glyphs so the LAST section file in the tree uses `└──` and the rest use `├──`. If a future M5 adds `rag-evaluation.jsx`, the `└──` will shift again at that time.)

- [ ] **Step 3: No test required for CLAUDE.md (documentation only)**

  CLAUDE.md is not test-checked. Skip the test step.

- [ ] **Step 4: Commit**

  ```bash
  git add CLAUDE.md
  git commit -m "Document Section 12 Acts 5+6 (12.19-12.27) in CLAUDE.md mapping"
  ```

---

## Task 16: Final M4 verification

**Files:** none (verification only); may require Bash returns to fix issues found.

This is the final acceptance gate for M4. Every check must pass before declaring M4 complete.

- [ ] **Step 1: Full test suite**

  ```bash
  npm run test
  ```

  Expected: all tests pass. No regressions in any prior section.

- [ ] **Step 2: Coverage check**

  ```bash
  npx vitest run --coverage
  ```

  Expected: lines 100%, branches >= 97.7% (per CLAUDE.md target). If branches dropped, identify uncovered branches in new code:

  - Most likely cause: a `{sub >= N && ...}` block that the generic test never reaches. The generic test runs `s = 0..10` so chapters with at most 7 sub-steps are covered. If a chapter exposes an additional interaction not triggered by the cursor-pointer-click sweep, add a specific test that exercises it.
  - Either add tests or document the unreachable defensive branches.

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

  Expected: build succeeds. No errors in vendor chunking or asset processing. The new `rag-generation.jsx` should appear as a separate chunk in the Vite output (alongside `rag-foundations.jsx` and `rag-retrieval.jsx`).

- [ ] **Step 6: Final Chrome visual sweep across all 9 M4 chapters**

  Boot `npm run dev`. Open `http://localhost:5173/learn-ai/` in Chrome via MCP. Before using any `mcp__claude-in-chrome__*` tool, load it with ToolSearch (e.g., `select:mcp__claude-in-chrome__tabs_context_mcp`).

  For each chapter 12.19 through 12.27, step through every sub-step and verify the 12-point visual checklist:

  1. Zero overlap.
  2. Edges/nodes/boxes consistently aligned.
  3. Title-case in all diagram boxes.
  4. First letter of every line capitalized.
  5. Titles center-aligned.
  6. Standalone formulas centered.
  7. All Box colors are real (no C.card).
  8. SVGs have `<desc>` (verify via DOM inspection - `<desc>` is the first child of every `<svg>`).
  9. No "architect" word.
  10. No em-dashes.
  11. No "Next chapter:" / "Coming up:" hints (within-section "Act N" signposts ARE allowed).
  12. Density: each chapter has at least 2-3 diagrams; not text-dominated.

  Special checks per chapter:

  - **12.21**: every prompt-template block is monospace-styled, visually distinct from a code block, with "Prompt Template" title.
  - **12.25**: chapter intro explicitly explains the corpus switch to the 15-node legal-citation network.
  - **12.27**: chapter intro explicitly explains the corpus switch to the 200-page product manual.
  - **12.22 / 12.23 / 12.24 / 12.25 / 12.26 / 12.27**: each SVG flowchart/timeline/graph/chart is horizontally centered in its viewBox.

  Fix any issues in source. Re-run `npm run test`. Re-validate.

- [ ] **Step 7: Save screenshots (optional but recommended)**

  ```bash
  mkdir -p docs/superpowers/screenshots/section-12-m4
  # Save chrome screenshots into this directory
  ```

  Then commit:

  ```bash
  git add docs/superpowers/screenshots/section-12-m4/
  git commit -m "Add Section 12 M4 visual validation screenshots"
  ```

- [ ] **Step 8: Verify TOC shows all 27 Section 12 chapters**

  Boot dev server. Open the TOC. Confirm Section 12 lists 27 chapters (12.1-12.27), section color is the deep indigo from M1, every chapter is navigable, every chapter renders without console errors. Stop server.

- [ ] **Step 9: Milestone marker commit (if any drift remains)**

  If everything is already committed from earlier tasks, no marker commit is needed. If any small drift exists (formatting, etc.):

  ```bash
  git status
  git add -p  # carefully review what to stage
  git commit -m "Section 12 Milestone 4 complete: Acts 5+6 (12.19-12.27) shipped"
  ```

- [ ] **Step 10: Confirm M4 done**

  Verify via `git log --oneline -30` that the M4 commit history is clean. Confirm all M4 success criteria are met:

  - [x] 9 chapters implemented in `rag-generation.jsx` (12.19-12.27).
  - [x] Section 12 loader in `learn-ai.jsx` now references all 3 RAG section files.
  - [x] `rag-generation.jsx` registered in `sections.test.jsx` and `lookup.test.js`.
  - [x] Tests added for every chapter at every sub-level.
  - [x] Coverage 100% lines, branches >= 97.7%.
  - [x] Lint + format clean.
  - [x] Every new SVG has `<desc>` + `svg-descriptions.json` entry.
  - [x] CLAUDE.md mapping + project tree updated (`rag-generation.jsx` listed, all 27 Section 12 chapters in the table).
  - [x] Chrome browser visual validation passed for all 9 M4 chapters.
  - [x] All prompt-template artifacts (notably in 12.19, 12.21, 12.22, 12.23, 12.26) rendered as styled monospace text, NOT code blocks.
  - [x] Corpus-switch explanations in 12.25 (legal-citation network) and 12.27 (200-page product manual) visible to the user.

  M4 complete. Section 12 now spans 27 of 38 chapters. Ready to write Milestone 5 plan (Act 7 - the 5 evaluation chapters).

---

## Task 17: Plan Refinement Checkpoint for M5

**Files:**
- Create: `docs/superpowers/lessons/section-12-m4-lessons.md` (new lessons file)
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-12-milestone-5.md`

Per the section's "lessons-feed-forward" rule, before executing M5, do a quick refinement pass on the M5 plan using what M4 taught us. The plans are editable artifacts, not contracts - this checkpoint is where M4's real-world experience gets folded into M5's plan.

- [ ] **Step 1: Lessons capture from M4 (5-10 minutes, write it down)**

Create `docs/superpowers/lessons/section-12-m4-lessons.md` with 3-5 honest bullet observations from executing M4:

- Which visual patterns rendered cleanly in Chrome and which needed iteration?
- Which test regexes were too brittle (false fail) or too loose (let bugs through)?
- Which sub-step structures landed clean and which needed re-org during implementation?
- Anything in the per-chapter task pattern that felt awkward or could be tightened?
- Anything in the visual rules that proved especially load-bearing or surprisingly easy to violate?
- Any pattern (color choice, diagram structure, prompt-template treatment, etc.) that worked better than what the plan specified?

The lessons are only useful if they're real. Skip a bullet if it doesn't apply. Add bullets the prompts don't cover if something else stood out.

- [ ] **Step 2: Read M5 plan with M4 lessons in mind**

Open `docs/superpowers/plans/2026-05-16-section-12-milestone-5.md`. Scan for places where the M4 lessons would apply:

- If M4 showed a visual pattern works better than what M5 specifies, update the relevant sub-step descriptions in M5.
- If M4 showed a test regex pattern catches more bugs, update M5's test patterns.
- If M4 showed a task structure was awkward, simplify the equivalent structure in M5.
- If M4 introduced a useful helper / convention / utility not anticipated in M5, thread it into the M5 plan.

- [ ] **Step 3: Edit M5 plan if needed**

If lessons translate to plan edits, make them inline in `docs/superpowers/plans/2026-05-16-section-12-milestone-5.md`. Keep edits scoped: only change what M4 directly informs. Do NOT rewrite M5 wholesale.

If no edits are warranted, skip and proceed to commit.

- [ ] **Step 4: Commit the lessons file + any plan edits**

```bash
git add docs/superpowers/lessons/section-12-m4-lessons.md docs/superpowers/plans/2026-05-16-section-12-milestone-5.md
git commit -m "Capture M4 lessons and refine M5 plan"
```

If only the lessons file changed and no M5 plan edits were made:

```bash
git add docs/superpowers/lessons/section-12-m4-lessons.md
git commit -m "Capture M4 lessons; no M5 plan edits needed"
```

- [ ] **Step 5: M4 complete. Ready to start M5.**

---

## What Comes Next

After this milestone, the remaining Section 12 milestones:

| Milestone | Acts | Chapters | File | When planned |
|---|---|---|---|---|
| M5 | Act 7 (Evaluation) | 12.28-12.32 (5 ch) | New: `rag-evaluation.jsx` | After M4 ships |
| M6 | Acts 8 + 9 (Production Ops + Capstone) | 12.33-12.38 (6 ch) | New: `rag-production.jsx` | After M5 ships |

After M6 (when Section 12 is fully complete with all 38 chapters):

- Final discoverability sync: update `public/llms.txt` topic descriptions, `index.html` JSON-LD `teaches` array if any new top-level topic emerged.
- Apply the title-case-for-diagram-boxes rule from the spec's "CLAUDE.md update flagged" item to CLAUDE.md (carve out diagram-box-text as a special-case stricter rule, or roll it global).
- Add a final Section 12 splash/intro card in the TOC matching Section 11's style.
- Final Chrome visual sweep across all 38 Section 12 chapters.
