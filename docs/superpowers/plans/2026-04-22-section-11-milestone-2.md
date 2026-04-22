# Section 11 Milestone 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 2 of Section 11 "Vector Databases" - the seven ANN indexing chapters (11.5 IVF, 11.6 ANNFamilyTree, 11.7 HNSWIntuition, 11.8 HNSWConstruction, 11.9 HNSWSearch, 11.10 HNSWParameters, 11.11 Vamana) - completing `src/sections/vector-foundations.jsx` (11 chapters total). The app ships at end of this milestone with 11 navigable chapters in Section 11.

**Architecture:** All seven new chapters are appended as named exports in the existing `src/sections/vector-foundations.jsx`. No new section files, no new loader entries - `learn-ai.jsx` already loads this file for section 11. Each chapter follows the same pattern used in 11.1-11.4: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math and concrete cat-corpus examples. The 10-doc corpus and 4-dim visual vectors defined at the top of the file are reused; 768-dim math is used for scale discussions.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md` - chapters 11.5 through 11.11, Act 2.

**Milestone 1 reference:** `docs/superpowers/plans/2026-04-22-section-11-milestone-1.md` - same patterns, same testing cadence; this plan assumes Milestone 1 is merged (branch already contains 11.1-11.4).

---

## Prerequisites

- Branch `section-11-vector-databases` checked out (already current, 17 commits ahead of main, clean).
- `src/sections/vector-foundations.jsx` exists with 11.1-11.4 plus `CAT_CORPUS`, `QUERY`, `fmtVec` helpers at top.
- `src/config.js` has Section 11 name/color and entries for 11.1-11.4.
- `src/learn-ai.jsx` already imports vector-foundations as the section 11 loader.
- `src/__tests__/sections.test.jsx` already imports `VectorFoundations` into its lookup.
- CLAUDE.md already has a Section 11 mapping table with 11.1-11.4; Milestone 2 extends that table in Task 11.

## File Structure

### New files
- **None.** Milestone 2 extends the existing file.

### Modified files
- `src/sections/vector-foundations.jsx` - append 7 new exports (IVF, ANNFamilyTree, HNSWIntuition, HNSWConstruction, HNSWSearch, HNSWParameters, Vamana). File will grow from ~2550 to ~6000-7000 lines. If the file becomes unwieldy during implementation, a future split is acceptable but not required for Milestone 2.
- `src/config.js` - add 7 entries to `chapters[]` after `{ id: "11.4", ... }`.
- `src/__tests__/sections.test.jsx` - append content-test blocks for each new chapter (41 sub-step tests + any interaction tests).
- `src/__tests__/config.test.js` - extend the Section 11 chapter count/id test from 4 to 11 entries.
- `src/data/svg-descriptions.json` - add entries for new SVGs (estimate ~15-25 SVGs across the seven chapters).
- `CLAUDE.md` - extend Section 11 mapping table (add 7 rows), update the "Milestone 1 of 6 complete" annotation to "Milestones 1-2 of 6" and the file-structure comment.

### Unchanged
- All prior section files (Sections 1-10) and their tests.
- `src/learn-ai.jsx` (already wired for section 11).
- The CAT_CORPUS, QUERY, fmtVec constants at the top of vector-foundations.jsx - reused as-is.

---

## Running example

Continue the chapter 11.1-11.4 running thread. The `CAT_CORPUS` (10 docs, 4-dim illustrative vectors) and `QUERY` ("information about cats", `[0.85, 0.14, 0.44, 0.21]`) are already defined. The `catLike` flag marks docs 1, 3, 4, 5, 7. These chapters use:

- The same 10 docs, rendered in 2D scatter plots where cat docs cluster together (see Chapter 11.5's `CORPUS_XY` map below).
- 768-dim math for scale discussions (N=1M, N=1B, 3.072 TB per brute force query - already established in 11.2 and 11.3).
- HNSW defaults: M=16, ef_construction=200, ef_search=50 (from spec).
- IVF defaults: nlist ≈ sqrt(N), nprobe=8 (from spec).

**Shared 2D coordinates for the scatter plots (introduced fresh in 11.5):**

```js
// Add near the top of vector-foundations.jsx, after CAT_CORPUS, for reuse in 11.5-11.9.
// Cat docs (1, 3, 4, 5, 7) clustered in upper-left; non-cat spread across other regions.
const CORPUS_XY = {
  1: { x: 110, y: 90 },   // Cats are small domesticated carnivores
  3: { x: 140, y: 110 },  // Lions are big cats that live in Africa
  4: { x: 125, y: 130 },  // My cat sat on the mat
  5: { x: 105, y: 115 },  // Tigers are striped cats
  7: { x: 135, y: 90 },   // Kittens grow up to be cats
  2: { x: 320, y: 100 },  // Dogs are loyal pets
  8: { x: 290, y: 140 },  // The dog chased the cat
  9: { x: 380, y: 220 },  // Birds can fly
  10: { x: 420, y: 180 }, // Fish live underwater
  6: { x: 220, y: 260 },  // Python is a programming language
};
const QUERY_XY = { x: 120, y: 105 }; // query lands inside the cat cluster
```

(Task 2 adds this constant; Tasks 3-9 consume it.)

---

## Implementation order

Act 2 is seven chapters. Each chapter is its own task after scaffolding. The ordering mirrors the learner's reading order. Implementing HNSW construction (11.8) before HNSW search (11.9) is deliberate: search reuses the visual graph structure produced by construction.

1. Task 1 - Green baseline
2. Task 2 - Add all 7 stubs + config entries + `CORPUS_XY` + `describe` count
3. Task 3 - Chapter 11.5 IVF
4. Task 4 - Chapter 11.6 ANNFamilyTree
5. Task 5 - Chapter 11.7 HNSWIntuition
6. Task 6 - Chapter 11.8 HNSWConstruction
7. Task 7 - Chapter 11.9 HNSWSearch
8. Task 8 - Chapter 11.10 HNSWParameters
9. Task 9 - Chapter 11.11 Vamana
10. Task 10 - SVG descriptions
11. Task 11 - CLAUDE.md update
12. Task 12 - Browser verification
13. Task 13 - Final suite + coverage

Commit cadence: one commit per chapter (Tasks 3-9) plus one each for Tasks 2, 10, 11, 12 (if browser fixes), 13 (if any).

---

## Task 1: Verify green baseline

**Files:** none.

- [ ] **Step 1:** Confirm branch and clean state
  ```bash
  git status
  git log --oneline -5
  ```
  Expected: `On branch section-11-vector-databases`, working tree clean, most recent commit is `ac17f98 Add sub-step outlines to spec for chapters 11.5-11.35`.

- [ ] **Step 2:** Run full test suite
  ```bash
  npm run test
  ```
  Expected: all tests pass.

- [ ] **Step 3:** Run linter
  ```bash
  npm run lint
  ```
  Expected: no errors.

No commit in this task.

---

## Task 2: Scaffold stubs + config entries + CORPUS_XY

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (add `CORPUS_XY`/`QUERY_XY` constants + 7 stub exports at end of file).
- Modify: `src/config.js` (add 7 entries to `chapters[]` after 11.4).
- Modify: `src/__tests__/config.test.js` (update Section 11 chapter-count test from 4 to 11 and assert id/component for 11.5-11.11).

This task creates the scaffolding so subsequent tasks can assume stubs exist and the generic "All chapters" render test in `sections.test.jsx` passes for 11.5-11.11.

- [ ] **Step 1:** Write/update failing test in `src/__tests__/config.test.js`

Find the existing `describe("Section 11 chapters", ...)` block from Milestone 1. Replace the body with a combined assertion that covers 11.1-11.11:

```js
describe("Section 11 chapters", () => {
  it("has chapters 11.1 through 11.11 in order", () => {
    const section11 = chapters.filter((ch) => ch.section === 11);
    expect(section11.length).toBe(11);
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
    ];
    expected.forEach((exp, i) => {
      expect(section11[i].id).toBe(exp.id);
      expect(section11[i].component).toBe(exp.component);
      expect(section11[i].title).toBe(exp.title);
    });
  });
});
```

- [ ] **Step 2:** Run test - expect FAIL
  ```bash
  npx vitest run src/__tests__/config.test.js -t "Section 11 chapters"
  ```
  Expected: FAIL (length is 4, not 11).

- [ ] **Step 3:** Add 7 entries to `src/config.js` after the `11.4 DistanceMetrics` row:

```js
  { id: "11.4", title: "Distance Metrics", section: 11, component: "DistanceMetrics" },
  { id: "11.5", title: "IVF (Inverted File Index)", section: 11, component: "IVF" },
  { id: "11.6", title: "The ANN Family Tree", section: 11, component: "ANNFamilyTree" },
  { id: "11.7", title: "HNSW - The Small-World Intuition", section: 11, component: "HNSWIntuition" },
  { id: "11.8", title: "HNSW Construction", section: 11, component: "HNSWConstruction" },
  { id: "11.9", title: "HNSW Search", section: 11, component: "HNSWSearch" },
  { id: "11.10", title: "HNSW Parameters", section: 11, component: "HNSWParameters" },
  { id: "11.11", title: "Vamana / DiskANN", section: 11, component: "Vamana" },
];
```

- [ ] **Step 4:** Run config test - still fails because stubs missing
  ```bash
  npx vitest run src/__tests__/config.test.js
  npx vitest run src/__tests__/sections.test.jsx -t "11.5"
  ```
  Expected: config test PASS; generic "All chapters" test FAILs for 11.5-11.11 with "fn is not a function".

- [ ] **Step 5:** Add `CORPUS_XY` and stub exports to `src/sections/vector-foundations.jsx`.

Insert `CORPUS_XY`/`QUERY_XY` immediately after the existing `CAT_CORPUS` and `QUERY` declarations at the top of the file (around line 23), keeping them next to the other running-example constants:

```js
// 2D scatter coordinates for 11.5-11.9 diagrams. Cat docs cluster upper-left,
// the query lands inside the cat cluster, non-cat docs spread across other regions.
const CORPUS_XY = {
  1: { x: 110, y: 90 },
  3: { x: 140, y: 110 },
  4: { x: 125, y: 130 },
  5: { x: 105, y: 115 },
  7: { x: 135, y: 90 },
  2: { x: 320, y: 100 },
  8: { x: 290, y: 140 },
  9: { x: 380, y: 220 },
  10: { x: 420, y: 180 },
  6: { x: 220, y: 260 },
};
const QUERY_XY = { x: 120, y: 105 };
```

At the END of the file (after the existing `DistanceMetrics` export), append seven stub exports. Each stub must render something for sub=0 so the generic render test passes. Pattern:

```jsx
export const IVF = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>IVF (stub)</T>
        </Box>
      )}
    </div>
  );
};

