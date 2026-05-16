# Section 12 Milestone 5 Lessons (executed 2026-05-17)

What M5 taught us that M6 should bake in.

## What worked

- **Direct execution (no Task tool available)** held cleanly again. M4 lessons #1 generalized perfectly: with a well-specified plan, the controller-as-implementer pattern preserves TDD discipline + Chrome visual gate + scope binding. The starter prompt explicitly noted "if Task is unavailable, controller executes directly" so there was zero time lost re-investigating. Total session time was dominated by content design and Chrome roundtrips, not by tooling rediscovery.

- **`FormulaBox` helper inlined inside `RAGASMetrics`** kept the four standalone-formula sub-steps (sub=1 through sub=4) visually consistent without bloating module top-level. Pattern: define a tiny `({ color, children }) => <div .../>` component inside the chapter function, then reuse it 4x. Better than 4 copy-pasted `<div>` blocks. The CLAUDE.md visual rule "Standalone formulas always centered" lands automatically because the helper bakes `textAlign: center` in. Recommend M6 plan suggest this for any chapter with 2+ standalone formulas.

- **Counter-example data array trick for 100/100 branch coverage.** The Context Recall block (12.33 sub=4) originally used `c.retrieved ? "Retrieved" : "Missed"` against a data array where every item had `retrieved: true`. Coverage flagged lines 1610-1611 because the false branch never ran. Fix: introduce a `RG_RECALL_CHUNKS_COUNTER` array with one `retrieved: false` entry and render BOTH the original 2/2 case AND the counter-example 1/2 case in the same sub-step. Outcome: chapter coverage went 100/100, and the chapter is pedagogically stronger because learners now see both a passing and a failing recall worked example side by side. Pattern generalizes - if a chapter has a "what would happen if it were different" comment, render the alternative as a tinted counter-example block with its own data array.

- **Bind tests + RED-then-GREEN ordering** stayed disciplined throughout 5 chapters. Wrote describe block first, ran scoped vitest to confirm RED, implemented chapter, ran scoped vitest to confirm GREEN. Then added SVG descriptions, then format+lint+Chrome gate, then commit. Each cycle averaged 12-15 minutes per chapter.

- **Chrome visual gate via sub=20 + localStorage trick** continues to be the right approach. Compute chapter index from the fingerprint string by `parts.indexOf("12.31")` and reuse the same fingerprint across reloads. Every sub-step renders simultaneously. Verifying box-bottom-vs-next-box-top in JavaScript catches overlap regressions automatically; rectCount lets you confirm the right number of sub-steps rendered.

- **`<desc>` first child + svg-descriptions.json entries** for new SVGs only (skip the "12.33" entry because the chapter renders no `<svg>` elements - all formulas and report cards are div-based). The plan explicitly noted this; followed it without adding spurious entries.

- **Pre-existing Bash tool quirk:** when `npx vitest run` output is consumed by a separate `grep` after `2>&1`, stderr lines occasionally clobber the grep matcher. Fix: redirect to a file (`> /tmp/cov.txt`) then `grep` the file. Used this for coverage reports without losing the line containing rag-evaluation's row.

## What broke or wasted time

- **Pre-commit hook noisy in coverage runs.** Every `npx vitest run --coverage` triggers `[pre-commit] Bin size (31) != count × dim (32). Run: npm run search:build` and `[pre-commit] Chunk id b has no vectors in manifest.` when chunks.json has been edited since the last embedding rebuild. These are warnings, not test failures, but they spam the output and mask the actual coverage table. Lesson: rebuild search index BEFORE running coverage if any source file in a section has changed. M6: build the search index immediately after Task 5 (sections.test.jsx register) so the pre-commit hook stays quiet for the rest of the milestone.

- **Flaky `learn-ai-prefetch.test.jsx`** failed once under full-suite + coverage but passed cleanly when re-run scoped. Documented in M3/M4 lessons; recurred again here. Suggest M6 plan add a `retry: 2` or `vi.useFakeTimers()` fix in the test itself; if not, document the re-scoped re-run pattern in the plan rather than letting executors waste time investigating.

- **Initial Reveal import in stub file** triggered an eslint warning because the import was unused until the first chapter implementation. Plan said "remove it for now and re-add it in the first chapter that uses it" but the rewrite was extra friction. Fix: M6 should skip the `Reveal` import in the stub-only file and add it back inline at chapter implementation time. Avoids the eslint-disable-directive workaround.

- **Search index rebuild took ~13 minutes** to run `npm run search:embed` for the 5 new chapter embeddings (LLM-tagged + chunked + vectorized). Worth noting in the plan that this step is not instant; allow time. Cache hits make 99% of the work cached, but new LLM calls + embeddings are ~2 min/chapter when uncached.

- **Visual gate: stale-worktree dev server stayed running on port 5174** the entire session (`.claude/worktrees/section13/`). Never stole focus this time, but it remains a latent risk per M4 lessons #4. The browser tab list shows BOTH tabs at all times. Always verify `tabId 1742837252` (port 5173) is the one being interacted with. M6: explicitly tell the worker "5173 is the target dev server; ignore 5174 (stale section13 worktree)".

## Patterns that worked better than spec said

- **Diamond-layout for cycle diagrams (12.35 sub=5)** with 4 nodes at top/right/bottom/left and direction-aware arrows (computed from unit vectors of the line between successive nodes) avoided the spec's suggestion of explicit `<polygon>` arrows. The arrow head is computed inline as a small triangle perpendicular to the line direction. Cleaner than 4 separate paths with hardcoded arrowhead angles. Spec said "circular flow"; diamond is geometrically cleaner and used the same approach for 4-node loops as for 5-node loops if M6 needs them.

