import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Filtering from "../../../chapters/vector-production/filtering.jsx";

afterEach(() => cleanup());

describe("Filtering (11.20)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames similarity search with a WHERE clause", () => {
    const { container } = render(Filtering(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tenant/i);
    expect(container.textContent).toMatch(/filter|predicate|WHERE/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 pre-filter shrinks the set then searches", () => {
    const { container } = render(Filtering(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/pre[- ]?filter/i);
    expect(container.textContent).toMatch(/brute/i);
    expect(container.textContent).toMatch(/selectiv|tight|loose/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 post-filter returns fewer than k when tight", () => {
    const { container } = render(Filtering(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/post[- ]?filter/i);
    expect(container.textContent).toMatch(/fewer|empty|insufficient/i);
  });

  it("sub=2 post-filter grid uses compact fixed-size cells, not full-width", () => {
    const { container } = render(Filtering(makeCtx({ sub: 2 })));
    const cells = container.querySelectorAll('[title="dropped"], [title="passes predicate"]');
    expect(cells.length).toBe(100);
    const firstCell = cells[0];
    expect(firstCell.style.width).toBe("32px");
    expect(firstCell.style.height).toBe("32px");
    const grid = firstCell.parentElement;
    expect(grid.style.justifyContent).toBe("center");
    expect(grid.style.gridTemplateColumns).toMatch(/32px/);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 inline filtered-HNSW evaluates during traversal", () => {
    const { container } = render(Filtering(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inline|filtered[- ]?HNSW/i);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/traversal|graph hop|payload/i);
  });

  it("sub=3 inline-filter path arrows terminate at node boundary, not center", () => {
    const { container } = render(Filtering(makeCtx({ sub: 3 })));
    const pathLines = container.querySelectorAll("line[marker-end]");
    expect(pathLines.length).toBe(3);
    const first = pathLines[0];
    const x2 = parseFloat(first.getAttribute("x2"));
    expect(x2).toBeLessThan(310);
    expect(x2).toBeGreaterThan(285);
    const x1 = parseFloat(first.getAttribute("x1"));
    expect(x1).toBeGreaterThan(90);
    expect(x1).toBeLessThan(115);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 compares strategies by selectivity", () => {
    const { container } = render(Filtering(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/selectiv/i);
    expect(container.textContent).toMatch(/0\.1|50|5%/);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Filtering(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 names filter-index implementations across systems", () => {
    const { container } = render(Filtering(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/bitmap|inverted|column/i);
    expect(container.textContent).toMatch(/Qdrant|Pinecone|Weaviate|pgvector/);
  });
});
