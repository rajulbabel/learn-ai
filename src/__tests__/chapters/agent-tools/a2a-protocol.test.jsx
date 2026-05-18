import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import A2AProtocol from "../../../chapters/agent-tools/a2a-protocol.jsx";

afterEach(() => cleanup());

describe("A2AProtocol (13.17)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(A2AProtocol(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts MCP and A2A scope", () => {
    const { container } = render(A2AProtocol(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/delegat|agent.*agent/i);
    expect(container.textContent).toMatch(/Agent calls function|Agent delegates whole task/i);
  });

  it("sub=1 shows the agent.json discovery doc", () => {
    const { container } = render(A2AProtocol(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/agent\.json|discovery/i);
    expect(container.textContent).toMatch(/skills|endpoint/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/billing-specialist-v2/);
  });

  it("sub=2 traces the delegation flow on T4", () => {
    const { container } = render(A2AProtocol(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/T4|ticket t4|delegat/i);
    expect(container.textContent).toMatch(/conversation history/i);
  });

  it("sub=3 explains streaming intermediate updates", () => {
    const { container } = render(A2AProtocol(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/progress|update|intermediate/i);
    expect(container.textContent).toMatch(/Refund.*\$200/);
  });

  it("sub=4 explains when A2A vs MCP", () => {
    const { container } = render(A2AProtocol(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/decision|when/i);
    expect(container.textContent).toMatch(/Two Protocols, Two Roles/i);
  });
});
