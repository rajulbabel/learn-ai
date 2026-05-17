import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Section 13 Act 5: Agent Memory
// Chapters 13.24 - 13.29

// Three long-term memory sub-types - used in sub=1 and sub=2 trees of MemoryTaxonomy.
const LONG_TERM_TYPES = [
  {
    name: "Episodic",
    desc: "Past Events (Timestamps + Content)",
    color: "yellow",
    example: "Past Ticket #4521: Failed Password Reset Escalated For MFA Bug.",
  },
  {
    name: "Semantic",
    desc: "Facts (Key-Value Or Vector)",
    color: "orange",
    example: "Alice = Pro Tier, Signed Up 2024-08, Prefers Email.",
  },
  {
    name: "Procedural",
    desc: "Skills (Recipes / Cached Workflows)",
    color: "red",
    example: "Refund > $200 -> Escalate To Human.",
  },
];

// Four memory types for the T2 snapshot in sub=3 and the "why all four" cards in sub=4.
const T2_MEMORY_SNAPSHOT = [
  {
    layer: "Working",
    color: "amber",
    content:
      "Customer alice@example.com / c-9924. Issue: password reset + email changed. Next: change_email then reset_password.",
  },
  {
    layer: "Episodic",
    color: "yellow",
    content: "2026-03-04: Past ticket #4521 for failed password reset; escalated due to legacy MFA bug.",
  },
  {
    layer: "Semantic",
    color: "orange",
    content: "Alice = Pro tier, signed up 2024-08, prefers email contact, USD billing.",
  },
  {
    layer: "Procedural",
    color: "red",
    content: "Refund > $200 -> escalate_human. Always confirm identity before change_email.",
  },
];

const WHY_FOUR_CARDS = [
  {
    layer: "Working",
    color: "amber",
    problem: "Holds The Current Task State Across Loop Iterations.",
  },
  {
    layer: "Episodic",
    color: "yellow",
    problem: "Gives The Agent Recall Of Specific Past Events.",
  },
  {
    layer: "Semantic",
    color: "orange",
    problem: "Provides Stable Customer Facts Without Re-Asking.",
  },
  {
    layer: "Procedural",
    color: "red",
    problem: "Caches Learned Routines So The Agent Does Not Re-Derive Them Every Time.",
  },
];

