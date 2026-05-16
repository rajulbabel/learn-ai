# Section 13 Milestone 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** When you dispatch a subagent for a task, the subagent prompt MUST include: (a) the verbatim Files: list from the task, (b) the instruction "modify ONLY files in the Files: list; if you find other defects, document them but do NOT fix them in this task", and (c) the instruction "run `git diff --stat` before committing; abort if any file outside the Files: list shows as modified". The parent reviews `git diff --stat` after each subagent finishes. Scope violations are rejected and the subagent re-dispatched with the same strict prompt.
>
> **Two-stage review per task:** Stage 1 SCOPE - did the subagent modify only the listed files? Are commits clean? Stage 2 CORRECTNESS - do tests pass, does behavior match the spec? Both stages must pass before moving to the next task.

**Goal:** Add Section 13 Acts 3 + 4 (12 chapters total). Act 3 Protocols (MCP + A2A) covers 13.12 WhyProtocols, 13.13 McpArchitecture, 13.14 McpPrimitives, 13.15 BuildingMcpServer, 13.16 McpSecurity, 13.17 A2AProtocol. Act 4 Workflows & Agent Loops covers 13.18 WorkflowVsAgent, 13.19 WorkflowPrimitives, 13.20 AgentLoop, 13.21 ReActPattern, 13.22 PlanExecuteReflect, 13.23 LoopTermination. The app ships at end of M2 with Section 13 having 23 navigable chapters.

**Architecture:** Act 3 extends the existing `src/sections/agent-tools.jsx` (M1 added Act 2 chapters; M2 adds 6 more Act 3 exports). Act 4 starts a NEW file `src/sections/agent-loops.jsx` which will hold Acts 4+5 (12 chapters total - Act 4 in M2, Act 5 in M3). The Section 13 loader in `src/learn-ai.jsx` grows from a 2-file `Promise.all` (agent-prompting + agent-tools, from M1) to 3-file (+ agent-loops). All chapter content follows CLAUDE.md visual rules + Section 13 spec rules (zero overlap, title-case diagram boxes, Chrome validation per chapter, artifact treatment for protocol message shapes).

**Tech Stack:** React 18, Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`

**Branch policy:** Work directly on `main`. No feature branch.

---

## Prerequisites

- M1 complete on `main`: Section 13 Acts 1+2 (13.1-13.11) implemented, tests green, Chrome-validated.
- M1 lessons captured in `docs/superpowers/lessons/section-13-m1-lessons.md`. READ BEFORE STARTING M2.
- M2 starter prompt (if executing in fresh session) at `docs/superpowers/starter-prompts/section-13-m2-starter.md`.

## File Structure

### New files

- `src/sections/agent-loops.jsx` - Acts 4+5 chapter functions. In Milestone 2 this file contains 6 exports for Act 4 (WorkflowVsAgent, WorkflowPrimitives, AgentLoop, ReActPattern, PlanExecuteReflect, LoopTermination). M3 adds 6 more for Act 5.

### Modified files

- `src/sections/agent-tools.jsx` - extend with 6 new exports for Act 3 (WhyProtocols, McpArchitecture, McpPrimitives, BuildingMcpServer, McpSecurity, A2AProtocol). M1 already wrote the Act 2 exports.
- `src/config.js` - add 12 entries to `chapters[]` (13.12-13.23).
- `src/learn-ai.jsx` - update Section 13 loader from 2-file Promise.all to 3-file Promise.all (add `agent-loops.jsx`).
- `src/__tests__/sections.test.jsx` - import `AgentLoops` namespace, spread into `lookup`, add content tests for 12 new chapters.
- `src/__tests__/config.test.js` - add tests for the 12 new chapter entries.
- `src/__tests__/lookup.test.js` - import `AgentLoops`, spread into `lookup`, add presence tests for new Act 3 + Act 4 exports.
- `src/data/svg-descriptions.json` - add entries for any new SVGs (most likely 13.13 MCP topology, 13.20 agent loop, 13.21 ReAct ladder, 13.22 plan tree).
- `CLAUDE.md` - update Section 13 mapping table (add Acts 3+4 rows) and project structure tree (add `agent-loops.jsx`).

### Unchanged

`public/llms.txt` and `index.html` already declare Section 13 (added in M1) so no edit needed unless new top-level topics emerge. All other section files.

---

## Standard running-example values (reference during implementation)

Same as M1. Re-stated here so the M2 executor doesn't need to flip back:

- **Primary scenario:** customer-support agent on the customer support knowledge base from Section 12.
- **Canonical tool inventory (8 tools):** `search_kb`, `lookup_customer`, `lookup_subscription`, `reset_password`, `change_email`, `process_refund`, `escalate_human`, `send_email`.
- **Standard tickets:** T1 password reset / T2 reset + email changed / T3 dashboard slow + 500 errors / T4 cancel + refund (refund > $200 escalation) / T5 Pro vs Enterprise.
- **Standard customer:** Alice, `alice@example.com`, `c-9924`, Pro tier.
- **Agent constants:** ctx window 8k/128k; max iter 5/10-20; tool latency 200ms; LLM latency 1.5s; cost $3/M in + $15/M out; retry 3 exp backoff.
- **Per-act Box colors (M2):**
  - Act 3 (Protocols MCP+A2A): purple family - sub-step rotation `C.purple` -> `C.indigo` -> `C.blue` -> `C.cyan` -> `C.teal` -> `C.purple`.
  - Act 4 (Workflows & Loops): orange family - sub-step rotation `C.orange` -> `C.yellow` -> `C.red` -> `C.amber` -> `C.cyan` -> `C.orange`.

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 20).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Reset Password Tool" not "reset password tool". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`temperature = 0.7`), JSON keys in artifact blocks (`"name"`, `"description"`), tokens like `[CLS]`.
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas / artifacts centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Stop hook `.claude/scripts/check-sections.sh` flags violations.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts (e.g., "covered in 13.20") are OK.
12. **No carry-over brand names** - corpus = "customer support knowledge base"; URLs = `docs.example.com`; never reintroduce a fictional company name.
13. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".
14. **Artifact treatment** (Section-13-specific) - protocol message shapes (MCP messages, A2A discovery docs, tool_use blocks), prompt templates, eval rubrics, and tool schemas render as styled monospace text blocks with tinted background (`${color}06`), soft border (`1px solid ${color}12`), monospace 14-16px font. Labeled "MCP Message (shape)" / "A2A Discovery Doc (shape)" / "Tool Schema (shape)" / etc. NEVER as executable code. NEVER include language fences with executable framing.

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 13 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding a NEW section file (`src/sections/agent-loops.jsx` in M2), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as AgentLoops from "../sections/agent-loops.jsx"`, (b) presence tests asserting `typeof mod.ChapterName === "function"` for each export, AND (c) spread `...AgentLoops` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as AgentLoops`, (b) spread `...AgentLoops` into the `lookup` object.
- `src/learn-ai.jsx` - extend Section 13's loader via `Promise.all` to include `agent-loops.jsx`. M2 grows the loader from 2-file (M1) to 3-file.

### When adding chapters to `chapters[]` (Act 3 chapters in M2 which extend `agent-tools.jsx`, plus Act 4 chapters in the new `agent-loops.jsx`):

- `src/__tests__/config.test.js` - add a "Section 13 Act 3+4 chapters" describe block testing the specific new entries (13.12-13.23).
- The relevant section file must already export each new `component`. If it doesn't, the lookup-spread will resolve the symbol as `undefined` and `sections.test.jsx`'s generic test fails with "fn is not a function". M2 extends `agent-tools.jsx` with Act 3 exports and creates `agent-loops.jsx` with Act 4 exports.
- If new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

For Section 13 in M2, the loader becomes 3-file `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. Append `agent-loops.jsx` to the existing 2-file loader from M1.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

1. Task 0 - Name session.
2. Task 1 - Verify M1 green baseline.
3. Task 2 - Create `agent-loops.jsx` with 6 Act 4 stub exports.
4. Task 3 - Extend `agent-tools.jsx` with 6 Act 3 stub exports.
5. Task 4 - Update `learn-ai.jsx` loader to 3-file Promise.all.
6. Task 5 - Add chapter entries 13.12-13.23 to `chapters[]`.
7. Task 6 - Register `AgentLoops` in test lookups + add new presence tests for Act 3 exports under `AgentTools`.
8. Tasks 7-18 - Implement chapters 13.12 through 13.23 (12 chapters, one task each).
9. Task 19 - Update `CLAUDE.md` mapping table + project structure.
10. Task 20 - Chrome browser visual validation of all 12 new chapters.
11. Task 21 - Final M2 verification.
12. Task 22 - Plan Refinement Checkpoint for M3 (lessons + M3 starter prompt).

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section13-milestone2`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section13-milestone2` (if your Claude Code build supports it).
- Settings: set the session title via `/config` or the IDE extension's session pane.
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section13-milestone2" so future searches catch it.

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section13-milestone2` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section13-milestone2`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify M1 green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean`.

- [ ] **Step 2: Confirm M1 commits on `main`**

```bash
git log --oneline -30 | head -30
```

Expected: M1 commits visible in the log, ending with the M2 starter prompt commit ("Add M2 starter prompt for next session"). If the log doesn't show M1 ending cleanly, do NOT proceed; investigate.

- [ ] **Step 3: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass. If any test fails, do NOT proceed; trace the failure first.

- [ ] **Step 4: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Confirm shipped artifacts use the IETF-reserved example domain only**

```bash
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" || echo "domain clean"
```

Expected: `domain clean`. If a non-`example.com` vendor-shaped domain appears in shipped artifacts, regenerate the search index (`npm run search:extract`) and re-verify before proceeding. A leaked vendor domain would propagate into M2 content.

- [ ] **Step 6: No commit yet** - this task only verifies baseline.

---

## Task 2: Create `src/sections/agent-loops.jsx` scaffold with 6 stub exports

**Files:**
- Create: `src/sections/agent-loops.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Create the file with 6 named stub exports for Act 4**

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Acts 4 + 5: Workflows / Agent Loops + Memory
// Chapters 13.18 - 13.29. In Milestone 2 only 13.18 - 13.23 are non-stub; Act 5 (13.24 - 13.29) is added in Milestone 3.

