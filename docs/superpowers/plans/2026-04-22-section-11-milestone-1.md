# Section 11 Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Section 11 "Vector Databases" scaffolding plus the first four chapters (Act 1 - The Problem: 11.1 RetrievalProblem, 11.2 BruteForceKNN, 11.3 ThreeWayTradeoff, 11.4 DistanceMetrics). The app should ship at end of this milestone with a visible Section 11 in the TOC and 4 navigable chapters.

**Architecture:** Chapters live in a new section file `src/sections/vector-foundations.jsx` (will eventually hold 11.1-11.11 after Milestone 2). Section registration follows the same pattern as Section 10: add entries to `chapters[]`, `sectionNames`, and `sectionColors` in `src/config.js`; register a lazy loader in `src/learn-ai.jsx`; add the import to `src/__tests__/sections.test.jsx`. All chapter content follows the learn-ai visual rules in `.claude/rules/sections.md` (progressive Reveal sub-steps, colored Boxes, real numbers, center-aligned titles).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md`

---

## Prerequisites

- All tests currently pass on `main` (verify in Task 1).
- Brainstormed spec is committed (done: commit `29e56f2`).
- Working from a new branch `section-11-vector-databases`.

## File Structure

### New files

- `src/sections/vector-foundations.jsx` - Act 1 + Act 2 chapter functions. In Milestone 1 this file contains 4 exports (RetrievalProblem, BruteForceKNN, ThreeWayTradeoff, DistanceMetrics). Milestone 2 adds 7 more.

### Modified files

- `src/config.js` - add 4 entries to `chapters[]`, add entry to `sectionNames`, add entry to `sectionColors`.
- `src/learn-ai.jsx` - add loader for section 11 in `sectionLoaders`.
- `src/__tests__/sections.test.jsx` - import `VectorFoundations` and add to `lookup`. Add content tests for the 4 new chapters.
- `src/data/svg-descriptions.json` - only if new `<svg>` elements are introduced (most Act 1 chapters use div-based visuals; Task 9 covers this conditionally).
- `CLAUDE.md` - add Section 11 mapping table and update project structure tree.

### Unchanged

All existing section files (`neural-foundations.jsx`, `llm-training.jsx`, `scaling.jsx`, `road-to-transformers.jsx`, `transformer-input.jsx`, `attention-qkv.jsx`, `attention-computation.jsx`, `transformer-block.jsx`, `encoder-decoder-diagrams.jsx`, `modern-llm-techniques.jsx`, `toc.jsx`).

---

## Standard running-example values (reference during implementation)

From the spec. Use consistently across 11.1-11.4:

- **Mini corpus (10 documents):** "Cats are small domesticated carnivores", "Dogs are loyal pets", "Lions are big cats that live in Africa", "My cat sat on the mat", "Tigers are striped cats", "Python is a programming language", "Kittens grow up to be cats", "The dog chased the cat", "Birds can fly", "Fish live underwater"
- **Standard query:** "information about cats"
- **d_visual:** 4 or 8 dimensions (drawable on screen)
- **d_real:** 768 (used in scaling / memory math)
- **N_visual:** 10 (the corpus)
- **N_real:** 1M to 1B (used in scaling discussions)

---

## Tasks

### Task 1: Create feature branch and verify green baseline

**Files:** none (git state + run tests)

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b section-11-vector-databases
git status
```

Expected: `On branch section-11-vector-databases`, `nothing to commit, working tree clean`.

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

### Task 2: Add Section 11 to sectionNames and sectionColors

**Files:**
- Modify: `src/config.js` lines 133-159

- [ ] **Step 1: Write failing test for Section 11 in config**

