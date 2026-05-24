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

  it("prefetchSearch downloads embeddings.bin and the ONNX model in parallel", () => {
    // Bug fix: worker init (which triggers the 99 MB ONNX fetch in-worker)
    // must run concurrently with the main-thread embeddings.bin fetch, not
    // after it. Pattern: a Promise.all (or equivalent) over the two paths.
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/Promise\.all\(/);
    // The bin fetch and the worker init are both kicked off before the await,
    // so the line that posts {type:"init"} appears before the embeddings.bin
    // fetch is awaited.
    const initIdx = src.indexOf('type: "init"');
    const binFetchIdx = src.search(/embeddings\.bin/);
    expect(initIdx).toBeGreaterThan(0);
    expect(binFetchIdx).toBeGreaterThan(0);
    // Both must live inside the same Promise.all scope (rough check: an
    // await Promise.all([...]) exists between the model-meta fetch and the
    // semanticReady = true line).
    const promiseAllIdx = src.indexOf("Promise.all([");
    const readyIdx = src.indexOf("semanticReady = true");
    expect(promiseAllIdx).toBeGreaterThan(0);
    expect(promiseAllIdx).toBeLessThan(readyIdx);
  });
});
