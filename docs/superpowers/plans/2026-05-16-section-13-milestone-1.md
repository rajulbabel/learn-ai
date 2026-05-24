# Section 13 Milestone 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Strict scope rule for subagents:** When you dispatch a subagent for a task, the subagent prompt MUST include: (a) the verbatim Files: list from the task, (b) the instruction "modify ONLY files in the Files: list; if you find other defects, document them but do NOT fix them in this task", and (c) the instruction "run `git diff --stat` before committing; abort if any file outside the Files: list shows as modified". The parent reviews `git diff --stat` after each subagent finishes. Scope violations are rejected and the subagent re-dispatched with the same strict prompt.
>
> **Two-stage review per task:** Stage 1 SCOPE - did the subagent modify only the listed files? Are commits clean? Stage 2 CORRECTNESS - do tests pass, does behavior match the spec? Both stages must pass before moving to the next task.

**Goal:** Add Section 13 "AI Agents" scaffolding plus the first eleven chapters (Act 1 Prompting Foundations: 13.1 AnatomyOfLlmCall, 13.2 SystemPromptContract, 13.3 FewShotStructuredOutput, 13.4 ChainOfThoughtSelfConsistency, 13.5 PromptVsTuneVsRagVsAgent, 13.6 ContextEngineering; Act 2 Tool Calling: 13.7 ToolUseAsBridge, 13.8 JsonSchemaForTools, 13.9 ToolCallLifecycle, 13.10 ParallelToolsAndChoice, 13.11 ToolErrorsRetries). The app should ship at end of this milestone with a visible Section 13 in the TOC and 11 navigable chapters.

**Architecture:** Chapters live in two new section files. `src/sections/agent-prompting.jsx` holds Act 1 (6 chapters: 13.1-13.6). `src/sections/agent-tools.jsx` holds Act 2 (5 chapters: 13.7-13.11) and will later be extended in M2 to also hold Act 3 protocols (13.12-13.17). Section registration follows the same multi-file pattern as Section 11 and Section 12: add entries to `chapters[]`, `sectionNames`, and `sectionColors` in `src/config.js`; register a multi-file lazy loader in `src/learn-ai.jsx` using `Promise.all` + `Object.assign`; add the imports to `src/__tests__/sections.test.jsx`. All chapter content follows the learn-ai visual rules in `CLAUDE.md` and `docs/superpowers/specs/2026-05-16-section-13-agents-design.md` (progressive Reveal sub-steps, colored Boxes per sub-step, real numbers, center-aligned titles, title-case for diagram box text, zero-overlap diagrams, Chrome visual validation per chapter).

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- All tests currently pass on `main` (verify in Task 1).
- Section 13 spec is committed to `docs/superpowers/specs/2026-05-16-section-13-agents-design.md`.
- Section 12 brand cleanup is committed (no carry-over brand strings in `src/`, `public/`, `docs/`, `index.html`).
- Working directly on `main`.

## File Structure

### New files

- `src/sections/agent-prompting.jsx` - Act 1 chapter functions. In Milestone 1 this file contains 6 exports (AnatomyOfLlmCall, SystemPromptContract, FewShotStructuredOutput, ChainOfThoughtSelfConsistency, PromptVsTuneVsRagVsAgent, ContextEngineering).
- `src/sections/agent-tools.jsx` - Acts 2+3 chapter functions. In Milestone 1 this file contains 5 exports for Act 2 (ToolUseAsBridge, JsonSchemaForTools, ToolCallLifecycle, ParallelToolsAndChoice, ToolErrorsRetries). M2 adds 6 more for Act 3.

### Modified files

- `src/config.js` - add 11 entries to `chapters[]` (13.1-13.11), add entry to `sectionNames`, add entry to `sectionColors`.
- `src/learn-ai.jsx` - add multi-file loader for Section 13 in `sectionLoaders` (Promise.all over both new files).
- `src/__tests__/sections.test.jsx` - import `AgentPrompting` and `AgentTools` namespaces, spread into `lookup`, add content tests for the 11 new chapters.
- `src/__tests__/config.test.js` - add tests for Section 13 metadata + Act 1+2 chapter entries.
- `src/__tests__/lookup.test.js` - add static imports for `AgentPrompting` and `AgentTools`, spread into the `lookup` object, add presence tests for each chapter component.
- `src/data/svg-descriptions.json` - add entries only if new `<svg>` elements are introduced. Most Act 1+2 chapters use div-based visuals; Task 21 (Chrome validation) covers any required additions.
- `CLAUDE.md` - add Section 13 mapping table (Acts 1+2 only) and update project structure tree to include the two new section files.
- `public/llms.txt` - add Section 13 to topic list.
- `index.html` - add "AI Agents" to JSON-LD `teaches` array.
- `src/sections/toc.jsx` - register Section 13 in the sections array if not already present.

### Unchanged

All existing section files (sections 1-12).

---

## Standard running-example values (reference during implementation)

From the spec. Use consistently across 13.1-13.11 (and the rest of the section):

- **Primary scenario:** customer-support agent operating on the customer support knowledge base introduced in Section 12.
- **Canonical tool inventory (8 tools):** `search_kb(query)`, `lookup_customer(email)`, `lookup_subscription(customer_id)`, `reset_password(customer_id)`, `change_email(customer_id, new_email)`, `process_refund(invoice_id, reason)`, `escalate_human(transcript, urgency)`, `send_email(template_id, vars)`.
- **Standard tickets (5):**
  - T1: "I can't log in - reset my password" (single-tool happy path)
  - T2: "Reset my password but my email also changed" (multi-tool sequence, memory)
  - T3: "My dashboard is slow and showing 500 errors" (KB retrieval + multi-issue troubleshooting)
  - T4: "Cancel my subscription and refund my last invoice" (multi-step, refund > cap triggers escalation)
  - T5: "What's the difference between Pro and Enterprise?" (KB-only, intent test)
- **Standard customer identity:** Alice, email `alice@example.com`, customer_id `c-9924`, Pro tier, signed up 2024-08.
- **Standard agent constants:** context window 8k (visuals) / 128k (math); max iterations per loop 5 (visuals) / 10-20 (production); tool call latency 200ms (visuals) / 50-500ms (math); LLM call latency 1.5s (visuals); cost $3/M input + $15/M output (mid-tier band); retry 3 attempts exp backoff.
- **Per-act Box color family (M1):**
  - Act 1 Prompting Foundations: blue family - sub-step rotation typically `C.cyan` -> `C.blue` -> `C.purple` -> `C.indigo` -> `C.teal` per sub-step.
  - Act 2 Tool Calling: cyan family - sub-step rotation `C.cyan` -> `C.teal` -> `C.blue` -> `C.green` -> `C.purple` per sub-step.
  - Final color assignment per chapter sub-step is in each chapter task.

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 21).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Reset Password Tool" not "reset password tool". Exceptions: lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`temperature = 0.7`), JSON keys in artifact blocks (`"name"`, `"description"`), tokens like `[CLS]`.
4. **First letter of every line capitalized** - all monospace lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas / artifacts centered** - container div needs `textAlign: "center"`.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Stop hook `.claude/scripts/check-sections.sh` flags violations.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts (e.g., "covered in 13.4") are OK.
12. **No carry-over brand names** - corpus = "customer support knowledge base"; URLs = `docs.example.com`; never reintroduce a fictional company name.
13. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".
14. **Artifact treatment (Section-13-specific)** - tool schemas, message blocks, prompt templates, and eval rubrics render as styled monospace text blocks with tinted background (`${color}06`), soft border (`1px solid ${color}12`), monospace 14-16px, distinct color for placeholders. Labeled "Tool Schema (shape)", "Tool-Use Message", "Prompt Template", etc. NEVER as executable code.

---

## Cross-file dependency map (prevent silent gaps)

When this milestone adds/modifies certain artifacts, OTHER files iterate over them and break silently if not updated. This map prevents plan gaps.

### `chapters[]` in `src/config.js` is iterated by:

- `src/__tests__/config.test.js` - validates ID format, uniqueness, ordering, Section 13 entry shapes.
- `src/__tests__/lookup.test.js` - generic test "every chapter component exists in lookup". The `lookup` object in this file must include the spread of every section namespace.
- `src/__tests__/sections.test.jsx` - generic test "All chapters render at every sub-level". The `lookup` object in this file must ALSO include the spread of every section namespace.
- `src/learn-ai.jsx` - `sectionLoaders` lazy-imports each section file.

### When adding NEW section files (e.g., `src/sections/agent-prompting.jsx` and `src/sections/agent-tools.jsx`), you MUST update:

- `src/__tests__/lookup.test.js` - (a) static `import * as AgentPrompting from "../sections/agent-prompting.jsx"`, (b) static `import * as AgentTools from "../sections/agent-tools.jsx"`, (c) presence tests asserting `typeof mod.ChapterName === "function"` for each export, AND (d) spread `...AgentPrompting, ...AgentTools` into the test's `lookup` object.
- `src/__tests__/sections.test.jsx` - (a) static `import * as AgentPrompting`, (b) static `import * as AgentTools`, (c) spread both into the `lookup` object.
- `src/learn-ai.jsx` - register Section 13's loader using `Promise.all` over both files: `13: () => Promise.all([import("./sections/agent-prompting.jsx"), import("./sections/agent-tools.jsx")]).then((mods) => Object.assign({}, ...mods))`.
- `src/sections/toc.jsx` - register `{ n: 13, name: "AI Agents" }` in the sections array if the TOC iterates by static section list.

### When adding chapters to `chapters[]` (without a new section file):

- `src/__tests__/config.test.js` - add a "Section 13 chapters" describe block testing the specific new entries.
- The relevant section file must already export each new `component`. If it doesn't, the lookup-spread will resolve the symbol as `undefined` and `sections.test.jsx`'s generic test fails with "fn is not a function".
- If the new chapters introduce ANY new SVG, also update `src/data/svg-descriptions.json` AND `src/__tests__/svg-descriptions.test.js` may need adjustment depending on coverage rules.

### When updating `learn-ai.jsx` `sectionLoaders`:

- For Section 13, the loader is multi-file from day one: `Promise.all([...]).then((mods) => Object.assign({}, ...mods))`. Do NOT add it as a single-file loader and replace later - get it right the first time to avoid a churn commit.

### Before committing a task that touches any of these artifacts:

Run `npm run test` (full suite, not just the targeted test). If any unrelated test fails, you missed a dependency. Trace it before committing.

---

## Implementation order

1. Task 0 - Name session.
2. Task 1 - Verify green baseline.
3. Task 2 - Add Section 13 to `sectionNames` and `sectionColors` (red-green-refactor with config tests).
4. Task 3 - Create `agent-prompting.jsx` with 6 stub exports.
5. Task 4 - Create `agent-tools.jsx` with 5 stub exports.
6. Task 5 - Register both files in `learn-ai.jsx` `sectionLoaders` via `Promise.all`.
7. Task 6 - Add chapter entries 13.1-13.11 to `chapters[]` in `config.js`.
8. Task 7 - Register both namespaces in `sections.test.jsx` and `lookup.test.js`.
9. Tasks 8-18 - Implement chapters 13.1 through 13.11, one per task. TDD per chapter (red - test fails / green - implement / refactor).
10. Task 19 - Update `CLAUDE.md` mapping table + project structure tree for Section 13 Acts 1+2.
11. Task 20 - Update `public/llms.txt` and `index.html` JSON-LD `teaches` array for Section 13.
12. Task 21 - Chrome browser visual validation of all 11 chapters at every sub-step.
13. Task 22 - Final M1 verification (tests, coverage, lint, format, build).
14. Task 23 - Plan Refinement Checkpoint for M2 (lessons file + M2 plan tweak + M2 starter prompt).

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section13-milestone1`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section13-milestone1` (if your Claude Code build supports it).
- Settings: set the session title via `/config` or the IDE extension's session pane.
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section13-milestone1" so future searches catch it.

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section13-milestone1` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section13-milestone1`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with clean working tree**

