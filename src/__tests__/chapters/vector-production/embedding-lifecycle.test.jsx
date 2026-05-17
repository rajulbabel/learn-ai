import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EmbeddingLifecycle from "../../../chapters/vector-production/embedding-lifecycle.jsx";

afterEach(() => cleanup());

describe("EmbeddingLifecycle (11.27)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 frames the indexed-two-years-ago scenario", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/500M|500 million/);
    expect(container.textContent).toMatch(/ada[- ]?002|text-embedding|two years/i);
    expect(container.textContent).toMatch(/upgrade|moved/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 highlights the dimension mismatch", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/1536/);
    expect(container.textContent).toMatch(/3072/);
    expect(container.textContent).toMatch(/dimension|dims|mismatch/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 describes the re-embed cost path", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/re[- ]?embed/i);
    expect(container.textContent).toMatch(/source/i);
    expect(container.textContent).toMatch(/cost|\$|bill/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 describes parallel indexes during migration", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parallel|dual/i);
    expect(container.textContent).toMatch(/serve|traffic/i);
    expect(container.textContent).toMatch(/cutover|flip|migrate/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 covers the pin-the-old-model option", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/pin|freeze/i);
    expect(container.textContent).toMatch(/deprecated|drift|decay/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(EmbeddingLifecycle(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 lays out drift monitoring", () => {
    const { container } = render(EmbeddingLifecycle(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/drift|regression|eval/i);
    expect(container.textContent).toMatch(/monitor|ground[- ]?truth/i);
    expect(container.textContent).toMatch(/recall|quality/i);
  });
});
