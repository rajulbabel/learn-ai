import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import FullFormula from "../../../chapters/attention-computation/full-formula.jsx";

afterEach(() => cleanup());

describe("FullFormula (7.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(FullFormula(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(FullFormula(makeCtx({ sub: 1 })))).not.toThrow();
  });
});
