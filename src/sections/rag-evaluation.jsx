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

// ─── Chapter 12.32 LLMAsJudge: module-level data ───
const LJ_METHOD_CARDS = [
  {
    name: "Human Annotation",
    speed: "Very Slow",
    cost: "Expensive",
    quality: "High",
    note: "1-2 minutes per example, costs scale with team size.",
    color: C.green,
    accent: "#a5d6a7",
  },
  {
    name: "Heuristic (BLEU / ROUGE)",
    speed: "Instant",
    cost: "Free",
    quality: "Low",
    note: "N-gram overlap; misses faithfulness and groundedness entirely.",
    color: C.yellow,
    accent: "#ffe082",
  },
  {
    name: "LLM-As-Judge",
    speed: "Fast",
    cost: "Medium",
    quality: "Near-Human",
    note: "Seconds per example; agreement with human reaches 0.85+ when calibrated.",
    color: C.purple,
    accent: "#b8a9ff",
  },
];

const LJ_JUDGE_PROMPT_LINES = [
  "You are an expert evaluator. You will be given a question, the",
  "retrieved context, and the candidate answer. Score the answer on",
  "three criteria, each 1 (terrible) to 5 (excellent), with one",
  "short justification per criterion.",
  "",
  "Faithfulness: are all claims in the answer supported by the",
  "retrieved context?",
  "",
  "Answer Relevancy: does the answer address the question directly?",
  "",
  "Helpfulness: would this answer actually help the user reach their",
  "goal?",
  "",
  "Question: ",
  "Retrieved Context: ",
  "Candidate Answer: ",
  "",
  "Return JSON:",
  "{",
  '  "faithfulness": <1-5>,',
  '  "answer_relevancy": <1-5>,',
  '  "helpfulness": <1-5>,',
  '  "justification": "<one short paragraph>"',
  "}",
];

const LJ_RUBRIC_ROWS = [
  {
    score: "5",
    label: "All Claims Supported, None Missing",
    detail: "Every factual statement in the answer is verifiable in the retrieved context.",
  },
  {
    score: "4",
    label: "Mostly Supported, Minor Unsupported Detail",
    detail: "Core claims grounded; one peripheral detail not in context.",
  },
  {
    score: "3",
    label: "About Half Supported",
    detail: "A roughly even mix of supported and ungrounded statements.",
  },
  {
    score: "2",
    label: "Mostly Unsupported; Some Grounded",
    detail: "Most claims are made up; one or two are anchored in the context.",
  },
  {
    score: "1",
    label: "Hallucinated; Nothing In Context Supports It",
    detail: "Answer is a confident hallucination with no grounding at all.",
  },
];

const LJ_POSITION_ROWS = [
  {
    order: "Order 1 - (A, B)",
    pick: "Judge Picks Position 1 (A)",
    detail: "Same two answers; same judge model. The first slot wins.",
  },
  {
    order: "Order 2 - (B, A)",
    pick: "Judge Picks Position 1 (B)",
    detail: "Swap the order, the judge's pick swaps too. Identical content.",
  },
];

const LJ_VERBOSITY_ROWS = [
  {
    label: "Answer A - 50 Words, Accurate",
    body: '"Go to Settings, click Forgot Password, check your email, use the link within 24 hours."',
    note: "All claims supported. No padding.",
  },
  {
    label: "Answer B - 200 Words, One Hallucination",
    body: '"To begin the secure password recovery process, navigate to your account dashboard... You may also call our 24/7 support line." (Note: phone support claim is unsupported.)',
    note: "Longer feels thorough. Judges (especially weaker ones) score it higher.",
  },
];

const LJ_SELF_PREF_ROWS = [
  {
    judge: "Judge = GPT-4o",
    candidate: "Candidate = GPT-4o",
    delta: "+12% vs Human",
    same: true,
  },
  {
    judge: "Judge = GPT-4o",
    candidate: "Candidate = Claude 3.5",
    delta: "-3% vs Human",
    same: false,
  },
  {
    judge: "Judge = Claude 3.5",
    candidate: "Candidate = Claude 3.5",
    delta: "+9% vs Human",
    same: true,
  },
];

