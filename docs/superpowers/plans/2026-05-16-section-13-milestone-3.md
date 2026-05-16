# Section 13 Milestone 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** Subagent prompts MUST include the verbatim Files: list, "modify ONLY files in the Files: list", and "run `git diff --stat` before committing; abort if any file outside the list shows as modified". Parent reviews `git diff --stat` after each task. Scope violations are rejected.
>
> **Two-stage review per task:** Stage 1 SCOPE; Stage 2 CORRECTNESS. Both must pass before next task.

**Goal:** Add Section 13 Acts 5 + 6 (13 chapters). Act 5 Memory: 13.24 MemoryTaxonomy, 13.25 WorkingMemory, 13.26 EpisodicMemory, 13.27 SemanticMemory, 13.28 ProceduralMemory, 13.29 SummaryAndContextMgmt. Act 6 Multi-Agent: 13.30 WhyMultiAgent, 13.31 OrchestratorWorker, 13.32 SupervisorHierarchy, 13.33 AgentHandoffs, 13.34 CriticDebate, 13.35 MultiAgentFailures, 13.36 AgenticRag. The app ships at end of M3 with Section 13 having 36 navigable chapters.

**Architecture:** Act 5 extends the existing `src/sections/agent-loops.jsx` (M2 added Act 4; M3 adds Act 5). Act 6 starts a NEW file `src/sections/multi-agent.jsx`. The Section 13 loader grows from 3-file (M2) to 4-file (M3). All chapter content follows CLAUDE.md visual rules + Section 13 spec rules. Memory chapters back-reference Section 11 (vector DB substrate) and Section 12 (RAG pipeline as agentic-RAG comparison).

**Tech Stack:** React 18, Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`

**Branch policy:** Direct on `main`.

---

## Prerequisites

- M1 + M2 complete on `main`: Section 13 chapters 13.1-13.23 implemented, tests green, Chrome-validated.
- M1 + M2 lessons captured. READ BEFORE STARTING M3.

## File Structure

### New files

- `src/sections/multi-agent.jsx` - Act 6 chapter functions. 7 exports (WhyMultiAgent, OrchestratorWorker, SupervisorHierarchy, AgentHandoffs, CriticDebate, MultiAgentFailures, AgenticRag).

### Modified files

- `src/sections/agent-loops.jsx` - extend with 6 new exports for Act 5.
- `src/config.js` - add 13 entries to `chapters[]` (13.24-13.36).
- `src/learn-ai.jsx` - extend Section 13 loader to 4-file `Promise.all`.
- `src/__tests__/sections.test.jsx` - import `MultiAgent`, spread into `lookup`, content tests for 13 new chapters.
- `src/__tests__/config.test.js` - chapter entry tests.
- `src/__tests__/lookup.test.js` - import + spread + presence tests.
- `src/data/svg-descriptions.json` - entries for new SVGs.
- `CLAUDE.md` - mapping table rows + project structure tree update.

### Unchanged

`public/llms.txt`, `index.html`, all earlier section files.

---

## Standard running-example values (reference during implementation)

Same as M1/M2. Re-stated:

- Customer-support agent, customer support KB from Section 12.
- 8-tool inventory: `search_kb`, `lookup_customer`, `lookup_subscription`, `reset_password`, `change_email`, `process_refund`, `escalate_human`, `send_email`.
- Tickets T1-T5; standard customer Alice / `alice@example.com` / `c-9924` / Pro tier.
- Standard memory contents per spec (working / episodic / semantic / procedural examples for T2).
- Agent constants: 8k/128k window, max iter 5/10-20, tool latency 200ms, LLM latency 1.5s, cost $3/M in $15/M out, retry 3 exp backoff.
- **Per-act Box colors (M3):**
  - Act 5 (Memory): amber family - sub-step rotation `C.amber` -> `C.yellow` -> `C.orange` -> `C.red` -> `C.purple` -> `C.amber`.
  - Act 6 (Multi-Agent): green family - sub-step rotation `C.green` -> `C.teal` -> `C.cyan` -> `C.blue` -> `C.indigo` -> `C.purple` -> `C.green`.

---

## Visual rules - MANDATORY (re-stated)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 21).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Working Memory" not "working memory". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`temperature = 0.7`), JSON keys in artifact blocks (`"name"`, `"description"`), tokens like `[CLS]`.
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas / artifacts centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Stop hook `.claude/scripts/check-sections.sh` flags violations.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts (e.g., "covered in Section 11.7") are OK.
12. **No carry-over brand names** - corpus = "customer support knowledge base"; URLs = `docs.example.com`; never reintroduce a fictional company name.
13. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".
14. **Artifact treatment** (Section-13-specific) - memory artifacts (working-memory scratchpad, episodic event log entry, semantic profile card, procedural recipe) render as styled monospace text blocks with tinted background (`${color}06`), soft border (`1px solid ${color}12`), monospace 14-16px font. Labeled "Working Memory (shape)" / "Episodic Memory Entry" / "Semantic Memory (shape) - Customer Profile" / "Procedural Memory (shape) - Recipe". NEVER as executable code.

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 13 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding a NEW section file (`src/sections/multi-agent.jsx` in M3), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as MultiAgent from "../sections/multi-agent.jsx"`, (b) presence tests asserting `typeof mod.ChapterName === "function"` for each export, AND (c) spread `...MultiAgent` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as MultiAgent`, (b) spread `...MultiAgent` into the `lookup` object.
- `src/learn-ai.jsx` - extend Section 13's loader via `Promise.all` to include `multi-agent.jsx`. M3 grows the loader from 3-file (M2) to 4-file.

### When adding chapters to `chapters[]` (without a new section file - applies to Act 5 in M3 which extends `agent-loops.jsx`):

- `src/__tests__/config.test.js` - add a "Section 13 Act 5+6 chapters" describe block testing the specific new entries.
- The relevant section file must already export each new `component`. If it doesn't, the lookup-spread will resolve the symbol as `undefined` and `sections.test.jsx`'s generic test fails with "fn is not a function". M3 extends `agent-loops.jsx` (Act 5 exports added) and adds `multi-agent.jsx` (Act 6 exports).
- If new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

For Section 13 in M3, the loader becomes 4-file `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. The order in the array determines the import order but the merged `lookup` object is order-independent for distinct keys.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

1. Task 0 - Name session.
2. Task 1 - Baseline.
3. Task 2 - Extend `agent-loops.jsx` with 6 Act 5 stubs.
4. Task 3 - Create `multi-agent.jsx` with 7 Act 6 stubs.
5. Task 4 - Update `learn-ai.jsx` loader to 4-file.
6. Task 5 - Add 13.24-13.36 entries to `chapters[]`.
7. Task 6 - Register MultiAgent + new AgentLoops exports in test lookups.
8. Tasks 7-19 - Implement 13.24-13.36 (13 chapters).
9. Task 20 - Update `CLAUDE.md`.
10. Task 21 - Chrome validation.
11. Task 22 - Final M3 verify.
12. Task 23 - Plan Refinement Checkpoint for M4.

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section13-milestone3`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section13-milestone3` (if your Claude Code build supports it).
- Settings: set the session title via `/config` or the IDE extension's session pane.
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section13-milestone3" so future searches catch it.

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section13-milestone3` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section13-milestone3`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify M2 green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Confirm M1 + M2 commits on `main`**

```bash
git log --oneline -40 | head -40
```

Expected: M1 + M2 commits visible in the log, ending with the M3 starter prompt commit ("Add M3 starter prompt for next session"). Should include 23 chapter commits (M1: 13.1-13.11; M2: 13.12-13.23) and the milestone-boundary docs (CLAUDE.md updates, llms.txt, lessons files, starter prompts). If the log doesn't end cleanly, do NOT proceed; investigate.

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

Expected: `domain clean`. If a non-`example.com` vendor-shaped domain appears in shipped artifacts, regenerate the search index (`npm run search:extract`) and re-verify before proceeding. A leaked vendor domain would propagate into M3 content.

- [ ] **Step 6: No commit yet** - this task only verifies baseline.

---

## Task 2: Extend `src/sections/agent-loops.jsx` with 6 Act 5 stubs

**Files:**
- Modify: `src/sections/agent-loops.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Append 6 named stub exports for Act 5**

At the bottom of `src/sections/agent-loops.jsx`:

```jsx
// Section 13 Act 5: Agent Memory
// Chapters 13.24 - 13.29

