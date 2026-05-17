# Section 13 Milestone 5 Lessons

Captured at the end of M5 to inform M6. Read this before executing M6.

## What worked well

- **Helper hub pattern continued cleanly through the sixth file.** `agent-production.jsx` was created without needing any new helpers. `SOFT`, `tintedCard`, `pill` were imported from `agent-prompting.jsx` and re-used in every Act 8 chapter. No SOFT additions needed; the existing pink / red / orange / yellow / purple / green palette covered Act 8's rotation. M6 (Act 9 Frameworks + Decision) should keep the same hub.

- **The sub=20 + localStorage fingerprint trick** validated all 6 chapters in 6 navigate-and-reload cycles, ~4 minutes total. Same pattern as M2-M4. The validator's `viewBox > 100x100` filter cleanly excludes the app-chrome search icon SVG. Detected: 0 missing-desc SVGs, 0 `C.card` boxes, 0 overlapping rects across all 6 chapters. Three em-dashes (sub=2 of 13.46 indirect-injection scenario) were caught and fixed mid-flight.

- **TOC entry + chapter entries combined in one task** (Task 4) avoided the M1 ordering bug. Tests passed first try on Tasks 4 and 5.

- **Module-level data constants above each export** scaled cleanly:
  - ObservabilityTracing: `OBS_SPAN_TREE`, `OBS_VENDORS`, `OBS_METADATA`, `OBS_ALERTS`.
  - CostControl: `COST_BREAKDOWN`, `COST_ROUTING_TIERS`, `COST_RETRY_RULES`.
  - LatencyOptimization: `LATENCY_T2_WATERFALL`, `LATENCY_CACHE_TARGETS`.
  - Guardrails: `GUARD_CONTENT_CATEGORIES`.
  - PromptInjectionDefenses: `INJ_ATTACK_TYPES`, `INJ_HIERARCHY`, `INJ_SIGNALS`.
  - ToolSecurity: `TOOL_SEC_CAPABILITIES`, `TOOL_SEC_RATE_LIMITS`.

- **Artifact treatment (styled mono-text, not code blocks)** worked again for the OTel span shape (13.42 sub=1), the direct injection attempt (13.46 sub=1), the indirect-injection scenario (13.46 sub=2), the audit log entry (13.47 sub=2), and the consent prompt mockup (13.47 sub=4). All rendered with `${color}06` tinted bg, `${color}12` soft border, monospace 14px font inside a centered tinted-card wrapper with `whiteSpace: "pre"` / `"pre-wrap"`. M6 Act 9 framework comparisons / decision flowcharts will probably not need this pattern (more diagrams, less raw artifact), but keep it ready.

- **Unique-to-sub=N matcher discipline** kept tests honest. Every Act 8 chapter test block has at least one matcher unique to that sub-step's title or distinct artifact label ("An Agent Run Is A Tree Of Spans", "Where The Dollars Go", "Where The Seconds Go", "Filters Sit On Both Sides Of The Model", "Direct, Indirect, Jailbreak", "Tools Run In A Cage", "Direct Injection Attempt", "Audit Log Entry (Shape)"). Keep this in M6.

- **Cross-section back-references landed cleanly.** Act 8 chapters reference 12.36 (prompt caching), 13.3 (structured output), 13.10 (parallel tools), 13.11 (error retries), 13.23 (max iter), 13.41 (drift). All wired up via explicit chapter-number mentions in chapter text. M6 closer chapters should continue this for the decision-framework rollup.

## What didn't work / had to be fixed mid-flight

- **Em-dashes in a sub=2 monospace artifact (13.46) caught by Chrome but not by tests.** The "Step 1 — Attacker plants the bait" lines used em-dashes despite the unambiguous rule. Lint and unit tests are blind to em-dashes; only the Chrome validation catches them. Fix took 30 seconds (replace `—` with ` - `), but it reinforces that the Chrome gate is NOT optional. M6 starter prompt should keep the em-dash check explicit + the Chrome validation gate mandatory.

- **Unused `nodes` array left in 13.45 sub=3 validation flow.** I drafted a `const nodes = [...]` schema then ended up hand-positioning the SVG nodes, but forgot to delete the unused array. Lint caught it before commit. Lesson: when refactoring SVG layout mid-implementation, always rerun `npm run lint` before committing.

- **The pre-existing flaky `learn-ai-prefetch` test** flaked once in M5 full-suite runs and passed in isolation. Same pattern as M1-M4. Continue to ignore.

- **No `Task` tool available in this autonomous environment.** Implemented all chapters directly with the same TDD/scope discipline that subagents would enforce. The plan's subagent-driven workflow is the gold standard; direct implementation works as a fallback if the harness doesn't expose Task. M6 plan can stay subagent-first; the executor can substitute direct implementation if needed.

## Test-pattern observations

