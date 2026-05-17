import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgentLoop from "../../../chapters/agent-loops/agent-loop.jsx";

afterEach(() => cleanup());

describe("AgentLoop (13.20)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgentLoop(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names reason / act / observe", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/act/i);
    expect(container.textContent).toMatch(/observ/i);
    expect(container.textContent).toMatch(/three.?beat/i);
  });

  it("sub=1 shows state machine view", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/state/i);
    expect(container.textContent).toMatch(/done|terminal/i);
    expect(container.textContent).toMatch(/ESCALATED/);
  });

  it("sub=2 explains termination check", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/terminat|stop/i);
    expect(container.textContent).toMatch(/max iter|budget/i);
    expect(container.textContent).toMatch(/13\.23/);
  });

  it("sub=3 shows per-iteration cost", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/llm call|tool call/i);
    expect(container.textContent).toMatch(/\$0\.02/);
  });

  it("sub=4 traces ticket T2 as a loop", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
    expect(container.textContent).toMatch(/reset_password/);
    expect(container.textContent).toMatch(/c-9924/);
  });

  it("sub=5 contrasts single vs loop", () => {
    const { container } = render(AgentLoop(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/single|loop/i);
    expect(container.textContent).toMatch(/depend|adapt/i);
    expect(container.textContent).toMatch(/second tool's input depends/i);
  });
});
