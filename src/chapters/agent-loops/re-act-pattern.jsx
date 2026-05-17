import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";
import { monoArtifact } from "../../shared/agent-helpers.jsx";

// Four-cycle ReAct trace for Ticket T2 (reset password + email changed).
// Each cycle has Thought, Action, Observation rows. The final cycle ends with
// the model's user-facing answer instead of another Action.
const REACT_T2_TRACE = [
  {
    n: 1,
    thought: "Customer wants reset, mentioned old email. Look them up first.",
    action: 'lookup_customer({"email": "alice@example.com"})',
    observation: '{ customer_id: "c-9924", tier: "pro", primary_email: "alice@example.com" }',
  },
  {
    n: 2,
    thought: "Email on record is outdated. Update it before the reset link goes to the wrong inbox.",
    action: 'change_email({"customer_id": "c-9924", "new_email": "alice+new@example.com"})',
    observation: '{ ok: true, primary_email: "alice+new@example.com", verification: "pending" }',
  },
  {
    n: 3,
    thought: "Email is fixed. Trigger the password reset now so the link lands at the new address.",
    action: 'reset_password({"customer_id": "c-9924"})',
    observation: '{ ok: true, reset_link_sent_to: "alice+new@example.com" }',
  },
  {
    n: 4,
    thought: "All steps done. Write the user-facing reply and stop the loop.",
    action: null,
    answer:
      'Answer: "I updated your email to alice+new@example.com and sent a fresh reset link there. Click it within 30 minutes to set a new password."',
  },
];

// Three labeled rows for sub=0 (Thought / Action / Observation block stack).
const REACT_BLOCK_STACK = [
  {
    label: "Thought",
    color: "yellow",
    body: "What The Model Is Thinking About The Next Step.",
  },
  {
    label: "Action",
    color: "red",
    body: "Which Tool To Call And With Which Arguments.",
  },
  {
    label: "Observation",
    color: "amber",
    body: "What The Tool Returned, Fed Back Into The Next Thought.",
  },
];

// monoArtifact is imported from ../shared/agent-helpers.jsx (see top of file).

