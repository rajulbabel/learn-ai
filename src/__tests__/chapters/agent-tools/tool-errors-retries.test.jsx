import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ToolErrorsRetries from "../../../chapters/agent-tools/tool-errors-retries.jsx";

afterEach(() => cleanup());

describe("ToolErrorsRetries (25.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ToolErrorsRetries(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 enumerates the four error classes", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/transient/i);
    expect(container.textContent).toMatch(/permanent/i);
    expect(container.textContent).toMatch(/malformed/i);
    expect(container.textContent).toMatch(/business.?rule/i);
  });

  it("sub=1 shows the structured error return", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/is_error/i);
    expect(container.textContent).toMatch(/error_class|business_rule/i);
    expect(container.textContent).toMatch(/200/);
  });

  it("sub=2 lists the per-class retry policy", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/backoff/i);
    expect(container.textContent).toMatch(/transient/i);
  });

  it("sub=3 shows the validation layer", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/validat/i);
    expect(container.textContent).toMatch(/schema/i);
  });

  it("sub=4 explains idempotency", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/idempotenc/i);
    expect(container.textContent).toMatch(/key|double/i);
  });

  it("sub=5 traces ticket T4 with error recovery", () => {
    const { container } = render(ToolErrorsRetries(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/business.?rule/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/200|350/);
  });
});
