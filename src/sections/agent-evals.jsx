import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill } from "./agent-prompting.jsx";

// Section 13 Act 7: Evals
// Chapters 13.37 - 13.41

// Three reasons agent eval is harder than LLM eval (sub=0 of 13.37)
const WHY_AGENTS_HARDER = [
  {
    name: "Non-Determinism",
    color: "red",
    detail:
      "Same Ticket Can Take Different Traces On Different Runs. You Cannot Compare Outputs Directly.",
  },
  {
    name: "Multi-Step",
    color: "orange",
    detail:
      "Eight Tool Calls In A Row Means Eight Places To Fail. The Final Answer Hides Where The Trace Went Wrong.",
  },
  {
    name: "Silent Failure",
    color: "purple",
    detail:
      "The Agent Does Not Crash. It Calls The Wrong Tool, Sends The Wrong Email, Or Misses An Escalation Without Raising An Error.",
  },
];

// Production incident stories (sub=1 of 13.37)
const PRODUCTION_INCIDENTS = [
  {
    title: "Unauthorized Refunds",
    detail:
      "A Refund Agent Issued $50K In Unauthorized Refunds Over A Weekend Before Anyone Noticed.",
  },
  {
    title: "Hallucinated Policy",
    detail:
      "A Support Agent Confidently Quoted A Non-Existent Refund Policy For 3 Weeks Of Production Traffic.",
  },
  {
    title: "Drift To Chitchat",
    detail:
      "A Multi-Agent System Drifted From Billing Questions To Open-Ended Chitchat Over 2 Days.",
  },
  {
    title: "Cross-Tenant Data Leak",
    detail:
      "A Tool Security Regression Let One Customer's Profile Leak Into Another's Active Session.",
  },
];

// Offline vs online comparison rows (sub=2 of 13.37)
const OFFLINE_VS_ONLINE = [
  {
    aspect: "Input",
    offline: "Frozen Golden Eval Set",
    online: "Sampled Live Traffic",
  },
  {
    aspect: "Cadence",
    offline: "Before Every Deploy",
    online: "Continuous, 1-5% Sampling",
  },
  {
    aspect: "Cost",
    offline: "Cheap Per Run (Small Set)",
    online: "Expensive At Scale",
  },
  {
    aspect: "Catches",
    offline: "Regressions On Known Cases",
    online: "Drift, New Failure Modes, Real Distribution",
  },
];

// Failure modes that need humans (sub=3 of 13.37)
const HUMAN_REVIEW_MODES = [
  {
    name: "Tone Failures",
    color: "red",
    detail: "Rude, Robotic, Condescending Responses. Need Human Spot-Check.",
  },
  {
    name: "Hidden Hallucinations",
    color: "orange",
    detail:
      "Invented Policy The Judge Cannot Detect Because The Judge Does Not Know The Policy Either. Needs A RAG-Grounded Judge + Human.",
  },
  {
    name: "Cross-Session Drift",
    color: "purple",
    detail:
      "Long-Term Personality Or Style Drift Across Many Sessions. Needs A Human Reviewer Looking At The Whole Population.",
  },
];

// Pipeline stages (sub=4 of 13.37). Each maps to a later chapter.
const PIPELINE_STAGES = [
  { num: 1, name: "Eval Set", detail: "Golden + Adversarial + Regression Cases", ref: "13.41" },
  { num: 2, name: "Per-Trace Step Grading", detail: "Score Each Tool Call", ref: "13.40" },
  { num: 3, name: "End-To-End Judge", detail: "Score Final Answer With LLM-As-Judge", ref: "13.39" },
  { num: 4, name: "Online Sampling", detail: "Grade 1-5% Of Production Traffic + Drift Signal", ref: "13.41" },
  { num: 5, name: "Alerting + Rollback", detail: "Page Engineer When Quality Drops", ref: "Ops" },
];

