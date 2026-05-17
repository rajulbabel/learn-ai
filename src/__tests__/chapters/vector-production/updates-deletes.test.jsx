import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import UpdatesDeletes from "../../../chapters/vector-production/updates-deletes.jsx";

afterEach(() => cleanup());

describe("UpdatesDeletes (11.21)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 inserts append and connect to M nearest", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/append|connect|neighbor/i);
    expect(container.textContent).toMatch(/M|16/);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 delete problem breaks routing paths", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/delete|remove/i);
    expect(container.textContent).toMatch(/path|route|hop/i);
    expect(container.textContent).toMatch(/break|lost|broken/i);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 tombstones mark-and-filter at query time", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tombstone/i);
    expect(container.textContent).toMatch(/mark|soft/i);
    expect(container.textContent).toMatch(/query time|filter/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 shows graph degradation curve at 30% deletes", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/30/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.92|0\.85|degrad|drop/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 lists rebuild strategies", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/rebuild/i);
    expect(container.textContent).toMatch(/segment|rotation|incremental/i);
    expect(container.textContent).toMatch(/downtime|operational/i);
  });

  it("renders at sub=5 without throwing", () => {
    expect(() => render(UpdatesDeletes(makeCtx({ sub: 5 })))).not.toThrow();
  });

  it("sub=5 compares delete pain by index type", () => {
    const { container } = render(UpdatesDeletes(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Qdrant|pgvector/);
  });
});
