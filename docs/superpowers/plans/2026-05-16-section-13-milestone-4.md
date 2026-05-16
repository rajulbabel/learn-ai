# Section 13 Milestone 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** Subagent prompts MUST include verbatim Files: list, "modify ONLY files in the Files: list", and "run `git diff --stat` before committing; abort if any file outside the list shows as modified". Parent reviews `git diff --stat` after each task. Scope violations are rejected.
>
> **Two-stage review per task:** Stage 1 SCOPE; Stage 2 CORRECTNESS.

**Goal:** Add Section 13 Act 7 Evals (5 chapters). 13.37 WhyEvalAgents, 13.38 EvalDimensions, 13.39 LlmAsJudge, 13.40 TraceEvals, 13.41 EvalSetsContinuous. The app ships at end of M4 with Section 13 having 41 navigable chapters.

**Architecture:** A NEW file `src/sections/agent-evals.jsx` holds all 5 Act 7 chapters. The Section 13 loader grows from 4-file (M3) to 5-file (M4). All chapter content follows CLAUDE.md visual rules + Section 13 spec rules. Eval chapters back-reference Section 12.32 (LLM-as-Judge for RAG) where the technique was first introduced.

**Tech Stack:** React 18, Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`

**Branch policy:** Direct on `main`.

---

## Prerequisites

- M1+M2+M3 complete: chapters 13.1-13.36 implemented, tests green, Chrome-validated.
- M3 lessons captured. READ BEFORE STARTING M4.

## File Structure

### New files

- `src/sections/agent-evals.jsx` - Act 7 chapter functions. 5 exports (WhyEvalAgents, EvalDimensions, LlmAsJudge, TraceEvals, EvalSetsContinuous).

### Modified files

- `src/config.js` - add 5 entries (13.37-13.41).
- `src/learn-ai.jsx` - extend Section 13 loader to 5-file `Promise.all`.
- `src/__tests__/sections.test.jsx` - import + spread + content tests.
- `src/__tests__/config.test.js` - entry tests.
- `src/__tests__/lookup.test.js` - import + spread + presence tests.
- `src/data/svg-descriptions.json` - new SVG entries.
- `CLAUDE.md` - mapping table rows + project structure tree.

### Unchanged

`public/llms.txt`, `index.html`, all earlier section files.

---

## Standard running-example values (reference)

(Same as M1-M3, re-stated.)

- Customer-support agent on customer support KB.
- Canonical tool inventory + 5 tickets + Alice / `alice@example.com` / `c-9924`.
- Agent constants: 8k/128k, max iter 5/10-20, tool 200ms, LLM 1.5s, $3/M in $15/M out, retry 3 exp backoff.
- **Per-act Box colors (M4):**
  - Act 7 (Evals): red family - sub-step rotation `C.red` -> `C.orange` -> `C.yellow` -> `C.amber` -> `C.purple` -> `C.red`.

---

## Visual rules - MANDATORY (re-stated)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 12).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "LLM as Judge" not "llm as judge". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`temperature = 0.7`), JSON keys in artifact blocks (`"name"`, `"description"`), tokens like `[CLS]`.
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas / artifacts centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Stop hook `.claude/scripts/check-sections.sh` flags violations.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts (e.g., "covered in Section 12.32") are OK.
12. **No carry-over brand names** - corpus = "customer support knowledge base"; URLs = `docs.example.com`; never reintroduce a fictional company name.
13. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".
14. **Artifact treatment** (Section-13-specific) - judge prompts, eval rubrics, trace eval records render as styled monospace text blocks with tinted background (`${color}06`), soft border (`1px solid ${color}12`), monospace 14-16px font. Labeled "Eval Rubric (shape) - Customer Support Judge" / "Trace Eval Record" / "Judge Prompt". NEVER as executable code. The judge prompt artifact's field names lock the canonical rubric reused in chapters 13.40 and beyond.

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 13 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding a NEW section file (`src/sections/agent-evals.jsx` in M4), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as AgentEvals from "../sections/agent-evals.jsx"`, (b) presence tests asserting `typeof mod.ChapterName === "function"` for each export, AND (c) spread `...AgentEvals` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as AgentEvals`, (b) spread `...AgentEvals` into the `lookup` object.
- `src/learn-ai.jsx` - extend Section 13's loader via `Promise.all` to include `agent-evals.jsx`. M4 grows the loader from 4-file (M3) to 5-file.

### When adding chapters to `chapters[]` (Act 7 chapters in M4):

- `src/__tests__/config.test.js` - add a "Section 13 Act 7 chapters" describe block testing the specific new entries (13.37-13.41).
- The relevant section file (`agent-evals.jsx`) must already export each new `component`. If it doesn't, the lookup-spread will resolve the symbol as `undefined` and `sections.test.jsx`'s generic test fails with "fn is not a function".
- If new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

For Section 13 in M4, the loader becomes 5-file `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. Append `agent-evals.jsx` to the existing array.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

1. Task 0 - Name session.
2. Task 1 - Baseline.
3. Task 2 - Create `agent-evals.jsx` with 5 stubs.
4. Task 3 - Update `learn-ai.jsx` to 5-file loader.
5. Task 4 - Add 13.37-13.41 to `chapters[]`.
6. Task 5 - Register `AgentEvals` in test lookups.
7. Tasks 6-10 - Implement 13.37-13.41.
8. Task 11 - Update `CLAUDE.md`.
9. Task 12 - Chrome validation.
10. Task 13 - Final M4 verify.
11. Task 14 - Plan Refinement Checkpoint for M5.

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section13-milestone4`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section13-milestone4` (if your Claude Code build supports it).
- Settings: set the session title via `/config` or the IDE extension's session pane.
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section13-milestone4" so future searches catch it.

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section13-milestone4` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section13-milestone4`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify M3 green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Confirm M1 + M2 + M3 commits on `main`**

