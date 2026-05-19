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

describe("parsePath - chapter", () => {
  it("known chapter slug returns chapter sub=0", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg)).toEqual({
      kind: "chapter",
      ch: idx,
      sub: 0,
    });
  });

  it("known chapter slug with sub returns chapter at that sub", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/compute-qkv");
    expect(parsePath("/learn-ai/attention-computation/compute-qkv/3", cfg)).toEqual({
      kind: "chapter",
      ch: idx,
      sub: 3,
    });
  });

  it("chapter slug takes precedence over super+section if both shapes match (only chapter exists here)", () => {
    // No collisions in current data, but verify lookup order
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg).kind).toBe("chapter");
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn", cfg).ch).toBe(idx);
  });

  it("unknown chapter slug returns invalid", () => {
    expect(parsePath("/learn-ai/no-topic/no-chapter", cfg).kind).toBe("invalid");
  });

  it("known chapter slug with non-numeric sub returns invalid", () => {
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn/abc", cfg).kind).toBe("invalid");
  });

  it("known chapter slug with negative sub returns invalid", () => {
    expect(parsePath("/learn-ai/neural-foundations/what-is-nn/-1", cfg).kind).toBe("invalid");
  });

  it("four or more segments are invalid", () => {
    expect(parsePath("/learn-ai/a/b/c/d", cfg).kind).toBe("invalid");
  });
});
