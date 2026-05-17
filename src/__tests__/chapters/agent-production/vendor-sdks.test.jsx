import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import VendorSdks from "../../../chapters/agent-production/vendor-sdks.jsx";

afterEach(() => cleanup());

describe("VendorSdks (13.50)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(VendorSdks(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 introduces vendor-native frameworks", () => {
    const { container } = render(VendorSdks(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Claude Agent SDK/);
    expect(container.textContent).toMatch(/OpenAI Agents|Swarm/);
    expect(container.textContent).toMatch(/loop|hand.?off|primitive/i);
    expect(container.textContent).toMatch(/When The Model Vendor Ships The Framework/i);
  });

  it("sub=1 shows Claude Agent SDK shape", () => {
    const { container } = render(VendorSdks(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/AgentLoop|loop/i);
    expect(container.textContent).toMatch(/system_prompt|tools/);
    expect(container.textContent).toMatch(/refund|INV.?9924/);
    expect(container.textContent).toMatch(/Loop Primitive/i);
  });

  it("sub=2 shows OpenAI Agents shape", () => {
    const { container } = render(VendorSdks(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/OpenAI Agents|Runner/);
    expect(container.textContent).toMatch(/handoffs/);
    expect(container.textContent).toMatch(/triage|billing/i);
    expect(container.textContent).toMatch(/Hand-Off Primitive/i);
  });

  it("sub=3 compares the two side-by-side", () => {
    const { container } = render(VendorSdks(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/loop|hand.?off/i);
    expect(container.textContent).toMatch(/lock.?in|portab/i);
    expect(container.textContent).toMatch(/Two Primitives, Two Mental Models/i);
  });

  it("sub=4 lists when to pick vendor SDK", () => {
    const { container } = render(VendorSdks(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/vendor|committed/i);
    expect(container.textContent).toMatch(/multi.?vendor|switch/i);
    expect(container.textContent).toMatch(/Use The Vendor SDK When/i);
  });
});
