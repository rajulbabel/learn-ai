import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WordLookup(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, hovered, setHovered } = ctx;
  const words = ["The", "cat", "sat", "because", "it", "was", "tired"];
  const scores = {
    0: [0.1, 0.3, 0.2, 0.1, 0.05, 0.15, 0.1],
    1: [0.15, 0.1, 0.35, 0.05, 0.1, 0.15, 0.1],
    2: [0.05, 0.4, 0.05, 0.1, 0.1, 0.2, 0.1],
    3: [0.05, 0.1, 0.15, 0.05, 0.25, 0.15, 0.25],
    4: [0.05, 0.55, 0.1, 0.05, 0.05, 0.1, 0.1],
    5: [0.05, 0.2, 0.1, 0.05, 0.3, 0.05, 0.25],
    6: [0.05, 0.35, 0.05, 0.1, 0.15, 0.2, 0.1],
  };
  const curScores = scores[hovered] || [];
  const maxScore = Math.max(...curScores);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            Think about how YOU read.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            When you see "it" in a sentence, your brain scans for what "it" refers to. You focus on{" "}
            <strong>nouns</strong>, not every word equally. Attention does the same thing - computes a{" "}
            <strong>relevance score</strong> for every other word.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div
          style={{
            background: C.card,
            borderRadius: 10,
            padding: "14px",
            border: `1px solid ${C.border}`,
            width: "100%",
          }}
        >
          <T color={C.dim} size={14} center style={{ marginBottom: 8 }}>
            Click any word to see what it attends to:
          </T>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
            {words.map((w, i) => (
              <span
                key={i}
                onClick={() => setHovered(i)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: i === hovered ? `${C.purple}20` : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${i === hovered ? C.purple : "rgba(255,255,255,0.06)"}`,
                  color: i === hovered ? C.purple : C.mid,
                  fontSize: 21,
                  fontWeight: i === hovered ? 700 : 500,
                }}
              >
                {w}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {words.map((w, i) => {
              const score = curScores[i] || 0;
              const isMax = score === maxScore;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      minWidth: 70,
                      fontSize: 18,
                      color: isMax ? C.yellow : C.dim,
                      fontWeight: isMax ? 700 : 400,
                      textAlign: "right",
                    }}
                  >
                    {w}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 14,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${score * 100}%`,
                        height: "100%",
                        borderRadius: 4,
                        background: isMax ? `linear-gradient(90deg, ${C.yellow}, ${C.orange})` : `${C.purple}40`,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      color: isMax ? C.yellow : C.dim,
                      fontWeight: isMax ? 700 : 400,
                      minWidth: 30,
                    }}
                  >
                    {(score * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
          <T color={C.dim} size={14} center style={{ marginTop: 8 }}>
            When "it" is selected → "cat" gets 55%. The model figures out "it" = "cat".
          </T>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan}>
          <T color="#80deea" bold center>
            But how do we compute these scores mathematically?
          </T>
          <T color="#80deea">
            We need a tool for measuring "relevance" between two vectors. Enter: the <strong>dot product</strong> →
          </T>
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
