import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgenticRAG from "../../../chapters/rag-generation/agentic-rag.jsx";

afterEach(() => cleanup());

describe("AgenticRAG (22.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(AgenticRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 lists multiple tools beyond vector search", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/vector search/i);
    expect(container.textContent).toMatch(/SQL/);
    expect(container.textContent).toMatch(/calculator/i);
    expect(container.textContent).toMatch(/web search/i);
  });

  it("sub=1 shows the function-calling pattern with tool_call trace", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/function-?calling|tool_call/i);
    expect(container.textContent).toMatch(/tool_response/i);
    expect(container.textContent).toMatch(/sql_query|vector_search/i);
    expect(container.textContent).toMatch(/Compare.*Pro.*Enterprise/i);
  });

  it("sub=2 shows the tool-call loop with max_iterations", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop/i);
    expect(container.textContent).toMatch(/max_?iterations/i);
    expect(container.textContent).toMatch(/final answer/i);
  });

  it("sub=3 shows a multi-tool worked example for Pro vs Enterprise + 25 users", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Compare|Pro|Enterprise/);
    expect(container.textContent).toMatch(/25 users|725|calculator/i);
  });

  it("sub=4 covers termination criteria including hard caps and cost", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/max_?iterations|termination|cap/i);
    expect(container.textContent).toMatch(/cost|budget/i);
  });

  it("sub=5 mentions LangGraph as one orchestration option and chapters 23.6-23.10", () => {
    const { container } = render(AgenticRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/LangGraph|orchestration/i);
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/23\.6-23\.10|framework choice/i);
  });
});
