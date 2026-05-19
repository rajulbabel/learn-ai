import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import EvalDimensions from "../../../chapters/agent-evals/eval-dimensions.jsx";

afterEach(() => cleanup());

describe("EvalDimensions (28.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(EvalDimensions(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names four axes", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/safety/i);
    expect(container.textContent).toMatch(/Correctness, Latency, Cost, Safety/i);
  });

  it("sub=1 defines correctness", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/correctness|complete/i);
    expect(container.textContent).toMatch(/resolution rate|90%/i);
    expect(container.textContent).toMatch(/Did The Task Complete\?/i);
  });

  it("sub=2 shows latency percentiles", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/P50|P95|P99/i);
    expect(container.textContent).toMatch(/How Long Did It Take\?/i);
  });

  it("sub=3 shows cost breakdown", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/tokens/i);
    expect(container.textContent).toMatch(/0\.50/);
    expect(container.textContent).toMatch(/How Much Did Each Trace Consume\?/i);
  });

  it("sub=4 lists safety metrics", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/safety|refusal/i);
    expect(container.textContent).toMatch(/escalation/i);
    expect(container.textContent).toMatch(/prompt.?injection/i);
    expect(container.textContent).toMatch(/Did The Agent Refuse What It Should\?/i);
  });

  it("sub=5 shows the composite formula", () => {
    const { container } = render(EvalDimensions(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/composite|formula|score/i);
    expect(container.textContent).toMatch(/0\.5|0\.2|0\.1/);
    expect(container.textContent).toMatch(/One Number For The Dashboard/i);
  });
});
