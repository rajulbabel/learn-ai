import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Workflow DAG node positions for sub=0 (viewBox 0 0 280 180).
const WORKFLOW_NODES_SUB0 = [
  { x: 32, label: "A" },
  { x: 92, label: "B" },
  { x: 152, label: "C" },
  { x: 212, label: "D" },
];

// Agent decision-node options for sub=0 (viewBox 0 0 280 180).
const AGENT_OPTIONS_SUB0 = [
  { x: 50, y: 40, label: "Tool 1" },
  { x: 230, y: 40, label: "Tool 2" },
  { x: 50, y: 140, label: "Tool 3" },
  { x: 230, y: 140, label: "Tool 4" },
];

// Hybrid DAG nodes for sub=3 (viewBox 0 0 600 200).
const HYBRID_NODES = [
  { x: 60, kind: "det", label: "Classify", note: "Deterministic" },
  { x: 190, kind: "agent", label: "Handle", note: "Agent step" },
  { x: 320, kind: "det", label: "Reply", note: "Deterministic" },
  { x: 450, kind: "det", label: "Log", note: "Deterministic" },
];

const WORKFLOW_WINS_BULLETS = [
  "You Can List The Steps In Advance.",
  "Each Step's Output Type Is Predictable.",
  "You Need To Guarantee Certain Steps Execute.",
  "The Cost / Latency Must Be Bounded.",
];

const AGENT_WINS_BULLETS = [
  "You Don't Know The Steps In Advance.",
  "The Model Needs To Decide Which Tools To Call And In What Order.",
  "The Task Could Take 2 Calls Or 20.",
  "You're Willing To Pay For Flexibility.",
];

