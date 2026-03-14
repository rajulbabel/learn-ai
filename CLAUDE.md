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

**LearnAI.jsx** builds a lookup object from all section imports and resolves the
active chapter at render time - there is no manually maintained chapter array.

```jsx
const lookup = { TOC, ...NeuralFoundations, ...LLMTraining, ... };
const renderChapter = lookup[chapters[ch].component];
// render: {renderChapter(ctx)}
```

### Naming Convention

| Concept | Where | Naming rule | Example |
|---------|-------|-------------|---------|
| Section file | `src/sections/` | kebab-case, topic name | `attention-computation.jsx` |
| Chapter function | named export in section file | PascalCase, topic name | `WhySoftmax` |
| Chapter ID | `chapters` array in config.js | `section.chapter` number | `"7.4"` |

Function names and file names describe **what the content is about**. They never
contain numbers and never need to be renamed when chapters are reordered or inserted.
Only config.js IDs change.

### Complete Mapping

**Section 1: Neural Network Foundations** (`neural-foundations.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 1.1 | WhatIsNN | What is a Neural Network? |
| 1.2 | FeedForward | Feed-Forward Neural Network |
| 1.3 | WhatIsLearning | Learning - What Does it Mean? |
| 1.4 | WeightsBiases | Weights & Biases - The Knobs |
| 1.5 | ReLU | Activation (ReLU) - Why Layers Need a Bend |
| 1.6 | ForwardPass | Forward Pass - Making a Prediction |
| 1.7 | LossFunction | Loss - How Wrong Were We? |
| 1.8 | Derivatives | Derivatives - The Core Intuition |
| 1.9 | BackwardPass | Backward Pass - The Chain Rule |
| 1.10 | GradientDescent | Gradient Descent - Fixing the Weights |

**Section 2: How LLMs Actually Train** (`llm-training.jsx`)

| Chapter | Component | Title |
|---------|-----------|-------|
| 2.1 | Tokenization | Tokenization - From Words to Numbers |
| 2.2 | SelfSupervised | Self-Supervised Learning - How GPT Trains |
| 2.3 | CrossEntropy | Cross-Entropy Loss - The LLM Score |
| 2.4 | SFT | Supervised Fine-Tuning (SFT) |
| 2.5 | RLHF | RLHF - Making AI Helpful & Safe |
| 2.6 | BatchTraining | Batch Training - Why Not One Example at a Time? |

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
│   ├── LearnAI.jsx                       # Shell: state, navigation, layout
│   ├── components.jsx                    # Shared components (Box, T, Reveal, SubBtn, Tag, ErrorBoundary)
│   ├── config.js                         # chapters array, sectionNames, sectionColors, colors (C)
│   ├── __tests__/                        # Unit tests (vitest)
│   │   ├── config.test.js               # Config validation tests
│   │   └── lookup.test.js               # Component lookup tests
│   └── sections/
│       ├── toc.jsx                       # Table of Contents
│       ├── neural-foundations.jsx         # Section 1
│       ├── llm-training.jsx              # Section 2
│       ├── scaling.jsx                   # Section 3
│       ├── road-to-transformers.jsx      # Section 4
│       ├── transformer-input.jsx         # Section 5
│       ├── attention-qkv.jsx             # Section 6
│       └── attention-computation.jsx     # Section 7
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
4. **No other files change.** LearnAI.jsx auto-resolves from config.

## How To: Add a New Section

Example: insert a new Section 5 between current Sections 4 and 5.

1. **Create the file** (e.g., `src/sections/layer-norm.jsx`) with exported functions.
2. **Add one import + spread** in LearnAI.jsx's lookup object:
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

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Deploys the `dist/` folder to GitHub Pages

## Commit Conventions

- Use imperative mood ("Add chapter", not "Added chapter")
- Keep subject line under 72 characters
- **Never** add `Co-Authored-By` or any Claude/Anthropic attribution in commits
