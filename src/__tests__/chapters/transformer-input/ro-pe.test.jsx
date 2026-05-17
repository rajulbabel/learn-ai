import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RoPE from "../../../chapters/transformer-input/ro-pe.jsx";

afterEach(() => cleanup());

describe("RoPE (5.9)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(RoPE(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains problems with sinusoidal encoding", () => {
    const { container } = render(RoPE(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("problem");
    expect(text).toContain("sinusoidal");
  });

  it("sub 0 mentions absolute positioning and fixed length problems", () => {
    const { container } = render(RoPE(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Absolute");
    expect(text).toContain("Fixed length");
  });

  it("sub 1 shows the clock hand rotation metaphor", () => {
    const { container } = render(RoPE(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("clock");
    expect(text).toContain("turn");
  });

  it("sub 1 shows rotation clock SVG", () => {
    const { container } = render(RoPE(makeCtx({ sub: 1 })));
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("sub 2 explains only the gap between Q and K matters", () => {
    const { container } = render(RoPE(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("gap");
    expect(text).toContain("relative");
  });

  it("sub 2 shows two-scenario clocks SVG", () => {
    const { container } = render(RoPE(makeCtx({ sub: 2 })));
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(1);
  });

  it("sub 3 explains how it works with 128 dims in pairs", () => {
    const { container } = render(RoPE(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("pairs");
    expect(text).toContain("128");
  });

  it("sub 4 shows comparison table of position encoding methods", () => {
    const { container } = render(RoPE(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("Sinusoidal");
    expect(text).toContain("RoPE");
    expect(text).toContain("LLaMA");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(RoPE(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(RoPE(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
