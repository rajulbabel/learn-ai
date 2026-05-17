import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Canonical working memory scratchpad shape used in 13.25 and referenced by 13.42 (Observability tracing).
const WORKING_MEMORY_SHAPE = `{
  "customer_context": "alice@example.com, c-9924, Pro",
  "current_goal": "Reset password (email also changed)",
  "completed_steps": ["lookup_customer", "change_email"],
  "next_step": "reset_password",
  "constraints": ["refund cap $200"]
}`;

// Scratchpad evolution for ticket T2 across four loop iterations.
const T2_SCRATCHPAD_ITER = [
  {
    iter: 1,
    customer_context: '"" (not yet looked up)',
    completed_steps: "[]",
    next_step: '"lookup_customer"',
  },
  {
    iter: 2,
    customer_context: '"alice@example.com, c-9924, Pro"',
    completed_steps: '["lookup_customer"]',
    next_step: '"change_email"',
  },
  {
    iter: 3,
    customer_context: '"alice@example.com, c-9924, Pro"',
    completed_steps: '["lookup_customer", "change_email"]',
    next_step: '"reset_password"',
  },
  {
    iter: 4,
    customer_context: '"alice@example.com, c-9924, Pro"',
    completed_steps: '["lookup_customer", "change_email", "reset_password"]',
    next_step: "null (task complete)",
  },
];

// Working-vs-Long-Term comparison rows.
const WORKING_VS_LONG = [
  {
    field: "Lives In",
    working: "Prompt Context Window",
    longterm: "External Store (Vector DB / Postgres)",
  },
  { field: "Written By", working: "Model On Each Loop Turn", longterm: "Explicit Promotion Logic" },
  { field: "Capacity", working: "A Few Hundred Tokens", longterm: "Millions Of Facts / Events" },
  { field: "Lifespan", working: "Discarded When Task Ends", longterm: "Persistent Across Sessions" },
];

