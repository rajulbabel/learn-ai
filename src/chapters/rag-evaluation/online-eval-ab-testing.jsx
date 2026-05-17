import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const OE_OFFLINE_VS_ONLINE = [
  {
    name: "Offline Eval",
    color: C.purple,
    accent: "#b8a9ff",
    points: [
      { good: true, body: "Controlled, reproducible across runs." },
      { good: true, body: "Fast iteration; same golden set every time." },
      { good: false, body: "Does not reflect production query distribution." },
      { good: false, body: "Misses rare-but-bad cases users actually hit." },
    ],
  },
  {
    name: "Online Eval",
    color: C.green,
    accent: "#a5d6a7",
    points: [
      { good: true, body: "Real query distribution from real users." },
      { good: true, body: "Catches edge cases offline never sees." },
      { good: false, body: "Noisy signal; needs aggregation over many sessions." },
      { good: false, body: "Privacy concerns when storing user feedback." },
    ],
  },
];

const OE_IMPLICIT_SIGNALS = [
  {
    name: "Thumbs Up / Down",
    desc: "Explicit-Light. Most users do not click.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    name: "Dwell Time",
    desc: "Long Dwell = Read Carefully. Very Short = Likely Irrelevant.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Copy-Paste Rate",
    desc: "User Copied The Answer = Useful Enough To Reuse.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    name: "Follow-Up Rephrase",
    desc: "User Re-Asks Same Intent With Different Words = Previous Answer Failed.",
    color: C.red,
    accent: "#ef9a9a",
  },
];

