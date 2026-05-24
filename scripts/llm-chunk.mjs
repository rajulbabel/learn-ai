/**
 * Spawn the local `claude` CLI to author search chunks for one section file.
 * Bills against the user's Claude Code subscription (no API credits needed).
 * Uses --json-schema for server-validated structured output.
 */
import { spawn } from "child_process";
import { appendFileSync, openSync, closeSync } from "fs";

const DEBUG_LOG = process.env.LEARN_AI_CHUNK_DEBUG_LOG || "/tmp/claude-chunk-debug.log";

const DEFAULT_MODEL = "claude-opus-4-7";
const DEFAULT_EFFORT = "high";
const MIN_QUERIES = 10;
const MAX_RETRIES = 4;
const PER_CALL_BUDGET_USD = "5";

export const SYSTEM_PROMPT = `You are a search-index authoring assistant for an interactive learning app about AI.

Your job: read the JSX source of one section file and produce semantic-search chunks for every chapter in it.

For each chapter, produce 1 chunk per sub-step plus 1 chapter-level summary chunk plus 1 chunk per labeled diagram.

CRITICAL RULES:
1. text: clean prose. Strip JSX, props, "Continue" button labels, UI noise. Preserve numbers, formula symbols, code blocks, example sentences, and concrete values exactly.
2. summary: ONE sentence in plain English. What the student learns from this chunk.
3. queries: 15-20 hypothetical questions the chunk answers. Mix paraphrases, term variants, conceptual rephrasings, and natural-language searches a learner would actually type.
4. terms: 3-10 key terms and synonyms (technical names, abbreviations, alternate phrasings).
5. kind: pick the best fit:
   - "concept": text-heavy explanation
   - "formula": equations or step-by-step math
   - "example": worked example with concrete numbers
   - "diagram": describes a visual / SVG
   - "summary": chapter-level summary (use only for sub: -1)
6. sub: integer matching the chapter sub-step. Use -1 for chapter-level summary, -2 for diagram-only chunks.
7. Never write chapter IDs (e.g., "Chapter 5.5" or "Chapter N.M") in the text or summary fields. Chapter IDs change when content is reordered, so cached prose with embedded IDs goes stale. Refer to the chapter by its topic name or with phrases like "this chapter" instead.

Output ONLY a JSON object matching the provided schema. No markdown fences, no commentary.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    chunks: {
      type: "object",
      description: "Map of chapter ID to chunk array. Every chapter passed in must have an entry.",
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sub: { type: "integer" },
            kind: { type: "string", enum: ["concept", "formula", "example", "diagram", "summary"] },
            text: { type: "string", minLength: 10 },
            summary: { type: "string", minLength: 5 },
            queries: { type: "array", items: { type: "string", minLength: 3 }, minItems: 10, maxItems: 25 },
            terms: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 },
          },
          required: ["sub", "kind", "text", "summary", "queries", "terms"],
        },
      },
    },
  },
  required: ["chunks"],
};

function buildUserMessage({ filePath, source, chapters, svgDescriptions }) {
  const chapterList = chapters
    .map((c) => `- ${c.id} | ${c.title} | section ${c.section} (${c.sectionName})`)
    .join("\n");
  const svgBlock = Object.keys(svgDescriptions).length
    ? `\n\nSVG descriptions for diagrams in this file:\n${JSON.stringify(svgDescriptions, null, 2)}`
    : "";
  return `Section file: ${filePath}

Chapters in this file (you must emit chunks for every one):
${chapterList}
${svgBlock}

Source code:
\`\`\`jsx
${source}
\`\`\``;
}

function validateAndCoerce(raw, expectedChapterIds) {
  if (!raw || typeof raw !== "object" || !raw.chunks) {
    throw new Error("Response missing 'chunks' object");
  }
  for (const id of expectedChapterIds) {
    const arr = raw.chunks[id];
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error(`No chunks emitted for chapter ${id}`);
    }
    for (const c of arr) {
      if (!Array.isArray(c.queries) || c.queries.length < MIN_QUERIES) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has fewer than ${MIN_QUERIES} queries`);
      }
      if (!Array.isArray(c.terms) || c.terms.length === 0) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has empty terms`);
      }
      if (typeof c.text !== "string" || c.text.trim().length < 10) {
        throw new Error(`Chunk for ${id} sub=${c.sub} has too-short text`);
      }
    }
  }
  return raw.chunks;
}

