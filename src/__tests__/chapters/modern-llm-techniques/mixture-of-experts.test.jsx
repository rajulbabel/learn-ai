import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MixtureOfExperts from "../../../chapters/modern-llm-techniques/mixture-of-experts.jsx";

afterEach(() => cleanup());

describe("MixtureOfExperts (10.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MixtureOfExperts(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows motivation comparing dense vs MoE", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/47B/);
    expect(container.textContent).toMatch(/13B/);
    expect(container.textContent).toMatch(/Mixtral/);
  });

  it("sub=1 shows FFN replacement with router + experts", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/Router/);
    expect(container.textContent).toMatch(/FFN/);
  });

  it("sub=1 Before card uses valid CSS (no rgba with appended hex)", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 1 })));
    const html = container.innerHTML;
    expect(html).not.toMatch(/rgba\([^)]*\)[0-9a-fA-F]{2}/);
  });

  it("sub=2 shows top-k routing with concrete example", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cat/);
    expect(container.textContent).toMatch(/0\.80/);
    expect(container.textContent).toMatch(/top-2|top 2/);
  });

  it("sub=3 shows load balancing problem and auxiliary loss fix", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/L_aux|auxiliary/);
    expect(container.textContent).toMatch(/balanc/i);
  });

  it("sub=4 shows Mixtral 8x7B parameter breakdown", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/46\.7B|46\.7/);
    expect(container.textContent).toMatch(/layers?/i);
  });

  it("sub=5 shows memory vs compute tradeoff", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/94 GB|94GB/);
    expect(container.textContent).toMatch(/26 GFLOPs|GFLOP/);
  });

  it("sub=6 shows real MoE model examples", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Mixtral/);
    expect(container.textContent).toMatch(/DeepSeek/);
    expect(container.textContent).toMatch(/Qwen/);
  });

  it("sub=7 shows honest tradeoffs of MoE", () => {
    const { container } = render(MixtureOfExperts(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/edge|deployment/i);
    expect(container.textContent).toMatch(/free lunch|tradeoff/i);
  });
});
