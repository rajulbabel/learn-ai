import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CostModels from "../../../chapters/rag-production/cost-models.jsx";

afterEach(() => cleanup());

describe("CostModels (12.37)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(CostModels(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 enumerates the 5 cost lines", () => {
    const { container } = render(CostModels(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding/i);
    expect(container.textContent).toMatch(/vector search|search/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/LLM input|input token/i);
    expect(container.textContent).toMatch(/LLM output|output token/i);
  });

  it("sub=1 shows the cost stack bar with LLM dominance", () => {
    const { container } = render(CostModels(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/LLM|tokens/i);
    expect(container.textContent).toMatch(/9\d%|95%|94%/);
  });

  it("sub=2 scales to QPS / daily / monthly", () => {
    const { container } = render(CostModels(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/daily|month|day/i);
    expect(container.textContent).toMatch(/\$\d/);
  });

  it("sub=3 enumerates the 5 cost levers", () => {
    const { container } = render(CostModels(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lever/i);
    expect(container.textContent).toMatch(/smaller|matryoshka|384/i);
    expect(container.textContent).toMatch(/Haiku|Sonnet|smaller LLM/i);
    expect(container.textContent).toMatch(/cache/i);
  });

  it("sub=4 stacks all levers and shows a final cost", () => {
    const { container } = render(CostModels(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stack|compound|all/i);
    expect(container.textContent).toMatch(/9\d%|reduction|saved/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d/);
  });

  it("sub=5 plots cost vs quality frontier", () => {
    const { container } = render(CostModels(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/frontier|Pareto/i);
    expect(container.textContent).toMatch(/quality|faithfulness/i);
    expect(container.textContent).toMatch(/cost|\$/i);
  });
});
