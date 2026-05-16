# Section 13 Milestone 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use `- [ ]` checkboxes.
>
> **Strict scope rule for subagents:** Subagent prompts MUST include verbatim Files: list, "modify ONLY files in the Files: list", and "run `git diff --stat` before committing; abort if any file outside the list shows as modified". Scope violations rejected.
>
> **Two-stage review per task:** Stage 1 SCOPE; Stage 2 CORRECTNESS.

**Goal:** Add Section 13 Act 9 Frameworks + Decision (5 chapters), shipping the FINAL chapters of Section 13. 13.48 LangGraphFramework, 13.49 CrewAiAutoGen, 13.50 VendorSdks, 13.51 CustomNoFramework, 13.52 AgentDecisionFramework. The app ships at end of M6 with Section 13 having all 52 chapters complete. Section 13 is DONE.

**Architecture:** Extend the existing `src/sections/agent-production.jsx` (M5 added Act 8; M6 adds Act 9). No new files. The Section 13 loader stays at 6-file Promise.all (no changes to learn-ai.jsx). All chapter content follows CLAUDE.md visual rules + Section 13 spec rules. The final chapter 13.52 is the SECTION CAPSTONE that synthesizes every decision from Acts 1-8 into one decision framework and walks through designing a production agent for a new use case.

**Tech Stack:** React 18, Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`

**Branch policy:** Direct on `main`.

**Special note:** This is the FINAL milestone of Section 13. The last task is a section-ship checklist (CLAUDE.md final update, discoverability sync confirmation, re-indexing reminders) instead of a starter-prompt-for-next-milestone task. There is no Section 13 Milestone 7.

---

## Prerequisites

- M1-M5 complete: chapters 13.1-13.47 implemented, tests green, Chrome-validated.
- M5 lessons captured. READ BEFORE STARTING M6.

## File Structure

### Modified files

- `src/sections/agent-production.jsx` - extend with 5 new exports for Act 9 (LangGraphFramework, CrewAiAutoGen, VendorSdks, CustomNoFramework, AgentDecisionFramework). M5 already wrote the Act 8 exports.
- `src/config.js` - add 5 entries (13.48-13.52).
- `src/__tests__/sections.test.jsx`, `lookup.test.js`, `config.test.js` - tests for new exports.
- `src/data/svg-descriptions.json` - new SVG entries.
- `CLAUDE.md` - mapping table rows + project structure tree updated to "all 52 chapters complete".

### Unchanged

`src/learn-ai.jsx` (the 6-file Promise.all loader already includes `agent-production.jsx`).
`public/llms.txt`, `index.html` (no new top-level topics).
All earlier section files.

### No new files

---

## Standard running-example values (reference)

(Re-stated.)

- Customer-support agent on customer support KB.
- 8-tool inventory + 5 tickets + Alice / `alice@example.com` / `c-9924`.
- Agent constants per spec.
- **Per-act Box colors (M6):**
  - Act 9 (Frameworks & Decision): teal family (matches section color #00838f) - sub-step rotation `C.teal` -> `C.cyan` -> `C.purple` -> `C.green` -> `C.amber` -> `C.teal`.

---

## Visual rules - MANDATORY (re-stated)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves. M6 is the capstone milestone; the closing visuals demand extra rigor.

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 11). The decision-stack visual in 13.52 (CAPSTONE) is especially sensitive to overlap defects.
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "LangGraph Pattern" not "langgraph pattern". Exceptions: lowercase brand names (pgvector, numpy, npm), variable identifiers (`q_vec`), parameter syntax (`temperature = 0.7`), JSON keys in artifact blocks (`"name"`, `"description"`), tokens like `[CLS]`.
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas / artifacts centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`, `C.teal`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content. Still applies in M6 - this is the capstone where it's most tempting to slip ("architect" of the decision framework is exactly the trap).
10. **No em-dashes** anywhere in content. Stop hook `.claude/scripts/check-sections.sh` flags violations.
11. **No next-chapter hints** - the section is closing in M6; no forward references AT ALL. Within-section back-references to earlier chapters (e.g., "covered in 13.5") are encouraged for the capstone synthesis.
12. **No carry-over brand names** - corpus = "customer support knowledge base"; URLs = `docs.example.com`; never reintroduce a fictional company name. The IT-support capstone use case in 13.52 introduces a "500-person company" framing that uses NO specific brand.
13. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".
14. **Artifact treatment** (Section-13-specific) - framework code patterns (LangGraph nodes/edges, CrewAI Agent definitions, AutoGen GroupChat, vendor SDK loop/handoff primitives, custom-loop pseudocode) render as styled monospace text blocks with tinted background (`${color}06`), soft border (`1px solid ${color}12`), monospace 14-16px font. Labeled "Framework Pattern (shape) - LangGraph" / "Framework Pattern (shape) - CrewAI" / "Framework Pattern (shape) - Custom Loop". NEVER as executable code. NEVER include language fences with executable framing. Framework comparison stays at "what it does + when it fits" - NO pricing, NO quarter-specific feature comparison.

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 13 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### No new section file in M6:

M6 extends the existing `src/sections/agent-production.jsx` (added in M5) with 5 new exports for Act 9. The `AgentProduction` namespace is ALREADY imported in `lookup.test.js` and `sections.test.jsx` (M5 did this). M6 only needs to:

- Add presence tests for the 5 NEW Act 9 exports (`LangGraphFramework`, `CrewAiAutoGen`, `VendorSdks`, `CustomNoFramework`, `AgentDecisionFramework`) to `lookup.test.js`. The existing `...AgentProduction` spread will pick them up automatically.
- NOT change `sections.test.jsx` lookup imports - they're already in place.
- NOT change `learn-ai.jsx` - the loader already includes `agent-production.jsx` (added in M5).

### When adding chapters to `chapters[]` (Act 9 chapters in M6):

- `src/__tests__/config.test.js` - add a "Section 13 Act 9 chapters" describe block testing the specific new entries (13.48-13.52).
- The relevant section file (`agent-production.jsx`) must already export each new `component` (M6 Task 2 adds them as stubs first).
- If new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

No change in M6. The loader already imports `agent-production.jsx`; adding exports to that file is picked up automatically.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

1. Task 0 - Name session.
2. Task 1 - Baseline.
3. Task 2 - Extend `agent-production.jsx` with 5 Act 9 stubs.
4. Task 3 - Add 13.48-13.52 entries to `chapters[]`.
5. Task 4 - Add presence tests for Act 9 exports.
6. Tasks 5-9 - Implement 13.48-13.52.
7. Task 10 - Update `CLAUDE.md` mapping table + project structure (final form).
8. Task 11 - Chrome visual validation of all 5 new chapters.
9. Task 12 - Final M6 verification.
10. Task 13 - **Section 13 SHIP checklist** (replaces the per-milestone Plan Refinement Checkpoint).

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history. M6 is the FINAL milestone of Section 13.

