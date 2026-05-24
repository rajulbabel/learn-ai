import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AdamOptimizer from "../../../chapters/neural-foundations/adam-optimizer.jsx";

afterEach(() => cleanup());

describe("AdamOptimizer (1.24)", () => {
  for (let s = 0; s <= 5; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(AdamOptimizer(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 1 momentum formula annotations are center-aligned under their symbols", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(AdamOptimizer(ctx));
    const annotations = container.querySelectorAll("text[text-anchor='middle']");
    const labels = Array.from(annotations)
      .map((el) => el.textContent)
      .filter((t) => ["momentum", "0.9", "gradient"].includes(t));
    expect(labels).toEqual(expect.arrayContaining(["momentum", "0.9", "gradient"]));
  });

  it("sub 3 velocity formula annotations are center-aligned under their symbols", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(AdamOptimizer(ctx));
    const annotations = container.querySelectorAll("text[text-anchor='middle']");
    const labels = Array.from(annotations)
      .map((el) => el.textContent)
      .filter((t) => ["velocity", "0.999", "squared grad"].includes(t));
    expect(labels).toEqual(expect.arrayContaining(["velocity", "0.999", "squared grad"]));
  });

  it("shows SubBtn when sub < 5", () => {
    const { container } = render(AdamOptimizer(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=5", () => {
    const { container } = render(AdamOptimizer(makeCtx({ sub: 5 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
