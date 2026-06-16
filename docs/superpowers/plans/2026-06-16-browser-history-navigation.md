# Browser History Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the browser Back/Forward buttons step through the user's in-app navigation (chapters, sub-steps, TOC views), one URL change per press.

**Architecture:** Switch `url-sync.js` from `replaceState` (no history entry) to `pushState` after the first sync, and add a `usePopStateNav` hook that re-parses the URL into React state on Back/Forward. A `prevChRef` pre-sync in `learn-ai.jsx` stops the existing chapter-change effect from wiping restored TOC expansion. The existing `pathname !== target` guard plus a `buildPath(parsePath(url)) === url` round-trip prevent a sync->push->sync loop. No router library.

**Tech Stack:** React 18 hooks, the platform `window.history` / `popstate` API, Vitest + @testing-library/react.

---

## File Structure

| File | Responsibility | Change |
|------|----------------|--------|
| `src/url-sync.js` | All `history` API writes (`useUrlSync`) + new `popstate` listener (`usePopStateNav`) | Modify + add |
| `src/learn-ai.jsx` | React nav state; new `applyHistoryState` callback wiring popstate to setters | Modify |
| `src/__tests__/url-routing.test.js` | Round-trip invariant lock | Add a test |
| `src/__tests__/url-sync.test.jsx` | push/replace behavior + `usePopStateNav` unit tests | Modify + add |
| `src/__tests__/learn-ai.test.jsx` | Integration: popstate updates rendered screen; expanded survives | Add tests |

Reference facts (from `src/config.js`, confirmed in existing tests):
- Super `"C"` has slug `"transformers"`; section `10` has slug `"attention"`.
- Chapter file `"neural-foundations/what-is-nn"` exists and is mocked in `learn-ai.test.jsx`.

---

## Task 1: Lock the round-trip invariant

The loop-prevention guard relies on `buildPath(parsePath(url)) === url` for every URL
the app emits. This invariant already holds; this task locks it so a future
`url-routing.js` change that breaks it fails CI.

**Files:**
- Test: `src/__tests__/url-routing.test.js`

- [ ] **Step 1: Write the test**

Append to `src/__tests__/url-routing.test.js` (inside the existing top-level
`describe`, or add a new `describe`). It needs these imports present at the top of
the file - add any that are missing:

```js
import { parsePath, buildPath, BASE_PATH } from "../url-routing.js";
import { chapters, sections, superSections } from "../config.js";
```

Test body:

```js
describe("round-trip invariant", () => {
  const cfg = { chapters, sections, superSections };

  it("buildPath(parsePath(url)) === url for every URL shape", () => {
    const urls = [
      BASE_PATH,
      `${BASE_PATH}neural-foundations/what-is-nn`,
      `${BASE_PATH}neural-foundations/what-is-nn/2`,
      `${BASE_PATH}transformers`,
      `${BASE_PATH}transformers/attention`,
    ];
    for (const url of urls) {
      expect(buildPath(parsePath(url, cfg), cfg)).toBe(url);
    }
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/__tests__/url-routing.test.js -t "round-trip"`
Expected: PASS (this is a regression lock - the invariant already holds). If it
FAILS, stop: `url-routing.js` has a pre-existing round-trip bug that must be fixed
before the rest of this plan is safe.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/url-routing.test.js
git commit -m "Lock URL round-trip invariant for history nav"
```

---

## Task 2: Push history entries instead of replacing

`useUrlSync` writes every URL with `replaceState`, which adds no history entry.
Change it to `replaceState` on the first sync only, then `pushState` on every
subsequent navigation.

**Files:**
- Modify: `src/url-sync.js`
- Test: `src/__tests__/url-sync.test.jsx`

- [ ] **Step 1: Update the test file's afterEach (remove the obsolete no-push guard)**

The current `afterEach` asserts `expect(pushSpy).not.toHaveBeenCalled()`. Pushing is
now expected behavior, so that global guard is obsolete. Replace the `afterEach`
block in `src/__tests__/url-sync.test.jsx` with:

```js
  afterEach(() => {
    vi.restoreAllMocks();
  });
