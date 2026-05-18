import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import LostInTheMiddle from "../../../chapters/rag-generation/lost-in-the-middle.jsx";

afterEach(() => cleanup());

describe("LostInTheMiddle (12.23)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(LostInTheMiddle(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(LostInTheMiddle(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(LostInTheMiddle(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(LostInTheMiddle(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(LostInTheMiddle(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=0 shows the U-shaped accuracy curve with Liu et al reference", () => {
    const { container } = render(LostInTheMiddle(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/U-?shaped|middle|position/i);
    expect(container.textContent).toMatch(/accuracy/i);
    expect(container.textContent).toMatch(/Liu|2023/i);
  });

  it("sub=1 shows the Pro+SSO query failing when answer chunk is in middle", () => {
    const { container } = render(LostInTheMiddle(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/SSO/);
    expect(container.textContent).toMatch(/Pro|Enterprise/);
    expect(container.textContent).toMatch(/position|chunk 5|middle/i);
  });

  it("sub=2 explains the front-load / relevance-first strategy", () => {
    const { container } = render(LostInTheMiddle(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/front-?load|relevance.?first|strategy 1|first strategy/i);
  });

  it("sub=3 explains the sandwich strategy with best at start and end", () => {
    const { container } = render(LostInTheMiddle(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/sandwich/i);
    expect(container.textContent).toMatch(/start and end|front and back/i);
  });

  it("sub=4 covers failure modes including reference to multi-hop 12.25", () => {
    const { container } = render(LostInTheMiddle(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-?fact|multi-?hop|long/i);
    expect(container.textContent).toMatch(/rerank|fetch|benchmark/i);
    expect(container.textContent).toMatch(/12\.25|multi-hop/i);
  });
});
