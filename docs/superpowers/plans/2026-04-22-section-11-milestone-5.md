# Section 11 Milestone 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 5 of Section 11 "Vector Databases" - the ten Production Realities chapters (11.19 Filtering through 11.28 CapacityPlanning). These live in a NEW file `src/sections/vector-production.jsx`. At the end of this milestone the app ships with 28 navigable chapters in Section 11 (11.1 through 11.28), completing Acts 1-5 of the section arc.

**Architecture:** Create a new section file `src/sections/vector-production.jsx` and register it in `learn-ai.jsx` so Section 11 now loads THREE files via Promise.all: `vector-foundations.jsx` (11.1-11.11), `vector-compression.jsx` (11.12-11.18), and `vector-production.jsx` (11.19-11.28). Each chapter follows the established learn-ai pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete running-example content (cat corpus + real system names).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md` - chapters 11.19 through 11.28, Act 5 Production Realities.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-04-22-section-11-milestone-3.md` - most relevant prior plan (same "new file + loader update + lookup.test.js update" pattern, 5 chapters).
- `docs/superpowers/plans/2026-04-22-section-11-milestone-4.md` - the most recently executed plan; the running example file `vector-compression.jsx` now holds 11.12-11.18 for reference patterns (tinted cards, SVG `<desc>` tags, recall tables, two-column grids).

---

## Prerequisites

- Branch `section-11-vector-databases` checked out, clean. HEAD after Milestone 4 = `c3c4a87 Update CLAUDE.md with chapters 11.17-11.18`.
- Milestones 1-4 merged on the branch: 11.1-11.18 exported across `vector-foundations.jsx` (11.1-11.11) + `vector-compression.jsx` (11.12-11.18).
- CLAUDE.md Section 11 mapping currently shows 11.1-11.18; this milestone extends it to 11.1-11.28 and the milestones-of-6 annotation to "1-5 of 6".
- All 1,916 tests currently pass. Coverage for `vector-compression.jsx` is 100% lines / 100% branches.
- `src/learn-ai.jsx` Section 11 loader currently imports vector-foundations + vector-compression; this milestone adds vector-production as the third member of the Promise.all.
- `src/__tests__/sections.test.jsx` and `src/__tests__/lookup.test.js` already import both existing Section 11 files; both need a new `import * as VectorProduction` and a spread-into-lookup line.

## File Structure

### New files
- `src/sections/vector-production.jsx` - Act 5 chapter functions (10 exports: Filtering, UpdatesDeletes, Sharding, Replication, HybridSearch, Rerankers, MultiVectorRetrieval, EmbeddingLifecycle, Observability, CapacityPlanning). Estimated file size: 5,000-7,000 lines (10 chapters x ~600 lines avg).

