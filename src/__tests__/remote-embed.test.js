import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

describe("Cloudflare Workers AI embed proxy", () => {
  it("cf-worker/worker.js exists", () => {
    expect(existsSync("cf-worker/worker.js")).toBe(true);
  });

  it("worker invokes the bge-base-en-v1.5 model via env.AI.run", () => {
    const src = readFileSync("cf-worker/worker.js", "utf-8");
    expect(src).toMatch(/@cf\/baai\/bge-base-en-v1\.5/);
    expect(src).toMatch(/env\.AI\.run/);
  });

  it("worker emits permissive CORS headers so the static site can call it", () => {
    const src = readFileSync("cf-worker/worker.js", "utf-8");
    expect(src).toMatch(/access-control-allow-origin/i);
    expect(src).toMatch(/OPTIONS/);
  });

  it("wrangler.toml declares the AI binding", () => {
    expect(existsSync("cf-worker/wrangler.toml")).toBe(true);
    const toml = readFileSync("cf-worker/wrangler.toml", "utf-8");
    expect(toml).toMatch(/\[ai\]/);
    expect(toml).toMatch(/binding\s*=\s*["']AI["']/);
  });
});

describe("search.js routes embedQuery to the remote endpoint", () => {
  it("reads VITE_EMBED_API_URL from import.meta.env", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/VITE_EMBED_API_URL/);
  });

  it("uses fetch() against the remote URL inside embedQuery", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).toMatch(/fetch\(\s*REMOTE_EMBED_URL/);
  });

  it("no longer ships a local search-worker.js or transformers.js path", () => {
    const src = readFileSync("src/search.js", "utf-8");
    expect(src).not.toMatch(/new\s+Worker\(/);
    expect(src).not.toMatch(/@huggingface\/transformers/);
    expect(existsSync("src/search-worker.js")).toBe(false);
  });
});
