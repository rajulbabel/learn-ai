import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LateChunking from "../../../chapters/rag-foundations/late-chunking.jsx";

afterEach(() => cleanup());

describe("LateChunking (12.10)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LateChunking(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(LateChunking(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(LateChunking(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(LateChunking(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(LateChunking(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 frames cross-chunk reference loss on the Sarah doc", () => {
    const { container } = render(LateChunking(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cross[- ]?chunk/i);
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/pronoun|reference|she/i);
  });

  it("sub=1 contrasts chunk-then-embed vs embed-then-chunk", () => {
    const { container } = render(LateChunking(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunk[- ]?then[- ]?embed/i);
    expect(container.textContent).toMatch(/embed[- ]?then[- ]?chunk|late chunk/i);
    expect(container.textContent).toMatch(/attention|whole doc|all tokens/i);
    expect(container.textContent).toMatch(/pool/i);
  });

  it("sub=2 traces the late-chunking pass on doc-1", () => {
    const { container } = render(LateChunking(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/chunk 3|v_chunk3/i);
  });

  it("sub=3 shows the retrieval-score reversal", () => {
    const { container } = render(LateChunking(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/0\.\d+/);
    expect(container.textContent).toMatch(/chunk 3/i);
    expect(container.textContent).toMatch(/Sarah/);
  });

  it("sub=4 lists pros, cons, and notes Jina 2024 origin", () => {
    const { container } = render(LateChunking(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Jina/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/pronoun|anaphora|reference/i);
    expect(container.textContent).toMatch(/token[- ]?level|hidden state/i);
  });
});
