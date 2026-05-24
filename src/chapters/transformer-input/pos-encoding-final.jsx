import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingFinal(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const emb = [0.56, 0.23, -0.11, 0.42, 0.88, -0.33, 0.71, 0.53];
  const pe = [0.841, 0.54, 0.1, 0.995, 0.01, 1.0, 0.001, 1.0];
  const final_ = emb.map((e, i) => (e + pe[i]).toFixed(2));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            The addition for "love" at position 1:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Embedding", color: C.purple, vals: emb.map((v) => v.toFixed(3)) },
              { op: "+" },
              { label: "Pos Enc (pos=1)", color: C.green, vals: pe.map((v) => v.toFixed(3)) },
              { op: "=" },
              { label: "Final Vector", color: C.yellow, vals: final_, bold: true },
            ].map((row, i) =>
              row.op ? (
                <div key={i} style={{ padding: "4px 0", display: "flex", justifyContent: "center" }}>
                  <span style={{ color: row.op === "+" ? C.green : C.yellow, fontWeight: 800, fontSize: 22 }}>
                    {row.op}
                  </span>
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    width: "100%",
                    padding: "6px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: row.color,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    {row.label}
                  </span>
                  <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                    {row.vals.map((v, j) => (
                      <span
                        key={j}
                        style={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          textAlign: "center",
                          padding: "4px 6px",
                          borderRadius: 5,
                          minWidth: 48,
                          color: row.bold ? row.color : `${row.color}cc`,
                          fontWeight: row.bold ? 700 : 500,
                          background: row.bold ? `${row.color}18` : `${row.color}08`,
                          border: `1px solid ${row.bold ? `${row.color}30` : `${row.color}12`}`,
                        }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            This vector now carries BOTH:
          </T>
          <T color="#80e8a5">
            ✅ <strong style={{ color: C.purple }}>Meaning</strong> - it mostly represents "love" (embedding dominates)
            <br />✅ <strong style={{ color: C.green }}>Position</strong> - nudged slightly to encode "I'm at position
            1"
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            4 reasons this design is genius:
          </T>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: "1", t: "Bounded", d: "sin/cos always between -1 and +1. Never explodes." },
              { n: "2", t: "Unique", d: "Every position gets a unique pattern across 512 dims." },
              {
                n: "3",
                t: "Relative distances",
                d: "sin(a+b) = linear combo of sin(a),cos(a). Model can learn relative positions.",
              },
              {
                n: "4",
                t: "Generalizes",
                d: "Works for longer sequences than seen in training - sin/cos are smooth and continuous.",
              },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 8px" }}>
                <span style={{ color: C.purple, fontWeight: 800, fontSize: 18 }}>{n}.</span>
                <T color={C.mid} size={16}>
                  <strong style={{ color: C.purple }}>{t}</strong> - {d}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            ✅ This is what enters the Transformer layers.
          </T>
          <T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>
            Each word now carries both <strong>meaning</strong> and <strong>position</strong>. Ready for attention.
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
