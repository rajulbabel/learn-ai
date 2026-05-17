import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HNSWConstruction from "../../../chapters/vector-foundations/hnsw-construction.jsx";

afterEach(() => cleanup());

describe("HNSWConstruction (11.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HNSWConstruction(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 inserts the first vector as the entry point", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/empty|first/i);
    expect(container.textContent).toMatch(/entry point/i);
  });

  it("sub=1 shows the real layer-assignment formula with ln and mL", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/floor/i);
    expect(container.textContent).toMatch(/ln|log/i);
    expect(container.textContent).toMatch(/uniform/i);
    expect(container.textContent).toMatch(/mL/);
  });

  it("sub=2 shows the exponential decay with ~94% at layer 0", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/layer 0/i);
    expect(container.textContent).toMatch(/94%|93%|95%|most/i);
    expect(container.textContent).toMatch(/exponential/i);
  });

  it("sub=3 describes greedy M-nearest insertion with ef_construction", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/M nearest|nearest M/i);
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/edges?/i);
    expect(container.textContent).toMatch(/ef_construction/i);
  });

  it("sub=4 walks the insertion of all 10 cat-corpus docs", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/10/);
    expect(container.textContent).toMatch(/cats|kittens|cat sat|dog/i);
    expect(container.textContent).toMatch(/layer|L\s*=/i);
  });

  it("sub=5 gives M = 16 and the per-vector memory math", () => {
    const { container } = render(HNSWConstruction(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/M\s*=\s*16|M = 16/);
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/70|bytes per vector|bytes\/vector/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(HNSWConstruction(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
