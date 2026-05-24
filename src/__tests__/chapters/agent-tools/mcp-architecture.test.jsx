import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import McpArchitecture from "../../../chapters/agent-tools/mcp-architecture.jsx";

afterEach(() => cleanup());

describe("McpArchitecture (25.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(McpArchitecture(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names host, client, server", () => {
    const { container } = render(McpArchitecture(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/client/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Claude Desktop/i);
  });

  it("sub=1 shows the one-host many-clients topology", () => {
    const { container } = render(McpArchitecture(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/topology|hub/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Postgres/i);
  });

  it("sub=2 lists stdio, HTTP, SSE transports", () => {
    const { container } = render(McpArchitecture(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/stdio/i);
    expect(container.textContent).toMatch(/http/i);
    expect(container.textContent).toMatch(/sse|server.sent/i);
    expect(container.textContent).toMatch(/Server-Sent Events/i);
  });

  it("sub=3 walks the lifecycle", () => {
    const { container } = render(McpArchitecture(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/initialize|handshake/i);
    expect(container.textContent).toMatch(/list/i);
    expect(container.textContent).toMatch(/call/i);
    expect(container.textContent).toMatch(/Initialize Handshake/i);
  });

  it("sub=4 shows the tools/list response shape", () => {
    const { container } = render(McpArchitecture(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/tools.list|capabilit/i);
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/search_kb/);
  });
});