### Modified files
- `src/config.js` - append 10 entries to `chapters[]` after `{ id: "11.18", ... HNSWPQ }`.
- `src/learn-ai.jsx` - extend the Section 11 loader Promise.all to include `vector-production.jsx`.
- `src/__tests__/lookup.test.js` - add `import * as VectorProduction from "../sections/vector-production.jsx"` and spread into the lookup object.
- `src/__tests__/sections.test.jsx` - add the same import + spread, then append content-test blocks for each new chapter (59 sub-step tests total).
- `src/__tests__/config.test.js` - extend the Section 11 test from 18 to 28 entries.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` with 11.19 through 11.28 (only chapters that actually render SVGs - see Task 13).
- `src/data/svg-descriptions.json` - add entries keyed by each new chapter id (estimated 25-45 SVGs across ten chapters).
- `CLAUDE.md` - extend Section 11 mapping table to 28 rows, update milestones annotation to "1-5 of 6", update project-structure tree to list the new file.

### Unchanged
- `src/sections/vector-foundations.jsx` (stable since Milestone 2).
- `src/sections/vector-compression.jsx` (stable since Milestone 4).
- `src/components.jsx`, all pre-Section-11 section files.

---

## Running example

Continue the cat-corpus + production-scale numbers established in prior milestones:

- **d = 768** (canonical scale dim).
- **N scale anchors:** 1M, 100M, 1B.
- **float32 baseline** 3 KB/vector; HNSW overhead ~100 bytes/vector; PQ at m=96 96 bytes/vector.
- **IVF nlist &asymp; sqrt(N)**; nprobe defaults to 8.
- **HNSW defaults:** M = 16, ef_construction = 200, ef_search = 50.

New numbers introduced in Act 5 (each used in one chapter; listed here to keep them consistent across chapters in case they are cross-referenced):

- **Filtering selectivity bands** (11.19): tight = 0.1% pass, medium = 5%, loose = 50%, universal = 100% (no filter).
- **Delete-rate degradation curve** (11.20): 10% &rarr; recall drops 0.5%; 30% &rarr; 3%; 50% &rarr; 8%.
- **Sharding numbers** (11.21): per-shard top-k = 10, shard count = 8, merged top-k = 10. Random vs. semantic (IVF cluster = shard).
- **Replication lag** (11.22): leader-follower typical lag 50 ms to 2 s; WAL recovery vs. re-embed-from-source.
- **RRF k-constant** (11.23): k = 60 (standard). Formula: `score(d) = Sum over rankers of 1 / (k + rank_r(d))`.
- **Reranker latency** (11.24): cross-encoder 1 ms/pair on GPU, 100 pairs &asymp; 100 ms. Cohere Rerank, BGE-reranker, MS-MARCO cross-encoders.
- **ColBERT multi-vector** (11.25): tokens/doc &asymp; 200, so 20-100x storage vs single-vector.
- **Embedding model dimension changes** (11.26): ada-002 = 1536 dims; text-embedding-3-large = 3072. Migration options: re-embed / parallel indexes / pin model.
- **Observability** (11.27): P50 / P95 / P99 latency; recall@k; cache hit rate; ANN-Benchmarks methodology.
- **Capacity model worked example** (11.28): 500M vectors x d=768 x 200 QPS &rarr; 6 nodes, ~3 TB RAM total; Pinecone pods vs self-host Qdrant vs pgvector.

---

## Implementation order

1. Task 1 - Verify green baseline.
2. Task 2 - Create `vector-production.jsx` stubs + config entries + loader update + lookup.test.js update + sections.test.jsx import/spread.
3. Task 3 - Chapter 11.19 Filtering (6 sub-steps).
4. Task 4 - Chapter 11.20 UpdatesDeletes (6 sub-steps).
5. Task 5 - Chapter 11.21 Sharding (6 sub-steps).
6. Task 6 - Chapter 11.22 Replication (5 sub-steps).
7. Task 7 - Chapter 11.23 HybridSearch (6 sub-steps).
8. Task 8 - Chapter 11.24 Rerankers (6 sub-steps).
9. Task 9 - Chapter 11.25 MultiVectorRetrieval (6 sub-steps).
10. Task 10 - Chapter 11.26 EmbeddingLifecycle (6 sub-steps).
11. Task 11 - Chapter 11.27 Observability (6 sub-steps).
12. Task 12 - Chapter 11.28 CapacityPlanning (6 sub-steps).
13. Task 13 - SVG descriptions + svg-descriptions.test.js update.
14. Task 14 - CLAUDE.md update.
15. Task 15 - Browser verification with claude-in-chrome.
16. Task 16 - Final full-suite + coverage.

Commit cadence: one commit per chapter (Tasks 3-12), plus one each for Tasks 2, 13, 14, 15 (if fixes), 16 (if any). Target: 12-14 commits total.

---

## Task 1: Verify green baseline

**Files:** none.

- [ ] **Step 1:** Confirm branch and clean state

  ```bash
  git status
  git log --oneline -5
  ```

  Expected: `On branch section-11-vector-databases`, clean tree, HEAD = `c3c4a87 Update CLAUDE.md with chapters 11.17-11.18`.

- [ ] **Step 2:** Run test suite

  ```bash
  npm run test
  ```

  Expected: 1,916 tests pass.

- [ ] **Step 3:** Run linter

  ```bash
  npm run lint
  ```

  Expected: 0 errors (pre-existing warnings in `encoder-decoder-diagrams.jsx` and `vector-foundations.jsx` are OK).

No commit.

---

## Task 2: Scaffold vector-production.jsx + config + loader + test imports

**Files:**
- Create: `src/sections/vector-production.jsx`.
- Modify: `src/config.js` (append 10 chapter entries).
- Modify: `src/learn-ai.jsx` (extend Section 11 Promise.all with the new file).
- Modify: `src/__tests__/sections.test.jsx` (add import + spread).
- Modify: `src/__tests__/lookup.test.js` (add import + spread).
- Modify: `src/__tests__/config.test.js` (extend Section 11 chapter-list test to 28 entries).

- [ ] **Step 1:** Update `src/__tests__/config.test.js`

  Replace the existing `describe("Section 11 chapters", ...)` block's inner `it(...)` title and expected array:

  ```js
  describe("Section 11 chapters", () => {
    it("has chapters 11.1 through 11.28 in order", () => {
      const section11 = chapters.filter((ch) => ch.section === 11);
      const expected = [
        { id: "11.1", component: "RetrievalProblem", title: "The Retrieval Problem" },
        { id: "11.2", component: "BruteForceKNN", title: "Brute-Force kNN" },
        { id: "11.3", component: "ThreeWayTradeoff", title: "The Three-Way Tradeoff" },
        { id: "11.4", component: "DistanceMetrics", title: "Distance Metrics" },
        { id: "11.5", component: "IVF", title: "IVF (Inverted File Index)" },
        { id: "11.6", component: "ANNFamilyTree", title: "The ANN Family Tree" },
        { id: "11.7", component: "HNSWIntuition", title: "HNSW - The Small-World Intuition" },
        { id: "11.8", component: "HNSWConstruction", title: "HNSW Construction" },
        { id: "11.9", component: "HNSWSearch", title: "HNSW Search" },
        { id: "11.10", component: "HNSWParameters", title: "HNSW Parameters" },
        { id: "11.11", component: "Vamana", title: "Vamana / DiskANN" },
        { id: "11.12", component: "MemoryWall", title: "The Memory Wall" },
        { id: "11.13", component: "ScalarQuantization", title: "Scalar Quantization" },
        { id: "11.14", component: "ProductQuantization", title: "Product Quantization (+ OPQ)" },
        { id: "11.15", component: "BinaryQuantization", title: "Binary Quantization" },
        { id: "11.16", component: "Matryoshka", title: "Matryoshka Embeddings" },
        { id: "11.17", component: "IVFPQ", title: "IVF-PQ" },
        { id: "11.18", component: "HNSWPQ", title: "HNSW + PQ" },
        { id: "11.19", component: "Filtering", title: "Filtering" },
        { id: "11.20", component: "UpdatesDeletes", title: "Updates & Deletes" },
        { id: "11.21", component: "Sharding", title: "Sharding & Partitioning" },
        { id: "11.22", component: "Replication", title: "Replication & High Availability" },
        { id: "11.23", component: "HybridSearch", title: "Hybrid Search" },
        { id: "11.24", component: "Rerankers", title: "Rerankers" },
        { id: "11.25", component: "MultiVectorRetrieval", title: "Multi-vector Retrieval (ColBERT-style)" },
        { id: "11.26", component: "EmbeddingLifecycle", title: "Embedding Lifecycle & Re-embedding" },
        { id: "11.27", component: "Observability", title: "Observability" },
        { id: "11.28", component: "CapacityPlanning", title: "Capacity Planning & Cost Models" },
      ];
      expect(section11.length).toBe(expected.length);
      expected.forEach((exp, i) => {
        expect(section11[i].id).toBe(exp.id);
        expect(section11[i].component).toBe(exp.component);
        expect(section11[i].title).toBe(exp.title);
      });
    });
  });
  ```

- [ ] **Step 2:** Run test to verify RED

  ```bash
  npx vitest run src/__tests__/config.test.js -t "Section 11 chapters"
  ```

  Expected: FAIL (length is 18, not 28).

- [ ] **Step 3:** Add the 10 entries in `src/config.js` after the `11.18 HNSWPQ` row:

  ```js
    { id: "11.18", title: "HNSW + PQ", section: 11, component: "HNSWPQ" },
    { id: "11.19", title: "Filtering", section: 11, component: "Filtering" },
    { id: "11.20", title: "Updates & Deletes", section: 11, component: "UpdatesDeletes" },
    { id: "11.21", title: "Sharding & Partitioning", section: 11, component: "Sharding" },
    { id: "11.22", title: "Replication & High Availability", section: 11, component: "Replication" },
    { id: "11.23", title: "Hybrid Search", section: 11, component: "HybridSearch" },
    { id: "11.24", title: "Rerankers", section: 11, component: "Rerankers" },
    { id: "11.25", title: "Multi-vector Retrieval (ColBERT-style)", section: 11, component: "MultiVectorRetrieval" },
    { id: "11.26", title: "Embedding Lifecycle & Re-embedding", section: 11, component: "EmbeddingLifecycle" },
    { id: "11.27", title: "Observability", section: 11, component: "Observability" },
    { id: "11.28", title: "Capacity Planning & Cost Models", section: 11, component: "CapacityPlanning" },
  ];
  ```

- [ ] **Step 4:** Create `src/sections/vector-production.jsx` with stubs for all 10 chapters. Each stub must render something for sub=0 (so the generic "All chapters" render test passes) and include a `<SubBtn>` that advances sub until the last sub-step. Use this template for every stub, varying only the component name, color, and `sub < N` count:

  ```jsx
  import { Box, T, Reveal, SubBtn } from "../components.jsx";
  import { C } from "../config.js";

  // Section 11 Act 5: Production Realities (chapters 11.19-11.28).
  // Continues the cat-corpus + production-scale numbers established in 11.1-11.18.
  // Canonical scale dim d = 768. SVG marker/gradient ids follow `<type><chapter>-<svg-index>`.

  export const Filtering = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={22}>
              Filtering (stub)
            </T>
          </Box>
        )}
        {sub < 5 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };

  // Repeat the same shape for the other 9 components. sub < N counts:
  // Filtering (6 sub-steps) -> sub < 5
  // UpdatesDeletes (6) -> sub < 5
  // Sharding (6) -> sub < 5
  // Replication (5) -> sub < 4
  // HybridSearch (6) -> sub < 5
  // Rerankers (6) -> sub < 5
  // MultiVectorRetrieval (6) -> sub < 5
  // EmbeddingLifecycle (6) -> sub < 5
  // Observability (6) -> sub < 5
  // CapacityPlanning (6) -> sub < 5
  ```

  All ten stubs have the same body shape. Stub colors in order: cyan, yellow, green, orange, red, purple, pink, cyan, yellow, green. (Color choice is not load-bearing for the stubs; the per-chapter tasks re-assign colors per sub-step.)

- [ ] **Step 5:** Update `src/learn-ai.jsx` Section 11 loader

  Find:

  ```js
    11: () =>
      Promise.all([import("./sections/vector-foundations.jsx"), import("./sections/vector-compression.jsx")]).then(
        (mods) => Object.assign({}, ...mods),
      ),
  ```

  Replace with:

  ```js
    11: () =>
      Promise.all([
        import("./sections/vector-foundations.jsx"),
        import("./sections/vector-compression.jsx"),
        import("./sections/vector-production.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

- [ ] **Step 6:** Update `src/__tests__/sections.test.jsx`

  Add this import after the existing `import * as VectorCompression`:

  ```js
  import * as VectorProduction from "../sections/vector-production.jsx";
  ```

  Spread it into the `lookup` object alongside the other section spreads:

  ```js
  const lookup = {
    TOC,
    ...NeuralFoundations,
    // ... existing sections ...
    ...VectorFoundations,
    ...VectorCompression,
    ...VectorProduction,
  };
  ```

- [ ] **Step 7:** Update `src/__tests__/lookup.test.js`

  Add the same import after the existing `import * as VectorCompression`:

  ```js
  import * as VectorProduction from "../sections/vector-production.jsx";
  ```

  Add the spread into that file's lookup object too (keep the ordering identical to sections.test.jsx).

- [ ] **Step 8:** Run test to verify GREEN

  ```bash
  npx vitest run src/__tests__/config.test.js src/__tests__/sections.test.jsx src/__tests__/lookup.test.js
  ```

  Expected: all pass. Generic "All chapters" render test should pass for 11.19-11.28 because each stub renders at least one Box at sub=0.

- [ ] **Step 9:** Lint + format

  ```bash
  npm run lint
  npm run format
  ```

  Expected: 0 errors.

- [ ] **Step 10:** Commit

  ```bash
  git add -A
  git commit -m "Scaffold vector-production.jsx and register chapters 11.19-11.28"
  ```

---

## Task 3: Implement Chapter 11.19 Filtering (6 sub-steps)

**Files:**
- Modify: `src/sections/vector-production.jsx` (replace the `Filtering` stub with full implementation).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block after the HNSWPQ block).

**Chapter purpose (from spec):** The #1 production gotcha. "Find similar to X where tenant_id=T AND published_after=D." Three strategies: pre-filter, post-filter, inline filtered-HNSW. Each has failure modes. Qdrant's inline approach is best-in-class in practice.

**Sub-step structure:**

- **sub=0 (C.cyan) - The problem statement.** Title: "Similarity search with a WHERE clause". Example query on the cat corpus: find docs similar to "information about cats" AND `tenant_id = 42` AND `published_after = 2024-01-01`. Show that an unfiltered ANN index returns docs that satisfy the similarity condition but fail the predicate. Key content strings for tests: "tenant_id" or "tenant", "filter", "predicate" or "WHERE", cat-corpus example.

- **sub=1 (C.yellow) - Pre-filter: evaluate predicate first, brute-force the survivors.** Title: "Pre-filter: shrink the set, then search". Steps: 1) evaluate filter &rarr; 2 docs match, 2) brute-force compare query to 2. Works great when filter selectivity is tight (<1%); disaster at loose filters because you re-do brute force at full scale. Visual: filter funnel from 1M &rarr; 100 candidates &rarr; exact top-k. Key content: "pre-filter", "brute", "selective" or "selectivity", "loose" or "tight".

