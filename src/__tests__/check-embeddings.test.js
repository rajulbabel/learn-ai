import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, cpSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

function setup({ chunks, manifest, bin }) {
  const dir = mkdtempSync(join(tmpdir(), "check-emb-"));
  mkdirSync(join(dir, "src", "data"), { recursive: true });
  writeFileSync(join(dir, "src", "data", "chunks.json"), JSON.stringify(chunks));
  writeFileSync(join(dir, "src", "data", "embeddings-manifest.json"), JSON.stringify(manifest));
  writeFileSync(join(dir, "src", "data", "embeddings.bin"), bin);
  mkdirSync(join(dir, "scripts"), { recursive: true });
  cpSync("scripts/check-embeddings.mjs", join(dir, "scripts", "check-embeddings.mjs"));
  return dir;
}

describe("check-embeddings (new format)", () => {
  it("exits 0 when manifest, chunks, and bin are consistent", () => {
    const dir = setup({
      chunks: [
        {
          id: "a",
          chapterId: "1.1",
          sub: 0,
          kind: "concept",
          text: "x",
          summary: "x",
          queries: ["a", "b", "c", "d", "e"],
          terms: ["t"],
        },
      ],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 8,
        chunkIds: ["a"],
      },
      bin: Buffer.alloc(8 * (4 + 4) + 8 * 2),
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).not.toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it("exits 1 when bin size disagrees with manifest", () => {
    const dir = setup({
      chunks: [
        {
          id: "a",
          chapterId: "1.1",
          sub: 0,
          kind: "concept",
          text: "x",
          summary: "x",
          queries: ["a", "b", "c", "d", "e"],
          terms: ["t"],
        },
      ],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 8,
        chunkIds: ["a"],
      },
      bin: Buffer.alloc(8 * (4 + 4) + 8 * 2 - 1),
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it("exits 1 when a chunk id has zero vectors in the manifest", () => {
    const dir = setup({
      chunks: [
        {
          id: "a",
          chapterId: "1.1",
          sub: 0,
          kind: "concept",
          text: "x",
          summary: "x",
          queries: ["a", "b", "c", "d", "e"],
          terms: ["t"],
        },
        {
          id: "b",
          chapterId: "1.2",
          sub: 0,
          kind: "concept",
          text: "x",
          summary: "x",
          queries: ["a", "b", "c", "d", "e"],
          terms: ["t"],
        },
      ],
      manifest: {
        modelChecksum: "abc",
        dim: 4,
        count: 1,
        chunkIds: ["a"],
      },
      bin: Buffer.alloc(1 * (4 + 4) + 1 * 2),
    });
    expect(() => execSync(`node scripts/check-embeddings.mjs`, { cwd: dir })).toThrow();
    rmSync(dir, { recursive: true, force: true });
  });
});
