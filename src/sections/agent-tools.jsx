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

// Six actors in the tool-call lifecycle swim-lane (sub=0). Each row shows the
// actor on the left and the kind of message that leaves it on the right.
const LIFECYCLE_STEPS = [
  {
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    msg: "User message",
    detail: "Sends a request. \"I can't log in - reset my password.\"",
  },
  {
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use block",
    detail: "Reads context, picks a tool, emits a tool_use block with name and input.",
  },
  {
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "Function call",
    detail: "Validates the tool_use, looks up the real function, calls it with the input.",
  },
  {
    actor: "Tool",
    color: C.teal,
    soft: SOFT.teal,
    msg: "Function return",
    detail: "Runs the real side effect (DB, email, refund). Returns a value or an error.",
  },
  {
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result block",
    detail: "Wraps the return value in a tool_result message and appends to the conversation.",
  },
  {
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "Assistant message",
    detail: "Re-reads the conversation, sees the result, writes the final answer for the user.",
  },
];

// Highlighted fields of the canonical tool_use message (sub=1).
const TOOL_USE_FIELDS = [
  { key: "type", color: C.cyan, soft: SOFT.cyan, note: "Always the literal string \"tool_use\". Tells your runtime this block is a call request." },
  { key: "id", color: C.purple, soft: SOFT.purple, note: "Unique per call. The matching tool_result must carry this same id back." },
  { key: "name", color: C.green, soft: SOFT.green, note: "Which tool to call. Must match one of the schema names you registered." },
  { key: "input", color: C.orange, soft: SOFT.orange, note: "The arguments. Validated against the input_schema before the runtime executes." },
];

const TOOL_USE_MSG = `{
  "type": "tool_use",
  "id": "toolu_01abc...",
  "name": "reset_password",
  "input": { "customer_id": "c-9924" }
}`;

// Highlighted fields of the canonical tool_result message (sub=2).
const TOOL_RESULT_FIELDS = [
  { key: "type", color: C.cyan, soft: SOFT.cyan, note: "Always \"tool_result\". Tells the model this block carries a return value." },
  { key: "tool_use_id", color: C.purple, soft: SOFT.purple, note: "MUST match the id from the tool_use. This is how the model pairs request to response." },
  { key: "content", color: C.green, soft: SOFT.green, note: "The return value. Usually a string; can be structured. This is what the model reads next." },
  { key: "is_error", color: C.red, soft: SOFT.red, note: "Flag. true means the runtime failed - the model should recover, not pretend it worked." },
];

const TOOL_RESULT_MSG = `{
  "type": "tool_result",
  "tool_use_id": "toolu_01abc...",
  "content": "Password reset email sent to alice@example.com.",
  "is_error": false
}`;