```bash
git status
```

Expected: `On branch main`, `nothing to commit, working tree clean` (or only the Section 13 spec file as untracked - that's fine; we may commit it at the same time as Task 2).

- [ ] **Step 2: Run full test suite to confirm green baseline**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 3: Run linter baseline**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Confirm shipped artifacts use the IETF-reserved example domain**

```bash
grep -rn "docs\.example\.com" src/ public/ index.html | head -5
```

Expected: hits (the metadata-schema example URL renders as `docs.example.com`). If the only URL pattern that appears for the customer support knowledge base is `docs.example.com`, the corpus framing is brand-clean. If a different vendor-shaped domain appears, regenerate the search index (`npm run search:extract`) and re-verify.

- [ ] **Step 5: No commit yet** - this task only verifies baseline.

---

## Task 2: Add Section 13 to sectionNames and sectionColors

**Files:**
- Modify: `src/config.js` (sectionNames object, sectionColors object)
- Modify: `src/__tests__/config.test.js`

**Scope binding:** This task modifies ONLY the files listed in `**Files:**` above. If during implementation you discover other defects in other files, DO NOT fix them in this task - document them as a separate observation and continue with the listed scope. Before committing, run `git status` and `git diff --stat`: if ANY file outside the Files: list shows as modified, abort the commit and either move the change to the right task or revert it.

- [ ] **Step 1: Write failing test for Section 13 in config**

Add this test to `src/__tests__/config.test.js`. If `sectionNames`/`sectionColors` are not already imported at the top, add them to the import (most likely already imported - check first):

```js
describe("Section 13 registration", () => {
  it("has section 13 in sectionNames", () => {
    expect(sectionNames[13]).toBe("AI Agents");
  });

  it("has section 13 in sectionColors", () => {
    expect(sectionColors[13]).toBe("#00838f");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 registration"
```

Expected: FAIL (Section 13 entries don't exist yet).

- [ ] **Step 3: Add Section 13 entries to sectionNames and sectionColors**

In `src/config.js`, locate the `sectionNames` object and add:

```js
12: "Retrieval-Augmented Generation",
13: "AI Agents",
```

In the `sectionColors` object add:

```js
12: "#7c4dff",
13: "#00838f",
```

(Section 12 entries should already exist; if not, ensure both 12 and 13 are present.)

- [ ] **Step 4: Run test to verify pass**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 registration"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 6: Scope verification (`git diff --stat`)**

```bash
git status
git diff --stat
```

Expected: only files in the **Files:** list show as modified.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Register Section 13 in sectionNames and sectionColors"
```

---

## Task 3: Create `src/sections/agent-prompting.jsx` scaffold with 6 stub exports

**Files:**
- Create: `src/sections/agent-prompting.jsx`

**Scope binding:** This task modifies ONLY the files listed. Run `git diff --stat` before committing.

- [ ] **Step 1: Create the file with 6 named stub exports**

Create `src/sections/agent-prompting.jsx`:

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 1: Prompting Foundations
// Chapters 13.1 - 13.6

export const AnatomyOfLlmCall = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Anatomy of an LLM Call
        </T>
        <T size={16}>Stub - implemented in Task 8.</T>
      </Box>
    </div>
  );
};

export const SystemPromptContract = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          System Prompts - The Role Contract
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const FewShotStructuredOutput = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Few-Shot + Structured Output
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ChainOfThoughtSelfConsistency = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Chain of Thought + Self-Consistency
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const PromptVsTuneVsRagVsAgent = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Prompt vs Fine-Tune vs RAG vs Agent
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};

export const ContextEngineering = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Context Engineering
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};
```

The stubs reference `sub` (unused) but accept `ctx` to satisfy the component signature. Each function is replaced with full implementation in Tasks 8-13.

- [ ] **Step 2: Verify the file parses (no test run yet - stubs aren't wired in)**

```bash
node --check src/sections/agent-prompting.jsx 2>&1 || echo "JSX - syntax check skipped; rely on test run after Task 7"
```

(JSX cannot be syntax-checked by Node directly; this step is informational. Vitest will catch real parse failures in subsequent tasks.)

- [ ] **Step 3: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `src/sections/agent-prompting.jsx` shows as new.

- [ ] **Step 4: Commit**

```bash
git add src/sections/agent-prompting.jsx
git commit -m "Add agent-prompting.jsx scaffold with 6 stub exports for Section 13 Act 1"
```

---

## Task 4: Create `src/sections/agent-tools.jsx` scaffold with 5 stub exports

**Files:**
- Create: `src/sections/agent-tools.jsx`

**Scope binding:** Only this file. `git diff --stat` before commit.

- [ ] **Step 1: Create the file with 5 named stub exports**

Create `src/sections/agent-tools.jsx`:

```jsx
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Acts 2 + 3: Tool Calling + Protocols (MCP + A2A)
// Chapters 13.7 - 13.17. In Milestone 1 only 13.7 - 13.11 are non-stub; Act 3 (13.12 - 13.17) is added in Milestone 2.

export const ToolUseAsBridge = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Use - LLM as Orchestrator
        </T>
        <T size={16}>Stub - implemented in Task 14.</T>
      </Box>
    </div>
  );
};

export const JsonSchemaForTools = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          JSON Schemas + Tool Descriptions
        </T>
        <T size={16}>Stub - implemented in Task 15.</T>
      </Box>
    </div>
  );
};

export const ToolCallLifecycle = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Call Lifecycle
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const ParallelToolsAndChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Parallel Tools + Tool Choice
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const ToolErrorsRetries = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Errors, Retries, Validation
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
```

- [ ] **Step 2: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `src/sections/agent-tools.jsx` shows as new.

- [ ] **Step 3: Commit**

```bash
git add src/sections/agent-tools.jsx
git commit -m "Add agent-tools.jsx scaffold with 5 stub exports for Section 13 Act 2"
```

---

## Task 5: Register Section 13 multi-file loader in `learn-ai.jsx`

**Files:**
- Modify: `src/learn-ai.jsx` (`sectionLoaders` object)
- Modify: `src/sections/toc.jsx` (sections array, if TOC iterates statically)

**Scope binding:** Only the two files above. `git diff --stat` before commit.

- [ ] **Step 1: Locate `sectionLoaders` in `src/learn-ai.jsx`**

It is the object that maps section numbers to dynamic-import functions. Pattern from Section 12 (already multi-file):

```jsx
12: () =>
  Promise.all([
    import("./sections/rag-foundations.jsx"),
    import("./sections/rag-ingestion.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 2: Add Section 13 entry**

After the Section 12 entry, add:

```jsx
13: () =>
  Promise.all([
    import("./sections/agent-prompting.jsx"),
    import("./sections/agent-tools.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

- [ ] **Step 3: Register Section 13 in TOC sections array**

In `src/sections/toc.jsx`, locate the sections array (it lists each section's number + name). Add:

```jsx
{ n: 13, name: "AI Agents" },
```

after the Section 12 entry. The exact field names depend on the existing TOC shape - mirror existing entries.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: all tests pass. The new loader is wired but no chapters are added to `chapters[]` yet, so no rendering is triggered.

- [ ] **Step 5: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `src/learn-ai.jsx` and `src/sections/toc.jsx` modified.

- [ ] **Step 6: Commit**

```bash
git add src/learn-ai.jsx src/sections/toc.jsx
git commit -m "Register Section 13 loader and TOC entry"
```

---

## Task 6: Add 13.1-13.11 entries to `chapters[]` in `src/config.js`

**Files:**
- Modify: `src/config.js` (chapters array)
- Modify: `src/__tests__/config.test.js`

**Scope binding:** Only the two files above. `git diff --stat` before commit.

- [ ] **Step 1: Write failing tests for the 11 new chapter entries**

Append to `src/__tests__/config.test.js`:

```js
describe("Section 13 Act 1+2 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.1 AnatomyOfLlmCall", () => {
    const c = findCh("13.1");
    expect(c).toBeDefined();
    expect(c.title).toBe("Anatomy of an LLM Call");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AnatomyOfLlmCall");
  });

  it("has 13.2 SystemPromptContract", () => {
    const c = findCh("13.2");
    expect(c).toBeDefined();
    expect(c.title).toBe("System Prompts - The Role Contract");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SystemPromptContract");
  });

  it("has 13.3 FewShotStructuredOutput", () => {
    const c = findCh("13.3");
    expect(c).toBeDefined();
    expect(c.title).toBe("Few-Shot + Structured Output");
    expect(c.section).toBe(13);
    expect(c.component).toBe("FewShotStructuredOutput");
  });

  it("has 13.4 ChainOfThoughtSelfConsistency", () => {
    const c = findCh("13.4");
    expect(c).toBeDefined();
    expect(c.title).toBe("Chain of Thought + Self-Consistency");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ChainOfThoughtSelfConsistency");
  });

  it("has 13.5 PromptVsTuneVsRagVsAgent", () => {
    const c = findCh("13.5");
    expect(c).toBeDefined();
    expect(c.title).toBe("Prompt vs Fine-Tune vs RAG vs Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("PromptVsTuneVsRagVsAgent");
  });

  it("has 13.6 ContextEngineering", () => {
    const c = findCh("13.6");
    expect(c).toBeDefined();
    expect(c.title).toBe("Context Engineering");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ContextEngineering");
  });

  it("has 13.7 ToolUseAsBridge", () => {
    const c = findCh("13.7");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Use - LLM as Orchestrator");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolUseAsBridge");
  });

  it("has 13.8 JsonSchemaForTools", () => {
    const c = findCh("13.8");
    expect(c).toBeDefined();
    expect(c.title).toBe("JSON Schemas + Tool Descriptions");
    expect(c.section).toBe(13);
    expect(c.component).toBe("JsonSchemaForTools");
  });

  it("has 13.9 ToolCallLifecycle", () => {
    const c = findCh("13.9");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Call Lifecycle");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolCallLifecycle");
  });

  it("has 13.10 ParallelToolsAndChoice", () => {
    const c = findCh("13.10");
    expect(c).toBeDefined();
    expect(c.title).toBe("Parallel Tools + Tool Choice");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ParallelToolsAndChoice");
  });

  it("has 13.11 ToolErrorsRetries", () => {
    const c = findCh("13.11");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Errors, Retries, Validation");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolErrorsRetries");
  });
});
```

- [ ] **Step 2: Run tests to verify failures**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 Act 1\\+2"
```

Expected: FAIL - entries don't exist.

- [ ] **Step 3: Add 11 entries to `chapters[]` in `src/config.js`**

Locate the end of Section 12's entries in `chapters[]`. After the last Section 12 entry (currently `12.41` or whatever the latest is - check), append:

```js
{ id: "13.1", title: "Anatomy of an LLM Call", section: 13, component: "AnatomyOfLlmCall" },
{ id: "13.2", title: "System Prompts - The Role Contract", section: 13, component: "SystemPromptContract" },
{ id: "13.3", title: "Few-Shot + Structured Output", section: 13, component: "FewShotStructuredOutput" },
{ id: "13.4", title: "Chain of Thought + Self-Consistency", section: 13, component: "ChainOfThoughtSelfConsistency" },
{ id: "13.5", title: "Prompt vs Fine-Tune vs RAG vs Agent", section: 13, component: "PromptVsTuneVsRagVsAgent" },
{ id: "13.6", title: "Context Engineering", section: 13, component: "ContextEngineering" },
{ id: "13.7", title: "Tool Use - LLM as Orchestrator", section: 13, component: "ToolUseAsBridge" },
{ id: "13.8", title: "JSON Schemas + Tool Descriptions", section: 13, component: "JsonSchemaForTools" },
{ id: "13.9", title: "Tool Call Lifecycle", section: 13, component: "ToolCallLifecycle" },
{ id: "13.10", title: "Parallel Tools + Tool Choice", section: 13, component: "ParallelToolsAndChoice" },
{ id: "13.11", title: "Tool Errors, Retries, Validation", section: 13, component: "ToolErrorsRetries" },
```

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/config.test.js -t "Section 13 Act 1\\+2"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: NOW the `lookup.test.js` generic "every chapter component exists" test will fail because `AgentPrompting` and `AgentTools` aren't yet registered in the lookup object. That is exactly what Task 7 fixes. If `lookup.test.js` fails here, that is expected; proceed.

If any OTHER test (not lookup.test.js) fails, you have a cross-file gap. Trace it before continuing.

- [ ] **Step 6: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `src/config.js` and `src/__tests__/config.test.js`.

- [ ] **Step 7: Commit**

```bash
git add src/config.js src/__tests__/config.test.js
git commit -m "Add chapter entries 13.1-13.11 to config for Section 13 Act 1+2"
```

---

## Task 7: Register AgentPrompting and AgentTools in lookup.test.js and sections.test.jsx

**Files:**
- Modify: `src/__tests__/lookup.test.js`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two test files. `git diff --stat` before commit.

- [ ] **Step 1: Update `src/__tests__/lookup.test.js`**

Add the static imports near the top with the other section imports:

```js
import * as AgentPrompting from "../sections/agent-prompting.jsx";
import * as AgentTools from "../sections/agent-tools.jsx";
```

Spread into the existing `lookup` object alongside the other sections:

```js
const lookup = {
  ...TOC,
  ...NeuralFoundations,
  // ... existing spreads ...
  ...RagFoundations,
  ...RagIngestion,
  ...AgentPrompting,
  ...AgentTools,
};
```

Add presence tests in the appropriate describe block:

```js
describe("Section 13 component presence", () => {
  it("AgentPrompting exports each Act 1 chapter", () => {
    expect(typeof AgentPrompting.AnatomyOfLlmCall).toBe("function");
    expect(typeof AgentPrompting.SystemPromptContract).toBe("function");
    expect(typeof AgentPrompting.FewShotStructuredOutput).toBe("function");
    expect(typeof AgentPrompting.ChainOfThoughtSelfConsistency).toBe("function");
    expect(typeof AgentPrompting.PromptVsTuneVsRagVsAgent).toBe("function");
    expect(typeof AgentPrompting.ContextEngineering).toBe("function");
  });

  it("AgentTools exports each Act 2 chapter", () => {
    expect(typeof AgentTools.ToolUseAsBridge).toBe("function");
    expect(typeof AgentTools.JsonSchemaForTools).toBe("function");
    expect(typeof AgentTools.ToolCallLifecycle).toBe("function");
    expect(typeof AgentTools.ParallelToolsAndChoice).toBe("function");
    expect(typeof AgentTools.ToolErrorsRetries).toBe("function");
  });
});
```

- [ ] **Step 2: Update `src/__tests__/sections.test.jsx`**

Add the static imports near the top:

```js
import * as AgentPrompting from "../sections/agent-prompting.jsx";
import * as AgentTools from "../sections/agent-tools.jsx";
```

Spread both into the existing `lookup` object alongside the other sections.

- [ ] **Step 3: Run full test suite**

```bash
npm run test
```

Expected: ALL tests pass. The generic "every chapter component exists" test in `lookup.test.js` now finds the components; the generic "All chapters render at every sub-level" test in `sections.test.jsx` renders the stub bodies and passes (stubs return valid JSX).

- [ ] **Step 4: Scope verification**

```bash
git status
git diff --stat
```

Expected: only the two test files modified.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/lookup.test.js src/__tests__/sections.test.jsx
git commit -m "Register AgentPrompting and AgentTools in test lookups"
```

---

## Task 8: Implement Chapter 13.1 AnatomyOfLlmCall

**Files:**
- Modify: `src/sections/agent-prompting.jsx` (replace stub `AnatomyOfLlmCall`)
- Modify: `src/__tests__/sections.test.jsx` (append content tests)

**Scope binding:** Only the two files above. `git diff --stat` before commit.

**Chapter purpose (from spec):** Open the section with a careful walk through what one LLM call actually consists of: the message blocks (system / user / assistant), token boundaries, sampling parameters (temperature, top-p, top-k), stop conditions, and the response shape (content + finish_reason + usage). This is the substrate every later chapter builds on. By the end, the learner can read or write a raw LLM call without confusion.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The three message roles**
  Title: "Every LLM Call Is A List Of Messages"
  Visual: a stacked block diagram of 3 message types - System (cyan tint, top), User (purple tint, middle), Assistant (green tint, bottom). Each block shows its role label + a one-line example for the customer-support agent (system: "You are Alice's customer-support assistant..."; user: "I can't log in - reset my password"; assistant: "I'll help you reset it...").
  Key content: "system", "user", "assistant", "messages", "role".

- **sub=1 (C.blue) - Tokens are the unit of measure**
  Title: "Tokens, Not Words"
  Visual: the user message "I can't log in - reset my password" segmented into tokens with each token a labeled pill. Show the token-count number (e.g., 9 tokens) alongside. Add a secondary row showing the response "I'll help you reset it..." segmented (e.g., 7 tokens). Footer note: "Context window = total tokens across all messages."
  Key content: "token", "context window", "9" or another exact count.

- **sub=2 (C.purple) - Sampling parameters**
  Title: "Temperature, Top-P, Top-K"
  Visual: 3 stacked rows. Row 1 (Temperature): a horizontal bar from 0 to 2 with markers at 0.0 / 0.3 / 0.7 / 1.0 / 2.0 labeled "Deterministic / Focused / Default / Creative / Wild". Row 2 (Top-P): show probability mass as a CDF curve, with a vertical cut at 0.9 indicating the sampled vocabulary slice. Row 3 (Top-K): a horizontal list of next-token candidates with the top 5 highlighted.
  Key content: "temperature", "top-p" or "top p", "top-k" or "top k", "0.7" or similar default value.

- **sub=3 (C.indigo) - Stop conditions**
  Title: "When Does Generation End?"
  Visual: 4 stop conditions as a card grid - (a) Max tokens reached (`max_tokens: 1024`), (b) Stop sequence hit (`stop: ["</answer>"]`), (c) End-of-turn token from model, (d) Tool call requested (only with tool use). Each card has a finish_reason value (`length`, `stop_sequence`, `end_turn`, `tool_use`) in distinct color.
  Key content: "stop", "max_tokens" or "max tokens", "finish_reason", "end_turn".

- **sub=4 (C.teal) - The response object**
  Title: "What Comes Back"
  Visual: a styled mono-text artifact block titled "Response Shape" showing the canonical response structure:
  ```
  {
    "content": "I'll help you reset it...",
    "stop_reason": "end_turn",
    "usage": {
      "input_tokens": 9,
      "output_tokens": 7
    }
  }
  ```
  Highlight the three fields (content, stop_reason, usage) in distinct colors. Label it as the canonical "Response Shape" not as code.
  Key content: "content", "stop_reason" or "finish_reason", "usage", "input_tokens", "output_tokens".

- **sub=5 (C.cyan) - Full call cycle**
  Title: "One Complete LLM Call"
  Visual: timeline / flow diagram of one call - [Build Messages] -> [Set Parameters] -> [Send Request] -> [Tokens Stream Back] -> [Stop Reason Reached] -> [Final Response]. Each arrow labeled. Bottom annotation: median latency 1.5s for a 7-token response.
  Key content: "messages", "request", "stream" or "response", "stop reason" / "finish", "latency".

- [ ] **Step 1: Write content tests for 13.1**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("AnatomyOfLlmCall (13.1) content", () => {
  const fn = AgentPrompting.AnatomyOfLlmCall;

  it("sub=0 shows three message roles", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/assistant/i);
  });

  it("sub=1 explains tokens and context window", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/context window/i);
  });

  it("sub=2 covers temperature / top-p / top-k", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/temperature/i);
    expect(container.textContent).toMatch(/top.?p/i);
    expect(container.textContent).toMatch(/top.?k/i);
  });

  it("sub=3 lists stop conditions and finish_reason", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/max.?tokens/i);
    expect(container.textContent).toMatch(/stop.?(reason|sequence)/i);
    expect(container.textContent).toMatch(/end.?turn/i);
  });

  it("sub=4 shows response shape with content/stop_reason/usage", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/content/i);
    expect(container.textContent).toMatch(/stop.?reason|finish.?reason/i);
    expect(container.textContent).toMatch(/usage/i);
    expect(container.textContent).toMatch(/input.?tokens/i);
    expect(container.textContent).toMatch(/output.?tokens/i);
  });

  it("sub=5 traces the complete call cycle", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/messages/i);
    expect(container.textContent).toMatch(/request|send/i);
    expect(container.textContent).toMatch(/response|stream/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AnatomyOfLlmCall"
```

Expected: FAIL - stub doesn't contain expected content.

- [ ] **Step 3: Implement the full AnatomyOfLlmCall chapter**

Replace the stub export in `src/sections/agent-prompting.jsx` with the full implementation. Use the existing pattern in `src/sections/rag-foundations.jsx` (e.g., `WhyLLMsNeedRetrieval`) as a reference. Required:

- 6 sub-steps total (sub >= 0 through sub >= 5).
- Sub=0 inline (`{sub >= 0 && ...}`); subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
- Colors per sub-step as specified above (cyan, blue, purple, indigo, teal, cyan).
- Center-aligned titles: `<T color={C.X} bold center size={22}>`.
- Title-case for all diagram box text. "Three Message Roles", "Tokens, Not Words", "Sampling Parameters" - every word capitalized.
- Inner element tinted backgrounds: `background: \`${C.X}06\``; border `1px solid ${C.X}12`.
- Response-shape mono block is rendered as a styled text artifact (NOT a code block): `<div style={{ fontFamily: "monospace", fontSize: 14, padding: 12, background: \`${C.teal}06\`, border: \`1px solid ${C.teal}12\`, borderRadius: 8, textAlign: "center" }}>...</div>`. Highlight `content`, `stop_reason`, `usage` in distinct text colors.
- No em-dashes anywhere.
- Body text 16-19px, titles 22px.
- Content must include all strings the tests assert on (see test regexes above).
- Standalone artifacts / formulas centered with `textAlign: "center"`.
- No "Preview:" / "Next:" / "Coming up:" forward references.

Follow the spec's chapter 13.1 description and the sub-step structure above.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "AnatomyOfLlmCall"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

Expected: no errors. `npm run format` may modify the files; re-add after.

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `src/sections/agent-prompting.jsx` and `src/__tests__/sections.test.jsx`.

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.1 Anatomy of an LLM Call"
```

---

## Task 9: Implement Chapter 13.2 SystemPromptContract

**Files:**
- Modify: `src/sections/agent-prompting.jsx` (replace stub `SystemPromptContract`)
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above. `git diff --stat` before commit.

**Chapter purpose (from spec):** The system prompt is the role contract - a constitution every later message is interpreted under. Walk through its four moving parts (persona, capabilities, constraints, output rules), show a canonical artifact for the customer-support agent, and contrast a vague system prompt with a production-grade one.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - System prompt as role contract**
  Title: "The System Prompt Is The Contract"
  Visual: a single labeled "Contract" card with 4 inner rows - Persona / Capabilities / Constraints / Output Rules. Each row a one-line description. Top of card: "Read by the model on EVERY turn".
  Key content: "system prompt", "contract", "persona", "constraints", "output rules".

- **sub=1 (C.blue) - Persona**
  Title: "Persona: Who Am I?"
  Visual: a "before / after" pair. Before: "You are a chatbot." After: "You are Alice's customer-support assistant for the customer support knowledge base. You are friendly, concise, and you never invent policies." Each in a tinted box.
  Key content: "persona", "concise", "never invent" or "policies".

- **sub=2 (C.purple) - Capabilities**
  Title: "Capabilities: What Tools Do I Have?"
  Visual: 4 of the 8 canonical tools rendered as labeled tool cards (`search_kb`, `lookup_customer`, `process_refund`, `escalate_human`) with one-line descriptions. Mention the model is told it has these tools available.
  Key content: "search_kb", "lookup_customer", "tools", "capabilities" or "available".

- **sub=3 (C.indigo) - Constraints**
  Title: "Constraints: What I Must Never Do"
  Visual: a "negative-space" panel listing constraints as red-bordered cards - "Never promise refunds over $200 without escalation"; "Never share another customer's data"; "Never claim policies not in the KB"; "Never call tools without first looking up the customer".
  Key content: "constraint", "never", "refund" or "$200", "escalate", "policy".

- **sub=4 (C.teal) - Output rules**
  Title: "Output Rules: How Do I Respond?"
  Visual: a labeled list of output requirements - "Always greet by name"; "Cite the KB doc when quoting policy"; "Wrap tool calls in `<thinking>` first"; "End with a follow-up question or escalation offer". One per line, tinted background.
  Key content: "output", "cite", "follow-up" or "follow up", "greet".

- **sub=5 (C.cyan) - The canonical artifact**
  Title: "The Full System Prompt"
  Visual: styled mono-text artifact labeled "Prompt Template" containing the assembled system prompt for the customer-support agent (all four parts woven into 8-12 lines). Use the artifact treatment - tinted background `${C.cyan}06`, monospace 14px, centered.
  Key content: "You are", "tools available" or "you can call", "never", "cite".

- [ ] **Step 1: Write content tests for 13.2**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("SystemPromptContract (13.2) content", () => {
  const fn = AgentPrompting.SystemPromptContract;

  it("sub=0 frames system prompt as contract with four parts", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/contract/i);
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/constraint/i);
    expect(container.textContent).toMatch(/output rules/i);
  });

  it("sub=1 contrasts vague vs persona-specific prompt", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/customer.support/i);
  });

  it("sub=2 lists agent capabilities and tools", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/tools?|capabilit/i);
  });

  it("sub=3 enumerates constraints", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/never/i);
    expect(container.textContent).toMatch(/refund|\$200/i);
    expect(container.textContent).toMatch(/escalat/i);
  });

  it("sub=4 lists output rules", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cite|citation/i);
    expect(container.textContent).toMatch(/greet|follow.?up/i);
  });

  it("sub=5 shows full prompt template artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/you are/i);
    expect(container.textContent).toMatch(/tools|call/i);
    expect(container.textContent).toMatch(/never/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SystemPromptContract"
```

Expected: FAIL.

- [ ] **Step 3: Implement the SystemPromptContract chapter**

Follow the sub-step structure above. Patterns:
- 6 sub-steps, colors as specified.
- Prompt-template artifact in sub=5 uses styled mono-text block (artifact treatment from spec).
- All diagram box text title-case ("The System Prompt Is The Contract", "Never Promise Refunds Over $200 Without Escalation").
- No em-dashes; no carry-over brand names.
- Content must include strings the tests assert on.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "SystemPromptContract"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.2 System Prompts - The Role Contract"
```

---

## Task 10: Implement Chapter 13.3 FewShotStructuredOutput

**Files:**
- Modify: `src/sections/agent-prompting.jsx` (replace stub `FewShotStructuredOutput`)
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above. `git diff --stat` before commit.

**Chapter purpose (from spec):** Combine two techniques production agents use constantly: few-shot prompting (showing the model 3-5 examples in the prompt to set the pattern) and structured output (forcing the response to fit a JSON schema). Show how they collaborate - few-shot demonstrates the WHAT, JSON schema guarantees the SHAPE. End with a ticket-classification artifact the support agent will reuse later.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - Zero-shot vs few-shot intuition**
  Title: "Show, Don't Just Tell"
  Visual: a 2-column comparison. Left: zero-shot prompt "Classify this ticket as billing / product / troubleshooting" with model response sometimes wrong. Right: few-shot prompt with 3 labeled examples first, then the query - model response now consistent. Use ticket T1, T3, T4 as the 3 examples.
  Key content: "few-shot", "examples", "classify", "billing", "troubleshooting".

- **sub=1 (C.blue) - Anatomy of a few-shot block**
  Title: "Three Examples, Same Format"
  Visual: 3 stacked example cards each showing Input -> Output. Use the support corpus tickets:
  - Input: "I can't log in - reset my password" / Output: "Category: billing | Urgency: low"
  - Input: "Charged twice for last month" / Output: "Category: billing | Urgency: high"
  - Input: "Dashboard shows 500 errors" / Output: "Category: troubleshooting | Urgency: medium"
  All output strings in the SAME format - this is the point.
  Key content: "input", "output", "same format", "category", "urgency".

- **sub=2 (C.purple) - Structured output: enforced JSON**
  Title: "Schemas Make The Shape Non-Negotiable"
  Visual: a styled mono-text artifact labeled "Output Schema" showing JSON Schema for ticket classification:
  ```
  {
    "type": "object",
    "properties": {
      "category": { "enum": ["billing", "product", "troubleshooting"] },
      "urgency": { "enum": ["low", "medium", "high"] },
      "confidence": { "type": "number", "minimum": 0, "maximum": 1 }
    },
    "required": ["category", "urgency", "confidence"]
  }
  ```
  Centered, tinted background, mono font.
  Key content: "json schema" or "schema", "category", "urgency", "enum", "required".

- **sub=3 (C.indigo) - Few-shot + schema = belt and suspenders**
  Title: "Together They Eliminate Drift"
  Visual: a Venn-style or stacked diagram. Few-shot demonstrates VALUES and STYLE. Schema enforces STRUCTURE. Together: model produces "category: billing, urgency: high, confidence: 0.85" every single time, no rogue fields, no rogue values.
  Key content: "drift", "structure", "values", "every time" or "always".

- **sub=4 (C.teal) - 5 production tips**
  Title: "What Actually Matters In Few-Shot"
  Visual: 5 numbered cards:
  1. Use 3-5 examples; more often hurts.
  2. Diverse examples beat similar ones.
  3. Edge cases improve robustness more than typical ones.
  4. Examples should span all your enum values.
  5. The last example sets the strongest pattern - put your hardest case last.
  Key content: "3-5" or "3 to 5", "diverse", "edge cases", "enum", "last example".

- **sub=5 (C.cyan) - The classification artifact**
  Title: "The Ticket-Classifier We'll Reuse"
  Visual: the full assembled prompt template (artifact treatment) showing: System line ("You classify support tickets...") + 3 few-shot examples + output schema + ticket-to-classify slot. This artifact is referenced in later chapters.
  Key content: "ticket", "classifier" or "classify", "category", "schema".

- [ ] **Step 1: Write content tests for 13.3**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("FewShotStructuredOutput (13.3) content", () => {
  const fn = AgentPrompting.FewShotStructuredOutput;

  it("sub=0 contrasts zero-shot and few-shot", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/few.?shot/i);
    expect(container.textContent).toMatch(/example/i);
    expect(container.textContent).toMatch(/classif/i);
  });

  it("sub=1 shows three examples in the same format", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/output/i);
    expect(container.textContent).toMatch(/category|billing|troubleshooting/i);
  });

  it("sub=2 shows the output schema with enums", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 explains few-shot + schema combination", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/structure/i);
    expect(container.textContent).toMatch(/drift|consistent|every/i);
  });

  it("sub=4 lists production tips", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/3.?(to|-)? ?5/i);
    expect(container.textContent).toMatch(/diverse|edge case/i);
  });

  it("sub=5 shows the assembled classifier artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/classif/i);
    expect(container.textContent).toMatch(/category|schema/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "FewShotStructuredOutput"
```

Expected: FAIL.

- [ ] **Step 3: Implement the FewShotStructuredOutput chapter**

Follow the sub-step structure above. Both JSON schemas and the assembled prompt artifact use the styled mono-text treatment (NOT executable code blocks). Sub-step colors as specified.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "FewShotStructuredOutput"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.3 Few-Shot + Structured Output"
```

---

## Task 11: Implement Chapter 13.4 ChainOfThoughtSelfConsistency

**Files:**
- Modify: `src/sections/agent-prompting.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** Two foundational reasoning prompts. Chain-of-thought (CoT) trades latency + tokens for accuracy on tasks where the model benefits from "thinking out loud". Self-consistency runs CoT N times and votes - reducing variance further. Show when each helps, when each hurts, and what reasoning-model release (Section 10.4 Thinking) means for the technique.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - CoT vs direct answer**
  Title: "Reasoning In The Open"
  Visual: side-by-side. Direct answer: "What is the refund for ticket T4 (annual plan cancelled month 7)?" / "$45" (wrong). CoT: same question with model writing "Annual plan = $120. 5 months remaining out of 12 = $50 prorated refund. Subtract 10% cancellation fee = $45." (correct workings, correct answer). Show that CoT exposed the math.
  Key content: "chain of thought" or "cot", "refund", "prorate" or "prorated", "step by step" or "reason".

- **sub=1 (C.blue) - Zero-shot CoT trigger**
  Title: "The 'Let's Think Step By Step' Trick"
  Visual: a styled mono-text prompt-template snippet showing the trigger phrase appended to a user query. Show two variants: (a) "Let's think step by step." (b) "Think carefully before answering."
  Key content: "step by step", "trigger", "zero-shot" or "no examples".

- **sub=2 (C.purple) - Few-shot CoT**
  Title: "Show The Reasoning In Examples"
  Visual: a 2-example block where each example includes BOTH the question AND the reasoning trace before the final answer. This pattern transfers reasoning style, not just answer format.
  Key content: "reasoning", "trace", "examples".

- **sub=3 (C.indigo) - Self-consistency: sample N times**
  Title: "Run N Times, Vote"
  Visual: a fan-out diagram. One question -> sample with temperature 0.7 N=5 times -> 5 different reasoning paths -> 5 candidate answers. 4 say "$45", 1 says "$50". Majority vote selects "$45".
  Key content: "self.?consistency", "N times" or "sample", "majority" or "vote".

- **sub=4 (C.teal) - Cost / latency tradeoff**
  Title: "What CoT Buys And What It Costs"
  Visual: a 2-row table: CoT alone vs Self-consistency N=5. Columns: Tokens used, Latency, Accuracy. CoT alone: 5x tokens, 5x latency, +15% accuracy. Self-consistency: 25x tokens, 25x latency (or 5x with parallel), +20% accuracy.
  Key content: "cost", "latency", "tokens", "accuracy", "tradeoff".

- **sub=5 (C.cyan) - When to use vs skip**
  Title: "When Chain-Of-Thought Wins"
  Visual: a 2-column "Use" / "Skip" card grid. Use: arithmetic, multi-hop reasoning, ambiguous questions. Skip: classification, lookup tasks, simple factoid. Footer note: "Reasoning models (Section 10.4 Thinking) reduce the need to prompt for CoT - they do it internally."
  Key content: "use", "skip", "arithmetic" or "math", "classification" or "lookup", "10.4" or "thinking" or "reasoning model".

- [ ] **Step 1: Write content tests for 13.4**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ChainOfThoughtSelfConsistency (13.4) content", () => {
  const fn = AgentPrompting.ChainOfThoughtSelfConsistency;

  it("sub=0 contrasts direct vs CoT answer", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain of thought|cot|step by step/i);
    expect(container.textContent).toMatch(/refund|prorat/i);
  });

  it("sub=1 shows the zero-shot CoT trigger", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/step by step/i);
  });

  it("sub=2 explains few-shot CoT", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/example/i);
  });

  it("sub=3 shows self-consistency vote", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/self.?consistency|vote|majority/i);
    expect(container.textContent).toMatch(/sample|n.?times|5/i);
  });

  it("sub=4 lists the cost / latency tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|token/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/accuracy/i);
  });

  it("sub=5 indicates when to skip CoT and references Section 10.4", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/skip|classif|lookup/i);
    expect(container.textContent).toMatch(/10\.4|thinking|reasoning model/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ChainOfThoughtSelfConsistency"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ChainOfThoughtSelfConsistency chapter**

Sub-step structure as above. Includes a within-section back-reference to Section 10.4 Thinking in sub=5.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ChainOfThoughtSelfConsistency"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.4 Chain of Thought + Self-Consistency"
```

---

## Task 12: Implement Chapter 13.5 PromptVsTuneVsRagVsAgent

**Files:**
- Modify: `src/sections/agent-prompting.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** The decision matrix - given a new use case, which approach? Walk through each option, the four-axis matrix that distinguishes them (data freshness, capability gap, latency budget, cost budget), the decision tree, the stack pattern (combine when useful), and 4 anti-patterns.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.cyan) - The four approaches**
  Title: "Four Tools In The Toolbox"
  Visual: 4 cards side-by-side - Prompting (no model change, no data), Fine-tuning (weights changed), RAG (data retrieved), Agent (LLM uses tools in a loop). Each card has a one-line "what changes at inference" summary.
  Key content: "prompt", "fine.?tun", "rag", "agent".

