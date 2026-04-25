# Chapter 11.14 PQ Visual + Prose Revamp - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all 7 sub-steps of `ProductQuantization` in `src/sections/vector-compression.jsx` so each opens with a punchline hook, leads with a hero SVG, then has plain-language prose. Keep all conceptual depth and scope.

**Architecture:** One sub-step per Reveal. Each Reveal contains: hook T (centered, 22px) → hero `<svg>` with `<desc>` → 1-2 short prose paragraphs → centered numbers/formula box → italic takeaway. SVG descriptions added to `src/data/svg-descriptions.json` under key `"11.14"` and the chapter id is added to `expectedChapters` in `src/__tests__/svg-descriptions.test.js`.

**Tech Stack:** React 18 inline JSX, Vitest for tests, existing `Box`/`T`/`Reveal`/`SubBtn` shared components and `C` color tokens.

---

## File Map

- **Modify:** `src/sections/vector-compression.jsx` lines 955-1616 (replace body of `ProductQuantization`)
- **Modify:** `src/data/svg-descriptions.json` (add `"11.14"` entry with 7 description strings)
- **Modify:** `src/__tests__/svg-descriptions.test.js` (add `"11.14"` to `expectedChapters`)
- **Modify:** `src/__tests__/sections.test.jsx` lines 893-942 (add hook-text assertions per sub)

---

## Task 1: Add 11.14 to manifest skeleton

Sets up the plumbing so subsequent tasks can append descriptions one at a time without breaking tests. Adds an empty-array placeholder is **not** allowed (manifest test enforces non-empty), so we add a single placeholder description and replace it as the first SVG lands in Task 2.

**Files:**
- Modify: `src/data/svg-descriptions.json`
- Modify: `src/__tests__/svg-descriptions.test.js`

- [ ] **Step 1: Add `"11.14"` to `expectedChapters` in the manifest test**

Edit `src/__tests__/svg-descriptions.test.js`. The `expectedChapters` array currently jumps from `"11.11"` to `"11.15"`. Insert `"11.14"` right after `"11.11"`:

```js
      "11.10",
      "11.11",
      "11.14",
      "11.15",
```

- [ ] **Step 2: Run the manifest test, confirm it fails**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js`
Expected: FAIL on `covers all chapters known to have SVGs` with message `Missing descriptions for chapter 11.14`.

- [ ] **Step 3: Add the `"11.14"` placeholder entry in `svg-descriptions.json`**

Edit `src/data/svg-descriptions.json`. Find the `"11.11"` entry, then immediately after its closing `]`, add the new entry. Place it between `"11.11"` and `"11.15"`:

```json
  "11.14": [
    "Banded horizontal vector bar split into 96 slot segments aligned across multiple stacked document rows, illustrating how PQ chops every vector at the same slot boundaries"
  ],
```

- [ ] **Step 4: Run the manifest test, confirm it passes**

Run: `npx vitest run src/__tests__/svg-descriptions.test.js`
Expected: PASS, all checks green.

- [ ] **Step 5: Run all tests to confirm nothing else broke**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
git commit -m "Add 11.14 PQ entry to SVG descriptions manifest"
```

---

## Task 2: Sub 0 - Cut one fat vector into 96 small ones (cyan)

**Files:**
- Modify: `src/sections/vector-compression.jsx` lines ~964-1080 (the `sub >= 0` Box)
- Modify: `src/__tests__/sections.test.jsx` lines ~896-901 (the `sub=0` test)
- Modify: `src/data/svg-descriptions.json` (replace placeholder for `"11.14"[0]`)

- [ ] **Step 1: Add hook-text assertion to the sub=0 test**

In `src/__tests__/sections.test.jsx`, find the `it("sub=0 splits 768-dim vector into 96 subvectors", ...)` test and append:

```jsx
  it("sub=0 splits 768-dim vector into 96 subvectors", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/sub[- ]?vector|split/i);
    expect(container.textContent).toMatch(/Cut one fat vector/i);
    expect(container.textContent).toMatch(/slot/i);
  });
```

- [ ] **Step 2: Run that single test, confirm it fails**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=0 splits 768-dim vector"`
Expected: FAIL on `Cut one fat vector` regex.

- [ ] **Step 3: Replace the sub=0 Box body in `vector-compression.jsx`**

Locate the `sub >= 0 && (...)` block inside `ProductQuantization` (starts around line 964 with `<Box color={C.cyan} ...>`) and replace its entire content with:

```jsx
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cut one fat vector into 96 small ones
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
              One 768-dim vector, banded into 96 slots
            </T>
            <svg
              viewBox="0 0 720 280"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                A 768-dim vector drawn as a long horizontal bar split into 96 colored segments (slots), with three
                stacked document rows below sharing the same slot boundaries to show that slot 0 covers the same dim
                range across every document.
              </desc>
              {/* Top vector with slot bands. 96 cells across the bar from x=20 to x=700. */}
              {Array.from({ length: 96 }).map((_, i) => {
                const cellW = 680 / 96;
                const x = 20 + i * cellW;
                let fill = `${C.cyan}22`;
                if (i < 4) fill = C.cyan;
                else if (i === 95) fill = `${C.cyan}cc`;
                return <rect key={i} x={x} y="40" width={cellW - 0.5} height="36" fill={fill} />;
              })}
              <text x="360" y="28" textAnchor="middle" fill={C.cyan} fontSize="13" fontWeight="bold">
                vector v &middot; 768 dims
              </text>
              {/* Slot labels for the first 4 + last */}
              <text x={20 + (680 / 96) * 0.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 0
              </text>
              <text x={20 + (680 / 96) * 1.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 1
              </text>
              <text x={20 + (680 / 96) * 2.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 2
              </text>
              <text x={20 + (680 / 96) * 3.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 3
              </text>
              <text x="360" y="92" textAnchor="middle" fill={C.dim} fontSize="11">
                . . .
              </text>
              <text x={20 + 680 - (680 / 96) * 0.5} y="92" textAnchor="middle" fill={C.bright} fontSize="11">
                slot 95
              </text>
              {/* Annotation pointing to slot 0 with "8 dims (dims 0-7)" */}
              <line
                x1={20 + (680 / 96) * 0.5}
                y1="105"
                x2={20 + (680 / 96) * 0.5}
                y2="125"
                stroke={C.cyan}
                strokeWidth="1"
              />
              <text x={20 + (680 / 96) * 0.5 + 70} y="120" textAnchor="middle" fill={C.cyan} fontSize="11">
                8 dims (dims 0-7)
              </text>
              {/* Three document rows stacked */}
              {[0, 1, 2].map((row) => {
                const y = 145 + row * 38;
                const label = `doc ${row + 1}`;
                return (
                  <g key={row}>
                    <text x="10" y={y + 17} textAnchor="start" fill={C.dim} fontSize="11">
                      {label}
                    </text>
                    {Array.from({ length: 96 }).map((_, i) => {
                      const cellW = 620 / 96;
                      const x = 60 + i * cellW;
                      let fill = `${C.cyan}18`;
                      if (i < 4) fill = `${C.cyan}aa`;
                      else if (i === 95) fill = `${C.cyan}66`;
                      return <rect key={i} x={x} y={y} width={cellW - 0.5} height="22" fill={fill} />;
                    })}
                  </g>
                );
              })}
              {/* Bracket on the right covering slot 0 column across all 3 doc rows */}
              <line x1={60 + (620 / 96) * 1} y1="142" x2={60 + (620 / 96) * 1} y2="262" stroke={C.cyan} strokeWidth="1" />
              <text x={60 + (620 / 96) * 1 + 12} y="208" textAnchor="start" fill={C.cyan} fontSize="11">
                slot 0 of every doc
              </text>
            </svg>
          </div>
          <T color="#80deea" style={{ marginTop: 12 }}>
            A 768-dim embedding is too fat to compress as a single thing. PQ&apos;s first move is to chop it into 96
            small pieces, 8 dims each. We call each piece a <strong>slot</strong>.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Why slots matter: every slot gets its own dictionary. Slot 0&apos;s dictionary only has to describe the
            patterns that appear in dims 0-7 across the whole corpus. That is a much easier job than describing all 768
            dims at once.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            d = 768 &middot; m = 96 &middot; <span style={{ color: C.cyan }}>d / m = 8 dims per slot</span>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One vector becomes 96 mini-problems. Each one is small enough to compress hard.
          </T>
        </Box>
      )}
```

