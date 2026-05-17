import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import OutputLayer from "../../../chapters/llm-training/output-layer.jsx";

afterEach(() => cleanup());

describe("OutputLayer (2.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(OutputLayer(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 explains hidden state from scratch with layer-by-layer visual", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("hidden state");
    expect(text).toContain("768");
    expect(text).toContain("layer");
    expect(text).toContain("vector");
  });

  it("sub=1 explains what logits are before using them", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("score");
    expect(text).toContain("50,000");
  });

  it("sub=2 shows the NN diagram from layers to output via unembedding", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Unembedding");
    expect(text).toContain("hidden state");
    expect(text).toContain("unembedding matrix");
    expect(text).not.toContain("Transformer");
  });

  it("sub=3 shows the unembedding matrix with concrete dot product example", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("dot product");
    expect(text).toContain("row");
    expect(text).toContain("logit");
  });

  it("sub=4 shows raw logits for sample tokens", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("logits");
    expect(text).toContain("the");
    expect(text).toContain("softmax");
  });

  it("sub=5 shows softmax conversion with concrete probabilities", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("e^");
  });

  it("sub=6 explains why one linear layer works and parameter count", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("hidden layers");
    expect(text).toContain("parameter");
  });

  it("sub=7 explains weight tying with visual similarity example", () => {
    const { container } = render(OutputLayer(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("weight tying");
    expect(text).toContain("embedding");
    expect(text).toContain("mat");
    expect(text).toContain("rug");
  });
});
