# Chapter 9.6 (KV Cache) Revamp - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Chapter 9.6 (KV Cache) with a beginner-friendly, visual-first rewrite covering full technical depth, anchored by a new "matrix view" sub that shows geometrically why only the last row of attention is new at each step.

**Architecture:** Single-function rewrite of the `KVCache` export in `src/sections/attention-computation.jsx`. New arc is 9 subs (0-8) with 4 inline SVGs. Tests in `sections.test.jsx` are rewritten to match the new content. Supporting changes: `src/data/svg-descriptions.json` and `src/__tests__/svg-descriptions.test.js` get the new 9.6 entry.

**Tech Stack:** React 18 (functional components, inline styles), Vitest + React Testing Library, Vite build. Shared components from `src/components.jsx`: `Box`, `T`, `Reveal`, `SubBtn`, `Tag`. Colors from `src/config.js` `C` object.

**Spec:** `docs/superpowers/specs/2026-04-21-kvcache-ch96-revamp-design.md`

---

## File Structure

**Files to modify:**
- `src/sections/attention-computation.jsx` - Replace `KVCache` export (currently lines 7563-8835). New body renders 9 subs with inline SVGs.
- `src/__tests__/sections.test.jsx` - Replace `describe("KVCache sub-steps", ...)` block (currently lines 2344-2438) with 9 new `it` tests matching new content.
- `src/data/svg-descriptions.json` - Add `"9.6"` key with an array of 4 descriptions (one per new SVG).
- `src/__tests__/svg-descriptions.test.js` - Add `"9.6"` to the `expectedChapters` array (currently lines 30-59).

**No other files change.** `config.js` chapter entry for 9.6 stays as-is.

---

## Task 1: Add SVG description entries for 9.6

**Files:**
- Modify: `src/data/svg-descriptions.json`
- Modify: `src/__tests__/svg-descriptions.test.js`

- [ ] **Step 1.1: Add the 9.6 manifest entry**

Edit `src/data/svg-descriptions.json`. Insert a new `"9.6"` key between the existing `"9.3"` key and the `"9.7"` key (so ordering stays numeric). The value is an array of 4 strings:

```json
  "9.6": [
    "Three stacked work rows showing naive generation redoing history: step 1 with 1 green new block, step 2 with 1 red redundant block and 1 green new block, step 3 with 2 red redundant blocks and 1 green new block, illustrating how computation piles up quadratically when the KV cache is not used",
    "Side by side attention matrix multiplications at generation step 3: Q times K transpose equals Scores (3 by 3) with rows for I and love dimmed because they were already computed at earlier steps and only the last row for cats glows, and Scores times V equals Output with only the last row highlighted as the new result",
    "Three frame growing notebook diagram showing the K cache and V cache tables appending one row per generation step: after I has 1 row, after love has 2 rows with the older row dimmed, after cats has 3 rows with only the newest row highlighted",
    "Horizontal memory meter filling with gradient showing KV cache memory cost scaling with sequence length, with tick marks at 1024 4096 and 32768 tokens and GB values 2.7 10.7 and 86 for LLaMA 70B sized models"
  ],
```

- [ ] **Step 1.2: Add "9.6" to expectedChapters in the test**

Edit `src/__tests__/svg-descriptions.test.js`. In the `expectedChapters` array (around lines 30-59), insert `"9.6",` between `"9.3"` and `"9.7"`:

```js
      "9.3",
      "9.6",
      "9.7",
```

- [ ] **Step 1.3: Run SVG descriptions tests to verify manifest is valid**

Run: `cd /Users/rajul/learn-ai && npx vitest run src/__tests__/svg-descriptions.test.js`

Expected: all 4 tests pass.

- [ ] **Step 1.4: Commit**

```bash
cd /Users/rajul/learn-ai
git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
git commit -m "Add SVG descriptions for Chapter 9.6 revamp"
```

---

## Task 2: Rewrite KVCache tests

**Files:**
- Modify: `src/__tests__/sections.test.jsx` (lines ~2344-2438)

After this task the test suite will be **red** (tests fail against current impl). Task 3 will bring it back to green. No commit at the end of Task 2.

- [ ] **Step 2.1: Replace the KVCache describe block**

Find the block starting `// ─── Chapter 9.6: KV Cache ───` and `describe("KVCache sub-steps", () => {` (around line 2344) and ending at the closing `});` of that describe (around line 2438).

Replace the entire block with:

```js
// ─── Chapter 9.6: KV Cache ───
describe("KVCache sub-steps", () => {
  const fn = AttentionComputation.KVCache;

  it("sub 0 shows naive generation piling up wasted work on 'I love cats'", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Naive");
    expect(text).toContain("I");
    expect(text).toContain("love");
    expect(text).toContain("cats");
    expect(text.toLowerCase()).toMatch(/wast(e|ed|eful)/);
    // Work-bars SVG: 6 block rects (1+2+3 for three steps)
    const svg = container.querySelector("svg[data-viz='work-bars']");
    expect(svg).toBeTruthy();
    const blocks = svg.querySelectorAll("rect[data-block]");
    expect(blocks.length).toBe(6);
  });

  it("sub 1 shows same input plus same weights equals identical output, both times", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("q_I");
    // Two identical vector values shown side by side
    const matches = text.match(/\[0\.5, 0\.2\]/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(text.toLowerCase()).toContain("identical");
  });

  it("sub 2 shows the matrix view with only the last row highlighted (star sub)", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("last row");
    expect(text).toContain("q_cats");
    // Matrix-view SVG present with <desc>
    const svg = container.querySelector("svg[data-viz='matrix-view']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
    expect(desc.textContent.length).toBeGreaterThan(20);
    // Counter numbers: 18 cells total, 6 needed, 12 wasted
    expect(text).toMatch(/18/);
    expect(text).toMatch(/\b6\b/);
    expect(text).toMatch(/12/);
  });

  it("sub 3 shows Q drop vs K and V cache decision cards", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KV cache");
    expect(text).toContain("Q");
    expect(text).toContain("K");
    expect(text).toContain("V");
    expect(text.toLowerCase()).toMatch(/don't cache|dont cache|never cache|don.t cache/);
    expect(text.toLowerCase()).toContain("cache it");
  });

  it("sub 4 shows the growing-notebook cache frames with append arrows", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("append");
    expect(text.toLowerCase()).toContain("notebook");
    const svg = container.querySelector("svg[data-viz='notebook']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
  });

  it("sub 5 shows before vs after for step 3 with identical output", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Without Cache");
    expect(text).toContain("With Cache");
    expect(text.toLowerCase()).toContain("identical");
    // Must show both columns with q_cats, k_cats, v_cats
    expect(text).toContain("q_cats");
    expect(text).toContain("k_cats");
    expect(text).toContain("v_cats");
  });

  it("sub 6 traces the worked example with d=2 and final output [0.447, 0.603]", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.447");
    expect(text).toContain("0.603");
    expect(text).toContain("d = 2");
    expect(text.toLowerCase()).toContain("cache");
  });

  it("sub 7 shows LLaMA 70B memory cost with 10.7 GB and memory bar SVG", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("LLaMA 70B");
    expect(text).toContain("10.7 GB");
    expect(text).toContain("d_model");
    expect(text).toContain("layers");
    const svg = container.querySelector("svg[data-viz='memory-bar']");
    expect(svg).toBeTruthy();
  });

  it("sub 8 shows the final memory-for-speed tradeoff with 660x numbers", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("memory");
    expect(text.toLowerCase()).toContain("speed");
    expect(text).toMatch(/660/);
  });
});
```

