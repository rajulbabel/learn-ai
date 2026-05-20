import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MultiHopRetrieval from "../../../chapters/rag-generation/multi-hop-retrieval.jsx";

afterEach(() => cleanup());

describe("MultiHopRetrieval (22.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(MultiHopRetrieval(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 contrasts single-hop with the forgot-email multi-hop case", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/multi-?hop|multiple retrievals/i);
    expect(container.textContent).toMatch(/how do i reset my password.*forgot my email/i);
    expect(container.textContent).toMatch(/doc-?1/i);
    expect(container.textContent).toMatch(/doc-?3/i);
  });

  it("sub=1 traces 2 hops with reformulation", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/hop 1/i);
    expect(container.textContent).toMatch(/hop 2/i);
    expect(container.textContent).toMatch(/reformulat/i);
  });

  it("sub=2 shows the control loop with max_hops and refuse branches", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop|control/i);
    expect(container.textContent).toMatch(/max_?hops/i);
    expect(container.textContent).toMatch(/refuse|i don'?t have/i);
  });

  it("sub=2 arrow markers anchor tip at endpoint so arrows do not overshoot into boxes", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 2 })));
    const markers = container.querySelectorAll("marker");
    expect(markers.length).toBeGreaterThan(0);
    markers.forEach((m) => {
      expect(m.getAttribute("refX")).toBe("10");
    });
  });

  it("sub=2 splits long box titles across two lines so text fits inside boxes", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 2 })));
    const texts = Array.from(container.querySelectorAll("text")).map((t) => t.textContent);
    expect(texts).toContain("Retrieve Top-K");
    expect(texts).toContain("For Current Query");
    expect(texts).toContain("Refuse:");
    expect(texts).toContain('"I Don\'t Have Enough Information"');
  });

  it("sub=2 edge labels sit in the gap between boxes (centered anchor, not bleeding into the side boxes)", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 2 })));
    const texts = Array.from(container.querySelectorAll("text"));
    const hopsLt = texts.find((t) => /Hops\s*<\s*max_hops/.test(t.textContent || ""));
    const hopsGte = texts.find((t) => /Hops\s*>=\s*max_hops/.test(t.textContent || ""));
    expect(hopsLt).toBeTruthy();
    expect(hopsGte).toBeTruthy();
    expect(hopsLt.getAttribute("text-anchor")).toBe("middle");
  });

  it("sub=3 shows the sufficiency-check prompt template", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/SUFFICIENT/);
    expect(container.textContent).toMatch(/INSUFFICIENT/);
  });

  it("sub=4 lists when multi-hop is worth the cost", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/worth it|compound|cross-doc/i);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/max_?hops|cap/i);
  });

  it("sub=5 covers infinite loop, divergence, and stuck judge failure modes", () => {
    const { container } = render(MultiHopRetrieval(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/infinite loop/i);
    expect(container.textContent).toMatch(/divergence|drift/i);
    expect(container.textContent).toMatch(/stuck|overconfident/i);
  });
});
