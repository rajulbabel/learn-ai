export const chapters = [
  { id: "0", title: "Table of Contents", section: 0, component: "TOC" },
  // Section 1: Neural Network Foundations
  { id: "1.1", title: "What is a Neural Network?", section: 1, component: "WhatIsNN" },
  { id: "1.2", title: "Inside a Single Neuron", section: 1, component: "InsideNeuron" },
  { id: "1.3", title: "What is a Layer?", section: 1, component: "WhatIsLayer" },
  { id: "1.4", title: "Weights & Biases - The Knobs", section: 1, component: "WeightsBiases" },
  { id: "1.5", title: "Why Linear Isn't Enough", section: 1, component: "WhyLinear" },
  { id: "1.6", title: "Activation (ReLU) - Why Layers Need a Bend", section: 1, component: "ReLU" },
  { id: "1.7", title: "The Forward Pass - Full Example", section: 1, component: "ForwardPass" },
  { id: "1.8", title: "Loss - How Wrong Were We?", section: 1, component: "LossFunction" },
  { id: "1.9", title: "Learning - What Does It Mean?", section: 1, component: "WhatIsLearning" },
  { id: "1.10", title: "Derivatives - The Core Intuition", section: 1, component: "Derivatives" },
  { id: "1.11", title: "The Backward Pass - The Chain Rule", section: 1, component: "BackwardPass" },
  { id: "1.12", title: "Gradient Descent - Fixing the Weights", section: 1, component: "GradientDescent" },
  { id: "1.13", title: "Backprop Through the Real Network", section: 1, component: "BackpropRealNetwork" },
  { id: "1.14", title: "Gradients in Action - The Full Training Loop", section: 1, component: "GradientsInAction" },
  { id: "1.15", title: "Why Deep Backprop Gets Hard", section: 1, component: "WhyBackpropHard" },
  { id: "1.16", title: "Vectors - Numbers That Travel Together", section: 1, component: "Vectors" },
  { id: "1.17", title: "The Dot Product - How Vectors Compare", section: 1, component: "DotProductIntro" },
  { id: "1.18", title: "Matrices - Grids That Transform Vectors", section: 1, component: "Matrices" },
  { id: "1.19", title: "A Layer is Matrix Multiplication", section: 1, component: "LayerIsMatMul" },
  { id: "1.20", title: "Activation Functions - The Full Picture", section: 1, component: "ActivationFunctions" },
  { id: "1.21", title: 'What "Deep" Really Means', section: 1, component: "WhatDeepMeans" },
  { id: "1.22", title: "Same Building Blocks, Different Shapes", section: 1, component: "SameBuildingBlocks" },
  // Section 2: How LLMs Actually Train
  { id: "2.1", title: "Tokenization - From Words to Numbers", section: 2, component: "Tokenization" },
  { id: "2.2", title: "Self-Supervised Learning - How GPT Trains", section: 2, component: "SelfSupervised" },
  { id: "2.3", title: "Cross-Entropy Loss - The LLM Score", section: 2, component: "CrossEntropy" },
  { id: "2.4", title: "The Neural Network in Action", section: 2, component: "NNInAction" },
  { id: "2.5", title: "Supervised Fine-Tuning (SFT)", section: 2, component: "SFT" },
  { id: "2.6", title: "RLHF - Making AI Helpful & Safe", section: 2, component: "RLHF" },
  { id: "2.7", title: "Batch Training - Why Not One Example at a Time?", section: 2, component: "BatchTraining" },
  { id: "2.8", title: "The Output Layer - From Hidden State to Words", section: 2, component: "OutputLayer" },
  { id: "2.9", title: "Autoregressive Generation - One Token at a Time", section: 2, component: "AutoregressiveGeneration" },
  // Section 3: Scaling & Modern Techniques
  { id: "3.1", title: "Scaling Laws - Why Bigger Models Win", section: 3, component: "ScalingLaws" },
  { id: "3.2", title: "Parameters at Scale", section: 3, component: "ParametersAtScale" },
  { id: "3.3", title: "Knowledge Distillation - Teacher to Student", section: 3, component: "Distillation" },
  { id: "3.4", title: "CLIP - Teaching AI to See & Read", section: 3, component: "CLIP" },
  { id: "3.5", title: "The Complete Training Pipeline", section: 3, component: "TrainingPipeline" },
  // Section 4: The Road to Transformers
  { id: "4.1", title: "CNN", section: 4, component: "CNN" },
  { id: "4.2", title: "RNN", section: 4, component: "RNN" },
  { id: "4.3", title: "RNN's Fatal Flaws", section: 4, component: "RNNFlaws" },
  { id: "4.4", title: "The Transformer Arrives", section: 4, component: "TransformerArrives" },
  { id: "4.5", title: "Encoder & Decoder - The Two Halves", section: 4, component: "EncoderDecoder" },
  { id: "4.6", title: "Decoder-Only - How Modern LLMs Work", section: 4, component: "DecoderOnly" },
  // Section 5: Transformer Input Pipeline
  { id: "5.1", title: "The Full Architecture", section: 5, component: "FullArchitecture" },
  { id: "5.2", title: "Zoom: Embeddings", section: 5, component: "Embeddings" },
  { id: "5.3", title: "Positional Encoding - The Problem", section: 5, component: "PosEncodingProblem" },
  { id: "5.4", title: "Positional Encoding - The Formula", section: 5, component: "PosEncodingFormula" },
  { id: "5.5", title: "Positional Encoding - Computing Positions", section: 5, component: "PosEncodingCompute" },
  { id: "5.6", title: "Positional Encoding - Fast vs Slow", section: 5, component: "PosEncodingFastSlow" },
  { id: "5.7", title: "Positional Encoding - Final Addition", section: 5, component: "PosEncodingFinal" },
  { id: "5.8", title: "What is a Transformer Actually Doing?", section: 5, component: "WhatTransformerDoes" },
  // Section 6: Attention - Understanding Q, K, V
  { id: "6.1", title: "The Problem - Context is Everything", section: 6, component: "ContextProblem" },
  { id: "6.2", title: "How Does a Word Look At Others?", section: 6, component: "WordLookup" },
  { id: "6.3", title: "The Dot Product - Measuring Similarity", section: 6, component: "DotProduct" },
  { id: "6.4", title: "Why Not Dot Product Embeddings Directly?", section: 6, component: "WhyNotDirectDot" },
  { id: "6.5", title: "Q, K, V - The Classroom Analogy", section: 6, component: "QKVClassroom" },
  { id: "6.6", title: "Every Word is Both Asker and Answerer", section: 6, component: "AskerAnswerer" },
  { id: "6.7", title: "Why Can\'t Key and Value Be the Same?", section: 6, component: "WhyKVDifferent" },
  { id: "6.8", title: "The Google Search Analogy", section: 6, component: "GoogleAnalogy" },
  { id: "6.9", title: "How Are Q, K, V Created?", section: 6, component: "HowQKVCreated" },
  { id: "6.10", title: "W Matrices - Learned During Training", section: 6, component: "WMatrices" },
  { id: "6.11", title: "Tracing a Complete Example", section: 6, component: "TracingExample" },
  // Section 7: Attention - The Full Computation
  { id: "7.1", title: "Step 1 - Compute Q, K, V for Every Word", section: 7, component: "ComputeQKV" },
  { id: "7.2", title: "Step 2 - Attention Scores (Dot Products)", section: 7, component: "AttentionScores" },
  { id: "7.3", title: "Why K Transpose? - Making the Shapes Fit", section: 7, component: "KTranspose" },
  { id: "7.4", title: "Why Do We Need Softmax?", section: 7, component: "WhySoftmax" },
  { id: "7.5", title: "Step 3 - Scale by √d_k", section: 7, component: "ScaleByRootDk" },
  { id: "7.6", title: "Step 4 - Softmax → Probabilities", section: 7, component: "SoftmaxProbs" },
  { id: "7.7", title: "Step 5 - Weighted Sum of Values", section: 7, component: "WeightedSum" },
  { id: "7.8", title: "The Full Formula", section: 7, component: "FullFormula" },
  { id: "7.9", title: "Causal Masking - Hiding the Future", section: 7, component: "CausalMask" },
  { id: "7.10", title: "Cross-Attention - The Encoder-Decoder Bridge", section: 7, component: "CrossAttention" },
  { id: "7.11", title: "Why Multi-Head? - The Compromise Problem", section: 7, component: "WhyMultiHead" },
  { id: "7.12", title: "The Split - How 8 Heads Work", section: 7, component: "HeadSplit" },
  { id: "7.13", title: "Inside Each Head - Full Attention in 64 Dims", section: 7, component: "InsideEachHead" },
  { id: "7.14", title: "Concat + W_O - Blending All Heads", section: 7, component: "ConcatWO" },
  { id: "7.15", title: "Why 8 Heads? Parameter Count & Big Picture", section: 7, component: "WhyEightHeads" },
  { id: "7.16", title: "Is W_O Constant? Does It Change?", section: 7, component: "IsWOConstant" },
  { id: "7.17", title: "The Complete Picture - In Plain English", section: 7, component: "CompletePicture" },
  // Section 8: Beyond Attention
  { id: "8.1", title: "Add & Norm - The Stabilizer", section: 8, component: "AddNorm" },
  { id: "8.2", title: "FFN - The Feed-Forward Network", section: 8, component: "FeedForwardNetwork" },
  { id: "8.3", title: "Add & Norm (Again) - The Second Stabilizer", section: 8, component: "AddNormTwo" },
  { id: "8.4", title: "Nx - The Transformer Block Repeats", section: 8, component: "TransformerBlockRepeats" },
];

