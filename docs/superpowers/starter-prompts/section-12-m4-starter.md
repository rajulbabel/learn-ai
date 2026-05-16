# M4 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 4 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-4.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m3-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review for content chapters / combined single-stage for trivial mechanical tasks
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone4"
- After M4 ships, execute the final refinement task before starting M5

Key gotchas baked in from M3 lessons (READ section-12-m3-lessons.md before dispatching subagents):
- Use `npx vitest run --dir src --exclude='.claude/**'` for scoped tests; `npm run test` and even `--dir src` alone can pick up sibling worktree pollution.
- Pre-commit hook moved to pre-push (commit c6d2fe2). No per-commit bypass needed in M4. Just commit normally; `npm run search:build` runs once at Task 15 (or auto-fires via pre-push when you push).
- `.prettierignore` already excludes `src/data/`. Use SCOPED `npx prettier --write <specific files>` only — `npm run format` can touch unrelated drifted files.
- Plan Rule 11 (within-section signposts like "covered in chapter 12.X" allowed) MUST be quoted verbatim in BOTH implementer AND code-quality reviewer prompts to prevent false flags.
- User-quoted questions in monospace keep sentence case after first word ("How do I X?" not "How Do I X?").
- `learn-ai-prefetch.test.jsx` is known-flaky under --coverage and worktree pollution; re-run scoped once before claiming a regression.
- Pre-existing coverage gap in `encoder-decoder-diagrams.jsx` (lines 59, 1242, 1976) is acknowledged debt; consider closing it as a precursor task OR aligning `vite.config.js` thresholds (100/100) to CLAUDE.md's stated 97.7% branches.
- Pre-proofread plan test regex against content spec for forward-chapter ref typos before dispatching. M3 plan had typos in 12.14/12.18/12.19/12.20 tests; bake corrections inline in implementer prompts.
- Hard-cap reviewer subagent tool calls: "Max 6 tool calls. Do NOT stash, git checkout, or re-run coverage against base commit." (One reviewer in M3 went rogue at 32+ calls and polluted the working tree.)
- If implementer subagent hits a 500 mid-task, check working tree for uncommitted edits, run scoped tests + lint + forbidden-word grep yourself, commit if clean. Don't redispatch from scratch.
- Coverage threshold mismatch: vite.config wants 100/100; CLAUDE.md says 97.7% branches OK. New code in M3 hit 100/100 cleanly; global gap is pre-existing debt. Acceptable for M4 milestone close.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m3-lessons.md` to know what M3 taught.
- Confirmed `git log` shows M3 commits cleanly merged on main (sequence ends at `ec7b04f` fix + `1055081` search index rebuild).
- Verified `npx vitest run --dir src --exclude='.claude/**'` is 2688/2688 green on main.
