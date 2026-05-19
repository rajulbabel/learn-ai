import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyEvalAgents from "../../../chapters/agent-evals/why-eval-agents.jsx";

afterEach(() => cleanup());

describe("WhyEvalAgents (28.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyEvalAgents(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists three reasons agents are harder", () => {
    const { container } = render(WhyEvalAgents(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/non.?determin/i);
    expect(container.textContent).toMatch(/multi.?step/i);
    expect(container.textContent).toMatch(/silent/i);
    expect(container.textContent).toMatch(/Three Reasons Agents Are Harder To Eval/i);
  });

  it("sub=1 shows production incident stories", () => {
    const { container } = render(WhyEvalAgents(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/production|incident/i);
    expect(container.textContent).toMatch(/unauthorized|wrong|leak|drift/i);
    expect(container.textContent).toMatch(/What Breaks When You Don.?t Eval/i);
  });

  it("sub=2 contrasts offline and online", () => {
    const { container } = render(WhyEvalAgents(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/offline/i);
    expect(container.textContent).toMatch(/online/i);
    expect(container.textContent).toMatch(/golden|sample|production/i);
    expect(container.textContent).toMatch(/Offline \(Before Ship\) vs Online \(After Ship\)/i);
  });

  it("sub=3 lists what humans must review", () => {
    const { container } = render(WhyEvalAgents(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/human/i);
    expect(container.textContent).toMatch(/tone|hallucin|drift/i);
    expect(container.textContent).toMatch(/Some Failure Modes Need Humans/i);
  });

  it("sub=4 previews the eval pipeline", () => {
    const { container } = render(WhyEvalAgents(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/pipeline|stages/i);
    expect(container.textContent).toMatch(/28\.[345]/);
    expect(container.textContent).toMatch(/What A Full Pipeline Looks Like/i);
  });
});
