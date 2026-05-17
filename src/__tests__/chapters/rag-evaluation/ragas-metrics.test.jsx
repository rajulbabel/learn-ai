import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RAGASMetrics from "../../../chapters/rag-evaluation/ragas-metrics.jsx";

afterEach(() => cleanup());

describe("RAGASMetrics (12.33)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(RAGASMetrics(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 introduces RAGAS as reference-free with 4 metrics", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/RAGAS/);
    expect(container.textContent).toMatch(/reference[- ]?free|without reference|no reference/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/relevancy/i);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 shows the faithfulness formula and a worked example", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/verifiable claim|total claim|supported/i);
    expect(container.textContent).toMatch(/4\s*\/\s*5|0\.8|3\s*\/\s*4|0\.75/);
  });

  it("sub=2 shows answer relevancy with round-trip cosine", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/answer relevancy|relevancy/i);
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/round[- ]?trip|generate|question from/i);
    expect(container.textContent).toMatch(/0\.91|0\.913|0\.89|0\.94/);
  });

  it("sub=3 shows context precision with worked example", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/context precision|precision/i);
    expect(container.textContent).toMatch(/relevant/i);
    expect(container.textContent).toMatch(/2\s*\/\s*3|0\.667/);
  });

  it("sub=3 cross-refs DeepEval/TruLens ContextualRelevancyScore alias", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/DeepEval|TruLens/);
    expect(container.textContent).toMatch(/contextual relevanc|context relevanc/i);
  });

  it("sub=4 shows context recall with worked example", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/context recall|recall/i);
    expect(container.textContent).toMatch(/relevant/i);
    expect(container.textContent).toMatch(/2\s*\/\s*2|1\.0|0\.5|1\s*\/\s*2/);
  });

  it("sub=5 produces a per-query report card with all four scores", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/relevancy/i);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/report card|score card|average/i);
  });

  it("sub=6 flags BLEU/ROUGE as deprecated for RAG eval", () => {
    const { container } = render(RAGASMetrics(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/BLEU|ROUGE/);
    expect(container.textContent).toMatch(/deprecated|word.overlap|n[- ]?gram|do not measure/i);
    expect(container.textContent).toMatch(/faithful|ground/i);
  });
});
