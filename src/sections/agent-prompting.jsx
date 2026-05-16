import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 1: Prompting Foundations
// Chapters 13.1 - 13.6

// Local color aliases for hues not in the global C palette
// (used in 13.1 for the indigo and teal sub-step accents).
const INDIGO = "#7c4dff";
const INDIGO_SOFT = "#b39ddb";
const TEAL = "#26a69a";
const TEAL_SOFT = "#80cbc4";

const MESSAGE_ROLES = [
  {
    role: "System",
    color: C.cyan,
    soft: "#80deea",
    purpose: "Sets the role, rules, and tone of the assistant.",
    example: "You are Alice's customer-support assistant. Be concise. Cite docs when possible.",
  },
  {
    role: "User",
    color: C.purple,
    soft: "#b8a9ff",
    purpose: "The end-user's turn. The thing the model has to respond to.",
    example: "I can't log in - reset my password for alice@example.com.",
  },
  {
    role: "Assistant",
    color: C.green,
    soft: "#a5d6a7",
    purpose: "The model's reply. Goes back into the messages list for the next turn.",
    example: "I'll help you reset it. I just sent a one-time link to alice@example.com.",
  },
];

const USER_TOKENS = ["I", "can", "'t", " log", " in", " -", " reset", " my", " password"];
const ASSISTANT_TOKENS = ["I", "'ll", " help", " you", " reset", " it", "."];

const TEMPERATURE_STOPS = [
  { value: "0.0", label: "Deterministic" },
  { value: "0.3", label: "Focused" },
  { value: "0.7", label: "Default" },
  { value: "1.0", label: "Creative" },
  { value: "2.0", label: "Wild" },
];

const TOP_P_CDF = [
  { token: "reset", prob: 0.42, cum: 0.42, included: true },
  { token: "change", prob: 0.21, cum: 0.63, included: true },
  { token: "update", prob: 0.16, cum: 0.79, included: true },
  { token: "fix", prob: 0.09, cum: 0.88, included: true },
  { token: "recover", prob: 0.05, cum: 0.93, included: false },
  { token: "send", prob: 0.04, cum: 0.97, included: false },
  { token: "create", prob: 0.03, cum: 1.0, included: false },
];

const TOP_K_CANDIDATES = [
  { token: "reset", prob: 0.42, kept: true },
  { token: "change", prob: 0.21, kept: true },
  { token: "update", prob: 0.16, kept: true },
  { token: "fix", prob: 0.09, kept: true },
  { token: "recover", prob: 0.05, kept: true },
  { token: "send", prob: 0.04, kept: false },
  { token: "create", prob: 0.03, kept: false },
];

const STOP_CONDITIONS = [
  {
    name: "Max Tokens Reached",
    config: "max_tokens: 1024",
    detail: "Hard ceiling on how many tokens the model is allowed to generate this call.",
    reason: "length",
  },
  {
    name: "Stop Sequence Hit",
    config: 'stop: ["</answer>"]',
    detail: "The model produced one of the configured stop strings. Useful for structured output.",
    reason: "stop_sequence",
  },
  {
    name: "End-Of-Turn Token",
    config: "Model decides on its own",
    detail: "The model emitted its special end-of-turn token. The natural end of a reply.",
    reason: "end_turn",
  },
  {
    name: "Tool Call Requested",
    config: "Only with tool use enabled",
    detail: "The model paused to ask for a tool. Generation halts so your code can run the tool.",
    reason: "tool_use",
  },
];

const CALL_CYCLE_STEPS = [
  {
    name: "Build Messages",
    detail: "Combine system + history + new user turn into the messages list.",
  },
  {
    name: "Set Parameters",
    detail: "Pick temperature, top-p, top-k, max_tokens, stop.",
  },
  {
    name: "Send Request",
    detail: "POST messages + params to the model endpoint.",
  },
  {
    name: "Tokens Stream Back",
    detail: "Model emits one token at a time over the wire.",
  },
  {
    name: "Stop Reason Reached",
    detail: "One of: end_turn, length, stop_sequence, tool_use.",
  },
  {
    name: "Final Response",
    detail: "content + stop_reason + usage delivered to your app.",
  },
];

