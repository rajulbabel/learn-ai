import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ResidualHighway from "../../../chapters/transformer-block/residual-highway.jsx";

afterEach(() => cleanup());

describe("ResidualHighway (8.7)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(ResidualHighway(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows vanishing gradient problem with multiplied derivatives", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(ResidualHighway(ctx));
    const text = container.textContent;
    expect(text).toContain("gradient");
    expect(text).toContain("96");
    expect(text).toContain("0.99");
  });

  it("sub 1 shows the residual connection F(x) + x with skip path", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ResidualHighway(ctx));
    const text = container.textContent;
    expect(text).toContain("F(x) + x");
    expect(text).toContain("skip");
    expect(text).toContain("highway");
  });

  it("sub 2 shows the gradient math: F'(x) + 1 always at least 1", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(ResidualHighway(ctx));
    const text = container.textContent;
    expect(text).toContain("F'(x)");
    expect(text).toContain("+ 1");
    expect(text).toContain("1.01");
  });

  it("sub 3 shows the gradient highway visualization with 6 layers", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(ResidualHighway(ctx));
    const text = container.textContent;
    expect(text).toContain("Layer 1");
    expect(text).toContain("Layer 6");
    expect(text).toContain("1.00");
  });

  it("sub 4 shows why critical for transformers with GPT-2/GPT-3 residual counts", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(ResidualHighway(ctx));
    const text = container.textContent;
    expect(text).toContain("GPT-2");
    expect(text).toContain("GPT-3");
    expect(text).toContain("192");
    expect(text).toContain("gradient highways");
  });
});
