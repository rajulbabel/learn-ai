import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill } from "../../shared/agent-styles.jsx";

// Module-private helpers used by ChainOfThoughtSelfConsistency (13.4)

const COT_VS_DIRECT = {
  question:
    "Ticket T4: customer on annual plan cancels in month 7. Annual plan is $120/year. Cancellation fee is 10%. What is the refund?",
  direct: {
    label: "Direct Answer",
    pill: "WRONG",
    answer: "$45",
    note: "No reasoning shown. The model guessed and stopped.",
  },
  cot: {
    label: "Chain Of Thought",
    pill: "CORRECT",
    steps: [
      "Annual plan = $120 for 12 months.",
      "5 months remain (12 minus 7 used).",
      "Prorated refund = 120 x 5 / 12 = $50.",
      "Cancellation fee = 10% of $50 = $5.",
      "Final refund = $50 minus $5 = $45.",
    ],
    answer: "$45",
    note: "Exposes the math so the answer can be checked and corrected.",
  },
};

const COT_TRIGGERS = [
  {
    label: "Classic Trigger",
    template:
      "User: Ticket T4 refund - annual plan cancelled month 7. What is the refund?\nUser: Let's think step by step.",
  },
  {
    label: "Stronger Trigger",
    template:
      "User: Ticket T4 refund - annual plan cancelled month 7. What is the refund?\nUser: Think carefully before answering. Show your work.",
  },
];

const FEW_SHOT_COT_EXAMPLES = [
  {
    q: "Ticket T1: annual plan $120, cancelled month 3. No fee. What is the refund?",
    reason: [
      "9 months remain out of 12.",
      "Prorated refund = 120 x 9 / 12 = $90.",
      "No fee applied.",
    ],
    a: "$90",
  },
  {
    q: "Ticket T4: annual plan $120, cancelled month 7. 10% cancellation fee. What is the refund?",
    reason: [
      "5 months remain out of 12.",
      "Prorated refund = 120 x 5 / 12 = $50.",
      "Fee = 10% of $50 = $5.",
    ],
    a: "$45",
  },
];

const SAMPLE_RUNS = [
  {
    id: 1,
    summary: "Prorated $50 minus 10% fee = $45.",
    answer: "$45",
    correct: true,
  },
  {
    id: 2,
    summary: "5/12 x 120 = $50. Fee $5. Final $45.",
    answer: "$45",
    correct: true,
  },
  {
    id: 3,
    summary: "Refund $50 prorated. Forgot the fee.",
    answer: "$50",
    correct: false,
  },
  {
    id: 4,
    summary: "$50 prorated, $5 fee, $45 refund.",
    answer: "$45",
    correct: true,
  },
  {
    id: 5,
    summary: "Months left 5. Refund $50. Fee 10%.",
    answer: "$45",
    correct: true,
  },
];

const TRADEOFF_TABLE = [
  {
    name: "Direct Answer",
    tokens: "1x",
    latency: "1x",
    accuracy: "Baseline",
    color: C.red,
    soft: SOFT.red,
  },
  {
    name: "CoT Alone",
    tokens: "5x",
    latency: "5x",
    accuracy: "+15% on math",
    color: C.yellow,
    soft: SOFT.yellow,
  },
  {
    name: "Self-Consistency (N=5)",
    tokens: "25x",
    latency: "5x (parallel) - 25x (serial)",
    accuracy: "+20% on math",
    color: C.green,
    soft: SOFT.green,
  },
];

