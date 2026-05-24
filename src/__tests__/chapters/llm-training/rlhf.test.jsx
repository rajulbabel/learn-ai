import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import RLHF from "../../../chapters/llm-training/rlhf.jsx";

afterEach(() => cleanup());

describe("RLHF (2.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(RLHF(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces RLHF overview", () => {
    const { container } = render(RLHF(makeCtx({ sub: 0 })));
    const text = container.textContent;
    expect(text).toContain("RLHF");
    expect(text).toContain("Reinforcement Learning");
  });

  it("sub=1 shows multiple candidate responses", () => {
    const { container } = render(RLHF(makeCtx({ sub: 1 })));
    const text = container.textContent;
    expect(text).toContain("Python");
    expect(text).toContain("Rust");
    expect(text).toContain("Rank");
  });

  it("sub=2 shows human annotators ranking responses", () => {
    const { container } = render(RLHF(makeCtx({ sub: 2 })));
    const text = container.textContent;
    expect(text).toContain("Winner");
    expect(text).toContain("Reason");
  });

  it("sub=3 shows the reward model as a neural network that scores responses", () => {
    const { container } = render(RLHF(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("neural network");
    expect(text).toContain("score");
  });

  it("sub=3 shows concrete training data for the reward model with winner/loser pairs", () => {
    const { container } = render(RLHF(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("winner");
    expect(text).toContain("loser");
  });

  it("sub=3 explains what the reward model learns to detect", () => {
    const { container } = render(RLHF(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).toContain("helpful");
  });

  it("sub=3 does NOT show scored responses - those are in sub 4", () => {
    const { container } = render(RLHF(makeCtx({ sub: 3 })));
    const text = container.textContent;
    expect(text).not.toContain("score any response");
  });

  it("sub=4 shows scored responses after training", () => {
    const { container } = render(RLHF(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("score any response");
    expect(text).toContain("8.5");
  });

  it("sub=4 transitions to PPO by explaining why reward model replaces humans", () => {
    const { container } = render(RLHF(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("instant");
  });

  it("sub=4 does NOT show PPO loop - that is in sub 5", () => {
    const { container } = render(RLHF(makeCtx({ sub: 4 })));
    const text = container.textContent;
    expect(text).not.toContain("Proximal Policy Optimization");
  });

  it("sub=5 mentions PPO and shows the training loop", () => {
    const { container } = render(RLHF(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("Generate");
    expect(text).toContain("Score");
    expect(text).toContain("Compare");
    expect(text).toContain("Nudge");
  });

  it("sub=5 does NOT show KL divergence details - that is in sub 6", () => {
    const { container } = render(RLHF(makeCtx({ sub: 5 })));
    const text = container.textContent;
    expect(text).not.toContain("Kullback-Leibler");
  });

  it("sub=6 explains KL divergence with concrete bar chart comparison", () => {
    const { container } = render(RLHF(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).toContain("KL");
    expect(text).toContain("Kullback-Leibler");
    expect(text).toContain("SFT");
    expect(text).toContain("40%");
    expect(text).toContain("85%");
  });

  it("sub=6 does NOT show formula worked examples - that is in sub 7", () => {
    const { container } = render(RLHF(makeCtx({ sub: 6 })));
    const text = container.textContent;
    expect(text).not.toContain("Reward hacking");
  });

  it("sub=7 shows the formula with reward, KL, and beta", () => {
    const { container } = render(RLHF(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("Reward");
    expect(text).toContain("beta");
    expect(text).toContain("8.5");
  });

  it("sub=7 shows worked examples with concrete math", () => {
    const { container } = render(RLHF(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("0.2");
    expect(text).toContain("Reward hacking");
  });

  it("sub=7 explains why KL penalty is necessary", () => {
    const { container } = render(RLHF(makeCtx({ sub: 7 })));
    const text = container.textContent;
    expect(text).toContain("KL penalty");
    expect(text).toContain("shortcuts");
  });

  it("sub=8 explains why RLHF matters with concrete problems it solves", () => {
    const { container } = render(RLHF(makeCtx({ sub: 8 })));
    const text = container.textContent;
    expect(text).toContain("reward");
    expect(text).toContain("SFT");
  });
});
