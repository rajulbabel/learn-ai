import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FullArchitecture from "../../../chapters/transformer-input/full-architecture.jsx";

afterEach(() => cleanup());

describe("FullArchitecture (5.1)", () => {
  for (let s = 0; s <= 1; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(FullArchitecture(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 renders the SVG architecture diagram", () => {
    const { container } = render(FullArchitecture(makeCtx({ sub: 0 })));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
  });

  it("sub 0 shows ENCODER and DECODER labels", () => {
    const { container } = render(FullArchitecture(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("ENCODER");
    expect(text).toContain("DECODER");
  });

  it("sub 1 shows Embedding zoom hint", () => {
    const { container } = render(FullArchitecture(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Embedding");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(FullArchitecture(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=1", () => {
    const { container } = render(FullArchitecture(makeCtx({ sub: 1 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
