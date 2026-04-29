import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "fs";
import chunks from "../data/chunks.json";

describe("embeddings manifest", () => {
  let manifest;
  let binSize;

  it("loads", () => {
    manifest = JSON.parse(
      readFileSync("src/data/embeddings-manifest.json", "utf-8"),
    );
    binSize = statSync("src/data/embeddings.bin").size;
    expect(manifest.dim).toBe(768);
    expect(manifest.modelChecksum.length).toBe(16);
  });

  it("count matches vector array length and bin size", () => {
    expect(manifest.count).toBe(manifest.vectors.length);
    expect(binSize).toBe(manifest.count * manifest.dim);
  });

  it("every chunk id has at least one vector", () => {
    const covered = new Set(manifest.vectors.map((v) => v.chunkId));
    for (const c of chunks) {
      expect(covered.has(c.id), `chunk ${c.id} has no vectors`).toBe(true);
    }
  });

  it("every vector references a real chunk id", () => {
    const known = new Set(chunks.map((c) => c.id));
    for (const v of manifest.vectors) {
      expect(
        known.has(v.chunkId),
        `manifest references unknown chunk ${v.chunkId}`,
      ).toBe(true);
    }
  });
});
