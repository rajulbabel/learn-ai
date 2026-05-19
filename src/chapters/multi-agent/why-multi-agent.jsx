import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
const SPECIALIST_AGENTS = [
  {
    name: "Billing Specialist",
    color: "teal",
    tools: ["lookup_subscription", "process_refund"],
    prompt: "Handle Refunds, Invoices, Tier Changes.",
  },
  {
    name: "Troubleshooting Specialist",
    color: "cyan",
    tools: ["search_kb", "lookup_customer"],
    prompt: "Diagnose Errors, Outages, Sync Failures.",
  },
  {
    name: "Triage Router",
    color: "blue",
    tools: ["lookup_customer"],
    prompt: "Classify Each Ticket And Route To Specialist.",
  },
];

const MULTI_AGENT_ANTI_PATTERNS = [
  {
    name: "Single-Step Tasks",
    detail: "Just Call The Tool. Adding A Second Agent Doubles Latency For Zero Gain.",
  },
  {
    name: "Context Continuity Tasks",
    detail: "If The Same Context Carries Through Every Step, Hand-Off Loses Information.",
  },
  {
    name: "Latency-Critical Loops",
    detail: "Each Agent Adds 1-2 Seconds Of Reasoning. A 100ms SLA Loop Cannot Afford This.",
  },
  {
    name: "Small Dev Teams",
    detail: "Multi-Agent Failures (27.6) Are Hard To Debug; A 2-Person Team Will Drown.",
  },
];

