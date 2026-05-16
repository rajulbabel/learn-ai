# M6 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 6 of the learn-ai project (RAG section build, FINAL milestone).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-6.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m5-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review for content chapters / combined single-stage for trivial mechanical tasks
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone6"
- After M6 ships, execute the Section 12 retrospective task to close out the section

Key gotchas baked in from M5 lessons (READ section-12-m5-lessons.md before dispatching subagents):
- If the `Task` tool is unavailable in this runner (e.g., autonomous overnight mode), the controller executes the plan directly with TDD discipline + Chrome visual gate + scope binding. Same quality bar, fewer dispatches. Check via `ToolSearch select:Task` at session start.
- Use `npx vitest run --dir src --exclude='.claude/**'` for scoped tests; `npm run test` and even `--dir src` alone can pick up sibling worktree pollution.
- Rebuild search index IMMEDIATELY after Task 5 (the sections.test.jsx register step), not at milestone end. Run `npm run search:index && npm run search:embed`. This silences the noisy pre-commit warnings in subsequent coverage runs and avoids two known-failing tests (`search coverage` + `search-golden`) cascading through every commit cycle.
- `.prettierignore` already excludes `src/data/`. Use SCOPED `npx prettier --write <specific files>` only.
- Plan Rule 11 (within-section signposts like "covered in chapter 12.X" allowed) MUST be quoted verbatim in BOTH implementer AND code-quality reviewer prompts to prevent false flags.
- Pre-proofread plan test regex against content spec for forward-chapter ref typos before dispatching. M3 and M4 plans had typos; M5 plan did not. M6 plan also looks clean but audit before execution as a precaution.
- Stray dev servers on adjacent ports (e.g., `.claude/worktrees/section13/` on 5174) can silently steal browser focus during Chrome visual gate. Run `ps aux | grep vite` and navigate the tab back to 5173 if needed. Confirm `tabId` is for the 5173 tab before every browser interaction.
- `learn-ai-prefetch.test.jsx` is known-flaky under coverage and full-suite runs; re-run scoped before claiming a regression. The full-suite + coverage run will fail this test ~50% of the time; scoped re-run always passes. Pre-existing debt across M3-M5.
- Pre-existing coverage gap in `encoder-decoder-diagrams.jsx` (lines 59, 1242, 1976) is acknowledged debt. Global coverage stays at ~99.92% lines / ~98.69% branches. New M5 file (rag-evaluation.jsx) hit 100/100 cleanly.
- Coverage threshold mismatch: vite.config wants 100/100; CLAUDE.md says 97.7% branches OK. Final M6 milestone might align these or leave as-is.
- If an implementer subagent hits a 500 mid-task, check working tree for uncommitted edits, run scoped tests + lint + forbidden-word grep yourself, commit if clean. Don't redispatch from scratch.
- For 100/100 branch coverage on any ternary against a data-array bool field, add a `*_COUNTER` data array with the opposite bool and render BOTH the original and the counter-example in the same sub-step. M5 used this for Context Recall (12.33 sub=4). Pedagogically stronger AND covers both branches.
- `PromptTemplateBlock` helper lives near top of `rag-generation.jsx`. If M6 chapters use prompt templates, either import from there or extract a copy into `rag-production.jsx`. Spec for 12.36 Caching may need it for cache-key formula display.
- M6 will likely use multiple standalone-formula chapters. Define a tiny `FormulaBox = ({color, children}) => <div .../>` helper near the top of `rag-production.jsx` and reuse it. Same trick rag-evaluation.jsx used for RAGAS Metrics (12.33 sub=1 through sub=4).
- For the stub-only section file, do NOT import `Reveal` upfront. Add it on the first chapter implementation. M5 had to remove an unused `Reveal` import after eslint flagged it; M6 should skip it from the start.
- Hard-cap reviewer subagent tool calls: "Max 6 tool calls. Do NOT stash, git checkout, or re-run coverage against base commit."
- The forbidden-word grep `grep -in "architect"` matches "architecture" which is a legitimate word in M6 spec. Either use `grep -in '\barchitect\b'` (word-boundary) or skip the check.
- Chapter indices for visual gate: after M5 closes, the chapter index for 12.31 is 170. 12.36 will be at index 175 (170 + 5). Pre-compute and hard-code in the plan's Chrome snippets rather than recomputing each time.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m5-lessons.md` to know what M5 taught.
- Confirmed `git log` shows M5 commits cleanly merged on main (sequence ends with "Rebuild search index for Section 12 M5 (12.31-12.35)" + the lessons / starter / plan-refinement commits).
- Verified `npx vitest run --dir src --exclude='.claude/**'` is green on main (all ~2938 tests pass; the `learn-ai-prefetch.test.jsx` flake re-runs cleanly scoped).
