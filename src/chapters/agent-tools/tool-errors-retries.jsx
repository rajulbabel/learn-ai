import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

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
    handling: 'Return structured "rule violated" reason. Model adapts or escalates.',
    why: "The call is syntactically valid but policy says no. The model needs the WHY to pick a different path.",
  },
];

// sub=1 - Structured error tool_result message. Highlighted keys make the
// is_error + error_class fields impossible to miss.
const ERROR_RESULT_LINES = [
  "{",
  '  "type": "tool_result",',
  '  "tool_use_id": "toolu_01xyz...",',
  '  "content": "Refund denied: amount $350 exceeds $200 auto-approve cap.",',
  '  "is_error": true,',
  '  "error_class": "business_rule"',
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
    msg: '"Cancel my subscription and refund my last invoice ($350)."',
    note: "Ticket T4 - one user message contains two intents and a refund amount over policy.",
  },
  {
    n: 2,
    actor: "Model (turn 1)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: lookup_customer, input: { email: "..." } }',
    note: "Read first. Need customer_id before any mutation.",
  },
  {
    n: 3,
    actor: "Runtime",
    color: C.green,
    soft: SOFT.green,
    msg: 'tool_result { content: "customer_id: c-7741", is_error: false }',
    note: "Clean read. customer_id appended to the conversation.",
  },
  {
    n: 4,
    actor: "Model (turn 2)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: process_refund, input: { invoice_id: "inv-882", reason: "customer requested" } }',
    note: "Model attempts the refund directly. Amount is $350 - over the $200 auto-approve cap, but the model does not know that yet.",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: 'tool_result { is_error: true, error_class: "business_rule", content: "Refund $350 exceeds $200 auto-approve cap." }',
    note: "Business-rule error. No retry. The structured reason is the signal the model uses to adapt.",
    isError: true,
    adapt: true,
  },
  {
    n: 6,
    actor: "Model (turn 3)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: escalate_human, input: { customer_id: "c-7741", reason: "refund $350 over policy cap", urgency: "medium" } }',
    note: "Adapts: switches plan to escalate_human with full context (amount, reason, urgency).",
  },
  {
    n: 7,
    actor: "Runtime",
    color: C.green,
    soft: SOFT.green,
    msg: 'tool_result { content: "Escalation queued: ticket-9921 assigned to billing-team." }',
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

export default function ToolErrorsRetries(ctx) {
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
            Production tools fail. The retry strategy depends on WHY the call failed. A rate limit is not the same as a
            missing record, and a schema typo is not the same as a policy violation. Group every failure into one of
            four classes and the rest of the runtime falls out.
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
            Every tool error your agent will ever see fits one of these four buckets. Classify on the way out of the
            tool, attach the class to the tool_result, and the rest of the agent loop knows what to do.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Errors Are Data, Not Exceptions
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The runtime does not throw a Python exception up the stack. It returns a structured tool_result with
            is_error set to true and an error_class field. The model reads those same fields it reads on a successful
            call and adapts. This is the whole reason an agent can recover from a business-rule violation without you
            writing special code.
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
                const isHighlighted = ERROR_RESULT_HIGHLIGHTS.some((key) => line.includes(`"${key}"`));
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
                The model reads this flag the same way it reads any other field. If true, treat content as the failure
                reason, not the answer.
              </T>
            </div>
            <div style={{ ...tintedCard(C.orange), padding: "12px 14px" }}>
              <T color={C.orange} bold center size={14}>
                error_class: &quot;business_rule&quot;
              </T>
              <T color={SOFT.orange} center size={13} style={{ marginTop: 6 }}>
                The class tells the model whether to wait and retry, fix its arguments, escalate, or apologize. Same
                payload shape, different next action.
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
            Because the error is data, the model can route on it. The next assistant turn picks a different tool
            (escalate_human) on its own. You did not write &quot;if business_rule then escalate&quot; - the model
            inferred it from the message.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Match The Retry To The Error
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            One retry policy across all errors is wrong. Retrying a permanent auth failure burns three round-trips for
            no reason. Not retrying a transient 503 fails a perfectly good call. The class drives the retry budget, the
            backoff schedule, and who handles it.
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
            Exponential backoff matters because thundering-herd retries amplify outages. Each retry waits twice as long,
            which spreads load and gives the dependency a chance to recover before you slam it again.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Validate Before Calling
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Most malformed errors never need to hit the tool function. The runtime already has the JSON schema from the
            tool definition - it can check the model&apos;s arguments against required fields, types, enums, and formats
            in microseconds, before it ever opens an HTTP socket or starts a transaction.
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
                Validation flow for a tool call. The model emits a tool_use block, the runtime validates the arguments
                against the schema, and then branches: invalid arguments return a malformed error without executing,
                valid arguments call the tool function. The diagram highlights that schema validation is cheap and saves
                the expensive tool execution.
              </desc>
              {/* Step 1: Model */}
              <rect x="180" y="14" width="160" height="40" rx="6" fill={`${C.cyan}24`} stroke={C.cyan} />
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
              <rect x="160" y="88" width="200" height="44" rx="6" fill={`${C.green}24`} stroke={C.green} />
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
              <rect x="20" y="176" width="200" height="60" rx="6" fill={`${C.purple}24`} stroke={C.purple} />
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
              <rect x="300" y="176" width="200" height="60" rx="6" fill={`${C.cyan}24`} stroke={C.cyan} />
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
            Schema-level validation also gives the model a precise reason - &quot;missing required field
            invoice_id&quot; - which is much easier to fix than a generic 400 from the API. One retry usually does it.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Safe-To-Retry Tools Need Idempotency Keys
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Reads are naturally safe to retry - they just return the same data. Mutations are different. process_refund
            without an idempotency key can double-refund if the runtime retries on a flaky 503 that actually succeeded.
            The fix is a key derived from a stable input so the backend can detect and dedupe the retry.
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
            The pattern is universal: any mutation that can be retried needs a deterministic key. For refunds,
            invoice_id works. For password resets, request_id. For new orders, a client-generated UUID. Without it,
            retries are unsafe and you must either give up retries or risk double-spending.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Trace: Ticket T4 With Errors And Recovery
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T4: cancel + refund over the policy cap. Watch how the structured business_rule error in step 5
            changes the model&apos;s plan in step 6. No exception handling code, no special-case routing - the model
            reads the error_class and switches to escalate_human on its own.
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
                    border: row.isError ? `2px solid ${row.color}80` : `1px solid ${row.color}24`,
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
            The user never sees the raw policy error. They see a calm escalation message. That is the agent loop working
            as designed: errors are returned as data, the model classifies and adapts, and the human only sees the
            resolution.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
