import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RefreshSync from "../../../chapters/rag-ingestion/refresh-sync.jsx";

afterEach(() => cleanup());

describe("RefreshSync (20.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RefreshSync(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(RefreshSync(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(RefreshSync(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(RefreshSync(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(RefreshSync(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders webhook timeline label inside foreignObject so it wraps", () => {
    const { container } = render(RefreshSync(makeCtx({ sub: 2 })));
    const labelFO = Array.from(container.querySelectorAll("foreignObject")).find((fo) =>
      fo.textContent.includes("Re-Parse + Re-Chunk + Re-Embed"),
    );
    expect(labelFO).toBeTruthy();
  });

  it("gives webhook timeline rows enough height for body text to not clip", () => {
    const { container } = render(RefreshSync(makeCtx({ sub: 2 })));
    const bodyFO = Array.from(container.querySelectorAll("foreignObject")).find((fo) =>
      fo.textContent.includes("Parser, chunker, and embedder run end-to-end"),
    );
    expect(bodyFO).toBeTruthy();
    expect(Number(bodyFO.getAttribute("height"))).toBeGreaterThanOrEqual(50);
  });

  it("centers webhook timeline box content vertically and horizontally via flex", () => {
    const { container } = render(RefreshSync(makeCtx({ sub: 2 })));
    const fos = Array.from(container.querySelectorAll("foreignObject"));
    expect(fos.length).toBeGreaterThan(0);
    fos.forEach((fo) => {
      const inner = fo.firstElementChild;
      expect(inner).toBeTruthy();
      expect(inner.style.display).toBe("flex");
      expect(inner.style.justifyContent).toBe("center");
      expect(inner.style.alignItems).toBe("center");
    });
  });
});
