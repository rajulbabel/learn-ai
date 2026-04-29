import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("bge-base-en-v1.5 model assets", () => {
  it("has model-meta.json with required fields", () => {
    const path = "public/models/bge-base-en-v1.5-q4/model-meta.json";
    expect(existsSync(path)).toBe(true);
    const meta = JSON.parse(readFileSync(path, "utf-8"));
    expect(meta.repo).toBe("Xenova/bge-base-en-v1.5");
    expect(typeof meta.dtype).toBe("string");
    expect(meta.dim).toBe(768);
    expect(typeof meta.checksum).toBe("string");
    expect(meta.checksum).toMatch(/^[0-9a-f]{16}$/);
    expect(typeof meta.weightFile).toBe("string");
    expect(meta.queryInstruction).toMatch(/^Represent /);
  });

  it("has the weight file referenced by model-meta", () => {
    const meta = JSON.parse(
      readFileSync("public/models/bge-base-en-v1.5-q4/model-meta.json", "utf-8"),
    );
    expect(existsSync(`public/models/bge-base-en-v1.5-q4/${meta.weightFile}`)).toBe(true);
  });
});
