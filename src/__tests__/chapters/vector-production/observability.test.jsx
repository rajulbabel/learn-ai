import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Observability from "../../../chapters/vector-production/observability.jsx";

afterEach(() => cleanup());

describe("Observability (17.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 covers P50/P95/P99 latency tails", () => {
    const { container } = render(Observability(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/P50|P95|P99/);
    expect(container.textContent).toMatch(/tail/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 describes recall@k ground-truth sampling", () => {
    const { container } = render(Observability(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/sample|ground[- ]?truth/i);
    expect(container.textContent).toMatch(/compare|brute[- ]?force/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 discusses per-query cache and CPU telemetry", () => {
    const { container } = render(Observability(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cache/i);
    expect(container.textContent).toMatch(/hit rate|cache hit/i);
    expect(container.textContent).toMatch(/memory|pages|CPU/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 explains ANN-Benchmarks methodology", () => {
    const { container } = render(Observability(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ANN[- ]?Benchmarks|ann-benchmarks/i);
    expect(container.textContent).toMatch(/QPS|queries per second/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 lays out alert vs watch dashboard", () => {
    const { container } = render(Observability(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/dashboard|Grafana|panel/i);
    expect(container.textContent).toMatch(/alert|watch/i);
    expect(container.textContent).toMatch(/P99|recall@10/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Observability(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 reminds about unmeasured metrics", () => {
    const { container } = render(Observability(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/tenant|cold[- ]?start|per-tenant/i);
    expect(container.textContent).toMatch(/checklist|capture|measure/i);
  });
});
