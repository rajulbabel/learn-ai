import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FeedForwardNetwork from "../../../chapters/transformer-block/feed-forward-network.jsx";

afterEach(() => cleanup());

describe("FeedForwardNetwork (8.3)", () => {
  for (let s = 0; s <= 10; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(FeedForwardNetwork(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows where FFN sits in the Transformer block", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    expect(text).toContain("Feed-Forward");
  });

  it("sub 1 explains FFN is a simple 2-layer neural network", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("two");
    expect(text).toContain("layer");
    expect(text).toContain("W");
    expect(text).toContain("b");
  });

  it("sub 2 shows the expand-then-compress shape with dimensions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("512");
    expect(text).toContain("2048");
    expect(text).toContain("4x");
  });

  it("sub 3 shows step-by-step computation Step 1 only (W1 expansion)", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("cats");
    expect(text).toContain("W");
    expect(text).toMatch(/\d+\.\d+/);
    expect(text).not.toContain("Apply GELU");
    expect(text).not.toContain("compress 8");
  });

  it("sub 4 shows step-by-step computation Steps 2-3 (GELU + W2 compression)", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("GELU");
    expect(text).toContain("compress 8");
    expect(text).toContain("thinking space");
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 5 shows the GELU formula with Phi and erf, then compares to ReLU", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("GELU");
    expect(text).toContain("(x)");
    expect(text).toContain("erf");
    expect(text).toContain("0.977");
    expect(text).toContain("1.95");
    expect(text).toContain("ReLU");
    expect(text).toContain("smooth");
  });

  it("sub 5 includes a ReLU vs GELU comparison graph", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(FeedForwardNetwork(ctx));
    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBeGreaterThanOrEqual(2);
    const combinedDescs = Array.from(container.querySelectorAll("desc"))
      .map((d) => d.textContent)
      .join(" ");
    expect(combinedDescs).toMatch(/ReLU/);
    expect(combinedDescs).toMatch(/GELU/);
  });

  it("sub 6 shows area/length/breadth example", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("area");
    expect(text).toContain("length");
    expect(text).toContain("breadth");
    expect(text).toContain("knowledge");
  });

  it("sub 7 shows India/Delhi factual recall example", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("India");
    expect(text).toContain("Delhi");
    expect(text).toContain("847");
    expect(text).toContain("capital-of-France");
    expect(text).not.toContain("Paris");
    expect(text).not.toContain("capital of France");
  });

  it("sub 8 shows bank/river multi-block example with detector details", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("bank");
    expect(text).toContain("river");
    expect(text).toContain("Block 1");
    expect(text).toContain("Block 5");
  });

  it("sub 9 shows deep Q&A", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("attention replace FFN");
    expect(text).toContain("FFN replace attention");
  });

  it("sub 10 shows parameter breakdown in its own box", () => {
    const ctx = makeCtx({ sub: 10 });
    const { container } = render(FeedForwardNetwork(ctx));
    const text = container.textContent;
    expect(text).toContain("parameter");
    expect(text).toContain("2/3");
    expect(text).toContain("1/3");
  });
});
