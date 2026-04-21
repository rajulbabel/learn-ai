# Section 10: Modern LLM Techniques Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Section 10 "Modern LLM Techniques" to the learn-ai app: move existing 9.6/9.7 into 10.1/10.2, add new 10.3 (Mixture of Experts) and 10.4 (Thinking).

**Architecture:** One new section file (`modern-llm-techniques.jsx`) exporting two chapter functions. Two existing chapters (KVCache, GroupedQueryAttention) are renumbered via config.js only - their code in `attention-computation.jsx` does not change. Section 9 is renumbered so former 9.8/9.9 become 9.6/9.7.

**Tech Stack:** React 18, Vite, Vitest, @testing-library/react. Inline styles only. No external UI libs. Must follow `.claude/rules/sections.md` visual design rules.

**Spec reference:** `docs/superpowers/specs/2026-04-21-section-10-modern-llm-techniques-design.md` - contains complete sub-step content that the tasks below implement.

---

## Task dependencies and execution order

Tasks 1-4 are the mechanical renumber/move. Tasks 5-12 implement MoE chapter (10.3). Tasks 13-22 implement Thinking chapter (10.4). Task 23 is final verification.

- Tasks 1-4 must run in order (config changes cascade).
- Tasks 5-12 must run in order (one sub-step at a time).
- Tasks 13-22 must run in order.
- Task 23 runs last.

Every task follows TDD: write failing test, run to verify fail, implement, run to verify pass, commit.

---

## File structure

```
NEW:
  src/sections/modern-llm-techniques.jsx           # exports MixtureOfExperts, Thinking

MODIFIED:
  src/config.js                                    # renumber + add section 10
  src/learn-ai.jsx                                 # add section 10 lazy loader
  src/data/svg-descriptions.json                   # rename keys + add new entries
  src/__tests__/config.test.js                     # bump 1-9 check to 1-10
  src/__tests__/lookup.test.js                     # add modern-llm-techniques import
  src/__tests__/sections.test.jsx                  # add modern-llm-techniques import
  src/__tests__/svg-descriptions.test.js           # update expectedChapters
  CLAUDE.md                                        # update mapping tables + tree

UNCHANGED CODE (moved by renumber only):
  src/sections/attention-computation.jsx           # KVCache + GroupedQueryAttention stay verbatim
  src/sections/encoder-decoder-diagrams.jsx        # EncoderDecoderTraining/Inference stay verbatim
```

---

## Phase A: Structure & Move

**Order matters for clean green commits:** Task 1 creates the placeholder file so `MixtureOfExperts` and `Thinking` exist as exported functions. Task 2 then renumbers config.js and adds the Section 10 entries. This order means every commit in Phase A leaves the test suite green.

### Task 1: Create modern-llm-techniques.jsx placeholder and register in test imports

**Files:**
- Create: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/lookup.test.js`
- Modify: `src/__tests__/sections.test.jsx`

The placeholder file is an orphan at this point - no config entry references it. But the test imports pull it in so the lookup object has the two new exports available, ready for Task 2 to wire up.

- [ ] **Step 1.1: Add ModernLLMTechniques import to lookup.test.js**

Open `src/__tests__/lookup.test.js`. After the other `import * as ...` lines (around line 13-14), add:

```js
import * as ModernLLMTechniques from "../sections/modern-llm-techniques.jsx";
```

In the `lookup` object below, spread it at the end: `...ModernLLMTechniques,`.

- [ ] **Step 1.2: Run tests to verify import fails**

Run: `npx vitest run src/__tests__/lookup.test.js`
Expected: FAIL with "Cannot find module '../sections/modern-llm-techniques.jsx'".

- [ ] **Step 1.3: Create the placeholder file**

Create `src/sections/modern-llm-techniques.jsx`:

```jsx
import { Box, T } from "../components.jsx";
import { C } from "../config.js";

export const MixtureOfExperts = () => (
  <Box color={C.purple} style={{ width: "100%" }}>
    <T color={C.purple} bold center size={20}>
      Placeholder - implemented in later tasks
    </T>
  </Box>
);

export const Thinking = () => (
  <Box color={C.cyan} style={{ width: "100%" }}>
    <T color={C.cyan} bold center size={20}>
      Placeholder - implemented in later tasks
    </T>
  </Box>
);
```

Note: signatures are zero-arg for now so lint does not flag unused `ctx`. Task 5 replaces `MixtureOfExperts` with the full `(ctx) => { ... }` form; Task 13 does the same for `Thinking`.

- [ ] **Step 1.4: Add the import to sections.test.jsx**

Open `src/__tests__/sections.test.jsx`. After the last section import (around line 16):

```js
import * as ModernLLMTechniques from "../sections/modern-llm-techniques.jsx";
```

In the `lookup` object, spread it at the end: `...ModernLLMTechniques,`.

- [ ] **Step 1.5: Run full test suite - expect pass**

Run: `npm run test`
Expected: all tests pass. The new file exists and is imported, but no config entry references it yet (so no chapter tries to render it). The orphan import is harmless.

- [ ] **Step 1.6: Commit**

```bash
git add src/sections/modern-llm-techniques.jsx src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Create modern-llm-techniques.jsx placeholder and register in tests"
```

---

### Task 2: Renumber Section 9, add Section 10 entries, update lazy loader

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`
- Modify: `src/learn-ai.jsx`

After Task 1, `MixtureOfExperts` and `Thinking` exist as exports. Now we can reference them from config.js and every test stays green.

- [ ] **Step 2.1: Update config.test.js to bump section range check**

In `src/__tests__/config.test.js`, find the test `"every section (1-9) has a color"` (around line 31-35). Change the loop upper bound from 9 to 10:

```js
it("every section (1-10) has a color", () => {
  for (let i = 1; i <= 10; i++) {
    expect(sectionColors[i]).toBeDefined();
  }
});
```

- [ ] **Step 2.2: Run the config tests - expect failure**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: the updated "every section (1-10) has a color" test FAILS because `sectionColors[10]` is undefined.

- [ ] **Step 2.3: Update config.js**

Edit `src/config.js`:

(a) In the `chapters` array, find and DELETE the two lines for the old `9.6` KVCache and old `9.7` GroupedQueryAttention entries (lines 119-125 in current file).

(b) In the same array, change old `9.8` to `9.6`, and old `9.9` to `9.7`:

```js
  { id: "9.6", title: "Encoder-Decoder: The Training Flow", section: 9, component: "EncoderDecoderTraining" },
  { id: "9.7", title: "Encoder-Decoder: The Inference Flow", section: 9, component: "EncoderDecoderInference" },
```

(c) Append four new entries AFTER the last section-9 entry:

```js
  // Section 10: Modern LLM Techniques
  { id: "10.1", title: "KV Cache - Why Inference is Fast", section: 10, component: "KVCache" },
  {
    id: "10.2",
    title: "Grouped-Query Attention - Shrinking the KV Cache",
    section: 10,
    component: "GroupedQueryAttention",
  },
  { id: "10.3", title: "Mixture of Experts - Bigger Model, Same Compute", section: 10, component: "MixtureOfExperts" },
  { id: "10.4", title: "Thinking - How Reasoning Models Work", section: 10, component: "Thinking" },
```

