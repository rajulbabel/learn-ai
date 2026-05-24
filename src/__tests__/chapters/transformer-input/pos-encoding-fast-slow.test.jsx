import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import PosEncodingFastSlow from "../../../chapters/transformer-input/pos-encoding-fast-slow.jsx";

afterEach(() => cleanup());

describe("PosEncodingFastSlow (5.6)", () => {
  for (let s = 0; s <= 5; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(PosEncodingFastSlow(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 shows counting with ones, tens, hundreds", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("Ones");
    expect(text).toContain("Hundreds");
    expect(text).toContain("Tens");
  });

  it("sub 1 shows what happens with only ones column", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("ones");
    expect(text).toContain("repeats");
  });

  it("sub 2 shows what happens with only hundreds column", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("hundreds");
    expect(text).toContain("identical");
  });

  it("sub 3 shows combining columns gives unique positions", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("unique");
    expect(text).toContain("1000");
  });

  it("sub 4 connects counting to positional encoding dimensions", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("positional encoding");
    expect(text).toContain("512");
  });

  it("sub 5 concludes fast vs slow summary", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("fast vs slow");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=5", () => {
    const { container } = render(PosEncodingFastSlow(makeCtx({ sub: 5 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
