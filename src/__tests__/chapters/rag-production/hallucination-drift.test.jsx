import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HallucinationDrift from "../../../chapters/rag-production/hallucination-drift.jsx";

afterEach(() => cleanup());

describe("HallucinationDrift (12.39)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(HallucinationDrift(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 lists hallucination signals", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/refusal/i);
    expect(container.textContent).toMatch(/out[- ]of[- ]index|hallucinat/i);
  });

  it("sub=1 names the 4 drift types", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/data drift/i);
    expect(container.textContent).toMatch(/embedding drift/i);
    expect(container.textContent).toMatch(/eval drift/i);
    expect(container.textContent).toMatch(/distribution drift/i);
  });

  it("sub=2 shows the hallucination detection pipeline with claim extraction", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/claim/i);
    expect(container.textContent).toMatch(/supported|unsupported/i);
    expect(container.textContent).toMatch(/faithfulness/i);
  });

  it("sub=3 shows metric-over-time chart with thresholds", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/30 days|over time|days/i);
    expect(container.textContent).toMatch(/threshold|alert/i);
  });

  it("sub=4 shows an alert payload with example queries", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alert/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/example|query/i);
    expect(container.textContent).toMatch(/doc-?\d/i);
  });

  it("sub=5 mocks the full hallucination + drift dashboard", () => {
    const { container } = render(HallucinationDrift(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard|panel/i);
    expect(container.textContent).toMatch(/drift|hallucinat/i);
  });
});
