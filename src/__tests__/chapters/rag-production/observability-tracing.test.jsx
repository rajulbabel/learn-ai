import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ObservabilityTracing from "../../../chapters/rag-production/observability-tracing.jsx";

afterEach(() => cleanup());

describe("ObservabilityTracing (23.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(ObservabilityTracing(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 lists what goes wrong without traces", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|tracing/i);
    expect(container.textContent).toMatch(/latency|slow/i);
    expect(container.textContent).toMatch(/reproduce|model version/i);
  });

  it("sub=1 shows the canonical span tree", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/span|trace/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/generat/i);
    expect(container.textContent).toMatch(/ms/);
  });

  it("sub=2 enumerates per-stage attributes", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc[-_ ]?id/i);
    expect(container.textContent).toMatch(/model[ _]?version/i);
    expect(container.textContent).toMatch(/tokens/i);
  });

  it("sub=3 lists the tools landscape", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/LangSmith|Helicone|OpenTelemetry|Phoenix/);
  });

  it("sub=4 covers privacy and what not to log", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/privacy|GDPR|PII|hash|redact/i);
    expect(container.textContent).toMatch(/raw query|plain text|secret/i);
  });

  it("sub=5 mocks a production trace dashboard", () => {
    const { container } = render(ObservabilityTracing(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/P50|P99|latency/i);
  });
});
