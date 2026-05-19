import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ToolSecurity from "../../../chapters/agent-production/tool-security.jsx";

afterEach(() => cleanup());

describe("ToolSecurity (28.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ToolSecurity(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows sandbox boundary", () => {
    const { container } = render(ToolSecurity(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/sandbox|cage|boundary/i);
    expect(container.textContent).toMatch(/process|filesystem|network/i);
    expect(container.textContent).toMatch(/Tools Run In A Cage/i);
  });

  it("sub=1 shows capability scope per agent", () => {
    const { container } = render(ToolSecurity(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/capability|scope/i);
    expect(container.textContent).toMatch(/triage|billing|escalation/i);
    expect(container.textContent).toMatch(/Different Agents, Different Tool Sets/i);
  });

  it("sub=2 shows audit log entry", () => {
    const { container } = render(ToolSecurity(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/audit|log/i);
    expect(container.textContent).toMatch(/timestamp|tool|consent/i);
    expect(container.textContent).toMatch(/Audit Log Entry \(Shape\)/i);
  });

  it("sub=3 shows rate limits", () => {
    const { container } = render(ToolSecurity(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/rate limit|per hour/i);
    expect(container.textContent).toMatch(/process_refund|search_kb/);
    expect(container.textContent).toMatch(/Cap The Frequency/i);
  });

  it("sub=4 shows consent prompt", () => {
    const { container } = render(ToolSecurity(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/consent|approval/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/Ask Before Doing Big Things/i);
  });
});
