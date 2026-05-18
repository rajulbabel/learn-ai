import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgentDecisionFramework from "../../../chapters/agent-production/agent-decision-framework.jsx";

afterEach(() => cleanup());

describe("AgentDecisionFramework (13.52) - CAPSTONE", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgentDecisionFramework(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the full decision stack", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/decision|stack/i);
    expect(container.textContent).toMatch(/13\.5|13\.18|13\.30/);
    expect(container.textContent).toMatch(/Every Choice Section 13 Taught You/i);
  });

  it("sub=1 introduces capstone use case", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/IT support|use case/i);
    expect(container.textContent).toMatch(/password|software|VPN|hardware/i);
    expect(container.textContent).toMatch(/Design An Agent For A New Use Case/i);
  });

  it("sub=2 picks approach / loop / memory", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/approach|agent/i);
    expect(container.textContent).toMatch(/workflow|loop/i);
    expect(container.textContent).toMatch(/working|episodic|semantic/i);
    expect(container.textContent).toMatch(/Pick Approach, Loop, Memory/i);
  });

  it("sub=3 picks multi-agent / tools", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/orchestrator|triage/i);
    expect(container.textContent).toMatch(/capability scope|tools/i);
    expect(container.textContent).toMatch(/Pick Multi-Agent, Tools/i);
  });

  it("sub=4 picks protocols / eval", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/eval/i);
    expect(container.textContent).toMatch(/judge|trace/i);
    expect(container.textContent).toMatch(/Pick Protocols, Eval Strategy/i);
  });

  it("sub=5 picks production / framework", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OTel|LangSmith|observabilit/i);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Pick Production Hardening, Framework/i);
  });

  it("sub=6 closes the section", () => {
    const { container } = render(AgentDecisionFramework(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/decide|diagnose|defend/i);
    expect(container.textContent).toMatch(/section 13|production|ship/i);
    expect(container.textContent).toMatch(/You Can Lead This Project Now/i);
  });
});
