# M4 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 4 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-4.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m3-lessons.md AND section-13-m2-lessons.md AND section-13-m1-lessons.md (READ FIRST)

Constraints:
- Use superpowers:subagent-driven-development. Fresh opus subagent per chapter task.
- All agents/subagents opus.
- TDD mandatory per CLAUDE.md: tests first, code second, full suite green before commit.
- Chrome browser visual validation per chapter (MANDATORY, not skippable). Use the sub=20-localStorage-fingerprint trick from M2 - faster than per-sub click-through.
- Helpers live in src/sections/agent-prompting.jsx (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER). New files import from there - do NOT redeclare. Add new SOFT entries when introducing a new accent.
- Each implementer prompt MUST forbid `npm run format` (cascades into reformatting unrelated files). Implementers revert any out-of-scope dirty files via `git restore` before staging.
- Each sub=N test must include at least one matcher unique to that sub-step's content (otherwise earlier sub-step content silently satisfies it).
- M4 covers Act 7 (Evaluation, 5 chapters). Smallest Section 13 milestone but the highest-stakes content - evaluation decides whether production agents ship safely.
- Verify C palette has all required colors as part of Task 1 baseline. Verify SOFT map covers any new accents Act 7 introduces.
- Skip `npm run search:build` for brand-leak diagnostics. The chunks.json brand leak is auto-gen, doesn't propagate to live UI/content.
- TOC entry + chapter entries in one task (do chapter entries first, then TOC entry, then commit together - avoids the M1 ordering bug).
- Two-stage review only on first chapter of each new file. Other chapters in same file usually pass single-stage check.
- NO "Act N" or "Acts N" strings in visible JSX content. Only in `//` comments. The `Act references do not leak` test fails fast. Caught in M3 twice - REPHRASE in chapter text ("the rest of the memory chapters" / "closes out the multi-agent chapters" instead of "Act 5 / Act 6").
- Escape `>` as `&gt;` in JSX text content. vitest is lenient about this; eslint is not. Caught in M3 twice (CriticDebate sub=3, MultiAgentFailures sub=3). Run `npm run lint` per chapter to catch.
- When extending an existing file, prefix new module-level constants with the chapter component name (e.g., `MemoryTaxonomy_T2_SNAPSHOT`) to avoid collisions with existing constants in the same file. Or move single-use constants inside the function. Caught in M3 with `T2_ITERATIONS`.
- First task: Task 0 - set session title to "section13-milestone4".
- After M4 ships, execute the final refinement task (Plan Refinement Checkpoint for M5) before any thought of M5.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