- **sub=2 (C.green) - Post-filter: ANN first, filter the results.** Title: "Post-filter: search first, drop non-matches". Steps: 1) ANN returns top-100, 2) apply predicate and drop non-matches. Fast for any filter but returns fewer than k when predicate is tight (e.g., if only 1 of the top-100 matches, you return 1, not 10). Visual: top-100 box &rarr; filter removes most &rarr; 1 result. Key content: "post-filter", "fewer than k" or "empty" or "insufficient", ANN or top-k terminology.

- **sub=3 (C.orange) - Inline filtered-HNSW.** Title: "Inline: evaluate the filter during graph traversal". At every graph hop, only expand neighbors that pass the predicate. Preserves graph navigation speed even for tight filters. Visual: HNSW graph with nodes colored by predicate pass/fail; traversal path only follows passing nodes. This is what Qdrant does (payload index). Key content: "inline" or "filtered-HNSW", "Qdrant", "traversal" or "graph hop", "payload".

- **sub=4 (C.red) - Selectivity edge cases.** Title: "Where each strategy wins and loses". Grid table: 4 columns (strategy, tight filter 0.1%, medium 5%, loose 50%). Pre-filter: fast/medium/slow. Post-filter: broken/ok/great. Inline-HNSW: great/great/great. Text: Qdrant wins; post-filter is the footgun. Key content: "selectivity", specific percentages or "0.1" or "50", strategy names, "footgun" or "edge case".

- **sub=5 (C.purple) - The filter index has its own cost.** Title: "Filters need their own index". Brief tour of how systems index metadata: bitmaps (Pinecone namespaces), inverted index (Qdrant payload), column-store (Weaviate), JSONB GIN (pgvector). Key content: "bitmap" or "inverted" or "column", at least two of [Qdrant, Pinecone, Weaviate, pgvector], "index" or "metadata".

- [ ] **Step 1:** Append content tests to `src/__tests__/sections.test.jsx` after the HNSWPQ describe block:

  ```js
  describe("Filtering (11.19) content", () => {
    const fn = VectorProduction.Filtering;

    it("sub=0 frames similarity search with a WHERE clause", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/tenant/i);
      expect(container.textContent).toMatch(/filter|predicate|WHERE/i);
    });

    it("sub=1 pre-filter shrinks the set then searches", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/pre[- ]?filter/i);
      expect(container.textContent).toMatch(/brute/i);
      expect(container.textContent).toMatch(/selectiv|tight|loose/i);
    });

    it("sub=2 post-filter returns fewer than k when tight", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/post[- ]?filter/i);
      expect(container.textContent).toMatch(/fewer|empty|insufficient/i);
    });

    it("sub=3 inline filtered-HNSW evaluates during traversal", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/inline|filtered[- ]?HNSW/i);
      expect(container.textContent).toMatch(/Qdrant/);
      expect(container.textContent).toMatch(/traversal|graph hop|payload/i);
    });

    it("sub=4 compares strategies by selectivity", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/selectiv/i);
      expect(container.textContent).toMatch(/0\.1|50|5%/);
    });

    it("sub=5 names filter-index implementations across systems", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/bitmap|inverted|column/i);
      expect(container.textContent).toMatch(/Qdrant|Pinecone|Weaviate|pgvector/);
    });
  });
  ```

- [ ] **Step 2:** Run tests - expect FAIL

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "Filtering \\(11.19\\)"
  ```

- [ ] **Step 3:** Replace the `Filtering` stub with the full implementation. Required specifics:

  - Six sub-steps in colors: cyan &rarr; yellow &rarr; green &rarr; orange &rarr; red &rarr; purple.
  - sub=0: centered body paragraph with the SQL-like query written as monospace. One tinted card with cat-corpus example: 10 docs, predicate `tenant_id = 42` passes only docs {1, 3, 7}.
  - sub=1: pre-filter funnel SVG (1M &rarr; 100 &rarr; k). Use three stacked trapezoids narrowing left-to-right. Include the `<desc>` metadata.
  - sub=2: post-filter card showing top-100 &rarr; 1 of 100 passes &rarr; return 1 (not 10). Emphasize the "insufficient results" failure mode.
  - sub=3: small HNSW-like graph SVG with passing nodes filled and failing nodes dimmed; a traversal path in orange visits only filled nodes. Label "Qdrant payload index (filtered-HNSW)".
  - sub=4: 4-column x 4-row strategy-by-selectivity table; color the winning strategy cell green.
  - sub=5: 4-card grid naming Qdrant (inverted index on payload), Pinecone (namespaces + metadata index), Weaviate (column store), pgvector (JSONB GIN).
  - Every SVG has `<desc>` first child.
  - Center-aligned Box titles; tinted inner elements; no em-dashes; no `C.card`.
  - End: `{sub < 5 && <SubBtn .../> }` pattern identical to the existing stubs.

- [ ] **Step 4:** Re-run tests (expect PASS), full suite, lint/format, commit:

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "Filtering \\(11.19\\)"
  npm run test
  npm run lint
  npm run format
  git add src/sections/vector-production.jsx src/__tests__/sections.test.jsx
  git commit -m "Implement chapter 11.19 Filtering"
  ```