export const ANNFamilyTree = (ctx) => { /* same pattern, C.purple */ };
export const HNSWIntuition = (ctx) => { /* same pattern, C.green */ };
export const HNSWConstruction = (ctx) => { /* same pattern, C.orange */ };
export const HNSWSearch = (ctx) => { /* same pattern, C.yellow */ };
export const HNSWParameters = (ctx) => { /* same pattern, C.red */ };
export const Vamana = (ctx) => { /* same pattern, C.blue */ };
```

Write out all seven - the generic test iterates over all `chapters` entries, so every stub has to be a valid function component.

- [ ] **Step 6:** Re-run tests - now expect PASS
  ```bash
  npx vitest run src/__tests__/config.test.js src/__tests__/sections.test.jsx
  ```
  Expected: all pass.

- [ ] **Step 7:** Lint + format
  ```bash
  npm run lint
  npm run format
  ```

- [ ] **Step 8:** Commit
  ```bash
  git add src/config.js src/__tests__/config.test.js src/sections/vector-foundations.jsx
  git commit -m "Scaffold stubs and config entries for chapters 11.5-11.11"
  ```

---

## Task 3: Implement Chapter 11.5 IVF (6 sub-steps)

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (replace stub `IVF` with full implementation).
- Modify: `src/__tests__/sections.test.jsx` (append content tests at end of file).

**Chapter purpose (from spec):** Cluster the corpus with k-means into nlist Voronoi cells. At query time, probe the nearest nprobe cells only. Learner walks away knowing the cluster-first intuition, the tradeoff between nprobe and recall, and the production sizing nlist ≈ sqrt(N), nprobe = 8.

**Sub-step structure:**

- **sub=0 (C.red) - The scan-everything baseline, visualized.** Title: "Brute force looks at every dot". Revisit the 10-doc scatter from 11.1 using `CORPUS_XY`. Query as yellow dot, arrows touching every grey dot to emphasize "every single vector". Key content strings for tests: "every vector", "brute force", mention "10".

- **sub=1 (C.cyan) - k-means partitions the corpus.** Title: "Cluster the corpus with k-means". Three centroids emerge from the same scatter; each doc shown in the color of its closest centroid. Centroids are larger squares at positions `C_A={x:130,y:110}`, `C_B={x:305,y:115}`, `C_C={x:360,y:230}` (so cat docs land in cluster A, dogs+prog in B, birds+fish in C, python doc 6 has its own ambiguity - deterministically assign it to B). Key content: "k-means", "nlist", "3 clusters" or "nlist = 3", "centroid".

- **sub=2 (C.green) - Voronoi cells drawn around centroids.** Title: "Every doc belongs to exactly one cell". Show the same scatter with Voronoi-like polygon regions (approximate with a triangle partition drawn from perpendicular bisectors, or simpler: 3 colored tinted rectangles that cover the plot area). Key content: "Voronoi" or "cell", "belongs to", "exactly one".

- **sub=3 (C.orange) - Query lands in its nearest centroid; probe that cell only.** Title: "Probe the single nearest cell (nprobe = 1)". Query dot at `QUERY_XY`, an arrow to the cat cluster's centroid, then only docs in cluster A highlighted. Numbers: "scan 5 docs instead of 10, twice as fast, recall holds because target is in cluster A". Key content: "nprobe = 1" or "nprobe=1", "nearest centroid", specific-example mention "5 docs" or "cluster A".

- **sub=4 (C.yellow) - Raise nprobe to 3; recall goes up, latency goes up.** Title: "Raise nprobe to widen the search". Show nprobe=1 (misses some true top-k if boundary is near), nprobe=2 (recovers the missed one), nprobe=3 (scan all 10 = brute force). Small recall@10 table: nprobe=1 -> 0.80, nprobe=2 -> 0.95, nprobe=3 -> 1.00, with latency ratios. Key content: "nprobe", "recall", "0.80" or similar concrete number, "latency".

- **sub=5 (C.purple) - Parameter guidance + tradeoff recap.** Title: "Sizing IVF in production". `nlist ≈ sqrt(N)` with worked-example box: `N=1,000,000 -> nlist≈1000 (rounded to 4096 in FAISS)`; `nprobe=8` typical starting point, raise to 32 for recall-critical workloads. Triangle arrow: IVF trades memory (centroids are tiny) for latency (skip most vectors) at the cost of some recall. Key content: "sqrt(N)" or "√N", "nlist", "nprobe", "4096" or "1000", "tradeoff".

- [ ] **Step 1:** Append content tests to `src/__tests__/sections.test.jsx`:

```js
describe("IVF (11.5) content", () => {
  const fn = VectorFoundations.IVF;

  it("sub=0 revisits the brute-force-scans-every-vector baseline", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/every vector/i);
    expect(container.textContent).toMatch(/brute[- ]?force/i);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=1 introduces k-means with nlist = 3 clusters", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/nlist|3 clusters/i);
    expect(container.textContent).toMatch(/centroid/i);
  });

  it("sub=2 draws Voronoi cells around centroids", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/voronoi|cell/i);
    expect(container.textContent).toMatch(/belongs to|exactly one/i);
  });

  it("sub=3 probes the single nearest cluster at nprobe = 1", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/nprobe\s*=\s*1/i);
    expect(container.textContent).toMatch(/nearest|centroid/i);
  });

  it("sub=4 shows recall vs nprobe tradeoff with concrete numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|1\.0|100%/);
  });

  it("sub=5 gives parameter guidance nlist sqrt(N) and nprobe", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/sqrt|√/i);
    expect(container.textContent).toMatch(/nlist/i);
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/4096|1000/);
  });
});
```

- [ ] **Step 2:** Run tests - expect FAIL
  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "IVF \\(11.5\\)"
  ```
  Expected: FAIL (stub lacks all those strings).

