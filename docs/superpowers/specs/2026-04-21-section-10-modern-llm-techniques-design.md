# Section 10: Modern LLM Techniques - Design

**Date:** 2026-04-21
**Status:** Design approved, ready for implementation plan

## Overview

Add a new Section 10 "Modern LLM Techniques" to the learn-ai app. This section groups together the post-vanilla-transformer tricks production LLMs rely on: inference efficiency (KV Cache, GQA), architectural scaling (Mixture of Experts), and the training recipes that unlock reasoning (Thinking).

Two existing chapters (KV Cache, Grouped-Query Attention) move into the new section from Section 9. Two new chapters (Mixture of Experts, Thinking) are authored from scratch.

## Motivation

Sections 1-9 teach the vanilla decoder-only transformer as it existed around 2017-2022. Modern production LLMs (2023-2025) rely on a handful of techniques that sit on top of that baseline: MoE scales parameter count without scaling per-token compute; reasoning models unlock multi-step problem solving via RL. Learners who finish Section 9 know how a transformer works but not how Mixtral, DeepSeek-V3, or o1-class models actually differ. Section 10 closes that gap.

## Section metadata

| Field | Value |
|---|---|
| Section number | 10 |
| Section name | "Modern LLM Techniques" |
| Section color | `#26a69a` (teal) |
| Placement | After Section 9 ("The Decoder") |

Teal is visually distinct from all existing section colors (red, cyan, yellow, purple, orange, green, pink, blue, red).

## Chapter list

| ID | Title | Component | Source file | Action |
|---|---|---|---|---|
| 10.1 | KV Cache - Why Inference is Fast | `KVCache` | `attention-computation.jsx` (unchanged) | **Move** from 9.6 |
| 10.2 | Grouped-Query Attention - Shrinking the KV Cache | `GroupedQueryAttention` | `attention-computation.jsx` (unchanged) | **Move** from 9.7 |
| 10.3 | Mixture of Experts - Bigger Model, Same Compute | `MixtureOfExperts` | new `modern-llm-techniques.jsx` | **Add** |
| 10.4 | Thinking - How Reasoning Models Work | `Thinking` | new `modern-llm-techniques.jsx` | **Add** |

Titles for 10.1 and 10.2 remain unchanged from their current 9.6/9.7 titles.

## Section 9 renumbering

Moving 9.6 and 9.7 out leaves Section 9 more tightly focused on decoder fundamentals. The two encoder-decoder flow chapters shift up.

| New ID | Title | Previous ID |
|---|---|---|
| 9.1 | Decoder-Only - How Modern LLMs Work | 9.1 (unchanged) |
| 9.2 | Causal Masking - Hiding the Future | 9.2 (unchanged) |
| 9.3 | Cross-Attention - The Encoder-Decoder Bridge | 9.3 (unchanged) |
| 9.4 | The Output Head - Linear + Softmax | 9.4 (unchanged) |
| 9.5 | What is a Transformer Actually Doing? | 9.5 (unchanged) |
| 9.6 | Encoder-Decoder: The Training Flow | 9.8 |
| 9.7 | Encoder-Decoder: The Inference Flow | 9.9 |

## File changes

```
NEW:
  src/sections/modern-llm-techniques.jsx
      export const MixtureOfExperts = (ctx) => { ... }
      export const Thinking = (ctx) => { ... }

MODIFIED:
  src/config.js
      Renumber Section 9: remove 9.6/9.7, shift 9.8→9.6, 9.9→9.7
      Add Section 10: four entries (10.1-10.4)
      Add section 10 to sectionNames and sectionColors
  src/learn-ai.jsx
      import * as ModernLLMTechniques from "./sections/modern-llm-techniques.jsx";
      Add ...ModernLLMTechniques to the lookup object
  CLAUDE.md
      Update Section 9 mapping table (rows shift)
      Add Section 10 mapping table
      Update project structure tree
  src/data/svg-descriptions.json
      Add entries for every new SVG (see SVG section below)

UNCHANGED (content):
  src/sections/attention-computation.jsx
      KVCache and GroupedQueryAttention functions remain verbatim
      (per user instruction: move location only, content does not change)
```

## Chapter 10.3: MixtureOfExperts

**Running example:** the token "cat" from the sentence "I love cats" (matches app convention).

**Sub-step structure (indices 0-7, 8 total):**

### Sub 0 - Motivation (`C.purple`)

Title: "The problem - more brain, same effort per token"

Visual: two side-by-side cards.
- Dense 47B model: all 47B params active per token.
- MoE (Mixtral 8×7B): 47B params total, only ~13B active per token.

Plain-English hook: "What if most of the brain could nap while the relevant part does the work?"

### Sub 1 - The core swap (`C.cyan`)

Title: "Replace one FFN with a router + N expert FFNs"