- [ ] **Step 1: Set session title to `section13-milestone6`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section13-milestone6` (if your Claude Code build supports it).
- Settings: set the session title via `/config` or the IDE extension's session pane.
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section13-milestone6" so future searches catch it.

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section13-milestone6` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section13-milestone6`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify M5 green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Confirm M1-M5 commits on `main`**

```bash
git log --oneline -70 | head -70
```

Expected: M1-M5 commits visible, ending with the M6 starter prompt commit ("Add M6 starter prompt for next session"). Should include 47 chapter commits (13.1-13.47) plus milestone-boundary docs. If the log doesn't end cleanly, do NOT proceed.

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

Note: M6 is the SECTION CLOSER. After completing this milestone, the section-ship checklist (Task 13) replaces the per-milestone starter-prompt task. Allocate time accordingly.

---

## Task 2: Extend `agent-production.jsx` with 5 Act 9 stubs

**Files:**
- Modify: `src/sections/agent-production.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Append 5 named stub exports**

At the bottom of `src/sections/agent-production.jsx` (after the M5 Act 8 exports):

```jsx
// Section 13 Act 9: Frameworks + Decision
// Chapters 13.48 - 13.52 (final chapters of Section 13)

export const LangGraphFramework = (ctx) => {
  return (
    <div>
      <Box color={C.teal}>
        <T color={C.teal} bold center size={22}>
          LangGraph
        </T>
        <T size={16}>Stub - implemented in Task 5.</T>
      </Box>
    </div>
  );
};

export const CrewAiAutoGen = (ctx) => {
  return (
    <div>
      <Box color={C.teal}>
        <T color={C.teal} bold center size={22}>
          CrewAI / AutoGen
        </T>
        <T size={16}>Stub - implemented in Task 6.</T>
      </Box>
    </div>
  );
};

export const VendorSdks = (ctx) => {
  return (
    <div>
      <Box color={C.teal}>
        <T color={C.teal} bold center size={22}>
          Claude Agent SDK + OpenAI Agents
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const CustomNoFramework = (ctx) => {
  return (
    <div>
      <Box color={C.teal}>
        <T color={C.teal} bold center size={22}>
          Custom / No-Framework
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const AgentDecisionFramework = (ctx) => {
  return (
    <div>
      <Box color={C.teal}>
        <T color={C.teal} bold center size={22}>
          The Complete Agent Decision Framework
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/sections/agent-production.jsx
git commit -m "Extend agent-production.jsx with 5 stub exports for Section 13 Act 9"
```

---

## Task 3: Add 5 chapter entries (13.48-13.52)

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

**Scope binding:** Only these two.

- [ ] **Step 1: Failing tests**

```js
describe("Section 13 Act 9 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.48 LangGraphFramework", () => {
    const c = findCh("13.48");
    expect(c).toBeDefined();
    expect(c.title).toBe("LangGraph");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LangGraphFramework");
  });

  it("has 13.49 CrewAiAutoGen", () => {
    const c = findCh("13.49");
    expect(c).toBeDefined();
    expect(c.title).toBe("CrewAI / AutoGen");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CrewAiAutoGen");
  });

  it("has 13.50 VendorSdks", () => {
    const c = findCh("13.50");
    expect(c).toBeDefined();
    expect(c.title).toBe("Claude Agent SDK + OpenAI Agents");
    expect(c.section).toBe(13);
    expect(c.component).toBe("VendorSdks");
  });

  it("has 13.51 CustomNoFramework", () => {
    const c = findCh("13.51");
    expect(c).toBeDefined();
    expect(c.title).toBe("Custom / No-Framework");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CustomNoFramework");
  });

  it("has 13.52 AgentDecisionFramework", () => {
    const c = findCh("13.52");
    expect(c).toBeDefined();
    expect(c.title).toBe("The Complete Agent Decision Framework");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentDecisionFramework");
  });
});
```

- [ ] **Step 2: Append 5 entries to `chapters[]`**

```js
{ id: "13.48", title: "LangGraph", section: 13, component: "LangGraphFramework" },
{ id: "13.49", title: "CrewAI / AutoGen", section: 13, component: "CrewAiAutoGen" },
{ id: "13.50", title: "Claude Agent SDK + OpenAI Agents", section: 13, component: "VendorSdks" },
{ id: "13.51", title: "Custom / No-Framework", section: 13, component: "CustomNoFramework" },
{ id: "13.52", title: "The Complete Agent Decision Framework", section: 13, component: "AgentDecisionFramework" },
```

- [ ] **Step 3-5: Verify pass; smoke gate; commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 13.48-13.52 to config for Section 13 Act 9"
```

---

## Task 4: Add presence tests for Act 9 exports

**Files:**
- Modify: `src/__tests__/lookup.test.js`

**Scope binding:** Only this file.

- [ ] **Step 1: Append presence tests for Act 9**

```js
describe("Section 13 Act 9 component presence (AgentProduction)", () => {
  it("AgentProduction exports each Act 9 chapter", () => {
    expect(typeof AgentProduction.LangGraphFramework).toBe("function");
    expect(typeof AgentProduction.CrewAiAutoGen).toBe("function");
    expect(typeof AgentProduction.VendorSdks).toBe("function");
    expect(typeof AgentProduction.CustomNoFramework).toBe("function");
    expect(typeof AgentProduction.AgentDecisionFramework).toBe("function");
  });
});
```

(No spread change needed; AgentProduction is already in `lookup` from M5.)

- [ ] **Step 2: Test + commit**

```bash
npm run test
git add src/__tests__/lookup.test.js
git commit -m "Add Act 9 presence tests for AgentProduction exports"
```

---

## Task 5: Implement Chapter 13.48 LangGraphFramework

**Files:**
- Modify: `src/sections/agent-production.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** LangGraph: agents as state machines on top of a graph. Show the node + edge + state model, when LangGraph fits (when you can describe the flow as a graph), and a customer-support example as a LangGraph.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.teal) - State machine + graph model**
  Title: "Agents As Stateful Graphs"
  Visual: a small graph - nodes = steps (classify / lookup / refund / respond), edges = transitions. Each node reads + writes a shared state object. The state flows through the graph along the edges.
  Key content: "state|graph|node|edge", "LangGraph", "shared state".

