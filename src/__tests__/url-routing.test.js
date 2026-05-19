import { describe, it, expect } from "vitest";
import { BASE_PATH, parsePath, buildPath, resolveInitialState } from "../url-routing.js";
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

describe("buildPath", () => {
  it("TOC with no super returns bare base", () => {
    expect(buildPath({ kind: "toc", super: null, section: null }, cfg)).toBe("/learn-ai/");
  });

  it("TOC super-only returns base + super slug", () => {
    expect(buildPath({ kind: "toc", super: "C", section: null }, cfg)).toBe("/learn-ai/transformers");
  });

  it("TOC super + section returns base + super + section slug", () => {
    expect(buildPath({ kind: "toc", super: "C", section: 10 }, cfg)).toBe("/learn-ai/transformers/attention");
  });

  it("chapter with sub=0 omits sub segment", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    expect(buildPath({ kind: "chapter", ch: idx, sub: 0 }, cfg)).toBe("/learn-ai/neural-foundations/what-is-nn");
  });

  it("chapter with sub>0 includes sub segment", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/compute-qkv");
    expect(buildPath({ kind: "chapter", ch: idx, sub: 3 }, cfg)).toBe("/learn-ai/attention-computation/compute-qkv/3");
  });

  it("TOC chapter (ch=0) builds bare base regardless of sub", () => {
    expect(buildPath({ kind: "chapter", ch: 0, sub: 0 }, cfg)).toBe("/learn-ai/");
    expect(buildPath({ kind: "chapter", ch: 0, sub: 5 }, cfg)).toBe("/learn-ai/");
  });

  it("round-trip chapter parses back to the same state", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/compute-qkv");
    const state = { kind: "chapter", ch: idx, sub: 2 };
    expect(parsePath(buildPath(state, cfg), cfg)).toEqual(state);
  });

  it("round-trip TOC super+section parses back to the same state", () => {
    const state = { kind: "toc", super: "D", section: 17 };
    expect(parsePath(buildPath(state, cfg), cfg)).toEqual(state);
  });

  it("chapter index out of range returns bare base", () => {
    expect(buildPath({ kind: "chapter", ch: 9999, sub: 0 }, cfg)).toBe("/learn-ai/");
  });

  it("TOC with unknown super-id returns bare base", () => {
    expect(buildPath({ kind: "toc", super: "ZZ", section: null }, cfg)).toBe("/learn-ai/");
  });

  it("TOC with section not belonging to the named super returns super-only path", () => {
    // section 10 ("attention") belongs to super C, not D - falls back to super-only
    expect(buildPath({ kind: "toc", super: "D", section: 10 }, cfg)).toBe("/learn-ai/vector-databases");
  });

  it("TOC with unknown section number returns super-only path", () => {
    expect(buildPath({ kind: "toc", super: "C", section: 9999 }, cfg)).toBe("/learn-ai/transformers");
  });

  it("unknown state.kind returns bare base", () => {
    expect(buildPath({ kind: "invalid" }, cfg)).toBe("/learn-ai/");
  });
});

describe("resolveInitialState", () => {
  it("chapter URL resolves to chapter state", () => {
    const idx = chapters.findIndex((c) => c.slug === "attention-computation/compute-qkv");
    const state = resolveInitialState("/learn-ai/attention-computation/compute-qkv/2", null, cfg);
    expect(state).toEqual({ ch: idx, sub: 2, expanded: null });
  });

  it("TOC super URL resolves to expanded state", () => {
    const state = resolveInitialState("/learn-ai/transformers", null, cfg);
    expect(state).toEqual({ ch: 0, sub: 0, expanded: { super: "C", section: null } });
  });

  it("TOC super+section URL resolves to expanded state", () => {
    const state = resolveInitialState("/learn-ai/transformers/attention", null, cfg);
    expect(state).toEqual({ ch: 0, sub: 0, expanded: { super: "C", section: 10 } });
  });

  it("bare URL with saved nav resolves to saved chapter", () => {
    const idx = chapters.findIndex((c) => c.slug === "neural-foundations/what-is-nn");
    const state = resolveInitialState("/learn-ai/", { ch: idx, sub: 1 }, cfg);
    expect(state).toEqual({ ch: idx, sub: 1, expanded: null });
  });

  it("bare URL with no saved nav resolves to TOC", () => {
    expect(resolveInitialState("/learn-ai/", null, cfg)).toEqual({ ch: 0, sub: 0, expanded: null });
  });

  it("invalid URL falls back to TOC (ignores localStorage on invalid URL)", () => {
    expect(resolveInitialState("/learn-ai/no/such/chapter", { ch: 5, sub: 2 }, cfg)).toEqual({
      ch: 0,
      sub: 0,
      expanded: null,
    });
  });
});
