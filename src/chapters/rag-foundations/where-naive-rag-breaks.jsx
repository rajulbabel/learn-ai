import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const FAILURE_MODES = [
  { title: "Bad Chunking", desc: "Mid-sentence splits hide answers." },
  { title: "Low Recall", desc: "Lexical mismatch hides relevant docs." },
  { title: "Lost In Middle", desc: "Long contexts skip middle chunks." },
  { title: "No Citation", desc: "Answers without source attribution." },
  { title: "Hallucination", desc: "Fills gaps with confident invention." },
  { title: "Stale Index", desc: "Doc edits not reflected until re-embed." },
  { title: "Cost / Latency", desc: "Per-query LLM tokens add up at scale." },
];

const LOST_IN_MIDDLE_CURVE = [
  { pos: 1, weight: 0.92 },
  { pos: 2, weight: 0.78 },
  { pos: 3, weight: 0.52 },
  { pos: 4, weight: 0.28 },
  { pos: 5, weight: 0.18 },
  { pos: 6, weight: 0.2 },
  { pos: 7, weight: 0.32 },
  { pos: 8, weight: 0.6 },
  { pos: 9, weight: 0.82 },
  { pos: 10, weight: 0.95 },
];

const SSO_CONTEXT_CHUNKS = [
  "[doc-3] SSO is available on Enterprise plan via SAML 2.0.",
  "[doc-3] Enterprise plan includes SSO, audit logs, dedicated support.",
  "[doc-5] Pricing: Basic $10/mo, Pro $25/mo, Enterprise custom.",
];

const SIGNIN_RETRIEVED = [
  "[doc-12] Sign in to view your billing history.",
  "[doc-19] Sign in required to access the API console.",
  "[doc-27] Sign in with Google or Apple supported.",
];

const COST_ROWS = [
  { name: "Embedding", value: "$0.0001" },
  { name: "Retrieval", value: "$0.0002" },
  { name: "LLM Tokens (4000 ctx)", value: "$0.0120" },
  { name: "Total Per Query", value: "$0.0123" },
];

