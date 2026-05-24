# Section-Parent Restructure + Super-Sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flip `config.js` so sections own their ordered chapter list, replace chapter-ID-based chunk hashing with stable-slug hashing, and group the 28 sections under 6 narrative super-sections in the TOC.

**Architecture:** Single-PR refactor. New `sections` + `superSections` exports in `config.js`. Old shape (`chapters`, `sectionNames`, `sectionColors`) is computed and re-exported so 95% of call sites are untouched. Search index migrates from `chapterId` to `chapterSlug` in the chunk hash, with `slug = chapter.file` (full file path) for guaranteed uniqueness. TOC gains a two-level accordion with auto-open of the current chapter's super-section + section. Per-section progress bar and chapter IDs visible to users (`1.x..28.x`) stay unchanged.

**Tech Stack:** React 18, Vite, Vitest, MiniSearch, transformers.js (BGE quantized model). Inline styles. 100% coverage gate on `src/config.js`, `src/components.jsx`, `src/nav-persistence.js`, `src/chapters/**/*.jsx`, `src/shared/**/*.jsx`.

**Spec:** `docs/superpowers/specs/2026-05-19-section-parent-and-supersections-design.md`

---

## File Structure

### Files to modify

- `src/config.js` — Rewrite shape. New `sections`, `superSections`, derived `chapters` / `sectionNames` / `sectionColors`. Extend `validateConfig` for slug uniqueness, super membership, contiguous section nums.
- `src/nav-persistence.js` — Fingerprint switches from `c.id` to `c.slug`.
- `src/search-overlay.jsx` — Lookup uses `r.chapterSlug` instead of `r.chapterId`. Render derives `chapterId`, `section`, `sectionName` from live config.
- `src/search.js` — `chunkById`, `dedupeByChapter`, `shape()`, `storeFields` switch to slug-based identity. Output still surfaces `chapterId`/`section`/`sectionName` derived at search-time.
- `src/learn-ai.jsx` — No structural change. `expanded` state remains; its value shape becomes `null | { super, section }`. Reset on chapter change unchanged.
- `src/chapters/table-of-contents/toc.jsx` — Two-level accordion. Reads `superSections` + `sections` from config. Auto-opens super + section of current chapter.
- `scripts/build-search-index.mjs` — Consume new config shape (flattens via derived `chapters` export). `chunkId` uses slug. chunks.json shape drops `chapterId`/`section`/`sectionName`, adds `chapterSlug`.
- `src/data/chunks.json` — Regenerated.
- `src/data/embeddings.bin` — Regenerated.
- `src/data/embeddings-manifest.json` — Regenerated.
- `src/data/chunk-cache.json` — Unchanged in practice (cache is keyed by chapter content hash), but will be rewritten on regen.
- `CLAUDE.md` — Update "How To: Add a New Chapter" and "How To: Reorder Chapters" sections.

### Tests to modify

- `src/__tests__/config.test.js` — Add tests for new exports + validation rules.
- `src/__tests__/nav-persistence.test.js` — Fingerprint tests use slug.
- `src/__tests__/search.test.js` (if present — verify in Task 4) — Slug-based mock data.
- `src/__tests__/search-overlay.test.jsx` — Result rows render via slug lookup.
- `src/__tests__/build-search-index.test.js` — Mock chunks shape with `chapterSlug`. Assertions on chunks.json output use new shape.
- `src/__tests__/chapters/table-of-contents/toc.test.jsx` — Rewrite for two-level accordion + auto-open.

### Files NOT touched

- `src/chapters/**/*.jsx` — Chapter content files. They have never known their section/ID.
- `src/main.jsx` — Entry point. Untouched.
- `src/components.jsx` — Shared components. Untouched.
- `src/shared/**/*.jsx` — Helpers. Untouched.
- `public/llms.txt`, `index.html`, `public/sitemap.xml`, `public/og.png` — Discoverability metadata. Chapter IDs/section names unchanged, so these stay valid.

---

## Phase 0 — Branch + baseline check

### Task 0.1: Verify clean baseline

**Files:** none

- [ ] **Step 1: Confirm working tree clean**

Run: `git status`
Expected: `working tree clean` on branch `chapter-wise-file`.

- [ ] **Step 2: Confirm tests + lint + build pass on baseline**

Run: `npm run test && npm run lint && npm run build`
Expected: all green. If anything fails, stop and surface to user before continuing.

- [ ] **Step 3: Note baseline embeddings.bin size for sanity check at end**

Run: `ls -la src/data/embeddings.bin src/data/chunks.json`
Expected: record the byte sizes. After regen at Phase 5 the chunks.json size should be similar (~same chunk count). embeddings.bin size should be byte-for-byte close (same chunk count × same dim × int8).

---

## Phase 1 — New config.js shape

### Task 1.1: Add `superSections` export with failing test

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write the failing test**

Add to `src/__tests__/config.test.js` (top, after existing imports — add `superSections` to the import line first):

```js
// In existing import:
import {
  chapters,
  sectionNames,
  sectionColors,
  superSections,
  C,
  validateConfig,
} from "../config.js";
```

Then add a new `describe` block at the bottom of the file (before the final closing brace of the outer `describe("config.js")`):