export default function WorkflowVsAgent(ctx) {
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
            Two Shapes Of Control
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            A workflow is a fixed DAG: you wire the steps and the model follows the wires. An agent is an open loop: the
            model picks the next step every iteration. Same building blocks, very different control flow.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {/* Left card: Workflow DAG */}
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>WORKFLOW</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                Fixed DAG
              </T>
              <svg
                viewBox="0 0 280 180"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Four node directed acyclic graph showing fixed deterministic workflow with predictable edges.
                </desc>
                {WORKFLOW_NODES_SUB0.slice(0, -1).map((n, i) => {
                  const next = WORKFLOW_NODES_SUB0[i + 1];
                  return (
                    <g key={`edge-${i}`}>
                      <line x1={n.x + 36} y1={90} x2={next.x} y2={90} stroke={SOFT.yellow} strokeWidth="1.5" />
                      <polygon points={`${next.x},90 ${next.x - 6},86 ${next.x - 6},94`} fill={SOFT.yellow} />
                    </g>
                  );
                })}
                {WORKFLOW_NODES_SUB0.map((n) => (
                  <g key={n.label}>
                    <rect
                      x={n.x}
                      y={72}
                      width={36}
                      height={36}
                      rx={6}
                      fill={`${C.yellow}28`}
                      stroke={C.yellow}
                      strokeWidth="1.5"
                    />
                    <text x={n.x + 18} y={95} fill={SOFT.yellow} fontSize="14" fontWeight="700" textAnchor="middle">
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
              <T color={SOFT.yellow} center size={13} style={{ marginTop: 8 }}>
                The Flow Is The Same Every Run.
              </T>
            </div>

            {/* Right card: Agent open loop */}
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <span style={pill(C.red)}>AGENT</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Open Loop
              </T>
              <svg
                viewBox="0 0 280 180"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Central decision node with multiple branching options showing an open loop where the model picks
                  different paths each run.
                </desc>
                {AGENT_OPTIONS_SUB0.map((o, i) => {
                  // Stop each option line at the Decide circle edge (r=26) and the tool box edge,
                  // so no line runs through a box interior or crosses its label.
                  const dx = o.x - 140;
                  const dy = o.y - 90;
                  const len = Math.hypot(dx, dy);
                  const ux = dx / len;
                  const uy = dy / len;
                  const sx = 140 + ux * 26;
                  const sy = 90 + uy * 26;
                  const tHit = Math.min(28 / Math.abs(ux), 12 / Math.abs(uy));
                  const ex = o.x - ux * tHit;
                  const ey = o.y - uy * tHit;
                  return (
                    <line
                      key={`opt-${i}`}
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke={`${SOFT.red}99`}
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  );
                })}

                <path d="M 140 60 A 26 26 0 1 1 139.5 60" fill="none" stroke={SOFT.red} strokeWidth="1.5" />
                <polygon points="139.5,60 134,55 138,68" fill={SOFT.red} />

                <circle cx={140} cy={90} r={26} fill={`${C.red}28`} stroke={C.red} strokeWidth="2" />
                <text x={140} y={94} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                  Decide
                </text>

                {AGENT_OPTIONS_SUB0.map((o, i) => (
                  <g key={`node-${i}`}>
                    <rect
                      x={o.x - 28}
                      y={o.y - 12}
                      width={56}
                      height={24}
                      rx={5}
                      fill={`${C.red}1f`}
                      stroke={C.red}
                      strokeWidth="1.2"
                    />
                    <text x={o.x} y={o.y + 4} fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="middle">
                      {o.label}
                    </text>
                  </g>
                ))}
              </svg>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                Different Runs Take Different Paths.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Workflow is a fixed graph you draw. Agent is an open loop where the model picks the next move. Choose the
            shape that matches how much variance the task actually has.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Workflow: Known Inputs, Known Steps
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Workflow is the right shape when you already know what to do. The model is a smart cell inside a bigger
            pipeline you wrote, not the conductor. Pick this when the task is repeatable and the steps are knowable in
            advance.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <T color={SOFT.yellow} center bold size={14}>
              Pick Workflow When
            </T>
            <ul
              style={{
                marginTop: 10,
                marginBottom: 0,
                paddingLeft: 22,
                color: SOFT.yellow,
                fontSize: 15,
                lineHeight: 1.7,
                textAlign: "left",
              }}
            >
              {WORKFLOW_WINS_BULLETS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...tintedCard(C.green), padding: 12, marginTop: 12 }}>
            <span style={pill(C.green)}>EXAMPLE</span>
            <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
              When A Ticket Comes In: Classify -&gt; Route -&gt; Handle.
            </T>
            <T color={SOFT.green} center size={14} style={{ marginTop: 4 }}>
              Always Those 3 Steps.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            The model still calls tools and writes text. But you, not the model, decide which step runs in which order.
            The output of each step is predictable enough to wire to the next.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Agent: Variable Steps, Variable Tools
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Agent is the right shape when you can't pre-draw the graph. The model is the conductor: it decides which
            tool to call, in what order, and when to stop. You pay for that flexibility with cost and unpredictability.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={SOFT.red} center bold size={14}>
              Pick Agent When
            </T>
            <ul
              style={{
                marginTop: 10,
                marginBottom: 0,
                paddingLeft: 22,
                color: SOFT.red,
                fontSize: 15,
                lineHeight: 1.7,
                textAlign: "left",
              }}
            >
              {AGENT_WINS_BULLETS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...tintedCard(C.purple), padding: 12, marginTop: 12 }}>
            <span style={pill(C.purple)}>EXAMPLE</span>
            <T color={SOFT.purple} center size={14} style={{ marginTop: 8 }}>
              Research-Style Task: &quot;Summarize All Customer Issues From The Past Week.&quot;
            </T>
            <T color={SOFT.purple} center size={14} style={{ marginTop: 4 }}>
              Agent Decides Which Docs To Read, Which To Skip, And When It Has Enough.
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            One ticket might need 2 tool calls. The next might need 20. You can't draw that graph in advance because the
            shape of the task only becomes visible after the model starts digging. That is the whole point of an agent.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Most Production Systems Are Hybrid
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Real systems are rarely pure. The common pattern is a workflow with one agent step inside. You keep the
            outer skeleton deterministic and let the model loose only inside the one node that actually needs
            creativity.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <T color={SOFT.amber} center bold size={14}>
              Hybrid: Outer DAG, Inner Agent Loop
            </T>
            <svg
              viewBox="0 0 600 200"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Hybrid workflow showing a four node DAG where the second node is replaced by an agent loop with a
                question mark indicating the model decides while the other three nodes remain deterministic.
              </desc>

              {HYBRID_NODES.slice(0, -1).map((n, i) => {
                const next = HYBRID_NODES[i + 1];
                const x1 = n.x + 90;
                const x2 = next.x;
                return (
                  <g key={`he-${i}`}>
                    <line x1={x1} y1={90} x2={x2} y2={90} stroke={SOFT.amber} strokeWidth="1.5" />
                    <polygon points={`${x2},90 ${x2 - 6},86 ${x2 - 6},94`} fill={SOFT.amber} />
                  </g>
                );
              })}

              {HYBRID_NODES.map((n) => {
                const cx = n.x + 45;
                if (n.kind === "agent") {
                  return (
                    <g key={n.label}>
                      <circle cx={cx} cy={90} r={36} fill={`${C.red}28`} stroke={C.red} strokeWidth="2" />
                      <path
                        d={`M ${cx} 54 A 18 18 0 1 1 ${cx - 0.5} 54`}
                        fill="none"
                        stroke={SOFT.red}
                        strokeWidth="1.5"
                      />
                      <polygon points={`${cx - 0.5},54 ${cx - 6},49 ${cx - 2},62`} fill={SOFT.red} />
                      <text x={cx} y={97} fill={SOFT.red} fontSize="22" fontWeight="700" textAnchor="middle">
                        ?
                      </text>
                      <text x={cx} y={148} fill={C.red} fontSize="12" fontWeight="700" textAnchor="middle">
                        {n.label}
                      </text>
                      <text x={cx} y={164} fill={SOFT.red} fontSize="11" textAnchor="middle">
                        {n.note}
                      </text>
                    </g>
                  );
                }
                return (
                  <g key={n.label}>
                    <rect
                      x={n.x}
                      y={68}
                      width={90}
                      height={44}
                      rx={8}
                      fill={`${C.yellow}24`}
                      stroke={C.yellow}
                      strokeWidth="1.5"
                    />
                    <text x={cx} y={94} fill={C.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                      {n.label}
                    </text>
                    <text x={cx} y={148} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
                      {n.note}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <T color={SOFT.amber} center size={14}>
              The Classify Step Is Deterministic. The Handle Step Is An Agent. Reply And Log Are Deterministic Again.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            This is the hybrid shape almost every production agent ships with. You get the safety and predictability of
            a workflow around the parts you can fully spec, and the freedom of an agent only where you actually need it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Predictable Cost vs Variable Cost
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The biggest practical difference between workflow and agent is the shape of failure. Workflow failures are
            loud and bounded. Agent failures are quiet and unbounded - the agent keeps trying and the bill keeps
            climbing.
          </T>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ ...tintedCard(C.yellow), padding: 14, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <span style={pill(C.yellow)}>WORKFLOW</span>
                <T color={C.yellow} bold size={15}>
                  Bounded And Predictable
                </T>
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                }}
              >
                {[
                  { k: "Cost", v: "Fixed Per Run." },
                  { k: "Latency", v: "Bounded By Slowest Step." },
                  { k: "Failure", v: "Hard Crash, Loud Error." },
                ].map((r) => (
                  <div
                    key={r.k}
                    style={{
                      background: DIM_BG,
                      border: `1px solid ${DIM_BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      textAlign: "center",
                    }}
                  >
                    <T color={SOFT.yellow} bold size={13}>
                      {r.k}
                    </T>
                    <T color={SOFT.yellow} size={13} style={{ marginTop: 4 }}>
                      {r.v}
                    </T>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...tintedCard(C.red), padding: 14, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <span style={pill(C.red)}>AGENT</span>
                <T color={C.red} bold size={15}>
                  Variable And Soft-Failing
                </T>
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 10,
                }}
              >
                {[
                  { k: "Cost", v: "Variable: Depends On Iterations." },
                  { k: "Latency", v: "Variable: 2 Calls Or 20." },
                  { k: "Failure", v: "Soft-Fail: Gets Stuck Instead Of Crashing." },
                ].map((r) => (
                  <div
                    key={r.k}
                    style={{
                      background: DIM_BG,
                      border: `1px solid ${DIM_BORDER}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      textAlign: "center",
                    }}
                  >
                    <T color={SOFT.red} bold size={13}>
                      {r.k}
                    </T>
                    <T color={SOFT.red} size={13} style={{ marginTop: 4 }}>
                      {r.v}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 12,
              marginTop: 14,
              fontFamily: "monospace",
              fontSize: 15,
              color: SOFT.cyan,
              textAlign: "center",
            }}
          >
            Decision Rule: Workflow When You Can; Agent When You Must.
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The cost of an extra workflow node is one more tool call. The cost of an extra agent iteration is an
            unbounded number of tool calls. That asymmetry is why teams default to workflow and reach for an agent only
            on the steps that genuinely need it.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
