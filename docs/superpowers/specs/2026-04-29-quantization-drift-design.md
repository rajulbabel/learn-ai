# Quantization Drift: Add Mutation-Drift Problem & Industry Fix to SQ, PQ, BQ Chapters

**Date:** 2026-04-29
**Scope:** Section 11 (Vector Databases), Chapters 11.13 (Scalar Quantization), 11.14 (Product Quantization), 11.15 (Binary Quantization).
**Out of scope:** 11.16 Matryoshka (dimension reduction, not value quantization; drift problem is fundamentally different — model retraining vs distribution drift — and is already touched in 11.27 Embedding Lifecycle).

## Problem

Every quantization scheme calibrates compression parameters from a training sample at index-build time:
- **SQ** pins per-dim min/max.
- **PQ** trains 256-centroid codebooks per slot via k-means.
- **BQ** picks a per-dim threshold (commonly sign function with threshold = 0).

After build, the dataset is mutated continuously by three operations:
- **Insert** — a new vector arrives and is quantized using the *frozen* calibration. Values may fall outside the calibrated regime.
- **Update** — an existing vector is replaced (same id, new content). Re-quantized with the *frozen* calibration. Same out-of-range / far-from-centroid risk as insert.
- **Delete** — a vector is removed. Its quantized code becomes a tombstone. Cumulative deletes also shift the actual data distribution away from the training sample, which makes the calibration progressively less representative — and bloats storage with stale codes.

Per scheme:
- **SQ:** any new dim value > max → clipped to max → reconstruction error on that dim. Update has the same effect. Deletes accumulate stale int8 rows and the live min/max drifts away from the calibrated bounds.
- **PQ:** any new sub-vector far from every centroid → high reconstruction error. Update inherits the issue. Deletes leave orphaned PQ codes and shift the residual distribution that the codebooks were trained on.
- **BQ:** distribution shift on inserts/updates collapses the sign threshold (mostly 0s or mostly 1s for a dim). Deletes change per-dim bit-balance stats, which is also the drift signal.

Current chapters teach the calibration step but never mention what happens after the index is mutated. Learners walk away thinking quantization is a one-time setup. Production teams deal with mutation drift continuously, and each scheme has standard remedies covering all three operations.

## Goals

- Each of 11.13, 11.14, 11.15 gains a “mutation drift problem” sub and a “how industry fixes it” sub.
- The problem sub explicitly covers Insert + Update + Delete.
- The fix sub covers the corresponding production remedies for all three operations (re-quantize on update, vacuum/compaction for deletes, recalibrate/retrain on drift signal for the calibration itself).
- Visual-heavy, minimal text. ONE big SVG per sub. Title + short labels. No prose paragraphs.
- Industry remedy names real systems (FAISS, Qdrant, Pinecone, Vespa, Milvus, Cohere, Mixedbread, OpenAI) and the actual configuration knob or API call.
- Pedagogical placement: drift content slots in just before the integration / wrap-up sub at the end of each chapter, so the user sees the full success story first, then the operational caveat, then the integration wrap-up.

## Placement

Each chapter currently has subs 0–6. Insert two new subs at positions 6 and 7. Existing sub 6 becomes sub 8.

| Chapter | Old sub 6 (becomes sub 8) | New sub 6 | New sub 7 |
|---|---|---|---|
| 11.13 SQ | "SQ slots into any index: HNSW, IVF, or flat" | Insert / update / delete drift the calibrated range | Percentile bounds + tombstone vacuum + recalibration |
| 11.14 PQ | "m is the only knob: bytes-per-vector vs recall" | Insert / update / delete drift the codebooks | Oversample + tombstones + retrain on error spike |
| 11.15 BQ | "HNSW + BQ: graph navigates binary codes" | Insert / update / delete drift the sign threshold | Zero-centered models + bit-balance alert + compaction |

