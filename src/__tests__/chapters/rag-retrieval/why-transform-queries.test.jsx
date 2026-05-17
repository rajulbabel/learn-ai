import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyTransformQueries from "../../../chapters/rag-retrieval/why-transform-queries.jsx";

afterEach(() => cleanup());

describe("WhyTransformQueries (12.18)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyTransformQueries(makeCtx({ sub: 0 })))).not.toThrow();
  });
  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyTransformQueries(makeCtx({ sub: 1 })))).not.toThrow();
  });
  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyTransformQueries(makeCtx({ sub: 2 })))).not.toThrow();
  });
  it("renders at sub=3 without throwing", () => {
    expect(() => render(WhyTransformQueries(makeCtx({ sub: 3 })))).not.toThrow();
  });
  it("renders at sub=4 without throwing", () => {
    expect(() => render(WhyTransformQueries(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 frames user query as rarely optimal and shows a mismatch example", () => {
    const { container } = render(WhyTransformQueries(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user|query/i);
    expect(container.textContent).toMatch(/sign in|log in|login/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows lexical mismatch examples and routes to 12.19 and 12.20", () => {
    const { container } = render(WhyTransformQueries(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lexical|mismatch/i);
    expect(container.textContent).toMatch(/sign in|log in|cancel|delete/i);
    expect(container.textContent).toMatch(/12\.19/);
    expect(container.textContent).toMatch(/12\.20/);
  });

  it("sub=2 shows ambiguity with multiple interpretations", () => {
    const { container } = render(WhyTransformQueries(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ambigu/i);
    expect(container.textContent).toMatch(/export/i);
    expect(container.textContent).toMatch(/12\.20|12\.21/);
  });

  it("sub=3 shows multi-intent on the cancel-and-refund query", () => {
    const { container } = render(WhyTransformQueries(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multi-?intent|two intents/i);
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/12\.21/);
  });

  it("sub=4 previews the four strategies and maps to 12.19-12.21", () => {
    const { container } = render(WhyTransformQueries(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/multi-?query/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/routing/i);
  });
});
