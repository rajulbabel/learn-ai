# Section 13 Milestone 4 Lessons

Captured at the end of M4 to inform M5. Read this before executing M5.

## What worked well

- **Helper hub pattern held cleanly through the fifth file.** `agent-evals.jsx` imported `SOFT, tintedCard, pill` from `agent-prompting.jsx` with zero new helpers needed. No SOFT additions for Act 7 (the red / orange / yellow / amber / purple / green rotation was already covered by M1's SOFT map). M5 (Act 8 Production Hardening) should keep the same hub.

- **The sub=20 + localStorage fingerprint trick** validated all 5 chapters in 5 navigate-and-reload cycles, ~3 minutes total. Zero per-sub click-through. Detected: 0 missing-desc SVGs (across 9 chapter SVGs total), 0 `C.card` boxes, 0 em-dashes, 0 overlapping rects. The validator's `viewBox > 100x100` filter cleanly excludes the search-icon SVG. Pattern locked through Acts 7.

- **TOC-entry + chapter-entries + lookup registration in one task each** continued to avoid the M1 ordering bug. Tests passed first try on Task 4 and Task 5 (sequential, but each was a single commit).

- **Module-level data constants above each export** scaled cleanly through `agent-evals.jsx`:
  - WhyEvalAgents: `WHY_AGENTS_HARDER`, `PRODUCTION_INCIDENTS`, `OFFLINE_VS_ONLINE`, `HUMAN_REVIEW_MODES`, `PIPELINE_STAGES`.
  - EvalDimensions: `EVAL_AXES`, `SAFETY_METRICS`.
  - LlmAsJudge: `PAIRWISE_VS_SCALAR`, `JUDGE_RUBRIC`, `JUDGE_BIASES`.
  - TraceEvals: `T2_TRACE_STEPS`, `T4_TRACE_STEPS`, `PER_STEP_RUBRIC`.
  - EvalSetsContinuous: `EVAL_SET_DECKS`.

- **Artifact treatment (styled mono-text, not code blocks)** worked again for the canonical judge prompt (13.39 sub=4) and the trace eval record shape (13.40 sub=3). Both rendered with `${color}06` tinted bg, `${color}12` soft border, monospace 13px font inside a centered tinted-card wrapper with `whiteSpace: "pre", textAlign: "left"` on the inner pre. M5 production-hardening artifacts (e.g., observability JSON, alerting config) should use the same pattern.

- **Unique-to-sub=N matcher discipline** kept tests honest. Every chapter test block has at least one matcher unique to that sub-step's title ("Three Reasons Agents Are Harder To Eval", "Correctness, Latency, Cost, Safety", "Trust But Verify", "Trace Eval Record (Shape)", "Build The Eval Set Before The Agent"). Keep this in M5.

## What didn't work / had to be fixed mid-flight

- **`<>` fragments with `key` props on children fail React rules.** First implementation of OFFLINE_VS_ONLINE used `<>...</>` with `key={`a-${i}`}` on children. React keys MUST be on the wrapping fragment itself, not on its children when fragments are mapped. Fix: `import { Fragment } from "react"` and use `<Fragment key={row.aspect}>`. Applied to OFFLINE_VS_ONLINE, JUDGE_RUBRIC, SAFETY_METRICS, PER_STEP_RUBRIC, and tick-labels in calibration scatter / drift chart. Lesson: when mapping table rows with `display: grid`, prefer named `<Fragment key>` over `<>...</>`. M5 starter prompt should include this rule explicitly.

- **Stale Vite dev server.** The pre-existing dev server on port 5173 was running in the main repo (`/Users/rajul/learn-ai/`, not in the worktree). It could not see worktree-only files and returned stale config (170 chapters instead of 191). Fix: started a separate dev server on port 5174 from the worktree directory. M5 starter prompt should call out: "Verify dev server lives in worktree before validation. If `curl localhost:<port>/learn-ai/src/sections/agent-evals.jsx` returns HTML (404 fallback), the dev server is in the wrong directory."

- **Localstorage fingerprint stale across milestones.** The previously-saved nav had a 170-chapter fingerprint, which was rejected by `loadNav` (good - that's the fingerprint guard). But it meant the Chrome validation script had to regenerate the fingerprint from the freshly-loaded config inside the page. The script fetched `/learn-ai/src/config.js` and parsed `id:` matches inside the `chapters = [` block to get the correct fingerprint. M5 chapters can re-use this fingerprint-regeneration snippet verbatim.

- **The pre-existing flaky `learn-ai-prefetch` test** flaked twice during full-suite runs and passed cleanly in isolation - same M1/M2/M3 behavior. Continue to ignore.

## Test-pattern observations

- **Test counts:** baseline 3124 (M3 end) -> 3212 after M4 (5 chapters: ~17 tests per chapter * 5 = ~85; +5 config entry tests; +1 lookup presence test). ~91 added tests.

- **Every M4 chapter test block** includes a title-string matcher (e.g., `/Trace Eval Record \(Shape\)/i`) on at least one sub-step. This proves the chapter rendered the right content rather than relying on previously-mounted sub-step text. Critical because Act 7 has overlapping vocabulary ("eval", "judge", "score") across all five chapters.

## Visual-rule landmines

- **None caught at Chrome validation.** All 5 chapters scored 0 missing-desc, 0 `C.card`, 0 em-dash, 0 overlap. The pattern is locked through Act 7.

- **The `<>` fragment-key issue** was NOT a visual-rule problem; it was a React correctness issue that showed up as duplicate-key React warnings in test stderr. Tests still passed (React doesn't crash on duplicate keys, just warns), but the warnings are real and would have shipped. M5 prompt should mention: "When mapping multi-element rows inside `display: grid`, use `<Fragment key={...}>`, not `<>...</>`."

## Recommendations for M5

1. **M5 covers Act 8 Production Hardening (6 chapters, 13.42 - 13.47).** Per spec: Observability, Cost, Latency, Guardrails, Prompt Injection, Tool Security. Likely one new file `agent-production.jsx`. Verify in M5 plan.

2. **Add "Fragment key, not `<>...</>` key" to M5 starter prompt.** This is the third pattern-fix that needs to land in starter prompts: M1 (`Box color={C.card}`), M2 (`SOFT.amber` extension), M3 (`Act N` in visible text + `>` escape), M4 (`<Fragment key>` for grid-table rows).

3. **Add "Verify dev server in worktree" check to M5 Task 1 baseline.** `curl localhost:<port>/learn-ai/src/sections/agent-evals.jsx` should return JS, not HTML. If HTML, start a worktree-local server on a different port.

4. **Continue avoiding `npm run format`.** No subagent ran it in M4; format runs cascade. Repeat the forbid in M5.

5. **Two-stage review only on first chapter of each new file.** If M5 creates `agent-production.jsx`, do two-stage on 13.42 (or whatever the first chapter is). Other chapters in same file usually pass single-stage check.

6. **Skip search-index regeneration.** Brand leak in `chunks.json` / `chunk-cache.json` remains; per M2 lesson, do not block on it.

7. **Continue the running example.** Alice / c-9924 / Pro tier / 8 canonical tools / 5 tickets. M5 production hardening should re-use the customer-support agent + tickets T1-T5 + the eval rubric established in 13.39.

8. **Cross-section back-references continue to land cleanly.** M4 used 12.32 (LLM-as-Judge for RAG) inside 13.39 and section 11 memory layers inside 13.41. M5 production-hardening chapters can back-reference 13.16 MCP Security and 13.23 Loop Termination cleanly.

## Section-13-specific outcomes (cumulative M1 + M2 + M3 + M4)

- 41 chapters total in Section 13. 6 milestones, 4 of 6 complete.
- 5 section files: `agent-prompting.jsx` (Act 1, 6 ch), `agent-tools.jsx` (Acts 2+3, 11 ch), `agent-loops.jsx` (Acts 4+5, 12 ch), `multi-agent.jsx` (Act 6, 7 ch), `agent-evals.jsx` (Act 7, 5 ch).
- 3212 tests passing in M4 final (full suite); 2 skipped.
- Coverage on M4 files: 100% statements/branches/functions/lines for Act 7 code paths.
- 0 em-dashes, 0 `C.card`, 0 forward-chapter hints, 0 carry-over fictional brand names in src/sections/.
- All new SVGs have `<desc>` first-child + entries in `svg-descriptions.json`.
- CLAUDE.md mapping table + project structure tree updated for Act 7.
- ~10 commits on `worktree-section13` for M4 work (scaffold + loader + config + lookups + 5 chapters + CLAUDE.md).