const USE_SKIP_CASES = {
  use: [
    {
      title: "Multi-Step Arithmetic",
      detail: "Refunds, prorating, tax breakdowns, discount stacking - any math with two or more steps.",
    },
    {
      title: "Multi-Hop Reasoning",
      detail: "Questions that chain facts: who did X for the customer that signed up in 2023 and is in tier B?",
    },
    {
      title: "Ambiguous Questions",
      detail: "Cases where the user's intent isn't obvious from the words alone. Reasoning surfaces the assumption.",
    },
  ],
  skip: [
    {
      title: "Simple Classification",
      detail: "Map ticket text to one of three labels. Few-shot already nails it. CoT just adds latency.",
    },
    {
      title: "Lookup Tasks",
      detail: "Fetch the customer's email or plan. No reasoning needed - it's a retrieval.",
    },
    {
      title: "Single-Fact Q&A",
      detail: "What time does support open? CoT will hallucinate a derivation where a direct answer suffices.",
    },
  ],
};

export default function ChainOfThoughtSelfConsistency(ctx) {
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
            Reasoning In The Open
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Some questions look simple but hide multi-step math. Asking for the final number alone gives the model
            nowhere to recover when it slips. Chain of thought forces the work onto the page - and the work is what
            catches the mistake.
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
            {COT_VS_DIRECT.question}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {/* Direct */}
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <span style={pill(C.red)}>{COT_VS_DIRECT.direct.pill}</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                {COT_VS_DIRECT.direct.label}
              </T>
              <div
                style={{
                  marginTop: 10,
                  padding: "12px",
                  borderRadius: 6,
                  background: `${C.red}12`,
                  border: `1px solid ${C.red}24`,
                  fontFamily: "monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: SOFT.red,
                  textAlign: "center",
                }}
              >
                {COT_VS_DIRECT.direct.answer}
              </div>
              <T color={SOFT.red} center size={13} style={{ marginTop: 8 }}>
                {COT_VS_DIRECT.direct.note}
              </T>
            </div>
            {/* CoT */}
            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>{COT_VS_DIRECT.cot.pill}</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                {COT_VS_DIRECT.cot.label}
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
                  lineHeight: 1.7,
                }}
              >
                {COT_VS_DIRECT.cot.steps.map((s, i) => (
                  <div key={i}>
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "10px",
                  borderRadius: 6,
                  background: `${C.green}24`,
                  border: `1px solid ${C.green}40`,
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: SOFT.green,
                  textAlign: "center",
                }}
              >
                Final: {COT_VS_DIRECT.cot.answer}
              </div>
              <T color={SOFT.green} center size={13} style={{ marginTop: 8 }}>
                {COT_VS_DIRECT.cot.note}
              </T>
            </div>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Same model, same question. The only difference is whether the model shows its work. CoT exposed the
            prorating and the fee - the direct call had nothing to anchor to.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            The &quot;Let&apos;s Think Step By Step&quot; Trick
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            Zero-shot CoT is the cheapest reasoning upgrade you can buy: one extra sentence on the user turn. No
            examples, no system-prompt changes. Two phrases work reliably.
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
            {COT_TRIGGERS.map((t) => (
              <div
                key={t.label}
                style={{
                  ...tintedCard(C.blue),
                  padding: 14,
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <span style={pill(C.blue)}>{t.label.toUpperCase()}</span>
                <div
                  style={{
                    marginTop: 10,
                    padding: "12px 14px",
                    borderRadius: 6,
                    background: `${C.blue}12`,
                    border: `1px solid ${C.blue}24`,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: SOFT.blue,
                    whiteSpace: "pre-line",
                    textAlign: "left",
                    lineHeight: 1.7,
                  }}
                >
                  {t.template}
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.blue} center size={15} style={{ marginTop: 12 }}>
            Zero examples, just a trigger phrase. The model has seen so much &quot;step by step&quot; reasoning in
            training that this single phrase flips it into reasoning mode for free.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Show The Reasoning In Examples
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Few-shot CoT raises the bar. Each example includes the reasoning trace, not just the answer. This transfers
            the reasoning STYLE, not just the answer format - so the model imitates how you think, not just what you
            output.
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
            {FEW_SHOT_COT_EXAMPLES.map((ex, i) => (
              <div
                key={i}
                style={{
                  ...tintedCard(C.purple),
                  padding: 14,
                  width: "100%",
                  maxWidth: 640,
                }}
              >
                <span style={pill(C.purple)}>EXAMPLE {i + 1}</span>
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: `${C.purple}12`,
                    border: `1px solid ${C.purple}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: SOFT.purple,
                    textAlign: "left",
                    lineHeight: 1.7,
                  }}
                >
                  <div>Question: {ex.q}</div>
                  <div style={{ marginTop: 6, color: C.indigo }}>Reasoning:</div>
                  {ex.reason.map((r, j) => (
                    <div key={j}>
                      &nbsp;&nbsp;{j + 1}. {r}
                    </div>
                  ))}
                  <div style={{ marginTop: 6, color: C.green }}>Answer: {ex.a}</div>
                </div>
              </div>
            ))}
          </div>
          <T color={SOFT.purple} center size={15} style={{ marginTop: 12 }}>
            The example does the work. The model now knows: list months remaining, prorate, apply the fee, then state
            the answer. Few-shot CoT teaches that exact chain.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
            Run N Times, Vote
          </T>
          <T color={SOFT.indigo} center size={16} style={{ marginTop: 10 }}>
            Self-consistency is a simple trick: ask the same CoT question N times with temperature 0.7, collect the
            answers, and take the majority vote. Variance shrinks. Wrong runs get out-voted.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.indigo}06`,
              border: `1px solid ${C.indigo}12`,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: SOFT.indigo,
            }}
          >
            Question: Ticket T4 refund - annual plan $120, cancelled month 7, 10% fee.
          </div>
          <T color={SOFT.indigo} center size={14} style={{ marginTop: 8 }}>
            Sample 5 times with temperature = 0.7
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {SAMPLE_RUNS.map((r) => (
              <div
                key={r.id}
                style={{
                  ...tintedCard(r.correct ? C.green : C.red),
                  padding: 12,
                }}
              >
                <span style={pill(r.correct ? C.green : C.red)}>RUN {r.id}</span>
                <T
                  color={r.correct ? SOFT.green : SOFT.red}
                  center
                  size={13}
                  style={{ marginTop: 8, fontFamily: "monospace" }}
                >
                  {r.summary}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: r.correct ? `${C.green}24` : `${C.red}24`,
                    border: `1px solid ${r.correct ? `${C.green}40` : `${C.red}40`}`,
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: 700,
                    color: r.correct ? SOFT.green : SOFT.red,
                  }}
                >
                  {r.answer}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.indigo}12`,
              border: `1px solid ${C.indigo}24`,
              textAlign: "center",
            }}
          >
            <T color={C.indigo} bold center size={15}>
              Majority Vote
            </T>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "center",
                gap: 16,
                fontFamily: "monospace",
                fontSize: 15,
                color: SOFT.indigo,
              }}
            >
              <span>$45 x 4</span>
              <span style={{ color: C.dim }}>vs</span>
              <span>$50 x 1</span>
            </div>
            <div
              style={{
                marginTop: 10,
                padding: "10px",
                borderRadius: 6,
                background: `${C.green}24`,
                border: `1px solid ${C.green}40`,
                fontFamily: "monospace",
                fontSize: 18,
                fontWeight: 700,
                color: SOFT.green,
              }}
            >
              Winner: $45
            </div>
          </div>
          <T color={SOFT.indigo} center size={15} style={{ marginTop: 12 }}>
            One run can slip and forget the fee. Five runs disagree, the correct answer wins by majority. Variance
            collapses without retraining anything.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            What CoT Buys And What It Costs
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Reasoning isn&apos;t free. CoT generates extra tokens. Self-consistency multiplies that by N. The accuracy gain
            is real but the bill is real too.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1.6fr 1.2fr",
              gap: 8,
              alignItems: "stretch",
            }}
          >
            {/* Header row */}
            <div style={{ ...tintedCard(C.teal), padding: 10 }}>
              <T color={C.teal} bold center size={14}>
                Technique
              </T>
            </div>
            <div style={{ ...tintedCard(C.teal), padding: 10 }}>
              <T color={C.teal} bold center size={14}>
                Tokens / Cost
              </T>
            </div>
            <div style={{ ...tintedCard(C.teal), padding: 10 }}>
              <T color={C.teal} bold center size={14}>
                Latency
              </T>
            </div>
            <div style={{ ...tintedCard(C.teal), padding: 10 }}>
              <T color={C.teal} bold center size={14}>
                Accuracy
              </T>
            </div>
            {TRADEOFF_TABLE.flatMap((row) => [
              <div key={`${row.name}-name`} style={{ ...tintedCard(row.color), padding: 10 }}>
                <T color={row.color} bold center size={14}>
                  {row.name}
                </T>
              </div>,
              <div key={`${row.name}-tokens`} style={{ ...tintedCard(row.color), padding: 10 }}>
                <T color={row.soft} center size={14} style={{ fontFamily: "monospace" }}>
                  {row.tokens}
                </T>
              </div>,
              <div key={`${row.name}-latency`} style={{ ...tintedCard(row.color), padding: 10 }}>
                <T color={row.soft} center size={13} style={{ fontFamily: "monospace" }}>
                  {row.latency}
                </T>
              </div>,
              <div key={`${row.name}-accuracy`} style={{ ...tintedCard(row.color), padding: 10 }}>
                <T color={row.soft} center size={14} style={{ fontFamily: "monospace" }}>
                  {row.accuracy}
                </T>
              </div>,
            ])}
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
            Self-consistency tradeoff: 5x to 25x the cost for ~5% extra accuracy over CoT alone.
          </div>
          <T color={SOFT.teal} center size={15} style={{ marginTop: 10 }}>
            Run samples in parallel and latency drops back to 5x. Cost stays at 25x. Only worth it when accuracy is
            critical - billing, refunds, dosage, legal answers.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            When Chain-Of-Thought Wins
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            CoT is a Decision Matrix problem. The technique helps when there is real reasoning to do. It hurts when
            the task is a lookup or a one-step classification - extra tokens, extra latency, no payoff.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            {/* Use CoT */}
            <div style={{ ...tintedCard(C.green), padding: 14 }}>
              <span style={pill(C.green)}>USE COT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                Reasoning Required
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {USE_SKIP_CASES.use.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: `${C.green}12`,
                      border: `1px solid ${C.green}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.green} bold center size={14}>
                      {c.title}
                    </T>
                    <T color={SOFT.green} center size={13} style={{ marginTop: 4 }}>
                      {c.detail}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            {/* Skip CoT */}
            <div style={{ ...tintedCard(C.red), padding: 14 }}>
              <span style={pill(C.red)}>SKIP COT</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Direct Answer Is Better
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {USE_SKIP_CASES.skip.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: `${C.red}12`,
                      border: `1px solid ${C.red}24`,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.red} bold center size={14}>
                      {c.title}
                    </T>
                    <T color={SOFT.red} center size={13} style={{ marginTop: 4 }}>
                      {c.detail}
                    </T>
                  </div>
                ))}
              </div>
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
            }}
          >
            <T color={C.indigo} bold center size={15}>
              Reasoning Models Change The Calculus
            </T>
            <T color={SOFT.indigo} center size={14} style={{ marginTop: 6 }}>
              Reasoning models like the ones from Section 10.4 Thinking do CoT internally before replying. You no
              longer prompt for &quot;step by step&quot; - the model thinks first, then emits the answer. CoT prompts
              still help on non-reasoning models, but with a reasoning model the technique often becomes redundant.
            </T>
          </div>
          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            Match the technique to the task. Multi-step math gets CoT. A category lookup gets a direct answer. And
            when the model already reasons internally, save the tokens.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
