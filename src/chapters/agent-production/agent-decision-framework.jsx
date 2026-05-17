import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const DECISION_STACK = [
  {
    n: 1,
    label: "Approach",
    question: "Prompt / Tune / RAG / Agent?",
    chapters: "13.5",
    accent: "cyan",
  },
  {
    n: 2,
    label: "Loop Pattern",
    question: "Workflow / ReAct / Plan-Execute / Reflection?",
    chapters: "13.18 - 13.22",
    accent: "blue",
  },
  {
    n: 3,
    label: "Memory Layers",
    question: "Working + Which Long-Term?",
    chapters: "13.24 - 13.29",
    accent: "purple",
  },
  {
    n: 4,
    label: "Multi-Agent",
    question: "Single / Orchestrator / Supervisor / Hand-Off?",
    chapters: "13.30 - 13.34",
    accent: "indigo",
  },
  {
    n: 5,
    label: "Tools",
    question: "Which Tools? What Scope?",
    chapters: "13.7 - 13.11",
    accent: "green",
  },
  {
    n: 6,
    label: "Protocols",
    question: "MCP / A2A / Bespoke?",
    chapters: "13.12 - 13.17",
    accent: "teal",
  },
  {
    n: 7,
    label: "Eval",
    question: "Dimensions + Judge + Traces?",
    chapters: "13.37 - 13.41",
    accent: "amber",
  },
  {
    n: 8,
    label: "Production",
    question: "Observability + Cost + Guardrails + Injection + Security?",
    chapters: "13.42 - 13.47",
    accent: "orange",
  },
  {
    n: 9,
    label: "Framework",
    question: "LangGraph / CrewAI / Vendor SDK / Custom?",
    chapters: "13.48 - 13.51",
    accent: "red",
  },
];

const IT_LAYERS_123 = [
  {
    layer: "1. Approach",
    pick: "Agent",
    why: "Mutating Actions (Password Reset, Hardware Order) Need Tool Calls Plus A Loop. Pure Prompting Or RAG Cannot Take Actions.",
  },
  {
    layer: "2. Loop Pattern",
    pick: "Workflow With An Agent Step",
    why: "Most Tickets Are Deterministic (Classify, Route, Handle). The Handler Itself Is An Agent Loop With Tool Use. Pure ReAct Is Overkill.",
  },
  {
    layer: "3. Memory Layers",
    pick: "Working + Episodic + Semantic",
    why: "Working = Current Ticket. Episodic = Past Employee Tickets (90-Day Window). Semantic = Employee Profile (Department, Hardware History, Software Stack).",
  },
];

const IT_LAYERS_45 = [
  {
    layer: "4. Multi-Agent",
    pick: "Orchestrator-Worker",
    why: "Triage Classifier Routes To Specialist Handlers (Password / Software / Hardware). Hand-Off When A Handler Needs Another Specialist's Tools.",
  },
  {
    layer: "5. Tools + Capability Scope",
    pick: "8 Internal Tools, Scoped Per Handler",
    why: "Password Handler Gets Reset_Password And Audit Tools. Hardware Handler Gets Order_Hardware Bounded By $500 Cap. Capability Scope Is Per-Role.",
  },
];

const IT_LAYERS_67 = [
  {
    layer: "6. Protocols",
    pick: "MCP For SSO + Ticketing, No A2A",
    why: "MCP Servers Wrap SSO And The Ticketing System. The IT Team Can Swap Backends Without Touching The Agent. No A2A Because This Is A Single-Team Agent, Not A Cross-Org Mesh.",
  },
  {
    layer: "7. Eval Strategy",
    pick: "4-Axis Eval + LLM-As-Judge + Trace Evals",
    why: "Eval Axes: Correctness, Latency, Cost, Safety. LLM-As-Judge On Resolutions. Trace Evals On Every Refund Or Escalation Step. Eval Set: 50 Golden + 20 Adversarial + Growing Regression Set.",
  },
];

const IT_LAYERS_89 = [
  {
    layer: "8. Production Hardening",
    pick: "OTel + LangSmith + Prompt Cache + Guardrails + Injection Defense",
    why: "OTel + LangSmith For Observability. Prompt Cache On The Long System Prompt. Latency Target P95 < 5s. Hardware-Order Guardrail Enforces The $500 Cap. Input Layer Runs Prompt-Injection Defense Per 13.46.",
  },
  {
    layer: "9. Framework",
    pick: "LangGraph",
    why: "The Workflow-With-Agent-Step Shape Maps Cleanly To LangGraph Nodes And Edges. Conditional Edges Handle Routing. Checkpoints Cover Async Manager-Approval Steps For Hardware Orders.",
  },
];

