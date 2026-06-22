import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

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
  input: { x: 30, y: 80, label: "In" },
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
  input: { x: 56, y: 130, label: "Ticket" },
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
  input: { x: 56, y: 100, label: "Query" },
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
  input: { x: 44, y: 152, label: "Ticket" },
  classifier: { x: 152, y: 152, label: "Classifier" },
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
    kind: "Chain",
  },
  {
    n: 2,
    label: "Classifier (Intent Classification)",
    detail: "Routes To Billing / Troubleshooting / Escalation.",
    kind: "Route",
  },
  {
    n: 3,
    label: "Billing Branch",
    detail: "Chain lookup_customer -> lookup_subscription -> Respond.",
    kind: "Chain",
  },
  {
    n: 4,
    label: "Troubleshooting Branch",
    detail: "Parallel (search_kb For Top-3 Hypotheses) -> Chain To Response.",
    kind: "Parallel",
  },
  {
    n: 5,
    label: "Escalation Branch",
    detail: "escalate_human Directly.",
    kind: "Chain",
  },
];

export default function WorkflowPrimitives(ctx) {
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
            Workflows are built from three composable primitives. Chaining wires step A's output into step B. Routing
            classifies the input and picks one branch. Parallelization fans out N workers and merges their results.
            Every production workflow stacks these three.
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
                  Three node chain showing step A flowing to step B flowing to step C as sequential arrows in a
                  horizontal pipeline.
                </desc>
                {CHAIN_MINI_NODES.slice(0, -1).map((n, i) => {
                  const next = CHAIN_MINI_NODES[i + 1];
                  return (
                    <g key={`ce-${i}`}>
                      <line x1={n.x + 32} y1={60} x2={next.x} y2={60} stroke={SOFT.yellow} strokeWidth="1.5" />
                      <polygon points={`${next.x},60 ${next.x - 6},56 ${next.x - 6},64`} fill={SOFT.yellow} />
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
                    <text x={n.x + 16} y={64} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
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
                  Routing topology showing an input flowing to a classifier node which then branches out to three
                  different downstream paths based on intent.
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
                    <text x={b.x} y={b.y + 4} fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="middle">
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
                  Parallelization topology showing an input fanning out to three concurrent worker nodes that all feed
                  into a single aggregator node.
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
                    <text x={w.x} y={w.y + 4} fill={SOFT.amber} fontSize="11" fontWeight="700" textAnchor="middle">
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
            These are the lego bricks. Chaining is a sequence. Routing is a fork. Parallelization is a fan-out plus
            merge. Real workflows stack them in layers.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Step A's Output Is Step B's Input
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Chaining is the simplest primitive: the structured output of one LLM call becomes the structured input of
            the next. The glue is JSON. Step A returns a typed object, your code reads it, and feeds the next step.
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
                Three node chain with JSON output labels above each arrow showing how the structured output of one step
                becomes the structured input of the next step in a billing ticket example.
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
                    <polygon points={`${x2},120 ${x2 - 6},116 ${x2 - 6},124`} fill={SOFT.yellow} />
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
                    <text x={labelX} y={82} fill={SOFT.yellow} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      {labels[i].line1}
                    </text>
                    <text x={labelX} y={96} fill={SOFT.yellow} fontSize="11" fontFamily="monospace" textAnchor="middle">
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
                  <text x={n.x + 60} y={128} fill={C.yellow} fontSize="14" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  <text x={n.x + 60} y={166} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
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
            Step A Output: {'{ "category": "billing", "confidence": 0.92 }'}
            <br />
            Step B Input: {'{ "category": "billing", "ticket": "Can\'t bill my card." }'}
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            Because each step returns a typed object (the JSON schema from{" "}
            <ChapterLink to="25.2">chapter 25.2</ChapterLink>), the next step can read fields like ticket.category by
            name. Chaining is just normal function composition with LLM calls as the functions.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Route By Intent
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Routing classifies the input and picks one branch. The classifier is itself an LLM call that returns a typed
            label. Your code then dispatches to the matching handler. Only the chosen branch runs.
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
                Routing diagram showing a ticket flowing to an intent classifier that branches to billing, product,
                troubleshooting, and chitchat handler boxes based on classified intent.
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
                  <text x={b.x} y={b.y + 5} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                    {b.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{ ...tintedCard(C.purple), padding: 12, marginTop: 12 }}>
            <T color={SOFT.purple} center size={14}>
              The Classifier Is Itself An LLM Call With Few-Shot Examples (See Section 24.3).
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            One classification call replaces a hand-written if/else tree. The model labels the input, your code
            dispatches the matching branch handler. Adding a new branch is one new few-shot example plus one new
            handler.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Run N In Parallel, Then Merge
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Parallelization runs N independent calls concurrently and aggregates the results. The total latency is the
            time of the slowest worker, not the sum. This is the cheapest way to cut wait time on independent sub-tasks.
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
                Fan-out diagram showing one query branching to three concurrent workers running in parallel then merging
                into a single aggregator node with timing bars showing that total latency equals the slowest worker
                time.
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
                  <text x={w.x} y={w.y} fill={SOFT.amber} fontSize="13" fontWeight="700" textAnchor="middle">
                    {w.label}
                  </text>
                  <text x={w.x} y={w.y + 14} fill={SOFT.amber} fontSize="11" textAnchor="middle">
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
            If three retrieval calls each take 150-210ms, running them in series costs ~540ms. Running them concurrently
            costs ~210ms, the slowest one. The aggregator then merges all results into one structured object.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Real Workflows Stack Primitives
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Production workflows compose all three. A typical pipeline is: chain into a classifier, route to one of
            several branches, parallelize the heavy retrieval inside one branch, then chain the merged result into a
            final answer step.
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
                Composed workflow topology stacking all three primitives where a ticket chains into a classifier that
                routes to one of three branches, one branch fans out to three parallel retrieval calls that merge before
                chaining into a final answer node.
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
                  <polygon
                    points={`${r.x - 50},${r.y} ${r.x - 56},${r.y - 4} ${r.x - 56},${r.y + 4}`}
                    fill={SOFT.cyan}
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
              <polygon
                points={`${COMPOSED_TOPO.merger.x - 40},${COMPOSED_TOPO.merger.y} ${COMPOSED_TOPO.merger.x - 46},${COMPOSED_TOPO.merger.y - 4} ${COMPOSED_TOPO.merger.x - 46},${COMPOSED_TOPO.merger.y + 4}`}
                fill={SOFT.cyan}
              />
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
                  <text x={b.x} y={b.y + 4} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
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
                  <text x={r.x} y={r.y + 4} fill={SOFT.cyan} fontSize="11" fontWeight="700" textAnchor="middle">
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
            Every primitive does one thing well. The real power comes from stacking them. You combine sequence, branch,
            and fan-out the same way you combine if, switch, and map in normal code.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Support Agent Workflow
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Here is the support ticket workflow we keep referencing, written out as the actual primitive stack. Notice
            how chaining, routing, and parallelization each show up at the level they fit.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <T color={SOFT.orange} center bold size={14}>
              Customer Support Workflow
            </T>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {SUPPORT_WORKFLOW_STEPS.map((s) => {
                const kindColor = s.kind === "Route" ? C.red : s.kind === "Parallel" ? C.amber : C.yellow;
                const kindSoft = s.kind === "Route" ? SOFT.red : s.kind === "Parallel" ? SOFT.amber : SOFT.yellow;
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
              Step 2 Routes. Step 3 Chains Three Tools. Step 4 Parallelizes search_kb. Each Branch Picks The Primitive
              That Fits Its Shape.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            This is a workflow, not an agent. Every step is wired in advance. The only LLM decision-making is inside the
            classifier in step 2. The model is a smart cell inside a graph you fully control.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
