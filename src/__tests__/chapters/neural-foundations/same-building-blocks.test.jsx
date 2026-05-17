import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SameBuildingBlocks from "../../../chapters/neural-foundations/same-building-blocks.jsx";

afterEach(() => cleanup());

describe("SameBuildingBlocks (1.22)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(SameBuildingBlocks(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 states everything in AI uses these building blocks", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(SameBuildingBlocks(ctx));
    const text = container.textContent;
    expect(text).toContain("pieces");
  });

  it("sub 1 lists the building blocks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(SameBuildingBlocks(ctx));
    const text = container.textContent;
    expect(text).toContain("Matrix multiplication");
    expect(text).toContain("Activation");
    expect(text).toContain("Loss");
    expect(text).toContain("Backpropagation");
  });

  it("sub 2 previews how Transformers use these exact pieces", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(SameBuildingBlocks(ctx));
    const text = container.textContent;
    expect(text).toContain("Simple");
    expect(text).toContain("Deep network");
    expect(text).toContain("GPT");
  });

  it("sub 3 gives the confidence-building summary", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(SameBuildingBlocks(ctx));
    const text = container.textContent;
    expect(text).toContain("understand");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(SameBuildingBlocks(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(SameBuildingBlocks(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