(d) In the `sectionNames` object, add:

```js
  10: "Modern LLM Techniques",
```

(e) In the `sectionColors` object, add:

```js
  10: "#26a69a",
```

- [ ] **Step 2.4: Update learn-ai.jsx with section 10 lazy loader**

Open `src/learn-ai.jsx`. In the `sectionLoaders` object (around lines 8-31), add section 10 as the last entry:

```js
  10: () =>
    Promise.all([
      import("./sections/attention-computation.jsx"),
      import("./sections/modern-llm-techniques.jsx"),
    ]).then((mods) => Object.assign({}, ...mods)),
```

Section 10 needs both files loaded together because `KVCache` and `GroupedQueryAttention` live in `attention-computation.jsx`, while `MixtureOfExperts` and `Thinking` live in `modern-llm-techniques.jsx`.

- [ ] **Step 2.5: Run full test suite - expect pass**

Run: `npm run test`
Expected: all tests pass.
- `config.test.js`: Section 10 has a color; chapter IDs are sequential (9.1-9.7, 10.1-10.4).
- `lookup.test.js`: every chapter component resolves (placeholders for MoE/Thinking; existing for KVCache/GQA).
- `sections.test.jsx`: all chapters render at every sub level (placeholders render a single Box with no Continue button; existing chapters unchanged).
- `svg-descriptions.test.js`: NOT expected to pass yet - the `9.8` expected key no longer exists in config. That is fixed in Task 3.

If `svg-descriptions.test.js` is the only failing file, proceed. If anything else fails, stop and investigate.

- [ ] **Step 2.6: Commit**

```bash
git add src/config.js src/__tests__/config.test.js src/learn-ai.jsx
git commit -m "Renumber section 9 and add section 10 entries"
```

---

### Task 3: Update svg-descriptions.json keys + test expectations

**Files:**
- Modify: `src/data/svg-descriptions.json`
- Modify: `src/__tests__/svg-descriptions.test.js`

Background: `svg-descriptions.json` currently has three keys in the 9.x range:
- `"9.6"` - contains descriptions for KVCache visuals (correct for current 9.6)
- `"9.7"` - actually contains a description for the **encoder-decoder training flow** (which is chapter 9.8's content, not GQA). This is a pre-existing mismatch.
- `"9.8"` - actually contains a description for the **encoder-decoder inference flow** (which is chapter 9.9's content). Also a pre-existing mismatch.

After renumber, the correct mapping becomes:
- `"9.6"` (KVCache descriptions) → rename to `"10.1"`
- `"9.7"` (training flow description) → rename to `"9.6"` (matches new chapter 9.6 "Encoder-Decoder: The Training Flow")
- `"9.8"` (inference flow description) → rename to `"9.7"` (matches new chapter 9.7 "Encoder-Decoder: The Inference Flow")

This renaming fixes the pre-existing drift as a side effect. GQA (new 10.2) does not need an entry - it uses styled divs, not SVGs.

- [ ] **Step 3.1: Update svg-descriptions.test.js expectedChapters**

Open `src/__tests__/svg-descriptions.test.js`. In the `expectedChapters` array (around lines 30-60), replace `"9.6"`, `"9.7"`, `"9.8"` entries with the new chapter IDs. The final list (preserving existing 1.x-9.3 entries) should be:

```js
const expectedChapters = [
  "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8",
  "1.10", "1.11", "1.12", "1.13", "1.19", "1.23", "1.25", "1.26",
  "2.3", "2.5",
  "5.1", "5.8", "5.9",
  "7.4", "7.15",
  "8.3", "8.6",
  "9.3",
  "9.6",   // was 9.8 EncoderDecoderTraining
  "9.7",   // was 9.9 EncoderDecoderInference
  "10.1",  // was 9.6 KVCache
];
```

- [ ] **Step 3.2: Run the tests - expect failure**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js`
Expected: FAIL on `"10.1"` (no such key yet) and/or the existing 9.7/9.8 entries being tested under keys that still point to old content.

- [ ] **Step 3.3: Rename keys in svg-descriptions.json**

Open `src/data/svg-descriptions.json`. Perform three key renames (the descriptions themselves stay identical):

- Find the top-level key `"9.6"` (KVCache descriptions). Rename to `"10.1"`.
- Find the top-level key `"9.7"` (training flow description). Rename to `"9.6"`.
- Find the top-level key `"9.8"` (inference flow description). Rename to `"9.7"`.

Keep the keys in ascending numeric order after renaming. Do not change any description text.

- [ ] **Step 3.4: Run the tests - expect pass**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js`
Expected: all 4 describe blocks pass.

- [ ] **Step 3.5: Run full suite**

Run: `npm run test`
Expected: all tests pass. (Placeholder MoE and Thinking chapters render at any sub level without throwing.)

- [ ] **Step 3.6: Commit**

```bash
git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
git commit -m "Rename svg-descriptions keys for section 9/10 renumber"
```

---

### Task 4: Update CLAUDE.md mapping tables

**Files:**
- Modify: `CLAUDE.md`

No tests required - documentation only.

- [ ] **Step 4.1: Update the Section 9 mapping table**

In `CLAUDE.md`, find the "Section 9: The Decoder" mapping table. Remove rows for `9.6 KVCache` and `9.7 GroupedQueryAttention`. Renumber the remaining entries: `9.8 EncoderDecoderTraining` → `9.6`; `9.9 EncoderDecoderInference` → `9.7`. Update the section header file-list line if needed:

The line currently reads:
> **Section 9: The Decoder** (`road-to-transformers.jsx` + `attention-computation.jsx` + `transformer-input.jsx` + `encoder-decoder-diagrams.jsx`)

It still needs attention-computation.jsx because CausalMask and CrossAttention still live there, so leave the header line unchanged.

- [ ] **Step 4.2: Add Section 10 mapping table**

After the updated Section 9 table, add:

```markdown
**Section 10: Modern LLM Techniques** (`attention-computation.jsx` + `modern-llm-techniques.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 10.1 | KVCache | KV Cache - Why Inference is Fast |
| 10.2 | GroupedQueryAttention | Grouped-Query Attention - Shrinking the KV Cache |
| 10.3 | MixtureOfExperts | Mixture of Experts - Bigger Model, Same Compute |
| 10.4 | Thinking | Thinking - How Reasoning Models Work |
```

- [ ] **Step 4.3: Update the Project Structure tree**

Find the `src/sections/` listing. Add a line for `modern-llm-techniques.jsx` in the correct alphabetical/logical place:

```
│       ├── transformer-block.jsx        # Section 8 (Add&Norm, FFN, block repeats)
│       ├── encoder-decoder-diagrams.jsx # Section 9 (Training/Inference flow diagrams)
│       └── modern-llm-techniques.jsx    # Section 10 (MoE, Thinking)
```

(Adjust tree characters so the last item uses `└──`.)

- [ ] **Step 4.4: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md for section 9 renumber and section 10 addition"
```

---

## Phase B: MixtureOfExperts chapter (10.3)

**Running example:** token "cat" from the sentence "I love cats".

Each task below implements one sub-step. The file being modified is always `src/sections/modern-llm-techniques.jsx`. Reference spec sub-step content in `docs/superpowers/specs/2026-04-21-section-10-modern-llm-techniques-design.md` section "Chapter 10.3: MixtureOfExperts".

After each task, visual check: run `npm run dev` and manually navigate to chapter 10.3 to verify the rendered result looks right. Verify no em-dashes; Box titles use `center` prop; standalone formulas use `textAlign: "center"`.

**Pattern for each task:** Add one sub-step, bump the SubBtn upper bound, write a test asserting specific text appears at that sub level, commit.

**Final SubBtn guard for MoE** is `{sub < 7 && <SubBtn ... />}` after all 8 sub-steps are added (sub 0 through sub 7).

### Task 5: MoE Sub 0 - Motivation

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx` - replace the `MixtureOfExperts` placeholder
- Modify: `src/__tests__/sections.test.jsx` - add content-specific test

- [ ] **Step 5.1: Write the content-specific test**

Open `src/__tests__/sections.test.jsx`. After the generic loop test block (around line 91), add a new `describe` block:

```jsx
describe("MixtureOfExperts content", () => {
  const fn = ModernLLMTechniques.MixtureOfExperts;

  it("sub=0 shows motivation comparing dense vs MoE", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/47B/);
    expect(container.textContent).toMatch(/13B/);
    expect(container.textContent).toMatch(/Mixtral/);
  });
});
```

- [ ] **Step 5.2: Run the test - expect failure**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "MixtureOfExperts content"`
Expected: FAIL - placeholder does not contain "47B".

