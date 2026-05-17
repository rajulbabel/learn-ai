import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WeightsBiases from "../../../chapters/neural-foundations/weights-biases.jsx";

afterEach(() => cleanup());

describe("WeightsBiases (1.4)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WeightsBiases(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows weight = how important is this input", () => {
    const { container } = render(WeightsBiases(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Weight");
    expect(container.textContent).toContain("important");
  });

  it("sub=1 shows bias as baseline shift", () => {
    const { container } = render(WeightsBiases(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Bias");
    expect(container.textContent).toContain("sqft");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(WeightsBiases(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(WeightsBiases(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
