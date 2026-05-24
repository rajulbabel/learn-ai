import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhereNaiveRAGBreaks from "../../../chapters/rag-foundations/where-naive-rag-breaks.jsx";

afterEach(() => cleanup());

describe("WhereNaiveRAGBreaks (19.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(WhereNaiveRAGBreaks(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 lists the 7 failure modes", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/7|seven/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/citation|citation/i);
    expect(container.textContent).toMatch(/hallucinat/i);
  });

  it("sub=1 shows bad chunking on the password reset doc", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunking|chunk/i);
    expect(container.textContent).toMatch(/mid-?sentence|split/i);
    expect(container.textContent).toMatch(/20\.4-20\.10|chunking/i);
  });

  it("sub=2 shows low recall on sign-in vs log-in lexical mismatch", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/sign.?in/i);
    expect(container.textContent).toMatch(/21\.1-21\.8|hybrid|reranker|query.{0,20}transform/i);
  });

  it("sub=3 shows lost-in-the-middle attention U-curve", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/middle/i);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/22\.1-22\.3|context packing|lost.?in.?middle/i);
  });

  it("sub=4 shows missing citation on suspended account query", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/verify|verifiable/i);
    expect(container.textContent).toMatch(/22\.1-22\.3|citations|groundedness/i);
  });

  it("sub=5 shows hallucination on Pro vs Enterprise SSO", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/SSO/);
    expect(container.textContent).toMatch(/Pro|Enterprise/);
  });

  it("sub=6 shows stale index + cost/latency with Section 17.8 + chapter 23.6-23.10 references", () => {
    const { container } = render(WhereNaiveRAGBreaks(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/stale/i);
    expect(container.textContent).toMatch(/Section 17\.8|17\.8/);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/23\.6-23\.10|caching|observability/i);
  });
});
