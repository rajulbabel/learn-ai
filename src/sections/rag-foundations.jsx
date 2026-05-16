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

const RECURSIVE_SEPARATORS = [
  {
    label: "Try Paragraph Break First",
    sep: "\\n\\n",
    note: "Most structural - one blank line between blocks.",
  },
  {
    label: "Fall Back To Line Break",
    sep: "\\n",
    note: "Newline inside a paragraph still respects layout.",
  },
  {
    label: "Fall Back To Sentence Break",
    sep: ". ",
    note: "Period followed by space - smallest grammar unit.",
  },
  {
    label: "Last Resort: Word Break",
    sep: " ",
    note: "Plain space - never cuts mid-word.",
  },
];

const RECURSIVE_PROS = [
  "Preserves sentence + paragraph boundaries.",
  "Respects markdown / HTML structure for free.",
  "Zero embedding cost at chunk time (just string ops).",
  "Implemented by every major RAG framework (LangChain RecursiveCharacterTextSplitter, LlamaIndex SentenceSplitter).",
];

const RECURSIVE_CONS = [
  "Doesn't understand semantic boundaries (a topic spanning 4 paragraphs gets split).",
  "Heading-aware but not heading-equivalent (two ## sections on the same theme are split into two chunks).",
  "Plain-text docs without structural markers fall through to sentence/word splits (closer to fixed-size).",
];

export const RecursiveStructuralChunking = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Split By Structure, Not By Token Count
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Fixed-size cut the password reset doc mid-phrase. Recursive structural chunking instead tries the most
            structural separator first - a paragraph break - and only falls back to smaller separators when the
            resulting chunk still exceeds the size limit. The cut lands at a boundary the writer already chose.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Recursive Separator Priority Tree
              </T>
              <svg viewBox="0 0 520 360" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Vertical priority tree of structural separators starting with paragraph break, falling back through
                  line break, sentence break, to word break, with each arrow labeled If chunk too big to mark the
                  fallback condition.
                </desc>
                {/* Node geometry: viewBox width 520, node width 320, x = (520-320)/2 = 100 */}
                {RECURSIVE_SEPARATORS.map((node, i) => {
                  const x = 100;
                  const y = 16 + i * 84;
                  const w = 320;
                  const h = 64;
                  return (
                    <g key={node.label}>
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx="8"
                        fill={`${C.cyan}18`}
                        stroke={C.cyan}
                        strokeWidth="1.5"
                      />
                      <text x={x + w / 2} y={y + 22} textAnchor="middle" fill="#80deea" fontSize="14" fontWeight="bold">
                        {node.label}
                      </text>
                      <text
                        x={x + w / 2}
                        y={y + 40}
                        textAnchor="middle"
                        fill="#80deea"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        fontSize="13"
                      >
                        Separator = &quot;{node.sep}&quot;
                      </text>
                      <text x={x + w / 2} y={y + 56} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                        {node.note}
                      </text>
                    </g>
                  );
                })}
                {/* Arrows between nodes - between bottom of node i (y_i + 64) and top of node i+1 (y_{i+1} = 16 + (i+1)*84) */}
                {[0, 1, 2].map((i) => {
                  const yStart = 16 + i * 84 + 64;
                  const yEnd = 16 + (i + 1) * 84;
                  const xMid = 260;
                  return (
                    <g key={`arrow-${i}`}>
                      <line
                        x1={xMid}
                        y1={yStart}
                        x2={xMid}
                        y2={yEnd - 6}
                        stroke={C.cyan}
                        strokeWidth="1.5"
                        markerEnd="url(#recurseArrow)"
                      />
                      <text x={xMid + 12} y={yStart + (yEnd - yStart) / 2 + 4} fill="#80deea" fontSize="11">
                        If chunk too big
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <marker
                    id="recurseArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,8 L8,4 z" fill={C.cyan} />
                  </marker>
                </defs>
              </svg>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                The Recursive Rule
              </T>
              <T color="#80deea" center size={14} style={{ marginTop: 10 }}>
                Recursive = try the most structural separator first; only fall back if the resulting chunk still exceeds
                the size limit.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.cyan}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#80deea",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Separators = [&quot;\n\n&quot;, &quot;\n&quot;, &quot;. &quot;, &quot; &quot;]
              </div>
              <T color="rgba(255,255,255,0.5)" center size={12} style={{ marginTop: 10 }}>
                The newline character &quot;\n&quot; is what the writer typed to end a line. Two newlines mark a
                paragraph boundary.
              </T>
            </div>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Fixed-Size Breaks Doc-7 In The Wrong Places
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            doc-7 is a login troubleshooting article with three distinct topic sections. Apply fixed-size chunking with
            size=128 and overlap=0 and the cuts ignore the section structure entirely. One chunk ends up mixing
            unrelated topics across the topic boundary.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              color: "#a5d6a7",
              lineHeight: 1.7,
              textAlign: "left",
            }}
          >
            doc-7 (Login Troubleshooting, markdown, ~380 tokens):
            <br />
            <br />
            ## Common Login Errors
            <br />
            Wrong password is the most common cause - the form returns &quot;invalid credentials&quot; without saying
            which field failed. Account locked appears after five failed attempts in fifteen minutes. Session expired
            shows up when an idle tab is reopened after the cookie TTL.
            <br />
            <br />
            ## Browser Compatibility
            <br />
            Safari blocks third-party cookies by default which breaks the SSO redirect. Chrome with strict tracking
            protection has the same effect. The fix is to add the auth domain to the site exceptions list.
            <br />
            <br />
            ## Resetting Account Lockout
            <br />
            Open the account-admin panel and search by user email. Click reset lockout and confirm. The user can log in
            immediately - no email round-trip required. Audit log captures the admin action with a timestamp.
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}12`,
              border: `1px solid ${C.red}30`,
            }}
          >
            <T color={C.red} bold center size={16}>
              Fixed-Size Chunks On doc-7 (Size = 128, Overlap = 0)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Chunk 1 (tokens 0-128): All of &quot;Common Login Errors&quot;
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  Wrong password, account locked, session expired - one clean topic.
                </T>
              </div>
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}24`,
                  border: `1px solid ${C.red}60`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Chunk 2 (tokens 128-256): Tail of &quot;Browser Compatibility&quot; + head of &quot;Account
                  Lockout&quot;
                </T>
                <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                  Spans two unrelated topics. A retrieval query for &quot;Safari cookie SSO&quot; matches this chunk,
                  but the answer is half-Safari, half-lockout-admin. Neither topic is retrievable cleanly.
                </T>
              </div>
              <div
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Chunk 3 (tokens 256-380): Tail of &quot;Resetting Account Lockout&quot;
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  Missing the heading, missing the first sentence - the topic context is gone.
                </T>
              </div>
            </div>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 12 }}>
              Chunk 2 mixes browser compatibility with account lockout - retrieval cannot answer either cleanly.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Recursive Structural Splits The Same Doc Cleanly
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Same doc-7. Recursive structural chunking sees three top-level headings and uses the heading break first.
            Each resulting chunk fits under 128 tokens and contains exactly one topic. No section spans a chunk
            boundary.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#b8a9ff",
            }}
          >
            chunks = recursive_structural(doc-7, separators=[&quot;\n## &quot;, &quot;\n\n&quot;, &quot;\n&quot;,
            &quot;. &quot;, &quot; &quot;], size=128)
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}12`,
                border: `1px solid ${C.cyan}40`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 1 (~120 tokens) - Common Login Errors
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 6 }}>
                ## Common Login Errors. Wrong password is the most common cause... Account locked appears after five
                failed attempts... Session expired shows up when an idle tab is reopened.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.orange}12`,
                border: `1px solid ${C.orange}40`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Chunk 2 (~95 tokens) - Browser Compatibility
              </T>
              <T color="#ffcc80" center size={13} style={{ marginTop: 6 }}>
                ## Browser Compatibility. Safari blocks third-party cookies... Chrome with strict tracking protection
                has the same effect. The fix is to add the auth domain to the site exceptions list.
              </T>
            </div>
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.green}12`,
                border: `1px solid ${C.green}40`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Chunk 3 (~115 tokens) - Resetting Account Lockout
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
                ## Resetting Account Lockout. Open the account-admin panel... click reset lockout and confirm... Audit
                log captures the admin action with a timestamp.
              </T>
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
              3 chunks, each is exactly one topic. Retrieval matches the topic cleanly: a Safari cookie query goes to
              chunk 2 and nowhere else.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            If A Section Is Too Big, Recurse Into Paragraphs
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Sometimes a single section blows past the size limit. doc-12 (API keys reference) has an
            &quot;Authentication Header Format&quot; section that runs 300 tokens - more than double the 128-token
            target. Recursion handles it cleanly: heading split first, see the chunk is still too big, then fall back to
            paragraph break.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Recursion Trace On doc-12 Section
              </T>
              <svg viewBox="0 0 520 320" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Recursion trace tree showing doc-12 API keys section at 300 tokens being split by paragraph break into
                  three sub-chunks of 100, 110, and 90 tokens that each fit the 128-token target.
                </desc>
                {/* Step 1: heading-level node at top */}
                <rect
                  x="100"
                  y="16"
                  width="320"
                  height="56"
                  rx="8"
                  fill={`${C.red}18`}
                  stroke={C.red}
                  strokeWidth="1.5"
                />
                <text x="260" y="38" textAnchor="middle" fill="#ef9a9a" fontSize="13" fontWeight="bold">
                  doc-12 # &quot;Authentication Header Format&quot;
                </text>
                <text x="260" y="58" textAnchor="middle" fill="#ef9a9a" fontSize="12">
                  300 tokens - too big (limit 128)
                </text>
                {/* Arrow down with label "Recurse: try \n\n" */}
                <line
                  x1="260"
                  y1="72"
                  x2="260"
                  y2="116"
                  stroke={C.orange}
                  strokeWidth="1.5"
                  markerEnd="url(#recurseArrow2)"
                />
                <text x="276" y="98" fill="#ffcc80" fontSize="11">
                  Recurse: try &quot;\n\n&quot;
                </text>
                {/* Step 2: three paragraph sub-chunks */}
                {[
                  { x: 40, label: "Para 1", tokens: 100 },
                  { x: 200, label: "Para 2", tokens: 110 },
                  { x: 360, label: "Para 3", tokens: 90 },
                ].map((p) => (
                  <g key={p.label}>
                    <rect
                      x={p.x}
                      y="124"
                      width="120"
                      height="56"
                      rx="8"
                      fill={`${C.green}18`}
                      stroke={C.green}
                      strokeWidth="1.5"
                    />
                    <text x={p.x + 60} y="146" textAnchor="middle" fill="#a5d6a7" fontSize="13" fontWeight="bold">
                      {p.label}
                    </text>
                    <text x={p.x + 60} y="166" textAnchor="middle" fill="#a5d6a7" fontSize="12">
                      {p.tokens} tokens - fits
                    </text>
                  </g>
                ))}
                {/* Connector lines from heading node to each paragraph */}
                {[100, 260, 420].map((cx, i) => (
                  <line
                    key={`conn-${i}`}
                    x1="260"
                    y1="116"
                    x2={cx}
                    y2="124"
                    stroke={C.orange}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                ))}
                {/* Decision row */}
                <text x="260" y="208" textAnchor="middle" fill="#ffcc80" fontSize="12" fontWeight="bold">
                  Each sub-chunk &le; 128 - stop recursing.
                </text>
                <text x="260" y="228" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  If a paragraph were still &gt; 128, recursion would try &quot;. &quot; (sentence) next, then &quot;
                  &quot; (word).
                </text>
                {/* Three final emitted chunks */}
                {[
                  { x: 40, label: "Chunk A", tokens: 100 },
                  { x: 200, label: "Chunk B", tokens: 110 },
                  { x: 360, label: "Chunk C", tokens: 90 },
                ].map((p) => (
                  <g key={`out-${p.label}`}>
                    <rect
                      x={p.x}
                      y="248"
                      width="120"
                      height="56"
                      rx="8"
                      fill={`${C.cyan}18`}
                      stroke={C.cyan}
                      strokeWidth="1.5"
                    />
                    <text x={p.x + 60} y="270" textAnchor="middle" fill="#80deea" fontSize="13" fontWeight="bold">
                      {p.label}
                    </text>
                    <text x={p.x + 60} y="290" textAnchor="middle" fill="#80deea" fontSize="12">
                      Emit ({p.tokens} tok)
                    </text>
                  </g>
                ))}
                <defs>
                  <marker
                    id="recurseArrow2"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,8 L8,4 z" fill={C.orange} />
                  </marker>
                </defs>
              </svg>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Step-By-Step Trace
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 1: Try heading split
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    The &quot;Authentication Header Format&quot; section comes out at 300 tokens. Limit is 128. Too big.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 2: Fall back to paragraph break &quot;\n\n&quot;
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    The section has three paragraphs of 100, 110, and 90 tokens. Each fits under 128.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.orange}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={13}>
                    Step 3: Emit three chunks
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 4 }}>
                    Recursion stops as soon as every produced chunk fits. No need to drop to sentence or word splits.
                  </T>
                </div>
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 12 }}>
                The recursion goes deeper only when needed. Most chunks stop at the paragraph level.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recursive Structural: The 80% Baseline
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Recursive structural is the default chunker in every major RAG framework. It covers around 80% of production
            cases out of the box. Knowing where it wins - and where it does not - frames every later chunking strategy.
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
                Pros
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
                {RECURSIVE_PROS.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>+</span>
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
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Cons
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
                {RECURSIVE_CONS.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}12`,
                      border: `1px solid ${C.red}24`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: C.red, fontWeight: 700, fontSize: 14 }}>-</span>
                    <T color="#ef9a9a" size={13}>
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
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Chapter 12.9 fixes the semantic-boundary gap. Chapter 12.11 fixes the parent-child gap.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// 12.9 Semantic Chunking - cosine-similarity-based topic-shift detection