export const MemoryTaxonomy = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Memory Taxonomy - Short vs Long
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const WorkingMemory = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Working Memory - The Scratchpad
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const EpisodicMemory = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Episodic Memory - Past Events
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const SemanticMemory = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Semantic Memory - Learned Facts
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ProceduralMemory = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Procedural Memory - Learned Skills
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const SummaryAndContextMgmt = (ctx) => {
  return (
    <div>
      <Box color={C.amber}>
        <T color={C.amber} bold center size={22}>
          Summary Memory + Context Window Management
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Scope verification + commit**

```bash
git add src/sections/agent-loops.jsx
git commit -m "Extend agent-loops.jsx with 6 stub exports for Section 13 Act 5"
```

---

## Task 3: Create `src/sections/multi-agent.jsx` with 7 Act 6 stubs

**Files:**
- Create: `src/sections/multi-agent.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Create the file**

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 6: Multi-Agent Architectures
// Chapters 13.30 - 13.36

export const WhyMultiAgent = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Why Multi-Agent?
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};

export const OrchestratorWorker = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Orchestrator-Worker
        </T>
        <T size={16}>Stub - implemented in Task 14.</T>
      </Box>
    </div>
  );
};

export const SupervisorHierarchy = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Supervisor / Hierarchical
        </T>
        <T size={16}>Stub - implemented in Task 15.</T>
      </Box>
    </div>
  );
};

export const AgentHandoffs = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Hand-Offs
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const CriticDebate = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Critic / Debate / Reflection-as-Multi-Agent
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const MultiAgentFailures = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Multi-Agent Failure Modes
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};

export const AgenticRag = (ctx) => {
  return (
    <div>
      <Box color={C.green}>
        <T color={C.green} bold center size={22}>
          Agentic RAG
        </T>
        <T size={16}>Stub - implemented in Task 19.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/sections/multi-agent.jsx
git commit -m "Add multi-agent.jsx scaffold with 7 stub exports for Section 13 Act 6"
```

---

## Task 4: Extend Section 13 loader to 4-file Promise.all

**Files:**
- Modify: `src/learn-ai.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Update Section 13 entry**

Change:

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
    import("./sections/agent-loops.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

to:

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
    import("./sections/agent-loops.jsx"),
    import("./sections/multi-agent.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 2: Test + commit**

```bash
npm run test
git add src/learn-ai.jsx
git commit -m "Extend Section 13 loader to include multi-agent.jsx"
```

---

## Task 5: Add 13 chapter entries (13.24-13.36) to `chapters[]`

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

**Scope binding:** Only these two.

- [ ] **Step 1: Failing tests**

```js
describe("Section 13 Act 5+6 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.24 MemoryTaxonomy", () => {
    const c = findCh("13.24");
    expect(c).toBeDefined();
    expect(c.title).toBe("Memory Taxonomy - Short vs Long");
    expect(c.section).toBe(13);
    expect(c.component).toBe("MemoryTaxonomy");
  });

  it("has 13.25 WorkingMemory", () => {
    const c = findCh("13.25");
    expect(c).toBeDefined();
    expect(c.title).toBe("Working Memory - The Scratchpad");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkingMemory");
  });

  it("has 13.26 EpisodicMemory", () => {
    const c = findCh("13.26");
    expect(c).toBeDefined();
    expect(c.title).toBe("Episodic Memory - Past Events");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EpisodicMemory");
  });

  it("has 13.27 SemanticMemory", () => {
    const c = findCh("13.27");
    expect(c).toBeDefined();
    expect(c.title).toBe("Semantic Memory - Learned Facts");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SemanticMemory");
  });

  it("has 13.28 ProceduralMemory", () => {
    const c = findCh("13.28");
    expect(c).toBeDefined();
    expect(c.title).toBe("Procedural Memory - Learned Skills");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ProceduralMemory");
  });

  it("has 13.29 SummaryAndContextMgmt", () => {
    const c = findCh("13.29");
    expect(c).toBeDefined();
    expect(c.title).toBe("Summary Memory + Context Window Management");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SummaryAndContextMgmt");
  });

  it("has 13.30 WhyMultiAgent", () => {
    const c = findCh("13.30");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Multi-Agent?");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyMultiAgent");
  });

  it("has 13.31 OrchestratorWorker", () => {
    const c = findCh("13.31");
    expect(c).toBeDefined();
    expect(c.title).toBe("Orchestrator-Worker");
    expect(c.section).toBe(13);
    expect(c.component).toBe("OrchestratorWorker");
  });

  it("has 13.32 SupervisorHierarchy", () => {
    const c = findCh("13.32");
    expect(c).toBeDefined();
    expect(c.title).toBe("Supervisor / Hierarchical");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SupervisorHierarchy");
  });

  it("has 13.33 AgentHandoffs", () => {
    const c = findCh("13.33");
    expect(c).toBeDefined();
    expect(c.title).toBe("Hand-Offs");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentHandoffs");
  });

  it("has 13.34 CriticDebate", () => {
    const c = findCh("13.34");
    expect(c).toBeDefined();
    expect(c.title).toBe("Critic / Debate / Reflection-as-Multi-Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CriticDebate");
  });

  it("has 13.35 MultiAgentFailures", () => {
    const c = findCh("13.35");
    expect(c).toBeDefined();
    expect(c.title).toBe("Multi-Agent Failure Modes");
    expect(c.section).toBe(13);
    expect(c.component).toBe("MultiAgentFailures");
  });

  it("has 13.36 AgenticRag", () => {
    const c = findCh("13.36");
    expect(c).toBeDefined();
    expect(c.title).toBe("Agentic RAG");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgenticRag");
  });
});
```

- [ ] **Step 2: Append 13 entries to `chapters[]`**

```js
{ id: "13.24", title: "Memory Taxonomy - Short vs Long", section: 13, component: "MemoryTaxonomy" },
{ id: "13.25", title: "Working Memory - The Scratchpad", section: 13, component: "WorkingMemory" },
{ id: "13.26", title: "Episodic Memory - Past Events", section: 13, component: "EpisodicMemory" },
{ id: "13.27", title: "Semantic Memory - Learned Facts", section: 13, component: "SemanticMemory" },
{ id: "13.28", title: "Procedural Memory - Learned Skills", section: 13, component: "ProceduralMemory" },
{ id: "13.29", title: "Summary Memory + Context Window Management", section: 13, component: "SummaryAndContextMgmt" },
{ id: "13.30", title: "Why Multi-Agent?", section: 13, component: "WhyMultiAgent" },
{ id: "13.31", title: "Orchestrator-Worker", section: 13, component: "OrchestratorWorker" },
{ id: "13.32", title: "Supervisor / Hierarchical", section: 13, component: "SupervisorHierarchy" },
{ id: "13.33", title: "Hand-Offs", section: 13, component: "AgentHandoffs" },
{ id: "13.34", title: "Critic / Debate / Reflection-as-Multi-Agent", section: 13, component: "CriticDebate" },
{ id: "13.35", title: "Multi-Agent Failure Modes", section: 13, component: "MultiAgentFailures" },
{ id: "13.36", title: "Agentic RAG", section: 13, component: "AgenticRag" },
```

- [ ] **Step 3-5: Verify tests pass; smoke gate (lookup tests still failing pre-Task 6 - expected); commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 13.24-13.36 to config for Section 13 Act 5+6"
```

---

## Task 6: Register MultiAgent + new AgentLoops exports in test lookups

**Files:**
- Modify: `src/__tests__/lookup.test.js`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

- [ ] **Step 1: Update lookup.test.js**

Add import:

```js
import * as MultiAgent from "../sections/multi-agent.jsx";
```

Spread `...MultiAgent` into the `lookup` object.

Add presence tests:

```js
describe("Section 13 Act 5 component presence (AgentLoops)", () => {
  it("AgentLoops exports each Act 5 chapter", () => {
    expect(typeof AgentLoops.MemoryTaxonomy).toBe("function");
    expect(typeof AgentLoops.WorkingMemory).toBe("function");
    expect(typeof AgentLoops.EpisodicMemory).toBe("function");
    expect(typeof AgentLoops.SemanticMemory).toBe("function");
    expect(typeof AgentLoops.ProceduralMemory).toBe("function");
    expect(typeof AgentLoops.SummaryAndContextMgmt).toBe("function");
  });
});

describe("Section 13 Act 6 component presence (MultiAgent)", () => {
  it("MultiAgent exports each Act 6 chapter", () => {
    expect(typeof MultiAgent.WhyMultiAgent).toBe("function");
    expect(typeof MultiAgent.OrchestratorWorker).toBe("function");
    expect(typeof MultiAgent.SupervisorHierarchy).toBe("function");
    expect(typeof MultiAgent.AgentHandoffs).toBe("function");
    expect(typeof MultiAgent.CriticDebate).toBe("function");
    expect(typeof MultiAgent.MultiAgentFailures).toBe("function");
    expect(typeof MultiAgent.AgenticRag).toBe("function");
  });
});
```

- [ ] **Step 2: Update sections.test.jsx**

Add `import * as MultiAgent from "../sections/multi-agent.jsx";` and spread `...MultiAgent` into lookup.

- [ ] **Step 3: Test + commit**

```bash
npm run test
git add src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Register MultiAgent and Act 5 AgentLoops exports in test lookups"
```

---

## Task 7: Implement Chapter 13.24 MemoryTaxonomy

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Open Act 5. Distinguish short-term (in-context working memory) from long-term (persisted across sessions, three sub-types). Show the taxonomy tree visually. Anchor with the customer-support example showing which memory holds what for ticket T2.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.amber) - Short vs long**
  Title: "Two Memory Layers"
  Visual: a horizontal split. Left: SHORT-TERM (working) - lives in the active context window. Right: LONG-TERM - lives outside, persists across sessions. Annotate: "Short = this conversation. Long = everything before."
  Key content: "short.?term", "long.?term", "context window", "session", "working".

- **sub=1 (C.yellow) - Three long-term sub-types**
  Title: "Long-Term Splits Three Ways"
  Visual: a tree. Long-term parent, 3 children:
  - Episodic: past events (timestamps + content)
  - Semantic: facts (key-value or vector)
  - Procedural: skills (recipes / cached workflows)
  Each child a separate tinted box.
  Key content: "episodic", "semantic", "procedural", "events", "facts", "skills".

- **sub=2 (C.orange) - Full taxonomy tree**
  Title: "The Agent Memory Taxonomy"
  Visual: a tree from a single root "Agent Memory":
  - Short -> Working (scratchpad)
  - Long -> Episodic / Semantic / Procedural
  Each leaf with a one-line definition + a customer-support example.
  Key content: "taxonomy", "working", "episodic", "semantic", "procedural".

- **sub=3 (C.red) - Which holds what for ticket T2**
  Title: "Memory Snapshot: Ticket T2"
  Visual: a 4-row card grid showing what each memory type contains for ticket T2:
  - Working: "Customer alice@example.com / issue: password reset + email changed / Next: change_email then reset_password"
  - Episodic: "2026-03-04: Past ticket #4521 for failed password reset; escalated due to legacy MFA bug"
  - Semantic: "Alice = Pro tier, signed up 2024-08, prefers email contact"
  - Procedural: "Refund > $200 -> escalate"
  Key content: "alice@example\\.com|c-9924", "working|episodic|semantic|procedural", "Pro tier|legacy MFA|refund.*200".

- **sub=4 (C.purple) - Why we need all four**
  Title: "Each Layer Solves A Different Problem"
  Visual: a 4-card grid mapping memory type to problem solved:
  - Working: holds the current task state across loop iterations.
  - Episodic: gives the agent recall of specific past events ("last time we did X").
  - Semantic: provides stable customer facts without re-asking.
  - Procedural: caches learned routines so the agent doesn't re-derive them every time.
  Key content: "current task|state", "past events|recall", "facts|stable", "routines|cache".

- [ ] **Step 1: Write content tests**

