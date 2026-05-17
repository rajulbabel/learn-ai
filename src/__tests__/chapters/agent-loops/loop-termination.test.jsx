import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LoopTermination from "../../../chapters/agent-loops/loop-termination.jsx";

afterEach(() => cleanup());

describe("LoopTermination (13.23)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LoopTermination(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists the four stop conditions", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/max.?iter/i);
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/explicit stop|halt/i);
    expect(container.textContent).toMatch(/Four Ways A Loop Ends/i);
  });

  it("sub=1 shows success detection", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/final|answer|no more/i);
    expect(container.textContent).toMatch(/No More Tools Needed/i);
  });

  it("sub=2 shows max-iter cap", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/max iter/i);
    expect(container.textContent).toMatch(/10|20/);
    expect(container.textContent).toMatch(/Pay-To-Think/i);
  });

  it("sub=3 shows budget exhaustion", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/token|cost/i);
    expect(container.textContent).toMatch(/10x Per Iteration/i);
  });

  it("sub=4 shows explicit stop signal", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/halt|stop signal/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/"halt"/);
  });

  it("sub=5 shows fail-safe escalation", () => {
    const { container } = render(LoopTermination(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/fail.?safe/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/No Silent Failures/i);
  });
});
