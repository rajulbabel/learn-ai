import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyChunkFixedSize from "../../../chapters/rag-foundations/why-chunk-fixed-size.jsx";

afterEach(() => cleanup());

describe("WhyChunkFixedSize (20.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(WhyChunkFixedSize(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows why a whole-doc embedding is impossible", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/250,000|250000|500 pages?|500-page/i);
    expect(container.textContent).toMatch(/8,?192|8K/);
    expect(container.textContent).toMatch(/overflow|exceed|too (long|big)/i);
  });

  it("sub=1 lists the three reasons we must chunk", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context limits?/i);
    expect(container.textContent).toMatch(/granular/i);
    expect(container.textContent).toMatch(/dilut|signal/i);
  });

  it("sub=2 introduces the fixed-size sliding window on doc-1", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sliding window|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/128/);
    expect(container.textContent).toMatch(/doc-?1|password reset/i);
  });

  it("sub=3 shows the mid-sentence break on the password reset doc", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/mid[- ]?sentence|boundary|cut/i);
    expect(container.textContent).toMatch(/password/i);
    expect(container.textContent).toMatch(/set a new/i);
  });

  it("sub=4 compares overlap 0 vs overlap 16 with cost tradeoff", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/0/);
    expect(container.textContent).toMatch(/16/);
    expect(container.textContent).toMatch(/duplicate|redundant|cost|more vectors/i);
  });

  it("sub=5 lists when fixed-size is enough vs when to move on", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/baseline/i);
    expect(container.textContent).toMatch(/homogeneous|heterogeneous/i);
    expect(container.textContent).toMatch(/structural|semantic/i);
  });

  it("sub=5 right column marker mirrors OK and never uses ->", () => {
    const { container } = render(WhyChunkFixedSize(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OK/);
    expect(container.textContent).toMatch(/GO/);
    expect(container.textContent).not.toMatch(/->/);
  });
});
