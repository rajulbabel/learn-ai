# Section 13 Milestone 1 Lessons

Captured at the end of M1 to inform M2. Read this before executing M2.

## What worked well

- **Pattern-locking helpers paid off immediately.** Adding `SOFT` map, `tintedCard(color)`, and `pill(color)` exports at the top of `agent-prompting.jsx` after 13.1 prevented 5 chapters' worth of duplicated badge/card inline styles. Adopt the same convention in 13.12+: any helper used in 2+ sub-steps within a chapter belongs at the top of the file with `export`, so the next file in the act can import it. Helpers added in this milestone live in `src/sections/agent-prompting.jsx`. `agent-tools.jsx` imports `SOFT, tintedCard, pill, DIM_BG, DIM_BORDER` from there — keep that direction (Act 1 file is the helper hub; Act 2+ files consume) instead of duplicating per file.

- **Two-stage review after 13.1 caught real defects** that would have shipped: missing `textAlign: "center"` on 3 row card divs, all 4 finish_reason badges in single yellow color, unlabeled timeline arrows, invalid `${C.dim}NN` CSS. After helpers + the fixes landed, 13.2-13.11 dropped to 0-1 minor issues each. Spec compliance review on chapter 1 is the highest-leverage gate.

- **Chrome sweep with `<desc>` filter by viewBox size** worked well. The app chrome contains a search-icon SVG (viewBox `0 0 24 24`) that always shows missing-desc — filter SVGs with `viewBox` width/height > 100 to isolate chapter content SVGs. Adopt the same check function in M2.

- **`SOFT.X` keyed by C palette name** is the cleanest soft-shade pattern. Replaces ad-hoc soft-color hexes like `#80deea` scattered across files. Add new entries when introducing a new accent.

- **Unique-to-sub=N test matcher (e.g., `Prompt Template`, `Ticket Classifier Template`, `Canonical Tool Schema`)** turned out essential — without it, sub=5 tests pass even if the sub=5 content is deleted (earlier sub-steps remain mounted). Pattern: every sub=5 test asserts at least one string that only exists in sub=5.

- **Module-level data constants above each chapter export** (e.g., `MESSAGE_ROLES`, `CONTRACT_PARTS`, `CANONICAL_TOOLS`, `T1_TRACE_ROWS`, `LATENCY_BUDGET`) keep the JSX declarative and the chapter scannable. Continue this pattern in M2.

## What didn't work / had to be fixed mid-flight

- **Task 5 ordering bug:** TOC entry registration assumes `sectionChapters[N]` is non-empty. Adding `{ num: 13, name: "AI Agents" }` to TOC before adding the 11 chapter entries to `chapters[]` caused 31 test failures. Fix: register the loader first, defer TOC entry until after chapter entries land. Plan M2 should NOT separate "register section in TOC" from "add chapter entries" — do both in one task, or do chapter entries first.

- **C palette gap:** Plan called for `C.indigo` and `C.teal` in the sub-step color rotation but neither existed in the global `C` palette. Implementer for 13.1 introduced file-local `INDIGO`/`TEAL` constants as a workaround. Mid-task I added them to `config.js` and refactored. Lesson: M2 plan should explicitly verify all required palette colors exist in `C` before any implementation task starts — add to Task 1 baseline verify.

- **`${C.dim}NN` invalid CSS pattern.** `C.dim` is `rgba(255,255,255,0.35)` so template literals like `${C.dim}12` produce `rgba(255,255,255,0.35)12` which browsers silently drop. The pattern existed elsewhere in the codebase but only got caught by spec review. Lesson: when an implementer needs a dim/disabled state, route them through `DIM_BG = "#1b1b22"` / `DIM_BORDER = "#33333a"` (both exported from agent-prompting.jsx). Add this to M2 starter prompt.

