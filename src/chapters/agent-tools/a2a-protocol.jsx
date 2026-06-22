import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// ---------- 25.11 A2AProtocol ----------

const A2A_AGENT_JSON_LINES = [
  "{",
  '  "name": "billing-specialist-v2",',
  '  "description": "Handles billing-related support tickets including refunds, downgrades, and invoice disputes.",',
  '  "skills": ["billing", "refund", "invoice"],',
  '  "endpoint": "https://agents.example.com/billing",',
  '  "auth": { "type": "oauth2" }',
  "}",
];

const A2A_DELEGATION_STEPS = [
  { n: 1, label: "Triage Agent Classifies Ticket T4 As Billing" },
  { n: 2, label: "Triage Looks Up Agents With Skill 'Billing'" },
  { n: 3, label: "Triage Sends Delegation Request With Full Ticket Context" },
  { n: 4, label: "Billing Agent Works The Ticket" },
  { n: 5, label: "Billing Agent Returns Result To Triage" },
];

const A2A_STREAM_UPDATES = [
  "Looked Up Customer...",
  "Processing Refund...",
  "Refund > $200, Need Approval",
  "Final Result Returned",
];

const A2A_DECISION_ROWS = [
  {
    question: "Need To Call A Function?",
    answer: "MCP Tool",
    color: C.purple,
    soft: SOFT.purple,
  },
  {
    question: "Need To Read A Doc?",
    answer: "MCP Resource",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    question: "Need An Entire Other Agent To Handle A Sub-Problem?",
    answer: "A2A Delegation",
    color: C.cyan,
    soft: SOFT.cyan,
  },
];

