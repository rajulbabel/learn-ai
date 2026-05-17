import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RNN from "../../../chapters/road-to-transformers/rnn.jsx";

afterEach(() => cleanup());

describe("RNN (4.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RNN(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RNN(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RNN(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RNN(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RNN(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub 0 introduces RNNs with the formula", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(RNN(ctx));
    expect(container.textContent).toContain("Recurrent");
    expect(container.textContent).toContain("tanh");
  });

  it("sub 1 traces The cat sat step by step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(RNN(ctx));
    expect(container.textContent).toContain("The");
    expect(container.textContent).toContain("cat");
    expect(container.textContent).toContain("sat");
  });

  it("sub 4 explains sequential processing limitation", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(RNN(ctx));
    expect(container.textContent).toContain("sequential");
  });

  it("shows SubBtn when sub < 4", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(RNN(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(RNN(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
