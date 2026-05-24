import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ToolUseAsBridge from "../../../chapters/agent-tools/tool-use-as-bridge.jsx";

afterEach(() => cleanup());

describe("ToolUseAsBridge (25.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ToolUseAsBridge(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts pure LLM vs LLM with tools", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pure llm|llm only|without tools/i);
    expect(container.textContent).toMatch(/search_kb/i);
  });

  it("sub=1 defines tool as callable function", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/function/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=2 shows the three parts: name / description / parameters", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/parameter/i);
  });

  it("sub=3 explains the model-decides / runtime-executes split", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/tool_use|tool use/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=4 sketches the loop and references 26.3", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/loop|reason.?act.?observe/i);
    expect(container.textContent).toMatch(/26\.3/);
  });

  it("sub=5 enumerates the 8 canonical tools", () => {
    const { container } = render(ToolUseAsBridge(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/process_refund/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/send_email/i);
  });
});
