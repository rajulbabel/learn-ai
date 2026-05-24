import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ReActPattern from "../../../chapters/agent-loops/re-act-pattern.jsx";

afterEach(() => cleanup());

describe("ReActPattern (26.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ReActPattern(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 names Thought / Action / Observation", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/observation/i);
    expect(container.textContent).toMatch(/Reasoning \+ Acting|ReAct/);
  });

  it("sub=1 shows a thought block", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/plan|lookup_customer/i);
    expect(container.textContent).toMatch(/OLD email/i);
  });

  it("sub=2 shows an action block", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/One Action Per Iteration/i);
  });

  it("sub=3 shows an observation block", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/observ/i);
    expect(container.textContent).toMatch(/c-9924|customer_id/i);
    expect(container.textContent).toMatch(/primary_email/);
  });

  it("sub=4 traces T2 in ReAct format", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/reset_password/);
    expect(container.textContent).toMatch(/change_email/);
  });

  it("sub=5 explains ReAct vs plain tool-use", () => {
    const { container } = render(ReActPattern(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/plain|tool.?use/i);
    expect(container.textContent).toMatch(/audit|debug|trust/i);
    expect(container.textContent).toMatch(/train a smaller model/i);
  });
});
