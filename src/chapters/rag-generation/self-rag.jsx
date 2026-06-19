import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const SR_GATE_QUERIES = [
  {
    q: "What is 2 + 2?",
    decision: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    why: "Factoid the model already knows from pre-training.",
  },
  {
    q: "How do I reset my password?",
    decision: "<retrieve>",
    color: C.green,
    accent: "#a5d6a7",
    why: "Custom-corpus knowledge the model cannot answer without retrieval.",
  },
  {
    q: "Summarize what we just discussed.",
    decision: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    why: "Context already in the conversation; no external lookup needed.",
  },
];

const SR_TOKENS = [
  { name: "<retrieve>", color: C.green, accent: "#a5d6a7", def: "Retrieve a document now." },
  {
    name: "<no-retrieve>",
    color: C.red,
    accent: "#ef9a9a",
    def: "Do not retrieve. Answer from the model's own knowledge.",
  },
  {
    name: "<isrel>",
    color: C.cyan,
    accent: "#80deea",
    def: "Is this retrieved doc relevant? Emitted after each retrieved doc.",
  },
  {
    name: "<issup>",
    color: C.purple,
    accent: "#b8a9ff",
    def: "Is the answer supported by the retrieved doc? Emitted with the answer.",
  },
];

const SR_TIMELINE = [
  { label: "<retrieve>", role: "Model gates retrieval", color: C.green },
  { label: "Reformulate", role: "Tokens 2-3 produce a search query", color: C.cyan },
  { label: "doc-1 In", role: "Retriever returns top doc", color: "#80deea" },
  { label: "<isrel>", role: "Model judges doc-1 relevant", color: C.cyan },
  { label: "Answer", role: "Tokens 6-20 generate answer text", color: C.yellow },
  { label: "<issup>", role: "Model judges answer supported", color: C.purple },
];

const SR_CRITIQUE = [
  { doc: "doc-1 (Password Reset)", isrel: "RELEVANT", color: C.green, accent: "#a5d6a7", action: "Keep" },
  {
    doc: "doc-9 (Login Troubleshooting)",
    isrel: "PARTIALLY RELEVANT",
    color: C.yellow,
    accent: "#ffe082",
    action: "Keep But De-Weight",
  },
  { doc: "doc-22 (Rate Limits)", isrel: "IRRELEVANT", color: C.red, accent: "#ef9a9a", action: "Drop" },
];

const SR_WINS = [
  "Mixed-knowledge corpora (some queries need retrieval, some don't)",
  "Latency-sensitive workloads (skips retrieval for ~40% of queries)",
  "Adaptive depth (decides how many docs to fetch)",
];
const SR_LIMITS = [
  "Requires a model trained for Self-RAG (not plug-and-play)",
  "Token vocabulary increases serialization cost",
  "Calibration of the special-token classifier is the bottleneck",
];

