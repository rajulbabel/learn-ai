import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DotProduct from "../../../chapters/attention-qkv/dot-product.jsx";

afterEach(() => cleanup());

describe("DotProduct (6.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DotProduct(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(DotProduct(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(DotProduct(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(DotProduct(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=0 shows the problem header", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Here's the problem");
  });

  it("sub=0 shows dot product description", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("dot product");
  });

  it("sub=1 shows the vectors A and B", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("A = [1, 2, 3]");
    expect(container.textContent).toContain("B = [4, 5, 6]");
  });

  it("sub=1 shows the result 32", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("32");
  });

  it("sub=2 shows direction comparison", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("similar");
  });

  it("sub=3 shows can't dot product raw words", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("can't just dot product");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 3", () => {
    const { container } = render(DotProduct(makeCtx({ sub: 3 })));
    expect(container.querySelector("button")).toBeNull();
  });

  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h} renders without throwing`, () => {
      expect(() => render(DotProduct(makeCtx({ sub: 3, hovered: h })))).not.toThrow();
    });
  }
});
