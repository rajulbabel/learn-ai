import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CrossEntropy from "../../../chapters/llm-training/cross-entropy.jsx";

afterEach(() => cleanup());

describe("CrossEntropy (2.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CrossEntropy(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces loss function concept", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("loss function");
    expect(text).toContain("cross-entropy");
  });

  it("sub=1 shows the -log(P) formula as an SVG visual", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const text = container.textContent;
    expect(text).toContain("log");
  });

  it("sub=1 shows the -log(P) graph curve", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("0.0");
    expect(text).toContain("1.0");
    expect(text).toContain("probability");
  });

  it("sub=1 explains the graph with concrete LLM examples", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("confident");
  });

  it("sub=1 does NOT contain the weather forecaster example (that is sub 2)", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).not.toContain("weather");
  });

  it("sub=2 shows the weather forecaster intuition", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("weather");
    expect(text).toContain("rain");
  });

  it("sub=3 shows cross-entropy formula in detail with P values", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("P_correct");
    expect(text).toContain("0.69");
  });

  it("sub=4 explains why cross-entropy beats MSE", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("MSE");
    expect(text).toContain("Cross-Entropy");
  });

  it("sub=5 shows batch loss averaging", () => {
    const { container } = render(CrossEntropy(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("Batch Loss");
    expect(text).toContain("1.15");
  });
});