- [ ] **Step 5.3: Replace MixtureOfExperts placeholder with Sub 0 content**

In `src/sections/modern-llm-techniques.jsx`, replace the `MixtureOfExperts` function with this:

```jsx
export const MixtureOfExperts = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The problem - more brain, same effort per token
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Training a bigger model means more knowledge, but every token pays the full compute cost. What if most of
            the brain could nap while the relevant part does the work?
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={18}>
                Dense 47B model
              </T>
              <T color="#ef9a9a" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.red} bold center size={22} style={{ marginTop: 2 }}>
                47B (all of it)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Every FFN, every attention head, every layer fires for every token.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={18}>
                MoE model (Mixtral 8x7B)
              </T>
              <T color="#80e8a5" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.green} bold center size={22} style={{ marginTop: 2 }}>
                ~13B (only 2 of 8 experts)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Same 47B total capacity loaded in memory, but only a slice runs per token.
              </T>
            </div>
          </div>
        </Box>
      )}
      {sub < 7 && (
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

- [ ] **Step 5.4: Run the test - expect pass**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "MixtureOfExperts content"`
Expected: PASS.

- [ ] **Step 5.5: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 5.6: Commit**

```bash
git add src/sections/modern-llm-techniques.jsx src/__tests__/sections.test.jsx
git commit -m "MoE sub 0 - motivation (dense vs MoE)"
```

---

### Task 6: MoE Sub 1 - The core swap

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 6.1: Append a test for sub=1**

In `src/__tests__/sections.test.jsx`, inside the `describe("MixtureOfExperts content", ...)` block, add:

```jsx
  it("sub=1 shows FFN replacement with router + experts", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/Router/);
    expect(container.textContent).toMatch(/FFN/);
  });
```

- [ ] **Step 6.2: Run test - expect failure**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=1"`
Expected: FAIL.

- [ ] **Step 6.3: Add Sub 1 Reveal after Sub 0 in MixtureOfExperts**

In `modern-llm-techniques.jsx`, after the `{sub >= 0 && ...}` block and before the SubBtn, add:

```jsx
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Replace one FFN with a router + N expert FFNs
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.dim}06`,
                border: `1px solid ${C.dim}12`,
              }}
            >
              <T color={C.mid} bold center size={17}>
                Before: standard transformer block
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                LayerNorm -&gt; Attention -&gt; Add
                <br />
                LayerNorm -&gt; <strong style={{ color: C.bright }}>FFN</strong> -&gt; Add
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={17}>
                After: MoE block
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                LayerNorm -&gt; Attention -&gt; Add
                <br />
                LayerNorm -&gt; <strong style={{ color: C.cyan }}>[Router -&gt; top-k experts -&gt; weighted sum]</strong> -&gt; Add
              </T>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Each "expert" is just a copy of the FFN architecture (two matrices, an activation). 8 experts means 8
            independent sets of FFN weights. The router is a tiny linear layer that decides which experts to invoke.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 6.4: Run tests - expect pass**

Run: `npm run test`

- [ ] **Step 6.5: Commit**

```bash
git add src/sections/modern-llm-techniques.jsx src/__tests__/sections.test.jsx
git commit -m "MoE sub 1 - FFN replaced by router + experts"
```

---

### Task 7: MoE Sub 2 - Top-k routing

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 7.1: Add test for sub=2**

```jsx
  it("sub=2 shows top-k routing with concrete example", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cat/);
    expect(container.textContent).toMatch(/0\.80/);
    expect(container.textContent).toMatch(/top-2|top 2/);
  });
```

- [ ] **Step 7.2: Run test - expect fail**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=2"`

- [ ] **Step 7.3: Add Sub 2 Reveal**

After the sub=1 Reveal, add:

```jsx
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Each token picks its top 2 experts
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            The router is a tiny linear layer. For each token, it produces one score per expert, applies softmax, and
            picks the top-2 highest.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Token = "cat" (from "I love cats")
            <br />
            router_scores = softmax(cat . W_router)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;= [0.03, 0.02, <strong style={{ color: C.green }}>0.80</strong>, 0.01, 0.04,{" "}
            <strong style={{ color: C.green }}>0.05</strong>, 0.02, 0.03]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E1&nbsp;&nbsp;&nbsp;E2&nbsp;&nbsp;&nbsp;
            <strong style={{ color: C.green }}>E3</strong>&nbsp;&nbsp;&nbsp;E4&nbsp;&nbsp;&nbsp;E5&nbsp;&nbsp;&nbsp;
            <strong style={{ color: C.green }}>E6</strong>&nbsp;&nbsp;&nbsp;E7&nbsp;&nbsp;&nbsp;E8
            <br />
            <br />
            top-2 picks: <strong style={{ color: C.green }}>E3 (0.80)</strong> and{" "}
            <strong style={{ color: C.green }}>E6 (0.05)</strong>
            <br />
            normalize: E3 = 0.80 / 0.85 = 0.94
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E6 = 0.05 / 0.85 = 0.06
            <br />
            <br />
            output = 0.94 . E3("cat") + 0.06 . E6("cat")
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            The router matrix <code>W_router</code> has shape d_model x num_experts (e.g., 4096 x 8 = 32K params).
            Negligible cost compared to an expert's ~650M params.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 7.4: Run tests**

Run: `npm run test`
Expected: pass.

- [ ] **Step 7.5: Commit**

```bash
git add -A
git commit -m "MoE sub 2 - top-k routing with worked example"
```

---

### Task 8: MoE Sub 3 - Load balancing

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 8.1: Add test for sub=3**

```jsx
  it("sub=3 shows load balancing problem and auxiliary loss fix", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/L_aux|auxiliary/);
    expect(container.textContent).toMatch(/balanc/i);
  });