- **sub=1 (C.cyan) - Node, edge, state**
  Title: "Three Primitives"
  Visual: a styled mono artifact labeled "LangGraph Pattern (shape)":
  ```
  graph.add_node("classify", classify_fn)
  graph.add_node("billing_handler", billing_fn)
  graph.add_node("respond", respond_fn)

  graph.add_edge("classify", "billing_handler", condition=is_billing)
  graph.add_edge("billing_handler", "respond")

  state = { ticket: ..., customer: ..., resolution: ... }
  ```
  Highlight nodes, edges (with conditions), and the shared state object.
  Key content: "add_node|add_edge", "state|ticket|customer", "condition|is_billing".

- **sub=2 (C.purple) - Conditional edges**
  Title: "Branching Based On State"
  Visual: a router-style branch. After "classify" node, conditional edges route to billing_handler / troubleshooting_handler / escalation_handler based on `state.intent`. Drawn as a tree with the conditional logic shown on each edge.
  Key content: "conditional|branch", "route|intent", "billing|troubleshooting|escalation".

- **sub=3 (C.green) - Checkpoints and replay**
  Title: "Persistent State Between Calls"
  Visual: a 3-step sequence. Step 1: agent runs partially, hits a tool call. Step 2: state is checkpointed (LangGraph default). Step 3: tool result arrives async; agent resumes from checkpoint. Crucial for long-running and human-in-the-loop workflows.
  Key content: "checkpoint|persist|resume", "async|long.?running", "human.?in.?the.?loop".

- **sub=4 (C.amber) - When LangGraph fits**
  Title: "Use LangGraph When..."
  Visual: a 4-bullet decision card:
  - You can describe the flow as a directed graph.
  - State needs to survive across LLM/tool calls.
  - You want visualizable, debuggable flow control.
  - You can pay a small abstraction tax for the structure.
  Avoid when: simple one-shot tool use; you just need to call the API directly.
  Key content: "LangGraph|use|fit", "directed graph|state|visualiz", "simple|one.?shot".

- [ ] **Step 1: Write content tests**

```js
describe("LangGraphFramework (13.48) content", () => {
  const fn = AgentProduction.LangGraphFramework;

  it("sub=0 introduces stateful graph model", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/state|graph/i);
    expect(container.textContent).toMatch(/LangGraph/);
  });

  it("sub=1 shows node / edge / state shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/add_node|add_edge/);
    expect(container.textContent).toMatch(/state|ticket|customer/i);
  });

  it("sub=2 shows conditional edges", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/conditional|branch/i);
    expect(container.textContent).toMatch(/billing|troubleshooting/i);
  });

  it("sub=3 explains checkpoints", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/checkpoint|persist/i);
    expect(container.textContent).toMatch(/async|long.?running|human.?in.?the.?loop/i);
  });

  it("sub=4 lists when LangGraph fits", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/directed graph|state|visualiz/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LangGraphFramework"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full LangGraphFramework chapter**

Replace the stub export in `src/sections/agent-production.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.teal`, `C.cyan`, `C.purple`, `C.green`, `C.amber`.
- Center-aligned titles. Title-case for all diagram box text. "Agents As Stateful Graphs", "Three Primitives", "Branching Based On State", "Persistent State Between Calls", "Use LangGraph When...".
- The state-graph diagram (sub=0), the routing tree (sub=2), and the checkpointing sequence (sub=3) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The LangGraph pattern artifact in sub=1 renders as styled mono-text labeled "LangGraph Pattern (shape)" - showing `add_node`, `add_edge`, `state` API shape. Tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- Framework comparison stays at "what it does + when it fits" - no pricing, no quarter-specific feature comparison.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.48 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LangGraphFramework"
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
git add src/sections/agent-production.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.48 LangGraph"
```

---

## Task 6: Implement Chapter 13.49 CrewAiAutoGen

