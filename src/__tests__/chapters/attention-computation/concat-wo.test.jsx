import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ConcatWO from "../../../chapters/attention-computation/concat-wo.jsx";

afterEach(() => cleanup());

describe("ConcatWO (7.12)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ConcatWO(makeCtx({ sub: 0 })))).not.toThrow();
  });
});

describe("ConcatWO envelope visual", () => {
  it("sub 1 shows sealed envelopes as visual blocks with barriers", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ConcatWO(ctx));
    const text = container.textContent;
    // Should show envelope content
    expect(text).toContain("suspect");
    expect(text).toContain("park");
    expect(text).toContain("Tuesday");
    // Should show the sealed/barrier concept visually
    expect(text).toContain("sealed");
  });

  it("sub 1 shows visual envelope blocks for each head", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ConcatWO(ctx));
    // Should have distinct envelope blocks with head-specific colors
    const headBlocks = container.querySelectorAll("[data-envelope]");
    expect(headBlocks.length).toBeGreaterThanOrEqual(4);
  });

  it("sub 1 shows concatenation bar with visible barriers between segments", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ConcatWO(ctx));
    // Should have a concatenated bar visualization
    const concatBar = container.querySelector("[data-concat-bar]");
    expect(concatBar).toBeTruthy();
  });
});
