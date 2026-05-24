import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingHeatmap from "../../../chapters/transformer-input/pos-encoding-heatmap.jsx";

afterEach(() => cleanup());

describe("PosEncodingHeatmap (5.8)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingHeatmap(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 renders the full heatmap SVG", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 0 })));
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("sub 0 shows checkerboard and stripe pattern description", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("heatmap");
    expect(text).toContain("checkerboard");
  });

  it("sub 1 explains why left side flips fast", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("fast");
    expect(text).toContain("frequency");
  });

  it("sub 2 explains why right side barely changes", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("barely");
  });

  it("sub 3 shows position strips as unique fingerprints", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("fingerprint");
  });

  it("sub 4 shows binary counting analogy with BinaryGrid SVG", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("binary");
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(1);
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(PosEncodingHeatmap(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
