# Split Mega-Sections 11/12/13 into 14 Smaller Sections

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace sections 11/12/13 (37/41/52 chapters each) with 14 focused sections (3-16 chapters each). No chapter reordering. Section count grows 13 → 24.

**Architecture:** Renumber chapter IDs and section fields in `config.js`. Update `sectionNames` + `sectionColors` to add 14 new entries. Update cross-references in 4 chapter files. Update test fixtures + assertions that hardcode chapter IDs. Update three data JSON files (chunks.json, chunk-cache.json, svg-descriptions.json) by remapping chapterId keys/values. Update CLAUDE.md mapping tables and project structure. Update public/llms.txt and index.html JSON-LD.

**Tech Stack:** React 18, Vite, Vitest, ESLint, Prettier. No new deps.

---

## ID Mapping Table (authoritative)

| Old range | New section | New range | Title |
|-----------|-------------|-----------|-------|
| 11.1-11.12 | 11 | 11.1-11.12 | Vector Search - From Brute Force to ANN |
| 11.13-11.20 | 12 | 12.1-12.8 | Vector Compression - Quantization & Matryoshka |
| 11.21-11.30 | 13 | 13.1-13.10 | Vector DBs in Production |
| 11.31-11.37 | 14 | 14.1-14.7 | Picking a Vector Database |
| 12.1-12.3 | 15 | 15.1-15.3 | The RAG Pipeline - Why & How It Breaks |
| 12.4-12.13 | 16 | 16.1-16.10 | RAG Data Prep - Ingestion & Chunking |
| 12.14-12.21 | 17 | 17.1-17.8 | RAG Retrieval - Embeddings, Hybrid & Query Tricks |
| 12.22-12.30 | 18 | 18.1-18.9 | RAG Generation - Naive to Advanced Patterns |
| 12.31-12.41 | 19 | 19.1-19.11 | RAG in Production - Eval, Cost & Shipping |
| 13.1-13.6 | 20 | 20.1-20.6 | Prompting LLMs - The Foundation |
| 13.7-13.17 | 21 | 21.1-21.11 | Tools & Protocols - MCP, A2A |
| 13.18-13.29 | 22 | 22.1-22.12 | Agent Mechanics - Loops & Memory |
| 13.30-13.36 | 23 | 23.1-23.7 | Multi-Agent Systems |
| 13.37-13.52 | 24 | 24.1-24.16 | Shipping Agents - Eval, Safety, Frameworks |

## Cross-Reference Remapping (full list)

| File | Old ref | New ref |
|------|---------|---------|
| `src/chapters/rag-foundations/chunking-decision.jsx` | "12.7" | "16.4" |
| same | "12.8" | "16.5" |
| same | "12.9" | "16.6" |
| same | "12.10" | "16.7" |
| same | "12.11" | "16.8" |
| same | "12.12" | "16.9" |
| `src/chapters/rag-production/rag-decision-framework-capstone.jsx` | "12.40" | "19.10" |
| `src/chapters/agent-evals/why-eval-agents.jsx` | "13.39" | "24.3" |
| same | "13.40" | "24.4" |
| same | "13.41" (×2) | "24.5" |
| `src/chapters/agent-production/agent-decision-framework.jsx` | "13.5" | "20.5" |

## Color Assignments (new sections 11-24)

```js
11: "#f06292",  // pink (kept from current 11)
12: "#ec407a",  // rose
13: "#d81b60",  // magenta
14: "#ad1457",  // deep pink
15: "#9ccc65",  // lime
16: "#66bb6a",  // green
17: "#26a69a",  // emerald
18: "#00897b",  // jade
19: "#2e7d32",  // forest
20: "#4fc3f7",  // sky
21: "#42a5f5",  // blue
22: "#5c6bc0",  // indigo
23: "#7e57c2",  // violet
24: "#5e35b3",  // deep purple
```

---

### Task 1: Add a test that locks the target section/ID structure

**Files:**
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Add failing test asserting new section count and ID mapping**

Add at end of `src/__tests__/config.test.js`:

```js
describe("split mega-sections 11/12/13 into 14 focused sections", () => {
  it("has 24 distinct sections (excluding 0)", () => {
    const sections = new Set(chapters.filter((c) => c.section > 0).map((c) => c.section));
    expect(sections.size).toBe(24);
  });

  it.each([
    ["11.12", 11, "Vamana / DiskANN"],
    ["12.1", 12, "The Memory Wall"],
    ["13.1", 13, "Filtering"],
    ["14.1", 14, "FAISS"],
    ["15.1", 15, "Why LLMs Need Retrieval"],
    ["16.1", 16, "Parsing - Raw Sources to Clean Text"],
    ["17.1", 17, "Picking an Embedding Model"],
    ["18.1", 18, "Context Packing"],
    ["19.1", 19, "The RAG Eval Triangle"],
    ["20.1", 20, "Anatomy of an LLM Call"],
    ["21.1", 21, "Tool Use - LLM as Orchestrator"],
    ["22.1", 22, "Workflow vs Agent"],
    ["23.1", 23, "Why Multi-Agent?"],
    ["24.1", 24, "Why Eval Agents Differently"],
    ["24.16", 24, "The Complete Agent Decision Framework"],
  ])("chapter %s lives in section %i with title %s", (id, section, title) => {
    const ch = chapters.find((c) => c.id === id);
    expect(ch).toBeDefined();
    expect(ch.section).toBe(section);
    expect(ch.title).toBe(title);
  });

  it.each([
    [11, "Vector Search - From Brute Force to ANN"],
    [12, "Vector Compression - Quantization & Matryoshka"],
    [13, "Vector DBs in Production"],
    [14, "Picking a Vector Database"],
    [15, "The RAG Pipeline - Why & How It Breaks"],
    [16, "RAG Data Prep - Ingestion & Chunking"],
    [17, "RAG Retrieval - Embeddings, Hybrid & Query Tricks"],
    [18, "RAG Generation - Naive to Advanced Patterns"],
    [19, "RAG in Production - Eval, Cost & Shipping"],
    [20, "Prompting LLMs - The Foundation"],
    [21, "Tools & Protocols - MCP, A2A"],
    [22, "Agent Mechanics - Loops & Memory"],
    [23, "Multi-Agent Systems"],
    [24, "Shipping Agents - Eval, Safety, Frameworks"],
  ])("section %i has name %s", (num, name) => {
    expect(sectionNames[num]).toBe(name);
  });

  it("has a color for every new section", () => {
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].forEach((n) => {
      expect(sectionColors[n]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js -t "split mega-sections"`
Expected: FAIL — sections.size === 13, no section 14+, ids 12.1-14.16 don't exist.

- [ ] **Step 3: Commit the test**

```bash
git add src/__tests__/config.test.js
git commit -m "test: lock target section/ID structure for mega-section split"
```

---

### Task 2: Renumber chapters and update sectionNames/sectionColors in config.js

**Files:**
- Modify: `src/config.js`

- [ ] **Step 1: Update chapters array IDs and section fields**

For every chapter in the table below, change BOTH `id` and `section` per the mapping. Keep `title`, `component`, `file` unchanged.

Use the ID Mapping Table at the top of this plan. Pattern: for old id `A.B`, find the new range and compute new B = B - offset.

Concrete offsets:
- Old 11.1-11.12 → new 11.1-11.12 (no change; section stays 11)
- Old 11.13-11.20 → new 12.1-12.8 (subtract 12 from sub-id, section → 12)
- Old 11.21-11.30 → new 13.1-13.10 (subtract 20 from sub-id, section → 13)
- Old 11.31-11.37 → new 14.1-14.7 (subtract 30 from sub-id, section → 14)
- Old 12.1-12.3 → new 15.1-15.3 (sub-id same, section → 15)
- Old 12.4-12.13 → new 16.1-16.10 (subtract 3 from sub-id, section → 16)
- Old 12.14-12.21 → new 17.1-17.8 (subtract 13, section → 17)
- Old 12.22-12.30 → new 18.1-18.9 (subtract 21, section → 18)
- Old 12.31-12.41 → new 19.1-19.11 (subtract 30, section → 19)
- Old 13.1-13.6 → new 20.1-20.6 (sub-id same, section → 20)
- Old 13.7-13.17 → new 21.1-21.11 (subtract 6, section → 21)
- Old 13.18-13.29 → new 22.1-22.12 (subtract 17, section → 22)
- Old 13.30-13.36 → new 23.1-23.7 (subtract 29, section → 23)
- Old 13.37-13.52 → new 24.1-24.16 (subtract 36, section → 24)