```js
describe("MemoryTaxonomy (13.24) content", () => {
  const fn = AgentLoops.MemoryTaxonomy;

  it("sub=0 distinguishes short and long", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/short.?term/i);
    expect(container.textContent).toMatch(/long.?term/i);
    expect(container.textContent).toMatch(/context window|session/i);
  });

  it("sub=1 lists the three long-term types", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
  });

  it("sub=2 shows the full taxonomy tree", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/working/i);
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
  });

  it("sub=3 shows the T2 memory snapshot", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
    expect(container.textContent).toMatch(/Pro tier|MFA|refund/i);
  });

  it("sub=4 explains why all four", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/current|task|state/i);
    expect(container.textContent).toMatch(/past|event/i);
    expect(container.textContent).toMatch(/facts|stable/i);
    expect(container.textContent).toMatch(/routine|cache/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MemoryTaxonomy"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full MemoryTaxonomy chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Two Memory Layers", "Long-Term Splits Three Ways", "The Agent Memory Taxonomy", "Memory Snapshot: Ticket T2", "Each Layer Solves A Different Problem".
- The taxonomy tree (sub=2) renders as an SVG with root + 4 leaves, centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The T2 memory snapshot in sub=3 has 4 cards (Working / Episodic / Semantic / Procedural) each tinted with the corresponding sub-step color used in chapters 13.25-13.28.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Snapshot must reference Alice / `alice@example.com` / `c-9924`, Pro tier, MFA, refund $200.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.24 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MemoryTaxonomy"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.24 Memory Taxonomy - Short vs Long"
```

---

## Task 8: Implement Chapter 13.25 WorkingMemory

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Working memory = the in-context scratchpad the agent maintains during the current task. Lives in the prompt, gets updated every reasoning step, discarded when task ends. Show its shape, its lifecycle across loop iterations, and a full ticket T2 trace.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.amber) - The scratchpad concept**
  Title: "A Note Pad The Model Keeps"
  Visual: a sticky-note-style panel that the agent reads + writes every loop turn. Annotate: "Reads on every REASON step. Updates after every OBSERVE step. Lives in the prompt context."
  Key content: "scratchpad|note", "reason|observ|loop", "prompt|context".

- **sub=1 (C.yellow) - Scratchpad shape**
  Title: "What Goes In The Scratchpad"
  Visual: a styled mono artifact labeled "Working Memory (shape)" showing 4 fields:
  ```
  {
    "customer_context": "alice@example.com, c-9924, Pro",
    "current_goal": "Reset password (email also changed)",
    "completed_steps": ["lookup_customer", "change_email"],
    "next_step": "reset_password",
    "constraints": ["refund cap $200"]
  }
  ```
  Key content: "customer_context|current_goal", "completed_steps", "next_step".

- **sub=2 (C.orange) - Update pattern across loop iterations**
  Title: "Updated Every Iteration"
  Visual: 4 stacked scratchpad cards, one per iteration of ticket T2:
  - After iter 1: completed_steps = []. next_step = "lookup_customer".
  - After iter 2: completed_steps = ["lookup_customer"]. customer_context filled. next_step = "change_email".
  - After iter 3: completed_steps += "change_email". next_step = "reset_password".
  - After iter 4: completed_steps += "reset_password". next_step = null. Task complete.
  Key content: "iter|iteration", "completed_steps", "lookup_customer|change_email|reset_password".

- **sub=3 (C.red) - Discard at task end**
  Title: "Working Memory Dies When The Task Ends"
  Visual: a timeline. Task starts -> working memory created -> updated N times -> task complete -> working memory DISCARDED. Anything worth keeping must be promoted to long-term memory (episodic / semantic / procedural) BEFORE discard.
  Key content: "discard|delete|end", "promote", "long.?term".

- **sub=4 (C.purple) - Comparison to long-term**
  Title: "Working vs Long-Term"
  Visual: a 2-column comparison:
  - Working: lives in prompt, written by model, low capacity (a few hundred tokens), discarded at end.
  - Long-term: lives in external store, written explicitly by promotion logic, large capacity (millions of facts), persistent.
  Key content: "working|long.?term", "prompt|external", "capacity|tokens|millions", "persist|discard".

- [ ] **Step 1: Write content tests**

```js
describe("WorkingMemory (13.25) content", () => {
  const fn = AgentLoops.WorkingMemory;

  it("sub=0 introduces scratchpad concept", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/scratchpad|note/i);
    expect(container.textContent).toMatch(/reason|observ|loop/i);
  });

  it("sub=1 shows the scratchpad shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/current_goal|customer_context/i);
    expect(container.textContent).toMatch(/completed_steps/i);
    expect(container.textContent).toMatch(/next_step/i);
  });

  it("sub=2 shows update across iterations", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/iter|iteration/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
  });

  it("sub=3 explains discard at task end", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/discard|delete|end/i);
    expect(container.textContent).toMatch(/promote|long.?term/i);
  });

  it("sub=4 compares working vs long-term", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/working|long.?term/i);
    expect(container.textContent).toMatch(/persist|discard/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkingMemory"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WorkingMemory chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "A Note Pad The Model Keeps", "What Goes In The Scratchpad", "Updated Every Iteration", "Working Memory Dies When The Task Ends", "Working vs Long-Term".
- The scratchpad shape in sub=1 renders as styled mono-text labeled "Working Memory (shape)": tinted background `${C.yellow}06`, border `1px solid ${C.yellow}12`, monospace 14-16px, centered. NOT a code block.
- The 4-iteration scratchpad sequence in sub=2 shows 4 stacked snapshot cards.
- Field names (`customer_context`, `current_goal`, `completed_steps`, `next_step`, `constraints`) must match the canonical scratchpad shape that will reappear in 13.42 (Observability tracing); keep them stable.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Working memory examples reference Alice, c-9924, `lookup_customer`, `change_email`, `reset_password`.
- Standalone artifacts centered.
- No forward references except the within-section signpost to 13.42; no carry-over brand names.

Follow the spec's chapter 13.25 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkingMemory"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.25 Working Memory - The Scratchpad"
```

---

## Task 9: Implement Chapter 13.26 EpisodicMemory

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Episodic memory holds specific past events (past tickets, past actions, past decisions). Storage substrate is a vector DB (back-reference Section 11.6/11.7 HNSW). At conversation start the agent retrieves relevant episodes. Show the event log shape, retrieval flow, and pruning policy.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.amber) - Episodes are time-stamped events**
  Title: "Episodes: Time-Stamped Events"
  Visual: a vertical timeline showing 4 past events for Alice:
  - 2026-03-04: "Failed password reset, escalated due to MFA bug"
  - 2026-04-12: "Complained about slow dashboard, resolved with cache fix"
  - 2026-05-01: "Requested invoice for May, sent successfully"
  - 2026-05-15 (now): "Reset password + email changed (T2)"
  Each event has timestamp + description.
  Key content: "episode|event", "timestamp|date", "Alice|alice", "password reset|dashboard|invoice".

- **sub=1 (C.yellow) - Storage substrate (back-reference Sec 11)**
  Title: "Stored As Vectors For Retrieval"
  Visual: a 2-stage flow. Stage 1: each event embedded by an embedding model -> stored in vector DB. Stage 2: query embedded -> ANN search returns top-k. Annotate: "Vector storage substrate covered in Section 11.6 (IVF) / 11.7 (HNSW). Here we use it as the layer below episodic memory."
  Key content: "vector|embedding", "11\\.6|11\\.7|Section 11", "HNSW|ANN|IVF", "retrieval".

- **sub=2 (C.orange) - Retrieval at conversation start**
  Title: "Recall Before Reasoning"
  Visual: a flow diagram. User arrives -> query = "current ticket summary" -> retrieve top-3 episodes -> include retrieved episodes in system prompt -> agent reasons WITH past context. Annotate: "ChatGPT Memory works similarly; the host fetches and injects."
  Key content: "retrieve|recall", "top.?3|top.?k", "system prompt", "ChatGPT|host.*inject".

- **sub=3 (C.red) - Episodic memory artifact**
  Title: "Event Log Entry (Shape)"
  Visual: a styled mono artifact labeled "Episodic Memory Entry":
  ```
  {
    "id": "ev-7821",
    "customer_id": "c-9924",
    "timestamp": "2026-03-04T14:22:00Z",
    "summary": "Failed password reset escalated due to legacy MFA bug.",
    "tools_used": ["reset_password", "escalate_human"],
    "outcome": "human_resolved",
    "embedding": "[1024 floats]"
  }
  ```
  Key content: "customer_id", "timestamp", "summary", "tools_used", "embedding".

- **sub=4 (C.purple) - Pruning and forgetting**
  Title: "Memory Has To Forget"
  Visual: a 4-row pruning policy table:
  - Age > 12 months AND outcome = "resolved cleanly" -> drop.
  - Age > 12 months AND outcome = "escalated" -> keep (rare patterns valuable).
  - Aggregated similar events -> summarize into one parent and drop children.
  - Manual customer request -> delete on demand (compliance).
  Key content: "prune|forget", "12 months|age", "summariz|aggregat", "compliance|delete on demand".

- [ ] **Step 1: Write content tests**

```js
describe("EpisodicMemory (13.26) content", () => {
  const fn = AgentLoops.EpisodicMemory;

  it("sub=0 shows time-stamped events", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/episode|event/i);
    expect(container.textContent).toMatch(/2026|timestamp|date/i);
    expect(container.textContent).toMatch(/alice|password reset/i);
  });

  it("sub=1 back-references Section 11 vector storage", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector|embedding/i);
    expect(container.textContent).toMatch(/section 11|11\.6|11\.7|HNSW/i);
  });

  it("sub=2 shows retrieval at conversation start", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev|recall/i);
    expect(container.textContent).toMatch(/system prompt|top.?3|top.?k/i);
  });

  it("sub=3 shows the entry shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/timestamp/i);
    expect(container.textContent).toMatch(/embedding/i);
  });

  it("sub=4 explains pruning policy", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prune|forget/i);
    expect(container.textContent).toMatch(/12 months|age|summariz/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EpisodicMemory"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full EpisodicMemory chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Episodes: Time-Stamped Events", "Stored As Vectors For Retrieval", "Recall Before Reasoning", "Event Log Entry (Shape)", "Memory Has To Forget".
- The timeline in sub=0 and the 2-stage embed-then-retrieve flow in sub=1 use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The episodic-event artifact in sub=3 renders as styled mono-text labeled "Episodic Memory Entry": tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- The chapter must back-reference Section 11.6 (IVF) and 11.7 (HNSW) as the vector storage substrate. Use the format: "Vector storage substrate covered in Section 11.6 (IVF) / 11.7 (HNSW)."
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Past events reference Alice / 2026-03-04 / "MFA bug" / `customer_id c-9924`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.26 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "EpisodicMemory"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.26 Episodic Memory - Past Events"
```

