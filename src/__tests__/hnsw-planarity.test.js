import { describe, it, expect } from "vitest";
import { HNSW_CORPUS_XY, FLAT_GRAPH_EDGES } from "../sections/vector-foundations.jsx";

// Segment-segment intersection test that ignores shared endpoints.
function segmentsCross(a, b) {
  const eps = 0.01;
  const shares =
    (a.x1 === b.x1 && a.y1 === b.y1) ||
    (a.x1 === b.x2 && a.y1 === b.y2) ||
    (a.x2 === b.x1 && a.y2 === b.y1) ||
    (a.x2 === b.x2 && a.y2 === b.y2);
  if (shares) return false;
  const d1x = a.x2 - a.x1;
  const d1y = a.y2 - a.y1;
  const d2x = b.x2 - b.x1;
  const d2y = b.y2 - b.y1;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < eps) return false;
  const t = ((b.x1 - a.x1) * d2y - (b.y1 - a.y1) * d2x) / denom;
  const s = ((b.x1 - a.x1) * d1y - (b.y1 - a.y1) * d1x) / denom;
  return t > eps && t < 1 - eps && s > eps && s < 1 - eps;
}

describe("HNSW flat proximity graph planarity", () => {
  it("draws with zero edge crossings in 2D", () => {
    const segments = FLAT_GRAPH_EDGES.map(([a, b]) => ({
      x1: HNSW_CORPUS_XY[a].x,
      y1: HNSW_CORPUS_XY[a].y,
      x2: HNSW_CORPUS_XY[b].x,
      y2: HNSW_CORPUS_XY[b].y,
    }));
    const crossings = [];
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        if (segmentsCross(segments[i], segments[j])) {
          crossings.push([FLAT_GRAPH_EDGES[i], FLAT_GRAPH_EDGES[j]]);
        }
      }
    }
    expect(crossings).toEqual([]);
  });

  it("FLAT_GRAPH_EDGES is the symmetric union of each node's 3 nearest neighbors", () => {
    const ids = Object.keys(HNSW_CORPUS_XY).map(Number);
    const expected = new Set();
    for (const a of ids) {
      const ranked = ids
        .filter((b) => b !== a)
        .map((b) => {
          const dx = HNSW_CORPUS_XY[a].x - HNSW_CORPUS_XY[b].x;
          const dy = HNSW_CORPUS_XY[a].y - HNSW_CORPUS_XY[b].y;
          return { b, d2: dx * dx + dy * dy };
        })
        .sort((x, y) => x.d2 - y.d2)
        .slice(0, 3);
      for (const { b } of ranked) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        expected.add(`${lo}-${hi}`);
      }
    }
    const actual = new Set(FLAT_GRAPH_EDGES.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`));
    expect(actual).toEqual(expected);
  });

  it("every node has at least 3 edges (M-lower-bound invariant)", () => {
    const degree = {};
    for (const [a, b] of FLAT_GRAPH_EDGES) {
      degree[a] = (degree[a] || 0) + 1;
      degree[b] = (degree[b] || 0) + 1;
    }
    for (const id of Object.keys(HNSW_CORPUS_XY)) {
      expect(degree[id], `node ${id} has fewer than M=3 edges`).toBeGreaterThanOrEqual(3);
    }
  });
});
