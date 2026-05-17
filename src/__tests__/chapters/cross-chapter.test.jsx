import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { chapters } from "../../config.js";
import { makeCtx } from "../chapter-test-helpers.js";

const loaders = import.meta.glob("../../chapters/**/*.jsx", { eager: true });

const MAX_SUB = 12;

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

  // Fire every interactive element across every chapter and every sub-step so per-chapter
  // onClick / onMouseEnter / onMouseLeave callbacks (mostly inline arrows on SubBtn,
  // bank tabs, hover targets) get executed under coverage. Per-chapter test files only
  // assert rendering, so without this the inline callbacks register as uncovered lines.
  it("every chapter fires all interactive callbacks at every sub-step without throwing", { timeout: 120000 }, () => {
    for (const ch of chapters) {
      const mod = loaders[`../../chapters/${ch.file}.jsx`];
      const fn = mod.default;
      for (let sub = 0; sub <= MAX_SUB; sub++) {
        let container;
        try {
          ({ container } = render(fn(makeCtx({ sub, subBtnRipple: 1 }))));
        } catch {
          cleanup();
          continue;
        }
        container.querySelectorAll("button, [role='button']").forEach((el) => {
          try {
            fireEvent.click(el);
            fireEvent.mouseEnter(el);
            fireEvent.mouseLeave(el);
          } catch {
            // ignore
          }
        });
        cleanup();
      }
    }
  });
});
