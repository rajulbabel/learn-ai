# Section 12: Retrieval-Augmented Generation (RAG) - Design

**Date:** 2026-05-16
**Status:** Design approved, ready for implementation plan

## Overview

Add a new Section 12 "Retrieval-Augmented Generation" to the learn-ai app. A 41-chapter interactive section that teaches production-grade RAG at depth: how to design, build, evaluate, and operate a RAG system that survives real production traffic. Covers the full pipeline (ingestion, chunking, embedding, retrieval, query transformation, generation, advanced retrieval patterns, evaluation, production operations, and decision framework). Excludes deprecated techniques and framework-specific abstractions.

No code. No external reading list. Self-contained visual section, same pattern as Sections 1-11.

## Motivation

Section 11 (Vector Databases) explicitly deferred all "RAG application content - chunking strategies, prompt construction, eval loops" because they are a separate concern from vector-DB internals. Section 12 fills that gap.

A learner who has finished Sections 1-11 understands the model side (training, attention, transformer architecture) and the storage side (vector DBs, ANN algorithms, compression, hybrid retrieval). What they do not yet have is the production-grade understanding of how the two sides combine into a system: how to chunk documents so retrieval works well, how to transform queries to bridge lexical mismatches, how to construct context for the generator, how to evaluate the end-to-end pipeline, how to detect hallucinations, and how to operate the system economically at scale.

The learner who finishes this section can:

- Design a production RAG system from first principles for a new use case, picking chunking / embedding / retrieval / rerank / generation / eval / ops choices that fit the actual data and query patterns.
- Diagnose a misbehaving production RAG: when recall is bad, locate the cause (chunking vs embedding vs depth vs reranker vs lost-in-middle vs prompt). When faithfulness is bad, locate whether retrieval brought the right docs or generation ignored them.
- Trade off across four production axes: quality, latency, cost, operability.
- Choose framework or no-framework: evaluate "no framework vs LlamaIndex vs LangChain vs LangGraph vs Haystack vs vendor SDK" from underlying patterns, not vendor marketing.
- Build the eval pipeline that validates everything else: golden datasets, LLM-as-judge rubrics, RAGAS metrics, online feedback.
- Run RAG in production: instrument retrieval-to-generation traces, detect hallucinations, monitor drift, plan capacity, model token cost, set up semantic + prompt cache.
- Lead the conversation when the team debates "should we add a reranker" or "is GraphRAG worth it for our data" or "long-context vs RAG" - argue from mechanics, not feel.

## Goals

1. **Production-focused.** Every pattern taught is one production systems actually use today. No deprecated/superseded techniques as primary content.
2. **Full depth, not a survey.** Each major capability (chunking, query transformation, agentic patterns, eval, ops) gets enough chapters to show the actual mechanics + tradeoffs.
3. **First-principles over framework abstractions.** Patterns taught as ideas, not as `LangChain.MultiQueryRetriever` (the class). Frameworks discussed in one comparison chapter.
4. **Tradeoff literacy.** Four axes: quality, latency, cost, operability. Every chapter foregrounds one.
5. **Self-contained.** No papers to read, no blog posts to track. Visuals, prompt-template artifacts, and worked examples are the teaching.
6. **Production-grade decision-making.** Same outcome target as Section 11. Learner can lead a RAG project.
7. **Visual-first density.** Less text, more diagrams. Every diagram intuitively self-explanatory at a glance.

## Non-goals

