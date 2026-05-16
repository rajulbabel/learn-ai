# M3 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 3 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-3.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m2-lessons.md AND section-13-m1-lessons.md (READ FIRST)

Constraints:
- Use superpowers:subagent-driven-development. Fresh opus subagent per chapter task.
- All agents/subagents opus.
- TDD mandatory per CLAUDE.md: tests first, code second, full suite green before commit.
- Chrome browser visual validation per chapter (MANDATORY, not skippable). Use the sub=20-localStorage-fingerprint trick from M2 - faster than per-sub click-through.
- Helpers live in src/sections/agent-prompting.jsx (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER). New files import from there - do NOT redeclare. Add new SOFT entries when introducing a new accent.
- Each implementer prompt MUST forbid `npm run format` (cascades into reformatting unrelated files). Implementers revert any out-of-scope dirty files via `git restore` before staging.
- Each sub=N test must include at least one matcher unique to that sub-step's content (otherwise earlier sub-step content silently satisfies it).
- M3 covers Acts 5 (Memory, 6 ch in existing agent-loops.jsx) + Act 6 (Multi-Agent, 7 ch in NEW multi-agent.jsx). Total 13 chapters.
- Verify C palette has all required colors as part of Task 1 baseline (Act 5 = amber/SOFT.amber already added in M2; Act 6 = green - verify SOFT.green exists).
- Skip `npm run search:build` for brand-leak diagnostics. The chunks.json brand leak is auto-gen, doesn't propagate to live UI/content.
- TOC entry + chapter entries in one task (do chapter entries first, then TOC entry, then commit together - avoids the M1 ordering bug).
- Two-stage review only on first chapter of each new file (13.30 WhyMultiAgent in multi-agent.jsx). Other chapters in agent-loops.jsx already have the locked pattern.
- First task: Task 0 - set session title to "section13-milestone3".
- After M3 ships, execute the final refinement task (Plan Refinement Checkpoint for M4) before any thought of M4.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
