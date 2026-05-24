import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";

describe("index.html static SEO body content", () => {
  let html;

  beforeAll(() => {
    html = readFileSync("index.html", "utf-8");
  });

  it("contains an <h1> with the site name and author", () => {
    expect(html).toMatch(/<h1[^>]*>[\s\S]*Learn AI[\s\S]*Rajul Babel[\s\S]*<\/h1>/);
  });

  it("renders fallback content inside #root so crawlers see text without JS", () => {
    const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<noscript/);
    expect(rootMatch, "#root must contain static fallback content").toBeTruthy();
    const inner = rootMatch[1];
    expect(inner).toMatch(/Rajul Babel/);
    expect(inner).toMatch(/Learn AI/);
    expect(inner.replace(/<[^>]+>/g, "").trim().length).toBeGreaterThan(400);
  });

  it("includes a <noscript> block describing the site for non-JS clients", () => {
    const nos = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
    expect(nos, "<noscript> block required for SEO").toBeTruthy();
    expect(nos[1]).toMatch(/Rajul Babel/);
    expect(nos[1]).toMatch(/Learn AI/);
  });

  it("static body lists core curriculum topics so crawlers see content", () => {
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
    const topics = [
      "Neural Networks",
      "Transformer",
      "Attention",
      "RAG",
      "Vector",
      "Agent",
    ];
    for (const t of topics) {
      expect(body, `body must mention "${t}"`).toMatch(new RegExp(t));
    }
  });

  it("hides .seo-fallback visually so humans never see the pre-JS flash", () => {
    // Fallback stays in DOM for crawlers (still asserted above). For human
    // browsers we move it off-screen so the React shell paints first - no
    // flash of unstyled SEO text before the app mounts.
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    expect(styleMatch, "<style> block required").toBeTruthy();
    const css = styleMatch[1];
    const rule = css.match(/\.seo-fallback\s*\{[^}]*\}/);
    expect(rule, ".seo-fallback rule required").toBeTruthy();
    expect(rule[0]).toMatch(/position:\s*absolute/);
    expect(rule[0]).toMatch(/left:\s*-?\d{4,}px/);
  });
});
