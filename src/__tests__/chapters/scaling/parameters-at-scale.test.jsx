import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ParametersAtScale from "../../../chapters/scaling/parameters-at-scale.jsx";

afterEach(() => cleanup());

describe("ParametersAtScale (3.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ParametersAtScale(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ParametersAtScale(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ParametersAtScale(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ParametersAtScale(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ParametersAtScale(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 mentions parameters and weights", () => {
    const { container } = render(ParametersAtScale(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("parameter");
  });

  it("sub=1 shows layer parameter counting example", () => {
    const { container } = render(ParametersAtScale(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("15 parameters");
  });

  it("sub=3 mentions FFN layers", () => {
    const { container } = render(ParametersAtScale(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("FFN");
  });
});
