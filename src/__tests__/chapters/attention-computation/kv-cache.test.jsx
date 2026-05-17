import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import KVCache from "../../../chapters/attention-computation/kv-cache.jsx";

afterEach(() => cleanup());

describe("KVCache (10.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(KVCache(makeCtx({ sub: 0 })))).not.toThrow();
  });
});

describe("KVCache sub-steps", () => {
  it("sub 0 shows naive generation piling up wasted work on 'I love cats'", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("Naive");
    expect(text).toContain("I");
    expect(text).toContain("love");
    expect(text).toContain("cats");
    expect(text.toLowerCase()).toMatch(/wast(e|ed|eful)/);
    // Work-bars SVG: 6 block rects (1+2+3 for three steps)
    const svg = container.querySelector("svg[data-viz='work-bars']");
    expect(svg).toBeTruthy();
    const blocks = svg.querySelectorAll("rect[data-block]");
    expect(blocks.length).toBe(6);
  });

  it("sub 1 shows same input plus same weights equals identical output", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("q_I");
    // Two identical vector values shown side by side
    const matches = text.match(/\[0\.5, 0\.2\]/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(text.toLowerCase()).toContain("identical");
  });

  it("sub 2 shows the matrix view with only the last row highlighted", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("last row");
    expect(text).toContain("q_cats");
    // Matrix-view SVG present with <desc>
    const svg = container.querySelector("svg[data-viz='matrix-view']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
    expect(desc.textContent.length).toBeGreaterThan(20);
    // Counter numbers: 18 cells total, 6 needed, 12 wasted
    expect(text).toMatch(/18/);
    expect(text).toMatch(/\b6\b/);
    expect(text).toMatch(/12/);
  });

  it("sub 3 shows Q drop vs K and V cache decision cards", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("KV cache");
    expect(text).toContain("Q");
    expect(text).toContain("K");
    expect(text).toContain("V");
    expect(text.toLowerCase()).toMatch(/don't cache|dont cache|never cache|don.t cache/);
    expect(text.toLowerCase()).toContain("cache it");
  });

  it("sub 4 shows the growing-notebook cache frames with append arrows", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("append");
    expect(text.toLowerCase()).toContain("notebook");
    const svg = container.querySelector("svg[data-viz='notebook']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
  });

  it("sub 5 shows before vs after for step 3 with identical output", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("Without Cache");
    expect(text).toContain("With Cache");
    expect(text.toLowerCase()).toContain("identical");
    expect(text).toContain("q_cats");
    expect(text).toContain("k_cats");
    expect(text).toContain("v_cats");
  });

  it("sub 6 traces the worked example with d=2 and final output [0.447, 0.603]", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("0.447");
    expect(text).toContain("0.603");
    expect(text).toContain("d = 2");
    expect(text.toLowerCase()).toContain("cache");
  });

  it("sub 7 shows LLaMA 70B memory cost with 10.7 GB and memory bar SVG", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text).toContain("LLaMA 70B");
    expect(text).toContain("10.7 GB");
    expect(text).toContain("d_model");
    expect(text).toContain("layers");
    const svg = container.querySelector("svg[data-viz='memory-bar']");
    expect(svg).toBeTruthy();
  });

  it("sub 8 shows the final memory-for-speed tradeoff with 660x numbers", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(KVCache(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("memory");
    expect(text.toLowerCase()).toContain("speed");
    expect(text).toMatch(/660/);
  });
});
