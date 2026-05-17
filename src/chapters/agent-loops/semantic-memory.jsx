import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { SOFT, tintedCard, pill, DIM_BG, DIM_BORDER } from "../../shared/agent-styles.jsx";

const PROFILE_CARD_SHAPE = `{
  "customer_id": "c-9924",
  "tier": "Pro",
  "signed_up": "2024-08",
  "preferred_contact": "email",
  "primary_email": "alice@example.com",
  "billing_currency": "USD",
  "preferences": { "skip_onboarding_emails": true }
}`;

const PROFILE_GROWTH = [
  {
    day: "Day 1 (Signup)",
    color: "amber",
    fields: ["customer_id: c-9924", "tier: Pro", "signed_up: 2024-08", "primary_email: alice@example.com"],
  },
  {
    day: "Day 30",
    color: "yellow",
    fields: ["(All Day-1 Fields)", "+ preferred_contact: email", 'Learned From: "Please Email Me At..."'],
  },
  {
    day: "Day 90",
    color: "orange",
    fields: ["(All Day-30 Fields)", "+ preferences.skip_onboarding_emails: true", "Learned From: User Opt-Out Click."],
  },
];

const SEMANTIC_WRITE_VS_IGNORE = [
  {
    bucket: "Write To Semantic",
    color: "green",
    items: [
      "Stable Preferences (Always Email).",
      "Confirmed Identity (Alice Is Account Owner).",
      "Constraints (Dairy Allergy).",
    ],
  },
  {
    bucket: "Do Not Write",
    color: "red",
    items: [
      'Transient Mood ("Frustrated Today").',
      'One-Time Requests ("Send A Copy This Once").',
      "Guesses (Uncertain Inferences).",
    ],
  },
];

