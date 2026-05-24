import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhatTransformerDoes from "../../../chapters/transformer-input/what-transformer-does.jsx";

afterEach(() => cleanup());

describe("WhatTransformerDoes (9.5)", () => {
  for (let s = 0; s <= 7; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhatTransformerDoes(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 introduces the big question with I love cats example", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("I love cats");
    expect(text).toContain("context");
  });

  it("sub 1 shows embeddings with actual vector numbers", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("embedding");
    expect(text).toContain("0.2");
  });

  it("sub 2 shows positional encoding being added", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("position");
  });

  it("sub 3 shows self-attention with words looking at each other", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("attention");
    expect(text).toContain("love");
  });

  it("sub 4 shows Add & Norm and FFN processing", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("residual");
  });

  it("sub 5 shows repeated layers with progressive refinement", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("layer");
    expect(text).toContain("repeat");
  });

  it("sub 6 shows the output prediction step", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("Linear");
    expect(text).toContain("Softmax");
    expect(text).toContain("probabilit");
  });

  it("sub 7 shows the complete pipeline summary", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("pipeline");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=7", () => {
    const { container } = render(WhatTransformerDoes(makeCtx({ sub: 7 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
