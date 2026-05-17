import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Three reasons agent eval is harder than LLM eval (sub=0 of 13.37)
const WHY_AGENTS_HARDER = [
  {
    name: "Non-Determinism",
    color: "red",
    detail: "Same Ticket Can Take Different Traces On Different Runs. You Cannot Compare Outputs Directly.",
  },
  {
    name: "Multi-Step",
    color: "orange",
    detail: "Eight Tool Calls In A Row Means Eight Places To Fail. The Final Answer Hides Where The Trace Went Wrong.",
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
    detail: "A Refund Agent Issued $50K In Unauthorized Refunds Over A Weekend Before Anyone Noticed.",
  },
  {
    title: "Hallucinated Policy",
    detail: "A Support Agent Confidently Quoted A Non-Existent Refund Policy For 3 Weeks Of Production Traffic.",
  },
  {
    title: "Drift To Chitchat",
    detail: "A Multi-Agent System Drifted From Billing Questions To Open-Ended Chitchat Over 2 Days.",
  },
  {
    title: "Cross-Tenant Data Leak",
    detail: "A Tool Security Regression Let One Customer's Profile Leak Into Another's Active Session.",
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

export default function WhyEvalAgents(ctx) {
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
            A pure LLM eval grades input vs output - one shot, one score. Agents are different on three structural axes
            that make naive eval miss most production failures.
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
            Every Section 13 production failure mode (13.35) maps to at least one of these axes. Eval design has to
            address all three or production incidents slip through.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            What Breaks When You Don&apos;t Eval
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Real production incidents from teams that shipped agents without an eval pipeline. Every one of these went
            unnoticed for days or weeks.
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
            Each incident shows the same shape: silent failure + production traffic + late detection. Eval is the only
            tool that converts &quot;late detection&quot; into &quot;same-day&quot;.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Offline (Before Ship) vs Online (After Ship)
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Two complementary loops. Offline grades a frozen golden set before every deploy. Online samples real
            production traffic continuously. Production agents need BOTH; either alone leaves a gap.
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
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.cyan }}>Offline Eval</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Online Eval</div>
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
            Offline tells you if known cases regressed. Online tells you if the actual production distribution shifted.
            Skip one and you ship blind on that dimension.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Some Failure Modes Need Humans
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Automated judges are cheap but blind on three categories. Plan budget for a small but permanent human review
            loop on every production agent.
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
            Rule of thumb: 20-50 human-reviewed traces per week per agent. Cheap relative to a single production
            incident, and the only signal the judge cannot produce.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What A Full Pipeline Looks Like
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Five stages, each handled by a later chapter in this act. Stage 1 builds the eval set. Stages 2-3 grade
            traces and answers. Stage 4 watches production. Stage 5 acts on the signal.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 240" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Five-stage production eval pipeline with eval set feeding per-trace step grading and end-to-end
                LLM-as-Judge in parallel, then online sampling and a drift signal that triggers alerting and rollback.
                Each stage labeled with the Section 13 chapter that covers it.
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
                    <text x={x + w / 2} y={y + 104} fill={SOFT.cyan} fontSize="11" fontWeight="700" textAnchor="middle">
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
              <text x={360} y={210} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Stage 2 = 13.40 - Stage 3 = 13.39 - Stage 1 + Stage 4 = 13.41
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The pipeline costs more than a single judge call, but it is the only structure that catches the three
            failure modes from sub=0 before they reach a customer.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
