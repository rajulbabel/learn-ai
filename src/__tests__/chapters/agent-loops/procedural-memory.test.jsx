import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ProceduralMemory from "../../../chapters/agent-loops/procedural-memory.jsx";

afterEach(() => cleanup());

describe("ProceduralMemory (26.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ProceduralMemory(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 contrasts skill vs fact", () => {
    const { container } = render(ProceduralMemory(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/skill|recipe|how.?to/i);
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/escalate_human|200/);
    expect(container.textContent).toMatch(/How-To, Not What/i);
  });

  it("sub=1 shows the recipe library", () => {
    const { container } = render(ProceduralMemory(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/library|cache|recipe/i);
    expect(container.textContent).toMatch(/refund|password|billing/i);
    expect(container.textContent).toMatch(/Cached Workflows/i);
  });

  it("sub=2 shows retrieval by similarity", () => {
    const { container } = render(ProceduralMemory(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/similarity|match|retriev/i);
    expect(container.textContent).toMatch(/embedding|ANN/);
    expect(container.textContent).toMatch(/Retrieve The Recipe/i);
  });

  it("sub=3 shows recipe shape", () => {
    const { container } = render(ProceduralMemory(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recipe/i);
    expect(container.textContent).toMatch(/steps/i);
    expect(container.textContent).toMatch(/success_rate|uses/i);
    expect(container.textContent).toMatch(/Recipe \(Shape\)/i);
  });

  it("sub=4 contrasts with prompting", () => {
    const { container } = render(ProceduralMemory(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/external|stored|token/i);
    expect(container.textContent).toMatch(/learn|update|outcome/i);
    expect(container.textContent).toMatch(/Why Not Just Prompt/i);
  });
});
