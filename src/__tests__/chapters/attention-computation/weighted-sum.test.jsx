import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WeightedSum from "../../../chapters/attention-computation/weighted-sum.jsx";

afterEach(() => cleanup());

describe("WeightedSum (7.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WeightedSum(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WeightedSum(makeCtx({ sub: 1 })))).not.toThrow();
  });
});
