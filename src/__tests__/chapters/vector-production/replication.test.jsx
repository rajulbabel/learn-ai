import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Replication from "../../../chapters/vector-production/replication.jsx";

afterEach(() => cleanup());

describe("Replication (17.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Replication(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 describes read replicas with load balancing", () => {
    const { container } = render(Replication(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/replica|read replica/i);
    expect(container.textContent).toMatch(/load[- ]?balance/i);
  });

  it("renders at sub=1 without throwing", () => {
    expect(() => render(Replication(makeCtx({ sub: 1 })))).not.toThrow();
  });

  it("sub=1 covers leader-follower replication lag", () => {
    const { container } = render(Replication(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/leader|follower|primary/i);
    expect(container.textContent).toMatch(/lag|delay/i);
    expect(container.textContent).toMatch(/50|2 s|200 ms/);
  });

  it("renders at sub=2 without throwing", () => {
    expect(() => render(Replication(makeCtx({ sub: 2 })))).not.toThrow();
  });

  it("sub=2 handles leader failure via follower promotion", () => {
    const { container } = render(Replication(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/leader|primary/i);
    expect(container.textContent).toMatch(/promote|election/i);
    expect(container.textContent).toMatch(/lost|window/i);
  });

  it("renders at sub=3 without throwing", () => {
    expect(() => render(Replication(makeCtx({ sub: 3 })))).not.toThrow();
  });

  it("sub=3 covers in-memory durability via WAL or snapshots", () => {
    const { container } = render(Replication(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/durab|persist/i);
    expect(container.textContent).toMatch(/WAL|write[- ]?ahead|snapshot/i);
    expect(container.textContent).toMatch(/RAM/i);
  });

  it("renders at sub=4 without throwing", () => {
    expect(() => render(Replication(makeCtx({ sub: 4 })))).not.toThrow();
  });

  it("sub=4 compares recovery time WAL vs re-embed", () => {
    const { container } = render(Replication(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recovery|rebuild/i);
    expect(container.textContent).toMatch(/WAL|re[- ]?embed/i);
    expect(container.textContent).toMatch(/hours|days|weeks/i);
  });
});
