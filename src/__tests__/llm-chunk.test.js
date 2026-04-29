import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter } from "events";

// Factory that defers proc creation until spawn is actually called, so the
// caller has a chance to attach listeners before the close event fires.
function fakeProcFactory({ stdout = "", stderr = "", exitCode = 0 } = {}) {
  return () => {
    const proc = new EventEmitter();
    proc.stdout = new EventEmitter();
    proc.stderr = new EventEmitter();
    proc.stdin = { end: vi.fn() };
    setTimeout(() => {
      if (stdout) proc.stdout.emit("data", Buffer.from(stdout));
      if (stderr) proc.stderr.emit("data", Buffer.from(stderr));
      proc.emit("close", exitCode);
    }, 0);
    return proc;
  };
}

describe("llm-chunk (claude CLI subprocess)", () => {
  let chunkSection;
  let mockSpawn;

  const tenQueries = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"];
  const sampleText = "Sample chunk text for testing purposes.";

  beforeEach(async () => {
    mockSpawn = vi.fn();
    vi.doMock("child_process", () => ({ spawn: mockSpawn, default: { spawn: mockSpawn } }));
    vi.resetModules();
    ({ chunkSection } = await import("../../scripts/llm-chunk.mjs"));
  });

  it("invokes claude CLI with expected flags and returns parsed chunks", async () => {
    const innerJson = JSON.stringify({
      chunks: {
        "1.1": [
          {
            sub: 0,
            kind: "concept",
            text: sampleText,
            summary: "Intro to neural networks.",
            queries: tenQueries,
            terms: ["neural network"],
          },
        ],
      },
    });
    const wrapperJson = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      result: innerJson,
    });
    mockSpawn.mockImplementationOnce(fakeProcFactory({ stdout: wrapperJson }));

    const result = await chunkSection({
      filePath: "src/sections/neural-foundations.jsx",
      source: "/* fake source */",
      chapters: [{ id: "1.1", title: "What is a Neural Network?", section: 1, sectionName: "Neural Network Foundations" }],
      svgDescriptions: {},
    });

    expect(result["1.1"]).toHaveLength(1);
    expect(result["1.1"][0].text).toBe(sampleText);
    expect(mockSpawn).toHaveBeenCalledOnce();
    const [cmd, args] = mockSpawn.mock.calls[0];
    expect(cmd).toBe("claude");
    expect(args).toContain("-p");
    expect(args).toContain("--output-format");
    expect(args[args.indexOf("--output-format") + 1]).toBe("json");
    expect(args).toContain("--model");
    expect(args).toContain("--effort");
    expect(args[args.indexOf("--effort") + 1]).toBe("high");
    expect(args).toContain("--json-schema");
    expect(args).toContain("--system-prompt");
    // --bare is intentionally NOT passed: it disables OAuth/keychain auth and
    // would force ANTHROPIC_API_KEY usage, breaking subscription billing.
    expect(args).not.toContain("--bare");
    expect(args).toContain("--no-session-persistence");
    expect(args).toContain("--max-budget-usd");
  });

  it("retries on non-zero exit code then succeeds", async () => {
    const innerJson = JSON.stringify({
      chunks: { "1.1": [{ sub: 0, kind: "summary", text: sampleText, summary: "x is x", queries: tenQueries, terms: ["t"] }] },
    });
    const wrapperJson = JSON.stringify({ type: "result", subtype: "success", is_error: false, result: innerJson });

    mockSpawn
      .mockImplementationOnce(fakeProcFactory({ stderr: "transient", exitCode: 1 }))
      .mockImplementationOnce(fakeProcFactory({ stdout: wrapperJson }));

    const result = await chunkSection({
      filePath: "f.jsx",
      source: "x",
      chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
      svgDescriptions: {},
    });
    expect(result["1.1"]).toHaveLength(1);
    expect(mockSpawn).toHaveBeenCalledTimes(2);
  });

  it("throws on schema-invalid response (empty queries)", async () => {
    const innerJson = JSON.stringify({
      chunks: { "1.1": [{ sub: 0, kind: "summary", text: sampleText, summary: "x is x", queries: [], terms: ["t"] }] },
    });
    const wrapperJson = JSON.stringify({ type: "result", subtype: "success", is_error: false, result: innerJson });
    mockSpawn.mockImplementationOnce(fakeProcFactory({ stdout: wrapperJson }));

    await expect(
      chunkSection({
        filePath: "f.jsx",
        source: "x",
        chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
        svgDescriptions: {},
      }),
    ).rejects.toThrow(/queries/);
  });

  it("reads structured_output when present (claude --json-schema mode)", async () => {
    // When --json-schema is set, claude returns the validated object in
    // wrapper.structured_output and leaves wrapper.result empty.
    const wrapperJson = JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      result: "",
      structured_output: {
        chunks: {
          "1.1": [
            { sub: 0, kind: "concept", text: sampleText, summary: "Intro", queries: tenQueries, terms: ["t"] },
          ],
        },
      },
    });
    mockSpawn.mockImplementationOnce(fakeProcFactory({ stdout: wrapperJson }));
    const result = await chunkSection({
      filePath: "f.jsx",
      source: "x",
      chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
      svgDescriptions: {},
    });
    expect(result["1.1"]).toHaveLength(1);
    expect(result["1.1"][0].text).toBe(sampleText);
  });

  it("throws on is_error=true wrapper", async () => {
    const wrapperJson = JSON.stringify({ type: "result", subtype: "error_during_execution", is_error: true, result: "model overloaded" });
    // Same wrapper repeated 5 times because retries
    for (let i = 0; i <= 4; i++) {
      mockSpawn.mockImplementationOnce(fakeProcFactory({ stdout: wrapperJson }));
    }
    await expect(
      chunkSection({
        filePath: "f.jsx",
        source: "x",
        chapters: [{ id: "1.1", title: "X", section: 1, sectionName: "S" }],
        svgDescriptions: {},
      }),
    ).rejects.toThrow(/reported error/);
    expect(mockSpawn).toHaveBeenCalledTimes(5); // initial + 4 retries
  }, 15000);
});
