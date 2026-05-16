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
  it("has chapters 12.1 through 12.6 in order", () => {
    const section12 = chapters.filter((ch) => ch.section === 12);
    expect(section12.length).toBe(6);
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
