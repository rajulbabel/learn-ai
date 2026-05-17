import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

// Four past events for Alice used in the sub=0 timeline and referenced through the rest of 13.26.
const ALICE_EPISODES = [
  {
    date: "2026-03-04",
    label: "Failed Password Reset",
    detail: "Escalated Due To Legacy MFA Bug.",
  },
  {
    date: "2026-04-12",
    label: "Slow Dashboard",
    detail: "Complained About Loading Time; Resolved With Cache Fix.",
  },
  {
    date: "2026-05-01",
    label: "Invoice Request",
    detail: "Requested May Invoice; Sent Successfully.",
  },
  {
    date: "2026-05-15",
    label: "Password + Email Reset (T2)",
    detail: "Current Ticket.",
  },
];

const EPISODIC_ENTRY_SHAPE = `{
  "id": "ev-7821",
  "customer_id": "c-9924",
  "timestamp": "2026-03-04T14:22:00Z",
  "summary": "Failed password reset escalated due to legacy MFA bug.",
  "tools_used": ["reset_password", "escalate_human"],
  "outcome": "human_resolved",
  "embedding": "[1024 floats]"
}`;

const PRUNING_POLICY_ROWS = [
  {
    condition: "Age > 12 Months AND Outcome = Resolved Cleanly",
    action: "Drop",
  },
  {
    condition: "Age > 12 Months AND Outcome = Escalated",
    action: "Keep (Rare Patterns Valuable)",
  },
  {
    condition: "Aggregated Similar Events",
    action: "Summarize Into One Parent And Drop Children",
  },
  {
    condition: "Manual Customer Request",
    action: "Delete On Demand (Compliance)",
  },
];

