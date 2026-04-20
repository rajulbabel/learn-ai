# Chapter 9.6 (KV Cache) - Revamp Design

Status: approved
Target file: `src/sections/attention-computation.jsx` (`KVCache` export)
Tests: `src/__tests__/sections.test.jsx` (`KVCache sub-steps` describe block)

## Why

The current chapter opens with dense matrix algebra (`Q = X · W_Q`, shapes `(N × d)`, formulas before intuition) and a beginner never recovers. The "why K and V, not Q" insight is the payoff of the chapter but arrives as formula manipulation, not a visual aha. The worked numerical example is solid but lands after too much abstract setup. The matrix-level argument, that only the last row of Scores and Output is new at each step, is never shown as an actual matrix picture.

Goal: a complete revamp that keeps the full technical depth but is structured so a beginner can follow. Every insight must be *seen*, not derived from formula.

## Running example

Keep "I love cats" (consistent with Chapters 6 and 7). Keep the `d = 2` worked example numbers from the current Sub 5. They are correct and compose well.

## Color assignment (adjacent subs never share a color)

| Sub | Color |
|-----|-------|
| 0   | cyan   |
| 1   | yellow |
| 2   | purple |
| 3   | blue   |
| 4   | green  |
| 5   | orange |
| 6   | pink   |
| 7   | red    |
| 8   | cyan   |

## Sub-step arc (9 subs total, 0-8)

Each sub follows one clear idea. Every sub uses a real visual (SVG or structured div), not just text.

### Sub 0 - The Problem: Naive Generation Redoes History

**Color:** cyan (`C.cyan`).

**Frame:** "To generate the next word, the naive approach re-processes every previous word. Watch the work pile up."

**Visual:** three horizontal "work rows", one per step of generating "I love cats". Each row has N colored blocks where N = step number. The rightmost block each row is green (new work for this step). Blocks left of it are red (redundant, exactly the same computation done in earlier steps).

- Step 1: `[new]` = 1 block
- Step 2: `[redundant][new]` = 2 blocks
- Step 3: `[redundant][redundant][new]` = 3 blocks

**Counter at bottom:**
- Total work done: 1 + 2 + 3 = 6 blocks
- Actually useful: 3
- Wasted: 3 (50%)
- "At 1000 tokens: 500,500 blocks of work, only 1000 useful. 99.8% wasted."

**Key takeaway (orange box):** "Naive generation recomputes identical numbers every step. This chapter shows the one-line fix that makes ChatGPT feel instant."

### Sub 1 - The Lightbulb: Same Input, Same Output, Always

**Color:** yellow (`C.yellow`).

**Frame:** "When we re-process 'I' at step 2, do we get the same numbers as we did at step 1?"

**Visual:** two stacked boxes side by side.
- Left box labeled "Step 1 computed": `q_I = W_Q · x_I = [0.5, 0.2]`
- Right box labeled "Step 2 re-computed": `q_I = W_Q · x_I = [0.5, 0.2]`
- Giant `=` sign between them
- Bold caption: "Identical. Every time."

**Why:** inline box showing "x_I doesn't change after step 1. W_Q doesn't change during inference. Same input with same weights = same output, ALWAYS."

**Insight box (green):** "So instead of recomputing, we just save the answer the first time. That's a cache."

### Sub 2 - The Matrix View: Only the Last Row Is New (star sub)

**Color:** purple (`C.purple`).

This sub is the star of the chapter. It shows the N^2 to N collapse geometrically.

**Frame:** "Attention is matrix multiplication. Let's draw the full matmul at step 3 and see what we actually need."

**Visual A - Scores matrix (SVG):**
- Left: `Q (3×d)` block, rows labeled `q_I`, `q_love`, `q_cats`. Rows `q_I` and `q_love` grayed with "already used" label. `q_cats` row glows purple.
- Middle: multiplication sign.
- Then: `Kᵀ (d×3)` block, columns labeled `k_I`, `k_love`, `k_cats`. All three columns in full color (all needed).
- Equals: `Scores (3×3)` block. Rows 1 and 2 grayed ("computed at steps 1, 2"), row 3 glows: `[q_cats · k_I, q_cats · k_love, q_cats · k_cats]`.
- Annotation arrow: "only this row is new. 3 dot products instead of 9."

**Visual B - Output matrix (SVG):**
- `Scores (3×3)` (rows 1, 2 grayed, row 3 glows) × `V (3×d)` (all three rows in full color) = `Output (3×d)` (rows 1, 2 grayed, row 3 glows as `out_cats`).
- Annotation: "only the last row of the output is what we need. Everything else was computed and discarded in previous steps."

