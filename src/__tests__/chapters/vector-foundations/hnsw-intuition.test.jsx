import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HNSWIntuition from "../../../chapters/vector-foundations/hnsw-intuition.jsx";

afterEach(() => cleanup());

describe("HNSWIntuition (15.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HNSWIntuition(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces the flat proximity graph", () => {
    const { container } = render(HNSWIntuition(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/flat/i);
    expect(container.textContent).toMatch(/proximity/i);
    expect(container.textContent).toMatch(/M|nearest/);
  });

  it("sub=1 shows greedy-from-random-start is slow", () => {
    const { container } = render(HNSWIntuition(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/hop/i);
    expect(container.textContent).toMatch(/random|slow|many/i);
  });

  it("sub=2 introduces a sparse hub layer with long-range edges", () => {
    const { container } = render(HNSWIntuition(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/long[- ]?range|long distance|long-haul/i);
    expect(container.textContent).toMatch(/layer/i);
  });

  it("sub=3 derives O(log N) from stacked layers", () => {
    const { container } = render(HNSWIntuition(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/log\s*N|O\(log/i);
    expect(container.textContent).toMatch(/layer/i);
    expect(container.textContent).toMatch(/1,000,000|1M|20/);
  });

  it("sub=4 connects to the airport analogy", () => {
    const { container } = render(HNSWIntuition(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/airport/i);
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/international|regional|local/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 6; s++) {
      expect(() => render(HNSWIntuition(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