// Six-row trace of ticket T1 end to end (sub=3).
const T1_TRACE_ROWS = [
  {
    n: 1,
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    msg: "\"I can't log in - reset my password.\"",
    note: "Plain English. No customer_id, just an intent.",
  },
  {
    n: 2,
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: lookup_customer, input: { email: \"alice@example.com\" } }",
    note: "Email comes from the conversation header. Model needs the customer_id before it can reset.",
  },
  {
    n: 3,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result { content: { customer_id: \"c-9924\", plan: \"Pro\" } }",
    note: "DB hit. The runtime turns the function return into a tool_result message.",
  },
  {
    n: 4,
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: reset_password, input: { customer_id: \"c-9924\" } }",
    note: "Now it has c-9924 from step 3. Second turn of the loop.",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result { content: \"Email sent.\" }",
    note: "Side effect happens here. The runtime is the single chokepoint.",
  },
  {
    n: 6,
    actor: "Model",
    color: C.green,
    soft: SOFT.green,
    msg: "\"Done - check alice@example.com for the reset link.\"",
    note: "Final assistant message. No more tool_use - the model is satisfied.",
  },
];

// Streaming timeline events (sub=4). Each event annotates a phase of the stream.
const STREAM_PHASES = [
  { phase: "Stream begins", color: C.cyan, soft: SOFT.cyan, note: "Assistant tokens start arriving one by one." },
  { phase: "Partial text streams", color: C.cyan, soft: SOFT.cyan, note: "\"Let me look that up for you...\" appears word by word." },
  { phase: "Stream pauses", color: C.yellow, soft: SOFT.yellow, note: "Model decides to call a tool. Token stream halts." },
  { phase: "tool_use block emitted", color: C.purple, soft: SOFT.purple, note: "The block arrives as one complete JSON object, NOT token-by-token." },
  { phase: "Runtime executes", color: C.orange, soft: SOFT.orange, note: "Your code runs the real function. Could take 200ms or 2s." },
  { phase: "tool_result delivered", color: C.green, soft: SOFT.green, note: "Result message appended; model re-invoked to continue." },
  { phase: "Stream resumes", color: C.cyan, soft: SOFT.cyan, note: "New assistant tokens start flowing again, building the final answer." },
];

// Stacked latency-budget rows for ticket T1 (sub=5). Total must sum to 3.4s.
const LATENCY_BUDGET = [
  { label: "LLM call 1 (reads user, emits lookup_customer)", ms: 1200, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
  { label: "lookup_customer tool execution", ms: 200, color: C.teal, soft: SOFT.teal, kind: "Tool" },
  { label: "LLM call 2 (reads result, emits reset_password)", ms: 1100, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
  { label: "reset_password tool execution", ms: 200, color: C.teal, soft: SOFT.teal, kind: "Tool" },
  { label: "LLM call 3 (reads result, emits final answer)", ms: 700, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
];

// Render a styled mono JSON artifact with selected keys highlighted.
const HighlightedJson = ({ json, fields, soft }) => {
  // Build segments: walk the string, when we hit a field name in quotes, color the line.
  const lines = json.split("\n");
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 6,
        background: DIM_BG,
        border: `1px solid ${DIM_BORDER}`,
        fontFamily: "monospace",
        fontSize: 14,
        color: soft,
        whiteSpace: "pre",
        textAlign: "left",
        overflowX: "auto",
      }}
    >
      {lines.map((line, i) => {
        const match = fields.find((f) => line.includes(`"${f.key}"`));
        if (match) {
          return (
            <div key={i} style={{ color: match.soft }}>
              {line}
            </div>
          );
        }
        return (
          <div key={i} style={{ color: soft }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

export const ToolCallLifecycle = (ctx) => {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  const totalMs = LATENCY_BUDGET.reduce((a, b) => a + b.ms, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            From Request To Final Answer
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            One tool call passes through six actors. The user starts it, the model decides, the runtime executes,
            the tool returns, the runtime wraps the result, the model writes the answer. Every arrow is a message
            of a specific kind.
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
              The Tool-Call Swim-Lane
            </T>
            <svg
              viewBox="0 0 760 380"
              style={{ width: "100%", maxWidth: 760, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Six-row horizontal swim-lane for the tool-call lifecycle. Rows from top to bottom: User, Model,
                Runtime, Tool, Runtime, Model. Each row shows the actor on the left and the message kind it
                emits (user message, tool_use, function call, function return, tool_result, assistant message).
                Arrows connect each row to the next.
              </desc>
              {/* Six lanes, viewBox 760 wide, 380 tall. Row height 60. */}
              {LIFECYCLE_STEPS.map((step, i) => {
                const y = 15 + i * 60;
                return (
                  <g key={i}>
                    {/* Actor box on the left */}
                    <rect
                      x="20"
                      y={y}
                      width="160"
                      height="44"
                      rx="8"
                      fill={`${step.color}24`}
                      stroke={step.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x="100"
                      y={y + 20}
                      fill={step.soft}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {step.actor}
                    </text>
                    <text x="100" y={y + 36} fill={step.soft} fontSize="11" textAnchor="middle">
                      Step {i + 1}
                    </text>

                    {/* Arrow to message box */}
                    <line
                      x1="180"
                      y1={y + 22}
                      x2="225"
                      y2={y + 22}
                      stroke={step.color}
                      strokeWidth="2"
                    />
                    <polygon points={`225,${y + 22} 217,${y + 18} 217,${y + 26}`} fill={step.color} />

                    {/* Message label box on the right */}
                    <rect
                      x="230"
                      y={y + 4}
                      width="510"
                      height="36"
                      rx="6"
                      fill={`${step.color}12`}
                      stroke={`${step.color}40`}
                      strokeWidth="1"
                    />
                    <text x="485" y={y + 26} fill={step.soft} fontSize="13" textAnchor="middle">
                      {step.msg}
                    </text>

                    {/* Down-arrow to next row */}
                    {i < LIFECYCLE_STEPS.length - 1 && (
                      <>
                        <line
                          x1="100"
                          y1={y + 44}
                          x2="100"
                          y2={y + 60}
                          stroke="#666"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <polygon points={`100,${y + 60} 96,${y + 52} 104,${y + 52}`} fill="#666" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
              }}
            >
              {LIFECYCLE_STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    maxWidth: 720,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${step.color}06`,
                    border: `1px solid ${step.color}12`,
                    textAlign: "center",
                  }}
                >
                  <span style={pill(step.color)}>{step.actor.toUpperCase()}</span>
                  <T color={step.soft} center size={13} style={{ marginTop: 4 }}>
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Six actors. Two messages (tool_use, tool_result) carry the call from model to runtime and back.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The model never touches the tool directly - it only emits tool_use blocks. The runtime is the
            single boundary where every real-world effect (DB read, email send, refund) actually happens.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Tool-Use: Model Asks Runtime To Call
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            When the model decides to call a tool, generation halts and it emits a single tool_use block. This
            is the exact shape - four fields, every field is load-bearing. Your runtime parses this block to
            decide what to execute.
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
              Tool-Use Message
            </T>
            <div style={{ marginTop: 10 }}>
              <HighlightedJson
                json={TOOL_USE_MSG}
                fields={TOOL_USE_FIELDS}
                soft={SOFT.teal}
              />
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
            {TOOL_USE_FIELDS.map((f) => (
              <div
                key={f.key}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${f.color}06`,
                  border: `1px solid ${f.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(f.color)}>{f.key.toUpperCase()}</span>
                <T color={f.soft} center size={13} style={{ marginTop: 8 }}>
                  {f.note}
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
            tool_use = type + id + name + input. That is the whole contract.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Notice the customer_id c-9924 inside input - it came from a previous tool_result in this same
            conversation. The model carries values forward between turns just like it carries words.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool-Result: Runtime Returns The Outcome
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            After the runtime executes the real function, it wraps the return value into a tool_result block
            and appends it to the conversation. The model then re-reads everything (user, prior assistant
            messages, tool_use, tool_result) and continues.
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
              Tool-Result Message
            </T>
            <div style={{ marginTop: 10 }}>
              <HighlightedJson
                json={TOOL_RESULT_MSG}
                fields={TOOL_RESULT_FIELDS}
                soft={SOFT.blue}
              />
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
            {TOOL_RESULT_FIELDS.map((f) => (
              <div
                key={f.key}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${f.color}06`,
                  border: `1px solid ${f.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(f.color)}>{f.key.toUpperCase()}</span>
                <T color={f.soft} center size={13} style={{ marginTop: 8 }}>
                  {f.note}
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
            tool_use_id pairs the response to the request. Same id in, same id out.
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            If the tool failed - DB down, validation error, network blip - your runtime still produces a
            tool_result, but flips is_error to true. The model reads the failure and adapts, instead of
            assuming success.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Trace: Ticket T1 Password Reset
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Now we play the whole lifecycle on a real ticket. T1 is &quot;I can&apos;t log in - reset my
            password.&quot; The model loops twice (lookup_customer, then reset_password) before it can
            answer.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={SOFT.green} center size={13}>
              Ticket T1 - End-To-End Trace
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {T1_TRACE_ROWS.map((row) => (
                <div
                  key={row.n}
                  style={{
                    padding: "10px 14px",
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
                    <span style={pill(row.color)}>STEP {row.n}</span>
                    <T color={row.color} bold size={14}>
                      {row.actor}
                    </T>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: DIM_BG,
                      border: `1px solid ${DIM_BORDER}`,
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: row.soft,
                      textAlign: "left",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {row.msg}
                  </div>
                  <T color={row.soft} center size={13} style={{ marginTop: 8 }}>
                    {row.note}
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
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.green,
            }}
          >
            T1: 2 tool calls (lookup_customer + reset_password), 3 LLM turns, 1 final answer.
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            The model never has c-9924 in step 2 - it only learns the id from step 3&apos;s tool_result.
            That is why the loop matters: each turn unlocks the next call by giving the model new evidence.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Tools While Streaming
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            In production you usually stream assistant tokens to the UI for that typewriter effect. Tool
            calls fit cleanly inside a stream - but with one twist. Text streams token by token; tool blocks
            arrive whole.
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
              Stream Timeline (Left To Right = Time)
            </T>
            <svg
              viewBox="0 0 760 220"
              style={{ width: "100%", maxWidth: 760, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Horizontal timeline showing how tool calls interleave with a streaming assistant response.
                Time flows left to right. Phases include stream begin, partial text streaming, stream pause,
                tool_use block emitted whole, runtime executes, tool_result delivered, and stream resume.
                Each phase is a colored segment along a single horizontal bar.
              </desc>
              {/* Timeline axis */}
              <line x1="20" y1="180" x2="740" y2="180" stroke="#444" strokeWidth="1" />
              <text x="20" y="205" fill="#aaa" fontSize="11" textAnchor="start">
                T = 0
              </text>
              <text x="740" y="205" fill="#aaa" fontSize="11" textAnchor="end">
                T = done
              </text>

              {/* Seven phases laid out along the timeline */}
              {STREAM_PHASES.map((p, i) => {
                const segWidth = 100;
                const x = 20 + i * segWidth;
                return (
                  <g key={i}>
                    {/* Phase block */}
                    <rect
                      x={x + 4}
                      y="80"
                      width={segWidth - 8}
                      height="60"
                      rx="6"
                      fill={`${p.color}24`}
                      stroke={p.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + segWidth / 2}
                      y="108"
                      fill={p.soft}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {p.phase.split(" ")[0]}
                    </text>
                    <text
                      x={x + segWidth / 2}
                      y="124"
                      fill={p.soft}
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {p.phase.split(" ").slice(1).join(" ")}
                    </text>

                    {/* Tick on axis */}
                    <line
                      x1={x + segWidth / 2}
                      y1="170"
                      x2={x + segWidth / 2}
                      y2="180"
                      stroke="#666"
                      strokeWidth="1"
                    />
                    <text
                      x={x + segWidth / 2}
                      y="165"
                      fill={p.soft}
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}

              <text x="380" y="40" fill={SOFT.purple} fontSize="13" textAnchor="middle" fontWeight="700">
                Stream Begins -&gt; Text -&gt; Pause -&gt; Tool -&gt; Result -&gt; Stream Resumes
              </text>
            </svg>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {STREAM_PHASES.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${p.color}06`,
                    border: `1px solid ${p.color}12`,
                    textAlign: "center",
                  }}
                >
                  <span style={pill(p.color)}>PHASE {i + 1}</span>
                  <T color={p.color} bold size={13} style={{ marginTop: 4 }}>
                    {p.phase}
                  </T>
                  <T color={p.soft} center size={13} style={{ marginTop: 4 }}>
                    {p.note}
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
            Tool blocks aren&apos;t streamed token-by-token; they arrive complete.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            Your UI shows the partial text as it streams, but holds the spinner during tool execution. When
            the tool_result lands and the stream resumes, the next batch of assistant tokens picks up where
            it left off and writes the answer that uses the result.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Where The Seconds Go
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T1 took 3.4 seconds end-to-end. Where did the time go? Most of it lives in the LLM calls,
            not the tool calls. This is the most useful number to internalize when you start optimizing an
            agent.
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
              T1 Latency Budget (Total: {(totalMs / 1000).toFixed(1)}s)
            </T>

            {/* Stacked horizontal bar */}
            <div
              style={{
                marginTop: 14,
                width: "100%",
                height: 32,
                display: "flex",
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${C.cyan}24`,
              }}
            >
              {LATENCY_BUDGET.map((row, i) => (
                <div
                  key={i}
                  style={{
                    width: `${(row.ms / totalMs) * 100}%`,
                    background: `${row.color}40`,
                    borderRight:
                      i < LATENCY_BUDGET.length - 1 ? `1px solid ${row.color}80` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: row.soft,
                  }}
                >
                  {row.ms}ms
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {LATENCY_BUDGET.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${row.color}06`,
                    border: `1px solid ${row.color}12`,
                  }}
                >
                  <span style={pill(row.color)}>{row.kind.toUpperCase()}</span>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: row.soft,
                      minWidth: 70,
                      textAlign: "left",
                    }}
                  >
                    {(row.ms / 1000).toFixed(1)}s
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: row.soft,
                      textAlign: "left",
                    }}
                  >
                    {row.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 14,
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}12`,
                border: `1px solid ${C.cyan}24`,
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
              }}
            >
              LLM calls: 3.0s (88%). Tool calls: 0.4s (12%). The model is the bottleneck.
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
            Total: {(totalMs / 1000).toFixed(1)} seconds. Every extra LLM call adds about 1 second.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Speeding up T1 means cutting LLM turns, not tool latency. Parallel tool calls (next chapter) let
            you fire lookup_customer and lookup_subscription in one turn instead of two - shaving a whole
            LLM call from the budget.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// 13.10 - Parallel Tools + Tool Choice
// Ticket T2: "Reset my password but my email also changed to new@example.com"
// Two independent lookups can run in parallel; the mutations that follow must serialize.
const T2_SERIAL_STEPS = [
  { label: "LLM call 1", kind: "LLM", color: C.cyan, soft: SOFT.cyan, ms: 1200 },
  { label: "lookup_customer", kind: "Tool", color: C.teal, soft: SOFT.teal, ms: 200 },
  { label: "LLM call 2", kind: "LLM", color: C.cyan, soft: SOFT.cyan, ms: 1200 },
  { label: "lookup_subscription", kind: "Tool", color: C.teal, soft: SOFT.teal, ms: 200 },
];

const T2_PARALLEL_STEPS = [
  { label: "LLM call 1", kind: "LLM", color: C.cyan, soft: SOFT.cyan, ms: 1200 },
  {
    label: "lookup_customer + lookup_subscription (concurrent)",
    kind: "Tool",
    color: C.green,
    soft: SOFT.green,
    ms: 200,
  },
];

// sub=1 decision cards - independent vs dependent calls.
const PARALLEL_DECISION_CARDS = [
  {
    kind: "Independent",
    verdict: "Parallel",
    color: C.green,
    soft: SOFT.green,
    pair: ["lookup_customer(email)", "lookup_subscription(email)"],
    reason: "Neither call reads the other's output. Both take an email and return a record.",
    rule: "Both tool_use blocks are emitted in the SAME assistant turn. Runtime fans out, awaits both, returns both tool_results.",
  },
  {
    kind: "Dependent",
    verdict: "Serial",
    color: C.orange,
    soft: SOFT.orange,
    pair: ["lookup_customer(email)", "process_refund(customer_id, ...)"],
    reason: "process_refund needs customer_id from lookup_customer's result. The second call cannot be formed until the first returns.",
    rule: "Two assistant turns are required. Turn 1 = lookup. Turn 2 = refund (after the tool_result is appended).",
  },
];

// sub=2 - tool_choice auto scenarios.
const TOOL_CHOICE_AUTO_SCENARIOS = [
  {
    user: "Ticket T5: \"Pro vs Enterprise - what's different?\"",
    pick: "search_kb(query=\"Pro vs Enterprise\")",
    note: "Knowledge question. Model picks the docs tool.",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    user: "User: \"Hey, good morning!\"",
    pick: "No tool. Plain assistant reply.",
    note: "Chitchat. Calling a tool would be wasted latency.",
    color: C.indigo,
    soft: SOFT.indigo,
  },
  {
    user: "Ticket T2: \"Reset my password and email also changed.\"",
    pick: "lookup_customer AND lookup_subscription",
    note: "Two tool_use blocks in one turn. Auto still picks - and it can pick more than one.",
    color: C.teal,
    soft: SOFT.teal,
  },
];

// sub=3 - the four tool_choice modes.
const TOOL_CHOICE_MODES = [
  {
    mode: "auto",
    color: C.cyan,
    soft: SOFT.cyan,
    behavior: "Model decides whether to call a tool, and which one(s).",
    whenToUse: "Default. Use for most flows - chitchat, mixed Q&A, anything where the next step depends on the input.",
    config: "tool_choice: \"auto\"",
  },
  {
    mode: "required",
    color: C.yellow,
    soft: SOFT.yellow,
    behavior: "Model MUST call at least one tool. Plain-text replies are blocked.",
    whenToUse: "When intent is already routed (e.g., user clicked \"Run a search\"). Forces the tool path.",
    config: "tool_choice: \"required\"",
  },
  {
    mode: "none",
    color: C.red,
    soft: SOFT.red,
    behavior: "Model MUST NOT call any tool. It can only emit plain text.",
    whenToUse: "Final summarization, drafting a reply from already-gathered context, or pure chitchat.",
    config: "tool_choice: \"none\"",
  },
  {
    mode: "specific",
    color: C.purple,
    soft: SOFT.purple,
    behavior: "Force a specific tool. Model can ONLY call this one named tool.",
    whenToUse: "Deterministic routing - your classifier already decided which API to call. The model fills in the arguments.",
    config: "tool_choice: { type: \"tool\", name: \"search_kb\" }",
  },
];

// sub=4 - ticket T4 latency bars: cancel + refund + escalate.
// Serial: 4 LLM calls of 1.5s + 4 tool calls of 200ms each = 6.8s.
// Parallel: 3 lookups concurrent (200ms) + 1 follow-up mutation. 3 LLM calls of 1.5s = 4.5s LLM + 200ms tool = 4.7s.
const T4_LATENCY_COMPARE = {
  serial: {
    title: "Serial (4 turns)",
    color: C.orange,
    soft: SOFT.orange,
    bars: [
      { label: "LLM call 1", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      { label: "lookup_customer", ms: 200, color: C.teal, soft: SOFT.teal },
      { label: "LLM call 2", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      { label: "lookup_subscription", ms: 200, color: C.teal, soft: SOFT.teal },
      { label: "LLM call 3", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      { label: "lookup_refund_policy", ms: 200, color: C.teal, soft: SOFT.teal },
      { label: "LLM call 4", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      { label: "process_refund", ms: 200, color: C.teal, soft: SOFT.teal },
    ],
    totalMs: 6800,
    llmCalls: 4,
    summary: "4 LLM calls of 1.5s + 4 tool calls of 200ms = 6.8s",
  },
  parallel: {
    title: "Parallel (2 turns)",
    color: C.green,
    soft: SOFT.green,
    bars: [
      { label: "LLM call 1", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      {
        label: "lookup_customer + lookup_subscription + lookup_refund_policy (concurrent)",
        ms: 200,
        color: C.green,
        soft: SOFT.green,
      },
      { label: "LLM call 2", ms: 1500, color: C.cyan, soft: SOFT.cyan },
      { label: "process_refund", ms: 200, color: C.teal, soft: SOFT.teal },
      { label: "LLM call 3", ms: 1300, color: C.cyan, soft: SOFT.cyan },
    ],
    totalMs: 4700,
    llmCalls: 3,
    summary: "3 LLM calls + 3 lookups concurrent + 1 mutation = 4.7s",
  },
  savingsPct: 31,
};

// sub=5 - Ticket T2 trace with parallel lookups, then sequential mutations.
const T2_TRACE_ROWS = [
  {
    n: 1,
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    msg: "\"Reset my password but my email also changed to new@example.com\"",
    note: "Two intents in one ticket: change email AND reset password.",
  },
  {
    n: 2,
    actor: "Model (turn 1)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use [lookup_customer(email=old) AND lookup_subscription(email=old)]",
    note: "Both blocks emitted in the SAME assistant turn. Runtime fans them out in parallel.",
    parallel: true,
  },
  {
    n: 3,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result [customer_id=c-9924 AND subscription=active]",
    note: "Both finish at ~200ms (concurrent). Two tool_result blocks appended in parallel.",
    parallel: true,
  },
  {
    n: 4,
    actor: "Model (turn 2)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: change_email, input: { customer_id: \"c-9924\", new_email: \"new@example.com\" } }",
    note: "change_email must complete before reset_password (the reset link goes to the NEW email).",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result { content: \"Email updated.\" }",
    note: "Side effect: customer record mutated. Now reset_password can use the new email.",
  },
  {
    n: 6,
    actor: "Model (turn 3)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: reset_password, input: { customer_id: \"c-9924\" } }",
    note: "Reset link is sent to new@example.com because the prior turn already updated the record.",
  },
  {
    n: 7,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result { content: \"Reset email sent.\" }",
    note: "Single chokepoint - the runtime is where every real-world effect actually happens.",
  },
  {
    n: 8,
    actor: "Model (turn 4)",
    color: C.green,
    soft: SOFT.green,
    msg: "\"Updated your email to new@example.com and sent a reset link there.\"",
    note: "Final assistant message. No more tool_use.",
  },
];

export const ParallelToolsAndChoice = (ctx) => {
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
            Two Lookups, Two Strategies
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T2 needs two facts before it can act: who is this customer, and what is their
            subscription. The naive runtime asks one tool, waits, asks the next, waits again. A parallel
            runtime emits both tool_use blocks in the same assistant turn and runs them at the same time.
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
            Ticket T2: &quot;Reset my password but my email also changed to new@example.com&quot;
          </div>

          {/* Serial vs Parallel timelines */}
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            {/* Serial timeline */}
            <div style={{ ...tintedCard(C.orange), padding: "12px 14px 14px" }}>
              <span style={pill(C.orange)}>SERIAL</span>
              <T color={SOFT.orange} center size={13} style={{ marginTop: 8 }}>
                One call at a time. Each lookup waits for the previous turn.
              </T>
              <svg
                viewBox="0 0 320 140"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Serial timeline for ticket T2: an LLM call followed by lookup_customer (200ms), then a
                  second LLM call followed by lookup_subscription (200ms). Total 400ms of tool work plus 2
                  LLM calls. Bars are stacked left to right with time labels.
                </desc>
                {/* Row 1: LLM call 1 */}
                <rect x="10" y="20" width="80" height="22" rx="4" fill={`${C.cyan}30`} stroke={C.cyan} />
                <text x="50" y="35" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                  LLM 1
                </text>
                {/* Row 1: lookup_customer */}
                <rect x="92" y="20" width="40" height="22" rx="4" fill={`${C.teal}30`} stroke={C.teal} />
                <text x="112" y="35" fill={SOFT.teal} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="112" y="56" fill={SOFT.teal} fontSize="10" textAnchor="middle">
                  lookup_customer
                </text>
                {/* Row 1: LLM call 2 */}
                <rect x="134" y="20" width="80" height="22" rx="4" fill={`${C.cyan}30`} stroke={C.cyan} />
                <text x="174" y="35" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                  LLM 2
                </text>
                {/* Row 1: lookup_subscription */}
                <rect x="216" y="20" width="40" height="22" rx="4" fill={`${C.teal}30`} stroke={C.teal} />
                <text x="236" y="35" fill={SOFT.teal} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="236" y="56" fill={SOFT.teal} fontSize="10" textAnchor="middle">
                  lookup_subscription
                </text>
                {/* Time axis */}
                <line x1="10" y1="78" x2="260" y2="78" stroke="#666" strokeWidth="1" />
                <text x="135" y="100" fill="#aaa" fontSize="12" textAnchor="middle" fontWeight="700">
                  Total: 400ms tool work + 2 LLM calls
                </text>
                <text x="135" y="120" fill={SOFT.orange} fontSize="12" textAnchor="middle">
                  Each tool waits for the prior LLM turn.
                </text>
              </svg>
            </div>

            {/* Parallel timeline */}
            <div style={{ ...tintedCard(C.green), padding: "12px 14px 14px" }}>
              <span style={pill(C.green)}>PARALLEL</span>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                Both lookups are emitted in the same assistant turn and run concurrently.
              </T>
              <svg
                viewBox="0 0 320 140"
                style={{ width: "100%", maxWidth: 320, display: "block", margin: "10px auto 0" }}
              >
                <desc>
                  Parallel timeline for ticket T2: one LLM call followed by lookup_customer and
                  lookup_subscription running concurrently (both 200ms). Total 200ms of tool work plus 1
                  LLM call. The two tool bars are stacked vertically to show they share the same time slot.
                </desc>
                {/* Row 1: LLM call 1 */}
                <rect x="10" y="20" width="80" height="22" rx="4" fill={`${C.cyan}30`} stroke={C.cyan} />
                <text x="50" y="35" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                  LLM 1
                </text>
                {/* Row 1: lookup_customer (parallel, top) */}
                <rect x="92" y="8" width="40" height="22" rx="4" fill={`${C.green}30`} stroke={C.green} />
                <text x="112" y="22" fill={SOFT.green} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="92" y="-2" fill={SOFT.green} fontSize="10" textAnchor="start">
                  lookup_customer
                </text>
                {/* Row 1: lookup_subscription (parallel, bottom) */}
                <rect
                  x="92"
                  y="34"
                  width="40"
                  height="22"
                  rx="4"
                  fill={`${C.green}30`}
                  stroke={C.green}
                />
                <text x="112" y="48" fill={SOFT.green} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="135" y="48" fill={SOFT.green} fontSize="10" textAnchor="start">
                  lookup_subscription
                </text>
                {/* Time axis */}
                <line x1="10" y1="78" x2="135" y2="78" stroke="#666" strokeWidth="1" />
                <text x="70" y="100" fill="#aaa" fontSize="12" textAnchor="middle" fontWeight="700">
                  Total: 200ms tool work + 1 LLM call
                </text>
                <text x="70" y="120" fill={SOFT.green} fontSize="12" textAnchor="middle">
                  Both tools fan out at once.
                </text>
              </svg>
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
            Same two tool calls. Serial = 400ms + 2 LLM turns. Parallel = 200ms + 1 LLM turn.
          </div>

          {/* Serial step list */}
          <div style={{ marginTop: 14 }}>
            <T color={SOFT.cyan} center size={13}>
              Serial steps (one at a time):
            </T>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "center",
              }}
            >
              {T2_SERIAL_STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    maxWidth: 520,
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: s.soft,
                    textAlign: "center",
                  }}
                >
                  Step {i + 1}: {s.label} ({s.kind}, {s.ms}ms)
                </div>
              ))}
            </div>
          </div>

          {/* Parallel step list */}
          <div style={{ marginTop: 12 }}>
            <T color={SOFT.cyan} center size={13}>
              Parallel steps (concurrent):
            </T>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "center",
              }}
            >
              {T2_PARALLEL_STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    maxWidth: 520,
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: s.soft,
                    textAlign: "center",
                  }}
                >
                  Step {i + 1}: {s.label} ({s.kind}, {s.ms}ms)
                </div>
              ))}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Parallel only works when the two calls do not read each other&apos;s output. For independent
            lookups, parallel halves the tool latency and cuts an entire LLM turn.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Independent? Parallel. Dependent? Serial.
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The rule is simple: if call B needs an argument from call A&apos;s result, you cannot
            parallelize. The model has to wait for A before it can even form B. If neither call reads
            the other, fan out.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 14,
            }}
          >
            {PARALLEL_DECISION_CARDS.map((card) => (
              <div
                key={card.kind}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(card.color)}>{card.kind.toUpperCase()}</span>
                <T color={card.color} bold center size={15} style={{ marginTop: 8 }}>
                  Verdict: {card.verdict}
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
                  {card.pair.map((call, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: `${card.color}12`,
                        border: `1px solid ${card.color}24`,
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: card.soft,
                        width: "100%",
                        maxWidth: 260,
                        textAlign: "center",
                      }}
                    >
                      {call}
                    </div>
                  ))}
                </div>
                <T color={card.soft} center size={13} style={{ marginTop: 10 }}>
                  {card.reason}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontSize: 13,
                    color: card.soft,
                    textAlign: "center",
                  }}
                >
                  {card.rule}
                </div>
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
            Parallelize when calls don&apos;t read each other&apos;s outputs.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            process_refund needs customer_id - so lookup_customer must run first, in its own turn. But
            lookup_customer and lookup_subscription both take the same email and return independent
            records, so they can share one turn.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool Choice = Auto (Default)
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            By default, the model decides whether to call a tool, which tool, and how many tools. You
            set tool_choice to &quot;auto&quot; (or leave it unset) and let the model route. For a
            customer-support agent, this covers most flows.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 16px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
            }}
          >
            <T color={SOFT.blue} center size={13}>
              Config
            </T>
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                borderRadius: 6,
                background: DIM_BG,
                border: `1px solid ${DIM_BORDER}`,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.blue,
                textAlign: "center",
              }}
            >
              tool_choice: &quot;auto&quot;
            </div>
            <T color={SOFT.blue} center size={13} style={{ marginTop: 10 }}>
              The model decides per-message.
            </T>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {TOOL_CHOICE_AUTO_SCENARIOS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${s.color}06`,
                  border: `1px solid ${s.color}24`,
                  textAlign: "center",
                }}
              >
                <T color={s.color} bold center size={13}>
                  Input
                </T>
                <div
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: s.soft,
                    textAlign: "center",
                  }}
                >
                  {s.user}
                </div>
                <T color={s.color} bold center size={13} style={{ marginTop: 10 }}>
                  Model picks
                </T>
                <div
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: s.soft,
                    textAlign: "center",
                  }}
                >
                  {s.pick}
                </div>
                <T color={s.soft} center size={13} style={{ marginTop: 8 }}>
                  {s.note}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Auto is the default for a reason - it covers chitchat (no tool), single lookups, and parallel
            lookups all from one config. You only switch modes when you need to control the model&apos;s
            hand.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Four Modes Of Tool Choice
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            tool_choice is a single field with four shapes. Each shape locks down the model&apos;s
            behavior a different amount. The right choice depends on how much control you already have
            from the calling code.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {TOOL_CHOICE_MODES.map((m) => (
              <div
                key={m.mode}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${m.color}06`,
                  border: `1px solid ${m.color}24`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span style={pill(m.color)}>{m.mode.toUpperCase()}</span>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: DIM_BG,
                        border: `1px solid ${DIM_BORDER}`,
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: m.soft,
                        textAlign: "center",
                      }}
                    >
                      {m.config}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={m.color} bold center size={13}>
                      Behavior
                    </T>
                    <T color={m.soft} center size={13} style={{ marginTop: 4 }}>
                      {m.behavior}
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={m.color} bold center size={13}>
                      When to use
                    </T>
                    <T color={m.soft} center size={13} style={{ marginTop: 4 }}>
                      {m.whenToUse}
                    </T>
                  </div>
                </div>
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
            auto = decide. required = must call something. none = must not call. specific = force this tool.
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            The specific shape - {`{type: "tool", name: "X"}`} - is how you wire a deterministic router
            into the agent. Your classifier picks the API, and the model just fills the arguments.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Numbers: How Much Does Parallel Save?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Ticket T4: a customer wants to cancel, get a refund, and escalate to a human. Three
            independent lookups (customer, subscription, refund policy) feed one mutation
            (process_refund). Serial takes 4 LLM turns. Parallel collapses the three lookups into one
            turn.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.purple,
            }}
          >
            Ticket T4: &quot;Cancel my subscription, refund this month, and have someone call me.&quot;
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 14,
            }}
          >
            {/* Serial bars */}
            <div style={{ ...tintedCard(T4_LATENCY_COMPARE.serial.color), padding: "12px 14px 14px" }}>
              <span style={pill(T4_LATENCY_COMPARE.serial.color)}>SERIAL</span>
              <T color={T4_LATENCY_COMPARE.serial.soft} center size={13} style={{ marginTop: 8 }}>
                {T4_LATENCY_COMPARE.serial.title}
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: "stretch",
                }}
              >
                {T4_LATENCY_COMPARE.serial.bars.map((b, i) => {
                  const widthPct = Math.max(6, Math.round((b.ms / 1700) * 100));
                  return (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          flex: "0 0 120px",
                          fontSize: 11,
                          color: b.soft,
                          textAlign: "right",
                          fontFamily: "monospace",
                        }}
                      >
                        {b.label}
                      </div>
                      <div
                        style={{
                          flex: "1 1 auto",
                          position: "relative",
                          height: 18,
                          background: DIM_BG,
                          border: `1px solid ${DIM_BORDER}`,
                          borderRadius: 4,
                        }}
                      >
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: "100%",
                            background: `${b.color}40`,
                            border: `1px solid ${b.color}`,
                            borderRadius: 4,
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            left: 6,
                            top: 1,
                            fontSize: 11,
                            color: b.soft,
                            fontFamily: "monospace",
                          }}
                        >
                          {b.ms}ms
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  color: T4_LATENCY_COMPARE.serial.soft,
                  textAlign: "center",
                }}
              >
                {T4_LATENCY_COMPARE.serial.summary}
              </div>
              <T color={T4_LATENCY_COMPARE.serial.color} bold center size={15} style={{ marginTop: 8 }}>
                Total: {(T4_LATENCY_COMPARE.serial.totalMs / 1000).toFixed(1)}s
              </T>
              <T color={T4_LATENCY_COMPARE.serial.soft} center size={12} style={{ marginTop: 2 }}>
                {T4_LATENCY_COMPARE.serial.llmCalls} LLM calls
              </T>
            </div>

            {/* Parallel bars */}
            <div style={{ ...tintedCard(T4_LATENCY_COMPARE.parallel.color), padding: "12px 14px 14px" }}>
              <span style={pill(T4_LATENCY_COMPARE.parallel.color)}>PARALLEL</span>
              <T color={T4_LATENCY_COMPARE.parallel.soft} center size={13} style={{ marginTop: 8 }}>
                {T4_LATENCY_COMPARE.parallel.title}
              </T>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: "stretch",
                }}
              >
                {T4_LATENCY_COMPARE.parallel.bars.map((b, i) => {
                  const widthPct = Math.max(6, Math.round((b.ms / 1700) * 100));
                  return (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          flex: "0 0 120px",
                          fontSize: 11,
                          color: b.soft,
                          textAlign: "right",
                          fontFamily: "monospace",
                        }}
                      >
                        {b.label}
                      </div>
                      <div
                        style={{
                          flex: "1 1 auto",
                          position: "relative",
                          height: 18,
                          background: DIM_BG,
                          border: `1px solid ${DIM_BORDER}`,
                          borderRadius: 4,
                        }}
                      >
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: "100%",
                            background: `${b.color}40`,
                            border: `1px solid ${b.color}`,
                            borderRadius: 4,
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            left: 6,
                            top: 1,
                            fontSize: 11,
                            color: b.soft,
                            fontFamily: "monospace",
                          }}
                        >
                          {b.ms}ms
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  color: T4_LATENCY_COMPARE.parallel.soft,
                  textAlign: "center",
                }}
              >
                {T4_LATENCY_COMPARE.parallel.summary}
              </div>
              <T color={T4_LATENCY_COMPARE.parallel.color} bold center size={15} style={{ marginTop: 8 }}>
                Total: {(T4_LATENCY_COMPARE.parallel.totalMs / 1000).toFixed(1)}s
              </T>
              <T color={T4_LATENCY_COMPARE.parallel.soft} center size={12} style={{ marginTop: 2 }}>
                {T4_LATENCY_COMPARE.parallel.llmCalls} LLM calls
              </T>
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
            Savings: 6.8s &rarr; 4.7s ({T4_LATENCY_COMPARE.savingsPct}% faster, one fewer LLM call)
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The savings compound: each LLM turn costs ~1.5s, and you also save the tool latency that
            would have stacked. For a busy support agent firing thousands of tickets a day, that 31% is
            real money - and real customer wait time.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Trace: Ticket T2 With Parallel Lookups
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Same ticket T2 from sub=0, end to end. Turn 1 is parallel (two lookups). Turns 2 and 3 are
            sequential because change_email must complete before reset_password sends the link to the
            new address.
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
              Ticket T2 - End-To-End Trace
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {T2_TRACE_ROWS.map((row) => (
                <div
                  key={row.n}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${row.color}06`,
                    border: row.parallel
                      ? `2px solid ${row.color}80`
                      : `1px solid ${row.color}24`,
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
                    <span style={pill(row.color)}>STEP {row.n}</span>
                    <T color={row.color} bold size={13}>
                      {row.actor}
                    </T>
                    {row.parallel && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${C.green}24`,
                          color: SOFT.green,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        PARALLEL
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: DIM_BG,
                      border: `1px solid ${DIM_BORDER}`,
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: row.soft,
                      textAlign: "center",
                    }}
                  >
                    {row.msg}
                  </div>
                  <T color={row.soft} center size={13} style={{ marginTop: 6 }}>
                    {row.note}
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            First turn parallel; second turn sequential.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The split is determined by the data flow, not the model. Independent reads share one turn.
            Dependent mutations - change_email then reset_password - must serialize so each one acts on
            the latest record.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// 13.11 - Tool Errors, Retries, Validation
// Four-class error taxonomy used throughout the chapter. Each class has a color
// and is reused in the retry-policy table (sub=2) and the trace (sub=5).
const ERROR_CLASSES = [
  {
    cls: "Transient",
    code: "transient",
    color: C.yellow,
    soft: SOFT.yellow,
    examples: ["Rate limit hit (HTTP 429)", "Network timeout", "Upstream 503"],
    handling: "Retry with exponential backoff.",
    why: "The call would probably succeed if you tried again in a moment.",
  },
  {
    cls: "Permanent",
    code: "permanent",
    color: C.red,
    soft: SOFT.red,
    examples: ["Auth failed (HTTP 401)", "Customer not found", "Missing record"],
    handling: "Surface to user. Do not retry.",
    why: "Retrying changes nothing. The state, not the network, is the problem.",
  },
  {
    cls: "Malformed",
    code: "malformed",
    color: C.purple,
    soft: SOFT.purple,
    examples: ["Schema validation failed", "Missing required field", "Wrong type"],
    handling: "Return the error to the model. Let it self-correct.",
    why: "The model wrote bad arguments. Given the error message, it usually fixes them on the next turn.",
  },
  {
    cls: "Business-rule",
    code: "business_rule",
    color: C.orange,
    soft: SOFT.orange,
    examples: ["Refund $350 > $200 auto-approve cap", "Blocked customer", "Outside policy window"],
    handling: "Return structured \"rule violated\" reason. Model adapts or escalates.",
    why: "The call is syntactically valid but policy says no. The model needs the WHY to pick a different path.",
  },
];

// sub=1 - Structured error tool_result message. Highlighted keys make the
// is_error + error_class fields impossible to miss.
const ERROR_RESULT_LINES = [
  "{",
  "  \"type\": \"tool_result\",",
  "  \"tool_use_id\": \"toolu_01xyz...\",",
  "  \"content\": \"Refund denied: amount $350 exceeds $200 auto-approve cap.\",",
  "  \"is_error\": true,",
  "  \"error_class\": \"business_rule\"",
  "}",
];

const ERROR_RESULT_HIGHLIGHTS = ["is_error", "error_class"];

// sub=2 - Retry policy per error class. Each row mirrors a class color from sub=0.
const RETRY_POLICY_ROWS = [
  {
    cls: "Transient",
    color: C.yellow,
    soft: SOFT.yellow,
    retries: "3",
    strategy: "Exponential backoff: 200ms, 400ms, 800ms.",
    why: "Brief downtime usually clears in under a second.",
  },
  {
    cls: "Permanent",
    color: C.red,
    soft: SOFT.red,
    retries: "0",
    strategy: "Surface immediately. No backoff, no second attempt.",
    why: "Re-asking the same impossible question wastes turns and tokens.",
  },
  {
    cls: "Malformed",
    color: C.purple,
    soft: SOFT.purple,
    retries: "1",
    strategy: "Return schema error to model. One retry. Then escalate.",
    why: "The model fixes its own arguments on the second try ~95% of the time.",
  },
  {
    cls: "Business-rule",
    color: C.orange,
    soft: SOFT.orange,
    retries: "0",
    strategy: "Return policy reason. Model chooses an alternate tool or escalates.",
    why: "Retrying never flips a policy. The model must adapt the plan.",
  },
];

// sub=3 - Validation layer flow. Three stages of the runtime gate.
const VALIDATION_FLOW = [
  {
    n: 1,
    label: "Model emits tool_use",
    color: C.cyan,
    soft: SOFT.cyan,
    note: "Assistant turn includes a tool_use block with input arguments.",
  },
  {
    n: 2,
    label: "Runtime validates against schema",
    color: C.green,
    soft: SOFT.green,
    note: "Check required fields, types, enums, formats. Cheap and instant.",
  },
  {
    n: 3,
    label: "Branch on result",
    color: C.purple,
    soft: SOFT.purple,
    note: "If invalid: return malformed error immediately. If valid: execute the tool function.",
  },
];

// sub=4 - Idempotency comparison cards. Bad vs Good process_refund signatures.
const IDEMPOTENCY_CARDS = [
  {
    kind: "Without Idempotency Key",
    verdict: "Unsafe to retry",
    color: C.red,
    soft: SOFT.red,
    signature: "process_refund(invoice_id, reason)",
    scenario: "Runtime retries on a 503 - but the first call actually succeeded.",
    outcome: "Customer gets refunded TWICE. $700 charged back instead of $350.",
    rule: "Never auto-retry a mutation without an idempotency contract.",
  },
  {
    kind: "With Idempotency Key",
    verdict: "Safe to retry",
    color: C.green,
    soft: SOFT.green,
    signature: "process_refund(invoice_id, reason, idempotency_key)",
    scenario: "Key = hash(invoice_id). Backend stores it, dedupes any retry.",
    outcome: "Second call returns the SAME refund_id as the first. Customer charged once.",
    rule: "Derive the key from a stable input (invoice_id, request_id) so retries collide cleanly.",
  },
];

// sub=5 - Ticket T4 trace with a business-rule error and recovery.
const T4_ERROR_TRACE = [
  {
    n: 1,
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    msg: "\"Cancel my subscription and refund my last invoice ($350).\"",
    note: "Ticket T4 - one user message contains two intents and a refund amount over policy.",
  },
  {
    n: 2,
    actor: "Model (turn 1)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: lookup_customer, input: { email: \"...\" } }",
    note: "Read first. Need customer_id before any mutation.",
  },
  {
    n: 3,
    actor: "Runtime",
    color: C.green,
    soft: SOFT.green,
    msg: "tool_result { content: \"customer_id: c-7741\", is_error: false }",
    note: "Clean read. customer_id appended to the conversation.",
  },
  {
    n: 4,
    actor: "Model (turn 2)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: process_refund, input: { invoice_id: \"inv-882\", reason: \"customer requested\" } }",
    note: "Model attempts the refund directly. Amount is $350 - over the $200 auto-approve cap, but the model does not know that yet.",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: "tool_result { is_error: true, error_class: \"business_rule\", content: \"Refund $350 exceeds $200 auto-approve cap.\" }",
    note: "Business-rule error. No retry. The structured reason is the signal the model uses to adapt.",
    isError: true,
    adapt: true,
  },
  {
    n: 6,
    actor: "Model (turn 3)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: "tool_use { name: escalate_human, input: { customer_id: \"c-7741\", reason: \"refund $350 over policy cap\", urgency: \"medium\" } }",
    note: "Adapts: switches plan to escalate_human with full context (amount, reason, urgency).",
  },
  {
    n: 7,
    actor: "Runtime",
    color: C.green,
    soft: SOFT.green,
    msg: "tool_result { content: \"Escalation queued: ticket-9921 assigned to billing-team.\" }",
    note: "Successful escalation. Human will review and approve the $350.",
  },
  {
    n: 8,
    actor: "Model (turn 4)",
    color: C.green,
    soft: SOFT.green,
    msg: "\"I've escalated your refund to a human agent who can approve the $350. You'll hear back within one business day.\"",
    note: "Final reply. No more tool_use. The agent recovered from the policy error without surfacing a raw error to the user.",
  },
];

export const ToolErrorsRetries = (ctx) => {
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
            Tools Fail In Four Ways
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Production tools fail. The retry strategy depends on WHY the call failed. A rate limit
            is not the same as a missing record, and a schema typo is not the same as a policy
            violation. Group every failure into one of four classes and the rest of the runtime
            falls out.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {ERROR_CLASSES.map((e) => (
              <div
                key={e.cls}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${e.color}06`,
                  border: `1px solid ${e.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(e.color)}>{e.cls.toUpperCase()}</span>
                <div
                  style={{
                    marginTop: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: e.soft,
                    textAlign: "center",
                  }}
                >
                  error_class: &quot;{e.code}&quot;
                </div>
                <T color={e.color} bold center size={13} style={{ marginTop: 10 }}>
                  Examples
                </T>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {e.examples.map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: `${e.color}12`,
                        border: `1px solid ${e.color}24`,
                        fontSize: 12,
                        color: e.soft,
                        width: "100%",
                        maxWidth: 260,
                        textAlign: "center",
                      }}
                    >
                      {ex}
                    </div>
                  ))}
                </div>
                <T color={e.color} bold center size={13} style={{ marginTop: 10 }}>
                  Handling
                </T>
                <T color={e.soft} center size={13} style={{ marginTop: 4 }}>
                  {e.handling}
                </T>
                <T color={e.soft} center size={12} style={{ marginTop: 6, fontStyle: "italic" }}>
                  {e.why}
                </T>
              </div>
            ))}
          </div>

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
            Transient | Permanent | Malformed | Business-rule
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Every tool error your agent will ever see fits one of these four buckets. Classify on
            the way out of the tool, attach the class to the tool_result, and the rest of the
            agent loop knows what to do.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Errors Are Data, Not Exceptions
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The runtime does not throw a Python exception up the stack. It returns a structured
            tool_result with is_error set to true and an error_class field. The model reads those
            same fields it reads on a successful call and adapts. This is the whole reason an
            agent can recover from a business-rule violation without you writing special code.
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
              Tool-Result Message (error)
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
              {ERROR_RESULT_LINES.map((line, i) => {
                const isHighlighted = ERROR_RESULT_HIGHLIGHTS.some((key) =>
                  line.includes(`"${key}"`),
                );
                return (
                  <div
                    key={i}
                    style={{
                      color: isHighlighted ? SOFT.orange : SOFT.teal,
                      background: isHighlighted ? `${C.orange}14` : "transparent",
                      padding: isHighlighted ? "1px 4px" : 0,
                      borderRadius: isHighlighted ? 4 : 0,
                    }}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.orange), padding: "12px 14px" }}>
              <T color={C.orange} bold center size={14}>
                is_error: true
              </T>
              <T color={SOFT.orange} center size={13} style={{ marginTop: 6 }}>
                The model reads this flag the same way it reads any other field. If true, treat
                content as the failure reason, not the answer.
              </T>
            </div>
            <div style={{ ...tintedCard(C.orange), padding: "12px 14px" }}>
              <T color={C.orange} bold center size={14}>
                error_class: &quot;business_rule&quot;
              </T>
              <T color={SOFT.orange} center size={13} style={{ marginTop: 6 }}>
                The class tells the model whether to wait and retry, fix its arguments, escalate,
                or apologize. Same payload shape, different next action.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.teal,
            }}
          >
            $350 over the $200 cap = structured business_rule error, not a stack trace.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Because the error is data, the model can route on it. The next assistant turn picks a
            different tool (escalate_human) on its own. You did not write &quot;if business_rule
            then escalate&quot; - the model inferred it from the message.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Match The Retry To The Error
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            One retry policy across all errors is wrong. Retrying a permanent auth failure burns
            three round-trips for no reason. Not retrying a transient 503 fails a perfectly good
            call. The class drives the retry budget, the backoff schedule, and who handles it.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {RETRY_POLICY_ROWS.map((row) => (
              <div
                key={row.cls}
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
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span style={pill(row.color)}>{row.cls.toUpperCase()}</span>
                    <div
                      style={{
                        marginTop: 8,
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: DIM_BG,
                        border: `1px solid ${DIM_BORDER}`,
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: row.soft,
                        textAlign: "center",
                      }}
                    >
                      Retries: {row.retries}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={row.color} bold center size={13}>
                      Strategy
                    </T>
                    <T color={row.soft} center size={13} style={{ marginTop: 4 }}>
                      {row.strategy}
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={row.color} bold center size={13}>
                      Why this number
                    </T>
                    <T color={row.soft} center size={13} style={{ marginTop: 4 }}>
                      {row.why}
                    </T>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.blue,
            }}
          >
            Transient retry budget: 3 attempts with exponential backoff (200ms, 400ms, 800ms).
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Exponential backoff matters because thundering-herd retries amplify outages. Each
            retry waits twice as long, which spreads load and gives the dependency a chance to
            recover before you slam it again.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Validate Before Calling
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Most malformed errors never need to hit the tool function. The runtime already has
            the JSON schema from the tool definition - it can check the model&apos;s arguments
            against required fields, types, enums, and formats in microseconds, before it ever
            opens an HTTP socket or starts a transaction.
          </T>

          <div
            style={{
              marginTop: 16,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={SOFT.green} center size={13}>
              The Validation Gate
            </T>
            <svg
              viewBox="0 0 520 280"
              style={{ width: "100%", maxWidth: 520, display: "block", margin: "10px auto 0" }}
            >
              <desc>
                Validation flow for a tool call. The model emits a tool_use block, the runtime
                validates the arguments against the schema, and then branches: invalid arguments
                return a malformed error without executing, valid arguments call the tool
                function. The diagram highlights that schema validation is cheap and saves the
                expensive tool execution.
              </desc>
              {/* Step 1: Model */}
              <rect
                x="180"
                y="14"
                width="160"
                height="40"
                rx="6"
                fill={`${C.cyan}24`}
                stroke={C.cyan}
              />
              <text x="260" y="32" fill={SOFT.cyan} fontSize="13" textAnchor="middle" fontWeight="700">
                Model
              </text>
              <text x="260" y="48" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Emits tool_use
              </text>
              {/* Arrow down 1 */}
              <line x1="260" y1="54" x2="260" y2="84" stroke="#888" strokeWidth="1" />
              <polygon points="260,86 256,80 264,80" fill="#888" />
              {/* Step 2: Runtime validates */}
              <rect
                x="160"
                y="88"
                width="200"
                height="44"
                rx="6"
                fill={`${C.green}24`}
                stroke={C.green}
              />
              <text x="260" y="106" fill={SOFT.green} fontSize="13" textAnchor="middle" fontWeight="700">
                Runtime: Schema Validation
              </text>
              <text x="260" y="124" fill={SOFT.green} fontSize="11" textAnchor="middle">
                Check types, required, enums, formats
              </text>
              {/* Branch arrows */}
              <line x1="200" y1="132" x2="120" y2="172" stroke="#888" strokeWidth="1" />
              <polygon points="118,174 124,170 122,178" fill="#888" />
              <text x="135" y="158" fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Invalid
              </text>
              <line x1="320" y1="132" x2="400" y2="172" stroke="#888" strokeWidth="1" />
              <polygon points="402,174 396,170 398,178" fill="#888" />
              <text x="385" y="158" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Valid
              </text>
              {/* Step 3a: Malformed error (left branch) */}
              <rect
                x="20"
                y="176"
                width="200"
                height="60"
                rx="6"
                fill={`${C.purple}24`}
                stroke={C.purple}
              />
              <text x="120" y="196" fill={SOFT.purple} fontSize="13" textAnchor="middle" fontWeight="700">
                Return Malformed Error
              </text>
              <text x="120" y="212" fill={SOFT.purple} fontSize="11" textAnchor="middle">
                is_error: true
              </text>
              <text x="120" y="226" fill={SOFT.purple} fontSize="11" textAnchor="middle">
                error_class: &quot;malformed&quot;
              </text>
              {/* Step 3b: Execute (right branch) */}
              <rect
                x="300"
                y="176"
                width="200"
                height="60"
                rx="6"
                fill={`${C.cyan}24`}
                stroke={C.cyan}
              />
              <text x="400" y="196" fill={SOFT.cyan} fontSize="13" textAnchor="middle" fontWeight="700">
                Execute Tool Function
              </text>
              <text x="400" y="212" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                HTTP call, DB write, etc.
              </text>
              <text x="400" y="226" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                (expensive)
              </text>
              {/* Footer */}
              <text x="260" y="260" fill="#aaa" fontSize="12" textAnchor="middle" fontWeight="700">
                Cheap validation saves expensive function calls.
              </text>
            </svg>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {VALIDATION_FLOW.map((step) => (
              <div
                key={step.n}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: `${step.color}06`,
                  border: `1px solid ${step.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(step.color)}>STEP {step.n}</span>
                <T color={step.color} bold center size={13} style={{ marginTop: 8 }}>
                  {step.label}
                </T>
                <T color={step.soft} center size={12} style={{ marginTop: 6 }}>
                  {step.note}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.green,
            }}
          >
            Schema check (microseconds) gates the tool call (hundreds of milliseconds).
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Schema-level validation also gives the model a precise reason - &quot;missing required
            field invoice_id&quot; - which is much easier to fix than a generic 400 from the API.
            One retry usually does it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Safe-To-Retry Tools Need Idempotency Keys
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Reads are naturally safe to retry - they just return the same data. Mutations are
            different. process_refund without an idempotency key can double-refund if the runtime
            retries on a flaky 503 that actually succeeded. The fix is a key derived from a
            stable input so the backend can detect and dedupe the retry.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {IDEMPOTENCY_CARDS.map((card) => (
              <div
                key={card.kind}
                style={{
                  padding: "12px 14px 14px",
                  borderRadius: 8,
                  background: `${card.color}06`,
                  border: `1px solid ${card.color}24`,
                  textAlign: "center",
                }}
              >
                <span style={pill(card.color)}>{card.kind.toUpperCase()}</span>
                <T color={card.color} bold center size={15} style={{ marginTop: 8 }}>
                  Verdict: {card.verdict}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: DIM_BG,
                    border: `1px solid ${DIM_BORDER}`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: card.soft,
                    textAlign: "center",
                  }}
                >
                  {card.signature}
                </div>
                <T color={card.color} bold center size={13} style={{ marginTop: 10 }}>
                  Scenario
                </T>
                <T color={card.soft} center size={13} style={{ marginTop: 4 }}>
                  {card.scenario}
                </T>
                <T color={card.color} bold center size={13} style={{ marginTop: 10 }}>
                  Outcome
                </T>
                <T color={card.soft} center size={13} style={{ marginTop: 4 }}>
                  {card.outcome}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${card.color}12`,
                    border: `1px solid ${card.color}24`,
                    fontSize: 12,
                    color: card.soft,
                    textAlign: "center",
                  }}
                >
                  {card.rule}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.purple,
            }}
          >
            idempotency_key = hash(invoice_id) - retries collide, no double refund.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The pattern is universal: any mutation that can be retried needs a deterministic key.
            For refunds, invoice_id works. For password resets, request_id. For new orders, a
            client-generated UUID. Without it, retries are unsafe and you must either give up
            retries or risk double-spending.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Trace: Ticket T4 With Errors And Recovery
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T4: cancel + refund over the policy cap. Watch how the structured business_rule
            error in step 5 changes the model&apos;s plan in step 6. No exception handling code,
            no special-case routing - the model reads the error_class and switches to
            escalate_human on its own.
          </T>

          <div
            style={{
              marginTop: 16,
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
            Ticket T4: &quot;Cancel my subscription and refund my last invoice ($350).&quot;
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "14px 14px 18px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={SOFT.cyan} center size={13}>
              Ticket T4 - End-To-End Trace
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {T4_ERROR_TRACE.map((row) => (
                <div
                  key={row.n}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: `${row.color}06`,
                    border: row.isError
                      ? `2px solid ${row.color}80`
                      : `1px solid ${row.color}24`,
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
                    <span style={pill(row.color)}>STEP {row.n}</span>
                    <T color={row.color} bold size={13}>
                      {row.actor}
                    </T>
                    {row.isError && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${C.red}24`,
                          color: SOFT.red,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        BUSINESS-RULE ERROR
                      </span>
                    )}
                    {row.adapt && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${C.green}24`,
                          color: SOFT.green,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.4,
                        }}
                      >
                        TRIGGERS ADAPT
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: DIM_BG,
                      border: `1px solid ${DIM_BORDER}`,
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: row.soft,
                      textAlign: "center",
                    }}
                  >
                    {row.msg}
                  </div>
                  <T color={row.soft} center size={13} style={{ marginTop: 6 }}>
                    {row.note}
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
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.cyan,
            }}
          >
            Step 5 business_rule error -&gt; step 6 escalate_human. Same loop, structured recovery.
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The user never sees the raw policy error. They see a calm escalation message. That is
            the agent loop working as designed: errors are returned as data, the model classifies
            and adapts, and the human only sees the resolution.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// Section 13 Act 3: Protocols (MCP + A2A)
// Chapters 13.12 - 13.17

// --- Chapter 13.12 WhyProtocols data ---

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

export const WhyProtocols = (ctx) => {
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
            Every agent needs to call every tool. Without a shared protocol you end up writing a custom
            connector for each pair. With 5 agents and 6 tools that is already 30 bespoke integrations.
            Each new tool forces every agent to learn it; each new agent forces every tool&apos;s API to be
            re-wrapped.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center size={13}>
              5 Agents x 6 Tools = 30 Connectors. Hand-wired sprawl.
            </T>
            <svg
              viewBox="0 0 560 240"
              style={{ width: "100%", maxWidth: 620, display: "block", margin: "12px auto 0" }}
            >
              <desc>
                Five agents top row, six tools bottom row, every agent connects to every tool producing
                thirty crossed lines that visualize the M times N ad-hoc tool sprawl problem.
              </desc>
              {/* Connector lines: every agent to every tool */}
              {sprawlLines.map((ln, i) => (
                <line
                  key={i}
                  x1={ln.x1}
                  y1={ln.y1}
                  x2={ln.x2}
                  y2={ln.y2}
                  stroke={`${C.red}99`}
                  strokeWidth="1"
                />
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
                  <text
                    x={a.cx}
                    y="70"
                    fill={SOFT.purple}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
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
                  <text
                    x={t.cx}
                    y="220"
                    fill={SOFT.orange}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
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
            Every new tool needs every agent to learn it; every new agent needs every tool&apos;s API
            rewritten. The connectors grow as M x N - five times six is the small case, and it already
            looks like a tangle.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            A Protocol Turns M x N Into M + N
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            A protocol is a shared contract that sits in the middle. Each agent speaks it once; each
            tool speaks it once. Same 5 agents, same 6 tools, but now 5 + 6 = 11 clean lines instead of
            30. The hub-and-spoke shape is what makes the system additive instead of multiplicative.
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
                Five agents on top connect to six tools on bottom via a single protocol hub in the
                middle, reducing thirty crossed lines to eleven clean lines and demonstrating M plus N
                scaling.
              </desc>

              {/* Lines from agents to hub */}
              {SPRAWL_AGENTS.map((a) => (
                <line
                  key={`a-${a.label}`}
                  x1={a.cx}
                  y1="80"
                  x2="280"
                  y2="140"
                  stroke={C.indigo}
                  strokeWidth="1.5"
                />
              ))}

              {/* Lines from hub to tools */}
              {SPRAWL_TOOLS.map((t) => (
                <line
                  key={`t-${t.label}`}
                  x1="280"
                  y1="170"
                  x2={t.cx}
                  y2="220"
                  stroke={C.indigo}
                  strokeWidth="1.5"
                />
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
                  <text
                    x={a.cx}
                    y="70"
                    fill={SOFT.purple}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
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
              <text
                x="280"
                y="153"
                fill={SOFT.indigo}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
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
                  <text
                    x={t.cx}
                    y="240"
                    fill={SOFT.orange}
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
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
            Add a 6th agent -&gt; 1 new connector. Add a 7th tool -&gt; 1 new connector. No agent
            rewrites a tool API ever again.
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Same number of components, drastically different cost of change. That is the whole reason
            protocols exist - the math turns from O(M x N) to O(M + N).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            MCP, A2A, OpenAPI
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Three protocols you will run into. Each one picks a different shape of edge to standardize.
            MCP standardizes the edge between an agent host and tool servers. A2A standardizes the edge
            between two agents. HTTP + OpenAPI is the older general-purpose stack the rest of the
            internet runs on.
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
            MCP is the one most production agent stacks use today for tool access. A2A is newer and
            built for multi-agent systems. OpenAPI is not agent-specific - it is the underlying HTTP
            transport, useful when you need to expose an agent to existing services or vice versa.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Production Sign: 3+ Tools Or 3+ Agents
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            When does the protocol layer pay off? Use the decision grid below. Below the threshold,
            hand-wired tools are fine and a protocol is over-engineering. Above the threshold, the
            integration math gets ugly fast and the protocol is the production move.
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
            The 3 + 3 line is the typical production threshold. The exact number depends on rate of
            change. If new tools land monthly you cross the threshold sooner; if your tool set is
            frozen at 6, an ad-hoc setup can survive longer.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Protocol = Sandbox Contract
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Beyond reducing wiring, a protocol enforces a trust boundary. On the inside sits the
            host: your user data, the model, and the mutations you are willing to authorize. On the
            outside sits the tool server: third-party code you do not control. The protocol is the only
            channel that crosses the boundary, and it dictates what may pass.
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
                Concentric ring diagram showing a trusted host containing user data and the model
                surrounding an untrusted server tool, with protocol arrows crossing the boundary for
                capability listing and tool authorization that enforces the sandbox contract.
              </desc>
              {/* Outer ring - Host (Trusted) */}
              <circle
                cx="280"
                cy="160"
                r="140"
                fill={`${C.teal}0a`}
                stroke={C.teal}
                strokeWidth="2"
              />
              {/* Inner ring - Server (Untrusted) */}
              <circle
                cx="280"
                cy="160"
                r="60"
                fill={`${C.red}12`}
                stroke={C.red}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Outer label */}
              <text x="280" y="35" fill={SOFT.teal} fontSize="14" fontWeight="700" textAnchor="middle">
                Host (Trusted)
              </text>
              <text x="280" y="55" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                User data, model, allowed mutations
              </text>

              {/* Inner label */}
              <text
                x="280"
                y="155"
                fill={SOFT.red}
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                Server
              </text>
              <text x="280" y="172" fill={SOFT.red} fontSize="11" textAnchor="middle">
                (Untrusted)
              </text>

              {/* Arrows crossing the boundary - capabilities listed (server -> host) */}
              <path
                d="M 240 130 Q 200 110 170 90"
                fill="none"
                stroke={C.purple}
                strokeWidth="1.5"
              />
              <polygon points="170,90 178,93 175,99" fill={C.purple} />
              <text x="135" y="80" fill={SOFT.purple} fontSize="11" fontWeight="700">
                Capabilities Listed
              </text>

              {/* Arrows crossing the boundary - tool call authorized (host -> server) */}
              <path
                d="M 390 90 Q 360 110 320 130"
                fill="none"
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <polygon points="320,130 328,127 326,135" fill={C.cyan} />
              <text x="380" y="80" fill={SOFT.cyan} fontSize="11" fontWeight="700">
                Tool Calls Authorized
              </text>

              {/* Arrows crossing the boundary - results returned (server -> host) */}
              <path
                d="M 320 200 Q 360 230 400 250"
                fill="none"
                stroke={C.green}
                strokeWidth="1.5"
              />
              <polygon points="400,250 392,247 395,255" fill={C.green} />
              <text x="380" y="270" fill={SOFT.green} fontSize="11" fontWeight="700">
                Results Returned
              </text>

              {/* Boundary label */}
              <text x="280" y="300" fill={SOFT.teal} fontSize="11" fontStyle="italic" textAnchor="middle">
                The protocol is the only legal crossing
              </text>
            </svg>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            The protocol defines what the inner can ask for and what the outer must approve before
            allowing. Nothing else gets through. That sandbox boundary is what makes it safe to plug a
            third-party tool server into an agent that holds user data.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

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

export const McpArchitecture = (ctx) => {
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
            MCP splits the agent stack into three roles. The host is the application the user opens.
            Inside that host runs a client for each tool server it wants to talk to. The server is a
            separate process that exposes tools, resources, and prompts for the host to discover.
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
                Three vertically stacked role boxes showing MCP host application on top hosting a
                client connection in the middle that speaks to a tool server at the bottom.
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
            Three roles, one wire format. The host always owns the trust boundary; the server always
            sits on the other side; the client is the in-process adapter that connects them.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            One Host, Many Clients, Many Servers
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            The typical MCP topology is a hub. 1 host launches many clients - one per server it wants
            to talk to. Each client maintains its own connection. The host stitches all the listed
            tools into a single catalog the model can pick from. Here a single host hosts 3 clients,
            each wired to a different server.
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
                One host application contains three internal client connections each linked downward
                to a separate MCP server providing different tools.
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
                  <text
                    x={c.cx}
                    y="82"
                    fill={C.indigo}
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
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
                  <line
                    x1={c.cx}
                    y1="110"
                    x2={c.server.cx}
                    y2="220"
                    stroke={SOFT.blue}
                    strokeWidth="1.5"
                  />
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
                  <text
                    x={c.server.cx}
                    y="246"
                    fill={C.blue}
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {c.server.name}
                  </text>
                  <text x={c.server.cx} y="266" fill={SOFT.blue} fontSize="12" textAnchor="middle">
                    {c.server.desc}
                  </text>
                  <text
                    x={c.server.cx}
                    y="284"
                    fill={SOFT.blue}
                    fontSize="10"
                    fontStyle="italic"
                    textAnchor="middle"
                  >
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
            This is the standard topology. The host is the hub - it adds or drops servers without the
            servers ever talking to each other. The Postgres server has no idea the Linear server is
            also connected, and the model sees one merged toolset from all three.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Stdio, HTTP, SSE
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The MCP wire format is the same JSON-RPC regardless of how the bytes travel. There are
            three transports in common use. Stdio is local-only and runs the server as a child
            process. HTTP is the network workhorse for remote servers. SSE (Server-Sent Events) adds
            a streaming channel on top of HTTP so the server can push intermediate updates.
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
            Pick stdio when the server runs on the same machine and you want zero network surface.
            Pick HTTP when the server is hosted somewhere else. Pick SSE on top of HTTP when the
            server needs to stream progress back, like a long-running build or a search that returns
            partial results.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            How A Session Begins And Runs
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            An MCP session follows a fixed lifecycle: connect, then negotiate, then discover, then
            call. The Initialize Handshake exchanges protocol version and capabilities; the list step
            tells the host what is available; only then do tool calls flow.
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
                Five step horizontal flow diagram showing host launches client, client connects to
                server, initialize handshake, list available tools and resources and prompts, then
                call a tool and get a result.
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
                    <text
                      x={x + 65}
                      y="58"
                      fill={C.cyan}
                      fontSize="12"
                      fontWeight="700"
                      textAnchor="middle"
                    >
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
                        <line
                          x1={x + 130}
                          y1="70"
                          x2={x + 130 + 12}
                          y2="70"
                          stroke={SOFT.cyan}
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`${x + 130 + 12},70 ${x + 130 + 6},66 ${x + 130 + 6},74`}
                          fill={SOFT.cyan}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The lifecycle matters because the host cannot just call a tool blind. It must finish the
            Initialize Handshake (so both sides agree on protocol version) and then call list before
            it knows any tool names. Only after list returns does the model see a populated tool
            catalog.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Listing Capabilities
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Discovery is what makes MCP plug-and-play. The host sends a tools/list request; the
            server responds with the full catalog: each tool&apos;s name, human-readable description,
            and JSON schema for its input. The host hands this list to the model as the tool
            definitions for the next call.
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
            The host takes this list, merges it with any other servers&apos; catalogs, and passes the
            combined set as the model&apos;s tool definitions on the next turn. That is how an agent
            built on MCP picks up new capabilities without code changes on the host.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const McpPrimitives = () => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          MCP Primitives - Tools, Resources, Prompts
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const BuildingMcpServer = () => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          Building an MCP Server
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const McpSecurity = () => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          MCP Security
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const A2AProtocol = () => {
  return (
    <div>
      <Box color={C.purple}>
        <T color={C.purple} bold center size={22}>
          A2A - Agent-to-Agent Protocol
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};
