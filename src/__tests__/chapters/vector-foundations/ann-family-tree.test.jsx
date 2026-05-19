import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ANNFamilyTree from "../../../chapters/vector-foundations/ann-family-tree.jsx";

afterEach(() => cleanup());

describe("ANNFamilyTree (15.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ANNFamilyTree(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames sub-linear search as the goal", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/sub[- ]?linear|log\s*N/i);
    expect(container.textContent).toMatch(/1 billion|1B|million/i);
  });

  it("sub=1 covers KD-trees and the curse of dimensionality", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/kd[- ]?tree/i);
    expect(container.textContent).toMatch(/curse of dimensionality/i);
    expect(container.textContent).toMatch(/768|high dim/i);
  });

  it("sub=2 explains LSH as hash-based bucketing", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LSH|locality[- ]?sensitive/i);
    expect(container.textContent).toMatch(/hash|bucket/i);
  });

  it("sub=3 recaps IVF clustering as partition-and-probe", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/IVF|cluster/i);
    expect(container.textContent).toMatch(/partition/i);
  });

  it("sub=4 introduces HNSW and Vamana as graph indexes", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Vamana/);
    expect(container.textContent).toMatch(/graph|edge|node/i);
  });

  it("sub=5 explains why graphs won in production", () => {
    const { container } = render(ANNFamilyTree(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/production|ann[- ]?benchmarks/i);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Qdrant|Weaviate|Milvus|FAISS/);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(ANNFamilyTree(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
