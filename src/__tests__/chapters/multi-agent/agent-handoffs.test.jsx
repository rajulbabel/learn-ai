import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgentHandoffs from "../../../chapters/multi-agent/agent-handoffs.jsx";

afterEach(() => cleanup());

describe("AgentHandoffs (27.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgentHandoffs(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AgentHandoffs(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(AgentHandoffs(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(AgentHandoffs(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(AgentHandoffs(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 contrasts hand-off vs delegation", () => {
    const { container } = render(AgentHandoffs(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/hand.?off/i);
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/switch|return|control/i);
    expect(container.textContent).toMatch(/Return The Next Agent/i);
  });

  it("sub=1 shows the swarm shape", () => {
    const { container } = render(AgentHandoffs(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/swarm|hand.?off/i);
    expect(container.textContent).toMatch(/handoffs/i);
    expect(container.textContent).toMatch(/triage|billing/i);
    expect(container.textContent).toMatch(/Agents As Routes/i);
  });

  it("sub=2 explains context transfer", () => {
    const { container } = render(AgentHandoffs(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/context|history/i);
    expect(container.textContent).toMatch(/working memory|snapshot/i);
    expect(container.textContent).toMatch(/What Travels With The Hand-Off/i);
  });

  it("sub=3 traces T4 hand-off", () => {
    const { container } = render(AgentHandoffs(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/hand.?off|escalation/i);
    expect(container.textContent).toMatch(/Trace: T4/i);
  });

  it("sub=4 contrasts ring vs tree", () => {
    const { container } = render(AgentHandoffs(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ring|peer/i);
    expect(container.textContent).toMatch(/tree|nested/i);
    expect(container.textContent).toMatch(/Ring When All Agents Are Peers/i);
  });
});