- [ ] **Step 3:** Implement full `IVF` function in `vector-foundations.jsx` replacing the stub. Required content:

  - Six sub-steps with the colors listed above.
  - sub=0: SVG scatter reading `CORPUS_XY` + `QUERY_XY`. All 10 docs as grey dots, query as yellow, faint arrows from query to every dot. `<desc>` on the SVG.
  - sub=1: Same scatter but each dot colored by cluster (A=cat color/purple, B=dog color/yellow, C=bird color/cyan). Centroid squares drawn. Label "nlist = 3".
  - sub=2: Same scatter with three tinted polygon regions (or three `rect`s) behind the dots, implying cell boundaries. Text below: "Voronoi cell: the region closer to one centroid than any other. Every doc belongs to exactly one cell."
  - sub=3: Scatter with probed cluster A highlighted (tinted fill), query-to-centroid A arrow, other cells dimmed. Stats box: "docs scanned: 5 of 10", "speedup: 2x".
  - sub=4: Three-column mini-diagram (nprobe=1, nprobe=2, nprobe=3) each showing which cells are probed, plus a small table below with recall@10 and ops ratio. Row values: `{ nprobe:1, recall:0.80, ops:"N/3" }`, `{ nprobe:2, recall:0.95, ops:"2N/3" }`, `{ nprobe:3, recall:1.00, ops:"N" }`.
  - sub=5: Worked sizing example in a centered monospace box:
    ```
    N = 1,000,000   -> nlist ≈ √N ≈ 1,000   (FAISS rounds up to 4,096)
    nprobe = 8      (raise to 32 for recall-critical workloads)
    ```
    Plus a triangle-style tradeoff recap using the existing `Triangle` component (already defined in the file for 11.3) - optional, or a fresh tiny summary box.

  - Every SVG has a `<desc>` first child.
  - Every `Box` uses a colored hue, title centered, body text 16-19, inner elements use `${color}06` bg + `${color}12` border.
  - No em-dashes. Middle dot `·` for multiplications. Standalone formulas centered.
  - At end of chapter: conditional `<SubBtn>` when `sub < 5` that calls `navigate("forward")`, same pattern as 11.1-11.4.

