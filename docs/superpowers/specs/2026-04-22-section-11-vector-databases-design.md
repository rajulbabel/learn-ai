# Section 11: Vector Databases - Design

**Date:** 2026-04-22
**Status:** Design approved, ready for implementation plan

## Overview

Add a new Section 11 "Vector Databases" to the learn-ai app. A 35-chapter interactive section that teaches vector database internals at a depth that enables team-lead decision-making: how each production ANN algorithm works, how compression schemes trade memory for recall, how production systems handle filtering/updates/sharding/replication, and how to pick between FAISS, pgvector, Qdrant, Pinecone, Weaviate, Milvus, and Chroma.

No code. No external reading list. Self-contained visual section, same pattern as sections 1-10.

## Motivation

Sections 1-10 teach the model side of modern AI. Section 5.2 (Embeddings) produces dense vectors, but what happens next - how do production systems serve similarity search over billions of those vectors in single-digit milliseconds? - is a full story unto itself, and one a team lead is expected to reason about.

The learner who finishes this section can:

- Answer "should we use Qdrant or Pinecone?" from first principles, not vendor marketing
- Tune HNSW parameters when recall is bad, and know which parameter to reach for
- Explain why graph indexes struggle with deletes and what tombstone strategies buy
- Calculate memory budget for a proposed vector search system before provisioning
- Lead a design review on a new retrieval feature with full command of the tradeoffs
- Evaluate vendor claims, benchmarks, and feature matrices against what actually matters

## Goals

1. **Production-focused.** Every algorithm taught is one production systems actually use. No LSH, no KD-trees, no academic-only dead ends.
2. **Full depth, not a survey.** Each major algorithm (HNSW, IVF, PQ, Vamana) gets enough chapters to show the actual math, the parameter tradeoffs, and the real behavior - not hand-waving.
3. **First-principles over vendor matrices.** System comparisons flow from algorithmic understanding; the learner can re-derive a decision when vendors release new features.
4. **Tradeoff literacy.** Every chapter foregrounds what you're giving up. Recall, latency, memory are the three axes; every knob trades one for another.
5. **Self-contained.** No papers to read, no blog posts to track down. The visuals are the teaching.

## Non-goals

- **No code.** The learner is not building a vector DB. No from-scratch implementations, no pseudocode as content. This is conceptual mastery.
- **No RAG application content.** Chunking strategies, prompt construction, eval loops - all separate. Rerankers are included because they're part of retrieval architecture; multi-vector retrieval is included for the same reason. Everything downstream of "the DB returned k results" is out of scope.
- **No systems-engineering depth.** No SIMD, no memory layout, no concurrency primitives, no disk persistence formats, no GPU acceleration (CAGRA/RAFT). Those are a future deferred section.
- **No vendor decision matrix that ages.** No "Pinecone pod X costs $Y in Q2 2026." The framework for deciding is what persists; specific prices are left out.
- **No use of the word "architect"** in chapter titles, descriptions, or content. Role-neutral framing throughout (multiple audiences read this app).

## Prerequisites (already taught)

- **Embeddings as dense vectors** - Section 5.2
- **Dot product as similarity measure** - Sections 1.17, 6.3
- **Matrix operations** - Sections 1.18, 1.19
- **Softmax** (referenced in quantization rounding) - Section 7.6

Not assumed: any vector-DB-specific knowledge, any prior exposure to Pinecone/Qdrant/etc., any ANN terminology.

## Section metadata

| Field | Value |
|---|---|
| Section number | 11 |
| Section name | "Vector Databases" |
| Section color | new entry, suggest rose `#f06292` - distinct from existing reds, pinks, and teals |
| Placement | After Section 10 ("Modern LLM Techniques") |
| Total chapters | 35 |

## Running example

Every chapter uses **"Find documents about cats"** - continuing the app's existing "I love cats" running thread.

**Mini-corpus (10 documents), used throughout:**

1. "Cats are small domesticated carnivores"
2. "Dogs are loyal pets"
3. "Lions are big cats that live in Africa"
4. "My cat sat on the mat"
5. "Tigers are striped cats"
6. "Python is a programming language"
7. "Kittens grow up to be cats"
8. "The dog chased the cat"
9. "Birds can fly"
10. "Fish live underwater"

**Standard query:** "information about cats" (expected to retrieve documents 1, 3, 4, 5, 7, 8 with high similarity).

**Consistent numeric values across chapters:**

| Variable | Value used in visuals | Value used in scaling math |
|---|---|---|
| d (embedding dim) | 4 or 8 (screen-drawable) | 768 (SBERT default) |
| N (corpus size) | 10 (small enough to show all) | 1M to 1B (scaling discussions) |
| HNSW M | 16 | 16 |
| HNSW ef_construction | 200 | 200 |
| HNSW ef_search | 50 | 50 to 200 tuning range |
| IVF nlist | shown small, math uses sqrt(N) | 4096 at N=1M, 32768 at N=100M |
| IVF nprobe | 8 | 8-32 tuning range |
| PQ m (subvectors) | 8 | 8 to 96 |
| PQ codebook size | 256 (8-bit codes) | 256 |
| Scalar quantization | int8 | int8 |

## Arc (6 acts)