export const WorkflowVsAgent = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Workflow vs Agent
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};

export const WorkflowPrimitives = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Workflow Primitives - Chaining, Routing, Parallelization
        </T>
        <T size={16}>Stub - implemented in Task 14.</T>
      </Box>
    </div>
  );
};

export const AgentLoop = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          The Agent Loop
        </T>
        <T size={16}>Stub - implemented in Task 15.</T>
      </Box>
    </div>
  );
};

export const ReActPattern = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          ReAct Pattern
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const PlanExecuteReflect = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Plan-Execute + Reflection
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const LoopTermination = (ctx) => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Loop Termination
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Scope verification + commit**

```bash
git add src/sections/agent-loops.jsx
git commit -m "Add agent-loops.jsx scaffold with 6 stub exports for Section 13 Act 4"
```

---

## Task 3: Extend `src/sections/agent-tools.jsx` with 6 Act 3 stubs

**Files:**
- Modify: `src/sections/agent-tools.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Append 6 named stub exports for Act 3**

At the bottom of the existing `src/sections/agent-tools.jsx` (which already exports the 5 Act 2 chapters from M1), append:

```jsx
// Section 13 Act 3: Protocols (MCP + A2A)
// Chapters 13.12 - 13.17

export const WhyProtocols = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          Why Protocols?
        </T>
        <T size={16}>Stub - implemented in Task 7.</T>
      </Box>
    </div>
  );
};

export const McpArchitecture = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          MCP Architecture
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const McpPrimitives = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          MCP Primitives - Tools, Resources, Prompts
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const BuildingMcpServer = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          Building an MCP Server
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const McpSecurity = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          MCP Security
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const A2AProtocol = (ctx) => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          A2A - Agent-to-Agent Protocol
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Scope verification + commit**

```bash
git add src/sections/agent-tools.jsx
git commit -m "Extend agent-tools.jsx with 6 stub exports for Section 13 Act 3"
```

---

## Task 4: Update `learn-ai.jsx` loader to include `agent-loops.jsx`

**Files:**
- Modify: `src/learn-ai.jsx`

**Scope binding:** Only this file.

- [ ] **Step 1: Update Section 13 loader**

Locate the Section 13 entry in `sectionLoaders` (added in M1):

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

Change to 3-file:

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
    import("./sections/agent-loops.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 2: Full test smoke gate**

```bash
npm run test
```

Expected: pass. Agent-loops stubs are wired but no chapters point to them yet.

- [ ] **Step 3: Scope verification + commit**

```bash
git add src/learn-ai.jsx
git commit -m "Extend Section 13 loader to include agent-loops.jsx"
```

---

## Task 5: Add 12 chapter entries (13.12-13.23) to `chapters[]` in `config.js`

**Files:**
- Modify: `src/config.js`
- Modify: `src/__tests__/config.test.js`

**Scope binding:** Only these two.

- [ ] **Step 1: Write failing tests**

Append to `src/__tests__/config.test.js`:

```js
describe("Section 13 Act 3+4 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.12 WhyProtocols", () => {
    const c = findCh("13.12");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Protocols?");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyProtocols");
  });

  it("has 13.13 McpArchitecture", () => {
    const c = findCh("13.13");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Architecture");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpArchitecture");
  });

  it("has 13.14 McpPrimitives", () => {
    const c = findCh("13.14");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Primitives - Tools, Resources, Prompts");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpPrimitives");
  });

  it("has 13.15 BuildingMcpServer", () => {
    const c = findCh("13.15");
    expect(c).toBeDefined();
    expect(c.title).toBe("Building an MCP Server");
    expect(c.section).toBe(13);
    expect(c.component).toBe("BuildingMcpServer");
  });

  it("has 13.16 McpSecurity", () => {
    const c = findCh("13.16");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Security");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpSecurity");
  });

  it("has 13.17 A2AProtocol", () => {
    const c = findCh("13.17");
    expect(c).toBeDefined();
    expect(c.title).toBe("A2A - Agent-to-Agent Protocol");
    expect(c.section).toBe(13);
    expect(c.component).toBe("A2AProtocol");
  });

  it("has 13.18 WorkflowVsAgent", () => {
    const c = findCh("13.18");
    expect(c).toBeDefined();
    expect(c.title).toBe("Workflow vs Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkflowVsAgent");
  });

  it("has 13.19 WorkflowPrimitives", () => {
    const c = findCh("13.19");
    expect(c).toBeDefined();
    expect(c.title).toBe("Workflow Primitives - Chaining, Routing, Parallelization");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkflowPrimitives");
  });

  it("has 13.20 AgentLoop", () => {
    const c = findCh("13.20");
    expect(c).toBeDefined();
    expect(c.title).toBe("The Agent Loop");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentLoop");
  });

  it("has 13.21 ReActPattern", () => {
    const c = findCh("13.21");
    expect(c).toBeDefined();
    expect(c.title).toBe("ReAct Pattern");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ReActPattern");
  });

  it("has 13.22 PlanExecuteReflect", () => {
    const c = findCh("13.22");
    expect(c).toBeDefined();
    expect(c.title).toBe("Plan-Execute + Reflection");
    expect(c.section).toBe(13);
    expect(c.component).toBe("PlanExecuteReflect");
  });

  it("has 13.23 LoopTermination", () => {
    const c = findCh("13.23");
    expect(c).toBeDefined();
    expect(c.title).toBe("Loop Termination");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LoopTermination");
  });
});
```

- [ ] **Step 2: Verify failure**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 Act 3\\+4"
```

Expected: FAIL.

- [ ] **Step 3: Add 12 entries to `chapters[]`**

After the M1 entries (13.1-13.11), append:

```js
{ id: "13.12", title: "Why Protocols?", section: 13, component: "WhyProtocols" },
{ id: "13.13", title: "MCP Architecture", section: 13, component: "McpArchitecture" },
{ id: "13.14", title: "MCP Primitives - Tools, Resources, Prompts", section: 13, component: "McpPrimitives" },
{ id: "13.15", title: "Building an MCP Server", section: 13, component: "BuildingMcpServer" },
{ id: "13.16", title: "MCP Security", section: 13, component: "McpSecurity" },
{ id: "13.17", title: "A2A - Agent-to-Agent Protocol", section: 13, component: "A2AProtocol" },
{ id: "13.18", title: "Workflow vs Agent", section: 13, component: "WorkflowVsAgent" },
{ id: "13.19", title: "Workflow Primitives - Chaining, Routing, Parallelization", section: 13, component: "WorkflowPrimitives" },
{ id: "13.20", title: "The Agent Loop", section: 13, component: "AgentLoop" },
{ id: "13.21", title: "ReAct Pattern", section: 13, component: "ReActPattern" },
{ id: "13.22", title: "Plan-Execute + Reflection", section: 13, component: "PlanExecuteReflect" },
{ id: "13.23", title: "Loop Termination", section: 13, component: "LoopTermination" },
```

- [ ] **Step 4: Verify pass**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 Act 3\\+4"
```

Expected: PASS.

- [ ] **Step 5: Full smoke gate**

```bash
npm run test
```

Expected: `lookup.test.js` and `sections.test.jsx` will fail for the 12 new components until Task 6 registers them. Other tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 13.12-13.23 to config for Section 13 Act 3+4"
```

---

## Task 6: Register AgentLoops + new AgentTools exports in test lookups

**Files:**
- Modify: `src/__tests__/lookup.test.js`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

- [ ] **Step 1: Update `src/__tests__/lookup.test.js`**

Add the static import:

```js
import * as AgentLoops from "../sections/agent-loops.jsx";
```

Spread into `lookup`:

```js
const lookup = {
  ...TOC,
  ...NeuralFoundations,
  // ... existing spreads ...
  ...AgentPrompting,
  ...AgentTools,
  ...AgentLoops,
};
```

Add presence tests:

```js
describe("Section 13 Act 3 component presence (AgentTools)", () => {
  it("AgentTools exports each Act 3 chapter", () => {
    expect(typeof AgentTools.WhyProtocols).toBe("function");
    expect(typeof AgentTools.McpArchitecture).toBe("function");
    expect(typeof AgentTools.McpPrimitives).toBe("function");
    expect(typeof AgentTools.BuildingMcpServer).toBe("function");
    expect(typeof AgentTools.McpSecurity).toBe("function");
    expect(typeof AgentTools.A2AProtocol).toBe("function");
  });
});

describe("Section 13 Act 4 component presence (AgentLoops)", () => {
  it("AgentLoops exports each Act 4 chapter", () => {
    expect(typeof AgentLoops.WorkflowVsAgent).toBe("function");
    expect(typeof AgentLoops.WorkflowPrimitives).toBe("function");
    expect(typeof AgentLoops.AgentLoop).toBe("function");
    expect(typeof AgentLoops.ReActPattern).toBe("function");
    expect(typeof AgentLoops.PlanExecuteReflect).toBe("function");
    expect(typeof AgentLoops.LoopTermination).toBe("function");
  });
});
```

- [ ] **Step 2: Update `src/__tests__/sections.test.jsx`**

Add the static import:

```js
import * as AgentLoops from "../sections/agent-loops.jsx";
```

Spread `...AgentLoops` into the existing `lookup` object.

- [ ] **Step 3: Run full smoke gate**

```bash
npm run test
```

Expected: ALL tests pass. Stubs render valid JSX.

- [ ] **Step 4: Scope + commit**

```bash
git add src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Register AgentLoops and Act 3 AgentTools exports in test lookups"
```

---

## Task 7: Implement Chapter 13.12 WhyProtocols

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Open Act 3 by showing why ad-hoc tool wiring breaks at scale. M tools × N agents = M×N hand-crafted connectors. A protocol turns it into M+N (each tool implements the protocol once, each agent reads the protocol once). Compare 3 protocols (MCP for agent ↔ tools, A2A for agent ↔ agent, HTTP+OpenAPI as legacy reference). End by introducing the trust boundary that protocols enforce.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - The sprawl problem**
  Title: "Ad-Hoc Tools Don't Scale"
  Visual: a tangled graph - 5 agents on top, 6 tools on bottom, every agent has its own connector to every tool. 30 lines criss-crossing. Annotate "Every new tool needs every agent to learn it; every new agent needs every tool's API rewritten."
  Key content: "ad-hoc|sprawl|tangle", "agent", "tool", "5", "6" or count words.

- **sub=1 (C.indigo) - Hub and spoke**
  Title: "A Protocol Turns M x N Into M + N"
  Visual: same agents and tools, but now each routes through a "Protocol" hub in the middle. Lines are 5 + 6 = 11 instead of 30. Annotate the math.
  Key content: "protocol", "hub", "M + N|M plus N|11", "30".

- **sub=2 (C.blue) - Three protocols to know**
  Title: "MCP, A2A, OpenAPI"
  Visual: 3 horizontal cards:
  - MCP (Model Context Protocol): agent ↔ tools / resources / prompts. Production today.
  - A2A (Agent-to-Agent): agent ↔ agent. Newer, Google-driven.
  - OpenAPI / HTTP: legacy general-purpose service contracts. Still common as the underlying transport.
  Key content: "MCP", "A2A", "OpenAPI", "agent.*tool", "agent.*agent".

- **sub=3 (C.cyan) - When the protocol pays off**
  Title: "Production Sign: 3+ Tools Or 3+ Agents"
  Visual: a 2x2 quadrant. Few tools / few agents: ad-hoc fine. Many tools / few agents: protocol on tool side. Few tools / many agents: protocol on agent side. Many of both: full protocol mesh. Decision rule: cross 3+3 and you want a protocol.
  Key content: "production|payoff|pays off", "3", "few|many", "decision".

- **sub=4 (C.teal) - Trust boundaries**
  Title: "Protocol = Sandbox Contract"
  Visual: an "outer ring (host, trusted) / inner ring (server, untrusted)" boundary diagram. Annotate that the protocol defines what the inner can ask for and what the outer must approve before allowing.
  Key content: "trust|boundary|sandbox", "host", "server".

- [ ] **Step 1: Write content tests**

```js
describe("WhyProtocols (13.12) content", () => {
  const fn = AgentTools.WhyProtocols;

  it("sub=0 shows the ad-hoc sprawl", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/ad.?hoc|sprawl|tangle/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/tool/i);
  });

  it("sub=1 explains M+N hub model", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/protocol/i);
    expect(container.textContent).toMatch(/hub|center/i);
    expect(container.textContent).toMatch(/m \+ n|m plus n|11|30/i);
  });

  it("sub=2 lists MCP, A2A, OpenAPI", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/OpenAPI|HTTP/i);
  });

  it("sub=3 shows when protocol pays off", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3|few|many/i);
    expect(container.textContent).toMatch(/decision|production/i);
  });

  it("sub=4 frames protocol as trust boundary", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/trust|sandbox|boundary/i);
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/server/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyProtocols"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full WhyProtocols chapter**

