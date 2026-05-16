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

  it("Section 11 keys align with current chapter content after renumber", () => {
    // 11.19 = CompressionDecision flowchart
    expect(svgDescriptions["11.19"][0]).toMatch(/compression-technique decision flowchart|decision flowchart/i);
    // 11.20 = Filtering (three-stage funnel) - was at 11.19 before renumber
    expect(svgDescriptions["11.20"][0]).toMatch(/filter funnel|pre-filter|three-stage/i);
    // 11.21 = UpdatesDeletes (graph with hub node D) - was at 11.20 before renumber
    expect(svgDescriptions["11.21"][0]).toMatch(/hub node|central hub|node D/i);
    // 11.22 = Sharding (random sharding diagram)
    expect(svgDescriptions["11.22"][0]).toMatch(/sharding|fan-out|shards/i);
    // 11.23 = Replication (read-replica topology)
    expect(svgDescriptions["11.23"][0]).toMatch(/replica|topology/i);
    // 11.24 = HybridSearch (hybrid-search flow)
    expect(svgDescriptions["11.24"][0]).toMatch(/hybrid-search|hybrid search/i);
    // 11.25 = Rerankers (cross-encoder)
    expect(svgDescriptions["11.25"][0]).toMatch(/cross-encoder|reranker/i);
    // 11.36 = DecisionFramework (four-branch decision flowchart for vector DB)
    expect(svgDescriptions["11.36"][0]).toMatch(
      /decision flowchart.*vector database|vector database.*decision flowchart/i,
    );
    // 11.35 should NOT exist anymore
    expect(svgDescriptions["11.35"]).toBeUndefined();
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
      "1.8",
      "1.10",
      "1.11",
      "1.12",
      "1.13",
      "1.19",
      "1.23",
      "1.25",
      "1.26",
      "2.3",
      "2.5",
      "5.1",
      "5.8",
      "5.9",
      "7.4",
      "7.15",
      "8.3",
      "8.6",
      "9.3",
      "9.6",
      "9.7",
      "10.1",
      "10.3",
      "10.4",
      "11.1",
      "11.2",
      "11.3",
      "11.4",
      "11.5",
      "11.6",
      "11.7",
      "11.8",
      "11.9",
      "11.10",
      "11.11",
      "11.13",
      "11.14",
      "11.15",
      "11.16",
      "11.17",
      "11.18",
      "11.19",
      "11.20",
      "11.21",
      "11.22",
      "11.23",
      "11.24",
      "11.25",
      "11.36",
      "12.22",
      "12.23",
      "12.25",
      "12.26",
    ];
    for (const chId of expectedChapters) {
      expect(svgDescriptions[chId], `Missing descriptions for chapter ${chId}`).toBeDefined();
    }
  });
});
