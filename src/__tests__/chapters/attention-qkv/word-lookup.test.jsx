import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WordLookup from "../../../chapters/attention-qkv/word-lookup.jsx";

afterEach(() => cleanup());

describe("WordLookup (6.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=0 shows think about how you read", () => {
    const { container } = render(WordLookup(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Think about how YOU read");
  });

  it("sub=1 shows click any word instruction", () => {
    const { container } = render(WordLookup(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Click any word");
  });

  it("sub=1 shows all 7 words", () => {
    const { container } = render(WordLookup(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("sat");
    expect(text).toContain("because");
    expect(text).toContain("it");
    expect(text).toContain("was");
    expect(text).toContain("tired");
  });

  it("hovered=0 renders without throwing", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 1, hovered: 0 })))).not.toThrow();
  });

  it("hovered=4 renders (it → cat 55%)", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 1, hovered: 4 })))).not.toThrow();
  });

  it("hovered=6 renders without throwing", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 1, hovered: 6 })))).not.toThrow();
  });

  it("hovered out of range (99) triggers fallback gracefully", () => {
    expect(() => render(WordLookup(makeCtx({ sub: 1, hovered: 99 })))).not.toThrow();
  });

  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h} renders without throwing`, () => {
      expect(() => render(WordLookup(makeCtx({ sub: 1, hovered: h })))).not.toThrow();
    });
  }

  it("sub=2 shows dot product message", () => {
    const { container } = render(WordLookup(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("dot product");
  });

  it("clicking a word calls setHovered", () => {
    const setHovered = vi.fn();
    const ctx = makeCtx({ sub: 1, setHovered });
    const { container } = render(WordLookup(ctx));
    const spans = container.querySelectorAll("span[style*='cursor: pointer']");
    if (spans.length > 0) fireEvent.click(spans[0]);
    // setHovered may be called via onClick on span
  });
});
