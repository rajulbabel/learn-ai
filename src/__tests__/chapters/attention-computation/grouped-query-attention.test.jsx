import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GroupedQueryAttention from "../../../chapters/attention-computation/grouped-query-attention.jsx";

afterEach(() => cleanup());

describe("GroupedQueryAttention (10.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(GroupedQueryAttention(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(GroupedQueryAttention(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(GroupedQueryAttention(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(GroupedQueryAttention(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(GroupedQueryAttention(makeCtx({ sub: 4 })))).not.toThrow();
  });
});
