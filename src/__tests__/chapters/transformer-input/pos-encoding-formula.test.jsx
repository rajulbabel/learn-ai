import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingFormula from "../../../chapters/transformer-input/pos-encoding-formula.jsx";

afterEach(() => cleanup());

describe("PosEncodingFormula (5.4)", () => {
  for (let s = 0; s <= 2; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingFormula(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows the sin/cos formula", () => {
    const { container } = render(PosEncodingFormula(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("sin");
    expect(text).toContain("cos");
    expect(text).toContain("10000");
  });

  it("sub 1 explains the formula terms", () => {
    const { container } = render(PosEncodingFormula(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("pos");
    expect(text).toContain("d_model");
  });

  it("sub 2 explains fast vs slow wave insight", () => {
    const { container } = render(PosEncodingFormula(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("fast");
    expect(text).toContain("slow");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingFormula(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=2", () => {
    const { container } = render(PosEncodingFormula(makeCtx({ sub: 2 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
