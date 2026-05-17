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
import * as RagGeneration from "../sections/rag-generation.jsx";
import * as RagEvaluation from "../sections/rag-evaluation.jsx";
import * as RagProduction from "../sections/rag-production.jsx";
import * as AgentPrompting from "../sections/agent-prompting.jsx";
import * as AgentTools from "../sections/agent-tools.jsx";
import * as AgentLoops from "../sections/agent-loops.jsx";
import * as MultiAgent from "../sections/multi-agent.jsx";
import * as AgentEvals from "../sections/agent-evals.jsx";
import * as AgentProduction from "../sections/agent-production.jsx";

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
  ...RagGeneration,
  ...RagEvaluation,
  ...RagProduction,
  ...AgentPrompting,
  ...AgentTools,
  ...AgentLoops,
  ...MultiAgent,
  ...AgentEvals,
  ...AgentProduction,
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

  it("rag-generation.jsx exports all Milestone 4 chapter components", async () => {
    const mod = await import("../sections/rag-generation.jsx");
    expect(typeof mod.ContextPacking).toBe("function");
    expect(typeof mod.LostInTheMiddle).toBe("function");
    expect(typeof mod.CitationsRefusal).toBe("function");
    expect(typeof mod.MultiHopRetrieval).toBe("function");
    expect(typeof mod.SelfRAG).toBe("function");
    expect(typeof mod.CorrectiveRAG).toBe("function");
    expect(typeof mod.GraphRAG).toBe("function");
    expect(typeof mod.AgenticRAG).toBe("function");
    expect(typeof mod.LongContextVsRAG).toBe("function");
  });

  it("rag-evaluation.jsx exports the Act 8 chapter components", async () => {
    const mod = await import("../sections/rag-evaluation.jsx");
    expect(typeof mod.RAGEvalTriangle).toBe("function");
    expect(typeof mod.LLMAsJudge).toBe("function");
    expect(typeof mod.RAGASMetrics).toBe("function");
    expect(typeof mod.GoldenDatasets).toBe("function");
    expect(typeof mod.OnlineEvalABTesting).toBe("function");
  });

  it("rag-production.jsx exports the Act 9+10 chapter components", async () => {
    const mod = await import("../sections/rag-production.jsx");
    expect(typeof mod.Caching).toBe("function");
    expect(typeof mod.CostModels).toBe("function");
    expect(typeof mod.ObservabilityTracing).toBe("function");
    expect(typeof mod.HallucinationDrift).toBe("function");
    expect(typeof mod.FrameworkChoice).toBe("function");
    expect(typeof mod.RAGDecisionFrameworkCapstone).toBe("function");
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

describe("Section 13 component presence", () => {
  it("AgentPrompting exports each Act 1 chapter", () => {
    expect(typeof AgentPrompting.AnatomyOfLlmCall).toBe("function");
    expect(typeof AgentPrompting.SystemPromptContract).toBe("function");
    expect(typeof AgentPrompting.FewShotStructuredOutput).toBe("function");
    expect(typeof AgentPrompting.ChainOfThoughtSelfConsistency).toBe("function");
    expect(typeof AgentPrompting.PromptVsTuneVsRagVsAgent).toBe("function");
    expect(typeof AgentPrompting.ContextEngineering).toBe("function");
  });

  it("AgentTools exports each Act 2 chapter", () => {
    expect(typeof AgentTools.ToolUseAsBridge).toBe("function");
    expect(typeof AgentTools.JsonSchemaForTools).toBe("function");
    expect(typeof AgentTools.ToolCallLifecycle).toBe("function");
    expect(typeof AgentTools.ParallelToolsAndChoice).toBe("function");
    expect(typeof AgentTools.ToolErrorsRetries).toBe("function");
  });

  it("AgentTools exports each Act 3 chapter", () => {
    expect(typeof AgentTools.WhyProtocols).toBe("function");
    expect(typeof AgentTools.McpArchitecture).toBe("function");
    expect(typeof AgentTools.McpPrimitives).toBe("function");
    expect(typeof AgentTools.BuildingMcpServer).toBe("function");
    expect(typeof AgentTools.McpSecurity).toBe("function");
    expect(typeof AgentTools.A2AProtocol).toBe("function");
  });

  it("AgentLoops exports each Act 4 chapter", () => {
    expect(typeof AgentLoops.WorkflowVsAgent).toBe("function");
    expect(typeof AgentLoops.WorkflowPrimitives).toBe("function");
    expect(typeof AgentLoops.AgentLoop).toBe("function");
    expect(typeof AgentLoops.ReActPattern).toBe("function");
    expect(typeof AgentLoops.PlanExecuteReflect).toBe("function");
    expect(typeof AgentLoops.LoopTermination).toBe("function");
  });
});

describe("Section 13 Act 5 component presence (AgentLoops)", () => {
  it("AgentLoops exports each Act 5 chapter", () => {
    expect(typeof AgentLoops.MemoryTaxonomy).toBe("function");
    expect(typeof AgentLoops.WorkingMemory).toBe("function");
    expect(typeof AgentLoops.EpisodicMemory).toBe("function");
    expect(typeof AgentLoops.SemanticMemory).toBe("function");
    expect(typeof AgentLoops.ProceduralMemory).toBe("function");
    expect(typeof AgentLoops.SummaryAndContextMgmt).toBe("function");
  });
});

describe("Section 13 Act 6 component presence (MultiAgent)", () => {
  it("MultiAgent exports each Act 6 chapter", () => {
    expect(typeof MultiAgent.WhyMultiAgent).toBe("function");
    expect(typeof MultiAgent.OrchestratorWorker).toBe("function");
    expect(typeof MultiAgent.SupervisorHierarchy).toBe("function");
    expect(typeof MultiAgent.AgentHandoffs).toBe("function");
    expect(typeof MultiAgent.CriticDebate).toBe("function");
    expect(typeof MultiAgent.MultiAgentFailures).toBe("function");
    expect(typeof MultiAgent.AgenticRag).toBe("function");
  });
});

describe("Section 13 Act 7 component presence (AgentEvals)", () => {
  it("AgentEvals exports each Act 7 chapter", () => {
    expect(typeof AgentEvals.WhyEvalAgents).toBe("function");
    expect(typeof AgentEvals.EvalDimensions).toBe("function");
    expect(typeof AgentEvals.LlmAsJudge).toBe("function");
    expect(typeof AgentEvals.TraceEvals).toBe("function");
    expect(typeof AgentEvals.EvalSetsContinuous).toBe("function");
  });
});

describe("Section 13 Act 8 component presence (AgentProduction)", () => {
  it("AgentProduction exports each Act 8 chapter", () => {
    expect(typeof AgentProduction.AgentObservabilityTracing).toBe("function");
    expect(typeof AgentProduction.CostControl).toBe("function");
    expect(typeof AgentProduction.LatencyOptimization).toBe("function");
    expect(typeof AgentProduction.Guardrails).toBe("function");
    expect(typeof AgentProduction.PromptInjectionDefenses).toBe("function");
    expect(typeof AgentProduction.ToolSecurity).toBe("function");
  });
});

describe("Section 13 Act 9 component presence (AgentProduction)", () => {
  it("AgentProduction exports each Act 9 chapter", () => {
    expect(typeof AgentProduction.LangGraphFramework).toBe("function");
    expect(typeof AgentProduction.CrewAiAutoGen).toBe("function");
    expect(typeof AgentProduction.VendorSdks).toBe("function");
    expect(typeof AgentProduction.CustomNoFramework).toBe("function");
    expect(typeof AgentProduction.AgentDecisionFramework).toBe("function");
  });
});
