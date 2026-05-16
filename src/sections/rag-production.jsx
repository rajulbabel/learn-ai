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

export const CostModels = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Cost Models (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const ObservabilityTracing = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Observability & Tracing (stub)
          </T>
        </Box>
      )}
    </div>
  );
};

export const HallucinationDrift = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Hallucination Detection & Drift (stub)
          </T>
        </Box>
      )}
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