---

## Task 10: Implement Chapter 13.27 SemanticMemory

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Semantic memory = stable facts (user prefs, system knowledge, learned constants). Differs from episodic in time-orientation (facts don't have timestamps in the same way; they're current state, not historical events). Storage can be structured (key-value) or vector. Show profile-card growth across sessions.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.amber) - Facts, not events**
  Title: "Facts I Know About You"
  Visual: side-by-side. Episodic example: "On 2026-03-04, Alice opened a ticket about password reset." Semantic example: "Alice prefers email contact." Same person, different memory layer.
  Key content: "fact|facts", "alice|alice@example\\.com", "preference|prefer", "episodic|semantic".

- **sub=1 (C.yellow) - Profile card**
  Title: "The Customer Profile Card"
  Visual: a styled mono artifact labeled "Semantic Memory (shape) - Customer Profile":
  ```
  {
    "customer_id": "c-9924",
    "tier": "Pro",
    "signed_up": "2024-08",
    "preferred_contact": "email",
    "primary_email": "alice@example.com",
    "billing_currency": "USD",
    "preferences": { "skip_onboarding_emails": true }
  }
  ```
  Key content: "customer_id|c-9924", "tier|Pro", "preferred_contact|email", "preferences".

- **sub=2 (C.orange) - Structured vs vector storage**
  Title: "Key-Value Or Vector"
  Visual: a decision card:
  - Use structured (key-value / Postgres): when fields are typed, predictable, queried by exact match. Example: `customer_id -> profile`.
  - Use vector: when facts are free-text, queried by similarity. Example: "user mentioned they have a dairy allergy" embedded for retrieval later.
  Most agents use BOTH - structured for the spine, vector for the long-tail freetext.
  Key content: "structured|key.?value|postgres", "vector|similarity", "both|spine|long.?tail".

- **sub=3 (C.red) - Profile growth across sessions**
  Title: "How The Profile Fills Up"
  Visual: 3 stacked profile snapshots:
  - Day 1 (signup): "customer_id, tier, signed_up, primary_email" - 4 fields.
  - Day 30: + "preferred_contact: email" (learned from "email me at...").
  - Day 90: + "preferences.skip_onboarding_emails: true" (learned from opt-out).
  Profile expands as the agent observes preferences in conversation.
  Key content: "day 1|day 30|day 90|growth", "preferred_contact", "skip|opt.?out".

- **sub=4 (C.purple) - Updates: when to write, when to ignore**
  Title: "What Counts As A Fact?"
  Visual: a 2-column comparison:
  - Write to semantic: stable preferences ("always email"), confirmed identity ("Alice is the account owner"), constraints ("dairy allergy").
  - Don't write: transient mood ("frustrated today"), one-time requests ("send a copy this once"), guesses (uncertain inferences).
  Rule of thumb: if it would still be true in 6 months, write it.
  Key content: "write|store", "ignore|skip|don't", "stable|transient", "6 months|rule".

- [ ] **Step 1: Write content tests**

```js
describe("SemanticMemory (13.27) content", () => {
  const fn = AgentLoops.SemanticMemory;

  it("sub=0 distinguishes facts from events", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/episodic|event/i);
    expect(container.textContent).toMatch(/alice|prefer/i);
  });

  it("sub=1 shows the profile card", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/tier|Pro/);
    expect(container.textContent).toMatch(/preferred_contact|preference/i);
  });

  it("sub=2 compares structured vs vector storage", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/structured|key.?value/i);
    expect(container.textContent).toMatch(/vector|similarity/i);
  });

  it("sub=3 shows profile growth across sessions", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/day 1|day 30|day 90|growth/i);
  });

  it("sub=4 explains write vs ignore", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/write|store/i);
    expect(container.textContent).toMatch(/ignore|skip|transient/i);
    expect(container.textContent).toMatch(/6 months|stable/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SemanticMemory"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full SemanticMemory chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "Facts I Know About You", "The Customer Profile Card", "Key-Value Or Vector", "How The Profile Fills Up", "What Counts As A Fact?".
- The profile card artifact in sub=1 renders as styled mono-text labeled "Semantic Memory (shape) - Customer Profile": tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- The 3-stack profile growth visualization in sub=3 shows 3 cards with timestamps (Day 1 / Day 30 / Day 90).
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Profile references `customer_id c-9924`, Pro tier, `preferred_contact: email`, `primary_email: alice@example.com`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.27 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SemanticMemory"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.27 Semantic Memory - Learned Facts"
```

---

## Task 11: Implement Chapter 13.28 ProceduralMemory

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Procedural memory = learned skills / cached workflows / recurring routines. Different from semantic facts (these are HOW-TOs, not WHATs) and different from prompting (these persist across sessions in a retrievable form). Show recipe library, retrieval by task similarity, and a learned routine for the customer-support agent.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.amber) - Skills, not facts**
  Title: "How-To, Not What"
  Visual: 2-column comparison. Semantic fact: "Refund cap is $200". Procedural skill: "When a refund > $200 is requested, look up customer tier first; Enterprise customers can self-approve up to $500; otherwise call escalate_human with urgency=medium." The procedural memory encodes a multi-step recipe.
  Key content: "skill|how.?to|recipe", "fact|what", "$200|refund cap", "enterprise|tier", "escalate_human".

- **sub=1 (C.yellow) - The recipe library**
  Title: "Cached Workflows The Agent Reuses"
  Visual: a labeled library of 4 recipes:
  - "Handle refund request" - 3 steps.
  - "Resolve password issue" - 4 steps.
  - "Escalate billing dispute" - 2 steps + check.
  - "Resolve sync failure" - 5 steps.
  Each entry has a name, trigger condition, and step list.
  Key content: "recipe|library|cache", "refund|password|billing|sync", "step|workflow".

- **sub=2 (C.orange) - Retrieval by task similarity**
  Title: "Retrieve The Recipe That Matches"
  Visual: a flow. New ticket arrives -> embedding -> ANN search across recipe library -> top-1 recipe surfaced (or "no match" if similarity below threshold) -> agent uses recipe as scaffolding, with optional adaptation.
  Key content: "task similarity|match|retriev", "ANN|embedding", "scaffolding|adapt".

- **sub=3 (C.red) - Recipe artifact**
  Title: "Recipe (Shape)"
  Visual: a styled mono artifact labeled "Procedural Memory (shape) - Recipe":
  ```
  {
    "id": "recipe-refund",
    "name": "Handle refund request",
    "trigger_embedding": "[1024 floats]",
    "steps": [
      "lookup_customer to get customer_id and tier",
      "if tier == Enterprise: auto-approve up to $500; else $200",
      "lookup_subscription for invoice_id",
      "process_refund(invoice_id, reason); if business_rule error: escalate_human"
    ],
    "success_rate": 0.92,
    "uses": 187
  }
  ```
  Highlight steps, success_rate, uses.
  Key content: "recipe", "steps", "success_rate", "uses|count".

- **sub=4 (C.purple) - Difference from prompting**
  Title: "Why Not Just Prompt The Recipe Every Time?"
  Visual: a comparison card:
  - Prompting: recipe in system prompt -> every conversation pays the prompt tokens.
  - Procedural memory: recipe stored externally, retrieved only when relevant -> token-efficient.
  - Procedural memory also lets you UPDATE the recipe based on real outcomes (success_rate goes down -> rewrite). Static prompts can't learn.
  Key content: "prompt|prompting", "stored|external", "token|efficient", "update|learn|outcome".

- [ ] **Step 1: Write content tests**

```js
describe("ProceduralMemory (13.28) content", () => {
  const fn = AgentLoops.ProceduralMemory;

  it("sub=0 contrasts skill vs fact", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/skill|recipe|how.?to/i);
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/escalate_human|200/);
  });

  it("sub=1 shows the recipe library", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/library|cache|recipe/i);
    expect(container.textContent).toMatch(/refund|password|billing/i);
  });

  it("sub=2 shows retrieval by similarity", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/similarity|match|retriev/i);
    expect(container.textContent).toMatch(/embedding|ANN/);
  });

  it("sub=3 shows recipe shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recipe/i);
    expect(container.textContent).toMatch(/steps/i);
    expect(container.textContent).toMatch(/success_rate|uses/i);
  });

  it("sub=4 contrasts with prompting", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/external|stored|token/i);
    expect(container.textContent).toMatch(/learn|update|outcome/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ProceduralMemory"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ProceduralMemory chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "How-To, Not What", "Cached Workflows The Agent Reuses", "Retrieve The Recipe That Matches", "Recipe (Shape)", "Why Not Just Prompt The Recipe Every Time?".
- The recipe library card grid in sub=1 shows 4 labeled recipe cards. The retrieval flow in sub=2 uses an SVG with `<desc>` + `svg-descriptions.json`.
- The recipe artifact in sub=3 renders as styled mono-text labeled "Procedural Memory (shape) - Recipe": tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Recipe references `lookup_customer`, Enterprise tier, $200 / $500 thresholds, `process_refund`, `escalate_human`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.28 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ProceduralMemory"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.28 Procedural Memory - Learned Skills"
```

---

## Task 12: Implement Chapter 13.29 SummaryAndContextMgmt

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Close Act 5. Long conversations pressure the context window; summary memory is the compression technique that lets agents handle 100-turn conversations in an 8k-32k window. Show rolling summary, hierarchical summary, recency-vs-relevance, and the "summarize at 50% capacity" production rule.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.amber) - Long conversations pressure the window**
  Title: "100 Turns Won't Fit"
  Visual: a horizontal context window bar at 8k tokens. Show messages stacking from left (turn 1) to right (turn 100). By turn 30 the bar is full. Annotate "Past turn 30, something has to give."
  Key content: "context window|8k|turns", "100|30|full".

- **sub=1 (C.yellow) - Rolling summary technique**
  Title: "Compress The Oldest Half"
  Visual: a 3-step flow. Step 1: convo at 50% capacity. Step 2: oldest half summarized into a 2-paragraph summary block. Step 3: summary block replaces the raw turns; capacity drops to 25%; convo continues. Repeat every 50%.
  Key content: "rolling summary", "50%|capacity|half", "compress|summari".

