import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ReLU from "../../../chapters/neural-foundations/re-lu.jsx";

afterEach(() => cleanup());

describe("ReLU (1.6)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(ReLU(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the ReLU rule: if negative 0, if positive keep", () => {
    const { container } = render(ReLU(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("ReLU");
    expect(container.textContent).toContain("negative");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(ReLU(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(ReLU(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
