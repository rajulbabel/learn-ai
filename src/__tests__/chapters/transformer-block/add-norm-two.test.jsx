import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AddNormTwo from "../../../chapters/transformer-block/add-norm-two.jsx";

afterEach(() => cleanup());

describe("AddNormTwo (8.5)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(AddNormTwo(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows where we are - just after FFN, second Add & Norm", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(AddNormTwo(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("second");
  });

  it("sub 1 shows the Add step with FFN input + FFN output", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(AddNormTwo(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("+");
    expect(text).toMatch(/\[.*\d.*\]/);
  });

  it("sub 2 shows the Norm step with concrete numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(AddNormTwo(ctx));
    const text = container.textContent;
    expect(text).toContain("Norm");
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 3 shows the complete single-block pipeline from input to output", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(AddNormTwo(ctx));
    const text = container.textContent;
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    expect(container.querySelector("[data-full-block]")).toBeTruthy();
  });

  it("sub 4 explains why Add & Norm appears twice", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(AddNormTwo(ctx));
    const text = container.textContent;
    expect(text).toContain("twice");
    expect(text).toContain("sub-layer");
  });
});
