import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { makeCtx } from "../../chapter-test-helpers.js";
import BinaryQuantization from "../../../chapters/vector-compression/binary-quantization.jsx";

afterEach(() => cleanup());

describe("BinaryQuantization (16.3)", () => {
  it("renders at sub=0 without throwing", () => {
    expect(() => render(BinaryQuantization(makeCtx({ sub: 0 })))).not.toThrow();
  });

  it("sub=0 shows float32 vector at d=1024 as 4 KB", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/1024/);
    expect(container.textContent).toMatch(/4 KB|4096/);
    expect(container.textContent).toMatch(/float32/i);
  });

  it("sub=0 shown-dim count matches the rendered cells", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 0 })));
    const labelEl = Array.from(container.querySelectorAll("*")).find((n) =>
      /first \d+ dims shown/.test(n.textContent || ""),
    );
    expect(labelEl, "expected a 'first N dims shown' label").toBeTruthy();
    const claimed = parseInt(labelEl.textContent.match(/first (\d+) dims shown/)[1], 10);
    const grid = labelEl.parentElement.querySelector("div[style*='grid-template-columns']");
    expect(grid, "expected a grid sibling under the label container").toBeTruthy();
    const cells = grid.children.length;
    expect(cells, `claim says ${claimed} dims, grid has ${cells} cells`).toBe(claimed);
  });

  it("sub=1 takes the sign of each dimension for 1 bit", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/sign/i);
    expect(container.textContent).toMatch(/1 bit|128 bytes/);
    expect(container.textContent).toMatch(/32[x×]|32 times/i);
  });

  it("sub=2 computes Hamming via XOR and popcount", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Hamming/i);
    expect(container.textContent).toMatch(/XOR/i);
    expect(container.textContent).toMatch(/popcount/i);
  });

  it("sub=3 shows high-d embeddings keep recall", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/95%|high/i);
    expect(container.textContent).toMatch(/768|1024|BERT/);
  });

  it("sub=4 shows low-d collapse", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/low|collapse|128|drop/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=5 shows production use with rerank", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Qdrant|Pinecone/);
    expect(container.textContent).toMatch(/rerank|stage/i);
  });

  it("sub=5 stage 1 and stage 2 labels are center-aligned", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 5 })));
    const labels = Array.from(container.querySelectorAll("div")).filter((n) => {
      const text = (n.textContent || "").trim();
      return /^stage [12]: [^]*$/i.test(text) && n.children.length === 0;
    });
    expect(labels.length, "expected stage 1 and stage 2 leaf labels").toBeGreaterThanOrEqual(2);
    for (const el of labels) {
      const ta = el.style.textAlign;
      expect(ta, `"${el.textContent.trim()}" must be center-aligned (got "${ta}")`).toBe("center");
    }
  });

  it("sub=6 shows insert/update/delete drift the sign threshold", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/sign/i);
    expect(container.textContent).toMatch(/51\s*\/\s*49|51\/49/);
    expect(container.textContent).toMatch(/78\s*\/\s*22|78\/22/);
    expect(container.textContent).toMatch(/dim 5|dim\s*5/i);
  });

  it("sub=6 capitalizes the first letter of every drift caption", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 6 })));
    expect(container.textContent).toContain("New dim 5 batch mean");
    expect(container.textContent).toContain("Re-binarized with stale threshold");
    expect(container.textContent).toContain("Bit-balance stats decay");
  });

  it("sub=6 centers the bit-grid block within the SVG", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 6 })));
    const svgs = Array.from(container.querySelectorAll("svg"));
    const distSvg = svgs.find((s) => /Training:/.test(s.textContent || ""));
    expect(distSvg, "expected distribution SVG").toBeTruthy();
    const trainingLabel = Array.from(distSvg.querySelectorAll("text")).find(
      (t) => (t.textContent || "").trim() === "Training:",
    );
    const driftedLabel = Array.from(distSvg.querySelectorAll("text")).find(
      (t) => (t.textContent || "").trim() === "Drifted:",
    );
    expect(trainingLabel.getAttribute("text-anchor")).toBe("end");
    expect(driftedLabel.getAttribute("text-anchor")).toBe("end");
    const tx = parseFloat(trainingLabel.getAttribute("x"));
    expect(tx).toBeGreaterThan(150);
    expect(tx).toBeLessThan(280);
  });

  it("sub=7 shows zero-centered models + bit-balance alert + compaction", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/zero[- ]centered/i);
    expect(container.textContent).toMatch(/bit[- ]balance/i);
    expect(container.textContent).toMatch(/compact|tombstone/i);
    expect(container.textContent).toMatch(/Cohere/);
    expect(container.textContent).toMatch(/Mixedbread|mxbai/i);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/i);
    expect(container.textContent).toMatch(/Milvus|Qdrant/);
    expect(container.textContent).toMatch(/70%|>\s*70/);
  });

  it("sub=7 capitalizes the first letter of every fix row and model card", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 7 })));
    expect(container.textContent).toContain("Sign(x) on a zero-centered model");
    expect(container.textContent).toContain("Tombstone bit; compaction job");
    expect(container.textContent).toContain("Any dim with > 70% same value");
    expect(container.textContent).toContain("Sign-based binary, no calibration");
    expect(container.textContent).toContain("Zero-centered, sign threshold");
    expect(container.textContent).toContain("Client-side sign() on float output");
    expect(container.textContent).toContain("Custom per-dim threshold");
  });

  it("sub=8 pairs BQ with HNSW for graph-accelerated stage 1", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Hamming/i);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/rerank|rescore/i);
  });

  it("sub=8 explains how BQ pairs with HNSW for stage 1", () => {
    const { container } = render(BinaryQuantization(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/dedicated combo|no.*combo chapter|HNSW \+ BQ/i);
    expect(container.textContent).toMatch(/HNSW/);
  });
});
