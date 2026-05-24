import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import QKVShapes from "../../../chapters/attention-qkv/qkv-shapes.jsx";

afterEach(() => cleanup());

describe("QKVShapes (6.10)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(QKVShapes(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(QKVShapes(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(QKVShapes(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(QKVShapes(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(QKVShapes(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows puzzle about W_Q shape", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("W_Q");
  });

  it("sub=0 shows 4x2 shape question", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("4×2");
  });

  it("sub=0 shows embedding and query labels", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("embedding");
    expect(container.textContent).toContain("query");
  });

  it("sub=1 shows embedding stays big", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("embedding stays big");
  });

  it("sub=1 shows Q K V labels", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Query");
    expect(container.textContent).toContain("Key");
    expect(container.textContent).toContain("Value");
  });

  it("sub=2 shows multi-head splits budget", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Multi-head");
  });

  it("sub=2 shows budget intuition", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("budget");
  });

  it("sub=3 shows real GPT numbers", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("512");
    expect(container.textContent).toContain("64");
  });

  it("sub=4 shows shapes recap", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("Shapes recap");
  });

  it("sub=4 shows d_k = d_model / num_heads formula", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("d_model");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 4", () => {
    const { container } = render(QKVShapes(makeCtx({ sub: 4 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
