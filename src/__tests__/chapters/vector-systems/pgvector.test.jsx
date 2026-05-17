import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Pgvector from "../../../chapters/vector-systems/pgvector.jsx";

afterEach(() => cleanup());

describe("Pgvector (11.31)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(Pgvector(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=0 frames pgvector as a Postgres extension", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Postgres/i);
    expect(container.textContent).toMatch(/extension/i);
    expect(container.textContent).toMatch(/vector/i);
  });

  it("sub=1 shows SQL ALTER TABLE and cosine distance operator", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ALTER TABLE|ADD COLUMN/i);
    expect(container.textContent).toMatch(/vector\(768\)|768/);
    expect(container.textContent).toMatch(/<=>|cosine/i);
  });

  it("sub=2 describes HNSW and IVFFlat index types", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/HNSW/i);
    expect(container.textContent).toMatch(/IVFFlat|IVF/i);
    expect(container.textContent).toMatch(/SQL|tuning|parameters/i);
  });

  it("sub=3 highlights inherited Postgres features", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/transaction|ACID/i);
    expect(container.textContent).toMatch(/SQL join|join/i);
    expect(container.textContent).toMatch(/metadata/i);
  });

  it("sub=4 names the good-fit workloads", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/10M|under 10M/i);
    expect(container.textContent).toMatch(/metadata/i);
    expect(container.textContent).toMatch(/existing|Postgres team/i);
  });

  it("sub=5 names the bad-fit workloads", () => {
    const { container } = render(Pgvector(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/100M|over 100M/i);
    expect(container.textContent).toMatch(/10K|QPS/i);
    expect(container.textContent).toMatch(/multi[- ]?region/i);
  });
});
