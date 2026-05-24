# Section 13 Milestone 3 Lessons

Captured at the end of M3 to inform M4. Read this before executing M4.

## What worked well

- **Helper hub stayed at `agent-prompting.jsx`.** `multi-agent.jsx` imported `SOFT, tintedCard, pill` from there with zero new helpers needed. No SOFT additions were required for Act 6 (the green/teal/cyan/blue/indigo/purple rotation was already covered by M1 + M2's SOFT map). The single-file helper hub pattern continues to scale - M4 (evals) should keep importing from `agent-prompting.jsx` too.

- **The sub=20 + localStorage fingerprint trick** validated all 13 chapters in 13 navigate-and-reload cycles, ~10 minutes total. Zero per-sub click-through. Detected: 0 missing-desc SVGs, 0 `C.card` boxes, 0 em-dashes, 0 overlapping rects across all chapters. Repeat in M4.

- **TOC-entry + chapter-entries combined into one task** (Task 5) again avoided the M1 ordering bug. Tests passed first try; lookup tests added in Task 6 also went green immediately.

- **Module-level data constants above each export** scaled cleanly across both files:
  - `agent-loops.jsx` Act 5: `LONG_TERM_TYPES`, `T2_MEMORY_SNAPSHOT`, `WHY_FOUR_CARDS`, `WORKING_MEMORY_SHAPE`, `T2_SCRATCHPAD_ITER`, `WORKING_VS_LONG`, `ALICE_EPISODES`, `EPISODIC_ENTRY_SHAPE`, `PRUNING_POLICY_ROWS`, `PROFILE_CARD_SHAPE`, `PROFILE_GROWTH`, `SEMANTIC_WRITE_VS_IGNORE`, `RECIPE_LIBRARY`, `RECIPE_SHAPE`, `PROMPT_VS_PROCEDURAL`, `RECENCY_RELEVANCE_HYBRID`, `CONTEXT_THRESHOLDS`.
  - `multi-agent.jsx` Act 6: `SPECIALIST_AGENTS`, `MULTI_AGENT_ANTI_PATTERNS`, `ORCHESTRATOR_PHASES`, `T3_ORCHESTRATOR_TRACE`, `AGGREGATION_PATTERNS`, `HIERARCHY_DECISION`, `SUPPORT_TREE`, `HANDOFF_SHAPE`, `HANDOFF_PACKAGE`, `T4_HANDOFF_TRACE`, `REFUND_CRITIC_TRACE`, `CRITIC_VS_DEBATE_VS_SKIP`, `FOUR_FAILURE_MODES`, `DRIFT_INTERPRETATIONS`, `ALERT_THRESHOLDS`, `QUERY_REWRITE_TRACE`, `RESEARCH_QUERY_STEPS`, `NAIVE_VS_AGENTIC_DECISION`.

- **Artifact treatment (styled mono-text, not code blocks)** worked on every memory shape: WORKING_MEMORY_SHAPE, EPISODIC_ENTRY_SHAPE, PROFILE_CARD_SHAPE, RECIPE_SHAPE, HANDOFF_SHAPE. All rendered with `${color}06` tinted bg, `${color}12` soft border, `fontFamily: "monospace", whiteSpace: "pre", textAlign: "left"` inside a centered tinted-card wrapper. Keep the pattern in M4 (eval artifacts: eval result JSON, scorecard JSON, rubric).

- **Unique-to-sub=N matcher discipline** continued to keep tests honest. Every chapter test block has at least one matcher unique to that sub-step's title (e.g., "Two Memory Layers", "Long-Term Splits Three Ways", "Memory Snapshot: Ticket T2", "One Planner, N Workers", "Hand-Off Ping-Pong"). M4 should keep this.

## What didn't work / had to be fixed mid-flight

- **Act-references in visible content failed `Act references do not leak` test** twice. M3 chapter implementations had "Act 5" / "Act 6" text in sub-step copy (e.g., "the rest of Act 5 walks the taxonomy"). The test scans every line outside `//` comments for `\bActs?\s+\d/`. Fix: rewrite to "the rest of the memory chapters" / "closes out the multi-agent chapters". M4 prompts must call out "no `Act N` or `Acts N` strings in visible content - only in JS comments."

- **Local-constant name collision** when I used `T2_ITERATIONS` (already declared in WorkflowVsAgent for Act 4 in the same file). Build error stopped the file from loading. Lesson: when extending an existing file across multiple chapter implementations, prefix new module-level constants with the chapter component name (e.g., `T2_SCRATCHPAD_ITER` for WorkingMemory). M4 will extend whichever file ends up holding evals; same risk applies. Use unique names.

- **Unescaped `>` in JSX text broke ESLint parsing** twice (CriticDebate sub=3 "invoice is >30 days old" and MultiAgentFailures sub=3 deadlock SVG label "> 30 Seconds"). `vitest` was lenient; `eslint` was not, so the tests passed but `npm run lint` failed. Fix: always use `&gt;` for greater-than in text. M4 prompts should explicitly mention "escape `>` as `&gt;` in JSX text content (not in JSX attributes / template literals)".

- **The pre-existing flaky `learn-ai-prefetch` test** flaked once during full-suite runs and passed cleanly in isolation - same M1/M2 behavior. Continue to ignore.

## Test-pattern observations

- **Test counts:** baseline 2899 (M2 end) -> 3124 after M3 (13 chapters: ~17 tests per chapter * 13 = ~221; +13 config entry tests; +2 lookup presence tests). ~225 new tests added.

- **All new chapter test blocks** include a title-string matcher (e.g., `/Memory Snapshot: Ticket T2/i`) on at least one sub-step. This is what proves the chapter actually rendered the right content rather than relying on previously-mounted sub-steps' text.

## Visual-rule landmines

- **None caught at Chrome validation.** All 13 chapters scored 0 missing-desc, 0 `C.card`, 0 em-dash, 0 overlap. The pattern is locked through Act 6.

- **The `>` escape issue was NOT a visual-rule problem**, but a lint hygiene problem. Lint runs after tests pass, so the lint gate catches things tests miss. Add lint to the per-chapter checklist explicitly in M4 prompts.

## Recommendations for M4

1. **M4 covers Act 7 Evals (5 chapters, 13.37 - 13.41) - the smallest milestone.** Spec says: ScoringRubrics, AutoEvalsWithLLMJudges, HumanEvalsAndAnnotation, OnlineMetricsAndShadowing, AgentSafetyChecks. Should be one new file `evals.jsx` or extend `multi-agent.jsx` - confirm in M4 plan.

2. **Add "no Act N in visible content" to the M4 starter prompt's standing rules.** This is the third milestone where it surfaced. Make it a hard pre-commit check.

3. **Add "escape > as &gt; in JSX text" to the M4 starter prompt's standing rules.** Lint-error rate of 2/13 chapters in M3 means this needs explicit callout.

4. **Module-level constants must be prefixed with the chapter component name** when extending an existing file. `MemoryTaxonomy_T2_SNAPSHOT` style. Or move the constant inside the function component if it only appears in one chapter.

5. **Continue avoiding `npm run format`.** No subagent ran it in M3; format runs cascade. Repeat the forbid in M4.

6. **Two-stage review only on first chapter of each new file.** If M4 creates `evals.jsx`, do two-stage on 13.37 (or whatever the first chapter is). Other chapters in the same file usually need only single-stage check.

7. **Skip search-index regeneration.** Brand leak in `chunks.json` / `chunk-cache.json` remains; per M2 lesson, do not block on it.

8. **Continue the running example.** Alice / c-9924 / Pro tier / 8 canonical tools. Evals chapters should re-use existing customer-support agent + tickets T1-T5 + same memory layers established in Act 5.

## Section-13-specific outcomes (cumulative M1 + M2 + M3)

- 36 chapters total in Section 13. 6 milestones, 3 of 6 complete.
- 4 section files: `agent-prompting.jsx` (Act 1, 6 ch), `agent-tools.jsx` (Acts 2+3, 11 ch), `agent-loops.jsx` (Acts 4+5, 12 ch), `multi-agent.jsx` (Act 6, 7 ch).
- 3124 tests passing in M3 final (full suite); 2 skipped.
- Coverage on M3 files: 100% statements/branches/functions/lines for Act 5 + Act 6 code paths.
- 0 em-dashes, 0 `C.card`, 0 forward-chapter hints, 0 carry-over fictional brand names in src/sections/.
- All new SVGs have `<desc>` first-child + entries in `svg-descriptions.json`.
- CLAUDE.md mapping table + project structure tree updated for Acts 5+6.
- ~20 commits on `worktree-section13` for M3 work (scaffolds + loader + config + lookups + 13 chapters + CLAUDE.md + lint fix).
