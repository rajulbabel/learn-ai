import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Recall ceiling on the running customer-support corpus.
const RECALL_CEILING_ROWS = [
  { model: "OpenAI ada-002 (Older)", recall: 0.62, color: C.red, accent: "#ef9a9a" },
  { model: "Cohere embed-v3", recall: 0.83, color: C.green, accent: "#a5d6a7" },
  { model: "BGE-Large", recall: 0.81, color: C.cyan, accent: "#80deea" },
];

// Five-axis decision matrix used in sub=1.
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

// Dimension vs memory at 1M vectors. Used in sub=2.
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

// Cost at 100M token ingest. Used in sub=4.
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
const DECISION_STEPS = [
  { question: "Need Multilingual?", yes: "Use Cohere V3 / Voyage / OpenAI 3-Large", no: "Go On" },
  { question: "Specialized Domain?", yes: "Domain-Tuned BGE Or Fine-Tune (See 21.2)", no: "Go On" },
  { question: "Budget Sensitive?", yes: "Self-Host BGE", no: "Go On" },
  { question: "Default", yes: "OpenAI text-embedding-3-large Or Cohere embed-v3", no: null },
];

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

export default function EmbeddingModelChoice(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // SVG geometry for the sub=5 decision flowchart.
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
            from Section 8.2). Two systems on the same corpus, with the same chunks and the same vector DB, can have
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
              model. Domain adaptation and fine-tuning are covered in chapter 21.2.
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
