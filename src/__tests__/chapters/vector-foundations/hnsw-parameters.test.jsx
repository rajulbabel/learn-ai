import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HNSWParameters from "../../../chapters/vector-foundations/hnsw-parameters.jsx";

afterEach(() => cleanup());

describe("HNSWParameters (15.10)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HNSWParameters(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces the three knobs with defaults", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/M/);
    expect(container.textContent).toMatch(/ef_construction/i);
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/16/);
    expect(container.textContent).toMatch(/200/);
    expect(container.textContent).toMatch(/50/);
  });

  it("sub=1 shows M controls recall-memory tradeoff", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/M/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/memory|byte/i);
  });

  it("sub=2 covers ef_construction as build-time quality vs build time", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ef_construction/i);
    expect(container.textContent).toMatch(/build/i);
  });

  it("sub=3 shows ef_search as the main query-time dial", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/latency|ms/i);
  });

  it("sub=4 shows recall curves at M = 8, 16, 32", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/M\s*=\s*8|M = 8/);
    expect(container.textContent).toMatch(/M\s*=\s*16/);
    expect(container.textContent).toMatch(/M\s*=\s*32/);
    expect(container.textContent).toMatch(/curve|recall/i);
  });

  it("sub=5 shows memory math and a raise-this-parameter playbook", () => {
    const { container } = render(HNSWParameters(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/100M|100,000,000|320 GB/);
    expect(container.textContent).toMatch(/playbook|raise|lower/i);
    expect(container.textContent).toMatch(/ef_search/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(HNSWParameters(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
