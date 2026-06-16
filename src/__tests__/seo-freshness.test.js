import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";

// SEO (Google/Bing) and AEO (LLM crawlers) both reward content that signals
// freshness. SEO reads sitemap.xml <lastmod>; AEO reads llms.txt and the
// JSON-LD dateModified. All three must carry a valid ISO YYYY-MM-DD date and
// are bumped together on every shipped change (see CLAUDE.md).

function isValidISODate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

describe("SEO/AEO freshness dates", () => {
  it("sitemap.xml carries a valid ISO <lastmod> (SEO)", () => {
    const xml = readFileSync("public/sitemap.xml", "utf-8");
    const m = xml.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/);
    expect(m, "<lastmod> required in sitemap").toBeTruthy();
    expect(isValidISODate(m[1])).toBe(true);
  });

  it("index.html JSON-LD carries a valid ISO dateModified (AEO + SEO)", () => {
    const html = readFileSync("index.html", "utf-8");
    const m = html.match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/);
    expect(m, "dateModified required in JSON-LD").toBeTruthy();
    expect(isValidISODate(m[1])).toBe(true);
  });

  it("llms.txt carries a valid ISO 'Last updated' date (AEO)", () => {
    const txt = readFileSync("public/llms.txt", "utf-8");
    const m = txt.match(/last updated[:*\s]*?(\d{4}-\d{2}-\d{2})/i);
    expect(m, "'Last updated' date required in llms.txt").toBeTruthy();
    expect(isValidISODate(m[1])).toBe(true);
  });
});