```

- [ ] **Step 2: Write the failing test**

Add these two tests inside the `describe("useUrlSync", ...)` block in
`src/__tests__/url-sync.test.jsx`:

```js
  it("uses pushState for navigations after the first sync", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    const { rerender } = render(<Probe ch={0} sub={0} expanded={null} />);
    // First sync at bare URL matches -> no write, but firstSync flips to false.
    replaceSpy.mockClear();
    pushSpy.mockClear();
    rerender(<Probe ch={idx} sub={0} expanded={null} />);
    expect(pushSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("uses replaceState (not pushState) for the very first sync", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    render(<Probe ch={idx} sub={0} expanded={null} />);
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "/learn-ai/neural-foundations/what-is-nn");
    expect(pushSpy).not.toHaveBeenCalled();
  });
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/url-sync.test.jsx -t "pushState for navigations"`
Expected: FAIL - current code calls `replaceState` on the rerender, so `pushSpy` is
never called.

- [ ] **Step 4: Implement push/replace logic in `src/url-sync.js`**

Replace the entire contents of `src/url-sync.js` with:

```js
import { useEffect, useRef } from "react";
import { chapters, sections, superSections } from "./config.js";
import { buildPath, parsePath } from "./url-routing.js";

export function useUrlSync({ ch, sub, expanded }) {
  const firstSync = useRef(true);
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
      if (firstSync.current) {
        // Replace on the first sync so a bare-URL -> savedNav redirect on load
        // does not leave a junk entry to navigate "back" to.
        window.history.replaceState(null, "", target);
      } else {
        // Every later navigation gets its own history entry.
        window.history.pushState(null, "", target);
      }
    }
    firstSync.current = false;
  }, [ch, sub, expanded?.super, expanded?.section]);
}

export function usePopStateNav(apply) {
  useEffect(() => {
    const onPop = () => {
      const cfg = { chapters, sections, superSections };
      apply(parsePath(window.location.pathname, cfg));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [apply]);
}
```

- [ ] **Step 5: Run the url-sync tests to verify they pass**

Run: `npx vitest run src/__tests__/url-sync.test.jsx`
Expected: PASS (all existing first-sync tests still pass because each mounts fresh;
the two new tests pass).

- [ ] **Step 6: Commit**

```bash
git add src/url-sync.js src/__tests__/url-sync.test.jsx
git commit -m "Push history entries on navigation, add usePopStateNav hook"
```

---

## Task 3: Unit-test usePopStateNav

`usePopStateNav` was added in Task 2. Add direct unit tests for it so its branches
(chapter, chapter+sub, TOC-super, TOC-super+section, bare, invalid) are covered.

**Files:**
- Test: `src/__tests__/url-sync.test.jsx`

- [ ] **Step 1: Write the failing test**

Add to `src/__tests__/url-sync.test.jsx`. First extend the top import to include the
hook, and add a probe component near the existing `Probe`:

```js
import { useUrlSync, usePopStateNav } from "../url-sync.js";

function PopProbe({ onApply }) {
  usePopStateNav(onApply);
  return null;
}
```

Then add a new describe block at the end of the file:

```js
describe("usePopStateNav", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/learn-ai/");
    vi.restoreAllMocks();
  });

  function popAt(pathname) {
    const apply = vi.fn();
    window.history.replaceState(null, "", pathname);
    render(<PopProbe onApply={apply} />);
    window.dispatchEvent(new PopStateEvent("popstate"));
    return apply;
  }

  it("parses a chapter URL on popstate", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    const apply = popAt("/learn-ai/neural-foundations/what-is-nn");
    expect(apply).toHaveBeenCalledWith({ kind: "chapter", ch: idx, sub: 0 });
  });

  it("parses a chapter+sub URL on popstate", () => {
    const idx = chapters.findIndex((c) => c.file === "neural-foundations/what-is-nn");
    const apply = popAt("/learn-ai/neural-foundations/what-is-nn/2");
    expect(apply).toHaveBeenCalledWith({ kind: "chapter", ch: idx, sub: 2 });
  });

  it("parses a TOC super URL on popstate", () => {
    const apply = popAt("/learn-ai/transformers");
    expect(apply).toHaveBeenCalledWith({ kind: "toc", super: "C", section: null });
  });

  it("parses a TOC super+section URL on popstate", () => {
    const apply = popAt("/learn-ai/transformers/attention");
    expect(apply).toHaveBeenCalledWith({ kind: "toc", super: "C", section: 10 });
  });

  it("parses the bare URL on popstate", () => {
    const apply = popAt("/learn-ai/");
    expect(apply).toHaveBeenCalledWith({ kind: "toc", super: null, section: null });
  });

  it("reports invalid for an unknown URL on popstate", () => {
    const apply = popAt("/learn-ai/no/such/chapter");
    expect(apply).toHaveBeenCalledWith({ kind: "invalid" });
  });
});
```

- [ ] **Step 2: Run the tests to verify they pass**

Run: `npx vitest run src/__tests__/url-sync.test.jsx -t "usePopStateNav"`
Expected: PASS. (`usePopStateNav` exists from Task 2; these tests exercise its
parse-and-dispatch branches.)

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/url-sync.test.jsx
git commit -m "Unit-test usePopStateNav parse branches"
```

