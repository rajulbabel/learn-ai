import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WeaviateMilvusChroma from "../../../chapters/vector-systems/weaviate-milvus-chroma.jsx";

afterEach(() => cleanup());

describe("WeaviateMilvusChroma (11.35)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WeaviateMilvusChroma(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WeaviateMilvusChroma(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WeaviateMilvusChroma(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WeaviateMilvusChroma(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WeaviateMilvusChroma(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 describes Weaviate - Go, self-host, modules", () => {
    const { container } = render(WeaviateMilvusChroma(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Weaviate/i);
    expect(container.textContent).toMatch(/Go|self[- ]?host/i);
    expect(container.textContent).toMatch(/module|transformer|generative/i);
  });

  it("sub=1 describes Milvus distributed-native", () => {
    const { container } = render(WeaviateMilvusChroma(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/Milvus/i);
    expect(container.textContent).toMatch(/distributed|billion/i);
    expect(container.textContent).toMatch(/Azure|AI Search|core/i);
  });

  it("sub=2 describes Chroma Python-first local embedded", () => {
    const { container } = render(WeaviateMilvusChroma(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Chroma/i);
    expect(container.textContent).toMatch(/Python|local|embedded/i);
    expect(container.textContent).toMatch(/prototype|small/i);
  });

  it("sub=3 describes Elastic / OpenSearch dense_vector", () => {
    const { container } = render(WeaviateMilvusChroma(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Elastic|OpenSearch/i);
    expect(container.textContent).toMatch(/dense_vector/i);
    expect(container.textContent).toMatch(/existing|already/i);
  });

  it("sub=4 summarizes context-dependent picks", () => {
    const { container } = render(WeaviateMilvusChroma(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Weaviate|Milvus|Chroma|Elastic/i);
    expect(container.textContent).toMatch(/context|pick|fit/i);
  });
});
