# M6 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 6 of the learn-ai project (AI Agents section build).

THIS IS THE FINAL MILESTONE OF SECTION 13. M6 ships the section closer (Act 9 Frameworks + Decision: LangGraph, CrewAI/AutoGen, vendor SDKs, custom/no-framework, decision framework). After M6, Section 13 is COMPLETE; allocate time for the SECTION SHIP CHECKLIST (CLAUDE.md final update, discoverability re-index reminders, Google + Bing re-indexing reminder) instead of starting a new milestone.

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-6.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m5-lessons.md AND m4 AND m3 AND m2 AND m1 (READ FIRST)

Constraints:
- Use superpowers:subagent-driven-development. Fresh opus subagent per chapter task.
- All agents/subagents opus.
- TDD mandatory per CLAUDE.md: tests first, code second, full suite green before commit.
- Chrome browser visual validation per chapter (MANDATORY, not skippable). Use the sub=20-localStorage-fingerprint trick from M2-M5 - faster than per-sub click-through.
- Chrome validation IS the em-dash gate. Three em-dashes slipped past lint + tests in M5 and were only caught by Chrome's textContent scan. NEVER skip the Chrome validation. Caught in M5 (13.46 indirect-injection scenario).
- Helpers live in src/sections/agent-prompting.jsx (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER). M6 extends agent-production.jsx (created in M5), which imports from there. Do NOT redeclare.
- Each implementer prompt MUST forbid `npm run format` (cascades into reformatting unrelated files). Implementers revert any out-of-scope dirty files via `git restore` before staging.
- Each sub=N test must include at least one matcher unique to that sub-step's content (otherwise earlier sub-step content silently satisfies it).
- M6 covers Act 9 Frameworks + Decision (5 chapters, 13.48 - 13.52). Per spec: LangGraph, CrewAI/AutoGen, Vendor SDKs (Claude Agent SDK + OpenAI Agents), Custom / No-Framework, Decision Framework (capstone). Extends existing agent-production.jsx (M5 introduced it).
- Verify C palette has all required colors as part of Task 1 baseline. Verify SOFT map covers any new accents Act 9 introduces.
- Skip `npm run search:build` for brand-leak diagnostics. The chunks.json brand leak is auto-gen, doesn't propagate to live UI/content.
- TOC entry + chapter entries in one task (do chapter entries first, then commit together - avoids the M1 ordering bug).
- No new section file in M6 - single-stage check per chapter. agent-production.jsx pattern is already locked.
- NO "Act N" or "Acts N" strings in visible JSX content. Only in `//` comments. The `Act references do not leak` test fails fast. Caught in M3 twice - REPHRASE in chapter text.
- Escape `>` as `&gt;` in JSX text content. vitest is lenient about this; eslint is not. Caught in M3 twice. Run `npm run lint` per chapter to catch.
- When mapping multi-element rows inside `display: grid`, use `<Fragment key={...}>` (import from react), NOT `<>...</>` with key props on children. React keys must be on the wrapping Fragment, not its children. Caught in M4.
- When extending agent-production.jsx (which already holds Act 8), prefix new module-level constants with the chapter component name (e.g., `LangGraph_FEATURES`, `CrewAI_AGENTS`) to avoid collisions with existing OBS_/COST_/INJ_/TOOL_SEC_ constants. Or move single-use constants inside the function. Caught in M3 with `T2_ITERATIONS`.
- Dev server check: in worktree contexts, the running dev server may be in main repo not worktree. Verify with `curl localhost:<port>/learn-ai/src/sections/agent-production.jsx` - it should return JS, not HTML (404 fallback). If HTML, start a worktree-local dev server on a different port (e.g. 5174). Caught in M4.
- First task: Task 0 - set session title to "section13-milestone6".
- M6 IS the section closer. After implementing all 5 chapters, execute the SECTION SHIP CHECKLIST (likely Task 13 in the M6 plan): capture m6 + overall Section 13 lessons, finalize CLAUDE.md mapping (mark Section 13 complete: 6/6 milestones, 52 chapters), verify discoverability sync (llms.txt + JSON-LD teaches array + sitemap if applicable), remind user to request Google Search Console + Bing Webmaster re-indexing.

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
