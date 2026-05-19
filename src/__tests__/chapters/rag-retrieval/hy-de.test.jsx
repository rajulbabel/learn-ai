import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HyDE from "../../../chapters/rag-retrieval/hy-de.jsx";

afterEach(() => cleanup());

describe("HyDE (21.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 4 })))).not.toThrow();
  });
  it("renders at sub=5 without throwing", () => {
    expect(() => render(HyDE(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames embed-the-answer not the question with dashboard example", () => {
    const { container } = render(HyDE(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/embed.*answer|answer.*embed/i);
  });

  it("sub=1 shows the HyDE 5-box flow", () => {
    const { container } = render(HyDE(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/user query|query/i);
    expect(container.textContent).toMatch(/hypothetical/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=1 flow boxes are wide enough to contain their two-line labels", () => {
    const { container } = render(HyDE(makeCtx({ sub: 1 })));
    const rects = Array.from(container.querySelectorAll("svg rect")).filter(
      (r) => r.getAttribute("width") && Number(r.getAttribute("width")) > 50,
    );
    expect(rects.length).toBeGreaterThanOrEqual(5);
    rects.slice(0, 5).forEach((r) => {
      expect(Number(r.getAttribute("width"))).toBeGreaterThanOrEqual(135);
    });
  });

  it("sub=2 walks the dashboard-slow worked example with retrieved doc-22", () => {
    const { container } = render(HyDE(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/dashboard.*slow|slow.*dashboard/i);
    expect(container.textContent).toMatch(/doc-?22|slow page load|500/i);
  });

  it("sub=3 explains why HyDE works via vocabulary and mismatch", () => {
    const { container } = render(HyDE(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/vocabulary/i);
    expect(container.textContent).toMatch(/mismatch|lexical/i);
  });

  it("sub=4 contrasts when HyDE helps vs hurts with latency note", () => {
    const { container } = render(HyDE(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/help|hurt|when/i);
    expect(container.textContent).toMatch(/descriptive|long|factual|short/i);
    expect(container.textContent).toMatch(/latency|200|400/i);
  });

  it("sub=5 shows the HyDE prompt template with {query} placeholder", () => {
    const { container } = render(HyDE(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/\{query\}/);
    expect(container.textContent).toMatch(/23\.6|cache|caching/i);
  });
});