- [ ] **Step 2.2: Run KVCache tests to verify they all fail against current impl**

Run: `cd /Users/rajul/learn-ai && npx vitest run src/__tests__/sections.test.jsx -t "KVCache sub-steps" 2>&1 | tail -30`

Expected: 9 tests, all FAILING. This is the "red" state of TDD - tests written, implementation not yet updated.

**Do NOT commit at the end of Task 2.** Continue directly to Task 3.

---

## Task 3: Rewrite KVCache implementation

**Files:**
- Modify: `src/sections/attention-computation.jsx` (replace the `KVCache` export, currently lines 7563-8835)

This is the big implementation task. Structure:
1. Replace the entire current `KVCache` function body with the new 9-sub structure.
2. Each sub uses existing shared helpers (`inner`, `mono`, `subBtn`) and adds `data-viz` attributes on the 4 new SVGs for test targeting.
3. All the sub content is specified in detail in the spec (`docs/superpowers/specs/2026-04-21-kvcache-ch96-revamp-design.md`). Follow the spec's visuals, colors, frames, numbers, and copy.

Key technical requirements:
- Every `<svg>` MUST start with a `<desc>` child.
- Every `<svg>` that tests target gets a `data-viz="..."` attribute matching the test. Mapping: sub 0 = `work-bars`, sub 2 = `matrix-view`, sub 4 = `notebook`, sub 7 = `memory-bar`.
- No em-dashes anywhere (the chapter's last commit had a sections-rules reminder; respect it).
- Every Box's first `T` element uses `center` prop.
- Colors per sub exactly as spec: 0 cyan, 1 yellow, 2 purple, 3 blue, 4 green, 5 orange, 6 pink, 7 red, 8 cyan. Use the matching lighter-shade text colors the file already uses: cyan `#80deea`, yellow `#fff176`, purple `#b8a9ff`, blue `#90caf9`, green `#a5d6a7`, orange `#ffcc80`, pink `#f48fb1`, red `#ef9a9a`.
- Standalone formula rows: `textAlign: "center"` on container.
- Numeric content from spec (and matching current-chapter correctness): `x_I=[1.0, 0.0]`, `x_love=[0.0, 1.0]`, `x_cats=[0.5, 0.5]`; W_Q=[[0.5,0.1],[0.2,0.6]]; q_I=[0.5,0.2], k_I=[0.3,0.4], v_I=[0.8,0.3]; q_love=[0.1,0.6], k_love=[0.7,0.2], v_love=[0.1,0.9]; q_cats=[0.3,0.4], k_cats=[0.5,0.3], v_cats=[0.45,0.6]; softmax=[0.329,0.338,0.333]; output_cats=[0.447,0.603]. These match the current chapter so regression risk is low.

- [ ] **Step 3.1: Locate and delete the current KVCache function body**

Open `src/sections/attention-computation.jsx`. Find `export const KVCache = (ctx) => {` (line 7563). Delete from that line through the closing `};` around line 8835 (the comment `// ═══════ CH: Why K Transpose? - Making the Shapes Fit ═══════` stays - do NOT delete that or anything after it).

- [ ] **Step 3.2: Add the new KVCache function**

Insert the new implementation at the same location. The structure is:

```jsx
export const KVCache = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const subBtn = (s) =>
    sub === s && (
      <SubBtn
        key={sub}
        onClick={() => {
          setSubBtnRipple(Date.now());
          navigate("forward");
        }}
        rippleKey={subBtnRipple}
        registerSubBtn={registerSubBtn}
      />
    );

  // tinted inner container
  const inner = (color, children, extra = {}) => (
    <div
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        background: `${color}08`,
        border: `1px solid ${color}20`,
        ...extra,
      }}
    >
      {children}
    </div>
  );

  // centered monospace formula row
  const mono = (color, text, size = 14) => (
    <div style={{ textAlign: "center", marginTop: 6 }}>
      <code style={{ color, fontSize: size }}>{text}</code>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0 to Sub 8 below - implement per spec sections, using shapes/colors/data-viz attrs above */}
    </div>
  );
};
```

- [ ] **Step 3.3: Implement Sub 0 - The Problem (Naive Generation Redoes History)**

Inside the returning `<div>`, below the opening comment, add:

```jsx
{/* ── Sub 0: Naive Generation Redoes History ── */}
{sub >= 0 && (
  <Box color={C.cyan} style={{ width: "100%" }}>
    <T color="#80deea" bold center size={20}>
      The Problem - Naive Generation Redoes History
    </T>
    <T color="#80deea" size={16} style={{ marginTop: 8 }}>
      To generate each new word, the naive approach re-processes every previous word from scratch. Watch the
      work pile up across three steps of generating "I love cats":
    </T>

    {inner(
      C.cyan,
      <>
        <T color="#80deea" bold center size={15}>
          Work at each step (green = new, red = redundant)
        </T>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <svg data-viz="work-bars" width="520" height="180" viewBox="0 0 520 180">
            <desc>
              Three stacked work rows showing naive generation redoing history: step 1 with 1 green new block,
              step 2 with 1 red redundant block and 1 green new block, step 3 with 2 red redundant blocks and
              1 green new block, illustrating how computation piles up quadratically when the KV cache is not
              used
            </desc>
            {[
              { y: 10, label: 'Step 1 ("I")', blocks: ["new"] },
              { y: 68, label: 'Step 2 ("love")', blocks: ["red", "new"] },
              { y: 126, label: 'Step 3 ("cats")', blocks: ["red", "red", "new"] },
            ].map(({ y, label, blocks }) => (
              <g key={y}>
                <text x="10" y={y + 30} fill={C.dim} fontSize="14">
                  {label}
                </text>
                {blocks.map((kind, i) => (
                  <rect
                    key={i}
                    data-block={kind}
                    x={150 + i * 56}
                    y={y}
                    width="48"
                    height="44"
                    rx="6"
                    fill={kind === "new" ? `${C.green}` : `${C.red}`}
                    fillOpacity="0.32"
                    stroke={kind === "new" ? C.green : C.red}
                    strokeWidth="1.5"
                  />
                ))}
                {blocks.map((kind, i) => (
                  <text
                    key={`t${i}`}
                    x={150 + i * 56 + 24}
                    y={y + 28}
                    fill={kind === "new" ? C.green : C.red}
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {kind === "new" ? "new" : "redo"}
                  </text>
                ))}
              </g>
            ))}
          </svg>
        </div>
        <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
          Each block = one token's Q, K, V computed. Green blocks are real new work. Red blocks are identical
          to work done in earlier steps.
        </T>
      </>,
    )}

    {inner(
      C.red,
      <>
        <T color="#ef9a9a" bold center size={15}>
          Counting the waste across 3 steps
        </T>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3, textAlign: "center" }}>
          <T color={C.dim} size={14}>
            Total work: 1 + 2 + 3 = <strong style={{ color: "#ef9a9a" }}>6 blocks</strong>
          </T>
          <T color={C.dim} size={14}>
            Actually useful: <strong style={{ color: C.green }}>3 blocks</strong>
          </T>
          <T color="#ef9a9a" size={14} bold>
            Wasted: 3 blocks (50%)
          </T>
        </div>
        <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
          At 1000 tokens: 500,500 blocks of work, only 1000 are useful. 99.8% wasted.
        </T>
      </>,
    )}

    {inner(
      C.orange,
      <>
        <T color="#ffcc80" bold center size={14}>
          Naive generation recomputes identical numbers every step. This chapter shows the one-line fix that
          makes ChatGPT feel instant.
        </T>
      </>,
    )}
  </Box>
)}
{subBtn(0)}
```

- [ ] **Step 3.4: Implement Sub 1 - The Lightbulb (Same Input Same Output)**

Add immediately after `{subBtn(0)}`:

```jsx
{/* ── Sub 1: Same Input Same Output ── */}
<Reveal when={sub >= 1}>
  <Box color={C.yellow} style={{ width: "100%" }}>
    <T color="#fff176" bold center size={20}>
      The Lightbulb - Same Input, Same Output, Always
    </T>
    <T color="#fff176" size={16} style={{ marginTop: 8 }}>
      When step 2 re-processes the token "I", does it get the same numbers as step 1 did? Let's check.
    </T>

    {inner(
      C.yellow,
      <>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}30`,
              minWidth: 200,
              textAlign: "center",
            }}
          >
            <T color="#80deea" bold size={14}>
              Step 1 computed
            </T>
            <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6 }}>
              q_I = W_Q · x_I
            </code>
            <code style={{ color: C.cyan, fontSize: 15, display: "block", marginTop: 4, fontWeight: 700 }}>
              = [0.5, 0.2]
            </code>
          </div>
          <div style={{ fontSize: 32, color: "#fff176", fontWeight: 700 }}>=</div>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}30`,
              minWidth: 200,
              textAlign: "center",
            }}
          >
            <T color="#80deea" bold size={14}>
              Step 2 re-computed
            </T>
            <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6 }}>
              q_I = W_Q · x_I
            </code>
            <code style={{ color: C.cyan, fontSize: 15, display: "block", marginTop: 4, fontWeight: 700 }}>
              = [0.5, 0.2]
            </code>
          </div>
        </div>
        <T color="#fff176" bold center size={15} style={{ marginTop: 10 }}>
          Identical. Every. Single. Time.
        </T>
      </>,
    )}

    {inner(
      C.purple,
      <>
        <T color="#b8a9ff" bold center size={14}>
          Why identical? Because neither input has changed.
        </T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <T color={C.dim} size={14}>
            <strong style={{ color: "#b8a9ff" }}>x_I</strong> (embedding for "I") is frozen: tokens don't
            change their embedding mid-generation.
          </T>
          <T color={C.dim} size={14}>
            <strong style={{ color: "#b8a9ff" }}>W_Q</strong> (weight matrix) is frozen: trained weights
            don't change during inference.
          </T>
          <T color="#b8a9ff" size={14} bold style={{ marginTop: 4 }}>
            Same input · same weights = same output, ALWAYS.
          </T>
        </div>
      </>,
    )}

    {inner(
      C.green,
      <>
        <T color="#a5d6a7" bold center size={15}>
          So stop recomputing. Save the answer the first time. That's a cache.
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(1)}
```

