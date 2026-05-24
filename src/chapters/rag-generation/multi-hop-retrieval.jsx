import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const MH_SUFFICIENCY_PROMPT = `You are an assistant deciding whether you have enough information.

Question: {query}
Retrieved so far:
{context}

Respond with EXACTLY one of:
- SUFFICIENT (you can answer the question from the retrieved text)
- INSUFFICIENT: <one short follow-up query to retrieve more>

Do not answer the question yet.`;

const MH_HOPS = [
  {
    n: 1,
    query: "How do I reset my password if I forgot my email?",
    retrieved: "doc-1 (password reset)",
    reasoning:
      "Reset requires email access. The user says they forgot email - need email recovery info before answering.",
    decision: "INSUFFICIENT",
    followUp: "How do I recover access if I forgot my email?",
  },
  {
    n: 2,
    query: "How do I recover access if I forgot my email?",
    retrieved: "doc-3 (email change / recovery)",
    reasoning: "Now both pieces are in hand: the reset flow (doc-1) and the email-recovery path (doc-3).",
    decision: "SUFFICIENT",
    followUp: null,
  },
];

const MH_WORTH_CARDS = [
  {
    title: "Worth It",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Compound questions (password reset if you forgot your email)",
      "Cross-doc reasoning (compare Pro vs Enterprise plans)",
      "Step-dependent flows (cancel subscription then refund)",
    ],
  },
  {
    title: "Not Worth It",
    color: C.red,
    accent: "#ef9a9a",
    bullets: ["Single-doc lookups", "Simple FAQ-style queries", "Cost outweighs benefit when one hop already answers"],
  },
  {
    title: "Cost Multiplier",
    color: C.orange,
    accent: "#ffcc80",
    bullets: [
      "Each hop = 1 retrieval + 1 LLM call",
      "3 hops = ~3x latency, ~3x cost vs single-hop",
      "Budget per query becomes a hard constraint",
    ],
  },
  {
    title: "Mitigations",
    color: C.cyan,
    accent: "#80deea",
    bullets: ["Cap max_hops at 3", "Cache reformulated queries", "Use a smaller model for the sufficiency check"],
  },
];

const MH_FAILURE_CARDS = [
  {
    title: "Infinite Loop",
    color: C.red,
    accent: "#ef9a9a",
    body: "Model never says SUFFICIENT. Each hop reformulates without making progress. Mitigation: hard cap on max_hops + log every reformulation.",
  },
  {
    title: "Divergence",
    color: C.orange,
    accent: "#ffcc80",
    body: 'Each reformulation drifts farther from the original intent. "How do I reset my password?" becomes "How do I configure SSO?" by hop 3. Mitigation: keep the ORIGINAL query in the reformulation prompt as an anchor.',
  },
  {
    title: "Stuck Sufficiency Judge",
    color: C.purple,
    accent: "#b8a9ff",
    body: "Model always says SUFFICIENT after hop 1 even when context is incomplete (overconfident). Mitigation: separate judge model, calibrate via a golden dataset.",
  },
];

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

