import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";

function pngSize(buf) {
  if (buf.length < 24) throw new Error("buffer too small for PNG");
  const sig = buf.slice(0, 8);
  const expected = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!sig.equals(expected)) throw new Error("not a PNG");
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function icoEntries(buf) {
  const reserved = buf.readUInt16LE(0);
  const type = buf.readUInt16LE(2);
  const count = buf.readUInt16LE(4);
  if (reserved !== 0 || type !== 1) throw new Error("not an ICO");
  const sizes = [];
  for (let i = 0; i < count; i++) {
    const off = 6 + i * 16;
    let w = buf.readUInt8(off);
    let h = buf.readUInt8(off + 1);
    if (w === 0) w = 256;
    if (h === 0) h = 256;
    sizes.push({ w, h });
  }
  return sizes;
}

describe("favicon assets", () => {
  it("favicon.svg exists", () => {
    expect(existsSync("public/favicon.svg")).toBe(true);
  });

  it("favicon.ico exists and contains 16, 32, 48 sizes", () => {
    const buf = readFileSync("public/favicon.ico");
    const sizes = icoEntries(buf);
    const widths = sizes.map((s) => s.w).sort((a, b) => a - b);
    expect(widths).toEqual([16, 32, 48]);
    for (const s of sizes) expect(s.w).toBe(s.h);
  });

  it("favicon-32.png is 32x32", () => {
    const { width, height } = pngSize(readFileSync("public/favicon-32.png"));
    expect(width).toBe(32);
    expect(height).toBe(32);
  });

  it("favicon-16.png is 16x16", () => {
    const { width, height } = pngSize(readFileSync("public/favicon-16.png"));
    expect(width).toBe(16);
    expect(height).toBe(16);
  });

  it("apple-touch-icon.png is 180x180", () => {
    const { width, height } = pngSize(readFileSync("public/apple-touch-icon.png"));
    expect(width).toBe(180);
    expect(height).toBe(180);
  });

  it("icon-192.png is 192x192 (PWA manifest)", () => {
    const { width, height } = pngSize(readFileSync("public/icon-192.png"));
    expect(width).toBe(192);
    expect(height).toBe(192);
  });

  it("icon-512.png is 512x512 (PWA manifest)", () => {
    const { width, height } = pngSize(readFileSync("public/icon-512.png"));
    expect(width).toBe(512);
    expect(height).toBe(512);
  });

  it("site.webmanifest is valid JSON with required fields", () => {
    const manifest = JSON.parse(readFileSync("public/site.webmanifest", "utf-8"));
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe("/learn-ai/");
    expect(manifest.scope).toBe("/learn-ai/");
    expect(manifest.display).toBeTruthy();
    expect(manifest.background_color).toBeTruthy();
    expect(manifest.theme_color).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    const srcs = manifest.icons.map((i) => i.src);
    expect(srcs).toContain("/learn-ai/icon-192.png");
    expect(srcs).toContain("/learn-ai/icon-512.png");
    for (const icon of manifest.icons) {
      expect(icon.sizes).toBeTruthy();
      expect(icon.type).toBeTruthy();
    }
  });

  it("index.html references all favicon assets and manifest with root-relative paths", () => {
    const html = readFileSync("index.html", "utf-8");
    expect(html).toMatch(/rel="icon"[^>]*type="image\/svg\+xml"[^>]*href="\/favicon\.svg"/);
    expect(html).toMatch(/href="\/favicon\.ico"/);
    expect(html).toMatch(/href="\/favicon-32\.png"/);
    expect(html).toMatch(/href="\/favicon-16\.png"/);
    expect(html).toMatch(/rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/);
    expect(html).toMatch(/rel="manifest"[^>]*href="\/site\.webmanifest"/);
    expect(html).toMatch(/<meta\s+name="theme-color"\s+content="#08080d"\s*\/?>/);
    expect(html).not.toMatch(/href="\/learn-ai\/favicon/);
  });
});