Add this test to `src/__tests__/config.test.js` (anywhere after existing describe blocks, or in an appropriate existing block if there's one for section metadata - scan the file first):

```js
describe("Section 11 registration", () => {
  it("has section 11 in sectionNames", () => {
    expect(sectionNames[11]).toBe("Vector Databases");
  });

  it("has section 11 in sectionColors", () => {
    expect(sectionColors[11]).toBe("#f06292");
  });
});
```

If `sectionNames`/`sectionColors` are not already imported at the top of `config.test.js`, import them:

```js
import { chapters, sectionNames, sectionColors } from "../config.js";
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL - `sectionNames[11]` is `undefined`.

- [ ] **Step 3: Add section 11 entry to sectionNames**

Edit `src/config.js`. Find `export const sectionNames = {` (around line 133) and add the section 11 entry after the section 10 line:

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
};
```

- [ ] **Step 4: Add section 11 entry to sectionColors**

In the same file, find `export const sectionColors = {` (around line 148) and add the section 11 entry:

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
};
```

Rationale: `#f06292` is rose, distinct from S1/S9 reds (`#ff6b6b`, `#ef5350`) and from S7 magenta (`#e040fb`). If the user prefers a different hue, they can override - but this color satisfies the spec's suggestion.

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add Section 11 name and color to config"
```

---

### Task 3: Create vector-foundations.jsx with stub exports for 11.1-11.4

**Files:**
- Create: `src/sections/vector-foundations.jsx`

This task creates stubs so the file can be imported without runtime errors. Full chapter content comes in Tasks 7-10.

- [ ] **Step 1: Write failing test for stub existence**

Add to `src/__tests__/lookup.test.js` (or create similar test block in sections.test.jsx if lookup.test.js structure is different - scan the file first):

```js
it("vector-foundations.jsx exports all Milestone 1 chapter components", async () => {
  const mod = await import("../sections/vector-foundations.jsx");
  expect(typeof mod.RetrievalProblem).toBe("function");
  expect(typeof mod.BruteForceKNN).toBe("function");
  expect(typeof mod.ThreeWayTradeoff).toBe("function");
  expect(typeof mod.DistanceMetrics).toBe("function");
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/lookup.test.js
```

Expected: FAIL - `Cannot find module '../sections/vector-foundations.jsx'`.

- [ ] **Step 3: Create the stub file**

Create `src/sections/vector-foundations.jsx` with this content:

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

export const RetrievalProblem = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Retrieval Problem (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const BruteForceKNN = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Brute-Force kNN (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ThreeWayTradeoff = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three-Way Tradeoff (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const DistanceMetrics = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Distance Metrics (stub)
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
git add src/sections/vector-foundations.jsx src/__tests__/lookup.test.js
git commit -m "Add stub exports for vector-foundations.jsx (11.1-11.4)"
```

---

### Task 4: Register vector-foundations.jsx in learn-ai.jsx sectionLoaders

**Files:**
- Modify: `src/learn-ai.jsx` lines 8-35

- [ ] **Step 1: Add loader entry**

Edit `src/learn-ai.jsx`. Find `const sectionLoaders = {` (around line 8) and add a section 11 loader after the section 10 entry:

```js
const sectionLoaders = {
  0: () => import("./sections/toc.jsx"),
  1: () => import("./sections/neural-foundations.jsx"),
  2: () => import("./sections/llm-training.jsx"),
  3: () =>
    Promise.all([import("./sections/scaling.jsx"), import("./sections/llm-training.jsx")]).then((mods) =>
      Object.assign({}, ...mods),
    ),
  4: () => import("./sections/road-to-transformers.jsx"),
  5: () => import("./sections/transformer-input.jsx"),
  6: () => import("./sections/attention-qkv.jsx"),
  7: () => import("./sections/attention-computation.jsx"),
  8: () =>
    Promise.all([import("./sections/road-to-transformers.jsx"), import("./sections/transformer-block.jsx")]).then(
      (mods) => Object.assign({}, ...mods),
    ),
  9: () =>
    Promise.all([
      import("./sections/road-to-transformers.jsx"),
      import("./sections/attention-computation.jsx"),
      import("./sections/transformer-input.jsx"),
      import("./sections/encoder-decoder-diagrams.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
  10: () =>
    Promise.all([import("./sections/attention-computation.jsx"), import("./sections/modern-llm-techniques.jsx")]).then(
      (mods) => Object.assign({}, ...mods),
    ),
  11: () => import("./sections/vector-foundations.jsx"),
};
```

- [ ] **Step 2: Run lint to verify**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/learn-ai.jsx
git commit -m "Register Section 11 loader in learn-ai.jsx"
```

---

### Task 5: Add 11.1-11.4 entries to chapters array in config.js

**Files:**
- Modify: `src/config.js` lines 121-131 (after Section 10 entries)

- [ ] **Step 1: Write failing test**

Add to `src/__tests__/config.test.js`:

```js
describe("Section 11 chapters", () => {
  it("has chapters 11.1 through 11.4 in order", () => {
    const section11 = chapters.filter((ch) => ch.section === 11);
    expect(section11.length).toBe(4);
    expect(section11[0].id).toBe("11.1");
    expect(section11[0].component).toBe("RetrievalProblem");
    expect(section11[0].title).toBe("The Retrieval Problem");
    expect(section11[1].id).toBe("11.2");
    expect(section11[1].component).toBe("BruteForceKNN");
    expect(section11[1].title).toBe("Brute-Force kNN");
    expect(section11[2].id).toBe("11.3");
    expect(section11[2].component).toBe("ThreeWayTradeoff");
    expect(section11[2].title).toBe("The Three-Way Tradeoff");
    expect(section11[3].id).toBe("11.4");
    expect(section11[3].component).toBe("DistanceMetrics");
    expect(section11[3].title).toBe("Distance Metrics");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js
```

Expected: FAIL - `section11.length` is 0.

- [ ] **Step 3: Add chapter entries to config.js**

Edit `src/config.js`. Find the Section 10 entries (line 121 onwards ending with Thinking at line 130). Add Section 11 entries right after, before the closing `];`:

```js
  { id: "10.4", title: "Thinking - How Reasoning Models Work", section: 10, component: "Thinking" },
  // Section 11: Vector Databases
  { id: "11.1", title: "The Retrieval Problem", section: 11, component: "RetrievalProblem" },
  { id: "11.2", title: "Brute-Force kNN", section: 11, component: "BruteForceKNN" },
  { id: "11.3", title: "The Three-Way Tradeoff", section: 11, component: "ThreeWayTradeoff" },
  { id: "11.4", title: "Distance Metrics", section: 11, component: "DistanceMetrics" },
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
git commit -m "Add chapter entries 11.1-11.4 to config"
```

---

### Task 6: Add VectorFoundations to sections.test.jsx lookup

**Files:**
- Modify: `src/__tests__/sections.test.jsx` lines 5-31

The generic test block in sections.test.jsx iterates over `chapters` and looks up each component in `lookup`. Without this import, tests for 11.1-11.4 will fail with "fn is not a function".

- [ ] **Step 1: Run sections.test.jsx to confirm failure before change**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: FAIL - the generic "All chapters" describe block will try to call `fn()` for 11.1-11.4 where `fn` is undefined.

- [ ] **Step 2: Add the import and spread**

Edit `src/__tests__/sections.test.jsx`. Add the import line after the existing `import * as ModernLLMTechniques from ...` (around line 17):

```js
import * as ModernLLMTechniques from "../sections/modern-llm-techniques.jsx";
import * as VectorFoundations from "../sections/vector-foundations.jsx";
```

Then spread it into the lookup (around line 30):

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
};
```

- [ ] **Step 3: Run sections.test.jsx to verify it passes**

```bash
npx vitest run src/__tests__/sections.test.jsx
```

Expected: PASS. The generic test now runs against 11.1-11.4 stubs which render empty sub-levels without crashing.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Register VectorFoundations in sections.test lookup"
```

---

### Task 7: Implement Chapter 11.1 RetrievalProblem

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (replace stub `RetrievalProblem`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests at end of file)

**Chapter purpose (from spec):** Starting point. Embeddings from Section 5.2 are now sitting in a database of 1 billion. How do we find the 10 most similar to a query in milliseconds? Walk away knowing this is a retrieval problem, not a learning problem.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - Setup: embeddings to database**
  Title: "From embeddings to a retrieval problem"
  Callback to Section 5.2: the model produces dense vectors. Now we have many of them.
  Visual: 10-document cat corpus listed with tiny 4-dim vectors next to each (concrete values like `[0.81, 0.12, 0.45, 0.22]`). Query "information about cats" at top with its own vector.
  Key content: mention "Section 5.2", "embeddings", list the 10 docs, show the query.

- **sub=1 (C.cyan) - The core question**
  Title: "Find the 10 most similar documents"
  Frame the problem: given N stored vectors and one query vector, find the top-k most similar.
  Visual: query arrow pointing into a cloud of 10 colored vector dots, top-3 closest highlighted (docs 1, 3, 7 from corpus - cat-related).
  Key content: "top-10", "most similar", mention "retrieval" not "learning".

- **sub=2 (C.orange) - The scale problem**
  Title: "Now make it one billion"
  Show N scaling: 10 docs (trivial) → 1M (Wikipedia scale) → 1B (YouTube transcripts scale). At each scale the "search every vector" approach balloons.
  Visual: three side-by-side cards showing dot density at 10, 1M, 1B (1B = solid fill).
  Key content: "1 billion", "Wikipedia", "every vector", "every query".

- **sub=3 (C.green) - Real use cases**
  Title: "Where vector search shows up"
  Concrete production examples: semantic search ("find docs about X"), recommendation ("items similar to this"), image retrieval ("visually similar products"), duplicate detection, anomaly detection, RAG retrieval.
  Visual: grid of 6 use-case cards with a one-sentence example each.
  Key content: "semantic search", "recommendation", "image retrieval", "RAG".

- **sub=4 (C.red) - The framing for this section**
  Title: "This is a systems problem, not a model problem"
  The model already produced the embeddings. Vector search is about storage, indexing, and retrieval - a systems story, not a training story.
  Visual: split-view diagram. Left: "Training time - the model learned an embedding space" (collapsed box). Right: "Query time - we search that space" (expanded box showing index + query).
  Key content: "systems problem", "storage", "indexing", "the model is done".

- [ ] **Step 1: Write content tests for 11.1**

Append to `src/__tests__/sections.test.jsx` after existing content-test blocks:

```js
describe("RetrievalProblem (11.1) content", () => {
  const fn = VectorFoundations.RetrievalProblem;

  it("sub=0 shows embeddings and the 10-doc cat corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/5\.2|embedding/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/information about cats/i);
  });

  it("sub=1 frames the retrieval task as top-k similarity", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/top-10|top 10/i);
    expect(container.textContent).toMatch(/similar/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 shows N scaling to 1 billion", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/every vector/i);
  });

  it("sub=3 shows multiple production use cases", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic search/i);
    expect(container.textContent).toMatch(/recommend|image|RAG/i);
  });

  it("sub=4 frames the section as a systems problem", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/systems problem|retrieval.*not.*training|indexing/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RetrievalProblem.*content"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full RetrievalProblem chapter**

Replace the stub export in `src/sections/vector-foundations.jsx` with the full implementation. Use the existing pattern in `modern-llm-techniques.jsx` as a reference (sub=0 inline, remaining subs wrapped in `<Reveal when={sub >= N}>`). Required:

- 5 sub-steps total (sub >= 0 through sub >= 4)
- Colors per sub-step as specified above (purple, cyan, orange, green, red)
- Center-aligned titles (`<T color={C.X} bold center size={22}>`)
- Concrete cat corpus content (use the standard 10 documents; don't paraphrase)
- Content must include the strings the tests assert on (see test regex above)
- Inner element tinted backgrounds: `background: \`\${C.X}06\`` and `border: \`1px solid \${C.X}12\``
- No em-dashes anywhere
- Font sizes: body text 16-19px, titles 22px

Follow the spec's chapter 11.1 description and the sub-step structure above. Each sub-step is its own `<Reveal when={sub >= N}>` block (except sub=0 which uses inline `{sub >= 0 && ...}`).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "RetrievalProblem"
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

Expected: no errors. `npm run format` may modify the new file; re-add after formatting.

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 11.1 The Retrieval Problem"
```

---

### Task 8: Implement Chapter 11.2 BruteForceKNN

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (replace stub `BruteForceKNN`)
- Modify: `src/__tests__/sections.test.jsx`

**Chapter purpose:** The baseline: compute similarity against all N, sort, return top-k. Show it working on 10 docs (fast), scale to 1M (slow), 1B (hopeless). Walk away knowing why exact is impossible at scale.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.cyan) - The algorithm**
  Title: "The naive approach: compare to everything"
  Show the 3-step algorithm: (1) compute similarity(query, doc_i) for every doc, (2) sort by similarity, (3) return top-k.
  Visual: pseudo-code-style center-aligned box with the three lines. Then a numbered list expanding each step.
  Key content: "compute similarity", "sort", "top-k".

- **sub=1 (C.green) - It works!**
  Title: "On 10 docs, this is instant"
  Show it running on the cat corpus. Compute cosine between query and each doc. Rank them. Show the top-3 results (cat-related docs). Show that this correctness is exact: we looked at every doc so we can't miss anything.
  Visual: table with 10 rows (doc text, similarity score, rank). Top-3 highlighted green.
  Key content: all 10 docs present, "cosine", specific scores (e.g., "0.92"), "exact".

- **sub=2 (C.yellow) - What about one million?**
  Title: "At N = 1,000,000 it's slow but possible"
  Same algorithm, more work. 1M cosine computations at d=768 ≈ 1M × 768 multiplications = ~770M ops. On modern hardware: a few hundred ms per query. Slow, but works.
  Visual: time bar comparing N=10 (instant) vs N=1M (300ms).
  Key content: "1,000,000" or "1 million", "768", some time figure.

- **sub=3 (C.red) - What about one billion?**
  Title: "At N = 1 billion, it's hopeless"
  The math: 1B × 768 × 4 bytes = 3.072 TB of vector data to read per query. Even if distance was free, just reading memory is the bottleneck. RAM bandwidth ceiling blown.
  Visual: show the calculation step-by-step: `1B × 768 × 4 bytes = 3.072 TB`. Red "NOPE" indicator.
  Key content: "3.072 TB" or "3 TB", "1 billion" or "1B", "768", one of "hopeless/not feasible/bottleneck".

- **sub=4 (C.purple) - The way out: approximate**
  Title: "Give up exactness for speed"
  Introduce the term: ANN = Approximate Nearest Neighbor. Define recall@k as the metric that quantifies what is given up. Real ANN methods reach 99%+ recall with 100-1000x speedups over brute force - the exactness being given up is tiny relative to the speed gained.
  Visual: tradeoff diagram with Exact (slow) on left, ANN (fast + 99% recall) on right, arrow pointing right labeled "this is what production uses".
  Key content: "ANN" or "Approximate Nearest Neighbor", "recall", "99%" or "0.99". (No "Preview:" / "we'll see" / "coming up" language - per visual design rules, no forward references to chapters.)

- [ ] **Step 1: Write content tests for 11.2**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("BruteForceKNN (11.2) content", () => {
  const fn = VectorFoundations.BruteForceKNN;

  it("sub=0 describes the compute-sort-return-k algorithm", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/compute.*similarit/i);
    expect(container.textContent).toMatch(/sort/i);
    expect(container.textContent).toMatch(/top-k|top k/i);
  });

  it("sub=1 runs brute-force on the 10-doc corpus with cosine", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/exact/i);
  });

  it("sub=2 shows slowdown at N = 1 million", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1,000,000|1 million|1M/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=3 shows 3 TB memory math at 1 billion scale", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3\.072 TB|3 TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/hopeless|not feasible|bottleneck/i);
  });

  it("sub=4 introduces ANN and recall as the metric", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ANN|Approximate Nearest Neighbor/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/99%|0\.99/);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "BruteForceKNN"
```

Expected: content tests FAIL. Generic render tests still pass (stub still works).

- [ ] **Step 3: Implement the full BruteForceKNN chapter**

Replace the stub in `src/sections/vector-foundations.jsx`. Same patterns as Task 7: 5 sub-steps with colors cyan / green / yellow / red / purple. Use the standard 10-doc corpus in sub=1. Use real memory math (1B × 768 × 4 = 3.072 TB) in sub=3. Content must match test regex.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "BruteForceKNN"
```

Expected: PASS.

- [ ] **Step 5: Run full test suite**

```bash
npm run test
```

Expected: all pass.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 11.2 Brute-Force kNN"
```

---

### Task 9: Implement Chapter 11.3 ThreeWayTradeoff

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (replace stub `ThreeWayTradeoff`)
- Modify: `src/__tests__/sections.test.jsx`

**Chapter purpose:** The three axes that govern every vector DB decision: recall, latency, memory. Introduce recall@k formally. Show that pushing any corner pushes another. Every decision in this section is a tradeoff along these three axes.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.purple) - The three axes**
  Title: "Every decision trades recall, latency, or memory"
  Show a triangle with "Recall", "Latency", "Memory" at the vertices. One sentence per vertex.
  Visual: triangle SVG with labeled vertices, or 3-column split diagram.
  Key content: "recall", "latency", "memory", "tradeoff".

- **sub=1 (C.cyan) - Defining recall@k**
  Title: "Recall@k: how many of the true top-k did we find?"
  Formula: `recall@k = |ANN_results ∩ true_top_k| / k`. Concrete example: true top-10 for the cat query is {doc1, doc3, doc4, doc5, doc7, doc8, plus 4 others}. ANN returns 9 correct + 1 incorrect → recall@10 = 9/10 = 0.9 (90%).
  Visual: two columns (true top-10 on left, ANN top-10 on right), matches highlighted green, mismatch in red. Score shown.
  Key content: "recall@k" or "recall@10", "0.9" or "90%", intersection wording or "found".

- **sub=2 (C.orange) - Latency**
  Title: "How long does one query take?"
  Brute force on 1M vectors: ~100 ms. HNSW on same data: ~1 ms. Two orders of magnitude. In production we measure P50/P95/P99 (the tail matters).
  Visual: horizontal bar chart comparing latencies with log scale markers at 1ms, 10ms, 100ms, 1s.
  Key content: "100 ms", "1 ms", "P99" or "P95" or "tail", "HNSW".

- **sub=3 (C.yellow) - Memory**
  Title: "How many bytes per vector?"
  Real math: d=768 float32 = 3072 bytes = 3 KB per vector. 1M vectors = 3 GB. 100M = 300 GB. Add index overhead (HNSW adds ~100 bytes/vector for graph edges).
  Visual: scaling table - N, total memory for vectors, total memory with HNSW overhead, all as concrete numbers.
  Key content: "3 KB" or "3072 bytes", "768", "100 bytes" for overhead or equivalent.

- **sub=4 (C.red) - The tension**
  Title: "Pushing one corner costs another"
  Show 3 concrete tradeoffs: (1) raise ef_search to raise recall → raises latency; (2) add PQ compression to cut memory → loses recall; (3) add more replicas to cut latency → multiplies memory cost.
  Visual: three paired arrows, each showing "up X → up Y" or "down X → down Z".
  Key content: "ef_search", "PQ" or "compression", "replicas" or "replica" or "cache".

- **sub=5 (C.green) - Every decision is a move on this triangle**
  Title: "Every decision is a move on this triangle"
  Frame the rest of the section as triangle navigation, without saying "we'll see" or "coming up" (visual rule). Indexing algorithms trade latency for memory. Quantization and compression trade memory for recall. Production concerns like filtering and sharding move all three corners. Knowing which corner is being pushed is how any technique gets reasoned about.
  Visual: triangle from sub=0 repeated, with arrows labeled by technique category (Indexing, Quantization, Filtering) pointing in specific directions.
  Key content: "algorithm", "quantization", "every decision" or similar framing. (No forward references to specific chapter titles or chapter numbers.)

- [ ] **Step 1: Write content tests for 11.3**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ThreeWayTradeoff (11.3) content", () => {
  const fn = VectorFoundations.ThreeWayTradeoff;

  it("sub=0 introduces recall, latency, memory as the three axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/tradeoff|trade-off|trade off/i);
  });

  it("sub=1 defines recall@k with concrete 0.9 example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall@k|recall@10/i);
    expect(container.textContent).toMatch(/0\.9|90%/);
  });

  it("sub=2 compares brute-force and HNSW latencies", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/100\s?ms/);
    expect(container.textContent).toMatch(/1\s?ms/);
    expect(container.textContent).toMatch(/HNSW/);
  });

  it("sub=3 shows per-vector memory math at d=768", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3 KB|3072 bytes/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=4 shows ef_search, compression, replica tradeoffs", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ef_search/);
    expect(container.textContent).toMatch(/PQ|compression/i);
    expect(container.textContent).toMatch(/replica|cache/i);
  });

  it("sub=5 frames every decision as a tradeoff-triangle move", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/HNSW|algorithm/i);
    expect(container.textContent).toMatch(/quantization|PQ/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ThreeWayTradeoff"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ThreeWayTradeoff chapter**

Replace stub in `src/sections/vector-foundations.jsx`. 6 sub-steps (colors: purple, cyan, orange, yellow, red, green). Follow existing patterns. All content from the sub-step structure above must be present literally enough to match the test regex.

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ThreeWayTradeoff"
```

Expected: PASS.

- [ ] **Step 5: Run full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 11.3 The Three-Way Tradeoff"
```

---

### Task 10: Implement Chapter 11.4 DistanceMetrics

**Files:**
- Modify: `src/sections/vector-foundations.jsx` (replace stub `DistanceMetrics`)
- Modify: `src/__tests__/sections.test.jsx`

**Chapter purpose:** Three production metrics (cosine, L2, inner product). Show each formula, compute on the cat corpus, show when they agree vs. disagree. The L2-normalized identity (cosine == inner product after normalization) and why it matters for hardware.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - Three production metrics**
  Title: "Three ways to measure similarity"
  List: cosine, L2 (Euclidean), inner product. One sentence on what each measures.
  Visual: 3-column split with metric name, formula (use middle dot for dot product per CLAUDE.md), one-line description.
  Key content: "cosine", "L2" or "Euclidean", "inner product" or "dot product".

- **sub=1 (C.green) - Cosine**
  Title: "Cosine: the angle between vectors"
  Formula: `cos(q, d) = (q · d) / (||q|| × ||d||)`. Use middle dot.
  Range [-1, 1]. For text embeddings (typically L2-normalized) this is the default. Show computation on 2 corpus docs vs. query.
  Visual: two-vector diagram with angle labeled. Concrete cosine values for doc1 (cat-related, high similarity) and doc9 (birds, low similarity).
  Key content: "cosine", `[-1, 1]` or "range", "angle", specific values like "0.92" for a cat-related doc.

- **sub=2 (C.blue) - L2 (Euclidean)**
  Title: "L2: straight-line distance"
  Formula: `L2(q, d) = sqrt(sum_i (q_i - d_i)^2)`.
  Smaller is better (it's a distance, not a similarity). Magnitude matters (unlike cosine). Used in some vision embeddings where vector magnitude carries signal.
  Visual: two points in 2D with Pythagorean-style right-triangle distance.
  Key content: "L2" or "Euclidean", "sqrt" or "√", "smaller" (or "distance"), "magnitude".

- **sub=3 (C.orange) - Inner Product**
  Title: "Inner product: the fastest of all"
  Formula: `q · d = sum_i q_i × d_i` (use middle dot).
  No normalization, no sqrt, no division. Pure multiply-and-add. SIMD-friendly, hardware-accelerated on modern CPUs. Range depends on magnitudes (unbounded).
  Visual: side-by-side op count: cosine (d mults + 2 norms + 1 divide) vs. inner product (d mults). Show SIMD-friendly block.
  Key content: "inner product" or "dot product", "fastest" or "no sqrt", "SIMD".

- **sub=4 (C.yellow) - The identity**
  Title: "When vectors are L2-normalized, all three are equivalent"
  Show the math: if `||q|| = ||d|| = 1`, then `cos(q,d) = q · d` and the L2 ranking is reversed-monotonic to dot-product ranking. So production systems normalize once at ingest, then use inner product forever.
  Visual: three metric formulas with the normalization substitution applied, collapsing to the same thing.
  Key content: "normalized" or "L2-normalized", "identity" or "equivalent" or "same ranking", "ingest" or "once".

- **sub=5 (C.purple) - Which to pick**
  Title: "Which metric for which workload"
  Decision table: text embeddings (SBERT, OpenAI) → cosine (because pre-normalized); some vision embeddings → L2 (magnitude carries signal); after normalization, always inner product (it's what the hardware likes).
  Visual: table with 3 rows: embedding family, which metric, why.
  Key content: "text", "vision" or "image", "cosine", "L2" (or "Euclidean"), one specific model name like "SBERT" or "OpenAI".

- [ ] **Step 1: Write content tests for 11.4**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("DistanceMetrics (11.4) content", () => {
  const fn = VectorFoundations.DistanceMetrics;

  it("sub=0 lists cosine, L2, inner product", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/inner product|dot product/i);
  });

  it("sub=1 defines cosine with range and concrete example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/angle|\[-1, 1\]/);
  });

  it("sub=2 defines L2 as a distance with sqrt", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/sqrt|√/);
    expect(container.textContent).toMatch(/magnitude|smaller/i);
  });

  it("sub=3 highlights inner product speed and SIMD friendliness", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inner product|dot product/i);
    expect(container.textContent).toMatch(/SIMD|fastest|no sqrt/i);
  });

  it("sub=4 shows the normalization identity", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/normalized/i);
    expect(container.textContent).toMatch(/equivalent|identity|same/i);
  });

  it("sub=5 gives workload-to-metric guidance", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/text|SBERT|OpenAI/i);
    expect(container.textContent).toMatch(/vision|image/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DistanceMetrics"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full DistanceMetrics chapter**

Replace stub in `src/sections/vector-foundations.jsx`. 6 sub-steps (colors: cyan, green, blue, orange, yellow, purple). Critical formatting rules:

- **Dot product uses the middle dot character `·`**, not asterisk or multiplication sign (CLAUDE.md rule). Example: `q · d` not `q * d`.
- **No em-dashes.** Use hyphens or rewrite.
- Standalone formulas get `textAlign: "center"` on their container div.
- Font sizes 16-19 for body, 22 for titles.

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "DistanceMetrics"
```

Expected: PASS.

- [ ] **Step 5: Run full test suite**

```bash
npm run test
```

Expected: all pass.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-foundations.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 11.4 Distance Metrics"
```

---

### Task 11: Add any SVG descriptions to svg-descriptions.json

**Files:**
- Modify: `src/data/svg-descriptions.json` (if any `<svg>` elements were added)

Most Act 1 chapters will use div-based visuals (colored boxes, tables, grids) and not actual `<svg>` elements. But if any chapter implementer chose to use `<svg>` for triangle diagrams (ThreeWayTradeoff sub=0), angle diagrams (DistanceMetrics sub=1), or similar, each `<svg>` must have a `<desc>` child AND a corresponding entry in `svg-descriptions.json`.

- [ ] **Step 1: Grep for new <svg> usage**

```bash
grep -n "<svg" src/sections/vector-foundations.jsx
```

- [ ] **Step 2: For each `<svg>` found, confirm it has a `<desc>` as first child**

Required pattern:

```jsx
<svg viewBox="...">
  <desc>Plain-language description of the diagram, 1-2 sentences.</desc>
  {/* rest */}
</svg>
```

If any `<svg>` lacks a `<desc>`, add one before proceeding.

- [ ] **Step 3: For each `<svg>`, add entry to svg-descriptions.json**

The JSON is keyed by chapter ID with an array of description strings (one per SVG in that chapter, in document order). Example:

```json
{
  "11.3": [
    "Triangle diagram with recall, latency, and memory labeled at each vertex, showing the three-way tradeoff that governs vector database decisions"
  ]
}
```

Add entries for any chapters that introduced SVGs. Do NOT add keys for chapters with no SVGs.

- [ ] **Step 4: Run svg-descriptions validation test**

```bash
npx vitest run src/__tests__/svg-descriptions.test.js
```

Expected: PASS. All SVGs have matching entries.

- [ ] **Step 5: Commit (only if changes)**

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for 11.1-11.4"
```

If no SVGs were added in Act 1 chapters, skip this task's commit. That's fine - it's a conditional task.

---

### Task 12: Update CLAUDE.md with Section 11 mapping and project structure

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add Section 11 mapping table**

Find the "Complete Mapping" section of CLAUDE.md. After the Section 10 mapping table (which lists KVCache, GroupedQueryAttention, MixtureOfExperts, Thinking), add:

```markdown
**Section 11: Vector Databases** (`vector-foundations.jsx` - Milestone 1 of 6)

| Chapter | Component | Title |
|---------|-----------|-------|
| 11.1 | RetrievalProblem | The Retrieval Problem |
| 11.2 | BruteForceKNN | Brute-Force kNN |
| 11.3 | ThreeWayTradeoff | The Three-Way Tradeoff |
| 11.4 | DistanceMetrics | Distance Metrics |
```

(Subsequent milestones will extend this table.)

- [ ] **Step 2: Update the project structure tree**

Find the "Project Structure" section of CLAUDE.md. In the `src/sections/` tree listing, add the new section file between `modern-llm-techniques.jsx` and any following entries:

```
│       ├── modern-llm-techniques.jsx    # Section 10 (MoE, Thinking)
│       └── vector-foundations.jsx        # Section 11 (Acts 1 + 2, chapters 11.1-11.11)
```

(Milestone 1 only has 11.1-11.4 in this file, but the comment reflects its eventual scope.)

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md with Section 11 mapping and structure"
```

---

### Task 13: Manual browser verification

**Files:** none (runtime verification)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: server starts on http://localhost:5173/learn-ai/.

- [ ] **Step 2: Navigate through 11.1-11.4 in the browser**

Open the URL. Use the TOC or keyboard navigation to reach chapter 11.1. Click through all sub-steps (Continue/Next button or spacebar). Verify each sub-step:

1. **11.1 RetrievalProblem** - 5 sub-steps render in sequence; corpus visible; no layout errors.
2. **11.2 BruteForceKNN** - 5 sub-steps; 10-doc table renders at sub=1; 3 TB math readable at sub=3.
3. **11.3 ThreeWayTradeoff** - 6 sub-steps; triangle / 3-axis visual present; recall@10 example readable.
4. **11.4 DistanceMetrics** - 6 sub-steps; three formulas render with middle-dot notation; normalization identity visible at sub=4.

Check that:
- Sidebar / TOC shows Section 11 "Vector Databases" with the rose color.
- All Box titles are center-aligned.
- No em-dashes visible anywhere.
- No browser console errors.

- [ ] **Step 2a: If any issue found, fix it and re-run tests**

If a visual issue surfaces (colors wrong, layout broken, text overflow), fix the chapter function. Re-run `npm run test` after any fix, and re-verify in the browser.

- [ ] **Step 3: Stop the dev server**

Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 4: No commit at this step unless fixes were made**

If fixes were made during verification, commit them:

```bash
git add src/sections/vector-foundations.jsx
git commit -m "Browser-verified fixes to 11.1-11.4 chapters"
```

---

### Task 14: Final full-suite verification and coverage check

**Files:** none (run commands, verify output)

- [ ] **Step 1: Run all tests with coverage**

```bash
npx vitest run --coverage
```

Expected:
- All tests pass.
- Line coverage 100%.
- Branch coverage >= 97.7% (baseline from CLAUDE.md).

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Run format check**

```bash
npm run format
```

Expected: no changes (or minor changes to new files; if any, stage and commit).

- [ ] **Step 4: Verify no em-dashes anywhere in new code**

```bash
grep -rn "—" src/sections/vector-foundations.jsx
```

Expected: no matches. If any found, replace with hyphens and re-run the full test suite.

- [ ] **Step 5: Verify no use of `C.card` for Box colors in new code**

```bash
grep -n "Box color={C.card}" src/sections/vector-foundations.jsx
```

Expected: no matches. (All Boxes must use colored hues per visual rules.)

- [ ] **Step 6: Push the feature branch**

```bash
git push -u origin section-11-vector-databases
```

- [ ] **Step 7: Report milestone completion**

Summarize:
- 4 chapters added (11.1-11.4)
- Section 11 visible in the app
- Tests: count total + passing
- Coverage numbers (line / branch)
- Any browser-verified issues that were fixed
- Next up: Milestone 2 (chapters 11.5-11.11) will be planned in a fresh session.

---

## Self-Review Notes

**Spec coverage:** this plan covers Milestone 1 of the spec exclusively (Act 1, chapters 11.1-11.4, plus Section 11 scaffolding). Milestones 2-6 are deferred to separate plans per the spec's own implementation-sequencing section.

**Type consistency check:**
- Component names match spec's Component Naming Table exactly: `RetrievalProblem`, `BruteForceKNN`, `ThreeWayTradeoff`, `DistanceMetrics`.
- Standard running-example numbers (d=768, N=1M/1B, 3.072 TB) are consistent between tasks 7-10 and the spec.
- `C.purple`, `C.cyan`, `C.orange`, `C.green`, `C.yellow`, `C.red`, `C.blue` all exist in the C palette (verified in `src/config.js`).

**No placeholders:**
- Every test has concrete regex.
- Every code change has exact file/line-range direction or full code block.
- Sub-step structures are concrete enough that an implementer knows what to write.
- Where implementer judgment is required (JSX layout inside sub-steps), the implementer is pointed to an existing example file (`modern-llm-techniques.jsx`) to pattern-match from.
