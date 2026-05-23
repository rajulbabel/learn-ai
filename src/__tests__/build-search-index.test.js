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
    mkdirSync(join(workDir, "src", "chapters", "neural-foundations"), { recursive: true });
    mkdirSync(join(workDir, "src", "data"), { recursive: true });
    writeFileSync(
      join(workDir, "src", "chapters", "neural-foundations", "what-is-nn.jsx"),
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
      {
        id: "1.1",
        title: "What is a Neural Network?",
        section: 1,
        file: "neural-foundations/what-is-nn",
        slug: "neural-foundations/what-is-nn",
      },
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
      join(workDir, "src", "chapters", "neural-foundations", "what-is-nn.jsx"),
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
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
    });

    const chunksJson = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(chunksJson).toHaveLength(2);
    expect(chunksJson[0].sub).toBe(0);
    expect(chunksJson[1].sub).toBe(1);
    expect(chunksJson[0].id).toMatch(/^[a-f0-9]{16}$/);
    expect(chunksJson[0].chapterTitle).toBe("T");
    // Stable: same input → same id
    const id1 = chunksJson[0].id;
    return runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
    }).then(() => {
      const again = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
      expect(again[0].id).toBe(id1);
    });
  });

  it("uses flat cache shape keyed by per-chapter file hash", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "Flat cache test",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
    });

    const cache = JSON.parse(readFileSync(join(workDir, "src", "data", "chunk-cache.json"), "utf-8"));
    const keys = Object.keys(cache);
    expect(keys).toHaveLength(1);
    // Each cache value must be a flat array of chunks (not a nested chapter-id map)
    expect(Array.isArray(cache[keys[0]])).toBe(true);
    expect(cache[keys[0]][0]).toMatchObject({ sub: 0, kind: "concept", text: "Flat cache test" });
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
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
      log: () => {},
    });
    const chunksJson = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(chunksJson).toHaveLength(1);
    expect(mockChunk).toHaveBeenCalledOnce();
  });

  it("writes chunks with chapterSlug field, drops chapterId/section/sectionName from each chunk", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        {
          sub: 0,
          kind: "concept",
          text: "T",
          summary: "S",
          queries: ["q1", "q2", "q3", "q4", "q5"],
          terms: ["t"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
    });

    const out = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(out).toHaveLength(1);
    expect(out[0].chapterSlug).toBe("neural-foundations/what-is-nn");
    expect(out[0]).not.toHaveProperty("chapterId");
    expect(out[0]).not.toHaveProperty("section");
    expect(out[0]).not.toHaveProperty("sectionName");
    expect(out[0]).toHaveProperty("chapterTitle", "T");
    expect(out[0]).toHaveProperty("sub", 0);
    expect(out[0]).toHaveProperty("kind", "concept");
  });

  it("chunkId is stable across chapter renumber (uses slug, not id)", async () => {
    mockChunk.mockResolvedValue({
      1.1: [
        { sub: 0, kind: "concept", text: "T", summary: "S", queries: ["q1", "q2", "q3", "q4", "q5"], terms: ["t"] },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "1.1",
          title: "T",
          section: 1,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 1: "S1" },
    });
    const firstId = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"))[0].id;

    // Same content, renumbered ID + different section, same slug.
    mockChunk.mockResolvedValue({
      9.7: [
        { sub: 0, kind: "concept", text: "T", summary: "S", queries: ["q1", "q2", "q3", "q4", "q5"], terms: ["t"] },
      ],
    });
    // Edit source to force cache miss (chunkSection re-called).
    writeFileSync(
      join(workDir, "src", "chapters", "neural-foundations", "what-is-nn.jsx"),
      "export const WhatIsNN = () => <div>SAME CONTENT V2</div>;",
    );
    await runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "9.7",
          title: "T",
          section: 9,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 9: "S9" },
    });
    const secondId = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"))[0].id;

    expect(secondId).toBe(firstId);
  });

  it("strips hardcoded 'Chapter N.M' references from text and summary in chunks.json", async () => {
    mockChunk.mockResolvedValue({
      "8.5": [
        {
          sub: 0,
          kind: "concept",
          text: "Chapter 5.5 makes positional encoding concrete. As shown in chapter 5.5, position 0 produces [0,1,0,1].",
          summary: "Chapter 5.5 explains positional encoding.",
          queries: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
          terms: ["positional encoding"],
        },
      ],
    });

    await runBuild({
      rootDir: workDir,
      chapters: [
        {
          id: "8.5",
          title: "Positional Encoding",
          section: 8,
          file: "neural-foundations/what-is-nn",
          slug: "neural-foundations/what-is-nn",
        },
      ],
      sectionNames: { 8: "Transformer Input Pipeline" },
    });

    const out = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    expect(out).toHaveLength(1);
    expect(out[0].text).not.toMatch(/[Cc]hapter \d+\.\d+/);
    expect(out[0].summary).not.toMatch(/[Cc]hapter \d+\.\d+/);
    // Sentence-start references become "This chapter", mid-sentence become "this chapter".
    expect(out[0].text).toMatch(/^This chapter makes positional encoding concrete\./);
    expect(out[0].text).toMatch(/As shown in this chapter,/);
    expect(out[0].summary).toBe("This chapter explains positional encoding.");
  });

  it("chunks output is ordered by (section, position_in_section, sub)", async () => {
    mockChunk
      .mockResolvedValueOnce({
        2.1: [{ sub: 0, kind: "concept", text: "C2", summary: "", queries: ["a", "b", "c", "d", "e"], terms: ["t"] }],
      })
      .mockResolvedValueOnce({
        1.2: [
          { sub: 1, kind: "concept", text: "C1B", summary: "", queries: ["a", "b", "c", "d", "e"], terms: ["t"] },
          { sub: 0, kind: "concept", text: "C1A", summary: "", queries: ["a", "b", "c", "d", "e"], terms: ["t"] },
        ],
      });

    mkdirSync(join(workDir, "src", "chapters", "x"), { recursive: true });
    writeFileSync(join(workDir, "src", "chapters", "x", "a.jsx"), "x");
    writeFileSync(join(workDir, "src", "chapters", "x", "b.jsx"), "y");

    await runBuild({
      rootDir: workDir,
      chapters: [
        { id: "2.1", title: "X21", section: 2, file: "x/a", slug: "x/a" },
        { id: "1.2", title: "X12", section: 1, file: "x/b", slug: "x/b" },
      ],
      sectionNames: { 1: "S1", 2: "S2" },
    });

    const out = JSON.parse(readFileSync(join(workDir, "src", "data", "chunks.json"), "utf-8"));
    // After sort: section 1 (chapter 1.2) comes first, then its subs in order, then 2.1.
    expect(out.map((c) => c.text)).toEqual(["C1A", "C1B", "C2"]);
  });
});