- [ ] **Step 2: Update sectionNames**

Replace existing sectionNames object with:

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
  11: "Vector Search - From Brute Force to ANN",
  12: "Vector Compression - Quantization & Matryoshka",
  13: "Vector DBs in Production",
  14: "Picking a Vector Database",
  15: "The RAG Pipeline - Why & How It Breaks",
  16: "RAG Data Prep - Ingestion & Chunking",
  17: "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
  18: "RAG Generation - Naive to Advanced Patterns",
  19: "RAG in Production - Eval, Cost & Shipping",
  20: "Prompting LLMs - The Foundation",
  21: "Tools & Protocols - MCP, A2A",
  22: "Agent Mechanics - Loops & Memory",
  23: "Multi-Agent Systems",
  24: "Shipping Agents - Eval, Safety, Frameworks",
};
```

- [ ] **Step 3: Update sectionColors**

Replace existing sectionColors object with:

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
  12: "#ec407a",
  13: "#d81b60",
  14: "#ad1457",
  15: "#9ccc65",
  16: "#66bb6a",
  17: "#26a69a",
  18: "#00897b",
  19: "#2e7d32",
  20: "#4fc3f7",
  21: "#42a5f5",
  22: "#5c6bc0",
  23: "#7e57c2",
  24: "#5e35b3",
};
```

- [ ] **Step 4: Run target tests to verify they pass**

Run: `npx vitest run src/__tests__/config.test.js -t "split mega-sections"`
Expected: PASS.

- [ ] **Step 5: Run full config test file**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: PASS for all tests (uniqueness, required fields, etc.). If any existing assertion hardcodes the old IDs, fix it inline before continuing.

- [ ] **Step 6: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Renumber sections 11/12/13 into 14 focused sections"
```

---

### Task 3: Update cross-references in chapter files

**Files:**
- Modify: `src/chapters/rag-foundations/chunking-decision.jsx`
- Modify: `src/chapters/rag-production/rag-decision-framework-capstone.jsx`
- Modify: `src/chapters/agent-evals/why-eval-agents.jsx`
- Modify: `src/chapters/agent-production/agent-decision-framework.jsx`
- Test: per-chapter tests for the four files above

- [ ] **Step 1: Write failing tests asserting new refs in each chapter file**

For each chapter file with refs, add an assertion in its corresponding test file under `src/__tests__/chapters/<topic>/<file>.test.jsx` that renders the chapter and looks for the new ID strings (e.g., `16.4`, not `12.7`).

Example for `chunking-decision.test.jsx`:

```jsx
it("references chunking strategy chapters with new section 16 IDs", () => {
  const { container } = render(<ChunkingDecision {...makeCtx()} />);
  // Click through any sub-steps that reveal the refs
  // ...
  expect(container.textContent).toMatch(/16\.4/);
  expect(container.textContent).toMatch(/16\.9/);
  expect(container.textContent).not.toMatch(/\b12\.7\b/);
});
```

Repeat similar pattern for the three other files.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/chapters/rag-foundations/chunking-decision.test.jsx src/__tests__/chapters/rag-production/rag-decision-framework-capstone.test.jsx src/__tests__/chapters/agent-evals/why-eval-agents.test.jsx src/__tests__/chapters/agent-production/agent-decision-framework.test.jsx`
Expected: FAIL — old IDs still in DOM.

- [ ] **Step 3: Update each chapter file with new refs**

In `chunking-decision.jsx` lines 8, 16, 24, 32, 40, 48:
- `"12.7"` → `"16.4"`
- `"12.8"` → `"16.5"`
- `"12.9"` → `"16.6"`
- `"12.10"` → `"16.7"`
- `"12.11"` → `"16.8"`
- `"12.12"` → `"16.9"`

In `rag-decision-framework-capstone.jsx` line 20: `"12.40"` → `"19.10"`

In `why-eval-agents.jsx` lines 93-96:
- `"13.41"` (line 93) → `"24.5"`
- `"13.40"` (line 94) → `"24.4"`
- `"13.39"` (line 95) → `"24.3"`
- `"13.41"` (line 96) → `"24.5"`

