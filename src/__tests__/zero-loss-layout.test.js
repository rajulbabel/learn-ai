import { describe, it, expect } from "vitest";
import { readFileSync, statSync, existsSync } from "fs";

describe("chunks.json shipped to browser strips build-only fields", () => {
  it("has no queries field per chunk (embedded into bin already)", () => {
    const chunks = JSON.parse(readFileSync("src/data/chunks.json", "utf-8"));
    expect(chunks.length).toBeGreaterThan(0);
    for (const c of chunks) expect(c).not.toHaveProperty("queries");
  });

  it("has no chapterTitle field per chunk (derivable from chapterSlug + config)", () => {
    const chunks = JSON.parse(readFileSync("src/data/chunks.json", "utf-8"));
    for (const c of chunks) expect(c).not.toHaveProperty("chapterTitle");
  });
});

describe("chunks-full.json keeps build-time fields for embedding", () => {
  it("exists and includes queries + chapterTitle", () => {
    expect(existsSync("src/data/chunks-full.json")).toBe(true);
    const chunks = JSON.parse(readFileSync("src/data/chunks-full.json", "utf-8"));
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]).toHaveProperty("queries");
    expect(chunks[0]).toHaveProperty("chapterTitle");
  });
});

describe("manifest collapses to unique chunkIds + tiny header", () => {
  it("stores chunkIds (1844 unique) instead of per-vector vectors array", () => {
    const manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    expect(Array.isArray(manifest.chunkIds)).toBe(true);
    expect(manifest.chunkIds.length).toBeGreaterThan(0);
    // The big "vectors" array is gone - manifest is now header-sized.
    expect(manifest).not.toHaveProperty("vectors");
  });
});

describe("bin packs vector rows + trailing Uint16 chunkIdx", () => {
  it("bin size = count * (dim + 4) + count * 2 (Uint16 chunk index)", () => {
    const manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    const binSize = statSync("src/data/embeddings.bin").size;
    const expected = manifest.count * (manifest.dim + 4) + manifest.count * 2;
    expect(binSize).toBe(expected);
  });
});

describe("search.js threads the new layout end to end", () => {
  it("imports chapters from config and injects chapterTitle at index time", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/chapterTitle\s*:\s*[a-zA-Z]*chapterBySlug/);
  });

  it("reads trailing Uint16 chunkIdx from the bin (Uint16Array view)", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/Uint16Array/);
  });

  it("debounce constant is 300 ms", () => {
    const src = readFileSync("src/search-overlay.jsx", "utf-8");
    expect(src).toMatch(/SEARCH_DEBOUNCE_MS\s*=\s*300/);
  });
});
