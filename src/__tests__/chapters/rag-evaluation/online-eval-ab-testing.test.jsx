import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import OnlineEvalABTesting from "../../../chapters/rag-evaluation/online-eval-ab-testing.jsx";

afterEach(() => cleanup());

describe("OnlineEvalABTesting (12.35)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(OnlineEvalABTesting(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 contrasts offline vs online eval", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/offline/i);
    expect(container.textContent).toMatch(/online/i);
    expect(container.textContent).toMatch(/production|real user/i);
  });

  it("sub=1 lists implicit signals", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/implicit/i);
    expect(container.textContent).toMatch(/thumb|dwell|copy[- ]?paste|rephrase/i);
  });

  it("sub=2 covers explicit feedback with privacy note", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/explicit/i);
    expect(container.textContent).toMatch(/rating|thumb|feedback|star/i);
    expect(container.textContent).toMatch(/privacy|PII|redact|GDPR/i);
  });

  it("sub=3 explains shadow eval", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/shadow/i);
    expect(container.textContent).toMatch(/alongside|log|without serving|without affecting/i);
    expect(container.textContent).toMatch(/judge|rubric|production traffic/i);
  });

  it("sub=4 explains A/B with rubric judging and guardrails", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/A\/B|split traffic/i);
    expect(container.textContent).toMatch(/rubric|judge/i);
    expect(container.textContent).toMatch(/significan|p[- ]?value|statistical/i);
    expect(container.textContent).toMatch(/guardrail|rollback|monitor/i);
  });

  it("sub=5 closes the offline-online loop", () => {
    const { container } = render(OnlineEvalABTesting(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/loop|cycle|feedback/i);
    expect(container.textContent).toMatch(/regression|capture/i);
    expect(container.textContent).toMatch(/shadow|A\/B|golden|RAGAS|judge/i);
  });
});
