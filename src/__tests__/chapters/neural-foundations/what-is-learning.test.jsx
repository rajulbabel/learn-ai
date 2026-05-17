import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhatIsLearning from "../../../chapters/neural-foundations/what-is-learning.jsx";

afterEach(() => cleanup());

describe("WhatIsLearning (1.9)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhatIsLearning(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows what changes during training - weights and biases", () => {
    const { container } = render(WhatIsLearning(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("weights");
    expect(container.textContent).toContain("Training");
  });

  it("sub=1 shows the 4-step learning loop", () => {
    const { container } = render(WhatIsLearning(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Forward Pass");
    expect(container.textContent).toContain("1");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(WhatIsLearning(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(WhatIsLearning(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
