import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function ComputeQKV(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Now let's do a FULL end-to-end computation.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            We traced "The cat sat" earlier to understand the concepts. Now we'll compute{" "}
            <strong>every single number</strong> for "I love cats" - the sentence we've been building toward since
            Chapter 1.
          </T>
          <T color="#80deea" bold center style={{ marginTop: 10 }}>
            "I love cats" - embeddings (4 dims for simplicity):
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { w: '"I"', v: "[1.0, 0.5, -0.3, 0.8]", c: C.red },
              { w: '"love"', v: "[0.2, 0.9, 0.4, -0.1]", c: C.purple },
              { w: '"cats"', v: "[-0.5, 0.3, 0.7, 0.6]", c: C.cyan },
            ].map(({ w, v, c }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 42 }}>{w}</span>
                <code style={{ color: `${c}aa`, fontSize: 16 }}>{v}</code>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            The three weight matrices (learned during training):
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
            Each is a 4×2 grid. Same matrix is used for all words. The different outputs come from different input
            embeddings.
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                name: "W_Q",
                c: C.blue,
                rows: [
                  [0.15, -0.03],
                  [0.12, 0.78],
                  [0.1, 0.51],
                  [0.78, -0.01],
                ],
              },
              {
                name: "W_K",
                c: C.orange,
                rows: [
                  [-0.12, 0.16],
                  [0.51, 0.37],
                  [0.5, 0.22],
                  [0.39, 0.53],
                ],
              },
              {
                name: "W_V",
                c: C.green,
                rows: [
                  [0.59, -0.49],
                  [0.32, 0.64],
                  [-0.21, 0.77],
                  [0.24, -0.13],
                ],
              },
            ].map(({ name, c, rows }) => (
              <div
                key={name}
                style={{ padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}
              >
                <T color={c} bold center size={16}>
                  {name} (4×2)
                </T>
                <div
                  style={{
                    marginTop: 4,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                    maxWidth: 160,
                    margin: "4px auto 0",
                  }}
                >
                  {rows.flat().map((v, i) => (
                    <div
                      key={i}
                      style={{ textAlign: "center", padding: "2px 4px", borderRadius: 3, background: `${c}08` }}
                    >
                      <code style={{ color: `${c}aa`, fontSize: 14 }}>{v.toFixed(2)}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>
            These numbers were nudged by training over millions of examples. Each matrix learned to extract a different
            "aspect" of meaning.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center>
            Let's multiply "I"'s embedding by all three matrices:
          </T>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>
            "I" = [1.0, 0.5, -0.3, 0.8]. Each dim of the embedding multiplies the corresponding row of W, then we sum.
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                name: "W_Q",
                c: C.blue,
                col1: [0.15, 0.12, 0.1, 0.78],
                col2: [-0.03, 0.78, 0.51, -0.01],
                calc1: "(1.0 x 0.15) + (0.5 x 0.12) + (-0.3 x 0.10) + (0.8 x 0.78)",
                r1: "0.8",
                calc2: "(1.0 x -0.03) + (0.5 x 0.78) + (-0.3 x 0.51) + (0.8 x -0.01)",
                r2: "0.2",
                result: "[0.8, 0.2]",
              },
              {
                name: "W_K",
                c: C.orange,
                col1: [-0.12, 0.51, 0.5, 0.39],
                col2: [0.16, 0.37, 0.22, 0.53],
                calc1: "(1.0 x -0.12) + (0.5 x 0.51) + (-0.3 x 0.50) + (0.8 x 0.39)",
                r1: "0.3",
                calc2: "(1.0 x 0.16) + (0.5 x 0.37) + (-0.3 x 0.22) + (0.8 x 0.53)",
                r2: "0.7",
                result: "[0.3, 0.7]",
              },
              {
                name: "W_V",
                c: C.green,
                col1: [0.59, 0.32, -0.21, 0.24],
                col2: [-0.49, 0.64, 0.77, -0.13],
                calc1: "(1.0 x 0.59) + (0.5 x 0.32) + (-0.3 x -0.21) + (0.8 x 0.24)",
                r1: "1.0",
                calc2: "(1.0 x -0.49) + (0.5 x 0.64) + (-0.3 x 0.77) + (0.8 x -0.13)",
                r2: "-0.5",
                result: "[1.0, -0.5]",
              },
            ].map(({ name, c, calc1, r1, calc2, r2, result }) => (
              <div
                key={name}
                style={{ padding: "8px 10px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}
              >
                <T color={c} bold size={16}>
                  "I" x {name}:
                </T>
                <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, paddingLeft: 8 }}>
                  <T color={C.dim} size={14}>
                    dim 1: {calc1} = <strong style={{ color: c }}>{r1}</strong>
                  </T>
                  <T color={C.dim} size={14}>
                    dim 2: {calc2} = <strong style={{ color: c }}>{r2}</strong>
                  </T>
                </div>
                <T color={c} bold center size={16} style={{ marginTop: 4 }}>
                  {name === "W_Q" ? "Q" : name === "W_K" ? "K" : "V"}_I = {result}
                </T>
              </div>
            ))}
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            "love" and "cats" go through the exact same three matrices - different embeddings in, different Q/K/V out.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            After multiplying by W_Q, W_K, W_V:
          </T>
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr", gap: 6 }}>
              <div></div>
              <T color={C.blue} bold size={16} center>
                Query
              </T>
              <T color={C.orange} bold size={16} center>
                Key
              </T>
              <T color={C.green} bold size={16} center>
                Value
              </T>
              {[
                { w: '"I"', q: "[0.8, 0.2]", k: "[0.3, 0.7]", v: "[1.0, -0.5]", c: C.red },
                { w: '"love"', q: "[0.1, 0.9]", k: "[0.6, 0.4]", v: "[0.3, 0.8]", c: C.purple },
                { w: '"cats"', q: "[0.5, 0.6]", k: "[0.8, 0.5]", v: "[-0.2, 0.9]", c: C.cyan },
              ].map(({ w, q, k, v, c }) => (
                <div key={w} style={{ display: "contents" }}>
                  <span style={{ color: c, fontWeight: 700, fontSize: 16 }}>{w}</span>
                  <div style={{ background: `${C.blue}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}>
                    <code style={{ color: C.blue, fontSize: 16 }}>{q}</code>
                  </div>
                  <div style={{ background: `${C.orange}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}>
                    <code style={{ color: C.orange, fontSize: 16 }}>{k}</code>
                  </div>
                  <div style={{ background: `${C.green}08`, borderRadius: 4, padding: "4px", textAlign: "center" }}>
                    <code style={{ color: C.green, fontSize: 16 }}>{v}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>
            Q and K are 2D (compressed from 4D). In real models: 64D from 512D.
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