- **sub=1 (C.blue) - Data freshness axis**
  Title: "Does The Data Change?"
  Visual: a horizontal axis from "Never" to "Daily". Plot the 4 approaches: Fine-tuning ("Never to weekly"), Prompting ("Never"), RAG ("Hourly"), Agent ("Real-time per query"). Production rule: data that moves fast belongs OUTSIDE the model.
  Key content: "freshness", "data", "outside", "fast".

- **sub=2 (C.purple) - Capability gap axis**
  Title: "Is The Capability Missing?"
  Visual: a vertical axis. Bottom: "Already in base model" -> Prompting wins. Top: "Specialized skill never seen" -> Fine-tuning needed. RAG fills factual gaps; Agent fills action gaps (the model can't book a flight by itself).
  Key content: "capability", "skill", "missing" or "gap", "specialized".

- **sub=3 (C.indigo) - Latency / cost axes**
  Title: "Latency And Cost Budget"
  Visual: 2x2 quadrant. Latency low / Cost low: Prompting. Latency low / Cost high: Fine-tuning (after training). Latency higher / Cost low: RAG. Latency highest / Cost variable: Agent (loops cost more).
  Key content: "latency", "cost", "budget", "loop".

- **sub=4 (C.teal) - Decision tree**
  Title: "Which One? Walk The Tree"
  Visual: a 4-leaf decision tree:
  - "Does the model already know it well enough? Yes -> Prompting alone."
  - "Knowledge needs to stay current? Yes -> RAG."
  - "Need a specialized skill the model doesn't have? Yes -> Fine-tuning (plus RAG if data also moves)."
  - "Need to take actions in the world via tools? Yes -> Agent."
  Each leaf in a distinct tint.
  Key content: "decision", "tree", "current" or "fresh", "action" or "tool".

- **sub=5 (C.cyan) - Stack pattern**
  Title: "Most Production Systems Stack Them"
  Visual: a layered diagram with all 4 stacked. From bottom: Fine-tuned base model -> + RAG for fresh data -> + Agent loop for actions -> + Prompting / few-shot per task. Bottom annotation: "These aren't either/or; production systems pick what fits each axis and combine."
  Key content: "stack", "combine", "layer".

- **sub=6 (C.cyan) - Anti-patterns**
  Title: "Common Misuses"
  Visual: 4 red-bordered cards:
  - "Fine-tuning to add fresh facts" -> Use RAG.
  - "RAG for behavior the model doesn't know" -> Fine-tune.
  - "Agent loop for a simple lookup" -> Direct call + tool.
  - "Massive prompt instead of fine-tuning a small model" -> Cost runaway.
  Key content: "anti.?pattern" or "misuse" or "wrong", "fine.?tun", "rag", "agent".

- [ ] **Step 1: Write content tests for 13.5**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("PromptVsTuneVsRagVsAgent (13.5) content", () => {
  const fn = AgentPrompting.PromptVsTuneVsRagVsAgent;

  it("sub=0 lists four approaches", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/fine.?tun/i);
    expect(container.textContent).toMatch(/rag/i);
    expect(container.textContent).toMatch(/agent/i);
  });

  it("sub=1 axes on data freshness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fresh/i);
    expect(container.textContent).toMatch(/data/i);
  });

  it("sub=2 axes on capability gap", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|skill|gap/i);
  });

  it("sub=3 covers latency and cost", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
  });

  it("sub=4 shows the decision tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/action|tool/i);
  });

  it("sub=5 shows the stack pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/stack|combine|layer/i);
  });

  it("sub=6 lists anti-patterns", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/anti.?pattern|misuse|wrong/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "PromptVsTuneVsRagVsAgent"
```

Expected: FAIL.

- [ ] **Step 3: Implement the PromptVsTuneVsRagVsAgent chapter**

Sub-step structure as above. Chapter has 7 sub-steps (slightly larger than typical 5-6).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "PromptVsTuneVsRagVsAgent"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.5 Prompt vs Fine-Tune vs RAG vs Agent"
```

---

## Task 13: Implement Chapter 13.6 ContextEngineering

**Files:**
- Modify: `src/sections/agent-prompting.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** The meta-skill - assembling the right content into the context window every turn. Token budget, ordering, lost-in-the-middle, eviction. This chapter closes Act 1 and sets up everything Act 5 (memory) deepens.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The context window is a fixed budget**
  Title: "Tokens In, Tokens Out, Hard Cap"
  Visual: a labeled budget bar showing a 128k context window broken into reserved zones - System prompt (4k) + Conversation history (varies) + Retrieved docs (varies) + User input (1k) + Reserved for output (4k). Annotate: "Anything past 128k gets dropped or summarized."
  Key content: "context window", "128k" or "budget", "system", "history", "retrieved", "output".

- **sub=1 (C.blue) - Prompt assembly stack**
  Title: "What Goes In, In Which Order"
  Visual: vertical stack from top (system prompt) to bottom (user query) - System / Few-shot / Conversation history / Retrieved chunks / User query. Each layer tinted. Annotate: model reads top-to-bottom; recency = bottom.
  Key content: "assembly", "stack", "order", "history".

- **sub=2 (C.purple) - Token budget visualization**
  Title: "Same Window, Different Strategies"
  Visual: 3 stacked bar charts on the same axis showing 3 strategies for a 128k window facing a long ticket:
  - Strategy A "Cram everything": 4k system / 50k history / 70k retrieved / 1k user / 3k output. (At-risk: lost-in-middle.)
  - Strategy B "Trim history": 4k system / 8k history (summary) / 80k retrieved / 1k user / 35k output.
  - Strategy C "Trim retrieval": 4k system / 50k history / 8k retrieved (top-3) / 1k user / 65k output.
  Annotate which wins for which ticket type.
  Key content: "strategy" or "trim", "summary", "retrieve" or "top.?3", "lost".

- **sub=3 (C.indigo) - Lost-in-the-middle**
  Title: "Models Forget The Middle"
  Visual: a U-shaped attention curve. X-axis = position in context (token 0 to 128k). Y-axis = recall accuracy. Curve dips in the middle. Annotate: most-important info goes at the START or END of context, not buried.
  Key content: "lost in the middle" or "u.?shape", "middle", "start" or "end" or "edge".

- **sub=4 (C.teal) - Ordering strategy**
  Title: "Relevance-First vs Recency-First"
  Visual: 2-column comparison. Relevance-first: rerank retrieved chunks by similarity, top-3 closest to query at the top. Recency-first: latest history at the bottom (near query) for conversational coherence. Decision rule: factual queries -> relevance-first; multi-turn convo -> recency-first.
  Key content: "relevance", "recency", "rerank", "factual" or "convers".

- **sub=5 (C.cyan) - What to evict when budget tight**
  Title: "Eviction Order: Cheapest Loss First"
  Visual: an eviction ladder, top of ladder is "evict last", bottom is "evict first":
  1. System prompt (never evict).
  2. Last user message (never evict).
  3. Latest assistant response (rarely evict).
  4. Top-3 retrieved chunks (rarely evict).
  5. Older retrieved chunks beyond top-3 (evict first).
  6. Mid-conversation history (summarize, then evict raw turns).
  Key content: "evict", "ladder" or "order", "summar".

- [ ] **Step 1: Write content tests for 13.6**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ContextEngineering (13.6) content", () => {
  const fn = AgentPrompting.ContextEngineering;

  it("sub=0 shows the context window budget", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window/i);
    expect(container.textContent).toMatch(/128k|budget/i);
    expect(container.textContent).toMatch(/system/i);
  });

  it("sub=1 shows prompt assembly stack", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/history|conversation/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 compares budget strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/strategy|trim|summar/i);
  });

  it("sub=3 explains lost-in-the-middle", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lost in the middle|u.?shape|middle/i);
  });

  it("sub=4 contrasts relevance-first and recency-first", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/recency/i);
  });

  it("sub=5 shows the eviction ladder", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/evict/i);
    expect(container.textContent).toMatch(/summar/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ContextEngineering"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ContextEngineering chapter**

Sub-step structure as above. SVGs for the U-shaped curve and the budget bars need `<desc>` metadata + entries in `src/data/svg-descriptions.json` (Task 21 covers final SVG audit).

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ContextEngineering"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-prompting.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.6 Context Engineering"
```

---

## Task 14: Implement Chapter 13.7 ToolUseAsBridge

**Files:**
- Modify: `src/sections/agent-tools.jsx` (replace stub `ToolUseAsBridge`)
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** Open Act 2 by re-framing the LLM as an orchestrator that calls real functions. Show what changes - the model now triggers side effects, gets fresh facts, takes actions. Introduce the canonical tool inventory the rest of Act 2 (and the section) reuses.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - LLM only vs LLM + tools**
  Title: "Pure LLM vs LLM With Tools"
  Visual: 2-column comparison. Left: LLM-only handles ticket T5 "What's the difference between Pro and Enterprise?" - relies on training data, may hallucinate. Right: LLM + `search_kb` tool retrieves the actual comparison doc, then answers. Different shape of capability.
  Key content: "pure llm|llm only", "tools", "search_kb".

- **sub=1 (C.blue) - What is a tool**
  Title: "A Tool Is A Function The Model Can Call"
  Visual: a labeled card. Function: `lookup_customer(email: string) -> Customer`. The MODEL decides when to call. The RUNTIME executes. Result returns to the model. Annotate each arrow.
  Key content: "function", "call", "runtime", "result".

- **sub=2 (C.purple) - Three things you provide**
  Title: "Name, Description, Parameters"
  Visual: a tool definition card with 3 labeled rows - Name: `process_refund` / Description: "Refund a paid invoice. Refunds over $200 require human approval." / Parameters: `{invoice_id: string, reason: string}`. The DESCRIPTION is what the model reads to decide WHEN to call.
  Key content: "name", "description", "parameter", "refund" or "invoice".

- **sub=3 (C.indigo) - Who decides when to call**
  Title: "The Model Decides, The Runtime Executes"
  Visual: flow diagram. User msg -> LLM reads -> LLM thinks ("user asked for refund, I should call process_refund") -> LLM emits tool_use block -> Runtime sees block, calls function -> Result returned -> LLM continues. Annotate that the model can also choose to NOT call any tool and just respond.
  Key content: "decide", "tool_use", "runtime", "emit" or "call".

- **sub=4 (C.teal) - The agent loop is built on this**
  Title: "One Call, Or A Loop Of Calls?"
  Visual: a small loop diagram. Reason -> Act (call tool) -> Observe (read result) -> Reason again. Annotate: "A single tool call is the atom; an agent loop is the molecule. We'll formalize the loop in Section 13.20."
  Key content: "loop", "reason|act|observe", "13.20".

- **sub=5 (C.cyan) - The canonical tool inventory**
  Title: "The 8 Tools Our Support Agent Has"
  Visual: a 2x4 grid of the canonical tools from the spec. Each card: tool name + 1-line description. The same 8 tools used across all of Section 13.
  Key content: "search_kb", "lookup_customer", "lookup_subscription", "reset_password", "change_email", "process_refund", "escalate_human", "send_email".

- [ ] **Step 1: Write content tests for 13.7**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ToolUseAsBridge (13.7) content", () => {
  const fn = AgentTools.ToolUseAsBridge;

  it("sub=0 contrasts pure LLM vs LLM with tools", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pure llm|llm only|without tools/i);
    expect(container.textContent).toMatch(/search_kb/i);
  });

  it("sub=1 defines tool as callable function", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/function/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=2 shows the three parts: name / description / parameters", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/parameter/i);
  });

  it("sub=3 explains the model-decides / runtime-executes split", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/tool_use|tool use/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=4 sketches the loop and references 13.20", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/loop|reason.?act.?observe/i);
    expect(container.textContent).toMatch(/13\.20/);
  });

  it("sub=5 enumerates the 8 canonical tools", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/process_refund/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/send_email/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolUseAsBridge"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ToolUseAsBridge chapter**

Sub-step structure as above. Sub=5's tool inventory card grid uses cyan color family, each card title-case ("Search KB", "Lookup Customer", "Process Refund", etc.), each with the function-signature spelling (`search_kb`, etc.) inside.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolUseAsBridge"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.7 Tool Use - LLM as Orchestrator"
```

---

## Task 15: Implement Chapter 13.8 JsonSchemaForTools

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** A tool's schema and description are the contract. Show JSON-schema basics (required vs optional, enums, format constraints), write a good description, contrast bad vs good descriptions, end with the canonical `lookup_customer` schema as the reference shape for the rest of Section 13.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The schema is the contract**
  Title: "Schema First, Implementation Second"
  Visual: a styled mono-text artifact labeled "Tool Schema (shape)" with the basic `lookup_customer` schema:
  ```
  {
    "name": "lookup_customer",
    "description": "Look up a customer by email address.",
    "input_schema": {
      "type": "object",
      "properties": {
        "email": { "type": "string", "format": "email" }
      },
      "required": ["email"]
    }
  }
  ```
  Highlight the four pieces (name, description, input_schema, required).
  Key content: "schema", "lookup_customer", "email", "required".

- **sub=1 (C.blue) - Required vs optional**
  Title: "What's Required, What's Optional?"
  Visual: a side-by-side. process_refund schema with `invoice_id` required and `reason` optional. Annotate: required = model MUST provide; optional = model decides whether to include.
  Key content: "required", "optional", "invoice_id", "reason".

- **sub=2 (C.purple) - Enum and format constraints**
  Title: "Narrowing The Allowed Values"
  Visual: an `escalate_human` schema with `urgency: enum["low", "medium", "high"]` and `transcript: string`. Show that enum prevents the model from inventing arbitrary urgencies. Add a `format: "email"` example for `lookup_customer`.
  Key content: "enum", "urgency", "low.*medium.*high|high.*medium.*low", "format".

- **sub=3 (C.indigo) - Writing a good description**
  Title: "Descriptions Are Read By The Model"
  Visual: a checklist card - 5 rules for tool descriptions:
  1. State what the tool does in plain language.
  2. State the side effects (does it mutate state? send email? cost money?).
  3. State when NOT to use the tool.
  4. Use the same vocabulary the user would use.
  5. Mention any constraints (rate limits, $-thresholds, retry semantics).
  Key content: "description", "side effect", "rate limit" or "threshold", "vocabulary" or "plain".

- **sub=4 (C.teal) - Bad vs good description**
  Title: "One Sentence Changes Everything"
  Visual: 2 mono blocks for `process_refund`:
  - Bad: "Refund function."
  - Good: "Refund a paid invoice. Use only when the customer has confirmed cancellation. Refunds over $200 require human approval - call `escalate_human` instead for those."
  Key content: "bad" or "vague", "good" or "specific", "200", "escalate".

- **sub=5 (C.cyan) - The canonical schema**
  Title: "Our Reference Tool: lookup_customer"
  Visual: the full canonical `lookup_customer` schema (artifact treatment, mono-text, tinted background) used across Section 13. Labeled "Canonical Tool Schema" so later chapters can refer back. Include name + description + input_schema + an example tool_use invocation block.
  Key content: "lookup_customer", "input_schema", "email", "canonical|reference".

- [ ] **Step 1: Write content tests for 13.8**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("JsonSchemaForTools (13.8) content", () => {
  const fn = AgentTools.JsonSchemaForTools;

  it("sub=0 shows the schema as contract", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/input_schema|properties/i);
  });

  it("sub=1 distinguishes required vs optional", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/optional/i);
  });

  it("sub=2 shows enum and format constraints", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 lists description-writing rules", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/side effect|mutate/i);
  });

  it("sub=4 contrasts bad and good descriptions", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/bad|vague/i);
    expect(container.textContent).toMatch(/good|specific/i);
    expect(container.textContent).toMatch(/200|escalate/i);
  });

  it("sub=5 shows the canonical lookup_customer reference", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/canonical|reference/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "JsonSchemaForTools"
```

Expected: FAIL.

- [ ] **Step 3: Implement the JsonSchemaForTools chapter**

Sub-step structure as above. All schema artifacts use mono-text styled blocks (not code blocks). The canonical `lookup_customer` schema is the reference shape used by 13.9, 13.10, 13.11.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "JsonSchemaForTools"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.8 JSON Schemas + Tool Descriptions"
```

---

## Task 16: Implement Chapter 13.9 ToolCallLifecycle

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** Walk through the full tool-call lifecycle as a swim-lane: user request -> LLM emits tool_use -> runtime executes -> tool_result returned -> LLM continues. Show the canonical tool_use and tool_result message shapes. Trace ticket T1 (password reset) end-to-end.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The lifecycle overview**
  Title: "From Request To Final Answer"
  Visual: a 6-step horizontal swim-lane labeled top-to-bottom: User -> Model -> Runtime -> Tool -> Runtime -> Model -> User. Arrows annotated with message kinds (user msg, tool_use, function call, function return, tool_result, assistant msg).
  Key content: "user", "model", "runtime", "tool_use", "tool_result".

- **sub=1 (C.blue) - The tool_use message**
  Title: "Tool-Use: Model Asks Runtime To Call"
  Visual: a styled mono-text artifact labeled "Tool-Use Message":
  ```
  {
    "type": "tool_use",
    "id": "toolu_01abc...",
    "name": "reset_password",
    "input": { "customer_id": "c-9924" }
  }
  ```
  Highlight `type`, `id`, `name`, `input`.
  Key content: "tool_use", "name", "input", "reset_password", "customer_id".

- **sub=2 (C.purple) - The tool_result message**
  Title: "Tool-Result: Runtime Returns The Outcome"
  Visual: a styled mono-text artifact labeled "Tool-Result Message":
  ```
  {
    "type": "tool_result",
    "tool_use_id": "toolu_01abc...",
    "content": "Password reset email sent to alice@example.com.",
    "is_error": false
  }
  ```
  Highlight `tool_use_id` (must match the tool_use), `content`, `is_error`.
  Key content: "tool_result", "tool_use_id", "content", "is_error".

- **sub=3 (C.indigo) - Full ticket T1 trace**
  Title: "Trace: Ticket T1 Password Reset"
  Visual: a 4-row swim-lane for ticket T1:
  1. User: "I can't log in - reset my password"
  2. Model: tool_use { name: lookup_customer, input: { email: "alice@example.com" } }
  3. Runtime: returns customer_id c-9924
  4. Model: tool_use { name: reset_password, input: { customer_id: "c-9924" } }
  5. Runtime: returns "Email sent."
  6. Model: "Done - check alice@example.com for the reset link."
  Each step on its own row with tinted background.
  Key content: "ticket T1|T1|password reset", "lookup_customer", "reset_password", "c-9924".

- **sub=4 (C.teal) - Streaming + tool calls**
  Title: "Tools While Streaming"
  Visual: a horizontal timeline. Stream begins -> partial assistant text streams -> stream pauses -> tool_use block emitted whole -> runtime executes -> tool_result delivered -> stream resumes. Annotate: "Tool blocks aren't streamed token-by-token; they arrive complete."
  Key content: "stream", "pause", "tool block|tool_use", "resume".

- **sub=5 (C.cyan) - Latency budget**
  Title: "Where The 2 Seconds Go"
  Visual: a stacked horizontal bar for ticket T1 latency budget:
  - 1.2s: LLM call 1 (reads user, emits lookup_customer)
  - 200ms: lookup_customer tool execution
  - 1.1s: LLM call 2 (reads result, emits reset_password)
  - 200ms: reset_password tool execution
  - 0.7s: LLM call 3 (reads result, emits final answer)
  Total: 3.4s. Highlight that LLM calls dominate; tool calls are cheap.
  Key content: "latency", "2|3|seconds", "LLM call" or "model", "tool".

- [ ] **Step 1: Write content tests for 13.9**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ToolCallLifecycle (13.9) content", () => {
  const fn = AgentTools.ToolCallLifecycle;

  it("sub=0 shows the swim-lane overview", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/model/i);
    expect(container.textContent).toMatch(/runtime/i);
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/tool_result/i);
  });

  it("sub=1 shows the tool_use message shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/reset_password/i);
  });

  it("sub=2 shows the tool_result message shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool_result/i);
    expect(container.textContent).toMatch(/tool_use_id/i);
    expect(container.textContent).toMatch(/is_error/i);
  });

  it("sub=3 traces ticket T1 end to end", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/reset_password/i);
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
  });

  it("sub=4 explains streaming + tool calls", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/tool_use|tool block/i);
  });

  it("sub=5 shows the latency budget", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/llm call|model/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolCallLifecycle"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ToolCallLifecycle chapter**

Sub-step structure as above. The two artifact blocks (tool_use shape, tool_result shape) become canonical references for chapters 13.10 and 13.11.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolCallLifecycle"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.9 Tool Call Lifecycle"
```

---

## Task 17: Implement Chapter 13.10 ParallelToolsAndChoice

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** Two production patterns. Parallel tool calls (model emits multiple tool_use blocks in one turn) cut latency when calls are independent. Tool choice (auto / required / none / specific) controls when the model is allowed to call tools. Show both with concrete latency numbers and a ticket trace.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - Serial vs parallel intuition**
  Title: "Two Lookups, Two Strategies"
  Visual: 2-row timeline for ticket T2 (reset password + email changed):
  - Serial: lookup_customer (200ms) -> wait -> lookup_subscription (200ms) -> wait. Total 400ms + 2 LLM calls.
  - Parallel: lookup_customer AND lookup_subscription emitted in same turn. Both execute concurrently. Total ~200ms + 1 LLM call.
  Highlight the savings.
  Key content: "serial", "parallel", "concurrent", "lookup_customer", "lookup_subscription", "200ms|400ms".

- **sub=1 (C.blue) - When to parallelize**
  Title: "Independent? Parallel. Dependent? Serial."
  Visual: a decision card. Two examples:
  - Independent (parallel works): lookup_customer + lookup_subscription (neither needs the other's result).
  - Dependent (must serial): lookup_customer -> process_refund (refund needs customer_id from lookup).
  Annotate the rule: parallelize when calls don't read each other's outputs.
  Key content: "independent", "dependent", "parallel" or "serial", "process_refund".

- **sub=2 (C.purple) - Tool choice: auto**
  Title: "Tool Choice = Auto (Default)"
  Visual: a labeled scenario. With tool_choice: "auto", the model decides whether to call a tool, which one, or to respond directly. For ticket T5 ("Pro vs Enterprise?"), model picks `search_kb`. For a simple greeting, model picks no tool.
  Key content: "tool_choice|tool choice", "auto", "decides".

- **sub=3 (C.indigo) - Tool choice modes table**
  Title: "Four Modes Of Tool Choice"
  Visual: a 4-row table:
  - `auto`: Model decides. Default. Use for most flows.
  - `required`: Model MUST call a tool. Use when you've already routed the intent.
  - `none`: Model MUST NOT call a tool. Use for chitchat or summarization.
  - `{type: "tool", name: "X"}`: Force a specific tool. Use for deterministic routing.
  Each row tinted, with a "when to use" column.
  Key content: "auto", "required", "none", "specific" or "tool.*name", "force".

- **sub=4 (C.teal) - Latency win from parallel**
  Title: "Numbers: How Much Does Parallel Save?"
  Visual: a bar chart for ticket T4 (cancel + refund + escalate):
  - Serial (4 sequential calls): 800ms + 4 LLM calls (4 * 1.5s = 6s) = 6.8s total.
  - Parallel (3 lookups concurrent, then 1 mutation): 200ms + 3 LLM calls = 4.7s total.
  - Savings: 31%.
  Key content: "serial", "parallel", "savings|saving|faster", "6\\.?8|4\\.?7|31%".

- **sub=5 (C.cyan) - Trace: ticket T2 with parallel lookups**
  Title: "Trace: Ticket T2 With Parallel Lookups"
  Visual: a 3-row trace for T2 (reset password + email changed):
  1. User msg: "Reset my password but my email also changed to new@example.com"
  2. Model emits TWO tool_use blocks in one assistant turn: lookup_customer(old_email) AND lookup_subscription(email)
  3. Runtime returns both results concurrently
  4. Model continues with change_email + reset_password (sequential because change_email must complete first)
  Annotate: "First turn parallel; second turn sequential."
  Key content: "ticket T2|T2", "parallel", "lookup_customer", "lookup_subscription", "change_email", "reset_password".

- [ ] **Step 1: Write content tests for 13.10**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ParallelToolsAndChoice (13.10) content", () => {
  const fn = AgentTools.ParallelToolsAndChoice;

  it("sub=0 contrasts serial vs parallel timeline", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/serial/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
  });

  it("sub=1 explains when to parallelize", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/independent/i);
    expect(container.textContent).toMatch(/dependent/i);
  });

  it("sub=2 explains tool_choice auto", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool.?choice/i);
    expect(container.textContent).toMatch(/auto/i);
  });

  it("sub=3 lists all four tool_choice modes", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/auto/i);
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/none/i);
    expect(container.textContent).toMatch(/specific|force/i);
  });

  it("sub=4 shows the latency savings number", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/savings|saving|faster/i);
  });

  it("sub=5 traces ticket T2 with parallel lookups", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_subscription/i);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ParallelToolsAndChoice"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ParallelToolsAndChoice chapter**

