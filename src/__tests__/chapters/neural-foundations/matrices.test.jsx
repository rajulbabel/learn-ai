import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Matrices from "../../../chapters/neural-foundations/matrices.jsx";

afterEach(() => cleanup());

describe("Matrices (1.18)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(Matrices(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 introduces what a matrix is - a grid of numbers", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(Matrices(ctx));
    const text = container.textContent;
    expect(text).toContain("grid");
  });

  it("sub 1 shows matrix-vector multiplication step by step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(Matrices(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("dot product");
  });

  it("sub 2 shows a concrete computation with real numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(Matrices(ctx));
    const text = container.textContent;
    expect(text).toMatch(/\d/);
  });

  it("sub 3 connects matrices to neural network weights", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(Matrices(ctx));
    const text = container.textContent;
    expect(text).toContain("weight");
    expect(text).toContain("transform");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(Matrices(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(Matrices(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
