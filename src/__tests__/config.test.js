import { describe, it, expect, vi } from "vitest";
import { chapters, sectionNames, sectionColors, C, validateConfig } from "../config.js";

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

  it("every section (1-8) has a color", () => {
    for (let i = 1; i <= 8; i++) {
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
    const badConfig = [
      { id: "", title: "A", section: 1, component: "CompA" },
    ];
    const errors = validateConfig(badConfig);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("missing id");
  });

  it("validateConfig detects missing component", () => {
    const badConfig = [
      { id: "1.1", title: "A", section: 1, component: "" },
    ];
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
});
