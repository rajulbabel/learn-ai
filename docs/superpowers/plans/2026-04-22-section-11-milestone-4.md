# Section 11 Milestone 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 4 of Section 11 "Vector Databases" - the two Combined-Index chapters (11.17 IVFPQ, 11.18 HNSWPQ). These extend the existing `src/sections/vector-compression.jsx` file. At end of this milestone the app ships with 18 navigable chapters in Section 11 (11.1 through 11.18), completing Acts 1-4 of the section arc.

**Architecture:** Both chapters are appended as named exports in the existing `src/sections/vector-compression.jsx` (created in Milestone 3, currently houses 11.12-11.16). No new section files, no loader changes - `learn-ai.jsx` already loads `vector-compression.jsx` via the Section 11 Promise.all. Each chapter follows the established pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete cat-corpus examples.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md` - chapters 11.17 and 11.18, Act 4.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-04-22-section-11-milestone-3.md` - most recent executed plan with the same pattern, same file.
- `docs/superpowers/plans/2026-04-22-section-11-milestone-2.md` - fuller detail template for per-chapter tasks.

---

## Prerequisites

- Branch `section-11-vector-databases` checked out, clean. HEAD = `4d26877 Update CLAUDE.md with chapters 11.12-11.16`.
- Milestones 1-3 merged on the branch (11.1 through 11.16 exported across `vector-foundations.jsx` + `vector-compression.jsx`).
- CLAUDE.md Section 11 mapping currently shows 11.1-11.16; this milestone extends it to 11.1-11.18.
- All 1,881 tests currently pass. Coverage for `vector-compression.jsx` is 100% lines / 100% branches.
- `src/learn-ai.jsx` Section 11 loader already imports both `vector-foundations.jsx` and `vector-compression.jsx` via `Promise.all` - unchanged in this milestone.
- `src/__tests__/sections.test.jsx` and `src/__tests__/lookup.test.js` already import `* as VectorCompression from "../sections/vector-compression.jsx"` - unchanged in this milestone.

## File Structure

### New files
- **None.** Milestone 4 extends the existing file.

