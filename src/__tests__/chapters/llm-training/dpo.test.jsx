import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import DPO from "../../../chapters/llm-training/dpo.jsx";

afterEach(() => cleanup());

describe("DPO (2.9)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(DPO(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows RLHF requires 4 models and explains why it is painful", () => {
    const { container } = render(DPO(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("4 models");
    expect(text).toContain("reward model");
    expect(text).toContain("policy");
    expect(text).toContain("Reference");
  });

  it("sub=0 does NOT show the DPO insight yet", () => {
    const { container } = render(DPO(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).not.toContain("Skip the Reward Model");
  });

  it("sub=1 explains DPO skips the reward model and learns directly from preferences", () => {
    const { container } = render(DPO(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Skip the Reward Model");
    expect(text).toContain("preference");
  });

  it("sub=1 does NOT show concrete probabilities yet", () => {
    const { container } = render(DPO(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).not.toContain("0.030");
  });

  it("sub=2 shows a concrete prompt with preferred and rejected responses", () => {
    const { container } = render(DPO(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Python");
    expect(text).toContain("Rust");
    expect(text).toContain("Preferred");
    expect(text).toContain("Rejected");
  });

  it("sub=3 shows the log-ratio computation with concrete probabilities", () => {
    const { container } = render(DPO(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("log");
    expect(text).toContain("reference");
    expect(text).toContain("0.030");
  });

  it("sub=3 does NOT show the full formula yet", () => {
    const { container } = render(DPO(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).not.toContain("sigmoid");
  });

  it("sub=4 shows the full DPO loss formula with sigmoid and worked numbers", () => {
    const { container } = render(DPO(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("sigmoid");
    expect(text).toContain("Loss");
    expect(text).toContain("beta");
  });

  it("sub=5 explains beta as a safety leash with different values", () => {
    const { container } = render(DPO(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("beta");
    expect(text).toContain("0.1");
    expect(text).toContain("0.5");
  });

  it("sub=6 shows a side-by-side RLHF vs DPO comparison", () => {
    const { container } = render(DPO(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("RLHF");
    expect(text).toContain("DPO");
    expect(text).toContain("2 models");
  });
});
