import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// --- Chapter 13.15 BuildingMcpServer data ---

// Five phases of an MCP server skeleton, shown as a numbered checklist in sub=0.
const SERVER_PHASES = [
  {
    n: 1,
    title: "Define Identity",
    detail: "Name, Version",
    color: C.purple,
    soft: SOFT.purple,
  },
  {
    n: 2,
    title: "Declare Tools",
    detail: "Callable Actions With Schemas",
    color: C.indigo,
    soft: SOFT.indigo,
  },
  {
    n: 3,
    title: "Declare Resources",
    detail: "URI Patterns The Host Can Read",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    n: 4,
    title: "Declare Prompts",
    detail: "Parameterized Templates Users Can Pick",
    color: C.cyan,
    soft: SOFT.cyan,
  },
  {
    n: 5,
    title: "Start",
    detail: "Begin Listening On Transport",
    color: C.teal,
    soft: SOFT.teal,
  },
];

// Mono-text lines for the tool registration artifact in sub=1.
const TOOL_REG_LINES = [
  "Server.registerTool({",
  '  name: "search_kb",',
  '  description: "Search the customer support knowledge base.",',
  '  inputSchema: { query: "string" },',
  "  handler: async ({ query }) => { /* search logic */ }",
  "})",
];

// Mono-text lines for the resource registration artifact in sub=2.
const RESOURCE_REG_LINES = [
  "Server.registerResource({",
  '  uriPattern: "kb://articles/{id}",',
  '  description: "Knowledge base article by ID.",',
  "  handler: async ({ id }) => readMarkdown(id)",
  "})",
];

// Mono-text lines for the prompt registration artifact in sub=3.
const PROMPT_REG_LINES = [
  "Server.registerPrompt({",
  '  name: "summarize_ticket",',
  '  description: "Summarize a support ticket.",',
  "  arguments: [",
  '    { name: "ticket_id", required: true },',
  '    { name: "max_words", required: false }',
  "  ],",
  "  handler: async ({ ticket_id, max_words }) => buildPrompt(ticket_id, max_words)",
  "})",
];

// Four lifecycle states for the sub=4 SVG diagram. Each transition is the event that triggers it.
const LIFECYCLE_STATES = [
  { label: "REGISTERED", note: "Definitions Declared", color: C.purple, soft: SOFT.purple },
  { label: "LISTENING", note: "Transport Open", color: C.indigo, soft: SOFT.indigo },
  { label: "ACTIVE", note: "Handling list / call Requests", color: C.blue, soft: SOFT.blue },
  { label: "CLOSED", note: "Shutdown", color: C.red, soft: SOFT.red },
];

const LIFECYCLE_TRANSITIONS = ["connect()", "initialize", "shutdown()"];

// Four testing strategies shown as stacked sub-cards in sub=5.
const TEST_STRATEGIES = [
  {
    title: "Test Handler Functions As Plain Unit Tests",
    detail: "Call them directly with sample inputs and assert the returned value.",
    color: C.cyan,
    soft: SOFT.cyan,
  },
  {
    title: "Test List Responses",
    detail: "Assert all declared tools, resources, and prompts appear in the catalog.",
    color: C.indigo,
    soft: SOFT.indigo,
  },
  {
    title: "Test Transport Connection",
    detail: "Spin the server up over stdio or HTTP and assert the initialize handshake completes.",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    title: "Use A Mock Host Before Connecting To A Real LLM",
    detail: "Drive list and call from a scripted host to catch contract bugs without paying for tokens.",
    color: C.teal,
    soft: SOFT.teal,
  },
];