Replace the stub export in `src/sections/agent-tools.jsx` with the full implementation. Use the existing pattern in `src/sections/rag-foundations.jsx` (e.g., `WhyLLMsNeedRetrieval`) as a reference. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified in the Sub-step structure section above (`C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Ad-Hoc Tools Don't Scale", "A Protocol Turns M x N Into M + N", "MCP, A2A, OpenAPI" - every word capitalized.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- The tangled-graph diagram in sub=0 needs an SVG with labeled nodes + lines. Add `<desc>` as the first child + corresponding entry in `src/data/svg-descriptions.json`. The non-planar layout is INTENTIONAL for sub=0 (crossings show the sprawl problem); do not try to make it planar.
- The hub-and-spoke diagram in sub=1 should be centered with symmetric padding in its `viewBox`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on (see test regexes above).
- Standalone artifacts / formulas centered with `textAlign: "center"`.
- No "Preview:" / "Next:" / "Coming up:" forward references.
- No carry-over brand names; URLs (if any) use `docs.example.com`.

Follow the spec's chapter 13.12 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WhyProtocols"
```

Expected: PASS. Both generic sub-coverage and specific content tests pass.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

Expected: all tests pass. No regressions in other sections.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

Expected: no errors. `npm run format` may modify the files; re-add after formatting.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass, not just the ones added in this task. If any unrelated test fails, you missed a cross-file dependency (see "Cross-file dependency map" near the top of this plan). Trace the failure to the missing update before committing.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified or new. If any file outside the list appears, abort: either move the change to the correct task or revert it before committing this task.

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.12 Why Protocols"
```

---

## Task 8: Implement Chapter 13.13 McpArchitecture

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Walk through MCP's three-role architecture (Host application, Client living inside the host, Server providing tools / resources / prompts). Show the typical topology (1 host hosts N clients, each speaks to one or more servers). Cover transports (stdio, HTTP, SSE) and the connect → list → call lifecycle.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - Three roles**
  Title: "Host, Client, Server"
  Visual: 3 vertically stacked labeled boxes. Host (the app, e.g., Claude Desktop, your IDE), Client (lives inside the host, one per server connection), Server (provides tools / resources / prompts; runs as a separate process or remote service). Annotate which role does what.
  Key content: "host", "client", "server", "tools|resources|prompts".

- **sub=1 (C.indigo) - Typical topology**
  Title: "One Host, Many Clients, Many Servers"
  Visual: a hub topology. 1 host (center, top), 3 clients inside it (middle), each client connected to a different server (bottom). Server-1: a Postgres tool. Server-2: a Linear / Jira-style tool. Server-3: a filesystem tool. Real-world setup.
  Key content: "topology|hub", "one|1", "many|3", "server".

- **sub=2 (C.blue) - Transports**
  Title: "stdio, HTTP, SSE"
  Visual: 3 cards:
  - stdio: local-only, child process, fastest, no network. Used by Claude Desktop and local MCP servers.
  - HTTP: network-capable, supports remote servers, request/response, needs auth.
  - SSE (Server-Sent Events): network + streaming intermediate updates. Used when the server needs to push.
  Each card with a "when to use" line.
  Key content: "stdio", "http", "sse|server.sent", "transport", "local|network".

- **sub=3 (C.cyan) - The connect → list → call lifecycle**
  Title: "How A Session Begins And Runs"
  Visual: a 5-step horizontal flow: 1) Host launches Client. 2) Client connects to Server (transport). 3) Initialize handshake (capabilities exchanged). 4) Client lists available tools / resources / prompts. 5) Client calls a tool, gets a result. Each step boxed and annotated.
  Key content: "initialize|handshake", "list", "call", "lifecycle|flow".

- **sub=4 (C.teal) - Discovery: how host knows what's available**
  Title: "Listing Capabilities"
  Visual: styled mono-text artifact labeled "MCP Message (shape) - tools/list response" showing the response shape with 2 tools listed (each with name + description + input_schema). Highlight that the host uses this list to populate the model's tool list.
  Key content: "list|discovery", "tools/list|capabilities", "name", "description".

- [ ] **Step 1: Write content tests**

```js
describe("McpArchitecture (13.13) content", () => {
  const fn = AgentTools.McpArchitecture;

  it("sub=0 names host, client, server", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/client/i);
    expect(container.textContent).toMatch(/server/i);
  });

  it("sub=1 shows the one-host many-clients topology", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/topology|hub/i);
    expect(container.textContent).toMatch(/server/i);
  });

  it("sub=2 lists stdio, HTTP, SSE transports", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/stdio/i);
    expect(container.textContent).toMatch(/http/i);
    expect(container.textContent).toMatch(/sse|server.sent/i);
  });

  it("sub=3 walks the lifecycle", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/initialize|handshake/i);
    expect(container.textContent).toMatch(/list/i);
    expect(container.textContent).toMatch(/call/i);
  });

  it("sub=4 shows the tools/list response shape", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/tools.list|capabilit/i);
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpArchitecture"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full McpArchitecture chapter**

Replace the stub export in `src/sections/agent-tools.jsx` with the full implementation. Use the existing pattern in `src/sections/rag-foundations.jsx` as a reference. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`.
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Host, Client, Server", "One Host, Many Clients, Many Servers", "Stdio, HTTP, SSE" - every word capitalized.
- The host/client/server topology and the 1-N topology in sub=0/sub=1 each need an SVG centered in its `viewBox` with symmetric padding (`x_start = (viewBox_width - element_span) / 2`). Add `<desc>` as first child + entry in `src/data/svg-descriptions.json`.
- The `tools/list` response artifact in sub=4 renders as styled mono-text (NOT a code block): tinted background `${C.teal}06`, border `1px solid ${C.teal}12`, monospace 14-16px, centered, labeled "MCP Message (shape) - tools/list response".
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on (see test regexes above).
- Standalone artifacts / formulas centered with `textAlign: "center"`.
- No "Preview:" / "Next:" / "Coming up:" forward references.
- No carry-over brand names; URLs (if any) use `docs.example.com`.

Follow the spec's chapter 13.13 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpArchitecture"
```

Expected: PASS.

- [ ] **Step 5: Run the full test suite**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

Expected: no errors. `npm run format` may modify the files; re-add after.

- [ ] **Step 7: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 8: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified.

- [ ] **Step 9: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.13 MCP Architecture"
```

---

## Task 9: Implement Chapter 13.14 McpPrimitives

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The three primitives MCP servers expose - Tools (callable actions), Resources (readable data), Prompts (parameterized templates). Show when to use each. Concrete examples from the customer-support scenario.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - Three primitives**
  Title: "Tools, Resources, Prompts"
  Visual: 3 columns side-by-side. Column 1 Tools - "Things the model can DO". Column 2 Resources - "Things the model can READ". Column 3 Prompts - "Templates the host can offer". One example in each.
  Key content: "tools", "resources", "prompts", "do|action", "read|data", "template".

- **sub=1 (C.indigo) - Tools = actions**
  Title: "Tool: process_refund"
  Visual: a labeled card showing a Tool entry: name `process_refund`, input_schema `{invoice_id, reason}`, has side effects ($-mutation). The MODEL chooses when to call.
  Key content: "process_refund", "side effect", "mutation|mutate", "tool".

- **sub=2 (C.blue) - Resources = readable data**
  Title: "Resource: kb://articles/password-reset"
  Visual: a URI-style resource identifier. `kb://articles/password-reset` -> content (markdown body of the doc). The HOST decides when to read (e.g., before calling the model on a ticket). Resources are READ-ONLY by convention.
  Key content: "kb://|resource", "uri|identifier", "read.only|read only", "articles".

