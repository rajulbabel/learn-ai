import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

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

export default function EvalDimensions(ctx) {
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
            Production agents are graded on four axes simultaneously. A trace that scores 1.0 on correctness but blew
            the latency budget or leaked a refund is still a failure. Treat all four as first-class.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 380" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Four-axis radar chart with correctness on top, latency on the right, cost on the bottom, and safety on
                the left. A green target zone shows the acceptable region and a red polygon shows a single agent run
                scoring 0.92, 0.78, 0.84, and 0.97.
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
                  <line key={`ax-${a.label}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={`${C.red}44`} strokeWidth={1} />
                );
              })}
              {/* Sample run polygon */}
              <polygon points={samplePoints} fill={`${C.red}20`} stroke={C.red} strokeWidth={2} />
              {/* Axis labels - horizontal labels (left/right) anchor outward so
                  they never sit on top of their near-edge data points */}
              {axesGeom.map((a) => {
                const isRight = a.angle === 0;
                const isLeft = a.angle === Math.PI;
                const labelOffset = isLeft || isRight ? 26 : 18;
                const lp = axisPoint(a.angle, rOuter + labelOffset);
                const anchor = isRight ? "start" : isLeft ? "end" : "middle";
                return (
                  <text
                    key={`lab-${a.label}`}
                    x={lp.x}
                    y={lp.y + 4}
                    fill={SOFT.red}
                    fontSize="14"
                    fontWeight="700"
                    textAnchor={anchor}
                  >
                    {a.label}
                  </text>
                );
              })}
              {/* Sample run score labels - placed on the inner side of each
                  data point so they never collide with the outer axis labels */}
              {axesGeom.map((a) => {
                const sp = axisPoint(a.angle, rOuter * a.score);
                // Label position pulled toward the center along the axis.
                const lp = axisPoint(a.angle, rOuter * a.score - 24);
                return (
                  <g key={`score-${a.label}`}>
                    <circle cx={sp.x} cy={sp.y} r={4} fill={C.red} />
                    <text
                      x={lp.x}
                      y={lp.y + (a.angle === -Math.PI / 2 ? 14 : a.angle === Math.PI / 2 ? -6 : 4)}
                      fill={SOFT.red}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {a.score.toFixed(2)}
                    </text>
                  </g>
                );
              })}
              <text x={280} y={360} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
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
            Correctness is binary at the task level. Either the user&apos;s stated goal was achieved with no incorrect
            side effects, or the trace counts as a failure even if it looked plausible.
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
              Agent Called reset_password And update_email. Both Effects Persisted. User Confirmation Email Sent.
              Result: CORRECT.
            </T>
          </div>

          <T color={SOFT.orange} center size={14} style={{ marginTop: 12 }}>
            T4 (refund + cancel) is a counter-example: correctness fails if the agent issued the refund but skipped the
            cancel, even if the user got a polite response.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            How Long Did It Take?
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Latency is the wall-clock time from user message to final answer. Average alone hides the bad tail. Track
            percentiles: P50, P95, P99. The tail is where users churn.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 240" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Latency histogram showing trace duration distribution with P50 at 3.2 seconds, P95 at 7.5 seconds (just
                inside the 8 second target line), and P99 at 14 seconds in the long tail.
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
                  <text x={b.x} y={195} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
                    {b.label}
                  </text>
                </g>
              ))}
              {/* P50 marker at 3s */}
              <line x1={160} y1={30} x2={160} y2={180} stroke={C.green} strokeWidth={2} strokeDasharray="4 3" />
              <text x={160} y={22} fill={SOFT.green} fontSize="12" fontWeight="700" textAnchor="middle">
                P50 = 3.2s
              </text>
              {/* P95 marker at ~7.5s */}
              <line x1={385} y1={30} x2={385} y2={180} stroke={C.orange} strokeWidth={2} strokeDasharray="4 3" />
              <text x={385} y={22} fill={SOFT.orange} fontSize="12" fontWeight="700" textAnchor="middle">
                P95 = 7.5s
              </text>
              {/* P99 marker at ~14s */}
              <line x1={510} y1={30} x2={510} y2={180} stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
              <text x={510} y={22} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                P99 = 14s
              </text>
              {/* Target line at 8s */}
              <line x1={410} y1={180} x2={410} y2={210} stroke={C.cyan} strokeWidth={2} />
              <text x={410} y={225} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Target: P95 &lt; 8s
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={14} style={{ marginTop: 12 }}>
            Latency budget for a support ticket: 1.5s LLM call x 3 iterations + 200ms tool call x 6 = 5.7s. The
            remainder (under 8s P95) absorbs network jitter and retries.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            How Much Did Each Trace Consume?
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Cost is the dollar amount per trace. Input tokens are cheap, output tokens cost 5x more, and tool calls add
            their own infrastructure cost. Runaway iterations are the number-one source of cost overshoots.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 200" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Cost breakdown bar for a typical support trace showing input tokens at six cents, output tokens at
                twenty cents, and tool calls at twelve cents adding up to roughly thirty-eight cents per ticket against
                a fifty cent target.
              </desc>
              {/* Stacked horizontal bar */}
              {/* Total bar background */}
              <rect
                x={60}
                y={70}
                width={440}
                height={50}
                rx={6}
                fill={`${C.amber}10`}
                stroke={C.amber}
                strokeWidth={1}
              />
              {/* Input tokens segment */}
              <rect x={60} y={70} width={100} height={50} fill={`${C.cyan}66`} stroke={C.cyan} strokeWidth={1} />
              <text x={110} y={100} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Input Tokens
              </text>
              <text x={110} y={115} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                $0.06
              </text>
              {/* Output tokens segment */}
              <rect x={160} y={70} width={200} height={50} fill={`${C.purple}66`} stroke={C.purple} strokeWidth={1} />
              <text x={260} y={100} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Output Tokens
              </text>
              <text x={260} y={115} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                $0.20
              </text>
              {/* Tool calls segment */}
              <rect x={360} y={70} width={120} height={50} fill={`${C.green}66`} stroke={C.green} strokeWidth={1} />
              <text x={420} y={100} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Tool Calls
              </text>
              <text x={420} y={115} fill={SOFT.green} fontSize="11" textAnchor="middle">
                $0.12
              </text>
              {/* Target marker */}
              <line x1={500} y1={60} x2={500} y2={140} stroke={C.red} strokeWidth={2} strokeDasharray="4 3" />
              <text x={500} y={50} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                Target: $0.50
              </text>
              <text x={280} y={160} fill={SOFT.amber} fontSize="14" fontWeight="700" textAnchor="middle">
                Total = $0.38 / Ticket
              </text>
              <text x={280} y={180} fill={SOFT.red} fontSize="12" textAnchor="middle">
                Runaway Iteration Risk: Each Extra Loop Adds $0.20 In Output Tokens
              </text>
            </svg>
          </div>

          <T color={SOFT.amber} center size={14} style={{ marginTop: 12 }}>
            Cap max iterations (10-20 per loop termination policy from 26.6) and you cap the worst-case cost. Without
            the cap, a 100-step runaway can hit $5 on a single trace.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Did The Agent Refuse What It Should?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Safety has four sub-metrics. Each has a target and a customer-support example. Production agents that fail
            safety even at 99% will still produce dozens of incidents per million traces.
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
            Safety scores need the lowest tolerance: 99% refusal rate still permits 1 in 100 prohibited actions to land.
            For sensitive verticals push to 99.9%+.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            One Number For The Dashboard
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Stakeholders want a single trace score. Weight the four axes; correctness dominates for support agents but
            the weights are tunable per use case. Trigger an alert when the composite drops below the target line.
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
              Each component normalized 0-1. Weights tunable per use case. Target composite &gt; 0.85.
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

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
