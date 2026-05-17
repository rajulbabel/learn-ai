import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SelfSupervised from "../../../chapters/llm-training/self-supervised.jsx";

afterEach(() => cleanup());

describe("SelfSupervised (2.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SelfSupervised(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 explains self-supervised learning intro", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Self-Supervised");
    expect(text).toContain("GPT");
    expect(text).toContain("next token");
  });

  it("sub=1 shows The cat sat on training examples", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("The cat sat");
    expect(text).toContain("INPUT:");
    expect(text).toContain("PREDICT:");
    expect(text).toContain("mat");
  });

  it("sub=2 shows probability distribution for next word", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("35%");
    expect(text).toContain("probabilities");
  });

  it("sub=3 shows cross-entropy loss computation", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("loss");
    expect(text).toContain("1.05");
    expect(text).toContain("0.35");
  });

  it("sub=4 explains why self-supervised works", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("Grammar");
    expect(text).toContain("Facts");
    expect(text).toContain("Reasoning");
  });

  it("sub=5 shows gradient descent training loop", () => {
    const { container } = render(SelfSupervised(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("Iteration 1");
    expect(text).toContain("4.2");
    expect(text).toContain("pretraining");
  });
});
