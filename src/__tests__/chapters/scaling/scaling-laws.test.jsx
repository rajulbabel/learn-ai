import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ScalingLaws from "../../../chapters/scaling/scaling-laws.jsx";

afterEach(() => cleanup());

describe("ScalingLaws (3.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("renders at sub=7 without throwing", () => {
    expect(() => render(ScalingLaws(makeCtx({ sub: 7 })))).not.toThrow();
  });

  it("sub 5 explains that models were undertrained, not too small", () => {
    const { container } = render(ScalingLaws(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("GPT-3");
    expect(text).toContain("175B");
    expect(text).toContain("300B");
    expect(text).toContain("undertrained");
  });

  it("sub 5 does NOT show the Chinchilla vs Gopher comparison yet", () => {
    const { container } = render(ScalingLaws(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).not.toContain("Gopher");
  });

  it("sub 6 shows the Chinchilla vs Gopher comparison with concrete numbers", () => {
    const { container } = render(ScalingLaws(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("Chinchilla");
    expect(text).toContain("Gopher");
    expect(text).toContain("70B");
    expect(text).toContain("280B");
    expect(text).toContain("1.4T");
  });

  it("sub 7 shows the 20 tokens per parameter rule with worked examples", () => {
    const { container } = render(ScalingLaws(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("20");
    expect(text).toContain("tokens per parameter");
    expect(text).toContain("7B");
    expect(text).toContain("140B");
  });
});
