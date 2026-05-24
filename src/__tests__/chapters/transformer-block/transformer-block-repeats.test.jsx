import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TransformerBlockRepeats from "../../../chapters/transformer-block/transformer-block-repeats.jsx";

afterEach(() => cleanup());

describe("TransformerBlockRepeats (8.6)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(TransformerBlockRepeats(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains one block is not enough", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(TransformerBlockRepeats(ctx));
    const text = container.textContent;
    expect(text).toContain("one");
    expect(text).toContain("block");
    expect(text).toContain("repeat");
  });

  it("sub 1 shows the stack with real model sizes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(TransformerBlockRepeats(ctx));
    const text = container.textContent;
    expect(text).toContain("GPT-2");
    expect(text).toContain("12");
    expect(text).toContain("GPT-3");
    expect(text).toContain("96");
  });

  it("sub 2 explains same structure different weights per block", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(TransformerBlockRepeats(ctx));
    const text = container.textContent;
    expect(text).toContain("same structure");
    expect(text).toContain("different weights");
  });

  it("sub 3 shows what each layer learns - shallow to deep", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(TransformerBlockRepeats(ctx));
    const text = container.textContent;
    expect(text).toContain("grammar");
    expect(text).toContain("meaning");
  });

  it("sub 4 shows complete picture from tokens through N blocks to output", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(TransformerBlockRepeats(ctx));
    const text = container.textContent;
    expect(text).toContain("Token");
    expect(text).toContain("Block");
    expect(text).toContain("Output");
    expect(text).toContain("N");
  });
});
