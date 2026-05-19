import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BruteForceKNN from "../../../chapters/vector-foundations/brute-force-knn.jsx";

afterEach(() => cleanup());

describe("BruteForceKNN (15.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(BruteForceKNN(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 describes the compute-sort-return-k algorithm", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/compute.*similarit/i);
    expect(container.textContent).toMatch(/sort/i);
    expect(container.textContent).toMatch(/top-k|top k/i);
  });

  it("sub=1 runs brute-force on the 10-doc corpus with cosine", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/exact/i);
  });

  it("sub=1 top-3 matches 15.1's highlighted docs (1, 3, 7)", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toMatch(/1.*3.*7|docs? 1.*3.*7|top.*1.*3.*7/is);
  });

  it("sub=2 shows slowdown at N = 1 million", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1,000,000|1 million|1M/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=3 defines FLOPS with the chef-warehouse analogy", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/FLOPS/);
    expect(container.textContent).toMatch(/floating.?point|math.*per second|operations per second/i);
    expect(container.textContent).toMatch(/chef|warehouse|fetch|deliver/i);
  });

  it("sub=3 does NOT yet show the 1 billion hopeless math", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 3 })));
    expect(container.textContent).not.toMatch(/3\.072 TB/);
    expect(container.textContent).not.toMatch(/NOT FEASIBLE/);
  });

  it("sub=4 shows 3 TB memory math at 1 billion scale", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/3\.072 TB|3 TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/hopeless|not feasible|bottleneck/i);
  });

  it("sub=5 introduces ANN and recall as the metric", () => {
    const { container } = render(BruteForceKNN(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ANN|Approximate Nearest Neighbor/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/99%|0\.99/);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(BruteForceKNN(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
