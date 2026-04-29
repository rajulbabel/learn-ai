import { describe, it, expect, vi, beforeEach } from "vitest";

const tenQueries = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];
const twelveQueries = [
  "what is a neural network",
  "how do nns learn",
  "neural network basics",
  "intro to neural networks",
  "what does an nn do",
  "nn explained simply",
  "deep learning intro",
  "neural net 101",
  "ai networks overview",
  "neural network definition",
  "machine learning networks",
  "nn beginner guide",
];

describe("llm-chunk", () => {
  let chunkSection;
  let mockCreate;

  beforeEach(async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";
    mockCreate = vi.fn();
    vi.doMock("@anthropic-ai/sdk", () => ({
      default: vi.fn(function () {
        this.messages = { create: mockCreate };
      }),
    }));
    vi.resetModules();
    ({ chunkSection } = await import("../../scripts/llm-chunk.mjs"));
  });

  it("calls Anthropic with expected shape and returns parsed chunks", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          name: "emit_chunks",
          input: {
            chunks: {
              "1.1": [
                {
                  sub: 0,
                  kind: "concept",
                  text: "A neural network learns patterns from examples.",
                  summary: "A neural network is a learning system.",
                  queries: twelveQueries,
                  terms: ["neural network", "learning"],
                },
              ],
            },
          },
        },
      ],
    });

    const result = await chunkSection({
      filePath: "src/sections/neural-foundations.jsx",
      source: "/* fake source */",
      chapters: [{ id: "1.1", title: "What is a Neural Network?", section: 1, sectionName: "Neural Network Foundations" }],
      svgDescriptions: {},
    });

    expect(result["1.1"]).toHaveLength(1);
    expect(result["1.1"][0].text).toMatch(/neural network/);
    expect(mockCreate).toHaveBeenCalledOnce();
    const args = mockCreate.mock.calls[0][0];
    expect(args.model).toBeDefined();
    expect(args.tools).toHaveLength(1);
    expect(args.tools[0].name).toBe("emit_chunks");
    expect(args.tool_choice).toEqual({ type: "tool", name: "emit_chunks" });
    // System message should use cache_control on the stable preamble
    expect(args.system).toBeDefined();
    const systemBlocks = Array.isArray(args.system) ? args.system : [{ type: "text", text: args.system }];
    expect(systemBlocks.some((b) => b.cache_control?.type === "ephemeral")).toBe(true);
  });

  it("retries on rate-limit then succeeds", async () => {
    const rateLimitErr = Object.assign(new Error("rate"), { status: 429 });
    mockCreate
      .mockRejectedValueOnce(rateLimitErr)
      .mockResolvedValueOnce({
        content: [
          {
            type: "tool_use",
            name: "emit_chunks",
            input: {
              chunks: {
                "1.1": [
                  {
                    sub: 0,
                    kind: "summary",
                    text: "Sample chunk text for testing.",
                    summary: "Sample summary.",
                    queries: tenQueries,
                    terms: ["t"],
                  },
                ],
              },
            },
          },
        ],
      });

    const result = await chunkSection({
      filePath: "f.jsx",
      source: "x",
      chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
      svgDescriptions: {},
    });
    expect(result["1.1"]).toHaveLength(1);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it("throws on schema-invalid response (missing queries)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          name: "emit_chunks",
          input: {
            chunks: {
              "1.1": [
                {
                  sub: 0,
                  kind: "summary",
                  text: "Sample chunk text for testing.",
                  summary: "Sample summary.",
                  queries: [],
                  terms: [],
                },
              ],
            },
          },
        },
      ],
    });

    await expect(
      chunkSection({
        filePath: "f.jsx",
        source: "x",
        chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
        svgDescriptions: {},
      }),
    ).rejects.toThrow(/queries/);
  });

  it("throws clear error when ANTHROPIC_API_KEY is missing", async () => {
    const orig = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      await expect(
        chunkSection({
          filePath: "f.jsx",
          source: "x",
          chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
          svgDescriptions: {},
        }),
      ).rejects.toThrow(/ANTHROPIC_API_KEY/);
    } finally {
      if (orig !== undefined) process.env.ANTHROPIC_API_KEY = orig;
    }
  });
});