- **sub=3 (C.cyan) - Prompts = parameterized templates**
  Title: "Prompt: summarize_ticket"
  Visual: a styled mono artifact labeled "MCP Prompt (shape)" showing a parameterized prompt template:
  ```
  {
    "name": "summarize_ticket",
    "description": "Summarize a support ticket conversation.",
    "arguments": [
      { "name": "ticket_id", "required": true },
      { "name": "max_words", "required": false }
    ]
  }
  ```
  The HOST surfaces these as slash-commands or quick actions for users.
  Key content: "summarize_ticket", "argument", "template", "required", "host".

- **sub=4 (C.teal) - When to use which**
  Title: "Action vs Data vs Template"
  Visual: a decision card:
  - "Need to DO something (mutate state, call API)?" -> Tool.
  - "Need to READ something (fact, doc, file)?" -> Resource.
  - "Need a reusable prompt template the user can invoke?" -> Prompt.
  Decision rule: tool if side-effecting; resource if read-only data; prompt if template the user picks.
  Key content: "action|mutate", "read|data", "template", "decision|when".

- [ ] **Step 1: Write content tests**

```js
describe("McpPrimitives (13.14) content", () => {
  const fn = AgentTools.McpPrimitives;

  it("sub=0 names the three primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
  });

  it("sub=1 shows a tool example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/side effect|mutate/i);
  });

  it("sub=2 shows a resource URI", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/read.?only|read only/i);
  });

  it("sub=3 shows a prompt with arguments", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|parameter|required/i);
  });

  it("sub=4 explains when to use which", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/action|mutate|do/i);
    expect(container.textContent).toMatch(/read|data/i);
    expect(container.textContent).toMatch(/template/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpPrimitives"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full McpPrimitives chapter**

Replace the stub export in `src/sections/agent-tools.jsx` with the full implementation. Use `src/sections/rag-foundations.jsx` patterns as a reference. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`.
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Tools, Resources, Prompts", "Tool: process_refund", "Resource: kb://articles/password-reset" (URI is a literal value - keep its case as the actual URI shape).
- The prompt artifact in sub=3 renders as styled mono-text labeled "MCP Prompt (shape)", NOT a code block: `${C.cyan}06` background, `1px solid ${C.cyan}12` border, monospace 14-16px, centered.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts / formulas centered.
- No forward references; no carry-over brand names.

Follow the spec and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpPrimitives"
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
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.14 MCP Primitives - Tools, Resources, Prompts"
```

---

## Task 10: Implement Chapter 13.15 BuildingMcpServer

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Walk through what a server author actually declares - tool registration, resource registration, prompt registration, then start. The visual is a conceptual server skeleton (NOT executable code). Show the order of operations.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.purple) - Server skeleton**
  Title: "What An MCP Server Declares"
  Visual: a labeled list of 4 phases:
  1. Define identity (name, version).
  2. Declare tools.
  3. Declare resources.
  4. Declare prompts.
  Then: 5. Start (begin listening on transport).
  Annotate: "Each declaration registers what the server offers; start opens the connection."
  Key content: "name|identity", "declare", "tools", "resources", "prompts", "start".

- **sub=1 (C.indigo) - Declaring a tool**
  Title: "Tool: search_kb"
  Visual: a styled mono artifact labeled "MCP Server - Tool Registration (shape)":
  ```
  Server.registerTool({
    name: "search_kb",
    description: "Search the customer support knowledge base.",
    inputSchema: { query: "string" },
    handler: async ({ query }) => { /* search logic */ }
  })
  ```
  Highlight name / description / inputSchema / handler. Stress that handler is server-side, not in the model's context.
  Key content: "registerTool|register", "search_kb", "handler", "inputSchema|input_schema".

- **sub=2 (C.blue) - Declaring a resource**
  Title: "Resource: kb://articles/{id}"
  Visual: a styled mono artifact labeled "MCP Server - Resource Registration (shape)" with a templated URI pattern. Show the host requesting `kb://articles/password-reset` and the server matching the template, reading the doc, returning the markdown.
  Key content: "registerResource|resource", "uri", "kb://", "template|pattern".

- **sub=3 (C.cyan) - Declaring a prompt**
  Title: "Prompt: summarize_ticket"
  Visual: registration shape for a parameterized prompt. Server returns the resolved prompt string when the host invokes it with arguments.
  Key content: "registerPrompt|prompt", "summarize_ticket", "argument".

- **sub=4 (C.teal) - Lifecycle: start, list, serve**
  Title: "Server Lifecycle"
  Visual: a 4-step state diagram - REGISTERED (definitions declared) -> LISTENING (transport open) -> ACTIVE (handling list / call requests) -> CLOSED (shutdown). Annotate which request kinds happen in ACTIVE.
  Key content: "register", "listen", "active", "shutdown|close|closed".

- **sub=5 (C.purple) - Testing the server in isolation**
  Title: "Test Before Connecting"
  Visual: a tip card:
  - Test handler functions as plain unit tests (call them directly with sample inputs).
  - Test list responses (assert all declared tools appear).
  - Test transport connection (assert handshake completes).
  - Use a mock host before connecting to a real LLM.
  Production hygiene message.
  Key content: "test", "unit|handler", "transport|connect", "mock|isolation".

- [ ] **Step 1: Write content tests**

```js
describe("BuildingMcpServer (13.15) content", () => {
  const fn = AgentTools.BuildingMcpServer;

  it("sub=0 shows the skeleton phases", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/declare|register/i);
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
  });

  it("sub=1 shows tool registration shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/handler/i);
  });

  it("sub=2 shows resource registration", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/template|uri/i);
  });

  it("sub=3 shows prompt registration", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|prompt/i);
  });

  it("sub=4 shows the lifecycle", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/lifecycle|state|listen/i);
    expect(container.textContent).toMatch(/active/i);
  });

  it("sub=5 lists testing strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/test/i);
    expect(container.textContent).toMatch(/handler|unit/i);
    expect(container.textContent).toMatch(/mock|isolat/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "BuildingMcpServer"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full BuildingMcpServer chapter**

Replace the stub export in `src/sections/agent-tools.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`, `C.purple`.
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "What An MCP Server Declares", "Tool: search_kb", "Server Lifecycle".
- The tool / resource / prompt registration artifacts (subs 1, 2, 3) render as styled mono-text labeled "MCP Server - Tool Registration (shape)" / "MCP Server - Resource Registration (shape)" / "MCP Server - Prompt Registration (shape)". Tinted background, soft border, monospace 14-16px, centered. NOT code blocks.
- The lifecycle state diagram in sub=4 is an SVG centered in its `viewBox` with symmetric padding. Add `<desc>` + `svg-descriptions.json` entry.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered with `textAlign: "center"`.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.15 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "BuildingMcpServer"
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
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.15 Building an MCP Server"
```

---

## Task 11: Implement Chapter 13.16 McpSecurity

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** MCP's security model. The server is untrusted code; the host enforces sandbox / capability scope / OAuth / consent / audit. Walk through each layer and show why they matter (a prompt-injection attack via a tool's name could exfiltrate data without consent prompts).

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - Trust boundary**
  Title: "Server Code Is Untrusted By Default"
  Visual: an "outer ring (trusted host) / inner ring (untrusted server)" boundary diagram. Annotate that the host has the user's data + the model; the server runs arbitrary code from a third party.
  Key content: "trust|untrusted", "host", "server", "boundary".

- **sub=1 (C.indigo) - Sandboxing**
  Title: "Sandbox: Process Isolation"
  Visual: a process-isolation diagram. Host process spawns server in a separate process (or container). Server can only communicate via the MCP transport. No filesystem access except what the host grants. No network unless allowed.
  Key content: "sandbox", "process", "isolation", "filesystem|fs", "network".

- **sub=2 (C.blue) - Capability scope**
  Title: "Capability Scope Per Host"
  Visual: a card listing scopes the host can grant or deny per connection:
  - Allowed tools: subset of what server declares (deny `escalate_human` for a junior agent).
  - Allowed resources: prefix-matched (allow `kb://articles/*` but not `kb://internal/*`).
  - Allowed mutation: read-only mode flag.
  Key content: "capability|scope", "allow|deny", "subset|prefix", "read.?only".

- **sub=3 (C.cyan) - OAuth for HTTP transports**
  Title: "OAuth: Who Granted What"
  Visual: a 4-step OAuth flow - User authorizes -> Host gets access token -> Token passes to server in each request -> Server checks scope. Annotate that stdio servers skip OAuth (local trust); HTTP servers require it.
  Key content: "OAuth|oauth", "token", "authorize|grant", "scope".

- **sub=4 (C.teal) - Consent prompts and audit log**
  Title: "Consent + Audit: User Sees Everything"
  Visual: 2 cards:
  - Consent prompts: "About to call `process_refund` for invoice INV-9924 with reason 'customer requested'. Allow? [Approve] [Deny]". Required for side-effecting tools.
  - Audit log: every tool call recorded with timestamp, tool name, input, result, user identity, consent decision. Production requirement.
  Key content: "consent|approval", "audit|log", "approve|deny", "timestamp|record".

- [ ] **Step 1: Write content tests**