export default function SelfRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=2 timeline geometry.
  const TL_VB_W = 760;
  const TL_VB_H = 220;
  const TL_LINE_Y = 90;
  const TL_LEFT = 90;
  const TL_RIGHT = 670;
  const TL_STEP = (TL_RIGHT - TL_LEFT) / (SR_TIMELINE.length - 1);

  // Sub=3 gate geometry.
  const GATE_VB_W = 720;
  const GATE_VB_H = 300;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── The retrieval gate problem */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Should The Model Retrieve, Or Just Answer?
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Always-retrieve wastes tokens and latency. Never-retrieve risks hallucination. Self-RAG (Asai et al. 2023)
            teaches the model to decide per-query whether retrieval is needed.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {SR_GATE_QUERIES.map((q, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${q.color}06`,
                  border: `1px solid ${q.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={q.color} bold center size={14} style={{ fontFamily: "ui-monospace, monospace" }}>
                  "{q.q}"
                </T>
                <T
                  color={q.color}
                  bold
                  center
                  size={14}
                  style={{ marginTop: 10, fontFamily: "ui-monospace, monospace" }}
                >
                  {q.decision}
                </T>
                <T color={q.accent} center size={13} style={{ marginTop: 8 }}>
                  {q.why}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Four special tokens */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Four Special Tokens
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Self-RAG extends the model vocabulary with four control tokens. The model emits them inline as part of
            generation. The runtime intercepts each one and acts.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SR_TOKENS.map((tok) => (
              <div
                key={tok.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${tok.color}06`,
                  border: `1px solid ${tok.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tok.color} bold center size={18} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {tok.name}
                </T>
                <T color={tok.accent} center size={13} style={{ marginTop: 8 }}>
                  {tok.def}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Token emission timeline */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Token Emission Timeline On A Real Query
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            For "How do I reset my password?" the model emits a sequence of control tokens interleaved with regular
            answer text. Each marker is a decision point the runtime watches.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TL_VB_W} ${TL_VB_H}`} width="100%" style={{ maxWidth: 760, height: "auto" }}>
              <desc>
                Self-RAG token-emission timeline showing the model alternating between special control tokens like
                {" <retrieve>, <isrel>, and <issup>"} across the generation sequence.
              </desc>
              <line
                x1={TL_LEFT}
                y1={TL_LINE_Y}
                x2={TL_RIGHT}
                y2={TL_LINE_Y}
                stroke="#b8a9ff"
                strokeOpacity="0.6"
                strokeWidth="2"
              />
              {SR_TIMELINE.map((ev, i) => {
                const x = TL_LEFT + i * TL_STEP;
                const isAbove = i % 2 === 0;
                const labelY = isAbove ? TL_LINE_Y - 30 : TL_LINE_Y + 36;
                const roleY = isAbove ? TL_LINE_Y - 14 : TL_LINE_Y + 52;
                return (
                  <g key={i}>
                    <circle cx={x} cy={TL_LINE_Y} r="8" fill={ev.color} stroke={ev.color} strokeOpacity="0.7" />
                    <text
                      x={x}
                      y={labelY}
                      fill={ev.color}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="ui-monospace, monospace"
                    >
                      {ev.label}
                    </text>
                    <text x={x} y={roleY} fill="#b8a9ff" fontSize="11" textAnchor="middle">
                      {ev.role}
                    </text>
                  </g>
                );
              })}
              <text
                x={TL_VB_W / 2}
                y={TL_VB_H - 16}
                fill="#b8a9ff"
                fontSize="12"
                fontStyle="italic"
                textAnchor="middle"
              >
                Generation Order Left-To-Right
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Retrieve / no-retrieve gate */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Retrieve / No-Retrieve Gate
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The decision diamond sits at the top of every generation. Trained via instruction tuning plus RL on
            retrieval decisions, the gate reduces unnecessary retrievals by ~40% in the original Asai et al. paper.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${GATE_VB_W} ${GATE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Retrieve / no-retrieve decision diamond that gates whether the Self-RAG model fetches external context
                for a given query.
              </desc>

              <rect
                x={260}
                y={10}
                width={200}
                height={42}
                rx="8"
                fill={C.blue}
                fillOpacity="0.2"
                stroke={C.blue}
                strokeOpacity="0.7"
              />
              <text x={360} y={36} fill="#90caf9" fontSize="13" fontWeight="700" textAnchor="middle">
                User Query
              </text>

              <line x1={360} y1={52} x2={360} y2={80} stroke="#a5d6a7" strokeOpacity="0.6" />
              <polygon
                points="360,80 480,140 360,200 240,140"
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={360} y={135} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Need External
              </text>
              <text x={360} y={153} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Knowledge?
              </text>

              <line x1={480} y1={140} x2={545} y2={140} stroke={C.green} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={512} y={132} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="middle">
                YES
              </text>
              <rect
                x={545}
                y={116}
                width={165}
                height={50}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text
                x={627}
                y={136}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"<retrieve> -> <isrel>"}
              </text>
              <text
                x={627}
                y={153}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"-> <issup>"}
              </text>

              <line x1={240} y1={140} x2={175} y2={140} stroke={C.red} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={208} y={132} fill="#ef9a9a" fontSize="12" fontWeight="700" textAnchor="middle">
                NO
              </text>
              <rect
                x={10}
                y={116}
                width={165}
                height={50}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text
                x={92}
                y={136}
                fill="#ef9a9a"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"<no-retrieve>"}
              </text>
              <text
                x={92}
                y={153}
                fill="#ef9a9a"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {"-> Answer"}
              </text>

              <text x={360} y={240} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Trained Via Instruction Tuning + RL
              </text>
              <text x={360} y={262} fill="#a5d6a7" fontSize="12" textAnchor="middle">
                Reduces Unnecessary Retrievals ~40% (Asai Et Al. 2023)
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Self-critique loop */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Self-Critique: Re-Score Every Retrieved Doc
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            After retrieval, the model emits an &lt;isrel&gt; token per doc to grade relevance. Irrelevant docs are
            dropped; partially relevant docs are kept but down-weighted. After the answer, the model emits an
            &lt;issup&gt; token to grade whether the answer is supported.
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
              Per-Doc Critique
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.6fr 1.2fr 1fr",
                gap: 8,
                fontSize: 13,
              }}
            >
              <T color="#ffcc80" bold size={13}>
                Doc
              </T>
              <T color="#ffcc80" bold size={13}>
                &lt;isrel&gt; Verdict
              </T>
              <T color="#ffcc80" bold size={13}>
                Action
              </T>
              {SR_CRITIQUE.flatMap((row, i) => [
                <T key={`${i}-d`} color={row.accent} size={13}>
                  {row.doc}
                </T>,
                <T key={`${i}-v`} color={row.color} bold size={13} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {row.isrel}
                </T>,
                <T key={`${i}-a`} color={row.accent} size={13}>
                  {row.action}
                </T>,
              ])}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={15}>
              &lt;issup&gt; Final Verdict
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
              FULLY-SUPPORTED | PARTIALLY-SUPPORTED | NO-SUPPORT
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 8 }}>
              Emitted after the answer to label how grounded the answer is in the kept docs.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Wins and limits */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Self-RAG Wins And Limits
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Self-RAG is a model contract, not a prompting trick. Use it when you can fine-tune. The wins are real but
            the cost is owning the special-token classifier calibration.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                Wins
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {SR_WINS.map((w, i) => (
                  <T key={i} color="#a5d6a7" center size={13}>
                    {w}
                  </T>
                ))}
              </div>
            </div>
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
                Limits
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {SR_LIMITS.map((l, i) => (
                  <T key={i} color="#ef9a9a" center size={13}>
                    {l}
                  </T>
                ))}
              </div>
            </div>
          </div>

          <T color="#f48fb1" center size={14} style={{ marginTop: 12 }}>
            Pick Self-RAG when fine-tuning is on the table and the workload mixes retrieval-needing and already-knew-it
            queries.
          </T>
        </Box>
      </Reveal>
      {sub < 5 && (
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
