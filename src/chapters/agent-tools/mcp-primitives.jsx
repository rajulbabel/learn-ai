import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// --- Chapter 13.14 McpPrimitives data ---

// Three MCP primitives shown side-by-side in sub=0.
const MCP_PRIMITIVES = [
  {
    label: "Tools",
    color: C.purple,
    soft: SOFT.purple,
    subtitle: "Things The Model Can Do",
    example: "process_refund(invoice_id, reason)",
    nature: "Action - the model picks one and calls it.",
  },
  {
    label: "Resources",
    color: C.blue,
    soft: SOFT.blue,
    subtitle: "Things The Model Can Read",
    example: "kb://articles/password-reset",
    nature: "Data - the host pulls it in and shows it to the model.",
  },
  {
    label: "Prompts",
    color: C.cyan,
    soft: SOFT.cyan,
    subtitle: "Templates The Host Can Offer",
    example: "summarize_ticket(ticket_id, max_words)",
    nature: "Template - the user picks one and the host fills the slots.",
  },
];

// The MCP Prompt artifact lines for sub=3. Rendered as styled mono text, NOT a code block.
const MCP_PROMPT_LINES = [
  "{",
  '  "name": "summarize_ticket",',
  '  "description": "Summarize a support ticket conversation.",',
  '  "arguments": [',
  '    { "name": "ticket_id", "required": true },',
  '    { "name": "max_words", "required": false }',
  "  ]",
  "}",
];

// Three decision rows used in sub=4. Each row maps an intent to one primitive.
const DECISION_ROWS = [
  {
    intent: "Need To DO Something (Mutate State, Call API)?",
    primitive: "Tool",
    color: C.purple,
    soft: SOFT.purple,
  },
  {
    intent: "Need To READ Something (Fact, Doc, File)?",
    primitive: "Resource",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    intent: "Need A Reusable Prompt Template The User Can Invoke?",
    primitive: "Prompt",
    color: C.cyan,
    soft: SOFT.cyan,
  },
];

export default function McpPrimitives(ctx) {
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
            Tools, Resources, Prompts
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            An MCP server exposes three kinds of capabilities. Tools are callable actions the model
            can invoke. Resources are readable data the host can pull in. Prompts are parameterized
            templates the host can surface to the user. Each one solves a different need.
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginTop: 14,
            }}
          >
            {MCP_PRIMITIVES.map((p) => (
              <div
                key={p.label}
                style={{ ...tintedCard(p.color), padding: 14, textAlign: "center" }}
              >
                <span style={pill(p.color)}>{p.label.toUpperCase()}</span>
                <T color={p.color} bold center size={18} style={{ marginTop: 10 }}>
                  {p.label}
                </T>
                <T color={p.soft} center size={14} style={{ marginTop: 4 }}>
                  {p.subtitle}
                </T>
                <div
                  style={{
                    marginTop: 10,
                    background: `${p.color}06`,
                    border: `1px solid ${p.color}12`,
                    borderRadius: 6,
                    padding: 8,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: p.soft,
                    textAlign: "center",
                  }}
                >
                  {p.example}
                </div>
                <T color={p.soft} center size={13} style={{ marginTop: 8, fontStyle: "italic" }}>
                  {p.nature}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The split matters because each primitive has a different access pattern. The model
            decides when to call a tool. The host decides when to read a resource. The user picks
            which prompt to invoke.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Tool: process_refund
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            A Tool is a named action with a typed input schema. It usually has side effects: it
            mutates state, calls an external API, or spends money. The model picks one from the
            tool list and emits a tool call with the required arguments.
          </T>

          <div style={{ ...tintedCard(C.indigo), padding: 16, marginTop: 14 }}>
            <span style={pill(C.indigo)}>TOOL</span>
            <T color={C.indigo} bold center size={20} style={{ marginTop: 10 }}>
              process_refund
            </T>
            <div
              style={{
                marginTop: 12,
                background: `${C.indigo}06`,
                border: `1px solid ${C.indigo}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.indigo,
                textAlign: "center",
              }}
            >
              inputSchema: {"{ invoice_id: string, reason: string }"}
            </div>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <span style={pill(C.red)}>SIDE EFFECT</span>
            </div>
            <T color={SOFT.red} center size={15} style={{ marginTop: 10 }}>
              Mutation: $-amount returned to the customer&apos;s card.
            </T>
            <T color={SOFT.indigo} center size={14} style={{ marginTop: 12, fontStyle: "italic" }}>
              The model chooses when to call.
            </T>
          </div>

          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            Tools always go through validation before the server actually runs the action. The
            inputSchema is how the host (and the model) know what arguments are required and what
            type each one must be.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Resource: kb://articles/password-reset
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            A Resource is read-only data the server exposes under a URI. The host fetches it on
            demand and feeds the content into the model&apos;s context, the same way you might
            attach a PDF in a chat. The model never calls a resource itself.
          </T>

          <div style={{ ...tintedCard(C.blue), padding: 16, marginTop: 14 }}>
            <span style={pill(C.blue)}>RESOURCE URI</span>
            <div
              style={{
                marginTop: 12,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                borderRadius: 8,
                padding: 12,
                fontFamily: "monospace",
                fontSize: 16,
                color: SOFT.blue,
                textAlign: "center",
              }}
            >
              kb://articles/password-reset
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span style={{ color: SOFT.blue, fontSize: 22 }}>{"↓"}</span>
            </div>
            <div
              style={{
                marginTop: 6,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: SOFT.blue,
                textAlign: "center",
              }}
            >
              Markdown body of the doc (read-only).
            </div>
          </div>

          <div style={{ ...tintedCard(C.blue), padding: 12, marginTop: 12 }}>
            <T color={SOFT.blue} center size={15}>
              The host decides when to read - e.g., before calling the model on a ticket.
            </T>
            <T color={SOFT.blue} center bold size={15} style={{ marginTop: 6 }}>
              Resources are READ-ONLY by convention.
            </T>
          </div>

          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            The URI scheme is server-defined: it could be kb://, file://, github://, postgres://,
            or anything else the server exposes. The host treats it as an opaque identifier and
            asks the server to resolve it when needed.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Prompt: summarize_ticket
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            A Prompt is a parameterized template the server publishes. The host surfaces these as
            slash-commands or quick actions for the user. When the user picks one, the host
            collects the arguments, fills the template, and sends the resulting message to the
            model.
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
              MCP Prompt (Shape)
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
              {MCP_PROMPT_LINES.join("\n")}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The host surfaces these as slash-commands or quick actions for users.
          </T>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 10 }}>
            The arguments array lists each parameter the template needs, with a required flag.
            ticket_id is required, max_words is optional. The host can either prompt the user for
            missing values or fill defaults before invoking.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Action vs Data vs Template
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            When you design an MCP server, every capability falls into exactly one bucket. Ask
            what the model or host needs to DO, READ, or REUSE, and the right primitive is
            obvious.
          </T>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {DECISION_ROWS.map((row) => (
              <div
                key={row.primitive}
                style={{
                  ...tintedCard(row.color),
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <T color={row.soft} size={16}>
                  {row.intent}
                </T>
                <span style={pill(row.color)}>{row.primitive.toUpperCase()}</span>
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
              Decision rule: tool if side-effecting; resource if read-only data; prompt if
              template the user picks.
            </T>
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Putting a read-only doc behind a tool wastes a model turn. Putting an action behind a
            resource hides it from the model entirely. Putting a one-shot question behind a
            prompt hides it from end users. The split is the contract.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