```js
  describe("superSections", () => {
    it("exports exactly 6 super-sections with ids A..F", () => {
      expect(superSections).toHaveLength(6);
      expect(superSections.map((s) => s.id)).toEqual(["A", "B", "C", "D", "E", "F"]);
    });

    it("every super-section has required fields", () => {
      superSections.forEach((s) => {
        expect(typeof s.id).toBe("string");
        expect(typeof s.name).toBe("string");
        expect(Array.isArray(s.sections)).toBe(true);
        expect(typeof s.color).toBe("string");
        expect(s.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it("super-section names match the agreed spec", () => {
      const names = Object.fromEntries(superSections.map((s) => [s.id, s.name]));
      expect(names).toEqual({
        A: "Foundations of Deep Learning",
        B: "The Rise of LLMs",
        C: "The Transformer Era",
        D: "Vector Databases at Depth",
        E: "Retrieval-Augmented Generation (RAG)",
        F: "Agentic AI",
      });
    });

    it("super-section section lists cover sections 1..28 exactly once", () => {
      const flat = superSections.flatMap((s) => s.sections);
      const sorted = [...flat].sort((a, b) => a - b);
      expect(sorted).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
    });

    it("super-section section lists match the agreed spec", () => {
      const groups = Object.fromEntries(superSections.map((s) => [s.id, s.sections]));
      expect(groups).toEqual({
        A: [1, 2, 3, 4],
        B: [5, 6],
        C: [7, 8, 9, 10, 11, 12, 13, 14],
        D: [15, 16, 17, 18],
        E: [19, 20, 21, 22, 23],
        F: [24, 25, 26, 27, 28],
      });
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: 5 failures in the new `superSections` describe block, error mentioning `superSections is undefined` or `expect(superSections).toHaveLength` mismatch.

- [ ] **Step 3: Add the `superSections` export**

At the bottom of `src/config.js`, just before the `validateConfig` function, add:

```js
export const superSections = [
  { id: "A", name: "Foundations of Deep Learning",         color: "#ff6b6b", sections: [1, 2, 3, 4] },
  { id: "B", name: "The Rise of LLMs",                     color: "#00b8d4", sections: [5, 6] },
  { id: "C", name: "The Transformer Era",                  color: "#a78bfa", sections: [7, 8, 9, 10, 11, 12, 13, 14] },
  { id: "D", name: "Vector Databases at Depth",            color: "#f06292", sections: [15, 16, 17, 18] },
  { id: "E", name: "Retrieval-Augmented Generation (RAG)", color: "#9ccc65", sections: [19, 20, 21, 22, 23] },
  { id: "F", name: "Agentic AI",                           color: "#4fc3f7", sections: [24, 25, 26, 27, 28] },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: all `superSections` tests pass. Existing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add superSections export grouping 28 sections into 6 parts"
```

### Task 1.2: Add `slug` field to every chapter with failing test

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write the failing test**

Add to the `describe("config.js")` block in `src/__tests__/config.test.js`:

```js
  it("every chapter has a slug equal to its file path", () => {
    chapters.forEach((c) => {
      if (c.section === 0) return;          // section 0 (TOC) is special
      expect(typeof c.slug).toBe("string");
      expect(c.slug).toBe(c.file);
    });
  });

  it("no duplicate slugs across chapters", () => {
    const slugs = chapters.filter((c) => c.section > 0).map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js -t "slug"`
Expected: failure — `c.slug` is `undefined`.

- [ ] **Step 3: Add `slug` to every chapter entry**

For every chapter object in `src/config.js` (≈230 entries), add `slug: <same value as file>` immediately after the `file:` field.

Mechanical edit. Example before:

```js
  {
    id: "1.1",
    title: "What is a Neural Network?",
    section: 1,
    component: "WhatIsNN",
    file: "neural-foundations/what-is-nn",
  },
```

After:

```js
  {
    id: "1.1",
    title: "What is a Neural Network?",
    section: 1,
    component: "WhatIsNN",
    file: "neural-foundations/what-is-nn",
    slug: "neural-foundations/what-is-nn",
  },
```

Apply to every chapter where `section > 0`. Skip the section-0 TOC entry (it has `file: "table-of-contents/toc"` — add slug to it as well for symmetry, value `"table-of-contents/toc"`; the test skips section 0 so either way the test passes, but adding the slug keeps the shape uniform).

Use a simple find-and-replace per chapter: search for ` file: "` (with the leading space) — for each match, copy the path and add the slug line below. A scripted multi-file edit is fine; verify by running the test.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add stable slug field equal to file path on every chapter"
```

### Task 1.3: Add `super` field to each section in `sectionNames` lookup

**Goal:** prepare the per-section `super: "A".."F"` mapping that the new shape will rely on. We do this incrementally before flipping the shape.

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write the failing test**

Add to `src/__tests__/config.test.js` inside the `describe("superSections")` block:

```js
    it("every section 1..28 maps to exactly one super-section via sectionSuper", async () => {
      const mod = await import("../config.js");
      expect(mod.sectionSuper).toBeDefined();
      for (let s = 1; s <= 28; s++) {
        expect(mod.sectionSuper[s]).toMatch(/^[A-F]$/);
      }
      // Coverage matches superSections.sections
      superSections.forEach((sg) => {
        sg.sections.forEach((sNum) => {
          expect(mod.sectionSuper[sNum]).toBe(sg.id);
        });
      });
    });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js -t "sectionSuper"`
Expected: failure — `mod.sectionSuper` is `undefined`.

- [ ] **Step 3: Add `sectionSuper` derived export**

At the bottom of `src/config.js`, after the `superSections` definition (and before `validateConfig`), add:

```js
// Reverse index: section number → super-section id. Derived from superSections.
export const sectionSuper = (() => {
  const out = {};
  for (const sg of superSections) {
    for (const s of sg.sections) out[s] = sg.id;
  }
  return out;
})();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add sectionSuper reverse-index mapping section number to super-section"
```

### Task 1.4: Extend `validateConfig` with slug + super coverage checks

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `src/__tests__/config.test.js` in the `describe("config.js")` block:

```js
  describe("validateConfig (extended)", () => {
    it("flags duplicate slugs", () => {
      const errs = validateConfig([
        { id: "1.1", component: "A", file: "x/a", slug: "dup" },
        { id: "1.2", component: "B", file: "x/b", slug: "dup" },
      ]);
      expect(errs.some((e) => /Duplicate.*slug/i.test(e))).toBe(true);
    });

    it("flags chapters missing slug", () => {
      const errs = validateConfig([{ id: "1.1", component: "A", file: "x/a" }]);
      expect(errs.some((e) => /missing.*slug/i.test(e))).toBe(true);
    });

    it("returns no errors for current config", () => {
      const errs = validateConfig(chapters.filter((c) => c.section > 0));
      expect(errs).toEqual([]);
    });
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/config.test.js -t "validateConfig"`
Expected: the "duplicate slug" and "missing slug" assertions fail.

- [ ] **Step 3: Extend `validateConfig`**

Replace the existing `validateConfig` body in `src/config.js`:

```js
export function validateConfig(chapterList) {
  const errors = [];
  const ids = chapterList.map((c) => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) errors.push(`Duplicate chapter IDs: ${dupes.join(", ")}`);

  const slugs = chapterList.filter((c) => c.slug).map((c) => c.slug);
  const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupeSlugs.length) errors.push(`Duplicate slugs: ${dupeSlugs.join(", ")}`);

  chapterList.forEach((c) => {
    if (c.component && !c.id) errors.push(`Chapter missing id: ${c.component}`);
    if (!c.component) errors.push(`Chapter missing component: id=${c.id}`);
    if (!c.slug) errors.push(`Chapter missing slug: id=${c.id}`);
  });
  return errors;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Validate slug presence and uniqueness in validateConfig"
```

### Task 1.5: Flip `config.js` to section-parent shape with derived `chapters`

This is the central source-of-truth flip. After this task, IDs are derived from position; inserting / reordering chapters never requires manual renumbering.

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

- [ ] **Step 1: Lift per-section descriptions into a temporary lookup**

The current TOC component (`src/chapters/table-of-contents/toc.jsx`) holds an inline array with one-line `desc` strings for each section. Those need to live in `config.js` so the new `sections` array can own them. Copy each section's `desc` from `toc.jsx` (the 28 entries in the local `sections` array, lines 5-169 of the current file) into a temporary `SECTION_DESCS` object you will paste into `config.js`:

```js
// Paste this in src/config.js (temporary, deleted after the flip is verified).
const SECTION_DESCS = {
  1: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
  2: "Loss, derivatives, backward pass, gradient descent, why deep backprop is hard",
  3: "Vectors, dot product, matrices, layer = matmul, activation functions",
  // ... copy all 28 entries verbatim from src/chapters/table-of-contents/toc.jsx
};
```

(Open `src/chapters/table-of-contents/toc.jsx` while doing this — every `desc:` field there maps 1:1 to a section number. Do not paraphrase. Copy verbatim.)

- [ ] **Step 2: Write the failing test that locks in the new shape**

Add to `src/__tests__/config.test.js`:

```js
  describe("sections (source of truth)", () => {
    it("exports a sections array with 28 entries, num 1..28", async () => {
      const mod = await import("../config.js");
      expect(mod.sections).toBeDefined();
      expect(mod.sections).toHaveLength(28);
      mod.sections.forEach((s, i) => expect(s.num).toBe(i + 1));
    });

    it("every section has name, color, desc, super, chapters[]", async () => {
      const mod = await import("../config.js");
      mod.sections.forEach((s) => {
        expect(typeof s.name).toBe("string");
        expect(typeof s.color).toBe("string");
        expect(typeof s.desc).toBe("string");
        expect(typeof s.super).toBe("string");
        expect(s.super).toMatch(/^[A-F]$/);
        expect(Array.isArray(s.chapters)).toBe(true);
        s.chapters.forEach((c) => {
          expect(typeof c.slug).toBe("string");
          expect(typeof c.file).toBe("string");
          expect(typeof c.title).toBe("string");
          expect(typeof c.component).toBe("string");
        });
      });
    });

    it("derived chapters export matches the equivalent of the old flat array", async () => {
      const mod = await import("../config.js");
      // Section 0 + 28 sections × their chapters.
      const fromSections = [];
      // Section 0 (TOC) is special — it lives outside `sections`.
      // The derived chapters export must keep the TOC entry at index 0.
      expect(mod.chapters[0].id).toBe("0");
      expect(mod.chapters[0].component).toBe("TOC");

      let cursor = 1;
      mod.sections.forEach((s) => {
        s.chapters.forEach((c, i) => {
          const derived = mod.chapters[cursor++];
          expect(derived.id).toBe(`${s.num}.${i + 1}`);
          expect(derived.slug).toBe(c.slug);
          expect(derived.file).toBe(c.file);
          expect(derived.title).toBe(c.title);
          expect(derived.component).toBe(c.component);
          expect(derived.section).toBe(s.num);
        });
        fromSections.push(s.chapters.length);
      });
      expect(cursor).toBe(mod.chapters.length);
    });

    it("derived sectionNames and sectionColors match the original objects", async () => {
      const mod = await import("../config.js");
      mod.sections.forEach((s) => {
        expect(mod.sectionNames[s.num]).toBe(s.name);
        expect(mod.sectionColors[s.num]).toBe(s.color);
      });
    });

    it("every section's super field points to the correct super-section", async () => {
      const mod = await import("../config.js");
      mod.sections.forEach((s) => {
        expect(mod.sectionSuper[s.num]).toBe(s.super);
      });
    });
  });
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/config.test.js -t "sections"`
Expected: `mod.sections` is undefined — multiple failures.

- [ ] **Step 4: Rewrite `src/config.js` to the section-parent shape**

This is the largest edit in the plan. Approach:

1. **Capture today's data into a script-able structure.** In a scratch file or REPL, group the existing flat `chapters` array by `section` field, preserving order. Each group becomes one `sections` entry. Pair with the existing `sectionNames[s]` (name), `sectionColors[s]` (color), `SECTION_DESCS[s]` (desc), `sectionSuper[s]` (super).
2. **Replace the top of `src/config.js`.** Delete the entire flat `export const chapters = [...]` array (lines 1 through ~end of array). Replace with:

```js
export const sections = [
  {
    num: 1,
    name: "Neural Networks - The Mechanics",
    color: "#ff6b6b",
    desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
    super: "A",
    chapters: [
      { slug: "neural-foundations/what-is-nn",    file: "neural-foundations/what-is-nn",    title: "What is a Neural Network?",          component: "WhatIsNN" },
      { slug: "neural-foundations/inside-neuron", file: "neural-foundations/inside-neuron", title: "Inside a Single Neuron",             component: "InsideNeuron" },
      // ... rest of section 1's chapters in order, exactly as they appear in the current flat array
    ],
  },
  // ... 27 more section entries, 2..28
];
```

3. **Keep section 0 (TOC) as a separate `OVERVIEW_CHAPTER` constant**:

```js
const OVERVIEW_CHAPTER = {
  id: "0",
  title: "Table of Contents",
  section: 0,
  component: "TOC",
  file: "table-of-contents/toc",
  slug: "table-of-contents/toc",
};
```

4. **Derive the back-compat exports** at the bottom of the file (above `validateConfig`):

```js
export const chapters = (() => {
  const out = [OVERVIEW_CHAPTER];
  sections.forEach((s) => {
    s.chapters.forEach((c, i) => {
      out.push({
        id: `${s.num}.${i + 1}`,
        slug: c.slug,
        file: c.file,
        title: c.title,
        component: c.component,
        section: s.num,
      });
    });
  });
  return out;
})();

export const sectionNames = Object.fromEntries([[0, "Overview"], ...sections.map((s) => [s.num, s.name])]);
export const sectionColors = Object.fromEntries(sections.map((s) => [s.num, s.color]));
```

5. **Remove the now-duplicated `superSections`, `sectionSuper`, the temporary `SECTION_DESCS` object, and the old standalone `sectionNames` / `sectionColors` exports** that existed before this task. Re-add `superSections` and `sectionSuper` exports if they were positioned before `sections` (move them after `sections` to keep the source readable). `sectionSuper` still derives the same way:

```js
export const sectionSuper = (() => {
  const out = {};
  for (const sg of superSections) for (const s of sg.sections) out[s] = sg.id;
  return out;
})();
```

6. **Update `validateConfig`** to also accept the `sections` shape:

```js
export function validateConfig(chapterList) {
  // (unchanged signature; existing tests still pass it the derived chapters list)
  const errors = [];
  const ids = chapterList.map((c) => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) errors.push(`Duplicate chapter IDs: ${dupes.join(", ")}`);

  const slugs = chapterList.filter((c) => c.slug).map((c) => c.slug);
  const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupeSlugs.length) errors.push(`Duplicate slugs: ${dupeSlugs.join(", ")}`);

  chapterList.forEach((c) => {
    if (c.component && !c.id) errors.push(`Chapter missing id: ${c.component}`);
    if (!c.component) errors.push(`Chapter missing component: id=${c.id}`);
    if (!c.slug) errors.push(`Chapter missing slug: id=${c.id}`);
  });
  return errors;
}
```

(Existing tests pass the derived `chapters` array in; this still works because the derived chapters carry both `id` and `slug`.)

- [ ] **Step 5: Run all config tests**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: all pass, including the existing legacy ones from before this PR.

- [ ] **Step 6: Run full test suite to catch any indirect regressions**

Run: `npm run test`
Expected: all pass. Any failure here means a consumer that the back-compat derived exports didn't fully cover. Fix before commit.

Common things that might surface:
- A chapter ordering mismatch — confirm the derived `chapters` list, when filtered to a section, matches the old flat array's chapter order for that section exactly.
- A section that was missing from `SECTION_DESCS` — the test "every section has name, color, desc" will catch this.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Flip config.js to section-parent shape, derive chapters from position"
```

---

## Phase 2 — Slug-based nav-persistence fingerprint

### Task 2.1: Switch nav-persistence fingerprint to slug

**Files:**
- Modify: `src/nav-persistence.js`
- Modify: `src/__tests__/nav-persistence.test.js`

- [ ] **Step 1: Read the existing test file**

Read `src/__tests__/nav-persistence.test.js` to confirm current test names, so the update edits the right assertions.

- [ ] **Step 2: Update the failing test first**

Replace any test that asserts the fingerprint is built from `c.id` to assert it is built from `c.slug`. Specifically, find tests that build a fake `chapters` array and pass it to `saveNav` / `loadNav`. Update them so each fake chapter has a `slug` field, and the assertion checks slug-based behavior.

Add a new test inside the existing `describe`:

```js
  it("fingerprint changes when slug list changes (and is independent of ID)", () => {
    const a = [{ id: "1.1", slug: "x/a" }, { id: "1.2", slug: "x/b" }];
    const b = [{ id: "9.9", slug: "x/a" }, { id: "9.8", slug: "x/b" }]; // ID-renumbered, slugs same
    saveNav(0, 0, a);
    // Loading with renumbered IDs but identical slugs should succeed.
    expect(loadNav(b)).toEqual({ ch: 0, sub: 0 });
  });

  it("fingerprint is invalidated when slugs differ", () => {
    const a = [{ id: "1.1", slug: "x/a" }, { id: "1.2", slug: "x/b" }];
    const c = [{ id: "1.1", slug: "x/a" }, { id: "1.2", slug: "x/c" }]; // slug changed
    saveNav(0, 0, a);
    expect(loadNav(c)).toBeNull();
  });
```

(If the test file already imports `saveNav` and `loadNav`, you're good. If it does not, add `import { saveNav, loadNav } from "../nav-persistence.js";`.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/__tests__/nav-persistence.test.js`
Expected: one or both new tests fail because the current fingerprint uses `c.id`, so ID-renumbered chapters with identical slugs are flagged as different.

- [ ] **Step 4: Update `nav-persistence.js`**

In `src/nav-persistence.js`, change the `fingerprint` function:

```js
function fingerprint(chapters) {
  return chapters.map((c) => c.slug).join(",");
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/__tests__/nav-persistence.test.js`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/nav-persistence.js src/__tests__/nav-persistence.test.js
git commit -m "Switch nav-persistence fingerprint from chapter id to slug"
```

---

## Phase 3 — Slug-based search index build

### Task 3.1: Update build-search-index to use chapter slug in chunkId

**Files:**
- Modify: `scripts/build-search-index.mjs`
- Modify: `src/__tests__/build-search-index.test.js`

- [ ] **Step 1: Update the test setup to include slug on chapters**

In `src/__tests__/build-search-index.test.js`, every place that creates a fake chapter (e.g. `{ id: "1.1", title: "T", section: 1, file: "..." }`), add a `slug` field equal to the `file` value. Example:

```js
const chapters = [
  { id: "1.1", title: "What is a Neural Network?", section: 1, file: "neural-foundations/what-is-nn", slug: "neural-foundations/what-is-nn" },
];
```

- [ ] **Step 2: Add a failing test asserting chunks carry chapterSlug and not chapterId/section**

Append to the existing `describe("build-search-index")` block in `src/__tests__/build-search-index.test.js`:

```js
  it("writes chunks with chapterSlug field, drops chapterId/section/sectionName from each chunk", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "T",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, file: "neural-foundations/what-is-nn", slug: "neural-foundations/what-is-nn" }],
      sectionNames: { 1: "S1" },
    });

    const out = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(out).toHaveLength(1);
    expect(out[0].chapterSlug).toBe("neural-foundations/what-is-nn");
    expect(out[0]).not.toHaveProperty("chapterId");
    expect(out[0]).not.toHaveProperty("section");
    expect(out[0]).not.toHaveProperty("sectionName");
    expect(out[0]).toHaveProperty("chapterTitle", "T");
    expect(out[0]).toHaveProperty("sub", 0);
    expect(out[0]).toHaveProperty("kind", "concept");
  });

  it("chunkId is stable across chapter renumber (uses slug, not id)", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        { sub: 0, kind: "concept", text: "T", summary: "S", queries: ["q1","q2","q3","q4","q5"], terms: ["t"] },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, file: "neural-foundations/what-is-nn", slug: "neural-foundations/what-is-nn" }],
      sectionNames: { 1: "S1" },
    });
    const firstId = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"))[0].id;

    // Same content, renumbered ID + different section, same slug.
    // The chunker mock returns under the new ID key, since it's keyed by chapter id passed in.
    mockChunk.mockResolvedValue({
      9.7: [
        { sub: 0, kind: "concept", text: "T", summary: "S", queries: ["q1","q2","q3","q4","q5"], terms: ["t"] },
      ],
    });
    // Edit source to force cache miss (chunkSection re-called).
    writeFileSync(
      join(workDir, "src", "chapters", "neural-foundations", "what-is-nn.jsx"),
      "export const WhatIsNN = () => <div>SAME CONTENT V2</div>;",
    );
    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "9.7", title: "T", section: 9, file: "neural-foundations/what-is-nn", slug: "neural-foundations/what-is-nn" }],
      sectionNames: { 9: "S9" },
    });
    const secondId = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"))[0].id;

    expect(secondId).toBe(firstId);
  });
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/__tests__/build-search-index.test.js`
Expected: the two new tests fail. The first because `chapterId`/`section` are still present on output. The second because `chunkId` currently uses `chapterId`, so the IDs differ.

- [ ] **Step 4: Update `scripts/build-search-index.mjs`**

Edit `chunkId` (line 42-44):

```js
function chunkId(chapterSlug, sub, kind, text) {
  return sha256_16(`${chapterSlug}|${sub}|${kind}|${sha256_16(text)}`);
}
```

Edit the chunk emit block (around lines 145-160) so each output object uses slug and drops the old fields:

```js
      all.push({
        id: chunkId(ch.slug, c.sub, c.kind, c.text),
        chapterSlug: ch.slug,
        chapterTitle: ch.title,
        sub: c.sub,
        kind: c.kind,
        text: c.text,
        summary: c.summary,
        queries: c.queries,
        terms: c.terms,
      });
