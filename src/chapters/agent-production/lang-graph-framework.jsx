import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const LANGGRAPH_NODES = [
  { id: "classify", label: "Classify", x: 110, y: 60 },
  { id: "lookup", label: "Lookup", x: 280, y: 60 },
  { id: "refund", label: "Refund", x: 450, y: 60 },
  { id: "respond", label: "Respond", x: 620, y: 60 },
];

const LANGGRAPH_FIT_ROWS = [
  {
    label: "You Can Describe The Flow As A Directed Graph",
    why: "Nodes Are Steps, Edges Are Transitions, State Is The Payload.",
  },
  {
    label: "State Needs To Survive Across LLM / Tool Calls",
    why: "Working Memory Belongs In One Object That Threads Through Every Node.",
  },
  {
    label: "You Want Visualizable, Debuggable Flow Control",
    why: "The Graph Renders. You Can Point At The Failing Edge.",
  },
  {
    label: "You Can Pay A Small Abstraction Tax For Structure",
    why: "A Few Extra Lines Of Setup In Exchange For Predictable Runs.",
  },
];

export default function LangGraphFramework(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Agents As Stateful Graphs
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            LangGraph treats an agent as a state machine on top of a graph. Each node is a step (classify, lookup,
            refund, respond). Each edge is a transition. A shared state object threads through the graph and every node
            reads and writes it.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 200" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                LangGraph state machine for a customer-support agent. Four nodes (Classify, Lookup, Refund, Respond)
                connected by directed edges. A shared state object flows along every edge: each node reads it and writes
                it.
              </desc>
              <text x={360} y={22} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                Customer-Support Agent As A Graph
              </text>
              {/* edges */}
              {LANGGRAPH_NODES.slice(0, -1).map((n, i) => {
                const next = LANGGRAPH_NODES[i + 1];
                return (
                  <g key={`edge-${n.id}`}>
                    <line
                      x1={n.x + 50}
                      y1={n.y}
                      x2={next.x - 50}
                      y2={next.y}
                      stroke={C.teal}
                      strokeWidth={1.6}
                      markerEnd="url(#lg-arrow)"
                    />
                  </g>
                );
              })}
              <defs>
                <marker
                  id="lg-arrow"
                  viewBox="0 0 10 10"
                  refX={8}
                  refY={5}
                  markerWidth={8}
                  markerHeight={8}
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={C.teal} />
                </marker>
              </defs>
              {/* nodes */}
              {LANGGRAPH_NODES.map((n) => (
                <g key={n.id}>
                  <rect
                    x={n.x - 50}
                    y={n.y - 22}
                    width={100}
                    height={44}
                    rx={8}
                    fill={`${C.teal}18`}
                    stroke={C.teal}
                    strokeWidth={1.4}
                  />
                  <text x={n.x} y={n.y + 5} fill={SOFT.teal} fontSize="14" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                </g>
              ))}
              {/* state ribbon */}
              <rect
                x={60}
                y={130}
                width={600}
                height={48}
                rx={8}
                fill={`${C.cyan}10`}
                stroke={`${C.cyan}40`}
                strokeWidth={1.2}
                strokeDasharray="6 4"
              />
              <text x={360} y={150} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Shared State Object
              </text>
              <text x={360} y={170} fill={SOFT.cyan} fontSize="12" textAnchor="middle">
                {"{ ticket, customer, intent, lookup_result, refund_id, resolution }"}
              </text>
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            The graph is the program. The state is the variables. The runtime walks edges for you. This is the LangGraph
            mental model.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Three Primitives
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            LangGraph exposes three primitives: add_node registers a step function, add_edge wires steps together
            (optionally with a condition), and a state schema declares what every node can read and write.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center size={13} style={{ marginBottom: 8 }}>
              LangGraph Pattern (Shape)
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                fontSize: 14,
                color: SOFT.cyan,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {`graph.add_node("classify", classify_fn)
graph.add_node("billing_handler", billing_fn)
graph.add_node("respond", respond_fn)

graph.add_edge("classify", "billing_handler", condition=is_billing)
graph.add_edge("billing_handler", "respond")

state = { ticket: ..., customer: ..., resolution: ... }`}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            add_node registers a Python function. add_edge wires it. The condition argument on the edge picks the next
            node from state. The state object is the only thing passed between nodes.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Branching Based On State
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Conditional edges are the routing primitive. After classify writes state.intent, conditional edges fork into
            billing_handler, troubleshooting_handler, or escalation_handler. The router function reads state.intent and
            returns the next node name.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 260" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Conditional edges from the classify node. After classify writes state.intent, the router branches into
                billing_handler when intent is billing, troubleshooting_handler when intent is troubleshooting, or
                escalation_handler when intent is escalation.
              </desc>
              {/* classify node */}
              <rect
                x={310}
                y={20}
                width={100}
                height={44}
                rx={8}
                fill={`${C.purple}18`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              <text x={360} y={47} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Classify
              </text>
              {/* branch labels on edges */}
              <text x={180} y={108} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Intent = "Billing"
              </text>
              <text x={360} y={108} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Intent = "Troubleshooting"
              </text>
              <text x={560} y={108} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Intent = "Escalation"
              </text>
              {/* edges */}
              <line
                x1={345}
                y1={64}
                x2={180}
                y2={140}
                stroke={C.purple}
                strokeWidth={1.4}
                markerEnd="url(#lg-arrow-purple)"
              />
              <line
                x1={360}
                y1={64}
                x2={360}
                y2={140}
                stroke={C.purple}
                strokeWidth={1.4}
                markerEnd="url(#lg-arrow-purple)"
              />
              <line
                x1={375}
                y1={64}
                x2={540}
                y2={140}
                stroke={C.purple}
                strokeWidth={1.4}
                markerEnd="url(#lg-arrow-purple)"
              />
              <defs>
                <marker
                  id="lg-arrow-purple"
                  viewBox="0 0 10 10"
                  refX={8}
                  refY={5}
                  markerWidth={8}
                  markerHeight={8}
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={C.purple} />
                </marker>
              </defs>
              {/* branch nodes */}
              <rect
                x={96}
                y={150}
                width={168}
                height={50}
                rx={8}
                fill={`${C.purple}18`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              <text x={180} y={175} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Billing_Handler
              </text>
              <text x={180} y={192} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Refund, Invoice Tools
              </text>
              <rect
                x={276}
                y={150}
                width={168}
                height={50}
                rx={8}
                fill={`${C.purple}18`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              <text x={360} y={175} fill={SOFT.purple} fontSize="12" fontWeight="700" textAnchor="middle">
                Troubleshooting_Handler
              </text>
              <text x={360} y={192} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Knowledge-Base Tools
              </text>
              <rect
                x={456}
                y={150}
                width={168}
                height={50}
                rx={8}
                fill={`${C.purple}18`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              <text x={540} y={175} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Escalation_Handler
              </text>
              <text x={540} y={192} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Hand Off To Human
              </text>
              {/* router pill */}
              <rect
                x={268}
                y={220}
                width={184}
                height={28}
                rx={14}
                fill={`${C.cyan}18`}
                stroke={C.cyan}
                strokeWidth={1.2}
              />
              <text x={360} y={239} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Router Reads State.Intent
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            The conditional edge replaces a switch statement. Routing logic lives on the edge, not buried inside the
            next node. The graph stays readable.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Persistent State Between Calls
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            LangGraph checkpoints state at every node boundary by default. If a tool call is long-running, async, or
            needs human approval, the graph pauses, persists state, and resumes from the checkpoint when the result
            arrives. No re-running earlier nodes. No rebuilt context.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 720 220" style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}>
              <desc>
                Checkpoint and resume sequence. Step 1: agent runs to a long-running tool call. Step 2: state is
                checkpointed and the graph pauses. Step 3: when the tool result arrives async, the graph resumes from
                the checkpoint.
              </desc>
              <text x={360} y={22} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Checkpoint And Resume
              </text>
              {/* Step 1 */}
              <rect
                x={30}
                y={50}
                width={200}
                height={120}
                rx={10}
                fill={`${C.green}10`}
                stroke={C.green}
                strokeWidth={1.4}
              />
              <text x={130} y={74} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Step 1
              </text>
              <text x={130} y={94} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Agent Runs Three Nodes
              </text>
              <text x={130} y={114} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Hits A Long-Running Tool
              </text>
              <text x={130} y={134} fill={SOFT.green} fontSize="12" textAnchor="middle">
                (Async Approval Request)
              </text>
              <text x={130} y={156} fill={C.green} fontSize="12" fontWeight="700" textAnchor="middle">
                Working Memory Built Up
              </text>
              {/* Step 2 */}
              <rect
                x={260}
                y={50}
                width={200}
                height={120}
                rx={10}
                fill={`${C.cyan}10`}
                stroke={C.cyan}
                strokeWidth={1.4}
              />
              <text x={360} y={74} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Step 2
              </text>
              <text x={360} y={94} fill={SOFT.cyan} fontSize="12" textAnchor="middle">
                Checkpoint State
              </text>
              <text x={360} y={114} fill={SOFT.cyan} fontSize="12" textAnchor="middle">
                Persist To Store
              </text>
              <text x={360} y={134} fill={SOFT.cyan} fontSize="12" textAnchor="middle">
                Graph Pauses
              </text>
              <text x={360} y={156} fill={C.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Wait For Result
              </text>
              {/* Step 3 */}
              <rect
                x={490}
                y={50}
                width={200}
                height={120}
                rx={10}
                fill={`${C.purple}10`}
                stroke={C.purple}
                strokeWidth={1.4}
              />
              <text x={590} y={74} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Step 3
              </text>
              <text x={590} y={94} fill={SOFT.purple} fontSize="12" textAnchor="middle">
                Tool Result Arrives
              </text>
              <text x={590} y={114} fill={SOFT.purple} fontSize="12" textAnchor="middle">
                Hours Or Days Later
              </text>
              <text x={590} y={134} fill={SOFT.purple} fontSize="12" textAnchor="middle">
                Graph Resumes
              </text>
              <text x={590} y={156} fill={C.purple} fontSize="12" fontWeight="700" textAnchor="middle">
                From The Checkpoint
              </text>
              {/* arrows */}
              <line
                x1={230}
                y1={110}
                x2={260}
                y2={110}
                stroke={SOFT.green}
                strokeWidth={1.6}
                markerEnd="url(#lg-arrow-green)"
              />
              <line
                x1={460}
                y1={110}
                x2={490}
                y2={110}
                stroke={SOFT.cyan}
                strokeWidth={1.6}
                markerEnd="url(#lg-arrow-green)"
              />
              <defs>
                <marker
                  id="lg-arrow-green"
                  viewBox="0 0 10 10"
                  refX={8}
                  refY={5}
                  markerWidth={8}
                  markerHeight={8}
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={SOFT.green} />
                </marker>
              </defs>
              {/* footer */}
              <text x={360} y={200} fill={SOFT.green} fontSize="12" textAnchor="middle">
                Crucial For Async, Long-Running, And Human-In-The-Loop Workflows
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            Without checkpoints, async tool calls force you to either block the agent (kills throughput) or rebuild the
            conversation from scratch (loses context). Checkpointing makes long-running flows feel like one continuous
            run.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Use LangGraph When...
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            LangGraph fits when your agent looks like a directed graph and state is the star of the show. It is overkill
            for simple one-shot tool use - just call the API directly.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Signal</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Why It Maps To LangGraph</div>
              {LANGGRAPH_FIT_ROWS.map((row, i) => (
                <Fragment key={row.label}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.why}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <T color={SOFT.amber} center size={14} bold>
              Avoid LangGraph When
            </T>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              Simple one-shot tool use. A single classify-and-respond call. You just need to call the API directly
              without graph machinery.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            The cost of LangGraph is the structure tax: a few extra lines of node and edge setup. The payoff is
            visualizable, checkpointable, debuggable agent flows. Worth it when your agent has more than two steps.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
