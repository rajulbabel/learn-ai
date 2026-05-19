import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CrewAiAutoGen from "../../../chapters/agent-production/crew-ai-auto-gen.jsx";

afterEach(() => cleanup());

describe("CrewAiAutoGen (28.13)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CrewAiAutoGen(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts role-based and conversational", () => {
    const { container } = render(CrewAiAutoGen(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/CrewAI/);
    expect(container.textContent).toMatch(/AutoGen/);
    expect(container.textContent).toMatch(/role|goal|conversation/i);
    expect(container.textContent).toMatch(/Two Multi-Agent Styles/i);
  });

  it("sub=1 shows CrewAI shape", () => {
    const { container } = render(CrewAiAutoGen(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/CrewAI|Agent|Crew/);
    expect(container.textContent).toMatch(/Triage|Billing/);
    expect(container.textContent).toMatch(/role|goal|tools/i);
    expect(container.textContent).toMatch(/CrewAI: Roles \+ Goals/i);
  });

  it("sub=2 shows AutoGen shape", () => {
    const { container } = render(CrewAiAutoGen(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/AutoGen|AssistantAgent|GroupChat/);
    expect(container.textContent).toMatch(/system_message/i);
    expect(container.textContent).toMatch(/AutoGen: Conversational Agents/i);
  });

  it("sub=3 traces T4 in both styles", () => {
    const { container } = render(CrewAiAutoGen(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage|billing|escalation/i);
    expect(container.textContent).toMatch(/Same Ticket, Two Frameworks/i);
  });

  it("sub=4 explains when each fits", () => {
    const { container } = render(CrewAiAutoGen(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/CrewAI|AutoGen/);
    expect(container.textContent).toMatch(/role|conversation/i);
    expect(container.textContent).toMatch(/Pick The Abstraction That Matches Your Mental Model/i);
  });
});
