# Section 12 Milestone 3 Lessons (executed 2026-05-16 to 2026-05-17)

What M3 taught us that M4-M6 should bake in.

## What worked

- **Pre-commit bypass commit pattern transitioned mid-milestone.** User moved hook from pre-commit to pre-push (commit `c6d2fe2`) during M3 — the original M2-style bypass (commit `cfb7035`) was rendered moot mid-flight. Workflow still worked because pre-push fires only at push time, and chapter commits don't push during a milestone. The pre-push design is strictly better for milestone work: zero per-commit overhead, single rebuild trigger at the right moment.

- **Plan rule 11 baked verbatim into BOTH implementer and reviewer prompts.** Zero false-positive reviewer flags for within-section signposts ("covered in chapter 12.X", "Section 11.24 recap") this milestone. M2 lessons #3 fix landed clean.

- **`npx vitest run --dir src --exclude='.claude/**'`** was the right scoped command. `.claude/worktrees/section13/` worktree pollution was real and consistent — without the `--exclude` flag, prefetch flake rate rose dramatically.

- **Module-level data constants pattern fully internalized.** Every chapter from 12.14 onward used named module-level `const` arrays (e.g., `MODEL_AXES`, `LATENCY_SEGMENTS`, `TRANSFORM_STRATEGIES`). Made spec changes one-edit and review faster.

- **Two-stage review for first content chapter (12.14 EmbeddingModelChoice); combined single-stage review for trivial config tasks.** This adaptation balanced rigor against cycle time. Pure mechanical tasks (Task 3 single-line loader change, Task 5 single import + spread) used combined review; first content chapter and any review-cycle-risk chapter used full two-stage.

- **Chrome visual validation MANDATORY gate caught 2 real defects** that static checks and bbox math missed:
  - 12.15 triplet-loss arrow line passing through "Pull Close" text label (line-vs-text segment intersection).
  - 12.17 stacked-bar narrow segments (Vector ~3%, Reranker ~9%) — inside-bar numeric labels AND below-bar segment names overlapped because adjacent narrow segment centers were too close. Fix: drop inside numeric for narrow segments + replace below-bar inline names with a legend row + color swatches.

  Both fixable in one commit; both invisible to static analysis. Visual validation is load-bearing, not optional.

- **`MiniMeter`-style helper component pattern transferred to 12.14 sub=5 decision flowchart.** The decision-tree SVG used `DECISION_STEPS` data constant + a single `<g>` placement loop, kept under 50 lines. Reuse pattern in any future N-step flowchart.

## What broke or wasted time

- **Test regex typos in plan still recurring.** M2 lessons flagged plan-data drift. M3 plan had 4 known regex typos:
  - 12.14 sub=3: `/12\.12/` (should be `/12\.15/`)
  - 12.18 sub=1: `/12\.16/` + `/12\.17/` (should be `/12\.19/` + `/12\.20/`)
  - 12.18 sub=2: `/12\.17|12\.18/` (should be `/12\.20|12\.21/`)
  - 12.18 sub=3: `/12\.18/` (should be `/12\.21/`)
  - 12.19 sub=5: `/12\.33|cache|caching/i` (the `12.33` is wrong; should be `/12\.36|cache|caching/i`)
  - 12.20 sub=3: `/12\.13/` (should be `/12\.16/`)

  These were caught by baking "PLAN TYPO WARNING" sections directly into the implementer prompts ahead of dispatch. Saved one full review-fix cycle each. M4-M6 plans should be proofread for these before execution.

- **One implementer subagent hit a 500 API error mid-task** (Task 11 HyDE). The subagent had completed all edits but failed before commit. Recovery: I ran tests + lint + forbidden-word grep manually on the uncommitted working tree, confirmed clean, committed myself. Lost ~5 min. Future: rate of mid-task 500s appears non-zero; controllers should be prepared to commit-from-uncommitted-tree as a recovery path.

- **Code-quality reviewer agent ran 3+ minutes on a non-spec-blocking deep coverage check** (Task 6 quality review). The reviewer had passed all primary checks and then started comparing coverage against the base commit, including stash + git checkout + recoverage runs that touched the working tree. Killed via `TaskStop`. After kill, the working tree was left polluted with the reviewer's `git checkout 8cfc4ec -- src` — required `git restore --staged` + `git restore` to clean up.

  Future: reviewer prompts should hard-cap tool calls (e.g., "Max 6 tool calls. Stay tight.") and explicitly forbid `git stash` / `git checkout`. Worked perfectly on Tasks 7-9 after I tightened the prompt.

- **Initial Task 4 dispatch got rejected by user.** The subagent had begun making config.js + config.test.js edits before rejection landed; edits stayed in working tree, got picked up by my next commit (the pre-commit bypass), creating a commingled 2813bdc commit. Split via `git reset --soft HEAD~1` + selective re-staging into two clean commits (`cfb7035` bypass + `4290955` Task 4 work). Recoverable but messy. Future: if rejecting a subagent dispatch, also `git restore` any in-flight working tree changes before retrying.

