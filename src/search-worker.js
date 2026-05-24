// Web Worker for semantic embedding. Runs ONNX model parsing + inference off
// the main thread so the page stays interactive during the ~100 MB BGE model
// load. Owns transformers.js + the pipeline. The main thread (search.js)
// drives it via postMessage and never touches transformers.js directly.
//
// Message protocol (main -> worker):
//   { type: "init", modelName, dtype, basePath, queryInstruction }
//   { type: "embed", id, text }
//
// Message protocol (worker -> main):
//   { type: "progress", value }     // 0..1 from transformers.js progress_callback
//   { type: "ready" }                // pipeline loaded, ready for embed calls
//   { type: "init-error", message }
//   { type: "embed-result", id, vector }
//   { type: "embed-result", id, error }
import { pipeline, env } from "@huggingface/transformers";

let embedPipeline = null;
let queryInstruction = "";

async function handleInit({ modelName, dtype, basePath, queryInstruction: qi }) {
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = basePath;
  queryInstruction = qi || "";
  try {
    embedPipeline = await pipeline("feature-extraction", modelName, {
      dtype,
      progress_callback: (p) => {
        if (p && p.status === "progress" && typeof p.progress === "number") {
          self.postMessage({ type: "progress", value: p.progress });
        }
      },
    });
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "init-error", message: err?.message || String(err) });
  }
}

async function handleEmbed({ id, text }) {
  try {
    const prefixed = queryInstruction + text;
    const res = await embedPipeline(prefixed, { pooling: "mean", normalize: true });
    self.postMessage({ type: "embed-result", id, vector: res.tolist()[0] });
  } catch (err) {
    self.postMessage({ type: "embed-result", id, error: err?.message || String(err) });
  }
}

self.onmessage = (e) => {
  const msg = e.data || {};
  if (msg.type === "init") return handleInit(msg);
  if (msg.type === "embed") return handleEmbed(msg);
};
