import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TracingExample from "../../../chapters/attention-qkv/tracing-example.jsx";

afterEach(() => cleanup());

describe("TracingExample (6.12)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TracingExample(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(TracingExample(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(TracingExample(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=0 shows sentence The cat sat", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("The cat sat");
  });

  it("sub=0 shows word embeddings", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain('"The"');
    expect(container.textContent).toContain('"cat"');
    expect(container.textContent).toContain('"sat"');
  });

  it("sub=0 shows embedding values", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("[0.7, -0.3, 0.6, 0.1]");
  });

  it("sub=1 shows Q K V for cat", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Q_cat");
    expect(container.textContent).toContain("K_cat");
    expect(container.textContent).toContain("V_cat");
  });

  it("sub=1 shows matrix multiplication notation", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("W_Q");
  });

  it("sub=2 shows sat Query", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Q_sat");
  });

  it("sub=2 shows dot product score calculation", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("0.39");
  });

  it("sub=2 shows HIGH MATCH result", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("HIGH MATCH");
  });

  it("sub=2 shows sat knows message", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("being performed by a cat");
  });

  it("shows SubBtn when sub < 2", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 2", () => {
    const { container } = render(TracingExample(makeCtx({ sub: 2 })));
    expect(container.querySelector("button")).toBeNull();
  });

  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h} renders without throwing`, () => {
      expect(() => render(TracingExample(makeCtx({ sub: 2, hovered: h })))).not.toThrow();
    });
  }
});