Sub-step structure as above. Numbers from the spec's canonical latency budget.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ParallelToolsAndChoice"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.10 Parallel Tools + Tool Choice"
```

---

## Task 18: Implement Chapter 13.11 ToolErrorsRetries

**Files:**
- Modify: `src/sections/agent-tools.jsx`
- Modify: `src/__tests__/sections.test.jsx`

**Scope binding:** Only the two files above.

**Chapter purpose (from spec):** Production tools fail. Build the 4-class error taxonomy (transient, permanent, malformed, business-rule). Show how each class is handled. End with a ticket trace where the agent recovers from a transient error and escalates a business-rule violation (refund > $200).

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.cyan) - The 4 error classes**
  Title: "Tools Fail In Four Ways"
  Visual: a 2x2 grid of error classes:
  - Transient (rate limit, timeout): retry with backoff.
  - Permanent (auth failure, missing record): surface to user / escalate.
  - Malformed (schema validation failure): return error to model, let it self-correct.
  - Business-rule ($200 refund cap, blocked customer): return structured "rule violated" reason.
  Each class tinted differently.
  Key content: "transient", "permanent", "malformed", "business.?rule".

- **sub=1 (C.blue) - Structured error returns**
  Title: "Errors Are Data, Not Exceptions"
  Visual: a styled mono artifact "Tool-Result Message (error)":
  ```
  {
    "type": "tool_result",
    "tool_use_id": "toolu_01xyz...",
    "content": "Refund denied: amount $350 exceeds $200 auto-approve cap.",
    "is_error": true,
    "error_class": "business_rule"
  }
  ```
  Highlight is_error and error_class. Model reads these and adapts.
  Key content: "is_error", "error_class", "business_rule", "200", "350".

- **sub=2 (C.purple) - Retry policy per class**
  Title: "Match The Retry To The Error"
  Visual: a 4-row table:
  - Transient: 3 retries with exp backoff (200ms, 400ms, 800ms).
  - Permanent: 0 retries. Surface immediately.
  - Malformed: 1 retry only. Model usually fixes on second try.
  - Business-rule: 0 retries. Adapt or escalate.
  Each row tinted by class color.
  Key content: "retry", "backoff", "transient", "permanent", "malformed", "business.?rule".

- **sub=3 (C.indigo) - Validation layer**
  Title: "Validate Before Calling"
  Visual: a flow diagram. Model emits tool_use -> Runtime validates against schema (zod / json-schema) -> If invalid: return malformed error immediately (no function call). If valid: execute. Annotate: "Cheap validation saves expensive function calls."
  Key content: "validat", "schema", "malformed".

- **sub=4 (C.teal) - Idempotency for safe retries**
  Title: "Safe-To-Retry Tools Need Idempotency Keys"
  Visual: a comparison card. Bad: process_refund without idempotency key - a retry might double-refund. Good: process_refund with idempotency_key derived from invoice_id - retries are safe.
  Key content: "idempotenc", "double", "key", "invoice_id".

- **sub=5 (C.cyan) - Trace: ticket T4 with transient and business-rule errors**
  Title: "Trace: Ticket T4 With Errors And Recovery"
  Visual: 5-row trace for ticket T4 (cancel + refund + refund > $200):
  1. User: "Cancel my subscription and refund my last invoice ($350)"
  2. Model: lookup_customer -> Runtime returns customer_id
  3. Model: process_refund(invoice_id, "customer requested") -> Runtime: business_rule error "$200 cap"
  4. Model adapts: calls escalate_human with transcript + urgency=medium
  5. Model: "I've escalated your refund to a human agent who can approve the $350."
  Annotate the adaptation moment.
  Key content: "T4|ticket t4", "business.?rule", "200", "escalate_human", "350".

- [ ] **Step 1: Write content tests for 13.11**

Append to `src/__tests__/sections.test.jsx`:

```js
describe("ToolErrorsRetries (13.11) content", () => {
  const fn = AgentTools.ToolErrorsRetries;

  it("sub=0 enumerates the four error classes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/transient/i);
    expect(container.textContent).toMatch(/permanent/i);
    expect(container.textContent).toMatch(/malformed/i);
    expect(container.textContent).toMatch(/business.?rule/i);
  });

  it("sub=1 shows the structured error return", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/is_error/i);
    expect(container.textContent).toMatch(/error_class|business_rule/i);
    expect(container.textContent).toMatch(/200/);
  });

  it("sub=2 lists the per-class retry policy", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/backoff/i);
    expect(container.textContent).toMatch(/transient/i);
  });

  it("sub=3 shows the validation layer", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/validat/i);
    expect(container.textContent).toMatch(/schema/i);
  });

  it("sub=4 explains idempotency", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/idempotenc/i);
    expect(container.textContent).toMatch(/key|double/i);
  });

  it("sub=5 traces ticket T4 with error recovery", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/business.?rule/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/200|350/);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolErrorsRetries"
