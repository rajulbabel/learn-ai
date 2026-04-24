# Chapter 11.19 "The Compression Decision" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new chapter 11.19 "The Compression Decision" between current 11.18 HNSW+PQ and current 11.19 Filtering, giving learners a unified decision framework for picking quantization stacks given corpus size, embedding dim, DB support, and recall tolerance.

**Architecture:** Add `CompressionDecision` export to existing `src/sections/vector-compression.jsx`. Renumber existing chapters 11.19-11.35 to 11.20-11.36 in `config.js`. Migrate hardcoded chapter-number cross-references in content files. Four sub-steps: framing with 4 axes, decision tree (SVG flowchart), four worked scenarios (HTML grid), closing heuristics with traps. TDD throughout per CLAUDE.md.

**Tech Stack:** React 18 (JSX), inline styles, SVG for flowchart, Vitest + React Testing Library for tests. No external libraries.

**Related docs:** Design spec at `docs/superpowers/specs/2026-04-25-compression-decision-chapter-design.md`. Follow visual rules in `CLAUDE.md` and `.claude/rules/sections.md`.

---

## File Structure

**Modified files:**
- `src/config.js` — renumber 17 entries (11.19-11.35 → 11.20-11.36), insert new entry at 11.19
- `src/sections/vector-compression.jsx` — add `CompressionDecision` export at end (~500 LOC)
- `src/sections/vector-production.jsx` — update comment headers for renumbered chapters, update section header comment at line 4
- `src/sections/vector-systems.jsx` — update ~15 in-content cross-references to renumbered IDs
- `src/__tests__/sections.test.jsx` — add describe-block with 4 sub-step tests for `CompressionDecision`; update existing describe-block titles for renumbered chapters
- `src/data/svg-descriptions.json` — add one entry for 11.19 flowchart SVG
- `CLAUDE.md` — update Section 11 mapping table (shift existing rows, insert new row)

**No new files created.**

---

## Task 1: Insert 11.19 chapter slot (atomic renumber + stub + Sub 0)

This task is atomic by necessity — the existing `config.test.js` sequentiality check (`chapter IDs within each section are sequential`) requires chapters within a section to form a contiguous sequence. A mid-task state with a gap at 11.19 would break that test, so the renumber, the new config entry, and the new `CompressionDecision` export must all land in one commit.

**Files:**
- Modify: `src/config.js` — renumber 11.19-11.35 → 11.20-11.36 AND insert new 11.19
- Modify: `src/sections/vector-compression.jsx` — add `CompressionDecision` export with Sub 0 content
- Modify: `CLAUDE.md` — insert 11.19 row AND shift 11.19-11.35 rows
- Modify: `src/__tests__/config.test.js` — add new assertions
- Modify: `src/__tests__/sections.test.jsx` — add `CompressionDecision` describe block

- [ ] **Step 1: Write the failing tests**

Add these two `it` blocks inside the `describe("config.js", ...)` block in `src/__tests__/config.test.js` (before the outer closing `});`):

```js
  it("Section 11 chapters are renumbered with CompressionDecision at 11.19", () => {
    const byId = Object.fromEntries(chapters.map((c) => [c.id, c]));
    expect(byId["11.19"]?.component).toBe("CompressionDecision");
    expect(byId["11.19"]?.title).toBe("The Compression Decision");
    expect(byId["11.20"]?.component).toBe("Filtering");
    expect(byId["11.21"]?.component).toBe("UpdatesDeletes");
    expect(byId["11.22"]?.component).toBe("Sharding");
    expect(byId["11.23"]?.component).toBe("Replication");
    expect(byId["11.24"]?.component).toBe("HybridSearch");
    expect(byId["11.25"]?.component).toBe("Rerankers");
    expect(byId["11.26"]?.component).toBe("MultiVectorRetrieval");
    expect(byId["11.27"]?.component).toBe("EmbeddingLifecycle");
    expect(byId["11.28"]?.component).toBe("Observability");
    expect(byId["11.29"]?.component).toBe("CapacityPlanning");
    expect(byId["11.30"]?.component).toBe("FAISS");
    expect(byId["11.31"]?.component).toBe("Pgvector");
    expect(byId["11.32"]?.component).toBe("Qdrant");
    expect(byId["11.33"]?.component).toBe("Pinecone");
    expect(byId["11.34"]?.component).toBe("QdrantVsPinecone");
    expect(byId["11.35"]?.component).toBe("WeaviateMilvusChroma");
    expect(byId["11.36"]?.component).toBe("DecisionFramework");
  });
```

Add this describe block to `src/__tests__/sections.test.jsx`. Place it after the `HNSWPQ (11.18)` describe block and before the existing `Filtering (11.19) content` describe block (which will be renamed in Task 2):

```jsx
describe("CompressionDecision (11.19) content", () => {
  const fn = VectorCompression.CompressionDecision;

  it("sub=0 frames the four decision axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/five techniques|five ways|which one/i);
    expect(container.textContent).toMatch(/corpus size|N/);
    expect(container.textContent).toMatch(/dimension|dim/i);
    expect(container.textContent).toMatch(/DB|database|support/i);
    expect(container.textContent).toMatch(/recall/i);
  });
});
```

