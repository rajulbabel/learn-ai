import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";

describe("search index basics", () => {
  it("includes every chapter ID from config (except TOC)", async () => {
    const { chapters } = await import("../config.js");
    const indexed = new Set(chunks.map((c) => c.chapterSlug));
    const missing = [];
    for (const ch of chapters) {
      if (ch.id === "0" || !ch.component) continue;
      if (!indexed.has(ch.file)) missing.push(ch.id);
    }
    expect(missing, `missing chapters: ${missing.join(", ")}`).toEqual([]);
  });

  it("section 15 has 12 unique chapters (Vector Search Algorithms)", async () => {
    const { chapters } = await import("../config.js");
    const sec15Slugs = new Set(chapters.filter((c) => c.section === 15).map((c) => c.file));
    const s15 = new Set(chunks.filter((c) => sec15Slugs.has(c.chapterSlug)).map((c) => c.chapterSlug));
    expect(s15.size).toBe(12);
  });

  it("every chunk has at least 10 queries and required fields", () => {
    for (const c of chunks) {
      expect(c.queries.length, `chunk ${c.id} has too few queries`).toBeGreaterThanOrEqual(10);
      expect(typeof c.text).toBe("string");
      expect(typeof c.summary).toBe("string");
      expect(Array.isArray(c.terms)).toBe(true);
      expect(c.terms.length).toBeGreaterThan(0);
    }
  });

  it("text search returns results for golden queries", async () => {
    const { searchText, initSearch } = await import("../search.js");
    await initSearch();
    const golden = [
      { q: "HNSW", expectChapter: /^15\.[789]|15\.10|15\.12/ },
      { q: "product quantization", expectChapter: /^16\.(2|3|5|6|7)/ },
      { q: "RoPE", expectChapter: /^8\.9$/ },
      { q: "softmax temperature", expectChapter: /^(5\.6|6\.4|10\.[46]|13\.4)/ },
      { q: "vanishing gradient", expectChapter: /^(2\.8|7\.3)/ },
      { q: "scaling laws", expectChapter: /^6\.1$/ },
      { q: "binary quantization", expectChapter: /^16\.(3|4|7)/ },
      { q: "cross attention", expectChapter: /^13\.3$/ },
    ];
    for (const { q, expectChapter } of golden) {
      const results = searchText(q, 5);
      expect(results.length, `no results for "${q}"`).toBeGreaterThan(0);
      const top3 = results.slice(0, 3).map((r) => r.chapterId);
      expect(
        top3.some((id) => expectChapter.test(id)),
        `"${q}" top 3 = ${JSON.stringify(top3)}, expected match for ${expectChapter}`,
      ).toBe(true);
    }
  });
});
