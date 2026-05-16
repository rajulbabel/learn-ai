# Section 13 Overall Lessons (Cross-Milestone Synthesis)

Captured after the final milestone (M6) of Section 13. This documents what worked best across the full 6-milestone arc, what to change next time, and what the section surfaced as candidate future sections.

## What worked best across all 6 milestones

### Visual patterns

- **The "styled mono-text, not code block" artifact pattern** worked for every artifact type Section 13 needed: API shapes (prompt template, tool schemas, JSON Schema, MCP messages, ReAct trace, agent.json, memory snapshots, LangGraph node/edge API, CrewAI Agent, AutoGen GroupChat, Claude Agent SDK loop, OpenAI Agents handoffs, custom 11-line loop), trace records (T1-T5 traces, eval records, audit logs, OTel spans, judge rubric), and policy mockups (consent prompts, indirect-injection scenarios). Lock this pattern: tinted card outer with `textAlign: "center"`, mono div inner with `whiteSpace: "pre"` and `textAlign: "left"`, color follows the sub-step rotation.

- **Module-level data constants above each export** scaled to 6 section files and 52 chapters with zero collisions once the M3 lesson (prefix constants with chapter name when extending an existing file) was applied. The naming discipline (`OBS_SPAN_TREE`, `COST_BREAKDOWN`, `INJ_HIERARCHY`, `LANGGRAPH_NODES`, `IT_LAYERS_123`) keeps the JSX declarative and the chapter scannable.

- **`<Fragment key={...}>` for grid-table rows** is the right React pattern. The M4 lesson surfaced when `<>...</>` with keys on children silently warned. Using `import { Fragment } from "react"` and named keys eliminates the warning. Applied cleanly through M5, M6.

- **The standard customer-support running example** (Alice, c-9924, Pro tier, 8 canonical tools, 5 tickets T1-T5) anchored every chapter from M1 through M5. Learners saw the same characters and tickets evolve from prompting (Act 1) through tool use (Act 2) through loops (Act 4) through memory (Act 5) through multi-agent (Act 6) through evals (Act 7) through production hardening (Act 8). The capstone (13.52) deliberately introduced a different domain (internal IT support) to demonstrate transfer.

### Test patterns

- **Unique-to-sub=N matcher discipline** kept test signal honest across 52 chapters. Every sub=N test asserts at least one string only that sub-step's content satisfies. Without it, sub=5 tests pass even when sub=5 content is deleted because earlier sub-steps remain mounted. Lock the pattern.

- **Auto-iteration coverage** (`for s in 0..10`) caught real React rendering bugs early. The capstone (13.52) with 7 sub-steps automatically gets 11 auto-iteration tests on top of the 7 content tests, giving deep coverage.

- **Test counts as smoke checks** matched expectations chapter-by-chapter: ~17 tests per chapter (6-7 content + 11 auto-iteration). Baseline 2627 (after scaffold) -> 3405 after Section 13 (~778 new tests for 52 chapters and supporting infrastructure).

### Process patterns

- **The sub=20 + localStorage fingerprint Chrome validator** validated 52 chapters in ~30 minutes total across 6 milestones (vs. days of manual click-through). It detected and fixed: 4 em-dashes (3 in M5, 1 earlier), 0 missing-desc SVGs across all chapter SVGs, 0 `C.card` boxes, 0 overlapping rects. The Chrome validator IS the em-dash gate - lint and unit tests are blind to em-dashes inside template literals.

- **Two-stage review on the first chapter of each new section file** was high-leverage. Stage 1 SCOPE + Stage 2 CORRECTNESS on 13.1, 13.7, 13.18, 13.30, 13.37, 13.42 caught real defects that would have shipped. Subsequent chapters in the same file passed single-stage check 99% of the time.

- **TOC entry + chapter entries in one task** avoided the M1 ordering bug. Pattern locked from M2 onward.

- **Forbidding `npm run format`** in every implementer prompt prevented cascade reformats. Format runs touch unrelated files and inflate commits.

- **Helper hub in one file** (`agent-prompting.jsx` exports `SOFT, tintedCard, pill, DIM_BG, DIM_BORDER`) prevented helper duplication across the 6 section files. Scaled cleanly.

### Cross-section back-references

- The back-references that landed cleanest were the ones with concrete chapter numbers in the chapter text, not vague "as we saw earlier" pointers:
  - 13.43 references 12.36 (prompt caching) explicitly.
  - 13.44 references 13.10 (parallel tools) explicitly.
  - 13.39 references 12.32 (LLM-as-Judge for RAG) explicitly.
  - 13.41 references Section 11 memory layers explicitly.
  - The 13.52 capstone references every layer back to its source chapter range (13.5 / 13.18-13.22 / 13.24-13.29 / etc.).
