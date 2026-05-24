import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Two contrasting queries showing why neither retriever alone is enough.
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

// Computed RRF scores.
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

// Helper: render one row of the 5-column alpha tuning table in sub=4.
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

export default function HybridForRAG(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

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
            Hybrid search (covered in Section 17.5) ships dense vectors and BM25 side by side and fuses their rankings.
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
                {[...RRF_EXAMPLE.bm25Ranks]
                  .sort((a, b) => a.rank - b.rank)
                  .map((r) => (
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
                {[...RRF_EXAMPLE.denseRanks]
                  .sort((a, b) => a.rank - b.rank)
                  .map((r) => (
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
