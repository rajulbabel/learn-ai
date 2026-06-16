# Browser History Navigation - Design

Date: 2026-06-16

## Problem

The app already mirrors navigation state into the URL: section/TOC views, chapters,
and sub-steps all have deep-linkable URLs (`/super/section`, `/topic/chapter`,
`/topic/chapter/2`). But the browser Back and Forward buttons do not move through
that navigation. Pressing Back leaves the app entirely instead of returning to the
previous chapter, sub-step, or TOC view.

Two root causes in the current code:

1. `src/url-sync.js` writes every URL change with `window.history.replaceState`.
   `replaceState` updates the URL bar without adding a history entry, so there is
   nothing to go Back to.
2. There is no `popstate` listener. Even if entries existed, pressing Back would
   change `window.location` without updating React state (`ch`, `sub`, `expanded`),
   so the rendered screen would not follow.

## Goal

Browser Back/Forward step through the user's in-app navigation, one URL change at a
time. Per the agreed granularity: **every URL change is its own history entry** -
each sub-step reveal and each chapter/TOC change. Back reverses exactly one URL per
press. This is the most consistent reading of "go to the previous URL", since every
deep link the app already produces becomes individually reversible.

## Approach

Use the platform `history` API (`pushState` + `popstate`). No router library.
The existing `src/url-routing.js` (`parsePath`, `buildPath`, `resolveInitialState`)
already does all URL <-> state translation; we reuse it. A router dependency would
duplicate that logic and contradict the lightweight stack.

### Part 1 - `src/url-sync.js`: push instead of replace

`useUrlSync` currently:

```js
if (window.location.pathname !== target) {
  window.history.replaceState(null, "", target);
}
```

Change to:

- Hold a `firstSync` ref (`useRef(true)`).
- On the **first** effect run, use `replaceState`. This matters because on load the
  resolved initial state can differ from the typed URL (e.g. bare `/learn-ai/`
  redirects to `savedNav`). Using `replaceState` for that first write means the
  bare URL is replaced, not stacked, so Back does not land on a URL that just
  redirects again.
- On **every subsequent** run, use `pushState` so each distinct URL becomes a
  history entry.
- Keep the existing `pathname !== target` guard. It prevents redundant writes AND
  prevents the sync -> push -> sync feedback loop: after a `popstate`, the browser
  has already moved `window.location` to the previous URL; when React state updates,
  `buildPath(newState)` round-trips equal to that pathname, so the guard is false
  and no write happens.

`firstSync` flips to `false` after the first effect run regardless of whether a
write occurred.

### Part 2 - `usePopStateNav` hook (also in `src/url-sync.js`)

A new hook that registers a `popstate` listener once and tears it down on unmount.
On each `popstate`:

1. `parsePath(window.location.pathname, cfg)` -> parsed state.
2. Hand the parsed state to an `apply` callback supplied by `learn-ai.jsx`.

Mapping rules (mirror `resolveInitialState`):

- `kind === "chapter"` -> `ch = parsed.ch`, `sub = parsed.sub`, `expanded = null`.
- `kind === "toc"` with a super -> `ch = 0`, `sub = 0`,
  `expanded = { super, section }`.
- `kind === "toc"` bare -> `ch = 0`, `sub = 0`, `expanded = null`.
- `kind === "invalid"` -> TOC fallback: `ch = 0`, `sub = 0`, `expanded = null`.

The setters (`setCh`, `setSub`, `setExpanded`) are stable React state setters, so the
listener effect mounts once.

### Part 3 - `src/learn-ai.jsx`: wire the hook + coupling fix

There is an existing effect (`learn-ai.jsx:300`) that resets `expanded` to `null`
whenever `ch` changes:

```js
const prevChRef = useRef(ch);
useEffect(() => {
  if (prevChRef.current !== ch) {
    setBankIdx(0); setHovered(4); setExpanded(null); prevChRef.current = ch;
  }
}, [ch]);
```

Going Back to a TOC-with-expanded URL (e.g. `/super/section`) lands `ch = 0` and
sets `expanded = {...}`. If `ch` actually changed (e.g. from chapter 7 to TOC), this
reset effect would fire on the next render and wipe the `expanded` we just restored.

