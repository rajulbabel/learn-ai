import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import WhyKVDifferent from "../../../chapters/attention-qkv/why-kv-different.jsx";

afterEach(() => cleanup());

describe("WhyKVDifferent (6.7)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(WhyKVDifferent(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(WhyKVDifferent(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(WhyKVDifferent(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=0 shows restaurant analogy", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("restaurant");
  });

  it("sub=0 shows Key and Value labels", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Key");
    expect(container.textContent).toContain("Value");
  });

  it("sub=0 shows menu description as Key", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("menu description");
  });

  it("sub=1 shows Key and Value same thing scenario", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Key and Value were the same");
  });

  it("sub=1 shows useless message", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("useless");
  });

  it("sub=2 shows cat example", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("cat");
  });

  it("sub=2 shows Key helped find, Value is what got", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("FIND");
    expect(container.textContent).toContain("GOT");
  });

  it("shows SubBtn when sub < 2", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 2", () => {
    const { container } = render(WhyKVDifferent(makeCtx({ sub: 2 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
