import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HNSWPQ from "../../../chapters/vector-compression/hnsw-pq.jsx";

afterEach(() => cleanup());

describe("HNSWPQ (11.18)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HNSWPQ(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 combines HNSW graph navigation with PQ compression", () => {
    const { container } = render(HNSWPQ(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/code|encoded/i);
  });

  it("sub=1 keeps the graph structure and stores PQ codes at nodes", () => {
    const { container } = render(HNSWPQ(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/code|96 bytes/i);
    expect(container.textContent).toMatch(/196|100M|node/i);
  });

  it("sub=2 uses PQ asymmetric distance lookup", () => {
    const { container } = render(HNSWPQ(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/lookup|table/i);
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/faster|speedup|10x/i);
  });

  it("sub=3 compensates for recall drop with higher ef_search", () => {
    const { container } = render(HNSWPQ(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/error|drop|accuracy/i);
    expect(container.textContent).toMatch(/50|150/);
  });

  it("sub=4 names production systems that support HNSW + PQ", () => {
    const { container } = render(HNSWPQ(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Weaviate|Milvus/);
    expect(container.textContent).toMatch(/production|default|standard/i);
  });
});
