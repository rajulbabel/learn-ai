import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyProtocols from "../../../chapters/agent-tools/why-protocols.jsx";

afterEach(() => cleanup());

describe("WhyProtocols (25.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyProtocols(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows the ad-hoc sprawl", () => {
    const { container } = render(WhyProtocols(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/ad.?hoc|sprawl|tangle/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/tool/i);
    expect(container.textContent).toMatch(/30/);
  });

  it("sub=1 explains M+N hub model", () => {
    const { container } = render(WhyProtocols(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/protocol/i);
    expect(container.textContent).toMatch(/hub|center/i);
    expect(container.textContent).toMatch(/m \+ n|m plus n|11|30/i);
    expect(container.textContent).toMatch(/hub and spoke/i);
  });

  it("sub=2 lists MCP, A2A, OpenAPI", () => {
    const { container } = render(WhyProtocols(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/OpenAPI|HTTP/i);
    expect(container.textContent).toMatch(/Model Context Protocol/i);
  });

  it("sub=3 shows when protocol pays off", () => {
    const { container } = render(WhyProtocols(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3|few|many/i);
    expect(container.textContent).toMatch(/decision|production/i);
    expect(container.textContent).toMatch(/Protocol Mesh/i);
  });

  it("sub=4 frames protocol as trust boundary", () => {
    const { container } = render(WhyProtocols(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/trust|sandbox|boundary/i);
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Sandbox Contract/i);
  });
});
