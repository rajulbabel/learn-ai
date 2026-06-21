import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Ticket T5 - the running customer-support example used in sub=0.
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
    flow: [
      "User asks T5",
      "LLM calls search_kb('Pro vs Enterprise')",
      "Knowledge base returns current doc",
      "LLM answers from doc",
    ],
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
    detail: 'Sends a message: "Refund my last invoice, the charge was wrong."',
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
    detail: 'Thinks: "User asked for a refund - I should call process_refund." Or chooses NOT to call any tool.',
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

export default function ToolUseAsBridge(ctx) {
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
            A bare LLM only knows what was in its training data. The moment your support agent has to look at the live
            knowledge base, your customer record, or trigger a real refund - text generation alone is not enough. Tools
            are how the model reaches out and touches the real world.
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
            A tool is exactly one thing: a function. You declare its signature. The model decides when to call it. Your
            runtime executes the function for real. The result flows back into the conversation.
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
                Three-box flow diagram showing how a tool call moves through the system: the Model on the left decides
                to call the function, the Runtime in the middle executes the real function, and the Result on the right
                flows back into the model's next turn. Arrows are labeled Decide, Execute, and Return.
              </desc>
              <rect
                x="20"
                y="60"
                width="140"
                height="80"
                rx="8"
                fill={`${C.cyan}12`}
                stroke={C.cyan}
                strokeWidth="1.5"
              />
              <text x="90" y="92" fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Model
              </text>
              <text x="90" y="112" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Decides WHEN
              </text>
              <text x="90" y="128" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                to call
              </text>

              <rect
                x="210"
                y="60"
                width="140"
                height="80"
                rx="8"
                fill={`${C.orange}12`}
                stroke={C.orange}
                strokeWidth="1.5"
              />
              <text x="280" y="92" fill={SOFT.orange} fontSize="14" fontWeight="700" textAnchor="middle">
                Runtime
              </text>
              <text x="280" y="112" fill={SOFT.orange} fontSize="11" textAnchor="middle">
                Executes the
              </text>
              <text x="280" y="128" fill={SOFT.orange} fontSize="11" textAnchor="middle">
                real function
              </text>

              <rect
                x="400"
                y="60"
                width="140"
                height="80"
                rx="8"
                fill={`${C.green}12`}
                stroke={C.green}
                strokeWidth="1.5"
              />
              <text x="470" y="92" fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Result
              </text>
              <text x="470" y="112" fill={SOFT.green} fontSize="11" textAnchor="middle">
                Flows back to
              </text>
              <text x="470" y="128" fill={SOFT.green} fontSize="11" textAnchor="middle">
                the model
              </text>

              <line x1="160" y1="100" x2="205" y2="100" stroke={C.teal} strokeWidth="2" />
              <polygon points="205,100 197,96 197,104" fill={C.teal} />
              <text x="182" y="92" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                Tool_use
              </text>

              <line x1="350" y1="100" x2="395" y2="100" stroke={C.teal} strokeWidth="2" />
              <polygon points="395,100 387,96 387,104" fill={C.teal} />
              <text x="372" y="92" fill={SOFT.teal} fontSize="11" textAnchor="middle">
                Execute
              </text>

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
            Critical separation: the LLM never executes code itself. It only emits a tool_use block. Your runtime does
            the actual call. This boundary is what makes tool use safe enough to ship.
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
            The model has never seen your codebase. The description is its only manual. If the description is vague, the
            model guesses; if it is specific, the model rarely misfires.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The Model Decides, The Runtime Executes
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Two distinct roles. The model is in charge of decisions - which tool, what arguments. Your code is in charge
            of side effects - reading the DB, charging the card, sending the email. Never mix them.
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
            Notice step 4: the model halts at tool_use. It does not execute anything itself. The runtime is the single
            chokepoint where every real-world side effect happens - which is exactly where you place auth, logging, and
            rate limits.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            One Call, Or A Loop Of Calls?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            A single tool call is the atom. An agent is what you get when you put that atom in a loop: reason, act,
            observe, then reason again with the new evidence.
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
                Triangular loop diagram with three labeled nodes: Reason at the top, Act on the bottom-right, Observe on
                the bottom-left. Arrows form a clockwise cycle Reason -&gt; Act -&gt; Observe -&gt; Reason. A small
                label in the center reads loop until done.
              </desc>
              <circle cx="280" cy="55" r="40" fill={`${C.cyan}24`} stroke={C.cyan} strokeWidth="2" />
              <text x="280" y="50" fill={SOFT.cyan} fontSize="14" fontWeight="700" textAnchor="middle">
                Reason
              </text>
              <text x="280" y="68" fill={SOFT.cyan} fontSize="10" textAnchor="middle">
                Which tool?
              </text>

              <circle cx="430" cy="165" r="40" fill={`${C.purple}24`} stroke={C.purple} strokeWidth="2" />
              <text x="430" y="160" fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Act
              </text>
              <text x="430" y="178" fill={SOFT.purple} fontSize="10" textAnchor="middle">
                Call tool
              </text>

              <circle cx="130" cy="165" r="40" fill={`${C.green}24`} stroke={C.green} strokeWidth="2" />
              <text x="130" y="160" fill={SOFT.green} fontSize="14" fontWeight="700" textAnchor="middle">
                Observe
              </text>
              <text x="130" y="178" fill={SOFT.green} fontSize="10" textAnchor="middle">
                Read result
              </text>

              <path d="M 312 78 Q 380 105 404 135" fill="none" stroke={C.purple} strokeWidth="2" />
              <polygon points="404,135 396,131 400,141" fill={C.purple} />

              <line x1="390" y1="165" x2="170" y2="165" stroke={C.green} strokeWidth="2" />
              <polygon points="170,165 178,161 178,169" fill={C.green} />

              <path d="M 155 138 Q 200 105 248 78" fill="none" stroke={C.cyan} strokeWidth="2" />
              <polygon points="248,78 244,86 254,82" fill={C.cyan} />

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
            A single tool call is the atom. An agent loop is the molecule. We formalize the loop in 26.3.
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
            For the rest of this section we work with one fixed inventory. Every example uses these eight tools - the
            shape of the schemas, the lifecycle of a call, the retry strategy when one fails.
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
                    overflowWrap: "anywhere",
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
            Notice the split: read-only tools are cheap to retry; side-effectful tools must be guarded with auth,
            validation, and approvals. process_refund is the canary - any refund over $200 escalates instead of
            executing.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
