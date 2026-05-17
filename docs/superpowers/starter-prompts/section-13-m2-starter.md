# M2 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 2 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-2.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m1-lessons.md (READ FIRST)

Constraints:
- Use the superpowers:subagent-driven-development skill. Fresh opus subagent per chapter task.
- All agents and subagents must be opus.
- TDD mandatory per CLAUDE.md: tests first, then code, full suite green before commit.
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable).
- Helpers live in src/sections/agent-prompting.jsx (SOFT, tintedCard, pill, DIM_BG, DIM_BORDER). New files import from there, do NOT redeclare. Add new soft-color entries to SOFT map when needed.
- Each implementer prompt MUST forbid `npm run format` (it cascades into reformatting unrelated files). Implementers should revert any out-of-scope dirty files via `git restore` before staging.
- Each sub=N test must include at least one matcher unique to that sub-step's content.
- First task: Task 0 - set session title to "section13-milestone2".
- After M2 ships, execute the final refinement task (Task 23 equivalent) before any thought of M3.

Begin with Task 0 (session naming), then Task 1 baseline verify (also confirm C palette has indigo + teal already from M1; if any new colors are needed, add them in Task 2 before implementation tasks start).

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Context for the next executor

M1 shipped 11 chapters (13.1-13.11) covering Act 1 (Prompting Foundations) and Act 2 (Tool Calling). All tests pass (2688 passing). Section 13 files have 100% coverage. The helpers (`SOFT` map, `tintedCard(color)`, `pill(color)`, `DIM_BG`, `DIM_BORDER`) are exported from `src/sections/agent-prompting.jsx` and re-used by `src/sections/agent-tools.jsx`. M2 should continue this import direction.

The M2 plan covers:
- Act 3 (Protocols): MCP architecture, primitives, building a server, security, A2A. Chapters 13.12-13.17.
- Act 4 (Workflows & Agent Loops): workflow primitives, the agent loop, ReAct, plan-execute + reflection, loop termination. Chapters 13.18-13.23.

Total M2: 12 chapters.

Standard running example to preserve:
- Customer-support agent on customer support knowledge base
- Alice / alice@example.com / customer_id c-9924 / Pro tier / signed up 2024-08
- 8 canonical tools: search_kb, lookup_customer, lookup_subscription, reset_password, change_email, process_refund, escalate_human, send_email
- 5 standard tickets: T1 password reset / T2 reset + email changed / T3 dashboard 500 errors / T4 cancel + refund > $200 / T5 Pro vs Enterprise
- Constants: 128k context window (visuals 8k), 5 max iterations (visuals), 1.5s LLM latency, 200ms tool latency, $3/M input + $15/M output cost

Color rotation per act (M2):
- Act 3 Protocols: yellow family (`C.yellow`, `C.orange`, `C.red`).
- Act 4 Workflows & Loops: green family (`C.green`, `C.teal`, `C.lime` if added).

Branch policy: continue on the current Section 13 branch (`worktree-section13` in this dev env, or `main` per the M1 plan's branch line — adjust to the workspace's actual branch).
