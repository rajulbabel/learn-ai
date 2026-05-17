import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FrameworkChoice from "../../../chapters/rag-production/framework-choice.jsx";

afterEach(() => cleanup());

describe("FrameworkChoice (12.40)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(FrameworkChoice(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 lists the 6 framework options", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no framework|raw SDK/i);
    expect(container.textContent).toMatch(/LlamaIndex/);
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Haystack/);
    expect(container.textContent).toMatch(/vendor SDK|OpenAI Agents|Anthropic/i);
  });

  it("sub=1 shows the framework decision matrix", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lock-?in/i);
    expect(container.textContent).toMatch(/churn|complexity/i);
    expect(container.textContent).toMatch(/community/i);
  });

  it("sub=2 gives an honest take on LangChain", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/deprecated|abstraction|churn/i);
  });

  it("sub=3 maps each framework to when it fits", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/team/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|Haystack/);
  });

  it("sub=4 shows the framework decision tree", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|LangGraph/);
  });

  it("sub=5 emphasizes framework-agnostic decisions", () => {
    const { container } = render(FrameworkChoice(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/chunking|embedding|hybrid|reranker/i);
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/agnostic|same|replaceable/i);
  });
});