**Fix:** the popstate apply handler sets `prevChRef.current = newCh` **synchronously
before** calling the setters. When the reset effect then runs, it sees
`prevChRef.current === ch` and no-ops, so the restored `expanded` survives.

The apply handler lives in `learn-ai.jsx` (it needs `prevChRef`):

```js
const applyHistoryState = useCallback((parsed) => {
  if (parsed.kind === "chapter") {
    prevChRef.current = parsed.ch;
    setCh(parsed.ch);
    setSub(parsed.sub);
    setExpanded(null);
    window.scrollTo({ top: 0 });
  } else {
    // toc or invalid
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
```

`usePopStateNav(applyHistoryState)` is called alongside the existing
`useUrlSync({ ch, sub, expanded })`. popstate navigation is **instant** - it skips
the 60ms fade transition that `goTo` uses (Back/Forward should feel immediate) and
scrolls to top on a chapter land.

### Round-trip guarantee

The loop-prevention guard depends on `buildPath(parsePath(url)) === url` for every
URL the app produces:

- Chapter: `/topic/chapter`
- Chapter + sub: `/topic/chapter/2`
- TOC super: `/super`
- TOC super + section: `/super/section`
- Bare: `/learn-ai/`

This round-trip is locked by a property test so a future change to `url-routing.js`
that breaks it fails CI (a broken round-trip would re-introduce the feedback loop).

## Components and boundaries

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `useUrlSync` (url-sync.js) | State -> URL. First write replace, rest push. | `buildPath`, config |
| `usePopStateNav` (url-sync.js) | popstate -> parsed state -> `apply` callback | `parsePath`, config |
| `applyHistoryState` (learn-ai.jsx) | parsed state -> React setters + `prevChRef` sync | state setters, `prevChRef` |

`url-sync.js` stays the single owner of all `history` API calls. `learn-ai.jsx` owns
React state. The `apply` callback is the seam between them.

## Error handling / edge cases

- **Bare URL with savedNav redirect on load:** first write is `replaceState`, so no
  junk entry. Back from the first real navigation exits the app (correct).
- **Invalid URL via Back:** the app only ever pushes valid URLs, so this only occurs
  if the user manually typed garbage as the entry URL. popstate maps invalid -> TOC.
- **Rapid sub-step clicks:** each pushes an entry by design (chosen granularity).
  Accepted; Back walks reveal-by-reveal.
- **Feedback loop:** prevented by the `pathname !== target` guard + round-trip
  guarantee.
- **expanded wipe on chapter->TOC Back:** prevented by the `prevChRef` pre-sync.

## Testing (TDD)

Tests written first, must fail before implementation.

- `src/__tests__/url-sync.test.jsx`
  - First sync uses `replaceState`, not `pushState`.
  - Subsequent syncs use `pushState`.
  - No write when `pathname === target`.
  - `usePopStateNav`: dispatching a `popstate` event parses the current pathname and
    calls `apply` with the correct parsed state for chapter, chapter+sub, TOC-super,
    TOC-super+section, bare, and invalid URLs.
- `src/__tests__/url-routing.test.jsx` (or existing routing test)
  - Property/round-trip: `buildPath(parsePath(url)) === url` for each URL shape.
- `src/__tests__/learn-ai.test.jsx`
  - Integration: after navigating, dispatching `popstate` with a prior URL updates
    the rendered chapter/sub/TOC.
  - Back to a TOC-expanded URL preserves `expanded` (prevChRef coupling fix).
  - Existing `replaceState`/`pushState` spies updated for the new push behavior.

Coverage must stay at 100% lines/branches/functions/statements over the enforced
globs (`url-sync.js` is not in the enforced glob list, but `learn-ai.jsx` changes are
excluded by config; new branches in `url-sync.js` still get direct unit tests).

## Files changed

- `src/url-sync.js` - push/replace logic + `usePopStateNav` hook.
- `src/learn-ai.jsx` - `applyHistoryState` + `usePopStateNav` wiring.
- Tests as listed above.

No config, content, SEO, or search-index change. `llms.txt`, `sitemap.xml`, and
`index.html` are untouched.

## Out of scope (YAGNI)

- Scroll-position restoration on Back (only top-scroll on chapter land).
- Per-reveal fade animation on Back/Forward (instant is the goal).
- Trapping Back at the app boundary (standard browser exit is fine).
