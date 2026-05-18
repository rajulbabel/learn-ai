import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import SelfRAG from "../../../chapters/rag-generation/self-rag.jsx";

afterEach(() => cleanup());

describe("SelfRAG (12.26)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(SelfRAG(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 shows when to retrieve vs not", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/always.?retrieve|never.?retrieve|decide/i);
  });

  it("sub=1 lists the four Self-RAG special tokens", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/<retrieve>/);
    expect(container.textContent).toMatch(/<no-retrieve>/);
    expect(container.textContent).toMatch(/<isrel>/);
    expect(container.textContent).toMatch(/<issup>/);
  });

  it("sub=2 shows the token emission timeline", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/timeline|token/i);
    expect(container.textContent).toMatch(/<(retrieve|isrel|issup)>/);
  });

  it("sub=3 shows the retrieve/no-retrieve gate with RL/instruction tuning reference", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/gate|decision/i);
    expect(container.textContent).toMatch(/<retrieve>|<no-retrieve>|retrieve/i);
    expect(container.textContent).toMatch(/RL|instruction.?tun|reinforcement/i);
  });

  it("sub=4 shows self-critique with isrel and issup token outputs", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/isrel|<isrel>/i);
    expect(container.textContent).toMatch(/issup|<issup>/i);
    expect(container.textContent).toMatch(/RELEVANT|IRRELEVANT|SUPPORTED/);
  });

  it("sub=5 lists wins and limits including fine-tune requirement", () => {
    const { container } = render(SelfRAG(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/wins|limits|tradeoff/i);
    expect(container.textContent).toMatch(/fine-?tune|train/i);
  });
});
