import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ContextPacking from "../../../chapters/rag-generation/context-packing.jsx";

afterEach(() => cleanup());

describe("ContextPacking (12.22)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(ContextPacking(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows the token budget breakdown with completion reservation", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/token budget|budget/i);
    expect(container.textContent).toMatch(/system prompt/i);
    expect(container.textContent).toMatch(/completion|reserved/i);
    expect(container.textContent).toMatch(/8000|8k|8,000/i);
  });

  it("sub=1 shows top-3 chunks for the password reset query with scores", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/how do i reset my password|password reset/i);
    expect(container.textContent).toMatch(/doc-?1/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=2 explains relevance-first ordering", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/relevance.?first|most relevant/i);
  });

  it("sub=3 explains chronological ordering", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/chronological|timeline|time.?sensitive/i);
  });

  it("sub=4 shows MMR deduplication with lambda parameter", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/MMR|maximal marginal/i);
    expect(container.textContent).toMatch(/lambda/i);
    expect(container.textContent).toMatch(/duplicate|redundant|diversity/i);
  });

  it("sub=5 shows the final packed prompt with budget badge", () => {
    const { container } = render(ContextPacking(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/documentation|context/i);
    expect(container.textContent).toMatch(/\[doc-?1/i);
    expect(container.textContent).toMatch(/i don'?t (have|know)|don'?t.{0,10}answer/i);
    expect(container.textContent).toMatch(/tokens?|budget/i);
  });
});
