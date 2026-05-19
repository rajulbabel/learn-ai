import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ParallelToolsAndChoice from "../../../chapters/agent-tools/parallel-tools-and-choice.jsx";

afterEach(() => cleanup());

describe("ParallelToolsAndChoice (25.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ParallelToolsAndChoice(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts serial vs parallel timeline", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/serial/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
  });

  it("sub=1 explains when to parallelize", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/independent/i);
    expect(container.textContent).toMatch(/dependent/i);
  });

  it("sub=2 explains tool_choice auto", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool.?choice/i);
    expect(container.textContent).toMatch(/auto/i);
  });

  it("sub=3 lists all four tool_choice modes", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/auto/i);
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/none/i);
    expect(container.textContent).toMatch(/specific|force/i);
  });

  it("sub=4 shows the latency savings number", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/savings|saving|faster/i);
  });

  it("sub=5 traces ticket T2 with parallel lookups", () => {
    const { container } = render(ParallelToolsAndChoice(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_subscription/i);
  });
});
