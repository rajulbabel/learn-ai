import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

const RECIPE_LIBRARY = [
  {
    name: "Handle Refund Request",
    color: "yellow",
    trigger: "Customer Asks For Refund.",
    steps: 3,
  },
  {
    name: "Resolve Password Issue",
    color: "orange",
    trigger: "Login / Password Error.",
    steps: 4,
  },
  {
    name: "Escalate Billing Dispute",
    color: "red",
    trigger: "Disputed Invoice Or Charge.",
    steps: 2,
  },
  {
    name: "Resolve Sync Failure",
    color: "purple",
    trigger: "Data Out-Of-Sync Across Devices.",
    steps: 5,
  },
];

const RECIPE_SHAPE = `{
  "id": "recipe-refund",
  "name": "Handle refund request",
  "trigger_embedding": "[1024 floats]",
  "steps": [
    "lookup_customer to get customer_id and tier",
    "if tier == Enterprise: auto-approve up to $500; else $200",
    "lookup_subscription for invoice_id",
    "process_refund(invoice_id, reason); if business_rule error: escalate_human"
  ],
  "success_rate": 0.92,
  "uses": 187
}`;

const PROMPT_VS_PROCEDURAL = [
  {
    field: "Where It Lives",
    prompt: "Inside The System Prompt",
    procedural: "External Store, Retrieved On Demand",
  },
  {
    field: "Token Cost",
    prompt: "Every Conversation Pays The Prompt Tokens",
    procedural: "Only Retrieved When Relevant",
  },
  {
    field: "Can Learn?",
    prompt: "Static; Cannot Update From Outcomes",
    procedural: "Updatable; success_rate Drives Rewrite",
  },
  {
    field: "Best For",
    prompt: "Universal Rules (Tone, Format)",
    procedural: "Task-Specific Recipes",
  },
];