**Counter box (yellow):**
- Without cache at step 3: 9 score cells + 9 output cells = **18 cells**
- Needed for new token: 3 scores + 3 output = **6 cells**
- Wasted: **12 (66%)**
- "N^2 blows up. With the cache, cost stays O(N)."

**Aha box (orange):** "In naive generation, the cost at each step grows as N^2. With the cache, it stays O(N). Now we just need to figure out what to save so we can skip the gray rows."

### Sub 3 - What to Save, What to Throw Away

**Color:** blue (`C.blue`).

**Frame:** "We compute three things per token: Q, K, V. Which old ones do we reuse?"

**Visual:** three vertical cards side by side (Q / K / V). Each card asks "do we need the OLD ones to compute the new output row?"

- **Q card (purple):** big red X. "Only the *new* q is used in the new output row. Old queries q_I, q_love are never used again. They're dead weight." Caption: "Don't cache."
- **K card (blue):** big green check. "The new row of Scores = q_new dot-product with every old K. Missing one key = missing one attention score." Caption: "Cache it."
- **V card (green):** big green check. "The new row of Output = weighted sum of every old V. Missing one value = losing that token's contribution." Caption: "Cache it."

**Name-reveal box (yellow):** "This is why it's called the **KV cache**. We save K and V, never Q."

### Sub 4 - The Cache: A Growing Notebook

**Color:** green (`C.green`).

**Frame:** "The cache is literally two tables that grow by one row at every step."

**Visual (SVG):** three frames side by side showing the state after each step.

- Frame 1 ("After 'I'"): K cache table with 1 row `[k_I]`, V cache with 1 row `[v_I]`.
- Frame 2 ("After 'love'"): 2 rows each. Row 1 dim (from cache), row 2 glowing (just appended).
- Frame 3 ("After 'cats'"): 3 rows each. Rows 1-2 dim, row 3 glowing.

Arrow between frames labeled "append one row".

**Caption box (orange):** "One append per step. The existing rows don't move, don't change, don't get recomputed. They just sit there in memory."

### Sub 5 - Before vs After: Step 3 Side by Side

**Color:** orange (`C.orange`).

**Frame:** "Let's see step 3 (generating 'cats') with and without the cache. Identical output, different amounts of work."

**Visual:** two-column layout.

- **Left (red tint): Without cache.** Lists all 9 projections (q_I, q_love, q_cats, k_I, k_love, k_cats, v_I, v_love, v_cats), 6 of which are crossed out as "wasted". Full N×N matmul labeled "9 score cells, only 3 used". Footer: "9 projections + 9 score cells + 3 output rows. 15 wasted operations."
- **Right (green tint): With cache.** Cache read: K_cache = [k_I, k_love], V_cache = [v_I, v_love]. Compute only: q_cats, k_cats, v_cats (3 projections). Append k_cats, v_cats. Vector-matmul q_cats · Kᵀ = 3 scores. Weighted sum with V = 1 output row. Footer: "3 projections + 3 score cells + 1 output row. 0 wasted operations."

**Equality box (cyan):** "The output vector for 'cats' is identical in both. Same numbers come out. The cache just changes where they come from (recompute vs memory read)."

### Sub 6 - Trace It with Real Numbers

**Color:** pink (`C.pink`).

Keep the current d=2 worked example but reorganize so the cache table is visible as it grows. Three horizontal panels (Step 1, Step 2, Step 3), each showing:

1. **Input** embeddings (`x_I = [1.0, 0.0]`, etc.)
2. **New computations** for this step (q, k, v for the new token only; step 1 has just one token)
3. **Cache state** after append (growing K and V tables in blue/green)
4. **At step 3 only:** full attention computation including scores, softmax `[0.329, 0.338, 0.333]`, weighted sum, final `output_cats = [0.447, 0.603]`.

**Closer (red box):** "Identical output numbers with or without cache. The cache just makes it fast."

### Sub 7 - The Cost: 10.7 GB Per Conversation

**Color:** red (`C.red`).

**Frame:** "The cache isn't free. Each model + sequence length has a specific memory cost."

**Formula box:** `cache = 2 (K+V) × layers × d_model × seq_len × bytes_per_param`