- **No code.** No Python/JS/SDK calls. EXCEPTION: prompt templates and eval rubrics shown as styled monospace **text** blocks (visually distinct from code blocks) - they are the production artifact.
- **No framework tutorials.** Not "the LangChain section" or "the LlamaIndex section". One chapter (12.40) compares framework options with honest current state; rest is framework-agnostic.
- **No deprecated techniques as primary content.** Excluded:
  - **BLEU/ROUGE/METEOR for RAG eval** - replaced by LLM-as-judge + RAGAS metrics. Old NLP word-overlap scores do not measure faithfulness or groundedness.
  - **LangChain Stuff/MapReduce/Refine chains** - superseded by long-context + better retrieval. Cover the underlying decision conceptually, not the named patterns.
  - **Pure keyword-only RAG as a strategy** - always hybrid (BM25 + dense) now. BM25 stays as a component of hybrid (Section 11.24).
  - **RAG-Fusion as a standalone technique** - absorbed into multi-query expansion chapter (12.20).
  - **Step-back prompting as a standalone chapter** - mentioned briefly under multi-query; reasoning models reduce its standalone value.
- **No vendor decision matrix that ages.** Framework comparison stays at "what each does + when it fits" - not "Pinecone vs LangChain pricing in Q2 2026".
- **No use of the word "architect"** in chapter titles, descriptions, or content. (Same rule as Section 11. Production-grade decision-making framing translates without that word.)
- **No re-teaching of Section 11 primitives.** Hybrid search, rerankers, ColBERT, embedding lifecycle: brief 1-paragraph recap + back-reference (e.g., "Rerankers - covered in Section 11.25 - here we focus on retrieval-to-rerank ratio for RAG").
- **No model-specific code.** Prompt templates use generic `system` / `user` / `assistant` markers. One subsection notes per-vendor differences (Claude XML tags vs GPT structured output) where it matters.
- **No tutorial pacing.** Not "build RAG v1 in an hour". Depth-first.

## Prerequisites (already taught in Sections 1-11)

- Embeddings as dense vectors (Section 5.2)
- Tokenization (Sections 2.1, 2.10)
- Attention + context-window mechanics (Section 7)
- Vector DB internals: HNSW, IVF, hybrid, rerankers, multi-vector, lifecycle (Section 11)
- Cross-entropy loss (Section 2.3) - referenced in eval chapters
- Cosine / dot-product similarity (Sections 1.17, 11.4)

Not assumed: any RAG-specific knowledge, any prior exposure to LlamaIndex/LangChain/Haystack, any eval framework familiarity (RAGAS, TruLens, DeepEval).

## Section metadata

| Field | Value |
|---|---|
| Section number | 12 |
| Section name | "Retrieval-Augmented Generation" |
| Section color | `#7c4dff` (deep indigo - distinct from Section 11 rose, Section 4 purple, Section 7 magenta) |
| Placement | After Section 11 (Vector Databases) |
| Total chapters | 41 |

## Running example

**Primary corpus: 30-doc customer support knowledge base** for a fictional SaaS named "Habuild Cloud". Generic enough to feel universal; specific enough that doc names and content can be referenced consistently.

**Doc categories (10 each):**

1. **Account & billing** - password reset, email change, subscription tiers, refunds, invoice download, MFA setup, account deletion, payment methods, downgrade flow, team-seat management.
2. **Product features** - dashboard tour, integrations setup, API keys, webhooks, export formats, custom fields, role permissions, notifications, search filters, bulk operations.
3. **Troubleshooting** - common errors, slow page load, 500 errors, sync failures, login issues, browser compatibility, data inconsistency, export failures, rate limits, quota exceeded.

**Standard queries (used across chapters):**

| Query | Type | What it tests |
|---|---|---|
| "How do I reset my password?" | Single-doc lookup | Baseline retrieval |
| "How do I reset my password if I forgot my email?" | Multi-hop | 2 docs needed (password reset + email change) |
| "Why is my dashboard slow and showing 500 errors?" | Multi-issue / disjunctive | Several troubleshooting docs |
| "Cancel my subscription and get a refund" | Multi-step / sequential | Account deletion + refund policy |
| "Compare the Pro and Enterprise plans" | Aggregation / comparison | Subscription tier doc + team-seat doc |

**Secondary corpora (used for one chapter each, where the primary does not fit):**

