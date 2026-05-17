import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CrossAttention from "../../../chapters/attention-computation/cross-attention.jsx";

afterEach(() => cleanup());

describe("CrossAttention (9.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CrossAttention(makeCtx({ sub: 0 })))).not.toThrow();
  });
});

describe("CrossAttention sub-steps", () => {
  it("sub 0 shows the setup - encoder output meets decoder", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toContain("encoder");
    expect(text).toContain("decoder");
  });

  it("sub 1 shows Q from decoder, K and V from encoder", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("decoder");
    expect(text).toContain("encoder");
  });

  it("sub 2 traces a concrete translation example with scores (Hindi target)", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toContain("softmax");
    expect(text).toContain("billiyaan");
    expect(text).not.toContain("chats");
    expect(text).not.toContain("aime");
  });

  it("sub 3 compares self-attention vs cross-attention side by side", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toMatch(/self.attention/i);
    expect(text).toMatch(/cross.attention/i);
    expect(text).toContain("same sentence");
  });

  it("sub 4 shows misconception vs reality - encoder runs once", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toMatch(/encoder.*once/i);
    expect(text).toContain("WRONG");
    expect(text).toContain("CORRECT");
    expect(text).toContain("K, V");
  });

  it("sub 5 shows complete data flow SVG with dimensions", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toContain("Complete data flow");
    expect(text).toContain("d_model = 512");
  });

  it("sub 6 shows layer-by-layer math and dimension walkthrough", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toContain("each decoder layer");
    expect(text).toContain("Dimension walkthrough");
    expect(text).toContain("[3 x 64]");
  });

  it("sub 7 shows where cross-attention appears in the architecture", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(CrossAttention(ctx));
    const text = container.textContent;
    expect(text).toMatch(/[Dd]ecoder-[Oo]nly/);
    expect(text).toMatch(/[Ee]ncoder-[Dd]ecoder/);
  });
});
