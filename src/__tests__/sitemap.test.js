import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";

describe("public/sitemap.xml", () => {
  const xml = readFileSync("public/sitemap.xml", "utf-8");

  it("declares the canonical site URL", () => {
    expect(xml).toMatch(/<loc>https:\/\/rajulbabel\.github\.io\/learn-ai\/<\/loc>/);
  });

  it("includes a <lastmod> in ISO YYYY-MM-DD form so crawlers recrawl on update", () => {
    const m = xml.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/);
    expect(m, "<lastmod> required in sitemap").toBeTruthy();
    const d = new Date(m[1]);
    expect(Number.isNaN(d.getTime())).toBe(false);
  });
});
