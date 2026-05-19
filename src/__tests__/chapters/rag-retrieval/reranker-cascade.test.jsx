import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RerankerCascade from "../../../chapters/rag-retrieval/reranker-cascade.jsx";

afterEach(() => cleanup());

describe("RerankerCascade (21.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RerankerCascade(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(RerankerCascade(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(RerankerCascade(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(RerankerCascade(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(RerankerCascade(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 recaps Section 17.6 cross-encoder", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Section 17\.6|17\.6/);
    expect(container.textContent).toMatch(/cross-?encoder|reranker/i);
    expect(container.textContent).toMatch(/cascade|stage/i);
  });

  it("sub=1 shows the 3-stage funnel with top-50, top-10, top-3", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector/i);
    expect(container.textContent).toMatch(/reranker|cross-?encoder/i);
    expect(container.textContent).toMatch(/LLM/);
    expect(container.textContent).toMatch(/50/);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=1 bottom funnel stage is wide enough for the 'LLM Reads Top-3 + Generates' title", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 1 })));
    const polys = container.querySelectorAll("svg polygon");
    expect(polys.length).toBeGreaterThanOrEqual(3);
    const trapezoids = Array.from(polys).filter((p) => p.getAttribute("points").split(" ").length === 4);
    expect(trapezoids.length).toBe(3);
    const stage3 = trapezoids[2];
    const pts = stage3
      .getAttribute("points")
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(",").map(Number));
    const [topLeft, topRight] = [pts[0], pts[1]];
    const topWidth = topRight[0] - topLeft[0];
    expect(topWidth).toBeGreaterThanOrEqual(300);
  });

  it("sub=2 shows the latency budget 30 + 80 + 800 = ~910ms", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/30/);
    expect(container.textContent).toMatch(/80/);
    expect(container.textContent).toMatch(/800/);
    expect(container.textContent).toMatch(/910|p50/i);
    expect(container.textContent).toMatch(/latency/i);
  });

  it("sub=3 shows per-query cost breakdown dominated by LLM", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/\$0\.0\d+/);
    expect(container.textContent).toMatch(/LLM/);
  });

  it("sub=4 shows top-k retrieve vs top-k rerank tradeoff", () => {
    const { container } = render(RerankerCascade(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/top-?k/i);
    expect(container.textContent).toMatch(/sweet spot|diminish/i);
    expect(container.textContent).toMatch(/recall/i);
  });
});