**Visual:** horizontal memory-bar. LLaMA 70B parameters listed (80 layers, d_model 8192, seq_len 4096, FP16 = 2 bytes). Computation trace: `2 × 80 × 8192 × 4096 × 2 = 10.7 GB`. Bar fills as seq_len grows: 1024 tokens ~= 2.7 GB, 4096 ~= 10.7 GB, 32768 ~= 86 GB.

**Scaling box (orange):** three mini-rows:
- 1 user: 10.7 GB
- 10 users: 107 GB
- 100 users: 1,070 GB

**Why this matters (red box):** "Long-context models (128K tokens) consume enormous memory. Each concurrent user needs their own cache. This is *why serving LLMs is expensive*, and why techniques like GQA exist to shrink it."

### Sub 8 - The Deal: Memory for Speed

**Color:** cyan (`C.cyan`).

**Frame:** "The KV cache trades memory for speed. Here's the final ledger."

**Visual:** two-column "balance" comparison.

- **Without cache:** Speed X (slow, O(N^2) per step, O(N^3) total), Memory check (low)
- **With cache:** Speed check (fast, O(N) per step, O(N^2) total), Memory X (GB-scale)

**Numbers row (yellow):** "At 1000 tokens: ~333 million ops without cache vs ~500 thousand with cache. ~**660x faster**."

**Closer (cyan box):** "Every fast LLM you've ever used runs on this trick. Without it, ChatGPT would take minutes per response instead of seconds."

**Note (purple, small):** "The cache only exists at inference time. During training, all tokens are processed in parallel. No need for a cache."

## SVG visualizations - what's needed

Four new SVGs fit naturally into this arc. Each gets a `<desc>` element as first child and a matching entry in `src/data/svg-descriptions.json`.

1. **Sub 0 - Piling work bars.** Three rows of colored squares, growing left to right. Green = new, red = redundant. ~480px wide.
2. **Sub 2 - Matrix view.** Two side-by-side matmul diagrams: (a) Q · Kᵀ = Scores with rows dimmed, (b) Scores · V = Output with rows dimmed. Boxes with labeled rows/columns. Arrows pointing to "the only new row".
3. **Sub 4 - Growing notebook.** Three frames of K and V tables, growing by one row each frame. Arrows labeled "append".
4. **Sub 7 - Memory bar.** Horizontal bar filling with gradient, tick marks at 1K / 4K / 32K tokens with GB values.

Subs 1, 3, 5, 6, 8 use styled divs. Sufficient for their visual content.

## Styling / rule compliance

Confirm against `.claude/rules/sections.md` and `CLAUDE.md`:

- Every Box title uses `center` prop on the first T element.
- No `Box color={C.card}`. Each sub has its own color (see color table above).
- No em-dashes anywhere. Hyphens only.
- Body text 16-19px, titles 20-24px.
- Inner tinted-background pattern: `background: \`${color}06\``, `border: 1px solid ${color}12`.
- Standalone formulas and vector displays centered with `textAlign: "center"` on the container div.
- Every `<svg>` starts with `<desc>...</desc>` child.
- Entries added to `src/data/svg-descriptions.json` for each new SVG.
- Dot product notation uses middle dot `·`, never `*` for dot products.
- No "next chapter" hints anywhere.

## Tests

The `describe("KVCache sub-steps", ...)` block in `sections.test.jsx` must be rewritten. Per-sub assertions:

- sub 0: text includes "Naive" or "naive", "waste" or "wasted", "I", "love", "cats"; at least 6 work-block elements rendered (1+2+3 = 6)
- sub 1: text includes "Same" or "same", "W_Q", "q_I"; two identical `[0.5, 0.2]` vectors shown
- sub 2: SVG rendered; text includes "last row", "6", "18"; desc element present; matrix labels q_I, q_love, q_cats appear
- sub 3: text includes "cache", "Q", "K", "V"; one red-X card and two green-check cards
- sub 4: SVG rendered; text includes "append", "one row"; desc element present
- sub 5: text includes "Without" or "without", "With", "identical"
- sub 6: text includes "0.447", "0.603", "cache"
- sub 7: text includes "LLaMA 70B", "10.7 GB", "layers", "d_model"
- sub 8: text includes "memory", "speed", "660"

Plus: SVG description manifest test must pass after adding 4 new entries (unique IDs across the manifest).

## Out of scope

- Do NOT change Chapter 9.7 (Grouped-Query Attention). It's the follow-up and references this chapter's framing.
- Do NOT touch the `config.js` chapter list. The chapter ID and title stay as "9.6 - KV Cache - Why Inference is Fast".
- Do NOT rename the `KVCache` export or its file.
