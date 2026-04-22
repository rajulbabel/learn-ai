# Section 11 Milestone 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 3 of Section 11 "Vector Databases" - the five Compression chapters (11.12 MemoryWall, 11.13 ScalarQuantization, 11.14 ProductQuantization, 11.15 BinaryQuantization, 11.16 Matryoshka). These chapters live in a new file `src/sections/vector-compression.jsx`. At end of this milestone the app ships with 16 navigable chapters in Section 11 (11.1 through 11.16).

**Architecture:** Create a new section file `src/sections/vector-compression.jsx` and register it in `learn-ai.jsx` so Section 11 now loads BOTH `vector-foundations.jsx` (11.1-11.11) AND `vector-compression.jsx` (11.12-11.16). This mirrors the multi-file loader pattern used for Section 3 (scaling.jsx + llm-training.jsx) and Section 10 (attention-computation.jsx + modern-llm-techniques.jsx). Each chapter follows the established learn-ai pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete cat-corpus examples.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md` - chapters 11.12 through 11.16, Act 3.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-04-22-section-11-milestone-1.md` - full detail template for per-chapter tasks.
- `docs/superpowers/plans/2026-04-22-section-11-milestone-2.md` - the most recent executed plan with this pattern.

---

## Prerequisites

- Branch `section-11-vector-databases` checked out (currently 28 commits ahead of `main`, clean).
- Milestones 1 and 2 merged on the branch (11.1 through 11.11 exported from `src/sections/vector-foundations.jsx`).
- CLAUDE.md Section 11 mapping currently shows 11.1-11.11; this milestone extends it to 11.1-11.16.
- All 1,784 tests currently pass. Coverage for `vector-foundations.jsx` is 100% lines / 100% branches.

## File Structure

### New files
- `src/sections/vector-compression.jsx` - Acts 3 + 4 chapter functions. In Milestone 3 this file contains 5 exports (MemoryWall, ScalarQuantization, ProductQuantization, BinaryQuantization, Matryoshka). Milestone 4 adds 2 more (IVFPQ, HNSWPQ).