export default function WorkingMemory(ctx) {
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
            A Note Pad The Model Keeps
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Working memory is the in-context scratchpad. The agent reads it on every REASON step and updates it after
            every OBSERVE step. It lives inside the prompt context window itself, not in any external store.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 16, marginTop: 14 }}>
            <span style={pill(C.amber)}>SCRATCHPAD</span>
            <T color={C.amber} bold center size={16} style={{ marginTop: 10 }}>
              The Loop Around The Note Pad
            </T>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "center",
              }}
            >
              <T color={SOFT.amber} center size={14}>
                1. REASON: The Model Reads The Scratchpad To Decide The Next Tool.
              </T>
              <T color={SOFT.amber} center size={14}>
                2. ACT: The Tool Runs.
              </T>
              <T color={SOFT.amber} center size={14}>
                3. OBSERVE: The Result Comes Back; The Scratchpad Is Updated.
              </T>
              <T color={SOFT.amber} center size={14}>
                4. LOOP: Back To Step 1, This Time With The Updated Note Pad.
              </T>
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            The scratchpad is the agent&apos;s short-term reasoning trace. Lose it, and the agent has to re-derive what
            it was doing from scratch.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            What Goes In The Scratchpad
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            The scratchpad is not free-form text. It is a structured object with stable field names so the model can
            read and write specific slots. Five fields anchor the running task.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <T color={C.yellow} bold center size={14}>
              Working Memory (Shape)
            </T>
            <div
              style={{
                marginTop: 10,
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.yellow,
                fontSize: 14,
                lineHeight: 1.5,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {WORKING_MEMORY_SHAPE}
            </div>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            `customer_context` answers "who", `current_goal` answers "what", `completed_steps` answers "what so far",
            `next_step` answers "what next", and `constraints` keep the agent within policy. Same five fields appear in
            13.42 observability traces.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Updated Every Iteration
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Watch the scratchpad evolve across four loop turns of ticket T2 (Alice: password reset + email change). Each
            row is the state right after the iteration&apos;s OBSERVE step.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {T2_SCRATCHPAD_ITER.map((it) => (
              <div key={`iter-${it.iter}`} style={{ ...tintedCard(C.orange), padding: 12 }}>
                <span style={pill(C.orange)}>{`ITERATION ${it.iter}`}</span>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "monospace",
                    whiteSpace: "pre",
                    textAlign: "left",
                    color: SOFT.orange,
                    fontSize: 13,
                    lineHeight: 1.4,
                    display: "inline-block",
                  }}
                >
                  {`customer_context: ${it.customer_context}
completed_steps : ${it.completed_steps}
next_step       : ${it.next_step}`}
                </div>
              </div>
            ))}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            By iteration 4, `next_step` is null and the task is done. The scratchpad terminated cleanly, which is how
            loop termination (13.23) detects success.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Working Memory Dies When The Task Ends
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            When the loop terminates, the scratchpad is discarded. Anything worth keeping must be promoted to long-term
            memory BEFORE that discard. Otherwise it is gone.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 130" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Timeline of working memory: created at task start, updated through N iterations, discarded when task
                ends, with a promotion arrow pointing to long-term store before discard.
              </desc>
              {/* Horizontal timeline: 4 stops + final discard X. Total span 480; pad = (560-480)/2 = 40. */}
              <line x1={40} y1={70} x2={520} y2={70} stroke={C.red} strokeWidth={1.6} />
              {[
                { x: 80, label: "Task Start", note: "Created" },
                { x: 200, label: "Iter N", note: "Updated" },
                { x: 320, label: "Promote", note: "To Long-Term" },
                { x: 440, label: "Task End", note: "Discarded" },
              ].map((stop, i) => (
                <g key={`stop-${i}`}>
                  <circle
                    cx={stop.x}
                    cy={70}
                    r={9}
                    fill={i === 3 ? C.red : `${C.red}26`}
                    stroke={C.red}
                    strokeWidth={2}
                  />
                  <text x={stop.x} y={50} fill={SOFT.red} fontSize="12" fontWeight="700" textAnchor="middle">
                    {stop.label}
                  </text>
                  <text x={stop.x} y={100} fill={SOFT.red} fontSize="11" textAnchor="middle">
                    {stop.note}
                  </text>
                </g>
              ))}
              {/* Promote arrow up out of timeline */}
              <line x1={320} y1={61} x2={320} y2={28} stroke={C.purple} strokeWidth={1.6} />
              <polygon points="316,30 324,30 320,22" fill={C.purple} />
              <text x={320} y={18} fill={SOFT.purple} fontSize="11" fontWeight="700" textAnchor="middle">
                Long-Term Store
              </text>
            </svg>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            "Resolved by email reset link" is a working memory entry. After promotion to episodic memory, the next
            session can recall it. Skip the promote, and the next session asks Alice the same question from scratch.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Working vs Long-Term
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Side-by-side: what is different between the in-context scratchpad and the external long-term store.
            Different lifespan, different capacity, different writer.
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
                Field
              </T>
            </div>
            <div style={{ padding: 10, background: `${C.amber}10`, textAlign: "center" }}>
              <T color={SOFT.amber} bold center size={13}>
                Working Memory
              </T>
            </div>
            <div style={{ padding: 10, background: `${C.purple}10`, textAlign: "center" }}>
              <T color={SOFT.purple} bold center size={13}>
                Long-Term Memory
              </T>
            </div>
            {WORKING_VS_LONG.flatMap((row) => [
              <div
                key={`f-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.purple}18`, textAlign: "center" }}
              >
                <T color={SOFT.purple} center size={13}>
                  {row.field}
                </T>
              </div>,
              <div
                key={`w-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.amber}18`, textAlign: "center" }}
              >
                <T color={SOFT.amber} center size={13}>
                  {row.working}
                </T>
              </div>,
              <div
                key={`l-${row.field}`}
                style={{ padding: 10, borderTop: `1px solid ${C.purple}18`, textAlign: "center" }}
              >
                <T color={SOFT.purple} center size={13}>
                  {row.longterm}
                </T>
              </div>,
            ])}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Working memory is fast, cheap, and ephemeral. Long-term memory is slower, more expensive, but persistent.
            Agents need both - and the bridge between them is the promote step covered in the next chapters.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