**Files:**
- Modify: `src/sections/agent-production.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Two role-based / conversational multi-agent frameworks side-by-side. CrewAI uses role + goal abstractions; AutoGen uses conversation patterns between agents. Show each shape, when each fits, and a customer-support multi-agent example in both.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.teal) - Role-based vs conversational**
  Title: "Two Multi-Agent Styles"
  Visual: 2-column comparison.
  - CrewAI: each agent has a `role`, `goal`, `backstory`, and `tools`. The crew runs tasks against the agents.
  - AutoGen: agents converse with each other (Speaker, Listener); orchestration via conversation patterns.
  Annotate: same problem (multi-agent), two different abstractions.
  Key content: "CrewAI|AutoGen", "role|goal|backstory", "conversation|speaker", "abstraction".

- **sub=1 (C.cyan) - CrewAI shape**
  Title: "CrewAI: Roles + Goals"
  Visual: a styled mono artifact labeled "Framework Pattern (shape) - CrewAI":
  ```
  triage_agent = Agent(
    role="Support Triage Specialist",
    goal="Classify the ticket and route to the right specialist.",
    tools=[classify_intent]
  )
  billing_agent = Agent(
    role="Billing Specialist",
    goal="Resolve billing-related requests including refunds and invoices.",
    tools=[lookup_customer, lookup_subscription, process_refund, escalate_human]
  )
  crew = Crew(agents=[triage_agent, billing_agent], tasks=[handle_ticket_task])
  ```
  Highlight role / goal / tools fields.
  Key content: "CrewAI|Agent|Crew", "role.*Triage|role.*Billing", "goal", "tools".

- **sub=2 (C.purple) - AutoGen shape**
  Title: "AutoGen: Conversational Agents"
  Visual: a styled mono artifact labeled "Framework Pattern (shape) - AutoGen":
  ```
  triage = AssistantAgent(name="triage", system_message="You classify support tickets...")
  billing = AssistantAgent(name="billing", system_message="You handle billing...")
  user_proxy = UserProxyAgent(name="user_proxy")

  manager = GroupChatManager(groupchat=GroupChat(agents=[triage, billing, user_proxy]))
  ```
  Annotate: each agent has a system_message; conversation manager routes messages between them.
  Key content: "AutoGen|AssistantAgent|GroupChat", "system_message", "manager|route".

- **sub=3 (C.green) - Customer support example, both styles**
  Title: "Same Ticket, Two Frameworks"
  Visual: 2 side-by-side traces for ticket T4 (cancel + refund). Left: CrewAI - triage_agent classifies, hands task to billing_agent, billing_agent calls tools + escalates. Right: AutoGen - triage starts conversation, billing joins, escalation joins. Same outcome, different orchestration shape.
  Key content: "T4|ticket t4", "triage|billing|escalation", "CrewAI.*AutoGen|AutoGen.*CrewAI".

- **sub=4 (C.amber) - When each fits**
  Title: "Pick The Abstraction That Matches Your Mental Model"
  Visual: a decision card:
  - Use CrewAI: when you can list distinct roles (Customer Support Engineer, Researcher, Writer, Reviewer) with clear goals.
  - Use AutoGen: when agents need free-form conversation (debate, brainstorm, code review).
  - Skip both: when you have one agent + tools (no second agent needed).
  Annotate: framework choice matters less than agent design quality.
  Key content: "CrewAI.*roles|AutoGen.*conversation", "skip|one agent", "design quality|matters less".

- [ ] **Step 1: Write content tests**

```js
describe("CrewAiAutoGen (13.49) content", () => {
  const fn = AgentProduction.CrewAiAutoGen;

  it("sub=0 contrasts role-based and conversational", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/CrewAI/);
    expect(container.textContent).toMatch(/AutoGen/);
    expect(container.textContent).toMatch(/role|goal|conversation/i);
  });

  it("sub=1 shows CrewAI shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/CrewAI|Agent|Crew/);
    expect(container.textContent).toMatch(/Triage|Billing/);
    expect(container.textContent).toMatch(/role|goal|tools/i);
  });

  it("sub=2 shows AutoGen shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/AutoGen|AssistantAgent|GroupChat/);
    expect(container.textContent).toMatch(/system_message/i);
  });

  it("sub=3 traces T4 in both styles", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage|billing|escalation/i);
  });

  it("sub=4 explains when each fits", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/CrewAI|AutoGen/);
    expect(container.textContent).toMatch(/role|conversation/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CrewAiAutoGen"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full CrewAiAutoGen chapter**

Replace the stub export in `src/sections/agent-production.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.teal`, `C.cyan`, `C.purple`, `C.green`, `C.amber`.
- Center-aligned titles. Title-case for all diagram box text. "Two Multi-Agent Styles", "CrewAI: Roles + Goals", "AutoGen: Conversational Agents", "Same Ticket, Two Frameworks", "Pick The Abstraction That Matches Your Mental Model".
- The CrewAI and AutoGen pattern artifacts in subs 1 and 2 render as styled mono-text labeled "Framework Pattern (shape) - CrewAI" / "Framework Pattern (shape) - AutoGen". Tinted background, soft border, monospace 14-16px, centered. NOT code blocks.
- The side-by-side trace in sub=3 shows T4 (cancel + refund) in both frameworks.
- Framework comparison stays at "what it does + when it fits" - no pricing, no quarter-specific feature comparison.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.49 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CrewAiAutoGen"
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
git add src/sections/agent-production.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.49 CrewAI / AutoGen"
```

---

## Task 7: Implement Chapter 13.50 VendorSdks

**Files:**
- Modify: `src/sections/agent-production.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Vendor-native agent SDKs. Claude Agent SDK (loop primitive) and OpenAI Agents (hand-off primitive). Show each's core abstraction, side-by-side comparison, and the vendor-lock-in tradeoff.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.teal) - Vendor-native: tight integration**
  Title: "When The Model Vendor Ships The Framework"
  Visual: 2 cards.
  - Claude Agent SDK: built around the Claude API; loop primitive (`run_agent_loop`); tightly integrated with caching, structured output, MCP.
  - OpenAI Agents (successor to Swarm): built around OpenAI's tool-calling; hand-off primitive (`agent.handoff_to(other)`); tightly integrated with assistants API.
  Both ship native support for that vendor's features.
  Key content: "Claude Agent SDK|OpenAI Agents|Swarm", "loop|hand.?off|primitive", "vendor.?native|integration".

- **sub=1 (C.cyan) - Claude Agent SDK shape**
  Title: "Loop Primitive"
  Visual: styled mono artifact labeled "Framework Pattern (shape) - Claude Agent SDK":
  ```
  loop = AgentLoop(
    system_prompt=SYSTEM,
    tools=[lookup_customer, process_refund, escalate_human],
    max_iterations=10,
    on_message=log_message
  )
  result = loop.run(user_message="I want a refund for INV-9924")
  ```
  Highlight system_prompt + tools + max_iterations. Loop runs reason-act-observe internally.
  Key content: "AgentLoop|loop|primitive", "system_prompt|tools|max_iterations", "INV.?9924|refund".

- **sub=2 (C.purple) - OpenAI Agents shape**
  Title: "Hand-Off Primitive"
  Visual: styled mono artifact labeled "Framework Pattern (shape) - OpenAI Agents":
  ```
  triage = Agent(
    name="triage",
    instructions="Classify and route.",
    handoffs=[billing_agent, troubleshooting_agent]
  )
  result = Runner.run_sync(triage, "Refund my last invoice")
  ```
  Highlight handoffs field. Loop runs hand-off pattern internally (returns next agent until none).
  Key content: "OpenAI Agents|Runner|Agent", "handoffs|hand.?off", "triage|billing|troubleshooting".

- **sub=3 (C.green) - Side-by-side comparison**
  Title: "Two Primitives, Two Mental Models"
  Visual: a 4-row table:
  - Loop primitive (Claude Agent SDK): single agent, multi-iteration. Best for stand-alone agents with deep tool use.
  - Hand-off primitive (OpenAI Agents): multi-agent, single hand-off chain. Best for multi-role workflows.
  - Lock-in: high in both - you bind to the vendor's API + abstractions.
  - Portability: low - moving to another vendor means rewriting the agent harness.
  Key content: "loop.*Claude|hand.?off.*OpenAI", "lock.?in|portab", "single agent|multi.?role".

- **sub=4 (C.amber) - When to pick vendor SDK**
  Title: "Use The Vendor SDK When..."
  Visual: a decision card:
  - You're committed to one vendor (Claude or OpenAI) for the long term.
  - You want the vendor's latest features the day they ship.
  - The vendor's abstractions match your agent shape.
  Avoid when: multi-vendor strategy is required; you anticipate switching models; you need framework features the vendor doesn't ship (e.g., LangGraph's checkpointing).
  Key content: "vendor SDK|committed|latest features", "multi.?vendor|switch|checkpoint".

- [ ] **Step 1: Write content tests**

