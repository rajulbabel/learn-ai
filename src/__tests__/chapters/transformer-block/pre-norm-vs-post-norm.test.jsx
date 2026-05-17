import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PreNormVsPostNorm from "../../../chapters/transformer-block/pre-norm-vs-post-norm.jsx";

afterEach(() => cleanup());

describe("PreNormVsPostNorm (8.8)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PreNormVsPostNorm(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows Post-Norm order from the original 2017 paper", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(PreNormVsPostNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Post-Norm");
    expect(text).toContain("LayerNorm");
    expect(text).toContain("2017");
  });

  it("sub 1 shows Pre-Norm with LayerNorm before each sub-layer", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(PreNormVsPostNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Pre-Norm");
    expect(text).toContain("LayerNorm");
    expect(text).toContain("before");
  });

  it("sub 2 shows side-by-side comparison with cats embedding", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(PreNormVsPostNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Post-Norm");
    expect(text).toContain("Pre-Norm");
    expect(text).toContain("-0.5");
    expect(text).toContain("skip path");
  });

  it("sub 3 explains why pre-norm wins with cleaner gradient flow", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(PreNormVsPostNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("gradient");
    expect(text).toContain("Training Stability");
    expect(text).toContain("warmup");
  });

  it("sub 4 shows who uses what - post-norm vs pre-norm models", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(PreNormVsPostNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("GPT-2");
    expect(text).toContain("GPT-3");
    expect(text).toContain("Claude");
    expect(text).toContain("LLaMA");
  });
});