```bash
git log --oneline -50 | head -50
```

Expected: M1-M3 commits visible, ending with the M4 starter prompt commit ("Add M4 starter prompt for next session"). Should include 36 chapter commits (13.1-13.36) plus milestone-boundary docs. If the log doesn't end cleanly, do NOT proceed.

- [ ] **Step 3: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 4: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Confirm shipped artifacts use the IETF-reserved example domain only**

```bash
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" || echo "domain clean"
```

Expected: `domain clean`. If a non-`example.com` vendor-shaped domain appears in shipped artifacts, regenerate the search index (`npm run search:extract`) and re-verify before proceeding.

- [ ] **Step 6: No commit yet** - this task only verifies baseline.

---

## Task 2: Create `src/sections/agent-evals.jsx` scaffold with 5 stubs

**Files:**
- Create: `src/sections/agent-evals.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Create the file**

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 7: Evals
// Chapters 13.37 - 13.41

export const WhyEvalAgents = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Why Eval Agents Differently
        </T>
        <T size={16}>Stub - implemented in Task 6.</T>
      </Box>
    </div>
  );
};

export const EvalDimensions = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Eval Dimensions
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const LlmAsJudge = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          LLM-as-Judge
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const TraceEvals = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Trace Evals
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const EvalSetsContinuous = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Eval Sets + Continuous Eval
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/sections/agent-evals.jsx
git commit -m "Add agent-evals.jsx scaffold with 5 stub exports for Section 13 Act 7"
```

---

## Task 3: Update `learn-ai.jsx` loader to 5-file Promise.all

**Files:**
- Modify: `src/learn-ai.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Append `agent-evals.jsx` to the Promise.all in Section 13's entry.**

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
    import("./sections/agent-loops.jsx"),
    import("./sections/multi-agent.jsx"),
    import("./sections/agent-evals.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 2: Test + commit**

```bash
npm run test
git add src/learn-ai.jsx
git commit -m "Extend Section 13 loader to include agent-evals.jsx"
```

---

## Task 4: Add 5 chapter entries (13.37-13.41) to `chapters[]`

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

**Scope binding:** Only these two.

- [ ] **Step 1: Failing tests**

```js
describe("Section 13 Act 7 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.37 WhyEvalAgents", () => {
    const c = findCh("13.37");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Eval Agents Differently");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyEvalAgents");
  });

  it("has 13.38 EvalDimensions", () => {
    const c = findCh("13.38");
    expect(c).toBeDefined();
    expect(c.title).toBe("Eval Dimensions");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EvalDimensions");
  });

  it("has 13.39 LlmAsJudge", () => {
    const c = findCh("13.39");
    expect(c).toBeDefined();
    expect(c.title).toBe("LLM-as-Judge");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LlmAsJudge");
  });

  it("has 13.40 TraceEvals", () => {
    const c = findCh("13.40");
    expect(c).toBeDefined();
    expect(c.title).toBe("Trace Evals");
    expect(c.section).toBe(13);
    expect(c.component).toBe("TraceEvals");
  });

  it("has 13.41 EvalSetsContinuous", () => {
    const c = findCh("13.41");
    expect(c).toBeDefined();
    expect(c.title).toBe("Eval Sets + Continuous Eval");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EvalSetsContinuous");
  });
});
```

- [ ] **Step 2: Append 5 entries**

```js
{ id: "13.37", title: "Why Eval Agents Differently", section: 13, component: "WhyEvalAgents" },
{ id: "13.38", title: "Eval Dimensions", section: 13, component: "EvalDimensions" },
{ id: "13.39", title: "LLM-as-Judge", section: 13, component: "LlmAsJudge" },
{ id: "13.40", title: "Trace Evals", section: 13, component: "TraceEvals" },
{ id: "13.41", title: "Eval Sets + Continuous Eval", section: 13, component: "EvalSetsContinuous" },
```

- [ ] **Step 3-5: Verify pass; smoke gate (lookup tests fail until Task 5); commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 13.37-13.41 to config for Section 13 Act 7"
```

---

## Task 5: Register AgentEvals in test lookups

**Files:**
- Modify: `src/__tests__/lookup.test.js`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

- [ ] **Step 1: lookup.test.js**

Add:

```js
import * as AgentEvals from "../sections/agent-evals.jsx";
```

Spread `...AgentEvals` into `lookup`. Add:

```js
describe("Section 13 Act 7 component presence (AgentEvals)", () => {
  it("AgentEvals exports each Act 7 chapter", () => {
    expect(typeof AgentEvals.WhyEvalAgents).toBe("function");
    expect(typeof AgentEvals.EvalDimensions).toBe("function");
    expect(typeof AgentEvals.LlmAsJudge).toBe("function");
    expect(typeof AgentEvals.TraceEvals).toBe("function");
    expect(typeof AgentEvals.EvalSetsContinuous).toBe("function");
  });
});
```

- [ ] **Step 2: sections.test.jsx**

Add `import * as AgentEvals` and spread `...AgentEvals` into lookup.

- [ ] **Step 3: Test + commit**

```bash
npm run test
git add src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Register AgentEvals in test lookups"
```

---

## Task 6: Implement Chapter 13.37 WhyEvalAgents

