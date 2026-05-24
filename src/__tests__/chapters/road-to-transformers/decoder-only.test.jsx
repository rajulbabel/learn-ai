import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DecoderOnly from "../../../chapters/road-to-transformers/decoder-only.jsx";

afterEach(() => cleanup());

describe("DecoderOnly (9.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(DecoderOnly(makeCtx({ sub: 5 })))).not.toThrow();
  });
});

describe("DecoderOnly sub-steps", () => {
  it("sub 0 states GPT/Claude are decoder-only", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(DecoderOnly(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only");
  });

  it("sub 1 explains why no encoder is needed for text-to-text", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(DecoderOnly(ctx));
    const text = container.textContent;
    expect(text).toContain("continuous");
  });

  it("sub 2 shows visual comparison of architectures", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(DecoderOnly(ctx));
    const text = container.textContent;
    expect(text).toContain("masking");
  });

  it("sub 3 explains why decoder-only wins", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(DecoderOnly(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only wins");
  });

  it("shows SubBtn when sub < 5", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(DecoderOnly(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=5", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(DecoderOnly(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
