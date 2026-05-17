import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LRWarmupDecay from "../../../chapters/neural-foundations/lr-warmup-decay.jsx";

afterEach(() => cleanup());

describe("LRWarmupDecay (1.25)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(LRWarmupDecay(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 explains why a constant learning rate fails", () => {
    const { container } = render(LRWarmupDecay(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Constant Learning Rate Fails");
    expect(text).toContain("diverge");
  });

  it("renders Graph component at sub=1 (uses Graph import)", () => {
    const { container } = render(LRWarmupDecay(makeCtx({ sub: 1 })));
    // Graph renders an SVG
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(LRWarmupDecay(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(LRWarmupDecay(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
