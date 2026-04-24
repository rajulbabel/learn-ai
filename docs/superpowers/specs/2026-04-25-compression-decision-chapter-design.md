# Design: Chapter 11.19 "The Compression Decision"

**Date:** 2026-04-25
**Status:** Approved (awaiting implementation plan)

## Problem

Section 11 teaches five compression techniques (scalar quantization, product quantization, binary quantization, Matryoshka, IVF-PQ / HNSW-PQ stacks) in chapters 11.12-11.18, but never walks a learner through the decision of picking one for a real workload. The gap was exposed by a real question: "which quantization technique should I use for Qdrant + OpenAI text-embedding-3-large?" The honest answer depends on corpus size, embedding dimensionality, DB support, and recall tolerance — none of which are assembled into a single decision framework.

Existing decision cues are scattered:
- 11.15 (BinaryQuantization) has a dimensionality threshold table (BQ safe at d≥768).
- 11.14 (ProductQuantization) names m=96 the "production sweet spot" and flags 100M-1B as the HNSW+PQ range.
- 11.18 (HNSW+PQ) says "flip on compression when memory bites."
- 11.35 (DecisionFramework) lists four axes in its opening flowchart ("data size → ops → filter complexity → cost band") but only builds out three sub-steps, leaving the implicit fourth axis — compression — unwritten.

No chapter connects embedding model characteristics (dimensionality, MRL support), DB capability (pgvector is SQ-only, Pinecone hides compression, Qdrant supports all three with rescoring), and corpus size into a single "pick X when Y" framework.

## Solution

Add a new chapter **11.19 "The Compression Decision"** between current 11.18 HNSW+PQ and current 11.19 Filtering. Four sub-steps, medium scope, following the established visual patterns of Section 11.

## Architecture

### Placement

- **New chapter ID:** 11.19
- **Title:** The Compression Decision
- **Component function:** `CompressionDecision`
- **Section file:** `src/sections/vector-compression.jsx` (existing home for chapters 11.12-11.18; extending this file keeps all compression content co-located)
- **Position:** Pedagogically placed directly after the compression techniques and before production topics. Learners absorb the five techniques (11.12-11.18), then learn to pick among them (new 11.19), then move into filtering/updates/sharding (11.20+).

### Renumbering

Inserting at 11.19 shifts 17 chapter IDs from current 11.19-11.35 to 11.20-11.36. Section 11 chapter count grows from 35 to 36. Specifically:

| Old ID | New ID | Component |
|--------|--------|-----------|
| 11.19 | 11.20 | Filtering |
| 11.20 | 11.21 | UpdatesDeletes |
| 11.21 | 11.22 | Sharding |
| 11.22 | 11.23 | Replication |
| 11.23 | 11.24 | HybridSearch |
| 11.24 | 11.25 | Rerankers |
| 11.25 | 11.26 | MultiVectorRetrieval |
| 11.26 | 11.27 | EmbeddingLifecycle |
| 11.27 | 11.28 | Observability |
| 11.28 | 11.29 | CapacityPlanning |
| 11.29 | 11.30 | FAISS |
| 11.30 | 11.31 | Pgvector |
| 11.31 | 11.32 | Qdrant |
| 11.32 | 11.33 | Pinecone |
| 11.33 | 11.34 | QdrantVsPinecone |
| 11.34 | 11.35 | WeaviateMilvusChroma |
| 11.35 | 11.36 | DecisionFramework |

### Cross-reference migration

Inside JSX string literals, several chapters reference the affected IDs. All must be updated to the new numbers:

- 11.35 DecisionFramework's design-review checklist cites `chapter 11.19`, `chapter 11.20`, `chapter 11.22`, `chapter 11.27`, `chapter 11.28`, `chapters 11.30 - 11.34`, `chapter 11.26` — these need remapping.
- Any other chapter that points at 11.19-11.35 by number.
- Discovery: grep `/11\.(19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35)/` within JSX string literals in `src/sections/`.

### Files touched

- `src/sections/vector-compression.jsx` — add `CompressionDecision` export
- `src/config.js` — insert new entry, renumber 11.20-11.36
- `src/data/svg-descriptions.json` — add entries for new SVGs
- `src/__tests__/sections.test.jsx` — add cases for `CompressionDecision` at every sub level
- `src/__tests__/config.test.js` — update chapter-count assertion if present
- `CLAUDE.md` — update Section 11 mapping table
- Content cross-references as listed above

## Sub-step Structure (Components)

### Sub 0 — The problem and the four decision axes

**Framing:** "You now know five ways to compress. Which one? It depends on four inputs."

**The four axes:**