---

## Task 4: Implement Chapter 11.20 UpdatesDeletes (6 sub-steps)

**Chapter purpose:** Why graph indexes struggle with deletes. HNSW tombstones degrade the graph; IVF-PQ is easier. Rebuild strategies.

**Sub-step structure:**

- **sub=0 (C.cyan) - Inserts are easy.** Title: "Inserts: append and connect". Show one new cat doc arriving, layer-assigned, wired into M nearest neighbors. Memory grows linearly. Key content: "insert", "append", "connect" or "neighbor", M or "16".

- **sub=1 (C.yellow) - The delete problem.** Title: "Delete: paths that routed through this node break". Show an HNSW graph segment where a central node routes many queries; if you remove it, all those traversals lose a hop. Key content: "delete" or "remove", "path" or "route" or "hop", "break" or "lost".

- **sub=2 (C.green) - Tombstones: mark-and-skip.** Title: "Tombstone: mark deleted, filter at query time". At query time, treat tombstoned nodes as non-results but still traverse through them. Memory cost: the tombstone lives in the graph forever (until rebuild). Key content: "tombstone", "mark" or "soft delete", "query time".

- **sub=3 (C.orange) - Graph degradation after deletes.** Title: "30% deletes: graph holes, wasted hops, recall drops". Plot: x-axis = delete %, y-axis = recall@10. Curve: smooth decline from 0.97 at 0% to 0.92 at 30% to 0.85 at 50%. Key content: "30%" or "30 percent", "recall", specific percentages like "0.92" or "0.85", "degrad" or "drop".

- **sub=4 (C.red) - Rebuild strategies.** Title: "Rebuild: full, segmented, or incremental". Three cards: full rebuild (downtime, simple), segment rotation (build new segment, swap), incremental repair (per-node re-linking). Trade-off: operational complexity vs. recall restoration. Key content: "rebuild", "segment" or "rotation" or "incremental", "downtime" or "operational".

- **sub=5 (C.purple) - Index type affects delete pain.** Title: "IVF-PQ deletes cluster-local; HNSW+PQ is hardest". Grid: index type / delete cost / rebuild trigger. IVF-PQ: local (just remove from cluster). HNSW: whole-graph recall slides. HNSW+PQ: double whammy. pgvector HNSW today has known delete issues; Qdrant's auto-reindex handles it. Key content: "IVF-PQ" or "IVF", "HNSW", "easier" or "harder" or specific trade-off language, at least one system name.

Tests regex set:
- sub=0: /insert/i, /append|connect|neighbor/i, /M|16/
- sub=1: /delete|remove/i, /path|route|hop/i, /break|lost|broken/i
- sub=2: /tombstone/i, /mark|soft/i, /query time|filter/i
- sub=3: /30/, /recall/i, /0\.92|0\.85|degrad|drop/i
- sub=4: /rebuild/i, /segment|rotation|incremental/i, /downtime|operational/i
- sub=5: /IVF/, /HNSW/, /Qdrant|pgvector/

Implementation specifics: same visual-design patterns as Task 3. One SVG (delete-rate curve) in sub=3. Commit message: `Implement chapter 11.20 Updates & Deletes`.

---

## Task 5: Implement Chapter 11.21 Sharding (6 sub-steps)

**Chapter purpose:** Horizontal scale. Random vs semantic sharding. Query fan-out. Filter + shard interaction.

**Sub-step structure:**

- **sub=0 (C.cyan) - Single-node limit.** Title: "~100M vectors fit on one node comfortably". Numbers: 100M x 768 x 4 = 300 GB for float32, comfortably fits an r7i.24xlarge with 768 GB RAM. Beyond that, shard. Key content: "100M" or "100 million", "single[- ]?node" or "one node", memory math.

- **sub=1 (C.yellow) - Random sharding.** Title: "Random: round-robin by vector id". Pros: even load; cons: every query hits every shard. Key content: "random", "round[- ]?robin" or "hash", "all shards" or "fan[- ]?out".

- **sub=2 (C.green) - Semantic sharding.** Title: "Semantic: one IVF cluster = one shard". Each shard owns a region of the embedding space. Queries can be routed to a small subset of shards by centroid distance. Key content: "semantic" or "cluster[- ]?based", "IVF cluster", "region" or "subset".

- **sub=3 (C.orange) - Query fan-out and merge.** Title: "Every shard returns top-k; coordinator merges". Show: 8 shards x top-10 = 80 results, coordinator merges to final top-10. Key content: "fan[- ]?out", "coordinator" or "merge", "top-k" or specific numbers like "8" or "10".

- **sub=4 (C.red) - Recall math on merged top-k.** Title: "Merged top-k is not single-node top-k". If the true top-10 are concentrated in one shard, random sharding recovers them. If spread across shards, each shard's top-10 may miss a true top-10 that sits at position 11. Solution: raise per-shard top-k to (k x buffer). Key content: "recall", "merge" or "merged", "buffer" or number like "top-20" or "top-50".

- **sub=5 (C.purple) - Filter + shard interaction.** Title: "Prune shards by filter predicate when possible". If `tenant_id=42` and sharding is tenant-based, only 1 shard needs a query. When filter is orthogonal to shard key, all shards must scan. Key content: "filter", "shard" and "prune" or "skip", "tenant" or similar shard-key example.

Tests regex set:
- sub=0: /100M|100 million|r7i/i, /single[- ]?node|one node/i
- sub=1: /random/i, /round[- ]?robin|hash/i, /fan[- ]?out|all shards/i
- sub=2: /semantic|cluster/i, /IVF|region|subset/i
- sub=3: /fan[- ]?out/i, /coordinator|merge/i, /top[- ]?k|top-10|top-20/i
- sub=4: /recall/i, /merge/i, /buffer|top-20|top-50/i
- sub=5: /filter/i, /shard/i, /prune|skip/i

Commit: `Implement chapter 11.21 Sharding & Partitioning`.

---

## Task 6: Implement Chapter 11.22 Replication (5 sub-steps)

**Chapter purpose:** Read replicas, leader-follower writes, index durability, recovery.

**Sub-step structure:**

- **sub=0 (C.cyan) - Read replicas.** Title: "Read replicas: N copies, reads load-balanced". Diagram: one writer icon, multiple reader icons, a load balancer. Each reader holds the full index in RAM. Key content: "read replica" or "replicas", "load[- ]?balance" or "balance", at least one concrete scaling term.

- **sub=1 (C.yellow) - Leader-follower writes.** Title: "One writer, many readers, replication lag". Typical lag: 50 ms under normal load, up to 2 s under spikes. Readers may serve slightly stale results. Key content: "leader" or "follower" or "primary", "lag" or "delay", at least one number like "50 ms" or "2 s".

- **sub=2 (C.green) - Failure: leader dies.** Title: "Leader dies, follower promotes". A small lag-window of writes is lost unless the writer fsyncs to a synchronous replica. Show the timeline: writer down &rarr; election &rarr; new leader &rarr; lost window. Key content: "leader" or "primary", "promote" or "election", "lost" or "window".

- **sub=3 (C.orange) - Durability of an in-memory index.** Title: "If RAM dies, is the index gone?". Discuss WAL (write-ahead log) on disk, snapshot interval, source-of-truth rehydration. Key content: "durab" or "persistent" or "persistence", "WAL" or "write[- ]?ahead" or "snapshot", "RAM".

- **sub=4 (C.red) - Recovery time: WAL vs re-embed.** Title: "Recovery: rehydrate from WAL or re-embed from source". WAL recovery: minutes-to-hours replay. Re-embed: days-to-weeks depending on corpus size and embedding API cost. Key content: "recovery" or "rebuild", "WAL" or "re-embed", specific time language like "hours" or "days" or "weeks".

