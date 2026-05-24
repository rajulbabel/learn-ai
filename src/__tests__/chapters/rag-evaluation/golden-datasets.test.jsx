import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GoldenDatasets from "../../../chapters/rag-evaluation/golden-datasets.jsx";

afterEach(() => cleanup());

describe("GoldenDatasets (23.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(GoldenDatasets(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 explains golden datasets as ground truth", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/ground truth/i);
    expect(container.textContent).toMatch(/expected answer|expected doc|refusal/i);
  });

  it("sub=1 prescribes 30-100 hand-written initial examples", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/30[- ]?100|30 to 100|hand[- ]?written/i);
    expect(container.textContent).toMatch(/query type|categor/i);
    expect(container.textContent).toMatch(/multi[- ]?hop|aggregation|refusal|empty/i);
  });

  it("sub=2 lists the five edge-case categories", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/multi[- ]?hop/i);
    expect(container.textContent).toMatch(/empty[- ]?context|empty context/i);
    expect(container.textContent).toMatch(/ambig/i);
    expect(container.textContent).toMatch(/refusal/i);
    expect(container.textContent).toMatch(/time[- ]?sensitive/i);
  });

  it("sub=3 covers the regression set workflow", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/regression/i);
    expect(container.textContent).toMatch(/production|bug|failure/i);
    expect(container.textContent).toMatch(/reproduc|capture|tuple/i);
  });

  it("sub=4 explains LLM-bootstrapped golden datasets with human review", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/bootstrap|LLM[- ]?generated|generate/i);
    expect(container.textContent).toMatch(/human[- ]?review|reviewer/i);
    expect(container.textContent).toMatch(/never|caution|bias/i);
  });

  it("sub=5 prescribes monthly review and archive cadence", () => {
    const { container } = render(GoldenDatasets(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/monthly|cadence|review/i);
    expect(container.textContent).toMatch(/archive|obsolete/i);
    expect(container.textContent).toMatch(/coverage|freshness|pass[- ]?rate/i);
  });
});
