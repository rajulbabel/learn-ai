import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Vectors from "../../../chapters/neural-foundations/vectors.jsx";

afterEach(() => cleanup());

describe("Vectors (1.16)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(Vectors(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 introduces what a vector is with concrete example", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(Vectors(ctx));
    const text = container.textContent;
    expect(text).toContain("list");
    expect(text).toContain("number");
    // Arrow should be offset down to center with boxes, not labels
    const arrows = container.querySelectorAll("[data-arrow]");
    expect(arrows.length).toBe(1);
    expect(arrows[0].style.marginTop).toBeTruthy();
  });

  it("sub 1 connects vectors to neural networks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(Vectors(ctx));
    const text = container.textContent;
    expect(text).toContain("Everything");
    expect(text).toContain("vector");
    // Both arrow containers should be present (one per illustration)
    const arrows = container.querySelectorAll("[data-arrow]");
    expect(arrows.length).toBe(2);
    arrows.forEach((a) => {
      expect(a.style.marginTop).toBeTruthy();
    });
  });

  it("sub 2 shows words become vectors", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(Vectors(ctx));
    const text = container.textContent;
    expect(text).toContain("cat");
    expect(text).toContain("vector");
  });

  it("sub 3 shows similar words have similar vectors", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(Vectors(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(Vectors(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(Vectors(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
