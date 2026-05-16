import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

// Section 13 Act 1: Prompting Foundations
// Chapters 13.1 - 13.6

// Lighter text shades used inside tinted panels - keyed by C palette name.
// Add new entries here when introducing a new accent color in this section file.
export const SOFT = {
  cyan: "#80deea",
  blue: "#90caf9",
  purple: "#b8a9ff",
  indigo: "#b39ddb",
  teal: "#80cbc4",
  green: "#a5d6a7",
  yellow: "#ffe082",
  orange: "#ffcc80",
  pink: "#f8bbd0",
  red: "#ef9a9a",
};

// Greyed-out / disabled-state shades. Used when a row/chip is "cut" or "below threshold".
export const DIM_BG = "#1b1b22";
export const DIM_BORDER = "#33333a";

// Standard tinted-card style. Use as `style={{ ...tintedCard(C.cyan), padding: 12 }}`.
export const tintedCard = (color) => ({
  background: `${color}06`,
  border: `1px solid ${color}12`,
  borderRadius: 8,
  textAlign: "center",
});

// Standard uppercase pill / badge style. Use as `<span style={pill(C.cyan)}>SYSTEM</span>`.
// The badge text inside should be UPPERCASE for visual rhythm with the chapter pattern.
export const pill = (color) => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 4,
  background: `${color}20`,
  color,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.5,
});

// Back-compat aliases (kept while 13.1 transitions to the SOFT map).
const INDIGO_SOFT = SOFT.indigo;
const TEAL_SOFT = SOFT.teal;

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
    reasonColor: C.orange,
  },
  {
    name: "Stop Sequence Hit",
    config: 'stop: ["</answer>"]',
    detail: "The model produced one of the configured stop strings. Useful for structured output.",
    reason: "stop_sequence",
    reasonColor: C.pink,
  },
  {
    name: "End-Of-Turn Token",
    config: "Model decides on its own",
    detail: "The model emitted its special end-of-turn token. The natural end of a reply.",
    reason: "end_turn",
    reasonColor: C.green,
  },
  {
    name: "Tool Call Requested",
    config: "Only with tool use enabled",
    detail: "The model paused to ask for a tool. Generation halts so your code can run the tool.",
    reason: "tool_use",
    reasonColor: C.cyan,
  },
];

const CALL_CYCLE_STEPS = [
  {
    name: "Build Messages",
    detail: "Combine system + history + new user turn into the messages list.",
    arrowLabel: "Roles assigned",
  },
  {
    name: "Set Parameters",
    detail: "Pick temperature, top-p, top-k, max_tokens, stop.",
    arrowLabel: "Sampling locked",
  },
  {
    name: "Send Request",
    detail: "POST messages + params to the model endpoint.",
    arrowLabel: "HTTPS POST",
  },
  {
    name: "Tokens Stream Back",
    detail: "Model emits one token at a time over the wire.",
    arrowLabel: "SSE chunks",
  },
  {
    name: "Stop Reason Reached",
    detail: "One of: end_turn, length, stop_sequence, tool_use.",
    arrowLabel: "End_turn fired",
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
              textAlign: "center",
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
              textAlign: "center",
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
                      background: row.included ? `${C.green}12` : "#1b1b22",
                      border: `1px solid ${row.included ? `${C.green}24` : "#33333a"}`,
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
                        background: row.included ? `${C.green}40` : "#33333a",
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
              textAlign: "center",
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
                    background: c.kept ? `${C.green}12` : "#1b1b22",
                    border: `1px solid ${c.kept ? `${C.green}24` : "#33333a"}`,
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
        <Box color={C.indigo} style={{ width: "100%" }}>
          <T color={C.indigo} bold center size={22}>
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
                  background: `${C.indigo}06`,
                  border: `1px solid ${C.indigo}12`,
                  textAlign: "center",
                }}
              >
                <T color={C.indigo} bold center size={15}>
                  {c.name}
                </T>
                <div
                  style={{
                    marginTop: 6,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: `${C.indigo}12`,
                    border: `1px solid ${C.indigo}24`,
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
                      background: `${c.reasonColor}20`,
                      color: c.reasonColor,
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
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            What Comes Back
          </T>
          <T color={TEAL_SOFT} center size={16} style={{ marginTop: 10 }}>
            The response is a small structured object. Three fields matter for almost every call: the generated text,
            why the model stopped, and the token usage you pay for.
          </T>
          <T color={C.teal} bold center size={15} style={{ marginTop: 14 }}>
            Response Shape
          </T>
          <div
            style={{
              marginTop: 8,
              padding: 16,
              background: `${C.teal}06`,
              border: `1px solid ${C.teal}12`,
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span style={{ color: C.indigo, fontSize: 11, whiteSpace: "nowrap" }}>{step.arrowLabel}</span>
                    <span style={{ color: C.cyan, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>&rarr;</span>
                  </div>
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

export const SystemPromptContract = (ctx) => {
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
            Ten lines, four parts, zero ambiguity. The agent's behavior in production is mostly the quality of this one
            block of text.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
};

// Three labeled tickets used as the few-shot demonstration block.
// Same input/output format across all 3, by design.
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

// JSON Schema artifact - rendered as pretty-printed monospace, not a code block.
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

// Assembled classifier template - the artifact later chapters reuse.
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

export const FewShotStructuredOutput = (ctx) => {
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
                  <T color={C.teal} bold size={15}>
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
