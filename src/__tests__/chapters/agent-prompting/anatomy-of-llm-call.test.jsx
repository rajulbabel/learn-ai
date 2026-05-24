import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import AnatomyOfLlmCall from "../../../chapters/agent-prompting/anatomy-of-llm-call.jsx";

afterEach(() => cleanup());

describe("AnatomyOfLlmCall (24.1)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(AnatomyOfLlmCall(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows three message roles", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/assistant/i);
  });

  it("sub=1 explains tokens and context window", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/context window/i);
  });

  it("sub=2 covers temperature / top-p / top-k", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/temperature/i);
    expect(container.textContent).toMatch(/top.?p/i);
    expect(container.textContent).toMatch(/top.?k/i);
  });

  it("sub=3 lists stop conditions and finish_reason", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/max.?tokens/i);
    expect(container.textContent).toMatch(/stop.?(reason|sequence)/i);
    expect(container.textContent).toMatch(/end.?turn/i);
  });

  it("sub=4 shows response shape with content/stop_reason/usage", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/content/i);
    expect(container.textContent).toMatch(/stop.?reason|finish.?reason/i);
    expect(container.textContent).toMatch(/usage/i);
    expect(container.textContent).toMatch(/input.?tokens/i);
    expect(container.textContent).toMatch(/output.?tokens/i);
  });

  it("sub=5 traces the complete call cycle", () => {
    const { container } = render(AnatomyOfLlmCall(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/messages/i);
    expect(container.textContent).toMatch(/request|send/i);
    expect(container.textContent).toMatch(/response|stream/i);
  });
});
