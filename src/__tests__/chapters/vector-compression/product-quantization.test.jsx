import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ProductQuantization from "../../../chapters/vector-compression/product-quantization.jsx";

afterEach(() => cleanup());

describe("ProductQuantization (16.2)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ProductQuantization(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 splits 768-dim vector into 96 subvectors", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/sub[- ]?vector|split/i);
    expect(container.textContent).toMatch(/Cut one fat vector/i);
    expect(container.textContent).toMatch(/slot/i);
  });

  it("sub=1 runs k-means per slot with 256 centroids", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/256-word dictionary/i);
    expect(container.textContent).toMatch(/2\^8|fits in (a |one )?single byte|fits in a byte/i);
  });

  it("sub=2 encodes each subvector to a centroid id", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/centroid id|code/i);
    expect(container.textContent).toMatch(/snap/i);
    expect(container.textContent).toMatch(/nearest prototype|nearest centroid/i);
    expect(container.textContent).toMatch(/96 bytes/i);
  });

  it("sub=3 shows 96 bytes = 32x compression", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/32/);
    expect(container.textContent).toMatch(/96 bytes per vector|per vector/i);
    expect(container.textContent).toMatch(/billion vectors in 96 GB|one server/i);
  });

  it("sub=4 describes asymmetric distance via lookup table", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/lookup|LUT|table/i);
    expect(container.textContent).toMatch(/no float|no multiplies|stays as float/i);
    expect(container.textContent).toMatch(/once per query/i);
    expect(container.textContent).toMatch(/per doc/i);
  });

  it("sub=5 explains OPQ rotation", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OPQ/);
    expect(container.textContent).toMatch(/rotat/i);
    expect(container.textContent).toMatch(/decorrelat|correlat/i);
    expect(container.textContent).toMatch(/rotate first/i);
    expect(container.textContent).toMatch(/0\.94|0\.89/);
  });

  it("sub=6 shows insert/update/delete drift the codebooks", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/distance\s*=\s*1\.8/i);
    expect(container.textContent).toMatch(/0\.3/);
  });

  it("sub=6 capitalizes the first letter of every drift caption", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 6 })));
    expect(container.textContent).toContain("Sub-vec far from every centroid");
    expect(container.textContent).toContain("Re-encoded with stale codebooks");
    expect(container.textContent).toContain("Orphan PQ code");
  });

  it("sub=7 shows oversample + tombstones + retrain on error spike", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/oversample|sample|k_per_slot/i);
    expect(container.textContent).toMatch(/retrain/i);
    expect(container.textContent).toMatch(/tombstone|compact/i);
    expect(container.textContent).toMatch(/95p|95th|threshold/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Vespa/);
    expect(container.textContent).toMatch(/Milvus/);
    expect(container.textContent).toMatch(/Qdrant/);
  });

  it("sub=7 capitalizes the first letter of every fix row and DB card", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 7 })));
    expect(container.textContent).toContain("Re-encode with current codebooks");
    expect(container.textContent).toContain("Tombstone in posting list");
    expect(container.textContent).toContain("Background re-quantization");
    expect(container.textContent).toContain("Scheduled IVF_PQ retraining");
  });

  it("sub=8 shows the recall-compression curve", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/m\s*=\s*96|m=96/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/compress/i);
    expect(container.textContent).toMatch(/only knob|knob/i);
    expect(container.textContent).toMatch(/sweet spot/i);
  });

  it("sub=8 capitalizes the table column headers", () => {
    const { container } = render(ProductQuantization(makeCtx({ sub: 8 })));
    const cells = Array.from(container.querySelectorAll("div")).map((n) => (n.textContent || "").trim());
    expect(cells).toContain("M");
    expect(cells).toContain("Bytes/vec");
    expect(cells).toContain("Compression");
    expect(cells).toContain("Recall@10 (OPQ)");
    expect(cells).toContain("Typical use");
  });
});