export const sectionNames = { 0: "Overview", 1: "Neural Network Foundations", 2: "How LLMs Actually Train", 3: "Scaling & Modern Techniques", 4: "The Road to Transformers", 5: "Transformer Input Pipeline", 6: "Attention - Understanding Q, K, V", 7: "Attention - The Full Computation", 8: "Beyond Attention" };

// Section colors (one per section, used in progress bar, TOC, etc.)
export const sectionColors = {
  1: "#ff6b6b", 2: "#00b8d4", 3: "#ffd740", 4: "#a78bfa",
  5: "#ffab40", 6: "#00e676", 7: "#e040fb", 8: "#42a5f5",
};

// Colors
export const C = {
  bg: "#08080d", card: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.07)",
  dim: "rgba(255,255,255,0.35)", mid: "rgba(255,255,255,0.55)", bright: "rgba(255,255,255,0.85)",
  red: "#ff6b6b", purple: "#a78bfa", green: "#00e676", cyan: "#00b8d4",
  yellow: "#ffd740", pink: "#e040fb", orange: "#ffab40", blue: "#42a5f5",
};

// Validate config - extracted for testability
export function validateConfig(chapterList) {
  const errors = [];
  const ids = chapterList.map(c => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) errors.push(`Duplicate chapter IDs: ${dupes.join(", ")}`);
  chapterList.forEach(c => {
    if (c.component && !c.id) errors.push(`Chapter missing id: ${c.component}`);
    if (!c.component) errors.push(`Chapter missing component: id=${c.id}`);
  });
  return errors;
}

// Config validation runs via tests (see config.test.js) using validateConfig().
