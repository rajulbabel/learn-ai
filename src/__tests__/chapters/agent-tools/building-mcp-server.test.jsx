import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BuildingMcpServer from "../../../chapters/agent-tools/building-mcp-server.jsx";

afterEach(() => cleanup());

describe("BuildingMcpServer (13.15)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(BuildingMcpServer(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the skeleton phases", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/declare|register/i);
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
    expect(container.textContent).toMatch(/Each declaration registers/i);
  });

  it("sub=1 shows tool registration shape", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/handler/i);
    expect(container.textContent).toMatch(/Handler runs server-side/i);
  });

  it("sub=2 shows resource registration", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/template|uri/i);
    expect(container.textContent).toMatch(/kb:\/\/articles\/password-reset/);
  });

  it("sub=3 shows prompt registration", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|prompt/i);
    expect(container.textContent).toMatch(/resolved prompt string/i);
  });

  it("sub=4 shows the lifecycle", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/lifecycle|state|listen/i);
    expect(container.textContent).toMatch(/active/i);
    expect(container.textContent).toMatch(/Definitions Declared|Transport Open/i);
  });

  it("sub=5 lists testing strategies", () => {
    const { container } = render(BuildingMcpServer(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/test/i);
    expect(container.textContent).toMatch(/handler|unit/i);
    expect(container.textContent).toMatch(/mock|isolat/i);
    expect(container.textContent).toMatch(/Mock Host/i);
  });
});
