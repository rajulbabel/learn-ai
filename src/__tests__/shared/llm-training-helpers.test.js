import { describe, it, expect } from "vitest";
import {
  SCORES,
  SORTED_SCORES,
  SORTED_PROBS,
  EXP_SCORES,
  EXP_SUM,
} from "../../shared/llm-training-helpers.jsx";

describe("llm-training-helpers", () => {
  it("SCORES is an object with at least one entry", () => {
    expect(typeof SCORES).toBe("object");
    expect(Object.keys(SCORES).length).toBeGreaterThan(0);
  });

  it("SORTED_SCORES is a non-empty array sorted descending by value", () => {
    expect(Array.isArray(SORTED_SCORES)).toBe(true);
    expect(SORTED_SCORES.length).toBeGreaterThan(0);
    for (let i = 1; i < SORTED_SCORES.length; i++) {
      expect(SORTED_SCORES[i - 1][1]).toBeGreaterThanOrEqual(SORTED_SCORES[i][1]);
    }
  });

  it("SORTED_PROBS sums to approximately 1", () => {
    const sum = SORTED_PROBS.reduce((s, [, p]) => s + p, 0);
    expect(sum).toBeCloseTo(1, 2);
  });

  it("SORTED_PROBS is sorted descending by probability", () => {
    for (let i = 1; i < SORTED_PROBS.length; i++) {
      expect(SORTED_PROBS[i - 1][1]).toBeGreaterThanOrEqual(SORTED_PROBS[i][1]);
    }
  });

  it("EXP_SCORES contains the exponentiated SCORES for every key", () => {
    const keys = Object.keys(SCORES);
    expect(Object.keys(EXP_SCORES).sort()).toEqual(keys.slice().sort());
    for (const k of keys) {
      expect(EXP_SCORES[k]).toBeCloseTo(Math.exp(SCORES[k]), 6);
    }
  });

  it("EXP_SUM equals the sum of EXP_SCORES values", () => {
    const computed = Object.values(EXP_SCORES).reduce((s, v) => s + v, 0);
    expect(EXP_SUM).toBeCloseTo(computed, 6);
  });
});
