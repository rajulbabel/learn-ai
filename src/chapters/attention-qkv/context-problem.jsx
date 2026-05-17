import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function ContextProblem(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate, bankIdx, setBankIdx } = ctx;
  const sentences = [
    {
      words: ["I", "sat", "by", "the", "river", "bank"],
      highlight: 5,
      context: [1, 2, 4],
      meaning: "edge of a river",
      color: C.cyan,
    },
    {
      words: ["I", "deposited", "money", "in", "the", "bank"],
      highlight: 5,
      context: [1, 2],
      meaning: "financial institution",
      color: C.yellow,
    },
  ];
  const s = sentences[bankIdx];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Words alone are meaningless. Context is everything.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            After embedding, every instance of the same word gets the <strong>exact same vector</strong>. But the same
            word can mean completely different things depending on surrounding words.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setBankIdx(i)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${sentences[i].color}${bankIdx === i ? "60" : "20"}`,
                  background: bankIdx === i ? `${sentences[i].color}15` : "transparent",
                  color: sentences[i].color,
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sentence {i + 1}
              </button>
            ))}
          </div>
          <div
            style={{
              background: C.card,
              borderRadius: 10,
              padding: "14px",
              border: `1px solid ${C.border}`,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
              {s.words.map((w, i) => {
                const hl = i === s.highlight;
                const ctx = s.context.includes(i);
                return (
                  <span
                    key={i}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 21,
                      fontWeight: hl ? 800 : 500,
                      background: hl ? `${s.color}20` : ctx ? `${C.green}10` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${hl ? `${s.color}50` : ctx ? `${C.green}25` : "rgba(255,255,255,0.05)"}`,
                      color: hl ? s.color : ctx ? C.green : C.mid,
                      transition: "all 0.3s",
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              {s.context.map((ci, i) => (
                <span key={i} style={{ color: C.green, fontSize: 16 }}>
                  {s.words[ci]}{" "}
                </span>
              ))}
              <span style={{ color: C.dim, fontSize: 16 }}> → tells us "bank" means:</span>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                background: `${s.color}10`,
                borderRadius: 8,
                border: `1px solid ${s.color}25`,
              }}
            >
              <T color={s.color} bold center size={21}>
                "{s.meaning}"
              </T>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            This isn't just about "bank" - it's about every word.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The model has a big dictionary (learned during training) that maps every word to a fixed list of numbers.
            Take "love": after embedding, "love" always gets the same numbers, no matter what sentence it's in. But
            "love" in "I love cats" is different from "love" in "love is blind."
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            These numbers capture the word's meaning <strong>in isolation</strong>. It has no idea what words are around
            it. That's a problem - because we need context.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The <strong>goal</strong>: take "love" = [0.2, 0.9, 0.4, -0.1] and transform it into a <strong>NEW</strong>{" "}
            list of numbers that represents "love in the context of I and cats."
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center>
            This is what Attention solves.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            It lets each word <strong>look around</strong> at the other words and ask{" "}
            <strong>"which other words are relevant to me?"</strong> and then absorb context - absorbing information
            from the relevant ones. After attention: "love" in "I love cats" absorbs info from "I" and "cats" → now
            represents <strong>"affection from me toward cats"</strong>. Same input vector, different output vector
            depending on context.
          </T>
        </Box>
      </Reveal>
      {sub < 3 && (
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