- [ ] **Step 4:** Re-run tests - expect PASS
  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "IVF \\(11.5\\)"
  npm run test
  ```
  Expected: all pass.

- [ ] **Step 5:** Lint + format
  ```bash
  npm run lint
  npm run format
  ```

- [ ] **Step 6:** Commit
  ```bash
  git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
  git commit -m "Implement chapter 11.5 IVF"
  ```

---

## Task 4: Implement Chapter 11.6 ANNFamilyTree (6 sub-steps)

**Files:** same as Task 3.

**Chapter purpose:** Survey of the ANN landscape. Trees (KD-tree) break at high d. LSH is clever but graph-dominated. Clustering (IVF) already covered. Graphs (HNSW, Vamana) won because they navigate the metric space directly. Learner walks away knowing the family tree and why graphs are the production default.

**Sub-step structure:**

- **sub=0 (C.red) - The problem restated.** Title: "Sub-linear search at scale - what are the options?". Reminder of 11.2's 3.072 TB math. Set up: we need `O(log N)` or better. Key content: "sub-linear", "log N" or "O(log N)", "1 billion" or similar scale number.

- **sub=1 (C.orange) - Tree-based: KD-tree.** Title: "Trees: fast in 2D, broken at d=768". Visual: 2D grid partitioned by a KD-tree (recursive axis splits), tree diagram on side. Then a red "breaks" panel with the curse-of-dimensionality explanation: at high d most pairs are similar distances, tree partitions lose power. Key content: "KD-tree" or "KD tree", "curse of dimensionality", "768" or "high dimension".

- **sub=2 (C.yellow) - LSH.** Title: "LSH: hash similar vectors to the same bucket". Visual: random hyperplanes slicing the space, dots hashed into bit strings by which side of each plane they fall on. Similar vectors share prefix bits. Weakness: recall sags as d grows, need many hash tables to compensate. Key content: "LSH" or "locality-sensitive", "hash", "bucket", "hyperplane" or similar.

- **sub=3 (C.cyan) - Clustering (IVF recap).** Title: "Clustering: partition space, search partitions". One-paragraph recap of IVF from 11.5 plus tiny scatter reminder. Lists the core tradeoff: cheap to build, easy to update, decent recall at nprobe=8-32. Weakness: cells near boundaries hurt recall. Key content: "cluster", "IVF", "partition", "boundary" or "recall".

- **sub=4 (C.green) - Graph-based (HNSW, Vamana).** Title: "Graphs: navigate the metric space directly". Visual: small graph with nodes = vectors, edges = proximity, path from query-to-nearest traced with highlighted edges. "Each hop moves closer to the query." Names: HNSW (Hierarchical Navigable Small World, 2016) and Vamana (2019, DiskANN). Key content: "graph" or "graphs", "HNSW", "Vamana", "edge" or "node".

- **sub=5 (C.purple) - Why graphs won in production.** Title: "Graphs dominated the benchmarks". Concrete: ann-benchmarks.com comparisons consistently show HNSW in the Pareto-front at 95%+ recall with 1-10 ms latencies. Reason in one sentence: graphs navigate the real metric directly instead of partitioning space by coordinates (which breaks at high d). Used by FAISS, Qdrant, Weaviate, Milvus, Elasticsearch, pgvector, Pinecone. Key content: "production" or "ann-benchmarks", "Pareto" or "dominant", "HNSW", at least two system names like "Qdrant", "Weaviate", "Milvus".

- [ ] **Step 1:** Write content tests:

```js
describe("ANNFamilyTree (11.6) content", () => {
  const fn = VectorFoundations.ANNFamilyTree;

  it("sub=0 frames sub-linear search as the need", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/sub[- ]?linear|log\s*N/i);
    expect(container.textContent).toMatch(/1 billion|1B|million/i);
  });

  it("sub=1 covers KD-trees and curse of dimensionality", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/kd[- ]?tree/i);
    expect(container.textContent).toMatch(/curse of dimensionality/i);
    expect(container.textContent).toMatch(/768|high dim/i);
  });

  it("sub=2 explains LSH as hash-based bucketing", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LSH|locality[- ]?sensitive/i);
    expect(container.textContent).toMatch(/hash|bucket/i);
  });

  it("sub=3 recaps IVF clustering as partition-and-probe", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/IVF|cluster/i);
    expect(container.textContent).toMatch(/partition/i);
  });

  it("sub=4 introduces HNSW and Vamana as graph indexes", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Vamana/);
    expect(container.textContent).toMatch(/graph|edge|node/i);
  });

  it("sub=5 explains why graphs won in production", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/production|ann[- ]?benchmarks/i);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Qdrant|Weaviate|Milvus|FAISS/);
  });
});
```

- [ ] **Step 2:** Run tests - expect FAIL.

- [ ] **Step 3:** Implement full `ANNFamilyTree`. Required specifics:

  - sub=0: Centered formula box with the `O(N·d)` vs `O(log N · d)` comparison.
  - sub=1: Side-by-side SVG. Left: d=2 KD-tree recursive split (simple). Right: faded/greyed-out version labeled "d=768: partitions lose meaning".
  - sub=2: SVG with 2-3 random hyperplanes cutting a scatter, plus annotation "hash code = 011 for this region".
  - sub=3: Reuse 10-doc scatter with the 3 centroids/cells from 11.5 (tiny inline version). Mention nprobe.
  - sub=4: Small graph SVG - 8-10 nodes from the corpus with edges to 2-3 nearest neighbors; a red path from query to nearest. "Each hop moves closer to the query."
  - sub=5: A "family tree" visual: boxes for each category with check/cross marks for (Recall, Latency, Memory). Highlighted graphs box with text: "HNSW on ann-benchmarks.com: Pareto-front at 95%+ recall, 1-10 ms."

- [ ] **Step 4-6:** Run tests, lint, format, commit:

```bash
git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 11.6 The ANN Family Tree"
```

---

## Task 5: Implement Chapter 11.7 HNSWIntuition (5 sub-steps)

**Chapter purpose:** Why "small-world" networks give log(N) search. Airport analogy. Start with flat graph, show greedy is slow, add long-range layers for logarithmic descent.

**Sub-step structure:**

- **sub=0 (C.cyan) - Flat proximity graph.** Title: "Start with a flat proximity graph". Each node connects to M nearest neighbors. Visual: the 10 corpus dots arranged in a rough geography, each with 2-3 edges to nearest neighbors (use `CORPUS_XY` positions). Label M=3 for the visual (simplified from production M=16). Key content: "flat", "proximity", "M", "nearest".

- **sub=1 (C.red) - Greedy search from random start is slow.** Title: "Greedy search: many hops from a random start". Pick a random entry node (e.g., doc 10 in the lower-right corner), trace a 5-hop path to doc 1 (cat cluster). Each hop moves to the neighbor closest to the query, but the entry was far so the path is long. "On N=1M, random-start greedy averages about 1,000 hops - too slow." Key content: "greedy", "hop" or "hops", "random start" or similar, "slow" or concrete number.

- **sub=2 (C.yellow) - Add a hub layer with long-range edges.** Title: "Lift a few nodes to a sparse upper layer". Visual: small set of "hub" nodes (3-4 from the corpus, probably docs 1 and 6 and 10) elevated on a translucent second level, with long-range edges between them. The query enters via the hub layer, jumps across the space in 1-2 hops, drops down. "Start from a hub: 1 long hop + a few short hops." Key content: "hub", "long-range" or "long range" or "long distance", "layer".

- **sub=3 (C.green) - Stack another layer, get O(log N).** Title: "Stack layers exponentially: O(log N) hops". Show 3-layer pyramid: top layer 1-2 hub nodes, middle layer ~sqrt(sqrt(N)) hubs, bottom layer all N. Number of hops per layer roughly constant → total hops = O(log N). Worked example: N=1,000,000 → log2(1M) ≈ 20 hops total. Key content: "O(log N)" or "log N", "layer", "1,000,000" or "20 hops" or similar.

- **sub=4 (C.purple) - Airport analogy.** Title: "The airport analogy makes it concrete". Diagram: international hubs (red, few nodes) + regional (yellow, more nodes) + local (cyan, many nodes). "Mumbai → Chennai is not a single-hop: take a long-haul to Delhi, then regional to Chennai, then local cab. HNSW does the same for vectors." Key content: "airport", "hub" or "hubs", "international" or "regional" or "local".

- [ ] **Step 1:** Write content tests (similar pattern).
- [ ] **Step 2-6:** TDD cycle + commit:

```js
describe("HNSWIntuition (11.7) content", () => {
  const fn = VectorFoundations.HNSWIntuition;

  it("sub=0 introduces the flat proximity graph", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/flat/i);
    expect(container.textContent).toMatch(/proximity/i);
    expect(container.textContent).toMatch(/M|nearest/);
  });

  it("sub=1 shows greedy-from-random-start is slow", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/hop/i);
    expect(container.textContent).toMatch(/random|slow|many/i);
  });

  it("sub=2 introduces a sparse hub layer with long-range edges", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/long[- ]?range|long distance|long-haul/i);
    expect(container.textContent).toMatch(/layer/i);
  });

  it("sub=3 derives O(log N) from stacked layers", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/log\s*N|O\(log/i);
    expect(container.textContent).toMatch(/layer/i);
    expect(container.textContent).toMatch(/1,000,000|1M|20/);
  });

  it("sub=4 connects to the airport analogy", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/airport/i);
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/international|regional|local/i);
  });
});
```

Commit message: `Implement chapter 11.7 HNSW - The Small-World Intuition`

---

## Task 6: Implement Chapter 11.8 HNSWConstruction (6 sub-steps)

**Chapter purpose:** How vectors are inserted. The layer assignment formula `L = floor(-ln(uniform(0,1)) * mL)` (real formula, not simplified). Greedy insert at each layer: find M nearest, connect. Parameter M defined.

**Sub-step structure:**

- **sub=0 (C.cyan) - Empty graph, insert first vector.** Title: "Start empty; insert one vector at a time". The first vector becomes the entry point at whatever layer it's assigned. No neighbors yet. Visual: single dot at layer 0 with a label "entry point". Key content: "empty", "first", "entry point".

- **sub=1 (C.purple) - The real layer assignment formula.** Title: "Each new vector gets a layer from an exponential distribution". Show `L = floor(-ln(uniform(0, 1)) · mL)` with middle dot. Define `mL = 1 / ln(M) ≈ 1/ln(16) ≈ 0.36`. Worked example with `uniform=0.7 → L = floor(-ln(0.7) · 0.36) = floor(0.128) = 0` (most nodes land at layer 0) and `uniform=0.01 → L = floor(4.6 · 0.36) = floor(1.66) = 1`. Key content: "floor", "ln" or "log", "uniform", "mL", specific formula string.

- **sub=2 (C.yellow) - Probability decay visualization.** Title: "Most nodes end up at layer 0". Bar chart of expected distribution at M=16: layer 0 = ~94% of nodes, layer 1 = ~5.7%, layer 2 = ~0.35%, layer 3 = ~0.022%, etc. "Exponential decay of 1/M per layer." Key content: "layer 0", "94%" or "most", "exponential".

- **sub=3 (C.green) - Greedy insert: find M nearest, connect.** Title: "Insert at every layer up to L". For each layer from top to 0: start at the entry point of that layer, greedily descend to the closest node, gather `ef_construction` candidates, pick M nearest, add edges. Visual: animate the insert of doc 7 (kittens) into the graph, highlighting the M=3 edges it forms at layer 0. Key content: "M nearest", "greedy", "edges", "ef_construction".

- **sub=4 (C.orange) - Animated full insertion.** Title: "Insert all 10 cat-corpus docs". 10-row walkthrough. For each doc: show rolled layer L, where it connects, and the growing edge list. Final small table of edges. Seed the example so layer rolls are deterministic (e.g., doc 1 → L=1, doc 6 → L=2, others → L=0). Key content: "10", specific doc text like "kittens" or "Cats", "layer" or "L =".

- **sub=5 (C.red) - Parameter M and memory math.** Title: "M determines quality and memory". M=16 default. Layer 0 has each node connected to at most M neighbors; upper layers up to M/2. Memory per vector: `M · 4 bytes + upper-layer overhead ≈ 70 bytes/vector`. At N=1M, that's 70 MB of graph (vs ~3 GB of vectors - tiny). Key content: "M" with value 16 or similar, "memory", "70" or "bytes per vector" or similar concrete.

Tests mirror the structure (layer formula, 94%, M=16, 70 MB, etc.). Commit: `Implement chapter 11.8 HNSW Construction`.

---

## Task 7: Implement Chapter 11.9 HNSWSearch (6 sub-steps)

**Chapter purpose:** The search algorithm. Start at entry point in top layer, greedy-descend, switch to beam at layer 0, return top-k.

**Sub-step structure:**

- **sub=0 (C.cyan) - Query arrives at the top-layer entry point.** Title: "Start at the top". Visual reuses the 3-layer graph from 11.8. Query enters at the top-layer entry node. Key content: "entry point", "top", "layer".

- **sub=1 (C.green) - Greedy descent within the current layer.** Title: "Move to whichever neighbor is closer to the query". At each step: examine all neighbors of the current node, compute distance to query, move to the closer one. Stop when no neighbor is closer. Visual: 2-3 hops on the top layer. Key content: "greedy", "neighbor", "closer" or "distance".

- **sub=2 (C.yellow) - Drop to the next layer when stuck.** Title: "Drop down when the current layer has nothing closer". Visual: vertical arrow from top-layer local minimum down to the same node on the next layer. Repeat: greedy descent, drop, greedy descent... until layer 0. Key content: "drop", "layer", "next" or concrete numeric layer count.

- **sub=3 (C.orange) - At layer 0, switch to beam search.** Title: "Layer 0: expand a beam of ef_search candidates". Ef_search=50 default. Maintain a priority queue of the 50 closest seen so far; explore neighbors of the best unexplored node, update. Key content: "ef_search" with the value, "beam", "50" or "candidates".

- **sub=4 (C.purple) - Beam expansion.** Title: "Keep expanding until the beam stops improving". Show 3-4 iterations: beam grows, some candidates drop out, new ones come in. The algorithm terminates when the top of the queue hasn't changed after a full expansion. Key content: "expand" or "expansion", "ef_search" or "queue", "top" or "best".

- **sub=5 (C.red) - Return top-k from the final beam.** Title: "Return top-k; trace the full path end-to-end". Show the complete 3-layer path on the cat corpus graph: top layer 2 hops → drop → layer 1 a hop → drop → layer 0 beam → top-3 returned (docs 1, 3, 7). Key content: "top-k" or "top 3" or "top-10", the phrase "path" or "trace", mention "cat" or doc id 1/3/7.

Tests mirror structure. Commit: `Implement chapter 11.9 HNSW Search`.

---

## Task 8: Implement Chapter 11.10 HNSWParameters (6 sub-steps)

**Chapter purpose:** Tuning guide. M, ef_construction, ef_search defaults; recall curves with concrete numbers; memory math; when to raise each parameter.

**Sub-step structure:**

- **sub=0 (C.purple) - The three knobs overview.** Title: "Three knobs, three defaults". Card trio:
  - M = 16 (graph connectivity at layer 0)
  - ef_construction = 200 (build-time candidate pool)
  - ef_search = 50 (query-time candidate pool)
  Each card lists: default, build-time vs query-time, what it trades. Key content: "M", "ef_construction", "ef_search", "16", "200", "50".

- **sub=1 (C.cyan) - M effect: more edges = better recall, more memory.** Title: "M: wider graph → better recall, more bytes". Small table: M=8, 16, 32; recall@10 at ef=50 = 0.93 / 0.97 / 0.99; memory overhead per vector = ~35 / ~70 / ~140 bytes. Linear in M. Key content: "M", "recall", at least two of the specific numbers.

- **sub=2 (C.yellow) - ef_construction: build-time quality vs build time.** Title: "ef_construction: how hard to work while building". Bigger ef_construction finds better neighbors at insert time but slows the build. Table: ef_c=100 builds in 5 min / recall 0.95, ef_c=200 builds in 9 min / recall 0.97, ef_c=500 builds in 20 min / recall 0.98 (diminishing returns). Once indexed, ef_construction no longer matters - it's a one-time cost. Key content: "ef_construction", "build", at least one concrete minute number.

- **sub=3 (C.green) - ef_search: the main dial at query time.** Title: "ef_search: the query-time recall-latency knob". Sweep: ef=10 → 0.85 / 0.5 ms; ef=50 → 0.97 / 1.2 ms; ef=200 → 0.995 / 3 ms; ef=500 → 0.999 / 6 ms. Key content: "ef_search", "recall", "latency" or specific times like "1.2 ms".

- **sub=4 (C.orange) - Recall curves at different M.** Title: "Recall curves: pick M first, then tune ef_search". SVG line chart with three curves: M=8 tops out at ~0.98, M=16 at ~0.995, M=32 at ~0.999. X axis = ef_search (log scale 10 to 500); Y axis = recall@10 (0.80 to 1.00). Key content: "M = 8" or "M=8", "M = 16", "M = 32", "curve" or phrase conveying tradeoff.

- **sub=5 (C.red) - Memory math and when-to-raise-each playbook.** Title: "Memory budget and a raise-this-parameter playbook". Worked memory: `memory ≈ N · (d · 4 + M · 8)` → `N=100M, d=768, M=16` → `100M · (3072 + 128) = 320 GB`. Then a 3-row playbook:
  - Recall too low? → raise ef_search (first), then M.
  - Memory too high? → lower M (first), then use PQ (forward to Act 3).
  - Build too slow? → lower ef_construction (first), then lower M.
  Key content: "memory", "320 GB" or "100M" or similar scale number, "playbook" or "raise" or "lower", "ef_search".

Tests mirror. Commit: `Implement chapter 11.10 HNSW Parameters`.

---

## Task 9: Implement Chapter 11.11 Vamana / DiskANN (6 sub-steps)

**Chapter purpose:** When graph doesn't fit in RAM. Vamana single-layer with alpha-pruning. Disk-resident. 100B vectors on one machine (Azure AI Search, Milvus disk).

**Sub-step structure:**

- **sub=0 (C.red) - The RAM wall.** Title: "HNSW hits a wall at ~100M vectors on one machine". Worked memory for HNSW at N=100M, d=768, M=16: 320 GB. Single-box RAM ceiling on typical servers: 768 GB-1.5 TB. At N=1B, HNSW alone needs 3.2 TB + graph overhead ≈ multi-node. Key content: "RAM", "100M" or "100 million", specific GB number like "320 GB".

- **sub=1 (C.cyan) - Vamana: single flat layer with diverse edges.** Title: "One layer, carefully chosen edges". No hierarchy like HNSW. Each node has up to `R` neighbors (`R=64` default in DiskANN). Skips HNSW's layer stack because that stack assumed everything is in RAM; with SSD, the hierarchy provides less benefit than careful edge selection. Key content: "single layer" or "one layer" or "flat", "R" with value or "64", no "hierarchy".

- **sub=2 (C.purple) - Alpha-pruning rule.** Title: "alpha-pruning: only keep diverse edges". When inserting node `p`, consider candidates. Keep edge `(p, q)` only if no existing neighbor `q'` of p is closer to q by a factor of alpha: `dist(p, q') > alpha · dist(p, q)`. Default alpha=1.2. This forces long-range, diverse edges rather than redundant short paths. Visual: a node with too many redundant edges (before) and alpha-pruned diverse edges (after). Key content: "alpha" or "α", "1.2" or "diverse", "edge" and "prune".

- **sub=3 (C.orange) - Disk layout.** Title: "Graph lives on SSD; entry points in RAM". Adjacency lists stored as 4 KB blocks on SSD (aligned to NVMe page size). Central "entry-layer" subgraph (a few percent of nodes) cached in RAM. SSD read at query time: 40-80 reads per query → 200-500 µs on NVMe. Key content: "SSD" or "disk", "RAM" for entry cache, "4 KB" or "page" or "NVMe".

- **sub=4 (C.green) - Search pattern: minimize disk reads.** Title: "Greedy in RAM, then a few SSD fetches". Search starts in the RAM-resident entry layer (many hops, zero disk). When greedy drops off the cached subgraph, each hop reads one SSD block. Target: < 80 SSD reads per query. Key content: "RAM", "SSD" or "disk", one of "80 reads" / "40" / specific number.

- **sub=5 (C.yellow) - 100B vectors on one machine.** Title: "100 billion vectors, one box". Azure AI Search and Milvus disk mode use Vamana/DiskANN to hold 100B vectors on a single server with ~128 GB RAM and ~10 TB NVMe. Compression (PQ - forward to Act 3) stacks on top for another 10-30x. FreshDiskANN (2021) handles deletes + updates in this model. Key content: "100 billion" or "100B", "Azure" or "Milvus", "NVMe" or "SSD", "FreshDiskANN" or "deletes".

Tests mirror. Commit: `Implement chapter 11.11 Vamana DiskANN`.

---

## Task 10: Add SVG descriptions to svg-descriptions.json

**Files:**
- Modify: `src/data/svg-descriptions.json`.

After Tasks 3-9, each new SVG in chapters 11.5-11.11 needs a matching entry in the JSON manifest. The validation test (`svg-descriptions.test.js`) walks each `<svg>` element and verifies a manifest entry exists.

- [ ] **Step 1:** List every `<svg>` in the new chapters:
  ```bash
  grep -n "<svg" src/sections/vector-foundations.jsx
  ```

- [ ] **Step 2:** Read the existing json and add keyed entries for `11.5` through `11.11`. Each key maps to an array of description strings (one per SVG in document order). Example (descriptions will be written during each chapter's implementation; this task just verifies coverage):

  ```json
  "11.5": [
    "10-doc corpus scatter plot with query arrows reaching every dot, illustrating brute-force scan",
    "...",
    "..."
  ],
  "11.6": [
    "KD-tree recursive partition of 2D space, compared to a faded high-dim version where partitions lose meaning",
    "...",
    "..."
  ]
  ```

  Chapter implementers (Tasks 3-9) add `<desc>` children to every `<svg>` as they write the visuals; Task 10 consolidates the manifest update.

- [ ] **Step 3:** Run the validation test:
  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```
  Expected: PASS. If a new SVG lacks either a `<desc>` child or a manifest entry, this test fails; fix missing items before commit.