```js
describe("VendorSdks (13.50) content", () => {
  const fn = AgentProduction.VendorSdks;

  it("sub=0 introduces vendor-native frameworks", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Claude Agent SDK/);
    expect(container.textContent).toMatch(/OpenAI Agents|Swarm/);
    expect(container.textContent).toMatch(/loop|hand.?off|primitive/i);
  });

  it("sub=1 shows Claude Agent SDK shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/AgentLoop|loop/i);
    expect(container.textContent).toMatch(/system_prompt|tools/);
    expect(container.textContent).toMatch(/refund|INV.?9924/);
  });

  it("sub=2 shows OpenAI Agents shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/OpenAI Agents|Runner/);
    expect(container.textContent).toMatch(/handoffs/);
    expect(container.textContent).toMatch(/triage|billing/i);
  });

  it("sub=3 compares the two side-by-side", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/loop|hand.?off/i);
    expect(container.textContent).toMatch(/lock.?in|portab/i);
  });

  it("sub=4 lists when to pick vendor SDK", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/vendor|committed/i);
    expect(container.textContent).toMatch(/multi.?vendor|switch/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "VendorSdks"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full VendorSdks chapter**

Replace the stub export in `src/sections/agent-production.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.teal`, `C.cyan`, `C.purple`, `C.green`, `C.amber`.
- Center-aligned titles. Title-case for all diagram box text. "When The Model Vendor Ships The Framework", "Loop Primitive", "Hand-Off Primitive", "Two Primitives, Two Mental Models", "Use The Vendor SDK When...".
- The Claude Agent SDK and OpenAI Agents pattern artifacts in subs 1 and 2 render as styled mono-text labeled "Framework Pattern (shape) - Claude Agent SDK" / "Framework Pattern (shape) - OpenAI Agents". Tinted background, soft border, monospace 14-16px, centered. NOT code blocks.
- The 4-row comparison table in sub=3 highlights lock-in + portability tradeoffs.
- Framework comparison stays at "what it does + when it fits" - no pricing, no quarter-specific feature comparison.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Examples reference refund / INV-9924.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.50 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "VendorSdks"
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
git add src/sections/agent-production.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.50 Claude Agent SDK + OpenAI Agents"
```

---

## Task 8: Implement Chapter 13.51 CustomNoFramework

