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
    ];
    for (const chId of expectedChapters) {
      expect(svgDescriptions[chId], `Missing descriptions for chapter ${chId}`).toBeDefined();
    }
  });
});