---

## Task 4: Wire popstate into learn-ai.jsx with the prevChRef coupling fix

Connect `usePopStateNav` to React state via an `applyHistoryState` callback. The
callback sets `prevChRef.current` synchronously before the setters so the existing
chapter-change reset effect (`learn-ai.jsx:300`) does not wipe restored TOC
expansion.

**Files:**
- Modify: `src/learn-ai.jsx`
- Test: `src/__tests__/learn-ai.test.jsx`

- [ ] **Step 1: Write the failing integration tests**

Add `waitFor` to the testing-library import at the top of
`src/__tests__/learn-ai.test.jsx`:

```js
import { render, screen, fireEvent, cleanup, act, waitFor } from "@testing-library/react";
```

Add this describe block to `src/__tests__/learn-ai.test.jsx` (sibling of the
existing `describe("URL routing - boot", ...)`):

```js
describe("URL routing - back/forward (popstate)", () => {
  beforeEach(async () => {
    localStorage.clear();
    window.history.replaceState(null, "", "/learn-ai/");
    const navMod = await import("../nav-persistence.js");
    navMod.loadNav.mockReturnValue(null);
  });

  it("popstate to a chapter URL renders that chapter", async () => {
    await renderLearnAI();
    await screen.findByText(/Table of Contents/i);
    act(() => {
      window.history.replaceState(null, "", "/learn-ai/neural-foundations/what-is-nn");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(await screen.findByText(/What is a Neural Network/i)).toBeTruthy();
  });

  it("popstate to a TOC section URL preserves expansion (no overwrite back to bare)", async () => {
    window.history.replaceState(null, "", "/learn-ai/neural-foundations/what-is-nn");
    await renderLearnAI();
    await screen.findByText(/What is a Neural Network/i);
    act(() => {
      window.history.replaceState(null, "", "/learn-ai/transformers/attention");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await screen.findByText(/Table of Contents/i);
    // If the chapter-change effect had wiped `expanded`, useUrlSync would push the
    // bare URL. The path staying put proves expansion survived and no loop fired.
    await waitFor(() => expect(window.location.pathname).toBe("/learn-ai/transformers/attention"));
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/__tests__/learn-ai.test.jsx -t "popstate"`
Expected: FAIL - `usePopStateNav` is not wired into `learn-ai.jsx` yet, so popstate
does nothing and the chapter/TOC text never appears (or the path is overwritten).

- [ ] **Step 3: Import the hook in `src/learn-ai.jsx`**

Change the url-sync import line (currently `import { useUrlSync } from "./url-sync.js";`)
to:

```js
import { useUrlSync, usePopStateNav } from "./url-sync.js";
```

- [ ] **Step 4: Add applyHistoryState and wire the hook**

In `src/learn-ai.jsx`, the `prevChRef` is declared at line 299:

