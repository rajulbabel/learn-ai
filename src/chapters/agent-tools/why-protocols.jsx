import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Chapters 25.6 - 25.11

// --- Chapter 25.6 WhyProtocols data ---

// Agent nodes on the top row of the sprawl + hub diagrams (sub=0, sub=1).
const SPRAWL_AGENTS = [
  { label: "Agent A", cx: 100 },
  { label: "Agent B", cx: 190 },
  { label: "Agent C", cx: 280 },
  { label: "Agent D", cx: 370 },
  { label: "Agent E", cx: 460 },
];

// Tool nodes on the bottom row of the sprawl + hub diagrams.
const SPRAWL_TOOLS = [
  { label: "Search", cx: 85 },
  { label: "Email", cx: 163 },
  { label: "Refund", cx: 241 },
  { label: "Calendar", cx: 319 },
  { label: "CRM", cx: 397 },
  { label: "Files", cx: 475 },
];

// Three rival protocols introduced in sub=2.
const PROTOCOL_CARDS = [
  {
    pill: "MCP",
    name: "Model Context Protocol",
    color: C.purple,
    soft: SOFT.purple,
    connects: "Agent <-> Tools, Resources, Prompts",
    desc: "Anthropic-led open protocol. Lets any agent host discover and call any compliant tool server without bespoke glue. The dominant pattern for production agent tooling.",
    status: "Production today",
  },
  {
    pill: "A2A",
    name: "Agent To Agent",
    color: C.indigo,
    soft: SOFT.indigo,
    connects: "Agent <-> Agent",
    desc: "Google-driven open spec. Lets a planner agent delegate work to specialist agents over a shared message envelope. Useful when one agent does not own all the tools.",
    status: "Newer, Google-driven",
  },
  {
    pill: "OPENAPI",
    name: "HTTP + OpenAPI",
    color: C.blue,
    soft: SOFT.blue,
    connects: "Service <-> Service (legacy transport)",
    desc: "The HTTP and OpenAPI spec the rest of the internet already speaks. Agents can call these too, but the agent host has to translate every endpoint into a tool definition by hand.",
    status: "Legacy, still common",
  },
];

// 2x2 decision quadrants used in sub=3.
const QUADRANTS = [
  {
    title: "Few Tools / Few Agents",
    color: C.green,
    soft: SOFT.green,
    desc: "1-2 tools, 1-2 agents. The hand-wired connectors are still readable. Skip the protocol layer until growth forces it.",
    verdict: "Ad-Hoc Fine",
  },
  {
    title: "Many Tools / Few Agents",
    color: C.yellow,
    soft: SOFT.yellow,
    desc: "Tool list keeps growing but the agent count is stable. Standardize the tool side so new tools self-describe to the same agent.",
    verdict: "Protocol On Tool Side",
  },
  {
    title: "Few Tools / Many Agents",
    color: C.orange,
    soft: SOFT.orange,
    desc: "A handful of high-value tools but many agents (user, planner, evaluator). Standardize the agent side so every agent reads the same tool catalog.",
    verdict: "Protocol On Agent Side",
  },
  {
    title: "Many Tools / Many Agents",
    color: C.cyan,
    soft: SOFT.cyan,
    desc: "Production scale. Both sides must converge on the same wire format or every release introduces O(M x N) integration work.",
    verdict: "Full Protocol Mesh",
  },
];

