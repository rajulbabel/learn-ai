import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HybridSearch from "../../../chapters/vector-production/hybrid-search.jsx";

afterEach(() => cleanup());

describe("HybridSearch (11.25)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 explains vectors miss exact matches", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/SKU|exact|proper noun/i);
    expect(container.textContent).toMatch(/vector|embedding/i);
    expect(container.textContent).toMatch(/miss|blur/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 recaps BM25 formula", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/BM25/);
    expect(container.textContent).toMatch(/term frequency|TF/i);
    expect(container.textContent).toMatch(/IDF|inverse document/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 runs BM25 and vector in parallel", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|both/i);
    expect(container.textContent).toMatch(/ranked|top/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 uses Reciprocal Rank Fusion with k=60", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/60/);
    expect(container.textContent).toMatch(/1 \/|rank/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 works the tabby example vector vs BM25 vs hybrid", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/tabby/i);
    expect(container.textContent).toMatch(/vector/i);
    expect(container.textContent).toMatch(/BM25/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(HybridSearch(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 covers weighted hybrid tuning", () => {
    const { container } = render(HybridSearch(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/weight|alpha|0\.7/i);
    expect(container.textContent).toMatch(/hybrid/i);
  });
});