```js
describe("McpSecurity (13.16) content", () => {
  const fn = AgentTools.McpSecurity;

  it("sub=0 frames trust boundary", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trust|untrusted/i);
    expect(container.textContent).toMatch(/boundary|host|server/i);
  });

  it("sub=1 describes sandbox isolation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/sandbox/i);
    expect(container.textContent).toMatch(/process|isolat/i);
  });

  it("sub=2 lists capability scope", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|scope/i);
    expect(container.textContent).toMatch(/allow|deny/i);
  });

  it("sub=3 shows OAuth flow", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/oauth/i);
    expect(container.textContent).toMatch(/token/i);
  });

  it("sub=4 explains consent prompts and audit log", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/consent|approval/i);
    expect(container.textContent).toMatch(/audit|log/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpSecurity"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full McpSecurity chapter**

Replace the stub export in `src/sections/agent-tools.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`.
- Center-aligned titles. Title-case for all diagram box text. "Server Code Is Untrusted By Default", "Process Isolation", "OAuth: Who Granted What", "Consent + Audit: User Sees Everything".
- The trust-boundary diagram (sub=0) and the OAuth flow (sub=3) use SVG centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.16 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "McpSecurity"
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
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.16 MCP Security"
```

---

## Task 12: Implement Chapter 13.17 A2AProtocol

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** A2A (Agent-to-Agent) protocol. Where MCP handles agent ↔ tool, A2A handles agent ↔ agent. Show the discovery doc (`agent.json` shape), task delegation flow, streaming intermediate updates, and the customer-support example where a triage agent delegates a billing case to a billing agent.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.purple) - MCP vs A2A**
  Title: "Agent To Tool, Agent To Agent"
  Visual: a 2-row comparison. Row 1: MCP - one agent calls many tools. Row 2: A2A - one agent delegates a task to another agent. Annotate when each fits.
  Key content: "MCP", "A2A", "tool", "agent", "delegate".

- **sub=1 (C.indigo) - Discovery: agent.json**
  Title: "agent.json - The Agent's Card"
  Visual: a styled mono artifact labeled "A2A Discovery Doc (shape)":
  ```
  {
    "name": "billing-specialist-v2",
    "description": "Handles billing-related support tickets including refunds, downgrades, and invoice disputes.",
    "skills": ["billing", "refund", "invoice"],
    "endpoint": "https://agents.example.com/billing",
    "auth": { "type": "oauth2" }
  }
  ```
  Highlight name, description, skills, endpoint, auth. Other agents discover this and decide whether to delegate.
  Key content: "agent.json", "discovery", "skills", "endpoint", "billing".

- **sub=2 (C.blue) - Task delegation flow**
  Title: "Triage Delegates To Billing"
  Visual: a 5-step flow:
  1. Triage agent classifies ticket T4 as billing.
  2. Triage looks up agents with skill "billing".
  3. Triage sends a delegation request with full ticket context.
  4. Billing agent works the ticket (calls tools, etc.).
  5. Billing agent returns the result to triage.
  Annotate that the delegation includes the conversation history so the billing agent has context.
  Key content: "delegate|delegation", "triage", "billing", "T4|ticket t4", "context|history".

- **sub=3 (C.cyan) - Streaming intermediate updates**
  Title: "Long Tasks Stream Progress"
  Visual: a timeline. Triage delegates -> Billing agent emits "Looked up customer..." -> Billing agent emits "Processing refund..." -> Billing agent emits "Refund > $200, need approval" -> Triage receives final result. Streamed updates so the triage agent (and ultimately the user) sees progress.
  Key content: "stream", "progress|update", "long", "intermediate".

- **sub=4 (C.teal) - When A2A vs MCP**
  Title: "Two Protocols, Two Roles"
  Visual: a decision card:
  - "Need to call a function?" -> MCP tool.
  - "Need to read a doc?" -> MCP resource.
  - "Need an entire other agent to handle a sub-problem?" -> A2A delegation.
  Production rule: A2A is heavier than MCP; use it when the delegated work needs the receiving agent's own loop, memory, and tools - not just a single function call.
  Key content: "A2A|MCP", "delegate", "loop|sub.problem", "decision|when".

- [ ] **Step 1: Write content tests**

```js
describe("A2AProtocol (13.17) content", () => {
  const fn = AgentTools.A2AProtocol;

  it("sub=0 contrasts MCP and A2A scope", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/delegat|agent.*agent/i);
  });

  it("sub=1 shows the agent.json discovery doc", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/agent\.json|discovery/i);
    expect(container.textContent).toMatch(/skills|endpoint/i);
    expect(container.textContent).toMatch(/billing/i);
  });

  it("sub=2 traces the delegation flow on T4", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/T4|ticket t4|delegat/i);
  });

  it("sub=3 explains streaming intermediate updates", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/progress|update|intermediate/i);
  });

  it("sub=4 explains when A2A vs MCP", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/decision|when/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "A2AProtocol"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full A2AProtocol chapter**

Replace the stub export in `src/sections/agent-tools.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.purple`, `C.indigo`, `C.blue`, `C.cyan`, `C.teal`.
- Center-aligned titles. Title-case for all diagram box text. "Agent To Tool, Agent To Agent", "Agent.json - The Agent's Card", "Triage Delegates To Billing".
- The `agent.json` artifact in sub=1 renders as styled mono-text labeled "A2A Discovery Doc (shape)": tinted background `${C.indigo}06`, border `1px solid ${C.indigo}12`, monospace 14-16px, centered. NOT a code block.
- The delegation flow in sub=2 and the streaming timeline in sub=3 use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names. `endpoint: "https://agents.example.com/billing"` uses `example.com`.

Follow the spec's chapter 13.17 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "A2AProtocol"
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
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.17 A2A - Agent-to-Agent Protocol"
```

---

## Task 13: Implement Chapter 13.18 WorkflowVsAgent

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Anthropic's distinction. A workflow is a fixed DAG (deterministic, repeatable, you control the steps). An agent is an open loop (the model decides each step). Show when each fits, the hybrid pattern (workflow with one agent step inside), and the cost / reliability tradeoff.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.orange) - Fixed DAG vs open loop**
  Title: "Two Shapes Of Control"
  Visual: 2 side-by-side diagrams. Left: workflow - a 4-node DAG with fixed edges. The flow is the same every run. Right: agent - a loop with the model picking the next step from many options each iteration. Different runs take different paths.
  Key content: "workflow", "agent", "DAG|graph|fixed", "loop|open|variable".

- **sub=1 (C.yellow) - When workflow wins**
  Title: "Workflow: Known Inputs, Known Steps"
  Visual: a checklist:
  - You can list the steps in advance.
  - Each step's output type is predictable.
  - You need to guarantee certain steps execute.
  - The cost / latency must be bounded.
  Customer-support example: "When a ticket comes in: classify -> route -> handle. Always those 3 steps."
  Key content: "workflow", "known|predict", "bounded", "classif|route".

- **sub=2 (C.red) - When agent wins**
  Title: "Agent: Variable Steps, Variable Tools"
  Visual: a checklist:
  - You don't know the steps in advance.
  - The model needs to decide which tools to call and in what order.
  - The task could take 2 calls or 20.
  - You're willing to pay for flexibility.
  Customer-support example: "Research-style task: 'Summarize all customer issues from past week'. Agent decides which docs to read."
  Key content: "agent", "variable", "decide", "research|summariz".

- **sub=3 (C.amber) - The hybrid: workflow with one agent step**
  Title: "Most Production Systems Are Hybrid"
  Visual: a workflow DAG with one node replaced by an "agent step" (loop with question mark inside). Annotate: "The classify step is deterministic, the handle step is an agent."
  Key content: "hybrid", "workflow", "agent step|inside".

- **sub=4 (C.cyan) - Cost / reliability tradeoff**
  Title: "Predictable Cost vs Variable Cost"
  Visual: a 2-row chart. Workflow: cost / latency / failure mode all bounded and predictable. Agent: variable cost (depends on iterations), variable latency, soft-fails (gets stuck instead of crashing). Decision rule: workflow when you can; agent when you must.
  Key content: "cost", "latency", "predict|bound", "variable", "decision".

- [ ] **Step 1: Write content tests**

```js
describe("WorkflowVsAgent (13.18) content", () => {
  const fn = AgentLoops.WorkflowVsAgent;

  it("sub=0 contrasts DAG and loop", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/dag|graph|fixed/i);
    expect(container.textContent).toMatch(/loop|open|variable/i);
  });

  it("sub=1 lists when workflow wins", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/known|predict/i);
    expect(container.textContent).toMatch(/classif|route/i);
  });

  it("sub=2 lists when agent wins", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/variable|decide/i);
  });

  it("sub=3 shows the hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
  });

  it("sub=4 shows cost / reliability tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/predict|bound|variable/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkflowVsAgent"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WorkflowVsAgent chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`.
- Center-aligned titles. Title-case for all diagram box text. "Two Shapes Of Control", "Workflow: Known Inputs, Known Steps", "Agent: Variable Steps, Variable Tools".
- The DAG vs loop diagram (sub=0) and the hybrid diagram (sub=3) use SVGs centered in viewBox with symmetric padding; `<desc>` as first child + entry in `src/data/svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered with `textAlign: "center"`.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.18 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkflowVsAgent"
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
git commit -m "Implement chapter 13.18 Workflow vs Agent"
```

---

## Task 14: Implement Chapter 13.19 WorkflowPrimitives

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Three composable workflow primitives - chaining (A -> B), routing (intent classification + branch), parallelization (fan-out + aggregate). Show each topology, when to use each, and how the customer-support agent uses them.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.orange) - Three primitives**
  Title: "Chain, Route, Parallelize"
  Visual: 3 mini-topologies side-by-side. Chain: A -> B -> C. Route: input -> classifier -> branch1 / branch2 / branch3. Parallelize: input -> [worker1, worker2, worker3] -> aggregator.
  Key content: "chain|chaining", "rout|routing", "parallel|parallelization", "fan.?out".

- **sub=1 (C.yellow) - Chaining: structured output to next step**
  Title: "Step A's Output Is Step B's Input"
  Visual: a 3-node chain with arrows showing structured output passing between steps. Example: ticket -> classifier (output: category JSON) -> handler-for-billing (input: category JSON).
  Key content: "chain", "structured|json", "output", "input".

- **sub=2 (C.red) - Routing: intent classification + branch**
  Title: "Route By Intent"
  Visual: a router decision tree. Input ticket -> intent classifier -> branches: billing / product / troubleshooting / chitchat. Each branch goes to a different handler. The classifier is itself an LLM call with few-shot examples (13.3 back-ref).
  Key content: "rout|routing", "intent|classif", "branch", "13\\.3|few.?shot".