**Files:**
- Modify: `src/sections/agent-evals.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Open Act 7. Agent eval is harder than LLM eval. Agents are non-deterministic (same input -> different traces), multi-step (many places to fail), and fail silently (no crash, just wrong action). Show why production agents need continuous eval, and what the cost of skipping is.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - Why agent eval is harder than LLM eval**
  Title: "Three Reasons Agents Are Harder To Eval"
  Visual: 3 cards:
  - Non-determinism: same ticket can take different traces. You can't compare outputs directly.
  - Multi-step: 8 tool calls in a row means 8 places to fail.
  - Silent failure: the agent doesn't crash; it just calls the wrong tool, sends the wrong email, or misses an escalation.
  Each card tinted differently.
  Key content: "non.?determin", "multi.?step", "silent", "fail.*silent|wrong tool".

- **sub=1 (C.orange) - The cost of skipping evals**
  Title: "What Breaks When You Don't Eval"
  Visual: a "scary stories" card grid. 4 production incidents:
  - "Refund agent issued $50K in unauthorized refunds before someone noticed."
  - "Support agent confidently quoted a non-existent policy for 3 weeks."
  - "Multi-agent system drifted from billing to chitchat over 2 days."
  - "Tool security regression let one customer's data leak to another's session."
  Each in red tint to drive home the production risk.
  Key content: "production|incident", "unauthorized|wrong|leak|drift", "weeks|days|noticed".

- **sub=2 (C.yellow) - Online vs offline eval**
  Title: "Offline (Before Ship) vs Online (After Ship)"
  Visual: 2-column comparison.
  - Offline: golden eval set, judge rubric, regression-tested before every deploy. Cheap per run but small sample.
  - Online: sample 1-5% of production traffic and grade with LLM-as-Judge. Expensive per query but real distribution.
  Production agents need BOTH.
  Key content: "offline|online", "golden|sample|production", "regression|distribution".

- **sub=3 (C.amber) - What you CAN'T eval automatically**
  Title: "Some Failure Modes Need Humans"
  Visual: a 3-row table:
  - Tone failures (rude, robotic, condescending): need human + spot check.
  - Hidden hallucinations (invented policy that LLM-Judge can't detect because the judge doesn't know the policy either): need human + RAG-grounded judge.
  - Long-term drift across sessions: need cross-session human review.
  Key content: "humans|human review", "tone|hallucin|drift", "judge.*can.?t|miss".

- **sub=4 (C.purple) - Production eval pipeline preview**
  Title: "What A Full Pipeline Looks Like"
  Visual: a 5-stage pipeline:
  1. Eval set (golden + adversarial + regression).
  2. Per-trace step grading (covered in 13.40).
  3. End-to-end LLM-as-Judge (covered in 13.39).
  4. Online sampling + drift signal (covered in 13.41).
  5. Alerting + rollback.
  Annotate which Section 13 chapter handles each stage.
  Key content: "pipeline|stages", "eval set|judge|sampling|alerting", "13\\.39|13\\.40|13\\.41".

- [ ] **Step 1: Write content tests**

```js
describe("WhyEvalAgents (13.37) content", () => {
  const fn = AgentEvals.WhyEvalAgents;

  it("sub=0 lists three reasons agents are harder", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/non.?determin/i);
    expect(container.textContent).toMatch(/multi.?step/i);
    expect(container.textContent).toMatch(/silent/i);
  });

  it("sub=1 shows production incident stories", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/production|incident/i);
    expect(container.textContent).toMatch(/unauthorized|wrong|leak|drift/i);
  });

  it("sub=2 contrasts offline and online", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/offline/i);
    expect(container.textContent).toMatch(/online/i);
    expect(container.textContent).toMatch(/golden|sample|production/i);
  });

  it("sub=3 lists what humans must review", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/human/i);
    expect(container.textContent).toMatch(/tone|hallucin|drift/i);
  });

  it("sub=4 previews the eval pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/pipeline|stages/i);
    expect(container.textContent).toMatch(/13\.(39|40|41)/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyEvalAgents"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WhyEvalAgents chapter**

Replace the stub export in `src/sections/agent-evals.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.red`, `C.orange`, `C.yellow`, `C.amber`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Three Reasons Agents Are Harder To Eval", "What Breaks When You Don't Eval", "Offline (Before Ship) vs Online (After Ship)", "Some Failure Modes Need Humans", "What A Full Pipeline Looks Like".
- The 3-reason card grid (sub=0) and the production-incident card grid (sub=1) use tinted cards. The pipeline-stages visualization (sub=4) is an SVG centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Each pipeline stage in sub=4 must back-reference its later chapter (Stage 2 -> 13.40, Stage 3 -> 13.39, Stage 4 -> 13.41).
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Production incidents reference unauthorized refunds, hallucinated policy, drift, data leak.
- Standalone artifacts centered.
- No forward references except the within-section signposts to 13.39/13.40/13.41; no carry-over brand names.

Follow the spec's chapter 13.37 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyEvalAgents"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 8: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-evals.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.37 Why Eval Agents Differently"
```

---

## Task 7: Implement Chapter 13.38 EvalDimensions

**Files:**
- Modify: `src/sections/agent-evals.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Four eval axes - correctness (did the task complete properly?), latency (how long did it take?), cost (how much did it consume?), safety (did the agent refuse what it should and escalate what it must?). Show each axis with a metric, a target zone, and a customer-support example. End with a composite scoring formula.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.red) - Four axes**
  Title: "Correctness, Latency, Cost, Safety"
  Visual: a 4-axis radar chart with all 4 axes labeled and a target zone (green inner area) highlighted. A sample agent run plotted shows where it sits on each axis.
  Key content: "correctness", "latency", "cost", "safety", "radar|axis|4".

- **sub=1 (C.orange) - Correctness**
  Title: "Did The Task Complete?"
  Visual: a binary card. Definition: "Task completed = the user's stated goal was achieved AND no incorrect side effects happened." Metric: resolution rate. Target: > 90%. Example: ticket T2 -> password reset email sent + email updated correctly -> CORRECT.
  Key content: "correctness|complete", "resolution rate|90%", "T2|ticket".

- **sub=2 (C.yellow) - Latency**
  Title: "How Long Did It Take?"
  Visual: histogram of trace durations. P50, P95, P99 marked. Target: P95 < 8s for support tickets. Show the latency budget breakdown (LLM calls + tool calls).
  Key content: "latency", "P50|P95|P99", "8s|target".

- **sub=3 (C.amber) - Cost**
  Title: "How Much Did Each Trace Consume?"
  Visual: a bar showing cost breakdown per trace. Input tokens + output tokens + tool call costs. Target: < $0.50 per support ticket. Annotate that runaway iterations are the #1 source of cost overshoots.
  Key content: "cost", "tokens", "0\\.50|target", "runaway|iteration".

- **sub=4 (C.purple) - Safety**
  Title: "Did The Agent Refuse What It Should?"
  Visual: 4-row table of safety metrics:
  - Refusal rate on prohibited actions (target: > 99%).
  - False refusal rate (target: < 1%).
  - Escalation rate when refund > $200 (target: 100%).
  - Prompt-injection detection rate (target: > 95%).
  Key content: "safety|refusal", "escalation|prohibited", "prompt.?injection", "99%|95%".

- **sub=5 (C.red) - Composite scoring**
  Title: "One Number For The Dashboard"
  Visual: a formula box (centered):
  ```
  trace_score = 0.5 * correctness + 0.2 * latency_score + 0.2 * cost_score + 0.1 * safety_score
  ```
  Where each component is normalized 0-1. Annotate the weights are tunable per use case. Add a target: composite > 0.85.
  Key content: "composite|formula|score", "0\\.5|0\\.2|0\\.1", "tunable|target", "0\\.85".

- [ ] **Step 1: Write content tests**

```js
describe("EvalDimensions (13.38) content", () => {
  const fn = AgentEvals.EvalDimensions;

  it("sub=0 names four axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/safety/i);
  });

  it("sub=1 defines correctness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/correctness|complete/i);
    expect(container.textContent).toMatch(/resolution rate|90%/i);
  });

  it("sub=2 shows latency percentiles", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/P50|P95|P99/i);
  });

  it("sub=3 shows cost breakdown", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/tokens/i);
    expect(container.textContent).toMatch(/0\.50/);
  });

  it("sub=4 lists safety metrics", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/safety|refusal/i);
    expect(container.textContent).toMatch(/escalation/i);
    expect(container.textContent).toMatch(/prompt.?injection/i);
  });

  it("sub=5 shows the composite formula", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/composite|formula|score/i);
    expect(container.textContent).toMatch(/0\.5|0\.2|0\.1/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EvalDimensions"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full EvalDimensions chapter**

Replace the stub export in `src/sections/agent-evals.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.red`, `C.orange`, `C.yellow`, `C.amber`, `C.purple`, `C.red`.
- Center-aligned titles. Title-case for all diagram box text. "Correctness, Latency, Cost, Safety", "Did The Task Complete?", "How Long Did It Take?", "How Much Did Each Trace Consume?", "Did The Agent Refuse What It Should?", "One Number For The Dashboard".
- The 4-axis radar chart (sub=0) and the latency histogram (sub=2) and the cost breakdown bar (sub=3) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The composite-score formula in sub=5 renders centered (`textAlign: "center"` on its container div) as a monospace formula box.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. T2 referenced as success example; targets include > 90% resolution, P95 < 8s, < $0.50, > 99% refusal.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.38 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EvalDimensions"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 8: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-evals.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.38 Eval Dimensions"
```

---

## Task 8: Implement Chapter 13.39 LlmAsJudge

**Files:**
- Modify: `src/sections/agent-evals.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** LLM-as-Judge: use an LLM to grade other LLMs' (or agents') outputs. Show pairwise vs scalar scoring, rubric design, the three big biases (length, position, self-preference), and calibration against human annotations. End with a canonical judge prompt artifact. Back-reference Section 12.32 where the technique was first introduced.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.red) - Pairwise vs scalar**
  Title: "Two Ways To Grade"
  Visual: 2-column comparison.
  - Pairwise: judge sees A and B answers, picks which is better. Good for ranking models.
  - Scalar: judge scores one answer 0-10 with reasoning. Good for absolute quality and dashboards.
  Most production setups use scalar.
  Key content: "pairwise|scalar", "0.10|0 to 10", "ranking|absolute".

- **sub=1 (C.orange) - Rubric design**
  Title: "Tell The Judge What To Score On"
  Visual: a 5-criterion rubric card for support-agent answers:
  - Correctness (0-3): the answer matches the policy / KB.
  - Completeness (0-2): the answer addresses all parts of the question.
  - Tone (0-2): friendly + professional, no condescension.
  - Citations (0-2): policy references included when applicable.
  - Escalation (0-1): correctly escalated if outside scope.
  Total: 10. Annotate that explicit criteria + scoring guides reduce judge variance.
  Key content: "rubric|criteria", "correctness|completeness|tone|citation|escalation", "0.3|0.2|0.1".

- **sub=2 (C.yellow) - Three big biases**
  Title: "What The Judge Gets Wrong"
  Visual: 3-card grid:
  - Length bias: longer answers get higher scores even when content is the same.
  - Position bias: in pairwise, the FIRST answer is favored 5-10% of the time.
  - Self-preference: judges using model X rate model X higher than other models.
  Each card with a 1-line mitigation (length normalization, position randomization, judge-model diversity).
  Key content: "length bias|position bias|self.?preference", "mitigat|normaliz|random|divers".

- **sub=3 (C.amber) - Calibration with humans**
  Title: "Trust But Verify"
  Visual: a scatter plot. X-axis: judge score. Y-axis: human score. Diagonal = perfect agreement. Points cluster near diagonal but with noise. Annotate: "Sample 50-100 traces, have a human grade, compute correlation. Re-tune judge prompt until correlation > 0.7."
  Key content: "calibrat|human", "scatter|correlation", "0\\.7|50.100".

- **sub=4 (C.purple) - Judge prompt artifact**
  Title: "Canonical Judge Prompt"
  Visual: a styled mono artifact labeled "Eval Rubric (shape) - Customer Support Judge":
  ```
  System: You are an evaluator for a customer-support agent.
  Score the agent's response on this rubric (total 10):
    - Correctness (0-3): ...
    - Completeness (0-2): ...
    - Tone (0-2): ...
    - Citations (0-2): ...
    - Escalation (0-1): ...
  Output ONLY this JSON: {"correctness": N, "completeness": N, "tone": N, "citations": N, "escalation": N, "reasoning": "..."}
  ```
  Highlight that explicit JSON output makes the score machine-readable for dashboards.
  Key content: "eval rubric|judge prompt", "JSON|machine.?readable", "correctness|completeness".

- **sub=5 (C.red) - Back-reference Section 12.32**
  Title: "Same Technique, Agent Scope"
  Visual: a closing card. Section 12.32 used LLM-as-Judge for RAG generation quality (faithfulness, answer-relevance). Section 13 extends the same technique to agent-level evals (full task completion, multi-step trace correctness). The mechanics are identical; the rubric is different.
  Key content: "12\\.32|section 12", "faithfulness|answer.relevance|RAG", "same|extend".

- [ ] **Step 1: Write content tests**

```js
describe("LlmAsJudge (13.39) content", () => {
  const fn = AgentEvals.LlmAsJudge;

  it("sub=0 contrasts pairwise and scalar", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pairwise/i);
    expect(container.textContent).toMatch(/scalar/i);
  });

  it("sub=1 shows the rubric", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rubric|criteria/i);
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/completeness/i);
    expect(container.textContent).toMatch(/tone/i);
  });

  it("sub=2 lists three biases", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/length bias/i);
    expect(container.textContent).toMatch(/position bias/i);
    expect(container.textContent).toMatch(/self.?preference/i);
  });

  it("sub=3 shows calibration with humans", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/calibrat|human/i);
    expect(container.textContent).toMatch(/correlation|0\.7/);
  });

  it("sub=4 shows the judge prompt artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/judge|eval rubric/i);
    expect(container.textContent).toMatch(/JSON|machine.?readable/i);
  });

  it("sub=5 back-references Section 12.32", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/12\.32|section 12/i);
    expect(container.textContent).toMatch(/RAG|faithfulness|answer.relevance/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LlmAsJudge"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full LlmAsJudge chapter**

Replace the stub export in `src/sections/agent-evals.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.red`, `C.orange`, `C.yellow`, `C.amber`, `C.purple`, `C.red`.
- Center-aligned titles. Title-case for all diagram box text. "Two Ways To Grade", "Tell The Judge What To Score On", "What The Judge Gets Wrong", "Trust But Verify", "Canonical Judge Prompt", "Same Technique, Agent Scope".
- The calibration scatter plot (sub=3) is an SVG centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The judge-prompt artifact in sub=4 renders as styled mono-text labeled "Eval Rubric (shape) - Customer Support Judge": tinted background `${C.purple}06`, border `1px solid ${C.purple}12`, monospace 14-16px, centered. NOT a code block. This artifact is the canonical rubric reused in 13.40 trace evals; lock the field names.
- The chapter must back-reference Section 12.32 (LLM-as-Judge for RAG) in sub=5 using the format: "Section 12.32 used LLM-as-Judge for RAG generation quality - here we extend to agent-level evals."
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Rubric criteria: correctness (0-3), completeness (0-2), tone (0-2), citations (0-2), escalation (0-1).
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.39 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LlmAsJudge"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 8: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-evals.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.39 LLM-as-Judge"
```

---

## Task 9: Implement Chapter 13.40 TraceEvals

**Files:**
- Modify: `src/sections/agent-evals.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Trace evals grade each STEP of an agent run, not just the final answer. Show the trace tree visual with per-step grades, locate-the-failing-step diagnosis, and a sample T4 trace with one step failing.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - Trace as a tree of steps**
  Title: "Every Step Gets A Grade"
  Visual: a vertical step list for ticket T2 (reset password + email changed):
  - Step 1: classify intent -> correct (✓)
  - Step 2: lookup_customer -> correct (✓)
  - Step 3: change_email -> correct (✓)
  - Step 4: reset_password -> correct (✓)
  - Step 5: final answer -> correct (✓)
  All ✓. Annotate: "Trace eval grades EACH step, not just the final."
  Key content: "trace|step|grade", "T2|ticket t2", "intent|lookup_customer|change_email|reset_password".

- **sub=1 (C.orange) - Locating the failing step**
  Title: "When A Step Fails, Where?"
  Visual: a similar trace for ticket T4 (cancel + refund) but with one step failing:
  - Step 1: classify intent -> ✓
  - Step 2: lookup_customer -> ✓
  - Step 3: lookup_subscription -> ✓
  - Step 4: process_refund -> FAILED (judge: "business_rule fired correctly but agent forgot to escalate")
  - Step 5: respond to user -> WRONG (judge: "told user refund was processed, but it wasn't")
  Diagnostic insight: Step 4 made the right tool call but the agent didn't ADAPT. Step 5 then lied. Trace eval surfaces both failures.
  Key content: "T4|ticket t4", "process_refund", "FAILED|wrong", "didn't.*escalate|adapt", "lied|told user".

- **sub=2 (C.yellow) - Per-step rubric**
  Title: "What To Score Per Step"
  Visual: a 4-criterion per-step rubric:
  - Tool choice (right tool for the step?).
  - Tool input (right args?).
  - Result handling (model interpreted the result correctly?).
  - Next-step planning (did this step's outcome inform a good next step?).
  Sample scores from T4's step 4: tool choice ✓, tool input ✓, result handling ✗, next-step planning ✗.
  Key content: "tool choice|tool input|result handling|next.?step planning", "rubric|score".

- **sub=3 (C.amber) - Trace eval artifact**
  Title: "Trace Eval Record (Shape)"
  Visual: a styled mono artifact:
  ```
  {
    "trace_id": "tr-8492",
    "ticket": "T4",
    "steps": [
      { "step": 1, "tool": "classify", "scores": {"choice": 1, "input": 1, "result": 1, "next": 1} },
      { "step": 2, "tool": "lookup_customer", "scores": {"choice": 1, "input": 1, "result": 1, "next": 1} },
      { "step": 3, "tool": "lookup_subscription", "scores": {"choice": 1, "input": 1, "result": 1, "next": 1} },
      { "step": 4, "tool": "process_refund", "scores": {"choice": 1, "input": 1, "result": 0, "next": 0}, "failure_mode": "missed_escalation" },
      { "step": 5, "tool": "respond", "scores": {"choice": 0, "input": 0, "result": 0, "next": 0}, "failure_mode": "false_assertion" }
    ],
    "overall_grade": "failed_at_step_4_propagated_to_step_5"
  }
  ```
  Key content: "trace_id|steps", "failure_mode|missed_escalation|false_assertion", "overall_grade".

- **sub=4 (C.purple) - Trace eval cost**
  Title: "Per-Step Grading Is N x Expensive"
  Visual: a cost comparison. End-to-end eval (single judge call): 1x cost. Trace eval (N judge calls per step): N x cost. For an 8-step trace, trace eval costs 8x. Production rule: trace eval on a 5% sample of production traffic; end-to-end LLM-as-Judge on the rest.
  Key content: "cost|N times|8x", "5%|sample|production", "end.?to.?end|judge".

- [ ] **Step 1: Write content tests**

```js
describe("TraceEvals (13.40) content", () => {
  const fn = AgentEvals.TraceEvals;

  it("sub=0 shows trace as tree of steps", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|step|grade/i);
    expect(container.textContent).toMatch(/T2|ticket t2/i);
  });

  it("sub=1 locates the failing step in T4", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/FAILED|wrong/i);
  });

  it("sub=2 shows per-step rubric", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool choice|tool input/i);
    expect(container.textContent).toMatch(/result handling/i);
    expect(container.textContent).toMatch(/next.?step planning/i);
  });

  it("sub=3 shows the trace eval record shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/trace_id|steps/i);
    expect(container.textContent).toMatch(/failure_mode|missed_escalation/i);
  });

  it("sub=4 shows the cost of per-step grading", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|N times|8x/i);
    expect(container.textContent).toMatch(/5%|sample/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "TraceEvals"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full TraceEvals chapter**

Replace the stub export in `src/sections/agent-evals.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.red`, `C.orange`, `C.yellow`, `C.amber`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Every Step Gets A Grade", "When A Step Fails, Where?", "What To Score Per Step", "Trace Eval Record (Shape)", "Per-Step Grading Is N x Expensive".
- The T2 success trace (sub=0) and T4 failure trace (sub=1) use stacked step cards with check / fail indicators. The cost-comparison bar in sub=4 is an SVG with `<desc>` + `svg-descriptions.json`.
- The trace-eval-record artifact in sub=3 renders as styled mono-text labeled "Trace Eval Record": tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- This chapter teaches production teams how to LOCATE failures. Content must be unambiguous; re-read after writing.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. T4 failure trace identifies process_refund step + missed_escalation + false_assertion in the response step.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.40 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "TraceEvals"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 8: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-evals.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.40 Trace Evals"
```

---

## Task 10: Implement Chapter 13.41 EvalSetsContinuous

**Files:**
- Modify: `src/sections/agent-evals.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Close Act 7. An eval set is the static portfolio of test cases. Continuous eval samples live traffic and grades it. Show eval set composition (golden + adversarial + regression), how to maintain freshness, and the production sampling + drift signal flow.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.red) - Three eval set ingredients**
  Title: "Golden + Adversarial + Regression"
  Visual: 3 stacked card decks.
  - Golden (50 cases): typical, well-defined tickets. Used for regression.
  - Adversarial (20 cases): edge cases, prompt-injection attempts, ambiguous wording, multi-intent. Used to catch what golden misses.
  - Regression (10 cases): past bugs. Each new bug discovered adds a case here permanently.
  Key content: "golden|adversarial|regression", "50|20|10|cases|deck".

- **sub=1 (C.orange) - Freshness**
  Title: "Eval Set Goes Stale"
  Visual: a timeline. Eval set frozen at month 0. By month 3, real traffic distribution has shifted - new product features, new customer types, new attack patterns. Eval set quality drops; passing eval no longer predicts production success.
  Mitigation: refresh 10-20% of cases per quarter from recent production traces.
  Key content: "stale|fresh", "month|quarter|10.20%", "shift|distribution".

- **sub=2 (C.yellow) - Online sampling**
  Title: "Grade A Slice Of Production"
  Visual: a flow. Production traffic -> 1-5% sample -> async LLM-as-Judge grading -> result stored with trace -> dashboard. Annotate: "Sampling rate is a cost / detection tradeoff. 1% is cheap but slow to surface issues. 5% catches issues in hours but costs 5x."
  Key content: "online|sample|production", "1.5%|sampling rate", "cost|detection", "dashboard|async".

- **sub=3 (C.amber) - Drift signal detection**
  Title: "Trigger When Quality Drops"
  Visual: a time-series chart. Y-axis: composite trace score. X-axis: time (days). Score hovers around 0.85; on day 10 it dips to 0.78. Drift detector fires alert. Engineer investigates, finds the LLM provider rolled a model update overnight.
  Production rule: alert if 7-day moving average drops > 0.05 from baseline.
  Key content: "drift|signal|alert", "moving average|baseline", "0\\.05|0\\.85", "investigat".

- **sub=4 (C.purple) - Closer: ship eval before you ship agent**
  Title: "Build The Eval Set Before The Agent"
  Visual: a closing principle card:
  "If you can't write 20 test cases your agent must pass, you don't know what your agent is supposed to do. Build the eval set FIRST. Build the agent SECOND."
  Annotate: this is the Section 13 take. Production teams that skip eval ship more agents and watch more of them fail.
  Key content: "ship eval|eval first|before|production", "20 test cases", "closer|principle".

- [ ] **Step 1: Write content tests**

```js
describe("EvalSetsContinuous (13.41) content", () => {
  const fn = AgentEvals.EvalSetsContinuous;

  it("sub=0 lists golden / adversarial / regression", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/adversarial/i);
    expect(container.textContent).toMatch(/regression/i);
  });

  it("sub=1 explains eval-set freshness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stale|fresh/i);
    expect(container.textContent).toMatch(/quarter|month|10.20%/i);
  });

  it("sub=2 shows online sampling", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/online|sample/i);
    expect(container.textContent).toMatch(/1.5%|sampling/);
  });

  it("sub=3 shows drift detection", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/drift|signal|alert/i);
    expect(container.textContent).toMatch(/moving average|baseline/i);
  });

  it("sub=4 closes with eval-first principle", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/eval first|ship eval|before/i);
    expect(container.textContent).toMatch(/20 test cases/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EvalSetsContinuous"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full EvalSetsContinuous chapter**

Replace the stub export in `src/sections/agent-evals.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.red`, `C.orange`, `C.yellow`, `C.amber`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Golden + Adversarial + Regression", "Eval Set Goes Stale", "Grade A Slice Of Production", "Trigger When Quality Drops", "Build The Eval Set Before The Agent".
- The 3 stacked card decks in sub=0 (golden / adversarial / regression). The freshness timeline in sub=1 and the online-sampling flow in sub=2 and the drift time-series chart in sub=3 each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- This chapter closes Act 7. The closing principle in sub=4 ("ship eval before agent") is the Section 13 take on production eval discipline.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Numbers include 50 golden + 20 adversarial + 10 regression cases; 1-5% sampling rate; 0.05 drift threshold; 7-day moving average baseline.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.41 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EvalSetsContinuous"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 8: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-evals.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.41 Eval Sets + Continuous Eval"
```

---

## Task 11: Update CLAUDE.md for Section 13 Act 7

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** Only `CLAUDE.md`.

- [ ] **Step 1: Append 5 rows to Section 13 mapping table**

```markdown
| 13.37 | WhyEvalAgents | Why Eval Agents Differently |
| 13.38 | EvalDimensions | Eval Dimensions |
| 13.39 | LlmAsJudge | LLM-as-Judge |
| 13.40 | TraceEvals | Trace Evals |
| 13.41 | EvalSetsContinuous | Eval Sets + Continuous Eval |
```

Update section heading: "Milestones 1-4 of 6 complete: Acts 1-7".

- [ ] **Step 2: Project structure**

```
│       ├── agent-evals.jsx             # Section 13 (Act 7, chapters 13.37-13.41)
```

- [ ] **Step 3: Smoke gate + commit**

```bash
npm run test
git add CLAUDE.md
git commit -m "Document Section 13 Act 7 in CLAUDE.md mapping"
```

---

## Task 12: Chrome browser visual validation of all 5 new chapters

**Files:**
- Modify: `src/data/svg-descriptions.json` (only if new SVGs added during Tasks 6-10).
- Possibly modify section files (`src/sections/agent-evals.jsx`) if visual defects are found.

**Scope binding:** Per-defect-fix this task may modify individual section files. Group fixes by chapter and commit per chapter. `git diff --stat` before each commit.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

Expected: dev server on `http://localhost:5173/learn-ai/`.

- [ ] **Step 2: For each chapter 13.37 through 13.41, navigate and screenshot**

For each chapter:

1. Use `mcp__claude-in-chrome__tabs_create_mcp` (or similar) to open a tab.
2. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch: <id>, sub: 20, fingerprint: <current>})` to force all sub-steps to reveal.
3. Take a screenshot.
4. Verify the per-chapter checklist (below) by inspection + the overlap-detection snippet.

Per-chapter checklist:

- No overlapping elements anywhere on the page.
- Every diagram is centered horizontally + vertically within its container.
- Every diagram-box label is title-case ("LLM-as-Judge" not "llm-as-judge").
- Every line of text starts with a capital letter.
- Every Box has a real color (no `C.card`).
- Every standalone formula / artifact is centered.
- Every SVG has a `<desc>` child as its first element.
- Body text is 16-19px, titles 22px.
- Eval rubric artifacts in 13.39 render as styled mono-text, NOT as code blocks.

- [ ] **Step 3: Save screenshots**

Save the 5 screenshots to `docs/superpowers/screenshots/section-13-m4/` (create directory if not present).

- [ ] **Step 4: Run edge-crossing check (where applicable)**

For SVGs that draw edges between nodes (the 4-axis radar chart in 13.38, the trace tree in 13.40, the drift time-series chart in 13.41, and any pipeline diagrams in 13.37 / 13.41), run the `countCrossings` snippet from `.claude/skills/check-visuals/SKILL.md` in the browser console. Expected: 0 crossings unless inherent to the concept.

- [ ] **Step 5: For each violation found**

Fix the section file directly. Group fixes by chapter and commit per chapter:

```bash
git add src/sections/agent-evals.jsx
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

