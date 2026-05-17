import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TransformerArrives from "../../../chapters/road-to-transformers/transformer-arrives.jsx";

afterEach(() => cleanup());

describe("TransformerArrives (4.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TransformerArrives(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(TransformerArrives(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(TransformerArrives(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(TransformerArrives(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(TransformerArrives(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub 0 references the 2017 attention paper", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(TransformerArrives(ctx));
    expect(container.textContent).toContain("2017");
    expect(container.textContent).toContain("Attention");
  });

  it("sub 1 shows RNN vs Transformer side-by-side", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(TransformerArrives(ctx));
    expect(container.textContent).toContain("RNN");
    expect(container.textContent).toContain("Transformer");
  });

  it("sub 3 shows speed comparison with concrete numbers", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(TransformerArrives(ctx));
    expect(container.textContent).toContain("1000");
  });

  it("shows SubBtn when sub < 4", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(TransformerArrives(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(TransformerArrives(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
