import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CriticDebate from "../../../chapters/multi-agent/critic-debate.jsx";

afterEach(() => cleanup());

describe("CriticDebate (13.34)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CriticDebate(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CriticDebate(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CriticDebate(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CriticDebate(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CriticDebate(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 introduces critic role", () => {
    const { container } = render(CriticDebate(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/critic/i);
    expect(container.textContent).toMatch(/13\.22|reflection/i);
    expect(container.textContent).toMatch(/A Second Agent Checks The First/i);
  });

  it("sub=1 shows critique-revise loop", () => {
    const { container } = render(CriticDebate(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/critique|score/i);
    expect(container.textContent).toMatch(/revise/i);
    expect(container.textContent).toMatch(/Loop: Draft/i);
  });

  it("sub=2 shows debate pattern", () => {
    const { container } = render(CriticDebate(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/debate|argue/i);
    expect(container.textContent).toMatch(/judge/i);
    expect(container.textContent).toMatch(/Two Agents Argue/i);
  });

  it("sub=3 shows refund critic example", () => {
    const { container } = render(CriticDebate(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/policy/i);
    expect(container.textContent).toMatch(/30 days|partial/i);
    expect(container.textContent).toMatch(/Policy Critic/i);
  });

  it("sub=4 shows critic cost tradeoff", () => {
    const { container } = render(CriticDebate(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|battle/i);
    expect(container.textContent).toMatch(/high.?stakes|contested/i);
    expect(container.textContent).toMatch(/Pick Battles/i);
  });
});
