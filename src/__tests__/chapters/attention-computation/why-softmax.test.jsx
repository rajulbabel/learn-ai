import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhySoftmax from "../../../chapters/attention-computation/why-softmax.jsx";

afterEach(() => cleanup());

describe("WhySoftmax (7.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhySoftmax(makeCtx({ sub: 0 })))).not.toThrow();
  });
});

describe("WhySoftmax sub-steps", () => {
  it("sub 5 shows Steps 1-2 (e^score + sum) but not Step 3", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(WhySoftmax(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 1");
    expect(text).toContain("e^score");
    expect(text).toContain("Step 2");
    expect(text).toContain("151.17");
    expect(text).not.toContain("Step 3");
  });

  it("sub 6 shows Step 3 (divide by sum) and checkmarks", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(WhySoftmax(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 3");
    expect(text).toContain("Divide");
    expect(text).toContain("98.2%");
    expect(text).toContain("All positive");
    expect(text).toContain("Sum = 100%");
  });

  it("sub 7 shows amplification content (was sub 6)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(WhySoftmax(ctx));
    const text = container.textContent;
    expect(text).toContain("amplif");
    expect(text).toContain("dominates");
  });

  it("sub 8 shows the complete picture recap (was sub 7)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(WhySoftmax(ctx));
    const text = container.textContent;
    expect(text).toContain("complete picture");
    expect(text).toContain("FORMULA");
  });

  it("shows SubBtn when sub < 8 and hides at sub 8", () => {
    const ctx7 = makeCtx({ sub: 7 });
    const { container: c7 } = render(WhySoftmax(ctx7));
    expect(c7.querySelector("[data-subbtn]")).toBeTruthy();

    const ctx8 = makeCtx({ sub: 8 });
    const { container: c8 } = render(WhySoftmax(ctx8));
    expect(c8.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
