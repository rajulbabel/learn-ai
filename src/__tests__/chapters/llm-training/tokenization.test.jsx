import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Tokenization from "../../../chapters/llm-training/tokenization.jsx";

afterEach(() => cleanup());

describe("Tokenization (2.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Tokenization(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 explains tokenization intro", () => {
    const { container } = render(Tokenization(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Tokenization");
    expect(text).toContain("numbers");
  });

  it("sub=1 shows three tokenization strategies", () => {
    const { container } = render(Tokenization(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Character-level");
    expect(text).toContain("Word-level");
    expect(text).toContain("Sub-word");
  });

  it("sub=2 shows BPE byte-pair encoding steps", () => {
    const { container } = render(Tokenization(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("BPE");
    expect(text).toContain("Byte-Pair");
    expect(text).toContain("Step 0");
    expect(text).toContain("Step 1");
    expect(text).toContain("Step 2");
  });

  it("sub=3 shows real GPT tokenizer example with token IDs", () => {
    const { container } = render(Tokenization(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("GPT");
    expect(text).toContain("464");
    expect(text).toContain("3797");
  });

  it("sub=3 no longer shows SubBtn", () => {
    const { container } = render(Tokenization(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).not.toContain("Continue");
  });
});
