import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EncoderDecoder from "../../../chapters/road-to-transformers/encoder-decoder.jsx";

afterEach(() => cleanup());

describe("EncoderDecoder (8.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EncoderDecoder(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(EncoderDecoder(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(EncoderDecoder(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(EncoderDecoder(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(EncoderDecoder(makeCtx({ sub: 4 })))).not.toThrow();
  });
});

describe("EncoderDecoder sub-steps", () => {
  it("sub 0 introduces the translation problem", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoder(ctx));
    const text = container.textContent;
    expect(text).toContain("translat");
  });

  it("sub 1 explains encoder reads and decoder writes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(EncoderDecoder(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder");
    expect(text).toContain("Decoder");
  });

  it("sub 2 shows cross-attention connection between encoder and decoder", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(EncoderDecoder(ctx));
    const text = container.textContent;
    expect(text).toContain("cross");
  });

  it("sub 3 references the 2017 paper architecture", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(EncoderDecoder(ctx));
    const text = container.textContent;
    expect(text).toContain("2017");
  });

  it("shows SubBtn when sub < 4", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(EncoderDecoder(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(EncoderDecoder(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