- [ ] **Step 4: Replace the placeholder description in the manifest**

Edit `src/data/svg-descriptions.json`. Replace the single placeholder string in `"11.14"` with the final wording (it's the same intent, slightly tightened):

```json
  "11.14": [
    "A 768-dim vector banded into 96 slot segments, with three stacked document rows aligned at the same slot boundaries to show that slot 0 covers the same dim range across every document"
  ],
```

- [ ] **Step 5: Run the sub=0 test, confirm it passes**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=0 splits 768-dim vector"`
Expected: PASS.

- [ ] **Step 6: Run all tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 7: Run lint**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 0: vector-into-slots hero SVG and clearer prose"
```

---

## Task 3: Sub 1 - Each slot learns a 256-word dictionary (yellow)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 1}>` block, ~line 1081)
- Modify: `src/__tests__/sections.test.jsx` (sub=1 test)
- Modify: `src/data/svg-descriptions.json` (append to `"11.14"` array)

- [ ] **Step 1: Add hook-text assertion to the sub=1 test**

In `src/__tests__/sections.test.jsx`, append two assertions:

```jsx
  it("sub=1 runs k-means per slot with 256 centroids", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/256-word dictionary/i);
    expect(container.textContent).toMatch(/2\^8|fits in (a |one )?single byte|fits in a byte/i);
  });
```