Visual: two stacked transformer-block diagrams (before vs after).
- Before: standard FFN inside the block.
- After: FFN slot becomes Router → top-k experts → weighted sum.

Key point: each "expert" is just a copy of the FFN architecture with independent learned weights.

### Sub 2 - Top-k routing (`C.green`)

Title: "Each token picks its top 2 experts"

Concrete worked example using token "cat":
```
  router_scores = softmax(cat · W_router)
                = [0.03, 0.02, 0.80, 0.01, 0.04, 0.05, 0.02, 0.03]
                    E1    E2    E3   E4    E5    E6    E7    E8

  top-2:  E3 (0.80) and E6 (0.05)
  normalize:  E3 weight = 0.80/0.85 = 0.94
              E6 weight = 0.05/0.85 = 0.06

  output = 0.94 · E3(cat) + 0.06 · E6(cat)
```

Side note: router is tiny (`d_model × num_experts` = 4096 × 8 = 32K params).

### Sub 3 - Load balancing (`C.yellow`)

Title: "Without a fix, one expert hogs everything"

Visual: two expert-usage histograms side by side.
- Without auxiliary loss: Expert 3 gets 92%, others starve.
- With auxiliary loss: roughly 12.5% each.

Centered formula:
```
  L_aux = α · N · Σ (f_i · P_i)
```

Explanation: `f_i` is fraction of tokens routed to expert i; `P_i` is router probability mass to expert i. Minimized when routing is balanced.

### Sub 4 - Parameter math: Mixtral 8×7B (`C.orange`)

Title: "Why it's called 8×7B but totals 47B, not 56B"

Layer breakdown:
```
  Per layer:
    Attention block:        ~350M
    8 experts × ~650M each: ~5.2B
    Router + norms:         ~50K (negligible)
    ──────────────────────
    Per layer total:        ~5.6B

  × 32 layers + shared embeddings = 46.7B total

  Active per token:
    Attention:               350M
    2 of 8 experts:          1.3B per layer
    × 32 layers + embeds = ~13B active
```

Key point: attention is shared across experts, so "8×7B" totals 47B (not 56B).

### Sub 5 - Memory vs compute tradeoff (`C.red`)

Title: "Memory holds all experts. Compute only runs two."

Visual: two horizontal bars.
- GPU memory: 47B × 2 bytes (fp16) = 94 GB (all experts must be loaded).
- Compute per token: 13B × 2 = 26 GFLOPs (only 2 experts run).

Honest takeaway: MoE trades memory for compute. Great for data-center serving, bad for edge deployment.

### Sub 6 - Real examples (`C.blue`)

Title: "MoE models in production"

Table:

| Model | Total | Active | Experts | Routing |
|---|---|---|---|---|
| Mixtral 8×7B | 47B | 13B | 8 | top-2 |
| Mixtral 8×22B | 141B | 39B | 8 | top-2 |
| DeepSeek-V3 | 671B | 37B | 256 (+1 shared) | top-8 |
| Qwen3-Next | 80B | 3B | 512 | top-10 |

Callout: DeepSeek-V3 activates only 5.5% of params per token.

### Sub 7 - When MoE wins (`C.pink`)

Title: "MoE is not free lunch"

| ✓ Wins | ✗ Struggles |
|---|---|
| Large-scale data-center training | Edge/on-device deployment |
| High-throughput serving (many users) | Small-batch single-user inference |
| Compute-constrained + memory-rich | Memory-constrained environments |
| Model capacity matters more than latency | Latency-critical apps |

Summary: "If you can afford memory but not compute, MoE is the answer."

### SVGs needed for 10.3

- Transformer block before/after diagram (sub 1) — JSX `<desc>` + entry in svg-descriptions.json
- Expert load histograms (sub 3) — same

## Chapter 10.4: Thinking

**Running example:** `23 × 47`, known answer `1081`. Clean, verifiable, matches the kind of problem reasoning models are trained on.

**Sub-step structure (indices 0-9, 10 total):**

### Sub 0 - Before/after demo (`C.cyan`)

Title: "A regular LLM vs a reasoning LLM on the same problem"

Visual: two side-by-side cards for the prompt `What is 23 × 47?`.
- Regular LLM: emits `1081` directly (~3 tokens).
- Reasoning LLM: emits `<think>Let me compute. 23 × 47 = 23 × (50 − 3) = 1150 − 69 = 1081. Verify: 20×47 + 3×47 = 940 + 141 = 1081 ✓</think>1081` (~120 tokens).

Hook: "The answer is the same. The process is what changed."

### Sub 1 - Same architecture, zero new parts (`C.purple`)

Title: "Every piece you learned in Sections 1-9 is unchanged"

Visual: a grid of checkmarks, each transformer component marked "unchanged."