| Where used | Corpus | Why |
|---|---|---|
| GraphRAG chapter (12.28) | 15-node citation network of legal cases | Need entity-relationship structure that support docs lack |
| Long-context vs RAG chapter (12.30) | Single 200-page product manual | Demonstrate "fits in context window" tradeoff |

**Consistent numeric values across chapters:**

| Variable | Value (visuals) | Value (scaling math) |
|---|---|---|
| Embedding dim | 8 (drawable) | 1024 (modern, e.g. Cohere v3) |
| Chunk size (tokens) | 64-128 (visible) | 512 (production typical) |
| Chunk overlap | 0 or 16 (visible) | 50-100 (production) |
| Retrieval top-k | 3-5 | 20-50 (before rerank) |
| Reranked top-k | 2-3 | 5-10 (sent to LLM) |
| LLM context window | 8k (visuals) | 200k (model-agnostic mention) |

The same query gives the same retrieval result across chapters unless the chapter is teaching a deliberate change (e.g., "with hybrid, doc-7 now appears", "after reranker, doc-3 moves to position 1").

## Audience outcome

**Framing**: production-grade decision-making + design. The learner is the person who has to ensure the RAG system reaches and sustains production grade.

The learner who finishes Section 12 can:

1. **Design** a production RAG system from first principles for a new use case.
2. **Diagnose** misbehaving production RAG by locating the failing component (chunk / embed / retrieve / rerank / pack / generate / eval).
3. **Trade off** across quality, latency, cost, operability axes - every chapter foregrounds one.
4. **Choose framework / build vs buy** from mechanics, not marketing.
5. **Build the eval pipeline** with golden datasets, LLM-as-judge, RAGAS metrics, online feedback.
6. **Run RAG in production** with tracing, hallucination detection, drift monitoring, capacity planning, cost models, semantic + prompt cache.
7. **Lead the conversation** in design reviews and tradeoff debates.

**Tone**: same as Section 11 - production-focused, tradeoff-literate, vendor-skeptical, math-honest. Every concept gets the real version: real prompt template wording, real metric formulas, real failure modes. No watered-down summaries.

**Anti-outcome (NOT what learner gets)**: this is not "build your first RAG in 30 minutes". The section gives the depth a learner needs *after* the tutorial: what every choice means, when each pattern applies, how to operate the system in production.

## Arc (10 acts)

1. **The RAG Problem** (3 ch) - why bare LLMs are not enough, the canonical pipeline, where naive RAG breaks.
2. **Ingestion** (3 ch) - parsing raw sources to clean text, deduplication and cleaning, refresh and sync schedules. The upstream step that decides whether anything below works.
3. **Chunking** (7 ch) - cutting documents so retrieval works well; the highest-leverage decision.
4. **Embed & Index Choices for RAG** (4 ch) - picking embedding model, domain adapt, hybrid for RAG, reranker cascade.
5. **Query Transformation** (4 ch) - bridging lexical mismatch and ambiguity (HyDE, multi-query, routing, decomposition).
6. **Context & Generation** (3 ch) - packing top-k into a prompt, lost-in-middle, citations + groundedness.
7. **Advanced Retrieval Patterns** (6 ch) - multi-hop, Self-RAG, CRAG, GraphRAG, tool-augmented, long-context vs RAG.
8. **Evaluation** (5 ch) - the RAG eval triangle, LLM-as-judge, RAGAS, golden datasets, online + A/B.
9. **Production Operations** (5 ch) - caching, cost models, observability, hallucination + drift, framework choice.
10. **Decision Framework + Capstone** (1 ch) - all axes assembled into one framework with end-to-end design walkthrough.

## Full chapter list (41 chapters)

### Act 1 - The RAG Problem (3 chapters)

| ID | Component | Title |
|---|---|---|
| 12.1 | WhyLLMsNeedRetrieval | Why LLMs Need Retrieval |
| 12.2 | NaiveRAGPipeline | The Naive RAG Pipeline |
| 12.3 | WhereNaiveRAGBreaks | Where Naive RAG Breaks |

