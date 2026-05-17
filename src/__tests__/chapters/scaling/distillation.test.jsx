import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Distillation from "../../../chapters/scaling/distillation.jsx";

afterEach(() => cleanup());

describe("Distillation (3.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Distillation(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Distillation(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Distillation(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Distillation(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Distillation(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub 3 mentions temperature", () => {
    const { container } = render(Distillation(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("temperature");
  });

  it("uses India/Delhi/Mumbai example (not France/Paris/Lyon)", () => {
    let combined = "";
    for (let s = 0; s <= 4; s++) {
      const { container } = render(Distillation(makeCtx({ sub: s })));
      combined += container.textContent;
      cleanup();
    }
    expect(combined).toContain("India");
    expect(combined).toContain("Delhi");
    expect(combined).toContain("Mumbai");
    expect(combined).not.toContain("France");
    expect(combined).not.toContain("Paris");
    expect(combined).not.toContain("Lyon");
  });

  it("sub=1 shows teacher/student model pair", () => {
    const { container } = render(Distillation(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Teacher");
    expect(text).toContain("Student");
  });
});
