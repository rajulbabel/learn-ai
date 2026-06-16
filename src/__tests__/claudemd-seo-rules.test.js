import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";

describe("CLAUDE.md SEO / AEO sync rules", () => {
  const md = readFileSync("CLAUDE.md", "utf-8");

  it("documents the index.html static body / noscript sync requirement", () => {
    expect(md).toMatch(/static.*body|seo-fallback|noscript/i);
    expect(md).toMatch(/index\.html/);
  });

  it("documents the sitemap.xml <lastmod> bump rule", () => {
    expect(md).toMatch(/sitemap\.xml/);
    expect(md).toMatch(/lastmod/i);
  });

  it("references AEO surfaces (llms.txt) alongside SEO", () => {
    expect(md).toMatch(/llms\.txt/);
    expect(md.toLowerCase()).toMatch(/aeo|answer engine|llm crawler|llm-readable/);
  });

  it("requires the curriculum topic list in index.html static body to mirror config sections", () => {
    expect(md).toMatch(/curriculum|topic list|seo-fallback/i);
  });

  it("keeps the Discoverability Sync Rules section header", () => {
    expect(md).toMatch(/Discoverability Sync Rules/);
  });

  it("documents the freshness-date bump rule for both SEO and AEO", () => {
    // Every shipped change must bump the SEO date (sitemap lastmod) AND the AEO
    // dates (llms.txt "Last updated" + JSON-LD dateModified) to today.
    expect(md).toMatch(/dateModified/);
    expect(md.toLowerCase()).toMatch(/last updated/);
    expect(md).toMatch(/llms\.txt/);
    expect(md.toLowerCase()).toMatch(/every (change|push|shipped)|each (change|push)|on every/);
  });
});
