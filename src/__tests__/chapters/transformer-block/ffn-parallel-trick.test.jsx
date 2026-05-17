import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FFNParallelTrick from "../../../chapters/transformer-block/ffn-parallel-trick.jsx";

afterEach(() => cleanup());

describe("FFNParallelTrick (8.4)", () => {
  for (let s = 0; s <= 5; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(FFNParallelTrick(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 recaps single-word FFN with one vector times W", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toContain("one word");
    expect(text).toMatch(/1\s*x\s*3|1x3/i);
    expect(text).toMatch(/3\s*x\s*6|3x6/i);
  });

  it("sub 1 shows stacking multiple words into a matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toContain("stack");
    expect(text).toMatch(/3\s*x\s*3|3x3/i);
    expect(text).toContain("same W1");
  });

  it("sub 2 shows 6 words with same weight matrix", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toContain("6");
    expect(text).toContain("18");
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
  });

  it("sub 3 shows 10 words to prove weight count independence", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toContain("10");
    expect(text).toContain("18");
    expect(text).toMatch(/10\s*x\s*3|10x3/i);
  });

  it("sub 4 shows W2 scaling back down with inverse shape", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
    expect(text).toContain("compress");
  });

  it("sub 5 explains GPU parallelism and free variable", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(FFNParallelTrick(ctx));
    const text = container.textContent;
    expect(text).toContain("GPU");
    expect(text).toContain("parallel");
  });
});
