# Section 12 Milestone 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 7 of Section 12 "Retrieval-Augmented Generation" - the five Evaluation chapters (12.28 RAGEvalTriangle, 12.29 LLMAsJudge, 12.30 RAGASMetrics, 12.31 GoldenDatasets, 12.32 OnlineEvalABTesting). These live in a NEW file `src/sections/rag-evaluation.jsx`. At the end of this milestone the app ships with 32 navigable chapters in Section 12 (12.1 through 12.32), completing Acts 1-7 of the section arc. Acts 8+9 (chapters 12.33-12.38) land in M6.

**Architecture:** Create a new section file `src/sections/rag-evaluation.jsx` and register it in `learn-ai.jsx` so Section 12 now loads FOUR files via `Promise.all`: `rag-foundations.jsx` (12.1-12.10), `rag-retrieval.jsx` (12.11-12.18), `rag-generation.jsx` (12.19-12.27), and `rag-evaluation.jsx` (12.28-12.32). Each chapter follows the established learn-ai pattern: ctx-based function component, `{sub >= 0 && ... }` for sub=0 inline, `<Reveal when={sub >= N}>` for subsequent sub-steps, colored `<Box>` per sub-step, center-aligned `<T bold center>` titles, real math, concrete running-example content from the Habuild Cloud customer-support corpus.

**Tech Stack:** React 18 (hooks, inline styles), Vitest, Vite, TDD-first. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-05-16-section-12-rag-design.md` - chapters 12.28 through 12.32, Act 7 Evaluation.

**Prior-milestone references:**
- `docs/superpowers/plans/2026-05-16-section-12-milestone-1.md` - established Section 12 scaffold + Act 1.
- Subsequent M2-M4 plans (not on disk at planning time; assume their commits have landed before this milestone starts).

**Branch policy:** Per user instruction, work directly on `main`. No feature branch.

---

## Prerequisites

- Milestones 1-4 are complete and merged on `main`. Concretely:
  - `src/sections/rag-foundations.jsx` exists with exports for chapters 12.1-12.10 (Acts 1+2).
  - `src/sections/rag-retrieval.jsx` exists with exports for chapters 12.11-12.18 (Acts 3+4).
  - `src/sections/rag-generation.jsx` exists with exports for chapters 12.19-12.27 (Acts 5+6).
  - `src/config.js` lists chapters 12.1-12.27 entered sequentially.
  - `sectionNames[12]` is `"Retrieval-Augmented Generation"`; `sectionColors[12]` is `"#7c4dff"`.
  - `src/learn-ai.jsx`'s `sectionLoaders` for key 12 returns a `Promise.all([...])` that imports the three existing rag section files and merges with `Object.assign`.
  - `src/__tests__/sections.test.jsx`, `src/__tests__/lookup.test.js`, and `src/__tests__/config.test.js` all reflect the 27-chapter state.
- All tests currently pass on `main` (verify in Task 1).
- Working directly on `main` with a clean working tree.

## File Structure

### New files

- `src/sections/rag-evaluation.jsx` - Act 7 chapter functions. 5 exports: `RAGEvalTriangle`, `LLMAsJudge`, `RAGASMetrics`, `GoldenDatasets`, `OnlineEvalABTesting`. Estimated file size: 2,800-3,800 lines (5 chapters x ~650 lines avg).

### Modified files

- `src/config.js` - append 5 entries to `chapters[]` after `{ id: "12.27", ... LongContextVsRAG }` (or whatever the final 12.27 entry is).
- `src/learn-ai.jsx` - extend the Section 12 loader `Promise.all` to include `rag-evaluation.jsx` as a fourth file.
- `src/__tests__/sections.test.jsx` - add `import * as RagEvaluation from "../sections/rag-evaluation.jsx"`, spread it into the `lookup` object, and append five content-test `describe` blocks (one per new chapter).
- `src/__tests__/lookup.test.js` - add the same import and spread.
- `src/__tests__/config.test.js` - extend Section 12 entry tests to cover 12.28-12.32.
- `src/__tests__/svg-descriptions.test.js` - extend `expectedChapters` with the 12.28-12.32 IDs that actually render SVGs.
- `src/data/svg-descriptions.json` - add entries keyed by each new chapter that renders one or more SVGs.
- `CLAUDE.md` - extend Section 12 mapping table to include 12.28-12.32 and the new file in the project-structure tree; update the milestones annotation to "Milestones 1-5 of 6 complete".

### Unchanged

- `src/sections/rag-foundations.jsx`, `src/sections/rag-retrieval.jsx`, `src/sections/rag-generation.jsx` (stable since M2-M4).
- All Section 1-11 files.
- `src/components.jsx`, `src/nav-persistence.js`.
- `public/llms.txt` and `index.html` JSON-LD - the per-milestone discoverability sync rule was satisfied in M1 (section name added). M6 will do the final pass after Section 12 is fully landed.

---

## Standard running-example values (reference during implementation)

From the spec - re-use across all five chapters where possible:

- **Primary corpus:** 30-doc customer support knowledge base for fictional SaaS "Habuild Cloud" - 10 account/billing docs, 10 product feature docs, 10 troubleshooting docs.
- **Standard queries** used in worked examples:
  - "How do I reset my password?" (single-doc lookup baseline).
  - "How do I reset my password if I forgot my email?" (multi-hop).
  - "Why is my dashboard slow and showing 500 errors?" (multi-issue).
  - "Cancel my subscription and get a refund" (multi-step).
  - "Compare the Pro and Enterprise plans" (aggregation).
- **Standard documents** in worked examples: `doc-1` (password reset), `doc-4` (refunds), `doc-7` (email change), `doc-12` (subscription tiers), `doc-23` (500 errors).
- **Top-k:** `3-5` visible / `20-50` production before rerank / `5-10` after rerank.
- **Embedding dim:** `8` (drawable) / `1024` (production typical).
- **Chunk size:** `64-128` tokens visible / `512` tokens production typical.
- **LLM context window:** `8k` (visuals) / `200k` (production-typical mention).

**Act 7-specific values (introduced in this milestone, used consistently across the five chapters where cross-referenced):**

- **Retrieval metric defaults:** `recall@10`, `MRR @ 10`, `nDCG@10`, `precision@5`.
- **Generation metric defaults:** faithfulness, answer relevancy, both expressed on the 0.0 to 1.0 scale.
- **End-to-end metric defaults:** correctness (binary), helpfulness (1-5 Likert).
- **RAGAS worked values** for the password-reset query (used in 12.30):
  - Faithfulness `= 3 / 4 = 0.75` (3 of 4 claims verifiable in retrieved context).
  - Answer relevancy `= cosine(0.92) = 0.92` (LLM-generated question similar to original).
  - Context precision `= 2 / 3 = 0.667` (2 relevant chunks among top-3).
  - Context recall `= 2 / 2 = 1.0` (all relevant chunks were retrieved).
- **Judge rubric scale:** 1-5 per criterion (used in 12.29 and 12.32).
- **LLM-as-judge biases** (named in 12.29): position bias, verbosity bias, self-preference bias.
- **Golden-dataset sizing** (12.31): hand-written 30-100 initial examples; monthly review.
- **Online-eval signals** (12.32): thumbs up/down, dwell time, copy-paste rate, follow-up rephrase rate, rating (explicit), shadow eval, A/B comparison.

---

## Visual rules - MANDATORY (re-stated for emphasis)

Every chapter at every sub-step MUST satisfy ALL of these. Violations are blockers, not nice-to-haves:

1. **Zero overlap** - no diagram/visual element overlaps another in any manner. Validate in Chrome (Task 12).
2. **Edges/nodes/boxes consistently aligned** - every diagram element vertically AND horizontally center-aligned. SVG `viewBox` content centered with `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case for diagram box text** - every WORD inside a diagram box has its first letter capitalized. "Answer Relevancy" not "answer relevancy". Exceptions: officially lowercase brand names (pgvector, numpy), variable identifiers (`q_vec`), parameter syntax (`k = 60`), tokens (`[CLS]`).
4. **First letter of every line capitalized** - monospace formula lines, table cells, bullets, headers, card text, SVG labels.
5. **Titles always center-aligned** - `T center bold` for every title; card divs need `textAlign: "center"`.
6. **Standalone formulas centered** - container div needs `textAlign: "center"`. **Especially important in 12.30**, where the four RAGAS formulas are the headline visual.
7. **Colored boxes only** - never `Box color={C.card}`. Use real colors.
8. **SVG `<desc>` metadata** - every `<svg>` has `<desc>...</desc>` as its first child; corresponding entry in `src/data/svg-descriptions.json`.
9. **No "architect" word** in chapter titles or content.
10. **No em-dashes** anywhere in content. Use hyphens or rewrite.
11. **No next-chapter hints** - no "Next chapter:", "Coming up:", "Preview:" text. Within-section signposts that point to which later chapter range in THIS section solves something are allowed (e.g., "Chapters 12.33-12.37 cover observability") - phrased in present tense. Never use the literal phrase "Act N" in chapter-visible content.
12. **Density: less text, more diagrams** - default to "show with a diagram" over "describe in prose".

**Section-12-specific rule (re-stated):** prompt templates and eval rubrics are TEXT artifacts, NOT code blocks. Render in styled monospace blocks visually distinct from code: tinted background `${C.X}06`, soft border `1px solid ${C.X}12`, monospace font 14-16px, label "Prompt Template" / "Eval Rubric" / "Judge Prompt" centered. Highlight variable placeholders (`{context}`, `{query}`, `{answer}`) in a distinct color. Never show executable code.

---

## Implementation order

1. Task 1 - Verify green baseline.
2. Task 2 - Create `rag-evaluation.jsx` scaffold + register file (loader + lookup imports + config stub-test rows + 5 stub exports).
3. Task 3 - Append 12.28-12.32 entries to `config.js` and the config-test row block.
4. Task 4 - Update `learn-ai.jsx` Section 12 loader (4-file `Promise.all`).
5. Task 5 - Register `RagEvaluation` in `sections.test.jsx` and `lookup.test.js`.
6. Task 6 - Chapter 12.28 RAGEvalTriangle (5-6 sub-steps).
7. Task 7 - Chapter 12.29 LLMAsJudge (6-7 sub-steps).
8. Task 8 - Chapter 12.30 RAGASMetrics (6-7 sub-steps).
9. Task 9 - Chapter 12.31 GoldenDatasets (5-6 sub-steps).
10. Task 10 - Chapter 12.32 OnlineEvalABTesting (5-6 sub-steps).
11. Task 11 - Update CLAUDE.md mapping + project tree + milestones annotation.
12. Task 12 - Final M5 verification: full test suite, coverage, lint, format, build smoke test.

Commit cadence: one commit per chapter (Tasks 6-10), plus one each for Tasks 2, 3, 4, 5, 11, and (optionally) 12. Target: 10-12 commits total.

---

## Task 0: Name This Session

**Purpose:** Make this session easy to identify in Claude Code history.

- [ ] **Step 1: Set session title to `section12-milestone5`**

Use the Claude Code session-naming mechanism available in your CLI. Common ways depending on your version:

- Slash command: type `/rename section12-milestone5` (if your Claude Code build supports it)
- Settings: set the session title via `/config` or the IDE extension's session pane
- Manual marker: if no rename command is available, write a top-of-conversation marker like "SESSION: section12-milestone5" so future searches catch it

The exact mechanism varies by Claude Code version. Pick whichever works in your build.

