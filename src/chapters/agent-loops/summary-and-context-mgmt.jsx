import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

const RECENCY_RELEVANCE_HYBRID = [
  {
    strategy: "Recency",
    color: "amber",
    keep: "Most-Recent N Turns Raw",
    drop: "Summary Of Older Turns",
    good: "Continuity-Heavy Conversations.",
  },
  {
    strategy: "Relevance",
    color: "yellow",
    keep: "Turns Most Similar To Current Query",
    drop: "Summary Of Less-Relevant Turns",
    good: "Long-Range Topical Recall.",
  },
  {
    strategy: "Hybrid",
    color: "red",
    keep: "Top-K Recent + Top-K Relevant",
    drop: "Summary Of Everything Else",
    good: "Best Default In Practice.",
  },
];

const CONTEXT_THRESHOLDS = [
  { pct: 25, label: "Do Nothing", action: "Plenty Of Room.", color: "green" },
  { pct: 50, label: "Compress Half", action: "Summarize Oldest 25%.", color: "yellow" },
  {
    pct: 75,
    label: "Aggressive",
    action: "Summarize Older Half + Start Hybrid Retrieval.",
    color: "orange",
  },
  {
    pct: 90,
    label: "Panic",
    action: "Drop Everything Except Summary + Last 5 Turns + Top Retrieved.",
    color: "red",
  },
];

