import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TraceEvals from "../../../chapters/agent-evals/trace-evals.jsx";

afterEach(() => cleanup());

describe("TraceEvals (13.40)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TraceEvals(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows trace as tree of steps", () => {
    const { container } = render(TraceEvals(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|step|grade/i);
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/Every Step Gets A Grade/i);
  });

  it("sub=1 locates the failing step in T4", () => {
    const { container } = render(TraceEvals(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/FAILED|wrong/i);
    expect(container.textContent).toMatch(/When A Step Fails, Where\?/i);
  });

  it("sub=2 shows per-step rubric", () => {
    const { container } = render(TraceEvals(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool choice|tool input/i);
    expect(container.textContent).toMatch(/result handling/i);
    expect(container.textContent).toMatch(/next.?step planning/i);
    expect(container.textContent).toMatch(/What To Score Per Step/i);
  });

  it("sub=3 shows the trace eval record shape", () => {
    const { container } = render(TraceEvals(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/trace_id|steps/i);
    expect(container.textContent).toMatch(/failure_mode|missed_escalation/i);
    expect(container.textContent).toMatch(/Trace Eval Record \(Shape\)/i);
  });

  it("sub=4 shows the cost of per-step grading", () => {
    const { container } = render(TraceEvals(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|N times|8x/i);
    expect(container.textContent).toMatch(/5%|sample/);
    expect(container.textContent).toMatch(/Per-Step Grading Is N x Expensive/i);
  });
});
