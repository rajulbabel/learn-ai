# Section 12 Milestone 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the FINAL milestone of Section 12 "Retrieval-Augmented Generation": Acts 8 + 9 (Production Operations + Decision Framework + Capstone). Six chapters - 12.33 Caching, 12.34 CostModels, 12.35 ObservabilityTracing, 12.36 HallucinationDrift, 12.37 FrameworkChoice, 12.38 RAGDecisionFrameworkCapstone. After this milestone, all 38 chapters of Section 12 are live, the discoverability metadata is fully synced, and the title-case-for-diagram-box-text rule is applied globally to CLAUDE.md.

**Architecture:** Chapters live in a new section file `src/sections/rag-production.jsx` (holds 12.33-12.38 - the 6 ops + decision chapters). This is the fifth and final section file for Section 12. Section registration follows the same pattern as M1-M5: add entries to `chapters[]` in `src/config.js`; extend the section 12 loader in `src/learn-ai.jsx` to a five-file `Promise.all`; add the import to `src/__tests__/sections.test.jsx`. All chapter content follows the learn-ai visual rules in `CLAUDE.md` plus the M6 finalization tasks update CLAUDE.md to apply title-case-for-diagram-box-text globally (per spec's flagged update).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md`

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- Milestones 1 through 5 are complete and merged to `main`.
  - M1: `rag-foundations.jsx` exists with 12.1-12.3.
  - M2: `rag-foundations.jsx` extended with 12.4-12.10.
  - M3: `rag-retrieval.jsx` exists with 12.11-12.18.
  - M4: `rag-generation.jsx` exists with 12.19-12.27.
  - M5: `rag-evaluation.jsx` exists with 12.28-12.32.
- All tests currently pass on `main` (verify in Task 1).
- Section 12 is registered in `sectionNames` and `sectionColors` (done in M1).
- Section 12 loader in `learn-ai.jsx` is currently a four-file `Promise.all` (Acts 1-7 ship as four files). M6 extends it to a five-file `Promise.all` by appending `rag-production.jsx`.

## File Structure

### New files

- `src/sections/rag-production.jsx` - Acts 8 + 9. Six exports: Caching, CostModels, ObservabilityTracing, HallucinationDrift, FrameworkChoice, RAGDecisionFrameworkCapstone.

### Modified files

- `src/config.js` - add 6 entries to `chapters[]` (12.33-12.38).
- `src/learn-ai.jsx` - extend section 12 `Promise.all` from four files to five (append `rag-production.jsx`).
- `src/__tests__/sections.test.jsx` - import `RagProduction` and add to `lookup`. Add content tests for the 6 new chapters at every sub-level.
- `src/__tests__/lookup.test.js` - add presence check for `rag-production.jsx` exports.
- `src/__tests__/config.test.js` - add tests for the 6 new chapter entries.
- `src/data/svg-descriptions.json` - add entries for every new SVG introduced by the M6 chapters.
- `CLAUDE.md` - Task 12 adds the FULL Section 12 mapping table (all 38 chapters) and updates project structure tree to include all 5 rag-*.jsx files. Task 13 updates the visual rules section: applies title-case-for-diagram-box-text globally (per spec's flagged update).
- `public/llms.txt` - Task 14 final discoverability sync: full Section 12 description reflecting all 38 chapters.
- `index.html` - Task 14 final discoverability sync: JSON-LD `teaches` array confirmed to include "Retrieval-Augmented Generation".

### Unchanged

All existing section files for Sections 1-11. The four earlier Section 12 section files (`rag-foundations.jsx`, `rag-retrieval.jsx`, `rag-generation.jsx`, `rag-evaluation.jsx`) are not modified - the new content lands in the new `rag-production.jsx`.

---

## Standard running-example values (reference during implementation)

From the spec. Use consistently across 12.33-12.38:

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
- **LLM context window:** 8k (visuals) / 200k (model-agnostic mention).
- **Capstone secondary corpus (12.38 only):** legal case law for "Q&A over case law for a legal research firm" - case citations, jurisdictions, multi-hop "cases citing X about Y".

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Earlier sections suffered overlap defects fixed one-by-one. Validate in Chrome.
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Retrieve Top K Documents" not "retrieve top k documents". Exceptions: lowercase brand names (pgvector, numpy, LangChain - kept as-is per brand), variable identifiers (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors.
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section "Act N fixes this" or "covered in 12.X" past/present-tense back/cross-references are allowed.
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose". A chapter with 5 paragraphs of text and 1 diagram is failing this rule.

Act 8 color theme per spec: pink (`C.pink`) is the per-act color family for Act 8. Act 9 (one chapter, the capstone) uses indigo to match the section color `#7c4dff`; in practice the existing palette uses `C.purple` / `C.blue` for indigo-leaning content. The capstone uses a multi-color palette across its 8-10 sub-steps to weave together every prior chapter's visual identity.

---

## Tasks

### Task 1: Verify green baseline

**Files:** none (git state + run tests)

- [ ] **Step 1: Confirm we're on main with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Verify M1-M5 prerequisites are in place**

```bash
ls -la src/sections/rag-foundations.jsx src/sections/rag-retrieval.jsx src/sections/rag-generation.jsx src/sections/rag-evaluation.jsx
```

Expected: all four files exist. If any is missing, stop and fix prerequisites first.

```bash
grep -c "section: 12" src/config.js
```

Expected: 32 (chapters 12.1-12.32 already registered after M5).

- [ ] **Step 3: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass. This confirms we're starting from a known-good state.

- [ ] **Step 4: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Run production build smoke test**

```bash
npm run build
```

Expected: build succeeds. This catches any pre-existing chunk/asset issue before we add 6 more chapters.

- [ ] **Step 6: No commit yet** - this task only verifies baseline.

---

### Task 2: Create `src/sections/rag-production.jsx` scaffold with 6 stub exports

**Files:**
- Create: `src/sections/rag-production.jsx`
- Modify: `src/__tests__/lookup.test.js`

- [ ] **Step 1: Write failing test for the new section file**

Add to `src/__tests__/lookup.test.js` (follow the existing per-file presence-check pattern - inspect the file first; add the test near where rag-evaluation.jsx is similarly checked):

```js
it("rag-production.jsx exports the Act 8+9 chapter components", async () => {
  const mod = await import("../sections/rag-production.jsx");
  expect(typeof mod.Caching).toBe("function");
  expect(typeof mod.CostModels).toBe("function");
  expect(typeof mod.ObservabilityTracing).toBe("function");
  expect(typeof mod.HallucinationDrift).toBe("function");
  expect(typeof mod.FrameworkChoice).toBe("function");
  expect(typeof mod.RAGDecisionFrameworkCapstone).toBe("function");
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: FAIL - `Cannot find module '../sections/rag-production.jsx'`.

- [ ] **Step 3: Create the stub file**

Create `src/sections/rag-production.jsx` with this content:

```jsx
import { Box, T } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const Caching = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Caching - Prompt + Semantic (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const CostModels = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Cost Models (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ObservabilityTracing = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Observability & Tracing (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HallucinationDrift = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Detection & Drift (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const FrameworkChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Framework Choice (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const RAGDecisionFrameworkCapstone = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Complete RAG Decision Framework + Capstone (stub)
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
git add src/sections/rag-production.jsx src/__tests__/lookup.test.js
git commit -m "Add stub exports for rag-production.jsx (12.33-12.38)"
```

---

### Task 3: Extend Section 12 loader in learn-ai.jsx to five-file Promise.all

**Files:**
- Modify: `src/learn-ai.jsx` (sectionLoaders object)

After M5 ships, the section-12 loader entry in `src/learn-ai.jsx` should look like a four-file `Promise.all` (rag-foundations + rag-retrieval + rag-generation + rag-evaluation). M6 appends the fifth file.

- [ ] **Step 1: Inspect the current section-12 loader**

```bash
grep -n "12:" src/learn-ai.jsx
```

Confirm the current loader entry is the four-file `Promise.all`. If it's still single-file (M1) or differently shaped, adjust the edit accordingly.

- [ ] **Step 2: Extend the loader to five files**

Edit `src/learn-ai.jsx`. Find the section-12 entry and update it to:

```js
  12: () =>
    Promise.all([
      import("./sections/rag-foundations.jsx"),
      import("./sections/rag-retrieval.jsx"),
      import("./sections/rag-generation.jsx"),
      import("./sections/rag-evaluation.jsx"),
      import("./sections/rag-production.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 3: Run lint to verify**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Boot dev server smoke check**

```bash
npm run dev
```

Open `http://localhost:5173/learn-ai/` in a browser. The new chapters 12.33-12.38 won't be in `chapters[]` yet (next task), so this is just a smoke check that the app still loads and existing Section 12 chapters (12.1-12.32) still render.

Stop the server (Ctrl-C) after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/learn-ai.jsx
git commit -m "Extend Section 12 loader to include rag-production.jsx"
```

---

### Task 4: Add 12.33-12.38 entries to chapters array in config.js

**Files:**
- Modify: `src/config.js` (chapters array, after the last Section 12 entry from M5)
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write failing test**

Add to `src/__tests__/config.test.js`:

```js
describe("Section 12 chapters 12.33-12.38 (M6)", () => {
  it("appends chapters 12.33 through 12.38 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(38);
    const m6 = section12.slice(-6);
    expect(m6[0].id).toBe("12.33");
    expect(m6[0].component).toBe("Caching");
    expect(m6[0].title).toBe("Caching - Prompt + Semantic");
    expect(m6[1].id).toBe("12.34");
    expect(m6[1].component).toBe("CostModels");
    expect(m6[1].title).toBe("Cost Models");
    expect(m6[2].id).toBe("12.35");
    expect(m6[2].component).toBe("ObservabilityTracing");
    expect(m6[2].title).toBe("Observability & Tracing");
    expect(m6[3].id).toBe("12.36");
    expect(m6[3].component).toBe("HallucinationDrift");
    expect(m6[3].title).toBe("Hallucination Detection & Drift");
    expect(m6[4].id).toBe("12.37");
    expect(m6[4].component).toBe("FrameworkChoice");
    expect(m6[4].title).toBe("Framework Choice");
    expect(m6[5].id).toBe("12.38");
    expect(m6[5].component).toBe("RAGDecisionFrameworkCapstone");
    expect(m6[5].title).toBe("The Complete RAG Decision Framework + Capstone");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL - section12.length is 32 (M5 state), not 38.

- [ ] **Step 3: Add chapter entries to config.js**

Edit `src/config.js`. Find the last Section 12 entry from M5 (id `"12.32"` with component `"OnlineEvalABTesting"`). Add Section 12 Act 8 + 9 entries right after, before the closing `];`:

```js
  { id: "12.32", title: "Online Eval & A/B Testing", section: 12, component: "OnlineEvalABTesting" },
  // Section 12 Act 8: Production Operations
  { id: "12.33", title: "Caching - Prompt + Semantic", section: 12, component: "Caching" },
  { id: "12.34", title: "Cost Models", section: 12, component: "CostModels" },
  { id: "12.35", title: "Observability & Tracing", section: 12, component: "ObservabilityTracing" },
  { id: "12.36", title: "Hallucination Detection & Drift", section: 12, component: "HallucinationDrift" },
  { id: "12.37", title: "Framework Choice", section: 12, component: "FrameworkChoice" },
  // Section 12 Act 9: Decision Framework + Capstone
  {
    id: "12.38",
    title: "The Complete RAG Decision Framework + Capstone",
    section: 12,
    component: "RAGDecisionFrameworkCapstone",
  },
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
git commit -m "Add chapter entries 12.33-12.38 to config"
```

---

### Task 5: Register RagProduction in sections.test.jsx lookup

**Files:**
- Modify: `src/__tests__/sections.test.jsx`

The generic test block in sections.test.jsx iterates over `chapters` and looks up each component in `lookup`. Without this import, generic tests for 12.33-12.38 will fail with "fn is not a function".

- [ ] **Step 1: Run sections.test.jsx to confirm failure before change**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: FAIL - the generic "All chapters" describe block tries to call `fn()` for 12.33-12.38 where `fn` is undefined.

- [ ] **Step 2: Add the import and spread**

Edit `src/__tests__/sections.test.jsx`. Find the existing import block at the top (after the other section imports including `RagEvaluation` from M5) and add:

```js
import * as RagProduction from "../sections/rag-production.jsx";
```

Then find the `lookup` object and spread `RagProduction` into it (last spread, after `RagEvaluation`):

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
  ...RagEvaluation,
  ...RagProduction,
};
```

(The existing list of imports may differ in exact order - keep them as-is and just add `...RagProduction` at the end.)

- [ ] **Step 3: Run sections.test.jsx to verify it passes**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: PASS. The generic test now runs against 12.33-12.38 stubs which render empty sub-levels without crashing.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Register RagProduction in sections.test lookup"
```

---

### Task 6: Implement Chapter 12.33 Caching

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `Caching`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** Production RAG burns cash on every query. Two caching strategies cut cost by 50-95% when applied correctly: prompt caching (Anthropic-style: cache the static system + retrieved-context prefix) and semantic caching (cache by query similarity in vector space). Walk away knowing when each applies, how the mechanisms work, what they cost, and what the false-hit risk looks like.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - Why cache in RAG**
  Title: "Why Cache In RAG"
  Visual: per-query cost stack bar (no cache): embedding $0.0001 + retrieval $0.0002 + LLM input tokens $0.012 (4k tokens at $3 / 1M) + LLM output tokens $0.005 (500 tokens at $15 / 1M) = $0.0173 / query. At 1k QPS over a day = $1,500 / day. Below the bar: caching can cut this 50-95% on hot queries.
  Key content: "cache" or "caching", "cost" or "QPS", "1000" or "1k" or "QPS", a dollar amount like "$0.012" or "$1500".

- **sub=1 (C.pink) - Prompt cache: the mechanism**
  Title: "Prompt Cache: Cache The Static Prefix"
  Visual: a styled artifact block showing the prompt with two clearly-separated regions:
  - Top region (background `${C.green}06`, label "Cached Prefix"): the system prompt + retrieved-context chunks for a stable doc set. Label: "Cached - 90% Discount, 5 Min TTL".
  - Bottom region (background `${C.pink}06`, label "Fresh Suffix"): the user's per-query question + final assistant marker. Label: "Fresh - Full Price".
  Below the artifact: a 2-row cost comparison.
  - Row 1 ("Full Price - No Cache"): 4000 input tokens at $3 / 1M = $0.012.
  - Row 2 ("With Prompt Cache - Hot Prefix"): 3800 cached at $0.30 / 1M = $0.00114 + 200 fresh at $3 / 1M = $0.0006. Total = $0.00174. Savings = ~85%.
  Brief explanation: cache is provider-side (e.g., Anthropic prompt caching), opaque to the model. TTL typically 5 minutes; refresh by re-issuing the same prefix.
  Key content: "prompt cache" or "prefix", "cached" / "fresh" labels, "90%" or "85%", "5 min" or "TTL".

- **sub=2 (C.pink) - Prompt cache: when it applies**
  Title: "When Prompt Cache Applies"
  Visual: a 2-column comparison table:
  - Column 1 ("Cache Hits"): support agent loops on stable docs; multi-turn conversation with same docs; same RAG pipeline answering many queries with stable system prompt.
  - Column 2 ("Cache Misses"): docs change per query (no shared prefix); query-time chunking (different chunks every time); cold-start every conversation.
  Each cell title-case.
  Key content: "support agent" or "agent loop", "multi-turn" or "conversation", "stable", "miss" or "cold".

- **sub=3 (C.pink) - Semantic cache: the mechanism**
  Title: "Semantic Cache: Cache By Query Similarity"
  Visual: a flow diagram (SVG) with 5 boxes in two rows:
  - Top row: [Incoming Query] -> [Embed Query] -> [Cosine Search In Cache Store].
  - Below the cosine box: a branch (decision diamond): "Score >= 0.93?"
  - Branch yes -> [Return Cached Answer] (background `${C.green}06`).
  - Branch no -> [Run Full RAG, Store Answer] (background `${C.orange}06`).
  Show actual cosine scores under three example queries:
  - "How do I reset my password?" vs cached "How can I reset my password?" -> 0.97 (HIT)
  - "Why is my dashboard slow?" vs cached "How do I reset my password?" -> 0.34 (MISS)
  - "How do I change my password?" vs cached "How do I reset my password?" -> 0.88 (BORDERLINE, depends on threshold)
  Key content: "semantic cache", "cosine" or "similarity", "threshold" or "0.93", "hit" / "miss".

- **sub=4 (C.pink) - Semantic cache: eviction, invalidation, false-hit risk**
  Title: "Semantic Cache: Eviction, Invalidation, And False-Hit Risk"
  Visual: a 3-card grid:
  - Card 1 ("Eviction"): LRU + TTL. Cache fills up; evict oldest unused; TTL forces refresh of any answer older than e.g. 24h.
  - Card 2 ("Invalidation"): when the corpus updates (a doc changes), every cached answer that touched that doc is stale. Strategy: tag cache entries with doc-IDs, invalidate on doc update.
  - Card 3 ("False-Hit Risk"): two queries with cosine 0.95 can still want different answers. Example: "Cancel my subscription" vs "Cancel my trial" - similar embed, very different policy. Tune threshold high (0.95+) for safety; monitor false-hit rate on a held-out set.
  Each card title-case, tinted background `${C.pink}06`, border `1px solid ${C.pink}12`.
  Key content: "LRU" or "eviction", "TTL", "invalidat", "false-hit" or "false hit", "subscription" or "trial" (the example).

- **sub=5 (C.green) - Combined impact: bar chart**
  Title: "Combined: Prompt Cache + Semantic Cache"
  Visual: a 4-bar comparison chart (horizontal bars):
  - Bar 1 ("No Cache"): $0.0173 / query (full red).
  - Bar 2 ("Prompt Cache Only, 80% Hit Rate"): $0.0044 / query (74% savings, orange).
  - Bar 3 ("Semantic Cache Only, 30% Hit Rate"): $0.0121 / query (30% savings, yellow).
  - Bar 4 ("Both - Stacked"): $0.0030 / query (83% savings, green).
  Bars stacked vertically with cost labels right-aligned and percentage savings labeled.
  Below the chart: a 1-line takeaway: "Prompt cache compounds with semantic cache. Apply both; tune thresholds; monitor false-hit rate."
  Key content: "80%" or "stack" or "combined", a "$0." cost figure, "savings" or "%".

- [ ] **Step 1: Write content tests for 12.33**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("Caching (12.33) content", () => {
  const fn = RagProduction.Caching;

  it("sub=0 shows per-query cost stack and QPS scale", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d+/);
  });

  it("sub=1 shows prompt cache prefix/suffix split and 90% discount", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/prompt cache|cached prefix|prefix/i);
    expect(container.textContent).toMatch(/90%|85%|5 min|TTL/i);
    expect(container.textContent).toMatch(/fresh/i);
  });

  it("sub=2 contrasts prompt-cache hits vs misses", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent|multi-?turn|stable/i);
    expect(container.textContent).toMatch(/miss|cold/i);
  });

  it("sub=3 shows semantic cache cosine flow with example scores", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/cosine|similarity/i);
    expect(container.textContent).toMatch(/0\.9\d|threshold/i);
  });

  it("sub=4 covers eviction, invalidation, and false-hit risk", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LRU|eviction/i);
    expect(container.textContent).toMatch(/invalidat/i);
    expect(container.textContent).toMatch(/false[- ]hit/i);
  });

  it("sub=5 shows combined prompt + semantic cache savings", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/combined|stack|both/i);
    expect(container.textContent).toMatch(/\$0?\.\d+/);
    expect(container.textContent).toMatch(/%|savings/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "Caching"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full Caching chapter**

Replace the stub export in `src/sections/rag-production.jsx`. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (pink throughout sub 0-4, green for sub 5 to signal the savings).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Prompt Cache", "Semantic Cache", "Cache Hits" - every word capitalized.
- Inner element tinted backgrounds: `background: \`${C.X}06\`` and `border: \`1px solid ${C.X}12\``.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- The semantic-cache flow diagram in sub=3 is an SVG with a `<desc>` first child.
- The combined-savings bar chart in sub=5 is an SVG with a `<desc>` first child.
- Standalone formulas/comparison tables centered with `textAlign: "center"`.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "Caching"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

Edit `src/data/svg-descriptions.json`. Add (use IDs matching the SVGs created):

```json
{
  "id": "semantic-cache-flow",
  "description": "Semantic cache decision flow: incoming query is embedded, compared by cosine similarity to cached queries, and either returns the cached answer (score >= 0.93) or runs full RAG and stores the new answer."
},
{
  "id": "caching-savings-bars",
  "description": "Horizontal bar chart comparing per-query cost: no cache versus prompt cache only versus semantic cache only versus both stacked. Both stacked delivers the lowest cost and highest savings percentage."
}
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

Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.33 Caching"
```

---

### Task 7: Implement Chapter 12.34 CostModels

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `CostModels`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** A production RAG system's bill is the sum of five cost lines: embedding, vector search, reranker, LLM input tokens, LLM output tokens. Walk through each, show the per-query breakdown, scale to daily / monthly at production QPS, then enumerate the levers (smaller embedding, fewer chunks, smaller LLM, prompt cache, semantic cache) and how much each cuts.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - The 5 cost lines**
  Title: "Five Cost Lines Per RAG Query"
  Visual: a 5-card grid (in order of typical magnitude):
  - Card 1 ("LLM Output Tokens"): ~$15 per 1M tokens (Claude Sonnet typical). Per query: 500 output tokens = $0.0075.
  - Card 2 ("LLM Input Tokens"): ~$3 per 1M tokens. Per query: 4000 input tokens (system + retrieved chunks + question) = $0.012.
  - Card 3 ("Reranker"): ~$0.001 per query (cross-encoder, optional).
  - Card 4 ("Vector Search"): ~$0.0002 per query (operator cost, managed service typical).
  - Card 5 ("Embedding"): ~$0.0001 per query (1024-dim, modern provider).
  Each card title-case, tinted background `${C.pink}06`.
  Below the cards: total per query = $0.0208 (visible sum).
  Key content: "embedding", "vector search", "reranker", "LLM input" or "input tokens", "LLM output" or "output tokens", "$0.0" cost figures.

- **sub=1 (C.pink) - Per-query cost stack bar chart**
  Title: "The Cost Stack For One Query"
  Visual: a horizontal stacked bar chart (SVG) showing the 5 cost lines proportionally:
  - LLM output (36% of total, $0.0075)
  - LLM input (58% of total, $0.012)
  - Reranker (5% of total, $0.001)
  - Vector search (1% of total, $0.0002)
  - Embedding (<1% of total, $0.0001)
  Total bar = 100% = $0.0208. Each segment labeled with its cost and percentage.
  Below the chart: a 1-line takeaway: "LLM tokens are 95% of the cost. Optimize there first."
  Key content: "LLM" or "tokens", "95%" or "94%" or similar dominant share, "$0.02" or "$0.0208" or total.

- **sub=2 (C.pink) - Daily / monthly projection at 1k QPS**
  Title: "Scaling To Production: 1k QPS Daily Bill"
  Visual: a worked computation table:
  - Per query: $0.0208
  - Per second (1k QPS): $20.80
  - Per minute: $1,248
  - Per hour: $74,880
  - Per day (24h): $1,797,120 (if literally 1k QPS 24/7)
  - Realistic daily (1k peak QPS, 30% average load): $539,136 / day
  - Monthly: $16.2M / month at this scale
  Below the table: a stark callout: "This is why every cost lever matters. 10% reduction = $1.6M / month saved."
  Key content: "QPS" or "1000" or "1k", "$1.6M" or "$16M" or a multi-million figure, "month" or "daily".

- **sub=3 (C.pink) - The 5 levers**
  Title: "Five Levers To Cut Cost"
  Visual: a 5-row impact table:
  - Lever 1 ("Smaller Embedding"): 1024 -> 384 dim with matryoshka. Impact: -60% storage, no quality drop. Cost reduction: small (embedding is <1% of bill).
  - Lever 2 ("Fewer Chunks Retrieved"): top-20 -> top-5 to LLM. Impact: -75% input tokens. Cost reduction: ~58% x 75% = ~44%.
  - Lever 3 ("Smaller LLM"): Sonnet -> Haiku. Impact: ~10x cheaper per token, ~80% quality on most RAG tasks. Cost reduction: ~80% of LLM bill.
  - Lever 4 ("Prompt Cache"): 80% prefix hit rate. Cost reduction: ~74% on cached prefix tokens.
  - Lever 5 ("Semantic Cache"): 30% hit rate on hot queries. Cost reduction: ~30%.
  Each row title-case.
  Below the table: a takeaway: "Levers compound. Apply them in order: cache first (free quality), then reduce chunks (free quality), then downsize LLM (quality tradeoff)."
  Key content: "lever" or "levers", "smaller embedding" or "matryoshka", "fewer chunks" or "top-?k", "smaller LLM" or "Haiku" or "Sonnet", "cache".

- **sub=4 (C.pink) - Worked example: lever stack**
  Title: "Worked Example: Stack All Five Levers"
  Visual: a step-by-step cost reduction trail:
  - Start: $0.0208 / query (full price)
  - Apply prompt cache (80% hit): -74% on input -> $0.0061 / query
  - Apply semantic cache (30% hit on hot queries): -30% overall on those queries -> $0.0043 / query (blended)
  - Reduce top-k from 20 to 5: -44% remaining input tokens -> $0.0028 / query (blended)
  - Switch LLM to Haiku: -60% on LLM bill (output + remaining input) -> $0.0012 / query
  Final: $0.0012 / query = 94% reduction from $0.0208.
  At 1k QPS: $103,680 / day (vs $1.79M no-lever). Saved: $1.69M / day.
  Visual: a downward staircase / waterfall SVG with each step labeled. Each step in a distinct color.
  Key content: "stack" or "compound" or "all five", "94%" or "90%" or similar large reduction, "$1.6M" or "$1.7M" or similar saved figure.

- **sub=5 (C.green) - Cost vs quality frontier**
  Title: "Cost vs Quality: The Frontier"
  Visual: a 2D scatter chart (SVG):
  - X axis: cost per query ($0.001 to $0.05).
  - Y axis: faithfulness score (0.5 to 1.0).
  - Points: 6 configurations plotted.
    - Point A ("Full Sonnet + No Cache + Top-20"): cost $0.0208, faithfulness 0.92.
    - Point B ("Sonnet + Prompt Cache + Top-10"): cost $0.0048, faithfulness 0.91.
    - Point C ("Sonnet + Both Caches + Top-10"): cost $0.0029, faithfulness 0.90.
    - Point D ("Haiku + Both Caches + Top-10"): cost $0.0012, faithfulness 0.86.
    - Point E ("Haiku + Both Caches + Top-5"): cost $0.0008, faithfulness 0.81.
    - Point F ("Haiku, No Cache, Top-3"): cost $0.0007, faithfulness 0.74 (off the frontier).
  Pareto-optimal frontier marked with a dashed line through A, B, C, D, E. F is below the frontier.
  Below the chart: a takeaway: "Pick the point on the frontier that matches your minimum acceptable quality."
  Key content: "frontier" or "Pareto", "cost" / "quality" or "faithfulness", at least one cost figure and one faithfulness score.

- [ ] **Step 1: Write content tests for 12.34**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("CostModels (12.34) content", () => {
  const fn = RagProduction.CostModels;

  it("sub=0 enumerates the 5 cost lines", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding/i);
    expect(container.textContent).toMatch(/vector search|search/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/LLM input|input token/i);
    expect(container.textContent).toMatch(/LLM output|output token/i);
  });

  it("sub=1 shows the cost stack bar with LLM dominance", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/LLM|tokens/i);
    expect(container.textContent).toMatch(/9\d%|95%|94%/);
  });

  it("sub=2 scales to QPS / daily / monthly", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/daily|month|day/i);
    expect(container.textContent).toMatch(/\$\d/);
  });

  it("sub=3 enumerates the 5 cost levers", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lever/i);
    expect(container.textContent).toMatch(/smaller|matryoshka|384/i);
    expect(container.textContent).toMatch(/Haiku|Sonnet|smaller LLM/i);
    expect(container.textContent).toMatch(/cache/i);
  });

  it("sub=4 stacks all levers and shows a final cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stack|compound|all/i);
    expect(container.textContent).toMatch(/9\d%|reduction|saved/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d/);
  });

  it("sub=5 plots cost vs quality frontier", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/frontier|Pareto/i);
    expect(container.textContent).toMatch(/quality|faithfulness/i);
    expect(container.textContent).toMatch(/cost|\$/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CostModels"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full CostModels chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Colors per sub-step as specified above (pink throughout, green for the frontier in sub=5).
- The cost stack bar chart in sub=1 is an SVG with a `<desc>` first child.
- The waterfall in sub=4 is an SVG with a `<desc>` first child.
- The cost-vs-quality scatter in sub=5 is an SVG with a `<desc>` first child.
- All dollar amounts use literal "$" (no em-dash, no fancy formatting).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CostModels"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

Edit `src/data/svg-descriptions.json`. Add:

```json
{
  "id": "cost-stack-bar",
  "description": "Horizontal stacked bar chart of per-query cost showing LLM tokens dominate at 94 percent while embedding, vector search, and reranker make up the remainder."
},
{
  "id": "cost-waterfall",
  "description": "Downward waterfall chart showing per-query cost reducing as five levers are stacked: prompt cache, semantic cache, fewer chunks, smaller LLM, smaller embedding."
},
{
  "id": "cost-quality-frontier",
  "description": "Scatter plot of cost versus faithfulness with six RAG configurations and a Pareto-optimal frontier marked through the cost-efficient points."
}
```

Run:

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
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.34 Cost Models"
```

---

### Task 8: Implement Chapter 12.35 ObservabilityTracing

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `ObservabilityTracing`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** A production RAG system is opaque without traces. Walk through the canonical trace structure (span tree), the per-stage attributes you must log, the tools that capture them, and the privacy considerations that constrain what you can log. Walk away knowing what a single user query's trace actually looks like and what every span attribute is for.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - Why trace RAG**
  Title: "Why Trace RAG In Production"
  Visual: a 4-card grid of "what goes wrong without traces":
  - Card 1 ("Mystery Slowness"): user reports "the system is slow" - no per-stage latency, can't tell if retrieval or LLM is the bottleneck.
  - Card 2 ("Silent Quality Drop"): faithfulness drops 5% week-over-week - no doc-IDs logged, can't see which docs were retrieved.
  - Card 3 ("Cost Blowup"): bill doubles - no per-query token count, can't tell which queries pulled in too much context.
  - Card 4 ("Hallucination Hunt"): user flags a bad answer - no model-version logged, can't reproduce.
  Each card tinted background `${C.pink}06`, title-case.
  Key content: "trace" or "tracing", "slowness" or "latency", "doc-?ID" or "logged", "model version" or "reproduce".

- **sub=1 (C.pink) - The canonical span tree**
  Title: "The Canonical RAG Trace: Span Tree"
  Visual: an SVG tree diagram showing the parent/child span structure:
  - Root span: "Query (180ms total)"
  - Child 1: "Embed Query (12ms)"
  - Child 2: "Vector Search (28ms)"
  - Child 3: "Rerank (45ms)"
  - Child 4: "Pack Prompt (3ms)"
  - Child 5: "Generate (92ms)"
  Each child rendered as a sub-span block with width proportional to latency. Below each: a tiny attribute strip with key=value chips (e.g., "top-k=20", "model=bge-reranker-v2", "chunks=10").
  Key content: "span" or "trace", "embed" / "search" / "rerank" / "generate", "ms" or "latency".

- **sub=2 (C.pink) - Per-stage attributes table**
  Title: "Per-Stage Attributes To Log"
  Visual: a wide table:
  - Row "Embed": query_text (hashed), embedding_model_version, dim, latency_ms.
  - Row "Vector Search": top_k_requested, index_name, distance_metric, retrieved_doc_ids, retrieval_scores, latency_ms.
  - Row "Rerank": reranker_model_version, input_count, output_count, reranker_scores, latency_ms.
  - Row "Pack": chunk_count_packed, total_prompt_tokens, citation_count, latency_ms.
  - Row "Generate": llm_model_version, prompt_tokens, completion_tokens, finish_reason, latency_ms.
  Header row title-case. Each cell title-case where it's English (variable names stay as-is per the "variable identifier" exception).
  Key content: "doc-?ID" or "retrieved_doc_ids", "model version" or "model_version", "tokens", "score".

- **sub=3 (C.pink) - Tools landscape**
  Title: "Tools: What Captures RAG Traces"
  Visual: a 5-card grid:
  - Card 1 ("LangSmith"): LangChain's official tracer. Strong for LangChain users; integrates with the LangChain stack.
  - Card 2 ("Helicone"): provider-agnostic; logs every LLM call with cost / latency dashboards. Lightweight.
  - Card 3 ("OpenTelemetry"): the open standard. Vendor-neutral spans; export to Datadog / Grafana / Jaeger / custom.
  - Card 4 ("Arize Phoenix"): open-source; built for LLM eval + trace; strong dashboard for retrieval quality.
  - Card 5 ("Native Provider Tooling"): Anthropic console, OpenAI dashboard. Limited but free.
  Each card title-case, tinted background `${C.pink}06`. Brand names kept as-is (LangSmith, Helicone, OpenTelemetry - preserve official casing).
  Key content: "LangSmith" or "Helicone" or "OpenTelemetry" or "Phoenix", "dashboard" or "spans".

- **sub=4 (C.pink) - Privacy considerations**
  Title: "Privacy: What NOT To Log In Plain Text"
  Visual: a 2-column comparison:
  - Column 1 ("Log Freely"): doc-IDs, retrieval scores, latency, model version, token counts, embedding-model version, query length, anonymized user ID, response status code.
  - Column 2 ("Do Not Log In Plain Text"): raw query text (hash it), raw retrieved chunks (log only IDs), PII inside the query, user account IDs (use opaque session IDs), API keys, prompt template contents that include secrets.
  Each cell title-case.
  Brief explanation: regulations (GDPR, HIPAA, SOC2) and contracts may forbid storing user query content in plain text. Use one-way hashes for queries; log doc-IDs not chunk text; redact PII upstream.
  Key content: "privacy", "hash" or "redact" or "PII", "GDPR" or "regulation" or "raw query".

- **sub=5 (C.green) - Trace dashboard mock**
  Title: "What A Production Trace Dashboard Looks Like"
  Visual: a styled dashboard mock (DIV-based, not SVG, with grid of mock panels):
  - Top row: 4 metric tiles ("P50 Latency 180ms", "P99 Latency 620ms", "Faithfulness 0.91", "Cost Per Query $0.012").
  - Middle row: a span-tree thumbnail for the most recent slow trace.
  - Bottom row: a 3-cell row with "Slowest Stage = Rerank", "Top Retrieved Doc = Doc-7", "Model Version = Sonnet 4.7".
  Below the mock: a takeaway: "A trace is the single source of truth when a user complains. Every stage. Every score. Every model version."
  Key content: "dashboard", "P50" or "P99" or "latency", "model version" or "version".

- [ ] **Step 1: Write content tests for 12.35**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ObservabilityTracing (12.35) content", () => {
  const fn = RagProduction.ObservabilityTracing;

  it("sub=0 lists what goes wrong without traces", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|tracing/i);
    expect(container.textContent).toMatch(/latency|slow/i);
    expect(container.textContent).toMatch(/reproduce|model version/i);
  });

  it("sub=1 shows the canonical span tree", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/span|trace/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/generat/i);
    expect(container.textContent).toMatch(/ms/);
  });

  it("sub=2 enumerates per-stage attributes", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc[-_ ]?id/i);
    expect(container.textContent).toMatch(/model[ _]?version/i);
    expect(container.textContent).toMatch(/tokens/i);
  });

  it("sub=3 lists the tools landscape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/LangSmith|Helicone|OpenTelemetry|Phoenix/);
  });

  it("sub=4 covers privacy and what not to log", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/privacy|GDPR|PII|hash|redact/i);
    expect(container.textContent).toMatch(/raw query|plain text|secret/i);
  });

  it("sub=5 mocks a production trace dashboard", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/P50|P99|latency/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ObservabilityTracing"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ObservabilityTracing chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Colors per sub-step (pink throughout, green for the dashboard mock in sub=5).
- The span tree in sub=1 is an SVG with a `<desc>` first child.
- The per-stage attributes table in sub=2 uses CSS grid `display: grid; gridTemplateColumns: 100px 1fr; gap: 8`. Header row bold.
- The 5-tool grid in sub=3 uses `display: grid; gridTemplateColumns: repeat(5, 1fr); gap: 12`. Brand names preserved as-is (LangSmith, Helicone, OpenTelemetry, Arize Phoenix) - they are official capitalizations.
- Variable identifiers like `embedding_model_version`, `retrieved_doc_ids`, `prompt_tokens` are allowed to stay lowercase per the variable-identifier exception. Surrounding column headers and English labels still title-case.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ObservabilityTracing"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

```json
{
  "id": "rag-trace-span-tree",
  "description": "Parent/child span tree for a single RAG query: embed, vector search, rerank, pack prompt, and generate, each with proportional latency width."
}
```

Run:

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
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.35 Observability & Tracing"
```

---

### Task 9: Implement Chapter 12.36 HallucinationDrift

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `HallucinationDrift`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** Two slow-moving production failures that traditional alerting misses: hallucinations (the model fabricates) and drift (the system's behavior changes silently over time). Walk through the detection signals for each, the 4 drift types, and the alert structure that catches them before users complain.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - Hallucination signals in production**
  Title: "Hallucination Signals In Production"
  Visual: a 4-card grid of signals to monitor:
  - Card 1 ("Faithfulness Score"): per-generation faithfulness from LLM-as-judge (covered in Section 12.29). Alert if rolling 7-day median drops below 0.85.
  - Card 2 ("Citation Coverage"): percent of claims with a `[doc-X]` citation. Alert if drops below 80%.
  - Card 3 ("Refusal Rate"): percent of queries the model refused with "I don't know". Alert on either spike (too cautious) or dip (model leaking I-don't-know-when-context-was-sufficient).
  - Card 4 ("Out-Of-Index Mentions"): regex / LLM check for entities mentioned in the answer that don't appear in any retrieved doc. Hard signal of hallucination.
  Each card title-case, tinted background `${C.pink}06`.
  Key content: "faithfulness", "citation" or "citations", "refusal", "out[- ]of[- ]index" or "hallucinat".

- **sub=1 (C.pink) - The 4 drift types**
  Title: "Four Drift Types"
  Visual: a 2x2 grid of drift types:
  - Quadrant 1 ("Data Drift"): the corpus changes (new docs added, old docs removed). Embedding index becomes stale relative to current corpus. Detect: re-index timestamp vs current doc set checksum.
  - Quadrant 2 ("Embedding Drift"): you re-embed with a new model. Old vectors and new vectors are not directly comparable. Detect: embedding-model-version logged per query; alert on mixed-version retrievals.
  - Quadrant 3 ("Eval Drift"): the LLM-as-judge model is upgraded. Faithfulness scores from old judge vs new judge are not directly comparable. Detect: lock judge version; rerun calibration on judge change.
  - Quadrant 4 ("Distribution Drift"): user query distribution shifts (new product launched, new failure mode). Old query embeddings cluster differently. Detect: cluster monitoring on query embeddings over time.
  Each quadrant title-case, tinted background `${C.pink}06`.
  Key content: "data drift", "embedding drift", "eval drift", "distribution drift".

- **sub=2 (C.pink) - Hallucination detection flow**
  Title: "Hallucination Detection Pipeline"
  Visual: an SVG flow diagram:
  - Input: "User Query + Retrieved Chunks + Generated Answer"
  - Step 1: "Extract Claims" (LLM-segments answer into atomic claims).
  - Step 2: "Check Each Claim Against Retrieved Chunks" (LLM-as-judge: is claim supported?).
  - Step 3: "Compute Faithfulness Score" (supported_claims / total_claims).
  - Step 4: "Log Score + Doc-IDs Used + Unsupported Claims" to the trace.
  - Step 5: "Alert If Rolling Median < 0.85".
  Below the diagram: a worked example showing one query with 5 claims, 4 supported, 1 hallucinated -> faithfulness 0.80 -> alerted.
  Key content: "claim" or "claims", "supported" or "unsupported", "faithfulness", "0.8" or "0.85".

- **sub=3 (C.pink) - Drift detection: metric-over-time chart**
  Title: "Drift Detection: Metrics Over Time"
  Visual: an SVG time-series chart with 4 lines:
  - Line 1 (faithfulness): trending down from 0.92 to 0.85 over 30 days. Threshold line at 0.85. Alert fires day 28.
  - Line 2 (recall on golden set): trending down from 0.88 to 0.79 over 30 days. Threshold 0.82. Alert fires day 22.
  - Line 3 (refusal rate): trending up from 8% to 18%. Threshold 15%. Alert fires day 25.
  - Line 4 (cost per query): trending up from $0.012 to $0.019. No quality alert; cost alert at 50% increase fires day 30.
  X axis: days 1-30. Y axis: metric value. Each line in a distinct color with its threshold dashed.
  Key content: "drift", "metric" or "time" or "30 days" or "days", "threshold" or "alert".

- **sub=4 (C.pink) - Alerting structure**
  Title: "What An Alert Should Carry"
  Visual: a styled artifact block (NOT a code block) showing an alert payload:

```
ALERT: rag.faithfulness.drop
Severity: WARNING
Trigger: 7-day median faithfulness dropped below 0.85 (currently 0.82).
First Crossed: 2026-05-14 03:21 UTC
Affected: Production - Customer Support Pipeline
Recent Examples (Last 24h):
  - Query: "How do I reset my password if I forgot my email?"
    Faithfulness: 0.60 | Cited Docs: doc-1, doc-3 | Unsupported Claim: "Support team will email a reset link."
  - Query: "Cancel my subscription and get a refund"
    Faithfulness: 0.50 | Cited Docs: doc-4 | Unsupported Claim: "Refunds are issued within 24 hours."
Recommended Action: review recent corpus updates and re-run golden eval.
```

  Style: monospace 14-16px, tinted background `${C.pink}06`, border `1px solid ${C.pink}12`. Title says "Alert Payload" or similar.
  Brief takeaway: an alert without examples is useless. Always include the failing queries.
  Key content: "alert" or "alert payload", "faithfulness", "examples" or "query", "doc-?\d".

- **sub=5 (C.green) - The full hallucination + drift dashboard**
  Title: "The Full Hallucination + Drift Panel"
  Visual: a 2x2 dashboard mock:
  - Top-left ("Faithfulness Trend"): the time-series from sub=3 thumbnail.
  - Top-right ("Refusal Rate"): a thumbnail of refusal-over-time.
  - Bottom-left ("Drift Types Triggered"): 4-row status panel (data: OK, embedding: WARN, eval: OK, distribution: ALERT).
  - Bottom-right ("Top Hallucinated Queries Last 24h"): list of 3 queries with faithfulness < 0.7.
  Below: a final takeaway: "Hallucination detection + drift monitoring catches what users wouldn't bother to report - the slow leak before the flood."
  Key content: "drift" or "dashboard", "hallucinat" or "faithfulness", "alert" or "WARN" or "OK".

- [ ] **Step 1: Write content tests for 12.36**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("HallucinationDrift (12.36) content", () => {
  const fn = RagProduction.HallucinationDrift;

  it("sub=0 lists hallucination signals", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/refusal/i);
    expect(container.textContent).toMatch(/out[- ]of[- ]index|hallucinat/i);
  });

  it("sub=1 names the 4 drift types", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/data drift/i);
    expect(container.textContent).toMatch(/embedding drift/i);
    expect(container.textContent).toMatch(/eval drift/i);
    expect(container.textContent).toMatch(/distribution drift/i);
  });

  it("sub=2 shows the hallucination detection pipeline with claim extraction", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/claim/i);
    expect(container.textContent).toMatch(/supported|unsupported/i);
    expect(container.textContent).toMatch(/faithfulness/i);
  });

  it("sub=3 shows metric-over-time chart with thresholds", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/30 days|over time|days/i);
    expect(container.textContent).toMatch(/threshold|alert/i);
  });

  it("sub=4 shows an alert payload with example queries", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alert/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/example|query/i);
    expect(container.textContent).toMatch(/doc-?\d/i);
  });

  it("sub=5 mocks the full hallucination + drift dashboard", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard|panel/i);
    expect(container.textContent).toMatch(/drift|hallucinat/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HallucinationDrift"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full HallucinationDrift chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Colors per sub-step (pink throughout, green for the dashboard in sub=5).
- The hallucination pipeline diagram in sub=2 is an SVG with `<desc>`.
- The drift time-series in sub=3 is an SVG with `<desc>`.
- The alert payload in sub=4 is a styled monospace block (NOT a code block) tinted `${C.pink}06`. Title says "Alert Payload".
- Variables like `rag.faithfulness.drop` (alert names) preserved as-is per variable-identifier exception.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "HallucinationDrift"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

```json
{
  "id": "hallucination-detection-pipeline",
  "description": "Hallucination detection flow: extract claims from the answer, check each against retrieved chunks, compute faithfulness score, log, and alert when below threshold."
},
{
  "id": "drift-metrics-over-time",
  "description": "Time-series chart over 30 days showing faithfulness, recall, refusal rate, and cost per query lines crossing their alert thresholds at different days."
}
```

Run:

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
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.36 Hallucination Detection & Drift"
```

---

### Task 10: Implement Chapter 12.37 FrameworkChoice

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `FrameworkChoice`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** A team building production RAG faces a framework decision: write everything with raw SDKs, pick LlamaIndex, use LangChain, try LangGraph, lean on Haystack, or commit to a vendor SDK (Anthropic Agents, OpenAI Agents). Each has real tradeoffs. Walk through the 6 options with honest current-state assessments, then provide a decision tree based on team size, customization needs, and lock-in tolerance.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - The 6 framework options**
  Title: "Six Framework Options For RAG"
  Visual: a 6-card grid (3x2):
  - Card 1 ("No Framework"): raw SDK (Anthropic / OpenAI / Cohere) + simple Python or TypeScript orchestration. Most popular for new production RAG in 2025.
  - Card 2 ("LlamaIndex"): RAG-focused framework. Good defaults for retrieval, less abstracted than LangChain.
  - Card 3 ("LangChain"): the original. Large ecosystem; abstractions evolving (and some deprecated within the framework itself).
  - Card 4 ("LangGraph"): graph-based agent orchestration from LangChain team. Newer; explicit state machine.
  - Card 5 ("Haystack"): enterprise-leaning; modular pipelines; smaller community than LangChain.
  - Card 6 ("Vendor SDK"): OpenAI Agents, Anthropic native tool-use. Tight integration; vendor lock-in.
  Each card title-case, tinted background `${C.pink}06`.
  Key content: "no framework" or "raw SDK", "LlamaIndex", "LangChain", "LangGraph", "Haystack", "vendor SDK" or "OpenAI Agents" or "Anthropic".

- **sub=1 (C.pink) - Decision matrix**
  Title: "Framework Decision Matrix"
  Visual: a 6-column x 5-row matrix (one column per framework, one row per criterion):
  - Header row: No Framework | LlamaIndex | LangChain | LangGraph | Haystack | Vendor SDK
  - Row "Lock-In Risk": None | Low | Medium | Medium | Low | High
  - Row "API Churn": None | Low | High | Medium | Low | Low
  - Row "Complexity": High Build / Low Hidden | Low Build / Medium Hidden | Low Build / High Hidden | Medium Build / Medium Hidden | Medium Build / Medium Hidden | Low Build / High Hidden
  - Row "Community Size": Huge | Large | Huge | Growing | Medium | Vendor-Specific
  - Row "RAG-Specific Fit": You Build | Strong | OK | OK | Strong | OK
  Each cell title-case.
  Key content: "lock-in" or "lock in", "churn", "complexity", "community", "RAG" or "fit".

- **sub=2 (C.pink) - Honest take: LangChain status**
  Title: "An Honest Take On LangChain"
  Visual: a 2-column comparison:
  - Column 1 ("Pros"): largest ecosystem; biggest community; tutorials everywhere; can build a prototype in 30 minutes; widely-used integrations for every vector DB, every embedding model, every LLM.
  - Column 2 ("Cons"): abstractions hide what's actually happening (lost-in-middle invisible until you trace); some abstractions deprecated within the framework itself (Stuff/MapReduce/Refine chains, original AgentExecutor); fast-moving API churn requires upgrades; framework lock-in concerns once production code depends on chains.
  Below: a balanced takeaway: "LangChain is still actively developed and dominant for prototyping. For production-grade RAG, many teams move to raw SDK + LlamaIndex retriever, or stay on LangChain but carefully avoid deprecating abstractions."
  Key content: "LangChain", "deprecated" or "deprecating" or "abstraction", "churn", "production".

- **sub=3 (C.pink) - When each framework fits**
  Title: "When Each Framework Fits"
  Visual: a 6-row recommendation table:
  - Row 1 ("No Framework"): small team, full control needed, production-grade RAG with custom orchestration. Fits 2-3 engineers building a single product.
  - Row 2 ("LlamaIndex"): RAG-heavy product, want good retrieval defaults, willing to accept some framework dependency. Fits teams shipping a RAG-centric app.
  - Row 3 ("LangChain"): early prototyping, large team needs shared vocabulary, ecosystem integrations matter more than minimalism. Fits teams that staff for framework upgrades.
  - Row 4 ("LangGraph"): explicit agent state machine, multi-step workflows, less hidden magic than LangChain. Fits teams building structured agents.
  - Row 5 ("Haystack"): enterprise / regulated environment, modular pipelines, smaller-community tradeoff is OK. Fits orgs with security review on every dependency.
  - Row 6 ("Vendor SDK"): committed to one provider, lock-in is acceptable, tight integration is the priority. Fits internal Anthropic / OpenAI shops.
  Key content: "team" or "size", at least 3 framework names, "prototype" or "production".

- **sub=4 (C.pink) - Decision tree**
  Title: "Framework Decision Tree"
  Visual: an SVG decision tree:
  - Root: "Is RAG The Primary Product Feature?"
    - YES -> "Need Full Control / Mid-Sized Team?" -> YES -> No Framework + LlamaIndex Retriever. NO -> LlamaIndex.
    - NO -> "Is It A Multi-Step Agent?" -> YES -> "Want Explicit State?" -> YES -> LangGraph. NO -> LangChain. NO -> "Single-Provider OK?" -> YES -> Vendor SDK. NO -> No Framework + Raw SDK.
  Each leaf labeled. Each branch title-case.
  Key content: "decision tree" or "tree", at least 3 framework names, "team" or "RAG" or "agent".

- **sub=5 (C.green) - Framework-agnostic core**
  Title: "What Stays The Same Regardless Of Framework"
  Visual: a single big card with 6 bullets:
  - Bullet 1: chunking strategy (Act 2) is a data-pipeline decision, not a framework decision.
  - Bullet 2: embedding model choice (12.11) is a data-pipeline decision.
  - Bullet 3: hybrid + reranker cascade (12.13, 12.14) is a retrieval-quality decision.
  - Bullet 4: prompt template + context packing (12.19) is a generation decision.
  - Bullet 5: eval (Act 7) is a measurement decision.
  - Bullet 6: tracing (12.35) is an ops decision.
  Below: a final takeaway: "Frameworks are wrappers around these decisions. Get the decisions right; the framework is replaceable. Keep production code thin enough that a framework swap is a 2-day job, not a 2-month rewrite."
  Key content: "chunking" or "embedding" or "hybrid" or "reranker" or "eval" or "tracing", "framework", "decisions".

- [ ] **Step 1: Write content tests for 12.37**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("FrameworkChoice (12.37) content", () => {
  const fn = RagProduction.FrameworkChoice;

  it("sub=0 lists the 6 framework options", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no framework|raw SDK/i);
    expect(container.textContent).toMatch(/LlamaIndex/);
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Haystack/);
    expect(container.textContent).toMatch(/vendor SDK|OpenAI Agents|Anthropic/i);
  });

  it("sub=1 shows the framework decision matrix", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lock-?in/i);
    expect(container.textContent).toMatch(/churn|complexity/i);
    expect(container.textContent).toMatch(/community/i);
  });

  it("sub=2 gives an honest take on LangChain", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/deprecated|abstraction|churn/i);
  });

  it("sub=3 maps each framework to when it fits", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/team/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|Haystack/);
  });

  it("sub=4 shows the framework decision tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|LangGraph/);
  });

  it("sub=5 emphasizes framework-agnostic decisions", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/chunking|embedding|hybrid|reranker/i);
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/agnostic|same|replaceable/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "FrameworkChoice"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full FrameworkChoice chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Colors per sub-step (pink throughout, green for the agnostic core in sub=5).
- Brand names preserved as-is: LlamaIndex, LangChain, LangGraph, Haystack, OpenAI, Anthropic. These are official capitalizations, NOT title-case violations.
- The 6-option grid in sub=0 uses CSS grid `display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 12`.
- The decision matrix in sub=1 uses CSS grid with 6 columns + 5 rows; header row bold.
- The decision tree in sub=4 is an SVG with `<desc>`.
- Word "architect" forbidden - already covered by spec; verify the chapter text and "team" / "engineer" wording instead.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "FrameworkChoice"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

```json
{
  "id": "framework-decision-tree",
  "description": "Decision tree for choosing a RAG framework: starts with whether RAG is the primary feature, branches on team size, agent complexity, and provider lock-in to recommend one of six options."
}
```

Run:

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
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.37 Framework Choice"
```

---

### Task 11: Implement Chapter 12.38 RAGDecisionFrameworkCapstone

**Files:**
- Modify: `src/sections/rag-production.jsx` (replace stub `RAGDecisionFrameworkCapstone`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs)

**Chapter purpose (from spec + M6 guidance):** The FINAL chapter of Section 12. Synthesize every decision taught in chapters 12.1-12.37 into one decision framework, then walk through a complete end-to-end design for a NEW use case the learner has never seen: "Q&A over case law for a legal research firm". Every decision visible. Every choice grounded in a chapter they've read. The learner finishes the section able to do this design exercise themselves on any new domain.

This is a LARGE chapter (8-10 sub-steps acceptable per M6 guidance).

**Sub-step structure (10 sub-steps, 0-9):**

- **sub=0 (C.purple) - The complete RAG decision framework**
  Title: "The Complete RAG Decision Framework"
  Visual: a 9-row decision tree (SVG) covering every act of Section 12:
  - Row 1 ("Should I Use RAG At All?") - back-references 12.1 + 12.27 (long-context).
  - Row 2 ("How Do I Chunk?") - back-references 12.4 - 12.10 (chunking decision).
  - Row 3 ("Which Embedding + How Do I Index?") - back-references 12.11, 12.12, 12.13, 12.14.
  - Row 4 ("Do I Transform The Query?") - back-references 12.15 - 12.18.
  - Row 5 ("How Do I Pack Context + Generate?") - back-references 12.19, 12.20, 12.21.
  - Row 6 ("Do I Need Advanced Retrieval?") - back-references 12.22 - 12.27.
  - Row 7 ("How Do I Evaluate?") - back-references 12.28 - 12.32.
  - Row 8 ("How Do I Run Production?") - back-references 12.33 - 12.36.
  - Row 9 ("Which Framework?") - back-references 12.37.
  Each row a horizontal block; arrow down between rows. Each row uses a distinct color from the section palette (red for "should I use", cyan for chunking, purple for embedding, orange for query transform, yellow for context, blue for advanced, green for eval, pink for ops, indigo for framework).
  Below the diagram: a 1-line guide: "Every production RAG decision lives on this map. We'll walk it from top to bottom for one new use case."
  Key content: "decision framework" or "framework", at least 4 act names like "chunking", "embedding", "evaluat", "production".

- **sub=1 (C.red) - Capstone use case: legal Q&A**
  Title: "Capstone Use Case: Q&A Over Case Law"
  Visual: a "design brief" card:
  - Customer: a legal research firm.
  - Corpus: 200,000 published court cases across 50 US jurisdictions, each with text, jurisdiction tag, year, citation tree (cases citing this case, cases cited by this case).
  - Query examples:
    - "What's the precedent for tortious interference in California state court?"
    - "Cases citing Smith v Jones about negligence in medical contexts"
    - "How has the standard for qualified immunity evolved 2010-2025?"
  - Quality bar: a partner-lawyer reviewer must rate >= 4 / 5 on a legal-research rubric.
  - Latency budget: 5-10 seconds (legal research is patient).
  - Cost budget: $0.05 / query (legal work bills high).
  - Operational requirements: every answer cited; jurisdiction filter mandatory; auditable.
  Card uses `${C.red}06` background.
  Brief: "We'll walk every decision in the framework. Each choice points back to the chapter that taught it."
  Key content: "case law" or "legal" or "Q&A", "jurisdiction", "200,000" or "cases", "$0.05" or "cost", "citation" or "cited".

- **sub=2 (C.cyan) - Decision: chunking strategy**
  Title: "Decision 1: Chunking Strategy"
  Visual: a 3-column card showing the choice and reasoning:
  - Column 1 ("Choice"): hierarchical chunking + contextual retrieval (12.8 + 12.9).
  - Column 2 ("Why"): case opinions have natural hierarchy (intro, facts, reasoning, holding). Hierarchical preserves parent-child relationships; contextual retrieval injects "this paragraph is from case X about Y" preamble. Plain fixed-size chunking would mid-sentence-split a court's analysis.
  - Column 3 ("Tradeoff"): more storage (each chunk now has parent metadata); higher index build cost (contextual augmentation is an LLM call per chunk). Worth it because case-law precision demands citation-level retrieval.
  Each cell title-case, tinted background `${C.cyan}06`.
  Key content: "hierarchical" or "contextual", "12.8" or "12.9" or "Chapter 12.8" or back-reference, "chunking".

- **sub=3 (C.purple) - Decision: embedding + index**
  Title: "Decision 2: Embedding + Index"
  Visual: a 3-column card:
  - Column 1 ("Choice"): domain-adapted embedding (12.12) on top of a base legal-BERT or Cohere Embed Multilingual. HNSW index with hybrid (BM25 + dense, 12.13). Jurisdiction stored as filter metadata (Section 11.20). Re-rank with a cross-encoder cascade (12.14).
  - Column 2 ("Why"): general-purpose embeddings underweight legal jargon ("tortious", "qualified immunity"). Hybrid catches both exact-citation lookups ("Smith v Jones") and semantic queries ("medical negligence cases"). Jurisdiction filter eliminates 96% of irrelevant cases before reranking. Cross-encoder lifts precision on legal-language matching.
  - Column 3 ("Tradeoff"): domain-adapt requires labeled training pairs (expensive but one-time). Cross-encoder adds 50-100ms per query. Latency budget allows it.
  Each cell title-case, tinted background `${C.purple}06`.
  Key content: "domain[- ]adapt", "hybrid", "jurisdiction" or "filter", "rerank" or "cross-encoder", "12.12" or "12.13" or "12.14" or back-references.

- **sub=4 (C.orange) - Decision: query transformation**
  Title: "Decision 3: Query Transformation"
  Visual: a 3-column card:
  - Column 1 ("Choice"): multi-query expansion (12.17) + decomposition for complex multi-hop queries (12.18). HyDE skipped (case law is precise; fake document hurts more than helps).
  - Column 2 ("Why"): a query like "cases citing X about Y" naturally decomposes into "find X" -> "find cases citing X" -> "filter for cases about Y". Multi-query rewriting (legal synonyms: "negligence" / "duty of care" / "breach of duty") improves recall on lexically-narrow legal language.
  - Column 3 ("Tradeoff"): more retrievals per query (3-5x). Cost goes up linearly. Mitigated by aggressive deduplication after RRF merge.
  Each cell title-case, tinted background `${C.orange}06`.
  Key content: "multi-query" or "decomposition", "HyDE" (the skip reasoning), "12.17" or "12.18" or back-references.

- **sub=5 (C.yellow) - Decision: context + generation**
  Title: "Decision 4: Context Packing And Generation"
  Visual: a 3-column card:
  - Column 1 ("Choice"): high token budget (16-30k tokens of retrieved context per query). Relevance-first ordering with sandwich pattern (12.19) to fight lost-in-middle (12.20). Mandatory inline citations via prompt template (12.21). I-don't-know clause if no jurisdiction-matching cases.
  - Column 2 ("Why"): legal work needs many cases to reason across. Token budget high because cost budget is high. Sandwich (place top hits at start AND end) anchors model attention. Citation mandatory for audit. Refusal preferable to fabrication.
  - Column 3 ("Tradeoff"): higher per-query LLM cost. Accepted given $0.05 budget.
  Below: a styled prompt-template artifact block showing the actual generation template:

```
System: You are a legal research assistant. Cite every case you reference
using [Case Name, Year] format. Only use the provided cases. If no
provided case answers, say "I don't have case law for this question in
the provided jurisdiction".

Provided Cases:
[Case A] {summary + key holdings}
...
[Case J] {summary + key holdings}

Question: {user question}
Jurisdiction: {jurisdiction}
Answer:
```

  Style: monospace 14-16px, tinted `${C.yellow}06`. Title says "Capstone Prompt Template".
  Key content: "citation" or "cite" or "[case", "token budget" or "16k" or "30k", "12.19" or "12.20" or "12.21" or back-references, "I don't have" or refusal language.

- **sub=6 (C.blue) - Decision: advanced patterns**
  Title: "Decision 5: Advanced Retrieval Patterns"
  Visual: a 3-column card:
  - Column 1 ("Choice"): GraphRAG (12.25) for the case-citation graph (cases citing X / cases cited by X). Multi-hop retrieval (12.22) for "cases citing X about Y" decomposition. Long-context skipped (12.27) - 200k cases > any context window, RAG mandatory.
  - Column 2 ("Why"): legal citation is a graph; GraphRAG indexes the relationships. Without it, "cases citing X" requires querying every case in the corpus. With it, follow the citation edges. Multi-hop chains the steps for complex precedent queries.
  - Column 3 ("Tradeoff"): GraphRAG indexing is 10x slower than vector-only. Re-indexing the citation graph on corpus update is a nightly batch. Multi-hop is slower per query but precision gain on multi-hop queries is large.
  Each cell title-case, tinted background `${C.blue}06`.
  Key content: "GraphRAG", "multi-hop", "12.22" or "12.25" or "12.27" or back-references, "citation graph" or "graph".

- **sub=7 (C.green) - Decision: evaluation**
  Title: "Decision 6: Evaluation"
  Visual: a 3-column card:
  - Column 1 ("Choice"): LLM-as-judge (12.29) with a legal-specific rubric. Golden dataset (12.31) of 500 partner-curated query/expected-answer pairs. RAGAS metrics (12.30): faithfulness, citation precision, jurisdiction match. Online A/B (12.32) on partner-rated 4/5 score.
  - Column 2 ("Why"): general-purpose RAG eval misses legal correctness. Partner-curated golden set is the ground truth because no automated metric reaches partner-quality. RAGAS faithfulness catches hallucinations. Citation precision (% of cited cases that are real and on-point) is critical.
  - Column 3 ("Tradeoff"): golden dataset is expensive to build (partner hours). 500 examples covers ~80% of query distribution; remaining 20% caught by online feedback. Rerun golden eval weekly on prod.
  Each cell title-case, tinted background `${C.green}06`.
  Key content: "LLM-as-judge", "golden dataset" or "golden", "RAGAS" or "faithfulness", "12.29" or "12.30" or "12.31" or back-references.

- **sub=8 (C.pink) - Decision: production operations**
  Title: "Decision 7: Production Operations"
  Visual: a 3-column card:
  - Column 1 ("Choice"): semantic cache DISABLED (legal queries are too unique; false-hit risk too high). Prompt cache ENABLED for system prompt + few-shot examples (12.33). Full tracing per query (12.35). Hallucination detection with custom legal-fact-check post-process (12.36). Drift monitoring on case-law updates (re-embed on new case ingestion).
  - Column 2 ("Why"): semantic cache fails when "negligence in CA" and "negligence in NY" cosine to 0.96 - the answers differ entirely. Prompt cache safe because system + few-shot are constant. Tracing every query is non-negotiable for audit.
  - Column 3 ("Tradeoff"): no semantic cache = higher per-query cost. Mitigated by prompt cache. Drift monitoring catches when judicial reasoning shifts (rare but high-impact).
  Each cell title-case, tinted background `${C.pink}06`.
  Key content: "semantic cache" or "disabled" or "off", "prompt cache" or "enabled", "tracing", "12.33" or "12.35" or "12.36" or back-references.

- **sub=9 (C.purple) - The complete picture + framework choice + final summary**
  Title: "Putting It All Together: The Capstone Stack"
  Visual: a single capstone card showing the entire stack labeled with the section color (`#7c4dff`):
  - Layer 1 ("Ingest"): hierarchical + contextual chunking; domain-adapted embedding; HNSW + BM25 hybrid index; jurisdiction metadata; case-citation graph index.
  - Layer 2 ("Retrieve"): multi-query expansion; jurisdiction filter; hybrid retrieval; cross-encoder rerank; GraphRAG for citation queries.
  - Layer 3 ("Generate"): 16-30k token budget; sandwich ordering; mandatory citations; I-don't-know refusal.
  - Layer 4 ("Eval"): partner-curated golden set; LLM-as-judge with legal rubric; RAGAS faithfulness; online A/B.
  - Layer 5 ("Ops"): prompt cache; full tracing; hallucination detection; drift monitoring on case-law updates.
  - Framework choice: no framework + LlamaIndex retriever for the RAG core (12.37); raw Anthropic SDK for generation.
  - Cost projection: ~$0.04 / query (under budget); latency: ~6 seconds (within budget); audit: every answer carries [Case Name, Year] citations.
  Below: a final closing message: "You now have everything you need to design production-grade RAG for any new domain. Every choice on this stack maps to a chapter you've worked through. Apply this framework. Adjust per use case. Build."
  Key content: "stack" or "putting it all together" or "capstone", "no framework" or "LlamaIndex" or "12.37", at least 4 of: "chunking" / "embedding" / "retrieval" / "rerank" / "generate" / "eval" / "production".

- [ ] **Step 1: Write content tests for 12.38**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("RAGDecisionFrameworkCapstone (12.38) content", () => {
  const fn = RagProduction.RAGDecisionFrameworkCapstone;

  it("sub=0 shows the complete decision framework spanning every act", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/chunking/i);
    expect(container.textContent).toMatch(/embedding|embed/i);
    expect(container.textContent).toMatch(/evaluat|eval/i);
    expect(container.textContent).toMatch(/production|operations/i);
  });

  it("sub=1 introduces the legal case-law capstone", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/case law|legal|Q&A/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/200,?000|cases/i);
    expect(container.textContent).toMatch(/\$0?\.05|cost/i);
  });

  it("sub=2 chooses hierarchical + contextual chunking", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical|contextual/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/12\.[89]/);
  });

  it("sub=3 chooses domain-adapted embedding + hybrid + jurisdiction filter + cross-encoder rerank", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/domain[- ]adapt/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/rerank|cross-encoder/i);
  });

  it("sub=4 chooses multi-query + decomposition, skips HyDE", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-query|decomposition/i);
    expect(container.textContent).toMatch(/HyDE/);
    expect(container.textContent).toMatch(/12\.1[78]/);
  });

  it("sub=5 chooses high-token-budget sandwich pack + mandatory citations + refusal", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/token budget|16k|30k|context/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/I don'?t have|refusal|refuse/i);
  });

  it("sub=6 chooses GraphRAG + multi-hop, skips long-context", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/GraphRAG/);
    expect(container.textContent).toMatch(/multi-hop/i);
    expect(container.textContent).toMatch(/long[- ]context|12\.27/i);
  });

  it("sub=7 chooses LLM-as-judge + golden dataset + RAGAS + online A/B", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/LLM-as-judge|judge/i);
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/RAGAS|faithfulness/i);
  });

  it("sub=8 disables semantic cache, enables prompt cache + tracing + hallucination detection + drift", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/prompt cache/i);
    expect(container.textContent).toMatch(/tracing/i);
    expect(container.textContent).toMatch(/hallucinat|drift/i);
  });

  it("sub=9 closes with the complete capstone stack and framework choice", () => {
    const { container } = render(fn(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/stack|capstone|putting it all together/i);
    expect(container.textContent).toMatch(/no framework|LlamaIndex|12\.37/i);
    expect(container.textContent).toMatch(/chunking|embedding|retrieval|rerank|generate|eval/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RAGDecisionFrameworkCapstone"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full RAGDecisionFrameworkCapstone chapter**

Replace the stub. Required (in addition to the standard rules from Task 6):

- 10 sub-steps total (sub >= 0 through sub >= 9). This IS a large chapter; that is intentional per the M6 capstone guidance.
- Colors per sub-step as specified (purple for framework / synthesis, then a different color per decision matching the per-act palette: red for use case, cyan for chunking, purple for embedding, orange for query transform, yellow for context, blue for advanced, green for eval, pink for ops, purple for the closing stack).
- The framework decision tree in sub=0 is an SVG with `<desc>` first child.
- The prompt-template artifact in sub=5 is a styled monospace block (NOT a code block), tinted `${C.yellow}06`. Title "Capstone Prompt Template".
- The capstone stack in sub=9 is a stacked-card visual (CSS grid, vertical), not an SVG, because it's effectively a card column with 5 layer cards.
- Each "Decision X" sub-step (2-8) uses a 3-column CSS grid `display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 12` with columns titled "Choice", "Why", "Tradeoff".
- Back-references to other chapters use the format "12.X" or "Chapter 12.X" or "(12.X)" - never "next chapter" / "coming up" / "preview".
- No em-dashes.
- Word "architect" forbidden.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RAGDecisionFrameworkCapstone"
```

Expected: PASS.

- [ ] **Step 5: Add SVG descriptions**

```json
{
  "id": "rag-decision-framework-tree",
  "description": "Nine-row decision tree spanning every act of Section 12: should I use RAG, how to chunk, embedding and index, query transformation, context and generation, advanced patterns, evaluation, production ops, and framework choice."
}
```

Run:

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

Expected: all green. Section 12 now has all 38 chapters live.

- [ ] **Step 7: Commit**

```bash
git add src/sections/rag-production.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Implement chapter 12.38 The Complete RAG Decision Framework + Capstone"
```

---

### Task 12: Update CLAUDE.md - final Section 12 mapping table and project structure

**Files:**
- Modify: `CLAUDE.md`

After M5 shipped, CLAUDE.md should already have mapping rows for 12.1-12.32 (added incrementally in M1-M5). Task 12 finalizes the table to all 38 chapters and updates the project structure tree to include all five `rag-*.jsx` files.

- [ ] **Step 1: Replace the Section 12 mapping with the final 38-chapter table**

In `CLAUDE.md`, find the "Complete Mapping" section. The Section 12 table currently lists 12.1-12.32 (M1-M5 added them incrementally). Replace the entire Section 12 mapping block with:

```markdown
**Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` + `rag-retrieval.jsx` + `rag-generation.jsx` + `rag-evaluation.jsx` + `rag-production.jsx`)

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
| 12.19 | ContextPacking | Context Packing |
| 12.20 | LostInTheMiddle | The Lost-in-the-Middle Problem |
| 12.21 | CitationsRefusal | Citations, Refusal & Groundedness |
| 12.22 | MultiHopRetrieval | Multi-Hop Retrieval |
| 12.23 | SelfRAG | Self-RAG |
| 12.24 | CorrectiveRAG | CRAG - Corrective RAG |
| 12.25 | GraphRAG | GraphRAG (Microsoft 2024) |
| 12.26 | AgenticRAG | Tool-Augmented & Agentic RAG |
| 12.27 | LongContextVsRAG | Long-Context vs RAG |
| 12.28 | RAGEvalTriangle | The RAG Eval Triangle |
| 12.29 | LLMAsJudge | LLM-as-Judge |
| 12.30 | RAGASMetrics | RAGAS Metrics |
| 12.31 | GoldenDatasets | Golden Datasets |
| 12.32 | OnlineEvalABTesting | Online Eval & A/B Testing |
| 12.33 | Caching | Caching - Prompt + Semantic |
| 12.34 | CostModels | Cost Models |
| 12.35 | ObservabilityTracing | Observability & Tracing |
| 12.36 | HallucinationDrift | Hallucination Detection & Drift |
| 12.37 | FrameworkChoice | Framework Choice |
| 12.38 | RAGDecisionFrameworkCapstone | The Complete RAG Decision Framework + Capstone |
```

- [ ] **Step 2: Update the project structure tree**

Find the `## Project Structure` section. In the `src/sections/` block, the M5 state has four `rag-*.jsx` files. Add `rag-production.jsx` after `rag-evaluation.jsx`:

```
│       ├── vector-systems.jsx            # Section 11 (Act 6, chapters 11.29-11.35)
│       ├── rag-foundations.jsx           # Section 12 (Acts 1+2, chapters 12.1-12.10)
│       ├── rag-retrieval.jsx             # Section 12 (Acts 3+4, chapters 12.11-12.18)
│       ├── rag-generation.jsx            # Section 12 (Acts 5+6, chapters 12.19-12.27)
│       ├── rag-evaluation.jsx            # Section 12 (Act 7, chapters 12.28-12.32)
│       └── rag-production.jsx            # Section 12 (Acts 8+9, chapters 12.33-12.38)
```

- [ ] **Step 3: No test required for CLAUDE.md (it's documentation only)**

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "Finalize Section 12 mapping with all 38 chapters in CLAUDE.md"
```

---

### Task 13: Update CLAUDE.md visual rules - apply title-case-for-diagram-box-text globally

**Files:**
- Modify: `CLAUDE.md`

Per the spec's flagged update: "The 'title-case for diagram box text' rule (every word capitalized in diagram boxes) is stricter than the current CLAUDE.md rule (first letter of line/cell). After Section 12 ships, update CLAUDE.md to align - either add the stricter rule globally or carve out diagram-box-text as a special case."

We apply it globally as a strengthened diagram rule, while leaving the existing "first letter of line" rule in place for non-diagram contexts (paragraph text, monospace formula lines, etc).

- [ ] **Step 1: Find the existing "Capitalize first letter" rule**

In `CLAUDE.md`, find the rule that starts with `**Capitalize first letter of every visible text fragment**`. This is in the "Visual Design Rules - MANDATORY" section, roughly around line 467-478.

- [ ] **Step 2: Add the stricter title-case-for-diagram-box-text rule immediately AFTER the existing rule**

Insert a new bullet right after the "Capitalize first letter" rule (before the "SVG diagrams must be horizontally centered" rule):

```markdown
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
```

- [ ] **Step 3: Verify no other visual rule contradicts the new addition**

Skim the rest of the Visual Design Rules section to confirm consistency. The existing "Capitalize first letter" rule stays in place for non-diagram contexts.

- [ ] **Step 4: No test required for CLAUDE.md (documentation only)**

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "Apply title-case-for-diagram-box-text rule globally in CLAUDE.md"
```

---

### Task 14: Final discoverability sync - llms.txt and index.html JSON-LD

**Files:**
- Modify: `public/llms.txt`
- Modify: `index.html`

Section 12 has been incrementally referenced in `public/llms.txt` and `index.html` since M1. M6 finalizes both files with the full Section 12 description reflecting all 38 chapters.

- [ ] **Step 1: Inspect current state of llms.txt**

```bash
cat public/llms.txt
```

Identify the Section 12 entry. M1 added a short description; M2-M5 may have appended detail. M6 replaces it with the final version.

- [ ] **Step 2: Update llms.txt with the final Section 12 description**

Edit `public/llms.txt`. Replace the existing Section 12 line in the "What it covers" section with the comprehensive final version:

```
- Section 12: Retrieval-Augmented Generation - 38 chapters covering the full production RAG pipeline. The RAG problem (why bare LLMs aren't enough, the canonical pipeline, where naive RAG breaks). Chunking strategies (fixed-size, recursive structural, semantic, late chunking, hierarchical, contextual retrieval, decision matrix). Embed + index choices for RAG (embedding model picking, domain adaptation, hybrid retrieval, reranker cascade). Query transformation (why transform, HyDE, multi-query expansion, routing + decomposition). Context + generation (packing strategies, lost-in-the-middle, citations + refusal + groundedness). Advanced retrieval patterns (multi-hop, Self-RAG, CRAG, GraphRAG, agentic / tool-augmented, long-context vs RAG). Evaluation (the RAG eval triangle, LLM-as-judge, RAGAS metrics, golden datasets, online + A/B testing). Production operations (prompt + semantic caching, cost models, observability + tracing, hallucination detection + drift, framework choice across no-framework / LlamaIndex / LangChain / LangGraph / Haystack / vendor SDK). Decision framework + capstone (synthesizing every decision and walking through a complete legal-case-law RAG design end-to-end).
```

(Adjust phrasing to match the existing `llms.txt` style if it uses a different format like bullet lists for sub-sections.)

- [ ] **Step 3: Inspect current state of index.html**

```bash
grep -A 20 'application/ld+json' index.html | head -50
```

Locate the `teaches` array.

- [ ] **Step 4: Verify "Retrieval-Augmented Generation" is in the teaches array**

If "Retrieval-Augmented Generation" is already in the array (added in M1), no change needed. If only a stub or shorter form is present, normalize to "Retrieval-Augmented Generation".

The final teaches array should include (in addition to the existing entries from Sections 1-11):

```json
"teaches": [
  "Neural Network Foundations",
  "How LLMs Actually Train",
  "Scaling & Modern Techniques",
  "The Road to Transformers",
  "Transformer Input Pipeline",
  "Attention - Understanding Q, K, V",
  "Attention - The Full Computation",
  "The Encoder",
  "The Decoder",
  "Modern LLM Techniques",
  "Vector Databases",
  "Retrieval-Augmented Generation"
]
```

(Match the actual existing format - the keys and surrounding fields. Only verify the Section 12 entry is present and well-formed.)

- [ ] **Step 5: Verify HTML and JSON still valid (build smoke test)**

```bash
npm run build
```

Expected: build succeeds. No JSON-LD parse error.

- [ ] **Step 6: Commit**

```bash
git add public/llms.txt index.html
git commit -m "Finalize discoverability sync for Section 12 (all 38 chapters)"
```

- [ ] **Step 7: Plan a reminder to user (for end-of-task summary)**

After M6 ships, remind the user (one sentence at the end of the M6 final summary) to request re-indexing in Google Search Console (URL Inspection -> Request indexing) and Bing Webmaster Tools (URL Submission). This is per the discoverability sync rule in CLAUDE.md.

---

### Task 15: Final M6 + Section 12 verification

**Files:** none (verification only); may require Bash returns to fix issues found.

This is the MANDATORY validation gate from the spec. A chapter that passes tests but fails Chrome validation is NOT done. Section 12 is not done until all 38 chapters pass Chrome validation - we spot-check across milestones.

- [ ] **Step 1: Full test suite**

```bash
npm run test
```

Expected: all tests pass. No regressions across Sections 1-11 or Section 12 M1-M5.

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

- [ ] **Step 6: Boot dev server**

```bash
npm run dev
```

Server should start at `http://localhost:5173/learn-ai/`. Leave it running for the rest of this task.

- [ ] **Step 7: Chrome visual validation of all 6 new chapters (12.33-12.38)**

Use the `mcp__claude-in-chrome__*` tools. For each of the 6 new chapters, step through every sub-step and check:

  - **No overlapping elements** - cards, boxes, text, SVGs do not overlap.
  - **Diagrams horizontally + vertically centered** within their containers.
  - **Title-case for diagram box text** - every word capitalized inside boxes (per Task 13 stricter rule).
  - **First letter of every line capitalized** - bullets, table cells, formula lines.
  - **All Box elements have real colors** (no `C.card` showing as gray-on-dark).
  - **Standalone formulas centered** with `textAlign: "center"`.
  - **No em-dashes** anywhere.
  - **No "next chapter" / "coming up"** language.

Pay special attention to:
- **12.33 sub=1**: prompt cache prefix / suffix split clearly visible with distinct background tints.
- **12.33 sub=3**: semantic cache flow diagram with cosine scores readable.
- **12.34 sub=1**: cost stack bar chart proportions visually match the percentages stated.
- **12.34 sub=5**: cost-vs-quality scatter has Pareto frontier clearly marked.
- **12.35 sub=1**: span tree with proportional latency widths.
- **12.36 sub=4**: alert payload is a styled monospace block, not a code block.
- **12.37 sub=4**: framework decision tree branches readable, leaf labels clear.
- **12.38 sub=0**: 9-row decision framework tree visible end-to-end without scroll-hunting.
- **12.38 sub=5**: capstone prompt template artifact styled monospace, not code.
- **12.38 sub=9**: full stack card has all 5 layers visible, no overlap, framework choice noted.

Take screenshots of each chapter at each sub-step for reference. Save them in `docs/superpowers/screenshots/section-12-m6/` (create the directory if needed):

```bash
mkdir -p docs/superpowers/screenshots/section-12-m6
```

- [ ] **Step 8: Spot-check 5 prior Section 12 milestones still work**

Don't re-validate every prior chapter (that's been done in M1-M5). Instead, spot-check one chapter from each prior milestone to confirm no regression:

- M1 spot-check: navigate to 12.2 (NaiveRAGPipeline), step through all sub-steps, verify the pipeline diagram still renders correctly and no console errors.
- M2 spot-check: navigate to 12.9 (ContextualRetrieval), verify hierarchical chunking diagram still renders.
- M3 spot-check: navigate to 12.14 (RerankerCascade), verify reranker cascade diagram still renders.
- M4 spot-check: navigate to 12.25 (GraphRAG), verify entity-relationship subgraph renders.
- M5 spot-check: navigate to 12.30 (RAGASMetrics), verify the 4 RAGAS metric formulas + worked examples render.

If any prior chapter has regressed (visual defect or test failure), STOP and fix before continuing.

- [ ] **Step 9: Verify TOC shows all of Section 12**

In Chrome, navigate to the TOC. Confirm Section 12 lists 38 chapters (12.1 through 12.38). Confirm the section color is `#7c4dff`. Confirm all chapter titles are correct.

- [ ] **Step 10: Stop dev server**

Ctrl-C in the dev-server terminal.

- [ ] **Step 11: If any visual defect found during Steps 7-9**

Document the defect (chapter, sub-step, what's wrong). Fix in the chapter source file. Re-run `npm run test` and `npm run lint`. Re-validate the affected chapter in Chrome. Once green, return to Step 1 of this task and re-run the verification cascade.

- [ ] **Step 12: Commit screenshots (optional)**

If screenshots were saved:

```bash
git add docs/superpowers/screenshots/section-12-m6/
git commit -m "Add Section 12 M6 visual validation screenshots"
```

- [ ] **Step 13: Confirm M6 + Section 12 success criteria are met**

Verify the spec's overall Section 12 success criteria:

- [x] All 38 chapters implemented and in config.js.
- [x] Each chapter exported from one of 5 section files (rag-foundations, rag-retrieval, rag-generation, rag-evaluation, rag-production).
- [x] Section 12 loader is a 5-file Promise.all in learn-ai.jsx.
- [x] sections.test.jsx contains tests for every chapter at every sub-level.
- [x] `npm run test` green, coverage 100% lines, branches >= 97.7%.
- [x] `npm run lint` clean, `npm run format` clean.
- [x] Every SVG has `<desc>` + entry in `svg-descriptions.json`.
- [x] CLAUDE.md mapping table covers all 38 chapters (Task 12).
- [x] CLAUDE.md visual rules updated to apply title-case-for-diagram-box-text globally (Task 13).
- [x] `public/llms.txt` updated with the final Section 12 description (Task 14).
- [x] `index.html` JSON-LD `teaches` array includes "Retrieval-Augmented Generation" (Task 14).
- [x] Chrome browser visual review of all 6 new chapters passed (Step 7).
- [x] Spot-checks of M1-M5 chapters confirm no regression (Step 8).

Section 12 is complete.

---

### Task 16: Section 12 milestone marker commit + user reminders

**Files:** none (commit only)

- [ ] **Step 1: Check working tree is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`. All M6 work has been committed in tasks 2-15.

- [ ] **Step 2: Verify git log**

```bash
git log --oneline -20
```

Expected: a clean sequence of M6 commits:
1. Add stub exports for rag-production.jsx (12.33-12.38)
2. Extend Section 12 loader to include rag-production.jsx
3. Add chapter entries 12.33-12.38 to config
4. Register RagProduction in sections.test lookup
5. Implement chapter 12.33 Caching
6. Implement chapter 12.34 Cost Models
7. Implement chapter 12.35 Observability & Tracing
8. Implement chapter 12.36 Hallucination Detection & Drift
9. Implement chapter 12.37 Framework Choice
10. Implement chapter 12.38 The Complete RAG Decision Framework + Capstone
11. Finalize Section 12 mapping with all 38 chapters in CLAUDE.md
12. Apply title-case-for-diagram-box-text rule globally in CLAUDE.md
13. Finalize discoverability sync for Section 12 (all 38 chapters)
14. (Optional) Add Section 12 M6 visual validation screenshots

- [ ] **Step 3: Push to main**

Per branch policy, M6 commits land on `main`. If a deploy is wanted, push:

```bash
git push origin main
```

GitHub Actions will deploy automatically.

- [ ] **Step 4: Remind user of post-deploy actions**

When delivering the final M6 summary to the user, include these reminders (per the discoverability sync rule in CLAUDE.md):

> Section 12 is live. Two reminders:
>
> 1. **Request re-indexing in Google Search Console**: URL Inspection -> Request indexing for the site URL. This nudges Google to re-crawl and pick up the updated `llms.txt`, JSON-LD, and the new Section 12 chapters.
> 2. **Submit URL in Bing Webmaster Tools**: URL Submission -> submit the site URL so Bing re-indexes too.

- [ ] **Step 5: Final M6 done message**

Confirm: "Section 12 Milestone 6 complete. All 38 chapters of Retrieval-Augmented Generation are live. CLAUDE.md mapping and visual rules updated. Discoverability metadata fully synced. The learn-ai app now ships 12 sections covering the full path from neural network foundations to production RAG."

---

### Task 17: Section 12 Retrospective

**Files:**
- Create: `docs/superpowers/lessons/section-12-m6-lessons.md`
- Create: `docs/superpowers/lessons/section-12-retrospective.md`

This is the FINAL milestone of Section 12. Do a retrospective on the whole section (not just M6) so future sections benefit.

- [ ] **Step 1: M6 lessons capture (5-10 minutes)**

Create `docs/superpowers/lessons/section-12-m6-lessons.md` with the same 3-5 honest bullet observations format used in prior milestone refinement checkpoints. Specific to M6's 6 chapters and the capstone walkthrough.

- [ ] **Step 2: Section-wide retrospective (15-20 minutes)**

Create `docs/superpowers/lessons/section-12-retrospective.md` with these sections:

````markdown
# Section 12 (RAG) - Retrospective

## What worked

- Visual patterns that landed cleanly across many chapters
- Task structures that minimized rework
- Sub-step pacing that learners would find compelling
- Test patterns that caught real bugs
- Section 11 back-reference treatment

## What did not work / what slowed us down

- Patterns we tried that needed multiple rounds in Chrome
- Test patterns that were too brittle or too loose
- Sub-step structures that fragmented a single idea
- Visual rules that were easy to violate
- Coordination / handoff friction between milestones

## What I would do differently next time

- For the spec phase (brainstorming -> design doc)
- For the plan phase (plan writing -> bite-sized tasks)
- For the execution phase (subagent dispatch, review cadence)

## Suggested backlog (what comes after Section 12)

- User-feedback collection on Section 12 specifically
- A/B testing chapter ordering (e.g., does eval-first work better than eval-late?)
- Observability of the learn-ai app itself (which chapters get most read, where users drop)
- Visual-rule enforcement automation (linter for diagram-box title-case, overlap detection)
- Cross-section integration (do back-references work? are prerequisite chapters being read?)

## Metrics

- Total chapters shipped: 38
- Total milestone plans: 6
- Total lines of plan documentation: ~12k
- Total chapter implementation tasks: ~45 (3+7+8+9+5+6 + infrastructure)
- Date span (start of M1 to end of M6): [fill at completion]
````

Fill in real observations - this is the document that informs the next big section's planning.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/lessons/section-12-m6-lessons.md docs/superpowers/lessons/section-12-retrospective.md
git commit -m "Section 12 M6 lessons + section-wide retrospective"
```

- [ ] **Step 4: Section 12 fully complete.** 38 chapters shipped. 6 milestones done. Ready for next section (or stable shipping if no next section planned).

---

## What Comes Next

Section 12 is complete. With 38 chapters of production RAG content live, the learn-ai app now covers:

| Section | Topic | Chapters |
|---|---|---|
| 1 | Neural Network Foundations | 26 |
| 2 | How LLMs Actually Train | 10 |
| 3 | Scaling & Modern Techniques | 6 |
| 4 | The Road to Transformers | 4 |
| 5 | Transformer Input Pipeline | 9 |
| 6 | Attention - Understanding Q, K, V | 12 |
| 7 | Attention - The Full Computation | 16 |
| 8 | The Encoder | 9 |
| 9 | The Decoder | 7 |
| 10 | Modern LLM Techniques | 4 |
| 11 | Vector Databases | 36 |
| 12 | Retrieval-Augmented Generation | 38 |

### Suggested backlog after Section 12

These are NOT required for M6 completion. They are candidate next workstreams the user may want to pick up:

- **User feedback gathering**: instrument the app to collect anonymous "was this chapter helpful?" feedback at chapter end. Use that signal to identify chapters that consistently confuse learners and re-design them.
- **A/B testing chapter ordering**: try alternate chapter orderings (e.g., chunking before pipeline, or eval before ops) on cohorts and measure completion rates. Some current orderings are intuition; data could improve them.
- **Observability of learn-ai itself**: add lightweight tracing of chapter views, sub-step progressions, time-on-page. Identify where learners drop off and use it to drive the next round of content improvements.
- **Section 13 candidate topics** (if a new section is wanted):
  - "Multi-Modal Models" (vision + text + audio joint embedding, CLIP extended, modern multi-modal architectures).
  - "Mechanistic Interpretability" (probing, circuits, sparse autoencoders, feature attribution).
  - "Inference Optimization" (KV cache deep dive, speculative decoding, batching strategies, FlashAttention, paged attention - some already in Section 10 but room for depth).
  - "RAG at Web Scale" - federated retrieval across many indexes, real-time index updates, distributed RAG infrastructure (would build on Section 11.22-11.23 sharding/replication and Section 12 ops chapters).
- **App quality improvements**:
  - Search overlay improvements (multi-modal search across SVG descriptions + chapter text + section names).
  - Bookmark / progress-tracking features.
  - Light-theme variant.
  - Mobile responsiveness audit (some SVG diagrams may be cramped on small viewports).
  - Accessibility audit (keyboard nav, screen reader semantics, color contrast).
- **Content polish pass**:
  - Walk every chapter and apply the new title-case-for-diagram-box-text rule retroactively across Sections 1-11 (where it strengthens the previous rule).
  - Audit every chapter for "architect" word and replace if found.
  - Audit every chapter for em-dashes and replace with hyphens.

The user picks the priority. M6 only commits to "Section 12 complete + discoverability synced + CLAUDE.md visual rule update applied".
