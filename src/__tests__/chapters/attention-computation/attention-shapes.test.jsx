import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AttentionShapes from "../../../chapters/attention-computation/attention-shapes.jsx";

afterEach(() => cleanup());

describe("AttentionShapes (7.15)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AttentionShapes(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AttentionShapes(makeCtx({ sub: 1 })))).not.toThrow();
  });
});

describe("AttentionShapes Mat component", () => {
  const parseViewBox = (svg) => {
    const vb = svg.getAttribute("viewBox");
    if (!vb) return null;
    const [x, y, w, h] = vb.split(/\s+/).map(Number);
    return { x, y, w, h };
  };

  it("every Mat SVG has a viewBox centered on the rect", () => {
    // Render at the highest sub so all Mats are mounted
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(AttentionShapes(ctx));
    // Mats use <rect rx="4"> and <text> for labels; find all candidate svgs
    const svgs = container.querySelectorAll("svg");
    const matSvgs = Array.from(svgs).filter((s) => s.querySelector('rect[rx="4"]'));
    expect(matSvgs.length).toBeGreaterThan(0);

    matSvgs.forEach((svg, i) => {
      const rect = svg.querySelector('rect[rx="4"]');
      const rw = Number(rect.getAttribute("width"));
      const rh = Number(rect.getAttribute("height"));
      const rx = Number(rect.getAttribute("x") || 0);
      const ry = Number(rect.getAttribute("y") || 0);
      const rectCx = rx + rw / 2;
      const rectCy = ry + rh / 2;
      const vb = parseViewBox(svg);
      expect(vb, `Mat svg #${i} missing viewBox`).toBeTruthy();
      const vbCx = vb.x + vb.w / 2;
      const vbCy = vb.y + vb.h / 2;
      expect(vbCx, `Mat svg #${i} viewBox-center-x != rect-center-x`).toBeCloseTo(rectCx, 5);
      expect(vbCy, `Mat svg #${i} viewBox-center-y != rect-center-y`).toBeCloseTo(rectCy, 5);
    });
  });
});
