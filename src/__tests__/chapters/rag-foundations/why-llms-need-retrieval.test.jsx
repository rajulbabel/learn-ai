import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyLLMsNeedRetrieval from "../../../chapters/rag-foundations/why-llms-need-retrieval.jsx";

afterEach(() => cleanup());

describe("WhyLLMsNeedRetrieval (12.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyLLMsNeedRetrieval(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyLLMsNeedRetrieval(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyLLMsNeedRetrieval(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhyLLMsNeedRetrieval(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WhyLLMsNeedRetrieval(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 lists bare-LLM production failure modes", () => {
    const { container } = render(WhyLLMsNeedRetrieval(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/knowledge cutoff/i);
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/private/i);
  });

  it("sub=1 contrasts fine-tuning vs RAG on cost/freshness/traceability", () => {
    const { container } = render(WhyLLMsNeedRetrieval(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fine-?tun/i);
    expect(container.textContent).toMatch(/freshness|fresh/i);
    expect(container.textContent).toMatch(/cite|trace|attribution/i);
  });

  it("sub=2 shows the 3-step RAG ground-the-answer flow", () => {
    const { container } = render(WhyLLMsNeedRetrieval(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/ground|anchor/i);
  });

  it("sub=3 shows side-by-side bare-LLM vs RAG on refund policy", () => {
    const { container } = render(WhyLLMsNeedRetrieval(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/made up|hallucinat|invent/i);
    expect(container.textContent).toMatch(/doc-?4|\[doc/i);
  });

  it("sub=4 lists the 5 production reasons", () => {
    const { container } = render(WhyLLMsNeedRetrieval(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/5 reasons|five reasons/i);
    expect(container.textContent).toMatch(/private data/i);
    expect(container.textContent).toMatch(/refresh/i);
  });
});
