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
            The fix is a tiny architectural change: before the model answers, fetch the relevant documents and stuff
            them into the prompt. The model now reads first, answers second.
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
              <text x="497.5" y="22" textAnchor="middle" fill={C.yellow} fontSize="12" fontWeight="bold">
                Query Time (Online)
              </text>
              {/* Phase divider */}
              <line
                x1="397.5"
                y1="30"
                x2="397.5"
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
            12.4-12.10.
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
            (more in chapter 12.11). Production typically uses 1024-dim vectors; we show 8 here for visibility.
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

export const WhereNaiveRAGBreaks = (ctx) => {
  const { sub } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Where Naive RAG Breaks (stub)
          </T>
        </Box>
      )}
    </div>
  );
};
