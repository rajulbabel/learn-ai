import { Fragment } from "react";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard } from "../../shared/agent-styles.jsx";

// Module-private helpers (used only by this chapter):
const CREW_AUTOGEN_STYLE_CARDS = [
  {
    name: "CrewAI",
    accent: "cyan",
    primitive: "Role-Based",
    fields: "Role + Goal + Backstory + Tools",
    runtime: "Crew Runs Tasks Against Agents",
    feel: "Job Descriptions Then Hire",
  },
  {
    name: "AutoGen",
    accent: "purple",
    primitive: "Conversational",
    fields: "System Message + Speaker / Listener",
    runtime: "Manager Routes Messages Between Agents",
    feel: "Group Chat With A Moderator",
  },
];

const CREW_T4_TRACE = [
  "Triage Agent: Classify Ticket T4 -> Intent = Billing",
  "Triage Agent: Hand The Task To Billing Agent",
  "Billing Agent: Lookup_Customer(c-9924) -> Pro Tier, In Good Standing",
  "Billing Agent: Process_Refund(INV-9924, $150)",
  "Billing Agent: Escalate_Human Because Refund > Auto-Approve Threshold",
];
const AUTOGEN_T4_TRACE = [
  "User_Proxy: Posts Ticket T4 To Group Chat",
  "Triage Speaks: Classify -> Intent = Billing, Tag @Billing",
  "Billing Joins: Lookup_Customer(c-9924), Process_Refund(INV-9924, $150)",
  "Escalation Joins: Approve The Refund (Manager Routes Message)",
  "Triage Closes: Replies To User_Proxy With Resolution",
];

const CREW_AUTOGEN_FIT_ROWS = [
  {
    framework: "CrewAI",
    when: "When You Can List Distinct Roles With Clear Goals",
    example: "Customer Support Engineer, Researcher, Writer, Reviewer",
  },
  {
    framework: "AutoGen",
    when: "When Agents Need Free-Form Conversation",
    example: "Debate, Brainstorm, Multi-Reviewer Code Review",
  },
  {
    framework: "Skip Both",
    when: "When You Have One Agent + Tools (No Second Agent Needed)",
    example: "Most Customer-Support Bots Live Here",
  },
];

