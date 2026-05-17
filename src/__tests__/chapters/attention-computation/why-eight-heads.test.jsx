import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyEightHeads from "../../../chapters/attention-computation/why-eight-heads.jsx";

afterEach(() => cleanup());

describe("WhyEightHeads (7.13)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyEightHeads(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyEightHeads(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyEightHeads(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhyEightHeads(makeCtx({ sub: 3 })))).not.toThrow();
  });
});
