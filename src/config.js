// Section 0 (Table of Contents) is the only chapter without a section parent.
// It is prepended to the derived `chapters` export below.
const OVERVIEW_CHAPTER = {
  id: "0",
  title: "Table of Contents",
  section: 0,
  component: "TOC",
  file: "table-of-contents/toc",
};

// ---------------------------------------------------------------------------
// sections - the SINGLE SOURCE OF TRUTH for ordering, numbering, and section
// assignment. To reorder/insert/remove chapters, edit this array; the
// `chapters`, `sectionNames`, and `sectionColors` exports below are derived
// from it. IDs are computed from position - never hardcoded.
// ---------------------------------------------------------------------------
export const sections = [
  {
    num: 1,
    slug: "neural-networks",
    name: "Neural Networks - The Mechanics",
    color: "#ef5350",
    desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
    super: "A",
    chapters: [
      {
        file: "neural-foundations/what-is-nn",
        title: "What is a Neural Network?",
        component: "WhatIsNN",
      },
      {
        file: "neural-foundations/inside-neuron",
        title: "Inside a Single Neuron",
        component: "InsideNeuron",
      },
      {
        file: "neural-foundations/what-is-layer",
        title: "What is a Layer?",
        component: "WhatIsLayer",
      },
      {
        file: "neural-foundations/weights-biases",
        title: "Weights & Biases - The Knobs",
        component: "WeightsBiases",
      },
      {
        file: "neural-foundations/why-linear",
        title: "Why Linear Isn't Enough",
        component: "WhyLinear",
      },
      {
        file: "neural-foundations/re-lu",
        title: "Activation (ReLU) - Why Layers Need a Bend",
        component: "ReLU",
      },
      {
        file: "neural-foundations/forward-pass",
        title: "The Forward Pass - Full Example",
        component: "ForwardPass",
      },
    ],
  },
  {
    num: 2,
    slug: "backprop",
    name: "Learning & Backprop",
    color: "#42a5f5",
    desc: "Loss, derivatives, backward pass, gradient descent, why deep backprop is hard",
    super: "A",
    chapters: [
      {
        file: "neural-foundations/loss-function",
        title: "Loss - How Wrong Were We?",
        component: "LossFunction",
      },
      {
        file: "neural-foundations/what-is-learning",
        title: "Learning - What Does It Mean?",
        component: "WhatIsLearning",
      },
      {
        file: "neural-foundations/derivatives",
        title: "Derivatives - The Core Intuition",
        component: "Derivatives",
      },
      {
        file: "neural-foundations/backward-pass",
        title: "The Backward Pass - The Chain Rule",
        component: "BackwardPass",
      },
      {
        file: "neural-foundations/gradient-descent",
        title: "Gradient Descent - Fixing the Weights",
        component: "GradientDescent",
      },
      {
        file: "neural-foundations/backprop-real-network",
        title: "Backprop Through the Real Network",
        component: "BackpropRealNetwork",
      },
      {
        file: "neural-foundations/gradients-in-action",
        title: "Gradients in Action - The Full Training Loop",
        component: "GradientsInAction",
      },
      {
        file: "neural-foundations/why-backprop-hard",
        title: "Why Deep Backprop Gets Hard",
        component: "WhyBackpropHard",
      },
    ],
  },
  {
    num: 3,
    slug: "linear-algebra",
    name: "Linear Algebra for Deep Learning",
    color: "#ab47bc",
    desc: "Vectors, dot product, matrices, layer = matmul, activation functions",
    super: "A",
    chapters: [
      {
        file: "neural-foundations/vectors",
        title: "Vectors - Numbers That Travel Together",
        component: "Vectors",
      },
      {
        file: "neural-foundations/dot-product-intro",
        title: "The Dot Product - How Vectors Compare",
        component: "DotProductIntro",
      },
      {
        file: "neural-foundations/matrices",
        title: "Matrices - Grids That Transform Vectors",
        component: "Matrices",
      },
      {
        file: "neural-foundations/layer-is-mat-mul",
        title: "A Layer is Matrix Multiplication",
        component: "LayerIsMatMul",
      },
      {
        file: "neural-foundations/activation-functions",
        title: "Activation Functions - The Full Picture",
        component: "ActivationFunctions",
      },
    ],
  },
  {
    num: 4,
    slug: "training",
    name: "Training Deep Networks",
    color: "#66bb6a",
    desc: "What deep means, building blocks, dropout, Adam, LR warmup, weight init",
    super: "A",
    chapters: [
      {
        file: "neural-foundations/what-deep-means",
        title: 'What "Deep" Really Means',
        component: "WhatDeepMeans",
      },
      {
        file: "neural-foundations/same-building-blocks",
        title: "Same Building Blocks, Different Shapes",
        component: "SameBuildingBlocks",
      },
      {
        file: "neural-foundations/dropout",
        title: "Dropout - The Regularization Trick",
        component: "Dropout",
      },
      {
        file: "neural-foundations/adam-optimizer",
        title: "Adam - The Real Optimizer",
        component: "AdamOptimizer",
      },
      {
        file: "neural-foundations/lr-warmup-decay",
        title: "Learning Rate Warmup & Decay",
        component: "LRWarmupDecay",
      },
      {
        file: "neural-foundations/weight-init",
        title: "Weight Initialization - How Random?",
        component: "WeightInit",
      },
    ],
  },
  {
    num: 5,
    slug: "pretraining",
    name: "How LLMs Actually Train",
    color: "#00b8d4",
    desc: "Tokenization, self-supervised learning, cross-entropy, SFT, RLHF, batches",
    super: "B",
    chapters: [
      {
        file: "llm-training/tokenization",
        title: "Tokenization - From Words to Numbers",
        component: "Tokenization",
      },
      {
        file: "llm-training/self-supervised",
        title: "Self-Supervised Learning - How GPT Trains",
        component: "SelfSupervised",
      },
      {
        file: "llm-training/cross-entropy",
        title: "Cross-Entropy Loss - The LLM Score",
        component: "CrossEntropy",
      },
      {
        file: "llm-training/nn-in-action",
        title: "The Neural Network in Action",
        component: "NNInAction",
      },
      {
        file: "llm-training/output-layer",
        title: "The Output Layer - From Hidden State to Words",
        component: "OutputLayer",
      },
      {
        file: "llm-training/autoregressive-generation",
        title: "Autoregressive Generation - One Token at a Time",
        component: "AutoregressiveGeneration",
      },
      { file: "llm-training/sft", title: "Supervised Fine-Tuning (SFT)", component: "SFT" },
      {
        file: "llm-training/rlhf",
        title: "RLHF - Making AI Helpful & Safe",
        component: "RLHF",
      },
      { file: "llm-training/dpo", title: "DPO - Simpler Alignment", component: "DPO" },
      {
        file: "llm-training/tokenizer-deep-dive",
        title: "Tokenizer Deep Dive - BPE, WordPiece, SentencePiece",
        component: "TokenizerDeepDive",
      },
    ],
  },
  {
    num: 6,
    slug: "scaling",
    name: "Scaling & Modern Techniques",
    color: "#ffd740",
    desc: "Scaling laws, parameters at scale, distillation, contrastive learning",
    super: "B",
    chapters: [
      {
        file: "scaling/scaling-laws",
        title: "Scaling Laws - Why Bigger Models Win",
        component: "ScalingLaws",
      },
      {
        file: "scaling/parameters-at-scale",
        title: "Parameters at Scale",
        component: "ParametersAtScale",
      },
      {
        file: "llm-training/batch-training",
        title: "Batch Training - Why Not One Example at a Time?",
        component: "BatchTraining",
      },
      {
        file: "scaling/distillation",
        title: "Knowledge Distillation - Teacher to Student",
        component: "Distillation",
      },
      { file: "scaling/clip", title: "CLIP - Teaching AI to See & Read", component: "CLIP" },
      {
        file: "scaling/training-pipeline",
        title: "The Complete Training Pipeline",
        component: "TrainingPipeline",
      },
    ],
  },
  {
    num: 7,
    slug: "road-to-transformers",
    name: "The Road to Transformers",
    color: "#ba68c8",
    desc: "CNN → RNN → why RNN fails → the Transformer arrives",
    super: "C",
    chapters: [
      { file: "road-to-transformers/cnn", title: "CNN", component: "CNN" },
      { file: "road-to-transformers/rnn", title: "RNN", component: "RNN" },
      {
        file: "road-to-transformers/rnn-flaws",
        title: "RNN's Fatal Flaws",
        component: "RNNFlaws",
      },
      {
        file: "road-to-transformers/transformer-arrives",
        title: "The Transformer Arrives",
        component: "TransformerArrives",
      },
    ],
  },
  {
    num: 8,
    slug: "input-pipeline",
    name: "Transformer Input Pipeline",
    color: "#ff9800",
    desc: "Architecture overview, embeddings, positional encoding",
    super: "C",
    chapters: [
      {
        file: "transformer-input/full-architecture",
        title: "The Full Architecture",
        component: "FullArchitecture",
      },
      {
        file: "transformer-input/embeddings",
        title: "Zoom: Embeddings",
        component: "Embeddings",
      },
      {
        file: "transformer-input/pos-encoding-problem",
        title: "Positional Encoding - The Problem",
        component: "PosEncodingProblem",
      },
      {
        file: "transformer-input/pos-encoding-formula",
        title: "Positional Encoding - The Formula",
        component: "PosEncodingFormula",
      },
      {
        file: "transformer-input/pos-encoding-compute",
        title: "Positional Encoding - Computing Positions",
        component: "PosEncodingCompute",
      },
      {
        file: "transformer-input/pos-encoding-fast-slow",
        title: "Positional Encoding - Fast vs Slow",
        component: "PosEncodingFastSlow",
      },
      {
        file: "transformer-input/pos-encoding-final",
        title: "Positional Encoding - Final Addition",
        component: "PosEncodingFinal",
      },
      {
        file: "transformer-input/pos-encoding-heatmap",
        title: "Positional Encoding - The Heatmap",
        component: "PosEncodingHeatmap",
      },
      {
        file: "transformer-input/ro-pe",
        title: "RoPE - Rotary Position Embeddings",
        component: "RoPE",
      },
    ],
  },
  {
    num: 9,
    slug: "qkv",
    name: "Attention - Understanding Q, K, V",
    color: "#66bb6a",
    desc: "Why attention works, Query/Key/Value concepts, analogies",
    super: "C",
    chapters: [
      {
        file: "attention-qkv/context-problem",
        title: "The Problem - Context is Everything",
        component: "ContextProblem",
      },
      {
        file: "attention-qkv/word-lookup",
        title: "How Does a Word Look At Others?",
        component: "WordLookup",
      },
      {
        file: "attention-qkv/dot-product",
        title: "The Dot Product - Measuring Similarity",
        component: "DotProduct",
      },
      {
        file: "attention-qkv/why-not-direct-dot",
        title: "Why Not Dot Product Embeddings Directly?",
        component: "WhyNotDirectDot",
      },
      {
        file: "attention-qkv/qkv-classroom",
        title: "Q, K, V - The Classroom Analogy",
        component: "QKVClassroom",
      },
      {
        file: "attention-qkv/asker-answerer",
        title: "Every Word is Both Asker and Answerer",
        component: "AskerAnswerer",
      },
      {
        file: "attention-qkv/why-kv-different",
        title: "Why Can't Key and Value Be the Same?",
        component: "WhyKVDifferent",
      },
      {
        file: "attention-qkv/google-analogy",
        title: "The Google Search Analogy",
        component: "GoogleAnalogy",
      },
      {
        file: "attention-qkv/how-qkv-created",
        title: "How Are Q, K, V Created?",
        component: "HowQKVCreated",
      },
      {
        file: "attention-qkv/qkv-shapes",
        title: "Shapes - Why Q is Smaller Than the Embedding",
        component: "QKVShapes",
      },
      {
        file: "attention-qkv/w-matrices",
        title: "W Matrices - Learned During Training",
        component: "WMatrices",
      },
      {
        file: "attention-qkv/tracing-example",
        title: "Tracing a Complete Example",
        component: "TracingExample",
      },
    ],
  },
  {
    num: 10,
    slug: "attention",
    name: "Computing Attention",
    color: "#29b6f6",
    desc: "Step-by-step math: Q-K-V dot products, scaling, softmax, weighted sum, full formula",
    super: "C",
    chapters: [
      {
        file: "attention-computation/compute-qkv",
        title: "Step 1 - Compute Q, K, V for Every Word",
        component: "ComputeQKV",
      },
      {
        file: "attention-computation/attention-scores",
        title: "Step 2 - Attention Scores (Dot Products)",
        component: "AttentionScores",
      },
      {
        file: "attention-computation/k-transpose",
        title: "Why K Transpose? - Making the Shapes Fit",
        component: "KTranspose",
      },
      {
        file: "attention-computation/why-softmax",
        title: "Why Do We Need Softmax?",
        component: "WhySoftmax",
      },
      {
        file: "attention-computation/scale-by-root-dk",
        title: "Step 3 - Scale by √d_k",
        component: "ScaleByRootDk",
      },
      {
        file: "attention-computation/softmax-probs",
        title: "Step 4 - Softmax → Probabilities",
        component: "SoftmaxProbs",
      },
      {
        file: "attention-computation/weighted-sum",
        title: "Step 5 - Weighted Sum of Values",
        component: "WeightedSum",
      },
      {
        file: "attention-computation/full-formula",
        title: "The Full Formula",
        component: "FullFormula",
      },
    ],
  },
  {
    num: 11,
    slug: "multi-head",
    name: "Multi-Head Attention",
    color: "#ffee58",
    desc: "Why multi-head, head split, inside each head, concat + W_O, shapes, complete picture",
    super: "C",
    chapters: [
      {
        file: "attention-computation/why-multi-head",
        title: "Why Multi-Head? - The Compromise Problem",
        component: "WhyMultiHead",
      },
      {
        file: "attention-computation/head-split",
        title: "The Split - How 8 Heads Work",
        component: "HeadSplit",
      },
      {
        file: "attention-computation/inside-each-head",
        title: "Inside Each Head - Full Attention in 64 Dims",
        component: "InsideEachHead",
      },
      {
        file: "attention-computation/concat-wo",
        title: "Concat + W_O - Blending All Heads",
        component: "ConcatWO",
      },
      {
        file: "attention-computation/why-eight-heads",
        title: "Why 8 Heads? Parameter Count & Big Picture",
        component: "WhyEightHeads",
      },
      {
        file: "attention-computation/is-wo-constant",
        title: "Is W_O Constant? Does It Change?",
        component: "IsWOConstant",
      },
      {
        file: "attention-computation/attention-shapes",
        title: "Attention Flow - Shapes at Every Step",
        component: "AttentionShapes",
      },
      {
        file: "attention-computation/complete-picture",
        title: "The Complete Picture - In Plain English",
        component: "CompletePicture",
      },
    ],
  },
  {
    num: 12,
    slug: "encoder",
    name: "The Encoder",
    color: "#5c6bc0",
    desc: "Encoder architecture, Add & Norm, FFN, layer stacking",
    super: "C",
    chapters: [
      {
        file: "road-to-transformers/encoder-decoder",
        title: "Encoder & Decoder - The Two Halves",
        component: "EncoderDecoder",
      },
      {
        file: "transformer-block/add-norm",
        title: "Add & Norm - The Stabilizer",
        component: "AddNorm",
      },
      {
        file: "transformer-block/feed-forward-network",
        title: "FFN - The Feed-Forward Network",
        component: "FeedForwardNetwork",
      },
      {
        file: "transformer-block/ffn-parallel-trick",
        title: "FFN - Why Word Count Doesn't Matter",
        component: "FFNParallelTrick",
      },
      {
        file: "transformer-block/add-norm-two",
        title: "Add & Norm (Again) - The Second Stabilizer",
        component: "AddNormTwo",
      },
      {
        file: "transformer-block/transformer-block-repeats",
        title: "Nx - The Transformer Block Repeats",
        component: "TransformerBlockRepeats",
      },
      {
        file: "transformer-block/residual-highway",
        title: "Residual Connections - The Gradient Highway",
        component: "ResidualHighway",
      },
      {
        file: "transformer-block/pre-norm-vs-post-norm",
        title: "Pre-Norm vs Post-Norm",
        component: "PreNormVsPostNorm",
      },
      {
        file: "transformer-block/batch-norm-vs-layer-norm",
        title: "Batch Norm vs Layer Norm",
        component: "BatchNormVsLayerNorm",
      },
    ],
  },
  {
    num: 13,
    slug: "decoder",
    name: "The Decoder",
    color: "#ef5350",
    desc: "Decoder-only, causal masking, cross-attention, full walkthrough",
    super: "C",
    chapters: [
      {
        file: "road-to-transformers/decoder-only",
        title: "Decoder-Only - How Modern LLMs Work",
        component: "DecoderOnly",
      },
      {
        file: "attention-computation/causal-mask",
        title: "Causal Masking - Hiding the Future",
        component: "CausalMask",
      },
      {
        file: "attention-computation/cross-attention",
        title: "Cross-Attention - The Encoder-Decoder Bridge",
        component: "CrossAttention",
      },
      {
        file: "transformer-input/output-head",
        title: "The Output Head - Linear + Softmax",
        component: "OutputHead",
      },
      {
        file: "transformer-input/what-transformer-does",
        title: "What is a Transformer Actually Doing?",
        component: "WhatTransformerDoes",
      },
      {
        file: "encoder-decoder-diagrams/encoder-decoder-training",
        title: "Encoder-Decoder: The Training Flow",
        component: "EncoderDecoderTraining",
      },
      {
        file: "encoder-decoder-diagrams/encoder-decoder-inference",
        title: "Encoder-Decoder: The Inference Flow",
        component: "EncoderDecoderInference",
      },
    ],
  },
  {
    num: 14,
    slug: "modern-techniques",
    name: "Modern LLM Techniques",
    color: "#26a69a",
    desc: "KV cache, grouped-query attention, mixture of experts, reasoning models",
    super: "C",
    chapters: [
      {
        file: "attention-computation/kv-cache",
        title: "KV Cache - Why Inference is Fast",
        component: "KVCache",
      },
      {
        file: "attention-computation/grouped-query-attention",
        title: "Grouped-Query Attention - Shrinking the KV Cache",
        component: "GroupedQueryAttention",
      },
      {
        file: "modern-llm-techniques/mixture-of-experts",
        title: "Mixture of Experts - Bigger Model, Same Compute",
        component: "MixtureOfExperts",
      },
      {
        file: "modern-llm-techniques/thinking",
        title: "Thinking - How Reasoning Models Work",
        component: "Thinking",
      },
    ],
  },
  {
    num: 15,
    slug: "vector-search",
    name: "Vector Search - From Brute Force to ANN",
    color: "#ec407a",
    desc: "Retrieval problem, distance metrics, IVF, HNSW, Vamana",
    super: "D",
    chapters: [
      {
        file: "vector-foundations/retrieval-problem",
        title: "The Retrieval Problem",
        component: "RetrievalProblem",
      },
      {
        file: "vector-foundations/brute-force-knn",
        title: "Brute-Force kNN",
        component: "BruteForceKNN",
      },
      {
        file: "vector-foundations/three-way-tradeoff",
        title: "The Three-Way Tradeoff",
        component: "ThreeWayTradeoff",
      },
      {
        file: "vector-foundations/distance-metrics",
        title: "Distance Metrics",
        component: "DistanceMetrics",
      },
      {
        file: "vector-foundations/sparse-vs-dense",
        title: "Sparse vs Dense Vectors",
        component: "SparseVsDense",
      },
      {
        file: "vector-foundations/ann-family-tree",
        title: "The ANN Family Tree",
        component: "ANNFamilyTree",
      },
      {
        file: "vector-foundations/ivf",
        title: "IVF (Inverted File Index)",
        component: "IVF",
      },
      {
        file: "vector-foundations/hnsw-intuition",
        title: "HNSW - The Small-World Intuition",
        component: "HNSWIntuition",
      },
      {
        file: "vector-foundations/hnsw-construction",
        title: "HNSW Construction",
        component: "HNSWConstruction",
      },
      {
        file: "vector-foundations/hnsw-search",
        title: "HNSW Search",
        component: "HNSWSearch",
      },
      {
        file: "vector-foundations/hnsw-parameters",
        title: "HNSW Parameters",
        component: "HNSWParameters",
      },
      {
        file: "vector-foundations/vamana",
        title: "Vamana / DiskANN",
        component: "Vamana",
      },
    ],
  },
  {
    num: 16,
    slug: "compression",
    name: "Vector Compression - Quantization & Matryoshka",
    color: "#5c6bc0",
    desc: "Memory wall, scalar/product/binary quantization, Matryoshka, IVF-PQ, HNSW+PQ",
    super: "D",
    chapters: [
      {
        file: "vector-compression/memory-wall",
        title: "The Memory Wall",
        component: "MemoryWall",
      },
      {
        file: "vector-compression/scalar-quantization",
        title: "Scalar Quantization",
        component: "ScalarQuantization",
      },
      {
        file: "vector-compression/product-quantization",
        title: "Product Quantization (+ OPQ)",
        component: "ProductQuantization",
      },
      {
        file: "vector-compression/binary-quantization",
        title: "Binary Quantization",
        component: "BinaryQuantization",
      },
      {
        file: "vector-compression/matryoshka",
        title: "Matryoshka Embeddings",
        component: "Matryoshka",
      },
      { file: "vector-compression/ivf-pq", title: "IVF-PQ", component: "IVFPQ" },
      {
        file: "vector-compression/hnsw-pq",
        title: "HNSW + PQ",
        component: "HNSWPQ",
      },
      {
        file: "vector-compression/compression-decision",
        title: "The Compression Decision",
        component: "CompressionDecision",
      },
    ],
  },
  {
    num: 17,
    slug: "production",
    name: "Vector DBs in Production",
    color: "#26c6da",
    desc: "Filtering, updates, sharding, replication, hybrid search, rerankers, lifecycle",
    super: "D",
    chapters: [
      {
        file: "vector-production/filtering",
        title: "Filtering",
        component: "Filtering",
      },
      {
        file: "vector-production/updates-deletes",
        title: "Updates & Deletes",
        component: "UpdatesDeletes",
      },
      {
        file: "vector-production/sharding",
        title: "Sharding & Partitioning",
        component: "Sharding",
      },
      {
        file: "vector-production/replication",
        title: "Replication & High Availability",
        component: "Replication",
      },
      {
        file: "vector-production/hybrid-search",
        title: "Hybrid Search",
        component: "HybridSearch",
      },
      {
        file: "vector-production/rerankers",
        title: "Rerankers",
        component: "Rerankers",
      },
      {
        file: "vector-production/multi-vector-retrieval",
        title: "Multi-vector Retrieval (ColBERT-style)",
        component: "MultiVectorRetrieval",
      },
      {
        file: "vector-production/embedding-lifecycle",
        title: "Embedding Lifecycle & Re-embedding",
        component: "EmbeddingLifecycle",
      },
      {
        file: "vector-production/observability",
        title: "Observability",
        component: "Observability",
      },
      {
        file: "vector-production/capacity-planning",
        title: "Capacity Planning & Cost Models",
        component: "CapacityPlanning",
      },
    ],
  },
  {
    num: 18,
    slug: "picking-db",
    name: "Picking a Vector Database",
    color: "#ab47bc",
    desc: "FAISS, pgvector, Qdrant, Pinecone, Weaviate/Milvus/Chroma, decision framework",
    super: "D",
    chapters: [
      { file: "vector-systems/faiss", title: "FAISS", component: "FAISS" },
      { file: "vector-systems/pgvector", title: "pgvector", component: "Pgvector" },
      { file: "vector-systems/qdrant", title: "Qdrant", component: "Qdrant" },
      { file: "vector-systems/pinecone", title: "Pinecone", component: "Pinecone" },
      {
        file: "vector-systems/qdrant-vs-pinecone",
        title: "Qdrant vs Pinecone",
        component: "QdrantVsPinecone",
      },
      {
        file: "vector-systems/weaviate-milvus-chroma",
        title: "Weaviate / Milvus / Chroma",
        component: "WeaviateMilvusChroma",
      },
      {
        file: "vector-systems/decision-framework",
        title: "The Decision Framework",
        component: "DecisionFramework",
      },
    ],
  },
  {
    num: 19,
    slug: "pipeline",
    name: "The RAG Pipeline - Why & How It Breaks",
    color: "#66bb6a",
    desc: "Why LLMs need retrieval, naive RAG pipeline, where it breaks",
    super: "E",
    chapters: [
      {
        file: "rag-foundations/why-llms-need-retrieval",
        title: "Why LLMs Need Retrieval",
        component: "WhyLLMsNeedRetrieval",
      },
      {
        file: "rag-foundations/naive-rag-pipeline",
        title: "The Naive RAG Pipeline",
        component: "NaiveRAGPipeline",
      },
      {
        file: "rag-foundations/where-naive-rag-breaks",
        title: "Where Naive RAG Breaks",
        component: "WhereNaiveRAGBreaks",
      },
    ],
  },
  {
    num: 20,
    slug: "ingestion",
    name: "RAG Data Prep - Ingestion & Chunking",
    color: "#42a5f5",
    desc: "Parsing, deduplication, refresh, all chunking strategies, decision matrix",
    super: "E",
    chapters: [
      {
        file: "rag-ingestion/parsing-extraction",
        title: "Parsing - Raw Sources to Clean Text",
        component: "ParsingExtraction",
      },
      {
        file: "rag-ingestion/deduplication-cleaning",
        title: "Deduplication & Cleaning",
        component: "DeduplicationCleaning",
      },
      {
        file: "rag-ingestion/refresh-sync",
        title: "Refresh & Sync Schedules",
        component: "RefreshSync",
      },
      {
        file: "rag-foundations/why-chunk-fixed-size",
        title: "Why Chunk At All + Fixed-Size Baseline",
        component: "WhyChunkFixedSize",
      },
      {
        file: "rag-foundations/recursive-structural-chunking",
        title: "Recursive Structural Chunking",
        component: "RecursiveStructuralChunking",
      },
      {
        file: "rag-foundations/semantic-chunking",
        title: "Semantic Chunking",
        component: "SemanticChunking",
      },
      {
        file: "rag-foundations/late-chunking",
        title: "Late Chunking (Jina 2024)",
        component: "LateChunking",
      },
      {
        file: "rag-foundations/hierarchical-chunking",
        title: "Hierarchical / Parent-Child Chunking",
        component: "HierarchicalChunking",
      },
      {
        file: "rag-foundations/contextual-retrieval",
        title: "Contextual Retrieval (Anthropic 2024)",
        component: "ContextualRetrieval",
      },
      {
        file: "rag-foundations/chunking-decision",
        title: "The Chunking Decision",
        component: "ChunkingDecision",
      },
    ],
  },
  {
    num: 21,
    slug: "retrieval",
    name: "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
    color: "#ab47bc",
    desc: "Embedding model picking, domain adaptation, hybrid, reranker cascade, HyDE, multi-query, routing",
    super: "E",
    chapters: [
      {
        file: "rag-retrieval/embedding-model-choice",
        title: "Picking an Embedding Model",
        component: "EmbeddingModelChoice",
      },
      {
        file: "rag-retrieval/domain-adaptation",
        title: "Domain Adaptation - Fine-Tuning Embeddings",
        component: "DomainAdaptation",
      },
      {
        file: "rag-retrieval/hybrid-for-rag",
        title: "Hybrid Retrieval for RAG",
        component: "HybridForRAG",
      },
      {
        file: "rag-retrieval/reranker-cascade",
        title: "The Reranker Cascade",
        component: "RerankerCascade",
      },
      {
        file: "rag-retrieval/why-transform-queries",
        title: "Why Transform Queries",
        component: "WhyTransformQueries",
      },
      {
        file: "rag-retrieval/hy-de",
        title: "HyDE - Hypothetical Document Embeddings",
        component: "HyDE",
      },
      {
        file: "rag-retrieval/multi-query-expansion",
        title: "Multi-Query Expansion",
        component: "MultiQueryExpansion",
      },
      {
        file: "rag-retrieval/query-routing-decomposition",
        title: "Query Routing & Decomposition",
        component: "QueryRoutingDecomposition",
      },
    ],
  },
  {
    num: 22,
    slug: "generation",
    name: "RAG Generation - Naive to Advanced Patterns",
    color: "#ffd54f",
    desc: "Context packing, citations, multi-hop, Self-RAG, CRAG, GraphRAG, agentic RAG, long-context",
    super: "E",
    chapters: [
      {
        file: "rag-generation/context-packing",
        title: "Context Packing",
        component: "ContextPacking",
      },
      {
        file: "rag-generation/lost-in-the-middle",
        title: "The Lost-in-the-Middle Problem",
        component: "LostInTheMiddle",
      },
      {
        file: "rag-generation/citations-refusal",
        title: "Citations, Refusal & Groundedness",
        component: "CitationsRefusal",
      },
      {
        file: "rag-generation/multi-hop-retrieval",
        title: "Multi-Hop Retrieval",
        component: "MultiHopRetrieval",
      },
      { file: "rag-generation/self-rag", title: "Self-RAG", component: "SelfRAG" },
      {
        file: "rag-generation/corrective-rag",
        title: "CRAG - Corrective RAG",
        component: "CorrectiveRAG",
      },
      {
        file: "rag-generation/graph-rag",
        title: "GraphRAG (Microsoft 2024)",
        component: "GraphRAG",
      },
      {
        file: "rag-generation/agentic-rag",
        title: "Tool-Augmented & Agentic RAG",
        component: "AgenticRAG",
      },
      {
        file: "rag-generation/long-context-vs-rag",
        title: "Long-Context vs RAG",
        component: "LongContextVsRAG",
      },
    ],
  },
  {
    num: 23,
    slug: "shipping",
    name: "RAG in Production - Eval, Cost & Shipping",
    color: "#26c6da",
    desc: "Eval triangle, RAGAS, golden datasets, caching, cost, observability, hallucination, framework choice",
    super: "E",
    chapters: [
      {
        file: "rag-evaluation/rag-eval-triangle",
        title: "The RAG Eval Triangle",
        component: "RAGEvalTriangle",
      },
      {
        file: "rag-evaluation/llm-as-judge",
        title: "LLM-as-Judge",
        component: "LLMAsJudge",
      },
      {
        file: "rag-evaluation/ragas-metrics",
        title: "RAGAS Metrics",
        component: "RAGASMetrics",
      },
      {
        file: "rag-evaluation/golden-datasets",
        title: "Golden Datasets",
        component: "GoldenDatasets",
      },
      {
        file: "rag-evaluation/online-eval-ab-testing",
        title: "Online Eval & A/B Testing",
        component: "OnlineEvalABTesting",
      },
      {
        file: "rag-production/caching",
        title: "Caching - Prompt + Semantic",
        component: "Caching",
      },
      {
        file: "rag-production/cost-models",
        title: "Cost Models",
        component: "CostModels",
      },
      {
        file: "rag-production/observability-tracing",
        title: "Observability & Tracing",
        component: "ObservabilityTracing",
      },
      {
        file: "rag-production/hallucination-drift",
        title: "Hallucination Detection & Drift",
        component: "HallucinationDrift",
      },
      {
        file: "rag-production/framework-choice",
        title: "Framework Choice",
        component: "FrameworkChoice",
      },
      {
        file: "rag-production/rag-decision-framework-capstone",
        title: "The Complete RAG Decision Framework + Capstone",
        component: "RAGDecisionFrameworkCapstone",
      },
    ],
  },
  {
    num: 24,
    slug: "prompting",
    name: "Prompting LLMs - The Foundation",
    color: "#29b6f6",
    desc: "Anatomy of LLM call, system prompts, few-shot, CoT, prompt vs tune vs RAG vs agent, context engineering",
    super: "F",
    chapters: [
      {
        file: "agent-prompting/anatomy-of-llm-call",
        title: "Anatomy of an LLM Call",
        component: "AnatomyOfLlmCall",
      },
      {
        file: "agent-prompting/system-prompt-contract",
        title: "System Prompts - The Role Contract",
        component: "SystemPromptContract",
      },
      {
        file: "agent-prompting/few-shot-structured-output",
        title: "Few-Shot + Structured Output",
        component: "FewShotStructuredOutput",
      },
      {
        file: "agent-prompting/chain-of-thought-self-consistency",
        title: "Chain of Thought + Self-Consistency",
        component: "ChainOfThoughtSelfConsistency",
      },
      {
        file: "agent-prompting/prompt-vs-tune-vs-rag-vs-agent",
        title: "Prompt vs Fine-Tune vs RAG vs Agent",
        component: "PromptVsTuneVsRagVsAgent",
      },
      {
        file: "agent-prompting/context-engineering",
        title: "Context Engineering",
        component: "ContextEngineering",
      },
    ],
  },
  {
    num: 25,
    slug: "tools",
    name: "Tools & Protocols - MCP, A2A",
    color: "#ef5350",
    desc: "Tool use, JSON schemas, lifecycle, parallel tools, errors, MCP architecture/primitives/security, A2A",
    super: "F",
    chapters: [
      {
        file: "agent-tools/tool-use-as-bridge",
        title: "Tool Use - LLM as Orchestrator",
        component: "ToolUseAsBridge",
      },
      {
        file: "agent-tools/json-schema-for-tools",
        title: "JSON Schemas + Tool Descriptions",
        component: "JsonSchemaForTools",
      },
      {
        file: "agent-tools/tool-call-lifecycle",
        title: "Tool Call Lifecycle",
        component: "ToolCallLifecycle",
      },
      {
        file: "agent-tools/parallel-tools-and-choice",
        title: "Parallel Tools + Tool Choice",
        component: "ParallelToolsAndChoice",
      },
      {
        file: "agent-tools/tool-errors-retries",
        title: "Tool Errors, Retries, Validation",
        component: "ToolErrorsRetries",
      },
      {
        file: "agent-tools/why-protocols",
        title: "Why Protocols?",
        component: "WhyProtocols",
      },
      {
        file: "agent-tools/mcp-architecture",
        title: "MCP Architecture",
        component: "McpArchitecture",
      },
      {
        file: "agent-tools/mcp-primitives",
        title: "MCP Primitives - Tools, Resources, Prompts",
        component: "McpPrimitives",
      },
      {
        file: "agent-tools/building-mcp-server",
        title: "Building an MCP Server",
        component: "BuildingMcpServer",
      },
      {
        file: "agent-tools/mcp-security",
        title: "MCP Security",
        component: "McpSecurity",
      },
      {
        file: "agent-tools/a2a-protocol",
        title: "A2A - Agent-to-Agent Protocol",
        component: "A2AProtocol",
      },
    ],
  },
  {
    num: 26,
    slug: "mechanics",
    name: "Agent Mechanics - Loops & Memory",
    color: "#66bb6a",
    desc: "Workflow vs agent, agent loop, ReAct, plan-execute, termination, memory types, context management",
    super: "F",
    chapters: [
      {
        file: "agent-loops/workflow-vs-agent",
        title: "Workflow vs Agent",
        component: "WorkflowVsAgent",
      },
      {
        file: "agent-loops/workflow-primitives",
        title: "Workflow Primitives - Chaining, Routing, Parallelization",
        component: "WorkflowPrimitives",
      },
      {
        file: "agent-loops/agent-loop",
        title: "The Agent Loop",
        component: "AgentLoop",
      },
      {
        file: "agent-loops/re-act-pattern",
        title: "ReAct Pattern",
        component: "ReActPattern",
      },
      {
        file: "agent-loops/plan-execute-reflect",
        title: "Plan-Execute + Reflection",
        component: "PlanExecuteReflect",
      },
      {
        file: "agent-loops/loop-termination",
        title: "Loop Termination",
        component: "LoopTermination",
      },
      {
        file: "agent-loops/memory-taxonomy",
        title: "Memory Taxonomy - Short vs Long",
        component: "MemoryTaxonomy",
      },
      {
        file: "agent-loops/working-memory",
        title: "Working Memory - The Scratchpad",
        component: "WorkingMemory",
      },
      {
        file: "agent-loops/episodic-memory",
        title: "Episodic Memory - Past Events",
        component: "EpisodicMemory",
      },
      {
        file: "agent-loops/semantic-memory",
        title: "Semantic Memory - Learned Facts",
        component: "SemanticMemory",
      },
      {
        file: "agent-loops/procedural-memory",
        title: "Procedural Memory - Learned Skills",
        component: "ProceduralMemory",
      },
      {
        file: "agent-loops/summary-and-context-mgmt",
        title: "Summary Memory + Context Window Management",
        component: "SummaryAndContextMgmt",
      },
    ],
  },
  {
    num: 27,
    slug: "multi-agent",
    name: "Multi-Agent Systems",
    color: "#ff9800",
    desc: "Orchestrator-worker, supervisor, handoffs, critic/debate, failure modes, agentic RAG",
    super: "F",
    chapters: [
      {
        file: "multi-agent/why-multi-agent",
        title: "Why Multi-Agent?",
        component: "WhyMultiAgent",
      },
      {
        file: "multi-agent/orchestrator-worker",
        title: "Orchestrator-Worker",
        component: "OrchestratorWorker",
      },
      {
        file: "multi-agent/supervisor-hierarchy",
        title: "Supervisor / Hierarchical",
        component: "SupervisorHierarchy",
      },
      {
        file: "multi-agent/agent-handoffs",
        title: "Hand-Offs",
        component: "AgentHandoffs",
      },
      {
        file: "multi-agent/critic-debate",
        title: "Critic / Debate / Reflection-as-Multi-Agent",
        component: "CriticDebate",
      },
      {
        file: "multi-agent/multi-agent-failures",
        title: "Multi-Agent Failure Modes",
        component: "MultiAgentFailures",
      },
      {
        file: "multi-agent/agentic-rag",
        title: "Agentic RAG",
        component: "AgenticRag",
      },
    ],
  },
  {
    num: 28,
    slug: "shipping",
    name: "Shipping Agents - Eval, Safety, Frameworks",
    color: "#f06292",
    desc: "Evals, observability, cost/latency, guardrails, injection defenses, framework picks",
    super: "F",
    chapters: [
      {
        file: "agent-evals/why-eval-agents",
        title: "Why Eval Agents Differently",
        component: "WhyEvalAgents",
      },
      {
        file: "agent-evals/eval-dimensions",
        title: "Eval Dimensions",
        component: "EvalDimensions",
      },
      {
        file: "agent-evals/llm-as-judge",
        title: "LLM-as-Judge",
        component: "LlmAsJudge",
      },
      {
        file: "agent-evals/trace-evals",
        title: "Trace Evals",
        component: "TraceEvals",
      },
      {
        file: "agent-evals/eval-sets-continuous",
        title: "Eval Sets + Continuous Eval",
        component: "EvalSetsContinuous",
      },
      {
        file: "agent-production/agent-observability-tracing",
        title: "Observability & Tracing",
        component: "AgentObservabilityTracing",
      },
      {
        file: "agent-production/cost-control",
        title: "Cost Control",
        component: "CostControl",
      },
      {
        file: "agent-production/latency-optimization",
        title: "Latency Optimization",
        component: "LatencyOptimization",
      },
      {
        file: "agent-production/guardrails",
        title: "Guardrails",
        component: "Guardrails",
      },
      {
        file: "agent-production/prompt-injection-defenses",
        title: "Prompt Injection Defenses",
        component: "PromptInjectionDefenses",
      },
      {
        file: "agent-production/tool-security",
        title: "Tool Security",
        component: "ToolSecurity",
      },
      {
        file: "agent-production/lang-graph-framework",
        title: "LangGraph",
        component: "LangGraphFramework",
      },
      {
        file: "agent-production/crew-ai-auto-gen",
        title: "CrewAI / AutoGen",
        component: "CrewAiAutoGen",
      },
      {
        file: "agent-production/vendor-sdks",
        title: "Claude Agent SDK + OpenAI Agents",
        component: "VendorSdks",
      },
      {
        file: "agent-production/custom-no-framework",
        title: "Custom / No-Framework",
        component: "CustomNoFramework",
      },
      {
        file: "agent-production/agent-decision-framework",
        title: "The Complete Agent Decision Framework",
        component: "AgentDecisionFramework",
      },
    ],
  },
];