- [ ] **Step 2: Run that test, confirm it fails**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=1 runs k-means"`
Expected: FAIL on `256-word dictionary` regex.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 1}>` block**

Replace the entire block (from `<Reveal when={sub >= 1}>` through its matching `</Reveal>`) with:

```jsx
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Each slot learns its own 256-word dictionary
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Slot 0 sub-vectors clustered by k-means (codebook = 256 centroids)
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              slot 0 is 8-D &middot; drawn here as 2-D for clarity
            </T>
            <svg
              viewBox="0 0 720 360"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 6 }}
            >
              <desc>
                A 2-D scatter projection of slot-0 sub-vectors with 16 highlighted k-means centroid markers labeled c0
                to c255 representing the 256 codebook entries that snap each sub-vector to its nearest prototype.
              </desc>
              {/* Background panel */}
              <rect x="20" y="20" width="460" height="320" fill={`${C.yellow}05`} stroke={`${C.yellow}22`} />
              {/* Random-looking dots representing slot-0 sub-vectors. Use a deterministic set. */}
              {[
                [60, 90], [80, 110], [120, 80], [150, 70], [180, 100], [210, 130], [90, 160], [130, 175], [170, 200],
                [200, 230], [240, 90], [275, 120], [310, 100], [340, 70], [370, 110], [400, 95], [410, 140], [380, 175],
                [350, 200], [310, 230], [255, 215], [225, 260], [185, 280], [140, 250], [110, 230], [70, 250], [60, 290],
                [115, 305], [165, 315], [220, 305], [270, 295], [320, 280], [365, 270], [410, 255], [440, 220], [445, 175],
                [430, 100], [395, 65], [330, 50], [275, 65], [225, 55], [165, 50], [110, 65], [85, 195], [105, 145],
                [195, 165], [235, 145], [285, 175], [330, 165], [375, 200], [305, 130], [255, 100], [195, 95], [145, 110],
                [135, 220], [185, 230], [235, 195], [290, 220], [355, 230], [395, 215], [400, 290], [350, 305], [285, 320],
                [240, 320], [195, 320], [150, 320], [100, 320], [70, 220], [55, 170], [50, 130], [70, 60], [120, 50],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.yellow}88`} />
              ))}
              {/* Centroid markers (16 representing 256). Larger filled circles with id labels. */}
              {[
                { x: 95, y: 95, id: "c0" },
                { x: 175, y: 100, id: "c1" },
                { x: 260, y: 95, id: "c5" },
                { x: 355, y: 80, id: "c17" },
                { x: 415, y: 130, id: "c42" },
                { x: 90, y: 175, id: "c89" },
                { x: 195, y: 200, id: "c97" },
                { x: 290, y: 195, id: "c103" },
                { x: 370, y: 215, id: "c142" },
                { x: 130, y: 260, id: "c170" },
                { x: 230, y: 270, id: "c188" },
                { x: 320, y: 260, id: "c201" },
                { x: 405, y: 280, id: "c220" },
                { x: 60, y: 300, id: "c238" },
                { x: 175, y: 305, id: "c247" },
                { x: 270, y: 310, id: "c255" },
              ].map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="9" fill={C.yellow} stroke="#08080d" strokeWidth="1.5" />
                  <text x={c.x} y={c.y + 22} textAnchor="middle" fill={C.yellow} fontSize="10" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              ))}
              <text x="250" y="14" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                slot 0 sub-vector cloud (corpus-wide)
              </text>
              {/* Side panel */}
              <rect x="510" y="40" width="190" height="280" fill={`${C.yellow}10`} stroke={`${C.yellow}22`} rx="6" />
              <text x="605" y="70" textAnchor="middle" fill={C.yellow} fontSize="13" fontWeight="bold">
                k-means on slot 0
              </text>
              <text x="605" y="100" textAnchor="middle" fill={C.bright} fontSize="11">
                input: billions of 8-D points
              </text>
              <text x="605" y="120" textAnchor="middle" fill={C.bright} fontSize="11">
                output: 256 centroids
              </text>
              <text x="605" y="155" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                = slot 0 codebook
              </text>
              <line x1="540" y1="180" x2="670" y2="180" stroke={`${C.yellow}44`} strokeWidth="1" />
              <text x="605" y="205" textAnchor="middle" fill={C.bright} fontSize="11">
                why exactly 256?
              </text>
              <text x="605" y="225" textAnchor="middle" fill={C.bright} fontSize="11">
                2^8 = 256
              </text>
              <text x="605" y="245" textAnchor="middle" fill={C.bright} fontSize="11">
                fits in a single byte
              </text>
              <text x="605" y="285" textAnchor="middle" fill={C.dim} fontSize="10">
                repeat for slots 1..95
              </text>
              <text x="605" y="305" textAnchor="middle" fill={C.dim} fontSize="10">
                = 96 codebooks total
              </text>
            </svg>
          </div>
          <T color="#ffe082" style={{ marginTop: 12 }}>
            Pick one slot - say slot 0. Look at slot 0&apos;s sub-vector across every document in the corpus. That is
            billions of 8-D points. Run k-means on them with k = 256.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            k-means finds 256 prototype points - call them <strong>centroids</strong> - that summarize this cloud. These
            256 centroids are slot 0&apos;s <strong>codebook</strong>. Every future slot-0 sub-vector will be replaced
            by whichever of these 256 it is closest to.
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Why exactly 256? Because 2^8 = 256, and that fits in a single byte. The whole PQ design is built around
            squeezing one slot into one byte.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            96 slots &middot; 256 centroids &middot; 8 dims &middot; 4 bytes ={" "}
            <span style={{ color: C.yellow }}>786 KB total codebook</span>
            <br />
            <span style={{ color: C.dim }}>(one-time cost &middot; fits in L2 cache)</span>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            256 prototypes per slot. 96 codebooks. The whole dictionary is L2-resident.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description to the manifest**

Edit `src/data/svg-descriptions.json`, append the new description to the `"11.14"` array (now position 1):

```json
  "11.14": [
    "A 768-dim vector banded into 96 slot segments, with three stacked document rows aligned at the same slot boundaries to show that slot 0 covers the same dim range across every document",
    "A 2-D scatter projection of slot-0 sub-vectors with 16 highlighted k-means centroid markers labeled c0 to c255, representing the 256 codebook entries that snap each sub-vector to its nearest prototype"
  ],
```

- [ ] **Step 5: Run sub=1 test, confirm it passes**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=1 runs k-means"`
Expected: PASS.

- [ ] **Step 6: Run all tests + lint**

Run: `npm run test && npm run lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 1: scatter-with-centroids hero SVG and clearer prose"
```

---

## Task 4: Sub 2 - Encode = snap each slice to its nearest prototype (green)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 2}>` block)
- Modify: `src/__tests__/sections.test.jsx` (sub=2 test)
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Add hook-text assertion to the sub=2 test**

```jsx
  it("sub=2 encodes each subvector to a centroid id", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/centroid id|code/i);
    expect(container.textContent).toMatch(/snap/i);
    expect(container.textContent).toMatch(/nearest prototype|nearest centroid/i);
    expect(container.textContent).toMatch(/96 bytes/i);
  });
```

- [ ] **Step 2: Run, confirm fail**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=2 encodes"`
Expected: FAIL on `snap` regex.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 2}>` block**

```jsx
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Encode = snap each slice to its nearest prototype
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              One sub-vector snaps to one centroid id (1 byte)
            </T>
            <svg
              viewBox="0 0 720 380"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Top half: a small scatter showing one query sub-vector as a green diamond with a thick arrow to its
                nearest centroid c17. Bottom half: a row of four input sub-vector bars snapping into a row of four byte
                boxes labeled with their assigned centroid ids, then a final assembled 96-byte code.
              </desc>
              <defs>
                <marker
                  id="snap-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L5,3 Z" fill={C.green} />
                </marker>
              </defs>
              {/* Top: small scatter */}
              <rect x="20" y="10" width="320" height="170" fill={`${C.green}05`} stroke={`${C.green}22`} />
              <text x="180" y="25" textAnchor="middle" fill={C.green} fontSize="11" fontWeight="bold">
                slot 0 cloud
              </text>
              {/* dim points */}
              {[
                [60, 60], [90, 80], [130, 50], [165, 90], [210, 70], [255, 110], [300, 60], [275, 145], [220, 145],
                [165, 145], [100, 130], [60, 110], [240, 90], [195, 105], [110, 95], [90, 155], [310, 130], [285, 90],
                [180, 60], [240, 160], [125, 110], [70, 145], [305, 100],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2" fill={`${C.yellow}66`} />
              ))}
              {/* centroids */}
              {[
                { x: 95, y: 70, id: "c5" },
                { x: 230, y: 90, id: "c17" },
                { x: 290, y: 140, id: "c89" },
                { x: 110, y: 145, id: "c142" },
              ].map((c, i) => (
                <g key={i}>
                  <circle cx={c.x} cy={c.y} r="7" fill={C.yellow} stroke="#08080d" strokeWidth="1" />
                  <text x={c.x} y={c.y + 18} textAnchor="middle" fill={C.yellow} fontSize="9" fontWeight="bold">
                    {c.id}
                  </text>
                </g>
              ))}
              {/* query sub-vector as green diamond */}
              <polygon points="200,80 215,95 200,110 185,95" fill={C.green} stroke="#08080d" strokeWidth="1" />
              <text x="170" y="78" textAnchor="end" fill={C.green} fontSize="10" fontWeight="bold">
                q sub
              </text>
              {/* arrow to nearest centroid (c17) */}
              <line x1="208" y1="90" x2="225" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
              <text x="225" y="78" textAnchor="middle" fill={C.green} fontSize="10">
                snap
              </text>
              {/* annotation: distances drawn dimly to other centroids */}
              <line x1="200" y1="95" x2="95" y2="70" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="95" x2="290" y2="140" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <line x1="200" y1="95" x2="110" y2="145" stroke={`${C.green}33`} strokeWidth="1" strokeDasharray="3,3" />
              <text x="180" y="170" textAnchor="middle" fill={C.dim} fontSize="10">
                closest of all 256 centroids = c17
              </text>
              {/* Right side: arrow + result */}
              <line x1="345" y1="90" x2="395" y2="90" stroke={C.green} strokeWidth="2" markerEnd="url(#snap-arrow)" />
              <rect x="400" y="68" width="80" height="46" fill={`${C.green}22`} stroke={C.green} strokeWidth="1.5" rx="4" />
              <text x="440" y="85" textAnchor="middle" fill={C.bright} fontSize="11">
                store
              </text>
              <text x="440" y="102" textAnchor="middle" fill={C.green} fontSize="14" fontWeight="bold">
                id 17
              </text>
              <text x="440" y="128" textAnchor="middle" fill={C.dim} fontSize="10">
                1 byte
              </text>
              {/* Bottom: row of 4 sub-vectors snapping to 4 bytes */}
              <text x="20" y="215" textAnchor="start" fill={C.green} fontSize="12" fontWeight="bold">
                doc 1: 4 of 96 slots
              </text>
              {[
                { slot: 0, vals: [0.81, 0.12, 0.45, 0.22], id: 17 },
                { slot: 1, vals: [0.63, 0.07, 0.38, 0.91], id: 203 },
                { slot: 2, vals: [0.44, 0.28, 0.56, 0.19], id: 89 },
                { slot: 3, vals: [0.72, 0.34, 0.15, 0.48], id: 142 },
              ].map((row, ri) => {
                const y = 240 + ri * 32;
                return (
                  <g key={ri}>
                    <text x="60" y={y + 14} textAnchor="end" fill={C.dim} fontSize="11">
                      slot {row.slot}
                    </text>
                    {/* sub-vector visualized as 4 small cells */}
                    {row.vals.map((v, ci) => (
                      <g key={ci}>
                        <rect
                          x={75 + ci * 28}
                          y={y}
                          width="26"
                          height="22"
                          fill={`${C.green}${Math.floor(v * 99)
                            .toString(16)
                            .padStart(2, "0")}`}
                          stroke={`${C.green}55`}
                        />
                        <text
                          x={75 + ci * 28 + 13}
                          y={y + 14}
                          textAnchor="middle"
                          fill={C.bright}
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {v.toFixed(2)}
                        </text>
                      </g>
                    ))}
                    {/* arrow */}
                    <line
                      x1="195"
                      y1={y + 11}
                      x2="240"
                      y2={y + 11}
                      stroke={C.green}
                      strokeWidth="1.5"
                      markerEnd="url(#snap-arrow)"
                    />
                    <text x="218" y={y + 7} textAnchor="middle" fill={C.dim} fontSize="9">
                      snap
                    </text>
                    {/* byte box */}
                    <rect
                      x="245"
                      y={y - 1}
                      width="60"
                      height="24"
                      fill={`${C.green}22`}
                      stroke={C.green}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    <text
                      x="275"
                      y={y + 16}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      id {row.id}
                    </text>
                  </g>
                );
              })}
              <text x="345" y="280" textAnchor="start" fill={C.dim} fontSize="11">
                ... 92 more slots ...
              </text>
              {/* Assembled byte string */}
              <rect x="20" y="330" width="680" height="40" fill={`${C.green}10`} stroke={C.green} strokeWidth="1.5" rx="4" />
              <text x="360" y="355" textAnchor="middle" fill={C.bright} fontSize="14" fontFamily="monospace">
                doc 1 PQ code = [17, 203, 89, 142, 88, 17, 250, 61, ..., 71]
                <tspan fill={C.green} fontWeight="bold">
                  {"   "}96 bytes
                </tspan>
              </text>
            </svg>
          </div>
          <T color="#80e8a5" style={{ marginTop: 12 }}>
            Now we have all 96 codebooks. Encoding a new document vector is just lookup.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            For each of its 96 slots, find the closest centroid in that slot&apos;s codebook. Write down that
            centroid&apos;s index - a number 0 to 255. That index fits in one byte.
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Repeat 96 times. The whole 768-dim vector is now 96 bytes. The original floats are thrown away. The index
            stores only the byte codes.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            doc 1 code = [17, 203, 89, 142, ..., 71]
            <br />
            <span style={{ color: C.green }}>96 centroid ids &middot; 1 byte each = 96 bytes total</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A vector becomes 96 byte-pointers into 96 tiny codebooks.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description**