**Visual focus:** side-by-side bare-LLM vs RAG; end-to-end pipeline diagram; 7 named failure modes shown on actual queries from the corpus.

### Act 2 - Ingestion (3 chapters)

| ID | Component | Title |
|---|---|---|
| 12.4 | ParsingExtraction | Parsing - Raw Sources to Clean Text |
| 12.5 | DeduplicationCleaning | Deduplication & Cleaning |
| 12.6 | RefreshSync | Refresh & Sync Schedules |

**Visual focus:** garbage-in PDF/OCR failure; 5-format source zoo (PDF/HTML/DOCX/Markdown/API); PDF 2-column + table + OCR failure modes side-by-side; HTML boilerplate strip zones; metadata JSON artifact; MinHash+LSH near-dup bucketing; embedding-cosine paraphrase dedup; full re-index vs webhook vs polling timeline; delete propagation 3-row versioning diagram.

### Act 3 - Chunking (7 chapters)

| ID | Component | Title |
|---|---|---|
| 12.7 | WhyChunkFixedSize | Why Chunk At All + Fixed-Size Baseline |
| 12.8 | RecursiveStructuralChunking | Recursive Structural Chunking |
| 12.9 | SemanticChunking | Semantic Chunking |
| 12.10 | LateChunking | Late Chunking (Jina 2024) |
| 12.11 | HierarchicalChunking | Hierarchical / Parent-Child Chunking |
| 12.12 | ContextualRetrieval | Contextual Retrieval (Anthropic 2024) |
| 12.13 | ChunkingDecision | The Chunking Decision |

**Visual focus:** sliding window with overlap; tree of structural splits; embedding-similarity break graph; chunk-then-embed vs embed-then-chunk side-by-side; parent-child tree; per-chunk LLM-augmented context block; final decision matrix on the support corpus.

### Act 4 - Embed & Index Choices for RAG (4 chapters)

| ID | Component | Title |
|---|---|---|
| 12.14 | EmbeddingModelChoice | Picking an Embedding Model |
| 12.15 | DomainAdaptation | Domain Adaptation - Fine-Tuning Embeddings |
| 12.16 | HybridForRAG | Hybrid Retrieval for RAG |
| 12.17 | RerankerCascade | The Reranker Cascade |

**Visual focus:** decision matrix (dim, multilingual, domain, cost) across OpenAI ada-3 / Cohere v3 / BGE / SBERT / Voyage; contrastive training pair diagram; BM25-vs-dense complementary recall diagram; 3-stage cascade with latency budget.

### Act 5 - Query Transformation (4 chapters)

| ID | Component | Title |
|---|---|---|
| 12.18 | WhyTransformQueries | Why Transform Queries |
| 12.19 | HyDE | HyDE - Hypothetical Document Embeddings |
| 12.20 | MultiQueryExpansion | Multi-Query Expansion |
| 12.21 | QueryRoutingDecomposition | Query Routing & Decomposition |

**Visual focus:** lexical-mismatch failure example; HyDE flow (query -> fake doc -> embed); multi-query fan-out + RRF merge; router decision tree (small index / large / SQL / no-retrieval).

### Act 6 - Context & Generation (3 chapters)

| ID | Component | Title |
|---|---|---|
| 12.22 | ContextPacking | Context Packing |
| 12.23 | LostInTheMiddle | The Lost-in-the-Middle Problem |
| 12.24 | CitationsRefusal | Citations, Refusal & Groundedness |

**Visual focus:** packing strategies (relevance-first, chronological, deduped); U-shaped attention curve; prompt-template artifact for inline citations + structured-citation JSON.

### Act 7 - Advanced Retrieval Patterns (6 chapters)

