import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LangGraphFramework from "../../../chapters/agent-production/lang-graph-framework.jsx";

afterEach(() => cleanup());

describe("LangGraphFramework (13.48)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LangGraphFramework(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces stateful graph model", () => {
    const { container } = render(LangGraphFramework(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/state|graph/i);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Agents As Stateful Graphs/i);
  });

  it("sub=1 shows node / edge / state shape", () => {
    const { container } = render(LangGraphFramework(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/add_node|add_edge/);
    expect(container.textContent).toMatch(/state|ticket|customer/i);
    expect(container.textContent).toMatch(/Three Primitives/i);
  });

  it("sub=2 shows conditional edges", () => {
    const { container } = render(LangGraphFramework(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/conditional|branch/i);
    expect(container.textContent).toMatch(/billing|troubleshooting/i);
    expect(container.textContent).toMatch(/Branching Based On State/i);
  });

  it("sub=3 explains checkpoints", () => {
    const { container } = render(LangGraphFramework(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/checkpoint|persist/i);
    expect(container.textContent).toMatch(/async|long.?running|human.?in.?the.?loop/i);
    expect(container.textContent).toMatch(/Persistent State Between Calls/i);
  });

  it("sub=4 lists when LangGraph fits", () => {
    const { container } = render(LangGraphFramework(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/directed graph|state|visualiz/i);
    expect(container.textContent).toMatch(/Use LangGraph When/i);
  });
});
