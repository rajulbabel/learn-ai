import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import QKVClassroom from "../../../chapters/attention-qkv/qkv-classroom.jsx";

afterEach(() => cleanup());

describe("QKVClassroom (6.5)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(QKVClassroom(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(QKVClassroom(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(QKVClassroom(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=0 shows classroom intro", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("classroom");
  });

  it("sub=0 shows Riya", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 0 })));
    expect(container.textContent).toContain("Riya");
  });

  it("sub=1 shows Query, Key, Value labels", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Query");
    expect(container.textContent).toContain("Key");
    expect(container.textContent).toContain("Value");
  });

  it("sub=1 shows student names", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Priya");
    expect(container.textContent).toContain("Aman");
    expect(container.textContent).toContain("Rahul");
  });

  it("sub=1 shows Aman hands over notes", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 1 })));
    expect(container.textContent).toContain("Aman hands over");
  });

  it("sub=2 shows mapping to attention", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("Mapping to attention");
  });

  it("shows SubBtn when sub < 2", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 0 })));
    expect(container.querySelector("button")).not.toBeNull();
  });

  it("hides SubBtn when sub >= 2", () => {
    const { container } = render(QKVClassroom(makeCtx({ sub: 2 })));
    expect(container.querySelector("button")).toBeNull();
  });
});
