import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingProblem from "../../../chapters/transformer-input/pos-encoding-problem.jsx";

afterEach(() => cleanup());

describe("PosEncodingProblem (5.3)", () => {
  for (let s = 0; s <= 2; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingProblem(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains the ordering problem with I love cats example", () => {
    const { container } = render(PosEncodingProblem(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("I love cats");
    expect(text).toContain("order");
  });

  it("sub 1 shows why simple solutions fail", () => {
    const { container } = render(PosEncodingProblem(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("fail");
  });

  it("sub 2 introduces sine and cosine solution", () => {
    const { container } = render(PosEncodingProblem(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Sine");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingProblem(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=2", () => {
    const { container } = render(PosEncodingProblem(makeCtx({ sub: 2 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