1. **The Problem** (4 ch) - why exact search breaks and what tradeoffs govern every decision.
2. **Clever Indexing** (7 ch) - the ANN algorithms production systems run (IVF, HNSW, Vamana).
3. **Compression** (5 ch) - why compression is non-negotiable and how to shrink each vector.
4. **Combined Indexes** (2 ch) - IVF-PQ and HNSW+PQ, what production actually uses.
5. **Production Realities** (10 ch) - filtering, updates, sharding, replication, hybrid, rerankers, multi-vector, lifecycle, observability, capacity.
6. **System Selection** (7 ch) - FAISS, pgvector, Qdrant, Pinecone, head-to-head, other systems, decision framework.

## File organization

35 chapters in a single file would exceed comfortable file size. Split into four section files along act boundaries:

| File | Chapters | Count |
|---|---|---|
| `src/sections/vector-foundations.jsx` | Acts 1 + 2 (11.1 - 11.11) | 11 |
| `src/sections/vector-compression.jsx` | Acts 3 + 4 (11.12 - 11.18) | 7 |
| `src/sections/vector-production.jsx` | Act 5 (11.19 - 11.28) | 10 |
| `src/sections/vector-systems.jsx` | Act 6 (11.29 - 11.35) | 7 |

All chapter functions are exported as named exports; `learn-ai.jsx` imports each file with `import * as Foo from ...` and spreads into the lookup object.

## Chapter list

### Act 1 - The Problem (4 chapters)

**11.1 The Retrieval Problem**
Starting point: embeddings from Section 5.2 are now sitting in a database of 1 billion. How do we find the 10 most similar to a query in milliseconds? Visual: the 10-doc corpus as points in 2D, query arrives, "find the closest" framed as the problem. Learner walks away knowing this is a retrieval problem, not a learning problem - the model already did its job.

**11.2 Brute-Force kNN**
The baseline: compute similarity against all N, sort, return top-k. Show it working on 10 docs (fast), scale to 1M (slow), 1B (hopeless). Concrete math: at d=768 and N=1B, brute force is ~3 TB of distance computation per query. Walk away knowing why exact is impossible at scale.

**11.3 The Three-Way Tradeoff**
The eternal triangle: recall, latency, memory. Introduce recall@k (of the true top-k, how many did our approximate method find?). Show that pushing any corner pushes another. Key takeaway: at scale we're always approximate; the game is managing the tradeoff.

**11.4 Distance Metrics**
Cosine, L2 (Euclidean), inner product. Why cosine is standard for text embeddings. Why L2 matters for some vision embeddings. Why inner product is fastest when vectors are normalized. Compute each on the cat corpus, show when they agree vs. disagree. Note the L2-normalized identity (cosine == inner product after normalization) and why that matters for hardware.

### Act 2 - Clever Indexing (7 chapters)

**11.5 IVF (Inverted File Index)** — 6 sub-steps
Cluster the corpus with k-means into nlist Voronoi cells. At query time, probe the nearest nprobe cells only. Visual: corpus partitioned into colored regions, query lands in one, recall vs. speed shown as nprobe varies. Walk away knowing the cluster-first intuition.
- sub=0: the 10-doc cat corpus scattered in 2D, brute-force searches every point
- sub=1: run k-means with nlist=3 clusters, show centroids forming and doc assignments
- sub=2: Voronoi cells drawn around centroids, each doc belongs to exactly one cluster
- sub=3: query arrives, find nearest centroid first, probe that one cluster (nprobe=1)
- sub=4: raise nprobe to 3, recall goes up, latency goes up (the core IVF knob)
- sub=5: parameter guidance (nlist ≈ sqrt(N), nprobe for recall target), the tradeoff

**11.6 The ANN Family Tree** — 6 sub-steps
One-chapter survey of the landscape: trees (KD-tree, Ball-tree, curse of dimensionality kills them), LSH (clever but graph-dominated), clustering (IVF), graphs (HNSW, Vamana). Why graphs won: they navigate the metric space directly. Sets up the HNSW deep dive.
- sub=0: the problem restated - need sub-linear search at scale, what are our options?
- sub=1: tree-based (KD-tree) - works beautifully at d=2, breaks at d=768 (curse of dimensionality)
- sub=2: LSH - hash similar vectors to same bucket, clever but recall sags at high d
- sub=3: clustering (IVF recap) - partition space, search partitions
- sub=4: graph-based (HNSW, Vamana) - navigate metric space directly through edges
- sub=5: why graphs won in production - best recall/latency/memory tradeoff empirically

**11.7 HNSW - The Small-World Intuition** — 5 sub-steps
Why "small-world" networks enable logarithmic search. Airport analogy: hubs + local links. Start with a flat proximity graph, show why a random-start greedy search is slow, then introduce long-range links at higher layers. Visual: hierarchy emerging from flat graph as layers are added.
- sub=0: flat proximity graph - each node connected to M nearest, looks clean
- sub=1: greedy search from a random start - many hops to reach target (slow)
- sub=2: add a "hub" layer above - fewer nodes, long-range edges, fast navigation
- sub=3: stack another layer - exponential speedup, O(log N) hops total
- sub=4: airport analogy - international hubs + regional + local flights, same idea

