import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function InsideEachHead(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Each head runs the FULL attention algorithm.
          </T>
          <T color={C.dim} size={18} style={{ marginTop: 4 }}>
            Exactly Steps 1–5 we learned, but in 64 dims instead of 512:
          </T>
          <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.dim} size={16} style={{ fontFamily: "monospace", lineHeight: 2.2 }}>
              <strong style={{ color: C.blue }}>For Head 1:</strong>
              <br />
              &nbsp;&nbsp;Q₁ = embedding × W_Q₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
              <br />
              &nbsp;&nbsp;K₁ = embedding × W_K₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
              <br />
              &nbsp;&nbsp;V₁ = embedding × W_V₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
              <br />
              <br />
              &nbsp;&nbsp;scores₁ = Q₁ · K₁ᵀ / √64 <span style={{ color: C.dim }}>[3×3 score matrix]</span>
              <br />
              &nbsp;&nbsp;weights₁ = softmax(scores₁) <span style={{ color: C.dim }}>[3×3 attention weights]</span>
              <br />
              &nbsp;&nbsp;output₁ = weights₁ × V₁ <span style={{ color: C.dim }}>[3 words × 64 dims]</span>
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>
            Same runs for all 8 heads. Each produces [3 words × 64 dims].
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center>
            The KEY: each head's attention weights are different.
          </T>
          <T color={C.dim} size={18} style={{ marginTop: 4 }}>
            Because their W_Q, W_K, W_V are different. Here's what "sat" sees in each head:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                head: 1,
                label: "Subject to Verb",
                c: C.cyan,
                bars: [
                  { w: "cat", p: 70 },
                  { w: "mat", p: 8 },
                  { w: "week", p: 5 },
                  { w: "others", p: 17 },
                ],
              },
              {
                head: 2,
                label: "Verb to Location",
                c: C.orange,
                bars: [
                  { w: "cat", p: 10 },
                  { w: "mat", p: 65 },
                  { w: "week", p: 8 },
                  { w: "others", p: 17 },
                ],
              },
              {
                head: 3,
                label: "Temporal",
                c: C.purple,
                bars: [
                  { w: "cat", p: 8 },
                  { w: "mat", p: 7 },
                  { w: "week", p: 55 },
                  { w: "others", p: 30 },
                ],
              },
            ].map(({ head, label, c, bars }) => (
              <div
                key={head}
                style={{ padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}
              >
                <T color={c} bold center size={16}>
                  Head {head} - "sat" attends to: ({label})
                </T>
                <div style={{ marginTop: 6 }}>
                  {bars.map(({ w, p }) => (
                    <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, color: C.dim, minWidth: 40 }}>{w}</span>
                      <div
                        style={{
                          flex: 1,
                          height: 7,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{ width: `${p}%`, height: "100%", borderRadius: 4, background: p > 30 ? c : `${c}40` }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: p > 30 ? c : C.dim,
                          fontWeight: p > 30 ? 700 : 400,
                          minWidth: 24,
                        }}
                      >
                        {p}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>
            Each head found what the single head missed. Head 3 got "last week" at 55% - single head only gave it 5%.
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
