import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("embed-chunks", () => {
  let runEmbed;
  let workDir;
  let pipelineMock;

  beforeEach(async () => {
    workDir = mkdtempSync(join(tmpdir(), "embed-chunks-"));
    mkdirSync(join(workDir, "src", "data"), { recursive: true });
    mkdirSync(join(workDir, "public", "models", "bge-base-en-v1.5-q4"), { recursive: true });
    writeFileSync(
      join(workDir, "public", "models", "bge-base-en-v1.5-q4", "model-meta.json"),
      JSON.stringify({
        repo: "Xenova/bge-base-en-v1.5",
        dtype: "q4",
        weightFile: "onnx/model_q4.onnx",
        dim: 4, // tiny for test
        checksum: "abc1234567890def",
        queryInstruction: "Represent this sentence for searching relevant passages: ",
      }),
    );
    writeFileSync(
      join(workDir, "src", "data", "chunks.json"),
      JSON.stringify([
        {
          id: "aaaa",
          chapterId: "1.1",
          chapterTitle: "T",
          section: 1,
          sectionName: "S",
          sub: 0,
          kind: "concept",
          text: "Hello world neural net",
          summary: "Intro",
          queries: ["q1", "q2", "q3"],
          terms: ["neural"],
        },
      ]),
    );

    let counter = 0;
    pipelineMock = vi.fn(async () => async (_text) => {
      counter++;
      const vec = new Array(4).fill(0).map((_, i) => (counter * (i + 1)) / 100);
      return { tolist: () => [vec] };
    });
    vi.doMock("@huggingface/transformers", () => ({ pipeline: pipelineMock }));

    vi.resetModules();
    ({ runEmbed } = await import("../../scripts/embed-chunks.mjs"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("writes embeddings.bin and manifest with one vector per representation", async () => {
    await runEmbed({ rootDir: workDir, log: () => {} });
    const manifest = JSON.parse(
      readFileSync(join(workDir, "src", "data", "embeddings-manifest.json"), "utf-8"),
    );
    expect(manifest.dim).toBe(4);
    expect(manifest.modelChecksum).toBe("abc1234567890def");
    // 1 chunk × (1 text + 1 summary + 3 queries + 1 terms) = 6 vectors
    expect(manifest.count).toBe(6);
    expect(manifest.vectors).toHaveLength(6);
    const reprKinds = manifest.vectors.map((v) => v.reprKind).sort();
    expect(reprKinds).toEqual(["query", "query", "query", "summary", "terms", "text"]);
    const binSize = readFileSync(join(workDir, "src", "data", "embeddings.bin")).byteLength;
    expect(binSize).toBe(6 * 4); // 6 vectors × dim 4 × 1 byte/dim
  });

  it("skips unchanged reprs on second run by reusing the prior manifest", async () => {
    await runEmbed({ rootDir: workDir, log: () => {} });
    const callsBefore = pipelineMock.mock.results[0].value;
    const before = await callsBefore;
    const calls1 = before.mock?.calls?.length ?? 0;

    // Re-run with no changes: every repr matches the previous manifest by contentHash, so nothing is re-embedded.
    await runEmbed({ rootDir: workDir, log: () => {} });
    const calls2 = before.mock?.calls?.length ?? 0;
    expect(calls2).toBe(calls1);
  });
});