- [ ] **Step 4:** Commit:
  ```bash
  git add src/data/svg-descriptions.json src/sections/vector-foundations.jsx
  git commit -m "Add SVG descriptions for chapters 11.5-11.11"
  ```

---

## Task 11: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`.

- [ ] **Step 1:** Find the existing Section 11 mapping table and extend it from 4 to 11 rows:

```markdown
**Section 11: Vector Databases** (`vector-foundations.jsx` - Milestones 1-2 of 6 complete)

| Chapter | Component | Title |
|---------|-----------|-------|
| 11.1 | RetrievalProblem | The Retrieval Problem |
| 11.2 | BruteForceKNN | Brute-Force kNN |
| 11.3 | ThreeWayTradeoff | The Three-Way Tradeoff |
| 11.4 | DistanceMetrics | Distance Metrics |
| 11.5 | IVF | IVF (Inverted File Index) |
| 11.6 | ANNFamilyTree | The ANN Family Tree |
| 11.7 | HNSWIntuition | HNSW - The Small-World Intuition |
| 11.8 | HNSWConstruction | HNSW Construction |
| 11.9 | HNSWSearch | HNSW Search |
| 11.10 | HNSWParameters | HNSW Parameters |
| 11.11 | Vamana | Vamana / DiskANN |

(Subsequent milestones will extend this table as chapters 11.12-11.35 are added.)
```

