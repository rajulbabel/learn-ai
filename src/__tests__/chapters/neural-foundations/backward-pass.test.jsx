import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BackwardPass from "../../../chapters/neural-foundations/backward-pass.jsx";

afterEach(() => cleanup());

describe("BackwardPass (1.11)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(BackwardPass(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows tracing blame backwards with chain of steps from weight to loss", () => {
    const { container } = render(BackwardPass(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Backwards");
    expect(container.textContent).toContain("loss");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(BackwardPass(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(BackwardPass(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
