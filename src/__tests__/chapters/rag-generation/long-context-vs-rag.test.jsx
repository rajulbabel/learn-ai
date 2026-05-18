import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LongContextVsRAG from "../../../chapters/rag-generation/long-context-vs-rag.jsx";

afterEach(() => cleanup());

describe("LongContextVsRAG (12.30)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(LongContextVsRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 explains switch to the 200-page product manual corpus", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/200-?page|200 pages?/i);
    expect(container.textContent).toMatch(/context window|fits/i);
    expect(container.textContent).toMatch(/secondary corpus|different corpus|product manual/i);
  });

  it("sub=1 shows the stuff-everything long-context approach with cost and latency", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stuff|everything/i);
    expect(container.textContent).toMatch(/120k|200k|long-?context/i);
    expect(container.textContent).toMatch(/lost in the middle|12\.23/i);
    expect(container.textContent).toMatch(/cost|\$0\.36|latency/i);
  });

  it("sub=2 shows the RAG-only approach as cheaper alternative", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/RAG.?only|retrieve/i);
    expect(container.textContent).toMatch(/chunk|top-?5/i);
    expect(container.textContent).toMatch(/cheaper|\$0\.008|latency/i);
  });

  it("sub=3 shows the hybrid retrieve-broadly approach", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/top-?30|broadly|50k/i);
    expect(container.textContent).toMatch(/front-?load|sandwich|12\.23/i);
  });

  it("sub=4 shows the cost / latency / accuracy comparison chart", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/accuracy/i);
    expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
  });

  it("sub=5 shows the decision matrix with hybrid as production default", () => {
    const { container } = render(LongContextVsRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/decision|when/i);
    expect(container.textContent).toMatch(/production default|default|niche/i);
    expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
  });
});
