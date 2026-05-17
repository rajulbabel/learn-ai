import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import IsWOConstant from "../../../chapters/attention-computation/is-wo-constant.jsx";

afterEach(() => cleanup());

describe("IsWOConstant (7.14)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(IsWOConstant(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(IsWOConstant(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(IsWOConstant(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(IsWOConstant(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(IsWOConstant(makeCtx({ sub: 4 })))).not.toThrow();
  });
});
