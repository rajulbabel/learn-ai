import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CLIP from "../../../chapters/scaling/clip.jsx";

afterEach(() => cleanup());

describe("CLIP (3.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CLIP(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CLIP(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CLIP(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CLIP(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CLIP(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub 3 shows the actual cosine similarity formula", () => {
    const { container } = render(CLIP(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("||A||");
  });

  it("sub=1 introduces CLIP and encoders", () => {
    const { container } = render(CLIP(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("CLIP");
    expect(text).toContain("Encoder");
  });

  it("sub=2 shows the matching game grid", () => {
    const { container } = render(CLIP(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("contrastive");
  });
});
