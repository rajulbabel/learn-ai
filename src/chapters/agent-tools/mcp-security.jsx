import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// --- Chapter 25.10 McpSecurity data ---

// Sandbox restrictions rendered as sub-cards in sub=1.
const SANDBOX_RULES = [
  {
    title: "Transport Only",
    detail: "The server communicates with the host only over the MCP transport. No back channel.",
  },
  {
    title: "Filesystem Walled Off",
    detail: "No filesystem access except the directories the host explicitly grants.",
  },
  {
    title: "Network Off By Default",
    detail: "No outbound network unless the host opts in for this server.",
  },
];

// Capability-scope dimensions rendered as sub-cards in sub=2.
const SCOPE_DIMENSIONS = [
  {
    pill: "ALLOWED TOOLS",
    title: "Subset Of Declared Tools",
    detail: "The host picks which tools each agent may call.",
    example: "Deny `escalate_human` for junior agents.",
  },
  {
    pill: "ALLOWED RESOURCES",
    title: "Prefix-Matched URIs",
    detail: "Resource access is gated by URI prefix patterns.",
    example: "Allow `kb://articles/*` but not `kb://internal/*`.",
  },
  {
    pill: "ALLOWED MUTATION",
    title: "Read-Only Mode Flag",
    detail: "A flag forces every tool call to be non-mutating, regardless of declaration.",
    example: "Read-only mode for evaluation runs.",
  },
];

// OAuth flow steps for the sub=3 SVG (horizontal).
const OAUTH_STEPS = [
  { n: 1, label: "User Authorizes" },
  { n: 2, label: "Host Gets Access Token" },
  { n: 3, label: "Token Passes To Server" },
  { n: 4, label: "Server Checks Scope" },
];

// Audit log example rows for sub=4.
const AUDIT_ROWS = [
  {
    time: "14:02:11",
    tool: "lookup_customer",
    input: '{ id: "C-104" }',
    result: "OK",
    user: "alice@co",
    decision: "Auto",
  },
  {
    time: "14:02:34",
    tool: "process_refund",
    input: '{ invoice: "INV-9924" }',
    result: "OK",
    user: "alice@co",
    decision: "Approved",
  },
  {
    time: "14:03:02",
    tool: "send_email",
    input: '{ to: "cust@x" }',
    result: "OK",
    user: "alice@co",
    decision: "Approved",
  },
  {
    time: "14:05:50",
    tool: "delete_account",
    input: '{ id: "C-104" }',
    result: "Blocked",
    user: "alice@co",
    decision: "Denied",
  },
];

