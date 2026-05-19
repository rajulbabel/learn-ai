import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Guardrails from "../../../chapters/agent-production/guardrails.jsx";

afterEach(() => cleanup());

describe("Guardrails (28.9)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Guardrails(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows input/output pipeline", () => {
    const { container } = render(Guardrails(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/guardrail|filter/i);
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/output/i);
    expect(container.textContent).toMatch(/Filters Sit On Both Sides Of The Model/i);
  });

  it("sub=1 shows content classification", () => {
    const { container } = render(Guardrails(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/content|classification/i);
    expect(container.textContent).toMatch(/block|refuse|allow/i);
    expect(container.textContent).toMatch(/Block Disallowed Categories Before Model Sees It/i);
  });

  it("sub=2 explains PII redaction", () => {
    const { container } = render(Guardrails(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/PII|redact/i);
    expect(container.textContent).toMatch(/SSN|address/i);
    expect(container.textContent).toMatch(/Strip Personally Identifying Data/i);
  });

  it("sub=3 shows response validation", () => {
    const { container } = render(Guardrails(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/validat|schema/i);
    expect(container.textContent).toMatch(/24\.3|structured output/i);
    expect(container.textContent).toMatch(/Reject Outputs That Fail Schema/i);
  });

  it("sub=4 shows action gate for destructive tools", () => {
    const { container } = render(Guardrails(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/gate|approval/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/200|350|threshold/i);
    expect(container.textContent).toMatch(/Require Approval Before Destructive Tools/i);
  });
});
