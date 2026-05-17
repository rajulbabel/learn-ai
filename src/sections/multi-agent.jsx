import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill } from "./agent-prompting.jsx";

// Section 13 Act 6: Multi-Agent Architectures
// Chapters 13.30 - 13.36

// 3 specialist agents used in sub=1
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

// Anti-patterns for sub=4
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
    detail: "Multi-Agent Failures (13.35) Are Hard To Debug; A 2-Person Team Will Drown.",
  },
];

export const WhyMultiAgent = (ctx) => {
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
            A single agent loaded with all customer-support roles - retrieve, classify, refund,
            troubleshoot, escalate - has a crowded system prompt. Each role pulls the prompt in a
            different direction. Performance ceiling appears.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Single agent loaded with five different jobs, labeled retrieve, classify, refund,
                troubleshoot, and escalate, visualizing the crowded role assignment that creates a
                performance ceiling for one agent.
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
            Each new role added to the system prompt costs precision on every other role. The
            ceiling is real: at some point, splitting roles into separate agents beats stuffing
            them into one.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Specialization: One Agent Per Role
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Replace the crowded single agent with 3 focused agents. Each has a tighter system
            prompt, a smaller tool set, a clearer goal. Each does its job better than a generalist
            would.
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
            Notice each specialist has 1-2 tools, not the full 8-tool inventory. Smaller surface =
            fewer wrong-tool errors. The triage router picks which specialist a ticket goes to.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Run Independent Tasks At The Same Time
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Some sub-tasks have no data dependencies. Run them on separate agents concurrently. The
            wall-clock cost is max(sub-task latency), not the sum.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three independent sub-tasks lookup_customer, lookup_subscription, and search_kb
                running in parallel on three separate agents with wall-clock time equal to the
                slowest one rather than the sum of all three.
              </desc>
              {/* Top hub */}
              <rect x={230} y={20} width={100} height={36} rx={8} fill={`${C.cyan}24`} stroke={C.cyan} strokeWidth={2} />
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
                  <rect x={a.x - 70} y={90} width={140} height={50} rx={8} fill={`${C.cyan}1a`} stroke={C.cyan} strokeWidth={1.6} />
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
            Sequential = 1.2 + 1.4 + 1.6 = 4.2s. Parallel = max(1.2, 1.4, 1.6) = 1.6s. Almost 3x
            faster. The win compounds as you add more independent sub-tasks.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Planner vs Worker
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Some agents are good at decomposing tasks; others are good at executing single steps.
            Separating these roles produces a 2-layer setup where each agent only does its own job.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two-layer planner and worker architecture: a planner agent at the top decomposes a
                task and dispatches sub-tasks to two worker agents at the bottom that each execute
                one sub-task and return results to the planner.
              </desc>
              {/* Planner top */}
              <rect x={210} y={20} width={140} height={50} rx={10} fill={`${C.purple}22`} stroke={C.purple} strokeWidth={2} />
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
                  <rect x={w.x - 70} y={130} width={140} height={50} rx={10} fill={`${C.blue}22`} stroke={C.blue} strokeWidth={1.8} />
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
            The planner does NOT execute steps. The workers do NOT decompose. Each agent stays on
            its layer. This separation makes both layers more reliable than one mixed agent.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Don&apos;t Multi-Agent A Small Problem
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Multi-agent costs something. More LLM calls, more state to track, more places for
            failure. Four anti-patterns where one agent is the right answer.
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
              Multi-Agent IF Specialization OR Parallelism OR Planner / Worker Fits The Workload.
              Otherwise Single Agent. Cost Of Multi-Agent Failure Modes Covered In 13.35.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const ORCHESTRATOR_PHASES = [
  {
    phase: "Plan",
    color: "teal",
    detail: "Break The Incoming Task Into 3-5 Sub-Tasks Each Workable In Isolation.",
  },
  {
    phase: "Dispatch",
    color: "cyan",
    detail: "Send Each Sub-Task To Its Assigned Worker Agent.",
  },
  {
    phase: "Aggregate",
    color: "blue",
    detail: "When Workers Return, Merge Results Into A Single Coherent Answer.",
  },
];

const T3_ORCHESTRATOR_TRACE = [
  {
    step: 1,
    actor: "Orchestrator",
    color: "teal",
    detail:
      'Receives T3 ("Dashboard Slow + 500 Errors"). Plans 3 Sub-Tasks: A) search_kb For "Dashboard Slow"; B) search_kb For "500 Errors"; C) lookup_customer For Usage Tier.',
  },
  { step: 2, actor: "Worker A", color: "cyan", detail: "Returns Top-3 KB Articles On Dashboard Performance." },
  { step: 3, actor: "Worker B", color: "cyan", detail: "Returns Top-3 KB Articles On 500 Errors." },
  { step: 4, actor: "Worker C", color: "cyan", detail: "Returns Alice's Tier (Pro) + Usage Stats (Heavy Dashboard User)." },
  {
    step: 5,
    actor: "Orchestrator",
    color: "teal",
    detail:
      "Aggregates: Composes A Single Answer Combining KB Hits + Customer Context. Recommends Dashboard Optimization And Escalates 500 Errors To Engineering.",
  },
];

const AGGREGATION_PATTERNS = [
  {
    name: "Concatenation",
    color: "indigo",
    detail: "Stitch All Worker Outputs Together In Order. Simple But Verbose.",
    best: "Quick Prototypes; Outputs Already Well-Sectioned.",
  },
  {
    name: "Voting",
    color: "purple",
    detail: "Workers Each Propose; Orchestrator Picks Majority. Good For Classification.",
    best: "Categorical Outputs; Hallucination Reduction.",
  },
  {
    name: "Synthesis",
    color: "red",
    detail:
      "Orchestrator Reads All Worker Outputs And Writes A Single Coherent Answer. Most Common, Most Expensive.",
    best: "Production Default For Natural-Language Answers.",
  },
];

export const OrchestratorWorker = (ctx) => {
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
            One Planner, N Workers
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The orchestrator-worker pattern is the most common production multi-agent shape. A
            central orchestrator plans and aggregates; workers each handle one sub-task. Hub and
            spoke topology - workers only talk to the orchestrator, never to each other.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Hub and spoke topology: an orchestrator agent at the top center has bidirectional
                arrows to three worker agents at the bottom, with no edges between workers.
              </desc>
              {/* Orchestrator at top */}
              <rect x={220} y={20} width={120} height={50} rx={10} fill={`${C.green}24`} stroke={C.green} strokeWidth={2} />
              <text x={280} y={42} fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Orchestrator
              </text>
              <text x={280} y={60} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Plans + Aggregates
              </text>

              {/* 3 workers */}
              {[
                { x: 100, label: "Worker 1" },
                { x: 280, label: "Worker 2" },
                { x: 460, label: "Worker 3" },
              ].map((w, i) => (
                <g key={`w-${i}`}>
                  {/* Two-way arrow */}
                  <line x1={280} y1={70} x2={w.x} y2={130} stroke={C.green} strokeWidth={1.6} />
                  <polygon points={`${w.x - 4},126 ${w.x + 4},126 ${w.x},134`} fill={C.green} />
                  <line x1={w.x - 4} y1={134} x2={280 - 4} y2={74} stroke={`${C.green}80`} strokeWidth={1} strokeDasharray="3,3" />

                  <rect x={w.x - 60} y={140} width={120} height={50} rx={10} fill={`${C.green}1a`} stroke={C.green} strokeWidth={1.6} />
                  <text x={w.x} y={162} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                    {w.label}
                  </text>
                  <text x={w.x} y={178} fill={SOFT.green} fontSize="11" textAnchor="middle">
                    One Sub-Task
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            The hub-and-spoke shape means the orchestrator owns coordination cost; workers stay
            simple. No edges between workers means no peer-to-peer chatter, no shared-state
            corruption.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Plan, Dispatch, Aggregate
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The orchestrator runs three phases per task. Each phase is a separate LLM call with a
            distinct system prompt - the same agent loops the model through three different
            mindsets.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {ORCHESTRATOR_PHASES.map((p) => {
              const accent = C[p.color];
              const soft = SOFT[p.color];
              return (
                <div key={p.phase} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{p.phase.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {p.phase}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {p.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            The 3 phases give the orchestrator 3 separate "minds": one to plan, one to dispatch,
            one to aggregate. Each is simpler than a single "do everything" prompt.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Execute One Sub-Task
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Each worker takes one sub-task description, runs its own agent loop within its tool
            set, and returns a structured result. Workers do NOT talk to each other - only to the
            orchestrator.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 160"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Single worker card showing the input sub-task description on the left, an internal
                agent loop in the middle, and the structured result returned to the orchestrator on
                the right.
              </desc>
              {/* Input */}
              <rect x={20} y={50} width={140} height={60} rx={8} fill={`${C.cyan}1a`} stroke={C.cyan} strokeWidth={1.6} />
              <text x={90} y={75} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Sub-Task
              </text>
              <text x={90} y={92} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                &quot;Lookup Customer
              </text>
              <text x={90} y={104} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Tier For c-9924&quot;
              </text>

              {/* Arrow */}
              <line x1={160} y1={80} x2={200} y2={80} stroke={C.cyan} strokeWidth={1.6} />
              <polygon points="196,77 204,77 200,73 200,87 196,83" fill={C.cyan} />

              {/* Worker (agent loop) */}
              <rect x={200} y={30} width={160} height={100} rx={10} fill={`${C.cyan}24`} stroke={C.cyan} strokeWidth={2} />
              <text x={280} y={52} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Worker Agent
              </text>
              <text x={280} y={72} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Internal Loop:
              </text>
              <text x={280} y={88} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Reason -&gt; Act -&gt; Observe
              </text>
              <text x={280} y={104} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Within Its Tool Set Only.
              </text>

              {/* Arrow */}
              <line x1={360} y1={80} x2={400} y2={80} stroke={C.cyan} strokeWidth={1.6} />
              <polygon points="396,77 404,77 400,73 400,87 396,83" fill={C.cyan} />

              {/* Output */}
              <rect x={400} y={50} width={140} height={60} rx={8} fill={`${C.cyan}1a`} stroke={C.cyan} strokeWidth={1.6} />
              <text x={470} y={75} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Structured Result
              </text>
              <text x={470} y={92} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                {`{ tier: "Pro", `}
              </text>
              <text x={470} y={104} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                {`usage: "heavy" }`}
              </text>
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Workers don&apos;t talk to each other. If Worker A&apos;s result feeds Worker B&apos;s
            input, the orchestrator does that chaining. This is what makes parallel dispatch safe.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Trace: Ticket T3 With Orchestrator-Worker
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Ticket T3 = "Dashboard slow + 500 errors". The orchestrator plans 3 parallel sub-tasks,
            dispatches them to workers, then aggregates.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {T3_ORCHESTRATOR_TRACE.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`t3-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Workers A and B and C ran in parallel - steps 2-4 happened roughly at the same time.
            Total latency = max(worker time) + plan + aggregate, not sum.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Three Ways To Aggregate
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Aggregation - merging worker outputs into a single answer - has three common patterns,
            each with a sweet spot.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {AGGREGATION_PATTERNS.map((a) => {
              const accent = C[a.color];
              const soft = SOFT[a.color];
              return (
                <div key={a.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{a.name.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {a.name}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    {a.detail}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Best For: {a.best}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Synthesis is the production default for natural-language answers. Voting wins when
            workers are doing classification. Concatenation is fine for structured outputs that
            need no rephrasing.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const HIERARCHY_DECISION = [
  {
    pick: "Orchestrator-Worker",
    color: "teal",
    when: "Workers Are Peer Specialists At One Level.",
    example: "3 KB Search Workers Run In Parallel.",
  },
  {
    pick: "Hierarchical",
    color: "cyan",
    when: "Domain Has Clear Sub-Domains.",
    example: "Billing Has Refund / Invoice / Tier-Change As Sub-Areas.",
  },
  {
    pick: "Avoid Hierarchical",
    color: "red",
    when: "Tree Depth > 3 Levels.",
    example: "Usually Means Over-Engineering; Flatten The Design.",
  },
];

const SUPPORT_TREE = {
  root: "Support Supervisor",
  branches: [
    {
      name: "Billing Supervisor",
      color: "teal",
      leaves: ["Refund Specialist", "Invoice Specialist", "Tier-Change Specialist"],
    },
    {
      name: "Troubleshooting Supervisor",
      color: "cyan",
      leaves: ["Database Specialist", "Network Specialist"],
    },
    {
      name: "Escalation Supervisor",
      color: "blue",
      leaves: ["Human Hand-Off (escalate_human)"],
    },
  ],
};

export const SupervisorHierarchy = (ctx) => {
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
            Multiple Levels Of Delegation
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Hierarchical multi-agent is a tree. A supervisor delegates to sub-supervisors which
            delegate to leaf specialists. Each leaf has 1-2 narrow tools. Multiple LEVELS, not the
            single level of orchestrator-worker.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three-level agent hierarchy: top supervisor delegates to three middle-level
                supervisors which each delegate to two leaf specialists, with planar parent-child
                edges and no crossings.
              </desc>
              {/* Top supervisor */}
              <rect x={230} y={10} width={100} height={36} rx={8} fill={`${C.green}24`} stroke={C.green} strokeWidth={2} />
              <text x={280} y={32} fill={SOFT.green} fontSize="12" fontWeight="700" textAnchor="middle">
                Supervisor
              </text>

              {/* Mid 3 sub-supervisors at x = 120, 280, 440 */}
              {[120, 280, 440].map((x, i) => (
                <g key={`mid-${i}`}>
                  <line x1={280} y1={46} x2={x} y2={90} stroke={C.green} strokeWidth={1.5} />
                  <rect x={x - 60} y={90} width={120} height={36} rx={8} fill={`${C.teal}1f`} stroke={C.teal} strokeWidth={1.6} />
                  <text x={x} y={112} fill={SOFT.teal} fontSize="12" fontWeight="700" textAnchor="middle">
                    Sub-Supervisor {i + 1}
                  </text>
                </g>
              ))}

              {/* Leaves: 2 per sub-supervisor at offsets -40, +40 */}
              {[120, 280, 440].map((parentX) =>
                [-40, 40].map((dx, j) => {
                  const x = parentX + dx;
                  return (
                    <g key={`leaf-${parentX}-${j}`}>
                      <line x1={parentX} y1={126} x2={x} y2={170} stroke={C.cyan} strokeWidth={1.2} />
                      <rect x={x - 35} y={170} width={70} height={32} rx={6} fill={`${C.cyan}14`} stroke={C.cyan} strokeWidth={1.4} />
                      <text x={x} y={190} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                        Leaf
                      </text>
                    </g>
                  );
                })
              )}

              <text x={280} y={222} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Top = Supervisor. Mid = Sub-Supervisors. Leaves = Specialists (Tools).
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Three levels is the practical sweet spot. Two levels is just orchestrator-worker
            renamed. Four levels usually signals over-engineering.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Each Supervisor: Plan + Route Down
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            At each level, a supervisor takes a sub-task, picks which child agent handles it (or
            breaks further and picks multiple children), waits for results, aggregates, and
            returns up to its own parent.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              { phase: "Receive", detail: "Get A Sub-Task From The Parent." },
              { phase: "Plan", detail: "Decide: Single Child Handles, Or Break Into Smaller Sub-Tasks." },
              { phase: "Route Down", detail: "Pick The Child Agent(s) Best Matched To The Sub-Task." },
              { phase: "Aggregate", detail: "Wait For Children, Combine Their Results." },
              { phase: "Return Up", detail: "Send The Aggregated Result To The Parent Supervisor." },
            ].map((p, i) => (
              <div key={`step-${i}`} style={{ ...tintedCard(C.teal), padding: 12 }}>
                <span style={pill(C.teal)}>{p.phase.toUpperCase()}</span>
                <T color={SOFT.teal} center size={13} style={{ marginTop: 8 }}>
                  {p.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Every supervisor does the same 5 things at its level. Routing is the new responsibility
            compared to orchestrator-worker - a supervisor must know which child agent is right for
            which sub-task type.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Hierarchical When The Domain Has Sub-Specialties
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Choosing hierarchical over orchestrator-worker is a domain shape question. If your
            workflow has clear sub-areas with their own internal structure, the tree pays off. If
            it does not, flatten.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {HIERARCHY_DECISION.map((d) => {
              const accent = C[d.color];
              const soft = SOFT[d.color];
              return (
                <div key={d.pick} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{d.pick.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {d.pick}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {d.when}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Example: {d.example}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            Most production customer-support agents fit hierarchical because billing and
            troubleshooting are genuinely different sub-domains with different tools and policies.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Support Tree
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The customer-support agent fits hierarchical cleanly. Three sub-supervisors handle
            billing, troubleshooting, and escalation; each has its own specialists below.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.green), padding: 12 }}>
              <span style={pill(C.green)}>ROOT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                {SUPPORT_TREE.root}
              </T>
              <T color={SOFT.green} center size={12} style={{ marginTop: 6 }}>
                All-Tickets Entry Point. Classifies And Routes.
              </T>
            </div>

            {SUPPORT_TREE.branches.map((b) => {
              const accent = C[b.color];
              const soft = SOFT[b.color];
              return (
                <div key={b.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>SUB-SUPERVISOR</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {b.name}
                  </T>
                  <ul style={{ marginTop: 8, paddingLeft: 18, textAlign: "left", color: soft }}>
                    {b.leaves.map((l, i) => (
                      <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Each leaf specialist has 1-3 tools from the canonical 8-tool inventory: refund
            specialists use process_refund + lookup_subscription, network specialists use
            search_kb, escalation calls escalate_human.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            When To Escalate Up
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            A leaf specialist that cannot finish its task escalates up to its supervisor. The
            supervisor decides: retry with a different leaf, or escalate to ITS own parent.
            Eventually a top-level escalation reaches the Escalation Supervisor which calls
            escalate_human.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              { actor: "Refund Specialist", color: "cyan", action: "Hit business_rule Error On $250 Refund. Escalates Up." },
              { actor: "Billing Supervisor", color: "teal", action: "Considers Tier-Change Leaf, Rules It Out. Escalates Up." },
              { actor: "Support Supervisor", color: "green", action: "Routes To Escalation Supervisor." },
              { actor: "Escalation Supervisor", color: "blue", action: "Calls escalate_human With Full Trace." },
            ].map((row, i) => (
              <div key={`up-${i}`} style={{ ...tintedCard(C[row.color]), padding: 12 }}>
                <span style={pill(C[row.color])}>{row.actor.toUpperCase()}</span>
                <T color={SOFT[row.color]} center size={13} style={{ marginTop: 8 }}>
                  {row.action}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Escalation up the tree is the safety net. Without it, a leaf failure becomes a silent
            stall. With it, every dead-end eventually reaches escalate_human or a successful
            re-route.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const HANDOFF_SHAPE = `Agent {
  name: "triage",
  instructions: "Classify intent. Hand off to billing for refund/invoice, troubleshooting for errors.",
  handoffs: [billing_agent, troubleshooting_agent]
}`;

const HANDOFF_PACKAGE = [
  { piece: "Full Conversation History", note: "All Turns Since Session Start." },
  { piece: "Working Memory Snapshot", note: "Current scratchpad state at hand-off time." },
  { piece: "Hand-Off Reason", note: "Why The Sender Decided To Hand Off (e.g. 'Classified As Billing')." },
];

const T4_HANDOFF_TRACE = [
  {
    step: 1,
    actor: "Triage Agent",
    color: "teal",
    detail: 'Receives T4 ("Cancel Subscription + Refund Last Invoice").',
  },
  {
    step: 2,
    actor: "Triage Agent",
    color: "teal",
    detail: "Classifies As Billing. Returns Hand-Off To billing_agent. Loop Switches.",
  },
  {
    step: 3,
    actor: "Billing Agent",
    color: "cyan",
    detail: "Receives Full Conversation History. Processes Cancel.",
  },
  {
    step: 4,
    actor: "Billing Agent",
    color: "cyan",
    detail: "Refund > $200; business_rule Error. Returns Hand-Off To escalation_agent.",
  },
  {
    step: 5,
    actor: "Escalation Agent",
    color: "blue",
    detail: "Receives Full Trace. Calls escalate_human With Cancel-And-Refund Context.",
  },
];

export const AgentHandoffs = (ctx) => {
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
            Return The Next Agent
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The Swarm pattern (now in the OpenAI Agents SDK): instead of an orchestrator routing
            sub-tasks, an agent finishes its part and RETURNS the next agent. The runtime then
            switches control directly. No central coordinator.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>DELEGATION</span>
              <T color={C.purple} bold center size={15} style={{ marginTop: 10 }}>
                Orchestrator-Worker Style
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 8 }}>
                Orchestrator Picks Who Handles Next, Waits For Result, Picks Again. Central
                Control.
              </T>
            </div>

            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>HAND-OFF</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 10 }}>
                Swarm Style
              </T>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                Agent A Returns &quot;next = agent B&quot;. Loop Switches Control Directly. No
                Central Coordinator.
              </T>
            </div>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            Hand-off is decentralized; orchestration is centralized. Both ship to production - the
            pick depends on whether you want a single "brain" or peer-to-peer routing.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Agents As Routes
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            In the Swarm pattern, each agent declares which other agents it can hand off to. The
            handoffs field is a list - similar to routes in a web framework.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <T color={C.teal} bold center size={14}>
              Agent Hand-Off (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.teal,
                fontSize: 14,
                lineHeight: 1.5,
                background: `${C.teal}06`,
                border: `1px solid ${C.teal}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {HANDOFF_SHAPE}
            </div>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            `name` and `instructions` are this agent&apos;s own identity. `handoffs` is the set of
            other agents this agent can transfer control to - basically a small DAG of allowed
            transitions.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            What Travels With The Hand-Off
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When agent A hands off to agent B, B does not start fresh. It receives a hand-off
            package with everything it needs to pick up cleanly.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {HANDOFF_PACKAGE.map((p) => (
              <div key={p.piece} style={{ ...tintedCard(C.cyan), padding: 12 }}>
                <span style={pill(C.cyan)}>PACKAGE PART</span>
                <T color={C.cyan} bold center size={14} style={{ marginTop: 8 }}>
                  {p.piece}
                </T>
                <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                  {p.note}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            The receiving agent reads the entire package before its first reasoning step. No
            "re-litigation from scratch". The conversation history plus working memory plus reason
            is the contract.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Trace: T4 With Triage And Billing Hand-Off
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Ticket T4 = "Cancel my subscription + refund last invoice." Watch the hand-off ring
            move control across three agents.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {T4_HANDOFF_TRACE.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`t4-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Three agents, three hand-offs, one ticket. Each agent did its specialty. Hand-off
            package carried full context so the escalation_agent did not need to ask "what
            happened before".
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Ring When All Agents Are Peers
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Hand-off topology is a ring (or general graph) - any agent can transfer to any other,
            subject to the handoffs list. Different from tree topology, which has fixed parent-
            child relationships.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 220"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Hand-off ring topology with four agents arranged in a circle, each connected by
                bidirectional arrows to its neighbors and one diagonal cross-edge, showing peer-to-
                peer transfer with no central parent.
              </desc>
              {/* 4 peer agents in a ring */}
              {[
                { x: 280, y: 35, label: "Triage" },
                { x: 460, y: 110, label: "Billing" },
                { x: 280, y: 185, label: "Escalation" },
                { x: 100, y: 110, label: "Troubleshooting" },
              ].map((a, i) => (
                <g key={`peer-${i}`}>
                  <rect x={a.x - 50} y={a.y - 18} width={100} height={36} rx={8} fill={`${C.indigo}1f`} stroke={C.indigo} strokeWidth={1.8} />
                  <text x={a.x} y={a.y + 5} fill={SOFT.indigo} fontSize="12" fontWeight="700" textAnchor="middle">
                    {a.label}
                  </text>
                </g>
              ))}
              {/* Ring edges */}
              <line x1={330} y1={45} x2={420} y2={100} stroke={C.indigo} strokeWidth={1.5} />
              <line x1={420} y1={120} x2={330} y2={175} stroke={C.indigo} strokeWidth={1.5} />
              <line x1={230} y1={175} x2={140} y2={120} stroke={C.indigo} strokeWidth={1.5} />
              <line x1={140} y1={100} x2={230} y2={45} stroke={C.indigo} strokeWidth={1.5} />
              {/* Cross-edge */}
              <line x1={330} y1={45} x2={140} y2={120} stroke={`${C.indigo}80`} strokeWidth={1.2} strokeDasharray="4,4" />
            </svg>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Tree topology fits when domains are nested (billing has refund/invoice as sub-areas).
            Ring topology fits when domains are equal peers (triage, billing, troubleshooting,
            escalation are at the same level, no nesting).
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const REFUND_CRITIC_TRACE = [
  {
    step: 1,
    actor: "Customer",
    color: "teal",
    detail: "Requests Refund For Invoice #INV-9924, $180.",
  },
  {
    step: 2,
    actor: "Refund Agent",
    color: "cyan",
    detail: '"Approved, Processing $180 Refund Now."',
  },
  {
    step: 3,
    actor: "Policy Critic",
    color: "red",
    detail:
      '"Hold. Check If Invoice Was Paid > 30 Days Ago. If Yes, Partial Refund Only (60% Policy For >30 Days).",',
  },
  {
    step: 4,
    actor: "Refund Agent (Revised)",
    color: "green",
    detail: '"Confirmed >30 Days. Approved For $120 (60% Policy)."',
  },
];

const CRITIC_VS_DEBATE_VS_SKIP = [
  {
    pattern: "Use Critic",
    color: "blue",
    when: "High-Stakes Mutations.",
    examples: "Refunds, Escalations, Contract Changes.",
    cost: "+1 LLM Call Per Draft.",
  },
  {
    pattern: "Use Debate",
    color: "purple",
    when: "Contested Decisions With Multiple Readings.",
    examples: "Policy Edge Cases, Customer-Vs-Business Tension.",
    cost: "+3 LLM Calls Per Round.",
  },
  {
    pattern: "Skip Both",
    color: "green",
    when: "Simple, Low-Stakes Tasks.",
    examples: "Lookups, Classifications, Factual Recall.",
    cost: "No Overhead.",
  },
];

export const CriticDebate = (ctx) => {
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
            A Second Agent Checks The First
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Critic is reflection-as-multi-agent: instead of one agent self-critiquing (13.22), a
            separate critic agent reviews the worker&apos;s draft. Same idea, more isolation - the
            critic does not share working memory with the worker.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two-agent pair where the worker agent on the left produces a draft answer and the
                critic agent on the right reads the draft and the original question, then scores or
                rewrites it.
              </desc>
              <rect x={40} y={50} width={180} height={80} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={130} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Worker Agent
              </text>
              <text x={130} y={100} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Produces Draft Answer
              </text>
              <text x={130} y={116} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                For The Customer.
              </text>

              <line x1={220} y1={90} x2={340} y2={90} stroke={C.green} strokeWidth={1.8} />
              <polygon points="336,87 344,87 340,83 340,97 336,93" fill={C.green} />
              <text x={280} y={82} fill={SOFT.green} fontSize="11" fontWeight="700" textAnchor="middle">
                Draft
              </text>

              <rect x={340} y={50} width={180} height={80} rx={10} fill={`${C.red}1f`} stroke={C.red} strokeWidth={1.8} />
              <text x={430} y={80} fill={SOFT.red} fontSize="14" fontWeight="700" textAnchor="middle">
                Critic Agent
              </text>
              <text x={430} y={100} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Reads Draft + Question.
              </text>
              <text x={430} y={116} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Scores Or Rewrites.
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            The critic has a different system prompt - it is told to be SKEPTICAL of the
            worker&apos;s draft. The separation makes it less likely the model just rubber-stamps
            its own earlier output.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Loop: Draft - Critique - Revise
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The critic-revise loop is bounded. Worker drafts; critic scores 0-10 with reasoning;
            if below threshold, worker revises with critic&apos;s feedback; critic re-scores. Loop
            until score is high enough OR the retry cap is hit.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Circular flow with four stations: worker drafts, critic scores zero through ten,
                conditional revise if below seven, then critic re-scores, with a loop arrow back to
                the worker until score is high enough or retry cap is reached.
              </desc>
              {/* 4 stations in a circle */}
              {[
                { x: 280, y: 30, label: "Worker Drafts" },
                { x: 470, y: 100, label: "Critic Scores 0-10" },
                { x: 280, y: 170, label: "If < 7, Revise" },
                { x: 90, y: 100, label: "Critic Re-Scores" },
              ].map((s, i) => (
                <g key={`stn-${i}`}>
                  <rect x={s.x - 70} y={s.y - 16} width={140} height={32} rx={8} fill={`${C.teal}1f`} stroke={C.teal} strokeWidth={1.6} />
                  <text x={s.x} y={s.y + 4} fill={SOFT.teal} fontSize="12" fontWeight="700" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              ))}
              {/* Arrows clockwise */}
              <path d="M 350 30 Q 440 50 460 80" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="456,76 464,76 460,84" fill={C.teal} />
              <path d="M 470 120 Q 440 160 350 170" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="354,166 354,174 346,170" fill={C.teal} />
              <path d="M 210 170 Q 120 160 100 120" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="96,124 104,124 100,116" fill={C.teal} />
              <path d="M 90 80 Q 120 50 210 30" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="206,34 214,34 210,26" fill={C.teal} />
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            The retry cap matters. Without it, a worker that can&apos;t please the critic loops
            forever - one of the cost-runaway failure modes covered in 13.35.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Two Agents Argue, Judge Decides
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Debate is a 3-agent variant. Agent Pro argues for a position; Agent Con argues against;
            Judge agent reads both arguments and the original question and picks. Useful when the
            answer is contested or high-stakes enough to be worth two views.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three-agent debate setup: agent Pro on the left and agent Con on the right both
                argue toward a Judge agent in the bottom center, which reads both arguments and
                picks one.
              </desc>
              {/* Pro left */}
              <rect x={40} y={40} width={140} height={50} rx={10} fill={`${C.green}1f`} stroke={C.green} strokeWidth={1.8} />
              <text x={110} y={62} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent Pro
              </text>
              <text x={110} y={78} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Argues FOR
              </text>

              {/* Con right */}
              <rect x={380} y={40} width={140} height={50} rx={10} fill={`${C.red}1f`} stroke={C.red} strokeWidth={1.8} />
              <text x={450} y={62} fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent Con
              </text>
              <text x={450} y={78} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Argues AGAINST
              </text>

              {/* Judge bottom center */}
              <rect x={200} y={140} width={160} height={50} rx={10} fill={`${C.purple}24`} stroke={C.purple} strokeWidth={2} />
              <text x={280} y={162} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Judge Agent
              </text>
              <text x={280} y={178} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Reads Both, Picks One
              </text>

              {/* Arrows down */}
              <line x1={110} y1={90} x2={230} y2={140} stroke={C.purple} strokeWidth={1.6} />
              <polygon points="226,136 234,136 230,144" fill={C.purple} />
              <line x1={450} y1={90} x2={330} y2={140} stroke={C.purple} strokeWidth={1.6} />
              <polygon points="326,136 334,136 330,144" fill={C.purple} />
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Debate triples the LLM bill vs single-agent. Use it sparingly - high-stakes contested
            decisions where you genuinely want two voices, not noise-reduction on a routine task.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Policy Critic For The Refund Agent
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Concrete example: a refund agent makes a draft decision; a policy critic catches that
            the invoice is &gt;30 days old; the refund gets revised down. This is exactly the kind
            of thing the worker alone would miss.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REFUND_CRITIC_TRACE.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`r-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            The critic caught $60 the worker would have over-refunded. Multiplied across thousands
            of refunds per month, the policy critic pays for its own LLM bill many times over.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Critic Adds Cost; Pick Battles
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Critic and debate are not free. Each extra agent doubles or triples the LLM bill and
            adds latency. Pick where they earn their cost, skip where they do not.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {CRITIC_VS_DEBATE_VS_SKIP.map((p) => {
              const accent = C[p.color];
              const soft = SOFT[p.color];
              return (
                <div key={p.pattern} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{p.pattern.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    {p.pattern}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {p.when}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Examples: {p.examples}
                  </T>
                  <T color={soft} center size={11} style={{ marginTop: 4 }}>
                    Cost: {p.cost}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Rule of thumb: if a wrong answer is worth less than the extra LLM cost, skip the
            critic. If a wrong answer can cost $200 in refund overage, paying $0.01 for a critic
            call is the easiest trade you will ever make.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const FOUR_FAILURE_MODES = [
  {
    name: "Drift",
    color: "teal",
    desc: "Agents Disagree On The Goal.",
  },
  {
    name: "Infinite Loop",
    color: "cyan",
    desc: "Agents Bounce Hand-Offs Forever.",
  },
  {
    name: "Deadlock",
    color: "blue",
    desc: "Agents Wait On Each Other.",
  },
  {
    name: "Cost Runaway",
    color: "red",
    desc: "Unbounded Recursion; Spend Vertical.",
  },
];

const DRIFT_INTERPRETATIONS = [
  { agent: "Agent A", interpretation: "Cancel Subscription Now.", color: "teal" },
  { agent: "Agent B", interpretation: "Refund The Last Invoice.", color: "cyan" },
  { agent: "Agent C", interpretation: "Save The Customer (Anti-Churn).", color: "blue" },
];

const ALERT_THRESHOLDS = [
  {
    failure: "Drift",
    color: "teal",
    signal: "Planner Outputs Disagree On Intent.",
    threshold: "Detected By Comparing Plan Summaries Across Agents.",
  },
  {
    failure: "Infinite Loop",
    color: "cyan",
    signal: "Hand-Off Rate Not Decreasing.",
    threshold: "> 5 Hand-Offs In A Single Turn.",
  },
  {
    failure: "Deadlock",
    color: "blue",
    signal: "Agents In WAITING State.",
    threshold: "> 30 Seconds With No State Change.",
  },
  {
    failure: "Cost Runaway",
    color: "red",
    signal: "Spend Rate Per Turn Climbing.",
    threshold: "> 3x Baseline Cost Per Turn.",
  },
];

export const MultiAgentFailures = (ctx) => {
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
            How Multi-Agent Falls Apart
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Four failure modes show up in production multi-agent systems. Each has a distinct
            signature, a distinct signal, and a distinct fix. Knowing them is the difference
            between shipping multi-agent and leaving it in the lab.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two-by-two grid of four multi-agent failure modes: drift in top left, infinite loop
                in top right, deadlock in bottom left, and cost runaway in bottom right, each
                tinted with its own color.
              </desc>
              {FOUR_FAILURE_MODES.map((m, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = 40 + col * 250;
                const y = 20 + row * 90;
                const accent = C[m.color];
                const soft = SOFT[m.color];
                return (
                  <g key={`mode-${i}`}>
                    <rect x={x} y={y} width={230} height={70} rx={10} fill={`${accent}1f`} stroke={accent} strokeWidth={1.8} />
                    <text x={x + 115} y={y + 30} fill={soft} fontSize="15" fontWeight="700" textAnchor="middle">
                      {m.name}
                    </text>
                    <text x={x + 115} y={y + 52} fill={soft} fontSize="12" textAnchor="middle">
                      {m.desc}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Each subsequent sub-step zooms into one failure mode. The final sub-step maps each
            failure to a production alerting threshold.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Drift: Agents Pull In Different Directions
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Drift = different agents in the same run interpret the user&apos;s intent differently.
            They each work hard toward their own version of the goal. The final answer is
            incoherent.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Three agents working on the same ticket pulling in three different directions: one
                interprets it as cancel subscription, another as refund invoice, a third as save
                the customer, with diverging arrows showing incoherent outcomes.
              </desc>
              {/* User ticket center */}
              <rect x={210} y={20} width={140} height={36} rx={8} fill={`${C.teal}24`} stroke={C.teal} strokeWidth={2} />
              <text x={280} y={42} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                Ticket T4
              </text>

              {/* 3 diverging agents at bottom */}
              {DRIFT_INTERPRETATIONS.map((d, i) => {
                const x = 90 + i * 180;
                const accent = C[d.color];
                const soft = SOFT[d.color];
                return (
                  <g key={`drift-${i}`}>
                    <line x1={280} y1={56} x2={x} y2={120} stroke={accent} strokeWidth={1.6} />
                    <polygon points={`${x - 4},116 ${x + 4},116 ${x},124`} fill={accent} />
                    <rect x={x - 80} y={130} width={160} height={50} rx={8} fill={`${accent}1f`} stroke={accent} strokeWidth={1.6} />
                    <text x={x} y={152} fill={soft} fontSize="12" fontWeight="700" textAnchor="middle">
                      {d.agent}
                    </text>
                    <text x={x} y={170} fill={soft} fontSize="11" textAnchor="middle">
                      {d.interpretation}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Fix drift with a shared "plan summary" output that every agent must read before its
            first reasoning step. If two agents disagree about the goal, the alert fires before
            any tools run.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Hand-Off Ping-Pong
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Infinite loop = hand-off ring spins forever. Triage hands off to billing; billing
            hands off back to triage; triage hands off to billing again. No agent commits to
            handling the ticket. Symptom: hand-off rate per turn does not decrease.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two agents triage and billing hand off to each other back and forth in an infinite
                ping pong with arrows curving in both directions and a counter showing the hand-off
                rate not decreasing.
              </desc>
              <rect x={60} y={50} width={160} height={50} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={140} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Triage
              </text>

              <rect x={340} y={50} width={160} height={50} rx={10} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.8} />
              <text x={420} y={80} fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Billing
              </text>

              {/* Hand-off arrows looping back */}
              <path d="M 220 60 Q 280 30 340 60" stroke={C.cyan} strokeWidth={1.8} fill="none" />
              <polygon points="336,57 344,57 340,65" fill={C.cyan} />
              <path d="M 340 90 Q 280 120 220 90" stroke={C.cyan} strokeWidth={1.8} fill="none" />
              <polygon points="216,87 224,87 220,95" fill={C.cyan} />

              <text x={280} y={148} fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Hand-Off Rate Per Turn: 1, 2, 3, 4, 5, ...
              </text>
              <text x={280} y={166} fill={SOFT.red} fontSize="11" textAnchor="middle">
                NEVER DECREASES = Infinite Loop Detected.
              </text>
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Fix infinite loop with a hand-off counter per turn + a hand-off chain history. If the
            same edge fires twice in a row, halt and escalate to human.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Two Agents Wait Forever
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Deadlock = circular wait. Agent A is waiting on Agent B&apos;s result. Agent B is
            waiting on Agent A&apos;s result. Neither makes progress. Symptom: both agents in
            WAITING state simultaneously for &gt; 30 seconds.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 160"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two agents A and B locked in a deadlock: A waits on B's result, B waits on A's
                result, with circular waiting arrows and both agents marked in a WAITING state.
              </desc>
              <rect x={60} y={40} width={160} height={70} rx={10} fill={`${C.blue}1f`} stroke={C.blue} strokeWidth={1.8} />
              <text x={140} y={70} fill={SOFT.blue} fontSize="14" fontWeight="700" textAnchor="middle">
                Agent A
              </text>
              <text x={140} y={88} fill={SOFT.red} fontSize="11" textAnchor="middle">
                WAITING ON B
              </text>
              <text x={140} y={104} fill={SOFT.red} fontSize="10" textAnchor="middle">
                State Unchanged 30s
              </text>

              <rect x={340} y={40} width={160} height={70} rx={10} fill={`${C.blue}1f`} stroke={C.blue} strokeWidth={1.8} />
              <text x={420} y={70} fill={SOFT.blue} fontSize="14" fontWeight="700" textAnchor="middle">
                Agent B
              </text>
              <text x={420} y={88} fill={SOFT.red} fontSize="11" textAnchor="middle">
                WAITING ON A
              </text>
              <text x={420} y={104} fill={SOFT.red} fontSize="10" textAnchor="middle">
                State Unchanged 30s
              </text>

              {/* Circular wait arrows */}
              <path d="M 220 65 Q 280 35 340 65" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="336,62 344,62 340,70" fill={C.red} />
              <path d="M 340 85 Q 280 115 220 85" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="216,82 224,82 220,90" fill={C.red} />

              <text x={280} y={144} fill={SOFT.blue} fontSize="11" fontWeight="700" textAnchor="middle">
                Signal: Both Agents In WAITING State Simultaneously For &gt; 30 Seconds.
              </text>
            </svg>
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Fix deadlock with timeouts on every inter-agent wait. If A doesn&apos;t hear from B
            within N seconds, A surfaces "timeout waiting on B" and the runtime breaks the cycle.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Unbounded Recursion: Cost Goes Vertical
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Cost runaway = a parent agent spawns sub-agents; each sub-agent spawns more; cost grows
            exponentially. By iteration 20, a normal $0.50 run is $50. The signal is brutal: spend
            rate climbing per turn without a corresponding answer-quality gain.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Cost vs iteration chart with normal multi-agent run at fifty cents on a slow flat
                curve and a runaway scenario climbing exponentially to fifty dollars by iteration
                twenty.
              </desc>
              {/* X axis */}
              <line x1={40} y1={170} x2={520} y2={170} stroke={SOFT.indigo} strokeWidth={1.4} />
              {/* Y axis */}
              <line x1={40} y1={20} x2={40} y2={170} stroke={SOFT.indigo} strokeWidth={1.4} />
              <text x={20} y={170} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $0
              </text>
              <text x={20} y={100} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $5
              </text>
              <text x={20} y={30} fill={SOFT.indigo} fontSize="10" textAnchor="end">
                $50
              </text>
              <text x={40} y={188} fill={SOFT.indigo} fontSize="10" textAnchor="middle">
                Iter 0
              </text>
              <text x={520} y={188} fill={SOFT.indigo} fontSize="10" textAnchor="middle">
                Iter 20
              </text>

              {/* Normal curve - slow flat - mostly horizontal */}
              <path d="M 40 165 Q 200 162 520 158" stroke={C.green} strokeWidth={2.2} fill="none" />
              <text x={460} y={150} fill={SOFT.green} fontSize="11" textAnchor="middle">
                Normal $0.50
              </text>

              {/* Runaway curve - exponential */}
              <path d="M 40 165 Q 350 160 460 100 Q 500 50 520 25" stroke={C.red} strokeWidth={2.2} fill="none" />
              <text x={460} y={70} fill={SOFT.red} fontSize="11" textAnchor="middle">
                Runaway -&gt; $50
              </text>
            </svg>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Fix cost runaway with a recursion depth cap, a per-turn spend cap, and a circuit
            breaker that halts when either is hit. If the agent decides to spawn 12 sub-agents,
            something is wrong with the planner prompt.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What To Alert On
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Each failure mode has a production signal. Each signal has a threshold. Each threshold
            crossing should page a human. This table is the entire reason multi-agent ships safely
            or doesn&apos;t.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {ALERT_THRESHOLDS.map((a) => {
              const accent = C[a.color];
              const soft = SOFT[a.color];
              return (
                <div key={a.failure} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{a.failure.toUpperCase()}</span>
                  <T color={accent} bold center size={14} style={{ marginTop: 8 }}>
                    Signal: {a.signal}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    Alert Threshold: {a.threshold}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Every multi-agent system in production must monitor all four. Skipping any one is a
            bet that the corresponding failure mode will never bite - and it always eventually
            does. Alert thresholds are the price of multi-agent.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};

const QUERY_REWRITE_TRACE = [
  {
    iter: 1,
    query: '"Customer Issues Past 90 Days"',
    results: "5 Generic Articles. Too Broad.",
  },
  {
    iter: 2,
    query: '"Customer-Impact Incidents Past 90 Days, Severity > 2"',
    results: "Better Hits. 8 Incidents Returned.",
  },
  {
    iter: 3,
    query: '"Customer-Impact Incidents Past 90 Days, Severity > 2, Status = Resolved"',
    results: "Best Hits. 8 Incidents, All With Resolution Details.",
  },
];

const RESEARCH_QUERY_STEPS = [
  {
    step: 1,
    actor: "Initial Query",
    color: "teal",
    detail: '"Find All Customer-Impact Issues In The Past 90 Days."',
  },
  {
    step: 2,
    actor: "Search Top-5",
    color: "cyan",
    detail: "Vector Search Returns 5 KB Articles.",
  },
  {
    step: 3,
    actor: "Judge",
    color: "blue",
    detail: 'Only 2 Are Customer-Impact. Need Broader Retrieval With Severity Filter.',
  },
  {
    step: 4,
    actor: "Rewrite + Search",
    color: "indigo",
    detail: "Query Adds severity > 2 Filter. New Search Returns 8 Articles.",
  },
  {
    step: 5,
    actor: "Final Aggregation",
    color: "green",
    detail: "8 Incidents Synthesized Into A Summary Table With Dates, Severities, Resolutions.",
  },
];

const NAIVE_VS_AGENTIC_DECISION = [
  {
    pick: "Naive RAG",
    color: "teal",
    when: "Direct Factoid Lookups; Single-Doc Questions.",
    examples: '"What Is The Refund Policy?"',
    cost: "1 Retrieval, 1 Generation. Cheap.",
  },
  {
    pick: "Agentic RAG",
    color: "cyan",
    when: "Research Questions; Multi-Hop; Find-All Or Compare Queries.",
    examples: '"Find All Customer-Impact Issues Past 90 Days."',
    cost: "3-10x Naive Cost. Slow.",
  },
];

export const AgenticRag = (ctx) => {
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
            Retrieve Once vs Retrieve In A Loop
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Naive RAG retrieves once and generates an answer. Agentic RAG puts retrieval inside an
            agent loop: search, judge the results, refine the query, search again. Iterative
            instead of one-shot. Mechanics covered in Section 12.29; here we frame it as a multi-
            agent pattern.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Top row shows naive RAG as a one-shot pipeline from query to retrieve to generate;
                bottom row shows agentic RAG as a loop from query to retrieve to judge with a
                conditional rewrite arrow back to retrieve until the judge says done.
              </desc>
              {/* Naive RAG row */}
              <text x={40} y={20} fill={SOFT.green} fontSize="12" fontWeight="700">
                Naive RAG (One-Shot)
              </text>
              {[
                { x: 40, label: "Query" },
                { x: 200, label: "Retrieve" },
                { x: 360, label: "Generate" },
              ].map((n, i) => (
                <g key={`naive-${i}`}>
                  <rect x={n.x} y={30} width={120} height={40} rx={8} fill={`${C.green}1f`} stroke={C.green} strokeWidth={1.6} />
                  <text x={n.x + 60} y={55} fill={SOFT.green} fontSize="13" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  {i < 2 && (
                    <>
                      <line x1={n.x + 120} y1={50} x2={n.x + 160} y2={50} stroke={C.green} strokeWidth={1.6} />
                      <polygon points={`${n.x + 156},47 ${n.x + 164},47 ${n.x + 160},43 ${n.x + 160},57 ${n.x + 156},53`} fill={C.green} />
                    </>
                  )}
                </g>
              ))}

              {/* Agentic RAG row - loop */}
              <text x={40} y={110} fill={SOFT.cyan} fontSize="12" fontWeight="700">
                Agentic RAG (Iterative)
              </text>
              {[
                { x: 40, label: "Query" },
                { x: 180, label: "Retrieve" },
                { x: 320, label: "Judge" },
                { x: 460, label: "Done" },
              ].map((n, i) => (
                <g key={`agentic-${i}`}>
                  <rect x={n.x} y={120} width={100} height={40} rx={8} fill={`${C.cyan}1f`} stroke={C.cyan} strokeWidth={1.6} />
                  <text x={n.x + 50} y={145} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                    {n.label}
                  </text>
                  {i < 3 && (
                    <>
                      <line x1={n.x + 100} y1={140} x2={n.x + 140} y2={140} stroke={C.cyan} strokeWidth={1.6} />
                      <polygon points={`${n.x + 136},137 ${n.x + 144},137 ${n.x + 140},133 ${n.x + 140},147 ${n.x + 136},143`} fill={C.cyan} />
                    </>
                  )}
                </g>
              ))}
              {/* Loop back arrow */}
              <path d="M 370 160 Q 270 210 230 160" stroke={C.red} strokeWidth={1.8} fill="none" />
              <polygon points="226,157 234,157 230,165" fill={C.red} />
              <text x={280} y={210} fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="middle">
                Rewrite If Not Enough
              </text>
            </svg>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Naive RAG is a pipeline; agentic RAG is a loop with retrieval inside. Section 12.2
            covers the naive pipeline; Section 12.29 covers the loop mechanics. Here we close Act
            6 by framing it as multi-agent.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Search, Judge, Refine, Repeat
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The agentic RAG loop has four stations. Search returns candidates; Judge asks "do I
            have enough? what is missing?"; Refine rewrites the query with the gap in mind; Search
            again. Loop until Judge says "done" or max iterations is hit.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Circular four-station loop: search, judge with a question of whether enough
                evidence has been collected, refine which rewrites the query, then search again,
                until judge says done or max iterations is hit.
              </desc>
              {[
                { x: 280, y: 30, label: "Search" },
                { x: 480, y: 100, label: "Judge" },
                { x: 280, y: 170, label: "Refine" },
                { x: 80, y: 100, label: "Done?" },
              ].map((s, i) => (
                <g key={`loop-${i}`}>
                  <rect x={s.x - 60} y={s.y - 16} width={120} height={32} rx={8} fill={`${C.teal}1f`} stroke={C.teal} strokeWidth={1.6} />
                  <text x={s.x} y={s.y + 4} fill={SOFT.teal} fontSize="13" fontWeight="700" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              ))}
              <path d="M 340 30 Q 440 50 470 80" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="466,76 474,76 470,84" fill={C.teal} />
              <path d="M 480 120 Q 440 160 340 170" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="344,166 344,174 336,170" fill={C.teal} />
              <path d="M 220 170 Q 100 160 80 120" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="76,124 84,124 80,116" fill={C.teal} />
              <path d="M 80 80 Q 100 50 220 30" stroke={C.teal} strokeWidth={1.6} fill="none" />
              <polygon points="216,34 224,34 220,26" fill={C.teal} />
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Each station is its own LLM call (or its own internal agent). The Judge is the most
            critical - if it always says "I have enough", you have naive RAG with extra steps. If
            it never says "enough", you have cost runaway.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Agent Rewrites Its Own Query
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Query rewriting is the smartest part of the loop. The Judge identifies what is missing;
            the Refine step turns that gap into a sharper next query. Three iterations on a real
            research question.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {QUERY_REWRITE_TRACE.map((q) => (
              <div key={`rw-${q.iter}`} style={{ ...tintedCard(C.cyan), padding: 12 }}>
                <span style={pill(C.cyan)}>{`ITERATION ${q.iter}`}</span>
                <T color={C.cyan} bold center size={14} style={{ marginTop: 8 }}>
                  Query: {q.query}
                </T>
                <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                  Results: {q.results}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            Each iteration narrows toward what the Judge wanted. By iteration 3, the query is so
            specific that the top-K results are all relevant. The agent has effectively learned the
            query specification by doing the search.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Example: Customer-Impact Issues Past 90 Days
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The research-style query the agent answers across the full loop. Trace through 5 steps
            from initial query to final aggregated summary table.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {RESEARCH_QUERY_STEPS.map((s) => {
              const accent = C[s.color];
              const soft = SOFT[s.color];
              return (
                <div key={`rs-${s.step}`} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{`STEP ${s.step} - ${s.actor.toUpperCase()}`}</span>
                  <T color={soft} center size={13} style={{ marginTop: 8 }}>
                    {s.detail}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            The final aggregation is a structured artifact: 8 incidents with dates, severity
            ratings, and resolution summaries. Naive RAG could not have produced this - it has no
            way to broaden a search when the first attempt is too narrow.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            When To Iterate Retrieval
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Agentic RAG costs 3-10x more than naive RAG. Use it when the answer quality matters
            more than the latency. Otherwise stick with the naive pipeline (Section 12.2).
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {NAIVE_VS_AGENTIC_DECISION.map((d) => {
              const accent = C[d.color];
              const soft = SOFT[d.color];
              return (
                <div key={d.pick} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{d.pick.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {d.pick}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    When: {d.when}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Example: {d.examples}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Cost: {d.cost}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 14 }}>
            Naive RAG pipeline - covered in Section 12.2 - here we contrast with the iterative
            loop. Agentic RAG mechanics covered in Section 12.29 - here we frame it as a multi-
            agent pattern that closes out the multi-agent chapters.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
};
