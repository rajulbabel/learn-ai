import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import IVF from "../../../chapters/vector-foundations/ivf.jsx";

afterEach(() => cleanup());

describe("IVF (15.6)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(IVF(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 revisits the brute-force-scans-every-vector baseline", () => {
    const { container } = render(IVF(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/every vector/i);
    expect(container.textContent).toMatch(/brute[- ]?force/i);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=1 introduces k-means with nlist = 3 clusters", () => {
    const { container } = render(IVF(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/nlist|3 clusters/i);
    expect(container.textContent).toMatch(/centroid/i);
  });

  it("sub=2 draws Voronoi cells around centroids", () => {
    const { container } = render(IVF(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/voronoi|cell/i);
    expect(container.textContent).toMatch(/belongs to|exactly one/i);
  });

  it("sub=2 clarifies that cell, cluster, partition, and posting list are the same thing", () => {
    const txt = render(IVF(makeCtx({ sub: 2 }))).container.textContent;
    expect(txt).toMatch(/cluster/i);
    expect(txt).toMatch(/cell/i);
    expect(txt).toMatch(/partition/i);
    expect(txt).toMatch(/posting list/i);
    expect(txt).toMatch(/same thing|four names|different (names|angles|views)/i);
  });

  it("sub=3 explains the argmin formula and the frozen assignment in plain language", () => {
    const { container } = render(IVF(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/argmin/i);
    expect(container.textContent).toMatch(/closest centroid|nearest centroid/i);
    expect(container.textContent).toMatch(/distance/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/frozen|does not change|doesn't change/i);
  });

  it("sub=3 explains why IVF does not store polygons and what it stores instead", () => {
    const { container } = render(IVF(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/teaching|visual|illustration|just for/i);
    expect(container.textContent).toMatch(/inverted file|posting list|doc.*ID|table/i);
    expect(container.textContent).toMatch(/implicit|derive|on the fly|argmin/i);
  });

  it("sub=4 probes the single nearest cluster at nprobe = 1", () => {
    const { container } = render(IVF(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe\s*=\s*1/i);
    expect(container.textContent).toMatch(/nearest|centroid/i);
  });

  it("sub=5 shows recall vs nprobe tradeoff with concrete numbers", () => {
    const { container } = render(IVF(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|1\.0|100%/);
  });

  it("sub=6 gives parameter guidance nlist sqrt(N) and nprobe", () => {
    const { container } = render(IVF(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/sqrt|√/i);
    expect(container.textContent).toMatch(/nlist/i);
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/4096|1000/);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 8; s++) {
      expect(() => render(IVF(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
