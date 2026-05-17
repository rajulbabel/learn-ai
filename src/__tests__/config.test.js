import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chapters, sectionNames, sectionColors, C, validateConfig } from "../config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "..");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__" || entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("config.js", () => {
  it("has no duplicate chapter IDs", () => {
    const ids = chapters.map((c) => c.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it("every chapter has required fields", () => {
    chapters.forEach((c) => {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("title");
      expect(c).toHaveProperty("section");
      expect(c).toHaveProperty("component");
      expect(typeof c.id).toBe("string");
      expect(typeof c.title).toBe("string");
      expect(typeof c.section).toBe("number");
      expect(typeof c.component).toBe("string");
    });
  });

  it("every section referenced in chapters has a name", () => {
    const usedSections = new Set(chapters.map((c) => c.section));
    usedSections.forEach((s) => {
      expect(sectionNames[s]).toBeDefined();
    });
  });

  it("every section (1-10) has a color", () => {
    for (let i = 1; i <= 10; i++) {
      expect(sectionColors[i]).toBeDefined();
    }
  });

  it("chapter IDs within each section are sequential", () => {
    const bySection = {};
    chapters.forEach((c) => {
      if (c.section === 0) return;
      if (!bySection[c.section]) bySection[c.section] = [];
      bySection[c.section].push(c.id);
    });
    Object.entries(bySection).forEach(([section, ids]) => {
      ids.forEach((id, i) => {
        const expected = `${section}.${i + 1}`;
        expect(id).toBe(expected);
      });
    });
  });

  it("colors object has all required keys", () => {
    const requiredKeys = [
      "bg",
      "card",
      "border",
      "dim",
      "mid",
      "bright",
      "red",
      "purple",
      "green",
      "cyan",
      "yellow",
      "pink",
      "orange",
      "blue",
    ];
    requiredKeys.forEach((key) => {
      expect(C[key]).toBeDefined();
    });
  });

  // validateConfig function tests
  it("validateConfig returns no errors for valid config", () => {
    const errors = validateConfig(chapters);
    expect(errors).toEqual([]);
  });

  it("validateConfig detects duplicate IDs", () => {
    const badConfig = [
      { id: "1.1", title: "A", section: 1, component: "CompA" },
      { id: "1.1", title: "B", section: 1, component: "CompB" },
    ];
    const errors = validateConfig(badConfig);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("Duplicate");
  });

  it("validateConfig detects missing id when component present", () => {
    const badConfig = [{ id: "", title: "A", section: 1, component: "CompA" }];
    const errors = validateConfig(badConfig);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("missing id");
  });

  it("validateConfig detects missing component", () => {
    const badConfig = [{ id: "1.1", title: "A", section: 1, component: "" }];
    const errors = validateConfig(badConfig);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("missing component");
  });

  it("sectionNames includes section 0 (Overview)", () => {
    expect(sectionNames[0]).toBe("Overview");
  });

  it("chapters array has the TOC at index 0", () => {
    expect(chapters[0].id).toBe("0");
    expect(chapters[0].component).toBe("TOC");
    expect(chapters[0].section).toBe(0);
  });

  it("all section colors are hex strings", () => {
    Object.values(sectionColors).forEach((color) => {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it("all C colors are strings", () => {
    Object.values(C).forEach((color) => {
      expect(typeof color).toBe("string");
    });
  });

  it("no chapter title contains standalone uppercase IS", () => {
    chapters.forEach((c) => {
      expect(c.title).not.toMatch(/\bIS\b/);
    });
  });

  it("no JSX content references the old chapter IDs 11.19-11.35 after renumber", () => {
    const sectionFiles = [
      path.join(SRC_DIR, "sections/vector-systems.jsx"),
      path.join(SRC_DIR, "sections/vector-production.jsx"),
      path.join(SRC_DIR, "sections/vector-compression.jsx"),
    ];
    const stalePatterns = [
      /Recall from 11\.19/,
      /chapter 11\.19[^0-9]/,
      /read 11\.19 carefully/,
      /decision framework in 11\.35/,
      /production realities \(11\.19-11\.28\)/,
      /chapters 11\.30 - 11\.34/,
      /the system comparison \(11\.29-11\.34\)/,
    ];
    for (const file of sectionFiles) {
      const content = fs.readFileSync(file, "utf8");
      for (const pattern of stalePatterns) {
        expect(content, `${file} still contains ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("Section 11 chapters are renumbered with CompressionDecision at 11.19", () => {
    const byId = Object.fromEntries(chapters.map((c) => [c.id, c]));
    expect(byId["11.19"]?.component).toBe("CompressionDecision");
    expect(byId["11.19"]?.title).toBe("The Compression Decision");
    expect(byId["11.20"]?.component).toBe("Filtering");
    expect(byId["11.21"]?.component).toBe("UpdatesDeletes");
    expect(byId["11.22"]?.component).toBe("Sharding");
    expect(byId["11.23"]?.component).toBe("Replication");
    expect(byId["11.24"]?.component).toBe("HybridSearch");
    expect(byId["11.25"]?.component).toBe("Rerankers");
    expect(byId["11.26"]?.component).toBe("MultiVectorRetrieval");
    expect(byId["11.27"]?.component).toBe("EmbeddingLifecycle");
    expect(byId["11.28"]?.component).toBe("Observability");
    expect(byId["11.29"]?.component).toBe("CapacityPlanning");
    expect(byId["11.30"]?.component).toBe("FAISS");
    expect(byId["11.31"]?.component).toBe("Pgvector");
    expect(byId["11.32"]?.component).toBe("Qdrant");
    expect(byId["11.33"]?.component).toBe("Pinecone");
    expect(byId["11.34"]?.component).toBe("QdrantVsPinecone");
    expect(byId["11.35"]?.component).toBe("WeaviateMilvusChroma");
    expect(byId["11.36"]?.component).toBe("DecisionFramework");
  });
});

describe("Section 11 registration", () => {
  it("has section 11 in sectionNames", () => {
    expect(sectionNames[11]).toBe("Vector Databases");
  });

  it("has section 11 in sectionColors", () => {
    expect(sectionColors[11]).toBe("#f06292");
  });
});

describe("Section 12 registration", () => {
  it("has section 12 in sectionNames", () => {
    expect(sectionNames[12]).toBe("Retrieval-Augmented Generation");
  });

  it("has section 12 in sectionColors", () => {
    expect(sectionColors[12]).toBe("#7c4dff");
  });
});

describe("Section 11 chapters", () => {
  it("has chapters 11.1 through 11.36 in order", () => {
    const section11 = chapters.filter((ch) => ch.section === 11);
    const expected = [
      { id: "11.1", component: "RetrievalProblem", title: "The Retrieval Problem" },
      { id: "11.2", component: "BruteForceKNN", title: "Brute-Force kNN" },
      { id: "11.3", component: "ThreeWayTradeoff", title: "The Three-Way Tradeoff" },
      { id: "11.4", component: "DistanceMetrics", title: "Distance Metrics" },
      { id: "11.5", component: "ANNFamilyTree", title: "The ANN Family Tree" },
      { id: "11.6", component: "IVF", title: "IVF (Inverted File Index)" },
      { id: "11.7", component: "HNSWIntuition", title: "HNSW - The Small-World Intuition" },
      { id: "11.8", component: "HNSWConstruction", title: "HNSW Construction" },
      { id: "11.9", component: "HNSWSearch", title: "HNSW Search" },
      { id: "11.10", component: "HNSWParameters", title: "HNSW Parameters" },
      { id: "11.11", component: "Vamana", title: "Vamana / DiskANN" },
      { id: "11.12", component: "MemoryWall", title: "The Memory Wall" },
      { id: "11.13", component: "ScalarQuantization", title: "Scalar Quantization" },
      { id: "11.14", component: "ProductQuantization", title: "Product Quantization (+ OPQ)" },
      { id: "11.15", component: "BinaryQuantization", title: "Binary Quantization" },
      { id: "11.16", component: "Matryoshka", title: "Matryoshka Embeddings" },
      { id: "11.17", component: "IVFPQ", title: "IVF-PQ" },
      { id: "11.18", component: "HNSWPQ", title: "HNSW + PQ" },
      { id: "11.19", component: "CompressionDecision", title: "The Compression Decision" },
      { id: "11.20", component: "Filtering", title: "Filtering" },
      { id: "11.21", component: "UpdatesDeletes", title: "Updates & Deletes" },
      { id: "11.22", component: "Sharding", title: "Sharding & Partitioning" },
      { id: "11.23", component: "Replication", title: "Replication & High Availability" },
      { id: "11.24", component: "HybridSearch", title: "Hybrid Search" },
      { id: "11.25", component: "Rerankers", title: "Rerankers" },
      { id: "11.26", component: "MultiVectorRetrieval", title: "Multi-vector Retrieval (ColBERT-style)" },
      { id: "11.27", component: "EmbeddingLifecycle", title: "Embedding Lifecycle & Re-embedding" },
      { id: "11.28", component: "Observability", title: "Observability" },
      { id: "11.29", component: "CapacityPlanning", title: "Capacity Planning & Cost Models" },
      { id: "11.30", component: "FAISS", title: "FAISS" },
      { id: "11.31", component: "Pgvector", title: "pgvector" },
      { id: "11.32", component: "Qdrant", title: "Qdrant" },
      { id: "11.33", component: "Pinecone", title: "Pinecone" },
      { id: "11.34", component: "QdrantVsPinecone", title: "Qdrant vs Pinecone" },
      { id: "11.35", component: "WeaviateMilvusChroma", title: "Weaviate / Milvus / Chroma" },
      { id: "11.36", component: "DecisionFramework", title: "The Decision Framework" },
    ];
    expect(section11.length).toBe(expected.length);
    expected.forEach((exp, i) => {
      expect(section11[i].id).toBe(exp.id);
      expect(section11[i].component).toBe(exp.component);
      expect(section11[i].title).toBe(exp.title);
    });
  });
});

describe("Section 12 chapters", () => {
  it("has chapters 12.1 through 12.13 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(13);
    expect(section12[0].id).toBe("12.1");
    expect(section12[0].component).toBe("WhyLLMsNeedRetrieval");
    expect(section12[0].title).toBe("Why LLMs Need Retrieval");
    expect(section12[1].id).toBe("12.2");
    expect(section12[1].component).toBe("NaiveRAGPipeline");
    expect(section12[1].title).toBe("The Naive RAG Pipeline");
    expect(section12[2].id).toBe("12.3");
    expect(section12[2].component).toBe("WhereNaiveRAGBreaks");
    expect(section12[2].title).toBe("Where Naive RAG Breaks");
    expect(section12[3].id).toBe("12.4");
    expect(section12[3].component).toBe("ParsingExtraction");
    expect(section12[3].title).toBe("Parsing - Raw Sources to Clean Text");
    expect(section12[4].id).toBe("12.5");
    expect(section12[4].component).toBe("DeduplicationCleaning");
    expect(section12[4].title).toBe("Deduplication & Cleaning");
    expect(section12[5].id).toBe("12.6");
    expect(section12[5].component).toBe("RefreshSync");
    expect(section12[5].title).toBe("Refresh & Sync Schedules");
    expect(section12[6].id).toBe("12.7");
    expect(section12[6].component).toBe("WhyChunkFixedSize");
    expect(section12[6].title).toBe("Why Chunk At All + Fixed-Size Baseline");
    expect(section12[7].id).toBe("12.8");
    expect(section12[7].component).toBe("RecursiveStructuralChunking");
    expect(section12[7].title).toBe("Recursive Structural Chunking");
    expect(section12[8].id).toBe("12.9");
    expect(section12[8].component).toBe("SemanticChunking");
    expect(section12[8].title).toBe("Semantic Chunking");
    expect(section12[9].id).toBe("12.10");
    expect(section12[9].component).toBe("LateChunking");
    expect(section12[9].title).toBe("Late Chunking (Jina 2024)");
    expect(section12[10].id).toBe("12.11");
    expect(section12[10].component).toBe("HierarchicalChunking");
    expect(section12[10].title).toBe("Hierarchical / Parent-Child Chunking");
    expect(section12[11].id).toBe("12.12");
    expect(section12[11].component).toBe("ContextualRetrieval");
    expect(section12[11].title).toBe("Contextual Retrieval (Anthropic 2024)");
    expect(section12[12].id).toBe("12.13");
    expect(section12[12].component).toBe("ChunkingDecision");
    expect(section12[12].title).toBe("The Chunking Decision");
  });
});

describe("Section 12 Acts 4+5 chapters", () => {
  it("has chapters 12.14 through 12.21 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(21);
    const acts45 = section12.filter((c) => {
      const n = Number(c.id.split(".")[1]);
      return n >= 14 && n <= 21;
    });
    const expected = [
      { id: "12.14", component: "EmbeddingModelChoice", title: "Picking an Embedding Model" },
      { id: "12.15", component: "DomainAdaptation", title: "Domain Adaptation - Fine-Tuning Embeddings" },
      { id: "12.16", component: "HybridForRAG", title: "Hybrid Retrieval for RAG" },
      { id: "12.17", component: "RerankerCascade", title: "The Reranker Cascade" },
      { id: "12.18", component: "WhyTransformQueries", title: "Why Transform Queries" },
      { id: "12.19", component: "HyDE", title: "HyDE - Hypothetical Document Embeddings" },
      { id: "12.20", component: "MultiQueryExpansion", title: "Multi-Query Expansion" },
      { id: "12.21", component: "QueryRoutingDecomposition", title: "Query Routing & Decomposition" },
    ];
    expect(acts45.length).toBe(expected.length);
    expected.forEach((exp, i) => {
      expect(acts45[i].id).toBe(exp.id);
      expect(acts45[i].component).toBe(exp.component);
      expect(acts45[i].title).toBe(exp.title);
    });
  });
});

describe("Section 12 Acts 6+7 chapters", () => {
  it("has chapters 12.22 through 12.30 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(30);
    const acts67 = section12.filter((c) => {
      const n = Number(c.id.split(".")[1]);
      return n >= 22 && n <= 30;
    });
    const expected = [
      { id: "12.22", component: "ContextPacking", title: "Context Packing" },
      { id: "12.23", component: "LostInTheMiddle", title: "The Lost-in-the-Middle Problem" },
      { id: "12.24", component: "CitationsRefusal", title: "Citations, Refusal & Groundedness" },
      { id: "12.25", component: "MultiHopRetrieval", title: "Multi-Hop Retrieval" },
      { id: "12.26", component: "SelfRAG", title: "Self-RAG" },
      { id: "12.27", component: "CorrectiveRAG", title: "CRAG - Corrective RAG" },
      { id: "12.28", component: "GraphRAG", title: "GraphRAG (Microsoft 2024)" },
      { id: "12.29", component: "AgenticRAG", title: "Tool-Augmented & Agentic RAG" },
      { id: "12.30", component: "LongContextVsRAG", title: "Long-Context vs RAG" },
    ];
    expect(acts67.length).toBe(expected.length);
    expected.forEach((exp, i) => {
      expect(acts67[i].id).toBe(exp.id);
      expect(acts67[i].component).toBe(exp.component);
      expect(acts67[i].title).toBe(exp.title);
    });
  });
});

describe("Section 12 Act 8 chapters", () => {
  it("has chapters 12.31 through 12.35 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(35);
    const act8 = section12.filter((c) => {
      const n = Number(c.id.split(".")[1]);
      return n >= 31 && n <= 35;
    });
    const expected = [
      { id: "12.31", component: "RAGEvalTriangle", title: "The RAG Eval Triangle" },
      { id: "12.32", component: "LLMAsJudge", title: "LLM-as-Judge" },
      { id: "12.33", component: "RAGASMetrics", title: "RAGAS Metrics" },
      { id: "12.34", component: "GoldenDatasets", title: "Golden Datasets" },
      { id: "12.35", component: "OnlineEvalABTesting", title: "Online Eval & A/B Testing" },
    ];
    expect(act8.length).toBe(expected.length);
    expected.forEach((exp, i) => {
      expect(act8[i].id).toBe(exp.id);
      expect(act8[i].component).toBe(exp.component);
      expect(act8[i].title).toBe(exp.title);
    });
  });

  it("Section 12 has at least 35 chapters after M5", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBeGreaterThanOrEqual(35);
  });
});

describe("Section 12 chapters 12.36-12.41 (M6)", () => {
  it("appends chapters 12.36 through 12.41 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(41);
    const m6 = section12.slice(-6);
    expect(m6[0].id).toBe("12.36");
    expect(m6[0].component).toBe("Caching");
    expect(m6[0].title).toBe("Caching - Prompt + Semantic");
    expect(m6[1].id).toBe("12.37");
    expect(m6[1].component).toBe("CostModels");
    expect(m6[1].title).toBe("Cost Models");
    expect(m6[2].id).toBe("12.38");
    expect(m6[2].component).toBe("ObservabilityTracing");
    expect(m6[2].title).toBe("Observability & Tracing");
    expect(m6[3].id).toBe("12.39");
    expect(m6[3].component).toBe("HallucinationDrift");
    expect(m6[3].title).toBe("Hallucination Detection & Drift");
    expect(m6[4].id).toBe("12.40");
    expect(m6[4].component).toBe("FrameworkChoice");
    expect(m6[4].title).toBe("Framework Choice");
    expect(m6[5].id).toBe("12.41");
    expect(m6[5].component).toBe("RAGDecisionFrameworkCapstone");
    expect(m6[5].title).toBe("The Complete RAG Decision Framework + Capstone");
  });
});

describe("HTML entity hygiene", () => {
  it("no source file uses the broken &approx; entity (React does not parse it; use &asymp;)", () => {
    const offenders = [];
    for (const file of walk(SRC_DIR)) {
      const content = fs.readFileSync(file, "utf8");
      content.split("\n").forEach((line, idx) => {
        if (line.includes("&approx;")) offenders.push(`${path.relative(SRC_DIR, file)}:${idx + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe("Section 13 registration", () => {
  it("has section 13 in sectionNames", () => {
    expect(sectionNames[13]).toBe("AI Agents");
  });

  it("has section 13 in sectionColors", () => {
    expect(sectionColors[13]).toBe("#00838f");
  });
});

describe("Act references do not leak into user-visible content", () => {
  // "Act N" / "Acts N-M" is an internal file-partition name (see CLAUDE.md).
  // Learners only see chapter numbers like 11.14 - they never encounter "Acts".
  // Comments (// ...) may still describe the file layout; visible JSX/strings may not.
  it("no section file references 'Act N' or 'Acts N' outside comments", () => {
    const offenders = [];
    const pattern = /\bActs?\s+\d/;
    for (const file of walk(SRC_DIR)) {
      const content = fs.readFileSync(file, "utf8");
      content.split("\n").forEach((line, idx) => {
        if (line.trim().startsWith("//")) return;
        if (pattern.test(line)) offenders.push(`${path.relative(SRC_DIR, file)}:${idx + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe("Section 13 Act 1+2 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.1 AnatomyOfLlmCall", () => {
    const c = findCh("13.1");
    expect(c).toBeDefined();
    expect(c.title).toBe("Anatomy of an LLM Call");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AnatomyOfLlmCall");
  });

  it("has 13.2 SystemPromptContract", () => {
    const c = findCh("13.2");
    expect(c).toBeDefined();
    expect(c.title).toBe("System Prompts - The Role Contract");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SystemPromptContract");
  });

  it("has 13.3 FewShotStructuredOutput", () => {
    const c = findCh("13.3");
    expect(c).toBeDefined();
    expect(c.title).toBe("Few-Shot + Structured Output");
    expect(c.section).toBe(13);
    expect(c.component).toBe("FewShotStructuredOutput");
  });

  it("has 13.4 ChainOfThoughtSelfConsistency", () => {
    const c = findCh("13.4");
    expect(c).toBeDefined();
    expect(c.title).toBe("Chain of Thought + Self-Consistency");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ChainOfThoughtSelfConsistency");
  });

  it("has 13.5 PromptVsTuneVsRagVsAgent", () => {
    const c = findCh("13.5");
    expect(c).toBeDefined();
    expect(c.title).toBe("Prompt vs Fine-Tune vs RAG vs Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("PromptVsTuneVsRagVsAgent");
  });

  it("has 13.6 ContextEngineering", () => {
    const c = findCh("13.6");
    expect(c).toBeDefined();
    expect(c.title).toBe("Context Engineering");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ContextEngineering");
  });

  it("has 13.7 ToolUseAsBridge", () => {
    const c = findCh("13.7");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Use - LLM as Orchestrator");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolUseAsBridge");
  });

  it("has 13.8 JsonSchemaForTools", () => {
    const c = findCh("13.8");
    expect(c).toBeDefined();
    expect(c.title).toBe("JSON Schemas + Tool Descriptions");
    expect(c.section).toBe(13);
    expect(c.component).toBe("JsonSchemaForTools");
  });

  it("has 13.9 ToolCallLifecycle", () => {
    const c = findCh("13.9");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Call Lifecycle");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolCallLifecycle");
  });

  it("has 13.10 ParallelToolsAndChoice", () => {
    const c = findCh("13.10");
    expect(c).toBeDefined();
    expect(c.title).toBe("Parallel Tools + Tool Choice");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ParallelToolsAndChoice");
  });

  it("has 13.11 ToolErrorsRetries", () => {
    const c = findCh("13.11");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Errors, Retries, Validation");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolErrorsRetries");
  });
});

describe("Section 13 Act 3+4 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.12 WhyProtocols", () => {
    const c = findCh("13.12");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Protocols?");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyProtocols");
  });

  it("has 13.13 McpArchitecture", () => {
    const c = findCh("13.13");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Architecture");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpArchitecture");
  });

  it("has 13.14 McpPrimitives", () => {
    const c = findCh("13.14");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Primitives - Tools, Resources, Prompts");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpPrimitives");
  });

  it("has 13.15 BuildingMcpServer", () => {
    const c = findCh("13.15");
    expect(c).toBeDefined();
    expect(c.title).toBe("Building an MCP Server");
    expect(c.section).toBe(13);
    expect(c.component).toBe("BuildingMcpServer");
  });

  it("has 13.16 McpSecurity", () => {
    const c = findCh("13.16");
    expect(c).toBeDefined();
    expect(c.title).toBe("MCP Security");
    expect(c.section).toBe(13);
    expect(c.component).toBe("McpSecurity");
  });

  it("has 13.17 A2AProtocol", () => {
    const c = findCh("13.17");
    expect(c).toBeDefined();
    expect(c.title).toBe("A2A - Agent-to-Agent Protocol");
    expect(c.section).toBe(13);
    expect(c.component).toBe("A2AProtocol");
  });

  it("has 13.18 WorkflowVsAgent", () => {
    const c = findCh("13.18");
    expect(c).toBeDefined();
    expect(c.title).toBe("Workflow vs Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkflowVsAgent");
  });

  it("has 13.19 WorkflowPrimitives", () => {
    const c = findCh("13.19");
    expect(c).toBeDefined();
    expect(c.title).toBe("Workflow Primitives - Chaining, Routing, Parallelization");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkflowPrimitives");
  });

  it("has 13.20 AgentLoop", () => {
    const c = findCh("13.20");
    expect(c).toBeDefined();
    expect(c.title).toBe("The Agent Loop");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentLoop");
  });

  it("has 13.21 ReActPattern", () => {
    const c = findCh("13.21");
    expect(c).toBeDefined();
    expect(c.title).toBe("ReAct Pattern");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ReActPattern");
  });

  it("has 13.22 PlanExecuteReflect", () => {
    const c = findCh("13.22");
    expect(c).toBeDefined();
    expect(c.title).toBe("Plan-Execute + Reflection");
    expect(c.section).toBe(13);
    expect(c.component).toBe("PlanExecuteReflect");
  });

  it("has 13.23 LoopTermination", () => {
    const c = findCh("13.23");
    expect(c).toBeDefined();
    expect(c.title).toBe("Loop Termination");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LoopTermination");
  });
});

describe("Section 13 Act 5+6 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.24 MemoryTaxonomy", () => {
    const c = findCh("13.24");
    expect(c).toBeDefined();
    expect(c.title).toBe("Memory Taxonomy - Short vs Long");
    expect(c.section).toBe(13);
    expect(c.component).toBe("MemoryTaxonomy");
  });

  it("has 13.25 WorkingMemory", () => {
    const c = findCh("13.25");
    expect(c).toBeDefined();
    expect(c.title).toBe("Working Memory - The Scratchpad");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WorkingMemory");
  });

  it("has 13.26 EpisodicMemory", () => {
    const c = findCh("13.26");
    expect(c).toBeDefined();
    expect(c.title).toBe("Episodic Memory - Past Events");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EpisodicMemory");
  });

  it("has 13.27 SemanticMemory", () => {
    const c = findCh("13.27");
    expect(c).toBeDefined();
    expect(c.title).toBe("Semantic Memory - Learned Facts");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SemanticMemory");
  });

  it("has 13.28 ProceduralMemory", () => {
    const c = findCh("13.28");
    expect(c).toBeDefined();
    expect(c.title).toBe("Procedural Memory - Learned Skills");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ProceduralMemory");
  });

  it("has 13.29 SummaryAndContextMgmt", () => {
    const c = findCh("13.29");
    expect(c).toBeDefined();
    expect(c.title).toBe("Summary Memory + Context Window Management");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SummaryAndContextMgmt");
  });

  it("has 13.30 WhyMultiAgent", () => {
    const c = findCh("13.30");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Multi-Agent?");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyMultiAgent");
  });

  it("has 13.31 OrchestratorWorker", () => {
    const c = findCh("13.31");
    expect(c).toBeDefined();
    expect(c.title).toBe("Orchestrator-Worker");
    expect(c.section).toBe(13);
    expect(c.component).toBe("OrchestratorWorker");
  });

  it("has 13.32 SupervisorHierarchy", () => {
    const c = findCh("13.32");
    expect(c).toBeDefined();
    expect(c.title).toBe("Supervisor / Hierarchical");
    expect(c.section).toBe(13);
    expect(c.component).toBe("SupervisorHierarchy");
  });

  it("has 13.33 AgentHandoffs", () => {
    const c = findCh("13.33");
    expect(c).toBeDefined();
    expect(c.title).toBe("Hand-Offs");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentHandoffs");
  });

  it("has 13.34 CriticDebate", () => {
    const c = findCh("13.34");
    expect(c).toBeDefined();
    expect(c.title).toBe("Critic / Debate / Reflection-as-Multi-Agent");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CriticDebate");
  });

  it("has 13.35 MultiAgentFailures", () => {
    const c = findCh("13.35");
    expect(c).toBeDefined();
    expect(c.title).toBe("Multi-Agent Failure Modes");
    expect(c.section).toBe(13);
    expect(c.component).toBe("MultiAgentFailures");
  });

  it("has 13.36 AgenticRag", () => {
    const c = findCh("13.36");
    expect(c).toBeDefined();
    expect(c.title).toBe("Agentic RAG");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgenticRag");
  });
});

describe("Section 13 Act 7 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.37 WhyEvalAgents", () => {
    const c = findCh("13.37");
    expect(c).toBeDefined();
    expect(c.title).toBe("Why Eval Agents Differently");
    expect(c.section).toBe(13);
    expect(c.component).toBe("WhyEvalAgents");
  });

  it("has 13.38 EvalDimensions", () => {
    const c = findCh("13.38");
    expect(c).toBeDefined();
    expect(c.title).toBe("Eval Dimensions");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EvalDimensions");
  });

  it("has 13.39 LlmAsJudge", () => {
    const c = findCh("13.39");
    expect(c).toBeDefined();
    expect(c.title).toBe("LLM-as-Judge");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LlmAsJudge");
  });

  it("has 13.40 TraceEvals", () => {
    const c = findCh("13.40");
    expect(c).toBeDefined();
    expect(c.title).toBe("Trace Evals");
    expect(c.section).toBe(13);
    expect(c.component).toBe("TraceEvals");
  });

  it("has 13.41 EvalSetsContinuous", () => {
    const c = findCh("13.41");
    expect(c).toBeDefined();
    expect(c.title).toBe("Eval Sets + Continuous Eval");
    expect(c.section).toBe(13);
    expect(c.component).toBe("EvalSetsContinuous");
  });
});

describe("Section 13 Act 8 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.42 AgentObservabilityTracing", () => {
    const c = findCh("13.42");
    expect(c).toBeDefined();
    expect(c.title).toBe("Observability & Tracing");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentObservabilityTracing");
  });

  it("has 13.43 CostControl", () => {
    const c = findCh("13.43");
    expect(c).toBeDefined();
    expect(c.title).toBe("Cost Control");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CostControl");
  });

  it("has 13.44 LatencyOptimization", () => {
    const c = findCh("13.44");
    expect(c).toBeDefined();
    expect(c.title).toBe("Latency Optimization");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LatencyOptimization");
  });

  it("has 13.45 Guardrails", () => {
    const c = findCh("13.45");
    expect(c).toBeDefined();
    expect(c.title).toBe("Guardrails");
    expect(c.section).toBe(13);
    expect(c.component).toBe("Guardrails");
  });

  it("has 13.46 PromptInjectionDefenses", () => {
    const c = findCh("13.46");
    expect(c).toBeDefined();
    expect(c.title).toBe("Prompt Injection Defenses");
    expect(c.section).toBe(13);
    expect(c.component).toBe("PromptInjectionDefenses");
  });

  it("has 13.47 ToolSecurity", () => {
    const c = findCh("13.47");
    expect(c).toBeDefined();
    expect(c.title).toBe("Tool Security");
    expect(c.section).toBe(13);
    expect(c.component).toBe("ToolSecurity");
  });
});

describe("Section 13 Act 9 chapter entries", () => {
  const findCh = (id) => chapters.find((c) => c.id === id);

  it("has 13.48 LangGraphFramework", () => {
    const c = findCh("13.48");
    expect(c).toBeDefined();
    expect(c.title).toBe("LangGraph");
    expect(c.section).toBe(13);
    expect(c.component).toBe("LangGraphFramework");
  });

  it("has 13.49 CrewAiAutoGen", () => {
    const c = findCh("13.49");
    expect(c).toBeDefined();
    expect(c.title).toBe("CrewAI / AutoGen");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CrewAiAutoGen");
  });

  it("has 13.50 VendorSdks", () => {
    const c = findCh("13.50");
    expect(c).toBeDefined();
    expect(c.title).toBe("Claude Agent SDK + OpenAI Agents");
    expect(c.section).toBe(13);
    expect(c.component).toBe("VendorSdks");
  });

  it("has 13.51 CustomNoFramework", () => {
    const c = findCh("13.51");
    expect(c).toBeDefined();
    expect(c.title).toBe("Custom / No-Framework");
    expect(c.section).toBe(13);
    expect(c.component).toBe("CustomNoFramework");
  });

  it("has 13.52 AgentDecisionFramework", () => {
    const c = findCh("13.52");
    expect(c).toBeDefined();
    expect(c.title).toBe("The Complete Agent Decision Framework");
    expect(c.section).toBe(13);
    expect(c.component).toBe("AgentDecisionFramework");
  });
});

describe("chapter.file field", () => {
  it("every chapter has a non-empty string file field", () => {
    for (const ch of chapters) {
      expect(typeof ch.file).toBe("string");
      expect(ch.file.length).toBeGreaterThan(0);
    }
  });

  it("file values are kebab-case path of form 'topic/chapter' (no .jsx, no leading slash)", () => {
    const pattern = /^[a-z0-9]+(-[a-z0-9]+)*\/[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const ch of chapters) {
      expect(ch.file).toMatch(pattern);
    }
  });

  it("file values are unique per chapter (no two chapters point at the same file)", () => {
    const seen = new Set();
    for (const ch of chapters) {
      expect(seen.has(ch.file)).toBe(false);
      seen.add(ch.file);
    }
  });

  it("file topic prefix matches the section file currently exporting the component", async () => {
    const { readdirSync, readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const sectionsDir = join(process.cwd(), "src/sections");
    const componentToTopic = new Map();
    for (const fname of readdirSync(sectionsDir)) {
      if (!fname.endsWith(".jsx")) continue;
      const topic = fname.replace(/\.jsx$/, "");
      const src = readFileSync(join(sectionsDir, fname), "utf-8");
      for (const m of src.matchAll(/^export const (\w+)\s*=/gm)) {
        componentToTopic.set(m[1], topic);
      }
      // toc.jsx exports TOC as named export too
      for (const m of src.matchAll(/^export function (\w+)/gm)) {
        componentToTopic.set(m[1], topic);
      }
    }
    // TOC may be exported differently; handle by explicit override if needed.
    if (!componentToTopic.has("TOC")) componentToTopic.set("TOC", "toc");

    for (const ch of chapters) {
      const expectedTopic = componentToTopic.get(ch.component);
      const actualTopic = ch.file.split("/")[0];
      // TOC is the one exception: it lives in src/sections/toc.jsx (topic "toc"),
      // but its destination folder is "table-of-contents" per the plan.
      if (ch.component === "TOC") {
        expect(actualTopic).toBe("table-of-contents");
        continue;
      }
      expect(expectedTopic, `Component ${ch.component} (chapter ${ch.id}) not found in any section file`).toBeDefined();
      expect(actualTopic).toBe(expectedTopic);
    }
  });
});
