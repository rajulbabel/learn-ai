import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ChunkingDecision from "../../../chapters/rag-foundations/chunking-decision.jsx";

afterEach(() => cleanup());

describe("ChunkingDecision (12.13)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ChunkingDecision(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ChunkingDecision(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ChunkingDecision(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ChunkingDecision(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ChunkingDecision(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 lists at least five of the six chunking strategies", () => {
    const { container } = render(ChunkingDecision(makeCtx({ sub: 0 })));
    const text = container.textContent;
    const names = [/fixed[- ]?size/i, /recursive structural/i, /semantic/i, /late/i, /hierarchical/i, /contextual/i];
    const hits = names.filter((re) => re.test(text)).length;
    expect(hits).toBeGreaterThanOrEqual(5);
    expect(text).toMatch(/quality|cost|implementation/i);
  });

  it("sub=1 covers the doc-structure axis (markdown, PDF, code, flat)", () => {
    const { container } = render(ChunkingDecision(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/markdown|HTML/i);
    expect(container.textContent).toMatch(/PDF/);
    expect(container.textContent).toMatch(/code/i);
    expect(container.textContent).toMatch(/flat|narrative/i);
  });

  it("sub=2 covers the query-type axis (factual, relational, comparative)", () => {
    const { container } = render(ChunkingDecision(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/factual/i);
    expect(container.textContent).toMatch(/relational/i);
    expect(container.textContent).toMatch(/comparative/i);
    expect(container.textContent).toMatch(/hierarchical/i);
  });

  it("sub=3 covers the cost-budget axis (lab, startup, enterprise)", () => {
    const { container } = render(ChunkingDecision(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lab|prototype/i);
    expect(container.textContent).toMatch(/startup/i);
    expect(container.textContent).toMatch(/enterprise/i);
    expect(container.textContent).toMatch(/\$|free|cost/i);
  });

  it("sub=4 walks through strategy choice on the customer support corpus", () => {
    const { container } = render(ChunkingDecision(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/customer support|support corpus/i);
    expect(container.textContent).toMatch(/Account|Billing/i);
    expect(container.textContent).toMatch(/Product Features|Troubleshooting/i);
    expect(container.textContent).toMatch(/mix|rarely one|iterate/i);
  });
});
