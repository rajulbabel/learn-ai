# Semantic Search Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace DOM-scrape based search with an LLM-authored, multi-vector retrieval pipeline. API-independent at runtime; all heavy lifting moves to pre-commit on the user's laptop.

**Architecture:** Pre-commit hook hashes each section file, asks Claude to author chunks (with synthetic queries + summaries + key terms), embeds every representation with `bge-base-en-v1.5` q4, and stores int8 vectors. Browser silently pre-fetches everything via `requestIdleCallback` after `window.load`. Retrieval is BM25 + multi-vector cosine + Reciprocal Rank Fusion.

**Tech Stack:** Node 20+, `@anthropic-ai/sdk`, `@huggingface/transformers` v3, MiniSearch, Vitest, React 18, Vite 6.

**Spec:** `docs/superpowers/specs/2026-04-29-semantic-search-overhaul-design.md`

---

## File Structure

| Path | Action | Responsibility |
|------|--------|----------------|
| `scripts/build-search-index.mjs` | New | Per-section-file LLM chunk authoring with hash cache |
| `scripts/llm-chunk.mjs` | New | Anthropic SDK wrapper with prompt template + caching + retry |
| `scripts/embed-chunks.mjs` | New | Multi-vector int8 embedder |
| `scripts/quantize-model.mjs` | New | One-shot model fetch + q4 verification, writes to `public/models/` |
| `scripts/check-embeddings.mjs` | Modify | Validate new `embeddings.bin` + manifest format |
| `scripts/extract-content.test.jsx` | Delete | Replaced by `build-search-index.mjs` |
| `scripts/generate-embeddings.mjs` | Delete | Replaced by `embed-chunks.mjs` |
| `.githooks/pre-commit` | Modify | Trigger new pipeline only when source files change |
| `package.json` | Modify | New scripts + `@anthropic-ai/sdk` dep |
| `src/search.js` | Rewrite | Multi-vector retrieval, int8 dequant, RRF, prefetch API |
| `src/embedding-cache.js` | Modify | Cache `Uint8Array` payloads keyed by model checksum |
| `src/learn-ai.jsx` | Modify | Defer search prefetch to `window.load` + `requestIdleCallback` |
| `src/search-overlay.jsx` | Modify | Remove visible loading-text element; silent upgrade |
| `src/data/chunks.json` | Regenerate | New schema (id, kind, summary, queries, terms) |
| `src/data/chunk-cache.json` | New | `{ sectionFileHash: { chapterId: Chunk[] } }` |
| `src/data/embeddings.bin` | New | int8 vector blob |
| `src/data/embeddings-manifest.json` | New | Vector metadata + model checksum |
| `src/data/embeddings.json` | Delete | Replaced by `embeddings.bin` + manifest |
| `src/data/embeddings-checksum.json` | Delete | Replaced by `embeddings-manifest.json` |
| `public/models/bge-base-en-v1.5-q4/` | New | Committed model files |
| `src/__tests__/chunk-schema.test.js` | New | Schema + uniqueness + min-counts |
| `src/__tests__/coverage.test.js` | New | Every chapter has chunks |
| `src/__tests__/manifest.test.js` | New | Manifest <-> chunks <-> bin consistency |
| `src/__tests__/search-golden.test.js` | New | Golden queries hit correct chapters |
| `src/__tests__/llm-chunk.test.js` | New | Mocked SDK; prompt structure + cache reuse |
| `src/__tests__/embedding-cache.test.js` | Modify | Byte-array round-trip |
| `src/__tests__/search-overlay.test.jsx` | Modify | No visible loading-text |

---

## Task 1: Install dependencies + scaffold env

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Read current `package.json` to confirm no existing `@anthropic-ai/sdk`**

Run: `grep anthropic /Users/rajul/learn-ai/package.json`
Expected: empty output.

- [ ] **Step 2: Install Anthropic SDK and `dotenv`**

```bash
npm install --save @anthropic-ai/sdk dotenv
```

- [ ] **Step 3: Create `.env.example`**

```
# Required for pre-commit semantic search rebuild
ANTHROPIC_API_KEY=sk-ant-...

# Optional: override the chunk-authoring model (default claude-sonnet-4-6)
LEARN_AI_CHUNK_MODEL=claude-sonnet-4-6
```

- [ ] **Step 4: Add `.env` to `.gitignore` (if not already)**