export default function MemoryTaxonomy(ctx) {
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
            Two Memory Layers
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            An agent has memory in two very different places. Short-term memory lives inside the active context window
            of the current conversation. Long-term memory lives outside that window and persists across sessions.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.amber), padding: 14 }}>
              <span style={pill(C.amber)}>SHORT-TERM</span>
              <T color={C.amber} bold center size={16} style={{ marginTop: 10 }}>
                Working Memory
              </T>
              <T color={SOFT.amber} center size={14} style={{ marginTop: 8 }}>
                Lives In The Active Context Window. The Model Reads And Writes It Every Loop Turn. Discarded When The
                Session Ends.
              </T>
            </div>

            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>LONG-TERM</span>
              <T color={C.purple} bold center size={16} style={{ marginTop: 10 }}>
                Persistent Memory
              </T>
              <T color={SOFT.purple} center size={14} style={{ marginTop: 8 }}>
                Lives Outside The Context Window In An External Store. Persists Across Sessions And Conversations. Gets
                Loaded Back In On Demand.
              </T>
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Short = this conversation. Long = everything before. The rest of the memory chapters walk the taxonomy and
            show how each piece fits the agent loop.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Long-Term Splits Three Ways
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Long-term memory is not one thing. It separates by what kind of information it holds. Three sub-types -
            episodic, semantic, procedural - each answer a different question.
          </T>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {LONG_TERM_TYPES.map((t) => {
              const accent = C[t.color];
              const soft = SOFT[t.color];
              return (
                <div key={t.name} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{t.name.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {t.name}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {t.desc}
                  </T>
                  <T color={soft} center size={12} style={{ marginTop: 6 }}>
                    {t.example}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 14 }}>
            The next chapters give each of these their own zoom. Here we just see the shape: events (when), facts
            (what), skills (how).
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            The Agent Memory Taxonomy
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            One root, two branches, four leaves. Each leaf is a separate chapter. The tree is the map for the rest of
            the memory chapters.
          </T>

          <div style={{ ...tintedCard(C.orange), padding: 14, marginTop: 14 }}>
            <svg viewBox="0 0 560 320" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
              <desc>
                Memory taxonomy tree with Agent Memory as root, branching into Short-Term Working Memory and Long-Term,
                then Long-Term splits into Episodic, Semantic, and Procedural.
              </desc>
              {/* Root: Agent Memory at top center (280) */}
              <rect
                x={210}
                y={10}
                width={140}
                height={40}
                rx={8}
                fill={`${C.orange}24`}
                stroke={C.orange}
                strokeWidth={2}
              />
              <text x={280} y={36} fill={SOFT.orange} fontSize="15" fontWeight="700" textAnchor="middle">
                Agent Memory
              </text>

              {/* Branch lines: root center (280, 50) to short-term (140, 100) and long-term (420, 100) */}
              <line x1={280} y1={50} x2={140} y2={100} stroke={C.orange} strokeWidth={1.6} />
              <line x1={280} y1={50} x2={420} y2={100} stroke={C.orange} strokeWidth={1.6} />

              {/* Short-Term node */}
              <rect
                x={70}
                y={100}
                width={140}
                height={40}
                rx={8}
                fill={`${C.amber}1f`}
                stroke={C.amber}
                strokeWidth={1.8}
              />
              <text x={140} y={126} fill={SOFT.amber} fontSize="14" fontWeight="700" textAnchor="middle">
                Short-Term
              </text>

              {/* Long-Term node */}
              <rect
                x={350}
                y={100}
                width={140}
                height={40}
                rx={8}
                fill={`${C.purple}1f`}
                stroke={C.purple}
                strokeWidth={1.8}
              />
              <text x={420} y={126} fill={SOFT.purple} fontSize="14" fontWeight="700" textAnchor="middle">
                Long-Term
              </text>

              {/* Working leaf under Short-Term */}
              <line x1={140} y1={140} x2={140} y2={210} stroke={C.amber} strokeWidth={1.4} />
              <rect
                x={70}
                y={210}
                width={140}
                height={50}
                rx={8}
                fill={`${C.amber}14`}
                stroke={C.amber}
                strokeWidth={1.5}
              />
              <text x={140} y={232} fill={SOFT.amber} fontSize="13" fontWeight="700" textAnchor="middle">
                Working
              </text>
              <text x={140} y={250} fill={SOFT.amber} fontSize="11" textAnchor="middle">
                Scratchpad (13.25)
              </text>

              {/* 3 long-term leaves: episodic, semantic, procedural */}
              {/* Long-term parent at x=420. 3 children at x=310, 420, 530. */}
              <line x1={420} y1={140} x2={310} y2={200} stroke={C.purple} strokeWidth={1.4} />
              <line x1={420} y1={140} x2={420} y2={200} stroke={C.purple} strokeWidth={1.4} />
              <line x1={420} y1={140} x2={530} y2={200} stroke={C.purple} strokeWidth={1.4} />

              {LONG_TERM_TYPES.map((t, i) => {
                const x = 310 + i * 110;
                const accent = C[t.color];
                const soft = SOFT[t.color];
                return (
                  <g key={`leaf-${t.name}`}>
                    <rect
                      x={x - 50}
                      y={200}
                      width={100}
                      height={70}
                      rx={8}
                      fill={`${accent}14`}
                      stroke={accent}
                      strokeWidth={1.5}
                    />
                    <text x={x} y={222} fill={soft} fontSize="13" fontWeight="700" textAnchor="middle">
                      {t.name}
                    </text>
                    <text x={x} y={240} fill={soft} fontSize="10" textAnchor="middle">
                      13.{26 + i}
                    </text>
                    <text x={x} y={258} fill={soft} fontSize="10" textAnchor="middle">
                      {["Events", "Facts", "Skills"][i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            Each leaf becomes its own chapter. Working memory is 13.25; episodic, semantic, procedural are 13.26 through
            13.28. Summary and context-management close out at 13.29.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory Snapshot: Ticket T2
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Concrete example for ticket T2 (password reset + email change for Alice). Each memory layer holds something
            different. Together they let the agent reason with full context.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {T2_MEMORY_SNAPSHOT.map((m) => {
              const accent = C[m.color];
              const soft = SOFT[m.color];
              return (
                <div key={m.layer} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{m.layer.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {m.layer}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {m.content}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 14 }}>
            Notice the customer ID c-9924 and the refund cap $200 - those reappear across the memory chapters. The agent
            does not re-derive these each turn; it loads them from memory.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Each Layer Solves A Different Problem
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Why have four layers and not one? Because each holds a different shape of information, with different
            retrieval patterns, different update rules, and different lifespans.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {WHY_FOUR_CARDS.map((c) => {
              const accent = C[c.color];
              const soft = SOFT[c.color];
              return (
                <div key={c.layer} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{c.layer.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 8 }}>
                    {c.layer}
                  </T>
                  <T color={soft} center size={13} style={{ marginTop: 6 }}>
                    {c.problem}
                  </T>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Working memory tracks the current task state. Episodic memory recalls specific past events. Semantic memory
            stores stable facts. Procedural memory caches routines so the agent does not re-derive them every time. Each
            layer earns its place.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
