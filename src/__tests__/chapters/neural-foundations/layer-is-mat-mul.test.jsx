import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LayerIsMatMul from "../../../chapters/neural-foundations/layer-is-mat-mul.jsx";

afterEach(() => cleanup());

describe("LayerIsMatMul (1.19)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(LayerIsMatMul(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 recalls single neuron from chapter 1.4", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(LayerIsMatMul(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
  });

  it("sub 1 shows multiple neurons side by side", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(LayerIsMatMul(ctx));
    const text = container.textContent;
    expect(text).toContain("neuron");
    expect(text).toContain("weights");
  });

  it("sub 2 reveals that multiple neurons = matrix multiplication", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(LayerIsMatMul(ctx));
    const text = container.textContent;
    expect(text).toContain("matrix");
  });

  it("sub 3 shows the visual: one neuron = one row of the weight matrix", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(LayerIsMatMul(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("layer");
  });

  it("sub 3 scales up to real Transformer dimensions", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(LayerIsMatMul(ctx));
    const text = container.textContent;
    expect(text).toContain("heartbeat");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(LayerIsMatMul(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(LayerIsMatMul(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