- **sub=3 (C.amber) - Parallelization: fan-out + aggregate**
  Title: "Run N In Parallel, Then Merge"
  Visual: fan-out from input to 3 workers (e.g., 3 retrieval strategies, or 3 classifier votes), each runs concurrently, results merged by aggregator. Latency = max worker time (not sum).
  Key content: "parallel|fan.?out", "aggregat|merge", "concurrent|max".

- **sub=4 (C.cyan) - Composing primitives**
  Title: "Real Workflows Stack Primitives"
  Visual: a complex topology that combines all three - input chained to classifier (chain), classifier routes to one of three branches (route), one branch parallelizes 3 retrieval calls (parallel) then chains the merged result to the answer generator.
  Key content: "compos|stack|combine", "chain.*rout|rout.*chain", "all three".

- **sub=5 (C.orange) - Support agent example**
  Title: "Support Agent Workflow"
  Visual: a labeled customer-support workflow:
  1. Ticket arrives.
  2. Classifier (intent classification) routes to billing / troubleshooting / escalation.
  3. Billing branch: chain lookup_customer -> lookup_subscription -> respond.
  4. Troubleshooting branch: parallel (search_kb for top-3 hypotheses) -> chain to response.
  5. Escalation branch: escalate_human directly.
  Key content: "support|ticket", "classif", "billing", "trouble", "escalat", "parallel", "search_kb".

- [ ] **Step 1: Write content tests**

```js
describe("WorkflowPrimitives (13.19) content", () => {
  const fn = AgentLoops.WorkflowPrimitives;

  it("sub=0 names the three primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/parallel/i);
  });

  it("sub=1 shows chaining with structured output", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/structured|json|output/i);
  });

  it("sub=2 explains routing with intent classification", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/intent|classif/i);
    expect(container.textContent).toMatch(/13\.3|few.?shot/i);
  });

  it("sub=3 shows parallelization fan-out", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parallel|fan.?out/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
  });

  it("sub=4 shows composing primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/compos|stack|combine/i);
  });

  it("sub=5 maps support-agent workflow", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/troubl|escalat/i);
    expect(container.textContent).toMatch(/search_kb/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkflowPrimitives"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full WorkflowPrimitives chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`, `C.orange`.
- Center-aligned titles. Title-case for all diagram box text. "Chain, Route, Parallelize", "Step A's Output Is Step B's Input", "Route By Intent", "Run N In Parallel, Then Merge", "Real Workflows Stack Primitives", "Support Agent Workflow".
- The 3 mini-topologies (chain / route / parallelize) in sub=0 and the composing-primitives diagram in sub=4 use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json` entries.
- The routing chapter must back-reference 13.3 (Few-Shot + Structured Output) as the few-shot classifier source.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.19 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "WorkflowPrimitives"
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
git commit -m "Implement chapter 13.19 Workflow Primitives - Chaining, Routing, Parallelization"
```

---

## Task 15: Implement Chapter 13.20 AgentLoop

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Formalize the agent loop. Reason -> Act -> Observe -> Reason again. Show it as a state machine. Cover termination check per iteration, per-iteration cost, and trace a real ticket through the loop.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.orange) - Reason - Act - Observe**
  Title: "The Three-Beat Cycle"
  Visual: a circular flow - REASON (model thinks) -> ACT (model emits tool_use) -> OBSERVE (runtime returns tool_result) -> back to REASON. Each beat in a tinted block. Annotate that "reason" reads the entire history so far.
  Key content: "reason", "act", "observe", "loop|cycle".

- **sub=1 (C.yellow) - State machine view**
  Title: "Agent As State Machine"
  Visual: a state diagram with 4 states: WAITING (idle) -> REASONING (model call in flight) -> ACTING (tool call in flight) -> OBSERVING (got result). Transitions labeled with what triggers them. Terminal states: DONE / FAILED / ESCALATED.
  Key content: "state|machine", "waiting", "reasoning", "acting", "observ", "done|terminal".

- **sub=2 (C.red) - Termination check per iteration**
  Title: "Check After Each Beat"
  Visual: the same circular flow but with a "termination check" diamond placed between OBSERVE and the next REASON. Checks: "Is the model emitting a final answer? Yes -> DONE." / "Have we exceeded max iterations? Yes -> ESCALATE." / "Have we exceeded budget? Yes -> ABORT."
  Key content: "terminat|stop", "check", "max iter|budget", "13\\.23|loop termination".

- **sub=3 (C.amber) - Per-iteration cost**
  Title: "What Each Beat Costs"
  Visual: a 4-row table showing cost per beat for a typical iteration:
  - REASON: 1 LLM call. Cost: ~$0.02 for a 5k-token reasoning context + 200-token response.
  - ACT: 0 model cost (the model emitted the tool_use, that's part of REASON's response). 1 tool execution cost (varies).
  - OBSERVE: 0 model cost; the result is appended to history.
  - Total per iteration: roughly 1 LLM call + 1 tool call.
  Key content: "cost", "per iteration", "LLM call|tool call".

- **sub=4 (C.cyan) - Trace ticket T2 as a loop**
  Title: "Loop Trace: Ticket T2"
  Visual: 4-iteration loop trace for T2 (reset password + email changed):
  - Iter 1: REASON ("need customer info") -> ACT (lookup_customer) -> OBSERVE (got c-9924).
  - Iter 2: REASON ("email outdated, update first") -> ACT (change_email) -> OBSERVE (updated).
  - Iter 3: REASON ("now reset") -> ACT (reset_password) -> OBSERVE (email sent).
  - Iter 4: REASON ("done, summarize") -> emit final answer -> TERMINATE.
  Key content: "T2|ticket t2", "iter|iteration", "lookup_customer", "change_email", "reset_password", "terminat".

- **sub=5 (C.orange) - Loop vs single call**
  Title: "When You Need The Loop"
  Visual: a 2-row comparison. Single tool call: one tool, one response, done. Loop: multiple iterations, model adapts based on intermediate results. Decision rule: if the second tool's input depends on the first tool's output, you need a loop.
  Key content: "single|loop", "depend|adapt", "decision|when".

- [ ] **Step 1: Write content tests**

```js
describe("AgentLoop (13.20) content", () => {
  const fn = AgentLoops.AgentLoop;

  it("sub=0 names reason / act / observe", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/act/i);
    expect(container.textContent).toMatch(/observ/i);
  });

  it("sub=1 shows state machine view", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/state/i);
    expect(container.textContent).toMatch(/done|terminal/i);
  });

  it("sub=2 explains termination check", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/terminat|stop/i);
    expect(container.textContent).toMatch(/max iter|budget/i);
  });

  it("sub=3 shows per-iteration cost", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/llm call|tool call/i);
  });

  it("sub=4 traces ticket T2 as a loop", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
    expect(container.textContent).toMatch(/reset_password/);
  });

  it("sub=5 contrasts single vs loop", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/single|loop/i);
    expect(container.textContent).toMatch(/depend|adapt/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentLoop"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full AgentLoop chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`, `C.orange`.
- Center-aligned titles. Title-case for all diagram box text. "The Three-Beat Cycle", "Agent As State Machine", "Check After Each Beat", "What Each Beat Costs", "Loop Trace: Ticket T2", "When You Need The Loop".
- The reason-act-observe circular flow (sub=0) and the state machine diagram (sub=1) and the loop-with-termination-check diamond (sub=2) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- The chapter must back-reference 13.23 (Loop Termination) when discussing termination.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Trace strings must include `lookup_customer`, `change_email`, `reset_password` for ticket T2.
- Standalone artifacts centered.
- No forward references except the within-section signpost to 13.23; no carry-over brand names.