Components listed: Tokenizer, Embeddings, Positional encoding, Causal mask, KV cache, Softmax, Multi-head attention, FFN, Layer norms, Residual connections, Output head, Autoregressive loop.

Callout: "A reasoning model and a regular LLM could share the same code file."

### Sub 2 - The loop clarifier (`C.green`)

Title: "Not a new loop. The same loop, running longer."

Visual: two vertical chains of FWD-pass boxes.
- Regular: 3 FWD boxes → `"1081"`
- Reasoning: 120 FWD boxes → `<think>...</think>1081`

Directly counter the misconception: "Both modes loop. Thinking just loops more times before stopping."

### Sub 3 - The `<think>` / `</think>` tokens (`C.yellow`)

Title: "How the model switches between thinking and answering"

Visual: token-probability snapshots at two moments.

```
  After "User: What is 23 × 47? Assistant:"
    "<think>"    → 0.87   ← winner
    "1081"       → 0.03
    "The"        → 0.02

  Inside thinking, after "... = 1081 ✓"
    "</think>"   → 0.62   ← winner (done thinking)
    "Let"        → 0.09
    "Also"       → 0.07
```

Callout: "There is no mode switch in the code. The model learned to emit `<think>` and `</think>` at the right moments."

### Sub 4 - Test-time compute (`C.orange`)

Title: "More thinking tokens = better answers on hard problems"

Visual: horizontal bar chart (representative accuracy on hard-math tasks).

```
  100 tokens       ▮▮                   30%
  1,000 tokens     ▮▮▮▮▮                55%
  10,000 tokens    ▮▮▮▮▮▮▮▮▮            78%
  100,000 tokens   ▮▮▮▮▮▮▮▮▮▮▮▮▮        89%
```

Note: numbers are illustrative rather than cited from a specific paper. Label visual as "representative" to stay accurate.

Takeaway: "For decades, better AI meant a bigger model. Reasoning models added a second knob - spend more compute at inference time instead."

### Sub 5 - The 3-stage training pipeline (`C.pink`)

Title: "What is actually different is the training, not the model"

Visual: three horizontal pipeline boxes.

```
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │ Pre-training │ →  │ SFT on       │ →  │ RL with      │
  │ (unchanged)  │    │ reasoning    │    │ verifier     │
  │              │    │ traces       │    │ (the magic)  │
  └──────────────┘    └──────────────┘    └──────────────┘
    trillions of       ~50K curated        ~millions of
    tokens             reasoning examples  problem rollouts
```

Only SFT data and RL are new. Pre-training run is literally the same.

### Sub 6 - Zoom into the RL reward loop (`C.red`)

Title: "How reasoning improves, one reward at a time"

Visual: reward loop with concrete rollouts.

```
  Problem: "23 × 47 = ?"   (ground truth: 1081)
         │
         ▼
  Generate 64 rollouts. Example 5:
    Rollout 1: <think>... = 1081</think> 1081   ✓  reward = +1
    Rollout 2: <think>... = 1081</think> 1081   ✓  reward = +1
    Rollout 3: <think>... guess 1000</think>    ✗  reward = -1
    Rollout 4: <think>... = 1081</think> 1081   ✓  reward = +1
    Rollout 5: <think>... 1104</think>          ✗  reward = -1
         │
         ▼
  PPO/GRPO weight update:
    Tokens in winning rollouts → probability UP
    Tokens in losing rollouts  → probability DOWN
```

Crucial callout: "The reward only checks the FINAL answer. The model figures out what kinds of reasoning lead to correct answers - nobody hand-labels reasoning steps."

### Sub 7 - Where training data comes from (`C.blue`)

Title: "You do not need humans to write millions of reasoning traces"

Visual: three source cards.
1. Existing chain-of-thought - textbooks, Stack Overflow, tutorials, already in pre-training data.
2. Synthetic generation - big LLM generates 64 attempts, verifier filters correct ones.
3. Rejection sampling - model tries a problem 64 times, we keep attempts that got it right.

Key realization: "We only need problems with checkable answers. Millions exist: GSM8K, MATH, AIME, LeetCode, Codeforces."

### Sub 8 - Emergent behaviors (`C.purple`)

Title: "The tricks nobody programmed"

Visual: a sample reasoning trace with inline highlights for emergent behaviors.

```
  23 × 47 = 23 × 50 − 23 × 3 = 1150 − 69 = 1081.

  Wait, let me double-check.                   ← emerged: self-doubt

  Try another way: 20 × 47 + 3 × 47            ← emerged: verification
                 = 940 + 141 = 1081.

  Both methods give 1081. Confident.           ← emerged: confidence
```

Big-picture callout: DeepSeek-R1 papers documented an "aha moment" during training where thinking length spontaneously grew and phrases like "wait" and "let me reconsider" appeared - purely from the reward signal.

### Sub 9 - When thinking wins (`C.green`)