```

- [ ] **Step 8.2: Run test - expect fail**

- [ ] **Step 8.3: Add Sub 3 Reveal**

After the sub=2 Reveal, add:

```jsx
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Without a fix, one expert hogs everything
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Early in training the router has no reason to spread load. It often collapses to sending almost every token
            to one "lucky" expert - the others never get gradient updates and go unused.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Without load balancing",
                color: C.red,
                lighter: "#ef9a9a",
                bars: [
                  { label: "E1", pct: 2 },
                  { label: "E2", pct: 1 },
                  { label: "E3", pct: 92 },
                  { label: "E4", pct: 1 },
                  { label: "E5", pct: 1 },
                  { label: "E6", pct: 1 },
                  { label: "E7", pct: 1 },
                  { label: "E8", pct: 1 },
                ],
              },
              {
                title: "With auxiliary loss",
                color: C.green,
                lighter: "#80e8a5",
                bars: [
                  { label: "E1", pct: 12 },
                  { label: "E2", pct: 13 },
                  { label: "E3", pct: 13 },
                  { label: "E4", pct: 12 },
                  { label: "E5", pct: 12 },
                  { label: "E6", pct: 13 },
                  { label: "E7", pct: 13 },
                  { label: "E8", pct: 12 },
                ],
              },
            ].map(({ title, color, lighter, bars }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={lighter} bold center size={16}>
                  {title}
                </T>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {bars.map((b) => (
                    <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <T color={C.dim} size={13} style={{ minWidth: 26 }}>
                        {b.label}
                      </T>
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div style={{ width: `${b.pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                      <T color={C.dim} size={13} style={{ minWidth: 34, textAlign: "right" }}>
                        {b.pct}%
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 18,
              color: C.bright,
            }}
          >
            L_aux = &alpha; . N . &Sigma; (f_i . P_i)
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 8 }}>
            f_i = fraction of tokens routed to expert i; P_i = total router probability mass sent to expert i. Product
            is minimized when routing is balanced. The auxiliary loss is added to the main training loss.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 8.4: Run tests**

- [ ] **Step 8.5: Commit**

```bash
git add -A
git commit -m "MoE sub 3 - load balancing with auxiliary loss"
```

---

### Task 9: MoE Sub 4 - Parameter math

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 9.1: Add test for sub=4**

```jsx
  it("sub=4 shows Mixtral 8x7B parameter breakdown", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/46\.7B|46\.7/);
    expect(container.textContent).toMatch(/layers?/i);
  });
```

- [ ] **Step 9.2: Run test - expect fail**

- [ ] **Step 9.3: Add Sub 4 Reveal**

After the sub=3 Reveal, add:

```jsx
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Why it is called 8x7B but totals 47B, not 56B
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Attention is shared (not duplicated per expert). Only the FFN is replaced by experts. So 8 experts of ~7B
            FFN-size each do not multiply to 56B - most of each "7B" is the shared attention.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Per layer:
            <br />
            &nbsp;&nbsp;Attention block:&nbsp;&nbsp;&nbsp;~350M
            <br />
            &nbsp;&nbsp;8 experts x ~650M:&nbsp;~5.2B
            <br />
            &nbsp;&nbsp;Router + norms:&nbsp;&nbsp;&nbsp;~50K (negligible)
            <br />
            &nbsp;&nbsp;-----------------------
            <br />
            &nbsp;&nbsp;Per layer total:&nbsp;&nbsp;&nbsp;~5.6B
            <br />
            <br />
            x 32 layers + shared embeddings = <strong style={{ color: C.orange }}>46.7B total</strong>
            <br />
            <br />
            <strong style={{ color: C.green }}>Active per token:</strong>
            <br />
            &nbsp;&nbsp;Attention:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;350M
            <br />
            &nbsp;&nbsp;2 of 8 experts:&nbsp;&nbsp;1.3B per layer
            <br />
            &nbsp;&nbsp;x 32 layers + embeddings = <strong style={{ color: C.green }}>~13B active</strong>
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            The "8x7B" name is marketing-ish. It hints at "8 experts, 7B-class model." The literal total is 47B because
            attention is shared across all experts (not replicated eight times).
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 9.4: Run tests**

- [ ] **Step 9.5: Commit**

```bash
git add -A
git commit -m "MoE sub 4 - parameter math for Mixtral 8x7B"
```

---

### Task 10: MoE Sub 5 - Memory vs compute tradeoff

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 10.1: Add test for sub=5**

```jsx
  it("sub=5 shows memory vs compute tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/94 GB|94GB/);
    expect(container.textContent).toMatch(/26 GFLOPs|GFLOP/);
  });
```

- [ ] **Step 10.2: Run test - expect fail**

- [ ] **Step 10.3: Add Sub 5 Reveal**

After the sub=4 Reveal, add:

```jsx
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory holds all experts. Compute only runs two.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            This is the core tradeoff. MoE does NOT reduce memory - every expert has to be loaded so the router can
            pick any of them. What it reduces is compute per token.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "GPU memory (fp16)",
                value: "94 GB",
                formula: "47B x 2 bytes per param",
                note: "All 8 experts must be loaded - the router could pick any.",
                color: C.red,
                lighter: "#ef9a9a",
              },
              {
                label: "Compute per token",
                value: "26 GFLOPs",
                formula: "13B x 2 (fwd-pass cost per param)",
                note: "Only 2 of 8 experts actually multiply anything for this token.",
                color: C.green,
                lighter: "#80e8a5",
              },
            ].map(({ label, value, formula, note, color, lighter }) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <T color={lighter} bold size={17}>
                    {label}
                  </T>
                  <T color={color} bold size={20}>
                    {value}
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {formula}
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={15} style={{ marginTop: 10 }}>
            Takeaway: MoE is great for data-center serving where memory is abundant but compute is precious. It
            struggles on edge devices where memory is the bottleneck.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 10.4: Run tests**

- [ ] **Step 10.5: Commit**

```bash
git add -A
git commit -m "MoE sub 5 - memory vs compute tradeoff"
```

---

### Task 11: MoE Sub 6 - Real examples

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 11.1: Add test for sub=6**

```jsx
  it("sub=6 shows real MoE model examples", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Mixtral/);
    expect(container.textContent).toMatch(/DeepSeek/);
    expect(container.textContent).toMatch(/Qwen/);
  });
```

- [ ] **Step 11.2: Run test - expect fail**

- [ ] **Step 11.3: Add Sub 6 Reveal**

After the sub=5 Reveal, add:

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            MoE models in production
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { model: "Mixtral 8x7B", total: "47B", active: "13B", experts: "8", routing: "top-2" },
              { model: "Mixtral 8x22B", total: "141B", active: "39B", experts: "8", routing: "top-2" },
              { model: "DeepSeek-V3", total: "671B", active: "37B", experts: "256 + 1 shared", routing: "top-8" },
              { model: "Qwen3-Next", total: "80B", active: "3B", experts: "512", routing: "top-10" },
            ].map(({ model, total, active, experts, routing }) => (
              <div
                key={model}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1fr 0.8fr",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                  alignItems: "center",
                }}
              >
                <T color={C.blue} bold size={16}>
                  {model}
                </T>
                <div>
                  <T color={C.dim} size={12}>
                    total
                  </T>
                  <T color={C.bright} bold size={16}>
                    {total}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    active
                  </T>
                  <T color={C.green} bold size={16}>
                    {active}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    experts
                  </T>
                  <T color={C.bright} size={15}>
                    {experts}
                  </T>
                </div>
                <div>
                  <T color={C.dim} size={12}>
                    routing
                  </T>
                  <T color={C.bright} size={15}>
                    {routing}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#80c8ff" style={{ marginTop: 10 }}>
            DeepSeek-V3 is the extreme case - only 5.5% of its 671B params activate per token. That is why it is
            cheap to serve despite being enormous on disk.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 11.4: Run tests**

- [ ] **Step 11.5: Commit**

```bash
git add -A
git commit -m "MoE sub 6 - real production models"
```

---

### Task 12: MoE Sub 7 - When MoE wins

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 12.1: Add test for sub=7**

```jsx
  it("sub=7 shows honest tradeoffs of MoE", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/edge|deployment/i);
    expect(container.textContent).toMatch(/free lunch|tradeoff/i);
  });
```

- [ ] **Step 12.2: Run test - expect fail**

- [ ] **Step 12.3: Add Sub 7 Reveal**

After the sub=6 Reveal, add:

```jsx
      <Reveal when={sub >= 7}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            MoE is not free lunch
          </T>
          <T color="#f0a0ff" style={{ marginTop: 8 }}>
            Different deployments have different bottlenecks. MoE trades memory for compute - that wins in some
            contexts and loses in others.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                Wins
              </T>
              <ul style={{ color: "#80e8a5", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Large-scale data-center training</li>
                <li>High-throughput serving (many users at once)</li>
                <li>Compute-constrained + memory-rich settings</li>
                <li>When model capacity matters more than latency</li>
              </ul>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                Struggles
              </T>
              <ul style={{ color: "#ef9a9a", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Edge and on-device deployment</li>
                <li>Small-batch single-user inference</li>
                <li>Memory-constrained environments</li>
                <li>Latency-critical apps (the router adds hops)</li>
              </ul>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold size={17}>
              If you can afford the memory to hold a huge model but not the compute to run it, MoE is the answer.
            </T>
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 12.4: Run tests**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 12.5: Commit**

```bash
git add -A
git commit -m "MoE sub 7 - when MoE wins, honest tradeoffs"
```

---

## Phase C: Thinking chapter (10.4)

**Running example:** `23 x 47`, known answer `1081`.

Each task below implements one sub-step of the `Thinking` function in `src/sections/modern-llm-techniques.jsx`. Reference spec section "Chapter 10.4: Thinking" for exact content for each sub-step. The SubBtn guard after all subs are added is `{sub < 9 && <SubBtn ... />}` (sub 0 through sub 9 = 10 sub-steps).

For each task: append test, run to verify fail, add the Reveal block or initial {sub >= 0} block, run to verify pass, commit.

### Task 13: Thinking Sub 0 - Before/after demo

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx` (replace `Thinking` placeholder)
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 13.1: Add test describe block for Thinking content**

After the MixtureOfExperts content describe block, append:

```jsx
describe("Thinking content", () => {
  const fn = ModernLLMTechniques.Thinking;

  it("sub=0 shows before/after comparison with 23 x 47", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/23/);
    expect(container.textContent).toMatch(/47/);
    expect(container.textContent).toMatch(/1081/);
  });
});
```

- [ ] **Step 13.2: Run test - expect fail**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "Thinking content"`

- [ ] **Step 13.3: Replace Thinking placeholder with Sub 0 content**

In `modern-llm-techniques.jsx`, replace the entire `Thinking` function with:

```jsx
export const Thinking = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A regular LLM vs a reasoning LLM on the same problem
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 6 }}>
            Prompt: "What is 23 x 47?"
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                Regular LLM
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: C.bright,
                  textAlign: "center",
                }}
              >
                1081
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                ~3 tokens. Fast. No guarantee it is right.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                Reasoning LLM
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 6,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: C.bright,
                  lineHeight: 1.7,
                }}
              >
                &lt;think&gt;
                <br />
                &nbsp;Let me compute. 23 x 47 = 23 x (50 - 3)
                <br />
                &nbsp;= 1150 - 69 = 1081.
                <br />
                &nbsp;Verify: 20 x 47 + 3 x 47 = 940 + 141 = 1081 OK
                <br />
                &lt;/think&gt;
                <br />
                <strong style={{ color: C.green }}>1081</strong>
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                ~120 tokens. Slower. Shows its work.
              </T>
            </div>
          </div>
          <T color="#80deea" center size={17} style={{ marginTop: 10, fontStyle: "italic" }}>
            The answer is the same. The process is what changed.
          </T>
        </Box>
      )}
      {sub < 9 && (
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

- [ ] **Step 13.4: Run tests - expect pass**

- [ ] **Step 13.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 0 - before/after demo on 23 x 47"
```

---

### Task 14: Thinking Sub 1 - Same architecture checklist

**Files:**
- Modify: `src/sections/modern-llm-techniques.jsx`
- Modify: `src/__tests__/sections.test.jsx`

- [ ] **Step 14.1: Add test for sub=1**

```jsx
  it("sub=1 shows unchanged-architecture checklist", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/unchanged|Every piece/i);
    expect(container.textContent).toMatch(/Tokenizer/);
    expect(container.textContent).toMatch(/Attention/);
  });
```

- [ ] **Step 14.2: Run test - expect fail**

- [ ] **Step 14.3: Add Sub 1 Reveal**

After the `{sub >= 0 && ...}` block in Thinking, insert:

```jsx
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Every piece you learned in Sections 1-9 is unchanged
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            A reasoning model is the exact same transformer. Nothing new is added to the architecture. The punchline is
            simple: a regular LLM and a reasoning LLM could share the same code file.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            {[
              "Tokenizer",
              "Multi-head attention",
              "Embeddings",
              "FFN",
              "Positional encoding (RoPE)",
              "Layer norms",
              "Causal mask",
              "Residual connections",
              "KV cache",
              "Output head",
              "Softmax",
              "Autoregressive loop",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <T color={C.green} bold size={16}>
                  OK
                </T>
                <T color={C.bright} size={15}>
                  {item}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A reasoning model and a regular LLM could share the same code file.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 14.4: Run tests**

- [ ] **Step 14.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 1 - unchanged architecture checklist"
```

---

### Task 15: Thinking Sub 2 - Loop clarifier

- [ ] **Step 15.1: Add test for sub=2**

```jsx
  it("sub=2 clarifies that both modes loop", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop/i);
    expect(container.textContent).toMatch(/same loop|more.*loop|longer/i);
  });
```

- [ ] **Step 15.2: Run - expect fail**

- [ ] **Step 15.3: Add Sub 2 Reveal**

```jsx
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Not a new loop. The same loop, running longer.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Autoregressive generation always loops - the transformer can only produce one token per forward pass.
            Regular LLMs loop a few times. Reasoning LLMs loop thousands of times. Same mechanism either way.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Regular LLM",
                color: C.red,
                lighter: "#ef9a9a",
                steps: ["FWD -> 10", "FWD -> 81", "FWD -> <EOS>"],
                total: "~3 loop iterations",
              },
              {
                title: "Reasoning LLM",
                color: C.green,
                lighter: "#80e8a5",
                steps: ["FWD -> <think>", "FWD -> Let", "FWD -> me", "...", "FWD -> </think>", "FWD -> 1081"],
                total: "~120 loop iterations",
              },
            ].map(({ title, color, lighter, steps, total }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={lighter} bold center size={16}>
                  {title}
                </T>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {steps.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 4,
                        background: "rgba(0,0,0,0.25)",
                        fontFamily: "monospace",
                        fontSize: 14,
                        color: C.bright,
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <T color={lighter} bold size={15} center style={{ marginTop: 10 }}>
                  {total}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 15.4: Run tests**

- [ ] **Step 15.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 2 - loop clarifier"
```

---

### Task 16: Thinking Sub 3 - The think tokens

- [ ] **Step 16.1: Add test for sub=3**

```jsx
  it("sub=3 shows how think/</think> tokens work", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/think/);
    expect(container.textContent).toMatch(/probabilit/i);
  });
```

- [ ] **Step 16.2: Run - expect fail**

- [ ] **Step 16.3: Add Sub 3 Reveal**

```jsx
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            How the model switches between thinking and answering
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            There is no "thinking mode switch" in the code. The vocabulary has two special tokens: &lt;think&gt; and
            &lt;/think&gt;. The model learned to emit them at the right moments, same way it learned any other word.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                caption: "After 'User: What is 23 x 47? Assistant:'",
                rows: [
                  { token: "<think>", prob: 0.87, winner: true },
                  { token: "1081", prob: 0.03 },
                  { token: "The", prob: 0.02 },
                ],
              },
              {
                caption: "Inside thinking, after '... = 1081 OK'",
                rows: [
                  { token: "</think>", prob: 0.62, winner: true },
                  { token: "Let", prob: 0.09 },
                  { token: "Also", prob: 0.07 },
                ],
              },
            ].map(({ caption, rows }, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.dim} size={14} style={{ fontFamily: "monospace" }}>
                  {caption}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {rows.map((r) => (
                    <div
                      key={r.token}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr 60px",
                        gap: 10,
                        alignItems: "center",
                        padding: "6px 10px",
                        borderRadius: 4,
                        background: r.winner ? `${C.green}06` : "rgba(0,0,0,0.2)",
                      }}
                    >
                      <T color={r.winner ? C.green : C.bright} bold={r.winner} size={15} style={{ fontFamily: "monospace" }}>
                        {r.token}
                      </T>
                      <div style={{ height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${r.prob * 100}%`,
                            height: "100%",
                            background: r.winner ? C.green : C.mid,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <T color={C.dim} size={14} style={{ textAlign: "right" }}>
                        {r.prob.toFixed(2)}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The model learned to emit &lt;think&gt; and &lt;/think&gt; at the right moments. That is the entire
            "mode" mechanism.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 16.4: Run tests**

- [ ] **Step 16.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 3 - think tokens via probability distributions"
```

---

### Task 17: Thinking Sub 4 - Test-time compute

- [ ] **Step 17.1: Add test for sub=4**

```jsx
  it("sub=4 shows test-time compute scaling", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/test-time|compute/i);
    expect(container.textContent).toMatch(/100 tokens|100,000/);
  });
```

- [ ] **Step 17.2: Run - expect fail**

- [ ] **Step 17.3: Add Sub 4 Reveal**

```jsx
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            More thinking tokens = better answers on hard problems
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            This is the new scaling axis. Instead of training a bigger model, you let the same model think longer.
            More thinking tokens means more forward passes, which means more compute spent on the problem.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.dim} size={14} center>
              Representative accuracy on hard math vs thinking budget
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { budget: "100 tokens", pct: 30 },
                { budget: "1,000 tokens", pct: 55 },
                { budget: "10,000 tokens", pct: 78 },
                { budget: "100,000 tokens", pct: 89 },
              ].map(({ budget, pct }) => (
                <div key={budget} style={{ display: "grid", gridTemplateColumns: "160px 1fr 60px", gap: 10, alignItems: "center" }}>
                  <T color={C.bright} size={15} style={{ fontFamily: "monospace" }}>
                    {budget}
                  </T>
                  <div style={{ height: 16, background: "rgba(255,255,255,0.04)", borderRadius: 4 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: C.orange, borderRadius: 4 }} />
                  </div>
                  <T color={C.orange} bold size={16} style={{ textAlign: "right" }}>
                    {pct}%
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ffcc80" style={{ marginTop: 10 }}>
            For decades, better AI meant a bigger model. Reasoning models added a second knob: spend more compute at
            inference time instead. This is called <strong>test-time compute</strong> scaling.
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 6 }}>
            (Numbers above are representative of trends across o1/o3/DeepSeek-R1 benchmarks, not a single published
            result.)
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 17.4: Run tests**