### Modified files
- `src/config.js` - add 5 entries to `chapters[]` after `{ id: "11.11", ... Vamana }`.
- `src/learn-ai.jsx` - change the Section 11 loader from a single import to a Promise.all of both files, following the Section 3/8/9/10 pattern.
- `src/__tests__/sections.test.jsx` - add `import * as VectorCompression from ...`, spread it into the lookup, and append content-test blocks for each new chapter (30 sub-step tests total).
- `src/__tests__/config.test.js` - extend the Section 11 test from 11 to 16 entries.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` with 11.12-11.16.
- `src/data/svg-descriptions.json` - add entries for new SVGs (estimate 15-25 SVGs across five chapters).
- `CLAUDE.md` - extend Section 11 mapping table to 16 rows, update project-structure tree to show both section files, update the Milestones-of-6 annotation to "1-3 of 6".

### Unchanged
- `src/sections/vector-foundations.jsx` (do not edit; 11.1-11.11 are stable).
- All pre-Section-11 section files.

---

## Running example

Continue the cat-corpus running thread established in 11.1-11.11:
- 10-doc corpus + 4-dim visual vectors + `QUERY = "information about cats"`.
- 768-dim math for scale discussions.
- Memory math already set in 11.3: 3 KB/vector at d=768, 3 GB at N=1M, 300 GB at N=100M, 3 TB at N=1B. Act 3 starts from these numbers.

For Act 3 specifically:
- **d = 768** (canonical scale dim; keep consistent across 11.12-11.16).
- **float32 = 4 bytes/dim baseline** (so 1 vector = 3072 bytes = 3 KB).
- **int8 post-scalar-quantization = 1 byte/dim** (4× compression).
- **PQ m = 96 subvectors, 256 centroids each (8-bit codes)** → 96 bytes/vector = 32× compression.
- **Binary = 1 bit/dim = 96 bytes at d=768** (32× compression, same footprint as PQ but simpler math).
- **Matryoshka typical truncation points: 256, 512, 1024, 3072** (OpenAI text-embedding-3 default).

A small helper to render a byte-array visualization may be worth extracting - the same pattern repeats across chapters. Decide during Task 4.

---

## Implementation order

1. Task 1 - Verify green baseline
2. Task 2 - Create `vector-compression.jsx` stubs + config entries + loader update
3. Task 3 - Chapter 11.12 MemoryWall
4. Task 4 - Chapter 11.13 ScalarQuantization
5. Task 5 - Chapter 11.14 ProductQuantization (+ OPQ sub-step)
6. Task 6 - Chapter 11.15 BinaryQuantization
7. Task 7 - Chapter 11.16 Matryoshka
8. Task 8 - SVG descriptions + svg-descriptions.test.js update
9. Task 9 - CLAUDE.md update
10. Task 10 - Browser verification with chrome plugin
11. Task 11 - Final full-suite + coverage

Commit cadence: one commit per chapter (Tasks 3-7), plus one each for Tasks 2, 8, 9, 10 (if fixes), 11 (if any).

---

## Task 1: Verify green baseline

**Files:** none.

- [ ] **Step 1:** Confirm branch and clean state
  ```bash
  git status
  git log --oneline -5
  ```
  Expected: `On branch section-11-vector-databases`, working tree clean, most recent commit is `28851c1 Simplify SearchPathDiagram defensive ternaries (100% coverage in 11.9)`.

- [ ] **Step 2:** Run test suite
  ```bash
  npm run test
  ```
  Expected: all 1,784 tests pass.

- [ ] **Step 3:** Run linter
  ```bash
  npm run lint
  ```
  Expected: no errors (some pre-existing unused-var warnings in other files are OK).

No commit.

---

## Task 2: Scaffold vector-compression.jsx + config + loader

**Files:**
- Create: `src/sections/vector-compression.jsx`.
- Modify: `src/config.js` (append 5 chapter entries).
- Modify: `src/learn-ai.jsx` (update Section 11 loader to load both files via Promise.all).
- Modify: `src/__tests__/sections.test.jsx` (import `* as VectorCompression`, spread into lookup).
- Modify: `src/__tests__/config.test.js` (extend the existing Section 11 chapter-list test to 16 entries).

- [ ] **Step 1:** Update `src/__tests__/config.test.js` to assert 11 → 16 Section 11 chapters

Replace the existing `describe("Section 11 chapters", ...)` block's expected array to include 11.12-11.16:

```js
describe("Section 11 chapters", () => {
  it("has chapters 11.1 through 11.16 in order", () => {
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
  Expected: FAIL.

- [ ] **Step 3:** Add chapter entries in `src/config.js` after the `11.11 Vamana` entry:

```js
  { id: "11.11", title: "Vamana / DiskANN", section: 11, component: "Vamana" },
  { id: "11.12", title: "The Memory Wall", section: 11, component: "MemoryWall" },
  { id: "11.13", title: "Scalar Quantization", section: 11, component: "ScalarQuantization" },
  { id: "11.14", title: "Product Quantization (+ OPQ)", section: 11, component: "ProductQuantization" },
  { id: "11.15", title: "Binary Quantization", section: 11, component: "BinaryQuantization" },
  { id: "11.16", title: "Matryoshka Embeddings", section: 11, component: "Matryoshka" },
];
```

- [ ] **Step 4:** Create `src/sections/vector-compression.jsx` with stubs:

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Stubs for chapters 11.12-11.16 - full implementations follow per-task.
export const MemoryWall = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory Wall (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ScalarQuantization = (ctx) => { /* C.cyan stub */ };
export const ProductQuantization = (ctx) => { /* C.purple stub */ };
export const BinaryQuantization = (ctx) => { /* C.yellow stub */ };
export const Matryoshka = (ctx) => { /* C.green stub */ };
```

Write out all five with the same body shape - each must return a valid JSX tree so the generic "All chapters" render test does not crash.

- [ ] **Step 5:** Update `src/learn-ai.jsx` Section 11 loader

Find:
```js
  11: () => import("./sections/vector-foundations.jsx"),
```
Replace with:
```js
  11: () =>
    Promise.all([import("./sections/vector-foundations.jsx"), import("./sections/vector-compression.jsx")]).then(
      (mods) => Object.assign({}, ...mods),
    ),
```

- [ ] **Step 6:** Update `src/__tests__/sections.test.jsx`

Add the import after the existing `import * as VectorFoundations ...`:
```js
import * as VectorCompression from "../sections/vector-compression.jsx";
```

Spread it into the `lookup` object:
```js
const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  // ...existing sections...
  ...VectorFoundations,
  ...VectorCompression,
};
```

- [ ] **Step 7:** Run all tests - expect pass now
  ```bash
  npx vitest run src/__tests__/config.test.js src/__tests__/sections.test.jsx
  ```
  Expected: all pass.

- [ ] **Step 8:** Lint + format + commit
  ```bash
  npm run lint
  npm run format
  git add -A
  git commit -m "Scaffold vector-compression.jsx and register chapters 11.12-11.16"
  ```

---

## Task 3: Implement Chapter 11.12 MemoryWall (5 sub-steps)

**Chapter purpose (from spec):** Do the N × d × 4 math at production scale and motivate compression as non-negotiable. d=768 × 4 = 3 KB/vector. 1M = 3 GB, 100M = 300 GB, 1B = 3 TB. Add HNSW overhead. Real cost in dollars per month. Tease four compression techniques.

**Sub-step structure:**

- **sub=0 (C.red) - One vector is 3 KB.** Title: "A single embedding is 3 KB at d=768". Show a cat-corpus vector as 4-dim illustrative `[0.81, 0.12, 0.45, 0.22]`, then the real d=768 × 4 bytes = 3 KB calculation. Key content strings: "768", "4 bytes", "3 KB", "float32".

- **sub=1 (C.orange) - The scaling table.** Title: "From 3 GB to 3 TB". Four-row table: N=10, 1M, 100M, 1B → vectors-only memory. Key content: "1 GB" (or "3 GB"), "300 GB", "3 TB", "1 billion" or "1B".

- **sub=2 (C.yellow) - Add HNSW graph overhead.** Title: "Add ~100 bytes per vector for HNSW edges". Extend the scaling table with the HNSW overhead column (from 11.8). Key content: "graph", "overhead", "100 bytes" or specific numbers.

- **sub=3 (C.purple) - Real server economics.** Title: "Does the math still work on one server?". An AWS `r7i.24xlarge` has 768 GB RAM at roughly $5,000 per month; do the math: 100M fits on one box, 1B requires multi-node sharding. Key content: "r7i" or "768 GB" or "$" mentions.

- **sub=4 (C.green) - Four shrinking techniques teased.** Title: "Four ways to shrink a vector". Four cards: Scalar quantization (4×), PQ (32×), Binary (32×, lossy), Matryoshka (variable). Key content: "scalar", "PQ" or "product", "binary", "Matryoshka", no forward-reference language like "next" or "coming up" - framing language only.

- [ ] **Step 1:** Append content tests to `src/__tests__/sections.test.jsx` after the Vamana describe block:

```js
describe("MemoryWall (11.12) content", () => {
  const fn = VectorCompression.MemoryWall;

  it("sub=0 calculates 3 KB per vector at d=768 float32", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/4 bytes|float32/i);
    expect(container.textContent).toMatch(/3 KB|3072/);
  });

  it("sub=1 shows a scaling table through 1B", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/300 GB/);
    expect(container.textContent).toMatch(/3 TB|TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
  });

  it("sub=2 adds HNSW graph overhead", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/overhead|100 bytes/i);
  });

  it("sub=3 touches real server economics", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/r7i|768 GB|\$/);
  });

  it("sub=4 teases four compression techniques", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/scalar/i);
    expect(container.textContent).toMatch(/PQ|product/i);
    expect(container.textContent).toMatch(/binary/i);
    expect(container.textContent).toMatch(/Matryoshka/i);
  });
});
```

- [ ] **Step 2-7:** TDD cycle - run tests (RED), implement `MemoryWall` in `vector-compression.jsx` with 5 sub-steps at colors red / orange / yellow / purple / green, run tests (GREEN), lint/format/commit.

  Commit message: `Implement chapter 11.12 The Memory Wall`

---

## Task 4: Implement Chapter 11.13 ScalarQuantization (6 sub-steps)

**Chapter purpose:** Float32 → int8. Per-dimension min/max calibration, linear map. 4× memory win, 1-3% recall loss. SIMD-friendly.

**Sub-step structure:**

- **sub=0 (C.cyan) - One float32 vector.** Title: "A float32 vector: 4 bytes per dimension". Show one cat-corpus vector at d=8 (illustrative slice of d=768) with explicit float32 bytes. Key content: "float32", "4 bytes", specific values.

- **sub=1 (C.yellow) - Calibrate per-dimension min and max.** Title: "Scan the dataset for per-dimension min and max". Show a mini-table: dim 0: min=0.09, max=0.83; dim 1: min=0.10, max=0.88; etc. (values from CAT_CORPUS). Key content: "min", "max", "calibration" or "scan".

- **sub=2 (C.green) - Linear map to [0, 255].** Title: "Linear map [min, max] → [0, 255]". Formula: `q = round((v - min) / (max - min) * 255)`. Key content: "255", "round", the formula structure.

- **sub=3 (C.orange) - Quantize the cat vector.** Title: "Before and after". Side-by-side: float32 vector vs int8 byte array. Concrete example: doc 1 `[0.81, 0.12, ...]` → `[204, 5, ...]`. Key content: "int8", "before", "after", specific byte values.

- **sub=4 (C.purple) - SIMD-friendly distance.** Title: "int8 distances are faster than float32 on modern CPUs". Explain VPDPBUSD / AVX-512 - integer dot products are 4× faster than float ops. Key content: "SIMD", "faster" or "speedup", "int8".

- **sub=5 (C.red) - The tradeoff.** Title: "4× memory win for 1-3% recall loss". Worked: d=768 stores at 768 bytes instead of 3072. Typical recall drop: 1-3%. Virtually free. Key content: "4x" or "4×", "1-3%" or "recall loss", specific byte/vector number.

- [ ] **Step 1-7:** TDD cycle. Tests:

```js
describe("ScalarQuantization (11.13) content", () => {
  const fn = VectorCompression.ScalarQuantization;
  it("sub=0 shows a float32 vector with 4-byte dimensions", () => { /* ...match "float32", "4 bytes" */ });
  it("sub=1 describes per-dimension min/max calibration", () => { /* ...match "min", "max" */ });
  it("sub=2 shows the linear map to [0, 255]", () => { /* ...match "255", formula */ });
  it("sub=3 shows before/after quantized values", () => { /* ...match "int8", "before", "after" */ });
  it("sub=4 highlights SIMD int8 speed", () => { /* ...match "SIMD", "int8" */ });
  it("sub=5 shows 4x memory win for 1-3% recall", () => { /* ...match "4", "1-3%" or recall loss */ });
});
```

Commit: `Implement chapter 11.13 Scalar Quantization`.

---

## Task 5: Implement Chapter 11.14 ProductQuantization (7 sub-steps)

**Chapter purpose:** PQ + OPQ. The big compression lever. Split vector into m subvectors, k-means with 256 centroids per slot, replace each subvector with an 8-bit code. 768 floats → 96 bytes = 32× compression. Asymmetric distance with a precomputed table. OPQ as rotation pre-step.

**Sub-step structure:**

- **sub=0 (C.cyan) - Split a 768-dim vector into 96 subvectors of 8 dims.** Title: "Split a vector into m subvectors". Show the split for one cat-corpus vector (d=8 illustrative cut into m=2 subvectors of dim 4 for the drawable version). Key content: "768", "96", "subvector" or "sub-vector", "split".

- **sub=1 (C.yellow) - Per-slot codebook with 256 centroids.** Title: "Run k-means per slot: 256 centroids". For each of the 96 slots, run k-means across the dataset to get 256 centroids. Show one slot's codebook visually as a 4×8 grid of 32 example centroids. Key content: "256", "centroids", "codebook", "k-means".

- **sub=2 (C.green) - Encode: each subvector → nearest centroid ID.** Title: "Each subvector becomes one centroid ID". Show the encoding of the cat-corpus subvectors into centroid IDs (e.g., subvec 0 → id 17, subvec 1 → id 203). Key content: "centroid id" or "code", specific integer ids.

- **sub=3 (C.orange) - Whole vector = 96 bytes, 32× compression.** Title: "96 bytes instead of 3072". Worked: 3072 → 96 bytes, 32× compression. Key content: "96", "3072", "32" for ratio.

- **sub=4 (C.red) - Asymmetric distance via a lookup table.** Title: "Query stays float32; doc is codes. Look up the table.". Distance from query to coded doc: sum of per-slot pre-computed distances. For each query, precompute the distance from every query subvector to every centroid (m × 256 table), then at query time the per-doc cost is m table lookups. Key content: "asymmetric", "lookup" or "table", "m × 256" or table math.

- **sub=5 (C.purple) - OPQ: rotate first so PQ works better.** Title: "OPQ: rotate the data to decorrelate dimensions before PQ". Before the split, apply a learned rotation matrix. Decorrelated dims → tighter per-slot clusters → higher recall. Key content: "OPQ", "rotation" or "rotate", "decorrelate" or "correlated".

- **sub=6 (C.pink) - The recall-compression curve.** Title: "Pick m to hit your target recall". Curve: m=8 → recall 0.85 (96× compression), m=48 → recall 0.93 (16×), m=96 → recall 0.96 (8×), m=192 → recall 0.98 (4×). Standard production operating points. Key content: "m = 96" or "m=96", recall value, "compression" or "compressed".

Tests + commit: `Implement chapter 11.14 Product Quantization`.

---

## Task 6: Implement Chapter 11.15 BinaryQuantization (6 sub-steps)

**Chapter purpose:** 1 bit per dim. Sign-based quantization. Hamming distance via XOR + popcount. 32× compression. Works well at high d (BERT-style), breaks at low d.

**Sub-step structure:**

- **sub=0 (C.cyan) - One float32 vector at d=1024.** Title: "A 1024-dim float32 vector is 4 KB". Same kind of vector-bytes viz as in 11.13 but at d=1024. Key content: "1024", "4 KB", "float32".

- **sub=1 (C.yellow) - Take the sign of each dim.** Title: "1 bit per dimension: sign only". `bit_i = 1 if v_i ≥ 0 else 0`. Whole vector becomes 128 bytes (1024 / 8). Key content: "sign", "1 bit", "128 bytes" or "32x" or "32×".

- **sub=2 (C.green) - Hamming distance: XOR + popcount.** Title: "Distance = XOR + popcount". Two binary vectors: XOR to find differing bits, popcount counts the number of 1 bits. Shows hardware intrinsic (`POPCNT` on x86). Key content: "Hamming", "XOR", "popcount".

- **sub=3 (C.purple) - Works at high d.** Title: "Recall stays high when d is big". For BERT-style embeddings at d=768 or d=1024, binary holds recall around 95%. Show a curve with d on x-axis, recall on y-axis. Key content: "recall", "95%" or "high", "768" or "1024", "BERT".

- **sub=4 (C.red) - Breaks at low d.** Title: "Below d=256, recall collapses". Visual: same curve dropping off a cliff when d goes below ~256. Key content: "low dim" or "d=128" or "collapse", "recall".

- **sub=5 (C.orange) - Production use + rerank.** Title: "Production use with a rerank stage". Binary for stage 1 (retrieve 100 fast), rerank with full float32 for stage 2. Qdrant's binary index and some Pinecone tiers use this. Key content: "Qdrant" or "Pinecone", "rerank" or "stage".

Tests + commit: `Implement chapter 11.15 Binary Quantization`.

---

## Task 7: Implement Chapter 11.16 Matryoshka (6 sub-steps)

**Chapter purpose:** Variable-dim embeddings. OpenAI text-embedding-3 trick - model is trained so the first-K dimensions are also a valid embedding for any K. Truncate at query time without re-embedding.

**Sub-step structure:**

- **sub=0 (C.cyan) - The problem: re-embedding is expensive.** Title: "You indexed 500M docs. Now you want smaller vectors.". Without Matryoshka, you have to re-encode every doc. Key content: "re-embed" or "re-encoding", "500M" or "500 million", "expensive" or similar.

- **sub=1 (C.purple) - Matryoshka: the first-K dimensions are also an embedding.** Title: "Trained so the first 256 / 512 / 1024 dims are each valid". Visual: one long vector with nested colored shaded regions. Key content: "256", "512", "first K" or "truncate" or "nested".

- **sub=2 (C.green) - Nested concentric spheres (the Russian doll image).** Title: "Like Russian dolls". Visual: concentric circles (or spheres) with the outer ones being 3072-dim, inner being 1024, 512, 256. Key content: "nested" or "concentric", "Russian doll" or similar.

- **sub=3 (C.orange) - Serve retrieval from 512 dims for 6× memory savings.** Title: "Truncate to 512 dims, keep the full embedding for rerank". Concrete: ship 3072-dim Matryoshka embedding, index the 512-dim truncation in the vector DB, rerank with the full 3072 when needed. Key content: "512", "3072", "6×" or "6x" or "savings".

- **sub=4 (C.yellow) - Adaptive precision: 256 fast, 3072 accurate.** Title: "Coarse to fine: 256 for candidates, full for rerank". Two-stage retrieval using the same embedding at two resolutions. Key content: "coarse", "rerank" or "fine", "256" or "adaptive".

- **sub=5 (C.red) - Production availability.** Title: "Where you get Matryoshka today". OpenAI text-embedding-3-small and -large (default), Cohere Embed v3, Jina v3. Key content: "OpenAI", "text-embedding-3" or "Cohere".

Tests + commit: `Implement chapter 11.16 Matryoshka Embeddings`.

---

## Task 8: Add SVG descriptions and update svg-descriptions.test.js

**Files:**
- Modify: `src/__tests__/svg-descriptions.test.js` (extend expectedChapters).
- Modify: `src/data/svg-descriptions.json` (add entries keyed by `11.12` through `11.16`).

- [ ] **Step 1:** Extend `expectedChapters` in `svg-descriptions.test.js` with `11.12`, `11.13`, `11.14`, `11.15`, `11.16`.

- [ ] **Step 2:** For each chapter, count the `<svg>` elements rendered across all sub-steps (use the dev server + a quick `grep -n "<svg"` or inspect each sub-step via `npx vitest run -t "11.14"` to see which render) and add that many entries to the json manifest in document order.

- [ ] **Step 3:** Also append `"11.12"`, `"11.13"`, `"11.14"`, `"11.15"`, `"11.16"` to the `svgChapters` array in `sections.test.jsx`'s "Every SVG has a `<desc>` element" block, but ONLY for chapters that actually contain SVGs. Text-only chapters (likely 11.12 sub=0 layout, 11.16 if built with div cards) can be omitted from that list - check first.

- [ ] **Step 4:** Run the validation tests
  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js src/__tests__/sections.test.jsx -t "Every SVG"
  ```
  Expected: PASS.

