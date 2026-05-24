import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ForwardPass from "../../../chapters/neural-foundations/forward-pass.jsx";

afterEach(() => cleanup());

describe("ForwardPass (1.7)", () => {
  for (let s = 0; s <= 3; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(ForwardPass(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows the network to trace with weights", () => {
    const { container } = render(ForwardPass(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("trace");
    expect(container.textContent).toContain("weight");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(ForwardPass(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(ForwardPass(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
