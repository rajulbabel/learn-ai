#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const svgPath = resolve(publicDir, "favicon.svg");
const svg = readFileSync(svgPath, "utf-8");

function rasterize(size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "rgba(0,0,0,0)",
  });
  return resvg.render().asPng();
}

const targets = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const t of targets) {
  const png = rasterize(t.size);
  const out = resolve(publicDir, t.name);
  writeFileSync(out, png);
  console.log(`Wrote ${t.name} (${png.length.toLocaleString()} bytes, ${t.size}x${t.size})`);
}

const icoSizes = [16, 32, 48];
const icoPngs = icoSizes.map((s) => rasterize(s));
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoSizes.length, 4);

const entries = [];
let offset = 6 + icoSizes.length * 16;
for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i];
  const png = icoPngs[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += png.length;
}

const icoBuf = Buffer.concat([icoHeader, ...entries, ...icoPngs]);
const icoOut = resolve(publicDir, "favicon.ico");
writeFileSync(icoOut, icoBuf);
console.log(
  `Wrote favicon.ico (${icoBuf.length.toLocaleString()} bytes, sizes ${icoSizes.join("/")})`,
);

const manifest = {
  name: "Learn AI by Rajul Babel",
  short_name: "Learn AI",
  description:
    "Free interactive guide. Covers Model Internals, Neural Networks, Transformers, Attention, RAG, Vector Databases, Agent Frameworks.",
  start_url: "/learn-ai/",
  scope: "/learn-ai/",
  display: "standalone",
  background_color: "#08080d",
  theme_color: "#08080d",
  icons: [
    { src: "/learn-ai/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/learn-ai/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    {
      src: "/learn-ai/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
const manifestPath = resolve(publicDir, "site.webmanifest");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote site.webmanifest`);
