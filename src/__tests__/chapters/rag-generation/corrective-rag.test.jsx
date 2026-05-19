import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CorrectiveRAG from "../../../chapters/rag-generation/corrective-rag.jsx";

afterEach(() => cleanup());

describe("CorrectiveRAG (22.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(CorrectiveRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows retrieval evaluator scoring 3 docs", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/evaluator|score/i);
    expect(container.textContent).toMatch(/CORRECT/);
    expect(container.textContent).toMatch(/AMBIGUOUS/);
    expect(container.textContent).toMatch(/INCORRECT/);
  });

  it("sub=1 explains the CORRECT branch using docs directly", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/correct/i);
    expect(container.textContent).toMatch(/directly|use|baseline/i);
  });

  it("sub=2 explains the INCORRECT branch with web search fallback", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/incorrect/i);
    expect(container.textContent).toMatch(/web search|fallback/i);
  });

  it("sub=3 explains the AMBIGUOUS branch combining internal and web", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ambiguous/i);
    expect(container.textContent).toMatch(/combine|merge|hedge/i);
  });

  it("sub=4 shows strip-level decomposition and per-strip KEEP/DROP", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/strip|strips/i);
    expect(container.textContent).toMatch(/KEEP/);
    expect(container.textContent).toMatch(/DROP/);
  });

  it("sub=5 shows the 3-branch CRAG decision tree with Yan et al reference", () => {
    const { container } = render(CorrectiveRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/decision tree|decision/i);
    expect(container.textContent).toMatch(/CORRECT/);
    expect(container.textContent).toMatch(/AMBIGUOUS/);
    expect(container.textContent).toMatch(/INCORRECT/);
    expect(container.textContent).toMatch(/Yan|2024/i);
  });
});
