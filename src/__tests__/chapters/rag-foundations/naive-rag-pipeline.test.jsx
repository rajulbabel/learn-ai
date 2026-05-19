import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import NaiveRAGPipeline from "../../../chapters/rag-foundations/naive-rag-pipeline.jsx";

afterEach(() => cleanup());

describe("NaiveRAGPipeline (19.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(NaiveRAGPipeline(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 shows the 5-stage pipeline overview", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/store/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
  });

  it("sub=1 demonstrates chunking on doc-1 password reset", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/password reset|reset.*password|doc-?1/i);
    expect(container.textContent).toMatch(/chunk/i);
  });

  it("sub=2 references Section 8.2 for embeddings", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/section 8\.2|8\.2/i);
    expect(container.textContent).toMatch(/embed|vector/i);
  });

  it("sub=3 references Section 11 for vector storage / HNSW", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/section 11/i);
    expect(container.textContent).toMatch(/HNSW|vector (database|index)/i);
  });

  it("sub=4 retrieves top-k for the password reset query", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/top-?k|top-?3/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=5 shows a prompt template with citation marker and I-don't-know clause", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/i don'?t know|don'?t answer/i);
    expect(container.textContent).toMatch(/\[doc-?1/i);
    expect(container.textContent).toMatch(/documentation|context/i);
  });

  it("sub=6 walks the running query end to end across all 5 stages", () => {
    const { container } = render(NaiveRAGPipeline(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });
});
