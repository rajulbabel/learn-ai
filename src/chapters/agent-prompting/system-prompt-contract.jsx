import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers used by SystemPromptContract (13.2)

const CONTRACT_PARTS = [
  {
    name: "Persona",
    detail: "Who am I? What is my voice and role?",
  },
  {
    name: "Capabilities",
    detail: "What tools and data am I allowed to use?",
  },
  {
    name: "Constraints",
    detail: "What must I never say, promise, or do?",
  },
  {
    name: "Output Rules",
    detail: "How must my reply be formatted, cited, and structured?",
  },
];

const PERSONA_BEFORE = "You are a chatbot.";
const PERSONA_AFTER =
  "You are Alice's customer-support assistant for the customer support knowledge base. You are friendly, concise, and you never invent policies.";

const CAPABILITY_TOOLS = [
  {
    name: "search_kb",
    detail: "Searches the customer support knowledge base at docs.example.com.",
  },
  {
    name: "lookup_customer",
    detail: "Fetches the profile for a customer id like c-9924.",
  },
  {
    name: "process_refund",
    detail: "Issues a refund up to a configured dollar limit.",
  },
  {
    name: "escalate_human",
    detail: "Hands the conversation off to a human support agent.",
  },
];

const CONSTRAINTS = [
  "Never Promise Refunds Over $200 Without Escalation",
  "Never Share Another Customer's Data",
  "Never Claim Policies Not In The KB",
  "Never Call Tools Without First Looking Up The Customer",
];

const OUTPUT_RULES = [
  "Always Greet The Customer By Name",
  "Cite The KB Doc When Quoting Policy",
  "Wrap Tool Calls In <thinking> Tags First",
  "End With A Follow-Up Question Or Escalation Offer",
];

const FULL_SYSTEM_PROMPT = `You are Alice's customer-support assistant for the customer
support knowledge base at docs.example.com. You are friendly,
concise, and you never invent policies.

Tools available to you:
  search_kb, lookup_customer, process_refund, escalate_human.
Always call lookup_customer (e.g. c-9924) before any other tool.

Never promise refunds over $200 without escalating to a human.
Never share another customer's data. Never claim a policy that
is not in the KB.

Always greet the customer by name. Cite the KB doc when quoting
policy. Wrap any tool call in a <thinking> block first. End every
reply with a follow-up question or an escalation offer.`;

export default function SystemPromptContract(ctx) {
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
            The System Prompt Is The Contract
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The system prompt is the role contract. It is the constitution every later message is interpreted under. The
            model re-reads it on every single turn, so anything not in it does not exist for the agent.
          </T>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                ...tintedCard(C.cyan),
                padding: 16,
                width: "100%",
                maxWidth: 560,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  borderRadius: 4,
                  background: `${C.cyan}20`,
                  color: C.cyan,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                CONTRACT
              </div>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 6 }}>
                Read by the model on EVERY turn.
              </T>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {CONTRACT_PARTS.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: `${C.cyan}12`,
                      border: `1px solid ${C.cyan}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.cyan} bold center size={15}>
                      {p.name}
                    </T>
                    <T color={SOFT.cyan} center size={14} style={{ marginTop: 4 }}>
                      {p.detail}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Four moving parts: persona, capabilities, constraints, output rules. Get all four right and the agent
            behaves predictably. Skip one and it goes off-script.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Persona: Who Am I?
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Persona answers &quot;who am I, what is my voice, and what is my role?&quot; A vague persona produces a
            generic chatbot. A sharp persona produces an assistant that sounds like it works at your company.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 10px",
                  borderRadius: 4,
                  background: `${C.red}20`,
                  color: C.red,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                BEFORE - VAGUE
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: `${C.red}12`,
                  border: `1px solid ${C.red}24`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: SOFT.red,
                  textAlign: "center",
                }}
              >
                {PERSONA_BEFORE}
              </div>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                No role, no voice, no domain. The model fills the gap with a generic helpful tone.
              </T>
            </div>
            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "2px 10px",
                  borderRadius: 4,
                  background: `${C.green}20`,
                  color: C.green,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                AFTER - PERSONA-SPECIFIC
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}24`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: SOFT.green,
                  textAlign: "left",
                }}
              >
                {PERSONA_AFTER}
              </div>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                Names the user (Alice), names the role (customer-support assistant), names the voice (friendly, concise)
                and one guardrail (no invented policies).
              </T>
            </div>
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Three rules of thumb: name the user, name the role, name one thing the assistant must never do.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Capabilities: What Tools Do I Have?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Capabilities tell the model which tools are available, what each one does, and when to use it. Without this
            section, the model either refuses or hallucinates tool calls.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {CAPABILITY_TOOLS.map((t) => (
              <div key={t.name} style={{ ...tintedCard(C.purple), padding: 12 }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 4,
                    background: `${C.purple}20`,
                    color: C.purple,
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {t.name}
                </div>
                <T color={SOFT.purple} center size={14} style={{ marginTop: 8 }}>
                  {t.detail}
                </T>
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
            Tools available to you: search_kb, lookup_customer, process_refund, escalate_human.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 10 }}>
            The system prompt declares the tools. The API schema (chapter 13.8) is what actually wires them up. Both
            sides have to agree.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Constraints: What I Must Never Do
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Constraints are the negative-space rules. Every refund-gone-wrong, every leaked customer record, every
            invented policy traces back to a missing line here. Be explicit about the &quot;never&quot;s.
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
            {CONSTRAINTS.map((c) => (
              <div
                key={c}
                style={{
                  ...tintedCard(C.red),
                  padding: "12px 16px",
                  width: "100%",
                  maxWidth: 620,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 4,
                      background: `${C.red}20`,
                      color: C.red,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    NEVER
                  </span>
                  <T color={SOFT.red} size={15}>
                    {c.replace(/^Never /, "")}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            The $200 line and the escalation line live here, not in code. The model checks them on every reply, so a
            policy change is a one-line edit, not a deploy.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Output Rules: How Do I Respond?
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Output rules shape the surface of every reply: tone, structure, citations, and what each turn must end with.
            They are what makes the assistant feel consistent across thousands of conversations.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
            }}
          >
            {OUTPUT_RULES.map((r, i) => (
              <div
                key={r}
                style={{
                  ...tintedCard(C.teal),
                  padding: "10px 14px",
                  width: "100%",
                  maxWidth: 620,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: `${C.teal}24`,
                      color: C.teal,
                      fontFamily: "monospace",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <T color={SOFT.teal} size={15}>
                    {r}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Citations and follow-up offers are not polish - they are how you keep the agent honest and the conversation
            moving. Without them, replies dead-end and trust erodes.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Full System Prompt
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            All four parts woven into one artifact. This is exactly what gets sent as the system message on every turn
            for the customer-support agent.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: 4,
                background: `${C.cyan}20`,
                color: C.cyan,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              PROMPT TEMPLATE
            </div>
          </div>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <div
              style={{
                ...tintedCard(C.cyan),
                padding: 16,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
                whiteSpace: "pre-line",
                textAlign: "left",
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {FULL_SYSTEM_PROMPT}
            </div>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Ten lines, four parts, zero ambiguity. The agent&apos;s behavior in production is mostly the quality of this one
            block of text.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
