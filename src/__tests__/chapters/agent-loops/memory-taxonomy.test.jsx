import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MemoryTaxonomy from "../../../chapters/agent-loops/memory-taxonomy.jsx";

afterEach(() => cleanup());

describe("MemoryTaxonomy (26.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MemoryTaxonomy(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 distinguishes short and long", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/short.?term/i);
    expect(container.textContent).toMatch(/long.?term/i);
    expect(container.textContent).toMatch(/context window|session/i);
    expect(container.textContent).toMatch(/Two Memory Layers/i);
  });

  it("sub=1 lists the three long-term types", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
    expect(container.textContent).toMatch(/Long-Term Splits Three Ways/i);
  });

  it("sub=2 shows the full taxonomy tree", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/working/i);
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
    expect(container.textContent).toMatch(/Agent Memory Taxonomy/i);
  });

  it("sub=2 tree labels long-term leaves with the correct chapter numbers", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/26\.9/);
    expect(container.textContent).toMatch(/26\.10/);
    expect(container.textContent).toMatch(/26\.11/);
    // Stale references to a non-existent Section 13 chapter must not appear.
    expect(container.textContent).not.toMatch(/13\.2[678]/);
  });

  it("sub=3 shows the T2 memory snapshot", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
    expect(container.textContent).toMatch(/Pro tier|MFA|refund/i);
    expect(container.textContent).toMatch(/Memory Snapshot: Ticket T2/i);
  });

  it("sub=4 explains why all four", () => {
    const { container } = render(MemoryTaxonomy(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/current|task|state/i);
    expect(container.textContent).toMatch(/past|event/i);
    expect(container.textContent).toMatch(/facts|stable/i);
    expect(container.textContent).toMatch(/routine|cache/i);
    expect(container.textContent).toMatch(/Each Layer Solves/i);
  });
});
