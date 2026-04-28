# Quantization Drift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "mutation drift problem" sub and an "industry fix" sub to chapters 11.13 (SQ), 11.14 (PQ), 11.15 (BQ) — covering insert, update, and delete consequences plus production remedies.

**Architecture:** Each chapter currently has subs 0–6. We insert two new subs at positions 6 (problem, red Box) and 7 (fix, green Box), pushing the existing sub 6 (integration content) to sub 8. Each new sub is one big SVG with title + short labels — visual-heavy, minimal text. Industry remedies name real systems with real config knobs.

**Tech Stack:** React 18 functional components, inline SVG, Vitest + React Testing Library, existing `Box`/`T`/`Reveal` shared components from `src/components.jsx`, color tokens from `src/config.js`.

**Spec reference:** `docs/superpowers/specs/2026-04-29-quantization-drift-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/sections/vector-compression.jsx` | Modify | The three chapter component functions `ScalarQuantization`, `ProductQuantization`, `BinaryQuantization`. Add 2 Reveal blocks per chapter, shift the existing sub=6 Reveal to sub=8, change SubBtn gate from `sub < 6` to `sub < 8`. |
| `src/__tests__/sections.test.jsx` | Modify | Renumber the existing `sub=6` tests to `sub=8` (3 chapters × 1–2 tests), add 2 new tests per chapter for `sub=6` and `sub=7`. |
| `src/data/svg-descriptions.json` | Modify | Create entry for `11.13` (currently missing because SQ has no SVGs); append new entries to `11.14` and `11.15` for the two new SVGs each. Six new descriptions total. |

No new files.

---

## Conventions

- All new SVGs MUST have `<desc>` as their first child (project rule).
- All Box titles use `<T color={...} bold center size={22}>` (titles always center-aligned).
- Problem sub uses `<Box color={C.red}>`. Fix sub uses `<Box color={C.green}>`.
- Inner tile pattern: `background: \`\${color}06\``, `border: \`1px solid \${color}12\``, `borderRadius: 8`. Body 16-19 px, titles 22 px.
- After every code change, run `npm run test`. After every chapter task, run `npm run lint` and `npm run build` to catch syntax issues.
- Commit messages use imperative mood, no Claude/Anthropic attribution.

---

## Task 1: Renumber existing SQ sub=6 tests to sub=8

**Files:**
- Test: `src/__tests__/sections.test.jsx:892-903`

- [ ] **Step 1: Read current SQ sub=6 tests**

Run: `grep -n "ScalarQuantization\|sub=6 shows SQ\|sub=6 names production" src/__tests__/sections.test.jsx`
Expected: locations of the two existing SQ sub=6 tests at lines 892 and 900.

- [ ] **Step 2: Renumber both `sub=6` tests to `sub=8` (text only)**

Edit `src/__tests__/sections.test.jsx`:

```js
  it("sub=8 shows SQ pairs with any index (HNSW, IVF, flat)", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/IVF|flat/i);
    expect(container.textContent).toMatch(/drop[- ]?in|payload|swap/i);
    expect(container.textContent).toMatch(/index.*unchanged|graph.*unchanged|same (graph|index)/i);
  });

  it("sub=8 names production examples", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/pgvector|Qdrant|FAISS/);
  });
```

- [ ] **Step 3: Run tests; expect SQ failures (sub=8 returns nothing yet because chapter still maxes at 6)**

Run: `npm run test -- sections`
Expected: SQ "sub=8 shows..." and "sub=8 names..." both FAIL with assertion mismatch (chapter still gates integration content at `sub >= 6`). Do NOT fix yet — Task 2 will fix in source.

