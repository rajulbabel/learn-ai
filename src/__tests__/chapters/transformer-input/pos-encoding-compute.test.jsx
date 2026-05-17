import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingCompute from "../../../chapters/transformer-input/pos-encoding-compute.jsx";

afterEach(() => cleanup());

describe("PosEncodingCompute (5.5)", () => {
  for (let s = 0; s <= 2; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingCompute(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows computed position values grid with I love cats", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("I");
    expect(text).toContain("love");
    expect(text).toContain("cats");
    expect(text).toContain("0.000");
  });

  it("sub 0 uses 8 dimensions labeled sin/cos", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("sin");
    expect(text).toContain("cos");
  });

  it("sub 1 explains yellow values mean big change", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Yellow");
    expect(text).toContain("change");
  });

  it("sub 2 shows position 0 is all zeros and ones", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Position 0");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=2", () => {
    const { container } = render(PosEncodingCompute(makeCtx({ sub: 2 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
