# Claude Code Project Instructions

## Overview

Learn AI is an interactive, single-page React application that teaches AI concepts
from neural network basics through the Transformer architecture.

## Tech Stack

- **React 18** with hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- **Vite** for build toolchain (with vendor chunk splitting)
- **GitHub Actions** for CI/CD to GitHub Pages
- **ESLint + Prettier** for code quality
- **Vitest** for unit testing
- No external UI libraries - all styling is inline

## Architecture

The app uses a **section/chapter** hierarchy:

- **Section** = a big topic grouping (e.g., Section 7: "Attention - The Full Computation")
- **Chapter** = one screen/page within a section (e.g., 7.4: "Why Do We Need Softmax?")
- **Sub-step** = progressive "Continue" reveals within a chapter (managed by `sub` state)

### How It Works

**config.js is the single source of truth** for chapter ordering, numbering, and
section assignments. Each entry has a `component` field that maps to a named export
in the corresponding section file.

```js
// config.js
{ id: "7.4", title: "Why Do We Need Softmax?", section: 7, component: "WhySoftmax" }
```

**learn-ai.jsx** builds a lookup object from all section imports and resolves the
active chapter at render time - there is no manually maintained chapter array.

```jsx
const lookup = { TOC, ...NeuralFoundations, ...LLMTraining, ... };
const renderChapter = lookup[chapters[ch].component];
// render: {renderChapter(ctx)}
```

### Naming Convention

| Concept | Where | Naming rule | Example |
|---------|-------|-------------|---------|
| Component file (default export) | `src/` | kebab-case | `learn-ai.jsx` |
| Multi-export module file | `src/` | lowercase | `components.jsx`, `config.js` |
| Section file | `src/sections/` | kebab-case, topic name | `attention-computation.jsx` |
| Chapter function | named export in section file | PascalCase, topic name | `WhySoftmax` |
| Chapter ID | `chapters` array in config.js | `section.chapter` number | `"7.4"` |
| Entry point | `src/` | lowercase | `main.jsx` |

**All filenames are lowercase or kebab-case.** Only function/component names inside
files use PascalCase. This keeps the filesystem consistent across all operating systems.

Function names and file names describe **what the content is about**. They never
contain numbers and never need to be renamed when chapters are reordered or inserted.
Only config.js IDs change.

### Complete Mapping