- [ ] **Step 17.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 4 - test-time compute scaling"
```

---

### Task 18: Thinking Sub 5 - The 3-stage training pipeline

- [ ] **Step 18.1: Add test for sub=5**

```jsx
  it("sub=5 shows 3-stage training pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Pre-training/);
    expect(container.textContent).toMatch(/SFT/);
    expect(container.textContent).toMatch(/RL/);
  });
```

- [ ] **Step 18.2: Run - expect fail**

- [ ] **Step 18.3: Add Sub 5 Reveal**

```jsx
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            What is actually different is the training, not the model
          </T>
          <T color="#f0a0ff" style={{ marginTop: 8 }}>
            Reasoning models go through three training stages. Stage 1 is the same run that every LLM gets. Stages 2
            and 3 are where reasoning emerges.
          </T>
          <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "stretch" }}>
            {[
              {
                stage: "1. Pre-training",
                body: "Predict the next token on trillions of internet tokens.",
                scale: "trillions of tokens",
                color: C.dim,
                highlight: false,
              },
              {
                stage: "2. SFT",
                body: "Fine-tune on curated reasoning traces with <think> tags.",
                scale: "~50K curated examples",
                color: C.orange,
                highlight: false,
              },
              {
                stage: "3. RL with verifier",
                body: "Generate rollouts, reward correct final answers, PPO/GRPO update.",
                scale: "millions of rollouts",
                color: C.pink,
                highlight: true,
              },
            ].map(({ stage, body, scale, color, highlight }, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: highlight ? `${color}10` : `${color}06`,
                  border: `1px solid ${color}${highlight ? "25" : "12"}`,
                }}
              >
                <T color={color} bold center size={17}>
                  {stage}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 8 }}>
                  {body}
                </T>
                <T color={C.dim} size={13} center style={{ marginTop: 8, fontFamily: "monospace" }}>
                  {scale}
                </T>
              </div>
            ))}
          </div>
          <T color="#f0a0ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Stage 1 is identical to a regular LLM. The magic is entirely in stages 2 and 3.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 18.4: Run tests**

