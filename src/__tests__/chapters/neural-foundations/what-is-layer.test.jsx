import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhatIsLayer from "../../../chapters/neural-foundations/what-is-layer.jsx";

afterEach(() => cleanup());

describe("WhatIsLayer (1.3)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(WhatIsLayer(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub=0 introduces a layer as a group of neurons", () => {
    const { container } = render(WhatIsLayer(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Layer");
    expect(container.textContent).toContain("neurons");
  });

  it("shows SubBtn when sub < 4", () => {
    const { container } = render(WhatIsLayer(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(WhatIsLayer(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
