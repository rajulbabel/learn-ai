# Section 13 Milestone 6 Lessons

Captured at the end of M6 - the final milestone of Section 13. With M6 shipped, Section 13 (AI Agents) is COMPLETE: all 9 acts, all 52 chapters.

## What worked well

- **Helper hub pattern held through the seventh and final extension of `agent-production.jsx`.** Act 9 reused `SOFT, tintedCard, pill` from `agent-prompting.jsx` with zero new helpers needed. The SOFT map (cyan, blue, purple, indigo, teal, green, yellow, orange, pink, red, amber) was sufficient for every Act 9 chapter color rotation. The pattern locked in M1 scaled across all 6 milestones.

- **The sub=20 + localStorage fingerprint trick** validated all 5 chapters in 5 navigate-and-reload cycles, ~3 minutes total. Same pattern as M2-M5. The validator's `viewBox > 100x100` filter cleanly excludes the app-chrome search icon SVG. Detected: 0 missing-desc SVGs, 0 `C.card` boxes, 0 em-dashes, 0 overlapping rects on the capstone decision-stack visual. No defects to fix mid-flight.

- **TOC entry + chapter entries combined in one task** continued to avoid the M1 ordering bug. Task 3 added all 5 entries plus tests in one commit; tests passed first try.

- **Module-level data constants above each export, prefixed by chapter name**, scaled cleanly across the final 5 chapters:
  - LangGraphFramework: `LANGGRAPH_NODES`, `LANGGRAPH_FIT_ROWS`.
  - CrewAiAutoGen: `CREW_AUTOGEN_STYLE_CARDS`, `CREW_T4_TRACE`, `AUTOGEN_T4_TRACE`, `CREW_AUTOGEN_FIT_ROWS`.
  - VendorSdks: `VENDOR_SDK_CARDS`, `VENDOR_SDK_COMPARISON`, `VENDOR_SDK_FIT_ROWS`.
  - CustomNoFramework: `CUSTOM_REASONS`, `CUSTOM_MISSING_ROWS`, `CUSTOM_DECISION_LEAVES`, `CUSTOM_HYBRID_LAYERS`.
  - AgentDecisionFramework: `DECISION_STACK` (9 layers), `IT_LAYERS_123`, `IT_LAYERS_45`, `IT_LAYERS_67`, `IT_LAYERS_89`, `CLOSING_COMMITMENTS`.

- **Artifact treatment (styled mono-text, not code blocks)** worked again for every framework pattern artifact: LangGraph node/edge/state API (13.48 sub=1), CrewAI Agent+Crew (13.49 sub=1), AutoGen AssistantAgent+GroupChat (13.49 sub=2), Claude Agent SDK loop (13.50 sub=1), OpenAI Agents handoffs (13.50 sub=2), custom 11-line loop (13.51 sub=1). All rendered with `${color}06` tinted bg, `${color}12` soft border, monospace 14px font inside a centered tinted-card wrapper. NEVER as code blocks with language fences. Lock the pattern.

- **The 9-layer decision-stack visual (13.52 sub=0) landed clean.** Every layer back-references the source chapters: 13.5 / 13.18-13.22 / 13.24-13.29 / 13.30-13.34 / 13.7-13.11 / 13.12-13.17 / 13.37-13.41 / 13.42-13.47 / 13.48-13.51. SVG verified centered, 9 rects with 0 overlaps. This visual is the section's signature artifact - it will be the chapter learners return to most.

- **The IT-support capstone use case** was distinctly different from the customer-support running example. Internal users, smaller blast radius, $500 hardware-order threshold, SSO + ticketing integration. The contrast was crisp enough to demonstrate transfer of the decision framework.

- **Unique-to-sub=N matcher discipline** kept tests honest. Every Act 9 chapter test block has at least one matcher unique to that sub-step's title ("Agents As Stateful Graphs", "Two Multi-Agent Styles", "Loop Primitive", "Hand-Off Primitive", "50 Lines Of Loop", "Stay Custom When", "Build Some, Buy Some", "Every Choice Section 13 Taught You", "Design An Agent For A New Use Case", "Pick Approach, Loop, Memory", etc).

