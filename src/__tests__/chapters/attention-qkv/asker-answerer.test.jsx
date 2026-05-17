import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AskerAnswerer from "../../../chapters/attention-qkv/asker-answerer.jsx";

afterEach(() => cleanup());

describe("AskerAnswerer (6.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AskerAnswerer(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AskerAnswerer(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(AskerAnswerer(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(AskerAnswerer(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=0 shows confuses people header", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("confuses people");
  });

  it("sub=0 mentions simultaneously", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("simultaneously");
  });

  it("sub=1 shows every student produces all three", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Every student produces all three");
  });

  it("sub=1 shows Riya, Aman, Priya", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Riya");
    expect(container.textContent).toContain("Aman");
    expect(container.textContent).toContain("Priya");
  });

  it("sub=2 shows same thing in Transformer", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Same thing happens");
  });

  it("sub=3 shows why Key and Value separate question", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("separate");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 3", () => {
    const { container } = render(AskerAnswerer(makeCtx({ sub: 3 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
