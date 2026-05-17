import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Pairwise vs scalar comparison (sub=0 of 13.39)
const PAIRWISE_VS_SCALAR = [
  {
    name: "Pairwise",
    color: "cyan",
    detail: "Judge Sees Answer A And Answer B Side By Side, Picks Which Is Better.",
    bestFor: "Ranking Two Models Or Two Prompt Variants Head-To-Head.",
    weakness: "Cannot Express Absolute Quality. Reports Only Relative Wins.",
  },
  {
    name: "Scalar",
    color: "purple",
    detail: "Judge Scores One Answer From 0 To 10 With A Written Justification.",
    bestFor: "Absolute Quality Tracking, Dashboards, Regression Alerts.",
    weakness: "More Variance Across Runs. Needs A Rubric To Reduce Drift.",
  },
];

// Rubric (sub=1 of 13.39)
const JUDGE_RUBRIC = [
  {
    name: "Correctness",
    range: "0-3",
    detail: "Answer Matches The Policy / KB. 3 = Exact, 0 = Contradicts Policy.",
  },
  {
    name: "Completeness",
    range: "0-2",
    detail: "Answer Addresses Every Part Of The User Question.",
  },
  {
    name: "Tone",
    range: "0-2",
    detail: "Friendly + Professional. Penalize Condescension Or Robot-Speak.",
  },
  {
    name: "Citations",
    range: "0-2",
    detail: "Policy References Included When Applicable.",
  },
  {
    name: "Escalation",
    range: "0-1",
    detail: "Correctly Escalated When Outside Scope (Refund > $200, Account Lock).",
  },
];

// Three biases (sub=2 of 13.39)
const JUDGE_BIASES = [
  {
    name: "Length Bias",
    color: "red",
    detail: "Longer Answers Get Higher Scores Even When Content Is Identical.",
    mitigation: "Length-Normalize Scores Or Truncate To A Standard Budget Before Judging.",
  },
  {
    name: "Position Bias",
    color: "orange",
    detail: "In Pairwise, The FIRST Answer Is Favored 5-10% Of The Time Regardless Of Quality.",
    mitigation: "Randomize Position Per Run And Average Across Both Orderings.",
  },
  {
    name: "Self-Preference",
    color: "amber",
    detail: "A Judge Using Model X Rates Model X's Outputs Higher Than Other Models.",
    mitigation: "Use A Judge From A Different Model Family. Diversify Judge Mix Periodically.",
  },
];

