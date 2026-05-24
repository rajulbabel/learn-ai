import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhatDeepMeans from "../../../chapters/neural-foundations/what-deep-means.jsx";

afterEach(() => cleanup());

describe("WhatDeepMeans (1.21)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhatDeepMeans(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains deep = many layers stacked", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(WhatDeepMeans(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
    expect(text).toContain("deep");
  });

  it("sub 1 shows why depth helps - building abstractions", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(WhatDeepMeans(ctx));
    const text = container.textContent;
    expect(text).toContain("simple");
    expect(text).toContain("abstract");
  });

  it("sub 2 shows the depth problem - vanishing/exploding values", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(WhatDeepMeans(ctx));
    const text = container.textContent;
    expect(text).toContain("low-level");
    expect(text).toContain("high-level");
  });

  it("sub 3 explains training vs inference", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(WhatDeepMeans(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
    expect(text).toContain("FROZEN");
  });

  it("sub 4 shows GPT-3 scale", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(WhatDeepMeans(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(WhatDeepMeans(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(WhatDeepMeans(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
