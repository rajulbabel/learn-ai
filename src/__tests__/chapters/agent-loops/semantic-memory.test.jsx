import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SemanticMemory from "../../../chapters/agent-loops/semantic-memory.jsx";

afterEach(() => cleanup());

describe("SemanticMemory (13.27)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SemanticMemory(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 distinguishes facts from events", () => {
    const { container } = render(SemanticMemory(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/episodic|event/i);
    expect(container.textContent).toMatch(/alice|prefer/i);
    expect(container.textContent).toMatch(/Facts I Know About You/i);
  });

  it("sub=1 shows the profile card", () => {
    const { container } = render(SemanticMemory(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/tier|Pro/);
    expect(container.textContent).toMatch(/preferred_contact|preference/i);
    expect(container.textContent).toMatch(/Customer Profile Card/i);
  });

  it("sub=2 compares structured vs vector storage", () => {
    const { container } = render(SemanticMemory(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/structured|key.?value/i);
    expect(container.textContent).toMatch(/vector|similarity/i);
    expect(container.textContent).toMatch(/Key-Value Or Vector/i);
  });

  it("sub=3 shows profile growth across sessions", () => {
    const { container } = render(SemanticMemory(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/day 1|day 30|day 90|growth/i);
    expect(container.textContent).toMatch(/How The Profile Fills Up/i);
  });

  it("sub=4 explains write vs ignore", () => {
    const { container } = render(SemanticMemory(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/write|store/i);
    expect(container.textContent).toMatch(/ignore|skip|transient/i);
    expect(container.textContent).toMatch(/6 months|stable/i);
    expect(container.textContent).toMatch(/What Counts As A Fact/i);
  });
});