- **sub=2 (C.orange) - Hierarchical summary**
  Title: "Summaries Of Summaries"
  Visual: a tree. Leaves: raw turn batches (each batch = 10 turns). Mid-layer: per-batch summary. Top: meta-summary of the whole conversation. Annotate: "For week-long conversations, hierarchical summaries scale better than flat rolling summaries."
  Key content: "hierarch", "tree|leaves|mid|top", "meta.?summary", "week|long".

- **sub=3 (C.red) - Recency vs relevance**
  Title: "Most Recent vs Most Relevant"
  Visual: a comparison card. After summarization, what stays in context?
  - Recency strategy: most-recent N turns raw + summary of older.
  - Relevance strategy: turns most similar to current query raw + summary of others (uses vector retrieval).
  - Hybrid: top-K recent + top-K relevant + summary of rest. Often the winner.
  Key content: "recency|relevance|hybrid", "recent|relevant", "top.?K|K turns".

- **sub=4 (C.purple) - Production strategy**
  Title: "Summarize At 50% Capacity"
  Visual: a budget bar showing 4 thresholds: 25% (do nothing), 50% (summarize oldest 25%), 75% (aggressive summarize + start hybrid retrieval), 90% (panic: drop everything except summary + last 5 turns + retrieved relevance). Each level a different tinted band.
  Key content: "50%|threshold|capacity", "aggressive|panic|drop", "production".

- **sub=5 (C.amber) - Context mgmt is half of agent eng**
  Title: "Context Is Where Real Work Happens"
  Visual: a closing card: "Memory + context-engineering decide what the model sees on EVERY turn. Section 13.6 covered the prompt assembly stack; this chapter closes Act 5 by tying the memory layers into that stack."
  Back-reference 13.6.
  Key content: "13\\.6|context engineering", "stack|assembly", "memory.*layer|layer.*memory".

- [ ] **Step 1: Write content tests**

```js
describe("SummaryAndContextMgmt (13.29) content", () => {
  const fn = AgentLoops.SummaryAndContextMgmt;

  it("sub=0 shows long conversations pressure the window", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window|8k/i);
    expect(container.textContent).toMatch(/turns?|100|30/i);
  });

  it("sub=1 shows rolling summary technique", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rolling|summary/i);
    expect(container.textContent).toMatch(/50%|capacity|half/i);
  });

  it("sub=2 shows hierarchical summary tree", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarch/i);
    expect(container.textContent).toMatch(/meta|tree|leaves/i);
  });

  it("sub=3 contrasts recency / relevance / hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recency/i);
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/hybrid/i);
  });

  it("sub=4 shows production thresholds", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/50%|threshold|capacity/i);
    expect(container.textContent).toMatch(/aggressive|panic|production/i);
  });

  it("sub=5 ties to 13.6 context engineering", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/13\.6|context engineering/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SummaryAndContextMgmt"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full SummaryAndContextMgmt chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.amber`, `C.yellow`, `C.orange`, `C.red`, `C.purple`, `C.amber`.
- Center-aligned titles. Title-case for all diagram box text. "100 Turns Won't Fit", "Compress The Oldest Half", "Summaries Of Summaries", "Most Recent vs Most Relevant", "Summarize At 50% Capacity", "Context Is Where Real Work Happens".
- The context window bar (sub=0), the rolling-summary flow (sub=1), the hierarchical tree (sub=2), and the threshold-band budget visualization (sub=4) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json` entries.
- The chapter must back-reference 13.6 (Context Engineering) in sub=5 as the prompt-assembly companion.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references except the within-section signpost to 13.6; no carry-over brand names.

Follow the spec's chapter 13.29 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SummaryAndContextMgmt"
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
git add src/sections/agent-loops.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.29 Summary Memory + Context Window Management"
```

---

## Task 13: Implement Chapter 13.30 WhyMultiAgent

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Open Act 6. Why split work across multiple agents? Three reasons: specialization (each agent prompted + tooled for one role), parallelism (independent sub-tasks run concurrently), separation of concerns (planner vs worker). Also show when multi-agent HURTS (small problems get worse).

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Single-agent ceiling**
  Title: "Why One Agent Sometimes Isn't Enough"
  Visual: a single big agent labeled with 5 jobs - retrieve, classify, refund, troubleshoot, escalate. The label is crowded. Each role pulls the system prompt in a different direction.
  Key content: "single|one agent", "ceiling|limit|crowded", "roles|jobs".

- **sub=1 (C.teal) - Specialization gain**
  Title: "Specialization: One Agent Per Role"
  Visual: replace the crowded single agent with 3 focused agents - "Billing Specialist", "Troubleshooting Specialist", "Triage Router". Each has a tighter system prompt, a smaller tool set, a clearer goal.
  Key content: "specializ", "billing|trouble|triage", "focused|smaller", "system prompt".

- **sub=2 (C.cyan) - Parallelism gain**
  Title: "Run Independent Tasks At The Same Time"
  Visual: 3 sub-tasks running concurrently on 3 separate agents - lookup_customer + lookup_subscription + search_kb all in parallel. Total wall-clock time = max(sub-task time), not sum.
  Key content: "parallel|concurrent", "wall.?clock|max", "lookup_customer|lookup_subscription|search_kb".

- **sub=3 (C.blue) - Separation of concerns**
  Title: "Planner vs Worker"
  Visual: a 2-layer setup. Planner agent breaks the task into sub-tasks. Worker agents handle one sub-task each. Each agent stays focused on its layer's job.
  Key content: "planner|worker", "break|decompos", "layer|separation".

- **sub=4 (C.indigo) - When multi-agent hurts**
  Title: "Don't Multi-Agent A Small Problem"
  Visual: a "when not to" card listing 4 anti-patterns:
  - Single-step tasks (just call the tool).
  - Tasks where context matters and hand-off loses it.
  - Latency-critical loops (each agent adds 1-2s).
  - Small dev teams who'll struggle to debug multi-agent failures (Section 13.35).
  Decision rule: multi-agent if specialization OR parallelism OR planner/worker fits; otherwise single agent.
  Key content: "hurt|anti.?pattern|not", "single.?step|context|latency", "13\\.35|failure"};
