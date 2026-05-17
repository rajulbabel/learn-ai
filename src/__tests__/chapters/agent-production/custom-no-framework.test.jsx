import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CustomNoFramework from "../../../chapters/agent-production/custom-no-framework.jsx";

afterEach(() => cleanup());

describe("CustomNoFramework (13.51)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CustomNoFramework(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists three reasons to roll your own", () => {
    const { container } = render(CustomNoFramework(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/control|cost|lock.?in/i);
    expect(container.textContent).toMatch(/Three Reasons To Roll Your Own/i);
  });

  it("sub=1 shows the 50-line loop", () => {
    const { container } = render(CustomNoFramework(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/history|loop|max_iter/i);
    expect(container.textContent).toMatch(/tool_calls|tool_use/);
    expect(container.textContent).toMatch(/50 Lines Of Loop/i);
  });

  it("sub=2 lists missing pieces", () => {
    const { container } = render(CustomNoFramework(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/observability/i);
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/checkpoint/i);
    expect(container.textContent).toMatch(/Missing Pieces You Now Own/i);
  });

  it("sub=3 shows when custom wins", () => {
    const { container } = render(CustomNoFramework(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/high.?volume|tight latency/i);
    expect(container.textContent).toMatch(/prototype|framework/i);
    expect(container.textContent).toMatch(/Stay Custom When/i);
  });

  it("sub=4 shows hybrid approach", () => {
    const { container } = render(CustomNoFramework(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hybrid|build some|buy some/i);
    expect(container.textContent).toMatch(/adapter|observability/i);
    expect(container.textContent).toMatch(/Build Some, Buy Some/i);
  });
});
