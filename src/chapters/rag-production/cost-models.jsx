import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { FormulaBox } from "../../shared/rag-helpers.jsx";

// Module-private helpers used by THIS chapter:
const CM_COST_LINES = [
  {
    title: "LLM Output Tokens",
    rate: "~$15 Per 1M Tokens",
    perQuery: 0.0075,
    detail: "500 Output Tokens, Claude Sonnet Typical",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    title: "LLM Input Tokens",
    rate: "~$3 Per 1M Tokens",
    perQuery: 0.012,
    detail: "4000 Input Tokens (System + Retrieved + Question)",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    title: "Reranker",
    rate: "~$0.001 Per Query",
    perQuery: 0.001,
    detail: "Cross-Encoder, Optional",
    color: C.yellow,
    accent: "#fff59d",
  },
  {
    title: "Vector Search",
    rate: "~$0.0002 Per Query",
    perQuery: 0.0002,
    detail: "Operator Cost, Managed Service",
    color: C.blue,
    accent: "#90caf9",
  },
  {
    title: "Embedding",
    rate: "~$0.0001 Per Query",
    perQuery: 0.0001,
    detail: "1024-Dim, Modern Provider",
    color: C.cyan,
    accent: "#80deea",
  },
];

const CM_QPS_TABLE = [
  { label: "Per Query", value: "$0.0208" },
  { label: "Per Second (1k QPS)", value: "$20.80" },
  { label: "Per Minute", value: "$1,248" },
  { label: "Per Hour", value: "$74,880" },
  { label: "Per Day (24h At 1k QPS)", value: "$1,797,120" },
  { label: "Realistic Daily (1k Peak, 30% Avg Load)", value: "$539,136" },
  { label: "Monthly At This Scale", value: "$16.2M" },
];

const CM_LEVERS = [
  {
    title: "Smaller Embedding",
    change: "1024 -> 384 Dim With Matryoshka",
    impact: "-60% Storage, No Quality Drop",
    reduction: "Small (Embedding < 1% Of Bill)",
  },
  {
    title: "Fewer Chunks Retrieved",
    change: "Top-20 -> Top-5 To The LLM",
    impact: "-75% Input Tokens",
    reduction: "~44% Of Total Bill",
  },
  {
    title: "Smaller LLM",
    change: "Sonnet -> Haiku",
    impact: "~10x Cheaper Per Token, ~80% Quality On Most RAG Tasks",
    reduction: "~80% Of LLM Bill",
  },
  {
    title: "Prompt Cache",
    change: "80% Prefix Hit Rate",
    impact: "Prefix Tokens At 90% Discount",
    reduction: "~74% On Cached Prefix Tokens",
  },
  {
    title: "Semantic Cache",
    change: "30% Hit Rate On Hot Queries",
    impact: "Skip LLM Entirely On Hits",
    reduction: "~30% On Affected Queries",
  },
];

const CM_WATERFALL_STEPS = [
  { label: "Start - Full Price", cost: 0.0208, change: "", color: C.red, accent: "#ef9a9a" },
  {
    label: "Apply Prompt Cache (80% Hit)",
    cost: 0.0061,
    change: "-71% On Input Tokens",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    label: "Apply Semantic Cache (30% Hit)",
    cost: 0.0043,
    change: "-30% Blended",
    color: C.yellow,
    accent: "#fff59d",
  },
  {
    label: "Reduce Top-K From 20 To 5",
    cost: 0.0028,
    change: "-35% Remaining Input",
    color: C.blue,
    accent: "#90caf9",
  },
  { label: "Switch LLM To Haiku", cost: 0.0012, change: "-57% On LLM Bill", color: C.green, accent: "#80e9b1" },
];