- [ ] **Step 2: Run the failing tests**

Run: `npx vitest run -t "Section 11 chapters are renumbered" -t "sub=0 frames the four"`

Expected: FAIL — config has no 11.19 yet, `VectorCompression.CompressionDecision` is undefined.

- [ ] **Step 3: Update `src/config.js` — renumber existing entries and insert new**

Edit `src/config.js` lines 149-166. Replace the block starting with `{ id: "11.19", ... Filtering` through `{ id: "11.35", ... DecisionFramework` with:

```js
  { id: "11.19", title: "The Compression Decision", section: 11, component: "CompressionDecision" },
  { id: "11.20", title: "Filtering", section: 11, component: "Filtering" },
  { id: "11.21", title: "Updates & Deletes", section: 11, component: "UpdatesDeletes" },
  { id: "11.22", title: "Sharding & Partitioning", section: 11, component: "Sharding" },
  { id: "11.23", title: "Replication & High Availability", section: 11, component: "Replication" },
  { id: "11.24", title: "Hybrid Search", section: 11, component: "HybridSearch" },
  { id: "11.25", title: "Rerankers", section: 11, component: "Rerankers" },
  { id: "11.26", title: "Multi-vector Retrieval (ColBERT-style)", section: 11, component: "MultiVectorRetrieval" },
  { id: "11.27", title: "Embedding Lifecycle & Re-embedding", section: 11, component: "EmbeddingLifecycle" },
  { id: "11.28", title: "Observability", section: 11, component: "Observability" },
  { id: "11.29", title: "Capacity Planning & Cost Models", section: 11, component: "CapacityPlanning" },
  { id: "11.30", title: "FAISS", section: 11, component: "FAISS" },
  { id: "11.31", title: "pgvector", section: 11, component: "Pgvector" },
  { id: "11.32", title: "Qdrant", section: 11, component: "Qdrant" },
  { id: "11.33", title: "Pinecone", section: 11, component: "Pinecone" },
  { id: "11.34", title: "Qdrant vs Pinecone", section: 11, component: "QdrantVsPinecone" },
  { id: "11.35", title: "Weaviate / Milvus / Chroma", section: 11, component: "WeaviateMilvusChroma" },
  { id: "11.36", title: "The Decision Framework", section: 11, component: "DecisionFramework" },
```

Line 148 (`{ id: "11.18", ... HNSWPQ }`) stays unchanged. After this edit the section has 36 contiguous IDs 11.1 → 11.36 with CompressionDecision at 11.19.

- [ ] **Step 4: Update `CLAUDE.md` Section 11 mapping table**

In `/Users/rajul/learn-ai/CLAUDE.md`, find the Section 11 mapping table under `**Section 11: Vector Databases**`. Replace the row block from `| 11.19 | Filtering | ...` through `| 11.35 | DecisionFramework | ...` with these 18 rows (new 11.19 row plus the 17 shifted rows):

```
| 11.19 | CompressionDecision | The Compression Decision |
| 11.20 | Filtering | Filtering |
| 11.21 | UpdatesDeletes | Updates & Deletes |
| 11.22 | Sharding | Sharding & Partitioning |
| 11.23 | Replication | Replication & High Availability |
| 11.24 | HybridSearch | Hybrid Search |
| 11.25 | Rerankers | Rerankers |
| 11.26 | MultiVectorRetrieval | Multi-vector Retrieval (ColBERT-style) |
| 11.27 | EmbeddingLifecycle | Embedding Lifecycle & Re-embedding |
| 11.28 | Observability | Observability |
| 11.29 | CapacityPlanning | Capacity Planning & Cost Models |
| 11.30 | FAISS | FAISS |
| 11.31 | Pgvector | pgvector |
| 11.32 | Qdrant | Qdrant |
| 11.33 | Pinecone | Pinecone |
| 11.34 | QdrantVsPinecone | Qdrant vs Pinecone |
| 11.35 | WeaviateMilvusChroma | Weaviate / Milvus / Chroma |
| 11.36 | DecisionFramework | The Decision Framework |
```

- [ ] **Step 5: Add `CompressionDecision` export with Sub 0 content**

At the end of `src/sections/vector-compression.jsx` (after all existing exports), add:

```jsx
export const CompressionDecision = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Five techniques, which one? Four inputs decide.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The last seven chapters introduced scalar quantization, product quantization, binary quantization, Matryoshka
            truncation, IVF-PQ, and HNSW+PQ. Each one works. None is universally the right pick. The choice depends on
            four inputs - corpus size, embedding dimensionality, the database&apos;s capability surface, and how much
            recall loss the product can absorb.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              The four decision axes
            </T>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  axis: "Corpus size (N)",
                  role: "Primary driver",
                  detail: "Under 1M, nothing helps. At 100M+, compression is not optional.",
                },
                {
                  axis: "Embedding dim (d)",
                  role: "Gates binary quantization",
                  detail: "Binary quantization needs d >= 768 to stay production-safe (from 11.15's recall table).",
                },
                {
                  axis: "Database capability",
                  role: "Constrains the menu",
                  detail: "pgvector mainline: halfvec only. Pinecone: abstracted. Qdrant/Weaviate: full suite + rescore.",
                },
                {
                  axis: "Recall tolerance",
                  role: "Override knob",
                  detail: "High-stakes retrieval (medical, legal) downgrades one step from the default.",
                },
              ].map((r) => (
                <div
                  key={r.axis}
                  style={{
                    padding: "10px 12px",
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}22`,
                    borderRadius: 6,
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    {r.axis}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                    {r.role}
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                    {r.detail}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The next sub-step folds these four inputs into a single decision tree. The one after walks four real-world
            scenarios through it, numbers and all.
          </T>
        </Box>
      )}
      {sub < 0 && (
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

Note: the `sub < 0` SubBtn condition is intentionally a placeholder — Task 5 corrects it to `sub < 3` once all four sub-steps exist.

- [ ] **Step 6: Run all tests to verify the task is green**

Run: `npx vitest run`

Expected: all tests PASS. This is the full suite — sequentiality, uniqueness, lookup (CompressionDecision is exported), section rendering (CompressionDecision at sub=0). If any fail, fix before committing.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/sections/vector-compression.jsx src/__tests__/config.test.js src/__tests__/sections.test.jsx CLAUDE.md
git commit -m "Insert 11.19 CompressionDecision with Sub 0 framing

Adds a new chapter slot between 11.18 HNSW+PQ and the former 11.19
Filtering, renumbering 17 existing chapters 11.20-11.36. Sub 0 frames
the four decision axes; subsequent sub-steps land in follow-up commits.
Config and CLAUDE.md mapping updated atomically so the sequentiality
test stays green."
```

---

## Task 2: Migrate cross-references in content files

**Files:**
- Modify: `src/sections/vector-systems.jsx`
- Modify: `src/sections/vector-production.jsx` (comment headers only)
- Modify: `src/__tests__/sections.test.jsx` (describe-block titles)

- [ ] **Step 1: Write the failing test**

Add this test to `src/__tests__/config.test.js` (inside the outer describe block):

```js
  it("no JSX content references the old chapter IDs 11.19-11.35 after renumber", () => {
    const sectionFiles = [
      path.join(SRC_DIR, "sections/vector-systems.jsx"),
      path.join(SRC_DIR, "sections/vector-production.jsx"),
      path.join(SRC_DIR, "sections/vector-compression.jsx"),
    ];
    const stalePatterns = [
      /Recall from 11\.19/,
      /chapter 11\.19[^0-9]/,
      /read 11\.19 carefully/,
      /decision framework in 11\.35/,
      /production realities \(11\.19-11\.28\)/,
      /chapters 11\.30 - 11\.34/,
      /the system comparison \(11\.29-11\.34\)/,
    ];
    for (const file of sectionFiles) {
      const content = fs.readFileSync(file, "utf8");
      for (const pattern of stalePatterns) {
        expect(content, `${file} still contains ${pattern}`).not.toMatch(pattern);
      }
    }
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js -t "no JSX content references"`

Expected: FAIL — multiple stale references still present.

- [ ] **Step 3: Update `src/sections/vector-systems.jsx` cross-references**

Make these exact replacements (one at a time to avoid collision):

| Find (approximate — use surrounding context) | Replace |
|---|---|
| `Recall from 11.19:` | `Recall from 11.20:` |
| `chapter 11.19&apos;s filter-heavy scenarios` | `chapter 11.20&apos;s filter-heavy scenarios` |
| `native support since v1.10 (chapter 11.25)` | `native support since v1.10 (chapter 11.26)` |
| `500M vectors x 200 QPS (chapter 11.28)` | `500M vectors x 200 QPS (chapter 11.29)` |
| `the decision framework in 11.35 pulls` | `the decision framework in 11.36 pulls` |
| `(chapter 11.19) wins` | `(chapter 11.20) wins` |
| `read 11.19 carefully before committing` | `read 11.20 carefully before committing` |
| `ref: "chapter 11.20"` | `ref: "chapter 11.21"` |
| `ref: "chapter 11.19"` | `ref: "chapter 11.20"` |
| `ref: "chapter 11.28"` | `ref: "chapter 11.29"` |
| `ref: "chapter 11.27"` | `ref: "chapter 11.28"` |
| `ref: "chapter 11.26"` | `ref: "chapter 11.27"` |
| `ref: "chapters 11.22, 11.27"` | `ref: "chapters 11.23, 11.28"` |
| `ref: "chapters 11.30 - 11.34"` | `ref: "chapters 11.31 - 11.35"` |
| `production realities (11.19-11.28), and the system comparison (11.29-11.34).` | `production realities (11.20-11.29), and the system comparison (11.30-11.35).` |
| `compression (11.12-11.16), combined indexes (11.17-11.18), production realities (11.19-11.28)` | `compression (11.12-11.16), combined indexes (11.17-11.18), the compression decision (11.19), production realities (11.20-11.29)` |

After each edit, verify the change with a quick grep. Run `grep -n "11\.19\|11\.35" src/sections/vector-systems.jsx` and expect only legitimate remaining references to the NEW 11.19 (CompressionDecision, added in Task 1) or 11.35 (WeaviateMilvusChroma after renumber).

- [ ] **Step 4: Update `src/sections/vector-production.jsx` comment headers**

Update the section header comment at line 4 and all chapter-label comments. Make these replacements:

| Find | Replace |
|------|---------|
| `// Section 11 Act 5: Production Realities (chapters 11.19-11.28).` | `// Section 11 Act 5: Production Realities (chapters 11.20-11.29).` |
| `// 11.19 Filtering` | `// 11.20 Filtering` |
| `// 11.20 Updates & Deletes` | `// 11.21 Updates & Deletes` |
| `// 11.21 Sharding & Partitioning` | `// 11.22 Sharding & Partitioning` |
| `// 11.22 Replication & High Availability` | `// 11.23 Replication & High Availability` |
| `// 11.23 Hybrid Search` | `// 11.24 Hybrid Search` |
| `// 11.24 Rerankers` | `// 11.25 Rerankers` |
| `// 11.25 Multi-vector Retrieval (ColBERT-style)` | `// 11.26 Multi-vector Retrieval (ColBERT-style)` |
| `// 11.26 Embedding Lifecycle & Re-embedding` | `// 11.27 Embedding Lifecycle & Re-embedding` |
| `// 11.27 Observability` | `// 11.28 Observability` |
| `// 11.28 Capacity Planning & Cost Models` | `// 11.29 Capacity Planning & Cost Models` |

These are comments — they don't affect test behavior but keep the file consistent with the new IDs.

- [ ] **Step 5: Update `src/__tests__/sections.test.jsx` describe-block titles**

Replace describe titles for the renumbered chapters:

| Find | Replace |
|------|---------|
| `describe("Filtering (11.19) content"` | `describe("Filtering (11.20) content"` |
| `describe("DecisionFramework (11.35) content"` | `describe("DecisionFramework (11.36) content"` |

Run a grep to find any other `(11.XX) content"` describe titles for chapters in the 11.19-11.35 range and update each. Use: `grep -n 'describe.*(11\.' src/__tests__/sections.test.jsx`

- [ ] **Step 6: Run the failing test to verify it now passes**

Run: `npx vitest run src/__tests__/config.test.js -t "no JSX content references"`

Expected: PASS.

Run the full section test suite too: `npx vitest run src/__tests__/sections.test.jsx`

Expected: PASS. (No test asserts on chapter-number strings in content, only on domain vocabulary.)

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-systems.jsx src/sections/vector-production.jsx src/__tests__/sections.test.jsx src/__tests__/config.test.js
git commit -m "Migrate cross-references for renumbered Section 11 chapters

Updates in-content chapter-number strings to their new IDs after the
renumber in the previous commit. No semantic content changes, only
reference targets. Adds a regression test for stale IDs."
```

---

## Task 3: Implement Sub 1 — decision tree flowchart

**Files:**
- Modify: `src/sections/vector-compression.jsx` — add Sub 1 Reveal block to `CompressionDecision`
- Modify: `src/data/svg-descriptions.json` — add 11.19 flowchart description
- Modify: `src/__tests__/sections.test.jsx` — add sub=1 test

- [ ] **Step 1: Write the failing test**

Add this `it` block inside the existing `describe("CompressionDecision (11.19) content", ...)` block in `src/__tests__/sections.test.jsx`:

```jsx
  it("sub=1 renders the decision tree with four N-range branches and DB gate table", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/MRL|Matryoshka/);
    expect(container.textContent).toMatch(/N < 1M|under 1M/i);
    expect(container.textContent).toMatch(/Skip|no quantization/i);
    expect(container.textContent).toMatch(/1M.*10M/);
    expect(container.textContent).toMatch(/Scalar|int8|SQ/);
    expect(container.textContent).toMatch(/10M.*100M/);
    expect(container.textContent).toMatch(/Binary|BQ/);
    expect(container.textContent).toMatch(/rescore|rescoring/i);
    expect(container.textContent).toMatch(/100M/);
    expect(container.textContent).toMatch(/HNSW.*PQ|PQ/);
    expect(container.textContent).toMatch(/pgvector/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.querySelector("desc")).toBeTruthy();
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=1 renders the decision tree"`

Expected: FAIL — Sub 1 Reveal doesn't exist yet.

- [ ] **Step 3: Add Sub 1 Reveal block to `CompressionDecision`**

In `src/sections/vector-compression.jsx`, inside the `CompressionDecision` component, insert this Reveal block AFTER the `{sub >= 0 && (...)}` Box and BEFORE the `{sub < 0 && (<SubBtn...)}` block:

```jsx
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The decision tree: N drives the branch; d and DB gate binary quantization
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            One pre-step is orthogonal and always worth trying: if the embedding model is Matryoshka-trained (OpenAI
            text-embedding-3 series, BGE-M3, some Cohere variants), request a smaller dim at the API call itself -
            truncating 3072 to 1536 or 1024 costs about 1% quality and halves every downstream memory number. Then walk
            the main tree below.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              The compression decision flowchart
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <svg viewBox="0 0 640 440" style={{ width: "100%", maxWidth: 640, height: "auto" }}>
                <desc>
                  Compression-technique decision flowchart. Top box shows the four inputs (corpus size N, embedding
                  dimension d, database capability, recall tolerance). An orthogonal pre-step on the left notes that
                  Matryoshka-trained embedding models can be truncated at the API call. The main flow branches on N:
                  under 1M skips quantization; 1M to 10M uses scalar quantization; 10M to 100M uses binary quantization
                  plus rescore when d is at least 768 and the DB supports it, otherwise falls back to scalar; 100M and
                  above uses HNSW plus product quantization as the production default at scale.
                </desc>
                <rect x={180} y={10} width={280} height={50} rx={8} fill={`${C.cyan}22`} stroke={C.cyan} strokeWidth={2} />
                <text x={320} y={32} fill={C.cyan} fontSize={14} fontWeight="bold" textAnchor="middle">
                  Inputs: N, d, DB, recall tolerance
                </text>
                <text x={320} y={50} fill={C.bright} fontSize={11} textAnchor="middle">
                  start here
                </text>
                <rect x={10} y={80} width={150} height={48} rx={8} fill={`${C.yellow}18`} stroke={C.yellow} strokeWidth={2} />
                <text x={85} y={100} fill={C.yellow} fontSize={12} fontWeight="bold" textAnchor="middle">
                  MRL pre-step
                </text>
                <text x={85} y={118} fill={C.bright} fontSize={10} textAnchor="middle">
                  truncate d at embed time
                </text>
                <line x1={160} y1={104} x2={180} y2={35} stroke={C.dim} strokeWidth={1} strokeDasharray="4 3" />
                <line x1={320} y1={60} x2={320} y2={85} stroke={C.dim} strokeWidth={1} />
                <line x1={60} y1={160} x2={580} y2={160} stroke={C.dim} strokeWidth={1} />
                <line x1={60} y1={85} x2={60} y2={160} stroke={C.dim} strokeWidth={1} />
                <line x1={220} y1={160} x2={220} y2={85} stroke={C.dim} strokeWidth={1} />
                <line x1={420} y1={160} x2={420} y2={85} stroke={C.dim} strokeWidth={1} />
                <line x1={580} y1={160} x2={580} y2={85} stroke={C.dim} strokeWidth={1} />
                <line x1={320} y1={85} x2={320} y2={130} stroke={C.dim} strokeWidth={1} />
                <text x={320} y={148} fill={C.dim} fontSize={12} textAnchor="middle">
                  branch on N
                </text>
                {[
                  {
                    x: 10,
                    label: "N < 1M",
                    color: C.green,
                    pick: "Skip",
                    sub: "HNSW + fp32",
                  },
                  {
                    x: 170,
                    label: "1M - 10M",
                    color: C.yellow,
                    pick: "Scalar Q",
                    sub: "int8, 4x",
                  },
                  {
                    x: 330,
                    label: "10M - 100M",
                    color: C.orange,
                    pick: "BQ + rescore",
                    sub: "(d>=768, DB ok)",
                  },
                  {
                    x: 490,
                    label: "N >= 100M",
                    color: C.red,
                    pick: "HNSW + PQ",
                    sub: "the scale default",
                  },
                ].map((r) => (
                  <g key={r.label}>
                    <rect
                      x={r.x}
                      y={170}
                      width={140}
                      height={50}
                      rx={6}
                      fill={`${r.color}18`}
                      stroke={r.color}
                      strokeWidth={2}
                    />
                    <text x={r.x + 70} y={190} fill={r.color} fontSize={13} fontWeight="bold" textAnchor="middle">
                      {r.label}
                    </text>
                    <text x={r.x + 70} y={208} fill={C.bright} fontSize={11} textAnchor="middle">
                      -&gt; {r.pick}
                    </text>
                    <line x1={r.x + 70} y1={220} x2={r.x + 70} y2={246} stroke={C.dim} strokeWidth={1} />
                    <text x={r.x + 70} y={260} fill={C.dim} fontSize={11} textAnchor="middle">
                      {r.sub}
                    </text>
                  </g>
                ))}
                <text x={320} y={300} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  fallback rule for the BQ branch
                </text>
                <text x={320} y={320} fill={C.dim} fontSize={11} textAnchor="middle">
                  if d &lt; 768 OR DB lacks BQ+rescore: downgrade to Scalar Q
                </text>
                <text x={320} y={355} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  recall-tolerance override
                </text>
                <text x={320} y={375} fill={C.dim} fontSize={11} textAnchor="middle">
                  if recall must exceed 99%: downgrade one step (BQ -&gt; SQ; SQ -&gt; skip; PQ -&gt; raise m)
                </text>
                <text x={320} y={410} fill={C.purple} fontSize={12} fontWeight="bold" textAnchor="middle">
                  fold inputs -&gt; one compression stack
                </text>
              </svg>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Database capability gate
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr",
                gap: 6,
                fontSize: 13,
                color: C.bright,
              }}
            >
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>DB</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>SQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>PQ</div>
              <div style={{ fontWeight: "bold", color: C.purple, textAlign: "center" }}>BQ + rescore</div>
              {[
                ["Qdrant, Weaviate", "yes", "yes", "yes"],
                ["Milvus", "yes", "yes", "partial"],
                ["pgvector (mainline)", "halfvec", "no", "no"],
                ["Pinecone", "managed", "managed", "managed"],
              ].map((row) => (
                <div
                  key={row[0]}
                  style={{ display: "contents" }}
                >
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[0]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[1]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[2]}</div>
                  <div style={{ textAlign: "center", padding: "6px 4px", background: `${C.purple}08` }}>{row[3]}</div>
                </div>
              ))}
            </div>
            <T color={C.bright} size={13} style={{ marginTop: 10, fontStyle: "italic", textAlign: "center" }}>
              For pgvector the tree collapses to halfvec or nothing regardless of N. For Pinecone, compression is
              abstracted - the only knob is MRL at embed time.
            </T>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The tree is deliberately conservative. Start with the default branch for your N, confirm the gate for the
            BQ path, and downgrade by one step if recall must hold above 99%.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Add the SVG description manifest entry**

In `src/data/svg-descriptions.json`, find the key-value entry for `"11.18"` (the most recent Section 11 compression chapter). After its closing `],`, add this entry:

```json
  "11.19": [
    "Compression-technique decision flowchart with top input box listing N, d, DB and recall tolerance, an orthogonal MRL pre-step on the left for truncating Matryoshka-trained embeddings at the API, a main decision flow branching on N into four size buckets (under 1M skip, 1M to 10M scalar quantization, 10M to 100M binary quantization with rescore gated on d at least 768 and DB support, 100M or more HNSW plus product quantization), plus a fallback rule and a recall-tolerance override note."
  ],
```

Keep existing formatting (2-space indentation, one string per line).

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=1 renders the decision tree"`

Expected: PASS.

Also verify the SVG manifest test: `npx vitest run src/__tests__/svg-descriptions.test.js`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Add Sub 1 decision tree flowchart to 11.19 CompressionDecision

Introduces the SVG flowchart mapping four inputs (N, d, DB, recall) to
four output branches (skip / SQ / BQ+rescore / HNSW+PQ), plus the DB
capability gate table and the recall-tolerance override rule."
```

---

## Task 4: Implement Sub 2 — four worked scenarios

**Files:**
- Modify: `src/sections/vector-compression.jsx` — add Sub 2 Reveal block
- Modify: `src/__tests__/sections.test.jsx` — add sub=2 test

- [ ] **Step 1: Write the failing test**

Add this `it` block inside the `describe("CompressionDecision (11.19) content", ...)` block:

```jsx
  it("sub=2 walks four worked scenarios with concrete memory numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/500K|500,000/);
    expect(container.textContent).toMatch(/6 GB|6GB/);
    expect(container.textContent).toMatch(/50M|50,000,000/);
    expect(container.textContent).toMatch(/10 GB|10GB|9\.6/);
    expect(container.textContent).toMatch(/300 GB|300GB|307/);
    expect(container.textContent).toMatch(/5M|5,000,000/);
    expect(container.textContent).toMatch(/3\.8 GB|3\.8GB|halfvec/);
    expect(container.textContent).toMatch(/200M|200,000,000/);
    expect(container.textContent).toMatch(/19 GB|19GB|820 GB/);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/);
    expect(container.textContent).toMatch(/BGE/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/pgvector/);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=2 walks four worked"`

Expected: FAIL — Sub 2 Reveal doesn't exist yet.

- [ ] **Step 3: Add Sub 2 Reveal block**

Insert this Reveal block AFTER the `{sub >= 1}` Reveal block and BEFORE the SubBtn block, inside `CompressionDecision`:

```jsx
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Four worked scenarios: the tree with real numbers
          </T>
          <T color="#ffb74d" style={{ marginTop: 8 }}>
            Same tree, four corpora. Each scenario fixes the four inputs, walks the branches, and prints the memory
            number that lands on the procurement doc.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                title: "Startup - the skip path",
                color: C.green,
                stack: "Qdrant + OpenAI-3-large (d=3072) + N=500K",
                path: "N < 1M gate hits immediately; MRL optional at this scale",
                result: "Skip quantization. HNSW + fp32.",
                math: "500K x 12 KB = 6 GB RAM. Fits on any dev box.",
              },
              {
                title: "Growing product - the high-leverage path",
                color: C.yellow,
                stack: "Qdrant + OpenAI-3-large (d: 3072 -> 1536 via MRL) + N=50M",
                path: "MRL halves d up front; N in 10M-100M; d>=768; Qdrant supports BQ+rescore",
                result: "MRL + BQ + rescore.",
                math: "fp32 baseline = 300 GB. Final = 50M x 192 B = ~10 GB. ~30x smaller, <2% recall loss.",
              },
              {
                title: "pgvector constrained - the menu-is-short path",
                color: C.cyan,
                stack: "pgvector + BGE-small (d=384, not MRL) + N=5M",
                path: "No MRL; N in 1M-10M so default would be SQ; pgvector supports halfvec, not BQ or PQ",
                result: "halfvec (fp16).",
                math: "fp32 = 7.7 GB. Final = 3.8 GB. 2x smaller. BQ off-limits anyway since d=384 is below the 768 threshold.",
              },
              {
                title: "Massive scale - the HNSW+PQ default",
                color: C.red,
                stack: "Qdrant + OpenAI-3-small (d: 1536 -> 1024 via MRL) + N=200M",
                path: "MRL reduces d; N >= 100M gate hits immediately",
                result: "HNSW + PQ (m=96).",
                math: "fp32 = 820 GB. Final = 200M x 96 B = ~19 GB. ~40x smaller. The scale default per 11.18.",
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  padding: "12px 14px",
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}22`,
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <T color={s.color} bold center size={15}>
                  {s.title}
                </T>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    stack
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2, fontFamily: "monospace" }}>
                    {s.stack}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={11} style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    tree walk
                  </T>
                  <T color={C.bright} size={13} style={{ marginTop: 2 }}>
                    {s.path}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.35)",
                    textAlign: "center",
                  }}
                >
                  <T color={s.color} bold size={14}>
                    {s.result}
                  </T>
                  <T color={C.bright} size={12} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {s.math}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffb74d" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Scenario 1 is the &quot;do nothing&quot; case that engineers talk themselves out of. It is the right answer
            more often than the literature suggests. Quantization buys memory savings you do not yet need; it costs
            tuning and recall risk you cannot yet afford.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=2 walks four worked"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx
