import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HNSWSearch from "../../../chapters/vector-foundations/hnsw-search.jsx";

afterEach(() => cleanup());

describe("HNSWSearch (11.9)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HNSWSearch(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 starts the query at the top-layer entry point", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/entry point/i);
    expect(container.textContent).toMatch(/top/i);
    expect(container.textContent).toMatch(/layer/i);
  });

  it("sub=1 greedy-descends within the current layer", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/neighbor/i);
    expect(container.textContent).toMatch(/closer|distance/i);
  });

  it("sub=2 drops down when stuck on the current layer", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/drop/i);
    expect(container.textContent).toMatch(/layer/i);
    expect(container.textContent).toMatch(/0|next/i);
  });

  it("sub=3 switches to beam search with ef_search = 50 at layer 0", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/beam/i);
    expect(container.textContent).toMatch(/50|candidates/i);
  });

  it("sub=4 expands the beam until it stops improving", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/expand/i);
    expect(container.textContent).toMatch(/ef_search|queue/i);
    expect(container.textContent).toMatch(/top|best/i);
  });

  it("sub=5 returns top-k and traces the full path", () => {
    const { container } = render(HNSWSearch(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/top[- ]?k|top 3|top-10/i);
    expect(container.textContent).toMatch(/path|trace/i);
    expect(container.textContent).toMatch(/cat|1|3|7/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 7; s++) {
      expect(() => render(HNSWSearch(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
