import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  chapters,
  sectionNames,
  sectionColors,
  superSections,
  C,
  validateConfig,
} from "../config.js";

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

  it("no chapter prose contains standalone uppercase IS as auxiliary verb", () => {
    const offenders = [
      { file: "rag-foundations/where-naive-rag-breaks.jsx", text: "limit IS in the doc" },
      { file: "rag-foundations/where-naive-rag-breaks.jsx", text: "answer IS in the retrieved context" },
      { file: "rag-retrieval/domain-adaptation.jsx", text: "training data IS the model" },
      { file: "rag-production/rag-decision-framework-capstone.jsx", text: "Case citation IS a graph" },
      { file: "encoder-decoder-diagrams/encoder-decoder-inference.jsx", text: "there IS only one position" },
    ];
    offenders.forEach(({ file, text }) => {
      const content = fs.readFileSync(path.join(SRC_DIR, "chapters", file), "utf8");
      expect(content, `${file} still contains "${text}"`).not.toContain(text);
    });
  });

  describe("superSections", () => {
    it("exports exactly 6 super-sections with ids A..F", () => {
      expect(superSections).toHaveLength(6);
      expect(superSections.map((s) => s.id)).toEqual(["A", "B", "C", "D", "E", "F"]);
    });

    it("every super-section has required fields", () => {
      superSections.forEach((s) => {
        expect(typeof s.id).toBe("string");
        expect(typeof s.name).toBe("string");
        expect(Array.isArray(s.sections)).toBe(true);
        expect(typeof s.color).toBe("string");
        expect(s.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it("super-section names match the agreed spec", () => {
      const names = Object.fromEntries(superSections.map((s) => [s.id, s.name]));
      expect(names).toEqual({
        A: "Foundations of Deep Learning",
        B: "The Rise of LLMs",
        C: "The Transformer Era",
        D: "Vector Databases at Depth",
        E: "Retrieval-Augmented Generation (RAG)",
        F: "Agentic AI",
      });
    });

    it("super-section section lists cover sections 1..28 exactly once", () => {
      const flat = superSections.flatMap((s) => s.sections);
      const sorted = [...flat].sort((a, b) => a - b);
      expect(sorted).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
    });

    it("super-section section lists match the agreed spec", () => {
      const groups = Object.fromEntries(superSections.map((s) => [s.id, s.sections]));
      expect(groups).toEqual({
        A: [1, 2, 3, 4],
        B: [5, 6],
        C: [7, 8, 9, 10, 11, 12, 13, 14],
        D: [15, 16, 17, 18],
        E: [19, 20, 21, 22, 23],
        F: [24, 25, 26, 27, 28],
      });
    });
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

describe("split mega-sections 11/12/13 into 14 focused sections", () => {
  it("has 28 distinct sections (excluding 0)", () => {
    const sections = new Set(chapters.filter((c) => c.section > 0).map((c) => c.section));
    expect(sections.size).toBe(28);
  });

  it.each([
    ["1.1", 1, "What is a Neural Network?"],
    ["1.7", 1, "The Forward Pass - Full Example"],
    ["2.1", 2, "Loss - How Wrong Were We?"],
    ["2.8", 2, "Why Deep Backprop Gets Hard"],
    ["3.1", 3, "Vectors - Numbers That Travel Together"],
    ["3.5", 3, "Activation Functions - The Full Picture"],
    ["4.1", 4, 'What "Deep" Really Means'],
    ["4.6", 4, "Weight Initialization - How Random?"],
    ["5.1", 5, "Tokenization - From Words to Numbers"],
    ["10.1", 10, "Step 1 - Compute Q, K, V for Every Word"],
    ["10.8", 10, "The Full Formula"],
    ["11.1", 11, "Why Multi-Head? - The Compromise Problem"],
    ["11.8", 11, "The Complete Picture - In Plain English"],
    ["15.12", 15, "Vamana / DiskANN"],
    ["16.1", 16, "The Memory Wall"],
    ["17.1", 17, "Filtering"],
    ["18.1", 18, "FAISS"],
    ["19.1", 19, "Why LLMs Need Retrieval"],
    ["20.1", 20, "Parsing - Raw Sources to Clean Text"],
    ["21.1", 21, "Picking an Embedding Model"],
    ["22.1", 22, "Context Packing"],
    ["23.1", 23, "The RAG Eval Triangle"],
    ["24.1", 24, "Anatomy of an LLM Call"],
    ["25.1", 25, "Tool Use - LLM as Orchestrator"],
    ["26.1", 26, "Workflow vs Agent"],
    ["27.1", 27, "Why Multi-Agent?"],
    ["28.1", 28, "Why Eval Agents Differently"],
    ["28.16", 28, "The Complete Agent Decision Framework"],
  ])("chapter %s lives in section %i with title %s", (id, section, title) => {
    const ch = chapters.find((c) => c.id === id);
    expect(ch, `chapter ${id} should exist`).toBeDefined();
    expect(ch.section).toBe(section);
    expect(ch.title).toBe(title);
  });

  it.each([
    [1, "Neural Networks - The Mechanics"],
    [2, "Learning & Backprop"],
    [3, "Linear Algebra for Deep Learning"],
    [4, "Training Deep Networks"],
    [5, "How LLMs Actually Train"],
    [6, "Scaling & Modern Techniques"],
    [7, "The Road to Transformers"],
    [8, "Transformer Input Pipeline"],
    [9, "Attention - Understanding Q, K, V"],
    [10, "Computing Attention"],
    [11, "Multi-Head Attention"],
    [12, "The Encoder"],
    [13, "The Decoder"],
    [14, "Modern LLM Techniques"],
    [15, "Vector Search - From Brute Force to ANN"],
    [16, "Vector Compression - Quantization & Matryoshka"],
    [17, "Vector DBs in Production"],
    [18, "Picking a Vector Database"],
    [19, "The RAG Pipeline - Why & How It Breaks"],
    [20, "RAG Data Prep - Ingestion & Chunking"],
    [21, "RAG Retrieval - Embeddings, Hybrid & Query Tricks"],
    [22, "RAG Generation - Naive to Advanced Patterns"],
    [23, "RAG in Production - Eval, Cost & Shipping"],
    [24, "Prompting LLMs - The Foundation"],
    [25, "Tools & Protocols - MCP, A2A"],
    [26, "Agent Mechanics - Loops & Memory"],
    [27, "Multi-Agent Systems"],
    [28, "Shipping Agents - Eval, Safety, Frameworks"],
  ])("section %i has name %s", (num, name) => {
    expect(sectionNames[num]).toBe(name);
  });

  it("has a color for every section 1-28", () => {
    for (let n = 1; n <= 28; n++) {
      expect(sectionColors[n], `section ${n} missing color`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("expected chapter count per section", () => {
    const counts = {};
    chapters.filter((c) => c.section > 0).forEach((c) => (counts[c.section] = (counts[c.section] || 0) + 1));
    const expected = {
      1: 7,
      2: 8,
      3: 5,
      4: 6,
      5: 10,
      6: 6,
      7: 4,
      8: 9,
      9: 12,
      10: 8,
      11: 8,
      12: 9,
      13: 7,
      14: 4,
      15: 12,
      16: 8,
      17: 10,
      18: 7,
      19: 3,
      20: 10,
      21: 8,
      22: 9,
      23: 11,
      24: 6,
      25: 11,
      26: 12,
      27: 7,
      28: 16,
    };
    Object.entries(expected).forEach(([sec, count]) => {
      expect(counts[Number(sec)], `section ${sec} should have ${count} chapters`).toBe(count);
    });
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

  it("every chapter file exists at src/chapters/<file>.jsx and default-exports the configured component", async () => {
    const { readFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const chaptersDir = join(process.cwd(), "src/chapters");
    for (const ch of chapters) {
      const filePath = join(chaptersDir, `${ch.file}.jsx`);
      expect(existsSync(filePath), `chapter file missing for ${ch.id}: ${filePath}`).toBe(true);
      const src = readFileSync(filePath, "utf-8");
      const defaultExportPattern = new RegExp(`export default function ${ch.component}\\b`);
      expect(defaultExportPattern.test(src), `${filePath} does not default-export function ${ch.component}`).toBe(true);
    }
  });
});