export default function SummaryAndContextMgmt(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            100 Turns Won&apos;t Fit
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Long conversations are not free. With an 8k token context window and ~250 tokens per turn, the window fills
            by turn 30. Past that, something has to give.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 140" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Horizontal context window bar at 8k tokens with turn-by-turn message stacking; by turn thirty the bar is
                full and the rest of the conversation cannot fit.
              </desc>
              {/* Bar from x=40 to x=520; width 480 = 100 turns. 1 turn = 4.8px */}
              <line x1={40} y1={20} x2={40} y2={120} stroke={SOFT.amber} strokeWidth={1.4} />
              <line x1={520} y1={20} x2={520} y2={120} stroke={SOFT.amber} strokeWidth={1.4} />
              <text x={40} y={15} fill={SOFT.amber} fontSize="11" textAnchor="start">
                Turn 1
              </text>
              <text x={520} y={15} fill={SOFT.amber} fontSize="11" textAnchor="end">
                Turn 100
              </text>

              {/* Bar background */}
              <rect
                x={40}
                y={55}
                width={480}
                height={30}
                rx={6}
                fill={`${C.amber}10`}
                stroke={C.amber}
                strokeWidth={1.5}
              />
              {/* Filled portion - first 30 turns = 30 * 4.8 = 144px */}
              <rect x={40} y={55} width={144} height={30} fill={`${C.red}66`} />
              {/* Full line marker at turn 30 */}
              <line x1={184} y1={50} x2={184} y2={90} stroke={C.red} strokeWidth={2} />
              <text x={184} y={108} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                Turn 30 - Full
              </text>
              <text x={184} y={125} fill={SOFT.red} fontSize="11" textAnchor="middle">
                8k Tokens Used
              </text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Past turn 30, the agent must compress old turns, drop them, or both. The rest of this chapter is about HOW
            to manage that ceiling.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Compress The Oldest Half
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The rolling-summary technique: when the window hits 50% capacity, summarize the oldest half into a
            2-paragraph block. The summary replaces the raw turns. Capacity drops to 25%. Repeat every 50%.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 200" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Rolling summary technique in three stages: conversation at fifty percent capacity, oldest half
                summarized into a small summary block, capacity drops back to twenty five percent so the conversation
                can continue.
              </desc>
              {/* Stage 1 - 50% */}
              <text x={90} y={20} fill={SOFT.yellow} fontSize="12" fontWeight="700" textAnchor="middle">
                Stage 1: 50% Capacity
              </text>
              <rect
                x={20}
                y={35}
                width={140}
                height={30}
                rx={6}
                fill={`${C.yellow}10`}
                stroke={C.yellow}
                strokeWidth={1.4}
              />
              <rect x={20} y={35} width={70} height={30} fill={`${C.yellow}50`} />

              {/* Stage 2 - Summarize */}
              <text x={280} y={20} fill={SOFT.yellow} fontSize="12" fontWeight="700" textAnchor="middle">
                Stage 2: Summarize Oldest Half
              </text>
              <rect
                x={210}
                y={35}
                width={140}
                height={30}
                rx={6}
                fill={`${C.yellow}10`}
                stroke={C.yellow}
                strokeWidth={1.4}
              />
              <rect x={210} y={35} width={14} height={30} fill={`${C.purple}80`} />
              <rect x={224} y={35} width={56} height={30} fill={`${C.yellow}50`} />
              <text x={217} y={80} fill={SOFT.purple} fontSize="10" textAnchor="middle">
                Summary
              </text>

              {/* Stage 3 - 25% */}
              <text x={470} y={20} fill={SOFT.yellow} fontSize="12" fontWeight="700" textAnchor="middle">
                Stage 3: Back To 25%
              </text>
              <rect
                x={400}
                y={35}
                width={140}
                height={30}
                rx={6}
                fill={`${C.yellow}10`}
                stroke={C.yellow}
                strokeWidth={1.4}
              />
              <rect x={400} y={35} width={14} height={30} fill={`${C.purple}80`} />
              <rect x={414} y={35} width={21} height={30} fill={`${C.yellow}50`} />

              {/* Arrows between stages */}
              <line x1={170} y1={50} x2={200} y2={50} stroke={C.yellow} strokeWidth={1.6} />
              <polygon points="196,47 204,47 200,43 200,57 196,53" fill={C.yellow} />
              <line x1={360} y1={50} x2={390} y2={50} stroke={C.yellow} strokeWidth={1.6} />
              <polygon points="386,47 394,47 390,43 390,57 386,53" fill={C.yellow} />

              <text x={280} y={140} fill={SOFT.yellow} fontSize="13" textAnchor="middle">
                Repeat Every Time The Window Hits 50%.
              </text>
              <text x={280} y={160} fill={SOFT.yellow} fontSize="12" textAnchor="middle">
                Summary Itself Grows Slowly As Older Summaries Are Re-Compressed.
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            The model itself usually generates the summary (a 2-paragraph LLM call per compression cycle). The summary
            lives in the conversation history at the spot where the raw turns used to be.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Summaries Of Summaries
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            For week-long conversations, flat rolling summary degrades. The hierarchical approach organizes raw turns
            into batches (leaves), per-batch summaries (mid), and a meta-summary of the whole conversation (top).
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 240" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Hierarchical summary tree: raw turn batches at the bottom layer become per-batch summaries at the middle
                layer, which combine into a single meta-summary at the top covering the whole conversation.
              </desc>
              {/* Top - Meta-Summary */}
              <rect
                x={230}
                y={20}
                width={100}
                height={36}
                rx={8}
                fill={`${C.orange}24`}
                stroke={C.orange}
                strokeWidth={2}
              />
              <text x={280} y={42} fill={SOFT.orange} fontSize="13" fontWeight="700" textAnchor="middle">
                Meta-Summary
              </text>

              {/* Mid - 3 Per-Batch Summaries */}
              {[140, 280, 420].map((x, i) => (
                <g key={`mid-${i}`}>
                  <line x1={280} y1={56} x2={x} y2={100} stroke={C.orange} strokeWidth={1.4} />
                  <rect
                    x={x - 60}
                    y={100}
                    width={120}
                    height={36}
                    rx={8}
                    fill={`${C.orange}18`}
                    stroke={C.orange}
                    strokeWidth={1.6}
                  />
                  <text x={x} y={122} fill={SOFT.orange} fontSize="12" fontWeight="700" textAnchor="middle">
                    Batch Summary {i + 1}
                  </text>
                </g>
              ))}

              {/* Bottom - Leaves (raw turn batches) */}
              {[140, 280, 420].map((parentX, p) =>
                [0, 1, 2, 3].map((leafIdx) => {
                  const x = parentX - 45 + leafIdx * 30;
                  return (
                    <g key={`leaf-${p}-${leafIdx}`}>
                      <line x1={parentX} y1={136} x2={x} y2={180} stroke={C.orange} strokeWidth={1} />
                      <rect
                        x={x - 12}
                        y={180}
                        width={24}
                        height={24}
                        rx={4}
                        fill={`${C.orange}10`}
                        stroke={C.orange}
                        strokeWidth={1.2}
                      />
                      <text x={x} y={196} fill={SOFT.orange} fontSize="10" textAnchor="middle">
                        T{p * 10 + leafIdx * 2 + 1}
                      </text>
                    </g>
                  );
                }),
              )}

              <text x={280} y={224} fill={SOFT.orange} fontSize="12" textAnchor="middle">
                Leaves = Raw Turn Batches (10 Turns Each). Mid = Per-Batch Summary. Top = Meta.
              </text>
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            Hierarchical wins for week-long conversations because the meta-summary stays small while you can still zoom
            into specific batches when needed.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Most Recent vs Most Relevant
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            After summarization, what stays in the prompt? Three strategies, each with a different tradeoff between
            continuity and topical fit.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {RECENCY_RELEVANCE_HYBRID.map((r) => {
              const accent = C[r.color];
              const soft = SOFT[r.color];
              return (
                <div key={r.strategy} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{r.strategy.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {r.strategy}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    Keep: {r.keep}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Drop: {r.drop}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Good For: {r.good}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Hybrid wins in production because most conversations have BOTH continuity needs (the user said "this"
            earlier) AND topical recall needs (the user asked a similar thing 80 turns ago).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Summarize At 50% Capacity
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Production agents trigger compression at fixed thresholds, not on demand. Four bands cover the production
            rule.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 160" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Four threshold bands across a context window utilization bar: twenty five percent do nothing, fifty
                percent compress half, seventy five percent aggressive summarize, ninety percent panic drop with summary
                plus last five turns.
              </desc>
              {/* Bar */}
              <rect
                x={40}
                y={50}
                width={480}
                height={40}
                rx={8}
                fill={`${C.purple}10`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              {/* Bands - each band 25% of 480 = 120px */}
              {CONTEXT_THRESHOLDS.map((b, i) => {
                const accent = C[b.color];
                const w = i === 0 ? 120 : 120;
                const xStart = 40 + i * 120;
                return (
                  <g key={`band-${i}`}>
                    <rect x={xStart} y={50} width={w} height={40} fill={`${accent}40`} />
                    <text
                      x={xStart + w / 2}
                      y={42}
                      fill={SOFT[b.color]}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {b.pct}%
                    </text>
                    <text
                      x={xStart + w / 2}
                      y={108}
                      fill={SOFT[b.color]}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {b.label}
                    </text>
                    <text x={xStart + w / 2} y={124} fill={SOFT[b.color]} fontSize="10" textAnchor="middle">
                      {b.action}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            Threshold-based compression is production-friendly because the cost is predictable. On-demand compression
            can hide behind a single user turn that suddenly explodes the window.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Context Is Where Real Work Happens
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Memory plus context-engineering decide what the model sees on EVERY turn. Chapter 24.6 covered the
            prompt-assembly stack. This chapter closes out by tying the memory layers into that stack.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <T color={C.amber} bold center size={15}>
              The Assembly Order
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                { layer: "System Prompt", source: "Static + Recipe From Procedural Memory." },
                { layer: "Memory Block", source: "Retrieved Episodes + Profile Card From Semantic." },
                { layer: "Conversation Summary", source: "Rolling / Hierarchical Summary Of Old Turns." },
                { layer: "Recent Turns", source: "Last N Raw Turns (Recency)." },
                { layer: "Retrieved Turns", source: "Top-K Relevant Turns From Older History (Hybrid)." },
                { layer: "Working Memory", source: "Current Scratchpad State." },
                { layer: "Current User Message", source: "What The User Just Said." },
              ].map((l, i) => (
                <div key={`layer-${i}`} style={{ ...tintedCard(C.amber), padding: 10, textAlign: "left" }}>
                  <T color={SOFT.amber} size={13}>
                    {`${i + 1}. ${l.layer}: ${l.source}`}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Every layer comes from somewhere. Memory chapters 26.7-26.11 supplied the sources; 24.6&apos;s assembly
            stack joins them into a single prompt; this chapter closes the loop with summarization that keeps it all
            under the token budget.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
