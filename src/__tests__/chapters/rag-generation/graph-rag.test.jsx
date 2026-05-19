import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GraphRAG from "../../../chapters/rag-generation/graph-rag.jsx";

afterEach(() => cleanup());

describe("GraphRAG (22.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(GraphRAG(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 explains the switch to the legal-citation secondary corpus", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/legal|citation network/i);
    expect(container.textContent).toMatch(/15|fifteen/i);
    expect(container.textContent).toMatch(/secondary corpus|different corpus|support corpus/i);
  });

  it("sub=1 shows entity + relation extraction on a sample case", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/extract|extraction/i);
    expect(container.textContent).toMatch(/entities|relations/i);
    expect(container.textContent).toMatch(/Smith|Jones|Title VII/);
  });

  it("sub=2 shows the 15-node citation graph", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/15|fifteen/i);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/citation|edge/i);
  });

  it("sub=3 retrieves a subgraph for the precedent chain query", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/subgraph|sub-graph/i);
    expect(container.textContent).toMatch(/precedent|discrimination/i);
  });

  it("sub=4 explains community detection and per-community summarization", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/communit|cluster/i);
    expect(container.textContent).toMatch(/summar/i);
  });

  it("sub=5 contrasts global vs local queries", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/global/i);
    expect(container.textContent).toMatch(/local|subgraph/i);
    expect(container.textContent).toMatch(/themes|map-?reduce|summar/i);
  });

  it("sub=6 lists when GraphRAG is worth the cost", () => {
    const { container } = render(GraphRAG(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/worth it|not worth it/i);
    expect(container.textContent).toMatch(/legal|biomedical|entity/i);
    expect(container.textContent).toMatch(/cost|extraction/i);
  });
});
