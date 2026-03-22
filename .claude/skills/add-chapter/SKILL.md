---
name: add-chapter
description: Add a new chapter to the learn-ai app following TDD. Use when the user wants to add a new chapter, lesson, or topic.
user-invocable: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, Agent
---

# Add a New Chapter

Follow this exact sequence. Do NOT skip or reorder steps.

## Arguments

$ARGUMENTS should describe: the chapter topic, where it goes (after which chapter), and which section file it belongs in.

## Step 1: Determine placement

- Read `src/config.js` to find where the new chapter goes in the `chapters` array
- Identify the section number, the chapter ID it will get, and any IDs that need renumbering
- Identify the section file (e.g., `src/sections/attention-computation.jsx`)

## Step 2: Write the test FIRST (TDD)

- Edit `src/__tests__/sections.test.jsx`
- Add the new component to the import and to the test coverage
- The test should render the chapter at sub=0 and verify it produces text
- Run `npm run test` - the test MUST FAIL at this point (component doesn't exist yet)

## Step 3: Write the chapter component

- Add the exported function to the correct section file in `src/sections/`
- Follow ALL visual design rules from CLAUDE.md:
  - Box colors must be actual colors (never C.card)
  - Titles must be center-aligned
  - Use progressive Reveal with SubBtn
  - Use concrete numbers, real examples
  - Font sizes 16-20 for content
- Use the running examples: "I love cats" or "The cat sat on the mat last week"
- The function receives `ctx` with: `sub, setSub, navigate, goTo, bankIdx, setBankIdx, hovered, setHovered, expanded, setExpanded, subBtnRipple, setSubBtnRipple, registerSubBtn`

## Step 4: Update config.js

- Add the entry to the `chapters` array at the correct position
- Renumber any chapter IDs that shifted
- Format: `{ id: "X.Y", title: "Chapter Title", section: X, component: "ComponentName" }`

## Step 5: Run tests - they MUST pass

```bash
npm run test
npx vitest run --coverage
```

If tests fail, fix the issue before proceeding.

## Step 6: Update CLAUDE.md

- Update the mapping table for the affected section
- If chapter IDs shifted, update those entries too

## Step 7: Update search index

```bash
npm run search:extract
```

## Step 8: Final verification

```bash
npm run test
npm run lint
```

Report the new chapter's ID, title, and component name when done.