```

Expected: FAIL.

- [ ] **Step 3: Implement the ToolErrorsRetries chapter**

Sub-step structure as above. Closes Act 2. The 4-class error taxonomy is referenced by Act 8 production-hardening chapters.

- [ ] **Step 4: Run tests to verify pass**

```bash
npx vitest run src/__tests__/sections.test.jsx -t "ToolErrorsRetries"
```

Expected: PASS.

- [ ] **Step 5: Full test smoke gate**

```bash
npm run test
```

- [ ] **Step 6: Lint and format**

```bash
npm run lint
npm run format
```

- [ ] **Step 7: Scope verification**

```bash
git status
git diff --stat
```

- [ ] **Step 8: Commit**

```bash
git add src/sections/agent-tools.jsx src/__tests__/sections.test.jsx
git commit -m "Implement chapter 13.11 Tool Errors, Retries, Validation"
```

---

## Task 19: Update CLAUDE.md mapping table and project structure for Section 13 Acts 1+2

**Files:**
- Modify: `CLAUDE.md`

**Scope binding:** Only `CLAUDE.md`. `git diff --stat` before commit.

- [ ] **Step 1: Add Section 13 mapping table to CLAUDE.md**

After the Section 12 mapping table, add:

```markdown
**Section 13: AI Agents** (`agent-prompting.jsx` + `agent-tools.jsx` - Milestones 1 of 6 complete: Acts 1+2)