**Section 1: Neural Network Foundations** (`neural-foundations.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 1.1 | WhatIsNN | What is a Neural Network? |
| 1.2 | InsideNeuron | Inside a Single Neuron |
| 1.3 | WhatIsLayer | What is a Layer? |
| 1.4 | WeightsBiases | Weights & Biases - The Knobs |
| 1.5 | WhyLinear | Why Linear Isn't Enough |
| 1.6 | ReLU | Activation (ReLU) - Why Layers Need a Bend |
| 1.7 | ForwardPass | The Forward Pass - Full Example |
| 1.8 | LossFunction | Loss - How Wrong Were We? |
| 1.9 | WhatIsLearning | Learning - What Does It Mean? |
| 1.10 | Derivatives | Derivatives - The Core Intuition |
| 1.11 | BackwardPass | The Backward Pass - The Chain Rule |
| 1.12 | GradientDescent | Gradient Descent - Fixing the Weights |
| 1.13 | Vectors | Vectors - Numbers That Travel Together |
| 1.14 | DotProductIntro | The Dot Product - How Vectors Compare |
| 1.15 | Matrices | Matrices - Grids That Transform Vectors |
| 1.16 | LayerIsMatMul | A Layer IS Matrix Multiplication |
| 1.17 | ActivationFunctions | Activation Functions - The Full Picture |
| 1.18 | WhatDeepMeans | What "Deep" Really Means |
| 1.19 | SameBuildingBlocks | Same Building Blocks, Different Shapes |

**Section 2: How LLMs Actually Train** (`llm-training.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 2.1 | Tokenization | Tokenization - From Words to Numbers |
| 2.2 | SelfSupervised | Self-Supervised Learning - How GPT Trains |
| 2.3 | CrossEntropy | Cross-Entropy Loss - The LLM Score |
| 2.4 | SFT | Supervised Fine-Tuning (SFT) |
| 2.5 | RLHF | RLHF - Making AI Helpful & Safe |
| 2.6 | BatchTraining | Batch Training - Why Not One Example at a Time? |
| 2.7 | OutputLayer | The Output Layer - From Hidden State to Words |
| 2.8 | AutoregressiveGeneration | Autoregressive Generation - One Token at a Time |

**Section 3: Scaling & Modern Techniques** (`scaling.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 3.1 | ScalingLaws | Scaling Laws - Why Bigger Models Win |
| 3.2 | ParametersAtScale | Parameters at Scale |
| 3.3 | Distillation | Knowledge Distillation - Teacher to Student |
| 3.4 | CLIP | CLIP - Teaching AI to See & Read |
| 3.5 | TrainingPipeline | The Complete Training Pipeline |

**Section 4: The Road to Transformers** (`road-to-transformers.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 4.1 | CNN | CNN |
| 4.2 | RNN | RNN |
| 4.3 | RNNFlaws | RNN's Fatal Flaws |
| 4.4 | TransformerArrives | The Transformer Arrives |
| 4.5 | EncoderDecoder | Encoder & Decoder - The Two Halves |
| 4.6 | DecoderOnly | Decoder-Only - How Modern LLMs Work |

**Section 5: Transformer Input Pipeline** (`transformer-input.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 5.1 | FullArchitecture | The Full Architecture |
| 5.2 | Embeddings | Zoom: Embeddings |
| 5.3 | PosEncodingProblem | Positional Encoding - The Problem |
| 5.4 | PosEncodingFormula | Positional Encoding - The Formula |
| 5.5 | PosEncodingCompute | Positional Encoding - Computing Positions |
| 5.6 | PosEncodingFastSlow | Positional Encoding - Fast vs Slow |
| 5.7 | PosEncodingFinal | Positional Encoding - Final Addition |
| 5.8 | WhatTransformerDoes | What is a Transformer Actually Doing? |

**Section 6: Attention - Understanding Q, K, V** (`attention-qkv.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 6.1 | ContextProblem | The Problem - Context is Everything |
| 6.2 | WordLookup | How Does a Word Look At Others? |
| 6.3 | DotProduct | The Dot Product - Measuring Similarity |
| 6.4 | WhyNotDirectDot | Why Not Dot Product Embeddings Directly? |
| 6.5 | QKVClassroom | Q, K, V - The Classroom Analogy |
| 6.6 | AskerAnswerer | Every Word is BOTH Asker and Answerer |
| 6.7 | WhyKVDifferent | Why Can't Key and Value Be the Same? |
| 6.8 | GoogleAnalogy | The Google Search Analogy |
| 6.9 | HowQKVCreated | How Are Q, K, V Created? |
| 6.10 | WMatrices | W Matrices - Learned During Training |
| 6.11 | TracingExample | Tracing a Complete Example |

**Section 7: Attention - The Full Computation** (`attention-computation.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 7.1 | ComputeQKV | Step 1 - Compute Q, K, V for Every Word |
| 7.2 | AttentionScores | Step 2 - Attention Scores (Dot Products) |
| 7.3 | KTranspose | Why K Transpose? - Making the Shapes Fit |
| 7.4 | WhySoftmax | Why Do We Need Softmax? |
| 7.5 | ScaleByRootDk | Step 3 - Scale by sqrt(d_k) |
| 7.6 | SoftmaxProbs | Step 4 - Softmax to Probabilities |
| 7.7 | WeightedSum | Step 5 - Weighted Sum of Values |
| 7.8 | FullFormula | The Full Formula |
| 7.9 | WhyMultiHead | Why Multi-Head? - The Compromise Problem |
| 7.10 | HeadSplit | The Split - How 8 Heads Work |
| 7.11 | InsideEachHead | Inside Each Head - Full Attention in 64 Dims |
| 7.12 | ConcatWO | Concat + W_O - Blending All Heads |
| 7.13 | WhyEightHeads | Why 8 Heads? Parameter Count & Big Picture |
| 7.14 | IsWOConstant | Is W_O Constant? Does It Change? |
| 7.15 | CompletePicture | The Complete Picture - In Plain English |

**Section 8: Beyond Attention** (`transformer-block.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 8.1 | AddNorm | Add & Norm - The Stabilizer |

## Project Structure

```
learn-ai/
├── index.html
├── vite.config.js
├── eslint.config.js
├── .prettierrc
├── package.json
├── src/
│   ├── main.jsx                          # React entry point
│   ├── learn-ai.jsx                       # Shell: state, navigation, layout
│   ├── components.jsx                    # Shared components (Box, T, Reveal, SubBtn, Tag, ErrorBoundary)
│   ├── config.js                         # chapters array, sectionNames, sectionColors, colors (C)
│   ├── nav-persistence.js               # saveNav/loadNav - localStorage persistence with config fingerprint
│   ├── __tests__/                        # Unit tests (vitest)
│   │   ├── config.test.js               # Config validation tests
│   │   ├── lookup.test.js               # Component lookup tests
│   │   ├── components.test.jsx          # Shared component tests
│   │   ├── nav-persistence.test.js      # Nav persistence tests (save, load, edge cases)
│   │   └── sections.test.jsx            # All chapter function tests
│   └── sections/
│       ├── toc.jsx                       # Table of Contents
│       ├── neural-foundations.jsx         # Section 1
│       ├── llm-training.jsx              # Section 2
│       ├── scaling.jsx                   # Section 3
│       ├── road-to-transformers.jsx      # Section 4
│       ├── transformer-input.jsx         # Section 5
│       ├── attention-qkv.jsx             # Section 6
│       ├── attention-computation.jsx     # Section 7
│       └── transformer-block.jsx        # Section 8
├── .github/workflows/deploy.yml
└── CLAUDE.md
```

## How To: Add a New Chapter

Example: insert a new chapter between 7.2 and 7.3.

1. **Write the function** in `attention-computation.jsx`:
   ```jsx
   export const ScoreNormalization = (ctx) => { ... };
   ```
2. **Add one line to config.js** and renumber the IDs that follow:
   ```js
   { id: "7.2", ..., component: "AttentionScores" },
   { id: "7.3", title: "Score Normalization", section: 7, component: "ScoreNormalization" },  // NEW
   { id: "7.4", ..., component: "KTranspose" },  // was 7.3
   ```
3. **Update the mapping table in this file** (CLAUDE.md) for the affected section.
4. **No other files change.** learn-ai.jsx auto-resolves from config.

## How To: Add a New Section

Example: insert a new Section 5 between current Sections 4 and 5.

1. **Create the file** (e.g., `src/sections/layer-norm.jsx`) with exported functions.
2. **Add one import + spread** in learn-ai.jsx's lookup object:
   ```jsx
   import * as LayerNorm from "./sections/layer-norm.jsx";
   const lookup = { ..., ...LayerNorm, ... };
   ```
3. **Add entries to config.js**, renumber section numbers and chapter IDs for
   all sections that shifted.
4. **Update the mapping tables and project structure in this file** (CLAUDE.md).
5. **No existing section files are renamed or modified.**

## How To: Reorder Chapters

Just reorder the entries in the `chapters` array in config.js. Update the mapping
table in this file (CLAUDE.md) to reflect the new order. Nothing else changes.

## Keeping CLAUDE.md in Sync

**Any change to section/chapter structure MUST be reflected in this file.** This includes:

- Adding, removing, or reordering chapters - update the mapping table for that section
- Adding or removing a section - update the mapping table AND the project structure tree
- Renaming a component function - update the mapping table entry
- Changing a chapter title - update the mapping table entry

This ensures any future Claude session has the correct mapping and can find the
right code immediately.

## Development

```bash
npm install
npm run dev          # Start dev server at localhost:5173/learn-ai/
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run test         # Run unit tests
npm run lint         # Lint source files
npm run format       # Format source files with Prettier
```


## Test-Driven Development (TDD) - MANDATORY

**Every code change MUST follow TDD.** No exceptions, no matter how small the change.

The workflow for any addition, deletion, or update is:

1. **Write the test first** - add or update tests in `src/__tests__/` that describe
   the expected behavior of the change. The test should fail at this point.
2. **Write the code** - implement the minimum code to make the test pass.
3. **Run tests** - `npm run test` must pass. Run `npx vitest run --coverage` to
   verify coverage.
4. **Refactor** - clean up while keeping tests green.

This applies to everything: new chapters, config changes, component updates, bug
fixes, style changes. If it touches source code, it gets a test first.

**NEVER skip this. Not for "just a style fix". Not for "one line". Not for a single
character change. ALWAYS: test first, code second. No exceptions.**

### Coverage targets

Current real coverage (no v8 ignore exclusions):
- **Lines: 100%** across all files
- **Branches: 97.7%** (remaining 2.3% are structurally unreachable defensive
  branches in config validation, Graph helper, and demo data ternaries)

Coverage must not decrease. Any new code must have corresponding tests.

### Test file organization

| Test file | What it covers |
|-----------|---------------|
| `config.test.js` | Config data integrity (unique IDs, required fields, section names) |
| `lookup.test.js` | Every config component exists as an exported function |
| `components.test.jsx` | ErrorBoundary, Box, T, Reveal, SubBtn, Tag |
| `nav-persistence.test.js` | saveNav/loadNav: config match, config change, corrupted data, localStorage errors |
| `sections.test.jsx` | All chapter functions at every sub level with interaction coverage |

## Key Design Decisions

- **Inline styles everywhere** - no CSS files or CSS-in-JS libraries. Styles are
  passed as `style={{}}` props directly on elements.
- **Dark theme** - background `#08080d`, light text. All colors are defined in
  the `C` object in config.js.
- **Mobile-first** - responsive sizing, viewport meta tag for mobile devices.
- **Navigation** - Prev/Next via side zones, keyboard arrows, and spacebar.
  Chapter state managed via `useState`.
- **Chapter context** - all chapter functions receive a `ctx` object with shared
  state (`sub`, `setSub`, `navigate`, `goTo`, `bankIdx`, `setBankIdx`, `hovered`,
  `setHovered`, `expanded`, `setExpanded`, `subBtnRipple`, `setSubBtnRipple`,
  `registerSubBtn`).
- **Error boundary** - chapter rendering is wrapped in `<ErrorBoundary>` to
  catch crashes gracefully without breaking the entire app.
- **Config validation** - in dev mode, config.js and the lookup object are
  validated at import time (duplicate IDs, missing components).

## Style Rules

- **No em-dashes** - never use the em-dash character anywhere in the codebase.
  Use `-` (hyphen) or rewrite the sentence instead.
- **Dot product notation** - use the middle dot, not the multiplication sign,
  when referring to dot products (e.g., Q followed by middle dot followed by K
  transpose, not Q times K transpose).
- **Always refer to chapters by their visible IDs** (e.g., "chapter 7.4"), never
  by internal function names in conversation with the user.

## Visual Design Rules - MANDATORY

Every chapter, sub-step, and visual in the app MUST follow these rules - whether
being added, updated, redesigned, or fixed. No exceptions. Do not wait for the
user to remind you.

- **Illustrative first** - every concept must be shown visually, not just
  described in text. Use colored bars, grids, split diagrams, progress bars,
  side-by-side comparisons, and inline calculations. Text alone is never enough.
- **Simple language, advanced content** - explain in plain language that a
  first-time learner can follow, but NEVER simplify the actual concept. Always
  show the real formula, the real math, the real mechanism. The goal is advanced
  understanding delivered through simple explanations - NOT watered-down
  versions of the truth. If a formula has gamma, beta, epsilon - show them all
  and explain what each does. If a step has edge cases - mention them. Never
  leave a concept incomplete because "it's too advanced." Instead, make the
  advanced content accessible through clear language, concrete numbers, and
  step-by-step breakdowns. The learner should walk away with knowledge they
  could use in a technical interview or research paper, not a vague intuition.
- **Build up piece by piece** - use progressive sub-steps (Reveal). Each click
  should add one clear idea. Never dump everything on screen at once.
- **Concrete over abstract** - always use real numbers, real words, real
  sentences. Never say "some value" or "a vector" when you can say "[0.8, 0.2]"
  or "cat's Query."
- **Show the WHY, not just the WHAT** - if something is split, scaled, or
  chosen, explain the tradeoff. Why 8 heads and not 16? Why split instead of
  duplicate? The reasoning matters as much as the mechanics.
- **Consistent example sentences** - use "I love cats" and "The cat sat on the
  mat last week" as running examples throughout. Reuse the same numbers so the
  learner sees how concepts connect across chapters.
- **Titles always center-aligned** - every Box title, sub-step title, or section
  heading inside a Box MUST use `center` (the T component's center prop). No
  exceptions. This applies to the first bold T element inside every Box.
- **Colored boxes, not invisible ones** - always use actual colors for Box
  (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
  NEVER use `Box color={C.card}` - it makes the box invisible against the dark
  background. Text inside a Box should use a matching lighter shade of the box
  color (e.g., `#80deea` for cyan, `#b8a9ff` for purple, `#ef9a9a` for red).
- **No next-chapter hints** - never reference upcoming chapters inside content
  (no "Next chapter:", "Coming up:", or "Preview:" text). Navigation is handled
  by the app shell.
- **Font sizes 16-20 for content** - body text should be 16-19px, titles 20-24px.
  Never use sizes below 14px except for tiny annotations. The attention sections
  are the gold standard for sizing.
- **Inner element pattern** - for highlighted sub-elements inside a Box, use
  tinted backgrounds: `background: \`\${color}06\``, `border: \`1px solid \${color}12\``,
  `borderRadius: 8`. Never use `opacity` on elements to create transparency -
  use hex alpha instead.

**The goal is advanced-level understanding through the most illustrative,
visual, and clear explanations possible.** Every formula must be the real
formula. Every computation must use the actual math. Every concept must be
complete - no "simplified versions" that leave out parameters, edge cases, or
nuance. The learner should walk away with knowledge accurate enough for a
research paper or technical interview. If a visual only describes something
in words when it could show it with a diagram, colored bars, a side-by-side
comparison, or a step-by-step calculation - it is not done yet. Always ask:
"Can I SHOW this instead of just TELLING it?" and "Is this the REAL formula
or a dumbed-down version?"

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Deploys the `dist/` folder to GitHub Pages

## Commit Conventions

- Use imperative mood ("Add chapter", not "Added chapter")
- Keep subject line under 72 characters
- **Never** add `Co-Authored-By` or any Claude/Anthropic attribution in commits