Position rationale per chapter:
- **SQ:** placement after sub 5 ("4x memory win for 1-3% recall loss") because the user has just seen the full success arc; drift is the production caveat before integration wrap-up. Earlier placement (e.g., right after sub 1 calibration) interrupts forward flow before the user understands what SQ even does.
- **PQ:** placement after sub 5 (OPQ rotation) because OPQ is a training-time alignment trick and drift is run-time degradation. Logical separation. The m-knob discussion (now sub 8) closes the chapter cleanly.
- **BQ:** placement after sub 5 ("Production use: binary + rerank stage") because the rerank pattern is a prerequisite for understanding why the fix in sub 7 is acceptable (some bit drift is tolerable when stage 2 reranks). Earlier placement does not have this scaffolding.

## Per-Chapter Content

### 11.13 SQ — new sub 6 "Insert / update / delete drift the calibrated range" (red Box)

Top of the Box: a thin three-tile row labeled INSERT, UPDATE, DELETE. Each tile is a tiny icon (plus / pencil / minus) plus a one-line caption:
- INSERT — new value 1.8 is outside [-1.2, 1.4]
- UPDATE — replaced value 1.8 is outside [-1.2, 1.4]
- DELETE — stale int8 row stays; live min/max drifts

Main SVG: horizontal number line with calibrated band [-1.2, 1.4] shaded cyan and bucket scale 0..255 below.
- Green dot at 0.5 → vertical guide → bucket 158.
- Red dot at 1.8 plotted OUTSIDE the band, with bent arrow back to clip point at 1.4 = bucket 255. Red gap bar labeled "error = 0.4".
- Faded "tombstone" marker on the line representing a deleted entry whose int8 still lives in the row store.

Text content: titles + tile captions + axis labels + the "error = 0.4" annotation. No paragraphs.

### 11.13 SQ — new sub 7 "Percentile bounds + tombstone vacuum + recalibration" (green Box)

Main SVG: split panel with two number lines stacked.
- Top: band [-1.2, 1.4] labeled "min/max calibration". Red dot at 1.8 outside, gap bar = 0.4.
- Bottom: band [-1.4, 1.7] labeled "p1/p99 + 10% headroom". Red dot at 1.8, gap bar = 0.1.

Below the SVG, a three-row strip showing the fix per operation:
- INSERT/UPDATE: clip rare; drift counter increments if clipped.
- DELETE: tombstone bit set; vacuum job rebuilds the row store.
- DRIFT: when % clipped > 0.5%, scheduled job re-fits bounds.

Then a 4-tile grid of systems. Each tile = system name + a single config-line snippet:
- FAISS — `IndexScalarQuantizer(d, QT_8bit_uniform)` with custom range
- Qdrant — `quantization_config.scalar.rescaling: true` + `optimizer.deleted_threshold`
- Pinecone — managed re-quantization on shard rebalance
- Vespa — `tensor` field, `int8` cell-type, explicit bounds + auto-compact

### 11.14 PQ — new sub 6 "Insert / update / delete drift the codebooks" (red Box)

Top of the Box: three-tile row INSERT / UPDATE / DELETE with one-line captions:
- INSERT — sub-vec far from every centroid, error 6x baseline
- UPDATE — same: re-encoded with stale codebooks
- DELETE — orphan PQ code; residual distribution shifts

Main SVG: 2D scatter for slot 0.
- 256 gray X marks for centroids in a tight cluster around origin.
- Gray training-vec dots inside the cluster.
- Red dot for the new/updated sub-vector at [2.1, 1.9], dashed line to nearest X labeled "distance = 1.8".
- A few faded gray dots with strikethrough representing deleted entries — visually showing how many were near the centroids vs. now removed.
- Inset label: "training avg distance = 0.3".

Text content: title + tile captions + dot/X legend + two distance labels. No paragraphs.

### 11.14 PQ — new sub 7 "Oversample + tombstones + retrain on error spike" (green Box)

