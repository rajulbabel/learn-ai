/**
 * Anthropic-SDK wrapper that asks Claude to author search chunks
 * for a single section file. Uses prompt caching on the stable
 * preamble (instructions + schema) for cheap re-runs.
 */
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MIN_QUERIES = 10;
const MAX_RETRIES = 4;

const SYSTEM_PROMPT = `You are a search-index authoring assistant for an interactive learning app about AI.

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

Emit your output by calling the emit_chunks tool exactly once with the full result.`;

const TOOL_SCHEMA = {
  name: "emit_chunks",
  description: "Emit the structured chunk array for every chapter in this section file.",
  input_schema: {
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
  },
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

export async function chunkSection({ filePath, source, chapters, svgDescriptions }, { model, apiKey } = {}) {
  const resolvedKey = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!resolvedKey) {
    throw new Error("ANTHROPIC_API_KEY is required (set in .env or pass apiKey option)");
  }
  const client = new Anthropic({ apiKey: resolvedKey });
  const chosenModel = model || process.env.LEARN_AI_CHUNK_MODEL || DEFAULT_MODEL;

  const userMessage = buildUserMessage({ filePath, source, chapters, svgDescriptions });

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: chosenModel,
        max_tokens: 16384,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "tool", name: "emit_chunks" },
        messages: [{ role: "user", content: userMessage }],
      });

      if (response.stop_reason === "max_tokens") {
        throw new Error("Model output truncated (stop_reason=max_tokens). Increase max_tokens or split the section file.");
      }

      // If the model returned text instead of calling the tool, retrying the same
      // prompt is unlikely to help. Surface the error rather than retrying.
      const toolUse = response.content.find((b) => b.type === "tool_use" && b.name === "emit_chunks");
      if (!toolUse) throw new Error("Model did not call emit_chunks");
      return validateAndCoerce(toolUse.input, chapters.map((c) => c.id));
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || err.status === 529 || err.status >= 500;
      if (!retryable || attempt === MAX_RETRIES) throw err;
      const wait = Math.min(2 ** attempt * 500, 8000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
