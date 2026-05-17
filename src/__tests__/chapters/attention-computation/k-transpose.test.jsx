import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import KTranspose from "../../../chapters/attention-computation/k-transpose.jsx";

afterEach(() => cleanup());

describe("KTranspose (7.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(KTranspose(makeCtx({ sub: 6 })))).not.toThrow();
  });
});
