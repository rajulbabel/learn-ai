import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function SoftmaxProbs(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>
            Let's apply softmax step-by-step
          </T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>
            We have scaled scores for "I" looking at each word: <strong>[0.27, 0.40, 0.52]</strong>
          </T>
          {/* Visual: the formula applied */}
          <div
            style={{
              margin: "12px 0",
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.pink}20`,
            }}
          >
            <T
              color={C.dim}
              size={13}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}
            >
              Step 1: e^score for each
            </T>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {[
                { w: "I", s: 0.27, e: 1.31 },
                { w: "love", s: 0.4, e: 1.49 },
                { w: "cats", s: 0.52, e: 1.68 },
              ].map(({ w, s, e }) => (
                <div key={w} style={{ textAlign: "center", flex: 1 }}>
                  <T color={C.dim} size={12} center>
                    {w}
                  </T>
                  <div style={{ padding: "4px", borderRadius: 4, background: `${C.pink}08`, margin: "4px 0" }}>
                    <T color={C.mid} size={15} center>
                      e^{s}
                    </T>
                  </div>
                  <T color={C.dim} size={14} center>
                    ↓
                  </T>
                  <div style={{ padding: "6px", borderRadius: 6, background: `${C.pink}12` }}>
                    <T color={C.pink} bold center size={20}>
                      {e}
                    </T>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T
              color={C.dim}
              size={13}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
            >
              Step 2: Sum all e^scores
            </T>
            <T color={C.yellow} bold center size={20}>
              1.31 + 1.49 + 1.68 = 4.48
            </T>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T
              color={C.dim}
              size={13}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
            >
              Step 3: Divide each by sum
            </T>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[
                { w: "I", e: 1.31, p: "0.29" },
                { w: "love", e: 1.49, p: "0.33" },
                { w: "cats", e: 1.68, p: "0.37" },
              ].map(({ w, e, p }) => (
                <div
                  key={w}
                  style={{
                    textAlign: "center",
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: 8,
                    background: `${C.green}06`,
                  }}
                >
                  <T color={C.dim} size={12} center>
                    {w}
                  </T>
                  <T color={C.dim} size={14} center>
                    {e} / 4.48
                  </T>
                  <T color={C.green} bold center size={22}>
                    {p}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.green} bold center size={16} style={{ marginTop: 6 }}>
              0.29 + 0.33 + 0.37 = 1.0 ✓
            </T>
          </div>
        </Box>
      )}

      {/* Sub 1: Meaning - what the numbers tell us */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            What do these numbers mean?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            When the word "I" looks at the sentence "I love cats":
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { w: "I → I", pct: 29, c: C.cyan, note: "29% attention to itself" },
              { w: "I → love", pct: 33, c: C.orange, note: '33% attention to "love"' },
              { w: "I → cats", pct: 37, c: C.yellow, note: '37% attention to "cats" (most relevant!)' },
            ].map(({ w, pct, c, note }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.dim, fontSize: 14, minWidth: 60 }}>{w}</span>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 7,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 7,
                      background: `linear-gradient(90deg, ${c}80, ${c})`,
                      transition: "width 0.4s",
                    }}
                  />
                </div>
                <span style={{ color: c, fontWeight: 700, fontSize: 17, minWidth: 32 }}>{pct}%</span>
                <T color={C.dim} size={13}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>
            These scores are close because our 2-dim example is tiny. In a real 512-dim model, the differences would be
            much sharper.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Full attention weight matrix */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Full attention weight matrix (all rows softmax'd)
          </T>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>
            Every word does the same process - softmax its own row of scores:
          </T>
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "70px repeat(3, 1fr)", gap: 4 }}>
              <div></div>
              {["I", "love", "cats"].map((h) => (
                <T key={h} color={C.mid} size={16} bold center>
                  {h}
                </T>
              ))}
              {[
                { w: '"I":', s: [0.29, 0.33, 0.38], mx: 2 },
                { w: '"love":', s: [0.36, 0.31, 0.33], mx: 0 },
                { w: '"cats":', s: [0.32, 0.32, 0.36], mx: 2 },
              ].map(({ w, s: sc, mx }) => (
                <div key={w} style={{ display: "contents" }}>
                  <T color={C.mid} size={14} bold center>
                    {w}
                  </T>
                  {sc.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign: "center",
                        padding: "6px",
                        borderRadius: 5,
                        background: i === mx ? `${C.yellow}12` : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 19,
                          color: i === mx ? C.yellow : C.mid,
                          fontWeight: i === mx ? 700 : 400,
                        }}
                      >
                        {v.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>
            Each row sums to 1.0. These are the "attention weights" - they tell each word how much to borrow from every
            other word. Next: we'll use them to actually blend the Values →
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
