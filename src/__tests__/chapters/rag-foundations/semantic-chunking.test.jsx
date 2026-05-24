import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SemanticChunking from "../../../chapters/rag-foundations/semantic-chunking.jsx";

afterEach(() => cleanup());

describe("SemanticChunking (20.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SemanticChunking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(SemanticChunking(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(SemanticChunking(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(SemanticChunking(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(SemanticChunking(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 frames the no-structural-markers gap", () => {
    const { container } = render(SemanticChunking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no structural|no headings|no markers|flat/i);
    expect(container.textContent).toMatch(/semantic|topic shift/i);
  });

  it("sub=1 embeds every sentence", () => {
    const { container } = render(SemanticChunking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/12 sentences?|12 vectors?/i);
  });

  it("sub=2 plots cosine similarity with a threshold", () => {
    const { container } = render(SemanticChunking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/threshold|0\.7/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 derives 2 chunks from the cosine dip", () => {
    const { container } = render(SemanticChunking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/2 chunks?|two chunks?/i);
    expect(container.textContent).toMatch(/creating|revoking/i);
  });

  it("sub=4 quantifies the embed-before-chunk cost", () => {
    const { container } = render(SemanticChunking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|expensive/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/structural|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/\$|10x|50x|million|M docs/i);
  });
});
