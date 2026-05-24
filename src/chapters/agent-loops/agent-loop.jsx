import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// ---------------------------------------------------------------------------
// Chapter 26.3 AgentLoop helpers
// ---------------------------------------------------------------------------

// Three-beat cycle (sub=0) and sub=2 base geometry.
// viewBox 0 0 360 260. Circle center (180, 130), radius 80.
// Nodes spaced 120 degrees: REASON top, ACT lower-right, OBSERVE lower-left.
const CYCLE_CENTER = { cx: 180, cy: 130 };
const CYCLE_NODES = [
  { id: "REASON", x: 180, y: 50, label: "REASON", sub: "Model Thinks" },
  // 180 + 80 * sin(120) = 180 + 69.28 = 249.28
  // 130 + 80 * (-cos(120)) = 130 + 40 = 170
  // y rounded down for clean placement
  { id: "ACT", x: 249, y: 200, label: "ACT", sub: "Tool_use Emitted" },
  { id: "OBSERVE", x: 111, y: 200, label: "OBSERVE", sub: "Tool_result Returned" },
];

// State machine boxes (sub=1).
// viewBox 0 0 600 320. 4 primary boxes width 100, gap 30 at y=70.
// Total span = 4*100 + 3*30 = 490. Pad = (600 - 490)/2 = 55.
const STATE_PRIMARY = [
  { x: 55, label: "WAITING", note: "Idle, Awaiting Input" },
  { x: 185, label: "REASONING", note: "Model Call In Flight" },
  { x: 315, label: "ACTING", note: "Tool Call In Flight" },
  { x: 445, label: "OBSERVING", note: "Got Tool Result" },
];

// Terminal states (sub=1). Same 100-wide boxes, gap 30 at y=250.
// 3 boxes: total span = 300 + 2*30 = 360. Pad = (600 - 360)/2 = 120.
const STATE_TERMINAL = [
  { x: 120, label: "DONE", note: "Final Answer Emitted" },
  { x: 250, label: "FAILED", note: "Unrecoverable Error" },
  { x: 380, label: "ESCALATED", note: "Budget / Max Iter Hit" },
];

// Termination branches (sub=2). 3 outcomes from a diamond decision.
const TERMINATE_BRANCHES = [
  {
    color: "green",
    cond: "Final Answer Emitted?",
    arrow: "Yes",
    outcome: "DONE",
  },
  {
    color: "amber",
    cond: "Max Iterations Exceeded?",
    arrow: "Yes",
    outcome: "ESCALATE",
  },
  {
    color: "red",
    cond: "Budget Exceeded?",
    arrow: "Yes",
    outcome: "ABORT",
  },
];

// Per-iteration cost rows (sub=3).
const COST_ROWS = [
  {
    beat: "REASON",
    detail: "1 LLM Call. ~$0.02 For A 5k-Token Reasoning Context + 200-Token Response.",
  },
  {
    beat: "ACT",
    detail: "0 Model Cost (Tool_use Emitted In Reason's Response). 1 Tool Execution Cost (Varies).",
  },
  {
    beat: "OBSERVE",
    detail: "0 Model Cost. Result Appended To History.",
  },
  {
    beat: "TOTAL",
    detail: "Roughly 1 LLM Call + 1 Tool Call Per Iteration.",
  },
];

// Trace ticket T2 (sub=4). 4 iterations: looks up customer, updates email, resets, summarizes.
const T2_ITERATIONS = [
  {
    n: 1,
    reason: "Need Customer Info Before Anything Else.",
    act: 'lookup_customer(email="ada@example.com")',
    observe: "Got customer_id c-9924, Plan=Pro, Email Verified=False.",
  },
  {
    n: 2,
    reason: "Email Outdated, Update First Before Reset Lands In The Wrong Inbox.",
    act: 'change_email(customer_id="c-9924", new_email="ada+new@example.com")',
    observe: "Email Updated, Verification Pending.",
  },
  {
    n: 3,
    reason: "Now Reset The Password.",
    act: 'reset_password(customer_id="c-9924")',
    observe: "Reset Email Sent To ada+new@example.com.",
  },
  {
    n: 4,
    reason: "Done. Summarize For The User.",
    act: "Emit Final Answer. No Tool Call.",
    observe: "TERMINATE. Loop Exits.",
  },
];

