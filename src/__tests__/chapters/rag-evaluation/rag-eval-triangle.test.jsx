import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RAGEvalTriangle from "../../../chapters/rag-evaluation/rag-eval-triangle.jsx";

afterEach(() => cleanup());

describe("RAGEvalTriangle (12.31)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(RAGEvalTriangle(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 names the three eval layers", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/three layer|three-layer|3 layer/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
    expect(container.textContent).toMatch(/end[- ]?to[- ]?end/i);
  });

  it("sub=1 lists retrieval metrics with formulas", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall@?k|recall@?10/i);
    expect(container.textContent).toMatch(/MRR/);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/nDCG|discounted cumulative/i);
  });

  it("sub=2 lists generation metrics: faithfulness and answer relevancy", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/relevanc/i);
    expect(container.textContent).toMatch(/claim|supported|context/i);
  });

  it("sub=3 lists end-to-end metrics: correctness and helpfulness", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/helpful/i);
    expect(container.textContent).toMatch(/Likert|1-?5/i);
  });

  it("sub=4 traces failures to a specific layer", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/trace|locate|root cause/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
  });

  it("sub=5 marks BLEU and ROUGE as deprecated for RAG", () => {
    const { container } = render(RAGEvalTriangle(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/BLEU/);
    expect(container.textContent).toMatch(/ROUGE/);
    expect(container.textContent).toMatch(/deprecated|word.overlap|do not measure/i);
    expect(container.textContent).toMatch(/faithful|ground/i);
  });
});
