import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// 25.4 - Parallel Tools + Tool Choice
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
    reason:
      "process_refund needs customer_id from lookup_customer's result. The second call cannot be formed until the first returns.",
    rule: "Two assistant turns are required. Turn 1 = lookup. Turn 2 = refund (after the tool_result is appended).",
  },
];

// sub=2 - tool_choice auto scenarios.
const TOOL_CHOICE_AUTO_SCENARIOS = [
  {
    user: 'Ticket T5: "Pro vs Enterprise - what\'s different?"',
    pick: 'search_kb(query="Pro vs Enterprise")',
    note: "Knowledge question. Model picks the docs tool.",
    color: C.blue,
    soft: SOFT.blue,
  },
  {
    user: 'User: "Hey, good morning!"',
    pick: "No tool. Plain assistant reply.",
    note: "Chitchat. Calling a tool would be wasted latency.",
    color: C.indigo,
    soft: SOFT.indigo,
  },
  {
    user: 'Ticket T2: "Reset my password and email also changed."',
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
    config: 'tool_choice: "auto"',
  },
  {
    mode: "required",
    color: C.yellow,
    soft: SOFT.yellow,
    behavior: "Model MUST call at least one tool. Plain-text replies are blocked.",
    whenToUse: 'When intent is already routed (e.g., user clicked "Run a search"). Forces the tool path.',
    config: 'tool_choice: "required"',
  },
  {
    mode: "none",
    color: C.red,
    soft: SOFT.red,
    behavior: "Model MUST NOT call any tool. It can only emit plain text.",
    whenToUse: "Final summarization, drafting a reply from already-gathered context, or pure chitchat.",
    config: 'tool_choice: "none"',
  },
  {
    mode: "specific",
    color: C.purple,
    soft: SOFT.purple,
    behavior: "Force a specific tool. Model can ONLY call this one named tool.",
    whenToUse:
      "Deterministic routing - your classifier already decided which API to call. The model fills in the arguments.",
    config: 'tool_choice: { type: "tool", name: "search_kb" }',
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
    msg: '"Reset my password but my email also changed to new@example.com"',
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
    msg: 'tool_use { name: change_email, input: { customer_id: "c-9924", new_email: "new@example.com" } }',
    note: "change_email must complete before reset_password (the reset link goes to the NEW email).",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: 'tool_result { content: "Email updated." }',
    note: "Side effect: customer record mutated. Now reset_password can use the new email.",
  },
  {
    n: 6,
    actor: "Model (turn 3)",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: reset_password, input: { customer_id: "c-9924" } }',
    note: "Reset link is sent to new@example.com because the prior turn already updated the record.",
  },
  {
    n: 7,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: 'tool_result { content: "Reset email sent." }',
    note: "Single chokepoint - the runtime is where every real-world effect actually happens.",
  },
  {
    n: 8,
    actor: "Model (turn 4)",
    color: C.green,
    soft: SOFT.green,
    msg: '"Updated your email to new@example.com and sent a reset link there."',
    note: "Final assistant message. No more tool_use.",
  },
];

export default function ParallelToolsAndChoice(ctx) {
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
            Ticket T2 needs two facts before it can act: who is this customer, and what is their subscription. The naive
            runtime asks one tool, waits, asks the next, waits again. A parallel runtime emits both tool_use blocks in
            the same assistant turn and runs them at the same time.
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
                  Serial timeline for ticket T2: an LLM call followed by lookup_customer (200ms), then a second LLM call
                  followed by lookup_subscription (200ms). Total 400ms of tool work plus 2 LLM calls. Bars are stacked
                  left to right with time labels.
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
                  Parallel timeline for ticket T2: one LLM call followed by lookup_customer and lookup_subscription
                  running concurrently (both 200ms). Total 200ms of tool work plus 1 LLM call. The two tool bars are
                  stacked vertically to show they share the same time slot.
                </desc>
                {/* Row 1: LLM call 1 */}
                <rect x="50" y="20" width="80" height="22" rx="4" fill={`${C.cyan}30`} stroke={C.cyan} />
                <text x="90" y="35" fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                  LLM 1
                </text>
                {/* Row 1: lookup_customer (parallel, top) */}
                <rect x="132" y="14" width="40" height="22" rx="4" fill={`${C.green}30`} stroke={C.green} />
                <text x="152" y="28" fill={SOFT.green} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="178" y="28" fill={SOFT.green} fontSize="10" textAnchor="start">
                  lookup_customer
                </text>
                {/* Row 1: lookup_subscription (parallel, bottom) */}
                <rect x="132" y="40" width="40" height="22" rx="4" fill={`${C.green}30`} stroke={C.green} />
                <text x="152" y="54" fill={SOFT.green} fontSize="10" textAnchor="middle">
                  200ms
                </text>
                <text x="178" y="54" fill={SOFT.green} fontSize="10" textAnchor="start">
                  lookup_subscription
                </text>
                {/* Time axis */}
                <line x1="50" y1="78" x2="172" y2="78" stroke="#666" strokeWidth="1" />
                <text x="160" y="100" fill="#aaa" fontSize="12" textAnchor="middle" fontWeight="700">
                  Total: 200ms tool work + 1 LLM call
                </text>
                <text x="160" y="120" fill={SOFT.green} fontSize="12" textAnchor="middle">
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
            Parallel only works when the two calls do not read each other&apos;s output. For independent lookups,
            parallel halves the tool latency and cuts an entire LLM turn.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Independent? Parallel. Dependent? Serial.
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            The rule is simple: if call B needs an argument from call A&apos;s result, you cannot parallelize. The model
            has to wait for A before it can even form B. If neither call reads the other, fan out.
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
            process_refund needs customer_id - so lookup_customer must run first, in its own turn. But lookup_customer
            and lookup_subscription both take the same email and return independent records, so they can share one turn.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool Choice = Auto (Default)
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            By default, the model decides whether to call a tool, which tool, and how many tools. You set tool_choice to
            &quot;auto&quot; (or leave it unset) and let the model route. For a customer-support agent, this covers most
            flows.
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
            Auto is the default for a reason - it covers chitchat (no tool), single lookups, and parallel lookups all
            from one config. You only switch modes when you need to control the model&apos;s hand.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Four Modes Of Tool Choice
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            tool_choice is a single field with four shapes. Each shape locks down the model&apos;s behavior a different
            amount. The right choice depends on how much control you already have from the calling code.
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
            The specific shape - {`{type: "tool", name: "X"}`} - is how you wire a deterministic router into the agent.
            Your classifier picks the API, and the model just fills the arguments.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Numbers: How Much Does Parallel Save?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Ticket T4: a customer wants to cancel, get a refund, and escalate to a human. Three independent lookups
            (customer, subscription, refund policy) feed one mutation (process_refund). Serial takes 4 LLM turns.
            Parallel collapses the three lookups into one turn.
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
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            The savings compound: each LLM turn costs ~1.5s, and you also save the tool latency that would have stacked.
            For a busy support agent firing thousands of tickets a day, that 31% is real money - and real customer wait
            time.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Trace: Ticket T2 With Parallel Lookups
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Same ticket T2 from sub=0, end to end. Turn 1 is parallel (two lookups). Turns 2 and 3 are sequential
            because change_email must complete before reset_password sends the link to the new address.
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
                    border: row.parallel ? `2px solid ${row.color}80` : `1px solid ${row.color}24`,
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
            The split is determined by the data flow, not the model. Independent reads share one turn. Dependent
            mutations - change_email then reset_password - must serialize so each one acts on the latest record.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
