import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Embeddings(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red}>
          <T color="#ff8a80" bold center>
            Problem: Neural networks only do math on numbers, not words.
          </T>
          <T color="#ff8a80">We need 3 stages to convert words → numbers the network can use:</T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center>
            Stage 1: Tokenization
          </T>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div
              style={{ padding: "5px 12px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}25` }}
            >
              <T color={C.red} size={19} bold center>
                "I love cats"
              </T>
            </div>
            <T color={C.dim} size={26}>
              →
            </T>
            {["I", "love", "cats"].map((t, i) => (
              <div
                key={i}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: `${C.purple}12`,
                  border: `1px solid ${C.purple}25`,
                }}
              >
                <T color={C.purple} size={18} bold center>
                  "{t}"
                </T>
              </div>
            ))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>
            Real LLMs: "unbelievable" → ["un", "believ", "able"]
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            Stage 2: Token → ID (vocabulary lookup)
          </T>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            {[
              { t: '"I"', id: 4 },
              { t: '"love"', id: 6 },
              { t: '"cats"', id: 2 },
            ].map(({ t, id }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.purple, fontSize: 18 }}>{t}</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <span
                  style={{
                    color: C.green,
                    fontWeight: 700,
                    fontSize: 20,
                    background: `${C.green}12`,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {id}
                </span>
              </div>
            ))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>
            These IDs are arbitrary - the number 6 doesn't "mean" love yet.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Stage 3: ID → Embedding (the KEY step)
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Each ID looks up a row in a learned matrix. Each row = 512 numbers representing that word's meaning.
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { w: '"I"', c: C.red, v: "[ 0.12, -0.34, 0.78, ..., 0.91]" },
              { w: '"love"', c: C.purple, v: "[ 0.56,  0.23, -0.11, ..., 0.53]" },
              { w: '"cats"', c: C.cyan, v: "[-0.45,  0.89,  0.33, ..., 0.67]" },
            ].map(({ w, c, v }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 40 }}>{w}</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <code style={{ color: `${c}aa`, fontSize: 14 }}>{v}</code>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 6 }}>
            Similar words (cat/dog) get similar vectors. Learned during training.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            ✅ Words are now 512-number vectors!
          </T>
          <T color="#80e8a5" center size={18}>
            But still no position info. "I love cats" = "cats love I". That's a problem.
          </T>
        </Box>
      </Reveal>
      {sub < 4 && (
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
