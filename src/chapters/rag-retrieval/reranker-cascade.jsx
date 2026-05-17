import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Sub=1 funnel stages.
const CASCADE_STAGES = [
  {
    name: "Vector Retrieval",
    role: "Cheap And Lossy",
    input: "1M Chunks",
    output: "Top-50",
    cost: "~30 ms / $0.0001",
    color: C.blue,
    accent: "#90caf9",
    note: "HNSW or IVF-PQ scan. Approximate, but blazing fast.",
  },
  {
    name: "Cross-Encoder Reranker",
    role: "Medium Cost, Sharp Scores",
    input: "50 Candidates",
    output: "Top-10",
    cost: "~80 ms / $0.0003",
    color: C.purple,
    accent: "#b8a9ff",
    note: "Reads query + each candidate jointly. 50 forward passes through a small transformer.",
  },
  {
    name: "LLM Reads Top-3 + Generates",
    role: "Expensive, Final Answer",
    input: "10 Reranked",
    output: "Answer",
    cost: "~800 ms / $0.0120",
    color: C.pink,
    accent: "#f5b7f8",
    note: "Top-3 chunks stuffed into the prompt; the LLM does the reasoning and writes the answer.",
  },
];

// Sub=2 latency stack.
const LATENCY_SEGMENTS = [
  { name: "Vector", ms: 30, color: C.blue, accent: "#90caf9" },
  { name: "Reranker", ms: 80, color: C.purple, accent: "#b8a9ff" },
  { name: "LLM", ms: 800, color: C.pink, accent: "#f5b7f8" },
];
const LATENCY_TOTAL = LATENCY_SEGMENTS.reduce((s, x) => s + x.ms, 0);
const LATENCY_BREAKDOWN = [
  { label: "Vector retrieval (HNSW, top-50):", value: "30 ms" },
  { label: "Cross-encoder reranker (50 -> 10):", value: "80 ms" },
  { label: "LLM generation (200 tokens, top-3):", value: "800 ms" },
];

// Sub=3 cost stack.
const COST_SEGMENTS = [
  { name: "Vector", dollars: 0.0001, color: C.blue, accent: "#90caf9" },
  { name: "Reranker", dollars: 0.0003, color: C.purple, accent: "#b8a9ff" },
  { name: "LLM", dollars: 0.012, color: C.pink, accent: "#f5b7f8" },
];
const COST_TOTAL = COST_SEGMENTS.reduce((s, x) => s + x.dollars, 0);
const COST_BREAKDOWN = [
  { label: "Vector retrieval (managed HNSW):", value: "$0.0001" },
  { label: "Cross-encoder reranker (50 cands):", value: "$0.0003" },
  { label: "LLM generation (4000 in + 200 out):", value: "$0.0120" },
];

// Sub=4 tuning grid.
const CASCADE_TUNING = [
  {
    config: "20 -> 5",
    recall: "0.82",
    latency: "850 ms",
    cost: "$0.011",
    isDefault: false,
    note: "Narrow. Saves a touch of latency and cost, but recall slips.",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    config: "50 -> 10",
    recall: "0.89",
    latency: "910 ms",
    cost: "$0.012",
    isDefault: true,
    note: "Default sweet spot. Best recall per millisecond.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    config: "100 -> 20",
    recall: "0.92",
    latency: "990 ms",
    cost: "$0.013",
    isDefault: false,
    note: "Wider. Buys +3 points of recall for +80 ms. Diminishing returns.",
    color: C.cyan,
    accent: "#80deea",
  },
];

// Helper: render one row of the 5-column cascade tuning table in sub=4.
function CascadeTuningRowCells({ row }) {
  const cell = {
    padding: 10,
    borderRadius: 6,
    background: `${row.color}06`,
    border: `1px solid ${row.color}${row.isDefault ? "30" : "18"}`,
    textAlign: "center",
  };
  const configLabel = row.isDefault ? `${row.config} (Default)` : row.config;
  return (
    <>
      <div style={cell}>
        <T color={row.accent} bold center size={13}>
          {configLabel}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} bold center size={14}>
          {row.recall}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={13}>
          {row.latency}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={13}>
          {row.cost}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={12}>
          {row.note}
        </T>
      </div>
    </>
  );
}

