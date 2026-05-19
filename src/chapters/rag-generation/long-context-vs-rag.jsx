import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const LCR_METRICS = [
  {
    name: "Cost (Per Query)",
    unit: "$",
    bars: [
      { label: "RAG-Only", value: 0.008, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 0.15, color: C.yellow, accent: "#ffe082" },
      { label: "Long-Context-Only", value: 0.36, color: C.red, accent: "#ef9a9a" },
    ],
    max: 0.4,
    fmt: (v) => `$${v.toFixed(3)}`,
  },
  {
    name: "Latency P50 (Seconds)",
    unit: "s",
    bars: [
      { label: "RAG-Only", value: 1.5, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 3.0, color: C.yellow, accent: "#ffe082" },
      { label: "Long-Context-Only", value: 6.0, color: C.red, accent: "#ef9a9a" },
    ],
    max: 7.0,
    fmt: (v) => `${v.toFixed(1)}s`,
  },
  {
    name: "Accuracy (Golden Recall)",
    unit: "%",
    bars: [
      { label: "RAG-Only", value: 78, color: C.green, accent: "#a5d6a7" },
      { label: "Hybrid", value: 92, color: C.green, accent: "#a5d6a7" },
      { label: "Long-Context-Only", value: 84, color: C.yellow, accent: "#ffe082" },
    ],
    max: 100,
    fmt: (v) => `${v}%`,
  },
];

const LCR_DECISION_CARDS = [
  {
    title: "RAG Only",
    color: C.green,
    accent: "#a5d6a7",
    bullets: [
      "Cost-critical at scale (~$0.008/query)",
      "Latency-critical (~1.5s p50)",
      "Large multi-doc corpus",
      "Citations required (chunk-level provenance)",
    ],
  },
  {
    title: "Hybrid",
    color: C.yellow,
    accent: "#ffe082",
    bullets: [
      "Default for production",
      "Best accuracy on accuracy-critical workloads",
      "Acceptable cost + latency tradeoff",
      "Citations still feasible",
    ],
  },
  {
    title: "Long-Context Only",
    color: C.red,
    accent: "#ef9a9a",
    bullets: [
      "Single long document corpus",
      "Low query volume (cost not pressing)",
      "Citations not required (or post-extracted)",
      "No retrieval infrastructure available",
    ],
  },
];

