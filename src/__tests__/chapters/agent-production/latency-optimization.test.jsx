import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LatencyOptimization from "../../../chapters/agent-production/latency-optimization.jsx";

afterEach(() => cleanup());

describe("LatencyOptimization (28.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LatencyOptimization(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows latency waterfall", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/latency|waterfall/i);
    expect(container.textContent).toMatch(/LLM call|tool/i);
    expect(container.textContent).toMatch(/Where The Seconds Go/i);
  });

  it("waterfall label clears the ms value for 4-digit spans", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 0 })));
    const texts = [...container.querySelectorAll("svg text")];
    const ms = texts.find((t) => t.textContent.trim() === "1200ms");
    const label = texts.find((t) => /Decide: Call lookup_customer/.test(t.textContent));
    expect(ms).toBeTruthy();
    expect(label).toBeTruthy();
    // 4-digit ms values render ~48px wide; the label must start far enough
    // right that "1200ms" and the label do not butt against each other.
    const gap = parseFloat(label.getAttribute("x")) - parseFloat(ms.getAttribute("x"));
    expect(gap).toBeGreaterThanOrEqual(54);
  });

  it("sub=1 explains streaming win", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/perceived|first token/i);
    expect(container.textContent).toMatch(/Show Progress Token By Token/i);
  });

  it("sub=2 references parallel tools (25.4)", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|concurrent/i);
    expect(container.textContent).toMatch(/25\.4/);
    expect(container.textContent).toMatch(/Run Independent Tools Concurrently/i);
  });

  it("sub=3 explains speculative execution", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/speculat/i);
    expect(container.textContent).toMatch(/wasted|tradeoff/i);
    expect(container.textContent).toMatch(/Run Likely Steps Before Confirming/i);
  });

  it("sub=4 shows result caching", () => {
    const { container } = render(LatencyOptimization(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/TTL|5 minutes|1 hour/i);
    expect(container.textContent).toMatch(/Cache What Doesn't Change/i);
  });
});
