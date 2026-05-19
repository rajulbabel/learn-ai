import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import QdrantVsPinecone from "../../../chapters/vector-systems/qdrant-vs-pinecone.jsx";

afterEach(() => cleanup());

describe("QdrantVsPinecone (18.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(QdrantVsPinecone(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 names the decision axes", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/axis|axes/i);
    expect(container.textContent).toMatch(/ops|filter|cost|feature/i);
  });

  it("sub=1 scenario A: prototype -> Pinecone serverless", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/scenario A|prototype/i);
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/serverless/i);
  });

  it("sub=2 scenario B: 10M + complex filters -> Qdrant", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/scenario B|10M/i);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/filter|complex/i);
  });

  it("sub=3 scenario C: 1B at 10K QPS -> Qdrant multi-node or Milvus", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/scenario C|1B/i);
    expect(container.textContent).toMatch(/10K QPS|steady/i);
    expect(container.textContent).toMatch(/Qdrant|Milvus/);
  });

  it("sub=4 scenario D: spiky + EU -> Pinecone region or Qdrant Cloud EU", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/scenario D|spiky/i);
    expect(container.textContent).toMatch(/EU|residency/i);
    expect(container.textContent).toMatch(/region|Pinecone|Qdrant Cloud/);
  });

  it("sub=5 shows the decision flowchart summary", () => {
    const { container } = render(QdrantVsPinecone(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/flowchart|decision/i);
    expect(container.textContent).toMatch(/Pinecone|Qdrant/);
  });
});
