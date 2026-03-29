/**
 * Content extraction script for search indexing.
 *
 * Run via: npx vitest run scripts/extract-content.jsx
 *
 * This renders every chapter at every sub level, extracts text content,
 * and writes a structured JSON file that the embedding script can consume.
 *
 * Output: src/data/chunks.json
 * Format: [{ id, chapterId, title, section, sectionName, sub, text }]
 */
import { describe, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { writeFileSync, mkdirSync } from "fs";
import { chapters, sectionNames } from "../src/config.js";
import svgDescriptions from "../src/data/svg-descriptions.json";

// Import all sections
import { TOC } from "../src/sections/toc.jsx";
import * as NeuralFoundations from "../src/sections/neural-foundations.jsx";
import * as LLMTraining from "../src/sections/llm-training.jsx";
import * as Scaling from "../src/sections/scaling.jsx";
import * as RoadToTransformers from "../src/sections/road-to-transformers.jsx";
import * as TransformerInput from "../src/sections/transformer-input.jsx";
import * as AttentionQKV from "../src/sections/attention-qkv.jsx";
import * as AttentionComputation from "../src/sections/attention-computation.jsx";
import * as TransformerBlock from "../src/sections/transformer-block.jsx";

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
};

function makeCtx(overrides = {}) {
  return {
    sub: 0,
    setSub: vi.fn(),
    subBtnRipple: 0,
    setSubBtnRipple: vi.fn(),
    navigate: vi.fn(),
    goTo: vi.fn(),
    bankIdx: 0,
    setBankIdx: vi.fn(),
    hovered: 0,
    setHovered: vi.fn(),
    expanded: null,
    setExpanded: vi.fn(),
    registerSubBtn: vi.fn(),
    ...overrides,
  };
}

/**
 * Render a chapter at a given sub level and extract its text content.
 * Returns the INCREMENTAL text added by this sub level (not cumulative).
 */
function extractTextAtSub(fn, sub) {
  try {
    const ctx = makeCtx({ sub });
    const { container } = render(fn(ctx));
    const text = container.textContent || "";
    cleanup();
    return text.replace(/\s+/g, " ").trim();
  } catch {
    cleanup();
    return "";
  }
}

/**
 * Find the max sub level for a chapter by rendering at increasing sub
 * values until the text stops changing.
 */
function findMaxSub(fn) {
  let prevText = "";
  let maxSub = 0;
  for (let sub = 0; sub <= 20; sub++) {
    const text = extractTextAtSub(fn, sub);
    if (sub > 0 && text === prevText) {
      // Text stopped changing, previous sub was the last meaningful one
      break;
    }
    prevText = text;
    maxSub = sub;
  }
  return maxSub;
}

describe("Content extraction", () => {
  it("extracts all chapter content into chunks.json", { timeout: 120000 }, () => {
    const allChunks = [];
    let chunkId = 0;

    for (const chapter of chapters) {
      if (chapter.id === "0") continue; // Skip TOC
      const fn = lookup[chapter.component];
      if (!fn) continue;

      const sectionName = sectionNames[chapter.section] || "";
      const maxSub = findMaxSub(fn);

      // Extract cumulative text at each sub level
      let prevCumulativeText = "";
      for (let sub = 0; sub <= maxSub; sub++) {
        const cumulativeText = extractTextAtSub(fn, sub);

        // Get the incremental text added by this sub level
        let incrementalText;
        if (sub === 0) {
          incrementalText = cumulativeText;
        } else {
          // Find the new text that wasn't in the previous level
          // Simple approach: if cumulative starts with previous, the diff is the new part
          if (cumulativeText.startsWith(prevCumulativeText.slice(0, 50))) {
            // Text is cumulative (Reveal adds content) - extract the delta
            incrementalText = cumulativeText.slice(prevCumulativeText.length).trim();
          } else {
            // Text changed entirely (unlikely but handle it)
            incrementalText = cumulativeText;
          }
        }

        if (incrementalText.length > 10) {
          allChunks.push({
            id: chunkId++,
            chapterId: chapter.id,
            title: chapter.title,
            section: chapter.section,
            sectionName,
            sub,
            text: incrementalText,
          });
        }

        prevCumulativeText = cumulativeText;
      }

      // Also create a chapter-level summary chunk (title + section for broad matching)
      allChunks.push({
        id: chunkId++,
        chapterId: chapter.id,
        title: chapter.title,
        section: chapter.section,
        sectionName,
        sub: -1,
        text: `${sectionName}: ${chapter.title}. This chapter covers ${chapter.title.toLowerCase()}.`,
      });

      // Add SVG diagram description chunks for richer semantic search
      if (svgDescriptions[chapter.id]) {
        for (const desc of svgDescriptions[chapter.id]) {
          allChunks.push({
            id: chunkId++,
            chapterId: chapter.id,
            title: chapter.title,
            section: chapter.section,
            sectionName,
            sub: -2,
            text: `Diagram in ${chapter.title}: ${desc}`,
          });
        }
      }
    }

    // Write output
    mkdirSync("src/data", { recursive: true });
    writeFileSync(
      "src/data/chunks.json",
      JSON.stringify(allChunks, null, 2),
    );

    console.log(`\n=== Extracted ${allChunks.length} chunks from ${chapters.length - 1} chapters ===\n`);

    // Sanity check
    expect(allChunks.length).toBeGreaterThan(100);
  });
});