export default function WhyProtocols(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  // Build all sprawl lines for sub=0: every agent connected to every tool.
  const sprawlLines = [];
  for (const a of SPRAWL_AGENTS) {
    for (const t of SPRAWL_TOOLS) {
      sprawlLines.push({ x1: a.cx, y1: 80, x2: t.cx, y2: 200 });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Ad-Hoc Tools Don&apos;t Scale
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Every agent needs to call every tool. Without a shared protocol you end up writing a custom connector for
            each pair. With 5 agents and 6 tools that is already 30 bespoke integrations. Each new tool forces every
            agent to learn it; each new agent forces every tool&apos;s API to be re-wrapped.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center size={13}>
              5 Agents x 6 Tools = 30 Connectors. Hand-wired sprawl.
            </T>
            <svg
              viewBox="0 0 560 256"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Five agents top row, six tools bottom row, every agent connects to every tool producing thirty crossed
                lines that visualize the M times N ad-hoc tool sprawl problem.
              </desc>
              {/* Connector lines: every agent to every tool */}
              {sprawlLines.map((ln, i) => (
                <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={`${C.red}99`} strokeWidth="1" />
              ))}

              {/* Agent nodes - top row */}
              {SPRAWL_AGENTS.map((a) => (
                <g key={a.label}>
                  <rect
                    x={a.cx - 30}
                    y="50"
                    width="60"
                    height="30"
                    rx="6"
                    fill={`${C.purple}24`}
                    stroke={C.purple}
                    strokeWidth="1.5"
                  />
                  <text x={a.cx} y="70" fill={SOFT.purple} fontSize="11" fontWeight="700" textAnchor="middle">
                    {a.label}
                  </text>
                </g>
              ))}

              {/* Tool nodes - bottom row */}
              {SPRAWL_TOOLS.map((t) => (
                <g key={t.label}>
                  <rect
                    x={t.cx - 30}
                    y="200"
                    width="60"
                    height="30"
                    rx="6"
                    fill={`${C.orange}24`}
                    stroke={C.orange}
                    strokeWidth="1.5"
                  />
                  <text x={t.cx} y="220" fill={SOFT.orange} fontSize="11" fontWeight="700" textAnchor="middle">
                    {t.label}
                  </text>
                </g>
              ))}

              {/* Row labels */}
              <text x="20" y="38" fill={SOFT.purple} fontSize="12" fontWeight="700">
                Agents
              </text>
              <text x="20" y="250" fill={SOFT.orange} fontSize="12" fontWeight="700">
                Tools
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            Every new tool needs every agent to learn it; every new agent needs every tool&apos;s API rewritten. The
            connectors grow as M x N - five times six is the small case, and it already looks like a tangle.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            A Protocol Turns M x N Into M + N
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            A protocol is a shared contract that sits in the middle. Each agent speaks it once; each tool speaks it
            once. Same 5 agents, same 6 tools, but now 5 + 6 = 11 clean lines instead of 30. The hub-and-spoke shape is
            what makes the system additive instead of multiplicative.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <T color={SOFT.indigo} center bold size={14}>
              Hub And Spoke
            </T>
            <T color={SOFT.indigo} center size={13} style={{ marginTop: 4 }}>
              30 connectors -&gt; 11 connectors. M x N -&gt; M + N.
            </T>
            <svg
              viewBox="0 0 560 280"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Five agents on top connect to six tools on bottom via a single protocol hub in the middle, reducing
                thirty crossed lines to eleven clean lines and demonstrating M plus N scaling.
              </desc>

              {/* Lines from agents to hub */}
              {SPRAWL_AGENTS.map((a) => (
                <line key={`a-${a.label}`} x1={a.cx} y1="80" x2="280" y2="140" stroke={C.indigo} strokeWidth="1.5" />
              ))}

              {/* Lines from hub to tools */}
              {SPRAWL_TOOLS.map((t) => (
                <line key={`t-${t.label}`} x1="280" y1="170" x2={t.cx} y2="220" stroke={C.indigo} strokeWidth="1.5" />
              ))}

              {/* Agent nodes - top row */}
              {SPRAWL_AGENTS.map((a) => (
                <g key={a.label}>
                  <rect
                    x={a.cx - 30}
                    y="50"
                    width="60"
                    height="30"
                    rx="6"
                    fill={`${C.purple}24`}
                    stroke={C.purple}
                    strokeWidth="1.5"
                  />
                  <text x={a.cx} y="70" fill={SOFT.purple} fontSize="11" fontWeight="700" textAnchor="middle">
                    {a.label}
                  </text>
                </g>
              ))}

              {/* Hub in the middle */}
              <rect
                x="220"
                y="135"
                width="120"
                height="40"
                rx="8"
                fill={`${C.indigo}33`}
                stroke={C.indigo}
                strokeWidth="2"
              />
              <text x="280" y="153" fill={SOFT.indigo} fontSize="13" fontWeight="700" textAnchor="middle">
                Protocol
              </text>
              <text x="280" y="168" fill={SOFT.indigo} fontSize="11" textAnchor="middle">
                Shared hub
              </text>

              {/* Tool nodes - bottom row */}
              {SPRAWL_TOOLS.map((t) => (
                <g key={t.label}>
                  <rect
                    x={t.cx - 30}
                    y="220"
                    width="60"
                    height="30"
                    rx="6"
                    fill={`${C.orange}24`}
                    stroke={C.orange}
                    strokeWidth="1.5"
                  />
                  <text x={t.cx} y="240" fill={SOFT.orange} fontSize="11" fontWeight="700" textAnchor="middle">
                    {t.label}
                  </text>
                </g>
              ))}

              {/* Row labels */}
              <text x="20" y="38" fill={SOFT.purple} fontSize="12" fontWeight="700">
                Agents (M = 5)
              </text>
              <text x="20" y="270" fill={SOFT.orange} fontSize="12" fontWeight="700">
                Tools (N = 6)
              </text>
            </svg>
          </div>

          <div
            style={{
              ...tintedCard(C.indigo),
              padding: 12,
              marginTop: 12,
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.indigo,
            }}
          >
            Add a 6th agent -&gt; 1 new connector. Add a 7th tool -&gt; 1 new connector. No agent rewrites a tool API
            ever again.
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Same number of components, drastically different cost of change. That is the whole reason protocols exist -
            the math turns from O(M x N) to O(M + N).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            MCP, A2A, OpenAPI
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Three protocols you will run into. Each one picks a different shape of edge to standardize. MCP standardizes
            the edge between an agent host and tool servers. A2A standardizes the edge between two agents. HTTP +
            OpenAPI is the older general-purpose stack the rest of the internet runs on.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {PROTOCOL_CARDS.map((p) => (
              <div
                key={p.pill}
                style={{
                  ...tintedCard(p.color),
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={pill(p.color)}>{p.pill}</span>
                <T color={p.color} bold center size={15}>
                  {p.name}
                </T>
                <T color={p.soft} center size={13}>
                  Connects: {p.connects}
                </T>
                <T color={p.soft} center size={13}>
                  {p.desc}
                </T>
                <div
                  style={{
                    marginTop: 4,
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: p.soft,
                    textAlign: "center",
                  }}
                >
                  Status: {p.status}
                </div>
              </div>
            ))}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            MCP is the one most production agent stacks use today for tool access. A2A is newer and built for
            multi-agent systems. OpenAPI is not agent-specific - it is the underlying HTTP transport, useful when you
            need to expose an agent to existing services or vice versa.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Production Sign: 3+ Tools Or 3+ Agents
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When does the protocol layer pay off? Use the decision grid below. Below the threshold, hand-wired tools are
            fine and a protocol is over-engineering. Above the threshold, the integration math gets ugly fast and the
            protocol is the production move.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {QUADRANTS.map((q) => (
              <div
                key={q.title}
                style={{
                  ...tintedCard(q.color),
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <T color={q.color} bold center size={15}>
                  {q.title}
                </T>
                <T color={q.soft} center size={13}>
                  {q.desc}
                </T>
                <div
                  style={{
                    marginTop: 4,
                    padding: "5px 12px",
                    borderRadius: 6,
                    background: `${q.color}24`,
                    border: `1px solid ${q.color}33`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: q.color,
                    textAlign: "center",
                  }}
                >
                  Verdict: {q.verdict}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 12,
              marginTop: 14,
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Decision rule: cross 3 + 3 (3 tools and 3 agents) and you want a protocol.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The 3 + 3 line is the typical production threshold. The exact number depends on rate of change. If new tools
            land monthly you cross the threshold sooner; if your tool set is frozen at 6, an ad-hoc setup can survive
            longer.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Protocol = Sandbox Contract
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Beyond reducing wiring, a protocol enforces a trust boundary. On the inside sits the host: your user data,
            the model, and the mutations you are willing to authorize. On the outside sits the tool server: third-party
            code you do not control. The protocol is the only channel that crosses the boundary, and it dictates what
            may pass.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <T color={SOFT.teal} center bold size={14}>
              Sandbox Contract
            </T>
            <svg
              viewBox="0 0 560 320"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Concentric ring diagram showing a trusted host containing user data and the model surrounding an
                untrusted server tool, with protocol arrows crossing the boundary for capability listing and tool
                authorization that enforces the sandbox contract.
              </desc>
              {/* Outer ring - Host (Trusted) */}
              <circle cx="280" cy="178" r="118" fill={`${C.teal}0a`} stroke={C.teal} strokeWidth="2" />
              {/* Inner ring - Server (Untrusted) */}
              <circle
                cx="280"
                cy="178"
                r="56"
                fill={`${C.red}12`}
                stroke={C.red}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Outer label (above the ring so the arc never cuts the text) */}
              <text x="280" y="22" fill={SOFT.teal} fontSize="14" fontWeight="700" textAnchor="middle">
                Host (Trusted)
              </text>
              <text x="280" y="42" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                User data, model, allowed mutations
              </text>

              {/* Inner label */}
              <text x="280" y="173" fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Server
              </text>
              <text x="280" y="190" fill={SOFT.red} fontSize="11" textAnchor="middle">
                (Untrusted)
              </text>

              {/* Arrow - capabilities listed (server boundary -> host boundary, upper left) */}
              <line x1="234" y1="146" x2="190" y2="115" stroke={C.purple} strokeWidth="1.5" />
              <polygon points="183,110 193,112 188,119" fill={C.purple} />
              <text x="135" y="98" fill={SOFT.purple} fontSize="11" fontWeight="700">
                Capabilities Listed
              </text>

              {/* Arrow - tool call authorized (host boundary -> server boundary, upper right) */}
              <line x1="377" y1="110" x2="333" y2="141" stroke={C.cyan} strokeWidth="1.5" />
              <polygon points="326,146 331,137 336,145" fill={C.cyan} />
              <text x="380" y="98" fill={SOFT.cyan} fontSize="11" fontWeight="700">
                Tool Calls Authorized
              </text>

              {/* Arrow - results returned (server boundary -> host boundary, lower right) */}
              <line x1="326" y1="210" x2="370" y2="241" stroke={C.green} strokeWidth="1.5" />
              <polygon points="377,246 367,245 372,237" fill={C.green} />
              <text x="380" y="288" fill={SOFT.green} fontSize="11" fontWeight="700">
                Results Returned
              </text>

              {/* Boundary label (below the ring so the arc never cuts the text) */}
              <text x="280" y="314" fill={SOFT.teal} fontSize="11" fontStyle="italic" textAnchor="middle">
                The protocol is the only legal crossing
              </text>
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            The protocol defines what the inner can ask for and what the outer must approve before allowing. Nothing
            else gets through. That sandbox boundary is what makes it safe to plug a third-party tool server into an
            agent that holds user data.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