const CLOSING_COMMITMENTS = [
  {
    word: "Decide",
    accent: "cyan",
    line: "Every Layer Above Has A Concrete Decision In Front Of You, Not A Fog.",
  },
  {
    word: "Diagnose",
    accent: "amber",
    line: "When The Agent Fails In Production, You Know Which Layer To Investigate.",
  },
  {
    word: "Defend",
    accent: "green",
    line: "In A Design Review, You Argue Your Choices From Mechanics, Not Feel.",
  },
];

export default function AgentDecisionFramework(ctx) {
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
            Every Choice Section 13 Taught You
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Designing a production agent is nine decisions, top to bottom. Strategy at the
            top (what approach? what loop?). Operations at the bottom (which framework?
            which observability stack?). Each layer is a chapter you have already worked
            through. The stack is the synthesis.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 720 510"
              style={{ width: "100%", maxWidth: 720, display: "block", margin: "0 auto" }}
            >
              <desc>
                Nine-layer agent decision stack. From top (strategy) to bottom (operations):
                Approach (13.5), Loop Pattern (13.18 to 13.22), Memory Layers (13.24 to 13.29),
                Multi-Agent (13.30 to 13.34), Tools (13.7 to 13.11), Protocols (13.12 to 13.17),
                Eval (13.37 to 13.41), Production (13.42 to 13.47), Framework (13.48 to 13.51).
                Each layer references its source chapters.
              </desc>
              <text x={360} y={22} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                The Full Decision Stack
              </text>
              <text x={50} y={42} fill={SOFT.teal} fontSize="11" textAnchor="start">
                Strategy
              </text>
              <text x={670} y={42} fill={SOFT.teal} fontSize="11" textAnchor="end">
                Top
              </text>
              {DECISION_STACK.map((layer, i) => {
                const accent = C[layer.accent];
                const soft = SOFT[layer.accent];
                const y = 56 + i * 48;
                return (
                  <g key={layer.label}>
                    <rect
                      x={60}
                      y={y}
                      width={600}
                      height={42}
                      rx={8}
                      fill={`${accent}12`}
                      stroke={accent}
                      strokeWidth={1.4}
                    />
                    <text x={80} y={y + 19} fill={accent} fontSize="13" fontWeight="700">
                      {layer.n}. {layer.label}
                    </text>
                    <text x={80} y={y + 35} fill={soft} fontSize="11">
                      {layer.question}
                    </text>
                    <text x={640} y={y + 27} fill={soft} fontSize="11" textAnchor="end" fontFamily="monospace">
                      {layer.chapters}
                    </text>
                  </g>
                );
              })}
              <text x={50} y={494} fill={SOFT.teal} fontSize="11" textAnchor="start">
                Operations
              </text>
              <text x={670} y={494} fill={SOFT.teal} fontSize="11" textAnchor="end">
                Bottom
              </text>
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Nine layers. Each chapter you completed answers one of them. Read the stack as
            a checklist: any agent that ships needs a concrete pick at every layer, with a
            reason that traces back to the chapter that taught it.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Design An Agent For A New Use Case
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The customer-support agent is behind us. Now apply the stack to a new use case
            you have not seen in this section.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 16, marginTop: 14 }}>
            <T color={C.cyan} center bold size={18}>
              Internal IT-Support Agent
            </T>
            <T color={SOFT.cyan} center size={14} style={{ marginTop: 10 }}>
              Use Case
            </T>
            <T color={SOFT.cyan} center size={14} style={{ marginTop: 4 }}>
              Serve A 500-Person Company. Handle Employee Tickets Across:
            </T>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
                marginTop: 12,
                fontSize: 14,
              }}
            >
              <div style={{ padding: "8px 10px", color: SOFT.cyan, textAlign: "center" }}>
                Password Resets
              </div>
              <div style={{ padding: "8px 10px", color: SOFT.cyan, textAlign: "center" }}>
                Software Install Requests
              </div>
              <div style={{ padding: "8px 10px", color: SOFT.cyan, textAlign: "center" }}>
                VPN Issues
              </div>
              <div style={{ padding: "8px 10px", color: SOFT.cyan, textAlign: "center" }}>
                Hardware Orders
              </div>
            </div>
            <T color={C.cyan} center size={14} bold style={{ marginTop: 14 }}>
              Constraints
            </T>
            <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
              Hardware Orders Over $500 Must Escalate To The IT Manager.
            </T>
            <T color={SOFT.cyan} center size={13} style={{ marginTop: 4 }}>
              Must Integrate With Internal SSO And The Ticketing System.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            This is a different shape than customer support: internal users, smaller
            blast radius, dollar threshold for escalation, integration with internal
            systems. The next sub-steps walk every decision layer for this case.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Pick Approach, Loop, Memory
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            The top three layers set the agent's shape. Approach picks the agent versus
            non-agent path. Loop pattern picks the runtime control flow. Memory layers
            pick what state survives across tickets.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr 2.2fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Layer</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Pick</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.purple }}>Why</div>
              {IT_LAYERS_123.map((row, i) => (
                <Fragment key={row.layer}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: C.purple,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                    }}
                  >
                    {row.layer}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: SOFT.purple,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                    }}
                  >
                    {row.pick}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.purple}22`,
                      color: SOFT.purple,
                      background: i % 2 === 0 ? `${C.purple}06` : "transparent",
                    }}
                  >
                    {row.why}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Approach is "agent" because the IT support work mutates state (resets, orders,
            installs). Loop is "workflow with an agent step" because most tickets are
            deterministic routes, and only the handler step is an agent. Memory is all
            three layers because employees have stable profiles and recurring patterns.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Pick Multi-Agent, Tools
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Multi-agent shape and tool inventory both flow from the work decomposition.
            Triage routes. Specialist handlers do the work. Capability scope keeps each
            specialist confined to its own toolkit.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr 2.2fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>Layer</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>Pick</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>Why</div>
              {IT_LAYERS_45.map((row, i) => (
                <Fragment key={row.layer}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: C.green,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.layer}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: SOFT.green,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.pick}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: SOFT.green,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.why}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            Orchestrator-Worker is the right multi-agent shape because the routes are
            well-defined and bounded. The capability scope per handler keeps the password
            agent from ever calling order_hardware - bounded blast radius even under
            jailbreak attempts.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Pick Protocols, Eval Strategy
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Protocols decide how the agent connects to the rest of the company's systems.
            Eval strategy decides how you know the agent works before it ships and stays
            working after.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr 2.4fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Layer</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Pick</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Why</div>
              {IT_LAYERS_67.map((row, i) => (
                <Fragment key={row.layer}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: C.amber,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.layer}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.pick}
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

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            MCP gives clean separation between agent and IT-system internals. The eval set
            sizes (50 golden + 20 adversarial) are small enough to ship this quarter and
            growable as production traffic exposes new failure modes.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Pick Production Hardening, Framework
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The last two layers turn the design into a shippable system. Production
            hardening picks the observability and safety stack. Framework picks the
            runtime that holds it all together.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 2.3fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.teal }}>Layer</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.teal }}>Pick</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.teal }}>Why</div>
              {IT_LAYERS_89.map((row, i) => (
                <Fragment key={row.layer}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.teal}22`,
                      color: C.teal,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.teal}06` : "transparent",
                    }}
                  >
                    {row.layer}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.teal}22`,
                      color: SOFT.teal,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.teal}06` : "transparent",
                    }}
                  >
                    {row.pick}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.teal}22`,
                      color: SOFT.teal,
                      background: i % 2 === 0 ? `${C.teal}06` : "transparent",
                    }}
                  >
                    {row.why}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            LangGraph wins here because the workflow-with-agent-step shape is exactly a
            graph: classify node, route node, handler node, escalation node, respond node.
            Conditional edges handle the routing. Checkpoints handle hardware-order
            manager-approval async waits.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            You Can Lead This Project Now
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Section 13 walked from the anatomy of a single LLM call to a complete
            production agent decision framework. What you have now is not opinions. It is
            three concrete capabilities:
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            {CLOSING_COMMITMENTS.map((c) => {
              const accent = C[c.accent];
              const soft = SOFT[c.accent];
              return (
                <div
                  key={c.word}
                  style={{ ...tintedCard(accent), padding: 16, textAlign: "center" }}
                >
                  <T color={accent} center bold size={20}>
                    {c.word}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 10 }}>
                    {c.line}
                  </T>
                </div>
              );
            })}
          </div>

          <div style={{ ...tintedCard(C.teal), padding: 16, marginTop: 16, textAlign: "center" }}>
            <T color={C.teal} center bold size={18}>
              Section 13 Done. The Production Agent Is Yours To Ship.
            </T>
            <T color={SOFT.teal} center size={14} style={{ marginTop: 8 }}>
              Every layer above traces back to a chapter you have worked through. The
              decision stack is the map. The chapters are the terrain. You can walk it.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
