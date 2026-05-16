import { Box, T, Reveal } from "../components.jsx";
import { C } from "../config.js";

// Stub exports - full content added in subsequent tasks (Section 12 Milestone 3).
// Act 4 (Embed & Index Choices for RAG): 12.14-12.17
// Act 5 (Query Transformation): 12.18-12.21

// ───────────────────────────────────────────────────────────────
// 12.14 EmbeddingModelChoice - the embedding model decides recall ceiling
// ───────────────────────────────────────────────────────────────

// Recall ceiling on the running customer-support corpus.
// Real ballpark numbers: older OpenAI ada-002 around 0.62, modern Cohere v3
// around 0.83, BGE-large around 0.81. Used in sub=0 to motivate the chapter.
const RECALL_CEILING_ROWS = [
  { model: "OpenAI ada-002 (Older)", recall: 0.62, color: C.red, accent: "#ef9a9a" },
  { model: "Cohere embed-v3", recall: 0.83, color: C.green, accent: "#a5d6a7" },
  { model: "BGE-Large", recall: 0.81, color: C.cyan, accent: "#80deea" },
];

// Five-axis decision matrix used in sub=1. Columns:
// Model | Dim | Multilingual | Domain | Cost | Max Context.
const MODEL_AXES = [
  {
    model: "OpenAI text-embedding-3-large",
    dim: "3072",
    multilingual: "Yes",
    domain: "General",
    cost: "$0.13 / M Tokens",
    context: "8191",
  },
  {
    model: "Cohere embed-v3",
    dim: "1024",
    multilingual: "Yes",
    domain: "General",
    cost: "$0.10 / M Tokens",
    context: "512",
  },
  {
    model: "BGE-Large",
    dim: "1024",
    multilingual: "EN + CN",
    domain: "General",
    cost: "Free Self-Host",
    context: "512",
  },
  {
    model: "SBERT all-mpnet-base",
    dim: "768",
    multilingual: "English Mostly",
    domain: "General",
    cost: "Free Self-Host",
    context: "384",
  },
  {
    model: "Voyage-2",
    dim: "1024",
    multilingual: "Yes",
    domain: "Domain Variants Available",
    cost: "$0.10 / M Tokens",
    context: "16000",
  },
];

// Dimension vs memory at 1M vectors. 4 bytes per float32 element.
// d=384 -> 384 * 4 * 1e6 = ~1.5 GB. d=3072 -> ~12 GB. Used in sub=2.
const DIM_MEMORY_ROWS = [
  { dim: 384, gb: 1.5, color: C.green, accent: "#a5d6a7" },
  { dim: 768, gb: 3, color: C.cyan, accent: "#80deea" },
  { dim: 1024, gb: 4, color: C.yellow, accent: "#ffe082" },
  { dim: 3072, gb: 12, color: C.red, accent: "#ef9a9a" },
];

// 2x2 multilingual vs domain matrix used in sub=3.
const LANG_MATRIX = [
  {
    row: "Model = English-Only (E.g., SBERT)",
    cells: [
      { data: "Your Data = English Only", note: "Best Quality, Smallest Dim, Cheapest." },
      { data: "Your Data = Multilingual", note: "Will Fail On Non-English Queries." },
    ],
  },
  {
    row: "Model = Multilingual (E.g., Cohere V3)",
    cells: [
      { data: "Your Data = English Only", note: "Quality Slightly Worse, Extra Capacity Wasted." },
      { data: "Your Data = Multilingual", note: "Use Multilingual. The Right Tool For The Job." },
    ],
  },
];

// Cost at 100M token ingest, three options. Used in sub=4.
const COST_ROWS = [
  {
    model: "OpenAI text-embedding-3-large",
    formula: "100M / 1M x $0.13",
    total: "$13,000",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    model: "Cohere embed-v3",
    formula: "100M / 1M x $0.10",
    total: "$10,000",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    model: "Self-Hosted BGE On g5.xlarge (2 Days)",
    formula: "$1.006 / Hour x 48 Hours",
    total: "~$50",
    color: C.green,
    accent: "#a5d6a7",
  },
];

// 4-step decision flow used in sub=5 (rendered as SVG).
// step text is the question, yes/no branches in the side labels.
const DECISION_STEPS = [
  { question: "Need Multilingual?", yes: "Use Cohere V3 / Voyage / OpenAI 3-Large", no: "Go On" },
  { question: "Specialized Domain?", yes: "Domain-Tuned BGE Or Fine-Tune (See 12.15)", no: "Go On" },
  { question: "Budget Sensitive?", yes: "Self-Host BGE", no: "Go On" },
  { question: "Default", yes: "OpenAI text-embedding-3-large Or Cohere embed-v3", no: null },
];

