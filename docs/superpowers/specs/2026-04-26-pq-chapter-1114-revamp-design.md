# Chapter 11.14 Product Quantization - Visual + Prose Revamp

## Context

Chapter 11.14 (`ProductQuantization` in `src/sections/vector-compression.jsx`) currently has:

- 7 sub-steps with the right conceptual story
- Almost no actual diagrams - mostly text + monospace formula boxes
- Dense compound prose where the punchline is buried at the end in italics
- Jargon ("slot", "asymmetric", "decorrelated") introduced before its concrete meaning is shown

The user's complaint: "a user has to read it multiple times to get the right idea."

## Goal

Rewrite all prose and add a hero SVG diagram per sub-step so a first-time reader understands PQ on a single pass. Keep all content, depth, and scope. No conceptual cuts.

## Non-goals

- No restructuring of the 7-step skeleton (the story is right)
- No animation - static SVGs only
- No interactive controls - reveals stay click-through

## Style template (every sub-step)

```
┌─────────────────────────────────────────┐
│  HOOK (bold, centered, 22px)            │  ← punchline up front
│  [BIG SVG DIAGRAM - the visual proof]   │
│  Two short paragraphs of plain prose.   │  ← anchored AFTER the picture
│  ┌─ formula / numbers (centered) ─┐    │  ← rigor in dark box
│  one-line italic takeaway               │  ← what to remember
└─────────────────────────────────────────┘
```

Box colors stay as-is: cyan, yellow, green, orange, red, purple, pink (one per sub-step).

## Per sub-step spec

### Sub 0 - Cut one fat vector into 96 small ones (cyan)

**Hook**: "Cut one fat vector into 96 small ones"

**SVG (`pq-split-overview`)**:
- Width 720, height 280
- Top: a long horizontal bar of 96 cells representing the 768-dim vector. First 4 segments rendered in vivid cyan with slot labels (slot 0, slot 1, slot 2, slot 3). Last segment labeled slot 95. Middle segments fade to indicate continuation.
- Annotation arrow from segment 0 down to a labeled "8 dims (dims 0-7)".
- Below: 3 stacked rows labeled "doc 1", "doc 2", "doc 3" - same banded layout, all aligned at the same slot boundaries.
- Right-side bracket spanning the slot-0 column across all 3 rows: "slot 0 of every doc".
- `<desc>`: "Splitting a 768-dim vector into 96 slots of 8 dims each, showing slot alignment across multiple documents."

**Prose**:
> A 768-dim embedding is too fat to compress as a single thing. PQ's first move is to chop it into 96 small pieces, 8 dims each. We call each piece a **slot**.
>
> Why slots matter: every slot gets its own dictionary. Slot 0's dictionary only has to describe the patterns that appear in dims 0-7 across the whole corpus. That's a much easier job than describing all 768 dims at once.

**Numbers box**: `d = 768  ·  m = 96  ·  d/m = 8 dims per slot`

**Italic takeaway**: "One vector becomes 96 mini-problems. Each one is small enough to compress hard."

### Sub 1 - Each slot learns a 256-word dictionary (yellow)

**Hook**: "Each slot learns its own 256-word dictionary"

**SVG (`pq-codebook-scatter`)**:
- Width 720, height 360
- A 2-D scatter plot (caption: "slot 0 is 8-D - drawn as 2-D for clarity")
- ~150 small dim dots representing slot-0 sub-vectors from the corpus
- 16 large yellow centroid markers (representing 256 - "16 of 256 shown") with id labels c0, c1, c5, c17, c42, c89, c142, c201, c255
- Light Voronoi-like region borders hinted around each centroid
- Side panel: "k-means on slot 0 → 256 centroids = slot 0's dictionary"
- `<desc>`: "Scatter plot of slot 0 sub-vectors with 256 k-means centroids forming the slot's codebook dictionary."

**Prose**:
> Pick one slot - say slot 0. Look at slot 0's sub-vector across every document in the corpus. That's billions of 8-D points. Run k-means on them with k = 256.
>
> k-means finds 256 prototype points - call them **centroids** - that summarize this cloud. These 256 centroids are slot 0's dictionary. Every future slot-0 sub-vector will be replaced by whichever of these 256 it is closest to.
>
> Why exactly 256? Because 2^8 = 256, and that fits in a single byte. The whole PQ design is built around squeezing one slot into one byte.

**Numbers box**: `96 slots · 256 centroids · 8 dims · 4 bytes ≈ 786 KB total dictionary  ·  fits in L2 cache`

**Italic takeaway**: "256 prototypes per slot. 96 dictionaries. The whole thing is L2-resident."

