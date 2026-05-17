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
section assignments. Each entry has a `component` field (the function name, used
for debugging) and a `file` field that points to the chapter file path under
`src/chapters/`.

```js
// config.js
{ id: "7.4", title: "Why Do We Need Softmax?", section: 7,
  component: "WhySoftmax", file: "attention-computation/why-softmax" }
```

**Each chapter lives in its own file** at
`src/chapters/<topic>/<chapter-kebab>.jsx` and is the file's default export.
This gives every chapter its own Vite chunk (lazy-loaded on demand) and isolates
edits to a single small file.

**learn-ai.jsx** uses `import.meta.glob` to register all chapter files and
loads the active chapter at render time via its `file` path. There is no
manually maintained chapter array or sections lookup.

```jsx
// learn-ai.jsx
const chapterLoaders = import.meta.glob("./chapters/**/*.jsx");

async function loadChapterByFile(file) {
  const loader = chapterLoaders[`./chapters/${file}.jsx`];
  const mod = await loader();
  return mod.default || null;
}
```

### Naming Convention

| Concept | Where | Naming rule | Example |
|---------|-------|-------------|---------|
| Component file (default export) | `src/` | kebab-case | `learn-ai.jsx` |
| Multi-export module file | `src/` | lowercase | `components.jsx`, `config.js` |
| Chapter folder | `src/chapters/` | kebab-case, topic name | `attention-computation/` |
| Chapter file | `src/chapters/<topic>/` | kebab-case, content name | `why-softmax.jsx` |
| Chapter function | default export in chapter file | PascalCase, topic name | `WhySoftmax` |
| Shared helper file | `src/shared/` | kebab-case, topic name | `vector-graphs.jsx` |
| Chapter ID | `chapters` array in config.js | `section.chapter` number | `"7.4"` |
| Entry point | `src/` | lowercase | `main.jsx` |

**All filenames are lowercase or kebab-case.** Only function/component names inside
files use PascalCase. This keeps the filesystem consistent across all operating systems.

Function names and file names describe **what the content is about**. They never
contain numbers and never need to be renamed when chapters are reordered or inserted.
Only config.js IDs change.

### Complete Mapping