```

Also delete the now-unused `section` / `sectionName` extras that were being attached to per-chunk objects from the cache reuse branch (lines 124-127 in the cache-hit path do not stamp the output; only `slot[i]` carries the cached chunks. Look at the loop that builds `all` — it's the only place where output objects are constructed). Confirm `sectionNames` argument is no longer referenced inside `runBuild`. If it is only used in the LLM-call branch as `sectionName: sectionNames[ch.section] || ""` passed into `chunkSection`, leave that — the LLM uses it for chunking context, not for output identity. Do not remove the `sectionNames` parameter from `runBuild`; downstream callers still pass it.

Search for any other place that writes `chapterId` / `section` / `sectionName` into the per-chunk record and remove. Use:

```bash
grep -n "chapterId\|sectionName" scripts/build-search-index.mjs
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/__tests__/build-search-index.test.js`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-search-index.mjs src/__tests__/build-search-index.test.js
git commit -m "Switch chunkId to chapter slug and drop chapterId/section from chunks output"
```

### Task 3.2: Update `chapterCmp` sort key for new chunks shape

`chapterCmp` currently sorts by parsing `chapterId` (`"1.10"` → `[1, 10]`). After Task 3.1, each chunk no longer has a `chapterId`, but it still has a `chapterSlug` plus the original chapter passes through `ch.id` in `slot`. The sort needs a stable order that does not depend on `chapterId`.