If new SVG `<desc>` entries need to be added to `src/data/svg-descriptions.json`, include those in the same commit as the file's last visual fix, or commit separately:

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for Section 13 Act 7 diagrams"
```

- [ ] **Step 6: Final visual sweep**

After all defects fixed, walk through all 5 chapters once more and confirm clean. No silent skips. The eval rubric artifact in 13.39 (the canonical judge rubric reused in 13.40) MUST render unambiguously as a non-code block.

---

## Task 13: Final M4 verification

**Files:** none (run commands only).

**Scope binding:** No files modified.

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 2: Run coverage check**

```bash
npx vitest run --coverage
```

Expected: 100% line coverage, branches >= 97.7%. Investigate any drop.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Format check**

```bash
npm run format -- --check
```

Expected: no formatting issues.

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Grep for forbidden patterns**

```bash
# em-dashes
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx && echo "FAIL: em-dash found" || echo "em-dash clean"

# C.card boxes
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx && echo "FAIL: C.card found" || echo "C.card clean"

# carry-over brand (any vendor-shaped domain other than example.com / example.org)
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain found" || echo "domain clean"

# "architect" word in titles
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx && echo "FAIL: 'architect' word found" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 7: Verify Section 13 in TOC shows 41 chapters (M1 + M2 + M3 + M4)**