| ID | Component | Title |
|---|---|---|
| 12.25 | MultiHopRetrieval | Multi-Hop Retrieval |
| 12.26 | SelfRAG | Self-RAG |
| 12.27 | CorrectiveRAG | CRAG - Corrective RAG |
| 12.28 | GraphRAG | GraphRAG (Microsoft 2024) |
| 12.29 | AgenticRAG | Tool-Augmented & Agentic RAG |
| 12.30 | LongContextVsRAG | Long-Context vs RAG |

**Visual focus:** iterative retrieve loop on "reset password if forgot email"; Self-RAG token-emission diagram; CRAG retrieval-evaluator decision tree; GraphRAG entity-relationship subgraph (legal-citation secondary corpus); tool-call loop; cost x latency x accuracy chart for long-context vs RAG.

### Act 8 - Evaluation (5 chapters)

| ID | Component | Title |
|---|---|---|
| 12.31 | RAGEvalTriangle | The RAG Eval Triangle |
| 12.32 | LLMAsJudge | LLM-as-Judge |
| 12.33 | RAGASMetrics | RAGAS Metrics |
| 12.34 | GoldenDatasets | Golden Datasets |
| 12.35 | OnlineEvalABTesting | Online Eval & A/B Testing |

**Visual focus:** 3-layer eval triangle (retrieval / generation / end-to-end); judge-prompt template artifact + bias chart; the 4 RAGAS metrics each with formula + worked example; golden-dataset curation flow; A/B with rubric scoring.

### Act 9 - Production Operations (5 chapters)

| ID | Component | Title |
|---|---|---|
| 12.36 | Caching | Caching - Prompt + Semantic |
| 12.37 | CostModels | Cost Models |
| 12.38 | ObservabilityTracing | Observability & Tracing |
| 12.39 | HallucinationDrift | Hallucination Detection & Drift |
| 12.40 | FrameworkChoice | Framework Choice |

**Visual focus:** prompt-cache prefix mechanism with 90% cost-cut visualization; per-query cost breakdown bar chart; trace span tree (query -> retrieve -> rerank -> pack -> generate); hallucination + drift signal panels; framework decision matrix (no-framework / LlamaIndex / LangChain / LangGraph / Haystack / vendor SDK).

### Act 10 - Decision Framework + Capstone (1 chapter)

| ID | Component | Title |
|---|---|---|
| 12.41 | RAGDecisionFrameworkCapstone | The Complete RAG Decision Framework + Capstone |

**Visual focus:** all decisions assembled into one framework; capstone walkthrough designing end-to-end production-grade RAG for a new use case (legal Q&A on case law) using every concept in the section.

## Design rules - MANDATORY

Every chapter MUST follow CLAUDE.md visual rules in full. The rules below are either CLAUDE.md mandates re-stated for emphasis, or new Section-12-specific rules added during brainstorming.

### Visual quality (zero tolerance)

These are MANDATORY validation gates. A chapter is not "done" until all of these pass:

1. **Zero overlap.** No diagram, visual, or illustration component overlaps another in any manner. Earlier sections suffered overlap defects that had to be fixed one-by-one. This rule is enforced by Chrome visual validation, not eyeballed at code-write time.
2. **Edges + nodes + boxes consistently aligned.** Every node/edge/box in any diagram is vertically AND horizontally center-aligned within its container, with symmetric padding. SVG `viewBox` content centered with computed symmetric `x_start = (viewBox_width - element_span) / 2`. No hardcoded `x = 40` left margins.
3. **Title-case capitalization for diagram box text.** Every WORD inside a diagram box has its first letter capitalized (stricter than the current CLAUDE.md "first letter of line" rule). Example: a box labeled "Retrieve Top K Documents" not "Retrieve top k documents". Exceptions: officially lowercase brand names (pgvector, numpy), variable identifiers in formulas (`q_vec`), parameter syntax (`m = 16`), tokens (`[CLS]`).
4. **First letter of every line/sentence capitalized.** CLAUDE.md mandate, re-stated. All visible text fragments - monospace formula lines, table cells, bullet points, column headers, card descriptions, SVG text labels - start with a capital letter.
5. **Titles always center-aligned.** CLAUDE.md mandate, re-stated. Every Box title, sub-step title, section heading inside a Box uses the T component's `center` prop. Inside card layouts, the title T MUST have `center`, the description T MUST have `center`, AND the parent card div MUST have `textAlign: "center"`.
6. **Standalone formulas always centered** with `textAlign: "center"` on the container div.
7. **Colored boxes, not invisible ones.** Never `Box color={C.card}`. Use real colors (`C.cyan`, `C.purple`, `C.red`, `C.yellow`, `C.green`, `C.orange`, `C.blue`).
8. **SVG `<desc>` metadata** on every SVG; corresponding entry in `src/data/svg-descriptions.json`.

