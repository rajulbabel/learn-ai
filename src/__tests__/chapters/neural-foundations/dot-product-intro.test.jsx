import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DotProductIntro from "../../../chapters/neural-foundations/dot-product-intro.jsx";

afterEach(() => cleanup());

describe("DotProductIntro (1.17)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(DotProductIntro(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 introduces how to compare vectors", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(DotProductIntro(ctx));
    const text = container.textContent;
    expect(text).toContain("compare");
  });

  it("sub 1 shows step-by-step dot product computation", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(DotProductIntro(ctx));
    const text = container.textContent;
    expect(text).toContain("Multiply");
    expect(text).toContain("Add");
  });

  it("sub 2 explains what the result number means - similarity", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(DotProductIntro(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });

  it("sub 3 connects to word vectors and attention", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(DotProductIntro(ctx));
    const text = container.textContent;
    expect(text).toContain("neuron");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(DotProductIntro(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(DotProductIntro(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
