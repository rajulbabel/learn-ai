import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import HowQKVCreated from "../../../chapters/attention-qkv/how-qkv-created.jsx";

afterEach(() => cleanup());

describe("HowQKVCreated (6.9)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(HowQKVCreated(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows Q K V are just concepts", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Q, K, V are just concepts");
  });

  it("sub=0 shows love embedding example", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain('"love"');
  });

  it("sub=1 shows W matrix concept", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("W matrix");
  });

  it("sub=1 shows grid of numbers", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("grid");
  });

  it("sub=2 shows photo with three filters analogy", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("photo");
    expect(container.textContent).toContain("filters");
  });

  it("sub=2 shows W_Q, W_K, W_V", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("W_Q");
    expect(container.textContent).toContain("W_K");
    expect(container.textContent).toContain("W_V");
  });

  it("sub=3 shows actual three grids in action", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("three grids");
  });

  it("sub=4 shows love embedding with 512 numbers", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("512");
  });

  it("sub=5 shows three different outputs message", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 5 })));
    expect(container.textContent).toContain("three different outputs");
  });

  it("shows SubBtn when sub < 5", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 5", () => {
    const { container } = render(HowQKVCreated(makeCtx({ sub: 5 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
