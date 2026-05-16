import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "./agent-prompting.jsx";

// Section 13 Acts 4 + 5: Workflows / Agent Loops + Memory
// Chapters 13.18 - 13.29. In Milestone 2 only 13.18 - 13.23 are non-stub; Act 5 (13.24 - 13.29) is added in Milestone 3.

// Workflow DAG node positions for sub=0 (viewBox 0 0 280 180).
// 4 nodes spaced 60px apart horizontally, vertically centered at y=90.
// Span: 4 nodes width 36 each + 3 gaps. Total content width = 4*36 + 3*24 = 216. Pad = (280-216)/2 = 32.
const WORKFLOW_NODES_SUB0 = [
  { x: 32, label: "A" },
  { x: 92, label: "B" },
  { x: 152, label: "C" },
  { x: 212, label: "D" },
];

// Agent decision-node options for sub=0 (viewBox 0 0 280 180).
// Central node at center (140, 90). 4 outgoing options arranged at compass points.
const AGENT_OPTIONS_SUB0 = [
  { x: 50, y: 40, label: "Tool 1" },
  { x: 230, y: 40, label: "Tool 2" },
  { x: 50, y: 140, label: "Tool 3" },
  { x: 230, y: 140, label: "Tool 4" },
];

// Hybrid DAG nodes for sub=3 (viewBox 0 0 600 200).
// 4 nodes: 1=Classify (det), 2=Handle (agent loop), 3=Reply (det), 4=Log (det).
// Node 2 will be drawn as an agent loop circle, others as rect boxes.
// Box width 90, gap 40. Total = 4*90 + 3*40 = 480. Pad = (600-480)/2 = 60.
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