Tests regex set:
- sub=0: /replica|read replica/i, /load[- ]?balance/i
- sub=1: /leader|follower|primary/i, /lag|delay/i, /50|2 s|200 ms/
- sub=2: /leader|primary/i, /promote|election/i, /lost|window/i
- sub=3: /durab|persist/i, /WAL|write[- ]?ahead|snapshot/i, /RAM/i
- sub=4: /recovery|rebuild/i, /WAL|re[- ]?embed/i, /hours|days|weeks/i

Commit: `Implement chapter 11.22 Replication & High Availability`.

---

## Task 7: Implement Chapter 11.23 HybridSearch (6 sub-steps)

**Chapter purpose:** BM25 + vector. RRF (Reciprocal Rank Fusion). Concrete cat-corpus example where hybrid wins.

**Sub-step structure:**

- **sub=0 (C.cyan) - Vectors miss exact matches.** Title: "Embeddings blur SKUs, proper nouns, rare tokens". Example: a search for "SKU-A4291" on a catalog vector index returns semantically-related items but may miss the exact SKU that sits at position 37. Key content: "exact" or "SKU" or "proper noun", "vector" or "embedding", "miss" or "blur".

- **sub=1 (C.yellow) - BM25 refresher.** Title: "BM25: term frequency x inverse document frequency". Formula: `BM25(q, d) = Sum over term t of IDF(t) * TF_norm(t, d)`. Give a worked example on the cat corpus for query "cats domesticated". Key content: "BM25", "term frequency" or "TF", "IDF" or "inverse document frequency".

- **sub=2 (C.green) - Run both in parallel.** Title: "Vector ANN and BM25 produce two ranked lists". Diagram: query splits into two lanes, both return top-N. Key content: "parallel" or "both", "ranked list" or "top-N" or "top[- ]?k", BM25 and vector mentioned.

- **sub=3 (C.orange) - Reciprocal Rank Fusion.** Title: "RRF: score(d) = Sum of 1 / (k + rank)". Formula with k = 60 (standard). Concrete cat-corpus table: vector rank + BM25 rank + RRF score for each doc. Key content: "RRF" or "Reciprocal Rank Fusion", "k = 60" or "60", the formula or specific numbers.

- **sub=4 (C.red) - Worked example: hybrid beats either alone.** Title: "Query: 'tabby cat genetics' - pure vector vs pure BM25 vs hybrid". 3-column table showing top-5 per method. Pure vector finds "Tigers are striped cats" (semantic near-miss); pure BM25 finds "tabby" exact; hybrid merges. Key content: "tabby" or query-specific text, "vector" and "BM25", "hybrid".

- **sub=5 (C.purple) - Weighting and production tuning.** Title: "Weighted RRF and when hybrid is worth it". Variant: `score(d) = a*RRF_vec + b*RRF_bm25`. Typical weights 0.7/0.3. When hybrid wins: heterogeneous queries (some exact-match intent). Key content: "weight" or "alpha" or "0.7", "hybrid", "worth" or "when" language.

Tests regex set:
- sub=0: /SKU|exact|proper noun/i, /vector|embedding/i, /miss|blur/i
- sub=1: /BM25/, /term frequency|TF/i, /IDF|inverse document/i
- sub=2: /parallel|both/i, /ranked|top/i
- sub=3: /RRF|Reciprocal Rank Fusion/i, /60/, /1 \/|rank/i
- sub=4: /tabby/i, /vector/i, /BM25/i
- sub=5: /weight|alpha|0\.7/i, /hybrid/i

Commit: `Implement chapter 11.23 Hybrid Search`.

---

## Task 8: Implement Chapter 11.24 Rerankers (6 sub-steps)

**Chapter purpose:** Two-stage retrieval. ANN top-100 &rarr; cross-encoder rerank &rarr; top-10.

**Sub-step structure:**

- **sub=0 (C.cyan) - Two-stage retrieval.** Title: "Stage 1: ANN returns top-100 candidates". Fast but approximate. Key content: "two[- ]?stage" or "stage 1", "top[- ]?100" or "100 candidates", "fast" or "approximate".

- **sub=1 (C.yellow) - Cross-encoder architecture.** Title: "Query and doc concatenated into one transformer pass". Contrast with bi-encoder (each embedded separately, cosine). Cross-encoder gets full attention between query tokens and doc tokens. Key content: "cross[- ]?encoder", "concatenated" or "concatenate" or "together", "attention".

- **sub=2 (C.green) - Full attention wins.** Title: "Bi-encoder cosine can't see query x doc token interactions". Show: bi-encoder pools each into one vector, losing token-level info. Cross-encoder does not. Key content: "bi[- ]?encoder" or "bi-encoder", "token" or "interaction", "attention".

- **sub=3 (C.orange) - Rerank the top-100.** Title: "Score each candidate, return top-10". Diagram: 100 candidates with cross-encoder scores, sort, return 10. Key content: "rerank" or "re-rank", "top[- ]?10", "score" or "sort".

- **sub=4 (C.red) - Latency cost.** Title: "100 rerank runs &asymp; 100 ms on GPU". Numbers: 1 ms per pair on an A10, 100 pairs = 100 ms. Big quality win, worth it for accuracy-critical flows. Key content: "latency" or "ms" or "100 ms", specific number like "1 ms" or "100", "GPU" or "A10" or "H100".

- **sub=5 (C.purple) - Production models.** Title: "Cohere Rerank, BGE-reranker, MS-MARCO cross-encoders". Small card grid naming each with the provider/license. Key content: "Cohere" or "BGE" or "MS[- ]?MARCO", at least two of those names.

Tests regex set:
- sub=0: /two[- ]?stage|stage 1/i, /top[- ]?100|100/, /fast|approximate/i
- sub=1: /cross[- ]?encoder/i, /concatenated|together/i, /attention/i
- sub=2: /bi[- ]?encoder/i, /token|interaction/i, /attention/i
- sub=3: /rerank|re-rank/i, /top[- ]?10|10/i, /score|sort/i
- sub=4: /latency|ms|100 ms/i, /1 ms|100/, /GPU|A10|H100/i
- sub=5: /Cohere|BGE|MS[- ]?MARCO/i

Commit: `Implement chapter 11.24 Rerankers`.

---

## Task 9: Implement Chapter 11.25 MultiVectorRetrieval (6 sub-steps)

**Chapter purpose:** ColBERT-style. One vector per token, max-sim aggregation. Vespa / Qdrant / Elasticsearch.

**Sub-step structure:**

- **sub=0 (C.cyan) - Single-vector problem.** Title: "One vector per doc blurs token-level signal". Long docs averaged into one vector lose specifics. Key content: "single[- ]?vector" or "one vector", "blur" or "lossy" or "average", "long doc" or "paragraph".

- **sub=1 (C.yellow) - ColBERT idea.** Title: "Keep one vector per token". Each doc expands from 1 vector to &asymp;200 vectors (typical doc length). Key content: "ColBERT", "token" or "per token", specific number like "200".

- **sub=2 (C.green) - Max-sim aggregation.** Title: "For each query token, find max-matching doc token; sum". Formula: `score(q, d) = Sum over q_i of max over d_j of (q_i . d_j)`. Walk through on cat corpus: 5 query tokens x 20 doc tokens &rarr; 5 max scores &rarr; sum. Key content: "max[- ]?sim" or "maxsim", "for each query token" or "token" language, "sum" or the formula.

- **sub=3 (C.orange) - Worked example.** Title: "Cat corpus max-sim walkthrough". Small grid: 3 query tokens across 5 doc tokens with per-pair cosine scores; highlight the max in each row. Key content: "walkthrough" or specific token names like "cat" or "information", number grid.

