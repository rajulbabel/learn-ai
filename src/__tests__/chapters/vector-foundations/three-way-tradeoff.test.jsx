import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ThreeWayTradeoff from "../../../chapters/vector-foundations/three-way-tradeoff.jsx";

afterEach(() => cleanup());

describe("ThreeWayTradeoff (15.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ThreeWayTradeoff(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces recall, latency, memory as the three axes", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/tradeoff|trade-off|trade off/i);
  });

  it("sub=1 defines recall@k with concrete 0.9 example", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall@k|recall@10/i);
    expect(container.textContent).toMatch(/0\.9|90%/);
  });

  it("sub=2 compares brute-force and HNSW latencies", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/100\s?ms/);
    expect(container.textContent).toMatch(/1\s?ms/);
    expect(container.textContent).toMatch(/HNSW/);
  });

  it("sub=3 shows per-vector memory math at d=768", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3 KB|3072 bytes/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=4 shows ef_search, compression, replica tradeoffs", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ef_search/);
    expect(container.textContent).toMatch(/PQ|compression/i);
    expect(container.textContent).toMatch(/replica|cache/i);
  });

  it("sub=4 glosses HNSW, codebook indices, and P99 so early readers are not lost", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HNSW.*graph|graph.*HNSW/i);
    expect(container.textContent).toMatch(/codebook.*(code|lookup|integer)|(code|integer).*codebook/i);
    expect(container.textContent).toMatch(/P99.*(99|percentile|worst)|percentile.*P99/i);
  });

  it("sub=5 frames every decision as a tradeoff-triangle move", () => {
    const { container } = render(ThreeWayTradeoff(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/algorithm/i);
    expect(container.textContent).toMatch(/quantization|PQ/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(ThreeWayTradeoff(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
