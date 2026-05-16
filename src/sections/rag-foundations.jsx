import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks.

const BARE_LLM_FAILURES = [
  {
    title: "Knowledge Cutoff",
    desc: "Trained on data through 2023; can't answer about 2025 events.",
  },
  {
    title: "Hallucination",
    desc: "Will confidently invent plausible-sounding facts.",
  },
  {
    title: "No Citations",
    desc: "Cannot point to sources for verification.",
  },
  {
    title: "Private Data Unknown",
    desc: "Knows nothing about your internal docs.",
  },
  {
    title: "Stale Facts",
    desc: "Public info from years ago, not last week.",
  },
];

const FINE_TUNING_VS_RAG_ROWS = [
  {
    property: "Cost",
    finetune: "Tens of thousands of dollars per refresh",
    rag: "Cents per query",
  },
  {
    property: "Freshness",
    finetune: "Frozen at training time",
    rag: "Reflects index updates instantly",
  },
  {
    property: "Traceability",
    finetune: "No source attribution",
    rag: "Cite the chunk used",
  },
];

const RAG_FLOW_STEPS = ["User Question", "Retrieve Relevant Docs", "LLM Reads Docs + Answers"];

const PRODUCTION_REASONS = [
  {
    problem: "Knowledge Cutoff",
    win: "Solved",
    detail: "Index is fresh; re-embed when docs change.",
  },
  {
    problem: "Hallucination",
    win: "Reduced",
    detail: "Model is anchored to retrieved text.",
  },
  {
    problem: "No Citation",
    win: "Solved",
    detail: "Cite the exact chunk used.",
  },
  {
    problem: "Private Data",
    win: "Solved",
    detail: "Index your own docs; no fine-tune needed.",
  },
  {
    problem: "Cheap To Refresh",
    win: "Re-embed Only Changed Docs",
    detail: "Update individual chunks; no full retrain.",
  },
];