- **sub=4 (C.red) - Storage cost.** Title: "N x tokens x d bytes (20-100x larger)". Concrete: at N=1M, 200 tokens, d=768, float32: 1M x 200 x 3 KB = 600 GB. Key content: "storage" or "memory", specific cost like "600 GB" or "20x" or "100x", "tokens" or "token count".

- **sub=5 (C.purple) - Production support.** Title: "Vespa, Qdrant multi-vector, Elasticsearch". Short cards naming each. Vespa has native tensor fields; Qdrant has native multi-vector since v1.10; Elasticsearch has nested dense_vector. Key content: "Vespa", "Qdrant", one of "Elasticsearch" or "nested" or "tensor".

Tests regex set:
- sub=0: /single[- ]?vector|one vector/i, /blur|lossy|average/i
- sub=1: /ColBERT/i, /token/i, /200|per token/i
- sub=2: /max[- ]?sim|maxsim/i, /token/i, /sum/i
- sub=3: /walkthrough|cat|token/i
- sub=4: /storage|memory/i, /20|100|600 GB/, /token/i
- sub=5: /Vespa/i, /Qdrant/i, /Elasticsearch|nested|tensor/i

Commit: `Implement chapter 11.25 Multi-vector Retrieval`.

---

## Task 10: Implement Chapter 11.26 EmbeddingLifecycle (6 sub-steps)

**Chapter purpose:** Re-embedding pain. Model upgrades, versioning, drift.

**Sub-step structure:**

- **sub=0 (C.cyan) - You indexed 500M vectors two years ago.** Title: "The embedding model moved on". Concrete: indexed with ada-002 (d=1536); OpenAI released text-embedding-3-large (d=3072) a year later. Key content: "500M" or "500 million", "ada[- ]?002" or "text-embedding" or "two years", "moved" or "upgrade".

- **sub=1 (C.yellow) - Dimension mismatch is a migration.** Title: "Old index at 1536 dims, new model outputs 3072". You cannot mix; the vector DB's collection has a fixed dim. Key content: "1536", "3072", "dimension" or "dims" or "mismatch".

- **sub=2 (C.green) - Option 1: re-embed everything.** Title: "Pay the re-embedding cost, swap indexes". Cost example: 500M x $0.00013 per 1K tokens (text-embedding-3-large) x average 500 tokens per doc = a five-figure bill and days of API calls. Requires retained source text. Key content: "re[- ]?embed", "source text" or "source", "cost" or "$" or "bill".

- **sub=3 (C.orange) - Option 2: parallel indexes during migration.** Title: "Serve from old, populate new, cutover when ready". Dual-write to both for a window; compare quality; flip traffic. Key content: "parallel" or "dual", "serve" or "traffic", "cutover" or "flip" or "migrate".

- **sub=4 (C.red) - Option 3: pin the old model forever.** Title: "Pin and pray". Works until the old model is deprecated or drift kicks in. Key content: "pin" or "freeze", "deprecated" or "drift" or "decay", "forever" or similar permanence language.

- **sub=5 (C.purple) - Drift monitoring.** Title: "Periodic ground-truth evaluations catch quality regression". Track recall@k and domain-specific eval set monthly. Sudden drops &rarr; upstream model change / content drift. Key content: "drift" or "regression" or "eval", "monitor" or "ground[- ]?truth", "recall" or "quality".

Tests regex set:
- sub=0: /500M|500 million/, /ada[- ]?002|text-embedding|two years/i, /upgrade|moved/i
- sub=1: /1536/, /3072/, /dimension|dims|mismatch/i
- sub=2: /re[- ]?embed/i, /source/i, /cost|\$|bill/i
- sub=3: /parallel|dual/i, /serve|traffic/i, /cutover|flip|migrate/i
- sub=4: /pin|freeze/i, /deprecated|drift|decay/i
- sub=5: /drift|regression|eval/i, /monitor|ground[- ]?truth/i, /recall|quality/i

Commit: `Implement chapter 11.26 Embedding Lifecycle`.

---

## Task 11: Implement Chapter 11.27 Observability (6 sub-steps)

**Chapter purpose:** Metrics that matter. Latency tails, recall tracking, ANN-Benchmarks.

**Sub-step structure:**

- **sub=0 (C.cyan) - Latency tails matter most.** Title: "P50, P95, P99". Typical prod targets: P50 = 10 ms, P95 = 30 ms, P99 = 80 ms. Tail is where user pain lives. Key content: "P50" or "P95" or "P99", specific number like "80 ms" or "30 ms", "tail".

- **sub=1 (C.yellow) - Recall@k: periodic ground-truth sampling.** Title: "Sample queries, run brute-force, compare". Weekly: sample 1000 queries, compute exact top-10, compare vs ANN top-10, report recall. Trend over time. Key content: "recall[@]?k" or "recall@10", "sample" or "ground[- ]?truth", "compare" or "brute[- ]?force".

- **sub=2 (C.green) - Per-query cost telemetry.** Title: "Memory reads, cache hits, CPU cycles". Each query emits metrics: pages read, L3 cache hit rate, wall-clock breakdown. Key content: "cache", "hit rate" or "cache hit", "memory" or "pages" or "CPU".

- **sub=3 (C.orange) - ANN-Benchmarks methodology.** Title: "Standard benchmark for index configurations". GitHub: erikbern/ann-benchmarks. Plots QPS vs recall. Use it internally to pick HNSW params. Key content: "ANN[- ]?Benchmarks" or "ann-benchmarks", "QPS" or "queries per second", "recall".

- **sub=4 (C.red) - Dashboard layout.** Title: "Dashboard: alert lines vs. watch lines". Mock of a Grafana-style panel: P99 alert above 100 ms, recall@10 watch below 0.95. Key content: "dashboard" or "Grafana" or "panel", "alert" or "watch", specific metric like "P99" or "recall@10".

- **sub=5 (C.purple) - The metric you didn't measure.** Title: "The metric you did not measure is the one that hurts you". Checklist: are you capturing per-tenant latency? filtered-query recall? cold-start? Key content: "tenant" or "cold[- ]?start" or "per-tenant", "checklist" or "capture" or "measure".

Tests regex set:
- sub=0: /P50|P95|P99/, /tail/i
- sub=1: /recall/i, /sample|ground[- ]?truth/i, /compare|brute[- ]?force/i
- sub=2: /cache/i, /hit rate|cache hit/i, /memory|pages|CPU/i
- sub=3: /ANN[- ]?Benchmarks|ann-benchmarks/i, /QPS|queries per second/i, /recall/i
- sub=4: /dashboard|Grafana|panel/i, /alert|watch/i, /P99|recall@10/i
- sub=5: /tenant|cold[- ]?start|per-tenant/i, /checklist|capture|measure/i

Commit: `Implement chapter 11.27 Observability`.

---

## Task 12: Implement Chapter 11.28 CapacityPlanning (6 sub-steps)

**Chapter purpose:** Sizing a real workload. Concrete math, cost comparison, decision lens.

**Sub-step structure:**

- **sub=0 (C.cyan) - Inputs to size a system.** Title: "N, d, QPS, P99, filter selectivity, availability". Enumerate the 6 inputs. Key content: "N" or "vectors", "QPS" or "queries per second", "P99" or "latency target", "selectivity" or "availability" or "filter".

- **sub=1 (C.yellow) - Memory formula.** Title: "Vectors + graph + cache + fragmentation". Formula: `RAM = N * (vec_bytes + graph_bytes) * cache_factor * frag_factor`. Typical cache_factor = 1.2, frag = 1.3. Key content: "RAM" or "memory", specific terms "graph" and "cache" and "fragmentation" or "cache[- ]?factor", the formula structure.

