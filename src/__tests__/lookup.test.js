import { describe, it, expect } from "vitest";
import { chapters } from "../config.js";

const loaders = import.meta.glob("../chapters/**/*.jsx", { eager: true });

describe("chapter lookup", () => {
  it("every chapter in config has a loader entry", () => {
    for (const ch of chapters) {
      const key = `../chapters/${ch.file}.jsx`;
      expect(loaders[key], `missing chapter file for ${ch.id} (${ch.file})`).toBeDefined();
    }
  });

  it("every loader entry has a callable default export with configured component name", () => {
    for (const ch of chapters) {
      const mod = loaders[`../chapters/${ch.file}.jsx`];
      expect(typeof mod.default).toBe("function");
      expect(mod.default.name).toBe(ch.component);
    }
  });

  it("no orphan chapter file", () => {
    const referenced = new Set(chapters.map((c) => `../chapters/${c.file}.jsx`));
    for (const key of Object.keys(loaders)) {
      expect(referenced.has(key), `orphan chapter file ${key}`).toBe(true);
    }
  });
});
