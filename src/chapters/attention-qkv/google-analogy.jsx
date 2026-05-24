import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function GoogleAnalogy(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Another way to see it - Google Search:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                step: "1",
                label: "Your search query",
                desc: '"best pizza near me"',
                role: "= Query",
                color: C.blue,
                icon: "🔍",
              },
              {
                step: "2",
                label: "Each page's keywords/tags",
                desc: '"pizza delivery NYC", "pizza recipes"...',
                role: "= Key",
                color: C.orange,
                icon: "🏷️",
              },
              {
                step: "3",
                label: "Google matches query ↔ keywords",
                desc: "finds the best-matching pages",
                role: "= Dot Product",
                color: C.yellow,
                icon: "⚡",
              },
              {
                step: "4",
                label: "Matched page's CONTENT",
                desc: "the actual text you read",
                role: "= Value",
                color: C.green,
                icon: "📦",
              },
            ].map(({ step, label, desc, role, color, icon }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <span style={{ fontSize: 26 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <T color={color} bold center size={18}>
                    {label}
                  </T>
                  <T color={C.dim} size={16}>
                    {desc}
                  </T>
                </div>
                <Tag color={color}>{role}</Tag>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            Three analogies, same concept:
          </T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>
            🎓 Classroom: question / label / notes
            <br />
            🍛 Restaurant: craving / menu description / actual food
            <br />
            🔍 Google: search query / page keywords / page content
            <br />
            <br />
            Now let's compute the full attention step by step with real numbers →
          </T>
        </Box>
      </Reveal>
      {sub < 1 && (
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
