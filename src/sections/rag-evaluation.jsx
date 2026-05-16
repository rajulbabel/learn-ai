import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 12 Act 8: Evaluation (chapters 12.31-12.35).
// Continues the customer support corpus and 5 standard queries
// established in 12.1-12.30. Per-act color theme: green (eval).
// Files in this section: rag-foundations.jsx (12.1-12.3 + 12.7-12.13),
// rag-ingestion.jsx (12.4-12.6), rag-retrieval.jsx (12.14-12.21),
// rag-generation.jsx (12.22-12.30), rag-evaluation.jsx (here).

// ─── Chapter 12.31 RAGEvalTriangle: module-level data ───
const TRI_VERTICES = [
  {
    label: "Retrieval",
    desc: "Did We Find The Right Docs?",
    cx: 270,
    cy: 80,
    accent: "#80deea",
    color: C.cyan,
  },
  {
    label: "Generation",
    desc: "Did The Model Use Them Faithfully?",
    cx: 110,
    cy: 300,
    accent: "#b8a9ff",
    color: C.purple,
  },
  {
    label: "End-To-End",
    desc: "Did The Final Answer Help The User?",
    cx: 430,
    cy: 300,
    accent: "#ffcc80",
    color: C.orange,
  },
];

const TRI_RETRIEVAL_METRICS = [
  {
    name: "Recall@k",
    formula: "Recall@k = relevant_retrieved / total_relevant",
    interp: "What fraction of all the relevant docs were retrieved?",
  },
  {
    name: "MRR",
    formula: "MRR = (1/N) * sum( 1 / rank_of_first_relevant )",
    interp: "Mean reciprocal rank of the first relevant doc per query.",
  },
  {
    name: "Precision@k",
    formula: "Precision@k = relevant_retrieved / k",
    interp: "What fraction of the top-k retrieved are actually relevant?",
  },
  {
    name: "nDCG@k",
    formula: "nDCG@k = DCG@k / IDCG@k",
    interp: "Normalised discounted cumulative gain - rank-weighted relevance.",
  },
];

const TRI_GENERATION_METRICS = [
  {
    name: "Faithfulness",
    question: "Are the claims in the answer supported by the retrieved context?",
    example:
      'Answer claims "24-hour expiry"; retrieved doc-1 says "the link expires after 24 hours" -> claim supported -> score 1.0.',
  },
  {
    name: "Answer Relevancy",
    question: "Does the answer actually address the question?",
    example:
      'Question: "How do I reset my password?" Answer: "Click forgot password and check your email" -> relevancy 0.9.',
  },
];

const TRI_END_TO_END_METRICS = [
  {
    name: "Correctness",
    question: "Did the final answer match the gold answer? (binary)",
    example:
      'Gold: "Click forgot password and check email." Generated: "Click forgot password link and check your registered email." -> 1.',
  },
  {
    name: "Helpfulness",
    question: "How useful was the answer to the user? (1-5 Likert)",
    example: 'User rated this answer 4/5: "Solved it but had to scroll".',
  },
];

const TRI_FAILURE_SCENARIOS = [
  {
    label: "Scenario A - Retrieval Fault",
    layer: "Retrieval",
    layerColor: C.cyan,
    layerAccent: "#80deea",
    body: "Top-k returns doc-4 (refunds) for a password-reset query; doc-1 never surfaces. Recall@10 drops from 0.95 to 0.30.",
    cause: "Root cause: retrieval. Fix in the retriever (12.14-12.21).",
  },
  {
    label: "Scenario B - Generation Fault",
    layer: "Generation",
    layerColor: C.purple,
    layerAccent: "#b8a9ff",
    body: "Retrieval returns doc-1 + doc-7 correctly. The model ignores them and hallucinates a phone-support step. Faithfulness drops to 0.50.",
    cause: "Root cause: generation. Fix the prompt / model / refusal logic (12.24).",
  },
  {
    label: "Scenario C - Product Fault",
    layer: "End-To-End",
    layerColor: C.orange,
    layerAccent: "#ffcc80",
    body: "Retrieval and generation both score above 0.9. Yet user reports 'this did not help'. Helpfulness drops to 2/5.",
    cause: "Root cause: product / prompting / answer style. Fix online via 12.35.",
  },
];