Navigate to the running app's TOC. Open Section 13. Confirm all 41 chapters (13.1 through 13.41) are listed.

- [ ] **Step 8: No commit.** This task only verifies.

---

## Task 14: Plan Refinement Checkpoint for M5

**Files:**
- Create: `docs/superpowers/lessons/section-13-m4-lessons.md`
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-13-milestone-5.md`
- Create: `docs/superpowers/starter-prompts/section-13-m5-starter.md`

- [ ] **Step 1: Capture M4 lessons (3-5 bullets)**:
  - Did the radar chart render cleanly?
  - Did the trace eval failure trace land as clearly as expected?
  - Was the judge prompt artifact distinguishable from a code block?
  - Did the closing "build the eval set first" principle land or feel preachy?

- [ ] **Step 2-3: Read M5 plan with M4 lessons in mind; edit inline if warranted.**

- [ ] **Step 4: Smoke gate.**

- [ ] **Step 5: Scope verification.**

- [ ] **Step 6: Commit lessons + plan edits.**

- [ ] **Step 7: Generate M5 starter prompt**

Create `docs/superpowers/starter-prompts/section-13-m5-starter.md`:

````markdown
# M5 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 5 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-5.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m4-lessons.md AND m3 AND m2 AND m1 (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section13-milestone5"
- After M5 ships, execute the final refinement task before starting M6

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
````

Commit:

```bash
git add docs/superpowers/starter-prompts/section-13-m5-starter.md
git commit -m "Add M5 starter prompt for next session"
```

- [ ] **Step 8: M4 complete.**

---

## Notes for next session executor

Before pasting M5 starter prompt:
- Review M1-M4 lessons files.
- Confirm `git log` shows all M4 commits on main.
- Verify `npm run test` green.

## What Comes Next

Milestone 5 covers Section 13 Act 8 Production Hardening: 6 chapters (13.42-13.47). Observability, cost, latency, guardrails, prompt injection, tool security. The "operate the agent" milestone.

## Self-Review Notes

- Act 7 has 5 chapters - smallest milestone in Section 13. Use the lighter pace to over-invest in Chrome validation quality.
- Eval rubric artifact (13.39 sub=4) is one of the most-reused canonical artifacts in the section. The same rubric appears as the input to many later trace examples. Lock the field names firmly.
- Trace eval failure example for T4 (13.40 sub=1) MUST be unambiguous - it's the chapter where production teams diagnose where their agents break. Re-read after writing.
- Cross-section back-references in 13.39 sub=5 (Section 12.32) and 13.41 sub=0 (Section 11 vector DB substrate via prior episodic memory chapters) must be accurate; verify chapter numbers and titles before committing.
