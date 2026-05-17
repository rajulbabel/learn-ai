import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LlmAsJudge from "../../../chapters/agent-evals/llm-as-judge.jsx";

afterEach(() => cleanup());

describe("LlmAsJudge (13.39)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LlmAsJudge(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts pairwise and scalar", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pairwise/i);
    expect(container.textContent).toMatch(/scalar/i);
    expect(container.textContent).toMatch(/Two Ways To Grade/i);
  });

  it("sub=1 shows the rubric", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rubric|criteria/i);
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/completeness/i);
    expect(container.textContent).toMatch(/tone/i);
    expect(container.textContent).toMatch(/Tell The Judge What To Score On/i);
  });

  it("sub=2 lists three biases", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/length bias/i);
    expect(container.textContent).toMatch(/position bias/i);
    expect(container.textContent).toMatch(/self.?preference/i);
    expect(container.textContent).toMatch(/What The Judge Gets Wrong/i);
  });

  it("sub=3 shows calibration with humans", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/calibrat|human/i);
    expect(container.textContent).toMatch(/correlation|0\.7/);
    expect(container.textContent).toMatch(/Trust But Verify/i);
  });

  it("sub=4 shows the judge prompt artifact", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/judge|eval rubric/i);
    expect(container.textContent).toMatch(/JSON|machine.?readable/i);
    expect(container.textContent).toMatch(/Canonical Judge Prompt/i);
  });

  it("sub=5 back-references Section 12.32", () => {
    const { container } = render(LlmAsJudge(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/12\.32|section 12/i);
    expect(container.textContent).toMatch(/RAG|faithfulness|answer.relevance/i);
    expect(container.textContent).toMatch(/Same Technique, Agent Scope/i);
  });
});
