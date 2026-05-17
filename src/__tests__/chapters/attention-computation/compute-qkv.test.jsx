import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ComputeQKV from "../../../chapters/attention-computation/compute-qkv.jsx";

afterEach(() => cleanup());

describe("ComputeQKV (7.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ComputeQKV(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ComputeQKV(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ComputeQKV(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ComputeQKV(makeCtx({ sub: 3 })))).not.toThrow();
  });
});

describe("ComputeQKV interactive", () => {
  it("bankIdx=0", () => {
    const ctx = makeCtx({ sub: 7, bankIdx: 0 });
    const { container } = render(ComputeQKV(ctx));
    expect(container).toBeTruthy();
  });

  it("bankIdx=1", () => {
    const ctx = makeCtx({ sub: 7, bankIdx: 1 });
    const { container } = render(ComputeQKV(ctx));
    expect(container).toBeTruthy();
  });

  it("bankIdx=2", () => {
    const ctx = makeCtx({ sub: 7, bankIdx: 2 });
    const { container } = render(ComputeQKV(ctx));
    expect(container).toBeTruthy();
  });
});

describe("ComputeQKV W matrix sub-steps", () => {
  it("sub 1 shows all three W matrices (W_Q, W_K, W_V)", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(ComputeQKV(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("W_K");
    expect(text).toContain("W_V");
    // Should show matrix values
    expect(text).toContain("0.15");
    expect(text).toContain("0.59");
  });

  it("sub 2 shows detailed multiplication for 'I'", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(ComputeQKV(ctx));
    const text = container.textContent;
    // Should show the step-by-step multiplication
    expect(text).toContain("1.0");
    expect(text).toContain("0.59");
    // Should show the result
    expect(text).toContain("[1.0, -0.5]");
  });

  it("sub 3 shows the final Q, K, V results table", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(ComputeQKV(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("[0.8, 0.2]");
  });
});