- [ ] **Step 4: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Renumber SQ integration tests sub=6 to sub=8 ahead of drift insert"
```

---

## Task 2: Shift SQ integration Reveal to sub=8 and bump SubBtn gate

**Files:**
- Modify: `src/sections/vector-compression.jsx:941` (Reveal `sub >= 6`) and `src/sections/vector-compression.jsx:1043` (SubBtn `sub < 6`).

- [ ] **Step 1: Confirm test from Task 1 still failing**

Run: `npm run test -- sections`
Expected: SQ sub=8 tests still fail.

- [ ] **Step 2: Change `sub >= 6` to `sub >= 8` for the existing integration Reveal in `ScalarQuantization`**

Edit `src/sections/vector-compression.jsx` around line 941:

```jsx
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
```

(only change the `when` value)

- [ ] **Step 3: Change `sub < 6` to `sub < 8` for the SubBtn at the end of `ScalarQuantization`**

Edit `src/sections/vector-compression.jsx` around line 1043:

```jsx
      {sub < 8 && (
        <SubBtn
          key={sub}
```

- [ ] **Step 4: Run SQ tests, all should pass now (sub=8 hits the shifted Reveal, subs 0-5 still pass, subs 6-7 not yet covered)**

Run: `npm run test -- sections.test.jsx -t "ScalarQuantization"`
Expected: PASS (8 tests). The two sub=8 tests now pass; subs 6 and 7 not yet asserted.

- [ ] **Step 5: Commit**

```bash
git add src/sections/vector-compression.jsx
git commit -m "Shift SQ integration sub from 6 to 8 to make room for drift content"
```

---

## Task 3: Add SQ sub=6 — drift problem (insert/update/delete)

**Files:**
- Test: `src/__tests__/sections.test.jsx` (after the existing SQ describe block, before ProductQuantization describe block — around line 904)
- Modify: `src/sections/vector-compression.jsx` — insert a new `<Reveal when={sub >= 6}>` block immediately after the existing `<Reveal when={sub >= 5}>` block (currently ends around line 940) and before the now-shifted `<Reveal when={sub >= 8}>` block.
- Modify: `src/data/svg-descriptions.json` — add new key `"11.13"` with one description string.

- [ ] **Step 1: Write the failing test**

Add inside `describe("ScalarQuantization (11.13) content", ...)`, just after the last `it("sub=8 names production examples"...)`:

```js
  it("sub=6 shows insert/update/delete drift the calibrated range", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/outside|out[- ]of[- ]range|drift/i);
    expect(container.textContent).toMatch(/clip/i);
    expect(container.textContent).toMatch(/error\s*=\s*0\.4/i);
    expect(container.textContent).toMatch(/-?1\.2|1\.4|1\.8/);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=6 shows insert/update/delete drift the calibrated range"`
Expected: FAIL — text not found because Reveal at sub >= 6 currently renders nothing (we shifted the integration content to sub=8 and have not yet added the new sub=6 content).

- [ ] **Step 3: Implement the new sub=6 Reveal**

In `src/sections/vector-compression.jsx`, immediately after the closing `</Reveal>` of the `sub >= 5` block (around current line 940) and before the `<Reveal when={sub >= 8}>` line, insert:

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the calibrated range
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "new value 1.8 outside [-1.2, 1.4]" },
              { tag: "UPDATE", caption: "replaced value 1.8 still outside" },
              { tag: "DELETE", caption: "stale int8 row stays; live min/max drifts" },
            ].map((it) => (
              <div
                key={it.tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {it.tag}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {it.caption}
                </T>
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 720 220"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Number line with calibrated band -1.2 to 1.4 shaded cyan and a 0 to 255 bucket scale below; a green
              training point at 0.5 maps to bucket 158, a red new-vector point at 1.8 sits outside the band with a bent
              arrow back to the clip point at 1.4 = bucket 255 and a red gap bar labeled error = 0.4; a faded tombstone
              marker shows a deleted entry whose int8 row still lives.
            </desc>
            {/* axis */}
            <line x1="60" y1="100" x2="700" y2="100" stroke="#666" strokeWidth="1" />
            {/* shaded calibrated band: -1.2 (x=140) to 1.4 (x=520) */}
            <rect x="140" y="80" width="380" height="40" fill={`${C.cyan}1a`} stroke={`${C.cyan}40`} />
            <text x="140" y="74" fontSize="11" fill={C.cyan} textAnchor="middle">min = -1.2</text>
            <text x="520" y="74" fontSize="11" fill={C.cyan} textAnchor="middle">max = 1.4</text>
            {/* bucket axis label */}
            <text x="60" y="150" fontSize="11" fill="#999">bucket 0</text>
            <text x="520" y="150" fontSize="11" fill="#999">bucket 255</text>
            {/* training point */}
            <circle cx="380" cy="100" r="6" fill={C.green} />
            <text x="380" y="86" fontSize="11" fill={C.green} textAnchor="middle">0.5 = bucket 158</text>
            {/* new vec point at 1.8 (would map past x=520; place at x=600 to show outside) */}
            <circle cx="600" cy="100" r="6" fill={C.red} />
            <text x="600" y="86" fontSize="11" fill={C.red} textAnchor="middle">new = 1.8</text>
            {/* bent arrow back to clip at 520 */}
            <path d="M 600 110 Q 560 140 520 110" fill="none" stroke={C.red} strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="520,110 528,106 528,114" fill={C.red} />
            <text x="560" y="160" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">clipped to 1.4 (bucket 255)</text>
            {/* gap bar */}
            <rect x="520" y="180" width="80" height="10" fill={`${C.red}66`} />
            <text x="560" y="205" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">error = 0.4</text>
            {/* tombstone marker */}
            <g opacity="0.45">
              <rect x="280" y="92" width="14" height="16" fill="none" stroke="#888" strokeWidth="1" />
              <line x1="280" y1="92" x2="294" y2="108" stroke="#888" strokeWidth="1" />
              <text x="287" y="76" fontSize="10" fill="#888" textAnchor="middle">tombstone</text>
            </g>
          </svg>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Add the SVG description to `src/data/svg-descriptions.json`**

Insert a new key `"11.13"` (alphabetical or numeric position before `"11.14"`):

```json
  "11.13": [
    "Number line with calibrated cyan band from -1.2 to 1.4 and a 0 to 255 bucket scale; green training point at 0.5 maps to bucket 158, red new-vector point at 1.8 sits outside the band with a bent arrow clipping it back to 1.4 = bucket 255, a red gap bar labeled error = 0.4, and a faded tombstone marker for a deleted entry whose int8 row still lives"
  ],
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- sections.test.jsx -t "ScalarQuantization"`
Expected: PASS (9 tests now).

Run: `npm run test -- svg-descriptions`
Expected: PASS — the new SVG `<desc>` content matches the manifest entry.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add SQ sub 6: insert/update/delete drift the calibrated range"
```

---

## Task 4: Add SQ sub=7 — drift fix (percentile + vacuum + recalibration)

**Files:**
- Test: `src/__tests__/sections.test.jsx` (after the sub=6 test added in Task 3)
- Modify: `src/sections/vector-compression.jsx` — insert a new `<Reveal when={sub >= 7}>` block immediately after the sub=6 block from Task 3, before the `<Reveal when={sub >= 8}>` block.
- Modify: `src/data/svg-descriptions.json` — append a second description string to `"11.13"`.

- [ ] **Step 1: Write the failing test**

```js
  it("sub=7 shows percentile bounds + vacuum + scheduled recalibration", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/percentile|p1|p99|headroom/i);
    expect(container.textContent).toMatch(/recalibrat|re-calibrat/i);
    expect(container.textContent).toMatch(/vacuum|tombstone|compact/i);
    expect(container.textContent).toMatch(/0\.5%|drift|clip/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/Vespa/);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=7 shows percentile bounds"`
Expected: FAIL.

- [ ] **Step 3: Implement the new sub=7 Reveal**

Insert after the sub=6 block from Task 3:

```jsx
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: percentile bounds + tombstone vacuum + recalibration job
          </T>
          <svg
            viewBox="0 0 720 260"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Two stacked number lines comparing min/max calibration to p1/p99 plus 10 percent headroom; the top band
              spans -1.2 to 1.4 and the new value 1.8 clips with a red error bar of 0.4, while the bottom band spans
              -1.4 to 1.7 and the same new value clips with a red error bar of only 0.1.
            </desc>
            {/* top: min/max */}
            <text x="60" y="40" fontSize="12" fill="#aaa">min/max calibration</text>
            <line x1="60" y1="70" x2="700" y2="70" stroke="#666" strokeWidth="1" />
            <rect x="160" y="55" width="320" height="30" fill={`${C.cyan}1a`} stroke={`${C.cyan}40`} />
            <text x="160" y="50" fontSize="10" fill={C.cyan} textAnchor="middle">-1.2</text>
            <text x="480" y="50" fontSize="10" fill={C.cyan} textAnchor="middle">1.4</text>
            <circle cx="560" cy="70" r="5" fill={C.red} />
            <text x="560" y="62" fontSize="10" fill={C.red} textAnchor="middle">1.8</text>
            <rect x="480" y="92" width="80" height="8" fill={`${C.red}66`} />
            <text x="520" y="112" fontSize="11" fill={C.red} textAnchor="middle" fontWeight="bold">error = 0.4</text>
            {/* bottom: p1/p99 + headroom */}
            <text x="60" y="160" fontSize="12" fill="#aaa">p1 / p99 + 10% headroom</text>
            <line x1="60" y1="190" x2="700" y2="190" stroke="#666" strokeWidth="1" />
            <rect x="140" y="175" width="400" height="30" fill={`${C.green}1a`} stroke={`${C.green}40`} />
            <text x="140" y="170" fontSize="10" fill={C.green} textAnchor="middle">-1.4</text>
            <text x="540" y="170" fontSize="10" fill={C.green} textAnchor="middle">1.7</text>
            <circle cx="560" cy="190" r="5" fill={C.red} />
            <text x="560" y="182" fontSize="10" fill={C.red} textAnchor="middle">1.8</text>
            <rect x="540" y="212" width="20" height="8" fill={`${C.red}66`} />
            <text x="560" y="232" fontSize="11" fill={C.red} textAnchor="middle" fontWeight="bold">error = 0.1</text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              { op: "INSERT / UPDATE", text: "clip rare; drift counter increments on clip" },
              { op: "DELETE", text: "tombstone bit set; vacuum job rebuilds row store" },
              { op: "DRIFT", text: "% clipped > 0.5% triggers scheduled recalibration" },
            ].map((row) => (
              <div
                key={row.op}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.green} bold size={14} style={{ minWidth: 130 }}>
                  {row.op}
                </T>
                <T color={C.bright} size={14}>
                  {row.text}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10,
            }}
          >
            {[
              { name: "FAISS", line: "IndexScalarQuantizer(d, QT_8bit_uniform) + custom range" },
              { name: "Qdrant", line: "quantization_config.scalar.rescaling: true + optimizer.deleted_threshold" },
              { name: "Pinecone", line: "managed re-quantization on shard rebalance" },
              { name: "Vespa", line: "tensor int8 cell-type with explicit bounds + auto-compact" },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {s.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace", textAlign: "center" }}>
                  {s.line}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append second SVG description for `"11.13"` in `src/data/svg-descriptions.json`**

```json
  "11.13": [
    "Number line with calibrated cyan band from -1.2 to 1.4 and a 0 to 255 bucket scale; green training point at 0.5 maps to bucket 158, red new-vector point at 1.8 sits outside the band with a bent arrow clipping it back to 1.4 = bucket 255, a red gap bar labeled error = 0.4, and a faded tombstone marker for a deleted entry whose int8 row still lives",
    "Two stacked number lines comparing min/max calibration to p1/p99 plus 10 percent headroom; the top band spans -1.2 to 1.4 and the new value 1.8 clips with a red error bar of 0.4, while the bottom band spans -1.4 to 1.7 and the same new value clips with a red error bar of only 0.1"
  ],
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- sections.test.jsx -t "ScalarQuantization"`
Expected: PASS (10 tests).

Run: `npm run test`
Expected: full suite passes.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add SQ sub 7: percentile bounds, tombstone vacuum, scheduled recalibration"
```

---

## Task 5: Renumber existing PQ sub=6 test to sub=8

**Files:**
- Test: `src/__tests__/sections.test.jsx:963-970`

- [ ] **Step 1: Edit the test**

Change the existing PQ describe block test:

```js
  it("sub=8 shows the recall-compression curve", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/m\s*=\s*96|m=96/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/compress/i);
    expect(container.textContent).toMatch(/only knob|knob/i);
    expect(container.textContent).toMatch(/sweet spot/i);
  });
```

- [ ] **Step 2: Run tests; expect PQ sub=8 failure**

Run: `npm run test -- sections.test.jsx -t "ProductQuantization"`
Expected: PQ "sub=8 shows the recall-compression curve" FAILS.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Renumber PQ knob test sub=6 to sub=8 ahead of drift insert"
```

---

## Task 6: Shift PQ knob Reveal to sub=8 and bump SubBtn gate

**Files:**
- Modify: `src/sections/vector-compression.jsx:2570` (Reveal `sub >= 6` for the m-knob block) and the SubBtn gate at line 2794 (`sub < 6`).

- [ ] **Step 1: Change `sub >= 6` to `sub >= 8` for the m-knob Reveal in `ProductQuantization`**

Around line 2570:

```jsx
      <Reveal when={sub >= 8}>
        <Box color={C.pink} style={{ width: "100%" }}>
```

- [ ] **Step 2: Change SubBtn gate `sub < 6` to `sub < 8` at the end of `ProductQuantization`**

Around line 2794:

```jsx
      {sub < 8 && (
        <SubBtn
```

- [ ] **Step 3: Run tests; expect PQ sub=8 to pass, subs 6 and 7 still uncovered**

Run: `npm run test -- sections.test.jsx -t "ProductQuantization"`
Expected: PASS (7 tests).

- [ ] **Step 4: Commit**

```bash
git add src/sections/vector-compression.jsx
git commit -m "Shift PQ m-knob sub from 6 to 8 to make room for drift content"
```

---

## Task 7: Add PQ sub=6 — codebook drift problem

**Files:**
- Test: `src/__tests__/sections.test.jsx` (inside the PQ describe block)
- Modify: `src/sections/vector-compression.jsx` — insert new `<Reveal when={sub >= 6}>` immediately after the existing `<Reveal when={sub >= 5}>` (OPQ rotation block) of `ProductQuantization`, before the now-shifted `<Reveal when={sub >= 8}>`.
- Modify: `src/data/svg-descriptions.json` — append a new description to the `"11.14"` array.

- [ ] **Step 1: Write the failing test**

```js
  it("sub=6 shows insert/update/delete drift the codebooks", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/distance\s*=\s*1\.8/i);
    expect(container.textContent).toMatch(/0\.3/);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=6 shows insert/update/delete drift the codebooks"`
Expected: FAIL.

- [ ] **Step 3: Implement the new sub=6 Reveal in `ProductQuantization`**

Insert after the OPQ block (current `sub >= 5`) and before the now-shifted `sub >= 8` block:

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the codebooks
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "sub-vec far from every centroid; error 6x baseline" },
              { tag: "UPDATE", caption: "re-encoded with stale codebooks; same error" },
              { tag: "DELETE", caption: "orphan PQ code; residual distribution shifts" },
            ].map((it) => (
              <div
                key={it.tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {it.tag}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {it.caption}
                </T>
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 600 320"
            style={{ width: "100%", maxWidth: 640, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              2D scatter for slot 0 with a tight cluster of 256 gray X marks for centroids around the origin and gray
              training-vector dots inside the cluster; a red dot for the new sub-vector at (2.1, 1.9) sits far outside
              the cluster, with a dashed line to the nearest X labeled distance = 1.8, alongside an inset label
              training avg distance = 0.3. A few faded gray dots with strikethrough show deleted training entries.
            </desc>
            {/* axes */}
            <line x1="50" y1="280" x2="560" y2="280" stroke="#555" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="280" stroke="#555" strokeWidth="1" />
            <text x="305" y="305" fontSize="11" fill="#999" textAnchor="middle">slot 0 dim a</text>
            <text x="20" y="150" fontSize="11" fill="#999" textAnchor="middle" transform="rotate(-90 20 150)">slot 0 dim b</text>
            {/* cluster of centroids around (180, 180) */}
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i / 32) * Math.PI * 2;
              const r = 18 + (i % 5) * 4;
              const cx = 180 + Math.cos(angle) * r;
              const cy = 180 + Math.sin(angle) * r;
              return (
                <g key={i}>
                  <line x1={cx - 3} y1={cy - 3} x2={cx + 3} y2={cy + 3} stroke="#888" strokeWidth="1" />
                  <line x1={cx - 3} y1={cy + 3} x2={cx + 3} y2={cy - 3} stroke="#888" strokeWidth="1" />
                </g>
              );
            })}
            {/* training dots inside cluster */}
            {[[170, 175], [185, 180], [190, 170], [175, 190], [195, 185], [180, 195]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill="#999" />
            ))}
            {/* deleted (strikethrough) dots */}
            {[[160, 165], [205, 195]].map(([cx, cy], i) => (
              <g key={i} opacity="0.4">
                <circle cx={cx} cy={cy} r="3" fill="#666" />
                <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke="#aaa" strokeWidth="1" />
              </g>
            ))}
            {/* new vec far away at (450, 80) */}
            <circle cx="450" cy="80" r="6" fill={C.red} />
            <text x="450" y="68" fontSize="11" fill={C.red} textAnchor="middle">new sub-vec [2.1, 1.9]</text>
            {/* dashed line to nearest centroid */}
            <line x1="450" y1="80" x2="200" y2="170" stroke={C.red} strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="320" y="115" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">distance = 1.8</text>
            {/* inset training avg label */}
            <rect x="380" y="220" width="180" height="46" fill={`${C.cyan}10`} stroke={`${C.cyan}30`} rx="6" />
            <text x="470" y="240" fontSize="11" fill={C.cyan} textAnchor="middle">training avg distance</text>
            <text x="470" y="258" fontSize="13" fill={C.cyan} textAnchor="middle" fontWeight="bold">= 0.3</text>
          </svg>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append the new SVG description for the new diagram in the `"11.14"` array of `src/data/svg-descriptions.json`**

Append (after the existing 9 entries):

```json
    "Slot-0 2D scatter showing a tight cluster of 256 gray X centroids around the origin with gray training dots inside, plus a red new-vector dot at (2.1, 1.9) far outside the cluster connected to the nearest centroid by a dashed line labeled distance = 1.8, alongside an inset label training avg distance = 0.3 and faded strikethrough dots indicating deleted training entries"
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- sections.test.jsx -t "ProductQuantization"`
Expected: PASS (8 tests).

Run: `npm run test -- svg-descriptions`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add PQ sub 6: insert/update/delete drift the codebooks"
```

---

## Task 8: Add PQ sub=7 — drift fix (oversample + retrain on error spike)

**Files:**
- Test: `src/__tests__/sections.test.jsx` (inside the PQ describe block)
- Modify: `src/sections/vector-compression.jsx` — insert `<Reveal when={sub >= 7}>` after the new sub=6 block from Task 7.
- Modify: `src/data/svg-descriptions.json` — append the second new description to the `"11.14"` array.

- [ ] **Step 1: Write the failing test**

```js
  it("sub=7 shows oversample + tombstones + retrain on error spike", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/oversample|100x|390x/i);
    expect(container.textContent).toMatch(/retrain/i);
    expect(container.textContent).toMatch(/tombstone|compact/i);
    expect(container.textContent).toMatch(/95p|95th|threshold/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Vespa/);
    expect(container.textContent).toMatch(/Milvus/);
    expect(container.textContent).toMatch(/Qdrant/);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=7 shows oversample"`
Expected: FAIL.

- [ ] **Step 3: Implement the new sub=7 Reveal**

Insert after the sub=6 block in `ProductQuantization`:

```jsx
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: oversample + tombstones + retrain when 95p error spikes
          </T>
          <svg
            viewBox="0 0 720 280"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Line chart of 95th-percentile reconstruction error over time from 0 to 50M vectors; the line is flat at
              baseline 0 to 10M, spikes between 10M and 20M, crosses a horizontal dashed retrain threshold at 15M, a
              vertical dashed line marks retrain triggered at 20M, then the line returns to baseline. Below the x-axis
              are colored ticks marking inserts, updates, and deletes.
            </desc>
            {/* axes */}
            <line x1="60" y1="40" x2="60" y2="220" stroke="#666" strokeWidth="1" />
            <line x1="60" y1="220" x2="700" y2="220" stroke="#666" strokeWidth="1" />
            <text x="40" y="125" fontSize="11" fill="#999" textAnchor="middle" transform="rotate(-90 40 125)">95p recon error</text>
            <text x="60" y="240" fontSize="11" fill="#999">0</text>
            <text x="700" y="240" fontSize="11" fill="#999" textAnchor="end">50M vectors</text>
            {/* threshold */}
            <line x1="60" y1="120" x2="700" y2="120" stroke={C.yellow} strokeDasharray="4 4" strokeWidth="1" />
            <text x="700" y="115" fontSize="11" fill={C.yellow} textAnchor="end">retrain threshold</text>
            {/* error line: flat 60-220 (0-10M), spike 220-360 (10-20M), drop back at 360, flat */}
            <polyline
              points="60,200 220,200 280,150 320,90 360,200 700,200"
              fill="none"
              stroke={C.red}
              strokeWidth="2"
            />
            {/* retrain trigger */}
            <line x1="360" y1="40" x2="360" y2="220" stroke={C.green} strokeDasharray="6 4" strokeWidth="1.5" />
            <text x="360" y="32" fontSize="11" fill={C.green} textAnchor="middle">retrain triggered (20M)</text>
            {/* op ticks below */}
            <text x="60" y="262" fontSize="11" fill="#999">ops:</text>
            {[
              { x: 110, c: C.cyan },
              { x: 150, c: C.cyan },
              { x: 190, c: C.yellow },
              { x: 240, c: C.cyan },
              { x: 290, c: C.red },
              { x: 340, c: C.yellow },
              { x: 410, c: C.cyan },
              { x: 470, c: C.red },
              { x: 540, c: C.cyan },
              { x: 620, c: C.yellow },
            ].map((t, i) => (
              <line key={i} x1={t.x} y1="252" x2={t.x} y2="262" stroke={t.c} strokeWidth="2" />
            ))}
            <text x="650" y="262" fontSize="10" fill={C.cyan}>insert</text>
            <text x="650" y="274" fontSize="10" fill={C.yellow}>update</text>
            <text x="700" y="262" fontSize="10" fill={C.red} textAnchor="end">delete</text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              { op: "INSERT / UPDATE", text: "re-encode with current codebooks; track 95p recon error" },
              { op: "DELETE", text: "tombstone in posting list; background compaction reclaims and reshapes residuals" },
              { op: "DRIFT", text: "95p error breach → train new codebooks on fresh sample (FAISS default 100x oversample), hot-swap" },
            ].map((row) => (
              <div
                key={row.op}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.green} bold size={14} style={{ minWidth: 130 }}>
                  {row.op}
                </T>
                <T color={C.bright} size={14}>
                  {row.text}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {[
              { name: "FAISS", line: "ProductQuantizer.train(new_set) + index rebuild" },
              { name: "Vespa", line: "background re-quantization with hot-swap" },
              { name: "Milvus", line: "scheduled IVF_PQ retraining + segment compaction" },
              { name: "Qdrant", line: "POST /collections/{name}/quantization + optimizer.deleted_threshold" },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {s.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace", textAlign: "center" }}>
                  {s.line}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description to `"11.14"` array**

```json
    "Line chart of 95th-percentile PQ reconstruction error over time from 0 to 50M vectors with a flat baseline rising into a spike between 10M and 20M, a horizontal dashed retrain threshold crossed at 15M, a vertical dashed line marking retrain triggered at 20M then a return to baseline, plus colored ticks below the x-axis marking inserts, updates, and deletes"
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- sections.test.jsx -t "ProductQuantization"`
Expected: PASS (9 tests).

Run: `npm run test`
Expected: full suite passes.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add PQ sub 7: oversample, tombstones, retrain on 95p error spike"
```

---

## Task 9: Renumber existing BQ sub=6 test to sub=8

**Files:**
- Test: `src/__tests__/sections.test.jsx:1042-1048`

- [ ] **Step 1: Edit the test**

```js
  it("sub=8 pairs BQ with HNSW for graph-accelerated stage 1", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Hamming/i);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/rerank|rescore/i);
  });
```

- [ ] **Step 2: Run tests; expect BQ sub=8 failure**

Run: `npm run test -- sections.test.jsx -t "BinaryQuantization"`
Expected: BQ "sub=8 pairs BQ with HNSW" FAILS.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/sections.test.jsx
git commit -m "Renumber BQ HNSW test sub=6 to sub=8 ahead of drift insert"
```

---

## Task 10: Shift BQ HNSW Reveal to sub=8 and bump SubBtn gate

**Files:**
- Modify: `src/sections/vector-compression.jsx:3367` (Reveal `sub >= 6` for HNSW + BQ block) and SubBtn gate at line 3523.

- [ ] **Step 1: Change `sub >= 6` to `sub >= 8`**

Around line 3367:

```jsx
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
```

- [ ] **Step 2: Change SubBtn gate at line 3523**

```jsx
      {sub < 8 && (
        <SubBtn
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- sections.test.jsx -t "BinaryQuantization"`
Expected: PASS (8 tests).

- [ ] **Step 4: Commit**

```bash
git add src/sections/vector-compression.jsx
git commit -m "Shift BQ HNSW sub from 6 to 8 to make room for drift content"
```

---

## Task 11: Add BQ sub=6 — sign threshold drift

**Files:**
- Test: `src/__tests__/sections.test.jsx` (inside BQ describe block)
- Modify: `src/sections/vector-compression.jsx` — insert new `<Reveal when={sub >= 6}>` after the existing `<Reveal when={sub >= 5}>` block of `BinaryQuantization`.
- Modify: `src/data/svg-descriptions.json` — append a new description to the `"11.15"` array.

- [ ] **Step 1: Write the failing test**

```js
  it("sub=6 shows insert/update/delete drift the sign threshold", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/sign/i);
    expect(container.textContent).toMatch(/51\s*\/\s*49|51\/49/);
    expect(container.textContent).toMatch(/78\s*\/\s*22|78\/22/);
    expect(container.textContent).toMatch(/dim 5|dim\s*5/i);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=6 shows insert/update/delete drift the sign threshold"`
Expected: FAIL.

- [ ] **Step 3: Implement the new sub=6 Reveal in `BinaryQuantization`**

Insert after the existing `<Reveal when={sub >= 5}>` block (production use + rerank) and before the now-shifted `<Reveal when={sub >= 8}>`:

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            New vector arrives: insert / update / delete drift the sign threshold
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { tag: "INSERT", caption: "new dim 5 batch mean = 0.4, bits collapse 78/22" },
              { tag: "UPDATE", caption: "re-binarized with stale threshold; same collapse" },
              { tag: "DELETE", caption: "bit-balance stats decay; old codes linger" },
            ].map((it) => (
              <div
                key={it.tag}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {it.tag}
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 4 }}>
                  {it.caption}
                </T>
              </div>
            ))}
          </div>
          <svg
            viewBox="0 0 720 320"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Two side-by-side histograms for dim 5: the left training distribution is centered at 0 with split 51/49
              labeled in green, the right drifted distribution is centered at 0.4 with split 78/22 labeled in red, and a
              vertical sign-threshold line at x = 0 cuts both. Below sit two 8-cell bit-grid rows showing training
              mostly mixed 0/1 vs drifted mostly 1s, with a small tombstone cell.
            </desc>
            {/* left histogram */}
            <text x="160" y="20" fontSize="13" fill={C.green} textAnchor="middle" fontWeight="bold">training (dim 5)</text>
            <line x1="40" y1="180" x2="280" y2="180" stroke="#666" />
            <line x1="160" y1="40" x2="160" y2="180" stroke="#888" strokeDasharray="3 3" />
            <text x="160" y="200" fontSize="10" fill="#888" textAnchor="middle">sign = 0</text>
            {[20, 40, 70, 95, 80, 50, 30, 15, 8].map((h, i) => (
              <rect key={i} x={50 + i * 25} y={180 - h} width="22" height={h} fill={`${C.green}aa`} />
            ))}
            <text x="160" y="225" fontSize="12" fill={C.green} textAnchor="middle" fontWeight="bold">split 51/49</text>
            {/* right histogram */}
            <text x="500" y="20" fontSize="13" fill={C.red} textAnchor="middle" fontWeight="bold">drifted (dim 5, mean 0.4)</text>
            <line x1="380" y1="180" x2="620" y2="180" stroke="#666" />
            <line x1="500" y1="40" x2="500" y2="180" stroke="#888" strokeDasharray="3 3" />
            <text x="500" y="200" fontSize="10" fill="#888" textAnchor="middle">sign = 0</text>
            {[5, 8, 12, 25, 50, 80, 95, 75, 40].map((h, i) => (
              <rect key={i} x={390 + i * 25} y={180 - h} width="22" height={h} fill={`${C.red}aa`} />
            ))}
            <text x="500" y="225" fontSize="12" fill={C.red} textAnchor="middle" fontWeight="bold">split 78/22</text>
            {/* bit grid rows */}
            <text x="40" y="265" fontSize="11" fill={C.green}>training:</text>
            {["0", "1", "0", "1", "1", "0", "1", "0"].map((b, i) => (
              <g key={i}>
                <rect x={120 + i * 24} y="252" width="20" height="20" fill={`${C.green}30`} stroke={`${C.green}80`} />
                <text x={130 + i * 24} y="266" fontSize="11" fill={C.bright} textAnchor="middle">{b}</text>
              </g>
            ))}
            <text x="40" y="300" fontSize="11" fill={C.red}>drifted:</text>
            {["1", "1", "1", "0", "1", "1", "1", "1"].map((b, i) => (
              <g key={i}>
                <rect x={120 + i * 24} y="287" width="20" height="20" fill={`${C.red}30`} stroke={`${C.red}80`} />
                <text x={130 + i * 24} y="301" fontSize="11" fill={C.bright} textAnchor="middle">{b}</text>
              </g>
            ))}
            {/* tombstone cell */}
            <rect x="320" y="287" width="20" height="20" fill="none" stroke="#888" strokeDasharray="2 2" />
            <line x1="320" y1="287" x2="340" y2="307" stroke="#888" strokeWidth="1" />
            <text x="350" y="301" fontSize="10" fill="#888">tombstone</text>
          </svg>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description to `"11.15"` array**

```json
    "Side-by-side histograms for dim 5: a green training distribution centered at 0 with split 51/49 and a red drifted distribution centered at 0.4 with split 78/22, both cut by a dashed sign threshold at x = 0; below are two 8-cell bit-grid rows showing training mostly mixed bits versus drifted mostly 1s plus a small tombstone cell"
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm run test -- sections.test.jsx -t "BinaryQuantization"`
Expected: PASS (9 tests).

Run: `npm run test -- svg-descriptions`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add BQ sub 6: insert/update/delete drift the sign threshold"
```

---

## Task 12: Add BQ sub=7 — drift fix (zero-centered models + bit-balance alert)

**Files:**
- Test: `src/__tests__/sections.test.jsx` (BQ describe block)
- Modify: `src/sections/vector-compression.jsx` — insert `<Reveal when={sub >= 7}>` after the new BQ sub=6 block.
- Modify: `src/data/svg-descriptions.json` — append the second new description to `"11.15"` array.

- [ ] **Step 1: Write the failing test**

```js
  it("sub=7 shows zero-centered models + bit-balance alert + compaction", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/zero[- ]centered/i);
    expect(container.textContent).toMatch(/bit[- ]balance/i);
    expect(container.textContent).toMatch(/compact|tombstone/i);
    expect(container.textContent).toMatch(/Cohere/);
    expect(container.textContent).toMatch(/Mixedbread|mxbai/i);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/i);
    expect(container.textContent).toMatch(/Milvus|Qdrant/);
    expect(container.textContent).toMatch(/70%|>\s*70/);
  });
