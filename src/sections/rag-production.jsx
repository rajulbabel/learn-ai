import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

// Section 12 Acts 9+10: Production Operations + Decision Framework + Capstone
// Chapters 12.36-12.41. Continues the customer support corpus and 5 standard
// queries established in 12.1-12.35. Per-act color theme: pink for Act 9
// (production ops); the Act 10 capstone (12.41) uses purple/indigo plus a
// multi-color palette to weave together every prior chapter's visual identity.

// ─── Shared helper: a centered, tinted, monospace standalone formula box ───
// Used across multiple chapters in Acts 9+10 where standalone formulas appear.
const FormulaBox = ({ color, children }) => (
  <div
    style={{
      marginTop: 14,
      padding: 16,
      borderRadius: 8,
      background: `${color}06`,
      border: `1px solid ${color}12`,
      fontFamily: "ui-monospace, SFMono-Regular, monospace",
      fontSize: 16,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

// ─── Chapter 12.36 Caching: module-level data ───
const CACHING_COST_STACK = [
  { label: "Embedding", value: 0.0001, color: C.cyan, accent: "#80deea" },
  { label: "Retrieval", value: 0.0002, color: C.blue, accent: "#90caf9" },
  { label: "LLM Input (4k Tokens)", value: 0.012, color: C.purple, accent: "#b8a9ff" },
  { label: "LLM Output (500 Tokens)", value: 0.005, color: C.orange, accent: "#ffcc80" },
];

const CACHING_PROMPT_CACHE_ROWS = [
  {
    label: "Full Price - No Cache",
    detail: "4000 Input Tokens At $3 / 1M",
    total: "$0.012",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    label: "With Prompt Cache - Hot Prefix",
    detail: "3800 Cached At $0.30 / 1M + 200 Fresh At $3 / 1M",
    total: "$0.00174",
    savings: "85% Saved",
    color: C.green,
    accent: "#80e9b1",
  },
];

const CACHING_HITS = [
  "Support Agent Looping On A Stable Doc Set",
  "Multi-Turn Conversation With Same Retrieved Docs",
  "RAG Pipeline Answering Many Queries With A Stable System Prompt",
];
const CACHING_MISSES = [
  "Docs Change Per Query (No Shared Prefix)",
  "Query-Time Chunking (Different Chunks Every Time)",
  "Cold-Start Every Conversation",
];

const CACHING_SEMANTIC_EXAMPLES = [
  {
    incoming: "How Do I Reset My Password?",
    cached: "How Can I Reset My Password?",
    score: 0.97,
    verdict: "HIT",
    color: C.green,
    accent: "#80e9b1",
  },
  {
    incoming: "Why Is My Dashboard Slow?",
    cached: "How Do I Reset My Password?",
    score: 0.34,
    verdict: "MISS",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    incoming: "How Do I Change My Password?",
    cached: "How Do I Reset My Password?",
    score: 0.88,
    verdict: "BORDERLINE",
    color: C.orange,
    accent: "#ffcc80",
  },
];

const CACHING_OPERATIONS_CARDS = [
  {
    title: "Eviction",
    body: "LRU + TTL. Cache fills up; evict the oldest unused entries; TTL forces refresh of any answer older than e.g. 24 hours.",
  },
  {
    title: "Invalidation",
    body: "When the corpus updates (a doc changes), every cached answer that touched that doc is stale. Strategy: tag cache entries with doc-IDs and invalidate on doc update.",
  },
  {
    title: "False-Hit Risk",
    body: "Two queries with cosine 0.95 can still want different answers. Example: 'Cancel My Subscription' vs 'Cancel My Trial' - similar embedding, very different policy. Tune threshold high (0.95+) for safety; monitor false-hit rate on a held-out set.",
  },
];

const CACHING_COMBINED_BARS = [
  { label: "No Cache", cost: 0.0173, savings: "0%", color: C.red, accent: "#ef9a9a" },
  { label: "Prompt Cache Only, 80% Hit Rate", cost: 0.0044, savings: "74% Saved", color: C.orange, accent: "#ffcc80" },
  {
    label: "Semantic Cache Only, 30% Hit Rate",
    cost: 0.0121,
    savings: "30% Saved",
    color: C.yellow,
    accent: "#fff59d",
  },
  { label: "Both - Stacked", cost: 0.003, savings: "83% Saved", color: C.green, accent: "#80e9b1" },
];

export const Caching = (ctx) => {
  const { sub } = ctx;
  const totalCost = CACHING_COST_STACK.reduce((s, c) => s + c.value, 0);
  const maxCombinedCost = Math.max(...CACHING_COMBINED_BARS.map((b) => b.cost));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── Why Cache In RAG */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Why Cache In RAG
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Every production RAG query burns four cost lines. At 1k QPS over a day this stacks to thousands of dollars.
            Caching cuts the bill 50-95% on repeated traffic.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color="#f8bbd0" bold center size={15}>
              Per-Query Cost Stack
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {CACHING_COST_STACK.map((c) => {
                const pct = (c.value / totalCost) * 100;
                return (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 220, textAlign: "right", color: c.accent, fontSize: 14 }}>{c.label}</div>
                    <div
                      style={{
                        flex: 1,
                        height: 18,
                        background: `${C.bg}80`,
                        borderRadius: 4,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: c.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <div style={{ width: 90, color: c.accent, fontSize: 14, fontFamily: "ui-monospace, monospace" }}>
                      ${c.value.toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </div>
            <FormulaBox color={C.pink}>
              <span style={{ color: "#f8bbd0" }}>
                Total Per Query = ${totalCost.toFixed(4)} -&gt; At 1k QPS = $1,500 / Day
              </span>
            </FormulaBox>
            <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
              Caching can cut this 50-95% on hot, repeated queries.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Prompt Cache: The Mechanism */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Prompt Cache: Cache The Static Prefix
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Provider-side prompt caching (Anthropic-style) keeps the system prompt and retrieved-context prefix on the
            inference server. Subsequent calls reuse it at a 90% discount as long as the prefix bytes match exactly.
          </T>

          {/* Two-region prompt artifact */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${C.pink}22`,
            }}
          >
            <div
              style={{
                padding: 14,
                background: `${C.green}06`,
                borderBottom: `1px dashed ${C.green}33`,
              }}
            >
              <T color="#80e9b1" bold center size={14}>
                Cached Prefix - 90% Discount, 5 Min TTL
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 14,
                  color: "#80e9b1",
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                }}
              >
                {`System: You are a customer support assistant. Cite every doc.

[Retrieved Doc 1] doc-1.md - account password reset flow ...
[Retrieved Doc 2] doc-2.md - email verification policy ...
[Retrieved Doc 3] doc-3.md - security audit logs ...`}
              </div>
            </div>
            <div style={{ padding: 14, background: `${C.pink}06` }}>
              <T color="#f8bbd0" bold center size={14}>
                Fresh Suffix - Full Price
              </T>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 14,
                  color: "#f8bbd0",
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                }}
              >
                {`User: How Do I Reset My Password?
Assistant:`}
              </div>
            </div>
          </div>

          {/* Cost comparison rows */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {CACHING_PROMPT_CACHE_ROWS.map((r) => (
              <div
                key={r.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${r.color}06`,
                  border: `1px solid ${r.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.label}
                </T>
                <T color={r.accent} center size={14} style={{ marginTop: 4 }}>
                  {r.detail}
                </T>
                <T color={r.accent} bold center size={16} style={{ marginTop: 6 }}>
                  Total = {r.total}
                  {r.savings ? ` -> ${r.savings}` : ""}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Prompt Cache: When It Applies */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            When Prompt Cache Applies
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Prompt cache only wins when many requests share a long prefix. Below: the patterns that hit vs the patterns
            that miss.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Cache Hits
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {CACHING_HITS.map((h) => (
                  <T key={h} color="#80e9b1" center size={14}>
                    + {h}
                  </T>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Cache Misses
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {CACHING_MISSES.map((m) => (
                  <T key={m} color="#ef9a9a" center size={14}>
                    - {m}
                  </T>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Semantic Cache: The Mechanism */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Semantic Cache: Cache By Query Similarity
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A semantic cache stores past (query, answer) pairs and serves a hit when an incoming query is similar enough
            to one already cached. Similarity is cosine on the query embedding; the threshold is the safety knob.
          </T>

          {/* Flow diagram SVG */}
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 320" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Semantic cache decision flow: an incoming query is embedded, compared by cosine similarity to cached
                queries, and either returns the cached answer when the score is at or above 0.93 or runs the full RAG
                pipeline and stores the new answer.
              </desc>
              {/* Row 1: Query -> Embed -> Cosine Search */}
              <g>
                <rect x="20" y="40" width="180" height="60" rx="8" fill={`${C.pink}1a`} stroke={C.pink} />
                <text x="110" y="68" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                  Incoming Query
                </text>
                <text x="110" y="88" textAnchor="middle" fill="#f8bbd0" fontSize="12">
                  &quot;Reset My Password?&quot;
                </text>
              </g>
              <line x1="200" y1="70" x2="240" y2="70" stroke={C.pink} strokeWidth="2" markerEnd="url(#arrow-pink)" />
              <g>
                <rect x="240" y="40" width="180" height="60" rx="8" fill={`${C.purple}1a`} stroke={C.purple} />
                <text x="330" y="68" textAnchor="middle" fill="#b8a9ff" fontSize="14" fontWeight="700">
                  Embed Query
                </text>
                <text x="330" y="88" textAnchor="middle" fill="#b8a9ff" fontSize="12">
                  1024-Dim Vector
                </text>
              </g>
              <line x1="420" y1="70" x2="460" y2="70" stroke={C.pink} strokeWidth="2" markerEnd="url(#arrow-pink)" />
              <g>
                <rect x="460" y="40" width="240" height="60" rx="8" fill={`${C.cyan}1a`} stroke={C.cyan} />
                <text x="580" y="68" textAnchor="middle" fill="#80deea" fontSize="14" fontWeight="700">
                  Cosine Search In Cache Store
                </text>
                <text x="580" y="88" textAnchor="middle" fill="#80deea" fontSize="12">
                  Compare Vs All Cached Queries
                </text>
              </g>
              {/* Diamond: Score >= 0.93 ? */}
              <line x1="580" y1="100" x2="580" y2="135" stroke={C.pink} strokeWidth="2" markerEnd="url(#arrow-pink)" />
              <polygon
                points="580,140 660,180 580,220 500,180"
                fill={`${C.orange}1a`}
                stroke={C.orange}
                strokeWidth="2"
              />
              <text x="580" y="178" textAnchor="middle" fill="#ffcc80" fontSize="14" fontWeight="700">
                Score &gt;= 0.93?
              </text>
              <text x="580" y="196" textAnchor="middle" fill="#ffcc80" fontSize="12">
                Threshold
              </text>
              {/* YES branch */}
              <line
                x1="500"
                y1="180"
                x2="380"
                y2="180"
                stroke={C.green}
                strokeWidth="2"
                markerEnd="url(#arrow-green)"
              />
              <text x="440" y="170" textAnchor="middle" fill="#80e9b1" fontSize="12" fontWeight="700">
                YES
              </text>
              <g>
                <rect x="120" y="150" width="260" height="60" rx="8" fill={`${C.green}1a`} stroke={C.green} />
                <text x="250" y="178" textAnchor="middle" fill="#80e9b1" fontSize="14" fontWeight="700">
                  Return Cached Answer
                </text>
                <text x="250" y="196" textAnchor="middle" fill="#80e9b1" fontSize="12">
                  Cost: $0 (No LLM Call)
                </text>
              </g>
              {/* NO branch */}
              <line x1="660" y1="180" x2="700" y2="180" stroke={C.red} strokeWidth="2" />
              <line x1="700" y1="180" x2="700" y2="250" stroke={C.red} strokeWidth="2" />
              <line x1="700" y1="250" x2="500" y2="250" stroke={C.red} strokeWidth="2" markerEnd="url(#arrow-red)" />
              <text x="685" y="220" textAnchor="middle" fill="#ef9a9a" fontSize="12" fontWeight="700">
                NO
              </text>
              <g>
                <rect x="240" y="230" width="260" height="60" rx="8" fill={`${C.orange}1a`} stroke={C.orange} />
                <text x="370" y="258" textAnchor="middle" fill="#ffcc80" fontSize="14" fontWeight="700">
                  Run Full RAG, Store Answer
                </text>
                <text x="370" y="276" textAnchor="middle" fill="#ffcc80" fontSize="12">
                  Cost: Full Stack
                </text>
              </g>
              {/* Arrow heads */}
              <defs>
                <marker id="arrow-pink" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.pink} />
                </marker>
                <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.green} />
                </marker>
                <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.red} />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Example cosine scores */}
          <T color="#f8bbd0" bold center size={15} style={{ marginTop: 14 }}>
            Example Cosine Scores Vs The Cached Query &quot;How Do I Reset My Password?&quot;
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {CACHING_SEMANTIC_EXAMPLES.map((ex) => (
              <div
                key={ex.incoming}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${ex.color}06`,
                  border: `1px solid ${ex.color}12`,
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 100px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <T color={ex.accent} size={14}>
                  Incoming: &quot;{ex.incoming}&quot;
                </T>
                <T color={ex.accent} bold center size={15} style={{ fontFamily: "ui-monospace, monospace" }}>
                  {ex.score.toFixed(2)}
                </T>
                <T color={ex.color} bold center size={14}>
                  {ex.verdict}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Semantic Cache: Eviction, Invalidation, False-Hit Risk */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Semantic Cache: Eviction, Invalidation, And False-Hit Risk
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A semantic cache is a separate vector store that must be managed like one. Three operational concerns shape
            its design.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {CACHING_OPERATIONS_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={16}>
                  {card.title}
                </T>
                <T color="#f8bbd0" center size={14} style={{ marginTop: 8 }}>
                  {card.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Combined Impact: Prompt + Semantic */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Combined: Prompt Cache + Semantic Cache
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            Prompt cache and semantic cache compound. Below: per-query cost for the same RAG pipeline under four cache
            configurations. The stacked configuration is the production target.
          </T>

          {/* Bar chart SVG */}
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 260" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Horizontal bar chart comparing per-query cost across four cache configurations: no cache versus prompt
                cache only versus semantic cache only versus both stacked. Both stacked delivers the lowest cost at
                $0.003 per query (83% savings).
              </desc>
              {CACHING_COMBINED_BARS.map((bar, i) => {
                const y = 20 + i * 56;
                const barWidth = (bar.cost / maxCombinedCost) * 380;
                return (
                  <g key={bar.label}>
                    <text x="280" y={y + 18} textAnchor="end" fill={bar.accent} fontSize="13" fontWeight="700">
                      {bar.label}
                    </text>
                    <rect x="290" y={y} width="380" height="34" rx="4" fill={`${C.bg}80`} stroke={`${bar.color}33`} />
                    <rect x="290" y={y} width={barWidth} height="34" rx="4" fill={bar.color} opacity="0.7" />
                    <text x={290 + barWidth + 8} y={y + 22} fill={bar.accent} fontSize="13" fontFamily="ui-monospace">
                      ${bar.cost.toFixed(4)}
                    </text>
                    <text x="280" y={y + 36} textAnchor="end" fill={bar.accent} fontSize="11">
                      {bar.savings}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <FormulaBox color={C.green}>
            <span style={{ color: "#80e9b1" }}>
              Stacked: $0.003 / Query = 83% Savings - Compounds Prompt Cache With Semantic Cache
            </span>
          </FormulaBox>
          <T color="#80e9b1" center size={14} style={{ marginTop: 10 }}>
            Apply both. Tune thresholds. Monitor false-hit rate. Most production RAG systems leave 50%+ of cost on the
            table by skipping caching.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ─── Chapter 12.37 CostModels: module-level data ───
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

export const CostModels = (ctx) => {
  const { sub } = ctx;
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
            <svg viewBox="0 0 720 180" width="100%" style={{ maxWidth: 720 }} role="img">
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
                      {w >= 30 ? (
                        <text x={cx} y="86" textAnchor="middle" fill="#0b0b14" fontSize="13" fontWeight="700">
                          {pct.toFixed(1)}%
                        </text>
                      ) : null}
                      <text x={cx} y="120" textAnchor="middle" fill={line.accent} fontSize="12">
                        {line.title}
                      </text>
                      <text
                        x={cx}
                        y="138"
                        textAnchor="middle"
                        fill={line.accent}
                        fontSize="11"
                        fontFamily="ui-monospace"
                      >
                        ${line.perQuery.toFixed(4)}
                      </text>
                    </g>
                  );
                  cursor += w;
                  return node;
                });
              })()}
              <text x="360" y="35" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Per-Query Total: ${stackTotal.toFixed(4)}
              </text>
            </svg>
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
    </div>
  );
};

// ─── Chapter 12.38 ObservabilityTracing: module-level data ───
const OT_NO_TRACE_CARDS = [
  {
    title: "Mystery Slowness",
    body: "User Reports 'The System Is Slow'. Without Per-Stage Latency, You Cannot Tell If Retrieval Or The LLM Is The Bottleneck.",
  },
  {
    title: "Silent Quality Drop",
    body: "Faithfulness Drops 5% Week-Over-Week. No Doc-IDs Logged Means You Cannot See Which Docs Were Retrieved.",
  },
  {
    title: "Cost Blowup",
    body: "Bill Doubles. No Per-Query Token Count Means You Cannot Tell Which Queries Pulled In Too Much Context.",
  },
  {
    title: "Hallucination Hunt",
    body: "User Flags A Bad Answer. No Model-Version Logged - You Cannot Reproduce The Failure.",
  },
];

const OT_SPAN_TREE = [
  { name: "Embed Query", latency: 12, color: C.cyan, accent: "#80deea", attrs: "Model = bge-large-v1.5, Dim = 1024" },
  {
    name: "Vector Search",
    latency: 28,
    color: C.blue,
    accent: "#90caf9",
    attrs: "Top-K = 20, Index = hnsw, Metric = cosine",
  },
  {
    name: "Rerank",
    latency: 45,
    color: C.orange,
    accent: "#ffcc80",
    attrs: "Model = bge-reranker-v2, Input = 20, Output = 5",
  },
  {
    name: "Pack Prompt",
    latency: 3,
    color: C.yellow,
    accent: "#fff59d",
    attrs: "Chunks Packed = 5, Total Tokens = 4128",
  },
  {
    name: "Generate",
    latency: 92,
    color: C.purple,
    accent: "#b8a9ff",
    attrs: "Model = Sonnet 4.7, Out Tokens = 480, Finish = stop",
  },
];

const OT_ATTRIBUTES_TABLE = [
  {
    stage: "Embed",
    color: C.cyan,
    attrs: ["query_text (Hashed)", "embedding_model_version", "dim", "latency_ms"],
  },
  {
    stage: "Vector Search",
    color: C.blue,
    attrs: ["top_k_requested", "index_name", "distance_metric", "retrieved_doc_ids", "retrieval_scores", "latency_ms"],
  },
  {
    stage: "Rerank",
    color: C.orange,
    attrs: ["reranker_model_version", "input_count", "output_count", "reranker_scores", "latency_ms"],
  },
  {
    stage: "Pack",
    color: C.yellow,
    attrs: ["chunk_count_packed", "total_prompt_tokens", "citation_count", "latency_ms"],
  },
  {
    stage: "Generate",
    color: C.purple,
    attrs: ["llm_model_version", "prompt_tokens", "completion_tokens", "finish_reason", "latency_ms"],
  },
];

const OT_TOOLS = [
  {
    name: "LangSmith",
    pros: "LangChain's Official Tracer; Strong For LangChain Users; Tight Integration With LangChain Stack",
  },
  {
    name: "Helicone",
    pros: "Provider-Agnostic; Logs Every LLM Call With Cost / Latency Dashboards; Lightweight Setup",
  },
  {
    name: "OpenTelemetry",
    pros: "Open Standard; Vendor-Neutral Spans; Export To Datadog / Grafana / Jaeger / Custom",
  },
  {
    name: "Arize Phoenix",
    pros: "Open-Source; Built For LLM Eval + Trace; Strong Dashboard For Retrieval Quality",
  },
  {
    name: "Native Provider Tooling",
    pros: "Anthropic Console, OpenAI Dashboard; Limited But Free; First-Party Cost Tracking",
  },
];

const OT_LOG_FREELY = [
  "Doc-IDs",
  "Retrieval Scores",
  "Latency (Per Stage)",
  "Model Version",
  "Token Counts",
  "Embedding-Model Version",
  "Query Length",
  "Anonymized User ID",
  "Response Status Code",
];

const OT_DO_NOT_LOG = [
  "Raw Query Text (Hash It)",
  "Raw Retrieved Chunks (Log Only IDs)",
  "PII Inside The Query",
  "User Account IDs (Use Opaque Session IDs)",
  "API Keys",
  "Prompt Template Contents That Include Secrets",
];

const OT_DASHBOARD_TILES = [
  { title: "P50 Latency", value: "180ms", color: C.cyan, accent: "#80deea" },
  { title: "P99 Latency", value: "620ms", color: C.orange, accent: "#ffcc80" },
  { title: "Faithfulness", value: "0.91", color: C.green, accent: "#80e9b1" },
  { title: "Cost Per Query", value: "$0.012", color: C.yellow, accent: "#fff59d" },
];

const OT_DASHBOARD_FOOTER = [
  { label: "Slowest Stage", value: "Rerank (45ms P50)" },
  { label: "Top Retrieved Doc", value: "Doc-7 (Password Reset)" },
  { label: "Model Version", value: "Sonnet 4.7" },
];

export const ObservabilityTracing = (ctx) => {
  const { sub } = ctx;
  const totalLatency = OT_SPAN_TREE.reduce((s, x) => s + x.latency, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why Trace ─── */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Why Trace RAG In Production
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A RAG system is opaque without traces. Four failure modes recur in production and every one of them needs
            per-stage instrumentation to diagnose.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {OT_NO_TRACE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={14}>
                  {card.title}
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 8 }}>
                  {card.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Span Tree ─── */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Canonical RAG Trace: Span Tree
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A single user query produces one root span and five child spans. Span widths below are proportional to
            latency so the bottleneck stage is visually obvious.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 320" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Parent/child span tree for a single RAG query: embed query, vector search, rerank, pack prompt, and
                generate. Each child span is rendered with width proportional to its latency in milliseconds.
              </desc>
              {/* Root span */}
              <rect x="60" y="20" width="600" height="40" rx="6" fill={`${C.pink}33`} stroke={C.pink} strokeWidth="2" />
              <text x="360" y="46" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Query (Total {totalLatency}ms)
              </text>
              {/* Children with proportional width */}
              {(() => {
                const xStart = 80;
                const totalWidth = 560;
                let cursor = xStart;
                return OT_SPAN_TREE.map((span, i) => {
                  const w = (span.latency / totalLatency) * totalWidth;
                  const y = 90 + i * 42;
                  const result = (
                    <g key={span.name}>
                      {/* Connector */}
                      <line
                        x1="80"
                        y1={y + 20}
                        x2={cursor}
                        y2={y + 20}
                        stroke={span.accent}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      {/* Span bar */}
                      <rect x={cursor} y={y} width={w} height="36" rx="4" fill={span.color} opacity="0.7" />
                      <text x={cursor + 8} y={y + 22} fill="#0b0b14" fontSize="12" fontWeight="700">
                        {span.name}
                      </text>
                      {/* Latency label */}
                      <text x={cursor + w + 8} y={y + 16} fill={span.accent} fontSize="12" fontFamily="ui-monospace">
                        {span.latency}ms
                      </text>
                      <text x={cursor + w + 8} y={y + 30} fill={span.accent} fontSize="10">
                        {span.attrs}
                      </text>
                    </g>
                  );
                  cursor += w;
                  return result;
                });
              })()}
            </svg>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            Rerank dominates wall time. Optimize there first - either reduce the input top-k or pick a faster reranker.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Per-Stage Attributes ─── */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Per-Stage Attributes To Log
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Every span carries attributes. The list below is the minimum every production RAG trace MUST emit. Variable
            identifiers stay lowercase per code convention; English column headers are title-case.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 12,
                padding: "8px 0",
                borderBottom: `1px solid ${C.pink}22`,
              }}
            >
              <T color="#f8bbd0" bold size={14}>
                Stage
              </T>
              <T color="#f8bbd0" bold size={14}>
                Attributes To Emit
              </T>
            </div>
            {OT_ATTRIBUTES_TABLE.map((row) => (
              <div
                key={row.stage}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: `1px dashed ${C.pink}22`,
                  alignItems: "center",
                }}
              >
                <T color={row.color} bold size={14}>
                  {row.stage}
                </T>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {row.attrs.map((a) => (
                    <span
                      key={a}
                      style={{
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: `${row.color}1a`,
                        border: `1px solid ${row.color}33`,
                        color: row.color,
                        fontSize: 12,
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Tools Landscape ─── */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Tools: What Captures RAG Traces
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Five common choices in 2025, ranging from framework-native to vendor-neutral. Brand names below are kept in
            their official capitalization (LangSmith, OpenTelemetry, etc) - those override the title-case rule.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
            }}
          >
            {OT_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={14}>
                  {tool.name}
                </T>
                <T color="#f8bbd0" center size={12} style={{ marginTop: 8 }}>
                  {tool.pros}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Privacy ─── */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Privacy: What NOT To Log In Plain Text
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Regulations (GDPR, HIPAA, SOC2) and contracts may forbid storing user query content in plain text. Use
            one-way hashes for queries; log doc-IDs not chunk text; redact PII upstream.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Log Freely
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {OT_LOG_FREELY.map((item) => (
                  <T key={item} color="#80e9b1" center size={13}>
                    + {item}
                  </T>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Do Not Log In Plain Text
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {OT_DO_NOT_LOG.map((item) => (
                  <T key={item} color="#ef9a9a" center size={13}>
                    - {item}
                  </T>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Dashboard Mock ─── */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            What A Production Trace Dashboard Looks Like
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            A real RAG ops dashboard surfaces four headline tiles, the most recent slow trace, and three signal-level
            facts. Mock below uses our customer support pipeline numbers.
          </T>
          {/* Headline tiles */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {OT_DASHBOARD_TILES.map((tile) => (
              <div
                key={tile.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${tile.color}06`,
                  border: `1px solid ${tile.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={tile.color} bold center size={14}>
                  {tile.title}
                </T>
                <T
                  color={tile.accent}
                  bold
                  center
                  size={24}
                  style={{ marginTop: 6, fontFamily: "ui-monospace, monospace" }}
                >
                  {tile.value}
                </T>
              </div>
            ))}
          </div>
          {/* Span tree thumbnail */}
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color="#80e9b1" bold center size={14}>
              Slowest Trace Last Hour: 620ms
            </T>
            <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
              {OT_SPAN_TREE.map((span) => {
                const w = (span.latency / totalLatency) * 100;
                return (
                  <div
                    key={span.name}
                    style={{
                      flex: w,
                      height: 22,
                      background: span.color,
                      opacity: 0.7,
                      borderRadius: 3,
                      textAlign: "center",
                      color: "#0b0b14",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: "22px",
                    }}
                  >
                    {span.latency}ms
                  </div>
                );
              })}
            </div>
          </div>
          {/* Footer facts */}
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {OT_DASHBOARD_FOOTER.map((fact) => (
              <div
                key={fact.label}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color="#80e9b1" bold center size={12}>
                  {fact.label}
                </T>
                <T color="#80e9b1" center size={13} style={{ marginTop: 4 }}>
                  {fact.value}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e9b1" center size={14} style={{ marginTop: 12 }}>
            A trace is the single source of truth when a user complains. Every stage. Every score. Every model version.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

// ─── Chapter 12.39 HallucinationDrift: module-level data ───
const HD_SIGNALS = [
  {
    title: "Faithfulness Score",
    body: "Per-Generation Faithfulness From LLM-As-Judge (12.32). Alert If Rolling 7-Day Median Drops Below 0.85.",
  },
  {
    title: "Citation Coverage",
    body: "Percent Of Claims With A [Doc-X] Citation. Alert If Drops Below 80%.",
  },
  {
    title: "Refusal Rate",
    body: "Percent Of Queries Refused With 'I Don't Know'. Alert On Spike (Too Cautious) Or Dip (Hallucinating When Context Was Sufficient).",
  },
  {
    title: "Out-Of-Index Mentions",
    body: "Regex Or LLM Check For Entities Mentioned That Do Not Appear In Any Retrieved Doc. Hard Signal Of Hallucination.",
  },
];

const HD_DRIFT_TYPES = [
  {
    title: "Data Drift",
    detect: "Re-Index Timestamp Vs Current Doc Set Checksum",
    body: "The Corpus Changes (New Docs Added, Old Docs Removed). The Embedding Index Becomes Stale Relative To The Current Corpus.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    title: "Embedding Drift",
    detect: "Log embedding_model_version Per Query; Alert On Mixed-Version Retrievals",
    body: "You Re-Embed With A New Model. Old Vectors And New Vectors Are Not Directly Comparable. Mixed-Version Retrievals Pollute Top-K.",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    title: "Eval Drift",
    detect: "Lock Judge Version; Rerun Calibration On Judge Change",
    body: "The LLM-As-Judge Model Is Upgraded. Faithfulness Scores From Old Judge Vs New Judge Are Not Directly Comparable.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    title: "Distribution Drift",
    detect: "Cluster Monitoring On Query Embeddings Over Time",
    body: "User Query Distribution Shifts (New Product Launched, New Failure Mode). Old Query Embeddings Cluster Differently.",
    color: C.yellow,
    accent: "#fff59d",
  },
];

const HD_DETECTION_STEPS = [
  { name: "Extract Claims", note: "LLM Segments Answer Into Atomic Claims" },
  { name: "Check Each Claim Against Retrieved Chunks", note: "LLM-As-Judge: Is Claim Supported?" },
  { name: "Compute Faithfulness Score", note: "supported_claims / total_claims" },
  { name: "Log Score + Doc-IDs + Unsupported Claims", note: "Emit To Trace" },
  { name: "Alert If Rolling Median < 0.85", note: "Page Owner On Drop" },
];

const HD_TIME_SERIES = [
  {
    name: "Faithfulness",
    color: C.green,
    accent: "#80e9b1",
    series: [0.92, 0.91, 0.91, 0.9, 0.9, 0.89, 0.88, 0.87, 0.86, 0.85, 0.84],
    threshold: 0.85,
    alertDay: 28,
  },
  {
    name: "Recall On Golden Set",
    color: C.cyan,
    accent: "#80deea",
    series: [0.88, 0.87, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8, 0.8, 0.79],
    threshold: 0.82,
    alertDay: 22,
  },
  {
    name: "Refusal Rate (%)",
    color: C.orange,
    accent: "#ffcc80",
    series: [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 18],
    threshold: 15,
    alertDay: 25,
  },
];

const HD_DASHBOARD_DRIFT_STATUS = [
  { type: "Data", status: "OK", color: C.green },
  { type: "Embedding", status: "WARN", color: C.orange },
  { type: "Eval", status: "OK", color: C.green },
  { type: "Distribution", status: "ALERT", color: C.red },
];

const HD_TOP_HALLUCINATED = [
  { query: "How Do I Reset My Password If I Forgot My Email?", score: 0.6 },
  { query: "Cancel My Subscription And Get A Refund", score: 0.5 },
  { query: "Why Is My Dashboard Slow With 500 Errors?", score: 0.68 },
];

export const HallucinationDrift = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Hallucination Signals */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Signals In Production
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Four signals catch most hallucinations without manual review. Wire each into the trace; alert on rolling
            medians; investigate any spike inside the same shift.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {HD_SIGNALS.map((s) => (
              <div
                key={s.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={15}>
                  {s.title}
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 8 }}>
                  {s.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Four Drift Types */}
      <Reveal when={sub >= 1}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Four Drift Types
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Drift is the slow leak before the flood. Four kinds of drift afflict production RAG. Each has a different
            detection mechanism and a different fix.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {HD_DRIFT_TYPES.map((d) => (
              <div
                key={d.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${d.color}06`,
                  border: `1px solid ${d.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={d.color} bold center size={16}>
                  {d.title}
                </T>
                <T color={d.accent} center size={13} style={{ marginTop: 8 }}>
                  {d.body}
                </T>
                <T color={d.accent} bold center size={12} style={{ marginTop: 8 }}>
                  Detect: {d.detect}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Hallucination Detection Pipeline */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Detection Pipeline
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            A 5-step pipeline that runs per-generation. The LLM extracts atomic claims, the judge labels each as
            supported or unsupported, and a rolling-median alert fires below threshold.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 280" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Hallucination detection flow: extract claims from the answer, check each against retrieved chunks,
                compute faithfulness score, log to trace, and alert when the rolling median drops below the threshold.
              </desc>
              {/* Input box */}
              <rect x="60" y="20" width="600" height="40" rx="6" fill={`${C.pink}1a`} stroke={C.pink} strokeWidth="2" />
              <text x="360" y="46" textAnchor="middle" fill="#f8bbd0" fontSize="14" fontWeight="700">
                Input: User Query + Retrieved Chunks + Generated Answer
              </text>
              {HD_DETECTION_STEPS.map((step, i) => {
                const y = 80 + i * 38;
                return (
                  <g key={step.name}>
                    <rect x="60" y={y} width="600" height="28" rx="4" fill={`${C.pink}33`} stroke={C.pink} />
                    <text x="80" y={y + 18} fill="#f8bbd0" fontSize="13" fontWeight="700">
                      Step {i + 1}: {step.name}
                    </text>
                    <text x="640" y={y + 18} textAnchor="end" fill="#f8bbd0" fontSize="11">
                      {step.note}
                    </text>
                    {i < HD_DETECTION_STEPS.length - 1 && (
                      <line
                        x1="360"
                        y1={y + 28}
                        x2="360"
                        y2={y + 38}
                        stroke={C.pink}
                        strokeWidth="2"
                        markerEnd="url(#hd-arrow)"
                      />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker id="hd-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill={C.pink} />
                </marker>
              </defs>
            </svg>
          </div>
          <FormulaBox color={C.pink}>
            <span style={{ color: "#f8bbd0" }}>
              Worked: 5 Claims, 4 Supported, 1 Hallucinated -&gt; Faithfulness = 4/5 = 0.80 -&gt; Below 0.85 Threshold,
              ALERT
            </span>
          </FormulaBox>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Drift Time Series */}
      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Drift Detection: Metrics Over Time
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Three drift signals over 30 days. Each crosses its alert threshold on a different day. Without the chart you
            would have noticed the symptoms - a flood of unhappy users - 2-3 weeks late.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <svg viewBox="0 0 720 320" width="100%" style={{ maxWidth: 720 }} role="img">
              <desc>
                Time-series chart over 30 days showing faithfulness, recall, and refusal rate lines crossing their alert
                thresholds at different days. Each metric is in a distinct color with its threshold shown as a dashed
                line.
              </desc>
              {/* Axes */}
              <line x1="80" y1="40" x2="80" y2="260" stroke="#f8bbd0" strokeWidth="1" />
              <line x1="80" y1="260" x2="660" y2="260" stroke="#f8bbd0" strokeWidth="1" />
              <text x="370" y="290" textAnchor="middle" fill="#f8bbd0" fontSize="13">
                Days (1 To 30)
              </text>
              <text x="40" y="150" textAnchor="middle" fill="#f8bbd0" fontSize="13" transform="rotate(-90, 40, 150)">
                Metric Value
              </text>
              {/* X labels: 1, 10, 20, 30 */}
              {[1, 10, 20, 30].map((d) => {
                const x = 80 + ((d - 1) / 29) * 580;
                return (
                  <g key={d}>
                    <line x1={x} y1="260" x2={x} y2="264" stroke="#f8bbd0" />
                    <text x={x} y="278" textAnchor="middle" fill="#f8bbd0" fontSize="11">
                      Day {d}
                    </text>
                  </g>
                );
              })}
              {/* Lines */}
              {HD_TIME_SERIES.map((line, lineIdx) => {
                // Normalize each line to its own scale for visibility
                const min = Math.min(...line.series, line.threshold);
                const max = Math.max(...line.series, line.threshold);
                const range = max - min || 1;
                const points = line.series
                  .map((v, i) => {
                    const x = 80 + (i / (line.series.length - 1)) * 580;
                    const y = 250 - ((v - min) / range) * (180 - lineIdx * 30);
                    return `${x},${y}`;
                  })
                  .join(" ");
                const thresholdY = 250 - ((line.threshold - min) / range) * (180 - lineIdx * 30);
                return (
                  <g key={line.name}>
                    <polyline points={points} stroke={line.color} strokeWidth="2" fill="none" />
                    <line
                      x1="80"
                      y1={thresholdY}
                      x2="660"
                      y2={thresholdY}
                      stroke={line.accent}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text x="670" y={thresholdY + 4} fill={line.accent} fontSize="11">
                      {line.name}
                    </text>
                    {/* Alert marker */}
                    {(() => {
                      const alertX = 80 + ((line.alertDay - 1) / 29) * 580;
                      return (
                        <g>
                          <circle cx={alertX} cy={thresholdY} r="6" fill={C.red} stroke="#fff" strokeWidth="1.5" />
                          <text
                            x={alertX}
                            y={thresholdY - 12}
                            textAnchor="middle"
                            fill={C.red}
                            fontSize="10"
                            fontWeight="700"
                          >
                            Alert Day {line.alertDay}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            Three different metrics. Three different alert days. Each catches a different failure mode early.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Alert Payload */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            What An Alert Should Carry
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            An alert without examples is a blank page at 3am. Always include the failing queries, the failing scores,
            and a hint at the recommended action so the on-call engineer can start fixing immediately.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
            }}
          >
            <T color={C.pink} bold center size={14}>
              Alert Payload Example
            </T>
            <div
              style={{
                marginTop: 10,
                padding: 14,
                borderRadius: 6,
                background: `${C.pink}10`,
                border: `1px dashed ${C.pink}33`,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 13,
                color: "#f8bbd0",
                textAlign: "left",
                whiteSpace: "pre-wrap",
              }}
            >
              {`ALERT: rag.faithfulness.drop
Severity: WARNING
Trigger: 7-Day Median Faithfulness Dropped Below 0.85 (Currently 0.82)
First Crossed: 2026-05-14 03:21 UTC
Affected: Production - Customer Support Pipeline

Recent Examples (Last 24h):
  - Query: "How Do I Reset My Password If I Forgot My Email?"
    Faithfulness: 0.60 | Cited Docs: doc-1, doc-3
    Unsupported Claim: "Support Team Will Email A Reset Link."
  - Query: "Cancel My Subscription And Get A Refund"
    Faithfulness: 0.50 | Cited Docs: doc-4
    Unsupported Claim: "Refunds Are Issued Within 24 Hours."

Recommended Action: Review Recent Corpus Updates And Re-Run Golden Eval.`}
            </div>
          </div>
          <T color="#f8bbd0" center size={14} style={{ marginTop: 10 }}>
            An alert without examples is useless. Always include the failing queries.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Dashboard */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Full Hallucination + Drift Panel
          </T>
          <T color="#80e9b1" center size={16} style={{ marginTop: 10 }}>
            Pull all signals into one panel. Top: the two trend thumbnails. Bottom: per-drift-type status and the worst
            recent queries. This is the dashboard the on-call engineer should see first.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "auto auto",
              gap: 12,
            }}
          >
            {/* Top-left: Faithfulness trend */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Faithfulness Trend (30 Days)
              </T>
              <svg viewBox="0 0 320 80" width="100%" style={{ marginTop: 8 }} role="img">
                <desc>Faithfulness trend thumbnail showing a steady decline from 0.92 to 0.84.</desc>
                <polyline
                  points={HD_TIME_SERIES[0].series
                    .map((v, i) => {
                      const x = 10 + (i / (HD_TIME_SERIES[0].series.length - 1)) * 300;
                      const y = 70 - ((v - 0.8) / 0.12) * 60;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  stroke={C.green}
                  strokeWidth="2"
                  fill="none"
                />
                <line x1="10" y1="25" x2="310" y2="25" stroke="#80e9b1" strokeDasharray="3 3" />
                <text x="312" y="28" fill="#80e9b1" fontSize="10">
                  0.85
                </text>
              </svg>
            </div>
            {/* Top-right: Refusal trend */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Refusal Rate Over Time
              </T>
              <svg viewBox="0 0 320 80" width="100%" style={{ marginTop: 8 }} role="img">
                <desc>Refusal rate trend thumbnail rising from 8 percent to 18 percent.</desc>
                <polyline
                  points={HD_TIME_SERIES[2].series
                    .map((v, i) => {
                      const x = 10 + (i / (HD_TIME_SERIES[2].series.length - 1)) * 300;
                      const y = 70 - ((v - 6) / 14) * 60;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  stroke={C.orange}
                  strokeWidth="2"
                  fill="none"
                />
                <line x1="10" y1="32" x2="310" y2="32" stroke="#ffcc80" strokeDasharray="3 3" />
                <text x="312" y="35" fill="#ffcc80" fontSize="10">
                  15%
                </text>
              </svg>
            </div>
            {/* Bottom-left: Drift status */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Drift Types Triggered
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HD_DASHBOARD_DRIFT_STATUS.map((row) => (
                  <div
                    key={row.type}
                    style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}
                  >
                    <T color="#80e9b1" size={13}>
                      {row.type}
                    </T>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 10,
                        background: `${row.color}1a`,
                        color: row.color,
                        border: `1px solid ${row.color}33`,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom-right: Top hallucinated */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={14}>
                Top Hallucinated Queries Last 24h
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HD_TOP_HALLUCINATED.map((row) => (
                  <div
                    key={row.query}
                    style={{ display: "grid", gridTemplateColumns: "1fr 60px", gap: 6, alignItems: "center" }}
                  >
                    <T color="#80e9b1" size={12}>
                      {row.query}
                    </T>
                    <T color={C.red} bold size={12} style={{ fontFamily: "ui-monospace, monospace" }}>
                      {row.score.toFixed(2)}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T color="#80e9b1" center size={14} style={{ marginTop: 12 }}>
            Hallucination detection + drift monitoring catches what users would not bother to report - the slow leak
            before the flood.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

export const FrameworkChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Framework Choice (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const RAGDecisionFrameworkCapstone = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Complete RAG Decision Framework + Capstone (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
