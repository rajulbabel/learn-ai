import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgenticRag from "../../../chapters/multi-agent/agentic-rag.jsx";

afterEach(() => cleanup());

describe("AgenticRag (13.36)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgenticRag(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AgenticRag(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(AgenticRag(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(AgenticRag(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(AgenticRag(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 contrasts naive and agentic RAG", () => {
    const { container } = render(AgenticRag(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/naive|agentic/i);
    expect(container.textContent).toMatch(/12\.29|section 12/i);
    expect(container.textContent).toMatch(/iterative|loop|one.?shot/i);
    expect(container.textContent).toMatch(/Retrieve Once vs Retrieve In A Loop/i);
  });

  it("sub=1 shows the iterative loop", () => {
    const { container } = render(AgenticRag(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search/i);
    expect(container.textContent).toMatch(/judge/i);
    expect(container.textContent).toMatch(/refine|rewrite/i);
    expect(container.textContent).toMatch(/Search, Judge, Refine, Repeat/i);
  });

  it("sub=2 shows query rewriting", () => {
    const { container } = render(AgenticRag(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rewrite/i);
    expect(container.textContent).toMatch(/customer.?impact|severity/i);
    expect(container.textContent).toMatch(/Agent Rewrites Its Own Query/i);
  });

  it("sub=3 traces the 90-day research query", () => {
    const { container } = render(AgenticRag(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/90 days|customer.?impact/i);
    expect(container.textContent).toMatch(/aggregat|summary|table/i);
    expect(container.textContent).toMatch(/Example: Customer-Impact Issues/i);
  });

  it("sub=4 decides when agentic vs naive", () => {
    const { container } = render(AgenticRag(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/naive|12\.2/);
    expect(container.textContent).toMatch(/agentic|research|multi.?hop/i);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/When To Iterate Retrieval/i);
  });
});
