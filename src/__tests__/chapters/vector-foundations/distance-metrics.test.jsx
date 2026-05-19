import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DistanceMetrics from "../../../chapters/vector-foundations/distance-metrics.jsx";

afterEach(() => cleanup());

describe("DistanceMetrics (15.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DistanceMetrics(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists cosine, L2, inner product", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/inner product|dot product/i);
  });

  it("sub=1 defines cosine with range and concrete example", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/angle|\[-1, 1\]/);
  });

  it("sub=1 cosine table uses doc 7 (Kittens) as #2 cat exemplar - matches 15.2 top-3", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/doc 7/i);
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.9984");
    expect(container.textContent).not.toMatch(/doc 3 \(Lions/i);
  });

  it("sub=2 defines L2 as a distance with sqrt", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/sqrt|√/);
    expect(container.textContent).toMatch(/magnitude|smaller|distance/i);
  });

  it("sub=2 L2 table uses doc 7 (Kittens) as #2 cat exemplar - matches 15.2 top-3", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc 7/i);
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.057");
    expect(container.textContent).not.toMatch(/doc 3 \(Lions/i);
  });

  it("sub=3 highlights inner product speed and SIMD friendliness", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inner product|dot product/i);
    expect(container.textContent).toMatch(/SIMD|fastest|no sqrt/i);
  });

  it("sub=4 shows the normalization identity", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/normalized/i);
    expect(container.textContent).toMatch(/equivalent|identity|same/i);
  });

  it("sub=5 gives workload-to-metric guidance", () => {
    const { container } = render(DistanceMetrics(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/text|SBERT|OpenAI/i);
    expect(container.textContent).toMatch(/vision|image/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(DistanceMetrics(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
