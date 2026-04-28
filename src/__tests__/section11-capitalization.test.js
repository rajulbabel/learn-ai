import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILES = [
  "vector-foundations.jsx",
  "vector-compression.jsx",
  "vector-production.jsx",
  "vector-systems.jsx",
];

const read = (rel) => readFileSync(resolve(__dirname, "../sections", rel), "utf8");

describe("section 11 capitalization", () => {
  it.each(FILES)("%s has no lowercase bullets (&bull; <lowercase>)", (rel) => {
    const src = read(rel);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      const m = line.match(/&bull;\s+([a-z])/);
      if (m) violations.push(`${rel}:${i + 1}: ${line.trim()}`);
    });
    expect(violations).toEqual([]);
  });

  it.each(FILES)("%s has no lowercase 'step N' labels", (rel) => {
    const src = read(rel);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      if (/>\s*step \d/.test(line) || /\s step \d+:/.test(line)) {
        violations.push(`${rel}:${i + 1}: ${line.trim()}`);
      }
    });
    expect(violations).toEqual([]);
  });

  it.each(FILES)("%s has no lowercase numbered list items in JSX text", (rel) => {
    const src = read(rel);
    const lines = src.split("\n");
    const violations = [];
    lines.forEach((line, i) => {
      if (/^\s+\d+\. [a-z]/.test(line)) {
        violations.push(`${rel}:${i + 1}: ${line.trim()}`);
      }
    });
    expect(violations).toEqual([]);
  });
});