export default function AgentLoop(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            The Three-Beat Cycle
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            An agent is not a single call. It is a loop with exactly three beats: the model reasons, the runtime acts,
            the runtime observes. Then the model reasons again with the new observation glued to the history. Every
            agent system you have ever read about is some shape of this cycle.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 360 260" style={{ width: "100%", maxWidth: 440, display: "block", margin: "0 auto" }}>
              <desc>Three node circular flow showing reason then act then observe cycle of the agent loop.</desc>

              {/* Circular arrows between the 3 nodes (REASON -> ACT -> OBSERVE -> REASON) */}
              {CYCLE_NODES.map((n, i) => {
                const next = CYCLE_NODES[(i + 1) % CYCLE_NODES.length];
                // Arc between two points along the cycle circle (radius 80, center CYCLE_CENTER).
                // Use a slightly larger radius for the arc so it sits outside the nodes.
                const r = 100;
                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={`M ${n.x} ${n.y} A ${r} ${r} 0 0 1 ${next.x} ${next.y}`}
                      fill="none"
                      stroke={SOFT.orange}
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* Arrowheads pointing into each node, oriented along the radial outward direction */}
              {CYCLE_NODES.map((n, i) => {
                const dx = n.x - CYCLE_CENTER.cx;
                const dy = n.y - CYCLE_CENTER.cy;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len;
                const uy = dy / len;
                // Perpendicular for arrow base
                const px = -uy;
                const py = ux;
                const tipX = n.x - ux * 22;
                const tipY = n.y - uy * 22;
                const baseX = tipX - px * 7;
                const baseY = tipY - py * 7;
                const base2X = tipX + px * 7;
                const base2Y = tipY + py * 7;
                return (
                  <polygon
                    key={`tip-${i}`}
                    points={`${tipX},${tipY} ${baseX},${baseY} ${base2X},${base2Y}`}
                    fill={SOFT.orange}
                  />
                );
              })}

              {/* Cycle label in the center */}
              <text
                x={CYCLE_CENTER.cx}
                y={CYCLE_CENTER.cy + 4}
                fill={`${SOFT.orange}b3`}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Loop
              </text>

              {/* Nodes */}
              {CYCLE_NODES.map((n) => (
                <g key={n.id}>
                  <rect
                    x={n.x - 56}
                    y={n.y - 22}
                    width={112}
                    height={44}
                    rx={8}
                    fill={`${C.orange}28`}
                    stroke={C.orange}
                    strokeWidth="2"
                  />
                  <text x={n.x} y={n.y - 4} fill={C.orange} fontSize="14" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y + 12} fill={SOFT.orange} fontSize="11" fontWeight="500" textAnchor="middle">
                    {n.sub}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Reason reads the entire history so far. The model's next decision is always conditioned on every previous
            tool call and result, not just the original prompt.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Agent As State Machine
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Zoom in on a single iteration and the loop becomes a state machine. There are four primary states the agent
            moves through and three terminal states it eventually lands in. Drawing it this way makes the question "what
            happens next?" boring in the best way.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 600 320" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                State machine diagram with waiting reasoning acting observing primary states and done failed escalated
                terminal states.
              </desc>

              {/* Forward arrows between primary states */}
              {STATE_PRIMARY.slice(0, -1).map((s, i) => {
                const next = STATE_PRIMARY[i + 1];
                const x1 = s.x + 100;
                const x2 = next.x;
                const triggers = ["User Input", "LLM Response", "Tool Result"];
                return (
                  <g key={`fe-${i}`}>
                    <line x1={x1} y1={92} x2={x2} y2={92} stroke={SOFT.yellow} strokeWidth="1.5" />
                    <polygon points={`${x2},92 ${x2 - 6},88 ${x2 - 6},96`} fill={SOFT.yellow} />
                    <text
                      x={(x1 + x2) / 2}
                      y={84}
                      fill={SOFT.yellow}
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {triggers[i]}
                    </text>
                  </g>
                );
              })}

              {/* Loop arrow from OBSERVING back to REASONING */}
              <path
                d={`M ${STATE_PRIMARY[3].x + 50} 70 C ${STATE_PRIMARY[3].x + 50} 25, ${STATE_PRIMARY[1].x + 50} 25, ${STATE_PRIMARY[1].x + 50} 70`}
                fill="none"
                stroke={SOFT.yellow}
                strokeWidth="1.5"
              />
              <polygon
                points={`${STATE_PRIMARY[1].x + 50},70 ${STATE_PRIMARY[1].x + 46},64 ${STATE_PRIMARY[1].x + 54},64`}
                fill={SOFT.yellow}
              />
              <text
                x={(STATE_PRIMARY[1].x + STATE_PRIMARY[3].x + 100) / 2}
                y={20}
                fill={SOFT.yellow}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                Loop: Next Iteration
              </text>

              {/* Primary state boxes */}
              {STATE_PRIMARY.map((s) => (
                <g key={s.label}>
                  <rect
                    x={s.x}
                    y={70}
                    width={100}
                    height={44}
                    rx={6}
                    fill={`${C.yellow}28`}
                    stroke={C.yellow}
                    strokeWidth="1.5"
                  />
                  <text x={s.x + 50} y={88} fill={C.yellow} fontSize="12" fontWeight="700" textAnchor="middle">
                    {s.label}
                  </text>
                  <text x={s.x + 50} y={104} fill={SOFT.yellow} fontSize="10" fontWeight="500" textAnchor="middle">
                    {s.note}
                  </text>
                </g>
              ))}

              {/* Vertical separators down to terminal row */}
              <text x={300} y={170} fill={SOFT.yellow} fontSize="11" fontWeight="600" textAnchor="middle">
                On Termination Check (See Sub 3) Move To One Of:
              </text>

              {/* Arrows from REASONING / OBSERVING / FAILURE down to terminals */}
              {STATE_TERMINAL.map((t, i) => {
                const colorMap = ["green", "red", "orange"];
                const cName = colorMap[i];
                const colorVal = C[cName];
                const softVal = SOFT[cName];
                return (
                  <g key={`term-${t.label}`}>
                    <line
                      x1={t.x + 50}
                      y1={185}
                      x2={t.x + 50}
                      y2={232}
                      stroke={softVal}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <polygon points={`${t.x + 50},232 ${t.x + 46},226 ${t.x + 54},226`} fill={softVal} />
                    <rect
                      x={t.x}
                      y={232}
                      width={100}
                      height={44}
                      rx={6}
                      fill={`${colorVal}28`}
                      stroke={colorVal}
                      strokeWidth="1.5"
                    />
                    <text x={t.x + 50} y={250} fill={colorVal} fontSize="12" fontWeight="700" textAnchor="middle">
                      {t.label}
                    </text>
                    <text x={t.x + 50} y={266} fill={softVal} fontSize="10" fontWeight="500" textAnchor="middle">
                      {t.note}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.yellow), padding: 12, marginTop: 12 }}>
            <T color={SOFT.yellow} center size={14}>
              Primary States Loop. Terminal States End The Run. Every Iteration Checks Whether It Should Cross The
              Bottom Boundary.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            DONE is the happy path: the model emitted a final answer. FAILED is an unrecoverable error (tool throw,
            schema break). ESCALATED is the safety net when the agent runs too long or spends too much.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Check After Each Beat
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Every iteration the runtime asks: should we keep looping? Without this guardrail an agent can spin forever
            on a tool that keeps almost-working. The check happens after OBSERVE and before the next REASON.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 500 320" style={{ width: "100%", maxWidth: 560, display: "block", margin: "0 auto" }}>
              <desc>
                Three node cycle of reason act observe with a diamond decision node labeled terminate between observe
                and reason, branching to done escalate or abort.
              </desc>

              {/* Inner cycle nodes shifted left to leave room for the diamond on the right side */}
              {/* REASON at (130, 70), ACT at (130, 180), OBSERVE at (240, 125) */}
              {(() => {
                const innerNodes = [
                  { x: 100, y: 60, label: "REASON" },
                  { x: 100, y: 195, label: "ACT" },
                  { x: 220, y: 127, label: "OBSERVE" },
                ];
                const edges = [
                  { from: 0, to: 1 },
                  { from: 1, to: 2 },
                ];
                return (
                  <>
                    {edges.map((e, i) => (
                      <g key={`ie-${i}`}>
                        <line
                          x1={innerNodes[e.from].x + 38}
                          y1={innerNodes[e.from].y + 12}
                          x2={innerNodes[e.to].x + 38}
                          y2={innerNodes[e.to].y + 12}
                          stroke={SOFT.red}
                          strokeWidth="1.5"
                        />
                      </g>
                    ))}
                    {innerNodes.map((n) => (
                      <g key={n.label}>
                        <rect
                          x={n.x}
                          y={n.y}
                          width={76}
                          height={28}
                          rx={5}
                          fill={`${C.red}28`}
                          stroke={C.red}
                          strokeWidth="1.5"
                        />
                        <text
                          x={n.x + 38}
                          y={n.y + 18}
                          fill={SOFT.red}
                          fontSize="11"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {n.label}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* Arrow from OBSERVE to diamond */}
              <line x1={296} y1={139} x2={328} y2={139} stroke={SOFT.red} strokeWidth="1.5" />
              <polygon points={`328,139 322,135 322,143`} fill={SOFT.red} />

              {/* Diamond decision node centered around (370, 140), size 50 */}
              <polygon points="370,100 410,140 370,180 330,140" fill={`${C.red}28`} stroke={C.red} strokeWidth="2" />
              <text x={370} y={138} fill={C.red} fontSize="12" fontWeight="700" textAnchor="middle">
                Terminate?
              </text>
              <text x={370} y={154} fill={SOFT.red} fontSize="10" fontWeight="500" textAnchor="middle">
                Each Iter
              </text>

              {/* Three outgoing branches from the diamond */}
              {/* Branch 1: top - DONE (green) */}
              <line x1={400} y1={114} x2={450} y2={70} stroke={SOFT.green} strokeWidth="1.5" />
              <polygon points={`450,70 444,72 446,78`} fill={SOFT.green} />
              <text x={450} y={62} fill={SOFT.green} fontSize="10" fontWeight="600" textAnchor="middle">
                Yes
              </text>
              <rect
                x={425}
                y={70}
                width={60}
                height={28}
                rx={5}
                fill={`${C.green}28`}
                stroke={C.green}
                strokeWidth="1.5"
              />
              <text x={455} y={88} fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle">
                DONE
              </text>
              <text x={400} y={115} fill={SOFT.red} fontSize="9" fontWeight="500" textAnchor="start">
                Final Answer?
              </text>

              {/* Branch 2: middle - ESCALATE (amber) */}
              <line x1={410} y1={140} x2={425} y2={140} stroke={SOFT.amber} strokeWidth="1.5" />
              <polygon points={`425,140 419,136 419,144`} fill={SOFT.amber} />
              <rect
                x={425}
                y={126}
                width={68}
                height={28}
                rx={5}
                fill={`${C.amber}28`}
                stroke={C.amber}
                strokeWidth="1.5"
              />
              <text x={459} y={144} fill={C.amber} fontSize="11" fontWeight="700" textAnchor="middle">
                ESCALATE
              </text>
              <text x={385} y={170} fill={SOFT.amber} fontSize="9" fontWeight="500" textAnchor="start">
                Max Iter Hit?
              </text>

              {/* Branch 3: bottom - ABORT (red) */}
              <line x1={400} y1={166} x2={450} y2={210} stroke={SOFT.red} strokeWidth="1.5" />
              <polygon points={`450,210 444,206 446,213`} fill={SOFT.red} />
              <text x={450} y={228} fill={SOFT.red} fontSize="10" fontWeight="600" textAnchor="middle">
                Yes
              </text>
              <rect
                x={425}
                y={184}
                width={60}
                height={28}
                rx={5}
                fill={`${C.red}38`}
                stroke={C.red}
                strokeWidth="1.5"
              />
              <text x={455} y={202} fill={C.red} fontSize="11" fontWeight="700" textAnchor="middle">
                ABORT
              </text>
              <text x={395} y={190} fill={SOFT.red} fontSize="9" fontWeight="500" textAnchor="start">
                Budget Out?
              </text>

              {/* Loop back from diamond's "No" branch to REASON */}
              <path
                d={`M 370 180 C 370 250, 138 250, 138 88`}
                fill="none"
                stroke={SOFT.red}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <polygon points={`138,88 134,94 142,94`} fill={SOFT.red} />
              <text x={250} y={264} fill={SOFT.red} fontSize="10" fontWeight="600" textAnchor="middle">
                No -&gt; Next Iteration
              </text>
            </svg>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {TERMINATE_BRANCHES.map((b) => (
              <div
                key={b.outcome}
                style={{
                  ...tintedCard(C[b.color]),
                  padding: "10px 12px",
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 1fr",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <T color={SOFT[b.color]} center size={13}>
                  {b.cond}
                </T>
                <T color={C[b.color]} bold center size={12}>
                  {b.arrow} -&gt;
                </T>
                <T color={C[b.color]} bold center size={13}>
                  {b.outcome}
                </T>
              </div>
            ))}
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <span style={pill(C.amber)}>NOTE</span>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              We Formalize Each Condition In <ChapterLink to="26.6">Chapter 26.6</ChapterLink> (Loop Termination).
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            The termination check is cheap (no model call) and happens on every iteration. It is the difference between
            a system you can run in production and a runaway model that bills your card flat.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            What Each Beat Costs
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            One iteration is one full lap around the cycle. Some beats cost money, some cost time, some are basically
            free. Knowing where the cost lives tells you what to optimize and how to budget per ticket.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {COST_ROWS.map((r) => {
              const isTotal = r.beat === "TOTAL";
              const color = isTotal ? C.green : C.amber;
              const soft = isTotal ? SOFT.green : SOFT.amber;
              return (
                <div
                  key={r.beat}
                  style={{
                    ...tintedCard(color),
                    padding: "12px 14px",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      background: `${color}28`,
                      border: `1px solid ${color}`,
                      borderRadius: 6,
                      padding: "6px 0",
                      textAlign: "center",
                    }}
                  >
                    <T color={color} bold size={14}>
                      {r.beat}
                    </T>
                  </div>
                  <T color={soft} size={14}>
                    {r.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <span style={pill(C.amber)}>RULE OF THUMB</span>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              Cost Per Iteration = 1 LLM Call + 1 Tool Call. Scale Linearly With Iteration Count.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Reasoning context grows every iteration because the full history is replayed. By iteration 8 you might be
            paying for 40k tokens of context per call. This is why long agent runs get expensive fast, even when each
            individual call looks small.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Loop Trace: Ticket T2
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T2: "I forgot my password and my email also changed." Two problems, order matters. Watch the agent
            loop discover the order through reasoning, not because we hard-coded the steps. Each iteration is one full
            lap of reason / act / observe.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {T2_ITERATIONS.map((it) => (
              <div
                key={it.n}
                style={{
                  ...tintedCard(C.cyan),
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 14,
                  alignItems: "start",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    background: `${C.cyan}28`,
                    border: `1px solid ${C.cyan}`,
                    borderRadius: 6,
                    padding: "8px 0",
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={13}>
                    Iter
                  </T>
                  <T color={C.cyan} bold size={17}>
                    {it.n}
                  </T>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...pill(C.orange), minWidth: 70, textAlign: "center" }}>REASON</span>
                    <T color={SOFT.orange} size={14}>
                      {it.reason}
                    </T>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...pill(C.yellow), minWidth: 70, textAlign: "center" }}>ACT</span>
                    <T
                      color={SOFT.yellow}
                      size={13}
                      style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {it.act}
                    </T>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...pill(C.green), minWidth: 70, textAlign: "center" }}>OBSERVE</span>
                    <T color={SOFT.green} size={14}>
                      {it.observe}
                    </T>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...tintedCard(C.green), padding: 12, marginTop: 12 }}>
            <span style={pill(C.green)}>OUTCOME</span>
            <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
              4 Iterations. 3 Tool Calls. 1 Final Answer. Loop Terminates Cleanly Because The Model Emitted A Final
              Response Instead Of A Tool Call.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            You never told the agent "update email before reset". It worked that out in iteration 2 from the observation
            in iteration 1. That step ordering is the value of the loop: the model adapts to what it just learned.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When You Need The Loop
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Not every task needs a loop. A single tool call is cheaper, faster, and easier to debug. Save the loop for
            tasks where one call genuinely cannot finish the job.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Card 1: Single call */}
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>SINGLE CALL</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                One Tool, One Response, Done
              </T>
              <T color={SOFT.yellow} center size={14} style={{ marginTop: 8 }}>
                Single Tool Call: One Tool, One Response, Done. Example: "What Is The Weather In Tokyo?" -&gt;
                get_weather("Tokyo") -&gt; Return The Result. No Adaptation Needed.
              </T>
            </div>

            {/* Card 2: Loop */}
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <span style={pill(C.cyan)}>LOOP</span>
              <T color={C.cyan} bold center size={15} style={{ marginTop: 8 }}>
                Multiple Iterations, Model Adapts
              </T>
              <T color={SOFT.cyan} center size={14} style={{ marginTop: 8 }}>
                Loop: Multiple Iterations, Model Adapts Based On Intermediate Results. Example: T2 Above. Iter 1's
                Observation Changes What Iter 2 Decides To Do.
              </T>
            </div>
          </div>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
            }}
          >
            <span style={pill(C.orange)}>DECISION RULE</span>
            <T color={SOFT.orange} center size={15} style={{ marginTop: 8 }}>
              If The Second Tool's Input Depends On The First Tool's Output, You Need A Loop.
            </T>
            <T color={SOFT.orange} center size={13} style={{ marginTop: 6 }}>
              Otherwise Stay With A Single Call Or A Fixed Workflow.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            That dependency is the whole reason the loop exists. The first tool's output reshapes what the model knows,
            and the model must re-reason before picking the second tool. No loop, no adaptation, no agent.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
