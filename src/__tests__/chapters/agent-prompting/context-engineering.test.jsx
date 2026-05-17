import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ContextEngineering from "../../../chapters/agent-prompting/context-engineering.jsx";

afterEach(() => cleanup());

describe("ContextEngineering (13.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ContextEngineering(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the context window budget", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window/i);
    expect(container.textContent).toMatch(/128k|budget/i);
    expect(container.textContent).toMatch(/system/i);
  });

  it("sub=1 shows prompt assembly stack", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/history|conversation/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 compares budget strategies", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/strategy|trim|summar/i);
  });

  it("sub=3 explains lost-in-the-middle", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lost in the middle|u.?shape|middle/i);
  });

  it("sub=4 contrasts relevance-first and recency-first", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/recency/i);
  });

  it("sub=5 shows the eviction ladder", () => {
    const { container } = render(ContextEngineering(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/evict/i);
    expect(container.textContent).toMatch(/summar/i);
  });
});
