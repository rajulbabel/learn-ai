import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingCompute(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const d = 8;
  const computeRow = (pos) => {
    const vals = [];
    for (let i = 0; i < d; i++) {
      const di = Math.floor(i / 2) * 2;
      const div = Math.pow(10000, di / d);
      const angle = pos / div;
      vals.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
    }
    return vals;
  };
  const rows = [
    { pos: 0, word: "I", c: C.red, vals: computeRow(0) },
    { pos: 1, word: "love", c: C.purple, vals: computeRow(1) },
    { pos: 2, word: "cats", c: C.cyan, vals: computeRow(2) },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <T center color={C.mid} size={18}>
          Using 8 dimensions (real model uses 512, same idea). Actual computed values:
        </T>
      )}
      {sub >= 0 && (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "12px 8px",
            width: "100%",
            overflowX: "auto",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 2, marginBottom: 6 }}>
            <span></span>
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: i < 2 ? C.yellow : i < 4 ? C.orange : i < 6 ? C.cyan : C.purple,
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                d{i} {i % 2 === 0 ? "sin" : "cos"}
              </span>
            ))}
          </div>
          {rows.map(({ pos, word, c, vals }, ri) => (
            <div
              key={pos}
              style={{
                display: "grid",
                gridTemplateColumns: "60px repeat(8, 1fr)",
                gap: 2,
                padding: "4px 0",
                borderRadius: 4,
                background: `${c}06`,
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>
                Pos {pos} ({word})
              </span>
              {vals.map((v, i) => {
                const prev = ri > 0 ? rows[ri - 1].vals[i] : null;
                const change = prev !== null ? Math.abs(v - prev) : 0;
                return (
                  <span
                    key={i}
                    style={{
                      fontFamily: "monospace",
                      fontSize: 14,
                      textAlign: "center",
                      color: change > 0.2 ? C.yellow : `${c}bb`,
                      fontWeight: change > 0.2 ? 700 : 400,
                    }}
                  >
                    {v.toFixed(3)}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow}>
          <T color={C.yellow} bold center>
            Yellow values = big change between positions.
          </T>
          <T color="#ffe082">
            Left columns (d0, d1) change dramatically. Right columns (d6, d7) barely move. Each position has a unique
            fingerprint.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            Position 0: all sin(0)=0, cos(0)=1 → clean [0, 1, 0, 1, 0, 1, 0, 1]
          </T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>
            Position 1: d0 jumps 0→0.841 (fast!), d6 barely moves 0→0.001 (slow!)
          </T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>
            Position 2: d0 goes 0.841→0.909, d6 goes 0.001→0.002
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