1. **Corpus size (N)** — the primary driver. Under 1M, nothing helps. Over 100M, compression is not optional.
2. **Embedding dimensionality (d)** — gates the binary-quantization branch. From 11.15's measured recall table, BQ needs d ≥ 768 to be production-safe.
3. **DB capability** — constrains the menu. pgvector mainline supports halfvec but not BQ/PQ; Pinecone abstracts compression; Qdrant/Weaviate/Milvus support the full suite with rescoring.
4. **Recall tolerance** — how much accuracy loss the product can absorb. High-stakes retrieval (medical, legal) downgrades one step from the default.

**Visual:** Box with a labeled diagram showing the four axes feeding into a "decision tree" node that outputs a compression stack. Color: cyan (matching 11.35's framing pattern).

### Sub 1 — The decision tree

**Orthogonal pre-step (applied before the tree):**

- **MRL truncation at embed time** — if the embedding model is Matryoshka-trained (OpenAI text-embedding-3 series, BGE-M3, some Cohere variants), pass `dimensions=1536` or `dimensions=1024` to the embed API. Free dim reduction, ~99% quality retention (MRL is trained to preserve nearest-neighbor structure on truncation). This happens at the OpenAI/Cohere API call, not in the DB.

**Main tree — N drives the primary branch, d and DB gate the BQ branch:**

| N range | Default output | Rationale |
|---------|----------------|-----------|
| N < 1M | **Skip quantization** (HNSW + fp32) | Full vectors fit in RAM on a cheap VM. Complexity not worth the tradeoff. |
| 1M ≤ N < 10M | **Scalar Quantization (int8)** | 4x memory cut, 1-3% recall loss. Safe default, broad DB support. |
| 10M ≤ N < 100M | **BQ + rescore** if `d ≥ 768` AND DB supports BQ+rescore; else **SQ** | 32x cut when gate holds. Falls back to SQ when d<768 (recall collapses per 11.15) or DB lacks BQ. |
| N ≥ 100M | **HNSW + PQ** (the production answer at scale, per 11.18) | Can layer SQ or BQ on top for extra compression. |

**DB-support gate table** (rendered as grid in chapter):

| DB | SQ | PQ | BQ + rescore |
|----|-----|-----|-------------|
| Qdrant, Weaviate | ✓ | ✓ | ✓ |
| Milvus | ✓ | ✓ | partial |
| pgvector | ✓ (halfvec) | ✗ (not in main) | ✗ |
| Pinecone | *managed* | *managed* | *managed* |

For pgvector, the tree collapses to "halfvec or nothing" regardless of N. For Pinecone, compression is abstracted — the only knob is MRL at embed time.

**Recall-tolerance override** — one downgrade step if recall must exceed 99%:
- BQ → SQ
- SQ → skip (or use halfvec on pgvector)
- PQ → keep but raise `m` (more sub-quantizers, less compression, more recall)

**Visual:** Single SVG flowchart in the 11.35 pattern. Start node at top labeled with the four inputs. Orthogonal MRL pre-step as a labeled branch-off note. Vertical decision flow with the four main branches as colored rectangles. BQ branch shows the `d ≥ 768 AND DB supports BQ+rescore` gate explicitly. Rounded rects, colored per bucket (green/yellow/orange/red matching size buckets). Uses existing C-palette colors from config.js. SVG has `<desc>` child with semantic search metadata.

### Sub 2 — Worked scenarios

Four realistic scenarios, each a card with three panels: **stack** (inputs) → **path** (tree branches hit) → **result** (memory numbers + final recommendation).

**Scenario 1 — Small startup (the "skip" path)**

- Stack: Qdrant + OpenAI text-embedding-3-large (d=3072) + N=500K
- Tree walk: MRL optional at this scale; N < 1M gate hits immediately
- Result: Skip quantization, HNSW + fp32. Memory: 500K × 12 KB = **6 GB RAM**. Fits on any dev box.

**Scenario 2 — Growing product (the high-leverage path)**

- Stack: Qdrant + OpenAI-3-large (d=3072 → 1536 via MRL) + N=50M
- Tree walk: MRL truncation halves memory upfront; N in 10M-100M; d ≥ 768 ✓; DB supports BQ+rescore ✓
- Result: MRL + BQ + rescore. Memory: fp32 = 300 GB → final = **~10 GB** (50M × 192 B). ~30x smaller; <2% recall loss.

**Scenario 3 — pgvector constrained (the "DB-gates-everything" path)**

- Stack: pgvector + BGE-small (d=384, not MRL) + N=5M
- Tree walk: No MRL; N in 1M-10M; default SQ; pgvector supports halfvec, not BQ/PQ
- Result: halfvec (fp16). Memory: fp32 = 7.7 GB → final = **3.8 GB**. 2x smaller. BQ off-limits even if d were large enough (it isn't at 384).

**Scenario 4 — Massive scale (the HNSW+PQ default)**

- Stack: Qdrant + OpenAI-3-small (d=1536 → 1024 via MRL) + N=200M
- Tree walk: MRL; N ≥ 100M gate hits
- Result: HNSW + PQ (m=96). Memory: fp32 = 820 GB → final = **~19 GB** (200M × 96 B). ~40x smaller.

**Visual:** Four cards in a responsive HTML grid (2×2 on wide screens, stacked on narrow), no SVG — follows the recap-matrix visual style used in 11.35's final sub-step (HTML grid of colored panels). Each card has three stacked panels: stack (inputs in monospace), path (tree branches hit as an ordered list of `if → branch` text with highlighted active branches), result (memory numbers and recommendation). Colors: green (skip), yellow (MRL+BQ), cyan (pgvector halfvec), orange (PQ at scale).

### Sub 3 — Closing heuristics

**Five rules of thumb, each with a one-line rationale:**

1. **Don't quantize until memory bites.** Under 1M vectors, complexity isn't worth the tradeoff — run fp32 and move on.
2. **MRL is free; always apply it first.** If the embedding model supports it, truncate at embed time. Halves downstream memory before the DB sees anything.
3. **DB first, compression second.** Pick the DB for ops/filter/SLA reasons, then pick compression from whatever menu that DB offers. pgvector shortens the menu to one option.
4. **Rescoring is nearly free; turn it on by default.** BQ without rescore loses ~5-10% recall; BQ with rescore loses <1%. The cost is one extra disk read per top-k candidate.
5. **Measure recall on your own data before committing.** Generic benchmark numbers assume generic data distributions. A 5-minute recall test on your corpus is worth more than any published table.

**Four traps to avoid:**

- BQ at d ≤ 256 — recall collapses to ~0.82 or worse per 11.15's measured table.
- Skipping MRL when available — leaving free compression on the table.
- Stacking SQ+PQ+BQ without measuring — each layer adds tuning surface.
- Trusting recall numbers that silently disable rescoring.

**Visual:** Two side-by-side panels. Left: "five heuristics" as green-tinted bullet cards. Right: "four traps" as red-tinted bullet cards. Mirrors the 11.35 checklist grid pattern.

## Testing

Following the mandatory TDD workflow from CLAUDE.md:

1. **Write tests first** in `src/__tests__/sections.test.jsx` — one test per sub-level (sub=0 through sub=3) asserting key visible text and that the decision-tree structure renders. Follow the existing pattern that already covers every chapter at every sub-level.
2. **Config tests** — `config.test.js` auto-passes once the new entry is added (unique ID, required fields, section name).
3. **Lookup tests** — `lookup.test.js` auto-passes once `CompressionDecision` is exported from `vector-compression.jsx`.
4. **SVG description tests** — add one entry to `src/data/svg-descriptions.json` for Sub 1's flowchart SVG (Sub 2 uses HTML grid, no SVG). `svg-descriptions.test.js` validates the manifest has entries for every SVG that exists in rendered output.
5. **Cross-reference migration** — grep for `"11.19"` through `"11.35"` inside JSX string literals in `src/sections/` and update to their new numbers. Covered by existing section-render tests.
6. **Coverage** — must not drop from 100% lines / 97.7% branches.

## Visual Design Rules

Every sub-step follows the mandatory rules from CLAUDE.md and `.claude/rules/sections.md`:

- Center-aligned Box titles (T component's center prop)
- Colored Box backgrounds (no `C.card`): cyan for sub 0, purple for sub 1 (the tree), varied colors per scenario in sub 2, green+red split in sub 3
- Text colors matching the box color (lighter shade)
- Real numbers throughout (no "some value")
- SVG `<desc>` metadata on every SVG
- 16-20px body text, 22-24px titles, no sub-14px except tiny annotations
- Inner elements use tinted backgrounds (`${color}06`) with 1px borders (`${color}12`)
- Standalone formulas/vectors in centered containers
- No em-dashes anywhere
- No next-chapter hints. Back-references to 11.15 (BQ recall table) and 11.18 (HNSW+PQ at scale) are allowed since they're factual pointers, consistent with existing patterns. No forward-references to chapters 11.20-11.36 in content.

## Scope Boundaries

**In scope:**
- The new 11.19 chapter with four sub-steps as specified
- Renumbering and cross-reference migration
- Tests, CLAUDE.md update, SVG manifest update

**Out of scope:**
- Reshaping 11.35 (now 11.36) DecisionFramework's opening flowchart — the existing "four axes" framing still works; no rewrite needed
- Adding new "when to use" sub-steps to 11.13-11.16 individually — the new chapter is the unified place; individual chapters already have enough situational guidance
- Covering exotic compression (FP8, ternary, learned codebooks) — sticks to the five techniques already in the curriculum
- Expanding the DB-capability matrix into a full feature table — that belongs in 11.29-11.35

## Open Questions (none blocking)

All scope decisions are settled. Implementation plan can proceed.
