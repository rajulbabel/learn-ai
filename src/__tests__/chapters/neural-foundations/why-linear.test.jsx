import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyLinear from "../../../chapters/neural-foundations/why-linear.jsx";

afterEach(() => cleanup());

describe("WhyLinear (1.5)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhyLinear(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows y = mx + b and lines can only do so much", () => {
    const { container } = render(WhyLinear(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("y = mx + b");
    expect(container.textContent).toContain("Lines Can Only Do So Much");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(WhyLinear(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(WhyLinear(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