Run: `grep -n "^\.env$" /Users/rajul/learn-ai/.gitignore || echo ".env" >> /Users/rajul/learn-ai/.gitignore`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example .gitignore
git commit -m "Add Anthropic SDK + env scaffolding for search pipeline"
```

---

## Task 2: Quantize / fetch bge-base q4 model

**Files:**
- Create: `scripts/quantize-model.mjs`
- Create: `public/models/bge-base-en-v1.5-q4/` (output)

- [ ] **Step 1: Create `scripts/quantize-model.mjs`**

```js
/**
 * One-shot: fetch Xenova/bge-base-en-v1.5 q4 ONNX + tokenizer files,
 * write to public/models/bge-base-en-v1.5-q4/ for the browser to load
 * from the app's own origin (deterministic, gzipped, cached by Vite).
 *
 * Run: node scripts/quantize-model.mjs
 *
 * If a q4 build is not yet published on the HF hub, this script will
 * try q4f16 then bnb4 then fall back to q8. The chosen dtype is written
 * to model-meta.json so the browser knows which file to load.
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const REPO = "Xenova/bge-base-en-v1.5";
const OUT_DIR = "public/models/bge-base-en-v1.5-q4";
const HF_BASE = "https://huggingface.co";

// Files needed at runtime, in priority order for the model weights.
const MODEL_CANDIDATES = [
  { name: "model_q4.onnx", dtype: "q4" },
  { name: "model_q4f16.onnx", dtype: "q4f16" },
  { name: "model_bnb4.onnx", dtype: "bnb4" },
  { name: "model_quantized.onnx", dtype: "q8" },
];

const SUPPORT_FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "special_tokens_map.json",
];

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function tryDownload(name) {
  const url = `${HF_BASE}/${REPO}/resolve/main/onnx/${name}`;
  const buf = await fetchBuf(url);
  if (buf) return { url, buf };
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(join(OUT_DIR, "onnx"), { recursive: true });

  let chosen = null;
  for (const { name, dtype } of MODEL_CANDIDATES) {
    console.log(`Trying ${name}...`);
    const res = await tryDownload(name);
    if (res) {
      writeFileSync(join(OUT_DIR, "onnx", name), res.buf);
      chosen = { name, dtype, size: res.buf.length };
      console.log(`  Got ${name} (${(res.buf.length / 1024 / 1024).toFixed(1)} MB)`);
      break;
    }
  }
  if (!chosen) throw new Error("No suitable ONNX model found on HuggingFace");

  // Tokenizer + config
  for (const f of SUPPORT_FILES) {
    const buf = await fetchBuf(`${HF_BASE}/${REPO}/resolve/main/${f}`);
    if (!buf) throw new Error(`Failed to download ${f}`);
    writeFileSync(join(OUT_DIR, f), buf);
  }

  // Compute checksum across all files for cache busting
  const files = [join("onnx", chosen.name), ...SUPPORT_FILES];
  const hash = createHash("sha256");
  for (const f of files) {
    hash.update(require("fs").readFileSync(join(OUT_DIR, f)));
  }
  const checksum = hash.digest("hex").slice(0, 16);

  const meta = {
    repo: REPO,
    dtype: chosen.dtype,
    weightFile: `onnx/${chosen.name}`,
    dim: 768,
    checksum,
    queryInstruction: "Represent this sentence for searching relevant passages: ",
  };
  writeFileSync(join(OUT_DIR, "model-meta.json"), JSON.stringify(meta, null, 2));
  console.log(`\nWrote ${OUT_DIR}/model-meta.json`);
  console.log(`  dtype: ${chosen.dtype}, checksum: ${checksum}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
```

Note the script uses `require` for the second hash pass; convert to ESM-only if the runtime forbids it:

```js
import { readFileSync } from "fs";
// replace require("fs").readFileSync with readFileSync
```

Use the ESM form. Replace the line:
```js
hash.update(require("fs").readFileSync(join(OUT_DIR, f)));
```
with:
```js
hash.update(readFileSync(join(OUT_DIR, f)));
```
And add `readFileSync` to the top import: `import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";`.

- [ ] **Step 2: Run the script**

```bash
node scripts/quantize-model.mjs
```

Expected output:
```
Trying model_q4.onnx...
  Got model_q4.onnx (~55 MB)
Wrote public/models/bge-base-en-v1.5-q4/model-meta.json
  dtype: q4, checksum: <16-hex>
```

If `model_q4.onnx` does not exist on the hub, the script falls back to `q4f16`, then `bnb4`, then `q8`. Whichever was chosen is recorded in `model-meta.json`.

- [ ] **Step 3: Verify files committed**

```bash
ls public/models/bge-base-en-v1.5-q4/
ls public/models/bge-base-en-v1.5-q4/onnx/
```

Expected: `config.json model-meta.json onnx/ special_tokens_map.json tokenizer.json tokenizer_config.json` and inside `onnx/` exactly one ONNX file.

- [ ] **Step 4: Add a test for the script's contract**

Create `src/__tests__/model-meta.test.js`:

```js
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("bge-base-en-v1.5 model assets", () => {
  it("has model-meta.json with required fields", () => {
    const path = "public/models/bge-base-en-v1.5-q4/model-meta.json";
    expect(existsSync(path)).toBe(true);
    const meta = JSON.parse(readFileSync(path, "utf-8"));
    expect(meta.repo).toBe("Xenova/bge-base-en-v1.5");
    expect(typeof meta.dtype).toBe("string");
    expect(meta.dim).toBe(768);
    expect(typeof meta.checksum).toBe("string");
    expect(meta.checksum.length).toBe(16);
    expect(typeof meta.weightFile).toBe("string");
    expect(meta.queryInstruction).toMatch(/^Represent /);
  });

  it("has the weight file referenced by model-meta", () => {
    const meta = JSON.parse(
      readFileSync("public/models/bge-base-en-v1.5-q4/model-meta.json", "utf-8"),
    );
    expect(existsSync(`public/models/bge-base-en-v1.5-q4/${meta.weightFile}`)).toBe(true);
  });
});
```

- [ ] **Step 5: Run test**

```bash
npx vitest run src/__tests__/model-meta.test.js
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/quantize-model.mjs src/__tests__/model-meta.test.js public/models/
git commit -m "Add bge-base q4 quantize script + committed model assets"
```

---

## Task 3: Build the LLM-chunk wrapper (`scripts/llm-chunk.mjs`)

**Files:**
- Create: `scripts/llm-chunk.mjs`
- Create: `src/__tests__/llm-chunk.test.js`

- [ ] **Step 1: Write the failing test first (`src/__tests__/llm-chunk.test.js`)**

```js
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("llm-chunk", () => {
  let chunkSection;
  let mockCreate;

  beforeEach(async () => {
    mockCreate = vi.fn();
    vi.doMock("@anthropic-ai/sdk", () => ({
      default: vi.fn(() => ({
        messages: { create: mockCreate },
      })),
    }));
    vi.resetModules();
    ({ chunkSection } = await import("../../scripts/llm-chunk.mjs"));
  });

  it("calls Anthropic with expected shape and returns parsed chunks", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          name: "emit_chunks",
          input: {
            chunks: {
              "1.1": [
                {
                  sub: 0,
                  kind: "concept",
                  text: "A neural network learns patterns from examples.",
                  summary: "A neural network is a learning system.",
                  queries: ["what is a neural network", "how do nns learn", "neural network basics", "intro to neural networks", "what does an nn do"],
                  terms: ["neural network", "learning"],
                },
              ],
            },
          },
        },
      ],
    });

    const result = await chunkSection({
      filePath: "src/sections/neural-foundations.jsx",
      source: "/* fake source */",
      chapters: [{ id: "1.1", title: "What is a Neural Network?", section: 1, sectionName: "Neural Network Foundations" }],
      svgDescriptions: {},
    });

    expect(result["1.1"]).toHaveLength(1);
    expect(result["1.1"][0].text).toMatch(/neural network/);
    expect(mockCreate).toHaveBeenCalledOnce();
    const args = mockCreate.mock.calls[0][0];
    expect(args.model).toBeDefined();
    expect(args.tools).toHaveLength(1);
    expect(args.tools[0].name).toBe("emit_chunks");
    expect(args.tool_choice).toEqual({ type: "tool", name: "emit_chunks" });
    // System message should use cache_control on the stable preamble
    expect(args.system).toBeDefined();
    const systemBlocks = Array.isArray(args.system) ? args.system : [{ type: "text", text: args.system }];
    expect(systemBlocks.some((b) => b.cache_control?.type === "ephemeral")).toBe(true);
  });

  it("retries on rate-limit then succeeds", async () => {
    const rateLimitErr = Object.assign(new Error("rate"), { status: 429 });
    mockCreate
      .mockRejectedValueOnce(rateLimitErr)
      .mockResolvedValueOnce({
        content: [
          {
            type: "tool_use",
            name: "emit_chunks",
            input: { chunks: { "1.1": [{ sub: 0, kind: "summary", text: "x", summary: "x", queries: ["a","b","c","d","e"], terms: ["t"] }] } },
          },
        ],
      });

    const result = await chunkSection({
      filePath: "f.jsx",
      source: "x",
      chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
      svgDescriptions: {},
    });
    expect(result["1.1"]).toHaveLength(1);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it("throws on schema-invalid response (missing queries)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          name: "emit_chunks",
          input: { chunks: { "1.1": [{ sub: 0, kind: "summary", text: "x", summary: "x", queries: [], terms: [] }] } },
        },
      ],
    });

    await expect(
      chunkSection({
        filePath: "f.jsx",
        source: "x",
        chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
        svgDescriptions: {},
      }),
    ).rejects.toThrow(/queries/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/llm-chunk.test.js
```

Expected: FAIL — `Cannot find module '../../scripts/llm-chunk.mjs'`.

- [ ] **Step 3: Write `scripts/llm-chunk.mjs`**

```js
/**
 * Anthropic-SDK wrapper that asks Claude to author search chunks
 * for a single section file. Uses prompt caching on the stable
 * preamble (instructions + schema) for cheap re-runs.
 */
import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MIN_QUERIES = 5;
const MAX_RETRIES = 4;

const SYSTEM_PROMPT = `You are a search-index authoring assistant for an interactive learning app about AI.

Your job: read the JSX source of one section file and produce semantic-search chunks for every chapter in it.

For each chapter, produce 1 chunk per sub-step plus 1 chapter-level summary chunk plus 1 chunk per labeled diagram.

CRITICAL RULES:
1. text: clean prose. Strip JSX, props, "Continue" button labels, UI noise. Preserve numbers, formula symbols, code blocks, example sentences, and concrete values exactly.
2. summary: ONE sentence in plain English. What the student learns from this chunk.
3. queries: 15-20 hypothetical questions the chunk answers. Mix paraphrases, term variants, conceptual rephrasings, and natural-language searches a learner would actually type.
4. terms: 3-10 key terms and synonyms (technical names, abbreviations, alternate phrasings).
5. kind: pick the best fit:
   - "concept": text-heavy explanation
   - "formula": equations or step-by-step math
   - "example": worked example with concrete numbers
   - "diagram": describes a visual / SVG
   - "summary": chapter-level summary (use only for sub: -1)
6. sub: integer matching the chapter sub-step. Use -1 for chapter-level summary, -2 for diagram-only chunks.

Emit your output by calling the emit_chunks tool exactly once with the full result.`;

const TOOL_SCHEMA = {
  name: "emit_chunks",
  description: "Emit the structured chunk array for every chapter in this section file.",
  input_schema: {
    type: "object",
    properties: {
      chunks: {
        type: "object",
        description: "Map of chapter ID to chunk array. Every chapter passed in must have an entry.",
        additionalProperties: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sub: { type: "integer" },
              kind: { type: "string", enum: ["concept", "formula", "example", "diagram", "summary"] },
              text: { type: "string", minLength: 10 },
              summary: { type: "string", minLength: 5 },
              queries: { type: "array", items: { type: "string", minLength: 3 }, minItems: 5, maxItems: 25 },
              terms: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
            },
            required: ["sub", "kind", "text", "summary", "queries", "terms"],
          },
        },
      },
    },
    required: ["chunks"],
  },
};

function buildUserMessage({ filePath, source, chapters, svgDescriptions }) {
  const chapterList = chapters
    .map((c) => `- ${c.id} | ${c.title} | section ${c.section} (${c.sectionName})`)
    .join("\n");

  const svgBlock = Object.keys(svgDescriptions).length
    ? `\n\nSVG descriptions for diagrams in this file:\n${JSON.stringify(svgDescriptions, null, 2)}`
    : "";

  return `Section file: ${filePath}

Chapters in this file (you must emit chunks for every one):
${chapterList}
${svgBlock}

Source code:
\`\`\`jsx
${source}
\`\`\``;
}

function validateAndCoerce(raw, expectedChapterIds) {
  if (!raw || typeof raw !== "object" || !raw.chunks) {
    throw new Error("Response missing 'chunks' object");
  }
  for (const id of expectedChapterIds) {
    const arr = raw.chunks[id];
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(`No chunks emitted for chapter ${id}`);
    }
    for (const c of arr) {
      if (!Array.isArray(c.queries) || c.queries.length < MIN_QUERIES) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has fewer than ${MIN_QUERIES} queries`);
      }
      if (!Array.isArray(c.terms) || c.terms.length === 0) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has empty terms`);
      }
      if (typeof c.text !== "string" || c.text.trim().length < 10) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has too-short text`);
      }
    }
  }
  return raw.chunks;
}

export async function chunkSection({ filePath, source, chapters, svgDescriptions }, { model, apiKey } = {}) {
  const client = new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });
  const chosenModel = model || process.env.LEARN_AI_CHUNK_MODEL || DEFAULT_MODEL;

  const userMessage = buildUserMessage({ filePath, source, chapters, svgDescriptions });

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: chosenModel,
        max_tokens: 8192,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "emit_chunks" },
        messages: [{ role: "user", content: userMessage }],
      });

      const toolUse = response.content.find((b) => b.type === "tool_use" && b.name === "emit_chunks");
      if (!toolUse) throw new Error("Model did not call emit_chunks");
      return validateAndCoerce(toolUse.input, chapters.map((c) => c.id));
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || err.status === 529 || err.status >= 500;
      if (!retryable || attempt === MAX_RETRIES) throw err;
      const wait = Math.min(2 ** attempt * 500, 8000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/llm-chunk.test.js
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/llm-chunk.mjs src/__tests__/llm-chunk.test.js
git commit -m "Add LLM-chunk wrapper with prompt caching and retry"
```

---

## Task 4: Build the search-index builder (`scripts/build-search-index.mjs`)

**Files:**
- Create: `scripts/build-search-index.mjs`
- Create: `src/__tests__/build-search-index.test.js`

This script reads each section file, hashes its content, looks up the chunk-cache, and on miss calls Claude. The output is `src/data/chunks.json` and `src/data/chunk-cache.json`.

- [ ] **Step 1: Write the failing test (`src/__tests__/build-search-index.test.js`)**