- [ ] **Step 2: Confirm session title shows `section12-milestone5` in the UI**

If your CLI shows the session title in its title bar or tab, verify it reads `section12-milestone5`.

- [ ] **Step 3: No commit.** This is a session-scoped action, not a code change.

---

## Task 1: Verify green baseline

**Files:** none (git state + run tests).

- [ ] **Step 1: Confirm we're on `main` with a clean working tree**

  ```bash
  git status
  git log --oneline -10
  ```

  Expected: `On branch main`, `nothing to commit, working tree clean`. Recent log should include the latest M4 commits ("Implement chapter 12.27 Long-Context vs RAG" or similar).

- [ ] **Step 2: Confirm prerequisite files exist**

  ```bash
  ls -1 src/sections/rag-foundations.jsx src/sections/rag-retrieval.jsx src/sections/rag-generation.jsx
  ```

  Expected: all three files present. If any are missing, M5 cannot start - block on completing M2-M4 first.

- [ ] **Step 3: Confirm Section 12 has 27 chapters in config**

  ```bash
  grep -c 'section: 12' src/config.js
  ```

  Expected: `27`. If not, block on M2-M4 completion.

- [ ] **Step 4: Run full test suite**

  ```bash
  npm run test
  ```

  Expected: all tests pass. No regressions inherited.

- [ ] **Step 5: Run linter baseline**

  ```bash
  npm run lint
  ```

  Expected: 0 errors.

- [ ] **Step 6: No commit yet** - this task only verifies baseline. Move on to Task 2.

---

## Task 2: Create `rag-evaluation.jsx` scaffold with 5 stub exports

**Files:**
- Create: `src/sections/rag-evaluation.jsx`.
- Modify: `src/__tests__/lookup.test.js` (add import + content-presence test).

- [ ] **Step 1: Write failing test for the new section file**

  Edit `src/__tests__/lookup.test.js`. Add this import line after the existing `import * as RagGeneration` (the most recent rag import):

  ```js
  import * as RagEvaluation from "../sections/rag-evaluation.jsx";
  ```

  Spread `RagEvaluation` into the existing `lookup` object alongside the other rag spreads:

  ```js
  const lookup = {
    TOC,
    ...NeuralFoundations,
    // ... existing sections through RagGeneration ...
    ...RagEvaluation,
  };
  ```

  Then append a presence test in the existing `describe` block (mirror the pattern used for prior rag files):

  ```js
  it("rag-evaluation.jsx exports the Act 7 chapter components", async () => {
    const mod = await import("../sections/rag-evaluation.jsx");
    expect(typeof mod.RAGEvalTriangle).toBe("function");
    expect(typeof mod.LLMAsJudge).toBe("function");
    expect(typeof mod.RAGASMetrics).toBe("function");
    expect(typeof mod.GoldenDatasets).toBe("function");
    expect(typeof mod.OnlineEvalABTesting).toBe("function");
  });
  ```

- [ ] **Step 2: Run test to verify it FAILS**

  ```bash
  npx vitest run src/__tests__/lookup.test.js
  ```

  Expected: FAIL - `Cannot find module '../sections/rag-evaluation.jsx'`.

- [ ] **Step 3: Create the stub file**

  Create `src/sections/rag-evaluation.jsx` with this content. Each stub renders one Box at sub=0 (so the generic "All chapters" render test in sections.test.jsx passes) and exposes a `<SubBtn>` while sub is below the chapter's last sub-step.

  ```jsx
  import { Box, T, Reveal, SubBtn } from "../components.jsx";
  import { C } from "../config.js";

  // Section 12 Act 7: Evaluation (chapters 12.28-12.32).
  // Continues the Habuild Cloud customer-support corpus and 5 standard queries
  // established in 12.1-12.27. Per-act color theme: green (eval).
  // Files in this section: rag-foundations.jsx (12.1-12.10), rag-retrieval.jsx
  // (12.11-12.18), rag-generation.jsx (12.19-12.27), rag-evaluation.jsx (here).

  export const RAGEvalTriangle = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={22}>
              The RAG Eval Triangle (stub)
            </T>
          </Box>
        )}
        {sub < 5 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };

  export const LLMAsJudge = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={22}>
              LLM-as-Judge (stub)
            </T>
          </Box>
        )}
        {sub < 6 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };

  export const RAGASMetrics = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={22}>
              RAGAS Metrics (stub)
            </T>
          </Box>
        )}
        {sub < 6 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };

  export const GoldenDatasets = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={22}>
              Golden Datasets (stub)
            </T>
          </Box>
        )}
        {sub < 5 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };

  export const OnlineEvalABTesting = (ctx) => {
    const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {sub >= 0 && (
          <Box color={C.pink} style={{ width: "100%" }}>
            <T color={C.pink} bold center size={22}>
              Online Eval & A/B Testing (stub)
            </T>
          </Box>
        )}
        {sub < 5 && (
          <SubBtn
            key={sub}
            onClick={() => {
              setSubBtnRipple(Date.now());
              navigate("forward");
            }}
            rippleKey={subBtnRipple}
            registerSubBtn={registerSubBtn}
          />
        )}
      </div>
    );
  };
  ```

  Note: `Reveal` is imported in the header even though stubs do not use it - the per-chapter tasks will use `Reveal` heavily.

- [ ] **Step 4: Run test to verify PASS**

  ```bash
  npx vitest run src/__tests__/lookup.test.js
  ```

  Expected: PASS. The new file exists and exposes all 5 expected functions.

- [ ] **Step 5: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors. The unused `Reveal` import is allowed because per-chapter tasks consume it; if lint flags it as unused, remove it for now and re-add in the first chapter that uses it.

