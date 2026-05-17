import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import Vamana from "../../../chapters/vector-foundations/vamana.jsx";

afterEach(() => cleanup());

describe("Vamana (11.11)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(Vamana(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 motivates DiskANN with the HNSW RAM wall", () => {
    const { container } = render(Vamana(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/100M|100 million/i);
    expect(container.textContent).toMatch(/320 GB|300 GB|TB/);
  });

  it("sub=1 contrasts HNSW's pyramid with Vamana's flat layer", () => {
    const { container } = render(Vamana(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/pyramid|hierarchy/i);
    expect(container.textContent).toMatch(/flat/i);
    expect(container.textContent).toMatch(/single layer|one layer|one plane/i);
    expect(container.textContent).not.toMatch(/double duty/i);
    expect(container.textContent).not.toMatch(/NVMe/);
  });

  it("sub=2 explains why the hierarchy stops paying off on SSD", () => {
    const { container } = render(Vamana(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hop/i);
    expect(container.textContent).toMatch(/SSD/);
    expect(container.textContent).toMatch(/RAM/);
    expect(container.textContent).toMatch(/10\s*[µu]s|0\.1\s*[µu]s/i);
    expect(container.textContent).not.toMatch(/double duty/i);
  });

  it("sub=3 shows each node's 64 edges doing double duty", () => {
    const { container } = render(Vamana(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/R|64/);
    expect(container.textContent).toMatch(/short/i);
    expect(container.textContent).toMatch(/long/i);
    expect(container.textContent).toMatch(/double duty|double-duty/i);
    expect(container.textContent).toMatch(/alpha|α/i);
    expect(container.textContent).not.toMatch(/NVMe/);
  });

  it("sub=4 introduces NVMe", () => {
    const { container } = render(Vamana(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/NVMe/);
    expect(container.textContent).toMatch(/Non-Volatile Memory Express/);
    expect(container.textContent).toMatch(/PCIe/);
    expect(container.textContent).toMatch(/4\s*KB|page/i);
    expect(container.textContent).not.toMatch(/Graph lives on SSD/);
  });

  it("sub=5 describes the disk layout with SSD blocks and RAM cache", () => {
    const { container } = render(Vamana(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Graph lives on SSD/);
    expect(container.textContent).toMatch(/4\s*KB|page/i);
    expect(container.textContent).toMatch(/cache/i);
    expect(container.textContent).not.toMatch(/Per-query budget/i);
  });

  it("sub=6 shows the minimize-disk-reads search pattern", () => {
    const { container } = render(Vamana(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/SSD|disk/i);
    expect(container.textContent).toMatch(/80|40|reads/i);
  });

  it("sub=7 hits 100B scale with Azure/Milvus and FreshDiskANN", () => {
    const { container } = render(Vamana(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/100 billion|100B/i);
    expect(container.textContent).toMatch(/Azure|Milvus/);
    expect(container.textContent).toMatch(/NVMe|SSD/);
    expect(container.textContent).toMatch(/FreshDiskANN|delete/i);
  });

  it("renders at all sub levels without throwing", () => {
    for (let s = 0; s <= 9; s++) {
      expect(() => render(Vamana(makeCtx({ sub: s })))).not.toThrow();
      cleanup();
    }
  });
});