- [ ] **Step 3.5: Implement Sub 2 - The Matrix View (Star Sub)**

Add after `{subBtn(1)}`:

```jsx
{/* ── Sub 2: The Matrix View (Star Sub) ── */}
<Reveal when={sub >= 2}>
  <Box color={C.purple} style={{ width: "100%" }}>
    <T color="#b8a9ff" bold center size={20}>
      The Matrix View - Only the Last Row Is New
    </T>
    <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
      Attention is matrix multiplication. Let's draw the full matmul at step 3 (generating "cats") and see
      which parts of the matrices we actually need.
    </T>

    {inner(
      C.purple,
      <>
        <T color="#b8a9ff" bold center size={15}>
          Q · Kᵀ = Scores, and Scores · V = Output
        </T>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <svg data-viz="matrix-view" width="680" height="360" viewBox="0 0 680 360">
            <desc>
              Side by side attention matrix multiplications at generation step 3: Q times K transpose equals
              Scores (3 by 3) with rows for I and love dimmed because they were already computed at earlier
              steps and only the last row for cats glows, and Scores times V equals Output with only the last
              row highlighted as the new result
            </desc>

            {/* Row A: Q · Kᵀ = Scores */}
            <text x="340" y="16" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
              Scores = Q · Kᵀ
            </text>

            {/* Q matrix */}
            <g transform="translate(20, 28)">
              <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">Q (3×d)</text>
              {[
                { label: "q_I", dim: true },
                { label: "q_love", dim: true },
                { label: "q_cats", dim: false },
              ].map((row, i) => (
                <g key={i}>
                  <rect
                    x="0"
                    y={i * 32}
                    width="100"
                    height="28"
                    rx="4"
                    fill={row.dim ? "#666" : C.purple}
                    fillOpacity={row.dim ? 0.12 : 0.4}
                    stroke={row.dim ? "#666" : C.purple}
                    strokeWidth={row.dim ? 1 : 2}
                  />
                  <text x="50" y={i * 32 + 18} fill={row.dim ? C.dim : "#fff"} fontSize="13" textAnchor="middle" fontWeight={row.dim ? 400 : 700}>
                    {row.label}
                  </text>
                </g>
              ))}
            </g>

            {/* × */}
            <text x="135" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">·</text>

            {/* Kᵀ matrix */}
            <g transform="translate(155, 28)">
              <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">Kᵀ (d×3)</text>
              {["k_I", "k_love", "k_cats"].map((label, i) => (
                <g key={i}>
                  <rect
                    x={i * 68}
                    y="0"
                    width="60"
                    height="92"
                    rx="4"
                    fill={C.blue}
                    fillOpacity="0.3"
                    stroke={C.blue}
                    strokeWidth="1.5"
                  />
                  <text x={i * 68 + 30} y="50" fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                    {label}
                  </text>
                </g>
              ))}
            </g>

            {/* = */}
            <text x="385" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">=</text>

            {/* Scores 3x3 */}
            <g transform="translate(410, 28)">
              <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">Scores (3×3)</text>
              {[0, 1, 2].map((r) => {
                const rowDim = r < 2;
                return (
                  <g key={r}>
                    {[0, 1, 2].map((c) => (
                      <rect
                        key={c}
                        x={c * 90}
                        y={r * 32}
                        width="86"
                        height="28"
                        rx="4"
                        fill={rowDim ? "#444" : "#e040fb"}
                        fillOpacity={rowDim ? 0.1 : 0.5}
                        stroke={rowDim ? "#555" : "#e040fb"}
                        strokeWidth={rowDim ? 1 : 2}
                      />
                    ))}
                    {[0, 1, 2].map((c) => (
                      <text
                        key={`t${c}`}
                        x={c * 90 + 43}
                        y={r * 32 + 18}
                        fill={rowDim ? C.dim : "#fff"}
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {rowDim ? "(already)" : `q_cats·${["k_I", "k_love", "k_cats"][c]}`}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>

            {/* Arrow pointing at last row */}
            <text x="340" y="155" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
              ↑ only this row is new: 3 dot products (not 9)
            </text>

            {/* Row B: Scores · V = Output */}
            <text x="340" y="190" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
              Output = softmax(Scores) · V
            </text>

            {/* Scores (again, compressed) */}
            <g transform="translate(20, 204)">
              <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">Scores (3×3)</text>
              {[0, 1, 2].map((r) => {
                const rowDim = r < 2;
                return (
                  <rect
                    key={r}
                    x="0"
                    y={r * 32}
                    width="100"
                    height="28"
                    rx="4"
                    fill={rowDim ? "#444" : "#e040fb"}
                    fillOpacity={rowDim ? 0.1 : 0.5}
                    stroke={rowDim ? "#555" : "#e040fb"}
                    strokeWidth={rowDim ? 1 : 2}
                  />
                );
              })}
              {["row_I (old)", "row_love (old)", "row_cats (NEW)"].map((label, i) => (
                <text key={i} x="50" y={i * 32 + 18} fill={i < 2 ? C.dim : "#fff"} fontSize="11" textAnchor="middle" fontWeight={i === 2 ? 700 : 400}>
                  {label}
                </text>
              ))}
            </g>

            {/* × */}
            <text x="135" y="250" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">·</text>

            {/* V matrix - all rows bright */}
            <g transform="translate(155, 204)">
              <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">V (3×d)</text>
              {["v_I", "v_love", "v_cats"].map((label, i) => (
                <g key={i}>
                  <rect
                    x="0"
                    y={i * 32}
                    width="200"
                    height="28"
                    rx="4"
                    fill={C.green}
                    fillOpacity="0.3"
                    stroke={C.green}
                    strokeWidth="1.5"
                  />
                  <text x="100" y={i * 32 + 18} fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                    {label} (all needed)
                  </text>
                </g>
              ))}
            </g>

            {/* = */}
            <text x="385" y="250" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">=</text>

            {/* Output 3xd */}
            <g transform="translate(410, 204)">
              <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">Output (3×d)</text>
              {[
                { label: "out_I (old, discarded)", dim: true },
                { label: "out_love (old, discarded)", dim: true },
                { label: "out_cats (the ONLY one we need)", dim: false },
              ].map((row, i) => (
                <g key={i}>
                  <rect
                    x="0"
                    y={i * 32}
                    width="270"
                    height="28"
                    rx="4"
                    fill={row.dim ? "#444" : "#e040fb"}
                    fillOpacity={row.dim ? 0.1 : 0.5}
                    stroke={row.dim ? "#555" : "#e040fb"}
                    strokeWidth={row.dim ? 1 : 2}
                  />
                  <text x="135" y={i * 32 + 18} fill={row.dim ? C.dim : "#fff"} fontSize="12" textAnchor="middle" fontWeight={row.dim ? 400 : 700}>
                    {row.label}
                  </text>
                </g>
              ))}
            </g>

            <text x="340" y="340" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
              ↑ only this row is new: 1 weighted sum (not 3)
            </text>
          </svg>
        </div>
      </>,
    )}

    {inner(
      C.yellow,
      <>
        <T color="#fff176" bold center size={16}>
          Counting cells at step 3
        </T>
        <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Without cache", val: "18 cells", sub: "9 score + 9 output", c: C.red },
            { label: "Actually needed", val: "6 cells", sub: "3 score + 3 output", c: C.green },
            { label: "Wasted", val: "12 cells (66%)", sub: "", c: C.orange },
          ].map((x) => (
            <div
              key={x.label}
              style={{
                padding: 10,
                borderRadius: 8,
                background: `${x.c}10`,
                border: `1px solid ${x.c}30`,
                minWidth: 150,
                textAlign: "center",
              }}
            >
              <T color={x.c} bold size={13}>
                {x.label}
              </T>
              <T color={C.dim} size={16} bold style={{ marginTop: 4 }}>
                {x.val}
              </T>
              {x.sub && (
                <T color={C.dim} size={11} style={{ marginTop: 2 }}>
                  {x.sub}
                </T>
              )}
            </div>
          ))}
        </div>
      </>,
    )}

    {inner(
      C.orange,
      <>
        <T color="#ffcc80" bold center size={14}>
          Cost per step scales as N² without cache. With cache, cost per step stays O(N). Now we just need to
          figure out what to save so we can skip the gray rows.
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(2)}
```

