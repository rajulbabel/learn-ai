import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function QKVClassroom(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Imagine a classroom. 30 students.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Student <strong>Riya</strong> has a question: "who has yesterday's notes?"
            <br />
            She looks around at everyone.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div
          style={{
            background: C.card,
            borderRadius: 12,
            padding: "14px",
            border: `1px solid ${C.border}`,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Riya */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px",
                borderRadius: 8,
                background: `${C.blue}10`,
                border: `1px solid ${C.blue}25`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `${C.blue}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                👩‍🎓
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <T color={C.blue} bold size={19}>
                    Riya's Question <Tag color={C.blue}>= Query</Tag>
                  </T>
                </div>
                <T color={C.dim} size={16}>
                  "Who has yesterday's notes?"
                </T>
              </div>
            </div>
            {/* Other students */}
            {[
              { name: "Priya", label: "I know the homework", match: false },
              { name: "Aman", label: "I have yesterday's notes", match: true },
              { name: "Rahul", label: "I know the canteen menu", match: false },
            ].map(({ name, label, match }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: 8,
                  background: match ? `${C.green}08` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${match ? `${C.green}25` : "rgba(255,255,255,0.05)"}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: match ? `${C.orange}20` : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    flexShrink: 0,
                  }}
                >
                  🧑‍🎓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <T color={match ? C.orange : C.dim} bold center size={18}>
                      {name}'s label <Tag color={C.orange}>= Key</Tag>
                    </T>
                  </div>
                  <T color={C.dim} size={16}>
                    "{label}"
                  </T>
                </div>
                <span style={{ fontSize: 18, color: match ? C.green : C.red, fontWeight: 700 }}>
                  {match ? "✓ MATCH" : "✗"}
                </span>
              </div>
            ))}
            {/* Aman hands over notes */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}08`,
                border: `1px solid ${C.green}25`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `${C.green}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                📦
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <T color={C.green} bold size={19}>
                    Aman hands over the actual notes <Tag color={C.green}>= Value</Tag>
                  </T>
                </div>
                <T color={C.dim} size={16}>
                  Physics equations, dates, diagrams - the real content
                </T>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Mapping to attention:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                left: "Riya's question",
                leftSub: "who has the notes?",
                right: "Query",
                rightSub: '"what am I looking for?"',
                color: C.blue,
                icon: "🔍",
              },
              {
                left: "Each student's label",
                leftSub: "what they can help with",
                right: "Key",
                rightSub: '"what can I be found for?"',
                color: C.orange,
                icon: "🏷️",
              },
              {
                left: "Notes handed over",
                leftSub: "the actual content",
                right: "Value",
                rightSub: '"here\'s my actual info"',
                color: C.green,
                icon: "📦",
              },
            ].map(({ left, leftSub, right, rightSub, color, icon }) => (
              <div
                key={left}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 36px 1fr",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div style={{ textAlign: "right", paddingRight: 8 }}>
                  <div style={{ color: C.mid, fontWeight: 600, fontSize: 18 }}>{left}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{leftSub}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    fontSize: 20,
                  }}
                >
                  {icon}
                </div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 19 }}>{right}</div>
                  <div style={{ color: C.dim, fontSize: 14, marginTop: 2 }}>{rightSub}</div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      {sub < 2 && (
        <SubBtn
          key={sub}
          onClick={() => {
            setSubBtnRipple(Date.now());
            navigate("forward");
          }}
          rippleKey={subBtnRipple}
          registerSubBtn={registerSubBtn}
        />
      )}
    </div>
  );
}