- [ ] **Step 6: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/lookup.test.js
  git commit -m "Add stub exports for rag-evaluation.jsx (12.28-12.32)"
  ```

---

## Task 3: Add 12.28-12.32 entries to `chapters` array + config test

**Files:**
- Modify: `src/config.js` (chapters array, after the last Section 12 entry from M4).
- Modify: `src/__tests__/config.test.js`.

- [ ] **Step 1: Write failing test**

  Edit `src/__tests__/config.test.js`. Append (or extend the existing Section 12 entry block, if M1-M4 added one) a test block that asserts the five new chapters land in order with correct ids/components/titles:

  ```js
  describe("Section 12 Act 7 chapters", () => {
    it("has chapters 12.28 through 12.32 in order", () => {
      const section12 = chapters.filter((ch) => ch.section === 12);
      const last5 = section12.slice(-5);
      const expected = [
        { id: "12.28", component: "RAGEvalTriangle", title: "The RAG Eval Triangle" },
        { id: "12.29", component: "LLMAsJudge", title: "LLM-as-Judge" },
        { id: "12.30", component: "RAGASMetrics", title: "RAGAS Metrics" },
        { id: "12.31", component: "GoldenDatasets", title: "Golden Datasets" },
        { id: "12.32", component: "OnlineEvalABTesting", title: "Online Eval & A/B Testing" },
      ];
      expect(last5.length).toBe(expected.length);
      expected.forEach((exp, i) => {
        expect(last5[i].id).toBe(exp.id);
        expect(last5[i].component).toBe(exp.component);
        expect(last5[i].title).toBe(exp.title);
      });
    });

    it("Section 12 has exactly 32 chapters after M5", () => {
      const section12 = chapters.filter((ch) => ch.section === 12);
      expect(section12.length).toBe(32);
    });
  });
  ```

- [ ] **Step 2: Run test to verify FAIL**

  ```bash
  npx vitest run src/__tests__/config.test.js -t "Section 12 Act 7"
  ```

  Expected: FAIL - the chapters do not exist yet, so `last5` is the last 5 of the 27 currently-present rows.

- [ ] **Step 3: Append entries in `src/config.js`**

  Open `src/config.js`. Find the last `section: 12` row from M4 (likely `{ id: "12.27", ... LongContextVsRAG }`). Insert five new rows immediately after it, before the closing `];` of the `chapters` array:

  ```js
    { id: "12.27", title: "Long-Context vs RAG", section: 12, component: "LongContextVsRAG" },
    // Section 12 Act 7: Evaluation
    { id: "12.28", title: "The RAG Eval Triangle", section: 12, component: "RAGEvalTriangle" },
    { id: "12.29", title: "LLM-as-Judge", section: 12, component: "LLMAsJudge" },
    { id: "12.30", title: "RAGAS Metrics", section: 12, component: "RAGASMetrics" },
    { id: "12.31", title: "Golden Datasets", section: 12, component: "GoldenDatasets" },
    { id: "12.32", title: "Online Eval & A/B Testing", section: 12, component: "OnlineEvalABTesting" },
  ];
  ```

- [ ] **Step 4: Run test to verify PASS**

  ```bash
  npx vitest run src/__tests__/config.test.js
  ```

  Expected: PASS. Both the new Act 7 block AND the existing "chapter IDs sequential" test (which lives elsewhere in config.test.js) should be green.

- [ ] **Step 5: Run the broader chapter-sequence guard**

  ```bash
  npx vitest run src/__tests__/config.test.js -t "sequential"
  ```

  Expected: PASS. This is the test that asserts every chapter ID within a section is sequential (`section.1` ... `section.N`). The M5 additions of 12.28-12.32 must keep this property.

- [ ] **Step 6: Commit**

  ```bash
  git add src/config.js src/__tests__/config.test.js
  git commit -m "Add chapter entries 12.28-12.32 to config"
  ```

---

## Task 4: Update `learn-ai.jsx` Section 12 loader to 4-file `Promise.all`

**Files:**
- Modify: `src/learn-ai.jsx` (`sectionLoaders` object).

- [ ] **Step 1: Find the current Section 12 loader**

  After M4 the existing loader should look like:

  ```js
    12: () =>
      Promise.all([
        import("./sections/rag-foundations.jsx"),
        import("./sections/rag-retrieval.jsx"),
        import("./sections/rag-generation.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

  (If M4 produced a different exact shape, adapt - the goal is to add `rag-evaluation.jsx` to the array.)

- [ ] **Step 2: Replace with the 4-file version**

  Use Edit to swap the existing loader for:

  ```js
    12: () =>
      Promise.all([
        import("./sections/rag-foundations.jsx"),
        import("./sections/rag-retrieval.jsx"),
        import("./sections/rag-generation.jsx"),
        import("./sections/rag-evaluation.jsx"),
      ]).then((mods) => Object.assign({}, ...mods)),
  ```

- [ ] **Step 3: Verify by running the full test suite**

  ```bash
  npm run test
  ```

  Expected: all tests pass. The dev-mode validator in `learn-ai.jsx` ("Validate chapter/component mapping in dev mode") confirms every chapter component is reachable. If 12.28-12.32 cannot be looked up, the validator console-errors during the dev import - though tests run in isolation, sections.test.jsx still verifies the lookup (Task 5).

- [ ] **Step 4: Lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors.

- [ ] **Step 5: Smoke-boot the dev server (optional but recommended)**

  ```bash
  npm run dev
  ```

  Open `http://localhost:5173/learn-ai/`. Use right-arrow keyboard nav or the TOC to step into Section 12 chapters. The Act 7 stub chapters should render their stub Boxes ("The RAG Eval Triangle (stub)" etc.) without console errors. Stop the server with Ctrl-C.

- [ ] **Step 6: Commit**

  ```bash
  git add src/learn-ai.jsx
  git commit -m "Wire rag-evaluation.jsx into Section 12 loader"
  ```

---

## Task 5: Register `RagEvaluation` in `sections.test.jsx` lookup

**Files:**
- Modify: `src/__tests__/sections.test.jsx` (add import + spread).

The generic test block in `sections.test.jsx` iterates over `chapters` and looks up each component in `lookup`. Without this import, the generic "All chapters" describe block will fail for 12.28-12.32 with "fn is not a function".

- [ ] **Step 1: Run sections.test.jsx to observe the failure**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "All chapters"
  ```

  Expected: FAIL on 12.28-12.32 (`fn is not a function`).

- [ ] **Step 2: Add the import + spread**

  Edit `src/__tests__/sections.test.jsx`. Find the rag imports block (added across M1-M4) and append:

  ```js
  import * as RagEvaluation from "../sections/rag-evaluation.jsx";
  ```

  Then in the `lookup` object, append `...RagEvaluation` after the most recent rag spread:

  ```js
  const lookup = {
    TOC,
    ...NeuralFoundations,
    ...LLMTraining,
    ...Scaling,
    ...RoadToTransformers,
    ...TransformerInput,
    ...AttentionQKV,
    ...AttentionComputation,
    ...TransformerBlock,
    ...EncoderDecoderDiagrams,
    ...ModernLLMTechniques,
    ...VectorFoundations,
    ...VectorCompression,
    ...VectorProduction,
    ...VectorSystems,
    ...RagFoundations,
    ...RagRetrieval,
    ...RagGeneration,
    ...RagEvaluation,
  };
  ```

  (Match the exact order present in the file after M4 - keep all earlier spreads as-is; only add `...RagEvaluation` at the end.)

- [ ] **Step 3: Run sections.test.jsx to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "All chapters"
  ```

  Expected: PASS. The generic test now renders 12.28-12.32 stubs across sub=0..10 without crashing (sub=0 renders one Box; sub>0 renders nothing, which is allowed).

- [ ] **Step 4: Commit**

  ```bash
  git add src/__tests__/sections.test.jsx
  git commit -m "Register RagEvaluation in sections.test lookup"
  ```

---

## Task 6: Implement Chapter 12.28 RAGEvalTriangle (5-6 sub-steps)

**Files:**
- Modify: `src/sections/rag-evaluation.jsx` (replace the `RAGEvalTriangle` stub with full implementation).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block).
- Modify: `src/data/svg-descriptions.json` (add entry for the triangle SVG and any others).
- Modify: `src/__tests__/svg-descriptions.test.js` (append `"12.28"` to `expectedChapters`).

**Chapter purpose (from spec):** Three layers of eval - retrieval, generation, end-to-end. Each layer needs separate eval because a bad final answer can come from bad retrieval OR bad generation; isolating each layer locates the failure. Mention BLEU/ROUGE as DEPRECATED for RAG (covered properly in 12.30 as a side note). Walk away knowing the metric vocabulary needed to talk eval with a team.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.green) - The triangle overview.**
  Title: "Three Layers Of RAG Evaluation".
  Visual: an SVG triangle with three labeled corners: Retrieval (top), Generation (lower-left), End-To-End (lower-right). Each corner has a tinted node containing a 1-line description ("Did we find the right docs?", "Did the model use them faithfully?", "Did the final answer help the user?"). The triangle sits centered in the viewBox; symmetric padding.
  Key content: "three layers", "retrieval", "generation", "end-to-end".

- **sub=1 (C.cyan) - Retrieval layer.**
  Title: "Layer 1: Retrieval Metrics".
  Visual: a four-card grid (2x2) of retrieval metrics, each with title + formula + 1-line interpretation:
  - `Recall@k = relevant_retrieved / total_relevant`.
  - `MRR = (1/N) * sum over queries of (1 / rank_of_first_relevant)`.
  - `Precision@k = relevant_retrieved / k`.
  - `nDCG@k = DCG@k / IDCG@k` (normalised discounted cumulative gain).
  Each card tinted `${C.cyan}06` background, `1px solid ${C.cyan}12` border, title-case header, formula centered.
  Below: a one-line example using the password-reset query ("top-3 returned: doc-1 (relevant), doc-23 (not), doc-7 (relevant) -> precision@3 = 2/3 = 0.667").
  Key content: "recall@k" or "recall@10", "MRR", "precision", "nDCG" or "discounted cumulative".

- **sub=2 (C.purple) - Generation layer.**
  Title: "Layer 2: Generation Metrics".
  Visual: two cards side-by-side:
  - Faithfulness: "Are the claims in the answer supported by the retrieved context?" + tiny worked example ("Answer claims '24-hour expiry'; retrieved doc-1 says '24 hours' -> claim supported -> 1.0").
  - Answer Relevancy: "Does the answer actually address the question?" + tiny example ("Question: 'How do I reset my password?' Answer: 'Click forgot password.' -> relevancy 0.9").
  Tinted backgrounds `${C.purple}06`.
  Key content: "faithfulness", "answer relevancy" or "relevancy", "claim" or "supported", "ground" or "context".

- **sub=3 (C.orange) - End-to-end layer.**
  Title: "Layer 3: End-To-End Metrics".
  Visual: two cards:
  - Correctness: "Did the final answer match the gold answer? (binary)" + example ("Gold: 'Click forgot password and check email.' Generated: 'Click forgot password link and check your registered email.' -> 1").
  - Helpfulness: "How useful was the answer to the user? (1-5 Likert)" + example ("User rated 4/5").
  Tinted backgrounds `${C.orange}06`.
  Key content: "correctness", "helpfulness", "Likert" or "1-5" or "5-point", "gold".

- **sub=4 (C.red) - Why three layers and not one.**
  Title: "Why Three Layers? Failures Trace To A Layer".
  Visual: a 3-row example walkthrough using the multi-hop query "How do I reset my password if I forgot my email?". For each "what if the answer is wrong" scenario, trace which layer's metric flags it first:
  - Scenario A: retrieved docs are wrong (doc-4 refunds, irrelevant) -> recall@10 drops -> root cause = retrieval.
  - Scenario B: retrieved docs are correct (doc-1 + doc-7) but answer ignores them and hallucinates -> faithfulness drops -> root cause = generation.
  - Scenario C: retrieval + generation both passing but user reports "didn't help" -> end-to-end drops -> root cause = product/prompting.
  Each scenario in a tinted row with the failing layer highlighted in red.
  Key content: "trace" or "locate", "root cause", at least one of the three scenarios verbatim.

- **sub=5 (C.yellow) - The deprecated metrics (BLEU/ROUGE).**
  Title: "Deprecated For RAG: BLEU & ROUGE".
  Visual: a single card with a yellow-tinted background and a struck-through "BLEU, ROUGE, METEOR" header. Body explains in 2 short lines: word-overlap metrics measure how many ngrams in the generated answer also appear in the reference answer. They were designed for machine translation and summarisation. **They do not measure faithfulness or groundedness**: a perfectly faithful answer in different wording scores 0; a hallucinated answer that recycles reference words scores high. Use RAGAS (12.30) and LLM-as-judge (12.29) instead.
  Key content: "BLEU" or "ROUGE", "deprecated" or "word overlap" or "do not measure", "faithfulness" or "ground".

- [ ] **Step 1: Append content tests to `src/__tests__/sections.test.jsx`**

  Place after the most recent rag describe block (likely 12.27 LongContextVsRAG):

  ```js
  describe("RAGEvalTriangle (12.28) content", () => {
    const fn = RagEvaluation.RAGEvalTriangle;

    it("sub=0 names the three eval layers", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/three layer|three-layer|3 layer/i);
      expect(container.textContent).toMatch(/retriev/i);
      expect(container.textContent).toMatch(/generat/i);
      expect(container.textContent).toMatch(/end[- ]?to[- ]?end/i);
    });

    it("sub=1 lists retrieval metrics with formulas", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/recall@?k|recall@?10/i);
      expect(container.textContent).toMatch(/MRR/);
      expect(container.textContent).toMatch(/precision/i);
      expect(container.textContent).toMatch(/nDCG|discounted cumulative/i);
    });

    it("sub=2 lists generation metrics: faithfulness and answer relevancy", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/faithful/i);
      expect(container.textContent).toMatch(/relevanc/i);
      expect(container.textContent).toMatch(/claim|supported|context/i);
    });

    it("sub=3 lists end-to-end metrics: correctness and helpfulness", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/correctness/i);
      expect(container.textContent).toMatch(/helpful/i);
      expect(container.textContent).toMatch(/Likert|1-?5/i);
    });

    it("sub=4 traces failures to a specific layer", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/trace|locate|root cause/i);
      expect(container.textContent).toMatch(/retriev/i);
      expect(container.textContent).toMatch(/generat/i);
    });

    it("sub=5 marks BLEU and ROUGE as deprecated for RAG", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/BLEU/);
      expect(container.textContent).toMatch(/ROUGE/);
      expect(container.textContent).toMatch(/deprecated|word.overlap|do not measure/i);
      expect(container.textContent).toMatch(/faithful|ground/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to confirm RED**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "RAGEvalTriangle"
  ```

  Expected: FAIL - the stub does not contain the expected content.

- [ ] **Step 3: Implement the full chapter**

  Replace the `RAGEvalTriangle` stub in `src/sections/rag-evaluation.jsx`. Required specifics:

  - 6 sub-steps (sub >= 0 through sub >= 5). sub=0 inline; subs 1-5 wrapped in `<Reveal when={sub >= N}>`.
  - Colors per sub-step: green -> cyan -> purple -> orange -> red -> yellow.
  - sub=0 triangle SVG: viewBox `0 0 540 360`, three vertices at (270, 60), (90, 300), (450, 300), three labeled nodes (rounded rects) at each vertex with a short description inside. Lines connecting the vertices with 1.5px stroke `${C.green}66`. Center text title-case ("Retrieval", "Generation", "End-To-End"). Add `<desc>The three layers of RAG evaluation shown as a triangle: retrieval (top), generation (lower-left), end-to-end (lower-right), each with a one-line interpretive caption.</desc>` as the first child of the `<svg>`.
  - sub=1 four-card grid: `display: grid; gridTemplateColumns: repeat(2, 1fr); gap: 12`. Each card centered (`textAlign: "center"`). Formula lines monospace 15px, container `textAlign: "center"`.
  - sub=2, sub=3 two-card layouts: `display: grid; gridTemplateColumns: repeat(2, 1fr); gap: 12`. Same centered-card pattern.
  - sub=4 three-row walkthrough: each row tinted, the failing layer's name highlighted in red within its row. No overlap.
  - sub=5 single struck-through header card. Use `textDecoration: "line-through"` on the metric-names span (only on the header span, NOT the body explanation).
  - End: `{sub < 5 && <SubBtn .../> }` matching the stub.
  - Title-case for every diagram box label. No em-dashes. No `C.card` Boxes. Titles `<T center bold>`.

- [ ] **Step 4: Run tests to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "RAGEvalTriangle"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description entry**

  Edit `src/data/svg-descriptions.json`. Insert before the closing brace, after the M4 entries:

  ```json
    "12.28": [
      "Three-layer RAG evaluation triangle: retrieval at top (recall, MRR, precision, nDCG), generation lower-left (faithfulness, answer relevancy), end-to-end lower-right (correctness, helpfulness). Each vertex is labeled with a one-line description so a learner sees what each layer measures and why three layers are needed."
    ]
  ```

  Edit `src/__tests__/svg-descriptions.test.js`. Append `"12.28"` to the `expectedChapters` array (place after the most recent rag entry).

- [ ] **Step 6: Run the SVG description tests**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS. Manifest entry present, description length above 20 chars, chapter id valid.

- [ ] **Step 7: Run the SVG `<desc>` presence check**

  The "Every SVG has a `<desc>` element" describe block in sections.test.jsx validates every chapter listed in `svgChapters`. Add `"12.28"` to that array (mirror Step 5).

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "Every SVG"
  ```

  Expected: PASS.

- [ ] **Step 8: Full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: all green. `npm run format` may rewrite trivial whitespace; re-stage if needed.

- [ ] **Step 9: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.28 The RAG Eval Triangle"
  ```

---

## Task 7: Implement Chapter 12.29 LLMAsJudge (6-7 sub-steps)

**Files:**
- Modify: `src/sections/rag-evaluation.jsx` (replace `LLMAsJudge` stub).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block).
- Modify: `src/data/svg-descriptions.json`, `src/__tests__/svg-descriptions.test.js` if new SVG.