- [ ] **Step 5:** Commit
  ```bash
  git add -A
  git commit -m "Add SVG descriptions for chapters 11.12-11.16"
  ```

---

## Task 9: Update CLAUDE.md

- [ ] **Step 1:** Find the Section 11 mapping table and extend from 11 to 16 rows:

```markdown
**Section 11: Vector Databases** (`vector-foundations.jsx` + `vector-compression.jsx` - Milestones 1-3 of 6 complete)

| Chapter | Component | Title |
|---------|-----------|-------|
| 11.1 | RetrievalProblem | The Retrieval Problem |
| ... (existing 11.1-11.11 rows) |
| 11.12 | MemoryWall | The Memory Wall |
| 11.13 | ScalarQuantization | Scalar Quantization |
| 11.14 | ProductQuantization | Product Quantization (+ OPQ) |
| 11.15 | BinaryQuantization | Binary Quantization |
| 11.16 | Matryoshka | Matryoshka Embeddings |

(Subsequent milestones will extend this table as chapters 11.17-11.35 are added.)
```

- [ ] **Step 2:** Update the Project Structure tree to show both section files:

```
│       ├── vector-foundations.jsx         # Section 11 (Acts 1+2, chapters 11.1-11.11)
│       └── vector-compression.jsx         # Section 11 (Acts 3+4, chapters 11.12-11.18 by end of Milestone 4; currently 11.12-11.16)
```