**Files:**
- Modify: `src/sections/agent-production.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** When you build your own agent loop instead of using a framework. Show the minimum viable loop (~50 lines of pseudocode), what you give up (no built-in observability / retries / checkpoint), and a decision tree for build-vs-buy.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.teal) - Why no framework?**
  Title: "Three Reasons To Roll Your Own"
  Visual: 3-card grid:
  - Control: you want exact control of every behavior (no framework magic).
  - Cost: frameworks add 50-200ms overhead per iteration; for high-volume traffic, that's millions of dollars.
  - Avoid vendor lock-in: you anticipate moving across LLM providers and don't want the framework to leak vendor specifics into your code.
  Key content: "no.?framework|custom|roll your own", "control|magic|cost|lock.?in", "overhead|vendor".

- **sub=1 (C.cyan) - Minimum viable loop**
  Title: "50 Lines Of Loop"
  Visual: a styled mono artifact labeled "Framework Pattern (shape) - Custom Loop":
  ```
  history = [system_prompt, user_msg]
  for i in range(max_iter):
    response = llm.call(history, tools=TOOLS)
    history.append(response)
    if response.has_tool_calls():
      for tool_use in response.tool_calls:
        result = TOOLS[tool_use.name](**tool_use.input)
        history.append(tool_result_block(tool_use.id, result))
    else:
      return response.final_text
  return "Max iterations reached - escalating to human."
  ```
  Highlight history accumulator, the loop, termination conditions.
  Key content: "history|loop|max_iter", "tool_calls|tool_use|tool_result", "escalat|max iterations".

- **sub=2 (C.purple) - What you give up**
  Title: "Missing Pieces You Now Own"
  Visual: a 5-row checklist of what frameworks ship and you'd have to build:
  - Observability (spans, traces, metrics).
  - Retries with exp backoff per tool error class.
  - Checkpointing for long-running / human-in-the-loop.
  - Hand-off between agents (if multi-agent).
  - Eval harness integration.
  Each row marked "MUST BUILD" or "CAN SKIP" depending on production maturity.
  Key content: "missing|own|build", "observability|retry|checkpoint|hand.?off|eval", "MUST|SKIP".

- **sub=3 (C.green) - When custom wins**
  Title: "Stay Custom When..."
  Visual: a decision tree:
  - High-volume traffic (>10K/sec): yes, custom + tight observability.
  - Tight latency budget (P95 < 2s): yes, custom + minimal wrappers.
  - One-off prototype: no, use a framework, ship fast.
  - Team < 3 engineers: no, can't maintain a custom harness AND ship features.
  - Multi-vendor strategy: yes, custom + vendor-agnostic LLM adapter.
  Key content: "custom|high.volume|tight latency", "prototype|framework", "team|3 engineers".

- **sub=4 (C.amber) - The hybrid: use a framework for scaffolding, swap out pieces**
  Title: "Build Some, Buy Some"
  Visual: a layer diagram. Use a framework for: scaffolding, schema validation, retries. Build custom for: the LLM adapter (so you can swap vendors), observability (so it integrates with your monitoring stack), domain-specific tool gating.
  Production reality: most production teams end up hybrid.
  Key content: "hybrid|build some|buy some", "scaffold|adapter|observability", "production reality|most teams".

- [ ] **Step 1: Write content tests**

```js
describe("CustomNoFramework (13.51) content", () => {
  const fn = AgentProduction.CustomNoFramework;

  it("sub=0 lists three reasons to roll your own", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/control|cost|lock.?in/i);
  });

  it("sub=1 shows the 50-line loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/history|loop|max_iter/i);
    expect(container.textContent).toMatch(/tool_calls|tool_use/);
  });

  it("sub=2 lists missing pieces", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/observability/i);
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/checkpoint/i);
  });

  it("sub=3 shows when custom wins", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/high.?volume|tight latency/i);
    expect(container.textContent).toMatch(/prototype|framework/i);
  });

  it("sub=4 shows hybrid approach", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hybrid|build some|buy some/i);
    expect(container.textContent).toMatch(/adapter|observability/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CustomNoFramework"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full CustomNoFramework chapter**

Replace the stub export in `src/sections/agent-production.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.teal`, `C.cyan`, `C.purple`, `C.green`, `C.amber`.
- Center-aligned titles. Title-case for all diagram box text. "Three Reasons To Roll Your Own", "50 Lines Of Loop", "Missing Pieces You Now Own", "Stay Custom When...", "Build Some, Buy Some".
- The custom-loop pseudocode artifact in sub=1 renders as styled mono-text labeled "Framework Pattern (shape) - Custom Loop". Shows the minimum-viable while-loop with `history`, `llm.call`, tool dispatch, termination. Tinted background, soft border, monospace 14-16px, centered. NOT a code block. Use language-agnostic pseudocode.
- The decision tree (sub=3) and the hybrid layer diagram (sub=4) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Decision tree references >10K/sec, P95 < 2s, team-size 3 engineers thresholds.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.51 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CustomNoFramework"
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
git add src/sections/agent-production.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.51 Custom / No-Framework"
```

---

## Task 9: Implement Chapter 13.52 AgentDecisionFramework (CAPSTONE)

**Files:**
- Modify: `src/sections/agent-production.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The SECTION CAPSTONE. Assemble every decision from Acts 1-8 into one decision framework. Walk through designing a production agent for a new use case end-to-end, hitting every major choice. This is the chapter that says "you can now lead an agent project". Should feel like a closing synthesis.

**Sub-step structure (7 sub-steps, 0-6 - larger than typical to do the capstone justice):**

- **sub=0 (C.teal) - The full decision stack**
  Title: "Every Choice Section 13 Taught You"
  Visual: a stack of decision layers from top (strategy) to bottom (operations):
  1. Approach: Prompt / Tune / RAG / Agent? (13.5)
  2. Loop pattern: Workflow / ReAct / Plan-Execute / Reflection? (13.18-13.22)
  3. Memory layers: Working + which long-term? (13.24-13.29)
  4. Multi-agent: single agent / orchestrator / supervisor / hand-off? (13.30-13.34)
  5. Tools: which 8 tools? What scope? (13.7-13.11)
  6. Protocols: MCP / A2A / bespoke? (13.12-13.17)
  7. Eval: dimensions + judge + traces? (13.37-13.41)
  8. Production: observability + cost + guardrails + injection defense + security? (13.42-13.47)
  9. Framework: LangGraph / CrewAI / SDK / custom? (13.48-13.51)
  Each layer linked back to the chapters that covered it.
  Key content: "decision|stack|every choice", "13\\.5|13\\.18|13\\.30|13\\.37|13\\.48", "approach|loop|memory|multi.?agent".

- **sub=1 (C.cyan) - Capstone use case**
  Title: "Design An Agent For A New Use Case"
  Visual: a use case card: "Internal IT-support agent for a 500-person company. Handles employee tickets across: password resets, software install requests, VPN issues, hardware orders. Must escalate hardware orders > $500 to the IT manager. Must integrate with internal SSO + ticketing systems."
  Annotate: walk through every layer of the decision stack for this use case across sub-steps 2-6.
  Key content: "use case|capstone|IT support|new", "password|software install|VPN|hardware", "500|escalat".

- **sub=2 (C.purple) - Layers 1-3: approach, loop, memory**
  Title: "Pick Approach, Loop, Memory"
  Visual: 3 decision rows for the IT-support agent:
  - Approach: Agent (mutating actions = need tool calls + loop, not pure prompting / RAG).
  - Loop pattern: Workflow with one agent step (classify -> route -> handle: most tickets are deterministic; the handler is an agent loop).
  - Memory: Working memory (current ticket) + Episodic (past employee tickets, 90-day window) + Semantic (employee profile: department, hardware history, software stack).
  Key content: "agent|approach", "workflow|loop|hybrid", "working|episodic|semantic", "IT support".

- **sub=3 (C.green) - Layers 4-5: multi-agent, tools**
  Title: "Pick Multi-Agent, Tools"
  Visual: 2 decision rows:
  - Multi-agent: Orchestrator-worker. Triage classifier -> handler specialists (password / software / hardware). Hand-off when handler needs another's tools.
  - Tools: 8 internal tools + capability scope per handler (password handler doesn't get hardware tools, vice versa).
  Key content: "orchestrator.?worker", "triage|specialist", "capability scope|tools".

- **sub=4 (C.amber) - Layers 6-7: protocols, eval**
  Title: "Pick Protocols, Eval Strategy"
  Visual: 2 decision rows:
  - Protocols: MCP servers for SSO + ticketing system integration (gives clean separation; lets the IT team swap backends without touching the agent). No A2A (single-team agent).
  - Eval: 4-axis eval + LLM-as-Judge + trace evals for every refund/escalation. Eval set: 50 golden + 20 adversarial + growing regression set.
  Key content: "MCP|SSO|ticketing", "no A2A|single.?team", "4.?axis|judge|trace", "50|20|adversarial".

- **sub=5 (C.teal) - Layers 8-9: production, framework**
  Title: "Pick Production Hardening, Framework"
  Visual: 2 decision rows:
  - Production: OTel + LangSmith for observability; prompt cache for cost; latency target P95 < 5s; guardrails for hardware-order $-cap; prompt-injection defense at input.
  - Framework: LangGraph (state machine fits the workflow-with-agent-step shape).
  Key content: "OTel|LangSmith|prompt cache", "P95|guardrail|injection", "LangGraph".

- **sub=6 (C.teal) - Section closer**
  Title: "You Can Lead This Project Now"
  Visual: a closing panel with 3 commitments:
  - You can DECIDE: every layer above has a concrete decision in front of you, not a fog.
  - You can DIAGNOSE: when the agent fails in production, you know which layer to investigate.
  - You can DEFEND: in a design review, you can argue your choices from mechanics, not feel.
  Final line: "Section 13 done. The production agent is yours to ship."
  Key content: "decide|diagnose|defend", "you can|production|ship", "Section 13|done|closer".

- [ ] **Step 1: Write content tests**

```js
describe("AgentDecisionFramework (13.52) content - CAPSTONE", () => {
  const fn = AgentProduction.AgentDecisionFramework;

  it("sub=0 shows the full decision stack", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/decision|stack/i);
    expect(container.textContent).toMatch(/13\.5|13\.18|13\.30/);
  });

  it("sub=1 introduces capstone use case", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/IT support|use case/i);
    expect(container.textContent).toMatch(/password|software|VPN|hardware/i);
  });

  it("sub=2 picks approach / loop / memory", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/approach|agent/i);
    expect(container.textContent).toMatch(/workflow|loop/i);
    expect(container.textContent).toMatch(/working|episodic|semantic/i);
  });

  it("sub=3 picks multi-agent / tools", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/orchestrator|triage/i);
    expect(container.textContent).toMatch(/capability scope|tools/i);
  });

  it("sub=4 picks protocols / eval", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/eval/i);
    expect(container.textContent).toMatch(/judge|trace/i);
  });

  it("sub=5 picks production / framework", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OTel|LangSmith|observabilit/i);
    expect(container.textContent).toMatch(/LangGraph/);
  });

  it("sub=6 closes the section", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/decide|diagnose|defend/i);
    expect(container.textContent).toMatch(/section 13|production|ship/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentDecisionFramework"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full AgentDecisionFramework chapter (CAPSTONE)**

Replace the stub export in `src/sections/agent-production.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 7 sub-steps total (sub >= 0 through sub >= 6) - LARGER than typical to do the capstone justice.
- Sub=0 inline; subs 1-6 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.teal`, `C.cyan`, `C.purple`, `C.green`, `C.amber`, `C.teal`, `C.teal`.
- Center-aligned titles. Title-case for all diagram box text. "Every Choice Section 13 Taught You", "Design An Agent For A New Use Case", "Pick Approach, Loop, Memory", "Pick Multi-Agent, Tools", "Pick Protocols, Eval Strategy", "Pick Production Hardening, Framework", "You Can Lead This Project Now".
- The 9-layer decision stack (sub=0) is a vertical stack diagram with each layer back-referenced to its source chapter (13.5 / 13.18-13.22 / 13.24-13.29 / 13.30-13.34 / 13.7-13.11 / 13.12-13.17 / 13.37-13.41 / 13.42-13.47 / 13.48-13.51). SVG centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The IT-support capstone use case (sub=1) is clearly DIFFERENT from the customer-support running example - 500-person company, internal IT, employee tickets, $500 hardware threshold, SSO + ticketing integration.
- Subs 2-5 walk the 9-layer decision for the IT-support case with concrete picks at each layer.
- The closing panel (sub=6) gives 3 commitments (Decide / Diagnose / Defend) + the final line "Section 13 done. The production agent is yours to ship."
- Polish this chapter MORE than the others. Learners will return to this chapter most.
- This is the SECTION CAPSTONE. The capstone visuals MUST land cleanly; budget extra Chrome validation time.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references (section is closing); no carry-over brand names.

Follow the spec's chapter 13.52 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentDecisionFramework"
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
git add src/sections/agent-production.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.52 The Complete Agent Decision Framework"
```

---

## Task 10: Update CLAUDE.md for Section 13 Act 9 (FINAL)

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** Only `CLAUDE.md`.

- [ ] **Step 1: Append 5 rows to Section 13 mapping table**

```markdown
| 13.48 | LangGraphFramework | LangGraph |
| 13.49 | CrewAiAutoGen | CrewAI / AutoGen |
| 13.50 | VendorSdks | Claude Agent SDK + OpenAI Agents |
| 13.51 | CustomNoFramework | Custom / No-Framework |
| 13.52 | AgentDecisionFramework | The Complete Agent Decision Framework |
```

Update section heading: "Section 13: AI Agents (complete - all 9 acts, all 52 chapters)".

Remove any prior "Milestones X of 6 complete" phrasing.

- [ ] **Step 2: Project structure tree (final)**

Confirm the Section 13 entries reflect final state:

```
│       ├── agent-prompting.jsx         # Section 13 (Act 1, chapters 13.1-13.6)
│       ├── agent-tools.jsx             # Section 13 (Acts 2+3, chapters 13.7-13.17)
│       ├── agent-loops.jsx             # Section 13 (Acts 4+5, chapters 13.18-13.29)
│       ├── multi-agent.jsx             # Section 13 (Act 6, chapters 13.30-13.36)
│       ├── agent-evals.jsx             # Section 13 (Act 7, chapters 13.37-13.41)
│       └── agent-production.jsx        # Section 13 (Acts 8+9, chapters 13.42-13.52)
```

- [ ] **Step 3: Smoke gate + commit**

```bash
npm run test
git add CLAUDE.md
git commit -m "Document Section 13 Act 9 in CLAUDE.md mapping (Section 13 complete)"
```

---

## Task 11: Chrome browser visual validation of all 5 new chapters (capstone act)

**Files:**
- Modify: `src/data/svg-descriptions.json` (only if new SVGs added during Tasks 5-9).
- Possibly modify section files (`src/sections/agent-production.jsx`) if visual defects are found.

**Scope binding:** Per-defect-fix this task may modify individual section files. Group fixes by chapter and commit per chapter. `git diff --stat` before each commit.

This is the FINAL Chrome validation of Section 13. The capstone chapter (13.52) MUST land cleanly because learners will return to it most.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

Expected: dev server on `http://localhost:5173/learn-ai/`.

- [ ] **Step 2: For each chapter 13.48 through 13.52, navigate and screenshot**

For each chapter:

1. Use `mcp__claude-in-chrome__tabs_create_mcp` (or similar) to open a tab.
2. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch: <id>, sub: 20, fingerprint: <current>})` to force all sub-steps to reveal. Note: 13.52 has 7 sub-steps (sub=0 through sub=6), more than typical.
3. Take a screenshot.
4. Verify the per-chapter checklist (below) by inspection + the overlap-detection snippet.

Per-chapter checklist:

- No overlapping elements anywhere on the page.
- Every diagram is centered horizontally + vertically within its container.
- Every diagram-box label is title-case ("LangGraph Pattern" not "langgraph pattern").
- Every line of text starts with a capital letter.
- Every Box has a real color (no `C.card`).
- Every standalone formula / artifact is centered.
- Every SVG has a `<desc>` child as its first element.
- Body text is 16-19px, titles 22px.
- Framework-pattern artifacts (LangGraph node API in 13.48, CrewAI Agent in 13.49, AutoGen GroupChat in 13.49, Claude Agent SDK loop in 13.50, OpenAI Agents handoff in 13.50, custom-loop pseudocode in 13.51) render as styled mono-text, NOT as code blocks.
- 13.52 capstone: the 9-layer decision-stack visual (sub=0) is the single most-referenced visual in Section 13. Verify it's readable end-to-end, all back-references to source chapters are correct, and the closing panel (sub=6) lands clean.

- [ ] **Step 3: Save screenshots**

Save the 5 screenshots to `docs/superpowers/screenshots/section-13-m6/` (create directory if not present). Take an EXTRA screenshot pair for 13.52 sub=0 (decision stack) and sub=6 (section closer) - these are the chapter's signature visuals.

- [ ] **Step 4: Run edge-crossing check (where applicable)**

For SVGs that draw edges between nodes (the LangGraph state machine + graph in 13.48, the routing tree in 13.48, the hybrid layer diagram in 13.51, the decision stack in 13.52 sub=0), run the `countCrossings` snippet from `.claude/skills/check-visuals/SKILL.md` in the browser console. Expected: 0 crossings unless inherent to the concept.

- [ ] **Step 5: For each violation found**

Fix the section file directly. Group fixes by chapter and commit per chapter:

```bash
git add src/sections/agent-production.jsx
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

