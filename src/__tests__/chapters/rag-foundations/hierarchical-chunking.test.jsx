import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HierarchicalChunking from "../../../chapters/rag-foundations/hierarchical-chunking.jsx";

afterEach(() => cleanup());

describe("HierarchicalChunking (12.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(HierarchicalChunking(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames the small-vs-large chunk tension", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/small chunks?/i);
    expect(container.textContent).toMatch(/large chunks?/i);
    expect(container.textContent).toMatch(/retrieval|precision/i);
    expect(container.textContent).toMatch(/generation|context/i);
  });

  it("sub=1 introduces the leaf-and-parent hierarchy on doc-4", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/leaf|leaves/i);
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/doc-?4|refund/i);
    expect(container.textContent).toMatch(/64/);
    expect(container.textContent).toMatch(/300/);
  });

  it("sub=1 tree SVG omits right-edge legend labels that overlap nodes", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) =>
      s.textContent.includes("Doc-4 Refunds Policy (Root)"),
    );
    expect(svg).not.toBeNull();
    expect(svg.textContent).not.toMatch(/Root:\s*900\s*Tok/);
    expect(svg.textContent).not.toMatch(/Section:\s*300\s*Tok/);
    expect(svg.textContent).not.toMatch(/Leaf:\s*64\s*Tok/);
  });

  it("sub=2 retrieves a leaf chunk for the refund query", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/30 days|L7|leaf/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 swaps leaf for parent before the LLM", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/swap|lookup|replace/i);
    expect(container.textContent).toMatch(/LLM|prompt|context/i);
  });

  it("sub=4 introduces summary chunks as a variant", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/summary|summaries/i);
    expect(container.textContent).toMatch(/LLM|generate/i);
  });

  it("sub=4 summary-variant SVG omits right-edge legend labels that overlap nodes", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 4 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Summary (LLM-Made)"));
    expect(svg).not.toBeNull();
    const rightAnchored = Array.from(svg.querySelectorAll("text")).filter(
      (t) => t.getAttribute("text-anchor") === "end",
    );
    expect(
      rightAnchored.map((t) => t.textContent.trim()),
      "right-anchored legend labels overlap diagram nodes",
    ).toEqual([]);
  });

  it("sub=5 explains when and at what cost", () => {
    const { container } = render(HierarchicalChunking(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/storage|cost/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
  });
});
