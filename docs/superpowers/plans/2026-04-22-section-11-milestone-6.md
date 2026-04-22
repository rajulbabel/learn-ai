# Section 11 Milestone 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 6 of Section 11 "Vector Databases" - the seven System Selection chapters (11.29 FAISS through 11.35 DecisionFramework). These live in a NEW file `src/sections/vector-systems.jsx`. At the end of this milestone the app ships with all 35 navigable chapters in Section 11 (11.1 through 11.35), completing the full section arc and closing out the Vector Databases track. This is the final milestone of Section 11.

**Architecture:** Create a new section file `src/sections/vector-systems.jsx` and register it in `learn-ai.jsx` so Section 11 loads FOUR files via Promise.all: `vector-foundations.jsx` (11.1-11.11), `vector-compression.jsx` (11.12-11.18), `vector-production.jsx` (11.19-11.28), and `vector-systems.jsx` (11.29-11.35). Each chapter follows the established learn-ai pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete running-example content (cat corpus + real system names).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-04-22-section-11-vector-databases-design.md` - chapters 11.29 through 11.35, Act 6 System Selection.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-04-22-section-11-milestone-5.md` - most recent executed plan with the same "new file + 4-file loader + lookup.test.js update" pattern (but with 10 chapters; this milestone has 7).
- `docs/superpowers/plans/2026-04-22-section-11-milestone-3.md` - earlier plan with the same new-file pattern at 5 chapters.

---

## Prerequisites

- Branch `section-11-vector-databases` checked out, clean. HEAD after Milestone 5 = `0042f1d Rebuild embeddings to include chapters 11.19-11.28`.
- Milestones 1-5 merged on the branch: 11.1-11.28 exported across `vector-foundations.jsx` (11.1-11.11) + `vector-compression.jsx` (11.12-11.18) + `vector-production.jsx` (11.19-11.28).
- CLAUDE.md Section 11 mapping currently shows 11.1-11.28; this milestone extends it to 11.1-11.35 and the milestones-of-6 annotation to "1-6 of 6 complete" (section done).
- All 2,091 tests currently pass. Coverage for `vector-production.jsx` is 100% lines / 100% branches.
- `src/learn-ai.jsx` Section 11 loader currently imports vector-foundations + vector-compression + vector-production; this milestone adds vector-systems as the fourth member of the Promise.all.
- `src/__tests__/sections.test.jsx` and `src/__tests__/lookup.test.js` already import the three existing Section 11 files; both need a new `import * as VectorSystems` and a spread-into-lookup line.

## File Structure

### New files
- `src/sections/vector-systems.jsx` - Act 6 chapter functions (7 exports: FAISS, Pgvector, Qdrant, Pinecone, QdrantVsPinecone, WeaviateMilvusChroma, DecisionFramework). Estimated file size: 3,500-5,000 lines (7 chapters x ~600 lines avg).

