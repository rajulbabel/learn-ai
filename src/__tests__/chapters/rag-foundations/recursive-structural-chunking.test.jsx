import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RecursiveStructuralChunking from "../../../chapters/rag-foundations/recursive-structural-chunking.jsx";

afterEach(() => cleanup());

describe("RecursiveStructuralChunking (20.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RecursiveStructuralChunking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RecursiveStructuralChunking(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RecursiveStructuralChunking(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RecursiveStructuralChunking(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RecursiveStructuralChunking(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows the priority tree of structural separators", () => {
    const { container } = render(RecursiveStructuralChunking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/structural|structure/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/line/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/word/i);
  });

  it("sub=1 demonstrates fixed-size failure on heterogeneous doc-7", () => {
    const { container } = render(RecursiveStructuralChunking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/doc-?7|login troubleshooting/i);
    expect(container.textContent).toMatch(/mix|span|across topic/i);
  });

  it("sub=2 shows recursive structural produces one chunk per section", () => {
    const { container } = render(RecursiveStructuralChunking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recursive/i);
    expect(container.textContent).toMatch(/structural/i);
    expect(container.textContent).toMatch(/one topic|exactly one|3 chunks|three chunks/i);
  });

  it("sub=3 traces the recursion when a section exceeds size", () => {
    const { container } = render(RecursiveStructuralChunking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recurse|recursion|fall back/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/300/);
    expect(container.textContent).toMatch(/128/);
  });

  it("sub=4 frames recursive structural as the 80% baseline", () => {
    const { container } = render(RecursiveStructuralChunking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/80%|eighty percent|default/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
    expect(container.textContent).toMatch(/semantic/i);
  });
});
