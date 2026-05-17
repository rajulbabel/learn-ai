import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// T2 successful trace (sub=0 of 13.40)
const T2_TRACE_STEPS = [
  { step: 1, tool: "classify_intent", result: "Intent: Password Reset + Email Change", status: "pass" },
  { step: 2, tool: "lookup_customer", result: "Customer c-9924 (Alice) Found, Pro Tier", status: "pass" },
  { step: 3, tool: "change_email", result: "Email Updated To alice-new@example.com", status: "pass" },
  { step: 4, tool: "reset_password", result: "Reset Token Emailed To Alice", status: "pass" },
  { step: 5, tool: "respond", result: "Polite Confirmation, Mentions Both Effects", status: "pass" },
];

// T4 failure trace (sub=1 of 13.40)
const T4_TRACE_STEPS = [
  { step: 1, tool: "classify_intent", result: "Intent: Refund + Cancel Subscription", status: "pass", note: "Correct Read." },
  { step: 2, tool: "lookup_customer", result: "Customer c-9924, Pro Tier Active", status: "pass", note: "Right Tool, Right Args." },
  { step: 3, tool: "lookup_subscription", result: "Active, $240 Annual, 9 Months Used", status: "pass", note: "All Good So Far." },
  {
    step: 4,
    tool: "process_refund",
    result: "Refund Of $60 Issued. Business Rule Fired Correctly.",
    status: "fail",
    note: "Judge: Refund Was $60. Policy Requires Escalation > $200. Pass On Threshold But Agent Forgot To Cancel.",
  },
  {
    step: 5,
    tool: "respond",
    result: "Told Alice Both Refund AND Cancellation Were Processed.",
    status: "wrong",
    note: "Judge: Cancel Tool Was Never Called. Response Lied About Side Effects.",
  },
];

// Per-step rubric (sub=2)
const PER_STEP_RUBRIC = [
  {
    name: "Tool Choice",
    detail: "Did The Agent Pick The Right Tool For The Sub-Goal?",
    t4Step4: "PASS",
  },
  {
    name: "Tool Input",
    detail: "Were The Arguments Well-Formed And Correct?",
    t4Step4: "PASS",
  },
  {
    name: "Result Handling",
    detail: "Did The Agent Interpret The Tool Result Correctly?",
    t4Step4: "FAIL",
  },
  {
    name: "Next-Step Planning",
    detail: "Did This Step's Outcome Feed The Next Planned Action?",
    t4Step4: "FAIL",
  },
];