export const RAGEvalTriangle = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Triangle SVG layout - viewBox 540x360, vertices computed for symmetric padding.
  const TRI_VB_W = 540;
  const TRI_VB_H = 360;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── The three layers shown as a triangle */}
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Three Layers Of RAG Evaluation
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            A bad final answer can come from bad retrieval OR bad generation OR a product-side mismatch. We need a
            metric for each layer so a failure traces to one place. The three layers form a triangle: retrieval,
            generation, end-to-end.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${TRI_VB_W} ${TRI_VB_H}`} width="100%" style={{ maxWidth: 540, height: "auto" }}>
              <desc>
                The three layers of RAG evaluation shown as a triangle: retrieval (top), generation (lower-left),
                end-to-end (lower-right). Each vertex has a one-line caption describing what that layer measures.
              </desc>

              {/* Edges */}
              <line
                x1={TRI_VERTICES[0].cx}
                y1={TRI_VERTICES[0].cy}
                x2={TRI_VERTICES[1].cx}
                y2={TRI_VERTICES[1].cy}
                stroke={`${C.green}66`}
                strokeWidth="1.5"
              />
              <line
                x1={TRI_VERTICES[1].cx}
                y1={TRI_VERTICES[1].cy}
                x2={TRI_VERTICES[2].cx}
                y2={TRI_VERTICES[2].cy}
                stroke={`${C.green}66`}
                strokeWidth="1.5"
              />
              <line
                x1={TRI_VERTICES[2].cx}
                y1={TRI_VERTICES[2].cy}
                x2={TRI_VERTICES[0].cx}
                y2={TRI_VERTICES[0].cy}
                stroke={`${C.green}66`}
                strokeWidth="1.5"
              />

              {/* Vertex nodes */}
              {TRI_VERTICES.map((v) => (
                <g key={v.label}>
                  <rect
                    x={v.cx - 110}
                    y={v.cy - 36}
                    width={220}
                    height={72}
                    rx={10}
                    fill={`${v.color}1f`}
                    stroke={`${v.color}aa`}
                    strokeWidth="1.5"
                  />
                  <text x={v.cx} y={v.cy - 10} fill={v.accent} fontSize="15" fontWeight="700" textAnchor="middle">
                    {v.label}
                  </text>
                  <text x={v.cx} y={v.cy + 14} fill={v.accent} fontSize="12" textAnchor="middle">
                    {v.desc}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── Layer 1: Retrieval metrics */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Layer 1: Retrieval Metrics
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Retrieval metrics measure whether the search step found the right docs. Four metrics dominate the
            literature.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {TRI_RETRIEVAL_METRICS.map((m) => (
              <div
                key={m.name}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.cyan} bold center size={15}>
                  {m.name}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.cyan}10`,
                    fontFamily: "ui-monospace, SFMono-Regular, monospace",
                    fontSize: 13,
                    color: "#80deea",
                    textAlign: "center",
                  }}
                >
                  {m.formula}
                </div>
                <T color="#80deea" center size={13} style={{ marginTop: 8 }}>
                  {m.interp}
                </T>
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
              Example: top-3 returned for "How do I reset my password?": doc-1 (relevant), doc-23 (not), doc-7
              (relevant) -&gt; Precision@3 = 2 / 3 = 0.667.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Layer 2: Generation metrics */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Layer 2: Generation Metrics
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Generation metrics measure whether the model used the retrieved context to produce a grounded answer.
            Faithfulness is the headline metric here, paired with answer relevancy.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {TRI_GENERATION_METRICS.map((m) => (
              <div
                key={m.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} bold center size={16}>
                  {m.name}
                </T>
                <T color="#b8a9ff" center size={14} style={{ marginTop: 8 }}>
                  {m.question}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 6,
                    background: `${C.purple}10`,
                    fontFamily: "ui-monospace, SFMono-Regular, monospace",
                    fontSize: 13,
                    color: "#b8a9ff",
                    textAlign: "left",
                  }}
                >
                  {m.example}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Layer 3: End-to-end metrics */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Layer 3: End-To-End Metrics
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            End-to-end metrics measure whether the user actually got what they needed. Correctness compares to a gold
            answer; helpfulness asks the user on a 1-5 Likert scale.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {TRI_END_TO_END_METRICS.map((m) => (
              <div
                key={m.name}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={16}>
                  {m.name}
                </T>
                <T color="#ffcc80" center size={14} style={{ marginTop: 8 }}>
                  {m.question}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 6,
                    background: `${C.orange}10`,
                    fontFamily: "ui-monospace, SFMono-Regular, monospace",
                    fontSize: 13,
                    color: "#ffcc80",
                    textAlign: "left",
                  }}
                >
                  {m.example}
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Why three layers - failure traces */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Why Three Layers? Failures Trace To A Layer
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            With three layers, a wrong final answer locates to a specific root cause. Walk the multi-hop query "How do I
            reset my password if I forgot my email?" through three failure scenarios.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {TRI_FAILURE_SCENARIOS.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${s.layerColor}06`,
                  border: `1px solid ${s.layerColor}30`,
                  textAlign: "center",
                }}
              >
                <T color={s.layerColor} bold center size={15}>
                  {s.label}
                </T>
                <T color={s.layerAccent} center size={14} style={{ marginTop: 6 }}>
                  {s.body}
                </T>
                <T color={C.red} bold center size={13} style={{ marginTop: 6 }}>
                  {s.cause}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Deprecated: BLEU & ROUGE */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Deprecated For RAG: BLEU &amp; ROUGE
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold center size={18}>
              <span style={{ textDecoration: "line-through" }}>BLEU, ROUGE, METEOR</span>
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 12 }}>
              These are word-overlap metrics: they count how many n-grams in the generated answer also appear in a
              reference answer. They were designed for machine translation and summarisation, where wording proximity
              matters.
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 8 }}>
              They do not measure faithfulness or groundedness. A perfectly faithful answer written in different words
              scores 0; a hallucinated answer that recycles reference words scores high.
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 8 }}>
              Use RAGAS (chapter 12.33) and LLM-as-judge (chapter 12.32) instead.
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
};

export const LLMAsJudge = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            LLM-as-Judge (stub)
          </T>
        </Box>
      )}
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
};

export const RAGASMetrics = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            RAGAS Metrics (stub)
          </T>
        </Box>
      )}
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
};

export const GoldenDatasets = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Golden Datasets (stub)
          </T>
        </Box>
      )}
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
};

export const OnlineEvalABTesting = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Online Eval & A/B Testing (stub)
          </T>
        </Box>
      )}
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
};
