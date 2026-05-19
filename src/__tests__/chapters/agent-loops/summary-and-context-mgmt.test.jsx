import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SummaryAndContextMgmt from "../../../chapters/agent-loops/summary-and-context-mgmt.jsx";

afterEach(() => cleanup());

describe("SummaryAndContextMgmt (26.12)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SummaryAndContextMgmt(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows long conversations pressure the window", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window|8k/i);
    expect(container.textContent).toMatch(/turns?|100|30/i);
    expect(container.textContent).toMatch(/100 Turns Won/i);
  });

  it("sub=1 shows rolling summary technique", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rolling|summary/i);
    expect(container.textContent).toMatch(/50%|capacity|half/i);
    expect(container.textContent).toMatch(/Compress The Oldest Half/i);
  });

  it("sub=2 shows hierarchical summary tree", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarch/i);
    expect(container.textContent).toMatch(/meta|tree|leaves/i);
    expect(container.textContent).toMatch(/Summaries Of Summaries/i);
  });

  it("sub=3 contrasts recency / relevance / hybrid", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recency/i);
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/Most Recent vs Most Relevant/i);
  });

  it("sub=4 shows production thresholds", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/50%|threshold|capacity/i);
    expect(container.textContent).toMatch(/aggressive|panic|production/i);
    expect(container.textContent).toMatch(/Summarize At 50% Capacity/i);
  });

  it("sub=5 ties to 24.6 context engineering", () => {
    const { container } = render(SummaryAndContextMgmt(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/24\.6|context engineering/i);
    expect(container.textContent).toMatch(/Context Is Where Real Work Happens/i);
  });
});
