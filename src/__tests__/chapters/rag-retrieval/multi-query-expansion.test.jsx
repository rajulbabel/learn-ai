import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MultiQueryExpansion from "../../../chapters/rag-retrieval/multi-query-expansion.jsx";

afterEach(() => cleanup());

describe("MultiQueryExpansion (21.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 4 })))).not.toThrow();
  });
  it("renders at sub=5 without throwing", () => {
    expect(() => render(MultiQueryExpansion(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames one query becomes many and mentions RAG-Fusion", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/multi-?query|expansion|variants/i);
    expect(container.textContent).toMatch(/RAG-?Fusion/i);
  });

  it("sub=1 shows the 3-step pipeline", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/generate|variants/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/fuse|RRF/i);
  });

  it("sub=2 walks the cancel-and-refund example with 3 variants and fused ranking", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/doc-?15/i);
    expect(container.textContent).toMatch(/doc-?4/i);
  });

  it("sub=3 shows RRF formula and links to chapter 21.3", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/21\.3/);
  });

  it("sub=4 covers step-back prompting variant", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/step-?back/i);
    expect(container.textContent).toMatch(/general|broader|specific/i);
  });

  it("sub=5 shows when multi-query helps with latency cost", () => {
    const { container } = render(MultiQueryExpansion(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ambigu|complex/i);
    expect(container.textContent).toMatch(/latency|300|ms/i);
    expect(container.textContent).toMatch(/HyDE/i);
  });
});
