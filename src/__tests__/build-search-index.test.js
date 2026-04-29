import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

describe("build-search-index", () => {
  let runBuild;
  let mockChunk;
  let workDir;

  beforeEach(async () => {
    workDir = mkdtempSync(join(tmpdir(), "build-search-"));
    mkdirSync(join(workDir, "src", "sections"), { recursive: true });
    mkdirSync(join(workDir, "src", "data"), { recursive: true });
    writeFileSync(
      join(workDir, "src", "sections", "neural-foundations.jsx"),
      "export const WhatIsNN = () => <div>NN content</div>;",
    );
    writeFileSync(join(workDir, "src", "data", "svg-descriptions.json"), "{}");

    mockChunk = vi.fn();
    vi.doMock("../../scripts/llm-chunk.mjs", () => ({ chunkSection: mockChunk }));
    vi.resetModules();
    ({ runBuild } = await import("../../scripts/build-search-index.mjs"));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("calls chunkSection for changed files and skips unchanged ones via hash cache", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "NN content explained",
          summary: "Intro to NNs",
          queries: [
            "what is a neural network",
            "intro to nn",
            "neural network basics",
            "explain neural networks",
            "nn primer",
          ],
          terms: ["neural network"],
        },
      ],
    });

    const chapters = [
      { id: "1.1", title: "What is a Neural Network?", section: 1, sectionFile: "neural-foundations.jsx" },
    ];
    const sectionNames = { 1: "Neural Network Foundations" };

    // First run: cache miss, calls Claude
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).toHaveBeenCalledOnce();

    // Second run with no source change: cache hit, no Claude call
    mockChunk.mockClear();
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).not.toHaveBeenCalled();

    // Edit source: cache miss again
    writeFileSync(
      join(workDir, "src", "sections", "neural-foundations.jsx"),
      "export const WhatIsNN = () => <div>EDITED</div>;",
    );
    await runBuild({ rootDir: workDir, chapters, sectionNames });
    expect(mockChunk).toHaveBeenCalledOnce();
  });

  it("writes chunks.json with stable IDs and sorted order", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "First chunk",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
        {
          sub: 1,
          kind: "example",
          text: "Second chunk",
          summary: "S2",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, sectionFile: "neural-foundations.jsx" }],
      sectionNames: { 1: "S1" },
    });

    const chunksJson = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(chunksJson).toHaveLength(2);
    expect(chunksJson[0].chapterId).toBe("1.1");
    expect(chunksJson[0].sub).toBe(0);
    expect(chunksJson[1].sub).toBe(1);
    expect(chunksJson[0].id).toMatch(/^[a-f0-9]{16}$/);
    expect(chunksJson[0].chapterTitle).toBe("T");
    expect(chunksJson[0].sectionName).toBe("S1");
    // Stable: same input → same id
    const id1 = chunksJson[0].id;
    return runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, sectionFile: "neural-foundations.jsx" }],
      sectionNames: { 1: "S1" },
    }).then(() => {
      const again = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
      expect(again[0].id).toBe(id1);
    });
  });

  it("recovers from a corrupt chunk-cache.json file", async () => {
    // seed a corrupt cache file
    writeFileSync(join(workDir, "src", "data", "chunk-cache.json"), "{not valid json");
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "Recovered chunk content",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
          terms: ["t"],
        },
      ],
    });
    await runBuild({
      rootDir: workDir,
      chapters: [{ id: "1.1", title: "T", section: 1, sectionFile: "neural-foundations.jsx" }],
      sectionNames: { 1: "S1" },
      log: () => {},
    });
    const chunksJson = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(chunksJson).toHaveLength(1);
    expect(mockChunk).toHaveBeenCalledOnce();
  });
});