**Section 1: Neural Network Foundations** (`src/chapters/neural-foundations/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 1.1 | WhatIsNN | `neural-foundations/what-is-nn` | What is a Neural Network? |
| 1.2 | InsideNeuron | `neural-foundations/inside-neuron` | Inside a Single Neuron |
| 1.3 | WhatIsLayer | `neural-foundations/what-is-layer` | What is a Layer? |
| 1.4 | WeightsBiases | `neural-foundations/weights-biases` | Weights & Biases - The Knobs |
| 1.5 | WhyLinear | `neural-foundations/why-linear` | Why Linear Isn't Enough |
| 1.6 | ReLU | `neural-foundations/re-lu` | Activation (ReLU) - Why Layers Need a Bend |
| 1.7 | ForwardPass | `neural-foundations/forward-pass` | The Forward Pass - Full Example |
| 1.8 | LossFunction | `neural-foundations/loss-function` | Loss - How Wrong Were We? |
| 1.9 | WhatIsLearning | `neural-foundations/what-is-learning` | Learning - What Does It Mean? |
| 1.10 | Derivatives | `neural-foundations/derivatives` | Derivatives - The Core Intuition |
| 1.11 | BackwardPass | `neural-foundations/backward-pass` | The Backward Pass - The Chain Rule |
| 1.12 | GradientDescent | `neural-foundations/gradient-descent` | Gradient Descent - Fixing the Weights |
| 1.13 | BackpropRealNetwork | `neural-foundations/backprop-real-network` | Backprop Through the Real Network |
| 1.14 | GradientsInAction | `neural-foundations/gradients-in-action` | Gradients in Action - The Full Training Loop |
| 1.15 | WhyBackpropHard | `neural-foundations/why-backprop-hard` | Why Deep Backprop Gets Hard |
| 1.16 | Vectors | `neural-foundations/vectors` | Vectors - Numbers That Travel Together |
| 1.17 | DotProductIntro | `neural-foundations/dot-product-intro` | The Dot Product - How Vectors Compare |
| 1.18 | Matrices | `neural-foundations/matrices` | Matrices - Grids That Transform Vectors |
| 1.19 | LayerIsMatMul | `neural-foundations/layer-is-mat-mul` | A Layer is Matrix Multiplication |
| 1.20 | ActivationFunctions | `neural-foundations/activation-functions` | Activation Functions - The Full Picture |
| 1.21 | WhatDeepMeans | `neural-foundations/what-deep-means` | What "Deep" Really Means |
| 1.22 | SameBuildingBlocks | `neural-foundations/same-building-blocks` | Same Building Blocks, Different Shapes |
| 1.23 | Dropout | `neural-foundations/dropout` | Dropout - The Regularization Trick |
| 1.24 | AdamOptimizer | `neural-foundations/adam-optimizer` | Adam - The Real Optimizer |
| 1.25 | LRWarmupDecay | `neural-foundations/lr-warmup-decay` | Learning Rate Warmup & Decay |
| 1.26 | WeightInit | `neural-foundations/weight-init` | Weight Initialization - How Random? |

**Section 2: How LLMs Actually Train** (`src/chapters/llm-training/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 2.1 | Tokenization | `llm-training/tokenization` | Tokenization - From Words to Numbers |
| 2.2 | SelfSupervised | `llm-training/self-supervised` | Self-Supervised Learning - How GPT Trains |
| 2.3 | CrossEntropy | `llm-training/cross-entropy` | Cross-Entropy Loss - The LLM Score |
| 2.4 | NNInAction | `llm-training/nn-in-action` | The Neural Network in Action |
| 2.5 | OutputLayer | `llm-training/output-layer` | The Output Layer - From Hidden State to Words |
| 2.6 | AutoregressiveGeneration | `llm-training/autoregressive-generation` | Autoregressive Generation - One Token at a Time |
| 2.7 | SFT | `llm-training/sft` | Supervised Fine-Tuning (SFT) |
| 2.8 | RLHF | `llm-training/rlhf` | RLHF - Making AI Helpful & Safe |
| 2.9 | DPO | `llm-training/dpo` | DPO - Simpler Alignment |
| 2.10 | TokenizerDeepDive | `llm-training/tokenizer-deep-dive` | Tokenizer Deep Dive - BPE, WordPiece, SentencePiece |

**Section 3: Scaling & Modern Techniques** (`src/chapters/scaling/` + `src/chapters/llm-training/batch-training.jsx`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 3.1 | ScalingLaws | `scaling/scaling-laws` | Scaling Laws - Why Bigger Models Win |
| 3.2 | ParametersAtScale | `scaling/parameters-at-scale` | Parameters at Scale |
| 3.3 | BatchTraining | `llm-training/batch-training` | Batch Training - Why Not One Example at a Time? |
| 3.4 | Distillation | `scaling/distillation` | Knowledge Distillation - Teacher to Student |
| 3.5 | CLIP | `scaling/clip` | CLIP - Teaching AI to See & Read |
| 3.6 | TrainingPipeline | `scaling/training-pipeline` | The Complete Training Pipeline |

**Section 4: The Road to Transformers** (`src/chapters/road-to-transformers/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 4.1 | CNN | `road-to-transformers/cnn` | CNN |
| 4.2 | RNN | `road-to-transformers/rnn` | RNN |
| 4.3 | RNNFlaws | `road-to-transformers/rnn-flaws` | RNN's Fatal Flaws |
| 4.4 | TransformerArrives | `road-to-transformers/transformer-arrives` | The Transformer Arrives |

**Section 5: Transformer Input Pipeline** (`src/chapters/transformer-input/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 5.1 | FullArchitecture | `transformer-input/full-architecture` | The Full Architecture |
| 5.2 | Embeddings | `transformer-input/embeddings` | Zoom: Embeddings |
| 5.3 | PosEncodingProblem | `transformer-input/pos-encoding-problem` | Positional Encoding - The Problem |
| 5.4 | PosEncodingFormula | `transformer-input/pos-encoding-formula` | Positional Encoding - The Formula |
| 5.5 | PosEncodingCompute | `transformer-input/pos-encoding-compute` | Positional Encoding - Computing Positions |
| 5.6 | PosEncodingFastSlow | `transformer-input/pos-encoding-fast-slow` | Positional Encoding - Fast vs Slow |
| 5.7 | PosEncodingFinal | `transformer-input/pos-encoding-final` | Positional Encoding - Final Addition |
| 5.8 | PosEncodingHeatmap | `transformer-input/pos-encoding-heatmap` | Positional Encoding - The Heatmap |
| 5.9 | RoPE | `transformer-input/ro-pe` | RoPE - Rotary Position Embeddings |

**Section 6: Attention - Understanding Q, K, V** (`src/chapters/attention-qkv/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 6.1 | ContextProblem | `attention-qkv/context-problem` | The Problem - Context is Everything |
| 6.2 | WordLookup | `attention-qkv/word-lookup` | How Does a Word Look At Others? |
| 6.3 | DotProduct | `attention-qkv/dot-product` | The Dot Product - Measuring Similarity |
| 6.4 | WhyNotDirectDot | `attention-qkv/why-not-direct-dot` | Why Not Dot Product Embeddings Directly? |
| 6.5 | QKVClassroom | `attention-qkv/qkv-classroom` | Q, K, V - The Classroom Analogy |
| 6.6 | AskerAnswerer | `attention-qkv/asker-answerer` | Every Word is BOTH Asker and Answerer |
| 6.7 | WhyKVDifferent | `attention-qkv/why-kv-different` | Why Can't Key and Value Be the Same? |
| 6.8 | GoogleAnalogy | `attention-qkv/google-analogy` | The Google Search Analogy |
| 6.9 | HowQKVCreated | `attention-qkv/how-qkv-created` | How Are Q, K, V Created? |
| 6.10 | QKVShapes | `attention-qkv/qkv-shapes` | Shapes - Why Q is Smaller Than the Embedding |
| 6.11 | WMatrices | `attention-qkv/w-matrices` | W Matrices - Learned During Training |
| 6.12 | TracingExample | `attention-qkv/tracing-example` | Tracing a Complete Example |

**Section 7: Attention - The Full Computation** (`src/chapters/attention-computation/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 7.1 | ComputeQKV | `attention-computation/compute-qkv` | Step 1 - Compute Q, K, V for Every Word |
| 7.2 | AttentionScores | `attention-computation/attention-scores` | Step 2 - Attention Scores (Dot Products) |
| 7.3 | KTranspose | `attention-computation/k-transpose` | Why K Transpose? - Making the Shapes Fit |
| 7.4 | WhySoftmax | `attention-computation/why-softmax` | Why Do We Need Softmax? |
| 7.5 | ScaleByRootDk | `attention-computation/scale-by-root-dk` | Step 3 - Scale by sqrt(d_k) |
| 7.6 | SoftmaxProbs | `attention-computation/softmax-probs` | Step 4 - Softmax to Probabilities |
| 7.7 | WeightedSum | `attention-computation/weighted-sum` | Step 5 - Weighted Sum of Values |
| 7.8 | FullFormula | `attention-computation/full-formula` | The Full Formula |
| 7.9 | WhyMultiHead | `attention-computation/why-multi-head` | Why Multi-Head? - The Compromise Problem |
| 7.10 | HeadSplit | `attention-computation/head-split` | The Split - How 8 Heads Work |
| 7.11 | InsideEachHead | `attention-computation/inside-each-head` | Inside Each Head - Full Attention in 64 Dims |
| 7.12 | ConcatWO | `attention-computation/concat-wo` | Concat + W_O - Blending All Heads |
| 7.13 | WhyEightHeads | `attention-computation/why-eight-heads` | Why 8 Heads? Parameter Count & Big Picture |
| 7.14 | IsWOConstant | `attention-computation/is-wo-constant` | Is W_O Constant? Does It Change? |
| 7.15 | AttentionShapes | `attention-computation/attention-shapes` | Attention Flow - Shapes at Every Step |
| 7.16 | CompletePicture | `attention-computation/complete-picture` | The Complete Picture - In Plain English |

**Section 8: The Encoder** (`src/chapters/road-to-transformers/encoder-decoder.jsx` + `src/chapters/transformer-block/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 8.1 | EncoderDecoder | `road-to-transformers/encoder-decoder` | Encoder & Decoder - The Two Halves |
| 8.2 | AddNorm | `transformer-block/add-norm` | Add & Norm - The Stabilizer |
| 8.3 | FeedForwardNetwork | `transformer-block/feed-forward-network` | FFN - The Feed-Forward Network |
| 8.4 | FFNParallelTrick | `transformer-block/ffn-parallel-trick` | FFN - Why Word Count Doesn't Matter |
| 8.5 | AddNormTwo | `transformer-block/add-norm-two` | Add & Norm (Again) - The Second Stabilizer |
| 8.6 | TransformerBlockRepeats | `transformer-block/transformer-block-repeats` | Nx - The Transformer Block Repeats |
| 8.7 | ResidualHighway | `transformer-block/residual-highway` | Residual Connections - The Gradient Highway |
| 8.8 | PreNormVsPostNorm | `transformer-block/pre-norm-vs-post-norm` | Pre-Norm vs Post-Norm |
| 8.9 | BatchNormVsLayerNorm | `transformer-block/batch-norm-vs-layer-norm` | Batch Norm vs Layer Norm |

**Section 9: The Decoder** (`src/chapters/road-to-transformers/decoder-only.jsx` + `src/chapters/attention-computation/{causal-mask,cross-attention}.jsx` + `src/chapters/transformer-input/{output-head,what-transformer-does}.jsx` + `src/chapters/encoder-decoder-diagrams/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 9.1 | DecoderOnly | `road-to-transformers/decoder-only` | Decoder-Only - How Modern LLMs Work |
| 9.2 | CausalMask | `attention-computation/causal-mask` | Causal Masking - Hiding the Future |
| 9.3 | CrossAttention | `attention-computation/cross-attention` | Cross-Attention - The Encoder-Decoder Bridge |
| 9.4 | OutputHead | `transformer-input/output-head` | The Output Head - Linear + Softmax |
| 9.5 | WhatTransformerDoes | `transformer-input/what-transformer-does` | What is a Transformer Actually Doing? |
| 9.6 | EncoderDecoderTraining | `encoder-decoder-diagrams/encoder-decoder-training` | Encoder-Decoder: The Training Flow |
| 9.7 | EncoderDecoderInference | `encoder-decoder-diagrams/encoder-decoder-inference` | Encoder-Decoder: The Inference Flow |

**Section 10: Modern LLM Techniques** (`src/chapters/attention-computation/{kv-cache,grouped-query-attention}.jsx` + `src/chapters/modern-llm-techniques/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 10.1 | KVCache | `attention-computation/kv-cache` | KV Cache - Why Inference is Fast |
| 10.2 | GroupedQueryAttention | `attention-computation/grouped-query-attention` | Grouped-Query Attention - Shrinking the KV Cache |
| 10.3 | MixtureOfExperts | `modern-llm-techniques/mixture-of-experts` | Mixture of Experts - Bigger Model, Same Compute |
| 10.4 | Thinking | `modern-llm-techniques/thinking` | Thinking - How Reasoning Models Work |

**Section 11: Vector Databases** (`src/chapters/vector-foundations/` + `src/chapters/vector-compression/` + `src/chapters/vector-production/` + `src/chapters/vector-systems/`)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 11.1 | RetrievalProblem | `vector-foundations/retrieval-problem` | The Retrieval Problem |
| 11.2 | BruteForceKNN | `vector-foundations/brute-force-knn` | Brute-Force kNN |
| 11.3 | ThreeWayTradeoff | `vector-foundations/three-way-tradeoff` | The Three-Way Tradeoff |
| 11.4 | DistanceMetrics | `vector-foundations/distance-metrics` | Distance Metrics |
| 11.5 | ANNFamilyTree | `vector-foundations/ann-family-tree` | The ANN Family Tree |
| 11.6 | IVF | `vector-foundations/ivf` | IVF (Inverted File Index) |
| 11.7 | HNSWIntuition | `vector-foundations/hnsw-intuition` | HNSW - The Small-World Intuition |
| 11.8 | HNSWConstruction | `vector-foundations/hnsw-construction` | HNSW Construction |
| 11.9 | HNSWSearch | `vector-foundations/hnsw-search` | HNSW Search |
| 11.10 | HNSWParameters | `vector-foundations/hnsw-parameters` | HNSW Parameters |
| 11.11 | Vamana | `vector-foundations/vamana` | Vamana / DiskANN |
| 11.12 | MemoryWall | `vector-compression/memory-wall` | The Memory Wall |
| 11.13 | ScalarQuantization | `vector-compression/scalar-quantization` | Scalar Quantization |
| 11.14 | ProductQuantization | `vector-compression/product-quantization` | Product Quantization (+ OPQ) |
| 11.15 | BinaryQuantization | `vector-compression/binary-quantization` | Binary Quantization |
| 11.16 | Matryoshka | `vector-compression/matryoshka` | Matryoshka Embeddings |
| 11.17 | IVFPQ | `vector-compression/ivf-pq` | IVF-PQ |
| 11.18 | HNSWPQ | `vector-compression/hnsw-pq` | HNSW + PQ |
| 11.19 | CompressionDecision | `vector-compression/compression-decision` | The Compression Decision |
| 11.20 | Filtering | `vector-production/filtering` | Filtering |
| 11.21 | UpdatesDeletes | `vector-production/updates-deletes` | Updates & Deletes |
| 11.22 | Sharding | `vector-production/sharding` | Sharding & Partitioning |
| 11.23 | Replication | `vector-production/replication` | Replication & High Availability |
| 11.24 | HybridSearch | `vector-production/hybrid-search` | Hybrid Search |
| 11.25 | Rerankers | `vector-production/rerankers` | Rerankers |
| 11.26 | MultiVectorRetrieval | `vector-production/multi-vector-retrieval` | Multi-vector Retrieval (ColBERT-style) |
| 11.27 | EmbeddingLifecycle | `vector-production/embedding-lifecycle` | Embedding Lifecycle & Re-embedding |
| 11.28 | Observability | `vector-production/observability` | Observability |
| 11.29 | CapacityPlanning | `vector-production/capacity-planning` | Capacity Planning & Cost Models |
| 11.30 | FAISS | `vector-systems/faiss` | FAISS |
| 11.31 | Pgvector | `vector-systems/pgvector` | pgvector |
| 11.32 | Qdrant | `vector-systems/qdrant` | Qdrant |
| 11.33 | Pinecone | `vector-systems/pinecone` | Pinecone |
| 11.34 | QdrantVsPinecone | `vector-systems/qdrant-vs-pinecone` | Qdrant vs Pinecone |
| 11.35 | WeaviateMilvusChroma | `vector-systems/weaviate-milvus-chroma` | Weaviate / Milvus / Chroma |
| 11.36 | DecisionFramework | `vector-systems/decision-framework` | The Decision Framework |

**Section 12: RAG - Retrieval-Augmented Generation** (`src/chapters/rag-foundations/` + `src/chapters/rag-ingestion/` + `src/chapters/rag-retrieval/` + `src/chapters/rag-generation/` + `src/chapters/rag-evaluation/` + `src/chapters/rag-production/` - 41 chapters across Acts 1-10)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 12.1 | WhyLLMsNeedRetrieval | `rag-foundations/why-llms-need-retrieval` | Why LLMs Need Retrieval |
| 12.2 | NaiveRAGPipeline | `rag-foundations/naive-rag-pipeline` | The Naive RAG Pipeline |
| 12.3 | WhereNaiveRAGBreaks | `rag-foundations/where-naive-rag-breaks` | Where Naive RAG Breaks |
| 12.4 | ParsingExtraction | `rag-ingestion/parsing-extraction` | Parsing - Raw Sources to Clean Text |
| 12.5 | DeduplicationCleaning | `rag-ingestion/deduplication-cleaning` | Deduplication & Cleaning |
| 12.6 | RefreshSync | `rag-ingestion/refresh-sync` | Refresh & Sync Schedules |
| 12.7 | WhyChunkFixedSize | `rag-foundations/why-chunk-fixed-size` | Why Chunk At All + Fixed-Size Baseline |
| 12.8 | RecursiveStructuralChunking | `rag-foundations/recursive-structural-chunking` | Recursive Structural Chunking |
| 12.9 | SemanticChunking | `rag-foundations/semantic-chunking` | Semantic Chunking |
| 12.10 | LateChunking | `rag-foundations/late-chunking` | Late Chunking (Jina 2024) |
| 12.11 | HierarchicalChunking | `rag-foundations/hierarchical-chunking` | Hierarchical / Parent-Child Chunking |
| 12.12 | ContextualRetrieval | `rag-foundations/contextual-retrieval` | Contextual Retrieval (Anthropic 2024) |
| 12.13 | ChunkingDecision | `rag-foundations/chunking-decision` | The Chunking Decision |
| 12.14 | EmbeddingModelChoice | `rag-retrieval/embedding-model-choice` | Picking an Embedding Model |
| 12.15 | DomainAdaptation | `rag-retrieval/domain-adaptation` | Domain Adaptation - Fine-Tuning Embeddings |
| 12.16 | HybridForRAG | `rag-retrieval/hybrid-for-rag` | Hybrid Retrieval for RAG |
| 12.17 | RerankerCascade | `rag-retrieval/reranker-cascade` | The Reranker Cascade |
| 12.18 | WhyTransformQueries | `rag-retrieval/why-transform-queries` | Why Transform Queries |
| 12.19 | HyDE | `rag-retrieval/hy-de` | HyDE - Hypothetical Document Embeddings |
| 12.20 | MultiQueryExpansion | `rag-retrieval/multi-query-expansion` | Multi-Query Expansion |
| 12.21 | QueryRoutingDecomposition | `rag-retrieval/query-routing-decomposition` | Query Routing & Decomposition |
| 12.22 | ContextPacking | `rag-generation/context-packing` | Context Packing |
| 12.23 | LostInTheMiddle | `rag-generation/lost-in-the-middle` | The Lost-in-the-Middle Problem |
| 12.24 | CitationsRefusal | `rag-generation/citations-refusal` | Citations, Refusal & Groundedness |
| 12.25 | MultiHopRetrieval | `rag-generation/multi-hop-retrieval` | Multi-Hop Retrieval |
| 12.26 | SelfRAG | `rag-generation/self-rag` | Self-RAG |
| 12.27 | CorrectiveRAG | `rag-generation/corrective-rag` | CRAG - Corrective RAG |
| 12.28 | GraphRAG | `rag-generation/graph-rag` | GraphRAG (Microsoft 2024) |
| 12.29 | AgenticRAG | `rag-generation/agentic-rag` | Tool-Augmented & Agentic RAG |
| 12.30 | LongContextVsRAG | `rag-generation/long-context-vs-rag` | Long-Context vs RAG |
| 12.31 | RAGEvalTriangle | `rag-evaluation/rag-eval-triangle` | The RAG Eval Triangle |
| 12.32 | LLMAsJudge | `rag-evaluation/llm-as-judge` | LLM-as-Judge |
| 12.33 | RAGASMetrics | `rag-evaluation/ragas-metrics` | RAGAS Metrics |
| 12.34 | GoldenDatasets | `rag-evaluation/golden-datasets` | Golden Datasets |
| 12.35 | OnlineEvalABTesting | `rag-evaluation/online-eval-ab-testing` | Online Eval & A/B Testing |
| 12.36 | Caching | `rag-production/caching` | Caching - Prompt + Semantic |
| 12.37 | CostModels | `rag-production/cost-models` | Cost Models |
| 12.38 | ObservabilityTracing | `rag-production/observability-tracing` | Observability & Tracing |
| 12.39 | HallucinationDrift | `rag-production/hallucination-drift` | Hallucination Detection & Drift |
| 12.40 | FrameworkChoice | `rag-production/framework-choice` | Framework Choice |
| 12.41 | RAGDecisionFrameworkCapstone | `rag-production/rag-decision-framework-capstone` | The Complete RAG Decision Framework + Capstone |

**Section 13: Agents - Tools, MCP, Loops & Memory** (`src/chapters/agent-prompting/` + `src/chapters/agent-tools/` + `src/chapters/agent-loops/` + `src/chapters/multi-agent/` + `src/chapters/agent-evals/` + `src/chapters/agent-production/` - 52 chapters across 9 acts)

| Chapter | Component | File | Title |
|---------|-----------|------|-------|
| 13.1 | AnatomyOfLlmCall | `agent-prompting/anatomy-of-llm-call` | Anatomy of an LLM Call |
| 13.2 | SystemPromptContract | `agent-prompting/system-prompt-contract` | System Prompts - The Role Contract |
| 13.3 | FewShotStructuredOutput | `agent-prompting/few-shot-structured-output` | Few-Shot + Structured Output |
| 13.4 | ChainOfThoughtSelfConsistency | `agent-prompting/chain-of-thought-self-consistency` | Chain of Thought + Self-Consistency |
| 13.5 | PromptVsTuneVsRagVsAgent | `agent-prompting/prompt-vs-tune-vs-rag-vs-agent` | Prompt vs Fine-Tune vs RAG vs Agent |
| 13.6 | ContextEngineering | `agent-prompting/context-engineering` | Context Engineering |
| 13.7 | ToolUseAsBridge | `agent-tools/tool-use-as-bridge` | Tool Use - LLM as Orchestrator |
| 13.8 | JsonSchemaForTools | `agent-tools/json-schema-for-tools` | JSON Schemas + Tool Descriptions |
| 13.9 | ToolCallLifecycle | `agent-tools/tool-call-lifecycle` | Tool Call Lifecycle |
| 13.10 | ParallelToolsAndChoice | `agent-tools/parallel-tools-and-choice` | Parallel Tools + Tool Choice |
| 13.11 | ToolErrorsRetries | `agent-tools/tool-errors-retries` | Tool Errors, Retries, Validation |
| 13.12 | WhyProtocols | `agent-tools/why-protocols` | Why Protocols? |
| 13.13 | McpArchitecture | `agent-tools/mcp-architecture` | MCP Architecture |
| 13.14 | McpPrimitives | `agent-tools/mcp-primitives` | MCP Primitives - Tools, Resources, Prompts |
| 13.15 | BuildingMcpServer | `agent-tools/building-mcp-server` | Building an MCP Server |
| 13.16 | McpSecurity | `agent-tools/mcp-security` | MCP Security |
| 13.17 | A2AProtocol | `agent-tools/a2a-protocol` | A2A - Agent-to-Agent Protocol |
| 13.18 | WorkflowVsAgent | `agent-loops/workflow-vs-agent` | Workflow vs Agent |
| 13.19 | WorkflowPrimitives | `agent-loops/workflow-primitives` | Workflow Primitives - Chaining, Routing, Parallelization |
| 13.20 | AgentLoop | `agent-loops/agent-loop` | The Agent Loop |
| 13.21 | ReActPattern | `agent-loops/re-act-pattern` | ReAct Pattern |
| 13.22 | PlanExecuteReflect | `agent-loops/plan-execute-reflect` | Plan-Execute + Reflection |
| 13.23 | LoopTermination | `agent-loops/loop-termination` | Loop Termination |
| 13.24 | MemoryTaxonomy | `agent-loops/memory-taxonomy` | Memory Taxonomy - Short vs Long |
| 13.25 | WorkingMemory | `agent-loops/working-memory` | Working Memory - The Scratchpad |
| 13.26 | EpisodicMemory | `agent-loops/episodic-memory` | Episodic Memory - Past Events |
| 13.27 | SemanticMemory | `agent-loops/semantic-memory` | Semantic Memory - Learned Facts |
| 13.28 | ProceduralMemory | `agent-loops/procedural-memory` | Procedural Memory - Learned Skills |
| 13.29 | SummaryAndContextMgmt | `agent-loops/summary-and-context-mgmt` | Summary Memory + Context Window Management |
| 13.30 | WhyMultiAgent | `multi-agent/why-multi-agent` | Why Multi-Agent? |
| 13.31 | OrchestratorWorker | `multi-agent/orchestrator-worker` | Orchestrator-Worker |
| 13.32 | SupervisorHierarchy | `multi-agent/supervisor-hierarchy` | Supervisor / Hierarchical |
| 13.33 | AgentHandoffs | `multi-agent/agent-handoffs` | Hand-Offs |
| 13.34 | CriticDebate | `multi-agent/critic-debate` | Critic / Debate / Reflection-as-Multi-Agent |
| 13.35 | MultiAgentFailures | `multi-agent/multi-agent-failures` | Multi-Agent Failure Modes |
| 13.36 | AgenticRag | `multi-agent/agentic-rag` | Agentic RAG |
| 13.37 | WhyEvalAgents | `agent-evals/why-eval-agents` | Why Eval Agents Differently |
| 13.38 | EvalDimensions | `agent-evals/eval-dimensions` | Eval Dimensions |
| 13.39 | LlmAsJudge | `agent-evals/llm-as-judge` | LLM-as-Judge |
| 13.40 | TraceEvals | `agent-evals/trace-evals` | Trace Evals |
| 13.41 | EvalSetsContinuous | `agent-evals/eval-sets-continuous` | Eval Sets + Continuous Eval |
| 13.42 | AgentObservabilityTracing | `agent-production/agent-observability-tracing` | Observability & Tracing |
| 13.43 | CostControl | `agent-production/cost-control` | Cost Control |
| 13.44 | LatencyOptimization | `agent-production/latency-optimization` | Latency Optimization |
| 13.45 | Guardrails | `agent-production/guardrails` | Guardrails |
| 13.46 | PromptInjectionDefenses | `agent-production/prompt-injection-defenses` | Prompt Injection Defenses |
| 13.47 | ToolSecurity | `agent-production/tool-security` | Tool Security |
| 13.48 | LangGraphFramework | `agent-production/lang-graph-framework` | LangGraph |
| 13.49 | CrewAiAutoGen | `agent-production/crew-ai-auto-gen` | CrewAI / AutoGen |
| 13.50 | VendorSdks | `agent-production/vendor-sdks` | Claude Agent SDK + OpenAI Agents |
| 13.51 | CustomNoFramework | `agent-production/custom-no-framework` | Custom / No-Framework |
| 13.52 | AgentDecisionFramework | `agent-production/agent-decision-framework` | The Complete Agent Decision Framework |

## Project Structure

Each chapter lives in its own file under `src/chapters/<topic>/<chapter>.jsx`
(one default-export function per file). Cross-chapter helpers live in
`src/shared/`. Tests mirror this layout under `src/__tests__/chapters/` and
`src/__tests__/shared/`.

```
learn-ai/
├── index.html
├── vite.config.js
├── eslint.config.js
├── .prettierrc
├── package.json
├── src/
│   ├── main.jsx                              # React entry point
│   ├── learn-ai.jsx                          # Shell: state, navigation, layout, chapter loader (via import.meta.glob)
│   ├── components.jsx                        # Shared components (Box, T, Reveal, SubBtn, Tag, ErrorBoundary)
│   ├── config.js                             # chapters array (with file field), sectionNames, sectionColors, colors (C)
│   ├── nav-persistence.js                    # saveNav/loadNav - localStorage persistence with config fingerprint
│   ├── search-overlay.jsx                    # Lazy-loaded search UI
│   ├── search.js                             # Search index loader / query logic
│   ├── embedding-cache.js                    # Cached embeddings for semantic search
│   ├── data/                                 # chunks.json, embeddings.bin, chunk-cache.json, etc.
│   ├── chapters/                             # 233 chapter files, one default-export function per file
│   │   ├── table-of-contents/                #   1 chapter (Overview)
│   │   │   └── toc.jsx
│   │   ├── neural-foundations/               #  26 chapters (Section 1)
│   │   ├── llm-training/                     #  11 chapters (Section 2 + batch-training.jsx used for 3.3)
│   │   ├── scaling/                          #   5 chapters (Section 3, minus 3.3)
│   │   ├── road-to-transformers/             #   6 chapters (Section 4 + encoder-decoder.jsx for 8.1 + decoder-only.jsx for 9.1)
│   │   ├── transformer-input/                #  11 chapters (Section 5 + output-head.jsx for 9.4 + what-transformer-does.jsx for 9.5)
│   │   ├── attention-qkv/                    #  12 chapters (Section 6)
│   │   ├── attention-computation/            #  20 chapters (Section 7 + causal-mask.jsx for 9.2 + cross-attention.jsx for 9.3 + kv-cache.jsx for 10.1 + grouped-query-attention.jsx for 10.2)
│   │   ├── transformer-block/                #   8 chapters (Section 8 minus 8.1)
│   │   ├── encoder-decoder-diagrams/         #   2 chapters (9.6, 9.7)
│   │   ├── modern-llm-techniques/            #   2 chapters (10.3, 10.4)
│   │   ├── vector-foundations/               #  11 chapters (Section 11 Acts 1+2)
│   │   ├── vector-compression/               #   8 chapters (Section 11 Acts 3+4, includes compression-decision.jsx for 11.19)
│   │   ├── vector-production/                #  10 chapters (Section 11 Act 5, includes capacity-planning.jsx for 11.29)
│   │   ├── vector-systems/                   #   7 chapters (Section 11 Act 6)
│   │   ├── rag-foundations/                  #  10 chapters (Section 12 Acts 1+3)
│   │   ├── rag-ingestion/                    #   3 chapters (Section 12 Act 2)
│   │   ├── rag-retrieval/                    #   8 chapters (Section 12 Acts 4+5)
│   │   ├── rag-generation/                   #   9 chapters (Section 12 Acts 6+7)
│   │   ├── rag-evaluation/                   #   5 chapters (Section 12 Act 8)
│   │   ├── rag-production/                   #   6 chapters (Section 12 Acts 9+10)
│   │   ├── agent-prompting/                  #   6 chapters (Section 13 Act 1)
│   │   ├── agent-tools/                      #  11 chapters (Section 13 Acts 2+3)
│   │   ├── agent-loops/                      #  12 chapters (Section 13 Acts 4+5)
│   │   ├── multi-agent/                      #   7 chapters (Section 13 Act 6)
│   │   ├── agent-evals/                      #   5 chapters (Section 13 Act 7)
│   │   └── agent-production/                 #  11 chapters (Section 13 Acts 8+9)
│   ├── shared/                               # Cross-chapter helpers (reused by many chapter files)
│   │   ├── plot.jsx                          # Graph
│   │   ├── agent-styles.jsx                  # SOFT, tintedCard, pill, DIM_BG, DIM_BORDER
│   │   ├── agent-helpers.jsx                 # HighlightedJson, monoArtifact
│   │   ├── vector-graphs.jsx                 # Triangle, IVFScatter, HNSWLayeredGraph, fmtVec, docCluster, computeFlatEdges, IVF_CLUSTERS, HNSW_CORPUS_XY, FLAT_GRAPH_EDGES, HNSW_LAYER_1, HNSW_LAYER_2
│   │   ├── rag-helpers.jsx                   # FormulaBox, CapstoneDecisionCard
│   │   └── llm-training-helpers.jsx          # SCORES, EXP_SCORES, EXP_SUM, SORTED_SCORES, SORTED_PROBS
│   └── __tests__/                            # Unit tests (vitest)
│       ├── setup.js
│       ├── chapter-test-helpers.js           # makeCtx factory used by every per-chapter test
│       ├── config.test.js                    # Config validation tests (unique IDs, required fields, file paths)
│       ├── lookup.test.js                    # Every config component resolves to a chapter file
│       ├── components.test.jsx               # Shared component tests
│       ├── nav-persistence.test.js           # Nav persistence tests
│       ├── learn-ai.test.jsx                 # Shell rendering, navigation, keyboard
│       ├── learn-ai-prefetch.test.jsx        # Chapter prefetch behavior
│       ├── search-overlay.test.jsx           # Search overlay UI
│       ├── search-golden.test.js             # Search relevance golden tests
│       ├── svg-descriptions.test.js          # SVG description manifest validation
│       ├── chapters/                         # 233 per-chapter test files mirroring src/chapters/
│       │   ├── cross-chapter.test.jsx        # Cross-cutting assertions (no overlap, ID uniqueness)
│       │   ├── neural-foundations/
│       │   ├── llm-training/
│       │   ├── ...                           # one folder per chapter topic
│       │   └── agent-production/
│       └── shared/                           # Per-helper tests
│           ├── plot.test.jsx
│           ├── agent-styles.test.jsx
│           ├── agent-helpers.test.jsx
│           ├── vector-graphs.test.jsx
│           ├── rag-helpers.test.jsx
│           └── llm-training-helpers.test.js
├── .github/workflows/deploy.yml
└── CLAUDE.md
```

## How To: Add a New Chapter

Example: insert a new chapter "Score Normalization" between 7.2 and 7.3.

1. **Create the chapter file** at
   `src/chapters/attention-computation/score-normalization.jsx` with a default
   export:
   ```jsx
   const ScoreNormalization = (ctx) => { ... };
   export default ScoreNormalization;
   ```
2. **Add one entry to `chapters` in `config.js`** and renumber the IDs that follow:
   ```js
   { id: "7.2", ..., component: "AttentionScores", file: "attention-computation/attention-scores" },
   { id: "7.3", title: "Score Normalization", section: 7,
     component: "ScoreNormalization", file: "attention-computation/score-normalization" },  // NEW
   { id: "7.4", ..., component: "KTranspose", file: "attention-computation/k-transpose" },  // was 7.3
   ```
3. **Add a per-chapter test file** at
   `src/__tests__/chapters/attention-computation/score-normalization.test.jsx`
   covering every sub-step and interaction. Use the `makeCtx` factory in
   `src/__tests__/chapter-test-helpers.js`.
4. **Update the mapping table in this file** (CLAUDE.md) for the affected section.
5. **No other files change.** learn-ai.jsx auto-resolves the chapter via
   `import.meta.glob` using the `file` field.

## How To: Add a New Section

Example: insert a new Section 5 "Layer Normalization" between current Sections 4 and 5.

1. **Create the folder** `src/chapters/layer-norm/` and add one file per chapter
   inside (each with a default-export function).
2. **Add chapter entries to `chapters` in `config.js`** with `section: 5` and
   `file: "layer-norm/<chapter-kebab>"`. Renumber the IDs and `section`
   numbers for chapters in later sections.
3. **Update `sectionNames` and `sectionColors`** in `config.js` with the new
   section number and any renumbered higher sections.
4. **Add per-chapter test files** under `src/__tests__/chapters/layer-norm/`.
5. **Update the mapping tables and project structure in this file** (CLAUDE.md).
6. **No other source files change.** learn-ai.jsx picks up the new chapter
   folder automatically via `import.meta.glob`.

## How To: Reorder Chapters

Just reorder the entries in the `chapters` array in config.js (and update IDs
to match the new order). Update the mapping table in this file (CLAUDE.md) to
reflect the new order. Chapter files and test files stay where they are -
nothing else changes.

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

Coverage thresholds (enforced by `vite.config.js`) over `src/config.js`,
`src/components.jsx`, `src/nav-persistence.js`, `src/chapters/**/*.jsx`, and
`src/shared/**/*.jsx` (excluding `src/main.jsx` and `src/learn-ai.jsx`):

- **Lines: 90%**
- **Branches: 98%**
- **Functions: 87%**
- **Statements: 90%**

Coverage must not drop below these thresholds. Any new code must have
corresponding tests. The per-chapter file layout means each chapter file has
its own focused test file under `src/__tests__/chapters/<topic>/`, which keeps
coverage local and easy to reason about.

### Test file organization

| Test file / folder | What it covers |
|--------------------|---------------|
| `config.test.js` | Config data integrity (unique IDs, required fields, section names, `file` paths resolve) |
| `lookup.test.js` | Every config `file` path resolves to a chapter module with a default export |
| `components.test.jsx` | ErrorBoundary, Box, T, Reveal, SubBtn, Tag |
| `nav-persistence.test.js` | saveNav/loadNav: config match, config change, corrupted data, localStorage errors |
| `learn-ai.test.jsx` | Shell rendering, navigation, keyboard shortcuts |
| `learn-ai-prefetch.test.jsx` | Chapter prefetching behavior |
| `chapter-test-helpers.js` | `makeCtx` factory used by every per-chapter test (NOT a test file) |
| `chapters/<topic>/<chapter>.test.jsx` | Per-chapter test, one per chapter file - covers every sub-step and interaction |
| `chapters/cross-chapter.test.jsx` | Cross-cutting assertions (no overlap, ID uniqueness, etc.) |
| `shared/<helper>.test.jsx` | One test file per shared helper (plot, agent-styles, agent-helpers, vector-graphs, rag-helpers, llm-training-helpers) |
| `svg-descriptions.test.js` | SVG description manifest: valid IDs, non-empty descriptions, full coverage |

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
  exceptions. This applies to the first bold T element inside every Box AND to
  any title T inside grid/flex card layouts (multi-column cards inside a Box).
  Inside a card div, the title T MUST have `center`, the description T MUST have
  `center`, and the parent card div MUST also have `textAlign: "center"`. No
  exceptions for "card-style" layouts - if it has a title, it gets centered.
- **Capitalize first letter of every visible text fragment** - every line of
  monospace formula boxes, every cell in tables, every bullet point, every
  column header, every card name/description/note, every SVG text label MUST
  start with a capital letter. Examples that MUST be capitalized: `name:
  "Cosine"`, `latency: "Normal"`, `params: ["Fast to build"]`, `pain: "Queries
  on tenant_id..."`, `tech: "Cross-encoder"`, `year: "Today"`, SVG `<text>`
  labels like "Query" / "Doc" / "Score". Exceptions: brand names that are
  officially lowercase (pgvector, numpy, iPhone), variable identifiers inside a
  math formula expression (the `q_vec` in `Score = cosine(q_vec, d_vec)`),
  parameter syntax (`m = 16`, `ef_search = 40`), tokens like `[CLS]` / `[SEP]`.
  When unsure, capitalize. The first letter of a LINE is what counts -
  everything after a colon or first word does not need re-capitalization.
- **Title-case for diagram box text** - inside any diagram box, decision-tree
  node, flow-chart node, matrix cell, or named card, EVERY WORD has its first
  letter capitalized, not just the first word of the line. Example: a diagram
  box labeled "Retrieve Top K Documents" not "Retrieve top k documents".
  Examples that MUST be title-case: "Cache Hits", "Vector Search", "Prompt
  Cache Only", "Lock-In Risk", "Smaller Embedding", "User Question", "Cosine
  Search In Cache Store", "Eviction", "False-Hit Risk". This rule is stricter
  than the previous "first letter of line" rule and supersedes it specifically
  inside diagram boxes. Exceptions: officially lowercase brand names
  (pgvector, numpy, iPhone, LlamaIndex/LangChain/LangGraph use their official
  capitalizations), variable identifiers in formulas (`q_vec`,
  `embedding_model_version`), parameter syntax (`m = 16`, `ef_search = 40`),
  tokens like `[CLS]` / `[SEP]`. The "first letter of line" rule still
  applies outside diagram boxes (monospace formula lines, bullet text,
  paragraph fragments). When unsure: in a diagram box, capitalize every word;
  outside a diagram box, capitalize only the first word.
- **SVG diagrams must be horizontally centered in their viewBox** - never
  hardcode `x = 40` for elements in a `viewBox 0 0 520 ...`. Compute symmetric
  padding: `x_start = (viewBox_width - element_span) / 2`. Token rows,
  transformer boxes, score circles, and any element-row layout must have equal
  left/right margins. After placing, verify visually in Chrome - do not trust
  the math alone.
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
- **Standalone formulas always centered** - any formula, equation, vector
  display, or worked computation in its own dark/tinted box MUST have
  `textAlign: "center"` on the container div. This includes monospace math
  like `new_weight = old_weight - lr x gradient` and vector displays like
  `[0.2, 0.9, 0.4]`. Inline formulas within flowing text sentences are exempt.
- **SVG search metadata** - every `<svg>` element MUST have a `<desc>` child as
  its first element, describing what the diagram shows in plain language (1-2
  sentences). For JSX SVGs, add `<desc>text</desc>`. For the Graph component,
  pass a `desc` prop. For imperative SVGs (B() factory), call `desc("text")`.
  When adding or modifying an SVG, also add/update the corresponding entry in
  `src/data/svg-descriptions.json`. Descriptions should use terms a learner
  would search for. This is invisible metadata that powers semantic search -
  it never renders visually.

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

## Discoverability Sync Rules - MANDATORY

The site's discoverability (Google, Bing, ChatGPT search, Claude web, Gemini,
Perplexity) depends on metadata staying in sync with content. Whenever a code
change touches any trigger below, update the listed companion files in the SAME
commit. Apply automatically without asking the user.

| If you change... | You MUST also update... |
|---|---|
| `src/config.js` chapters or sectionNames (add / rename / remove / reorder) | `public/llms.txt` "What it covers" topic list, `index.html` JSON-LD `teaches` array, `CLAUDE.md` mapping table |
| Site title, meta description, author name, or tagline (anywhere) | `index.html` (`<title>`, `<meta name="description">`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, JSON-LD `name` / `description`), `public/llms.txt` heading + summary line, footer in `src/learn-ai.jsx` |
| Visual identity (logo, hero gradient, primary colors, favicon) | Regenerate `public/og.png` so social shares look right |
| Site goes from SPA to multi-page routing | `public/sitemap.xml` to list each new URL |
| Author social links (LinkedIn, GitHub, Twitter, etc.) | `index.html` JSON-LD `sameAs` array, `public/llms.txt` Author section, footer in `src/learn-ai.jsx` |

After any of these changes are pushed, remind the user (one sentence, end of
turn) to:
- Request re-indexing in Google Search Console (URL Inspection → Request indexing).
- Submit URL in Bing Webmaster Tools (URL Submission).

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which:

1. Installs dependencies (`npm ci`)
2. Builds the project (`npm run build`)
3. Deploys the `dist/` folder to GitHub Pages

## Commit Conventions

- Use imperative mood ("Add chapter", not "Added chapter")
- Keep subject line under 72 characters