export default function WhereNaiveRAGBreaks(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // U-curve SVG geometry
  const svgW = 520;
  const svgH = 220;
  const plotPadLeft = 60;
  const plotPadRight = 30;
  const plotPadTop = 30;
  const plotPadBottom = 40;
  const plotW = svgW - plotPadLeft - plotPadRight;
  const plotH = svgH - plotPadTop - plotPadBottom;
  const xFor = (pos) => plotPadLeft + ((pos - 1) / 9) * plotW;
  const yFor = (w) => plotPadTop + (1 - w) * plotH;
  const polyPoints = LOST_IN_MIDDLE_CURVE.map((p) => `${xFor(p.pos)},${yFor(p.weight)}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Naive RAG Has 7 Failure Modes
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The pipeline from 19.2 works on a happy-path query. Production traffic exposes 7 named ways it can fail.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {FAILURE_MODES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={15}>
                  {f.title}
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
                  {f.desc}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Failure 1: Bad Chunking
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Fixed-size chunking sliced a single sentence across two chunks. Neither chunk now contains both halves of
            the answer.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={14}>
              User Query
            </T>
            <T color="#ffcc80" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;How long do I have to use the password reset link?&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 1 (Mid-Sentence Split)
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...Click the link in the email...&quot;
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 (Mid-Sentence Split)
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...within 24 hours to set a new password...&quot;
              </T>
            </div>
          </div>
          <T color="#ffcc80" center size={15} style={{ marginTop: 12 }}>
            The 24-hour limit is split across two chunks. Neither contains both &quot;reset link&quot; AND &quot;24
            hours&quot; near each other.
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Retrieved Chunk
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...Click the link in the email...&quot;
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Model Output
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;I don't see a time limit in the docs.&quot;
              </T>
            </div>
          </div>
          <T color="#ef9a9a" center size={15} style={{ marginTop: 12 }}>
            Wrong. The 24-hour limit is in the doc, but bad chunking hid it.
          </T>
          <T color="#ffcc80" center size={15} style={{ marginTop: 12 }}>
            Chapters 20.4-20.10 (chunking strategies) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Failure 2: Low Recall
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Embedding-only retrieval is supposed to handle synonyms. In practice, &quot;sign in&quot; and &quot;log
            in&quot; don't always cluster tightly enough, and the right doc gets missed.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              User Query
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;I can't sign in to my account&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Expected Match
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Doc: &quot;Login Troubleshooting&quot;
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;If you can't log in, check your password. Logging in requires a verified email...&quot;
              </T>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${C.red}20`,
                  color: C.red,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                MISSED FROM TOP-3
              </div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Top-3 Retrieved (Embedding-Only)
              </T>
              {SIGNIN_RETRIEVED.map((line) => (
                <T key={line} color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {line}
                </T>
              ))}
            </div>
          </div>
          <T color="#ffe082" center size={15} style={{ marginTop: 12 }}>
            Embedding-only retrieval scores docs by vector similarity. &quot;Log in&quot; vs &quot;sign in&quot; don't
            cluster tightly enough. The right doc is missed entirely from top-3.
          </T>
          <T color="#ffe082" center size={15} style={{ marginTop: 12 }}>
            Chapters 21.3-21.4 (hybrid retrieval + rerankers) and 21.5-21.8 (query transformation) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Failure 3: Lost In The Middle
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Even when the answer is in the retrieved context, long-context models attend more to the start and end than
            to the middle. A chunk buried at position 5 of 10 can be ignored entirely.
          </T>
          <T color={C.green} bold center size={16} style={{ marginTop: 14 }}>
            Lost-In-The-Middle Attention Curve
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                U-shaped attention curve plotting attention weight against chunk position 1-10. High attention at start
                (positions 1-2) and end (positions 9-10), dipping in the middle (positions 4-7). Position 5 is
                highlighted as the relevant chunk that gets missed.
              </desc>
              {/* Axes */}
              <line
                x1={plotPadLeft}
                y1={plotPadTop + plotH}
                x2={plotPadLeft + plotW}
                y2={plotPadTop + plotH}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
              <line
                x1={plotPadLeft}
                y1={plotPadTop}
                x2={plotPadLeft}
                y2={plotPadTop + plotH}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
              {/* Y-axis ticks */}
              {[0, 0.5, 1].map((v) => (
                <g key={`y-${v}`}>
                  <line
                    x1={plotPadLeft - 4}
                    y1={yFor(v)}
                    x2={plotPadLeft}
                    y2={yFor(v)}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <text x={plotPadLeft - 8} y={yFor(v) + 4} textAnchor="end" fill="#a5d6a7" fontSize="11">
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}
              {/* X-axis ticks */}
              {LOST_IN_MIDDLE_CURVE.map((p) => (
                <g key={`x-${p.pos}`}>
                  <line
                    x1={xFor(p.pos)}
                    y1={plotPadTop + plotH}
                    x2={xFor(p.pos)}
                    y2={plotPadTop + plotH + 4}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <text x={xFor(p.pos)} y={plotPadTop + plotH + 18} textAnchor="middle" fill="#a5d6a7" fontSize="11">
                    {p.pos}
                  </text>
                </g>
              ))}
              {/* Axis labels */}
              <text
                x={plotPadLeft + plotW / 2}
                y={svgH - 6}
                textAnchor="middle"
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="bold"
              >
                Chunk Position
              </text>
              <text
                x={16}
                y={plotPadTop + plotH / 2}
                textAnchor="middle"
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="bold"
                transform={`rotate(-90 16 ${plotPadTop + plotH / 2})`}
              >
                Attention Weight
              </text>
              {/* U-curve line */}
              <polyline points={polyPoints} fill="none" stroke={C.green} strokeWidth="2" />
              {/* Dots */}
              {LOST_IN_MIDDLE_CURVE.map((p) => {
                const isRelevant = p.pos === 5;
                return (
                  <circle
                    key={`dot-${p.pos}`}
                    cx={xFor(p.pos)}
                    cy={yFor(p.weight)}
                    r={isRelevant ? 6 : 3.5}
                    fill={isRelevant ? C.red : C.green}
                    stroke={isRelevant ? C.red : "none"}
                    strokeWidth={isRelevant ? 1.5 : 0}
                  />
                );
              })}
              {/* Label for position 5 */}
              <text x={xFor(5)} y={yFor(0.18) + 22} textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Position 5 (Relevant)
              </text>
              <text x={xFor(5)} y={yFor(0.18) + 36} textAnchor="middle" fill="#ef9a9a" fontSize="11">
                Missed
              </text>
            </svg>
          </div>
          <T color="#a5d6a7" center size={15} style={{ marginTop: 12 }}>
            Model attends most to the first and last chunks. Middle chunks (positions 4-7) get less attention. The
            relevant chunk at position 5 is in context, but the model skips it.
          </T>
          <T color="#a5d6a7" center size={15} style={{ marginTop: 12 }}>
            Chapters 22.1-22.3 (context packing + lost-in-middle remedies) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Failure 4: No Citation
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The model answered, but the answer has no source markers. Reviewers can't tell which chunk the answer came
            from, or whether any chunk supports it at all.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              User Query
            </T>
            <T color="#80deea" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;Why is my account suspended?&quot;
            </T>
          </div>
          <T color={C.red} bold center size={16} style={{ marginTop: 14 }}>
            Generated Answer (No Citation)
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontStyle: "italic" }}>
              &quot;Your account may be suspended due to payment failures, terms of service violations, or unusual
              activity. Contact support for details.&quot;
            </T>
            <T color={C.red} center size={13} style={{ marginTop: 8, fontWeight: 700 }}>
              No [doc-X] markers anywhere.
            </T>
          </div>
          <T color="#80deea" center size={15} style={{ marginTop: 12 }}>
            Reviewer cannot verify which doc the answer came from. Without a citation, if the model hallucinated half of
            it, no one can tell.
          </T>
          <T color="#80deea" center size={15} style={{ marginTop: 12 }}>
            Chapters 22.1-22.3 (citations + groundedness) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Failure 5: Hallucination On Partial Info
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Retrieved context covers SSO for Enterprise plan but says nothing about Pro plan. The model fills the gap
            with a confident-sounding guess.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={14}>
              User Query
            </T>
            <T color="#b8a9ff" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;Does the Pro plan include SSO?&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Retrieved Context (Top-3 Chunks)
              </T>
              {SSO_CONTEXT_CHUNKS.map((line) => (
                <T key={line} color="#b8a9ff" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {line}
                </T>
              ))}
              <T color={C.purple} center size={13} style={{ marginTop: 10, fontWeight: 700 }}>
                Note: No mention of Pro + SSO anywhere.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Model Output (Hallucinated)
              </T>
              <T color="#ef9a9a" center bold size={15} style={{ marginTop: 8 }}>
                &quot;Yes, the Pro plan includes SSO.&quot;
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                This claim is wrong. SSO is Enterprise-only. Model filled in a gap with a plausible-sounding guess.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" center size={15} style={{ marginTop: 12 }}>
            Chapters 22.1-22.3 (refusal + groundedness instruction) and 23.1-23.5 (faithfulness eval) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Failures 6 & 7: Stale Index, Cost, Latency
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            The last two failures aren't about answer quality - they're about operations. The index goes stale, and
            every query costs real money.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}12`,
                textAlign: "center",
              }}
            >
              <T color={C.pink} bold center size={16}>
                Failure 6: Stale Index
              </T>
              <T color="#f8bbd0" center size={14} style={{ marginTop: 8 }}>
                Doc-7 (Refund Policy) was updated 2 days ago. Sales now allows refunds within 30 days. The embedding
                index still has the old version (14 days).
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.pink}12`,
                  border: `1px solid ${C.pink}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={13}>
                  User Query
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                  &quot;What's our current refund window?&quot;
                </T>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Answer Returned (Stale)
                </T>
                <T color="#ef9a9a" center size={14} style={{ marginTop: 4, fontStyle: "italic" }}>
                  &quot;14 days.&quot;
                </T>
              </div>
              <T color="#f8bbd0" center size={13} style={{ marginTop: 10 }}>
                Embedding lifecycle - covered in Section 17.8 - and chapters 23.6-23.10 (drift detection) fix this.
              </T>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}12`,
                textAlign: "center",
              }}
            >
              <T color={C.pink} bold center size={16}>
                Failure 7: Cost & Latency
              </T>
              <T color="#f8bbd0" center size={14} style={{ marginTop: 8 }}>
                Per-query cost breakdown:
              </T>
              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr",
                  gap: 6,
                }}
              >
                {COST_ROWS.map((r) => {
                  const isTotal = r.name === "Total Per Query";
                  return (
                    <div key={r.name} style={{ display: "contents" }}>
                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: isTotal ? `${C.pink}18` : `${C.pink}06`,
                          border: `1px solid ${C.pink}${isTotal ? "30" : "12"}`,
                          textAlign: "left",
                        }}
                      >
                        <T color={C.pink} bold={isTotal} size={13}>
                          {r.name}
                        </T>
                      </div>
                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: isTotal ? `${C.pink}18` : "rgba(0,0,0,0.3)",
                          border: `1px solid ${C.pink}${isTotal ? "30" : "12"}`,
                          textAlign: "center",
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: 13,
                          color: "#f8bbd0",
                          fontWeight: isTotal ? 700 : 400,
                        }}
                      >
                        {r.value}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.pink}12`,
                  border: `1px solid ${C.pink}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={13}>
                  Latency
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 4 }}>
                  50ms retrieval + 800ms generation = 850ms p50
                </T>
              </div>
              <T color={C.pink} center bold size={14} style={{ marginTop: 10 }}>
                At 1000 QPS, costs $12,300/day.
              </T>
              <T color="#f8bbd0" center size={13} style={{ marginTop: 10 }}>
                Chapters 23.6-23.10 (caching, cost models, observability) fix this.
              </T>
            </div>
          </div>
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
