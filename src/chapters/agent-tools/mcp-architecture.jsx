import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// --- Chapter 13.13 McpArchitecture data ---

// Three MCP roles shown in sub=0. Each one is a vertically stacked card with its own color.
const MCP_ROLES = [
  {
    title: "Host",
    color: C.purple,
    soft: SOFT.purple,
    desc: "The application the user runs. It owns the UI, the model, and the user data. Examples: Claude Desktop, your IDE, a custom agent app.",
  },
  {
    title: "Client",
    color: C.indigo,
    soft: SOFT.indigo,
    desc: "A connection living inside the host. The host creates one client per server it wants to talk to. The client speaks the MCP wire protocol.",
  },
  {
    title: "Server",
    color: C.blue,
    soft: SOFT.blue,
    desc: "A separate process or remote service that exposes tools, resources, and prompts. The host never knows about them until the server lists them.",
  },
];

// One host containing 3 clients, each wired to a different server, used in sub=1.
const TOPOLOGY_CLIENTS = [
  { label: "Client 1", cx: 130, server: { name: "Server 1", desc: "Postgres tool", cx: 130 } },
  { label: "Client 2", cx: 280, server: { name: "Server 2", desc: "Linear tool", cx: 280 } },
  { label: "Client 3", cx: 430, server: { name: "Server 3", desc: "Filesystem tool", cx: 430 } },
];

// Three MCP transports shown in sub=2.
const TRANSPORTS = [
  {
    name: "Stdio",
    color: C.purple,
    soft: SOFT.purple,
    nature: "Local only",
    desc: "Host launches the server as a child process and pipes JSON-RPC messages over stdin and stdout. Fastest, no network in play.",
    when: "Used by Claude Desktop and local MCP servers running on your machine.",
  },
  {
    name: "HTTP",
    color: C.indigo,
    soft: SOFT.indigo,
    nature: "Network",
    desc: "Standard request and response over HTTPS. Supports remote servers across the internet. Needs auth headers and TLS like any web API.",
    when: "Used when the server is a hosted service and the host is calling it over a network.",
  },
  {
    name: "SSE",
    color: C.blue,
    soft: SOFT.blue,
    nature: "Network plus streaming",
    desc: "Server-Sent Events: a one-way streaming channel from server to host on top of HTTP. Lets the server push intermediate updates without polling.",
    when: "Used when the server needs to push partial results, progress, or long-running notifications.",
  },
];

// Five lifecycle steps shown in sub=3 of 13.13.
const MCP_LIFECYCLE_STEPS = [
  {
    label: "Host Launches Client",
    note: "The host creates a client connection per server.",
  },
  {
    label: "Client Connects To Server",
    note: "Stdio child process or HTTP/SSE socket opens.",
  },
  {
    label: "Initialize Handshake",
    note: "Both sides exchange protocol version and capabilities.",
  },
  {
    label: "List Available Tools / Resources / Prompts",
    note: "Server tells the host what it can do.",
  },
  {
    label: "Call A Tool, Get A Result",
    note: "Host invokes a named capability and receives the response.",
  },
];

// JSON-ish lines for the tools/list response artifact in sub=4. Rendered as plain styled mono text,
// NOT inside a <code> tag. Each line preserves indentation as part of the artifact look.
const TOOLS_LIST_LINES = [
  "{",
  '  "tools": [',
  "    {",
  '      "name": "search_kb",',
  '      "description": "Search the customer support knowledge base.",',
  '      "input_schema": { "query": "string" }',
  "    },",
  "    {",
  '      "name": "lookup_customer",',
  '      "description": "Look up customer by email.",',
  '      "input_schema": { "email": "string" }',
  "    }",
  "  ]",
  "}",
];

