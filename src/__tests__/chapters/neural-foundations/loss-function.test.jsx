import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LossFunction from "../../../chapters/neural-foundations/loss-function.jsx";

afterEach(() => cleanup());

describe("LossFunction (1.8)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(LossFunction(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the loss formula (actual - predicted)^2", () => {
    const { container } = render(LossFunction(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Loss");
    expect(container.textContent).toContain("predicted");
    expect(container.textContent).toContain("actual");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(LossFunction(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(LossFunction(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