Follow the spec's chapter 13.20 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AgentLoop"
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
git commit -m "Implement chapter 13.20 The Agent Loop"
```

---

## Task 16: Implement Chapter 13.21 ReActPattern

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** The ReAct pattern names the agent loop's three blocks explicitly - Thought, Action, Observation - and asks the model to emit them as visible structured output. Walk through each block, show a full ticket trace in ReAct format, compare to plain tool-use.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.orange) - ReAct = Reasoning + Acting visible**
  Title: "Make The Reasoning Visible"
  Visual: a stack with three labeled rows - Thought (what the model is thinking), Action (which tool to call), Observation (what the tool returned). Each row tinted. Visual emphasis: the Thought is INSIDE the model's response now, not hidden.
  Key content: "ReAct|reasoning.*acting", "thought", "action", "observation", "visible".

- **sub=1 (C.yellow) - Thought structure**
  Title: "Thought: Why The Next Action"
  Visual: example thought block: "The user asked to reset their password but mentioned the email changed. I should first lookup_customer with the OLD email, then change_email to the NEW one, then reset_password."
  Annotate: the thought makes the plan visible for evals and for debugging.
  Key content: "thought", "plan", "reset|password", "eval|debug".

- **sub=2 (C.red) - Action: tool call**
  Title: "Action: The Concrete Step"
  Visual: example action block: `Action: lookup_customer({"email": "alice@example.com"})`. One action per iteration.
  Key content: "action", "lookup_customer", "alice@example\\.com".

- **sub=3 (C.amber) - Observation: tool result**
  Title: "Observation: What Came Back"
  Visual: example observation: `Observation: {customer_id: "c-9924", tier: "pro", primary_email: "alice@example.com"}`. The model reads this and decides the next thought.
  Key content: "observ", "c-9924|customer_id", "result".

- **sub=4 (C.cyan) - Full T2 ReAct trace**
  Title: "ReAct Trace: Ticket T2"
  Visual: a styled artifact block "ReAct Trace" showing 4 cycles for ticket T2 (reset password + email changed). Each cycle has 3 lines: Thought / Action / Observation. The final cycle ends with the model's answer to the user.
  Key content: "T2|ticket t2", "thought|action|observ", "lookup_customer", "change_email", "reset_password".

- **sub=5 (C.orange) - ReAct vs plain tool-use**
  Title: "When To Force ReAct"
  Visual: a comparison card:
  - Plain tool-use: model emits tool_use blocks; reasoning is in the model's head, invisible to user / observability.
  - ReAct: same loop, but model is required to emit Thought + Action explicitly.
  - Use ReAct when: you need to audit reasoning, debug failures, train a smaller model on the traces, or build trust with the user.
  Key content: "ReAct|tool.?use", "visible|invisible|audit", "debug|trust".

- [ ] **Step 1: Write content tests**

```js
describe("ReActPattern (13.21) content", () => {
  const fn = AgentLoops.ReActPattern;

  it("sub=0 names Thought / Action / Observation", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/observation/i);
  });

  it("sub=1 shows a thought block", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/plan|lookup_customer/i);
  });

  it("sub=2 shows an action block", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/lookup_customer/);
  });

  it("sub=3 shows an observation block", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/observ/i);
    expect(container.textContent).toMatch(/c-9924|customer_id/i);
  });

  it("sub=4 traces T2 in ReAct format", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/reset_password/);
  });

  it("sub=5 explains ReAct vs plain tool-use", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/plain|tool.?use/i);
    expect(container.textContent).toMatch(/audit|debug|trust/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ReActPattern"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full ReActPattern chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`, `C.orange`.
- Center-aligned titles. Title-case for all diagram box text. "Make The Reasoning Visible", "Thought: Why The Next Action", "Action: The Concrete Step", "Observation: What Came Back", "ReAct Trace: Ticket T2", "When To Force ReAct".
- The ReAct trace artifact in sub=4 renders as styled mono-text labeled "ReAct Trace" with 4 cycles for ticket T2 (Thought / Action / Observation per cycle). Tinted background `${C.cyan}06`, border `1px solid ${C.cyan}12`, monospace 14-16px, centered. NOT a code block.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. T2 trace must mention `lookup_customer`, `change_email`, `reset_password`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.21 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ReActPattern"
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
git commit -m "Implement chapter 13.21 ReAct Pattern"
```

---

## Task 17: Implement Chapter 13.22 PlanExecuteReflect

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Two more loop patterns. Plan-Execute: model plans the full task tree FIRST, then executes leaves in order (or parallel). Reflection: after each step or at the end, model critiques its own output and revises. Show when plan-execute beats reactive ReAct, and when reflection adds value.

**Sub-step structure (5 sub-steps, 0-4):**

- **sub=0 (C.orange) - Plan first vs react each step**
  Title: "Decide Up Front Or Step By Step"
  Visual: 2 side-by-side diagrams. Left: ReAct (reactive) - each step picks the next on-the-fly. Right: Plan-Execute - first iteration builds a full plan tree, then subsequent iterations execute leaves.
  Key content: "plan|plan.execute", "react", "up front|first", "execute".

- **sub=1 (C.yellow) - The plan tree**
  Title: "What A Plan Looks Like"
  Visual: a 4-node plan tree for ticket T4 (cancel + refund):
  - Root: "Resolve T4 cancel + refund"
    - Step 1: lookup_customer to get customer_id
    - Step 2: lookup_subscription to get current invoice_id
    - Step 3: cancel subscription
    - Step 4: process_refund (will trigger business_rule error -> escalate)
  Each leaf labeled with the tool to call.
  Key content: "plan", "tree", "lookup_customer", "lookup_subscription", "cancel|refund".

- **sub=2 (C.red) - Execute leaves**
  Title: "Walk The Leaves"
  Visual: the same tree but with leaves being checked off as they execute. Add a "result" column per leaf. Final leaf 4 surfaces the business_rule error, which the executor catches and adapts by adding a "Step 5: escalate_human" leaf.
  Key content: "execute|walk", "leaf|leaves", "result", "escalate_human|adapt".

- **sub=3 (C.amber) - Reflection: critique then revise**
  Title: "Reflection: Did That Answer Land?"
  Visual: a 3-step block:
  1. Model writes draft answer.
  2. Model (or critic) reads the draft and the original question, scores it (0-10 with reasoning).
  3. If score < 7, model revises and re-evaluates.
  One revision cap typical; more triggers escalation.
  Key content: "reflect|critique", "revise", "score|grade", "0.10|0 to 10".

- **sub=4 (C.cyan) - When plan-execute and reflection win**
  Title: "Pick The Right Loop Pattern"
  Visual: a 2x2 matrix. Axes: Task complexity (low / high) x Need for auditability (low / high).
  - Low / Low: plain tool-use.
  - Low / High: ReAct.
  - High / Low: Plan-Execute.
  - High / High: Plan-Execute + Reflection.
  Key content: "complex|simple", "audit", "decision|when", "ReAct|plan.?execute|reflect".

- [ ] **Step 1: Write content tests**

```js
describe("PlanExecuteReflect (13.22) content", () => {
  const fn = AgentLoops.PlanExecuteReflect;

  it("sub=0 contrasts plan-first vs reactive", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/react/i);
    expect(container.textContent).toMatch(/up front|step by step|first/i);
  });

  it("sub=1 shows the plan tree", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/tree/i);
    expect(container.textContent).toMatch(/lookup_customer/);
  });

  it("sub=2 walks the leaves", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/execute|leaf|leaves/i);
    expect(container.textContent).toMatch(/escalate_human/);
  });

  it("sub=3 shows reflection critique-revise", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/reflect|critique/i);
    expect(container.textContent).toMatch(/revise/i);
    expect(container.textContent).toMatch(/score|grade/i);
  });

  it("sub=4 shows the decision matrix", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/complex|simple/i);
    expect(container.textContent).toMatch(/audit/i);
    expect(container.textContent).toMatch(/plan|reflect|react/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "PlanExecuteReflect"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full PlanExecuteReflect chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 5 sub-steps total (sub >= 0 through sub >= 4).
- Sub=0 inline; subs 1-4 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`.
- Center-aligned titles. Title-case for all diagram box text. "Decide Up Front Or Step By Step", "What A Plan Looks Like", "Walk The Leaves", "Reflection: Did That Answer Land?", "Pick The Right Loop Pattern".
- The plan tree (sub=1) and the execution tree with check-marks (sub=2) and the 2x2 decision matrix (sub=4) use SVGs centered in viewBox with symmetric padding; `<desc>` + `svg-descriptions.json`.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. Plan tree must reference ticket T4 with `lookup_customer`, `lookup_subscription`, `cancel`, `refund`, `escalate_human`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.22 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "PlanExecuteReflect"
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
git commit -m "Implement chapter 13.22 Plan-Execute + Reflection"
```

---

## Task 18: Implement Chapter 13.23 LoopTermination

**Files:**
- Modify: `src/sections/agent-loops.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only these two.

**Chapter purpose:** Close Act 4 with the production-critical topic of stopping. Four stop conditions: success / max-iters / budget exhaustion / explicit stop. Show how each is detected, what action follows, and a fail-safe escalation pattern.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.orange) - Four stop conditions**
  Title: "Four Ways A Loop Ends"
  Visual: a 2x2 grid:
  - Success: model emits final answer.
  - Max-iters: hit the cap (e.g., 10).
  - Budget: token / cost exhausted.
  - Explicit stop: tool returns a "halt" signal, or user cancels.
  Each tinted differently.
  Key content: "success", "max.?iter", "budget", "explicit stop|halt|cancel".

- **sub=1 (C.yellow) - Success detection**
  Title: "Success: The Model Stops Calling Tools"
  Visual: a 2-row example. Iteration N-1: model emits tool_use + text. Iteration N: model emits ONLY text (no tool_use). That's success - the model decided no more tools needed. Annotate that the final text is the answer to the user.
  Key content: "success", "final|answer", "no more|stop calling".

- **sub=2 (C.red) - Max iterations cap**
  Title: "Hard Cap: 10-20 Iterations"
  Visual: a counter going 1, 2, 3, ... 10. At 10 the loop is force-terminated and the agent emits a "max iterations reached, escalating" message. Production rule: 10-20 typical max-iter cap. Higher = pay-to-think; lower = miss answers.
  Key content: "max iter", "10|20", "cap", "force|terminat".

- **sub=3 (C.amber) - Budget exhaustion**
  Title: "Token / Cost Budget"
  Visual: a budget bar that fills as iterations consume tokens. When the bar hits 100%, loop terminates. Sample budget: $0.50 per agent run. Annotate that budget is the SAFER cap than iterations because real cost can vary 10x per iteration.
  Key content: "budget", "token|cost", "exhaust|cap", "0\\.50|\\$".

- **sub=4 (C.cyan) - Explicit stop signal**
  Title: "Tools Can Say Stop"
  Visual: example - the `escalate_human` tool returns a result with `"halt": true`. The loop respects this signal and terminates cleanly. Similar pattern: a user cancellation injects a halt event.
  Key content: "halt|stop signal", "escalate_human", "cancel".

- **sub=5 (C.orange) - Fail-safe escalation**
  Title: "When The Loop Gives Up, Escalate"
  Visual: a flow showing what happens when ANY non-success termination fires (max-iters, budget, explicit stop). The agent emits a final message to the user explaining what happened ("I wasn't able to fully resolve this; a human agent will follow up.") AND calls `escalate_human` with the partial transcript. No silent failures.
  Key content: "fail.?safe", "escalate_human", "transcript", "silent failure|no silent".

- [ ] **Step 1: Write content tests**

```js
describe("LoopTermination (13.23) content", () => {
  const fn = AgentLoops.LoopTermination;

  it("sub=0 lists the four stop conditions", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/max.?iter/i);
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/explicit stop|halt/i);
  });

  it("sub=1 shows success detection", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/final|answer|no more/i);
  });

  it("sub=2 shows max-iter cap", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/max iter/i);
    expect(container.textContent).toMatch(/10|20/);
  });

  it("sub=3 shows budget exhaustion", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/token|cost/i);
  });

  it("sub=4 shows explicit stop signal", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/halt|stop signal/i);
    expect(container.textContent).toMatch(/escalate_human/);
  });

  it("sub=5 shows fail-safe escalation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/fail.?safe/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/silent failure|no silent/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LoopTermination"
```

Expected: FAIL.

- [ ] **Step 3: Implement the full LoopTermination chapter**

Replace the stub export in `src/sections/agent-loops.jsx`. Reference `src/sections/rag-foundations.jsx` patterns. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step: `C.orange`, `C.yellow`, `C.red`, `C.amber`, `C.cyan`, `C.orange`.
- Center-aligned titles. Title-case for all diagram box text. "Four Ways A Loop Ends", "Success: The Model Stops Calling Tools", "Hard Cap: 10-20 Iterations", "Token / Cost Budget", "Tools Can Say Stop", "When The Loop Gives Up, Escalate".
- The 4-class stop conditions grid (sub=0) and the budget-bar visualization (sub=3) use either SVG (centered, with `<desc>` + `svg-descriptions.json`) or styled divs depending on complexity.
- This chapter is the highest-stakes content in Act 4 - silent agent failures in production are caused exactly by missing this discipline. Treat the Chrome validation of this chapter as extra-rigorous.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on. The fail-safe escalation pattern must reference `escalate_human`.
- Standalone artifacts centered.
- No forward references; no carry-over brand names.

Follow the spec's chapter 13.23 description and the sub-step structure section above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "LoopTermination"
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
git commit -m "Implement chapter 13.23 Loop Termination"
```

---

## Task 19: Update CLAUDE.md mapping table for Section 13 Acts 3+4

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** Only `CLAUDE.md`.

- [ ] **Step 1: Extend the Section 13 mapping table**

In `CLAUDE.md`, locate the Section 13 mapping table (added in M1) and append the 12 new rows under it:

```markdown
| 13.12 | WhyProtocols | Why Protocols? |
| 13.13 | McpArchitecture | MCP Architecture |
| 13.14 | McpPrimitives | MCP Primitives - Tools, Resources, Prompts |
| 13.15 | BuildingMcpServer | Building an MCP Server |
| 13.16 | McpSecurity | MCP Security |
| 13.17 | A2AProtocol | A2A - Agent-to-Agent Protocol |
| 13.18 | WorkflowVsAgent | Workflow vs Agent |
| 13.19 | WorkflowPrimitives | Workflow Primitives - Chaining, Routing, Parallelization |
| 13.20 | AgentLoop | The Agent Loop |
| 13.21 | ReActPattern | ReAct Pattern |
| 13.22 | PlanExecuteReflect | Plan-Execute + Reflection |
| 13.23 | LoopTermination | Loop Termination |
```

Update the section heading line to reflect M2 progress: "Milestones 1-2 of 6 complete: Acts 1-4".

- [ ] **Step 2: Update project structure tree**

Add `agent-loops.jsx` to the tree:

```
│       ├── agent-loops.jsx             # Section 13 (Acts 4+5, chapters 13.18-13.29 - Act 4 in M2, Act 5 in M3)
```

- [ ] **Step 3: Smoke gate + scope + commit**

```bash
npm run test
git status
git diff --stat
git add CLAUDE.md
git commit -m "Document Section 13 Acts 3+4 in CLAUDE.md mapping"
```

---

## Task 20: Chrome browser visual validation of all 12 new chapters

**Files:**
- Modify: `src/data/svg-descriptions.json` (only if new SVGs added during Tasks 7-18).
- Possibly modify section files (`src/sections/agent-tools.jsx`, `src/sections/agent-loops.jsx`) if visual defects are found.

**Scope binding:** Per-defect-fix this task may modify individual section files. Group fixes by file and commit each section file's fixes together. `git diff --stat` before each commit.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

Expected: dev server on `http://localhost:5173/learn-ai/`.

- [ ] **Step 2: For each chapter 13.12 through 13.23, navigate and screenshot**

For each chapter:

1. Use `mcp__claude-in-chrome__tabs_create_mcp` (or similar) to open a tab.
2. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch: <id>, sub: 20, fingerprint: <current>})` to force all sub-steps to reveal.
3. Take a screenshot.
4. Verify the per-chapter checklist (below) by inspection + the overlap-detection snippet.

Per-chapter checklist:

- No overlapping elements anywhere on the page.
- Every diagram is centered horizontally + vertically within its container.
- Every diagram-box label is title-case ("MCP Architecture" not "mcp architecture"; "ReAct Pattern" not "react pattern").
- Every line of text starts with a capital letter.
- Every Box has a real color (no `C.card`).
- Every standalone formula / artifact is centered.
- Every SVG has a `<desc>` child as its first element.
- Body text is 16-19px, titles 22px.
- MCP / A2A message artifacts (13.13 / 13.14 / 13.17) and the ReAct trace artifact (13.21 sub=4) render as styled mono-text, NOT as code blocks.

- [ ] **Step 3: Save screenshots**

Save the 12 screenshots to `docs/superpowers/screenshots/section-13-m2/` (create directory if not present).

- [ ] **Step 4: Run edge-crossing check (where applicable)**

For SVGs that draw edges between nodes (the 5x6 tangled sprawl in 13.12, the MCP topology in 13.13, the agent-loop diagrams in 13.18-13.20, the ReAct ladder in 13.21, the plan tree in 13.22), run the `countCrossings` snippet from `.claude/skills/check-visuals/SKILL.md` in the browser console. Expected: 0 crossings unless inherent to concept. SPECIAL CASE: the sprawl diagram in 13.12 sub=0 IS supposed to be tangled - the concept demands crossings. Do NOT attempt to make it planar; annotate the SVG comment to skip future planarity checks.

- [ ] **Step 5: For each violation found**

Fix the section file directly. Group fixes by chapter and commit per chapter:

```bash
# per section file
git add src/sections/agent-tools.jsx  # for chapters 13.12-13.17
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