```

- [ ] **Step 1: Write content tests**

```js
describe("WhyMultiAgent (13.30) content", () => {
  const fn = MultiAgent.WhyMultiAgent;

  it("sub=0 shows single-agent ceiling", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/single|one agent|ceiling/i);
  });

  it("sub=1 explains specialization", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/specializ/i);
    expect(container.textContent).toMatch(/billing|trouble|triage/i);
  });

  it("sub=2 shows parallelism", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|concurrent/i);
    expect(container.textContent).toMatch(/lookup_customer|lookup_subscription/);
  });

  it("sub=3 shows planner / worker", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/planner|worker/i);
    expect(container.textContent).toMatch(/decompos|break/i);
  });

  it("sub=4 lists when multi-agent hurts", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hurt|anti.?pattern|not/i);
    expect(container.textContent).toMatch(/13\.35|failure/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyMultiAgent"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WhyMultiAgent chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "Why One Agent Sometimes Isn't Enough", "Specialization: One Agent Per Role", "Run Independent Tasks At The Same Time", "Planner vs Worker", "Don't Multi-Agent A Small Problem".
- The single-agent ceiling visual (sub=0) and the 3-agent specialization (sub=1) and the parallel-tasks topology (sub=2) and the planner/worker 2-layer setup (sub=3) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The chapter must back-reference 13.35 (Multi-Agent Failure Modes) in sub=4 as the cost-of-multi-agent companion.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references except the within-section signpost to 13.35; no carry-over brand names.

Follow the spec's chapter 13.30 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyMultiAgent"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.30 Why Multi-Agent"
```

---

## Task 14: Implement Chapter 13.31 OrchestratorWorker

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The orchestrator-worker pattern. Central orchestrator plans + aggregates; workers each handle one sub-task in parallel. Most common production multi-agent shape. Show topology, communication, aggregation patterns, and ticket T3 (dashboard slow + 500 errors) as the example.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Topology**
  Title: "One Planner, N Workers"
  Visual: a hub-and-spoke. Orchestrator (top, center) with arrows to 3 workers (bottom). Workers return results back up. Aggregation happens at the orchestrator.
  Key content: "orchestrat|planner", "worker", "hub|spoke|topology".

- **sub=1 (C.teal) - Orchestrator role**
  Title: "Plan, Dispatch, Aggregate"
  Visual: 3 columns showing orchestrator's 3 phases:
  - Plan: break the task into 3 sub-tasks.
  - Dispatch: send each sub-task to its worker.
  - Aggregate: when workers return, merge results into a final answer.
  Key content: "plan", "dispatch|send", "aggregat|merge".

- **sub=2 (C.cyan) - Worker role**
  Title: "Execute One Sub-Task"
  Visual: a worker card. Input: a sub-task description. Process: agent loop within its own tool set. Output: a structured result returned to orchestrator. Annotate: "Workers don't talk to each other; only to the orchestrator."
  Key content: "worker", "sub.?task", "structured result", "don't talk|orchestrator".

- **sub=3 (C.blue) - Ticket T3 example**
  Title: "Trace: Ticket T3 With Orchestrator-Worker"
  Visual: 5-row trace for ticket T3 (dashboard slow + 500 errors):
  1. Orchestrator receives T3 and plans: "Sub-task A: search_kb for 'dashboard slow'. Sub-task B: search_kb for '500 errors'. Sub-task C: lookup_customer for usage tier."
  2. Worker A returns top-3 KB articles on dashboard performance.
  3. Worker B returns top-3 articles on 500 errors.
  4. Worker C returns Alice's tier + usage stats.
  5. Orchestrator aggregates: composes a single answer combining KB hits + customer context.
  Key content: "T3|ticket t3", "dashboard|500", "search_kb", "lookup_customer", "aggregat".

- **sub=4 (C.indigo) - Aggregation patterns**
  Title: "Three Ways To Aggregate"
  Visual: 3 cards:
  - Concatenation: stitch all worker outputs together. Simple but verbose.
  - Voting: workers each propose; orchestrator picks majority. Good for classification.
  - Synthesis: orchestrator reads all worker outputs and writes a single coherent answer. Most common, most expensive.
  Key content: "concat|stitch", "vote|majority", "synthesis|coherent".

- [ ] **Step 1: Write content tests**

```js
describe("OrchestratorWorker (13.31) content", () => {
  const fn = MultiAgent.OrchestratorWorker;

  it("sub=0 shows topology", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/orchestrat|planner/i);
    expect(container.textContent).toMatch(/worker/i);
  });

  it("sub=1 shows orchestrator phases", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/dispatch|send/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
  });

  it("sub=2 shows worker role", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sub.?task/i);
    expect(container.textContent).toMatch(/don't talk|orchestrator/i);
  });

  it("sub=3 traces T3", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T3|ticket t3/i);
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/lookup_customer/);
  });

  it("sub=4 lists aggregation patterns", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/concat|stitch/i);
    expect(container.textContent).toMatch(/vote|majority/i);
    expect(container.textContent).toMatch(/synthesis/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "OrchestratorWorker"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full OrchestratorWorker chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "One Planner, N Workers", "Plan, Dispatch, Aggregate", "Execute One Sub-Task", "Trace: Ticket T3 With Orchestrator-Worker", "Three Ways To Aggregate".
- The hub-and-spoke topology (sub=0) and the worker card (sub=2) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. T3 trace must reference `search_kb` and `lookup_customer`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.31 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "OrchestratorWorker"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.31 Orchestrator-Worker"
```

---

## Task 15: Implement Chapter 13.32 SupervisorHierarchy

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The supervisor / hierarchical pattern: tree of agents. Supervisor delegates to specialist supervisors, which delegate to leaf workers. Different from orchestrator-worker because it has multiple LEVELS, not just two. Useful for complex domains with sub-specialties.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Tree of agents**
  Title: "Multiple Levels Of Delegation"
  Visual: a 3-level tree. Top: Support Supervisor. Middle: Billing Supervisor / Troubleshooting Supervisor / Escalation Supervisor. Bottom: Refund Specialist / Invoice Specialist / Database Specialist / Network Specialist / etc. Each leaf has 1 narrow tool set.
  Key content: "tree|hierarch", "supervisor", "specialist|leaf", "level|delegate".

- **sub=1 (C.teal) - Supervisor role at each level**
  Title: "Each Supervisor: Plan + Route Down"
  Visual: a supervisor card. Input: a sub-task. Process: pick which child agent handles it, OR break further and pick multiple children. Output: aggregated child results, returned up to parent supervisor.
  Key content: "supervisor", "route|pick|children", "aggregat|return up".

- **sub=2 (C.cyan) - When to use tree vs orchestrator-worker**
  Title: "Hierarchical When The Domain Has Sub-Specialties"
  Visual: decision card:
  - Use orchestrator-worker: workers are peer specialists at one level.
  - Use hierarchical: domain has clear sub-domains (billing has refund / invoice / tier-change as sub-areas).
  - Avoid hierarchical: deep trees (>3 levels) usually mean over-engineering.
  Key content: "hierarchical|tree", "orchestrator.?worker", "sub.?domain|sub.?specialty", "3 levels|depth".

- **sub=3 (C.blue) - Customer-support example**
  Title: "Support Tree"
  Visual: a labeled support hierarchy:
  - Support Supervisor (top, all-tickets entry point)
    - Billing Supervisor
      - Refund Specialist
      - Invoice Specialist
      - Tier-Change Specialist
    - Troubleshooting Supervisor
      - Database Specialist
      - Network Specialist
    - Escalation Supervisor (sends to human)
  Each leaf agent has 1-3 tools from the canonical 8-tool inventory.
  Key content: "support supervisor|billing supervisor|troubl", "refund|invoice|tier", "database|network", "escalation".

- **sub=4 (C.indigo) - Escalating up the tree**
  Title: "When To Escalate Up"
  Visual: a flow showing a leaf specialist failing -> escalating to its supervisor -> supervisor decides: re-try with another leaf, or escalate to its OWN parent. Eventually a top-level escalation hits the Escalation Supervisor which calls `escalate_human`.
  Key content: "escalat|up|parent", "retry|another leaf", "escalate_human".

- [ ] **Step 1: Write content tests**

```js
describe("SupervisorHierarchy (13.32) content", () => {
  const fn = MultiAgent.SupervisorHierarchy;

  it("sub=0 shows the tree", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tree|hierarch/i);
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/specialist|leaf/i);
  });

  it("sub=1 shows supervisor role per level", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/route|pick|children/i);
  });

  it("sub=2 decides hierarchical vs orchestrator-worker", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/sub.?domain|sub.?specialty/i);
  });

  it("sub=3 shows the support tree", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/refund|invoice/i);
    expect(container.textContent).toMatch(/escalat/i);
  });

  it("sub=4 shows escalation up the tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/escalat/i);
    expect(container.textContent).toMatch(/escalate_human/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SupervisorHierarchy"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full SupervisorHierarchy chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "Multiple Levels Of Delegation", "Each Supervisor: Plan + Route Down", "Hierarchical When The Domain Has Sub-Specialties", "Support Tree", "When To Escalate Up".
- The 3-level supervisor tree (sub=0) and the support hierarchy (sub=3) and the escalation-up flow (sub=4) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`. The tree edges must not cross (planar layout required).
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Support tree references billing / refund / invoice / troubleshooting / database / network / escalation.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.32 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SupervisorHierarchy"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.32 Supervisor / Hierarchical"
```

---

## Task 16: Implement Chapter 13.33 AgentHandoffs

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** OpenAI's Swarm pattern (now in OpenAI Agents SDK). Instead of an orchestrator routing, an agent RETURNS the next agent. Hand-off ring pattern - any agent can hand off to any other agent. Different from supervisor (no fixed parent-child); different from orchestrator-worker (no central planner). Show context transfer on hand-off.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Hand-off vs delegation**
  Title: "Return The Next Agent"
  Visual: 2-row comparison. Delegation (orchestrator-worker): orchestrator decides who handles next, waits for result, picks again. Hand-off: agent A finishes its part and returns "next: agent B"; the loop directly switches control. No central coordinator.
  Key content: "hand.?off|hand off", "delegat", "return", "switch|control".

- **sub=1 (C.teal) - Swarm pattern shape**
  Title: "Agents As Routes"
  Visual: a styled mono artifact labeled "Agent Hand-Off (shape)":
  ```
  Agent {
    name: "triage",
    instructions: "Classify intent. Hand off to billing for refund/invoice, troubleshooting for errors.",
    handoffs: [billing_agent, troubleshooting_agent]
  }
  ```
  Each agent has a `handoffs` field listing which other agents it can transfer to.
  Key content: "swarm|hand.?off", "handoffs", "triage", "billing|troubleshooting".

- **sub=2 (C.cyan) - Context transfer on hand-off**
  Title: "What Travels With The Hand-Off"
  Visual: a labeled "Hand-off package" containing: full conversation history, working memory snapshot, hand-off reason ("classified as billing"). Receiving agent reads all of it.
  Key content: "context|history", "working memory|snapshot", "reason".

- **sub=3 (C.blue) - Ticket T4 hand-off trace**
  Title: "Trace: T4 With Triage And Billing Hand-Off"
  Visual: 4-row trace:
  1. Triage agent receives T4 ("cancel + refund").
  2. Triage classifies as billing, returns hand-off to billing_agent.
  3. Loop switches: billing_agent now active, has full history.
  4. Billing handles cancel + refund; refund > $200 triggers business-rule error; billing hands off to escalation_agent.
  Key content: "T4|ticket t4", "triage", "billing", "hand.?off", "escalation".

- **sub=4 (C.indigo) - Hand-off ring vs tree**
  Title: "Ring When All Agents Are Peers"
  Visual: 2 topologies. Tree: clear parent / child. Ring: any agent can transfer to any other. Hand-off pattern fits the ring. Annotate when ring is right - when domains are equal peers rather than nested.
  Key content: "ring|peer", "tree|nested", "any agent|transfer".

- [ ] **Step 1: Write content tests**

```js
describe("AgentHandoffs (13.33) content", () => {
  const fn = MultiAgent.AgentHandoffs;

  it("sub=0 contrasts hand-off vs delegation", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/hand.?off/i);
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/switch|return|control/i);
  });

  it("sub=1 shows the swarm shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/swarm|hand.?off/i);
    expect(container.textContent).toMatch(/handoffs/i);
    expect(container.textContent).toMatch(/triage|billing/i);
  });

  it("sub=2 explains context transfer", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/context|history/i);
    expect(container.textContent).toMatch(/working memory|snapshot/i);
  });

  it("sub=3 traces T4 hand-off", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/hand.?off|escalation/i);
  });

  it("sub=4 contrasts ring vs tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ring|peer/i);
    expect(container.textContent).toMatch(/tree|nested/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentHandoffs"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full AgentHandoffs chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "Return The Next Agent", "Agents As Routes", "What Travels With The Hand-Off", "Trace: T4 With Triage And Billing Hand-Off", "Ring When All Agents Are Peers".
- The hand-off shape artifact in sub=1 renders as styled mono-text labeled "Agent Hand-Off (shape)": tinted background, soft border, monospace 14-16px, centered. NOT a code block.
- The hand-off ring topology in sub=4 uses an SVG centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. T4 trace references triage / billing / escalation hand-offs.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.33 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentHandoffs"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.33 Hand-Offs"
```

---

## Task 17: Implement Chapter 13.34 CriticDebate

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Critic and debate are reflection-as-multi-agent. A critic agent reviews a worker agent's output; debate has 2 agents argue opposing positions and a judge agent picks. Show when each helps (factuality, contested decisions) and the customer-support example of a policy critic checking the refund agent.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Critic agent role**
  Title: "A Second Agent Checks The First"
  Visual: 2-agent pair. Worker agent produces a draft answer. Critic agent reads the draft + original question, scores it and/or rewrites. Annotate: "Reflection (Section 13.22) was self-critique; this version uses a SEPARATE agent for critique."
  Key content: "critic", "worker|draft", "13\\.22|reflection", "second|separate".

- **sub=1 (C.teal) - Critique - revise loop**
  Title: "Loop: Draft - Critique - Revise"
  Visual: a circular flow. 1. Worker drafts. 2. Critic scores 0-10 with reasoning. 3. If score < 7, worker revises. 4. Critic re-scores. 5. Loop until score >= 7 OR retry cap reached.
  Key content: "critique|score", "revise", "loop", "cap|retry".

- **sub=2 (C.cyan) - Debate pattern**
  Title: "Two Agents Argue, Judge Decides"
  Visual: 3-agent setup. Agent Pro argues FOR a position. Agent Con argues AGAINST. Judge agent reads both arguments and the original question, picks. Useful when the worker's answer is contested or high-stakes.
  Key content: "debate|argue", "pro|con", "judge", "contested|high.?stakes".

- **sub=3 (C.blue) - Refund critic example**
  Title: "Policy Critic For The Refund Agent"
  Visual: a 4-row scenario. (1) Customer requests refund for invoice #INV-9924, $180. (2) Refund agent: "Approved, processing $180 refund." (3) Policy critic: "Hold - check if invoice was paid > 30 days ago. If yes, partial refund only." (4) Refund agent revises: "Approved for $120 (60% policy for >30 days)." Annotate critical catch.
  Key content: "refund|INV.?9924|180", "policy critic", "30 days|partial", "revise|120".

- **sub=4 (C.indigo) - When critic helps vs costs**
  Title: "Critic Adds Cost; Pick Battles"
  Visual: a decision card:
  - Use critic: high-stakes mutations (refunds, escalations, contract changes).
  - Use debate: contested decisions where multiple readings exist.
  - Skip both: simple lookups, classifications, factual recall.
  - Cost: critic adds 1 LLM call per draft; debate adds 3. Latency doubles or triples.
  Key content: "critic|cost|battle", "high.?stakes|contested|simple", "1 LLM call|3", "double|triple|latency".

- [ ] **Step 1: Write content tests**

```js
describe("CriticDebate (13.34) content", () => {
  const fn = MultiAgent.CriticDebate;

  it("sub=0 introduces critic role", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/critic/i);
    expect(container.textContent).toMatch(/13\.22|reflection/i);
  });

  it("sub=1 shows critique-revise loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/critique|score/i);
    expect(container.textContent).toMatch(/revise/i);
  });

  it("sub=2 shows debate pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/debate|argue/i);
    expect(container.textContent).toMatch(/judge/i);
  });

  it("sub=3 shows refund critic example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/policy/i);
    expect(container.textContent).toMatch(/30 days|partial/i);
  });

  it("sub=4 shows critic cost tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|battle/i);
    expect(container.textContent).toMatch(/high.?stakes|contested/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CriticDebate"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full CriticDebate chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "A Second Agent Checks The First", "Loop: Draft - Critique - Revise", "Two Agents Argue, Judge Decides", "Policy Critic For The Refund Agent", "Critic Adds Cost; Pick Battles".
- The 2-agent pair (sub=0) and the critique-revise circular loop (sub=1) and the 3-agent debate setup (sub=2) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The chapter must back-reference 13.22 (Plan-Execute + Reflection) in sub=0 as the self-critique companion.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. The refund-critic example references invoice #INV-9924, $180, 30-day policy, $120 partial refund.
- Standalone artifacts centered.
- No forward references except the within-section signpost to 13.22; no carry-over brand names.

Follow the spec's chapter 13.34 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "CriticDebate"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.34 Critic / Debate / Reflection-as-Multi-Agent"
```

---

## Task 18: Implement Chapter 13.35 MultiAgentFailures

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The four common multi-agent failure modes: drift, infinite loop, deadlock, cost runaway. Show each as a trace, the diagnostic signal that surfaces it, and the fix. This is the chapter that decides whether multi-agent ships or stays in the lab.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.green) - Four failure modes**
  Title: "How Multi-Agent Falls Apart"
  Visual: a 2x2 grid:
  - Drift: agents disagree on goal.
  - Infinite loop: agents bounce hand-offs.
  - Deadlock: agents wait on each other.
  - Cost runaway: unbounded recursion.
  Each tinted differently.
  Key content: "drift", "infinite loop", "deadlock", "cost runaway|runaway".

- **sub=1 (C.teal) - Drift**
  Title: "Drift: Agents Pull In Different Directions"
  Visual: 3 agents working on T4. Agent A interprets as "cancel subscription". Agent B as "refund last invoice". Agent C as "save the customer (anti-churn)". All work toward different outcomes; the final answer is incoherent. Signal: agents' planning outputs disagree on intent.
  Key content: "drift", "disagree|goal|intent", "incoherent|different".

- **sub=2 (C.cyan) - Infinite loop**
  Title: "Hand-Off Ping-Pong"
  Visual: triage hands off to billing; billing hands off back to triage; triage hands off to billing again. No agent commits to handling. Signal: hand-off rate per turn doesn't decrease over iterations.
  Key content: "infinite loop|ping.?pong", "hand.?off", "rate|signal".

- **sub=3 (C.blue) - Deadlock**
  Title: "Two Agents Wait Forever"
  Visual: Agent A waits on Agent B's result. Agent B waits on Agent A's result. Neither moves. Signal: both agents in WAITING state simultaneously for > N seconds.
  Key content: "deadlock|wait", "forever|both|waiting", "signal|N seconds".

- **sub=4 (C.indigo) - Cost runaway**
  Title: "Unbounded Recursion: Cost Goes Vertical"
  Visual: a cost chart. Normal multi-agent run: ~$0.50. Runaway scenario: agent spawns sub-agents, each spawns more, exponential. By iteration 20: $50. Signal: spend rate per turn climbing.
  Key content: "cost runaway|recursion", "exponential|vertical", "0\\.50|50|spend rate".

- **sub=5 (C.purple) - Diagnostic signals per failure**
  Title: "What To Alert On"
  Visual: a 4-row alert table mapping each failure to its production signal:
  - Drift: planner outputs from different agents disagree.
  - Infinite loop: hand-off rate not decreasing.
  - Deadlock: agents in WAITING > 30s.
  - Cost runaway: per-turn spend > 3x baseline.
  Each row has an alerting threshold.
  Key content: "alert|signal|threshold", "drift|infinite|deadlock|runaway", "30s|3x".

- [ ] **Step 1: Write content tests**

```js
describe("MultiAgentFailures (13.35) content", () => {
  const fn = MultiAgent.MultiAgentFailures;

  it("sub=0 lists four failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/infinite loop/i);
    expect(container.textContent).toMatch(/deadlock/i);
    expect(container.textContent).toMatch(/cost runaway|runaway/i);
  });

  it("sub=1 shows drift", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/disagree|goal|intent/i);
  });

  it("sub=2 shows infinite loop", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/infinite loop|ping.?pong/i);
    expect(container.textContent).toMatch(/hand.?off/i);
  });

  it("sub=3 shows deadlock", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/deadlock|wait/i);
  });

  it("sub=4 shows cost runaway", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost runaway|recursion/i);
    expect(container.textContent).toMatch(/exponential|vertical|spend/i);
  });

  it("sub=5 maps signals per failure", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/signal|alert|threshold/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MultiAgentFailures"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full MultiAgentFailures chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`, `C.purple`.
- Center-aligned titles. Title-case for all diagram box text. "How Multi-Agent Falls Apart", "Drift: Agents Pull In Different Directions", "Hand-Off Ping-Pong", "Two Agents Wait Forever", "Unbounded Recursion: Cost Goes Vertical", "What To Alert On".
- The 4-class failure grid (sub=0), drift visualization (sub=1), ping-pong arrows (sub=2), deadlock diagram (sub=3), and cost-vs-iteration chart (sub=4) each use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- This is the highest-stakes chapter for production teams. Diagrams MUST be unambiguous. If any reader confuses "drift" and "infinite loop", the chapter has failed. Treat Chrome validation of this chapter as extra-rigorous.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Each failure mode pairs with a concrete signal threshold (30s wait, 3x baseline, etc.).
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.35 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "MultiAgentFailures"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.35 Multi-Agent Failure Modes"
```

---

## Task 19: Implement Chapter 13.36 AgenticRag

**Files:**
- Modify: `src/sections/multi-agent.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Close Act 6. Agentic RAG = retrieval inside an agent loop (search → judge → refine → re-search) vs naive RAG (single retrieve → generate). Back-reference Section 12 (naive RAG pipeline) and 12.29 (agentic RAG in RAG section). Use the "Find all customer-impact issues in past 90 days" research-style query as the example.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.green) - Naive RAG vs agentic RAG**
  Title: "Retrieve Once vs Retrieve In A Loop"
  Visual: 2-row comparison. Naive RAG: query -> retrieve -> generate. One shot. Agentic RAG: query -> retrieve -> judge ("do I have enough?") -> if no, rewrite query and retrieve again. Iterative.
  Key content: "naive|agentic", "one.?shot|iterative", "judge|rewrite", "12\\.29|section 12".

