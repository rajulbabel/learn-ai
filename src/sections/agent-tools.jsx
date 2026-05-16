import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "./agent-prompting.jsx";

// Section 13 Acts 2 + 3: Tool Calling + Protocols (MCP + A2A)
// Chapters 13.7 - 13.17. In Milestone 1 only 13.7 - 13.11 are non-stub; Act 3 (13.12 - 13.17) is added in Milestone 2.

// Ticket T5 - the running customer-support example used in 13.7 sub=0.
const T5_TICKET = {
  id: "T5",
  question: "What's the difference between Pro and Enterprise?",
};

// Pure-LLM vs LLM-with-tools comparison rows for sub=0.
const LLM_VS_TOOLS = [
  {
    mode: "Pure LLM",
    color: C.red,
    soft: SOFT.red,
    note: "Relies on training data. Plans may be outdated. May hallucinate features.",
    flow: ["User asks T5", "LLM guesses from memory", "Returns possibly-stale answer"],
    answer: "Pro has more features than Enterprise, I think... (Guessed from training data.)",
    verdict: "Risky: facts can be wrong, no source.",
  },
  {
    mode: "LLM + Tools",
    color: C.green,
    soft: SOFT.green,
    note: "Calls search_kb to fetch the live comparison doc, then answers from that source.",
    flow: ["User asks T5", "LLM calls search_kb('Pro vs Enterprise')", "KB returns current doc", "LLM answers from doc"],
    answer: "Pro: 10 seats, $49/mo, email support. Enterprise: unlimited seats, SSO, dedicated CSM.",
    verdict: "Grounded: cites live docs, traceable to source.",
  },
];

// Three labeled parts of every tool definition, shown in sub=2.
const TOOL_PARTS = [
  {
    label: "Name",
    color: C.cyan,
    soft: SOFT.cyan,
    value: "process_refund",
    role: "The identifier the model emits when it decides to call this tool.",
  },
  {
    label: "Description",
    color: C.purple,
    soft: SOFT.purple,
    value: "Refund a paid invoice. Refunds over $200 require human approval.",
    role: "Plain-English contract. This is what the model reads to decide WHEN to call.",
  },
  {
    label: "Parameters",
    color: C.green,
    soft: SOFT.green,
    value: "{ invoice_id: string, reason: string }",
    role: "The arguments the model must produce. Validated before the runtime executes.",
  },
];

// Step-by-step decide / execute flow shown in sub=3.
const DECIDE_EXECUTE_STEPS = [
  {
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    detail: "Sends a message: \"Refund my last invoice, the charge was wrong.\"",
  },
  {
    actor: "Model Reads",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "Compares the message to every tool's description. Looks for a match.",
  },
  {
    actor: "Model Decides",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "Thinks: \"User asked for a refund - I should call process_refund.\" Or chooses NOT to call any tool.",
  },
  {
    actor: "Model Emits Tool_Use",
    color: C.blue,
    soft: SOFT.blue,
    detail: "Generation halts. The response is a tool_use block: { name: 'process_refund', input: {...} }.",
  },
  {
    actor: "Runtime Executes",
    color: C.orange,
    soft: SOFT.orange,
    detail: "Your code sees the block, validates inputs, calls the real function, gets a result.",
  },
  {
    actor: "Result Returns",
    color: C.green,
    soft: SOFT.green,
    detail: "The runtime appends a tool_result message and re-invokes the model so it can continue.",
  },
];

// Reason / Act / Observe atoms of the agent loop, shown in sub=4.
const AGENT_LOOP_STEPS = [
  {
    name: "Reason",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "Read messages so far. Decide: do I need a tool, and which one?",
  },
  {
    name: "Act",
    color: C.purple,
    soft: SOFT.purple,
    detail: "Emit a tool_use block. The runtime calls the function for real.",
  },
  {
    name: "Observe",
    color: C.green,
    soft: SOFT.green,
    detail: "Read the tool_result. Did it succeed? Was the info enough to answer?",
  },
];