- **sub=2 (C.green) - CPU sizing.** Title: "CPU = per-query ops x QPS x headroom". Worked: HNSW hop cost &asymp; 10 us per hop, 30 hops per query, 200 QPS, 2x headroom. Key content: "CPU" or "cores", "QPS" or specific number like "200", "headroom".

- **sub=3 (C.orange) - Concrete worked example.** Title: "500M vectors x d=768 x 200 QPS &rarr; 6 nodes, 3 TB RAM". Walk through the numbers: vectors 1.5 TB + graph 50 GB + cache + frag &asymp; 3 TB; spread across 6 r7i.24xlarge instances. Key content: "500M" or "500 million", "3 TB" or "1.5 TB", "6 nodes" or "nodes".

- **sub=4 (C.red) - Cost comparison.** Title: "Pinecone pods vs self-host Qdrant vs pgvector". Concrete monthly estimates for 500M x d=768 workload: Pinecone pod-based (~$X), self-host Qdrant on AWS (~$Y), pgvector on a big Postgres (~$Z). Numbers should be in-range for 2026 (Pinecone pod-based ~$30k/mo, self-host Qdrant ~$8k/mo, pgvector ~$5k/mo at this scale - note ranges are illustrative, not authoritative). Key content: "Pinecone", "Qdrant" or "pgvector", "$" or "cost" or "month".

- **sub=5 (C.purple) - Decision lens: $ per million vectors per month.** Title: "Pick by cost-per-million-vectors and cost-per-million-queries". Key content: "per million" or "per-million", "cost" or "$", "decision" or "framework".

Tests regex set:
- sub=0: /N|vectors/i, /QPS|queries per second/i, /P99|latency/i, /selectivity|availability|filter/i
- sub=1: /RAM|memory/i, /graph|cache|fragmentation/i
- sub=2: /CPU|cores/i, /QPS|200/i, /headroom/i
- sub=3: /500M|500 million/, /3 TB|1\.5 TB|TB/, /nodes|6 nodes/i
- sub=4: /Pinecone/, /Qdrant|pgvector/, /\$|cost|month/i
- sub=5: /per million|per-million/i, /cost|\$/i, /decision|framework/i

Commit: `Implement chapter 11.28 Capacity Planning & Cost Models`.

---

## Task 13: Add SVG descriptions and update svg-descriptions.test.js

**Files:**
- Modify: `src/__tests__/svg-descriptions.test.js` (extend `expectedChapters`).
- Modify: `src/data/svg-descriptions.json` (add entries keyed by each new chapter that has SVGs).
- Modify: `src/__tests__/sections.test.jsx` (extend the `svgChapters` array inside the "Every SVG has a `<desc>` element" block).

- [ ] **Step 1:** For each chapter, count the `<svg>` elements rendered across all sub-steps:

  ```bash
  grep -c "<svg" src/sections/vector-production.jsx
  ```

  Expected estimate per chapter: 11.19 Filtering 2-3, 11.20 UpdatesDeletes 1-2, 11.21 Sharding 1-2, 11.22 Replication 1-2, 11.23 HybridSearch 1, 11.24 Rerankers 1, 11.25 MultiVectorRetrieval 1-2, 11.26 EmbeddingLifecycle 0-1, 11.27 Observability 1-2, 11.28 CapacityPlanning 1. Total likely 15-25 SVGs.

  Only chapters that actually render at least one SVG should be listed in `expectedChapters` / `svgChapters`. Some chapters might end up text-only (e.g., 11.26 if built with div-only cards) - do not list those.

- [ ] **Step 2:** Extend `src/__tests__/svg-descriptions.test.js` `expectedChapters` array by appending `"11.19"`, `"11.20"`, `"11.21"`, `"11.22"`, `"11.23"`, `"11.24"`, `"11.25"`, `"11.27"`, `"11.28"` - adjust based on actual SVG presence from Step 1.

- [ ] **Step 3:** Append entries to `src/data/svg-descriptions.json`. Insert new blocks before the closing `}`, after the existing `"11.18"` block. Description style: same as existing - plain-language terms a learner would search for, 1-2 sentences per SVG, in document order. Sample entry for 11.19:

  ```json
    "11.19": [
      "Filter funnel for pre-filter strategy: wide input of 1M vectors narrows through a tenant_id predicate to ~100 candidates then to the final top-k, showing how tight filter selectivity shrinks the candidate set before brute-force search",
      "HNSW graph fragment with nodes colored by filter predicate pass or fail. The orange traversal path only visits passing nodes, illustrating the Qdrant inline filtered-HNSW approach which evaluates the predicate during graph traversal instead of pre- or post-filtering"
    ]
  ```

  Count must match the actual `<svg>` count per chapter.

- [ ] **Step 4:** Extend the `svgChapters` array in `src/__tests__/sections.test.jsx`'s `describe("Every SVG has a <desc> element", ...)` block by appending the same list as Step 2.

- [ ] **Step 5:** Run the validation tests

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js src/__tests__/sections.test.jsx -t "Every SVG"
  ```

  Expected: PASS. If a new SVG lacks a `<desc>` child, the sections test fails. If a manifest entry is missing for a listed chapter, svg-descriptions test fails. Fix whichever before moving on.

- [ ] **Step 6:** Commit

  ```bash
  git add -A
  git commit -m "Add SVG descriptions for chapters 11.19-11.28"
  ```

---

## Task 14: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`.

- [ ] **Step 1:** Find the Section 11 heading and update the milestones annotation:

  ```markdown
  **Section 11: Vector Databases** (`vector-foundations.jsx` + `vector-compression.jsx` + `vector-production.jsx` - Milestones 1-5 of 6 complete)
  ```

- [ ] **Step 2:** Extend the Section 11 mapping table to 28 rows by appending after 11.18:

  ```markdown
  | 11.19 | Filtering | Filtering |
  | 11.20 | UpdatesDeletes | Updates & Deletes |
  | 11.21 | Sharding | Sharding & Partitioning |
  | 11.22 | Replication | Replication & High Availability |
  | 11.23 | HybridSearch | Hybrid Search |
  | 11.24 | Rerankers | Rerankers |
  | 11.25 | MultiVectorRetrieval | Multi-vector Retrieval (ColBERT-style) |
  | 11.26 | EmbeddingLifecycle | Embedding Lifecycle & Re-embedding |
  | 11.27 | Observability | Observability |
  | 11.28 | CapacityPlanning | Capacity Planning & Cost Models |
  ```

  Update the trailing parenthetical:

  ```markdown
  (Subsequent milestones will extend this table as chapters 11.29-11.35 are added.)
  ```

- [ ] **Step 3:** Update the project-structure tree. Replace:

  ```
  │       └── vector-compression.jsx        # Section 11 (Acts 3+4, chapters 11.12-11.18)
  ```

  with:

  ```
  │       ├── vector-compression.jsx        # Section 11 (Acts 3+4, chapters 11.12-11.18)
  │       └── vector-production.jsx         # Section 11 (Act 5, chapters 11.19-11.28)
  ```

- [ ] **Step 4:** Commit

  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md with chapters 11.19-11.28"
  ```

---

## Task 15: Browser verification with claude-in-chrome

**Files:** none (runtime verification).

- [ ] **Step 1:** Start the dev server in the background:

  ```bash
  npm run dev
  ```

  Note the URL (typically `http://localhost:5173/learn-ai/`, but may drift to 5174-5177 if prior ports are occupied). Use `lsof -i :5173,5174,5175,5176,5177 -t` to confirm.

- [ ] **Step 2:** Get tab context and navigate:
  - `mcp__claude-in-chrome__tabs_context_mcp` with `createIfEmpty: true`.
  - `mcp__claude-in-chrome__tabs_create_mcp` to get a fresh tab id.
  - `mcp__claude-in-chrome__navigate` to the learn-ai URL on the running port.

