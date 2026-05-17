import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import CapacityPlanning from "../../../chapters/vector-production/capacity-planning.jsx";

afterEach(() => cleanup());

describe("CapacityPlanning (11.29)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(CapacityPlanning(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 lists the sizing inputs", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/N|vectors/i);
    expect(container.textContent).toMatch(/QPS|queries per second/i);
    expect(container.textContent).toMatch(/P99|latency/i);
    expect(container.textContent).toMatch(/selectivity|availability|filter/i);
  });

  it("sub=1 gives the memory formula with cache and fragmentation", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/RAM|memory/i);
    expect(container.textContent).toMatch(/graph|cache|fragmentation/i);
  });

  it("sub=2 sizes CPU with headroom", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/CPU|cores/i);
    expect(container.textContent).toMatch(/QPS|200/i);
    expect(container.textContent).toMatch(/headroom/i);
  });

  it("sub=3 shows 500M x 200 QPS worked example", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/500M|500 million/);
    expect(container.textContent).toMatch(/3 TB|1\.5 TB|TB/);
    expect(container.textContent).toMatch(/nodes|6 nodes/i);
  });

  it("sub=4 compares costs across Pinecone, Qdrant, pgvector", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/Qdrant|pgvector/);
    expect(container.textContent).toMatch(/\$|cost|month/i);
  });

  it("sub=5 frames the decision via cost per million", () => {
    const { container } = render(CapacityPlanning(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/per million|per-million/i);
    expect(container.textContent).toMatch(/cost|\$/i);
    expect(container.textContent).toMatch(/decision|framework/i);
  });
});