**Files:**
- Modify: `scripts/build-search-index.mjs`

- [ ] **Step 1: Inspect current sort site**

Look at `scripts/build-search-index.mjs` lines 46-55 for the `chapterCmp` function and where it is called. Determine whether sorting happens on input chapters (which still have `id`) or on output chunks (which now lack `chapterId`).

- [ ] **Step 2: Add failing test for chunks.json ordering**

Append to `src/__tests__/build-search-index.test.js`:

```js
  it("chunks output is ordered by (section, position_in_section, sub)", async () => {
    mockChunk
      .mockResolvedValueOnce({
        2.1: [{ sub: 0, kind: "concept", text: "C2", summary: "", queries: ["a","b","c","d","e"], terms: ["t"] }],
      })
      .mockResolvedValueOnce({
        1.2: [
          { sub: 1, kind: "concept", text: "C1B", summary: "", queries: ["a","b","c","d","e"], terms: ["t"] },
          { sub: 0, kind: "concept", text: "C1A", summary: "", queries: ["a","b","c","d","e"], terms: ["t"] },
        ],
      });

    mkdirSync(join(workDir, "src", "chapters", "x"), { recursive: true });
    writeFileSync(join(workDir, "src", "chapters", "x", "a.jsx"), "x");
    writeFileSync(join(workDir, "src", "chapters", "x", "b.jsx"), "y");

    await runBuild({
      rootDir: workDir,
      chapters: [
        { id: "2.1", title: "X21", section: 2, file: "x/a", slug: "x/a" },
        { id: "1.2", title: "X12", section: 1, file: "x/b", slug: "x/b" },
      ],
      sectionNames: { 1: "S1", 2: "S2" },
    });

    const out = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    // After sort: section 1 (chapter 1.2) comes first, then its subs in order, then 2.1.
    expect(out.map((c) => c.text)).toEqual(["C1A", "C1B", "C2"]);
  });
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/__tests__/build-search-index.test.js -t "ordered by"`
Expected: failure — current order may interleave or sort wrong.

- [ ] **Step 4: Update the sort logic**

Make the sort key derive from the original `(ch.section, position_in_section, sub, kind)`. Easiest: keep the input chapter order (input is given pre-ordered) and instead sort chunks by `(inputChapterIndex, sub, kindOrder)`.

Replace `chapterCmp` and its call site in `scripts/build-search-index.mjs`. Inside `runBuild`, after the loop building `all`, sort with a key derived from `slot` position:

```js
// Build a map slug → input index once, before the worker loop.
const slugOrder = new Map(tasks.map((t, i) => [t.ch.slug, i]));

// ... existing worker code unchanged ...

// After `all` is populated:
const KIND_ORDER = { concept: 0, formula: 1, example: 2, diagram: 3, summary: 4 };
all.sort((a, b) => {
  const ia = slugOrder.get(a.chapterSlug);
  const ib = slugOrder.get(b.chapterSlug);
  if (ia !== ib) return ia - ib;
  if (a.sub !== b.sub) return a.sub - b.sub;
  return (KIND_ORDER[a.kind] ?? 99) - (KIND_ORDER[b.kind] ?? 99);
});
```

Delete the old `chapterCmp` function and any place it was called (look for `.sort(chapterCmp)` in the file).

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/__tests__/build-search-index.test.js`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-search-index.mjs src/__tests__/build-search-index.test.js
git commit -m "Sort chunks by input chapter order, sub, kind (slug-based, ID-free)"
```

