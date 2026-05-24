import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AttentionScores from "../../../chapters/attention-computation/attention-scores.jsx";

afterEach(() => cleanup());

describe("AttentionScores (7.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AttentionScores(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(AttentionScores(makeCtx({ sub: 1 })))).not.toThrow();
  });
});

describe("AttentionScores hovered", () => {
  for (let h = 0; h <= 4; h++) {
    it(`hovered=${h}`, () => {
      const ctx = makeCtx({ sub: 7, hovered: h });
      const { container } = render(AttentionScores(ctx));
      expect(container).toBeTruthy();
    });
  }
});
