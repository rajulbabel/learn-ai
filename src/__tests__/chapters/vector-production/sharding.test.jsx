import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Sharding from "../../../chapters/vector-production/sharding.jsx";

afterEach(() => cleanup());

describe("Sharding (11.22)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames the single-node limit", () => {
    const { container } = render(Sharding(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/100M|100 million|r7i/i);
    expect(container.textContent).toMatch(/single[- ]?node|one node/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 describes random sharding with round-robin", () => {
    const { container } = render(Sharding(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/random/i);
    expect(container.textContent).toMatch(/round[- ]?robin|hash/i);
    expect(container.textContent).toMatch(/fan[- ]?out|all shards/i);
  });

  it("sub=1 random sharding diagram: q on top, 4 shards in a horizontal row below", () => {
    const { container } = render(Sharding(makeCtx({ sub: 1 })));
    const svg = container.querySelector('svg[viewBox^="0 0 520"]');
    expect(svg).toBeTruthy();
    const qCircle = svg.querySelector("circle[r='14']");
    const shardRects = Array.from(svg.querySelectorAll("rect"));
    expect(shardRects.length).toBe(4);
    const ys = shardRects.map((r) => Number(r.getAttribute("y")));
    expect(new Set(ys).size).toBe(1);
    const shardY = ys[0];
    expect(Number(qCircle.getAttribute("cy"))).toBeLessThan(shardY);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 explains semantic sharding by IVF cluster", () => {
    const { container } = render(Sharding(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/semantic|cluster/i);
    expect(container.textContent).toMatch(/IVF|region|subset/i);
  });

  it("sub=2 semantic sharding diagram: q on top, 4 shards in a horizontal row below", () => {
    const { container } = render(Sharding(makeCtx({ sub: 2 })));
    const svg = container.querySelector('svg[viewBox^="0 0 520"]');
    expect(svg).toBeTruthy();
    const qCircle = svg.querySelector("circle[r='14']");
    const shardRects = Array.from(svg.querySelectorAll("rect"));
    expect(shardRects.length).toBe(4);
    const ys = shardRects.map((r) => Number(r.getAttribute("y")));
    expect(new Set(ys).size).toBe(1);
    const shardY = ys[0];
    expect(Number(qCircle.getAttribute("cy"))).toBeLessThan(shardY);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 shows fan-out to shards and coordinator merge", () => {
    const { container } = render(Sharding(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/fan[- ]?out/i);
    expect(container.textContent).toMatch(/coordinator|merge/i);
    expect(container.textContent).toMatch(/top[- ]?k|top-10|top-20/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 explains recall math via per-shard buffer", () => {
    const { container } = render(Sharding(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/merge/i);
    expect(container.textContent).toMatch(/buffer|top-20|top-50/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Sharding(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 prunes shards by filter predicate", () => {
    const { container } = render(Sharding(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/shard/i);
    expect(container.textContent).toMatch(/prune|skip/i);
  });
});
