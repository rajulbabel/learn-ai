import { describe, it, expect, beforeEach } from "vitest";
import { saveNav, loadNav } from "../nav-persistence.js";

const chapters = [
  { id: "1.1", title: "A", section: 1, component: "A" },
  { id: "1.2", title: "B", section: 1, component: "B" },
  { id: "2.1", title: "C", section: 2, component: "C" },
];

beforeEach(() => {
  localStorage.clear();
});

describe("loadNav", () => {
  it("returns null when nothing is stored", () => {
    expect(loadNav(chapters)).toBeNull();
  });

  it("returns saved ch and sub when config unchanged", () => {
    saveNav(2, 3, chapters);
    expect(loadNav(chapters)).toEqual({ ch: 2, sub: 3 });
  });

  it("returns null when config has changed (chapter added)", () => {
    saveNav(1, 0, chapters);
    const newChapters = [...chapters, { id: "2.2", title: "D", section: 2, component: "D" }];
    expect(loadNav(newChapters)).toBeNull();
  });

  it("returns null when config has changed (chapter removed)", () => {
    saveNav(1, 0, chapters);
    expect(loadNav(chapters.slice(0, 2))).toBeNull();
  });

  it("returns null when config has changed (chapter reordered)", () => {
    saveNav(0, 0, chapters);
    const reordered = [chapters[1], chapters[0], chapters[2]];
    expect(loadNav(reordered)).toBeNull();
  });

  it("returns null when localStorage contains corrupted JSON", () => {
    localStorage.setItem("learn-ai-nav", "not-json");
    expect(loadNav(chapters)).toBeNull();
  });

  it("returns null when localStorage contains empty string", () => {
    localStorage.setItem("learn-ai-nav", "");
    expect(loadNav(chapters)).toBeNull();
  });

  it("returns null when localStorage throws", () => {
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = () => { throw new Error("blocked"); };
    expect(loadNav(chapters)).toBeNull();
    Storage.prototype.getItem = orig;
  });

  it("returns null when saved ch is NaN", () => {
    localStorage.setItem("learn-ai-nav", JSON.stringify({ ch: "abc", sub: 0, fingerprint: "1.1,1.2,2.1" }));
    expect(loadNav(chapters)).toBeNull();
  });

  it("returns null when saved sub is negative", () => {
    localStorage.setItem("learn-ai-nav", JSON.stringify({ ch: 0, sub: -1, fingerprint: "1.1,1.2,2.1" }));
    expect(loadNav(chapters)).toBeNull();
  });

  it("returns null when saved ch is negative", () => {
    localStorage.setItem("learn-ai-nav", JSON.stringify({ ch: -3, sub: 0, fingerprint: "1.1,1.2,2.1" }));
    expect(loadNav(chapters)).toBeNull();
  });
});

describe("saveNav", () => {
  it("persists ch, sub, and fingerprint", () => {
    saveNav(5, 2, chapters);
    const stored = JSON.parse(localStorage.getItem("learn-ai-nav"));
    expect(stored.ch).toBe(5);
    expect(stored.sub).toBe(2);
    expect(stored.fingerprint).toBe("1.1,1.2,2.1");
  });

  it("does not throw when localStorage throws", () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error("quota"); };
    expect(() => saveNav(0, 0, chapters)).not.toThrow();
    Storage.prototype.setItem = orig;
  });
});
