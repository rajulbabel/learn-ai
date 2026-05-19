import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WorkflowVsAgent from "../../../chapters/agent-loops/workflow-vs-agent.jsx";

afterEach(() => cleanup());

describe("WorkflowVsAgent (26.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WorkflowVsAgent(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts DAG and loop", () => {
    const { container } = render(WorkflowVsAgent(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/dag|graph|fixed/i);
    expect(container.textContent).toMatch(/loop|open|variable/i);
    expect(container.textContent).toMatch(/Two Shapes Of Control/i);
  });

  it("sub=1 lists when workflow wins", () => {
    const { container } = render(WorkflowVsAgent(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/known|predict/i);
    expect(container.textContent).toMatch(/classif|route/i);
    expect(container.textContent).toMatch(/Always Those 3 Steps/i);
  });

  it("sub=2 lists when agent wins", () => {
    const { container } = render(WorkflowVsAgent(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/variable|decide/i);
    expect(container.textContent).toMatch(/2 Calls Or 20/i);
  });

  it("sub=3 shows the hybrid", () => {
    const { container } = render(WorkflowVsAgent(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/Handle Step Is An Agent/i);
  });

  it("sub=4 shows cost / reliability tradeoff", () => {
    const { container } = render(WorkflowVsAgent(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/predict|bound|variable/i);
    expect(container.textContent).toMatch(/Workflow When You Can/i);
  });
});