### Chrome browser visual validation - MANDATORY

Every chapter at every sub-step MUST be validated in Chrome via the `mcp__claude-in-chrome__*` tools before being marked complete. The check-visuals skill exists in this project; use it.

Validation checklist per chapter:

- Open the chapter in the running dev server.
- Step through every sub-step (Reveal click).
- Check: no overlapping elements anywhere on the page.
- Check: every diagram is centered horizontally + vertically within its container.
- Check: every diagram box label is title-case.
- Check: every line of text starts with a capital letter.
- Check: every Box has a real color (not `C.card`).
- Check: every standalone formula is centered.
- Take a screenshot for visual reference.

A chapter that passes tests but fails Chrome validation is NOT done. Fix in code, re-validate.

### Density: visual-first

- **Less text, more diagrams.** Default to "show with a diagram" over "describe in prose". A chapter with 5 paragraphs of text and 1 diagram is failing this rule. A chapter with 1 paragraph and 5 diagrams is succeeding.
- **Every diagram intuitively self-explanatory.** A learner glancing at the diagram should grasp the concept without reading the surrounding text. Text supplements the diagram, not the other way around.
- **Build piece by piece** with Reveal sub-steps. Naive RAG pipeline (12.2) is likely 6-8 sub-steps, each adding one element to the pipeline diagram.
- **Concrete over abstract.** Use the support corpus + 5 standard queries throughout. "Doc-3" / "Doc-7" naming. Never "some doc".
- **Real depth, simple language.** Show the real RAGAS formula, the real reranker score, the real prompt template wording. Never paraphrase the artifact.
- **Show the WHY.** Every chunking strategy, every query transformation, every eval metric: explain the tradeoff that picks it.

### Prompt-template artifact treatment (Section-12-specific rule)

Prompt templates and eval rubrics are TEXT artifacts, NOT code blocks. Render in styled monospace blocks visually distinct from code:

- Background tint matching the box color (e.g., `${C.purple}06`).
- Soft border `1px solid ${C.purple}12`.
- Monospace font, 14-16px.
- Highlight variable placeholders (`{context}`, `{query}`) in distinct color.
- Label the block as "Prompt Template" or "Eval Rubric" in the title.
- Never show executable code (no Python, no JS, no SDK calls).

### Consistency rules

- **Re-use the support corpus + 5 standard queries** across all 41 chapters wherever possible.
- **Re-use the canonical numeric values** in the running-example table - same query gives same retrieval result across chapters unless the chapter is teaching a deliberate change.
- **Section 11 back-references** use the format: "Rerankers - covered in Section 11.25 - here we focus on ...". Always include the chapter number.
- **Per-act color scheme** - use one Box color family per act for visual continuity. Tentative assignment (finalize during implementation):
  - Act 1: red (the problem)
  - Act 2: orange (ingestion)
  - Act 3: cyan (chunking)
  - Act 4: purple (embed/index)
  - Act 5: amber (query transform)
  - Act 6: yellow (context/gen)
  - Act 7: blue (advanced retrieval)
  - Act 8: green (eval)
  - Act 9: pink (ops)
  - Act 10: indigo (decision framework, matches section color)
