import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by ContextEngineering (13.6)

const CONTEXT_BUDGET_ZONES = [
  { name: "System Prompt", tokens: 4, color: C.cyan, soft: SOFT.cyan, role: "Rules + persona. Always present." },
  { name: "Conversation History", tokens: 50, color: C.blue, soft: SOFT.blue, role: "Prior turns. Grows every turn." },
  { name: "Retrieved Docs", tokens: 69, color: C.purple, soft: SOFT.purple, role: "RAG chunks. Refilled per query." },
  { name: "User Input", tokens: 1, color: C.green, soft: SOFT.green, role: "The new question. Capped at 1k." },
  {
    name: "Reserved For Output",
    tokens: 4,
    color: C.orange,
    soft: SOFT.orange,
    role: "Headroom the model writes into.",
  },
];

const ASSEMBLY_STACK = [
  {
    layer: "System Prompt",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "Persona, rules, tone, refusal policy. Read first, anchors everything below.",
  },
  {
    layer: "Few-Shot Examples",
    color: C.blue,
    soft: SOFT.blue,
    detail: "2-5 input + output pairs that pin the format. Read before any real content.",
  },
  {
    layer: "Conversation History",
    color: C.purple,
    soft: SOFT.purple,
    detail: "Prior turns of this thread. Older turns are nearest the top of the section.",
  },
  {
    layer: "Retrieved Chunks",
    color: C.indigo,
    soft: SOFT.indigo,
    detail: "RAG hits for this query. Reranked closer-to-bottom = closer-to-query attention.",
  },
  {
    layer: "User Query",
    color: C.green,
    soft: SOFT.green,
    detail: "The thing to actually answer. Sits at the very bottom for maximum recency.",
  },
];

const BUDGET_STRATEGIES = [
  {
    name: "Cram Everything",
    color: C.red,
    soft: SOFT.red,
    verdict: "At-risk. Lost-in-middle kicks in.",
    slices: [
      { label: "System", tokens: 4, color: C.cyan, soft: SOFT.cyan },
      { label: "History (raw)", tokens: 50, color: C.blue, soft: SOFT.blue },
      { label: "Retrieved (top-20)", tokens: 70, color: C.purple, soft: SOFT.purple },
      { label: "User", tokens: 1, color: C.green, soft: SOFT.green },
      { label: "Output", tokens: 3, color: C.orange, soft: SOFT.orange },
    ],
  },
  {
    name: "Trim History",
    color: C.teal,
    soft: SOFT.teal,
    verdict: "Wins for fact-heavy tickets. Keeps room for retrieval.",
    slices: [
      { label: "System", tokens: 4, color: C.cyan, soft: SOFT.cyan },
      { label: "History (summary)", tokens: 8, color: C.blue, soft: SOFT.blue },
      { label: "Retrieved", tokens: 80, color: C.purple, soft: SOFT.purple },
      { label: "User", tokens: 1, color: C.green, soft: SOFT.green },
      { label: "Output", tokens: 35, color: C.orange, soft: SOFT.orange },
    ],
  },
  {
    name: "Trim Retrieval",
    color: C.green,
    soft: SOFT.green,
    verdict: "Wins for long multi-turn convos. Keeps room for output.",
    slices: [
      { label: "System", tokens: 4, color: C.cyan, soft: SOFT.cyan },
      { label: "History (raw)", tokens: 50, color: C.blue, soft: SOFT.blue },
      { label: "Retrieved (top-3)", tokens: 8, color: C.purple, soft: SOFT.purple },
      { label: "User", tokens: 1, color: C.green, soft: SOFT.green },
      { label: "Output", tokens: 65, color: C.orange, soft: SOFT.orange },
    ],
  },
];

const LOST_IN_MIDDLE_SAMPLES = [
  { pos: 0.0, recall: 0.93, label: "Start" },
  { pos: 0.15, recall: 0.78 },
  { pos: 0.3, recall: 0.6 },
  { pos: 0.45, recall: 0.48 },
  { pos: 0.5, recall: 0.45, label: "Middle" },
  { pos: 0.55, recall: 0.48 },
  { pos: 0.7, recall: 0.62 },
  { pos: 0.85, recall: 0.82 },
  { pos: 1.0, recall: 0.95, label: "End" },
];