- [ ] **Step 18.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 5 - three-stage training pipeline"
```

---

### Task 19: Thinking Sub 6 - RL reward loop

- [ ] **Step 19.1: Add test for sub=6**

```jsx
  it("sub=6 shows RL reward loop with rollouts", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/rollout/i);
    expect(container.textContent).toMatch(/reward|PPO|GRPO/);
  });
```

- [ ] **Step 19.2: Run - expect fail**

- [ ] **Step 19.3: Add Sub 6 Reveal**

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            How reasoning improves, one reward at a time
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            The model generates many rollouts per problem. A verifier checks each final answer. PPO or GRPO nudges
            weights: tokens in winning rollouts become more likely, tokens in losing rollouts less likely.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.bright} bold size={15} center>
              Problem: "23 x 47 = ?" (ground truth 1081). Generate 64 rollouts.
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { n: 1, chain: "... 23 x 50 - 23 x 3 = 1081", answer: "1081", ok: true },
                { n: 2, chain: "... (20 + 3) x 47 = 940 + 141 = 1081", answer: "1081", ok: true },
                { n: 3, chain: "... estimate: roughly 1000", answer: "1000", ok: false },
                { n: 4, chain: "... 23 x 47 = 1081", answer: "1081", ok: true },
                { n: 5, chain: "... quick mental math: 1104?", answer: "1104", ok: false },
              ].map(({ n, chain, answer, ok }) => (
                <div
                  key={n}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 80px 70px",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 4,
                    background: ok ? `${C.green}08` : `${C.red}08`,
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  <T color={C.dim} size={13}>
                    #{n}
                  </T>
                  <T color={C.bright} size={13}>
                    &lt;think&gt;{chain}&lt;/think&gt;
                  </T>
                  <T color={ok ? C.green : C.red} bold size={13}>
                    {answer} {ok ? "OK" : "X"}
                  </T>
                  <T color={ok ? C.green : C.red} bold size={13}>
                    r = {ok ? "+1" : "-1"}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.bright} size={14} center style={{ marginTop: 10, fontFamily: "monospace" }}>
              PPO / GRPO update:
              <br />
              winning rollouts -&gt; token probabilities UP
              <br />
              losing rollouts&nbsp; -&gt; token probabilities DOWN
            </T>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The reward only checks the FINAL answer. The model figures out on its own what kinds of reasoning lead to
            correct answers. Nobody hand-labels reasoning steps.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 19.4: Run tests**

- [ ] **Step 19.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 6 - RL reward loop with concrete rollouts"
```