export default function WhyMultiAgent(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Why One Agent Sometimes Isn&apos;t Enough
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            A single agent loaded with all customer-support roles - retrieve, classify, refund, troubleshoot, escalate -
            has a crowded system prompt. Each role pulls the prompt in a different direction. Performance ceiling
            appears.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 200" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Single agent loaded with five different jobs, labeled retrieve, classify, refund, troubleshoot, and
                escalate, visualizing the crowded role assignment that creates a performance ceiling for one agent.
              </desc>
              {/* Single big agent in center */}
              <rect
                x={210}
                y={70}
                width={140}
                height={60}
                rx={10}
                fill={`${C.green}22`}
                stroke={C.green}
                strokeWidth={2}
              />
              <text x={280} y={96} fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                One Agent
              </text>
              <text x={280} y={114} fill={SOFT.green} fontSize="11" textAnchor="middle">
                5 Jobs On One System Prompt
              </text>

              {/* 5 jobs around the agent */}
              {[
                { x: 60, y: 35, label: "Retrieve" },
                { x: 500, y: 35, label: "Classify" },
                { x: 30, y: 165, label: "Refund" },
                { x: 280, y: 175, label: "Troubleshoot" },
                { x: 530, y: 165, label: "Escalate" },
              ].map((j, i) => (
                <g key={`job-${i}`}>
                  <rect
                    x={j.x - 50}
                    y={j.y - 15}
                    width={100}
                    height={30}
                    rx={6}
                    fill={`${C.red}1a`}
                    stroke={C.red}
                    strokeWidth={1.4}
                  />
                  <text x={j.x} y={j.y + 5} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                    {j.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Each new role added to the system prompt costs precision on every other role. The ceiling is real: at some
            point, splitting roles into separate agents beats stuffing them into one.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Specialization: One Agent Per Role
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Replace the crowded single agent with 3 focused agents. Each has a tighter system prompt, a smaller tool
            set, a clearer goal. Each does its job better than a generalist would.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {SPECIALIST_AGENTS.map((a) => {
              const accent = C[a.color];
              const soft = SOFT[a.color];
              return (
                <div key={a.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>SPECIALIST</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {a.name}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    {a.prompt}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Tools: {a.tools.join(", ")}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Notice each specialist has 1-2 tools, not the full 8-tool inventory. Smaller surface = fewer wrong-tool
            errors. The triage router picks which specialist a ticket goes to.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Run Independent Tasks At The Same Time
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Some sub-tasks have no data dependencies. Run them on separate agents concurrently. The wall-clock cost is
            max(sub-task latency), not the sum.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 180" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Three independent sub-tasks lookup_customer, lookup_subscription, and search_kb running in parallel on
                three separate agents with wall-clock time equal to the slowest one rather than the sum of all three.
              </desc>
              {/* Top hub */}
              <rect
                x={230}
                y={20}
                width={100}
                height={36}
                rx={8}
                fill={`${C.cyan}24`}
                stroke={C.cyan}
                strokeWidth={2}
              />
              <text x={280} y={42} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Dispatcher
              </text>

              {/* 3 parallel agents below */}
              {[
                { x: 100, label: "Agent A", tool: "lookup_customer", t: "1.2s" },
                { x: 280, label: "Agent B", tool: "lookup_subscription", t: "1.4s" },
                { x: 460, label: "Agent C", tool: "search_kb", t: "1.6s" },
              ].map((a, i) => (
                <g key={`pa-${i}`}>
                  <line x1={280} y1={56} x2={a.x} y2={90} stroke={C.cyan} strokeWidth={1.5} />
                  <rect
                    x={a.x - 70}
                    y={90}
                    width={140}
                    height={50}
                    rx={8}
                    fill={`${C.cyan}1a`}
                    stroke={C.cyan}
                    strokeWidth={1.6}
                  />
                  <text x={a.x} y={108} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                    {a.label}
                  </text>
                  <text x={a.x} y={124} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                    {a.tool}
                  </text>
                  <text x={a.x} y={158} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                    {a.t}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Sequential = 1.2 + 1.4 + 1.6 = 4.2s. Parallel = max(1.2, 1.4, 1.6) = 1.6s. Almost 3x faster. The win
            compounds as you add more independent sub-tasks.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Planner vs Worker
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Some agents are good at decomposing tasks; others are good at executing single steps. Separating these roles
            produces a 2-layer setup where each agent only does its own job.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 200" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Two-layer planner and worker architecture: a planner agent at the top decomposes a task and dispatches
                sub-tasks to two worker agents at the bottom that each execute one sub-task and return results to the
                planner.
              </desc>
              {/* Planner top */}
              <rect
                x={210}
                y={20}
                width={140}
                height={50}
                rx={10}
                fill={`${C.purple}22`}
                stroke={C.purple}
                strokeWidth={2}
              />
              <text x={280} y={42} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Planner Agent
              </text>
              <text x={280} y={60} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Decomposes The Task
              </text>

              {/* 2 workers */}
              {[
                { x: 130, label: "Worker 1", role: "Lookup Customer" },
                { x: 430, label: "Worker 2", role: "Process Refund" },
              ].map((w, i) => (
                <g key={`wk-${i}`}>
                  <line x1={280} y1={70} x2={w.x} y2={120} stroke={C.blue} strokeWidth={1.6} />
                  <polygon points={`${w.x - 4},116 ${w.x + 4},116 ${w.x},124`} fill={C.blue} />
                  <rect
                    x={w.x - 70}
                    y={130}
                    width={140}
                    height={50}
                    rx={10}
                    fill={`${C.blue}22`}
                    stroke={C.blue}
                    strokeWidth={1.8}
                  />
                  <text x={w.x} y={152} fill={SOFT.blue} fontSize="13" fontWeight="700" textAnchor="middle">
                    {w.label}
                  </text>
                  <text x={w.x} y={168} fill={SOFT.blue} fontSize="11" textAnchor="middle">
                    {w.role}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            The planner does NOT execute steps. The workers do NOT decompose. Each agent stays on its layer. This
            separation makes both layers more reliable than one mixed agent.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Don&apos;t Multi-Agent A Small Problem
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Multi-agent costs something. More LLM calls, more state to track, more places for failure. Four
            anti-patterns where one agent is the right answer.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {MULTI_AGENT_ANTI_PATTERNS.map((a) => (
              <div key={a.name} style={{ ...tintedCard(C.red), padding: 12 }}>
                <span style={pill(C.red)}>ANTI-PATTERN</span>
                <T color={C.red} bold center size={14} style={{ marginTop: 8 }}>
                  {a.name}
                </T>
                <T color={SOFT.red} center size={12} style={{ marginTop: 6 }}>
                  {a.detail}
                </T>
              </div>
            ))}
          </div>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <T color={C.indigo} bold center size={15}>
              Decision Rule
            </T>
            <T color={SOFT.indigo} center size={14} style={{ marginTop: 8 }}>
              Multi-Agent IF Specialization OR Parallelism OR Planner / Worker Fits The Workload. Otherwise Single
              Agent. Cost Of Multi-Agent Failure Modes Covered In 27.6.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