---

## Phase 4 — Search runtime: slug lookups

### Task 4.1: Update `src/search.js` to consume slug-stamped chunks

**Files:**
- Modify: `src/search.js`

- [ ] **Step 1: Read current search.js shape**

Open `src/search.js`. Identify:
- `miniSearch` config: `storeFields` line.
- `dedupeByChapter`: uses `r.chapterId`.
- `shape`: returns `chapterId`, `section`, `sectionName`.
- `chunkById`: keyed by `c.id` (chunk id — unchanged).

- [ ] **Step 2: Run the existing search-overlay and search tests to capture baseline**

Run: `npx vitest run src/__tests__/search-overlay.test.jsx src/__tests__/search-golden.test.js` (if exists). Note current pass/fail state. The next steps will update both source and test to use slug-based shape.

- [ ] **Step 3: Update `storeFields` and `shape` to use slug**

In `src/search.js`, change the `storeFields` list:

```js
  storeFields: ["chapterSlug", "chapterTitle", "sub", "text", "summary"],
```

Remove `chapterId`, `section`, `sectionName` from `storeFields`. They are no longer in the chunk records.

Change the MiniSearch `fields` to drop `sectionName` since it's no longer indexed (the chunk text + title + terms are enough):

```js
  fields: ["text", "summary", "terms_joined", "chapterTitle"],
```

Update `dedupeByChapter`:

```js
function dedupeByChapter(items) {
  const seen = new Set();
  const out = [];
  for (const r of items) {
    const key = `${r.chapterSlug}:${r.sub}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}
```

Update `shape()` — import the lookup helpers we'll need. Add at the top of `src/search.js`:

```js
import { chapters, sectionNames } from "./config.js";

const chapterBySlug = new Map(chapters.map((c) => [c.slug, c]));
```

Then update `shape`:

```js
function shape(r) {
  const ch = chapterBySlug.get(r.chapterSlug);
  return {
    chapterSlug: r.chapterSlug,
    chapterId: ch ? ch.id : null,
    title: r.chapterTitle,
    section: ch ? ch.section : null,
    sectionName: ch ? sectionNames[ch.section] : null,
    sub: r.sub,
    text: r.text || r.summary || "",
    score: r.fusedScore || r.vectorScore || r.textScore || 0,
    source: r.fusedScore != null ? "hybrid" : r.vectorScore != null ? "semantic" : "text",
  };
}
```

If `r.title` is referenced anywhere else (e.g. in semantic-only path), audit and use `r.chapterTitle`.

- [ ] **Step 4: Verify lint passes on the edit**

Run: `npm run lint -- src/search.js`
Expected: no errors.

- [ ] **Step 5: Commit (defer tests — they need new mocks at Task 4.2)**

```bash
git add src/search.js
git commit -m "Read chapterSlug from chunks and resolve chapterId/section at search-time"
```

### Task 4.2: Update search-overlay.jsx to use slug-based result.chapterSlug

**Files:**
- Modify: `src/search-overlay.jsx`
- Modify: `src/__tests__/search-overlay.test.jsx`

- [ ] **Step 1: Read the existing test file first**

Open `src/__tests__/search-overlay.test.jsx` end-to-end. Note:
- How `search()` is mocked (typically `vi.doMock("../search.js", ...)` returning a `search` function that resolves to an array of result objects).
- The current shape of each mock result object (it will use `chapterId`, `section`, `sectionName`).
- How `<SearchOverlay>` is rendered (what props: `open`, `onClose`, `onGoTo`, etc.).

- [ ] **Step 2: Rewrite every mock result to use the new shape**

Anywhere the test constructs a mock result, replace `chapterId`, `section`, `sectionName` with `chapterSlug` plus the derived fields. Use a real slug from current `chapters` so the overlay's runtime lookup (which depends on `config.js`) finds it. Pattern:

```js
import { chapters } from "../config.js";

const realCh = chapters.find((c) => c.section === 1);
const mockResult = {
  chapterSlug: realCh.slug,
  chapterId: realCh.id,           // already derived by shape() in search.js
  section: realCh.section,        // ditto
  sectionName: "Section 1",       // free string, used only for display
  title: realCh.title,
  sub: 0,
  text: "Sample matching text",
  score: 0.9,
  source: "hybrid",
};
```

For every existing test in the file, swap the mocked result object to this shape.

- [ ] **Step 3: Add a new test asserting slug-based selection**

Append to `src/__tests__/search-overlay.test.jsx` (inside the existing `describe`):

```js
  it("clicks a search result and navigates by slug", async () => {
    const realCh = chapters.find((c) => c.section === 1);
    const onGoTo = vi.fn();
    const onClose = vi.fn();

    vi.doMock("../search.js", () => ({
      search: vi.fn(async () => [
        {
          chapterSlug: realCh.slug,
          chapterId: realCh.id,
          section: realCh.section,
          sectionName: "Section 1",
          title: realCh.title,
          sub: 0,
          text: "match",
          score: 0.9,
          source: "text",
        },
      ]),
      initSearch: vi.fn(async () => {}),
      prefetchSearch: vi.fn(async () => {}),
      getSearchMode: vi.fn(() => "text"),
      getLoadProgress: vi.fn(() => 0),
    }));
    vi.resetModules();
    const { default: SearchOverlay } = await import("../search-overlay.jsx");

    const { container, findByRole } = render(
      <SearchOverlay open={true} onClose={onClose} onGoTo={onGoTo} />,
    );

    const input = await findByRole("textbox");
    fireEvent.change(input, { target: { value: "match" } });

    await vi.waitFor(() => {
      const buttons = container.querySelectorAll('button[data-result]');
      expect(buttons.length).toBeGreaterThan(0);
    });

    const button = container.querySelector('button[data-result="0"]');
    fireEvent.click(button);

    const expectedIdx = chapters.findIndex((c) => c.slug === realCh.slug);
    expect(onGoTo).toHaveBeenCalledWith(expectedIdx, 0);
    expect(onClose).toHaveBeenCalled();
  });

  it("skips rows whose chapterSlug no longer exists in config", async () => {
    vi.doMock("../search.js", () => ({
      search: vi.fn(async () => [
        {
          chapterSlug: "nonexistent/removed-chapter",
          chapterId: null,            // shape() returns null when chapter not found
          section: null,
          sectionName: null,
          title: "Removed",
          sub: 0,
          text: "stale",
          score: 0.9,
          source: "text",
        },
      ]),
      initSearch: vi.fn(async () => {}),
      prefetchSearch: vi.fn(async () => {}),
      getSearchMode: vi.fn(() => "text"),
      getLoadProgress: vi.fn(() => 0),
    }));
    vi.resetModules();
    const { default: SearchOverlay } = await import("../search-overlay.jsx");

    const { container, findByRole } = render(
      <SearchOverlay open={true} onClose={vi.fn()} onGoTo={vi.fn()} />,
    );

    const input = await findByRole("textbox");
    fireEvent.change(input, { target: { value: "stale" } });

    await new Promise((r) => setTimeout(r, 250));

    const buttons = container.querySelectorAll('button[data-result]');
    expect(buttons.length).toBe(0);     // stale row filtered out
  });
```

Adjust the search-overlay mock shape (`initSearch`, `prefetchSearch`, etc.) to match whatever the existing test was already mocking — those names are illustrative; use the actual exports the existing test stubs.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/search-overlay.test.jsx`
Expected: at least one failure tied to the new slug-based shape.

- [ ] **Step 3: Update `src/search-overlay.jsx`**

Find and update:

```js
// before
const handleSelect = (chapterId, sub) => {
  const idx = chapters.findIndex((c) => c.id === chapterId);
  ...
};

// after
const handleSelect = (slug, sub) => {
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx >= 0) {
    onGoTo(idx, sub > 0 ? sub : 0);
    onClose();
    setQuery("");
    setResults([]);
    setHybrid(false);
    setActiveIdx(-1);
  }
};
```

Update both call sites of `handleSelect`:

