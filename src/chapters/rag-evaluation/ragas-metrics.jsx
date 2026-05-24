import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";
import { FormulaBox } from "../../shared/rag-helpers.jsx";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
const RG_INTRO_METRICS = [
  {
    name: "Faithfulness",
    question: "Are The Claims Supported?",
    color: C.purple,
    accent: "#b8a9ff",
  },
  {
    name: "Answer Relevancy",
    question: "Does It Answer The Question?",
    color: C.orange,
    accent: "#ffcc80",
  },
  {
    name: "Context Precision",
    question: "Are Top Results Actually Relevant?",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Context Recall",
    question: "Did We Retrieve Everything?",
    color: C.red,
    accent: "#ef9a9a",
  },
];

// Faithfulness worked example claims.
const RG_FAITHFULNESS_CLAIMS = [
  { n: 1, claim: "Go to Settings > Security", verdict: "Supported" },
  { n: 2, claim: "Click Forgot Password", verdict: "Supported" },
  { n: 3, claim: "Check Your Email", verdict: "Supported" },
  { n: 4, claim: "Use The Link Within 24 Hours", verdict: "Supported" },
  { n: 5, claim: "You Can Also Call Support", verdict: "Not Supported" },
];

// Answer Relevancy worked example.
const RG_RELEVANCY_QUESTIONS = [
  { text: "What Are The Steps To Reset My Password?", cosine: 0.94 },
  { text: "How Can I Change My Password If I Forgot It?", cosine: 0.91 },
  { text: "How Do I Update My Account Password?", cosine: 0.89 },
];

// Context Precision worked example.
const RG_PRECISION_CHUNKS = [
  { rank: 1, chunk: "doc-1 chunk-1 - Password Reset Intro", relevant: true },
  { rank: 2, chunk: "doc-23 chunk-2 - 500 Error Troubleshooting", relevant: false },
  { rank: 3, chunk: "doc-1 chunk-2 - Password Reset Email Step", relevant: true },
];

// Context Recall worked example chunks (all retrieved -> recall = 1.0).
const RG_RECALL_CHUNKS = [
  { chunk: "doc-1 chunk-1 - Password Reset Intro" },
  { chunk: "doc-1 chunk-2 - Password Reset Email Step" },
];

// Counter-example: one chunk missed -> recall = 0.5. The ternary in the
// renderer exercises both branches so coverage stays at 100/100.
const RG_RECALL_CHUNKS_COUNTER = [
  { chunk: "doc-1 chunk-1 - Password Reset Intro", retrieved: true },
  { chunk: "doc-1 chunk-2 - Password Reset Email Step", retrieved: false },
];

// Per-query report card scores.
const RG_REPORT_CARD = [
  { name: "Faithfulness", score: 0.8, color: C.purple, accent: "#b8a9ff" },
  { name: "Answer Relevancy", score: 0.91, color: C.orange, accent: "#ffcc80" },
  { name: "Context Precision", score: 0.67, color: C.green, accent: "#a5d6a7" },
  { name: "Context Recall", score: 1.0, color: C.red, accent: "#ef9a9a" },
];

