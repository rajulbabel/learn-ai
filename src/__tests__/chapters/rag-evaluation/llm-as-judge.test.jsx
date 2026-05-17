import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LLMAsJudge from "../../../chapters/rag-evaluation/llm-as-judge.jsx";

afterEach(() => cleanup());

describe("LLMAsJudge (12.32)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(LLMAsJudge(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 compares human / heuristic / LLM-as-judge", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/human/i);
    expect(container.textContent).toMatch(/heuristic|BLEU/i);
    expect(container.textContent).toMatch(/judge/i);
  });

  it("sub=1 shows the judge prompt artifact with criteria + JSON schema", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/judge prompt/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/relevanc/i);
    expect(container.textContent).toMatch(/helpful/i);
    expect(container.textContent).toMatch(/\{(question|retrieved_context|generated_answer)\}/);
  });

  it("sub=2 defines a 1-5 rubric for a criterion", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rubric/i);
    expect(container.textContent).toMatch(/1[- ]?5|5[- ]?point|hallucinat|support/i);
  });

  it("sub=3 names position bias and the swap mitigation", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/position bias|position/i);
    expect(container.textContent).toMatch(/randomize|swap|order/i);
  });

  it("sub=4 names verbosity bias and the length mitigation", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/verbosity|length/i);
    expect(container.textContent).toMatch(/conciseness|normalis|weight/i);
  });

  it("sub=5 names self-preference bias and cross-family mitigation", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/self[- ]?preference|self.bias/i);
    expect(container.textContent).toMatch(/cross[- ]?family|third[- ]?party|different/i);
  });

  it("sub=6 covers calibration via human spot-check and judge-model selection", () => {
    const { container } = render(LLMAsJudge(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/calibrat/i);
    expect(container.textContent).toMatch(/spot[- ]?check|50|100|human/i);
    expect(container.textContent).toMatch(/agreement|correlation|0\.85/i);
    expect(container.textContent).toMatch(/stronger|cross[- ]?family|judge model/i);
  });
});
