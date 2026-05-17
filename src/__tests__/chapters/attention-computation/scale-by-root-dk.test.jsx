import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ScaleByRootDk from "../../../chapters/attention-computation/scale-by-root-dk.jsx";

afterEach(() => cleanup());

describe("ScaleByRootDk (7.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ScaleByRootDk(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ScaleByRootDk(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ScaleByRootDk(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ScaleByRootDk(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ScaleByRootDk(makeCtx({ sub: 4 })))).not.toThrow();
  });
});