- **sub=1 (C.teal) - Iterative retrieval loop**
  Title: "Search, Judge, Refine, Repeat"
  Visual: a circular loop with 4 stations - SEARCH -> JUDGE (do I have enough? what's missing?) -> REFINE (rewrite query) -> SEARCH again. Loop until JUDGE says "done" or max iterations.
  Key content: "search|judge|refine|repeat", "loop|circular", "max iter|done".

- **sub=2 (C.cyan) - Query rewriting as agent step**
  Title: "The Agent Rewrites Its Own Query"
  Visual: a 3-iteration trace. Iter 1 query: "customer issues past 90 days". Results: 5 generic articles. Iter 2 query (rewritten): "customer-impact incidents past 90 days, severity > 2". Better hits. Iter 3 query: same, with date filter. Best hits.
  Key content: "rewrite", "customer.?impact|severity", "filter|date", "iter|iteration".

- **sub=3 (C.blue) - Research-style query example**
  Title: "Example: Customer-Impact Issues Past 90 Days"
  Visual: a 5-step trace. (1) Initial query. (2) Search returns top-5. (3) Judge: only 2 are customer-impact; need broader retrieval. (4) Rewrite + search again. (5) Final aggregation: 8 incidents synthesized into a summary table with dates, severities, resolutions.
  Key content: "90 days|customer.?impact", "judge|broader", "aggregation|summary|table".

- **sub=4 (C.indigo) - When agentic RAG vs naive (Sec 12 back-ref)**
  Title: "When To Iterate Retrieval"
  Visual: decision card:
  - Use naive RAG (Section 12.2): direct factoid lookups, single-doc questions, latency-critical.
  - Use agentic RAG: research questions, multi-hop, "find all" / "compare X across Y", evolving understanding.
  - Cost: agentic RAG is 3-10x more expensive than naive. Use when the answer quality matters more than the latency.
  Key content: "12\\.2|section 12|naive", "agentic|research|multi.?hop", "3.?10x|cost|latency".

- [ ] **Step 1: Write content tests**

```js
describe("AgenticRag (13.36) content", () => {
  const fn = MultiAgent.AgenticRag;

  it("sub=0 contrasts naive and agentic RAG", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/naive|agentic/i);
    expect(container.textContent).toMatch(/12\.29|section 12/i);
    expect(container.textContent).toMatch(/iterative|loop|one.?shot/i);
  });

  it("sub=1 shows the iterative loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search/i);
    expect(container.textContent).toMatch(/judge/i);
    expect(container.textContent).toMatch(/refine|rewrite/i);
  });

  it("sub=2 shows query rewriting", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rewrite/i);
    expect(container.textContent).toMatch(/customer.?impact|severity/i);
  });

  it("sub=3 traces the 90-day research query", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/90 days|customer.?impact/i);
    expect(container.textContent).toMatch(/aggregat|summary|table/i);
  });

  it("sub=4 decides when agentic vs naive", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/naive|12\.2/);
    expect(container.textContent).toMatch(/agentic|research|multi.?hop/i);
    expect(container.textContent).toMatch(/cost|latency/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgenticRag"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full AgenticRag chapter**

Replace the stub export in `src/sections/multi-agent.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.green`, `C.teal`, `C.cyan`, `C.blue`, `C.indigo`.
- Center-aligned titles. Title-case for all diagram box text. "Retrieve Once vs Retrieve In A Loop", "Search, Judge, Refine, Repeat", "The Agent Rewrites Its Own Query", "Example: Customer-Impact Issues Past 90 Days", "When To Iterate Retrieval".
- The naive-vs-agentic comparison (sub=0) and the circular search-judge-refine loop (sub=1) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The chapter must back-reference Section 12.2 (naive RAG pipeline) and 12.29 (agentic RAG in Sec 12) explicitly: "Naive RAG pipeline - covered in Section 12.2 - here we contrast with the iterative loop." and "Agentic RAG mechanics covered in Section 12.29 - here we frame it as a multi-agent pattern."
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.36 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgenticRag"
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
git add src/sections/multi-agent.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.36 Agentic RAG"
```

---

## Task 20: Update CLAUDE.md mapping table for Section 13 Acts 5+6

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** Only `CLAUDE.md`.

- [ ] **Step 1: Append 13 rows to the Section 13 mapping table**

```markdown
| 13.24 | MemoryTaxonomy | Memory Taxonomy - Short vs Long |
| 13.25 | WorkingMemory | Working Memory - The Scratchpad |
| 13.26 | EpisodicMemory | Episodic Memory - Past Events |
| 13.27 | SemanticMemory | Semantic Memory - Learned Facts |
| 13.28 | ProceduralMemory | Procedural Memory - Learned Skills |
| 13.29 | SummaryAndContextMgmt | Summary Memory + Context Window Management |
| 13.30 | WhyMultiAgent | Why Multi-Agent? |
| 13.31 | OrchestratorWorker | Orchestrator-Worker |
| 13.32 | SupervisorHierarchy | Supervisor / Hierarchical |
| 13.33 | AgentHandoffs | Hand-Offs |
| 13.34 | CriticDebate | Critic / Debate / Reflection-as-Multi-Agent |
| 13.35 | MultiAgentFailures | Multi-Agent Failure Modes |
| 13.36 | AgenticRag | Agentic RAG |
```

Update section heading line: "Milestones 1-3 of 6 complete: Acts 1-6".

- [ ] **Step 2: Project structure tree**

Add `multi-agent.jsx`:

```
│       ├── multi-agent.jsx             # Section 13 (Act 6, chapters 13.30-13.36)
```

- [ ] **Step 3: Smoke gate + commit**

```bash
npm run test
git add CLAUDE.md
git commit -m "Document Section 13 Acts 5+6 in CLAUDE.md mapping"
```

---

## Task 21: Chrome browser visual validation of all 13 new chapters

**Files:**
- Modify: `src/data/svg-descriptions.json` (only if new SVGs added during Tasks 7-19).
- Possibly modify section files (`src/sections/agent-loops.jsx`, `src/sections/multi-agent.jsx`) if visual defects are found.

**Scope binding:** Per-defect-fix this task may modify individual section files. Group fixes by chapter and commit per chapter. `git diff --stat` before each commit.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

Expected: dev server on `http://localhost:5173/learn-ai/`.

- [ ] **Step 2: For each chapter 13.24 through 13.36, navigate and screenshot**

For each chapter:

1. Use `mcp__claude-in-chrome__tabs_create_mcp` (or similar) to open a tab.
2. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch: <id>, sub: 20, fingerprint: <current>})` to force all sub-steps to reveal.
3. Take a screenshot.
4. Verify the per-chapter checklist (below) by inspection + the overlap-detection snippet.

Per-chapter checklist:

- No overlapping elements anywhere on the page.
- Every diagram is centered horizontally + vertically within its container.
- Every diagram-box label is title-case ("Working Memory" not "working memory"; "Orchestrator-Worker" not "orchestrator-worker").
- Every line of text starts with a capital letter.
- Every Box has a real color (no `C.card`).
- Every standalone formula / artifact is centered.
- Every SVG has a `<desc>` child as its first element.
- Body text is 16-19px, titles 22px.
- Memory artifacts (13.25 working memory shape, 13.26 episodic entry, 13.27 profile card, 13.28 recipe) and multi-agent topology diagrams (13.31, 13.32, 13.33) render as styled mono-text or labeled SVGs as appropriate.
- Multi-agent failure modes chapter (13.35) - the most diagnostic-critical chapter for production teams - must clearly distinguish drift, infinite loop, deadlock, cost runaway.

- [ ] **Step 3: Save screenshots**

Save the 13 screenshots to `docs/superpowers/screenshots/section-13-m3/` (create directory if not present).

- [ ] **Step 4: Run edge-crossing check (where applicable)**

For SVGs that draw edges between nodes (the memory taxonomy tree in 13.24, the orchestrator-worker hub-and-spoke in 13.31, the supervisor tree in 13.32, the hand-off ring in 13.33, the critique-revise loop in 13.34, the iterative-retrieval loop in 13.36), run the `countCrossings` snippet from `.claude/skills/check-visuals/SKILL.md` in the browser console. Expected: 0 crossings unless inherent to the concept. SPECIAL CASE: the supervisor tree in 13.32 MUST be planar (clean parent-child); if it has crossings, the layout is broken.

- [ ] **Step 5: For each violation found**

Fix the section file directly. Group fixes by chapter and commit per chapter:

```bash
git add src/sections/agent-loops.jsx  # for chapters 13.24-13.29
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

