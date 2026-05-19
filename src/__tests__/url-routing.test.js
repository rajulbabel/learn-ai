import { describe, it, expect } from "vitest";
import { BASE_PATH, parsePath } from "../url-routing.js";
import { chapters, sections, superSections } from "../config.js";

const cfg = { chapters, sections, superSections };

describe("BASE_PATH", () => {
  it("ends with a slash", () => {
    expect(BASE_PATH.endsWith("/")).toBe(true);
  });

  it("matches the configured base path", () => {
    expect(BASE_PATH).toBe("/learn-ai/");
  });
});

describe("parsePath - TOC", () => {
  it("bare base path is TOC collapsed", () => {
    expect(parsePath("/learn-ai/", cfg)).toEqual({ kind: "toc", super: null, section: null });
  });

  it("trailing slash optional on bare path", () => {
    expect(parsePath("/learn-ai", cfg)).toEqual({ kind: "toc", super: null, section: null });
  });

  it("known super slug returns super open", () => {
    expect(parsePath("/learn-ai/transformers", cfg)).toEqual({ kind: "toc", super: "C", section: null });
  });

  it("known super + section slug returns both open", () => {
    expect(parsePath("/learn-ai/transformers/attention", cfg)).toEqual({ kind: "toc", super: "C", section: 10 });
  });

  it("unknown super slug returns invalid", () => {
    expect(parsePath("/learn-ai/nonsense", cfg).kind).toBe("invalid");
  });

  it("known super + unknown section slug returns invalid", () => {
    expect(parsePath("/learn-ai/transformers/nonsense", cfg).kind).toBe("invalid");
  });

  it("section that does not belong to the named super is invalid", () => {
    // section "attention" (slug = attention) belongs to super C, not D
    expect(parsePath("/learn-ai/vector-databases/attention", cfg).kind).toBe("invalid");
  });

  it("parses a slug without the base prefix", () => {
    expect(parsePath("transformers", cfg)).toEqual({ kind: "toc", super: "C", section: null });
  });

  it("paths with more than two segments are invalid", () => {
    expect(parsePath("/learn-ai/a/b/c", cfg).kind).toBe("invalid");
  });

  it("root path resolves to TOC collapsed", () => {
    expect(parsePath("/", cfg)).toEqual({ kind: "toc", super: null, section: null });
  });

  it("two-segment path with unknown super is invalid", () => {
    expect(parsePath("/learn-ai/nope/whatever", cfg).kind).toBe("invalid");
  });
});