- **The capstone closing panel** ("Decide / Diagnose / Defend" + "Section 13 done. The production agent is yours to ship.") feels motivating rather than preachy because it ties back to concrete capabilities the learner can claim, not vague promises.

## What didn't work / had to be fixed mid-flight

- **No `Task` tool available in this autonomous overnight environment.** Confirmed at the start of M6, same as M5. Implemented all 5 chapters directly with the same TDD/scope discipline subagents would enforce. The plan's subagent-driven workflow is the gold standard; direct implementation works as a fallback. No defects from skipping subagents - the pattern is locked.

- **Pre-existing `learn-ai-prefetch` flake** triggered twice during full-suite runs in M6 (once after 13.49, once after 13.50). Always passed cleanly in isolation. Same M1-M5 behavior. Continue to ignore.

- **The pre-existing brand leak in `src/data/chunk-cache.json`** (multiple `docs.habuild.com` mentions) was flagged again by the forbidden-pattern grep. Per M2 lessons + memory feedback: skip search-index regeneration; the leak is in auto-generated chunks, not in `src/sections/` live source.

- **Pre-existing coverage gaps** (`encoder-decoder-diagrams.jsx`, `attention-qkv.jsx`, etc.) keep aggregate lines at 99.93% rather than 100%. `agent-production.jsx` itself is at 100/100/100/100. Pre-existing artifact per M1 lessons; not introduced by M6.

## Test-pattern observations

- **Test counts:** baseline 3317 (M5 end) -> 3405 after M6 (5 chapters: 1 capstone with 7 subs + 4 with 5 subs each = 27 content tests; 11 auto-iteration tests per chapter = 55; +5 config entry tests; +1 lookup presence test). ~88 added tests. Matches the M5 cadence.

- **Every M6 chapter test block** includes a title-string matcher. The capstone (13.52) has 7 such matchers (one per sub-step), proving each closing layer rendered correctly.

## Visual-rule landmines

- **None caught at Chrome validation.** All 5 chapters scored 0 missing-desc, 0 `C.card`, 0 em-dash, 0 overlap on the decision stack. The pattern is locked through Act 9 - 100% clean Chrome runs in M3, M4, M5, M6.

- **No `architect` in titles.** The capstone (13.52) was the highest-risk chapter for slipping the "architect of the decision framework" phrasing. Wrote it as "Lead This Project Now" instead. Clean.

## Section-13-specific outcomes (cumulative M1 + M2 + M3 + M4 + M5 + M6 - FINAL)

- 52 chapters total in Section 13. 6 milestones, **6 of 6 complete - Section 13 SHIPPED**.
- 6 section files: `agent-prompting.jsx` (Act 1, 6 ch), `agent-tools.jsx` (Acts 2+3, 11 ch), `agent-loops.jsx` (Acts 4+5, 12 ch), `multi-agent.jsx` (Act 6, 7 ch), `agent-evals.jsx` (Act 7, 5 ch), `agent-production.jsx` (Acts 8+9, 11 ch).
- 3405 tests passing in M6 final (full suite); 2 skipped; 1 pre-existing flake.
- Coverage on M6 files: 100% statements/branches/functions/lines for Act 9 code paths. Aggregate at 99.93% lines, 98.76% branches (pre-existing M1+ gaps).
- 0 em-dashes, 0 `C.card`, 0 forward-chapter hints, 0 carry-over fictional brand names in `src/sections/`.
- 0 "architect" words in any Section 13 section file.
- All new SVGs have `<desc>` first-child + entries in `svg-descriptions.json`.
- CLAUDE.md mapping table + project structure tree updated for Act 9 (final).
- ~9 commits on `worktree-section13` for M6 work (stubs + config + lookups + 5 chapters + CLAUDE.md + lessons).

## Section ship verdict

Section 13 is complete and shippable. Every quality gate passed:

- All 3405 tests pass (one pre-existing flake aside).
- Lint clean (0 errors, 6 pre-existing warnings).
- Build succeeds.
- 100% coverage on every Section 13 file.
- 0 visual-rule violations across 52 chapters.
- 0 brand leaks in src/sections/.
- 0 forward references; 0 em-dashes; 0 "architect" in content.

The learner who completes Section 13 now has nine concrete decisions they can make for any new agent project, with the chapter-by-chapter rationale to defend each choice.