const OE_EXPLICIT_CARDS = [
  {
    name: "Rating Widget",
    body: "Post-answer thumbs / star rating / Did-This-Help Yes/No.",
    note: "Capture rate: 2-8% of sessions.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Free-Text Feedback",
    body: '"Tell us what went wrong." Higher signal, much lower volume.',
    note: "Single best source of qualitative failure modes.",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

const OE_AB_STEPS = [
  { n: 1, label: "Bucket Users 50/50 (Control / Treatment)" },
  { n: 2, label: "Sample 200 Queries Per Day Per Bucket" },
  { n: 3, label: "Run LLM-Judge Rubric On Every Sampled (Query, Answer)" },
  { n: 4, label: "Compute Mean Rubric Score Per Bucket; Check Significance" },
];

const OE_LOOP_NODES = [
  {
    n: 1,
    label: "Online Finds A Regression",
    detail: "Thumbs-down spike on a query type.",
    color: C.pink,
    accent: "#f48fb1",
  },
  {
    n: 2,
    label: "Capture To Golden Regression Set",
    detail: "Tie the failing case into chapter 12.34.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    n: 3,
    label: "Offline Reproduces; Iterate Fix",
    detail: "RAGAS + judge re-score the offending case until green.",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    n: 4,
    label: "Shadow + A/B Verify Fix In Production",
    detail: "Promote only after both confirm no regression.",
    color: C.orange,
    accent: "#ffcc80",
  },
];

export default function OnlineEvalABTesting(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Shadow eval pipeline SVG layout.
  const SH_VB_W = 540;
  const SH_VB_H = 220;
  const SH_NODE_W = 130;
  const SH_NODE_H = 50;
  const SH_LEFT_X = 20;
  const SH_RIGHT_X = SH_VB_W - SH_LEFT_X - SH_NODE_W;
  const SH_MID_X = (SH_VB_W - SH_NODE_W) / 2;
  const SH_QUERY_Y = 14;
  const SH_PIPE_Y = 86;
  const SH_JUDGE_Y = 156;

  // Closing loop SVG layout.
  const LP_VB_W = 540;
  const LP_VB_H = 320;
  const LP_NODE_W = 180;
  const LP_NODE_H = 60;
  const LP_POSITIONS = [
    { x: (LP_VB_W - LP_NODE_W) / 2, y: 14 }, // top
    { x: LP_VB_W - LP_NODE_W - 20, y: 130 }, // right
    { x: (LP_VB_W - LP_NODE_W) / 2, y: 246 }, // bottom
    { x: 20, y: 130 }, // left
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── Offline vs online */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Why Online Eval In Addition To Offline
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            Offline eval gates merges. Online eval detects regressions production users will hit but the golden set
            cannot anticipate. You need both.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {OE_OFFLINE_VS_ONLINE.map((col) => (
              <div
                key={col.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${col.color}06`,
                  border: `1px solid ${col.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={col.color} bold center size={16}>
                  {col.name}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {col.points.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "20px 1fr",
                        gap: 8,
                        padding: 6,
                        borderRadius: 4,
                        background: p.good ? `${C.green}10` : `${C.red}10`,
                        textAlign: "left",
                      }}
                    >
                      <T color={p.good ? C.green : C.red} bold size={14} center>
                        {p.good ? "+" : "-"}
                      </T>
                      <T color={col.accent} size={13}>
                        {p.body}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}30`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold center size={14}>
              Use Both
            </T>
            <T color="#f48fb1" center size={13} style={{ marginTop: 4 }}>
              Offline gates merges before deploy. Online catches regressions after deploy and feeds them back into the
              golden regression set.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Implicit signals */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Implicit Signals: What Users Tell You Without Clicking Anything
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Implicit signals are behavioral traces from session telemetry. Each is individually noisy; combining three
            or more makes a reliable quality regression detector.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {OE_IMPLICIT_SIGNALS.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.color} bold center size={15}>
                  {s.name}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  {s.desc}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}30`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              Combine 3+ Signals; Calibrate Against Explicit Feedback
            </T>
            <T color="#80deea" center size={13} style={{ marginTop: 4 }}>
              Any single signal is too noisy alone. A composite quality score over 3+ implicit signals tracks user
              satisfaction reliably.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Explicit feedback + privacy */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Explicit Feedback: Ask Directly
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Explicit feedback (a rating widget or a free-text "what went wrong?" prompt) is the highest signal per
            sample - and the lowest volume. Use it for diagnosis, not for primary quality measurement alone.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {OE_EXPLICIT_CARDS.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${c.color}06`,
                  border: `1px solid ${c.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={c.color} bold center size={15}>
                  {c.name}
                </T>
                <T color={c.accent} center size={13} style={{ marginTop: 8 }}>
                  {c.body}
                </T>
                <T color={c.accent} center size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {c.note}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}30`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              Privacy: Redact PII Before Storage
            </T>
            <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
              Store feedback with conversation context, but redact PII (names, emails, account numbers) before
              retention. Follow regional privacy law: GDPR, CCPA. Document retention period.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Shadow eval */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Shadow Eval: Run New Pipeline Alongside Old
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Shadow eval runs a new candidate pipeline alongside the production one without serving its answers. The
            judge compares both on real production traffic, giving an apples-to-apples signal at zero user risk.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${SH_VB_W} ${SH_VB_H}`} width="100%" style={{ maxWidth: 540, height: "auto" }}>
              <desc>
                Shadow-eval pipeline diagram. A user query splits into an old pipeline whose answer is served and a new
                pipeline whose answer is logged but not served. Both answers feed into an LLM-judge that scores them,
                producing an aggregate comparison without exposing users to the candidate pipeline.
              </desc>

              {/* Query node (top center) */}
              <rect
                x={SH_MID_X}
                y={SH_QUERY_Y}
                width={SH_NODE_W}
                height={SH_NODE_H}
                rx={8}
                fill={`${C.cyan}1f`}
                stroke={`${C.cyan}aa`}
                strokeWidth="1.5"
              />
              <text
                x={SH_MID_X + SH_NODE_W / 2}
                y={SH_QUERY_Y + SH_NODE_H / 2 + 4}
                fill="#80deea"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>

              {/* Old pipeline node (left middle, served) */}
              <rect
                x={SH_LEFT_X}
                y={SH_PIPE_Y}
                width={SH_NODE_W}
                height={SH_NODE_H}
                rx={8}
                fill={`${C.green}1f`}
                stroke={`${C.green}aa`}
                strokeWidth="1.5"
              />
              <text
                x={SH_LEFT_X + SH_NODE_W / 2}
                y={SH_PIPE_Y + SH_NODE_H / 2 - 2}
                fill="#a5d6a7"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Old Pipeline
              </text>
              <text
                x={SH_LEFT_X + SH_NODE_W / 2}
                y={SH_PIPE_Y + SH_NODE_H / 2 + 14}
                fill="#a5d6a7"
                fontSize="11"
                textAnchor="middle"
              >
                (Served To User)
              </text>

              {/* New pipeline node (right middle, logged only) */}
              <rect
                x={SH_RIGHT_X}
                y={SH_PIPE_Y}
                width={SH_NODE_W}
                height={SH_NODE_H}
                rx={8}
                fill={`${C.orange}1f`}
                stroke={`${C.orange}aa`}
                strokeWidth="1.5"
              />
              <text
                x={SH_RIGHT_X + SH_NODE_W / 2}
                y={SH_PIPE_Y + SH_NODE_H / 2 - 2}
                fill="#ffcc80"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                New Pipeline
              </text>
              <text
                x={SH_RIGHT_X + SH_NODE_W / 2}
                y={SH_PIPE_Y + SH_NODE_H / 2 + 14}
                fill="#ffcc80"
                fontSize="11"
                textAnchor="middle"
              >
                (Logged, Not Served)
              </text>

              {/* Judge node (bottom center) */}
              <rect
                x={SH_MID_X}
                y={SH_JUDGE_Y}
                width={SH_NODE_W}
                height={SH_NODE_H}
                rx={8}
                fill={`${C.purple}1f`}
                stroke={`${C.purple}aa`}
                strokeWidth="1.5"
              />
              <text
                x={SH_MID_X + SH_NODE_W / 2}
                y={SH_JUDGE_Y + SH_NODE_H / 2 + 4}
                fill="#b8a9ff"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                LLM-Judge Rubric
              </text>

              {/* Connections: query -> old & new */}
              <line
                x1={SH_MID_X + SH_NODE_W / 2}
                y1={SH_QUERY_Y + SH_NODE_H}
                x2={SH_LEFT_X + SH_NODE_W / 2}
                y2={SH_PIPE_Y}
                stroke={`${C.cyan}aa`}
                strokeWidth="1.5"
              />
              <line
                x1={SH_MID_X + SH_NODE_W / 2}
                y1={SH_QUERY_Y + SH_NODE_H}
                x2={SH_RIGHT_X + SH_NODE_W / 2}
                y2={SH_PIPE_Y}
                stroke={`${C.cyan}aa`}
                strokeWidth="1.5"
              />
              {/* Connections: old & new -> judge */}
              <line
                x1={SH_LEFT_X + SH_NODE_W / 2}
                y1={SH_PIPE_Y + SH_NODE_H}
                x2={SH_MID_X + SH_NODE_W / 2}
                y2={SH_JUDGE_Y}
                stroke={`${C.purple}aa`}
                strokeWidth="1.5"
              />
              <line
                x1={SH_RIGHT_X + SH_NODE_W / 2}
                y1={SH_PIPE_Y + SH_NODE_H}
                x2={SH_MID_X + SH_NODE_W / 2}
                y2={SH_JUDGE_Y}
                stroke={`${C.purple}aa`}
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}30`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={14}>
              Shadow Eval Week 1 Result
            </T>
            <T color="#b8a9ff" center size={13} style={{ marginTop: 4 }}>
              Judge prefers new in 62% of cases, ties in 23%, regresses in 15%. Production traffic provides the
              comparison; users never see the candidate answer. This is the signal that graduates the new pipeline to
              A/B.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── A/B with rubric judging */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            A/B: Split Traffic, Measure With Rubric
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Once shadow looks good, ship A/B. Split production users 50/50; sample answers from each bucket; score with
            the same judge rubric. Mean rubric score per bucket plus a significance test decides which wins.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {OE_AB_STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={24}>
                  {s.n}
                </T>
                <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                  {s.label}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Statistical Significance
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                At N=200/day per bucket and effect size 0.1 on a 1-5 scale, expect 7-14 days to reach p &lt; 0.05. Do
                not peek; pre-register the analysis window.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Guardrails & Auto-Rollback
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
                Monitor faithfulness drop and refusal-rate spike at high frequency. Auto-rollback when any guardrail
                breaches threshold; don't wait for the analysis window.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Closing the loop */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Closing The Loop: Online -&gt; Offline -&gt; Online
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Production-grade RAG eval is a feedback cycle. Online detects regressions; offline reproduces and fixes
            them; shadow plus A/B verify the fix; the cycle loops. The offline tools (RAGAS, judge, golden) and the
            online tools (implicit, explicit, shadow, A/B) are two halves of one system.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LP_VB_W} ${LP_VB_H}`} width="100%" style={{ maxWidth: 540, height: "auto" }}>
              <desc>
                Closing-the-loop cycle diagram with four nodes connected by arrows: online finds a regression, capture
                failing cases into the golden regression set, offline reproduces and fixes, shadow plus A/B verify in
                production. The cycle returns to online detection, illustrating the offline-online feedback loop that
                production-grade RAG eval relies on.
              </desc>

              {OE_LOOP_NODES.map((n, i) => {
                const pos = LP_POSITIONS[i];
                return (
                  <g key={i}>
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={LP_NODE_W}
                      height={LP_NODE_H}
                      rx={10}
                      fill={`${n.color}1f`}
                      stroke={`${n.color}aa`}
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x + LP_NODE_W / 2}
                      y={pos.y + 22}
                      fill={n.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {n.n}. {n.label}
                    </text>
                    <text x={pos.x + LP_NODE_W / 2} y={pos.y + 42} fill={n.accent} fontSize="11" textAnchor="middle">
                      {n.detail}
                    </text>
                  </g>
                );
              })}

              {/* Arrows from each node to the next (clockwise: top -> right -> bottom -> left -> top) */}
              {OE_LOOP_NODES.map((n, i) => {
                const a = LP_POSITIONS[i];
                const b = LP_POSITIONS[(i + 1) % LP_POSITIONS.length];
                // Compute connector endpoints near the box edges.
                const cx1 = a.x + LP_NODE_W / 2;
                const cy1 = a.y + LP_NODE_H / 2;
                const cx2 = b.x + LP_NODE_W / 2;
                const cy2 = b.y + LP_NODE_H / 2;
                // Shorten the line so it does not cross the node bodies.
                const dx = cx2 - cx1;
                const dy = cy2 - cy1;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len;
                const uy = dy / len;
                const margin = 70;
                const x1 = cx1 + ux * margin;
                const y1 = cy1 + uy * margin;
                const x2 = cx2 - ux * margin;
                const y2 = cy2 - uy * margin;
                return (
                  <g key={`arrow-${i}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${C.red}aa`} strokeWidth="1.5" />
                    <polygon
                      points={`${x2},${y2} ${x2 - ux * 8 - uy * 4},${y2 - uy * 8 + ux * 4} ${x2 - ux * 8 + uy * 4},${y2 - uy * 8 - ux * 4}`}
                      fill={`${C.red}aa`}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={14}>
              Two Halves, One System
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
              Offline gives reproducibility; online gives reality. The loop turns every production regression into a
              future regression-set entry, so the same bug cannot ship twice.
            </T>
          </div>
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