---

### Task 20: Thinking Sub 7 - Training data sources

- [ ] **Step 20.1: Add test for sub=7**

```jsx
  it("sub=7 shows training data sources", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/checkable|verifiable/i);
    expect(container.textContent).toMatch(/synthetic|rejection/i);
  });
```

- [ ] **Step 20.2: Run - expect fail**

- [ ] **Step 20.3: Add Sub 7 Reveal**

```jsx
      <Reveal when={sub >= 7}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            You do not need humans to write millions of reasoning traces
          </T>
          <T color="#80c8ff" style={{ marginTop: 8 }}>
            The only thing you need is <strong>problems with checkable answers</strong>. Three data sources take care
            of the rest.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                title: "1. Existing chain-of-thought",
                body: "Already in the pre-training data: math textbooks, Stack Overflow answers, competitive programming editorials, tutorial posts.",
              },
              {
                title: "2. Synthetic generation",
                body: "A big LLM generates 64 reasoning attempts per problem. A verifier checks each final answer. Keep the ones that got it right; those become training data.",
              },
              {
                title: "3. Rejection sampling",
                body: "Have the base model itself try each problem 64 times. Keep the attempts that got the right answer. The model learns from its own best work.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                }}
              >
                <T color={C.blue} bold size={16}>
                  {title}
                </T>
                <T color={C.bright} size={15} style={{ marginTop: 4 }}>
                  {body}
                </T>
              </div>
            ))}
          </div>
          <T color="#80c8ff" style={{ marginTop: 10 }}>
            Domains with checkable answers are abundant: GSM8K, MATH, AIME, olympiad problems, LeetCode, Codeforces,
            scientific multiple-choice. Millions of problems, no humans writing reasoning required.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 20.4: Run tests**

- [ ] **Step 20.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 7 - training data sources"
```

---

### Task 21: Thinking Sub 8 - Emergent behaviors

- [ ] **Step 21.1: Add test for sub=8**

```jsx
  it("sub=8 shows emergent behaviors", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/emerg/i);
    expect(container.textContent).toMatch(/self-correct|double-check|verify/i);
  });
```

- [ ] **Step 21.2: Run - expect fail**

- [ ] **Step 21.3: Add Sub 8 Reveal**

```jsx
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The tricks nobody programmed
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Reasoning chains that include self-correction and verification tend to produce correct answers more often.
            The reward signal pushes those patterns up over millions of rollouts. Nobody writes code that says
            "self-correct" - it emerges from the rewards.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              fontFamily: "monospace",
              fontSize: 14,
              color: C.bright,
              lineHeight: 1.8,
            }}
          >
            23 x 47 = 23 x 50 - 23 x 3 = 1150 - 69 = 1081.
            <br />
            <br />
            <span style={{ color: C.yellow }}>Wait, let me double-check.</span>{" "}
            <span style={{ color: C.dim }}>&lt;-- emerged: self-doubt</span>
            <br />
            <br />
            <span style={{ color: C.yellow }}>Try another way:</span> 20 x 47 + 3 x 47 = 940 + 141 = 1081.{" "}
            <span style={{ color: C.dim }}>&lt;-- emerged: verification</span>
            <br />
            <br />
            <span style={{ color: C.yellow }}>Both methods give 1081. Confident.</span>{" "}
            <span style={{ color: C.dim }}>&lt;-- emerged: confidence calibration</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            The DeepSeek-R1 papers documented an <strong>"aha moment"</strong> during training where thinking length
            spontaneously grew and phrases like "wait" and "let me reconsider" appeared - purely from the reward
            signal.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 21.4: Run tests**

- [ ] **Step 21.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 8 - emergent behaviors (aha moment)"
```

---

### Task 22: Thinking Sub 9 - When thinking wins

- [ ] **Step 22.1: Add test for sub=9**

```jsx
  it("sub=9 shows honest scope - where reasoning helps and doesn't", () => {
    const { container } = render(fn(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/Math|code|logic/i);
    expect(container.textContent).toMatch(/creative|empathy|open-ended/i);
  });
```

- [ ] **Step 22.2: Run - expect fail**

- [ ] **Step 22.3: Add Sub 9 Reveal**

