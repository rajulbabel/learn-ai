import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import InsideNeuron from "../../../chapters/neural-foundations/inside-neuron.jsx";

afterEach(() => cleanup());

describe("InsideNeuron (1.2)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(InsideNeuron(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 shows one neuron three steps diagram", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("One Neuron");
  });

  it("sub=1 shows flu detection example with symptoms", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("fever");
    expect(container.textContent).toContain("cough");
  });

  it("sub=2 shows step-by-step math", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Step 1");
    expect(container.textContent).toContain("Step 2");
    expect(container.textContent).toContain("bias");
  });

  it("sub=3 shows neuron formula", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("NEURON FORMULA");
    expect(container.textContent).toContain("activation");
    expect(container.textContent).toContain("weight");
  });

  it("sub=4 shows summary about weights", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 4 })));
    expect(container.textContent).toContain("WEIGHTS");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(InsideNeuron(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