- **Chapter ID consistency** - config.js `id: "12.N"`, component name = topic-PascalCase (e.g., `LateChunking`, `ContextualRetrieval`, `RAGEvalTriangle`). Filenames lowercase.

### CLAUDE.md update flagged

The "title-case for diagram box text" rule (every word capitalized in diagram boxes) is stricter than the current CLAUDE.md rule (first letter of line/cell). After Section 12 ships, update CLAUDE.md to align - either add the stricter rule globally or carve out diagram-box-text as a special case.

## Implementation file split

| File | Acts covered | Chapter count |
|---|---|---|
| `src/sections/rag-foundations.jsx` | Act 1 (problem) + Act 3 (chunking) | 10 |
| `src/sections/rag-ingestion.jsx` | Act 2 (ingestion) | 3 |
| `src/sections/rag-retrieval.jsx` | Acts 4+5 (embed/index + query transform) | 8 |
| `src/sections/rag-generation.jsx` | Acts 6+7 (context+gen + advanced) | 9 |
| `src/sections/rag-evaluation.jsx` | Act 8 (evaluation) | 5 |
| `src/sections/rag-production.jsx` | Acts 9+10 (ops + decision framework) | 6 |

Total: 6 files, 41 chapters, no file exceeds ~10 chapters. Keeps each file focused and under reasonable size for editing. Note: `rag-foundations.jsx` holds non-contiguous chapter IDs (12.1-12.3 + 12.7-12.13) because Act 2 (Ingestion) was inserted between problem and chunking after the original file split was planned. Component-to-file mapping is via `src/config.js`, so non-contiguous IDs in one file are fine.

## Other infrastructure changes

- **`src/config.js`** - add 41 chapter entries; add Section 12 to `sectionNames` and `sectionColors` (`12: "Retrieval-Augmented Generation"`, `12: "#7c4dff"`).
- **`src/learn-ai.jsx`** - import the 6 new section files and spread into the lookup object.
- **`src/__tests__/sections.test.jsx`** - add tests for every new chapter at every sub-level.
- **`src/data/svg-descriptions.json`** - add entries for every new SVG.
- **`CLAUDE.md`** - update the mapping table for Section 12; update project structure tree to include 6 new section files.
- **`public/llms.txt`** - update topic list to include RAG (ingestion + retrieval + generation + eval + ops).
- **`index.html`** - update JSON-LD `teaches` array to include RAG.

## Success criteria - when is Section 12 done

1. All 41 chapters implemented, in `config.js`, exported from one of 6 section files, lookup-resolved by `learn-ai.jsx`.
2. Tests added in `sections.test.jsx` for every chapter at every sub-level (TDD per CLAUDE.md mandate).
3. `npm run test` green, coverage 100% lines, branches >= 97.7%.
4. `npm run lint` clean, `npm run format` clean.
5. Every SVG has `<desc>` + entry in `svg-descriptions.json`.
6. **Discoverability sync:** `public/llms.txt`, `index.html` JSON-LD `teaches`, `CLAUDE.md` mapping table all updated for Section 12.
7. **Chrome browser visual review** of all 41 chapters at all sub-levels - no overlapping elements, all diagrams centered, all diagram-box text title-case, all line-start text capitalized, no `Box color={C.card}`, all standalone formulas centered. Screenshots filed for reference.
8. **CLAUDE.md visual-rule update** flagged in step "CLAUDE.md update flagged" applied after section ships.

## Open questions for implementation phase (NOT spec-blocking)

- Exact wording of every chapter title (working titles in this spec - final names emerge during chapter design).
- Per-act Box color assignment (tentative above - finalize during implementation).
- Specific prompt-template wording per chapter (drafted during chapter design, not spec).
- Section 12 splash treatment in the TOC (Section 11 has a splash; match style).
- Whether to add a small section-12-specific test helper for prompt-template-block rendering (to be evaluated during plan writing).