export default function BuildingMcpServer(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What An MCP Server Declares
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            An MCP server is mostly a sequence of declarations followed by a start. You give it a name and version, then
            register tools, resources, and prompts, then call start. The server itself is short. The handlers do the
            real work.
          </T>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {SERVER_PHASES.map((p) => (
              <div
                key={p.n}
                style={{
                  ...tintedCard(p.color),
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: `${p.color}20`,
                    color: p.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    border: `1px solid ${p.color}40`,
                  }}
                >
                  {p.n}
                </div>
                <div>
                  <T color={p.color} bold size={17}>
                    {p.title}
                  </T>
                  <T color={p.soft} size={14} style={{ marginTop: 2 }}>
                    {p.detail}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}
          >
            <T color={SOFT.purple} center size={15}>
              Each declaration registers what the server offers; start opens the connection.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Tool: search_kb
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Registering a tool means giving it a name, a description the model will read, an input schema for arguments,
            and a handler that does the work on the server side. Everything but the handler is shipped to the host; the
            handler stays on the server.
          </T>

          <div
            style={{
              ...tintedCard(C.indigo),
              padding: 12,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={SOFT.indigo} center bold size={14}>
              MCP Server - Tool Registration (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                background: `${C.indigo}06`,
                border: `1px solid ${C.indigo}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.indigo,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
                display: "inline-block",
              }}
            >
              {TOOL_REG_LINES.join("\n")}
            </div>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Name and description are what the model sees; inputSchema is the contract for the arguments. The handler is
            the real function. Handler runs server-side, NOT in the model&apos;s context.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Resource: kb://articles/{"{id}"}
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Resources are addressed by URI patterns. The server registers a template like kb://articles/{"{id}"}; the
            host requests a concrete URI; the server matches the template and runs the handler to produce the content.
          </T>

          <div
            style={{
              ...tintedCard(C.blue),
              padding: 12,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={SOFT.blue} center bold size={14}>
              MCP Server - Resource Registration (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.blue,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
                display: "inline-block",
              }}
            >
              {RESOURCE_REG_LINES.join("\n")}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}
          >
            <T color={SOFT.blue} center size={14}>
              Host requests <span style={{ fontFamily: "monospace" }}>kb://articles/password-reset</span>.
            </T>
            <T color={SOFT.blue} center size={14} style={{ marginTop: 6 }}>
              Server matches the template, reads the markdown doc, returns the body.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Prompt: summarize_ticket
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Registering a prompt means declaring a named template and the arguments it needs. The host collects argument
            values from the user, then asks the server to materialize the final prompt text.
          </T>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 12,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={SOFT.cyan} center bold size={14}>
              MCP Server - Prompt Registration (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
                display: "inline-block",
              }}
            >
              {PROMPT_REG_LINES.join("\n")}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Server returns the resolved prompt string when the host invokes it with arguments.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Server Lifecycle
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            From the moment the server boots until it shuts down, it moves through four states. Most of the lifetime is
            spent in ACTIVE, where it handles list and call requests from the host.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14 }}>
            <T color={SOFT.teal} center bold size={14}>
              Lifecycle States
            </T>
            <svg
              viewBox="0 0 720 200"
              style={{ width: "100%", maxWidth: 720, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Four-stage server lifecycle diagram showing registered then listening then active handling requests then
                closed shutdown.
              </desc>

              {/* Four state boxes. viewBox 720 wide; 4 boxes of 150 wide with 3 gaps of 30 +
                  outer padding. Total span = 4*150 + 3*30 = 690. Padding (720-690)/2 = 15. */}
              {LIFECYCLE_STATES.map((s, i) => {
                const x = 15 + i * (150 + 30);
                return (
                  <g key={s.label}>
                    <rect
                      x={x}
                      y="60"
                      width="150"
                      height="80"
                      rx="12"
                      fill={`${s.color}1f`}
                      stroke={s.color}
                      strokeWidth="2"
                    />
                    <text x={x + 75} y="92" fill={s.color} fontSize="15" fontWeight="700" textAnchor="middle">
                      {s.label}
                    </text>
                    <text x={x + 75} y="116" fill={s.soft} fontSize="12" textAnchor="middle">
                      {s.note}
                    </text>
                  </g>
                );
              })}

              {/* Arrows between the four boxes. Each gap is 30 wide between x=165 (end of box i)
                  and x=195 (start of box i+1). Arrow goes from x+150 to x+150+30. */}
              {LIFECYCLE_TRANSITIONS.map((label, i) => {
                const x1 = 15 + i * (150 + 30) + 150;
                const x2 = x1 + 30;
                const mid = (x1 + x2) / 2;
                return (
                  <g key={label}>
                    <line x1={x1} y1="100" x2={x2 - 6} y2="100" stroke={SOFT.teal} strokeWidth="1.5" />
                    <polygon points={`${x2},100 ${x2 - 6},96 ${x2 - 6},104`} fill={SOFT.teal} />
                    <text x={mid} y="88" fill={SOFT.teal} fontSize="11" fontFamily="monospace" textAnchor="middle">
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              marginTop: 12,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
              borderRadius: 8,
              padding: 12,
              textAlign: "center",
            }}
          >
            <T color={SOFT.teal} center size={15}>
              Most requests are handled in ACTIVE: list, call, read, prompt-get.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Test Before Connecting
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            An MCP server is just a process with handlers and a transport. You can - and should - test every piece in
            isolation before plugging it into a real host with a real model.
          </T>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {TEST_STRATEGIES.map((s) => (
              <div
                key={s.title}
                style={{
                  ...tintedCard(s.color),
                  padding: 14,
                  textAlign: "left",
                }}
              >
                <T color={s.color} bold size={16}>
                  {s.title}
                </T>
                <T color={s.soft} size={14} style={{ marginTop: 4 }}>
                  {s.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            Production hygiene: test the server in isolation, then wire it to the host.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
