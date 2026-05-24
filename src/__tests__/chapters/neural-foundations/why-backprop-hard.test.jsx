import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyBackpropHard from "../../../chapters/neural-foundations/why-backprop-hard.jsx";

afterEach(() => cleanup());

describe("WhyBackpropHard (1.15)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhyBackpropHard(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the 2-layer network was the easy case", () => {
    const { container } = render(WhyBackpropHard(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Easy Case");
    expect(container.textContent).toContain("layers");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(WhyBackpropHard(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(WhyBackpropHard(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
