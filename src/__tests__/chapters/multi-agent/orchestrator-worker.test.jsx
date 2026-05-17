import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import OrchestratorWorker from "../../../chapters/multi-agent/orchestrator-worker.jsx";

afterEach(() => cleanup());

describe("OrchestratorWorker (13.31)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(OrchestratorWorker(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(OrchestratorWorker(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(OrchestratorWorker(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(OrchestratorWorker(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(OrchestratorWorker(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows topology", () => {
    const { container } = render(OrchestratorWorker(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/orchestrat|planner/i);
    expect(container.textContent).toMatch(/worker/i);
    expect(container.textContent).toMatch(/One Planner, N Workers/i);
  });

  it("sub=1 shows orchestrator phases", () => {
    const { container } = render(OrchestratorWorker(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/dispatch|send/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
    expect(container.textContent).toMatch(/Plan, Dispatch, Aggregate/i);
  });

  it("sub=2 shows worker role", () => {
    const { container } = render(OrchestratorWorker(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sub.?task/i);
    expect(container.textContent).toMatch(/don't talk|orchestrator/i);
    expect(container.textContent).toMatch(/Execute One Sub-Task/i);
  });

  it("sub=3 traces T3", () => {
    const { container } = render(OrchestratorWorker(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T3|ticket t3/i);
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/Trace: Ticket T3/i);
  });

  it("sub=4 lists aggregation patterns", () => {
    const { container } = render(OrchestratorWorker(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/concat|stitch/i);
    expect(container.textContent).toMatch(/vote|majority/i);
    expect(container.textContent).toMatch(/synthesis/i);
    expect(container.textContent).toMatch(/Three Ways To Aggregate/i);
  });
});
