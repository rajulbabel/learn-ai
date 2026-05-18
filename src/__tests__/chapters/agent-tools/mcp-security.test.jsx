import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import McpSecurity from "../../../chapters/agent-tools/mcp-security.jsx";

afterEach(() => cleanup());

describe("McpSecurity (13.16)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(McpSecurity(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames trust boundary", () => {
    const { container } = render(McpSecurity(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trust|untrusted/i);
    expect(container.textContent).toMatch(/boundary|host|server/i);
    expect(container.textContent).toMatch(/Server Code Is Untrusted By Default/i);
  });

  it("sub=1 describes sandbox isolation", () => {
    const { container } = render(McpSecurity(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/sandbox/i);
    expect(container.textContent).toMatch(/process|isolat/i);
    expect(container.textContent).toMatch(/Process Isolation/i);
  });

  it("sub=2 lists capability scope", () => {
    const { container } = render(McpSecurity(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|scope/i);
    expect(container.textContent).toMatch(/allow|deny/i);
    expect(container.textContent).toMatch(/kb:\/\/internal/);
  });

  it("sub=3 shows OAuth flow", () => {
    const { container } = render(McpSecurity(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/oauth/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/Access Token/i);
  });

  it("sub=4 explains consent prompts and audit log", () => {
    const { container } = render(McpSecurity(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/consent|approval/i);
    expect(container.textContent).toMatch(/audit|log/i);
    expect(container.textContent).toMatch(/INV-9924/);
  });
});