```js
// Enter-key path (~line 171)
handleSelect(r.chapterSlug, r.sub);

// Click path (~line 432)
onClick={() => handleSelect(r.chapterSlug, r.sub)}
```

Update the result row identity key (~line 426):

```js
key={`${r.chapterSlug}-${i}`}
```

Section color resolution (~line 409) — `r.section` is now derived (already provided by `shape()`); if it is `null` for stale entries, fall back to `C.purple`. Already handled: `sectionColors[r.section] || C.purple`.

Also: at the top of the rendered row, the displayed badge is `r.chapterId` (~line 460). `shape()` now derives this from live config. If `r.chapterId` is `null` (stale entry pointing to a removed chapter), the row should be skipped entirely. Add a guard right before the row JSX:

```js
{filteredResults.map((r, i) => {
  if (!r.chapterSlug) return null;             // defensive; should never happen
  if (r.chapterId == null) return null;        // chapter removed since index built
  const secColor = sectionColors[r.section] || C.purple;
  ...
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/search-overlay.test.jsx`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/search-overlay.jsx src/__tests__/search-overlay.test.jsx
git commit -m "Switch search overlay to slug-based selection and render"
```

---

## Phase 5 — Regenerate chunks.json and embeddings.bin

### Task 5.1: Run the index build pipeline and commit regenerated data

**Files:**
- Modify (regenerate): `src/data/chunks.json`, `src/data/embeddings.bin`, `src/data/embeddings-manifest.json`, `src/data/chunk-cache.json`

- [ ] **Step 1: Confirm tests still pass before regen**

Run: `npm run test`
Expected: all green (no chunks.json shape mismatch since runtime now reads `chapterSlug`).

If tests fail, fix before regen. The regen step is destructive; we want the pipeline to be working end-to-end first.

- [ ] **Step 2: Inspect available scripts in `package.json`**

Run: `grep -E '"(search|embed):' package.json`
Expected: see `search:build` and `embed:chunks` (or equivalent). Confirm exact names before running.

- [ ] **Step 3: Run the search index build (cache hits, no LLM calls)**

Run: `npm run search:build`
Expected: console output shows `[cache hit]` for every chapter (because we have not edited any chapter file content). Zero `[LLM]` lines. `src/data/chunks.json` is overwritten with the new shape (per-chunk `chapterSlug`, no `chapterId`/`section`/`sectionName`).

If you see `[LLM]` lines, that means the chunk-cache key (chapter content hash) is being missed unexpectedly. Stop and investigate — do not let it call the LLM API. Likely cause: working tree has accidental whitespace changes in chapter files.

- [ ] **Step 4: Verify the new chunks.json shape**

Run: `node -e "const c=require('./src/data/chunks.json'); console.log(c[0]); console.log('count=', c.length); console.log('has chapterSlug?', 'chapterSlug' in c[0]); console.log('has chapterId?', 'chapterId' in c[0]);"`
Expected: `chapterSlug` is present, `chapterId` is not, total chunk count is close to the pre-regen count.

- [ ] **Step 5: Regenerate embeddings**

Run: `npm run embed:chunks`
Expected: this re-embeds every chunk because every chunk ID has changed. This calls the embedding service (BGE) for each chunk. Will take a few minutes. Watch for failures.

If `embed:chunks` is not the script name, run `grep -E '"embed' package.json` to find the right command.

- [ ] **Step 6: Verify embeddings.bin shape**

Run: `ls -la src/data/embeddings.bin`
Expected: file size is comparable to baseline (recorded in Phase 0). If size differs by more than 10% something is wrong — likely chunk count mismatch.

Run: `node -e "const m=require('./src/data/embeddings-manifest.json'); console.log('first id:', m[0]); console.log('count=', m.length);"`
Expected: count matches `chunks.json` length.

- [ ] **Step 7: Run the full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 8: Manual smoke test in dev**

Run: `npm run dev`. Visit `http://localhost:5173/learn-ai/`. Open the search overlay (keyboard shortcut). Type a query. Verify:
- Results render with `1.x..28.x` chapter ID labels (current derived IDs).
- Clicking a result navigates to the correct chapter.
- Section colors on result rows match the current section colors.

Kill the dev server.

- [ ] **Step 9: Commit the regenerated data**

```bash
git add src/data/chunks.json src/data/embeddings.bin src/data/embeddings-manifest.json src/data/chunk-cache.json
git commit -m "Regenerate search index data with slug-stamped chunks"
```

---

## Phase 6 — TOC two-level accordion

### Task 6.1: Rewrite TOC tests for two-level accordion

**Files:**
- Modify: `src/__tests__/chapters/table-of-contents/toc.test.jsx`

- [ ] **Step 1: Replace the entire `toc.test.jsx` content with the new test suite**

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters, sectionNames, sectionColors, superSections, sectionSuper } from "../../../config.js";
import { makeCtx } from "../../chapter-test-helpers.js";
import TOC from "../../../chapters/table-of-contents/toc.jsx";

afterEach(() => cleanup());

