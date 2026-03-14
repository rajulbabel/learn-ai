import { describe, it, expect } from "vitest";
import { chapters, sectionNames, sectionColors, C } from "../config.js";

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

  it("every section (1-7) has a color", () => {
    for (let i = 1; i <= 7; i++) {
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
    const requiredKeys = ["bg", "card", "border", "dim", "mid", "bright", "red", "purple", "green", "cyan", "yellow", "pink", "orange", "blue"];
    requiredKeys.forEach((key) => {
      expect(C[key]).toBeDefined();
    });
  });
});