export default function TraceEvals(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  const stepRowColor = (status) => {
    if (status === "fail") return C.orange;
    if (status === "wrong") return C.red;
    return C.green;
  };
  const stepRowSoft = (status) => {
    if (status === "fail") return SOFT.orange;
    if (status === "wrong") return SOFT.red;
    return SOFT.green;
  };
  const stepBadge = (status) => {
    if (status === "fail") return "FAILED";
    if (status === "wrong") return "WRONG";
    return "PASS";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Every Step Gets A Grade
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            End-to-end LLM-as-Judge tells you if the final answer was correct. Trace eval grades
            EACH step independently. When a trace fails, you can locate where. T2 (reset password
            + email change) is a 5-step trace that passes at every step.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={SOFT.red} bold center size={15}>
              Trace: Ticket T2 - Reset Password + Update Email
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {T2_TRACE_STEPS.map((s) => (
                <div
                  key={`t2-${s.step}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1.6fr 3fr 70px",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 12px",
                    background: `${C.green}08`,
                    border: `1px solid ${C.green}30`,
                    borderRadius: 6,
                  }}
                >
                  <T color={SOFT.green} bold center size={14}>
                    {`Step ${s.step}`}
                  </T>
                  <T color={C.green} bold size={13} style={{ textAlign: "left" }}>
                    {s.tool}
                  </T>
                  <T color={SOFT.green} size={13} style={{ textAlign: "left" }}>
                    {s.result}
                  </T>
                  <T color={SOFT.green} bold center size={12}>
                    PASS
                  </T>
                </div>
              ))}
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            All 5 steps pass. The trace also passes end-to-end. But trace eval still adds value:
            it confirms WHY the trace passed (every step was correct), not just that the final
            output happened to look right.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When A Step Fails, Where?
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            T4 (refund + cancel subscription) is the diagnostic trace. The final answer says
            &quot;both processed&quot; but trace eval surfaces TWO failures: step 4 missed the
            cancel side-effect, and step 5 lied about it.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <T color={SOFT.orange} bold center size={15}>
              Trace: Ticket T4 - Refund + Cancel Subscription
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {T4_TRACE_STEPS.map((s) => {
                const accent = stepRowColor(s.status);
                const soft = stepRowSoft(s.status);
                return (
                  <div
                    key={`t4-${s.step}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1.6fr 2.4fr 80px",
                      gap: 10,
                      alignItems: "center",
                      padding: "10px 12px",
                      background: `${accent}10`,
                      border: `1px solid ${accent}50`,
                      borderRadius: 6,
                    }}
                  >
                    <T color={soft} bold center size={14}>
                      {`Step ${s.step}`}
                    </T>
                    <T color={accent} bold size={13} style={{ textAlign: "left" }}>
                      {s.tool}
                    </T>
                    <T color={soft} size={12} style={{ textAlign: "left", lineHeight: 1.45 }}>
                      {s.result}
                      <br />
                      <span style={{ fontStyle: "italic" }}>{s.note}</span>
                    </T>
                    <T color={soft} bold center size={12}>
                      {stepBadge(s.status)}
                    </T>
                  </div>
                );
              })}
            </div>
          </div>

          <T color={SOFT.orange} center size={14} style={{ marginTop: 12 }}>
            Insight: Step 4 made the right tool call (process_refund) but the agent did not adapt
            when it noticed cancel was missing. Step 5 then propagated a false assertion. Trace
            eval surfaces both, end-to-end eval would only flag the final wrong answer.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            What To Score Per Step
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Each step gets graded on four sub-rubric criteria. The T4 step 4 example below shows
            exactly how trace eval pinpoints where the failure starts: tool choice + tool input
            both pass, but result handling and next-step planning fail.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 2.2fr 1fr",
                gap: 0,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.yellow }}>
                Criterion
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Description
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.cyan }}>
                T4 Step 4
              </div>
              {PER_STEP_RUBRIC.map((r) => (
                <Fragment key={r.name}>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: SOFT.yellow,
                      fontWeight: 600,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: SOFT.purple,
                    }}
                  >
                    {r.detail}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: r.t4Step4 === "PASS" ? SOFT.green : SOFT.red,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {r.t4Step4}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.yellow} center size={14} style={{ marginTop: 12 }}>
            The four sub-criteria mirror an engineer&apos;s mental debug pass: did I pick the
            right thing, did I call it right, did I read the answer right, did I plan the next
            step right. Production teams build dashboards keyed on these four columns.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Trace Eval Record (Shape)
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Trace eval output is a structured JSON record: one entry per step, four scores per
            entry, plus per-step failure-mode tags and an overall_grade summary. This shape
            powers per-tool dashboards and failure-mode alerts.
          </T>

          <div
            style={{
              ...tintedCard(C.amber),
              padding: 14,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <span style={pill(C.amber)}>TRACE EVAL RECORD - SHAPE</span>
            <div
              style={{
                marginTop: 12,
                fontFamily: "monospace",
                whiteSpace: "pre",
                fontSize: 13,
                color: SOFT.amber,
                background: `${C.amber}08`,
                border: `1px solid ${C.amber}22`,
                borderRadius: 6,
                padding: 14,
                textAlign: "left",
                lineHeight: 1.55,
                overflowX: "auto",
              }}
            >
{`{
  "trace_id": "tr-8492",
  "ticket": "T4",
  "agent_version": "support-agent@v3.1",
  "steps": [
    { "step": 1, "tool": "classify_intent",
      "scores": { "choice": 1, "input": 1, "result": 1, "next": 1 } },
    { "step": 2, "tool": "lookup_customer",
      "scores": { "choice": 1, "input": 1, "result": 1, "next": 1 } },
    { "step": 3, "tool": "lookup_subscription",
      "scores": { "choice": 1, "input": 1, "result": 1, "next": 1 } },
    { "step": 4, "tool": "process_refund",
      "scores": { "choice": 1, "input": 1, "result": 0, "next": 0 },
      "failure_mode": "missed_escalation" },
    { "step": 5, "tool": "respond",
      "scores": { "choice": 0, "input": 0, "result": 0, "next": 0 },
      "failure_mode": "false_assertion" }
  ],
  "overall_grade": "failed_at_step_4_propagated_to_step_5",
  "judged_at": "2026-05-16T08:14:00Z"
}`}
            </div>
          </div>

          <T color={SOFT.amber} center size={14} style={{ marginTop: 12 }}>
            failure_mode tags (missed_escalation, false_assertion, hallucinated_tool,
            wrong_argument_type) are the most useful cross-trace signal. They roll up into a
            failure-mode dashboard that tells the eng team which class of bug is most common.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Per-Step Grading Is N x Expensive
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            End-to-end LLM-as-Judge: 1 judge call per trace. Trace eval: N judge calls per trace
            (one per step). For an 8-step trace that is 8x the eval cost. Reserve trace eval for
            a sample of production traffic; run end-to-end on the rest.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Cost comparison bar chart with end-to-end LLM-as-Judge at one times the unit cost
                and trace eval growing linearly with steps, reaching eight times for an eight-step
                trace, plus the production rule to run trace eval on five percent of traffic and
                end-to-end on the rest.
              </desc>
              {/* End-to-end bar */}
              <text x={280} y={30} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Eval Cost Per Trace (Unit = One Judge Call)
              </text>
              <rect x={120} y={60} width={60} height={50} fill={`${C.cyan}66`} stroke={C.cyan} strokeWidth={1.4} />
              <text x={150} y={92} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">1x</text>
              <text x={150} y={130} fill={SOFT.cyan} fontSize="12" textAnchor="middle">End-To-End</text>
              {/* Trace eval bar */}
              <rect x={210} y={60} width={300} height={50} fill={`${C.purple}66`} stroke={C.purple} strokeWidth={1.4} />
              <text x={360} y={92} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                N x (8x For 8-Step Trace)
              </text>
              <text x={360} y={130} fill={SOFT.purple} fontSize="12" textAnchor="middle">Trace Eval (Per Step)</text>
              {/* Production rule */}
              <rect x={60} y={150} width={440} height={50} rx={8} fill={`${C.green}11`} stroke={C.green} strokeWidth={1.4} />
              <text x={280} y={172} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Production Rule
              </text>
              <text x={280} y={190} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Trace Eval On 5% Sample. End-To-End LLM-As-Judge On The Rest.
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={14} style={{ marginTop: 12 }}>
            5% sample is the sweet spot for most production traffic. Higher rates (e.g., 25%) for
            high-stakes traces (refunds, account changes) where locating the failing step matters
            more than overall throughput cost.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
