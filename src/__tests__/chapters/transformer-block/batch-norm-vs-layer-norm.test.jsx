import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BatchNormVsLayerNorm from "../../../chapters/transformer-block/batch-norm-vs-layer-norm.jsx";

afterEach(() => cleanup());

describe("BatchNormVsLayerNorm (8.9)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(BatchNormVsLayerNorm(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows Batch Normalization across the batch dimension", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(BatchNormVsLayerNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Batch Normalization");
    expect(text).toContain("batch");
    expect(text).toContain("1.05");
  });

  it("sub 1 explains why Batch Norm works for CNNs and images", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(BatchNormVsLayerNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("CNN");
    expect(text).toContain("image");
    expect(text).toContain("Training speedup");
  });

  it("sub 2 explains why Batch Norm fails for language - 3 problems", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(BatchNormVsLayerNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Variable Sequence");
    expect(text).toContain("Batch Size 1");
    expect(text).toContain("Tokens Are Fundamentally Different");
  });

  it("sub 3 shows Layer Normalization across the feature dimension", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(BatchNormVsLayerNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Layer Normalization");
    expect(text).toContain("feature");
    expect(text).toContain("0.60");
  });

  it("sub 4 shows side-by-side Batch Norm vs Layer Norm comparison", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(BatchNormVsLayerNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Batch Norm");
    expect(text).toContain("Layer Norm");
    expect(text).toContain("columns");
    expect(text).toContain("rows");
  });
});
