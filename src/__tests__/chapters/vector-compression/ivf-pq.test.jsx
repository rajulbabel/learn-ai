import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import IVFPQ from "../../../chapters/vector-compression/ivf-pq.jsx";

afterEach(() => cleanup());

describe("IVFPQ (11.17)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(IVFPQ(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 recaps IVF clustering and PQ compression", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/cluster/i);
    expect(container.textContent).toMatch(/subvector|m bytes/i);
  });

  it("sub=1 runs IVF k-means first", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/k-means/i);
    expect(container.textContent).toMatch(/nlist/i);
    expect(container.textContent).toMatch(/centroid/i);
  });

  it("sub=1 cluster labels (C_A, C_B, C_C) clear all doc circles vertically", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const labels = texts.filter((t) => /^C_[ABC] \(/.test(t.textContent || ""));
    expect(labels.length, "expected three centroid labels (C_A, C_B, C_C)").toBe(3);
    const fontHalfHeight = 7;
    const docR = 8;
    const minClearance = 6;
    const clusterTop = { A: 75, B: 80, C: 245 };
    for (const label of labels) {
      const tag = label.textContent.match(/^(C_[ABC])/)[1];
      const cluster = tag.slice(2);
      const labelY = parseFloat(label.getAttribute("y"));
      const labelBottom = labelY + fontHalfHeight;
      const docTopEdge = clusterTop[cluster] - docR;
      expect(
        labelBottom,
        `${tag} label bottom (${labelBottom}) must be at least ${minClearance}px above the topmost doc circle edge (${docTopEdge})`,
      ).toBeLessThanOrEqual(docTopEdge - minClearance);
    }
  });

  it("sub=1 footer text sits clear of every cluster halo", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const footer = Array.from(svg.querySelectorAll("text")).find((t) =>
      /nlist = 3 centroids/.test(t.textContent || ""),
    );
    expect(footer, "expected the nlist footer text").toBeTruthy();
    const fy = parseFloat(footer.getAttribute("y"));
    const halos = Array.from(svg.querySelectorAll("circle")).filter((c) => parseFloat(c.getAttribute("r")) >= 30);
    expect(halos.length, "expected three cluster halo circles").toBe(3);
    for (const halo of halos) {
      const cy = parseFloat(halo.getAttribute("cy"));
      const r = parseFloat(halo.getAttribute("r"));
      expect(
        fy,
        `footer y (${fy}) must sit below halo bottom edge (cy=${cy}, r=${r}, bottom=${cy + r})`,
      ).toBeGreaterThan(cy + r);
    }
  });

  it("sub=2 computes residual = vector - centroid", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/residual/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/tighter|smaller/i);
  });

  it("sub=3 PQ-encodes the residuals with higher recall", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/residual/i);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|codebook/i);
  });

  it("sub=4 describes search: probe nprobe cells, scan codes", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/lookup|table|scan/i);
  });

  it("sub=4 query arrow ends outside cluster A halo so it doesn't pierce any doc", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 4 })));
    const lines = Array.from(container.querySelectorAll("line"));
    const arrow = lines.find((l) => l.getAttribute("x1") === "55" && l.getAttribute("y1") === "55");
    expect(arrow, "expected query-to-centroid arrow originating at (55, 55)").toBeTruthy();
    const x2 = parseFloat(arrow.getAttribute("x2"));
    const y2 = parseFloat(arrow.getAttribute("y2"));
    const cAx = 130;
    const cAy = 100;
    const haloR = 60;
    const dist = Math.hypot(cAx - x2, cAy - y2);
    expect(
      dist,
      `arrow endpoint distance from C_A (${dist.toFixed(1)}) must exceed halo r=${haloR} so it never crosses an interior doc`,
    ).toBeGreaterThan(haloR);
  });

  it("sub=5 hits 20 bytes per vector with FAISS IndexIVFPQ", () => {
    const { container } = render(IVFPQ(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/20 bytes|20 GB/);
    expect(container.textContent).toMatch(/1B|1 billion/i);
    expect(container.textContent).toMatch(/FAISS|Milvus/);
  });
});