### Sub 2 - Encode = snap each slice to its nearest prototype (green)

**Hook**: "Encode = snap each slice to its nearest prototype"

**SVG (`pq-encode-snap`)**:
- Width 720, height 360
- Top half: small scatter (reuse style from sub 1) showing one query subvector as a green diamond, an arrow pointing to its nearest centroid (c17), with distance lines drawn dimly to a few other candidates
- Bottom half: a row of 4 input subvectors visualized as small 4-cell colored bars on the left, then arrows ("snap"), then a row of 4 byte boxes showing `id 17`, `id 203`, `id 89`, `id 142`. Trailing "..." indicating 92 more slots.
- Below the bytes: assembled byte string `[17, 203, 89, 142, ..., 71]` labeled "doc 1's PQ code (96 bytes)".
- `<desc>`: "Encoding step: each subvector snaps to its nearest centroid id, producing a sequence of 96 byte indices."

**Prose**:
> Now we have all 96 dictionaries. Encoding a new document vector is just lookup.
>
> For each of its 96 slots, find the closest centroid in that slot's dictionary. Write down that centroid's index - a number 0 to 255. That index fits in one byte.
>
> Repeat 96 times. The whole 768-dim vector is now 96 bytes. The original floats are thrown away. The index stores only the byte codes.

**Numbers box**: `doc 1 code = [17, 203, 89, 142, ..., 71]  ·  96 centroid ids · 1 byte each = 96 bytes`

**Italic takeaway**: "A vector becomes 96 byte-pointers into 96 tiny dictionaries."

### Sub 3 - 3,072 bytes shrinks to 96 bytes. 32× smaller. (orange)

**Hook**: "3,072 bytes shrinks to 96 bytes per vector. 32× smaller."

**SVG (`pq-compression-bars`)**:
- Width 720, height 200
- Two horizontal bars rendered to scale (so the 96-byte bar is ~1/32 the width of the 3072-byte bar)
- Top bar: full width, cyan, label "float32: 3,072 bytes/vec"
- Bottom bar: tiny sliver, orange, label "PQ m=96: 96 bytes/vec"
- Right side: large "32×" badge in green
- `<desc>`: "Side-by-side compression bars showing PQ shrinks each vector from 3,072 bytes to 96 bytes - a 32x reduction."

**Prose**:
> One float32 vector at d = 768 takes 3,072 bytes. The PQ code at m = 96 takes 96 bytes. That's 32× smaller, per vector.
>
> At billion-vector scale this changes the economics. Storage stops being the bottleneck. The whole corpus fits on one server with room for the graph index and a cache.

**Numbers box**: `float32: 768 · 4 = 3,072 B  ·  PQ: 96 · 1 = 96 B  ·  ratio = 32×`

Then the existing 1M / 100M / 1B grid is kept (with the same numbers).

**Italic takeaway**: "A billion vectors in 96 GB. One server. That's why PQ exists."

### Sub 4 - Don't reconstruct. Look up. (red)

**Hook**: "Don't reconstruct. Look up."

