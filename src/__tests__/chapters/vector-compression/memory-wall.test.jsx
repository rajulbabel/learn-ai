import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import MemoryWall from "../../../chapters/vector-compression/memory-wall.jsx";

afterEach(() => cleanup());

describe("MemoryWall (11.12)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(MemoryWall(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 calculates 3 KB per vector at d=768 float32", () => {
    const { container } = render(MemoryWall(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/4 bytes|float32/i);
    expect(container.textContent).toMatch(/3 KB|3072/);
  });

  it("sub=1 shows a scaling table through 1B", () => {
    const { container } = render(MemoryWall(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/300 GB/);
    expect(container.textContent).toMatch(/3 TB|TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
  });

  it("sub=2 adds HNSW graph overhead", () => {
    const { container } = render(MemoryWall(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/overhead|100 bytes/i);
  });

  it("sub=3 touches real server economics", () => {
    const { container } = render(MemoryWall(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/r7i|768 GB|\$/);
  });

  it("sub=4 teases four compression techniques", () => {
    const { container } = render(MemoryWall(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/scalar/i);
    expect(container.textContent).toMatch(/PQ|product/i);
    expect(container.textContent).toMatch(/binary/i);
    expect(container.textContent).toMatch(/Matryoshka/i);
  });
});
