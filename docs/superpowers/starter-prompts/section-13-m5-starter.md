# M5 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 5 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-5.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m4-lessons.md AND m3 AND m2 AND m1 (READ FIRST)

Constraints:
- Use superpowers:subagent-driven-development. Fresh opus subagent per chapter task.
- All agents/subagents opus.
- TDD mandatory per CLAUDE.md: tests first, code second, full suite green before commit.
- Chrome browser visual validation per chapter (MANDATORY, not skippable). Use the sub=20-localStorage-fingerprint trick from M2 - faster than per-sub click-through.
- Helpers live in src/sections/agent-prompting.jsx (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER). New files import from there - do NOT redeclare. Add new SOFT entries when introducing a new accent.
- Each implementer prompt MUST forbid `npm run format` (cascades into reformatting unrelated files). Implementers revert any out-of-scope dirty files via `git restore` before staging.
- Each sub=N test must include at least one matcher unique to that sub-step's content (otherwise earlier sub-step content silently satisfies it).
- M5 covers Act 8 Production Hardening (6 chapters, 13.42 - 13.47): Observability, Cost, Latency, Guardrails, Prompt Injection, Tool Security. Likely one new file `agent-production.jsx`. Operations + safety milestone.
- Verify C palette has all required colors as part of Task 1 baseline. Verify SOFT map covers any new accents Act 8 introduces.
- Skip `npm run search:build` for brand-leak diagnostics. The chunks.json brand leak is auto-gen, doesn't propagate to live UI/content.
- TOC entry + chapter entries in one task (do chapter entries first, then commit together - avoids the M1 ordering bug).
- Two-stage review only on first chapter of each new file. Other chapters in same file usually pass single-stage check.
- NO "Act N" or "Acts N" strings in visible JSX content. Only in `//` comments. The `Act references do not leak` test fails fast. Caught in M3 twice - REPHRASE in chapter text.
- Escape `>` as `&gt;` in JSX text content. vitest is lenient about this; eslint is not. Caught in M3 twice. Run `npm run lint` per chapter to catch.
- When mapping multi-element rows inside `display: grid`, use `<Fragment key={...}>` (import from react), NOT `<>...</>` with key props on children. React keys must be on the wrapping Fragment, not its children. Caught in M4 (OFFLINE_VS_ONLINE, JUDGE_RUBRIC, SAFETY_METRICS, PER_STEP_RUBRIC).
- When extending an existing file, prefix new module-level constants with the chapter component name (e.g., `MemoryTaxonomy_T2_SNAPSHOT`) to avoid collisions with existing constants in the same file. Or move single-use constants inside the function. Caught in M3 with `T2_ITERATIONS`.
- Dev server check: in worktree contexts, the running dev server may be in main repo not worktree. Verify with `curl localhost:<port>/learn-ai/src/sections/agent-evals.jsx` - it should return JS, not HTML (404 fallback). If HTML, start a worktree-local dev server on a different port (e.g. 5174). Caught in M4.
- First task: Task 0 - set session title to "section13-milestone5".
- After M5 ships, execute the final refinement task (Plan Refinement Checkpoint for M6) before any thought of M6.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
