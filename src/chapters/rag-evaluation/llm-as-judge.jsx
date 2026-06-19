import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

// Module-private helpers used by THIS chapter (copied verbatim from section file):
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

export default function LLMAsJudge(ctx) {
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
                return <div key={i}>{line === "" ? " " : line}</div>;
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
              <text x={CAL_PLOT_X + CAL_PLOT_W - 6} y={calY(0.85) + 16} fill="#a5d6a7" fontSize="11" textAnchor="end">
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
                x={CAL_PLOT_X + CAL_PLOT_W}
                y={CAL_PLOT_Y - 12}
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
}
