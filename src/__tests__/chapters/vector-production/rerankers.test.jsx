import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Rerankers from "../../../chapters/vector-production/rerankers.jsx";

afterEach(() => cleanup());

describe("Rerankers (11.25)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames two-stage retrieval", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/two[- ]?stage|stage 1/i);
    expect(container.textContent).toMatch(/top[- ]?100|100/);
    expect(container.textContent).toMatch(/fast|approximate/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 introduces cross-encoder concatenation", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cross[- ]?encoder/i);
    expect(container.textContent).toMatch(/concatenated|together/i);
    expect(container.textContent).toMatch(/attention/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 contrasts bi-encoder and cross-encoder", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/bi[- ]?encoder/i);
    expect(container.textContent).toMatch(/token|interaction/i);
    expect(container.textContent).toMatch(/attention/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 reranks top-100 to top-10", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/rerank|re-rank/i);
    expect(container.textContent).toMatch(/top[- ]?10|10/i);
    expect(container.textContent).toMatch(/score|sort/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 shows latency cost on GPU", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/latency|ms|100 ms/i);
    expect(container.textContent).toMatch(/1 ms|100/);
    expect(container.textContent).toMatch(/GPU|A10|H100/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Rerankers(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 names production reranker models", () => {
    const { container } = render(Rerankers(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Cohere|BGE|MS[- ]?MARCO/i);
  });
});
