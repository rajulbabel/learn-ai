import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CostControl from "../../../chapters/agent-production/cost-control.jsx";

afterEach(() => cleanup());

describe("CostControl (28.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CostControl(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows cost breakdown", () => {
    const { container } = render(CostControl(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/input|output|tool|retr/i);
    expect(container.textContent).toMatch(/0\.30|dominant/);
    expect(container.textContent).toMatch(/Where The Dollars Go/i);
  });

  it("sub=1 explains prompt caching with Section 23.6", () => {
    const { container } = render(CostControl(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/23\.6|section 12/i);
    expect(container.textContent).toMatch(/80%|prefix/i);
    expect(container.textContent).toMatch(/Cache The Prefix/i);
  });

  it("sub=2 shows model routing tiers", () => {
    const { container } = render(CostControl(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/router|routing|tier/i);
    expect(container.textContent).toMatch(/cheap|small|large/i);
    expect(container.textContent).toMatch(/Cheap For Easy, Expensive For Hard/i);
  });

  it("sub=3 shows per-request budget cap", () => {
    const { container } = render(CostControl(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/budget|cap/i);
    expect(container.textContent).toMatch(/26\.6|max.?iter/i);
    expect(container.textContent).toMatch(/Hard Cap Per Ticket/i);
  });

  it("sub=4 shows cost-aware retries", () => {
    const { container } = render(CostControl(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/transient|permanent|business.?rule/i);
    expect(container.textContent).toMatch(/25\.5/);
    expect(container.textContent).toMatch(/Don't Retry Expensive Failures/i);
  });
});