| Chapter | Component | Title |
|---------|-----------|-------|
| 13.1 | AnatomyOfLlmCall | Anatomy of an LLM Call |
| 13.2 | SystemPromptContract | System Prompts - The Role Contract |
| 13.3 | FewShotStructuredOutput | Few-Shot + Structured Output |
| 13.4 | ChainOfThoughtSelfConsistency | Chain of Thought + Self-Consistency |
| 13.5 | PromptVsTuneVsRagVsAgent | Prompt vs Fine-Tune vs RAG vs Agent |
| 13.6 | ContextEngineering | Context Engineering |
| 13.7 | ToolUseAsBridge | Tool Use - LLM as Orchestrator |
| 13.8 | JsonSchemaForTools | JSON Schemas + Tool Descriptions |
| 13.9 | ToolCallLifecycle | Tool Call Lifecycle |
| 13.10 | ParallelToolsAndChoice | Parallel Tools + Tool Choice |
| 13.11 | ToolErrorsRetries | Tool Errors, Retries, Validation |
```

- [ ] **Step 2: Update project structure tree**

In the project structure section of `CLAUDE.md`, add the two new section files to the `src/sections/` tree:

```
│       ├── agent-prompting.jsx         # Section 13 (Act 1, chapters 13.1-13.6)
│       └── agent-tools.jsx             # Section 13 (Acts 2+3, chapters 13.7-13.17 - Act 2 in M1, Act 3 in M2)
```

- [ ] **Step 3: Full test smoke gate**

```bash
npm run test
```

Expected: all tests pass (CLAUDE.md isn't tested by Vitest but verify nothing else regressed).

- [ ] **Step 4: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `CLAUDE.md`.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "Document Section 13 Acts 1+2 in CLAUDE.md mapping"
```