```bash
git add src/sections/multi-agent.jsx  # for chapters 13.30-13.36
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

If new SVG `<desc>` entries need to be added to `src/data/svg-descriptions.json`:

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for Section 13 Acts 5+6 diagrams"
```

- [ ] **Step 6: Final visual sweep**

After all defects fixed, walk through all 13 chapters once more and confirm clean. No silent skips. M3 has the highest chapter count of any Section 13 milestone; budget time accordingly.

---

## Task 22: Final M3 verification

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
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx && echo "FAIL: em-dash found" || echo "em-dash clean"

# C.card boxes
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx && echo "FAIL: C.card found" || echo "C.card clean"

# carry-over brand (any vendor-shaped domain other than example.com / example.org)
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain found" || echo "domain clean"

# "architect" word in titles
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx src/sections/multi-agent.jsx && echo "FAIL: 'architect' word found" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 7: Verify Section 13 in TOC shows 36 chapters (M1 + M2 + M3)**

Navigate to the running app's TOC. Open Section 13. Confirm all 36 chapters (13.1 through 13.36) are listed.

- [ ] **Step 8: No commit.** This task only verifies.

---

## Task 23: Plan Refinement Checkpoint for M4

**Files:**
- Create: `docs/superpowers/lessons/section-13-m3-lessons.md`
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-13-milestone-4.md`
- Create: `docs/superpowers/starter-prompts/section-13-m4-starter.md`

- [ ] **Step 1: Capture M3 lessons (3-5 bullets)** focusing on:
  - Did the memory taxonomy tree visual land cleanly?
  - Did the working-memory artifact format read clearly as state-tracking, not code?
  - Multi-agent topology SVGs - any iteration on edges / labels / spacing?
  - The 4 multi-agent failure modes are dense - did the visual signal per mode hold up?
- [ ] **Step 2-3: Read M4 plan with M3 lessons in mind; edit inline if warranted.**
- [ ] **Step 4: Smoke gate.**
- [ ] **Step 5: Scope verification.**
- [ ] **Step 6: Commit lessons + plan edits.**
- [ ] **Step 7: Generate M4 starter prompt**

Create `docs/superpowers/starter-prompts/section-13-m4-starter.md`:

````markdown
# M4 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 4 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-4.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m3-lessons.md AND section-13-m2-lessons.md AND section-13-m1-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section13-milestone4"
- After M4 ships, execute the final refinement task before starting M5

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
````

Commit:

```bash
git add docs/superpowers/starter-prompts/section-13-m4-starter.md
git commit -m "Add M4 starter prompt for next session"
```

- [ ] **Step 8: M3 complete.**

---

## Notes for next session executor

Before pasting M4 starter prompt:
- Review M1+M2+M3 lessons files.
- Confirm `git log` shows all M3 commits on main.
- Verify `npm run test` green.

## What Comes Next

Milestone 4 covers Section 13 Act 7 Evals: 5 chapters (13.37-13.41). Smallest milestone in the section but the highest-stakes content - evaluations decide whether production agents ship safely.

## Self-Review Notes

- M3 has the biggest chapter count (13). Pace carefully; do not skip Chrome validation per chapter.
- Memory chapters depend on Section 11 (vector storage) back-references. Keep the cross-references explicit and accurate.
- Agentic RAG (13.36) is the bridge from Section 12. Confirm naive-RAG-vs-agentic-RAG comparison reads cleanly.
- Multi-agent failure modes (13.35) is the single highest-value chapter for production teams. Diagrams here MUST be unambiguous; if any reader confuses "drift" and "infinite loop", the chapter has failed.
- Working-memory artifact JSON in 13.25 will reappear in 13.42 (Observability tracing) - keep the field names consistent across chapters.