Append to `"11.14"` array in `src/data/svg-descriptions.json`:

```json
    "Encoding step diagram showing one query sub-vector snapping to its nearest centroid c17, then a row of four sub-vector bars snapping to four byte boxes containing centroid ids that assemble into a 96-byte PQ code"
```

- [ ] **Step 5: Run sub=2 test, then all tests + lint**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=2 encodes"
npm run test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 2: snap-to-centroid hero SVG and clearer prose"
```

---

## Task 5: Sub 3 - 3,072 → 96 bytes per vector. 32× smaller. (orange)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 3}>` block)
- Modify: `src/__tests__/sections.test.jsx` (sub=3 test)
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Add hook-text assertion to the sub=3 test**

```jsx
  it("sub=3 shows 96 bytes = 32x compression", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/32/);
    expect(container.textContent).toMatch(/96 bytes per vector|per vector/i);
    expect(container.textContent).toMatch(/billion vectors in 96 GB|one server/i);
  });
```

- [ ] **Step 2: Run, confirm fail**

Run: `npx vitest run src/__tests__/sections.test.jsx -t "sub=3 shows 96 bytes"`
Expected: FAIL.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 3}>` block**

```jsx
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            3,072 bytes shrinks to 96 bytes per vector. 32x smaller.
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
            <T color={C.orange} bold center size={16}>
              Same vector. Two storage formats. Drawn to scale.
            </T>
            <svg
              viewBox="0 0 720 200"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Two horizontal bars drawn to scale comparing storage size: a wide cyan bar of 3072 bytes for the
                float32 vector and a narrow orange sliver of 96 bytes for the PQ code, with a 32x badge between them.
              </desc>
              {/* float32 bar (full width 640) */}
              <text x="20" y="40" textAnchor="start" fill={C.cyan} fontSize="13" fontWeight="bold">
                float32
              </text>
              <rect x="20" y="50" width="640" height="44" fill={C.cyan} stroke="#08080d" strokeWidth="1" rx="3" />
              <text x="340" y="79" textAnchor="middle" fill="#08080d" fontSize="14" fontWeight="bold">
                3,072 bytes / vector (768 dims &times; 4 B)
              </text>
              {/* PQ bar (1/32 width = 20px) */}
              <text x="20" y="125" textAnchor="start" fill={C.orange} fontSize="13" fontWeight="bold">
                PQ (m=96)
              </text>
              <rect x="20" y="135" width="20" height="44" fill={C.orange} stroke="#08080d" strokeWidth="1" rx="3" />
              <text x="55" y="164" textAnchor="start" fill={C.orange} fontSize="14" fontWeight="bold">
                96 bytes / vector
              </text>
              {/* 32x badge */}
              <rect x="555" y="125" width="120" height="60" fill={`${C.green}22`} stroke={C.green} strokeWidth="1.5" rx="6" />
              <text x="615" y="150" textAnchor="middle" fill={C.green} fontSize="22" fontWeight="bold">
                32x
              </text>
              <text x="615" y="170" textAnchor="middle" fill={C.green} fontSize="11">
                smaller
              </text>
            </svg>
          </div>
          <T color="#ffcc80" style={{ marginTop: 12 }}>
            One float32 vector at d = 768 takes 3,072 bytes. The PQ code at m = 96 takes 96 bytes. That is 32x smaller,
            per vector.
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            At billion-vector scale this changes the economics. Storage stops being the bottleneck. The whole corpus
            fits on one server with room for the graph index and a cache.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            float32: 768 &middot; 4 = <span style={{ color: C.cyan }}>3,072 bytes</span>
            <br />
            PQ (m=96): 96 &middot; 1 = <span style={{ color: C.orange }}>96 bytes</span>
            <br />
            <span style={{ color: C.green, fontWeight: "bold" }}>compression ratio = 32x</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { n: "1M", float: "3 GB", pq: "96 MB" },
              { n: "100M", float: "300 GB", pq: "9.6 GB" },
              { n: "1B", float: "3 TB", pq: "96 GB" },
            ].map((row) => (
              <div
                key={row.n}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}20`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold size={16}>
                  N = {row.n}
                </T>
                <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 14, color: C.dim, lineHeight: 1.7 }}>
                  float32: {row.float}
                  <br />
                  <span style={{ color: C.green, fontWeight: "bold" }}>PQ: {row.pq}</span>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A billion vectors in 96 GB. One server. That is why PQ exists.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description**

```json
    "Two horizontal bars drawn to scale comparing PQ storage: a wide cyan 3072-byte bar for float32 and a narrow orange 96-byte bar for PQ codes, with a 32x reduction badge"
```

- [ ] **Step 5: Run sub=3 test, all tests + lint**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=3 shows 96 bytes"
npm run test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 3: to-scale compression bars hero SVG"
```

---

## Task 6: Sub 4 - Don't reconstruct. Look up. (red)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 4}>` block)
- Modify: `src/__tests__/sections.test.jsx` (sub=4 test)
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Add hook-text assertion to sub=4 test**

```jsx
  it("sub=4 describes asymmetric distance via lookup table", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/lookup|table/i);
    expect(container.textContent).toMatch(/Don.t reconstruct|never reconstruct/i);
    expect(container.textContent).toMatch(/Once per query|once per query/i);
    expect(container.textContent).toMatch(/Per document|per doc/i);
  });
```

- [ ] **Step 2: Run, confirm fail**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=4 describes asymmetric"
```
Expected: FAIL.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 4}>` block**

```jsx
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Don&apos;t reconstruct. Look up.
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
            <T color={C.red} bold center size={16}>
              ADC: query stays float, doc stays code, distance is a sum of table reads
            </T>
            <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
              showing 8 of 96 slots for clarity
            </T>
            <svg
              viewBox="0 0 720 420"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 6 }}
            >
              <desc>
                Asymmetric distance computation diagram: top row shows the float query split into 8 sub-queries; middle
                row shows 8 vertical lookup tables of 256 rows each with one row highlighted per slot; bottom row shows
                the document's PQ code bytes pointing to the highlighted rows; arrows feed all 8 distances into a
                summation symbol producing the final document distance.
              </desc>
              {/* Top: query split into 8 sub-queries */}
              <text x="20" y="22" textAnchor="start" fill={C.red} fontSize="12" fontWeight="bold">
                query q (float32, 8 of 96 slots shown)
              </text>
              {Array.from({ length: 8 }).map((_, i) => {
                const x = 30 + i * 82;
                return (
                  <g key={i}>
                    <rect x={x} y="30" width="64" height="28" fill={`${C.red}22`} stroke={C.red} strokeWidth="1" rx="3" />
                    <text
                      x={x + 32}
                      y={48}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      q_{i}
                    </text>
                    {/* down arrow */}
                    <line x1={x + 32} y1="60" x2={x + 32} y2="78" stroke={C.red} strokeWidth="1.5" />
                    <polygon
                      points={`${x + 28},78 ${x + 36},78 ${x + 32},85`}
                      fill={C.red}
                    />
                  </g>
                );
              })}
              {/* Middle: 8 lookup tables, each a vertical strip of 8 rows representing 256 */}
              <text x="20" y="98" textAnchor="start" fill={C.red} fontSize="12" fontWeight="bold">
                precomputed table[s][c] (96 KB total, fits L2)
              </text>
              {[17, 203, 89, 142, 88, 17, 250, 61].map((codeId, slotIdx) => {
                const tx = 30 + slotIdx * 82;
                const highlightRow = codeId % 8; // visual stand-in for the 256 rows
                return (
                  <g key={slotIdx}>
                    {Array.from({ length: 8 }).map((_, r) => {
                      const ry = 105 + r * 22;
                      const fill = r === highlightRow ? `${C.yellow}aa` : `${C.red}10`;
                      const stroke = r === highlightRow ? C.yellow : `${C.red}33`;
                      return (
                        <g key={r}>
                          <rect x={tx} y={ry} width="64" height="20" fill={fill} stroke={stroke} strokeWidth="1" />
                          <text
                            x={tx + 32}
                            y={ry + 14}
                            textAnchor="middle"
                            fill={r === highlightRow ? "#08080d" : C.dim}
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {r === highlightRow
                              ? `d=${(0.05 + r * 0.08).toFixed(2)}`
                              : "."}
                          </text>
                        </g>
                      );
                    })}
                    <text x={tx + 32} y="296" textAnchor="middle" fill={C.dim} fontSize="9">
                      slot {slotIdx}
                    </text>
                  </g>
                );
              })}
              {/* Bottom: doc code bytes */}
              <text x="20" y="320" textAnchor="start" fill={C.red} fontSize="12" fontWeight="bold">
                doc PQ code (bytes)
              </text>
              {[17, 203, 89, 142, 88, 17, 250, 61].map((codeId, slotIdx) => {
                const tx = 30 + slotIdx * 82;
                return (
                  <g key={slotIdx}>
                    {/* arrow up from code byte to highlighted row */}
                    <line x1={tx + 32} y1="328" x2={tx + 32} y2={105 + (codeId % 8) * 22 + 20} stroke={`${C.yellow}77`} strokeWidth="1.2" strokeDasharray="3,3" />
                    <rect
                      x={tx}
                      y="332"
                      width="64"
                      height="28"
                      fill={`${C.green}22`}
                      stroke={C.green}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    <text
                      x={tx + 32}
                      y={350}
                      textAnchor="middle"
                      fill={C.bright}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {codeId}
                    </text>
                  </g>
                );
              })}
              {/* Sum at bottom */}
              <text x="360" y="395" textAnchor="middle" fill={C.red} fontSize="14" fontWeight="bold" fontFamily="monospace">
                &Sigma; 8 highlighted distances &rarr; full doc distance (after 96 of these)
              </text>
            </svg>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 12 }}>
            To search, the query stays as full floats. The documents stay as PQ codes. We never reconstruct.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            <strong>Once per query:</strong> compute the squared distance from each of the query&apos;s 96 sub-vectors
            to all 256 centroids in that slot&apos;s codebook. Save the results as 96 small lookup tables.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            <strong>Per document:</strong> read its 96 bytes. Each byte is an index into one of those tables. Sum the 96
            looked-up distances. That is the document&apos;s distance to the query.
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            No multiplications during the scan. Just memory lookups and adds. This is called{" "}
            <strong>Asymmetric Distance Computation</strong> - asymmetric because the query is precise but the docs are
            approximate.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            precompute: 96 &middot; 256 = 24,576 entries &asymp;{" "}
            <span style={{ color: C.red }}>96 KB (fits L2)</span>
            <br />
            per doc: <span style={{ color: C.red }}>96 lookups + 96 adds</span> &middot; no multiplies
            <br />
            <span style={{ color: C.dim }}>
              vs float32: 768 multiplies + 768 adds per doc (about 10x slower)
            </span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            PQ wins twice: 32x less memory and roughly 10x faster scans.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description**

```json
    "Asymmetric distance computation diagram showing the float query split into 8 sub-queries that index into 8 precomputed lookup tables; each document code byte points to one highlighted row per table and the 8 distances sum to the document's distance"
```

- [ ] **Step 5: Run tests + lint**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=4 describes asymmetric"
npm run test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 4: ADC table-lookup hero SVG and clearer prose"
```

---

## Task 7: Sub 5 - OPQ rotates first, then splits (purple)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 5}>` block)
- Modify: `src/__tests__/sections.test.jsx` (sub=5 test)
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Add hook-text assertion to sub=5 test**

```jsx
  it("sub=5 explains OPQ rotation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OPQ/);
    expect(container.textContent).toMatch(/rotat/i);
    expect(container.textContent).toMatch(/decorrelat|correlat/i);
    expect(container.textContent).toMatch(/rotate first/i);
    expect(container.textContent).toMatch(/0\.94|0\.89/);
  });
```

- [ ] **Step 2: Run, confirm fail**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=5 explains OPQ"
```
Expected: FAIL.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 5}>` block**

```jsx
      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            OPQ: rotate first, so the slots line up with the data
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
              Same data. Different axes. Tighter clusters.
            </T>
            <svg
              viewBox="0 0 720 320"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Two side-by-side scatter plots illustrating OPQ. Left plot shows an elongated diagonal cluster of points
                with a vertical slot boundary cutting through it awkwardly. Right plot shows the same points after a
                learned rotation, now axis-aligned, with the slot boundary cleanly separating two tight sub-clusters.
              </desc>
              <defs>
                <marker
                  id="opq-arrow"
                  markerWidth="6"
                  markerHeight="6"
                  refX="5"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L5,3 Z" fill={C.purple} />
                </marker>
              </defs>
              {/* Left scatter - plain PQ */}
              <rect x="20" y="40" width="280" height="240" fill={`${C.red}05`} stroke={`${C.red}33`} />
              <text x="160" y="32" textAnchor="middle" fill={C.red} fontSize="13" fontWeight="bold">
                plain PQ: correlated dims
              </text>
              {/* elongated diagonal cluster */}
              {[
                [55, 240], [70, 225], [85, 215], [100, 205], [115, 195], [130, 185], [145, 175], [160, 165], [175, 155],
                [190, 145], [205, 135], [220, 125], [235, 115], [250, 105], [265, 95], [280, 85], [55, 250], [80, 235],
                [105, 220], [130, 200], [155, 180], [180, 160], [205, 140], [230, 120], [255, 100], [265, 80], [70, 245],
                [95, 230], [120, 210], [145, 190], [170, 170], [195, 150], [220, 130], [245, 110], [270, 90],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.red}aa`} />
              ))}
              {/* slot boundary - dashed vertical */}
              <line x1="160" y1="40" x2="160" y2="280" stroke={C.yellow} strokeWidth="2" strokeDasharray="6,4" />
              <text x="160" y="298" textAnchor="middle" fill={C.yellow} fontSize="10">
                slot boundary
              </text>
              <text x="160" y="312" textAnchor="middle" fill={C.dim} fontSize="9">
                cluster crosses boundary &rarr; loose k-means
              </text>
              {/* Curved arrow between plots */}
              <path d="M 310 160 Q 360 100 410 160" stroke={C.purple} strokeWidth="2" fill="none" markerEnd="url(#opq-arrow)" />
              <text x="360" y="95" textAnchor="middle" fill={C.purple} fontSize="11" fontWeight="bold">
                &times; R (learned)
              </text>
              {/* Right scatter - OPQ + PQ */}
              <rect x="420" y="40" width="280" height="240" fill={`${C.green}05`} stroke={`${C.green}33`} />
              <text x="560" y="32" textAnchor="middle" fill={C.green} fontSize="13" fontWeight="bold">
                OPQ + PQ: rotated, decorrelated
              </text>
              {/* axis-aligned cluster: two tighter sub-blobs */}
              {[
                [475, 100], [485, 110], [495, 105], [505, 115], [490, 95], [500, 100], [515, 110], [480, 120],
                [510, 95], [520, 105], [495, 125], [475, 115], [505, 130], [485, 130], [515, 125], [525, 115],
                [495, 140], [475, 130], [505, 110], [485, 100],
                [605, 200], [615, 210], [625, 205], [635, 215], [620, 195], [630, 200], [645, 210], [610, 220],
                [640, 195], [650, 205], [625, 225], [605, 215], [635, 230], [615, 230], [645, 225], [655, 215],
                [625, 240], [605, 230], [635, 210], [615, 200],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={`${C.green}aa`} />
              ))}
              {/* slot boundary - dashed vertical */}
              <line x1="560" y1="40" x2="560" y2="280" stroke={C.yellow} strokeWidth="2" strokeDasharray="6,4" />
              <text x="560" y="298" textAnchor="middle" fill={C.yellow} fontSize="10">
                slot boundary
              </text>
              <text x="560" y="312" textAnchor="middle" fill={C.dim} fontSize="9">
                clean split &rarr; tight k-means clusters
              </text>
            </svg>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 12 }}>
            Real embedding dimensions are not independent. Dim 0 and dim 200 might be highly correlated. When PQ chops
            the vector by raw position, correlated information gets split across slots and each slot&apos;s k-means
            sees a stretched, awkward cloud.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            <strong>OPQ</strong> fixes this: learn an orthonormal rotation matrix R alongside the codebooks. Apply Rv to
            every vector before splitting. The rotation decorrelates the dimensions, the per-slot clusters become tight
            and round, k-means fits them better, and recall goes up.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            pipeline: v &rarr; <span style={{ color: C.purple }}>Rv</span> &rarr; split &rarr; encode
            <br />
            recall@10 at m = 96: plain PQ <span style={{ color: C.red }}>0.89</span> &middot; OPQ + PQ{" "}
            <span style={{ color: C.green }}>0.94</span>
            <br />
            <span style={{ color: C.dim }}>R is 768 &times; 768 orthonormal &middot; learned alongside codebooks</span>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Free recall bump for one extra matrix multiply. FAISS, ScaNN, and Qdrant all default to OPQ.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description**

