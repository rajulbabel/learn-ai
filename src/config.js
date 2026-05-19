// Section 0 (Table of Contents) is the only chapter without a section parent.
// It is prepended to the derived `chapters` export below.
const OVERVIEW_CHAPTER = {
  id: "0",
  title: "Table of Contents",
  section: 0,
  component: "TOC",
  file: "table-of-contents/toc",
  slug: "table-of-contents/toc",
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
    name: "Neural Networks - The Mechanics",
    color: "#ff6b6b",
    desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
    super: "A",
    chapters: [
      { slug: "neural-foundations/what-is-nn",        file: "neural-foundations/what-is-nn",        title: "What is a Neural Network?",                  component: "WhatIsNN" },
      { slug: "neural-foundations/inside-neuron",     file: "neural-foundations/inside-neuron",     title: "Inside a Single Neuron",                     component: "InsideNeuron" },
      { slug: "neural-foundations/what-is-layer",     file: "neural-foundations/what-is-layer",     title: "What is a Layer?",                           component: "WhatIsLayer" },
      { slug: "neural-foundations/weights-biases",    file: "neural-foundations/weights-biases",    title: "Weights & Biases - The Knobs",               component: "WeightsBiases" },
      { slug: "neural-foundations/why-linear",        file: "neural-foundations/why-linear",        title: "Why Linear Isn't Enough",                    component: "WhyLinear" },
      { slug: "neural-foundations/re-lu",             file: "neural-foundations/re-lu",             title: "Activation (ReLU) - Why Layers Need a Bend", component: "ReLU" },
      { slug: "neural-foundations/forward-pass",      file: "neural-foundations/forward-pass",      title: "The Forward Pass - Full Example",            component: "ForwardPass" },
    ],
  },
  {
    num: 2,
    name: "Learning & Backprop",
    color: "#ff8a80",
    desc: "Loss, derivatives, backward pass, gradient descent, why deep backprop is hard",
    super: "A",
    chapters: [
      { slug: "neural-foundations/loss-function",          file: "neural-foundations/loss-function",          title: "Loss - How Wrong Were We?",                     component: "LossFunction" },
      { slug: "neural-foundations/what-is-learning",       file: "neural-foundations/what-is-learning",       title: "Learning - What Does It Mean?",                 component: "WhatIsLearning" },
      { slug: "neural-foundations/derivatives",            file: "neural-foundations/derivatives",            title: "Derivatives - The Core Intuition",              component: "Derivatives" },
      { slug: "neural-foundations/backward-pass",          file: "neural-foundations/backward-pass",          title: "The Backward Pass - The Chain Rule",            component: "BackwardPass" },
      { slug: "neural-foundations/gradient-descent",       file: "neural-foundations/gradient-descent",       title: "Gradient Descent - Fixing the Weights",         component: "GradientDescent" },
      { slug: "neural-foundations/backprop-real-network",  file: "neural-foundations/backprop-real-network",  title: "Backprop Through the Real Network",             component: "BackpropRealNetwork" },
      { slug: "neural-foundations/gradients-in-action",    file: "neural-foundations/gradients-in-action",    title: "Gradients in Action - The Full Training Loop",  component: "GradientsInAction" },
      { slug: "neural-foundations/why-backprop-hard",      file: "neural-foundations/why-backprop-hard",      title: "Why Deep Backprop Gets Hard",                   component: "WhyBackpropHard" },
    ],
  },
  {
    num: 3,
    name: "Linear Algebra for Deep Learning",
    color: "#ef9a9a",
    desc: "Vectors, dot product, matrices, layer = matmul, activation functions",
    super: "A",
    chapters: [
      { slug: "neural-foundations/vectors",               file: "neural-foundations/vectors",               title: "Vectors - Numbers That Travel Together",   component: "Vectors" },
      { slug: "neural-foundations/dot-product-intro",     file: "neural-foundations/dot-product-intro",     title: "The Dot Product - How Vectors Compare",    component: "DotProductIntro" },
      { slug: "neural-foundations/matrices",              file: "neural-foundations/matrices",              title: "Matrices - Grids That Transform Vectors",  component: "Matrices" },
      { slug: "neural-foundations/layer-is-mat-mul",      file: "neural-foundations/layer-is-mat-mul",      title: "A Layer is Matrix Multiplication",         component: "LayerIsMatMul" },
      { slug: "neural-foundations/activation-functions", file: "neural-foundations/activation-functions", title: "Activation Functions - The Full Picture",   component: "ActivationFunctions" },
    ],
  },
  {
    num: 4,
    name: "Training Deep Networks",
    color: "#e57373",
    desc: "What deep means, building blocks, dropout, Adam, LR warmup, weight init",
    super: "A",
    chapters: [
      { slug: "neural-foundations/what-deep-means",       file: "neural-foundations/what-deep-means",       title: 'What "Deep" Really Means',                  component: "WhatDeepMeans" },
      { slug: "neural-foundations/same-building-blocks",  file: "neural-foundations/same-building-blocks",  title: "Same Building Blocks, Different Shapes",    component: "SameBuildingBlocks" },
      { slug: "neural-foundations/dropout",               file: "neural-foundations/dropout",               title: "Dropout - The Regularization Trick",        component: "Dropout" },
      { slug: "neural-foundations/adam-optimizer",        file: "neural-foundations/adam-optimizer",        title: "Adam - The Real Optimizer",                 component: "AdamOptimizer" },
      { slug: "neural-foundations/lr-warmup-decay",       file: "neural-foundations/lr-warmup-decay",       title: "Learning Rate Warmup & Decay",              component: "LRWarmupDecay" },
      { slug: "neural-foundations/weight-init",           file: "neural-foundations/weight-init",           title: "Weight Initialization - How Random?",       component: "WeightInit" },
    ],
  },
  {
    num: 5,
    name: "How LLMs Actually Train",
    color: "#00b8d4",
    desc: "Tokenization, self-supervised learning, cross-entropy, SFT, RLHF, batches",
    super: "B",
    chapters: [
      { slug: "llm-training/tokenization",                 file: "llm-training/tokenization",                 title: "Tokenization - From Words to Numbers",                   component: "Tokenization" },
      { slug: "llm-training/self-supervised",              file: "llm-training/self-supervised",              title: "Self-Supervised Learning - How GPT Trains",              component: "SelfSupervised" },
      { slug: "llm-training/cross-entropy",                file: "llm-training/cross-entropy",                title: "Cross-Entropy Loss - The LLM Score",                     component: "CrossEntropy" },
      { slug: "llm-training/nn-in-action",                 file: "llm-training/nn-in-action",                 title: "The Neural Network in Action",                           component: "NNInAction" },
      { slug: "llm-training/output-layer",                 file: "llm-training/output-layer",                 title: "The Output Layer - From Hidden State to Words",          component: "OutputLayer" },
      { slug: "llm-training/autoregressive-generation",    file: "llm-training/autoregressive-generation",    title: "Autoregressive Generation - One Token at a Time",        component: "AutoregressiveGeneration" },
      { slug: "llm-training/sft",                          file: "llm-training/sft",                          title: "Supervised Fine-Tuning (SFT)",                           component: "SFT" },
      { slug: "llm-training/rlhf",                         file: "llm-training/rlhf",                         title: "RLHF - Making AI Helpful & Safe",                        component: "RLHF" },
      { slug: "llm-training/dpo",                          file: "llm-training/dpo",                          title: "DPO - Simpler Alignment",                                component: "DPO" },
      { slug: "llm-training/tokenizer-deep-dive",          file: "llm-training/tokenizer-deep-dive",          title: "Tokenizer Deep Dive - BPE, WordPiece, SentencePiece",    component: "TokenizerDeepDive" },
    ],
  },
  {
    num: 6,
    name: "Scaling & Modern Techniques",
    color: "#ffd740",
    desc: "Scaling laws, parameters at scale, distillation, contrastive learning",
    super: "B",
    chapters: [
      { slug: "scaling/scaling-laws",            file: "scaling/scaling-laws",            title: "Scaling Laws - Why Bigger Models Win",                  component: "ScalingLaws" },
      { slug: "scaling/parameters-at-scale",     file: "scaling/parameters-at-scale",     title: "Parameters at Scale",                                   component: "ParametersAtScale" },
      { slug: "llm-training/batch-training",     file: "llm-training/batch-training",     title: "Batch Training - Why Not One Example at a Time?",        component: "BatchTraining" },
      { slug: "scaling/distillation",            file: "scaling/distillation",            title: "Knowledge Distillation - Teacher to Student",            component: "Distillation" },
      { slug: "scaling/clip",                    file: "scaling/clip",                    title: "CLIP - Teaching AI to See & Read",                       component: "CLIP" },
      { slug: "scaling/training-pipeline",       file: "scaling/training-pipeline",       title: "The Complete Training Pipeline",                         component: "TrainingPipeline" },
    ],
  },
  {
    num: 7,
    name: "The Road to Transformers",
    color: "#a78bfa",
    desc: "CNN → RNN → why RNN fails → the Transformer arrives",
    super: "C",
    chapters: [
      { slug: "road-to-transformers/cnn",                  file: "road-to-transformers/cnn",                  title: "CNN",                       component: "CNN" },
      { slug: "road-to-transformers/rnn",                  file: "road-to-transformers/rnn",                  title: "RNN",                       component: "RNN" },
      { slug: "road-to-transformers/rnn-flaws",            file: "road-to-transformers/rnn-flaws",            title: "RNN's Fatal Flaws",         component: "RNNFlaws" },
      { slug: "road-to-transformers/transformer-arrives", file: "road-to-transformers/transformer-arrives", title: "The Transformer Arrives",    component: "TransformerArrives" },
    ],
  },
  {
    num: 8,
    name: "Transformer Input Pipeline",
    color: "#ffab40",
    desc: "Architecture overview, embeddings, positional encoding",
    super: "C",
    chapters: [
      { slug: "transformer-input/full-architecture",     file: "transformer-input/full-architecture",     title: "The Full Architecture",                        component: "FullArchitecture" },
      { slug: "transformer-input/embeddings",            file: "transformer-input/embeddings",            title: "Zoom: Embeddings",                             component: "Embeddings" },
      { slug: "transformer-input/pos-encoding-problem",  file: "transformer-input/pos-encoding-problem",  title: "Positional Encoding - The Problem",            component: "PosEncodingProblem" },
      { slug: "transformer-input/pos-encoding-formula",  file: "transformer-input/pos-encoding-formula",  title: "Positional Encoding - The Formula",            component: "PosEncodingFormula" },
      { slug: "transformer-input/pos-encoding-compute",  file: "transformer-input/pos-encoding-compute",  title: "Positional Encoding - Computing Positions",    component: "PosEncodingCompute" },
      { slug: "transformer-input/pos-encoding-fast-slow", file: "transformer-input/pos-encoding-fast-slow", title: "Positional Encoding - Fast vs Slow",           component: "PosEncodingFastSlow" },
      { slug: "transformer-input/pos-encoding-final",    file: "transformer-input/pos-encoding-final",    title: "Positional Encoding - Final Addition",         component: "PosEncodingFinal" },
      { slug: "transformer-input/pos-encoding-heatmap",  file: "transformer-input/pos-encoding-heatmap",  title: "Positional Encoding - The Heatmap",            component: "PosEncodingHeatmap" },
      { slug: "transformer-input/ro-pe",                 file: "transformer-input/ro-pe",                 title: "RoPE - Rotary Position Embeddings",            component: "RoPE" },
    ],
  },
  {
    num: 9,
    name: "Attention - Understanding Q, K, V",
    color: "#00e676",
    desc: "Why attention works, Query/Key/Value concepts, analogies",
    super: "C",
    chapters: [
      { slug: "attention-qkv/context-problem",     file: "attention-qkv/context-problem",     title: "The Problem - Context is Everything",            component: "ContextProblem" },
      { slug: "attention-qkv/word-lookup",         file: "attention-qkv/word-lookup",         title: "How Does a Word Look At Others?",                component: "WordLookup" },
      { slug: "attention-qkv/dot-product",         file: "attention-qkv/dot-product",         title: "The Dot Product - Measuring Similarity",         component: "DotProduct" },
      { slug: "attention-qkv/why-not-direct-dot",  file: "attention-qkv/why-not-direct-dot",  title: "Why Not Dot Product Embeddings Directly?",       component: "WhyNotDirectDot" },
      { slug: "attention-qkv/qkv-classroom",       file: "attention-qkv/qkv-classroom",       title: "Q, K, V - The Classroom Analogy",                component: "QKVClassroom" },
      { slug: "attention-qkv/asker-answerer",      file: "attention-qkv/asker-answerer",      title: "Every Word is Both Asker and Answerer",          component: "AskerAnswerer" },
      { slug: "attention-qkv/why-kv-different",    file: "attention-qkv/why-kv-different",    title: "Why Can't Key and Value Be the Same?",           component: "WhyKVDifferent" },
      { slug: "attention-qkv/google-analogy",      file: "attention-qkv/google-analogy",      title: "The Google Search Analogy",                      component: "GoogleAnalogy" },
      { slug: "attention-qkv/how-qkv-created",     file: "attention-qkv/how-qkv-created",     title: "How Are Q, K, V Created?",                       component: "HowQKVCreated" },
      { slug: "attention-qkv/qkv-shapes",          file: "attention-qkv/qkv-shapes",          title: "Shapes - Why Q is Smaller Than the Embedding",   component: "QKVShapes" },
      { slug: "attention-qkv/w-matrices",          file: "attention-qkv/w-matrices",          title: "W Matrices - Learned During Training",           component: "WMatrices" },
      { slug: "attention-qkv/tracing-example",     file: "attention-qkv/tracing-example",     title: "Tracing a Complete Example",                     component: "TracingExample" },
    ],
  },
  {
    num: 10,
    name: "Computing Attention",
    color: "#e040fb",
    desc: "Step-by-step math: Q-K-V dot products, scaling, softmax, weighted sum, full formula",
    super: "C",
    chapters: [
      { slug: "attention-computation/compute-qkv",        file: "attention-computation/compute-qkv",        title: "Step 1 - Compute Q, K, V for Every Word",   component: "ComputeQKV" },
      { slug: "attention-computation/attention-scores",   file: "attention-computation/attention-scores",   title: "Step 2 - Attention Scores (Dot Products)",  component: "AttentionScores" },
      { slug: "attention-computation/k-transpose",        file: "attention-computation/k-transpose",        title: "Why K Transpose? - Making the Shapes Fit",  component: "KTranspose" },
      { slug: "attention-computation/why-softmax",        file: "attention-computation/why-softmax",        title: "Why Do We Need Softmax?",                   component: "WhySoftmax" },
      { slug: "attention-computation/scale-by-root-dk",   file: "attention-computation/scale-by-root-dk",   title: "Step 3 - Scale by √d_k",               component: "ScaleByRootDk" },
      { slug: "attention-computation/softmax-probs",      file: "attention-computation/softmax-probs",      title: "Step 4 - Softmax → Probabilities",     component: "SoftmaxProbs" },
      { slug: "attention-computation/weighted-sum",       file: "attention-computation/weighted-sum",       title: "Step 5 - Weighted Sum of Values",           component: "WeightedSum" },
      { slug: "attention-computation/full-formula",       file: "attention-computation/full-formula",       title: "The Full Formula",                          component: "FullFormula" },
    ],
  },
  {
    num: 11,
    name: "Multi-Head Attention",
    color: "#ce93d8",
    desc: "Why multi-head, head split, inside each head, concat + W_O, shapes, complete picture",
    super: "C",
    chapters: [
      { slug: "attention-computation/why-multi-head",      file: "attention-computation/why-multi-head",      title: "Why Multi-Head? - The Compromise Problem",           component: "WhyMultiHead" },
      { slug: "attention-computation/head-split",          file: "attention-computation/head-split",          title: "The Split - How 8 Heads Work",                       component: "HeadSplit" },
      { slug: "attention-computation/inside-each-head",    file: "attention-computation/inside-each-head",    title: "Inside Each Head - Full Attention in 64 Dims",        component: "InsideEachHead" },
      { slug: "attention-computation/concat-wo",           file: "attention-computation/concat-wo",           title: "Concat + W_O - Blending All Heads",                   component: "ConcatWO" },
      { slug: "attention-computation/why-eight-heads",     file: "attention-computation/why-eight-heads",     title: "Why 8 Heads? Parameter Count & Big Picture",          component: "WhyEightHeads" },
      { slug: "attention-computation/is-wo-constant",      file: "attention-computation/is-wo-constant",      title: "Is W_O Constant? Does It Change?",                    component: "IsWOConstant" },
      { slug: "attention-computation/attention-shapes",    file: "attention-computation/attention-shapes",    title: "Attention Flow - Shapes at Every Step",               component: "AttentionShapes" },
      { slug: "attention-computation/complete-picture",    file: "attention-computation/complete-picture",    title: "The Complete Picture - In Plain English",             component: "CompletePicture" },
    ],
  },
  {
    num: 12,
    name: "The Encoder",
    color: "#42a5f5",
    desc: "Encoder architecture, Add & Norm, FFN, layer stacking",
    super: "C",
    chapters: [
      { slug: "road-to-transformers/encoder-decoder",        file: "road-to-transformers/encoder-decoder",        title: "Encoder & Decoder - The Two Halves",        component: "EncoderDecoder" },
      { slug: "transformer-block/add-norm",                  file: "transformer-block/add-norm",                  title: "Add & Norm - The Stabilizer",               component: "AddNorm" },
      { slug: "transformer-block/feed-forward-network",      file: "transformer-block/feed-forward-network",      title: "FFN - The Feed-Forward Network",            component: "FeedForwardNetwork" },
      { slug: "transformer-block/ffn-parallel-trick",        file: "transformer-block/ffn-parallel-trick",        title: "FFN - Why Word Count Doesn't Matter",       component: "FFNParallelTrick" },
      { slug: "transformer-block/add-norm-two",              file: "transformer-block/add-norm-two",              title: "Add & Norm (Again) - The Second Stabilizer", component: "AddNormTwo" },
      { slug: "transformer-block/transformer-block-repeats", file: "transformer-block/transformer-block-repeats", title: "Nx - The Transformer Block Repeats",        component: "TransformerBlockRepeats" },
      { slug: "transformer-block/residual-highway",          file: "transformer-block/residual-highway",          title: "Residual Connections - The Gradient Highway", component: "ResidualHighway" },
      { slug: "transformer-block/pre-norm-vs-post-norm",     file: "transformer-block/pre-norm-vs-post-norm",     title: "Pre-Norm vs Post-Norm",                      component: "PreNormVsPostNorm" },
      { slug: "transformer-block/batch-norm-vs-layer-norm",  file: "transformer-block/batch-norm-vs-layer-norm",  title: "Batch Norm vs Layer Norm",                   component: "BatchNormVsLayerNorm" },
    ],
  },
  {
    num: 13,
    name: "The Decoder",
    color: "#ef5350",
    desc: "Decoder-only, causal masking, cross-attention, full walkthrough",
    super: "C",
    chapters: [
      { slug: "road-to-transformers/decoder-only",                       file: "road-to-transformers/decoder-only",                       title: "Decoder-Only - How Modern LLMs Work",            component: "DecoderOnly" },
      { slug: "attention-computation/causal-mask",                       file: "attention-computation/causal-mask",                       title: "Causal Masking - Hiding the Future",             component: "CausalMask" },
      { slug: "attention-computation/cross-attention",                   file: "attention-computation/cross-attention",                   title: "Cross-Attention - The Encoder-Decoder Bridge",   component: "CrossAttention" },
      { slug: "transformer-input/output-head",                           file: "transformer-input/output-head",                           title: "The Output Head - Linear + Softmax",             component: "OutputHead" },
      { slug: "transformer-input/what-transformer-does",                 file: "transformer-input/what-transformer-does",                 title: "What is a Transformer Actually Doing?",          component: "WhatTransformerDoes" },
      { slug: "encoder-decoder-diagrams/encoder-decoder-training",       file: "encoder-decoder-diagrams/encoder-decoder-training",       title: "Encoder-Decoder: The Training Flow",             component: "EncoderDecoderTraining" },
      { slug: "encoder-decoder-diagrams/encoder-decoder-inference",      file: "encoder-decoder-diagrams/encoder-decoder-inference",      title: "Encoder-Decoder: The Inference Flow",            component: "EncoderDecoderInference" },
    ],
  },
  {
    num: 14,
    name: "Modern LLM Techniques",
    color: "#26a69a",
    desc: "KV cache, grouped-query attention, mixture of experts, reasoning models",
    super: "C",
    chapters: [
      { slug: "attention-computation/kv-cache",                  file: "attention-computation/kv-cache",                  title: "KV Cache - Why Inference is Fast",                       component: "KVCache" },
      { slug: "attention-computation/grouped-query-attention",   file: "attention-computation/grouped-query-attention",   title: "Grouped-Query Attention - Shrinking the KV Cache",       component: "GroupedQueryAttention" },
      { slug: "modern-llm-techniques/mixture-of-experts",        file: "modern-llm-techniques/mixture-of-experts",        title: "Mixture of Experts - Bigger Model, Same Compute",        component: "MixtureOfExperts" },
      { slug: "modern-llm-techniques/thinking",                  file: "modern-llm-techniques/thinking",                  title: "Thinking - How Reasoning Models Work",                   component: "Thinking" },
    ],
  },
  {
    num: 15,
    name: "Vector Search - From Brute Force to ANN",
    color: "#f06292",
    desc: "Retrieval problem, distance metrics, IVF, HNSW, Vamana",
    super: "D",
    chapters: [
      { slug: "vector-foundations/retrieval-problem",   file: "vector-foundations/retrieval-problem",   title: "The Retrieval Problem",            component: "RetrievalProblem" },
      { slug: "vector-foundations/brute-force-knn",     file: "vector-foundations/brute-force-knn",     title: "Brute-Force kNN",                  component: "BruteForceKNN" },
      { slug: "vector-foundations/three-way-tradeoff",  file: "vector-foundations/three-way-tradeoff",  title: "The Three-Way Tradeoff",           component: "ThreeWayTradeoff" },
      { slug: "vector-foundations/distance-metrics",    file: "vector-foundations/distance-metrics",    title: "Distance Metrics",                 component: "DistanceMetrics" },
      { slug: "vector-foundations/sparse-vs-dense",     file: "vector-foundations/sparse-vs-dense",     title: "Sparse vs Dense Vectors",          component: "SparseVsDense" },
      { slug: "vector-foundations/ann-family-tree",     file: "vector-foundations/ann-family-tree",     title: "The ANN Family Tree",              component: "ANNFamilyTree" },
      { slug: "vector-foundations/ivf",                 file: "vector-foundations/ivf",                 title: "IVF (Inverted File Index)",        component: "IVF" },
      { slug: "vector-foundations/hnsw-intuition",      file: "vector-foundations/hnsw-intuition",      title: "HNSW - The Small-World Intuition", component: "HNSWIntuition" },
      { slug: "vector-foundations/hnsw-construction",   file: "vector-foundations/hnsw-construction",   title: "HNSW Construction",                component: "HNSWConstruction" },
      { slug: "vector-foundations/hnsw-search",         file: "vector-foundations/hnsw-search",         title: "HNSW Search",                      component: "HNSWSearch" },
      { slug: "vector-foundations/hnsw-parameters",     file: "vector-foundations/hnsw-parameters",     title: "HNSW Parameters",                  component: "HNSWParameters" },
      { slug: "vector-foundations/vamana",              file: "vector-foundations/vamana",              title: "Vamana / DiskANN",                 component: "Vamana" },
    ],
  },
  {
    num: 16,
    name: "Vector Compression - Quantization & Matryoshka",
    color: "#ec407a",
    desc: "Memory wall, scalar/product/binary quantization, Matryoshka, IVF-PQ, HNSW+PQ",
    super: "D",
    chapters: [
      { slug: "vector-compression/memory-wall",           file: "vector-compression/memory-wall",           title: "The Memory Wall",            component: "MemoryWall" },
      { slug: "vector-compression/scalar-quantization",   file: "vector-compression/scalar-quantization",   title: "Scalar Quantization",        component: "ScalarQuantization" },
      { slug: "vector-compression/product-quantization",  file: "vector-compression/product-quantization",  title: "Product Quantization (+ OPQ)", component: "ProductQuantization" },
      { slug: "vector-compression/binary-quantization",   file: "vector-compression/binary-quantization",   title: "Binary Quantization",        component: "BinaryQuantization" },
      { slug: "vector-compression/matryoshka",            file: "vector-compression/matryoshka",            title: "Matryoshka Embeddings",      component: "Matryoshka" },
      { slug: "vector-compression/ivf-pq",                file: "vector-compression/ivf-pq",                title: "IVF-PQ",                     component: "IVFPQ" },
      { slug: "vector-compression/hnsw-pq",               file: "vector-compression/hnsw-pq",               title: "HNSW + PQ",                  component: "HNSWPQ" },
      { slug: "vector-compression/compression-decision",  file: "vector-compression/compression-decision",  title: "The Compression Decision",   component: "CompressionDecision" },
    ],
  },
  {
    num: 17,
    name: "Vector DBs in Production",
    color: "#d81b60",
    desc: "Filtering, updates, sharding, replication, hybrid search, rerankers, lifecycle",
    super: "D",
    chapters: [
      { slug: "vector-production/filtering",                 file: "vector-production/filtering",                 title: "Filtering",                            component: "Filtering" },
      { slug: "vector-production/updates-deletes",           file: "vector-production/updates-deletes",           title: "Updates & Deletes",                    component: "UpdatesDeletes" },
      { slug: "vector-production/sharding",                  file: "vector-production/sharding",                  title: "Sharding & Partitioning",              component: "Sharding" },
      { slug: "vector-production/replication",               file: "vector-production/replication",               title: "Replication & High Availability",      component: "Replication" },
      { slug: "vector-production/hybrid-search",             file: "vector-production/hybrid-search",             title: "Hybrid Search",                        component: "HybridSearch" },
      { slug: "vector-production/rerankers",                 file: "vector-production/rerankers",                 title: "Rerankers",                            component: "Rerankers" },
      { slug: "vector-production/multi-vector-retrieval",    file: "vector-production/multi-vector-retrieval",    title: "Multi-vector Retrieval (ColBERT-style)", component: "MultiVectorRetrieval" },
      { slug: "vector-production/embedding-lifecycle",       file: "vector-production/embedding-lifecycle",       title: "Embedding Lifecycle & Re-embedding",    component: "EmbeddingLifecycle" },
      { slug: "vector-production/observability",             file: "vector-production/observability",             title: "Observability",                        component: "Observability" },
      { slug: "vector-production/capacity-planning",         file: "vector-production/capacity-planning",         title: "Capacity Planning & Cost Models",       component: "CapacityPlanning" },
    ],
  },
  {
    num: 18,
    name: "Picking a Vector Database",
    color: "#ad1457",
    desc: "FAISS, pgvector, Qdrant, Pinecone, Weaviate/Milvus/Chroma, decision framework",
    super: "D",
    chapters: [
      { slug: "vector-systems/faiss",                  file: "vector-systems/faiss",                  title: "FAISS",                        component: "FAISS" },
      { slug: "vector-systems/pgvector",               file: "vector-systems/pgvector",               title: "pgvector",                     component: "Pgvector" },
      { slug: "vector-systems/qdrant",                 file: "vector-systems/qdrant",                 title: "Qdrant",                       component: "Qdrant" },
      { slug: "vector-systems/pinecone",               file: "vector-systems/pinecone",               title: "Pinecone",                     component: "Pinecone" },
      { slug: "vector-systems/qdrant-vs-pinecone",     file: "vector-systems/qdrant-vs-pinecone",     title: "Qdrant vs Pinecone",           component: "QdrantVsPinecone" },
      { slug: "vector-systems/weaviate-milvus-chroma", file: "vector-systems/weaviate-milvus-chroma", title: "Weaviate / Milvus / Chroma",   component: "WeaviateMilvusChroma" },
      { slug: "vector-systems/decision-framework",     file: "vector-systems/decision-framework",     title: "The Decision Framework",       component: "DecisionFramework" },
    ],
  },
  {
    num: 19,
    name: "The RAG Pipeline - Why & How It Breaks",
    color: "#9ccc65",
    desc: "Why LLMs need retrieval, naive RAG pipeline, where it breaks",
    super: "E",
    chapters: [
      { slug: "rag-foundations/why-llms-need-retrieval",   file: "rag-foundations/why-llms-need-retrieval",   title: "Why LLMs Need Retrieval",   component: "WhyLLMsNeedRetrieval" },
      { slug: "rag-foundations/naive-rag-pipeline",        file: "rag-foundations/naive-rag-pipeline",        title: "The Naive RAG Pipeline",    component: "NaiveRAGPipeline" },
      { slug: "rag-foundations/where-naive-rag-breaks",    file: "rag-foundations/where-naive-rag-breaks",    title: "Where Naive RAG Breaks",    component: "WhereNaiveRAGBreaks" },
    ],
  },
  {
    num: 20,
    name: "RAG Data Prep - Ingestion & Chunking",
    color: "#66bb6a",
    desc: "Parsing, deduplication, refresh, all chunking strategies, decision matrix",
    super: "E",
    chapters: [
      { slug: "rag-ingestion/parsing-extraction",                 file: "rag-ingestion/parsing-extraction",                 title: "Parsing - Raw Sources to Clean Text",         component: "ParsingExtraction" },
      { slug: "rag-ingestion/deduplication-cleaning",             file: "rag-ingestion/deduplication-cleaning",             title: "Deduplication & Cleaning",                     component: "DeduplicationCleaning" },
      { slug: "rag-ingestion/refresh-sync",                       file: "rag-ingestion/refresh-sync",                       title: "Refresh & Sync Schedules",                     component: "RefreshSync" },
      { slug: "rag-foundations/why-chunk-fixed-size",             file: "rag-foundations/why-chunk-fixed-size",             title: "Why Chunk At All + Fixed-Size Baseline",       component: "WhyChunkFixedSize" },
      { slug: "rag-foundations/recursive-structural-chunking",    file: "rag-foundations/recursive-structural-chunking",    title: "Recursive Structural Chunking",                component: "RecursiveStructuralChunking" },
      { slug: "rag-foundations/semantic-chunking",                file: "rag-foundations/semantic-chunking",                title: "Semantic Chunking",                            component: "SemanticChunking" },
      { slug: "rag-foundations/late-chunking",                    file: "rag-foundations/late-chunking",                    title: "Late Chunking (Jina 2024)",                    component: "LateChunking" },
      { slug: "rag-foundations/hierarchical-chunking",            file: "rag-foundations/hierarchical-chunking",            title: "Hierarchical / Parent-Child Chunking",         component: "HierarchicalChunking" },
      { slug: "rag-foundations/contextual-retrieval",             file: "rag-foundations/contextual-retrieval",             title: "Contextual Retrieval (Anthropic 2024)",        component: "ContextualRetrieval" },
      { slug: "rag-foundations/chunking-decision",                file: "rag-foundations/chunking-decision",                title: "The Chunking Decision",                        component: "ChunkingDecision" },
    ],
  },
  {
    num: 21,
    name: "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
    color: "#4db6ac",
    desc: "Embedding model picking, domain adaptation, hybrid, reranker cascade, HyDE, multi-query, routing",
    super: "E",
    chapters: [
      { slug: "rag-retrieval/embedding-model-choice",        file: "rag-retrieval/embedding-model-choice",        title: "Picking an Embedding Model",                  component: "EmbeddingModelChoice" },
      { slug: "rag-retrieval/domain-adaptation",             file: "rag-retrieval/domain-adaptation",             title: "Domain Adaptation - Fine-Tuning Embeddings",   component: "DomainAdaptation" },
      { slug: "rag-retrieval/hybrid-for-rag",                file: "rag-retrieval/hybrid-for-rag",                title: "Hybrid Retrieval for RAG",                    component: "HybridForRAG" },
      { slug: "rag-retrieval/reranker-cascade",              file: "rag-retrieval/reranker-cascade",              title: "The Reranker Cascade",                        component: "RerankerCascade" },
      { slug: "rag-retrieval/why-transform-queries",         file: "rag-retrieval/why-transform-queries",         title: "Why Transform Queries",                       component: "WhyTransformQueries" },
      { slug: "rag-retrieval/hy-de",                         file: "rag-retrieval/hy-de",                         title: "HyDE - Hypothetical Document Embeddings",      component: "HyDE" },
      { slug: "rag-retrieval/multi-query-expansion",         file: "rag-retrieval/multi-query-expansion",         title: "Multi-Query Expansion",                       component: "MultiQueryExpansion" },
      { slug: "rag-retrieval/query-routing-decomposition",   file: "rag-retrieval/query-routing-decomposition",   title: "Query Routing & Decomposition",               component: "QueryRoutingDecomposition" },
    ],
  },
  {
    num: 22,
    name: "RAG Generation - Naive to Advanced Patterns",
    color: "#00897b",
    desc: "Context packing, citations, multi-hop, Self-RAG, CRAG, GraphRAG, agentic RAG, long-context",
    super: "E",
    chapters: [
      { slug: "rag-generation/context-packing",       file: "rag-generation/context-packing",       title: "Context Packing",                  component: "ContextPacking" },
      { slug: "rag-generation/lost-in-the-middle",    file: "rag-generation/lost-in-the-middle",    title: "The Lost-in-the-Middle Problem",   component: "LostInTheMiddle" },
      { slug: "rag-generation/citations-refusal",     file: "rag-generation/citations-refusal",     title: "Citations, Refusal & Groundedness", component: "CitationsRefusal" },
      { slug: "rag-generation/multi-hop-retrieval",   file: "rag-generation/multi-hop-retrieval",   title: "Multi-Hop Retrieval",              component: "MultiHopRetrieval" },
      { slug: "rag-generation/self-rag",              file: "rag-generation/self-rag",              title: "Self-RAG",                         component: "SelfRAG" },
      { slug: "rag-generation/corrective-rag",        file: "rag-generation/corrective-rag",        title: "CRAG - Corrective RAG",            component: "CorrectiveRAG" },
      { slug: "rag-generation/graph-rag",             file: "rag-generation/graph-rag",             title: "GraphRAG (Microsoft 2024)",        component: "GraphRAG" },
      { slug: "rag-generation/agentic-rag",           file: "rag-generation/agentic-rag",           title: "Tool-Augmented & Agentic RAG",     component: "AgenticRAG" },
      { slug: "rag-generation/long-context-vs-rag",   file: "rag-generation/long-context-vs-rag",   title: "Long-Context vs RAG",              component: "LongContextVsRAG" },
    ],
  },
  {
    num: 23,
    name: "RAG in Production - Eval, Cost & Shipping",
    color: "#2e7d32",
    desc: "Eval triangle, RAGAS, golden datasets, caching, cost, observability, hallucination, framework choice",
    super: "E",
    chapters: [
      { slug: "rag-evaluation/rag-eval-triangle",                       file: "rag-evaluation/rag-eval-triangle",                       title: "The RAG Eval Triangle",                                 component: "RAGEvalTriangle" },
      { slug: "rag-evaluation/llm-as-judge",                            file: "rag-evaluation/llm-as-judge",                            title: "LLM-as-Judge",                                          component: "LLMAsJudge" },
      { slug: "rag-evaluation/ragas-metrics",                           file: "rag-evaluation/ragas-metrics",                           title: "RAGAS Metrics",                                         component: "RAGASMetrics" },
      { slug: "rag-evaluation/golden-datasets",                         file: "rag-evaluation/golden-datasets",                         title: "Golden Datasets",                                       component: "GoldenDatasets" },
      { slug: "rag-evaluation/online-eval-ab-testing",                  file: "rag-evaluation/online-eval-ab-testing",                  title: "Online Eval & A/B Testing",                             component: "OnlineEvalABTesting" },
      { slug: "rag-production/caching",                                 file: "rag-production/caching",                                 title: "Caching - Prompt + Semantic",                            component: "Caching" },
      { slug: "rag-production/cost-models",                             file: "rag-production/cost-models",                             title: "Cost Models",                                            component: "CostModels" },
      { slug: "rag-production/observability-tracing",                   file: "rag-production/observability-tracing",                   title: "Observability & Tracing",                                component: "ObservabilityTracing" },
      { slug: "rag-production/hallucination-drift",                     file: "rag-production/hallucination-drift",                     title: "Hallucination Detection & Drift",                        component: "HallucinationDrift" },
      { slug: "rag-production/framework-choice",                        file: "rag-production/framework-choice",                        title: "Framework Choice",                                       component: "FrameworkChoice" },
      { slug: "rag-production/rag-decision-framework-capstone",         file: "rag-production/rag-decision-framework-capstone",         title: "The Complete RAG Decision Framework + Capstone",         component: "RAGDecisionFrameworkCapstone" },
    ],
  },
  {
    num: 24,
    name: "Prompting LLMs - The Foundation",
    color: "#4fc3f7",
    desc: "Anatomy of LLM call, system prompts, few-shot, CoT, prompt vs tune vs RAG vs agent, context engineering",
    super: "F",
    chapters: [
      { slug: "agent-prompting/anatomy-of-llm-call",                      file: "agent-prompting/anatomy-of-llm-call",                      title: "Anatomy of an LLM Call",                       component: "AnatomyOfLlmCall" },
      { slug: "agent-prompting/system-prompt-contract",                   file: "agent-prompting/system-prompt-contract",                   title: "System Prompts - The Role Contract",           component: "SystemPromptContract" },
      { slug: "agent-prompting/few-shot-structured-output",               file: "agent-prompting/few-shot-structured-output",               title: "Few-Shot + Structured Output",                 component: "FewShotStructuredOutput" },
      { slug: "agent-prompting/chain-of-thought-self-consistency",        file: "agent-prompting/chain-of-thought-self-consistency",        title: "Chain of Thought + Self-Consistency",          component: "ChainOfThoughtSelfConsistency" },
      { slug: "agent-prompting/prompt-vs-tune-vs-rag-vs-agent",           file: "agent-prompting/prompt-vs-tune-vs-rag-vs-agent",           title: "Prompt vs Fine-Tune vs RAG vs Agent",          component: "PromptVsTuneVsRagVsAgent" },
      { slug: "agent-prompting/context-engineering",                      file: "agent-prompting/context-engineering",                      title: "Context Engineering",                          component: "ContextEngineering" },
    ],
  },
  {
    num: 25,
    name: "Tools & Protocols - MCP, A2A",
    color: "#1976d2",
    desc: "Tool use, JSON schemas, lifecycle, parallel tools, errors, MCP architecture/primitives/security, A2A",
    super: "F",
    chapters: [
      { slug: "agent-tools/tool-use-as-bridge",          file: "agent-tools/tool-use-as-bridge",          title: "Tool Use - LLM as Orchestrator",                component: "ToolUseAsBridge" },
      { slug: "agent-tools/json-schema-for-tools",       file: "agent-tools/json-schema-for-tools",       title: "JSON Schemas + Tool Descriptions",              component: "JsonSchemaForTools" },
      { slug: "agent-tools/tool-call-lifecycle",         file: "agent-tools/tool-call-lifecycle",         title: "Tool Call Lifecycle",                           component: "ToolCallLifecycle" },
      { slug: "agent-tools/parallel-tools-and-choice",   file: "agent-tools/parallel-tools-and-choice",   title: "Parallel Tools + Tool Choice",                  component: "ParallelToolsAndChoice" },
      { slug: "agent-tools/tool-errors-retries",         file: "agent-tools/tool-errors-retries",         title: "Tool Errors, Retries, Validation",              component: "ToolErrorsRetries" },
      { slug: "agent-tools/why-protocols",               file: "agent-tools/why-protocols",               title: "Why Protocols?",                                component: "WhyProtocols" },
      { slug: "agent-tools/mcp-architecture",            file: "agent-tools/mcp-architecture",            title: "MCP Architecture",                              component: "McpArchitecture" },
      { slug: "agent-tools/mcp-primitives",              file: "agent-tools/mcp-primitives",              title: "MCP Primitives - Tools, Resources, Prompts",    component: "McpPrimitives" },
      { slug: "agent-tools/building-mcp-server",         file: "agent-tools/building-mcp-server",         title: "Building an MCP Server",                        component: "BuildingMcpServer" },
      { slug: "agent-tools/mcp-security",                file: "agent-tools/mcp-security",                title: "MCP Security",                                  component: "McpSecurity" },
      { slug: "agent-tools/a2a-protocol",                file: "agent-tools/a2a-protocol",                title: "A2A - Agent-to-Agent Protocol",                 component: "A2AProtocol" },
    ],
  },
  {
    num: 26,
    name: "Agent Mechanics - Loops & Memory",
    color: "#5c6bc0",
    desc: "Workflow vs agent, agent loop, ReAct, plan-execute, termination, memory types, context management",
    super: "F",
    chapters: [
      { slug: "agent-loops/workflow-vs-agent",               file: "agent-loops/workflow-vs-agent",               title: "Workflow vs Agent",                                       component: "WorkflowVsAgent" },
      { slug: "agent-loops/workflow-primitives",             file: "agent-loops/workflow-primitives",             title: "Workflow Primitives - Chaining, Routing, Parallelization", component: "WorkflowPrimitives" },
      { slug: "agent-loops/agent-loop",                      file: "agent-loops/agent-loop",                      title: "The Agent Loop",                                          component: "AgentLoop" },
      { slug: "agent-loops/re-act-pattern",                  file: "agent-loops/re-act-pattern",                  title: "ReAct Pattern",                                           component: "ReActPattern" },
      { slug: "agent-loops/plan-execute-reflect",            file: "agent-loops/plan-execute-reflect",            title: "Plan-Execute + Reflection",                               component: "PlanExecuteReflect" },
      { slug: "agent-loops/loop-termination",                file: "agent-loops/loop-termination",                title: "Loop Termination",                                        component: "LoopTermination" },
      { slug: "agent-loops/memory-taxonomy",                 file: "agent-loops/memory-taxonomy",                 title: "Memory Taxonomy - Short vs Long",                          component: "MemoryTaxonomy" },
      { slug: "agent-loops/working-memory",                  file: "agent-loops/working-memory",                  title: "Working Memory - The Scratchpad",                          component: "WorkingMemory" },
      { slug: "agent-loops/episodic-memory",                 file: "agent-loops/episodic-memory",                 title: "Episodic Memory - Past Events",                           component: "EpisodicMemory" },
      { slug: "agent-loops/semantic-memory",                 file: "agent-loops/semantic-memory",                 title: "Semantic Memory - Learned Facts",                          component: "SemanticMemory" },
      { slug: "agent-loops/procedural-memory",               file: "agent-loops/procedural-memory",               title: "Procedural Memory - Learned Skills",                       component: "ProceduralMemory" },
      { slug: "agent-loops/summary-and-context-mgmt",        file: "agent-loops/summary-and-context-mgmt",        title: "Summary Memory + Context Window Management",               component: "SummaryAndContextMgmt" },
    ],
  },
  {
    num: 27,
    name: "Multi-Agent Systems",
    color: "#7e57c2",
    desc: "Orchestrator-worker, supervisor, handoffs, critic/debate, failure modes, agentic RAG",
    super: "F",
    chapters: [
      { slug: "multi-agent/why-multi-agent",           file: "multi-agent/why-multi-agent",           title: "Why Multi-Agent?",                                  component: "WhyMultiAgent" },
      { slug: "multi-agent/orchestrator-worker",       file: "multi-agent/orchestrator-worker",       title: "Orchestrator-Worker",                               component: "OrchestratorWorker" },
      { slug: "multi-agent/supervisor-hierarchy",      file: "multi-agent/supervisor-hierarchy",      title: "Supervisor / Hierarchical",                         component: "SupervisorHierarchy" },
      { slug: "multi-agent/agent-handoffs",            file: "multi-agent/agent-handoffs",            title: "Hand-Offs",                                         component: "AgentHandoffs" },
      { slug: "multi-agent/critic-debate",             file: "multi-agent/critic-debate",             title: "Critic / Debate / Reflection-as-Multi-Agent",       component: "CriticDebate" },
      { slug: "multi-agent/multi-agent-failures",      file: "multi-agent/multi-agent-failures",      title: "Multi-Agent Failure Modes",                         component: "MultiAgentFailures" },
      { slug: "multi-agent/agentic-rag",               file: "multi-agent/agentic-rag",               title: "Agentic RAG",                                       component: "AgenticRag" },
    ],
  },
  {
    num: 28,
    name: "Shipping Agents - Eval, Safety, Frameworks",
    color: "#5e35b3",
    desc: "Eval dimensions, judges, trace evals, observability, cost, latency, guardrails, injection defenses, LangGraph/CrewAI/SDKs",
    super: "F",
    chapters: [
      { slug: "agent-evals/why-eval-agents",                       file: "agent-evals/why-eval-agents",                       title: "Why Eval Agents Differently",                       component: "WhyEvalAgents" },
      { slug: "agent-evals/eval-dimensions",                       file: "agent-evals/eval-dimensions",                       title: "Eval Dimensions",                                   component: "EvalDimensions" },
      { slug: "agent-evals/llm-as-judge",                          file: "agent-evals/llm-as-judge",                          title: "LLM-as-Judge",                                      component: "LlmAsJudge" },
      { slug: "agent-evals/trace-evals",                           file: "agent-evals/trace-evals",                           title: "Trace Evals",                                       component: "TraceEvals" },
      { slug: "agent-evals/eval-sets-continuous",                  file: "agent-evals/eval-sets-continuous",                  title: "Eval Sets + Continuous Eval",                       component: "EvalSetsContinuous" },
      { slug: "agent-production/agent-observability-tracing",      file: "agent-production/agent-observability-tracing",      title: "Observability & Tracing",                           component: "AgentObservabilityTracing" },
      { slug: "agent-production/cost-control",                     file: "agent-production/cost-control",                     title: "Cost Control",                                      component: "CostControl" },
      { slug: "agent-production/latency-optimization",             file: "agent-production/latency-optimization",             title: "Latency Optimization",                              component: "LatencyOptimization" },
      { slug: "agent-production/guardrails",                       file: "agent-production/guardrails",                       title: "Guardrails",                                        component: "Guardrails" },
      { slug: "agent-production/prompt-injection-defenses",        file: "agent-production/prompt-injection-defenses",        title: "Prompt Injection Defenses",                         component: "PromptInjectionDefenses" },
      { slug: "agent-production/tool-security",                    file: "agent-production/tool-security",                    title: "Tool Security",                                     component: "ToolSecurity" },
      { slug: "agent-production/lang-graph-framework",             file: "agent-production/lang-graph-framework",             title: "LangGraph",                                         component: "LangGraphFramework" },
      { slug: "agent-production/crew-ai-auto-gen",                 file: "agent-production/crew-ai-auto-gen",                 title: "CrewAI / AutoGen",                                  component: "CrewAiAutoGen" },
      { slug: "agent-production/vendor-sdks",                      file: "agent-production/vendor-sdks",                      title: "Claude Agent SDK + OpenAI Agents",                  component: "VendorSdks" },
      { slug: "agent-production/custom-no-framework",              file: "agent-production/custom-no-framework",              title: "Custom / No-Framework",                             component: "CustomNoFramework" },
      { slug: "agent-production/agent-decision-framework",         file: "agent-production/agent-decision-framework",         title: "The Complete Agent Decision Framework",             component: "AgentDecisionFramework" },
    ],
  },
];

