import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SFT from "../../../chapters/llm-training/sft.jsx";

afterEach(() => cleanup());

describe("SFT (2.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SFT(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 explains the problem - model predicts generic internet text", () => {
    const { container } = render(SFT(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("internet");
    expect(text).toContain("predict");
  });

  it("sub=1 shows SFT training data format with User/Assistant pairs", () => {
    const { container } = render(SFT(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("User:");
    expect(text).toContain("Assistant:");
  });

  it("sub=2 shows loss computed only on assistant tokens position by position", () => {
    const { container } = render(SFT(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("no loss");
  });

  it("sub=3 shows before vs after SFT probability shift", () => {
    const { container } = render(SFT(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("Before");
    expect(text).toContain("After");
  });

  it("sub=4 reveals the hidden prompt template wrapping", () => {
    const { container } = render(SFT(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("template");
  });

  it("sub=5 explains why 100K examples is enough", () => {
    const { container } = render(SFT(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("100K");
  });
});
