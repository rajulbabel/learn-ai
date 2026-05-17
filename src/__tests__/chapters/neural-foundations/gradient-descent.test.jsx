import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GradientDescent from "../../../chapters/neural-foundations/gradient-descent.jsx";

afterEach(() => cleanup());

describe("GradientDescent (1.12)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(GradientDescent(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the weight update rule formula", () => {
    const { container } = render(GradientDescent(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("new_weight");
    expect(container.textContent).toContain("learning_rate");
    expect(container.textContent).toContain("gradient");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(GradientDescent(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(GradientDescent(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
