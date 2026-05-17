import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WeightInit from "../../../chapters/neural-foundations/weight-init.jsx";

afterEach(() => cleanup());

describe("WeightInit (1.26)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WeightInit(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows why not start at zero - symmetry problem", () => {
    const { container } = render(WeightInit(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Zero");
    expect(text).toContain("identical");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(WeightInit(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(WeightInit(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