export default function MultiHopRetrieval(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=2 control-loop flowchart geometry.
  const LOOP_VB_W = 720;
  const LOOP_VB_H = 460;
  const BOX_W = 220;
  const BOX_H = 64;
  const SIDE_BOX_W = 140;
  const SIDE_BOX_H = 48;
  const REFUSE_W = 300;
  const CENTER_X = LOOP_VB_W / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why one retrieval isn't always enough */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Some Queries Need More Than One Retrieval
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Single-hop retrieval works when the answer fits in one chunk. Multi-hop retrieval kicks in when the question
            depends on a chain of facts that live in different docs. The signal you need it: even a perfect retrieval
            returns only half of what is needed.
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
                Single-Hop Works
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                Query: "How do I reset my password?"
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                1 retrieval finds doc-1 (password reset).
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                Answer: "Go to Settings then Security, click Reset Password."
              </T>
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
                Multi-Hop Needed
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                Query: "How do I reset my password if I forgot my email?"
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                1 retrieval finds doc-1 (password reset) - but the question also needs doc-3 (email change / recovery).
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                One retrieval misses half. Multiple retrievals needed.
              </T>
            </div>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── 2-hop trace */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two Hops On The Running Query
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Hop 1 retrieves doc-1, reads it, realizes it needs more. The LLM reformulates the query as a follow-up
            request and Hop 2 fires. After Hop 2 both pieces are in hand and the final answer combines them with
            citations.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {MH_HOPS.map((hop) => (
              <div
                key={hop.n}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  Hop {hop.n}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
                  Query: "{hop.query}"
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Retrieved: {hop.retrieved}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Reasoning: {hop.reasoning}
                </T>
                <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                  Decision: <span style={{ color: C.cyan, fontWeight: 700 }}>{hop.decision}</span>
                  {hop.followUp ? ` -> Reformulate as: "${hop.followUp}"` : ""}
                </T>
              </div>
            ))}
          </div>

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Final answer combines doc-1 + doc-3 with citations. Each hop reformulates the query to fetch the missing
            piece.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Control loop flowchart */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Multi-Hop Control Loop
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Loop structure: retrieve, check sufficiency, generate or reformulate. A hard cap on max_hops prevents
            infinite loops. If the cap is hit without sufficiency, the system refuses.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOOP_VB_W} ${LOOP_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Multi-hop retrieval control-loop flowchart: retrieve, check sufficiency, either generate the answer or
                reformulate the query and loop again until max_hops is reached.
              </desc>

              {/* Start: User Query */}
              <rect
                x={CENTER_X - BOX_W / 2}
                y={20}
                width={BOX_W}
                height={BOX_H}
                rx="8"
                fill={C.purple}
                fillOpacity="0.2"
                stroke={C.purple}
                strokeOpacity="0.7"
              />
              <text
                x={CENTER_X}
                y={20 + BOX_H / 2 + 5}
                fill="#b8a9ff"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>

              {/* Box: Retrieve top-k */}
              <line
                x1={CENTER_X}
                y1={20 + BOX_H}
                x2={CENTER_X}
                y2={100}
                stroke="#b8a9ff"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow)"
              />
              <rect
                x={CENTER_X - BOX_W / 2}
                y={100}
                width={BOX_W}
                height={BOX_H}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.2"
                stroke={C.cyan}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X} y={126} fill="#80deea" fontSize="14" fontWeight="700" textAnchor="middle">
                Retrieve Top-K
              </text>
              <text x={CENTER_X} y={150} fill="#80deea" fontSize="14" fontWeight="700" textAnchor="middle">
                For Current Query
              </text>

              {/* Diamond: Sufficient? */}
              <line
                x1={CENTER_X}
                y1={100 + BOX_H}
                x2={CENTER_X}
                y2={184}
                stroke="#b8a9ff"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow)"
              />
              <polygon
                points={`${CENTER_X},184 ${CENTER_X + 100},244 ${CENTER_X},304 ${CENTER_X - 100},244`}
                fill={C.yellow}
                fillOpacity="0.2"
                stroke={C.yellow}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X} y={240} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Does Context
              </text>
              <text x={CENTER_X} y={258} fill="#ffe082" fontSize="13" fontWeight="700" textAnchor="middle">
                Answer The Question?
              </text>

              {/* YES branch -> Generate answer */}
              <line
                x1={CENTER_X + 100}
                y1={244}
                x2={CENTER_X + 220}
                y2={244}
                stroke={C.green}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-green)"
              />
              <text x={CENTER_X + 160} y={234} fill="#a5d6a7" fontSize="12" fontWeight="700" textAnchor="middle">
                YES
              </text>
              <rect
                x={CENTER_X + 220}
                y={244 - SIDE_BOX_H / 2}
                width={SIDE_BOX_W}
                height={SIDE_BOX_H}
                rx="8"
                fill={C.green}
                fillOpacity="0.2"
                stroke={C.green}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X + 290} y={244 + 5} fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                Generate Answer
              </text>

              {/* NO + hops < max -> Reformulate -> loop back to Retrieve */}
              <line
                x1={CENTER_X - 100}
                y1={244}
                x2={CENTER_X - 220}
                y2={244}
                stroke={C.orange}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-orange)"
              />
              <text x={CENTER_X - 160} y={222} fill="#ffcc80" fontSize="12" fontWeight="700" textAnchor="middle">
                NO
              </text>
              <text x={CENTER_X - 160} y={236} fill="#ffcc80" fontSize="11" fontWeight="700" textAnchor="middle">
                Hops &lt; max_hops
              </text>
              <rect
                x={CENTER_X - 360}
                y={244 - SIDE_BOX_H / 2}
                width={SIDE_BOX_W}
                height={SIDE_BOX_H}
                rx="8"
                fill={C.orange}
                fillOpacity="0.2"
                stroke={C.orange}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X - 290} y={244 + 5} fill="#ffcc80" fontSize="13" fontWeight="700" textAnchor="middle">
                Reformulate Query
              </text>
              {/* Loop back arrow */}
              <path
                d={`M ${CENTER_X - 290} ${244 - SIDE_BOX_H / 2} L ${CENTER_X - 290} 132 L ${CENTER_X - BOX_W / 2} 132`}
                stroke={C.orange}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#mh-arrow-orange)"
              />

              {/* NO + hops >= max -> Refuse */}
              <line
                x1={CENTER_X}
                y1={304}
                x2={CENTER_X}
                y2={378}
                stroke={C.red}
                strokeOpacity="0.7"
                strokeWidth="1.5"
                markerEnd="url(#mh-arrow-red)"
              />
              <text x={CENTER_X + 12} y={328} fill="#ef9a9a" fontSize="12" fontWeight="700" textAnchor="start">
                NO
              </text>
              <text x={CENTER_X + 12} y={344} fill="#ef9a9a" fontSize="11" fontWeight="700" textAnchor="start">
                Hops &gt;= max_hops
              </text>
              <rect
                x={CENTER_X - REFUSE_W / 2}
                y={378}
                width={REFUSE_W}
                height={BOX_H}
                rx="8"
                fill={C.red}
                fillOpacity="0.2"
                stroke={C.red}
                strokeOpacity="0.7"
              />
              <text x={CENTER_X} y={404} fill="#ef9a9a" fontSize="14" fontWeight="700" textAnchor="middle">
                Refuse:
              </text>
              <text x={CENTER_X} y={428} fill="#ef9a9a" fontSize="14" fontWeight="700" textAnchor="middle">
                "I Don't Have Enough Information"
              </text>

              {/* Arrow marker defs */}
              <defs>
                <marker
                  id="mh-arrow"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#b8a9ff" opacity="0.7" />
                </marker>
                <marker
                  id="mh-arrow-green"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green} opacity="0.8" />
                </marker>
                <marker
                  id="mh-arrow-orange"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.orange} opacity="0.8" />
                </marker>
                <marker
                  id="mh-arrow-red"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.red} opacity="0.8" />
                </marker>
              </defs>
            </svg>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            max_hops typically 3-5. Each hop adds 1 retrieval + 1 LLM call latency. Tune based on workload and budget.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Sufficiency-check prompt */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Asking The Model: Do You Have Enough?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The sufficiency check is a small structured task. The model decides whether the retrieved text answers the
            question. SUFFICIENT means "I can answer now"; INSUFFICIENT means "fetch this follow-up".
          </T>

          <div style={{ marginTop: 14 }}>
            <PromptTemplateBlock
              color={C.green}
              accent="#a5d6a7"
              title="Prompt Template - Sufficiency Check"
              template={MH_SUFFICIENCY_PROMPT}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={15}>
              Example Trace
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 8, fontFamily: "ui-monospace, monospace" }}>
              Hop 1: "INSUFFICIENT: How do I recover access if I forgot my email?"
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 4, fontFamily: "ui-monospace, monospace" }}>
              Hop 2: "SUFFICIENT"
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When to reach for multi-hop */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When To Reach For Multi-Hop
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Multi-hop is not free. Each hop multiplies latency and cost. Use it only when the query genuinely needs
            chained facts, and always with a hard cap on hops.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MH_WORTH_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {card.bullets.map((b, i) => (
                    <T key={i} color={card.accent} center size={13}>
                      {b}
                    </T>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Failure modes */}
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Failure Modes: Infinite Loops And Divergence
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Three known failure modes show up in production multi-hop systems. Each has a known mitigation that costs
            either an extra check or stricter caps.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {MH_FAILURE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={card.color} bold center size={15}>
                  {card.title}
                </T>
                <T color={card.accent} center size={13} style={{ marginTop: 8 }}>
                  {card.body}
                </T>
              </div>
            ))}
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