```json
    "Two side-by-side scatter plots illustrating OPQ: a left plot with an elongated diagonal cluster awkwardly crossing the slot boundary, and a right plot showing the same data after a learned rotation that aligns clusters with slot axes for tighter k-means fits"
```

- [ ] **Step 5: Run tests + lint**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=5 explains OPQ"
npm run test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 5: OPQ rotation hero SVG and clearer prose"
```

---

## Task 8: Sub 6 - Tune m for your recall target (pink)

**Files:**
- Modify: `src/sections/vector-compression.jsx` (the `<Reveal when={sub >= 6}>` block)
- Modify: `src/__tests__/sections.test.jsx` (sub=6 test)
- Modify: `src/data/svg-descriptions.json`

- [ ] **Step 1: Add hook-text assertion to sub=6 test**

```jsx
  it("sub=6 shows the recall-compression curve", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/m\s*=\s*96|m=96/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/compress/i);
    expect(container.textContent).toMatch(/only knob|knob/i);
    expect(container.textContent).toMatch(/sweet spot/i);
  });
```

- [ ] **Step 2: Run, confirm fail**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=6 shows the recall"
```
Expected: FAIL.

- [ ] **Step 3: Replace the `<Reveal when={sub >= 6}>` block**

Keep the existing 4-row table at the bottom; replace only the top portion (hook + new SVG + new prose). Result:

