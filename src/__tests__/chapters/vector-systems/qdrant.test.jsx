import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Qdrant from "../../../chapters/vector-systems/qdrant.jsx";

afterEach(() => cleanup());

describe("Qdrant (11.32)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Qdrant(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames Qdrant as a Rust open-source vector DB", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Rust/i);
    expect(container.textContent).toMatch(/open[- ]?source|self[- ]?host/i);
  });

  it("sub=1 describes HNSW with inline filter during traversal", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/inline|filter|traversal/i);
    expect(container.textContent).toMatch(/payload/i);
  });

  it("sub=2 describes collections and payload metadata", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/collection/i);
    expect(container.textContent).toMatch(/payload|metadata/i);
    expect(container.textContent).toMatch(/multi[- ]?vector/i);
  });

  it("sub=3 lists built-in features including quantization variants", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/quantization|scalar|binary/i);
    expect(container.textContent).toMatch(/SQ|PQ|BQ/);
  });

  it("sub=4 covers the self-host deployment story", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/binary|Docker|Kubernetes/i);
    expect(container.textContent).toMatch(/self[- ]?host|operator/i);
  });

  it("sub=5 names the tradeoffs", () => {
    const { container } = render(Qdrant(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ops|operational/i);
    expect(container.textContent).toMatch(/multi[- ]?region|ecosystem/i);
    expect(container.textContent).toMatch(/Elastic|smaller/i);
  });
});