### Modified files
- `src/config.js` - append 7 entries to `chapters[]` after `{ id: "11.28", ... CapacityPlanning }`.
- `src/learn-ai.jsx` - extend the Section 11 loader Promise.all to include `vector-systems.jsx`.
- `src/__tests__/lookup.test.js` - add `import * as VectorSystems from "../sections/vector-systems.jsx"` and spread into the lookup object.
- `src/__tests__/sections.test.jsx` - add the same import + spread, then append content-test blocks for each new chapter (41 sub-step tests total).
- `src/__tests__/config.test.js` - extend the Section 11 test from 28 to 35 entries.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` with any Act 6 chapters that render SVGs (see Task 10).
- `src/data/svg-descriptions.json` - add entries keyed by each new chapter id (estimated 10-20 SVGs across seven chapters; many chapters may be text-only cards).
- `CLAUDE.md` - extend Section 11 mapping table to 35 rows, update milestones annotation to "1-6 of 6 complete", update project-structure tree to list the new file, drop the parenthetical about future milestones.

### Unchanged
- `src/sections/vector-foundations.jsx` (stable since Milestone 2).
- `src/sections/vector-compression.jsx` (stable since Milestone 4).
- `src/sections/vector-production.jsx` (stable since Milestone 5).
- `src/components.jsx`, all pre-Section-11 section files.

---

## Running example

Continue the cat-corpus + production-scale numbers established in prior milestones:

- **d = 768** canonical scale dim.
- **N scale anchors:** 1M, 100M, 1B.
- **float32 baseline** 3 KB/vector; HNSW overhead ~100 bytes/vector; PQ at m=96 96 bytes/vector.
- **IVF nlist &asymp; sqrt(N)**; nprobe defaults to 8.
- **HNSW defaults:** M = 16, ef_construction = 200, ef_search = 50.
- **Capacity-planning anchor from 11.28:** 500M vectors x d=768 x 200 QPS x 6 nodes x 3 TB RAM = Pinecone ~$30K / self-host Qdrant ~$8K / pgvector ~$5K per month (illustrative).

Additional numbers introduced in Act 6 (each used in one chapter; listed here to keep them consistent across chapters in case they are cross-referenced):

- **FAISS (11.29):** Meta open-sourced 2017. Inside: IVF, PQ, HNSW, IVF-PQ (CPU + CUDA). Embedded inside Milvus, OpenSearch, other commercial systems.
- **pgvector (11.30):** Postgres extension. `vector(768)` column type. `&lt;=&gt;` cosine distance operator. HNSW + IVFFlat index types. Sweet spot: under 10M vectors or metadata-heavy workloads on existing Postgres teams.
- **Qdrant (11.31):** Rust. Self-hostable, open-source. Single binary / Docker / Kubernetes operator. Collections with payload. Inline filtered-HNSW (from 11.19), hybrid search, SQ/PQ/BQ on HNSW.
- **Pinecone (11.32):** Managed SaaS, proprietary. Pod architecture (p1/p2) and Serverless tier (scale-to-zero, cold-start ~1 s first query after idle).
- **Qdrant vs Pinecone decision axes (11.33):** self-host vs managed, filter complexity, scale-to-zero availability, cost at 1M / 100M / 1B scale, feature depth, ecosystem maturity.
- **Weaviate / Milvus / Chroma / OpenSearch (11.34):**
  - Weaviate: Go, self-host, built-in modules (transformers, generative).
  - Milvus: Go + C++, distributed-native, billions of vectors, Azure AI Search core.
  - Chroma: Python-first, local/embedded, prototyping.
  - Elasticsearch/OpenSearch: existing Elastic stack + dense_vector extension.
- **Decision framework (11.35):** size buckets (&lt; 1M, 1M to 100M, 100M to 1B, &gt; 1B), ops preference (none / self-host / Postgres-native), filter complexity (simple / complex / analytical), design-review checklist.

---

## Implementation order

1. Task 1 - Verify green baseline.
2. Task 2 - Create `vector-systems.jsx` stubs + config entries + loader update + lookup.test.js update + sections.test.jsx import/spread.
3. Task 3 - Chapter 11.29 FAISS (6 sub-steps).
4. Task 4 - Chapter 11.30 Pgvector (6 sub-steps).
5. Task 5 - Chapter 11.31 Qdrant (6 sub-steps).
6. Task 6 - Chapter 11.32 Pinecone (6 sub-steps).
7. Task 7 - Chapter 11.33 QdrantVsPinecone (6 sub-steps).
8. Task 8 - Chapter 11.34 WeaviateMilvusChroma (5 sub-steps).
9. Task 9 - Chapter 11.35 DecisionFramework (6 sub-steps).
10. Task 10 - SVG descriptions + svg-descriptions.test.js update.
11. Task 11 - CLAUDE.md update (final: &ldquo;1-6 of 6 complete&rdquo;).
12. Task 12 - Browser verification with claude-in-chrome.
13. Task 13 - Final full-suite + coverage.

Commit cadence: one commit per chapter (Tasks 3-9), plus one each for Tasks 2, 10, 11, 12 (if fixes), 13 (if any). Target: 9-11 commits total.

---

## Task 1: Verify green baseline

**Files:** none.

- [ ] **Step 1:** Confirm branch and clean state

  ```bash
  git status
  git log --oneline -5
  ```

  Expected: `On branch section-11-vector-databases`, clean tree, HEAD = `0042f1d Rebuild embeddings to include chapters 11.19-11.28`.

- [ ] **Step 2:** Run test suite

  ```bash
  npm run test
  ```

  Expected: 2,091 tests pass.

- [ ] **Step 3:** Run linter

  ```bash
  npm run lint
  ```

  Expected: 0 errors (pre-existing warnings in `encoder-decoder-diagrams.jsx` and `vector-foundations.jsx` are OK).

No commit.

---

## Task 2: Scaffold vector-systems.jsx + config + loader + test imports

**Files:**
- Create: `src/sections/vector-systems.jsx`.
- Modify: `src/config.js` (append 7 chapter entries).
- Modify: `src/learn-ai.jsx` (extend Section 11 Promise.all with the new file).
- Modify: `src/__tests__/sections.test.jsx` (add import + spread).
- Modify: `src/__tests__/lookup.test.js` (add import + spread).
- Modify: `src/__tests__/config.test.js` (extend Section 11 chapter-list test to 35 entries).

- [ ] **Step 1:** Update `src/__tests__/config.test.js`

  Replace the existing `describe("Section 11 chapters", ...)` block's inner `it(...)` title and expected array to include 11.29-11.35:

  ```js
  describe("Section 11 chapters", () => {
    it("has chapters 11.1 through 11.35 in order", () => {
      const section11 = chapters.filter((ch) => ch.section === 11);
      const expected = [
        // ...existing 11.1 through 11.28 rows (copy from current file) ...
        { id: "11.29", component: "FAISS", title: "FAISS" },
        { id: "11.30", component: "Pgvector", title: "pgvector" },
        { id: "11.31", component: "Qdrant", title: "Qdrant" },
        { id: "11.32", component: "Pinecone", title: "Pinecone" },
        { id: "11.33", component: "QdrantVsPinecone", title: "Qdrant vs Pinecone" },
        { id: "11.34", component: "WeaviateMilvusChroma", title: "Weaviate / Milvus / Chroma" },
        { id: "11.35", component: "DecisionFramework", title: "The Decision Framework" },
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

  Expected: FAIL (length is 28, not 35).

- [ ] **Step 3:** Add the 7 entries in `src/config.js` after the `11.28 CapacityPlanning` row:

  ```js
    { id: "11.28", title: "Capacity Planning & Cost Models", section: 11, component: "CapacityPlanning" },
    { id: "11.29", title: "FAISS", section: 11, component: "FAISS" },
    { id: "11.30", title: "pgvector", section: 11, component: "Pgvector" },
    { id: "11.31", title: "Qdrant", section: 11, component: "Qdrant" },
    { id: "11.32", title: "Pinecone", section: 11, component: "Pinecone" },
    { id: "11.33", title: "Qdrant vs Pinecone", section: 11, component: "QdrantVsPinecone" },
    { id: "11.34", title: "Weaviate / Milvus / Chroma", section: 11, component: "WeaviateMilvusChroma" },
    { id: "11.35", title: "The Decision Framework", section: 11, component: "DecisionFramework" },
  ];
  ```

- [ ] **Step 4:** Create `src/sections/vector-systems.jsx` with stubs for all 7 chapters. Each stub must render something for sub=0 (so the generic &ldquo;All chapters&rdquo; render test passes) and include a `<SubBtn>` that advances sub until the last sub-step. Use this template for every stub, varying only the component name, color, and `sub &lt; N` count:

  ```jsx
  import { Box, T, Reveal, SubBtn } from "../components.jsx";
  import { C } from "../config.js";

  // Section 11 Act 6: System Selection (chapters 11.29-11.35).
  // Continues the cat-corpus + production-scale numbers from 11.1-11.28.
  // Capacity-planning anchor (11.28): 500M vectors x d=768 x 200 QPS x 6 nodes x 3 TB RAM.

  export const FAISS = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={22}>
              FAISS (stub)
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

  // Repeat for Pgvector (C.yellow, sub < 5), Qdrant (C.green, sub < 5), Pinecone (C.orange, sub < 5),
  // QdrantVsPinecone (C.red, sub < 5), WeaviateMilvusChroma (C.purple, sub < 4),
  // DecisionFramework (C.pink, sub < 5).
  ```

  All seven stubs have the same body shape. Stub colors in order: cyan, yellow, green, orange, red, purple, pink. (Color choice is not load-bearing for the stubs; per-chapter tasks re-assign colors per sub-step.)

- [ ] **Step 5:** Update `src/learn-ai.jsx` Section 11 loader

  Find:

  ```js
    11: () =>
      Promise.all([
        import("./sections/vector-foundations.jsx"),
        import("./sections/vector-compression.jsx"),
        import("./sections/vector-production.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

  Replace with:

  ```js
    11: () =>
      Promise.all([
        import("./sections/vector-foundations.jsx"),
        import("./sections/vector-compression.jsx"),
        import("./sections/vector-production.jsx"),
        import("./sections/vector-systems.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

- [ ] **Step 6:** Update `src/__tests__/sections.test.jsx`

  Add this import after the existing `import * as VectorProduction`:

  ```js
  import * as VectorSystems from "../sections/vector-systems.jsx";
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
    ...VectorSystems,
  };
  ```

- [ ] **Step 7:** Update `src/__tests__/lookup.test.js`

  Add the same import + spread (keep the ordering identical to `sections.test.jsx`).

- [ ] **Step 8:** Run tests to verify GREEN

  ```bash
  npx vitest run src/__tests__/config.test.js src/__tests__/sections.test.jsx src/__tests__/lookup.test.js
  ```

  Expected: all pass. Generic &ldquo;All chapters&rdquo; render test should pass for 11.29-11.35 because each stub renders at least one Box at sub=0.

- [ ] **Step 9:** Lint + format

  ```bash
  npm run lint
  npm run format
  ```

- [ ] **Step 10:** Commit

  ```bash
  git add -A
  git commit -m "Scaffold vector-systems.jsx and register chapters 11.29-11.35"
  ```

---

## Task 3: Implement Chapter 11.29 FAISS (6 sub-steps)

**Files:**
- Modify: `src/sections/vector-systems.jsx` (replace the `FAISS` stub with the full implementation).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block after the CapacityPlanning block).

**Chapter purpose (from spec):** FAISS is the library, not a database. Meta's reference implementation of IVF, PQ, HNSW, IVF-PQ. C++ with Python bindings. Used as the index engine inside Milvus, OpenSearch, many others. What FAISS gives you: algorithms. What it does not: persistence, API, filtering, replication, ops. The rule: use FAISS when building a system; use a DB when you want a system.

**Sub-step structure:**

- **sub=0 (C.cyan) - Meta open-sourced FAISS in 2017.** Title: &ldquo;FAISS: Meta's reference library for ANN&rdquo;. Timeline + &ldquo;library, not a database&rdquo; framing. Key content: /FAISS/, /Meta|Facebook/i, /2017|library/i.

- **sub=1 (C.yellow) - What is inside FAISS.** Title: &ldquo;Inside FAISS: IVF, PQ, HNSW, IVF-PQ&rdquo;. 4-card grid listing the index types (IVF, PQ, HNSW, IVF-PQ) with the CPU + CUDA note. Key content: /IVF/, /PQ/, /HNSW/, /CPU|CUDA|GPU/i.

- **sub=2 (C.green) - Python on a C++ core.** Title: &ldquo;Python bindings over a C++ core&rdquo;. Explain the embed-into-ML-pipelines ergonomics. Key content: /Python/i, /C\+\+|core/i, /bindings?|embed/i.

- **sub=3 (C.orange) - What FAISS does NOT provide.** Title: &ldquo;No persistence, no API, no filters, no replication&rdquo;. 4-card &ldquo;missing feature&rdquo; grid. Key content: /persist/i, /API|REST/i, /filter|ACID|replicat/i.

- **sub=4 (C.red) - FAISS as the engine inside other systems.** Title: &ldquo;FAISS powers Milvus, OpenSearch, and many commercial systems&rdquo;. Key content: /Milvus/, /OpenSearch|engine/i, /inside|underneath/i.

- **sub=5 (C.purple) - The rule.** Title: &ldquo;FAISS to build a system; a DB to use one&rdquo;. Summary card framing the build-vs-use decision. Key content: /build/i, /DB|database/i, /use one|use it/i.

Test regex set (translate each sub-step bullet's &ldquo;Key content&rdquo; into a describe block following the Milestone 5 Task 3 template). Commit message: `Implement chapter 11.29 FAISS`.

---

## Task 4: Implement Chapter 11.30 Pgvector (6 sub-steps)

**Chapter purpose:** Postgres extension. HNSW + IVFFlat. Transactional writes, SQL queries, exists alongside relational data.

**Sub-step structure:**

- **sub=0 (C.cyan) - Postgres extension adding vector types.** Title: &ldquo;pgvector is a Postgres extension&rdquo;. Key content: /Postgres/i, /extension/i, /vector/i.

- **sub=1 (C.yellow) - SQL syntax.** Title: &ldquo;`ALTER TABLE ... ADD COLUMN embedding vector(768)`&rdquo;. Worked SQL example: `ORDER BY embedding &lt;=&gt; query_embedding`. Key content: /ALTER TABLE|ADD COLUMN/i, /vector\(768\)|768/, /&lt;=&gt;|cosine/i.

- **sub=2 (C.green) - Index types.** Title: &ldquo;HNSW or IVFFlat, tuned via SQL&rdquo;. Tunable parameters (m, ef, lists, probes). Key content: /HNSW/i, /IVFFlat|IVF/i, /SQL|tuning|parameters/i.

- **sub=3 (C.orange) - Inherited Postgres features.** Title: &ldquo;Transactions, SQL joins, ACID, metadata queries&rdquo;. Key content: /transaction|ACID/i, /SQL join|join/i, /metadata/i.

- **sub=4 (C.red) - Good fit.** Title: &ldquo;Under 10M vectors, metadata-heavy, existing Postgres team&rdquo;. Bullet list. Key content: /10M|under 10M/i, /metadata/i, /existing|Postgres team/i.

- **sub=5 (C.purple) - Bad fit.** Title: &ldquo;Over 100M vectors, over 10K QPS, multi-region&rdquo;. Bullet list. Key content: /100M|over 100M/i, /10K|QPS/i, /multi[- ]?region/i.

Tests + commit: `Implement chapter 11.30 pgvector`.

---

## Task 5: Implement Chapter 11.31 Qdrant (6 sub-steps)

**Chapter purpose:** Rust, self-hostable, HNSW-first. Rich filtering with inline filtered-HNSW (best-in-class filter performance).

**Sub-step structure:**

- **sub=0 (C.cyan) - Rust, open-source, self-hostable.** Title: &ldquo;Qdrant: Rust-based vector DB&rdquo;. Key content: /Qdrant/, /Rust/i, /open[- ]?source|self[- ]?host/i.

- **sub=1 (C.yellow) - Core architecture.** Title: &ldquo;HNSW graph + inline filter during traversal&rdquo;. Reference to the filtered-HNSW approach from 11.19. Key content: /HNSW/, /inline|filter|traversal/i, /payload/i.

- **sub=2 (C.green) - Collections and payload.** Title: &ldquo;Collections with per-vector payload metadata&rdquo;. Mention multi-vector support (from 11.25). Key content: /collection/i, /payload|metadata/i, /multi[- ]?vector/i.

- **sub=3 (C.orange) - Built-in features.** Title: &ldquo;Hybrid search, scalar/PQ/binary quantization&rdquo;. Key content: /hybrid/i, /quantization|scalar|binary/i, /SQ|PQ|BQ/.

- **sub=4 (C.red) - Self-host story.** Title: &ldquo;Single binary, Docker, Kubernetes operator&rdquo;. Key content: /binary|Docker|Kubernetes/i, /self[- ]?host|operator/i.

- **sub=5 (C.purple) - Tradeoffs.** Title: &ldquo;Ops burden, newer multi-region, smaller ecosystem than Elastic&rdquo;. Key content: /ops|operational/i, /multi[- ]?region|ecosystem/i, /Elastic|smaller/i.

Tests + commit: `Implement chapter 11.31 Qdrant`.

---

## Task 6: Implement Chapter 11.32 Pinecone (6 sub-steps)

**Chapter purpose:** Managed, serverless (and pod-based). Proprietary.

**Sub-step structure:**

- **sub=0 (C.cyan) - Managed SaaS, proprietary.** Title: &ldquo;Pinecone: managed SaaS with opinionated defaults&rdquo;. Key content: /Pinecone/, /managed|SaaS/i, /proprietary|opinion/i.

- **sub=1 (C.yellow) - Pod architecture.** Title: &ldquo;Each pod is one shard; scale by adding pods&rdquo;. Pod tiers p1/p2, shard-per-pod. Key content: /pod/i, /shard/i, /p1|p2|scale/i.

- **sub=2 (C.green) - Serverless tier.** Title: &ldquo;Scale-to-zero between queries, cold-start tax&rdquo;. Key content: /serverless/i, /scale[- ]?to[- ]?zero|scale to zero/i, /cold[- ]?start/i.

- **sub=3 (C.orange) - Built-in features.** Title: &ldquo;Filtering, hybrid, namespaces for multi-tenancy&rdquo;. Key content: /filter/i, /hybrid/i, /namespace|tenant/i.

- **sub=4 (C.red) - Good fit.** Title: &ldquo;No ops team, variable workloads, fast time-to-market&rdquo;. Bullet list. Key content: /no ops|without ops/i, /variable|workload/i, /time[- ]?to[- ]?market|prototype/i.

- **sub=5 (C.purple) - Tradeoffs.** Title: &ldquo;Vendor lock-in, cost at scale, opinionated scaling&rdquo;. Key content: /lock[- ]?in/i, /cost|expensive/i, /opinion/i.

Tests + commit: `Implement chapter 11.32 Pinecone`.

---

## Task 7: Implement Chapter 11.33 QdrantVsPinecone (6 sub-steps)

**Chapter purpose:** The central decision. Self-host vs managed, filter complexity, scale-to-zero, cost at scale, feature depth, ecosystem maturity.

**Sub-step structure:**

- **sub=0 (C.cyan) - The decision axes.** Title: &ldquo;Decision axes: ops, filters, scale-to-zero, cost, features&rdquo;. 6-bullet list. Key content: /axis|axes/i, /ops|filter|cost|feature/i.

- **sub=1 (C.yellow) - Scenario A: early prototype, no ops team.** Title: &ldquo;Early prototype, no ops -&gt; Pinecone Serverless wins&rdquo;. Key content: /scenario A|prototype/i, /Pinecone/, /serverless/i.

- **sub=2 (C.green) - Scenario B: 10M vectors with complex compound filters.** Title: &ldquo;10M + complex filters -&gt; Qdrant self-host wins&rdquo;. Key content: /scenario B|10M/i, /Qdrant/, /filter|complex/i.

- **sub=3 (C.orange) - Scenario C: 1B vectors at steady 10K QPS.** Title: &ldquo;1B at 10K QPS -&gt; Qdrant multi-node or Milvus&rdquo;. Key content: /scenario C|1B/i, /10K QPS|steady/i, /Qdrant|Milvus/.

- **sub=4 (C.red) - Scenario D: spiky traffic with EU data residency.** Title: &ldquo;Spiky + EU residency -&gt; Pinecone region or Qdrant Cloud EU&rdquo;. Key content: /scenario D|spiky/i, /EU|residency/i, /region|Pinecone|Qdrant Cloud/.

- **sub=5 (C.purple) - The decision flowchart.** Title: &ldquo;Decision flowchart tying it all together&rdquo;. Visual or text flow with the axes from sub=0. Key content: /flowchart|decision/i, /Pinecone|Qdrant/.

Tests + commit: `Implement chapter 11.33 Qdrant vs Pinecone`.

---

## Task 8: Implement Chapter 11.34 WeaviateMilvusChroma (5 sub-steps)

**Chapter purpose:** Quicker survey of the remaining systems.

**Sub-step structure:**

- **sub=0 (C.cyan) - Weaviate.** Title: &ldquo;Weaviate: Go, self-host, built-in modules&rdquo;. Features: transformers, generative, Q&amp;A modules. Key content: /Weaviate/i, /Go|self[- ]?host/i, /module|transformer|generative/i.

- **sub=1 (C.yellow) - Milvus.** Title: &ldquo;Milvus: Go + C++, distributed-native, billions of vectors&rdquo;. Note: Azure AI Search uses its core. Key content: /Milvus/i, /distributed|billion/i, /Azure|AI Search|core/i.

- **sub=2 (C.green) - Chroma.** Title: &ldquo;Chroma: Python-first, local/embedded, prototyping&rdquo;. Key content: /Chroma/i, /Python|local|embedded/i, /prototype|small/i.

- **sub=3 (C.orange) - Elastic/OpenSearch.** Title: &ldquo;If you already run Elastic, dense_vector extension is compelling&rdquo;. Key content: /Elastic|OpenSearch/i, /dense_vector/i, /existing|already/i.

- **sub=4 (C.purple) - When each is the right pick.** Title: &ldquo;Context-dependent picks&rdquo;. 4-card grid summarizing the fit for each system. Key content: /Weaviate|Milvus|Chroma|Elastic/i, /context|pick|fit/i.

Tests + commit: `Implement chapter 11.34 Weaviate / Milvus / Chroma`.

---

## Task 9: Implement Chapter 11.35 DecisionFramework (6 sub-steps)

**Chapter purpose:** Pulling it all together. Decision flowchart + checklist of questions for any vector-search feature.

**Sub-step structure:**

- **sub=0 (C.cyan) - The flowchart.** Title: &ldquo;Data size -&gt; ops team -&gt; filter complexity -&gt; cost band&rdquo;. 4-branch flowchart. Key content: /flowchart|decision/i, /data size|ops|filter|cost/i.

- **sub=1 (C.yellow) - Size buckets.** Title: &ldquo;Under 1M / 1M-100M / 100M-1B / over 1B&rdquo;. Bucket-per-card grid with default picks. Key content: /1M|100M|1B/, /bucket|size/i.

- **sub=2 (C.green) - Ops preference axis.** Title: &ldquo;None (Pinecone) / self-host (Qdrant, Milvus) / Postgres-native (pgvector)&rdquo;. Key content: /ops|preference/i, /Pinecone|Qdrant|Milvus|pgvector/.

- **sub=3 (C.orange) - Filter complexity axis.** Title: &ldquo;Simple / complex / analytical joins&rdquo;. When each DB shines. Key content: /filter/i, /simple|complex|analytical/i.

- **sub=4 (C.red) - Design-review checklist.** Title: &ldquo;Questions to ask about every proposed system&rdquo;. Bullet list (size, update frequency, filter selectivity, QPS, P99, availability, embedding model stability, ops capacity). Key content: /checklist|questions/i, /size|QPS|P99|selectivity|availability/i.

- **sub=5 (C.purple) - Section 11 recap.** Title: &ldquo;The learner can now answer Qdrant vs Pinecone from first principles&rdquo;. Close-out paragraph tying every prior chapter together. Key content: /recap|first principles|Qdrant|Pinecone/i, /section|learn|master/i.

Tests + commit: `Implement chapter 11.35 The Decision Framework`.

---

## Task 10: Add SVG descriptions and update svg-descriptions.test.js

**Files:**
- Modify: `src/__tests__/svg-descriptions.test.js` (extend `expectedChapters`).
- Modify: `src/data/svg-descriptions.json` (add entries keyed by each new chapter that has SVGs).
- Modify: `src/__tests__/sections.test.jsx` (extend the `svgChapters` array inside the &ldquo;Every SVG has a `&lt;desc&gt;` element&rdquo; block).

- [ ] **Step 1:** For each chapter, count the `<svg>` elements rendered across all sub-steps:

  ```bash
  grep -c "<svg" src/sections/vector-systems.jsx
  ```

  Expected estimate per chapter: 11.29 FAISS 0-1 SVGs, 11.30 pgvector 0-1, 11.31 Qdrant 0-1, 11.32 Pinecone 0-1, 11.33 QdrantVsPinecone 1-2, 11.34 WeaviateMilvusChroma 0-1, 11.35 DecisionFramework 1-2. Total likely 3-10 SVGs. Many chapters in Act 6 will naturally be text-only (decision cards dominate).

  **Only chapters that actually render at least one SVG should be listed in `expectedChapters` / `svgChapters`.** Text-only chapters (expected: most of Act 6) MUST be omitted from both lists.

- [ ] **Step 2:** Extend `src/__tests__/svg-descriptions.test.js` `expectedChapters` array with only the Act 6 chapter ids that have SVGs. Skip chapters with 0 SVGs.

- [ ] **Step 3:** Append entries to `src/data/svg-descriptions.json` for every chapter with at least one SVG. Insert before the closing `}`, after the existing `"11.24"` block. Description style: same as existing entries - plain-language terms a learner would search for, 1-2 sentences per SVG, in document order. The count in the JSON must match the actual `<svg>` count per chapter.

- [ ] **Step 4:** Extend the `svgChapters` array in `src/__tests__/sections.test.jsx`'s `describe("Every SVG has a <desc> element", ...)` block by appending the same list as Step 2.

- [ ] **Step 5:** Run the validation tests

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js src/__tests__/sections.test.jsx -t "Every SVG"
  ```

  Expected: PASS. Fix any mismatches before moving on.

- [ ] **Step 6:** Commit

  ```bash
  git add -A
  git commit -m "Add SVG descriptions for chapters 11.29-11.35"
  ```

---

## Task 11: Update CLAUDE.md (final)

**Files:**
- Modify: `CLAUDE.md`.

- [ ] **Step 1:** Find the Section 11 heading and mark the section complete:

  ```markdown
  **Section 11: Vector Databases** (`vector-foundations.jsx` + `vector-compression.jsx` + `vector-production.jsx` + `vector-systems.jsx` - Milestones 1-6 of 6 complete)
  ```

- [ ] **Step 2:** Extend the Section 11 mapping table to 35 rows by appending after 11.28:

  ```markdown
  | 11.29 | FAISS | FAISS |
  | 11.30 | Pgvector | pgvector |
  | 11.31 | Qdrant | Qdrant |
  | 11.32 | Pinecone | Pinecone |
  | 11.33 | QdrantVsPinecone | Qdrant vs Pinecone |
  | 11.34 | WeaviateMilvusChroma | Weaviate / Milvus / Chroma |
  | 11.35 | DecisionFramework | The Decision Framework |
  ```

  Drop the trailing &ldquo;Subsequent milestones will extend this table...&rdquo; parenthetical - the section is done.

- [ ] **Step 3:** Update the project-structure tree. Replace:

  ```
  │       └── vector-production.jsx         # Section 11 (Act 5, chapters 11.19-11.28)
  ```

  with:

  ```
  │       ├── vector-production.jsx         # Section 11 (Act 5, chapters 11.19-11.28)
  │       └── vector-systems.jsx            # Section 11 (Act 6, chapters 11.29-11.35)
  ```

- [ ] **Step 4:** Commit

  ```bash
  git add CLAUDE.md
  git commit -m "Update CLAUDE.md with chapters 11.29-11.35; Section 11 complete"
  ```

---

## Task 12: Browser verification with claude-in-chrome

**Files:** none (runtime verification).

- [ ] **Step 1:** Start the dev server in the background:

  ```bash
  npm run dev
  ```

  Note the URL.

- [ ] **Step 2:** Get tab context and navigate (see Milestone 5 Task 15 for the standard invocation).

- [ ] **Step 3:** Read the fingerprint and find indices for 11.29-11.35 (expected indices 132-138, sequential past 11.28 = 131).

- [ ] **Step 4:** For each of 11.29-11.35, seed localStorage, navigate, walk through sub-steps clicking `[data-subbtn]`, audit keyword presence per sub-step. Adapt the regex set per chapter from the Task-3 through Task-9 tests.

- [ ] **Step 5:** Check console messages. Expected: only benign Vite / React DevTools info.

- [ ] **Step 6:** Kill the dev server.

- [ ] **Step 7:** Commit any fixes made (skip if none).

---

## Task 13: Final full-suite verification and coverage

**Files:** none.

- [ ] **Step 1:** Coverage run

  ```bash
  npx vitest run --coverage
  ```

  Expected: `vector-systems.jsx` at 100% lines / 100% branches. Overall report may still show the pre-existing gaps in `attention-qkv.jsx`, `encoder-decoder-diagrams.jsx`, `transformer-block.jsx`, and `transformer-input.jsx` - those are the Milestone-5 baseline and NOT in scope.

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
  grep -n "—" src/sections/vector-systems.jsx
  grep -n "&mdash" src/sections/vector-systems.jsx
  ```

  Expected: no matches.

- [ ] **Step 5:** No `C.card` Boxes

  ```bash
  grep -n "Box color={C.card}" src/sections/vector-systems.jsx
  ```

  Expected: no matches.

- [ ] **Step 6:** Confirm test count

  ```bash
  npm run test 2>&1 | tail -5
  ```

  Expected: count is 2,091 baseline + 41 new content tests + ~14 new generic &ldquo;All chapters&rdquo; entries (7 chapters x ~6 sub levels where they render something) + up to 7 new SVG-desc tests = roughly 2,150 tests passing.

- [ ] **Step 7:** Report milestone completion:
  - 7 new chapters (11.29-11.35) added.
  - Section 11 now shows all 35 chapters in the TOC.
  - New file `vector-systems.jsx` owns chapters 11.29-11.35.
  - Tests: count + passing status.
  - Coverage: line / branch on the new file.
  - Browser verification: issues found + fixes (if any).
  - Section 11 is complete - all 6 milestones done. Branch is ready to merge to main.

---

## Self-Review Notes

**Spec coverage:** All seven Act 6 chapters from the spec are implemented. Sub-step counts match the spec: 6+6+6+6+6+5+6 = 41 sub-steps total.

**Type consistency check:**
- Component names match the spec's component-naming table exactly: `FAISS`, `Pgvector`, `Qdrant`, `Pinecone`, `QdrantVsPinecone`, `WeaviateMilvusChroma`, `DecisionFramework`.
- Chapter ids match the spec: 11.29 through 11.35.
- Titles match the spec's chapter list (and the config.test.js expected array in Task 2).
- All colors used (C.cyan, C.yellow, C.green, C.orange, C.red, C.purple, C.pink) exist in the palette.
- All capacity-planning numbers from 11.28 (500M x d=768 x 200 QPS, 6 nodes, 3 TB, Pinecone ~$30K / Qdrant ~$8K / pgvector ~$5K) carry over for the head-to-head comparisons.

**No placeholders:** Every sub-step has a concrete color, title, content specification, and regex set for tests. Implementation specifics for Task 3 (FAISS) use the visual-design patterns documented in Milestone 5 Task 3 (Filtering) - tinted cards, center-aligned titles, no em-dashes, middle-dot for multiplications, standalone formulas centered. Tasks 4-9 use the same patterns plus per-chapter key numbers and labels.

**Intentional deviations from Milestone 5:**
- Smaller scope (7 chapters vs 10), so this plan is a bit shorter.
- Four-file loader update (vs three-file in M5) since Section 11 now has four section files.
- Final CLAUDE.md change drops the &ldquo;future milestones&rdquo; parenthetical - the section is done.
- Browser-verification Task 12 is condensed because the pattern is identical to M5 Task 15 (just more chapters).

**Running-example continuity:** The cat corpus, 768-dim scale math, HNSW/IVF/PQ parameters, N-scale anchors (1M / 100M / 1B), and capacity-planning numbers (500M x d=768 x 200 QPS x 6 nodes x 3 TB RAM, Pinecone ~$30K / Qdrant ~$8K / pgvector ~$5K) carry directly from Milestones 1-5. Act 6 chapters reference these numbers when naming concrete cost tradeoffs in the vendor comparison chapters.

**Chapters that may end up text-only:** Act 6 is dominated by decision cards, comparison tables, and system-summary grids. Many of 11.29-11.35 may reasonably be built entirely from div cards without SVGs. The grep-count check in Task 10 Step 1 settles this; only chapters with at least one SVG enter `expectedChapters` / `svgChapters`.