Title: "Reasoning models are not universally better"

Table:

| ✓ Big lift | ✗ No real gain |
|---|---|
| Math, arithmetic, algebra | Creative writing |
| Competitive programming | Poetry, storytelling |
| Logic puzzles | Open-ended opinions |
| Scientific Q&A with verifiable answers | Empathy, emotional support |
| Constraint-satisfaction problems | Summarization |
| Formal proofs | Casual conversation |

Summary: "Reasoning helps when there is a right answer to check. It barely helps when there is not."

### SVGs needed for 10.4

- "Unchanged checklist" grid of transformer components (sub 1)
- Autoregressive loop chains (sub 2)
- Three-stage training pipeline (sub 5)
- RL reward loop with rollouts (sub 6)
- Training data source cards (sub 7)

Each needs an inline `<desc>` child or a `desc` prop passed to the Graph component, plus a corresponding entry in `src/data/svg-descriptions.json`.

## Testing approach (TDD - mandatory)

Per `CLAUDE.md`, every code change follows TDD. Tests written first, implementation second.

### Test files to modify

| File | Changes |
|---|---|
| `src/__tests__/config.test.js` | Section 10 entries validate (IDs 10.1-10.4 unique, required fields present, section name matches, section color present). Section 9 entries still valid after renumber. |
| `src/__tests__/lookup.test.js` | `MixtureOfExperts` and `Thinking` resolve from the lookup object (both exported from `modern-llm-techniques.jsx`). |
| `src/__tests__/sections.test.jsx` | Render `MixtureOfExperts` at every sub level (0-7). Render `Thinking` at every sub level (0-9). Interaction coverage for any buttons/toggles introduced. |
| `src/__tests__/svg-descriptions.test.js` | Every new SVG ID has a non-empty description in the manifest. |

Coverage must not decrease. Target: 100% lines, ≥97.7% branches.

## Visual design compliance checklist

Every chapter and sub-step must comply with `.claude/rules/sections.md` and the Visual Design Rules in `CLAUDE.md`:

- [ ] Every Box title uses `center` prop on the `T` component.
- [ ] Every Box uses an actual color, never `C.card`. Text inside a Box uses the matching lighter shade.
- [ ] No em-dashes anywhere. Hyphens only.
- [ ] Dot product notation uses the middle dot, not `×`.
- [ ] Body text 16-19px; titles 20-24px. No sizes below 14px except annotations.
- [ ] Inner tinted elements use `${color}06` background and `1px solid ${color}12` border.
- [ ] Standalone formulas/computations use `textAlign: "center"` on the container.
- [ ] Every `<svg>` has a `<desc>` child as its first element (or a `desc` prop on the Graph component, or a `desc("...")` call for imperative SVGs).
- [ ] Every new SVG has a corresponding entry in `src/data/svg-descriptions.json`.
- [ ] No chapter references "next chapter" or "coming up."
- [ ] Reveal is used for progressive sub-steps. Each click adds one idea.
- [ ] Concrete numbers and real examples everywhere (no placeholder "some value").
- [ ] Illustrative visuals for every concept (colored bars, grids, diagrams, side-by-sides), not text alone.

## Out of scope

The following were considered but are deferred for a future update:

- **Flash Attention** - fits naturally in Section 7 after `7.16 CompletePicture` as a "same math, faster on real GPUs" epilogue. Not included here per user's 4-chapter scope.
- **Sliding Window Attention** - fits in Section 9 alongside Causal Masking. Deferred.
- **PagedAttention, Speculative Decoding** - both inference optimizations; good candidates for a future extension of Section 10.
- **Quantization (Q4/Q8)** - different enough in concept (post-training numerical compression) to deserve its own future section.
- **LoRA / PEFT** - training-time parameter efficiency; better fits a fine-tuning section.

## Implementation order

When the implementation plan is written, suggested order:

1. **Renumber + move (the mechanical step).** Update `config.js`, `learn-ai.jsx`, `CLAUDE.md` to reflect Section 10 + new Section 9 order. Tests: existing `KVCache` and `GroupedQueryAttention` still render at new IDs.
2. **Add `MixtureOfExperts`.** Create `modern-llm-techniques.jsx` with the function stub. TDD: write render + sub-level tests first, then fill in sub-steps one at a time.
3. **Add `Thinking`.** Same pattern.
4. **Final pass:** CLAUDE.md mapping tables, svg-descriptions.json entries, coverage check, lint/format.

## Open questions

None at design-lock. All questions resolved during brainstorming:
- Section name: "Modern LLM Techniques" (option B).
- Chapter count: 4.
- MoE scope: one chapter, 8 sub-steps.
- Thinking scope: one chapter, 10 sub-steps.
- Running examples: "cat" (MoE), `23 × 47` (Thinking).
- Content for 10.1 / 10.2: move only, no content changes.