// Canonical 8-tool inventory for the support agent. Reused across the rest of Act 2.
const CANONICAL_TOOLS = [
  {
    name: "search_kb",
    sig: "search_kb(query)",
    color: C.cyan,
    soft: SOFT.cyan,
    detail: "Search the customer support knowledge base.",
  },
  {
    name: "lookup_customer",
    sig: "lookup_customer(email)",
    color: C.blue,
    soft: SOFT.blue,
    detail: "Find a customer by email address.",
  },
  {
    name: "lookup_subscription",
    sig: "lookup_subscription(customer_id)",
    color: C.purple,
    soft: SOFT.purple,
    detail: "Get current plan and status for a customer.",
  },
  {
    name: "reset_password",
    sig: "reset_password(customer_id)",
    color: C.indigo,
    soft: SOFT.indigo,
    detail: "Send a password-reset email to the customer.",
  },
  {
    name: "change_email",
    sig: "change_email(customer_id, new_email)",
    color: C.teal,
    soft: SOFT.teal,
    detail: "Update the email on record.",
  },
  {
    name: "process_refund",
    sig: "process_refund(invoice_id, reason)",
    color: C.orange,
    soft: SOFT.orange,
    detail: "Refund a paid invoice. Refunds over $200 require escalation.",
  },
  {
    name: "escalate_human",
    sig: "escalate_human(transcript, urgency)",
    color: C.red,
    soft: SOFT.red,
    detail: "Hand off the conversation to a human agent.",
  },
  {
    name: "send_email",
    sig: "send_email(template_id, vars)",
    color: C.green,
    soft: SOFT.green,
    detail: "Send a templated email to the customer.",
  },
];

