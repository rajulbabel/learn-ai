# M3 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 3 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-3.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m2-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone3"
- After M3 ships, execute the final refinement task before starting M4

Key gotchas baked in from M2 lessons (READ section-12-m2-lessons.md before dispatching subagents):
- Use `npx vitest run --dir src` for scoped tests; `npm run test` picks up sibling worktree pollution.
- Add `.prettierignore` for `src/data/` before any global format step, OR use scoped `npx prettier --write <files>` only.
- Within-section signposts ("covered in chapter 12.X", "Chapters 12.X-12.Y fix this") ARE allowed per plan rule 11. Quote rule 11 verbatim in implementer AND reviewer prompts so reviewers stop flagging spec-mandated signposts.
- User-quoted questions in monospace keep sentence case after first word ("How do I X?" not "How Do I X?").
- `learn-ai-prefetch.test.jsx` is known-flaky; re-run once before claiming a regression.
- Pre-existing line-coverage gap in `encoder-decoder-diagrams.jsx` (lines 59, 1242, 1976) is acknowledged debt; do not block on it.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m2-lessons.md` to know what M2 taught
- Confirmed `git log` shows M2 commits cleanly merged on main (the M2 marker is commit `6093054` "Rebuild search index for Section 12 M2")
- Verified `npx vitest run --dir src` is green on main (2553 passed / 0 skipped, plus pre-existing line gap noted above)