export default function A2AProtocol(ctx) {
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
            Agent To Tool, Agent To Agent
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            MCP handles one direction: an agent reaches out to a tool and gets a value back. A2A handles the other: an
            agent hands an entire problem to a different agent and lets that agent run its own loop. Same wire idea,
            very different scope.
          </T>

          {/* Two-row comparison: MCP vs A2A */}
          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center bold size={14}>
              MCP Vs A2A
            </T>
            <svg
              viewBox="0 0 560 280"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Two row comparison diagram showing MCP on top where one agent box connects to four separate tool boxes,
                and A2A on the bottom where one agent box delegates to another agent box that itself contains tool boxes
                inside its boundary.
              </desc>

              {/* Row 1: MCP - Agent -> 4 tools. Row spans y 20-120. */}
              <text x="40" y="40" fill={SOFT.purple} fontSize="14" fontWeight="700">
                MCP
              </text>
              {/* Agent box: width 90, x = 40, centered in row */}
              <rect
                x="40"
                y="55"
                width="90"
                height="50"
                rx="8"
                fill={`${C.purple}24`}
                stroke={C.purple}
                strokeWidth="2"
              />
              <text x="85" y="85" fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent
              </text>
              {/* 4 tool boxes on the right. Width 70, gap 12 -> span 70*4 + 12*3 = 316. Start x = 560 - 316 - 40 = 204. */}
              {[0, 1, 2, 3].map((i) => {
                const tx = 204 + i * 82;
                return (
                  <g key={`mcp-tool-${i}`}>
                    <rect
                      x={tx}
                      y="55"
                      width="70"
                      height="50"
                      rx="6"
                      fill={`${C.blue}1a`}
                      stroke={C.blue}
                      strokeWidth="1.5"
                    />
                    <text x={tx + 35} y="85" fill={SOFT.blue} fontSize="12" fontWeight="700" textAnchor="middle">
                      Tool {i + 1}
                    </text>
                  </g>
                );
              })}
              {/* Connector comb: agent fans out to all 4 tools via a trunk BELOW the box row, so no
                  line crosses a box interior (the old straight y=80 lines struck through the tool labels). */}
              <line x1="85" y1="105" x2="85" y2="120" stroke={C.purple} strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="85" y1="120" x2="485" y2="120" stroke={C.purple} strokeWidth="1.2" strokeDasharray="3 3" />
              {[0, 1, 2, 3].map((i) => {
                const cx = 204 + i * 82 + 35;
                return (
                  <line
                    key={`mcp-riser-${i}`}
                    x1={cx}
                    y1="120"
                    x2={cx}
                    y2="105"
                    stroke={C.purple}
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                );
              })}
              <text x="280" y="138" fill={SOFT.purple} fontSize="11" fontStyle="italic" textAnchor="middle">
                Agent calls function
              </text>

              {/* Divider line */}
              <line x1="20" y1="145" x2="540" y2="145" stroke={DIM_BORDER} strokeWidth="1" />

              {/* Row 2: A2A - Agent -> other agent (with tools inside). Row spans y 160-260. */}
              <text x="40" y="180" fill={SOFT.cyan} fontSize="14" fontWeight="700">
                A2A
              </text>
              {/* Triage agent box */}
              <rect x="40" y="195" width="90" height="50" rx="8" fill={`${C.cyan}24`} stroke={C.cyan} strokeWidth="2" />
              <text x="85" y="225" fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Agent
              </text>
              {/* Delegation arrow - tip lands exactly on the Other Agent box left edge (x=235) */}
              <line x1="130" y1="220" x2="229" y2="220" stroke={C.cyan} strokeWidth="2" />
              <polygon points="235,220 227,216 227,224" fill={C.cyan} />
              {/* Other agent box - bigger, contains tools */}
              <rect
                x="235"
                y="180"
                width="290"
                height="85"
                rx="10"
                fill={`${C.indigo}1a`}
                stroke={C.indigo}
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <text x="380" y="200" fill={SOFT.indigo} fontSize="13" fontWeight="700" textAnchor="middle">
                Other Agent
              </text>
              {/* 3 mini tools inside the other agent box */}
              {[0, 1, 2].map((i) => {
                const tx = 250 + i * 90;
                return (
                  <g key={`a2a-tool-${i}`}>
                    <rect
                      x={tx}
                      y="215"
                      width="80"
                      height="40"
                      rx="5"
                      fill={`${C.blue}24`}
                      stroke={C.blue}
                      strokeWidth="1.2"
                    />
                    <text x={tx + 40} y="240" fill={SOFT.blue} fontSize="11" fontWeight="700" textAnchor="middle">
                      Tool {i + 1}
                    </text>
                  </g>
                );
              })}
              <text x="280" y="278" fill={SOFT.cyan} fontSize="11" fontStyle="italic" textAnchor="middle">
                Agent delegates whole task to another agent
              </text>
            </svg>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            With MCP, the agent stays in charge and just borrows a tool. With A2A, the agent hands the wheel to a peer
            that runs its own model, memory, and tools to finish the job.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Agent.json - The Agent&apos;s Card
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Before one agent can delegate to another, it has to find a peer with the right skill. A2A solves discovery
            with a small JSON document each agent publishes at a known URL: its name, what it does, what skills it
            claims, where to reach it, and how to authenticate.
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
              A2A Discovery Doc (Shape)
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
                display: "block",
                maxWidth: "100%",
              }}
            >
              {A2A_AGENT_JSON_LINES.join("\n")}
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
            <T color={SOFT.indigo} center size={14}>
              Name identifies the agent. Description and skills are what other agents read to decide if this peer can
              help. Endpoint is the URL to call. Auth tells the caller how to prove they were granted access.
            </T>
            <T color={SOFT.indigo} center size={14} style={{ marginTop: 8 }}>
              Other agents discover this and decide whether to delegate.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Triage Delegates To Billing
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            A real delegation has a shape: a triage agent classifies an incoming ticket, looks up who has the right
            skill, packages the context, sends the request, and waits for the specialist to come back with a result.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 14, marginTop: 14 }}>
            <T color={SOFT.blue} center bold size={14}>
              Delegation Flow For Ticket T4
            </T>
            <svg
              viewBox="0 0 560 380"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Five step delegation flow where triage agent classifies ticket T4 as billing, finds an agent with
                billing skill, delegates the full ticket context, the billing agent works the ticket and returns result.
              </desc>
              {/* Each step is a horizontal box. Box width 440, height 50, gap 16. Container width 560 -> padding (560-440)/2 = 60 */}
              {A2A_DELEGATION_STEPS.map((s, i) => {
                const y = 20 + i * 66;
                return (
                  <g key={s.n}>
                    <rect
                      x="60"
                      y={y}
                      width="440"
                      height="50"
                      rx="8"
                      fill={`${C.blue}1a`}
                      stroke={C.blue}
                      strokeWidth="1.5"
                    />
                    {/* Number circle */}
                    <circle cx="88" cy={y + 25} r="14" fill={`${C.blue}40`} stroke={C.blue} strokeWidth="1.5" />
                    <text x="88" y={y + 30} fill={SOFT.blue} fontSize="13" fontWeight="700" textAnchor="middle">
                      {s.n}
                    </text>
                    {/* Label */}
                    <text x="115" y={y + 30} fill={SOFT.blue} fontSize="13" fontWeight="600">
                      {s.label}
                    </text>
                    {/* Arrow down to next */}
                    {i < A2A_DELEGATION_STEPS.length - 1 && (
                      <g>
                        <line x1="280" y1={y + 50} x2="280" y2={y + 64} stroke={C.cyan} strokeWidth="2" />
                        <polygon points={`280,${y + 66} 276,${y + 58} 284,${y + 58}`} fill={C.cyan} />
                      </g>
                    )}
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
            <T color={SOFT.blue} center size={14}>
              Delegation includes the conversation history so the billing agent has context.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Long Tasks Stream Progress
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            A delegated task is not a single function call. The receiving agent may need minutes, human approval, or
            several tool calls of its own. A2A solves this by letting the receiving agent stream intermediate updates
            back instead of going silent until the final result is ready.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center bold size={14}>
              Streaming Updates From Billing Agent
            </T>
            <svg
              viewBox="0 0 560 360"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Vertical timeline showing triage agent delegates to billing agent which then streams intermediate
                updates lookup processing approval and final result back to triage.
              </desc>
              {/* Triage box at top. Width 160, x = (560-160)/2 = 200 */}
              <rect
                x="200"
                y="15"
                width="160"
                height="40"
                rx="8"
                fill={`${C.cyan}24`}
                stroke={C.cyan}
                strokeWidth="2"
              />
              <text x="280" y="40" fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Triage Agent
              </text>

              {/* Delegate arrow down */}
              <line x1="280" y1="55" x2="280" y2="78" stroke={C.cyan} strokeWidth="2" />
              <polygon points="280,80 276,72 284,72" fill={C.cyan} />
              <text x="298" y="73" fill={SOFT.cyan} fontSize="11" fontStyle="italic">
                Delegate
              </text>

              {/* Billing agent box */}
              <rect
                x="200"
                y="85"
                width="160"
                height="40"
                rx="8"
                fill={`${C.indigo}24`}
                stroke={C.indigo}
                strokeWidth="2"
              />
              <text x="280" y="110" fill={SOFT.indigo} fontSize="13" fontWeight="700" textAnchor="middle">
                Billing Agent
              </text>

              {/* Stream updates - 4 rows. Each row: arrow up to triage + label box */}
              {A2A_STREAM_UPDATES.map((label, i) => {
                const y = 145 + i * 50;
                const isFinal = i === A2A_STREAM_UPDATES.length - 1;
                const isApproval = i === 2;
                const stroke = isFinal ? C.green : isApproval ? C.yellow : C.blue;
                const soft = isFinal ? SOFT.green : isApproval ? SOFT.yellow : SOFT.blue;
                return (
                  <g key={`update-${i}`}>
                    {/* Update box - width 340, x = (560-340)/2 = 110 */}
                    <rect
                      x="110"
                      y={y}
                      width="340"
                      height="34"
                      rx="6"
                      fill={`${stroke}1a`}
                      stroke={stroke}
                      strokeWidth="1.5"
                    />
                    <text x="280" y={y + 22} fill={soft} fontSize="13" fontWeight="600" textAnchor="middle">
                      {label}
                    </text>
                    {/* Stream arrow: emerges from the box left edge (x=110) and points left into
                        the channel toward the triage column. Body sits OUTSIDE the box; tip lands at
                        x=74 in open space so it never buries inside the box. */}
                    <line
                      x1="110"
                      y1={y + 17}
                      x2="82"
                      y2={y + 17}
                      stroke={stroke}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <polygon points={`74,${y + 17} 82,${y + 13} 82,${y + 21}`} fill={stroke} />
                    {/* Label sits above the first arrow, centered over the channel */}
                    {i === 0 && (
                      <text x="76" y={y - 4} fill={SOFT.cyan} fontSize="11" fontStyle="italic" textAnchor="middle">
                        Stream
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Footer caption */}
              <text x="280" y="350" fill={SOFT.cyan} fontSize="11" fontStyle="italic" textAnchor="middle">
                Triage stays informed without polling
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
              Streaming lets triage show the user progress in real time and react if an intermediate update needs human
              approval before the long task finishes.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Two Protocols, Two Roles
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            MCP and A2A live side by side, not in competition. The decision is about what you need from the other side:
            a function, a document, or an entire collaborator.
          </T>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {A2A_DECISION_ROWS.map((r, i) => (
              <div
                key={i}
                style={{
                  ...tintedCard(r.color),
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 14,
                  textAlign: "center",
                }}
              >
                <T color={r.soft} center size={15}>
                  {r.question}
                </T>
                <T color={r.soft} center size={14}>
                  →
                </T>
                <div style={{ textAlign: "center" }}>
                  <span style={pill(r.color)}>{r.answer}</span>
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
            <T color={SOFT.teal} center size={15}>
              A2A is heavier than MCP. Use it when the delegated work needs the receiving agent&apos;s own loop, memory,
              and tools - not just a single function call.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