export const ToolUseAsBridge = (ctx) => {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Pure LLM vs LLM With Tools
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            A bare LLM only knows what was in its training data. The moment your support agent has to look at the
            live knowledge base, your customer record, or trigger a real refund - text generation alone is not
            enough. Tools are how the model reaches out and touches the real world.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Ticket {T5_TICKET.id}: &quot;{T5_TICKET.question}&quot;
          </div>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {LLM_VS_TOOLS.map((col) => (
              <div
                key={col.mode}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${col.color}06`,
                  border: `1px solid ${col.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(col.color)}>{col.mode.toUpperCase()}</span>
                <T color={col.soft} center size={13} style={{ marginTop: 8 }}>
                  {col.note}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  {col.flow.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: `${col.color}12`,
                        border: `1px solid ${col.color}24`,
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: col.soft,
                        width: "100%",
                        maxWidth: 280,
                        textAlign: "center",
                      }}
                    >
                      {i + 1}. {step}
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: col.soft,
                    textAlign: "center",
                  }}
                >
                  {col.answer}
                </div>
                <T color={col.color} bold center size={13} style={{ marginTop: 8 }}>
                  {col.verdict}
                </T>
              </div>
            ))}
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Same model, same prompt. The only difference: one of them can call search_kb. That single hook is the
            difference between a chatty box and a working agent.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            A Tool Is A Function The Model Can Call
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            A tool is exactly one thing: a function. You declare its signature. The model decides when to call it.
            Your runtime executes the function for real. The result flows back into the conversation.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
            }}
          >
            <T color={SOFT.teal} center size={13}>
              The function the model is allowed to call
            </T>
            <div
              style={{
                marginTop: 8,
                padding: "10px 12px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 15,
                color: SOFT.teal,
                textAlign: "center",
              }}
            >
              lookup_customer(email: string) -&gt; Customer
            </div>

            <svg
              viewBox="0 0 560 220"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "16px auto 0" }}
            >
              <desc>
                Three-box flow diagram showing how a tool call moves through the system: the Model on the left
                decides to call the function, the Runtime in the middle executes the real function, and the Result
                on the right flows back into the model's next turn. Arrows are labeled Decide, Execute, and Return.
              </desc>
              {/* Three boxes - equal padding */}
              {/* viewBox 560 wide, 3 boxes width 150 + 2 gaps of 55 = 560 -> start at 0, but pad 20 each side -> box width 140, gap 70, start 20 */}
              {/* Box 1: Model */}
              <rect x="20" y="60" width="140" height="80" rx="8" fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth="1.5" />
              <text x="90" y="92" fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Model
              </text>
              <text x="90" y="112" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Decides WHEN
              </text>
              <text x="90" y="128" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                to call
              </text>

              {/* Box 2: Runtime */}
              <rect x="210" y="60" width="140" height="80" rx="8" fill={`${C.orange}12`} stroke={C.orange} strokeWidth="1.5" />
              <text x="280" y="92" fill={SOFT.orange} fontSize="14" fontWeight="700" textAnchor="middle">
                Runtime
              </text>
              <text x="280" y="112" fill={SOFT.orange} fontSize="11" textAnchor="middle">
                Executes the
              </text>
              <text x="280" y="128" fill={SOFT.orange} fontSize="11" textAnchor="middle">
                real function
              </text>

              {/* Box 3: Result */}
              <rect x="400" y="60" width="140" height="80" rx="8" fill={`${C.green}12`} stroke={C.green} strokeWidth="1.5" />
              <text x="470" y="92" fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Result
              </text>
              <text x="470" y="112" fill={SOFT.green} fontSize="11" textAnchor="middle">
                Flows back to
              </text>
              <text x="470" y="128" fill={SOFT.green} fontSize="11" textAnchor="middle">
                the model
              </text>

              {/* Arrow 1: Model -> Runtime */}
              <line x1="160" y1="100" x2="205" y2="100" stroke={C.teal} strokeWidth="2" />
              <polygon points="205,100 197,96 197,104" fill={C.teal} />
              <text x="182" y="92" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                Tool_use
              </text>

              {/* Arrow 2: Runtime -> Result */}
              <line x1="350" y1="100" x2="395" y2="100" stroke={C.teal} strokeWidth="2" />
              <polygon points="395,100 387,96 387,104" fill={C.teal} />
              <text x="372" y="92" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                Execute
              </text>

              {/* Loop-back arrow: Result -> Model (under) */}
              <path
                d="M 470 140 Q 470 190 90 190 Q 90 165 90 140"
                fill="none"
                stroke={C.green}
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <polygon points="90,140 86,148 94,148" fill={C.green} />
              <text x="280" y="208" fill={SOFT.green} fontSize="11" textAnchor="middle">
                Return: tool_result becomes the next input
              </text>

              {/* Title */}
              <text x="280" y="32" fill={SOFT.teal} fontSize="13" textAnchor="middle">
                One tool call: Decide -&gt; Execute -&gt; Return
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.teal,
            }}
          >
            Model = brain. Runtime = hands. The brain never touches the database directly.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Critical separation: the LLM never executes code itself. It only emits a tool_use block. Your runtime
            does the actual call. This boundary is what makes tool use safe enough to ship.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Name, Description, Parameters
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Every tool definition has exactly three parts you write. The model reads all three at every turn and uses
            them to decide whether to call - and how.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            {TOOL_PARTS.map((part, i) => (
              <div
                key={part.label}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${part.color}06`,
                  border: `1px solid ${part.color}12`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <span style={pill(part.color)}>PART {i + 1}</span>
                  <T color={part.color} bold size={15}>
                    {part.label}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${part.color}12`,
                    border: `1px solid ${part.color}24`,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: part.soft,
                    textAlign: "center",
                  }}
                >
                  {part.value}
                </div>
                <T color={part.soft} center size={13} style={{ marginTop: 8 }}>
                  {part.role}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.blue,
            }}
          >
            Description is the most important field. Spend most of your editing time there.
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            The model has never seen your codebase. The description is its only manual. If the description is vague,
            the model guesses; if it is specific, the model rarely misfires.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Model Decides, The Runtime Executes
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Two distinct roles. The model is in charge of decisions - which tool, what arguments. Your code is in
            charge of side effects - reading the DB, charging the card, sending the email. Never mix them.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            {DECIDE_EXECUTE_STEPS.map((step, i) => (
              <div
                key={step.actor}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${step.color}06`,
                  border: `1px solid ${step.color}12`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={pill(step.color)}>STEP {i + 1}</span>
                  <T color={step.color} bold size={15}>
                    {step.actor}
                  </T>
                </div>
                <T color={step.soft} center size={13} style={{ marginTop: 6 }}>
                  {step.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.green,
            }}
          >
            The model can also choose NOT to call any tool and just answer. That is a valid outcome.
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Notice step 4: the model halts at tool_use. It does not execute anything itself. The runtime is the
            single chokepoint where every real-world side effect happens - which is exactly where you place auth,
            logging, and rate limits.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            One Call, Or A Loop Of Calls?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            A single tool call is the atom. An agent is what you get when you put that atom in a loop: reason,
            act, observe, then reason again with the new evidence.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={SOFT.purple} center size={13}>
              Reason -&gt; Act -&gt; Observe -&gt; Reason again
            </T>
            <svg
              viewBox="0 0 560 220"
              style={{ width: "100%", maxWidth: 600, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Triangular loop diagram with three labeled nodes: Reason at the top, Act on the bottom-right,
                Observe on the bottom-left. Arrows form a clockwise cycle Reason -&gt; Act -&gt; Observe -&gt;
                Reason. A small label in the center reads loop until done.
              </desc>
              {/* Three nodes in a triangle, viewBox 560x220 */}
              {/* Reason: top center */}
              <circle cx="280" cy="55" r="40" fill={`${C.cyan}24`} stroke={C.cyan} strokeWidth="2" />
              <text x="280" y="50" fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Reason
              </text>
              <text x="280" y="68" fill={SOFT.cyan} fontSize="10" textAnchor="middle">
                Which tool?
              </text>

              {/* Act: bottom right */}
              <circle cx="430" cy="165" r="40" fill={`${C.purple}24`} stroke={C.purple} strokeWidth="2" />
              <text x="430" y="160" fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Act
              </text>
              <text x="430" y="178" fill={SOFT.purple} fontSize="10" textAnchor="middle">
                Call tool
              </text>

              {/* Observe: bottom left */}
              <circle cx="130" cy="165" r="40" fill={`${C.green}24`} stroke={C.green} strokeWidth="2" />
              <text x="130" y="160" fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Observe
              </text>
              <text x="130" y="178" fill={SOFT.green} fontSize="10" textAnchor="middle">
                Read result
              </text>

              {/* Arrows: clockwise. Reason->Act, Act->Observe, Observe->Reason */}
              {/* Reason->Act */}
              <path
                d="M 312 78 Q 380 105 405 138"
                fill="none"
                stroke={C.purple}
                strokeWidth="2"
              />
              <polygon points="405,138 397,134 401,144" fill={C.purple} />

              {/* Act->Observe */}
              <line x1="390" y1="165" x2="170" y2="165" stroke={C.green} strokeWidth="2" />
              <polygon points="170,165 178,161 178,169" fill={C.green} />

              {/* Observe->Reason */}
              <path
                d="M 155 138 Q 200 105 248 78"
                fill="none"
                stroke={C.cyan}
                strokeWidth="2"
              />
              <polygon points="248,78 244,86 254,82" fill={C.cyan} />

              {/* Center label */}
              <text x="280" y="125" fill={SOFT.purple} fontSize="12" textAnchor="middle" fontWeight="700">
                Loop until done
              </text>
            </svg>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 10,
              }}
            >
              {AGENT_LOOP_STEPS.map((step) => (
                <div key={step.name} style={{ ...tintedCard(step.color), padding: 12 }}>
                  <T color={step.color} bold center size={14}>
                    {step.name}
                  </T>
                  <T color={step.soft} center size={13} style={{ marginTop: 6 }}>
                    {step.detail}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.purple,
            }}
          >
            A single tool call is the atom. An agent loop is the molecule. We formalize the loop in 13.20.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            One ticket might be a single search_kb call and done. Another might need lookup_customer, then
            lookup_subscription, then process_refund - three turns of the loop before the model finally answers.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The 8 Tools Our Support Agent Has
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            For the rest of this section we work with one fixed inventory. Every example uses these eight tools -
            the shape of the schemas, the lifecycle of a call, the retry strategy when one fails.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {CANONICAL_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${tool.color}06`,
                  border: `1px solid ${tool.color}24`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${tool.color}12`,
                    border: `1px solid ${tool.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: tool.soft,
                    textAlign: "center",
                  }}
                >
                  {tool.sig}
                </div>
                <T color={tool.soft} center size={13} style={{ marginTop: 8 }}>
                  {tool.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            8 tools, 3 read-only (search, lookup, lookup), 5 side-effectful (reset, change, refund, escalate, send).
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Notice the split: read-only tools are cheap to retry; side-effectful tools must be guarded with
            auth, validation, and approvals. process_refund is the canary - any refund over $200 escalates instead
            of executing.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// Four labeled pieces of the canonical tool schema, shown in sub=0.
const SCHEMA_PIECES = [
  {
    label: "Name",
    color: C.cyan,
    soft: SOFT.cyan,
    snippet: `"name": "lookup_customer"`,
    role: "The identifier the model emits when it calls this tool.",
  },
  {
    label: "Description",
    color: C.purple,
    soft: SOFT.purple,
    snippet: `"description": "Look up a customer by email address."`,
    role: "Plain-English contract. This is how the model decides WHEN to call.",
  },
  {
    label: "Input_schema",
    color: C.blue,
    soft: SOFT.blue,
    snippet: `"input_schema": { "type": "object", "properties": {...} }`,
    role: "The JSON-Schema shape of the arguments. Type-checked before execution.",
  },
  {
    label: "Required",
    color: C.green,
    soft: SOFT.green,
    snippet: `"required": ["email"]`,
    role: "Which properties the model MUST provide. Others are optional.",
  },
];

// process_refund parameter rows for sub=1 - required vs optional side-by-side.
const REFUND_REQUIRED_OPTIONAL = [
  {
    name: "invoice_id",
    kind: "Required",
    color: C.green,
    soft: SOFT.green,
    schema: `{ "type": "string" }`,
    rule: "Model MUST provide. Refund cannot happen without an invoice to refund.",
  },
  {
    name: "reason",
    kind: "Optional",
    color: C.yellow,
    soft: SOFT.yellow,
    schema: `{ "type": "string" }`,
    rule: "Model decides. Empty reason is allowed - audit logs still record the refund.",
  },
];

// escalate_human enum rows for sub=2.
const ESCALATE_ENUM = [
  {
    name: "urgency",
    color: C.blue,
    soft: SOFT.blue,
    schema: `{ "type": "string", "enum": ["low", "medium", "high"] }`,
    rule: "Enum locks the value. The model cannot invent urgent or critical - only the 3 allowed strings.",
  },
  {
    name: "transcript",
    color: C.teal,
    soft: SOFT.teal,
    schema: `{ "type": "string" }`,
    rule: "Free-form string. The model writes the handoff summary in its own words.",
  },
];

// Format constraint example for sub=2.
const FORMAT_EXAMPLE = {
  schema: `"email": { "type": "string", "format": "email" }`,
  rule: "Format hints push the model to produce a parseable email. Your runtime can also reject malformed values before calling the function.",
};

// 5 rules for writing a good tool description, shown in sub=3.
const DESC_RULES = [
  {
    n: 1,
    color: C.cyan,
    soft: SOFT.cyan,
    rule: "State what the tool does in plain language.",
    detail: "One sentence the model can match against the user's request.",
  },
  {
    n: 2,
    color: C.orange,
    soft: SOFT.orange,
    rule: "State the side effects.",
    detail: "Does it mutate state? Send email? Cost money? The model needs to know before calling.",
  },
  {
    n: 3,
    color: C.red,
    soft: SOFT.red,
    rule: "State when NOT to use the tool.",
    detail: "Negative examples prevent over-eager calls. \"Do not use for refunds over $200\" saves real dollars.",
  },
  {
    n: 4,
    color: C.purple,
    soft: SOFT.purple,
    rule: "Use the same vocabulary the user would use.",
    detail: "If the user says cancel, do not name the tool terminate_subscription. Match the word.",
  },
  {
    n: 5,
    color: C.green,
    soft: SOFT.green,
    rule: "Mention any constraints.",
    detail: "Rate limits, dollar thresholds, retry semantics, idempotency - put them all in the description.",
  },
];

// Bad vs good description for process_refund, shown in sub=4.
const BAD_GOOD_DESC = [
  {
    kind: "Bad",
    color: C.red,
    soft: SOFT.red,
    label: "Vague",
    text: "Refund function.",
    why: "No side effects mentioned. No dollar threshold. No when-not-to-use. The model will call it for anything that sounds refund-shaped.",
  },
  {
    kind: "Good",
    color: C.green,
    soft: SOFT.green,
    label: "Specific",
    text: "Refund a paid invoice. Use only when the customer has confirmed cancellation. Refunds over $200 require human approval - call escalate_human instead for those.",
    why: "What it does. When to use. When NOT to use. The $200 threshold. The fallback tool. The model now has a real contract.",
  },
];

// Canonical lookup_customer schema, shown in sub=5. The reference shape for the rest of Section 13.
const LOOKUP_CUSTOMER_SCHEMA = `{
  "name": "lookup_customer",
  "description": "Look up a customer by email address. Returns customer_id, plan, and account status. Read-only - safe to retry.",
  "input_schema": {
    "type": "object",
    "properties": {
      "email": { "type": "string", "format": "email" }
    },
    "required": ["email"]
  }
}`;

// Canonical example tool_use invocation, shown in sub=5.
const LOOKUP_CUSTOMER_INVOCATION = `{
  "type": "tool_use",
  "id": "toolu_01ABCxyz",
  "name": "lookup_customer",
  "input": { "email": "alice@example.com" }
}`;

export const JsonSchemaForTools = (ctx) => {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Schema First, Implementation Second
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The schema is the contract between you and the model. Before you write one line of the
            real function, you write the schema. The model only ever sees the schema - never the
            implementation - so the schema must say everything that matters.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={SOFT.cyan} center size={13}>
              Tool Schema (shape)
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {`{
  "name": "lookup_customer",
  "description": "Look up a customer by email address.",
  "input_schema": {
    "type": "object",
    "properties": {
      "email": { "type": "string", "format": "email" }
    },
    "required": ["email"]
  }
}`}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {SCHEMA_PIECES.map((piece, i) => (
              <div
                key={piece.label}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${piece.color}06`,
                  border: `1px solid ${piece.color}24`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={pill(piece.color)}>PIECE {i + 1}</span>
                  <T color={piece.color} bold size={15}>
                    {piece.label}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${piece.color}12`,
                    border: `1px solid ${piece.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: piece.soft,
                    textAlign: "center",
                  }}
                >
                  {piece.snippet}
                </div>
                <T color={piece.soft} center size={13} style={{ marginTop: 8 }}>
                  {piece.role}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Schema is what the model sees. Implementation is what your runtime runs.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The model has never seen your real lookup_customer function. It only sees this
            JSON-Schema document. Everything you want it to know - the input shape, the required
            fields, when to call - must live inside these four pieces.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            What&apos;s Required, What&apos;s Optional?
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            JSON-Schema splits arguments into two buckets: required (must be present) and optional
            (may be omitted). The model reads the required list and treats it as non-negotiable.
            Everything else is its judgment call.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
            }}
          >
            <T color={SOFT.teal} center size={13}>
              process_refund schema (excerpt)
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.teal,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {`"input_schema": {
  "type": "object",
  "properties": {
    "invoice_id": { "type": "string" },
    "reason":     { "type": "string" }
  },
  "required": ["invoice_id"]
}`}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {REFUND_REQUIRED_OPTIONAL.map((row) => (
              <div
                key={row.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}24`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={pill(row.color)}>{row.kind.toUpperCase()}</span>
                  <T color={row.color} bold size={15}>
                    {row.name}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${row.color}12`,
                    border: `1px solid ${row.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: row.soft,
                    textAlign: "center",
                  }}
                >
                  {row.schema}
                </div>
                <T color={row.soft} center size={13} style={{ marginTop: 8 }}>
                  {row.rule}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.teal,
            }}
          >
            Required = model MUST provide. Optional = model decides.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Mark fewer fields required. Every required field is a chance for the model to give up
            and answer in plain text instead of calling. Make invoice_id required, but let reason
            be optional - the refund still works without a reason string.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Narrowing The Allowed Values
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            A free-form string is a footgun. The model can invent any value it likes. Use enum to
            lock a parameter to a fixed set of strings, and format to hint at the expected shape
            for things like emails, dates, and URIs.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <T color={SOFT.blue} center size={13}>
              escalate_human schema (excerpt)
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.blue,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {`"input_schema": {
  "type": "object",
  "properties": {
    "transcript": { "type": "string" },
    "urgency":    { "type": "string", "enum": ["low", "medium", "high"] }
  },
  "required": ["transcript", "urgency"]
}`}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {ESCALATE_ENUM.map((row) => (
              <div
                key={row.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}24`,
                  textAlign: "center",
                }}
              >
                <T color={row.color} bold center size={15}>
                  {row.name}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${row.color}12`,
                    border: `1px solid ${row.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: row.soft,
                    textAlign: "center",
                  }}
                >
                  {row.schema}
                </div>
                <T color={row.soft} center size={13} style={{ marginTop: 8 }}>
                  {row.rule}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}24`,
              textAlign: "center",
            }}
          >
            <T color={C.blue} bold center size={15}>
              Format Hint Example (lookup_customer)
            </T>
            <div
              style={{
                marginTop: 8,
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.blue}12`,
                border: `1px solid ${C.blue}24`,
                fontFamily: "monospace",
                fontSize: 13,
                color: SOFT.blue,
                textAlign: "center",
              }}
            >
              {FORMAT_EXAMPLE.schema}
            </div>
            <T color={SOFT.blue} center size={13} style={{ marginTop: 8 }}>
              {FORMAT_EXAMPLE.rule}
            </T>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.blue,
            }}
          >
            Enum locks the value. Format hints the shape. Both shrink the model&apos;s mistake surface.
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Without the enum, the model might emit urgency: &quot;urgent&quot; or &quot;critical&quot; and your
            ticket router would drop the request. With the enum, low / medium / high are the only
            legal values - the model is forced into your schema.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Descriptions Are Read By The Model
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The description field is plain language for the model. It is the most important text in
            your whole tool definition. Treat it like a manual entry the model will skim every
            turn. Five rules turn a bad description into a great one.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            {DESC_RULES.map((rule) => (
              <div
                key={rule.n}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${rule.color}06`,
                  border: `1px solid ${rule.color}12`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={pill(rule.color)}>RULE {rule.n}</span>
                  <T color={rule.color} bold size={15}>
                    {rule.rule}
                  </T>
                </div>
                <T color={rule.soft} center size={13} style={{ marginTop: 6 }}>
                  {rule.detail}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.green,
            }}
          >
            Description is the model&apos;s manual. Write it like you would write a runbook for a
            new hire.
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Spend ten times longer on the description than on the parameter names. A great
            description prevents wrong-tool calls, prevents the model from inventing arguments, and
            tells the model exactly when to call escalate_human instead of process_refund.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            One Sentence Changes Everything
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Same tool, same parameters. The only difference between a refund that goes wrong and
            one that goes right is the description string. Read both versions of process_refund
            below.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            {BAD_GOOD_DESC.map((row) => (
              <div
                key={row.kind}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}24`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={pill(row.color)}>{row.kind.toUpperCase()}</span>
                  <T color={row.color} bold size={15}>
                    {row.label}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: row.soft,
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {`"description": "${row.text}"`}
                </div>
                <T color={row.soft} center size={13} style={{ marginTop: 10 }}>
                  {row.why}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.purple,
            }}
          >
            Bad description: model refunds a $500 invoice. Good description: model calls
            escalate_human instead.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The vague version costs you real dollars in mis-refunds. The specific version threads
            the $200 ceiling and the escalation fallback right into the model&apos;s prompt - so the
            model is choosing escalate_human before it ever attempts the refund.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Our Reference Tool: lookup_customer
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            This is the canonical reference shape every later chapter in Section 13 builds on. The
            full schema below is the contract; the tool_use block underneath shows exactly what the
            model emits when it decides to call this tool. Bookmark this slide.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}24`,
            }}
          >
            <T color={SOFT.cyan} center size={13}>
              Canonical Tool Schema
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {LOOKUP_CUSTOMER_SCHEMA}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}24`,
            }}
          >
            <T color={SOFT.purple} center size={13}>
              Example tool_use Invocation
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.purple,
                whiteSpace: "pre",
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              {LOOKUP_CUSTOMER_INVOCATION}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 12 }}>
              <T color={C.cyan} bold center size={14}>
                Name
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                lookup_customer
              </T>
            </div>
            <div style={{ ...tintedCard(C.blue), padding: 12 }}>
              <T color={C.blue} bold center size={14}>
                Required Input
              </T>
              <T color={SOFT.blue} center size={13} style={{ marginTop: 6 }}>
                email (format: email)
              </T>
            </div>
            <div style={{ ...tintedCard(C.green), padding: 12 }}>
              <T color={C.green} bold center size={14}>
                Side Effects
              </T>
              <T color={SOFT.green} center size={13} style={{ marginTop: 6 }}>
                None. Read-only and safe to retry.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Reference shape. Every later chapter assumes this exact lookup_customer contract.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Notice how every part of the previous slides shows up here: a clear name, a description
            that states the side-effect profile, an input_schema with a format constraint, and a
            required list with one element. When you see lookup_customer in later chapters, this is
            the schema we mean.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const ToolCallLifecycle = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Call Lifecycle
        </T>
        <T size={16}>Stub - implemented in Task 16.</T>
      </Box>
    </div>
  );
};

export const ParallelToolsAndChoice = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Parallel Tools + Tool Choice
        </T>
        <T size={16}>Stub - implemented in Task 17.</T>
      </Box>
    </div>
  );
};

export const ToolErrorsRetries = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Tool Errors, Retries, Validation
        </T>
        <T size={16}>Stub - implemented in Task 18.</T>
      </Box>
    </div>
  );
};