```jsx
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            m is the only knob: bytes-per-vector vs recall
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color={C.pink} bold center size={16}>
              Higher m: bigger codes, better recall. m = 96 is the sweet spot.
            </T>
            <svg
              viewBox="0 0 720 300"
              style={{ width: "100%", maxWidth: 740, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Dual-axis line chart showing how m affects bytes-per-vector and recall@10. The orange bytes-per-vector
                line rises linearly from 8 at m=8 to 192 at m=192. The green recall@10 curve rises from 0.81 to 0.98
                and flattens; a vertical highlight band at m=96 marks the production sweet spot.
              </desc>
              {/* Axis box */}
              <line x1="80" y1="50" x2="80" y2="240" stroke={C.dim} strokeWidth="1" />
              <line x1="80" y1="240" x2="640" y2="240" stroke={C.dim} strokeWidth="1" />
              <line x1="640" y1="50" x2="640" y2="240" stroke={C.dim} strokeWidth="1" />
              {/* X-axis ticks: m = 8, 48, 96, 192 spread along x=80..640 */}
              {[
                { m: 8, x: 80 },
                { m: 48, x: 220 },
                { m: 96, x: 360 },
                { m: 192, x: 640 },
              ].map((t) => (
                <g key={t.m}>
                  <line x1={t.x} y1="240" x2={t.x} y2="246" stroke={C.dim} strokeWidth="1" />
                  <text x={t.x} y="262" textAnchor="middle" fill={C.bright} fontSize="11" fontFamily="monospace">
                    m = {t.m}
                  </text>
                </g>
              ))}
              <text x="360" y="285" textAnchor="middle" fill={C.bright} fontSize="12" fontWeight="bold">
                m (number of slots)
              </text>
              {/* Highlight band at m=96 */}
              <rect x="335" y="50" width="50" height="190" fill={`${C.pink}18`} />
              <text x="360" y="46" textAnchor="middle" fill={C.pink} fontSize="11" fontWeight="bold">
                production sweet spot
              </text>
              {/* Left y-axis label (recall) */}
              <text x="36" y="148" textAnchor="middle" fill={C.green} fontSize="12" fontWeight="bold" transform="rotate(-90 36 148)">
                recall@10
              </text>
              {/* Right y-axis label (bytes) */}
              <text x="688" y="148" textAnchor="middle" fill={C.orange} fontSize="12" fontWeight="bold" transform="rotate(90 688 148)">
                bytes / vec
              </text>
              {/* Recall y-axis ticks */}
              {[
                { v: 0.8, y: 230 },
                { v: 0.9, y: 150 },
                { v: 1.0, y: 70 },
              ].map((t, i) => (
                <g key={i}>
                  <line x1="74" y1={t.y} x2="80" y2={t.y} stroke={C.green} strokeWidth="1" />
                  <text x="68" y={t.y + 4} textAnchor="end" fill={C.green} fontSize="10" fontFamily="monospace">
                    {t.v.toFixed(1)}
                  </text>
                </g>
              ))}
              {/* Bytes y-axis ticks */}
              {[
                { v: 8, y: 232 },
                { v: 96, y: 150 },
                { v: 192, y: 70 },
              ].map((t, i) => (
                <g key={i}>
                  <line x1="640" y1={t.y} x2="646" y2={t.y} stroke={C.orange} strokeWidth="1" />
                  <text x="652" y={t.y + 4} textAnchor="start" fill={C.orange} fontSize="10" fontFamily="monospace">
                    {t.v}
                  </text>
                </g>
              ))}
              {/* Bytes line - linear from (80,232) m=8 to (640,70) m=192 */}
              <line x1="80" y1="232" x2="220" y2="200" stroke={C.orange} strokeWidth="2" />
              <line x1="220" y1="200" x2="360" y2="150" stroke={C.orange} strokeWidth="2" />
              <line x1="360" y1="150" x2="640" y2="70" stroke={C.orange} strokeWidth="2" />
              {/* Bytes points */}
              {[
                { x: 80, y: 232 },
                { x: 220, y: 200 },
                { x: 360, y: 150 },
                { x: 640, y: 70 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.orange} stroke="#08080d" strokeWidth="1" />
              ))}
              {/* Recall curve - rising and flattening from 0.81 to 0.98 */}
              {/* recall axis: 0.8 -> y=230, 1.0 -> y=70; range 0.2 over 160 */}
              {/* values: 0.81 -> y=222, 0.91 -> y=142, 0.96 -> y=102, 0.98 -> y=86 */}
              <path d="M 80 222 Q 150 200 220 142 Q 290 110 360 102 Q 500 95 640 86" stroke={C.green} strokeWidth="2.5" fill="none" />
              {[
                { x: 80, y: 222, label: "0.81" },
                { x: 220, y: 142, label: "0.91" },
                { x: 360, y: 102, label: "0.96" },
                { x: 640, y: 86, label: "0.98" },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill={C.green} stroke="#08080d" strokeWidth="1" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fill={C.green} fontSize="10" fontFamily="monospace">
                    {p.label}
                  </text>
                </g>
              ))}
              {/* Legend */}
              <rect x="500" y="55" width="130" height="40" fill="rgba(0,0,0,0.4)" stroke={`${C.pink}44`} rx="4" />
              <line x1="510" y1="68" x2="528" y2="68" stroke={C.green} strokeWidth="2.5" />
              <text x="534" y="72" textAnchor="start" fill={C.green} fontSize="10">
                recall@10 (OPQ)
              </text>
              <line x1="510" y1="84" x2="528" y2="84" stroke={C.orange} strokeWidth="2" />
              <text x="534" y="88" textAnchor="start" fill={C.orange} fontSize="10">
                bytes per vector
              </text>
            </svg>
          </div>
          <T color="#f8aee0" style={{ marginTop: 12 }}>
            m controls everything. Higher m means smaller sub-vectors, simpler k-means, tighter approximation, higher
            recall. But it also means more bytes per encoded vector. Pick the smallest m that hits your recall target.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 13,
              }}
            >
              {["m", "bytes/vec", "compression", "recall@10 (OPQ)", "typical use"].map((h, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    padding: "8px 6px",
                    background: `${C.pink}14`,
                    color: C.pink,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 4,
                  }}
                >
                  {h}
                </div>
              ))}
              {[
                { m: "8", bytes: "8", ratio: "384x", recall: "0.81", use: "extreme scale" },
                { m: "48", bytes: "48", ratio: "64x", recall: "0.91", use: "web-scale search" },
                { m: "96", bytes: "96", ratio: "32x", recall: "0.96", use: "the production sweet spot" },
                { m: "192", bytes: "192", ratio: "16x", recall: "0.98", use: "recall-sensitive workloads" },
              ].map((row, i) => (
                <div key={`r-${i}`} style={{ display: "contents" }}>
                  {[row.m, row.bytes, row.ratio, row.recall, row.use].map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        padding: "8px 6px",
                        textAlign: "center",
                        color: ci === 4 ? C.dim : C.bright,
                        background: i === 2 ? `${C.pink}08` : "transparent",
                        fontWeight: i === 2 && ci !== 4 ? "bold" : "normal",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color="#f8aee0" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            m = 96 (32x compression, 0.96 recall) is the canonical setting in FAISS and Qdrant.
          </T>
        </Box>
      </Reveal>
```

