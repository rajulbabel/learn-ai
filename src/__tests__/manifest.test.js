import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "fs";
import chunks from "../data/chunks.json";

describe("embeddings manifest (collapsed-chunkIds shape)", () => {
  let manifest;
  let binSize;

  it("loads", () => {
    manifest = JSON.parse(readFileSync("src/data/embeddings-manifest.json", "utf-8"));
    binSize = statSync("src/data/embeddings.bin").size;
    expect(typeof manifest.dim).toBe("number");
    expect(manifest.modelChecksum).toMatch(/^cf256:[0-9a-f]{16}$/);
    expect(Array.isArray(manifest.chunkIds)).toBe(true);
  });

  it("bin size = count * (dim + 4) + count * 2 (vec rows + trailing chunkIdx)", () => {
    expect(binSize).toBe(manifest.count * (manifest.dim + 4) + manifest.count * 2);
  });

  it("every chunk id has at least one vector", () => {
    const covered = new Set(manifest.chunkIds);
    for (const c of chunks) {
      expect(covered.has(c.id), `chunk ${c.id} has no vectors`).toBe(true);
    }
  });

  it("every manifest chunkId references a real chunk id", () => {
    const known = new Set(chunks.map((c) => c.id));
    for (const id of manifest.chunkIds) {
      expect(known.has(id), `manifest references unknown chunk ${id}`).toBe(true);
    }
  });
});
