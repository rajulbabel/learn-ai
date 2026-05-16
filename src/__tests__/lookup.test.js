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
import * as TransformerBlock from "../sections/transformer-block.jsx";
import * as EncoderDecoderDiagrams from "../sections/encoder-decoder-diagrams.jsx";
import * as ModernLLMTechniques from "../sections/modern-llm-techniques.jsx";
import * as VectorFoundations from "../sections/vector-foundations.jsx";
import * as VectorCompression from "../sections/vector-compression.jsx";
import * as VectorProduction from "../sections/vector-production.jsx";
import * as VectorSystems from "../sections/vector-systems.jsx";
import * as RagFoundations from "../sections/rag-foundations.jsx";
import * as RagIngestion from "../sections/rag-ingestion.jsx";
import * as RagRetrieval from "../sections/rag-retrieval.jsx";

const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
  ...TransformerBlock,
  ...EncoderDecoderDiagrams,
  ...ModernLLMTechniques,
  ...VectorFoundations,
  ...VectorCompression,
  ...VectorProduction,
  ...VectorSystems,
  ...RagFoundations,
  ...RagIngestion,
  ...RagRetrieval,
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

  it("vector-foundations.jsx exports all Milestone 1 chapter components", async () => {
    const mod = await import("../sections/vector-foundations.jsx");
    expect(typeof mod.RetrievalProblem).toBe("function");
    expect(typeof mod.BruteForceKNN).toBe("function");
    expect(typeof mod.ThreeWayTradeoff).toBe("function");
    expect(typeof mod.DistanceMetrics).toBe("function");
  });

  it("rag-foundations.jsx exports the Act 1 chapter components", async () => {
    const mod = await import("../sections/rag-foundations.jsx");
    expect(typeof mod.WhyLLMsNeedRetrieval).toBe("function");
    expect(typeof mod.NaiveRAGPipeline).toBe("function");
    expect(typeof mod.WhereNaiveRAGBreaks).toBe("function");
  });

  it("rag-retrieval.jsx exports the Act 4+5 chapter components", async () => {
    const mod = await import("../sections/rag-retrieval.jsx");
    expect(typeof mod.EmbeddingModelChoice).toBe("function");
    expect(typeof mod.DomainAdaptation).toBe("function");
    expect(typeof mod.HybridForRAG).toBe("function");
    expect(typeof mod.RerankerCascade).toBe("function");
    expect(typeof mod.WhyTransformQueries).toBe("function");
    expect(typeof mod.HyDE).toBe("function");
    expect(typeof mod.MultiQueryExpansion).toBe("function");
    expect(typeof mod.QueryRoutingDecomposition).toBe("function");
  });
});

describe("RagIngestion exports", () => {
  it("exposes ParsingExtraction", () => {
    expect(typeof RagIngestion.ParsingExtraction).toBe("function");
  });
  it("exposes DeduplicationCleaning", () => {
    expect(typeof RagIngestion.DeduplicationCleaning).toBe("function");
  });
  it("exposes RefreshSync", () => {
    expect(typeof RagIngestion.RefreshSync).toBe("function");
  });
});