export default function McpArchitecture(ctx) {
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
            Host, Client, Server
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            MCP splits the agent stack into three roles. The host is the application the user opens. Inside that host
            runs a client for each tool server it wants to talk to. The server is a separate process that exposes tools,
            resources, and prompts for the host to discover.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center bold size={14}>
              The Three Roles
            </T>
            <svg
              viewBox="0 0 560 320"
              style={{ width: "100%", maxWidth: 560, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Three vertically stacked role boxes showing MCP host application on top hosting a client connection in
                the middle that speaks to a tool server at the bottom.
              </desc>

              {/* Host (top) */}
              <rect
                x="80"
                y="20"
                width="400"
                height="80"
                rx="10"
                fill={`${C.purple}1f`}
                stroke={C.purple}
                strokeWidth="2"
              />
              <text x="280" y="48" fill={C.purple} fontSize="16" fontWeight="700" textAnchor="middle">
                Host
              </text>
              <text x="280" y="68" fill={SOFT.purple} fontSize="12" textAnchor="middle">
                The user-facing app: Claude Desktop, your IDE, a custom agent
              </text>
              <text x="280" y="84" fill={SOFT.purple} fontSize="11" fontStyle="italic" textAnchor="middle">
                Owns the model, the UI, and the user data
              </text>

              {/* Connector host -> client */}
              <line x1="280" y1="100" x2="280" y2="130" stroke={SOFT.purple} strokeWidth="1.5" />
              <polygon points="280,130 274,124 286,124" fill={SOFT.purple} />

              {/* Client (middle) */}
              <rect
                x="120"
                y="130"
                width="320"
                height="80"
                rx="10"
                fill={`${C.indigo}1f`}
                stroke={C.indigo}
                strokeWidth="2"
              />
              <text x="280" y="158" fill={C.indigo} fontSize="16" fontWeight="700" textAnchor="middle">
                Client
              </text>
              <text x="280" y="178" fill={SOFT.indigo} fontSize="12" textAnchor="middle">
                Lives inside the host, one per server connection
              </text>
              <text x="280" y="194" fill={SOFT.indigo} fontSize="11" fontStyle="italic" textAnchor="middle">
                Speaks the MCP wire protocol over a chosen transport
              </text>

              {/* Connector client -> server */}
              <line x1="280" y1="210" x2="280" y2="240" stroke={SOFT.blue} strokeWidth="1.5" />
              <polygon points="280,240 274,234 286,234" fill={SOFT.blue} />

              {/* Server (bottom) */}
              <rect
                x="80"
                y="240"
                width="400"
                height="80"
                rx="10"
                fill={`${C.blue}1f`}
                stroke={C.blue}
                strokeWidth="2"
              />
              <text x="280" y="268" fill={C.blue} fontSize="16" fontWeight="700" textAnchor="middle">
                Server
              </text>
              <text x="280" y="288" fill={SOFT.blue} fontSize="12" textAnchor="middle">
                Separate process or remote service
              </text>
              <text x="280" y="304" fill={SOFT.blue} fontSize="11" fontStyle="italic" textAnchor="middle">
                Provides tools, resources, prompts
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            {MCP_ROLES.map((r) => (
              <div
                key={r.title}
                style={{
                  ...tintedCard(r.color),
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  textAlign: "center",
                }}
              >
                <T color={r.color} bold center size={15}>
                  {r.title}
                </T>
                <T color={r.soft} center size={13}>
                  {r.desc}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            Three roles, one wire format. The host always owns the trust boundary; the server always sits on the other
            side; the client is the in-process adapter that connects them.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            One Host, Many Clients, Many Servers
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            The typical MCP topology is a hub. 1 host launches many clients - one per server it wants to talk to. Each
            client maintains its own connection. The host stitches all the listed tools into a single catalog the model
            can pick from. Here a single host hosts 3 clients, each wired to a different server.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <T color={SOFT.indigo} center bold size={14}>
              1 Host, 3 Clients, 3 Servers
            </T>
            <T color={SOFT.indigo} center size={13} style={{ marginTop: 4 }}>
              Each client owns one server connection. The host is the hub.
            </T>
            <svg
              viewBox="0 0 560 340"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                One host application contains three internal client connections each linked downward to a separate MCP
                server providing different tools.
              </desc>

              {/* Host outer rectangle wrapping all 3 clients */}
              <rect
                x="40"
                y="20"
                width="480"
                height="110"
                rx="10"
                fill={`${C.purple}14`}
                stroke={C.purple}
                strokeWidth="2"
              />
              <text x="280" y="42" fill={C.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Host (Claude Desktop)
              </text>

              {/* Three clients inside the host */}
              {TOPOLOGY_CLIENTS.map((c) => (
                <g key={c.label}>
                  <rect
                    x={c.cx - 55}
                    y="60"
                    width="110"
                    height="50"
                    rx="8"
                    fill={`${C.indigo}24`}
                    stroke={C.indigo}
                    strokeWidth="1.5"
                  />
                  <text x={c.cx} y="82" fill={C.indigo} fontSize="13" fontWeight="700" textAnchor="middle">
                    {c.label}
                  </text>
                  <text x={c.cx} y="100" fill={SOFT.indigo} fontSize="10" textAnchor="middle">
                    MCP connection
                  </text>
                </g>
              ))}

              {/* Transport lines from each client to its server */}
              {TOPOLOGY_CLIENTS.map((c) => (
                <g key={`line-${c.label}`}>
                  <line x1={c.cx} y1="110" x2={c.server.cx} y2="220" stroke={SOFT.blue} strokeWidth="1.5" />
                </g>
              ))}

              {/* Three servers at the bottom */}
              {TOPOLOGY_CLIENTS.map((c) => (
                <g key={c.server.name}>
                  <rect
                    x={c.server.cx - 70}
                    y="220"
                    width="140"
                    height="80"
                    rx="8"
                    fill={`${C.blue}1f`}
                    stroke={C.blue}
                    strokeWidth="1.5"
                  />
                  <text x={c.server.cx} y="246" fill={C.blue} fontSize="13" fontWeight="700" textAnchor="middle">
                    {c.server.name}
                  </text>
                  <text x={c.server.cx} y="266" fill={SOFT.blue} fontSize="12" textAnchor="middle">
                    {c.server.desc}
                  </text>
                  <text x={c.server.cx} y="284" fill={SOFT.blue} fontSize="10" fontStyle="italic" textAnchor="middle">
                    Separate process
                  </text>
                </g>
              ))}

              {/* Row label */}
              <text x="280" y="325" fill={SOFT.indigo} fontSize="11" fontStyle="italic" textAnchor="middle">
                One host orchestrates many client connections, each to its own server
              </text>
            </svg>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            This is the standard topology. The host is the hub - it adds or drops servers without the servers ever
            talking to each other. The Postgres server has no idea the Linear server is also connected, and the model
            sees one merged toolset from all three.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Stdio, HTTP, SSE
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The MCP wire format is the same JSON-RPC regardless of how the bytes travel. There are three transports in
            common use. Stdio is local-only and runs the server as a child process. HTTP is the network workhorse for
            remote servers. SSE (Server-Sent Events) adds a streaming channel on top of HTTP so the server can push
            intermediate updates.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {TRANSPORTS.map((t) => (
              <div
                key={t.name}
                style={{
                  ...tintedCard(t.color),
                  padding: "14px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={pill(t.color)}>{t.name.toUpperCase()}</span>
                <T color={t.color} bold center size={15}>
                  {t.name}
                </T>
                <T color={t.soft} center size={13}>
                  Nature: {t.nature}
                </T>
                <T color={t.soft} center size={13}>
                  {t.desc}
                </T>
                <div
                  style={{
                    marginTop: 4,
                    padding: "5px 10px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: t.soft,
                    textAlign: "center",
                  }}
                >
                  When to use: {t.when}
                </div>
              </div>
            ))}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 14 }}>
            Pick stdio when the server runs on the same machine and you want zero network surface. Pick HTTP when the
            server is hosted somewhere else. Pick SSE on top of HTTP when the server needs to stream progress back, like
            a long-running build or a search that returns partial results.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            How A Session Begins And Runs
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            An MCP session follows a fixed lifecycle: connect, then negotiate, then discover, then call. The Initialize
            Handshake exchanges protocol version and capabilities; the list step tells the host what is available; only
            then do tool calls flow.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center bold size={14}>
              Five Step Flow
            </T>
            <svg
              viewBox="0 0 720 200"
              style={{ width: "100%", maxWidth: 720, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Five step horizontal flow diagram showing host launches client, client connects to server, initialize
                handshake, list available tools and resources and prompts, then call a tool and get a result.
              </desc>

              {/* Five step boxes laid out left to right. viewBox is 720 wide; 5 boxes of 130 wide
                  with 4 gaps of 12 + outer padding. Total span = 5*130 + 4*12 = 698. Padding (720-698)/2 = 11. */}
              {MCP_LIFECYCLE_STEPS.map((s, i) => {
                const x = 11 + i * (130 + 12);
                return (
                  <g key={s.label}>
                    <rect
                      x={x}
                      y="30"
                      width="130"
                      height="80"
                      rx="8"
                      fill={`${C.cyan}1f`}
                      stroke={C.cyan}
                      strokeWidth="1.5"
                    />
                    <text x={x + 65} y="58" fill={C.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                      {i + 1}.
                    </text>
                    {/* Wrap label in two lines if long. Use tspan-friendly split on whitespace. */}
                    <foreignObject x={x + 5} y="62" width="120" height="50">
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          color: SOFT.cyan,
                          fontSize: 11,
                          fontWeight: 700,
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {s.label}
                      </div>
                    </foreignObject>
                    {/* Note under the box */}
                    <foreignObject x={x - 5} y="115" width="140" height="70">
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          color: SOFT.cyan,
                          fontSize: 10,
                          textAlign: "center",
                          fontStyle: "italic",
                          lineHeight: 1.25,
                        }}
                      >
                        {s.note}
                      </div>
                    </foreignObject>

                    {/* Arrow between boxes (skip after last) */}
                    {i < MCP_LIFECYCLE_STEPS.length - 1 && (
                      <g>
                        <line x1={x + 130} y1="70" x2={x + 130 + 12} y2="70" stroke={SOFT.cyan} strokeWidth="1.5" />
                        <polygon points={`${x + 130 + 12},70 ${x + 130 + 6},66 ${x + 130 + 6},74`} fill={SOFT.cyan} />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The lifecycle matters because the host cannot just call a tool blind. It must finish the Initialize
            Handshake (so both sides agree on protocol version) and then call list before it knows any tool names. Only
            after list returns does the model see a populated tool catalog.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Listing Capabilities
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Discovery is what makes MCP plug-and-play. The host sends a tools/list request; the server responds with the
            full catalog: each tool&apos;s name, human-readable description, and JSON schema for its input. The host
            hands this list to the model as the tool definitions for the next call.
          </T>

          <div
            style={{
              ...tintedCard(C.teal),
              padding: 12,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={SOFT.teal} center bold size={14}>
              MCP Message (Shape) - tools/list Response
            </T>
            <div
              style={{
                marginTop: 10,
                background: `${C.teal}06`,
                border: `1px solid ${C.teal}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.teal,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {TOOLS_LIST_LINES.join("\n")}
            </div>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            The host takes this list, merges it with any other servers&apos; catalogs, and passes the combined set as
            the model&apos;s tool definitions on the next turn. That is how an agent built on MCP picks up new
            capabilities without code changes on the host.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
