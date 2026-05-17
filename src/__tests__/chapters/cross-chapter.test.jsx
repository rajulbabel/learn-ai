import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { chapters } from "../../config.js";
import { makeCtx } from "../chapter-test-helpers.js";

const loaders = import.meta.glob("../../chapters/**/*.jsx", { eager: true });

afterEach(() => cleanup());

describe("cross-chapter", () => {
  it("every chapter has a loader entry", () => {
    for (const ch of chapters) {
      const key = `../../chapters/${ch.file}.jsx`;
      expect(loaders[key], `missing chapter file for ${ch.id} (${ch.file})`).toBeDefined();
    }
  });

  it("every chapter's default export is a function named after its component", () => {
    for (const ch of chapters) {
      const mod = loaders[`../../chapters/${ch.file}.jsx`];
      expect(typeof mod.default, `${ch.id} default not a function`).toBe("function");
      expect(mod.default.name, `${ch.id} function name mismatch`).toBe(ch.component);
    }
  });

  it("every chapter renders at sub=0 without throwing", () => {
    for (const ch of chapters) {
      const mod = loaders[`../../chapters/${ch.file}.jsx`];
      const fn = mod.default;
      expect(() => render(fn(makeCtx({ sub: 0 }))), `${ch.id} threw at sub=0`).not.toThrow();
      cleanup();
    }
  });

  it("no orphan chapter file (every chapter file is referenced by config)", () => {
    const referenced = new Set(chapters.map((c) => `../../chapters/${c.file}.jsx`));
    for (const key of Object.keys(loaders)) {
      expect(referenced.has(key), `orphan chapter file ${key}`).toBe(true);
    }
  });
});