**SVG (`pq-adc-lookup`)**:
- Width 720, height 420
- Top row: query `q` split into 8 sub-queries (visual simplification - caption "showing 8 of 96 slots") drawn as small colored 4-cell bars
- Middle row: 8 small "tables" - each a vertical strip of 8 cells (representing 256 rows) with index labels 0..255. One cell per table is highlighted yellow (the row that matches the doc's code).
- Bottom row: doc code bytes `[17, 203, 89, 142, 88, 17, 250, 61]`
- Arrows from each code byte to the highlighted row in its corresponding table
- Far right: "Σ" symbol summing all 8 highlighted distances → final distance number
- Annotation: "precompute tables once · scan billions of docs with lookups + adds"
- `<desc>`: "Asymmetric distance computation: query stays as floats and builds a per-slot lookup table; each document's distance is the sum of 96 cache-resident table reads."

**Prose**:
> To search, the query stays as full floats. The documents stay as PQ codes. We never reconstruct.
>
> **Once per query**: compute the squared distance from each of the query's 96 sub-vectors to all 256 centroids in that slot's dictionary. Save the results as 96 small lookup tables.
>
> **Per document**: read its 96 bytes. Each byte is an index into one of those tables. Sum the 96 looked-up distances. That's the document's distance.
>
> No multiplications during the scan. Just memory lookups and adds. This is called **Asymmetric Distance Computation** - asymmetric because the query is precise but the docs are approximate.

**Numbers box**: `precompute: 96 · 256 = 24,576 entries ≈ 96 KB (fits L2)  ·  per doc: 96 lookups + 96 adds  ·  vs float32: 768 multiplies + 768 adds (≈10× slower)`

**Italic takeaway**: "PQ wins twice: 32× less memory and ~10× faster scans."

### Sub 5 - OPQ: rotate first, then split (purple)

**Hook**: "OPQ: rotate first, so the slots line up with the data"

**SVG (`pq-opq-rotation`)**:
- Width 720, height 320
- Side-by-side scatter plots
- Left ("plain PQ"): elongated diagonal cluster of dots, with a vertical dashed line cutting through it labeled "slot boundary". Cluster crosses the boundary awkwardly.
- Right ("OPQ + PQ"): same data rotated so the cluster lies axis-aligned. The vertical dashed boundary now cleanly separates two tighter sub-clouds.
- Curved arrow between the two plots labeled "× R (learned rotation)"
- Caption under each: "k-means clusters: stretched" / "k-means clusters: tight"
- `<desc>`: "Before-and-after scatter plots showing how OPQ's learned rotation aligns clusters with slot boundaries to produce tighter k-means fits."

**Prose**:
> Real embedding dimensions aren't independent. Dim 0 and dim 200 might be highly correlated. When PQ chops the vector by raw position, correlated information gets split across slots and each slot's k-means sees a stretched, awkward cloud.
>
> **OPQ** fixes this: learn an orthonormal rotation matrix R alongside the codebooks. Apply Rv to every vector before splitting. The rotation decorrelates the dimensions, the per-slot clusters become tight and round, k-means fits them better, and recall goes up.

**Numbers box**: `pipeline: v → Rv → split → encode  ·  R is 768×768 orthonormal  ·  recall@10: plain PQ 0.89 · OPQ+PQ 0.94`

**Italic takeaway**: "Free recall bump for one extra matrix multiply. FAISS, ScaNN, Qdrant all default to OPQ."

### Sub 6 - Tune m for your recall target (pink)

**Hook**: "m is the only knob: bytes-per-vector vs recall"

**SVG (`pq-m-tradeoff`)**:
- Width 720, height 300
- Line chart with two y-axes
- X-axis: m (4 ticks at 8, 48, 96, 192)
- Left y-axis (orange): bytes per vector (8, 48, 96, 192) - rising line
- Right y-axis (green): recall@10 (0.81, 0.91, 0.96, 0.98) - rising-and-flattening curve
- Vertical highlight band at m=96 labeled "production sweet spot"
- `<desc>`: "Dual-axis chart of m versus bytes-per-vector and recall@10, with m=96 marked as the production sweet spot."

**Prose**:
> m controls everything. Higher m means smaller sub-vectors, simpler k-means, tighter approximation, higher recall. But it also means more bytes per encoded vector. Pick the smallest m that hits your recall target.

Then the existing table (m, bytes/vec, compression, recall@10 (OPQ), typical use) is kept with the same row data.

**Italic takeaway**: "m = 96 (32× compression, 0.96 recall) is the canonical setting in FAISS and Qdrant."

## Implementation plan

1. **Tests first** (TDD per CLAUDE.md):
   - Update `src/__tests__/sections.test.jsx` to render `ProductQuantization` at every sub level (0..6) and verify each level renders without error and includes the new hook text
   - Add SVG description entries for the 7 new SVG IDs in `src/data/svg-descriptions.json`
   - `svg-descriptions.test.js` will then enforce coverage automatically

2. **Build a small SVG helper module** if needed - but probably fine to inline JSX `<svg>` blocks since each diagram is bespoke and used once. All SVGs use a `<desc>` first child and the existing `C` color tokens.

3. **Replace the body of `ProductQuantization`** in `src/sections/vector-compression.jsx`:
   - Each `Reveal` wraps a Box with: hook T (center), SVG, prose Ts, numbers box (centered), italic takeaway T
   - Sub 0 stays in `sub >= 0` direct render
   - Subs 1..6 stay inside `Reveal when={sub >= n}`
   - SubBtn footer stays unchanged (still `sub < 6`)

4. **Run** `npm run test` and `npm run lint`, fix any issues, then `npm run dev` and walk through all 7 reveals in browser to check overflow, alignment, and that no SVG element overlaps text.

## Acceptance criteria

- All 7 sub-steps render without error
- Every sub-step has: a hook, a hero SVG with `<desc>`, rewritten prose, numbers box centered, italic takeaway
- Test coverage doesn't regress (still 100% line / ≥97.7% branch)
- All visual rules from `.claude/rules/sections.md` followed (titles centered, no em-dashes, formulas centered, body text 16-19px, etc.)
- Browser walkthrough confirms readability on a single pass
- SVG description manifest validates clean
