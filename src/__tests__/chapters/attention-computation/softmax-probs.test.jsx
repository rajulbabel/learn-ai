import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SoftmaxProbs from "../../../chapters/attention-computation/softmax-probs.jsx";

afterEach(() => cleanup());

describe("SoftmaxProbs (7.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SoftmaxProbs(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(SoftmaxProbs(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(SoftmaxProbs(makeCtx({ sub: 2 })))).not.toThrow();
  });
});
