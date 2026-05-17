import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import ScalarQuantization from "../../../chapters/vector-compression/scalar-quantization.jsx";

afterEach(() => cleanup());

describe("ScalarQuantization (11.13)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(ScalarQuantization(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows a float32 vector with 4-byte dimensions", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/float32/i);
    expect(container.textContent).toMatch(/4 bytes/i);
  });

  it("sub=1 describes per-dimension min/max calibration", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/min/i);
    expect(container.textContent).toMatch(/max/i);
    expect(container.textContent).toMatch(/calibrat|scan/i);
  });

  it("sub=2 shows the linear map to [0, 255]", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/255/);
    expect(container.textContent).toMatch(/round/i);
  });

  it("sub=3 shows before/after quantized values", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/int8/i);
    expect(container.textContent).toMatch(/before/i);
    expect(container.textContent).toMatch(/after/i);
  });

  it("sub=4 highlights SIMD int8 speed", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/SIMD/);
    expect(container.textContent).toMatch(/int8/i);
    expect(container.textContent).toMatch(/faster|speedup/i);
  });

  it("sub=5 shows 4x memory win for 1-3% recall loss", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/4[x×]|4 times/i);
    expect(container.textContent).toMatch(/1-3%|recall loss|recall drop/i);
    expect(container.textContent).toMatch(/768|bytes per vector/i);
  });

  it("sub=6 shows insert/update/delete drift the calibrated range", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/outside|out[- ]of[- ]range|drift/i);
    expect(container.textContent).toMatch(/clip/i);
    expect(container.textContent).toMatch(/error\s*=\s*0\.4/i);
    expect(container.textContent).toMatch(/-?1\.2|1\.4|1\.8/);
  });

  it("sub=7 shows percentile bounds + vacuum + scheduled recalibration", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/percentile|p1|p99|headroom/i);
    expect(container.textContent).toMatch(/recalibrat|re-calibrat/i);
    expect(container.textContent).toMatch(/vacuum|tombstone|compact/i);
    expect(container.textContent).toMatch(/0\.5%|drift|clip/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/Vespa/);
  });

  it("sub=8 shows SQ pairs with any index (HNSW, IVF, flat)", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/IVF|flat/i);
    expect(container.textContent).toMatch(/drop[- ]?in|payload|swap/i);
    expect(container.textContent).toMatch(/index.*unchanged|graph.*unchanged|same (graph|index)/i);
  });

  it("sub=8 names production examples", () => {
    const { container } = render(ScalarQuantization(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/pgvector|Qdrant|FAISS/);
  });
});