// Super-section groupings (single source of truth for the 6 super-sections).
export const superSections = [
  {
    id: "A",
    slug: "deep-learning",
    name: "Foundations of Deep Learning",
    color: "#d9a04a",
    desc: "Neural networks from a single neuron to deep training: backprop, linear algebra, depth.",
    sections: [1, 2, 3, 4],
  },
  {
    id: "B",
    slug: "llm-rise",
    name: "The Rise of LLMs",
    color: "#d6759a",
    desc: "How language models are trained at scale: self-supervised learning, fine-tuning, RLHF, scaling laws.",
    sections: [5, 6],
  },
  {
    id: "C",
    slug: "transformers",
    name: "The Transformer Era",
    color: "#7e9eb0",
    desc: "Architecture deep dive: attention, encoder, decoder, plus modern tricks (KV cache, MoE).",
    sections: [7, 8, 9, 10, 11, 12, 13, 14],
  },
  {
    id: "D",
    slug: "vector-databases",
    name: "Vector Databases at Depth",
    color: "#a1b54a",
    desc: "ANN algorithms, vector compression, production storage, and choosing the right vector DB.",
    sections: [15, 16, 17, 18],
  },
  {
    id: "E",
    slug: "rag",
    name: "Retrieval Augmented Generation (RAG)",
    color: "#c66951",
    desc: "End-to-end RAG: ingestion, chunking, retrieval tricks, generation patterns, eval, and shipping.",
    sections: [19, 20, 21, 22, 23],
  },
  {
    id: "F",
    slug: "agents",
    name: "Agentic AI",
    color: "#9c8cc2",
    desc: "From prompting basics to tools/MCP, agent loops, multi-agent systems, and production agents.",
    sections: [24, 25, 26, 27, 28],
  },
];

