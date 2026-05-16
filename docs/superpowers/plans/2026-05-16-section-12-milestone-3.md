# Section 12 Milestone 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Acts 3 + 4 of Section 12 "Retrieval-Augmented Generation" - the eight chapters covering Embed & Index Choices for RAG (12.11 EmbeddingModelChoice, 12.12 DomainAdaptation, 12.13 HybridForRAG, 12.14 RerankerCascade) plus Query Transformation (12.15 WhyTransformQueries, 12.16 HyDE, 12.17 MultiQueryExpansion, 12.18 QueryRoutingDecomposition). These chapters live in a NEW file `src/sections/rag-retrieval.jsx` (Acts 1+2 already shipped in `rag-foundations.jsx` via Milestones 1 and 2). At end of this milestone the app ships with 18 navigable chapters in Section 12 (12.1 through 12.18).

**Architecture:** Create a new section file `src/sections/rag-retrieval.jsx` and update the Section 12 loader in `learn-ai.jsx` to load BOTH `rag-foundations.jsx` (12.1-12.10) AND `rag-retrieval.jsx` (12.11-12.18) via `Promise.all` + `Object.assign` (same multi-file loader pattern used for Section 3 scaling+llm-training, Section 8 road-to-transformers+transformer-block, Section 10 attention-computation+modern-llm-techniques, Section 11 vector-*.jsx fan-out). Each chapter follows the established learn-ai pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete Habuild-Cloud-corpus examples.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md` - chapters 12.11 through 12.18, Acts 3 + 4.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-05-16-section-12-milestone-1.md` - full detail template for per-chapter tasks plus the scaffolding pattern for the original `rag-foundations.jsx`.
- `docs/superpowers/plans/2026-04-22-section-11-milestone-3.md` - the closest precedent for "new section file, same section number, multi-file loader, eight-ish chapters" pattern.

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- Milestone 1 (Act 1: 12.1-12.3) is complete and merged on `main`. `rag-foundations.jsx` exists with at least `WhyLLMsNeedRetrieval`, `NaiveRAGPipeline`, `WhereNaiveRAGBreaks`.
- Milestone 2 (Act 2: 12.4-12.10) is complete and merged on `main`. `rag-foundations.jsx` now exports all 10 chapter components (12.1-12.10), and the M2 chunking content is shipped.
- `src/config.js` already contains 12.1-12.10 in `chapters[]`, Section 12 in `sectionNames`, and `12: "#7c4dff"` in `sectionColors`.
- `src/learn-ai.jsx` `sectionLoaders` already has a key `12: () => import("./sections/rag-foundations.jsx"),`.
- `src/__tests__/sections.test.jsx` already imports `* as RagFoundations` and spreads it into `lookup`.
- `src/__tests__/lookup.test.js` already imports `RagFoundations` and spreads it into `lookup`.
- CLAUDE.md Section 12 mapping currently shows 12.1-12.10; this milestone extends it to 12.1-12.18.
- All tests currently pass on `main` (verify in Task 1).
- Working directly on `main`.

If any prerequisite is missing, STOP and complete M1/M2 first - this plan assumes both are merged.

---

## File Structure

### New files

- `src/sections/rag-retrieval.jsx` - Acts 3 + 4 chapter functions. In Milestone 3 this file contains 8 exports (EmbeddingModelChoice, DomainAdaptation, HybridForRAG, RerankerCascade, WhyTransformQueries, HyDE, MultiQueryExpansion, QueryRoutingDecomposition). No further chapters are added to this file in later milestones (Acts 5+6 live in `rag-generation.jsx`, Act 7 in `rag-evaluation.jsx`, Acts 8+9 in `rag-production.jsx`).

### Modified files

- `src/config.js` - append 8 entries to `chapters[]` after the last Section 12 entry (`12.10 ChunkingDecision`).
- `src/learn-ai.jsx` - change the Section 12 loader from a single `import("./sections/rag-foundations.jsx")` to a `Promise.all` of both `rag-foundations.jsx` and `rag-retrieval.jsx`, following the Section 3/8/9/10/11 pattern.
- `src/__tests__/sections.test.jsx` - add `import * as RagRetrieval from "../sections/rag-retrieval.jsx";`, spread it into the `lookup`, and append content-test blocks for each of the 8 new chapters.
- `src/__tests__/lookup.test.js` - add the same import + spread, plus a presence test that the 8 new components are exported.
- `src/__tests__/config.test.js` - extend the Section 12 chapters test from 10 entries to 18 entries (or append a new describe block for 12.11-12.18 if M1/M2 used per-act blocks).
- `src/data/svg-descriptions.json` - add entries for new SVGs (estimate 8-15 SVGs across the 8 chapters; not every chapter introduces an SVG).
- `CLAUDE.md` - extend Section 12 mapping table to include rows for 12.11-12.18, update project-structure tree to show `rag-retrieval.jsx` alongside `rag-foundations.jsx`, and update the Section 12 file annotation to reflect Acts 1-4 shipped.

### Unchanged

