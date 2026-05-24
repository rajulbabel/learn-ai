import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingFinal from "../../../chapters/transformer-input/pos-encoding-final.jsx";

afterEach(() => cleanup());

describe("PosEncodingFinal (5.7)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingFinal(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows addition of embedding + positional encoding for 'love'", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Embedding");
    expect(text).toContain("Pos Enc");
    expect(text).toContain("Final Vector");
  });

  it("sub 0 shows concrete vector values", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("0.56");
    expect(text).toContain("0.841");
  });

  it("sub 1 explains vector carries meaning and position", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Meaning");
    expect(text).toContain("Position");
  });

  it("sub 2 explains 4 design reasons", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Bounded");
    expect(text).toContain("Unique");
    expect(text).toContain("Generalizes");
  });

  it("sub 3 concludes that vectors are ready for attention", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("attention");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(PosEncodingFinal(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
