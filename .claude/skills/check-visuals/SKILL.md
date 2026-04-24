---
name: check-visuals
description: Validate chapter visuals for overlapping SVG elements, wrong Box colors, missing title alignment, and incorrect chapter references. Use after creating or modifying chapter content.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
---

# Check Visuals

Validate the visual correctness of chapter content. Run this after creating or modifying any chapter.

## Arguments

$ARGUMENTS optionally specifies a file or chapter to check. If omitted, check all section files.

## Static checks miss real-world overlap

Coordinate-math and grep catch a lot, but they **do not catch** these common classes of bugs:

- **Text crossing an axis or border.** A text element at `y=230` has baseline there, but its bounding box extends upward ~11px and may cross into other elements; without measuring actual rendered width you can't tell if it collides with neighbors.
- **Unanchored text running past a container.** `<text x="40" y="230">0.80</text>` defaults to `textAnchor="start"`, so "0.80" extends rightward past x=40+width and may run over a y-axis at x=60.
- **Circles or rects clipping a parent border.** `cx + r > containerRightEdge` is easy to compute, but only if the skill is told what the container bounds are.
- **Edge crossings in graph diagrams.** A planar 2D layout can hide non-planar graphs; you need pairwise segment-intersection to detect edge-vs-edge crossings.
- **Elements overlapping text via width, not position.** Monospace at 12px ≈ 7.2px per char; a 40-char label starting at x=30 ends at x=318, so a dot at cx=310 collides even though their `x` attributes differ by 280.

**When in doubt, render the page in Chrome via `mcp__claude-in-chrome__*` and take a screenshot.** The crossing detector below catches edge crossings programmatically; everything else should be visually verified when a change touches positions, widths, or container bounds.

## Checks to Run

### 1. SVG Overlap Detection

For each SVG in the target file(s):
- Parse all `<text>` elements - extract x, y (or cx, cy for circles) coordinates
- Parse all `<circle>` elements - extract cx, cy, r
- Parse all `<rect>` elements - extract x, y, width, height
- Flag any two text elements whose x,y are within 15px of each other (likely overlapping)
- Flag any circle whose center is within (r1 + r2) of another circle
- Flag any text element that falls inside a circle but is not intentionally centered on it
- **Estimate text width for monospace labels**: width ≈ chars * 7.2 at fontSize=12; width ≈ chars * 6 at fontSize=10. Flag any text+element pair where text's bounding box overlaps another element's bounds.
- **Check container bounds**: for each Box/rect that acts as a container, flag any child whose coords extend past the container edges (`cx + r > x + width`, `text_x + estimated_width > x + width`, etc.).
- Report: file, line number, element types, coordinates, and why they might overlap

### 1b. Edge-crossing detection (graph SVGs)

For any SVG that draws edges between labeled nodes (HNSW, Vamana, proximity graphs, attention graphs), pairwise-test all `<line>` elements for non-endpoint crossings.

**Static detection via file parsing is fragile** — JSX may pass coordinates through a lookup object. Prefer running the page and using the JS snippet below in the browser.

```js
function countCrossings(svg) {
  const lines = [...svg.querySelectorAll('line')].map(l => ({
    x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'),
    x2: +l.getAttribute('x2'), y2: +l.getAttribute('y2'),
  }));
  const intersects = (a, b) => {
    const eps = 0.01;
    const shares =
      (Math.abs(a.x1-b.x1)<1.5 && Math.abs(a.y1-b.y1)<1.5) ||
      (Math.abs(a.x1-b.x2)<1.5 && Math.abs(a.y1-b.y2)<1.5) ||
      (Math.abs(a.x2-b.x1)<1.5 && Math.abs(a.y2-b.y1)<1.5) ||
      (Math.abs(a.x2-b.x2)<1.5 && Math.abs(a.y2-b.y2)<1.5);
    if (shares) return false;
    const d1x=a.x2-a.x1, d1y=a.y2-a.y1, d2x=b.x2-b.x1, d2y=b.y2-b.y1;
    const denom = d1x*d2y - d1y*d2x;
    if (Math.abs(denom) < eps) return false;
    const t = ((b.x1-a.x1)*d2y - (b.y1-a.y1)*d2x) / denom;
    const s = ((b.x1-a.x1)*d1y - (b.y1-a.y1)*d1x) / denom;
    return t > eps && t < 1-eps && s > eps && s < 1-eps;
  };
  let n = 0;
  for (let i = 0; i < lines.length; i++)
    for (let j = i+1; j < lines.length; j++)
      if (intersects(lines[i], lines[j])) n++;
  return n;
}
```

Acceptable crossings only when they are **inherent to the concept being taught** (e.g. LSH random hyperplanes, whose whole purpose is to slice across each other). Annotate these in a comment so the skill's future runs know to skip them.

### 1c. Live visual verification via Chrome

When changes touch coordinates, dimensions, container bounds, or graph edges:

1. Confirm dev server is running on `http://localhost:5173/learn-ai/` (ask the user if unclear — don't start a duplicate).
2. Use `mcp__claude-in-chrome__tabs_context_mcp` / `tabs_create_mcp` to get a tab.
3. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch, sub, fingerprint})`; URL params are ignored. Use a high `sub` (e.g. 20) to force the chapter to reveal all sub-steps.
4. Run `countCrossings` (above) on the relevant SVG(s) and report the count.
5. For every chapter visually modified, take a screenshot (`mcp__claude-in-chrome__computer` action `screenshot`) and verify - don't claim a fix works because the math suggests it should.

**Specifically: if you just moved an element to avoid an overlap, take the screenshot before claiming the fix.** Bounding-box math is only an estimate; only the rendered pixels are ground truth.

### 2. Box Color Validation

```bash
grep -n "Box color={C.card}" src/sections/*.jsx
```
Any matches are errors - C.card makes boxes invisible against the dark background.

### 3. Title Center Alignment

For each Box component, check if the first `<T>` element inside it has the `center` prop.
Look for patterns like:
- `<Box ...><T ...>` where the T is missing `center` - this is an error
- The first T after a Box opening should always have `center`

### 4. Chapter Cross-References

Find all text mentioning "chapter X.Y" or "Ch X.Y" or "chapter X.Y" (case-insensitive):
```bash
grep -niE "(chapter|ch\.?)\s*[0-9]+\.[0-9]+" src/sections/*.jsx
```
For each reference found, verify the chapter ID exists in src/config.js chapters array.
Report any references to non-existent chapters.

### 5. Font Size Check

Flag any fontSize below 13 (except in SVG elements where smaller is acceptable).
Flag any content text with fontSize above 24.

### 6. Em-dash Check

```bash
grep -n "\u2014" src/sections/*.jsx
```
Em-dashes are forbidden per style rules. Report any found.

## Report Format

For each issue found, report:
- **File**: path and line number
- **Issue**: what's wrong
- **Fix**: suggested correction

If no issues found, report "All visual checks passed."
