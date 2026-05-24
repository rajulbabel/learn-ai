---
name: add-chapter
description: Add a new chapter to the learn-ai app following TDD. Use when the user wants to add a new chapter, lesson, or topic.
user-invocable: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, Agent
---

# Add a New Chapter

Follow this exact sequence. Do NOT skip or reorder steps.

## Arguments

$ARGUMENTS should describe: the chapter topic, where it goes (after which chapter), and which topic folder it belongs in.

## Step 1: Determine placement

- Read `src/config.js` to find where the new chapter goes in the `chapters` array
- Identify the section number, the chapter ID it will get, and any IDs that need renumbering
- Identify the topic folder (e.g., `src/chapters/attention-computation/`) and pick a kebab-case filename for the new chapter (e.g., `score-normalization.jsx`)

## Step 2: Write the test FIRST (TDD)

- Create `src/__tests__/chapters/<topic>/<chapter-kebab>.test.jsx`
- Template:

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import <ChapterName> from "../../../chapters/<topic>/<chapter-kebab>.jsx";

afterEach(() => cleanup());

describe("<ChapterName> (<chapter-id>)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(<ChapterName>(makeCtx({ sub: 0 })))).not.toThrow();
  });
});
```

- Run `npm run test` - the test MUST FAIL at this point (chapter file doesn't exist yet)

## Step 3: Write the chapter component

- Create `src/chapters/<topic>/<chapter-kebab>.jsx` with default export
- Template:

```jsx
import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
// Optional shared imports:
// import { Graph } from "../../shared/plot.jsx";

export default function <ChapterName>(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* body */}
    </div>
  );
}
```

- Follow ALL visual design rules from CLAUDE.md and `.claude/rules/sections.md`:
  - Box colors must be actual colors (never C.card)
  - Titles must be center-aligned
  - Use progressive Reveal with SubBtn
  - Use concrete numbers, real examples
  - Font sizes 16-20 for content
- Use the running examples: "I love cats" or "The cat sat on the mat last week"
- The function receives `ctx` with: `sub, setSub, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded, subBtnRipple, setSubBtnRipple, registerSubBtn`
- Helpers used by 2+ chapters live in `src/shared/`; single-chapter helpers stay module-private at top of the chapter file

## Step 4: Update config.js

- Add the entry to the `chapters` array at the correct position
- Renumber any chapter IDs that shifted
- Format: `{ id: "X.Y", title: "Chapter Title", section: X, component: "ChapterName", file: "<topic>/<chapter-kebab>" }`

## Step 5: Run tests - they MUST pass

```bash
npm run test
npx vitest run --coverage
```

If tests fail, fix the issue before proceeding.

## Step 6: Update CLAUDE.md

- Update the mapping table for the affected section: add a row with chapter ID, component name, file path, title
- If chapter IDs shifted, update those entries too

## Step 7: Update search index

```bash
npm run search:build
```

This rebuilds `src/data/chunks.json` and `src/data/embeddings.bin` (only the new chapter is chunked; cache reuses existing).

## Step 8: Final verification

```bash
npm run test
npm run lint
```

Report the new chapter's ID, title, file path, and component name when done.
