import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CompletePicture from "../../../chapters/attention-computation/complete-picture.jsx";

afterEach(() => cleanup());

describe("CompletePicture (7.16)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CompletePicture(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CompletePicture(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CompletePicture(makeCtx({ sub: 2 })))).not.toThrow();
  });
});
