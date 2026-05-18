import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EvalSetsContinuous from "../../../chapters/agent-evals/eval-sets-continuous.jsx";

afterEach(() => cleanup());

describe("EvalSetsContinuous (13.41)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EvalSetsContinuous(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists golden / adversarial / regression", () => {
    const { container } = render(EvalSetsContinuous(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/adversarial/i);
    expect(container.textContent).toMatch(/regression/i);
    expect(container.textContent).toMatch(/Golden \+ Adversarial \+ Regression/i);
  });

  it("sub=1 explains eval-set freshness", () => {
    const { container } = render(EvalSetsContinuous(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stale|fresh/i);
    expect(container.textContent).toMatch(/quarter|month|10.20%/i);
    expect(container.textContent).toMatch(/Eval Set Goes Stale/i);
  });

  it("sub=2 shows online sampling", () => {
    const { container } = render(EvalSetsContinuous(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/online|sample/i);
    expect(container.textContent).toMatch(/1.5%|sampling/);
    expect(container.textContent).toMatch(/Grade A Slice Of Production/i);
  });

  it("sub=3 shows drift detection", () => {
    const { container } = render(EvalSetsContinuous(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/drift|signal|alert/i);
    expect(container.textContent).toMatch(/moving average|baseline/i);
    expect(container.textContent).toMatch(/Trigger When Quality Drops/i);
  });

  it("sub=4 closes with eval-first principle", () => {
    const { container } = render(EvalSetsContinuous(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/eval first|ship eval|before/i);
    expect(container.textContent).toMatch(/20 test cases/);
    expect(container.textContent).toMatch(/Build The Eval Set Before The Agent/i);
  });
});
