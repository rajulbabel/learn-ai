import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const VENDOR_SDK_CARDS = [
  {
    name: "Claude Agent SDK",
    accent: "cyan",
    primitive: "Loop Primitive",
    api: "Run_Agent_Loop With System Prompt + Tools",
    native: "Prompt Cache, Structured Output, MCP",
    fits: "Single Agent Doing Deep Tool Use",
  },
  {
    name: "OpenAI Agents",
    accent: "purple",
    primitive: "Hand-Off Primitive",
    api: "Agent.Handoffs = [Other_Agent, ...]",
    native: "Assistants API, Built-In Function Tools",
    fits: "Multi-Role Workflows With Routing",
  },
];

const VENDOR_SDK_COMPARISON = [
  {
    axis: "Core Primitive",
    claude: "Loop (Single Agent, Multi-Iteration)",
    openai: "Hand-Off (Multi-Agent Chain)",
  },
  {
    axis: "Best Fit",
    claude: "Stand-Alone Agents With Deep Tool Use",
    openai: "Multi-Role Workflows With Routing",
  },
  {
    axis: "Lock-In",
    claude: "High - Bound To Claude API + Abstractions",
    openai: "High - Bound To OpenAI API + Abstractions",
  },
  {
    axis: "Portability",
    claude: "Low - Switching Vendor Means Rewriting The Loop",
    openai: "Low - Switching Vendor Means Rewriting The Hand-Off Chain",
  },
];

const VENDOR_SDK_FIT_ROWS = [
  {
    label: "Committed To One Vendor Long-Term",
    detail: "You Picked Claude Or OpenAI And Are Not Switching For 12+ Months.",
  },
  {
    label: "Want The Vendor's Latest Features Day One",
    detail: "Prompt Caching, New Tool-Calling Modes, Built-In Memory Land Faster Here.",
  },
  {
    label: "Vendor Abstractions Match Your Agent Shape",
    detail: "Single-Agent Loop -> Claude SDK. Multi-Role Hand-Off -> OpenAI Agents.",
  },
];

export default function VendorSdks(ctx) {
  const { sub, subBtnRipple, setSub, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.teal} style={{ width: "100%" }}>
          <T color={C.teal} bold center size={22}>
            When The Model Vendor Ships The Framework
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            Vendor-native SDKs are tightly integrated with one model provider. Claude Agent
            SDK is built around the Claude API and exposes a loop primitive. OpenAI Agents
            (the successor to Swarm) is built around OpenAI tool-calling and exposes a
            hand-off primitive. Both ship native support for that vendor's other features.
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            {VENDOR_SDK_CARDS.map((card) => {
              const accent = C[card.accent];
              const soft = SOFT[card.accent];
              return (
                <div
                  key={card.name}
                  style={{ ...tintedCard(accent), padding: 14, textAlign: "center" }}
                >
                  <T color={accent} center bold size={18}>
                    {card.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 4 }}>
                    {card.primitive}
                  </T>
                  <div
                    style={{
                      marginTop: 12,
                      padding: 10,
                      borderTop: `1px solid ${accent}22`,
                      color: soft,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    API: {card.api}
                  </div>
                  <div
                    style={{
                      padding: 10,
                      borderTop: `1px solid ${accent}22`,
                      color: soft,
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    Native: {card.native}
                  </div>
                  <div
                    style={{
                      padding: 10,
                      borderTop: `1px solid ${accent}22`,
                      color: accent,
                      fontSize: 13,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Fits: {card.fits}
                  </div>
                </div>
              );
            })}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Both vendors ship the abstractions they think their model is best at. Claude
            invests in long iterative loops with deep tool use. OpenAI invests in multi-agent
            hand-off chains. Pick the one whose abstractions match your agent shape.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Loop Primitive
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            The Claude Agent SDK exposes AgentLoop: a configured loop that takes a system
            prompt, a tool inventory, an iteration cap, and an on-message callback. Inside
            the loop, the SDK runs reason-act-observe for you and returns the final
            message once the model stops asking for tools.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center size={13} style={{ marginBottom: 8 }}>
              Framework Pattern (Shape) - Claude Agent SDK
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                fontSize: 14,
                color: SOFT.cyan,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
{`loop = AgentLoop(
  system_prompt=SYSTEM,
  tools=[lookup_customer, process_refund, escalate_human],
  max_iterations=10,
  on_message=log_message
)
result = loop.run(user_message="I want a refund for INV-9924")`}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            The loop is the abstraction. You hand the SDK the model, tools, and a cap, then
            call run. Reason-act-observe lives inside the SDK. You never write the while
            loop yourself.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Hand-Off Primitive
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            OpenAI Agents (the successor to Swarm) exposes hand-offs. Each agent declares
            which other agents it can hand off to. The Runner walks the chain: each agent
            either resolves the request or returns the next agent. The chain terminates
            when an agent returns a final response.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center size={13} style={{ marginBottom: 8 }}>
              Framework Pattern (Shape) - OpenAI Agents
            </T>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                fontSize: 14,
                color: SOFT.purple,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
{`triage = Agent(
  name="triage",
  instructions="Classify and route.",
  handoffs=[billing_agent, troubleshooting_agent]
)
result = Runner.run_sync(triage, "Refund my last invoice")`}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            The handoffs field is the routing graph. The Runner reads each agent's response
            to decide if it is a final answer or a hand-off to the next agent. No loop on
            your side. Just declare who can pass the baton to whom.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Two Primitives, Two Mental Models
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Loop versus hand-off is the headline difference. Lock-in and portability are
            the production trade-offs you carry forever. Moving to another vendor means
            rewriting the agent harness, not just swapping a model.
          </T>

          <div style={{ ...tintedCard(C.green), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.4fr 1.4fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>Axis</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>Claude Agent SDK</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.green }}>OpenAI Agents</div>
              {VENDOR_SDK_COMPARISON.map((row, i) => (
                <Fragment key={row.axis}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: C.green,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.axis}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: SOFT.cyan,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.claude}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.green}22`,
                      color: SOFT.purple,
                      background: i % 2 === 0 ? `${C.green}06` : "transparent",
                    }}
                  >
                    {row.openai}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            High lock-in is not automatic disqualification. If you are sure about the
            vendor for the next 18 months, lock-in is the price of native features. If
            you are not sure, the price is rewriting the agent harness later.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Use The Vendor SDK When...
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Vendor SDKs are the right pick when the vendor relationship is long-term and
            its abstractions fit your shape. Avoid them when you need multi-vendor support
            or features the SDK does not ship (LangGraph-style checkpointing, for
            example).
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Signal</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Why It Maps To Vendor SDK</div>
              {VENDOR_SDK_FIT_ROWS.map((row, i) => (
                <Fragment key={row.label}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.detail}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <T color={SOFT.amber} center size={14} bold>
              Avoid Vendor SDK When
            </T>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              A multi-vendor strategy is required, you anticipate switching models, or you
              need framework features the vendor does not ship (e.g. LangGraph-style
              checkpointing across long-running calls).
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Lock-in is a deliberate trade. You buy speed and native features. You pay in
            portability. Make the trade once, eyes open, before you have 50 agents in
            production.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