export default function ReActPattern(ctx) {
  const { sub, setSub, subBtnRipple, setSubBtnRipple, registerSubBtn } = ctx;

  const onContinue = () => {
    setSub(sub + 1);
    setSubBtnRipple(subBtnRipple + 1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Make The Reasoning Visible
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            ReAct stands for Reasoning + Acting. Instead of hiding the model's reasoning inside its head and only
            emitting a tool call, ReAct asks the model to write the thought out loud, then the action, then the
            observation, in that order, every iteration. The loop is the same; what changes is that each block is now
            visible structured output.
          </T>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REACT_BLOCK_STACK.map((row) => (
              <div
                key={row.label}
                style={{
                  ...tintedCard(C[row.color]),
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    background: `${C[row.color]}28`,
                    border: `1px solid ${C[row.color]}`,
                    borderRadius: 6,
                    padding: "8px 0",
                    textAlign: "center",
                  }}
                >
                  <T color={C[row.color]} bold size={14}>
                    {row.label}
                  </T>
                </div>
                <T color={SOFT[row.color]} size={14}>
                  {row.body}
                </T>
              </div>
            ))}
          </div>

          <div style={{ ...tintedCard(C.orange), padding: 12, marginTop: 12 }}>
            <span style={pill(C.orange)}>KEY IDEA</span>
            <T color={SOFT.orange} center size={14} style={{ marginTop: 8 }}>
              Thought Is INSIDE The Model's Response Now, Not Hidden.
            </T>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            Same three beats as the agent loop. The difference is that the Thought is no longer an internal step the
            model performs silently. It becomes a written block in the response, so evaluators, debuggers, and
            downstream tools can read it directly.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Thought: Why The Next Action
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The Thought block answers one question: why is the next action the right next action? It names the plan in
            plain language before any tool fires. A good Thought references the user's request, the state so far, and
            the order of remaining steps.
          </T>

          <div
            style={{
              ...monoArtifact(C.yellow),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.yellow,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {`Thought: The user asked to reset their password but mentioned the email changed.
I should first lookup_customer with the OLD email, then change_email to the NEW one,
then reset_password.`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.yellow), padding: 12, marginTop: 12 }}>
            <span style={pill(C.yellow)}>WHY IT MATTERS</span>
            <T color={SOFT.yellow} center size={14} style={{ marginTop: 8 }}>
              The Thought Makes The Plan Visible For Evals And Debugging.
            </T>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            When a reset later goes wrong, you can open the trace and read the model's plan in English. You learn
            whether the failure was bad reasoning (wrong plan) or bad execution (right plan, wrong tool argument). That
            split is impossible without a written Thought.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Action: The Concrete Step
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            After the Thought, the model emits exactly one Action. It is a tool name plus an argument object that
            matches the tool's JSON schema. No second tool, no batching - one call, one step.
          </T>

          <div
            style={{
              ...monoArtifact(C.red),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.red,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {`Action: lookup_customer({"email": "alice@example.com"})`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.red), padding: 12, marginTop: 12 }}>
            <span style={pill(C.red)}>RULE</span>
            <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
              One Action Per Iteration.
            </T>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Why only one? Because the next Thought must be free to react to whatever this Action returned. Batching two
            tool calls into one Action makes the model commit to a second step before it has seen the first result,
            which is exactly the trap the loop is supposed to avoid.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.amber} style={{ width: "100%" }}>
          <T color={C.amber} bold center size={22}>
            Observation: What Came Back
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            The Observation block holds the result the runtime received from the tool. The runtime writes this in - the
            model does not invent it. The Observation is appended to the conversation so the next Thought has the new
            ground truth to reason over.
          </T>

          <div
            style={{
              ...monoArtifact(C.amber),
              marginTop: 14,
            }}
          >
            <pre
              style={{
                margin: 0,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.amber,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {`Observation: { customer_id: "c-9924", tier: "pro", primary_email: "alice@example.com" }`}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.amber), padding: 12, marginTop: 12 }}>
            <span style={pill(C.amber)}>WHAT HAPPENS NEXT</span>
            <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
              The Model Reads This And Decides The Next Thought.
            </T>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Notice the structure - keys like customer_id, tier, primary_email. The model is reading a JSON-shaped
            result, not a free-text paragraph. Keeping the Observation strictly structured is what lets the next Thought
            pull out specific fields like c-9924 instead of paraphrasing them.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            ReAct Trace: Ticket T2
          </T>
          <T color={SOFT.cyan} center size={16} style={{ marginTop: 10 }}>
            Same ticket T2 from the agent loop chapter, now written out in full ReAct format. Read top to bottom:
            Thought - Action - Observation, repeat. Four cycles, then the model decides the loop is done and writes the
            final answer instead of a fifth Action.
          </T>

          <div
            style={{
              ...tintedCard(C.cyan),
              padding: 16,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold center size={14}>
              ReAct Trace - Ticket T2
            </T>
            <pre
              style={{
                margin: "12px 0 0 0",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                color: SOFT.cyan,
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {REACT_T2_TRACE.map((c) => {
                const header = `# Cycle ${c.n}`;
                const t = `Thought: ${c.thought}`;
                const a = c.action ? `Action: ${c.action}` : null;
                const o = c.observation ? `Observation: ${c.observation}` : null;
                const ans = c.answer ? c.answer : null;
                return [header, t, a, o, ans].filter(Boolean).join("\n");
              }).join("\n\n")}
            </pre>
          </div>

          <div style={{ ...tintedCard(C.cyan), padding: 12, marginTop: 12 }}>
            <span style={pill(C.cyan)}>OUTCOME</span>
            <T color={SOFT.cyan} center size={14} style={{ marginTop: 8 }}>
              4 Cycles. 3 Tool Calls. Cycle 4 Ends With An Answer Instead Of An Action, So The Loop Stops.
            </T>
          </div>

          <T color={SOFT.cyan} center size={15} style={{ marginTop: 12 }}>
            The trace reads almost like a transcript of someone thinking aloud while doing the work. That is the point -
            a human reviewer can audit every decision, and a downstream evaluator can score the Thoughts independently
            from whether the final answer was right.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            When To Force ReAct
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            ReAct is not free. Each Thought costs tokens and slows the response. Modern tool-use APIs already produce
            structured tool_use blocks without forcing the reasoning to be written out. Use ReAct when you specifically
            need the reasoning surface.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                ...tintedCard(C.red),
                padding: 14,
                borderLeft: `4px solid ${SOFT.red}`,
              }}
            >
              <span style={pill(C.red)}>PLAIN TOOL-USE</span>
              <T color={C.red} bold center size={15} style={{ marginTop: 8 }}>
                Reasoning Stays In The Model's Head
              </T>
              <T color={SOFT.red} center size={14} style={{ marginTop: 8 }}>
                Model Emits tool_use Blocks. Reasoning In Model's Head. Invisible To User / Observability.
              </T>
            </div>

            <div
              style={{
                ...tintedCard(C.green),
                padding: 14,
                borderLeft: `4px solid ${SOFT.green}`,
              }}
            >
              <span style={pill(C.green)}>REACT</span>
              <T color={C.green} bold center size={15} style={{ marginTop: 8 }}>
                Reasoning Written Out As Text
              </T>
              <T color={SOFT.green} center size={14} style={{ marginTop: 8 }}>
                Same Loop, But Model Required To Emit Thought + Action Explicitly.
              </T>
            </div>
          </div>

          <div
            style={{
              ...tintedCard(C.orange),
              padding: 14,
              marginTop: 14,
              background: DIM_BG,
              border: `1px solid ${DIM_BORDER}`,
            }}
          >
            <span style={pill(C.orange)}>WHEN TO USE REACT</span>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                textAlign: "left",
              }}
            >
              <T color={SOFT.orange} size={14}>
                - When You Need To Audit Reasoning.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Need To Debug Failures.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Train A Smaller Model On The Traces.
              </T>
              <T color={SOFT.orange} size={14}>
                - When You Need To Build Trust With The User.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            Once the trace is written down, it becomes a teaching signal. You can fine-tune a smaller model on big-model
            traces, you can show the Thoughts in a UI to make the agent feel transparent, and you can write evals that
            score the plan separately from the final answer.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
