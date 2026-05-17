import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import TrainingPipeline from "../../../chapters/scaling/training-pipeline.jsx";

afterEach(() => cleanup());

describe("TrainingPipeline (3.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(TrainingPipeline(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=1 covers pretraining phase", () => {
    const { container } = render(TrainingPipeline(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Pretraining");
  });

  it("sub=2 covers SFT phase", () => {
    const { container } = render(TrainingPipeline(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("SFT");
  });

  it("sub=3 covers RLHF phase", () => {
    const { container } = render(TrainingPipeline(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("RLHF");
  });

  it("sub=4 shows optional upgrades including distillation and CLIP", () => {
    const { container } = render(TrainingPipeline(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("Distillation");
    expect(text).toContain("CLIP");
  });
});