- [ ] **Step 3.6: Implement Sub 3 - What to Save (Q vs K vs V decision cards)**

Add after `{subBtn(2)}`:

```jsx
{/* ── Sub 3: What to Save, What to Throw Away ── */}
<Reveal when={sub >= 3}>
  <Box color={C.blue} style={{ width: "100%" }}>
    <T color="#90caf9" bold center size={20}>
      What to Save, What to Throw Away
    </T>
    <T color="#90caf9" size={16} style={{ marginTop: 8 }}>
      We compute three things per token: Q, K, V. For each, do we need the OLD ones to build the new output
      row?
    </T>

    <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      {[
        {
          name: "Q",
          color: C.purple,
          hex: "#b8a9ff",
          verdict: "Don't cache",
          icon: "✗",
          iconColor: C.red,
          desc: "Only the new query q_cats appears in the new output row's formula. Old queries q_I and q_love are never used again.",
          tag: "dead weight",
        },
        {
          name: "K",
          color: C.blue,
          hex: "#90caf9",
          verdict: "Cache it",
          icon: "✓",
          iconColor: C.green,
          desc: "The new row of Scores = q_new · every old K. Missing one key = missing one attention score.",
          tag: "every old K needed",
        },
        {
          name: "V",
          color: C.green,
          hex: "#a5d6a7",
          verdict: "Cache it",
          icon: "✓",
          iconColor: C.green,
          desc: "The new output row = weighted sum of every old V. Missing one value = losing that token's contribution.",
          tag: "every old V needed",
        },
      ].map(({ name, color, hex, verdict, icon, iconColor, desc, tag }) => (
        <div
          key={name}
          style={{
            flex: "1 1 200px",
            maxWidth: 260,
            padding: 14,
            borderRadius: 10,
            background: `${color}10`,
            border: `2px solid ${color}40`,
            textAlign: "center",
          }}
        >
          <T color={hex} bold center size={22}>
            {name}
          </T>
          <div style={{ fontSize: 48, color: iconColor, fontWeight: 700, lineHeight: 1 }}>{icon}</div>
          <T color={hex} bold size={16} style={{ marginTop: 4 }}>
            {verdict}
          </T>
          <T color={C.dim} size={12} style={{ marginTop: 6 }}>
            {tag}
          </T>
          <T color={C.dim} size={13} style={{ marginTop: 8 }}>
            {desc}
          </T>
        </div>
      ))}
    </div>

    {inner(
      C.yellow,
      <>
        <T color="#fff176" bold center size={16}>
          That is why it is called the <span style={{ color: "#fff176" }}>KV cache</span>.
        </T>
        <T color="#fff176" center size={15} style={{ marginTop: 4 }}>
          We save K and V. Never Q.
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(3)}
```

- [ ] **Step 3.7: Implement Sub 4 - The Growing Notebook (SVG)**

Add after `{subBtn(3)}`:

