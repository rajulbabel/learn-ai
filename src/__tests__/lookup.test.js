import { describe, it, expect } from "vitest";
import { chapters } from "../config.js";

// Import all section modules the same way learn-ai.jsx does
import { TOC } from "../sections/toc.jsx";
import * as NeuralFoundations from "../sections/neural-foundations.jsx";
import * as LLMTraining from "../sections/llm-training.jsx";
import * as Scaling from "../sections/scaling.jsx";
import * as RoadToTransformers from "../sections/road-to-transformers.jsx";
import * as TransformerInput from "../sections/transformer-input.jsx";
import * as AttentionQKV from "../sections/attention-qkv.jsx";
import * as AttentionComputation from "../sections/attention-computation.jsx";

const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
};

describe("lookup", () => {
  it("every chapter component exists in the lookup", () => {
    const missing = chapters.filter((c) => !lookup[c.component]);
    expect(missing).toEqual([]);
  });

  it("every chapter component is a function", () => {
    chapters.forEach((c) => {
      expect(typeof lookup[c.component]).toBe("function");
    });
  });

  it("lookup has exactly the right number of components", () => {
    const componentNames = new Set(chapters.map((c) => c.component));
    expect(componentNames.size).toBe(chapters.length);
  });
});