- **Coverage threshold mismatch between `vite.config.js` and `CLAUDE.md`.** vite.config thresholds = 100/100; CLAUDE.md target = 97.7% branches. Coverage check reports "ERROR threshold" but project policy is the M2 lessons / CLAUDE.md target. M3 closing state: rag-retrieval.jsx is 100/100; global is 99.91% lines / 98.62% branches due to pre-existing gap in `encoder-decoder-diagrams.jsx:59,1242,1976`. M2 lessons already flagged this debt. Recommendation: either close the encoder-decoder-diagrams gap (small) or update vite.config thresholds to match CLAUDE.md's stated 97.7%.

## Patterns that worked better than spec said

- **Inside-bar numeric labels only when segment width >= ~60px.** For narrow stacked-bar segments, replace inside-bar numbers with a horizontal legend row showing color swatch + name + value. Story-telling (proportion) and precise reading (legend) cleanly separated. Reuse pattern for any future stacked-bar in M4-M6 (10.36 caching cost-cut visualization is a natural fit).

- **Prompt-template artifact as styled `<div>` (NOT `<pre>` or `<code>`)** with `background: ${C.X}06`, `border: 1px solid ${C.X}12`, `fontFamily: monospace`, `{placeholder}` highlighted via `<span color={C.X}>`. M2 lesson #2 codified this; 12.19 HyDE reused cleanly. Reuse in 12.24 citations, 12.32 LLM-as-judge, 12.34 golden datasets, 12.40 framework comparison.

- **Pre-corrected test regex in implementer prompts.** Rather than letting the implementer follow plan text verbatim then fix-cycle through reviewer, I corrected the test regex inline in each task prompt where the plan had typos (Tasks 6, 10, 11, 12). Saved one fix-cycle per affected task.

## Recommended M4 plan tightenings

1. **Proofread plan regex against content spec before execution.** Especially forward-chapter refs. Quick eye-scan of every `toMatch(/12\.\d+/)` regex against the chapter content to confirm the number is right.

2. **Hard-cap reviewer tool calls.** Add to reviewer prompts: "Max 6 tool calls. Stay tight. Do not run coverage rerun against base commit. Do not stash or git checkout."

3. **Static-Chrome split**: the static checks (em-dash, Box C.card, forbidden words, chapter-ref resolution) are fast and catch the spec-compliance class. Chrome validation catches geometry overlaps that bbox math can miss (text-vs-line, narrow-segment label overlap, edge crossings). Both are needed. Plan Task 15 should explicitly call them out as two separate steps.

4. **Pre-push hook design assumes single rebuild at end.** M3 worked because we ran `npm run search:build` manually after content was done, before any push. M4-M6 should explicitly call this out in Task 15: "Run `npm run search:build` to regenerate index. Commit artifacts. Then push (which auto-fires the hook for a no-op confirmation)."

5. **Subagent recovery pattern**: if an implementer subagent fails mid-task (500 error or any non-commit exit), controller should:
   - Read git status to see uncommitted edits.
   - Run scoped tests + lint + forbidden-word grep on the working tree.
   - If clean, controller commits manually with the planned message.
   - If not clean, dispatch a fresh implementer with explicit "the previous run left work in the tree; verify and commit".

6. **Coverage gap policy**: either Task N in M4 closes the `encoder-decoder-diagrams.jsx` lines 59/1242/1976 gap (small, ~30 min), OR update `vite.config.js` thresholds to align with CLAUDE.md's stated 97.7% branches policy. Don't let this drift any further.

7. **Tighten implementer prompts on title-case rule for SVG bottom-caption labels.** Captions like "Bar Width Proportional To Milliseconds" feel over-stiff in title-case but the rule says capitalize every word. Confirm and consistent application: every word capitalized (current rule) — OR carve out a sentence-case exception for in-diagram caption-style labels. Decide in M4.

## Things M2/M3 plans got right that M4+ should keep

- Per-chapter strict scope binding with `**Files:**` list + `git diff --stat` gate before commit. Zero scope violations across M3.
- Module-level data constants pattern documented in chapter task templates.
- Spec-and-quality two-stage review for first content chapter; combined single-stage for trivial mechanical tasks.
- Forbidden-word list quoted in implementer prompt verbatim.
- Cross-file dependency map (lookup.test.js + sections.test.jsx spread requirements).
- Chapter-range reference table.
- Plan Rule 11 (within-section signposts allowed) verbatim in BOTH implementer and reviewer prompts.
- Scoped vitest + scoped prettier + .prettierignore for `src/data/`.

## Known debts going into M4

- `encoder-decoder-diagrams.jsx` lines 59, 1242, 1976 still uncovered (pre-existing, untouched M3).
- `vite.config.js` threshold (100/100) doesn't match CLAUDE.md (97.7% branches) — coverage check fails on global but new code is clean.
- `learn-ai-prefetch.test.jsx` still occasionally flaky under `--coverage` (timing-sensitive in jsdom).
- M2-era format drift in 114 files (`learn-ai.jsx`, `road-to-transformers.jsx`, `vector-compression.jsx`, `vector-production.jsx`, etc.) untouched. Not M3's job, but a future cleanup task could run `npx prettier --write src/` to settle them.
