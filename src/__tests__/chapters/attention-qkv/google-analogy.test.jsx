import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import GoogleAnalogy from "../../../chapters/attention-qkv/google-analogy.jsx";

afterEach(() => cleanup());

describe("GoogleAnalogy (6.8)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(GoogleAnalogy(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(GoogleAnalogy(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=0 shows Google Search header", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Google Search");
  });

  it("sub=0 shows Query, Key, Value, Dot Product tags", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Query");
    expect(container.textContent).toContain("Key");
    expect(container.textContent).toContain("Value");
    expect(container.textContent).toContain("Dot Product");
  });

  it("sub=0 shows search query step", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("search query");
  });

  it("sub=1 shows three analogies summary", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Three analogies");
  });

  it("sub=1 shows classroom, restaurant, google references", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Classroom");
    expect(container.textContent).toContain("Restaurant");
    expect(container.textContent).toContain("Google");
  });

  it("shows SubBtn when sub < 1", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 1", () => {
    const { container } = render(GoogleAnalogy(makeCtx({ sub: 1 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