export default function CrewAiAutoGen(ctx) {
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
            Two Multi-Agent Styles
          </T>
          <T color={SOFT.teal} center size={16} style={{ marginTop: 10 }}>
            CrewAI and AutoGen tackle the same problem (multiple agents working together) with two different
            abstractions. CrewAI is role-based: each agent has a role, goal, backstory, and tools. AutoGen is
            conversational: agents talk to each other through a manager that routes messages.
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            {CREW_AUTOGEN_STYLE_CARDS.map((card) => {
              const accent = C[card.accent];
              const soft = SOFT[card.accent];
              return (
                <div key={card.name} style={{ ...tintedCard(accent), padding: 14, textAlign: "center" }}>
                  <T color={accent} center bold size={18}>
                    {card.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 4 }}>
                    {card.primitive} Primitive
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
                    Fields: {card.fields}
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
                    Runtime: {card.runtime}
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
                    Feel: {card.feel}
                  </div>
                </div>
              );
            })}
          </div>

          <T color={SOFT.teal} center size={15} style={{ marginTop: 14 }}>
            Same problem, two different abstractions. The pick depends on whether your mental model is "team of
            specialists" or "group chat with a moderator".
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            CrewAI: Roles + Goals
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            A CrewAI agent looks like a job description. Role names the position. Goal states the outcome. Tools is the
            kit. The Crew object ties agents to tasks and runs them. The runtime tries to match each task to the
            best-fit agent.
          </T>

          <div style={{ ...tintedCard(C.cyan), padding: 14, marginTop: 14 }}>
            <T color={SOFT.cyan} center size={13} style={{ marginBottom: 8 }}>
              Framework Pattern (Shape) - CrewAI
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
              {`triage_agent = Agent(
  role="Support Triage Specialist",
  goal="Classify the ticket and route to the right specialist.",
  tools=[classify_intent]
)
billing_agent = Agent(
  role="Billing Specialist",
  goal="Resolve billing-related requests including refunds and invoices.",
  tools=[lookup_customer, lookup_subscription, process_refund, escalate_human]
)
crew = Crew(agents=[triage_agent, billing_agent], tasks=[handle_ticket_task])`}
            </div>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 14 }}>
            The role and goal fields are not cosmetic. The runtime feeds them into the agent's system prompt and uses
            them to pick which agent to delegate a task to. Backstory is optional flavor that shapes voice.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            AutoGen: Conversational Agents
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            AutoGen models agents as participants in a chat room. Each AssistantAgent has a name and system_message. A
            UserProxyAgent stands in for the human or upstream system. A GroupChatManager moderates: it sees every
            message and picks who speaks next.
          </T>

          <div style={{ ...tintedCard(C.purple), padding: 14, marginTop: 14 }}>
            <T color={SOFT.purple} center size={13} style={{ marginBottom: 8 }}>
              Framework Pattern (Shape) - AutoGen
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
              {`triage = AssistantAgent(
  name="triage",
  system_message="You classify support tickets and tag the right handler."
)
billing = AssistantAgent(
  name="billing",
  system_message="You handle billing requests: refunds, invoices, subscriptions."
)
user_proxy = UserProxyAgent(name="user_proxy")

manager = GroupChatManager(
  groupchat=GroupChat(agents=[triage, billing, user_proxy])
)`}
            </div>
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            The manager is the orchestration core. It reads message context to choose the next speaker. This makes
            back-and-forth conversation natural (debate, review, brainstorm) but adds a routing layer you have to tune.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Same Ticket, Two Frameworks
          </T>
          <T color={SOFT.green} center size={16} style={{ marginTop: 10 }}>
            Ticket T4 (cancel and refund) runs through both frameworks. Same outcome. Different orchestration shape.
            CrewAI hands tasks. AutoGen routes messages.
          </T>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <T color={C.cyan} center bold size={16}>
                CrewAI Trace - Ticket T4
              </T>
              <div style={{ marginTop: 10 }}>
                {CREW_T4_TRACE.map((line, i) => (
                  <div
                    key={`crew-${i}`}
                    style={{
                      padding: "8px 10px",
                      borderTop: i === 0 ? "none" : `1px solid ${C.cyan}22`,
                      color: SOFT.cyan,
                      fontSize: 13,
                      textAlign: "left",
                    }}
                  >
                    Step {i + 1}: {line}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <T color={C.purple} center bold size={16}>
                AutoGen Trace - Ticket T4
              </T>
              <div style={{ marginTop: 10 }}>
                {AUTOGEN_T4_TRACE.map((line, i) => (
                  <div
                    key={`autogen-${i}`}
                    style={{
                      padding: "8px 10px",
                      borderTop: i === 0 ? "none" : `1px solid ${C.purple}22`,
                      color: SOFT.purple,
                      fontSize: 13,
                      textAlign: "left",
                    }}
                  >
                    Step {i + 1}: {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <T color={SOFT.green} center size={15} style={{ marginTop: 14 }}>
            CrewAI feels like "the triage agent passes a baton to the billing agent". AutoGen feels like "they discuss
            it in chat with a moderator". Both arrive at the same resolution. Pick the one that matches how you describe
            the work in English.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Pick The Abstraction That Matches Your Mental Model
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Framework choice matters less than agent design quality. A well-designed CrewAI agent beats a
            poorly-designed AutoGen agent every time. Pick whichever abstraction makes your team faster.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.6fr 1.4fr", gap: 0, fontSize: 14 }}>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Pick</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>When</div>
              <div style={{ padding: "8px 10px", fontWeight: 700, color: SOFT.amber }}>Example</div>
              {CREW_AUTOGEN_FIT_ROWS.map((row, i) => (
                <Fragment key={row.framework}>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: C.amber,
                      fontWeight: 700,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.framework}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.when}
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderTop: `1px solid ${C.amber}22`,
                      color: SOFT.amber,
                      background: i % 2 === 0 ? `${C.amber}06` : "transparent",
                    }}
                  >
                    {row.example}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Framework choice matters less than agent design quality. Pick the abstraction your team can reason about
            fastest and ship a working agent before debating the perfect runtime.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
