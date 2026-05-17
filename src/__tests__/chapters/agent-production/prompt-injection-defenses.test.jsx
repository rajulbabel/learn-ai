import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PromptInjectionDefenses from "../../../chapters/agent-production/prompt-injection-defenses.jsx";

afterEach(() => cleanup());

describe("PromptInjectionDefenses (13.46)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(PromptInjectionDefenses(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists three attack types", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/direct/i);
    expect(container.textContent).toMatch(/indirect/i);
    expect(container.textContent).toMatch(/jailbreak/i);
    expect(container.textContent).toMatch(/Direct, Indirect, Jailbreak/i);
  });

  it("sub=1 shows direct injection example", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ignore.*previous|injection/i);
    expect(container.textContent).toMatch(/1000|refund/);
    expect(container.textContent).toMatch(/Direct Injection Attempt/i);
  });

  it("sub=2 shows indirect injection via KB", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/indirect|KB|poison/i);
    expect(container.textContent).toMatch(/feedback|index/i);
    expect(container.textContent).toMatch(/Bad Actor Plants Instructions In A Doc/i);
  });

  it("sub=3 shows instruction hierarchy", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hierarchy|tier|trust/i);
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/retrieved/i);
    expect(container.textContent).toMatch(/Instruction Hierarchy/i);
  });

  it("sub=4 shows tool whitelisting", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/whitelist|restrict|scope/i);
    expect(container.textContent).toMatch(/blast radius/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/Restrict What The Agent CAN Do/i);
  });

  it("sub=5 lists detection signals", () => {
    const { container } = render(PromptInjectionDefenses(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/detection|signal/i);
    expect(container.textContent).toMatch(/pattern|sequence|drift|spike/i);
    expect(container.textContent).toMatch(/What To Alert On/i);
  });
});
