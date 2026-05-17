import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EmbeddingModelChoice from "../../../chapters/rag-retrieval/embedding-model-choice.jsx";

afterEach(() => cleanup());

describe("EmbeddingModelChoice (12.14)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 4 })))).not.toThrow();
  });
  it("renders at sub=5 without throwing", () => {
    expect(() => render(EmbeddingModelChoice(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames embedding model as recall ceiling and references Section 5.2", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding model/i);
    expect(container.textContent).toMatch(/section 5\.2|5\.2/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 shows the five-axis decision matrix with named models", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/OpenAI/i);
    expect(container.textContent).toMatch(/Cohere/i);
    expect(container.textContent).toMatch(/BGE/i);
    expect(container.textContent).toMatch(/SBERT/i);
    expect(container.textContent).toMatch(/Voyage/i);
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/context/i);
  });

  it("sub=2 shows dimension memory tradeoff at common dims", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1024/);
    expect(container.textContent).toMatch(/3072/);
    expect(container.textContent).toMatch(/memory|GB/i);
    expect(container.textContent).toMatch(/diminish|marginal/i);
  });

  it("sub=3 contrasts multilingual vs English-only and mentions 12.15 for domain", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/english/i);
    expect(container.textContent).toMatch(/12\.15/);
  });

  it("sub=4 shows cost math at 100M tokens with a self-host comparison", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/100M|100 million/i);
    expect(container.textContent).toMatch(/\$/);
    expect(container.textContent).toMatch(/self-?host|managed/i);
  });

  it("sub=5 surfaces MTEB caveat and a decision flow", () => {
    const { container } = render(EmbeddingModelChoice(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/MTEB/);
    expect(container.textContent).toMatch(/benchmark|leaderboard/i);
    expect(container.textContent).toMatch(/your data|own data/i);
  });
});