// Reverse index: section number → super-section id. Derived from superSections.
export const sectionSuper = (() => {
  const out = {};
  for (const sg of superSections) {
    for (const s of sg.sections) out[s] = sg.id;
  }
  return out;
})();

// ---------------------------------------------------------------------------
// Derived back-compat exports - DO NOT EDIT BY HAND. These are computed from
// the `sections` array above. To change ordering / numbering, edit `sections`.
// ---------------------------------------------------------------------------
export const chapters = (() => {
  const out = [OVERVIEW_CHAPTER];
  sections.forEach((s) => {
    s.chapters.forEach((c, i) => {
      out.push({
        id: `${s.num}.${i + 1}`,
        file: c.file,
        title: c.title,
        component: c.component,
        section: s.num,
      });
    });
  });
  return out;
})();

export const sectionNames = Object.fromEntries([[0, "Overview"], ...sections.map((s) => [s.num, s.name])]);

export const sectionColors = Object.fromEntries(sections.map((s) => [s.num, s.color]));

// Colors
export const C = {
  bg: "#08080d",
  card: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.07)",
  dim: "rgba(255,255,255,0.35)",
  mid: "rgba(255,255,255,0.55)",
  bright: "rgba(255,255,255,0.85)",
  red: "#ff6b6b",
  purple: "#a78bfa",
  green: "#00e676",
  cyan: "#00b8d4",
  yellow: "#ffd740",
  pink: "#e040fb",
  orange: "#ffab40",
  blue: "#42a5f5",
  indigo: "#5c6bc0",
  teal: "#26c6da",
  amber: "#ffc107",
};

// Validate config - extracted for testability
export function validateConfig(chapterList) {
  const errors = [];
  const ids = chapterList.map((c) => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) errors.push(`Duplicate chapter IDs: ${dupes.join(", ")}`);

  const files = chapterList.filter((c) => c.file).map((c) => c.file);
  const dupeFiles = files.filter((f, i) => files.indexOf(f) !== i);
  if (dupeFiles.length) errors.push(`Duplicate files: ${dupeFiles.join(", ")}`);

  chapterList.forEach((c) => {
    if (c.component && !c.id) errors.push(`Chapter missing id: ${c.component}`);
    if (!c.component) errors.push(`Chapter missing component: id=${c.id}`);
    if (!c.file) errors.push(`Chapter missing file: id=${c.id}`);
  });
  return errors;
}

// Config validation runs via tests (see config.test.js) using validateConfig().
