import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SupervisorHierarchy from "../../../chapters/multi-agent/supervisor-hierarchy.jsx";

afterEach(() => cleanup());

describe("SupervisorHierarchy (13.32)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SupervisorHierarchy(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(SupervisorHierarchy(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(SupervisorHierarchy(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(SupervisorHierarchy(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(SupervisorHierarchy(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows the tree", () => {
    const { container } = render(SupervisorHierarchy(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tree|hierarch/i);
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/specialist|leaf/i);
    expect(container.textContent).toMatch(/Multiple Levels Of Delegation/i);
  });

  it("sub=1 shows supervisor role per level", () => {
    const { container } = render(SupervisorHierarchy(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/route|pick|children/i);
    expect(container.textContent).toMatch(/Each Supervisor: Plan/i);
  });

  it("sub=2 decides hierarchical vs orchestrator-worker", () => {
    const { container } = render(SupervisorHierarchy(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/sub.?domain|sub.?specialty/i);
    expect(container.textContent).toMatch(/Sub-Specialties/i);
  });

  it("sub=3 shows the support tree", () => {
    const { container } = render(SupervisorHierarchy(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/refund|invoice/i);
    expect(container.textContent).toMatch(/escalat/i);
    expect(container.textContent).toMatch(/Support Tree/i);
  });

  it("sub=4 shows escalation up the tree", () => {
    const { container } = render(SupervisorHierarchy(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/escalat/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/When To Escalate Up/i);
  });
});
