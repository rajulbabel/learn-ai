import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter:
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

export default function ObservabilityTracing(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
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
