#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/og.png");

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="40%" stop-color="#a78bfa"/>
      <stop offset="75%" stop-color="#00e676"/>
      <stop offset="100%" stop-color="#00b8d4"/>
    </linearGradient>
    <radialGradient id="bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#08080d"/>
    </radialGradient>
    <linearGradient id="logoBorder" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="40%" stop-color="#a78bfa"/>
      <stop offset="75%" stop-color="#00e676"/>
      <stop offset="100%" stop-color="#00b8d4"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g transform="translate(70,70)">
    <rect width="92" height="92" rx="20" fill="#10101a"/>
    <rect x="3" y="3" width="86" height="86" rx="17" fill="none" stroke="url(#logoBorder)" stroke-width="3.6"/>
    <line x1="26" y1="29" x2="46" y2="36" stroke="#a78bfa" stroke-width="2.9" stroke-linecap="round" opacity="0.6"/>
    <line x1="26" y1="63" x2="46" y2="56" stroke="#a78bfa" stroke-width="2.9" stroke-linecap="round" opacity="0.6"/>
    <line x1="26" y1="29" x2="46" y2="56" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" opacity="0.25"/>
    <line x1="26" y1="63" x2="46" y2="36" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" opacity="0.25"/>
    <line x1="46" y1="36" x2="66" y2="46" stroke="#00e676" stroke-width="2.9" stroke-linecap="round" opacity="0.6"/>
    <line x1="46" y1="56" x2="66" y2="46" stroke="#00e676" stroke-width="2.9" stroke-linecap="round" opacity="0.6"/>
    <circle cx="26" cy="29" r="7.2" fill="#ff6b6b"/>
    <circle cx="26" cy="63" r="7.2" fill="#ff6b6b"/>
    <circle cx="46" cy="36" r="7.2" fill="#a78bfa"/>
    <circle cx="46" cy="56" r="7.2" fill="#a78bfa"/>
    <circle cx="66" cy="46" r="7.2" fill="#00e676"/>
  </g>

  <text x="180" y="135" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#e0e0eb" letter-spacing="1">LEARN AI</text>
  <text x="180" y="170" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#9090a8">by Rajul Babel</text>

  <text x="${W / 2}" y="335" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="800" fill="url(#title)" text-anchor="middle">Learn AI</text>

  <text x="${W / 2}" y="410" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#c8c8d8" text-anchor="middle" font-weight="400">A free, visual, interactive guide</text>

  <text x="${W / 2}" y="475" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#80deea" text-anchor="middle" font-weight="500">Internals · RAG · Vector DBs · Agents</text>

  <line x1="80" y1="555" x2="${W - 80}" y2="555" stroke="#2a2a3a" stroke-width="1"/>

  <text x="80" y="595" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#7878a0">rajulbabel.github.io/learn-ai</text>

  <text x="${W - 80}" y="595" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#7878a0" text-anchor="end">linkedin.com/in/rajulbabel</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Helvetica",
  },
});
const png = resvg.render().asPng();
writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length.toLocaleString()} bytes, ${W}x${H})`);