const SEMANTIC_SENTENCES = [
  {
    id: "s1",
    text: "Creating an API key starts in the developer settings page.",
    cluster: "create",
    vec: [0.82, 0.14, 0.46, 0.71, 0.09, 0.55, 0.23, 0.66],
  },
  {
    id: "s2",
    text: "Click the New Key button and provide a human-readable label.",
    cluster: "create",
    vec: [0.84, 0.18, 0.49, 0.68, 0.11, 0.58, 0.21, 0.69],
  },
  {
    id: "s3",
    text: "The label appears in audit logs to identify which app created traffic.",
    cluster: "create",
    vec: [0.81, 0.15, 0.51, 0.7, 0.13, 0.56, 0.25, 0.65],
  },
  {
    id: "s4",
    text: "Choose a scope from the dropdown to restrict which endpoints the key can call.",
    cluster: "create",
    vec: [0.83, 0.12, 0.47, 0.74, 0.08, 0.6, 0.22, 0.67],
  },
  {
    id: "s5",
    text: "Optional expiry sets a date after which the key stops working.",
    cluster: "create",
    vec: [0.85, 0.16, 0.48, 0.69, 0.1, 0.54, 0.27, 0.68],
  },
  {
    id: "s6",
    text: "Click Generate and the key value is shown one time only - copy it now.",
    cluster: "create",
    vec: [0.86, 0.13, 0.5, 0.72, 0.12, 0.57, 0.24, 0.7],
  },
  {
    id: "s7",
    text: "Revoking an API key is done from the same developer settings page.",
    cluster: "revoke",
    vec: [0.21, 0.78, 0.16, 0.34, 0.74, 0.18, 0.69, 0.27],
  },
  {
    id: "s8",
    text: "Find the key by its label in the active keys list.",
    cluster: "revoke",
    vec: [0.23, 0.81, 0.14, 0.31, 0.77, 0.2, 0.71, 0.29],
  },
  {
    id: "s9",
    text: "Click the trash icon on the row to mark the key as revoked.",
    cluster: "revoke",
    vec: [0.19, 0.79, 0.17, 0.36, 0.72, 0.22, 0.68, 0.31],
  },
  {
    id: "s10",
    text: "Revocation takes effect within sixty seconds of the click.",
    cluster: "revoke",
    vec: [0.25, 0.83, 0.12, 0.33, 0.75, 0.19, 0.7, 0.28],
  },
  {
    id: "s11",
    text: "Any in-flight requests using that key will return 401 once propagation completes.",
    cluster: "revoke",
    vec: [0.22, 0.8, 0.15, 0.35, 0.76, 0.21, 0.72, 0.3],
  },
  {
    id: "s12",
    text: "Revoked keys remain in the audit log forever for compliance review.",
    cluster: "revoke",
    vec: [0.24, 0.82, 0.13, 0.32, 0.78, 0.17, 0.73, 0.26],
  },
];

// Pre-computed cosine similarity between adjacent sentences (boundary i is between sentence i and i+1).
// Within-cluster pairs sit at 0.85-0.92, the create-to-revoke shift at boundary 6-7 dips to 0.41.
const SEMANTIC_BOUNDARIES = [
  { idx: 1, label: "1-2", sim: 0.91 },
  { idx: 2, label: "2-3", sim: 0.89 },
  { idx: 3, label: "3-4", sim: 0.87 },
  { idx: 4, label: "4-5", sim: 0.9 },
  { idx: 5, label: "5-6", sim: 0.88 },
  { idx: 6, label: "6-7", sim: 0.41 },
  { idx: 7, label: "7-8", sim: 0.86 },
  { idx: 8, label: "8-9", sim: 0.85 },
  { idx: 9, label: "9-10", sim: 0.91 },
  { idx: 10, label: "10-11", sim: 0.83 },
  { idx: 11, label: "11-12", sim: 0.9 },
];

export const SemanticChunking = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            What If The Doc Has No Structural Markers?
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            doc-12 is an API keys reference - but this version is pure flowing prose. No headings, no bullet lists, no
            blank-line separators. Six paragraphs of plain narrative. Recursive structural chunking falls all the way
            through paragraph break, line break, sentence break, and lands on word splits - essentially fixed-size.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                doc-12 (Flat Narrative, No Markers)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.cyan}12`,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  color: "#80deea",
                  lineHeight: 1.7,
                  textAlign: "left",
                }}
              >
                Creating an API key starts in the developer settings page. Click the New Key button and provide a
                human-readable label. The label appears in audit logs to identify which app created traffic. Choose a
                scope from the dropdown to restrict which endpoints the key can call. Optional expiry sets a date after
                which the key stops working. Click Generate and the key value is shown one time only - copy it now.
                Revoking an API key is done from the same developer settings page. Find the key by its label in the
                active keys list. Click the trash icon on the row to mark the key as revoked. Revocation takes effect
                within sixty seconds of the click. Any in-flight requests using that key will return 401 once
                propagation completes. Revoked keys remain in the audit log forever for compliance review.
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
                Twelve sentences. First six are about creating a key. Last six are about revoking a key. The topic shift
                lives in the middle - and nothing in the markup tells the splitter where.
              </T>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                The Structural Gap
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    No Headings
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    No ##, no #, no markdown structure to anchor on.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    No Blank Lines
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    No double newline. Recursive splitter sees one long paragraph.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold center size={13}>
                    Topic Shift Is Invisible
                  </T>
                  <T color="#ef9a9a" center size={12} style={{ marginTop: 4 }}>
                    The creating-to-revoking switch is a semantic boundary with no surface marker. Structural splitter
                    cuts mid-topic at the 128-token mark.
                  </T>
                </div>
              </div>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 12 }}>
                Need a chunker that reads meaning, not markup.
              </T>
            </div>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step 1: Embed Every Sentence Independently
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Split doc-12 into individual sentences using a sentence tokenizer (period-plus-space heuristic, or a real
            NLP library). Twelve sentences come out. Send each sentence through the embedding model and get back a
            vector. Now we have 12 vectors that capture the meaning of each sentence.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#a5d6a7",
            }}
          >
            embed(sentence_i) -&gt; v_i &nbsp;&nbsp;|&nbsp;&nbsp; 12 sentences → 12 vectors
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              columnGap: 12,
              rowGap: 6,
              alignItems: "center",
            }}
          >
            {SEMANTIC_SENTENCES.map((s) => {
              const isCreate = s.cluster === "create";
              const labelColor = isCreate ? C.cyan : C.orange;
              const labelText = isCreate ? "#80deea" : "#ffcc80";
              return (
                <div key={s.id} style={{ display: "contents" }}>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${labelColor}12`,
                      border: `1px solid ${labelColor}30`,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: labelColor, fontWeight: 700, fontSize: 12, minWidth: 28 }}>{s.id}:</span>
                    <T color={labelText} size={13}>
                      {s.text}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${labelColor}30`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      fontSize: 11,
                      color: labelText,
                      whiteSpace: "nowrap",
                    }}
                  >
                    [{s.vec.map((v) => v.toFixed(2)).join(", ")}]
                  </div>
                </div>
              );
            })}
          </div>

          <T color="rgba(255,255,255,0.55)" center size={13} style={{ marginTop: 12 }}>
            Sentences s1-s6 (cyan) all talk about creating - their vectors point in similar directions. Sentences s7-s12
            (orange) all talk about revoking - their vectors point in a different direction. The 8-dim vectors above are
            illustrative; production models use 768 or 1536 dims.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Step 2: Plot Cosine Similarity Between Adjacent Sentences
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            For each pair of adjacent sentences, compute cosine similarity between their vectors. Plot it along the doc.
            Inside a topic cluster the similarity stays high (0.85-0.92). At the topic shift between sentence 6
            (creating) and sentence 7 (revoking), it drops to 0.41. Set a threshold like 0.7 - any boundary below the
            threshold is a chunk break.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Cosine Similarity Across The Doc
            </T>
            {/*
              SVG geometry: viewBox 0 0 640 320.
              Chart area: x from 80 to 600 (width 520), y from 30 to 240 (height 210).
              11 boundary points at x = 80 + (i-1) * (520/10) for i in 1..11.
            */}
            <svg viewBox="0 0 640 320" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Line chart of cosine similarity between adjacent sentences along a 12-sentence document. Similarity
                stays around 0.85-0.92 within the creating cluster (boundaries 1-2 through 5-6) then drops sharply to
                0.41 at boundary 6-7 (the shift to revoking) before climbing back to 0.83-0.91 for the revoking cluster
                (boundaries 7-8 through 11-12). A red dashed horizontal threshold line at 0.7 marks the chunk-break
                cutoff.
              </desc>
              {/* Y axis grid + ticks at 0.0, 0.25, 0.5, 0.75, 1.0 */}
              {[0, 0.25, 0.5, 0.75, 1].map((v) => {
                const y = 240 - v * 210;
                return (
                  <g key={`y-${v}`}>
                    <line x1="80" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <text x="72" y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.55)" fontSize="11">
                      {v.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {/* X axis tick labels */}
              {SEMANTIC_BOUNDARIES.map((b, i) => {
                const x = 80 + i * (520 / 10);
                return (
                  <text
                    key={`x-${b.label}`}
                    x={x}
                    y={262}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.55)"
                    fontSize="11"
                  >
                    {b.label}
                  </text>
                );
              })}
              {/* Axis lines */}
              <line x1="80" y1="240" x2="600" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <line x1="80" y1="30" x2="80" y2="240" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              {/* Threshold line at 0.7 */}
              <line
                x1="80"
                y1={240 - 0.7 * 210}
                x2="600"
                y2={240 - 0.7 * 210}
                stroke={C.red}
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text x={596} y={240 - 0.7 * 210 - 6} textAnchor="end" fill="#ef9a9a" fontSize="12" fontWeight="bold">
                Threshold = 0.7
              </text>
              {/* Polyline through the boundary points */}
              <polyline
                fill="none"
                stroke={C.purple}
                strokeWidth="2"
                points={SEMANTIC_BOUNDARIES.map((b, i) => {
                  const x = 80 + i * (520 / 10);
                  const y = 240 - b.sim * 210;
                  return `${x},${y}`;
                }).join(" ")}
              />
              {/* Data points + per-point similarity labels */}
              {SEMANTIC_BOUNDARIES.map((b, i) => {
                const x = 80 + i * (520 / 10);
                const y = 240 - b.sim * 210;
                const isBreak = b.sim < 0.7;
                const fill = isBreak ? C.red : C.purple;
                return (
                  <g key={`pt-${b.label}`}>
                    <circle cx={x} cy={y} r={isBreak ? 6 : 4} fill={fill} stroke="#08080d" strokeWidth="1" />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fill={isBreak ? "#ef9a9a" : "#b8a9ff"}
                      fontSize={isBreak ? 12 : 10}
                      fontWeight={isBreak ? "bold" : "normal"}
                    >
                      {b.sim.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              {/* Axis labels */}
              <text x={340} y={290} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="13" fontWeight="bold">
                Sentence Boundary
              </text>
              <text
                x={24}
                y={135}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="13"
                fontWeight="bold"
                transform="rotate(-90 24 135)"
              >
                Cosine Similarity
              </text>
              {/* Callout arrow over the drop */}
              <text
                x={80 + 5 * (520 / 10)}
                y={240 - 0.41 * 210 + 28}
                textAnchor="middle"
                fill="#ef9a9a"
                fontSize="12"
                fontWeight="bold"
              >
                Dip below threshold → chunk break
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            For i in 1..11: sim_i = cosine(v_i, v_i+1). If sim_i &lt; 0.7 → emit chunk break at boundary i.
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 3: Each Cluster Of High-Similarity Sentences = One Chunk
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            One boundary fell below the threshold (boundary 6-7 at sim 0.41). That single break splits the doc into
            exactly 2 chunks. Sentences 1-6 form the creating chunk; sentences 7-12 form the revoking chunk. The chunker
            found the topic shift even though no heading, no blank line, and no markup hinted at it.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={16}>
                Two Chunks From The Cosine Dip
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}40`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold center size={14}>
                    Chunk 1 - Creating Cluster (Sentences 1-6)
                  </T>
                  <T color="#a5d6a7" center size={12} style={{ marginTop: 6 }}>
                    Creating an API key starts in the developer settings page. Click the New Key button and provide a
                    label. The label appears in audit logs. Choose a scope. Optional expiry sets a date. Click Generate
                    and the key value is shown one time only.
                  </T>
                </div>
                <div
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px dashed ${C.red}40`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" bold size={12}>
                    Chunk Break (Boundary 6-7, sim = 0.41)
                  </T>
                </div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}40`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} bold center size={14}>
                    Chunk 2 - Revoking Cluster (Sentences 7-12)
                  </T>
                  <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                    Revoking an API key is done from the same developer settings page. Find the key by its label. Click
                    the trash icon. Revocation takes effect within sixty seconds. In-flight requests return 401 after
                    propagation. Revoked keys remain in the audit log for compliance.
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={16}>
                The Win
              </T>
              <T color="#ffcc80" center size={14} style={{ marginTop: 10 }}>
                Semantic chunking found the topic shift that structural chunking would miss - even though there are no
                headings, no double newlines, no markers of any kind.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.orange}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={13}>
                  Retrieval Behavior
                </T>
                <T color="#ffcc80" center size={12} style={{ marginTop: 6 }}>
                  A query for &quot;how do I revoke a key&quot; matches chunk 2 cleanly. A query for &quot;creating a
                  scoped key&quot; matches chunk 1. Neither chunk mixes the two sub-topics.
                </T>
              </div>
              <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
                Structural chunkers would have cut at the 128-token mark - somewhere inside sentence 5 or 6 - and
                emitted a chunk that mixes &quot;optional expiry&quot; with &quot;revoking the key&quot;.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            The Cost: Embed-Before-Chunk Is 10-50x More Expensive
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Semantic chunking has to embed every sentence before it can decide where to chunk. That makes it an order of
            magnitude (or more) slower and costlier than structural chunking, where chunk-time work is just string
            splitting. Then you still re-embed the final chunks for the index.
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
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Structural / Fixed-Size
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 10 }}>
                Per doc: 1 pass of string-splitting. About 0.1 ms. Embedding cost at chunk time is $0 - embedding
                happens later, once, on the final chunks.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Cost At Chunk Time
                </T>
                <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                  $0 - pure CPU string ops.
                </T>
              </div>
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
              <T color={C.red} bold center size={16}>
                Semantic
              </T>
              <T color="#ef9a9a" center size={13} style={{ marginTop: 10 }}>
                Per doc: split into sentences (about 0.5 ms) + embed each sentence (about 5 ms per sentence times 12 =
                about 60 ms) + cosine math (about 0.1 ms). At $0.10 per million tokens, a 30-doc corpus chunked
                semantically costs about $0.04.
              </T>
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  Cost At Production Scale
                </T>
                <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
                  At 10M docs, that&apos;s about $13,000 just to chunk. Then you re-embed the final chunks for the
                  index.
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Use semantic chunking when retrieval quality matters more than indexing budget, and when structural
              markers are absent.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ─── 12.10 Late Chunking (Jina 2024) ───