// Calibration curve data for sub=6 SVG.
const LJ_CALIB_BEFORE = [
  { x: 0.1, y: 0.55 },
  { x: 0.3, y: 0.58 },
  { x: 0.5, y: 0.6 },
  { x: 0.7, y: 0.58 },
  { x: 0.9, y: 0.6 },
];
const LJ_CALIB_AFTER = [
  { x: 0.1, y: 0.78 },
  { x: 0.3, y: 0.85 },
  { x: 0.5, y: 0.88 },
  { x: 0.7, y: 0.9 },
  { x: 0.9, y: 0.92 },
];

export const LLMAsJudge = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  // Calibration SVG layout - symmetric padding.
  const CAL_VB_W = 540;
  const CAL_VB_H = 280;
  const CAL_PLOT_W = 460;
  const CAL_PLOT_H = 180;
  const CAL_PLOT_X = (CAL_VB_W - CAL_PLOT_W) / 2;
  const CAL_PLOT_Y = 32;

  const calX = (x) => CAL_PLOT_X + x * CAL_PLOT_W;
  const calY = (y) => CAL_PLOT_Y + CAL_PLOT_H - y * CAL_PLOT_H;

  const linePath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${calX(p.x).toFixed(1)} ${calY(p.y).toFixed(1)}`).join(" ");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* ─── sub=0 ─── Why LLM-as-judge */}
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Why Use An LLM To Judge An LLM?
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            Human annotation is the gold standard but does not scale. Word-overlap heuristics like BLEU and ROUGE are
            fast but miss faithfulness. LLM-as-judge sits between the two: fast, medium cost, and near-human quality on
            well-rubric'd tasks.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {LJ_METHOD_CARDS.map((m) => (
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
                <div
                  style={{
                    marginTop: 8,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                    fontSize: 12,
                    textAlign: "left",
                  }}
                >
                  <T color={m.accent} size={12}>
                    Speed:
                  </T>
                  <T color={m.accent} size={12}>
                    {m.speed}
                  </T>
                  <T color={m.accent} size={12}>
                    Cost:
                  </T>
                  <T color={m.accent} size={12}>
                    {m.cost}
                  </T>
                  <T color={m.accent} size={12}>
                    Quality:
                  </T>
                  <T color={m.accent} size={12}>
                    {m.quality}
                  </T>
                </div>
                <T color={m.accent} center size={12} style={{ marginTop: 10 }}>
                  {m.note}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* ─── sub=1 ─── The judge prompt artifact */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Judge Prompt
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            The judge prompt is a text artifact, not a code block. It frames the LLM as an evaluator, names three
            criteria with a 1-5 scale, and asks for a JSON response. Variable placeholders are filled in at eval time.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14} style={{ letterSpacing: 1 }}>
              Judge Prompt
            </T>
            <div
              style={{
                marginTop: 10,
                padding: 14,
                borderRadius: 6,
                background: `${C.cyan}10`,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                textAlign: "left",
                color: "#80deea",
              }}
            >
              {LJ_JUDGE_PROMPT_LINES.map((line, i) => {
                if (line.startsWith("Question:")) {
                  return (
                    <div key={i}>
                      Question: <span style={{ color: C.yellow }}>{"{question}"}</span>
                    </div>
                  );
                }
                if (line.startsWith("Retrieved Context:")) {
                  return (
                    <div key={i}>
                      Retrieved Context: <span style={{ color: C.yellow }}>{"{retrieved_context}"}</span>
                    </div>
                  );
                }
                if (line.startsWith("Candidate Answer:")) {
                  return (
                    <div key={i}>
                      Candidate Answer: <span style={{ color: C.yellow }}>{"{generated_answer}"}</span>
                    </div>
                  );
                }
                return <div key={i}>{line === "" ? " " : line}</div>;
              })}
            </div>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=2 ─── Rubric design */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Rubric: 1-5 Per Criterion
          </T>
          <T color="#a5d6a7" center size={16} style={{ marginTop: 10 }}>
            The rubric is the actual calibration tool. Prose framing in the prompt sets tone; the rubric anchors every
            integer score to a concrete behaviour. Below is the rubric for Faithfulness.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {LJ_RUBRIC_ROWS.map((r) => (
              <div
                key={r.score}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: 12,
                  padding: 10,
                  borderRadius: 8,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  textAlign: "left",
                }}
              >
                <T color={C.green} bold size={24} center>
                  {r.score}
                </T>
                <div>
                  <T color={C.green} bold size={14}>
                    {r.label}
                  </T>
                  <T color="#a5d6a7" size={13} style={{ marginTop: 4 }}>
                    {r.detail}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <T color="#a5d6a7" center size={14} style={{ marginTop: 12 }}>
            Rubric design beats prompt prose. The rubric is what makes scores reproducible.
          </T>
        </Box>
      </Reveal>

      {/* ─── sub=3 ─── Bias 1: Position bias */}
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Bias 1: Position Bias
          </T>
          <T color="#ef9a9a" center size={16} style={{ marginTop: 10 }}>
            In pairwise judging, the order of the two candidates affects the verdict even when their content is
            identical. The first slot wins more often.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {LJ_POSITION_ROWS.map((r) => (
              <div
                key={r.order}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold center size={15}>
                  {r.order}
                </T>
                <T color="#ef9a9a" center size={14} style={{ marginTop: 8 }}>
                  {r.pick}
                </T>
                <T color="#ef9a9a" center size={12} style={{ marginTop: 6 }}>
                  {r.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}30`,
              textAlign: "center",
            }}
          >
            <T color={C.red} bold center size={14}>
              Mitigation: Randomize Or Swap
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 4 }}>
              Run both orders for every pair and average; or randomize position per query before passing to the judge.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=4 ─── Bias 2: Verbosity bias */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Bias 2: Verbosity Bias
          </T>
          <T color="#ffcc80" center size={16} style={{ marginTop: 10 }}>
            Judges (especially weaker models) prefer longer answers, mistaking length for thoroughness. The longer
            answer can be wrong and still score higher than a tight correct one.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {LJ_VERBOSITY_ROWS.map((r) => (
              <div
                key={r.label}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.orange} bold center size={15}>
                  {r.label}
                </T>
                <T color="#ffcc80" center size={13} style={{ marginTop: 8 }}>
                  {r.body}
                </T>
                <T color="#ffcc80" center size={12} style={{ marginTop: 8, fontStyle: "italic" }}>
                  {r.note}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}30`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold center size={14}>
              Mitigation: Weight Conciseness Or Length-Normalise
            </T>
            <T color="#ffcc80" center size={13} style={{ marginTop: 4 }}>
              Add an explicit conciseness criterion to the rubric, or normalise by answer length before averaging
              scores.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=5 ─── Bias 3: Self-preference bias */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Bias 3: Self-Preference Bias
          </T>
          <T color="#ffe082" center size={16} style={{ marginTop: 10 }}>
            Judges score outputs from their own model family higher than human-aligned scores would. The bigger the
            model, the bigger this effect typically gets.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {LJ_SELF_PREF_ROWS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  padding: 12,
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${r.same ? C.yellow : "#80deea"}30`,
                  textAlign: "center",
                }}
              >
                <T color="#ffe082" size={13}>
                  {r.judge}
                </T>
                <T color="#ffe082" size={13}>
                  {r.candidate}
                </T>
                <T color={r.same ? C.yellow : C.cyan} bold size={13}>
                  {r.delta}
                </T>
              </div>
            ))}
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
              Mitigation: Third-Party / Cross-Family Judging
            </T>
            <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
              Pick a judge from a different model family than the candidates. Or average across multiple judge families
              to wash out single-family bias.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* ─── sub=6 ─── Calibration via human spot-check */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={22}>
            Calibrate: Spot-Check 50-100 Cases
          </T>
          <T color="#f48fb1" center size={16} style={{ marginTop: 10 }}>
            A judge is a hypothesis. Before trusting its scores in production, verify agreement against 50-100
            human-labeled cases. Refine the rubric and mitigations until correlation lands above 0.85.
          </T>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <svg viewBox={`0 0 ${CAL_VB_W} ${CAL_VB_H}`} width="100%" style={{ maxWidth: 540, height: "auto" }}>
              <desc>
                Judge calibration before-and-after line chart. The x-axis is the judge score percentile and the y-axis
                is agreement with human labels. The before curve sits around 60% agreement; the after curve rises to 92%
                agreement once the rubric is refined and position plus verbosity mitigations are applied.
              </desc>

              {/* Plot bounds */}
              <rect
                x={CAL_PLOT_X}
                y={CAL_PLOT_Y}
                width={CAL_PLOT_W}
                height={CAL_PLOT_H}
                fill={`${C.pink}06`}
                stroke={`${C.pink}30`}
                strokeWidth="1"
              />

              {/* Gridline at 0.85 (target) */}
              <line
                x1={CAL_PLOT_X}
                y1={calY(0.85)}
                x2={CAL_PLOT_X + CAL_PLOT_W}
                y2={calY(0.85)}
                stroke={`${C.green}40`}
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text x={CAL_PLOT_X + CAL_PLOT_W + 6} y={calY(0.85) + 4} fill="#a5d6a7" fontSize="11" textAnchor="start">
                0.85 Target
              </text>

              {/* Before curve */}
              <path d={linePath(LJ_CALIB_BEFORE)} stroke={C.red} strokeWidth="2.5" fill="none" />
              {LJ_CALIB_BEFORE.map((p, i) => (
                <circle key={`b${i}`} cx={calX(p.x)} cy={calY(p.y)} r="3" fill={C.red} />
              ))}
              <text
                x={calX(0.92)}
                y={calY(LJ_CALIB_BEFORE[LJ_CALIB_BEFORE.length - 1].y) + 14}
                fill="#ef9a9a"
                fontSize="12"
                textAnchor="end"
              >
                Before: ~60%
              </text>

              {/* After curve */}
              <path d={linePath(LJ_CALIB_AFTER)} stroke={C.green} strokeWidth="2.5" fill="none" />
              {LJ_CALIB_AFTER.map((p, i) => (
                <circle key={`a${i}`} cx={calX(p.x)} cy={calY(p.y)} r="3" fill={C.green} />
              ))}
              <text
                x={calX(0.92)}
                y={calY(LJ_CALIB_AFTER[LJ_CALIB_AFTER.length - 1].y) - 6}
                fill="#a5d6a7"
                fontSize="12"
                textAnchor="end"
              >
                After: ~92%
              </text>

              {/* Axes labels */}
              <text x={CAL_VB_W / 2} y={CAL_VB_H - 16} fill="#f48fb1" fontSize="12" textAnchor="middle">
                Judge Score Percentile (Low To High)
              </text>
              <text
                x={CAL_PLOT_X - 12}
                y={CAL_PLOT_Y + CAL_PLOT_H / 2}
                fill="#f48fb1"
                fontSize="12"
                textAnchor="middle"
                transform={`rotate(-90, ${CAL_PLOT_X - 12}, ${CAL_PLOT_Y + CAL_PLOT_H / 2})`}
              >
                Agreement With Human
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}06`,
              border: `1px solid ${C.pink}30`,
              textAlign: "center",
            }}
          >
            <T color={C.pink} bold center size={14}>
              Judge Model Selection
            </T>
            <T color="#f48fb1" center size={13} style={{ marginTop: 4 }}>
              Use a stronger judge model than the candidate (e.g., judge with GPT-4 a candidate from a 7B model). Or use
              the same model with documented caveats. Cross-family judging is the strongest setup.
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
};

// ─── Chapter 12.33 RAGASMetrics: module-level data ───
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

// Context Recall worked example chunks.
const RG_RECALL_CHUNKS = [
  { chunk: "doc-1 chunk-1 - Password Reset Intro", retrieved: true },
  { chunk: "doc-1 chunk-2 - Password Reset Email Step", retrieved: true },
];

// Per-query report card scores.
const RG_REPORT_CARD = [
  { name: "Faithfulness", score: 0.8, color: C.purple, accent: "#b8a9ff" },
  { name: "Answer Relevancy", score: 0.91, color: C.orange, accent: "#ffcc80" },
  { name: "Context Precision", score: 0.67, color: C.green, accent: "#a5d6a7" },
  { name: "Context Recall", score: 1.0, color: C.red, accent: "#ef9a9a" },
];

export const RAGASMetrics = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const reportAverage = RG_REPORT_CARD.reduce((s, r) => s + r.score, 0) / RG_REPORT_CARD.length;

  // Helper to render a centered standalone formula box.
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
                    {c.retrieved ? "Retrieved" : "Missed"}
                  </T>
                </div>
              ))}
            </div>

            <T color={C.red} bold center size={16} style={{ marginTop: 12 }}>
              Context Recall = 2 / 2 = 1.0
            </T>
            <T color="#ef9a9a" center size={13} style={{ marginTop: 8 }}>
              Counter-example: if only doc-1 chunk-1 had been retrieved, Context Recall = 1 / 2 = 0.5.
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
            (faithfulness + answer relevancy) covers the model. The triangle in 12.31 splits the same way.
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
              Use RAGAS or LLM-as-judge instead (see chapters 12.31 and 12.32).
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
