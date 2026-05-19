import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FAISS from "../../../chapters/vector-systems/faiss.jsx";

afterEach(() => cleanup());

describe("FAISS (17.10)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(FAISS(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames FAISS as Meta's 2017 reference library", () => {
    const { container } = render(FAISS(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Meta|Facebook/i);
    expect(container.textContent).toMatch(/2017|library/i);
  });

  it("sub=1 names the algorithms inside FAISS", () => {
    const { container } = render(FAISS(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/CPU|CUDA|GPU/i);
  });

  it("sub=2 describes Python bindings over a C++ core", () => {
    const { container } = render(FAISS(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Python/i);
    expect(container.textContent).toMatch(/C\+\+|core/i);
    expect(container.textContent).toMatch(/bindings?|embed/i);
  });

  it("sub=3 enumerates what FAISS does not provide", () => {
    const { container } = render(FAISS(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/persist/i);
    expect(container.textContent).toMatch(/API|REST/i);
    expect(container.textContent).toMatch(/filter|ACID|replicat/i);
  });

  it("sub=4 names systems that embed FAISS", () => {
    const { container } = render(FAISS(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Milvus/);
    expect(container.textContent).toMatch(/OpenSearch|engine/i);
    expect(container.textContent).toMatch(/inside|underneath/i);
  });

  it("sub=5 states the build-vs-use rule", () => {
    const { container } = render(FAISS(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/build/i);
    expect(container.textContent).toMatch(/DB|database/i);
    expect(container.textContent).toMatch(/use one|use it/i);
  });
});