- **`FormulaBox` inline helper inside RAGASMetrics.** Spec said each formula is a standalone centered block. Defining a 1-line `({ color, children })` helper and reusing 4 times produced 4 visually-identical centered formula blocks with type-safe color theming. Same trick as M4's `PromptTemplateBlock` but scoped to one chapter (not module-level, since it's only used in one chapter). Pattern: extract helpers AT THE CHAPTER LEVEL when reuse is in-chapter; only promote to module-level if used across 2+ chapters in the same file.

- **Color-coded retrieved/missed badges** in worked-example tables for 12.33 sub=4. Instead of `<T color={C.green}>{c.retrieved ? "Retrieved" : "Missed"}</T>`, use `<T color={c.retrieved ? C.green : C.red}>`. Green for the success branch, red for the miss branch. Makes the counter-example pop visually because the "Missed" badge is red. Generalizes to any verdict pair in any chapter.

- **2-column +/- bullet grid for offline-vs-online comparison** in 12.35 sub=0. Each row in the column is a +/- badge plus a one-line phrase. The grid is tinted by the column's section color. Cleaner than two paragraphs and immediately scannable. Pattern: when you need to contrast two approaches with 3-4 bullet points each, use this 2-column + tinted-row layout instead of side-by-side prose blocks. 

## Recommended M6 plan tightenings

1. **Pre-emptively rebuild search index after Task 5.** Add an explicit step at the end of the "register section file in sections.test.jsx" task: `npm run search:index && npm run search:embed`. Avoids the noisy pre-commit warnings in subsequent coverage runs. The earlier in the milestone this happens, the cleaner the rest of the session feels.

2. **Document the prefetch test re-scope pattern in the plan body, not just in lessons.** Move the M3+M4+M5 lessons #2 into the M6 plan's "Known flaky tests" section so executors recognize the pattern without reading the lessons file separately.

3. **Skip `Reveal` import in stub files.** M5 plan said "import Reveal in the header even though stubs do not use it - the per-chapter tasks will use Reveal heavily" but then the executor had to remove the import to satisfy lint. M6 plan: instruct "do not import Reveal in the stub file; add it on the first chapter implementation that uses it (after a `git diff --stat` confirms scope)".

4. **Note the counter-example trick for 100% branch coverage.** Any chapter with a ternary based on a data array's bool field needs at least one entry of each side - OR a separate counter-example data array. Explicitly recommend this in the M6 plan's coverage section to avoid the same retro-fix M5 needed.

5. **Bake the small inline `FormulaBox` helper into the M6 plan templates.** Multiple chapters in M6 will need standalone formula blocks (e.g., 12.37 CostModels has cost = embedding_cost + storage_cost + retrieval_cost + generation_cost lookup formulas). Suggest extracting a `FormulaBox` helper INSIDE rag-production.jsx near the top so all 6 chapters can share it. Same pattern as M4's `PromptTemplateBlock`.

6. **Hard-code chapter indices in the Chrome visual gate snippets.** M5 plan said "compute idx from fingerprint via parts.indexOf(...)". This worked but added an extra Chrome call. M6: pre-compute idx for each chapter in the plan body. 12.36 = 175, 12.37 = 176, 12.38 = 177, 12.39 = 178, 12.40 = 179, 12.41 = 180. (Verify after M5 close that index 175 is the first new chapter; depends on whether M5 changed TOC or other section content.)

7. **Don't add `architect` to forbidden-words grep without testing first.** The plan's existing grep `architect` matches "architecture" which is a legitimate word in M6 spec ("the full architecture", "decision-framework architecture"). The current pattern `grep -in "architect"` matches both. Suggest using word-boundary grep `grep -in '\barchitect\b'` if checking the literal word, OR drop this check entirely since "architect"-as-a-noun for software-design has not appeared in any M1-M5 chapter naturally.

## Things M2-M4 plans got right that M6 should keep

- Per-chapter strict scope binding with `**Files:**` list + `git diff --stat` gate before commit. Zero scope violations across M5.
- Plan Rule 11 (within-section signposts allowed) verbatim in implementer prompts. Zero false flags on "see chapter 12.X" forward refs.
- Pre-proofread plan test regex against spec content. M5 plan had ZERO regex typos this milestone (improvement over M3/M4 which had 4+ each). The "pre-proofread plan test regex" practice from M4 lessons was followed during M5 plan authoring and paid off.
- Per-chapter Chrome visual gate is mandatory and non-skippable. Caught zero defects in M5 (every chapter rendered clean first try) but the discipline is the point.

## Known debts going into M6

- `encoder-decoder-diagrams.jsx` lines 59, 1242, 1976 still uncovered (pre-existing). M5 did not touch this file. The global coverage stays at 99.92% lines / 98.69% branches.
- `vite.config.js` threshold (100/100) does not match CLAUDE.md (97.7% branches). Coverage gate fails on global but `rag-evaluation.jsx` itself is 100/100. M6 might align these one way or the other.
- `learn-ai-prefetch.test.jsx` still occasionally flaky under full-suite + coverage runs. Re-scoped run passes immediately. Same recurrence as M3 and M4.
- Stale worktree dev server on port 5174 (`.claude/worktrees/section13/`). Not M5's job; logged for M6 awareness.
- M2-era format drift in `learn-ai.jsx`, `road-to-transformers.jsx`, `vector-compression.jsx`, `vector-production.jsx`, etc., still untouched. Acknowledged debt.
