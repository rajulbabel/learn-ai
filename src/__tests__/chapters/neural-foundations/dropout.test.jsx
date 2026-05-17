import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Dropout from "../../../chapters/neural-foundations/dropout.jsx";

afterEach(() => cleanup());

describe("Dropout (1.23)", () => {
  for (let s = 0; s <= 6; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(Dropout(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains what training and validation loss are with dataset split visual", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Training Loss");
    expect(text).toContain("Validation Loss");
    expect(text).toContain("80%");
    expect(text).toContain("20%");
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("sub 1 shows combined overfitting graph with both lines and annotated zones", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Overfitting");
    expect(text).toContain("Training Loss");
    expect(text).toContain("Validation Loss");
    expect(text).toContain("Sweet Spot");
    expect(text).toContain("memorize");
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("sub 2 shows dropout solution - randomly zero neurons", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Randomly Zero");
    expect(text).toContain("ACTIVE");
    expect(text).toContain("DROPPED");
  });

  it("sub 3 explains forced redundancy - why dropout works", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Without Dropout");
    expect(text).toContain("With Dropout");
    expect(text).toContain("Redundancy");
  });

  it("sub 4 shows the actual math with vector operations", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Bernoulli");
    expect(text).toContain("Scale");
    expect(text).toContain("1/(1 - p)");
  });

  it("sub 5 explains inference with no dropout", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Inference");
    expect(text).toContain("inverted dropout");
  });

  it("sub 6 shows where dropout lives in a transformer", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(Dropout(ctx));
    const text = container.textContent;
    expect(text).toContain("Transformer");
    expect(text).toContain("Multi-Head Attention");
    expect(text).toContain("Feed-Forward");
  });

  it("shows SubBtn when sub < 6", () => {
    const { container } = render(Dropout(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=6", () => {
    const { container } = render(Dropout(makeCtx({ sub: 6 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