- **Test counts:** baseline 3212 (M4 end) -> 3317 after M5 (6 chapters: ~17 tests per chapter * 6 = ~102; +6 config entry tests; +1 lookup presence test). ~105 added tests. Matches the M3 cadence (13 chapters added ~221 tests).

- **Every M5 chapter test block** includes a title-string matcher (e.g., `/An Agent Run Is A Tree Of Spans/i`, `/Audit Log Entry \(Shape\)/i`, `/Direct Injection Attempt/i`). This proves the chapter rendered the right content rather than relying on previously-mounted sub-step text.

## Visual-rule landmines

- **Em-dashes in monospace artifacts surface only in Chrome.** The 3 em-dashes in 13.46 sub=2 were in a template literal block embedded in a styled mono div. Unit tests assert on rendered textContent but don't check for em-dashes. Only Chrome's `.match(/—/g)` catch it. M6 starter prompt should remind: "Chrome validation IS the em-dash gate; never skip it."

- **All other patterns held.** 0 missing-desc SVGs, 0 `C.card` boxes, 0 `Box color={C.card}`, 0 overlapping rects, 0 forward-chapter hints, 0 carry-over fictional brand names, 0 architect-in-titles. Pattern locked through Act 8.

## Recommendations for M6

1. **M6 covers Act 9 Frameworks + Decision (5 chapters, 13.48 - 13.52).** Per spec: LangGraph, CrewAI/AutoGen, vendor SDKs (Claude Agent SDK + OpenAI Agents), custom/no-framework, final decision framework. M6 extends `agent-production.jsx` (which already has Act 8 implemented). No new section file needed.

2. **M6 IS the section closer.** Allocate time for the SECTION SHIP CHECKLIST: capture m6 lessons, finalize CLAUDE.md mapping, verify discoverability sync (llms.txt + JSON-LD + sitemap), remind user to request Google + Bing re-indexing. Do NOT plan a new milestone after.

3. **Add "Chrome validation IS the em-dash gate" reminder.** Three em-dashes slipped past lint + tests in M5; only the Chrome gate caught them. Make it explicit in the M6 starter prompt.

4. **Two-stage review only on first chapter of new file.** M6 extends an existing file (`agent-production.jsx`), so no two-stage review is needed - single-stage check per chapter suffices.

5. **Continue avoiding `npm run format`.** Format runs cascade. Repeat the forbid in every M6 chapter prompt.

6. **Module-level constants must be prefixed with the chapter component name** when extending `agent-production.jsx`. Use prefixes like `LangGraph_FEATURES`, `CrewAI_AGENTS`. Or move single-use constants inside the function. Caught in M3 with `T2_ITERATIONS`; preempted in M5 by using prefixes like `OBS_`, `COST_`, `INJ_`, `TOOL_SEC_`.

7. **Skip search-index regeneration.** Brand leak in `chunks.json` / `chunk-cache.json` remains; per M2 lesson, do not block on it.

8. **Continue the running example.** Alice / c-9924 / Pro tier / 8 canonical tools / 5 tickets. M6 framework chapters can re-use the customer-support agent + tickets T1-T5 + the production stack from Act 8 (observability, cost, latency, guardrails).

9. **Verify worktree-local dev server in Task 1 baseline.** `curl localhost:5174/learn-ai/src/sections/agent-production.jsx` should return JS, not HTML. If HTML, start a worktree-local server. Confirmed running in M5.

10. **`<Fragment key={...}>` for grid-table rows continues to be the right pattern.** Used cleanly in OBS_ALERTS, COST_RETRY_RULES, TOOL_SEC_CAPABILITIES, TOOL_SEC_RATE_LIMITS, INJ_SIGNALS. Keep importing `Fragment` from "react" when needed.

## Section-13-specific outcomes (cumulative M1 + M2 + M3 + M4 + M5)

- 47 chapters total in Section 13. 6 milestones, 5 of 6 complete.
- 6 section files: `agent-prompting.jsx` (Act 1, 6 ch), `agent-tools.jsx` (Acts 2+3, 11 ch), `agent-loops.jsx` (Acts 4+5, 12 ch), `multi-agent.jsx` (Act 6, 7 ch), `agent-evals.jsx` (Act 7, 5 ch), `agent-production.jsx` (Act 8, 6 ch; Act 9 added in M6).
- 3317 tests passing in M5 final (full suite); 2 skipped; 1 pre-existing flake.
- Coverage on M5 files: 100% statements/branches/functions/lines for Act 8 code paths.
- 0 em-dashes (after mid-flight fix), 0 `C.card`, 0 forward-chapter hints, 0 carry-over fictional brand names in src/sections/.
- All new SVGs have `<desc>` first-child + entries in `svg-descriptions.json`.
- CLAUDE.md mapping table + project structure tree updated for Act 8.
- ~11 commits on `worktree-section13` for M5 work (scaffold + loader + config + lookups + 6 chapters + CLAUDE.md + em-dash fix).