- `src/sections/rag-foundations.jsx` (do not edit; 12.1-12.10 are stable from M1+M2).
- All section files for Sections 1-11.
- `public/llms.txt` and `index.html` JSON-LD `teaches` (Section 12 was added in M1; no metadata change needed - chapter-list updates happen at end of M6 per the M1 plan's incremental policy).

---

## Standard running-example values (reference during implementation)

Use the same values established in M1/M2 (from the spec). Reuse the Habuild Cloud support corpus and the 5 standard queries throughout these 8 chapters so the learner sees continuity:

**Primary corpus:** 30-doc Habuild Cloud customer support knowledge base:
- 10 account/billing docs (password reset, email change, subscription tiers, refunds, invoice download, MFA setup, account deletion, payment methods, downgrade flow, team-seat management).
- 10 product feature docs (dashboard tour, integrations setup, API keys, webhooks, export formats, custom fields, role permissions, notifications, search filters, bulk operations).
- 10 troubleshooting docs (common errors, slow page load, 500 errors, sync failures, login issues, browser compatibility, data inconsistency, export failures, rate limits, quota exceeded).

**Standard queries (use across Acts 3+4 chapters):**

| Query | Type | Best chapter to feature |
|---|---|---|
| "How do I reset my password?" | Single-doc lookup baseline | 12.13 baseline retrieval |
| "I can't sign in to my account" | Lexical mismatch (sign-in vs log-in) | 12.13 (BM25 picks up "sign in"), 12.15 (lexical mismatch failure example) |
| "How do I reset my password if I forgot my email?" | Multi-hop | 12.18 (decomposition split) |
| "Why is my dashboard slow?" | Long descriptive | 12.16 (HyDE primary example) |
| "Cancel my subscription and get a refund" | Multi-step / sequential | 12.17 (multi-query expansion), 12.18 (decomposition) |
| "Compare the Pro and Enterprise plans" | Aggregation | 12.18 (decomposition splits into "What's in Pro?" + "What's in Enterprise?") |
| "How do I get an API key?" | Exact-term factual | 12.13 (BM25 wins; "API key" is a literal token) |

**Canonical numeric values:**

- Embedding dim: 8 (drawable) / 1024 (production-typical e.g., Cohere v3).
- Chunk size (tokens): 64-128 (visible) / 512 (production typical).
- Retrieval top-k: 3-5 (visible) / 50 (production before rerank).
- Reranked top-k: 2-3 (visible) / 10 (production sent to LLM).
- RRF constant `k = 60` (standard in literature; use in 12.13 and 12.17).
- Reranker latency: ~80ms for cross-encoder on 50 candidates.
- Vector retrieval latency: ~30ms for HNSW on 1M vectors.
- LLM generation latency: ~800ms for 200 tokens out.

The same query gives the same retrieval result across chapters unless the chapter is teaching a deliberate change (e.g., "with hybrid, doc-7 now appears", "after reranker, doc-3 moves to position 1").

---

## Per-act color scheme (from spec)

Use one Box color family per act for visual continuity:

- **Act 3 (12.11-12.14):** purple-leaning color family (`C.purple`, `C.cyan`, `C.pink`, `C.blue`).
- **Act 4 (12.15-12.18):** orange-leaning color family (`C.orange`, `C.yellow`, `C.red`, `C.green`).

Each chapter still uses 5-7 different colors across its sub-steps; the family bias is only "one of the chapter's anchor sub-steps uses the act color".

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome.
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Retrieve Top K Documents" not "retrieve top k documents". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors.
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Forward references to "Act N" within Section 12 are allowed if phrased as "Act N fixes this" (past/present tense, not anticipatory).
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".

---

## Implementation order

1. Task 1 - Verify green baseline (no commit).
2. Task 2 - Create `rag-retrieval.jsx` scaffold with 8 stub exports.
3. Task 3 - Update `learn-ai.jsx` Section 12 loader to Promise.all both files.
4. Task 4 - Add 12.11-12.18 entries to `chapters[]` in `config.js`.
5. Task 5 - Register `RagRetrieval` in `sections.test.jsx` lookup.
6. Task 6 - Implement chapter 12.11 EmbeddingModelChoice.
7. Task 7 - Implement chapter 12.12 DomainAdaptation.
8. Task 8 - Implement chapter 12.13 HybridForRAG.
9. Task 9 - Implement chapter 12.14 RerankerCascade.
10. Task 10 - Implement chapter 12.15 WhyTransformQueries.
11. Task 11 - Implement chapter 12.16 HyDE.
12. Task 12 - Implement chapter 12.17 MultiQueryExpansion.
13. Task 13 - Implement chapter 12.18 QueryRoutingDecomposition.
14. Task 14 - Update CLAUDE.md (mapping table + project structure).
15. Task 15 - Final M3 verification (test, coverage, lint, format, build, Chrome visuals).

Commit cadence: one commit per task, except Task 1 (no commit) and Task 15 (verify-only or single milestone marker if drift exists).

---

## Task 1: Verify green baseline

**Files:** none (git state + run tests)

- [ ] **Step 1: Confirm we're on main with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Confirm M1+M2 are merged**

```bash
git log --oneline -20 | grep -i "rag\|section 12\|12\\."
```

Expected: see commits for Section 12 M1 (3 chapters) AND M2 (7 chunking chapters). If only M1 is visible, STOP and execute M2 first.

```bash
ls src/sections/rag-foundations.jsx
grep -c "^export const" src/sections/rag-foundations.jsx
```

Expected: file exists; export count is 10 (12.1-12.10 implementations).

- [ ] **Step 3: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 4: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: No commit yet** - this task only verifies baseline.

---

## Task 2: Create `src/sections/rag-retrieval.jsx` scaffold with 8 stub exports

**Files:**
- Create: `src/sections/rag-retrieval.jsx`
- Modify: `src/__tests__/lookup.test.js`

- [ ] **Step 1: Write failing test for the new section file**

Append to `src/__tests__/lookup.test.js`, after the existing `vector-foundations.jsx` presence test:

```js
  it("rag-retrieval.jsx exports the Act 3+4 chapter components", async () => {
    const mod = await import("../sections/rag-retrieval.jsx");
    expect(typeof mod.EmbeddingModelChoice).toBe("function");
    expect(typeof mod.DomainAdaptation).toBe("function");
    expect(typeof mod.HybridForRAG).toBe("function");
    expect(typeof mod.RerankerCascade).toBe("function");
    expect(typeof mod.WhyTransformQueries).toBe("function");
    expect(typeof mod.HyDE).toBe("function");
    expect(typeof mod.MultiQueryExpansion).toBe("function");
    expect(typeof mod.QueryRoutingDecomposition).toBe("function");
  });
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: FAIL - `Cannot find module '../sections/rag-retrieval.jsx'`.

- [ ] **Step 3: Create the stub file**

Create `src/sections/rag-retrieval.jsx` with this content (mirrors the M1 Task 3 pattern, but for 8 stubs instead of 3):

```jsx
import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks (Section 12 Milestone 3).
// Act 3 (Embed & Index Choices for RAG): 12.11-12.14
// Act 4 (Query Transformation): 12.15-12.18

export const EmbeddingModelChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Picking An Embedding Model (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const DomainAdaptation = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Domain Adaptation (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HybridForRAG = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hybrid Retrieval For RAG (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const RerankerCascade = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            The Reranker Cascade (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const WhyTransformQueries = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Why Transform Queries (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HyDE = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            HyDE - Hypothetical Document Embeddings (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const MultiQueryExpansion = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Multi-Query Expansion (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const QueryRoutingDecomposition = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Query Routing And Decomposition (Stub)
          </T>
        </Box>
      )}
    </div>
  );
};
```

- [ ] **Step 4: Also add the spread to lookup.test.js so `lookup` resolves the stubs**

Edit `src/__tests__/lookup.test.js`. Add to the import block (after the existing `RagFoundations` import added in M1):

```js
import * as RagRetrieval from "../sections/rag-retrieval.jsx";
```

And spread into the `lookup` object (after `...RagFoundations`):

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
};
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: PASS. The presence test passes (all 8 components are functions); the generic "every chapter component exists" test still passes because the 12.11-12.18 entries are not yet in `chapters[]`.

- [ ] **Step 6: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/lookup.test.js
git commit -m "Scaffold rag-retrieval.jsx with stubs for 12.11-12.18"
```

---

## Task 3: Update `learn-ai.jsx` Section 12 loader to load both rag-foundations + rag-retrieval

**Files:**
- Modify: `src/learn-ai.jsx` (sectionLoaders object, section 12 entry)

The Section 12 loader currently looks like:

```js
12: () => import("./sections/rag-foundations.jsx"),
```

We need to change it to a `Promise.all` so both files load when Section 12 is opened. Mirrors the Section 8/9/10/11 pattern.

- [ ] **Step 1: Make the change in `src/learn-ai.jsx`**

Find the Section 12 entry inside `const sectionLoaders = { ... };` and replace it. Resulting block (only the Section 12 line changes):

```js
const sectionLoaders = {
  // ... entries through section 11 ...
  11: () =>
    Promise.all([
      import("./sections/vector-foundations.jsx"),
      import("./sections/vector-compression.jsx"),
      import("./sections/vector-production.jsx"),
      import("./sections/vector-systems.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
  12: () =>
    Promise.all([
      import("./sections/rag-foundations.jsx"),
      import("./sections/rag-retrieval.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
};
```

- [ ] **Step 2: Run lint to verify**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Run the existing learn-ai tests**

```bash
npx vitest run src/__tests__/learn-ai.test.jsx src/__tests__/learn-ai-prefetch.test.jsx
```

Expected: PASS. The loader change is backwards-compatible - merged module map still resolves the same chapter components.

- [ ] **Step 4: Boot dev server, navigate to Section 12 chapter 12.1, verify no console errors**

```bash
npm run dev
```

Open `http://localhost:5173/learn-ai/`, navigate to any Section 12 chapter (e.g., 12.5), verify it still loads (the multi-file loader should resolve `rag-foundations.jsx` exports correctly). Stop the server (Ctrl-C) after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/learn-ai.jsx
git commit -m "Load rag-retrieval.jsx alongside rag-foundations.jsx for Section 12"
```

---

## Task 4: Add 12.11-12.18 entries to `chapters[]` in `config.js`

**Files:**
- Modify: `src/config.js` (append 8 entries after the existing 12.10 entry)
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write failing test**

Append to `src/__tests__/config.test.js` (or extend the existing Section 12 describe block from M1/M2 if it tests the full chapter list - if so, replace the expected array). The simplest approach is a new dedicated describe for Acts 3+4:

```js
describe("Section 12 Acts 3+4 chapters", () => {
  it("has chapters 12.11 through 12.18 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(18);
    const acts34 = section12.filter((c) => {
      const n = Number(c.id.split(".")[1]);
      return n >= 11 && n <= 18;
    });
    const expected = [
      { id: "12.11", component: "EmbeddingModelChoice", title: "Picking an Embedding Model" },
      { id: "12.12", component: "DomainAdaptation", title: "Domain Adaptation - Fine-Tuning Embeddings" },
      { id: "12.13", component: "HybridForRAG", title: "Hybrid Retrieval for RAG" },
      { id: "12.14", component: "RerankerCascade", title: "The Reranker Cascade" },
      { id: "12.15", component: "WhyTransformQueries", title: "Why Transform Queries" },
      { id: "12.16", component: "HyDE", title: "HyDE - Hypothetical Document Embeddings" },
      { id: "12.17", component: "MultiQueryExpansion", title: "Multi-Query Expansion" },
      { id: "12.18", component: "QueryRoutingDecomposition", title: "Query Routing & Decomposition" },
    ];
    expect(acts34.length).toBe(expected.length);
    expected.forEach((exp, i) => {
      expect(acts34[i].id).toBe(exp.id);
      expect(acts34[i].component).toBe(exp.component);
      expect(acts34[i].title).toBe(exp.title);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js -t "Acts 3"
```

Expected: FAIL - `acts34.length` is 0 (entries not yet added).

- [ ] **Step 3: Add chapter entries to `src/config.js`**

Edit `src/config.js`. Find the last Section 12 entry (the M2 closer `12.10 ChunkingDecision`) and add Section 12 Acts 3+4 entries right after, before the closing `];`:

```js
  { id: "12.10", title: "The Chunking Decision", section: 12, component: "ChunkingDecision" },
  // Section 12 Act 3: Embed & Index Choices for RAG
  { id: "12.11", title: "Picking an Embedding Model", section: 12, component: "EmbeddingModelChoice" },
  { id: "12.12", title: "Domain Adaptation - Fine-Tuning Embeddings", section: 12, component: "DomainAdaptation" },
  { id: "12.13", title: "Hybrid Retrieval for RAG", section: 12, component: "HybridForRAG" },
  { id: "12.14", title: "The Reranker Cascade", section: 12, component: "RerankerCascade" },
  // Section 12 Act 4: Query Transformation
  { id: "12.15", title: "Why Transform Queries", section: 12, component: "WhyTransformQueries" },
  { id: "12.16", title: "HyDE - Hypothetical Document Embeddings", section: 12, component: "HyDE" },
  { id: "12.17", title: "Multi-Query Expansion", section: 12, component: "MultiQueryExpansion" },
  { id: "12.18", title: "Query Routing & Decomposition", section: 12, component: "QueryRoutingDecomposition" },
];
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/config.test.js -t "Acts 3"
```

Expected: PASS.

- [ ] **Step 5: Run the full config + lookup + sections test suite**

```bash
npx vitest run src/__tests__/config.test.js src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
```

Expected: PASS. The lookup test (every chapter component exists) now resolves 12.11-12.18 to the rag-retrieval.jsx stubs. The generic sections test renders each stub at every sub - stubs are minimal-render safe.

- [ ] **Step 6: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 12.11-12.18 to config"
```

---

## Task 5: Register `RagRetrieval` in `sections.test.jsx` lookup

**Files:**
- Modify: `src/__tests__/sections.test.jsx`

The generic test block in sections.test.jsx iterates over `chapters` and looks up each component in `lookup`. Without this import, generic tests for 12.11-12.18 will fail with "fn is not a function" (the lookup test already passed because it imports rag-retrieval directly, but sections.test.jsx has its own lookup).

- [ ] **Step 1: Run sections.test.jsx to confirm failure before change**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: FAIL. The generic "All chapters" describe block will try to call `fn()` for 12.11-12.18 where `fn` is undefined (TypeError: fn is not a function).

- [ ] **Step 2: Add the import and spread**

Edit `src/__tests__/sections.test.jsx`. Find the existing import block at the top (after `import * as RagFoundations from "../sections/rag-foundations.jsx";` which M1 added) and add immediately after:

```js
import * as RagRetrieval from "../sections/rag-retrieval.jsx";
```

Then find the `lookup` object and spread `RagRetrieval` into it as the last entry, after `...RagFoundations`:

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
};
```

- [ ] **Step 3: Run sections.test.jsx to verify it passes**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: PASS. The generic test now runs against 12.11-12.18 stubs which render the title in a Box without crashing.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Register RagRetrieval in sections.test lookup"
```

---

## Task 6: Implement Chapter 12.11 EmbeddingModelChoice

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `EmbeddingModelChoice`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Picking an embedding model is the highest-leverage retrieval-quality choice after chunking. Walk a learner through the five common options (OpenAI text-embedding-3-large, Cohere embed-v3, BGE, SBERT, Voyage) along the five axes that matter (dimension, multilingual support, domain fit, cost-per-million-tokens, max context window). Conclude with the MTEB-leaderboard caveat: benchmarks can be gamed and rarely match your actual data distribution. Walk away knowing how to pick an embedding model for a new use case without reading any blog post.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.purple) - Why the embedding model decides retrieval ceiling**
  Title: "The Embedding Model Decides The Recall Ceiling"
  Visual: a brief one-paragraph recap "Embeddings - covered in Section 5.2 - turn each chunk into a dense vector. In RAG, the embedding model decides whether your retriever can even FIND the right doc. If the embedding model puts the query and the answer doc far apart in vector space, no reranker can save you." Above the paragraph, a small horizontal bar chart of "Recall ceiling" for three embedding models on the support corpus (e.g., ada-002 -> 0.62, cohere-v3 -> 0.83, bge-large -> 0.81).
  Key content: "embedding model", "Section 5.2", "recall ceiling".

- **sub=1 (C.cyan) - The five-axis decision matrix**
  Title: "Five Axes That Matter"
  Visual: a 5-column table with rows = embedding models (OpenAI text-embedding-3-large, Cohere embed-v3, BGE-large, SBERT all-mpnet-base, Voyage-2). Columns:
  - Dim (3072, 1024, 1024, 768, 1024)
  - Multilingual (Yes, Yes, EN+CN, English mostly, Yes)
  - Domain (General, General, General, General, Domain variants available)
  - Cost ($0.13/M tokens, $0.10/M tokens, Free self-host, Free self-host, $0.10/M tokens)
  - Max Context (8191, 512, 512, 384, 16000)
  Each cell first-letter capitalized; column headers title-case; entire table centered horizontally.
  Key content: "OpenAI", "Cohere", "BGE", "SBERT", "Voyage", "dim" or "dimension", "multilingual", "cost", "context window".

- **sub=2 (C.pink) - Dimension tradeoff**
  Title: "Higher Dim Costs More Memory And Compute"
  Visual: a bar chart showing memory footprint at 1M vectors for d=384 (1.5 GB), d=768 (3 GB), d=1024 (4 GB), d=3072 (12 GB) - same Section 11.12 math reused. Note: "Bigger dim helps quality up to a point; beyond ~1024 the marginal gain shrinks." Below: a tiny line chart showing diminishing-returns curve (quality vs dim).
  Key content: "dim", "memory", "1024", "3072", "diminishing returns" or "marginal".

- **sub=3 (C.blue) - Multilingual + domain match**
  Title: "Multilingual Models Underperform On English-Only Data"
  Visual: a 2x2 grid of cards. Columns: (Your data = English only, Your data = Multilingual). Rows: (Model = English-only e.g., SBERT, Model = Multilingual e.g., Cohere v3).
  - English/English-only: "Best quality, smallest dim, cheapest"
  - English/Multilingual: "Quality slightly worse, extra capacity wasted"
  - Multilingual/English-only: "Will fail on non-English queries"
  - Multilingual/Multilingual: "Use multilingual"
  Plus a one-line domain note: "If your corpus is medical / legal / code, off-the-shelf models often underperform a domain-tuned model (covered in chapter 12.12)."
  Key content: "multilingual", "English-only", "domain", "medical" or "legal" or "code", "12.12".

- **sub=4 (C.yellow) - Cost at scale**
  Title: "Cost Math At 100M Token Ingest"
  Visual: a side-by-side compute. "Re-embed 100M tokens" -> OpenAI text-embedding-3-large @ $0.13/M = $13,000. Cohere v3 @ $0.10/M = $10,000. Self-hosted BGE on a g5.xlarge for 2 days = ~$50. Note: "Self-hosting is dramatically cheaper at scale; managed APIs win on operational simplicity for small corpora."
  Key content: "cost", "100M tokens" or "100 million", a "$" number, "self-host" or "managed".

- **sub=5 (C.green) - MTEB caveat + decision flow**
  Title: "MTEB Is A Hint, Not An Answer"
  Visual: a yellow callout box (`background: ${C.yellow}06`, `border: 1px solid ${C.yellow}12`) reading: "MTEB is a public benchmark. Models can be over-fit to it. The leader on MTEB may underperform on YOUR data."
  Below: a short flowchart (4-step SVG) for picking an embedding model:
  1. "Need Multilingual?" -> Yes (use Cohere v3 / Voyage / OpenAI 3-large) -> No (go on)
  2. "Specialized Domain?" -> Yes (consider domain-tuned BGE or fine-tune; see 12.12) -> No (go on)
  3. "Budget Sensitive?" -> Yes (self-host BGE) -> No (go on)
  4. "Default" -> OpenAI text-embedding-3-large or Cohere embed-v3
  Add `<desc>` and svg-descriptions.json entry.
  Key content: "MTEB", "benchmark" or "leaderboard", "your data", a decision-tree pattern with at least 2 questions.

- [ ] **Step 1: Write content tests for 12.11**

Append to `src/__tests__/sections.test.jsx` after the existing 12.10 describe block (or at the end of the file - convention from M1/M2 should be followed):

```js
describe("EmbeddingModelChoice (12.11) content", () => {
  const fn = RagRetrieval.EmbeddingModelChoice;

  it("sub=0 frames embedding model as recall ceiling and references Section 5.2", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding model/i);
    expect(container.textContent).toMatch(/section 5\.2|5\.2/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 shows the five-axis decision matrix with named models", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/OpenAI/i);
    expect(container.textContent).toMatch(/Cohere/i);
    expect(container.textContent).toMatch(/BGE/i);
    expect(container.textContent).toMatch(/SBERT/i);
    expect(container.textContent).toMatch(/Voyage/i);
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/context/i);
  });

  it("sub=2 shows dimension memory tradeoff at common dims", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1024/);
    expect(container.textContent).toMatch(/3072/);
    expect(container.textContent).toMatch(/memory|GB/i);
    expect(container.textContent).toMatch(/diminish|marginal/i);
  });

  it("sub=3 contrasts multilingual vs English-only and mentions 12.12 for domain", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/english/i);
    expect(container.textContent).toMatch(/12\.12/);
  });

  it("sub=4 shows cost math at 100M tokens with a self-host comparison", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/100M|100 million/i);
    expect(container.textContent).toMatch(/\$/);
    expect(container.textContent).toMatch(/self-?host|managed/i);
  });

  it("sub=5 surfaces MTEB caveat and a decision flow", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/MTEB/);
    expect(container.textContent).toMatch(/benchmark|leaderboard/i);
    expect(container.textContent).toMatch(/your data|own data/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EmbeddingModelChoice"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full EmbeddingModelChoice chapter**

Replace the stub export in `src/sections/rag-retrieval.jsx` with the full implementation. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (purple, cyan, pink, blue, yellow, green).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Five Axes That Matter", "Cost Math At 100M Token Ingest", model names left as canonical capitalization (OpenAI, Cohere v3, BGE-large, SBERT, Voyage-2).
- Inner element tinted backgrounds: `background: \`${C.X}06\`` and `border: \`1px solid ${C.X}12\``.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- The 5-column model comparison table in sub=1 must use proper centered layout with even column widths (e.g., `display: grid; gridTemplateColumns: 1.4fr repeat(5, 1fr); gap: 6` with table-row pattern).
- The MTEB callout in sub=5 is a tinted yellow box inside the green sub-step box.
- The 4-step decision SVG in sub=5 must have `<desc>` first child; `viewBox` centered.
- Standalone formulas/computations in sub=4 cost math centered with `textAlign: "center"`.
- No "Preview:" / "Next:" / "Coming up:" forward references. Forward references to 12.12 are signposts only ("covered in chapter 12.12").

Follow the spec's chapter 12.11 description and the sub-step structure above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EmbeddingModelChoice"
```

Expected: PASS.

- [ ] **Step 5: If new SVG was added, update svg-descriptions.json**

If the decision-flow SVG in sub=5 was added, append to `src/data/svg-descriptions.json` under key `"12.11"`:

```json
"12.11": [
  "Four-step decision flowchart for picking an embedding model: ask whether multilingual is needed, whether the corpus is specialized, whether budget is sensitive, then default to OpenAI text-embedding-3-large or Cohere embed-v3."
]
```

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

Expected: all green. `npm run format` may modify the files; re-add after formatting.

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.11 Picking an Embedding Model"
```

---

## Task 7: Implement Chapter 12.12 DomainAdaptation

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `DomainAdaptation`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** When off-the-shelf embedding models miss domain-specific semantics, fine-tune them on your own data via contrastive learning. Cover the triplet-loss mechanism (anchor / positive / negative), the decision rule for when fine-tuning is worth the cost (specialized vocabulary, sub-80% recall on your corpus), the before-vs-after delta on the support corpus, and the operational cost. Walk away with the math + a sharp decision rule.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - The off-the-shelf gap**
  Title: "Off-The-Shelf Embeddings Sometimes Miss Domain Semantics"
  Visual: two example pairs from a medical corpus (NOT the support corpus this once - we need a specialized example to motivate fine-tuning). Example 1: "MI" vs "myocardial infarction" - off-the-shelf cosine 0.42 (should be ~0.95). Example 2: "tPA contraindicated" vs "tissue plasminogen activator should not be given" - off-the-shelf 0.51 (should be ~0.9). A bar showing two recall numbers on a held-out medical query set: off-the-shelf 0.62, fine-tuned 0.88.
  Key content: "off-the-shelf", "domain", "medical" or "legal" or "code", "MI" or "tPA", a similarity number like "0.42".

- **sub=1 (C.purple) - Contrastive learning + triplet loss**
  Title: "Contrastive Fine-Tuning: Pull Positives Close, Push Negatives Away"
  Visual: an SVG showing three points in 2D space (anchor in center, positive nearby, negative far). Arrows: anchor->positive labeled "Pull Close", anchor->negative labeled "Push Away". Below, the triplet-loss formula displayed in a centered monospace block:

```
L_triplet = max(0, d(A, P) - d(A, N) + margin)
```

  Where d = distance, A = anchor, P = positive, N = negative, margin = 0.2 (typical).
  Key content: "contrastive", "triplet" or "triplet loss", "anchor", "positive", "negative", "margin".

- **sub=2 (C.blue) - Training data construction**
  Title: "Pair Construction Decides Quality"
  Visual: three example training rows for the support corpus:
  - Anchor: "How do I reset my password?" | Positive: doc-1 chunk 1 ("To reset your password...") | Negative: doc-3 chunk 1 (about refunds)
  - Anchor: "I can't sign in" | Positive: doc-25 ("Login Troubleshooting...") | Negative: doc-7 (dashboard tour)
  - Anchor: "Cancel my subscription" | Positive: doc-15 ("Account Deletion Flow...") | Negative: doc-2 ("Email Change")
  Note: "Hard negatives - docs that are NEAR the positive in vector space but irrelevant - teach the model the most. Easy negatives waste compute."
  Key content: "anchor", "positive", "negative", "hard negative", a query like "reset my password" or "sign in" or "cancel".

- **sub=3 (C.green) - When to fine-tune**
  Title: "When Is Fine-Tuning Worth The Cost?"
  Visual: a two-column decision card.
  - Left (Fine-tune): "Highly specialized vocabulary (medical, legal, code)", "Off-the-shelf recall below 80% on your golden set", "You have 5k+ query-positive pairs", "Budget for periodic re-training as embeddings drift".
  - Right (Skip - use off-the-shelf): "General English", "Common domain (e-commerce, support)", "Less than 5k labeled pairs", "Recall already above 80%".
  Each row in title-case, capitalized first letter.
  Key content: "fine-tune", "80%" or "0.80", "5k" or "5000", "specialized", "general".

- **sub=4 (C.pink) - Before vs after on the support corpus**
  Title: "Before Vs After On The Support Corpus"
  Visual: a bar chart with two bars per metric (Recall@5, MRR, Latency). Off-the-shelf vs fine-tuned numbers:
  - Recall@5: 0.78 -> 0.91
  - MRR: 0.62 -> 0.84
  - Latency: 30ms -> 30ms (no change; fine-tuning affects quality not speed)
  Plus loss curve: y-axis loss 0.5 -> 0.05 over 3 epochs.
  Note: "Cost: ~$200 for a 50k-pair fine-tune on BGE-large via a managed service. Quality delta: usually 10-20 points on recall. Re-evaluate every 3-6 months as your corpus drifts."
  Key content: "before" or "off-the-shelf", "after" or "fine-tuned", "recall" or "MRR", a percentage gain like "0.78 -> 0.91" or "10-20 points", "cost" or "$200".

- [ ] **Step 1: Write content tests for 12.12**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("DomainAdaptation (12.12) content", () => {
  const fn = RagRetrieval.DomainAdaptation;

  it("sub=0 shows the off-the-shelf gap on domain pairs", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/off-the-shelf|off the shelf/i);
    expect(container.textContent).toMatch(/MI|tPA|medical|legal|code/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows triplet loss formula with anchor positive negative", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/triplet/i);
    expect(container.textContent).toMatch(/anchor/i);
    expect(container.textContent).toMatch(/positive/i);
    expect(container.textContent).toMatch(/negative/i);
    expect(container.textContent).toMatch(/margin/i);
  });

  it("sub=2 shows training pair construction with hard negatives", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hard negative/i);
    expect(container.textContent).toMatch(/reset my password|sign in|cancel/i);
  });

  it("sub=3 names the when-to-fine-tune decision rules", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/specialized|domain/i);
    expect(container.textContent).toMatch(/80%|0\.80/);
    expect(container.textContent).toMatch(/5k|5000|5,000/i);
    expect(container.textContent).toMatch(/fine-?tun/i);
  });

  it("sub=4 shows before vs after recall/MRR delta on support corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recall|MRR/i);
    expect(container.textContent).toMatch(/before|after|off-the-shelf|fine-?tuned/i);
    expect(container.textContent).toMatch(/cost|\$/);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DomainAdaptation"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full DomainAdaptation chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step as specified above (cyan, purple, blue, green, pink).
- The triplet-loss diagram in sub=1 must be an SVG with `<desc>` first child; viewBox centered. Three labeled points + 2 arrows.
- The triplet-loss formula `L_triplet = max(0, d(A, P) - d(A, N) + margin)` must be in a centered monospace block (`textAlign: "center"`).
- The before-vs-after bar chart in sub=4 must use evenly-spaced bars, centered horizontally; no overlap.
- Loss-curve sparkline in sub=4 - either a tiny SVG (with `<desc>` + entry) or an inline ASCII representation; if SVG, add the description.
- Training pair examples in sub=2 use the support corpus docs (doc-1, doc-3, doc-25 etc.) consistent with earlier chapters.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DomainAdaptation"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json if new SVGs introduced**

Add (or update) entries under `"12.12"`:

```json
"12.12": [
  "Triplet-loss diagram showing an anchor point in the center with arrows pulling a positive sample close and pushing a negative sample away.",
  "Before-versus-after bar chart comparing recall and MRR for off-the-shelf vs fine-tuned embeddings on the support corpus."
]
```

(Add only the entries that match SVGs actually present in the chapter.)

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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.12 Domain Adaptation"
```

---

## Task 8: Implement Chapter 12.13 HybridForRAG

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `HybridForRAG`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Hybrid retrieval (BM25 + dense) is the production default - dense embeddings miss exact-term matches, BM25 misses synonyms, fused they complement. Recap Section 11.24 in one paragraph, then focus on RAG-specific tuning: weight by query type (factual queries lean BM25, conceptual lean dense). Show on the support corpus: "API key" query (BM25 wins) vs "subscription cancel" query (dense wins). Show RRF and weighted-fusion formulas. Walk away with the right fusion strategy + per-query-type weights.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - Why neither alone is enough**
  Title: "Dense Misses Exact Terms; BM25 Misses Synonyms"
  Visual: a 2-row card.
  - Row 1 (Query: "How do I get an API key?"): dense retrieval top-3 = [doc-7, doc-12, doc-5] (similar to API but generic); BM25 top-3 = [doc-13 (API Keys), doc-7, doc-12]. The actual API-key doc is doc-13. Dense MISSED it.
  - Row 2 (Query: "Subscription cancel"): dense top-3 = [doc-15 (Account Deletion), doc-19, doc-3]. BM25 top-3 = [doc-3 (Subscription Tiers), doc-19, doc-25]. The actual cancellation doc is doc-15. BM25 MISSED it (no exact "cancel" in the doc title).
  Note: "Hybrid keeps both retrievers and fuses their rankings."
  Brief recap: "Hybrid search - covered in Section 11.24 - here we focus on RAG-specific tuning."
  Key content: "BM25", "dense", "API key", "subscription cancel" or "cancel", "Section 11.24".

- **sub=1 (C.purple) - The two fusion strategies**
  Title: "Two Fusion Strategies: RRF And Weighted Score"
  Visual: two stacked tinted blocks, each with a centered monospace formula.

  Block 1 (RRF - rank-based, no weight tuning):

```
RRF(d) = sum over retrievers r of: 1 / (k + rank_r(d))
where k = 60 (standard)
```

  Note: "Robust default. No weights to tune. Each retriever contributes a rank-reciprocal."

  Block 2 (Weighted score - tunable):

```
Score(d) = alpha * bm25_score(d) + (1 - alpha) * dense_score(d)
where alpha in [0, 1]
```

  Note: "Tunable per query type. Requires score normalization (BM25 and dense are on different scales)."
  Both formulas centered with `textAlign: "center"`. Monospace.
  Key content: "RRF" or "Reciprocal Rank Fusion", "k = 60", "alpha" or "weighted", "score".

- **sub=2 (C.blue) - RRF worked example**
  Title: "RRF Worked Example"
  Visual: a small table. Query: "I can't sign in".
  - BM25 ranks: doc-25 (1), doc-7 (2), doc-13 (3)
  - Dense ranks: doc-25 (2), doc-12 (1), doc-7 (3)
  Compute RRF (k=60):
  - doc-25: 1/(60+1) + 1/(60+2) = 0.01639 + 0.01613 = 0.03252
  - doc-7: 1/(60+2) + 1/(60+3) = 0.01613 + 0.01587 = 0.03200
  - doc-12: 0 + 1/(60+1) = 0.01639
  - doc-13: 1/(60+3) + 0 = 0.01587
  Final ranking: doc-25 > doc-7 > doc-12 > doc-13.
  Each computation row centered.
  Key content: "I can't sign in" or "sign in", "doc-25", a number like "0.03252" or "0.032".

- **sub=3 (C.cyan) - Complementary recall on the corpus**
  Title: "Complementary Recall: Hybrid Catches What Either Misses"
  Visual: a 3-bar chart of recall@5 on a 50-query held-out set:
  - BM25 only: 0.68
  - Dense only: 0.74
  - Hybrid (RRF): 0.86
  Note: "Hybrid is rarely worse than the best single method, often noticeably better."
  Brief side-note: "Latency cost: +30ms for the BM25 lookup. Often worth it."
  Key content: "complementary", "BM25", "dense", "hybrid", a number like "0.86" or "0.68".

- **sub=4 (C.green) - Per-query-type weight tuning**
  Title: "Tune Alpha By Query Type"
  Visual: a 3-row table.
  - Query type: Factual / lookup ("What is my account ID?") -> alpha = 0.7 (lean BM25; exact-term match dominates)
  - Query type: Conceptual / "how does X work" ("How does our pricing model work?") -> alpha = 0.3 (lean dense; synonyms + paraphrases matter)
  - Query type: Mixed / ambiguous (default) -> alpha = 0.5 (balanced)
  Plus one-line note: "A simple LLM-based classifier can label each query at runtime before retrieval. Cost: 1 extra LLM call (~$0.0002)."
  Key content: "factual" or "lookup", "conceptual", "alpha", "0.7" or "0.3", "classifier" or "classify".

- **sub=5 (C.orange) - Decision rule for RAG hybrid**
  Title: "Hybrid Defaults For RAG"
  Visual: a 4-row decision card.
  - "Always start with RRF (no tuning needed)."
  - "Move to weighted-alpha only if you have query-type labels."
  - "Add a classifier when your queries naturally split into factual vs conceptual."
  - "Re-evaluate alpha quarterly as your corpus and query mix drift."
  Each row first-letter capitalized.
  Key content: "RRF", "alpha" or "weighted", "classifier", "default".

- [ ] **Step 1: Write content tests for 12.13**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("HybridForRAG (12.13) content", () => {
  const fn = RagRetrieval.HybridForRAG;

  it("sub=0 shows API key + cancel examples and references Section 11.24", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/BM25/);
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/API key/i);
    expect(container.textContent).toMatch(/cancel|subscription/i);
    expect(container.textContent).toMatch(/Section 11\.24|11\.24/);
  });

  it("sub=1 shows RRF and weighted-fusion formulas with k = 60 and alpha", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/alpha/i);
  });

  it("sub=2 walks an RRF computation with doc rankings and final order", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc-?25/i);
    expect(container.textContent).toMatch(/0\.0\d+/);
  });

  it("sub=3 shows complementary recall numbers for BM25, dense, hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/recall|complementary/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=4 tunes alpha by query type with factual vs conceptual rows", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alpha/i);
    expect(container.textContent).toMatch(/factual|lookup/i);
    expect(container.textContent).toMatch(/conceptual/i);
    expect(container.textContent).toMatch(/0\.7|0\.3/);
  });

  it("sub=5 lists hybrid RAG decision defaults", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/RRF/);
    expect(container.textContent).toMatch(/default|start/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HybridForRAG"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full HybridForRAG chapter**

Replace the stub. Required (in addition to the standard rules):

- 6 sub-steps (sub >= 0 through sub >= 5).
- Colors per sub-step as specified above (pink, purple, blue, cyan, green, orange).
- Both fusion formulas in sub=1 in centered monospace blocks with `textAlign: "center"`.
- RRF worked-example computation in sub=2 must use the actual rank-reciprocal arithmetic so the numbers add up. Round to 5 decimals (or 3) for readability.
- The 3-bar recall chart in sub=3 must be evenly spaced, centered horizontally; bars labeled in title-case.
- The alpha-by-query-type table in sub=4 must have 3 rows, centered table layout, no overlap.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HybridForRAG"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json for any added SVGs**

If the recall bar chart in sub=3 is an SVG:

```json
"12.13": [
  "Three-bar recall chart comparing BM25 only, dense only, and hybrid (RRF) retrieval on a 50-query held-out set."
]
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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.13 Hybrid Retrieval for RAG"
```

---

## Task 9: Implement Chapter 12.14 RerankerCascade

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `RerankerCascade`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Recap Section 11.25 rerankers in one paragraph, then build the RAG-specific 3-stage cascade: vector top-50 (cheap) -> cross-encoder rerank top-10 (medium) -> LLM final answer with top-3-5 (expensive). Show the latency budget (30 + 80 + 800 ms = ~910 ms). Walk away knowing the right retrieval-to-rerank ratio and what each stage costs.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.blue) - Why a cascade beats a single retriever**
  Title: "Each Stage Cuts The Candidate Set And Pays For Better Quality"
  Visual: a brief paragraph recap: "Rerankers - covered in Section 11.25 - re-score a candidate list using a cross-encoder that reads query + doc together. Here we apply that in a 3-stage RAG cascade."
  Below: one-line teaser: "Vector retriever is cheap and lossy. Reranker is expensive and precise. LLM is most expensive and uses the smallest set."
  Key content: "cascade", "Section 11.25" or "11.25", "cross-encoder" or "reranker", "stage".

- **sub=1 (C.purple) - The 3-stage funnel**
  Title: "Stage 1 Vector Top-50 -> Stage 2 Reranker Top-10 -> Stage 3 LLM Top-3"
  Visual: an SVG funnel diagram with 3 sequential trapezoidal stages.
  - Stage 1 box (top, widest): "Vector Retrieval" - input 1M chunks, output 50.
  - Stage 2 box (middle, narrower): "Cross-Encoder Reranker" - input 50, output 10.
  - Stage 3 box (bottom, narrowest): "LLM Reads Top-3 + Generates" - input 10, output answer.
  Each stage labeled with cost-per-query tag.
  Add `<desc>` first child; viewBox centered with `x_start = (width - element_span) / 2`.
  Key content: "vector retrieval" or "vector", "reranker" or "cross-encoder", "LLM", "50", "10", "3" or "top-3".

- **sub=2 (C.green) - Latency budget**
  Title: "Latency Budget: 30 + 80 + 800 = ~910ms"
  Visual: a horizontal stacked-bar chart, total width = 910 units.
  - 30 (Vector, blue) -> "30ms"
  - 80 (Reranker, purple) -> "80ms"
  - 800 (LLM, pink) -> "800ms"
  Below: a centered monospace breakdown:

```
Vector retrieval (HNSW, top-50):      30 ms
Cross-encoder reranker (50 -> 10):    80 ms
LLM generation (200 tokens, top-3):  800 ms
                                     -------
Total p50 latency:                   910 ms
```

  Note: "LLM generation dominates. Optimizing reranker speed alone gives small wins. Caching the LLM call (covered in chapter 12.33) gives the biggest latency win."
  Key content: "latency", "30" and "80" and "800", "910" or "p50".

- **sub=3 (C.cyan) - Cost per query**
  Title: "Cost Per Query: $0.0001 + $0.0003 + $0.012 = $0.0124"
  Visual: a horizontal stacked-bar similar to sub=2 but with cost numbers. Plus a centered monospace breakdown:

```
Vector retrieval (managed HNSW):       $0.0001
Cross-encoder reranker (50 cands):     $0.0003
LLM generation (4000 in + 200 out):    $0.0120
                                      ---------
Total:                                 $0.0124
```

  Note: "LLM cost dominates. Reranker is cheap, vector retrieval is essentially free. At 1M queries/day, daily cost = $12,400. Caching can cut this 50-90%."
  Key content: "cost", "$0.01" or "0.0124" or similar, "LLM", "1M queries" or "daily".

- **sub=4 (C.yellow) - Cascade tuning knobs**
  Title: "The Two Knobs: Top-K Retrieved And Top-K Reranked"
  Visual: a 2x3 table.
  - Columns: Top-K vector retrieve (20 / 50 / 100), Top-K reranked (5 / 10 / 20).
  - Rows: Recall@final, Latency, Cost.
  - 20 -> 5: recall 0.82, latency 850ms, cost $0.011
  - 50 -> 10: recall 0.89, latency 910ms, cost $0.012 (default)
  - 100 -> 20: recall 0.92, latency 990ms, cost $0.013
  Note: "Sweet spot is usually 50 -> 10 -> 3. Going wider buys diminishing returns; going narrower trades recall for latency."
  Key content: "top-k", "50" and "10", "diminishing" or "sweet spot", "recall".

- [ ] **Step 1: Write content tests for 12.14**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("RerankerCascade (12.14) content", () => {
  const fn = RagRetrieval.RerankerCascade;

  it("sub=0 recaps Section 11.25 cross-encoder", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Section 11\.25|11\.25/);
    expect(container.textContent).toMatch(/cross-?encoder|reranker/i);
    expect(container.textContent).toMatch(/cascade|stage/i);
  });

  it("sub=1 shows the 3-stage funnel with top-50, top-10, top-3", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector/i);
    expect(container.textContent).toMatch(/reranker|cross-?encoder/i);
    expect(container.textContent).toMatch(/LLM/);
    expect(container.textContent).toMatch(/50/);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=2 shows the latency budget 30 + 80 + 800 = ~910ms", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/30/);
    expect(container.textContent).toMatch(/80/);
    expect(container.textContent).toMatch(/800/);
    expect(container.textContent).toMatch(/910|p50/i);
    expect(container.textContent).toMatch(/latency/i);
  });

  it("sub=3 shows per-query cost breakdown dominated by LLM", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/\$0\.0\d+/);
    expect(container.textContent).toMatch(/LLM/);
  });

  it("sub=4 shows top-k retrieve vs top-k rerank tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/top-?k/i);
    expect(container.textContent).toMatch(/sweet spot|diminish/i);
    expect(container.textContent).toMatch(/recall/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RerankerCascade"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full RerankerCascade chapter**

Replace the stub. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step as specified above (blue, purple, green, cyan, yellow).
- The 3-stage funnel SVG in sub=1 must use trapezoidal shapes (3 polygons stacked vertically, each narrower than the previous). `<desc>` first child; viewBox centered.
- The latency and cost stacked bars in sub=2 and sub=3 are best done as inline SVG or styled divs - either way no overlap, centered, with first-letter-capitalized labels.
- All monospace breakdown blocks centered with `textAlign: "center"`.
- The 2x3 tradeoff table in sub=4 must be evenly spaced, centered.
- Forward reference to chapter 12.33 in sub=2 phrased as past/present ("covered in chapter 12.33") - not anticipatory.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RerankerCascade"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json for any added SVGs**

```json
"12.14": [
  "Three-stage funnel diagram showing vector retrieval narrowing to a cross-encoder reranker narrowing to the LLM final answer, with candidate counts at each stage.",
  "Horizontal stacked bar chart showing per-query latency budget split into 30 ms vector, 80 ms reranker, and 800 ms LLM generation."
]
```

(Add only entries that match SVGs actually present.)

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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.14 The Reranker Cascade"
```

---

## Task 10: Implement Chapter 12.15 WhyTransformQueries

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `WhyTransformQueries`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Open Act 4. The query the user typed is rarely the optimal query for retrieval. Motivate query transformation with three failure modes (lexical mismatch, ambiguity, multi-intent) and a brief preview of the four strategies (HyDE, multi-query, routing, decomposition - each covered in 12.16-12.18). Walk away knowing WHY we transform queries and WHICH transformation maps to which failure.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.orange) - The user's query is rarely the best retrieval query**
  Title: "User Queries Are Rarely Optimal For Retrieval"
  Visual: a short framing paragraph: "Users type the question they have. Embedding models look for the answer they expect. These two text shapes don't always match - and when they don't, naive retrieval fails."
  Below: a small split-comparison.
  - User query (top): "I can't sign in"
  - The best doc title in the corpus: "Login Troubleshooting"
  - Cosine similarity: 0.61 (would-be top-3 misses it; correct doc is at rank 7)
  Note: "Three failure shapes ruin naive retrieval. Four query-transformation strategies fix them."
  Key content: "user query" or "user's query", "I can't sign in" or "sign in", "login" or "log in", a number like "0.61" or "0.6".

- **sub=1 (C.red) - Failure 1: Lexical mismatch**
  Title: "Lexical Mismatch: The User And The Doc Use Different Words"
  Visual: a 3-example table.
  - User: "I can't sign in" | Doc: "Login Troubleshooting" | Mismatch: sign in vs log in
  - User: "How do I cancel?" | Doc: "Account Deletion Flow" | Mismatch: cancel vs delete
  - User: "My screen is frozen" | Doc: "Browser Performance Issues" | Mismatch: screen frozen vs browser performance
  Note: "Dense embeddings help (sign-in and log-in are close in vector space) but only partially. HyDE (12.16) and multi-query (12.17) help more."
  Key content: "lexical mismatch" or "mismatch", "sign in" or "log in", "cancel" or "delete", "12.16" and "12.17".

- **sub=2 (C.yellow) - Failure 2: Ambiguity**
  Title: "Ambiguity: The Query Has Multiple Plausible Intents"
  Visual: a single query "How do I export?" with three branching interpretations.
  - Branch 1: Export data to CSV (doc-9 "Export Formats")
  - Branch 2: Export user list for admin (doc-26 "Bulk Operations")
  - Branch 3: Cancel an export job that failed (doc-29 "Export Failures")
  Note: "A naive retriever picks one and misses the other two. Multi-query (12.17) and routing (12.18) help."
  Key content: "ambiguous" or "ambiguity", "export", a list of at least 2 interpretations, "12.17" or "12.18".

- **sub=3 (C.green) - Failure 3: Multi-intent**
  Title: "Multi-Intent: One Query Asks Two Or More Questions"
  Visual: a single query "Cancel my subscription and get a refund" annotated with two sub-intents:
  - Sub-intent 1: How to cancel subscription -> doc-15 ("Account Deletion Flow")
  - Sub-intent 2: How to get a refund -> doc-4 ("Refunds")
  Note: "Naive retrieval finds docs for one intent and misses the other. Decomposition (12.18) splits the query into sub-queries."
  Key content: "multi-intent" or "two intents", "cancel" and "refund", "12.18".

- **sub=4 (C.blue) - The four strategies preview**
  Title: "Four Strategies Map To Three Failures"
  Visual: a 4-card grid (or 2x2). Each card has a strategy name + the failure it primarily fixes.
  - HyDE (12.16): Lexical mismatch via hypothetical answer
  - Multi-Query Expansion (12.17): Ambiguity via multiple paraphrases
  - Query Decomposition (12.18): Multi-intent via splitting into sub-queries
  - Query Routing (12.18): Sending each query to the right index / tool
  Cards centered, title-case, tinted backgrounds.
  Key content: "HyDE" or "hypothetical", "multi-query", "decomposition", "routing", chapter ids "12.16" and "12.17" and "12.18".

- [ ] **Step 1: Write content tests for 12.15**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("WhyTransformQueries (12.15) content", () => {
  const fn = RagRetrieval.WhyTransformQueries;

  it("sub=0 frames user query as rarely optimal and shows a mismatch example", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user|query/i);
    expect(container.textContent).toMatch(/sign in|log in|login/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows lexical mismatch examples and routes to 12.16 and 12.17", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lexical|mismatch/i);
    expect(container.textContent).toMatch(/sign in|log in|cancel|delete/i);
    expect(container.textContent).toMatch(/12\.16/);
    expect(container.textContent).toMatch(/12\.17/);
  });

  it("sub=2 shows ambiguity with multiple interpretations", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ambigu/i);
    expect(container.textContent).toMatch(/export/i);
    expect(container.textContent).toMatch(/12\.17|12\.18/);
  });

  it("sub=3 shows multi-intent on the cancel-and-refund query", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multi-?intent|two intents/i);
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/12\.18/);
  });

  it("sub=4 previews the four strategies and maps to 12.16-12.18", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/multi-?query/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/routing/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyTransformQueries"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WhyTransformQueries chapter**

Replace the stub. Required:

- 5 sub-steps (sub >= 0 through sub >= 4).
- Colors per sub-step as specified above (orange, red, yellow, green, blue).
- The 3-example mismatch table in sub=1 evenly spaced, centered, title-case headers.
- The 3-branch interpretation diagram in sub=2: either an SVG fan-out (if SVG, add `<desc>` + svg-descriptions.json entry) or styled divs.
- The 4-card preview grid in sub=4: `display: grid; gridTemplateColumns: repeat(2, 1fr); gap: 12`. Each card centered text.
- Forward references to 12.16/12.17/12.18 are within-section signposts, phrased as "covered in chapter 12.16" or "(12.17) helps more". No "Coming up:" or "Next:".

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyTransformQueries"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json if SVGs added**

```json
"12.15": [
  "Three-branch interpretation diagram showing the ambiguous query 'How do I export?' fanning out to three doc destinations: export formats, bulk operations, and export failures."
]
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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.15 Why Transform Queries"
```

---

## Task 11: Implement Chapter 12.16 HyDE

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `HyDE`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** HyDE (Hypothetical Document Embeddings): instead of embedding the QUERY, ask an LLM to write a hypothetical ANSWER, then embed THAT and retrieve. The hypothetical answer is text-shape-closer to the actual docs than the question is, so cosine similarity wins. Show the flow on "Why is my dashboard slow?". Show when HyDE helps (long descriptive queries, lexical mismatch) and when it doesn't (short factual queries with good embeddings). Walk away with the mechanism + the right use case.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.yellow) - The HyDE insight**
  Title: "Don't Embed The Question - Embed The Hypothetical Answer"
  Visual: a 2-line text contrast.
  - Normal RAG: Embed("Why is my dashboard slow?") -> retrieve.
  - HyDE: LLM("Why is my dashboard slow?") = "The dashboard may be slow due to large data volumes, browser extensions, or network latency." -> Embed that ANSWER -> retrieve.
  Insight callout (`background: ${C.yellow}06`): "The hypothetical answer is text-shape-closer to actual docs than the question is. Cosine similarity wins."
  Key content: "HyDE" or "hypothetical", "embed" and "answer", "dashboard slow" or "dashboard".

- **sub=1 (C.orange) - The HyDE flow**
  Title: "The HyDE Flow: Query -> LLM -> Hypothetical Answer -> Embed -> Retrieve"
  Visual: an SVG with 5 boxes in a horizontal flow, arrows between them.
  Box 1: "User Query"
  Box 2: "LLM Generates Hypothetical Answer"
  Box 3: "Embed Hypothetical Answer"
  Box 4: "Vector Retrieval"
  Box 5: "Top-K Real Docs"
  Each box title-case, evenly spaced, centered horizontally in viewBox.
  `<desc>` first child; svg-descriptions.json entry.
  Key content: "user query" or "query", "hypothetical answer", "embed", "retrieve".

- **sub=2 (C.green) - Worked example on dashboard-slow**
  Title: "Worked Example: 'Why Is My Dashboard Slow?'"
  Visual: three vertical panels.
  - Panel A (User query): "Why is my dashboard slow?"
  - Panel B (LLM's hypothetical answer, tinted): "The dashboard may be slow due to large data volumes, browser extensions interfering with rendering, network latency, or background sync jobs consuming resources. Try refreshing, disabling extensions, or checking the network panel."
  - Panel C (Top-3 retrieved docs): doc-22 ("Slow Page Load Troubleshooting"), doc-23 ("500 Errors"), doc-27 ("Browser Compatibility Issues"). All three are relevant - the hypothetical answer's vocabulary matches the doc vocabulary.
  Note: "Without HyDE, retrieval returned doc-7 (Dashboard Tour) - a generic doc that doesn't help. The question 'why slow' embedded poorly; the answer embedded well."
  Key content: "dashboard slow", "doc-22" or "Slow Page Load", "doc-23" or "500", at least one chunk of the hypothetical answer text.

- **sub=3 (C.purple) - Why it works**
  Title: "Why HyDE Works"
  Visual: a 3-card grid.
  - Card 1: "Questions look different from answers in vector space."
  - Card 2: "Hypothetical answers borrow doc vocabulary even if the LLM doesn't know the actual answer."
  - Card 3: "Robust to lexical mismatch because the LLM does the rewriting for you."
  Each card tinted background, centered text, title-case.
  Key content: "vector space", "vocabulary", "lexical mismatch" or "mismatch".

- **sub=4 (C.cyan) - When HyDE helps vs hurts**
  Title: "When HyDE Helps Vs When It Hurts"
  Visual: a 2-column card.
  - Helps (Left, tinted green): "Long descriptive queries", "Lexical mismatch (sign-in vs log-in)", "Conceptual / 'why does X happen' questions", "Queries that don't share vocabulary with docs".
  - Hurts (Right, tinted red): "Short factual queries with good embeddings (e.g., 'API key')", "Queries where the LLM might hallucinate the wrong answer shape", "Latency-sensitive pipelines (HyDE adds an LLM call: +200-400 ms)".
  Note: "If recall on your golden set is already above 0.85, HyDE likely won't help and will add latency."
  Key content: "helps" and "hurts" (or similar contrast), "descriptive" or "long", "factual" or "short", "latency" or "200" or "400".

- **sub=5 (C.pink) - The prompt template**
  Title: "The HyDE Prompt Template"
  Visual: a prompt-template artifact block (styled monospace, NOT code), background `${C.pink}06`, border `1px solid ${C.pink}12`, label "Prompt Template" centered, monospace 14-16px:

```
You are a helpful assistant. Write a single concise paragraph that
answers the user's question as if you knew the answer. The paragraph
will be used to search a documentation index, so include domain terms
and likely doc vocabulary. Do not say "I don't know" - guess plausibly.

Question: {query}

Hypothetical Answer:
```

  Below: cost note "+1 LLM call per user query (~$0.0005 + ~250ms). Cache the hypothetical answer by query hash to amortize." Plus a one-line reference: "Caching - covered in chapter 12.33."
  Key content: "prompt template", "hypothetical answer", "{query}", "I don't know" (groundedness contrast), "12.33" or "cache".

- [ ] **Step 1: Write content tests for 12.16**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("HyDE (12.16) content", () => {
  const fn = RagRetrieval.HyDE;

  it("sub=0 frames embed-the-answer not the question with dashboard example", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/embed.*answer|answer.*embed/i);
  });

  it("sub=1 shows the HyDE 5-box flow", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/user query|query/i);
    expect(container.textContent).toMatch(/hypothetical/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 walks the dashboard-slow worked example with retrieved doc-22", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/dashboard.*slow|slow.*dashboard/i);
    expect(container.textContent).toMatch(/doc-?22|slow page load|500/i);
  });

  it("sub=3 explains why HyDE works via vocabulary and mismatch", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/vocabulary/i);
    expect(container.textContent).toMatch(/mismatch|lexical/i);
  });

  it("sub=4 contrasts when HyDE helps vs hurts with latency note", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/help|hurt|when/i);
    expect(container.textContent).toMatch(/descriptive|long|factual|short/i);
    expect(container.textContent).toMatch(/latency|200|400/i);
  });

  it("sub=5 shows the HyDE prompt template with {query} placeholder", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/{query}/);
    expect(container.textContent).toMatch(/12\.33|cache|caching/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HyDE"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full HyDE chapter**

Replace the stub. Required:

- 6 sub-steps (sub >= 0 through sub >= 5).
- Colors per sub-step as specified above (yellow, orange, green, purple, cyan, pink).
- The 5-box HyDE flow SVG in sub=1 must be horizontal, evenly spaced boxes, `viewBox` centered, `<desc>` first child.
- The prompt-template block in sub=5 MUST be styled monospace (NOT a code block): background `${C.pink}06`, border `1px solid ${C.pink}12`, font-family monospace, 14-16px. Label "Prompt Template" in title-case centered above.
- The `{query}` placeholder inside the prompt template should be highlighted visually (different color), e.g., wrapped in a `<span>` with `color: ${C.pink}` or `background: ${C.pink}22`.
- The 3-panel worked example in sub=2 should have evenly-spaced panels, no overlap, each panel centered text.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HyDE"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.16": [
  "Five-box horizontal flow diagram showing the HyDE pipeline: user query, LLM generates hypothetical answer, embed hypothetical answer, vector retrieval, top-K real docs."
]
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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.16 HyDE - Hypothetical Document Embeddings"
```

---

## Task 12: Implement Chapter 12.17 MultiQueryExpansion

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `MultiQueryExpansion`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Multi-Query Expansion: ask an LLM to rewrite the user's query into 3-5 variants, retrieve top-K for each, fuse the rankings with RRF. Mention RAG-Fusion is the same idea (absorbed here). Mention step-back prompting briefly (a variant: ask a more general query). Show the worked example on "Cancel my subscription and get a refund". Walk away with the formula, when it helps, and when it's overkill.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.red) - The multi-query insight**
  Title: "One Query Becomes Many; Fuse The Results"
  Visual: a centered diagram with a single input query on the left fanning out into 3 variants in the middle, each producing a retrieved set on the right, then converging into a single fused ranking.
  Caption: "If the user's exact wording missed the right doc, one of the variant wordings might catch it."
  Note: "RAG-Fusion is the same idea under a different name - this chapter absorbs it."
  Key content: "multi-query" or "expansion", "variants", "fuse" or "RRF", "RAG-Fusion".

- **sub=1 (C.orange) - The 3-step pipeline**
  Title: "Three Steps: Generate Variants -> Retrieve Each -> Fuse"
  Visual: an SVG with 3 sequential boxes.
  Box 1: "LLM Generates 3-5 Query Variants"
  Box 2: "Run Vector Retrieval For Each Variant"
  Box 3: "Fuse Rankings With RRF"
  Add `<desc>` first child, viewBox centered.
  Key content: "generate" or "variants", "retrieve", "fuse" or "RRF", "3-5" or "3" or "5".

- **sub=2 (C.yellow) - Worked example on cancel + refund**
  Title: "Worked Example: 'Cancel My Subscription And Get A Refund'"
  Visual: a vertical layout.
  - Top: user query.
  - Middle: 3 LLM-generated variants in tinted boxes:
    - Variant 1: "How to cancel my subscription"
    - Variant 2: "How to get a refund after cancellation"
    - Variant 3: "Stop billing immediately"
  - Bottom: a 3-column rank table showing top-3 retrieved docs for each variant.
    - Variant 1 ranks: doc-15 (1), doc-7 (2), doc-3 (3)
    - Variant 2 ranks: doc-4 (1), doc-15 (2), doc-3 (3)
    - Variant 3 ranks: doc-5 (1), doc-15 (2), doc-21 (3)
  Final RRF-fused ranking: doc-15 (covers cancellation), doc-4 (covers refund), doc-3 (subscription tiers).
  Note: "Each variant brings a different doc to the top. Fusion captures both intents."
  Key content: "cancel", "refund", "doc-15" or doc id, "doc-4", a variant string.

- **sub=3 (C.purple) - The RRF formula**
  Title: "Fuse With RRF (Same Formula As Chapter 12.13)"
  Visual: centered monospace block:

```
RRF(d) = sum over variants v of: 1 / (k + rank_v(d))
where k = 60 (standard)
```

  Brief note: "Same fusion math as hybrid search (covered in chapter 12.13). Different inputs - here the rankings come from N variants of the same query rather than from BM25 + dense."
  Key content: "RRF" or "Reciprocal Rank Fusion", "k = 60", "12.13".

- **sub=4 (C.green) - Step-back prompting variant**
  Title: "Step-Back Prompting: Add A More General Variant"
  Visual: a 2-row example.
  - Original: "Why is the user role page failing on Chrome v124 with error E_PERM?"
  - Step-back (general): "Why does the user role page fail?"
  Note: "The original is too specific - the doc might not mention Chrome v124. The step-back catches more general docs. Reasoning models reduce the need for explicit step-back; include it when your queries are unusually specific."
  Brief mention: "This is one of many possible variant prompts. The chapter's main approach (sub=1 to sub=3) covers the common case; step-back is a niche addition."
  Key content: "step-back" or "step back", "general" or "broader", "specific".

- **sub=5 (C.cyan) - When to use it**
  Title: "When Multi-Query Helps"
  Visual: a 2-column card.
  - Helps (Left, tinted green): "Ambiguous queries with multiple plausible intents", "Complex multi-clause queries", "Recall is the priority over latency", "Reranker can absorb the wider candidate set".
  - Skip (Right, tinted red): "Short factual lookups ('What is my account ID?')", "Latency-critical paths (adds 1 LLM call + N parallel retrievals)", "When HyDE already solves the same failure".
  Cost note: "Adds ~300 ms (1 LLM call) + N parallel retrievals (cheap). Often pairs well with HyDE for hard cases."
  Key content: "ambiguous" or "complex", "factual" or "short", "latency", "300" or "ms", "HyDE".

- [ ] **Step 1: Write content tests for 12.17**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("MultiQueryExpansion (12.17) content", () => {
  const fn = RagRetrieval.MultiQueryExpansion;

  it("sub=0 frames one query becomes many and mentions RAG-Fusion", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/multi-?query|expansion|variants/i);
    expect(container.textContent).toMatch(/RAG-?Fusion/i);
  });

  it("sub=1 shows the 3-step pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/generate|variants/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/fuse|RRF/i);
  });

  it("sub=2 walks the cancel-and-refund example with 3 variants and fused ranking", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/doc-?15/i);
    expect(container.textContent).toMatch(/doc-?4/i);
  });

  it("sub=3 shows RRF formula and links to chapter 12.13", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/12\.13/);
  });

  it("sub=4 covers step-back prompting variant", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/step-?back/i);
    expect(container.textContent).toMatch(/general|broader|specific/i);
  });

  it("sub=5 shows when multi-query helps with latency cost", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ambigu|complex/i);
    expect(container.textContent).toMatch(/latency|300|ms/i);
    expect(container.textContent).toMatch(/HyDE/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MultiQueryExpansion"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full MultiQueryExpansion chapter**

Replace the stub. Required:

- 6 sub-steps (sub >= 0 through sub >= 5).
- Colors per sub-step as specified above (red, orange, yellow, purple, green, cyan).
- The fan-out diagram in sub=0 and the 3-step pipeline in sub=1 should be SVGs with `<desc>` first child + viewBox centered, OR styled divs if SVG is overkill.
- The RRF formula in sub=3 in a centered monospace block.
- The 3-column rank table in sub=2 must be evenly spaced, centered, with title-case headers ("Variant 1", "Variant 2", "Variant 3"). Document IDs in monospace.
- The 2-column helps/skip card in sub=5: `display: grid; gridTemplateColumns: 1fr 1fr; gap: 12`. Each card centered text.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MultiQueryExpansion"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json if SVGs added**

```json
"12.17": [
  "Fan-out diagram showing a single user query expanding into 3 LLM-generated variants, each retrieving its own top-K, then converging into a single fused ranking via RRF."
]
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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.17 Multi-Query Expansion"
```

---

## Task 13: Implement Chapter 12.18 QueryRoutingDecomposition

**Files:**
- Modify: `src/sections/rag-retrieval.jsx` (replace stub `QueryRoutingDecomposition`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Chapter purpose:** Two related strategies in one chapter: (a) ROUTING - a classifier or semantic router decides which retrieval target a query goes to (small index vs large vs SQL vs no-retrieval for chitchat). (b) DECOMPOSITION - an LLM splits a complex query into 2-3 sub-queries, retrieves for each, then assembles. Show worked examples on "Compare the Pro and Enterprise plans" (decomposition) and a router decision tree for chitchat / billing / troubleshooting. Walk away with both patterns + when to use each.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.green) - Two strategies, one chapter**
  Title: "Routing Decides Where; Decomposition Decides How Many"
  Visual: a 2-column header card.
  - Left (Routing): "Which index / tool should this query hit?"
  - Right (Decomposition): "Does this query need to be split into sub-queries?"
  Note: "Both rely on an LLM (or a cheaper classifier) to inspect the query and decide. They compose - a router can send a query to a decomposition step."
  Key content: "routing" and "decomposition", "index" or "tool", "split" or "sub-queries".

- **sub=1 (C.cyan) - Routing: the decision tree**
  Title: "Routing Sends Each Query To The Right Target"
  Visual: an SVG decision tree (4 leaves) for the support corpus router.
  Root: "Classify Query Type"
  - Branch 1: "Account & Billing" -> Account-billing index (top-k = 5)
  - Branch 2: "Product Features" -> Product-features index (top-k = 5)
  - Branch 3: "Troubleshooting" -> Troubleshooting index (top-k = 8) [more docs likely needed]
  - Branch 4: "Chitchat / Off-Topic" -> Skip retrieval; reply directly
  Add `<desc>` first child, viewBox centered.
  Note: "Routing avoids retrieving from indexes that can't help. Skipping retrieval on chitchat saves latency + cost AND prevents the LLM from hallucinating about a doc it doesn't need."
  Key content: "router" or "routing", "account" or "billing", "troubleshoot", "chitchat" or "skip retrieval".

- **sub=2 (C.purple) - Semantic router vs classifier**
  Title: "Two Router Implementations: Embedding-Based Vs LLM Classifier"
  Visual: a 2-row table.
  - Embedding-based (semantic router): "Embed the query, compare to embeddings of route prototypes ('billing question', 'troubleshooting question'). Pick highest cosine." Cost: ~$0.0001. Latency: ~10 ms. Accuracy: 85-90%.
  - LLM classifier: "Pass the query + route labels to a small LLM ('classify this query: billing / feature / troubleshoot / chitchat'). Pick the label." Cost: ~$0.0002. Latency: ~150 ms. Accuracy: 92-97%.
  Note: "Semantic router scales cheaper; LLM classifier handles edge cases better. Start with semantic; switch to LLM if routing accuracy stalls."
  Key content: "semantic router" or "embedding", "LLM classifier", "cost" or "latency", a number like "10 ms" or "150 ms".

- **sub=3 (C.orange) - Decomposition: the split**
  Title: "Decomposition Splits 'Compare X And Y' Into Two Sub-Queries"
  Visual: a 3-panel layout.
  - Panel A (User query): "Compare the Pro and Enterprise plans."
  - Panel B (LLM splits into sub-queries): "Sub-query 1: What's in the Pro plan?", "Sub-query 2: What's in the Enterprise plan?"
  - Panel C (Retrieved docs per sub-query):
    - Sub-query 1: doc-3 ("Subscription Tiers"), doc-10 ("Team Seat Management")
    - Sub-query 2: doc-3 ("Subscription Tiers"), doc-10, doc-21 ("Quota Exceeded - Enterprise-only feature")
  - Below all panels: a single LLM assembly step using the union of retrieved docs to write the comparison.
  Note: "Without decomposition, retrieval finds one tier's docs and misses the other. Decomposition guarantees both sides of the comparison are retrieved."
  Key content: "decomposition", "Pro" and "Enterprise", "sub-query" or "sub-queries", a doc id like "doc-3".

- **sub=4 (C.yellow) - When to decompose**
  Title: "When To Decompose: Multi-Hop, Comparison, Disjunction"
  Visual: a 3-row card.
  - Row 1: "Comparison: 'Compare X and Y' -> two sub-queries"
  - Row 2: "Multi-hop: 'How do I reset my password if I forgot my email?' -> sub-1: how to recover email; sub-2: how to reset password" (the running multi-hop example)
  - Row 3: "Disjunction with mixed types: 'Why is dashboard slow and showing 500 errors?' -> sub-1: dashboard slow troubleshooting; sub-2: 500 error troubleshooting"
  Note: "If the query has 'and' / 'compare' / 'or' between two distinct subjects, decomposition usually helps. Single-subject queries don't benefit."
  Key content: "multi-hop" or "multi-step", "comparison" or "compare", "disjunction" or "or", "reset.*password|password.*email|sign in" etc.

- **sub=5 (C.pink) - Decision: route, decompose, both, or neither**
  Title: "The Decision: Route, Decompose, Both, Or Neither"
  Visual: a 2x2 grid of cards.
  - "Route only" (top-left): "Most production RAG systems start here. Cheap, easy, high-impact."
  - "Decompose only" (top-right): "Use when queries are consistently complex (multi-hop, comparisons). Adds 1 LLM call + N parallel retrievals."
  - "Both" (bottom-left): "Route first to pick the right index, then decompose if the query is complex. Compose - they don't interfere."
  - "Neither" (bottom-right): "Default for simple lookup queries. Don't add complexity you don't need."
  Cost summary: "Routing: +10-150 ms / +$0.0001-0.0002. Decomposition: +200-300 ms / +$0.0005. Combined: ~+300-450 ms total query-transformation overhead."
  Key content: "route" and "decompose", "neither" or "default", "complex" or "simple", "$0.0005" or "$0.0002" or cost number.

- [ ] **Step 1: Write content tests for 12.18**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("QueryRoutingDecomposition (12.18) content", () => {
  const fn = RagRetrieval.QueryRoutingDecomposition;

  it("sub=0 frames routing and decomposition as two complementary strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/routing/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/index|tool|split|sub-/i);
  });

  it("sub=1 shows the router decision tree with chitchat skip", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/router|routing/i);
    expect(container.textContent).toMatch(/account|billing/i);
    expect(container.textContent).toMatch(/troubleshoot/i);
    expect(container.textContent).toMatch(/chitchat|skip retrieval|skip/i);
  });

  it("sub=2 contrasts semantic router vs LLM classifier with cost/latency", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/semantic router|embedding/i);
    expect(container.textContent).toMatch(/classifier/i);
    expect(container.textContent).toMatch(/latency|ms/i);
  });

  it("sub=3 walks the Pro vs Enterprise decomposition example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Pro/);
    expect(container.textContent).toMatch(/Enterprise/);
    expect(container.textContent).toMatch(/sub-?quer/i);
    expect(container.textContent).toMatch(/doc-?3|doc-?10/i);
  });

  it("sub=4 names when to decompose: multi-hop, compare, disjunction", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-?hop/i);
    expect(container.textContent).toMatch(/compar/i);
    expect(container.textContent).toMatch(/disjunction|or|and/i);
  });

  it("sub=5 shows the route/decompose/both/neither decision grid with cost numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/route/i);
    expect(container.textContent).toMatch(/decompos/i);
    expect(container.textContent).toMatch(/neither|default|simple/i);
    expect(container.textContent).toMatch(/\$0\.0\d+|ms/);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "QueryRoutingDecomposition"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full QueryRoutingDecomposition chapter**

Replace the stub. Required:

- 6 sub-steps (sub >= 0 through sub >= 5).
- Colors per sub-step as specified above (green, cyan, purple, orange, yellow, pink).
- The router decision-tree SVG in sub=1: 4 leaves under a root, evenly spaced, `<desc>` first child, viewBox centered.
- The 2-row router-implementation table in sub=2: evenly spaced, centered, title-case headers.
- The 3-panel decomposition example in sub=3 may be split vertically (Panel A above Panel B above Panel C) or a horizontal flow - either way no overlap, centered, title-case.
- The 2x2 decision grid in sub=5: `display: grid; gridTemplateColumns: 1fr 1fr; gap: 12`. Each card centered text, tinted background.
- Use the standard multi-hop running example ("How do I reset my password if I forgot my email?") in sub=4 to reinforce continuity.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "QueryRoutingDecomposition"
```

Expected: PASS.

- [ ] **Step 5: Update svg-descriptions.json**

```json
"12.18": [
  "Router decision tree with four leaves: account/billing, product features, troubleshooting, and chitchat (skip retrieval). The root labels classify-query-type.",
  "Three-panel decomposition example splitting 'Compare the Pro and Enterprise plans' into two sub-queries that retrieve from the subscription tiers and team seat docs."
]
```

(Add only entries that match SVGs present.)

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

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-retrieval.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.18 Query Routing and Decomposition"
```

---

## Task 14: Update CLAUDE.md mapping table and project structure for Acts 3+4

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Extend the Section 12 mapping table**

In `CLAUDE.md`, find the Section 12 mapping table (added in M1, extended in M2). Append 8 new rows for Acts 3+4. Also update the file annotation in the section heading to reflect that Section 12 now spans two files. After the existing rows for 12.10:

```markdown
**Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` Acts 1+2 + `rag-retrieval.jsx` Acts 3+4 - Milestones 1-3 of 6 complete)

| Chapter | Component | Title |
|---------|-----------|-------|
| 12.1 | WhyLLMsNeedRetrieval | Why LLMs Need Retrieval |
| 12.2 | NaiveRAGPipeline | The Naive RAG Pipeline |
| 12.3 | WhereNaiveRAGBreaks | Where Naive RAG Breaks |
| 12.4 | WhyChunkFixedSize | Why Chunk At All + Fixed-Size Baseline |
| 12.5 | RecursiveStructuralChunking | Recursive Structural Chunking |
| 12.6 | SemanticChunking | Semantic Chunking |
| 12.7 | LateChunking | Late Chunking (Jina 2024) |
| 12.8 | HierarchicalChunking | Hierarchical / Parent-Child Chunking |
| 12.9 | ContextualRetrieval | Contextual Retrieval (Anthropic 2024) |
| 12.10 | ChunkingDecision | The Chunking Decision |
| 12.11 | EmbeddingModelChoice | Picking an Embedding Model |
| 12.12 | DomainAdaptation | Domain Adaptation - Fine-Tuning Embeddings |
| 12.13 | HybridForRAG | Hybrid Retrieval for RAG |
| 12.14 | RerankerCascade | The Reranker Cascade |
| 12.15 | WhyTransformQueries | Why Transform Queries |
| 12.16 | HyDE | HyDE - Hypothetical Document Embeddings |
| 12.17 | MultiQueryExpansion | Multi-Query Expansion |
| 12.18 | QueryRoutingDecomposition | Query Routing & Decomposition |
```

(If M1/M2 used a different table format - e.g. separate tables per file - mirror that format.)

- [ ] **Step 2: Update the Project Structure tree**

Find the `## Project Structure` section. In the `src/sections/` block, add `rag-retrieval.jsx` immediately after `rag-foundations.jsx`:

```
│       ├── rag-foundations.jsx           # Section 12 (Acts 1+2, chapters 12.1-12.10)
│       └── rag-retrieval.jsx             # Section 12 (Acts 3+4, chapters 12.11-12.18)
```

If rag-foundations.jsx is currently the last entry (with the └── line-drawing character), demote it to ├── and make rag-retrieval.jsx the new last entry with └──.

- [ ] **Step 3: No test required for CLAUDE.md (it's documentation only)**

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "Document Section 12 Acts 3+4 in CLAUDE.md mapping"
```

---

## Task 15: Final M3 verification

**Files:** none (verification only); may require Bash returns to fix issues found

This is the MANDATORY validation gate from the spec. A chapter that passes tests but fails Chrome validation is NOT done.

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

- [ ] **Step 6: Boot dev server for Chrome visual validation**

```bash
npm run dev
```

Server should start at `http://localhost:5173/learn-ai/`. Leave it running for the rest of this task.

- [ ] **Step 7: Verify TOC shows Section 12 with 18 chapters**

Open `http://localhost:5173/learn-ai/`, confirm the TOC lists "Retrieval-Augmented Generation" with chapter rows 12.1 through 12.18.

- [ ] **Step 8: Chrome visual validation of each new chapter (12.11 - 12.18)**

Use the check-visuals skill (or `mcp__claude-in-chrome__*` tools). For each chapter in 12.11-12.18:

1. Navigate to the chapter via the URL / keyboard arrows.
2. Step through every sub-step (Reveal click), `sub=0` through the chapter's max sub.
3. For each sub-step take a screenshot via `mcp__claude-in-chrome__computer` (screenshot action).
4. Visually check the 12-point list:
   - No overlapping elements anywhere on the page.
   - Every diagram horizontally + vertically centered within its container.
   - Title-case for diagram box text.
   - First letter of every line capitalized.
   - Every Box has a real color (not `C.card`).
   - Every standalone formula is centered.
   - No em-dashes.
   - No "Coming up:" / "Next:" / "Preview:" forward references (within-section "Act N" or "12.N" signposts are OK).
   - No "architect" word.
   - SVGs have proper `<desc>` and viewBox centering.

Per-chapter focus points:

- **12.11**: 5-column model table no overlap; MTEB callout visible; decision-flow SVG centered.
- **12.12**: Triplet-loss SVG centered, anchor/positive/negative labels readable; before-vs-after bar chart bars equal width.
- **12.13**: RRF and weighted-fusion formula blocks centered; recall bar chart bars equal width; per-query-type table evenly spaced.
- **12.14**: 3-stage funnel diagram trapezoids stacked without overlap; latency bar chart equal-width segments; cost bar chart similar.
- **12.15**: 4-card preview grid (sub=4) 2x2 grid with no overlap; ambiguity fan-out diagram readable.
- **12.16**: 5-box HyDE flow SVG evenly spaced; prompt-template block monospace + tinted + label "Prompt Template" centered; `{query}` placeholder highlighted.
- **12.17**: Fan-out diagram clean; RRF formula centered; 3-column variant rank table evenly spaced.
- **12.18**: Router decision tree SVG with 4 leaves evenly spaced; 3-panel decomposition example no overlap; 2x2 decision grid.

- [ ] **Step 9: If any visual defect found**

Stop. Document the defect (which chapter, which sub-step, what's wrong). Fix in the chapter source file. Re-run `npm run test` to ensure no regression. Restart Step 8 for the affected chapter.

- [ ] **Step 10: If all 8 chapters pass visual validation**

Stop the dev server (Ctrl-C). Optionally save screenshots to `docs/superpowers/screenshots/section-12-m3/`:

```bash
mkdir -p docs/superpowers/screenshots/section-12-m3
# Save chrome screenshots from MCP captures into this directory
```

If screenshots saved:

```bash
git add docs/superpowers/screenshots/section-12-m3/
git commit -m "Add Section 12 M3 visual validation screenshots"
```

- [ ] **Step 11: Milestone marker commit (if any unstaged docs/format-only changes remain)**

If everything is already committed from earlier tasks, no marker commit is needed. If any small drift exists (formatting, etc.):

```bash
git status
git add -p
git commit -m "Section 12 Milestone 3 complete: Acts 3+4 (12.11-12.18) shipped"
```

- [ ] **Step 12: Confirm M3 success criteria**

Verify via `git log` that the M3 commit history is clean and well-structured. Confirm:

- [x] 8 chapters implemented in `rag-retrieval.jsx`.
- [x] Section 12 loader in `learn-ai.jsx` now spreads both `rag-foundations.jsx` and `rag-retrieval.jsx`.
- [x] Config has 18 Section 12 chapter entries (12.1-12.18).
- [x] `sections.test.jsx` imports `RagRetrieval` and spreads it into lookup.
- [x] `lookup.test.js` imports `RagRetrieval`, spreads it, and asserts the 8 components exist.
- [x] `config.test.js` asserts the 12.11-12.18 entries are present in order.
- [x] Tests added for every chapter at every sub-level (TDD per CLAUDE.md mandate).
- [x] Coverage 100% lines, branches >= 97.7%.
- [x] Lint + format clean.
- [x] Every new SVG has `<desc>` + `svg-descriptions.json` entry.
- [x] CLAUDE.md mapping + project tree updated.
- [x] Chrome browser visual validation passed for all 8 new chapters.

M3 complete. Ready to write Milestone 4 plan (Acts 5+6 - Context & Generation + Advanced Retrieval Patterns - 9 chapters).

---

## What Comes Next

After this milestone, the remaining sections of the implementation will be planned just-in-time:

| Milestone | Acts | Chapters | New file | When planned |
|---|---|---|---|---|
| M1 | Act 1 (problem) | 12.1-12.3 (3 ch) | `rag-foundations.jsx` (Act 1 stub + impl) | DONE |
| M2 | Act 2 (chunking) | 12.4-12.10 (7 ch) | extend `rag-foundations.jsx` | DONE |
| **M3** | **Acts 3+4 (embed/index + query transform)** | **12.11-12.18 (8 ch)** | **`rag-retrieval.jsx`** | **THIS PLAN** |
| M4 | Acts 5+6 (context/gen + advanced retrieval) | 12.19-12.27 (9 ch) | `rag-generation.jsx` | After M3 ships |
| M5 | Act 7 (eval) | 12.28-12.32 (5 ch) | `rag-evaluation.jsx` | After M4 ships |
| M6 | Acts 8+9 (ops + decision framework) | 12.33-12.38 (6 ch) | `rag-production.jsx` | After M5 ships |

After M6: a final pass updates CLAUDE.md mapping with all 38 chapters, runs full discoverability sync (`public/llms.txt` topic list, `index.html` JSON-LD if needed), and applies the title-case-for-diagram-boxes rule to CLAUDE.md (per spec's flagged update).
