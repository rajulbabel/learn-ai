import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BackpropRealNetwork from "../../../chapters/neural-foundations/backprop-real-network.jsx";

afterEach(() => cleanup());

describe("BackpropRealNetwork (1.13)", () => {
  for (let s = 0; s <= 8; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(BackpropRealNetwork(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the network from chapter 1.7 and the prediction error", () => {
    const { container } = render(BackpropRealNetwork(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Wrong");
    expect(container.textContent).toContain("807");
  });

  it("shows SubBtn when sub < 8", () => {
    const { container } = render(BackpropRealNetwork(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=8", () => {
    const { container } = render(BackpropRealNetwork(makeCtx({ sub: 8 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