```js
  const prevChRef = useRef(ch);
```

Immediately AFTER the existing `useEffect` that uses `prevChRef` (the block ending at
line 307 that resets `setBankIdx`/`setHovered`/`setExpanded` on chapter change), add:

```js
  // Back/Forward: re-parse the URL into React state. Set prevChRef.current first so
  // the chapter-change reset effect above no-ops and restored TOC expansion survives.
  const applyHistoryState = useCallback((parsed) => {
    if (parsed.kind === "chapter") {
      prevChRef.current = parsed.ch;
      setCh(parsed.ch);
      setSub(parsed.sub);
      setExpanded(null);
      window.scrollTo({ top: 0 });
    } else {
      prevChRef.current = 0;
      setCh(0);
      setSub(0);
      setExpanded(
        parsed.kind === "toc" && parsed.super
          ? { super: parsed.super, section: parsed.section }
          : null,
      );
    }
  }, []);
  usePopStateNav(applyHistoryState);
```

- [ ] **Step 5: Run the popstate integration tests to verify they pass**

Run: `npx vitest run src/__tests__/learn-ai.test.jsx -t "popstate"`
Expected: PASS.

- [ ] **Step 6: Run the full learn-ai test file to check for regressions**

Run: `npx vitest run src/__tests__/learn-ai.test.jsx`
Expected: PASS (existing boot/navigation tests unaffected).

- [ ] **Step 7: Commit**

```bash
git add src/learn-ai.jsx src/__tests__/learn-ai.test.jsx
git commit -m "Wire popstate to nav state with prevChRef coupling fix"
```

---

## Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite with coverage**

Run: `npx vitest run --coverage`
Expected: PASS, coverage stays at 100% lines/branches/functions/statements over the
enforced globs (`src/config.js`, `src/components.jsx`, `src/nav-persistence.js`,
`src/chapters/**`, `src/shared/**`). Note: `url-sync.js` and `learn-ai.jsx` are not
in the enforced globs, but their new branches are covered by Tasks 2-4.

- [ ] **Step 2: Lint and format**

Run: `npm run lint`
Expected: no errors. If eslint flags `react-hooks/exhaustive-deps` on
`applyHistoryState` (deps `[]`), confirm it is clean - `prevChRef` and the `useState`
setters are stable and do not belong in the deps array. If lint insists, the existing
codebase convention takes precedence; resolve per existing patterns.

Run: `npm run format`
Expected: no changes, or formatting applied cleanly.

- [ ] **Step 3: Manual smoke test in the real app**

Run: `npm run dev`, open `localhost:5173/learn-ai/`, then:
- Navigate TOC -> a section -> a chapter -> click Continue twice (two sub-steps).
- Press browser Back repeatedly: should reverse sub2 -> sub1 -> sub0 -> section TOC -> TOC, one press each.
- Press Forward: should replay the same steps in order.
- Confirm the rendered screen matches the URL at each step and Back at the very first entry exits the app.

- [ ] **Step 4: Commit any formatting changes**

```bash
git add -A
git commit -m "Format after history navigation feature" || echo "nothing to commit"
```

---

## Notes for the implementer

- **Why first-sync replace, then push:** on load the app may redirect a bare URL to
  the saved chapter. Replacing that first write avoids stacking a junk entry. Every
  real navigation after that pushes, so Back/Forward have entries to move through.
- **Why no explicit loop guard beyond `pathname !== target`:** after a popstate the
  browser has already moved the URL; the new React state round-trips
  (`buildPath(parsedState) === pathname`, locked by Task 1), so the guard is false
  and `useUrlSync` writes nothing. No loop.
- **Why the prevChRef pre-sync:** the chapter-change effect resets `expanded` to
  `null`. Restoring a TOC-expanded URL via Back sets `ch=0` + `expanded`; without the
  pre-sync, that effect would fire and wipe `expanded`. Setting
  `prevChRef.current = newCh` first makes the effect a no-op.
- **Do NOT** add a router dependency, change `url-routing.js`, or touch config / SEO /
  search-index files. None of that is needed.
