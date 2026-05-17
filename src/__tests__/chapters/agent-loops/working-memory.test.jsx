import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WorkingMemory from "../../../chapters/agent-loops/working-memory.jsx";

afterEach(() => cleanup());

describe("WorkingMemory (13.25)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WorkingMemory(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces scratchpad concept", () => {
    const { container } = render(WorkingMemory(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/scratchpad|note/i);
    expect(container.textContent).toMatch(/reason|observ|loop/i);
    expect(container.textContent).toMatch(/A Note Pad The Model Keeps/i);
  });

  it("sub=1 shows the scratchpad shape", () => {
    const { container } = render(WorkingMemory(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/current_goal|customer_context/i);
    expect(container.textContent).toMatch(/completed_steps/i);
    expect(container.textContent).toMatch(/next_step/i);
    expect(container.textContent).toMatch(/What Goes In The Scratchpad/i);
  });

  it("sub=2 shows update across iterations", () => {
    const { container } = render(WorkingMemory(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/iter|iteration/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
    expect(container.textContent).toMatch(/Updated Every Iteration/i);
  });

  it("sub=3 explains discard at task end", () => {
    const { container } = render(WorkingMemory(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/discard|delete|end/i);
    expect(container.textContent).toMatch(/promote|long.?term/i);
    expect(container.textContent).toMatch(/Working Memory Dies/i);
  });

  it("sub=4 compares working vs long-term", () => {
    const { container } = render(WorkingMemory(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/working|long.?term/i);
    expect(container.textContent).toMatch(/persist|discard/i);
    expect(container.textContent).toMatch(/Working vs Long-Term/i);
  });
});