// Super-section groupings (single source of truth for the 6 super-sections).
export const superSections = [
  { id: "A", name: "Foundations of Deep Learning",         color: "#ff6b6b", sections: [1, 2, 3, 4] },
  { id: "B", name: "The Rise of LLMs",                     color: "#00b8d4", sections: [5, 6] },
  { id: "C", name: "The Transformer Era",                  color: "#a78bfa", sections: [7, 8, 9, 10, 11, 12, 13, 14] },
  { id: "D", name: "Vector Databases at Depth",            color: "#f06292", sections: [15, 16, 17, 18] },
  { id: "E", name: "Retrieval-Augmented Generation (RAG)", color: "#9ccc65", sections: [19, 20, 21, 22, 23] },
  { id: "F", name: "Agentic AI",                           color: "#4fc3f7", sections: [24, 25, 26, 27, 28] },
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
        slug: c.slug,
        file: c.file,
        title: c.title,
        component: c.component,
        section: s.num,
      });
    });
  });
  return out;
})();

export const sectionNames = Object.fromEntries([
  [0, "Overview"],
  ...sections.map((s) => [s.num, s.name]),
]);

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

  const slugs = chapterList.filter((c) => c.slug).map((c) => c.slug);
  const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupeSlugs.length) errors.push(`Duplicate slugs: ${dupeSlugs.join(", ")}`);

  chapterList.forEach((c) => {
    if (c.component && !c.id) errors.push(`Chapter missing id: ${c.component}`);
    if (!c.component) errors.push(`Chapter missing component: id=${c.id}`);
    if (!c.slug) errors.push(`Chapter missing slug: id=${c.id}`);
  });
  return errors;
}

// Config validation runs via tests (see config.test.js) using validateConfig().
