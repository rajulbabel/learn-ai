# M1 Starter Prompt - Copy-Paste Into New Claude Code Session

This is the bootstrap milestone for Section 13 (AI Agents). M1 has no prior milestone lessons file; it is the start of the section. Open a NEW Claude Code session, `cd` into the Section 13 worktree, then paste the prompt inside the code fence below.

**Working directory for the new session:** `/Users/rajul/learn-ai-section-13`

This is a git worktree on the `section-13-build` branch, separate from the main repo at `/Users/rajul/learn-ai` (which continues Section 12 work). Both worktrees share `.git/` so refs are visible across them, but each has its own working tree.

```
Execute Section 13 Milestone 1 of the learn-ai project (AI Agents section build).

Working directory: /Users/rajul/learn-ai-section-13 (git worktree on section-13-build branch)
Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-1.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: NONE (M1 is the first milestone of Section 13).

Constraints:
- Work on the section-13-build branch in the worktree at /Users/rajul/learn-ai-section-13.
- DO NOT touch /Users/rajul/learn-ai (that worktree is on main; another agent is building Section 12 there).
- Verify branch before any commit: `git branch --show-current` must report `section-13-build`. Abort if it reports `main`.
- Use the superpowers:subagent-driven-development skill. Fresh opus subagent per task. Two-stage review (spec compliance, then code quality) after each implementation task.
- All agents and subagents must be opus.
- TDD mandatory per CLAUDE.md: tests first, then code, full test suite green before commit.
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable). See Task 21.
- First task: Task 0 - set session title to "section13-milestone1".
- After M1 ships, execute Task 23 (Plan Refinement Checkpoint for M2) before any thought of M2: capture lessons in `docs/superpowers/lessons/section-13-m1-lessons.md`, optionally refine the M2 plan inline, generate the M2 starter prompt at `docs/superpowers/starter-prompts/section-13-m2-starter.md`, commit.

Merge policy:
- M1 commits stay on section-13-build until M1 is fully complete (all 24 tasks done, tests green, Chrome-validated).
- After M1 ships and Task 23 is done, the user merges section-13-build into main (or rebases). Coordinate the merge with the Section 12 agent on main to avoid simultaneous changes to shared files (config.js, learn-ai.jsx, sections.test.jsx, lookup.test.js, CLAUDE.md, svg-descriptions.json).
- Auto-generated files (`src/data/chunks.json`, `src/data/chunk-cache.json`) regenerate via `npm run search:extract` post-merge; never resolve them by hand.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above into the new Claude Code session.)

## Notes for the executor

Before pasting the starter prompt:
- Open a new Claude Code session (not this one).
- `cd /Users/rajul/learn-ai-section-13` so the working directory is the Section 13 worktree.
- Confirm `git branch --show-current` reports `section-13-build`.
- Verify `git status` is clean.
- Verify `git log --oneline -3` shows the commits "Add Section 13 (AI Agents) spec and 6 milestone plans" (commit 57b579c) and earlier Section 12 commits inherited from main at branch time.

## Coordination with the Section 12 agent on main

The Section 12 build continues on `/Users/rajul/learn-ai` (main branch). Section 13 work happens on `/Users/rajul/learn-ai-section-13` (section-13-build branch).

Files both sections will touch (low conflict risk but real):

- `src/config.js` - Section 12 inserts 12.9-12.41 into `chapters[]`; Section 13 appends 13.1-13.52 at the end of the array. Different positions, mergeable.
- `src/learn-ai.jsx` - Section 12 may add to its existing 2-file Promise.all loader; Section 13 adds a new `13:` key. Different lines.
- `src/sections/toc.jsx` - Section 12 already registered; Section 13 adds new entry.
- `src/__tests__/config.test.js`, `lookup.test.js`, `sections.test.jsx` - both append (different chapters, different namespaces).
- `src/data/svg-descriptions.json` - both add entries. Watch JSON trailing-comma at merge.
- `CLAUDE.md` - Section 12 appends to its mapping table; Section 13 adds a new mapping table + project structure tree entry.

Files NOT touched by Section 13 (Section 12 owns them now):
- `public/llms.txt` (Section 12 already added itself)
- `index.html` JSON-LD `teaches` (Section 12 already added itself)

When the Section 13 agent updates these files in M1, it adds Section 13's own entries; Section 12 doesn't touch them.

## What Comes Next

Once M1 is complete:
1. Section 13 agent generates the M2 starter prompt at `docs/superpowers/starter-prompts/section-13-m2-starter.md` (Task 23 Step 7).
2. The user (or the agent's next session) merges `section-13-build` into `main` per the milestone-by-milestone merge cadence agreed during planning.
3. After merge, open another fresh Claude Code session, `cd /Users/rajul/learn-ai-section-13`, rebase from main (`git fetch && git rebase main`), and paste the M2 starter prompt.
