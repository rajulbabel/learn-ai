export const chapters = [
  { id: "0", title: "Table of Contents", part: 0 },
  // Part 1: Neural Network Foundations
  { id: "1.1", title: "What is a Neural Network?", part: 1 },
  { id: "1.2", title: "Feed-Forward Neural Network", part: 1 },
  { id: "1.3", title: "Learning - What Does it Mean?", part: 1 },
  { id: "1.4", title: "Weights & Biases - The Knobs", part: 1 },
  { id: "1.5", title: "Activation (ReLU) - Why Layers Need a Bend", part: 1 },
  { id: "1.6", title: "Forward Pass - Making a Prediction", part: 1 },
  { id: "1.7", title: "Loss - How Wrong Were We?", part: 1 },
  { id: "1.8", title: "Derivatives - The Core Intuition", part: 1 },
  { id: "1.9", title: "Backward Pass - The Chain Rule", part: 1 },
  { id: "1.10", title: "Gradient Descent - Fixing the Weights", part: 1 },
  // Part 2: How LLMs Actually Train (was Part 6)
  { id: "2.1", title: "Tokenization - From Words to Numbers", part: 2 },
  { id: "2.2", title: "Self-Supervised Learning - How GPT Trains", part: 2 },
  { id: "2.3", title: "Cross-Entropy Loss - The LLM Score", part: 2 },
  { id: "2.4", title: "Supervised Fine-Tuning (SFT)", part: 2 },
  { id: "2.5", title: "RLHF - Making AI Helpful & Safe", part: 2 },
  { id: "2.6", title: "Batch Training - Why Not One Example at a Time?", part: 2 },
  // Part 3: Scaling & Modern Techniques (was Part 7)
  { id: "3.1", title: "Scaling Laws - Why Bigger Models Win", part: 3 },
  { id: "3.2", title: "Parameters at Scale", part: 3 },
  { id: "3.3", title: "Knowledge Distillation - Teacher to Student", part: 3 },
  { id: "3.4", title: "CLIP - Teaching AI to See & Read", part: 3 },
  { id: "3.5", title: "The Complete Training Pipeline", part: 3 },
  // Part 4: The Road to Transformers (was Part 2)
  { id: "4.1", title: "CNN", part: 4 },
  { id: "4.2", title: "RNN", part: 4 },
  { id: "4.3", title: "RNN's Fatal Flaws", part: 4 },
  { id: "4.4", title: "The Transformer Arrives", part: 4 },
  // Part 5: Transformer Input Pipeline (was Part 3)
  { id: "5.1", title: "The Full Architecture", part: 5 },
  { id: "5.2", title: "Zoom: Embeddings", part: 5 },
  { id: "5.3", title: "Positional Encoding - The Problem", part: 5 },
  { id: "5.4", title: "Positional Encoding - The Formula", part: 5 },
  { id: "5.5", title: "Positional Encoding - Computing Positions", part: 5 },
  { id: "5.6", title: "Positional Encoding - Fast vs Slow", part: 5 },
  { id: "5.7", title: "Positional Encoding - Final Addition", part: 5 },
  { id: "5.8", title: "What is a Transformer Actually Doing?", part: 5 },
  // Part 6: Attention - Understanding Q, K, V (was Part 4)
  { id: "6.1", title: "The Problem - Context is Everything", part: 6 },
  { id: "6.2", title: "How Does a Word Look At Others?", part: 6 },
  { id: "6.3", title: "The Dot Product - Measuring Similarity", part: 6 },
  { id: "6.4", title: "Why Not Dot Product Embeddings Directly?", part: 6 },
  { id: "6.5", title: "Q, K, V - The Classroom Analogy", part: 6 },
  { id: "6.6", title: "Every Word is BOTH Asker and Answerer", part: 6 },
  { id: "6.7", title: "Why Can\'t Key and Value Be the Same?", part: 6 },
  { id: "6.8", title: "The Google Search Analogy", part: 6 },
  { id: "6.9", title: "How Are Q, K, V Created?", part: 6 },
  { id: "6.10", title: "W Matrices - Learned During Training", part: 6 },
  { id: "6.11", title: "Tracing a Complete Example", part: 6 },
  // Part 7: Attention - The Full Computation (was Part 5)
  { id: "7.1", title: "Step 1 - Compute Q, K, V for Every Word", part: 7 },
  { id: "7.2", title: "Step 2 - Attention Scores (Dot Products)", part: 7 },
  { id: "7.3", title: "Why K Transpose? - Making the Shapes Fit", part: 7 },
  { id: "7.4", title: "Why Do We Need Softmax?", part: 7 },
  { id: "7.5", title: "Step 3 - Scale by √d_k", part: 7 },
  { id: "7.6", title: "Step 4 - Softmax → Probabilities", part: 7 },
  { id: "7.7", title: "Step 5 - Weighted Sum of Values", part: 7 },
  { id: "7.8", title: "The Full Formula", part: 7 },
  { id: "7.9", title: "Why Multi-Head? - The Compromise Problem", part: 7 },
  { id: "7.10", title: "The Split - How 8 Heads Work", part: 7 },
  { id: "7.11", title: "Inside Each Head - Full Attention in 64 Dims", part: 7 },
  { id: "7.12", title: "Concat + W_O - Blending All Heads", part: 7 },
  { id: "7.13", title: "Why 8 Heads? Parameter Count & Big Picture", part: 7 },
  { id: "7.14", title: "Is W_O Constant? Does It Change?", part: 7 },
  { id: "7.15", title: "The Complete Picture - In Plain English", part: 7 },
];

export const partNames = { 0: "Overview", 1: "Neural Network Foundations", 2: "How LLMs Actually Train", 3: "Scaling & Modern Techniques", 4: "The Road to Transformers", 5: "Transformer Input Pipeline", 6: "Attention - Understanding Q, K, V", 7: "Attention - The Full Computation" };

// Colors
export const C = {
  bg: "#08080d", card: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.07)",
  dim: "rgba(255,255,255,0.35)", mid: "rgba(255,255,255,0.55)", bright: "rgba(255,255,255,0.85)",
  red: "#ff6b6b", purple: "#a78bfa", green: "#00e676", cyan: "#00b8d4",
  yellow: "#ffd740", pink: "#e040fb", orange: "#ffab40", blue: "#42a5f5",
};