```jsx
{/* ── Sub 4: The Cache Is a Growing Notebook ── */}
<Reveal when={sub >= 4}>
  <Box color={C.green} style={{ width: "100%" }}>
    <T color="#a5d6a7" bold center size={20}>
      The Cache Is a Growing Notebook
    </T>
    <T color="#a5d6a7" size={16} style={{ marginTop: 8 }}>
      The KV cache is literally two tables that grow by exactly one row at every step. Nothing moves, nothing
      gets recomputed. We just append.
    </T>

    {inner(
      C.green,
      <>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <svg data-viz="notebook" width="720" height="240" viewBox="0 0 720 240">
            <desc>
              Three frame growing notebook diagram showing the K cache and V cache tables appending one row
              per generation step: after I has 1 row, after love has 2 rows with the older row dimmed, after
              cats has 3 rows with only the newest row highlighted
            </desc>
            {[
              {
                x: 10,
                title: "After 'I'",
                k: [{ val: "[0.3, 0.4]", bright: true, label: "k_I" }],
                v: [{ val: "[0.8, 0.3]", bright: true, label: "v_I" }],
              },
              {
                x: 250,
                title: "After 'love'",
                k: [
                  { val: "[0.3, 0.4]", bright: false, label: "k_I" },
                  { val: "[0.7, 0.2]", bright: true, label: "k_love" },
                ],
                v: [
                  { val: "[0.8, 0.3]", bright: false, label: "v_I" },
                  { val: "[0.1, 0.9]", bright: true, label: "v_love" },
                ],
              },
              {
                x: 490,
                title: "After 'cats'",
                k: [
                  { val: "[0.3, 0.4]", bright: false, label: "k_I" },
                  { val: "[0.7, 0.2]", bright: false, label: "k_love" },
                  { val: "[0.5, 0.3]", bright: true, label: "k_cats" },
                ],
                v: [
                  { val: "[0.8, 0.3]", bright: false, label: "v_I" },
                  { val: "[0.1, 0.9]", bright: false, label: "v_love" },
                  { val: "[0.45, 0.6]", bright: true, label: "v_cats" },
                ],
              },
            ].map(({ x, title, k, v }, frameIdx) => (
              <g key={x} transform={`translate(${x}, 10)`}>
                <text x="110" y="14" fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                  {title}
                </text>
                {/* K table */}
                <text x="50" y="36" fill={C.blue} fontSize="11" textAnchor="middle" fontWeight="700">
                  K cache
                </text>
                {k.map((row, i) => (
                  <g key={i}>
                    <rect
                      x="10"
                      y={44 + i * 26}
                      width="80"
                      height="22"
                      rx="3"
                      fill={C.blue}
                      fillOpacity={row.bright ? 0.45 : 0.12}
                      stroke={C.blue}
                      strokeWidth={row.bright ? 2 : 1}
                    />
                    <text x="50" y={60 + i * 26} fill={row.bright ? "#fff" : C.dim} fontSize="10" textAnchor="middle" fontWeight={row.bright ? 700 : 400}>
                      {row.val}
                    </text>
                  </g>
                ))}
                {/* V table */}
                <text x="170" y="36" fill={C.green} fontSize="11" textAnchor="middle" fontWeight="700">
                  V cache
                </text>
                {v.map((row, i) => (
                  <g key={i}>
                    <rect
                      x="130"
                      y={44 + i * 26}
                      width="80"
                      height="22"
                      rx="3"
                      fill={C.green}
                      fillOpacity={row.bright ? 0.45 : 0.12}
                      stroke={C.green}
                      strokeWidth={row.bright ? 2 : 1}
                    />
                    <text x="170" y={60 + i * 26} fill={row.bright ? "#fff" : C.dim} fontSize="10" textAnchor="middle" fontWeight={row.bright ? 700 : 400}>
                      {row.val}
                    </text>
                  </g>
                ))}

                {/* Arrow to next frame */}
                {frameIdx < 2 && (
                  <g>
                    <line x1="225" y1="120" x2="245" y2="120" stroke="#a5d6a7" strokeWidth="2" markerEnd="url(#kv-arrow)" />
                    <text x="235" y="110" fill="#a5d6a7" fontSize="10" textAnchor="middle" fontWeight="700">
                      append
                    </text>
                  </g>
                )}
              </g>
            ))}
            <defs>
              <marker id="kv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5d6a7" />
              </marker>
            </defs>
          </svg>
        </div>
      </>,
    )}

    {inner(
      C.orange,
      <>
        <T color="#ffcc80" bold center size={14}>
          One append per step. The existing rows don't move, don't change, don't get recomputed. They just
          sit there in memory, ready to be read.
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(4)}
```

- [ ] **Step 3.8: Implement Sub 5 - Before vs After side-by-side**

Add after `{subBtn(4)}`:

