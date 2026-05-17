import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EncoderDecoderInference from "../../../chapters/encoder-decoder-diagrams/encoder-decoder-inference.jsx";

afterEach(() => cleanup());

describe("EncoderDecoderInference (9.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("renders at sub=7 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 7 })))).not.toThrow();
  });

  it("renders at sub=8 without throwing", () => {
    expect(() => render(EncoderDecoderInference(makeCtx({ sub: 8 })))).not.toThrow();
  });
});

describe("EncoderDecoderInference spacing fixes", () => {
  it("sub 0 renders inference title box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoderInference(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const rects = svg.querySelectorAll("rect");
    const titleBox = rects[0];
    expect(titleBox.getAttribute("x")).toBe("20");
    expect(titleBox.getAttribute("width")).toBe("860");
  });

  it("sub 2 renders decoder setup box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(EncoderDecoderInference(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const decoderBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(156,120,255,0.04)" && r.getAttribute("height") === "86",
    );
    expect(decoderBox).toBeTruthy();
    expect(decoderBox.getAttribute("x")).toBe("20");
    expect(decoderBox.getAttribute("width")).toBe("860");
  });

  it("sub 5 renders encoder K,V box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(EncoderDecoderInference(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const kvBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(0,188,212,0.03)" && r.getAttribute("height") === "110",
    );
    expect(kvBox).toBeTruthy();
    expect(kvBox.getAttribute("x")).toBe("20");
    expect(kvBox.getAttribute("width")).toBe("860");
  });

  it("sub 8 renders and contains memory cost info", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(EncoderDecoderInference(ctx));
    const text = container.textContent;
    expect(text).toContain("KV Cache: Memory vs Speed Tradeoff");
    expect(text).toContain("What Happens Next");
  });
});