---

## Task 20: Update llms.txt and index.html JSON-LD for Section 13

**Files:**
- Modify: `public/llms.txt`
- Modify: `index.html`

**Scope binding:** Only these two files. `git diff --stat` before commit.

- [ ] **Step 1: Update `public/llms.txt`**

In the "What it covers" topic list (or equivalent section), add the Section 13 line:

```
- Section 13 (AI Agents): prompting foundations (CoT, few-shot, system prompts, structured output, context engineering); tool calling (JSON schemas, lifecycle, parallel tools, errors); MCP + A2A protocols; workflow vs agent loop patterns (chaining, routing, ReAct, plan-execute, reflection); agent memory (working / episodic / semantic / procedural); multi-agent architectures (orchestrator-worker, supervisor, hand-offs, agentic RAG); evals (LLM-as-Judge, trace evals); production hardening (observability, cost, guardrails, prompt injection defenses); framework comparison (LangGraph / CrewAI / AutoGen / vendor SDKs).
```

- [ ] **Step 2: Update `index.html` JSON-LD `teaches` array**

Locate the JSON-LD block (under `<script type="application/ld+json">`). Add the Section 13 teaching entries to the `teaches` array:

```
"AI agents - prompting foundations",
"AI agents - tool calling and JSON schemas",
"AI agents - MCP and A2A protocols",
"AI agents - workflow and agent loop patterns (ReAct, plan-execute, reflection)",
"AI agents - agent memory (working, episodic, semantic, procedural)",
"AI agents - multi-agent architectures",
"AI agents - evals and production hardening",
"AI agents - framework comparison (LangGraph, CrewAI, AutoGen, Claude Agent SDK, OpenAI Agents)"
```

