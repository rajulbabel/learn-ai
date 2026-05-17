import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Derivatives from "../../../chapters/neural-foundations/derivatives.jsx";

afterEach(() => cleanup());

describe("Derivatives (1.10)", () => {
  // Cover all subs including beyond max to mirror sections.test.jsx Frac coverage
  for (let s = 0; s <= 7; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(Derivatives(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 introduces sensitivity question", () => {
    const { container } = render(Derivatives(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Sensitive");
  });

  it("sub=1 shows concrete example with weight and input", () => {
    const { container } = render(Derivatives(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("weight");
    expect(container.textContent).toContain("input");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(Derivatives(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(Derivatives(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