export const WhyLLMsNeedRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Bare LLMs Have Hard Limits
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Drop a frontier model into a production app and the cracks appear fast. It does not know about events after
            its cutoff, makes up facts, can't show its work, and has never seen your private data. These failure modes
            are inherent to the model alone.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {BARE_LLM_FAILURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={16}>
                  {f.title}
                </T>
                <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
                  {f.desc}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Fine-Tuning Doesn't Solve The Problem
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The obvious first answer is &quot;just fine-tune the model on our data.&quot; In practice, fine-tuning is
            slow, expensive, and untraceable. RAG flips every property.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1.5fr",
              gap: 8,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                Property
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                Fine-Tuning
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}24`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={15}>
                RAG
              </T>
            </div>
            {FINE_TUNING_VS_RAG_ROWS.map((r) => (
              <div key={r.property} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.orange}06`,
                    border: `1px solid ${C.orange}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={14}>
                    {r.property}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.red}06`,
                    border: `1px solid ${C.red}12`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" center size={14}>
                    {r.finetune}
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.green}06`,
                    border: `1px solid ${C.green}12`,
                    textAlign: "center",
                  }}
                >
                  <T color="#a5d6a7" center size={14}>
                    {r.rag}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 12 }}>
            Fine-tuning bakes knowledge INTO the weights (expensive to update, no audit trail). RAG keeps knowledge
            OUTSIDE the model in a retrievable index (cheap, fresh, traceable).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            RAG: Ground The Answer In Retrieved Documents
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The fix is a tiny pipeline change: before the model answers, fetch the relevant documents and stuff them
            into the prompt. The model now reads first, answers second.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {RAG_FLOW_STEPS.map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                    textAlign: "center",
                    minWidth: 140,
                  }}
                >
                  <T color={C.cyan} bold center size={15}>
                    {step}
                  </T>
                </div>
                {i < RAG_FLOW_STEPS.length - 1 && (
                  <span style={{ color: C.cyan, fontSize: 24, fontWeight: 700 }}>&rarr;</span>
                )}
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>
            Instead of asking the model from memory, we ground its answer in retrieved documents. The model reads the
            docs, then answers, anchored to what the docs say.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Same Question, Two Answers
          </T>
          <T color={C.purple} center size={15} style={{ marginTop: 8 }}>
            Question: &quot;What is our refund policy?&quot;
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Bare LLM
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  marginTop: 6,
                  borderRadius: 4,
                  background: `${C.red}20`,
                  color: C.red,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                MADE UP
              </div>
              <T color="#ef9a9a" center size={15} style={{ marginTop: 10 }}>
                Our standard refund policy offers a 30-day money-back guarantee on all subscriptions. You can request a
                refund through your account dashboard.
              </T>
            </div>
            <div
              style={{
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                RAG
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  marginTop: 6,
                  borderRadius: 4,
                  background: `${C.green}20`,
                  color: C.green,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                CITED
              </div>
              <T color="#a5d6a7" center size={15} style={{ marginTop: 10 }}>
                Per [doc-4] (refunds.md): Refunds are issued for cancellations within 14 days of payment, prorated for
                annual plans.
              </T>
              <div
                style={{
                  marginTop: 10,
                  background: "#00e67606",
                  border: "1px solid #00e67612",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#a5d6a7",
                  textAlign: "center",
                }}
              >
                [doc-4] Refunds are issued for cancellations within 14 days. Annual plans prorated.
              </div>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 12 }}>
            Both answers sound confident. Only one is checkable. The bare model invented numbers that look reasonable;
            the RAG answer is pinned to a real chunk we can show the user.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            5 Reasons Production Systems Use RAG
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Every failure mode from sub-step 1 gets a clean answer, plus refresh becomes nearly free.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {PRODUCTION_REASONS.map((r) => (
              <div
                key={r.problem}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={15}>
                  {r.problem}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                  &rarr; {r.win}
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                  {r.detail}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

const PIPELINE_STAGES = [
  { name: "Chunk", x: 60, annotation: "Doc → Chunks", phase: "ingest" },
  { name: "Embed", x: 185, annotation: "Chunks → Vectors", phase: "ingest" },
  { name: "Store", x: 310, annotation: "Vectors → Index", phase: "ingest" },
  { name: "Retrieve", x: 435, annotation: "Query → Top-K", phase: "query" },
  { name: "Generate", x: 560, annotation: "Top-K → Answer", phase: "query" },
];

const CHUNKS = [
  {
    id: 1,
    text: "To reset your password, navigate to Settings > Security in your account dashboard. Click the 'Reset Password' link and enter your current password to verify identity.",
    vec: [0.81, 0.12, 0.65, 0.43, 0.07, 0.91, 0.22, 0.58],
    score: 0.91,
  },
  {
    id: 2,
    text: "An email will be sent to your registered address with a one-time reset link. The link is valid for 24 hours and can only be used once before expiring.",
    vec: [0.74, 0.18, 0.59, 0.51, 0.13, 0.86, 0.27, 0.62],
    score: 0.84,
  },
  {
    id: 3,
    text: "Click the link in the email within 24 hours to set a new password. Choose a password of at least 12 characters with letters, numbers, and symbols mixed.",
    vec: [0.79, 0.15, 0.61, 0.48, 0.1, 0.88, 0.24, 0.6],
    score: 0.77,
  },
];

const QUERY_VEC = [0.78, 0.14, 0.63, 0.46, 0.09, 0.89, 0.25, 0.61];

const END_TO_END_STAGES = [
  { name: "Chunk", color: C.cyan, lighter: "#80deea", detail: "[doc-1] split into 3 chunks" },
  { name: "Embed", color: C.green, lighter: "#a5d6a7", detail: "3 chunks → 3 vectors (8-dim)" },
  { name: "Store", color: C.purple, lighter: "#b8a9ff", detail: "Indexed in HNSW" },
  {
    name: "Retrieve",
    color: C.yellow,
    lighter: "#ffe082",
    detail: "Query → Top-3 chunks (scores 0.91, 0.84, 0.77)",
  },
  { name: "Generate", color: C.pink, lighter: "#f8bbd0", detail: "Grounded answer with [doc-1] citation" },
];

export const NaiveRAGPipeline = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Naive RAG Pipeline
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Naive RAG is five stages glued together. Three run once during ingest (offline). Two run on every query
            (online). Once you see the shape, every variant in the field is just a tweak to one of these boxes.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <svg viewBox="0 0 720 180" style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                Horizontal flow diagram of the 5-stage RAG pipeline: Chunk, Embed, Store, Retrieve, Generate. First 3
                stages tinted cyan (offline ingest), last 2 stages tinted yellow (online query). Arrows connect adjacent
                stages.
              </desc>
              <defs>
                <marker id="arrow12-2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="rgba(255,255,255,0.5)" />
                </marker>
              </defs>
              {/* Phase labels */}
              <text x="185" y="22" textAnchor="middle" fill={C.cyan} fontSize="12" fontWeight="bold">
                Ingest (Offline)
              </text>
              <text x="547.5" y="22" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                Query Time (Online)
              </text>
              {/* Phase divider */}
              <line
                x1="422.5"
                y1="30"
                x2="422.5"
                y2="150"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Stage boxes */}
              {PIPELINE_STAGES.map((s) => {
                const stroke = s.phase === "ingest" ? "#00b8d4" : "#ffd740";
                const fill = s.phase === "ingest" ? `${C.cyan}15` : `${C.yellow}15`;
                const labelFill = s.phase === "ingest" ? "#80deea" : "#ffe082";
                return (
                  <g key={s.name}>
                    <rect x={s.x} y={45} width={100} height={60} rx={8} fill={fill} stroke={stroke} strokeWidth="1.5" />
                    <text x={s.x + 50} y={80} textAnchor="middle" fill={labelFill} fontSize="15" fontWeight="bold">
                      {s.name}
                    </text>
                    <text x={s.x + 50} y={125} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                      {s.annotation}
                    </text>
                  </g>
                );
              })}
              {/* Arrows between stages */}
              {PIPELINE_STAGES.slice(0, -1).map((s, i) => {
                const next = PIPELINE_STAGES[i + 1];
                return (
                  <line
                    key={`arrow-${s.name}`}
                    x1={s.x + 100}
                    y1={75}
                    x2={next.x - 4}
                    y2={75}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow12-2)"
                  />
                );
              })}
            </svg>
          </div>
          <T color="#80deea" center size={16} style={{ marginTop: 12 }}>
            Five stages, two phases. Chunk + Embed + Store are done once during ingest (offline). Retrieve + Generate
            run on every user query (online).
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Stage 1: Chunk Documents Into Pieces
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Docs are usually too long to retrieve as a single unit. We cut them into chunks small enough that one chunk
            is mostly about one thing.
          </T>
          <T color="#a5d6a7" center size={15} style={{ marginTop: 10, fontStyle: "italic" }}>
            Example: doc-1 is the password reset help page. Sliced into 3 chunks of ~80 tokens each.
          </T>
          <div style={{ marginTop: 12 }}>
            {CHUNKS.map((c) => (
              <div
                key={c.id}
                style={{
                  marginTop: 8,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold size={14}>
                  [doc-1, chunk {c.id}]
                </T>
                <T color="#a5d6a7" size={15} style={{ marginTop: 4 }}>
                  {c.text}
                </T>
                <T color={C.dim} size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                  ~80 tokens
                </T>
              </div>
            ))}
          </div>
          <T color="#a5d6a7" size={16} style={{ marginTop: 12 }}>
            Chunking strategies (fixed-size, sentence-aware, semantic, hierarchical) covered in detail in chapters
            12.7-12.13.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Stage 2: Turn Each Chunk Into A Vector
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Each chunk becomes a dense vector encoding its meaning. Similar chunks have similar vectors.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
            {CHUNKS.map((c) => (
              <div key={c.id} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${C.purple}06`,
                    border: `1px solid ${C.purple}12`,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <T color={C.purple} bold center size={14}>
                    [doc-1, chunk {c.id}]
                  </T>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.purple}12`,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 14,
                    color: "#b8a9ff",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  [{c.vec.map((v) => v.toFixed(2)).join(", ")}]
                </div>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 14 }}>
            Embeddings - covered in Section 5.2 - turn text into dense vectors. RAG uses retrieval-tuned embeddings
            (more in chapter 12.14). Production typically uses 1024-dim vectors; we show 8 here for visibility.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Stage 3: Store Vectors In A Vector Database
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Once embedded, each chunk-vector goes into a vector index. The index is what makes retrieval fast - without
            it, every query would compare against every chunk.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "16px 18px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={16}>
              Vector Index (HNSW)
            </T>
            <T color="#ffcc80" center size={15} style={{ marginTop: 8 }}>
              3 chunks from doc-1 + ~1042 chunks from 29 other docs.
            </T>
            <T color={C.dim} center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
              1045 chunks indexed total (30 docs x ~35 chunks each, varies by doc length).
            </T>
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 6,
                background: "rgba(0,0,0,0.3)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13,
                color: "#ffcc80",
                textAlign: "center",
                lineHeight: 1.8,
              }}
            >
              [doc-1, chunk 1] [0.81, 0.12, 0.65, ...]
              <br />
              [doc-1, chunk 2] [0.74, 0.18, 0.59, ...]
              <br />
              [doc-1, chunk 3] [0.79, 0.15, 0.61, ...]
              <br />
              ... + 1042 more vectors
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 12 }}>
            Vector indexes (HNSW, IVF, hybrid, compression) - covered in Section 11. The index turns brute-force kNN
            into approximate nearest-neighbor search, milliseconds instead of seconds.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Stage 4: Retrieve The Top-K Most Similar Chunks
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Query is embedded by the same model. Cosine similarity ranks all chunks; the top-3 score highest. In
            production, top-k is usually 20-50 before reranking.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
                minWidth: 320,
              }}
            >
              <T color={C.yellow} bold center size={14}>
                Query
              </T>
              <T color="#ffe082" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
                &quot;How do I reset my password?&quot;
              </T>
            </div>
            <span style={{ color: C.yellow, fontSize: 22, fontWeight: 700 }}>&darr;</span>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${C.yellow}12`,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 14,
                color: "#ffe082",
                textAlign: "center",
                minWidth: 320,
              }}
            >
              [{QUERY_VEC.map((v) => v.toFixed(2)).join(", ")}]
            </div>
            <span style={{ color: C.yellow, fontSize: 22, fontWeight: 700 }}>&darr;</span>
            <T color={C.yellow} bold center size={16}>
              Top-3 Most Similar Chunks (cosine similarity)
            </T>
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {CHUNKS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${C.yellow}06`,
                    border: `1px solid ${C.yellow}12`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.yellow} bold center size={14}>
                    [doc-1, chunk {c.id}]
                  </T>
                  <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
                    &quot;{c.text.slice(0, 40)}...&quot;
                  </T>
                  <div
                    style={{
                      marginTop: 6,
                      padding: "4px 10px",
                      display: "inline-block",
                      borderRadius: 4,
                      background: `${C.yellow}20`,
                      color: C.yellow,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Score: {c.score.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Stage 5: Pack Chunks Into Prompt + LLM Generates Answer
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            The retrieved chunks are inserted into a prompt template along with the user's question. The &quot;I don't
            know&quot; instruction reduces hallucination when retrieved docs are insufficient.
          </T>
          <T color={C.pink} bold center size={16} style={{ marginTop: 14 }}>
            Prompt Template
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "14px 18px",
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              lineHeight: 1.6,
              color: C.bright,
              textAlign: "left",
              whiteSpace: "pre-wrap",
            }}
          >
            {
              "You are a helpful support assistant. Use the following documentation\nto answer the user's question. If the docs don't answer, say \"I don't know\".\n\nDocumentation:\n"
            }
            <span style={{ color: C.pink }}>[doc-1, chunk 1]</span>
            {" To reset your password, navigate to Settings > Security and click...\n"}
            <span style={{ color: C.pink }}>[doc-1, chunk 2]</span>
            {" An email will be sent to your registered address with...\n"}
            <span style={{ color: C.pink }}>[doc-1, chunk 3]</span>
            {
              " Click the link in the email within 24 hours to set a new...\n\nQuestion: How do I reset my password?\nAnswer:"
            }
          </div>
          <T color={C.green} bold center size={16} style={{ marginTop: 14 }}>
            Generated Answer (Grounded)
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={15}>
              &quot;To reset your password, go to Settings &gt; Security and click Reset Password. You'll receive a
              one-time link by email valid for 24 hours. Click it and set a new password of at least 12 characters.
              [doc-1]&quot;
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            End To End: One Query, Five Stages
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Same query, all five stages, real data flowing left to right.
          </T>
          <T color="#90caf9" center size={15} style={{ marginTop: 8, fontStyle: "italic" }}>
            Query: &quot;How do I reset my password?&quot;
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 10,
            }}
          >
            {END_TO_END_STAGES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.color} bold center size={14}>
                  {s.name}
                </T>
                <T color={s.lighter} center size={12} style={{ marginTop: 6 }}>
                  {s.detail}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color={C.blue} bold center size={14}>
              Final Answer
            </T>
            <T color={C.bright} center size={16} style={{ marginTop: 6, fontStyle: "italic" }}>
              &quot;To reset your password, go to Settings &gt; Security and click Reset Password. You'll receive a
              one-time link by email valid for 24 hours. Click it and set a new password. [doc-1]&quot;
            </T>
          </div>
          <T color="#90caf9" size={16} style={{ marginTop: 12 }}>
            That's naive RAG end to end. Every variant in the field (rerankers, hybrid, query rewriting, agents) is a
            tweak to one or more of these five boxes.
          </T>
        </Box>
      </Reveal>
    </div>
  );
};

const FAILURE_MODES = [
  { title: "Bad Chunking", desc: "Mid-sentence splits hide answers." },
  { title: "Low Recall", desc: "Lexical mismatch hides relevant docs." },
  { title: "Lost In Middle", desc: "Long contexts skip middle chunks." },
  { title: "No Citation", desc: "Answers without source attribution." },
  { title: "Hallucination", desc: "Fills gaps with confident invention." },
  { title: "Stale Index", desc: "Doc edits not reflected until re-embed." },
  { title: "Cost / Latency", desc: "Per-query LLM tokens add up at scale." },
];

const LOST_IN_MIDDLE_CURVE = [
  { pos: 1, weight: 0.92 },
  { pos: 2, weight: 0.78 },
  { pos: 3, weight: 0.52 },
  { pos: 4, weight: 0.28 },
  { pos: 5, weight: 0.18 },
  { pos: 6, weight: 0.2 },
  { pos: 7, weight: 0.32 },
  { pos: 8, weight: 0.6 },
  { pos: 9, weight: 0.82 },
  { pos: 10, weight: 0.95 },
];

const SSO_CONTEXT_CHUNKS = [
  "[doc-3] SSO is available on Enterprise plan via SAML 2.0.",
  "[doc-3] Enterprise plan includes SSO, audit logs, dedicated support.",
  "[doc-5] Pricing: Basic $10/mo, Pro $25/mo, Enterprise custom.",
];

const SIGNIN_RETRIEVED = [
  "[doc-12] Sign in to view your billing history.",
  "[doc-19] Sign in required to access the API console.",
  "[doc-27] Sign in with Google or Apple supported.",
];

const COST_ROWS = [
  { name: "Embedding", value: "$0.0001" },
  { name: "Retrieval", value: "$0.0002" },
  { name: "LLM Tokens (4000 ctx)", value: "$0.0120" },
  { name: "Total Per Query", value: "$0.0123" },
];

export const WhereNaiveRAGBreaks = (ctx) => {
  const { sub } = ctx;

  // U-curve SVG geometry
  const svgW = 520;
  const svgH = 220;
  const plotPadLeft = 60;
  const plotPadRight = 30;
  const plotPadTop = 30;
  const plotPadBottom = 40;
  const plotW = svgW - plotPadLeft - plotPadRight;
  const plotH = svgH - plotPadTop - plotPadBottom;
  const xFor = (pos) => plotPadLeft + ((pos - 1) / 9) * plotW;
  const yFor = (w) => plotPadTop + (1 - w) * plotH;
  const polyPoints = LOST_IN_MIDDLE_CURVE.map((p) => `${xFor(p.pos)},${yFor(p.weight)}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Naive RAG Has 7 Failure Modes
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The pipeline from 12.2 works on a happy-path query. Production traffic exposes 7 named ways it can fail.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {FAILURE_MODES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={15}>
                  {f.title}
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
                  {f.desc}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Failure 1: Bad Chunking
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Fixed-size chunking sliced a single sentence across two chunks. Neither chunk now contains both halves of
            the answer.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={14}>
              User Query
            </T>
            <T color="#ffcc80" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;How long do I have to use the password reset link?&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 1 (Mid-Sentence Split)
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...Click the link in the email...&quot;
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 (Mid-Sentence Split)
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...within 24 hours to set a new password...&quot;
              </T>
            </div>
          </div>
          <T color="#ffcc80" center size={15} style={{ marginTop: 12 }}>
            The 24-hour limit is split across two chunks. Neither contains both &quot;reset link&quot; AND &quot;24
            hours&quot; near each other.
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Retrieved Chunk
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;...Click the link in the email...&quot;
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Model Output
              </T>
              <T color="#ef9a9a" center size={14} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;I don't see a time limit in the docs.&quot;
              </T>
            </div>
          </div>
          <T color="#ef9a9a" center size={15} style={{ marginTop: 12 }}>
            Wrong. The 24-hour limit IS in the doc, but bad chunking hid it.
          </T>
          <T color="#ffcc80" center size={15} style={{ marginTop: 12 }}>
            Chapters 12.7-12.13 (chunking strategies) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Failure 2: Low Recall
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Embedding-only retrieval is supposed to handle synonyms. In practice, &quot;sign in&quot; and &quot;log
            in&quot; don't always cluster tightly enough, and the right doc gets missed.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              User Query
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;I can't sign in to my account&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Expected Match
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Doc: &quot;Login Troubleshooting&quot;
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                &quot;If you can't log in, check your password. Logging in requires a verified email...&quot;
              </T>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${C.red}20`,
                  color: C.red,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                MISSED FROM TOP-3
              </div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Top-3 Retrieved (Embedding-Only)
              </T>
              {SIGNIN_RETRIEVED.map((line) => (
                <T key={line} color="#ef9a9a" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {line}
                </T>
              ))}
            </div>
          </div>
          <T color="#ffe082" center size={15} style={{ marginTop: 12 }}>
            Embedding-only retrieval scores docs by vector similarity. &quot;Log in&quot; vs &quot;sign in&quot; don't
            cluster tightly enough. The right doc is missed entirely from top-3.
          </T>
          <T color="#ffe082" center size={15} style={{ marginTop: 12 }}>
            Chapters 12.16-12.17 (hybrid retrieval + rerankers) and 12.18-12.21 (query transformation) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Failure 3: Lost In The Middle
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Even when the answer IS in the retrieved context, long-context models attend more to the start and end than
            to the middle. A chunk buried at position 5 of 10 can be ignored entirely.
          </T>
          <T color={C.green} bold center size={16} style={{ marginTop: 14 }}>
            Lost-In-The-Middle Attention Curve
          </T>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <desc>
                U-shaped attention curve plotting attention weight against chunk position 1-10. High attention at start
                (positions 1-2) and end (positions 9-10), dipping in the middle (positions 4-7). Position 5 is
                highlighted as the relevant chunk that gets missed.
              </desc>
              {/* Axes */}
              <line
                x1={plotPadLeft}
                y1={plotPadTop + plotH}
                x2={plotPadLeft + plotW}
                y2={plotPadTop + plotH}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
              <line
                x1={plotPadLeft}
                y1={plotPadTop}
                x2={plotPadLeft}
                y2={plotPadTop + plotH}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
              {/* Y-axis ticks */}
              {[0, 0.5, 1].map((v) => (
                <g key={`y-${v}`}>
                  <line
                    x1={plotPadLeft - 4}
                    y1={yFor(v)}
                    x2={plotPadLeft}
                    y2={yFor(v)}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <text x={plotPadLeft - 8} y={yFor(v) + 4} textAnchor="end" fill="#a5d6a7" fontSize="11">
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}
              {/* X-axis ticks */}
              {LOST_IN_MIDDLE_CURVE.map((p) => (
                <g key={`x-${p.pos}`}>
                  <line
                    x1={xFor(p.pos)}
                    y1={plotPadTop + plotH}
                    x2={xFor(p.pos)}
                    y2={plotPadTop + plotH + 4}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                  />
                  <text x={xFor(p.pos)} y={plotPadTop + plotH + 18} textAnchor="middle" fill="#a5d6a7" fontSize="11">
                    {p.pos}
                  </text>
                </g>
              ))}
              {/* Axis labels */}
              <text
                x={plotPadLeft + plotW / 2}
                y={svgH - 6}
                textAnchor="middle"
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="bold"
              >
                Chunk Position
              </text>
              <text
                x={16}
                y={plotPadTop + plotH / 2}
                textAnchor="middle"
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="bold"
                transform={`rotate(-90 16 ${plotPadTop + plotH / 2})`}
              >
                Attention Weight
              </text>
              {/* U-curve line */}
              <polyline points={polyPoints} fill="none" stroke={C.green} strokeWidth="2" />
              {/* Dots */}
              {LOST_IN_MIDDLE_CURVE.map((p) => {
                const isRelevant = p.pos === 5;
                return (
                  <circle
                    key={`dot-${p.pos}`}
                    cx={xFor(p.pos)}
                    cy={yFor(p.weight)}
                    r={isRelevant ? 6 : 3.5}
                    fill={isRelevant ? C.red : C.green}
                    stroke={isRelevant ? C.red : "none"}
                    strokeWidth={isRelevant ? 1.5 : 0}
                  />
                );
              })}
              {/* Label for position 5 */}
              <text x={xFor(5)} y={yFor(0.18) + 22} textAnchor="middle" fill={C.red} fontSize="12" fontWeight="bold">
                Position 5 (Relevant)
              </text>
              <text x={xFor(5)} y={yFor(0.18) + 36} textAnchor="middle" fill="#ef9a9a" fontSize="11">
                Missed
              </text>
            </svg>
          </div>
          <T color="#a5d6a7" center size={15} style={{ marginTop: 12 }}>
            Model attends most to the first and last chunks. Middle chunks (positions 4-7) get less attention. The
            relevant chunk at position 5 is in context, but the model skips it.
          </T>
          <T color="#a5d6a7" center size={15} style={{ marginTop: 12 }}>
            Chapters 12.22-12.24 (context packing + lost-in-middle remedies) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Failure 4: No Citation
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The model answered, but the answer has no source markers. Reviewers can't tell which chunk the answer came
            from, or whether any chunk supports it at all.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              User Query
            </T>
            <T color="#80deea" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;Why is my account suspended?&quot;
            </T>
          </div>
          <T color={C.red} bold center size={16} style={{ marginTop: 14 }}>
            Generated Answer (No Citation)
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={15} style={{ fontStyle: "italic" }}>
              &quot;Your account may be suspended due to payment failures, terms of service violations, or unusual
              activity. Contact support for details.&quot;
            </T>
            <T color={C.red} center size={13} style={{ marginTop: 8, fontWeight: 700 }}>
              No [doc-X] markers anywhere.
            </T>
          </div>
          <T color="#80deea" center size={15} style={{ marginTop: 12 }}>
            Reviewer cannot verify which doc the answer came from. Without a citation, if the model hallucinated half of
            it, no one can tell.
          </T>
          <T color="#80deea" center size={15} style={{ marginTop: 12 }}>
            Chapters 12.22-12.24 (citations + groundedness) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Failure 5: Hallucination On Partial Info
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Retrieved context covers SSO for Enterprise plan but says nothing about Pro plan. The model fills the gap
            with a confident-sounding guess.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={14}>
              User Query
            </T>
            <T color="#b8a9ff" center size={15} style={{ marginTop: 4, fontStyle: "italic" }}>
              &quot;Does the Pro plan include SSO?&quot;
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Retrieved Context (Top-3 Chunks)
              </T>
              {SSO_CONTEXT_CHUNKS.map((line) => (
                <T key={line} color="#b8a9ff" center size={13} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {line}
                </T>
              ))}
              <T color={C.purple} center size={13} style={{ marginTop: 10, fontWeight: 700 }}>
                Note: No mention of Pro + SSO anywhere.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Model Output (Hallucinated)
              </T>
              <T color="#ef9a9a" center bold size={15} style={{ marginTop: 8 }}>
                &quot;Yes, the Pro plan includes SSO.&quot;
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
                This claim is wrong. SSO is Enterprise-only. Model filled in a gap with a plausible-sounding guess.
              </T>
            </div>
          </div>
          <T color="#b8a9ff" center size={15} style={{ marginTop: 12 }}>
            Chapters 12.22-12.24 (refusal + groundedness instruction) and 12.31-12.35 (faithfulness eval) fix this.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Failures 6 & 7: Stale Index, Cost, Latency
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            The last two failures aren't about answer quality - they're about operations. The index goes stale, and
            every query costs real money.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}12`,
                textAlign: "center",
              }}
            >
              <T color={C.pink} bold center size={16}>
                Failure 6: Stale Index
              </T>
              <T color="#f8bbd0" center size={14} style={{ marginTop: 8 }}>
                Doc-7 (Refund Policy) was updated 2 days ago. Sales now allows refunds within 30 days. The embedding
                index still has the old version (14 days).
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.pink}12`,
                  border: `1px solid ${C.pink}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={13}>
                  User Query
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 4, fontStyle: "italic" }}>
                  &quot;What's our current refund window?&quot;
                </T>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Answer Returned (Stale)
                </T>
                <T color="#ef9a9a" center size={14} style={{ marginTop: 4, fontStyle: "italic" }}>
                  &quot;14 days.&quot;
                </T>
              </div>
              <T color="#f8bbd0" center size={13} style={{ marginTop: 10 }}>
                Embedding lifecycle - covered in Section 11.27 - and chapters 12.36-12.40 (drift detection) fix this.
              </T>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}12`,
                textAlign: "center",
              }}
            >
              <T color={C.pink} bold center size={16}>
                Failure 7: Cost & Latency
              </T>
              <T color="#f8bbd0" center size={14} style={{ marginTop: 8 }}>
                Per-query cost breakdown:
              </T>
              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr",
                  gap: 6,
                }}
              >
                {COST_ROWS.map((r) => {
                  const isTotal = r.name === "Total Per Query";
                  return (
                    <div key={r.name} style={{ display: "contents" }}>
                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: isTotal ? `${C.pink}18` : `${C.pink}06`,
                          border: `1px solid ${C.pink}${isTotal ? "30" : "12"}`,
                          textAlign: "left",
                        }}
                      >
                        <T color={C.pink} bold={isTotal} size={13}>
                          {r.name}
                        </T>
                      </div>
                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: isTotal ? `${C.pink}18` : "rgba(0,0,0,0.3)",
                          border: `1px solid ${C.pink}${isTotal ? "30" : "12"}`,
                          textAlign: "center",
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          fontSize: 13,
                          color: "#f8bbd0",
                          fontWeight: isTotal ? 700 : 400,
                        }}
                      >
                        {r.value}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.pink}12`,
                  border: `1px solid ${C.pink}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={13}>
                  Latency
                </T>
                <T color="#f8bbd0" center size={13} style={{ marginTop: 4 }}>
                  50ms retrieval + 800ms generation = 850ms p50
                </T>
              </div>
              <T color={C.pink} center bold size={14} style={{ marginTop: 10 }}>
                At 1000 QPS, costs $12,300/day.
              </T>
              <T color="#f8bbd0" center size={13} style={{ marginTop: 10 }}>
                Chapters 12.36-12.40 (caching, cost models, observability) fix this.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// 12.7 Why Chunk At All + Fixed-Size Baseline
// ────────────────────────────────────────────────────────────────────────────

const CHUNK_REASONS = [
  {
    title: "Context Limits",
    desc: "Embedding models cap at 8K tokens; LLMs cap at context-window length. A 500-page manual cannot fit in either.",
  },
  {
    title: "Retrieval Granularity",
    desc: "Top-K retrieval returns chunks, not whole docs. Smaller chunks = more focused matches.",
  },
  {
    title: "Signal Dilution",
    desc: "Averaging 500 pages into one vector buries any specific fact. Smaller chunks keep semantic density.",
  },
];

const FIXED_SIZE_CHUNKS = [
  { name: "Chunk 1", range: "Tokens 0-128" },
  { name: "Chunk 2", range: "Tokens 112-240" },
  { name: "Chunk 3", range: "Tokens 224-352" },
  { name: "Chunk 4", range: "Tokens 336-464" },
];

const FIXED_SIZE_USE_IF = [
  "Docs are short (< 2K tokens each).",
  "Content is homogeneous (uniform paragraphs).",
  "You need a baseline to measure other strategies against.",
  "Budget = zero engineering time.",
];

const FIXED_SIZE_MOVE_ON_IF = [
  "Docs have clear structural markers (markdown, HTML headings).",
  "Content is heterogeneous (one doc = manual + FAQ + changelog).",
  "Cross-chunk facts hurt recall in your eval set.",
];

export const WhyChunkFixedSize = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Why Can&apos;t We Just Embed The Whole Document?
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The intuitive first idea: take the full 500-page product manual, embed it as one vector, and search. That
            instantly fails for two hard reasons - the document is too long to even fit through the embedding model, and
            even if it did, one vector for 500 pages would mean nothing specific.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Token Budget vs. Embedding Model Ceiling
            </T>
            <svg viewBox="0 0 720 220" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Horizontal token-count bar showing a 500-page document at 250,000 tokens overflowing the 8,192-token
                embedding model ceiling, with the overflow region marked in red and the ceiling marked by a yellow
                dashed line.
              </desc>
              {/* Long doc bar (250,000 tokens) - spans full usable width */}
              <text x="360" y="22" textAnchor="middle" fill="#ef9a9a" fontSize="13" fontWeight="bold">
                500-Page Product Manual = 250,000 Tokens
              </text>
              {/* Bar starts at x=40, ends at x=680, width=640 */}
              <rect x="40" y="36" width="640" height="36" rx="4" fill={`${C.red}30`} stroke={C.red} strokeWidth="1.5" />
              {/* Green portion = first 8,192 tokens (fits) */}
              <rect
                x="40"
                y="36"
                width={(8192 / 250000) * 640}
                height="36"
                rx="4"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.5"
              />
              <text x={40 + (8192 / 250000) * 640 + 12} y="58" fill={C.red} fontSize="12" fontWeight="bold">
                Overflow zone - 241,808 tokens exceed the ceiling
              </text>
              <text x="40" y="90" fill={C.green} fontSize="11">
                Fits (8,192)
              </text>

              {/* Ceiling bar (8,192 tokens) */}
              <text x="360" y="120" textAnchor="middle" fill="#ffe082" fontSize="13" fontWeight="bold">
                Embedding Model Ceiling = 8,192 Tokens (OpenAI ada-3)
              </text>
              <rect
                x="40"
                y="134"
                width="640"
                height="14"
                rx="4"
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              <rect
                x="40"
                y="134"
                width={(8192 / 250000) * 640}
                height="14"
                rx="4"
                fill={`${C.yellow}40`}
                stroke={C.yellow}
                strokeWidth="1.5"
              />
              <text x={40 + (8192 / 250000) * 640 + 8} y="146" fill={C.yellow} fontSize="11">
                Ceiling = 8,192
              </text>

              {/* "One vector for 500 pages?" callout */}
              <text x="360" y="180" textAnchor="middle" fill="#ef9a9a" fontSize="13">
                Even if it fit: one vector
              </text>
              <text
                x="360"
                y="196"
                textAnchor="middle"
                fill="#ef9a9a"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="13"
              >
                [0.21, 0.84, 0.12, ...]
              </text>
              <text x="360" y="212" textAnchor="middle" fill="#ef9a9a" fontSize="13">
                for 500 pages would mean nothing specific.
              </text>
            </svg>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Three Reasons Production RAG Always Chunks
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chunking is not a workaround - it is the fundamental design choice. Three forces make it unavoidable.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {CHUNK_REASONS.map((r) => (
              <div
                key={r.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={16}>
                  {r.title}
                </T>
                <T color="#80deea" center size={14} style={{ marginTop: 8 }}>
                  {r.desc}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" center size={14} style={{ marginTop: 12 }}>
            Bottom line: chunking is the highest-leverage decision in RAG. Get the chunk strategy wrong and every
            downstream stage compounds the error.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Fixed-Size Chunking: A Sliding Window With Overlap
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The simplest possible strategy: slide a fixed token window across the document. Each window becomes one
            chunk. Adjacent chunks overlap by a few tokens so a sentence cut in half still appears whole somewhere.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#a5d6a7",
              lineHeight: 1.6,
            }}
          >
            doc-1 (Password Reset Article, ~480 tokens): &quot;To reset your password, visit account.example.com and
            click forgot password. Enter the email tied to your account. You will receive a reset link valid for 24
            hours. Click the reset link in the email within 24 hours to set a new password. The link expires after that
            and you must request a new one. Once you click the link you will see a form asking for a new password.
            Choose something strong - at least twelve characters with a mix of letters, numbers, and symbols. Confirm
            the password and click save. Your password is updated and you can log in with the new credentials
            immediately. If you do not receive the email, check your spam folder. If you still cannot find it, the email
            tied to your account may be wrong - contact support.&quot;
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 15,
              color: "#a5d6a7",
            }}
          >
            chunks = slide(doc, size=128, overlap=16)
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={16}>
              Sliding Window Across doc-1 (Size = 128, Overlap = 16)
            </T>
            <svg viewBox="0 0 720 240" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Sliding window chunk diagram showing four colored 128-token chunks of the doc-1 password reset article
                with 16-token overlap zones shaded darker between adjacent chunks. Each chunk is labeled with its token
                range.
              </desc>
              {/* Token axis: 0 to 464 mapped to x=40..680 (width=640) */}
              <text x="360" y="22" textAnchor="middle" fill="#a5d6a7" fontSize="13" fontWeight="bold">
                Token Position
              </text>
              {/* Axis line */}
              <line x1="40" y1="40" x2="680" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              {/* Tick marks */}
              {[0, 128, 240, 352, 464].map((t) => {
                const x = 40 + (t / 464) * 640;
                return (
                  <g key={t}>
                    <line x1={x} y1="36" x2={x} y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x={x} y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                      {t}
                    </text>
                  </g>
                );
              })}

              {/* Chunk bars */}
              {FIXED_SIZE_CHUNKS.map((c, i) => {
                const starts = [0, 112, 224, 336];
                const ends = [128, 240, 352, 464];
                const start = starts[i];
                const end = ends[i];
                const x = 40 + (start / 464) * 640;
                const w = ((end - start) / 464) * 640;
                const y = 78 + i * 36;
                return (
                  <g key={c.name}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height="24"
                      rx="4"
                      fill={`${C.green}30`}
                      stroke={C.green}
                      strokeWidth="1.5"
                    />
                    <text x={x + w / 2} y={y + 16} textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                      {c.name} ({c.range})
                    </text>
                  </g>
                );
              })}

              {/* Overlap shaded bands (darker green between adjacent chunks) */}
              {[112, 224, 336].map((overlapStart, i) => {
                const overlapEnd = overlapStart + 16;
                const x = 40 + (overlapStart / 464) * 640;
                const w = ((overlapEnd - overlapStart) / 464) * 640;
                const y = 78 + i * 36;
                return (
                  <rect
                    key={`overlap-${overlapStart}`}
                    x={x}
                    y={y}
                    width={w}
                    height="60"
                    fill={`${C.green}50`}
                    stroke="none"
                  />
                );
              })}

              {/* Legend */}
              <rect x="60" y="220" width="16" height="10" fill={`${C.green}30`} stroke={C.green} strokeWidth="1" />
              <text x="84" y="230" fill="#a5d6a7" fontSize="12">
                Chunk
              </text>
              <rect x="180" y="220" width="16" height="10" fill={`${C.green}50`} stroke="none" />
              <text x="204" y="230" fill="#a5d6a7" fontSize="12">
                Overlap (16 tokens)
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Fixed-Size Cuts Land Anywhere - Including Mid-Sentence
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The token window does not care about grammar. The 128th token is wherever the 128th token is. Zoom into the
            boundary between chunk 1 and chunk 2 in doc-1 and you see exactly that.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 1 Ends Mid-Phrase
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  color: "#ffcc80",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                &quot;...click the reset link in the email within 24 hours to{" "}
                <span style={{ background: `${C.red}40`, padding: "1px 4px", borderRadius: 3, color: "#ef9a9a" }}>
                  set a new
                </span>
                &quot;
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 Starts Mid-Phrase
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 13,
                  color: "#ffcc80",
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                &quot;
                <span style={{ background: `${C.red}40`, padding: "1px 4px", borderRadius: 3, color: "#ef9a9a" }}>
                  password.
                </span>{" "}
                The link expires after that and you must request a new one...&quot;
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}12`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              The Boundary Cut Breaks Retrieval
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
              The chunk that ends with &quot;set a new&quot; has no idea what the user is setting. The chunk that starts
              with &quot;password.&quot; has no idea what action was being taken. Retrieval cannot match the query
              &quot;password reset expiry&quot; to either piece alone - both lose the cross-boundary fact.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Overlap Helps - But Only Partially
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            The standard fix is overlap: duplicate the last N tokens of each chunk into the start of the next. A
            sentence cut at the boundary now appears whole in one of the two adjacent chunks. The cost: storage and
            redundant compute.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Left panel: overlap = 0 */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Overlap = 0 (Naive)
              </T>
              <svg viewBox="0 0 300 80" style={{ width: "100%", height: "auto", display: "block", marginTop: 8 }}>
                <desc>
                  Two clean rectangle chunks side by side with no overlap, showing a red vertical line at the boundary
                  marking the mid-sentence break point.
                </desc>
                <rect
                  x="20"
                  y="20"
                  width="125"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <rect
                  x="155"
                  y="20"
                  width="125"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <line x1="150" y1="12" x2="150" y2="60" stroke={C.red} strokeWidth="2" strokeDasharray="3 2" />
                <text x="82.5" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 1
                </text>
                <text x="217.5" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 2
                </text>
                <text x="150" y="74" textAnchor="middle" fill={C.red} fontSize="11">
                  Hard Cut
                </text>
              </svg>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    Cuts can lose context entirely
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    Recall drops on cross-chunk facts
                  </T>
                </div>
              </div>
            </div>

            {/* Right panel: overlap = 16 */}
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Overlap = 16 Tokens
              </T>
              <svg viewBox="0 0 300 80" style={{ width: "100%", height: "auto", display: "block", marginTop: 8 }}>
                <desc>
                  Two chunk rectangles with an overlapping band tinted darker between them showing the shared 16-token
                  region where the sentence appears whole in both adjacent chunks.
                </desc>
                <rect
                  x="20"
                  y="20"
                  width="140"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                <rect
                  x="140"
                  y="20"
                  width="140"
                  height="32"
                  rx="4"
                  fill={`${C.yellow}30`}
                  stroke={C.yellow}
                  strokeWidth="1.5"
                />
                {/* Overlap band */}
                <rect x="140" y="20" width="20" height="32" fill={`${C.yellow}60`} stroke="none" />
                <text x="90" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 1
                </text>
                <text x="220" y="40" textAnchor="middle" fill="#ffe082" fontSize="12" fontWeight="bold">
                  Chunk 2
                </text>
                <text x="150" y="74" textAnchor="middle" fill={C.green} fontSize="11">
                  Shared 16 Tokens
                </text>
              </svg>
              <div
                style={{
                  marginTop: 10,
                  padding: 8,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.yellow}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#ffe082",
                  textAlign: "left",
                  lineHeight: 1.5,
                }}
              >
                Shared text in both adjacent chunks: &quot;set a new password. The link expires&quot;
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Overlap = duplicate storage cost
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Overlap = ~12% more vectors at 128/16
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}30`,
                  }}
                >
                  <T color="#ffcc80" size={13}>
                    Still breaks long-range references (entity earlier in doc, pronoun later)
                  </T>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffe082" center size={14}>
              Overlap fixes the easy case (sentence-level cuts) but not the hard case (a definition on page 3 referenced
              by &quot;it&quot; on page 17).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Fixed-Size: The Baseline To Beat
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Fixed-size chunking is the right default in a narrow band of cases. Outside that band, every other strategy
            beats it. Use this table to decide.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
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
              <T color={C.green} bold center size={16}>
                Use Fixed-Size If
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                {FIXED_SIZE_USE_IF.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>OK</span>
                    <T color="#a5d6a7" size={13}>
                      {row}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={16}>
                Move To Structural / Semantic If
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  textAlign: "left",
                }}
              >
                {FIXED_SIZE_MOVE_ON_IF.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.purple}12`,
                      border: `1px solid ${C.purple}24`,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.purple, fontWeight: 700, fontSize: 14 }}>{"->"}</span>
                    <T color="#b8a9ff" size={13}>
                      {row}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Fixed-size is the baseline. Every chunking strategy in production is measured against it. Chapters
              12.8-12.12 each fix one weakness of fixed-size.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};