export default function LongContextVsRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Sub=4 bar chart geometry.
  const CHART_VB_W = 800;
  const CHART_VB_H = 480;
  const CHART_PAD_L = 60;
  const CHART_PAD_R = 30;
  const CHART_PAD_T = 30;
  const CHART_PAD_B = 60;
  const GROUP_GAP = 36;
  const BAR_W = 56;
  const BARS_PER_GROUP = 3;
  const GROUP_W = BARS_PER_GROUP * BAR_W + (BARS_PER_GROUP - 1) * 8;
  const GROUPS = LCR_METRICS.length;
  const TOTAL_BARS_W = GROUPS * GROUP_W + (GROUPS - 1) * GROUP_GAP;
  const CHART_PLOT_W = CHART_VB_W - CHART_PAD_L - CHART_PAD_R;
  const CHART_PLOT_H = CHART_VB_H - CHART_PAD_T - CHART_PAD_B;
  const X_START = CHART_PAD_L + (CHART_PLOT_W - TOTAL_BARS_W) / 2;
  const BAR_BOTTOM = CHART_PAD_T + CHART_PLOT_H;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Corpus switch */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            This Chapter Uses A 200-Page Product Manual
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The customer-support corpus has 30 small docs that retrieval handles cleanly. To compare retrieval against
            "just stuff it in the prompt", this chapter switches to a single 200-page product manual that fits in a
            modern context window.
          </T>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={15}>
                Customer Support Corpus - 30 Small Docs
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 8 }}>
                30 docs at 500-2000 tokens each. Total ~50k tokens. Already fits in modern context windows BUT
                distributed across 30 distinct docs - retrieval is the natural pattern.
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={15}>
                200-Page Product Manual - 1 Large Doc
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                A single 200-page reference, ~120k tokens. Fits in a 200k context window. The "do I even need RAG?" test
                case for the secondary corpus.
              </T>
            </div>
          </div>

          <T color="#90caf9" center size={14} style={{ marginTop: 12 }}>
            When the entire knowledge base is one long document and fits in the context window, the retrieval question
            changes shape.
          </T>
        </Box>
      )}

      {/* ─── sub=1 ─── Long-context only */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Long-Context Only: Stuff Everything In
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Pack ALL 120k tokens of the manual into the prompt. The LLM reads everything and answers. Simple. Expensive.
            Slow. And subject to lost-in-the-middle (chapter 22.2) for facts buried in the middle pages.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              User Query -&gt; Pack ALL 120k Tokens -&gt; LLM Reads -&gt; Answer
            </T>
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
                Cost
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                At $3 per 1M input tokens, this is $0.36 per query.
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
                Latency
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                120k tokens to read -&gt; 5-8 seconds first-token latency.
              </T>
            </div>
          </div>

          <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
            Simple. Expensive. Slow. And subject to lost-in-the-middle for facts buried mid-document.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── RAG only */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            RAG Only: Chunk, Retrieve, Pack Small
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Chunk the 200-page manual into 240 chunks of 512 tokens. At query time, embed the query, retrieve top-5
            (2,560 tokens), pack into prompt. Massively cheaper. Massively faster. Risk: if the relevant chunk isn't in
            top-5, you get the wrong answer.
          </T>

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
            <T color="#a5d6a7" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Chunk Manual Into 240 Chunks -&gt; Retrieve Top-5 -&gt; Pack ~2,560 Tokens -&gt; LLM Reads -&gt; Answer
            </T>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
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
                Cost
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                ~$0.008 per query - ~45x cheaper than long-context-only.
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
                Latency
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                50ms retrieval + 1-2s generation = ~1.5s.
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
                Risk
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                If relevant chunk missed by top-5, the answer is wrong.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Hybrid */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Hybrid: Retrieve Top-30, Pack 50k Tokens
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The pragmatic middle. Retrieve top-30 chunks (15,000 tokens), optionally rerank, then pack 50k tokens into
            the prompt. Reorder using lost-in-middle strategies (front-load or sandwich, from chapter 22.2). Cost and
            latency sit between the extremes; accuracy is highest because more candidate chunks lowers miss rate.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
              Retrieve Top-30 -&gt; Optional Rerank -&gt; Pack 50k Tokens -&gt; Front-Load Or Sandwich -&gt; LLM -&gt;
              Answer
            </T>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}30`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Cost
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                ~$0.15 per query (5x cheaper than long-context-only).
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}30`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Latency
              </T>
              <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
                80ms retrieval + 3s generation = ~3s.
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
                Accuracy
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Highest. More candidates = lower miss rate.
              </T>
            </div>
          </div>

          <T color="#b8a9ff" center size={14} style={{ marginTop: 12 }}>
            The pragmatic middle. Most production systems land here.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Cost / latency / accuracy chart */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Cost, Latency, Accuracy: Side By Side
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Three metrics, three strategies. Each bar group shows RAG-only (green), Hybrid (yellow), and
            Long-Context-Only (red) side by side. Hybrid wins on accuracy; RAG-only wins on cost and latency.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${CHART_VB_W} ${CHART_VB_H}`} width="100%" style={{ maxWidth: 800, height: "auto" }}>
              <desc>
                Grouped bar chart comparing cost, latency, and accuracy across three strategies for the 200-page product
                manual: RAG-only, hybrid retrieve-broadly, and long-context-only stuffing of the full document.
              </desc>

              {/* Baseline */}
              <line
                x1={CHART_PAD_L}
                y1={BAR_BOTTOM}
                x2={CHART_VB_W - CHART_PAD_R}
                y2={BAR_BOTTOM}
                stroke="#ffcc80"
                strokeOpacity="0.5"
              />

              {LCR_METRICS.map((metric, gi) => {
                const groupX = X_START + gi * (GROUP_W + GROUP_GAP);
                return (
                  <g key={metric.name}>
                    {/* Group label */}
                    <text
                      x={groupX + GROUP_W / 2}
                      y={BAR_BOTTOM + 24}
                      fill="#ffcc80"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {metric.name}
                    </text>
                    {metric.bars.map((bar, bi) => {
                      const x = groupX + bi * (BAR_W + 8);
                      const h = (bar.value / metric.max) * CHART_PLOT_H;
                      const y = BAR_BOTTOM - h;
                      return (
                        <g key={bar.label}>
                          <rect
                            x={x}
                            y={y}
                            width={BAR_W}
                            height={h}
                            fill={bar.color}
                            fillOpacity="0.3"
                            stroke={bar.color}
                            strokeOpacity="0.7"
                          />
                          <text
                            x={x + BAR_W / 2}
                            y={y - 6}
                            fill={bar.accent}
                            fontSize="12"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {metric.fmt(bar.value)}
                          </text>
                          <text
                            x={x + BAR_W / 2}
                            y={BAR_BOTTOM + 40}
                            fill={bar.accent}
                            fontSize="10"
                            textAnchor="middle"
                            transform={`rotate(-12 ${x + BAR_W / 2} ${BAR_BOTTOM + 40})`}
                          >
                            {bar.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          <T color="#ffcc80" center size={14} style={{ marginTop: 12 }}>
            Hybrid is the production default. Long-context-only is a niche path. RAG-only is for high-volume,
            cost-sensitive systems.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Decision */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Decision: When Each One Wins
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Three strategies, three sweet spots. Pick by which trade-off your workload cares about most. Hybrid is the
            production default; RAG-only and long-context-only are intentional choices for specific shapes.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {LCR_DECISION_CARDS.map((card) => (
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

          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Hybrid is the production default. Long-context-only is a niche. RAG-only is for high-volume cost-sensitive
            systems.
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
