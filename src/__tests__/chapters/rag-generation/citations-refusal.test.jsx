import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CitationsRefusal from "../../../chapters/rag-generation/citations-refusal.jsx";

afterEach(() => cleanup());

describe("CitationsRefusal (12.24)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("renders at sub=6 without throwing", () => {
    expect(() => render(CitationsRefusal(makeCtx({ sub: 6 })))).not.toThrow();
  });

  it("sub=0 contrasts no-citation vs cited answer for account-locked query", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/verify|audit|trace/i);
    expect(container.textContent).toMatch(/\[doc-?\d+/);
  });

  it("sub=1 shows a prompt template with [doc-N] citation instruction", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
    expect(container.textContent).toMatch(/\{context\}|\{query\}/);
  });

  it("sub=2 shows structured citation JSON output", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/structured|JSON/i);
    expect(container.textContent).toMatch(/doc_id|citations|confidence/i);
  });

  it("sub=3 shows refusal instruction and 'I don't have enough information' phrase", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refuse|refusal/i);
    expect(container.textContent).toMatch(/i don'?t have enough information|don'?t invent/i);
    expect(container.textContent).toMatch(/hallucinat|guess|invent/i);
  });

  it("sub=4 introduces faithfulness with claim tracing and RAGAS reference", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/claim|trace|cited/i);
    expect(container.textContent).toMatch(/12\.31-12\.35|RAGAS/i);
  });

  it("sub=5 explains parsing [doc-N] markers back to chunks", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/parse|parser/i);
    expect(container.textContent).toMatch(/\[doc-?\d+/);
    expect(container.textContent).toMatch(/footnote|tooltip|UI|regex|extract/i);
  });

  it("sub=6 shows the production combined template with rules and refusal", () => {
    const { container } = render(CitationsRefusal(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/RULES|rules/);
    expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
    expect(container.textContent).toMatch(/i don'?t have enough information/i);
    expect(container.textContent).toMatch(/\{context\}|\{query\}/);
  });
});
