/**
 * One-shot: fetch Xenova/bge-base-en-v1.5 q4 ONNX + tokenizer files,
 * write to public/models/bge-base-en-v1.5-q4/ for the browser to load
 * from the app's own origin (deterministic, gzipped, cached by Vite).
 *
 * Run: node scripts/quantize-model.mjs
 *
 * If a q4 build is not yet published on the HF hub, this script will
 * try q4f16 then bnb4 then fall back to q8. The chosen dtype is written
 * to model-meta.json so the browser knows which file to load.
 */
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  statSync,
  renameSync,
} from "fs";
import { createHash } from "crypto";
import { join } from "path";

const REPO = "Xenova/bge-base-en-v1.5";
const OUT_DIR = "public/models/bge-base-en-v1.5-q4";
const HF_BASE = "https://huggingface.co";

const MODEL_CANDIDATES = [
  { name: "model_q4.onnx", dtype: "q4" },
  { name: "model_q4f16.onnx", dtype: "q4f16" },
  { name: "model_bnb4.onnx", dtype: "bnb4" },
  { name: "model_quantized.onnx", dtype: "q8" },
];

const SUPPORT_FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "special_tokens_map.json",
];

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function tryDownload(name) {
  const url = `${HF_BASE}/${REPO}/resolve/main/onnx/${name}`;
  const buf = await fetchBuf(url);
  if (buf) return { url, buf };
  return null;
}

function atomicWrite(path, buf) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, buf);
  renameSync(tmp, path);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(join(OUT_DIR, "onnx"), { recursive: true });

  let chosen = null;
  for (const { name, dtype } of MODEL_CANDIDATES) {
    const dest = join(OUT_DIR, "onnx", name);
    // Re-use a previously downloaded ONNX if present
    if (existsSync(dest) && statSync(dest).size > 0) {
      chosen = { name, dtype, size: statSync(dest).size };
      console.log(`  Reusing on-disk ${name} (${(chosen.size / 1024 / 1024).toFixed(1)} MB)`);
      break;
    }
    console.log(`Trying ${name}...`);
    const res = await tryDownload(name);
    if (res) {
      atomicWrite(dest, res.buf);
      chosen = { name, dtype, size: res.buf.length };
      console.log(`  Got ${name} (${(res.buf.length / 1024 / 1024).toFixed(1)} MB)`);
      break;
    }
  }
  if (!chosen) throw new Error("No suitable ONNX model found on HuggingFace");

  for (const f of SUPPORT_FILES) {
    const dest = join(OUT_DIR, f);
    if (existsSync(dest) && statSync(dest).size > 0) continue;
    const buf = await fetchBuf(`${HF_BASE}/${REPO}/resolve/main/${f}`);
    if (!buf) throw new Error(`Failed to download ${f}`);
    atomicWrite(dest, buf);
  }

  const files = [join("onnx", chosen.name), ...SUPPORT_FILES];
  const hash = createHash("sha256");
  for (const f of files) {
    hash.update(readFileSync(join(OUT_DIR, f)));
  }
  const checksum = hash.digest("hex").slice(0, 16);

  const meta = {
    repo: REPO,
    dtype: chosen.dtype,
    weightFile: `onnx/${chosen.name}`,
    dim: 768,
    checksum,
    queryInstruction: "Represent this sentence for searching relevant passages: ",
  };
  atomicWrite(join(OUT_DIR, "model-meta.json"), Buffer.from(JSON.stringify(meta, null, 2)));
  console.log(`\nWrote ${OUT_DIR}/model-meta.json`);
  console.log(`  dtype: ${chosen.dtype}, checksum: ${checksum}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
