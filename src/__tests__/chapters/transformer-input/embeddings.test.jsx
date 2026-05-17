import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Embeddings from "../../../chapters/transformer-input/embeddings.jsx";

afterEach(() => cleanup());

describe("Embeddings (5.2)", () => {
  for (let s = 0; s <= 4; s++) {
    it(`renders at sub=${s} without throwing`, () => {
      expect(() => render(Embeddings(makeCtx({ sub: s })))).not.toThrow();
    });
  }

  it("sub 0 explains need for numbers not words", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("numbers");
  });

  it("sub 1 shows tokenization stage with 'I love cats'", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Tokenization");
    expect(text).toContain("I love cats");
  });

  it("sub 2 shows token to ID lookup", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("ID");
  });

  it("sub 3 shows embedding vectors with numbers", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("Embedding");
    expect(text).toContain("512");
  });

  it("sub 4 shows summary that words are now vectors", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("position");
  });

  it("shows SubBtn at sub=0", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 0 })));
    expect(container.querySelector("[data-subbtn]")).toBeTruthy();
  });

  it("hides SubBtn at sub=4", () => {
    const { container } = render(Embeddings(makeCtx({ sub: 4 })));
    expect(container.querySelector("[data-subbtn]")).toBeFalsy();
  });
});
