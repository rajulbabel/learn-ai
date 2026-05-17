import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RNNFlaws from "../../../chapters/road-to-transformers/rnn-flaws.jsx";

afterEach(() => cleanup());

describe("RNNFlaws (4.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RNNFlaws(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RNNFlaws(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RNNFlaws(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RNNFlaws(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RNNFlaws(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub 0 introduces vanishing gradient flaw", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.textContent).toContain("Vanishing");
    expect(container.textContent).toContain("gradient");
  });

  it("sub 1 shows the gradient math", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.textContent).toContain("0.21");
  });

  it("sub 2 introduces the slowness flaw", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.textContent).toContain("SLOW");
  });

  it("sub 3 explains LSTM partial solution", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.textContent).toContain("LSTM");
  });

  it("shows SubBtn when sub < 4", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(RNNFlaws(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