export default function SemanticMemory(ctx) {
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
            Facts I Know About You
          </T>
          <T color={SOFT.amber} center size={16} style={{ marginTop: 10 }}>
            Semantic memory holds stable facts about a customer. Different from episodic memory: an episode is "this
            happened on this date"; a fact is "this is currently true".
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.yellow), padding: 14 }}>
              <span style={pill(C.yellow)}>EPISODIC FACT</span>
              <T color={C.yellow} bold center size={15} style={{ marginTop: 10 }}>
                Time-Stamped Event
              </T>
              <T color={SOFT.yellow} center size={13} style={{ marginTop: 8 }}>
                On 2026-03-04, Alice Opened A Ticket About A Password Reset.
              </T>
            </div>

            <div style={{ ...tintedCard(C.amber), padding: 14 }}>
              <span style={pill(C.amber)}>SEMANTIC FACT</span>
              <T color={C.amber} bold center size={15} style={{ marginTop: 10 }}>
                Stable State
              </T>
              <T color={SOFT.amber} center size={13} style={{ marginTop: 8 }}>
                Alice Prefers Email Contact.
              </T>
            </div>
          </div>

          <T color={SOFT.amber} center size={15} style={{ marginTop: 14 }}>
            Same person, different memory layer. Episodic answers "what happened?", semantic answers "what is true?".
            Both are needed; they live in different stores with different update rules.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            The Customer Profile Card
          </T>
          <T color={SOFT.yellow} center size={16} style={{ marginTop: 10 }}>
            Each customer has a profile card. Stable fields, queried by exact key, updated on confirmed observations.
            Here is Alice&apos;s.
          </T>

          <div style={{ ...tintedCard(C.yellow), padding: 14, marginTop: 14 }}>
            <T color={C.yellow} bold center size={14}>
              Semantic Memory (Shape) - Customer Profile
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
              {PROFILE_CARD_SHAPE}
            </div>
          </div>

          <T color={SOFT.yellow} center size={15} style={{ marginTop: 12 }}>
            `customer_id` is the join key. `tier`, `preferred_contact`, `billing_currency` are typed fields the agent
            can query directly. `preferences` is a nested bag for arbitrarily-shaped opt-ins.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Key-Value Or Vector
          </T>
          <T color={SOFT.orange} center size={16} style={{ marginTop: 10 }}>
            Two storage substrates serve different fact shapes. Most production agents use BOTH: structured for the
            spine, vector for the long-tail freetext.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div style={{ ...tintedCard(C.cyan), padding: 14 }}>
              <span style={pill(C.cyan)}>STRUCTURED</span>
              <T color={C.cyan} bold center size={15} style={{ marginTop: 10 }}>
                Key-Value / Postgres
              </T>
              <T color={SOFT.cyan} center size={13} style={{ marginTop: 8 }}>
                Use When Fields Are Typed, Predictable, Queried By Exact Match.
              </T>
              <T color={SOFT.cyan} center size={12} style={{ marginTop: 8 }}>
                Example: customer_id -&gt; Profile Lookup.
              </T>
            </div>

            <div style={{ ...tintedCard(C.purple), padding: 14 }}>
              <span style={pill(C.purple)}>VECTOR</span>
              <T color={C.purple} bold center size={15} style={{ marginTop: 10 }}>
                Embedding + Similarity
              </T>
              <T color={SOFT.purple} center size={13} style={{ marginTop: 8 }}>
                Use When Facts Are Free-Text, Queried By Meaning.
              </T>
              <T color={SOFT.purple} center size={12} style={{ marginTop: 8 }}>
                Example: &quot;User Has A Dairy Allergy&quot; Embedded For Retrieval.
              </T>
            </div>
          </div>

          <T color={SOFT.orange} center size={15} style={{ marginTop: 14 }}>
            The spine (typed profile) is small and exact. The long-tail (free-form preferences and constraints) is large
            and fuzzy. Use the right tool for each shape.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            How The Profile Fills Up
          </T>
          <T color={SOFT.red} center size={16} style={{ marginTop: 10 }}>
            Semantic memory grows over time. Alice&apos;s profile at signup has 4 fields. By day 30 it has 5. By day 90
            it has nested preferences. Growth comes from confirmed observations.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {PROFILE_GROWTH.map((g) => {
              const accent = C[g.color];
              const soft = SOFT[g.color];
              return (
                <div key={g.day} style={{ ...tintedCard(accent), padding: 12 }}>
                  <span style={pill(accent)}>{g.day.toUpperCase()}</span>
                  <div
                    style={{
                      marginTop: 8,
                      fontFamily: "monospace",
                      whiteSpace: "pre",
                      textAlign: "left",
                      color: soft,
                      fontSize: 13,
                      lineHeight: 1.5,
                      display: "inline-block",
                    }}
                  >
                    {g.fields.join("\n")}
                  </div>
                </div>
              );
            })}
          </div>

          <T color={SOFT.red} center size={15} style={{ marginTop: 12 }}>
            Profile fills only on CONFIRMED observations. A guess from one ambiguous message does not get written. A
            repeated preference observed across sessions does.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            What Counts As A Fact?
          </T>
          <T color={SOFT.purple} center size={16} style={{ marginTop: 10 }}>
            The rule of thumb: if it would still be true in 6 months, write it to semantic memory. Otherwise leave it in
            the working scratchpad or skip it entirely.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {SEMANTIC_WRITE_VS_IGNORE.map((b) => {
              const accent = C[b.color];
              const soft = SOFT[b.color];
              return (
                <div key={b.bucket} style={{ ...tintedCard(accent), padding: 14 }}>
                  <span style={pill(accent)}>{b.bucket.toUpperCase()}</span>
                  <T color={accent} bold center size={15} style={{ marginTop: 10 }}>
                    {b.bucket}
                  </T>
                  <ul style={{ marginTop: 8, paddingLeft: 18, textAlign: "left" }}>
                    {b.items.map((it, i) => (
                      <li key={i} style={{ color: soft, fontSize: 13, marginBottom: 4 }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <T color={SOFT.purple} center size={15} style={{ marginTop: 14 }}>
            6-Months Test: would knowing this still help six months from now? If yes, write it. If no, it belongs in
            working memory or the chat history and should expire naturally.
          </T>
        </Box>
      </Reveal>

      {sub < 4 && <SubBtn onClick={onContinue} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />}
    </div>
  );
}
