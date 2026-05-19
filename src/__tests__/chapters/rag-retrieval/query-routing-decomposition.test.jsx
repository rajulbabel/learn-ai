import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import QueryRoutingDecomposition from "../../../chapters/rag-retrieval/query-routing-decomposition.jsx";

afterEach(() => cleanup());

describe("QueryRoutingDecomposition (21.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 4 })))).not.toThrow();
  });
  it("renders at sub=5 without throwing", () => {
    expect(() => render(QueryRoutingDecomposition(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames routing and decomposition as two complementary strategies", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/routing/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/index|tool|split|sub-/i);
  });

  it("sub=1 shows the router decision tree with chitchat skip", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/router|routing/i);
    expect(container.textContent).toMatch(/account|billing/i);
    expect(container.textContent).toMatch(/troubleshoot/i);
    expect(container.textContent).toMatch(/chitchat|skip retrieval|skip/i);
  });

  it("sub=1 leaf text rows are vertically centered in their 76px card", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 1 })));
    const TREE_LEAF_Y = 180;
    const TREE_LEAF_H = 76;
    const texts = [...container.querySelectorAll("svg text")];
    const branch = texts.find((t) => t.textContent === "Account & Billing");
    const target = texts.find((t) => t.textContent === "Account-Billing Index");
    const topK = texts.find((t) => {
      if (t.textContent !== "Top-K = 5") return false;
      const x = Number(t.getAttribute("x"));
      return x < 250;
    });
    expect(branch).toBeTruthy();
    expect(target).toBeTruthy();
    expect(topK).toBeTruthy();
    const y1 = Number(branch.getAttribute("y"));
    const y2 = Number(target.getAttribute("y"));
    const y3 = Number(topK.getAttribute("y"));
    expect(y1 - TREE_LEAF_Y).toBe(22);
    expect(y2 - TREE_LEAF_Y).toBe(42);
    expect(y3 - TREE_LEAF_Y).toBe(60);
    // Visual centering: text extends ~9px above baseline, ~3px below.
    // Visual midpoint = ((y1 - 9) + (y3 + 3)) / 2 should equal card center.
    const cardCenter = TREE_LEAF_Y + TREE_LEAF_H / 2;
    expect((y1 - 9 + (y3 + 3)) / 2).toBe(cardCenter);
  });

  it("sub=2 contrasts semantic router vs LLM classifier with cost/latency", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/semantic router|embedding/i);
    expect(container.textContent).toMatch(/classifier/i);
    expect(container.textContent).toMatch(/latency|ms/i);
  });

  it("sub=3 walks the Pro vs Enterprise decomposition example", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Pro/);
    expect(container.textContent).toMatch(/Enterprise/);
    expect(container.textContent).toMatch(/sub-?quer/i);
    expect(container.textContent).toMatch(/doc-?3|doc-?10/i);
  });

  it("sub=4 names when to decompose: multi-hop, compare, disjunction", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-?hop/i);
    expect(container.textContent).toMatch(/compar/i);
    expect(container.textContent).toMatch(/disjunction|or|and/i);
  });

  it("sub=5 shows the route/decompose/both/neither decision grid with cost numbers", () => {
    const { container } = render(QueryRoutingDecomposition(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/route/i);
    expect(container.textContent).toMatch(/decompos/i);
    expect(container.textContent).toMatch(/neither|default|simple/i);
    expect(container.textContent).toMatch(/\$0\.0\d+|ms/);
  });
});
