import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by THIS chapter:
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

export default function OrchestratorWorker(ctx) {
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
}
