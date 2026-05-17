import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CNN from "../../../chapters/road-to-transformers/cnn.jsx";

afterEach(() => cleanup());

describe("CNN (4.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(CNN(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub 0 introduces CNNs", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(CNN(ctx));
    expect(container.textContent).toContain("Convolutional");
  });

  it("sub 1 shows convolution computation", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(CNN(ctx));
    expect(container.textContent).toContain("convolution");
    expect(container.textContent).toContain("1.9");
  });

  it("sub 4 shows CNN fatal flaw for language", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(CNN(ctx));
    expect(container.textContent).toContain("language");
  });

  it("shows SubBtn when sub < 5", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(CNN(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=5", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(CNN(ctx));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
