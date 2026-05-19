import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ToolCallLifecycle from "../../../chapters/agent-tools/tool-call-lifecycle.jsx";

afterEach(() => cleanup());

describe("ToolCallLifecycle (25.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ToolCallLifecycle(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the swim-lane overview", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/model/i);
    expect(container.textContent).toMatch(/runtime/i);
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/tool_result/i);
  });

  it("sub=1 shows the tool_use message shape", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/reset_password/i);
  });

  it("sub=2 shows the tool_result message shape", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool_result/i);
    expect(container.textContent).toMatch(/tool_use_id/i);
    expect(container.textContent).toMatch(/is_error/i);
  });

  it("sub=3 traces ticket T1 end to end", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/reset_password/i);
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
  });

  it("sub=4 explains streaming + tool calls", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/tool_use|tool block/i);
  });

  it("sub=5 shows the latency budget", () => {
    const { container } = render(ToolCallLifecycle(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/llm call|model/i);
  });
});