```js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("build-search-index", () => {
  let runBuild;
  let mockChunk;
  let workDir;

  beforeEach(async () => {
    workDir = mkdtempSync(join(tmpdir(), "build-search-"));
    mkdirSync(join(workDir, "src", "sections"), { recursive: true });
    mkdirSync(join(workDir, "src", "data"), { recursive: true });
    writeFileSync(
      join(workDir, "src", "sections", "neural-foundations.jsx"),
      "export const WhatIsNN = () => <div>NN content</div>;",
    );
    writeFileSync(join(workDir, "src", "data", "svg-descriptions.json"), "{}");

    mockChunk = vi.fn();
    vi.doMock("../../scripts/llm-chunk.mjs", () => ({ chunkSection: mockChunk }));
    vi.resetModules();
    ({ runBuild } = await import("../../scripts/build-search-index.mjs"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("calls chunkSection for changed files and skips unchanged ones via hash cache", async () => {
    mockChunk.mockResolvedValue({
      "1.1": [
        {
          sub: 0,
          kind: "concept",
          text: "NN content explained",
          summary: "Intro to NNs",
          queries: ["what is a neural network", "intro to nn", "neural network basics", "explain neural networks", "nn primer"],
          terms: ["neural network"],
        },
      ],
    });

    const chapters = [{ id: "1.1", title: "What is a Neural Network?", section: 1, sectionFile: "neural-foundations.jsx" }];
    const sectionNames = { 1: "Neural Network Foundations" };

    // First run: cache miss, calls Claude
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).toHaveBeenCalledOnce();

    // Second run with no source change: cache hit, no Claude call
    mockChunk.mockClear();
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).not.toHaveBeenCalled();

    // Edit source: cache miss again
    writeFileSync(
      join(workDir, "src", "sections", "neural-foundations.jsx"),
      "export const WhatIsNN = () => <div>EDITED</div>;",
    );
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).toHaveBeenCalledOnce();
  });

  it("writes chunks.json with stable IDs and sorted order", async () => {
    mockChunk.mockResolvedValue({
      "1.1": [
        {
          sub: 0,
          kind: "concept",
          text: "First chunk",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
        {
          sub: 1,
          kind: "example",
          text: "Second chunk",
          summary: "S2",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, sectionFile: "neural-foundations.jsx" }],
      sectionNames: { 1: "S1" },
    });

    const chunksJson = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(chunksJson).toHaveLength(2);
    expect(chunksJson[0].chapterId).toBe("1.1");
    expect(chunksJson[0].sub).toBe(0);
    expect(chunksJson[1].sub).toBe(1);
    expect(chunksJson[0].id).toMatch(/^[a-f0-9]{16}$/);
    expect(chunksJson[0].chapterTitle).toBe("T");
    expect(chunksJson[0].sectionName).toBe("S1");
    // Stable: same input → same id
    const id1 = chunksJson[0].id;
    return runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, sectionFile: "neural-foundations.jsx" }],
      sectionNames: { 1: "S1" },
    }).then(() => {
      const again = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
      expect(again[0].id).toBe(id1);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/build-search-index.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `scripts/build-search-index.mjs`**

```js
/**
 * Build src/data/chunks.json by:
 *   1. Grouping chapters by their section file.
 *   2. For each section file, hashing the source.
 *   3. On cache hit: reuse cached chunks.
 *   4. On cache miss: ask Claude (via llm-chunk.mjs) to author chunks
 *      for every chapter in that file in a single call.
 *   5. Stamping every chunk with stable id, chapterTitle, sectionName,
 *      and writing the merged array sorted by (chapterId, sub).
 *
 * Run via: npm run search:build (which runs this then embed-chunks).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import { chunkSection } from "./llm-chunk.mjs";

const CHUNKS_PATH = "src/data/chunks.json";
const CACHE_PATH = "src/data/chunk-cache.json";
const SVG_PATH = "src/data/svg-descriptions.json";
const SECTIONS_DIR = "src/sections";

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function chunkId(chapterId, sub, kind, text) {
  return sha256_16(`${chapterId}|${sub}|${kind}|${sha256_16(text)}`);
}

function chapterCmp(a, b) {
  // Numeric chapter sort: "1.2" < "1.10" < "2.1"
  const [as, ac] = a.chapterId.split(".").map(Number);
  const [bs, bc] = b.chapterId.split(".").map(Number);
  if (as !== bs) return as - bs;
  if (ac !== bc) return ac - bc;
  return a.sub - b.sub;
}

export async function runBuild({ rootDir = process.cwd(), chapters, sectionNames, log = console.log }) {
  const cachePath = join(rootDir, CACHE_PATH);
  const chunksPath = join(rootDir, CHUNKS_PATH);
  const svgPath = join(rootDir, SVG_PATH);

  const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf-8")) : {};
  const svgDescriptionsAll = existsSync(svgPath) ? JSON.parse(readFileSync(svgPath, "utf-8")) : {};

  // Group chapters by section file
  const byFile = new Map();
  for (const ch of chapters) {
    if (!ch.sectionFile) continue;
    if (!byFile.has(ch.sectionFile)) byFile.set(ch.sectionFile, []);
    byFile.get(ch.sectionFile).push(ch);
  }

  const all = [];
  for (const [file, chs] of byFile.entries()) {
    const path = join(rootDir, SECTIONS_DIR, file);
    const source = readFileSync(path, "utf-8");
    const fileHash = sha256_16(source);

    let chapterChunks;
    if (cache[fileHash]) {
      chapterChunks = cache[fileHash];
      log(`  [cache hit] ${file}`);
    } else {
      log(`  [LLM] ${file} (${chs.length} chapters)`);
      const svgForFile = {};
      for (const ch of chs) {
        if (svgDescriptionsAll[ch.id]) svgForFile[ch.id] = svgDescriptionsAll[ch.id];
      }
      chapterChunks = await chunkSection({
        filePath: file,
        source,
        chapters: chs.map((c) => ({
          id: c.id,
          title: c.title,
          section: c.section,
          sectionName: sectionNames[c.section] || "",
        })),
        svgDescriptions: svgForFile,
      });
      cache[fileHash] = chapterChunks;
    }

    for (const ch of chs) {
      const arr = chapterChunks[ch.id] || [];
      for (const c of arr) {
        all.push({
          id: chunkId(ch.id, c.sub, c.kind, c.text),
          chapterId: ch.id,
          chapterTitle: ch.title,
          section: ch.section,
          sectionName: sectionNames[ch.section] || "",
          sub: c.sub,
          kind: c.kind,
          text: c.text,
          summary: c.summary,
          queries: c.queries,
          terms: c.terms,
        });
      }
    }
  }

  all.sort(chapterCmp);

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  writeFileSync(chunksPath, JSON.stringify(all, null, 2));
  writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  log(`Wrote ${chunksPath} (${all.length} chunks)`);
  return all;
}

// CLI entry: read config + section names from src
async function main() {
  const cfgPath = "src/config.js";
  // Dynamic import .js modules from CLI
  const cfgUrl = new URL(`../${cfgPath}`, import.meta.url).href;
  const { chapters, sectionNames } = await import(cfgUrl);

  // Determine section file for each chapter via the section-loader map.
  // We mirror learn-ai.jsx's section→file mapping here.
  const sectionToFile = {
    0: "../sections/toc.jsx", // placeholder; toc is rarely indexed
    1: "neural-foundations.jsx",
    2: "llm-training.jsx",
    3: "scaling.jsx",
    4: "road-to-transformers.jsx",
    5: "transformer-input.jsx",
    6: "attention-qkv.jsx",
    7: "attention-computation.jsx",
    8: "transformer-block.jsx",
    9: "encoder-decoder-diagrams.jsx",
    10: "modern-llm-techniques.jsx",
    11: ["vector-foundations.jsx", "vector-compression.jsx", "vector-production.jsx", "vector-systems.jsx"],
  };

  // For sections with multiple files, we need a per-component mapping.
  // Build it by reading each candidate file once and looking up the export.
  const componentToFile = {};
  for (const [sec, fileOrFiles] of Object.entries(sectionToFile)) {
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    for (const file of files) {
      const path = `src/sections/${file}`;
      if (!existsSync(path)) continue;
      const src = readFileSync(path, "utf-8");
      // crude but reliable: regex-find every `export const Foo` or `export function Foo`
      for (const m of src.matchAll(/export\s+(?:const|function|let|var)\s+([A-Z][A-Za-z0-9_]*)/g)) {
        componentToFile[m[1]] = file;
      }
    }
  }

  const indexable = chapters
    .filter((c) => c.id !== "0" && c.component)
    .map((c) => ({ ...c, sectionFile: componentToFile[c.component] }));

  await runBuild({ chapters: indexable, sectionNames });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/build-search-index.test.js
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-search-index.mjs src/__tests__/build-search-index.test.js
git commit -m "Add hash-cached search index builder"
```

---

## Task 5: Build the embed-chunks script (`scripts/embed-chunks.mjs`)

**Files:**
- Create: `scripts/embed-chunks.mjs`
- Create: `src/__tests__/embed-chunks.test.js`

This script reads `chunks.json`, generates the multi-vector representations per chunk, embeds them with the local q4 ONNX (loaded via `@huggingface/transformers`), int8-quantizes each vector, and writes `embeddings.bin` + `embeddings-manifest.json`. Diffs against the existing manifest to skip unchanged reprs.

- [ ] **Step 1: Write the failing test (`src/__tests__/embed-chunks.test.js`)**

```js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("embed-chunks", () => {
  let runEmbed;
  let workDir;

  beforeEach(async () => {
    workDir = mkdtempSync(join(tmpdir(), "embed-chunks-"));
    mkdirSync(join(workDir, "src", "data"), { recursive: true });
    mkdirSync(join(workDir, "public", "models", "bge-base-en-v1.5-q4"), { recursive: true });
    writeFileSync(
      join(workDir, "public", "models", "bge-base-en-v1.5-q4", "model-meta.json"),
      JSON.stringify({
        repo: "Xenova/bge-base-en-v1.5",
        dtype: "q4",
        weightFile: "onnx/model_q4.onnx",
        dim: 4, // tiny for test
        checksum: "abc1234567890def",
        queryInstruction: "Represent this sentence for searching relevant passages: ",
      }),
    );
    writeFileSync(
      join(workDir, "src", "data", "chunks.json"),
      JSON.stringify([
        {
          id: "aaaa",
          chapterId: "1.1",
          chapterTitle: "T",
          section: 1,
          sectionName: "S",
          sub: 0,
          kind: "concept",
          text: "Hello world neural net",
          summary: "Intro",
          queries: ["q1", "q2", "q3"],
          terms: ["neural"],
        },
      ]),
    );

    // Mock pipeline factory: return deterministic small vectors
    let counter = 0;
    vi.doMock("@huggingface/transformers", () => ({
      pipeline: vi.fn(async () => async (text) => {
        counter++;
        const vec = new Array(4).fill(0).map((_, i) => (counter * (i + 1)) / 100);
        return { tolist: () => [vec] };
      }),
    }));

    vi.resetModules();
    ({ runEmbed } = await import("../../scripts/embed-chunks.mjs"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("writes embeddings.bin and manifest with one vector per representation", async () => {
    await runEmbed({ rootDir: workDir });
    const manifest = JSON.parse(
      readFileSync(join(workDir, "src", "data", "embeddings-manifest.json"), "utf-8"),
    );
    expect(manifest.dim).toBe(4);
    expect(manifest.modelChecksum).toBe("abc1234567890def");
    // 1 chunk × (1 text + 1 summary + 3 queries + 1 terms) = 6 vectors
    expect(manifest.count).toBe(6);
    expect(manifest.vectors).toHaveLength(6);
    const reprKinds = manifest.vectors.map((v) => v.reprKind).sort();
    expect(reprKinds).toEqual(["query", "query", "query", "summary", "terms", "text"]);
    const binSize = readFileSync(join(workDir, "src", "data", "embeddings.bin")).byteLength;
    expect(binSize).toBe(6 * 4); // 6 vectors × dim 4 × 1 byte/dim
  });

  it("skips unchanged reprs on second run", async () => {
    await runEmbed({ rootDir: workDir });
    const tf = await import("@huggingface/transformers");
    const pipelineMock = tf.pipeline;
    const callsBefore = pipelineMock.mock.results[0].value;
    // Re-run; nothing in chunks.json changed → no new embed calls expected
    // The embed function should detect the manifest is up-to-date and exit fast.
    const calls1 = (await callsBefore).mock?.calls?.length ?? 0;
    await runEmbed({ rootDir: workDir });
    const calls2 = (await callsBefore).mock?.calls?.length ?? 0;
    expect(calls2).toBe(calls1); // no new embed calls
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/embed-chunks.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write `scripts/embed-chunks.mjs`**

```js
/**
 * Read chunks.json, embed every representation per chunk with the
 * local q4 ONNX bge-base, int8-quantize, and write:
 *
 *   src/data/embeddings.bin             (Int8Array, contiguous: count * dim bytes)
 *   src/data/embeddings-manifest.json   (per-vector metadata + modelChecksum)
 *
 * Reuses any vector whose (chunkId, reprKind, reprIndex, contentHash) is
 * unchanged since the previous manifest. New/changed reprs are embedded
 * and overwritten; removed reprs are dropped.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";
const META_PATH = "public/models/bge-base-en-v1.5-q4/model-meta.json";
const MODEL_DIR = "public/models/bge-base-en-v1.5-q4";

function sha256_16(s) {
  return createHash("sha256").update(s).digest("hex").slice(0, 16);
}

// Generate (reprKind, reprIndex, content) tuples for one chunk
function representationsOf(chunk) {
  const out = [];
  out.push({ reprKind: "text", reprIndex: 0, content: chunk.text });
  out.push({ reprKind: "summary", reprIndex: 0, content: chunk.summary });
  for (let i = 0; i < chunk.queries.length; i++) {
    out.push({ reprKind: "query", reprIndex: i, content: chunk.queries[i] });
  }
  out.push({ reprKind: "terms", reprIndex: 0, content: chunk.terms.join(" ") });
  return out;
}

// int8 quantize a normalized float vector. Returns { bytes: Int8Array, scale }.
// scale = max(|v|); float[i] = int8[i] * scale / 127.
function quantizeInt8(vec) {
  let maxAbs = 0;
  for (const x of vec) if (Math.abs(x) > maxAbs) maxAbs = Math.abs(x);
  const scale = maxAbs > 0 ? maxAbs / 127 : 1 / 127;
  const out = new Int8Array(vec.length);
  for (let i = 0; i < vec.length; i++) {
    const q = Math.round(vec[i] / scale);
    out[i] = q > 127 ? 127 : q < -128 ? -128 : q;
  }
  return { bytes: out, scale };
}

export async function runEmbed({ rootDir = process.cwd(), log = console.log } = {}) {
  const meta = JSON.parse(readFileSync(join(rootDir, META_PATH), "utf-8"));
  const chunks = JSON.parse(readFileSync(join(rootDir, CHUNKS_PATH), "utf-8"));

  // Build the desired representation list with content hashes.
  const desired = [];
  for (const chunk of chunks) {
    for (const r of representationsOf(chunk)) {
      desired.push({
        chunkId: chunk.id,
        reprKind: r.reprKind,
        reprIndex: r.reprIndex,
        content: r.content,
        contentHash: sha256_16(r.content),
      });
    }
  }

  // Load existing manifest + bin to reuse vectors when possible.
  let oldManifest = null;
  let oldBin = null;
  if (existsSync(join(rootDir, MANIFEST_PATH)) && existsSync(join(rootDir, BIN_PATH))) {
    oldManifest = JSON.parse(readFileSync(join(rootDir, MANIFEST_PATH), "utf-8"));
    if (oldManifest.modelChecksum === meta.checksum && oldManifest.dim === meta.dim) {
      oldBin = readFileSync(join(rootDir, BIN_PATH));
    } else {
      log(`Model checksum or dim changed; re-embedding everything.`);
    }
  }

  const oldByKey = new Map();
  if (oldManifest && oldBin) {
    for (const v of oldManifest.vectors) {
      const key = `${v.chunkId}|${v.reprKind}|${v.reprIndex}|${v.contentHash}`;
      oldByKey.set(key, v);
    }
  }

  // Decide what to reuse vs embed
  const toEmbed = [];
  const reused = [];
  for (const d of desired) {
    const key = `${d.chunkId}|${d.reprKind}|${d.reprIndex}|${d.contentHash}`;
    const hit = oldByKey.get(key);
    if (hit) reused.push({ d, oldEntry: hit });
    else toEmbed.push(d);
  }

  log(`${desired.length} reprs total: ${reused.length} reused, ${toEmbed.length} to embed.`);

  // Embed needed
  let embedFn = null;
  if (toEmbed.length > 0) {
    const { pipeline } = await import("@huggingface/transformers");
    embedFn = await pipeline("feature-extraction", join(rootDir, MODEL_DIR), {
      dtype: meta.dtype,
      local_files_only: true,
    });
  }

  // Build new bin + manifest in desired order
  const dim = meta.dim;
  const newBin = Buffer.alloc(desired.length * dim);
  const newVectors = [];

  for (let i = 0; i < desired.length; i++) {
    const d = desired[i];
    const reused = oldByKey.get(`${d.chunkId}|${d.reprKind}|${d.reprIndex}|${d.contentHash}`);
    if (reused && oldBin) {
      const oldOffset = reused.vectorIndex * dim;
      oldBin.copy(newBin, i * dim, oldOffset, oldOffset + dim);
      newVectors.push({
        chunkId: d.chunkId,
        reprKind: d.reprKind,
        reprIndex: d.reprIndex,
        contentHash: d.contentHash,
        vectorIndex: i,
        scale: reused.scale,
      });
      continue;
    }

    const result = await embedFn(d.content, { pooling: "mean", normalize: true });
    const vec = result.tolist()[0];
    const { bytes, scale } = quantizeInt8(vec);
    Buffer.from(bytes.buffer).copy(newBin, i * dim);
    newVectors.push({
      chunkId: d.chunkId,
      reprKind: d.reprKind,
      reprIndex: d.reprIndex,
      contentHash: d.contentHash,
      vectorIndex: i,
      scale,
    });
    if ((i + 1) % 200 === 0) log(`  ${i + 1}/${desired.length}`);
  }

  const newManifest = {
    modelChecksum: meta.checksum,
    dim,
    count: desired.length,
    vectors: newVectors,
  };

  mkdirSync(join(rootDir, "src/data"), { recursive: true });
  writeFileSync(join(rootDir, BIN_PATH), newBin);
  writeFileSync(join(rootDir, MANIFEST_PATH), JSON.stringify(newManifest));
  log(`Wrote ${BIN_PATH} (${newBin.byteLength} bytes) + ${MANIFEST_PATH} (${newVectors.length} vectors).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmbed().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/embed-chunks.test.js
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/embed-chunks.mjs src/__tests__/embed-chunks.test.js
git commit -m "Add multi-vector int8 embed script with manifest cache"
```

---

## Task 6: Atomic cutover (replace pipeline + regenerate data + delete old)

**Why atomic:** the existing `.githooks/pre-commit` calls `npm run search:extract` (the OLD DOM-scrape via `extract-content.test.jsx`). If we commit any partial step that leaves the OLD hook in place but the new check-embeddings or new package.json scripts active, the OLD hook will either clobber the new `chunks.json` or fail entirely. The cleanest path is one carefully ordered task that puts the NEW hook on disk *before* the commit runs, so the commit's hook execution uses the new logic.

**Files:**
- Modify: `scripts/check-embeddings.mjs`
- Modify: `.githooks/pre-commit`
- Modify: `package.json`
- Create: `src/__tests__/check-embeddings.test.js`
- Generate: `src/data/chunks.json`, `src/data/chunk-cache.json`, `src/data/embeddings.bin`, `src/data/embeddings-manifest.json`
- Delete: `src/data/embeddings.json`, `src/data/embeddings-checksum.json`, `scripts/extract-content.test.jsx`, `scripts/generate-embeddings.mjs`

**Important:** `git`'s pre-commit hook reads `.githooks/pre-commit` from the working tree at commit time. If the file on disk is the new version, the new hook runs - even on this very commit. So we must replace the hook on disk BEFORE running `git commit`, not as part of the commit's content.

- [ ] **Step 1: Write the failing test (`src/__tests__/check-embeddings.test.js`)**

```js
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, cpSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

function setup({ chunks, manifest, bin }) {
  const dir = mkdtempSync(join(tmpdir(), "check-emb-"));
  mkdirSync(join(dir, "src", "data"), { recursive: true });
  writeFileSync(join(dir, "src", "data", "chunks.json"), JSON.stringify(chunks));
  writeFileSync(join(dir, "src", "data", "embeddings-manifest.json"), JSON.stringify(manifest));
  writeFileSync(join(dir, "src", "data", "embeddings.bin"), bin);
  // Copy the script
  mkdirSync(join(dir, "scripts"), { recursive: true });
  cpSync("scripts/check-embeddings.mjs", join(dir, "scripts", "check-embeddings.mjs"));
  return dir;
}

describe("check-embeddings (new format)", () => {
  it("exits 0 when manifest, chunks, and bin are consistent", () => {
    const dir = setup({
      chunks: [{ id: "a", chapterId: "1.1", sub: 0, kind: "concept", text: "x", summary: "x", queries: ["a","b","c","d","e"], terms: ["t"] }],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 8,
        vectors: Array(8).fill(0).map((_, i) => ({ chunkId: "a", reprKind: i === 0 ? "text" : "query", reprIndex: i, contentHash: "h", vectorIndex: i, scale: 0.1 })),
      },
      bin: Buffer.alloc(8 * 4),
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).not.toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it("exits 1 when bin size disagrees with manifest", () => {
    const dir = setup({
      chunks: [{ id: "a", chapterId: "1.1", sub: 0, kind: "concept", text: "x", summary: "x", queries: ["a","b","c","d","e"], terms: ["t"] }],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 8,
        vectors: Array(8).fill(0).map((_, i) => ({ chunkId: "a", reprKind: "query", reprIndex: i, contentHash: "h", vectorIndex: i, scale: 0.1 })),
      },
      bin: Buffer.alloc(8 * 4 - 1), // wrong size
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it("exits 1 when a chunk id has zero vectors in the manifest", () => {
    const dir = setup({
      chunks: [
        { id: "a", chapterId: "1.1", sub: 0, kind: "concept", text: "x", summary: "x", queries: ["a","b","c","d","e"], terms: ["t"] },
        { id: "b", chapterId: "1.2", sub: 0, kind: "concept", text: "x", summary: "x", queries: ["a","b","c","d","e"], terms: ["t"] },
      ],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 1,
        vectors: [{ chunkId: "a", reprKind: "text", reprIndex: 0, contentHash: "h", vectorIndex: 0, scale: 0.1 }],
      },
      bin: Buffer.alloc(1 * 4),
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).toThrow();
    rmSync(dir, { recursive: true, force: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails (against the OLD script)**

```bash
npx vitest run src/__tests__/check-embeddings.test.js
```

Expected: tests fail (script still references the old `embeddings.json` / `embeddings-checksum.json`).

- [ ] **Step 3: Rewrite `scripts/check-embeddings.mjs`**

```js
/**
 * Pre-commit guard: verifies embeddings.bin + embeddings-manifest.json are
 * consistent with chunks.json (every chunk id covered by ≥1 vector; bin
 * size matches count × dim).
 *
 * Exits 0 if in sync, exits 1 (blocking commit) if out of sync.
 */