**11.8 HNSW Construction** — 6 sub-steps
How vectors are inserted. The layer assignment formula `L = floor(-ln(uniform(0,1)) * mL)` (real formula, not simplified). Greedy insert at each layer: find M nearest, connect. Parameter M defined. Visual: animated insert of 10 vectors, layer assignment dice roll shown, edges being drawn.
- sub=0: empty graph, insert the first vector at layer 0
- sub=1: layer assignment formula `L = floor(-ln(uniform(0,1)) × mL)`, show the math
- sub=2: probability visualization - most nodes at layer 0, fewer at higher layers, exponential decay
- sub=3: greedy insert - at each layer ≤ L, find M nearest existing nodes, add edges
- sub=4: animate full insertion of 10-doc cat corpus with dice rolls and edge-draws
- sub=5: parameter M (=16 default) and mL, memory math for edges

**11.9 HNSW Search** — 6 sub-steps
The search algorithm. Start at entry point in top layer, greedy-descend to closer nodes. Switch to beam search with ef_search candidates at layer 0. Return top-k from final candidate pool. Visual: query traveling down the hierarchy, beam expanding at bottom layer.
- sub=0: query vector arrives, start at the top-layer entry point
- sub=1: within current layer, greedy descent - move to neighbor closer to query
- sub=2: when no neighbor is closer, drop down to the next layer
- sub=3: at layer 0, switch to beam search with ef_search candidates
- sub=4: beam search expansion - maintain ef_search closest, explore their neighbors
- sub=5: return top-k from final candidate set, animate full path on cat-corpus graph

**11.10 HNSW Parameters** — 6 sub-steps
The real tuning guide. M=16 default. ef_construction=200 (build-time, higher = better graph, slower build). ef_search=50-200 (query-time, tune per workload). Show recall@10 curves vs. ef_search and vs. M with concrete numbers. Memory math: M edges at layer 0 + ~M/2 total at upper layers = bytes/vector overhead. When to raise each parameter.
- sub=0: the three knobs - M, ef_construction, ef_search with defaults
- sub=1: M effect - more edges → better recall, more memory (linear relationship)
- sub=2: ef_construction - build-time quality vs build time cost
- sub=3: ef_search - query-time recall vs latency, the main tuning knob
- sub=4: recall@10 curves vs ef_search at M=8/16/32 (concrete empirical numbers)
- sub=5: memory math (M × bytes × N) and a when-to-raise-each playbook

**11.11 Vamana / DiskANN** — 6 sub-steps
When the graph doesn't fit in RAM. Vamana (Microsoft's DiskANN paper): single-layer graph with α-pruning that stays navigable from any starting node. Disk-resident with memory-cached entry layer. Why this enables 100 billion vectors on a single machine. Used by Azure AI Search and Milvus disk mode. Brief mention of FreshDiskANN for the delete story.
- sub=0: the RAM wall - HNSW doesn't scale past ~100M vectors on one machine
- sub=1: Vamana idea - single flat layer, but carefully chosen edges
- sub=2: alpha-pruning rule - only keep edges that are "diverse" (no redundant short paths)
- sub=3: disk layout - graph lives on SSD, entry points cached in RAM
- sub=4: search pattern - minimize disk reads via entry-layer greedy navigation
- sub=5: 100B vectors on one machine (Azure AI Search, Milvus disk mode), FreshDiskANN for deletes

### Act 3 - Compression (5 chapters)

**11.12 The Memory Wall** — 5 sub-steps
The N × d × 4 bytes math. d=768 × 4 bytes = 3 KB per vector. 1M vectors = 3 GB. 100M = 300 GB. 1B = 3 TB. Add HNSW overhead (~100 bytes/vector). Show why compression is non-negotiable at real scale. Frame the next four chapters as memory-reducing tools.
- sub=0: one vector = d × 4 bytes = 768 × 4 = 3 KB (show the calculation)
- sub=1: scale table - N=1M → 3 GB, N=100M → 300 GB, N=1B → 3 TB
- sub=2: add HNSW graph overhead (~100 bytes/vector), totals grow further
- sub=3: real server economics - r7i.24xlarge 768 GB RAM ≈ $7k/month, does the math still work?
- sub=4: four shrinking techniques teased (scalar quantization, PQ, binary, Matryoshka)

**11.13 Scalar Quantization** — 6 sub-steps
Float32 → int8. Per-dimension min/max calibration, linear quantization. 4× memory win, typical 1-3% recall loss. Visual: one vector before (float32 array) and after (int8 byte array), distance computation happening in int8 (also SIMD-friendly). Worked example on a cat-corpus vector.
- sub=0: one float32 vector, 4 bytes per dimension, show a cat-corpus vector
- sub=1: scan the dataset, find per-dimension min and max values
- sub=2: linear map `[min_i, max_i] → [0, 255]` (int8 range), show the formula
- sub=3: quantize the cat vector, display before (float32) and after (int8 bytes)
- sub=4: distance computation in int8 - SIMD-friendly, often faster than float32 on modern CPUs
- sub=5: the tradeoff - 4× memory win for 1-3% recall loss, almost always worth it

**11.14 Product Quantization (PQ) + OPQ** — 7 sub-steps
The magic compression. Split each vector into m subvectors of dim d/m. Per-slot k-means with 256 centroids (8-bit codes). Replace subvector with centroid ID. Original d-dim float32 → m bytes. At d=768, m=96 → 96 bytes vs. 3072 original = 32× compression. Visual: codebook construction, encoding, asymmetric distance computation (query float vs. code table lookup). OPQ as a rotation pre-step that makes PQ work better with correlated dimensions.
- sub=0: split 768-dim vector into m=96 subvectors of 8 dims each, show the split
- sub=1: for each of the 96 slots, run k-means on the dataset → 256 centroids per slot
- sub=2: encoding - each subvector → nearest centroid ID, 8 bits per slot
- sub=3: whole vector becomes 96 × 1 byte = 96 bytes (vs 3072 bytes original, 32× compression)
- sub=4: asymmetric distance - query stays float32, doc is codes, use a precomputed lookup table
- sub=5: OPQ - rotate the data first so dimensions are decorrelated, then PQ works better
- sub=6: recall vs compression curve, typical production operating points