function debugAppend(line) {
  try {
    appendFileSync(DEBUG_LOG, line);
  } catch {
    // Silently ignore log append failures
  }
}

function spawnClaude(args, userMessage, label) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    debugAppend(`\n=== [${new Date().toISOString()}] START ${label} ===\n`);
    const proc = spawn("claude", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => {
      const s = d.toString();
      stderr += s;
      // Live stream debug output to the persistent log file
      debugAppend(s);
    });
    proc.on("error", (e) => {
      debugAppend(`[error event] ${e.message}\n`);
      reject(e);
    });
    proc.on("close", (code) => {
      const ms = Date.now() - startedAt;
      debugAppend(`=== [${new Date().toISOString()}] CLOSE ${label} code=${code} elapsed=${ms}ms ===\n`);
      if (code !== 0) {
        const err = new Error(`claude exited ${code}: ${stderr.slice(0, 500)}`);
        err.exitCode = code;
        err.stderr = stderr;
        reject(err);
        return;
      }
      resolve(stdout);
    });
    proc.stdin.end(userMessage);
  });
}

export async function chunkSection({ filePath, source, chapters, svgDescriptions }, opts = {}) {
  const model = opts.model || process.env.LEARN_AI_CHUNK_MODEL || DEFAULT_MODEL;
  const effort = opts.effort || process.env.LEARN_AI_CHUNK_EFFORT || DEFAULT_EFFORT;
  const userMessage = buildUserMessage({ filePath, source, chapters, svgDescriptions });

  // Note: we deliberately omit --bare. With --bare, claude requires ANTHROPIC_API_KEY
  // and never reads OAuth/keychain — which means the user's Claude subscription auth
  // is bypassed and the call fails with "Not logged in". Without --bare, claude uses
  // the same subscription credentials as the host shell.
  const args = [
    "-p",
    "--output-format", "json",
    "--model", model,
    "--effort", effort,
    "--json-schema", JSON.stringify(OUTPUT_SCHEMA),
    "--system-prompt", SYSTEM_PROMPT,
    "--no-session-persistence",
    "--max-budget-usd", PER_CALL_BUDGET_USD,
    "--debug-file", `/tmp/claude-cli-debug-${process.pid}.log`,
  ];

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const label = `${filePath} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`;
      const stdout = await spawnClaude(args, userMessage, label);
      let wrapper;
      try {
        wrapper = JSON.parse(stdout);
      } catch (e) {
        throw new Error(`claude output is not valid JSON: ${e.message}; raw: ${stdout.slice(0, 200)}`);
      }
      if (wrapper.is_error) {
        throw new Error(`claude reported error: ${wrapper.result || wrapper.subtype || "unknown"}`);
      }
      // When --json-schema is set, the validated object lands in structured_output;
      // result is empty. When --json-schema is NOT set, the JSON is in result as a string.
      let inner;
      if (wrapper.structured_output && typeof wrapper.structured_output === "object") {
        inner = wrapper.structured_output;
      } else {
        try {
          inner = typeof wrapper.result === "string" ? JSON.parse(wrapper.result) : wrapper.result;
        } catch (e) {
          throw new Error(`claude inner result is not valid JSON: ${e.message}; raw: ${String(wrapper.result).slice(0, 200)}`);
        }
      }
      return validateAndCoerce(inner, chapters.map((c) => c.id));
    } catch (err) {
      lastErr = err;
      // Retry only on transient subprocess failures or parse errors
      const transient =
        err.exitCode !== undefined ||
        /not valid JSON/.test(err.message) ||
        /reported error/.test(err.message);
      if (!transient || attempt === MAX_RETRIES) throw err;
      const wait = Math.min(2 ** attempt * 500, 8000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