In `agent-decision-framework.jsx` line 12: `"13.5"` → `"20.5"`

- [ ] **Step 4: Run tests to verify they pass**

Run same vitest command from Step 2.
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/chapters/rag-foundations/chunking-decision.jsx \
        src/chapters/rag-production/rag-decision-framework-capstone.jsx \
        src/chapters/agent-evals/why-eval-agents.jsx \
        src/chapters/agent-production/agent-decision-framework.jsx \
        src/__tests__/chapters/
git commit -m "Update cross-chapter ID refs to new section 14-24 IDs"
```

---

### Task 4: Update tests that hardcode old chapter/section IDs

**Files:**
- Modify: `src/__tests__/svg-descriptions.test.js`
- Modify: `src/__tests__/section11-capitalization.test.js`
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Remap svg-descriptions.json keys**

For each top-level key in `src/data/svg-descriptions.json` that matches `11.X`, `12.X`, or `13.X`, rename per the ID Mapping Table.

Concretely (run as a single Node script in repo root to be safe; do not run blindly — read the file first):

```js
// scripts/_remap-svg-desc.mjs  (temporary, delete after use)
import fs from "fs";
const path = "src/data/svg-descriptions.json";
const json = JSON.parse(fs.readFileSync(path, "utf8"));
const remap = (id) => {
  const [s, sub] = id.split(".").map(Number);
  if (s === 11 && sub <= 12) return id;
  if (s === 11 && sub <= 20) return `12.${sub - 12}`;
  if (s === 11 && sub <= 30) return `13.${sub - 20}`;
  if (s === 11) return `14.${sub - 30}`;
  if (s === 12 && sub <= 3) return `15.${sub}`;
  if (s === 12 && sub <= 13) return `16.${sub - 3}`;
  if (s === 12 && sub <= 21) return `17.${sub - 13}`;
  if (s === 12 && sub <= 30) return `18.${sub - 21}`;
  if (s === 12) return `19.${sub - 30}`;
  if (s === 13 && sub <= 6) return `20.${sub}`;
  if (s === 13 && sub <= 17) return `21.${sub - 6}`;
  if (s === 13 && sub <= 29) return `22.${sub - 17}`;
  if (s === 13 && sub <= 36) return `23.${sub - 29}`;
  return `24.${sub - 36}`;
};
const out = {};
for (const [k, v] of Object.entries(json)) {
  out[k.match(/^(11|12|13)\./) ? remap(k) : k] = v;
}
fs.writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
```

Run: `node scripts/_remap-svg-desc.mjs` then `rm scripts/_remap-svg-desc.mjs`.

- [ ] **Step 2: Update svg-descriptions.test.js to use new IDs**

In `src/__tests__/svg-descriptions.test.js`:
- Lines 30-49: change `11.20`→`12.8`, `11.21`→`13.1`, `11.22`→`13.2`, `11.23`→`13.3`, `11.24`→`13.4`, `11.25`→`13.5`, `11.26`→`13.6`, `11.37`→`14.7`, `11.5`→`11.5` (unchanged), and update comments.
- Lines 85-105 (the hardcoded array): replace each ID per the mapping. IDs 11.1-11.12 stay; 11.14-11.20 become 12.2-12.8; 11.21-11.23 become 13.1-13.3; etc.

- [ ] **Step 3: Update section11-capitalization.test.js**

Rename `describe("section 11 capitalization", ...)` to remain section 11 (the algorithms section) — but verify the test logic still selects the right chapters. If the test iterates `chapters.filter((c) => c.section === 11)`, it now only sees 11.1-11.12 (algorithms). If the test was meant to cover ALL former section 11 chapters (which span 4 new sections), update it to filter `c.section >= 11 && c.section <= 14`.

Read the file first to determine intent. Either:
- (a) Keep scope = new section 11 only: rename describe to "section 11 (vector search algorithms) capitalization". No filter change.
- (b) Keep scope = all former section 11: change filter to `c.section >= 11 && c.section <= 14`. Rename describe to "vector database sections capitalization".

Choose (b) by default since the test name suggests broad coverage.

- [ ] **Step 4: Run affected tests**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js src/__tests__/section11-capitalization.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js src/__tests__/section11-capitalization.test.js
git commit -m "Remap chapter IDs in svg-descriptions and capitalization test"
```

