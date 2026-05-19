import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SparseVsDense from "../../../chapters/vector-foundations/sparse-vs-dense.jsx";

afterEach(() => cleanup());

describe("SparseVsDense (15.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SparseVsDense(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces two vector families: dense and sparse", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/sparse/i);
    expect(container.textContent).toMatch(/two/i);
  });

  it("sub=1 shows dense vector with ~768 dims and concrete numbers", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/768|384|1536/);
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/I love cats/i);
  });

  it("sub=1 dense vector explains every dimension is non-zero", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/non.?zero|every dimension|packed/i);
  });

  it("sub=2 shows sparse vector with vocab-size dims and mostly zeros", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sparse/i);
    expect(container.textContent).toMatch(/vocab|vocabulary|30,?000|50,?000/i);
    expect(container.textContent).toMatch(/zero/i);
  });

  it("sub=2 sparse vector explains TF-IDF / BM25 weights", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/BM25|TF.?IDF|term frequency/i);
  });

  it("sub=2 uses running example The cat sat on the mat last week", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cat|mat/i);
  });

  it("sub=3 contrasts storage: dense array vs inverted index", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/storage|memory|bytes/i);
    expect(container.textContent).toMatch(/inverted index|posting|index/i);
  });

  it("sub=3 quantifies cost: dense bytes per vector vs sparse pairs", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3,?072|4 bytes|float32/i);
  });

  it("sub=4 introduces learned sparse / SPLADE", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/SPLADE|learned sparse/i);
    expect(container.textContent).toMatch(/expand|fill|related/i);
  });

  it("sub=4 shows how SPLADE bridges sparse + semantic", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/feline|kitten|semantic/i);
  });

  it("sub=5 gives when-which guidance table", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/sparse/i);
    expect(container.textContent).toMatch(/exact|keyword|synonym|paraphrase/i);
  });

  it("sub=5 hints hybrid is the production default", () => {
    const { container } = render(SparseVsDense(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hybrid|both|combine|fuse/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(SparseVsDense(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
