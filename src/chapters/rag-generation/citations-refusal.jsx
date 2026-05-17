import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const CR_PROMPT_CITATION = `You are a helpful support assistant. Use the documentation below
to answer the user's question.

For every claim you make, cite the source as [doc-N], where N is
the doc number from the Documentation section. Do NOT cite a doc
you did not use.

Documentation:
{context}

Question: {query}
Answer:`;

const CR_PROMPT_JSON = `{
  "answer": "Your account locks after 5 failed logins.",
  "citations": [
    { "doc_id": "doc-12", "chunk_id": 3, "quote": "5 failed login attempts" }
  ],
  "confidence": 0.92
}`;

const CR_PROMPT_REFUSAL = `If the documentation does not contain enough information to answer,
respond with EXACTLY this sentence and nothing else:
"I don't have enough information to answer that."

Do not invent facts. Do not guess. Do not cite a doc you didn't use.`;

const CR_PROMPT_PRODUCTION = `You are a helpful support assistant. Use ONLY the documentation
below to answer the user's question.

RULES:
1. Cite every claim inline as [doc-N], where N is the doc number.
2. Quote 3-7 words from the cited chunk after each [doc-N].
3. If the docs do not answer the question, respond with EXACTLY:
   "I don't have enough information to answer that."
4. Do not invent facts. Do not paraphrase what isn't in the docs.

Documentation:
{context}

Question: {query}
Answer:`;

function PromptTemplateBlock({ color, accent, title, template }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: `${color}06`,
        border: `1px solid ${color}12`,
      }}
    >
      <T color={color} bold center size={15}>
        {title}
      </T>
      <pre
        style={{
          marginTop: 10,
          padding: 14,
          background: `${color}08`,
          borderRadius: 6,
          color: accent,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          textAlign: "left",
          overflow: "auto",
        }}
      >
        {template}
      </pre>
    </div>
  );
}

const CR_AUDIT_STEPS = [
  {
    n: 1,
    label: "Parse Answer Into Atomic Claims",
    detail: 'Example: "5 failed logins triggers a lock" / "Billing issues hold for 24 hours".',
  },
  {
    n: 2,
    label: "Locate The Cited Chunk For Each Claim",
    detail: "Follow the [doc-N] marker back to the retrieved chunk text.",
  },
  {
    n: 3,
    label: "Score: claim_supported = LLMJudge(claim, chunk)",
    detail: "Aggregate per-claim scores into a faithfulness number from 0 to 1.",
  },
];

const CR_PARSER_ROWS = [
  { marker: "[doc-12]", doc: "doc-12 (Account Lockouts)", chunk: 3, quote: "5 failed login attempts" },
  { marker: "[doc-7]", doc: "doc-7 (Billing Holds)", chunk: 1, quote: "24-hour hold after a failed charge" },
];

