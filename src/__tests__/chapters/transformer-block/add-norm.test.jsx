import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AddNorm from "../../../chapters/transformer-block/add-norm.jsx";

afterEach(() => cleanup());

describe("AddNorm (8.2)", () => {
  for (let s = 0; s <= 6; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(AddNorm(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows the Transformer block overview with Add & Norm highlighted", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
  });

  it("sub 1 shows the value drift problem with both shrink and explode scenarios", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("0.7");
    expect(text).toContain("shrink");
    expect(text).toContain("explode");
    expect(text).toContain("layer");
  });

  it("sub 2 shows the Add step with concrete math and explains residual meaning", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("residual");
    expect(text).toContain("leftover");
    expect(text).toContain("original");
    expect(text).toContain("+");
    expect(container.querySelector("[data-residual]")).toBeTruthy();
  });

  it("sub 3 shows layer normalization formula and parameter explanations", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Layer Normalization");
    expect(text).toContain("gamma");
    expect(text).toContain("beta");
    expect(text).toContain("variance");
  });

  it("sub 4 shows layer normalization step-by-step computation", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("mean");
    expect(text).toContain("subtract");
    expect(text).toContain("0");
  });

  it("sub 5 shows full Add & Norm pipeline with numbers flowing through", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Input");
    expect(text).toContain("Attention");
    expect(container.querySelector("[data-pipeline]")).toBeTruthy();
  });

  it("sub 6 shows why it matters - with vs without comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(AddNorm(ctx));
    const text = container.textContent;
    expect(text).toContain("Without");
    expect(text).toContain("With");
    expect(text).toContain("stable");
  });
});
