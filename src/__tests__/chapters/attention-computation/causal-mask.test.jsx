import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CausalMask from "../../../chapters/attention-computation/causal-mask.jsx";

afterEach(() => cleanup());

describe("CausalMask (9.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CausalMask(makeCtx({ sub: 0 })))).not.toThrow();
  });
});

describe("CausalMask sub-steps", () => {
  it("sub 0 shows the problem - future words shouldn't be visible during generation", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("generat");
    expect(text).toContain("future");
  });

  it("sub 1 shows who-can-look-at-whom grid and unmasked score matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toMatch(/The|cat|sat|on/);
    expect(text).toContain("diagonal");
    expect(text).toContain("future");
  });

  it("sub 2 shows the mask matrix with -infinity for future positions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toMatch(/-inf|infinity|∞/i);
    expect(text).toContain("mask");
  });

  it("sub 3 shows masked scores only", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("masked");
    expect(text).toContain("scores");
  });

  it("sub 4 shows softmax turning masked scores into attention weights", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("0.00");
  });

  it("sub 5 shows bidirectional vs causal visual comparison", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toMatch(/[Bb]idirectional/);
    expect(text).toMatch(/[Cc]ausal/);
  });

  it("sub 6 shows training insight - every position makes a prediction", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("Training Insight");
    expect(text).toContain("prediction");
    expect(text).toContain("Causal Mask");
    expect(text).toContain("HONEST");
    expect(text).toContain("0 usable training examples");
    expect(text).toContain("4 usable training examples");
  });

  it("sub 7 shows encoder-only architecture (BERT, RoBERTa)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-ONLY");
    expect(text).toContain("BERT");
    expect(text).toContain("bidirectional");
    expect(text).not.toContain("DECODER-ONLY");
    expect(text).not.toContain("ENCODER-DECODER");
  });

  it("sub 8 shows decoder-only architecture (GPT, Claude, LLaMA)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("DECODER-ONLY");
    expect(text).toContain("GPT");
    expect(text).toContain("generate");
  });

  it("sub 9 shows encoder-decoder architecture (T5, BART) and core rule summary", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(CausalMask(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-DECODER");
    expect(text).toContain("T5");
    expect(text).toContain("core rule");
    expect(text).toContain("already exists");
    expect(text).toContain("being generated");
  });
});