import { readFileSync, statSync } from "fs";

const CHUNKS_PATH = "src/data/chunks.json";
const BIN_PATH = "src/data/embeddings.bin";
const MANIFEST_PATH = "src/data/embeddings-manifest.json";

function fail(msg) {
  console.error(`\x1b[31m[pre-commit] ${msg}\n  Run: npm run search:build\x1b[0m`);
  process.exit(1);
}

try {
  const chunks = JSON.parse(readFileSync(CHUNKS_PATH, "utf-8"));
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const binSize = statSync(BIN_PATH).size;

  if (!Array.isArray(chunks) || chunks.length === 0) fail(`${CHUNKS_PATH} has 0 chunks.`);
  if (!Array.isArray(manifest.vectors)) fail(`${MANIFEST_PATH} missing 'vectors'.`);
  if (typeof manifest.dim !== "number") fail(`${MANIFEST_PATH} missing 'dim'.`);
  if (typeof manifest.count !== "number") fail(`${MANIFEST_PATH} missing 'count'.`);
  if (manifest.count !== manifest.vectors.length)
    fail(`Manifest count (${manifest.count}) != vectors length (${manifest.vectors.length}).`);
  if (binSize !== manifest.count * manifest.dim)
    fail(`Bin size (${binSize}) != count × dim (${manifest.count * manifest.dim}).`);

  const chunkIds = new Set(chunks.map((c) => c.id));
  const covered = new Set(manifest.vectors.map((v) => v.chunkId));
  for (const id of chunkIds) {
    if (!covered.has(id)) fail(`Chunk id ${id} has no vectors in manifest.`);
  }
  for (const v of manifest.vectors) {
    if (!chunkIds.has(v.chunkId)) fail(`Manifest vector references unknown chunk id ${v.chunkId}.`);
    if (v.vectorIndex < 0 || v.vectorIndex >= manifest.count)
      fail(`Vector index ${v.vectorIndex} out of bounds.`);
  }

  console.log(
    `\x1b[32m[pre-commit] Embeddings in sync: ${chunks.length} chunks, ${manifest.count} vectors, dim ${manifest.dim}, model ${manifest.modelChecksum}.\x1b[0m`,
  );
} catch (err) {
  fail(`Could not verify embeddings: ${err.message}`);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/check-embeddings.test.js
```

Expected: 3 tests pass.

- [ ] **Step 5: Update `package.json` scripts**

```json
"scripts": {
  "dev": "vite",
  "build": "npm run search:build && vite build",
  "preview": "vite preview",
  "lint": "eslint src/",
  "format": "prettier --write src/",
  "test": "vitest run",
  "test:watch": "vitest",
  "search:model": "node scripts/quantize-model.mjs",
  "search:index": "node scripts/build-search-index.mjs",
  "search:embed": "node scripts/embed-chunks.mjs",
  "search:build": "npm run search:index && npm run search:embed",
  "search:check": "node scripts/check-embeddings.mjs",
  "prepare": "git config core.hooksPath .githooks"
}
```

(Remove the old `search:extract` line.)

- [ ] **Step 6: Rewrite `.githooks/pre-commit`**

```sh
#!/bin/sh
# Auto-rebuild semantic search index + embeddings when source changes.

set -e

# Detect whether anything that affects the search index is staged.
RELEVANT=$(git diff --cached --name-only -- 'src/sections/*.jsx' 'src/sections/*.js' 'src/config.js' 'src/data/svg-descriptions.json' 'public/models/*' || true)

if [ -z "$RELEVANT" ]; then
  # Nothing source-side changed: still verify in-tree consistency.
  node scripts/check-embeddings.mjs
  exit 0
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "\033[31m[pre-commit] ANTHROPIC_API_KEY missing. Source files changed; cannot rebuild search index.\033[0m"
  echo "\033[31m  Set the env var or unstage source/config changes.\033[0m"
  exit 1
fi

echo "\033[33m[pre-commit] Source changed. Rebuilding search index + embeddings...\033[0m"
npm run search:build --silent

# Stage every regenerated artifact + cache.
git add src/data/chunks.json src/data/chunk-cache.json src/data/embeddings.bin src/data/embeddings-manifest.json

node scripts/check-embeddings.mjs
echo "\033[32m[pre-commit] Search index + embeddings up to date.\033[0m"
```

- [ ] **Step 7: Make hook executable**

```bash
chmod +x .githooks/pre-commit
```

- [ ] **Step 8: Set the API key (required for the data regen)**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 9: Delete the obsolete script files (so the new build can't accidentally pick them up)**

```bash
rm scripts/extract-content.test.jsx scripts/generate-embeddings.mjs
```

- [ ] **Step 10: Run the new chunk builder**

```bash
npm run search:index
```

Expected: prints `[LLM] <file>` lines for every section file, then `Wrote src/data/chunks.json (~700-1100 chunks)`.

- [ ] **Step 11: Spot-check Section 11 coverage**

```bash
node -e "const c=JSON.parse(require('fs').readFileSync('./src/data/chunks.json','utf8')); console.log('S11 chunks:', c.filter(x=>x.section===11).length, 'unique chapters:', new Set(c.filter(x=>x.section===11).map(x=>x.chapterId)).size);"
```

Expected: `unique chapters: 36`.

- [ ] **Step 12: Run the embedder**

```bash
npm run search:embed
```

Expected: progress lines and `Wrote src/data/embeddings.bin + src/data/embeddings-manifest.json.`

- [ ] **Step 13: Verify check passes**

```bash
npm run search:check
```

Expected: green `[pre-commit] Embeddings in sync: ...`

- [ ] **Step 14: Stage everything atomically and commit**

By this point:
- The NEW pre-commit hook is on disk at `.githooks/pre-commit`. When `git commit` runs, it reads that file from the working tree, so the NEW hook executes.
- The NEW hook's first action is `git diff --cached --name-only` — it sees that no `src/sections/*` is staged (we only changed scripts, hooks, package.json, and data). It skips the rebuild branch and runs `check-embeddings.mjs`.
- The NEW `check-embeddings.mjs` reads `embeddings.bin` + `embeddings-manifest.json` (now staged) and passes.

```bash
git add scripts/check-embeddings.mjs src/__tests__/check-embeddings.test.js
git add .githooks/pre-commit package.json
git add src/data/chunks.json src/data/chunk-cache.json src/data/embeddings.bin src/data/embeddings-manifest.json
git rm src/data/embeddings.json src/data/embeddings-checksum.json
git rm scripts/extract-content.test.jsx scripts/generate-embeddings.mjs
git commit -m "Atomic cutover: new search pipeline (LLM-authored chunks + multi-vector int8)"
```

If the commit fails: do NOT use `--no-verify`. Read the failure message; the most likely cause is a missing/incorrect file. Fix and retry.

---

## Task 10: Update `src/embedding-cache.js` for byte-array storage

**Files:**
- Modify: `src/embedding-cache.js`
- Modify: `src/__tests__/embedding-cache.test.js`

The new browser flow loads `embeddings.bin` as a `Uint8Array`. Cache must store bytes (not arrays of arrays), and key by `modelChecksum`.

- [ ] **Step 1: Update the test (`src/__tests__/embedding-cache.test.js`)**

Replace the existing tests with:

```js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function createMockIDB() {
  const data = {};
  const mockDB = {
    transaction: () => ({
      objectStore: () => ({
        get: (key) => {
          const req = { result: data[key] };
          setTimeout(() => req.onsuccess?.({ target: req }), 0);
          return req;
        },
        put: (value, key) => {
          data[key] = value;
          const req = {};
          setTimeout(() => req.onsuccess?.({ target: req }), 0);
          return req;
        },
      }),
    }),
    close: vi.fn(),
  };
  return { mockDB, data };
}

describe("embedding-cache (byte-array)", () => {
  let cache;
  let mockDB, data;

  beforeEach(async () => {
    ({ mockDB, data } = createMockIDB());
    globalThis.indexedDB = {
      open: vi.fn(() => {
        const req = {};
        setTimeout(() => {
          req.onupgradeneeded?.({
            target: {
              result: {
                ...mockDB,
                objectStoreNames: { contains: () => false },
                createObjectStore: () => {},
              },
            },
          });
          req.result = mockDB;
          req.onsuccess?.({ target: req });
        }, 0);
        return req;
      }),
    };
    vi.resetModules();
    cache = await import("../embedding-cache.js");
  });

  afterEach(() => {
    delete globalThis.indexedDB;
  });

  it("round-trips a Uint8Array bin payload + manifest", async () => {
    const bin = new Uint8Array([1, 2, 3, 4]);
    const manifest = { modelChecksum: "ck1", dim: 2, count: 2, vectors: [] };
    await cache.cacheSearchAssets("ck1", { bin, manifest });
    const got = await cache.getCachedSearchAssets("ck1");
    expect(got.manifest).toEqual(manifest);
    expect(Array.from(got.bin)).toEqual([1, 2, 3, 4]);
  });

  it("returns null on checksum miss", async () => {
    const bin = new Uint8Array([1, 2]);
    await cache.cacheSearchAssets("ck1", { bin, manifest: { modelChecksum: "ck1", dim: 1, count: 2, vectors: [] } });
    const got = await cache.getCachedSearchAssets("ck2");
    expect(got).toBeNull();
  });

  it("returns null when IndexedDB is unavailable", async () => {
    delete globalThis.indexedDB;
    vi.resetModules();
    const mod = await import("../embedding-cache.js");
    const got = await mod.getCachedSearchAssets("ck1");
    expect(got).toBeNull();
  });
});
```

- [ ] **Step 2: Run test (should fail)**

```bash
npx vitest run src/__tests__/embedding-cache.test.js
```

Expected: FAIL (functions `cacheSearchAssets` / `getCachedSearchAssets` don't exist).

- [ ] **Step 3: Rewrite `src/embedding-cache.js`**

```js
/**
 * IndexedDB cache for the search-asset bundle:
 *   - embeddings.bin (as Uint8Array)
 *   - embeddings-manifest.json (object)
 *
 * Keyed by modelChecksum. Mismatch ⇒ download fresh; new entry overwrites old.
 */

const DB_NAME = "learn-ai-search";
const DB_VERSION = 1;
const STORE_NAME = "assets";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedSearchAssets(modelChecksum) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME);
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(modelChecksum);
      req.onsuccess = (e) => {
        db.close();
        const v = e.target.result;
        if (v && v.bin instanceof Uint8Array && v.manifest) resolve(v);
        else resolve(null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function cacheSearchAssets(modelChecksum, { bin, manifest }) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ bin, manifest }, modelChecksum);
      req.onsuccess = () => {
        db.close();
        resolve();
      };
      req.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Silently fail
  }
}
```

- [ ] **Step 4: Run test (should pass)**

```bash
npx vitest run src/__tests__/embedding-cache.test.js
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/embedding-cache.js src/__tests__/embedding-cache.test.js
git commit -m "Switch embedding cache to byte-array bin + manifest"
```

---

## Task 11: Rewrite `src/search.js` for multi-vector + int8 + RRF

**Files:**
- Modify: `src/search.js`
- Create: `src/__tests__/search-golden.test.js`
- Modify: `src/__tests__/search.test.js` (if exists; else just create the golden test)

This is the largest browser change. New API:

| Function | Behavior |
|----------|----------|
| `prefetchSearch()` | Idle-time pre-fetch: chunks.json → MiniSearch index → embeddings.bin + manifest → tokenizer + ONNX pipeline |
| `search(query, { limit })` | Hybrid (BM25 + multi-vector + RRF) when ready; text-only fallback otherwise |
| `searchText(query, limit)` | Always-instant text-only |
| `getSearchStatus()` | `{ mode, progress }` |

- [ ] **Step 1: Write a golden-query test (`src/__tests__/search-golden.test.js`)**

```js
import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";

