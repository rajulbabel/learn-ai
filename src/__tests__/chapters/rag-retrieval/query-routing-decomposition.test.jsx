import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import QueryRoutingDecomposition from "../../../chapters/rag-retrieval/query-routing-decomposition.jsx";

afterEach(() => cleanup());

describe("QueryRoutingDecomposition (12.21)", () => {
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
