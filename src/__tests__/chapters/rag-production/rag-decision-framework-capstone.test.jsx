import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RAGDecisionFrameworkCapstone from "../../../chapters/rag-production/rag-decision-framework-capstone.jsx";

afterEach(() => cleanup());

describe("RAGDecisionFrameworkCapstone (12.41)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("renders at sub=7 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 7 })))).not.toThrow();
  });

  it("renders at sub=8 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 8 })))).not.toThrow();
  });

  it("renders at sub=9 without throwing", () => {
    expect(() => render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 9 })))).not.toThrow();
  });

  it("sub=0 shows the complete decision framework spanning every act", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/chunking/i);
    expect(container.textContent).toMatch(/embedding|embed/i);
    expect(container.textContent).toMatch(/evaluat|eval/i);
    expect(container.textContent).toMatch(/production|operations/i);
  });

  it("sub=1 introduces the legal case-law capstone", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/case law|legal|Q&A/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/200,?000|cases/i);
    expect(container.textContent).toMatch(/\$0?\.05|cost/i);
  });

  it("sub=2 chooses hierarchical + contextual chunking", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical|contextual/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/12\.[89]/);
  });

  it("sub=3 chooses domain-adapted embedding + hybrid + jurisdiction filter + cross-encoder rerank", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/domain[- ]adapt/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/rerank|cross-encoder/i);
  });

  it("sub=4 chooses multi-query + decomposition, skips HyDE", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-query|decomposition/i);
    expect(container.textContent).toMatch(/HyDE/);
    expect(container.textContent).toMatch(/12\.1[78]/);
  });

  it("sub=5 chooses high-token-budget sandwich pack + mandatory citations + refusal", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/token budget|16k|30k|context/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/I don'?t have|refusal|refuse/i);
  });

  it("sub=6 chooses GraphRAG + multi-hop, skips long-context", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/GraphRAG/);
    expect(container.textContent).toMatch(/multi-hop/i);
    expect(container.textContent).toMatch(/long[- ]context|12\.27/i);
  });

  it("sub=7 chooses LLM-as-judge + golden dataset + RAGAS + online A/B", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/LLM-as-judge|judge/i);
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/RAGAS|faithfulness/i);
  });

  it("sub=8 disables semantic cache, enables prompt cache + tracing + hallucination detection + drift", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/prompt cache/i);
    expect(container.textContent).toMatch(/tracing/i);
    expect(container.textContent).toMatch(/hallucinat|drift/i);
  });

  it("sub=9 closes with the complete capstone stack and framework choice", () => {
    const { container } = render(RAGDecisionFrameworkCapstone(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/stack|capstone|putting it all together/i);
    expect(container.textContent).toMatch(/no framework|LlamaIndex|12\.37/i);
    expect(container.textContent).toMatch(/chunking|embedding|retrieval|rerank|generate|eval/i);
  });
});
