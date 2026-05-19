import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import McpPrimitives from "../../../chapters/agent-tools/mcp-primitives.jsx";

afterEach(() => cleanup());

describe("McpPrimitives (25.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(McpPrimitives(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names the three primitives", () => {
    const { container } = render(McpPrimitives(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
    expect(container.textContent).toMatch(/Things The Model Can Do/i);
  });

  it("sub=1 shows a tool example", () => {
    const { container } = render(McpPrimitives(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/side effect|mutate/i);
    expect(container.textContent).toMatch(/invoice_id/);
  });

  it("sub=2 shows a resource URI", () => {
    const { container } = render(McpPrimitives(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/read.?only|read only/i);
    expect(container.textContent).toMatch(/kb:\/\/articles\/password-reset/);
  });

  it("sub=3 shows a prompt with arguments", () => {
    const { container } = render(McpPrimitives(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|parameter|required/i);
    expect(container.textContent).toMatch(/slash.commands/i);
  });

  it("sub=4 explains when to use which", () => {
    const { container } = render(McpPrimitives(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/action|mutate|do/i);
    expect(container.textContent).toMatch(/read|data/i);
    expect(container.textContent).toMatch(/template/i);
    expect(container.textContent).toMatch(/Decision rule:/);
  });
});
