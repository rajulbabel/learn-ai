import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import InsideEachHead from "../../../chapters/attention-computation/inside-each-head.jsx";

afterEach(() => cleanup());

describe("InsideEachHead (7.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(InsideEachHead(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(InsideEachHead(makeCtx({ sub: 1 })))).not.toThrow();
  });
});