Main SVG: line chart of 95th-percentile reconstruction error over time.
- X-axis: vector count from 0 to 50M (mix of inserts, updates, deletes annotated as small ticks of three colors at the bottom).
- Y-axis: reconstruction error.
- Line: flat baseline 0–10M, spike between 10M–20M, horizontal dashed "retrain threshold" crossed at 15M, vertical dashed "retrain triggered" at 20M, then flat baseline.

Below: three-row fix strip per operation:
- INSERT/UPDATE: re-encode with current codebooks; track recon error.
- DELETE: tombstone in posting list; background compaction reclaims and reshapes residuals.
- DRIFT: 95p error breach → train new codebooks on a fresh sample, hot-swap.

Then a 4-tile grid:
- FAISS — `ProductQuantizer.train(new_set)` + index rebuild
- Vespa — background re-quantization with hot-swap
- Milvus — scheduled IVF_PQ retraining + segment compaction
- Qdrant — `POST /collections/{name}/quantization` retrain + `optimizer.deleted_threshold`

### 11.15 BQ — new sub 6 "Insert / update / delete drift the sign threshold" (red Box)

Top of the Box: three-tile row INSERT / UPDATE / DELETE with one-line captions:
- INSERT — new dim-5 batch mean = 0.4, bits collapse 78/22
- UPDATE — re-binarized with stale threshold; same collapse
- DELETE — bit-balance stats decay; old codes linger

Main SVG: two histograms side-by-side for dim 5.
- Left: training distribution, centered at 0, label "split 51/49" in green.
- Right: drifted distribution, centered at 0.4, label "split 78/22" in red.
- Vertical line at x = 0 (sign threshold) on both.

Below the histograms, an 8-cell bit grid: training row mostly mixed 0/1, drifted row mostly 1s, with a small "tombstone" cell for deleted entries.

Text content: title + tile captions + the two split-ratio labels + bit-grid row labels. No paragraphs.

### 11.15 BQ — new sub 7 "Zero-centered models + bit-balance alert + compaction" (green Box)

Main SVG: 1024 thin vertical bars, one per dim.
- Each bar height = |bit_balance - 50%| (deviation from balanced).
- Most bars green and short (< 20% deviation).
- ~10 bars tall and red (> 70% imbalance) flagged with a small alert badge above each.

Below the bars, three-row fix strip per operation:
- INSERT/UPDATE: sign(x) on a zero-centered model needs no calibration; per-dim mean threshold is updated incrementally if not centered.
- DELETE: tombstone bit; compaction job rewrites the bit table and re-counts balances.
- DRIFT: any dim with > 70% same value → re-binarize that dim or alert.

Then a 4-tile grid:
- Cohere Embed v3 — sign-based binary, no calibration
- Mixedbread mxbai-embed-large-v1 — zero-centered, sign threshold
- OpenAI text-embedding-3 — binary mode via sign
- Milvus / Qdrant — custom per-dim threshold + drift monitor + segment compaction

## Implementation Notes

- All new SVGs need `<desc>` first child per project rule. Add corresponding entries to `src/data/svg-descriptions.json`.
- All Box titles use the T component's `center` prop.
- Use existing color palette: red Box for problem, green Box for fix. Inner tiles use color hex + `06` background and `12` border per inner-element pattern.
- Body text 16-19px, titles 22px. Labels and axis ticks 11-13px.
- Real numbers and consistent dim-5 example carry through SQ/BQ subs.
- Test additions: `src/__tests__/sections.test.jsx` must render each chapter at every new sub level and verify problem/fix titles appear; `svg-descriptions.test.js` must validate new SVG IDs in the manifest.

## Non-Goals

- No new chapter is added.
- No restructure of existing subs 0–5 in any of the three chapters.
- No drift content in 11.16 Matryoshka, 11.17 IVF-PQ, or 11.18 HNSW+PQ — drift is a property of the underlying compression and is taught in the base chapter.
- No new top-level chapter titled "Drift" or similar — content lives inside each scheme's chapter.