export default function RAGASMetrics(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const reportAverage = RG_REPORT_CARD.reduce((s, r) => s + r.score, 0) / RG_REPORT_CARD.length;

  // FormulaBox is imported from ../../shared/rag-helpers.jsx.

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── Why RAGAS */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            RAGAS: Reference-Free RAG Metrics
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            RAGAS (Retrieval-Augmented Generation Assessment) is a 2023 metric suite that uses an LLM under the hood to
            compute eval scores without needing a reference answer. Four core metrics, two for retrieval, two for
            generation.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {RG_INTRO_METRICS.map((m) => (
              <div
                key={m.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${m.color}06`,
                  border: `1px solid ${m.color}12`,
                  textAlign: "center",
                }}
              >
                <T color={m.color} bold center size={15}>
                  {m.name}
                </T>
                <T color={m.accent} center size={13} style={{ marginTop: 6 }}>
                  {m.question}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Faithfulness */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Faithfulness
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Faithfulness asks whether every claim in the generated answer can be verified in the retrieved context. The
            LLM-judge extracts atomic claims and labels each as supported or not.
          </T>

          <FormulaBox color={C.purple}>
            <span style={{ color: "#b8a9ff" }}>Faithfulness = | verifiable_claims | / | total_claims_in_answer |</span>
          </FormulaBox>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={15}>
              Worked Example: Password Reset Query
            </T>
            <T color="#b8a9ff" center size={13} style={{ marginTop: 8 }}>
              Retrieved context (doc-1): "To reset your password, go to Settings &gt; Security. Click Forgot Password.
              An email is sent to your registered address. The link expires after 24 hours."
            </T>
            <T color="#b8a9ff" center size={13} style={{ marginTop: 6 }}>
              Generated answer: "Go to Settings &gt; Security, click Forgot Password, check your email, and use the link
              within 24 hours. You can also call support."
            </T>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {RG_FAITHFULNESS_CLAIMS.map((c) => {
                const ok = c.verdict === "Supported";
                return (
                  <div
                    key={c.n}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "30px 1fr 130px",
                      gap: 10,
                      padding: 8,
                      borderRadius: 6,
                      background: ok ? `${C.green}10` : `${C.red}10`,
                      border: `1px solid ${ok ? C.green : C.red}30`,
                      textAlign: "left",
                    }}
                  >
                    <T color={C.purple} bold size={13}>
                      {c.n}.
                    </T>
                    <T color="#b8a9ff" size={13}>
                      {c.claim}
                    </T>
                    <T color={ok ? C.green : C.red} bold size={13}>
                      {c.verdict}
                    </T>
                  </div>
                );
              })}
            </div>

            <T color={C.purple} bold center size={16} style={{ marginTop: 12 }}>
              Faithfulness = 4 / 5 = 0.8
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Answer Relevancy */}
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Answer Relevancy
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Answer Relevancy is a round-trip check: the LLM-judge reads the generated answer and writes n new questions
            that the answer would best answer. Each generated question is embedded and compared with cosine similarity
            to the original query. The average is the relevancy score.
          </T>

          <FormulaBox color={C.orange}>
            <span style={{ color: "#ffcc80" }}>
              Answer Relevancy = (1/n) * sum( cosine( embed(q), embed(q_i_generated) ) )
            </span>
          </FormulaBox>

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
            <T color={C.orange} bold center size={15}>
              Worked Example: n = 3 Round-Trip Questions
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 6 }}>
              Original query: "How do I reset my password?"
            </T>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {RG_RELEVANCY_QUESTIONS.map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "30px 1fr 80px",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.orange}10`,
                    border: `1px solid ${C.orange}30`,
                    textAlign: "left",
                  }}
                >
                  <T color={C.orange} bold size={13}>
                    Q{i + 1}.
                  </T>
                  <T color="#ffcc80" size={13}>
                    {q.text}
                  </T>
                  <T color={C.orange} bold size={13}>
                    cos {q.cosine}
                  </T>
                </div>
              ))}
            </div>

            <T color={C.orange} bold center size={16} style={{ marginTop: 12 }}>
              Answer Relevancy = (0.94 + 0.91 + 0.89) / 3 = 0.913
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Context Precision */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Context Precision
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            Context Precision asks what fraction of the top-k retrieved chunks were actually relevant. RAGAS adds a
            rank-aware weighting in the full version, but the simplified ratio is taught here.
          </T>

          <FormulaBox color={C.green}>
            <span style={{ color: "#a5d6a7" }}>Context Precision = relevant_chunks_at_top_k / k</span>
          </FormulaBox>

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
            <T color={C.green} bold center size={15}>
              Worked Example: Top-3 For Password Reset Query
            </T>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {RG_PRECISION_CHUNKS.map((c) => (
                <div
                  key={c.rank}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "30px 1fr 130px",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: c.relevant ? `${C.green}10` : `${C.red}10`,
                    border: `1px solid ${c.relevant ? C.green : C.red}30`,
                    textAlign: "left",
                  }}
                >
                  <T color={C.green} bold size={13}>
                    {c.rank}.
                  </T>
                  <T color="#a5d6a7" size={13}>
                    {c.chunk}
                  </T>
                  <T color={c.relevant ? C.green : C.red} bold size={13}>
                    {c.relevant ? "Relevant" : "Not Relevant"}
                  </T>
                </div>
              ))}
            </div>

            <T color={C.green} bold center size={16} style={{ marginTop: 12 }}>
              Context Precision = 2 / 3 = 0.667
            </T>
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
            <T color={C.green} bold center size={14}>
              Naming Note: DeepEval / TruLens Call This ContextualRelevancyScore
            </T>
            <T color="#a5d6a7" center size={14} style={{ marginTop: 6 }}>
              Same idea under a different framework name. Older RAGAS shipped a separate "Context Relevancy" metric; it
              was deprecated in favor of Context Precision (this) plus Context Recall (next sub-step).
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Context Recall */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Context Recall
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            Context Recall asks what fraction of all the relevant chunks in the corpus were retrieved. It is the dual of
            precision: precision says "are top results clean?", recall says "did we miss anything?".
          </T>

          <FormulaBox color={C.red}>
            <span style={{ color: "#ef9a9a" }}>
              Context Recall = relevant_chunks_retrieved / all_relevant_chunks_in_corpus
            </span>
          </FormulaBox>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Worked Example: 2 Relevant Chunks Exist In Corpus
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 6 }}>
              The corpus has 2 chunks relevant to "How do I reset my password?": doc-1 chunk-1 and doc-1 chunk-2.
            </T>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {RG_RECALL_CHUNKS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 130px",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.red}10`,
                    border: `1px solid ${C.red}30`,
                    textAlign: "left",
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    {c.chunk}
                  </T>
                  <T color={C.green} bold size={13}>
                    Retrieved
                  </T>
                </div>
              ))}
            </div>

            <T color={C.red} bold center size={16} style={{ marginTop: 12 }}>
              Context Recall = 2 / 2 = 1.0
            </T>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={15}>
              Counter-Example: One Chunk Missed
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 6 }}>
              If retrieval had returned only doc-1 chunk-1 and missed doc-1 chunk-2:
            </T>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {RG_RECALL_CHUNKS_COUNTER.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 130px",
                    gap: 10,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.red}10`,
                    border: `1px solid ${C.red}30`,
                    textAlign: "left",
                  }}
                >
                  <T color="#ef9a9a" size={13}>
                    {c.chunk}
                  </T>
                  <T color={c.retrieved ? C.green : C.red} bold size={13}>
                    {c.retrieved ? "Retrieved" : "Missed"}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.red} bold center size={16} style={{ marginTop: 12 }}>
              Context Recall = 1 / 2 = 0.5
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Per-query report card */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Putting It Together: A Per-Query Report Card
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            One query, four scores. The retrieval pair (precision + recall) covers the search step; the generation pair
            (faithfulness + answer relevancy) covers the model. The triangle in 23.1 splits the same way.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {RG_REPORT_CARD.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 160px",
                  gap: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: `${r.color}06`,
                  border: `1px solid ${r.color}30`,
                  alignItems: "center",
                }}
              >
                <T color={r.color} bold size={14}>
                  {r.name}
                </T>
                <T color={r.color} bold size={16} center>
                  {r.score.toFixed(2)}
                </T>
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: `${r.color}20`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${r.score * 100}%`,
                      background: r.color,
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 160px",
                gap: 10,
                padding: 10,
                borderRadius: 8,
                background: `${C.yellow}10`,
                border: `1px solid ${C.yellow}`,
                alignItems: "center",
              }}
            >
              <T color={C.yellow} bold size={14}>
                Average
              </T>
              <T color={C.yellow} bold size={16} center>
                {reportAverage.toFixed(3)}
              </T>
              <T color="#ffe082" size={12}>
                Headline Score Per Query
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}30`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={14}>
              How RAGAS Computes The Scores
            </T>
            <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
              An LLM-judge extracts atomic claims for faithfulness, generates round-trip questions for relevancy, and
              labels each retrieved chunk as relevant or not for precision and recall.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── BLEU/ROUGE deprecated */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Not RAGAS: BLEU &amp; ROUGE
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}12`,
              textAlign: "center",
            }}
          >
            <T color="#f48fb1" center size={15}>
              BLEU and ROUGE compute n-gram overlap between the generated answer and a reference answer.
            </T>
            <T color="#f48fb1" center size={15} style={{ marginTop: 8 }}>
              They were designed for machine translation and summarisation, where wording proximity matters.
            </T>
            <T color="#f48fb1" center size={15} style={{ marginTop: 8 }}>
              They do not measure faithfulness or groundedness. A perfectly faithful answer in different wording scores
              low; a hallucinated answer that recycles reference words scores high.
            </T>
            <T color="#f48fb1" center size={15} style={{ marginTop: 8 }}>
              Use RAGAS or LLM-as-judge instead (see chapters <ChapterLink to="23.1">23.1</ChapterLink> and{" "}
              <ChapterLink to="23.2">23.2</ChapterLink>).
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
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