```jsx
      <Reveal when={sub >= 9}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Reasoning models are not universally better
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Thinking helps when there is a right answer to check. It barely helps when there is not.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={17}>
                Big lift
              </T>
              <ul style={{ color: "#80e8a5", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Math, arithmetic, algebra</li>
                <li>Competitive programming</li>
                <li>Logic puzzles</li>
                <li>Scientific Q&amp;A with verifiable answers</li>
                <li>Constraint-satisfaction problems</li>
                <li>Formal proofs</li>
              </ul>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={17}>
                No real gain
              </T>
              <ul style={{ color: "#ef9a9a", fontSize: 15, paddingLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
                <li>Creative writing</li>
                <li>Poetry, storytelling</li>
                <li>Open-ended opinions</li>
                <li>Empathy, emotional support</li>
                <li>Summarization</li>
                <li>Casual conversation</li>
              </ul>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={17}>
              Reasoning helps when there is a right answer to check. It barely helps when there is not.
            </T>
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 22.4: Run tests**

- [ ] **Step 22.5: Commit**

```bash
git add -A
git commit -m "Thinking sub 9 - honest scope of where reasoning helps"
```

---

## Phase D: Polish & verification

### Task 23: Add svg-descriptions entries for new chapters, then final verification

**Files:**
- Modify: `src/data/svg-descriptions.json`
- Modify: `src/__tests__/svg-descriptions.test.js`

The new 10.3 and 10.4 chapters use styled divs for their visuals (not `<svg>` elements), so they do not need inline `<desc>` children. But `svg-descriptions.json` also acts as the semantic-search manifest, so adding entries here makes the new chapters searchable.

- [ ] **Step 23.0a: Add search entries for 10.3 and 10.4**

In `src/data/svg-descriptions.json`, add entries in numeric order:

```json
  "10.3": [
    "Side-by-side comparison of a dense 47B model versus a MoE model with 47B total parameters but only 13B active per token",
    "Before and after transformer block diagrams showing the FFN replaced by a router that picks top-k experts and computes a weighted sum",
    "Top-k routing walkthrough with softmax scores over 8 experts selecting experts 3 and 6 for the token cat and normalizing their weights",
    "Expert load histograms comparing unbalanced routing where one expert hogs 92 percent against balanced routing after the auxiliary loss",
    "Parameter math breakdown for Mixtral 8x7B showing per-layer attention expert and router contributions totaling 46.7 billion parameters with 13 billion active per token",
    "Memory versus compute cards showing 94 GB of GPU memory for all experts but only 26 GFLOPs of compute per token",
    "Production MoE model comparison table covering Mixtral 8x7B, Mixtral 8x22B, DeepSeek-V3, and Qwen3-Next with total parameters active parameters expert counts and routing policy",
    "Honest tradeoff cards listing MoE wins (data-center training, high throughput serving) and struggles (edge deployment, single-user low-latency)"
  ],
  "10.4": [
    "Before and after cards for the prompt What is 23 times 47 showing a regular LLM emitting just 1081 and a reasoning LLM emitting a think block with step-by-step calculation before the final answer",
    "Grid checklist of every transformer component (tokenizer, embeddings, positional encoding, attention, FFN, layer norms, residuals, KV cache, output head, softmax, autoregressive loop) each marked unchanged",
    "Side-by-side vertical chains of forward-pass boxes comparing a regular LLM with 3 iterations to a reasoning LLM with 120 iterations",
    "Token probability distributions at two moments showing the think token winning at the start of a reply and the close-think token winning at the end of a reasoning chain",
    "Representative horizontal bar chart showing accuracy climbing with thinking token budget from 30 percent at 100 tokens to 89 percent at 100000 tokens",
    "Three-stage training pipeline with pre-training on trillions of tokens then SFT on 50K reasoning examples then RL with verifier on millions of rollouts",
    "RL reward loop concrete example with 5 rollouts for the problem 23 times 47 showing correct and incorrect attempts with rewards plus one and minus one and the PPO or GRPO weight update rule",
    "Three data source cards for training reasoning models covering existing chain-of-thought in pre-training data, synthetic generation with a verifier filter, and rejection sampling from the model itself",
    "Annotated reasoning trace demonstrating emergent self-correction, verification, and confidence-calibration patterns that arose purely from the reward signal",
    "Two-column honest scope table listing domains where reasoning helps (math, code, logic) and domains where it does not lift quality (creative writing, empathy, casual conversation)"
  ]
```

- [ ] **Step 23.0b: Add 10.3 and 10.4 to expectedChapters in the manifest test**

In `src/__tests__/svg-descriptions.test.js`, extend the `expectedChapters` array from Task 3 to include the new chapters:

```js
const expectedChapters = [
  "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8",
  "1.10", "1.11", "1.12", "1.13", "1.19", "1.23", "1.25", "1.26",
  "2.3", "2.5",
  "5.1", "5.8", "5.9",
  "7.4", "7.15",
  "8.3", "8.6",
  "9.3",
  "9.6",
  "9.7",
  "10.1",
  "10.3",
  "10.4",
];
```

- [ ] **Step 23.0c: Run svg-descriptions tests**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js`
Expected: all 4 describe blocks pass.

- [ ] **Step 23.0d: Commit**

```bash
git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
git commit -m "Add svg-descriptions entries for 10.3 and 10.4"
```

- [ ] **Step 23.1: Run full coverage**

Run: `npx vitest run --coverage`
Expected: lines 100%, branches at or above 97.7%. If coverage has slipped below the target, identify uncovered lines with the coverage report and add tests.

- [ ] **Step 23.2: Run lint**

Run: `npm run lint`
Expected: no errors. If there are unused imports/vars in `modern-llm-techniques.jsx`, remove them.

- [ ] **Step 23.3: Run format**

Run: `npm run format`
Expected: files formatted in place. Check with `git diff` that only whitespace changes.

- [ ] **Step 23.4: Manual visual QA in dev server**

Run: `npm run dev`

Navigate to the app in a browser. For each of 10.1, 10.2, 10.3, 10.4:
- Verify the chapter loads without errors.
- Click "Continue" through every sub-step.
- Confirm Box titles are center-aligned.
- Confirm no em-dashes anywhere.
- Confirm standalone formulas are center-aligned.
- Confirm colors match spec (10.3 uses purple/cyan/green/yellow/orange/red/blue/pink across sub-steps; 10.4 uses cyan/purple/green/yellow/orange/pink/red/blue/purple/green).

Also verify that Section 9 now shows only 9.1-9.7, with 9.6 being "Encoder-Decoder: The Training Flow" and 9.7 being the inference flow.

- [ ] **Step 23.5: Commit any lint/format-only changes**

```bash
git add -A
git commit -m "Lint and format modern-llm-techniques"
```

Only commit if there are actual changes from lint/format; otherwise skip.

- [ ] **Step 23.6: Final test run**

Run: `npm run test`
Expected: all tests pass.

---

## Appendix: Visual design compliance checklist

Before marking implementation complete, confirm each item below against each new sub-step:

- [ ] Every Box title uses the `center` prop on `T`.
- [ ] Every Box uses a named color from `C`, never `C.card`.
- [ ] No em-dashes anywhere in the new content.
- [ ] Standalone formulas and computations are center-aligned (`textAlign: "center"` on the container).
- [ ] Body text 16-19px; titles 20-24px. No sizes below 14px except tiny annotations.
- [ ] Inner tinted containers use `${color}06` background and `1px solid ${color}12` border.
- [ ] No references to "next chapter" or "coming up".
- [ ] Reveal is used for progressive sub-steps (one idea per click).
- [ ] Running examples: "cat" (MoE), `23 x 47` (Thinking).
- [ ] Concrete numbers everywhere, never "some value".

## Appendix: Verification that KVCache and GroupedQueryAttention work at new IDs

After Task 1, `npm run dev` with manual navigation to 10.1 and 10.2 should render KVCache and GroupedQueryAttention verbatim. The only thing that changed is which ID in the TOC resolves to them. If they render broken, the renumber in config.js is wrong.

No code in `attention-computation.jsx` should be modified during this whole plan.
