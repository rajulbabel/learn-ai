import { describe, it, expect } from "vitest";
import chunks from "../data/chunks.json";

describe("chunks.json schema", () => {
  it("has at least 500 chunks (sanity)", () => {
    expect(chunks.length).toBeGreaterThan(500);
  });

  it("every chunk has the required fields with correct types", () => {
    const required = ["id", "chapterSlug", "chapterTitle", "sub", "kind", "text", "summary", "queries", "terms"];
    for (const c of chunks) {
      for (const f of required) {
        expect(c[f] !== undefined, `chunk ${c.id} missing ${f}`).toBe(true);
      }
      expect(typeof c.id).toBe("string");
      expect(c.id.length).toBe(16);
      expect(typeof c.chapterSlug).toBe("string");
      expect(typeof c.sub).toBe("number");
      expect(["concept", "formula", "example", "diagram", "summary"]).toContain(c.kind);
      expect(c.text.length).toBeGreaterThan(10);
      expect(c.summary.length).toBeGreaterThan(5);
      expect(Array.isArray(c.queries)).toBe(true);
      expect(c.queries.length).toBeGreaterThanOrEqual(10);
      expect(Array.isArray(c.terms)).toBe(true);
      expect(c.terms.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("ids are unique", () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
