import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ChainOfThoughtSelfConsistency from "../../../chapters/agent-prompting/chain-of-thought-self-consistency.jsx";

afterEach(() => cleanup());

describe("ChainOfThoughtSelfConsistency (24.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts direct vs CoT answer", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain of thought|cot|step by step/i);
    expect(container.textContent).toMatch(/refund|prorat/i);
  });

  it("sub=1 shows the zero-shot CoT trigger", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/step by step/i);
  });

  it("sub=2 explains few-shot CoT", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/example/i);
  });

  it("sub=3 shows self-consistency vote", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/self.?consistency|vote|majority/i);
    expect(container.textContent).toMatch(/sample|n.?times|5/i);
  });

  it("sub=4 lists the cost / latency tradeoff", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|token/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/accuracy/i);
  });

  it("sub=5 indicates when to skip CoT and references Section 14.4", () => {
    const { container } = render(ChainOfThoughtSelfConsistency(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/skip|classif|lookup/i);
    expect(container.textContent).toMatch(/10\.4|thinking|reasoning model/i);
  });
});
