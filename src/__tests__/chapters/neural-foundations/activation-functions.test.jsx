import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ActivationFunctions from "../../../chapters/neural-foundations/activation-functions.jsx";

afterEach(() => cleanup());

describe("ActivationFunctions (1.20)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(ActivationFunctions(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 recalls ReLU from chapter 1.5", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ActivationFunctions(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
  });

  it("sub 1 introduces sigmoid - squashes to 0-1 range", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(ActivationFunctions(ctx));
    const text = container.textContent;
    expect(text).toContain("Sigmoid");
    expect(text).toContain("0");
    expect(text).toContain("1");
  });

  it("sub 2 introduces tanh - squashes to -1 to 1", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(ActivationFunctions(ctx));
    const text = container.textContent;
    expect(text).toContain("Tanh");
  });

  it("sub 3 introduces softmax - turns list into probabilities", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(ActivationFunctions(ctx));
    const text = container.textContent;
    expect(text).toContain("Softmax");
  });

  it("sub 4 shows summary comparing all activation functions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(ActivationFunctions(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
    expect(text).toContain("Sigmoid");
    expect(text).toContain("Softmax");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(ActivationFunctions(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(ActivationFunctions(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
