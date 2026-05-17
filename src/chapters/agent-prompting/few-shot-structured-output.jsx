import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, DIM_BG, DIM_BORDER, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by FewShotStructuredOutput (13.3)

const FEW_SHOT_EXAMPLES = [
  {
    input: "I can't log in - reset my password.",
    category: "billing",
    urgency: "low",
  },
  {
    input: "Charged twice for last month.",
    category: "billing",
    urgency: "high",
  },
  {
    input: "Dashboard shows 500 errors.",
    category: "troubleshooting",
    urgency: "medium",
  },
];

const OUTPUT_SCHEMA_LINES = [
  "{",
  '  "type": "object",',
  '  "properties": {',
  '    "category":   { "enum": ["billing", "product", "troubleshooting"] },',
  '    "urgency":    { "enum": ["low", "medium", "high"] },',
  '    "confidence": { "type": "number", "minimum": 0, "maximum": 1 }',
  "  },",
  '  "required": ["category", "urgency", "confidence"]',
  "}",
];

const PROD_TIPS = [
  {
    title: "Use 3 To 5 Examples",
    detail: "More than 5 often hurts more than it helps. Diminishing returns set in fast.",
  },
  {
    title: "Diverse Examples Beat Similar Ones",
    detail: "Three near-duplicates teach the model one pattern. Three different cases teach three.",
  },
  {
    title: "Edge Cases Improve Robustness",
    detail: "A tricky example moves the needle more than a typical one. Include the cases that break naive rules.",
  },
  {
    title: "Span All Enum Values",
    detail: "Every category and urgency level should appear at least once across your examples.",
  },
  {
    title: "Put The Hardest Case Last",
    detail: "The last example sets the strongest pattern. End on the case you most want the model to remember.",
  },
];

const CLASSIFIER_TEMPLATE = `SYSTEM:
You classify support tickets for Alice's customer-support
team. Return JSON only, matching the provided schema.

EXAMPLES:
Input:  "I can't log in - reset my password."
Output: { "category": "billing",         "urgency": "low",    "confidence": 0.91 }

Input:  "Charged twice for last month."
Output: { "category": "billing",         "urgency": "high",   "confidence": 0.95 }

Input:  "Dashboard shows 500 errors."
Output: { "category": "troubleshooting", "urgency": "medium", "confidence": 0.88 }

OUTPUT SCHEMA:
{
  "category":   enum["billing", "product", "troubleshooting"],
  "urgency":    enum["low", "medium", "high"],
  "confidence": number in [0, 1]
}

TICKET TO CLASSIFY:
"{{ ticket_text }}"`;

