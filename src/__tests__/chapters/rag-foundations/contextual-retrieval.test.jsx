import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ContextualRetrieval from "../../../chapters/rag-foundations/contextual-retrieval.jsx";

afterEach(() => cleanup());

describe("ContextualRetrieval (12.12)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(ContextualRetrieval(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 shows the orphan-chunk identical-text problem", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/click Save|Save to confirm/i);
    expect(container.textContent).toMatch(/email/i);
    expect(container.textContent).toMatch(/identical|same|indistinguishable|nearly/i);
  });

  it("sub=1 prepends an LLM-generated context line", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context/i);
    expect(container.textContent).toMatch(/prepend|prefix/i);
    expect(container.textContent).toMatch(/LLM[- ]?generated|generated/i);
  });

  it("sub=2 shows the augmentation prompt template with cost note", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/\{chunk\}|\{document_title\}/);
    expect(container.textContent).toMatch(/Haiku|cheap model|cost/i);
    expect(container.textContent).toMatch(/\$0\.001|\$100/);
  });

  it("sub=3 contrasts recall@1 before vs after augmentation", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall|augment/i);
    expect(container.textContent).toMatch(/33%|100%/);
  });

  it("sub=4 cites Anthropic's 2024 49% improvement", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Anthropic/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/49%|49 percent/);
    expect(container.textContent).toMatch(/BM25|hybrid|rerank/i);
  });

  it("sub=5 lists when contextual retrieval is overkill", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/overkill|skip|when not/i);
    expect(container.textContent).toMatch(/homogeneous/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=6 stacks contextual + hybrid + reranker with Section 11 refs", () => {
    const { container } = render(ContextualRetrieval(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Section 11\.24|11\.24/);
    expect(container.textContent).toMatch(/Section 11\.25|11\.25/);
    expect(container.textContent).toMatch(/67%|combined/);
  });
});