export const WhyEvalAgents = (ctx) => {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Three Reasons Agents Are Harder To Eval
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            A pure LLM eval grades input vs output - one shot, one score. Agents are different on
            three structural axes that make naive eval miss most production failures.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {WHY_AGENTS_HARDER.map((r) => {
              const accent = C[r.color];
              const soft = SOFT[r.color];
              return (
                <div key={r.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>WHY HARDER</span>
                  <T color={accent} bold center size={16} style={{ marginTop: 8 }}>
                    {r.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {r.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Every Section 13 production failure mode (13.35) maps to at least one of these axes.
            Eval design has to address all three or production incidents slip through.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            What Breaks When You Don&apos;t Eval
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Real production incidents from teams that shipped agents without an eval pipeline.
            Every one of these went unnoticed for days or weeks.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {PRODUCTION_INCIDENTS.map((p) => (
              <div key={p.title} style={{ ...tintedCard(C.red), padding: 12 }}>
                <span style={pill(C.red)}>INCIDENT</span>
                <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                  {p.title}
                </T>
                <T color={SOFT.red} center size={13} style={{ marginTop: 6 }}>
                  {p.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Each incident shows the same shape: silent failure + production traffic + late
            detection. Eval is the only tool that converts &quot;late detection&quot; into
            &quot;same-day&quot;.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Offline (Before Ship) vs Online (After Ship)
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Two complementary loops. Offline grades a frozen golden set before every deploy. Online
            samples real production traffic continuously. Production agents need BOTH; either
            alone leaves a gap.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr 1.4fr",
                gap: 0,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.yellow }}>Aspect</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.cyan }}>
                Offline Eval
              </div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>
                Online Eval
              </div>
              {OFFLINE_VS_ONLINE.map((row) => (
                <Fragment key={row.aspect}>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: SOFT.yellow,
                      fontWeight: 600,
                    }}
                  >
                    {row.aspect}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: SOFT.cyan,
                    }}
                  >
                    {row.offline}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.yellow}22`,
                      color: SOFT.purple,
                    }}
                  >
                    {row.online}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            Offline tells you if known cases regressed. Online tells you if the actual production
            distribution shifted. Skip one and you ship blind on that dimension.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Some Failure Modes Need Humans
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Automated judges are cheap but blind on three categories. Plan budget for a small but
            permanent human review loop on every production agent.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {HUMAN_REVIEW_MODES.map((m) => {
              const accent = C[m.color];
              const soft = SOFT[m.color];
              return (
                <div key={m.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>HUMAN ONLY</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {m.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {m.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Rule of thumb: 20-50 human-reviewed traces per week per agent. Cheap relative to a
            single production incident, and the only signal the judge cannot produce.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What A Full Pipeline Looks Like
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Five stages, each handled by a later chapter in this act. Stage 1 builds the eval set.
            Stages 2-3 grade traces and answers. Stage 4 watches production. Stage 5 acts on the
            signal.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 720 240"
              style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}
            >
              <desc>
                Five-stage production eval pipeline with eval set feeding per-trace step grading
                and end-to-end LLM-as-Judge in parallel, then online sampling and a drift signal
                that triggers alerting and rollback. Each stage labeled with the Section 13
                chapter that covers it.
              </desc>
              {PIPELINE_STAGES.map((s, i) => {
                const w = 128;
                const gap = 10;
                const totalSpan = PIPELINE_STAGES.length * w + (PIPELINE_STAGES.length - 1) * gap;
                const xStart = (720 - totalSpan) / 2;
                const x = xStart + i * (w + gap);
                const y = 60;
                return (
                  <g key={`stage-${s.num}`}>
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={110}
                      rx={8}
                      fill={`${C.purple}22`}
                      stroke={C.purple}
                      strokeWidth={1.8}
                    />
                    <text
                      x={x + w / 2}
                      y={y + 22}
                      fill={SOFT.purple}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Stage {s.num}
                    </text>
                    <text
                      x={x + w / 2}
                      y={y + 44}
                      fill={SOFT.purple}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {s.name}
                    </text>
                    <foreignObject x={x + 4} y={y + 52} width={w - 8} height={42}>
                      <div
                        style={{
                          color: SOFT.purple,
                          fontSize: 11,
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {s.detail}
                      </div>
                    </foreignObject>
                    <rect
                      x={x + 18}
                      y={y + 92}
                      width={w - 36}
                      height={16}
                      rx={3}
                      fill={`${C.cyan}22`}
                      stroke={C.cyan}
                      strokeWidth={1}
                    />
                    <text
                      x={x + w / 2}
                      y={y + 104}
                      fill={SOFT.cyan}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      Chapter {s.ref}
                    </text>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <path
                        d={`M ${x + w} ${y + 55} L ${x + w + gap} ${y + 55}`}
                        stroke={SOFT.purple}
                        strokeWidth={1.6}
                        markerEnd="url(#evalArrow)"
                        fill="none"
                      />
                    )}
                  </g>
                );
              })}
              <defs>
                <marker
                  id="evalArrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={SOFT.purple} />
                </marker>
              </defs>
              <text
                x={360}
                y={210}
                fill={SOFT.cyan}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Stage 2 = 13.40 - Stage 3 = 13.39 - Stage 1 + Stage 4 = 13.41
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The pipeline costs more than a single judge call, but it is the only structure that
            catches the three failure modes from sub=0 before they reach a customer.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

// Sub=0: four axes summary cards for the radar chart legend
const EVAL_AXES = [
  { name: "Correctness", color: "red", target: "> 90% Resolution", weight: "0.5" },
  { name: "Latency", color: "yellow", target: "P95 < 8s", weight: "0.2" },
  { name: "Cost", color: "amber", target: "< $0.50 / Ticket", weight: "0.2" },
  { name: "Safety", color: "purple", target: "> 99% Refusal", weight: "0.1" },
];

// Sub=4: safety metrics
const SAFETY_METRICS = [
  {
    name: "Refusal Rate (Prohibited Actions)",
    target: "> 99%",
    detail: "Agent Refuses To Issue Refunds Above Policy Limit Without Manager Approval.",
  },
  {
    name: "False Refusal Rate",
    target: "< 1%",
    detail: "Agent Should Not Reject Legitimate Requests By Mistake.",
  },
  {
    name: "Escalation Rate (Refund > $200)",
    target: "100%",
    detail: "Every Large Refund Must Route To A Human Reviewer.",
  },
  {
    name: "Prompt-Injection Detection",
    target: "> 95%",
    detail: "Agent Catches User Inputs Trying To Override The System Prompt.",
  },
];

export const EvalDimensions = (ctx) => {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Radar chart geometry (sub=0)
  const cx = 280;
  const cy = 180;
  const rOuter = 130;
  // Four axes at 90 degree intervals: top, right, bottom, left
  const axesGeom = [
    { label: "Correctness", angle: -Math.PI / 2, score: 0.92 },
    { label: "Latency", angle: 0, score: 0.78 },
    { label: "Cost", angle: Math.PI / 2, score: 0.84 },
    { label: "Safety", angle: Math.PI, score: 0.97 },
  ];
  const axisPoint = (angle, r) => ({
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  });
  const targetRingR = rOuter * 0.85;
  const samplePoints = axesGeom
    .map((a) => {
      const p = axisPoint(a.angle, rOuter * a.score);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Correctness, Latency, Cost, Safety
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Production agents are graded on four axes simultaneously. A trace that scores 1.0 on
            correctness but blew the latency budget or leaked a refund is still a failure. Treat
            all four as first-class.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 360"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Four-axis radar chart with correctness on top, latency on the right, cost on the
                bottom, and safety on the left. A green target zone shows the acceptable region
                and a red polygon shows a single agent run scoring 0.92, 0.78, 0.84, and 0.97.
              </desc>
              {/* Concentric rings */}
              {[0.33, 0.66, 1].map((r, i) => (
                <circle
                  key={`ring-${i}`}
                  cx={cx}
                  cy={cy}
                  r={rOuter * r}
                  fill="none"
                  stroke={`${C.red}22`}
                  strokeWidth={1}
                />
              ))}
              {/* Target zone */}
              <circle
                cx={cx}
                cy={cy}
                r={targetRingR}
                fill={`${C.green}10`}
                stroke={C.green}
                strokeWidth={1.4}
                strokeDasharray="3 3"
              />
              {/* Axes */}
              {axesGeom.map((a) => {
                const p = axisPoint(a.angle, rOuter);
                return (
                  <line
                    key={`ax-${a.label}`}
                    x1={cx}
                    y1={cy}
                    x2={p.x}
                    y2={p.y}
                    stroke={`${C.red}44`}
                    strokeWidth={1}
                  />
                );
              })}
              {/* Sample run polygon */}
              <polygon
                points={samplePoints}
                fill={`${C.red}20`}
                stroke={C.red}
                strokeWidth={2}
              />
              {/* Axis labels */}
              {axesGeom.map((a) => {
                const labelOffset = 18;
                const lp = axisPoint(a.angle, rOuter + labelOffset);
                return (
                  <text
                    key={`lab-${a.label}`}
                    x={lp.x}
                    y={lp.y + 4}
                    fill={SOFT.red}
                    fontSize="14"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {a.label}
                  </text>
                );
              })}
              {/* Sample run score labels */}
              {axesGeom.map((a) => {
                const sp = axisPoint(a.angle, rOuter * a.score);
                return (
                  <g key={`score-${a.label}`}>
                    <circle cx={sp.x} cy={sp.y} r={4} fill={C.red} />
                    <text
                      x={sp.x + (a.angle === 0 ? 10 : a.angle === Math.PI ? -10 : 0)}
                      y={sp.y - 8}
                      fill={SOFT.red}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor={a.angle === 0 ? "start" : a.angle === Math.PI ? "end" : "middle"}
                    >
                      {a.score.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              <text
                x={280}
                y={335}
                fill={SOFT.green}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Green Ring = Target Zone (Score &gt; 0.85)
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {EVAL_AXES.map((a) => {
              const accent = C[a.color];
              const soft = SOFT[a.color];
              return (
                <div key={a.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>AXIS</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {a.name}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    Target: {a.target}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Weight: {a.weight}
                  </T>
                </div>
              );
            })}
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Did The Task Complete?
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Correctness is binary at the task level. Either the user&apos;s stated goal was
            achieved with no incorrect side effects, or the trace counts as a failure even if it
            looked plausible.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <T color={SOFT.orange} bold center size={15}>
              Definition
            </T>
            <T color={SOFT.orange} center size={14} style={{ marginTop: 6 }}>
              Task Completed = User Goal Achieved AND No Incorrect Side Effects.
            </T>
            <T color={SOFT.orange} bold center size={15} style={{ marginTop: 10 }}>
              Metric
            </T>
            <T color={SOFT.orange} center size={14} style={{ marginTop: 6 }}>
              Resolution Rate = Correct Traces / Total Traces. Target &gt; 90%.
            </T>
          </div>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 12 }}>
            <span style={pill(C.green)}>EXAMPLE</span>
            <T color={SOFT.green} bold center size={15} style={{ marginTop: 8 }}>
              Ticket T2: Reset Password + Update Email
            </T>
            <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
              Agent Called reset_password And update_email. Both Effects Persisted. User
              Confirmation Email Sent. Result: CORRECT.
            </T>
          </div>

          <T color={SOFT.orange} center size={14} style={{ marginTop: 12 }}>
            T4 (refund + cancel) is a counter-example: correctness fails if the agent issued the
            refund but skipped the cancel, even if the user got a polite response.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            How Long Did It Take?
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Latency is the wall-clock time from user message to final answer. Average alone hides
            the bad tail. Track percentiles: P50, P95, P99. The tail is where users churn.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Latency histogram showing trace duration distribution with P50 at 3.2 seconds, P95
                at 7.5 seconds (just inside the 8 second target line), and P99 at 14 seconds in
                the long tail.
              </desc>
              {/* Bars approximating a long-tailed distribution */}
              {[
                { x: 60, h: 60, label: "1s" },
                { x: 110, h: 110, label: "2s" },
                { x: 160, h: 140, label: "3s" },
                { x: 210, h: 120, label: "4s" },
                { x: 260, h: 90, label: "5s" },
                { x: 310, h: 65, label: "6s" },
                { x: 360, h: 45, label: "7s" },
                { x: 410, h: 28, label: "8s" },
                { x: 460, h: 18, label: "10s" },
                { x: 510, h: 8, label: "14s" },
              ].map((b) => (
                <g key={`bar-${b.label}`}>
                  <rect
                    x={b.x - 18}
                    y={180 - b.h}
                    width={36}
                    height={b.h}
                    fill={`${C.yellow}66`}
                    stroke={C.yellow}
                    strokeWidth={1}
                  />
                  <text
                    x={b.x}
                    y={195}
                    fill={SOFT.yellow}
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {b.label}
                  </text>
                </g>
              ))}
              {/* P50 marker at 3s */}
              <line x1={160} y1={30} x2={160} y2={180} stroke={C.green} strokeWidth={2} strokeDasharray="4 3" />
              <text x={160} y={22} fill={SOFT.green} fontSize="12" fontWeight="700" textAnchor="middle">P50 = 3.2s</text>
              {/* P95 marker at ~7.5s */}
              <line x1={385} y1={30} x2={385} y2={180} stroke={C.orange} strokeWidth={2} strokeDasharray="4 3" />
              <text x={385} y={22} fill={SOFT.orange} fontSize="12" fontWeight="700" textAnchor="middle">P95 = 7.5s</text>
              {/* P99 marker at ~14s */}
              <line x1={510} y1={30} x2={510} y2={180} stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
              <text x={510} y={22} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">P99 = 14s</text>
              {/* Target line at 8s */}
              <line x1={410} y1={180} x2={410} y2={210} stroke={C.cyan} strokeWidth={2} />
              <text x={410} y={225} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">Target: P95 &lt; 8s</text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={14} style={{ marginTop: 12 }}>
            Latency budget for a support ticket: 1.5s LLM call x 3 iterations + 200ms tool call x
            6 = 5.7s. The remainder (under 8s P95) absorbs network jitter and retries.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            How Much Did Each Trace Consume?
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Cost is the dollar amount per trace. Input tokens are cheap, output tokens cost 5x
            more, and tool calls add their own infrastructure cost. Runaway iterations are the
            number-one source of cost overshoots.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Cost breakdown bar for a typical support trace showing input tokens at six cents,
                output tokens at twenty cents, and tool calls at twelve cents adding up to roughly
                thirty-eight cents per ticket against a fifty cent target.
              </desc>
              {/* Stacked horizontal bar */}
              {/* Total bar background */}
              <rect x={60} y={70} width={440} height={50} rx={6} fill={`${C.amber}10`} stroke={C.amber} strokeWidth={1} />
              {/* Input tokens segment */}
              <rect x={60} y={70} width={100} height={50} fill={`${C.cyan}66`} stroke={C.cyan} strokeWidth={1} />
              <text x={110} y={100} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">Input Tokens</text>
              <text x={110} y={115} fill={SOFT.cyan} fontSize="11" textAnchor="middle">$0.06</text>
              {/* Output tokens segment */}
              <rect x={160} y={70} width={200} height={50} fill={`${C.purple}66`} stroke={C.purple} strokeWidth={1} />
              <text x={260} y={100} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">Output Tokens</text>
              <text x={260} y={115} fill={SOFT.purple} fontSize="11" textAnchor="middle">$0.20</text>
              {/* Tool calls segment */}
              <rect x={360} y={70} width={120} height={50} fill={`${C.green}66`} stroke={C.green} strokeWidth={1} />
              <text x={420} y={100} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">Tool Calls</text>
              <text x={420} y={115} fill={SOFT.green} fontSize="11" textAnchor="middle">$0.12</text>
              {/* Target marker */}
              <line x1={500} y1={60} x2={500} y2={140} stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
              <text x={500} y={50} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">Target: $0.50</text>
              <text x={280} y={160} fill={SOFT.amber} fontSize="14" fontWeight="700" textAnchor="middle">Total = $0.38 / Ticket</text>
              <text x={280} y={180} fill={SOFT.red} fontSize="12" textAnchor="middle">Runaway Iteration Risk: Each Extra Loop Adds $0.20 In Output Tokens</text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={14} style={{ marginTop: 12 }}>
            Cap max iterations (10-20 per loop termination policy from 13.23) and you cap the
            worst-case cost. Without the cap, a 100-step runaway can hit $5 on a single trace.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Did The Agent Refuse What It Should?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Safety has four sub-metrics. Each has a target and a customer-support example.
            Production agents that fail safety even at 99% will still produce dozens of incidents
            per million traces.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.7fr 2fr",
                gap: 0,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Metric</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.cyan }}>Target</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.red }}>Example</div>
              {SAFETY_METRICS.map((m) => (
                <Fragment key={m.name}>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: SOFT.purple,
                      fontWeight: 600,
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: SOFT.cyan,
                    }}
                  >
                    {m.target}
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: SOFT.red,
                    }}
                  >
                    {m.detail}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.purple} center size={14} style={{ marginTop: 12 }}>
            Safety scores need the lowest tolerance: 99% refusal rate still permits 1 in 100
            prohibited actions to land. For sensitive verticals push to 99.9%+.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            One Number For The Dashboard
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Stakeholders want a single trace score. Weight the four axes; correctness dominates
            for support agents but the weights are tunable per use case. Trigger an alert when the
            composite drops below the target line.
          </T>

          <div
            style={{
              ...tintedCard(C.red),
              padding: 18,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={SOFT.red} bold center size={15}>
              Composite Trace Score Formula
            </T>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                color: SOFT.red,
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              trace_score = 0.5 * correctness
              <br />
              {"          "}+ 0.2 * latency_score
              <br />
              {"          "}+ 0.2 * cost_score
              <br />
              {"          "}+ 0.1 * safety_score
            </div>
            <T color={SOFT.red} center size={13} style={{ marginTop: 12 }}>
              Each component normalized 0-1. Weights tunable per use case. Target composite &gt;
              0.85.
            </T>
          </div>

          <div
            style={{
              ...tintedCard(C.green),
              padding: 14,
              marginTop: 12,
            }}
          >
            <span style={pill(C.green)}>EXAMPLE</span>
            <T color={SOFT.green} bold center size={14} style={{ marginTop: 8 }}>
              Sample Run From Sub=0
            </T>
            <T color={SOFT.green} center size={13} style={{ marginTop: 6 }}>
              0.5 * 0.92 + 0.2 * 0.78 + 0.2 * 0.84 + 0.1 * 0.97 = 0.885 &gt; 0.85 (Passes)
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

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

export const LlmAsJudge = (ctx) => {
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
};

export const TraceEvals = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Trace Evals
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const EvalSetsContinuous = (ctx) => {
  return (
    <div>
      <Box color={C.red}>
        <T color={C.red} bold center size={22}>
          Eval Sets + Continuous Eval
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};
