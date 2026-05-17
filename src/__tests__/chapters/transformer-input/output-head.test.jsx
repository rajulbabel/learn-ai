import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import OutputHead from "../../../chapters/transformer-input/output-head.jsx";

afterEach(() => cleanup());

describe("OutputHead (9.4)", () => {
  for (let s = 0; s <= 7; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(OutputHead(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 introduces the gap between vectors and words", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("512");
    expect(text).toContain("vocab");
  });

  it("sub 1 shows the linear projection with matrix dimensions", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Linear");
    expect(text).toContain("50,257");
    expect(text).toContain("matrix");
  });

  it("sub 2 explains what logits mean with concrete scores", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("dot product");
  });

  it("sub 3 shows softmax converting logits to probabilities", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("probabilit");
  });

  it("sub 4 shows temperature effect on distributions", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("temperature");
  });

  it("sub 5 shows sampling strategies with visual", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("Greedy");
    expect(text).toContain("Top-k");
    expect(text).toContain("Top-p");
  });

  it("sub 6 explains weight tying", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("weight tying");
    expect(text).toContain("embedding");
  });

  it("sub 7 shows the complete output pipeline", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("hidden state");
    expect(text).toContain("token");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=7", () => {
    const { container } = render(OutputHead(makeCtx({ sub: 7 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