export default function McpSecurity(ctx) {
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
            Server Code Is Untrusted By Default
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            An MCP server is third-party code. It might be open source, vendor-supplied, or written by a teammate, but
            the host never assumes it is safe. The host holds the user data, the model, and every mutation worth caring
            about. The server holds the tool implementation. The boundary between them is what makes the whole
            architecture safe.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center bold size={14}>
              Trust Boundary
            </T>
            <svg
              viewBox="0 0 560 320"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Trust boundary diagram showing outer host with user data and model trusted ring surrounding inner
                untrusted third party server code with protocol arrows crossing the boundary.
              </desc>
              {/* Outer ring - Host (Trusted) */}
              <circle cx="280" cy="178" r="118" fill={`${C.purple}0a`} stroke={C.purple} strokeWidth="2" />
              {/* Inner ring - Server (Untrusted) */}
              <circle
                cx="280"
                cy="178"
                r="60"
                fill={`${C.red}12`}
                stroke={C.red}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Outer label (above the ring so the arc never cuts the text) */}
              <text x="280" y="22" fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Host (Trusted)
              </text>
              <text x="280" y="42" fill={SOFT.purple} fontSize="11" textAnchor="middle">
                User Data, Model, Allowed Mutations
              </text>

              {/* Inner label */}
              <text x="280" y="172" fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Server
              </text>
              <text x="280" y="189" fill={SOFT.red} fontSize="11" textAnchor="middle">
                (Untrusted)
              </text>
              <text x="280" y="205" fill={SOFT.red} fontSize="10" textAnchor="middle">
                Third-Party Tool Code
              </text>

              {/* Arrow crossing - List (server -> host). Tail rests just outside the r=60 server boundary (center 280,178). */}
              <line x1="230.4" y1="140.8" x2="165" y2="108" stroke={C.cyan} strokeWidth="1.5" />
              <polygon points="165,108 173,111 170,117" fill={C.cyan} />
              <text x="120" y="98" fill={SOFT.cyan} fontSize="11" fontWeight="700">
                List
              </text>

              {/* Arrow crossing - Call (host -> server). Tip rests just outside the r=60 server boundary so it touches, never pokes through. */}
              <line x1="395" y1="108" x2="337.6" y2="134.8" stroke={C.blue} strokeWidth="1.5" />
              <polygon points="330.4,140.2 340.6,138.8 334.6,130.8" fill={C.blue} />
              <text x="400" y="98" fill={SOFT.blue} fontSize="11" fontWeight="700">
                Call
              </text>

              {/* Arrow crossing - Result (server -> host). Tail rests just outside the r=60 server boundary (center 280,178). */}
              <line x1="323.8" y1="221.8" x2="400" y2="268" stroke={C.green} strokeWidth="1.5" />
              <polygon points="400,268 392,265 395,273" fill={C.green} />
              <text x="400" y="288" fill={SOFT.green} fontSize="11" fontWeight="700">
                Result
              </text>

              {/* Boundary caption (below the ring so the arc never cuts the text) */}
              <text x="280" y="314" fill={SOFT.purple} fontSize="11" fontStyle="italic" textAnchor="middle">
                The MCP transport is the only legal crossing
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The host owns the user data and the model. The server runs third-party tool code. The protocol crossing the
            boundary is the only thing the host has to police.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Sandbox: Process Isolation
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            The host launches the server in its own OS process. The host can spawn it, kill it, and shape what it sees,
            but it never shares memory with it. Whatever capability the server wants, it has to ask for over the
            transport.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 14, marginTop: 14 }}>
            <T color={SOFT.indigo} center bold size={14}>
              Host Process Spawns Server Process
            </T>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Host process box on top spawns a server process box on the bottom inside a sandbox container, with a
                labeled spawn arrow and an MCP transport arrow as the only legal channel between them.
              </desc>
              {/* Host process box */}
              <rect
                x="180"
                y="20"
                width="200"
                height="60"
                rx="8"
                fill={`${C.indigo}24`}
                stroke={C.indigo}
                strokeWidth="2"
              />
              <text x="280" y="48" fill={SOFT.indigo} fontSize="14" fontWeight="700" textAnchor="middle">
                Host Process
              </text>
              <text x="280" y="66" fill={SOFT.indigo} fontSize="11" textAnchor="middle">
                Owns User Data + Model
              </text>

              {/* Spawn arrow */}
              <line x1="280" y1="80" x2="280" y2="135" stroke={C.purple} strokeWidth="2" strokeDasharray="4 3" />
              <polygon points="280,140 274,128 286,128" fill={C.purple} />
              <text x="295" y="115" fill={SOFT.purple} fontSize="11" fontWeight="700" textAnchor="start">
                Spawn
              </text>

              {/* Sandbox container */}
              <rect
                x="120"
                y="145"
                width="320"
                height="80"
                rx="10"
                fill={`${C.red}08`}
                stroke={C.red}
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text x="280" y="163" fill={SOFT.red} fontSize="11" fontWeight="700" textAnchor="middle">
                Sandbox
              </text>

              {/* Server process box */}
              <rect x="190" y="170" width="180" height="46" rx="8" fill={`${C.red}24`} stroke={C.red} strokeWidth="2" />
              <text x="280" y="190" fill={SOFT.red} fontSize="13" fontWeight="700" textAnchor="middle">
                Server Process
              </text>
              <text x="280" y="207" fill={SOFT.red} fontSize="11" textAnchor="middle">
                Third-Party Code
              </text>
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {SANDBOX_RULES.map((r) => (
              <div key={r.title} style={{ ...tintedCard(C.indigo), padding: 12, textAlign: "center" }}>
                <T color={C.indigo} bold center size={16}>
                  {r.title}
                </T>
                <T color={SOFT.indigo} center size={14} style={{ marginTop: 4 }}>
                  {r.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            The sandbox is the OS-level fence. Even if the tool code is buggy or hostile, it cannot reach beyond the
            resources the host hands it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Capability Scope Per Host
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Even when a server declares ten tools and a hundred resources, the host can narrow what this particular
            agent is allowed to touch. Scope is a subset of what the server advertises, configured per host.
          </T>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {SCOPE_DIMENSIONS.map((d) => (
              <div key={d.pill} style={{ ...tintedCard(C.blue), padding: 14, textAlign: "center" }}>
                <span style={pill(C.blue)}>{d.pill}</span>
                <T color={C.blue} bold center size={17} style={{ marginTop: 10 }}>
                  {d.title}
                </T>
                <T color={SOFT.blue} center size={14} style={{ marginTop: 4 }}>
                  {d.detail}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    background: `${C.blue}06`,
                    border: `1px solid ${C.blue}12`,
                    borderRadius: 6,
                    padding: 8,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: SOFT.blue,
                    textAlign: "center",
                  }}
                >
                  {d.example}
                </div>
              </div>
            ))}
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
              Capability scope is allow/deny lists at three levels: tool names, resource URI prefixes, and a global
              read-only flag.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            OAuth: Who Granted What
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When the server lives over HTTP, the host has to prove the user authorized it. OAuth is the standard answer:
            the user grants scopes once, the host exchanges that grant for an Access Token, and that token rides along
            on every server request.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center bold size={14}>
              OAuth Flow (Four Steps)
            </T>
            <svg
              viewBox="0 0 560 180"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                OAuth flow showing user authorizes then host gets access token then token passes to server in each
                request then server checks scope.
              </desc>
              {/* Compute symmetric layout: 4 boxes 110 wide, 3 gaps of 25 = 515. Padding (560-515)/2 = 22.5 */}
              {OAUTH_STEPS.map((s, i) => {
                const x = 22.5 + i * 135;
                return (
                  <g key={s.n}>
                    <rect
                      x={x}
                      y="50"
                      width="110"
                      height="80"
                      rx="8"
                      fill={`${C.cyan}24`}
                      stroke={C.cyan}
                      strokeWidth="2"
                    />
                    <circle cx={x + 18} cy="68" r="11" fill={`${C.cyan}40`} stroke={C.cyan} strokeWidth="1.5" />
                    <text x={x + 18} y="72" fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                      {s.n}
                    </text>
                    <text x={x + 55} y="100" fill={SOFT.cyan} fontSize="11" fontWeight="700" textAnchor="middle">
                      {s.label.split(" ").slice(0, 2).join(" ")}
                    </text>
                    <text x={x + 55} y="116" fill={SOFT.cyan} fontSize="11" fontWeight="700" textAnchor="middle">
                      {s.label.split(" ").slice(2).join(" ")}
                    </text>
                    {/* Arrow to next box */}
                    {i < OAUTH_STEPS.length - 1 && (
                      <g>
                        <line x1={x + 110} y1="90" x2={x + 130} y2="90" stroke={C.purple} strokeWidth="2" />
                        <polygon points={`${x + 135},90 ${x + 128},86 ${x + 128},94`} fill={C.purple} />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Title row */}
              <text x="280" y="30" fill={SOFT.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                Grant -&gt; Token -&gt; Request -&gt; Check
              </text>

              {/* Footer */}
              <text x="280" y="165" fill={SOFT.cyan} fontSize="11" fontStyle="italic" textAnchor="middle">
                The Access Token is the proof the server demands on every call
              </text>
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
            <T color={SOFT.cyan} center size={14}>
              Stdio servers skip OAuth because they run under local trust. HTTP servers require it so the host can prove
              which user authorized the call.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Consent + Audit: User Sees Everything
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Sandbox, scope, and OAuth handle the machine side. Consent and audit handle the human side. The host asks
            the user before any side-effecting call, and writes every call to a log the user can review later.
          </T>

          <div style={{ ...tintedCard(C.teal), padding: 14, marginTop: 14, textAlign: "center" }}>
            <T color={C.teal} bold center size={18}>
              Consent Prompts
            </T>
            <T color={SOFT.teal} center size={14} style={{ marginTop: 4 }}>
              The host blocks the call until the user clicks approve or deny.
            </T>
            <div
              style={{
                marginTop: 12,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                borderRadius: 8,
                padding: 14,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.teal,
                textAlign: "left",
                whiteSpace: "pre-wrap",
              }}
            >
              {`About to call process_refund\nFor invoice INV-9924\nReason: "Customer Requested"\n\nAllow?  [Approve]  [Deny]`}
            </div>
            <T color={SOFT.teal} center size={13} style={{ marginTop: 10, fontStyle: "italic" }}>
              Required for side-effecting tools.
            </T>
          </div>

          <div
            style={{
              ...tintedCard(C.teal),
              padding: 14,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={C.teal} bold center size={18}>
              Audit Log
            </T>
            <T color={SOFT.teal} center size={14} style={{ marginTop: 4 }}>
              Every call is recorded: timestamp, tool, input, result, user, and the consent decision.
            </T>
            <div
              style={{
                marginTop: 12,
                background: `${C.teal}06`,
                border: `1px solid ${C.teal}12`,
                borderRadius: 8,
                padding: 10,
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  gap: 6,
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: SOFT.teal,
                  minWidth: 560,
                }}
              >
                {/* Header row */}
                <div style={{ fontWeight: 700, textAlign: "left" }}>Timestamp</div>
                <div style={{ fontWeight: 700, textAlign: "left" }}>Tool</div>
                <div style={{ fontWeight: 700, textAlign: "left" }}>Input</div>
                <div style={{ fontWeight: 700, textAlign: "left" }}>Result</div>
                <div style={{ fontWeight: 700, textAlign: "left" }}>User</div>
                <div style={{ fontWeight: 700, textAlign: "left" }}>Decision</div>
                {AUDIT_ROWS.map((r) => (
                  <div key={r.time} style={{ display: "contents" }}>
                    <div style={{ textAlign: "left" }}>{r.time}</div>
                    <div style={{ textAlign: "left" }}>{r.tool}</div>
                    <div style={{ textAlign: "left" }}>{r.input}</div>
                    <div style={{ textAlign: "left" }}>{r.result}</div>
                    <div style={{ textAlign: "left" }}>{r.user}</div>
                    <div style={{ textAlign: "left" }}>{r.decision}</div>
                  </div>
                ))}
              </div>
            </div>
            <T color={SOFT.teal} center size={13} style={{ marginTop: 10, fontStyle: "italic" }}>
              The audit log makes every action traceable to a user, a tool, and a decision.
            </T>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Sandbox keeps the server from reaching outside; scope keeps it from doing more than allowed; OAuth proves
            the user granted access; consent and audit keep the user in control of every effect.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