const CM_FRONTIER_POINTS = [
  { label: "A", config: "Full Sonnet + No Cache + Top-20", cost: 0.0208, quality: 0.92, color: C.red },
  { label: "B", config: "Sonnet + Prompt Cache + Top-10", cost: 0.0048, quality: 0.91, color: C.orange },
  { label: "C", config: "Sonnet + Both Caches + Top-10", cost: 0.0029, quality: 0.9, color: C.yellow },
  { label: "D", config: "Haiku + Both Caches + Top-10", cost: 0.0012, quality: 0.86, color: C.green },
  { label: "E", config: "Haiku + Both Caches + Top-5", cost: 0.0008, quality: 0.81, color: C.cyan },
  { label: "F", config: "Haiku, No Cache, Top-3 (Off Frontier)", cost: 0.0007, quality: 0.74, color: C.purple },
];

export default function CostModels(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const stackTotal = CM_COST_LINES.reduce((s, l) => s + l.perQuery, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Five Cost Lines */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Five Cost Lines Per RAG Query
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A production RAG query bill is a sum of five lines. We walk each in order of typical magnitude so the
            biggest cost driver - LLM tokens - is visible first.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
            }}
          >
            {CM_COST_LINES.map((line) => (
              <div
                key={line.title}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${line.color}06`,
                  border: `1px solid ${line.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={line.color} bold center size={14}>
                  {line.title}
                </T>
                <T color={line.accent} center size={12} style={{ marginTop: 6 }}>
                  {line.rate}
                </T>
                <T
                  color={line.accent}
                  bold
                  center
                  size={14}
                  style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}
                >
                  ${line.perQuery.toFixed(4)}
                </T>
                <T color={line.accent} center size={11} style={{ marginTop: 4 }}>
                  {line.detail}
                </T>
              </div>
            ))}
          </div>
          <FormulaBox color={C.pink}>
            <span style={{ color: "#f8bbd0" }}>Total Per Query = ${stackTotal.toFixed(4)}</span>
          </FormulaBox>
        </Box>
      )}

      {/* ─── sub=1 ─── Cost Stack Bar */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Cost Stack For One Query
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            One bar showing all five lines proportionally. LLM tokens (input plus output) dominate at about 94% of the
            total bill - so that is where every cost optimization starts.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 130" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Horizontal stacked bar chart of per-query cost showing LLM tokens dominate at 94 percent while
                embedding, vector search, and reranker make up the remainder.
              </desc>
              {(() => {
                const xStart = 60;
                const barWidth = 600;
                let cursor = xStart;
                return CM_COST_LINES.map((line) => {
                  const w = (line.perQuery / stackTotal) * barWidth;
                  const pct = (line.perQuery / stackTotal) * 100;
                  const cx = cursor + w / 2;
                  const node = (
                    <g key={line.title}>
                      <rect x={cursor} y="60" width={w} height="40" fill={line.color} opacity="0.7" />
                      <rect x={cursor} y="60" width={w} height="40" fill="none" stroke={line.accent} strokeWidth="1" />
                      {w >= 40 ? (
                        <text x={cx} y="85" textAnchor="middle" fill="#0b0b14" fontSize="13" fontWeight="700">
                          {pct.toFixed(1)}%
                        </text>
                      ) : null}
                    </g>
                  );
                  cursor += w;
                  return node;
                });
              })()}
              <text x="360" y="35" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Per-Query Total: ${stackTotal.toFixed(4)}
              </text>
              <text x="360" y="124" textAnchor="middle" fill="#f8bbd0" fontSize="12">
                Three Tiny Lines (Reranker, Vector Search, Embedding) Are The Sliver At The Right - Under 6% Combined.
              </text>
            </svg>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            {CM_COST_LINES.map((line) => {
              const pct = (line.perQuery / stackTotal) * 100;
              return (
                <div
                  key={line.title}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    background: `${line.color}06`,
                    border: `1px solid ${line.color}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={line.accent} bold center size={13}>
                    {line.title}
                  </T>
                  <T color={line.accent} bold center size={13} style={{ marginTop: 4, fontFamily: "ui-monospace, monospace" }}>
                    {pct.toFixed(1)}%
                  </T>
                  <T color={line.accent} center size={12} style={{ marginTop: 2, fontFamily: "ui-monospace, monospace" }}>
                    ${line.perQuery.toFixed(4)}
                  </T>
                </div>
              );
            })}
          </div>
          <FormulaBox color={C.pink}>
            <span style={{ color: "#f8bbd0" }}>
              LLM Tokens (Input + Output) = ~94% Of Per-Query Bill - Optimize There First
            </span>
          </FormulaBox>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── QPS / Daily / Monthly */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Scaling To Production: 1k QPS Daily Bill
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            The per-query cost looks small until you scale it to production traffic. At 1k QPS the daily bill crosses
            $500k. Every percent saved is real money.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, rowGap: 8 }}>
              {CM_QPS_TABLE.flatMap((row) => [
                <T key={`${row.label}-label`} color="#f8bbd0" size={14} style={{ textAlign: "right" }}>
                  {row.label}
                </T>,
                <T
                  key={`${row.label}-value`}
                  color="#f8bbd0"
                  bold
                  size={14}
                  style={{ fontFamily: "ui-monospace, monospace", textAlign: "left" }}
                >
                  {row.value}
                </T>,
              ])}
            </div>
          </div>
          <FormulaBox color={C.red}>
            <span style={{ color: "#ef9a9a" }}>Monthly Spend: $16.2M -&gt; A 10% Reduction Saves $1.6M / Month</span>
          </FormulaBox>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── 5 Levers */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Five Levers To Cut Cost
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Five real levers exist, in order of compounding return. The first two are free quality (no model swap); the
            rest involve real tradeoffs.
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {CM_LEVERS.map((lever) => (
              <div
                key={lever.title}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  display: "grid",
                  gridTemplateColumns: "180px 1fr 1fr 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <T color={C.pink} bold size={14}>
                  {lever.title}
                </T>
                <T color="#f8bbd0" size={13}>
                  {lever.change}
                </T>
                <T color="#f8bbd0" size={13}>
                  {lever.impact}
                </T>
                <T color="#f8bbd0" bold size={13}>
                  {lever.reduction}
                </T>
              </div>
            ))}
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 12 }}>
            Apply in order: cache first (free quality), reduce chunks (free quality), then downsize LLM (quality
            tradeoff).
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Lever Waterfall */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Worked Example: Stack All Five Levers
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Compounding the five levers in sequence drops the per-query cost from $0.0208 to $0.0012 - a 94% reduction.
            At 1k QPS that saves about $1.69M per day.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 280" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Downward waterfall chart showing per-query cost reducing as five levers are stacked: prompt cache,
                semantic cache, fewer chunks, and switching to Haiku. Final cost is $0.0012 from $0.0208 start.
              </desc>
              {(() => {
                const maxCost = CM_WATERFALL_STEPS[0].cost;
                const stepWidth = 130;
                const totalWidth = stepWidth * CM_WATERFALL_STEPS.length;
                const xStart = (720 - totalWidth) / 2;
                return CM_WATERFALL_STEPS.map((step, i) => {
                  const h = (step.cost / maxCost) * 180;
                  const x = xStart + i * stepWidth + 10;
                  const y = 220 - h;
                  return (
                    <g key={step.label}>
                      <rect x={x} y={y} width={stepWidth - 20} height={h} rx="4" fill={step.color} opacity="0.7" />
                      <text
                        x={x + (stepWidth - 20) / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fill={step.accent}
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="ui-monospace"
                      >
                        ${step.cost.toFixed(4)}
                      </text>
                      <text x={x + (stepWidth - 20) / 2} y={244} textAnchor="middle" fill={step.accent} fontSize="11">
                        {step.label.split(" ").slice(0, 3).join(" ")}
                      </text>
                      <text x={x + (stepWidth - 20) / 2} y={260} textAnchor="middle" fill={step.accent} fontSize="10">
                        {step.change}
                      </text>
                    </g>
                  );
                });
              })()}
            </svg>
          </div>
          <FormulaBox color={C.green}>
            <span style={{ color: "#80e9b1" }}>
              Final: $0.0012 / Query = 94% Reduction. At 1k QPS = $1.69M Saved Per Day Vs No Levers.
            </span>
          </FormulaBox>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Cost vs Quality Frontier */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Cost vs Quality: The Frontier
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            Cost is not the only target - faithfulness matters. Plot the six configurations on a 2D chart. The
            Pareto-optimal frontier connects the cost-efficient picks; everything below it is strictly worse.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 360" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Scatter plot of cost per query versus faithfulness score with six RAG configurations labeled A through
                F. A dashed Pareto frontier passes through the cost-efficient points; configuration F sits below the
                frontier as a dominated choice.
              </desc>
              {/* Axes */}
              <line x1="80" y1="40" x2="80" y2="300" stroke="#80e9b1" strokeWidth="1" />
              <line x1="80" y1="300" x2="660" y2="300" stroke="#80e9b1" strokeWidth="1" />
              {/* Axis labels */}
              <text x="370" y="335" textAnchor="middle" fill="#80e9b1" fontSize="13">
                Cost Per Query ($)
              </text>
              <text x="40" y="170" textAnchor="middle" fill="#80e9b1" fontSize="13" transform="rotate(-90, 40, 170)">
                Faithfulness Score
              </text>
              {/* Y ticks */}
              {[0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((q) => {
                const y = 300 - ((q - 0.5) / 0.5) * 260;
                return (
                  <g key={q}>
                    <line x1="76" y1={y} x2="80" y2={y} stroke="#80e9b1" />
                    <text x="68" y={y + 4} textAnchor="end" fill="#80e9b1" fontSize="11">
                      {q.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              {/* X ticks */}
              {[0.001, 0.005, 0.01, 0.015, 0.02, 0.025].map((c) => {
                const x = 80 + (c / 0.025) * 560;
                return (
                  <g key={c}>
                    <line x1={x} y1="300" x2={x} y2="304" stroke="#80e9b1" />
                    <text x={x} y="318" textAnchor="middle" fill="#80e9b1" fontSize="11" fontFamily="ui-monospace">
                      ${c.toFixed(3)}
                    </text>
                  </g>
                );
              })}
              {/* Pareto frontier polyline through A, B, C, D, E */}
              <polyline
                points={CM_FRONTIER_POINTS.slice(0, 5)
                  .map((p) => {
                    const x = 80 + (p.cost / 0.025) * 560;
                    const y = 300 - ((p.quality - 0.5) / 0.5) * 260;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                stroke="#80e9b1"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
              {/* Points */}
              {CM_FRONTIER_POINTS.map((p) => {
                const x = 80 + (p.cost / 0.025) * 560;
                const y = 300 - ((p.quality - 0.5) / 0.5) * 260;
                return (
                  <g key={p.label}>
                    <circle cx={x} cy={y} r="8" fill={p.color} opacity="0.85" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="#0b0b14" fontSize="11" fontWeight="700">
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 6,
              padding: 10,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              borderRadius: 8,
            }}
          >
            {CM_FRONTIER_POINTS.map((p) => (
              <div
                key={p.label}
                style={{ display: "grid", gridTemplateColumns: "20px 1fr 70px 60px", gap: 6, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: p.color,
                    color: "#0b0b14",
                    fontSize: 10,
                    textAlign: "center",
                    lineHeight: "14px",
                    fontWeight: 700,
                  }}
                >
                  {p.label}
                </div>
                <T color="#80e9b1" size={12}>
                  {p.config}
                </T>
                <T color="#80e9b1" size={12} style={{ fontFamily: "ui-monospace, monospace" }}>
                  ${p.cost.toFixed(4)}
                </T>
                <T color="#80e9b1" size={12} style={{ fontFamily: "ui-monospace, monospace" }}>
                  Q {p.quality.toFixed(2)}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e9b1" center size={14} style={{ marginTop: 10 }}>
            Pick the point on the frontier that matches your minimum acceptable quality. F is dominated - more cost for
            less quality than E - so never pick it.
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
