import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TokenizerDeepDive from "../../../chapters/llm-training/tokenizer-deep-dive.jsx";

afterEach(() => cleanup());

describe("TokenizerDeepDive (2.10)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TokenizerDeepDive(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 recaps BPE with step-by-step trace", () => {
    const { container } = render(TokenizerDeepDive(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("BPE");
    expect(text).toContain("Byte-Pair");
    expect(text).toContain("Merge 1");
    expect(text).toContain('"low"');
  });

  it("sub=1 explains WordPiece used by BERT", () => {
    const { container } = render(TokenizerDeepDive(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("WordPiece");
    expect(text).toContain("BERT");
    expect(text).toContain("##");
  });

  it("sub=2 explains SentencePiece used by LLaMA and T5", () => {
    const { container } = render(TokenizerDeepDive(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("SentencePiece");
    expect(text).toContain("LLaMA");
    expect(text).toContain("raw");
  });

  it("sub=3 shows why tokenization matters with number splits and non-English costs", () => {
    const { container } = render(TokenizerDeepDive(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("12345");
    expect(text).toContain("token");
    expect(text).toContain("Hello");
  });

  it("sub=4 shows vocabulary size tradeoffs with real model numbers", () => {
    const { container } = render(TokenizerDeepDive(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("GPT-2");
    expect(text).toContain("LLaMA");
    expect(text).toContain("50,257");
    expect(text).toContain("32,000");
  });
});