export default function CitationsRefusal(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why citations matter */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Why Citations Are A Production Requirement
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Without citations, the user cannot verify the answer and a reviewer cannot audit it. Hallucinations slip
            through silently. With inline [doc-N] markers, every claim is traceable. The same answer with citations is
            an artifact you can review, replay, and trust.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                No Citations
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Query: "Why is my account locked?"
              </T>
              <T
                color="#ef9a9a"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.red}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Your account may be locked due to too many failed logins or a billing issue."
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                User cannot verify. Reviewer cannot audit. Hallucination has nowhere to land.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                With Citations
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Query: "Why is my account locked?"
              </T>
              <T
                color="#a5d6a7"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.green}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Your account locks after 5 failed logins [doc-12]. Billing issues trigger a 24-hour hold [doc-7]."
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Every claim traces to a specific chunk. Audit-friendly. Hallucinations exposed.
              </T>
            </div>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Citation instruction prompt template */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Tell The Model To Cite Inline
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The citation instruction lives in the system prompt. Use a literal [doc-N] marker the model can emit inline.
            Specify that N must come from the Documentation block, not be invented.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.cyan}
              accent="#80deea"
              title="Prompt Template"
              template={CR_PROMPT_CITATION}
            />
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Structured JSON output */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Or Ask For Structured Citations
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            JSON output is machine-parseable and downstream audit pipelines can ingest it without regex. The schema
            below pairs the answer with its citations and a confidence score.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.purple}
              accent="#b8a9ff"
              title="Prompt Template - Structured JSON Output"
              template={CR_PROMPT_JSON}
            />
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
            Structured output makes citations machine-parseable. Better for downstream audit pipelines.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Refusal instruction */}
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Tell The Model To Refuse When Context Is Missing
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Without an explicit refusal instruction, models tend to invent. With one, the model has an authorized exit
            for "I don't know". The exact wording matters - models follow the most precise instructions in the prompt.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.red}
              accent="#ef9a9a"
              title="Prompt Template - Refusal Instruction"
              template={CR_PROMPT_REFUSAL}
            />
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={15}>
                Without Refusal Instruction
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Query: "What's the refund window for monthly plans?" (no matching doc)
              </T>
              <T
                color="#ef9a9a"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.red}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "Monthly plans have a 7-day refund window."
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                Hallucinated. The model guessed because it had no exit.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                With Refusal Instruction
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Same query, same missing doc.
              </T>
              <T
                color="#a5d6a7"
                center
                size={14}
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: `${C.green}06`,
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                "I don't have enough information to answer that."
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                Safe. The user knows the system was honest about its limit.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Faithfulness preview */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Faithfulness: Every Claim Must Trace To A Chunk
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Faithfulness is the share of claims in an answer that are supported by the retrieved chunks. A 3-step audit
            converts citations into a measurable score. Chapters 12.31-12.35 cover RAGAS faithfulness in depth.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {CR_AUDIT_STEPS.map((step) => (
              <div
                key={step.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={15}>
                  Step {step.n}: {step.label}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                  {step.detail}
                </T>
              </div>
            ))}
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            Output is a single number from 0 (none supported) to 1 (every claim has evidence in the retrieved chunks).
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Citation parser */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Parse Citations Back Out Of The Answer
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            After generation, parse [doc-N] markers out of the answer with a regex. Map each marker back to the
            retrieved chunk and render as footnotes or hover tooltips in the UI.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Model Output (Highlighted)
            </T>
            <T
              color="#ffcc80"
              center
              size={14}
              style={{
                marginTop: 10,
                fontFamily: "ui-monospace, monospace",
                padding: 10,
                background: `${C.orange}08`,
                borderRadius: 6,
              }}
            >
              Your account locks after 5 failed logins <span style={{ color: C.orange }}>[doc-12]</span>. Billing issues
              trigger a 24-hour hold <span style={{ color: C.orange }}>[doc-7]</span>.
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 12, fontFamily: "ui-monospace, monospace" }}>
              Regex: \[doc-\d+\]
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Resolved Citation Table
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "0.7fr 1.6fr 0.6fr 2fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#ffcc80" bold size={13}>
                Marker
              </T>
              <T color="#ffcc80" bold size={13}>
                Doc
              </T>
              <T color="#ffcc80" bold size={13}>
                Chunk
              </T>
              <T color="#ffcc80" bold size={13}>
                Quoted Span
              </T>
              {CR_PARSER_ROWS.flatMap((row) => [
                <T key={`${row.marker}-m`} color="#ffcc80" size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {row.marker}
                </T>,
                <T key={`${row.marker}-d`} color="#ffcc80" size={13}>
                  {row.doc}
                </T>,
                <T key={`${row.marker}-c`} color="#ffcc80" size={13}>
                  {row.chunk}
                </T>,
                <T key={`${row.marker}-q`} color="#ffcc80" size={13}>
                  "{row.quote}"
                </T>,
              ])}
            </div>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Render as footnotes or inline tooltips in your UI. Now the user can click a citation and see exactly what
            the model used to write that sentence.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── Production combined template */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Production Template: Citations Plus Refusal
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            One combined template that does both. Numbered RULES make the contract explicit so the model treats
            citations and refusal as non-optional.
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.pink}
              accent="#f48fb1"
              title="Prompt Template - Production"
              template={CR_PROMPT_PRODUCTION}
            />
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Numbered rules survive long context better than prose instructions. The model attends to short structured
            constraints more reliably than to a paragraph.
          </T>
        </Box>
      </Reveal>
      {sub < 6 && (
        <SubBtn
          key={sub}
          onClick={() => {
            setSubBtnRipple(Date.now());
            navigate("forward");
          }}
          rippleKey={subBtnRipple}
          registerSubBtn={registerSubBtn}
        />
      )}
    </div>
  );
}
