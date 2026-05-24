import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";
import { HighlightedJson } from "../../shared/agent-helpers.jsx";

// Six actors in the tool-call lifecycle swim-lane (sub=0).
const LIFECYCLE_STEPS = [
  {
    actor: "User",
    color: C.purple,
    soft: SOFT.purple,
    msg: "User message",
    detail: 'Sends a request. "I can\'t log in - reset my password."',
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
  {
    key: "type",
    color: C.cyan,
    soft: SOFT.cyan,
    note: 'Always the literal string "tool_use". Tells your runtime this block is a call request.',
  },
  {
    key: "id",
    color: C.purple,
    soft: SOFT.purple,
    note: "Unique per call. The matching tool_result must carry this same id back.",
  },
  {
    key: "name",
    color: C.green,
    soft: SOFT.green,
    note: "Which tool to call. Must match one of the schema names you registered.",
  },
  {
    key: "input",
    color: C.orange,
    soft: SOFT.orange,
    note: "The arguments. Validated against the input_schema before the runtime executes.",
  },
];

const TOOL_USE_MSG = `{
  "type": "tool_use",
  "id": "toolu_01abc...",
  "name": "reset_password",
  "input": { "customer_id": "c-9924" }
}`;

// Highlighted fields of the canonical tool_result message (sub=2).
const TOOL_RESULT_FIELDS = [
  {
    key: "type",
    color: C.cyan,
    soft: SOFT.cyan,
    note: 'Always "tool_result". Tells the model this block carries a return value.',
  },
  {
    key: "tool_use_id",
    color: C.purple,
    soft: SOFT.purple,
    note: "MUST match the id from the tool_use. This is how the model pairs request to response.",
  },
  {
    key: "content",
    color: C.green,
    soft: SOFT.green,
    note: "The return value. Usually a string; can be structured. This is what the model reads next.",
  },
  {
    key: "is_error",
    color: C.red,
    soft: SOFT.red,
    note: "Flag. true means the runtime failed - the model should recover, not pretend it worked.",
  },
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
    msg: '"I can\'t log in - reset my password."',
    note: "Plain English. No customer_id, just an intent.",
  },
  {
    n: 2,
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: lookup_customer, input: { email: "alice@example.com" } }',
    note: "Email comes from the conversation header. Model needs the customer_id before it can reset.",
  },
  {
    n: 3,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: 'tool_result { content: { customer_id: "c-9924", plan: "Pro" } }',
    note: "DB hit. The runtime turns the function return into a tool_result message.",
  },
  {
    n: 4,
    actor: "Model",
    color: C.cyan,
    soft: SOFT.cyan,
    msg: 'tool_use { name: reset_password, input: { customer_id: "c-9924" } }',
    note: "Now it has c-9924 from step 3. Second turn of the loop.",
  },
  {
    n: 5,
    actor: "Runtime",
    color: C.orange,
    soft: SOFT.orange,
    msg: 'tool_result { content: "Email sent." }',
    note: "Side effect happens here. The runtime is the single chokepoint.",
  },
  {
    n: 6,
    actor: "Model",
    color: C.green,
    soft: SOFT.green,
    msg: '"Done - check alice@example.com for the reset link."',
    note: "Final assistant message. No more tool_use - the model is satisfied.",
  },
];

// Streaming timeline events (sub=4).
const STREAM_PHASES = [
  { phase: "Stream begins", color: C.cyan, soft: SOFT.cyan, note: "Assistant tokens start arriving one by one." },
  {
    phase: "Partial text streams",
    color: C.cyan,
    soft: SOFT.cyan,
    note: '"Let me look that up for you..." appears word by word.',
  },
  {
    phase: "Stream pauses",
    color: C.yellow,
    soft: SOFT.yellow,
    note: "Model decides to call a tool. Token stream halts.",
  },
  {
    phase: "tool_use block emitted",
    color: C.purple,
    soft: SOFT.purple,
    note: "The block arrives as one complete JSON object, NOT token-by-token.",
  },
  {
    phase: "Runtime executes",
    color: C.orange,
    soft: SOFT.orange,
    note: "Your code runs the real function. Could take 200ms or 2s.",
  },
  {
    phase: "tool_result delivered",
    color: C.green,
    soft: SOFT.green,
    note: "Result message appended; model re-invoked to continue.",
  },
  {
    phase: "Stream resumes",
    color: C.cyan,
    soft: SOFT.cyan,
    note: "New assistant tokens start flowing again, building the final answer.",
  },
];

