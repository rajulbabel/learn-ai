import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RetrievalProblem from "../../../chapters/vector-foundations/retrieval-problem.jsx";

afterEach(() => cleanup());

describe("RetrievalProblem (15.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RetrievalProblem(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows embeddings and the 10-doc cat corpus", () => {
    const { container } = render(RetrievalProblem(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/5\.2|embedding/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/information about cats/i);
  });

  it("sub=1 frames the retrieval task as top-k similarity", () => {
    const { container } = render(RetrievalProblem(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/top-10|top 10/i);
    expect(container.textContent).toMatch(/similar/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 shows N scaling to 1 billion", () => {
    const { container } = render(RetrievalProblem(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/every vector/i);
  });

  it("sub=3 shows multiple production use cases", () => {
    const { container } = render(RetrievalProblem(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic search/i);
    expect(container.textContent).toMatch(/recommend|image|RAG/i);
  });

  it("sub=4 frames the section as a systems problem", () => {
    const { container } = render(RetrievalProblem(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/systems problem|retrieval.*not.*training|indexing/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 6; s++) {
      expect(() => render(RetrievalProblem(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