```

- [ ] **Step 2: Run the test, verify failure**

Run: `npm run test -- sections.test.jsx -t "sub=7 shows zero-centered"`
Expected: FAIL.

- [ ] **Step 3: Implement the new sub=7 Reveal**

Insert after the BQ sub=6 block:

```jsx
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Industry fix: zero-centered models + bit-balance alert + compaction
          </T>
          <svg
            viewBox="0 0 720 220"
            style={{ width: "100%", maxWidth: 760, height: "auto", display: "block", marginTop: 14 }}
          >
            <desc>
              Bit-balance bar grid with 64 thin vertical bars, one per dim sample, where each bar height equals the
              absolute deviation from a 50/50 bit split. Most bars are short and green; a handful are tall and red,
              flagged with small alert badges above for dims with greater than 70 percent imbalance.
            </desc>
            <text x="60" y="22" fontSize="11" fill="#aaa">|bit_balance - 50%| per dim</text>
            <line x1="60" y1="180" x2="700" y2="180" stroke="#666" />
            <line x1="60" y1="40" x2="60" y2="180" stroke="#666" />
            {Array.from({ length: 64 }).map((_, i) => {
              const h = (i % 11 === 7 || i === 23 || i === 51) ? 110 : 8 + ((i * 17) % 28);
              const drift = h > 70;
              return (
                <g key={i}>
                  <rect
                    x={64 + i * 9.7}
                    y={180 - h}
                    width="6"
                    height={h}
                    fill={drift ? C.red : C.green}
                  />
                  {drift && (
                    <text x={67 + i * 9.7} y={180 - h - 4} fontSize="9" fill={C.red} textAnchor="middle">!</text>
                  )}
                </g>
              );
            })}
            <line x1="60" y1="110" x2="700" y2="110" stroke={C.yellow} strokeDasharray="3 3" />
            <text x="700" y="105" fontSize="10" fill={C.yellow} textAnchor="end">70% imbalance alert</text>
          </svg>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {[
              { op: "INSERT / UPDATE", text: "sign(x) on a zero-centered model needs no calibration; per-dim mean threshold updated incrementally if not centered" },
              { op: "DELETE", text: "tombstone bit; compaction job rewrites the bit table and re-counts balances" },
              { op: "DRIFT", text: "any dim with > 70% same value → re-binarize that dim or alert" },
            ].map((row) => (
              <div
                key={row.op}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.green} bold size={14} style={{ minWidth: 130 }}>
                  {row.op}
                </T>
                <T color={C.bright} size={14}>
                  {row.text}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {[
              { name: "Cohere Embed v3", line: "sign-based binary, no calibration" },
              { name: "Mixedbread mxbai-embed-large-v1", line: "zero-centered, sign threshold" },
              { name: "OpenAI text-embedding-3", line: "binary mode via sign" },
              { name: "Milvus / Qdrant", line: "custom per-dim threshold + drift monitor + segment compaction" },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {s.name}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4, fontFamily: "monospace", textAlign: "center" }}>
                  {s.line}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description to `"11.15"` array**

```json
    "Bit-balance bar grid with 64 thin vertical bars per dim sample where each bar height equals the absolute deviation from a 50/50 split; most bars are short and green while a handful are tall and red flagged with small alert badges above, with a horizontal yellow dashed 70 percent imbalance alert line"
```

- [ ] **Step 5: Run all tests + lint + build**

Run: `npm run test`
Expected: full suite passes.

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json
git commit -m "Add BQ sub 7: zero-centered models, bit-balance alert, compaction"
```

---

## Task 13: Update CLAUDE.md if any section/chapter structure summary needs nudging

**Files:**
- Modify (only if needed): `CLAUDE.md`

The chapter mapping table for Section 11 already lists 11.13/11.14/11.15 by name and component. The number of subs is not stated in CLAUDE.md, so no update is required by the project convention rule. Skip if nothing needs editing.

- [ ] **Step 1: Verify nothing in CLAUDE.md needs an update**

Run: `grep -n "sub.*=\s*[6-9]\|max.*sub\|11\.13\|11\.14\|11\.15" CLAUDE.md`
Expected: only the chapter table entries; no max-sub claims.

- [ ] **Step 2: Skip commit if no changes**

If no edit is needed, do not create an empty commit.

---

## Final verification

- [ ] Run `npm run test` — all green.
- [ ] Run `npm run lint` — no warnings or errors.
- [ ] Run `npm run build` — build succeeds.
- [ ] Run `npm run dev` and navigate to chapters 11.13 / 11.14 / 11.15. For each chapter, click Continue through all 9 subs (0–8) and verify:
  - Sub 6 (red Box) shows insert/update/delete drift problem with the appropriate SVG.
  - Sub 7 (green Box) shows the industry fix with the appropriate SVG.
  - Sub 8 shows the original integration content (HNSW/IVF for SQ; m-knob for PQ; HNSW + BQ for BQ).
  - Continue button disappears at sub 8 (last sub).
- [ ] Verify the "I love cats" / running-example aesthetic is not broken — drift content uses dim-level numbers consistent with the existing chapters (dim 5, [-1.2, 1.4], etc.).

If any visual issue is found at the dev server, file a follow-up sub-task in the plan rather than over-editing.
