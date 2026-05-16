# M5 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 5 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-5.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m4-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review for content chapters / combined single-stage for trivial mechanical tasks
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone5"
- After M5 ships, execute the final refinement task before starting M6

Key gotchas baked in from M4 lessons (READ section-12-m4-lessons.md before dispatching subagents):
- If the `Task` tool is unavailable in this runner (e.g., autonomous overnight mode), the controller executes the plan directly with TDD discipline + Chrome visual gate + scope binding. Same quality bar, fewer dispatches. Check via `ToolSearch select:Task` at session start.
- Use `npx vitest run --dir src --exclude='.claude/**'` for scoped tests; `npm run test` and even `--dir src` alone can pick up sibling worktree pollution.
- Pre-commit hook moved to pre-push (commit c6d2fe2). No per-commit bypass needed in M5. Just commit normally; run `npm run search:index && npm run search:embed` manually at Task 15 boundary (pre-push fires on actual push).
- `.prettierignore` already excludes `src/data/`. Use SCOPED `npx prettier --write <specific files>` only — `npm run format` can touch unrelated drifted files.
- Plan Rule 11 (within-section signposts like "covered in chapter 12.X" allowed) MUST be quoted verbatim in BOTH implementer AND code-quality reviewer prompts to prevent false flags.
- Pre-proofread plan test regex against content spec for forward-chapter ref typos before dispatching. M3 and M4 plans both had regex typos for cross-chapter signposts. Audit M5 plan's `toMatch(/12\.\d+/)` patterns first.
- Stray dev servers on adjacent ports (e.g., `.claude/worktrees/section13/` on 5174) can silently steal browser focus during Chrome visual gate. Run `ps aux | grep vite` and navigate the tab back to 5173 if so.
- `learn-ai-prefetch.test.jsx` is known-flaky under coverage and full-suite runs; re-run scoped once before claiming a regression.
- Pre-existing coverage gap in `encoder-decoder-diagrams.jsx` (lines 59, 1242, 1976) is acknowledged debt; consider closing it OR aligning `vite.config.js` thresholds (100/100) to CLAUDE.md's stated 97.7% branches.
- Hard-cap reviewer subagent tool calls: "Max 6 tool calls. Do NOT stash, git checkout, or re-run coverage against base commit." (M3 had a reviewer pollute the working tree.)
- If an implementer subagent hits a 500 mid-task, check working tree for uncommitted edits, run scoped tests + lint + forbidden-word grep yourself, commit if clean. Don't redispatch from scratch.
- Coverage threshold mismatch: vite.config wants 100/100; CLAUDE.md says 97.7% branches OK. New code in M4 hit 100/100 cleanly; global gap is pre-existing debt. Acceptable for M5 milestone close.
- `PromptTemplateBlock` helper now lives near the top of `rag-generation.jsx`. If M5 evaluation chapters render prompt templates, either import that helper into the new file or re-extract into `components.jsx`.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m4-lessons.md` to know what M4 taught.
- Confirmed `git log` shows M4 commits cleanly merged on main (sequence ends with "Rebuild search index for Section 12 M4 (12.22-12.30)" + the lessons / starter / plan-refinement commits).
- Verified `npx vitest run --dir src --exclude='.claude/**'` is green on main (all 2844 tests pass; the `learn-ai-prefetch.test.jsx` flake re-runs cleanly scoped).
