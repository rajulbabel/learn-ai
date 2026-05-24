# M1 Starter Prompt - Copy-Paste Into New Claude Code Session

This is the bootstrap milestone for Section 13 (AI Agents). M1 has no prior milestone lessons file; it is the start of the section. Open a new Claude Code session in `/Users/rajul/learn-ai`, then paste the prompt inside the code fence below.

```
Execute Section 13 Milestone 1 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-1.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: NONE (M1 is the first milestone of Section 13).

Constraints:
- Use the superpowers:subagent-driven-development skill. Fresh opus subagent per task. Two-stage review (spec compliance, then code quality) after each implementation task.
- All agents and subagents must be opus.
- TDD mandatory per CLAUDE.md: tests first, then code, full test suite green before commit.
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable). See Task 21.
- First task: Task 0 - set session title to "section13-milestone1".
- After M1 ships, execute Task 23 (Plan Refinement Checkpoint for M2) before any thought of M2: capture lessons in `docs/superpowers/lessons/section-13-m1-lessons.md`, optionally refine the M2 plan inline, generate the M2 starter prompt at `docs/superpowers/starter-prompts/section-13-m2-starter.md`, commit.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above into the new Claude Code session.)

## Notes for the executor

Before pasting the starter prompt:
- Open a new Claude Code session.
- `cd /Users/rajul/learn-ai` so the working directory is the repo root.
- Verify `git status` is clean.
- Verify `git log --oneline -3` shows recent Section 13 spec / plans commits at the top.
