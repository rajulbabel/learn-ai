export const chapters = [
  { id: "0", title: "Table of Contents", section: 0, component: "TOC" },
  // Section 1: Neural Network Foundations
  { id: "1.1", title: "What is a Neural Network?", section: 1, component: "WhatIsNN" },
  { id: "1.2", title: "Feed-Forward Neural Network", section: 1, component: "FeedForward" },
  { id: "1.3", title: "Learning - What Does it Mean?", section: 1, component: "WhatIsLearning" },
  { id: "1.4", title: "Weights & Biases - The Knobs", section: 1, component: "WeightsBiases" },
  { id: "1.5", title: "Activation (ReLU) - Why Layers Need a Bend", section: 1, component: "ReLU" },
  { id: "1.6", title: "Forward Pass - Making a Prediction", section: 1, component: "ForwardPass" },
  { id: "1.7", title: "Loss - How Wrong Were We?", section: 1, component: "LossFunction" },
  { id: "1.8", title: "Derivatives - The Core Intuition", section: 1, component: "Derivatives" },
  { id: "1.9", title: "Backward Pass - The Chain Rule", section: 1, component: "BackwardPass" },
  { id: "1.10", title: "Gradient Descent - Fixing the Weights", section: 1, component: "GradientDescent" },
  // Section 2: How LLMs Actually Train
  { id: "2.1", title: "Tokenization - From Words to Numbers", section: 2, component: "Tokenization" },
  { id: "2.2", title: "Self-Supervised Learning - How GPT Trains", section: 2, component: "SelfSupervised" },
  { id: "2.3", title: "Cross-Entropy Loss - The LLM Score", section: 2, component: "CrossEntropy" },
  { id: "2.4", title: "Supervised Fine-Tuning (SFT)", section: 2, component: "SFT" },
  { id: "2.5", title: "RLHF - Making AI Helpful & Safe", section: 2, component: "RLHF" },
  { id: "2.6", title: "Batch Training - Why Not One Example at a Time?", section: 2, component: "BatchTraining" },
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
  { id: "6.6", title: "Every Word is BOTH Asker and Answerer", section: 6, component: "AskerAnswerer" },
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
  { id: "7.9", title: "Why Multi-Head? - The Compromise Problem", section: 7, component: "WhyMultiHead" },
  { id: "7.10", title: "The Split - How 8 Heads Work", section: 7, component: "HeadSplit" },
  { id: "7.11", title: "Inside Each Head - Full Attention in 64 Dims", section: 7, component: "InsideEachHead" },
  { id: "7.12", title: "Concat + W_O - Blending All Heads", section: 7, component: "ConcatWO" },
  { id: "7.13", title: "Why 8 Heads? Parameter Count & Big Picture", section: 7, component: "WhyEightHeads" },
  { id: "7.14", title: "Is W_O Constant? Does It Change?", section: 7, component: "IsWOConstant" },
  { id: "7.15", title: "The Complete Picture - In Plain English", section: 7, component: "CompletePicture" },
];

export const sectionNames = { 0: "Overview", 1: "Neural Network Foundations", 2: "How LLMs Actually Train", 3: "Scaling & Modern Techniques", 4: "The Road to Transformers", 5: "Transformer Input Pipeline", 6: "Attention - Understanding Q, K, V", 7: "Attention - The Full Computation" };

// Section colors (one per section, used in progress bar, TOC, etc.)
export const sectionColors = {
  1: "#ff6b6b", 2: "#00b8d4", 3: "#ffd740", 4: "#a78bfa",
  5: "#ffab40", 6: "#00e676", 7: "#e040fb",
};

// Colors
export const C = {
  bg: "#08080d", card: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.07)",
  dim: "rgba(255,255,255,0.35)", mid: "rgba(255,255,255,0.55)", bright: "rgba(255,255,255,0.85)",
  red: "#ff6b6b", purple: "#a78bfa", green: "#00e676", cyan: "#00b8d4",
  yellow: "#ffd740", pink: "#e040fb", orange: "#ffab40", blue: "#42a5f5",
};

// Validate config at import time (dev only)
if (import.meta.env.DEV) {
  const ids = chapters.map(c => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) console.error("[config] Duplicate chapter IDs:", dupes);
  chapters.forEach(c => {
    if (c.component && !c.id) console.error("[config] Chapter missing id:", c);
    if (!c.component) console.error("[config] Chapter missing component:", c);
  });
}
