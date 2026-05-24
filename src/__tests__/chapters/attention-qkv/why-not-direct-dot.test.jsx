import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyNotDirectDot from "../../../chapters/attention-qkv/why-not-direct-dot.jsx";

afterEach(() => cleanup());

describe("WhyNotDirectDot (6.4)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyNotDirectDot(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyNotDirectDot(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyNotDirectDot(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=0 shows can't dot product header", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("can't just dot product");
  });

  it("sub=0 shows pronoun and verb tags", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("pronoun");
    expect(container.textContent).toContain("verb");
  });

  it("sub=1 shows compare on different basis", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("different basis");
  });

  it("sub=1 shows looking for vs offers", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("looking for");
    expect(container.textContent).toContain("OFFERS");
  });

  it("sub=2 shows three separate views message", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("three separate views");
  });

  it("shows SubBtn when sub < 2", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 2", () => {
    const { container } = render(WhyNotDirectDot(makeCtx({ sub: 2 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
