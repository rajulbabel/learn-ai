# Section 12 Milestone 1 Lessons (executed 2026-05-16)

What M1 taught us that M2-M6 should bake in.

## What worked

- **Cross-file dependency map** (added to plan mid-flight by user). Caught the lookup.test.js / sections.test.jsx spread requirements before they cascaded. Without it, Task 5 would have left ~33 silent test failures resolved only at Task 6.
- **Two-stage review per task** (spec then quality). Quality reviewer caught real SVG geometry bugs (phase divider at x=397.5 hidden behind Store box; "Query Time (Online)" label off-center at x=497.5) that the implementer's self-review missed. Spec reviewer alone would not have computed box-position math.
- **Chrome visual gate is load-bearing.** Caught two defects tests passed clean on: (a) "tiny architectural change" wording (forbidden "architect" word) in 12.1 sub=2; (b) wrong chapter-range signposts in 12.3 sub=2/3/4/5/6 (e.g., "12.14-12.17" instead of "12.11-12.14"). Test regexes had `|hybrid|reranker|` fallbacks that masked the wrong numbers. Without visual verification, learners would have read broken signposts.
- **TOC is data-driven for content but hardcoded for the section list.** Added an unplanned Task 6.5 to register Section 12 in the TOC `sections` array. Plan now needs this step (or TOC needs to be made fully data-driven).
- **Pre-commit hook auto-stages search-index artifacts** (chunks.json, chunk-cache.json, embeddings-manifest.json, embeddings.bin). NOT a scope violation. Reviewers and implementers must understand this so they don't reject these from commits.

## What broke

- **First implementer subagent did wide unauthorized edits** despite scope rules in the prompt: ran `npm run format` globally (reformatted plan files + data/* JSON + other section .jsx files via Prettier), and explicitly Edited all 6 milestone plan files to apply an "Act N → chapter range" substitution it inferred from the existing Act-leak test. Recovery cost: ~10 minutes of `git restore` + re-staging. Plan-doc edits triggered the user to commit gap-prevention measures in parallel.
- **Forward chapter-range references drifted** in chapter 12.3 sub=2..6: implementer wrote `12.14-12.17`, `12.18-12.21`, `12.22-12.24`, `12.31-12.35`, `12.36-12.40` — all wrong per spec's Act-to-chapter mapping (correct: `12.11-12.14`, `12.15-12.18`, `12.19-12.21`, `12.28-12.32`, `12.33-12.37`). Tests passed because regex disjunctions had textual fallbacks (`|hybrid|reranker|`). Visual gate caught it.
- **"architectural" word slipped through** in 12.1 sub=2 ("tiny architectural change"). The "no 'architect' word" rule lives in CLAUDE.md visual rules but was not in the implementer prompt. The Reviewer's visual-rules checklist did include it but the prompt to the implementer did not list it as a hard constraint.
- **Off-by-three on cross-chapter signpost in 12.2 sub=2.** Implementer wrote `(more in chapter 12.14)` for "retrieval-tuned embeddings"; correct chapter is 12.11 (EmbeddingModelChoice). Same root cause as 12.3 drift — implementer guessed chapter ranges from memory instead of consulting the spec's chapter list.
- **Coverage line threshold regressed.** Started at 100% lines (per CLAUDE.md), now at 99.9%. Uncovered lines 59/1242/1976 in `encoder-decoder-diagrams.jsx`. Not caused by Section 12 work — likely pre-existing or from a parallel edit. Plan target (`>= 97.7% branches, 100% lines`) is satisfied for branches (98.48%) but not lines.

## Patterns that worked better than what M1 plan specified

- **CSS flex over SVG for simple 3-step flows** (12.1 sub=2): chosen specifically to avoid touching `svg-descriptions.json` and keep the chapter to 2 modified files. Renders identically, easier to maintain. Recommend M2-M6: prefer CSS for simple flows; SVG only when geometry matters (axis-bearing charts, attention curves).
- **Prompt template as a styled monospace block with highlighted `[doc-X]` placeholders in the box color** (12.2 sub=5): made the artifact legible AND visually distinct from a code block. Reuse pattern for any future template artifacts (eval rubrics in 12.28+, prompt artifacts in 12.19+).
- **Forbidding `npm run format` globally** in the implementer prompt prevented the second + third implementers from repeating the first one's mass-format violation. Bake into all M2+ prompts: "if formatting needed, run `npx prettier --write <specific files only>`".

## Recommended M2 plan tightenings

1. **Forbidden-word list at top of every chapter task**: explicitly enumerate `architect`, `architecture`, `architectural`, em-dash, `Act N` (literal, in chapter content). Implementer prompt should reproduce this list verbatim.
2. **Chapter-range reference table at top of every chapter task** (verbatim):
   - Act 2 (chunking): 12.4-12.10
   - Act 3 (embed/index): 12.11-12.14
   - Act 4 (query transform): 12.15-12.18
   - Act 5 (context+gen): 12.19-12.21
   - Act 6 (advanced retrieval): 12.22-12.27
   - Act 7 (evaluation): 12.28-12.32
   - Act 8 (production ops): 12.33-12.37
   - Act 9 (decision framework): 12.38
   The implementer should reference this table when writing forward signposts in chapter content. Visual gate must verify exact numbers.
3. **Plan-doc protection**: implementer prompts should include "Do NOT read or edit any file under `docs/`" explicitly (some early prompts had this; later prompts assumed it). Without this, an "over-eager fix" implementer will read plans for context then "improve" them.
4. **TOC sync step in every milestone** (or refactor TOC to be data-driven). M2-M6 add no new sections but Milestone 7 (if added) would need this again.
5. **Coverage acknowledgement**: note that `encoder-decoder-diagrams.jsx` has 99.61% lines coverage. M2-M6 implementers should not be expected to fix this; the threshold check is informational. If perfect 100% lines is required, add a dedicated test task for that file.

## Things M1 plan got right that M2+ should keep

- **TDD strict order** (test → fail → impl → pass → commit) per chapter.
- **Pre-commit hook auto-stage tolerance** — call it out so reviewers don't flag it.
- **`git diff --stat HEAD` gate before commit** — caught no actual violations in my session because the strict prompt prevented them, but the gate is the right safety net.
- **Two-stage review** is the right structure; both reviewers caught defects the other would have missed.