---

### Task 5: Remap chapter IDs in chunks.json and chunk-cache.json

**Files:**
- Modify: `src/data/chunks.json`
- Modify: `src/data/chunk-cache.json`

- [ ] **Step 1: Write remap script**

Create temporary `scripts/_remap-chunks.mjs`:

```js
import fs from "fs";
const remapId = (id) => {
  const m = id?.match?.(/^(\d+)\.(\d+)$/);
  if (!m) return id;
  const [s, sub] = [Number(m[1]), Number(m[2])];
  if (s !== 11 && s !== 12 && s !== 13) return id;
  if (s === 11 && sub <= 12) return id;
  if (s === 11 && sub <= 20) return `12.${sub - 12}`;
  if (s === 11 && sub <= 30) return `13.${sub - 20}`;
  if (s === 11) return `14.${sub - 30}`;
  if (s === 12 && sub <= 3) return `15.${sub}`;
  if (s === 12 && sub <= 13) return `16.${sub - 3}`;
  if (s === 12 && sub <= 21) return `17.${sub - 13}`;
  if (s === 12 && sub <= 30) return `18.${sub - 21}`;
  if (s === 12) return `19.${sub - 30}`;
  if (s === 13 && sub <= 6) return `20.${sub}`;
  if (s === 13 && sub <= 17) return `21.${sub - 6}`;
  if (s === 13 && sub <= 29) return `22.${sub - 17}`;
  if (s === 13 && sub <= 36) return `23.${sub - 29}`;
  return `24.${sub - 36}`;
};
const newSection = (id) => Number(id.split(".")[0]);
const sectionNames = {
  11: "Vector Search - From Brute Force to ANN",
  12: "Vector Compression - Quantization & Matryoshka",
  13: "Vector DBs in Production",
  14: "Picking a Vector Database",
  15: "The RAG Pipeline - Why & How It Breaks",
  16: "RAG Data Prep - Ingestion & Chunking",
  17: "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
  18: "RAG Generation - Naive to Advanced Patterns",
  19: "RAG in Production - Eval, Cost & Shipping",
  20: "Prompting LLMs - The Foundation",
  21: "Tools & Protocols - MCP, A2A",
  22: "Agent Mechanics - Loops & Memory",
  23: "Multi-Agent Systems",
  24: "Shipping Agents - Eval, Safety, Frameworks",
};

for (const path of ["src/data/chunks.json", "src/data/chunk-cache.json"]) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const isArray = Array.isArray(data);
  const items = isArray ? data : Object.values(data);
  for (const item of items) {
    if (item.chapterId) {
      const newId = remapId(item.chapterId);
      if (newId !== item.chapterId) {
        item.chapterId = newId;
        const sec = newSection(newId);
        item.section = sec;
        if (sectionNames[sec]) item.sectionName = sectionNames[sec];
      }
    }
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}
console.log("done");
```

Run: `node scripts/_remap-chunks.mjs && rm scripts/_remap-chunks.mjs`.

- [ ] **Step 2: Spot-check the result**

Run: `grep -c '"chapterId": "11.1"' src/data/chunks.json; grep -c '"chapterId": "24.1"' src/data/chunks.json; grep -c '"chapterId": "13.1"' src/data/chunks.json`
Expected: counts > 0 for each. No reference to chapter IDs above 24.

- [ ] **Step 3: Run chunk-related tests**

Run: `npx vitest run src/__tests__/chunk-schema.test.js src/__tests__/build-search-index.test.js src/__tests__/llm-chunk.test.js src/__tests__/search-golden.test.js`
Expected: PASS. If failures reference specific old IDs, fix inline.

- [ ] **Step 4: Commit**

```bash
git add src/data/chunks.json src/data/chunk-cache.json
git commit -m "Remap chapter IDs in search-index data files"
```

---

### Task 6: Update CLAUDE.md mapping tables and project structure

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Replace section 11/12/13 mapping tables with 14 new tables**

Delete the existing tables for Sections 11, 12, 13 (the three giant tables). Insert 14 new tables (one per new section 11-24) with columns: Chapter | Component | File | Title.

For each new section, list chapters in order using the new IDs. Source data comes from the new `config.js`.

