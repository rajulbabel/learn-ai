import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Caching from "../../../chapters/rag-production/caching.jsx";

afterEach(() => cleanup());

describe("Caching (12.36)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Caching(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows per-query cost stack and QPS scale", () => {
    const { container } = render(Caching(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d+/);
  });

  it("sub=1 shows prompt cache prefix/suffix split and 90% discount", () => {
    const { container } = render(Caching(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/prompt cache|cached prefix|prefix/i);
    expect(container.textContent).toMatch(/90%|85%|5 min|TTL/i);
    expect(container.textContent).toMatch(/fresh/i);
  });

  it("sub=2 contrasts prompt-cache hits vs misses", () => {
    const { container } = render(Caching(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent|multi-?turn|stable/i);
    expect(container.textContent).toMatch(/miss|cold/i);
  });

  it("sub=3 shows semantic cache cosine flow with example scores", () => {
    const { container } = render(Caching(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/cosine|similarity/i);
    expect(container.textContent).toMatch(/0\.9\d|threshold/i);
  });

  it("sub=4 covers eviction, invalidation, and false-hit risk", () => {
    const { container } = render(Caching(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LRU|eviction/i);
    expect(container.textContent).toMatch(/invalidat/i);
    expect(container.textContent).toMatch(/false[- ]hit/i);
  });

  it("sub=5 shows combined prompt + semantic cache savings", () => {
    const { container } = render(Caching(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/combined|stack|both/i);
    expect(container.textContent).toMatch(/\$0?\.\d+/);
    expect(container.textContent).toMatch(/%|savings/i);
  });
});