**Chapter purpose (from spec):** the judge prompt template (artifact - styled monospace block, not code). Rubric design (1-5 per criterion). Three judge biases (position, verbosity, self-preference). Calibration via human spot-check. Judge-model selection (stronger than the one being judged; or same with caveats). Walk away able to write a defensible LLM-as-judge prompt and avoid the famous failure modes.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.purple) - Why LLM-as-judge.**
  Title: "Why Use An LLM To Judge An LLM?".
  Visual: a 3-card row comparing eval methods on speed, cost, scale, quality. Human annotation: high quality, very slow, expensive. Heuristic (BLEU/ROUGE): instant, free, low quality. LLM-as-judge: fast, medium cost, near-human quality on well-rubric'd tasks.
  Key content: "human", "heuristic" or "BLEU", "LLM-as-judge" or "judge", at least one tradeoff axis (speed / cost / quality).

- **sub=1 (C.cyan) - The judge prompt template (artifact).**
  Title: "The Judge Prompt".
  Visual: a styled monospace block labelled "Judge Prompt" (centered, title-case). Background tinted `${C.cyan}06`, border `1px solid ${C.cyan}12`, font-family monospace 14-16px. Variable placeholders `{question}`, `{retrieved_context}`, `{generated_answer}` highlighted in `${C.yellow}`. Template body (rendered as multi-line preformatted text):

  ```
  You are an expert evaluator. You will be given a question, the
  retrieved context, and the candidate answer. Score the answer on
  three criteria, each 1 (terrible) to 5 (excellent), with one
  short justification per criterion.

  Faithfulness: are all claims in the answer supported by the
  retrieved context?

  Answer Relevancy: does the answer address the question directly?

  Helpfulness: would this answer actually help the user reach their
  goal?

  Question: {question}
  Retrieved Context: {retrieved_context}
  Candidate Answer: {generated_answer}

  Return JSON:
  {
    "faithfulness": <1-5>,
    "answer_relevancy": <1-5>,
    "helpfulness": <1-5>,
    "justification": "<one short paragraph>"
  }
  ```

  Title says "Judge Prompt" centered, title-case. The block is the artifact - reads as text, not as a fenced code block. DO NOT use a triple-backtick fenced code block in JSX; render the content inside a `<div>` with `whiteSpace: "pre-wrap"` and a monospace font.
  Key content: "Judge Prompt" or "judge prompt", "faithfulness", "relevancy", "helpfulness", JSON-like keys, `{question}` or `{retrieved_context}` (as text - tests will look for at least one placeholder name).

- **sub=2 (C.green) - Rubric design.**
  Title: "Rubric: 1-5 Per Criterion".
  Visual: a 5-row table for the Faithfulness criterion:
  - 5: All claims supported, none missing.
  - 4: Mostly supported, minor unsupported detail.
  - 3: About half supported.
  - 2: Mostly unsupported; some grounded.
  - 1: Hallucinated; nothing in context supports it.
  Below: a 2-line note that rubric design beats prompt prose - the rubric is the calibration tool.
  Key content: "rubric", "1-5" or "5-point", "supported" or "ground", "calibration" or "tool".

- **sub=3 (C.red) - Bias 1: position bias.**
  Title: "Bias 1: Position Bias".
  Visual: a side-by-side pairwise judging example. The same two answers A and B, presented in order (A, B) -> judge picks A. Same answers in order (B, A) -> judge still picks A's text, but it's now in position 2 -> judge picks position-1 answer. Show two scenarios with arrows; highlight that the judge prefers whichever answer appears first.
  Mitigation: randomize order, OR test both orders and average.
  Key content: "position bias" or "position", "pairwise" or "order", "randomize" or "swap" or "mitigation".

- **sub=4 (C.orange) - Bias 2: verbosity bias.**
  Title: "Bias 2: Verbosity Bias".
  Visual: a two-answer comparison. Answer A: 50 words, accurate. Answer B: 200 words, says the same thing with more padding plus one factual error. Show that judges (especially weaker ones) prefer B because it "looks more thorough". Mitigation: rubric must explicitly weight conciseness, OR include a length-normalisation prompt instruction.
  Key content: "verbosity" or "length", "longer" or "padding", "conciseness" or "length-normalisation" or "weight".

- **sub=5 (C.yellow) - Bias 3: self-preference bias.**
  Title: "Bias 3: Self-Preference Bias".
  Visual: a 3-row table:
  - Judge = GPT-4o, candidate = GPT-4o -> +12% score vs human.
  - Judge = GPT-4o, candidate = Claude 3.5 -> -3% score vs human.
  - Judge = Claude 3.5, candidate = Claude 3.5 -> +9% score vs human.
  Caption: judges score their own model's outputs higher. Mitigation: use a third-party judge model (different family from the one being evaluated); OR average scores across multiple judge families.
  Key content: "self-preference" or "self preference" or "self-bias", "own" or "family", "third-party" or "different" or "cross-family".

- **sub=6 (C.pink) - Calibration via human spot-check.**
  Title: "Calibrate: Spot-Check 50-100 Cases".
  Visual: a calibration before/after curve (SVG line chart). X-axis: percentile of judge score. Y-axis: agreement with human label.
  - Before calibration: only 60% agreement at high scores; long divergence tail.
  - After calibration (rubric refined, position+verbosity mitigations applied): 92% agreement.
  Caption: a judge is a hypothesis. You verify it against a held-out human-labeled sample of 50-100 cases. If correlation is below 0.85, refine the rubric and re-test.
  Plus a side card: "Judge-Model Selection" - use a stronger model than the one being judged; or use the same model with documented caveats. Cross-family judging is strongest.
  Key content: "calibrat", "spot[- ]?check" or "50-100" or "human", "agreement" or "correlation" or "0.85", "stronger" or "cross-family" or "judge model".

- [ ] **Step 1: Append content tests to sections.test.jsx**

  ```js
  describe("LLMAsJudge (12.29) content", () => {
    const fn = RagEvaluation.LLMAsJudge;

    it("sub=0 compares human / heuristic / LLM-as-judge", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/human/i);
      expect(container.textContent).toMatch(/heuristic|BLEU/i);
      expect(container.textContent).toMatch(/judge/i);
    });

    it("sub=1 shows the judge prompt artifact with criteria + JSON schema", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/judge prompt/i);
      expect(container.textContent).toMatch(/faithfulness/i);
      expect(container.textContent).toMatch(/relevanc/i);
      expect(container.textContent).toMatch(/helpful/i);
      expect(container.textContent).toMatch(/\{(question|retrieved_context|generated_answer)\}/);
    });

    it("sub=2 defines a 1-5 rubric for a criterion", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/rubric/i);
      expect(container.textContent).toMatch(/1[- ]?5|5[- ]?point|hallucinat|support/i);
    });

    it("sub=3 names position bias and the swap mitigation", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/position bias|position/i);
      expect(container.textContent).toMatch(/randomize|swap|order/i);
    });

    it("sub=4 names verbosity bias and the length mitigation", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/verbosity|length/i);
      expect(container.textContent).toMatch(/conciseness|normalis|weight/i);
    });

    it("sub=5 names self-preference bias and cross-family mitigation", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/self[- ]?preference|self.bias/i);
      expect(container.textContent).toMatch(/cross[- ]?family|third[- ]?party|different/i);
    });

    it("sub=6 covers calibration via human spot-check and judge-model selection", () => {
      const { container } = render(fn(makeCtx({ sub: 6 })));
      expect(container.textContent).toMatch(/calibrat/i);
      expect(container.textContent).toMatch(/spot[- ]?check|50|100|human/i);
      expect(container.textContent).toMatch(/agreement|correlation|0\.85/i);
      expect(container.textContent).toMatch(/stronger|cross[- ]?family|judge model/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to confirm RED**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LLMAsJudge"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the chapter**

  Replace the stub. Required specifics:

  - 7 sub-steps (sub >= 0 through sub >= 6). sub=0 inline; sub 1-6 in `<Reveal when={sub >= N}>`.
  - Colors per sub-step: purple -> cyan -> green -> red -> orange -> yellow -> pink.
  - **CRITICAL: sub=1 judge prompt MUST be a styled monospace block (artifact), NOT a code block.** Implement as `<div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", padding: 16, background: \`${C.cyan}06\`, border: \`1px solid ${C.cyan}12\`, borderRadius: 8, textAlign: "left", fontSize: 14 }}>...</div>`. Render placeholders as `<span style={{ color: C.yellow }}>{"{question}"}</span>` so they are visually distinct. The block is left-aligned text (monospace), but the block itself (and its label) is centered within the surrounding flex column. Label "Judge Prompt" appears above the block in a `<T center bold>` 22px header.
  - sub=2 rubric table: 5 rows in a stacked layout (one `<div>` per row, each tinted `${C.green}06`). No overlap.
  - sub=3, sub=4 side-by-side comparisons: `display: grid; gridTemplateColumns: repeat(2, 1fr); gap: 12`. No overlap.
  - sub=5 3-row table: each row tinted.
  - sub=6 calibration SVG: 2 lines (before, after) on a labeled chart. ViewBox centered. `<desc>` first child describing it. Add svg-descriptions entry.
  - End: `{sub < 6 && <SubBtn .../> }`.
  - Titles `<T center bold>`. Title-case for every diagram label. No em-dashes. No `C.card`.

- [ ] **Step 4: Run tests to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "LLMAsJudge"
  ```

  Expected: PASS.

- [ ] **Step 5: Add SVG description entry for the calibration chart**

  Edit `src/data/svg-descriptions.json`:

  ```json
    "12.29": [
      "Judge calibration before-and-after line chart. The x-axis is the judge score percentile and the y-axis is agreement with human labels. The before curve sits around 60% agreement with a long divergence tail; the after curve (rubric refined plus position and verbosity mitigations applied) rises to 92% agreement, showing how calibration narrows the gap to human judgement."
    ]
  ```

  Edit `src/__tests__/svg-descriptions.test.js`. Append `"12.29"` to `expectedChapters`.

- [ ] **Step 6: SVG `<desc>` presence**

  Add `"12.29"` to the `svgChapters` array in sections.test.jsx's "Every SVG has a `<desc>` element" describe block.

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "Every SVG"
  npx vitest run src/__tests__/svg-descriptions.test.js
  ```

  Expected: PASS.

- [ ] **Step 7: Full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: green.

