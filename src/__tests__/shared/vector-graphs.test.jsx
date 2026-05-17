import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Triangle,
  IVFScatter,
  HNSWLayeredGraph,
  fmtVec,
  docCluster,
  computeFlatEdges,
  IVF_CLUSTERS,
  HNSW_CORPUS_XY,
  FLAT_GRAPH_EDGES,
  HNSW_LAYER_1,
  HNSW_LAYER_2,
} from "../../shared/vector-graphs.jsx";

describe("vector-graphs", () => {
  it("fmtVec formats a vector with two decimals", () => {
    expect(fmtVec([0.123, 0.456])).toBe("[0.12, 0.46]");
    expect(fmtVec([1, 0])).toBe("[1.00, 0.00]");
  });

  it("computeFlatEdges returns an array of pairs", () => {
    const xy = {
      1: { x: 0, y: 0 },
      2: { x: 10, y: 0 },
      3: { x: 5, y: 10 },
      4: { x: 100, y: 100 },
    };
    const edges = computeFlatEdges(xy);
    expect(Array.isArray(edges)).toBe(true);
    expect(edges.length).toBeGreaterThan(0);
    expect(edges[0]).toHaveLength(2);
    edges.forEach(([a, b]) => {
      expect(typeof a).toBe("number");
      expect(typeof b).toBe("number");
      expect(a).toBeLessThan(b);
    });
  });

  it("IVF_CLUSTERS exposes the three expected clusters", () => {
    expect(IVF_CLUSTERS).toHaveLength(3);
    expect(IVF_CLUSTERS.map((c) => c.id)).toEqual(["A", "B", "C"]);
    expect(IVF_CLUSTERS[0].docs).toContain(1);
  });

  it("docCluster locates a doc id within a cluster", () => {
    const cl = docCluster(1);
    expect(cl).toBeDefined();
    expect(cl.docs).toContain(1);
    expect(docCluster(999)).toBeUndefined();
  });

  it("HNSW_CORPUS_XY has all 10 docs", () => {
    expect(Object.keys(HNSW_CORPUS_XY)).toHaveLength(10);
    expect(HNSW_CORPUS_XY[1]).toHaveProperty("x");
    expect(HNSW_CORPUS_XY[1]).toHaveProperty("y");
  });

  it("FLAT_GRAPH_EDGES derives from HNSW_CORPUS_XY via computeFlatEdges", () => {
    expect(Array.isArray(FLAT_GRAPH_EDGES)).toBe(true);
    expect(FLAT_GRAPH_EDGES).toEqual(computeFlatEdges(HNSW_CORPUS_XY));
  });

  it("HNSW_LAYER_1 and HNSW_LAYER_2 contain hub ids that exist in HNSW_CORPUS_XY", () => {
    expect(Array.isArray(HNSW_LAYER_1)).toBe(true);
    expect(Array.isArray(HNSW_LAYER_2)).toBe(true);
    HNSW_LAYER_1.forEach((id) => expect(HNSW_CORPUS_XY[id]).toBeDefined());
    HNSW_LAYER_2.forEach((id) => expect(HNSW_CORPUS_XY[id]).toBeDefined());
  });

  it("Triangle renders an SVG with a desc element", () => {
    const { container } = render(<Triangle />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.querySelector("desc")).not.toBeNull();
  });

  it("Triangle renders annotations when provided", () => {
    const { container } = render(
      <Triangle annotations={[{ x: 100, y: 100, color: "#fff", label: "TestLabel" }]} />,
    );
    expect(container.textContent).toContain("TestLabel");
  });

  it("IVFScatter renders an SVG (bare variant)", () => {
    const { container } = render(<IVFScatter variant="bare" desc="bare scatter" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.querySelector("desc").textContent).toBe("bare scatter");
  });

  it("IVFScatter renders cluster variants", () => {
    for (const variant of ["clustered", "cells", "probe"]) {
      const { container } = render(<IVFScatter variant={variant} desc={`${variant} scatter`} />);
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });

  it("HNSWLayeredGraph renders an SVG for every mode", () => {
    for (const mode of ["flat", "slowGreedy", "hubLayer", "twoLayers"]) {
      const { container } = render(<HNSWLayeredGraph mode={mode} desc={`${mode} graph`} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg.querySelector("desc").textContent).toBe(`${mode} graph`);
    }
  });
});