describe("TOC (two-level)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TOC(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders all 6 super-section names by default", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    superSections.forEach((sg) => {
      expect(container.textContent).toContain(sg.name);
    });
  });

  it("does not render any section name when fully collapsed", () => {
    const { container } = render(TOC(makeCtx({ expanded: null })));
    // No super-section is open, so individual section names are not visible.
    // We pick a representative section name that does not appear in any super-section name.
    expect(container.textContent).not.toContain(sectionNames[7]);   // "The Road to Transformers"
  });

  it("clicking a super-section expands to show its section list", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: null })));
    const headers = container.querySelectorAll("[data-toc-super]");
    expect(headers.length).toBe(6);
    fireEvent.click(headers[2]);   // super-section C
    expect(setExpanded).toHaveBeenCalledWith({ super: "C", section: null });
  });

  it("shows section rows under an expanded super-section", () => {
    const { container } = render(TOC(makeCtx({ expanded: { super: "C", section: null } })));
    // sections 7..14 are part of super-section C.
    [7, 8, 9, 10, 11, 12, 13, 14].forEach((n) => {
      expect(container.textContent).toContain(sectionNames[n]);
    });
    // Sections outside C are not visible.
    expect(container.textContent).not.toContain(sectionNames[1]);
  });

  it("clicking a section row inside expanded super-section drills into its chapters", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: null } })));
    const sectionHeaders = container.querySelectorAll("[data-toc-section]");
    expect(sectionHeaders.length).toBe(8);   // 8 sections in super-section C
    fireEvent.click(sectionHeaders[0]);
    expect(setExpanded).toHaveBeenCalledWith({ super: "C", section: 7 });
  });

  it("renders chapters when a section is drilled into and navigates on click", () => {
    const goTo = vi.fn();
    const { container } = render(
      TOC(makeCtx({ expanded: { super: "C", section: 7 }, goTo })),
    );
    const chaptersInSec7 = chapters.filter((c) => c.section === 7);
    expect(chaptersInSec7.length).toBeGreaterThan(0);
    expect(container.textContent).toContain(chaptersInSec7[0].title);

    const chapterLinks = container.querySelectorAll("[data-toc-chapter]");
    expect(chapterLinks.length).toBeGreaterThan(0);
    fireEvent.click(chapterLinks[0]);
    expect(goTo).toHaveBeenCalled();
  });

  it("collapses super-section when clicked while open", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: null } })));
    const headers = container.querySelectorAll("[data-toc-super]");
    fireEvent.click(headers[2]);    // super-section C, currently open
    expect(setExpanded).toHaveBeenCalledWith(null);
  });

  it("clicking a different super-section switches the open one (single-open behavior)", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: { super: "C", section: 7 } })));
    const headers = container.querySelectorAll("[data-toc-super]");
    fireEvent.click(headers[0]);    // super-section A
    expect(setExpanded).toHaveBeenCalledWith({ super: "A", section: null });
  });

  // Data-driven: every section's chapter list is reachable through the right super-section.
  superSections.forEach((sg) => {
    sg.sections.forEach((secNum) => {
      it(`super-section ${sg.id} expands to section ${secNum}'s chapters`, () => {
        const { container } = render(
          TOC(makeCtx({ expanded: { super: sg.id, section: secNum } })),
        );
        expect(container.textContent).toContain(sectionNames[secNum]);
        const chs = chapters.filter((c) => c.section === secNum);
        if (chs.length > 0) {
          expect(container.textContent).toContain(chs[0].title);
        }
      });
    });
  });

  // Color drift guard: super-section color must match config.
  superSections.forEach((sg) => {
    it(`super-section ${sg.id} uses its configured color`, () => {
      const { container } = render(TOC(makeCtx({ expanded: null })));
      const h = sg.color.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const rgb = `rgb(${r}, ${g}, ${b})`;
      expect(container.innerHTML.toLowerCase()).toContain(rgb);
    });
  });

  // Color drift guard: per-section colors still appear inside expanded super-section.
  superSections.forEach((sg) => {
    it(`section colors are preserved inside super-section ${sg.id}`, () => {
      const { container } = render(TOC(makeCtx({ expanded: { super: sg.id, section: null } })));
      sg.sections.forEach((secNum) => {
        const hex = sectionColors[secNum];
        const h = hex.replace("#", "");
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        const rgb = `rgb(${r}, ${g}, ${b})`;
        expect(container.innerHTML.toLowerCase()).toContain(rgb);
      });
    });
  });

  // Auto-open: when ctx.currentChapter is provided, TOC auto-expands the super + section.
  it("auto-opens the super-section and section of the current chapter when expanded is null and currentChapter is given", () => {
    const setExpanded = vi.fn();
    const sampleCh = chapters.find((c) => c.section === 10);
    const ctx = makeCtx({
      expanded: null,
      setExpanded,
      currentChapter: sampleCh,
    });
    render(TOC(ctx));
    const expectedSuper = sectionSuper[10];
    expect(setExpanded).toHaveBeenCalledWith({ super: expectedSuper, section: 10 });
  });

  it("does not auto-open when expanded is already set", () => {
    const setExpanded = vi.fn();
    const sampleCh = chapters.find((c) => c.section === 10);
    const ctx = makeCtx({
      expanded: { super: "A", section: 1 },
      setExpanded,
      currentChapter: sampleCh,
    });
    render(TOC(ctx));
    expect(setExpanded).not.toHaveBeenCalled();
  });

  it("does not auto-open when no currentChapter is given", () => {
    const setExpanded = vi.fn();
    render(TOC(makeCtx({ expanded: null, setExpanded, currentChapter: null })));
    expect(setExpanded).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/chapters/table-of-contents/toc.test.jsx`
Expected: most tests fail. The current `toc.jsx` does not render super-sections and does not have `data-toc-super` / `data-toc-section` / `data-toc-chapter` data attributes.

- [ ] **Step 3: Do not commit yet** (test-only changes are not yet self-consistent; Task 6.2 implements the component).

### Task 6.2: Rewrite `toc.jsx` for two-level accordion

**Files:**
- Modify: `src/chapters/table-of-contents/toc.jsx`

- [ ] **Step 1: Replace the file with the new component**

```jsx
import { useEffect } from "react";
import { C, chapters, sectionNames, sectionColors, superSections, sectionSuper } from "../../config.js";
import { Box, T } from "../../components.jsx";

export default function TOC(ctx) {
  const { goTo, expanded, setExpanded, currentChapter } = ctx;

  // Auto-open the current chapter's super + section when TOC is opened cold.
  useEffect(() => {
    if (expanded == null && currentChapter && currentChapter.section > 0) {
      const sup = sectionSuper[currentChapter.section];
      if (sup) setExpanded({ super: sup, section: currentChapter.section });
    }
  }, [expanded, currentChapter, setExpanded]);

  // Group chapters by section for fast lookup.
  const chaptersBySection = {};
  chapters.forEach((c, idx) => {
    if (c.section > 0) {
      if (!chaptersBySection[c.section]) chaptersBySection[c.section] = [];
      chaptersBySection[c.section].push({ ...c, idx });
    }
  });

  // Compute per-section chapter counts and per-super-section totals.
  const sectionCounts = {};
  Object.entries(chaptersBySection).forEach(([s, list]) => {
    sectionCounts[s] = list.length;
  });
  const superCounts = superSections.map((sg) => ({
    id: sg.id,
    sectionCount: sg.sections.length,
    chapterCount: sg.sections.reduce((sum, s) => sum + (sectionCounts[s] || 0), 0),
  }));

  const openSuper = expanded && typeof expanded === "object" ? expanded.super : null;
  const openSection = expanded && typeof expanded === "object" ? expanded.section : null;

  const toggleSuper = (id) => {
    if (openSuper === id) setExpanded(null);
    else setExpanded({ super: id, section: null });
  };
  const toggleSection = (sgId, secNum) => {
    if (openSection === secNum) setExpanded({ super: sgId, section: null });
    else setExpanded({ super: sgId, section: secNum });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold size={21} center>
          Your roadmap to understanding AI from scratch.
        </T>
        <T color="#b8a9ff" center style={{ marginTop: 6 }}>
          {chapters.length - 1} chapters. Zero prerequisites. Every concept built on the one before it.
        </T>
      </Box>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {superSections.map((sg, sgIdx) => {
          const isSuperOpen = openSuper === sg.id;
          const counts = superCounts[sgIdx];
          return (
            <div
              key={sg.id}
              style={{
                borderRadius: 10,
                background: `${sg.color}06`,
                border: `1px solid ${isSuperOpen ? `${sg.color}35` : `${sg.color}15`}`,
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              <div
                data-toc-super={sg.id}
                onClick={() => toggleSuper(sg.id)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      background: `${sg.color}20`,
                      color: sg.color,
                      fontWeight: 800,
                      fontSize: 21,
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {sg.id}
                  </span>
                  <T color={sg.color} bold size={18}>
                    {sg.name}
                  </T>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <T color={C.dim} size={12}>
                    {counts.sectionCount} Sections · {counts.chapterCount} Chapters
                  </T>
                  <span
                    style={{
                      color: C.dim,
                      fontSize: 14,
                      transition: "transform 0.3s",
                      transform: isSuperOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {isSuperOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {sg.sections.map((secNum) => {
                    const secColor = sectionColors[secNum];
                    const isSecOpen = openSection === secNum;
                    const secChapters = chaptersBySection[secNum] || [];
                    return (
                      <div
                        key={secNum}
                        style={{
                          borderRadius: 8,
                          background: `${secColor}06`,
                          border: `1px solid ${isSecOpen ? `${secColor}35` : `${secColor}15`}`,
                          overflow: "hidden",
                          marginLeft: 30,
                        }}
                      >
                        <div
                          data-toc-section={secNum}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(sg.id, secNum);
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                background: `${secColor}20`,
                                color: secColor,
                                fontWeight: 700,
                                fontSize: 14,
                                width: 26,
                                height: 26,
                                borderRadius: 6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {secNum}
                            </span>
                            <T color={secColor} bold size={16}>
                              {sectionNames[secNum]}
                            </T>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <T color={C.dim} size={12}>
                              {secChapters.length} Chapters
                            </T>
                            <span
                              style={{
                                color: C.dim,
                                fontSize: 13,
                                transition: "transform 0.3s",
                                transform: isSecOpen ? "rotate(180deg)" : "rotate(0)",
                              }}
                            >
                              ▼
                            </span>
                          </div>
                        </div>

                        {isSecOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 2 }}
                          >
                            {secChapters.map((c) => (
                              <div
                                key={c.id}
                                data-toc-chapter={c.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goTo(c.idx);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "6px 8px 6px 34px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  background: "transparent",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = `${secColor}10`)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                <span style={{ color: `${secColor}88`, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                                  {c.id}
                                </span>
                                <T color={C.mid} size={15}>
                                  {c.title}
                                </T>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <T color={C.dim} size={16} center style={{ marginTop: 4 }}>
        Tap a part to expand, tap a section to drill in, tap a chapter to jump.
      </T>
    </div>
  );
}
```

- [ ] **Step 2: Run TOC tests**

Run: `npx vitest run src/__tests__/chapters/table-of-contents/toc.test.jsx`
Expected: all pass.

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: all pass. If anything fails, investigate before committing.

- [ ] **Step 4: Commit**

```bash
git add src/chapters/table-of-contents/toc.jsx src/__tests__/chapters/table-of-contents/toc.test.jsx
git commit -m "Rewrite TOC as two-level accordion with super-section grouping"
```

### Task 6.3: Pass `currentChapter` into TOC's ctx from learn-ai.jsx

**Files:**
- Modify: `src/learn-ai.jsx`

- [ ] **Step 1: Read current ctx construction**

Open `src/learn-ai.jsx` around the line where `ctx` is built (look for `expanded` — line ~504). Inspect surrounding fields.

- [ ] **Step 2: Add `currentChapter` to ctx**

Find the object literal that becomes `ctx`. Add `currentChapter: chapters[ch] || null,` to it (where `ch` is the current chapter index — confirm the variable name by reading the function).

- [ ] **Step 3: Confirm the existing `expanded` reset still works**

Look at line ~257: `setExpanded(null);` — this resets when navigating away. Leave it. The TOC's auto-open `useEffect` will re-fire next time TOC is rendered with `expanded === null` and a `currentChapter`.

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 5: Manual smoke test**

Run: `npm run dev`. Navigate to a chapter in section 10 (e.g. via search or by clicking through the TOC). Then click "Table of Contents" or navigate back to the TOC chapter. Verify that super-section C is auto-expanded and section 10 inside it is auto-expanded, with chapter list visible.

Kill the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/learn-ai.jsx
git commit -m "Pass currentChapter into TOC ctx so it can auto-open user's location"
```

---

## Phase 7 — Documentation update

### Task 7.1: Update CLAUDE.md How-To sections

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Read current "How To" sections**

Read `CLAUDE.md` lines 30-120 (approximately — the "How It Works" / "How To" blocks).

- [ ] **Step 2: Update "How To: Add a New Chapter"**

Replace step 2 of "How To: Add a New Chapter" (around the example showing renumbered IDs) with the new shape:

```markdown
2. **Add one entry to the section's `chapters` array in `config.js`** — no ID
   renumbering, no manual ID at all. Drop a new `{ slug, file, title, component }`
   object into the array at the desired position; IDs are derived from position.
   ```js
   sections = [
     ...
     {
       num: 7,
       name: "Computing Attention",
       chapters: [
         { slug: "attention-computation/why-attention",       file: "attention-computation/why-attention",       title: "Why Attention",  component: "WhyAttention" },
         { slug: "attention-computation/qkv-concepts",        file: "attention-computation/qkv-concepts",        title: "Q, K, V",        component: "QKVConcepts" },
         { slug: "attention-computation/score-normalization", file: "attention-computation/score-normalization", title: "Score Normalization", component: "ScoreNormalization" },  // NEW
         { slug: "attention-computation/k-transpose",         file: "attention-computation/k-transpose",         title: "K Transpose",    component: "KTranspose" },
         ...
       ],
     },
   ]
   ```
```

- [ ] **Step 3: Update "How To: Reorder Chapters"**

Replace the section body with:

```markdown
Reorder entries inside a section's `chapters` array in config.js. IDs are
derived from position, so no renumbering is needed anywhere. Chapter files
and test files do not move - their content is identity-free. Moving a
chapter between sections is just cutting/pasting between two arrays.

The search index identifies chapters by stable slug (= file path), so
reordering does not require re-embedding. Run `npm run search:build` once
after the reorder to refresh `chunks.json`'s sort order (cache-only,
zero LLM cost).
```

- [ ] **Step 4: Add a new "How To: Add a New Super-Section" block**

After "How To: Reorder Chapters", add:

```markdown
## How To: Add a New Super-Section

Super-sections group related sections in the TOC. The 6 default groups are
defined in `superSections` in `config.js`.

To add a new super-section:

1. Insert a new entry into `superSections` with `id`, `name`, `color`, and
   the `sections: [...]` list it owns. Pick an id letter not already used.
2. Remove those section numbers from whichever super-section previously
   owned them.
3. Run `npm run test` - validation will catch any section that is now
   orphaned or double-claimed.

No chunk regeneration is required. Super-sections are a pure TOC overlay.
```

- [ ] **Step 5: Run lint to confirm no markdown issues**

Run: `npm run lint`
Expected: no errors (lint config typically doesn't lint markdown, but verify it doesn't trip on anything).

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md how-to sections for slug-based config and super-sections"
```

---

## Phase 8 — Final verification

### Task 8.1: Full quality gate

**Files:** none

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Run format check (no auto-fix)**

Run: `npx prettier --check 'src/**/*.{js,jsx}' 'scripts/**/*.mjs'`
Expected: all formatted. If anything is unformatted, run `npm run format` and commit as a separate "Format" commit.

- [ ] **Step 3: Run tests with coverage**

Run: `npx vitest run --coverage`
Expected: 100% lines / branches / functions / statements on the gated paths (`src/config.js`, `src/components.jsx`, `src/nav-persistence.js`, `src/chapters/**/*.jsx`, `src/shared/**/*.jsx`).

If coverage drops below 100% on the gated paths, identify which branches are uncovered and add tests. Common gaps after this refactor:
- `validateConfig` slug branches: add one test per branch in the new validation logic.
- `toc.jsx` chapter onMouseEnter/Leave: existing patterns from old TOC carry over; ensure they're still covered.
- Auto-open `useEffect` branches: covered by the 3 new tests in Task 6.1; verify.

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: build succeeds. No warnings about chunks or missing assets.

- [ ] **Step 5: Run preview**

Run: `npm run preview`
Expected: served at default Vite preview URL. Open in browser.

Smoke test in preview:
- TOC renders 6 super-section rows.
- Click super-section C → expands to 8 section rows.
- Click section 10 → expands to chapter list, click first chapter.
- Land on chapter, then navigate back to TOC. Confirm C + 10 are auto-expanded.
- Open search overlay (keyboard shortcut). Type a query that hits a chapter in section 12. Verify result row shows `12.x` correctly. Click → navigates correctly.
- Press the back/next side zones a couple of times. Saved nav still works after reload.

Kill the preview server.

- [ ] **Step 6: Push branch**

Run: `git status`
Expected: clean.

Run: `git log --oneline origin/chapter-wise-file..HEAD`
Expected: ordered list of commits from Phase 1 through Phase 7. All concise, imperative-mood titles.

If the user wants a PR, prompt them — do not push without explicit confirmation (per project guidelines on visible-to-others actions).

---

## Acceptance criteria (mirrors spec)

- `config.js` exports `sections`, `superSections`, `sectionSuper`, plus derived back-compat `chapters` / `sectionNames` / `sectionColors`. Validation throws in dev on inconsistency.
- Adding a new chapter at any position requires editing exactly one section's `chapters` array.
- Reordering chapters does not require touching anything outside `config.js`.
- `nav-persistence` fingerprint is slug-based. Reorder no longer wipes saved nav.
- `chunks.json` carries `chapterSlug` per chunk. No `chapterId` / `section` / `sectionName` fields per chunk.
- `chunkId` computed from `chapterSlug`. Reorder a chapter → its chunk IDs unchanged.
- `embeddings.bin` regenerated once during this PR. After the PR, reorders do not require re-embed.
- TOC renders 6 super-section rows. Auto-opens super + section of current chapter on cold visit.
- Super-section rows show `[A]..[F]` badge in super-section color. Section rows keep existing colors.
- Progress bar in `learn-ai.jsx` still per-section.
- Chapter IDs visible in search results, prose, llms.txt, JSON-LD stay as `1.x..28.x`.
- `npm run test`, `npm run lint`, `npm run build` all pass. 100% coverage on gated paths.

## Out of scope (do not implement)

- Renumbering chapter IDs to three-level format.
- Persisting TOC expand state.
- Changing the per-section progress bar.
- Touching individual chapter files in `src/chapters/`.
- Updating llms.txt, JSON-LD, sitemap, og.png.
