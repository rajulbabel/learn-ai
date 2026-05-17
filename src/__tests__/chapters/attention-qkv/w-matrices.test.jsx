import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WMatrices from "../../../chapters/attention-qkv/w-matrices.jsx";

afterEach(() => cleanup());

describe("WMatrices (6.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(WMatrices(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows where did numbers come from question", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Where did those numbers");
  });

  it("sub=0 shows learned answer", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("learned");
  });

  it("sub=0 shows W_Q, W_K, W_V question marks", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("W_Q");
    expect(container.textContent).toContain("W_K");
    expect(container.textContent).toContain("W_V");
  });

  it("sub=1 shows random garbage day 1", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("random garbage");
  });

  it("sub=1 shows random grid values", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("0.47");
  });

  it("sub=2 shows training loop", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("training loop");
  });

  it("sub=2 shows predict fail nudge cycle", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("predict");
    expect(container.textContent).toContain("elephant");
  });

  it("sub=3 shows zoom into one nudge", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("nudge");
  });

  it("sub=3 shows before and after grid values", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("-0.09");
    expect(container.textContent).toContain("-0.07");
  });

  it("sub=4 shows after training grids settled", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("grids have settled");
  });

  it("sub=4 shows before and after comparison", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("BEFORE");
    expect(container.textContent).toContain("AFTER");
  });

  it("sub=5 shows key insight", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 5 })));
    expect(container.textContent).toContain("key insight");
  });

  it("sub=5 shows nobody programmed these numbers", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 5 })));
    expect(container.textContent).toContain("Nobody programmed");
  });

  it("shows SubBtn when sub < 5", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 5", () => {
    const { container } = render(WMatrices(makeCtx({ sub: 5 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
