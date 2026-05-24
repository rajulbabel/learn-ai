import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("semantic embedding runs in a Web Worker (no main-thread freeze)", () => {
  it("src/search-worker.js exists", () => {
    expect(existsSync("src/search-worker.js")).toBe(true);
  });

  it("worker file imports transformers.js and listens for messages", () => {
    const src = readFileSync("src/search-worker.js", "utf-8");
    expect(src).toMatch(/@huggingface\/transformers/);
    expect(src).toMatch(/self\.onmessage|addEventListener\(["']message["']/);
    expect(src).toMatch(/pipeline\(/);
  });

  it("worker posts a 'ready' message after pipeline loads", () => {
    const src = readFileSync("src/search-worker.js", "utf-8");
    expect(src).toMatch(/postMessage\([^)]*ready/);
  });

  it("search.js spawns the worker via Vite's new Worker(new URL(...)) pattern", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/new\s+Worker\(\s*new\s+URL\(\s*["']\.\/search-worker\.js["']/);
  });

  it("search.js no longer dynamically imports transformers.js on the main thread", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).not.toMatch(/await\s+import\(\s*["']@huggingface\/transformers["']/);
  });
});