```bash
git add src/sections/agent-loops.jsx  # for chapters 13.18-13.23
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

If new SVG `<desc>` entries need to be added to `src/data/svg-descriptions.json`, include those in the same commit as the file's last visual fix, or commit separately:

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for Section 13 Acts 3+4 diagrams"
```

- [ ] **Step 5: Final sweep**

Walk all 12 chapters once more. Confirm clean.

---

## Task 21: Final M2 verification

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
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx && echo "FAIL: em-dash found" || echo "em-dash clean"

# C.card boxes
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx && echo "FAIL: C.card found" || echo "C.card clean"

# carry-over brand (any vendor-shaped domain other than example.com / example.org)
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain found" || echo "domain clean"

# "architect" word in titles
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx src/sections/agent-loops.jsx && echo "FAIL: 'architect' word found" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 7: Verify Section 13 in TOC shows 23 chapters (M1 + M2)**

Navigate to the running app's TOC. Open Section 13. Confirm all 23 chapters (13.1 through 13.23) are listed.

- [ ] **Step 8: No commit.** This task only verifies.

---

## Task 22: Plan Refinement Checkpoint for M3

**Files:**
- Create: `docs/superpowers/lessons/section-13-m2-lessons.md`
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-13-milestone-3.md`
- Create: `docs/superpowers/starter-prompts/section-13-m3-starter.md`

**Scope binding:** Only these three.

- [ ] **Step 1: Capture M2 lessons**

Create `docs/superpowers/lessons/section-13-m2-lessons.md` with 3-5 honest bullet observations:
- How did the protocol-message-shape artifacts land? Easier or harder than tool-schema artifacts from M1?
- Did the MCP topology SVG render cleanly or need iteration?
- The workflow-vs-agent split: was the visual distinction crisp, or did learners (you, validating) conflate them?
- Did the ReAct trace artifact format hold up?
- The loop termination chapter has 4 stop conditions: any one of them especially load-bearing in execution?

- [ ] **Step 2-3: Read M3 plan with M2 lessons in mind; edit M3 plan if warranted**

Open `docs/superpowers/plans/2026-05-16-section-13-milestone-3.md`. Update inline if M2 informs M3 (e.g., better visual treatment, tighter test patterns).

- [ ] **Step 4: Smoke gate**

```bash
npm run test
```

- [ ] **Step 5: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 6: Commit lessons + plan edits**

```bash
git add docs/superpowers/lessons/section-13-m2-lessons.md docs/superpowers/plans/2026-05-16-section-13-milestone-3.md
git commit -m "Capture M2 lessons and refine M3 plan"
```

(Or only the lessons file if no plan edits.)

- [ ] **Step 7: Generate M3 starter prompt**

Create `docs/superpowers/starter-prompts/section-13-m3-starter.md`:

````markdown
# M3 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 3 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-3.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m2-lessons.md AND section-13-m1-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section13-milestone3"
- After M3 ships, execute the final refinement task before starting M4

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt.)
````

Commit:

```bash
git add docs/superpowers/starter-prompts/section-13-m3-starter.md
git commit -m "Add M3 starter prompt for next session"
```

- [ ] **Step 8: M2 complete. Ready to start M3.**

```bash
git log --oneline -30
npm run test
```

---

## Notes for next session executor

Before pasting the M3 starter prompt:
- Review both M1 and M2 lessons files.
- Confirm `git log` shows M1 + M2 commits cleanly on main.
- Verify `npm run test` is green.
- Optionally run `npm run search:extract` to refresh chunk indexes.

## What Comes Next

Milestone 3 covers Section 13 Acts 5 + 6:
- Act 5 (Memory): memory taxonomy, working / episodic / semantic / procedural memory, summary + context window management. 6 chapters (13.24-13.29).
- Act 6 (Multi-Agent): why multi-agent, orchestrator-worker, supervisor / hierarchical, hand-offs, critic / debate, failure modes, agentic RAG. 7 chapters (13.30-13.36).

Total M3: 13 chapters. Largest milestone in the section.

## Self-Review Notes

- Act 3 has the heaviest artifact density (MCP messages, agent.json, server registration shapes). The artifact treatment from Section 12 prompt-template rule extends naturally; just stay disciplined about styling those blocks as text not code.
- The MCP topology SVG (13.13 sub=1) needs explicit `<desc>` for search; the tangled-sprawl SVG (13.12 sub=0) is intentionally non-planar - don't try to "fix" the crossings.
- Workflow primitives (13.19) reuses the few-shot example from 13.3; check that the cross-reference back-link is clear.
- Loop termination (13.23) is the chapter Section 13 most needs to land cleanly - silent agent failures in production are caused exactly by missing this discipline. Treat its Chrome validation as extra-rigorous.
