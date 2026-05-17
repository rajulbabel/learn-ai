import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PromptVsTuneVsRagVsAgent from "../../../chapters/agent-prompting/prompt-vs-tune-vs-rag-vs-agent.jsx";

afterEach(() => cleanup());

describe("PromptVsTuneVsRagVsAgent (13.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists four approaches", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/fine.?tun/i);
    expect(container.textContent).toMatch(/rag/i);
    expect(container.textContent).toMatch(/agent/i);
  });

  it("sub=1 axes on data freshness", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fresh/i);
    expect(container.textContent).toMatch(/data/i);
  });

  it("sub=2 axes on capability gap", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|skill|gap/i);
  });

  it("sub=3 covers latency and cost", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
  });

  it("sub=4 shows the decision tree", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/action|tool/i);
  });

  it("sub=5 shows the stack pattern", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/stack|combine|layer/i);
  });

  it("sub=6 lists anti-patterns", () => {
    const { container } = render(PromptVsTuneVsRagVsAgent(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/anti.?pattern|misuse|wrong/i);
  });
});
