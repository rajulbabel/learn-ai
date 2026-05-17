import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ContextProblem from "../../../chapters/attention-qkv/context-problem.jsx";

afterEach(() => cleanup());

describe("ContextProblem (6.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ContextProblem(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ContextProblem(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ContextProblem(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ContextProblem(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=0 shows context is everything message", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Context is everything");
  });

  it("sub=1 shows sentence buttons", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Sentence 1");
    expect(container.textContent).toContain("Sentence 2");
  });

  it("bankIdx=0 shows river bank meaning", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 1, bankIdx: 0 })));
    expect(container.textContent).toContain("edge of a river");
  });

  it("bankIdx=1 shows financial institution meaning", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 1, bankIdx: 1 })));
    expect(container.textContent).toContain("financial institution");
  });

  it("clicks sentence buttons to change bankIdx", () => {
    const setBankIdx = vi.fn();
    const ctx = makeCtx({ sub: 1, setBankIdx });
    const { container } = render(ContextProblem(ctx));
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => fireEvent.click(b));
    expect(setBankIdx).toHaveBeenCalled();
  });

  it("sub=2 shows explanation about every word", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("just about");
  });

  it("sub=3 shows Attention solves message", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("Attention solves");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(ContextProblem(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 3", () => {
    const navigate = vi.fn();
    const ctx = makeCtx({ sub: 3, navigate });
    const { container } = render(ContextProblem(ctx));
    // The sentence buttons are present but not SubBtn
    const buttons = container.querySelectorAll("button");
    // All buttons should be sentence buttons, not SubBtn
    expect(buttons.length).toBe(2); // only sentence 1 and sentence 2 buttons
  });
});
