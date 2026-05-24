import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GradientsInAction from "../../../chapters/neural-foundations/gradients-in-action.jsx";

afterEach(() => cleanup());

describe("GradientsInAction (1.14)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(GradientsInAction(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows we have gradients and apply gradient descent formula", () => {
    const { container } = render(GradientsInAction(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Gradients");
    expect(container.textContent).toContain("new_weight");
  });

  it("sub=1 shows updating every weight at once", () => {
    const { container } = render(GradientsInAction(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Updating Every Weight");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(GradientsInAction(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(GradientsInAction(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