const ORDERING_STRATEGIES = [
  {
    name: "Relevance-First",
    color: C.cyan,
    soft: SOFT.cyan,
    when: "Factual queries. One-shot lookups.",
    rule: "Rerank retrieved chunks by similarity. Top-3 sit closest to the user query.",
    example: "Ticket: 'What's the refund window for plan Pro?' -> top-3 RAG hits next to the query.",
  },
  {
    name: "Recency-First",
    color: C.purple,
    soft: SOFT.purple,
    when: "Multi-turn conversations. Long debugging threads.",
    rule: "Latest history at the bottom (near query) for conversational coherence.",
    example: "Ticket: 6-turn back-and-forth -> last 2 user / assistant turns sit nearest the query.",
  },
];

const EVICTION_LADDER = [
  {
    rank: 1,
    name: "Older Retrieved Chunks (Beyond Top-3)",
    color: C.red,
    soft: SOFT.red,
    rule: "Evict First",
    detail: "Rerank surfaced them but the top-3 carry the answer almost always. Drop the long tail.",
  },
  {
    rank: 2,
    name: "Mid-Conversation History (Raw Turns)",
    color: C.orange,
    soft: SOFT.orange,
    rule: "Summarize Then Evict",
    detail: "Compress the middle 5+ turns into one summary line. Keep newest 2 turns raw.",
  },
  {
    rank: 3,
    name: "Few-Shot Examples Beyond The First Two",
    color: C.yellow,
    soft: SOFT.yellow,
    rule: "Evict Soon",
    detail: "Two examples pin the format. Examples 3-5 are insurance and cost tokens.",
  },
  {
    rank: 4,
    name: "Top-3 Retrieved Chunks",
    color: C.teal,
    soft: SOFT.teal,
    rule: "Rarely Evict",
    detail: "These ARE the answer to this query. Only drop if user input is huge.",
  },
  {
    rank: 5,
    name: "Latest Assistant Response",
    color: C.blue,
    soft: SOFT.blue,
    rule: "Rarely Evict",
    detail: "Removing it loses the model's own context for what it just said.",
  },
  {
    rank: 6,
    name: "System Prompt + Last User Message",
    color: C.green,
    soft: SOFT.green,
    rule: "Never Evict",
    detail: "The rules of the game and the question itself. Evicting either breaks the call.",
  },
];