- [ ] **Step 3:** Commit
  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md with chapters 11.12-11.16"
  ```

---

## Task 10: Browser verification with claude-in-chrome

Same approach as Milestone 2. Steps condensed because the pattern is established:

- [ ] Start dev server: `npm run dev` (background).
- [ ] `mcp__claude-in-chrome__tabs_context_mcp`, navigate to the running URL.
- [ ] For each of 11.12, 11.13, 11.14, 11.15, 11.16:
  - Set localStorage to the chapter index, reload.
  - Click Continue through all sub-steps.
  - Run a `textContent` keyword audit per sub-step to confirm expected content appears as the user reveals.
- [ ] Read console messages - expect zero errors / warnings.
- [ ] Kill the dev server.

Any issue surfaced here: fix it in the chapter, re-run tests, commit a follow-up if needed.

---

## Task 11: Final verification and coverage

- [ ] `npx vitest run --coverage` - expect vector-compression.jsx at 100% lines / 100% branches; overall number may still be below threshold due to pre-existing gaps in other files (unchanged from M2 baseline - not in scope).
- [ ] `npm run lint` - no errors.
- [ ] `grep -n "—" src/sections/vector-compression.jsx` - expect no matches.
- [ ] `grep -n "Box color={C.card}" src/sections/vector-compression.jsx` - expect no matches.
- [ ] Report milestone completion: 5 new chapters, 16 chapters in Section 11 total. Do NOT push the branch (user instruction).

---

## Self-Review Notes

**Spec coverage:** All five Act 3 chapters from the spec are implemented. Sub-step counts match: MemoryWall=5, ScalarQuantization=6, ProductQuantization=7, BinaryQuantization=6, Matryoshka=6 - total 30. Milestone 4 (IVF-PQ + HNSW+PQ) remains queued for the next session.

**Type consistency check:**
- Component names match spec: `MemoryWall`, `ScalarQuantization`, `ProductQuantization`, `BinaryQuantization`, `Matryoshka`.
- Chapter ids 11.12-11.16 match spec.
- All colors used are in the palette.
- Scale numbers (d=768, 3 KB/vector, 3 TB at 1B, 32× compression, 256 centroids, m=96) consistent across 11.12-11.16.

**No placeholders:** Every sub-step has a titled color and concrete content spec. Where implementer judgment is required (JSX layout inside sub-steps), the implementer is pointed at prior chapter patterns in vector-foundations.jsx (e.g., the tinted-card grid used in 11.3 sub=3, the scaling table pattern in 11.2/11.3/11.12).

**Intentional deviations from Plans 1/2:**
- Task 2 now bundles stub creation + config + loader + lookup registration into ONE task instead of splitting. Rationale: the loader change is trivial once the stub file exists, and keeping them together avoids a short stub-only commit that leaves the loader stale.
- Task 10 (browser verification) leans on the verification pattern proven in Milestone 2; steps are summarized instead of re-expanded.