// Sanity-check: every "obvious" query should match a chunk on text alone.
// Once embeddings are loaded these become end-to-end checks (run in jsdom
// with a fake pipeline returning known vectors). Here we lock in the
// minimum: text search produces sensible results.

describe("search index basics", () => {
  it("includes every chapter ID from config exactly once or more", async () => {
    const { chapters } = await import("../config.js");
    const indexed = new Set(chunks.map((c) => c.chapterId));
    for (const ch of chapters) {
      if (ch.id === "0" || !ch.component) continue;
      expect(indexed.has(ch.id), `chapter ${ch.id} missing from chunks.json`).toBe(true);
    }
  });

  it("section 11 is fully covered", () => {
    const s11 = new Set(chunks.filter((c) => c.section === 11).map((c) => c.chapterId));
    // Section 11 has 36 chapters per CLAUDE.md
    expect(s11.size).toBeGreaterThanOrEqual(36);
  });

  it("every chunk has at least 5 queries", () => {
    for (const c of chunks) {
      expect(c.queries.length, `chunk ${c.id} has too few queries`).toBeGreaterThanOrEqual(5);
    }
  });

  it("text search returns results for golden queries", async () => {
    const { searchText, initSearch } = await import("../search.js");
    await initSearch();
    const golden = [
      { q: "HNSW", expectChapter: /^11\.[789]|11\.10|11\.18/ },
      { q: "product quantization", expectChapter: /^11\.(14|17|18|19)/ },
      { q: "RoPE", expectChapter: /^5\.9$/ },
      { q: "softmax temperature", expectChapter: /^(2\.6|7\.[46])/ },
      { q: "vanishing gradient", expectChapter: /^(1\.15|4\.3)/ },
      { q: "scaling laws", expectChapter: /^3\.1$/ },
      { q: "binary quantization", expectChapter: /^11\.(15|19)/ },
      { q: "cross attention", expectChapter: /^9\.3$/ },
    ];
    for (const { q, expectChapter } of golden) {
      const results = searchText(q, 5);
      expect(results.length, `no results for "${q}"`).toBeGreaterThan(0);
      const top3 = results.slice(0, 3).map((r) => r.chapterId);
      expect(top3.some((id) => expectChapter.test(id)), `"${q}" top 3 = ${JSON.stringify(top3)}, expected match for ${expectChapter}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the test against the OLD search.js to capture baseline**

```bash
npx vitest run src/__tests__/search-golden.test.js
```

Expected: most cases fail (Section 11 missing today). That is the failure surface we're closing.

- [ ] **Step 3: Rewrite `src/search.js`**

```js
/**
 * Hybrid search: MiniSearch BM25 + multi-vector cosine + Reciprocal Rank Fusion.
 *
 * Data files (built by scripts/build-search-index.mjs + embed-chunks.mjs):
 *   src/data/chunks.json                  - chunk metadata + text + queries + summary + terms
 *   src/data/embeddings.bin               - Int8Array of all repr vectors, contiguous (count * dim bytes)
 *   src/data/embeddings-manifest.json     - per-vector entries + modelChecksum + dim
 *
 * Query-time embedding model: q4 ONNX bge-base from /models/bge-base-en-v1.5-q4/
 * (loaded via @huggingface/transformers, dtype from model-meta.json).
 */
import MiniSearch from "minisearch";
import { getCachedSearchAssets, cacheSearchAssets } from "./embedding-cache.js";

let miniSearch = null;
let chunks = [];
let chunkById = new Map();
let manifest = null;
let bin = null; // Int8Array
let dim = 0;
let embedPipeline = null;
let modelMeta = null;

let textReady = false;
let semanticReady = false;
let semanticLoading = false;
let loadProgress = 0;

export function getSearchStatus() {
  if (semanticReady) return { mode: "semantic", progress: 100 };
  if (semanticLoading) return { mode: "loading", progress: loadProgress };
  if (textReady) return { mode: "text", progress: 0 };
  return { mode: "off", progress: 0 };
}

/** Lazy: load chunks.json + build MiniSearch. */
export async function initSearch() {
  if (textReady) return;
  let chunkData;
  try {
    const mod = await import("./data/chunks.json");
    chunkData = mod.default || mod;
  } catch {
    console.warn("[search] chunks.json missing - run npm run search:build");
    return;
  }
  chunks = Array.isArray(chunkData) ? chunkData : [];
  chunkById = new Map(chunks.map((c) => [c.id, c]));

  miniSearch = new MiniSearch({
    fields: ["text", "summary", "terms_joined", "chapterTitle", "sectionName"],
    storeFields: ["chapterId", "chapterTitle", "section", "sectionName", "sub", "text", "summary"],
    idField: "id",
    extractField: (doc, field) => (field === "terms_joined" ? (doc.terms || []).join(" ") : doc[field]),
    searchOptions: {
      boost: { chapterTitle: 4, terms_joined: 3, summary: 2, text: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  miniSearch.addAll(chunks);
  textReady = true;
}

/** Idle-time semantic pre-fetch. Silent. */
export async function prefetchSearch() {
  if (!textReady) await initSearch();
  if (semanticReady || semanticLoading) return;
  semanticLoading = true;
  loadProgress = 0;
  try {
    // 1. Load model meta (small, deterministic URL)
    const metaRes = await fetch("/learn-ai/models/bge-base-en-v1.5-q4/model-meta.json").catch(() => null);
    if (!metaRes || !metaRes.ok) {
      // Vite dev mode serves at /
      const alt = await fetch("/models/bge-base-en-v1.5-q4/model-meta.json");
      if (!alt.ok) throw new Error("model-meta missing");
      modelMeta = await alt.json();
    } else {
      modelMeta = await metaRes.json();
    }
    dim = modelMeta.dim;

    // 2. Load embeddings (cache hit by modelChecksum, else download)
    const cached = await getCachedSearchAssets(modelMeta.checksum);
    if (cached) {
      manifest = cached.manifest;
      bin = cached.bin;
    } else {
      const [manifestMod, binBuf] = await Promise.all([
        import("./data/embeddings-manifest.json").then((m) => m.default || m),
        fetch("./data/embeddings.bin").then((r) => r.arrayBuffer()),
      ]);
      manifest = manifestMod;
      bin = new Uint8Array(binBuf);
      cacheSearchAssets(modelMeta.checksum, { bin, manifest }).catch(() => {});
    }
    loadProgress = 30;

    // 3. Lazy-load transformers.js + load model
    const { pipeline, env } = await import("@huggingface/transformers");
    // Force local model loading from our origin
    env.allowRemoteModels = false;
    env.localModelPath = "/learn-ai/models/";
    env.backends.onnx.wasm.numThreads = 1;
    embedPipeline = await pipeline("feature-extraction", "bge-base-en-v1.5-q4", {
      dtype: modelMeta.dtype,
      progress_callback: (p) => {
        if (p.status === "progress" && typeof p.progress === "number") {
          loadProgress = 30 + Math.round(p.progress * 0.65);
        }
      },
    });
    loadProgress = 100;
    semanticReady = true;
    semanticLoading = false;
  } catch (e) {
    console.warn("[search] semantic init failed:", e.message);
    semanticLoading = false;
    loadProgress = 0;
  }
}

// ---- Cosine over int8-quantized vectors ----
// Score = dot(query_float, dequant(int8_vec)) / (||query|| * ||vec||).
// Query is normalized at embed time (normalize: true), so ||query||=1.
// Dequantized vec norm: scale * sqrt(sum(int8^2)).
function int8Cosine(qFloat, qNorm, vecOffset, vecScale) {
  let dot = 0;
  let vNormSq = 0;
  for (let i = 0; i < dim; i++) {
    const v8 = (bin[vecOffset + i] << 24) >> 24; // sign-extend int8
    const v = v8 * vecScale;
    dot += qFloat[i] * v;
    vNormSq += v * v;
  }
  const vNorm = Math.sqrt(vNormSq);
  return dot / (qNorm * vNorm + 1e-8);
}

async function embedQuery(text) {
  if (!embedPipeline) return null;
  const prefixed = (modelMeta?.queryInstruction || "") + text;
  const res = await embedPipeline(prefixed, { pooling: "mean", normalize: true });
  return res.tolist()[0];
}

function vectorSearchMaxSim(qFloat, topK = 30) {
  // Group max-sim per chunk
  let qNorm = 0;
  for (const x of qFloat) qNorm += x * x;
  qNorm = Math.sqrt(qNorm);
  const best = new Map();
  for (const v of manifest.vectors) {
    const offset = v.vectorIndex * dim;
    const s = int8Cosine(qFloat, qNorm, offset, v.scale);
    const cur = best.get(v.chunkId);
    if (cur === undefined || s > cur) best.set(v.chunkId, s);
  }
  const ranked = [...best.entries()]
    .map(([chunkId, score]) => ({ chunkId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return ranked.map((r) => ({ ...chunkById.get(r.chunkId), vectorScore: r.score }));
}

function textSearch(query, topK = 30) {
  if (!miniSearch) return [];
  return miniSearch.search(query, { limit: topK }).map((r) => ({
    ...chunkById.get(r.id),
    textScore: r.score,
  }));
}

function rrfMerge(textResults, vectorResults, k = 60) {
  const score = new Map();
  const data = new Map();
  textResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + 1 / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  });
  vectorResults.forEach((r, i) => {
    const key = r.id;
    score.set(key, (score.get(key) || 0) + 1 / (k + i + 1));
    if (!data.has(key)) data.set(key, r);
  });
  return [...score.entries()]
    .map(([id, s]) => ({ ...data.get(id), fusedScore: s }))
    .sort((a, b) => b.fusedScore - a.fusedScore);
}

function dedupeByChapter(items) {
  const seen = new Set();
  const out = [];
  for (const r of items) {
    const key = `${r.chapterId}:${r.sub}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

function shape(r) {
  return {
    chapterId: r.chapterId,
    title: r.chapterTitle,
    section: r.section,
    sectionName: r.sectionName,
    sub: r.sub,
    text: r.text || r.summary || "",
    score: r.fusedScore || r.vectorScore || r.textScore || 0,
    source: r.fusedScore != null ? "hybrid" : r.vectorScore != null ? "semantic" : "text",
  };
}

export async function search(query, { limit = 10 } = {}) {
  if (!textReady) await initSearch();
  if (!miniSearch) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];

  const text = textSearch(trimmed, 30);
  if (!semanticReady) {
    return dedupeByChapter(text).slice(0, limit).map(shape);
  }
  let vec = [];
  try {
    const q = await embedQuery(trimmed);
    if (q) vec = vectorSearchMaxSim(q, 30);
  } catch {
    // fall back to text
  }
  const merged = vec.length === 0 ? text : rrfMerge(text, vec);
  return dedupeByChapter(merged).slice(0, limit).map(shape);
}

export function searchText(query, limit = 10) {
  if (!miniSearch) return [];
  const trimmed = query.trim();
  if (!trimmed) return [];
  const results = textSearch(trimmed, 30);
  return dedupeByChapter(results).slice(0, limit).map(shape);
}
```

- [ ] **Step 4: Run the golden test**

```bash
npx vitest run src/__tests__/search-golden.test.js
```

Expected: all assertions pass (Section 11 covered, golden queries hit the right chapters).

- [ ] **Step 5: Run full test suite**

```bash
npm run test
```

Expected: all green. Old `embeddings-checksum.json` test now lives only against the byte-array path (already updated in Task 10).

- [ ] **Step 6: Commit**

```bash
git add src/search.js src/__tests__/search-golden.test.js
git commit -m "Rewrite search.js for multi-vector int8 + RRF retrieval"
```

---

## Task 12: Defer search prefetch to `window.load` + `requestIdleCallback`

**Files:**
- Modify: `src/learn-ai.jsx`

The old code triggered `initSearch` immediately after the first chapter loaded. New code waits for `window.load` then `requestIdleCallback`.

- [ ] **Step 1: Locate the old trigger** in `src/learn-ai.jsx` lines 271-278:

```jsx
if (!firstLoadDone.current) {
  firstLoadDone.current = true;
  getSearchModule().then((mod) => {
    mod.initSearch().catch(() => {});
    startSemanticPoll();
  });
}
```

Replace with:

```jsx
if (!firstLoadDone.current) {
  firstLoadDone.current = true;
  // Defer all search work until the page is fully idle so it never
  // competes with first paint or section/asset loading.
  const trigger = () => {
    const idle = (cb) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(cb, { timeout: 3000 })
        : setTimeout(cb, 1000);
    idle(() => {
      getSearchModule().then((mod) => {
        mod.prefetchSearch().catch(() => {});
        startSemanticPoll();
      });
    });
  };
  if (document.readyState === "complete") trigger();
  else window.addEventListener("load", trigger, { once: true });
}
```

- [ ] **Step 2: Locate the second trigger** in `handleSearchOpen` (around line 521-527):

```jsx
const handleSearchOpen = useCallback(() => {
  setSearchOpen(true);
  getSearchModule().then((mod) => {
    mod.initSearch().catch(() => {});
  });
}, []);
```

Change to also call `prefetchSearch` (a no-op if already running):

```jsx
const handleSearchOpen = useCallback(() => {
  setSearchOpen(true);
  getSearchModule().then((mod) => {
    mod.initSearch().catch(() => {});
    mod.prefetchSearch().catch(() => {});
  });
}, []);
```

- [ ] **Step 3: Add a unit test asserting the prefetch is gated on idle/load (`src/__tests__/learn-ai-prefetch.test.jsx`)**

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

describe("search prefetch is deferred", () => {
  let prefetchSpy;

  beforeEach(() => {
    prefetchSpy = vi.fn().mockResolvedValue();
    vi.doMock("../search.js", () => ({
      initSearch: vi.fn().mockResolvedValue(),
      prefetchSearch: prefetchSpy,
      search: vi.fn(),
      searchText: vi.fn(() => []),
      getSearchStatus: vi.fn(() => ({ mode: "off", progress: 0 })),
    }));
  });

  afterEach(() => {
    cleanup();
    delete globalThis.requestIdleCallback;
    vi.resetModules();
  });

  it("does not call prefetchSearch synchronously during render", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    // Allow any microtasks
    await new Promise((r) => setTimeout(r, 50));
    expect(prefetchSpy).not.toHaveBeenCalled();
  });

  it("calls prefetchSearch after window load + idle", async () => {
    Object.defineProperty(document, "readyState", { configurable: true, value: "loading" });
    globalThis.requestIdleCallback = (cb) => setTimeout(cb, 0);
    const App = (await import("../learn-ai.jsx")).default;
    render(<App />);
    window.dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 50));
    expect(prefetchSpy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/__tests__/learn-ai-prefetch.test.jsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/learn-ai.jsx src/__tests__/learn-ai-prefetch.test.jsx
git commit -m "Defer search prefetch to window.load + requestIdleCallback"
```

---

## Task 13: Make search overlay's loading state invisible

**Files:**
- Modify: `src/search-overlay.jsx`
- Modify: `src/__tests__/search-overlay.test.jsx`

The visible "Loading semantic model..." text is removed. Status dot stays. Results never show a "Searching..." label; text results are visible immediately and silently upgrade.

- [ ] **Step 1: Update the test (`src/__tests__/search-overlay.test.jsx`)**

Add this test (do not remove existing ones unless they assert the now-removed loading text):

```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchOverlay from "../search-overlay.jsx";

vi.mock("../search.js", () => ({
  initSearch: vi.fn().mockResolvedValue(),
  search: vi.fn().mockResolvedValue([]),
  searchText: vi.fn(() => []),
  getSearchStatus: () => ({ mode: "loading", progress: 50 }),
}));

describe("search overlay loading state is invisible", () => {
  it("does not render the words 'Loading semantic model'", () => {
    render(<SearchOverlay open={true} onClose={() => {}} onGoTo={() => {}} />);
    expect(screen.queryByText(/Loading semantic model/i)).toBeNull();
  });
  it("does not render 'Searching...' as a result placeholder", () => {
    render(<SearchOverlay open={true} onClose={() => {}} onGoTo={() => {}} />);
    expect(screen.queryByText(/^Searching\.\.\.$/)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test (should fail)**

```bash
npx vitest run src/__tests__/search-overlay.test.jsx
```

Expected: at least one test fails because the text is currently present.

- [ ] **Step 3: Edit `src/search-overlay.jsx`**

Replace the `statusLabel` block (around lines 183-188):

```jsx
const statusLabel = isReady
  ? "Semantic Search Active"
  : isSearchLoading
    ? "Loading semantic model..."
    : "Text search";
```

with an invisible-during-load variant:

```jsx
const statusLabel = isReady
  ? "Semantic Search Active"
  : "Text search";
```

(Drop the loading branch entirely; the status dot still changes color via `dotColor`.)

Replace the `countText` block (around lines 195-199):

```jsx
const countText = query.trim()
  ? loading
    ? "Searching..."
    : `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}`
  : "Type to search";
```

with:

```jsx
const countText = query.trim()
  ? `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""}`
  : "Type to search";
```

(Drop the "Searching..." flicker. Results are always shown; text-only first, hybrid replaces silently.)

- [ ] **Step 4: Run test (should pass)**

```bash
npx vitest run src/__tests__/search-overlay.test.jsx
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/search-overlay.jsx src/__tests__/search-overlay.test.jsx
git commit -m "Hide visible loading state in search overlay"
```

---

## Task 14: Add coverage + manifest tests

**Files:**
- Create: `src/__tests__/chunk-schema.test.js`
- Create: `src/__tests__/coverage.test.js`
- Create: `src/__tests__/manifest.test.js`

These are the durable invariants the CI / pre-commit must protect.

- [ ] **Step 1: Create `src/__tests__/chunk-schema.test.js`**

```js
import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";

describe("chunks.json schema", () => {
  it("has at least 500 chunks (sanity)", () => {
    expect(chunks.length).toBeGreaterThan(500);
  });

  it("every chunk has the required fields", () => {
    const required = ["id", "chapterId", "chapterTitle", "section", "sectionName", "sub", "kind", "text", "summary", "queries", "terms"];
    for (const c of chunks) {
      for (const f of required) {
        expect(c[f] !== undefined, `chunk ${c.id} missing ${f}`).toBe(true);
      }
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBe(16);
      expect(typeof c.chapterId).toBe("string");
      expect(typeof c.section).toBe("number");
      expect(typeof c.sub).toBe("number");
      expect(["concept", "formula", "example", "diagram", "summary"]).toContain(c.kind);
      expect(c.text.length).toBeGreaterThan(10);
      expect(c.summary.length).toBeGreaterThan(5);
      expect(Array.isArray(c.queries)).toBe(true);
      expect(c.queries.length).toBeGreaterThanOrEqual(5);
      expect(Array.isArray(c.terms)).toBe(true);
      expect(c.terms.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("ids are unique", () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Create `src/__tests__/coverage.test.js`**

```js
import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";
import { chapters } from "../config.js";

describe("search coverage", () => {
  it("every chapter in config (except TOC) has chunks", () => {
    const indexed = new Set(chunks.map((c) => c.chapterId));
    const missing = chapters
      .filter((c) => c.id !== "0" && c.component)
      .map((c) => c.id)
      .filter((id) => !indexed.has(id));
    expect(missing, `missing chapters: ${missing.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 3: Create `src/__tests__/manifest.test.js`**

```js
import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "fs";
import chunks from "../data/chunks.json";

describe("embeddings manifest", () => {
  let manifest;
  let binSize;

  it("loads", () => {
    manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    binSize = statSync("src/data/embeddings.bin").size;
    expect(manifest.dim).toBe(768);
    expect(manifest.modelChecksum.length).toBe(16);
  });

  it("count matches vector array length and bin size", () => {
    expect(manifest.count).toBe(manifest.vectors.length);
    expect(binSize).toBe(manifest.count * manifest.dim);
  });

  it("every chunk id has at least one vector", () => {
    const covered = new Set(manifest.vectors.map((v) => v.chunkId));
    for (const c of chunks) {
      expect(covered.has(c.id), `chunk ${c.id} has no vectors`).toBe(true);
    }
  });

  it("every vector references a real chunk id", () => {
    const known = new Set(chunks.map((c) => c.id));
    for (const v of manifest.vectors) {
      expect(known.has(v.chunkId), `manifest references unknown chunk ${v.chunkId}`).toBe(true);
    }
  });
});
```

- [ ] **Step 4: Run all three**

```bash
npx vitest run src/__tests__/chunk-schema.test.js src/__tests__/coverage.test.js src/__tests__/manifest.test.js
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/chunk-schema.test.js src/__tests__/coverage.test.js src/__tests__/manifest.test.js
git commit -m "Add schema + coverage + manifest invariant tests"
```

---

## Task 15: Run full suite and smoke-test the dev build

- [ ] **Step 1: Full test run with coverage**

```bash
npx vitest run --coverage
```

Expected: all green, total coverage at 100% lines / >=97% branches per CLAUDE.md.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: zero errors.

- [ ] **Step 3: Format**

```bash
npm run format
```

- [ ] **Step 4: Dev server smoke test**

```bash
npm run dev
```

Open `http://localhost:5173/learn-ai/`. Verify:
- Page paints in under 1s on a fresh load.
- Network tab shows: index, react-vendor, toc.js — but no `embeddings.bin`, no `model_q4.onnx`, no `transformers.web.js` until ~1-2 s after the page is idle.
- After idle, those assets begin loading silently.
- Open the search overlay (press `/` or click the search button). No "Loading..." banner appears. Type "HNSW" — text results appear immediately. Wait a few seconds; results visibly upgrade as semantic ranking kicks in.
- Try queries: "HNSW", "RoPE", "softmax temperature", "binary quantization", "vanishing gradient", "scaling laws". Each should put the right chapter in the top 3.

- [ ] **Step 5: Production build**

```bash
npm run build
ls -lh dist/assets/embeddings.bin
ls -lh dist/assets/embeddings-manifest.json
```

Expected:
- `embeddings.bin` ~10-15 MB
- `embeddings-manifest.json` reasonable size (couple MB)
- `model_q4.onnx` is in `dist/models/...` (under `public/`).

- [ ] **Step 6: If everything passed, write the final commit**

```bash
git commit --allow-empty -m "Verify semantic search overhaul ready for deploy"
```

---

## Self-Review Result

**Spec coverage:**
- ✅ Build pipeline (Tasks 1-9)
- ✅ Browser pipeline (Tasks 10-13)
- ✅ Tests for every component (Tasks 2, 3, 4, 5, 6, 10, 11, 12, 13, 14)
- ✅ Pre-commit hook + scripts (Task 7)
- ✅ Defer-to-idle load behavior (Task 12)
- ✅ Invisible loading UI (Task 13)
- ✅ Schema/coverage/manifest invariants (Task 14)
- ✅ Full smoke verification (Task 15)

**Type / name consistency:**
- `chunkSection` (Task 3) ↔ used in Task 4. ✅
- `runBuild` (Task 4) ↔ exported and tested. ✅
- `runEmbed` (Task 5) ↔ exported and tested. ✅
- `prefetchSearch`, `initSearch`, `search`, `searchText`, `getSearchStatus` (Task 11) ↔ used in Tasks 12, 13. ✅
- `getCachedSearchAssets`, `cacheSearchAssets` (Task 10) ↔ used in Task 11. ✅
- Chunk schema fields are identical across Tasks 3, 4, 5, 11, 14. ✅

**Placeholders:** none. All steps include explicit code or commands.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-29-semantic-search-overhaul.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — run tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
