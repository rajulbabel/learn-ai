import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DecisionFramework from "../../../chapters/vector-systems/decision-framework.jsx";

afterEach(() => cleanup());

describe("DecisionFramework (18.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(DecisionFramework(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows the decision flowchart with the axes", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/flowchart|decision/i);
    expect(container.textContent).toMatch(/data size|ops|filter|cost/i);
  });

  it("sub=1 shows the size buckets", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/1M|100M|1B/);
    expect(container.textContent).toMatch(/bucket|size/i);
  });

  it("sub=2 shows the ops preference axis", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ops|preference/i);
    expect(container.textContent).toMatch(/Pinecone|Qdrant|Milvus|pgvector/);
  });

  it("sub=3 shows the filter complexity axis", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/simple|complex|analytical/i);
  });

  it("sub=4 shows the design-review checklist", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/checklist|questions/i);
    expect(container.textContent).toMatch(/size|QPS|P99|selectivity|availability/i);
  });

  it("sub=5 recap: learner can answer Qdrant vs Pinecone from first principles", () => {
    const { container } = render(DecisionFramework(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/recap|first principles|Qdrant|Pinecone/i);
    expect(container.textContent).toMatch(/section|learn|master/i);
  });
});