- Learners using the search index can follow these references; learners reading linearly get a connected mental model.

## What would change if starting Section 13 over

- **Lock the SOFT map and DIM_BG/DIM_BORDER constants in M1.** M1 found `C.indigo`, `C.teal` missing from the palette and `${C.dim}NN` invalid-CSS pattern. Adding `C.amber` in M2 was preventable. M3-M6 needed no palette changes. Building the SOFT map and adding the dim constants in Task 1 of M1 (not as fixes after first-chapter review) would have saved cycles.

- **Add `<Fragment key>` for grid-table rows to the M1 starter prompt.** M4 discovered the React-warning issue; if M1 had codified it, M2-M3 grid-table rows would have been cleaner from the start.

- **Add the "no Act N in visible content" rule earlier.** Surfaced in M3 (twice). If M1 had codified it, M3 wouldn't have shipped two violations.

- **Treat the search-index brand leak as out-of-scope from M1 onward.** ~20 minutes wasted in M2 regenerating `chunks.json`. Memory note prevented repeats in M3-M6.

- **Consider an explicit "running example characters and tickets" header in every section file.** The Alice / c-9924 / T1-T5 example was unstated in M1 and had to be re-derived. A 10-line header constant block at the top of each file would have made it easier to keep consistent.

## Chapters that needed the most Chrome iteration

- **13.1 (Anatomy of an LLM Call)** in M1 needed two-stage review and fixed: missing `textAlign: "center"` on 3 card divs, 4 unlabeled finish_reason badges in single yellow color, unlabeled timeline arrows, invalid `${C.dim}NN` CSS. After this chapter the pattern locked.

- **13.46 (Prompt Injection Defenses)** in M5 had 3 em-dashes in the indirect-injection scenario template literal that lint and tests missed but Chrome caught. Fixed via mid-flight em-dash replacement.

- **13.52 (Agent Decision Framework)** in M6 was the highest-stakes chapter (signature visual is the 9-layer decision stack). Validated zero defects on first Chrome pass. No additional iteration needed.

Other 49 chapters passed Chrome validation on first pass.

## Most useful cross-section back-references

- **Section 12 -> Section 13 transitions:**
  - 12.36 prompt caching -> 13.43 cost control
  - 12.32 LLM-as-Judge -> 13.39 LLM-as-Judge for agents
  - 12.24 citations + source_url metadata -> 13.7 tool result shape

- **Section 11 -> Section 13 transitions:**
  - Section 11 memory layers (working / episodic / semantic / procedural) -> 13.24-13.29 agent memory taxonomy
  - 11.20 filtering metadata -> 13.41 eval set metadata

- **Within Section 13:**
  - 13.5 (Prompt vs Tune vs RAG vs Agent decision) is the layer-1 reference for every later "when does this fit" decision card.
  - 13.7-13.11 (Tools chapters) provide the canonical 8-tool inventory reused in every later trace.
  - 13.18-13.22 (Loop patterns) provide the reason-act-observe vocabulary used in 13.42-13.47 production hardening.

## Future-section seeds surfaced by Section 13

These are NOT commitments. They are open questions Section 13 raised that may seed future sections.

- **Deeper AI safety / alignment section.** Section 13 Act 8 covers prompt-injection defense (13.46) and tool security (13.47) at production-engineering depth. A separate section on alignment theory (reward hacking, capability vs alignment, oversight scaling) would complement it.

- **Voice and multimodal agents.** Explicitly out-of-scope in Section 13's spec. A short follow-on section covering speech-to-text + agent loop + text-to-speech, plus vision-as-tool, would fill the gap.

- **Browser-use / computer-use agents.** Mentioned briefly in 13.51 but no dedicated coverage. The Claude Computer Use API and OpenAI Computer Use are real products that deserve their own treatment.

- **Model fine-tuning depth section.** Section 2 covers SFT/RLHF/DPO mechanics. Section 13.5 covers the decision framework for "fine-tune or not". A "build a fine-tuned model for your agent" section would close the loop.

- **Agent eval engineering section.** Section 13 Act 7 covers eval principles. A deeper section on the eval set engineering workflow (sourcing golden examples, adversarial data augmentation, regression-set growth, calibration metrics) could be its own treatment.

These are seeds, not promises. Section 13 sufficient as shipped.

## Section 13 final state

- 52 chapters across 6 files. 6 milestones, all complete.
- 3405 tests passing.
- 100% coverage on every Section 13 source file.
- 0 visual-rule violations.
- Discoverability metadata in place from M1 (llms.txt + JSON-LD + sitemap).

Section 13 is shipped.