- [ ] **Step 8: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.29 LLM-as-Judge"
  ```

---

## Task 8: Implement Chapter 12.30 RAGASMetrics (6-7 sub-steps)

**Files:**
- Modify: `src/sections/rag-evaluation.jsx` (replace `RAGASMetrics` stub).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block).
- Modify: `src/data/svg-descriptions.json`, `src/__tests__/svg-descriptions.test.js` if new SVG.

**Chapter purpose (from spec):** the 4 RAGAS metrics with formulas and worked examples. Each metric is grounded in a concrete worked computation on the password-reset query. Walk away able to compute Faithfulness, Answer Relevancy, Context Precision, Context Recall by hand on a small example.

**Sub-step structure (7 sub-steps, 0-6):**

- **sub=0 (C.cyan) - Why RAGAS.**
  Title: "RAGAS: Reference-Free RAG Metrics".
  Visual: a one-line strap card explaining: RAGAS (Retrieval Augmented Generation Assessment) is a 2023 metric suite that uses an LLM to compute eval metrics without needing a reference answer. Four core metrics: Faithfulness, Answer Relevancy, Context Precision, Context Recall.
  Side card: a tiny pictogram of the 4 metrics named with their "what it asks" subtitles:
  - Faithfulness: Are the claims supported?
  - Answer Relevancy: Does it answer the question?
  - Context Precision: Are top results actually relevant?
  - Context Recall: Did we retrieve everything?
  Key content: "RAGAS", "reference-free" or "no reference" or "without reference", "faithfulness", "relevancy", "precision", "recall".

- **sub=1 (C.purple) - Faithfulness.**
  Title: "Faithfulness".
  Visual: a centered standalone formula box (background `${C.purple}06`, border `1px solid ${C.purple}12`, container `textAlign: "center"`):

  ```
  Faithfulness = | verifiable claims | / | total claims in answer |
  ```

  Then a worked-example panel using the password-reset query:
  - Retrieved context (doc-1): "To reset your password, go to Settings > Security. Click Forgot Password. An email is sent to your registered address. The link expires after 24 hours."
  - Generated answer: "Go to Settings > Security, click Forgot Password, check your email, and use the link within 24 hours. You can also call support."
  - Claims extracted by the LLM-judge:
    1. Go to Settings > Security. Supported.
    2. Click Forgot Password. Supported.
    3. Check email. Supported.
    4. Use the link within 24 hours. Supported.
    5. You can also call support. **Not supported (context never mentions phone support)**.
  - Faithfulness = 4 / 5 = 0.8. (Note: the spec lists 3/4 = 0.75; the implementation uses 4/5 = 0.8. Both are valid as worked examples - this plan uses 4/5 to demonstrate a clearer fail-claim. Tests assert presence of the formula and a numeric fraction, not the exact value.)
  Key content: "faithful", the formula text "verifiable claims" or "total claims", a fraction like "4/5" or "4 / 5" or "0.8" or "0.75".

- **sub=2 (C.orange) - Answer Relevancy.**
  Title: "Answer Relevancy".
  Visual: centered standalone formula:

  ```
  Answer Relevancy = (1/n) * sum over i of cosine(embed(q), embed(q_i_generated))
  ```

  where `q_i_generated` is a question the LLM-judge generates from the answer (round-trip check). The judge generates n = 3 such questions and averages the cosine to the original.
  Worked example:
  - Original query: "How do I reset my password?"
  - LLM-generated questions from the answer:
    1. "What are the steps to reset my password?" -> cosine 0.94.
    2. "How can I change my password if I forgot it?" -> cosine 0.91.
    3. "How do I update my account password?" -> cosine 0.89.
  - Answer Relevancy = (0.94 + 0.91 + 0.89) / 3 = 0.913.
  Key content: "answer relevancy" or "relevancy", "cosine", "generate" or "question from answer" or "round[- ]?trip", at least one numeric like "0.91" or "0.913".

- **sub=3 (C.green) - Context Precision.**
  Title: "Context Precision".
  Visual: centered standalone formula:

  ```
  Context Precision = relevant_chunks_at_top_k / k
  ```

  More precisely, RAGAS computes a rank-aware version (weighted by rank) but the simplified ratio is taught here.
  Worked example:
  - Top-3 retrieved chunks for "How do I reset my password?":
    1. doc-1 chunk-1 (password reset intro) - **Relevant**.
    2. doc-23 chunk-2 (500 error troubleshooting) - **Not relevant**.
    3. doc-1 chunk-2 (password reset email step) - **Relevant**.
  - Context Precision = 2 / 3 = 0.667.
  Key content: "context precision" or "precision", "relevant", "top-?k|top-?3", a fraction like "2/3" or "0.667".

- **sub=4 (C.red) - Context Recall.**
  Title: "Context Recall".
  Visual: centered standalone formula:

  ```
  Context Recall = relevant_chunks_retrieved / all_relevant_chunks_in_corpus
  ```

  Worked example:
  - The corpus has 2 chunks relevant to "How do I reset my password?": doc-1 chunk-1 and doc-1 chunk-2.
  - Top-k retrieval returned both -> Context Recall = 2 / 2 = 1.0.
  - Counter-example: if only doc-1 chunk-1 had come back, Context Recall = 1 / 2 = 0.5.
  Key content: "context recall" or "recall", "relevant" + "chunk", a fraction like "2/2" or "1.0", at least one counter-example value like "0.5".

- **sub=5 (C.yellow) - The four together: per-query report card.**
  Title: "Putting It Together: A Per-Query Report Card".
  Visual: a 4-row score card for the password-reset query:
  - Faithfulness: 0.80.
  - Answer Relevancy: 0.91.
  - Context Precision: 0.67.
  - Context Recall: 1.00.
  Each row a tinted bar. Average row at the bottom: 0.845.
  Plus a side card explaining: the 4 split into Retrieval (precision + recall) and Generation (faithfulness + relevancy). The triangle in 12.28 is the same split. RAGAS uses an LLM-judge under the hood for claim extraction and question generation.
  Key content: at least three of the four metric names + their score, "average" or "report card" or "score card".

- **sub=6 (C.pink) - The deprecated note: BLEU/ROUGE.**
  Title: "Not RAGAS: BLEU & ROUGE".
  Visual: a single tinted note card. Body in 3 lines:
  - BLEU and ROUGE compute n-gram overlap between the generated answer and a reference answer.
  - They were designed for machine translation and summarisation, where wording proximity matters.
  - They **do not measure faithfulness or groundedness** - a perfectly faithful answer in different wording scores low; a hallucinated answer that recycles reference words scores high.
  - Use RAGAS or LLM-as-judge instead. See 12.28 for the triangle, 12.29 for judge design.
  Key content: "BLEU" or "ROUGE", "deprecated" or "word overlap" or "n-gram" or "do not measure", "faithful" or "ground".

- [ ] **Step 1: Append content tests to sections.test.jsx**

  ```js
  describe("RAGASMetrics (12.30) content", () => {
    const fn = RagEvaluation.RAGASMetrics;

    it("sub=0 introduces RAGAS as reference-free with 4 metrics", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/RAGAS/);
      expect(container.textContent).toMatch(/reference[- ]?free|without reference|no reference/i);
      expect(container.textContent).toMatch(/faithfulness/i);
      expect(container.textContent).toMatch(/relevancy/i);
      expect(container.textContent).toMatch(/precision/i);
      expect(container.textContent).toMatch(/recall/i);
    });

    it("sub=1 shows the faithfulness formula and a worked example", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/faithful/i);
      expect(container.textContent).toMatch(/verifiable claim|total claim|supported/i);
      expect(container.textContent).toMatch(/4\s*\/\s*5|0\.8|3\s*\/\s*4|0\.75/);
    });

    it("sub=2 shows answer relevancy with round-trip cosine", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/answer relevancy|relevancy/i);
      expect(container.textContent).toMatch(/cosine/i);
      expect(container.textContent).toMatch(/round[- ]?trip|generate|question from/i);
      expect(container.textContent).toMatch(/0\.91|0\.913|0\.89|0\.94/);
    });

    it("sub=3 shows context precision with worked example", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/context precision|precision/i);
      expect(container.textContent).toMatch(/relevant/i);
      expect(container.textContent).toMatch(/2\s*\/\s*3|0\.667/);
    });

    it("sub=4 shows context recall with worked example", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/context recall|recall/i);
      expect(container.textContent).toMatch(/relevant/i);
      expect(container.textContent).toMatch(/2\s*\/\s*2|1\.0|0\.5|1\s*\/\s*2/);
    });

    it("sub=5 produces a per-query report card with all four scores", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/faithful/i);
      expect(container.textContent).toMatch(/relevancy/i);
      expect(container.textContent).toMatch(/precision/i);
      expect(container.textContent).toMatch(/recall/i);
      expect(container.textContent).toMatch(/report card|score card|average/i);
    });

    it("sub=6 flags BLEU/ROUGE as deprecated for RAG eval", () => {
      const { container } = render(fn(makeCtx({ sub: 6 })));
      expect(container.textContent).toMatch(/BLEU|ROUGE/);
      expect(container.textContent).toMatch(/deprecated|word.overlap|n[- ]?gram|do not measure/i);
      expect(container.textContent).toMatch(/faithful|ground/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to confirm RED**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "RAGASMetrics"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the chapter**

  Replace the stub. Required specifics:

  - 7 sub-steps (sub >= 0 through sub >= 6).
  - Colors per sub-step: cyan -> purple -> orange -> green -> red -> yellow -> pink.
  - **CRITICAL: each formula in sub=1, sub=2, sub=3, sub=4 MUST be a standalone centered block.** Use `<div style={{ textAlign: "center", padding: 16, background: \`${C.X}06\`, border: \`1px solid ${C.X}12\`, borderRadius: 8, fontFamily: "monospace", fontSize: 16 }}>...</div>`. Variables (`verifiable_claims`, `cosine`, `embed`) stay as identifier text (no need to capitalize their first letter per the CLAUDE.md exception).
  - Worked examples after each formula in the same sub-step, in a centered card (`textAlign: "center"` on the container).
  - sub=5 score-card rows stacked vertically with tinted backgrounds; average row at bottom slightly different background. No overlap.
  - sub=6 single note card. Body lines are full-line strings (capitalize first letter of each). NOT a code block.
  - End: `{sub < 6 && <SubBtn .../> }`.
  - Titles `<T center bold>`. Title-case for every diagram label.

- [ ] **Step 4: Run tests to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "RAGASMetrics"
  ```

  Expected: PASS.

- [ ] **Step 5: SVGs (if any)**

  This chapter is formula-heavy and is expected to use div-based score cards and worked-example panels. If the implementation introduces no `<svg>` elements, **do not** add an entry to `svg-descriptions.json` or `svg-descriptions.test.js`. If a small worked-example diagram does end up as an SVG (e.g., a per-query report-card bar chart in sub=5), add the corresponding entry:

  ```json
    "12.30": [
      "Per-query RAGAS report card for the password-reset query: four horizontal bars labeled faithfulness 0.80, answer relevancy 0.91, context precision 0.67, context recall 1.00, with an average row at the bottom. Used to show how the four metrics combine into a single per-query score."
    ]
  ```

  And append `"12.30"` to `expectedChapters` AND `svgChapters`. Otherwise skip.

- [ ] **Step 6: Full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: green.

- [ ] **Step 7: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/sections.test.jsx
  # Stage svg-descriptions files only if an SVG was added.
  if grep -q '"12.30"' src/data/svg-descriptions.json; then
    git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  fi
  git commit -m "Implement chapter 12.30 RAGAS Metrics"
  ```

---

## Task 9: Implement Chapter 12.31 GoldenDatasets (5-6 sub-steps)

**Files:**
- Modify: `src/sections/rag-evaluation.jsx` (replace `GoldenDatasets` stub).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block).
- Modify: `src/data/svg-descriptions.json`, `src/__tests__/svg-descriptions.test.js` if new SVG.

**Chapter purpose (from spec):** curation strategy (start with hand-written 30-100 examples covering query types). Edge cases (multi-hop, empty-context, ambiguous, refusal-required, time-sensitive). Regression set (any past production failure becomes a golden case). LLM-bootstrapped golden datasets (use LLM to generate question-answer pairs from corpus, then human-review). Refresh cadence (review monthly; archive obsolete cases). Walk away with a concrete recipe to build a defensible golden set.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.yellow) - Why golden datasets.**
  Title: "Golden Datasets: The Ground Truth For Every Other Metric".
  Visual: a one-line strap card. Body: every eval metric (RAGAS, LLM-as-judge, recall@k) needs ground-truth labels. The golden dataset is the held-out, human-verified set of (question, expected answer, expected docs, expected refusal-or-not) tuples you run every eval against. Without a golden set you have no signal; with a flaky one you have noise.
  Side card: 4 columns of what a golden record contains (question, expected answer, expected docs, expected refusal flag).
  Key content: "golden", "ground truth", at least one of [question, expected answer, expected docs, refusal].

- **sub=1 (C.green) - Initial curation: 30-100 hand-written.**
  Title: "Start With 30-100 Hand-Written Examples".
  Visual: a flow diagram (or 3-card row) showing the curation flow:
  - Step 1: List query types from a week of production logs (or product spec).
  - Step 2: For each type, write 5-10 examples by hand, covering normal + edge cases.
  - Step 3: For each, write the expected answer + the docs it should retrieve.
  Below: a per-row counts table:
  - Single-doc lookups: 20 examples.
  - Multi-hop: 15 examples.
  - Aggregation: 10 examples.
  - Refusal-required: 10 examples.
  - Empty-context (no doc in corpus answers it): 10 examples.
  - Total: 65 examples in week 1.
  Key content: "30-100" or "30 to 100" or "hand-written" or "by hand", "query types" or "categories", at least two of [single-doc, multi-hop, aggregation, refusal, empty-context].

- **sub=2 (C.red) - Edge cases that matter.**
  Title: "Five Edge Cases That Break Naive RAG".
  Visual: a 5-card grid:
  - Multi-hop: "Answer requires combining info from 2+ docs" - example "How do I reset my password if I forgot my email?".
  - Empty-context: "No doc in the corpus answers this" - the system must refuse, not hallucinate. Example: "What is your stock price?".
  - Ambiguous: "Two docs answer in conflict" - example "What's the refund window?" - one doc says 14 days, an older doc says 30. Newest-wins or refusal.
  - Refusal-required: "Out-of-scope or unsafe" - example "Give me another customer's email".
  - Time-sensitive: "Answer depends on date" - example "Is feature X live yet?".
  Each card tinted background `${C.red}06`, title-case header, body sentence.
  Key content: at least three of [multi-hop, empty-context, ambiguous, refusal, time-sensitive], one concrete example query from the corpus.

- **sub=3 (C.purple) - The regression set.**
  Title: "Regression Set: Every Production Bug Becomes A Golden Case".
  Visual: a 4-step circular flow (or numbered list) shown as a process:
  - 1. Production user reports a bad answer.
  - 2. Engineer reproduces, captures (query, retrieved docs, generated answer, expected answer).
  - 3. Add tuple to the regression-golden set.
  - 4. Every future eval includes it; the failure cannot silently re-emerge.
  Below: a side card with a "Bug -> Regression" table showing 3 example entries:
  - "Reset password forgot email" -> previously failed multi-hop, now in regression set.
  - "Cancel and refund" -> previously refused incorrectly, now in regression set.
  - "Pro plan SSO" -> previously hallucinated SSO inclusion, now in regression set.
  Key content: "regression", "production" + "bug" or "failure", "every" or "always", at least one example tuple.

- **sub=4 (C.cyan) - LLM-bootstrapped golden datasets.**
  Title: "LLM-Bootstrapped: Generate Then Human-Review".
  Visual: a two-lane pipeline diagram:
  - Lane A (LLM): given a doc from the corpus, prompt the LLM to generate (question, answer) pairs grounded in that doc. Produces 5-20 pairs per doc.
  - Lane B (Human): a human reviewer accepts / edits / rejects each pair. Acceptance rate typically 60-80% for clear docs, lower for messy ones.
  - Result: a fast way to grow a golden set from a 30-100 hand-built seed to a 500-2000 reviewed set, at a fraction of full hand-curation cost.
  Caution panel below: NEVER deploy LLM-generated pairs without human review. The LLM can encode its own biases ("good test case for itself, fails on others").
  Key content: "bootstrap" or "LLM-generated" or "generate", "human-review" or "reviewer", a number like "500" or "2000" or "60-80%".

- **sub=5 (C.orange) - Refresh cadence & lifecycle.**
  Title: "Monthly Review: Archive Obsolete, Add New".
  Visual: a calendar-strip diagram of a year, with monthly markers showing what happens each cycle:
  - Each month: spot-check 20 random golden cases.
  - Archive obsolete (docs deleted, product changed) -> move to `archived/` directory but keep for audit.
  - Add new from the past month's production bugs.
  - Re-run eval to confirm regression-set still passes.
  Below: a metric card showing "golden set health":
  - Coverage: query types covered / total query types.
  - Freshness: median age of cases.
  - Pass-rate: % currently green.
  Key content: "monthly" or "review" or "cadence", "archive" or "obsolete", "coverage" or "freshness" or "pass-rate".

- [ ] **Step 1: Append content tests to sections.test.jsx**

  ```js
  describe("GoldenDatasets (12.31) content", () => {
    const fn = RagEvaluation.GoldenDatasets;

    it("sub=0 explains golden datasets as ground truth", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/golden/i);
      expect(container.textContent).toMatch(/ground truth/i);
      expect(container.textContent).toMatch(/expected answer|expected doc|refusal/i);
    });

    it("sub=1 prescribes 30-100 hand-written initial examples", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/30[- ]?100|30 to 100|hand[- ]?written/i);
      expect(container.textContent).toMatch(/query type|categor/i);
      expect(container.textContent).toMatch(/multi[- ]?hop|aggregation|refusal|empty/i);
    });

    it("sub=2 lists the five edge-case categories", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/multi[- ]?hop/i);
      expect(container.textContent).toMatch(/empty[- ]?context|empty context/i);
      expect(container.textContent).toMatch(/ambig/i);
      expect(container.textContent).toMatch(/refusal/i);
      expect(container.textContent).toMatch(/time[- ]?sensitive/i);
    });

    it("sub=3 covers the regression set workflow", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/regression/i);
      expect(container.textContent).toMatch(/production|bug|failure/i);
      expect(container.textContent).toMatch(/reproduc|capture|tuple/i);
    });

    it("sub=4 explains LLM-bootstrapped golden datasets with human review", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/bootstrap|LLM[- ]?generated|generate/i);
      expect(container.textContent).toMatch(/human[- ]?review|reviewer/i);
      expect(container.textContent).toMatch(/never|caution|bias/i);
    });

    it("sub=5 prescribes monthly review and archive cadence", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/monthly|cadence|review/i);
      expect(container.textContent).toMatch(/archive|obsolete/i);
      expect(container.textContent).toMatch(/coverage|freshness|pass[- ]?rate/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to confirm RED**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "GoldenDatasets"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the chapter**

  Replace the stub. Required specifics:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step: yellow -> green -> red -> purple -> cyan -> orange.
  - sub=1 process flow: 3-step horizontal row or 3-card grid. The per-row counts table sits below as a clean div table.
  - sub=2 5-card grid: `display: grid; gridTemplateColumns: repeat(3, 1fr); gap: 12` (3-wide; 2 cards land in row 2). Cards centered.
  - sub=3 process flow: numbered 4-step list, plus side-by-side regression-tuple table.
  - sub=4 two-lane pipeline diagram: optional SVG. If SVG, viewBox `0 0 540 200`, two horizontal lanes (LLM lane top, human lane bottom) each with three boxes connected by arrows. Add `<desc>` and svg-descriptions entry.
  - sub=5 calendar strip: 12 small month tiles in a horizontal row (or a 6x2 grid for narrower screens). Below: metric cards.
  - End: `{sub < 5 && <SubBtn .../> }`.
  - Titles `<T center bold>`. Title-case for every diagram label. No em-dashes.

- [ ] **Step 4: Run tests to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "GoldenDatasets"
  ```

  Expected: PASS.

- [ ] **Step 5: SVG description entry (if SVG added in sub=4)**

  If the bootstrap pipeline is rendered as an SVG, add to `src/data/svg-descriptions.json`:

  ```json
    "12.31": [
      "Two-lane LLM-bootstrapped golden-dataset pipeline. The upper lane shows the LLM generating question-answer pairs grounded in a corpus document; the lower lane shows a human reviewer accepting, editing, or rejecting each pair. Used to illustrate how a small hand-built seed scales into a 500-2000 reviewed set without losing human oversight."
    ]
  ```

  Append `"12.31"` to `expectedChapters` and `svgChapters`. Skip if no SVG.

- [ ] **Step 6: Full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: green.

- [ ] **Step 7: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/sections.test.jsx
  if grep -q '"12.31"' src/data/svg-descriptions.json; then
    git add src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  fi
  git commit -m "Implement chapter 12.31 Golden Datasets"
  ```

---

## Task 10: Implement Chapter 12.32 OnlineEvalABTesting (5-6 sub-steps)

**Files:**
- Modify: `src/sections/rag-evaluation.jsx` (replace `OnlineEvalABTesting` stub).
- Modify: `src/__tests__/sections.test.jsx` (append content-test block).
- Modify: `src/data/svg-descriptions.json`, `src/__tests__/svg-descriptions.test.js` if new SVG.

**Chapter purpose (from spec):** production feedback loops. Implicit signals (thumbs up/down, dwell time, copy-paste, follow-up rephrase). Explicit feedback (rating, "did this answer help?"). Shadow eval (run new pipeline alongside old, compare without affecting users). A/B testing with rubric-based judging at scale. Privacy considerations for feedback storage. Walk away with a concrete plan for online + A/B that closes the loop with offline eval.

**Sub-step structure (6 sub-steps, 0-5):**

- **sub=0 (C.pink) - Offline isn't enough.**
  Title: "Why Online Eval In Addition To Offline".
  Visual: a 2-column comparison:
  - Offline (golden + RAGAS + judge): controlled, reproducible, fast iterations. But: doesn't reflect production query distribution, doesn't catch rare-but-bad cases.
  - Online (production users): real distribution, catches edge cases. But: noisy, slow signal, privacy concerns.
  Bottom row: "Use both. Offline gates merge; online detects regressions in production."
  Key content: "online" and "offline", "production" or "real users", at least one tradeoff phrase ("noisy" or "controlled" or "reproducible").

- **sub=1 (C.cyan) - Implicit signals taxonomy.**
  Title: "Implicit Signals: What Users Tell You Without Clicking Anything".
  Visual: a 4-card grid:
  - Thumbs up/down (explicit-light, often counted as implicit since most users don't click).
  - Dwell time on answer (long = read carefully; very short = irrelevant).
  - Copy-paste rate (user copied the answer = useful).
  - Follow-up rephrase (user re-asks the same intent with different wording = previous answer failed).
  Each card with title-case header + signal interpretation.
  Below: a calibration note that any single signal is noisy; combine 3+ to detect quality regressions.
  Key content: "implicit", at least three of [thumbs, dwell, copy-paste, rephrase], "combine" or "noisy" or "calibrat".

- **sub=2 (C.green) - Explicit feedback.**
  Title: "Explicit Feedback: Ask Directly".
  Visual: two side-by-side cards:
  - Rating widget: post-answer thumbs / star rating / "did this help?" Yes/No. Capture rate: 2-8% of sessions.
  - Free-text feedback: "Tell us what went wrong". Higher signal, much lower volume.
  Tradeoff card: explicit feedback is the highest-signal-per-sample but lowest-volume. Don't rely on it alone.
  Plus a privacy note: store feedback with the conversation context, redact PII before retention, follow regional privacy law (GDPR, CCPA).
  Key content: "explicit", "rating" or "thumbs" or "star" or "feedback", "privacy" or "PII" or "redact" or "GDPR".

- **sub=3 (C.purple) - Shadow eval.**
  Title: "Shadow Eval: Run New Pipeline Alongside Old".
  Visual: a pipeline diagram:
  - User query enters the system.
  - Old pipeline produces answer A (served to user).
  - New pipeline produces answer B (not served, logged).
  - Both answers run through the LLM-judge rubric.
  - Aggregate scores show whether new pipeline beats old on production traffic, without exposing users to risk.
  Below: a metric card showing "shadow eval week 1: judge prefers new in 62% of cases, ties in 23%, regresses in 15%". This signal is what graduates the new pipeline to A/B.
  Key content: "shadow", "alongside" or "log" or "without serving", a percentage like "62%" or "60%" or "judge", at least one of [old/new pipeline, candidate, production traffic].

- **sub=4 (C.orange) - A/B testing with rubric-based judging.**
  Title: "A/B: Split Traffic, Measure With Rubric".
  Visual: a flow diagram:
  - Bucket users 50/50 into control (old) and treatment (new).
  - Sample N queries from each bucket per day (e.g., 200/day each).
  - Run LLM-judge rubric on every sampled (query, answer) pair.
  - Compute mean rubric score per bucket; check statistical significance.
  Statistical note card: at N=200/day per bucket and effect size of 0.1 on a 1-5 scale, 7-14 days to reach p < 0.05 significance. Don't peek - pre-register the analysis window.
  Plus a guardrails card: monitor regressions (faithfulness drop, refusal-rate spike) at high frequency; auto-rollback if guardrails breach a threshold.
  Key content: "A/B" or "split traffic", "rubric" or "judge", "significance" or "p[- ]?value" or "statistical", "guardrail" or "rollback" or "monitor".

- **sub=5 (C.red) - Closing the loop.**
  Title: "Closing The Loop: Online -> Offline -> Online".
  Visual: a 4-node cycle diagram (or numbered list):
  - 1. Online finds a regression (thumbs-down spike on a query type).
  - 2. Capture failing cases into the golden regression set (12.31).
  - 3. Offline eval reproduces the failure; iterate fix.
  - 4. Shadow + A/B verify fix in production.
  - Back to 1.
  Caption: this is the production-grade RAG eval loop. The offline pipeline (RAGAS, judge, golden) and the online pipeline (implicit + explicit + shadow + A/B) are two halves of one feedback system.
  Key content: "loop" or "cycle", "regression" or "feedback", at least one of [shadow, A/B, golden, judge, RAGAS] referenced by name.

- [ ] **Step 1: Append content tests to sections.test.jsx**

  ```js
  describe("OnlineEvalABTesting (12.32) content", () => {
    const fn = RagEvaluation.OnlineEvalABTesting;

    it("sub=0 contrasts offline vs online eval", () => {
      const { container } = render(fn(makeCtx({ sub: 0 })));
      expect(container.textContent).toMatch(/offline/i);
      expect(container.textContent).toMatch(/online/i);
      expect(container.textContent).toMatch(/production|real user/i);
    });

    it("sub=1 lists implicit signals", () => {
      const { container } = render(fn(makeCtx({ sub: 1 })));
      expect(container.textContent).toMatch(/implicit/i);
      expect(container.textContent).toMatch(/thumb|dwell|copy[- ]?paste|rephrase/i);
    });

    it("sub=2 covers explicit feedback with privacy note", () => {
      const { container } = render(fn(makeCtx({ sub: 2 })));
      expect(container.textContent).toMatch(/explicit/i);
      expect(container.textContent).toMatch(/rating|thumb|feedback|star/i);
      expect(container.textContent).toMatch(/privacy|PII|redact|GDPR/i);
    });

    it("sub=3 explains shadow eval", () => {
      const { container } = render(fn(makeCtx({ sub: 3 })));
      expect(container.textContent).toMatch(/shadow/i);
      expect(container.textContent).toMatch(/alongside|log|without serving|without affecting/i);
      expect(container.textContent).toMatch(/judge|rubric|production traffic/i);
    });

    it("sub=4 explains A/B with rubric judging and guardrails", () => {
      const { container } = render(fn(makeCtx({ sub: 4 })));
      expect(container.textContent).toMatch(/A\/B|split traffic/i);
      expect(container.textContent).toMatch(/rubric|judge/i);
      expect(container.textContent).toMatch(/significan|p[- ]?value|statistical/i);
      expect(container.textContent).toMatch(/guardrail|rollback|monitor/i);
    });

    it("sub=5 closes the offline-online loop", () => {
      const { container } = render(fn(makeCtx({ sub: 5 })));
      expect(container.textContent).toMatch(/loop|cycle|feedback/i);
      expect(container.textContent).toMatch(/regression|capture/i);
      expect(container.textContent).toMatch(/shadow|A\/B|golden|RAGAS|judge/i);
    });
  });
  ```

- [ ] **Step 2: Run tests to confirm RED**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "OnlineEvalABTesting"
  ```

  Expected: FAIL.

- [ ] **Step 3: Implement the chapter**

  Replace the stub. Required specifics:

  - 6 sub-steps (sub >= 0 through sub >= 5).
  - Colors per sub-step: pink -> cyan -> green -> purple -> orange -> red.
  - sub=0 2-column comparison: `display: grid; gridTemplateColumns: repeat(2, 1fr); gap: 12`. Centered titles per card.
  - sub=1 4-card grid of implicit signals.
  - sub=2 2-card grid for rating + free-text; privacy note as a side card with tinted background.
  - sub=3 pipeline diagram: SVG with two parallel lanes (old served, new shadowed) merging into a judge. ViewBox centered with computed `x_start`. Add `<desc>`.
  - sub=4 flow diagram: 4 steps in a row (bucket -> sample -> judge -> aggregate). Statistical note + guardrails as side cards below.
  - sub=5 cycle: a circular flow (SVG) showing 4 nodes connected by arrows in a loop. Add `<desc>`.
  - End: `{sub < 5 && <SubBtn .../> }`.
  - Titles `<T center bold>`. Title-case for every diagram label. No em-dashes. A/B is the legitimate brand-name-style exception; render as "A/B" (capital A, capital B).

- [ ] **Step 4: Run tests to verify PASS**

  ```bash
  npx vitest run src/__tests__/sections.test.jsx -t "OnlineEvalABTesting"
  ```

  Expected: PASS.

- [ ] **Step 5: SVG description entries**

  Add to `src/data/svg-descriptions.json` (one entry per SVG; at least the shadow-eval pipeline and the closing-loop cycle):

  ```json
    "12.32": [
      "Shadow-eval pipeline diagram. A user query splits into an old pipeline whose answer is served and a new pipeline whose answer is logged but not served. Both answers feed into an LLM-judge that scores them, producing an aggregate comparison without exposing users to the candidate pipeline.",
      "Closing-the-loop cycle diagram with four nodes connected by arrows: online finds a regression, capture failing cases into the golden regression set, offline reproduces and fixes, shadow plus A/B verify in production. The cycle returns to online detection, illustrating the offline-online feedback loop that production-grade RAG eval relies on."
    ]
  ```

  Adjust array length to match the actual `<svg>` count produced by the implementation. Append `"12.32"` to `expectedChapters` and `svgChapters`.

- [ ] **Step 6: Run the SVG validation**

  ```bash
  npx vitest run src/__tests__/svg-descriptions.test.js
  npx vitest run src/__tests__/sections.test.jsx -t "Every SVG"
  ```

  Expected: PASS.

- [ ] **Step 7: Full suite, lint, format**

  ```bash
  npm run test
  npm run lint
  npm run format
  ```

  Expected: green.

- [ ] **Step 8: Commit**

  ```bash
  git add src/sections/rag-evaluation.jsx src/__tests__/sections.test.jsx src/data/svg-descriptions.json src/__tests__/svg-descriptions.test.js
  git commit -m "Implement chapter 12.32 Online Eval & A/B Testing"
  ```

---

## Task 11: Update CLAUDE.md mapping for Act 7

**Files:**
- Modify: `CLAUDE.md`.

- [ ] **Step 1: Update Section 12 heading annotation**

  Find the Section 12 heading in the "Complete Mapping" area. Replace whatever the current annotation says (likely "M1-M4 complete" or similar) with:

  ```markdown
  **Section 12: Retrieval-Augmented Generation** (`rag-foundations.jsx` + `rag-retrieval.jsx` + `rag-generation.jsx` + `rag-evaluation.jsx` - Milestones 1-5 of 6 complete)
  ```

- [ ] **Step 2: Extend the Section 12 mapping table**

  Append the five new rows after the M4 final row (12.27 LongContextVsRAG):

  ```markdown
  | 12.28 | RAGEvalTriangle | The RAG Eval Triangle |
  | 12.29 | LLMAsJudge | LLM-as-Judge |
  | 12.30 | RAGASMetrics | RAGAS Metrics |
  | 12.31 | GoldenDatasets | Golden Datasets |
  | 12.32 | OnlineEvalABTesting | Online Eval & A/B Testing |
  ```

  Update any trailing parenthetical to point to remaining work:

  ```markdown
  (M6 will extend this table with chapters 12.33-12.38 for Acts 8+9.)
  ```

- [ ] **Step 3: Update the project-structure tree**

  In the `## Project Structure` section under `src/sections/`, find the rag-related entries (added by M1-M4) and append `rag-evaluation.jsx`. The block should look like:

  ```
  │       ├── rag-foundations.jsx          # Section 12 (Acts 1+2, chapters 12.1-12.10)
  │       ├── rag-retrieval.jsx            # Section 12 (Acts 3+4, chapters 12.11-12.18)
  │       ├── rag-generation.jsx           # Section 12 (Acts 5+6, chapters 12.19-12.27)
  │       └── rag-evaluation.jsx           # Section 12 (Act 7, chapters 12.28-12.32)
  ```

  If the existing block already has `└──` on `rag-generation.jsx`, change that line's connector to `├──` so `rag-evaluation.jsx` becomes the new last entry.

- [ ] **Step 4: No test required for CLAUDE.md (it's documentation)**

- [ ] **Step 5: Commit**

  ```bash
  git add CLAUDE.md
  git commit -m "Document Section 12 Act 7 in CLAUDE.md mapping"
  ```

---

## Task 12: Final M5 verification

**Files:** none (verification only).

- [ ] **Step 1: Full test suite**

  ```bash
  npm run test
  ```

  Expected: all tests pass. The test count should have grown by 5 chapter-specific blocks (each with 5-7 assertions) + 5 entries in the generic "All chapters" block (each iterating 11 sub levels = 55 generic tests, of which the chapter functions need to render without crash).

- [ ] **Step 2: Coverage run**

  ```bash
  npx vitest run --coverage
  ```

  Expected: `rag-evaluation.jsx` at 100% lines / 100% branches. Overall report stays at the per-CLAUDE.md target: 100% lines, branches >= 97.7%. If branches dropped, identify uncovered branches in new code; either add tests or document the unreachable defensive branches in a follow-up.

- [ ] **Step 3: Lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors. Any pre-existing warnings outside `rag-evaluation.jsx` remain as-is.

- [ ] **Step 4: Format check**

  ```bash
  npm run format
  ```

  Expected: no changes (or only trivial whitespace). If `npm run format` rewrites files, re-run `npm run test` then commit any drift.

- [ ] **Step 5: No em-dashes check**

  ```bash
  grep -n "—" src/sections/rag-evaluation.jsx
  grep -n "&mdash" src/sections/rag-evaluation.jsx
  ```

  Expected: no matches.

- [ ] **Step 6: No `C.card` Boxes**

  ```bash
  grep -n "Box color={C.card}" src/sections/rag-evaluation.jsx
  ```

  Expected: no matches.

- [ ] **Step 7: No "architect" word**

  ```bash
  grep -in "architect" src/sections/rag-evaluation.jsx
  ```

  Expected: no matches.

- [ ] **Step 8: No next-chapter hints**

  ```bash
  grep -in "next chapter\|coming up\|preview:" src/sections/rag-evaluation.jsx
  ```

  Expected: no matches. (Within-section signposts like "Chapters 12.33-12.37 cover observability" are allowed; the grep above will not flag those.)

- [ ] **Step 9: Production build smoke test**

  ```bash
  npm run build
  ```

  Expected: build succeeds. No errors in vendor chunking, JSX compilation, or asset processing. New `rag-evaluation.jsx` should appear as part of the Section 12 chunk.

- [ ] **Step 10: Smoke-boot the dev server and walk Section 12 Act 7**

  ```bash
  npm run dev
  ```

  Open `http://localhost:5173/learn-ai/`. Use keyboard arrows to land on chapter 12.28. Step through every sub-step of 12.28-12.32 (use the SubBtn or right-arrow). For each sub-step, eyeball:

  - No element overlaps another.
  - Diagrams centered horizontally + vertically.
  - Title-case for diagram box text.
  - First letter of every line capitalized.
  - All Boxes have real colors (not gray-on-dark from `C.card`).
  - Standalone formulas (especially the 4 RAGAS formulas in 12.30 sub=1 through sub=4) are centered.
  - Judge prompt artifact in 12.29 sub=1 is clearly distinct from a code block (monospace, tinted, labelled "Judge Prompt", placeholders in yellow).

  If any defect is found, stop, fix in the chapter source file, re-run `npm run test`, restart this step. Stop the dev server with Ctrl-C after a clean pass.

- [ ] **Step 11: Verify TOC shows 32 Section 12 chapters**

  Boot the dev server (`npm run dev`), open the TOC (typically chapter index 0 / the "Overview"), confirm Section 12 lists 32 chapters ending in "Online Eval & A/B Testing". Stop the server.

- [ ] **Step 12: (Optional) Milestone marker commit**

  If everything is already committed from earlier tasks, no marker commit is needed. If a small drift exists (formatting, etc.):

  ```bash
  git status
  git add -p   # carefully review what to stage
  git commit -m "Section 12 Milestone 5 complete: Act 7 (12.28-12.32) shipped"
  ```

- [ ] **Step 13: Confirm M5 success criteria**

  Verify via `git log` that the M5 commit history is clean and well-structured (target 10-12 commits). Confirm:

  - [x] 5 chapters implemented in `rag-evaluation.jsx` (RAGEvalTriangle, LLMAsJudge, RAGASMetrics, GoldenDatasets, OnlineEvalABTesting).
  - [x] Section 12 loader in `learn-ai.jsx` is a 4-file `Promise.all` (rag-foundations, rag-retrieval, rag-generation, rag-evaluation).
  - [x] `config.js` has 32 Section 12 chapter rows (12.1-12.32), all sequential.
  - [x] `sections.test.jsx`, `lookup.test.js`, `config.test.js` updated and green.
  - [x] Coverage 100% lines for the new file; branches >= 97.7% overall.
  - [x] Lint + format clean.
  - [x] Every new SVG has a `<desc>` child + entry in `svg-descriptions.json` + listing in `expectedChapters` / `svgChapters`.
  - [x] CLAUDE.md mapping table extended to 12.32; project structure tree updated; milestones annotation reads "1-5 of 6 complete".
  - [x] Production build smoke test passes.
  - [x] Dev-server walk through 12.28-12.32 sub-steps is visually clean.

  M5 complete. Ready to write Milestone 6 plan (Acts 8+9 - chapters 12.33-12.38).

---

## Task 13: Plan Refinement Checkpoint for M6

**Files:**
- Create: `docs/superpowers/lessons/section-12-m5-lessons.md` (new lessons file)
- Modify (if needed): `docs/superpowers/plans/2026-05-16-section-12-milestone-6.md`

Per the section's "lessons-feed-forward" rule, before executing M6, do a quick refinement pass on the M6 plan using what M5 taught us. The plans are editable artifacts, not contracts - this checkpoint is where M5's real-world experience gets folded into M6's plan.

- [ ] **Step 1: Lessons capture from M5 (5-10 minutes, write it down)**

Create `docs/superpowers/lessons/section-12-m5-lessons.md` with 3-5 honest bullet observations from executing M5:

- Which visual patterns rendered cleanly in Chrome and which needed iteration?
- Which test regexes were too brittle (false fail) or too loose (let bugs through)?
- Which sub-step structures landed clean and which needed re-org during implementation?
- Anything in the per-chapter task pattern that felt awkward or could be tightened?
- Anything in the visual rules that proved especially load-bearing or surprisingly easy to violate?
- Any pattern (color choice, diagram structure, prompt-template treatment, etc.) that worked better than what the plan specified?

The lessons are only useful if they're real. Skip a bullet if it doesn't apply. Add bullets the prompts don't cover if something else stood out.

- [ ] **Step 2: Read M6 plan with M5 lessons in mind**

Open `docs/superpowers/plans/2026-05-16-section-12-milestone-6.md`. Scan for places where the M5 lessons would apply:

- If M5 showed a visual pattern works better than what M6 specifies, update the relevant sub-step descriptions in M6.
- If M5 showed a test regex pattern catches more bugs, update M6's test patterns.
- If M5 showed a task structure was awkward, simplify the equivalent structure in M6.
- If M5 introduced a useful helper / convention / utility not anticipated in M6, thread it into the M6 plan.

- [ ] **Step 3: Edit M6 plan if needed**

If lessons translate to plan edits, make them inline in `docs/superpowers/plans/2026-05-16-section-12-milestone-6.md`. Keep edits scoped: only change what M5 directly informs. Do NOT rewrite M6 wholesale.

If no edits are warranted, skip and proceed to commit.

- [ ] **Step 4: Commit the lessons file + any plan edits**

```bash
git add docs/superpowers/lessons/section-12-m5-lessons.md docs/superpowers/plans/2026-05-16-section-12-milestone-6.md
git commit -m "Capture M5 lessons and refine M6 plan"
```

If only the lessons file changed and no M6 plan edits were made:

```bash
git add docs/superpowers/lessons/section-12-m5-lessons.md
git commit -m "Capture M5 lessons; no M6 plan edits needed"
```

- [ ] **Step 5: Generate beautiful starter prompt for M6**

Create `docs/superpowers/starter-prompts/section-12-m6-starter.md` (create the `starter-prompts/` directory if it doesn't exist).

The file content should be a ready-to-paste prompt for starting M6 in a fresh Claude Code session:

`````markdown
# M6 Starter Prompt - Copy-Paste Into New Claude Code Session

```
Execute Section 12 Milestone 6 of the learn-ai project (RAG section build).

Plan: docs/superpowers/plans/2026-05-16-section-12-milestone-6.md
Spec: docs/superpowers/specs/2026-05-16-section-12-rag-design.md
Prior milestone lessons: docs/superpowers/lessons/section-12-m5-lessons.md (READ FIRST)

Constraints:
- Work directly on main (no feature branch)
- Use subagent-driven-development skill, fresh opus subagent per task, two-stage review
- All agents/subagents must be opus
- TDD mandatory per CLAUDE.md
- Chrome browser visual validation gate per chapter (MANDATORY, not skippable)
- First task: set session title to "section12-milestone6"
- After M6 ships, execute the Section 12 retrospective task to close out the section

Begin with Task 0 (session naming), then Task 1 baseline verify.

use superpowers
ultrathink
```

(End of starter prompt - copy everything inside the code fence above.)

## Notes for next session executor

Before pasting the starter prompt, the user should ideally have already:
- Reviewed `docs/superpowers/lessons/section-12-m5-lessons.md` to know what M5 taught
- Confirmed `git log` shows M5 commits cleanly merged on main
- Verified `npm run test` is green on main
`````

Commit the starter prompt file:

```bash
git add docs/superpowers/starter-prompts/section-12-m6-starter.md
git commit -m "Add M6 starter prompt for next session"
```

- [ ] **Step 6: M5 complete. Ready to start M6.**

---

## What Comes Next

After this milestone, M6 is the final implementation tranche of Section 12:

| Milestone | Acts | Chapters | When planned |
|---|---|---|---|
| M6 | Act 8 (Production Operations) + Act 9 (Decision Framework + Capstone) | 12.33-12.38 (6 ch) | After M5 ships |

M6 covers:
- 12.33 Caching - Prompt + Semantic.
- 12.34 CostModels.
- 12.35 ObservabilityTracing.
- 12.36 HallucinationDrift.
- 12.37 FrameworkChoice.
- 12.38 RAGDecisionFrameworkCapstone.

M6 creates a fifth section file `src/sections/rag-production.jsx` and extends the Section 12 loader `Promise.all` to a final 5-file shape:

```js
12: () =>
  Promise.all([
    import("./sections/rag-foundations.jsx"),
    import("./sections/rag-retrieval.jsx"),
    import("./sections/rag-generation.jsx"),
    import("./sections/rag-evaluation.jsx"),
    import("./sections/rag-production.jsx"),
  ]).then((mods) => Object.assign({}, ...mods)),
```

After M6 ships:

- A final pass updates CLAUDE.md mapping with all 38 chapters and changes the milestones annotation to "1-6 of 6 complete".
- A full discoverability sync runs: `public/llms.txt` topic list reflects the full Section 12 topic span; `index.html` JSON-LD `teaches` array confirms `"Retrieval-Augmented Generation"` is present.
- The title-case-for-diagram-boxes rule (flagged in the spec) is applied to CLAUDE.md - either added globally or carved out as a diagram-specific exception.
- The user is reminded to request re-indexing in Google Search Console and Bing Webmaster Tools after the M6 push.