// Stacked latency-budget rows for ticket T1 (sub=5).
const LATENCY_BUDGET = [
  { label: "LLM call 1 (reads user, emits lookup_customer)", ms: 1200, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
  { label: "lookup_customer tool execution", ms: 200, color: C.teal, soft: SOFT.teal, kind: "Tool" },
  { label: "LLM call 2 (reads result, emits reset_password)", ms: 1100, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
  { label: "reset_password tool execution", ms: 200, color: C.teal, soft: SOFT.teal, kind: "Tool" },
  { label: "LLM call 3 (reads result, emits final answer)", ms: 700, color: C.cyan, soft: SOFT.cyan, kind: "LLM" },
];

export default function ToolCallLifecycle(ctx) {
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
            One tool call passes through six actors. The user starts it, the model decides, the runtime executes, the
            tool returns, the runtime wraps the result, the model writes the answer. Every arrow is a message of a
            specific kind.
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
                Six-row horizontal swim-lane for the tool-call lifecycle. Rows from top to bottom: User, Model, Runtime,
                Tool, Runtime, Model. Each row shows the actor on the left and the message kind it emits (user message,
                tool_use, function call, function return, tool_result, assistant message). Arrows connect each row to
                the next.
              </desc>
              {LIFECYCLE_STEPS.map((step, i) => {
                const y = 15 + i * 60;
                return (
                  <g key={i}>
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
                    <text x="100" y={y + 20} fill={step.soft} fontSize="13" fontWeight="700" textAnchor="middle">
                      {step.actor}
                    </text>
                    <text x="100" y={y + 36} fill={step.soft} fontSize="11" textAnchor="middle">
                      Step {i + 1}
                    </text>

                    <line x1="180" y1={y + 22} x2="225" y2={y + 22} stroke={step.color} strokeWidth="2" />
                    <polygon points={`225,${y + 22} 217,${y + 18} 217,${y + 26}`} fill={step.color} />

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
            The model never touches the tool directly - it only emits tool_use blocks. The runtime is the single
            boundary where every real-world effect (DB read, email send, refund) actually happens.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            Tool-Use: Model Asks Runtime To Call
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            When the model decides to call a tool, generation halts and it emits a single tool_use block. This is the
            exact shape - four fields, every field is load-bearing. Your runtime parses this block to decide what to
            execute.
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
              <HighlightedJson json={TOOL_USE_MSG} fields={TOOL_USE_FIELDS} soft={SOFT.teal} />
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
            Notice the customer_id c-9924 inside input - it came from a previous tool_result in this same conversation.
            The model carries values forward between turns just like it carries words.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tool-Result: Runtime Returns The Outcome
          </T>
          <T color={SOFT.blue} center size={16} style={{ marginTop: 10 }}>
            After the runtime executes the real function, it wraps the return value into a tool_result block and appends
            it to the conversation. The model then re-reads everything (user, prior assistant messages, tool_use,
            tool_result) and continues.
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
              <HighlightedJson json={TOOL_RESULT_MSG} fields={TOOL_RESULT_FIELDS} soft={SOFT.blue} />
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
            If the tool failed - DB down, validation error, network blip - your runtime still produces a tool_result,
            but flips is_error to true. The model reads the failure and adapts, instead of assuming success.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Trace: Ticket T1 Password Reset
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Now we play the whole lifecycle on a real ticket. T1 is &quot;I can&apos;t log in - reset my password.&quot;
            The model loops twice (lookup_customer, then reset_password) before it can answer.
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
            The model never has c-9924 in step 2 - it only learns the id from step 3&apos;s tool_result. That is why the
            loop matters: each turn unlocks the next call by giving the model new evidence.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Tools While Streaming
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            In production you usually stream assistant tokens to the UI for that typewriter effect. Tool calls fit
            cleanly inside a stream - but with one twist. Text streams token by token; tool blocks arrive whole.
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
                Horizontal timeline showing how tool calls interleave with a streaming assistant response. Time flows
                left to right. Phases include stream begin, partial text streaming, stream pause, tool_use block emitted
                whole, runtime executes, tool_result delivered, and stream resume. Each phase is a colored segment along
                a single horizontal bar.
              </desc>
              <line x1="20" y1="180" x2="740" y2="180" stroke="#444" strokeWidth="1" />
              <text x="20" y="205" fill="#aaa" fontSize="11" textAnchor="start">
                T = 0
              </text>
              <text x="740" y="205" fill="#aaa" fontSize="11" textAnchor="end">
                T = done
              </text>

              {STREAM_PHASES.map((p, i) => {
                const segWidth = 100;
                const x = 20 + i * segWidth;
                return (
                  <g key={i}>
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
                    <text x={x + segWidth / 2} y="108" fill={p.soft} fontSize="11" fontWeight="700" textAnchor="middle">
                      {p.phase.split(" ")[0]}
                    </text>
                    <text x={x + segWidth / 2} y="124" fill={p.soft} fontSize="10" textAnchor="middle">
                      {p.phase.split(" ").slice(1).join(" ")}
                    </text>

                    <line x1={x + segWidth / 2} y1="170" x2={x + segWidth / 2} y2="180" stroke="#666" strokeWidth="1" />
                    <text x={x + segWidth / 2} y="165" fill={p.soft} fontSize="10" textAnchor="middle">
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
            Your UI shows the partial text as it streams, but holds the spinner during tool execution. When the
            tool_result lands and the stream resumes, the next batch of assistant tokens picks up where it left off and
            writes the answer that uses the result.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Where The Seconds Go
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Ticket T1 took 3.4 seconds end-to-end. Where did the time go? Most of it lives in the LLM calls, not the
            tool calls. This is the most useful number to internalize when you start optimizing an agent.
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
                    borderRight: i < LATENCY_BUDGET.length - 1 ? `1px solid ${row.color}80` : "none",
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
            Speeding up T1 means cutting LLM turns, not tool latency. Parallel tool calls (next chapter) let you fire
            lookup_customer and lookup_subscription in one turn instead of two - shaving a whole LLM call from the
            budget.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