export default function LlmAsJudge(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Calibration scatter (sub=3) points
  const calibPoints = [
    { judge: 0.55, human: 0.5 },
    { judge: 0.62, human: 0.58 },
    { judge: 0.68, human: 0.72 },
    { judge: 0.7, human: 0.64 },
    { judge: 0.75, human: 0.77 },
    { judge: 0.78, human: 0.72 },
    { judge: 0.82, human: 0.84 },
    { judge: 0.85, human: 0.79 },
    { judge: 0.88, human: 0.91 },
    { judge: 0.9, human: 0.88 },
    { judge: 0.92, human: 0.94 },
    { judge: 0.6, human: 0.7 },
    { judge: 0.95, human: 0.93 },
    { judge: 0.8, human: 0.74 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Two Ways To Grade
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            LLM-as-Judge means using one LLM to grade another LLM&apos;s output. Two scoring
            styles dominate production: pairwise and scalar. Pick by what your dashboard needs.
            Most production setups use scalar.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {PAIRWISE_VS_SCALAR.map((p) => {
              const accent = C[p.color];
              const soft = SOFT[p.color];
              return (
                <div key={p.name} style={{ ...tintedCard(accent), padding: 14 }}>
                  <span style={pill(accent)}>SCORING STYLE</span>
                  <T color={accent} bold center size={17} style={{ marginTop: 8 }}>
                    {p.name}
                  </T>
                  <T color={soft} center size={14} style={{ marginTop: 10 }}>
                    {p.detail}
                  </T>
                  <T color={soft} bold center size={13} style={{ marginTop: 10 }}>
                    Best For:
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 4 }}>
                    {p.bestFor}
                  </T>
                  <T color={SOFT.red} bold center size={13} style={{ marginTop: 8 }}>
                    Weakness:
                  </T>
                  <T color={SOFT.red} center size={13} style={{ marginTop: 4 }}>
                    {p.weakness}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Pairwise is great for model selection sprints. Scalar is the production default for
            ongoing trace quality dashboards.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Tell The Judge What To Score On
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Without a rubric, scalar scores drift week over week. With a rubric the judge has
            anchors. Use five criteria for customer support; total budget = 10 points.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <T color={SOFT.orange} bold center size={15}>
              Customer-Support Judge Rubric (Total = 10)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1.4fr 0.7fr 2.4fr",
                gap: 0,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.orange }}>
                Criterion
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.cyan }}>Range</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Description
              </div>
              {JUDGE_RUBRIC.map((r) => (
                <Fragment key={r.name}>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.orange}22`,
                      color: SOFT.orange,
                      fontWeight: 600,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.orange}22`,
                      color: SOFT.cyan,
                      fontWeight: 700,
                    }}
                  >
                    {r.range}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.orange}22`,
                      color: SOFT.purple,
                    }}
                  >
                    {r.detail}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.orange} center size={14} style={{ marginTop: 12 }}>
            Explicit ranges + per-criterion definitions cut judge variance by roughly half
            compared to &quot;score this 0-10&quot; without anchors. The rubric is the most
            valuable artifact in the eval pipeline.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            What The Judge Gets Wrong
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            LLM judges have three known biases. Every production setup should mitigate all three
            before trusting the dashboard.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {JUDGE_BIASES.map((b) => {
              const accent = C[b.color];
              const soft = SOFT[b.color];
              return (
                <div key={b.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>BIAS</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {b.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {b.detail}
                  </T>
                  <T color={SOFT.green} bold center size={12} style={{ marginTop: 10 }}>
                    Mitigation
                  </T>
                  <T color={SOFT.green} center size={12} style={{ marginTop: 4 }}>
                    {b.mitigation}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.yellow} center size={14} style={{ marginTop: 14 }}>
            Three biases, three mitigations. Length normalization, position randomization, judge
            diversification. None are optional in production.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Trust But Verify
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Calibrate the judge against human annotators. Sample 50-100 traces, have a human
            grade each one, plot judge score vs human score, compute correlation. Re-tune the
            judge prompt until correlation &gt; 0.7.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 520 360"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}
            >
              <desc>
                Calibration scatter plot of judge scores on the x-axis against human scores on the
                y-axis with a perfect-agreement diagonal and points clustered close to the
                diagonal, illustrating a judge calibrated to roughly 0.78 correlation against
                human annotators.
              </desc>
              {/* Plot area: x [50,470], y [40, 300]. Scores 0-1 map to that range. */}
              {/* Axes */}
              <line x1={50} y1={300} x2={470} y2={300} stroke={SOFT.amber} strokeWidth={1.5} />
              <line x1={50} y1={300} x2={50} y2={40} stroke={SOFT.amber} strokeWidth={1.5} />
              {/* Diagonal: perfect agreement */}
              <line
                x1={50}
                y1={300}
                x2={470}
                y2={40}
                stroke={C.green}
                strokeWidth={1.6}
                strokeDasharray="5 4"
              />
              {/* Axis labels */}
              <text x={260} y={335} fill={SOFT.amber} fontSize="13" fontWeight="700" textAnchor="middle">
                Judge Score (0-1)
              </text>
              <text
                x={20}
                y={170}
                fill={SOFT.amber}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
                transform="rotate(-90 20 170)"
              >
                Human Score (0-1)
              </text>
              {/* Tick labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <Fragment key={`xt-${t}`}>
                  <text
                    x={50 + t * 420}
                    y={316}
                    fill={SOFT.amber}
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {t.toFixed(2)}
                  </text>
                  <text x={40} y={300 - t * 260 + 4} fill={SOFT.amber} fontSize="11" textAnchor="end">
                    {t.toFixed(2)}
                  </text>
                </Fragment>
              ))}
              {/* Scatter points */}
              {calibPoints.map((p, i) => (
                <circle
                  key={`pt-${i}`}
                  cx={50 + p.judge * 420}
                  cy={300 - p.human * 260}
                  r={5}
                  fill={`${C.amber}cc`}
                  stroke={C.amber}
                  strokeWidth={1.4}
                />
              ))}
              {/* Correlation badge */}
              <rect x={350} y={50} width={110} height={36} rx={6} fill={`${C.green}22`} stroke={C.green} strokeWidth={1.4} />
              <text x={405} y={73} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                r = 0.78 (Pass)
              </text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={14} style={{ marginTop: 12 }}>
            Re-calibrate quarterly. Judges drift as the underlying judge LLM updates. Without
            re-calibration the dashboard slowly stops reflecting human judgment.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Canonical Judge Prompt
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            The rubric from sub=1 baked into a runnable judge prompt. Output is forced into
            machine-readable JSON so a dashboard can parse it and graph the per-criterion scores.
            This is the canonical artifact reused in 13.40 trace evals.
          </T>

          <div
            style={{
              ...tintedCard(C.purple),
              padding: 14,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <span style={pill(C.purple)}>EVAL RUBRIC (SHAPE) - CUSTOMER SUPPORT JUDGE</span>
            <div
              style={{
                marginTop: 12,
                fontFamily: "monospace",
                whiteSpace: "pre",
                fontSize: 13,
                color: SOFT.purple,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}22`,
                borderRadius: 6,
                padding: 14,
                textAlign: "left",
                lineHeight: 1.55,
                overflowX: "auto",
              }}
            >
{`System: You Are An Evaluator For A Customer-Support Agent.
Score The Agent's Response On This Rubric (Total 10):
  - Correctness (0-3): Answer Matches Policy / KB.
  - Completeness (0-2): Answer Addresses Every Part Of The Question.
  - Tone (0-2): Friendly + Professional, No Condescension.
  - Citations (0-2): Policy References Included When Applicable.
  - Escalation (0-1): Correctly Escalated When Outside Scope.

User Question: {{user_message}}
Agent Response: {{agent_response}}

Output ONLY This JSON (No Other Text):
{
  "correctness": N,
  "completeness": N,
  "tone": N,
  "citations": N,
  "escalation": N,
  "total": N,
  "reasoning": "Why You Scored Each Field."
}`}
            </div>
          </div>

          <T color={SOFT.purple} center size={14} style={{ marginTop: 12 }}>
            JSON output is non-negotiable. Free-form prose from the judge cannot land in a
            dashboard. Lock the field names. Every later eval (13.40 trace, 13.41 online) re-uses
            this same shape.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Same Technique, Agent Scope
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Section 12.32 used LLM-as-Judge for RAG generation quality - faithfulness and
            answer-relevance against retrieved chunks. Here we extend the same technique to
            agent-level evals: full task completion, multi-step trace correctness, safety
            refusals.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <span style={pill(C.cyan)}>SECTION 12.32 (RAG)</span>
              <T color={C.cyan} bold center size={15} style={{ marginTop: 8 }}>
                What Section 12 Judged
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 8 }}>
                Faithfulness: Did The Generation Stay Grounded In Retrieved Chunks?
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                Answer-Relevance: Did The Generation Address The User Query?
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                One-Shot Input / Output Pair.
              </T>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>SECTION 13 (AGENT)</span>
              <T color={C.purple} bold center size={15} style={{ marginTop: 8 }}>
                What Section 13 Adds
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 8 }}>
                Task Completion: Did The Agent Achieve The Goal?
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 6 }}>
                Trace Correctness: Did Every Tool Call And Response Step Land?
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 6 }}>
                Multi-Step + Side-Effecting Tools.
              </T>
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Mechanics are identical: rubric + JSON output + calibration. Only the rubric content
            changes. A team running 12.32 already has 80% of the agent eval infrastructure in
            place.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