If new SVG `<desc>` entries need to be added to `src/data/svg-descriptions.json`:

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for Section 13 Act 9 diagrams"
```

- [ ] **Step 6: Final visual sweep**

After all defects fixed, walk through all 5 chapters once more and confirm clean. No silent skips. Pay EXTRA attention to 13.52 capstone visuals - this is the chapter learners will return to most. If anything feels off, fix it before proceeding to Task 12 (final M6 verification) - this is the section's last chance to land cleanly.

---

## Task 12: Final M6 verification

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
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: em-dash found" || echo "em-dash clean"

# C.card boxes
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: C.card found" || echo "C.card clean"

# carry-over brand (any vendor-shaped domain other than example.com / example.org)
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain found" || echo "domain clean"

# "architect" word in titles
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: 'architect' word found" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 7: Verify Section 13 in TOC shows 52 chapters (final - all 6 milestones)**

Navigate to the running app's TOC. Open Section 13. Confirm all 52 chapters (13.1 through 13.52) are listed.

- [ ] **Step 8: No commit.** This task only verifies. Section 13 is now complete; proceed to Task 13 (Section 13 SHIP checklist).

---

## Task 13: Section 13 SHIP checklist

**Files:**
- Create: `docs/superpowers/lessons/section-13-m6-lessons.md`
- Create: `docs/superpowers/lessons/section-13-overall-lessons.md` (cross-milestone synthesis)
- Modify: `CLAUDE.md` (final state confirmation)
- Possibly modify: `public/llms.txt`, `index.html` (final discoverability sync)
- No M7 starter prompt - Section 13 is complete.

**Scope binding:** Document-only changes; no section file edits in this task. `git diff --stat` before commit.

This task replaces the "Plan Refinement Checkpoint for M(next)" pattern from earlier milestones. Section 13 ships at the end of M6, so this is the section-ship checklist.

- [ ] **Step 1: Capture M6 lessons (3-5 bullets)**

Create `docs/superpowers/lessons/section-13-m6-lessons.md`:
- Did the framework code-shape artifacts (LangGraph node, CrewAI Agent, AutoGen GroupChat) feel distinct from real code blocks?
- The decision-stack visual in 13.52 sub=0 - did it land as comprehensive or overwhelming?
- The IT-support capstone use case - was it different-enough from the customer-support running example to demonstrate transfer, or did it feel forced?
- Did the closing "you can decide / diagnose / defend" panel feel motivating or preachy?

- [ ] **Step 2: Capture overall Section 13 lessons**

Create `docs/superpowers/lessons/section-13-overall-lessons.md` with 5-10 bullets across the whole section:
- What worked best across all 6 milestones in terms of visual patterns, test patterns, artifact treatment, ticket-trace structure?
- What would you change if you started Section 13 over?
- Which chapters needed the most Chrome iteration?
- Which cross-section back-references (to Sections 11, 12) were most useful for learners?
- What's the next "missing section" in the learn-ai app that Section 13 surfaced as needed (e.g., a dedicated security section, a model-tuning section, a voice agents section)?

- [ ] **Step 3: Verify discoverability sync (llms.txt + index.html JSON-LD)**

Re-verify that `public/llms.txt` and `index.html` have Section 13 topics from M1's Task 20. If the topic list needs any update from chapters added in M2-M6, edit now.

```bash
grep -n "AI Agents\|agent" public/llms.txt | head -10
grep -n "AI agents" index.html | head -10
```

- [ ] **Step 4: Final test + coverage smoke gate**

```bash
npm run test
npx vitest run --coverage
npm run lint
npm run format -- --check
npm run build
```

All must pass.

- [ ] **Step 5: Forbidden-pattern grep across all Section 13 section files**

```bash
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: em-dash" || echo "em-dash clean"
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: C.card" || echo "C.card clean"
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain" || echo "domain clean"
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx src/sections/agent-evals.jsx src/sections/agent-production.jsx && echo "FAIL: architect" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 6: Section 13 mapping table final form in CLAUDE.md**

