import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RefreshSync from "../../../chapters/rag-ingestion/refresh-sync.jsx";

afterEach(() => cleanup());

describe("RefreshSync (12.6)", () => {
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
    const labelDiv = Array.from(container.querySelectorAll("foreignObject div")).find(
      (d) => d.textContent === "Re-Parse + Re-Chunk + Re-Embed",
    );
    expect(labelDiv).toBeTruthy();
  });

  it("gives webhook timeline rows enough height for body text to not clip", () => {
    const { container } = render(RefreshSync(makeCtx({ sub: 2 })));
    const bodyDiv = Array.from(container.querySelectorAll("foreignObject")).find((fo) =>
      fo.textContent.includes("Parser, chunker, and embedder run end-to-end"),
    );
    expect(bodyDiv).toBeTruthy();
    expect(Number(bodyDiv.getAttribute("height"))).toBeGreaterThanOrEqual(50);
  });
});