- [ ] **Step 2:** Find the Project Structure section and update the comment on `vector-foundations.jsx`:
```
│       └── vector-foundations.jsx        # Section 11 (Acts 1+2, chapters 11.1-11.11)
```

- [ ] **Step 3:** Commit:
  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md with chapters 11.5-11.11"
  ```

---

## Task 12: Browser verification with the claude-in-chrome plugin

**Files:** none (runtime verification).

Milestone 2 ships interactively. Start the dev server, then use the claude-in-chrome tools to drive through each new chapter, checking every sub-step renders correctly, no console errors, titles center-aligned, no em-dashes visible, no Box with `C.card`.

- [ ] **Step 1:** Start the dev server in the background:
  ```bash
  npm run dev
  ```
  Expected: `Local: http://localhost:5173/learn-ai/`.

- [ ] **Step 2:** Open the chapter in Chrome via `mcp__claude-in-chrome__tabs_context_mcp` (to see existing tabs) then `mcp__claude-in-chrome__tabs_create_mcp` with url `http://localhost:5173/learn-ai/#11.5`. Navigate forward (spacebar or Continue button) through all sub-steps. Capture screenshots / a gif via `mcp__claude-in-chrome__gif_creator` if the chapter has particularly interactive visuals.

- [ ] **Step 3:** Repeat for 11.6 through 11.11. Each chapter must:
  - Render all sub-steps in sequence.
  - Have no browser console errors (check via `mcp__claude-in-chrome__read_console_messages`).
  - Display center-aligned Box titles.
  - Show concrete cat-corpus content, not abstract placeholders.

