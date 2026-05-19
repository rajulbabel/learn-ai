import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HybridForRAG from "../../../chapters/rag-retrieval/hybrid-for-rag.jsx";

afterEach(() => cleanup());

describe("HybridForRAG (21.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });
  it("renders at sub=5 without throwing", () => {
    expect(() => render(HybridForRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows API key + cancel examples and references Section 17.5", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/BM25/);
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/API key/i);
    expect(container.textContent).toMatch(/cancel|subscription/i);
    expect(container.textContent).toMatch(/Section 17\.5|17\.5/);
  });

  it("sub=1 shows RRF and weighted-fusion formulas with k = 60 and alpha", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/alpha/i);
  });

  it("sub=2 walks an RRF computation with doc rankings and final order", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc-?25/i);
    expect(container.textContent).toMatch(/0\.0\d+/);
  });

  it("sub=3 shows complementary recall numbers for BM25, dense, hybrid", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/recall|complementary/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=4 tunes alpha by query type with factual vs conceptual rows", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alpha/i);
    expect(container.textContent).toMatch(/factual|lookup/i);
    expect(container.textContent).toMatch(/conceptual/i);
    expect(container.textContent).toMatch(/0\.7|0\.3/);
  });

  it("sub=5 lists hybrid RAG decision defaults", () => {
    const { container } = render(HybridForRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/RRF/);
    expect(container.textContent).toMatch(/default|start/i);
  });
});