(Match the existing array's formatting - leading comma, indentation, quoting.)

- [ ] **Step 3: Full test smoke gate**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 4: Scope verification**

```bash
git status
git diff --stat
```

Expected: only `public/llms.txt` and `index.html`.

- [ ] **Step 5: Commit**

```bash
git add public/llms.txt index.html
git commit -m "Add Section 13 to llms.txt and JSON-LD teaches array"
```

---

## Task 21: Chrome browser visual validation of all 11 chapters

**Files:**
- Modify: `src/data/svg-descriptions.json` (only if new SVGs added during Tasks 8-18)
- Possibly modify section files if visual defects are found.

**Scope binding:** Per-defect-fix this task may modify individual section files. Group fixes by file and commit each section file's fixes together. `git diff --stat` before each commit.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

Expected: dev server on `http://localhost:5173/learn-ai/`.

- [ ] **Step 2: For each chapter 13.1 through 13.11, navigate and screenshot**

For each chapter:

1. Use `mcp__claude-in-chrome__tabs_create_mcp` (or similar) to open a tab.
2. Navigate by setting `localStorage["learn-ai-nav"] = JSON.stringify({ch: <id>, sub: 20, fingerprint: <current>})` to force all sub-steps to reveal.
3. Take a screenshot.
4. Verify the per-chapter checklist (below) by inspection + the overlap-detection snippet.

Per-chapter checklist:

- No overlapping elements anywhere on the page.
- Every diagram is centered horizontally + vertically within its container.
- Every diagram-box label is title-case ("Pure LLM vs LLM With Tools" not "pure llm vs llm with tools").
- Every line of text starts with a capital letter.
- Every Box has a real color (no `C.card`).
- Every standalone formula / artifact is centered.
- Every SVG has a `<desc>` child.
- Body text is 16-19px, titles 22px.

- [ ] **Step 3: Save screenshots**

Save the 11 screenshots to `docs/superpowers/screenshots/section-13-m1/` (create directory if not present).

- [ ] **Step 4: Run edge-crossing check (where applicable)**

For any SVG that draws edges between nodes (the loop diagram in 13.7, the swim-lane in 13.9, the fan-out in 13.4), run the `countCrossings` snippet from `.claude/skills/check-visuals/SKILL.md` in the browser console. Expected: 0 crossings unless inherent to the concept.

- [ ] **Step 5: For each violation found**

Fix the section file directly. Group fixes by chapter and commit per chapter:

```bash
git add src/sections/agent-prompting.jsx  # or agent-tools.jsx
git commit -m "Fix visual defect in chapter 13.<N> <description>"
```

If new SVG `<desc>` entries need to be added to `src/data/svg-descriptions.json`, include those in the same commit as the file's last visual fix, or commit separately:

```bash
git add src/data/svg-descriptions.json
git commit -m "Add SVG descriptions for Section 13 Acts 1+2 diagrams"
```

- [ ] **Step 6: Final visual sweep**

After all defects fixed, walk through all 11 chapters once more and confirm clean. No silent skips.

---

## Task 22: Final M1 verification

**Files:** none (run commands only)

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
grep -rn $'—' src/sections/agent-prompting.jsx src/sections/agent-tools.jsx && echo "FAIL: em-dash found" || echo "em-dash clean"

# C.card boxes
grep -rn "Box color={C.card}" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx && echo "FAIL: C.card found" || echo "C.card clean"

# carry-over brand (any vendor-shaped domain other than example.com / example.org)
grep -rEn "https?://(docs|kb|support|app)\.([a-z0-9-]+)\.com" src/ public/ index.html | grep -vE "example\.(com|org)|example\.net" && echo "FAIL: non-example domain found" || echo "domain clean"

# "architect" word in titles
grep -nE "architect[^u]|architect$" src/sections/agent-prompting.jsx src/sections/agent-tools.jsx && echo "FAIL: 'architect' word found" || echo "architect clean"
```

Expected: all 4 checks report clean.

- [ ] **Step 7: Verify Section 13 visible in TOC**

Navigate to the running app's TOC. Section 13 "AI Agents" should appear under Section 12.

- [ ] **Step 8: No commit.** This task only verifies.

---

## Task 23: Plan Refinement Checkpoint for M2

**Files:**
- Create: `docs/superpowers/lessons/section-13-m1-lessons.md`
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-13-milestone-2.md`
- Create: `docs/superpowers/starter-prompts/section-13-m2-starter.md`

**Scope binding:** Only these three files. `git diff --stat` before each commit.

Per the section's "lessons-feed-forward" rule, before executing M2, do a quick refinement pass on the M2 plan using what M1 taught us. The plans are editable artifacts, not contracts - this checkpoint is where M1's real-world experience gets folded into M2's plan.

- [ ] **Step 1: Lessons capture from M1 (5-10 minutes, write it down)**

Create `docs/superpowers/lessons/section-13-m1-lessons.md` with 3-5 honest bullet observations from executing M1:

- Which visual patterns rendered cleanly in Chrome and which needed iteration?
- Which test regexes were too brittle (false fail) or too loose (let bugs through)?
- Which sub-step structures landed clean and which needed re-org during implementation?
- Anything in the per-chapter task pattern that felt awkward or could be tightened?
- Anything in the visual rules that proved especially load-bearing or surprisingly easy to violate?
- Any pattern (color choice, diagram structure, artifact treatment, ticket-trace structure, etc.) that worked better than what the plan specified?
- Specific to Section 13: how did the tool-schema artifact treatment land? Did learners (you, validating) find it readable as a non-code block?

The lessons are only useful if they're real. Skip a bullet if it doesn't apply. Add bullets the prompts don't cover if something else stood out.

- [ ] **Step 2: Read M2 plan with M1 lessons in mind**

Open `docs/superpowers/plans/2026-05-16-section-13-milestone-2.md` (created in this writing-plans session - if it doesn't exist yet, this Plan Refinement step waits until it's written). Scan for places where the M1 lessons would apply:

- If M1 showed a visual pattern works better than what M2 specifies, update the relevant sub-step descriptions in M2.
- If M1 showed a test regex pattern catches more bugs, update M2's test patterns.
- If M1 showed a task structure was awkward, simplify the equivalent structure in M2.
- If M1 introduced a useful helper / convention / utility not anticipated in M2, thread it into the M2 plan.

- [ ] **Step 3: Edit M2 plan if needed**

If lessons translate to plan edits, make them inline in `docs/superpowers/plans/2026-05-16-section-13-milestone-2.md`. Keep edits scoped: only change what M1 directly informs. Do NOT rewrite M2 wholesale.

If no edits are warranted, skip and proceed to commit.

- [ ] **Step 4: Full test smoke gate**

```bash
npm run test
```

Expected: ALL tests pass.

- [ ] **Step 5: Scope verification**

```bash
git status
git diff --stat
```

Expected: only the lessons file and (optionally) the M2 plan show as modified or new.

- [ ] **Step 6: Commit the lessons file + any plan edits**

If both:

```bash
git add docs/superpowers/lessons/section-13-m1-lessons.md docs/superpowers/plans/2026-05-16-section-13-milestone-2.md
git commit -m "Capture M1 lessons and refine M2 plan"
```

If only lessons:

```bash
git add docs/superpowers/lessons/section-13-m1-lessons.md
git commit -m "Capture M1 lessons; no M2 plan edits needed"
```

- [ ] **Step 7: Generate starter prompt for M2**

Create `docs/superpowers/starter-prompts/section-13-m2-starter.md` (create the `starter-prompts/` directory if it doesn't exist):

````markdown
# M2 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 13 Milestone 2 of the learn-ai project (AI Agents section build).

Plan: docs/superpowers/plans/2026-05-16-section-13-milestone-2.md
Spec: docs/superpowers/specs/2026-05-16-section-13-agents-design.md
Prior milestone lessons: docs/superpowers/lessons/section-13-m1-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section13-milestone2"
- After M2 ships, execute the final refinement task before starting M3

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)
````

Commit:

```bash
git add docs/superpowers/starter-prompts/section-13-m2-starter.md
git commit -m "Add M2 starter prompt for next session"
```

- [ ] **Step 8: M1 complete. Ready to start M2.**

Final status check:

```bash
git log --oneline -20
npm run test
```

Expected: clean log of M1 commits + green test suite.

---

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-13-m1-lessons.md` to know what M1 taught.
- Confirmed `git log` shows M1 commits cleanly on main.
- Verified `npm run test` is green on main.
- Optionally, re-run `npm run search:extract` to refresh chunk indexes if any new content was added.

## What Comes Next

Milestone 2 covers Section 13 Acts 3 + 4:
- Act 3 (Protocols): MCP architecture, MCP primitives (tools / resources / prompts), building an MCP server, MCP security, A2A protocol. 6 chapters (13.12-13.17).
- Act 4 (Workflows & Agent Loops): workflow-vs-agent split, workflow primitives, the agent loop, ReAct pattern, plan-execute + reflection, loop termination. 6 chapters (13.18-13.23).

Total M2: 12 chapters.

## Self-Review Notes

(Written at plan-drafting time; updated post-execution with what landed differently.)

- The 6-and-5 split between Acts 1 and 2 means `agent-prompting.jsx` ships with 6 stub-then-real chapters and `agent-tools.jsx` ships with 5. The second file is intentionally extensible in M2 to absorb Act 3 (6 more chapters); plan that file growth accordingly.
- The canonical tool inventory (8 tools), 5 standard tickets, and consistent customer identity (Alice / alice@example.com / c-9924) anchor every chapter trace. Strict re-use saves cognitive load for both implementor and learner.
- The artifact treatment (mono-text styled blocks, not code blocks) is the Section-13-specific rule that prevents the section from looking like a code tutorial. Enforce in every chapter's mono-text blocks.
- Chrome validation per chapter is non-negotiable. Sections 11 and 12 each suffered overlap defects fixed one-by-one; budget the Chrome time in Task 21 generously.