export default function FewShotStructuredOutput(ctx) {
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
            Show, Don&apos;t Just Tell
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Zero-shot prompts describe the task. Few-shot prompts demonstrate the task with 3 to 5 worked examples
            first. The model is far better at pattern-matching examples than parsing English instructions.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {/* Left: zero-shot */}
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <span style={pill(C.red)}>ZERO-SHOT</span>
              <T color={SOFT.red} center size={13} style={{ marginTop: 6 }}>
                Just the instruction, no examples.
              </T>
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
                  textAlign: "left",
                }}
              >
                Classify this ticket as billing, product, or troubleshooting:
                {"\n"}&quot;Charged twice for last month.&quot;
              </div>
              <T color={SOFT.red} center size={13} style={{ marginTop: 10 }}>
                Model output is unpredictable.
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${DIM_BG}`,
                  border: `1px solid ${DIM_BORDER}`,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: SOFT.red,
                  textAlign: "left",
                }}
              >
                &quot;This looks like a billing issue, possibly a duplicate charge...&quot;
              </div>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                Prose instead of a label. Wrong shape.
              </T>
            </div>
            {/* Right: few-shot */}
            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>FEW-SHOT</span>
              <T color={SOFT.green} center size={13} style={{ marginTop: 6 }}>
                Three labeled examples, then the query.
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}24`,
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: SOFT.green,
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                Input: &quot;I can&apos;t log in.&quot; → billing
                {"\n"}Input: &quot;Charged twice.&quot; → billing
                {"\n"}Input: &quot;500 errors.&quot; → troubleshooting
                {"\n"}Input: &quot;Charged twice for last month.&quot; →
              </div>
              <T color={SOFT.green} center size={13} style={{ marginTop: 10 }}>
                Model output snaps to the pattern.
              </T>
              <div
                style={{
                  marginTop: 6,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}24`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: SOFT.green,
                  textAlign: "left",
                }}
              >
                billing
              </div>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                One token, correct label, every time.
              </T>
            </div>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Showing beats telling. The same model, the same task, but examples raise classification accuracy from
            wobbly to reliable.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Three Examples, Same Format
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            The anatomy of a few-shot block: a list of input-output pairs in identical format. The format is the
            lesson - the model learns the shape from these three, then applies it to the real query.
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
            {FEW_SHOT_EXAMPLES.map((ex, i) => (
              <div
                key={i}
                style={{
                  ...tintedCard(C.blue),
                  padding: "12px 16px",
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={pill(C.blue)}>EXAMPLE {i + 1}</span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span style={pill(C.purple)}>INPUT</span>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.purple}12`,
                      border: `1px solid ${C.purple}24`,
                      fontFamily: "monospace",
                      fontSize: 14,
                      color: SOFT.purple,
                      textAlign: "left",
                    }}
                  >
                    {ex.input}
                  </div>
                  <span style={pill(C.green)}>OUTPUT</span>
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      fontFamily: "monospace",
                      fontSize: 14,
                      color: SOFT.green,
                      textAlign: "left",
                    }}
                  >
                    Category: {ex.category} | Urgency: {ex.urgency}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Three categories (billing, product, troubleshooting) and three urgency levels (low, medium, high). Every
            example uses the same labels in the same slots. Consistency is the whole point.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Schemas Make The Shape Non-Negotiable
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Examples teach the model what to say. A JSON schema forces the response into a fixed shape - field names,
            allowed values, types, ranges. The model literally cannot return free-form prose if the API enforces this.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <span style={pill(C.purple)}>OUTPUT SCHEMA</span>
          </div>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <div
              style={{
                ...tintedCard(C.purple),
                padding: 16,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.purple,
                whiteSpace: "pre",
                textAlign: "left",
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.7,
                overflowX: "auto",
              }}
            >
              {OUTPUT_SCHEMA_LINES.join("\n")}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
            }}
          >
            <div style={{ ...tintedCard(C.purple), padding: 12 }}>
              <T color={C.purple} bold center size={15}>
                Enums Lock The Values
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 4 }}>
                Category must be one of three strings. No new categories invented at runtime.
              </T>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 12 }}>
              <T color={C.purple} bold center size={15}>
                Required Locks The Fields
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 4 }}>
                All three fields must appear. The API rejects the response if any are missing.
              </T>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 12 }}>
              <T color={C.purple} bold center size={15}>
                Ranges Lock The Numbers
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 4 }}>
                Confidence is a number between 0 and 1. No 1.4, no -0.2, no &quot;maybe&quot;.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Together They Eliminate Drift
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Few-shot and structured output do different jobs. Examples teach VALUES and STYLE. Schemas enforce
            STRUCTURE. Run them together and the model produces the same shape with the same vocabulary every single
            call.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              alignItems: "stretch",
            }}
          >
            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>FEW-SHOT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                Teaches Values + Style
              </T>
              <T color={SOFT.green} center size={13} style={{ marginTop: 6 }}>
                Which categories exist. What urgency means here. How a typical ticket maps to a label.
              </T>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>SCHEMA</span>
              <T color={C.purple} bold center size={15} style={{ marginTop: 8 }}>
                Enforces Structure
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 6 }}>
                Field names, allowed enum values, types, and required keys. The API rejects anything that doesn&apos;t
                match.
              </T>
            </div>
            <div style={{ ...tintedCard(C.indigo), padding: 14 }}>
              <span style={pill(C.indigo)}>TOGETHER</span>
              <T color={C.indigo} bold center size={15} style={{ marginTop: 8 }}>
                Zero Drift
              </T>
              <T color={SOFT.indigo} center size={13} style={{ marginTop: 6 }}>
                Same shape, consistent labels, every single call. Safe to feed straight into a database or a
                downstream tool.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.indigo}06`,
              border: `1px solid ${C.indigo}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: SOFT.indigo,
            }}
          >
            {"{ "}&quot;category&quot;: &quot;billing&quot;, &quot;urgency&quot;: &quot;high&quot;,
            &quot;confidence&quot;: 0.85 {" }"}
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 10 }}>
            Belt and suspenders. Each technique catches a different failure mode, so together they leave almost
            nothing to chance.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            What Actually Matters In Few-Shot
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Five rules drawn from production experience. None of them are obvious. All of them change accuracy in
            measurable ways.
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
            {PROD_TIPS.map((tip, i) => (
              <div
                key={tip.title}
                style={{
                  ...tintedCard(C.teal),
                  padding: "12px 16px",
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={pill(C.teal)}>TIP {i + 1}</span>
                  <T color={C.teal} bold center size={15}>
                    {tip.title}
                  </T>
                </div>
                <T color={SOFT.teal} center size={14} style={{ marginTop: 6 }}>
                  {tip.detail}
                </T>
              </div>
            ))}
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 12 }}>
            Diverse, edge-case-heavy, enum-spanning, hardest-last. That ordering rule is the one teams forget most -
            and it matters more than the count of examples.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            The Ticket-Classifier We&apos;ll Reuse
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            All the pieces stitched into one prompt. System line on top, three few-shot examples in the middle, output
            schema, then the ticket slot. Later chapters in this section call out to this exact artifact.
          </T>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <span style={pill(C.cyan)}>TICKET CLASSIFIER TEMPLATE</span>
          </div>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <div
              style={{
                ...tintedCard(C.cyan),
                padding: 16,
                fontFamily: "monospace",
                fontSize: 14,
                color: SOFT.cyan,
                whiteSpace: "pre",
                textAlign: "left",
                maxWidth: 720,
                margin: "0 auto",
                lineHeight: 1.7,
                overflowX: "auto",
              }}
            >
              {CLASSIFIER_TEMPLATE}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 10 }}>
              <T color={C.cyan} bold center size={14}>
                Reusable
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 4 }}>
                One template, thousands of tickets per day, identical output shape.
              </T>
            </div>
            <div style={{ ...tintedCard(C.cyan), padding: 10 }}>
              <T color={C.cyan} bold center size={14}>
                Auditable
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 4 }}>
                Every field is logged. You can review wrong calls and tune the examples.
              </T>
            </div>
            <div style={{ ...tintedCard(C.cyan), padding: 10 }}>
              <T color={C.cyan} bold center size={14}>
                Tunable
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 4 }}>
                Swap one example, redeploy, measure. No model retraining required.
              </T>
            </div>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The classifier template is small, cheap, and dependable. It is the building block under every routing,
            triage, and escalation flow we layer on top.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
