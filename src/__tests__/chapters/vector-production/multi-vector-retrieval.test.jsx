import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MultiVectorRetrieval from "../../../chapters/vector-production/multi-vector-retrieval.jsx";

afterEach(() => cleanup());

describe("MultiVectorRetrieval (11.26)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames the single-vector blur problem", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/single[- ]?vector|one vector/i);
    expect(container.textContent).toMatch(/blur|lossy|average/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 introduces ColBERT one-vector-per-token", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ColBERT/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/200|per token/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 uses max-sim aggregation", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/max[- ]?sim|maxsim/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/sum/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 walks the max-sim calculation on cat corpus", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/walkthrough|cat|token/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 shows storage cost scaled by token count", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/storage|memory/i);
    expect(container.textContent).toMatch(/20|100|600 GB/);
    expect(container.textContent).toMatch(/token/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(MultiVectorRetrieval(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 names Vespa, Qdrant, Elasticsearch support", () => {
    const { container } = render(MultiVectorRetrieval(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Vespa/i);
    expect(container.textContent).toMatch(/Qdrant/i);
    expect(container.textContent).toMatch(/Elasticsearch|nested|tensor/i);
  });
});
