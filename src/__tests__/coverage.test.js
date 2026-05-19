import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";
import { chapters } from "../config.js";

describe("search coverage", () => {
  it("every chapter in config (except TOC) has chunks", () => {
    const indexed = new Set(chunks.map((c) => c.chapterSlug));
    const missing = chapters
      .filter((c) => c.id !== "0" && c.component)
      .filter((c) => !indexed.has(c.slug))
      .map((c) => c.id);
    expect(missing, `missing chapters: ${missing.join(", ")}`).toEqual([]);
  });
});
