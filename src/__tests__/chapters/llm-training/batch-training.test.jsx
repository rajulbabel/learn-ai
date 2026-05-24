import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BatchTraining from "../../../chapters/llm-training/batch-training.jsx";

afterEach(() => cleanup());

describe("BatchTraining (3.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(BatchTraining(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces batch training concept", () => {
    const { container } = render(BatchTraining(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("batch");
    expect(text).toContain("Efficiency");
  });

  it("sub=1 shows online vs batch training comparison", () => {
    const { container } = render(BatchTraining(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Online");
    expect(text).toContain("Batch");
    expect(text).toContain("loss=1.2");
  });

  it("sub=2 shows gradient averaging formula", () => {
    const { container } = render(BatchTraining(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("gradient");
    expect(text).toContain("avg_gradient");
  });

  it("sub=3 shows batch size tradeoffs table", () => {
    const { container } = render(BatchTraining(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("Batch size = 1");
    expect(text).toContain("Batch size = 256");
    expect(text).toContain("Batch size = 1024+");
  });
});