```jsx
{/* ── Sub 5: Before vs After - Step 3 Side by Side ── */}
<Reveal when={sub >= 5}>
  <Box color={C.orange} style={{ width: "100%" }}>
    <T color="#ffcc80" bold center size={20}>
      Before vs After - Step 3 Side by Side
    </T>
    <T color="#ffcc80" size={16} style={{ marginTop: 8 }}>
      Generating "cats" with and without the cache. Identical output, very different amounts of work.
    </T>

    <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
      {/* Without cache */}
      <div
        style={{
          flex: "1 1 280px",
          padding: 14,
          borderRadius: 10,
          background: `${C.red}08`,
          border: `1px solid ${C.red}30`,
        }}
      >
        <T color="#ef9a9a" bold center size={16}>
          Without Cache
        </T>
        <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
          Recompute everything from scratch
        </T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { code: "q_I = W_Q · x_I", wasted: true },
            { code: "q_love = W_Q · x_love", wasted: true },
            { code: "q_cats = W_Q · x_cats", wasted: false },
            { code: "k_I = W_K · x_I", wasted: true },
            { code: "k_love = W_K · x_love", wasted: true },
            { code: "k_cats = W_K · x_cats", wasted: false },
            { code: "v_I = W_V · x_I", wasted: true },
            { code: "v_love = W_V · x_love", wasted: true },
            { code: "v_cats = W_V · x_cats", wasted: false },
          ].map(({ code, wasted }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
                borderRadius: 3,
                background: wasted ? `${C.red}10` : "transparent",
                textDecoration: wasted ? "line-through" : "none",
              }}
            >
              <code style={{ color: wasted ? C.red : C.green, fontSize: 12 }}>{code}</code>
              <span style={{ color: wasted ? C.red : C.green, fontSize: 10, fontWeight: 700 }}>
                {wasted ? "wasted" : "used"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, padding: 6, borderRadius: 4, background: `${C.red}12`, textAlign: "center" }}>
          <T color="#ef9a9a" bold size={13}>
            9 projections + 9 score cells + 3 output rows
          </T>
          <T color="#ef9a9a" size={13}>
            <strong>15 operations wasted</strong>
          </T>
        </div>
      </div>

      {/* With cache */}
      <div
        style={{
          flex: "1 1 280px",
          padding: 14,
          borderRadius: 10,
          background: `${C.green}08`,
          border: `1px solid ${C.green}30`,
        }}
      >
        <T color="#a5d6a7" bold center size={16}>
          With Cache
        </T>
        <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
          Read old rows, compute only the new one
        </T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}10` }}>
            <T color={C.blue} size={12} bold>
              Read from cache: k_I, k_love, v_I, v_love
            </T>
          </div>
          <div style={{ padding: "4px 8px", marginTop: 4 }}>
            <T color={C.dim} size={11} bold>
              Compute only for new token:
            </T>
          </div>
          {[
            { code: "q_cats = W_Q · x_cats", c: C.purple },
            { code: "k_cats = W_K · x_cats", c: C.blue },
            { code: "v_cats = W_V · x_cats", c: C.green },
          ].map(({ code, c }, i) => (
            <code key={i} style={{ color: c, fontSize: 12, padding: "2px 8px" }}>
              {code}
            </code>
          ))}
          <div style={{ padding: "4px 8px", marginTop: 4, borderTop: `1px solid ${C.dim}20` }}>
            <T color={C.dim} size={11} bold>
              Append k_cats, v_cats to cache. Then:
            </T>
          </div>
          <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
            scores = q_cats · Kᵀ (last row only, 1×N)
          </code>
          <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
            output_cats = softmax(scores) · V (1×d)
          </code>
        </div>
        <div style={{ marginTop: 8, padding: 6, borderRadius: 4, background: `${C.green}12`, textAlign: "center" }}>
          <T color="#a5d6a7" bold size={13}>
            3 projections + 3 score cells + 1 output row
          </T>
          <T color="#a5d6a7" size={13}>
            <strong>0 operations wasted</strong>
          </T>
        </div>
      </div>
    </div>

    {inner(
      C.cyan,
      <>
        <T color="#80deea" bold center size={15}>
          The output vector for "cats" is identical in both.
        </T>
        <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
          Same numbers come out. The cache just changes where the old K and V values come from (freshly
          recomputed vs memory read).
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(5)}
```

- [ ] **Step 3.9: Implement Sub 6 - Trace It with Real Numbers**

Add after `{subBtn(5)}`. Use the existing d=2 worked example numbers (they match the current chapter, so they're verified correct). Structure: three horizontal step panels + final derivation.

```jsx
{/* ── Sub 6: Trace It with Real Numbers ── */}
<Reveal when={sub >= 6}>
  <Box color={C.pink} style={{ width: "100%" }}>
    <T color="#f48fb1" bold center size={20}>
      Trace It with Real Numbers (d = 2)
    </T>
    <T color="#f48fb1" size={16} style={{ marginTop: 8 }}>
      Let's walk through the complete computation with tiny 2-dim vectors, watching the cache fill up and
      seeing the identical output the naive method would have produced.
    </T>

    {inner(
      C.cyan,
      <>
        <T color="#80deea" bold center size={14}>
          Embeddings (d = 2) and weights
        </T>
        <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_I = [1.0, 0.0]</code>
            <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_love = [0.0, 1.0]</code>
            <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_cats = [0.5, 0.5]</code>
          </div>
          <div style={{ textAlign: "center" }}>
            <code style={{ color: C.purple, fontSize: 12, display: "block" }}>W_Q rows: [0.5, 0.1] [0.2, 0.6]</code>
            <code style={{ color: C.blue, fontSize: 12, display: "block" }}>W_K rows: [0.3, 0.7] [0.4, 0.2]</code>
            <code style={{ color: C.green, fontSize: 12, display: "block" }}>W_V rows: [0.8, 0.1] [0.3, 0.9]</code>
          </div>
        </div>
      </>,
    )}

    {/* Step 1 */}
    {inner(
      C.yellow,
      <>
        <T color="#fff176" bold center size={14}>
          Step 1: process "I"
        </T>
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
          <code style={{ color: C.purple, fontSize: 12 }}>q_I = W_Q · [1.0, 0.0] = [0.5, 0.2]</code>
          <code style={{ color: C.blue, fontSize: 12 }}>k_I = W_K · [1.0, 0.0] = [0.3, 0.4]</code>
          <code style={{ color: C.green, fontSize: 12 }}>v_I = W_V · [1.0, 0.0] = [0.8, 0.3]</code>
        </div>
        <div style={{ marginTop: 4, padding: 6, borderRadius: 4, background: `${C.blue}08`, textAlign: "center" }}>
          <T color={C.dim} size={12}>
            Cache after step 1:
          </T>
          <T color={C.blue} size={12} bold>
            K = [[0.3, 0.4]]
          </T>
          <T color={C.green} size={12} bold>
            V = [[0.8, 0.3]]
          </T>
        </div>
      </>,
    )}

    {/* Step 2 */}
    {inner(
      C.orange,
      <>
        <T color="#ffcc80" bold center size={14}>
          Step 2: process "love" (reuse cache for "I")
        </T>
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
          <code style={{ color: C.purple, fontSize: 12 }}>q_love = W_Q · [0.0, 1.0] = [0.1, 0.6]</code>
          <code style={{ color: C.blue, fontSize: 12 }}>k_love = W_K · [0.0, 1.0] = [0.7, 0.2]</code>
          <code style={{ color: C.green, fontSize: 12 }}>v_love = W_V · [0.0, 1.0] = [0.1, 0.9]</code>
        </div>
        <div style={{ marginTop: 4, padding: 6, borderRadius: 4, background: `${C.blue}08`, textAlign: "center" }}>
          <T color={C.blue} size={12} bold>
            K = [[0.3, 0.4], [0.7, 0.2]]
          </T>
          <T color={C.green} size={12} bold>
            V = [[0.8, 0.3], [0.1, 0.9]]
          </T>
        </div>
      </>,
    )}

    {/* Step 3 - the full attention */}
    {inner(
      C.green,
      <>
        <T color="#a5d6a7" bold center size={14}>
          Step 3: process "cats" and compute full attention
        </T>
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
          <code style={{ color: C.purple, fontSize: 12 }}>q_cats = W_Q · [0.5, 0.5] = [0.3, 0.4]</code>
          <code style={{ color: C.blue, fontSize: 12 }}>k_cats = W_K · [0.5, 0.5] = [0.5, 0.3]</code>
          <code style={{ color: C.green, fontSize: 12 }}>v_cats = W_V · [0.5, 0.5] = [0.45, 0.6]</code>
        </div>

        <div style={{ marginTop: 6, padding: 6, borderRadius: 4, background: `${C.purple}08`, textAlign: "center" }}>
          <T color={C.purple} size={12} bold>
            Scores (last row only): q_cats · each key
          </T>
          <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
            q_cats · k_I = 0.3×0.3 + 0.4×0.4 = 0.25
          </code>
          <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
            q_cats · k_love = 0.3×0.7 + 0.4×0.2 = 0.29
          </code>
          <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
            q_cats · k_cats = 0.3×0.5 + 0.4×0.3 = 0.27
          </code>
        </div>

        <div style={{ marginTop: 6, padding: 6, borderRadius: 4, background: `${C.yellow}08`, textAlign: "center" }}>
          <T color="#fff176" size={12} bold>
            Scale by √2, then softmax:
          </T>
          <code style={{ color: "#fff176", fontSize: 12, display: "block", marginTop: 2 }}>
            softmax = [0.329, 0.338, 0.333]
          </code>
        </div>

        <div style={{ marginTop: 6, padding: 6, borderRadius: 4, background: `${C.green}12`, textAlign: "center" }}>
          <T color="#a5d6a7" size={12} bold>
            Weighted sum of values:
          </T>
          <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
            0.329 × [0.8, 0.3] + 0.338 × [0.1, 0.9] + 0.333 × [0.45, 0.6]
          </code>
          <code style={{ color: "#a5d6a7", fontSize: 14, display: "block", marginTop: 4, fontWeight: 700 }}>
            output_cats = [0.447, 0.603]
          </code>
        </div>
      </>,
    )}

    {inner(
      C.red,
      <>
        <T color="#ef9a9a" bold center size={13}>
          This exact [0.447, 0.603] would also come out without the cache. The cache never changes what is
          computed. It only changes where k_I, k_love, v_I, v_love came from (cached vs recomputed).
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(6)}
```

- [ ] **Step 3.10: Implement Sub 7 - The Cost (Memory Bar SVG)**

Add after `{subBtn(6)}`:

```jsx
{/* ── Sub 7: The Cost - 10.7 GB Per Conversation ── */}
<Reveal when={sub >= 7}>
  <Box color={C.red} style={{ width: "100%" }}>
    <T color="#ef9a9a" bold center size={20}>
      The Cost - 10.7 GB Per Conversation
    </T>
    <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
      The cache isn't free. It has a specific memory cost that depends on model size and sequence length.
    </T>

    {inner(
      C.red,
      <>
        <T color="#ef9a9a" bold center size={14}>
          The formula
        </T>
        {mono("#ef9a9a", "cache_bytes = 2 (K+V) × layers × d_model × seq_len × bytes_per_param", 13)}
      </>,
    )}

    {inner(
      C.orange,
      <>
        <T color="#ffcc80" bold center size={14}>
          Example: LLaMA 70B
        </T>
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "layers", val: "80", c: C.green },
            { label: "d_model", val: "8,192", c: C.purple },
            { label: "seq_len (max)", val: "4,096 tokens", c: C.cyan },
            { label: "precision", val: "FP16 (2 bytes)", c: C.orange },
          ].map(({ label, val, c }) => (
            <div key={label} style={{ display: "flex", gap: 8, padding: "2px 8px" }}>
              <T color={c} bold size={13} style={{ minWidth: 110 }}>
                {label}:
              </T>
              <T color={C.dim} size={13}>
                {val}
              </T>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, padding: 8, borderRadius: 6, background: "rgba(0,0,0,0.25)", textAlign: "center" }}>
          <code style={{ color: C.dim, fontSize: 13 }}>2 × 80 × 8,192 × 4,096 × 2 bytes</code>
          <T color="#ef9a9a" bold size={18} style={{ marginTop: 4 }}>
            = 10.7 GB per sequence
          </T>
        </div>

        <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
          <svg data-viz="memory-bar" width="520" height="110" viewBox="0 0 520 110">
            <desc>
              Horizontal memory meter filling with gradient showing KV cache memory cost scaling with sequence
              length, with tick marks at 1024 4096 and 32768 tokens and GB values 2.7 10.7 and 86 for LLaMA 70B
              sized models
            </desc>
            <defs>
              <linearGradient id="memgrad" x1="0" x2="1">
                <stop offset="0" stopColor={C.green} stopOpacity="0.5" />
                <stop offset="0.3" stopColor={C.yellow} stopOpacity="0.5" />
                <stop offset="1" stopColor={C.red} stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Axis line */}
            <rect x="20" y="40" width="480" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
            <rect x="20" y="40" width="480" height="24" rx="4" fill="url(#memgrad)" />
            {/* Tick labels */}
            {[
              { x: 50, tokens: "1K", gb: "2.7 GB" },
              { x: 180, tokens: "4K", gb: "10.7 GB" },
              { x: 420, tokens: "32K", gb: "86 GB" },
            ].map(({ x, tokens, gb }) => (
              <g key={x}>
                <line x1={x} y1="64" x2={x} y2="72" stroke={C.dim} strokeWidth="1" />
                <text x={x} y="86" fill={C.dim} fontSize="11" textAnchor="middle">
                  {tokens}
                </text>
                <text x={x} y="100" fill="#ef9a9a" fontSize="12" textAnchor="middle" fontWeight="700">
                  {gb}
                </text>
              </g>
            ))}
            <text x="20" y="28" fill={C.dim} fontSize="12">
              KV cache size grows with sequence length (LLaMA 70B, FP16)
            </text>
          </svg>
        </div>
      </>,
    )}

    {inner(
      C.red,
      <>
        <T color="#ef9a9a" bold center size={15}>
          And every concurrent user needs their own cache
        </T>
        <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "1 user", val: "10.7 GB" },
            { label: "10 users", val: "107 GB" },
            { label: "100 users", val: "1,070 GB" },
          ].map(({ label, val }) => (
            <div
              key={label}
              style={{
                padding: 8,
                borderRadius: 6,
                background: `${C.red}10`,
                border: `1px solid ${C.red}30`,
                minWidth: 110,
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={12}>
                {label}
              </T>
              <T color="#ef9a9a" size={14} bold>
                {val}
              </T>
            </div>
          ))}
        </div>
        <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
          Long-context models (128K tokens) consume enormous memory. This is a major reason why serving LLMs
          is expensive, and why techniques like grouped-query attention exist to shrink the cache.
        </T>
      </>,
    )}
  </Box>