- **Implementer subagents running `npm run format` cascade-rewrites unrelated files** (data JSONs, learn-ai.jsx, other section files). Each implementer prompt for chapters now includes "Do NOT run `npm run format`" — repeat in M2. Format runs should happen only at milestone-end if at all, scoped via explicit file list.

- **Coverage threshold:** Pre-existing gaps in `encoder-decoder-diagrams.jsx` (lines 59, 1242, 1976) put aggregate lines at 99.91% vs. plan's "100%" expectation. Section 13 files individually are 100/100. Treat this as a pre-existing artifact, not an M2 blocker; or open a separate cleanup task.

- **Coverage threshold gate (CI) fails the build** because vitest config has `lines: 100`. This was already failing before Section 13. M2 should not be blocked by it. Either drop the threshold or fix encoder-decoder-diagrams.jsx coverage as a separate cleanup task.

- **Pre-existing flaky test `learn-ai-prefetch.test.jsx > calls prefetchSearch after window load + idle`** intermittently failed in full-suite runs but always passed in isolation. Not caused by Section 13. Skip if it pops up in M2.

## Test-pattern observations

- Regex matchers like `/never/i`, `/category/i`, `/system/i` are SO loose that earlier-sub-step content matches them. **For every sub=N test, include at least one matcher that is unique to that sub-step's content** (e.g., a specific badge label, a number from a worked example, a noun unique to that visual).

- Test counts as guideposts: each chapter adds 6-7 content tests + 11 auto-iteration tests = ~17 new tests. Baseline 2627 (after scaffold) climbed to 2688 after 11 chapters. Use the per-chapter delta as a smoke check that the chapter wired in correctly.

## Visual-rule landmines

- **Card title without `center` prop** is the single most common visual rule miss. Plan stresses it but reviewers still caught a missed one in 13.3. M2 starter prompt should call this out explicitly.

- **Forward-chapter hints inside content** never appeared in M1 (good). The within-section signpost "we'll formalize the loop in Section 13.20" in 13.7 is fine — it's a within-section back/forward reference, not a "Coming up:" banner.

## Recommendations for M2

1. **Verify `C` palette has all required colors** as part of Task 1 baseline (Add `C.X` check for each color the plan references).
2. **Combine TOC-entry + chapter-entries** into a single task (do chapters first, then TOC, in one commit if practical).
3. **Helper hub stays in `agent-prompting.jsx`.** M2 will edit `agent-tools.jsx` (Act 3) and likely create `agent-loops.jsx` / `agent-memory.jsx` (Acts 4-5). Each new file imports helpers from agent-prompting.jsx. Centralize, don't duplicate.
4. **Every sub=N test includes one matcher unique to sub=N's content.**
5. **Every chapter implementer prompt explicitly forbids `npm run format`** and tells them to revert any out-of-scope dirty files via `git restore` before staging.
6. **Standard latency / cost / customer-support running example** is now well-established (Alice / c-9924 / docs.example.com / 8 canonical tools / 5 tickets). M2 chapters should keep using these — no new fictional customers or domains.
7. **Two-stage review only on the first chapter of each new file.** Once the pattern is locked (helpers used, conventions followed), subsequent chapters in the same file rarely surface new spec/quality issues. Save the review budget for the first chapter that introduces a new file or a new diagram class.

## Section-13-specific outcomes

- 11 chapters across 2 files (`agent-prompting.jsx` 6 chapters + `agent-tools.jsx` 5 chapters).
- 2688 tests passing, 2 skipped.
- Coverage on Section 13 files: 100% statements/branches/functions/lines.
- 19 commits on `worktree-section13` branch (scaffold + 11 chapters + helpers + polish + metadata + svg-descriptions + CLAUDE.md).
- SVG descriptions registered for 13.5, 13.6, 13.7, 13.9, 13.10, 13.11.
- No em-dashes, no `C.card`, no `opacity`, no forward-chapter hints, no carry-over fictional brand names anywhere in the new code.
