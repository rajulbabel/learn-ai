import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

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
    detail: 'Negative examples prevent over-eager calls. "Do not use for refunds over $200" saves real dollars.',
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

export default function JsonSchemaForTools(ctx) {
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
            The schema is the contract between you and the model. Before you write one line of the real function, you
            write the schema. The model only ever sees the schema - never the implementation - so the schema must say
            everything that matters.
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
            The model has never seen your real lookup_customer function. It only sees this JSON-Schema document.
            Everything you want it to know - the input shape, the required fields, when to call - must live inside these
            four pieces.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            What&apos;s Required, What&apos;s Optional?
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            JSON-Schema splits arguments into two buckets: required (must be present) and optional (may be omitted). The
            model reads the required list and treats it as non-negotiable. Everything else is its judgment call.
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
            Mark fewer fields required. Every required field is a chance for the model to give up and answer in plain
            text instead of calling. Make invoice_id required, but let reason be optional - the refund still works
            without a reason string.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Narrowing The Allowed Values
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            A free-form string is a footgun. The model can invent any value it likes. Use enum to lock a parameter to a
            fixed set of strings, and format to hint at the expected shape for things like emails, dates, and URIs.
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
            Without the enum, the model might emit urgency: &quot;urgent&quot; or &quot;critical&quot; and your ticket
            router would drop the request. With the enum, low / medium / high are the only legal values - the model is
            forced into your schema.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Descriptions Are Read By The Model
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            The description field is plain language for the model. It is the most important text in your whole tool
            definition. Treat it like a manual entry the model will skim every turn. Five rules turn a bad description
            into a great one.
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
            Description is the model&apos;s manual. Write it like you would write a runbook for a new hire.
          </div>
          <T color={SOFT.green} center size={15} style={{ marginTop: 12 }}>
            Spend ten times longer on the description than on the parameter names. A great description prevents
            wrong-tool calls, prevents the model from inventing arguments, and tells the model exactly when to call
            escalate_human instead of process_refund.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            One Sentence Changes Everything
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Same tool, same parameters. The only difference between a refund that goes wrong and one that goes right is
            the description string. Read both versions of process_refund below.
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
            Bad description: model refunds a $500 invoice. Good description: model calls escalate_human instead.
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The vague version costs you real dollars in mis-refunds. The specific version threads the $200 ceiling and
            the escalation fallback right into the model&apos;s prompt - so the model is choosing escalate_human before
            it ever attempts the refund.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Our Reference Tool: lookup_customer
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            This is the canonical reference shape every later chapter in Section 13 builds on. The full schema below is
            the contract; the tool_use block underneath shows exactly what the model emits when it decides to call this
            tool. Bookmark this slide.
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
            Notice how every part of the previous slides shows up here: a clear name, a description that states the
            side-effect profile, an input_schema with a format constraint, and a required list with one element. When
            you see lookup_customer in later chapters, this is the schema we mean.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
