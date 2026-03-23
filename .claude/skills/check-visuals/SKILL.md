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

## Checks to Run

### 1. SVG Overlap Detection

For each SVG in the target file(s):
- Parse all `<text>` elements - extract x, y (or cx, cy for circles) coordinates
- Parse all `<circle>` elements - extract cx, cy, r
- Parse all `<rect>` elements - extract x, y, width, height
- Flag any two text elements whose x,y are within 15px of each other (likely overlapping)
- Flag any circle whose center is within (r1 + r2) of another circle
- Flag any text element that falls inside a circle but is not intentionally centered on it
- Report: file, line number, element types, coordinates, and why they might overlap

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
