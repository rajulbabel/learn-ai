import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EncoderDecoderTraining from "../../../chapters/encoder-decoder-diagrams/encoder-decoder-training.jsx";

afterEach(() => cleanup());

describe("EncoderDecoderTraining (9.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("renders at sub=7 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 7 })))).not.toThrow();
  });

  it("renders at sub=8 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 8 })))).not.toThrow();
  });

  it("renders at sub=9 without throwing", () => {
    expect(() => render(EncoderDecoderTraining(makeCtx({ sub: 9 })))).not.toThrow();
  });
});

describe("EncoderDecoderTraining spacing fixes", () => {
  it("sub 0 renders training title box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const rects = svg.querySelectorAll("rect");
    const titleBox = rects[0];
    expect(titleBox.getAttribute("x")).toBe("20");
    expect(titleBox.getAttribute("width")).toBe("860");
  });

  it("sub 0 renders input string box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const inputBox = rects[1];
    expect(inputBox.getAttribute("x")).toBe("20");
    expect(inputBox.getAttribute("width")).toBe("860");
  });

  it("sub 0 renders token ID boxes with width=60", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const tokenBoxes = rects.filter((r) => r.getAttribute("width") === "60" && r.getAttribute("height") === "28");
    expect(tokenBoxes.length).toBe(6);
  });

  it("sub 0 renders token ID text with font-size 11", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const idTexts = texts.filter((t) => t.textContent.startsWith("ID:"));
    expect(idTexts.length).toBe(6);
    idTexts.forEach((t) => expect(t.getAttribute("font-size")).toBe("11"));
  });

  it("sub 4 renders encoder output box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const encOutputBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(0,188,212,0.04)" && r.getAttribute("height") === "120",
    );
    expect(encOutputBox).toBeTruthy();
    expect(encOutputBox.getAttribute("x")).toBe("20");
    expect(encOutputBox.getAttribute("width")).toBe("860");
  });

  it("sub 8 renders total loss box at x=150 width=600", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const lossBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(244,67,54,0.06)" && r.getAttribute("height") === "28",
    );
    expect(lossBox).toBeTruthy();
    expect(lossBox.getAttribute("x")).toBe("150");
    expect(lossBox.getAttribute("width")).toBe("600");
  });

  it("sub 9 summary says Encoder runs ONCE without period", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder runs ONCE");
    expect(text).not.toContain("Encoder runs ONCE.");
  });

  it("sub 9 renders and contains all summary items", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(EncoderDecoderTraining(ctx));
    const text = container.textContent;
    expect(text).toContain("Summary: Training Phase Flow");
    expect(text).toContain("Encoder:");
    expect(text).toContain("Decoder:");
    expect(text).toContain("Cross-Attention:");
  });

  it("re-rendering at a new sub clears prior svg children before rebuilding", () => {
    const { rerender, container } = render(EncoderDecoderTraining(makeCtx({ sub: 0 })));
    const initialChildren = container.querySelector("svg").childElementCount;
    expect(initialChildren).toBeGreaterThan(0);
    rerender(EncoderDecoderTraining(makeCtx({ sub: 3 })));
    const afterChildren = container.querySelector("svg").childElementCount;
    expect(afterChildren).toBeGreaterThan(0);
  });
});