Re-read the Section 13 mapping in `CLAUDE.md`. Confirm:
- All 52 chapter rows present (13.1 through 13.52).
- All component names match `src/config.js`.
- Section heading reads "Section 13: AI Agents (complete - all 9 acts, all 52 chapters)".

If anything is off, fix and commit:

```bash
git add CLAUDE.md
git commit -m "Finalize Section 13 mapping in CLAUDE.md"
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

Expected: only lessons files (and possibly CLAUDE.md / llms.txt / index.html if final tweaks made).

- [ ] **Step 8: Commit lessons + final docs**

```bash
git add docs/superpowers/lessons/section-13-m6-lessons.md docs/superpowers/lessons/section-13-overall-lessons.md
git commit -m "Capture M6 lessons and overall Section 13 lessons"
```

(If llms.txt or index.html needed adjustment, commit separately.)

- [ ] **Step 9: Re-indexing reminder**

After this commit lands on `main` and deploys to GitHub Pages, REMIND the user (one sentence, in the agent's final response):

> "Section 13 shipped. Remember to request re-indexing in Google Search Console (URL Inspection -> Request Indexing) and Bing Webmaster Tools (URL Submission) for the updated `/learn-ai/` URL so search engines pick up Section 13."

This is per CLAUDE.md's Discoverability Sync Rules.

- [ ] **Step 10: Section 13 complete.**

Final status check:

```bash
git log --oneline -50
npm run test
```

Expected: full Section 13 commit history visible; green test suite. 

**Section 13: AI Agents - COMPLETE.**

---

## Notes for next session executor

There is no Section 13 Milestone 7. M6 is the final milestone.

If the user requests further work on Section 13 after M6 ships (e.g., bug fixes, polish, new chapters), open a new branch and treat each request as its own small plan. The 6-milestone arc is closed.

The Section 13 spec at `docs/superpowers/specs/2026-05-16-section-13-agents-design.md` and the 6 milestone plans at `docs/superpowers/plans/2026-05-16-section-13-milestone-{1..6}.md` form the complete record of what Section 13 was designed to be and how it was built. Future readers reconstructing the section's design rationale should start with the spec.

## What Comes Next

Section 13 is done. The learn-ai app now covers Sections 1-13 spanning neural foundations through production AI agents.

Open questions surfaced by Section 13 that may seed future sections:
- A dedicated agent-safety / AI-alignment section (deeper than the prompt-injection + tool-security coverage in Acts 8).
- A voice / multimodal agents section (explicitly out-of-scope here).
- A browser-use / computer-use agent section (one paragraph in 13.51, no dedicated coverage).
- A model fine-tuning DEPTH section (the SFT/RLHF/DPO chapters in Section 2 cover mechanics; a "build it for your use case" section could complement Section 13's Agent decision matrix).

These are future-section seeds, not commitments.

## Self-Review Notes

- M6 is the capstone milestone. The 13.52 chapter is the chapter learners will most return to - polish it more than the others.
- The framework comparison chapters (13.48-13.51) name specific products (LangGraph, CrewAI, AutoGen, Claude Agent SDK, OpenAI Agents). Spec rules ban "vendor decision matrix that ages" - keep claims at the "what it does + when it fits" level, NOT pricing or quarter-specific feature comparisons.
- The IT-support capstone use case in 13.52 must be clearly different from the customer-support running example in Acts 1-8, OR it doesn't demonstrate transfer. Verify the contrast is crisp.
- After section ship, the "What Comes Next" notes here may become the seeds for future sections. Keep them honest, not promotional.
- M6 task 13 is heavier than other milestones' final tasks because it ALSO does the section-ship work. Budget extra time.
