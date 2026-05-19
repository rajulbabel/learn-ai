import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MultiAgentFailures from "../../../chapters/multi-agent/multi-agent-failures.jsx";

afterEach(() => cleanup());

describe("MultiAgentFailures (27.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(MultiAgentFailures(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 lists four failure modes", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/infinite loop/i);
    expect(container.textContent).toMatch(/deadlock/i);
    expect(container.textContent).toMatch(/cost runaway|runaway/i);
    expect(container.textContent).toMatch(/How Multi-Agent Falls Apart/i);
  });

  it("sub=1 shows drift", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/disagree|goal|intent/i);
    expect(container.textContent).toMatch(/Drift: Agents Pull/i);
  });

  it("sub=2 shows infinite loop", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/infinite loop|ping.?pong/i);
    expect(container.textContent).toMatch(/hand.?off/i);
    expect(container.textContent).toMatch(/Hand-Off Ping-Pong/i);
  });

  it("sub=3 shows deadlock", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/deadlock|wait/i);
    expect(container.textContent).toMatch(/Two Agents Wait Forever/i);
  });

  it("sub=4 shows cost runaway", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost runaway|recursion/i);
    expect(container.textContent).toMatch(/exponential|vertical|spend/i);
    expect(container.textContent).toMatch(/Unbounded Recursion/i);
  });

  it("sub=5 maps signals per failure", () => {
    const { container } = render(MultiAgentFailures(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/signal|alert|threshold/i);
    expect(container.textContent).toMatch(/What To Alert On/i);
  });
});