export default function ProceduralMemory(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            How-To, Not What
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Procedural memory encodes skills - HOW to do something - not facts about the world.
            Compare a semantic fact to a procedural recipe.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>SEMANTIC FACT</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 10 }}>
                What
              </T>
              <T color={SOFT.yellow} center size={13} style={{ marginTop: 8 }}>
                Refund Cap Is $200.
              </T>
            </div>

            <div style={{ ...tintedCard(C.amber), padding: 14 }}>
              <span style={pill(C.amber)}>PROCEDURAL SKILL</span>
              <T color={C.amber} bold center size={15} style={{ marginTop: 10 }}>
                How-To Recipe
              </T>
              <T color={SOFT.amber} center size={13} style={{ marginTop: 8 }}>
                When A Refund &gt; $200 Is Requested, Look Up Customer Tier First. Enterprise
                Customers Self-Approve Up To $500. Otherwise Call escalate_human With
                Urgency=Medium.
              </T>
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Facts encode WHAT is true. Procedures encode WHAT TO DO. The agent uses both: fact says
            "$200 cap"; procedure says "if cap exceeded, escalate".
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Cached Workflows The Agent Reuses
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The recipe library is a small set of named workflows the customer-support agent
            reuses. Each recipe has a trigger condition and an ordered step list.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {RECIPE_LIBRARY.map((r) => {
              const accent = C[r.color];
              const soft = SOFT[r.color];
              return (
                <div key={r.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>RECIPE</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {r.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    Trigger: {r.trigger}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 4 }}>
                    Steps: {r.steps}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            Four recipes cover the common customer-support workflows. Each one used to be a
            prompt-engineering exercise; once it stabilized, it got moved into procedural memory.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Retrieve The Recipe That Matches
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            A new ticket gets embedded; ANN search runs against the recipe library&apos;s
            trigger_embedding field; the top-1 match is surfaced (or "no match" if similarity is
            below threshold).
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 160"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Recipe retrieval flow: new ticket text is embedded, ANN search runs against the
                recipe library trigger embeddings, and the top-one match is surfaced for the agent
                to use as scaffolding.
              </desc>
              {/* 5-stage horizontal pipeline */}
              {[
                { x: 30, label: "New Ticket", note: "Free Text" },
                { x: 130, label: "Embed", note: "1024 Floats" },
                { x: 230, label: "ANN Search", note: "vs Library" },
                { x: 330, label: "Top-1", note: "Or No Match" },
                { x: 430, label: "Use Recipe", note: "Scaffolding" },
              ].map((s, i) => (
                <g key={`stage-${i}`}>
                  <rect
                    x={s.x}
                    y={50}
                    width={100}
                    height={50}
                    rx={8}
                    fill={`${C.orange}1a`}
                    stroke={C.orange}
                    strokeWidth={1.6}
                  />
                  <text
                    x={s.x + 50}
                    y={74}
                    fill={SOFT.orange}
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {s.label}
                  </text>
                  <text x={s.x + 50} y={90} fill={SOFT.orange} fontSize="11" textAnchor="middle">
                    {s.note}
                  </text>
                  {i < 4 && (
                    <>
                      <line
                        x1={s.x + 100}
                        y1={75}
                        x2={s.x + 130}
                        y2={75}
                        stroke={C.orange}
                        strokeWidth={1.6}
                      />
                      <polygon
                        points={`${s.x + 126},72 ${s.x + 134},72 ${s.x + 130},68 ${s.x + 130},82 ${s.x + 126},78`}
                        fill={C.orange}
                      />
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            The agent uses the retrieved recipe as a scaffold, then adapts to the specifics of the
            current ticket. If no recipe matches, the agent falls back to first-principles
            reasoning - and the run becomes a candidate to mine for a new recipe.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Recipe (Shape)
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            A recipe is a structured record. Trigger embedding for retrieval; steps for execution;
            success_rate and uses for analytics and self-improvement.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={C.red} bold center size={14}>
              Procedural Memory (Shape) - Recipe
            </T>
            <div
              style={{
                marginTop: 10,
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.red,
                fontSize: 13,
                lineHeight: 1.5,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {RECIPE_SHAPE}
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            success_rate = 0.92 means 92% of times this recipe ran, it produced a clean outcome.
            uses = 187 says the agent has run this recipe 187 times. These numbers drive
            improvement: a falling success_rate triggers a rewrite review.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Why Not Just Prompt The Recipe Every Time?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Prompting and procedural memory both encode "how to do X". They differ in where the
            recipe lives, what it costs, and whether it can learn from outcomes.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0,
              border: `1px solid ${C.purple}28`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 10, background: `${C.purple}10`, textAlign: "center" }}>
              <T color={SOFT.purple} bold center size={13}>
                Aspect
              </T>
            </div>
            <div style={{ padding: 10, background: `${C.yellow}10`, textAlign: "center" }}>
              <T color={SOFT.yellow} bold center size={13}>
                Prompting
              </T>
            </div>
            <div style={{ padding: 10, background: `${C.purple}10`, textAlign: "center" }}>
              <T color={SOFT.purple} bold center size={13}>
                Procedural Memory
              </T>
            </div>
            {PROMPT_VS_PROCEDURAL.flatMap((row) => [
              <div
                key={`f-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.purple}18`, textAlign: "center" }}
              >
                <T color={SOFT.purple} center size={13}>
                  {row.field}
                </T>
              </div>,
              <div
                key={`p-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.yellow}18`, textAlign: "center" }}
              >
                <T color={SOFT.yellow} center size={13}>
                  {row.prompt}
                </T>
              </div>,
              <div
                key={`m-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.purple}18`, textAlign: "center" }}
              >
                <T color={SOFT.purple} center size={13}>
                  {row.procedural}
                </T>
              </div>,
            ])}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Prompting stays great for universal rules - tone, format, safety constraints.
            Procedural memory wins for task-specific recipes that change with real-world outcomes.
            Use both, deliberately.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