export default function RerankerCascade(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Funnel geometry (sub=1).
  const FUNNEL_W = 560;
  const FUNNEL_H = 360;
  const FUNNEL_TOP_W = 460;
  const FUNNEL_MID_W = 340;
  const FUNNEL_BOT_W = 220;
  const FUNNEL_NARROW = 60;
  const STAGE_H = 90;
  const STAGE_GAP = 20;
  const stage1Top = (FUNNEL_W - FUNNEL_TOP_W) / 2;
  const stage1Bot = (FUNNEL_W - (FUNNEL_TOP_W - FUNNEL_NARROW)) / 2;
  const stage2Top = (FUNNEL_W - FUNNEL_MID_W) / 2;
  const stage2Bot = (FUNNEL_W - (FUNNEL_MID_W - FUNNEL_NARROW)) / 2;
  const stage3Top = (FUNNEL_W - FUNNEL_BOT_W) / 2;
  const stage3Bot = (FUNNEL_W - (FUNNEL_BOT_W - FUNNEL_NARROW)) / 2;
  const stage1Y = 30;
  const stage2Y = stage1Y + STAGE_H + STAGE_GAP;
  const stage3Y = stage2Y + STAGE_H + STAGE_GAP;
  const trapezoids = [
    {
      topLeft: stage1Top,
      topRight: FUNNEL_W - stage1Top,
      botLeft: stage1Bot,
      botRight: FUNNEL_W - stage1Bot,
      y: stage1Y,
      stage: CASCADE_STAGES[0],
    },
    {
      topLeft: stage2Top,
      topRight: FUNNEL_W - stage2Top,
      botLeft: stage2Bot,
      botRight: FUNNEL_W - stage2Bot,
      y: stage2Y,
      stage: CASCADE_STAGES[1],
    },
    {
      topLeft: stage3Top,
      topRight: FUNNEL_W - stage3Top,
      botLeft: stage3Bot,
      botRight: FUNNEL_W - stage3Bot,
      y: stage3Y,
      stage: CASCADE_STAGES[2],
    },
  ];

  // Sub=2 latency bar geometry.
  const LBAR_W = 560;
  const LBAR_H = 60;
  const LBAR_INNER_W = 520;
  const LBAR_X_START = (LBAR_W - LBAR_INNER_W) / 2;

  // Sub=3 cost bar geometry.
  const CBAR_W = 560;
  const CBAR_H = 60;
  const CBAR_INNER_W = 520;
  const CBAR_X_START = (CBAR_W - CBAR_INNER_W) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Recap + why cascade beats single retriever */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Each Stage Cuts The Candidate Set And Pays For Better Quality
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Rerankers - covered in Section 11.25 - re-score a candidate list using a cross-encoder that reads the query
            and the doc together. Here we apply that idea in a 3-stage RAG cascade.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color="#90caf9" center size={15}>
              Vector retriever is cheap and lossy. Reranker is expensive and precise. LLM is most expensive and uses the
              smallest set. Each stage filters the work for the next one.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color={C.blue} bold center size={14}>
              The 3-Stage Cascade
            </T>
            <T color="#90caf9" center size={14} style={{ marginTop: 6 }}>
              Vector top-50 (cheap) -&gt; Cross-encoder rerank top-10 (medium) -&gt; LLM reads top-3 (expensive)
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── 3-stage funnel diagram */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Stage 1 Vector Top-50 -&gt; Stage 2 Reranker Top-10 -&gt; Stage 3 LLM Top-3
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The candidate pool shrinks by 5x at each stage. Each shrink lets us spend more compute per remaining item.
            That is the whole game.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FUNNEL_W} ${FUNNEL_H}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Three-stage RAG cascade funnel showing vector retrieval narrowing 1M chunks to top-50, a cross-encoder
                reranker narrowing 50 to top-10, and an LLM reading the top-3 to generate the final answer.
              </desc>

              {trapezoids.map((tr) => (
                <g key={tr.stage.name}>
                  <polygon
                    points={`${tr.topLeft},${tr.y} ${tr.topRight},${tr.y} ${tr.botRight},${tr.y + STAGE_H} ${tr.botLeft},${tr.y + STAGE_H}`}
                    fill={tr.stage.color}
                    fillOpacity="0.18"
                    stroke={tr.stage.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />

                  {/* Stage label */}
                  <text
                    x={FUNNEL_W / 2}
                    y={tr.y + 22}
                    fill={tr.stage.accent}
                    fontSize="15"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {tr.stage.name}
                  </text>

                  {/* Input -> Output */}
                  <text x={FUNNEL_W / 2} y={tr.y + 44} fill={tr.stage.accent} fontSize="13" textAnchor="middle">
                    {tr.stage.input} -&gt; {tr.stage.output}
                  </text>

                  {/* Cost tag */}
                  <text x={FUNNEL_W / 2} y={tr.y + 64} fill="rgba(255,255,255,0.65)" fontSize="12" textAnchor="middle">
                    {tr.stage.cost}
                  </text>

                  {/* Role tag */}
                  <text
                    x={FUNNEL_W / 2}
                    y={tr.y + 82}
                    fill={tr.stage.accent}
                    fontSize="11"
                    fontStyle="italic"
                    textAnchor="middle"
                  >
                    {tr.stage.role}
                  </text>
                </g>
              ))}

              {/* Connector arrows between trapezoids */}
              <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" fill="none">
                <path d={`M ${FUNNEL_W / 2} ${stage1Y + STAGE_H} L ${FUNNEL_W / 2} ${stage2Y - 4}`} />
                <polygon
                  points={`${FUNNEL_W / 2 - 5},${stage2Y - 4} ${FUNNEL_W / 2 + 5},${stage2Y - 4} ${FUNNEL_W / 2},${stage2Y + 4}`}
                  fill="rgba(255,255,255,0.35)"
                  stroke="none"
                />
                <path d={`M ${FUNNEL_W / 2} ${stage2Y + STAGE_H} L ${FUNNEL_W / 2} ${stage3Y - 4}`} />
                <polygon
                  points={`${FUNNEL_W / 2 - 5},${stage3Y - 4} ${FUNNEL_W / 2 + 5},${stage3Y - 4} ${FUNNEL_W / 2},${stage3Y + 4}`}
                  fill="rgba(255,255,255,0.35)"
                  stroke="none"
                />
              </g>
            </svg>
          </div>

          {/* Per-stage notes below the funnel */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {CASCADE_STAGES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.accent} bold center size={13}>
                  {s.name}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 4 }}>
                  {s.note}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Latency budget */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Latency Budget: 30 + 80 + 800 = ~910ms
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            End-to-end p50 latency on a typical RAG deployment. The bar below is drawn to scale so you can see how the
            LLM swallows the budget.
          </T>

          {/* Stacked latency bar */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LBAR_W} ${LBAR_H + 56}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Horizontal stacked-bar chart showing the latency budget for a 3-stage RAG cascade: 30 ms for vector
                retrieval, 80 ms for the cross-encoder reranker, and 800 ms for LLM generation, totalling 910 ms p50.
              </desc>

              {
                LATENCY_SEGMENTS.reduce(
                  (acc, seg) => {
                    const segW = (seg.ms / LATENCY_TOTAL) * LBAR_INNER_W;
                    const xStart = LBAR_X_START + acc.cursor;
                    const isWide = segW >= 60;
                    acc.elems.push(
                      <g key={seg.name}>
                        <rect x={xStart} y={20} width={segW} height={LBAR_H} fill={seg.color} opacity="0.78" />
                        {isWide && (
                          <text
                            x={xStart + segW / 2}
                            y={20 + LBAR_H / 2 + 5}
                            fill="#ffffff"
                            fontSize="14"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {seg.ms}ms
                          </text>
                        )}
                      </g>,
                    );
                    acc.cursor += segW;
                    return acc;
                  },
                  { elems: [], cursor: 0 },
                ).elems
              }

              {/* Legend below the bar */}
              {(() => {
                const LEGEND_Y = 20 + LBAR_H + 14;
                const SWATCH = 11;
                const ITEM_GAP = 28;
                const items = LATENCY_SEGMENTS.map((seg) => ({
                  ...seg,
                  label: `${seg.name} (${seg.ms} ms)`,
                  approxW: SWATCH + 6 + `${seg.name} (${seg.ms} ms)`.length * 7,
                }));
                const totalW = items.reduce((s, it) => s + it.approxW, 0) + ITEM_GAP * (items.length - 1);
                let cursor = LBAR_W / 2 - totalW / 2;
                return items.map((it) => {
                  const x = cursor;
                  cursor += it.approxW + ITEM_GAP;
                  return (
                    <g key={it.name}>
                      <rect
                        x={x}
                        y={LEGEND_Y - SWATCH + 2}
                        width={SWATCH}
                        height={SWATCH}
                        fill={it.color}
                        opacity="0.78"
                      />
                      <text x={x + SWATCH + 6} y={LEGEND_Y} fill={it.accent} fontSize="13" fontWeight="700">
                        {it.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x={LBAR_W / 2} y={LBAR_H + 50} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">
                Bar Width Proportional To Milliseconds
              </text>
            </svg>
          </div>

          {/* Monospace breakdown */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.green}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            {LATENCY_BREAKDOWN.map((row) => (
              <T key={row.label} color="#a5d6a7" center size={14} style={{ marginTop: 4 }}>
                {row.label} {row.value}
              </T>
            ))}
            <T color="rgba(255,255,255,0.4)" center size={14} style={{ marginTop: 6 }}>
              ---
            </T>
            <T color={C.green} bold center size={15} style={{ marginTop: 4 }}>
              Total p50 latency: 910 ms
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              LLM generation dominates. Optimizing reranker speed alone gives small wins. Caching the LLM call (covered
              in chapter 12.36) gives the biggest latency win.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Cost per query */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cost Per Query: $0.0001 + $0.0003 + $0.012 = $0.0124
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Same shape as the latency budget, in dollars. Each segment is drawn proportional to its cost contribution.
          </T>

          {/* Stacked cost bar */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${CBAR_W} ${CBAR_H + 56}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Horizontal stacked-bar chart of the per-query cost breakdown for a 3-stage RAG cascade: $0.0001 for
                vector retrieval, $0.0003 for the cross-encoder reranker, and $0.0120 for LLM generation, totalling
                $0.0124.
              </desc>

              {
                COST_SEGMENTS.reduce(
                  (acc, seg) => {
                    const segW = (seg.dollars / COST_TOTAL) * CBAR_INNER_W;
                    const xStart = CBAR_X_START + acc.cursor;
                    const isWide = segW >= 60;
                    acc.elems.push(
                      <g key={seg.name}>
                        <rect x={xStart} y={20} width={segW} height={CBAR_H} fill={seg.color} opacity="0.78" />
                        {isWide && (
                          <text
                            x={xStart + segW / 2}
                            y={20 + CBAR_H / 2 + 5}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            ${seg.dollars.toFixed(4)}
                          </text>
                        )}
                      </g>,
                    );
                    acc.cursor += segW;
                    return acc;
                  },
                  { elems: [], cursor: 0 },
                ).elems
              }

              {/* Legend below the bar */}
              {(() => {
                const LEGEND_Y = 20 + CBAR_H + 14;
                const SWATCH = 11;
                const ITEM_GAP = 28;
                const items = COST_SEGMENTS.map((seg) => {
                  const label = `${seg.name} ($${seg.dollars.toFixed(4)})`;
                  return { ...seg, label, approxW: SWATCH + 6 + label.length * 7 };
                });
                const totalW = items.reduce((s, it) => s + it.approxW, 0) + ITEM_GAP * (items.length - 1);
                let cursor = CBAR_W / 2 - totalW / 2;
                return items.map((it) => {
                  const x = cursor;
                  cursor += it.approxW + ITEM_GAP;
                  return (
                    <g key={it.name}>
                      <rect
                        x={x}
                        y={LEGEND_Y - SWATCH + 2}
                        width={SWATCH}
                        height={SWATCH}
                        fill={it.color}
                        opacity="0.78"
                      />
                      <text x={x + SWATCH + 6} y={LEGEND_Y} fill={it.accent} fontSize="13" fontWeight="700">
                        {it.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x={CBAR_W / 2} y={CBAR_H + 50} fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">
                Bar Width Proportional To Dollars Per Query
              </text>
            </svg>
          </div>

          {/* Monospace breakdown */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.cyan}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            {COST_BREAKDOWN.map((row) => (
              <T key={row.label} color="#80deea" center size={14} style={{ marginTop: 4 }}>
                {row.label} {row.value}
              </T>
            ))}
            <T color="rgba(255,255,255,0.4)" center size={14} style={{ marginTop: 6 }}>
              ---------
            </T>
            <T color={C.cyan} bold center size={15} style={{ marginTop: 4 }}>
              Total: $0.0124
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              LLM cost dominates. Reranker is cheap, vector retrieval is essentially free. At 1M queries/day, daily cost
              = $12,400. Caching can cut this 50-90%.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Cascade tuning knobs */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            The Two Knobs: Top-K Retrieved And Top-K Reranked
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            How wide should each stage cast its net? Too narrow and recall slips. Too wide and you pay for compute that
            does not move the needle. The table below shows three operating points on the running corpus.
          </T>

          {/* Header row */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1.6fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {["Top-K Retrieved -> Reranked", "Recall@Final", "Latency", "Cost", "Note"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.yellow}12`,
                  border: `1px solid ${C.yellow}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {CASCADE_TUNING.map((row) => (
              <CascadeTuningRowCells key={row.config} row={row} />
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffe082" center size={14}>
              Sweet spot is usually 50 -&gt; 10 -&gt; 3. Going wider buys diminishing returns; going narrower trades
              recall for latency.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub < 4 && (
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