// Sub=3 retrieval-score rows: two passes, same query, same 3 chunks, different vectors.
const LATE_CHUNKING_SCORES = [
  {
    method: "Chunk-Then-Embed (Baseline)",
    methodColor: "red",
    rows: [
      { chunk: "Chunk 1 (Mentions Sarah, Forgets Password)", score: 0.78, isTop: true },
      { chunk: "Chunk 2 (Token Generation, Email Send)", score: 0.65, isTop: false },
      { chunk: "Chunk 3 (Link Expiry, 'She' Re-Request)", score: 0.34, isTop: false },
    ],
    note: 'Top-1 is chunk 1. Misses the actual answer. The "she" vector in chunk 3 has no idea who "she" is.',
  },
  {
    method: "Late Chunking (Jina 2024)",
    methodColor: "green",
    rows: [
      { chunk: "Chunk 1 (Mentions Sarah, Forgets Password)", score: 0.72, isTop: false },
      { chunk: "Chunk 2 (Token Generation, Email Send)", score: 0.68, isTop: false },
      { chunk: "Chunk 3 (Link Expiry, 'She' Re-Request)", score: 0.81, isTop: true },
    ],
    note: 'Top-1 is chunk 3. Hits the answer. The chunk-3 token hidden states attended to "Sarah" in chunk 1 before pooling.',
  },
];

// Sub=4 pros/cons cards.
const LATE_CHUNKING_WINS = [
  "Preserves cross-chunk pronouns and references (anaphora resolution).",
  "Single embedding pass equals same compute as chunk-then-embed for the same doc.",
  "Significant recall gains on docs with anaphora (he, she, it, this, that, the X).",
  "Released 2024 by Jina AI for the jina-embeddings-v2 model family.",
];

const LATE_CHUNKING_LIMITS = [
  "Requires an embedding model that exposes token-level hidden states (most OpenAI / Cohere APIs return only the pooled final vector - you cannot late-chunk with them).",
  "Requires the whole doc to fit in one embedding pass (8K-32K token ceilings).",
  "Pooling strategy matters (mean-pool vs CLS vs attention-weighted - jina-embeddings-v2 uses mean-pool).",
];