- [ ] **Step 4: Append SVG description**

```json
    "Dual-axis line chart of m versus bytes-per-vector (orange) and recall@10 (green) at m = 8, 48, 96, 192, with a vertical highlight band at m = 96 marking the production sweet spot"
```

- [ ] **Step 5: Run tests + lint**

```
npx vitest run src/__tests__/sections.test.jsx -t "sub=6 shows the recall"
npm run test
npm run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/vector-compression.jsx src/data/svg-descriptions.json src/__tests__/sections.test.jsx
git commit -m "Revamp 11.14 sub 6: dual-axis tuning chart hero SVG"
```

---

## Task 9: Coverage and browser walkthrough

**Files:**
- None modified, only verification

- [ ] **Step 1: Run full test suite with coverage**

Run: `npx vitest run --coverage`
Expected: PASS. Confirm lines 100%, branches >= 97.7% (no regression).

- [ ] **Step 2: Run lint and prettier check**

Run: `npm run lint`
Expected: clean.

- [ ] **Step 3: Build to confirm production bundle is valid**

Run: `npm run build`
Expected: builds without errors.

- [ ] **Step 4: Browser walkthrough**

Run: `npm run dev` (background)
Open `http://localhost:5173/learn-ai/` and navigate to chapter 11.14. Click through all 7 reveals. For each one verify:
- Hook text reads cleanly at the top
- SVG renders correctly (no clipping, labels readable, no element overlap)
- Prose reads naturally on a single pass
- Numbers/formula box is centered and readable
- Italic takeaway is visible at the bottom

If any SVG element overlaps text or another element, fix the coordinates inline in `vector-compression.jsx` and re-run `npm run test`.

- [ ] **Step 5: Final commit if any browser fixes were needed**

```bash
git add src/sections/vector-compression.jsx
git commit -m "Polish 11.14 SVG layout fixes from browser walkthrough"
```

---

## Self-review checklist (run before handoff)

- All 7 sub-steps got a hook, SVG, prose rewrite, numbers box, italic takeaway
- All 7 SVGs have a `<desc>` first child
- `svg-descriptions.json["11.14"]` has exactly 7 entries
- `expectedChapters` in svg-descriptions.test.js includes "11.14"
- All `sections.test.jsx` PQ assertions pass with the new prose (kept anchor terms: "768", "96", "256", "centroid", "codebook", "k-means", "asymmetric", "OPQ", "rotat", "decorrelat", "m=96", "recall", "compress")
- No em-dashes anywhere in new content
- All Box titles use `T ... bold center`
- All standalone formula boxes have `textAlign: "center"`
- Body text 16-19px, titles 22px
- No invisible boxes (no `Box color={C.card}`)
