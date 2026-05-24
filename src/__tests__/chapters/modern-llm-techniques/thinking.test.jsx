import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Thinking from "../../../chapters/modern-llm-techniques/thinking.jsx";

afterEach(() => cleanup());

describe("Thinking (10.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Thinking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows before/after comparison with 23 x 47", () => {
    const { container } = render(Thinking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/23/);
    expect(container.textContent).toMatch(/47/);
    expect(container.textContent).toMatch(/1081/);
  });

  it("sub=1 shows unchanged-architecture checklist", () => {
    const { container } = render(Thinking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/unchanged|Every piece/i);
    expect(container.textContent).toMatch(/Tokenizer/);
    expect(container.textContent).toMatch(/Attention/);
  });

  it("sub=2 clarifies that both modes loop", () => {
    const { container } = render(Thinking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop/i);
    expect(container.textContent).toMatch(/same loop|more.*loop|longer/i);
  });

  it("sub=3 shows how think/</think> tokens work", () => {
    const { container } = render(Thinking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/think/);
    expect(container.textContent).toMatch(/probabilit/i);
  });

  it("sub=4 shows test-time compute scaling", () => {
    const { container } = render(Thinking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/test-time|compute/i);
    expect(container.textContent).toMatch(/100 tokens|100,000/);
  });

  it("sub=5 shows 3-stage training pipeline", () => {
    const { container } = render(Thinking(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Pre-training/);
    expect(container.textContent).toMatch(/SFT/);
    expect(container.textContent).toMatch(/RL/);
  });

  it("sub=6 shows RL reward loop with rollouts", () => {
    const { container } = render(Thinking(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/rollout/i);
    expect(container.textContent).toMatch(/reward|PPO|GRPO/);
  });

  it("sub=7 shows training data sources", () => {
    const { container } = render(Thinking(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/checkable|verifiable/i);
    expect(container.textContent).toMatch(/synthetic|rejection/i);
  });

  it("sub=8 shows emergent behaviors", () => {
    const { container } = render(Thinking(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/emerg/i);
    expect(container.textContent).toMatch(/self-correct|double-check|verify/i);
  });

  it("sub=9 shows honest scope - where reasoning helps and doesn't", () => {
    const { container } = render(Thinking(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/Math|code|logic/i);
    expect(container.textContent).toMatch(/creative|empathy|open-ended/i);
  });
});