export const AnatomyOfLlmCall = (ctx) => {
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
            Every LLM Call Is A List Of Messages
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            You don't &quot;chat&quot; with the model. You send it an ordered list of messages, each with a role. The
            model reads the whole list and writes the next assistant turn.
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
            {MESSAGE_ROLES.map((m) => (
              <div
                key={m.role}
                style={{
                  width: "100%",
                  maxWidth: 640,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: `${m.color}06`,
                  border: `1px solid ${m.color}12`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 4,
                    background: `${m.color}20`,
                    color: m.color,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  {m.role.toUpperCase()}
                </div>
                <T color={m.soft} center size={14} style={{ marginTop: 6 }}>
                  {m.purpose}
                </T>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: `${m.color}12`,
                    border: `1px solid ${m.color}24`,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: m.soft,
                    textAlign: "center",
                  }}
                >
                  {m.example}
                </div>
              </div>
            ))}
          </div>
          <T color="#80deea" center size={15} style={{ marginTop: 12 }}>
            Roles: <b>System</b>, <b>User</b>, <b>Assistant</b>. Every later request includes the prior assistant
            replies, so the model has the full conversation.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={22}>
            Tokens, Not Words
          </T>
          <T color="#90caf9" center size={16} style={{ marginTop: 10 }}>
            The model doesn't see characters or words. It sees tokens - sub-word chunks from the tokenizer. Both your
            input and the model's output are billed and limited in tokens.
          </T>

          <T color={C.blue} bold center size={15} style={{ marginTop: 14 }}>
            User Message - 9 Tokens
          </T>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {USER_TOKENS.map((tok, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 10px",
                  borderRadius: 14,
                  background: `${C.purple}12`,
                  border: `1px solid ${C.purple}24`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: "#b8a9ff",
                }}
              >
                {tok.replace(/ /g, "_")}
              </div>
            ))}
          </div>

          <T color={C.blue} bold center size={15} style={{ marginTop: 16 }}>
            Assistant Reply - 7 Tokens
          </T>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {ASSISTANT_TOKENS.map((tok, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 10px",
                  borderRadius: 14,
                  background: `${C.green}12`,
                  border: `1px solid ${C.green}24`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: "#a5d6a7",
                }}
              >
                {tok.replace(/ /g, "_")}
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
              fontSize: 15,
              color: "#90caf9",
            }}
          >
            Context window = total tokens across all messages (system + user + assistant history + new reply)
          </div>
          <T color="#90caf9" center size={15} style={{ marginTop: 10 }}>
            A 200k context window can hold roughly 150k English words. Cross it and the oldest messages get dropped or
            the call fails.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Temperature, Top-P, Top-K
          </T>
          <T color="#b8a9ff" center size={16} style={{ marginTop: 10 }}>
            These three sampling knobs shape how the model picks the next token from its probability distribution. Lower
            = safer and more repeatable. Higher = more varied.
          </T>

          {/* Row 1: Temperature */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Temperature - Sharpness Of The Distribution
            </T>
            <div
              style={{
                marginTop: 12,
                position: "relative",
                height: 56,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "5%",
                  right: "5%",
                  top: 18,
                  height: 6,
                  borderRadius: 3,
                  background: `linear-gradient(to right, ${C.cyan}, ${C.green}, ${C.yellow}, ${C.orange}, ${C.red})`,
                }}
              />
              {TEMPERATURE_STOPS.map((s, i) => {
                const pct = 5 + (i * 90) / (TEMPERATURE_STOPS.length - 1);
                return (
                  <div
                    key={s.value}
                    style={{
                      position: "absolute",
                      left: `${pct}%`,
                      top: 10,
                      transform: "translateX(-50%)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 22,
                        borderRadius: 3,
                        background: C.purple,
                        margin: "0 auto",
                      }}
                    />
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: "#b8a9ff",
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 38,
                display: "grid",
                gridTemplateColumns: `repeat(${TEMPERATURE_STOPS.length}, 1fr)`,
                gap: 4,
              }}
            >
              {TEMPERATURE_STOPS.map((s) => (
                <T key={s.value} color="#b8a9ff" center size={12}>
                  {s.label}
                </T>
              ))}
            </div>
            <T color="#b8a9ff" center size={14} style={{ marginTop: 8 }}>
              At T=0 the model always picks the most likely next token. At T=2 unlikely tokens get a real chance.
            </T>
          </div>

          {/* Row 2: Top-P */}
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Top-P (Nucleus) - Keep Until Cumulative Probability Hits P
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {TOP_P_CDF.map((row) => (
                <div
                  key={row.token}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 70px 70px",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <T color={row.included ? C.green : C.dim} size={14} style={{ fontFamily: "monospace" }}>
                    {row.token}
                  </T>
                  <div
                    style={{
                      height: 14,
                      borderRadius: 3,
                      background: `${row.included ? C.green : C.dim}12`,
                      border: `1px solid ${row.included ? C.green : C.dim}24`,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${row.cum * 100}%`,
                        background: row.included ? `${C.green}40` : `${C.dim}30`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <T
                    color={row.included ? "#a5d6a7" : C.dim}
                    size={13}
                    style={{ fontFamily: "monospace", textAlign: "right" }}
                  >
                    p={row.prob.toFixed(2)}
                  </T>
                  <T
                    color={row.included ? "#a5d6a7" : C.dim}
                    size={13}
                    style={{ fontFamily: "monospace", textAlign: "right" }}
                  >
                    cum={row.cum.toFixed(2)}
                  </T>
                </div>
              ))}
            </div>
            <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
              With top_p = 0.9, the model samples only from the smallest set of tokens whose probabilities add to 0.9.
              Above: 4 tokens stay in, 3 are cut.
            </T>
          </div>

          {/* Row 3: Top-K */}
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold center size={16}>
              Top-K - Keep The K Most Likely Tokens
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                justifyContent: "center",
              }}
            >
              {TOP_K_CANDIDATES.map((c) => (
                <div
                  key={c.token}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 14,
                    background: c.kept ? `${C.green}12` : `${C.dim}10`,
                    border: `1px solid ${c.kept ? C.green : C.dim}24`,
                    fontFamily: "monospace",
                    fontSize: 14,
                    color: c.kept ? "#a5d6a7" : C.dim,
                  }}
                >
                  {c.token} ({c.prob.toFixed(2)})
                </div>
              ))}
            </div>
            <T color="#b8a9ff" center size={14} style={{ marginTop: 10 }}>
              With top_k = 5, everything past the 5th most-likely token is discarded before sampling.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={INDIGO} style={{ width: "100%" }}>
          <T color={INDIGO} bold center size={22}>
            When Does Generation End?
          </T>
          <T color={INDIGO_SOFT} center size={16} style={{ marginTop: 10 }}>
            One LLM call doesn't &quot;just stop&quot; - it stops for a specific reason, and the response tells you
            which. Four stop conditions, four finish reasons.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {STOP_CONDITIONS.map((c) => (
              <div
                key={c.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${INDIGO}06`,
                  border: `1px solid ${INDIGO}12`,
                  textAlign: "center",
                }}
              >
                <T color={INDIGO} bold center size={15}>
                  {c.name}
                </T>
                <div
                  style={{
                    marginTop: 6,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: `${INDIGO}12`,
                    border: `1px solid ${INDIGO}24`,
                    fontFamily: "monospace",
                    fontSize: 13,
                    color: INDIGO_SOFT,
                    display: "inline-block",
                  }}
                >
                  {c.config}
                </div>
                <T color={INDIGO_SOFT} center size={13} style={{ marginTop: 8 }}>
                  {c.detail}
                </T>
                <div style={{ marginTop: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 4,
                      background: `${C.yellow}20`,
                      color: C.yellow,
                      fontFamily: "monospace",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    finish_reason: {c.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <T color={INDIGO_SOFT} center size={15} style={{ marginTop: 12 }}>
            Always check finish_reason. A length stop means the answer got cut off mid-thought - retry with a higher
            max_tokens.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={TEAL} style={{ width: "100%" }}>
          <T color={TEAL} bold center size={22}>
            What Comes Back
          </T>
          <T color={TEAL_SOFT} center size={16} style={{ marginTop: 10 }}>
            The response is a small structured object. Three fields matter for almost every call: the generated text,
            why the model stopped, and the token usage you pay for.
          </T>
          <T color={TEAL} bold center size={15} style={{ marginTop: 14 }}>
            Response Shape
          </T>
          <div
            style={{
              marginTop: 8,
              padding: 16,
              background: `${TEAL}06`,
              border: `1px solid ${TEAL}12`,
              borderRadius: 8,
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 14,
              color: TEAL_SOFT,
              lineHeight: 1.7,
            }}
          >
            <div>{"{"}</div>
            <div>
              <span style={{ color: C.cyan, fontWeight: 700 }}>&nbsp;&nbsp;&quot;content&quot;</span>
              <span>: &quot;I&apos;ll help you reset it...&quot;,</span>
            </div>
            <div>
              <span style={{ color: C.yellow, fontWeight: 700 }}>&nbsp;&nbsp;&quot;stop_reason&quot;</span>
              <span>: &quot;end_turn&quot;,</span>
            </div>
            <div>
              <span style={{ color: C.green, fontWeight: 700 }}>&nbsp;&nbsp;&quot;usage&quot;</span>
              <span>: {"{"}</span>
            </div>
            <div>
              <span style={{ color: C.green }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;input_tokens&quot;</span>
              <span>: 9,</span>
            </div>
            <div>
              <span style={{ color: C.green }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;output_tokens&quot;</span>
              <span>: 7</span>
            </div>
            <div>&nbsp;&nbsp;{"}"}</div>
            <div>{"}"}</div>
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                textAlign: "center",
              }}
            >
              <T color={C.cyan} bold center size={15}>
                content
              </T>
              <T color="#80deea" center size={13} style={{ marginTop: 4 }}>
                The generated assistant text. Feed this back into the messages list for the next turn.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold center size={15}>
                stop_reason
              </T>
              <T color="#ffe082" center size={13} style={{ marginTop: 4 }}>
                Some providers call this finish_reason. Same idea: end_turn, length, stop_sequence, tool_use.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold center size={15}>
                usage
              </T>
              <T color="#a5d6a7" center size={13} style={{ marginTop: 4 }}>
                input_tokens + output_tokens. This is what gets billed and what counts against your context window.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            One Complete LLM Call
          </T>
          <T color="#80deea" center size={16} style={{ marginTop: 10 }}>
            Zooming out: every single call your agent makes follows this exact six-step cycle. Everything in the rest of
            Section 13 is just orchestrating these calls in smarter and smarter ways.
          </T>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "stretch",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {CALL_CYCLE_STEPS.map((step, i) => (
              <div key={step.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                    textAlign: "center",
                    minWidth: 150,
                    maxWidth: 170,
                  }}
                >
                  <T color={C.cyan} bold center size={14}>
                    {i + 1}. {step.name}
                  </T>
                  <T color="#80deea" center size={12} style={{ marginTop: 4 }}>
                    {step.detail}
                  </T>
                </div>
                {i < CALL_CYCLE_STEPS.length - 1 && (
                  <span style={{ color: C.cyan, fontSize: 22, fontWeight: 700 }}>&rarr;</span>
                )}
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
              color: "#80deea",
            }}
          >
            Typical latency: ~1.5s median for a 7-token response. Long replies stream tokens as they're generated.
          </div>
          <T color="#80deea" center size={15} style={{ marginTop: 10 }}>
            Messages in, parameters in, request out. Tokens stream back until a stop reason fires. Response object lands
            with content, stop_reason, and usage.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

export const SystemPromptContract = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          System Prompts - The Role Contract
        </T>
        <T size={16}>Stub - implemented in Task 9.</T>
      </Box>
    </div>
  );
};

export const FewShotStructuredOutput = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Few-Shot + Structured Output
        </T>
        <T size={16}>Stub - implemented in Task 10.</T>
      </Box>
    </div>
  );
};

export const ChainOfThoughtSelfConsistency = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Chain of Thought + Self-Consistency
        </T>
        <T size={16}>Stub - implemented in Task 11.</T>
      </Box>
    </div>
  );
};

export const PromptVsTuneVsRagVsAgent = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Prompt vs Fine-Tune vs RAG vs Agent
        </T>
        <T size={16}>Stub - implemented in Task 12.</T>
      </Box>
    </div>
  );
};

export const ContextEngineering = (ctx) => {
  const { sub } = ctx;
  return (
    <div>
      <Box color={C.cyan}>
        <T color={C.cyan} bold center size={22}>
          Context Engineering
        </T>
        <T size={16}>Stub - implemented in Task 13.</T>
      </Box>
    </div>
  );
};
