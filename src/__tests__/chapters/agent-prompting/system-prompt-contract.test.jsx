import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SystemPromptContract from "../../../chapters/agent-prompting/system-prompt-contract.jsx";

afterEach(() => cleanup());

describe("SystemPromptContract (24.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SystemPromptContract(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames system prompt as contract with four parts", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/contract/i);
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/constraint/i);
    expect(container.textContent).toMatch(/output rules/i);
  });

  it("sub=1 contrasts vague vs persona-specific prompt", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/customer.support/i);
  });

  it("sub=2 lists agent capabilities and tools", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/tools?|capabilit/i);
  });

  it("sub=3 enumerates constraints", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/never/i);
    expect(container.textContent).toMatch(/refund|\$200/i);
    expect(container.textContent).toMatch(/escalat/i);
  });

  it("sub=4 lists output rules", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cite|citation/i);
    expect(container.textContent).toMatch(/greet|follow.?up/i);
  });

  it("sub=5 shows full prompt template artifact", () => {
    const { container } = render(SystemPromptContract(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/you are/i);
    expect(container.textContent).toMatch(/tools|call/i);
    expect(container.textContent).toMatch(/never/i);
    expect(container.textContent).toMatch(/prompt template/i);
  });
});
