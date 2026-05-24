import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AutoregressiveGeneration from "../../../chapters/llm-training/autoregressive-generation.jsx";

afterEach(() => cleanup());

describe("AutoregressiveGeneration (2.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AutoregressiveGeneration(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces training vs generation distinction with visual contrast", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("training");
    expect(text).toContain("one word at a time");
  });

  it("sub=1 shows step-by-step generation with full pipeline per step", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("mat");
    expect(text).toContain("softmax");
  });

  it("sub=2 explains greedy vs sampling vs top-k with probability bars", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Greedy");
    expect(text).toContain("probability");
    expect(text).toContain("Top");
  });

  it("sub=3 explains temperature as the creativity dial with concrete examples", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("Temperature");
    expect(text).toContain("logit");
    expect(text).toContain("argmax");
  });

  it("sub=4 explains why generation works and when it stops", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("context");
    expect(text).toContain("stop");
    expect(text.toLowerCase()).not.toContain("self-attention");
    expect(text.toLowerCase()).not.toContain("attention pairs");
  });

  it("does not reference attention concepts anywhere (not yet taught)", () => {
    const { container } = render(AutoregressiveGeneration(makeCtx({ sub: 4 })));
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain("self-attention");
    expect(text).not.toContain("attention pairs");
    expect(text).not.toContain("attn pairs");
    expect(text).not.toContain("quadratic");
  });
});
