import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhatIsNN from "../../../chapters/neural-foundations/what-is-nn.jsx";

afterEach(() => cleanup());

describe("WhatIsNN (1.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhatIsNN(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhatIsNN(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhatIsNN(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhatIsNN(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=0 shows Pattern Recognition Machines", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Pattern Recognition Machines");
  });

  it("sub=1 shows spam detection example", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Spam");
  });

  it("sub=2 shows two ways to make rules", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Traditional Programming");
    expect(container.textContent).toContain("Neural Network");
  });

  it("sub=3 shows what's inside a neural network", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 3 })));
    expect(container.textContent).toContain("neurons");
    expect(container.textContent).toContain("weight");
  });

  it("shows SubBtn when sub < 3", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=3", () => {
    const { container } = render(WhatIsNN(makeCtx({ sub: 3 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