git commit -m "Add Sub 2 four worked scenarios to 11.19 CompressionDecision

Four concrete corpora running through the decision tree with real
memory numbers: startup skip path, 50M BQ+rescore, pgvector constrained
halfvec, 200M HNSW+PQ."
```

---

## Task 5: Implement Sub 3 — heuristics and traps, and wire final SubBtn

**Files:**
- Modify: `src/sections/vector-compression.jsx` — add Sub 3 Reveal block AND fix the SubBtn condition
- Modify: `src/__tests__/sections.test.jsx` — add sub=3 test

- [ ] **Step 1: Write the failing test**

Add this `it` block inside the `describe("CompressionDecision (11.19) content", ...)` block:

```jsx
  it("sub=3 lists five heuristics and four traps to avoid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/memory bites|quantize until/i);
    expect(container.textContent).toMatch(/MRL is free|always apply/i);
    expect(container.textContent).toMatch(/DB first|database first/i);
    expect(container.textContent).toMatch(/Rescor(e|ing) is.*free|rescor.*default/i);
    expect(container.textContent).toMatch(/measure recall|your own data/i);
    expect(container.textContent).toMatch(/traps|avoid/i);
    expect(container.textContent).toMatch(/BQ at d.*256|d <= 256/i);
    expect(container.textContent).toMatch(/skip(ping)? MRL/i);
    expect(container.textContent).toMatch(/stacking|without measuring/i);
    expect(container.textContent).toMatch(/disabl.*rescor/i);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=3 lists five heuristics"`

Expected: FAIL — Sub 3 Reveal doesn't exist yet.

- [ ] **Step 3: Add Sub 3 Reveal block**

Insert this Reveal block AFTER the `{sub >= 2}` Reveal block and BEFORE the SubBtn block:

```jsx
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Heuristics to keep and traps to avoid
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Five rules of thumb compress this whole chapter into a design-review checklist. The four traps are the
            failure modes that reliably surface when teams skip the checklist.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold center size={16}>
                Five rules of thumb
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    rule: "Don't quantize until memory bites",
                    why: "Under 1M vectors, complexity isn't worth the tradeoff - run fp32 and move on.",
                  },
                  {
                    rule: "MRL is free; always apply it first",
                    why: "If the model supports it, truncate at embed time. Halves downstream memory before the DB sees anything.",
                  },
                  {
                    rule: "DB first, compression second",
                    why: "Pick the DB for ops/filter/SLA reasons, then pick compression from whatever menu that DB offers. pgvector shortens the menu to one option.",
                  },
                  {
                    rule: "Rescoring is nearly free; turn it on by default",
                    why: "BQ without rescore loses 5-10% recall; with rescore loses <1%. Cost is one extra disk read per top-k candidate.",
                  },
                  {
                    rule: "Measure recall on your own data before committing",
                    why: "Generic benchmark numbers assume generic data distributions. A 5-minute recall test on your corpus beats any published table.",
                  },
                ].map((h, idx) => (
                  <div
                    key={h.rule}
                    style={{
                      padding: "8px 10px",
                      background: `${C.green}10`,
                      border: `1px solid ${C.green}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.green} bold size={14}>
                      {idx + 1}. {h.rule}
                    </T>
                    <T color={C.bright} size={12} style={{ marginTop: 4 }}>
                      {h.why}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}22`,
                borderRadius: 8,
              }}
            >
              <T color={C.red} bold center size={16}>
                Four traps to avoid
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    trap: "BQ at d <= 256",
                    why: "Recall collapses to ~0.82 or worse per 11.15's measured table. The binary code loses too much information at low dimensions.",
                  },
                  {
                    trap: "Skipping MRL when available",
                    why: "Leaves free compression on the table. An OpenAI-3 embedding at d=3072 with no MRL truncation wastes half the memory budget.",
                  },
                  {
                    trap: "Stacking SQ+PQ+BQ without measuring",
                    why: "Each layer adds tuning surface. Benchmark before committing to a stacked scheme; the recall multiplier compounds.",
                  },
                  {
                    trap: "Trusting recall numbers that silently disable rescoring",
                    why: "BQ without rescore is a different product than BQ with rescore. Published comparisons that omit rescore settings mislead.",
                  },
                ].map((t, idx) => (
                  <div
                    key={t.trap}
                    style={{
                      padding: "8px 10px",
                      background: `${C.red}10`,
                      border: `1px solid ${C.red}22`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={C.red} bold size={14}>
                      {idx + 1}. {t.trap}
                    </T>
                    <T color={C.bright} size={12} style={{ marginTop: 4 }}>
                      {t.why}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            <span style={{ color: C.green }}>five rules</span> on the left,{" "}
            <span style={{ color: C.red }}>four traps</span> on the right
            <br />
            together they compress the five compression techniques into a working decision framework
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Fix the SubBtn condition**

Replace the existing `{sub < 0 && (<SubBtn...)}` block at the end of `CompressionDecision` with:

```jsx
      {sub < 3 && (
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
```

The condition now matches the last sub-step index (3) — button hides after the final Reveal.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "CompressionDecision"`

Expected: PASS for all four sub-step tests.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx
git commit -m "Add Sub 3 heuristics+traps and wire final SubBtn for 11.19

Completes CompressionDecision with five rules of thumb and four traps,
plus corrects the Continue-button visibility condition to hide after
the final sub-step."
```

---

## Task 6: Full verification pass

**Files:** None modified (verification only, unless lint/format finds issues).

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`

Expected: all tests PASS.

If any fail, diagnose the failure, fix it, and re-run. Do not continue until green.

- [ ] **Step 2: Run coverage to verify no regression**

Run: `npx vitest run --coverage`

Expected: Lines 100%, Branches at least 97.7%. Coverage output prints at the end of the run.

If coverage drops: inspect the uncovered lines in `CompressionDecision` and add tests that exercise those paths. Commit any added tests separately.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: no errors. Fix any that appear. Commit with message `Fix lint errors in 11.19 CompressionDecision` if fixes were needed.

- [ ] **Step 4: Run format**

Run: `npm run format`

Expected: formatting applied cleanly. If the format step changed files, commit them with message `Format 11.19 CompressionDecision`.

- [ ] **Step 5: Run build to verify the app compiles**

Run: `npm run build`

Expected: build succeeds, no errors in `vite` output.

- [ ] **Step 6: Run check-visuals skill on 11.19**

The `check-visuals` skill (available via the Skill tool) validates chapter visuals for overlapping SVG elements, wrong Box colors, missing title alignment, and incorrect chapter references. Run it on chapter 11.19.

Expected: no issues flagged. Apply any fixes and commit with message `Fix visual issues in 11.19 CompressionDecision` if changes were needed.

- [ ] **Step 7: Start dev server and visually check the chapter**

Run: `npm run dev` in a separate terminal (or background).

Navigate to http://localhost:5173/learn-ai/ and click through to chapter 11.19. Verify:
- Sub 0 shows the four-axis framing with correctly colored cyan Box and center-aligned title
- Sub 1 shows the SVG flowchart with four colored branches, the DB gate table, and no element overlaps
- Sub 2 shows the four scenario cards in a responsive grid with correct numbers
- Sub 3 shows the green heuristics panel on the left and red traps panel on the right
- SubBtn appears at the bottom for sub=0,1,2 and disappears at sub=3
- The chapter transitions cleanly from 11.18 HNSW+PQ (previous) and into 11.20 Filtering (next)

- [ ] **Step 8: Final commit (if there was no lint/format/visual work)**

Skip if no changes occurred in Steps 3-7. Otherwise, the final commits are from those steps and no additional commit is needed.

---

## Self-Review Checklist

Before execution, the plan was checked against the spec for:

1. **Spec coverage:** Every requirement in the spec maps to a task:
   - New chapter at 11.19 with 4 sub-steps → Task 1 (Sub 0) and Tasks 3-5 (Sub 1-3)
   - Renumber 17 IDs → Task 1 (atomic with the new chapter)
   - Cross-reference migration → Task 2
   - CLAUDE.md mapping update → Task 1 (atomic with the renumber)
   - SVG manifest entry → Task 3 Step 4
   - Tests at every sub-level → Task 1 Step 1 (sub=0) and Tasks 3-5 Step 1 of each (sub=1-3)
   - Coverage preservation → Task 6 Step 2
2. **No placeholders:** every step has exact file paths, exact code, exact commands, exact expected output.
3. **Type consistency:** `CompressionDecision` function signature matches the `ctx` destructuring pattern used by other Section 11 chapters (`sub`, `subBtnRipple`, `setSubBtnRipple`, `registerSubBtn`, `navigate`).
4. **No forward references in content:** the chapter content references 11.15 and 11.18 (back-references), and never references 11.20-11.36 (future chapters from the learner's perspective).
5. **Visual rules compliance:** every Box has a colored background (cyan/purple/orange/green/red, never `C.card`), every title uses `center`, font sizes are 13-22px, no em-dashes, SVG has `<desc>` as first child.