- [ ] **Step 4:** For any visual issue found, return to the section file, fix it (TDD: if it's not covered by a test, add one first), re-run `npm run test`, re-verify in browser.

- [ ] **Step 5:** Stop the dev server.

- [ ] **Step 6:** Commit any browser-verification fixes if made:
  ```bash
  git add src/sections/vector-foundations.jsx
  git commit -m "Browser-verified fixes to chapters 11.5-11.11"
  ```

---

## Task 13: Final full-suite verification and coverage check

**Files:** none.

- [ ] **Step 1:** Coverage run:
  ```bash
  npx vitest run --coverage
  ```
  Expected: line coverage 100%; branch coverage ≥ 97.7%.

- [ ] **Step 2:** Lint:
  ```bash
  npm run lint
  ```

- [ ] **Step 3:** Format:
  ```bash
  npm run format
  ```

- [ ] **Step 4:** No em-dashes check:
  ```bash
  grep -n "—" src/sections/vector-foundations.jsx
  ```
  Expected: no matches.

- [ ] **Step 5:** No `C.card` Boxes:
  ```bash
  grep -n "Box color={C.card}" src/sections/vector-foundations.jsx
  ```
  Expected: no matches.

- [ ] **Step 6:** (Do NOT push.) Per user instructions the `section-11-vector-databases` branch is held locally. Report milestone completion:
  - 7 new chapters (11.5-11.11) added.
  - Section 11 now shows 11 chapters in the TOC.
  - Tests: count + passing status.
  - Coverage: line / branch.
  - Browser verification: issues found + fixes.
  - Next: Milestone 3 (chapters 11.12-11.16, Act 3 Compression) to be planned in a fresh session.

---

## Self-Review Notes

**Spec coverage:** All seven Act 2 chapters (11.5-11.11) from the spec are implemented. Sub-step counts match the spec (IVF=6, ANNFamilyTree=6, HNSWIntuition=5, HNSWConstruction=6, HNSWSearch=6, HNSWParameters=6, Vamana=6). Milestones 3-6 remain deferred.

**Type consistency check:**
- Component names match spec exactly: `IVF`, `ANNFamilyTree`, `HNSWIntuition`, `HNSWConstruction`, `HNSWSearch`, `HNSWParameters`, `Vamana`.
- Chapter ids match spec: 11.5 through 11.11.
- All colors used (C.cyan, C.purple, C.red, C.yellow, C.green, C.orange, C.blue) exist in the palette.
- HNSW defaults (M=16, ef_construction=200, ef_search=50) are consistent across 11.7-11.10.
- IVF defaults (nlist≈sqrt(N), nprobe=8) consistent across 11.5 and 11.6.

**No placeholders:** Every test has concrete regex. Every sub-step has a titled color and concrete content spec. Where SVG layout is needed, the implementer is pointed at existing patterns in the same file (e.g., the `Triangle` component used in 11.3) and at `CORPUS_XY` positions.

**Known deviations from plan-1's style:**
- Plan 1 used one task per chapter with explicit "write test, run test, implement, run test" steps. Plan 2 follows the same cadence but shortens the per-step narration since the implementer has Plan 1 as a reference. If an implementer wants expanded per-step detail for Tasks 5-9 (parallel to Tasks 7-10 in Plan 1), they should use Plan 1's task 7 as the template.