export default function EpisodicMemory(ctx) {
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
            Episodes: Time-Stamped Events
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Episodic memory holds specific past events. Each event has a timestamp and a short
            description of what happened. Below: four episodes the agent has on file for Alice.
          </T>

          <div style={{ ...tintedCard(C.amber), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 280"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Vertical timeline of four past events for Alice the customer, each with a date and a
                short summary, with the current ticket marked at the bottom.
              </desc>
              {/* Vertical line center at x=70 */}
              <line x1={70} y1={20} x2={70} y2={260} stroke={C.amber} strokeWidth={1.6} />
              {ALICE_EPISODES.map((ep, i) => {
                const cy = 40 + i * 60;
                const isLast = i === ALICE_EPISODES.length - 1;
                return (
                  <g key={`ep-${i}`}>
                    <circle
                      cx={70}
                      cy={cy}
                      r={10}
                      fill={isLast ? C.amber : `${C.amber}30`}
                      stroke={C.amber}
                      strokeWidth={2}
                    />
                    <text
                      x={100}
                      y={cy - 4}
                      fill={SOFT.amber}
                      fontSize="13"
                      fontWeight="700"
                    >
                      {ep.date}
                    </text>
                    <text x={100} y={cy + 12} fill={SOFT.amber} fontSize="12">
                      {ep.label}
                    </text>
                    <text x={100} y={cy + 26} fill={SOFT.amber} fontSize="11">
                      {ep.detail}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 12 }}>
            Episodes answer "what happened, when?". They are NOT the customer&apos;s stable facts
            (that is semantic memory) and they are NOT how-to recipes (that is procedural memory).
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Stored As Vectors For Retrieval
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Episodic memory lives in a vector database. Each event becomes an embedding; a search
            query becomes an embedding; an ANN index returns the most similar past events.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <svg
              viewBox="0 0 560 200"
              style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}
            >
              <desc>
                Two stage flow: stage one embeds each event and stores it in the vector database;
                stage two embeds a query and runs ANN search to retrieve the top-k matching past
                events.
              </desc>
              {/* Stage 1 row top */}
              <rect
                x={40}
                y={20}
                width={140}
                height={50}
                rx={8}
                fill={`${C.yellow}1a`}
                stroke={C.yellow}
                strokeWidth={1.6}
              />
              <text x={110} y={42} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                Event
              </text>
              <text x={110} y={58} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
                &quot;Failed Password Reset&quot;
              </text>

              <line x1={180} y1={45} x2={220} y2={45} stroke={C.yellow} strokeWidth={1.6} />
              <polygon points="216,42 224,42 220,38 220,52 216,48" fill={C.yellow} />

              <rect
                x={220}
                y={20}
                width={140}
                height={50}
                rx={8}
                fill={`${C.yellow}1a`}
                stroke={C.yellow}
                strokeWidth={1.6}
              />
              <text x={290} y={42} fill={SOFT.yellow} fontSize="13" fontWeight="700" textAnchor="middle">
                Embed
              </text>
              <text x={290} y={58} fill={SOFT.yellow} fontSize="11" textAnchor="middle">
                [1024 Floats]
              </text>

              <line x1={360} y1={45} x2={400} y2={45} stroke={C.yellow} strokeWidth={1.6} />
              <polygon points="396,42 404,42 400,38 400,52 396,48" fill={C.yellow} />

              <rect
                x={400}
                y={20}
                width={120}
                height={50}
                rx={8}
                fill={`${C.purple}1a`}
                stroke={C.purple}
                strokeWidth={1.6}
              />
              <text x={460} y={42} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                Vector DB
              </text>
              <text x={460} y={58} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Section 11.6 / 11.7
              </text>

              {/* Stage 2 row bottom */}
              <rect
                x={40}
                y={130}
                width={140}
                height={50}
                rx={8}
                fill={`${C.cyan}1a`}
                stroke={C.cyan}
                strokeWidth={1.6}
              />
              <text x={110} y={152} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Query
              </text>
              <text x={110} y={168} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                &quot;What Past Issues?&quot;
              </text>

              <line x1={180} y1={155} x2={220} y2={155} stroke={C.cyan} strokeWidth={1.6} />
              <polygon points="216,152 224,152 220,148 220,162 216,158" fill={C.cyan} />

              <rect
                x={220}
                y={130}
                width={140}
                height={50}
                rx={8}
                fill={`${C.cyan}1a`}
                stroke={C.cyan}
                strokeWidth={1.6}
              />
              <text x={290} y={152} fill={SOFT.cyan} fontSize="13" fontWeight="700" textAnchor="middle">
                Embed
              </text>
              <text x={290} y={168} fill={SOFT.cyan} fontSize="11" textAnchor="middle">
                Same Encoder
              </text>

              <line x1={360} y1={155} x2={400} y2={155} stroke={C.cyan} strokeWidth={1.6} />
              <polygon points="396,152 404,152 400,148 400,162 396,158" fill={C.cyan} />

              <rect
                x={400}
                y={130}
                width={120}
                height={50}
                rx={8}
                fill={`${C.purple}1a`}
                stroke={C.purple}
                strokeWidth={1.6}
              />
              <text x={460} y={152} fill={SOFT.purple} fontSize="13" fontWeight="700" textAnchor="middle">
                ANN Search
              </text>
              <text x={460} y={168} fill={SOFT.purple} fontSize="11" textAnchor="middle">
                Top-K Events
              </text>
            </svg>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            Vector storage substrate covered in Section 11.6 (IVF) / 11.7 (HNSW). Here we use it as
            the layer below episodic memory: write once, search by similarity from then on.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Recall Before Reasoning
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            When a new conversation starts, the agent retrieves relevant past episodes BEFORE
            reasoning about the current ticket. The host system fetches the top-3 events and
            injects them into the system prompt as context.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              { step: 1, label: "User Message Arrives", detail: 'T2: "I forgot my password and my email changed."' },
              { step: 2, label: "Build Recall Query", detail: 'Query = "current ticket summary + customer_id c-9924"' },
              { step: 3, label: "Retrieve Top-3 Episodes", detail: "ANN search returns 3 most similar past events." },
              { step: 4, label: "Inject Into System Prompt", detail: "Episodes added to the prompt as context block." },
              { step: 5, label: "Agent Reasons With Past Context", detail: "Past MFA-bug episode informs current approach." },
            ].map((s) => (
              <div key={`step-${s.step}`} style={{ ...tintedCard(C.orange), padding: 12 }}>
                <span style={pill(C.orange)}>{`STEP ${s.step}`}</span>
                <T color={C.orange} bold center size={14} style={{ marginTop: 8 }}>
                  {s.label}
                </T>
                <T color={SOFT.orange} center size={13} style={{ marginTop: 6 }}>
                  {s.detail}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 12 }}>
            ChatGPT Memory works similarly: the host fetches relevant facts on each new
            conversation and injects them. The model does not "remember" - the host system gives it
            the appearance of memory through retrieval-and-inject.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Event Log Entry (Shape)
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Each episode entry is a structured record. The agent does not store raw transcripts -
            it stores summaries + the tools used + the outcome + the embedding for retrieval.
          </T>

          <div style={{ ...tintedCard(C.red), padding: 14, marginTop: 14 }}>
            <T color={C.red} bold center size={14}>
              Episodic Memory Entry
            </T>
            <div
              style={{
                marginTop: 10,
                fontFamily: "monospace",
                whiteSpace: "pre",
                textAlign: "left",
                color: SOFT.red,
                fontSize: 14,
                lineHeight: 1.5,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
                padding: 14,
                display: "inline-block",
              }}
            >
              {EPISODIC_ENTRY_SHAPE}
            </div>
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            `summary` is what the model reads. `embedding` is what ANN search uses. `tools_used`
            and `outcome` let analytics ask "which past escalations involved MFA bugs?".
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Memory Has To Forget
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            Unbounded growth wrecks retrieval quality. Pruning policy decides what to keep and what
            to drop. Four rules cover most cases.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {PRUNING_POLICY_ROWS.map((r, i) => (
              <div key={`rule-${i}`} style={{ ...tintedCard(C.purple), padding: 12 }}>
                <T color={C.purple} bold center size={14}>
                  {r.condition}
                </T>
                <T color={SOFT.purple} center size={13} style={{ marginTop: 6 }}>
                  Action: {r.action}
                </T>
              </div>
            ))}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            Compliance-driven deletion is non-negotiable. A customer can request their entire
            episodic log be wiped, and the agent must honor it within whatever window the
            regulation requires.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && (
        <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}
    </div>
  );
}
