# Deep-linkable URLs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every visible navigation state (chapter, sub-step, TOC super/section expansion) shareable via URL, using `history.replaceState` so no in-app history entries accumulate.

**Architecture:** A new pure `url-routing.js` module owns parse/build. A new `url-sync.js` hook watches React state and calls `history.replaceState`. `learn-ai.jsx` resolves its initial state from the URL (falling back to localStorage, then TOC). A `public/404.html` shim plus an inline redirect in `index.html` give GitHub Pages SPA fallback for deep paths.

**Tech Stack:** React 18, Vite, Vitest. No new dependencies.

**Reference:** Full spec at `docs/superpowers/specs/2026-05-20-deep-linkable-urls-design.md`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/config.js` | Modify | Add `slug` field to each `superSections` entry and each `sections` entry. Extend `validateConfig` for slug collision rules. |
| `src/url-routing.js` | Create | `parsePath`, `buildPath`, `BASE_PATH` constant. Pure module, no React. |
| `src/url-sync.js` | Create | `useUrlSync` React hook that calls `history.replaceState` on state change. |
| `src/learn-ai.jsx` | Modify | Resolve initial `ch`/`sub`/`expanded` from URL via `resolveInitialState`. Mount `useUrlSync`. Handle bare-URL-with-localStorage redirect. |
| `index.html` | Modify | Add inline script (before module load) that reads sessionStorage from 404 shim and `replaceState`s the original path. |
| `public/404.html` | Create | Standard SPA-on-GitHub-Pages fallback shim. |
| `src/__tests__/config.test.js` | Modify | Add tests for super/section slug presence, kebab-case, uniqueness, and chapter-topic non-collision. |
| `src/__tests__/url-routing.test.js` | Create | Round-trip tests for every URL shape and edge case. |
| `src/__tests__/url-sync.test.jsx` | Create | Hook tests: state change → `replaceState` called with correct path, `pushState` never called. |
| `src/__tests__/learn-ai.test.jsx` | Modify | Boot-from-URL and URL-on-navigation cases. |

---

## Task 1: Add `slug` field to super-sections

**Files:**
- Modify: `src/config.js` (superSections array, lines 1617-1660)
- Test: `src/__tests__/config.test.js`

- [ ] **Step 1: Write failing test for super-section slugs**

Add this block to `src/__tests__/config.test.js`:

```js
describe("super-section slugs", () => {
  it("every super-section has a non-empty kebab-case slug", () => {
    superSections.forEach((sg) => {
      expect(sg.slug, `super ${sg.id} missing slug`).toBeTruthy();
      expect(sg.slug).toMatch(/^[a-z][a-z0-9-]*$/);
    });
  });

  it("super-section slugs are unique", () => {
    const slugs = superSections.map((sg) => sg.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("super-section slugs do not collide with any chapter topic", () => {
    const topics = new Set(chapters.filter((c) => c.section > 0).map((c) => c.slug.split("/")[0]));
    superSections.forEach((sg) => {
      expect(topics.has(sg.slug), `super slug "${sg.slug}" collides with chapter topic`).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: 3 failures (every super-section missing `slug`).

- [ ] **Step 3: Add slug field to each super-section**

In `src/config.js`, update the `superSections` array entries:

```js
export const superSections = [
  { id: "A", slug: "deep-learning",     name: "Foundations of Deep Learning", color: "#d9a04a", desc: "...", sections: [1, 2, 3, 4] },
  { id: "B", slug: "llm-rise",          name: "The Rise of LLMs",             color: "#d6759a", desc: "...", sections: [5, 6] },
  { id: "C", slug: "transformers",      name: "The Transformer Era",          color: "#7e9eb0", desc: "...", sections: [7, 8, 9, 10, 11, 12, 13, 14] },
  { id: "D", slug: "vector-databases",  name: "Vector Databases at Depth",    color: "#a1b54a", desc: "...", sections: [15, 16, 17, 18] },
  { id: "E", slug: "rag",               name: "Retrieval Augmented Generation (RAG)", color: "#c66951", desc: "...", sections: [19, 20, 21, 22, 23] },
  { id: "F", slug: "agents",            name: "Agentic AI",                   color: "#9c8cc2", desc: "...", sections: [24, 25, 26, 27, 28] },
];
```

Keep the original `desc` strings exactly as they were.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add slug field to super-sections"
```

---

## Task 2: Add `slug` field to sections

**Files:**
- Modify: `src/config.js` (sections array entries 1-28)
- Test: `src/__tests__/config.test.js`

- [ ] **Step 1: Write failing test for section slugs**

Append to the `describe("super-section slugs", ...)` block in `src/__tests__/config.test.js`:

```js
describe("section slugs", () => {
  it("every section has a non-empty kebab-case slug", () => {
    sections.forEach((s) => {
      expect(s.slug, `section ${s.num} missing slug`).toBeTruthy();
      expect(s.slug).toMatch(/^[a-z][a-z0-9-]*$/);
    });
  });

  it("section slugs are unique within their super-section", () => {
    superSections.forEach((sg) => {
      const slugs = sg.sections.map((num) => sections.find((s) => s.num === num).slug);
      expect(new Set(slugs).size, `super ${sg.id} has duplicate section slugs`).toBe(slugs.length);
    });
  });
});
```

Also import `sections` at the top of the test file:

```js
import { chapters, sectionNames, sectionColors, sections, superSections, C, validateConfig } from "../config.js";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: 2 failures (every section missing `slug`).

- [ ] **Step 3: Add slug to each section entry**

For each entry in the `sections` array in `src/config.js`, add a `slug` field directly after `num`. Use exactly these values:

| num | slug |
|---|---|
| 1 | `neural-networks` |
| 2 | `backprop` |
| 3 | `linear-algebra` |
| 4 | `training` |
| 5 | `pretraining` |
| 6 | `scaling` |
| 7 | `road-to-transformers` |
| 8 | `input-pipeline` |
| 9 | `qkv` |
| 10 | `attention` |
| 11 | `multi-head` |
| 12 | `encoder` |
| 13 | `decoder` |
| 14 | `modern-techniques` |
| 15 | `vector-search` |
| 16 | `compression` |
| 17 | `production` |
| 18 | `picking-db` |
| 19 | `pipeline` |
| 20 | `ingestion` |
| 21 | `retrieval` |
| 22 | `generation` |
| 23 | `shipping` |
| 24 | `prompting` |
| 25 | `tools` |
| 26 | `mechanics` |
| 27 | `multi-agent` |
| 28 | `shipping` |

Example: section 1 changes from

```js
{
  num: 1,
  name: "Neural Networks - The Mechanics",
  color: "#ef5350",
  desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
  super: "A",
  chapters: [...],
},
```

to

```js
{
  num: 1,
  slug: "neural-networks",
  name: "Neural Networks - The Mechanics",
  color: "#ef5350",
  desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
  super: "A",
  chapters: [...],
},
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/config.test.js`
Expected: PASS. (Section 28's slug `shipping` matches Section 23's `shipping` but they live in different super-sections, so within-super uniqueness still holds.)

- [ ] **Step 5: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add slug field to sections"
```

---

## Task 3: Create `url-routing.js` skeleton with `BASE_PATH`

**Files:**
- Create: `src/url-routing.js`
- Create: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write failing test for BASE_PATH**

Create `src/__tests__/url-routing.test.js`:

```js
import { describe, it, expect } from "vitest";
import { BASE_PATH } from "../url-routing.js";

describe("BASE_PATH", () => {
  it("ends with a slash", () => {
    expect(BASE_PATH.endsWith("/")).toBe(true);
  });

  it("is the Vite base URL", () => {
    expect(BASE_PATH).toBe(import.meta.env.BASE_URL);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: FAIL ("Cannot find module ../url-routing.js").

- [ ] **Step 3: Create minimal url-routing.js**

Create `src/url-routing.js`:

```js
export const BASE_PATH = import.meta.env.BASE_URL;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-routing.js src/__tests__/url-routing.test.js
git commit -m "Add url-routing module skeleton with BASE_PATH"
```

---

## Task 4: Add `parsePath` for TOC URLs

**Files:**
- Modify: `src/url-routing.js`
- Modify: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write failing tests for TOC parsing**

Add to `src/__tests__/url-routing.test.js`:

```js
import { parsePath } from "../url-routing.js";
import { chapters, sections, superSections } from "../config.js";

const cfg = { chapters, sections, superSections };

describe("parsePath - TOC", () => {
  it("bare base path is TOC collapsed", () => {
    expect(parsePath("/learn-ai/", cfg)).toEqual({ kind: "toc", super: null, section: null });
  });

  it("trailing slash optional on bare path", () => {
    expect(parsePath("/learn-ai", cfg)).toEqual({ kind: "toc", super: null, section: null });
  });

  it("known super slug returns super open", () => {
    expect(parsePath("/learn-ai/transformers", cfg)).toEqual({ kind: "toc", super: "C", section: null });
  });

  it("known super + section slug returns both open", () => {
    expect(parsePath("/learn-ai/transformers/attention", cfg)).toEqual({ kind: "toc", super: "C", section: 10 });
  });

  it("unknown super slug returns invalid", () => {
    expect(parsePath("/learn-ai/nonsense", cfg).kind).toBe("invalid");
  });

  it("known super + unknown section slug returns invalid", () => {
    expect(parsePath("/learn-ai/transformers/nonsense", cfg).kind).toBe("invalid");
  });

  it("section that does not belong to the named super is invalid", () => {
    // section "attention" (slug = attention) belongs to super C, not D
    expect(parsePath("/learn-ai/vector-databases/attention", cfg).kind).toBe("invalid");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: 7 failures ("parsePath is not a function" or undefined).

- [ ] **Step 3: Implement parsePath for TOC**

Update `src/url-routing.js`:

```js
export const BASE_PATH = import.meta.env.BASE_URL;

function stripBase(pathname) {
  // Normalise: BASE_PATH always ends in "/". Accept the bare base without trailing slash too.
  const base = BASE_PATH;
  if (pathname === base.slice(0, -1) || pathname === base) return "";
  if (pathname.startsWith(base)) return pathname.slice(base.length).replace(/\/$/, "");
  // Tests may pass a path with no base prefix
  if (pathname === "/" || pathname === "") return "";
  return pathname.replace(/^\//, "").replace(/\/$/, "");
}

export function parsePath(pathname, { chapters, sections, superSections }) {
  const rest = stripBase(pathname);
  if (!rest) return { kind: "toc", super: null, section: null };

  const segs = rest.split("/");

  // TOC: 1 segment = super
  if (segs.length === 1) {
    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) return { kind: "toc", super: sg.id, section: null };
    return { kind: "invalid" };
  }

  // 2 segments: chapter or super+section
  if (segs.length === 2) {
    // (chapter lookup is added in the next task)
    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) {
      const sec = sections.find((x) => x.slug === segs[1] && sg.sections.includes(x.num));
      if (sec) return { kind: "toc", super: sg.id, section: sec.num };
    }
    return { kind: "invalid" };
  }

  return { kind: "invalid" };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-routing.js src/__tests__/url-routing.test.js
git commit -m "parsePath: handle TOC URLs"
```

---

## Task 5: Add chapter parsing to `parsePath`

**Files:**
- Modify: `src/url-routing.js`
- Modify: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write failing tests for chapter parsing**

Append to `src/__tests__/url-routing.test.js`:

```js
describe("parsePath - chapter", () => {
  it("known chapter slug returns chapter sub=0", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg)).toEqual({
      kind: "chapter",
      ch: idx,
      sub: 0,
    });
  });

  it("known chapter slug with sub returns chapter at that sub", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/qkv-concepts");
    expect(parsePath("/learn-ai/attention-computation/qkv-concepts/3", cfg)).toEqual({
      kind: "chapter",
      ch: idx,
      sub: 3,
    });
  });

  it("chapter slug takes precedence over super+section if both shapes match (only chapter exists here)", () => {
    // No collisions in current data, but verify lookup order
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg).kind).toBe("chapter");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg).ch).toBe(idx);
  });

  it("unknown chapter slug returns invalid", () => {
    expect(parsePath("/learn-ai/no-topic/no-chapter", cfg).kind).toBe("invalid");
  });

  it("known chapter slug with non-numeric sub returns invalid", () => {
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn/abc", cfg).kind).toBe("invalid");
  });

  it("known chapter slug with negative sub returns invalid", () => {
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn/-1", cfg).kind).toBe("invalid");
  });

  it("four or more segments are invalid", () => {
    expect(parsePath("/learn-ai/a/b/c/d", cfg).kind).toBe("invalid");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: 5+ failures (chapter shape returns invalid because parser does not handle chapters yet).

- [ ] **Step 3: Extend parsePath for chapters**

Replace the body of `parsePath` in `src/url-routing.js`:

```js
export function parsePath(pathname, { chapters, sections, superSections }) {
  const rest = stripBase(pathname);
  if (!rest) return { kind: "toc", super: null, section: null };

  const segs = rest.split("/");

  // 1 segment: super only
  if (segs.length === 1) {
    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) return { kind: "toc", super: sg.id, section: null };
    return { kind: "invalid" };
  }

  // 2 segments: chapter first, then super+section
  if (segs.length === 2) {
    const slug = `${segs[0]}/${segs[1]}`;
    const chIdx = chapters.findIndex((c) => c.slug === slug);
    if (chIdx >= 0) return { kind: "chapter", ch: chIdx, sub: 0 };

    const sg = superSections.find((s) => s.slug === segs[0]);
    if (sg) {
      const sec = sections.find((x) => x.slug === segs[1] && sg.sections.includes(x.num));
      if (sec) return { kind: "toc", super: sg.id, section: sec.num };
    }
    return { kind: "invalid" };
  }

  // 3 segments: chapter + sub
  if (segs.length === 3) {
    const slug = `${segs[0]}/${segs[1]}`;
    const chIdx = chapters.findIndex((c) => c.slug === slug);
    if (chIdx < 0) return { kind: "invalid" };
    const sub = Number(segs[2]);
    if (!Number.isFinite(sub) || sub < 0 || !Number.isInteger(sub)) return { kind: "invalid" };
    return { kind: "chapter", ch: chIdx, sub };
  }

  return { kind: "invalid" };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-routing.js src/__tests__/url-routing.test.js
git commit -m "parsePath: handle chapter URLs with optional sub"
```

---

## Task 6: Add `buildPath`

**Files:**
- Modify: `src/url-routing.js`
- Modify: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write failing tests for buildPath**

Append to `src/__tests__/url-routing.test.js`:

```js
import { buildPath } from "../url-routing.js";

describe("buildPath", () => {
  it("TOC with no super returns bare base", () => {
    expect(buildPath({ kind: "toc", super: null, section: null }, cfg)).toBe("/learn-ai/");
  });

  it("TOC super-only returns base + super slug", () => {
    expect(buildPath({ kind: "toc", super: "C", section: null }, cfg)).toBe("/learn-ai/transformers");
  });

  it("TOC super + section returns base + super + section slug", () => {
    expect(buildPath({ kind: "toc", super: "C", section: 10 }, cfg)).toBe("/learn-ai/transformers/attention");
  });

  it("chapter with sub=0 omits sub segment", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(buildPath({ kind: "chapter", ch: idx, sub: 0 }, cfg)).toBe("/learn-ai/neural-foundations/what-is-nn");
  });

  it("chapter with sub>0 includes sub segment", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/qkv-concepts");
    expect(buildPath({ kind: "chapter", ch: idx, sub: 3 }, cfg)).toBe(
      "/learn-ai/attention-computation/qkv-concepts/3",
    );
  });

  it("TOC chapter (ch=0) builds bare base regardless of sub", () => {
    expect(buildPath({ kind: "chapter", ch: 0, sub: 0 }, cfg)).toBe("/learn-ai/");
    expect(buildPath({ kind: "chapter", ch: 0, sub: 5 }, cfg)).toBe("/learn-ai/");
  });

  it("round-trip chapter parses back to the same state", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/qkv-concepts");
    const state = { kind: "chapter", ch: idx, sub: 2 };
    expect(parsePath(buildPath(state, cfg), cfg)).toEqual(state);
  });

  it("round-trip TOC super+section parses back to the same state", () => {
    const state = { kind: "toc", super: "D", section: 17 };
    expect(parsePath(buildPath(state, cfg), cfg)).toEqual(state);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: FAIL ("buildPath is not a function").

- [ ] **Step 3: Implement buildPath**

Append to `src/url-routing.js`:

```js
export function buildPath(state, { chapters, sections, superSections }) {
  if (state.kind === "chapter") {
    const ch = chapters[state.ch];
    if (!ch || ch.section === 0) return BASE_PATH;
    const sub = state.sub;
    if (sub > 0) return `${BASE_PATH}${ch.slug}/${sub}`;
    return `${BASE_PATH}${ch.slug}`;
  }
  if (state.kind === "toc") {
    if (!state.super) return BASE_PATH;
    const sg = superSections.find((s) => s.id === state.super);
    if (!sg) return BASE_PATH;
    if (state.section == null) return `${BASE_PATH}${sg.slug}`;
    const sec = sections.find((x) => x.num === state.section);
    if (!sec || !sg.sections.includes(sec.num)) return `${BASE_PATH}${sg.slug}`;
    return `${BASE_PATH}${sg.slug}/${sec.slug}`;
  }
  return BASE_PATH;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-routing.js src/__tests__/url-routing.test.js
git commit -m "Add buildPath with round-trip coverage"
```

---

## Task 7: Add `useUrlSync` hook

**Files:**
- Create: `src/url-sync.js`
- Create: `src/__tests__/url-sync.test.jsx`

- [ ] **Step 1: Write failing tests for useUrlSync**

Create `src/__tests__/url-sync.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useUrlSync } from "../url-sync.js";
import { chapters, sections, superSections } from "../config.js";

function Probe({ ch, sub, expanded }) {
  useUrlSync({ ch, sub, expanded });
  return null;
}

describe("useUrlSync", () => {
  let replaceSpy;
  let pushSpy;

  beforeEach(() => {
    replaceSpy = vi.spyOn(window.history, "replaceState");
    pushSpy = vi.spyOn(window.history, "pushState");
    window.history.replaceState(null, "", "/learn-ai/");
    replaceSpy.mockClear();
  });

  it("sets URL to chapter path on mount when ch>0", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    render(<Probe ch={idx} sub={0} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it("includes sub when sub>0", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/qkv-concepts");
    render(<Probe ch={idx} sub={3} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/attention-computation/qkv-concepts/3");
  });

  it("reflects TOC super expansion", () => {
    render(<Probe ch={0} sub={0} expanded={{ super: "C", section: null }} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/transformers");
  });

  it("reflects TOC super + section expansion", () => {
    render(<Probe ch={0} sub={0} expanded={{ super: "C", section: 10 }} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/transformers/attention");
  });

  it("does not call replaceState if URL already matches", () => {
    window.history.replaceState(null, "", "/learn-ai/");
    replaceSpy.mockClear();
    render(<Probe ch={0} sub={0} expanded={null} />);
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/url-sync.test.jsx`
Expected: FAIL ("Cannot find module ../url-sync.js").

- [ ] **Step 3: Implement useUrlSync**

Create `src/url-sync.js`:

```js
import { useEffect } from "react";
import { chapters, sections, superSections } from "./config.js";
import { buildPath } from "./url-routing.js";

export function useUrlSync({ ch, sub, expanded }) {
  useEffect(() => {
    const cfg = { chapters, sections, superSections };
    let target;
    if (ch === 0) {
      // TOC view - URL reflects expanded state
      target = buildPath(
        { kind: "toc", super: expanded?.super ?? null, section: expanded?.section ?? null },
        cfg,
      );
    } else {
      target = buildPath({ kind: "chapter", ch, sub }, cfg);
    }
    if (window.location.pathname !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [ch, sub, expanded]);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/url-sync.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-sync.js src/__tests__/url-sync.test.jsx
git commit -m "Add useUrlSync hook with replaceState"
```

---

## Task 8: Add `resolveInitialState` helper

**Files:**
- Modify: `src/url-routing.js`
- Modify: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write failing tests for resolveInitialState**

Append to `src/__tests__/url-routing.test.js`:

```js
import { resolveInitialState } from "../url-routing.js";

describe("resolveInitialState", () => {
  it("chapter URL resolves to chapter state", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/qkv-concepts");
    const state = resolveInitialState("/learn-ai/attention-computation/qkv-concepts/2", null, cfg);
    expect(state).toEqual({ ch: idx, sub: 2, expanded: null });
  });

  it("TOC super URL resolves to expanded state", () => {
    const state = resolveInitialState("/learn-ai/transformers", null, cfg);
    expect(state).toEqual({ ch: 0, sub: 0, expanded: { super: "C", section: null } });
  });

  it("TOC super+section URL resolves to expanded state", () => {
    const state = resolveInitialState("/learn-ai/transformers/attention", null, cfg);
    expect(state).toEqual({ ch: 0, sub: 0, expanded: { super: "C", section: 10 } });
  });

  it("bare URL with saved nav resolves to saved chapter", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    const state = resolveInitialState("/learn-ai/", { ch: idx, sub: 1 }, cfg);
    expect(state).toEqual({ ch: idx, sub: 1, expanded: null });
  });

  it("bare URL with no saved nav resolves to TOC", () => {
    expect(resolveInitialState("/learn-ai/", null, cfg)).toEqual({ ch: 0, sub: 0, expanded: null });
  });

  it("invalid URL falls back to TOC (ignores localStorage on invalid URL)", () => {
    expect(resolveInitialState("/learn-ai/no/such/chapter", { ch: 5, sub: 2 }, cfg)).toEqual({
      ch: 0,
      sub: 0,
      expanded: null,
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: FAIL ("resolveInitialState is not a function").

- [ ] **Step 3: Implement resolveInitialState**

Append to `src/url-routing.js`:

```js
export function resolveInitialState(pathname, savedNav, cfg) {
  const parsed = parsePath(pathname, cfg);
  if (parsed.kind === "chapter") {
    return { ch: parsed.ch, sub: parsed.sub, expanded: null };
  }
  if (parsed.kind === "toc") {
    if (parsed.super) return { ch: 0, sub: 0, expanded: { super: parsed.super, section: parsed.section } };
    // Bare URL: redirect to saved nav if present
    if (savedNav) return { ch: savedNav.ch, sub: savedNav.sub, expanded: null };
    return { ch: 0, sub: 0, expanded: null };
  }
  // Invalid URL: TOC, ignore localStorage so a bad shared link does not jump elsewhere
  return { ch: 0, sub: 0, expanded: null };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/url-routing.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/url-routing.js src/__tests__/url-routing.test.js
git commit -m "Add resolveInitialState combining URL and localStorage"
```

---

## Task 9: Wire `learn-ai.jsx` to URL routing

**Files:**
- Modify: `src/learn-ai.jsx` (around lines 147-156, 277-279)
- Modify: `src/__tests__/learn-ai.test.jsx`

- [ ] **Step 1: Write failing tests for boot-from-URL**

Add to `src/__tests__/learn-ai.test.jsx` (use the existing pattern in the file):

```js
import LearnAI from "../learn-ai.jsx";
import { chapters } from "../config.js";

describe("URL routing - boot", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/learn-ai/");
  });

  it("opens at chapter URL", async () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    window.history.replaceState(null, "", "/learn-ai/neural-foundations/what-is-nn");
    render(<LearnAI />);
    expect(await screen.findByText(/What is a Neural Network/i)).toBeInTheDocument();
  });

  it("opens TOC at bare URL", async () => {
    render(<LearnAI />);
    expect(await screen.findByText(/Table of Contents/i)).toBeInTheDocument();
  });

  it("redirects bare URL to saved chapter when localStorage present", async () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/inside-neuron");
    localStorage.setItem(
      "learn-ai-nav",
      JSON.stringify({ ch: idx, sub: 0, fingerprint: chapters.map((c) => c.slug).join(",") }),
    );
    render(<LearnAI />);
    await screen.findByText(/Inside a Single Neuron/i);
    expect(window.location.pathname).toBe("/learn-ai/neural-foundations/inside-neuron");
  });

  it("falls back to TOC for invalid URL", async () => {
    window.history.replaceState(null, "", "/learn-ai/no/such/chapter");
    render(<LearnAI />);
    expect(await screen.findByText(/Table of Contents/i)).toBeInTheDocument();
  });
});
```

(Check current `learn-ai.test.jsx` for the existing `render`/`screen` imports - reuse those.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/learn-ai.test.jsx`
Expected: failures because URL state is ignored at boot.

- [ ] **Step 3: Wire useUrlSync and resolveInitialState into learn-ai.jsx**

Update imports at the top of `src/learn-ai.jsx`:

```js
import { chapters, sectionNames, sectionColors, sections, superSections, C } from "./config.js";
import { T, ErrorBoundary } from "./components.jsx";
import { saveNav, loadNav } from "./nav-persistence.js";
import { resolveInitialState } from "./url-routing.js";
import { useUrlSync } from "./url-sync.js";
```

Replace the initial state block (currently around lines 147-156):

```js
const initial = (() => {
  if (typeof window === "undefined") return { ch: 0, sub: 0, expanded: null };
  return resolveInitialState(window.location.pathname, loadNav(chapters), { chapters, sections, superSections });
})();

const [ch, setCh] = useState(initial.ch);
const [fade, setFade] = useState(true);
const [sub, setSub] = useState(initial.sub);
```

Then in the `expanded` state declaration (currently `useState(null)` further down), seed it from initial:

```js
const [expanded, setExpanded] = useState(initial.expanded);
```

Mount the sync hook right after the state declarations:

```js
useUrlSync({ ch, sub, expanded });
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/learn-ai.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/learn-ai.jsx src/__tests__/learn-ai.test.jsx
git commit -m "Wire learn-ai shell to URL routing"
```

---

## Task 10: Add GitHub Pages SPA fallback (404.html + index.html shim)

**Files:**
- Create: `public/404.html`
- Modify: `index.html`

- [ ] **Step 1: Add the 404 shim**

Create `public/404.html` with the standard single-page-shim:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Learn AI</title>
    <script>
      // SPA fallback for GitHub Pages: stash the requested path and redirect to base.
      // The base index.html reads sessionStorage and replaceStates the original path.
      (function () {
        var basePath = "/learn-ai/";
        var l = window.location;
        var requested = l.pathname + l.search + l.hash;
        try {
          sessionStorage.setItem("spa-redirect", requested);
        } catch (_) {
          /* private mode - fall through */
        }
        l.replace(l.origin + basePath);
      })();
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Add the redirect script to index.html**

Open `index.html`. Just before the existing `<script type="module" src="/src/main.jsx"></script>` tag (or whatever launches the app), insert:

```html
<script>
  (function () {
    var basePath = "/learn-ai/";
    var l = window.location;
    if (l.pathname !== basePath && l.pathname !== basePath.slice(0, -1)) return;
    try {
      var saved = sessionStorage.getItem("spa-redirect");
      if (!saved) return;
      sessionStorage.removeItem("spa-redirect");
      if (saved.indexOf(basePath) !== 0) return;
      window.history.replaceState(null, "", saved);
    } catch (_) {
      /* ignore */
    }
  })();
</script>
```

This must run before `main.jsx` loads so `resolveInitialState` sees the correct path.

- [ ] **Step 3: Verify build still works**

Run: `npm run build`
Expected: build succeeds, `dist/404.html` is present.

```bash
ls dist/404.html && grep -q "spa-redirect" dist/index.html && echo OK
```

- [ ] **Step 4: Commit**

```bash
git add public/404.html index.html
git commit -m "Add GitHub Pages SPA fallback for deep links"
```

---

## Task 11: Final verification and manual browser check

**Files:** none

- [ ] **Step 1: Run full test suite with coverage**

Run: `npx vitest run --coverage`
Expected: all green; coverage at or above 100% for the changed files.

- [ ] **Step 2: Lint and format**

Run: `npm run lint && npm run format`
Expected: clean.

- [ ] **Step 3: Manual browser smoke test**

```bash
npm run dev
```

Visit each in order and confirm:
- `http://localhost:5173/learn-ai/` - TOC, all collapsed, URL stays bare
- Click Super C - URL becomes `/learn-ai/transformers`
- Click Section 10 inside Super C - URL becomes `/learn-ai/transformers/attention`
- Click any chapter inside - URL becomes `/learn-ai/<topic>/<chapter>`
- Click Continue twice - URL becomes `/learn-ai/<topic>/<chapter>/2`
- Refresh - reopens at same sub-step
- Open `http://localhost:5173/learn-ai/attention-computation/qkv-concepts/3` directly - lands at sub-step 3
- Open `http://localhost:5173/learn-ai/no/such/thing` - falls back to TOC
- Browser back button - exits app (no history entries accumulated)

- [ ] **Step 4: Production build smoke test**

```bash
npm run build && npm run preview
```

Repeat the same checks against `http://localhost:4173/learn-ai/`.

- [ ] **Step 5: Commit if any cleanup needed**

If lint/format changes occurred:

```bash
git add -A
git commit -m "Apply lint and format fixes"
```

---

## Self-Review

**Spec coverage:**
- URL scheme (all 5 shapes): Tasks 4-6
- Slugs for supers + sections: Tasks 1-2
- Collision validation: Task 1 (super vs chapter topic)
- `parsePath` / `buildPath` / `BASE_PATH`: Tasks 3-6
- `useUrlSync` hook: Task 7
- `resolveInitialState`: Task 8
- learn-ai.jsx integration: Task 9
- localStorage fallback for bare URL: Task 8 + Task 9 test
- 404.html + index.html shim: Task 10
- All edge cases in spec edge-case table: covered by parser tests in Tasks 4-5 plus boot tests in Task 9

**No placeholders:** verified - every step shows the actual code or command.

**Type consistency:**
- `{ kind: "toc" | "chapter" | "invalid", super, section, ch, sub }` shape used consistently in Tasks 4-8.
- `cfg = { chapters, sections, superSections }` consistent across parsePath, buildPath, resolveInitialState.
- `{ ch, sub, expanded }` consistent between useUrlSync, resolveInitialState, and learn-ai.jsx.
