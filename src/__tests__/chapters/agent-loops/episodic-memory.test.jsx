import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EpisodicMemory from "../../../chapters/agent-loops/episodic-memory.jsx";

afterEach(() => cleanup());

describe("EpisodicMemory (13.26)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EpisodicMemory(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows time-stamped events", () => {
    const { container } = render(EpisodicMemory(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/episode|event/i);
    expect(container.textContent).toMatch(/2026|timestamp|date/i);
    expect(container.textContent).toMatch(/alice|password reset/i);
    expect(container.textContent).toMatch(/Episodes: Time-Stamped Events/i);
  });

  it("sub=1 back-references Section 11 vector storage", () => {
    const { container } = render(EpisodicMemory(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector|embedding/i);
    expect(container.textContent).toMatch(/section 11|11\.6|11\.7|HNSW/i);
    expect(container.textContent).toMatch(/Stored As Vectors/i);
  });

  it("sub=2 shows retrieval at conversation start", () => {
    const { container } = render(EpisodicMemory(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev|recall/i);
    expect(container.textContent).toMatch(/system prompt|top.?3|top.?k/i);
    expect(container.textContent).toMatch(/Recall Before Reasoning/i);
  });

  it("sub=3 shows the entry shape", () => {
    const { container } = render(EpisodicMemory(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/timestamp/i);
    expect(container.textContent).toMatch(/embedding/i);
    expect(container.textContent).toMatch(/Event Log Entry/i);
  });

  it("sub=4 explains pruning policy", () => {
    const { container } = render(EpisodicMemory(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prune|forget/i);
    expect(container.textContent).toMatch(/12 months|age|summariz/i);
    expect(container.textContent).toMatch(/Memory Has To Forget/i);
  });
});
