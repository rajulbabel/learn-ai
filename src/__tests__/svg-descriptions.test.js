import { describe, it, expect } from "vitest";
import { chapters } from "../config.js";
import svgDescriptions from "../data/svg-descriptions.json";

describe("svg-descriptions.json", () => {
  it("every entry maps to a valid chapter ID", () => {
    const validIds = new Set(chapters.map((c) => c.id));
    for (const chId of Object.keys(svgDescriptions)) {
      expect(validIds.has(chId), `"${chId}" is not a valid chapter ID`).toBe(true);
    }
  });

  it("every entry has a non-empty array of descriptions", () => {
    for (const [chId, descs] of Object.entries(svgDescriptions)) {
      expect(Array.isArray(descs), `${chId} should be an array`).toBe(true);
      expect(descs.length, `${chId} has no descriptions`).toBeGreaterThan(0);
    }
  });

  it("every description is a meaningful string (>20 chars)", () => {
    for (const [chId, descs] of Object.entries(svgDescriptions)) {
      descs.forEach((d, i) => {
        expect(typeof d, `${chId}[${i}] should be a string`).toBe("string");
        expect(d.length, `${chId}[${i}] too short`).toBeGreaterThan(20);
      });
    }
  });

  it("Vector DB section SVG keys align with current chapter content after renumber", () => {
    // 16.8 = CompressionDecision flowchart
    expect(svgDescriptions["16.8"][0]).toMatch(/compression-technique decision flowchart|decision flowchart/i);
    // 17.1 = Filtering (three-stage funnel)
    expect(svgDescriptions["17.1"][0]).toMatch(/filter funnel|pre-filter|three-stage/i);
    // 17.2 = UpdatesDeletes (graph with hub node D)
    expect(svgDescriptions["17.2"][0]).toMatch(/hub node|central hub|node D/i);
    // 17.3 = Sharding (random sharding diagram)
    expect(svgDescriptions["17.3"][0]).toMatch(/sharding|fan-out|shards/i);
    // 17.4 = Replication (read-replica topology)
    expect(svgDescriptions["17.4"][0]).toMatch(/replica|topology/i);
    // 17.5 = HybridSearch (hybrid-search flow)
    expect(svgDescriptions["17.5"][0]).toMatch(/hybrid-search|hybrid search/i);
    // 17.6 = Rerankers (cross-encoder)
    expect(svgDescriptions["17.6"][0]).toMatch(/cross-encoder|reranker/i);
    // 18.7 = DecisionFramework (four-branch decision flowchart for vector DB)
    expect(svgDescriptions["18.7"][0]).toMatch(
      /decision flowchart.*vector database|vector database.*decision flowchart/i,
    );
    // 15.5 = SparseVsDense - no SVGs, entry intentionally absent
    expect(svgDescriptions["15.5"]).toBeUndefined();
  });

  it("covers all chapters known to have SVGs", () => {
    const expectedChapters = [
      "1.1",
      "1.2",
      "1.3",
      "1.4",
      "1.5",
      "1.6",
      "1.7",
      "2.1",
      "2.3",
      "2.4",
      "2.5",
      "2.6",
      "3.4",
      "4.3",
      "4.5",
      "4.6",
      "5.3",
      "5.5",
      "8.1",
      "8.8",
      "8.9",
      "10.4",
      "11.7",
      "12.3",
      "12.6",
      "13.3",
      "13.6",
      "13.7",
      "14.1",
      "14.3",
      "14.4",
      "15.1",
      "15.2",
      "15.3",
      "15.4",
      "15.6",
      "15.7",
      "15.8",
      "15.9",
      "15.10",
      "15.11",
      "15.12",
      "16.2",
      "16.3",
      "16.4",
      "16.5",
      "16.6",
      "16.7",
      "16.8",
      "17.1",
      "17.2",
      "17.3",
      "17.4",
      "17.5",
      "17.6",
      "18.7",
      "22.1",
      "22.2",
      "22.4",
      "22.5",
      "22.6",
      "22.7",
      "22.8",
      "22.9",
      "23.1",
      "23.2",
      "23.4",
      "23.5",
    ];
    for (const chId of expectedChapters) {
      expect(svgDescriptions[chId], `Missing descriptions for chapter ${chId}`).toBeDefined();
    }
  });
});
