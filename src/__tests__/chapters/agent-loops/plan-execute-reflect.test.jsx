import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PlanExecuteReflect from "../../../chapters/agent-loops/plan-execute-reflect.jsx";

afterEach(() => cleanup());

describe("PlanExecuteReflect (13.22)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(PlanExecuteReflect(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts plan-first vs reactive", () => {
    const { container } = render(PlanExecuteReflect(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/react/i);
    expect(container.textContent).toMatch(/up front|step by step|first/i);
    expect(container.textContent).toMatch(/Decide Up Front Or Step By Step/i);
  });

  it("sub=1 shows the plan tree", () => {
    const { container } = render(PlanExecuteReflect(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/tree/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/T4/);
  });

  it("sub=2 walks the leaves", () => {
    const { container } = render(PlanExecuteReflect(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/execute|leaf|leaves/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/business_rule/);
  });

  it("sub=3 shows reflection critique-revise", () => {
    const { container } = render(PlanExecuteReflect(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/reflect|critique/i);
    expect(container.textContent).toMatch(/revise/i);
    expect(container.textContent).toMatch(/score|grade/i);
    expect(container.textContent).toMatch(/Score < 7/);
  });

  it("sub=4 shows the decision matrix", () => {
    const { container } = render(PlanExecuteReflect(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/complex|simple/i);
    expect(container.textContent).toMatch(/audit/i);
    expect(container.textContent).toMatch(/plan|reflect|react/i);
    expect(container.textContent).toMatch(/Plan-Execute \+ Reflection/);
  });
});
