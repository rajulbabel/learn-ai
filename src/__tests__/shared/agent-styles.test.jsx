import { describe, it, expect } from "vitest";
import { SOFT, DIM_BG, DIM_BORDER, tintedCard, pill } from "../../shared/agent-styles.jsx";

describe("agent-styles", () => {
  it("SOFT is an object with at least indigo and teal", () => {
    expect(SOFT).toBeTypeOf("object");
    expect(SOFT.indigo).toBeDefined();
    expect(SOFT.teal).toBeDefined();
  });
  it("DIM_BG and DIM_BORDER are CSS color strings", () => {
    expect(DIM_BG).toMatch(/^#/);
    expect(DIM_BORDER).toMatch(/^#/);
  });
  it("tintedCard returns an object with background and border", () => {
    const card = tintedCard("#abc");
    expect(card.background).toBeDefined();
    expect(card.border).toBeDefined();
  });
  it("pill returns an object with background, borderRadius, and color", () => {
    const p = pill("#abc");
    expect(p.background).toBeDefined();
    expect(p.borderRadius).toBeDefined();
    expect(p.color).toBeDefined();
  });
});
