import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AgentObservabilityTracing from "../../../chapters/agent-production/agent-observability-tracing.jsx";

afterEach(() => cleanup());

describe("AgentObservabilityTracing (13.42)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AgentObservabilityTracing(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows span tree", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/span|tree/i);
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/An Agent Run Is A Tree Of Spans/i);
  });

  it("sub=1 shows OTel span shape", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/OpenTelemetry|OTel/i);
    expect(container.textContent).toMatch(/trace_id|span_id/i);
    expect(container.textContent).toMatch(/Span \(Shape\)/i);
  });

  it("sub=2 compares LangSmith / Weave / Phoenix", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LangSmith/);
    expect(container.textContent).toMatch(/Weave/);
    expect(container.textContent).toMatch(/Phoenix/);
    expect(container.textContent).toMatch(/Three Vendors, Same Concepts/i);
  });

  it("sub=3 lists per-span metadata", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/metadata|attribute/i);
    expect(container.textContent).toMatch(/tokens|cost|tool name/i);
    expect(container.textContent).toMatch(/What To Attribute/i);
  });

  it("sub=4 shows cost overlay", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/0\.0[2-9]|0\.09/);
    expect(container.textContent).toMatch(/Full T2 Trace With Cost/i);
  });

  it("sub=5 shows alerting from traces", () => {
    const { container } = render(AgentObservabilityTracing(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/alert|threshold/i);
    expect(container.textContent).toMatch(/13\.41|drift/);
    expect(container.textContent).toMatch(/Turn Traces Into Alerts/i);
  });
});