export const EmbeddingModelChoice = (ctx) => {
  const { sub } = ctx;

  // SVG geometry for the sub=5 decision flowchart.
  // Each step is a horizontal row: question card on left, arrow, yes-branch on right.
  // We center the entire content horizontally inside the viewBox.
  const FLOW_VIEW_W = 720;
  const ROW_H = 80;
  const ROW_GAP = 14;
  const Q_W = 220;
  const Y_W = 360;
  const ARROW_W = 50;
  const FLOW_SPAN = Q_W + ARROW_W + Y_W;
  const FLOW_X_START = (FLOW_VIEW_W - FLOW_SPAN) / 2;
  const FLOW_VIEW_H = DECISION_STEPS.length * (ROW_H + ROW_GAP) + 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why the embedding model decides retrieval ceiling */}
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The Embedding Model Decides The Recall Ceiling
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Chunking decides how text is split. The embedding model decides what those chunks mean as vectors (recap
            from Section 5.2). Two systems on the same corpus, with the same chunks and the same vector DB, can have
            wildly different recall just because one uses a stronger embedding model. The chosen model sets a hard
            ceiling: no reranker or hybrid trick can recover documents your embedder failed to bring close enough in the
            first place.
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
              Recall@10 On The Support Corpus (Same Chunks, Same Index)
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {RECALL_CEILING_ROWS.map((r) => (
                <div
                  key={r.model}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr 70px",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <T color={r.accent} size={14}>
                    {r.model}
                  </T>
                  <div
                    style={{
                      height: 18,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.recall * 100}%`,
                        height: "100%",
                        background: r.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <T color={r.accent} bold size={14} style={{ textAlign: "right" }}>
                    {r.recall.toFixed(2)}
                  </T>
                </div>
              ))}
            </div>
            <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
              Recall is "did the right doc land in the top 10?" Higher is better.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Five-axis decision matrix */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Five Axes That Matter
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Every embedding model trades off the same five dimensions. Memorize this table and most "which embedder
            should I use?" questions answer themselves.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1.6fr repeat(5, 1fr)",
              gap: 6,
              textAlign: "center",
            }}
          >
            {/* Header row */}
            {["Model", "Dim", "Multilingual", "Domain", "Cost", "Max Context"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.cyan}12`,
                  border: `1px solid ${C.cyan}30`,
                }}
              >
                <T color={C.cyan} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {/* Data rows */}
            {MODEL_AXES.map((row) => (
              <ModelRowCells key={row.model} row={row} />
            ))}
          </div>

          <T color="rgba(255,255,255,0.55)" center size={13} style={{ marginTop: 12 }}>
            Dim = output vector length. Multilingual = trained on multiple languages. Domain = general purpose vs.
            specialized. Cost = price per million input tokens (or self-host). Max Context = longest single input.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Dimension memory tradeoff */}
      <Reveal when={sub >= 2}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Higher Dim Costs More Memory And Compute
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            Every dimension is a 4-byte float. Memory scales linearly with dim. At 1 million vectors, the difference
            between d=384 and d=3072 is 1.5 GB versus 12 GB - same corpus, 8x the RAM bill and 8x the dot-product cost
            at query time.
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
            <T color={C.pink} bold center size={16}>
              Memory Footprint At 1M Vectors (Float32)
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {DIM_MEMORY_ROWS.map((r) => (
                <div
                  key={r.dim}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr 80px",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <T color={r.accent} bold size={14}>
                    d = {r.dim}
                  </T>
                  <div
                    style={{
                      height: 18,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(r.gb / 12) * 100}%`,
                        height: "100%",
                        background: r.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <T color={r.accent} bold size={14} style={{ textAlign: "right" }}>
                    {r.gb} GB
                  </T>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f5b7f8" center size={14}>
              Bigger dim helps quality up to a point. Beyond ~1024 the marginal gain shrinks fast - returns diminish
              while memory and compute keep growing linearly. 1024 is the sweet spot for most production systems.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Multilingual + domain match */}
      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Multilingual Models Underperform On English-Only Data
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            A multilingual model spends representation capacity on every language it was trained on. If your corpus is
            only English, that extra capacity is wasted and the English representation is slightly weaker than a
            same-size English-only model. Match the model's language coverage to your data.
          </T>

          {/* 2x2 grid: rows = model type, cols = data type */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "180px 1fr 1fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            <div /> {/* spacer for row-label column */}
            {["Your Data = English Only", "Your Data = Multilingual"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.blue}12`,
                  border: `1px solid ${C.blue}30`,
                }}
              >
                <T color={C.blue} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}
            {LANG_MATRIX.map((r) => (
              <LangRowCells key={r.row} row={r} />
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color="#90caf9" center size={14}>
              If your corpus is medical, legal, or code, off-the-shelf general models often underperform a domain-tuned
              model. Domain adaptation and fine-tuning are covered in chapter 12.15.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Cost at scale */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Cost Math At 100M Token Ingest
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Ingesting a 100M-token corpus is a one-time charge but it dominates the bill. The same corpus runs from ~$50
            (self-hosted GPU for two days) to $13,000 (managed API on the largest OpenAI model). Map your corpus size to
            a cost tier before picking the model.
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
            {COST_ROWS.map((c) => (
              <div
                key={c.model}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${c.color}06`,
                  border: `1px solid ${c.color}12`,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <T color={c.accent} bold center size={15}>
                  {c.model}
                </T>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${c.color}24`,
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  <T color="rgba(255,255,255,0.7)" center size={13}>
                    {c.formula}
                  </T>
                </div>
                <T color={c.accent} bold center size={20}>
                  {c.total}
                </T>
              </div>
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
              Self-hosting is dramatically cheaper at scale. Managed APIs win on operational simplicity for small
              corpora where the per-token rate is rounding error compared to engineering time.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── MTEB caveat + decision flow */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            MTEB Is A Hint, Not An Answer
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            MTEB is a public benchmark with 50+ retrieval and classification tasks. It is the best public signal we have
            for ranking embedding models - and it is also the trap most teams fall into.
          </T>

          {/* Yellow tinted caveat callout inside green box */}
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
              The MTEB Caveat
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 8 }}>
              MTEB is a public leaderboard. Models can be over-fit to it: trained on data resembling the test sets,
              tuned for MTEB metrics, or both. The leader on MTEB may underperform on YOUR data. Always run a small eval
              on your own queries before committing.
            </T>
          </div>

          {/* Decision flowchart SVG */}
          <T color={C.green} bold center size={16} style={{ marginTop: 16 }}>
            The Four-Step Decision Flow
          </T>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FLOW_VIEW_W} ${FLOW_VIEW_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Four-step decision flowchart for picking an embedding model: ask whether multilingual is needed, whether
                the corpus is specialized, whether budget is sensitive, then default to OpenAI text-embedding-3-large or
                Cohere embed-v3.
              </desc>

              {DECISION_STEPS.map((step, i) => {
                const rowY = 10 + i * (ROW_H + ROW_GAP);
                const qX = FLOW_X_START;
                const arrowX = qX + Q_W;
                const yX = arrowX + ARROW_W;
                const isDefault = step.no === null;
                const stepColor = isDefault ? C.green : C.cyan;
                const stepAccent = isDefault ? "#a5d6a7" : "#80deea";
                return (
                  <g key={step.question}>
                    {/* Question card */}
                    <rect
                      x={qX}
                      y={rowY}
                      width={Q_W}
                      height={ROW_H}
                      rx={8}
                      fill={`${stepColor}10`}
                      stroke={stepColor}
                      strokeWidth="1.5"
                    />
                    <text
                      x={qX + Q_W / 2}
                      y={rowY + ROW_H / 2 - 6}
                      fill={stepAccent}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Step {i + 1}
                    </text>
                    <text
                      x={qX + Q_W / 2}
                      y={rowY + ROW_H / 2 + 16}
                      fill={stepAccent}
                      fontSize="14"
                      textAnchor="middle"
                    >
                      {step.question}
                    </text>

                    {/* Arrow */}
                    <line
                      x1={arrowX + 4}
                      y1={rowY + ROW_H / 2}
                      x2={yX - 6}
                      y2={rowY + ROW_H / 2}
                      stroke={stepAccent}
                      strokeWidth="2"
                    />
                    <polygon
                      points={`${yX - 6},${rowY + ROW_H / 2 - 5} ${yX - 6},${rowY + ROW_H / 2 + 5} ${yX},${rowY + ROW_H / 2}`}
                      fill={stepAccent}
                    />

                    {/* Yes branch (or default) */}
                    <rect
                      x={yX}
                      y={rowY}
                      width={Y_W}
                      height={ROW_H}
                      rx={8}
                      fill={`${stepColor}06`}
                      stroke={stepColor}
                      strokeWidth="1"
                      strokeDasharray={isDefault ? "0" : "0"}
                    />
                    <text
                      x={yX + Y_W / 2}
                      y={rowY + ROW_H / 2 - 6}
                      fill={stepAccent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {isDefault ? "Default Pick" : "Yes"}
                    </text>
                    <text
                      x={yX + Y_W / 2}
                      y={rowY + ROW_H / 2 + 14}
                      fill={stepAccent}
                      fontSize="13"
                      textAnchor="middle"
                    >
                      {step.yes}
                    </text>

                    {/* Down arrow to next row (No branch = go on) */}
                    {!isDefault && (
                      <>
                        <line
                          x1={qX + Q_W / 2}
                          y1={rowY + ROW_H + 1}
                          x2={qX + Q_W / 2}
                          y2={rowY + ROW_H + ROW_GAP - 1}
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1.5"
                        />
                        <text
                          x={qX + Q_W / 2 + 18}
                          y={rowY + ROW_H + ROW_GAP / 2 + 4}
                          fill="rgba(255,255,255,0.55)"
                          fontSize="11"
                          textAnchor="start"
                        >
                          No
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
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
            }}
          >
            <T color="#a5d6a7" center size={14}>
              Follow the flow top to bottom. Each "No" sends you to the next question. Land on the default only if none
              of the above pulled you off. Then run your eval on your own data before locking it in.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// Helper: render one row of the 5-axis model matrix in sub=1.
function ModelRowCells({ row }) {
  const cellStyle = {
    padding: "8px 6px",
    borderRadius: 6,
    background: `${C.cyan}06`,
    border: `1px solid ${C.cyan}18`,
  };
  return (
    <>
      <div style={cellStyle}>
        <T color="#80deea" bold center size={13}>
          {row.model}
        </T>
      </div>
      <div style={cellStyle}>
        <T color="rgba(255,255,255,0.75)" center size={13}>
          {row.dim}
        </T>
      </div>
      <div style={cellStyle}>
        <T color="rgba(255,255,255,0.75)" center size={13}>
          {row.multilingual}
        </T>
      </div>
      <div style={cellStyle}>
        <T color="rgba(255,255,255,0.75)" center size={13}>
          {row.domain}
        </T>
      </div>
      <div style={cellStyle}>
        <T color="rgba(255,255,255,0.75)" center size={13}>
          {row.cost}
        </T>
      </div>
      <div style={cellStyle}>
        <T color="rgba(255,255,255,0.75)" center size={13}>
          {row.context}
        </T>
      </div>
    </>
  );
}

// Helper: render one row of the 2x2 language-model x data-language matrix in sub=3.
function LangRowCells({ row }) {
  return (
    <>
      <div
        style={{
          padding: "8px 6px",
          borderRadius: 6,
          background: `${C.blue}12`,
          border: `1px solid ${C.blue}30`,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <T color={C.blue} bold center size={13}>
          {row.row}
        </T>
      </div>
      {row.cells.map((c) => (
        <div
          key={c.data}
          style={{
            padding: 10,
            borderRadius: 6,
            background: `${C.blue}06`,
            border: `1px solid ${C.blue}18`,
            textAlign: "center",
          }}
        >
          <T color="#90caf9" center size={13}>
            {c.note}
          </T>
        </div>
      ))}
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// 12.15 DomainAdaptation - fine-tune embeddings on your own corpus
// ───────────────────────────────────────────────────────────────

// Medical-domain semantic gap pairs used in sub=0. Off-the-shelf models score
// these pairs too low because the abbreviations (MI, tPA) are rare in their
// pretraining data. A fine-tuned medical embedder pulls them close.
const DOMAIN_GAP_PAIRS = [
  {
    a: "MI",
    b: "Myocardial infarction",
    offShelf: 0.42,
    fineTuned: 0.95,
  },
  {
    a: "tPA contraindicated",
    b: "Tissue plasminogen activator should not be given",
    offShelf: 0.51,
    fineTuned: 0.9,
  },
];

// Recall on a held-out medical query set. Used in sub=0 to show the practical
// impact of the off-the-shelf semantic gap.
const RECALL_BARS = [
  { label: "Off-The-Shelf Embedder", recall: 0.62, color: C.red, accent: "#ef9a9a" },
  { label: "Fine-Tuned On Medical Corpus", recall: 0.88, color: C.green, accent: "#a5d6a7" },
];

// Three training triples drawn from the running support corpus. Each row pairs
// a real user query with a positive chunk and a hard negative from the same
// vector neighborhood (so the model has to learn the actual semantic boundary
// instead of memorizing surface tokens). Used in sub=2.
const TRAINING_TRIPLES = [
  {
    anchor: "How do I reset my password?",
    positive: "[doc-1, chunk 1] - To reset your password, visit the account settings page and click Forgot Password.",
    negative: "[doc-3, chunk 1] - Refunds are processed within 5-7 business days of approval.",
  },
  {
    anchor: "I can't sign in",
    positive: "[doc-25] - Login Troubleshooting: clear cookies, verify caps lock, and check for typos in your email.",
    negative: "[doc-7] - Dashboard tour: the home screen shows your usage metrics and recent activity.",
  },
  {
    anchor: "Cancel my subscription",
    positive: "[doc-15] - Account Deletion Flow: go to billing settings and click Cancel Plan to stop renewal.",
    negative: "[doc-2] - Email Change: update your contact email from the profile settings page.",
  },
];

// Two-column decision card for sub=3.
const FINE_TUNE_DECISION = {
  fineTune: [
    "Highly Specialized Vocabulary (Medical, Legal, Code)",
    "Off-The-Shelf Recall Below 80% On Your Golden Set",
    "You Have 5k+ Query-Positive Pairs Labeled",
    "Budget For Periodic Re-Training As Embeddings Drift",
  ],
  skip: [
    "General English Domain",
    "Common Domain (E-Commerce, Support, News)",
    "Less Than 5k Labeled Pairs Available",
    "Recall Already Above 80% On The Golden Set",
  ],
};

// Before vs after metrics on the support corpus. Used in sub=4. Recall and MRR
// jump after fine-tuning; latency does not - fine-tuning improves quality not speed.
const BEFORE_AFTER_METRICS = [
  { metric: "Recall@5", before: 0.78, after: 0.91, fmt: (v) => v.toFixed(2), unit: "" },
  { metric: "MRR", before: 0.62, after: 0.84, fmt: (v) => v.toFixed(2), unit: "" },
  { metric: "Latency", before: 30, after: 30, fmt: (v) => v.toString(), unit: " ms" },
];

// Loss curve points (epoch -> training loss). 3 epochs is typical for a
// triplet-loss fine-tune on 50k pairs. Used in sub=4.
const LOSS_CURVE = [
  { epoch: 0, loss: 0.5 },
  { epoch: 1, loss: 0.22 },
  { epoch: 2, loss: 0.1 },
  { epoch: 3, loss: 0.05 },
];

export const DomainAdaptation = (ctx) => {
  const { sub } = ctx;

  // SVG geometry for the triplet-loss diagram in sub=1.
  // Three labeled points: anchor (center), positive (near), negative (far).
  const TRIPLET_VIEW_W = 520;
  const TRIPLET_VIEW_H = 260;
  const ANCHOR_X = TRIPLET_VIEW_W / 2;
  const ANCHOR_Y = TRIPLET_VIEW_H / 2;
  const POS_DX = 90;
  const POS_DY = -50;
  const NEG_DX = 180;
  const NEG_DY = 70;
  const POS_X = ANCHOR_X - POS_DX;
  const POS_Y = ANCHOR_Y + POS_DY;
  const NEG_X = ANCHOR_X + NEG_DX;
  const NEG_Y = ANCHOR_Y + NEG_DY;

  // SVG geometry for the before/after bar chart in sub=4.
  const BAR_VIEW_W = 600;
  const BAR_VIEW_H = 220;
  const BAR_GROUP_W = 140;
  const BAR_GAP = 40;
  const BAR_W = 50;
  const BAR_INNER_GAP = 10;
  const BAR_BASELINE_Y = 180;
  const BAR_MAX_H = 130;
  const BARS_SPAN = BEFORE_AFTER_METRICS.length * BAR_GROUP_W + (BEFORE_AFTER_METRICS.length - 1) * BAR_GAP;
  const BARS_X_START = (BAR_VIEW_W - BARS_SPAN) / 2;

  // SVG geometry for the loss curve in sub=4.
  const LOSS_VIEW_W = 520;
  const LOSS_VIEW_H = 200;
  const LOSS_PAD_L = 70;
  const LOSS_PAD_R = 40;
  const LOSS_PAD_T = 30;
  const LOSS_PAD_B = 40;
  const LOSS_PLOT_W = LOSS_VIEW_W - LOSS_PAD_L - LOSS_PAD_R;
  const LOSS_PLOT_H = LOSS_VIEW_H - LOSS_PAD_T - LOSS_PAD_B;
  const LOSS_MAX = 0.5;
  const lossX = (e) => LOSS_PAD_L + (e / (LOSS_CURVE.length - 1)) * LOSS_PLOT_W;
  const lossY = (v) => LOSS_PAD_T + (1 - v / LOSS_MAX) * LOSS_PLOT_H;
  const lossPath = LOSS_CURVE.map((p, i) => `${i === 0 ? "M" : "L"} ${lossX(p.epoch)} ${lossY(p.loss)}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Off-the-shelf gap on a specialized domain */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Off-The-Shelf Embeddings Sometimes Miss Domain Semantics
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            General-purpose embedding models are trained on web text. They know "cat" and "dog" are similar but they
            have barely seen MI (myocardial infarction) or tPA (tissue plasminogen activator). On a medical corpus, this
            shows up as low similarity between an abbreviation and its full term - and that wrecks retrieval.
          </T>

          {/* Two domain-pair examples with before/after cosine */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Cosine Similarity On A Medical Corpus
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {DOMAIN_GAP_PAIRS.map((p) => (
                <div
                  key={p.a}
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${C.cyan}18`,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold center size={14}>
                    &quot;{p.a}&quot; Vs &quot;{p.b}&quot;
                  </T>
                  <div
                    style={{
                      marginTop: 8,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: 6,
                        borderRadius: 4,
                        background: `${C.red}06`,
                        border: `1px solid ${C.red}24`,
                      }}
                    >
                      <T color="#ef9a9a" center size={12}>
                        Off-The-Shelf
                      </T>
                      <T color="#ef9a9a" bold center size={16}>
                        {p.offShelf.toFixed(2)}
                      </T>
                    </div>
                    <div
                      style={{
                        padding: 6,
                        borderRadius: 4,
                        background: `${C.green}06`,
                        border: `1px solid ${C.green}24`,
                      }}
                    >
                      <T color="#a5d6a7" center size={12}>
                        Fine-Tuned (Target)
                      </T>
                      <T color="#a5d6a7" bold center size={16}>
                        {p.fineTuned.toFixed(2)}
                      </T>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recall bar chart */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold center size={16}>
              Recall@10 On A Held-Out Medical Query Set
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {RECALL_BARS.map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr 70px",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <T color={r.accent} size={14}>
                    {r.label}
                  </T>
                  <div
                    style={{
                      height: 18,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${r.recall * 100}%`,
                        height: "100%",
                        background: r.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <T color={r.accent} bold size={14} style={{ textAlign: "right" }}>
                    {r.recall.toFixed(2)}
                  </T>
                </div>
              ))}
            </div>
            <T color="rgba(255,255,255,0.55)" center size={12} style={{ marginTop: 10 }}>
              26-point recall lift. That is the value of teaching the embedder your domain.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Contrastive learning + triplet loss */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Contrastive Fine-Tuning: Pull Positives Close, Push Negatives Away
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            We do not retrain the embedder from scratch. We take the existing model and nudge its vector space using
            triples: an anchor query, a positive document that should match it, and a negative document that should not.
            Each training step pulls the anchor closer to the positive and pushes it farther from the negative.
          </T>

          {/* Triplet diagram SVG */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg
              viewBox={`0 0 ${TRIPLET_VIEW_W} ${TRIPLET_VIEW_H}`}
              width="100%"
              style={{ maxWidth: 520, height: "auto" }}
            >
              <desc>
                Triplet-loss diagram showing an anchor point in the center with arrows pulling a positive sample close
                and pushing a negative sample away.
              </desc>

              {/* Pull arrow (anchor -> positive) */}
              <defs>
                <marker
                  id="arrow-pull"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5d6a7" />
                </marker>
                <marker
                  id="arrow-push"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef9a9a" />
                </marker>
              </defs>

              {/* Pull (anchor -> positive): green */}
              <line
                x1={ANCHOR_X}
                y1={ANCHOR_Y}
                x2={POS_X + 18}
                y2={POS_Y + 8}
                stroke="#a5d6a7"
                strokeWidth="2"
                markerEnd="url(#arrow-pull)"
              />
              <text
                x={(ANCHOR_X + POS_X) / 2 - 30}
                y={(ANCHOR_Y + POS_Y) / 2 + 25}
                fill="#a5d6a7"
                fontSize="13"
                textAnchor="middle"
              >
                Pull Close
              </text>

              {/* Push (anchor -> negative): red */}
              <line
                x1={ANCHOR_X}
                y1={ANCHOR_Y}
                x2={NEG_X - 18}
                y2={NEG_Y - 8}
                stroke="#ef9a9a"
                strokeWidth="2"
                markerEnd="url(#arrow-push)"
              />
              <text
                x={(ANCHOR_X + NEG_X) / 2 + 8}
                y={(ANCHOR_Y + NEG_Y) / 2 - 35}
                fill="#ef9a9a"
                fontSize="13"
                textAnchor="middle"
              >
                Push Away
              </text>

              {/* Anchor point */}
              <circle cx={ANCHOR_X} cy={ANCHOR_Y} r="14" fill={`${C.purple}40`} stroke={C.purple} strokeWidth="2" />
              <text x={ANCHOR_X} y={ANCHOR_Y + 5} fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                A
              </text>
              <text x={ANCHOR_X} y={ANCHOR_Y + 34} fill="#b8a9ff" fontSize="13" textAnchor="middle">
                Anchor (Query)
              </text>

              {/* Positive point */}
              <circle cx={POS_X} cy={POS_Y} r="14" fill={`${C.green}40`} stroke={C.green} strokeWidth="2" />
              <text x={POS_X} y={POS_Y + 5} fill="#a5d6a7" fontSize="14" fontWeight="700" textAnchor="middle">
                P
              </text>
              <text x={POS_X} y={POS_Y - 22} fill="#a5d6a7" fontSize="13" textAnchor="middle">
                Positive (Match)
              </text>

              {/* Negative point */}
              <circle cx={NEG_X} cy={NEG_Y} r="14" fill={`${C.red}40`} stroke={C.red} strokeWidth="2" />
              <text x={NEG_X} y={NEG_Y + 5} fill="#ef9a9a" fontSize="14" fontWeight="700" textAnchor="middle">
                N
              </text>
              <text x={NEG_X} y={NEG_Y + 34} fill="#ef9a9a" fontSize="13" textAnchor="middle">
                Negative (Wrong)
              </text>
            </svg>
          </div>

          {/* Triplet loss formula */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.purple} bold center size={14}>
              Triplet Loss Formula
            </T>
            <T color="#b8a9ff" center size={18} style={{ marginTop: 8 }}>
              L_triplet = max(0, d(A, P) - d(A, N) + margin)
            </T>
            <T color="rgba(255,255,255,0.6)" center size={13} style={{ marginTop: 8 }}>
              d = distance, A = anchor, P = positive, N = negative, margin = 0.2 typical.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              The loss is zero only when the negative is at least &quot;margin&quot; farther from the anchor than the
              positive. If the negative is too close, the gradient pushes it away. The margin prevents the loss from
              going to zero just because positives are slightly closer than negatives.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Training data construction */}
      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Pair Construction Decides Quality
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The training data IS the model. Each row is one triple: an anchor (real user query), a positive (the chunk
            that should match), and a negative (a chunk that should not). For our support corpus that means turning real
            tickets and FAQs into thousands of these rows.
          </T>

          {/* Training triples table */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr 1.4fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {/* Header row */}
            {["Anchor (Query)", "Positive (Match)", "Negative (Wrong)"].map((h, i) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: i === 0 ? `${C.blue}12` : i === 1 ? `${C.green}12` : `${C.red}12`,
                  border: `1px solid ${i === 0 ? C.blue : i === 1 ? C.green : C.red}30`,
                }}
              >
                <T color={i === 0 ? C.blue : i === 1 ? C.green : C.red} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {/* Data rows */}
            {TRAINING_TRIPLES.map((t) => (
              <TripleRowCells key={t.anchor} triple={t} />
            ))}
          </div>

          {/* Hard negatives callout */}
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
            <T color={C.yellow} bold center size={15}>
              Hard Negatives Teach The Most
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 8 }}>
              A &quot;hard negative&quot; is a doc that sits NEAR the positive in vector space but is irrelevant - same
              vocabulary, wrong topic. Mining hard negatives (top-20 retrieval results minus the true positive) teaches
              the model the actual semantic boundary. Easy negatives (random docs from unrelated topics) waste compute
              because the gap is already obvious to the base model.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── When to fine-tune */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            When Is Fine-Tuning Worth The Cost?
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Fine-tuning takes labeled data, compute time, and a recurring re-training budget as your corpus drifts.
            Spend it when off-the-shelf is clearly failing on your domain. Skip it when general-purpose embedders
            already clear the bar.
          </T>

          {/* Decision card: two columns */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              textAlign: "center",
            }}
          >
            {/* Fine-tune column */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                Fine-Tune
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {FINE_TUNE_DECISION.fineTune.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.25)",
                      border: `1px solid ${C.green}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {row}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Skip column */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}24`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                Skip - Use Off-The-Shelf
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {FINE_TUNE_DECISION.skip.map((row) => (
                  <div
                    key={row}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.25)",
                      border: `1px solid ${C.red}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
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
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              The cleanest signal: build a small golden set (200-500 query-positive pairs) and measure recall with the
              off-the-shelf model. Below 80%, fine-tuning is usually worth it. Above 80%, the marginal gain rarely pays
              for the recurring training cost.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Before vs after on the support corpus */}
      <Reveal when={sub >= 4}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Before Vs After On The Support Corpus
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            Here is what fine-tuning on 50k support-ticket triples does to the support corpus. Recall and MRR jump.
            Latency does not - fine-tuning changes the vector geometry, not the index or the query path.
          </T>

          {/* Before/after bar chart */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${BAR_VIEW_W} ${BAR_VIEW_H}`} width="100%" style={{ maxWidth: 600, height: "auto" }}>
              <desc>
                Before-versus-after bar chart comparing recall, MRR, and latency for off-the-shelf vs fine-tuned
                embeddings on the support corpus.
              </desc>

              {/* Baseline */}
              <line
                x1={BARS_X_START - 10}
                y1={BAR_BASELINE_Y}
                x2={BARS_X_START + BARS_SPAN + 10}
                y2={BAR_BASELINE_Y}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />

              {BEFORE_AFTER_METRICS.map((m, i) => {
                const groupX = BARS_X_START + i * (BAR_GROUP_W + BAR_GAP);
                // Normalize: recall/MRR (0-1) use full BAR_MAX_H; latency caps at 60ms scale.
                const denom = m.metric === "Latency" ? 60 : 1;
                const beforeH = Math.max(2, (m.before / denom) * BAR_MAX_H);
                const afterH = Math.max(2, (m.after / denom) * BAR_MAX_H);
                const beforeX = groupX + (BAR_GROUP_W - 2 * BAR_W - BAR_INNER_GAP) / 2;
                const afterX = beforeX + BAR_W + BAR_INNER_GAP;
                return (
                  <g key={m.metric}>
                    {/* Before bar */}
                    <rect
                      x={beforeX}
                      y={BAR_BASELINE_Y - beforeH}
                      width={BAR_W}
                      height={beforeH}
                      fill={C.red}
                      opacity="0.75"
                    />
                    <text
                      x={beforeX + BAR_W / 2}
                      y={BAR_BASELINE_Y - beforeH - 6}
                      fill="#ef9a9a"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.fmt(m.before)}
                      {m.unit}
                    </text>
                    <text
                      x={beforeX + BAR_W / 2}
                      y={BAR_BASELINE_Y + 14}
                      fill="#ef9a9a"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      Before
                    </text>

                    {/* After bar */}
                    <rect
                      x={afterX}
                      y={BAR_BASELINE_Y - afterH}
                      width={BAR_W}
                      height={afterH}
                      fill={C.green}
                      opacity="0.75"
                    />
                    <text
                      x={afterX + BAR_W / 2}
                      y={BAR_BASELINE_Y - afterH - 6}
                      fill="#a5d6a7"
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.fmt(m.after)}
                      {m.unit}
                    </text>
                    <text
                      x={afterX + BAR_W / 2}
                      y={BAR_BASELINE_Y + 14}
                      fill="#a5d6a7"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      After
                    </text>

                    {/* Group label */}
                    <text
                      x={groupX + BAR_GROUP_W / 2}
                      y={BAR_BASELINE_Y + 32}
                      fill={C.pink}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {m.metric}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Loss curve */}
          <T color={C.pink} bold center size={16} style={{ marginTop: 16 }}>
            Training Loss Over 3 Epochs (50k Triples)
          </T>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${LOSS_VIEW_W} ${LOSS_VIEW_H}`} width="100%" style={{ maxWidth: 520, height: "auto" }}>
              <desc>
                Training loss curve showing triplet loss dropping from 0.5 at epoch 0 to 0.05 at epoch 3 over a
                fine-tuning run on 50k support-corpus triples.
              </desc>

              {/* Axes */}
              <line
                x1={LOSS_PAD_L}
                y1={LOSS_PAD_T}
                x2={LOSS_PAD_L}
                y2={LOSS_PAD_T + LOSS_PLOT_H}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              />
              <line
                x1={LOSS_PAD_L}
                y1={LOSS_PAD_T + LOSS_PLOT_H}
                x2={LOSS_PAD_L + LOSS_PLOT_W}
                y2={LOSS_PAD_T + LOSS_PLOT_H}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x={LOSS_PAD_L - 8} y={LOSS_PAD_T + 4} fill="rgba(255,255,255,0.6)" fontSize="11" textAnchor="end">
                0.50
              </text>
              <text
                x={LOSS_PAD_L - 8}
                y={LOSS_PAD_T + LOSS_PLOT_H + 4}
                fill="rgba(255,255,255,0.6)"
                fontSize="11"
                textAnchor="end"
              >
                0.00
              </text>
              <text
                x={LOSS_PAD_L - 30}
                y={LOSS_PAD_T + LOSS_PLOT_H / 2}
                fill="#f5b7f8"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                transform={`rotate(-90, ${LOSS_PAD_L - 30}, ${LOSS_PAD_T + LOSS_PLOT_H / 2})`}
              >
                Loss
              </text>

              {/* X-axis labels */}
              {LOSS_CURVE.map((p) => (
                <text
                  key={p.epoch}
                  x={lossX(p.epoch)}
                  y={LOSS_PAD_T + LOSS_PLOT_H + 16}
                  fill="rgba(255,255,255,0.6)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  Epoch {p.epoch}
                </text>
              ))}

              {/* Loss line */}
              <path d={lossPath} stroke={C.pink} strokeWidth="2.5" fill="none" />
              {LOSS_CURVE.map((p) => (
                <g key={`pt-${p.epoch}`}>
                  <circle cx={lossX(p.epoch)} cy={lossY(p.loss)} r="4" fill={C.pink} />
                  <text
                    x={lossX(p.epoch) + 8}
                    y={lossY(p.loss) - 6}
                    fill="#f5b7f8"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="start"
                  >
                    {p.loss.toFixed(2)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Cost note */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f5b7f8" center size={14}>
              Cost: ~$200 for a 50k-pair fine-tune on BGE-large via a managed service. Quality delta: usually 10-20
              points on recall. Re-evaluate every 3-6 months as your corpus drifts and new query patterns appear.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// Helper: render one row of the 3-column training triple table in sub=2.
function TripleRowCells({ triple }) {
  const cellBase = {
    padding: 10,
    borderRadius: 6,
    textAlign: "center",
  };
  return (
    <>
      <div
        style={{
          ...cellBase,
          background: `${C.blue}06`,
          border: `1px solid ${C.blue}18`,
        }}
      >
        <T color="#90caf9" bold center size={13}>
          {triple.anchor}
        </T>
      </div>
      <div
        style={{
          ...cellBase,
          background: `${C.green}06`,
          border: `1px solid ${C.green}18`,
        }}
      >
        <T color="#a5d6a7" center size={13}>
          {triple.positive}
        </T>
      </div>
      <div
        style={{
          ...cellBase,
          background: `${C.red}06`,
          border: `1px solid ${C.red}18`,
        }}
      >
        <T color="#ef9a9a" center size={13}>
          {triple.negative}
        </T>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// 12.16 HybridForRAG - BM25 + dense fusion tuned for RAG queries
// ───────────────────────────────────────────────────────────────

// Two contrasting queries on the support corpus that show why neither
// retriever alone is enough. Used in sub=0. The actual relevant doc is
// listed in `truth` and is missing from one of the two top-3 lists.
const HYBRID_GAP_QUERIES = [
  {
    query: "How do I get an API key?",
    truth: "doc-13",
    truthLabel: "API Keys",
    denseTop3: ["doc-7", "doc-12", "doc-5"],
    bm25Top3: ["doc-13", "doc-7", "doc-12"],
    missedBy: "dense",
    note: 'Dense missed it: the embedding of "API key" sat closer to generic dev-tools docs than the actual API-Keys page.',
  },
  {
    query: "Subscription cancel",
    truth: "doc-15",
    truthLabel: "Account Deletion",
    denseTop3: ["doc-15", "doc-19", "doc-3"],
    bm25Top3: ["doc-3", "doc-19", "doc-25"],
    missedBy: "BM25",
    note: 'BM25 missed it: the cancel page is titled "Account Deletion" and does not contain the token "cancel".',
  },
];

// RRF worked example for the query "I can't sign in" in sub=2.
// Each retriever produced an ordered top-3. We fuse with k=60.
const RRF_K = 60;
const RRF_EXAMPLE = {
  query: "I can't sign in",
  bm25Ranks: [
    { doc: "doc-25", rank: 1 },
    { doc: "doc-7", rank: 2 },
    { doc: "doc-13", rank: 3 },
  ],
  denseRanks: [
    { doc: "doc-25", rank: 2 },
    { doc: "doc-12", rank: 1 },
    { doc: "doc-7", rank: 3 },
  ],
};

// Computed RRF scores. Each row shows the per-retriever contribution and the sum.
// Numbers match k = 60 and the ranks above.
// doc-25: 1/(60+1) + 1/(60+2) = 0.01639 + 0.01613 = 0.03252
// doc-7:  1/(60+2) + 1/(60+3) = 0.01613 + 0.01587 = 0.03200
// doc-12: 0        + 1/(60+1) = 0.01639
// doc-13: 1/(60+3) + 0        = 0.01587
const RRF_RESULTS = [
  {
    doc: "doc-25",
    bm25Term: "1 / (60 + 1) = 0.01639",
    denseTerm: "1 / (60 + 2) = 0.01613",
    sum: 0.03252,
    final: 1,
  },
  {
    doc: "doc-7",
    bm25Term: "1 / (60 + 2) = 0.01613",
    denseTerm: "1 / (60 + 3) = 0.01587",
    sum: 0.032,
    final: 2,
  },
  {
    doc: "doc-12",
    bm25Term: "0 (Not in BM25 top-3)",
    denseTerm: "1 / (60 + 1) = 0.01639",
    sum: 0.01639,
    final: 3,
  },
  {
    doc: "doc-13",
    bm25Term: "1 / (60 + 3) = 0.01587",
    denseTerm: "0 (Not in dense top-3)",
    sum: 0.01587,
    final: 4,
  },
];

// Recall@5 on a 50-query held-out set. Sub=3 chart.
const HYBRID_RECALL_BARS = [
  { label: "BM25 Only", recall: 0.68, color: C.red, accent: "#ef9a9a" },
  { label: "Dense Only", recall: 0.74, color: C.yellow, accent: "#ffe082" },
  { label: "Hybrid (RRF)", recall: 0.86, color: C.green, accent: "#a5d6a7" },
];

// Per-query-type alpha tuning. Sub=4 table.
const ALPHA_TUNING = [
  {
    type: "Factual / Lookup",
    example: "What is my account ID?",
    alpha: 0.7,
    lean: "Lean BM25",
    why: "Exact tokens like account IDs, error codes, and SKUs dominate the answer.",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    type: "Conceptual / How-Does-X-Work",
    example: "How does our pricing model work?",
    alpha: 0.3,
    lean: "Lean Dense",
    why: "Synonyms and paraphrase dominate. The answer rarely uses the same words as the query.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    type: "Mixed / Ambiguous (Default)",
    example: "Why is my charge wrong?",
    alpha: 0.5,
    lean: "Balanced",
    why: "Mix of keywords (charge, refund) and intent (something is wrong). Hedge with 0.5.",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

// Decision defaults card for sub=5.
const HYBRID_DEFAULTS = [
  "Always start with RRF (no tuning needed).",
  "Move to weighted-alpha only if you have query-type labels.",
  "Add a classifier when your queries naturally split into factual vs conceptual.",
  "Re-evaluate alpha quarterly as your corpus and query mix drift.",
];

export const HybridForRAG = (ctx) => {
  const { sub } = ctx;

  // SVG geometry for the 3-bar recall chart in sub=3.
  const REC_VIEW_W = 560;
  const REC_VIEW_H = 240;
  const REC_BAR_W = 90;
  const REC_BAR_GAP = 60;
  const REC_BASELINE_Y = 190;
  const REC_MAX_H = 150;
  const REC_BARS_SPAN = HYBRID_RECALL_BARS.length * REC_BAR_W + (HYBRID_RECALL_BARS.length - 1) * REC_BAR_GAP;
  const REC_X_START = (REC_VIEW_W - REC_BARS_SPAN) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Why neither retriever alone is enough */}
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Dense Misses Exact Terms; BM25 Misses Synonyms
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            Hybrid search (covered in Section 11.24) ships dense vectors and BM25 side by side and fuses their rankings.
            Here we focus on RAG-specific tuning. Watch what each retriever misses on the support corpus.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {HYBRID_GAP_QUERIES.map((row) => (
              <div
                key={row.query}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.pink} bold center size={16}>
                  Query: &quot;{row.query}&quot;
                </T>
                <T color="rgba(255,255,255,0.6)" center size={13} style={{ marginTop: 4 }}>
                  Truth: {row.truth} ({row.truthLabel})
                </T>

                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    textAlign: "center",
                  }}
                >
                  {/* Dense column */}
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: row.missedBy === "dense" ? `${C.red}06` : `${C.cyan}06`,
                      border: `1px solid ${row.missedBy === "dense" ? C.red : C.cyan}24`,
                    }}
                  >
                    <T color={row.missedBy === "dense" ? "#ef9a9a" : "#80deea"} bold center size={13}>
                      Dense Top-3
                    </T>
                    <T
                      color={row.missedBy === "dense" ? "#ef9a9a" : "#80deea"}
                      center
                      size={14}
                      style={{ marginTop: 6 }}
                    >
                      [{row.denseTop3.join(", ")}]
                    </T>
                    {row.missedBy === "dense" && (
                      <T color="#ef9a9a" bold center size={12} style={{ marginTop: 6 }}>
                        Missed {row.truth}
                      </T>
                    )}
                  </div>

                  {/* BM25 column */}
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: row.missedBy === "BM25" ? `${C.red}06` : `${C.green}06`,
                      border: `1px solid ${row.missedBy === "BM25" ? C.red : C.green}24`,
                    }}
                  >
                    <T color={row.missedBy === "BM25" ? "#ef9a9a" : "#a5d6a7"} bold center size={13}>
                      BM25 Top-3
                    </T>
                    <T
                      color={row.missedBy === "BM25" ? "#ef9a9a" : "#a5d6a7"}
                      center
                      size={14}
                      style={{ marginTop: 6 }}
                    >
                      [{row.bm25Top3.join(", ")}]
                    </T>
                    {row.missedBy === "BM25" && (
                      <T color="#ef9a9a" bold center size={12} style={{ marginTop: 6 }}>
                        Missed {row.truth}
                      </T>
                    )}
                  </div>
                </div>

                <T color="#f5b7f8" center size={13} style={{ marginTop: 10 }}>
                  {row.note}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f5b7f8" center size={14}>
              Hybrid keeps both retrievers and fuses their rankings. Each one catches what the other misses.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Two fusion strategies (RRF + weighted) */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Two Fusion Strategies: RRF And Weighted Score
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Once you have two ranked lists, you need to combine them into one ordered result. Two strategies dominate
            production RAG: Reciprocal Rank Fusion (parameter-free) and weighted score fusion (tunable).
          </T>

          {/* RRF formula block */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.purple} bold center size={14}>
              Reciprocal Rank Fusion (RRF)
            </T>
            <T color="#b8a9ff" center size={18} style={{ marginTop: 8 }}>
              RRF(d) = sum over retrievers r of: 1 / (k + rank_r(d))
            </T>
            <T color="rgba(255,255,255,0.6)" center size={13} style={{ marginTop: 8 }}>
              Where k = 60 (Standard)
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Robust default. No weights to tune. Each retriever contributes a rank-reciprocal, so doc-1 always
              outweighs doc-2 regardless of the underlying score scales.
            </T>
          </div>

          {/* Weighted score formula block */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.purple} bold center size={14}>
              Weighted Score Fusion
            </T>
            <T color="#b8a9ff" center size={18} style={{ marginTop: 8 }}>
              Score(d) = alpha * bm25_score(d) + (1 - alpha) * dense_score(d)
            </T>
            <T color="rgba(255,255,255,0.6)" center size={13} style={{ marginTop: 8 }}>
              Where alpha is in [0, 1]
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color="#b8a9ff" center size={14}>
              Tunable per query type. Requires score normalization first - BM25 scores are unbounded positive while
              dense cosine sits in [-1, 1], so min-max scaling each list to [0, 1] is the standard prep.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── RRF worked example */}
      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            RRF Worked Example
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Query: &quot;{RRF_EXAMPLE.query}&quot;. Both retrievers return top-3 candidates with overlap on doc-25 and
            doc-7. RRF rewards documents that appear high in either list.
          </T>

          {/* Input rankings */}
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
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                BM25 Top-3
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {RRF_EXAMPLE.bm25Ranks.map((r) => (
                  <T key={r.doc} color="#a5d6a7" center size={14}>
                    {r.rank}. {r.doc}
                  </T>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}24`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={14}>
                Dense Top-3
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {RRF_EXAMPLE.denseRanks.map((r) => (
                  <T key={r.doc} color="#80deea" center size={14}>
                    {r.rank}. {r.doc}
                  </T>
                ))}
              </div>
            </div>
          </div>

          {/* Computation rows */}
          <T color={C.blue} bold center size={16} style={{ marginTop: 16 }}>
            Compute RRF(d) With k = {RRF_K}
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {RRF_RESULTS.map((r) => (
              <div
                key={r.doc}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.35)",
                  border: `1px solid ${C.blue}24`,
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                <T color={C.blue} bold center size={14}>
                  {r.doc}
                </T>
                <T color="#90caf9" center size={13} style={{ marginTop: 4 }}>
                  BM25 term: {r.bm25Term}
                </T>
                <T color="#90caf9" center size={13} style={{ marginTop: 2 }}>
                  Dense term: {r.denseTerm}
                </T>
                <T color="#90caf9" bold center size={14} style={{ marginTop: 4 }}>
                  RRF sum = {r.sum.toFixed(5)}
                </T>
              </div>
            ))}
          </div>

          {/* Final ranking */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color={C.blue} bold center size={14}>
              Final Ranking
            </T>
            <T color="#90caf9" center size={16} style={{ marginTop: 6 }}>
              doc-25 (0.03252) &gt; doc-7 (0.03200) &gt; doc-12 (0.01639) &gt; doc-13 (0.01587)
            </T>
            <T color="rgba(255,255,255,0.6)" center size={12} style={{ marginTop: 6 }}>
              doc-25 wins because both retrievers ranked it in their top-2. doc-7 is second because both kept it in the
              top-3. Singletons trail behind.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Complementary recall on a held-out set */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Complementary Recall: Hybrid Catches What Either Misses
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Recall@5 measured on a 50-query held-out set against the support corpus. Hybrid is not just an average of
            the two retrievers - the failures of BM25 and dense are largely uncorrelated, so fusion picks up the union
            of their wins.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${REC_VIEW_W} ${REC_VIEW_H}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Three-bar chart of recall at five comparing BM25-only at 0.68, dense-only at 0.74, and hybrid RRF at
                0.86 on a 50-query held-out set from the support corpus.
              </desc>

              {/* Baseline */}
              <line
                x1={REC_X_START - 10}
                y1={REC_BASELINE_Y}
                x2={REC_X_START + REC_BARS_SPAN + 10}
                y2={REC_BASELINE_Y}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />

              {HYBRID_RECALL_BARS.map((b, i) => {
                const barX = REC_X_START + i * (REC_BAR_W + REC_BAR_GAP);
                const barH = Math.max(2, b.recall * REC_MAX_H);
                return (
                  <g key={b.label}>
                    <rect
                      x={barX}
                      y={REC_BASELINE_Y - barH}
                      width={REC_BAR_W}
                      height={barH}
                      fill={b.color}
                      opacity="0.78"
                    />
                    <text
                      x={barX + REC_BAR_W / 2}
                      y={REC_BASELINE_Y - barH - 8}
                      fill={b.accent}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {b.recall.toFixed(2)}
                    </text>
                    <text
                      x={barX + REC_BAR_W / 2}
                      y={REC_BASELINE_Y + 18}
                      fill={b.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {b.label}
                    </text>
                  </g>
                );
              })}

              <text
                x={REC_VIEW_W / 2}
                y={REC_BASELINE_Y + 44}
                fill="rgba(255,255,255,0.6)"
                fontSize="12"
                textAnchor="middle"
              >
                Recall@5 On 50 Held-Out Queries
              </text>
            </svg>
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
              Hybrid is rarely worse than the best single method, often noticeably better. The complementary recall gain
              here is +12 points over dense alone.
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={13}>
              Latency Cost
            </T>
            <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
              +30 ms for the BM25 lookup on top of the dense search. For most RAG systems that is well below the LLM
              generation tail, so the recall lift is almost always worth it.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Per-query-type alpha tuning */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Tune Alpha By Query Type
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            One alpha for everything leaves recall on the table. Factual lookups (account IDs, error codes) lean BM25.
            Conceptual questions lean dense. A small classifier picks the right alpha per query before retrieval.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1.1fr 1.4fr 0.6fr 0.7fr 1.6fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {["Query Type", "Example", "Alpha", "Lean", "Why"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {ALPHA_TUNING.map((row) => (
              <AlphaRowCells key={row.type} row={row} />
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
              A simple LLM-based classifier (one call with a 3-class prompt) can label each query at runtime before
              retrieval. Cost: 1 extra LLM call (~$0.0002 with a small model). Adds ~150 ms but unlocks 4-8 points of
              recall on mixed query workloads.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Decision rule */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Hybrid Defaults For RAG
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Hybrid is the production default for RAG. Start simple with RRF and only add complexity if your evaluation
            metrics demand it.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {HYBRID_DEFAULTS.map((row, i) => (
              <div
                key={row}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}24`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${C.orange}30`,
                    border: `1px solid ${C.orange}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <T color={C.orange} bold size={14}>
                    {i + 1}
                  </T>
                </div>
                <T color="#ffcc80" size={15}>
                  {row}
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
              The cheapest big win in RAG retrieval. If you only do one thing after picking an embedding model, ship
              hybrid with RRF first - it almost always beats either retriever alone with a tiny latency cost.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// Helper: render one row of the 5-column alpha tuning table in 12.16 sub=4.
function AlphaRowCells({ row }) {
  const cell = {
    padding: 10,
    borderRadius: 6,
    background: `${row.color}06`,
    border: `1px solid ${row.color}18`,
    textAlign: "center",
  };
  return (
    <>
      <div style={cell}>
        <T color={row.accent} bold center size={13}>
          {row.type}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={13}>
          &quot;{row.example}&quot;
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} bold center size={14}>
          {row.alpha.toFixed(1)}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={13}>
          {row.lean}
        </T>
      </div>
      <div style={cell}>
        <T color={row.accent} center size={12}>
          {row.why}
        </T>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// 12.17 RerankerCascade - 3-stage funnel: vector -> reranker -> LLM
// ───────────────────────────────────────────────────────────────

// Sub=1 funnel stages. Each stage narrows the candidate set and
// pays more per item for better quality. Numbers reflect a typical
// production RAG deployment on a ~1M-chunk corpus.
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

// Sub=2 latency stack. Each segment is one stage, proportional to ms.
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

// Sub=3 cost stack. Same shape as latency but with dollar numbers.
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

// Sub=4 tuning grid. 3 rows of (top-k retrieved -> top-k reranked)
// against three metrics. Middle row is the default sweet spot.
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

export const RerankerCascade = (ctx) => {
  const { sub } = ctx;

  // Funnel geometry (sub=1). Each trapezoid narrows; viewBox centered.
  const FUNNEL_W = 560;
  const FUNNEL_H = 360;
  const FUNNEL_TOP_W = 460;
  const FUNNEL_MID_W = 340;
  const FUNNEL_BOT_W = 220;
  const FUNNEL_NARROW = 60; // narrowing per stage
  const STAGE_H = 90;
  const STAGE_GAP = 20;
  // Center each trapezoid by computing (FUNNEL_W - widthAtTop) / 2.
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

  // Sub=2 latency bar geometry. One row, 3 segments, proportional to ms.
  const LBAR_W = 560;
  const LBAR_H = 60;
  const LBAR_INNER_W = 520;
  const LBAR_X_START = (LBAR_W - LBAR_INNER_W) / 2;

  // Sub=3 cost bar geometry. Same shape; proportional to dollars.
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

              {/* Legend below the bar - color swatch + name + value for each segment. */}
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

              {/* Legend below the bar - color swatch + name + dollar amount for each segment. */}
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
    </div>
  );
};

// Helper: render one row of the 5-column cascade tuning table in 12.17 sub=4.
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

// ───────────────────────────────────────────────────────────────
// 12.18 WhyTransformQueries - motivate query rewriting with 3 failure shapes
// ───────────────────────────────────────────────────────────────

// Sub=1 lexical-mismatch table. User wording does not share tokens with
// the doc title that actually answers the question. Cosine still drops
// because the dense embeddings only partially absorb the gap.
const LEXICAL_MISMATCH_ROWS = [
  {
    user: '"I can\'t sign in"',
    doc: '"Login Troubleshooting"',
    mismatch: "Sign in vs log in",
  },
  {
    user: '"How do I cancel?"',
    doc: '"Account Deletion Flow"',
    mismatch: "Cancel vs delete",
  },
  {
    user: '"My screen is frozen"',
    doc: '"Browser Performance Issues"',
    mismatch: "Screen frozen vs browser performance",
  },
];

// Sub=2 ambiguity branches. Single query "How do I export?" fans out into
// three plausible interpretations, each pointing at a different doc.
const AMBIGUITY_BRANCHES = [
  {
    intent: "Export data to CSV",
    doc: "doc-9 (Export Formats)",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    intent: "Export user list for admin",
    doc: "doc-26 (Bulk Operations)",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    intent: "Cancel an export job that failed",
    doc: "doc-29 (Export Failures)",
    color: C.pink,
    accent: "#f5b7f8",
  },
];

// Sub=3 multi-intent split. One user sentence carries two distinct asks.
const MULTI_INTENT_SUBS = [
  {
    intent: "How to cancel subscription",
    doc: "doc-15 (Account Deletion Flow)",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    intent: "How to get a refund",
    doc: "doc-4 (Refunds)",
    color: C.green,
    accent: "#a5d6a7",
  },
];

// Sub=4 strategy preview grid. 2x2 mapping of strategy -> primary failure.
const TRANSFORM_STRATEGIES = [
  {
    name: "HyDE (12.19)",
    fixes: "Fixes Lexical Mismatch",
    detail: "Ask an LLM to draft a hypothetical answer, then embed the answer instead of the question.",
    color: C.red,
    accent: "#ef9a9a",
  },
  {
    name: "Multi-Query Expansion (12.20)",
    fixes: "Fixes Ambiguity",
    detail: "Generate N paraphrases of the query, retrieve for each, then merge results.",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    name: "Query Decomposition (12.21)",
    fixes: "Fixes Multi-Intent",
    detail: "Split a compound query into independent sub-queries, retrieve for each, then combine.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Query Routing (12.21)",
    fixes: "Picks The Right Index",
    detail: "Classify the query and send it to the index, tool, or filter that best matches.",
    color: C.blue,
    accent: "#90caf9",
  },
];

export const WhyTransformQueries = (ctx) => {
  const { sub } = ctx;

  // Sub=2 ambiguity diagram geometry. Centered viewBox, one source on the
  // left, three branches on the right.
  const AMB_W = 560;
  const AMB_H = 260;
  const SRC_W = 200;
  const SRC_H = 52;
  const SRC_X = 24;
  const SRC_Y = (AMB_H - SRC_H) / 2;
  const DEST_W = 260;
  const DEST_H = 54;
  const DEST_X = AMB_W - DEST_W - 24;
  const destYs = [24, (AMB_H - DEST_H) / 2, AMB_H - DEST_H - 24];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Framing: user query rarely best retrieval query */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            User Queries Are Rarely Optimal For Retrieval
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The user types a sentence in their own words. The retriever embeds it and finds the nearest chunks. But the
            user's wording is rarely the wording that lives in the index. The right doc is in the corpus and the
            retriever still misses it.
          </T>

          {/* Concrete miss: user words vs doc words, with cosine score */}
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
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                User Query
              </T>
              <T color="#ffcc80" center size={16} style={{ marginTop: 8 }}>
                &quot;I can&apos;t sign in&quot;
              </T>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold center size={14}>
                Best Doc In Corpus
              </T>
              <T color="#ffcc80" center size={16} style={{ marginTop: 8 }}>
                &quot;Login Troubleshooting&quot;
              </T>
            </div>
          </div>

          {/* Cosine score + rank */}
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.orange}24`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Cosine(user, best_doc) = 0.61
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 4 }}>
              Top-3 misses it. Correct doc lands at rank 7.
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              textAlign: "center",
            }}
          >
            <T color="#ffcc80" center size={14}>
              Three failure shapes ruin naive retrieval. Four query-transformation strategies fix them.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Failure 1: lexical mismatch */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Lexical Mismatch: The User And The Doc Use Different Words
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Users and docs share an idea but not vocabulary. The retriever sees two strings of tokens that look
            unrelated and the right chunk falls out of the top-k.
          </T>

          {/* Header row */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.2fr",
              gap: 6,
              textAlign: "center",
            }}
          >
            {["User Query", "Doc Title", "Word Mismatch"].map((h) => (
              <div
                key={h}
                style={{
                  padding: "8px 6px",
                  borderRadius: 6,
                  background: `${C.red}12`,
                  border: `1px solid ${C.red}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={13}>
                  {h}
                </T>
              </div>
            ))}

            {LEXICAL_MISMATCH_ROWS.map((row) => (
              <LexicalMismatchRowCells key={row.user} row={row} />
            ))}
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
              Dense embeddings help a bit (sign-in and log-in sit close in vector space) but only partially. HyDE
              (12.19) and multi-query (12.20) close the gap by rewriting the user query into wording that matches the
              doc.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Failure 2: ambiguity */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Ambiguity: The Query Has Multiple Plausible Intents
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            One short question, three different things the user might want. A naive retriever picks one direction and
            quietly drops the other two.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${AMB_W} ${AMB_H}`} width="100%" style={{ maxWidth: 560, height: "auto" }}>
              <desc>
                Three-branch interpretation diagram showing the ambiguous query &quot;How do I export?&quot; fanning out
                to three doc destinations: export formats, bulk operations, and export failures.
              </desc>

              {/* Source query box */}
              <rect
                x={SRC_X}
                y={SRC_Y}
                width={SRC_W}
                height={SRC_H}
                rx="8"
                fill={C.yellow}
                fillOpacity="0.18"
                stroke={C.yellow}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={SRC_X + SRC_W / 2}
                y={SRC_Y + SRC_H / 2 - 4}
                fill="#ffe082"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>
              <text x={SRC_X + SRC_W / 2} y={SRC_Y + SRC_H / 2 + 14} fill="#ffe082" fontSize="13" textAnchor="middle">
                &quot;How do I export?&quot;
              </text>

              {/* Three branches */}
              {AMBIGUITY_BRANCHES.map((branch, i) => {
                const destCenterY = destYs[i] + DEST_H / 2;
                const srcRightX = SRC_X + SRC_W;
                const srcCenterY = SRC_Y + SRC_H / 2;
                return (
                  <g key={branch.intent}>
                    {/* Connector */}
                    <path
                      d={`M ${srcRightX} ${srcCenterY} C ${(srcRightX + DEST_X) / 2} ${srcCenterY}, ${(srcRightX + DEST_X) / 2} ${destCenterY}, ${DEST_X} ${destCenterY}`}
                      fill="none"
                      stroke={branch.color}
                      strokeOpacity="0.65"
                      strokeWidth="1.6"
                    />
                    {/* Destination box */}
                    <rect
                      x={DEST_X}
                      y={destYs[i]}
                      width={DEST_W}
                      height={DEST_H}
                      rx="8"
                      fill={branch.color}
                      fillOpacity="0.18"
                      stroke={branch.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    <text
                      x={DEST_X + DEST_W / 2}
                      y={destYs[i] + DEST_H / 2 - 4}
                      fill={branch.accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {branch.intent}
                    </text>
                    <text
                      x={DEST_X + DEST_W / 2}
                      y={destYs[i] + DEST_H / 2 + 14}
                      fill={branch.accent}
                      fontSize="11"
                      textAnchor="middle"
                    >
                      -&gt; {branch.doc}
                    </text>
                  </g>
                );
              })}
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
            <T color="#ffe082" center size={14}>
              A naive retriever picks one and misses the other two. Multi-query (12.20) generates paraphrases that cover
              each branch, and routing (12.21) sends each branch to the index that fits best.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Failure 3: multi-intent */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Multi-Intent: One Query Asks Two Or More Questions
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The user packs two asks into one sentence. The retriever embeds the whole thing and lands on docs that cover
            one ask, missing the other entirely.
          </T>

          {/* Source query */}
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
            <T color={C.green} bold center size={14}>
              User Query
            </T>
            <T color="#a5d6a7" center size={16} style={{ marginTop: 6 }}>
              &quot;Cancel my subscription and get a refund&quot;
            </T>
          </div>

          {/* Two sub-intent cards */}
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MULTI_INTENT_SUBS.map((s, i) => (
              <div
                key={s.intent}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.accent} bold center size={13}>
                  Sub-Intent {i + 1}
                </T>
                <T color={s.accent} center size={14} style={{ marginTop: 6 }}>
                  {s.intent}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  -&gt; {s.doc}
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
              Naive retrieval finds docs for one intent and misses the other. Decomposition (12.21) splits the query
              into two sub-queries, retrieves for each, then combines the results.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Four strategies preview */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Four Strategies Map To Three Failures
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            Each transformation tackles a different failure shape. The next three chapters (12.19, 12.20, 12.21) unpack
            them one by one.
          </T>

          {/* 2x2 strategy grid */}
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {TRANSFORM_STRATEGIES.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={s.accent} bold center size={14}>
                  {s.name}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  {s.fixes}
                </T>
                <T color={s.accent} center size={13} style={{ marginTop: 6 }}>
                  {s.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
            }}
          >
            <T color="#90caf9" center size={14}>
              Picking the right transformation is itself a routing decision. In production, a small classifier or LLM
              call inspects the query and chooses which strategy (or combination) to run.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// Helper: render one row of the 3-column lexical-mismatch table in 12.18 sub=1.
function LexicalMismatchRowCells({ row }) {
  const cell = {
    padding: 10,
    borderRadius: 6,
    background: `${C.red}06`,
    border: `1px solid ${C.red}18`,
    textAlign: "center",
  };
  return (
    <>
      <div style={cell}>
        <T color="#ef9a9a" center size={13}>
          {row.user}
        </T>
      </div>
      <div style={cell}>
        <T color="#ef9a9a" center size={13}>
          {row.doc}
        </T>
      </div>
      <div style={cell}>
        <T color="#ef9a9a" bold center size={13}>
          {row.mismatch}
        </T>
      </div>
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// 12.19 HyDE - Hypothetical Document Embeddings
// ───────────────────────────────────────────────────────────────

// Sub=1 flow stages. Five-box horizontal pipeline showing how a user query
// becomes top-K real docs by going through a hypothetical answer step.
const HYDE_FLOW_STAGES = [
  { label: "User Query", accent: "#ffcc80", color: C.orange },
  { label: "LLM Generates", sublabel: "Hypothetical Answer", accent: "#b8a9ff", color: C.purple },
  { label: "Embed Hypothetical", sublabel: "Answer", accent: "#80deea", color: C.cyan },
  { label: "Vector Retrieval", accent: "#ffe082", color: C.yellow },
  { label: "Top-K Real Docs", accent: "#a5d6a7", color: C.green },
];

// Sub=2 worked example top-3 retrieved docs. All three are relevant to a
// dashboard-slow question because the LLM's hypothetical answer mentioned
// the same vocabulary that lives in these docs.
const HYDE_RETRIEVED_DOCS = [
  { id: "doc-22", title: "Slow Page Load Troubleshooting" },
  { id: "doc-23", title: "500 Errors" },
  { id: "doc-27", title: "Browser Compatibility Issues" },
];

// Sub=3 why-it-works cards. Three reasons the hypothetical answer outperforms
// the raw question in dense retrieval.
const HYDE_REASONS = [
  {
    title: "Different Shapes In Vector Space",
    body: "Questions look different from answers in vector space.",
  },
  {
    title: "Borrows Doc Vocabulary",
    body: "Hypothetical answers borrow doc vocabulary even if the LLM doesn't know the actual answer.",
  },
  {
    title: "Robust To Lexical Mismatch",
    body: "Robust to lexical mismatch because the LLM does the rewriting for you.",
  },
];

// Sub=4 helps-vs-hurts table. Left column: queries that benefit from HyDE.
// Right column: queries where HyDE adds latency without improving recall.
const HYDE_HELPS = [
  "Long descriptive queries",
  "Lexical mismatch (sign-in vs log-in)",
  "Conceptual / 'why does X happen' questions",
  "Queries that don't share vocabulary with docs",
];

const HYDE_HURTS = [
  "Short factual queries with good embeddings (e.g., 'API key')",
  "Queries where the LLM might hallucinate the wrong answer shape",
  "Latency-sensitive pipelines (HyDE adds an LLM call: +200-400 ms)",
];

export const HyDE = (ctx) => {
  const { sub } = ctx;

  // Sub=1 flow diagram geometry. Five boxes evenly spaced, centered in viewBox.
  const FLOW_VB_W = 720;
  const FLOW_VB_H = 130;
  const FLOW_BOX_W = 120;
  const FLOW_BOX_H = 70;
  const FLOW_GAP = 18;
  const FLOW_SPAN = 5 * FLOW_BOX_W + 4 * FLOW_GAP; // 5*120 + 4*18 = 672
  const FLOW_X_START = (FLOW_VB_W - FLOW_SPAN) / 2; // (720-672)/2 = 24
  const FLOW_Y = (FLOW_VB_H - FLOW_BOX_H) / 2; // 30

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── HyDE insight: embed the answer, not the question */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Don&apos;t Embed The Question - Embed The Hypothetical Answer
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            A user&apos;s question and the doc that answers it often live far apart in vector space. They use different
            words and have different shapes. HyDE flips the order: have an LLM draft a plausible answer first, then
            embed THAT, then retrieve.
          </T>

          {/* Normal RAG line */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.yellow}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <T color={C.yellow} bold center size={13}>
              Normal RAG
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              Embed(&quot;Why is my dashboard slow?&quot;) -&gt; retrieve.
            </T>
          </div>

          {/* HyDE line */}
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.yellow}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <T color={C.yellow} bold center size={13}>
              HyDE
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              LLM(&quot;Why is my dashboard slow?&quot;) = &quot;The dashboard may be slow due to large data volumes,
              browser extensions, or network latency.&quot; -&gt; Embed that ANSWER -&gt; retrieve.
            </T>
          </div>

          {/* Insight callout */}
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
              The hypothetical answer is text-shape-closer to actual docs than the question is. Cosine similarity wins.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── The five-stage HyDE flow */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            The HyDE Flow: Query -&gt; LLM -&gt; Hypothetical Answer -&gt; Embed -&gt; Retrieve
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            HyDE adds one extra step before retrieval: an LLM call that writes a hypothetical answer. That answer is
            what gets embedded and sent to the vector index. The user never sees it directly.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FLOW_VB_W} ${FLOW_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Five-box horizontal flow diagram showing the HyDE pipeline: user query, LLM generates hypothetical
                answer, embed hypothetical answer, vector retrieval, top-K real docs.
              </desc>

              {HYDE_FLOW_STAGES.map((stage, i) => {
                const x = FLOW_X_START + i * (FLOW_BOX_W + FLOW_GAP);
                const cx = x + FLOW_BOX_W / 2;
                return (
                  <g key={stage.label}>
                    {/* Stage box */}
                    <rect
                      x={x}
                      y={FLOW_Y}
                      width={FLOW_BOX_W}
                      height={FLOW_BOX_H}
                      rx="8"
                      fill={stage.color}
                      fillOpacity="0.18"
                      stroke={stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    {/* Stage label (two-line if sublabel) */}
                    {stage.sublabel ? (
                      <>
                        <text
                          x={cx}
                          y={FLOW_Y + FLOW_BOX_H / 2 - 4}
                          fill={stage.accent}
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {stage.label}
                        </text>
                        <text
                          x={cx}
                          y={FLOW_Y + FLOW_BOX_H / 2 + 12}
                          fill={stage.accent}
                          fontSize="12"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {stage.sublabel}
                        </text>
                      </>
                    ) : (
                      <text
                        x={cx}
                        y={FLOW_Y + FLOW_BOX_H / 2 + 4}
                        fill={stage.accent}
                        fontSize="13"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {stage.label}
                      </text>
                    )}

                    {/* Arrow to next stage */}
                    {i < HYDE_FLOW_STAGES.length - 1 && (
                      <g>
                        <line
                          x1={x + FLOW_BOX_W + 2}
                          y1={FLOW_Y + FLOW_BOX_H / 2}
                          x2={x + FLOW_BOX_W + FLOW_GAP - 4}
                          y2={FLOW_Y + FLOW_BOX_H / 2}
                          stroke={C.orange}
                          strokeOpacity="0.65"
                          strokeWidth="1.6"
                        />
                        <polygon
                          points={`${x + FLOW_BOX_W + FLOW_GAP - 4},${FLOW_Y + FLOW_BOX_H / 2 - 4} ${x + FLOW_BOX_W + FLOW_GAP - 4},${FLOW_Y + FLOW_BOX_H / 2 + 4} ${x + FLOW_BOX_W + FLOW_GAP},${FLOW_Y + FLOW_BOX_H / 2}`}
                          fill={C.orange}
                          fillOpacity="0.65"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
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
              The hypothetical answer is throwaway. Only its embedding goes to the index. The user gets the real top-K
              docs back, never the LLM&apos;s draft.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Worked example on the dashboard-slow query */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Worked Example: &apos;Why Is My Dashboard Slow?&apos;
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Three panels: what the user typed, what the LLM drafted, and what the retriever returned. The LLM&apos;s
            draft pulled in vocabulary like &quot;page load&quot;, &quot;browser extensions&quot;, and &quot;network
            latency&quot; - exactly the words that appear in the docs that actually help.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {/* Panel A - User query */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                User Query
              </T>
              <T color="#a5d6a7" center size={14} style={{ marginTop: 8 }}>
                &quot;Why is my dashboard slow?&quot;
              </T>
            </div>

            {/* Panel B - LLM hypothetical answer */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                LLM Hypothetical Answer
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;The dashboard may be slow due to large data volumes, browser extensions interfering with
                rendering, network latency, or background sync jobs consuming resources. Try refreshing, disabling
                extensions, or checking the network panel.&quot;
              </T>
            </div>

            {/* Panel C - Top-3 retrieved docs */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Top-3 Retrieved Docs
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {HYDE_RETRIEVED_DOCS.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" bold center size={12}>
                      {doc.id}
                    </T>
                    <T color="#a5d6a7" center size={12} style={{ marginTop: 2 }}>
                      {doc.title}
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
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
            }}
          >
            <T color="#a5d6a7" center size={14}>
              Without HyDE, retrieval returned doc-7 (Dashboard Tour) - a generic doc that doesn&apos;t help. The
              question &quot;why slow&quot; embedded poorly; the answer embedded well.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Why HyDE works */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Why HyDE Works
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Three reasons the hypothetical-answer trick beats embedding the raw question. Even if the LLM&apos;s draft
            is factually wrong, the SHAPE of the answer matches the SHAPE of real docs - and that is what cosine
            similarity scores.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {HYDE_REASONS.map((reason) => (
              <div
                key={reason.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} bold center size={14}>
                  {reason.title}
                </T>
                <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
                  {reason.body}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When HyDE helps vs hurts */}
      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            When HyDE Helps Vs When It Hurts
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            HyDE is not free and is not universal. It earns its keep when the user&apos;s words are far from the
            doc&apos;s words. It hurts when the query is already short, factual, and embeds well.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Helps column - green tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Helps
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {HYDE_HELPS.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}06`,
                      border: `1px solid ${C.green}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Hurts column - red tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Hurts
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {HYDE_HURTS.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}06`,
                      border: `1px solid ${C.red}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {item}
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              If recall on your golden set is already above 0.85, HyDE likely won&apos;t help and will add latency.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── The HyDE prompt template */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The HyDE Prompt Template
          </T>
          <T color="#f5b7f8" center size={16} style={{ marginTop: 10 }}>
            The exact prompt you fire at the LLM. The placeholder in pink gets filled with the user&apos;s question. The
            LLM&apos;s response is the hypothetical answer that gets embedded.
          </T>

          <T color={C.pink} bold center size={14} style={{ marginTop: 14 }}>
            Prompt Template
          </T>

          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#f5b7f8",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              lineHeight: 1.55,
            }}
          >
            <div>You are a helpful assistant. Write a single concise paragraph that</div>
            <div>answers the user&apos;s question as if you knew the answer. The paragraph</div>
            <div>will be used to search a documentation index, so include domain terms</div>
            <div>and likely doc vocabulary. Do not say &quot;I don&apos;t know&quot; - guess plausibly.</div>
            <div style={{ marginTop: 10 }}>
              Question: <span style={{ color: C.pink, fontWeight: 600 }}>{"{query}"}</span>
            </div>
            <div style={{ marginTop: 10 }}>Hypothetical Answer:</div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f5b7f8" center size={14}>
              +1 LLM call per user query (~$0.0005 + ~250ms). Cache the hypothetical answer by query hash to amortize.
            </T>
            <T color="#f5b7f8" center size={13} style={{ marginTop: 6 }}>
              Caching - covered in chapter 12.36.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.20 MultiQueryExpansion - one query becomes many, fuse with RRF
// ───────────────────────────────────────────────────────────────

// Sub=1 pipeline stages. Three sequential boxes describing the
// generate-retrieve-fuse flow that defines multi-query expansion.
const MQE_PIPELINE_STAGES = [
  {
    label: "LLM Generates",
    sublabel: "3-5 Query Variants",
    accent: "#ffcc80",
    color: C.orange,
  },
  {
    label: "Run Vector Retrieval",
    sublabel: "For Each Variant",
    accent: "#ffe082",
    color: C.yellow,
  },
  { label: "Fuse Rankings", sublabel: "With RRF", accent: "#a5d6a7", color: C.green },
];

// Sub=2 worked example variants. Three rewordings the LLM might produce for
// the multi-intent query "Cancel my subscription and get a refund".
const MQE_VARIANTS = [
  { label: "Variant 1", text: "How to cancel my subscription" },
  { label: "Variant 2", text: "How to get a refund after cancellation" },
  { label: "Variant 3", text: "Stop billing immediately" },
];

// Sub=2 per-variant top-3 retrieved docs. doc-15 appears across all three
// (it covers cancellation flow) and is therefore promoted to rank 1 in the
// fused ranking. doc-4 only appears for the refund variant but lands at #2
// because nothing else competes on that intent.
const MQE_VARIANT_RANKINGS = [
  { variant: "Variant 1", docs: ["doc-15", "doc-7", "doc-3"] },
  { variant: "Variant 2", docs: ["doc-4", "doc-15", "doc-3"] },
  { variant: "Variant 3", docs: ["doc-5", "doc-15", "doc-21"] },
];

// Sub=2 final fused top-3. Computed by hand using RRF(d) = sum 1 / (60 + rank).
// doc-15 wins because it is recalled by all three variants. doc-4 covers
// the second intent (refund). doc-3 covers subscription tiers context.
const MQE_FUSED_TOP3 = [
  { id: "doc-15", note: "Covers Cancellation" },
  { id: "doc-4", note: "Covers Refund" },
  { id: "doc-3", note: "Subscription Tiers" },
];

// Sub=5 helps-vs-skip cards. Left tinted green: queries where multi-query
// expansion adds recall. Right tinted red: cases where it adds latency
// without helping.
const MQE_HELPS = [
  "Ambiguous queries with multiple plausible intents",
  "Complex multi-clause queries",
  "Recall is the priority over latency",
  "Reranker can absorb the wider candidate set",
];

const MQE_SKIP = [
  "Short factual lookups ('What is my account ID?')",
  "Latency-critical paths (adds 1 LLM call + N parallel retrievals)",
  "When HyDE already solves the same failure",
];

export const MultiQueryExpansion = (ctx) => {
  const { sub } = ctx;

  // Sub=0 fan-out diagram geometry. Single query node on the left fans
  // out to 3 variants, each retrieving its own top-K set, all converging
  // into a single fused ranking on the right.
  const FAN_VB_W = 720;
  const FAN_VB_H = 260;
  const FAN_QUERY_X = 30;
  const FAN_VARIANT_X = 230;
  const FAN_SET_X = 420;
  const FAN_FUSED_X = 600;
  const FAN_NODE_W = 100;
  const FAN_NODE_H = 44;
  const FAN_VARIANT_YS = [40, 110, 180];
  const FAN_CENTER_Y = FAN_VB_H / 2 - FAN_NODE_H / 2;

  // Sub=1 pipeline geometry. Three boxes evenly spaced, centered.
  const PIPE_VB_W = 720;
  const PIPE_VB_H = 130;
  const PIPE_BOX_W = 200;
  const PIPE_BOX_H = 70;
  const PIPE_GAP = 30;
  const PIPE_SPAN = 3 * PIPE_BOX_W + 2 * PIPE_GAP; // 3*200 + 2*30 = 660
  const PIPE_X_START = (PIPE_VB_W - PIPE_SPAN) / 2; // (720-660)/2 = 30
  const PIPE_Y = (PIPE_VB_H - PIPE_BOX_H) / 2; // 30

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Insight: one query becomes many, fuse the result */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            One Query Becomes Many; Fuse The Results
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            If the user&apos;s exact wording missed the right doc, one of the variant wordings might catch it. Ask an
            LLM to rewrite the query into 3-5 variants, retrieve top-K for each, then fuse the rankings into one.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${FAN_VB_W} ${FAN_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Fan-out diagram showing a single user query expanding into 3 LLM-generated variants, each retrieving its
                own top-K, then converging into a single fused ranking via RRF.
              </desc>

              {/* User query node (left, centered vertically) */}
              <rect
                x={FAN_QUERY_X}
                y={FAN_CENTER_Y}
                width={FAN_NODE_W}
                height={FAN_NODE_H}
                rx="8"
                fill={C.red}
                fillOpacity="0.18"
                stroke={C.red}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={FAN_QUERY_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 + 4}
                fill="#ef9a9a"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                User Query
              </text>

              {/* Three variant nodes (middle column) */}
              {FAN_VARIANT_YS.map((vy, i) => (
                <g key={`variant-${i}`}>
                  {/* Edge from user query to variant */}
                  <line
                    x1={FAN_QUERY_X + FAN_NODE_W}
                    y1={FAN_CENTER_Y + FAN_NODE_H / 2}
                    x2={FAN_VARIANT_X}
                    y2={vy + FAN_NODE_H / 2}
                    stroke={C.orange}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                  {/* Variant box */}
                  <rect
                    x={FAN_VARIANT_X}
                    y={vy}
                    width={FAN_NODE_W}
                    height={FAN_NODE_H}
                    rx="8"
                    fill={C.orange}
                    fillOpacity="0.18"
                    stroke={C.orange}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />
                  <text
                    x={FAN_VARIANT_X + FAN_NODE_W / 2}
                    y={vy + FAN_NODE_H / 2 + 4}
                    fill="#ffcc80"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {`Variant ${i + 1}`}
                  </text>

                  {/* Edge from variant to retrieved set */}
                  <line
                    x1={FAN_VARIANT_X + FAN_NODE_W}
                    y1={vy + FAN_NODE_H / 2}
                    x2={FAN_SET_X}
                    y2={vy + FAN_NODE_H / 2}
                    stroke={C.yellow}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                  {/* Retrieved set box */}
                  <rect
                    x={FAN_SET_X}
                    y={vy}
                    width={FAN_NODE_W}
                    height={FAN_NODE_H}
                    rx="8"
                    fill={C.yellow}
                    fillOpacity="0.18"
                    stroke={C.yellow}
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                  />
                  <text
                    x={FAN_SET_X + FAN_NODE_W / 2}
                    y={vy + FAN_NODE_H / 2 + 4}
                    fill="#ffe082"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    Top-K Docs
                  </text>

                  {/* Edge from each retrieved set into fused ranking */}
                  <line
                    x1={FAN_SET_X + FAN_NODE_W}
                    y1={vy + FAN_NODE_H / 2}
                    x2={FAN_FUSED_X}
                    y2={FAN_CENTER_Y + FAN_NODE_H / 2}
                    stroke={C.green}
                    strokeOpacity="0.55"
                    strokeWidth="1.6"
                  />
                </g>
              ))}

              {/* Fused ranking node (right, centered vertically) */}
              <rect
                x={FAN_FUSED_X}
                y={FAN_CENTER_Y}
                width={FAN_NODE_W}
                height={FAN_NODE_H}
                rx="8"
                fill={C.green}
                fillOpacity="0.18"
                stroke={C.green}
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
              <text
                x={FAN_FUSED_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 - 2}
                fill="#a5d6a7"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Fused Ranking
              </text>
              <text
                x={FAN_FUSED_X + FAN_NODE_W / 2}
                y={FAN_CENTER_Y + FAN_NODE_H / 2 + 14}
                fill="#a5d6a7"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                (Via RRF)
              </text>
            </svg>
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
              RAG-Fusion is the same idea under a different name. This chapter absorbs it.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── 3-step pipeline: generate -> retrieve -> fuse */}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Three Steps: Generate Variants -&gt; Retrieve Each -&gt; Fuse
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            The whole pipeline fits in three stages. The LLM rewrites; the vector index runs N independent retrievals;
            RRF combines the N rankings into one final list.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${PIPE_VB_W} ${PIPE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Three-box horizontal pipeline diagram for multi-query expansion: an LLM generates 3-5 query variants,
                vector retrieval runs for each variant, and the rankings are fused with RRF into one final list.
              </desc>

              {MQE_PIPELINE_STAGES.map((stage, i) => {
                const x = PIPE_X_START + i * (PIPE_BOX_W + PIPE_GAP);
                const cx = x + PIPE_BOX_W / 2;
                return (
                  <g key={stage.label}>
                    <rect
                      x={x}
                      y={PIPE_Y}
                      width={PIPE_BOX_W}
                      height={PIPE_BOX_H}
                      rx="8"
                      fill={stage.color}
                      fillOpacity="0.18"
                      stroke={stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    <text
                      x={cx}
                      y={PIPE_Y + PIPE_BOX_H / 2 - 4}
                      fill={stage.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {stage.label}
                    </text>
                    <text
                      x={cx}
                      y={PIPE_Y + PIPE_BOX_H / 2 + 14}
                      fill={stage.accent}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {stage.sublabel}
                    </text>

                    {i < MQE_PIPELINE_STAGES.length - 1 && (
                      <g>
                        <line
                          x1={x + PIPE_BOX_W + 2}
                          y1={PIPE_Y + PIPE_BOX_H / 2}
                          x2={x + PIPE_BOX_W + PIPE_GAP - 4}
                          y2={PIPE_Y + PIPE_BOX_H / 2}
                          stroke={C.orange}
                          strokeOpacity="0.65"
                          strokeWidth="1.6"
                        />
                        <polygon
                          points={`${x + PIPE_BOX_W + PIPE_GAP - 4},${PIPE_Y + PIPE_BOX_H / 2 - 4} ${x + PIPE_BOX_W + PIPE_GAP - 4},${PIPE_Y + PIPE_BOX_H / 2 + 4} ${x + PIPE_BOX_W + PIPE_GAP},${PIPE_Y + PIPE_BOX_H / 2}`}
                          fill={C.orange}
                          fillOpacity="0.65"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
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
              Stage 2 runs in parallel - N retrievals fire at once, not in sequence. Latency is dominated by stage 1
              (the LLM call), not stage 2.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Worked example: cancel + refund */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Worked Example: &apos;Cancel My Subscription And Get A Refund&apos;
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            One query, two intents. A single vector lookup is forced to compromise. With multi-query expansion, the LLM
            splits the wording, each intent gets its own retrieval, and RRF merges them into one ranking.
          </T>

          {/* Top: user query panel */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}12`,
              border: `1px solid ${C.yellow}30`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              User Query
            </T>
            <T color="#ffe082" center size={14} style={{ marginTop: 6 }}>
              &quot;Cancel my subscription and get a refund&quot;
            </T>
          </div>

          {/* Middle: 3 LLM-generated variants */}
          <T color={C.yellow} bold center size={14} style={{ marginTop: 14 }}>
            LLM-Generated Variants
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_VARIANTS.map((v) => (
              <div
                key={v.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}24`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={13}>
                  {v.label}
                </T>
                <T color="#ffe082" center size={13} style={{ marginTop: 6 }}>
                  &quot;{v.text}&quot;
                </T>
              </div>
            ))}
          </div>

          {/* Bottom: 3-column rank table - top-3 per variant */}
          <T color={C.yellow} bold center size={14} style={{ marginTop: 14 }}>
            Top-3 Retrieved Docs Per Variant
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_VARIANT_RANKINGS.map((row) => (
              <div
                key={row.variant}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}18`,
                  textAlign: "center",
                }}
              >
                <T color={C.yellow} bold center size={13}>
                  {row.variant}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {row.docs.map((doc, idx) => (
                    <div
                      key={`${row.variant}-${doc}`}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        background: `${C.yellow}12`,
                        border: `1px solid ${C.yellow}24`,
                        textAlign: "center",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      <T color="#ffe082" center size={12}>
                        Rank {idx + 1}: {doc}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Final fused ranking - tinted green to highlight the result */}
          <T color={C.green} bold center size={14} style={{ marginTop: 14 }}>
            Final Fused Top-3 (After RRF)
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {MQE_FUSED_TOP3.map((doc, idx) => (
              <div
                key={doc.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}30`,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold center size={13}>
                  Rank {idx + 1}
                </T>
                <T color="#a5d6a7" bold center size={14} style={{ marginTop: 6 }}>
                  {doc.id}
                </T>
                <T color="#a5d6a7" center size={12} style={{ marginTop: 4 }}>
                  {doc.note}
                </T>
              </div>
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
              Each variant brings a different doc to the top. Fusion captures both intents - doc-15 for cancellation,
              doc-4 for refund.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── RRF formula */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Fuse With RRF (Same Formula As Chapter 12.16)
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Reciprocal Rank Fusion takes N rankings and produces one. Each doc&apos;s score is the sum of 1 / (k + its
            rank) across every ranking it appears in. The constant k = 60 dampens the influence of any single list so
            agreement across variants matters more than a top-1 appearance.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${C.purple}24`,
              textAlign: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 15,
              color: "#b8a9ff",
              lineHeight: 1.6,
            }}
          >
            <div>RRF(d) = sum over variants v of: 1 / (k + rank_v(d))</div>
            <div style={{ marginTop: 10 }}>where k = 60 (standard)</div>
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
              Same fusion math as hybrid search (covered in chapter 12.16). Different inputs - here the rankings come
              from N variants of the same query rather than from BM25 + dense.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Step-back prompting variant */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Step-Back Prompting: Add A More General Variant
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Step-back is a specific variant style: ask a broader, less specific version of the question. The intuition:
            a doc might not match the user&apos;s exact narrow wording, but it almost certainly matches a more general
            phrasing of the same problem.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Original query (specific) */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}24`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Original (Very Specific)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;Why is the user role page failing on Chrome v124 with error E_PERM?&quot;
              </T>
            </div>

            {/* Step-back query (general) */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Step-Back (More General)
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 8 }}>
                &quot;Why does the user role page fail?&quot;
              </T>
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
              The original is too specific - the doc might not mention Chrome v124. The step-back catches more general
              docs. Reasoning models reduce the need for explicit step-back; include it when your queries are unusually
              specific.
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
              This is one of many possible variant prompts. The chapter&apos;s main approach covers the common case;
              step-back is a niche addition.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── When to use it */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            When Multi-Query Helps
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Multi-query expansion is not a default - it earns its keep on hard, ambiguous, or multi-intent queries. On
            short factual lookups it just burns budget.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Helps column - green tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}30`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={14}>
                Helps
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {MQE_HELPS.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}06`,
                      border: `1px solid ${C.green}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#a5d6a7" center size={13}>
                      {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            {/* Skip column - red tint */}
            <div
              style={{
                padding: 14,
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold center size={14}>
                Skip
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {MQE_SKIP.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.red}06`,
                      border: `1px solid ${C.red}18`,
                      textAlign: "center",
                    }}
                  >
                    <T color="#ef9a9a" center size={13}>
                      {item}
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color="#80deea" center size={14}>
              Adds ~300 ms (1 LLM call) + N parallel retrievals (cheap). Often pairs well with HyDE for hard cases.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// 12.21 QueryRoutingDecomposition - send queries to the right target, split complex ones
// ───────────────────────────────────────────────────────────────

// Sub=0 two-column strategy card. Left frames routing as a "where" question;
// right frames decomposition as a "how many" question.
const QRD_STRATEGY_COLS = [
  {
    side: "Routing",
    question: "Which index / tool should this query hit?",
    answer: "Pick one target. Skip retrieval entirely for off-topic chitchat.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    side: "Decomposition",
    question: "Does this query need to be split into sub-queries?",
    answer: "Split complex queries into 2-3 sub-queries; retrieve and assemble.",
    color: C.orange,
    accent: "#ffcc80",
  },
];

// Sub=1 router decision tree. Four leaves; each carries a target index and a
// top-k recommendation. Troubleshooting bumps top-k because surface symptoms
// often spread across multiple docs.
const QRD_ROUTER_LEAVES = [
  {
    branch: "Account & Billing",
    target: "Account-Billing Index",
    topK: "Top-K = 5",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    branch: "Product Features",
    target: "Product-Features Index",
    topK: "Top-K = 5",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    branch: "Troubleshooting",
    target: "Troubleshooting Index",
    topK: "Top-K = 8",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    branch: "Chitchat / Off-Topic",
    target: "Skip Retrieval",
    topK: "Reply Directly",
    color: C.red,
    accent: "#ef9a9a",
  },
];

// Sub=2 router implementation comparison. Realistic ballpark numbers - semantic
// router is ~15x faster on dense ops but less accurate on edge phrasing.
const QRD_ROUTER_IMPLS = [
  {
    name: "Semantic Router (Embedding-Based)",
    how: "Embed the query, compare to embeddings of route prototypes ('Billing question', 'Troubleshooting question'). Pick highest cosine.",
    cost: "~$0.0001 / Query",
    latency: "~10 Ms",
    accuracy: "85-90%",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    name: "LLM Classifier",
    how: "Pass the query + route labels to a small LLM ('Classify this query: billing / feature / troubleshoot / chitchat'). Pick the label.",
    cost: "~$0.0002 / Query",
    latency: "~150 Ms",
    accuracy: "92-97%",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

// Sub=3 decomposition example. The user asks to compare two plans; the LLM
// splits to one sub-query per plan; retrieval runs once per sub-query; the
// final LLM call assembles the comparison from the union of retrieved docs.
const QRD_DECOMP_SUBQUERIES = [
  {
    label: "Sub-Query 1",
    text: "What's in the Pro plan?",
    docs: [
      { id: "doc-3", note: "Subscription Tiers" },
      { id: "doc-10", note: "Team Seat Management" },
    ],
    color: C.cyan,
    accent: "#80deea",
  },
  {
    label: "Sub-Query 2",
    text: "What's in the Enterprise plan?",
    docs: [
      { id: "doc-3", note: "Subscription Tiers" },
      { id: "doc-10", note: "Team Seat Management" },
      { id: "doc-21", note: "Quota Exceeded - Enterprise-Only Feature" },
    ],
    color: C.purple,
    accent: "#b8a9ff",
  },
];

// Sub=4 when-to-decompose row cards. Three canonical shapes that benefit from
// splitting; each row carries the running example and the split it produces.
const QRD_DECOMP_SHAPES = [
  {
    shape: "Comparison",
    example: "Compare the Pro and Enterprise plans.",
    split: "Sub-1: What's in the Pro plan? + Sub-2: What's in the Enterprise plan?",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    shape: "Multi-Hop",
    example: "How do I reset my password if I forgot my email?",
    split: "Sub-1: How to recover email? + Sub-2: How to reset password?",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    shape: "Disjunction (Mixed Types)",
    example: "Why is the dashboard slow and showing 500 errors?",
    split: "Sub-1: Dashboard slow troubleshooting + Sub-2: 500 error troubleshooting",
    color: C.orange,
    accent: "#ffcc80",
  },
];

// Sub=5 2x2 decision grid. Route only is the dominant default; both is the
// strongest combination; neither is the right answer for simple lookups.
const QRD_DECISION_GRID = [
  {
    label: "Route Only",
    body: "Most production RAG systems start here. Cheap, easy, high-impact.",
    color: C.cyan,
    accent: "#80deea",
  },
  {
    label: "Decompose Only",
    body: "Use when queries are consistently complex (multi-hop, comparisons). Adds 1 LLM call + N parallel retrievals.",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    label: "Both",
    body: "Route first to pick the right index, then decompose if the query is complex. They compose - they don't interfere.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    label: "Neither",
    body: "Default for simple lookup queries. Don't add complexity you don't need.",
    color: C.red,
    accent: "#ef9a9a",
  },
];

export const QueryRoutingDecomposition = (ctx) => {
  const { sub } = ctx;

  // Sub=1 router decision tree geometry. Root box at top center; 4 leaves
  // evenly spaced along a single row at the bottom. Branch lines fan out
  // from the root center to each leaf center.
  const TREE_VB_W = 720;
  const TREE_VB_H = 280;
  const TREE_ROOT_W = 220;
  const TREE_ROOT_H = 56;
  const TREE_ROOT_X = (TREE_VB_W - TREE_ROOT_W) / 2;
  const TREE_ROOT_Y = 10;
  const TREE_LEAF_W = 150;
  const TREE_LEAF_H = 76;
  const TREE_LEAF_Y = 180;
  const TREE_LEAF_GAP = 18;
  const TREE_LEAVES_SPAN = QRD_ROUTER_LEAVES.length * TREE_LEAF_W + (QRD_ROUTER_LEAVES.length - 1) * TREE_LEAF_GAP;
  const TREE_LEAVES_X_START = (TREE_VB_W - TREE_LEAVES_SPAN) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ─── sub=0 ─── Two strategies framed side by side */}
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Routing Decides Where; Decomposition Decides How Many
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Two related query-transformation strategies share this chapter. Routing answers a where question - which
            index or tool should the query hit. Decomposition answers a how-many question - does the query need to be
            split into smaller sub-queries first.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_STRATEGY_COLS.map((col) => (
              <div
                key={col.side}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${col.color}06`,
                  border: `1px solid ${col.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={col.color} bold center size={16}>
                  {col.side}
                </T>
                <T color={col.accent} center size={14} style={{ marginTop: 8 }}>
                  {col.question}
                </T>
                <T color={col.accent} center size={13} style={{ marginTop: 8 }}>
                  {col.answer}
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
              Both rely on an LLM (or a cheaper classifier) to inspect the query and decide. They compose - a router can
              send a query to a decomposition step, or a decomposed sub-query can itself be routed to a different index.
            </T>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Router decision tree with 4 leaves */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Routing Sends Each Query To The Right Target
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            On the running support corpus, queries split cleanly into four buckets. A router classifies each query into
            one of them, then sends it to the matching index - or skips retrieval entirely for chitchat.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TREE_VB_W} ${TREE_VB_H}`} width="100%" style={{ maxWidth: 720, height: "auto" }}>
              <desc>
                Router decision tree with four leaves: account/billing, product features, troubleshooting, and chitchat
                (skip retrieval). The root labels classify-query-type.
              </desc>

              {/* Root: Classify Query Type */}
              <rect
                x={TREE_ROOT_X}
                y={TREE_ROOT_Y}
                width={TREE_ROOT_W}
                height={TREE_ROOT_H}
                rx="8"
                fill={C.cyan}
                fillOpacity="0.18"
                stroke={C.cyan}
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              <text
                x={TREE_ROOT_X + TREE_ROOT_W / 2}
                y={TREE_ROOT_Y + TREE_ROOT_H / 2 + 5}
                fill="#80deea"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
              >
                Classify Query Type
              </text>

              {/* Branches and leaves */}
              {QRD_ROUTER_LEAVES.map((leaf, i) => {
                const leafX = TREE_LEAVES_X_START + i * (TREE_LEAF_W + TREE_LEAF_GAP);
                const leafCx = leafX + TREE_LEAF_W / 2;
                const rootCx = TREE_ROOT_X + TREE_ROOT_W / 2;
                const rootBottomY = TREE_ROOT_Y + TREE_ROOT_H;
                return (
                  <g key={leaf.branch}>
                    {/* Branch line from root bottom to leaf top */}
                    <line
                      x1={rootCx}
                      y1={rootBottomY}
                      x2={leafCx}
                      y2={TREE_LEAF_Y}
                      stroke={leaf.color}
                      strokeOpacity="0.55"
                      strokeWidth="1.6"
                    />
                    {/* Leaf rect */}
                    <rect
                      x={leafX}
                      y={TREE_LEAF_Y}
                      width={TREE_LEAF_W}
                      height={TREE_LEAF_H}
                      rx="8"
                      fill={leaf.color}
                      fillOpacity="0.18"
                      stroke={leaf.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.7"
                    />
                    <text
                      x={leafCx}
                      y={TREE_LEAF_Y + 18}
                      fill={leaf.accent}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.branch}
                    </text>
                    <text x={leafCx} y={TREE_LEAF_Y + 38} fill={leaf.accent} fontSize="11" textAnchor="middle">
                      {leaf.target}
                    </text>
                    <text
                      x={leafCx}
                      y={TREE_LEAF_Y + 56}
                      fill={leaf.accent}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {leaf.topK}
                    </text>
                  </g>
                );
              })}
            </svg>
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
              Routing avoids retrieving from indexes that can&apos;t help. Skipping retrieval on chitchat saves latency
              and cost - and prevents the LLM from hallucinating about a doc it doesn&apos;t need to read.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Router implementations: semantic vs LLM classifier */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Two Router Implementations: Embedding-Based Vs LLM Classifier
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            The routing decision can be made by a tiny embedding lookup or by a small LLM call. The tradeoff is the
            usual one: embedding-based is ~15x faster and slightly cheaper; LLM classifier handles ambiguous wording
            better.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {QRD_ROUTER_IMPLS.map((impl) => (
              <div
                key={impl.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${impl.color}06`,
                  border: `1px solid ${impl.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={impl.color} bold center size={15}>
                  {impl.name}
                </T>
                <T color={impl.accent} center size={13} style={{ marginTop: 8 }}>
                  {impl.how}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Cost
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.cost}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Latency
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.latency}
                    </T>
                  </div>
                  <div
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      background: `${impl.color}12`,
                      border: `1px solid ${impl.color}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={impl.accent} bold center size={12}>
                      Accuracy
                    </T>
                    <T color={impl.accent} center size={13} style={{ marginTop: 4 }}>
                      {impl.accuracy}
                    </T>
                  </div>
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
              Semantic router scales cheaper; LLM classifier handles edge cases better. Start with semantic; switch to
              LLM if routing accuracy stalls below your bar.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Decomposition: Pro vs Enterprise example */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Decomposition Splits &apos;Compare X And Y&apos; Into Two Sub-Queries
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            One query, two subjects. A single vector lookup gets pulled toward whichever subject has stronger phrasing
            and misses the other. Decomposition guarantees both sides of the comparison are retrieved before the LLM
            writes the answer.
          </T>

          {/* Panel A: user query */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}12`,
              border: `1px solid ${C.orange}30`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={14}>
              User Query
            </T>
            <T color="#ffcc80" center size={14} style={{ marginTop: 6 }}>
              &quot;Compare the Pro and Enterprise plans.&quot;
            </T>
          </div>

          {/* Panel B: LLM-generated sub-queries */}
          <T color={C.orange} bold center size={14} style={{ marginTop: 14 }}>
            LLM Splits Into Sub-Queries
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECOMP_SUBQUERIES.map((sq) => (
              <div
                key={sq.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${sq.color}06`,
                  border: `1px solid ${sq.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={sq.color} bold center size={13}>
                  {sq.label}
                </T>
                <T color={sq.accent} center size={14} style={{ marginTop: 6 }}>
                  &quot;{sq.text}&quot;
                </T>
              </div>
            ))}
          </div>

          {/* Panel C: retrieved docs per sub-query */}
          <T color={C.orange} bold center size={14} style={{ marginTop: 14 }}>
            Retrieved Docs Per Sub-Query
          </T>
          <div
            style={{
              marginTop: 8,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECOMP_SUBQUERIES.map((sq) => (
              <div
                key={`docs-${sq.label}`}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${sq.color}06`,
                  border: `1px solid ${sq.color}18`,
                  textAlign: "center",
                }}
              >
                <T color={sq.color} bold center size={13}>
                  {sq.label} Hits
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                  {sq.docs.map((doc) => (
                    <div
                      key={`${sq.label}-${doc.id}`}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        background: `${sq.color}12`,
                        border: `1px solid ${sq.color}24`,
                        textAlign: "center",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}
                    >
                      <T color={sq.accent} center size={12}>
                        {doc.id} - {doc.note}
                      </T>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Assembly step: union of retrieved docs feeds the LLM */}
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}12`,
              border: `1px solid ${C.green}30`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold center size={14}>
              LLM Assembly Step
            </T>
            <T color="#a5d6a7" center size={13} style={{ marginTop: 6 }}>
              Union of retrieved docs (doc-3, doc-10, doc-21) is passed to a single LLM call that writes the
              side-by-side comparison.
            </T>
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
              Without decomposition, retrieval finds one tier&apos;s docs and misses the other. Decomposition guarantees
              both sides of the comparison are retrieved before the LLM has to answer.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── When to decompose: 3 shapes */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            When To Decompose: Multi-Hop, Comparison, Disjunction
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Three query shapes consistently benefit from being split before retrieval. Each row shows the shape, a real
            example, and the sub-queries the LLM produces.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {QRD_DECOMP_SHAPES.map((row) => (
              <div
                key={row.shape}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={row.color} bold center size={14}>
                  {row.shape}
                </T>
                <T color={row.accent} center size={13} style={{ marginTop: 6 }}>
                  Example: &quot;{row.example}&quot;
                </T>
                <T color={row.accent} center size={13} style={{ marginTop: 6 }}>
                  Split: {row.split}
                </T>
              </div>
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
              If the query has &apos;and&apos; / &apos;compare&apos; / &apos;or&apos; between two distinct subjects,
              decomposition usually helps. Single-subject queries don&apos;t benefit and just pay the extra LLM call for
              nothing.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── 2x2 decision: route, decompose, both, neither */}
      <Reveal when={sub >= 5}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            The Decision: Route, Decompose, Both, Or Neither
          </T>
          <T color="#f8bbd0" center size={16} style={{ marginTop: 10 }}>
            Four combinations cover every production case. Pick by query complexity and the shape of your retrieval
            stack, not by what sounds clever.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {QRD_DECISION_GRID.map((cell) => (
              <div
                key={cell.label}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${cell.color}06`,
                  border: `1px solid ${cell.color}30`,
                  textAlign: "center",
                }}
              >
                <T color={cell.color} bold center size={15}>
                  {cell.label}
                </T>
                <T color={cell.accent} center size={13} style={{ marginTop: 8 }}>
                  {cell.body}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f8bbd0" bold center size={14}>
              Cost Summary
            </T>
            <T color="#f8bbd0" center size={13} style={{ marginTop: 6 }}>
              Routing: +10-150 ms / +$0.0001-0.0002 per query. Decomposition: +200-300 ms / +$0.0005 per query.
              Combined: ~+300-450 ms total query-transformation overhead.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};