- [ ] **Step 2: Update the project-structure tree**

In the tree comment block, the per-folder chapter counts stay the same (folders don't move). Update the section attributions:
- `vector-foundations/` — 12 chapters (new Section 11)
- `vector-compression/` — 8 chapters (new Section 12)
- `vector-production/` — 10 chapters (new Section 13)
- `vector-systems/` — 7 chapters (new Section 14)
- `rag-foundations/` — 10 chapters (new Sections 15 + 16)
- `rag-ingestion/` — 3 chapters (new Section 16)
- `rag-retrieval/` — 8 chapters (new Section 17)
- `rag-generation/` — 9 chapters (new Section 18)
- `rag-evaluation/` — 5 chapters (new Section 19)
- `rag-production/` — 6 chapters (new Section 19)
- `agent-prompting/` — 6 chapters (new Section 20)
- `agent-tools/` — 11 chapters (new Section 21)
- `agent-loops/` — 12 chapters (new Section 22)
- `multi-agent/` — 7 chapters (new Section 23)
- `agent-evals/` — 5 chapters (new Section 24)
- `agent-production/` — 11 chapters (new Section 24)

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md mapping for split sections 11-24"
```

---

### Task 7: Update public/llms.txt

**Files:**
- Modify: `public/llms.txt`

- [ ] **Step 1: Replace the two lines covering Vector Databases, RAG, and Agents**

Replace lines 23-25 (the bullets for "Vector Databases", "RAG", "Agents") with 14 separate bullets — one per new section 11-24. Each bullet keeps similar style: section name + chapter count + 1-2 sentence topic list.

Example for first new bullet:

```
- **Vector Search - From Brute Force to ANN** - 12 chapters covering vector retrieval fundamentals: the retrieval problem, brute-force kNN, the three-way tradeoff, distance metrics, sparse vs dense vectors, the ANN family tree, IVF, HNSW (intuition / construction / search / parameters), Vamana / DiskANN.
```

Continue for each section using chapter titles from config.js.

- [ ] **Step 2: Commit**

```bash
git add public/llms.txt
git commit -m "Expand llms.txt section listing for split sections 11-24"
```

---

### Task 8: Update index.html JSON-LD teaches array

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the teaches array (lines 79-95)**

Replace contents with one entry per new section, e.g.:

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
  "Vector Search - From Brute Force to ANN",
  "Vector Compression - Quantization & Matryoshka",
  "Vector DBs in Production",
  "Picking a Vector Database",
  "The RAG Pipeline - Why & How It Breaks",
  "RAG Data Prep - Ingestion & Chunking",
  "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
  "RAG Generation - Naive to Advanced Patterns",
  "RAG in Production - Eval, Cost & Shipping",
  "Prompting LLMs - The Foundation",
  "Tools & Protocols - MCP, A2A",
  "Agent Mechanics - Loops & Memory",
  "Multi-Agent Systems",
  "Shipping Agents - Eval, Safety, Frameworks"
]
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "Update JSON-LD teaches array for split sections"
```

---

### Task 9: Full test suite + lint + format

**Files:**
- None (verification only)

- [ ] **Step 1: Run all tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 3: Run format check**

Run: `npx prettier --check src/`
Expected: PASS. If anything is mis-formatted from edits, run `npm run format` and amend the last commit or make a fixup commit.

- [ ] **Step 4: Smoke test in browser**

Run: `npm run dev`. Open `localhost:5173/learn-ai/`. Click through sections 11, 14, 15, 19, 24 to confirm titles render, chapter nav works, ToC shows 24 sections.

- [ ] **Step 5: Commit any remaining fixups**

If lint/format produced edits:
```bash
git add -A
git commit -m "Fix lint/format after section split"
```

---

## Self-Review Checklist

- [x] Every old chapter ID maps to exactly one new chapter ID (no collisions, no orphans)
- [x] Every new section has a name and a color
- [x] Cross-references in 4 chapter files updated
- [x] Data files (chunks, chunk-cache, svg-descriptions) all remapped
- [x] CLAUDE.md mapping tables + project tree updated
- [x] llms.txt expanded from 3 mega-bullets to 14 new bullets
- [x] index.html teaches array expanded
- [x] No reorder of chapter sequence
- [x] No new files in src/ (chapter files untouched)