### Modified files
- `src/sections/vector-compression.jsx` - append 2 new exports (IVFPQ, HNSWPQ) at the end of the file. File grows from ~2,705 lines to roughly ~4,000-4,500 lines.
- `src/config.js` - add 2 entries to `chapters[]` after `{ id: "11.16", ... Matryoshka }`.
- `src/__tests__/sections.test.jsx` - append content-test blocks for each new chapter (11 sub-step tests total).
- `src/__tests__/config.test.js` - extend the Section 11 test from 16 to 18 entries.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` with `"11.17"`, `"11.18"`.
- `src/data/svg-descriptions.json` - add entries for new SVGs (estimate 4-8 SVGs across both chapters).
- `CLAUDE.md` - extend Section 11 mapping table to 18 rows, update Milestones annotation to "1-4 of 6 complete", update project-structure tree comment on `vector-compression.jsx`.

### Unchanged
- `src/sections/vector-foundations.jsx` (do not edit; 11.1-11.11 are stable).
- `src/learn-ai.jsx` (loader already wired).
- `src/__tests__/lookup.test.js` (already imports VectorCompression).
- Top-of-file VectorCompression imports in `sections.test.jsx` (already spread into lookup).
- All pre-Section-11 section files.

---

## Running example

Continue the cat-corpus + Act 3 scale numbers already established:

- **d = 768** (canonical scale dim).
- **float32 = 4 bytes/dim baseline** (1 vector = 3 KB).
- **IVF: nlist = sqrt(N)** with concrete anchor values `nlist = 4,096` at `N = 1M`, `nlist = 32,768` at `N = 100M`.
- **IVF nprobe = 8** (canonical starting point, raise to 32 for recall-critical workloads).
- **PQ m = 96 subvectors, 256 centroids each (8-bit codes)** → 96 bytes/vector (32x compression, from 11.14).
- **HNSW M = 16, ef_construction = 200, ef_search = 50** (from 11.10).

For Act 4 specifically:

- Combined IVF-PQ memory target: **~20 bytes per vector at N = 1B** (cluster id + residual PQ code). Concrete: 4 bytes cluster id + 16 bytes residual PQ code (m=16 for residuals at this scale) = 20 bytes, so 1B vectors fits in **20 GB** versus 3 TB raw.
- Combined HNSW+PQ: the HNSW graph overhead stays (~100 bytes per vector from 11.12), but the vector itself is PQ-encoded (96 bytes at m=96). Net: 196 bytes per vector, or about 1/15 of the float32 footprint.

Reuse the 10-doc `CAT_CORPUS` and `CORPUS_XY` scatter positions for any 2D diagrams (already in `vector-foundations.jsx`, re-import as needed).

---

## Implementation order

1. Task 1 - Green baseline
2. Task 2 - Scaffold stubs + config entries
3. Task 3 - Chapter 11.17 IVFPQ
4. Task 4 - Chapter 11.18 HNSWPQ
5. Task 5 - SVG descriptions + svg-descriptions.test.js update
6. Task 6 - CLAUDE.md update
7. Task 7 - Browser verification with claude-in-chrome
8. Task 8 - Final full-suite + coverage

Commit cadence: one commit per chapter (Tasks 3-4), plus one each for Tasks 2, 5, 6, 7 (if fixes), 8 (if any).

---

## Task 1: Verify green baseline

**Files:** none.

- [ ] **Step 1:** Confirm branch and clean state

  ```bash
  git status
  git log --oneline -5
  ```

  Expected: `On branch section-11-vector-databases`, working tree clean, most recent commit is `4d26877 Update CLAUDE.md with chapters 11.12-11.16`.

- [ ] **Step 2:** Run test suite

  ```bash
  npm run test
  ```

  Expected: all 1,881 tests pass.

- [ ] **Step 3:** Run linter

  ```bash
  npm run lint
  ```

  Expected: no errors (pre-existing unused-var warnings in `encoder-decoder-diagrams.jsx` and `vector-foundations.jsx` are OK).

No commit in this task.

---

## Task 2: Scaffold stubs + config entries

**Files:**

- Modify: `src/sections/vector-compression.jsx` (append 2 stub exports at end of file).
- Modify: `src/config.js` (append 2 entries to `chapters[]` after 11.16).
- Modify: `src/__tests__/config.test.js` (extend Section 11 chapter-list test from 16 to 18 entries).

This task creates the scaffolding so Tasks 3-4 can assume stubs exist and the generic "All chapters" render test in `sections.test.jsx` passes for 11.17-11.18.

- [ ] **Step 1:** Update `src/__tests__/config.test.js` to assert 18 Section 11 chapters

  Find the existing `describe("Section 11 chapters", ...)` block. Replace the expected array to include 11.17-11.18:

  ```js
  describe("Section 11 chapters", () => {
    it("has chapters 11.1 through 11.18 in order", () => {
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

  Expected: FAIL (length is 16, not 18).

- [ ] **Step 3:** Add chapter entries in `src/config.js` after the `11.16 Matryoshka` entry:

  ```js
    { id: "11.16", title: "Matryoshka Embeddings", section: 11, component: "Matryoshka" },
    { id: "11.17", title: "IVF-PQ", section: 11, component: "IVFPQ" },
    { id: "11.18", title: "HNSW + PQ", section: 11, component: "HNSWPQ" },
  ];
  ```

- [ ] **Step 4:** Run test - config passes, generic sections test will fail on missing components

  ```bash
  npx vitest run src/__tests__/config.test.js
  npx vitest run src/__tests__/sections.test.jsx -t "11.17"
  ```

  Expected: config test PASS; generic "All chapters" test FAILs for 11.17 and 11.18 with "fn is not a function".

- [ ] **Step 5:** Append 2 stub exports to the END of `src/sections/vector-compression.jsx`. Each stub must render something for sub=0 so the generic render test passes. Pattern:

  ```jsx
  export const IVFPQ = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={22}>
              IVF-PQ (stub)
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

  export const HNSWPQ = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={22}>
              HNSW + PQ (stub)
            </T>
          </Box>
        )}
        {sub < 4 && (
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
  ```

  The existing imports at the top of `vector-compression.jsx` (`Box, T, Reveal, SubBtn` from components.jsx, `C` from config.js) already cover what the stubs need - no new imports.

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
  git add -A
  git commit -m "Scaffold stubs and config entries for chapters 11.17-11.18"
  ```

---

## Task 3: Implement Chapter 11.17 IVFPQ (6 sub-steps)

**Files:**

- Modify: `src/sections/vector-compression.jsx` (replace the `IVFPQ` stub with full implementation).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block after the Matryoshka block).

**Chapter purpose (from spec):** The FAISS classic, dominant for static large-scale workloads. IVF clusters the space; PQ compresses each residual (vector minus its cluster centroid, since residuals cluster tighter and PQ works better). Memory: tiny (m bytes per vector + cluster ID). Recall: tuned via nprobe. Visual: decomposition of a vector into centroid + residual + PQ code, search trajectory.

**Sub-step structure:**

- **sub=0 (C.cyan) - IVF recap and PQ recap.** Title: "IVF splits space, PQ shrinks each vector". Two side-by-side summary cards: left = IVF (from 11.5: cluster corpus into nlist cells, probe nprobe at query time), right = PQ (from 11.14: split into m subvectors, replace with 1-byte centroid ids, 96 bytes at d=768). One-sentence setup: both are general-purpose compression tools; combining them is a multiplicative win. Key content strings for tests: "IVF" and "PQ" and "cluster" and "subvector" or "m bytes".

- **sub=1 (C.yellow) - Combine: first cluster the space.** Title: "Step 1: run IVF k-means on the corpus". The first layer of IVF-PQ is just IVF. Cluster the 10-doc cat corpus into nlist = 3 cells with centroids C_A, C_B, C_C (reuse the positions from 11.5). Each doc is assigned to its nearest centroid. Key content: "k-means", "nlist", "centroid", "cluster".

- **sub=2 (C.green) - Compute the residual.** Title: "Step 2: residual = vector - centroid". For each vector in cluster A, compute residual_i = v_i - centroid_A. Show side-by-side: original vector `[0.81, 0.12, 0.45, 0.22]`, centroid `[0.77, 0.15, 0.45, 0.25]`, residual `[+0.04, -0.03, +0.00, -0.03]`. Residuals have much smaller magnitude than the originals. Text pointer: "residuals cluster tighter than raw vectors, so the PQ codebooks are more accurate". Key content: "residual", "centroid", literal minus sign "-" or "subtract", specific small-residual numbers.

- **sub=3 (C.orange) - PQ-encode the residuals, not the raw vectors.** Title: "Step 3: run PQ on the residuals". Apply product quantization (same m=96, 256 centroids per slot from 11.14) to the residual vectors, not the original vectors. Because residuals have smaller spread, the per-slot k-means codebooks are tighter and PQ recall is higher than applying PQ directly to the raw vectors. Worked numeric: recall@10 of raw-PQ vs residual-PQ at m=96 → 0.89 vs 0.94. Key content: "residual", "PQ", "codebook", "96" or "m = 96", the 0.89/0.94 comparison or similar recall number.

- **sub=4 (C.red) - Search trajectory.** Title: "Search: probe nprobe clusters, scan PQ codes". Per-query steps: 1) compute distance from query to every centroid (nlist of them), keep nprobe closest; 2) within each of those nprobe cells, iterate PQ codes and compute query-to-code distance via the asymmetric-distance lookup table (from 11.14). Total ops = nlist (centroid scan) + nprobe × (cell size / nlist × N) (code scan). Tiny compared to brute force. Key content: "nprobe", "centroid" and "scan", "lookup" or "table", ascending numeric scale like "8" or "32".

- **sub=5 (C.purple) - Memory: ~20 bytes per vector; FAISS default.** Title: "20 bytes per vector at N = 1B". Concrete: at production scale, use m = 16 for the residual PQ (residuals are easier than raw vectors, so fewer subvectors suffice) with 256 centroids each = 16 bytes of PQ code per vector + 4 bytes for the cluster id = **20 bytes per vector**. At N = 1B: **20 GB** total (vs 3 TB of float32, 96 GB of pure PQ at m=96 on raw vectors). This is the configuration FAISS ships with as `IndexIVFPQ` and Milvus exposes as `IVF_PQ`. Key content: "20 bytes" or "20 GB", "1B" or "1 billion", "FAISS" or "Milvus", "IndexIVFPQ" or similar.

- [ ] **Step 1:** Append content tests to `src/__tests__/sections.test.jsx`. Find the end of the `Matryoshka (11.16) content` describe block (before the `// ─── TOC special branches ───` comment) and insert:

  ```js
  describe("IVFPQ (11.17) content", () => {
    const fn = VectorCompression.IVFPQ;

    it("sub=0 recaps IVF clustering and PQ compression", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/IVF/);
      expect(container.textContent).toMatch(/PQ/);
      expect(container.textContent).toMatch(/cluster/i);
      expect(container.textContent).toMatch(/subvector|m bytes/i);
    });

    it("sub=1 runs IVF k-means first", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/k-means/i);
      expect(container.textContent).toMatch(/nlist/i);
      expect(container.textContent).toMatch(/centroid/i);
    });

    it("sub=2 computes residual = vector - centroid", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/residual/i);
      expect(container.textContent).toMatch(/centroid/i);
      expect(container.textContent).toMatch(/tighter|smaller/i);
    });

    it("sub=3 PQ-encodes the residuals with higher recall", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/residual/i);
      expect(container.textContent).toMatch(/PQ/);
      expect(container.textContent).toMatch(/recall/i);
      expect(container.textContent).toMatch(/0\.8|0\.9|codebook/i);
    });

    it("sub=4 describes search: probe nprobe cells, scan codes", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/nprobe/i);
      expect(container.textContent).toMatch(/centroid/i);
      expect(container.textContent).toMatch(/lookup|table|scan/i);
    });

    it("sub=5 hits 20 bytes per vector with FAISS IndexIVFPQ", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/20 bytes|20 GB/);
      expect(container.textContent).toMatch(/1B|1 billion/i);
      expect(container.textContent).toMatch(/FAISS|Milvus/);
    });
  });
  ```

- [ ] **Step 2:** Run tests - expect FAIL

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "IVFPQ \\(11.17\\)"
  ```

  Expected: FAIL (stub lacks all those strings).

- [ ] **Step 3:** Replace the `IVFPQ` stub in `src/sections/vector-compression.jsx` with the full implementation. Required specifics:

  - Six sub-steps in colors: cyan → yellow → green → orange → red → purple.
  - sub=0 layout: two-column grid, left card for IVF summary (C.cyan background `${C.cyan}06`), right card for PQ summary (C.purple background `${C.purple}06`). Use center-aligned `T bold center` title for the Box, then body paragraph, then the two-column grid.
  - sub=1: reuse the `CORPUS_XY` scatter from vector-foundations.jsx. Important: this file does NOT yet import from vector-foundations. Re-define a small CORPUS_XY_ACT4 constant at the TOP of this chapter's function (or re-add the hardcoded positions inline), to keep 11.17 self-contained. Show 10 dots colored by cluster with centroid squares at C_A={x:130,y:110}, C_B={x:305,y:115}, C_C={x:360,y:230}. Label "nlist = 3".
  - sub=2: 3-row side-by-side table: columns = [doc text snippet, original vec, centroid vec, residual vec]. Pick docs 1, 3, 4 (all in cluster A). Use their 4-dim vectors from CAT_CORPUS (hardcode them since this file does not import that yet). Residual has small magnitudes like ±0.03, ±0.06. Include the formula `residual_i = v_i - centroid_i` in a centered monospace box.
  - sub=3: Two side-by-side cards (C.red background for "raw PQ", C.green for "residual PQ"), each with a recall@10 number. Header text explains why residuals give tighter codebooks. Include m = 96 so the test matches.
  - sub=4: Left column: 10-doc scatter with query arrow → 2 clusters highlighted (nprobe = 2). Right column: the per-query cost breakdown in a monospace box. Key numbers: nlist centroid comparisons + nprobe × (N / nlist) PQ code scans.
  - sub=5: Memory breakdown card with the 20 bytes math, a comparison row with float32 / raw-PQ / IVF-PQ sizes at N = 1B (3 TB / 96 GB / 20 GB), and a third card naming FAISS `IndexIVFPQ` and Milvus `IVF_PQ`.
  - Every SVG has a `<desc>` first child.
  - Every `Box` uses a colored hue; title centered; body text 16-19; inner elements use `${color}06` bg + `${color}12` border and `borderRadius: 8`.
  - No em-dashes. Middle dot `·` (entity `&middot;`) for any multiplications. Standalone formulas centered.
  - No forward-reference language to 11.18 or later chapters.
  - At the end of the chapter: conditional `<SubBtn>` when `sub < 5` calling `navigate("forward")`, same pattern as Matryoshka in the same file.

- [ ] **Step 4:** Re-run tests - expect PASS

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "IVFPQ \\(11.17\\)"
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
  git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx
  git commit -m "Implement chapter 11.17 IVF-PQ"
  ```

---

## Task 4: Implement Chapter 11.18 HNSWPQ (5 sub-steps)

**Files:** same as Task 3.

**Chapter purpose (from spec):** When you need graph navigation speed plus quantization memory savings. Store the HNSW graph structure, but each vector is PQ-encoded. Distances computed from codes. Qdrant, Weaviate, Milvus all support this. Tradeoff: PQ reduces distance accuracy → HNSW recall drops → compensate with higher ef_search. Shows the recall hit curve and how to dial it back.

**Sub-step structure:**

- **sub=0 (C.cyan) - Combine HNSW graph navigation with PQ memory savings.** Title: "HNSW gives fast search; PQ gives small vectors". Two summary cards: left = HNSW (O(log N) graph hops, M=16 default), right = PQ (96 bytes/vector at m=96). The natural combination: build an HNSW graph, but instead of storing float32 vectors at each node, store 96-byte PQ codes. Memory drops 32× on the vector side; graph structure unchanged. Key content: "HNSW", "PQ", "graph", "codes" or "encoded".

- **sub=1 (C.yellow) - Keep the graph structure, encode the payload.** Title: "Every node stores a PQ code instead of a float32 vector". Diagram: the cat-corpus HNSW graph (reuse the 3-layer graph pattern from 11.7/11.8; hardcode positions if needed since vector-foundations.jsx is not imported). Edges untouched; each node now labeled with a 96-byte code instead of a float vector. Memory math: graph overhead (from 11.10) = ~100 bytes/vector; PQ payload = 96 bytes/vector; total ≈ 196 bytes/vector. At N = 100M this is 19.6 GB, fits on a laptop. Key content: "graph", "edge" or "structure", "code" or "96 bytes", "196" or "100M" or similar scale number.

- **sub=2 (C.green) - Distance uses PQ codes: also faster.** Title: "Distance = asymmetric PQ lookup". At query time, HNSW navigates as always, but each neighbor-distance computation hits the PQ lookup table from 11.14 instead of a float32 dot product. m table lookups + m adds per distance (vs d multiplies + d adds for float32). This is about 10× faster per distance. The graph hop count is unchanged; the per-hop cost drops. Key content: "lookup" or "table", "asymmetric", "faster" or "10x" or "speedup".

- **sub=3 (C.red) - Recall drops; raise ef_search to compensate.** Title: "PQ adds distance error; bigger ef_search recovers recall". PQ distance computations introduce a small amount of error (about 1-4% on typical workloads). Small errors in distance ranking mean the HNSW greedy descent occasionally takes a slightly suboptimal hop, so recall at a fixed ef_search drops. Fix: raise ef_search. Worked table: at M=16, full-float32 recall@10 is 0.97 with ef_search=50; HNSW+PQ at the same settings is 0.92; raising ef_search to 150 recovers 0.96. Key content: "recall", "ef_search" with a number like "50" or "150", "error" or "accuracy" or "drop".

- **sub=4 (C.purple) - Production systems that support HNSW+PQ.** Title: "Production deployments of HNSW + PQ". List Qdrant (scalar and product quantization both toggle on top of HNSW), Weaviate (same), Milvus (HNSW_SQ and HNSW_PQ index types), pgvector (scalar quantization + HNSW; PQ is in the roadmap). Each card: system name + how it is exposed in config. Final takeaway: the standard modern default for 100M-1B scale production search. Key content: "Qdrant", at least one more of "Weaviate" or "Milvus", "production" or "default" or "standard".

- [ ] **Step 1:** Append content tests to `src/__tests__/sections.test.jsx` immediately after the IVFPQ block:

  ```js
  describe("HNSWPQ (11.18) content", () => {
    const fn = VectorCompression.HNSWPQ;

    it("sub=0 combines HNSW graph navigation with PQ compression", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/HNSW/);
      expect(container.textContent).toMatch(/PQ/);
      expect(container.textContent).toMatch(/graph/i);
      expect(container.textContent).toMatch(/code|encoded/i);
    });

    it("sub=1 keeps the graph structure and stores PQ codes at nodes", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/graph/i);
      expect(container.textContent).toMatch(/code|96 bytes/i);
      expect(container.textContent).toMatch(/196|100M|node/i);
    });

    it("sub=2 uses PQ asymmetric distance lookup", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/lookup|table/i);
      expect(container.textContent).toMatch(/asymmetric/i);
      expect(container.textContent).toMatch(/faster|speedup|10x/i);
    });

    it("sub=3 compensates for recall drop with higher ef_search", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/recall/i);
      expect(container.textContent).toMatch(/ef_search/i);
      expect(container.textContent).toMatch(/error|drop|accuracy/i);
      expect(container.textContent).toMatch(/50|150/);
    });

    it("sub=4 names production systems that support HNSW + PQ", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/Qdrant/);
      expect(container.textContent).toMatch(/Weaviate|Milvus/);
      expect(container.textContent).toMatch(/production|default|standard/i);
    });
  });
  ```

- [ ] **Step 2:** Run tests - expect FAIL

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "HNSWPQ \\(11.18\\)"
  ```

  Expected: FAIL.

- [ ] **Step 3:** Replace the `HNSWPQ` stub in `src/sections/vector-compression.jsx` with the full implementation. Required specifics:

  - Five sub-steps in colors: cyan → yellow → green → red → purple.
  - sub=0: two-column grid card (HNSW summary in yellow tint, PQ summary in purple tint), then a centered summary box explaining the combination.
  - sub=1: SVG showing a 3-layer HNSW graph; nodes labeled with `[c17, c203, c89, ...]` mini-code instead of float values. Re-use positions similar to 11.7's hub-layer graph. The `<desc>` should state: "Three-layer HNSW graph with nodes labeled as compact PQ codes instead of float vectors, illustrating HNSW+PQ storage." Memory math box below: `graph overhead 100 bytes/vector + PQ payload 96 bytes/vector = 196 bytes/vector. At N = 100M: 19.6 GB.`
  - sub=2: Side-by-side comparison: float32 distance (d multiplies + d adds, ~48 AVX-512 ops at d=768) vs PQ asymmetric distance (m lookups + m adds at m=96). Speedup ratio ≈ 10×. Reuse the styling used in 11.13 sub=4 SIMD cards.
  - sub=3: Grid table with 4 columns: `ef_search`, `HNSW float32 recall`, `HNSW+PQ recall`, `note`. Rows: `50 / 0.97 / 0.92 / baseline`, `100 / 0.98 / 0.94 / raising ef helps`, `150 / 0.99 / 0.96 / nearly recovered`, `200 / 0.99 / 0.97 / matches float`. Plus a small formula line summarizing the rule: "recall_HNSW+PQ ≈ recall_HNSW - 1% to 5% depending on PQ m".
  - sub=4: 2×2 or 4-column grid of production system cards: Qdrant, Weaviate, Milvus, pgvector. Each card shows name + short config note. Final summary paragraph: "HNSW + PQ is the modern production default for 100M-1B scale search."
  - Every SVG has a `<desc>` first child.
  - No em-dashes. No forward-reference language.
  - At end: conditional `<SubBtn>` when `sub < 4`.

- [ ] **Step 4:** Re-run tests - expect PASS

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "HNSWPQ \\(11.18\\)"
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
  git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx
  git commit -m "Implement chapter 11.18 HNSW + PQ"
  ```

---

## Task 5: Add SVG descriptions to manifests

**Files:**

- Modify: `src/__tests__/svg-descriptions.test.js` (extend expectedChapters).
- Modify: `src/data/svg-descriptions.json` (add entries for new SVGs).
- Modify: `src/__tests__/sections.test.jsx` (extend svgChapters array inside the "Every SVG has a `<desc>` element" block).

- [ ] **Step 1:** Count the new SVGs. Run:

  ```bash
  grep -n "<svg" src/sections/vector-compression.jsx | tail -20
  ```

  Note how many SVG elements each new chapter contributes. Estimate: 11.17 has 1-2 SVGs (scatter in sub=1, optional search trajectory in sub=4); 11.18 has 1-2 SVGs (HNSW+PQ graph in sub=1, optionally a recall curve in sub=3).

- [ ] **Step 2:** Extend `expectedChapters` in `src/__tests__/svg-descriptions.test.js` by appending `"11.17"` and `"11.18"` after `"11.16"` (find the array that already contains `"11.15"` and `"11.16"` from Milestone 3):

  ```js
  const expectedChapters = [
    // ... existing entries ...
    "11.16",
    "11.17",
    "11.18",
  ];
  ```

  **Only add a chapter here if it actually renders at least one SVG.** If either chapter ends up text-only (possible for 11.18 if you build every sub-step with div cards), omit it from this list to avoid a false-positive test failure. Verify with the grep from Step 1.

- [ ] **Step 3:** Extend the `svgChapters` array inside `describe("Every SVG has a <desc> element", ...)` in `src/__tests__/sections.test.jsx`. Find the existing array (which ends with `"11.15"`, `"11.16"`) and append `"11.17"` and `"11.18"` - again, only for chapters that actually have SVGs.

- [ ] **Step 4:** Add entries to `src/data/svg-descriptions.json`. Insert before the closing `}`, after the existing `"11.16"` block:

  ```json
    "11.16": [
      "...existing 11.16 descriptions..."
    ],
    "11.17": [
      "Cat-corpus 2D scatter partitioned into three IVF clusters with centroid squares at cluster centers, illustrating step 1 of IVF-PQ: cluster the space first",
      "Search trajectory diagram: query lands nearest to one centroid, probes the nprobe closest clusters, and scans PQ codes within each cell"
    ],
    "11.18": [
      "Three-layer HNSW graph with each node labeled by a compact PQ code like [c17, c203, c89] instead of a float vector, illustrating that HNSW+PQ keeps the graph structure but encodes payloads"
    ]
  }
  ```

  Write descriptions in the same style as existing entries (plain-language terms a learner would search for, 1-2 sentences per SVG, in document order). Count must match the actual `<svg>` element count from Step 1.

- [ ] **Step 5:** Run the validation tests

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js src/__tests__/sections.test.jsx -t "Every SVG"
  ```

  Expected: PASS. If a new SVG lacks a `<desc>` child, the sections test fails. If a manifest entry is missing for a listed chapter, svg-descriptions test fails. Fix whichever before moving on.

- [ ] **Step 6:** Commit

  ```bash
  git add -A
  git commit -m "Add SVG descriptions for chapters 11.17-11.18"
  ```

---

## Task 6: Update CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`.

- [ ] **Step 1:** Find the existing Section 11 mapping table and extend from 16 to 18 rows. Also update the heading from "Milestones 1-3 of 6 complete" to "Milestones 1-4 of 6 complete":

  ```markdown
  **Section 11: Vector Databases** (`vector-foundations.jsx` + `vector-compression.jsx` - Milestones 1-4 of 6 complete)

  | Chapter | Component | Title |
  |---------|-----------|-------|
  | 11.1 | RetrievalProblem | The Retrieval Problem |
  | ... (existing 11.1-11.16 rows) |
  | 11.17 | IVFPQ | IVF-PQ |
  | 11.18 | HNSWPQ | HNSW + PQ |

  (Subsequent milestones will extend this table as chapters 11.19-11.35 are added.)
  ```

- [ ] **Step 2:** Update the project-structure tree comment on `vector-compression.jsx`:

  ```
  │       └── vector-compression.jsx        # Section 11 (Acts 3+4, chapters 11.12-11.18)
  ```

  (The previous milestone left this as `# Section 11 (Act 3, chapters 11.12-11.16)`.)

- [ ] **Step 3:** Commit

  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md with chapters 11.17-11.18"
  ```

---

## Task 7: Browser verification with claude-in-chrome

**Files:** none (runtime verification).

- [ ] **Step 1:** Start the dev server in the background:

  ```bash
  npm run dev
  ```

  Expected: `Local: http://localhost:5173/learn-ai/` (may use 5174, 5175, etc. if 5173 is in use).

- [ ] **Step 2:** Get tab context, open a new tab, and navigate to the running URL:

  - Call `mcp__claude-in-chrome__tabs_context_mcp` with `createIfEmpty: true` to see existing tabs.
  - Call `mcp__claude-in-chrome__tabs_create_mcp` to get a fresh tab.
  - Call `mcp__claude-in-chrome__navigate` to `http://localhost:PORT/learn-ai/`.

- [ ] **Step 3:** Read the fingerprint from localStorage to confirm chapter wiring and find indices for 11.17 and 11.18:

  ```js
  const fp = JSON.parse(localStorage.getItem("learn-ai-nav")).fingerprint.split(",");
  const indices = {};
  for (const id of ["11.17", "11.18"]) indices[id] = fp.indexOf(id);
  JSON.stringify(indices);
  ```

  Expected: `{"11.17":120,"11.18":121}` (indices are one past the last Milestone-3 chapter, 11.16 = 119).

- [ ] **Step 4:** For each of 11.17, 11.18:

  - Seed localStorage with `{ ch: <index>, sub: 0, fingerprint: fp }` and reload.
  - Use a `javascript_exec` walk that clicks the Continue button (`[data-subbtn]`) through every sub-step and audits expected keyword presence at each sub (mirror the regex set from the Task-3/4 content tests).

  Example walk for 11.17:

  ```js
  (async () => {
    const checks = [
      { sub: 0, keys: { ivf: /IVF/, pq: /PQ/, cluster: /cluster/i } },
      { sub: 1, keys: { kmeans: /k-means/i, nlist: /nlist/i, centroid: /centroid/i } },
      { sub: 2, keys: { residual: /residual/i, centroid: /centroid/i } },
      { sub: 3, keys: { pq: /PQ/, recall: /recall/i, codebook: /codebook/i } },
      { sub: 4, keys: { nprobe: /nprobe/i, scan: /scan|table/i } },
      { sub: 5, keys: { twentyBytes: /20 bytes|20 GB/, faiss: /FAISS|Milvus/ } },
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

  Every field must be `true`.

- [ ] **Step 5:** Check console messages:

  ```
  mcp__claude-in-chrome__read_console_messages (pattern: "error|warning|Error|Warning", onlyErrors: false)
  ```

  Expected: only benign Vite DevTools / React DevTools informational messages. No errors, no warnings from the app itself.

- [ ] **Step 6:** For any content gap or console error: fix the chapter, re-run the Task-3 or Task-4 unit tests, re-verify in browser. If a fix is needed after committing, make it a follow-up commit (`Browser-verified fix to chapter 11.XX`).

- [ ] **Step 7:** Stop the dev server:

  ```bash
  # whichever background process id was used
  kill %1 2>/dev/null; lsof -i :PORT -t | xargs kill -9 2>/dev/null
  ```

- [ ] **Step 8:** Commit any fixes made (skip if none).

---

## Task 8: Final full-suite verification and coverage check

**Files:** none.

- [ ] **Step 1:** Coverage run:

  ```bash
  npx vitest run --coverage
  ```

  Expected: `vector-compression.jsx` shows 100% line and 100% branch coverage. Overall number may still show the pre-existing gaps in `attention-qkv.jsx`, `encoder-decoder-diagrams.jsx`, `transformer-block.jsx`, and `transformer-input.jsx` - those are the unchanged Milestone-3 baseline and NOT in scope.

- [ ] **Step 2:** Lint:

  ```bash
  npm run lint
  ```

  Expected: 0 errors. Pre-existing warnings in `encoder-decoder-diagrams.jsx` and `vector-foundations.jsx` are OK.

- [ ] **Step 3:** Format:

  ```bash
  npm run format
  ```

- [ ] **Step 4:** No em-dashes check:

  ```bash
  grep -n "—" src/sections/vector-compression.jsx
  ```

  Expected: no matches.

- [ ] **Step 5:** No `C.card` Boxes:

  ```bash
  grep -n "Box color={C.card}" src/sections/vector-compression.jsx
  ```

  Expected: no matches.

- [ ] **Step 6:** Confirm test count moved up:

  ```bash
  npm run test 2>&1 | tail -5
  ```

  Expected: test count is 1,881 baseline + 11 new content tests + 22 generic "All chapters" entries (2 chapters × 11 sub-levels) + 2 SVG tests (if both chapters end up with SVGs) = approximately 1,915-1,920 tests passing.

- [ ] **Step 7:** (Do NOT push.) Per user instructions the `section-11-vector-databases` branch is held locally. Report milestone completion:
  - 2 new chapters (11.17, 11.18) added.
  - Section 11 now shows 18 chapters in the TOC.
  - `vector-compression.jsx` now holds chapters 11.12-11.18.
  - Tests: count + passing status.
  - Coverage: line / branch on the new file.
  - Browser verification: issues found + fixes (if any).
  - Next: Milestone 5 (chapters 11.19-11.28, Act 5 Production Realities, in a new `vector-production.jsx`) to be planned in a fresh session.

---

## Self-Review Notes

**Spec coverage:** Both Act 4 chapters (11.17, 11.18) from the spec are implemented. Sub-step counts match the spec (IVFPQ = 6, HNSWPQ = 5, total = 11). Milestones 5-6 remain deferred.

**Type consistency check:**

- Component names match spec exactly: `IVFPQ`, `HNSWPQ`.
- Chapter ids match spec: 11.17, 11.18.
- Titles match: `IVF-PQ`, `HNSW + PQ`. (Note: the "+ " with a space matches how the spec heading is written.)
- All colors used (C.cyan, C.yellow, C.green, C.orange, C.red, C.purple) exist in the palette.
- IVF defaults (nlist ≈ sqrt(N), nprobe = 8) are consistent with 11.5.
- PQ defaults (m = 96, 256 centroids) are consistent with 11.14.
- HNSW defaults (M = 16, ef_construction = 200, ef_search = 50) are consistent with 11.8/11.10; the HNSWPQ recall table uses ef_search values 50, 100, 150, 200 which align with 11.10's "query-time main knob" framing.
- Scale numbers: 20 bytes/vector at N = 1B for IVFPQ, 196 bytes/vector at N = 100M for HNSWPQ - both derived from already-established per-piece numbers (100 byte HNSW graph overhead from 11.12; 96 byte PQ code from 11.14; 4 byte cluster id explicit in this plan).

**No placeholders:** Every sub-step has a concrete color, title, content specification, and key test strings. Where SVG layout is needed, the implementer is pointed at prior patterns in the same file (Matryoshka's Russian-doll SVG in 11.16, Binary Quantization's recall curve in 11.15) and at the HNSW graph pattern in 11.7/11.8 (vector-foundations.jsx).

**Intentional deviations from Plan 3:**

- Smaller scope (2 chapters vs 5), so Task 2 scaffolding is simpler (no loader change, no `import * as VectorCompression` to add - both already in place from Milestone 3).
- No `lookup.test.js` update needed (the import was added in Milestone 3).

**Running-example continuity:** The cat corpus, 768-dim scale math, HNSW and PQ parameters carry over directly. If a chapter needs 2D scatter positions (likely for 11.17 sub=1 and 11.18 sub=1), the plan calls for hardcoding them locally rather than cross-file-importing from `vector-foundations.jsx` - this keeps each section file self-sufficient and matches how Milestone 3 chapters already avoided the cross-file import.