export const WorkflowVsAgent = (ctx) => {
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
            A workflow is a fixed DAG: you wire the steps and the model follows the wires. An agent is
            an open loop: the model picks the next step every iteration. Same building blocks, very
            different control flow.
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
                  Four node directed acyclic graph showing fixed deterministic workflow with
                  predictable edges.
                </desc>
                {/* Edges between consecutive nodes */}
                {WORKFLOW_NODES_SUB0.slice(0, -1).map((n, i) => {
                  const next = WORKFLOW_NODES_SUB0[i + 1];
                  return (
                    <g key={`edge-${i}`}>
                      <line
                        x1={n.x + 36}
                        y1={90}
                        x2={next.x}
                        y2={90}
                        stroke={SOFT.yellow}
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${next.x},90 ${next.x - 6},86 ${next.x - 6},94`}
                        fill={SOFT.yellow}
                      />
                    </g>
                  );
                })}
                {/* Nodes */}
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
                    <text
                      x={n.x + 18}
                      y={95}
                      fill={SOFT.yellow}
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
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
                  Central decision node with multiple branching options showing an open loop where the
                  model picks different paths each run.
                </desc>
                {/* Lines from center to each option */}
                {AGENT_OPTIONS_SUB0.map((o, i) => (
                  <line
                    key={`opt-${i}`}
                    x1={140}
                    y1={90}
                    x2={o.x}
                    y2={o.y}
                    stroke={`${SOFT.red}99`}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                ))}

                {/* Self-loop arc around center node */}
                <path
                  d="M 140 60 A 26 26 0 1 1 139.5 60"
                  fill="none"
                  stroke={SOFT.red}
                  strokeWidth="1.5"
                />
                <polygon points="139.5,60 134,55 138,68" fill={SOFT.red} />

                {/* Central decision node */}
                <circle cx={140} cy={90} r={26} fill={`${C.red}28`} stroke={C.red} strokeWidth="2" />
                <text
                  x={140}
                  y={94}
                  fill={SOFT.red}
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  Decide
                </text>

                {/* Option nodes */}
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
                    <text
                      x={o.x}
                      y={o.y + 4}
                      fill={SOFT.red}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
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
            Workflow is a fixed graph you draw. Agent is an open loop where the model picks the next
            move. Choose the shape that matches how much variance the task actually has.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Workflow: Known Inputs, Known Steps
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Workflow is the right shape when you already know what to do. The model is a smart cell
            inside a bigger pipeline you wrote, not the conductor. Pick this when the task is
            repeatable and the steps are knowable in advance.
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
            The model still calls tools and writes text. But you, not the model, decide which step
            runs in which order. The output of each step is predictable enough to wire to the next.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Agent: Variable Steps, Variable Tools
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Agent is the right shape when you can't pre-draw the graph. The model is the conductor:
            it decides which tool to call, in what order, and when to stop. You pay for that
            flexibility with cost and unpredictability.
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
            One ticket might need 2 tool calls. The next might need 20. You can't draw that graph in
            advance because the shape of the task only becomes visible after the model starts
            digging. That is the whole point of an agent.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Most Production Systems Are Hybrid
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Real systems are rarely pure. The common pattern is a workflow with one agent step inside.
            You keep the outer skeleton deterministic and let the model loose only inside the one node
            that actually needs creativity.
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
                Hybrid workflow showing a four node DAG where the second node is replaced by an agent
                loop with a question mark indicating the model decides while the other three nodes
                remain deterministic.
              </desc>

              {/* Edges */}
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

              {/* Nodes */}
              {HYBRID_NODES.map((n) => {
                const cx = n.x + 45;
                if (n.kind === "agent") {
                  // Agent loop: circle + self-loop arc + question mark inside
                  return (
                    <g key={n.label}>
                      <circle
                        cx={cx}
                        cy={90}
                        r={36}
                        fill={`${C.red}28`}
                        stroke={C.red}
                        strokeWidth="2"
                      />
                      {/* Self-loop arc around the top of the circle */}
                      <path
                        d={`M ${cx} 54 A 18 18 0 1 1 ${cx - 0.5} 54`}
                        fill="none"
                        stroke={SOFT.red}
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${cx - 0.5},54 ${cx - 6},49 ${cx - 2},62`}
                        fill={SOFT.red}
                      />
                      <text
                        x={cx}
                        y={97}
                        fill={SOFT.red}
                        fontSize="22"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        ?
                      </text>
                      <text
                        x={cx}
                        y={148}
                        fill={C.red}
                        fontSize="12"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {n.label}
                      </text>
                      <text
                        x={cx}
                        y={164}
                        fill={SOFT.red}
                        fontSize="11"
                        textAnchor="middle"
                      >
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
                    <text
                      x={cx}
                      y={94}
                      fill={C.yellow}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {n.label}
                    </text>
                    <text
                      x={cx}
                      y={148}
                      fill={SOFT.yellow}
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {n.note}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <T color={SOFT.amber} center size={14}>
              The Classify Step Is Deterministic. The Handle Step Is An Agent. Reply And Log Are
              Deterministic Again.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            This is the hybrid shape almost every production agent ships with. You get the safety
            and predictability of a workflow around the parts you can fully spec, and the freedom of
            an agent only where you actually need it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Predictable Cost vs Variable Cost
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The biggest practical difference between workflow and agent is the shape of failure.
            Workflow failures are loud and bounded. Agent failures are quiet and unbounded - the
            agent keeps trying and the bill keeps climbing.
          </T>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Row 1: Workflow */}
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

            {/* Row 2: Agent */}
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
            The cost of an extra workflow node is one more tool call. The cost of an extra agent
            iteration is an unbounded number of tool calls. That asymmetry is why teams default to
            workflow and reach for an agent only on the steps that genuinely need it.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// Chain mini-topology nodes for sub=0 (viewBox 0 0 200 120).
// 3 nodes: A -> B -> C, vertically centered at y=60.
// Each node 32 wide, 2 gaps of 36. Total = 3*32 + 2*36 = 168. Pad = (200-168)/2 = 16.
const CHAIN_MINI_NODES = [
  { x: 16, label: "A" },
  { x: 84, label: "B" },
  { x: 152, label: "C" },
];

// Route mini-topology for sub=0 (viewBox 0 0 200 160).
// Input -> Classifier -> 3 branches.
// Input at (24, 80), classifier at (84, 80), branches at (160, 30), (160, 80), (160, 130).
const ROUTE_MINI_NODES = {
  input: { x: 24, y: 80, label: "In" },
  classifier: { x: 80, y: 80, label: "Class" },
  branches: [
    { x: 154, y: 32, label: "B1" },
    { x: 154, y: 80, label: "B2" },
    { x: 154, y: 128, label: "B3" },
  ],
};

// Parallel mini-topology for sub=0 (viewBox 0 0 200 160).
// Input -> 3 workers -> aggregator.
// Input at (16, 80), workers at (88, 32), (88, 80), (88, 128), aggregator at (160, 80).
const PARALLEL_MINI_NODES = {
  input: { x: 16, y: 80, label: "In" },
  workers: [
    { x: 84, y: 32, label: "W1" },
    { x: 84, y: 80, label: "W2" },
    { x: 84, y: 128, label: "W3" },
  ],
  aggregator: { x: 156, y: 80, label: "Agg" },
};

// Chaining detailed nodes for sub=1 (viewBox 0 0 560 200).
// 3 nodes: Ticket -> Classifier -> Handler. Each rect 120 wide, 2 gaps of 80. Total = 3*120 + 2*80 = 520. Pad = (560-520)/2 = 20.
const CHAIN_DETAIL_NODES = [
  { x: 20, label: "Ticket", note: "User Text" },
  { x: 220, label: "Classifier", note: "LLM Call" },
  { x: 420, label: "Handler", note: "LLM Call" },
];

// Routing detailed branches for sub=2 (viewBox 0 0 560 280).
// Input at left, classifier in center, 4 branches on right.
const ROUTE_DETAIL = {
  input: { x: 24, y: 130, label: "Ticket" },
  classifier: { x: 180, y: 130, label: "Intent Classifier" },
  branches: [
    { x: 380, y: 38, label: "Billing" },
    { x: 380, y: 102, label: "Product" },
    { x: 380, y: 166, label: "Troubleshooting" },
    { x: 380, y: 230, label: "Chitchat" },
  ],
};

// Parallel fan-out for sub=3 (viewBox 0 0 600 240).
// Input -> 3 workers -> aggregator.
const PARALLEL_DETAIL = {
  input: { x: 24, y: 100, label: "Query" },
  workers: [
    { x: 220, y: 32, label: "Worker 1", time: "180ms" },
    { x: 220, y: 100, label: "Worker 2", time: "140ms" },
    { x: 220, y: 168, label: "Worker 3", time: "210ms" },
  ],
  aggregator: { x: 440, y: 100, label: "Aggregator" },
};

// Composed topology for sub=4 (viewBox 0 0 720 320).
// Stage 1: Input -> Classifier (chain).
// Stage 2: Classifier -> 3 branches (route).
// Stage 3: One branch parallelizes 3 retrievals.
// Stage 4: Merged -> Answer (chain).
const COMPOSED_TOPO = {
  input: { x: 18, y: 152, label: "Ticket" },
  classifier: { x: 124, y: 152, label: "Classifier" },
  branches: [
    { x: 268, y: 48, label: "Billing" },
    { x: 268, y: 152, label: "Troubleshoot" },
    { x: 268, y: 256, label: "Chitchat" },
  ],
  retrieval: [
    { x: 410, y: 96, label: "search_kb" },
    { x: 410, y: 152, label: "search_docs" },
    { x: 410, y: 208, label: "search_tickets" },
  ],
  merger: { x: 552, y: 152, label: "Merge" },
  answer: { x: 660, y: 152, label: "Answer" },
};

const SUPPORT_WORKFLOW_STEPS = [
  {
    n: 1,
    label: "Ticket Arrives",
    detail: "User Message Hits The Inbound Queue.",
    kind: "chain",
  },
  {
    n: 2,
    label: "Classifier (Intent Classification)",
    detail: "Routes To Billing / Troubleshooting / Escalation.",
    kind: "route",
  },
  {
    n: 3,
    label: "Billing Branch",
    detail: "Chain lookup_customer -> lookup_subscription -> Respond.",
    kind: "chain",
  },
  {
    n: 4,
    label: "Troubleshooting Branch",
    detail: "Parallel (search_kb For Top-3 Hypotheses) -> Chain To Response.",
    kind: "parallel",
  },
  {
    n: 5,
    label: "Escalation Branch",
    detail: "escalate_human Directly.",
    kind: "chain",
  },
];

export const WorkflowPrimitives = (ctx) => {
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
            Chain, Route, Parallelize
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Workflows are built from three composable primitives. Chaining wires step A's output into
            step B. Routing classifies the input and picks one branch. Parallelization fans out N
            workers and merges their results. Every production workflow stacks these three.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {/* Card 1: Chaining */}
            <div style={{ ...tintedCard(C.yellow), padding: 12 }}>
              <span style={pill(C.yellow)}>CHAIN</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                A -&gt; B -&gt; C
              </T>
              <svg
                viewBox="0 0 200 120"
                style={{ width: "100%", maxWidth: 260, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Three node chain showing step A flowing to step B flowing to step C as sequential
                  arrows in a horizontal pipeline.
                </desc>
                {CHAIN_MINI_NODES.slice(0, -1).map((n, i) => {
                  const next = CHAIN_MINI_NODES[i + 1];
                  return (
                    <g key={`ce-${i}`}>
                      <line
                        x1={n.x + 32}
                        y1={60}
                        x2={next.x}
                        y2={60}
                        stroke={SOFT.yellow}
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${next.x},60 ${next.x - 6},56 ${next.x - 6},64`}
                        fill={SOFT.yellow}
                      />
                    </g>
                  );
                })}
                {CHAIN_MINI_NODES.map((n) => (
                  <g key={n.label}>
                    <rect
                      x={n.x}
                      y={44}
                      width={32}
                      height={32}
                      rx={6}
                      fill={`${C.yellow}28`}
                      stroke={C.yellow}
                      strokeWidth="1.5"
                    />
                    <text
                      x={n.x + 16}
                      y={64}
                      fill={SOFT.yellow}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>
              <T color={SOFT.yellow} center size={13} style={{ marginTop: 8 }}>
                Chaining: Sequential Steps.
              </T>
            </div>

            {/* Card 2: Routing */}
            <div style={{ ...tintedCard(C.red), padding: 12 }}>
              <span style={pill(C.red)}>ROUTE</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Classifier Picks Branch
              </T>
              <svg
                viewBox="0 0 200 160"
                style={{ width: "100%", maxWidth: 260, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Routing topology showing an input flowing to a classifier node which then branches
                  out to three different downstream paths based on intent.
                </desc>
                {/* Input -> Classifier */}
                <line
                  x1={ROUTE_MINI_NODES.input.x + 22}
                  y1={ROUTE_MINI_NODES.input.y}
                  x2={ROUTE_MINI_NODES.classifier.x - 22}
                  y2={ROUTE_MINI_NODES.classifier.y}
                  stroke={SOFT.red}
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${ROUTE_MINI_NODES.classifier.x - 22},${ROUTE_MINI_NODES.classifier.y} ${ROUTE_MINI_NODES.classifier.x - 28},${ROUTE_MINI_NODES.classifier.y - 4} ${ROUTE_MINI_NODES.classifier.x - 28},${ROUTE_MINI_NODES.classifier.y + 4}`}
                  fill={SOFT.red}
                />
                {/* Classifier -> branches */}
                {ROUTE_MINI_NODES.branches.map((b, i) => (
                  <g key={`rmb-${i}`}>
                    <line
                      x1={ROUTE_MINI_NODES.classifier.x + 22}
                      y1={ROUTE_MINI_NODES.classifier.y}
                      x2={b.x - 22}
                      y2={b.y}
                      stroke={SOFT.red}
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${b.x - 22},${b.y} ${b.x - 28},${b.y - 4} ${b.x - 28},${b.y + 4}`}
                      fill={SOFT.red}
                    />
                  </g>
                ))}
                {/* Input node */}
                <rect
                  x={ROUTE_MINI_NODES.input.x - 22}
                  y={ROUTE_MINI_NODES.input.y - 12}
                  width={44}
                  height={24}
                  rx={5}
                  fill={`${C.red}24`}
                  stroke={C.red}
                  strokeWidth="1.5"
                />
                <text
                  x={ROUTE_MINI_NODES.input.x}
                  y={ROUTE_MINI_NODES.input.y + 4}
                  fill={SOFT.red}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {ROUTE_MINI_NODES.input.label}
                </text>
                {/* Classifier node */}
                <rect
                  x={ROUTE_MINI_NODES.classifier.x - 22}
                  y={ROUTE_MINI_NODES.classifier.y - 14}
                  width={44}
                  height={28}
                  rx={5}
                  fill={`${C.red}28`}
                  stroke={C.red}
                  strokeWidth="1.5"
                />
                <text
                  x={ROUTE_MINI_NODES.classifier.x}
                  y={ROUTE_MINI_NODES.classifier.y + 4}
                  fill={SOFT.red}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {ROUTE_MINI_NODES.classifier.label}
                </text>
                {/* Branch nodes */}
                {ROUTE_MINI_NODES.branches.map((b) => (
                  <g key={b.label}>
                    <rect
                      x={b.x - 22}
                      y={b.y - 12}
                      width={44}
                      height={24}
                      rx={5}
                      fill={`${C.red}1f`}
                      stroke={C.red}
                      strokeWidth="1.2"
                    />
                    <text
                      x={b.x}
                      y={b.y + 4}
                      fill={SOFT.red}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {b.label}
                    </text>
                  </g>
                ))}
              </svg>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                Routing: One Of N Branches.
              </T>
            </div>

            {/* Card 3: Parallelize */}
            <div style={{ ...tintedCard(C.amber), padding: 12 }}>
              <span style={pill(C.amber)}>PARALLEL</span>
              <T color={C.amber} bold center size={15} style={{ marginTop: 8 }}>
                Fan-Out + Merge
              </T>
              <svg
                viewBox="0 0 200 160"
                style={{ width: "100%", maxWidth: 260, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Parallelization topology showing an input fanning out to three concurrent worker
                  nodes that all feed into a single aggregator node.
                </desc>
                {/* Input -> workers */}
                {PARALLEL_MINI_NODES.workers.map((w, i) => (
                  <g key={`pin-${i}`}>
                    <line
                      x1={PARALLEL_MINI_NODES.input.x + 22}
                      y1={PARALLEL_MINI_NODES.input.y}
                      x2={w.x - 22}
                      y2={w.y}
                      stroke={SOFT.amber}
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${w.x - 22},${w.y} ${w.x - 28},${w.y - 4} ${w.x - 28},${w.y + 4}`}
                      fill={SOFT.amber}
                    />
                  </g>
                ))}
                {/* Workers -> aggregator */}
                {PARALLEL_MINI_NODES.workers.map((w, i) => (
                  <g key={`pout-${i}`}>
                    <line
                      x1={w.x + 22}
                      y1={w.y}
                      x2={PARALLEL_MINI_NODES.aggregator.x - 22}
                      y2={PARALLEL_MINI_NODES.aggregator.y}
                      stroke={SOFT.amber}
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${PARALLEL_MINI_NODES.aggregator.x - 22},${PARALLEL_MINI_NODES.aggregator.y} ${PARALLEL_MINI_NODES.aggregator.x - 28},${PARALLEL_MINI_NODES.aggregator.y - 4} ${PARALLEL_MINI_NODES.aggregator.x - 28},${PARALLEL_MINI_NODES.aggregator.y + 4}`}
                      fill={SOFT.amber}
                    />
                  </g>
                ))}
                {/* Input node */}
                <rect
                  x={PARALLEL_MINI_NODES.input.x - 22}
                  y={PARALLEL_MINI_NODES.input.y - 12}
                  width={44}
                  height={24}
                  rx={5}
                  fill={`${C.amber}24`}
                  stroke={C.amber}
                  strokeWidth="1.5"
                />
                <text
                  x={PARALLEL_MINI_NODES.input.x}
                  y={PARALLEL_MINI_NODES.input.y + 4}
                  fill={SOFT.amber}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {PARALLEL_MINI_NODES.input.label}
                </text>
                {/* Worker nodes */}
                {PARALLEL_MINI_NODES.workers.map((w) => (
                  <g key={w.label}>
                    <rect
                      x={w.x - 22}
                      y={w.y - 12}
                      width={44}
                      height={24}
                      rx={5}
                      fill={`${C.amber}1f`}
                      stroke={C.amber}
                      strokeWidth="1.2"
                    />
                    <text
                      x={w.x}
                      y={w.y + 4}
                      fill={SOFT.amber}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {w.label}
                    </text>
                  </g>
                ))}
                {/* Aggregator node */}
                <rect
                  x={PARALLEL_MINI_NODES.aggregator.x - 22}
                  y={PARALLEL_MINI_NODES.aggregator.y - 14}
                  width={44}
                  height={28}
                  rx={5}
                  fill={`${C.amber}28`}
                  stroke={C.amber}
                  strokeWidth="1.5"
                />
                <text
                  x={PARALLEL_MINI_NODES.aggregator.x}
                  y={PARALLEL_MINI_NODES.aggregator.y + 4}
                  fill={SOFT.amber}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {PARALLEL_MINI_NODES.aggregator.label}
                </text>
              </svg>
              <T color={SOFT.amber} center size={13} style={{ marginTop: 8 }}>
                Parallelization: Concurrent Workers.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            These are the lego bricks. Chaining is a sequence. Routing is a fork. Parallelization is a
            fan-out plus merge. Real workflows stack them in layers.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Step A's Output Is Step B's Input
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Chaining is the simplest primitive: the structured output of one LLM call becomes the
            structured input of the next. The glue is JSON. Step A returns a typed object, your code
            reads it, and feeds the next step.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <T color={SOFT.yellow} center bold size={14}>
              Chain: Ticket -&gt; Classifier -&gt; Handler
            </T>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Three node chain with JSON output labels above each arrow showing how the structured
                output of one step becomes the structured input of the next step in a billing ticket
                example.
              </desc>
              {/* Edges with JSON labels */}
              {CHAIN_DETAIL_NODES.slice(0, -1).map((n, i) => {
                const next = CHAIN_DETAIL_NODES[i + 1];
                const x1 = n.x + 120;
                const x2 = next.x;
                const labelX = (x1 + x2) / 2;
                const labels = [
                  { line1: '{ "text":', line2: '"can\'t bill" }' },
                  { line1: '{ "category":', line2: '"billing" }' },
                ];
                return (
                  <g key={`cd-${i}`}>
                    <line x1={x1} y1={120} x2={x2} y2={120} stroke={SOFT.yellow} strokeWidth="1.5" />
                    <polygon
                      points={`${x2},120 ${x2 - 6},116 ${x2 - 6},124`}
                      fill={SOFT.yellow}
                    />
                    {/* JSON label box above arrow */}
                    <rect
                      x={labelX - 60}
                      y={66}
                      width={120}
                      height={36}
                      rx={4}
                      fill="#1b1b22"
                      stroke={SOFT.yellow}
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={82}
                      fill={SOFT.yellow}
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {labels[i].line1}
                    </text>
                    <text
                      x={labelX}
                      y={96}
                      fill={SOFT.yellow}
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {labels[i].line2}
                    </text>
                    {/* Vertical hint line from label to arrow */}
                    <line
                      x1={labelX}
                      y1={102}
                      x2={labelX}
                      y2={117}
                      stroke={SOFT.yellow}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </g>
                );
              })}
              {/* Nodes */}
              {CHAIN_DETAIL_NODES.map((n) => (
                <g key={n.label}>
                  <rect
                    x={n.x}
                    y={102}
                    width={120}
                    height={44}
                    rx={8}
                    fill={`${C.yellow}24`}
                    stroke={C.yellow}
                    strokeWidth="1.5"
                  />
                  <text
                    x={n.x + 60}
                    y={128}
                    fill={C.yellow}
                    fontSize="14"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + 60}
                    y={166}
                    fill={SOFT.yellow}
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {n.note}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div
            style={{
              ...tintedCard(C.yellow),
              padding: 12,
              marginTop: 12,
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.yellow,
              textAlign: "center",
            }}
          >
            Step A Output: { '{ "category": "billing", "confidence": 0.92 }' }
            <br />
            Step B Input: { '{ "category": "billing", "ticket": "Can\'t bill my card." }' }
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            Because each step returns a typed object (the JSON schema from chapter 13.8), the next
            step can read fields like ticket.category by name. Chaining is just normal function
            composition with LLM calls as the functions.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Route By Intent
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Routing classifies the input and picks one branch. The classifier is itself an LLM call
            that returns a typed label. Your code then dispatches to the matching handler. Only the
            chosen branch runs.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={SOFT.red} center bold size={14}>
              Intent Classifier Picks One Of Four Branches
            </T>
            <svg
              viewBox="0 0 560 280"
              style={{ width: "100%", maxWidth: 680, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Routing diagram showing a ticket flowing to an intent classifier that branches to
                billing, product, troubleshooting, and chitchat handler boxes based on classified
                intent.
              </desc>
              {/* Input -> classifier */}
              <line
                x1={ROUTE_DETAIL.input.x + 44}
                y1={ROUTE_DETAIL.input.y}
                x2={ROUTE_DETAIL.classifier.x - 70}
                y2={ROUTE_DETAIL.classifier.y}
                stroke={SOFT.red}
                strokeWidth="1.5"
              />
              <polygon
                points={`${ROUTE_DETAIL.classifier.x - 70},${ROUTE_DETAIL.classifier.y} ${ROUTE_DETAIL.classifier.x - 76},${ROUTE_DETAIL.classifier.y - 4} ${ROUTE_DETAIL.classifier.x - 76},${ROUTE_DETAIL.classifier.y + 4}`}
                fill={SOFT.red}
              />
              {/* Classifier -> 4 branches */}
              {ROUTE_DETAIL.branches.map((b, i) => (
                <g key={`rde-${i}`}>
                  <line
                    x1={ROUTE_DETAIL.classifier.x + 70}
                    y1={ROUTE_DETAIL.classifier.y}
                    x2={b.x - 70}
                    y2={b.y}
                    stroke={SOFT.red}
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`${b.x - 70},${b.y} ${b.x - 76},${b.y - 4} ${b.x - 76},${b.y + 4}`}
                    fill={SOFT.red}
                  />
                </g>
              ))}
              {/* Input node */}
              <rect
                x={ROUTE_DETAIL.input.x - 44}
                y={ROUTE_DETAIL.input.y - 18}
                width={88}
                height={36}
                rx={6}
                fill={`${C.red}24`}
                stroke={C.red}
                strokeWidth="1.5"
              />
              <text
                x={ROUTE_DETAIL.input.x}
                y={ROUTE_DETAIL.input.y + 5}
                fill={SOFT.red}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                {ROUTE_DETAIL.input.label}
              </text>
              {/* Classifier node */}
              <rect
                x={ROUTE_DETAIL.classifier.x - 70}
                y={ROUTE_DETAIL.classifier.y - 22}
                width={140}
                height={44}
                rx={8}
                fill={`${C.red}30`}
                stroke={C.red}
                strokeWidth="2"
              />
              <text
                x={ROUTE_DETAIL.classifier.x}
                y={ROUTE_DETAIL.classifier.y + 5}
                fill={C.red}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                {ROUTE_DETAIL.classifier.label}
              </text>
              {/* Branch nodes */}
              {ROUTE_DETAIL.branches.map((b) => (
                <g key={b.label}>
                  <rect
                    x={b.x - 70}
                    y={b.y - 18}
                    width={140}
                    height={36}
                    rx={6}
                    fill={`${C.red}1f`}
                    stroke={C.red}
                    strokeWidth="1.2"
                  />
                  <text
                    x={b.x}
                    y={b.y + 5}
                    fill={SOFT.red}
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {b.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.purple), padding: 12, marginTop: 12 }}>
            <T color={SOFT.purple} center size={14}>
              The Classifier Is Itself An LLM Call With Few-Shot Examples (See Section 13.3).
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            One classification call replaces a hand-written if/else tree. The model labels the input,
            your code dispatches the matching branch handler. Adding a new branch is one new few-shot
            example plus one new handler.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Run N In Parallel, Then Merge
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Parallelization runs N independent calls concurrently and aggregates the results. The
            total latency is the time of the slowest worker, not the sum. This is the cheapest way to
            cut wait time on independent sub-tasks.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <T color={SOFT.amber} center bold size={14}>
              Fan-Out To 3 Workers, Then Aggregate
            </T>
            <svg
              viewBox="0 0 600 240"
              style={{ width: "100%", maxWidth: 700, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Fan-out diagram showing one query branching to three concurrent workers running in
                parallel then merging into a single aggregator node with timing bars showing that
                total latency equals the slowest worker time.
              </desc>
              {/* Input -> workers */}
              {PARALLEL_DETAIL.workers.map((w, i) => (
                <g key={`pdin-${i}`}>
                  <line
                    x1={PARALLEL_DETAIL.input.x + 44}
                    y1={PARALLEL_DETAIL.input.y}
                    x2={w.x - 70}
                    y2={w.y}
                    stroke={SOFT.amber}
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`${w.x - 70},${w.y} ${w.x - 76},${w.y - 4} ${w.x - 76},${w.y + 4}`}
                    fill={SOFT.amber}
                  />
                </g>
              ))}
              {/* Workers -> aggregator */}
              {PARALLEL_DETAIL.workers.map((w, i) => (
                <g key={`pdout-${i}`}>
                  <line
                    x1={w.x + 70}
                    y1={w.y}
                    x2={PARALLEL_DETAIL.aggregator.x - 70}
                    y2={PARALLEL_DETAIL.aggregator.y}
                    stroke={SOFT.amber}
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`${PARALLEL_DETAIL.aggregator.x - 70},${PARALLEL_DETAIL.aggregator.y} ${PARALLEL_DETAIL.aggregator.x - 76},${PARALLEL_DETAIL.aggregator.y - 4} ${PARALLEL_DETAIL.aggregator.x - 76},${PARALLEL_DETAIL.aggregator.y + 4}`}
                    fill={SOFT.amber}
                  />
                </g>
              ))}
              {/* Input node */}
              <rect
                x={PARALLEL_DETAIL.input.x - 44}
                y={PARALLEL_DETAIL.input.y - 18}
                width={88}
                height={36}
                rx={6}
                fill={`${C.amber}24`}
                stroke={C.amber}
                strokeWidth="1.5"
              />
              <text
                x={PARALLEL_DETAIL.input.x}
                y={PARALLEL_DETAIL.input.y + 5}
                fill={SOFT.amber}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                {PARALLEL_DETAIL.input.label}
              </text>
              {/* Worker nodes */}
              {PARALLEL_DETAIL.workers.map((w) => (
                <g key={w.label}>
                  <rect
                    x={w.x - 70}
                    y={w.y - 18}
                    width={140}
                    height={36}
                    rx={6}
                    fill={`${C.amber}1f`}
                    stroke={C.amber}
                    strokeWidth="1.2"
                  />
                  <text
                    x={w.x}
                    y={w.y}
                    fill={SOFT.amber}
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {w.label}
                  </text>
                  <text
                    x={w.x}
                    y={w.y + 14}
                    fill={SOFT.amber}
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {w.time}
                  </text>
                </g>
              ))}
              {/* Aggregator node */}
              <rect
                x={PARALLEL_DETAIL.aggregator.x - 70}
                y={PARALLEL_DETAIL.aggregator.y - 22}
                width={140}
                height={44}
                rx={8}
                fill={`${C.amber}30`}
                stroke={C.amber}
                strokeWidth="2"
              />
              <text
                x={PARALLEL_DETAIL.aggregator.x}
                y={PARALLEL_DETAIL.aggregator.y + 5}
                fill={C.amber}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                {PARALLEL_DETAIL.aggregator.label}
              </text>
            </svg>

            {/* Timing bars */}
            <div style={{ marginTop: 14, padding: "10px 20px" }}>
              <T color={SOFT.amber} center size={13} bold style={{ marginBottom: 8 }}>
                Timing (Concurrent)
              </T>
              {PARALLEL_DETAIL.workers.map((w, i) => {
                const pct = (parseInt(w.time, 10) / 210) * 100;
                return (
                  <div
                    key={`tim-${i}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 60px",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <T color={SOFT.amber} size={12}>
                      {w.label}
                    </T>
                    <div
                      style={{
                        background: DIM_BG,
                        border: `1px solid ${DIM_BORDER}`,
                        borderRadius: 4,
                        height: 12,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          background: `${C.amber}60`,
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <T color={SOFT.amber} size={12}>
                      {w.time}
                    </T>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              ...tintedCard(C.amber),
              padding: 12,
              marginTop: 12,
              fontFamily: "monospace",
              fontSize: 15,
              color: SOFT.amber,
              textAlign: "center",
            }}
          >
            Latency = max(worker time), Not Sum.
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            If three retrieval calls each take 150-210ms, running them in series costs ~540ms.
            Running them concurrently costs ~210ms, the slowest one. The aggregator then merges all
            results into one structured object.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Real Workflows Stack Primitives
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Production workflows compose all three. A typical pipeline is: chain into a classifier,
            route to one of several branches, parallelize the heavy retrieval inside one branch, then
            chain the merged result into a final answer step.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center bold size={14}>
              Composed Topology: Chain + Route + Parallel + Chain
            </T>
            <svg
              viewBox="0 0 720 320"
              style={{ width: "100%", maxWidth: 760, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Composed workflow topology stacking all three primitives where a ticket chains into
                a classifier that routes to one of three branches, one branch fans out to three
                parallel retrieval calls that merge before chaining into a final answer node.
              </desc>
              {/* Stage 1: Ticket -> Classifier (chain) */}
              <line
                x1={COMPOSED_TOPO.input.x + 34}
                y1={COMPOSED_TOPO.input.y}
                x2={COMPOSED_TOPO.classifier.x - 50}
                y2={COMPOSED_TOPO.classifier.y}
                stroke={SOFT.cyan}
                strokeWidth="1.5"
              />
              <polygon
                points={`${COMPOSED_TOPO.classifier.x - 50},${COMPOSED_TOPO.classifier.y} ${COMPOSED_TOPO.classifier.x - 56},${COMPOSED_TOPO.classifier.y - 4} ${COMPOSED_TOPO.classifier.x - 56},${COMPOSED_TOPO.classifier.y + 4}`}
                fill={SOFT.cyan}
              />
              {/* Stage 2: Classifier -> 3 branches (route) */}
              {COMPOSED_TOPO.branches.map((b, i) => (
                <g key={`cb-${i}`}>
                  <line
                    x1={COMPOSED_TOPO.classifier.x + 50}
                    y1={COMPOSED_TOPO.classifier.y}
                    x2={b.x - 50}
                    y2={b.y}
                    stroke={SOFT.cyan}
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`${b.x - 50},${b.y} ${b.x - 56},${b.y - 4} ${b.x - 56},${b.y + 4}`}
                    fill={SOFT.cyan}
                  />
                </g>
              ))}
              {/* Stage 3: Troubleshoot branch (middle) -> 3 parallel retrievals */}
              {COMPOSED_TOPO.retrieval.map((r, i) => (
                <g key={`cr-${i}`}>
                  <line
                    x1={COMPOSED_TOPO.branches[1].x + 50}
                    y1={COMPOSED_TOPO.branches[1].y}
                    x2={r.x - 50}
                    y2={r.y}
                    stroke={SOFT.cyan}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </g>
              ))}
              {/* Stage 4: 3 retrievals -> merger */}
              {COMPOSED_TOPO.retrieval.map((r, i) => (
                <g key={`cm-${i}`}>
                  <line
                    x1={r.x + 50}
                    y1={r.y}
                    x2={COMPOSED_TOPO.merger.x - 40}
                    y2={COMPOSED_TOPO.merger.y}
                    stroke={SOFT.cyan}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </g>
              ))}
              {/* Stage 5: merger -> answer (chain) */}
              <line
                x1={COMPOSED_TOPO.merger.x + 40}
                y1={COMPOSED_TOPO.merger.y}
                x2={COMPOSED_TOPO.answer.x - 50}
                y2={COMPOSED_TOPO.answer.y}
                stroke={SOFT.cyan}
                strokeWidth="1.5"
              />
              <polygon
                points={`${COMPOSED_TOPO.answer.x - 50},${COMPOSED_TOPO.answer.y} ${COMPOSED_TOPO.answer.x - 56},${COMPOSED_TOPO.answer.y - 4} ${COMPOSED_TOPO.answer.x - 56},${COMPOSED_TOPO.answer.y + 4}`}
                fill={SOFT.cyan}
              />

              {/* Input */}
              <rect
                x={COMPOSED_TOPO.input.x - 34}
                y={COMPOSED_TOPO.input.y - 16}
                width={68}
                height={32}
                rx={6}
                fill={`${C.cyan}24`}
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <text
                x={COMPOSED_TOPO.input.x}
                y={COMPOSED_TOPO.input.y + 4}
                fill={SOFT.cyan}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                {COMPOSED_TOPO.input.label}
              </text>
              {/* Classifier */}
              <rect
                x={COMPOSED_TOPO.classifier.x - 50}
                y={COMPOSED_TOPO.classifier.y - 18}
                width={100}
                height={36}
                rx={6}
                fill={`${C.cyan}28`}
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <text
                x={COMPOSED_TOPO.classifier.x}
                y={COMPOSED_TOPO.classifier.y + 4}
                fill={C.cyan}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                {COMPOSED_TOPO.classifier.label}
              </text>
              {/* Branches */}
              {COMPOSED_TOPO.branches.map((b, i) => (
                <g key={b.label}>
                  <rect
                    x={b.x - 50}
                    y={b.y - 16}
                    width={100}
                    height={32}
                    rx={6}
                    fill={i === 1 ? `${C.cyan}30` : `${C.cyan}1a`}
                    stroke={C.cyan}
                    strokeWidth={i === 1 ? "1.5" : "1.2"}
                  />
                  <text
                    x={b.x}
                    y={b.y + 4}
                    fill={SOFT.cyan}
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {b.label}
                  </text>
                </g>
              ))}
              {/* Retrieval workers */}
              {COMPOSED_TOPO.retrieval.map((r) => (
                <g key={r.label}>
                  <rect
                    x={r.x - 50}
                    y={r.y - 14}
                    width={100}
                    height={28}
                    rx={5}
                    fill={`${C.cyan}1a`}
                    stroke={C.cyan}
                    strokeWidth="1.2"
                  />
                  <text
                    x={r.x}
                    y={r.y + 4}
                    fill={SOFT.cyan}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {r.label}
                  </text>
                </g>
              ))}
              {/* Merger */}
              <rect
                x={COMPOSED_TOPO.merger.x - 40}
                y={COMPOSED_TOPO.merger.y - 18}
                width={80}
                height={36}
                rx={6}
                fill={`${C.cyan}28`}
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <text
                x={COMPOSED_TOPO.merger.x}
                y={COMPOSED_TOPO.merger.y + 4}
                fill={C.cyan}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                {COMPOSED_TOPO.merger.label}
              </text>
              {/* Answer */}
              <rect
                x={COMPOSED_TOPO.answer.x - 50}
                y={COMPOSED_TOPO.answer.y - 18}
                width={100}
                height={36}
                rx={6}
                fill={`${C.cyan}30`}
                stroke={C.cyan}
                strokeWidth="2"
              />
              <text
                x={COMPOSED_TOPO.answer.x}
                y={COMPOSED_TOPO.answer.y + 4}
                fill={C.cyan}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                {COMPOSED_TOPO.answer.label}
              </text>
            </svg>
          </div>

          <div style={{ ...tintedCard(C.cyan), padding: 12, marginTop: 12 }}>
            <T color={SOFT.cyan} center size={14}>
              One Pipeline, All Three Primitives Stacked.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Every primitive does one thing well. The real power comes from stacking them. You combine
            sequence, branch, and fan-out the same way you combine if, switch, and map in normal code.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Support Agent Workflow
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Here is the support ticket workflow we keep referencing, written out as the actual
            primitive stack. Notice how chaining, routing, and parallelization each show up at the
            level they fit.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <T color={SOFT.orange} center bold size={14}>
              Customer Support Workflow
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {SUPPORT_WORKFLOW_STEPS.map((s) => {
                const kindColor =
                  s.kind === "route" ? C.red : s.kind === "parallel" ? C.amber : C.yellow;
                const kindSoft =
                  s.kind === "route" ? SOFT.red : s.kind === "parallel" ? SOFT.amber : SOFT.yellow;
                return (
                  <div
                    key={s.n}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: 12,
                      alignItems: "center",
                      background: `${kindColor}06`,
                      border: `1px solid ${kindColor}24`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        background: `${kindColor}28`,
                        border: `1px solid ${kindColor}`,
                        borderRadius: 6,
                        padding: "4px 0",
                        textAlign: "center",
                      }}
                    >
                      <T color={kindColor} bold size={16}>
                        {s.n}
                      </T>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={pill(kindColor)}>{s.kind.toUpperCase()}</span>
                        <T color={kindColor} bold size={14}>
                          {s.label}
                        </T>
                      </div>
                      <T color={kindSoft} size={13} style={{ marginTop: 4 }}>
                        {s.detail}
                      </T>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...tintedCard(C.green), padding: 12, marginTop: 12 }}>
            <span style={pill(C.green)}>READING</span>
            <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
              Step 2 Routes. Step 3 Chains Three Tools. Step 4 Parallelizes search_kb. Each Branch
              Picks The Primitive That Fits Its Shape.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            This is a workflow, not an agent. Every step is wired in advance. The only LLM
            decision-making is inside the classifier in step 2. The model is a smart cell inside a
            graph you fully control.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Chapter 13.20 AgentLoop helpers
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
    act: "lookup_customer(email=\"ada@example.com\")",
    observe: "Got customer_id c-9924, Plan=Pro, Email Verified=False.",
  },
  {
    n: 2,
    reason: "Email Outdated, Update First Before Reset Lands In The Wrong Inbox.",
    act: "change_email(customer_id=\"c-9924\", new_email=\"ada+new@example.com\")",
    observe: "Email Updated, Verification Pending.",
  },
  {
    n: 3,
    reason: "Now Reset The Password.",
    act: "reset_password(customer_id=\"c-9924\")",
    observe: "Reset Email Sent To ada+new@example.com.",
  },
  {
    n: 4,
    reason: "Done. Summarize For The User.",
    act: "Emit Final Answer. No Tool Call.",
    observe: "TERMINATE. Loop Exits.",
  },
];

export const AgentLoop = (ctx) => {
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
            An agent is not a single call. It is a loop with exactly three beats: the model reasons,
            the runtime acts, the runtime observes. Then the model reasons again with the new
            observation glued to the history. Every agent system you have ever read about is some
            shape of this cycle.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 360 260"
              style={{ width: "100%", maxWidth: 440, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three node circular flow showing reason then act then observe cycle of the agent
                loop.
              </desc>

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
                  <text
                    x={n.x}
                    y={n.y - 4}
                    fill={C.orange}
                    fontSize="14"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 12}
                    fill={SOFT.orange}
                    fontSize="11"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {n.sub}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Reason reads the entire history so far. The model's next decision is always conditioned
            on every previous tool call and result, not just the original prompt.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Agent As State Machine
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Zoom in on a single iteration and the loop becomes a state machine. There are four
            primary states the agent moves through and three terminal states it eventually lands in.
            Drawing it this way makes the question "what happens next?" boring in the best way.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 600 320"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                State machine diagram with waiting reasoning acting observing primary states and
                done failed escalated terminal states.
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
                    <polygon
                      points={`${x2},92 ${x2 - 6},88 ${x2 - 6},96`}
                      fill={SOFT.yellow}
                    />
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
                  <text
                    x={s.x + 50}
                    y={88}
                    fill={C.yellow}
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {s.label}
                  </text>
                  <text
                    x={s.x + 50}
                    y={104}
                    fill={SOFT.yellow}
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {s.note}
                  </text>
                </g>
              ))}

              {/* Vertical separators down to terminal row */}
              <text
                x={300}
                y={170}
                fill={SOFT.yellow}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
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
                    <polygon
                      points={`${t.x + 50},232 ${t.x + 46},226 ${t.x + 54},226`}
                      fill={softVal}
                    />
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
                    <text
                      x={t.x + 50}
                      y={250}
                      fill={colorVal}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {t.label}
                    </text>
                    <text
                      x={t.x + 50}
                      y={266}
                      fill={softVal}
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {t.note}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.yellow), padding: 12, marginTop: 12 }}>
            <T color={SOFT.yellow} center size={14}>
              Primary States Loop. Terminal States End The Run. Every Iteration Checks Whether It
              Should Cross The Bottom Boundary.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            DONE is the happy path: the model emitted a final answer. FAILED is an unrecoverable
            error (tool throw, schema break). ESCALATED is the safety net when the agent runs too
            long or spends too much.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Check After Each Beat
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Every iteration the runtime asks: should we keep looping? Without this guardrail an
            agent can spin forever on a tool that keeps almost-working. The check happens after
            OBSERVE and before the next REASON.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 500 320"
              style={{ width: "100%", maxWidth: 560, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three node cycle of reason act observe with a diamond decision node labeled
                terminate between observe and reason, branching to done escalate or abort.
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
              <polygon
                points="370,100 410,140 370,180 330,140"
                fill={`${C.red}28`}
                stroke={C.red}
                strokeWidth="2"
              />
              <text
                x={370}
                y={138}
                fill={C.red}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
              >
                Terminate?
              </text>
              <text
                x={370}
                y={154}
                fill={SOFT.red}
                fontSize="10"
                fontWeight="500"
                textAnchor="middle"
              >
                Each Iter
              </text>

              {/* Three outgoing branches from the diamond */}
              {/* Branch 1: top - DONE (green) */}
              <line x1={400} y1={114} x2={450} y2={70} stroke={SOFT.green} strokeWidth="1.5" />
              <polygon
                points={`450,70 444,72 446,78`}
                fill={SOFT.green}
              />
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
              <text
                x={455}
                y={88}
                fill={C.green}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                DONE
              </text>
              <text
                x={400}
                y={115}
                fill={SOFT.red}
                fontSize="9"
                fontWeight="500"
                textAnchor="start"
              >
                Final Answer?
              </text>

              {/* Branch 2: middle - ESCALATE (amber) */}
              <line x1={410} y1={140} x2={425} y2={140} stroke={SOFT.amber} strokeWidth="1.5" />
              <polygon
                points={`425,140 419,136 419,144`}
                fill={SOFT.amber}
              />
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
              <text
                x={459}
                y={144}
                fill={C.amber}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                ESCALATE
              </text>
              <text
                x={385}
                y={170}
                fill={SOFT.amber}
                fontSize="9"
                fontWeight="500"
                textAnchor="start"
              >
                Max Iter Hit?
              </text>

              {/* Branch 3: bottom - ABORT (red) */}
              <line x1={400} y1={166} x2={450} y2={210} stroke={SOFT.red} strokeWidth="1.5" />
              <polygon
                points={`450,210 444,206 446,213`}
                fill={SOFT.red}
              />
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
              <text
                x={455}
                y={202}
                fill={C.red}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                ABORT
              </text>
              <text
                x={395}
                y={190}
                fill={SOFT.red}
                fontSize="9"
                fontWeight="500"
                textAnchor="start"
              >
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
              <text
                x={250}
                y={264}
                fill={SOFT.red}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
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
              We Formalize Each Condition In Chapter 13.23 (Loop Termination).
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            The termination check is cheap (no model call) and happens on every iteration. It is the
            difference between a system you can run in production and a runaway model that bills
            your card flat.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            What Each Beat Costs
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            One iteration is one full lap around the cycle. Some beats cost money, some cost time,
            some are basically free. Knowing where the cost lives tells you what to optimize and how
            to budget per ticket.
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
            Reasoning context grows every iteration because the full history is replayed. By
            iteration 8 you might be paying for 40k tokens of context per call. This is why long
            agent runs get expensive fast, even when each individual call looks small.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Loop Trace: Ticket T2
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T2: "I forgot my password and my email also changed." Two problems, order
            matters. Watch the agent loop discover the order through reasoning, not because we
            hard-coded the steps. Each iteration is one full lap of reason / act / observe.
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
                    <span style={{ ...pill(C.orange), minWidth: 70, textAlign: "center" }}>
                      REASON
                    </span>
                    <T color={SOFT.orange} size={14}>
                      {it.reason}
                    </T>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...pill(C.yellow), minWidth: 70, textAlign: "center" }}>
                      ACT
                    </span>
                    <T
                      color={SOFT.yellow}
                      size={13}
                      style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {it.act}
                    </T>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...pill(C.green), minWidth: 70, textAlign: "center" }}>
                      OBSERVE
                    </span>
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
              4 Iterations. 3 Tool Calls. 1 Final Answer. Loop Terminates Cleanly Because The Model
              Emitted A Final Response Instead Of A Tool Call.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            You never told the agent "update email before reset". It worked that out in iteration 2
            from the observation in iteration 1. That step ordering is the value of the loop: the
            model adapts to what it just learned.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When You Need The Loop
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Not every task needs a loop. A single tool call is cheaper, faster, and easier to debug.
            Save the loop for tasks where one call genuinely cannot finish the job.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Card 1: Single call */}
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>SINGLE CALL</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 8 }}>
                One Tool, One Response, Done
              </T>
              <T color={SOFT.yellow} center size={14} style={{ marginTop: 8 }}>
                Single Tool Call: One Tool, One Response, Done. Example: "What Is The Weather In
                Tokyo?" -&gt; get_weather("Tokyo") -&gt; Return The Result. No Adaptation Needed.
              </T>
            </div>

            {/* Card 2: Loop */}
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <span style={pill(C.cyan)}>LOOP</span>
              <T color={C.cyan} bold center size={15} style={{ marginTop: 8 }}>
                Multiple Iterations, Model Adapts
              </T>
              <T color={SOFT.cyan} center size={14} style={{ marginTop: 8 }}>
                Loop: Multiple Iterations, Model Adapts Based On Intermediate Results. Example: T2
                Above. Iter 1's Observation Changes What Iter 2 Decides To Do.
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
            That dependency is the whole reason the loop exists. The first tool's output reshapes
            what the model knows, and the model must re-reason before picking the second tool. No
            loop, no adaptation, no agent.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

// Four-cycle ReAct trace for Ticket T2 (reset password + email changed).
// Each cycle has Thought, Action, Observation rows. The final cycle ends with
// the model's user-facing answer instead of another Action.
const REACT_T2_TRACE = [
  {
    n: 1,
    thought:
      "Customer wants reset, mentioned old email. Look them up first.",
    action: 'lookup_customer({"email": "alice@example.com"})',
    observation:
      '{ customer_id: "c-9924", tier: "pro", primary_email: "alice@example.com" }',
  },
  {
    n: 2,
    thought:
      "Email on record is outdated. Update it before the reset link goes to the wrong inbox.",
    action:
      'change_email({"customer_id": "c-9924", "new_email": "alice+new@example.com"})',
    observation:
      '{ ok: true, primary_email: "alice+new@example.com", verification: "pending" }',
  },
  {
    n: 3,
    thought:
      "Email is fixed. Trigger the password reset now so the link lands at the new address.",
    action: 'reset_password({"customer_id": "c-9924"})',
    observation:
      '{ ok: true, reset_link_sent_to: "alice+new@example.com" }',
  },
  {
    n: 4,
    thought:
      "All steps done. Write the user-facing reply and stop the loop.",
    action: null,
    answer:
      'Answer: "I updated your email to alice+new@example.com and sent a fresh reset link there. Click it within 30 minutes to set a new password."',
  },
];

// Three labeled rows for sub=0 (Thought / Action / Observation block stack).
const REACT_BLOCK_STACK = [
  {
    label: "Thought",
    color: "yellow",
    body: "What The Model Is Thinking About The Next Step.",
  },
  {
    label: "Action",
    color: "red",
    body: "Which Tool To Call And With Which Arguments.",
  },
  {
    label: "Observation",
    color: "amber",
    body: "What The Tool Returned, Fed Back Into The Next Thought.",
  },
];

// Reusable monospace artifact card.
const monoArtifact = (color, extra = {}) => ({
  ...tintedCard(color),
  padding: 14,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  textAlign: "center",
  ...extra,
});

export const ReActPattern = (ctx) => {
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
            Make The Reasoning Visible
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            ReAct stands for Reasoning + Acting. Instead of hiding the model's reasoning inside its
            head and only emitting a tool call, ReAct asks the model to write the thought out loud,
            then the action, then the observation, in that order, every iteration. The loop is the
            same; what changes is that each block is now visible structured output.
          </T>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REACT_BLOCK_STACK.map((row) => (
              <div
                key={row.label}
                style={{
                  ...tintedCard(C[row.color]),
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    background: `${C[row.color]}28`,
                    border: `1px solid ${C[row.color]}`,
                    borderRadius: 6,
                    padding: "8px 0",
                    textAlign: "center",
                  }}
                >
                  <T color={C[row.color]} bold size={14}>
                    {row.label}
                  </T>
                </div>
                <T color={SOFT[row.color]} size={14}>
                  {row.body}
                </T>
              </div>
            ))}
          </div>

          <div style={{ ...tintedCard(C.orange), padding: 12, marginTop: 12 }}>
            <span style={pill(C.orange)}>KEY IDEA</span>
            <T color={SOFT.orange} center size={14} style={{ marginTop: 8 }}>
              Thought Is INSIDE The Model's Response Now, Not Hidden.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            Same three beats as the agent loop. The difference is that the Thought is no longer an
            internal step the model performs silently. It becomes a written block in the response, so
            evaluators, debuggers, and downstream tools can read it directly.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Thought: Why The Next Action
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The Thought block answers one question: why is the next action the right next action?
            It names the plan in plain language before any tool fires. A good Thought references the
            user's request, the state so far, and the order of remaining steps.
          </T>

          <div
            style={{
              ...monoArtifact(C.yellow),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.yellow,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
{`Thought: The user asked to reset their password but mentioned the email changed.
I should first lookup_customer with the OLD email, then change_email to the NEW one,
then reset_password.`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.yellow), padding: 12, marginTop: 12 }}>
            <span style={pill(C.yellow)}>WHY IT MATTERS</span>
            <T color={SOFT.yellow} center size={14} style={{ marginTop: 8 }}>
              The Thought Makes The Plan Visible For Evals And Debugging.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            When a reset later goes wrong, you can open the trace and read the model's plan in
            English. You learn whether the failure was bad reasoning (wrong plan) or bad execution
            (right plan, wrong tool argument). That split is impossible without a written Thought.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Action: The Concrete Step
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            After the Thought, the model emits exactly one Action. It is a tool name plus an argument
            object that matches the tool's JSON schema. No second tool, no batching - one call, one
            step.
          </T>

          <div
            style={{
              ...monoArtifact(C.red),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.red,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
{`Action: lookup_customer({"email": "alice@example.com"})`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.red), padding: 12, marginTop: 12 }}>
            <span style={pill(C.red)}>RULE</span>
            <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
              One Action Per Iteration.
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Why only one? Because the next Thought must be free to react to whatever this Action
            returned. Batching two tool calls into one Action makes the model commit to a second
            step before it has seen the first result, which is exactly the trap the loop is supposed
            to avoid.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Observation: What Came Back
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            The Observation block holds the result the runtime received from the tool. The runtime
            writes this in - the model does not invent it. The Observation is appended to the
            conversation so the next Thought has the new ground truth to reason over.
          </T>

          <div
            style={{
              ...monoArtifact(C.amber),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.amber,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
{`Observation: { customer_id: "c-9924", tier: "pro", primary_email: "alice@example.com" }`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <span style={pill(C.amber)}>WHAT HAPPENS NEXT</span>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              The Model Reads This And Decides The Next Thought.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Notice the structure - keys like customer_id, tier, primary_email. The model is reading
            a JSON-shaped result, not a free-text paragraph. Keeping the Observation strictly
            structured is what lets the next Thought pull out specific fields like c-9924 instead of
            paraphrasing them.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            ReAct Trace: Ticket T2
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Same ticket T2 from the agent loop chapter, now written out in full ReAct format. Read
            top to bottom: Thought - Action - Observation, repeat. Four cycles, then the model
            decides the loop is done and writes the final answer instead of a fifth Action.
          </T>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 16,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              ReAct Trace - Ticket T2
            </T>
            <pre
              style={{
                margin: "12px 0 0 0",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.cyan,
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
{REACT_T2_TRACE.map((c) => {
  const header = `# Cycle ${c.n}`;
  const t = `Thought: ${c.thought}`;
  const a = c.action ? `Action: ${c.action}` : null;
  const o = c.observation ? `Observation: ${c.observation}` : null;
  const ans = c.answer ? c.answer : null;
  return [header, t, a, o, ans].filter(Boolean).join("\n");
}).join("\n\n")}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.cyan), padding: 12, marginTop: 12 }}>
            <span style={pill(C.cyan)}>OUTCOME</span>
            <T color={SOFT.cyan} center size={14} style={{ marginTop: 8 }}>
              4 Cycles. 3 Tool Calls. Cycle 4 Ends With An Answer Instead Of An Action, So The Loop
              Stops.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The trace reads almost like a transcript of someone thinking aloud while doing the
            work. That is the point - a human reviewer can audit every decision, and a downstream
            evaluator can score the Thoughts independently from whether the final answer was right.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When To Force ReAct
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            ReAct is not free. Each Thought costs tokens and slows the response. Modern tool-use
            APIs already produce structured tool_use blocks without forcing the reasoning to be
            written out. Use ReAct when you specifically need the reasoning surface.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                ...tintedCard(C.red),
                padding: 14,
                borderLeft: `4px solid ${SOFT.red}`,
              }}
            >
              <span style={pill(C.red)}>PLAIN TOOL-USE</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Reasoning Stays In The Model's Head
              </T>
              <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
                Model Emits tool_use Blocks. Reasoning In Model's Head. Invisible To User /
                Observability.
              </T>
            </div>

            <div
              style={{
                ...tintedCard(C.green),
                padding: 14,
                borderLeft: `4px solid ${SOFT.green}`,
              }}
            >
              <span style={pill(C.green)}>REACT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                Reasoning Written Out As Text
              </T>
              <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
                Same Loop, But Model Required To Emit Thought + Action Explicitly.
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
            <span style={pill(C.orange)}>WHEN TO USE REACT</span>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                textAlign: "left",
              }}
            >
              <T color={SOFT.orange} size={14}>
                - When You Need To Audit Reasoning.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Need To Debug Failures.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Train A Smaller Model On The Traces.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Need To Build Trust With The User.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Once the trace is written down, it becomes a teaching signal. You can fine-tune a smaller
            model on big-model traces, you can show the Thoughts in a UI to make the agent feel
            transparent, and you can write evals that score the plan separately from the final
            answer.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

export const PlanExecuteReflect = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Plan-Execute + Reflection
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const LoopTermination = () => {
  return (
    <div>
      <Box color={C.orange}>
        <T color={C.orange} bold center size={22}>
          Loop Termination
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
