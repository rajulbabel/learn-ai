import { describe, it, expect } from "vitest";
import { readFileSync, statSync, existsSync } from "fs";

describe("Matryoshka 256-dim corpus with packed scales", () => {
  it("model-meta declares dim 256 with cf256 checksum", () => {
    const meta = JSON.parse(readFileSync("public/models/bge-base-en-v1.5-q4/model-meta.json", "utf-8"));
    expect(meta.dim).toBe(256);
    expect(meta.checksum).toMatch(/^cf256:/);
  });

  it("manifest collapses to a header + unique chunkIds (no per-vector array)", () => {
    const manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    expect(manifest.dim).toBe(256);
    expect(manifest).not.toHaveProperty("vectors");
    expect(Array.isArray(manifest.chunkIds)).toBe(true);
  });

  it("bin size = count × (dim + 4) + count × 2  (vec rows + trailing chunkIdx)", () => {
    const manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    const binSize = statSync("src/data/embeddings.bin").size;
    expect(binSize).toBe(manifest.count * (manifest.dim + 4) + manifest.count * 2);
  });
});

describe("search.js handles packed bin + matryoshka", () => {
  it("search.js no longer indexes scale from manifest", () => {
    const src = readFileSync("src/search.js", "utf-8");
    // The hot loop reads scale inline from the bin, not from manifest.vectors[i].scale.
    expect(src).not.toMatch(/v\.scale/);
    // VEC_STRIDE = dim + 4 must appear or equivalent (dim + 4) arithmetic.
    expect(src).toMatch(/dim\s*\+\s*4|VEC_STRIDE/);
  });

  it("search.js truncates query vector to matryoshka dim then renormalizes", () => {
    const src = readFileSync("src/search.js", "utf-8");
    // The CF Worker returns the full 768-dim BGE vector; the client cuts it
    // to modelMeta.dim and L2-renormalizes so cosine matches the stored
    // 256-dim corpus.
    expect(src).toMatch(/slice\(0,\s*dim\)|\.slice\(0,\s*modelMeta\.dim\)/);
    // L2 renorm after truncation
    expect(src).toMatch(/Math\.sqrt/);
  });
});

describe("check-embeddings guard matches packed bin layout", () => {
  it("uses (dim + 4) + 2 when computing expected bin size", () => {
    if (!existsSync("scripts/check-embeddings.mjs")) return;
    const src = readFileSync("scripts/check-embeddings.mjs", "utf-8");
    expect(src).toMatch(/dim\s*\+\s*4/);
    expect(src).toMatch(/count\s*\*\s*2/);
  });
});