export default function ContextEngineering(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  const totalBudget = 128;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Tokens In, Tokens Out, Hard Cap
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Every model has a context window: a hard token budget the call has to live inside. A frontier model today is
            128k tokens. Every prompt is a packing problem against that ceiling.
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={SOFT.cyan} center size={13}>
              128k context window, broken into reserved zones
            </T>
            <svg
              viewBox="0 0 560 110"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Horizontal stacked bar showing how 128k tokens of context window are split across system prompt,
                conversation history, retrieved docs, user input, and reserved output. Each zone is labeled with its
                token count.
              </desc>
              {/* Outer frame for the budget bar */}
              <rect x="20" y="30" width="520" height="40" rx="6" fill="none" stroke={C.dim} strokeWidth="1.5" />
              {(() => {
                const x0 = 20;
                const width = 520;
                let acc = 0;
                return CONTEXT_BUDGET_ZONES.map((z) => {
                  const w = (z.tokens / totalBudget) * width;
                  const x = x0 + (acc / totalBudget) * width;
                  acc += z.tokens;
                  return (
                    <g key={z.name}>
                      <rect x={x} y={30} width={w} height={40} fill={`${z.color}40`} stroke={z.color} strokeWidth="1" />
                      <text x={x + w / 2} y={55} fill={z.soft} fontSize="11" textAnchor="middle" fontWeight="700">
                        {z.tokens}k
                      </text>
                    </g>
                  );
                });
              })()}
              {/* Total label below the bar */}
              <text x="20" y="92" fill={C.dim} fontSize="11" textAnchor="start">
                0
              </text>
              <text x="540" y="92" fill={C.dim} fontSize="11" textAnchor="end">
                128k (hard cap)
              </text>
              <text x="280" y="22" fill={SOFT.cyan} fontSize="12" textAnchor="middle">
                Total context budget
              </text>
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {CONTEXT_BUDGET_ZONES.map((z) => (
              <div key={z.name} style={{ ...tintedCard(z.color), padding: 12 }}>
                <T color={z.color} bold center size={14}>
                  {z.name}
                </T>
                <T color={z.soft} center size={13} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {z.tokens}k tokens
                </T>
                <T color={z.soft} center size={13} style={{ marginTop: 6 }}>
                  {z.role}
                </T>
              </div>
            ))}
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Anything past 128k gets dropped or summarized. Context engineering is the meta-skill of deciding what
            survives the cap on every single call.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            What Goes In, In Which Order
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The model reads top-to-bottom. Order is not cosmetic - it changes what the model attends to. The assembly
            stack is the same every call: system at the top, the user query at the bottom.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            {ASSEMBLY_STACK.map((layer, i) => (
              <div
                key={layer.layer}
                style={{
                  ...tintedCard(layer.color),
                  padding: 12,
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <span style={pill(layer.color)}>LAYER {i + 1}</span>
                  <T color={layer.color} bold size={15}>
                    {layer.layer}
                  </T>
                </div>
                <T color={layer.soft} center size={13} style={{ marginTop: 6 }}>
                  {layer.detail}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.blue,
            }}
          >
            Recency = bottom. Whatever you want the model to weight most goes nearest the user query.
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Same five layers every turn. The conversation history grows, the retrieved chunks rotate, the system prompt
            stays - but the order does not change.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Same Window, Different Strategies
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            128k is a fixed pie. Every call is a tradeoff between more retrieval, more history, or more output. The same
            long support ticket can be packed three very different ways.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {BUDGET_STRATEGIES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}24`,
                }}
              >
                <T color={s.color} bold center size={15}>
                  {s.name}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    width: "100%",
                    height: 32,
                    borderRadius: 6,
                    overflow: "hidden",
                    border: `1px solid ${C.dim}`,
                  }}
                >
                  {s.slices.map((slice) => {
                    const pct = (slice.tokens / totalBudget) * 100;
                    return (
                      <div
                        key={slice.label}
                        title={`${slice.label}: ${slice.tokens}k`}
                        style={{
                          width: `${pct}%`,
                          background: `${slice.color}55`,
                          borderRight: `1px solid ${slice.color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: slice.soft,
                          fontWeight: 700,
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        {pct >= 6 ? `${slice.tokens}k` : ""}
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {s.slices.map((slice) => (
                    <span
                      key={slice.label}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: `${slice.color}24`,
                        color: slice.soft,
                      }}
                    >
                      {slice.label}: {slice.tokens}k
                    </span>
                  ))}
                </div>
                <T color={s.soft} center size={13} style={{ marginTop: 8 }}>
                  {s.verdict}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.purple,
            }}
          >
            Rule: summarize what you can compress, evict what you cannot, never starve the output.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The trim and summarize moves are the two levers. Which one wins depends on the ticket type, not on taste.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Models Forget The Middle
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Even with a 128k window, the model does not attend evenly. Recall drops in the middle and spikes at the
            start and end. This is the lost-in-the-middle effect, and it is the single biggest reason long prompts fail.
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.indigo}06`,
              border: `1px solid ${C.indigo}12`,
            }}
          >
            <T color={SOFT.indigo} center size={13}>
              Recall accuracy vs. position in the context window
            </T>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                U-shaped curve plotting recall accuracy against position in a long context. The curve peaks near 100% at
                position 0 and at position 128k, and dips to roughly 45% in the middle. Annotations mark the Start,
                Middle, and End positions.
              </desc>
              {/* Plot area */}
              {(() => {
                const xPad = 60;
                const yTop = 30;
                const yBot = 190;
                const width = 560 - xPad * 2;
                const height = yBot - yTop;
                const toX = (p) => xPad + p * width;
                const toY = (r) => yBot - r * height;
                const path = LOST_IN_MIDDLE_SAMPLES.map(
                  (s, i) => `${i === 0 ? "M" : "L"} ${toX(s.pos).toFixed(1)} ${toY(s.recall).toFixed(1)}`,
                ).join(" ");
                return (
                  <g>
                    {/* Axes */}
                    <line x1={xPad} y1={yBot} x2={560 - xPad} y2={yBot} stroke={C.dim} strokeWidth="1.5" />
                    <line x1={xPad} y1={yTop} x2={xPad} y2={yBot} stroke={C.dim} strokeWidth="1.5" />
                    {/* Y-axis labels */}
                    <text x={xPad - 8} y={yBot + 4} fill={C.dim} fontSize="11" textAnchor="end">
                      0%
                    </text>
                    <text x={xPad - 8} y={toY(0.5) + 4} fill={C.dim} fontSize="11" textAnchor="end">
                      50%
                    </text>
                    <text x={xPad - 8} y={yTop + 4} fill={C.dim} fontSize="11" textAnchor="end">
                      100%
                    </text>
                    {/* X-axis labels */}
                    <text x={xPad} y={yBot + 18} fill={C.dim} fontSize="11" textAnchor="middle">
                      0
                    </text>
                    <text x={toX(0.5)} y={yBot + 18} fill={C.dim} fontSize="11" textAnchor="middle">
                      64k
                    </text>
                    <text x={560 - xPad} y={yBot + 18} fill={C.dim} fontSize="11" textAnchor="middle">
                      128k
                    </text>
                    <text x={280} y={yBot + 34} fill={SOFT.indigo} fontSize="12" textAnchor="middle">
                      Position in context window
                    </text>
                    <text
                      x={xPad - 38}
                      y={toY(0.5)}
                      fill={SOFT.indigo}
                      fontSize="12"
                      textAnchor="middle"
                      transform={`rotate(-90, ${xPad - 38}, ${toY(0.5)})`}
                    >
                      Recall accuracy
                    </text>
                    {/* Curve */}
                    <path d={path} fill="none" stroke={C.indigo} strokeWidth="2.5" />
                    {/* Sample points + labels */}
                    {LOST_IN_MIDDLE_SAMPLES.map((s) => (
                      <g key={s.pos}>
                        <circle cx={toX(s.pos)} cy={toY(s.recall)} r="4" fill={C.indigo} />
                        {s.label && (
                          <g>
                            <text
                              x={toX(s.pos)}
                              y={toY(s.recall) - 10}
                              fill={SOFT.indigo}
                              fontSize="12"
                              textAnchor="middle"
                              fontWeight="700"
                            >
                              {s.label}
                            </text>
                            <text
                              x={toX(s.pos)}
                              y={toY(s.recall) - 24}
                              fill={C.indigo}
                              fontSize="11"
                              textAnchor="middle"
                            >
                              {Math.round(s.recall * 100)}%
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.indigo}06`,
              border: `1px solid ${C.indigo}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.indigo,
            }}
          >
            Rule: put the most important info at the START or END of context, never in the middle.
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Buried in the middle is buried full stop. If a fact has to land, place it next to the user query or inside
            the system prompt - those are the two recall peaks.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Relevance-First vs Recency-First
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Inside the retrieved-chunks and history layers, ordering is its own choice. Two strategies cover the common
            cases, and they answer different question shapes.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {ORDERING_STRATEGIES.map((s) => (
              <div key={s.name} style={{ ...tintedCard(s.color), padding: 14 }}>
                <span style={pill(s.color)}>{s.name.toUpperCase()}</span>
                <T color={s.color} bold center size={15} style={{ marginTop: 8 }}>
                  When To Use
                </T>
                <T color={s.soft} center size={13} style={{ marginTop: 4 }}>
                  {s.when}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: s.soft,
                    textAlign: "center",
                  }}
                >
                  {s.rule}
                </div>
                <T color={s.soft} center size={13} style={{ marginTop: 8 }}>
                  {s.example}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.teal,
            }}
          >
            Factual lookup -&gt; relevance-first. Long conversation -&gt; recency-first. Hybrid -&gt; rerank then
            recency-bias the last 2 turns.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Same chunks, different order, different answer. Order is a free knob and it routinely costs nothing to flip.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Eviction Order: Cheapest Loss First
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When the packed prompt exceeds 128k, something has to leave. Eviction is not random - there is a ladder.
            Drop the things whose loss costs the least, keep the things whose loss breaks the call.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            {EVICTION_LADDER.map((row) => (
              <div
                key={row.rank}
                style={{
                  ...tintedCard(row.color),
                  padding: 12,
                  width: "100%",
                  maxWidth: 680,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      ...pill(row.color),
                      minWidth: 28,
                      textAlign: "center",
                    }}
                  >
                    #{row.rank}
                  </span>
                  <T color={row.color} bold size={15}>
                    {row.name}
                  </T>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 4,
                      background: `${row.color}24`,
                      border: `1px solid ${row.color}40`,
                      color: row.soft,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}
                  >
                    {row.rule}
                  </span>
                </div>
                <T color={row.soft} center size={13} style={{ marginTop: 6 }}>
                  {row.detail}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Summarize before you evict. A 50-turn history compresses to a few hundred tokens with most of its signal
            intact.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Context engineering closes the loop on prompting. Pick the layers, set the order, evict in the right order -
            and the same model behaves very differently call to call.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
