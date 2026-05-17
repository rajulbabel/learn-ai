import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyMultiAgent from "../../../chapters/multi-agent/why-multi-agent.jsx";

afterEach(() => cleanup());

describe("WhyMultiAgent (13.30)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyMultiAgent(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyMultiAgent(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyMultiAgent(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhyMultiAgent(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WhyMultiAgent(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows single-agent ceiling", () => {
    const { container } = render(WhyMultiAgent(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/single|one agent|ceiling/i);
    expect(container.textContent).toMatch(/Why One Agent Sometimes Isn/i);
  });

  it("sub=1 explains specialization", () => {
    const { container } = render(WhyMultiAgent(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/specializ/i);
    expect(container.textContent).toMatch(/billing|trouble|triage/i);
    expect(container.textContent).toMatch(/One Agent Per Role/i);
  });

  it("sub=2 shows parallelism", () => {
    const { container } = render(WhyMultiAgent(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|concurrent/i);
    expect(container.textContent).toMatch(/lookup_customer|lookup_subscription/);
    expect(container.textContent).toMatch(/Run Independent Tasks At The Same Time/i);
  });

  it("sub=3 shows planner / worker", () => {
    const { container } = render(WhyMultiAgent(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/planner|worker/i);
    expect(container.textContent).toMatch(/decompos|break/i);
    expect(container.textContent).toMatch(/Planner vs Worker/i);
  });

  it("sub=4 lists when multi-agent hurts", () => {
    const { container } = render(WhyMultiAgent(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hurt|anti.?pattern|not/i);
    expect(container.textContent).toMatch(/13\.35|failure/);
    expect(container.textContent).toMatch(/Don.t Multi-Agent A Small Problem/i);
  });
});
