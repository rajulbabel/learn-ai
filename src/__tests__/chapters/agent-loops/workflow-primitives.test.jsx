import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WorkflowPrimitives from "../../../chapters/agent-loops/workflow-primitives.jsx";

afterEach(() => cleanup());

describe("WorkflowPrimitives (26.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WorkflowPrimitives(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names the three primitives", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/Chain, Route, Parallelize/i);
  });

  it("sub=1 shows chaining with structured output", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/structured|json|output/i);
    expect(container.textContent).toMatch(/category/i);
  });

  it("sub=2 explains routing with intent classification", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/intent|classif/i);
    expect(container.textContent).toMatch(/24\.3|few.?shot/i);
    expect(container.textContent).toMatch(/Section 24\.3|24\.3/);
  });

  it("sub=3 shows parallelization fan-out", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parallel|fan.?out/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
    expect(container.textContent).toMatch(/max.*worker/i);
  });

  it("sub=4 shows composing primitives", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/compos|stack|combine/i);
    expect(container.textContent).toMatch(/all three/i);
  });

  it("sub=5 maps support-agent workflow", () => {
    const { container } = render(WorkflowPrimitives(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/troubl|escalat/i);
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/lookup_subscription/);
  });
});