</Reveal>
{subBtn(7)}
```

- [ ] **Step 3.11: Implement Sub 8 - The Deal (Memory for Speed)**

Add after `{subBtn(7)}`:

```jsx
{/* ── Sub 8: The Deal - Memory for Speed ── */}
<Reveal when={sub >= 8}>
  <Box color={C.cyan} style={{ width: "100%" }}>
    <T color="#80deea" bold center size={20}>
      The Deal - Memory for Speed
    </T>
    <T color="#80deea" size={16} style={{ marginTop: 8 }}>
      The KV cache is a trade. It costs memory and pays back speed. Here's the final ledger.
    </T>

    <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <div
        style={{
          flex: "1 1 240px",
          padding: 14,
          borderRadius: 10,
          background: `${C.red}08`,
          border: `1px solid ${C.red}30`,
        }}
      >
        <T color="#ef9a9a" bold center size={16}>
          Without KV Cache
        </T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
              Speed:
            </T>
            <T color={C.dim} size={14}>
              slow, O(N²) per step, O(N³) total
            </T>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
              Memory:
            </T>
            <T color={C.dim} size={14}>
              low, nothing stored
            </T>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: "1 1 240px",
          padding: 14,
          borderRadius: 10,
          background: `${C.green}08`,
          border: `1px solid ${C.green}30`,
        }}
      >
        <T color="#a5d6a7" bold center size={16}>
          With KV Cache
        </T>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
              Speed:
            </T>
            <T color={C.dim} size={14}>
              fast, O(N) per step, O(N²) total
            </T>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
              Memory:
            </T>
            <T color={C.dim} size={14}>
              GB-scale, grows per token
            </T>
          </div>
        </div>
      </div>
    </div>

    {inner(
      C.yellow,
      <>
        <T color="#fff176" bold center size={16}>
          At 1000 tokens:
        </T>
        <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.red}10`, minWidth: 140, textAlign: "center" }}>
            <T color={C.red} bold size={13}>
              Without cache
            </T>
            <T color={C.dim} size={13}>
              ~333 million ops
            </T>
          </div>
          <div style={{ padding: 8, borderRadius: 6, background: `${C.green}10`, minWidth: 140, textAlign: "center" }}>
            <T color={C.green} bold size={13}>
              With cache
            </T>
            <T color={C.dim} size={13}>
              ~500 thousand ops
            </T>
          </div>
        </div>
        <T color="#fff176" bold center size={18} style={{ marginTop: 10 }}>
          ~660× faster
        </T>
      </>,
    )}

    {inner(
      C.cyan,
      <>
        <T color="#80deea" bold center size={15}>
          Every fast LLM you've ever used runs on this trick.
        </T>
        <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
          Without it, ChatGPT would take minutes per response instead of seconds.
        </T>
      </>,
    )}

    {inner(
      C.purple,
      <>
        <T color="#b8a9ff" size={13} center>
          A note on scope: the cache only exists at inference time. During training, all tokens are processed
          in parallel, so there's nothing to cache.
        </T>
      </>,
    )}
  </Box>
</Reveal>
```

- [ ] **Step 3.12: Close the return and function**

Make sure the final structure ends with the closing `</div>`, `);` and `};`:

```jsx
      {/* Sub 8 JSX above */}
    </div>
  );
};
```

(The next line in the file should remain `// ═══════ CH: Why K Transpose? - Making the Shapes Fit ═══════` or whatever comment separates the next chapter.)

- [ ] **Step 3.13: Run the KVCache tests to verify all 9 pass**

Run: `cd /Users/rajul/learn-ai && npx vitest run src/__tests__/sections.test.jsx -t "KVCache sub-steps" 2>&1 | tail -40`

Expected: 9 tests, all PASSING.

- [ ] **Step 3.14: Run the FULL test suite to catch regressions elsewhere**

Run: `cd /Users/rajul/learn-ai && npm run test 2>&1 | tail -30`

Expected: All tests pass. The full-coverage chapter-iteration describe block in `sections.test.jsx` (lines 77-200ish) should handle the new KVCache function correctly because its render contract is unchanged (same ctx signature, same sub numbering).

- [ ] **Step 3.15: Commit**

```bash
cd /Users/rajul/learn-ai
git add src/sections/attention-computation.jsx src/__tests__/sections.test.jsx
git commit -m "Revamp Chapter 9.6 KV Cache with matrix-view focus

- 9 new subs with visual-first progression: problem bars, lightbulb, matrix view (star), what-to-save cards, growing notebook, before/after, worked numbers, memory cost, tradeoff.
- 4 new inline SVGs: piling work bars, matrix matmul view, growing notebook frames, memory bar.
- Matches design spec at docs/superpowers/specs/2026-04-21-kvcache-ch96-revamp-design.md"
```

---

## Task 4: Full verification

**Files:** None modified. Read-only quality gates.

- [ ] **Step 4.1: Run full test suite with coverage**

Run: `cd /Users/rajul/learn-ai && npx vitest run --coverage 2>&1 | tail -30`

Expected: all tests pass. Coverage numbers should not have decreased (target: 100% lines, 97%+ branches).

- [ ] **Step 4.2: Run lint**

Run: `cd /Users/rajul/learn-ai && npm run lint 2>&1 | tail -10`

Expected: no errors. Fix any `react/no-unknown-property` warnings for `data-viz`/`data-block` by adding them to ignored attrs if the linter complains (unlikely - these should be valid).

- [ ] **Step 4.3: Run prettier format**

Run: `cd /Users/rajul/learn-ai && npm run format 2>&1 | tail -5`

Expected: files formatted. If any diff is produced, commit the formatting changes:

```bash
cd /Users/rajul/learn-ai
git add -u
git commit -m "Format Chapter 9.6 revamp"
```

- [ ] **Step 4.4: Run production build**

Run: `cd /Users/rajul/learn-ai && npm run build 2>&1 | tail -10`

Expected: build succeeds with no errors, dist/ produced.

---

## Task 5: Chrome visual verification

**Files:** None modified. This is manual visual QA through the Chrome MCP tools.

- [ ] **Step 5.1: Start dev server in background**

Run (background): `cd /Users/rajul/learn-ai && npm run dev`

Wait for "ready in" message. The URL will typically be `http://localhost:5173/learn-ai/`.

- [ ] **Step 5.2: Open Chapter 9.6 in Chrome via MCP**

Use `mcp__claude-in-chrome__tabs_context_mcp` to check tabs, then `mcp__claude-in-chrome__tabs_create_mcp` to open the dev URL. Navigate to Chapter 9.6 by using the `goTo` navigation (either URL hash or click into 9.6 from TOC).

- [ ] **Step 5.3: Screenshot every sub (0-8)**

For each sub from 0 through 8:
1. Ensure the sub is revealed (advance via Continue/SubBtn as needed)
2. Screenshot the chapter content
3. Check: Box color is visible (not too dark), title is centered, SVG renders completely, no text overflow, no overlap, colors match spec

Use `mcp__claude-in-chrome__javascript_tool` if you need to scroll/size the viewport.

- [ ] **Step 5.4: Specific visual checks**

- **Sub 0:** Work bars SVG shows 6 blocks total across 3 rows, green/red coloring is clear, counts text is readable.
- **Sub 2:** Matrix view SVG fits in viewport without horizontal scroll, gray rows are clearly dim vs the glowing purple last row, labels are legible.
- **Sub 4:** Three notebook frames are side by side (or wrap gracefully), append arrows visible.
- **Sub 7:** Memory bar gradient fills the axis, tick labels (1K/4K/32K) and GB values visible.
- **Sub 3:** Three Q/K/V cards side by side, big ✗ and ✓ icons visible.
- **All subs:** Box title is centered.

- [ ] **Step 5.5: Fix any issues found**

For each issue, return to the relevant sub in `attention-computation.jsx` and adjust. Re-run `npm run test` and `npm run build` after fixes. Commit each coherent fix batch.

- [ ] **Step 5.6: Stop dev server**

Kill the background dev server process when done.

---

## Self-Review

Spec coverage:
- Sub 0 problem bars -> Task 3.3 ✓
- Sub 1 lightbulb -> Task 3.4 ✓
- Sub 2 matrix view (star) -> Task 3.5 ✓
- Sub 3 what-to-save cards -> Task 3.6 ✓
- Sub 4 growing notebook -> Task 3.7 ✓
- Sub 5 before vs after -> Task 3.8 ✓
- Sub 6 worked numbers -> Task 3.9 ✓
- Sub 7 memory cost + bar -> Task 3.10 ✓
- Sub 8 tradeoff -> Task 3.11 ✓
- 4 new SVGs manifest entries -> Task 1.1 ✓
- 4 SVGs with `<desc>` -> Each sub-task includes `<desc>` ✓
- Tests per sub (9 tests) -> Task 2.1 ✓
- Color/style rules -> Task 3 preamble ✓
- Em-dashes -> none used in any task content ✓
- Build + lint + format -> Task 4 ✓
- Chrome verification -> Task 5 ✓

Type consistency check:
- `ctx` destructure identical to current: `sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate` ✓
- `inner` helper: `(color, children, extra) => tinted div` - same signature as current ✓
- `mono` helper: `(color, text, size=14) => centered code` - same signature as current ✓
- `Box`, `T`, `Reveal`, `Tag`, `SubBtn` - all existing imports in the file, unchanged ✓
- `data-viz` attribute values used in tests: `work-bars`, `matrix-view`, `notebook`, `memory-bar` - match impl steps ✓
- `data-block` attribute in sub 0 test: used in Step 3.3 on rects ✓

No placeholders, no TODOs, no ambiguity.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-21-kvcache-ch96-revamp.md`.

The plan is self-contained; any engineer can execute it TDD-style. Preferred execution: subagent-driven for Tasks 1-4 (fresh context each task, review between), followed by inline Task 5 (Chrome verification requires live browser control).