**11.15 Binary Quantization** — 6 sub-steps
The extreme. Each dimension → 1 bit (sign-based). 32× vs. float32. Distance becomes Hamming (XOR + popcount - blazing fast on modern CPUs). Works surprisingly well at d≥1024 with BERT-style embeddings. Shows recall behavior: great at high d, breaks down at d=128.
- sub=0: one float32 vector at d=1024 (4 KB total)
- sub=1: take the sign of each dimension → 1 bit/dim → 128 bytes total (32× compression)
- sub=2: Hamming distance - XOR the bits, popcount (CPU-native, blazingly fast)
- sub=3: when it works - high-dim BERT-style embeddings hold recall at 95%+
- sub=4: when it breaks - low-dim embeddings (d=128), recall collapses
- sub=5: production use - Qdrant's binary index, some Pinecone tiers, rerank stage helps

**11.16 Matryoshka Embeddings** — 6 sub-steps
Variable-dimensional embeddings. OpenAI's text-embedding-3 trick: trained such that truncating to the first 256/512/768/1536 dims still produces a meaningful embedding. Lets a team trade dim (memory, speed) for recall at query time without re-embedding. Visual: nested concentric spheres of meaning, truncation showing which coordinates matter most.
- sub=0: the problem - want a smaller embedding without re-embedding millions of docs
- sub=1: Matryoshka idea - train so first-256 dims are useful, first-512 better, first-1024 even better
- sub=2: nested concentric spheres visualization (Russian dolls analogy)
- sub=3: truncation use - ship 3072-dim, serve retrieval from 512-dim for 6× memory savings
- sub=4: adaptive precision - 256 for fast first-stage, expand to 3072 for reranking
- sub=5: production availability - OpenAI text-embedding-3, Cohere Embed v3

### Act 4 - Combined Indexes (2 chapters)

**11.17 IVF-PQ** — 6 sub-steps
The FAISS classic, dominant for static large-scale workloads. IVF clusters the space; PQ compresses each residual (vector minus its cluster centroid, since residuals cluster tighter and PQ works better). Memory: tiny (m bytes per vector + cluster ID). Recall: tuned via nprobe. Visual: decomposition of a vector into centroid + residual + PQ code, search trajectory.
- sub=0: IVF recap (cluster then probe) and PQ recap (compress each vector)
- sub=1: combine the two - first cluster the space with IVF
- sub=2: compute residual (vector minus its cluster centroid), residuals cluster tighter
- sub=3: PQ-encode the residuals (not the raw vectors) - tighter clusters mean better PQ
- sub=4: search - find nprobe nearest clusters, scan PQ codes within each
- sub=5: memory ~20 bytes per vector at N=1B, FAISS default for huge static datasets

**11.18 HNSW + PQ** — 5 sub-steps
When you need graph navigation speed plus quantization memory savings. Store the HNSW graph structure, but each vector is PQ-encoded. Distances computed from codes. Qdrant, Weaviate, Milvus all support this. Tradeoff: PQ reduces distance accuracy → HNSW recall drops → compensate with higher ef_search. Shows the recall hit curve and how to dial it back.
- sub=0: HNSW gives fast graph navigation, PQ gives memory savings - combine them
- sub=1: keep the graph structure (edges unchanged), but each node stores a PQ code
- sub=2: distance computation uses codes (also faster due to table lookups)
- sub=3: recall drops because PQ introduces distance error - compensate with higher ef_search
- sub=4: production systems that support this - Qdrant, Weaviate, Milvus

### Act 5 - Production Realities (10 chapters)

**11.19 Filtering** — 6 sub-steps
The #1 production gotcha. "Find similar to X where tenant_id=T and published_after D." Three strategies:

- **Pre-filter**: evaluate filter first, brute-force the candidates. Works only when filter selectivity is high.
- **Post-filter**: ANN search → filter the results. Can return empty results for selective filters.
- **Inline / filtered-HNSW**: evaluate filter during graph traversal (Qdrant's approach). Excellent in practice; has recall edge cases at extreme selectivity.

Concrete example where each strategy gives different answers.
- sub=0: the problem statement - "similar to X where tenant_id=42 AND published_after=2024"
- sub=1: pre-filter - filter docs first, brute-force-search the survivors (slow when filter is loose)
- sub=2: post-filter - ANN search first, filter the results (empty results when filter is tight)
- sub=3: inline filtered-HNSW - evaluate filter during graph traversal (Qdrant approach)
- sub=4: selectivity edge cases - when each strategy wins vs loses on recall and latency
- sub=5: the filter index itself has a cost (bitmap, inverted index, column store)

**11.20 Updates & Deletes** — 6 sub-steps
Why graph indexes struggle. HNSW deletes leave "tombstones" that degrade the graph over time; many systems mark-and-rebuild periodically. IVF-PQ is easier (delete from cluster, rebuild cluster). Visual: HNSW graph after 30% deletes showing holes; rebuild strategies shown as periodic compaction. When soft-delete is enough and when you must rebuild.
- sub=0: simple case - insert always works (append node, connect to M nearest)
- sub=1: delete problem - removing a node breaks paths that routed through it
- sub=2: tombstone approach - mark node deleted, filter at query time
- sub=3: graph degradation after 30% deletes - holes, wasted hops, recall drops
- sub=4: rebuild strategies - full rebuild (downtime), segment rebuild (rotation), incremental repair
- sub=5: IVF-PQ delete is easier (cluster-level), HNSW+PQ delete is hardest, plan for it

**11.21 Sharding & Partitioning** — 6 sub-steps
Horizontal scale. When single-node memory isn't enough. Random sharding vs. semantic (cluster-based) sharding. Query fan-out: each shard returns top-k, merged at the coordinator - merged top-k may have different recall than a hypothetical single-node top-k; show why. Filtering + sharding interaction (prune shards by filter predicates when possible). IVF-natural sharding (one cluster = one shard) and its edge cases.
- sub=0: single-node limit - ~100M vectors at d=768 in RAM before it hurts
- sub=1: random sharding - round-robin by vector ID across N shards, simple
- sub=2: semantic sharding - cluster-based, each shard holds one IVF cluster's vectors
- sub=3: query fan-out - send query to all shards, coordinator merges top-k from each
- sub=4: recall math - per-shard top-k merged is not equal to single-node top-k, show why
- sub=5: filter + shard interaction - prune shards by predicate when metadata allows

**11.22 Replication & High Availability** — 5 sub-steps
Read replicas for throughput; leader-follower for writes. Index consistency during writes (lag between leader and follower). Recovery: rehydrate from WAL vs. rebuild from source of truth. What "durability" means for an in-memory index - if RAM dies, is the index gone? Depends on persistence model.
- sub=0: read replicas - N copies of the index, reads load-balanced across them
- sub=1: leader-follower writes - one writer, many readers, explain replication lag
- sub=2: failure - leader dies, follower promotes, potential lag-window data loss
- sub=3: durability - if all RAM copies die simultaneously, do we have WAL or snapshots?
- sub=4: recovery time comparison - rebuild from WAL vs re-embed from source documents

**11.23 Hybrid Search** — 6 sub-steps
BM25 + vector = better than either alone. Vectors capture semantic similarity; BM25 captures exact term matches (SKUs, proper nouns, rare tokens). Reciprocal Rank Fusion (RRF) to combine ranked lists: `score(d) = sum over rankers of 1 / (k + rank(d))`. Concrete cat-corpus example where "tabby cat genetics" returns different results from pure vector vs. pure BM25 vs. hybrid.
- sub=0: vectors miss exact matches - SKUs, proper nouns, rare tokens get lost
- sub=1: BM25 refresher - term frequency times inverse document frequency
- sub=2: run BM25 and vector in parallel, get two ranked lists of top candidates
- sub=3: Reciprocal Rank Fusion formula `score(d) = Σ 1 / (k + rank_r(d))` for each ranker r
- sub=4: "tabby cat genetics" on cat corpus - pure vector vs pure BM25 vs hybrid, different results
- sub=5: weighting options, when hybrid is worth it, production tuning knobs

**11.24 Rerankers** — 6 sub-steps
Two-stage retrieval. Stage 1: ANN retrieves top-100 (fast, approximate). Stage 2: cross-encoder model scores each (slow, accurate). Cross-encoder = query and doc concatenated, transformer produces a single relevance score. Why this massively outperforms vector-only retrieval: full attention between query and doc (not just cosine between two pre-computed embeddings). Latency cost: ~100 reranking runs ≈ 100ms; worth it for accuracy-critical workloads.
- sub=0: stage 1 - ANN returns top-100 candidates (fast, approximate)
- sub=1: cross-encoder architecture - query and doc concatenated, single transformer pass
- sub=2: full attention between query and doc tokens (bi-encoder cosine can't do this)
- sub=3: stage 2 - re-rank the 100 candidates, return top-10 by cross-encoder score
- sub=4: latency cost - ~100 reranking runs ≈ 100 ms, quality gain is usually large
- sub=5: production models - Cohere Rerank, BGE-reranker, MS-MARCO cross-encoders

**11.25 Multi-vector Retrieval (ColBERT-style)** — 6 sub-steps
Each document has multiple vectors (one per token). Query has multiple vectors. Similarity = "max-sim" aggregation - for each query token, find the max-matching document token, then sum. More accurate than single-vector retrieval for long docs. Supported by Vespa, Qdrant (native multi-vector), Elasticsearch. Storage cost: N × tokens × d (large). When worth it.
- sub=0: single-vector problem - compressing a paragraph into one vector is lossy
- sub=1: multi-vector idea (ColBERT) - one vector per token, keep them all
- sub=2: max-sim aggregation - for each query token, find max-matching doc token, sum
- sub=3: concrete example on cat corpus - token-level embeddings, show the max-sim walkthrough
- sub=4: storage cost - N × tokens × d (can be 20-100× larger) is the tradeoff
- sub=5: production systems - Vespa, Qdrant (native multi-vector), Elasticsearch

**11.26 Embedding Lifecycle & Re-embedding** — 6 sub-steps
What happens when OpenAI releases text-embedding-3-large and your 500M indexed vectors are now "wrong"? Options: re-embed everything (expensive, slow, often impossible without source text), run parallel indexes during migration, pin the embedding model forever. Versioning embeddings. The silent killer: distribution drift when the model changes under you.
- sub=0: you indexed 500M vectors with text-embedding-ada-002 two years ago
- sub=1: OpenAI releases text-embedding-3-large - better quality, incompatible dimensions
- sub=2: option 1 - re-embed everything (cost, time, requires keeping source text)
- sub=3: option 2 - parallel indexes during migration, serve from old, populate new
- sub=4: option 3 - pin the old model forever (but drift goes invisible, quality slowly decays)
- sub=5: drift monitoring - why "quality slowly regressed" is often embedding drift

**11.27 Observability** — 6 sub-steps
What to log: query latency (P50, P95, P99), recall@k (requires periodic ground-truth sampling), index build time, memory per vector, cache hit rate. How to benchmark: ANN-Benchmarks methodology. What to alert on. Which dashboards matter in production.
- sub=0: latency - P50, P95, P99 (tail matters most in production)
- sub=1: recall@k - periodic ground-truth sampling, trend over time
- sub=2: per-query cost - memory reads, cache hit rate, CPU cycles
- sub=3: ANN-Benchmarks methodology - how to compare index configurations fairly
- sub=4: production dashboard layout - what to alert on, what to merely watch
- sub=5: the metric you did not measure is the one that hurts you - choose widely

**11.28 Capacity Planning & Cost Models** — 6 sub-steps
Sizing for a real workload. Inputs: N vectors, d dimensions, target QPS, target P99, filter selectivity, availability target. Outputs: memory needed, CPU needed, number of shards, number of replicas. Worked example: 500M vectors × d=768 × 200 QPS → RAM needed, nodes needed, cost per month. Cost comparison: Pinecone pods vs. self-hosted Qdrant vs. pgvector on a beefy Postgres box. Cost per million vectors, cost per million queries.
- sub=0: inputs to size a system - N, d, QPS, P99 target, filter selectivity, availability
- sub=1: memory formula - vectors + graph overhead + cache headroom + fragmentation
- sub=2: CPU sizing - per-query ops times QPS times headroom (with replication multiplier)
- sub=3: concrete worked example - 500M × d=768 × 200 QPS → 6 nodes, 3 TB RAM total
- sub=4: cost comparison - Pinecone pods vs self-host Qdrant vs pgvector on beefy Postgres
- sub=5: cost-per-million-vectors-per-month and cost-per-million-queries as the decision lens

### Act 6 - System Selection (7 chapters)

**11.29 FAISS** — 6 sub-steps
The library, not a database. Meta's reference implementation of IVF, PQ, HNSW, IVF-PQ. C++ with Python bindings. Used as the index engine inside Milvus, OpenSearch, many others. What FAISS gives you: algorithms. What it doesn't: persistence, API, filtering, replication, ops. The rule: use FAISS when you're building a system; use a DB when you want a system.
- sub=0: FAISS history - Meta open-sourced in 2017, research and production use
- sub=1: what's inside - IVF, PQ, HNSW, IVF-PQ implementations, CPU and CUDA
- sub=2: Python bindings on a C++ core, easy to embed in ML pipelines
- sub=3: what FAISS does NOT provide - persistence, REST API, filtering, ACID, replication
- sub=4: FAISS is the engine inside Milvus, OpenSearch, many commercial systems
- sub=5: the rule - FAISS to build a system, a DB to use one

**11.30 pgvector** — 6 sub-steps
Postgres extension. HNSW + IVFFlat. Transactional writes, SQL queries, exists alongside relational data. Good for: <10M vectors, existing Postgres team, metadata-heavy queries, moderate QPS. Bad for: billion-scale, >10K QPS, feature-rich filtering, multi-region requirements. The right answer more often than people realize.
- sub=0: pgvector is a Postgres extension adding vector types and operators
- sub=1: SQL syntax - `ALTER TABLE ... ADD COLUMN embedding vector(768)`, `ORDER BY embedding <=> query`
- sub=2: indexes - HNSW or IVFFlat, tuned via SQL parameters
- sub=3: inherited features - transactions, SQL joins, ACID, rich metadata queries
- sub=4: good fit - under 10M vectors, existing Postgres team, metadata-heavy queries
- sub=5: bad fit - over 100M vectors, over 10K QPS, heavy filter workloads, multi-region

**11.31 Qdrant** — 6 sub-steps
Rust, self-hostable, HNSW-first. Rich filtering with inline filtered-HNSW (best-in-class filter performance). Hybrid search built in. Collections with per-vector payload metadata. Good for: teams that want control, self-host preference, advanced filtering requirements, cost-sensitive at scale. Trade-offs: self-host ops burden, smaller ecosystem than Elastic, multi-region story is newer.
- sub=0: Qdrant is a Rust-based vector DB, open source, self-hostable
- sub=1: core architecture - HNSW graph + inline filter during traversal
- sub=2: collections concept, per-vector payload metadata, multi-vector support
- sub=3: built-in features - hybrid search, scalar quantization, PQ, binary quantization
- sub=4: self-host story - single binary, Docker, Kubernetes operator
- sub=5: tradeoffs - ops burden, newer multi-region story, smaller ecosystem than Elastic

**11.32 Pinecone** — 6 sub-steps
Managed, serverless (and pod-based). Proprietary. Good for: teams that don't want to run infra, scale-to-zero for variable workloads, quick POCs, applications with unpredictable traffic. Pod architecture: each pod holds a shard of the index. Cold start on serverless (first query after idle is slow). Trade-offs: vendor lock-in, opinionated scaling model, cost at scale.
- sub=0: Pinecone is managed SaaS, proprietary, opinionated defaults
- sub=1: pod architecture - each pod is one shard, scale by adding pods
- sub=2: serverless tier - scale to zero between queries, pay per query, cold-start tax
- sub=3: built-in features - filtering, hybrid, namespaces for multi-tenancy
- sub=4: good fit - no ops team, variable workloads, fast time to market
- sub=5: tradeoffs - vendor lock-in, cost at high scale, opinion on how scaling works

**11.33 Qdrant vs. Pinecone (head-to-head)** — 6 sub-steps
The central decision. Axes:

- **Self-host vs. managed** (ops story, team preference, compliance)
- **Filtering sophistication** (Qdrant wins on complex predicates)
- **Scale-to-zero** (Pinecone serverless wins)
- **Cost at 1M / 100M / 1B scale** (shifts - self-host Qdrant wins at the top end, Pinecone often wins at small+variable)
- **Feature knobs** (Qdrant exposes more tuning)
- **Ecosystem / maturity** (both solid, different strengths)

Concrete scenarios with the right answer for each.
- sub=0: the decision axes - ops preference, filter needs, scale-to-zero, cost, feature depth
- sub=1: scenario A - early prototype, no ops team → Pinecone serverless wins
- sub=2: scenario B - 10M vectors with complex compound filters → Qdrant self-host wins
- sub=3: scenario C - 1B vectors at steady 10K QPS → Qdrant multi-node (or Milvus)
- sub=4: scenario D - spiky traffic with EU data residency → Pinecone region or Qdrant Cloud EU
- sub=5: the decision criteria flowchart tying it all together

**11.34 Weaviate / Milvus / Chroma** — 5 sub-steps
Quicker survey of the rest. Weaviate: Go, self-host, good built-in modules (transformers, generative). Milvus: Go + C++, distributed-native, horizontally scalable to truly massive scale, Azure AI Search uses its core algorithms. Chroma: Python-first, local-first, embedded-friendly, small-to-medium scale, beloved for prototyping. When each is the right choice.
- sub=0: Weaviate - Go, self-host, built-in modules (transformers, generative search)
- sub=1: Milvus - Go + C++, distributed-native, billions of vectors, Azure AI Search core
- sub=2: Chroma - Python-first, local/embedded, prototyping and small-scale production
- sub=3: Elastic/OpenSearch - if you already run Elastic, its vector extension is compelling
- sub=4: when each is the right pick (context-dependent, summarize the picks)

**11.35 The Decision Framework** — 6 sub-steps
Pulling it all together into an actionable playbook. Decision flowchart:

- Small-scale + Postgres already? → pgvector
- Huge scale + no ops team? → Pinecone
- Complex filters + own infra? → Qdrant
- Distributed, billions of vectors, in-house team? → Milvus
- Research / prototype / local? → Chroma

Then the checklist of questions to ask for any vector search feature: data size, update frequency, filter selectivity, QPS, P99 target, availability target, embedding model stability, team ops capacity. Final recap of the whole section.
- sub=0: the decision flowchart - data size, ops team, filter complexity, cost band
- sub=1: size buckets - under 1M, 1M to 100M, 100M to 1B, over 1B
- sub=2: ops preference - none (Pinecone) vs self-host (Qdrant/Milvus) vs Postgres-native (pgvector)
- sub=3: filter complexity axis - simple vs complex vs analytical joins
- sub=4: design-review checklist - questions to ask about every proposed system
- sub=5: full Section 11 recap - the learner can now answer Qdrant vs Pinecone from first principles

## Visual design requirements

Every chapter MUST follow the learn-ai visual rules from CLAUDE.md:

- Progressive sub-step reveals (4-8 sub-steps per chapter)
- Real math, real numbers, real formulas (no simplified placeholder)
- Center-aligned titles in all Boxes (`center` on the first bold T element)
- Colored Boxes only (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`, `C.pink`) - never `C.card`
- Concrete cat-corpus examples, not abstract "vector x"
- SVG `<desc>` tags + corresponding entries in `src/data/svg-descriptions.json`
- Show over tell: every concept visualized with bars, grids, side-by-side diagrams, or step-by-step calculations
- Font sizes 16-20 for body text, 20-24 for titles
- Inner element pattern: tinted backgrounds (`${color}06` bg, `${color}12` border, 8px radius)
- No em-dashes anywhere
- Dot product uses middle dot notation

## File changes required

```
NEW FILES:
  src/sections/vector-foundations.jsx
    exports: 11 chapter functions (RetrievalProblem, BruteForceKNN,
             ThreeWayTradeoff, DistanceMetrics, IVF, ANNFamilyTree,
             HNSWIntuition, HNSWConstruction, HNSWSearch, HNSWParameters,
             Vamana)
  src/sections/vector-compression.jsx
    exports: 7 chapter functions (MemoryWall, ScalarQuantization,
             ProductQuantization, BinaryQuantization, Matryoshka,
             IVFPQ, HNSWPQ)
  src/sections/vector-production.jsx
    exports: 10 chapter functions (Filtering, UpdatesDeletes, Sharding,
             Replication, HybridSearch, Rerankers, MultiVectorRetrieval,
             EmbeddingLifecycle, Observability, CapacityPlanning)
  src/sections/vector-systems.jsx
    exports: 7 chapter functions (FAISS, Pgvector, Qdrant, Pinecone,
             QdrantVsPinecone, WeaviateMilvusChroma, DecisionFramework)

MODIFIED:
  src/config.js
    Add section 11 entries: 35 rows (11.1 through 11.35)
    Add section 11 to sectionNames: "Vector Databases"
    Add section 11 to sectionColors: "#f06292" (or chosen hue)
  src/learn-ai.jsx
    import * as VectorFoundations from "./sections/vector-foundations.jsx";
    import * as VectorCompression from "./sections/vector-compression.jsx";
    import * as VectorProduction from "./sections/vector-production.jsx";
    import * as VectorSystems from "./sections/vector-systems.jsx";
    Add all four to the lookup object
  CLAUDE.md
    Add Section 11 mapping table (all 35 rows)
    Update project structure tree (4 new section files)
  src/data/svg-descriptions.json
    Add entries for every new SVG (many - likely 150+ across 35 chapters)

UNCHANGED:
  All prior section files. Sections 1-10 are not edited.
```

## Component naming

Function names follow the CLAUDE.md convention: PascalCase, topic-named (no numbers), describes what the content is about. Proposed names:

| Chapter | Component name |
|---|---|
| 11.1 | `RetrievalProblem` |
| 11.2 | `BruteForceKNN` |
| 11.3 | `ThreeWayTradeoff` |
| 11.4 | `DistanceMetrics` |
| 11.5 | `IVF` |
| 11.6 | `ANNFamilyTree` |
| 11.7 | `HNSWIntuition` |
| 11.8 | `HNSWConstruction` |
| 11.9 | `HNSWSearch` |
| 11.10 | `HNSWParameters` |
| 11.11 | `Vamana` |
| 11.12 | `MemoryWall` |
| 11.13 | `ScalarQuantization` |
| 11.14 | `ProductQuantization` |
| 11.15 | `BinaryQuantization` |
| 11.16 | `Matryoshka` |
| 11.17 | `IVFPQ` |
| 11.18 | `HNSWPQ` |
| 11.19 | `Filtering` |
| 11.20 | `UpdatesDeletes` |
| 11.21 | `Sharding` |
| 11.22 | `Replication` |
| 11.23 | `HybridSearch` |
| 11.24 | `Rerankers` |
| 11.25 | `MultiVectorRetrieval` |
| 11.26 | `EmbeddingLifecycle` |
| 11.27 | `Observability` |
| 11.28 | `CapacityPlanning` |
| 11.29 | `FAISS` |
| 11.30 | `Pgvector` |
| 11.31 | `Qdrant` |
| 11.32 | `Pinecone` |
| 11.33 | `QdrantVsPinecone` |
| 11.34 | `WeaviateMilvusChroma` |
| 11.35 | `DecisionFramework` |

## Testing

Per CLAUDE.md TDD requirements:

- `src/__tests__/config.test.js` - add coverage for 35 new chapter IDs, unique IDs, section 11 in sectionNames/sectionColors.
- `src/__tests__/lookup.test.js` - add test that every new `VectorFoundations`, `VectorCompression`, `VectorProduction`, `VectorSystems` export is accessible in the lookup.
- `src/__tests__/sections.test.jsx` - one render test per chapter, per sub-step, per interaction. 35 chapters × ~6 sub-steps avg = ~210 render tests added. Plus interaction tests for any hover/click/expand behavior.
- `src/__tests__/svg-descriptions.test.js` - validate new SVG manifest entries.
- Coverage target: maintain 100% lines, 97%+ branches.

Each chapter is implemented test-first: write the render test, then write the chapter function.

## Implementation sequencing

To stay manageable, implement in act order. Each act is its own implementation milestone:

1. **Milestone 1:** Act 1 (11.1-11.4) + config wiring for Section 11 + start `vector-foundations.jsx` with first 4 chapters
2. **Milestone 2:** Act 2 (11.5-11.11) - completes `vector-foundations.jsx` (11 chapters total)
3. **Milestone 3:** Act 3 (11.12-11.16) - start `vector-compression.jsx`
4. **Milestone 4:** Act 4 (11.17-11.18) - completes `vector-compression.jsx`
5. **Milestone 5:** Act 5 (11.19-11.28) - `vector-production.jsx`
6. **Milestone 6:** Act 6 (11.29-11.35) - `vector-systems.jsx`, final CLAUDE.md update

The app should ship and be interactively usable after each milestone.

## Open questions

*None - resolved during brainstorming.*

## Future work (explicitly deferred)

- **Section 12: Vector DB Systems Engineering** (the "C" track). Implementation-level: SIMD, memory layout, concurrency, disk persistence formats, GPU acceleration (CAGRA/RAFT), learned indexes. The user explicitly deferred this to a future session.
- **RAG section**: chunking, retrieval-augmented prompting, eval loops. Separate concern, separate section.
- **Potential late-addition capstone chapter**: "The Complete Picture - Vector DB in Production" if implementation reveals a need for a summary chapter. The Decision Framework (11.35) already serves this role; the capstone only gets added if useful.
