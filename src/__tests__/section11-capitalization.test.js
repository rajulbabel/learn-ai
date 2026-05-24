import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOPICS = ["vector-foundations", "vector-compression", "vector-production", "vector-systems"];

function chapterFiles(topic) {
  const dir = resolve(__dirname, "../chapters", topic);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".jsx"))
    .map((f) => ({ rel: `${topic}/${f}`, path: join(dir, f) }));
}

const ALL_FILES = TOPICS.flatMap(chapterFiles);

const read = (file) => readFileSync(file.path, "utf8");

describe("section 11 capitalization", () => {
  it.each(ALL_FILES)("$rel has no lowercase bullets (&bull; <lowercase>)", (file) => {
    const src = read(file);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      const m = line.match(/&bull;\s+([a-z])/);
      if (m) violations.push(`${file.rel}:${i + 1}: ${line.trim()}`);
    });
    expect(violations).toEqual([]);
  });

  it.each(ALL_FILES)("$rel has no lowercase 'step N' labels", (file) => {
    const src = read(file);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      if (/>\s*step \d/.test(line) || /\s step \d+:/.test(line)) {
        violations.push(`${file.rel}:${i + 1}: ${line.trim()}`);
      }
    });
    expect(violations).toEqual([]);
  });

  it.each(ALL_FILES)("$rel has no lowercase numbered list items in JSX text", (file) => {
    const src = read(file);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      if (/^\s+\d+\. [a-z]/.test(line)) {
        violations.push(`${file.rel}:${i + 1}: ${line.trim()}`);
      }
    });
    expect(violations).toEqual([]);
  });
});