- [ ] **Step 3:** Read the fingerprint and find indices for 11.19-11.28:

  ```js
  const fp = JSON.parse(localStorage.getItem("learn-ai-nav")).fingerprint.split(",");
  const indices = {};
  for (const id of ["11.19","11.20","11.21","11.22","11.23","11.24","11.25","11.26","11.27","11.28"]) {
    indices[id] = fp.indexOf(id);
  }
  JSON.stringify(indices);
  ```

  Expected indices: `{"11.19":122,"11.20":123,...,"11.28":131}` (sequential starting from one past 11.18 = 121).

- [ ] **Step 4:** For each of 11.19-11.28:

  - Seed localStorage with `{ ch: <index>, sub: 0, fingerprint: fp }` and reload.
  - Use a `javascript_tool` walk that clicks `[data-subbtn]` through every sub-step and audits expected keyword presence at each sub (mirror the regex set from the Task-3 through Task-12 content tests).

  Example walk for 11.19 Filtering:

  ```js
  (async () => {
    const checks = [
      { sub: 0, keys: { tenant: /tenant/i, filter: /filter|predicate|WHERE/i } },
      { sub: 1, keys: { pref: /pre[- ]?filter/i, brute: /brute/i, selectivity: /selectiv|tight|loose/i } },
      { sub: 2, keys: { postf: /post[- ]?filter/i, fewer: /fewer|empty|insufficient/i } },
      { sub: 3, keys: { inline: /inline|filtered[- ]?HNSW/i, qdrant: /Qdrant/, traversal: /traversal|graph hop|payload/i } },
      { sub: 4, keys: { selectivity: /selectiv/i, nums: /0\.1|50|5%/ } },
      { sub: 5, keys: { indextypes: /bitmap|inverted|column/i, systems: /Qdrant|Pinecone|Weaviate|pgvector/ } },
    ];
    const results = [];
    for (const c of checks) {
      const body = document.body.innerText;
      const r = { sub: c.sub };
      for (const [k, rx] of Object.entries(c.keys)) r[k] = rx.test(body);
      results.push(r);
      const btn = document.querySelector("[data-subbtn]");
      if (btn) { btn.click(); await new Promise(r => setTimeout(r, 300)); }
    }
    return JSON.stringify(results);
  })();
  ```

  Adapt the regex set per chapter using each chapter's test block.

  Every field must be `true`.

- [ ] **Step 5:** Check console messages:

  ```
  mcp__claude-in-chrome__read_console_messages (pattern: "error|warning|Error|Warning", onlyErrors: false)
  ```

  Expected: only benign Vite / React DevTools informational messages.

- [ ] **Step 6:** For any content gap or console error: fix the chapter, re-run the unit tests for that chapter, re-verify in browser. If a fix is needed, commit it as `Browser-verified fix to chapter 11.XX`.

- [ ] **Step 7:** Stop the dev server:

  ```bash
  lsof -i :5173,5174,5175,5176,5177 -t | xargs kill -9 2>/dev/null
  ```

- [ ] **Step 8:** Commit any fixes (skip if none).

---

## Task 16: Final full-suite verification and coverage

**Files:** none.

- [ ] **Step 1:** Coverage run

  ```bash
  npx vitest run --coverage
  ```

  Expected: `vector-production.jsx` at 100% lines / 100% branches. Overall report may still show the pre-existing gaps in `attention-qkv.jsx`, `encoder-decoder-diagrams.jsx`, `transformer-block.jsx`, and `transformer-input.jsx` - those are Milestone-4 baseline and NOT in scope.

- [ ] **Step 2:** Lint

  ```bash
  npm run lint
  ```

  Expected: 0 errors.

- [ ] **Step 3:** Format

  ```bash
  npm run format
  ```

- [ ] **Step 4:** No em-dashes check

  ```bash
  grep -n "—" src/sections/vector-production.jsx
  grep -n "&mdash" src/sections/vector-production.jsx
  ```

  Expected: no matches.

- [ ] **Step 5:** No `C.card` Boxes

  ```bash
  grep -n "Box color={C.card}" src/sections/vector-production.jsx
  ```

  Expected: no matches.

- [ ] **Step 6:** Confirm test count

  ```bash
  npm run test 2>&1 | tail -5
  ```

  Expected: count is 1,916 baseline + 59 new content tests + 20 new generic "All chapters" entries (10 chapters x ~6 sub levels where they render something) + up to 9 new SVG-desc tests = roughly 2,000 tests passing.

- [ ] **Step 7:** (Do NOT push.) Per user instructions the `section-11-vector-databases` branch is held locally. Report milestone completion:
  - 10 new chapters (11.19-11.28) added.
  - Section 11 now shows 28 chapters in the TOC.
  - New file `vector-production.jsx` owns chapters 11.19-11.28.
  - Tests: count + passing status.
  - Coverage: line / branch on the new file.
  - Browser verification: issues found + fixes (if any).
  - Next: Milestone 6 (chapters 11.29-11.35, Act 6 System Selection, in a new `vector-systems.jsx`) to be planned in a fresh session.

---

## Self-Review Notes

**Spec coverage:** All ten Act 5 chapters from the spec are implemented. Sub-step counts match the spec: 6+6+6+5+6+6+6+6+6+6 = 59 sub-steps total. Milestone 6 (11.29-11.35) remains deferred.

**Type consistency check:**
- Component names match the spec's component-naming table exactly: `Filtering`, `UpdatesDeletes`, `Sharding`, `Replication`, `HybridSearch`, `Rerankers`, `MultiVectorRetrieval`, `EmbeddingLifecycle`, `Observability`, `CapacityPlanning`.
- Chapter ids match the spec: 11.19 through 11.28.
- Titles match the spec's chapter list (and the config.test.js expected array in Task 2).
- All colors used (C.cyan, C.yellow, C.green, C.orange, C.red, C.purple) exist in the palette.
- IVF, HNSW, and PQ defaults carry over unchanged from prior milestones where referenced (HNSW M=16, ef_search=50; IVF nlist=sqrt(N), nprobe=8; PQ m=96).
- New numbers introduced (RRF k=60, ~200 tokens/doc for ColBERT, 50 ms replication lag typical, P50/P95/P99 budget) are listed in the running-example section and consistent across the tasks that reference them.

**No placeholders:** Every sub-step has a concrete color, title, content specification, and test regex set. Implementation specifics for Task 3 (Filtering) are fully expanded; Tasks 4-12 use the same visual-design patterns documented in Task 3 plus per-chapter key numbers and labels. Test blocks are provided in full for Task 3 and as regex sets for Tasks 4-12 (the test block shape is identical; the executing agent translates each regex set into a `describe` block following the Task 3 template).

**Intentional deviations from Plan 3:**
- Larger scope (10 chapters vs 5), so this plan condenses per-chapter implementation details more aggressively while still being concrete.
- Three-file loader update (vs two-file in M3) since Section 11 now has three section files.
- One loader-update location, one `lookup.test.js` update, and one `sections.test.jsx` import to add - all bundled into Task 2.

**Running-example continuity:** The cat corpus, 768-dim scale math, HNSW/IVF/PQ parameters, N-scale anchors (1M / 100M / 1B), and memory baselines carry directly from Milestones 1-4. The new per-Act numbers (RRF k=60, ColBERT tokens/doc, replication lag, capacity numbers) are enumerated at the top of the plan and reused across tasks.

**Chapters that might end up text-only:** 11.22 Replication, 11.26 EmbeddingLifecycle, 11.27 Observability could reasonably be built from div cards alone if the implementer prefers, in which case omit them from `expectedChapters` and `svgChapters` in Task 13. The grep-count check in Task 13 Step 1 settles this.