export const LateChunking = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Chunk-Then-Embed Loses Cross-Chunk Context
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            doc-1 is the password-reset article. Split it into 3 chunks. Chunk 1 names &quot;Sarah&quot; and sets up the
            reset flow. Chunk 3 uses the pronoun &quot;she&quot; with no antecedent. When you embed each chunk on its
            own, the chunk-3 vector has zero knowledge that &quot;she&quot; refers to Sarah from chunk 1. The cross-
            chunk reference is lost the moment the chunker scissored the doc apart.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 1 (Tokens 0-128)
              </T>
              <T color="#80deea" center size={12} style={{ marginTop: 8 }}>
                When a user named <span style={{ color: C.green, fontWeight: 700 }}>Sarah</span> forgets her password,
                the system generates a one-time token. The reset flow begins on the login page when she clicks the
                Forgot Password link.
              </T>
              <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 8 }}>
                Antecedent lives here: &quot;Sarah&quot;.
              </T>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Chunk 2 (Tokens 128-256)
              </T>
              <T color="#80deea" center size={12} style={{ marginTop: 8 }}>
                The token is hashed, stored in the password_reset_tokens table, and emailed as a single-use link. The
                email subject reads &quot;Reset Your Password&quot; and arrives within thirty seconds.
              </T>
              <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 8 }}>
                No mention of who requested it.
              </T>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Chunk 3 (Tokens 256-384)
              </T>
              <T color="#ef9a9a" center size={12} style={{ marginTop: 8 }}>
                The link expires after 24 hours; <span style={{ color: C.red, fontWeight: 700 }}>she</span> must request
                a new one if <span style={{ color: C.red, fontWeight: 700 }}>she</span> misses the window. The old token
                is invalidated immediately on reuse.
              </T>
              <T color="#ef9a9a" center size={11} style={{ marginTop: 8 }}>
                Pronoun &quot;she&quot; has no antecedent in this chunk. The vector matches she/her queries weakly.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Cross-chunk references are not just a corner case. Any doc with pronouns, &quot;the system&quot;, &quot;
              this approach&quot;, &quot;that field&quot; - which is basically every prose doc - bleeds context the
              moment you slice it.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Chunk-Then-Embed Vs. Embed-Then-Chunk
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Two orderings of the same operations. The first chunks the doc, then runs the embedding model on each chunk
            in isolation. The second runs the embedding model on the whole doc first - so attention links every token to
            every other token - then pools the token hidden states into chunk vectors at the chunk boundaries. Same
            compute, vastly different vectors.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Chunk-Then-Embed (Baseline)
              </T>
              <svg viewBox="0 0 320 260" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Chunk-then-embed flow: a horizontal doc bar is sliced into three colored chunk segments, each chunk
                  feeding its own arrow into a separate embedding-model box, producing three chunk vectors v1, v2, v3
                  where each pass sees only its own tokens.
                </desc>
                {/* Doc bar at top, viewBox width 320, bar width 280, x_start = (320-280)/2 = 20 */}
                <rect
                  x="20"
                  y="14"
                  width="280"
                  height="22"
                  fill="rgba(255,255,255,0.06)"
                  stroke={C.red}
                  strokeWidth="1"
                  rx="3"
                />
                <text x="160" y="29" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                  doc-1 (384 tokens)
                </text>
                {/* 3 chunk segments below */}
                {[0, 1, 2].map((i) => {
                  const x = 20 + i * (280 / 3) + 6;
                  const w = 280 / 3 - 12;
                  return (
                    <g key={`chunk-${i}`}>
                      <rect
                        x={x}
                        y="50"
                        width={w}
                        height="26"
                        fill={`${C.red}24`}
                        stroke={C.red}
                        strokeWidth="1.2"
                        rx="4"
                      />
                      <text x={x + w / 2} y="67" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="bold">
                        Chunk {i + 1}
                      </text>
                      {/* Down arrow to embedding box */}
                      <line
                        x1={x + w / 2}
                        y1="80"
                        x2={x + w / 2}
                        y2="106"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${x + w / 2 - 4},102 ${x + w / 2 + 4},102 ${x + w / 2},110`}
                        fill="rgba(255,255,255,0.55)"
                      />
                      {/* Embedding model box (separate per chunk) */}
                      <rect
                        x={x}
                        y="112"
                        width={w}
                        height="34"
                        fill={`${C.red}12`}
                        stroke={C.red}
                        strokeWidth="1"
                        rx="4"
                      />
                      <text x={x + w / 2} y="128" textAnchor="middle" fill="#ef9a9a" fontSize="10" fontWeight="bold">
                        Embed
                      </text>
                      <text x={x + w / 2} y="140" textAnchor="middle" fill="#ef9a9a" fontSize="9">
                        (Chunk Only)
                      </text>
                      {/* Down arrow to vector */}
                      <line
                        x1={x + w / 2}
                        y1="150"
                        x2={x + w / 2}
                        y2="176"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${x + w / 2 - 4},172 ${x + w / 2 + 4},172 ${x + w / 2},180`}
                        fill="rgba(255,255,255,0.55)"
                      />
                      {/* Chunk vector */}
                      <rect
                        x={x}
                        y="182"
                        width={w}
                        height="22"
                        fill={`${C.red}30`}
                        stroke={C.red}
                        strokeWidth="1"
                        rx="3"
                      />
                      <text x={x + w / 2} y="197" textAnchor="middle" fill="#ef9a9a" fontSize="10" fontWeight="bold">
                        v{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x="160" y="232" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  3 Separate Passes
                </text>
                <text x="160" y="248" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="bold">
                  Each Vector Sees Only Its Own Chunk
                </text>
              </svg>
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
              <T color={C.green} bold center size={16}>
                Late Chunking (Embed-Then-Chunk)
              </T>
              <svg viewBox="0 0 320 260" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
                <desc>
                  Late chunking flow: a horizontal doc bar feeds a single embedding-model box that runs whole-doc
                  attention across all tokens, producing a token-hidden-state row, which is then mean-pooled at chunk
                  boundaries to produce three chunk vectors v_chunk1, v_chunk2, v_chunk3.
                </desc>
                {/* Doc bar */}
                <rect
                  x="20"
                  y="14"
                  width="280"
                  height="22"
                  fill="rgba(255,255,255,0.06)"
                  stroke={C.green}
                  strokeWidth="1"
                  rx="3"
                />
                <text x="160" y="29" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                  doc-1 (384 tokens)
                </text>
                {/* Arrow to single embedding pass */}
                <line x1="160" y1="40" x2="160" y2="56" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
                <polygon points="156,52 164,52 160,60" fill="rgba(255,255,255,0.55)" />
                {/* Single embedding model box */}
                <rect
                  x="20"
                  y="62"
                  width="280"
                  height="38"
                  fill={`${C.green}12`}
                  stroke={C.green}
                  strokeWidth="1.4"
                  rx="5"
                />
                <text x="160" y="79" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                  Single Embedding Pass
                </text>
                <text x="160" y="93" textAnchor="middle" fill="#a5d6a7" fontSize="10">
                  Attention Over All 384 Tokens
                </text>
                {/* Arrow down to token-hidden-state strip */}
                <line x1="160" y1="104" x2="160" y2="120" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
                <polygon points="156,116 164,116 160,124" fill="rgba(255,255,255,0.55)" />
                {/* Token hidden-state strip - 12 small cells */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const w = 280 / 12;
                  const x = 20 + i * w;
                  return (
                    <rect
                      key={`tok-${i}`}
                      x={x + 1}
                      y="126"
                      width={w - 2}
                      height="18"
                      fill={`${C.green}30`}
                      stroke={C.green}
                      strokeWidth="0.8"
                      rx="2"
                    />
                  );
                })}
                <text x="160" y="159" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">
                  Token Hidden States (N x Hidden_Dim)
                </text>
                {/* Mean-pool boundaries: 3 segments */}
                <line
                  x1={20 + 280 / 3}
                  y1="124"
                  x2={20 + 280 / 3}
                  y2="146"
                  stroke={C.yellow}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <line
                  x1={20 + (2 * 280) / 3}
                  y1="124"
                  x2={20 + (2 * 280) / 3}
                  y2="146"
                  stroke={C.yellow}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                {/* Arrow down to chunk vectors */}
                <line x1="160" y1="166" x2="160" y2="180" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
                <polygon points="156,176 164,176 160,184" fill="rgba(255,255,255,0.55)" />
                <text x="160" y="172" textAnchor="middle" fill="#fff59d" fontSize="9" fontWeight="bold">
                  Mean-Pool At Boundaries
                </text>
                {/* 3 chunk vectors */}
                {[0, 1, 2].map((i) => {
                  const x = 20 + i * (280 / 3) + 6;
                  const w = 280 / 3 - 12;
                  return (
                    <g key={`v-${i}`}>
                      <rect
                        x={x}
                        y="190"
                        width={w}
                        height="22"
                        fill={`${C.green}30`}
                        stroke={C.green}
                        strokeWidth="1"
                        rx="3"
                      />
                      <text x={x + w / 2} y="205" textAnchor="middle" fill="#a5d6a7" fontSize="10" fontWeight="bold">
                        v_chunk{i + 1}
                      </text>
                    </g>
                  );
                })}
                <text x="160" y="232" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">
                  1 Pass + Pool
                </text>
                <text x="160" y="248" textAnchor="middle" fill="#a5d6a7" fontSize="11" fontWeight="bold">
                  Every Chunk Vector Sees The Whole Doc
                </text>
              </svg>
            </div>
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
              fontSize: 13,
              color: "#a5d6a7",
            }}
          >
            Baseline: v_i = embed(chunk_i) &nbsp;&nbsp;|&nbsp;&nbsp; Late: H = embed_tokens(doc); v_chunk_i =
            mean-pool(H[chunk_i.start : chunk_i.end])
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Late Chunking On Doc-1: Chunk 3&apos;s Vector Now Encodes Sarah
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Trace the same 3-chunk doc-1 through the late-chunking pipeline. The embedding model runs once over all 384
            tokens. Attention links every token to every other token. The hidden state for the pronoun &quot;she&quot;
            in chunk 3 has attended to &quot;Sarah&quot; in chunk 1. When we mean-pool the chunk-3 token hidden states,
            the resulting v_chunk3 still carries the Sarah signal.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Single Attention Pass Over The Full Doc
            </T>
            {/*
              SVG geometry: viewBox 0 0 640 280.
              Token row width 600, x_start = (640-600)/2 = 20.
              12 tokens, each 50 wide. Pool boundaries at token 4 (x=220) and token 8 (x=420).
            */}
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Token-attention sweep diagram over doc-1 password reset showing a single attention arc covering all
                tokens, with mean-pool boundaries at token positions 128 and 256 producing three chunk vectors, with
                annotation that chunk 3&apos;s vector still encodes &apos;Sarah&apos; from chunk 1.
              </desc>
              {/* Sweeping attention arc from token 1 to token N */}
              <path d="M 45 80 Q 320 10 595 80" fill="none" stroke={C.purple} strokeWidth="2" strokeDasharray="6 3" />
              <text x="320" y="22" textAnchor="middle" fill={C.purple} fontSize="13" fontWeight="bold">
                Single Attention Pass (Token 1 To Token N)
              </text>
              {/* Down arrows from the arc onto tokens 1 and N */}
              <polygon points="41,78 49,78 45,86" fill={C.purple} />
              <polygon points="591,78 599,78 595,86" fill={C.purple} />
              {/* 12 token cells, x_start=20, w=50 each, total 600 */}
              {Array.from({ length: 12 }).map((_, i) => {
                const x = 20 + i * 50;
                const isSarah = i === 0;
                const isShe = i === 9;
                const chunk = i < 4 ? 1 : i < 8 ? 2 : 3;
                const baseColor = chunk === 1 ? C.cyan : chunk === 2 ? C.blue : C.orange;
                return (
                  <g key={`token-${i}`}>
                    <rect
                      x={x + 2}
                      y="94"
                      width="46"
                      height="32"
                      fill={isSarah || isShe ? `${baseColor}40` : `${baseColor}18`}
                      stroke={baseColor}
                      strokeWidth={isSarah || isShe ? "1.5" : "1"}
                      rx="3"
                    />
                    <text x={x + 25} y="114" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
                      {isSarah ? "Sarah" : isShe ? "she" : `t${i + 1}`}
                    </text>
                    {/* Hidden state cell below each token */}
                    <rect
                      x={x + 6}
                      y="134"
                      width="38"
                      height="14"
                      fill={`${baseColor}25`}
                      stroke={baseColor}
                      strokeWidth="0.8"
                      rx="2"
                    />
                    <text x={x + 25} y="145" textAnchor="middle" fill="#fff" fontSize="9">
                      h{i + 1}
                    </text>
                  </g>
                );
              })}
              {/* Pool boundary lines at token 128 and 256 (= positions 4 and 8 in our 12-token strip) */}
              <line
                x1={20 + 4 * 50}
                y1="90"
                x2={20 + 4 * 50}
                y2="160"
                stroke={C.yellow}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <line
                x1={20 + 8 * 50}
                y1="90"
                x2={20 + 8 * 50}
                y2="160"
                stroke={C.yellow}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <text x={20 + 4 * 50} y="86" textAnchor="middle" fill="#fff59d" fontSize="10" fontWeight="bold">
                Pool At Token 128
              </text>
              <text x={20 + 8 * 50} y="86" textAnchor="middle" fill="#fff59d" fontSize="10" fontWeight="bold">
                Pool At Token 256
              </text>
              {/* Chunk vector row */}
              {[0, 1, 2].map((c) => {
                const x = 20 + c * (600 / 3);
                const w = 600 / 3 - 8;
                const color = c === 0 ? C.cyan : c === 1 ? C.blue : C.orange;
                return (
                  <g key={`vc-${c}`}>
                    <rect
                      x={x + 4}
                      y="174"
                      width={w}
                      height="28"
                      fill={`${color}30`}
                      stroke={color}
                      strokeWidth="1.2"
                      rx="4"
                    />
                    <text x={x + w / 2 + 4} y="192" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
                      v_chunk{c + 1}
                    </text>
                  </g>
                );
              })}
              <text x="320" y="220" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11" fontWeight="bold">
                v_chunk_i = Mean-Pool(h_start...h_end)
              </text>
              {/* Annotation for v_chunk3 referencing Sarah */}
              <text x="320" y="248" textAnchor="middle" fill="#ffcc80" fontSize="12" fontWeight="bold">
                v_chunk3 Pools h9 To h12 - And h10 (&quot;she&quot;) Attended To h1 (&quot;Sarah&quot;).
              </text>
              <text x="320" y="266" textAnchor="middle" fill="#ffcc80" fontSize="11">
                So v_chunk3 Still Encodes &quot;Sarah&quot; Even Though The Word Lives In Chunk 1.
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            H = embed_tokens(doc-1) &nbsp;|&nbsp; H.shape = [384, 768] &nbsp;|&nbsp; v_chunk3 = mean(H[256:384])
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Query &quot;Did Sarah Get Her Reset Email?&quot; Now Matches Chunk 3
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Same query, same 3 chunks, same embedding model. The only thing that changes is whether we embedded each
            chunk in isolation or pooled token states from a whole-doc pass. The retrieval scores flip - chunk 3 goes
            from a 0.34 miss to a 0.81 hit because its vector now carries the Sarah signal.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {LATE_CHUNKING_SCORES.map((pass) => {
              const baseColor = pass.methodColor === "red" ? C.red : C.green;
              const lightText = pass.methodColor === "red" ? "#ef9a9a" : "#a5d6a7";
              return (
                <div
                  key={pass.method}
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    background: `${baseColor}06`,
                    border: `1px solid ${baseColor}30`,
                    textAlign: "center",
                  }}
                >
                  <T color={baseColor} bold center size={16}>
                    {pass.method}
                  </T>
                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 2fr) 90px 90px",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <T color={baseColor} bold size={12}>
                      Chunk
                    </T>
                    <T color={baseColor} bold center size={12}>
                      Score
                    </T>
                    <T color={baseColor} bold center size={12}>
                      Rank
                    </T>
                    {pass.rows.map((row) => (
                      <div key={row.chunk} style={{ display: "contents" }}>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "left",
                          }}
                        >
                          <T color={lightText} size={12}>
                            {row.chunk}
                          </T>
                        </div>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "center",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          <T color={lightText} size={13} bold={row.isTop}>
                            {row.score.toFixed(2)}
                          </T>
                        </div>
                        <div
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: row.isTop ? `${baseColor}24` : "rgba(0,0,0,0.3)",
                            border: row.isTop ? `1px solid ${baseColor}60` : `1px solid ${baseColor}20`,
                            textAlign: "center",
                          }}
                        >
                          <T color={lightText} size={12} bold={row.isTop}>
                            {row.isTop ? "Top-1" : "-"}
                          </T>
                        </div>
                      </div>
                    ))}
                  </div>
                  <T color={lightText} center size={13} style={{ marginTop: 10 }}>
                    {pass.note}
                  </T>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              The retriever ranks chunk 3 first because its vector now encodes the antecedent &quot;Sarah&quot; from
              chunk 1. Same chunks. Same query. Only the embedding order changed.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Late Chunking: Pros, Cons, When To Use
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Late chunking is a free recall boost on docs with anaphora, but only if you control the embedding stack.
            Same compute as chunk-then-embed for the same doc. The hard constraints are model access and context window.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Wins
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {LATE_CHUNKING_WINS.map((win) => (
                  <div
                    key={win}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {win}
                    </T>
                  </div>
                ))}
              </div>
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
              <T color={C.red} bold center size={16}>
                Limits
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {LATE_CHUNKING_LIMITS.map((limit) => (
                  <div
                    key={limit}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {limit}
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
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Reach for late chunking when your corpus has heavy anaphora (support docs, legal text, narrative
              articles), the docs fit in one embedding pass, and you can run an open-weights model like jina-
              embeddings-v2 that exposes token-level hidden states. Otherwise keep chunk-then-embed and lean on
              reranking or hybrid search to recover cross-chunk recall.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// Doc-4 refunds policy hierarchy data, shared across sub=1 and sub=4 (summary chunks).
const HIERARCHY_SECTIONS = [
  {
    id: "Eligibility",
    summary: "Who Qualifies And Refund Window.",
    leaves: ["L1", "L2", "L3", "L4"],
  },
  {
    id: "Process",
    summary: "Filing Steps And SLAs.",
    leaves: ["L5", "L6", "L7", "L8"],
  },
  {
    id: "Edge Cases",
    summary: "Late Requests And Appeals.",
    leaves: ["L9", "L10", "L11", "L12"],
  },
];

const HIERARCHICAL_LEAF_SCORES = [
  { id: "L7", score: 0.89, isTop: true, snippet: "...No Refunds After 30 Days..." },
  { id: "L3", score: 0.74, isTop: false, snippet: "Refund Eligibility Window: 14 Days Full, 15-30 Days Prorated..." },
  { id: "L12", score: 0.68, isTop: false, snippet: "Appeal Process For Denied Refund Requests..." },
];

const HIERARCHICAL_USE_WHEN = [
  "Docs are long and have natural section structure (manuals, policies, RFCs).",
  "Queries need surrounding context to answer well (legal, medical, technical docs where one sentence is rarely enough).",
  "Storage cost for parent texts is acceptable (roughly 2-3x raw doc size).",
];

const HIERARCHICAL_COST_NOTES = [
  "Storage: index + parent-text store. Roughly 2-3x raw corpus size.",
  "Latency: one extra lookup per hit (parent-from-leaf-id). Sub-millisecond.",
  "Implementation: every major framework has this pattern. LangChain ParentDocumentRetriever, LlamaIndex RecursiveRetriever.",
];

// Tree-layout constants for sub=1 and sub=4 SVG diagrams.
// viewBox: 640 wide, computed symmetric padding for every row.
const TREE_VIEW_W = 640;
const TREE_ROOT_W = 280;
const TREE_ROOT_X = (TREE_VIEW_W - TREE_ROOT_W) / 2; // = 180
const TREE_ROOT_CX = TREE_VIEW_W / 2; // = 320
const TREE_SECTION_W = 120;
const TREE_SECTION_CENTERS = [110, 320, 530]; // 3 sections evenly spaced
const TREE_LEAF_W = 38;
const TREE_LEAF_GAP = 4;

export const HierarchicalChunking = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Small Chunks Retrieve Better; Large Chunks Generate Better
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chunk size is a tug-of-war between two phases of RAG. A retriever finds the best matching chunk; an LLM
            answers from the chunk text. The smaller the chunk, the more focused each vector is - but the less context
            the LLM sees. The larger the chunk, the more context the LLM has - but the fuzzier the vector becomes.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}30`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Small Chunks (64 Tokens)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" center size={13}>
                  Retrieval Precision: High. Each chunk is one focused fact.
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" center size={13}>
                  Generation Context: Low. The LLM may need surrounding paragraphs to answer fully.
                </T>
              </div>
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
              <T color={C.purple} bold center size={16}>
                Large Chunks (1024 Tokens)
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}24`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" center size={13}>
                  Retrieval Precision: Low. Many topics per chunk; the vector averages them.
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" center size={13}>
                  Generation Context: High. The LLM has the whole section.
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              Pick one and you are forced to compromise. What if you did not have to?
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Hierarchical: Leaves Are Small, Parents Are Big
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Chunk the doc twice. Build a tree. The root is the whole doc. The mid-level nodes are sections of around 300
            tokens each. The leaves are tiny 64-token chunks that fit one fact apiece. Only the leaf vectors live in the
            index - they are what we search. Parents live in a separate parent-text store, keyed by id, ready to be
            swapped in at generation time.
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
            <T color={C.green} bold center size={16}>
              Doc-4 Refunds Policy: 1 Root + 3 Sections + 12 Leaves
            </T>
            <svg viewBox="0 0 640 340" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Tree hierarchy diagram with doc-4 refunds policy as the root node at the top, three section nodes below
                for eligibility, process, and edge cases, and four leaf chunk nodes below each section, with leaves
                colored cyan, sections purple, and root green.
              </desc>
              {/* Root node */}
              <rect
                x={TREE_ROOT_X}
                y="14"
                width={TREE_ROOT_W}
                height="46"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.4"
                rx="6"
              />
              <text x={TREE_ROOT_CX} y="32" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                Doc-4 Refunds Policy (Root)
              </text>
              <text x={TREE_ROOT_CX} y="49" textAnchor="middle" fill="#a5d6a7" fontSize="11">
                3 Sections - 900 Tokens Total
              </text>
              {/* Edges root -> sections */}
              {TREE_SECTION_CENTERS.map((cx, i) => (
                <line
                  key={`r-${i}`}
                  x1={TREE_ROOT_CX}
                  y1="60"
                  x2={cx}
                  y2="120"
                  stroke={`${C.green}80`}
                  strokeWidth="1.2"
                />
              ))}
              {/* Section nodes */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const x = cx - TREE_SECTION_W / 2;
                return (
                  <g key={`sec-${i}`}>
                    <rect
                      x={x}
                      y="120"
                      width={TREE_SECTION_W}
                      height="46"
                      fill={`${C.purple}30`}
                      stroke={C.purple}
                      strokeWidth="1.4"
                      rx="5"
                    />
                    <text x={cx} y="139" textAnchor="middle" fill="#b8a9ff" fontSize="12" fontWeight="bold">
                      {sec.id}
                    </text>
                    <text x={cx} y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                      ~300 Tokens
                    </text>
                  </g>
                );
              })}
              {/* Edges section -> leaves */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((_, lIdx) => {
                  const lcx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP) + TREE_LEAF_W / 2;
                  return (
                    <line
                      key={`e-${sIdx}-${lIdx}`}
                      x1={secCx}
                      y1="166"
                      x2={lcx}
                      y2="230"
                      stroke={`${C.cyan}80`}
                      strokeWidth="1"
                    />
                  );
                });
              })}
              {/* Leaf nodes */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((leafId, lIdx) => {
                  const lx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP);
                  return (
                    <g key={`leaf-${sIdx}-${lIdx}`}>
                      <rect
                        x={lx}
                        y="230"
                        width={TREE_LEAF_W}
                        height="46"
                        fill={`${C.cyan}30`}
                        stroke={C.cyan}
                        strokeWidth="1"
                        rx="4"
                      />
                      <text
                        x={lx + TREE_LEAF_W / 2}
                        y="249"
                        textAnchor="middle"
                        fill="#80deea"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {leafId}
                      </text>
                      <text x={lx + TREE_LEAF_W / 2} y="265" textAnchor="middle" fill="#80deea" fontSize="9">
                        64 Tok
                      </text>
                    </g>
                  );
                });
              })}
              {/* Legend / level labels on the right */}
              <text x={TREE_VIEW_W - 6} y="36" textAnchor="end" fill={C.green} fontSize="10" fontWeight="bold">
                Root: 900 Tok
              </text>
              <text x={TREE_VIEW_W - 6} y="143" textAnchor="end" fill={C.purple} fontSize="10" fontWeight="bold">
                Section: 300 Tok
              </text>
              <text x={TREE_VIEW_W - 6} y="253" textAnchor="end" fill={C.cyan} fontSize="10" fontWeight="bold">
                Leaf: 64 Tok
              </text>
              {/* Bottom annotation */}
              <text
                x={TREE_ROOT_CX}
                y="302"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Index Stores Leaf Vectors. Retrieval Finds Leaves.
              </text>
              <text x={TREE_ROOT_CX} y="322" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">
                We Swap Each Leaf For Its Parent Before Sending To The LLM.
              </text>
            </svg>
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
              fontSize: 13,
              color: "#a5d6a7",
            }}
          >
            Index: {`{ leaf_id -> vector }`} &nbsp;|&nbsp; Parent Store: {`{ leaf_id -> parent_text }`}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Step 1: Retrieval Finds The Best Leaf
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The user asks &quot;Can I get a refund if I cancel after 30 days?&quot; The query is embedded once. We
            search the leaf index. The top-3 leaves come back ranked by cosine similarity. L7 wins because its 64-token
            text directly states the 30-day cutoff.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#b8a9ff",
            }}
          >
            Query: &quot;Can I get a refund if I cancel after 30 days?&quot; &rarr; q_vec
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {HIERARCHICAL_LEAF_SCORES.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px minmax(0, 1fr) 100px 90px",
                  gap: 10,
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 8,
                  background: row.isTop ? `${C.purple}18` : "rgba(0,0,0,0.3)",
                  border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}24`,
                }}
              >
                <T color={row.isTop ? C.purple : "#b8a9ff"} bold size={15}>
                  {row.id}
                </T>
                <T color="#b8a9ff" size={13}>
                  {row.snippet}
                </T>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: row.isTop ? `${C.purple}24` : "rgba(0,0,0,0.4)",
                    border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}20`,
                    textAlign: "center",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  <T color={row.isTop ? C.purple : "#b8a9ff"} size={13} bold={row.isTop}>
                    {row.score.toFixed(2)}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: row.isTop ? `${C.purple}24` : "rgba(0,0,0,0.4)",
                    border: row.isTop ? `1px solid ${C.purple}60` : `1px solid ${C.purple}20`,
                    textAlign: "center",
                  }}
                >
                  <T color={row.isTop ? C.purple : "#b8a9ff"} size={13} bold={row.isTop}>
                    {row.isTop ? "Top-1" : "-"}
                  </T>
                </div>
              </div>
            ))}
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
              L7 wins at 0.89. Its 64-token snippet directly states &quot;no refunds after 30 days&quot; - a precise hit
              on the 30-day cutoff in the query.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Step 2: Swap The Leaf For Its Parent Before The LLM
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            We retrieved a leaf, but we do not send the leaf to the LLM. Each leaf carries the id of its parent section.
            A parent-lookup pulls the full 300-token Edge Cases section from the parent-text store. That section is what
            enters the prompt - so the LLM has the eligibility nuance, the appeal path, and the carve-outs, not just one
            sentence in isolation.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={16}>
              Leaf-To-Parent Swap Flow
            </T>
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Leaf-to-parent swap flow diagram showing retrieved leaf L7 with the no-refunds-after-30-days sentence on
                the left, a parent-lookup arrow in the middle, and the full 300-token edge-cases section on the right
                being sent to the LLM.
              </desc>
              {/* Left: retrieved leaf L7 */}
              <rect
                x="20"
                y="50"
                width="200"
                height="120"
                fill={`${C.cyan}24`}
                stroke={C.cyan}
                strokeWidth="1.4"
                rx="6"
              />
              <text x="120" y="40" textAnchor="middle" fill={C.cyan} fontSize="12" fontWeight="bold">
                Retrieved Leaf
              </text>
              <text x="120" y="74" textAnchor="middle" fill="#80deea" fontSize="14" fontWeight="bold">
                L7 - 64 Tokens
              </text>
              <text x="120" y="98" textAnchor="middle" fill="#80deea" fontSize="11">
                &quot;...No Refunds After
              </text>
              <text x="120" y="114" textAnchor="middle" fill="#80deea" fontSize="11">
                30 Days...&quot;
              </text>
              <text x="120" y="146" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                Parent-Id: Sec-Edge-Cases
              </text>
              <text x="120" y="160" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                Score: 0.89
              </text>
              {/* Middle: parent-lookup arrow */}
              <line x1="226" y1="110" x2="408" y2="110" stroke={C.orange} strokeWidth="2.4" />
              <polygon points="394,103 394,117 408,110" fill={C.orange} />
              <text x="320" y="92" textAnchor="middle" fill={C.orange} fontSize="13" fontWeight="bold">
                Parent Lookup
              </text>
              <text x="320" y="128" textAnchor="middle" fill="#ffcc80" fontSize="11">
                parent_store[L7.parent_id]
              </text>
              {/* Right: parent (full section) */}
              <rect
                x="414"
                y="30"
                width="206"
                height="160"
                fill={`${C.purple}24`}
                stroke={C.purple}
                strokeWidth="1.4"
                rx="6"
              />
              <text x="517" y="22" textAnchor="middle" fill={C.purple} fontSize="12" fontWeight="bold">
                Parent Section (Goes Into Prompt)
              </text>
              <text x="517" y="50" textAnchor="middle" fill="#b8a9ff" fontSize="14" fontWeight="bold">
                Edge Cases - 300 Tokens
              </text>
              <text x="517" y="76" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - 14-Day Full Refund Window
              </text>
              <text x="517" y="92" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - 15-30 Day Prorated Refund
              </text>
              <text x="517" y="108" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - No Refunds After 30 Days
              </text>
              <text x="517" y="124" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Manual-Review Carve-Out
              </text>
              <text x="517" y="140" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Appeal Path (Form A-12)
              </text>
              <text x="517" y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                - Special-Case Refunds
              </text>
              <text x="517" y="180" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                ~4.7x More Context Than Leaf
              </text>
              {/* Bottom: arrow to LLM */}
              <line x1="517" y1="196" x2="517" y2="226" stroke={C.orange} strokeWidth="2" />
              <polygon points="510,222 524,222 517,236" fill={C.orange} />
              <rect
                x="445"
                y="240"
                width="144"
                height="30"
                fill={`${C.orange}30`}
                stroke={C.orange}
                strokeWidth="1.4"
                rx="5"
              />
              <text x="517" y="260" textAnchor="middle" fill="#ffcc80" fontSize="13" fontWeight="bold">
                LLM Prompt Context
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              The LLM now has the eligibility nuance to give the user a real answer, not just &quot;no refunds after 30
              days&quot; in isolation. Retrieval precision came from the leaf; generation context comes from the parent.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Variation: Index Summary Chunks Instead Of Leaves
          </T>
          <T color="#fff59d" center size={16} style={{ marginTop: 10 }}>
            Same tree, different retrieval target. Run an LLM over each section once at index time to generate a 1-2
            sentence summary. Embed and index those summary chunks instead of the leaves. On a hit, swap to the full
            parent section (or even the whole doc). Summaries pack more meaning per token, so the vector match can be
            more semantic. The cost is an LLM pass at index time.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Doc-4 Hierarchy With Summary Chunks Per Section
            </T>
            <svg viewBox="0 0 640 360" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Tree hierarchy diagram extending the doc-4 refunds tree with a small summary card placed beside each
                section node. Summary cards are colored yellow and labeled with one-sentence LLM-generated summaries.
                Index now stores summary vectors; retrieval finds a summary then swaps to the full parent section.
              </desc>
              {/* Root */}
              <rect
                x={TREE_ROOT_X}
                y="14"
                width={TREE_ROOT_W}
                height="46"
                fill={`${C.green}30`}
                stroke={C.green}
                strokeWidth="1.4"
                rx="6"
              />
              <text x={TREE_ROOT_CX} y="32" textAnchor="middle" fill="#a5d6a7" fontSize="12" fontWeight="bold">
                Doc-4 Refunds Policy (Root)
              </text>
              <text x={TREE_ROOT_CX} y="49" textAnchor="middle" fill="#a5d6a7" fontSize="11">
                3 Sections - 900 Tokens Total
              </text>
              {/* Edges root -> sections */}
              {TREE_SECTION_CENTERS.map((cx, i) => (
                <line
                  key={`r4-${i}`}
                  x1={TREE_ROOT_CX}
                  y1="60"
                  x2={cx}
                  y2="120"
                  stroke={`${C.green}80`}
                  strokeWidth="1.2"
                />
              ))}
              {/* Section nodes */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const x = cx - TREE_SECTION_W / 2;
                return (
                  <g key={`sec4-${i}`}>
                    <rect
                      x={x}
                      y="120"
                      width={TREE_SECTION_W}
                      height="46"
                      fill={`${C.purple}30`}
                      stroke={C.purple}
                      strokeWidth="1.4"
                      rx="5"
                    />
                    <text x={cx} y="139" textAnchor="middle" fill="#b8a9ff" fontSize="12" fontWeight="bold">
                      {sec.id}
                    </text>
                    <text x={cx} y="156" textAnchor="middle" fill="#b8a9ff" fontSize="11">
                      ~300 Tokens
                    </text>
                  </g>
                );
              })}
              {/* Summary cards sit between section row and leaf row */}
              {HIERARCHY_SECTIONS.map((sec, i) => {
                const cx = TREE_SECTION_CENTERS[i];
                const w = 150;
                const x = cx - w / 2;
                return (
                  <g key={`sum-${i}`}>
                    {/* Connector from section to summary card */}
                    <line
                      x1={cx}
                      y1="166"
                      x2={cx}
                      y2="186"
                      stroke={`${C.yellow}80`}
                      strokeWidth="1.4"
                      strokeDasharray="3 2"
                    />
                    <rect
                      x={x}
                      y="186"
                      width={w}
                      height="50"
                      fill={`${C.yellow}24`}
                      stroke={C.yellow}
                      strokeWidth="1.2"
                      rx="5"
                    />
                    <text x={cx} y="202" textAnchor="middle" fill="#fff59d" fontSize="11" fontWeight="bold">
                      Summary (LLM-Made)
                    </text>
                    <text x={cx} y="218" textAnchor="middle" fill="#fff59d" fontSize="10">
                      {sec.summary}
                    </text>
                    <text x={cx} y="231" textAnchor="middle" fill="#fff59d" fontSize="9">
                      Indexed - 1 Vector
                    </text>
                  </g>
                );
              })}
              {/* Connector summary card -> leaf row */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((_, lIdx) => {
                  const lcx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP) + TREE_LEAF_W / 2;
                  return (
                    <line
                      key={`e4-${sIdx}-${lIdx}`}
                      x1={secCx}
                      y1="236"
                      x2={lcx}
                      y2="270"
                      stroke={`${C.cyan}50`}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  );
                });
              })}
              {/* Leaf nodes */}
              {HIERARCHY_SECTIONS.map((sec, sIdx) => {
                const secCx = TREE_SECTION_CENTERS[sIdx];
                const leafCount = sec.leaves.length;
                const span = leafCount * TREE_LEAF_W + (leafCount - 1) * TREE_LEAF_GAP;
                const xStart = secCx - span / 2;
                return sec.leaves.map((leafId, lIdx) => {
                  const lx = xStart + lIdx * (TREE_LEAF_W + TREE_LEAF_GAP);
                  return (
                    <g key={`leaf4-${sIdx}-${lIdx}`}>
                      <rect
                        x={lx}
                        y="270"
                        width={TREE_LEAF_W}
                        height="34"
                        fill={`${C.cyan}18`}
                        stroke={C.cyan}
                        strokeWidth="0.8"
                        rx="3"
                      />
                      <text
                        x={lx + TREE_LEAF_W / 2}
                        y="284"
                        textAnchor="middle"
                        fill="#80deea"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {leafId}
                      </text>
                      <text x={lx + TREE_LEAF_W / 2} y="297" textAnchor="middle" fill="#80deea" fontSize="9">
                        64 Tok
                      </text>
                    </g>
                  );
                });
              })}
              {/* Level labels */}
              <text x={TREE_VIEW_W - 6} y="36" textAnchor="end" fill={C.green} fontSize="10" fontWeight="bold">
                Root
              </text>
              <text x={TREE_VIEW_W - 6} y="143" textAnchor="end" fill={C.purple} fontSize="10" fontWeight="bold">
                Section
              </text>
              <text x={TREE_VIEW_W - 6} y="209" textAnchor="end" fill={C.yellow} fontSize="10" fontWeight="bold">
                Summary
              </text>
              <text x={TREE_VIEW_W - 6} y="289" textAnchor="end" fill={C.cyan} fontSize="10" fontWeight="bold">
                Leaf (Not Indexed)
              </text>
              {/* Bottom annotation */}
              <text
                x={TREE_ROOT_CX}
                y="328"
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Index Stores Summary Vectors. Retrieval Finds A Summary.
              </text>
              <text x={TREE_ROOT_CX} y="348" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="11">
                Swap To The Full Parent Section On A Hit.
              </text>
            </svg>
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
            <T color="#fff59d" center size={14}>
              Trade-off: summaries are denser semantically (one vector encodes the gist of a 300-token section), but
              require an LLM pass at index time to generate them.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Hierarchical: When And At What Cost
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Hierarchical chunking is a workhorse pattern in production RAG: it gives precise retrieval and rich
            generation context at the price of storing parent texts. Every major framework ships an off-the-shelf
            implementation, so the implementation cost is near zero.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Use Hierarchical When
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {HIERARCHICAL_USE_WHEN.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
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
              <T color={C.red} bold center size={16}>
                Cost & Implementation
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {HIERARCHICAL_COST_NOTES.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {line}
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
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Reach for hierarchical chunking when your docs have natural section structure and queries need surrounding
              context to answer well. Use LangChain ParentDocumentRetriever or LlamaIndex RecursiveRetriever and you
              have the pattern working in a few lines.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// --- Contextual Retrieval (12.12) shared data ---------------------------------
// Three chunks from three unrelated docs that all end with the same phrase.
// The point: token sequences are nearly identical so embeddings collide.
const CONTEXTUAL_ORPHAN_CHUNKS = [
  {
    id: "Chunk A",
    doc: "Doc-2 Email Change Guide",
    text: "...verify your new email address, then click Save to confirm.",
    vec: [0.31, 0.42, 0.18, 0.55, 0.27, 0.39, 0.46, 0.22],
    score: 0.71,
  },
  {
    id: "Chunk B",
    doc: "Doc-15 Role Permissions Guide",
    text: "...assign the new role to the user, then click Save to confirm.",
    vec: [0.3, 0.41, 0.19, 0.54, 0.29, 0.38, 0.45, 0.23],
    score: 0.71,
  },
  {
    id: "Chunk C",
    doc: "Doc-18 Notifications Settings",
    text: "...select the channels you want notifications on, then click Save to confirm.",
    vec: [0.32, 0.4, 0.18, 0.55, 0.28, 0.39, 0.47, 0.21],
    score: 0.71,
  },
];

const CONTEXTUAL_AUGMENTED_SCORES = [
  {
    id: "Chunk A",
    label: "Doc-2 Email Change Guide",
    score: 0.93,
    isTop: true,
    note: "Augmentation explicitly mentions email change - direct hit.",
  },
  {
    id: "Chunk B",
    label: "Doc-15 Role Permissions Guide",
    score: 0.42,
    isTop: false,
    note: "Augmentation pulls vector toward roles, away from email.",
  },
  {
    id: "Chunk C",
    label: "Doc-18 Notifications Settings",
    score: 0.39,
    isTop: false,
    note: "Augmentation pulls vector toward notifications, away from email.",
  },
];

const CONTEXTUAL_BENCHMARK_BARS = [
  {
    label: "Naive Embedding Only",
    rate: 5.7,
    reduction: "Baseline",
    color: "#9aa0a6",
  },
  {
    label: "+ Contextual Embedding",
    rate: 3.7,
    reduction: "35% Reduction",
    color: "#80deea",
  },
  {
    label: "+ Contextual BM25",
    rate: 2.9,
    reduction: "49% Reduction",
    color: "#a5d6a7",
  },
  {
    label: "+ Reranking",
    rate: 1.9,
    reduction: "67% Reduction",
    color: "#ffcc80",
  },
];

const CONTEXTUAL_SKIP_IF = [
  "Corpus is fully homogeneous (one product manual; no risk of cross-doc duplicate phrases).",
  "Index size is small (under 1K chunks; recall problems can be solved by hand-tuning).",
  "Index budget is hard (the one-time $100-$1,000 augmentation cost is too high for a prototype).",
];

const CONTEXTUAL_USE_IF = [
  "Corpus has many docs with similar surface phrases (FAQ + support + product = lots of click Save to confirm overlap).",
  "Recall is the bottleneck in your eval metrics.",
  "Hybrid and reranking are already in place and you want one more lever.",
];

const CONTEXTUAL_STACK_STEPS = [
  {
    color: C.green,
    title: "Step 1: Contextual Augmentation (Index Time)",
    body: "Run an LLM over each chunk once. Prepend a 1-2 sentence context line that says what doc and section the chunk lives in. Embed and index the augmented chunk.",
    accent: "#a5d6a7",
  },
  {
    color: C.cyan,
    title: "Step 2: Hybrid Retrieval (Query Time)",
    body: "Dense embedding search and BM25 lexical search run in parallel over the augmented chunks. Their top-20 results are merged into a single candidate list.",
    accent: "#80deea",
    recap: "Hybrid - covered in Section 11.24 - merges semantic and lexical recall.",
  },
  {
    color: C.orange,
    title: "Step 3: Reranker (Top-20 To Top-3)",
    body: "A cross-encoder scores each query-chunk pair jointly and reorders the candidates. The top 3 go into the LLM prompt.",
    accent: "#ffcc80",
    recap: "Rerankers - covered in Section 11.25 - cross-encoder scores each query-chunk pair.",
  },
];

// Bar-chart geometry for the Anthropic benchmark in sub=4.
// viewBox 640 wide; labels live left of the bars, bars are scaled to rate.
const BENCH_VIEW_W = 640;
const BENCH_LABEL_W = 230; // Reserved for left-side category text.
const BENCH_PAD_RIGHT = 30;
const BENCH_AXIS_Y = 220; // Y position of the x-axis baseline.
const BENCH_PX_PER_PERCENT = (BENCH_VIEW_W - BENCH_LABEL_W - BENCH_PAD_RIGHT) / 6; // 0..6%
const BENCH_BAR_X = BENCH_LABEL_W;
const BENCH_BAR_H = 28;
const BENCH_BAR_GAP = 14;
const BENCH_BAR_Y_START = 32;

export const ContextualRetrieval = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Chunks Out Of Context Look Identical To The Embedding Model
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Three chunks from three completely unrelated docs all end with the exact same sentence: &quot;click Save to
            confirm.&quot; The embedding model sees only the token sequence. With nearly identical tokens the three
            chunks produce nearly identical vectors, so a query about email lands on all three at the same similarity.
            Retrieval picks one effectively at random.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
              color: "#80deea",
            }}
          >
            Query: &quot;How do I change my email?&quot; &rarr; q_vec
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            {CONTEXTUAL_ORPHAN_CHUNKS.map((ch) => (
              <div
                key={ch.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {ch.id}
                </T>
                <T color="rgba(255,255,255,0.7)" center size={11}>
                  {ch.doc}
                </T>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.35)",
                    border: `1px solid ${C.cyan}24`,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" center size={12}>
                    {ch.text}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${C.cyan}12`,
                    border: `1px solid ${C.cyan}24`,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 11,
                    color: "#80deea",
                    textAlign: "center",
                  }}
                >
                  [{ch.vec.map((v) => v.toFixed(2)).join(", ")}]
                </div>
                <div
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}30`,
                    textAlign: "center",
                  }}
                >
                  <T color="#ef9a9a" center size={13} bold>
                    Similarity: {ch.score.toFixed(2)}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              All three vectors are nearly identical because the chunks are nearly identical token sequences. The
              embedding is indistinguishable on the part of the chunk the query cares about. Recall@1 collapses to
              guessing - the wrong chunk is returned roughly two times out of three.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Solution: Prepend An LLM-Generated Context Line
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Before each chunk is embedded, run a cheap LLM call once at index time to write a short 1-2 sentence
            context: what doc the chunk is from, what section, and what it is about. Prepend that context line to the
            chunk text. The augmented chunk - prefix plus original body - is what the embedder sees. Now the vector
            carries enough signal to disambiguate even when chunks share surface phrasing.
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
            <T color={C.green} bold center size={16}>
              Chunk A After Augmentation
            </T>

            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}10`,
                border: `1px solid ${C.green}40`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={12} style={{ letterSpacing: 0.4 }}>
                LLM-Generated Context (1-2 Sentences) - Prepended Prefix
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
                Document: Email Change Guide. Section: Step 4 - Verify New Address. This chunk is about confirming the
                new email after verification.
              </T>
            </div>

            <div
              style={{
                marginTop: 8,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color="rgba(255,255,255,0.65)" center size={12} style={{ letterSpacing: 0.4 }}>
                Original Chunk Body (Unchanged)
              </T>
              <T color="rgba(255,255,255,0.85)" center size={14} style={{ marginTop: 6 }}>
                ...verify your new email address, then click Save to confirm.
              </T>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: 8,
                borderRadius: 6,
                background: "rgba(0,0,0,0.35)",
                border: `1px solid ${C.green}24`,
                textAlign: "center",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                color: "#a5d6a7",
              }}
            >
              Full Augmented Chunk = [Prefix] + [Body] &nbsp;&rarr;&nbsp; This Is What Gets Embedded And Indexed
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              The body of the chunk never changes - the LLM generation only writes a short prefix that situates the
              chunk inside its source. The original tokens are still there for the LLM to read at generation time. Only
              the index-side representation gets richer.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Augmentation Prompt Template (Run Once Per Chunk)
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The template below is the exact prompt fired at index time for every chunk in the corpus. The placeholders
            in orange get filled in with the document title, the section heading, and the raw chunk text. The model
            returns the 1-2 sentence context that gets prepended.
          </T>

          <T color={C.purple} bold center size={14} style={{ marginTop: 14 }}>
            Augmentation Prompt Template
          </T>

          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#b8a9ff",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              lineHeight: 1.55,
            }}
          >
            <div>Here is a chunk from a documentation page.</div>
            <div style={{ marginTop: 8 }}>
              &lt;document_title&gt;<span style={{ color: C.orange, fontWeight: 600 }}>{"{document_title}"}</span>
              &lt;/document_title&gt;
            </div>
            <div>
              &lt;section_heading&gt;<span style={{ color: C.orange, fontWeight: 600 }}>{"{section_heading}"}</span>
              &lt;/section_heading&gt;
            </div>
            <div>&lt;chunk&gt;</div>
            <div>
              <span style={{ color: C.orange, fontWeight: 600 }}>{"{chunk}"}</span>
            </div>
            <div>&lt;/chunk&gt;</div>
            <div style={{ marginTop: 10 }}>Write a short (1-2 sentence) context that situates this chunk within</div>
            <div>the document and section so retrieval models can find it. Output</div>
            <div>only the context, no preamble.</div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}30`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={14}>
                Model Choice
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6 }}>
                Anthropic recommends Claude Haiku - a cheap model is enough; the task is short and structured.
              </T>
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
              <T color={C.purple} bold center size={14}>
                Cost At Index Time
              </T>
              <T color="#b8a9ff" center size={13} style={{ marginTop: 6 }}>
                Roughly $0.001 per chunk. For 100K chunks that is about $100 one-time. With prompt caching the document
                prefix is paid once across all its chunks.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Before Vs. After: Recall On The Email-Change Query
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Same query, same three chunks, same embedding model. The only difference is whether the chunks were
            augmented with a context prefix at index time. Without augmentation the three vectors tie and recall is a
            coin flip. With augmentation, chunk A pulls clearly ahead and recall@1 jumps from 33% to 100%.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Row 1: Without Augmentation
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTEXTUAL_ORPHAN_CHUNKS.map((ch) => (
                <div
                  key={`bf-${ch.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px minmax(0, 1fr) 100px",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.red}24`,
                  }}
                >
                  <T color={C.red} bold size={14}>
                    {ch.id}
                  </T>
                  <T color="#ef9a9a" size={13}>
                    {ch.doc}
                  </T>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${C.red}18`,
                      border: `1px solid ${C.red}30`,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      textAlign: "center",
                    }}
                  >
                    <T color={C.red} size={13} bold>
                      {ch.score.toFixed(2)}
                    </T>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.red}12`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color="#ef9a9a" center size={13} bold>
                All Three Tied At 0.71. Top-1 Is Effectively Random. Recall@1 = 33%.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}30`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={15}>
              Row 2: With Augmentation
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTEXTUAL_AUGMENTED_SCORES.map((ch) => (
                <div
                  key={`af-${ch.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: 10,
                    borderRadius: 8,
                    background: ch.isTop ? `${C.green}18` : "rgba(0,0,0,0.3)",
                    border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}24`,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px minmax(0, 1fr) 100px 90px",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <T color={ch.isTop ? C.green : "#a5d6a7"} bold size={14}>
                      {ch.id}
                    </T>
                    <T color="#a5d6a7" size={13}>
                      {ch.label}
                    </T>
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: ch.isTop ? `${C.green}24` : `${C.green}10`,
                        border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}24`,
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        textAlign: "center",
                      }}
                    >
                      <T color={ch.isTop ? C.green : "#a5d6a7"} size={13} bold={ch.isTop}>
                        {ch.score.toFixed(2)}
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: ch.isTop ? `${C.green}24` : "rgba(0,0,0,0.3)",
                        border: ch.isTop ? `1px solid ${C.green}60` : `1px solid ${C.green}20`,
                        textAlign: "center",
                      }}
                    >
                      <T color={ch.isTop ? C.green : "#a5d6a7"} size={13} bold={ch.isTop}>
                        {ch.isTop ? "Top-1" : "-"}
                      </T>
                    </div>
                  </div>
                  <T color={ch.isTop ? "#a5d6a7" : "rgba(255,255,255,0.6)"} center size={12}>
                    {ch.note}
                  </T>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 6,
                background: `${C.green}12`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color="#a5d6a7" center size={13} bold>
                Chunk A Wins At 0.93. Top-1 Is Stable. Recall@1 = 100%.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              The augmented vectors are no longer near-duplicates. Chunk A&apos;s prefix mentions email change
              explicitly, pulling its vector toward the query. Chunks B and C drift away because their prefixes are
              about roles and notifications. The retriever now has signal to separate them.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Anthropic&apos;s 2024 Benchmark: 49% Recall Improvement
          </T>
          <T color="#fff59d" center size={16} style={{ marginTop: 10 }}>
            Anthropic published a paper-length blog post in September 2024 measuring contextual retrieval over multiple
            corpora. The chart below shows top-20 retrieval failure rate - lower is better. Contextual embedding alone
            cuts failures by 35%. Add contextual BM25 hybrid and it is 49%. Stack a reranker on top and the combined
            stack hits 67% fewer failures than naive embedding retrieval.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Top-20 Retrieval Failure Rate (Lower Is Better)
            </T>
            <svg viewBox="0 0 640 280" style={{ width: "100%", height: "auto", display: "block", marginTop: 10 }}>
              <desc>
                Horizontal bar chart showing four bars of retrieval failure rate from Anthropic&apos;s September 2024
                Contextual Retrieval benchmark: naive embedding only 5.7 percent, plus contextual embedding 3.7 percent,
                plus contextual BM25 2.9 percent, plus reranking 1.9 percent, with title-case axis labels.
              </desc>
              {/* X-axis baseline */}
              <line
                x1={BENCH_BAR_X}
                y1={BENCH_AXIS_Y}
                x2={BENCH_VIEW_W - BENCH_PAD_RIGHT}
                y2={BENCH_AXIS_Y}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              {/* X-axis ticks at 0, 2, 4, 6 percent */}
              {[0, 2, 4, 6].map((tick) => {
                const x = BENCH_BAR_X + tick * BENCH_PX_PER_PERCENT;
                return (
                  <g key={`tick-${tick}`}>
                    <line x1={x} y1={BENCH_AXIS_Y} x2={x} y2={BENCH_AXIS_Y + 6} stroke="rgba(255,255,255,0.5)" />
                    <text x={x} y={BENCH_AXIS_Y + 20} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11">
                      {tick}%
                    </text>
                  </g>
                );
              })}
              {/* X-axis title */}
              <text
                x={BENCH_BAR_X + (BENCH_VIEW_W - BENCH_BAR_X - BENCH_PAD_RIGHT) / 2}
                y={BENCH_AXIS_Y + 40}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Failure Rate (%)
              </text>
              {/* Bars + labels */}
              {CONTEXTUAL_BENCHMARK_BARS.map((bar, i) => {
                const y = BENCH_BAR_Y_START + i * (BENCH_BAR_H + BENCH_BAR_GAP);
                const w = bar.rate * BENCH_PX_PER_PERCENT;
                return (
                  <g key={`bar-${i}`}>
                    {/* Category label (left of bar) */}
                    <text
                      x={BENCH_LABEL_W - 10}
                      y={y + BENCH_BAR_H / 2 + 4}
                      textAnchor="end"
                      fill={bar.color}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {bar.label}
                    </text>
                    {/* Bar */}
                    <rect
                      x={BENCH_BAR_X}
                      y={y}
                      width={w}
                      height={BENCH_BAR_H}
                      fill={`${bar.color}40`}
                      stroke={bar.color}
                      strokeWidth="1.2"
                      rx="3"
                    />
                    {/* Value at end of bar */}
                    <text
                      x={BENCH_BAR_X + w + 8}
                      y={y + BENCH_BAR_H / 2 + 4}
                      textAnchor="start"
                      fill={bar.color}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {bar.rate.toFixed(1)}% &middot; {bar.reduction}
                    </text>
                  </g>
                );
              })}
              {/* Chart title at top */}
              <text
                x={BENCH_VIEW_W / 2}
                y={16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize="12"
                fontWeight="bold"
              >
                Method &middot; Failure Rate
              </text>
            </svg>
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
            <T color="#fff59d" center size={14}>
              From the Anthropic Contextual Retrieval blog post, September 2024. The 49% headline number is the failure
              rate reduction from naive embedding (5.7%) to contextual embedding plus contextual BM25 hybrid (2.9%).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            When Contextual Retrieval Is Overkill
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Contextual retrieval pays for itself when many docs share surface phrases and recall is a real bottleneck.
            On a small homogeneous corpus the one-time augmentation cost is hard to justify - the recall problem can be
            solved more cheaply by hand-tuning chunks or by adding a reranker first.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Skip If
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {CONTEXTUAL_SKIP_IF.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {line}
                    </T>
                  </div>
                ))}
              </div>
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
              <T color={C.green} bold center size={16}>
                Use If
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {CONTEXTUAL_USE_IF.map((line) => (
                  <div
                    key={line}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {line}
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
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color="#ef9a9a" center size={14}>
              Rule of thumb: if recall is not your bottleneck, do not add the augmentation pass. The 49% headline number
              is a ceiling, not a guarantee - it only shows up when chunks would otherwise collide on surface tokens.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Stacks With Hybrid Search And Rerankers For The Full 67%
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Contextual retrieval is not a replacement for hybrid search or for rerankers - it composes with them.
            Augment at index time, then run hybrid retrieval and rerank as usual. Each layer attacks a different failure
            mode, so the wins stack.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {CONTEXTUAL_STACK_STEPS.map((step) => (
              <div
                key={step.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${step.color}06`,
                  border: `1px solid ${step.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={step.color} bold center size={16}>
                  {step.title}
                </T>
                <T color={step.accent} center size={14} style={{ marginTop: 6 }}>
                  {step.body}
                </T>
                {step.recap && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 6,
                      background: `${step.color}10`,
                      border: `1px solid ${step.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={step.accent} center size={12}>
                      {step.recap}
                    </T>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.pink}10`,
              border: `1px solid ${C.pink}40`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold center size={16}>
              Combined: 67% Failure-Rate Reduction Over Naive (Anthropic 2024)
            </T>
            <T color="#f8bbd0" center size={13} style={{ marginTop: 6 }}>
              Augmentation lifts dense and BM25 recall in parallel. The reranker fixes ordering on whatever the hybrid
              stack surfaces. Each component is independently useful, but the full stack is where the 67% number lives.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.13 ChunkingDecision - synthesizes 12.7-12.12 into a framework
// ───────────────────────────────────────────────────────────────

// Each strategy carries a name, one-line summary, and three meter levels
// (quality / cost / implementation). Levels: 1=low, 2=med, 3=high, 4=very high.
const CHUNKING_STRATEGIES = [
  {
    name: "Fixed-Size",
    chapter: "12.7",
    summary: "Sliding window, no structure awareness.",
    quality: 1,
    cost: 1,
    difficulty: 1,
  },
  {
    name: "Recursive Structural",
    chapter: "12.8",
    summary: "Tries paragraph then line then sentence then word.",
    quality: 2,
    cost: 1,
    difficulty: 1,
  },
  {
    name: "Semantic",
    chapter: "12.9",
    summary: "Embed sentences, split where cosine dips.",
    quality: 3,
    cost: 2,
    difficulty: 2,
  },
  {
    name: "Late",
    chapter: "12.10",
    summary: "One whole-doc attention pass, then pool per chunk.",
    quality: 3,
    cost: 2,
    difficulty: 3,
  },
  {
    name: "Hierarchical",
    chapter: "12.11",
    summary: "Small chunks retrieve; parents go to LLM.",
    quality: 3,
    cost: 2,
    difficulty: 2,
  },
  {
    name: "Contextual Retrieval",
    chapter: "12.12",
    summary: "LLM-generated context prefixed to each chunk.",
    quality: 4,
    cost: 3,
    difficulty: 2,
  },
];

const DOC_STRUCTURE_ROWS = [
  {
    type: "Markdown / HTML",
    recommendation: "Recursive Structural (uses heading and paragraph markers natively).",
  },
  {
    type: "PDF (Scanned Or Extracted)",
    recommendation: "Recursive Structural after extraction, or Semantic if extraction quality is bad.",
  },
  {
    type: "Code",
    recommendation: "Recursive Structural with language-aware separators (function defs, class declarations).",
  },
  {
    type: "Flat-Text Narrative (No Headings, No Markdown)",
    recommendation: "Semantic Chunking (the only way to find topic boundaries).",
  },
  {
    type: "Mixed / Heterogeneous Corpus",
    recommendation: "Apply different strategies per doc-type. Don't force one strategy.",
  },
];

const QUERY_TYPE_ROWS = [
  {
    query: "Factual",
    example: "What is X?",
    advice:
      "Small chunks are fine. Recursive Structural plus Contextual if FAQ-style overlap. Hierarchical optional for context-heavy answers.",
  },
  {
    query: "Relational",
    example: "How does X relate to Y?",
    advice:
      "Hierarchical helps (LLM needs the whole relationship section). Late Chunking helps when entities are referenced across chunks.",
  },
  {
    query: "Comparative",
    example: "Compare X and Y.",
    advice:
      "Multi-hop retrieval (covered in chapter 12.28) on top of any chunking. Bigger chunks help. Hierarchical preferred.",
  },
];

// Cost-tier scale geometry. viewBox 720x180; three labeled markers across the bar.
const COST_VIEW_W = 720;
const COST_VIEW_H = 180;
const COST_TIERS = [
  {
    name: "Lab / Prototype",
    cost: "Free",
    color: C.green,
    accent: "#a5d6a7",
    recipe: "Recursive Structural only. Zero embedding cost at chunk time. Iterate fast.",
  },
  {
    name: "Startup",
    cost: "~$100 One-Time",
    color: C.cyan,
    accent: "#80deea",
    recipe:
      "Recursive Structural plus Hierarchical for long-form docs. Skip semantic and contextual until you see recall problems in your eval.",
  },
  {
    name: "Enterprise",
    cost: "$100 - $10K One-Time",
    color: C.orange,
    accent: "#ffcc80",
    recipe:
      "Recursive Structural baseline plus Hierarchical plus Contextual Retrieval plus (Semantic where prose dominates). Stack with hybrid plus rerankers. Budget for the one-time $100 - $10K augmentation cost.",
  },
];

const SUPPORT_WALKTHROUGH = [
  {
    category: "Account & Billing",
    profile: "10 docs, FAQ-style, lots of repeated phrases like 'click Save'",
    recommendation:
      "Recursive Structural plus Contextual Retrieval. Contextual disambiguates the duplicate phrases across email, role, and notifications docs.",
  },
  {
    category: "Product Features",
    profile: "10 docs, longer technical pages with sections and code samples",
    recommendation:
      "Recursive Structural plus Hierarchical. Sections give clean splits; parent-swap gives the LLM context for technical answers.",
  },
  {
    category: "Troubleshooting",
    profile: "10 docs, free-form runbooks, narrative paragraphs",
    recommendation:
      "Recursive Structural plus Semantic for the longer narratives. Semantic catches topic shifts within a runbook.",
  },
];

// Renders the 3-bar mini-meter for a given level (1=low .. 4=very high).
// Three rectangles in a row; the "filled" ones use the axis color.
function MiniMeter({ label, level, axisColor }) {
  // axisColor is set at the call site: green for Quality, orange for Cost, red for Implementation Difficulty.
  // Fill count is the same across axes; level 4 (very-high) is only used for Quality on Contextual.
  const fills = [];
  for (let i = 0; i < 3; i++) {
    const filled = i < Math.min(level, 3);
    fills.push(
      <div
        key={i}
        style={{
          width: 14,
          height: 7,
          background: filled ? axisColor : "rgba(255,255,255,0.08)",
          border: filled ? `1px solid ${axisColor}` : `1px solid rgba(255,255,255,0.18)`,
          borderRadius: 2,
        }}
      />,
    );
  }
  // For very-high (level 4), add a fourth filled square in a brighter accent.
  if (level >= 4) {
    fills.push(
      <div
        key="vh"
        style={{
          width: 14,
          height: 7,
          background: axisColor,
          border: `1px solid ${axisColor}`,
          borderRadius: 2,
          boxShadow: `0 0 6px ${axisColor}`,
        }}
      />,
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <T color="rgba(255,255,255,0.65)" center size={11}>
        {label}
      </T>
      <div style={{ display: "flex", gap: 3 }}>{fills}</div>
    </div>
  );
}

export const ChunkingDecision = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Six Strategies, One Page
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Chapters 12.7 to 12.12 each introduced one chunking strategy. Lined up side by side, each one has its own
            quality, cost, and implementation profile. The first meter is retrieval quality (higher is better), the
            second is embedding cost at chunk time, the third is implementation difficulty.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {CHUNKING_STRATEGIES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}30`,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <T color={C.cyan} bold center size={16}>
                  {s.name}
                </T>
                <T color="rgba(255,255,255,0.55)" center size={11}>
                  Chapter {s.chapter}
                </T>
                <T color="#80deea" center size={13}>
                  {s.summary}
                </T>
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    justifyContent: "space-around",
                    gap: 8,
                    padding: 8,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${C.cyan}24`,
                  }}
                >
                  <MiniMeter label="Quality" level={s.quality} axisColor={C.green} />
                  <MiniMeter label="Cost" level={s.cost} axisColor={C.orange} />
                  <MiniMeter label="Implementation" level={s.difficulty} axisColor={C.red} />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              No strategy wins on all three axes. Fixed-Size is cheapest but loses quality; Contextual gives the highest
              retrieval quality but adds index-time LLM cost. The next three sub-steps pick the right one along three
              axes: doc structure, query type, and budget.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Axis 1: What Structure Do Your Docs Have?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Structure constrains the chunker more than the content does. Markdown and HTML come with built-in split
            points; PDFs and code have predictable shapes; flat narrative prose has none of these and forces a
            content-aware strategy.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {DOC_STRUCTURE_ROWS.map((row) => (
              <div
                key={row.type}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}24`,
                  borderLeft: `4px solid ${C.green}`,
                  textAlign: "left",
                }}
              >
                <T color={C.green} bold size={15}>
                  {row.type}
                </T>
                <T color="#a5d6a7" size={14} style={{ marginTop: 4 }}>
                  {row.recommendation}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              The single biggest signal is whether your corpus has explicit split points. If yes, Recursive Structural
              is almost always the right starting baseline. Only flat narrative forces you up the cost ladder to
              Semantic on day one.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Axis 2: What Kinds Of Queries Will You Get?
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Query shape changes which chunk size and which retrieval pattern wins. Factual lookups want small,
            high-precision chunks; relational and comparative questions want enough surrounding context to reason across
            entities.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "180px 200px 1fr",
              gap: 1,
              background: `${C.purple}24`,
              border: `1px solid ${C.purple}30`,
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Query Type
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Example
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}24`,
                textAlign: "center",
              }}
            >
              <T color={C.purple} bold center size={13}>
                Recommendation
              </T>
            </div>
            {QUERY_TYPE_ROWS.map((row) => (
              <div key={row.query} style={{ display: "contents" }}>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.purple} bold center size={14}>
                    {row.query}
                  </T>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "center",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  <T color="#b8a9ff" center size={13}>
                    &ldquo;{row.example}&rdquo;
                  </T>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${C.purple}06`,
                    textAlign: "left",
                  }}
                >
                  <T color="#b8a9ff" size={13}>
                    {row.advice}
                  </T>
                </div>
              </div>
            ))}
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
              Hierarchical is the safest middle bet: it serves factual queries through its leaves and relational queries
              through its parents. Comparative queries on top of any chunking still need multi-hop retrieval (chapter
              12.28).
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Axis 3: What's Your Indexing Budget?
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Chunking cost is a one-time index-time spend, but it scales with corpus size. Lab corpora are free to chunk;
            startup corpora can absorb a Hierarchical pass; enterprise corpora pay for the full augmented stack because
            the recall gains justify it.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <svg
              viewBox={`0 0 ${COST_VIEW_W} ${COST_VIEW_H}`}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <desc>
                Horizontal cost-budget scale with three tier markers labeled lab, startup, and enterprise, each with a
                recommended chunking stack listed underneath.
              </desc>
              {/* Spine line */}
              <line
                x1={80}
                y1={90}
                x2={COST_VIEW_W - 80}
                y2={90}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={2}
                strokeDasharray="4 6"
              />
              {/* Arrow head on right */}
              <polygon
                points={`${COST_VIEW_W - 80},82 ${COST_VIEW_W - 64},90 ${COST_VIEW_W - 80},98`}
                fill="rgba(255,255,255,0.45)"
              />
              {/* Three tier markers - equally spaced */}
              {COST_TIERS.map((tier, i) => {
                const x = 120 + i * 240;
                return (
                  <g key={tier.name}>
                    <circle cx={x} cy={90} r={14} fill={tier.color} stroke={tier.color} strokeWidth={2} />
                    <text
                      x={x}
                      y={56}
                      textAnchor="middle"
                      fontSize={15}
                      fontWeight={700}
                      fill={tier.color}
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {tier.name}
                    </text>
                    <text
                      x={x}
                      y={130}
                      textAnchor="middle"
                      fontSize={13}
                      fill={tier.accent}
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    >
                      {tier.cost}
                    </text>
                  </g>
                );
              })}
              {/* Axis label */}
              <text
                x={COST_VIEW_W / 2}
                y={168}
                textAnchor="middle"
                fontSize={11}
                fill="rgba(255,255,255,0.55)"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                Indexing Budget Grows Left To Right
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            {COST_TIERS.map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${tier.color}06`,
                  border: `1px solid ${tier.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={tier.color} bold center size={15}>
                  {tier.name}
                </T>
                <T color="rgba(255,255,255,0.55)" center size={11} style={{ marginTop: 4 }}>
                  {tier.cost}
                </T>
                <T color={tier.accent} center size={13} style={{ marginTop: 8 }}>
                  {tier.recipe}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Cost climbs with augmentation, not with chunking itself. Recursive Structural is free to run; Contextual
              Retrieval is the big spike because it fires an LLM call per chunk. Treat the spike as a one-time index
              cost amortized across every future query.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Walkthrough: Picking Strategies For The Customer Support Corpus
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            The customer support corpus we have used throughout the section splits into three doc-types with three
            different profiles. The right answer is not one strategy: it is a mix. Each row below picks the strategy
            using the three axes from sub-steps 1 to 3.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "180px 260px 1fr",
              gap: 1,
              background: `${C.red}24`,
              border: `1px solid ${C.red}30`,
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Doc-Type
              </T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Profile
              </T>
            </div>
            <div style={{ padding: "10px 12px", background: `${C.red}24`, textAlign: "center" }}>
              <T color={C.red} bold center size={13}>
                Recommended Strategy
              </T>
            </div>
            {SUPPORT_WALKTHROUGH.map((row) => (
              <div key={row.category} style={{ display: "contents" }}>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "center" }}>
                  <T color={C.red} bold center size={14}>
                    {row.category}
                  </T>
                </div>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "left" }}>
                  <T color="#ef9a9a" size={13}>
                    {row.profile}
                  </T>
                </div>
                <div style={{ padding: "12px 14px", background: `${C.red}06`, textAlign: "left" }}>
                  <T color="#ef9a9a" size={13}>
                    {row.recommendation}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}10`,
              border: `1px solid ${C.red}40`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={16}>
              Production Chunking Is Rarely One Strategy
            </T>
            <T color="#ef9a9a" center size={14} style={{ marginTop: 6 }}>
              Mix per doc-type, measure recall, iterate. The 30-doc support corpus uses three different chunking recipes
              - Contextual for FAQ-style billing docs, Hierarchical for technical product features, and Semantic for
              free-form troubleshooting runbooks.
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}30`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              Chapters 12.14 - 12.17 move to embedding model choice and how chunking interacts with embedding quality.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};
