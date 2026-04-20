import { C } from "../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../components.jsx";
export const ComputeQKV = (ctx) => {
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
};

export const AttentionScores = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Step 2: Compute attention scores
          </T>
          <T color={C.dim} size={18} style={{ marginTop: 4 }}>
            Each word's Query asks every Key: "how relevant are you to me?"
          </T>

          {/* Q_I as inline text, centered */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <T color={C.blue} bold center size={19}>
              "I"'s Query: Q_I = [0.8, 0.2]
            </T>
          </div>
          <T color={C.dim} size={16} center style={{ marginTop: 2 }}>
            Dot product this with every word's Key:
          </T>

          {/* Score cards with ranked coloring */}
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { t: "I", k: "[0.3, 0.7]", calc: "(0.8×0.3) + (0.2×0.7) = 0.24 + 0.14", r: 0.38, rank: 3 },
              { t: "love", k: "[0.6, 0.4]", calc: "(0.8×0.6) + (0.2×0.4) = 0.48 + 0.08", r: 0.56, rank: 2 },
              { t: "cats", k: "[0.8, 0.5]", calc: "(0.8×0.8) + (0.2×0.5) = 0.64 + 0.10", r: 0.74, rank: 1 },
            ].map(({ t, k, calc, r, rank }) => {
              const cfg = {
                1: {
                  color: C.yellow,
                  label: "HIGHEST",
                  bg: "0a",
                  border: "25",
                  barBg: `linear-gradient(90deg, ${C.orange}, ${C.yellow})`,
                },
                2: {
                  color: C.orange,
                  label: "medium",
                  bg: "06",
                  border: "15",
                  barBg: `linear-gradient(90deg, ${C.cyan}80, ${C.orange})`,
                },
                3: { color: C.cyan, label: "lowest", bg: "04", border: "10", barBg: `${C.cyan}40` },
              }[rank];
              return (
                <div
                  key={t}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${cfg.color}${cfg.bg}`,
                    border: `1px solid ${cfg.color}${cfg.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span style={{ color: C.blue, fontSize: 16, fontWeight: 600 }}>Q_I</span>
                    <span style={{ color: C.dim, fontSize: 19 }}>·</span>
                    <span style={{ color: C.orange, fontSize: 16, fontWeight: 600 }}>
                      K_{t} = {k}
                    </span>
                  </div>
                  <T color={C.dim} size={16}>
                    {calc}
                  </T>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(r / 0.74) * 100}%`,
                          height: "100%",
                          borderRadius: 5,
                          background: cfg.barBg,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 22,
                        fontWeight: 700,
                        color: cfg.color,
                        minWidth: 36,
                        textAlign: "right",
                      }}
                    >
                      {r.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600, minWidth: 48 }}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <T color={C.dim} size={18} style={{ marginTop: 8 }}>
            From "I"'s perspective: <strong style={{ color: C.yellow }}>"cats"</strong> is most relevant,{" "}
            <strong style={{ color: C.orange }}>"love"</strong> is medium,{" "}
            <strong style={{ color: C.cyan }}>"I" itself</strong> is lowest.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            Full score matrix (every word asks every word):
          </T>
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "55px repeat(3, 1fr)", gap: 4 }}>
              <div></div>
              {["K_I", "K_love", "K_cats"].map((h) => (
                <T key={h} color={C.orange} size={14} bold center>
                  {h}
                </T>
              ))}
              {[
                { q: "Q_I", s: [0.38, 0.56, 0.74], mx: 2 },
                { q: "Q_love", s: [0.66, 0.42, 0.53], mx: 0 },
                { q: "Q_cats", s: [0.57, 0.54, 0.7], mx: 2 },
              ].map(({ q, s: sc, mx }) => (
                <div key={q} style={{ display: "contents" }}>
                  <T color={C.blue} size={16} bold center>
                    {q}
                  </T>
                  {sc.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign: "center",
                        padding: "6px",
                        borderRadius: 5,
                        background: i === mx ? `${C.yellow}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${i === mx ? `${C.yellow}25` : "transparent"}`,
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
            Each row = one word asking "how relevant is each word to me?" Yellow = highest in that row.
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
};

export const KTranspose = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The question - what does T mean? */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            In the attention formula, you'll see this:
          </T>
          <div
            style={{
              margin: "14px 0",
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={24} center>
              score = Q · K<sup style={{ fontSize: 16 }}>T</sup>
            </T>
          </div>
          <T color={C.blue} size={19}>
            That little <strong style={{ color: C.yellow }}>T</strong> is not "to the power of T". It stands for{" "}
            <strong style={{ color: C.yellow }}>Transpose</strong> - flipping a matrix on its side.
          </T>
          <T color={C.dim} size={18} style={{ marginTop: 8 }}>
            But why do we need to flip K? Let's build up to it step by step.
          </T>
        </Box>
      )}

      {/* Sub 1: What is a transpose - visual flip */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            What does "transpose" mean?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            It means: <strong>rows become columns, columns become rows.</strong> That's it. No math changes - just a
            flip.
          </T>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Before */}
            <div style={{ textAlign: "center" }}>
              <T
                color={C.dim}
                size={13}
                center
                style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
              >
                Original K
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: 10,
                  background: `${C.orange}08`,
                  border: `1px solid ${C.orange}20`,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "50px 50px", gap: 4 }}>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.3
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.7
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.6
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.4
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.8
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.5
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                  3 rows × 2 cols
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color={C.dim} size={12} center>
                  row 1 = K<sub>I</sub>
                </T>
                <T color={C.dim} size={12} center>
                  row 2 = K<sub>love</sub>
                </T>
                <T color={C.dim} size={12} center>
                  row 3 = K<sub>cats</sub>
                </T>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <T color={C.yellow} bold center size={28}>
                →
              </T>
              <T color={C.yellow} size={12} bold center>
                transpose
              </T>
            </div>

            {/* After */}
            <div style={{ textAlign: "center" }}>
              <T
                color={C.dim}
                size={13}
                center
                style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}
              >
                K<sup>T</sup>
              </T>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: 10,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}20`,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "50px 50px 50px", gap: 4 }}>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.3
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.6
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.8
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.orange}15`, textAlign: "center" }}>
                    <T color={C.orange} bold center size={17}>
                      0.7
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.cyan}15`, textAlign: "center" }}>
                    <T color={C.cyan} bold center size={17}>
                      0.4
                    </T>
                  </div>
                  <div style={{ padding: "6px", borderRadius: 4, background: `${C.yellow}15`, textAlign: "center" }}>
                    <T color={C.yellow} bold center size={17}>
                      0.5
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                  2 rows × 3 cols
                </T>
              </div>
              <div style={{ marginTop: 4 }}>
                <T color={C.dim} size={12} center>
                  col 1 = K<sub>I</sub>
                </T>
                <T color={C.dim} size={12} center>
                  col 2 = K<sub>love</sub>
                </T>
                <T color={C.dim} size={12} center>
                  col 3 = K<sub>cats</sub>
                </T>
              </div>
            </div>
          </div>

          <T color="#b8a9ff" size={18} style={{ marginTop: 12 }}>
            Same numbers. Same order within each word's vector. Just <strong>rotated</strong> - rows became columns.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Why - shapes must align for matrix multiplication */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem: shapes don't match.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            We want every Query to compute a dot product with every Key. Let's try Q · K directly:
          </T>

          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.red}25`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <T color={C.blue} bold center size={16}>
                  Q
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.blue}12`,
                    border: `1px solid ${C.blue}25`,
                  }}
                >
                  <T color={C.blue} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                ×
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.orange} bold center size={16}>
                  K
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.orange}12`,
                    border: `1px solid ${C.orange}25`,
                  }}
                >
                  <T color={C.orange} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                =
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.red} bold center size={16}>
                  &nbsp;
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.red}12`,
                    border: `1px solid ${C.red}25`,
                  }}
                >
                  <T color={C.red} bold center size={20}>
                    ❌
                  </T>
                </div>
                <T color={C.red} size={12} center>
                  Can't multiply!
                </T>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.red}08` }}>
              <T color="#ff8a80" size={16} center>
                Matrix multiplication rule: the <strong>inner dimensions</strong> must match.
              </T>
              <T color="#ff8a80" size={16} center style={{ marginTop: 2 }}>
                (3×<strong style={{ color: C.red }}>2</strong>) × (<strong style={{ color: C.red }}>3</strong>×2) → 2 ≠
                3. <strong>Broken.</strong>
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: The fix - transpose makes it work */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The fix: transpose K, then multiply.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.green}25`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <T color={C.blue} bold center size={16}>
                  Q
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.blue}12`,
                    border: `1px solid ${C.blue}25`,
                  }}
                >
                  <T color={C.blue} bold center size={20}>
                    3 × 2
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  3 words, 2 dims
                </T>
              </div>
              <T color={C.dim} size={24}>
                ×
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.green} bold center size={16}>
                  K<sup style={{ fontSize: 12 }}>T</sup>
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}25`,
                  }}
                >
                  <T color={C.green} bold center size={20}>
                    2 × 3
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  2 dims, 3 words
                </T>
              </div>
              <T color={C.dim} size={24}>
                =
              </T>
              <div style={{ textAlign: "center" }}>
                <T color={C.yellow} bold center size={16}>
                  Scores
                </T>
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: `${C.yellow}12`,
                    border: `1px solid ${C.yellow}25`,
                  }}
                >
                  <T color={C.yellow} bold center size={20}>
                    3 × 3
                  </T>
                </div>
                <T color={C.dim} size={12} center>
                  every word → every word
                </T>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: `${C.green}08` }}>
              <T color="#80e8a5" size={16} center>
                (3×<strong style={{ color: C.green }}>2</strong>) × (<strong style={{ color: C.green }}>2</strong>×3) →
                inner dims both 2. <strong>Works!</strong>
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>
            The result is a <strong style={{ color: C.yellow }}>3×3 score matrix</strong> - one score for every pair of
            words. Exactly what we need.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: What each cell means - visual score matrix */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            What does Q · K<sup style={{ fontSize: 14 }}>T</sup> actually compute?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Each cell in the 3×3 result = the dot product of one Query with one Key. That's the "relevance score".
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto repeat(3, 1fr)", gap: 4, minWidth: 300 }}>
              <div style={{ padding: "4px 8px" }}></div>
              {["K_I", "K_love", "K_cats"].map((h) => (
                <div key={h} style={{ padding: "4px", borderRadius: 4, background: `${C.orange}08` }}>
                  <T color={C.orange} size={13} bold center>
                    {h}
                  </T>
                </div>
              ))}
              {[
                { q: "Q_I", scores: [0.38, 0.56, 0.74], best: 2 },
                { q: "Q_love", scores: [0.66, 0.42, 0.53], best: 0 },
                { q: "Q_cats", scores: [0.57, 0.54, 0.7], best: 2 },
              ].map(({ q, scores, best }) => (
                <div key={q} style={{ display: "contents" }}>
                  <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}08` }}>
                    <T color={C.blue} size={13} bold center>
                      {q}
                    </T>
                  </div>
                  {scores.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 4px",
                        borderRadius: 6,
                        textAlign: "center",
                        background: i === best ? `${C.yellow}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${i === best ? `${C.yellow}25` : "transparent"}`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 18,
                          color: i === best ? C.yellow : C.mid,
                          fontWeight: i === best ? 700 : 400,
                        }}
                      >
                        {s.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>
            Row = one word asking. Column = one word answering. Cell = how relevant the answer-word is to the asker.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Analogy - the classroom seating chart */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Analogy: the classroom seating chart
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔍</span>
              <div>
                <T color={C.blue} bold size={17}>
                  Q (Queries) = each student's question list
                </T>
                <T color={C.dim} size={15}>
                  3 students, each with a question that has 2 traits (topic, urgency)
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔑</span>
              <div>
                <T color={C.orange} bold size={17}>
                  K (Keys) = each student's expertise card
                </T>
                <T color={C.dim} size={15}>
                  Same 3 students, each has expertise described by 2 traits
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
              <div>
                <T color={C.yellow} bold size={17}>
                  Q · K<sup style={{ fontSize: 12 }}>T</sup> = the compatibility chart
                </T>
                <T color={C.dim} size={15}>
                  Every student's question matched against every student's expertise → a 3×3 grid of "how well can you
                  help me?"
                </T>
              </div>
            </div>
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 10 }}>
            The transpose just makes this matching possible. Without it, you can't compare every question to every
            expertise - the shapes won't fit.
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: Summary */}
      <Reveal when={sub >= 6}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            K<sup style={{ fontSize: 14 }}>T</sup> in one sentence
          </T>
          <div
            style={{
              margin: "12px 0",
              padding: "14px 16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
            }}
          >
            <T color={C.bright} size={19} center>
              <strong style={{ color: C.yellow }}>
                K<sup style={{ fontSize: 13 }}>T</sup>
              </strong>{" "}
              is just K with its rows and columns swapped - so that Q · K<sup style={{ fontSize: 13 }}>T</sup> produces
              a score for <strong>every word pair</strong>.
            </T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[
              { q: "What is T?", a: "Transpose - flip rows ↔ columns", c: C.purple },
              { q: "Why do it?", a: "So the matrix shapes align for multiplication", c: C.blue },
              { q: "Does K change?", a: "No - same numbers, just rearranged", c: C.orange },
              { q: "What's the result?", a: "A word×word score matrix (every pair gets a score)", c: C.yellow },
            ].map(({ q, a, c }) => (
              <div
                key={q}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <T color={c} bold size={16} style={{ minWidth: 120, flexShrink: 0 }}>
                  {q}
                </T>
                <T color={C.dim} size={16}>
                  {a}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
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
};

export const WhySoftmax = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: We have raw scores, need to fill in ???s */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            After dot products, we have raw scores:
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
            {[
              { w: "I", s: "0.38" },
              { w: "love", s: "0.56" },
              { w: "cats", s: "0.74" },
            ].map(({ w, s }) => (
              <div
                key={w}
                style={{
                  textAlign: "center",
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <T color={C.dim} size={14}>
                  I → {w}
                </T>
                <T color={C.bright} bold center size={20}>
                  {s}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Now we need to <strong>use these scores to blend the Values</strong>:
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "10px 14px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.bright} size={19} center>
              output = <strong style={{ color: C.yellow }}>???</strong> × V_I +{" "}
              <strong style={{ color: C.yellow }}>???</strong> × V_love +{" "}
              <strong style={{ color: C.yellow }}>???</strong> × V_cats
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            What should those <strong style={{ color: C.yellow }}>???</strong> be? Can we just plug in the raw scores?
          </T>
        </Box>
      )}

      {/* Sub 1: Budget analogy */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Think of it like a budget.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            You have <strong>₹100</strong> to distribute among three friends based on how helpful they were.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Helpfulness scores: Riya=38, Aman=56, Priya=74
          </T>
          <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.red} bold center size={18}>
              ❌ Can't give ₹38 + ₹56 + ₹74 = ₹168 total. You only have ₹100.
            </T>
            <T color={C.dim} size={18} style={{ marginTop: 8 }}>
              You need to convert scores into <strong>shares of ₹100</strong> - percentages that add up to 100%.
            </T>
            <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
              <T color={C.dim} size={18}>
                Total = 38 + 56 + 74 = 168
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { name: "Riya", score: 38, pct: 23, color: C.cyan },
                  { name: "Aman", score: 56, pct: 33, color: C.orange },
                  { name: "Priya", score: 74, pct: 44, color: C.yellow },
                ].map(({ name, score, pct, color }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.dim, fontSize: 16, minWidth: 36 }}>{name}</span>
                    <span style={{ color: C.dim, fontSize: 16, minWidth: 50 }}>{score}/168</span>
                    <span style={{ color: C.dim, fontSize: 16 }}>=</span>
                    <div
                      style={{
                        flex: 1,
                        height: 10,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 5,
                          background: color,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span style={{ color, fontWeight: 700, fontSize: 18, minWidth: 30 }}>{pct}%</span>
                    <span style={{ color: C.dim, fontSize: 16 }}>→ ₹{pct}</span>
                  </div>
                ))}
              </div>
              <T color={C.green} bold center size={18} style={{ marginTop: 6 }}>
                ✅ Total: ₹100. This works!
              </T>
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>
            That's basically what softmax does - convert raw scores into shares that add up to 100%. But with one extra
            trick...
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: The problem - negative scores */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem: dot products CAN be negative.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Our example had positive scores. But what if they were:
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
            {[
              { w: "word_A", s: "-3" },
              { w: "word_B", s: "1" },
              { w: "word_C", s: "5" },
            ].map(({ w, s }) => (
              <div
                key={w}
                style={{
                  textAlign: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${parseFloat(s) < 0 ? C.red : C.green}08`,
                  border: `1px solid ${parseFloat(s) < 0 ? C.red : C.green}15`,
                }}
              >
                <T color={C.dim} size={12}>
                  {w}
                </T>
                <T color={parseFloat(s) < 0 ? C.red : C.mid} bold center size={20}>
                  {s}
                </T>
              </div>
            ))}
          </div>
          <T color="#ff8a80" style={{ marginTop: 10 }}>
            Simple division: total = -3 + 1 + 5 = 3
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { w: "A", calc: "-3/3 = -100%", problem: "NEGATIVE? Can't pay minus attention!", color: C.red },
              { w: "B", calc: "1/3 = 33%", problem: "", color: C.mid },
              { w: "C", calc: "5/3 = 167%", problem: "More than 100%? Nonsense!", color: C.red },
            ].map(({ w, calc, problem, color }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: problem ? `${C.red}06` : "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ color: C.dim, fontSize: 16, minWidth: 14 }}>{w}:</span>
                <T color={color} size={18} bold center>
                  {calc}
                </T>
                {problem && (
                  <T color={C.red} size={14}>
                    ← {problem}
                  </T>
                )}
              </div>
            ))}
          </div>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>
            Simple division is broken. We need something better.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: The Softmax Formula - e^x trick */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The Solution: Softmax
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Before dividing, put each score through <strong>e^score</strong> (e ≈ 2.718). This magical function makes
            ANY number positive.
          </T>
          {/* ── Formula SVG ── */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.green}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <T color={C.dim} size={13} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              The Softmax Formula
            </T>
            <svg viewBox="0 0 420 120" style={{ width: "100%", maxWidth: 380, height: "auto" }}>
              <desc>
                Softmax formula showing e to the power of each score divided by sum of all e scores, converting raw
                attention scores to probabilities
              </desc>
              {/* σ(z)_i = */}
              <text x="10" y="62" fill={C.bright} fontSize="22" fontFamily="serif" fontStyle="italic">
                σ
              </text>
              <text x="26" y="62" fill={C.dim} fontSize="18" fontFamily="serif">
                (
              </text>
              <text x="34" y="62" fill={C.cyan} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                z
              </text>
              <text x="50" y="62" fill={C.dim} fontSize="18" fontFamily="serif">
                )
              </text>
              <text x="60" y="72" fill={C.purple} fontSize="14" fontFamily="serif" fontStyle="italic">
                i
              </text>
              <text x="82" y="62" fill={C.dim} fontSize="22" fontFamily="serif">
                =
              </text>
              {/* Fraction line */}
              <line x1="115" y1="55" x2="300" y2="55" stroke={C.bright} strokeWidth="1.5" />
              {/* Numerator: e^z_i */}
              <text
                x="185"
                y="40"
                fill={C.green}
                fontSize="22"
                fontFamily="serif"
                fontStyle="italic"
                textAnchor="middle"
                fontWeight="700"
              >
                e
              </text>
              <text x="202" y="26" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">
                z
              </text>
              <text x="214" y="32" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                i
              </text>
              {/* Denominator: Σ e^z_j */}
              <text x="155" y="90" fill={C.yellow} fontSize="22" fontFamily="serif">
                Σ
              </text>
              {/* j=1 below sigma */}
              <text x="157" y="108" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">
                j=1
              </text>
              {/* K above sigma */}
              <text x="158" y="76" fill={C.dim} fontSize="11" fontFamily="serif" fontStyle="italic">
                K
              </text>
              <text x="185" y="90" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                e
              </text>
              <text x="202" y="78" fill={C.cyan} fontSize="16" fontFamily="serif" fontStyle="italic">
                z
              </text>
              <text x="214" y="84" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                j
              </text>
              {/* Labels */}
              <text x="320" y="34" fill={C.green} fontSize="11" fontFamily="sans-serif">
                ← this word's e^score
              </text>
              <text x="320" y="90" fill={C.yellow} fontSize="11" fontFamily="sans-serif">
                ← sum of all e^scores
              </text>
            </svg>
          </div>
          <T color="#80e8a5" size={18}>
            In plain English:{" "}
            <strong>take e to the power of this score, then divide by the sum of e to the power of every score.</strong>
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: Why e^x - the magic property */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why e^x? It's ALWAYS positive.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            No matter what you feed it - negative, zero, huge - the output is always a positive number.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { input: -3, output: 0.05, note: "negative → small positive" },
              { input: 0, output: 1.0, note: "zero → exactly 1" },
              { input: 1, output: 2.72, note: "positive → bigger positive" },
              { input: 5, output: 148.4, note: "large → much larger" },
            ].map(({ input, output, note }) => (
              <div
                key={input}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ minWidth: 60, textAlign: "right" }}>
                  <span style={{ fontFamily: "monospace", color: input < 0 ? C.red : C.mid, fontSize: 19 }}>
                    {input}
                  </span>
                </div>
                <span style={{ color: C.dim, fontSize: 20 }}>→</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 15 }}>e^({input}) =</span>
                  <span
                    style={{ fontFamily: "monospace", color: C.green, fontWeight: 700, fontSize: 20, minWidth: 50 }}
                  >
                    {output}
                  </span>
                </div>
                {/* Mini bar - e^x is always positive, so bar always has content */}
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                    minWidth: 40,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min((output / 148.4) * 100, 100)}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: C.green,
                      minWidth: 2,
                    }}
                  />
                </div>
                <T color={C.dim} size={13}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}15`,
            }}
          >
            <T color="#b8a9ff" size={18} center>
              Notice the pattern: <strong>higher input → exponentially bigger output</strong>. This means softmax
              naturally amplifies the winner.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Full walkthrough with negative scores */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Full Walkthrough: scores [-3, 1, 5]
          </T>
          {/* Step 1 */}
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}20`,
            }}
          >
            <T color={C.purple} bold size={16}>
              Step 1: Apply e^score to each
            </T>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "10px 0" }}>
              {[
                { s: -3, e: "0.05", c: C.red },
                { s: 1, e: "2.72", c: C.mid },
                { s: 5, e: "148.4", c: C.green },
              ].map(({ s, e, c }) => (
                <div key={s} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ padding: "4px 6px", borderRadius: 4, background: `${c}08`, marginBottom: 4 }}>
                    <T color={c} bold center size={18}>
                      {s}
                    </T>
                  </div>
                  <T color={C.dim} size={12} center>
                    ↓ e^({s})
                  </T>
                  <div style={{ padding: "4px 6px", borderRadius: 4, background: `${C.green}08`, marginTop: 4 }}>
                    <T color={C.green} bold center size={18}>
                      {e}
                    </T>
                  </div>
                </div>
              ))}
            </div>
            <T color={C.dim} size={15} center>
              All negative numbers became positive!
            </T>
          </div>
          {/* Step 2 */}
          <div
            style={{
              marginTop: 8,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              Step 2: Sum them all up (the denominator)
            </T>
            <div style={{ marginTop: 6, textAlign: "center" }}>
              <T color={C.dim} size={18} center>
                0.05 + 2.72 + 148.4 = <strong style={{ color: C.yellow, fontSize: 22 }}>151.17</strong>
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 6: Step 3 - divide by sum + checkmarks */}
      <Reveal when={sub >= 6}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Full Walkthrough: scores [-3, 1, 5]
          </T>
          {/* Step 3 */}
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color={C.green} bold size={16}>
              Step 3: Divide each e^score by the sum
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { w: "A", score: -3, eVal: "0.05", pct: 0.03, color: C.cyan },
                { w: "B", score: 1, eVal: "2.72", pct: 1.8, color: C.orange },
                { w: "C", score: 5, eVal: "148.4", pct: 98.2, color: C.yellow },
              ].map(({ w, score, eVal, pct, color }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 14, minWidth: 52 }}>
                    {w} ({score})
                  </span>
                  <span style={{ fontFamily: "monospace", color: C.dim, fontSize: 14, minWidth: 80 }}>
                    {eVal}/151.17
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <div
                    style={{
                      flex: 1,
                      height: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, 0.5)}%`,
                        height: "100%",
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span style={{ color, fontWeight: 700, fontSize: 17, minWidth: 44, textAlign: "right" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                All positive ✓
              </T>
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                Sum = 100% ✓
              </T>
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 6, background: `${C.green}08` }}>
              <T color={C.green} size={15} bold center>
                Ranking preserved ✓
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 7: Amplification + why scale first */}
      <Reveal when={sub >= 7}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Softmax amplifies differences - by design.
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={13}>
                Raw scores
              </T>
              <T color={C.mid} bold size={20} center>
                -3, 1, 5
              </T>
              <T color={C.dim} size={12} center>
                Gap: 1 to 5 = just 4
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <T color={C.dim} size={24}>
                →
              </T>
            </div>
            <div
              style={{ flex: 1, padding: "10px", borderRadius: 8, background: `${C.yellow}08`, textAlign: "center" }}
            >
              <T color={C.dim} size={13}>
                After e^x
              </T>
              <T color={C.yellow} bold size={20} center>
                0.05, 2.72, 148.4
              </T>
              <T color={C.dim} size={12} center>
                Gap: 2.72 to 148 = 145!
              </T>
            </div>
          </div>
          <T color="#ffe082" size={18} style={{ marginTop: 10 }}>
            The highest score doesn't just win - it <strong>dominates</strong>. This is good: the most relevant word
            SHOULD stand out.
          </T>
          <T color="#ffe082" size={18} style={{ marginTop: 8 }}>
            <strong>But</strong> - if scores are too huge (like 12, 18, 25), softmax amplifies TOO aggressively → 99.99%
            on one word. That's why we <strong>scale first</strong> (next chapter) to keep scores in a useful range.
          </T>
        </Box>
      </Reveal>

      {/* Sub 8: Formula recap with visual summary */}
      <Reveal when={sub >= 8}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Softmax: the complete picture
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}15`,
              }}
            >
              <span
                style={{
                  background: `${C.purple}20`,
                  color: C.purple,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                1
              </span>
              <div style={{ flex: 1 }}>
                <T color={C.purple} bold size={18}>
                  e^score for each score
                </T>
                <T color={C.dim} size={15}>
                  Makes everything positive - even e^(-1000) is positive
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <span
                style={{
                  background: `${C.yellow}20`,
                  color: C.yellow,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                2
              </span>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold size={18}>
                  Divide each by the total sum
                </T>
                <T color={C.dim} size={15}>
                  Now everything adds up to exactly 1.0 (100%)
                </T>
              </div>
            </div>
          </div>
          {/* Mini formula reminder */}
          <div
            style={{
              marginTop: 12,
              padding: "10px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.dim} size={13} center style={{ letterSpacing: 1 }}>
              FORMULA
            </T>
            <T color={C.bright} bold center size={20} style={{ fontFamily: "serif", marginTop: 4 }}>
              softmax(z<sub style={{ fontSize: 14 }}>i</sub>) = e
              <sup style={{ fontSize: 14 }}>
                z<sub style={{ fontSize: 10 }}>i</sub>
              </sup>{" "}
              / Σ e
              <sup style={{ fontSize: 14 }}>
                z<sub style={{ fontSize: 10 }}>j</sub>
              </sup>
            </T>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 10 }}>
            Output: valid percentages (all positive, sum to 100%) that respect the original ranking. But raw scores can
            be too big for softmax - that's the next problem to solve →
          </T>
        </Box>
      </Reveal>

      {sub < 8 && (
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
};

export const ScaleByRootDk = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The core problem */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            The problem: dot products grow with dimensions.
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            Remember, the dot product = multiply each pair, then <strong>sum all of them</strong>. More dimensions means
            more pairs being added up:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* 2 dims */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={18}>
                2 dimensions → sum 2 terms
              </T>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                {["0.24", "0.14"].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        color: C.green,
                        fontSize: 18,
                        fontFamily: "monospace",
                        fontWeight: 600,
                      }}
                    >
                      {v}
                    </span>
                    {i < 1 && <span style={{ color: C.dim, fontSize: 18 }}>+</span>}
                  </div>
                ))}
                <span style={{ color: C.dim, fontSize: 18 }}>=</span>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 20 }}>0.38</span>
              </div>
            </div>
            {/* 64 dims */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={18}>
                64 dimensions → sum 64 terms
              </T>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  marginTop: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {["term₁", "term₂", "term₃"].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "3px 6px",
                        borderRadius: 4,
                        background: `${C.orange}12`,
                        color: C.orange,
                        fontSize: 14,
                        fontFamily: "monospace",
                      }}
                    >
                      {v}
                    </span>
                    <span style={{ color: C.dim, fontSize: 18 }}>+</span>
                  </div>
                ))}
                <span style={{ color: C.dim, fontSize: 14 }}>... + term₆₄</span>
                <span style={{ color: C.dim, fontSize: 18 }}>=</span>
                <span style={{ color: C.orange, fontWeight: 700, fontSize: 20 }}>~25</span>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                64 small numbers added up → much bigger total
              </T>
            </div>
            {/* 512 dims */}
            <div
              style={{ padding: "8px 10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}
            >
              <T color={C.red} bold center size={18}>
                512 dimensions → sum 512 terms
              </T>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  marginTop: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {["term₁", "term₂", "term₃"].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "3px 6px",
                        borderRadius: 4,
                        background: `${C.red}12`,
                        color: C.red,
                        fontSize: 14,
                        fontFamily: "monospace",
                      }}
                    >
                      {v}
                    </span>
                    <span style={{ color: C.dim, fontSize: 18 }}>+</span>
                  </div>
                ))}
                <span style={{ color: C.dim, fontSize: 14 }}>... + term₅₁₂</span>
                <span style={{ color: C.dim, fontSize: 18 }}>=</span>
                <span style={{ color: C.red, fontWeight: 700, fontSize: 20 }}>~180</span>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 2 }}>
                512 small numbers added up → huge total
              </T>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 8 }}>
            Each individual term might be small (like 0.3 or 0.5). But when you add up 64 or 512 of them, the total
            becomes very large. The score grows just because of more dimensions - not because the words are more
            related.
          </T>
        </Box>
      )}

      {/* Sub 1: Why big scores are bad - softmax comparison */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Why are big scores a problem?
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Remember: softmax uses e^score. When scores are big, e^big_number becomes <strong>astronomically</strong>{" "}
            huge, and one word gets 99.99% of the attention - the model becomes blind to everything else.
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color={C.green} bold size={16} center>
                Small scores (2-dim)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                [0.38, 0.56, 0.74]
              </T>
              <div style={{ marginTop: 6 }}>
                {[
                  { w: "I", pct: 28, c: C.cyan },
                  { w: "love", pct: 33, c: C.orange },
                  { w: "cats", pct: 39, c: C.yellow },
                ].map(({ w, pct, c }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.dim, minWidth: 28 }}>{w}</span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          borderRadius: 4,
                          background: c,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 14, color: c, fontWeight: 600, minWidth: 26 }}>{pct}%</span>
                  </div>
                ))}
              </div>
              <T color={C.green} size={12} center style={{ marginTop: 4 }}>
                ✅ Looks at all words. Can blend info from multiple sources.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}15`,
              }}
            >
              <T color={C.red} bold size={16} center>
                Huge scores (64-dim)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                [12.1, 17.8, 25.6]
              </T>
              <div style={{ marginTop: 6 }}>
                {[
                  { w: "I", pct: 0.1, c: C.dim },
                  { w: "love", pct: 0.4, c: C.dim },
                  { w: "cats", pct: 99.6, c: C.red },
                ].map(({ w, pct, c }) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.dim, minWidth: 28 }}>{w}</span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(pct, 1)}%`,
                          height: "100%",
                          borderRadius: 4,
                          background: c,
                          transition: "width 0.4s",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 14, color: c, fontWeight: 600, minWidth: 32 }}>
                      {pct < 1 ? `${pct}%` : `${pct}%`}
                    </span>
                  </div>
                ))}
              </div>
              <T color={C.red} size={12} center style={{ marginTop: 4 }}>
                ❌ 99.6% on one word. Others invisible. Can't blend info.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 2: The fix */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            The fix: divide by √d_k
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            If d_k = 64, then √64 = 8. Dividing brings scores back to a manageable range:
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>
              Before scaling: <strong style={{ color: C.red }}>[12.1, 17.8, 25.6]</strong>
            </T>
            <T color={C.dim} size={18} style={{ marginTop: 4 }}>
              Divide by √64 = 8:
            </T>
            <T color={C.green} bold center size={19} style={{ marginTop: 4 }}>
              After scaling: <strong>[1.51, 2.23, 3.20]</strong>
            </T>
          </div>
          <div style={{ marginTop: 8 }}>
            <T color={C.dim} size={16}>
              Softmax of [1.51, 2.23, 3.20]:
            </T>
            <div style={{ marginTop: 4 }}>
              {[
                { w: "I", pct: 14, c: C.cyan },
                { w: "love", pct: 28, c: C.orange },
                { w: "cats", pct: 58, c: C.yellow },
              ].map(({ w, pct, c }) => (
                <div key={w} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, color: C.dim, minWidth: 32 }}>{w}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${c}80, ${c})`,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 16, color: c, fontWeight: 700, minWidth: 30 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 6 }}>
            ✅ <strong>Focuses on the most relevant word (58%)</strong> but still gathers info from others (14%, 28%).
            That's exactly what you want.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Why sqrt specifically */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            Why √d_k specifically? Why not ÷2 or ÷100?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            There's a mathematical reason. When Q and K have random values, the dot product's{" "}
            <strong>variance grows proportionally to d_k</strong>. The standard deviation = √d_k. So dividing by √d_k
            brings the variance back to 1 - normalizing scores to a consistent range no matter the dimension.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            In simple terms: √d_k is the <strong>exact right amount</strong> to undo the growth caused by summing d_k
            terms. Not too much (all scores become equal), not too little (problem remains).
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: Our example scaled */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Back to our example (d_k = 2, √2 ≈ 1.41):
          </T>
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "55px repeat(3, 1fr)", gap: 4 }}>
              <div></div>
              {["K_I", "K_love", "K_cats"].map((h) => (
                <T key={h} color={C.orange} size={14} bold center>
                  {h}
                </T>
              ))}
              {[
                { q: "Q_I", s: [0.27, 0.4, 0.52] },
                { q: "Q_love", s: [0.47, 0.3, 0.37] },
                { q: "Q_cats", s: [0.4, 0.38, 0.5] },
              ].map(({ q, s: sc }) => (
                <div key={q} style={{ display: "contents" }}>
                  <T color={C.blue} size={16} bold center>
                    {q}
                  </T>
                  {sc.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign: "center",
                        padding: "6px",
                        borderRadius: 5,
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <span style={{ fontFamily: "monospace", fontSize: 19, color: C.mid }}>{v.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 6 }}>
            Our scores were already small (2-dim), so scaling barely changes them. In a real 64-dim model, scaling is
            the difference between a useful model and a broken one.
          </T>
          <T color={C.yellow} size={18} bold center style={{ marginTop: 6 }}>
            Now let's apply softmax to these scaled scores →
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
};

// ═══════ CH: Why Do We Need Softmax? ═══════

export const SoftmaxProbs = (ctx) => {
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
};

export const WeightedSum = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Use attention weights to blend Values.
          </T>
          <T color="#80e8a5" style={{ marginTop: 4 }}>
            For "I" (weights: 0.29, 0.33, 0.38):
          </T>
          <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            {[
              { w: "0.29", vl: "V_I = [1.0, -0.5]", r: "[0.290, -0.145]", c: C.red },
              { w: "0.33", vl: "V_love = [0.3, 0.8]", r: "[0.099, 0.264]", c: C.purple },
              { w: "0.38", vl: "V_cats = [-0.2, 0.9]", r: "[-0.076, 0.342]", c: C.cyan },
            ].map(({ w, vl, r, c }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: C.yellow, fontSize: 18, fontWeight: 700 }}>{w}</span>
                <span style={{ color: C.dim, fontSize: 18 }}>×</span>
                <code style={{ color: `${c}aa`, fontSize: 16 }}>{vl}</code>
                <span style={{ color: C.dim, fontSize: 18 }}>=</span>
                <code style={{ color: c, fontSize: 16, fontWeight: 600 }}>{r}</code>
              </div>
            ))}
            <div style={{ marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
              <T color={C.dim} size={18}>
                Sum:
              </T>
              <T color={C.yellow} bold center size={20}>
                [0.290, -0.145] + [0.099, 0.264] + [-0.076, 0.342] ={" "}
                <span style={{ color: C.green }}>[0.313, 0.461]</span>
              </T>
            </div>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow}>
          <T color={C.yellow} bold center>
            This [0.313, 0.461] is the NEW vector for "I".
          </T>
          <T color="#ffe082" style={{ marginTop: 4 }}>
            It's no longer just about "I". It has absorbed context from "love" (33%) and "cats" (38%). It's now a{" "}
            <strong>context-aware representation</strong>. Same happens for every word.
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
};

export const FullFormula = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            borderRadius: 14,
            padding: "20px",
            border: `1px solid ${C.yellow}25`,
            width: "100%",
          }}
        >
          <T color={C.dim} size={14} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
            Everything above in one line
          </T>
          <T color={C.yellow} bold size={24} center>
            Attention(Q, K, V) = softmax( Q·K<sup>T</sup> / √d<sub>k</sub> ) · V
          </T>
        </div>
      )}
      <Reveal when={sub >= 1}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%" }}>
          {[
            { f: "Q · Kᵀ", m: "Dot product of every query with every key", r: "score matrix", c: C.blue },
            { f: "/ √d_k", m: "Scale down to prevent extreme softmax", r: "manageable scores", c: C.orange },
            { f: "softmax", m: "Convert to probabilities (rows sum to 1)", r: "attention weights", c: C.pink },
            { f: "· V", m: "Weighted sum of values", r: "context-aware output", c: C.green },
          ].map(({ f, m, r, c }, idx) => (
            <div key={f} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {idx > 0 && <div style={{ width: 2, height: 16, background: "rgba(255,255,255,0.1)" }} />}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: `${c}08`,
                  border: `1px solid ${c}18`,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <code
                  style={{
                    color: c,
                    fontWeight: 800,
                    fontSize: 20,
                    minWidth: 100,
                    textAlign: "center",
                    padding: "12px 10px",
                    background: `${c}12`,
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                >
                  {f}
                </code>
                <div>
                  <T color={C.mid} size={16}>
                    {m}
                  </T>
                  <T color={c} size={14} bold>
                    → {r}
                  </T>
                </div>
              </div>
            </div>
          ))}
        </div>
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
};

// ═══════ CH: Causal Masking - Hiding the Future ═══════

export const CausalMask = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const words = ["The", "cat", "sat", "on"];
  const wColors = [C.cyan, C.purple, C.orange, C.yellow];

  /* Fake raw scores (Q.K^T / sqrt(d_k)) for illustration */
  const rawScores = [
    [2.1, 0.5, 0.3, 0.8],
    [1.2, 2.4, 0.7, 0.4],
    [0.6, 1.8, 2.0, 1.1],
    [0.9, 0.3, 1.5, 2.3],
  ];

  /* Softmax helper for a row of scores (-Infinity becomes 0) */
  const softmaxRow = (row) => {
    const finite = row.filter((v) => v !== -Infinity);
    const maxV = Math.max(...finite);
    const exps = row.map((v) => (v === -Infinity ? 0 : Math.exp(v - maxV)));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  };

  /* Masked scores: lower-triangular (row i can see cols 0..i) */
  const maskedScores = rawScores.map((row, i) => row.map((v, j) => (j <= i ? v : -Infinity)));

  /* Softmax of masked scores */
  const maskedProbs = maskedScores.map((row) => softmaxRow(row));

  /* Softmax of full unmasked scores (for comparison) */
  const fullProbs = rawScores.map((row) => softmaxRow(row));

  /* Grid cell renderer */
  const Cell = ({ val, color, bold, size = 16 }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 2px",
        borderRadius: 5,
        background: `${color}08`,
        minWidth: 48,
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: size, color, fontWeight: bold ? 700 : 400 }}>{val}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The problem - why mask at all? */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The problem: during generation, future words don't exist yet
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            When the model generates text one token at a time, it has only produced the tokens so far. The next word
            hasn't been generated yet - it can't attend to something that doesn't exist.
          </T>
          <div style={{ marginTop: 12, padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
            <T
              color={C.dim}
              size={14}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}
            >
              generating "The cat sat on the mat"
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { step: 1, seen: ["The"], gen: "cat", note: '"The" can only see itself' },
                { step: 2, seen: ["The", "cat"], gen: "sat", note: '"cat" sees "The" and itself' },
                { step: 3, seen: ["The", "cat", "sat"], gen: "on", note: '"sat" sees "The", "cat", and itself' },
                { step: 4, seen: ["The", "cat", "sat", "on"], gen: "the", note: '"on" sees all 4 previous tokens' },
              ].map(({ step, seen, gen, note }) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${wColors[step - 1]}06`,
                    border: `1px solid ${wColors[step - 1]}12`,
                  }}
                >
                  <span style={{ color: wColors[step - 1], fontWeight: 800, fontSize: 16, minWidth: 20 }}>{step}.</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {seen.map((w, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${C.green}15`,
                          color: C.green,
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {w}
                      </span>
                    ))}
                    <span style={{ color: C.dim, fontSize: 14, alignSelf: "center" }}>→</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: `${wColors[step - 1]}15`,
                        color: wColors[step - 1],
                        fontSize: 16,
                        fontWeight: 700,
                        border: `1px dashed ${wColors[step - 1]}40`,
                      }}
                    >
                      {gen}?
                    </span>
                  </div>
                  <T color={C.dim} size={13} style={{ marginLeft: "auto" }}>
                    {note}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" style={{ marginTop: 10 }}>
            But during <strong>training</strong>, the model sees the entire sentence at once for efficiency. So we need
            to <strong>artificially hide</strong> future tokens - that's what the causal mask does.
          </T>
        </Box>
      )}

      {/* Sub 1: Who can look at whom - intuitive grid + score matrix */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Who can look at whom?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Each row is a word asking "who can I attend to?" Each column is a word being looked at. A word can only see
            words generated <strong>before it</strong> (+ itself):
          </T>

          {/* Intuitive checkmark/cross grid */}
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `100px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              {/* Column headers */}
              <div style={{ padding: "4px", textAlign: "center" }}>
                <T color={C.dim} size={11}>
                  row asks →
                </T>
                <T color={C.dim} size={11}>
                  col answers ↓
                </T>
              </div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={15} bold center>
                  {w}
                </T>
              ))}

              {/* Grid rows with explanations */}
              {words.map((w, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{w}" asks →
                  </T>
                  {words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <div
                        key={ci}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 2px",
                          borderRadius: 6,
                          background: allowed ? `${C.green}15` : `${C.red}10`,
                          border: `1px solid ${allowed ? C.green : C.red}20`,
                        }}
                      >
                        <span style={{ fontSize: 20, color: allowed ? C.green : C.red }}>
                          {allowed ? "\u2713" : "\u2717"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Row-by-row explanation */}
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { w: "The", c: C.cyan, why: "1st word - only itself exists" },
              { w: "cat", c: C.purple, why: '2nd word - sees "The" + itself' },
              { w: "sat", c: C.orange, why: '3rd word - sees "The", "cat" + itself' },
              { w: "on", c: C.yellow, why: "4th word - sees everything before it + itself" },
            ].map(({ w, c, why }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 16, minWidth: 36 }}>"{w}"</span>
                <T color={C.dim} size={14}>
                  {why}
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              The diagonal = each word seeing itself (always allowed)
            </T>
            <T color="#80e8a5" center size={15} style={{ marginTop: 2 }}>
              Below diagonal = looking at earlier words (allowed - they already exist)
            </T>
            <T color="#ef9a9a" center size={15} style={{ marginTop: 2 }}>
              Above diagonal = looking at future words (forbidden - not generated yet)
            </T>
          </div>

          {/* Now the actual Q.K^T score matrix with same color coding */}
          <T color="#80deea" bold center size={18} style={{ marginTop: 14 }}>
            Now here is the actual Q·K<sup>T</sup> / √d<sub>k</sub> score matrix:
          </T>
          <div style={{ marginTop: 8, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {rawScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => (
                    <Cell key={ci} val={v.toFixed(1)} color={ci <= ri ? C.green : C.red} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 12, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.green}30` }} />
              <T color={C.dim} size={13}>
                allowed (past + self) - keep these scores
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.red}30` }} />
              <T color={C.dim} size={13}>
                future - must be blocked!
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 2: The mask matrix */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The mask: a triangle of negative infinity
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            We add a mask matrix to the scores. The mask has <strong>0</strong> where a word is allowed to look, and{" "}
            <strong>-∞</strong> where it's forbidden:
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {words.map((w, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={14} bold>
                    "{w}" →
                  </T>
                  {words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <Cell
                        key={ci}
                        val={allowed ? "0" : "-\u221E"}
                        color={allowed ? C.green : C.red}
                        bold={!allowed}
                        size={allowed ? 16 : 14}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 10 }}>
            Adding -∞ to a score makes it -∞. When softmax sees -∞, it outputs <strong>exactly 0</strong> - zero
            attention, as if that word doesn't exist. The lower triangle (0s) keeps scores unchanged.
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}15`,
            }}
          >
            <T color="#b8a9ff" size={16} center>
              masked_scores = scores + mask
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 2 }}>
              Where mask[i][j] = 0 if j ≤ i, else -∞
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Masked scores */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            After masking → softmax only sees allowed tokens
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Here are the masked scores - future positions are now -∞:
          </T>

          {/* Masked scores grid */}
          <T color={C.dim} size={12} center style={{ marginTop: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
            masked scores
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={13} bold center>
                  {w}
                </T>
              ))}
              {maskedScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={13} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => (
                    <Cell
                      key={ci}
                      val={v === -Infinity ? "-\u221E" : v.toFixed(1)}
                      color={v === -Infinity ? C.red : C.green}
                      bold={v === -Infinity}
                      size={14}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}15`,
            }}
          >
            <T color="#ffcc80" center size={16}>
              The green cells keep their original scores. The red -∞ cells will become exactly 0 after softmax - as if
              those future words don't exist.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Softmax → attention weights */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Softmax turns masked scores into attention weights
          </T>

          <T color={C.dim} size={20} center style={{ margin: "6px 0" }}>
            ↓ softmax (each row)
          </T>

          {/* Attention weights grid */}
          <T color={C.dim} size={12} center style={{ letterSpacing: 1.5, textTransform: "uppercase" }}>
            attention weights (probabilities)
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `70px repeat(${words.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {words.map((w, i) => (
                <T key={i} color={wColors[i]} size={13} bold center>
                  {w}
                </T>
              ))}
              {maskedProbs.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={wColors[ri]} size={13} bold>
                    "{words[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isZero = v < 0.001;
                    return (
                      <Cell
                        key={ci}
                        val={v.toFixed(2)}
                        color={isZero ? C.red : C.green}
                        bold={!isZero && v > 0.35}
                        size={14}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              Every -∞ became exactly 0.00 after softmax!
            </T>
            <T color="#80e8a5" center size={16} style={{ marginTop: 2 }}>
              "The" puts 100% attention on itself. "cat" splits between "The" and itself. Each row still sums to 1.0 -
              but only across the visible tokens.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Side-by-side visual comparison */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Bidirectional vs Causal - see the difference
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            The attention formula is identical. The ONLY difference is whether the upper triangle is masked:
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Bidirectional grid */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <T color={C.cyan} bold center size={16}>
                No mask (bidirectional)
              </T>
              <T color={C.dim} center size={13}>
                every word sees every word
              </T>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                {words.map((_, ri) =>
                  words.map((_, ci) => (
                    <div
                      key={`b${ri}${ci}`}
                      style={{
                        height: 28,
                        borderRadius: 4,
                        background: `${C.cyan}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: C.cyan, fontSize: 11, fontWeight: 600 }}>
                        {fullProbs[ri][ci].toFixed(2)}
                      </span>
                    </div>
                  )),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Full matrix - all cells active
              </T>
            </div>

            {/* Causal grid */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <T color={C.orange} bold center size={16}>
                Causal mask
              </T>
              <T color={C.dim} center size={13}>
                each word sees only past + self
              </T>
              <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                {words.map((_, ri) =>
                  words.map((_, ci) => {
                    const allowed = ci <= ri;
                    return (
                      <div
                        key={`c${ri}${ci}`}
                        style={{
                          height: 28,
                          borderRadius: 4,
                          background: allowed ? `${C.orange}25` : "rgba(255,255,255,0.03)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: allowed ? C.orange : "rgba(255,255,255,0.12)",
                            fontSize: 11,
                            fontWeight: allowed ? 600 : 400,
                          }}
                        >
                          {allowed ? maskedProbs[ri][ci].toFixed(2) : "0"}
                        </span>
                      </div>
                    );
                  }),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Lower triangle only - upper triangle is dark
              </T>
            </div>
          </div>

          <T color="#ffe082" style={{ marginTop: 10 }}>
            Same Q, K, V matrices. Same formula. Same softmax. The mask is a single triangle of -∞ values - and it
            completely changes what the model can do.
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: The training insight - why causal mask gives you N valid predictions */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            The Training Insight: Every Position Makes a Prediction
          </T>
          <T color="#90caf9" style={{ marginTop: 6 }}>
            4 tokens go in, 4 output vectors come out - <strong>always</strong>, regardless of masking. Each output
            vector passes through Linear + Softmax to predict the next token. The mask determines whether those
            predictions are <strong>honest</strong>.
          </T>

          {/* Flow diagram: tokens → transformer → outputs → predictions */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.blue}15`,
            }}
          >
            <T
              color={C.dim}
              size={12}
              center
              style={{ letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}
            >
              one forward pass through the transformer
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {/* Input tokens */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {words.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 6,
                      background: `${wColors[i]}15`,
                      border: `1px solid ${wColors[i]}30`,
                    }}
                  >
                    <T color={wColors[i]} bold size={16} center>
                      {w}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              {/* Transformer block */}
              <div
                style={{
                  padding: "8px 30px",
                  borderRadius: 8,
                  background: `${C.pink}10`,
                  border: `1px solid ${C.pink}25`,
                }}
              >
                <T color={C.pink} bold size={14} center>
                  Transformer Blocks (N layers)
                </T>
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              {/* Output vectors */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {words.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: `${wColors[i]}08`,
                      border: `1px dashed ${wColors[i]}25`,
                    }}
                  >
                    <T color={wColors[i]} size={14} center>
                      v<sub>{i + 1}</sub>
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={16}>
                {"↓  ".repeat(4).trim()}
              </T>
              <div style={{ padding: "6px 20px", borderRadius: 6, background: "rgba(255,255,255,0.03)" }}>
                <T color={C.dim} size={14} center>
                  Linear + Softmax → 4 next-token predictions
                </T>
              </div>
            </div>
          </div>

          {/* Side by side: what each position saw and predicted */}
          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Without mask */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                padding: 12,
                borderRadius: 10,
                background: `${C.red}06`,
                border: `1px solid ${C.red}20`,
              }}
            >
              <T color={C.red} bold center size={16}>
                No Mask (Bidirectional)
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                Every position sees the full sequence
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {words.map((w, i) => (
                  <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: `${C.red}08` }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <T color={wColors[i]} bold size={14}>
                        "{w}"
                      </T>
                      <T color={C.dim} size={12}>
                        saw:
                      </T>
                      {words.map((sw, si) => (
                        <span
                          key={si}
                          style={{
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: `${C.green}15`,
                            color: C.green,
                            fontSize: 12,
                          }}
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                    <T color={C.red} size={12} style={{ marginTop: 3 }}>
                      → saw the answer before predicting
                    </T>
                  </div>
                ))}
              </div>
              <div
                style={{ marginTop: 10, padding: 8, borderRadius: 6, background: `${C.red}12`, textAlign: "center" }}
              >
                <T color={C.red} bold size={16}>
                  0 usable training examples
                </T>
                <T color={C.dim} size={13}>
                  Every prediction "saw the answer"
                </T>
              </div>
            </div>

            {/* With causal mask */}
            <div
              style={{
                flex: 1,
                minWidth: 200,
                padding: 12,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Causal Mask
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                Each position sees only past + self
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { sees: ["The"], pred: "cat" },
                  { sees: ["The", "cat"], pred: "sat" },
                  { sees: ["The", "cat", "sat"], pred: "on" },
                  { sees: ["The", "cat", "sat", "on"], pred: "the" },
                ].map(({ sees, pred }, i) => (
                  <div key={i} style={{ padding: "6px 8px", borderRadius: 6, background: `${C.green}08` }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <T color={wColors[i]} bold size={14}>
                        "{words[i]}"
                      </T>
                      <T color={C.dim} size={12}>
                        saw:
                      </T>
                      {sees.map((sw, si) => (
                        <span
                          key={si}
                          style={{
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: `${wColors[si]}15`,
                            color: wColors[si],
                            fontSize: 12,
                          }}
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                      <T color={C.dim} size={12}>
                        → predicts
                      </T>
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: 3,
                          background: `${C.green}20`,
                          color: C.green,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        "{pred}"
                      </span>
                      <span
                        style={{
                          padding: "1px 5px",
                          borderRadius: 3,
                          background: `${C.green}15`,
                          color: C.green,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        HONEST
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{ marginTop: 10, padding: 8, borderRadius: 6, background: `${C.green}12`, textAlign: "center" }}
              >
                <T color={C.green} bold size={16}>
                  4 usable training examples!
                </T>
                <T color={C.dim} size={13}>
                  Each prediction was made without peeking
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.blue}08`,
              border: `1px solid ${C.blue}20`,
            }}
          >
            <T color="#90caf9" bold center>
              This is why causal masking exists during training
            </T>
            <T color="#90caf9" center size={15} style={{ marginTop: 4 }}>
              From one forward pass with N tokens, you get <strong>N honest next-token predictions</strong> to learn
              from. Without the mask, you'd get zero - the model would "cheat" at every position, then completely fail
              at actual generation.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 7 && (
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

      {/* Sub 7: Encoder-only architecture */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Three architectures - who uses what mask and why
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder-only */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.cyan}20`,
                  border: `1px solid ${C.cyan}40`,
                }}
              >
                <T color={C.cyan} bold size={14} center>
                  ENCODER-ONLY
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                BERT, RoBERTa
              </T>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 24px)", gap: 3 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: 4, background: `${C.cyan}30` }} />
                ))}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Full matrix - all cells active
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#80deea" size={16}>
                  <strong>No mask</strong> - every word sees every other word (bidirectional).
                </T>
                <T color="#80deea" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The encoder's job is to <strong>understand</strong> the full input. When
                  classifying "The bank by the river", "bank" NEEDS to see "river" (which comes after it) to know it
                  means riverbank, not a financial bank. Hiding future words would cripple understanding.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: text classification, sentiment analysis, question answering, named entity recognition.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub === 7 && (
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

      {/* Sub 8: Decoder-only architecture */}
      <Reveal when={sub >= 8}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Decoder-only */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.orange}20`,
                  border: `1px solid ${C.orange}40`,
                }}
              >
                <T color={C.orange} bold size={14} center>
                  DECODER-ONLY
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                GPT, Claude, LLaMA
              </T>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 24px)", gap: 3 }}>
                {Array.from({ length: 16 }).map((_, i) => {
                  const r = Math.floor(i / 4),
                    col = i % 4;
                  const on = col <= r;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: on ? `${C.orange}30` : "rgba(255,255,255,0.04)",
                      }}
                    />
                  );
                })}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Lower triangle only - upper triangle masked
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#ffcc80" size={16}>
                  <strong>Causal mask</strong> - each word only sees past words + itself.
                </T>
                <T color="#ffcc80" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The decoder <strong>generates</strong> text one token at a time. At generation
                  step 3, token 4 doesn't exist yet - attending to it would be looking at something that isn't there.
                  During training, the full sentence is fed at once for speed, so we use the mask to simulate the
                  generation condition. Without it, the model would "cheat" by seeing the answer, then fail at actual
                  generation.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: text generation, chatbots, code completion, reasoning - all modern LLMs.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      {sub === 8 && (
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

      {/* Sub 9: Encoder-decoder architecture + core rule summary */}
      <Reveal when={sub >= 9}>
        <Box color={C.green} style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder-decoder */}
            <div
              style={{
                padding: "14px",
                borderRadius: 10,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.purple}20`,
                  border: `1px solid ${C.purple}40`,
                }}
              >
                <T color={C.purple} bold size={14} center>
                  ENCODER-DECODER
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4, marginBottom: 8 }}>
                Original Transformer, T5, BART
              </T>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <T color={C.cyan} size={10} center>
                    encoder
                  </T>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 20px)", gap: 2 }}>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: 3, background: `${C.cyan}30` }} />
                    ))}
                  </div>
                </div>
                <T color={C.dim} size={16} style={{ paddingBottom: 16 }}>
                  +
                </T>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <T color={C.orange} size={10} center>
                    decoder
                  </T>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 20px)", gap: 2 }}>
                    {Array.from({ length: 16 }).map((_, i) => {
                      const r = Math.floor(i / 4),
                        col = i % 4;
                      const on = col <= r;
                      return (
                        <div
                          key={i}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 3,
                            background: on ? `${C.orange}30` : "rgba(255,255,255,0.04)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Encoder: full matrix + Decoder: lower triangle
              </T>
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <T color="#b8a9ff" size={16}>
                  <strong>Both</strong> - encoder uses no mask, decoder uses causal mask, plus cross-attention
                  connecting them.
                </T>
                <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
                  <strong>Why?</strong> The input (e.g., English sentence) already exists fully - the encoder should see
                  all of it. But the output (e.g., Hindi translation) is generated word by word - the decoder must not
                  peek ahead. Cross-attention lets the decoder look at the encoder's full understanding while still
                  generating left-to-right.
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  Used for: translation, summarization, any "input → different output" task.
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              The core rule is simple
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
              If the text <strong>already exists</strong> (input you're reading) → no mask needed, let every word see
              everything for maximum understanding.
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 2 }}>
              If the text is <strong>being generated</strong> (output you're writing) → causal mask required, because
              future words don't exist yet.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
};

// ═══════ CH: Cross-Attention - The Encoder-Decoder Bridge ═══════

export const CrossAttention = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  /* English (encoder) and Hindi (decoder) tokens for translation example */
  const encWords = ["I", "love", "cats"];
  const encColors = [C.cyan, C.blue, C.purple];
  /* Hindi word order is SOV: "Mujhe billiyaan pasand hain" = "to-me cats liking are" */
  const decWords = ["Mujhe", "billiyaan", "pasand", "hain"];
  const decColors = [C.orange, C.yellow, C.orange, C.yellow];

  /* Fake scores: each decoder token's Q dot-producted with each encoder token's K */
  const crossScores = [
    [2.8, 0.4, 0.3] /* Mujhe → mostly looks at "I" (subject) */,
    [0.3, 0.7, 3.4] /* billiyaan → mostly looks at "cats" (direct object) */,
    [0.5, 3.1, 0.6] /* pasand → mostly looks at "love" (verb meaning) */,
    [0.4, 2.7, 0.5] /* hain → mostly looks at "love" (helper verb) */,
  ];

  /* Softmax each row */
  const softmaxRow = (row) => {
    const maxV = Math.max(...row);
    const exps = row.map((v) => Math.exp(v - maxV));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  };
  const crossProbs = crossScores.map((row) => softmaxRow(row));

  const Cell = ({ val, color, bold, size = 15 }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px 2px",
        borderRadius: 5,
        background: `${color}08`,
        minWidth: 52,
      }}
    >
      <span style={{ fontFamily: "monospace", fontSize: size, color, fontWeight: bold ? 700 : 400 }}>{val}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The setup - encoder output meets decoder */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The setup: translating "I love cats" to Hindi
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The encoder has processed the English sentence. Each word is now a rich contextual vector - "love" doesn't
            just mean "love" anymore, it means "love in the context of I-love-cats".
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Encoder output */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Encoder output (English - fully processed)
              </T>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                {encWords.map((w, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "4px 14px",
                        borderRadius: 6,
                        background: `${encColors[i]}18`,
                        border: `1px solid ${encColors[i]}35`,
                        color: encColors[i],
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {w}
                    </span>
                    <span style={{ color: C.dim, fontSize: 11 }}>768 dims</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                These vectors are the encoder's final output - rich with context
              </T>
            </div>

            {/* Arrow */}
            <T color={C.dim} size={20} center>
              ↓ feeds into decoder's cross-attention
            </T>

            {/* Decoder in progress */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Decoder (Hindi - generating word by word)
              </T>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                {decWords.map((w, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        padding: "4px 14px",
                        borderRadius: 6,
                        background: `${decColors[i]}18`,
                        border: `1px solid ${decColors[i]}35`,
                        color: decColors[i],
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {w}
                    </span>
                    <span style={{ color: C.dim, fontSize: 11 }}>{i < 3 ? "generated" : "next?"}</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                The decoder needs to look at the English to know what to generate next
              </T>
            </div>
          </div>

          <T color="#80deea" style={{ marginTop: 10 }}>
            The decoder's self-attention lets Hindi words look at other Hindi words. But how does the decoder look at
            the <strong>English</strong> words? That's what cross-attention does.
          </T>
        </Box>
      )}

      {/* Sub 1: Q from decoder, K and V from encoder */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The key idea: Q from decoder, K and V from encoder
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            In self-attention, Q, K, and V all come from the same sentence. In cross-attention, they come from{" "}
            <strong>different</strong> sources:
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                role: "Query (Q)",
                source: "Decoder (Hindi)",
                why: 'The decoder is asking: "what English word should I pay attention to right now?"',
                color: C.orange,
                icon: "Q",
              },
              {
                role: "Key (K)",
                source: "Encoder (English)",
                why: "The encoder's words offer their 'labels' for matching - \"I'm the subject\", \"I'm the verb\"",
                color: C.cyan,
                icon: "K",
              },
              {
                role: "Value (V)",
                source: "Encoder (English)",
                why: "The encoder's words offer their actual content - the rich contextual meaning to borrow from",
                color: C.cyan,
                icon: "V",
              },
            ].map(({ role, source, why, color, icon }) => (
              <div
                key={role}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}15`,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${color}20`,
                    border: `1px solid ${color}40`,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color, fontWeight: 800, fontSize: 20 }}>{icon}</span>
                </div>
                <div>
                  <T color={color} bold size={16}>
                    {role} ← {source}
                  </T>
                  <T color={C.dim} size={15} style={{ marginTop: 2 }}>
                    {why}
                  </T>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              Same formula: Attention(Q, K, V) = softmax( Q·K<sup>T</sup> / √d<sub>k</sub> ) · V
            </T>
            <T color="#ffe082" center size={15} style={{ marginTop: 2 }}>
              The math is identical to self-attention. Only the source of Q, K, V changes.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 2: Concrete computation with scores */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Tracing cross-attention: Hindi Q meets English K
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Each Hindi word's Query asks "which English word is most relevant to me?" The score matrix is{" "}
            <strong>not square</strong> - it's 4 Hindi rows x 3 English columns:
          </T>

          {/* Score matrix */}
          <T color={C.dim} size={12} center style={{ marginTop: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
            cross-attention scores (Q·K<sup>T</sup> / √d<sub>k</sub>)
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `130px repeat(${encWords.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "right", paddingRight: 4 }}>
                <T color={C.dim} size={11}>
                  decoder Q ↓
                </T>
                <T color={C.dim} size={11}>
                  encoder K →
                </T>
              </div>
              {encWords.map((w, i) => (
                <T key={i} color={encColors[i]} size={15} bold center>
                  {w}
                </T>
              ))}
              {crossScores.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={decColors[ri]} size={14} bold style={{ textAlign: "right", paddingRight: 4 }}>
                    "{decWords[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isMax = v === Math.max(...row);
                    return <Cell key={ci} val={v.toFixed(1)} color={isMax ? C.green : C.dim} bold={isMax} />;
                  })}
                </div>
              ))}
            </div>
          </div>

          <T color={C.dim} size={20} center style={{ margin: "6px 0" }}>
            ↓ softmax (each row)
          </T>

          {/* Probability matrix */}
          <T color={C.dim} size={12} center style={{ letterSpacing: 1.5, textTransform: "uppercase" }}>
            attention weights
          </T>
          <div style={{ marginTop: 4, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `130px repeat(${encWords.length}, 1fr)`,
                gap: 4,
                alignItems: "center",
              }}
            >
              <div></div>
              {encWords.map((w, i) => (
                <T key={i} color={encColors[i]} size={14} bold center>
                  {w}
                </T>
              ))}
              {crossProbs.map((row, ri) => (
                <div key={ri} style={{ display: "contents" }}>
                  <T color={decColors[ri]} size={14} bold style={{ textAlign: "right", paddingRight: 4 }}>
                    "{decWords[ri]}" →
                  </T>
                  {row.map((v, ci) => {
                    const isHigh = v > 0.5;
                    return <Cell key={ci} val={v.toFixed(2)} color={isHigh ? C.green : C.dim} bold={isHigh} />;
                  })}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                hi: "Mujhe",
                en: "I",
                pct: crossProbs[0][0],
                c: C.orange,
                note: '"Mujhe" (I/to-me) focuses on "I" - the subject/experiencer',
              },
              {
                hi: "billiyaan",
                en: "cats",
                pct: crossProbs[1][2],
                c: C.yellow,
                note: '"billiyaan" (cats) focuses on "cats" - direct translation of the object',
              },
              {
                hi: "pasand",
                en: "love",
                pct: crossProbs[2][1],
                c: C.orange,
                note: '"pasand" (liking/love) focuses on "love" - the core verb meaning',
              },
              {
                hi: "hain",
                en: "love",
                pct: crossProbs[3][1],
                c: C.yellow,
                note: '"hain" (auxiliary "are/is") aligns with "love" to complete the predicate',
              },
            ].map(({ hi, en, pct, c, note }) => (
              <div
                key={hi}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 16, minWidth: 110 }}>"{hi}"</span>
                <span style={{ color: C.dim, fontSize: 14 }}>→</span>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>
                  {(pct * 100).toFixed(0)}% on "{en}"
                </span>
                <T color={C.dim} size={13} style={{ marginLeft: "auto" }}>
                  {note}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Self-attention vs cross-attention comparison */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Self-attention vs Cross-attention
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Same formula, different wiring:
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Self-attention */}
            <div
              style={{
                flex: 1,
                minWidth: 180,
                padding: "12px",
                borderRadius: 10,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.cyan}20`,
                  border: `1px solid ${C.cyan}40`,
                }}
              >
                <T color={C.cyan} bold size={14} center>
                  SELF-ATTENTION
                </T>
              </div>
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 6, background: `${C.cyan}10` }}>
                <T color={C.cyan} bold center size={14}>
                  Same Sentence
                </T>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {["Q", "K", "V"].map((r) => (
                  <div key={r} style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                    <T color={C.cyan} bold size={16} center>
                      {r}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                Q, K, V all from the same sentence. Words attend to each other within one language.
              </T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                Score matrix is <strong style={{ color: C.cyan }}>square</strong> (N x N)
              </T>
            </div>

            {/* Cross-attention */}
            <div
              style={{
                flex: 1,
                minWidth: 180,
                padding: "12px",
                borderRadius: 10,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.purple}20`,
                  border: `1px solid ${C.purple}40`,
                }}
              >
                <T color={C.purple} bold size={14} center>
                  CROSS-ATTENTION
                </T>
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.orange}10` }}>
                  <T color={C.orange} bold center size={14}>
                    Decoder
                  </T>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: 6, background: `${C.cyan}10` }}>
                  <T color={C.cyan} bold center size={14}>
                    Encoder
                  </T>
                </div>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.orange}15` }}>
                  <T color={C.orange} bold size={16} center>
                    Q
                  </T>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                  <T color={C.cyan} bold size={16} center>
                    K
                  </T>
                </div>
                <div style={{ padding: "4px 10px", borderRadius: 5, background: `${C.cyan}15` }}>
                  <T color={C.cyan} bold size={16} center>
                    V
                  </T>
                </div>
              </div>
              <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                Q from decoder, K and V from encoder. Decoder attends to encoder's output.
              </T>
              <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                Score matrix is <strong style={{ color: C.purple }}>rectangular</strong> (M x N)
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center>
              Each decoder layer has BOTH types of attention:
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
              1. <strong>Masked self-attention</strong> - Hindi words look at other Hindi words (with causal mask)
            </T>
            <T color="#ffe082" size={16} style={{ marginTop: 2 }}>
              2. <strong>Cross-attention</strong> - Hindi words look at English words (no mask - the full English
              sentence already exists)
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Encoder runs ONCE, all decoder layers reuse same K,V */}
      {/* Sub 4: Misconception vs Reality */}
      <Reveal when={sub >= 4}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            Critical detail: the encoder runs ONCE
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            A common misconception is that encoder layer 1 feeds decoder layer 1, encoder layer 2 feeds decoder layer 2,
            etc. That's <strong>not</strong> how it works.
          </T>

          {/* Misconception vs Reality side by side - centered */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            {/* WRONG: layer-to-layer */}
            <div
              style={{
                width: 200,
                padding: 16,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}25`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.red} bold center size={16}>
                WRONG
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Layer-to-layer mapping
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {[6, 5, 4, 3, 2, 1].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 13,
                        color: C.cyan,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.cyan}12`,
                        fontWeight: 600,
                      }}
                    >
                      E{n}
                    </span>
                    <span style={{ fontSize: 13, color: C.dim }}>→</span>
                    <span
                      style={{
                        fontSize: 13,
                        color: C.orange,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}12`,
                        fontWeight: 600,
                      }}
                    >
                      D{n}
                    </span>
                  </div>
                ))}
              </div>
              {/* X overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 80, color: `${C.red}35`, fontWeight: 900, lineHeight: 1 }}>✗</span>
              </div>
            </div>

            {/* CORRECT: final output → all */}
            <div
              style={{
                width: 220,
                padding: 16,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}25`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.green} bold center size={16}>
                CORRECT
              </T>
              <T color={C.dim} center size={12} style={{ marginTop: 4 }}>
                Only the final layer matters
              </T>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: C.cyan,
                    padding: "4px 12px",
                    borderRadius: 5,
                    background: `${C.cyan}15`,
                    border: `1px solid ${C.cyan}30`,
                    fontWeight: 600,
                  }}
                >
                  Encoder Layer 6 (final)
                </span>
                <span style={{ fontSize: 16, color: C.green, fontWeight: 700 }}>↓</span>
                <span
                  style={{
                    fontSize: 13,
                    color: C.green,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 5,
                    background: `${C.green}15`,
                    border: `1px solid ${C.green}35`,
                  }}
                >
                  K, V (computed once)
                </span>
                <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span key={n} style={{ fontSize: 14, color: `${C.green}70` }}>
                      ↓
                    </span>
                  ))}
                </div>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span
                    key={n}
                    style={{
                      fontSize: 12,
                      color: C.orange,
                      padding: "2px 10px",
                      borderRadius: 4,
                      background: `${C.orange}08`,
                      border: `1px solid ${C.orange}12`,
                    }}
                  >
                    Decoder Layer {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}15`,
              }}
            >
              <T color="#80deea" size={16}>
                <strong>Encoder:</strong> runs all 6 layers once on "I love cats". The output of layer 6 (the final
                layer) is the encoder's output - 3 contextual vectors, one per English word.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}15`,
              }}
            >
              <T color="#80e8a5" size={16}>
                <strong>K and V:</strong> computed once from the encoder's final output using W<sub>K</sub> and W
                <sub>V</sub> weight matrices. These are then cached and reused.
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
              }}
            >
              <T color="#ffcc80" size={16}>
                <strong>Decoder layers 1-6:</strong> each layer computes its own Q (because the decoder's representation
                changes layer by layer as it gets refined). But K and V are always the same - the encoder's final
                output.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 5: Full architecture flow with SVG */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Complete data flow with dimensions
          </T>
          <T color={C.dim} center size={14} style={{ marginTop: 4 }}>
            d_model = 512, d_k = 64, 8 heads
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 16,
              background: "rgba(0,0,0,0.35)",
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 540 390" style={{ width: "100%", maxWidth: 560 }}>
              <desc>
                Cross-attention architecture showing encoder stack producing K and V projections fanned out to decoder
                layers, where Q comes from decoder while K and V come from encoder output
              </desc>
              {/* Encoder stack (left) - container centered at x=80 */}
              <rect
                x="15"
                y="10"
                width="130"
                height="220"
                rx="8"
                fill={`${C.cyan}08`}
                stroke={C.cyan}
                strokeOpacity="0.25"
              />
              <text x="80" y="30" fill={C.cyan} fontSize="12" fontWeight="700" textAnchor="middle">
                ENCODER
              </text>
              {[6, 5, 4, 3, 2, 1].map((n, i) => (
                <g key={n}>
                  <rect
                    x="30"
                    y={40 + i * 27}
                    width="100"
                    height="22"
                    rx="4"
                    fill={n === 6 ? `${C.cyan}20` : `${C.cyan}08`}
                    stroke={n === 6 ? C.cyan : `${C.cyan}30`}
                    strokeOpacity={n === 6 ? 0.6 : 0.2}
                  />
                  <text x="80" y={55 + i * 27} fill={n === 6 ? C.cyan : C.dim} fontSize="10" textAnchor="middle">
                    {n === 6 ? "Layer 6 (final)" : `Layer ${n}`}
                  </text>
                </g>
              ))}
              <text x="80" y="242" fill={C.dim} fontSize="10" textAnchor="middle">
                "I love cats"
              </text>
              <text x="80" y="256" fill={C.dim} fontSize="9" textAnchor="middle">
                [3 x 512]
              </text>

              {/* Arrow from encoder final to projection box */}
              <line
                x1="145"
                y1="52"
                x2="178"
                y2="52"
                stroke={C.cyan}
                strokeWidth="2"
                strokeOpacity="0.6"
                markerEnd="url(#arrowCyanCA)"
              />

              {/* Projection box: W_K, W_V - wider for dimension text */}
              <rect
                x="182"
                y="12"
                width="166"
                height="90"
                rx="8"
                fill={`${C.green}10`}
                stroke={C.green}
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
              <text x="265" y="30" fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle">
                Projection (once)
              </text>
              <text x="265" y="47" fill="#80e8a5" fontSize="10" textAnchor="middle">
                K = encoder_out · W_K
              </text>
              <text x="265" y="63" fill="#80e8a5" fontSize="10" textAnchor="middle">
                V = encoder_out · W_V
              </text>
              <text x="265" y="82" fill={C.dim} fontSize="9" textAnchor="middle">
                [3 x 512] · [512 x 64] = [3 x 64]
              </text>
              <text x="265" y="96" fill={C.dim} fontSize="8" textAnchor="middle">
                (per head)
              </text>

              {/* Arrow from projection to K,V cache */}
              <line
                x1="265"
                y1="102"
                x2="265"
                y2="120"
                stroke={C.green}
                strokeWidth="1.5"
                strokeOpacity="0.5"
                markerEnd="url(#arrowGreenCA)"
              />

              {/* K,V cache box */}
              <rect
                x="205"
                y="122"
                width="120"
                height="42"
                rx="6"
                fill={`${C.green}15`}
                stroke={C.green}
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
              <text x="265" y="141" fill={C.green} fontSize="11" fontWeight="700" textAnchor="middle">
                K, V CACHE
              </text>
              <text x="265" y="157" fill={C.dim} fontSize="9" textAnchor="middle">
                K: [3 x 64] V: [3 x 64]
              </text>

              {/* Fan-out arrows from K,V cache to all decoder layers */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="325"
                  y1={138 + i * 3}
                  x2="360"
                  y2={55 + i * 50}
                  stroke={C.green}
                  strokeWidth="1.2"
                  strokeOpacity={0.3}
                  strokeDasharray="4,3"
                />
              ))}

              {/* Decoder stack (right) - container centered at x=445 */}
              <rect
                x="360"
                y="10"
                width="170"
                height="340"
                rx="8"
                fill={`${C.orange}06`}
                stroke={C.orange}
                strokeOpacity="0.2"
              />
              <text x="445" y="30" fill={C.orange} fontSize="12" fontWeight="700" textAnchor="middle">
                DECODER
              </text>

              {[6, 5, 4, 3, 2, 1].map((n, i) => (
                <g key={n}>
                  <rect
                    x="372"
                    y={38 + i * 50}
                    width="146"
                    height="40"
                    rx="5"
                    fill={`${C.orange}08`}
                    stroke={C.orange}
                    strokeOpacity="0.2"
                  />
                  <text x="392" y={55 + i * 50} fill={C.dim} fontSize="10" textAnchor="start">
                    Layer {n}
                  </text>
                  {/* Q badge */}
                  <rect x="438" y={44 + i * 50} width="18" height="16" rx="3" fill={`${C.orange}25`} />
                  <text x="447" y={56 + i * 50} fill={C.orange} fontSize="10" fontWeight="700" textAnchor="middle">
                    Q
                  </text>
                  <text x="460" y={56 + i * 50} fill={C.dim} fontSize="9" textAnchor="start">
                    changes
                  </text>
                  {/* K,V badge */}
                  <rect x="438" y={62 + i * 50} width="30" height="14" rx="3" fill={`${C.green}18`} />
                  <text x="453" y={73 + i * 50} fill={C.green} fontSize="9" fontWeight="600" textAnchor="middle">
                    K,V
                  </text>
                  <text x="472" y={73 + i * 50} fill={C.dim} fontSize="9" textAnchor="start">
                    same
                  </text>
                </g>
              ))}

              <text x="445" y="367" fill={C.dim} fontSize="10" textAnchor="middle">
                "Mujhe billiyaan pasand hain"
              </text>
              <text x="445" y="382" fill={C.dim} fontSize="9" textAnchor="middle">
                [4 x 512]
              </text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowCyanCA" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <path d="M0,0 L7,2.5 L0,5" fill={C.cyan} fillOpacity="0.6" />
                </marker>
                <marker id="arrowGreenCA" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <path d="M0,0 L7,2.5 L0,5" fill={C.green} fillOpacity="0.6" />
                </marker>
              </defs>
            </svg>
          </div>
        </Box>
      </Reveal>

      {/* Sub 6: Layer-by-layer math + dimensions + efficiency */}
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            What happens at each decoder layer
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Every decoder layer performs cross-attention with the <strong>exact same K and V</strong>, but a{" "}
            <strong>different Q</strong>:
          </T>
          <div
            style={{
              marginTop: 10,
              fontFamily: "monospace",
              padding: 12,
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.purple}15`,
            }}
          >
            {[1, 2, 6].map((n, i) => (
              <div
                key={n}
                style={{ marginTop: i > 0 ? 6 : 0, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}
              >
                <span style={{ color: C.orange, fontSize: 14 }}>Layer {n}:</span>
                <span style={{ color: C.dim, fontSize: 13 }}>Attn(</span>
                <span style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>
                  Q<sub style={{ fontSize: 10 }}>{n}</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>,</span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>K</span>
                <span style={{ color: C.dim, fontSize: 13 }}>,</span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>V</span>
                <span style={{ color: C.dim, fontSize: 13 }}>) = softmax(</span>
                <span style={{ color: C.orange, fontSize: 14, fontWeight: 700 }}>
                  Q<sub style={{ fontSize: 10 }}>{n}</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}> · </span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>
                  K<sup style={{ fontSize: 10 }}>T</sup>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}> / √64) · </span>
                <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>V</span>
                {n === 2 && <span style={{ color: C.dim, fontSize: 12, marginLeft: 8 }}>... same K, V</span>}
                {i === 1 && (
                  <div style={{ width: "100%", textAlign: "center", color: C.dim, fontSize: 12, margin: "2px 0" }}>
                    ⋮
                  </div>
                )}
              </div>
            ))}
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 8 }}>
            Q<sub>1</sub> comes from the decoder's layer 1 output. Q<sub>6</sub> comes from layer 6's output. The
            decoder's representation evolves layer by layer - Q captures "what I'm looking for" at each stage of
            refinement. K and V capture "what the encoder said" - and that never changes.
          </T>

          {/* Dimension walkthrough */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <T color={C.yellow} bold center size={17}>
              Dimension walkthrough (d_model = 512, heads = 8, d_k = 64)
            </T>
            {[
              { label: "Encoder output", dims: "[3 x 512]", detail: "3 English tokens, each 512 dims", color: C.cyan },
              {
                label: "W_K projection",
                dims: "[512 x 64]",
                detail: "per head, learned during training",
                color: C.green,
              },
              { label: "K (cached)", dims: "[3 x 64]", detail: "3 keys, one per English token", color: C.green },
              { label: "V (cached)", dims: "[3 x 64]", detail: "3 values, one per English token", color: C.green },
              {
                label: "Decoder layer n",
                dims: "[4 x 512]",
                detail: "4 Hindi tokens, each 512 dims",
                color: C.orange,
              },
              { label: "Q_n (per layer)", dims: "[4 x 64]", detail: "4 queries, changes each layer", color: C.orange },
              {
                label: "Q_n · K^T scores",
                dims: "[4 x 3]",
                detail: "every Hindi word scores every English word",
                color: C.yellow,
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: `${row.color}06`,
                  border: `1px solid ${row.color}12`,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: row.color, fontWeight: 700, fontSize: 14, minWidth: 140 }}>{row.label}</span>
                <span
                  style={{ fontFamily: "monospace", color: row.color, fontSize: 15, fontWeight: 700, minWidth: 70 }}
                >
                  {row.dims}
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>{row.detail}</span>
              </div>
            ))}
          </div>

          {/* Efficiency + weight matrix detail */}
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <T color={C.yellow} bold center>
                Why is this efficient?
              </T>
              <T color="#ffe082" size={15} style={{ marginTop: 4 }}>
                The encoder runs <strong>once</strong>. K and V are computed <strong>once</strong>. Only Q changes per
                decoder layer. For a 1000-token input, this saves computing 1000-token K and V six times - a 6x
                reduction in encoder-side computation.
              </T>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}15`,
              }}
            >
              <T color="#ef9a9a" bold center>
                6 weight matrices per layer
              </T>
              <T color="#ef9a9a" size={15} style={{ marginTop: 4 }}>
                Each decoder layer has <strong>6</strong> separate learned matrices: W<sub>Q</sub>, W<sub>K</sub>, W
                <sub>V</sub> for masked self-attention (Q, K, V all from Hindi) + W<sub>Q</sub>, W<sub>K</sub>, W
                <sub>V</sub> for cross-attention (Q from Hindi, K and V from English). All learned independently.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 7: Where cross-attention appears */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Where does cross-attention live?
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "12px",
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.orange}20`,
                  border: `1px solid ${C.orange}40`,
                }}
              >
                <T color={C.orange} bold size={14} center>
                  Decoder-Only
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                GPT, Claude, LLaMA
              </T>
              <T color="#ffcc80" bold center size={18} style={{ marginTop: 6 }}>
                No cross-attention at all
              </T>
              <T color={C.dim} size={15} center style={{ marginTop: 4 }}>
                There's no encoder, so nothing to cross-attend to. The decoder handles everything with just
                self-attention. Your prompt and the response are one continuous sequence.
              </T>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: 10,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}15`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 5,
                  background: `${C.purple}20`,
                  border: `1px solid ${C.purple}40`,
                }}
              >
                <T color={C.purple} bold size={14} center>
                  Encoder-Decoder
                </T>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Original Transformer, T5, BART
              </T>
              <T color="#b8a9ff" bold center size={18} style={{ marginTop: 6 }}>
                Cross-attention in every decoder layer
              </T>
              <T color={C.dim} size={15} center style={{ marginTop: 4 }}>
                Each decoder layer has three sub-layers in order:
              </T>
              <div
                style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 340 }}
              >
                {[
                  { n: "1", label: "Masked self-attention", desc: "Hindi looks at Hindi (causal)", color: C.orange },
                  { n: "2", label: "Cross-attention", desc: "Hindi looks at English (full)", color: C.purple },
                  { n: "3", label: "Feed-forward network", desc: "Process each position independently", color: C.blue },
                ].map(({ n, label, desc, color }) => (
                  <div
                    key={n}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: `${color}08`,
                      border: `1px solid ${color}15`,
                    }}
                  >
                    <span style={{ color, fontWeight: 800, fontSize: 18, minWidth: 20 }}>{n}.</span>
                    <div>
                      <T color={color} bold size={15}>
                        {label}
                      </T>
                      <T color={C.dim} size={13}>
                        {desc}
                      </T>
                    </div>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 6 }}>
                This is exactly what the architecture diagram in chapter 5.1 shows - the green arrow "K, V from encoder"
                connects to this cross-attention layer.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}15`,
            }}
          >
            <T color="#80e8a5" bold center>
              Cross-attention is elegant but optional
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 4 }}>
              Modern LLMs prove you can get world-class results without it. But for tasks with clear input/output
              separation (translation, summarization), the encoder-decoder architecture with cross-attention remains
              powerful.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 7 && (
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
};

// ═══════ CH 17.5: Attention Flow - Shapes at Every Step ═══════

export const AttentionShapes = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const WORDS = ["I", "love", "cats"];

  // A single matrix tile. Symmetric padding keeps the rect centered in the SVG
  // bounding box so rects line up vertically across different label configs.
  const Mat = ({ rows, cols, name, color, unit = 24, rowLabels = null, colLabels = null, nameSub = null }) => {
    const w = cols * unit;
    const h = rows * unit;
    const sidePad = rowLabels ? 44 : 0;
    const vPad = colLabels ? 18 : 0;
    const svgW = w + 2 * sidePad;
    const svgH = h + 2 * vPad;
    const lines = [];
    for (let r = 1; r < rows; r++) {
      lines.push(
        <line key={`h${r}`} x1={0} y1={r * unit} x2={w} y2={r * unit} stroke={`${color}66`} strokeWidth="0.75" />,
      );
    }
    for (let c = 1; c < cols; c++) {
      lines.push(
        <line key={`v${c}`} x1={c * unit} y1={0} x2={c * unit} y2={h} stroke={`${color}66`} strokeWidth="0.75" />,
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg
          width={svgW}
          height={svgH}
          viewBox={`${-sidePad} ${-vPad} ${svgW} ${svgH}`}
          style={{ overflow: "visible" }}
        >
          <desc>
            Matrix tile {name}: {rows} rows by {cols} columns.
          </desc>
          {rowLabels &&
            rowLabels.map((lbl, i) => (
              <text
                key={`rl-${i}`}
                x={-6}
                y={i * unit + unit / 2 + 4}
                fontSize="11"
                fill={color}
                textAnchor="end"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            ))}
          {colLabels &&
            colLabels.map((lbl, i) => (
              <text
                key={`cl-${i}`}
                x={i * unit + unit / 2}
                y={-5}
                fontSize="11"
                fill={color}
                textAnchor="middle"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            ))}
          <rect x={0} y={0} width={w} height={h} fill={`${color}18`} stroke={`${color}99`} strokeWidth="1.2" rx="4" />
          {lines}
        </svg>
        <T color={color} bold size={15} center>
          {name}
          {nameSub && <sub style={{ fontSize: "0.75em", marginLeft: 1 }}>{nameSub}</sub>}
        </T>
        <T color={C.dim} mono size={12} center>
          {rows} × {cols}
        </T>
      </div>
    );
  };

  // Op wraps its glyph in a flex column with an invisible spacer below. The
  // spacer matches the (name + shape) label block under every Mat, so when
  // Op sits in a flex row with alignItems:center, its glyph lines up with the
  // Mat's rect-center (not with the wrapper-center, which sits between rect
  // and labels).
  const Op = ({ children, size = 24 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <T color={C.dim} bold size={size}>
        {children}
      </T>
      <span aria-hidden="true" style={{ visibility: "hidden", fontSize: 15, fontWeight: 700, lineHeight: 1.75 }}>
        &nbsp;
      </span>
      <span aria-hidden="true" style={{ visibility: "hidden", fontSize: 12, lineHeight: 1.75 }}>
        &nbsp;
      </span>
    </div>
  );

  // A straight down-arrow with an optional label beside it.
  const ArrowDown = ({ label, color = C.dim, labelColor, height = 38 }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={24} height={height} viewBox={`0 0 24 ${height}`} style={{ overflow: "visible" }}>
        <desc>Downward arrow connector</desc>
        <line x1={12} y1={0} x2={12} y2={height - 6} stroke={color} strokeWidth="1.5" />
        <polygon points={`12,${height} 7,${height - 8} 17,${height - 8}`} fill={color} />
      </svg>
      {label && (
        <T color={labelColor || C.dim} size={12} center>
          {label}
        </T>
      )}
    </div>
  );

  // A one-to-many split arrow. Tips land at column centers of an n-equal-column
  // grid of the same width (i.e., at w/(2n), 3w/(2n), ..., (2n-1)w/(2n)) so the
  // arrows point at matrix columns exactly below them.
  const SplitDown = ({ n = 3, width = 420, color = C.dim, label, stemTop = 6, barY = 16, arrowBottom = 38 }) => {
    const positions = Array.from({ length: n }, (_, i) => Math.round(((2 * i + 1) * width) / (2 * n)));
    const centerX = Math.round(width / 2);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={width} height={arrowBottom + 4} viewBox={`0 0 ${width} ${arrowBottom + 4}`}>
          <desc>Split arrow from one source at top to {n} destinations below.</desc>
          <line x1={centerX} y1={stemTop} x2={centerX} y2={barY} stroke={color} strokeWidth="1.5" />
          <line x1={positions[0]} y1={barY} x2={positions[n - 1]} y2={barY} stroke={color} strokeWidth="1.5" />
          {positions.map((x, i) => (
            <g key={i}>
              <line x1={x} y1={barY} x2={x} y2={arrowBottom - 6} stroke={color} strokeWidth="1.5" />
              <polygon points={`${x},${arrowBottom} ${x - 5},${arrowBottom - 8} ${x + 5},${arrowBottom - 8}`} fill={color} />
            </g>
          ))}
        </svg>
        {label && (
          <T color={C.dim} size={12} center>
            {label}
          </T>
        )}
      </div>
    );
  };

  // A row with n equal columns. Each child lands centered in its column, so
  // the vertical line through a column passes through every element's center
  // (matrices in one row, arrows in the next row, matrices in the row after).
  const GridRow = ({ n, children }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        justifyItems: "center",
        alignItems: "start",
        rowGap: 0,
      }}
    >
      {children}
    </div>
  );

  // A many-to-one merge arrow: n stems come down, meet on a horizontal bar,
  // then a single arrow drops to the bottom-center destination. Stems land at
  // the same column centers as an n-equal-column grid of this width, so they
  // line up with matrix centers in the row above.
  const MergeDown = ({ n = 2, width = 360, color = C.dim, label, stemBottom = 16, arrowBottom = 38 }) => {
    const positions = Array.from({ length: n }, (_, i) => Math.round(((2 * i + 1) * width) / (2 * n)));
    const centerX = Math.round(width / 2);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={width} height={arrowBottom + 4} viewBox={`0 0 ${width} ${arrowBottom + 4}`}>
          <desc>Merge arrow from {n} sources above into one destination below.</desc>
          {positions.map((x, i) => (
            <line key={`s${i}`} x1={x} y1={0} x2={x} y2={stemBottom} stroke={color} strokeWidth="1.5" />
          ))}
          <line x1={positions[0]} y1={stemBottom} x2={positions[n - 1]} y2={stemBottom} stroke={color} strokeWidth="1.5" />
          <line x1={centerX} y1={stemBottom} x2={centerX} y2={arrowBottom - 6} stroke={color} strokeWidth="1.5" />
          <polygon
            points={`${centerX},${arrowBottom} ${centerX - 5},${arrowBottom - 8} ${centerX + 5},${arrowBottom - 8}`}
            fill={color}
          />
        </svg>
        {label && (
          <T color={C.dim} size={12} center>
            {label}
          </T>
        )}
      </div>
    );
  };

  // Row that lines up a list of matrices with a given horizontal gap. Used for
  // the per-head triples (W_Q, W_K, W_V) and (Q, K, V), and for the two-head
  // concat row.
  const MatRow = ({ children, gap = 40 }) => (
    <div style={{ display: "flex", gap, justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Attention matrix computation - one full flow
          </T>
          <T color="#80deea" center style={{ marginTop: 6 }}>
            Teaching scale: <strong>3 tokens, d_model = 4, d_k = 2, 2 heads</strong>. Sentence:{" "}
            <strong>"I love cats"</strong>. In every matrix with 3 rows, row 1 is "I", row 2 is "love", row 3 is
            "cats" - each word keeps its row the whole way.
          </T>

          {/* ── Single-head flow: X -> W_Q/W_K/W_V -> Q/K/V -> Q·K^T -> softmax -> weights·V -> head output ── */}
          {/* Inner column is capped so the 3-column grid is narrow enough that
              split-arrow tips actually land under the matrices in the grid below. */}
          <div
            style={{
              marginTop: 18,
              width: "100%",
              maxWidth: 560,
              margin: "18px auto 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Row 1: X (single, centered) */}
            <Mat rows={3} cols={4} name="X" color={C.blue} rowLabels={WORDS} />

            {/* Split into three weight matrices — tips align with the 3-col grid below */}
            <SplitDown n={3} width={560} label="copy X, multiply by three different weight matrices" />

            {/* Row 2: W_Q, W_K, W_V — 3 equal-width columns */}
            <div style={{ width: "100%" }}>
              <GridRow n={3}>
                <Mat rows={4} cols={2} name="W_Q" color={C.purple} />
                <Mat rows={4} cols={2} name="W_K" color={C.orange} />
                <Mat rows={4} cols={2} name="W_V" color={C.green} />
              </GridRow>
            </div>

            {/* Three parallel down arrows — same 3-col grid so they land under
                the matrices above and above the matrices below. */}
            <div style={{ width: "100%", marginTop: 6 }}>
              <GridRow n={3}>
                <ArrowDown label="X · W_Q" height={32} />
                <ArrowDown label="X · W_K" height={32} />
                <ArrowDown label="X · W_V" height={32} />
              </GridRow>
            </div>

            {/* Row 3: Q, K, V — same 3-col grid */}
            <div style={{ width: "100%" }}>
              <GridRow n={3}>
                <Mat rows={3} cols={2} name="Q" color={C.purple} rowLabels={WORDS} />
                <Mat rows={3} cols={2} name="K" color={C.orange} rowLabels={WORDS} />
                <Mat rows={3} cols={2} name="V" color={C.green} rowLabels={WORDS} />
              </GridRow>
            </div>

            {/* Q · K^T = scores, then ÷ √d_k, softmax per row → weights */}
            <ArrowDown label="Q · K^T, then ÷ √d_k, softmax per row" />

            {/* Row 4: attention weights */}
            <Mat rows={3} cols={3} name="attention weights" color={C.yellow} rowLabels={WORDS} colLabels={WORDS} />

            {/* ArrowDown feeds into an explicit multiplication row below */}
            <ArrowDown label="blend V rows by each word's attention" />

            {/* Row 5: weights · V = head output (horizontal multiplication so V
                is visible here, not just in the Q/K/V row above). All three
                matrices share the same label layout (rowLabels only, no col
                labels) so their rects line up on the same horizontal axis and
                the · and = sit exactly at rect-center. */}
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 2,
              }}
            >
              <Mat rows={3} cols={3} name="weights" color={C.yellow} rowLabels={WORDS} />
              <Op>{"\u00B7"}</Op>
              <Mat rows={3} cols={2} name="V" color={C.green} rowLabels={WORDS} />
              <Op>=</Op>
              <Mat rows={3} cols={2} name="head output" color={C.red} rowLabels={WORDS} />
            </div>

            <T color="#80deea" size={13} center style={{ marginTop: 12 }}>
              That whole pipeline is <strong>one head</strong>. The model runs this in parallel for every head, each
              with its own W_Q, W_K, W_V.
            </T>
          </div>

          <T color="#80deea" center style={{ marginTop: 14 }}>
            Next we stack the heads. Continue to add the multi-head concat and the final W_O projection.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Multi-head: concat the heads, then project with W_O
          </T>
          <T color="#ffcc80" center style={{ marginTop: 6 }}>
            Every head produced a <strong>3 × 2</strong> output (3 tokens, d_k = 2). With{" "}
            <strong>h = 2 heads</strong>, we have two such tiles. Stack them side-by-side (concat along the column
            axis) to get a 3 × 4 block, then multiply by <strong>W_O</strong> to mix information across heads.
          </T>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              width: "100%",
            }}
          >
            {/* Row A: the two per-head outputs (H1, H2) */}
            <MatRow gap={72}>
              <Mat rows={3} cols={2} name="H" nameSub="1" color={C.red} rowLabels={WORDS} />
              <Mat rows={3} cols={2} name="H" nameSub="2" color={C.red} rowLabels={WORDS} />
            </MatRow>

            {/* Merge into concat block */}
            <div style={{ marginTop: 10 }}>
              <MergeDown n={2} width={260} label="concat along columns" />
            </div>

            {/* Row B: concatenated (3 x 4) */}
            <Mat rows={3} cols={4} name="concat(H₁, H₂)" color={C.yellow} rowLabels={WORDS} />

            <ArrowDown label="· W_O (4 × 4) - mixes info across heads" />

            {/* Row C: Final (3 x 4) - same shape as X */}
            <Mat rows={3} cols={4} name="Final (= attention output)" color={C.cyan} rowLabels={WORDS} />
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}25`,
            }}
          >
            <T color={C.orange} bold center size={15}>
              Shapes in one glance
            </T>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "4px 18px",
                fontFamily: "monospace",
                fontSize: 14,
                textAlign: "left",
                color: C.bright,
              }}
            >
              <span>X</span>
              <span style={{ color: C.dim }}>N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
              <span>W_Q, W_K, W_V (per head)</span>
              <span style={{ color: C.dim }}>d_model × d_k</span>
              <span style={{ color: C.yellow }}>4 × 2</span>
              <span>Q, K, V (per head)</span>
              <span style={{ color: C.dim }}>N × d_k</span>
              <span style={{ color: C.yellow }}>3 × 2</span>
              <span>Q · K^T</span>
              <span style={{ color: C.dim }}>N × N</span>
              <span style={{ color: C.yellow }}>3 × 3</span>
              <span>softmax(/√d_k)</span>
              <span style={{ color: C.dim }}>N × N (rows sum to 1)</span>
              <span style={{ color: C.yellow }}>3 × 3</span>
              <span>weights · V = H_i</span>
              <span style={{ color: C.dim }}>N × d_k</span>
              <span style={{ color: C.yellow }}>3 × 2</span>
              <span>concat(H₁ … H_h)</span>
              <span style={{ color: C.dim }}>N × (h · d_k) = N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
              <span>W_O</span>
              <span style={{ color: C.dim }}>d_model × d_model</span>
              <span style={{ color: C.yellow }}>4 × 4</span>
              <span>Final</span>
              <span style={{ color: C.dim }}>N × d_model</span>
              <span style={{ color: C.yellow }}>3 × 4</span>
            </div>
            <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
              In a real Transformer the same pattern runs with N = sentence length, d_model = 512, h = 8 heads, d_k =
              64. The shape rules are identical.
            </T>
          </div>
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
};

// ═══════ CH 18: Why Multi-Head - The Compromise Problem ═══════

export const WhyMultiHead = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            Single-head attention has a problem.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Our "I love cats" example has only 3 words with 2 main relationships (who loves? what's loved?). To really
            see why one head isn't enough, we need a longer sentence with more relationships.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Consider: "The cat that I adopted last week <strong>sat</strong> on the mat."
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            "sat" needs answers to MULTIPLE questions at once:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { q: "Who sat?", answer: "cat", rel: "subject ↔ verb", color: C.cyan },
              { q: "Sat where?", answer: "mat", rel: "verb ↔ location", color: C.orange },
              { q: "Sat when?", answer: "last week", rel: "verb ↔ time", color: C.purple },
            ].map(({ q, answer, rel, color }) => (
              <div
                key={q}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px auto 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold center size={18}>
                  {q}
                </T>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tag color={color}>{answer}</Tag>
                </div>
                <T color={C.dim} size={14}>
                  {rel}
                </T>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            But one head produces one set of weights - forced to compromise:
          </T>
          <div style={{ marginTop: 8 }}>
            {[
              { w: "cat", pct: 40, c: C.cyan, note: "got some" },
              { w: "mat", pct: 30, c: C.orange, note: "got some" },
              { w: "last week", pct: 5, c: C.purple, note: "almost nothing!" },
              { w: "others", pct: 25, c: C.dim, note: "scattered" },
            ].map(({ w, pct, c, note }) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16, color: C.dim, minWidth: 70, textAlign: "right" }}>{w}</span>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: c }} />
                </div>
                <span style={{ fontSize: 16, color: c, fontWeight: 600, minWidth: 28 }}>{pct}%</span>
                <span style={{ fontSize: 12, color: pct <= 5 ? C.red : C.dim }}>{note}</span>
              </div>
            ))}
          </div>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 8 }}>
            Temporal info ("last week") got only 5% - almost lost! One head can't focus on all relationships.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Solution: give it MULTIPLE heads - like multiple ears.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Each head has its own W_Q, W_K, W_V, so each asks a different question:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { head: 1, label: "subject-verb", q: '"who is my subject?"', finds: "cat (70%)", color: C.cyan },
              { head: 2, label: "verb-location", q: '"where am I happening?"', finds: "mat (65%)", color: C.orange },
              { head: 3, label: "temporal", q: '"when am I happening?"', finds: "week (55%)", color: C.purple },
            ].map(({ head, label, q, finds, color }) => (
              <div
                key={head}
                style={{
                  display: "grid",
                  gridTemplateColumns: "84px 1fr 74px",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <div>
                  <T color={color} bold center size={16}>
                    Head {head}
                  </T>
                  <T color={C.dim} center size={12}>
                    {label}
                  </T>
                </div>
                <T color={C.dim} size={16}>
                  sat asks: {q}
                </T>
                <T color={color} bold center size={16} style={{ textAlign: "right" }}>
                  → {finds}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            Now NO info is lost. Each head specializes in one relationship and captures it fully.
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
};

// ═══════ CH 19: The Split ═══════

export const HeadSplit = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  const headColors = [C.cyan, C.orange, C.purple, C.yellow, C.green, C.pink, C.red, C.blue];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The problem recap */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            One head = one Query arrow = one direction.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Each word's 512-dim embedding produces ONE Query vector through W_Q. That single arrow can only point one
            way, so it can only ask one type of question.
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.dim} size={16}>
              512-dim embedding → W_Q (512×512) → One 512-dim Query
            </T>
            <T color={C.red} bold center size={16} style={{ marginTop: 4 }}>
              One arrow. One question. Information lost.
            </T>
          </div>
          <T color="#ff8a80" style={{ marginTop: 8 }}>
            Solution: don't make one big arrow. Make <strong>8 smaller arrows</strong>, each pointing in its own
            direction.
          </T>
        </Box>
      )}

      {/* Sub 1: The visual split */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Split the 512 dimensions into 8 chunks of 64.
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
            Imagine the embedding as a long bar. We slice it into 8 equal pieces:
          </T>
          {/* Full 512-dim bar */}
          <div style={{ marginTop: 12, padding: "0 4px" }}>
            <T color={C.dim} size={12} center>
              512 dimensions
            </T>
            <div
              style={{
                height: 28,
                borderRadius: 6,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              {headColors.map((c, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: `${c}25`,
                    borderRight: i < 7 ? "2px solid rgba(0,0,0,0.5)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: c }}>H{i + 1}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 2 }}>
              {headColors.map((c, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontSize: 9, color: C.dim }}>64</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            {[
              { l: "Total dimensions:", v: "512" },
              { l: "Number of heads:", v: "8" },
              { l: "Dims per head:", v: "512 / 8 = 64" },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <T color={C.mid} size={16}>
                  {l}
                </T>
                <T color={C.yellow} bold size={18}>
                  {v}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            We don't run the full 512-dim attention 8 times. We split it - same total computation, but 8 independent
            perspectives.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Why the split works - cost vs quality */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            But wait - doesn't splitting lose precision?
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
            Why not give each head the full 512 dims? Let's compare:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Option A: 8 x 512 */}
            <div style={{ padding: "10px", borderRadius: 8, background: `${C.red}06`, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                Option A: 8 heads × 512 dims each
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 3,
                      background: `${C.red}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: C.red }}>512</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Cost: 8 × 512 = <strong style={{ color: C.red }}>4,096 dims total</strong> (8x the compute!)
              </T>
              <T color={C.dim} size={14}>
                Quality per head: very high, but diminishing returns past ~64 dims
              </T>
            </div>
            {/* Option B: 8 x 64 (the split) */}
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}
            >
              <T color={C.green} bold size={16}>
                Option B: 8 heads × 64 dims each (the split)
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                {headColors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 3,
                      background: `${c}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: c }}>64</span>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Cost: 8 × 64 = <strong style={{ color: C.green }}>512 dims total</strong> (same budget as one head!)
              </T>
              <T color={C.dim} size={14}>
                Quality per head: 64 dims is plenty - "is this the subject?" doesn't need 512 numbers to answer
              </T>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.yellow} bold center size={16}>
              The insight: more dims per head = diminishing returns.
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 2 }}>
              Going from 64 to 512 dims per head barely improves quality, but costs 8x more. The split gives you 8
              different perspectives for the price of 1 large one.
            </T>
          </div>
        </Box>
      </Reveal>

      {/* Sub 3: Each chunk gets its own W matrices */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Each head gets its own W_Q, W_K, W_V.
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 4 }}>
            8 heads = 8 independent sets of weight matrices. Each set is smaller (512×64 instead of 512×512):
          </T>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const c = headColors[n - 1];
              return (
                <div
                  key={n}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: `${c}08`,
                    border: `1px solid ${c}15`,
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  <T color={c} bold center size={14}>
                    Head {n}
                  </T>
                  <div style={{ marginTop: 2 }}>
                    <T color={C.dim} size={10}>
                      W_Q W_K W_V
                    </T>
                    <T color={C.dim} size={9}>
                      512×64 each
                    </T>
                  </div>
                </div>
              );
            })}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Same embedding goes into all 8 heads. Each head's different W matrices produce a different Query arrow -
            pointing in a different direction, asking a different question.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: 8 heads, 8 different questions */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            8 arrows, 8 questions, nothing lost.
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 4 }}>
            "sat" in "The cat sat on the mat last week" - each head's Query arrow points differently:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { h: 1, q: "who did the action?", finds: "cat", pct: 70, c: C.cyan },
              { h: 2, q: "where?", finds: "mat", pct: 65, c: C.orange },
              { h: 3, q: "when?", finds: "week", pct: 55, c: C.purple },
              { h: 4, q: "what comes next?", finds: "on", pct: 60, c: C.yellow },
            ].map(({ h, q, finds, pct, c }) => (
              <div
                key={h}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 70px",
                  gap: 6,
                  alignItems: "center",
                  padding: "5px 8px",
                  borderRadius: 5,
                  background: `${c}06`,
                  border: `1px solid ${c}10`,
                }}
              >
                <T color={c} bold center size={14}>
                  Head {h}
                </T>
                <div>
                  <T color={C.dim} size={13}>
                    asks: "{q}"
                  </T>
                  <div
                    style={{
                      height: 5,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 3,
                      overflow: "hidden",
                      marginTop: 2,
                    }}
                  >
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: c }} />
                  </div>
                </div>
                <T color={c} bold size={13} style={{ textAlign: "right" }}>
                  → {finds} {pct}%
                </T>
              </div>
            ))}
            <T color={C.dim} size={12} center>
              ...and heads 5-8 ask about grammar, coreference, proximity, etc.
            </T>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 8 }}>
            Each head specializes. Together they capture everything - no information lost.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Layers stacking - the big picture */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Now zoom out: layers.
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 4 }}>
            A Transformer doesn't have just one set of 8 heads. It stacks multiple layers, each with its own 8 heads:
          </T>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
            }}
          >
            {[
              { layer: "Layer 96", desc: "reasoning, generation", opacity: 1.0 },
              { layer: "...", desc: "", opacity: 0.4 },
              { layer: "Layer 3", desc: "meaning, sentiment", opacity: 0.7 },
              { layer: "Layer 2", desc: "syntax, clause structure", opacity: 0.8 },
              { layer: "Layer 1", desc: "word proximity, basic grammar", opacity: 0.9 },
            ].map(({ layer, desc, opacity }) => (
              <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6, opacity }}>
                <T color={C.green} bold size={14} style={{ minWidth: 65 }}>
                  {layer}
                </T>
                <div style={{ display: "flex", gap: 2, flex: 1 }}>
                  {layer === "..." ? (
                    <T color={C.dim} size={14}>
                      ...
                    </T>
                  ) : (
                    headColors.map((c, i) => (
                      <div key={i} style={{ flex: 1, height: 14, borderRadius: 3, background: `${c}30` }} />
                    ))
                  )}
                </div>
                {desc && (
                  <T color={C.dim} size={11} style={{ minWidth: 80 }}>
                    {desc}
                  </T>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.green} bold center size={18}>
              96 layers × 8 heads = 768 attention patterns
            </T>
            <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
              Each layer reads the previous layer's output. Early layers see raw words. Later layers see increasingly
              abstract, context-rich representations.
            </T>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
            Nobody told the model which layer should handle grammar or reasoning. It organized itself this way during
            training.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
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
};

// ═══════ CH 20: Inside Each Head ═══════

export const InsideEachHead = (ctx) => {
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
                label: "subject-verb",
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
                label: "verb-location",
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
                label: "temporal",
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
};

// ═══════ CH 21: Concat + W_O ═══════

export const ConcatWO = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Step 7 - outputs are separate */}
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The outputs are separate - we need to combine them.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            After the 8 heads finish, each word has 8 separate results. For "love":
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { head: "Head 1 gave:", v: "[0.3, 0.5]", info: 'figured out "I" is the one who loves', c: C.blue },
              { head: "Head 2 gave:", v: "[-0.2, 0.8]", info: 'figured out "cats" is what\'s loved', c: C.purple },
              { head: "Head 3 gave:", v: "[0.7, -0.1]", info: "figured out the sentiment is positive", c: C.orange },
            ].map(({ head, v, info, c }) => (
              <div
                key={head}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={16}>
                  {head}
                </T>
                <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
                <T color={C.dim} size={14}>
                  ← {info}
                </T>
              </div>
            ))}
            <T color={C.dim} size={14} center>
              ... 8 results total
            </T>
          </div>
          <T color="#ffe082" bold center style={{ marginTop: 8 }}>
            We stick them end-to-end (concatenate):
          </T>
          <div
            style={{
              marginTop: 4,
              padding: "8px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.mid} size={16} mono center>
              [0.3, 0.5, -0.2, 0.8, 0.7, -0.1, ..., 0.1, 0.4]
            </T>
          </div>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            One long list - 512 numbers. But there's a problem.
          </T>
        </Box>
      )}

      {/* Sub 1: Step 8 - Sealed envelopes */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            The problem - these results are like 8 sealed envelopes.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            8 detectives investigated the same crime. Each wrote findings and sealed them:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {[
              { head: 1, finding: "suspect is male, 30s", c: C.cyan },
              { head: 2, finding: "happened at the park", c: C.orange },
              { head: 3, finding: "Tuesday evening", c: C.purple },
              { head: 4, finding: "weapon was a knife", c: C.yellow },
            ].map(({ head, finding, c }) => (
              <div
                key={head}
                data-envelope="true"
                style={{
                  width: "calc(50% - 6px)",
                  padding: "8px",
                  borderRadius: 8,
                  background: `${c}08`,
                  border: `2px solid ${c}20`,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>✉️</span>
                  <T color={c} bold size={14}>
                    Head {head}
                  </T>
                </div>
                <div
                  style={{
                    padding: "4px 6px",
                    borderRadius: 4,
                    background: "rgba(0,0,0,0.3)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                  }}
                >
                  <T color={C.dim} size={12}>
                    "{finding}"
                  </T>
                </div>
                <div style={{ position: "absolute", top: 4, right: 6 }}>
                  <span style={{ fontSize: 10, color: C.red }}>sealed</span>
                </div>
              </div>
            ))}
          </div>
          <T color="#ff8a80" size={16} style={{ marginTop: 10 }}>
            Tape them together (concatenation):
          </T>
          <div
            data-concat-bar="true"
            style={{
              marginTop: 6,
              display: "flex",
              height: 36,
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[C.cyan, C.orange, C.purple, C.yellow, C.green, C.pink, C.red, C.blue].map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: `${c}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: i < 7 ? "3px solid rgba(0,0,0,0.8)" : "none",
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, color: c }}>H{i + 1}</span>
              </div>
            ))}
          </div>
          <T color={C.dim} size={12} center style={{ marginTop: 2 }}>
            thick black walls between each section - they can't see each other
          </T>
          <T color="#ff8a80" style={{ marginTop: 8 }}>
            They're physically side by side, but each section is still <strong>sealed</strong>. H1's numbers have no
            idea what H2 found. H3 can't see H4. They're taped together but not talking.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            Boss asks: "one-line summary?" No envelope has the full picture. H1 only knows the suspect. H2 only knows
            the location. Nobody can combine them.
          </T>
          <T color="#ff8a80" bold center size={18} style={{ marginTop: 6 }}>
            We need someone to open all the envelopes, read everything, and write one combined summary.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Step 9 - W_O */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            W_O - the person who opens all the envelopes.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            W_O is just another weight matrix - a grid of numbers, same as W_Q, W_K, W_V. Multiply input by grid, get
            output. Nothing new in how it works.
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            But what it <strong>does</strong> is special. When you multiply the concatenated list by W_O, every number
            in the output is computed from all numbers in the input.
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color="#ff8a80" bold size={16} center>
                Before W_O
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Position 1 = 0.3
              </T>
              <T color={C.dim} size={12} center>
                (only knows Head 1's finding)
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color="#80e8a5" bold size={16} center>
                After W_O
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Position 1 = blend of 0.3 + (-0.2) + 0.7 + ... all positions
              </T>
              <T color={C.dim} size={12} center>
                = knows Head 1 + Head 2 + Head 3 + ... everything
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={18} style={{ marginTop: 8 }}>
            It's like the combined summary:{" "}
            <em>"A male suspect in his 30s used a knife at the park on Tuesday evening."</em> One sentence that contains
            information from all envelopes.
          </T>
          <T color="#80e8a5" size={18} style={{ marginTop: 6 }}>
            After W_O, every single position in the output carries a mix of what all 8 heads found. The envelopes have
            been opened, read, and combined.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Step 10 - W_O training */}
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Where did W_O's numbers come from?
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            Same exact process as all other grids:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { n: 1, text: "Start with random numbers", c: C.red },
              { n: 2, text: "Model tries to predict next word, gets it wrong", c: C.orange },
              { n: 3, text: "Error flows backward, nudges each number in W_O", c: C.yellow },
              {
                n: 4,
                text: '"If this number were 0.31 instead of 0.30, the blending would have been better → change to 0.31"',
                c: C.purple,
              },
              { n: 5, text: "Repeat billions of times", c: C.blue },
              { n: 6, text: "W_O settles into numbers that produce good blends", c: C.green },
            ].map(({ n, text, c }) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  padding: "5px 8px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 800, fontSize: 16, minWidth: 16 }}>{n}.</span>
                <T color={C.mid} size={16}>
                  {text}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} style={{ marginTop: 8 }}>
            The training discovers the best way to combine the 8 heads' findings into one useful output. Nobody programs
            this - it emerges from training.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: Connect back to I love cats */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Back to "I love cats" - what W_O does for "love":
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            After 8 heads run, "love"'s concatenated vector has:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { range: "Dims 1–64", info: 'Head 1 found: "I" is the subject who loves', c: C.cyan },
              { range: "Dims 65–128", info: 'Head 2 found: "cats" is the object being loved', c: C.orange },
              { range: "Dims 129–192", info: "Head 3 found: this is a positive sentiment", c: C.purple },
            ].map(({ range, info, c }) => (
              <div
                key={range}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  borderRadius: 5,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={14} style={{ minWidth: 68 }}>
                  {range}
                </T>
                <T color={C.dim} size={14}>
                  {info}
                </T>
              </div>
            ))}
          </div>
          <T color={C.orange} style={{ marginTop: 8 }}>
            Without W_O: each section is isolated. Dim 1 has no idea "cats" is involved.
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            After W_O: <strong>every dimension</strong> of "love"'s output encodes the combined meaning: "affection from
            'I' directed at 'cats', with positive sentiment." One rich, integrated vector.
          </T>
          <T color={C.orange} size={18} style={{ marginTop: 6 }}>
            This is what we set out to do in Chapter 1 - transform "love" from an isolated word into a context-aware
            representation.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Why W_O is learned, not hardcoded */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            W_O is LEARNED - not hardcoded.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            The model discovers during training which combinations of head outputs are useful. Different layers learn
            different W_O matrices:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layer: "Layer 1's W_O", learns: "might focus on combining basic syntax patterns", c: C.cyan },
              { layer: "Layer 3's W_O", learns: "might focus on combining semantic relationships", c: C.orange },
              { layer: "Layer 6's W_O", learns: "might focus on combining abstract reasoning", c: C.purple },
            ].map(({ layer, learns, c }) => (
              <div key={layer} style={{ padding: "6px 10px", borderRadius: 5, background: `${c}06` }}>
                <T color={C.dim} size={16}>
                  <strong style={{ color: c }}>{layer}</strong> {learns}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>
            Nobody programs what to combine. W_O's 512×512 = 262,144 weights are all learned through backpropagation -
            the same process from chapters 1.3–1.9.
          </T>
        </Box>
      </Reveal>

      {sub < 5 && (
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
};

// ═══════ CH 22: Why 8 + Params + Big Picture ═══════

export const WhyEightHeads = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Why 8 heads? Why not 4 or 16?
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            There's a tradeoff - the total dims (512) get divided equally:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                }}
              >
                <T color={C.purple} bold size={18} center>
                  16 heads
                </T>
                <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                  512 ÷ 16 = <strong>32 dims each</strong>
                </T>
                <T color={C.green} size={14} center>
                  ✅ More pattern types
                </T>
                <T color={C.red} size={14} center>
                  ❌ Each head weaker
                </T>
              </div>
              <div
                style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}
              >
                <T color={C.cyan} bold size={18} center>
                  4 heads
                </T>
                <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                  512 ÷ 4 = <strong>128 dims each</strong>
                </T>
                <T color={C.green} size={14} center>
                  ✅ Each head powerful
                </T>
                <T color={C.red} size={14} center>
                  ❌ Fewer patterns
                </T>
              </div>
            </div>
            <Box color={C.yellow} style={{ textAlign: "center" }}>
              <T color={C.yellow} bold size={18} center>
                8 heads × 64 dims = sweet spot
              </T>
              <T color={C.dim} size={14} center>
                Enough capacity per head (64 dims) + enough perspectives (8 types)
              </T>
            </Box>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Parameter count:
          </T>
          <T color={C.dim} size={16} style={{ marginTop: 4 }}>
            Per head: W_Q (512×64) + W_K (512×64) + W_V (512×64) = 3 × 32,768 ={" "}
            <strong style={{ color: C.mid }}>98,304</strong>
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { n: "W_Q", calc: "32,768 × 8 heads", t: "262,144", co: C.blue },
              { n: "W_K", calc: "32,768 × 8 heads", t: "262,144", co: C.orange },
              { n: "W_V", calc: "32,768 × 8 heads", t: "262,144", co: C.green },
              { n: "W_O", calc: "512 × 512", t: "262,144", co: C.yellow },
            ].map(({ n, calc, t, co }) => (
              <div
                key={n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr 68px",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: `${co}06`,
                  alignItems: "center",
                }}
              >
                <code style={{ color: co, fontWeight: 700, fontSize: 18 }}>{n}</code>
                <T color={C.dim} size={16}>
                  {calc}
                </T>
                <T color={co} size={16} bold center style={{ textAlign: "right" }}>
                  {t}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "8px 12px",
              background: `${C.yellow}10`,
              borderRadius: 8,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} bold center size={20}>
              Total: 1,048,576 ≈ 1 million per layer
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            Surprising: same count as single-head!
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Single-head with 512-dim Q, K, V needs 512×512 per matrix = same total. Multi-head doesn't add parameters -
            it <strong>reorganizes them into 8 independent groups</strong>. Same budget, much better results.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            How does this scale in a full model?
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            We learned that one attention layer has ~1 million parameters. A Transformer stacks{" "}
            <strong>multiple layers</strong> on top of each other - each layer refines the context further:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { model: "Original Transformer (2017)", layers: "6 layers", params: "~6M attention params", c: C.cyan },
              { model: "GPT-2 (2019)", layers: "48 layers", params: "~48M attention params", c: C.orange },
              { model: "GPT-3 (2020)", layers: "96 layers", params: "175 BILLION total params", c: C.purple },
            ].map(({ model, layers, params, c }) => (
              <div
                key={model}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 1fr",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 5,
                  background: `${c}06`,
                  alignItems: "center",
                }}
              >
                <T color={c} size={16} bold center>
                  {model}
                </T>
                <T color={C.dim} size={14}>
                  {layers}
                </T>
                <T color={c} size={16} bold center style={{ textAlign: "right" }}>
                  {params}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>
            More layers = deeper understanding. Each layer's attention asks different questions about the same words,
            building increasingly rich representations. Same mechanism we learned - just stacked.
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
};

// ═══════ CH 23: Is W_O constant? ═══════

export const IsWOConstant = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={21}>
            Is W_O constant? Does it change?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            There are two phases in a model's life: <strong>training</strong> and <strong>usage</strong>. The answer
            depends on which phase you're asking about.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
          <Box color={C.orange} style={{ flex: 1 }}>
            <T color={C.orange} bold center size={18}>
              During training: W_O changes.
            </T>
            <T color={C.orange} size={16} style={{ marginTop: 6 }}>
              Every time the model sees a new batch of sentences and makes prediction errors, every number in W_O gets
              nudged slightly. Over billions of examples, W_O gradually improves. It changes millions of times during
              training - getting better and better at blending heads.
            </T>
          </Box>
          <Box color={C.green} style={{ flex: 1 }}>
            <T color="#80e8a5" bold center size={18}>
              After training is done: W_O is FROZEN. Completely constant.
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 6 }}>
              Once training is complete, the model is saved to a file. W_O's numbers are written to disk and they NEVER
              change again. When you use the model (send it a sentence), W_O is loaded from disk and used as-is.
            </T>
          </Box>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <div style={{ padding: "10px", background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <T color={C.mid} size={18} style={{ lineHeight: 2.2 }}>
              You type "I love cats" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ model uses the{" "}
              <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              You type "dogs are great" &nbsp;&nbsp;&nbsp;→ model uses the{" "}
              <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              You type "the weather is nice" → model uses the <strong style={{ color: C.green }}>same</strong> W_O
              <br />
              Someone else types anything &nbsp;→ model uses the <strong style={{ color: C.green }}>same</strong> W_O
            </T>
          </div>
          <T color="#80deea" style={{ marginTop: 8 }}>
            The same grid of numbers. Every input. Every user. Every sentence. Forever (until someone retrains the
            model).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            This is true for all grids, not just W_O:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.green}06`, border: `1px solid ${C.green}12` }}
            >
              <T color={C.green} bold center size={18}>
                CONSTANT after training (stored on disk, never changes):
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Embedding dictionary",
                  "W_Q₁ through W_Q₈ ← same grid for every input",
                  "W_K₁ through W_K₈ ← same grid for every input",
                  "W_V₁ through W_V₈ ← same grid for every input",
                  "W_O ← same grid for every input",
                  "All other layer weights",
                ].map((item) => (
                  <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.green}06` }}>
                    <T color={C.mid} size={14}>
                      ├── {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={18}>
                Different for every input (computed live, then thrown away):
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Q, K, V vectors ← different because the words are different",
                  "Attention scores ← different because Q, K are different",
                  "Softmax weights ← different because scores are different",
                  "Blended outputs ← different because weights and V are different",
                  "Final output ← different because everything above is different",
                ].map((item) => (
                  <div key={item} style={{ padding: "3px 8px", borderRadius: 3, background: `${C.yellow}06` }}>
                    <T color={C.mid} size={14}>
                      ├── {item}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Why do different sentences get different results if the grids are constant?
          </T>
          <T color={C.blue} style={{ marginTop: 6 }}>
            Because the grids are like a <strong>coffee machine</strong>. The machine (W_O) is always the same. But the
            coffee beans you put in (your sentence) are different each time. Same machine + different beans = different
            coffee.
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.red}06` }}>
              <T color={C.mid} size={16}>
                Same W_O × "I love cats" embeddings <strong style={{ color: C.red }}>= one output</strong>
              </T>
            </div>
            <div style={{ padding: "6px 10px", borderRadius: 5, background: `${C.purple}06` }}>
              <T color={C.mid} size={16}>
                Same W_O × "dogs are great" embeddings{" "}
                <strong style={{ color: C.purple }}>= completely different output</strong>
              </T>
            </div>
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>
            The grids don't need to change. They've already learned the GENERAL SKILL of "how to blend heads" or "how to
            extract queries." That skill works on ANY input. Just like a coffee machine doesn't need to be rebuilt for
            each type of bean - it already knows how to grind and brew.
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
};

// ═══════ CH 24: The Complete Picture ═══════

export const CompletePicture = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={21}>
            The complete picture in plain English:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { n: "1", step: "Words become numbers", desc: "(embedding lookup)", c: C.blue, icon: "📖" },
              {
                n: "2",
                step: "Those numbers × three grids",
                desc: "(W_Q, W_K, W_V → Query, Key, Value)",
                c: C.purple,
                icon: "🔧",
              },
              {
                n: "3",
                step: "Queries dot-product with Keys",
                desc: '(find "who is relevant to whom")',
                c: C.orange,
                icon: "🔍",
              },
              { n: "4", step: "Scores get normalized", desc: "(scale + softmax → percentages)", c: C.pink, icon: "📊" },
              {
                n: "5",
                step: "Percentages blend the Values",
                desc: "(weighted sum → context-aware output)",
                c: C.green,
                icon: "🎯",
              },
              {
                n: "6",
                step: "Steps 2-5 happen 8 times with different grids",
                desc: "(multi-head → 8 separate results)",
                c: C.cyan,
                icon: "🔀",
              },
              {
                n: "7",
                step: "Stick the 8 results end-to-end",
                desc: "(concatenate → 8 sealed envelopes taped together)",
                c: C.yellow,
                icon: "📎",
              },
              {
                n: "8",
                step: "That list × one more grid",
                desc: "(W_O → open all envelopes, write combined summary)",
                c: C.red,
                icon: "✉️",
              },
              {
                n: "9",
                step: "Output: one blended vector per word",
                desc: "(ready for the next layer)",
                c: C.green,
                icon: "✅",
              },
            ].map(({ n, step, desc, c, icon }) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <T color={c} bold center size={18}>
                    {n}. {step}
                  </T>
                  <T color={C.dim} size={14}>
                    {desc}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff">
            Every single "grid" in this process (W_Q, W_K, W_V, W_O) is just a table of numbers that started random, got
            nudged into useful values during training, and then <strong>stays frozen forever after</strong>. They all
            work the same way - multiply input by grid, get output. The only difference is what each grid was trained to
            do:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { grid: "W_Q grids", learned: 'learned to extract "what a word is looking for"', c: C.blue },
              { grid: "W_K grids", learned: 'learned to extract "what a word can be found for"', c: C.orange },
              { grid: "W_V grids", learned: 'learned to extract "what actual info a word carries"', c: C.green },
              {
                grid: "W_O grid",
                learned: "learned to blend all heads' findings into one combined summary",
                c: C.yellow,
              },
            ].map(({ grid, learned, c }) => (
              <div
                key={grid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${c}06`,
                }}
              >
                <T color={c} bold center size={18} style={{ minWidth: 66 }}>
                  {grid}
                </T>
                <T color={C.mid} size={16}>
                  {learned}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold size={21} center>
            The grids are the machine. Your sentence is the raw material.
          </T>
          <T color="#80deea" center style={{ marginTop: 6 }}>
            Same machine, different raw material, different product - every single time.
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
};

// ═══════ CH 25: Grouped-Query Attention ═══════

export const GroupedQueryAttention = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Recall: Multi-Head Attention
          </T>
          <T color={C.blue} style={{ marginTop: 6 }}>
            In chapters 7.9-7.14, we learned standard MHA. With 8 heads, the model maintains 8 independent sets of Q,
            K, V weight matrices:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}12`,
              }}
            >
              <T color={C.blue} bold size={16}>
                Queries
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.blue}15`,
                      border: `1px solid ${C.blue}25`,
                    }}
                  >
                    <T color={C.blue} size={13} bold>
                      W_Q{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Keys
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.orange}15`,
                      border: `1px solid ${C.orange}25`,
                    }}
                  >
                    <T color={C.orange} size={13} bold>
                      W_K{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                Values
              </T>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: `${C.green}15`,
                      border: `1px solid ${C.green}25`,
                    }}
                  >
                    <T color={C.green} size={13} bold>
                      W_V{i}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T color={C.blue} style={{ marginTop: 8 }}>
            That is 8 W_Q + 8 W_K + 8 W_V = <strong>24 weight matrices</strong> per attention layer. Each head has its
            own complete set. This works great for quality, but there is a hidden cost during inference.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The inference problem: KV cache memory
          </T>
          <T color="#ef9a9a" style={{ marginTop: 6 }}>
            During generation, we cache the K and V vectors for all previous tokens. This avoids recomputing them at
            every step. But this <strong>KV cache</strong> grows fast.
          </T>
          <div style={{ marginTop: 12, padding: "14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              KV cache memory per layer
            </T>
            <T color={C.bright} center size={16} style={{ marginTop: 8, fontFamily: "monospace" }}>
              2 x num_heads x seq_length x d_head x bytes_per_param
            </T>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <T color="#ef9a9a" bold size={16}>
              Concrete example: LLaMA 2 70B
            </T>
            {[
              { param: "num_heads", val: "64", note: "64 attention heads" },
              { param: "d_head", val: "128", note: "128 dims per head (8192 / 64)" },
              { param: "seq_length", val: "4096", note: "4096 token context window" },
              { param: "layers", val: "80", note: "80 transformer layers" },
              { param: "bytes", val: "2", note: "2 bytes per param (float16)" },
            ].map(({ param, val, note }) => (
              <div
                key={param}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 50px 1fr",
                  gap: 8,
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: `${C.red}06`,
                }}
              >
                <code style={{ color: C.red, fontSize: 14, fontWeight: 600 }}>{param}</code>
                <T color={C.mid} bold size={14}>
                  {val}
                </T>
                <T color={C.dim} size={13}>
                  {note}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Total KV cache per batch item
            </T>
            <T color={C.dim} size={15} center style={{ marginTop: 4, fontFamily: "monospace" }}>
              2 x 64 x 4096 x 128 x 2 bytes = 134,217,728 bytes per layer
            </T>
            <T color={C.dim} size={15} center style={{ fontFamily: "monospace" }}>
              134,217,728 x 80 layers = 10,737,418,240 bytes
            </T>
            <T color={C.yellow} bold center size={18} style={{ marginTop: 6 }}>
              ~10 GB per batch item!
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 4 }}>
              Serving 8 users simultaneously = 80 GB just for KV caches. That is an entire A100 GPU of memory - before
              the model weights themselves.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            GQA solution: share K and V across query groups
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Instead of giving every head its own K and V, we <strong>share</strong> K and V across groups of query
            heads. Each head still has its own unique Q - queries stay personal.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={16}>
                Example: 8 query heads, 2 KV groups
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    Group 1: Heads 1-4 share K_1, V_1
                  </T>
                  <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["Q_1", "Q_2", "Q_3", "Q_4"].map((q) => (
                      <div
                        key={q}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: `${C.blue}15`,
                          border: `1px solid ${C.blue}25`,
                        }}
                      >
                        <T color={C.blue} size={13} bold>
                          {q}
                        </T>
                      </div>
                    ))}
                    <T color={C.dim} size={14} style={{ alignSelf: "center" }}>
                      all use
                    </T>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}15`,
                        border: `1px solid ${C.orange}25`,
                      }}
                    >
                      <T color={C.orange} size={13} bold>
                        K_1
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      <T color={C.green} size={13} bold>
                        V_1
                      </T>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${C.yellow}06`,
                    border: `1px solid ${C.yellow}12`,
                  }}
                >
                  <T color={C.yellow} bold size={15}>
                    Group 2: Heads 5-8 share K_2, V_2
                  </T>
                  <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["Q_5", "Q_6", "Q_7", "Q_8"].map((q) => (
                      <div
                        key={q}
                        style={{
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: `${C.blue}15`,
                          border: `1px solid ${C.blue}25`,
                        }}
                      >
                        <T color={C.blue} size={13} bold>
                          {q}
                        </T>
                      </div>
                    ))}
                    <T color={C.dim} size={14} style={{ alignSelf: "center" }}>
                      all use
                    </T>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.orange}15`,
                        border: `1px solid ${C.orange}25`,
                      }}
                    >
                      <T color={C.orange} size={13} bold>
                        K_2
                      </T>
                    </div>
                    <div
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: `${C.green}15`,
                        border: `1px solid ${C.green}25`,
                      }}
                    >
                      <T color={C.green} size={13} bold>
                        V_2
                      </T>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <T color="#80e8a5" style={{ marginTop: 4 }}>
              Weight matrices needed: 8 W_Q + 2 W_K + 2 W_V = <strong>12 projections</strong> (down from 24). The K and
              V computations (and their caches) shrink by 4x.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Visual comparison: MHA vs GQA vs MQA
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                name: "MHA (Multi-Head Attention)",
                qHeads: 8,
                kHeads: 8,
                vHeads: 8,
                projections: 24,
                kvCacheNote: "8 K + 8 V cached per layer",
                color: C.red,
              },
              {
                name: "GQA (Grouped-Query Attention, 4 heads per group)",
                qHeads: 8,
                kHeads: 2,
                vHeads: 2,
                projections: 12,
                kvCacheNote: "2 K + 2 V cached per layer (4x less)",
                color: C.green,
              },
              {
                name: "MQA (Multi-Query Attention)",
                qHeads: 8,
                kHeads: 1,
                vHeads: 1,
                projections: 10,
                kvCacheNote: "1 K + 1 V cached per layer (8x less)",
                color: C.blue,
              },
            ].map(({ name, qHeads, kHeads, vHeads, projections, kvCacheNote, color }) => (
              <div
                key={name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}12`,
                }}
              >
                <T color={color} bold center size={17}>
                  {name}
                </T>
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.blue} bold size={20} center>
                      {qHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      Q heads
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.orange} bold size={20} center>
                      {kHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      K heads
                    </T>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <T color={C.green} bold size={20} center>
                      {vHeads}
                    </T>
                    <T color={C.dim} size={12} center>
                      V heads
                    </T>
                  </div>
                </div>
                <T color={C.dim} size={14} center style={{ marginTop: 6 }}>
                  {projections} projections total
                </T>
                <T color={C.mid} size={14} center style={{ marginTop: 2 }}>
                  {kvCacheNote}
                </T>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)" }}>
            <T color={C.bright} bold center size={15}>
              KV cache savings (LLaMA 2 70B, 4096 context)
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { type: "MHA (64 KV heads)", mem: "~10 GB", bar: 100, color: C.red },
                { type: "GQA-8 (8 KV groups)", mem: "~1.25 GB", bar: 12.5, color: C.green },
                { type: "MQA (1 KV shared)", mem: "~160 MB", bar: 1.6, color: C.blue },
              ].map(({ type, mem, bar, color }) => (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <T color={color} size={13} style={{ minWidth: 150 }}>
                    {type}
                  </T>
                  <div
                    style={{
                      flex: 1,
                      height: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: `${bar}%`, height: "100%", background: color, borderRadius: 4 }} />
                  </div>
                  <T color={color} bold size={13} style={{ minWidth: 70, textAlign: "right" }}>
                    {mem}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why does sharing K and V work?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            The query is the "question" each head asks. Each head needs its own unique question to capture different
            patterns (syntax, semantics, coreference, etc.).
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            But keys and values are the "answers" - and it turns out adjacent heads often attend to{" "}
            <strong>similar positions</strong> anyway. The K and V vectors across heads are highly correlated. Sharing
            them loses very little information.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Research result
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                GQA matches standard MHA quality within 1% on most benchmarks while using 4x less KV cache memory. The
                quality-to-efficiency tradeoff is exceptionally favorable.
              </T>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold center size={16}>
                Models using GQA
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { model: "LLaMA 2 70B", detail: "8 KV groups" },
                  { model: "LLaMA 3", detail: "8 KV groups" },
                  { model: "Mistral 7B", detail: "8 KV groups" },
                  { model: "Gemma", detail: "varies by size" },
                ].map(({ model, detail }) => (
                  <div
                    key={model}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 5,
                      background: `${C.orange}12`,
                      border: `1px solid ${C.orange}25`,
                    }}
                  >
                    <T color={C.orange} bold size={14}>
                      {model}
                    </T>
                    <T color={C.dim} size={11}>
                      {detail}
                    </T>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold center size={16}>
                Why not always use MQA (1 shared KV)?
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                MQA saves the most memory but does lose quality - about 2-5% on harder tasks. GQA is the sweet spot:
                most of the memory savings with almost no quality loss. That is why most modern large models use GQA
                with 8 groups, not full MQA.
              </T>
            </div>
          </div>
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
};

// ═══════ CH 26: KV Cache - Speed Up Inference ═══════

export const KVCache = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const subBtn = (s) =>
    sub === s && (
      <SubBtn
        key={sub}
        onClick={() => {
          setSubBtnRipple(Date.now());
          navigate("forward");
        }}
        rippleKey={subBtnRipple}
        registerSubBtn={registerSubBtn}
      />
    );

  const inner = (color, children, extra = {}) => (
    <div
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        background: `${color}08`,
        border: `1px solid ${color}20`,
        ...extra,
      }}
    >
      {children}
    </div>
  );

  const mono = (color, text, size = 14) => (
    <div style={{ textAlign: "center", marginTop: 6 }}>
      <code style={{ color, fontSize: size }}>{text}</code>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* ── Sub 0: Naive Generation Redoes History ── */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Problem - Naive Generation Redoes History
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            To generate each new word, the naive approach re-processes every previous word from scratch. Watch the work
            pile up across three steps of generating "I love cats":
          </T>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                Work at each step (green = new, red = redundant)
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg data-viz="work-bars" width="520" height="180" viewBox="0 0 520 180">
                  <desc>
                    Three stacked work rows showing naive generation redoing history: step 1 with 1 green new block,
                    step 2 with 1 red redundant block and 1 green new block, step 3 with 2 red redundant blocks and 1
                    green new block, illustrating how computation piles up quadratically when the KV cache is not used
                  </desc>
                  {[
                    { y: 10, label: 'Step 1 ("I")', blocks: ["new"] },
                    { y: 68, label: 'Step 2 ("love")', blocks: ["red", "new"] },
                    { y: 126, label: 'Step 3 ("cats")', blocks: ["red", "red", "new"] },
                  ].map(({ y, label, blocks }) => (
                    <g key={y}>
                      <text x="10" y={y + 30} fill={C.dim} fontSize="14">
                        {label}
                      </text>
                      {blocks.map((kind, i) => (
                        <rect
                          key={`r${i}`}
                          data-block={kind}
                          x={150 + i * 56}
                          y={y}
                          width="48"
                          height="44"
                          rx="6"
                          fill={kind === "new" ? C.green : C.red}
                          fillOpacity="0.32"
                          stroke={kind === "new" ? C.green : C.red}
                          strokeWidth="1.5"
                        />
                      ))}
                      {blocks.map((kind, i) => (
                        <text
                          key={`t${i}`}
                          x={150 + i * 56 + 24}
                          y={y + 28}
                          fill={kind === "new" ? C.green : C.red}
                          fontSize="12"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {kind === "new" ? "new" : "redo"}
                        </text>
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                Each block = one token's Q, K, V computed. Green blocks are real new work. Red blocks are identical to
                work done in earlier steps.
              </T>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={15}>
                Counting the waste across 3 steps
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3, textAlign: "center" }}>
                <T color={C.dim} size={14}>
                  Total work: 1 + 2 + 3 = <strong style={{ color: "#ef9a9a" }}>6 blocks</strong>
                </T>
                <T color={C.dim} size={14}>
                  Actually useful: <strong style={{ color: C.green }}>3 blocks</strong>
                </T>
                <T color="#ef9a9a" size={14} bold>
                  Wasted: 3 blocks (50%)
                </T>
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 6 }}>
                At 1000 tokens: 500,500 blocks of work, only 1000 are useful. 99.8% wasted.
              </T>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Naive generation recomputes identical numbers every step. This chapter shows the one-line fix that makes
                ChatGPT feel instant.
              </T>
            </>,
          )}
        </Box>
      )}
      {subBtn(0)}

      {/* ── Sub 1: Same Input Same Output ── */}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            The Lightbulb - Same Input, Same Output, Always
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 8 }}>
            When step 2 re-processes the token "I", does it get the same numbers as step 1 did? Let's check.
          </T>

          {inner(
            C.yellow,
            <>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}30`,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold size={14}>
                    Step 1 computed
                  </T>
                  <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6 }}>q_I = W_Q · x_I</code>
                  <code style={{ color: C.cyan, fontSize: 15, display: "block", marginTop: 4, fontWeight: 700 }}>
                    = [0.5, 0.2]
                  </code>
                </div>
                <div style={{ fontSize: 32, color: "#fff176", fontWeight: 700 }}>=</div>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}30`,
                    minWidth: 200,
                    textAlign: "center",
                  }}
                >
                  <T color="#80deea" bold size={14}>
                    Step 2 re-computed
                  </T>
                  <code style={{ color: C.cyan, fontSize: 14, display: "block", marginTop: 6 }}>q_I = W_Q · x_I</code>
                  <code style={{ color: C.cyan, fontSize: 15, display: "block", marginTop: 4, fontWeight: 700 }}>
                    = [0.5, 0.2]
                  </code>
                </div>
              </div>
              <T color="#fff176" bold center size={15} style={{ marginTop: 10 }}>
                Identical. Every. Single. Time.
              </T>
            </>,
          )}

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" bold center size={14}>
                Why identical? Because neither input has changed.
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <T color={C.dim} size={14}>
                  <strong style={{ color: "#b8a9ff" }}>x_I</strong> (embedding for "I") is frozen: tokens don't change
                  their embedding mid-generation.
                </T>
                <T color={C.dim} size={14}>
                  <strong style={{ color: "#b8a9ff" }}>W_Q</strong> (weight matrix) is frozen: trained weights don't
                  change during inference.
                </T>
                <T color="#b8a9ff" size={14} bold style={{ marginTop: 4 }}>
                  Same input · same weights = same output, ALWAYS.
                </T>
              </div>
            </>,
          )}

          {inner(
            C.green,
            <>
              <T color="#a5d6a7" bold center size={15}>
                So stop recomputing. Save the answer the first time. That's a cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(1)}

      {/* ── Sub 2: The Matrix View (Star Sub) ── */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Matrix View - Only the Last Row Is New
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            Attention is matrix multiplication. Let's draw the full matmul at step 3 (generating "cats") and see which
            parts of the matrices we actually need.
          </T>

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" bold center size={15}>
                Q · Kᵀ = Scores, and Scores · V = Output
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10, overflowX: "auto" }}>
                <svg data-viz="matrix-view" width="680" height="360" viewBox="0 0 680 360">
                  <desc>
                    Side by side attention matrix multiplications at generation step 3: Q times K transpose equals
                    Scores (3 by 3) with rows for I and love dimmed because they were already computed at earlier steps
                    and only the last row for cats glows, and Scores times V equals Output with only the last row
                    highlighted as the new result
                  </desc>

                  <text x="340" y="16" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                    Scores = Q · Kᵀ
                  </text>

                  {/* Q matrix */}
                  <g transform="translate(20, 28)">
                    <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Q (3×d)
                    </text>
                    {[
                      { label: "q_I", dim: true },
                      { label: "q_love", dim: true },
                      { label: "q_cats", dim: false },
                    ].map((row, i) => (
                      <g key={`q${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="100"
                          height="28"
                          rx="4"
                          fill={row.dim ? "#666" : C.purple}
                          fillOpacity={row.dim ? 0.12 : 0.4}
                          stroke={row.dim ? "#666" : C.purple}
                          strokeWidth={row.dim ? 1 : 2}
                        />
                        <text
                          x="50"
                          y={i * 32 + 18}
                          fill={row.dim ? C.dim : "#fff"}
                          fontSize="13"
                          textAnchor="middle"
                          fontWeight={row.dim ? 400 : 700}
                        >
                          {row.label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="135" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    ·
                  </text>

                  {/* Kᵀ matrix */}
                  <g transform="translate(155, 28)">
                    <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Kᵀ (d×3)
                    </text>
                    {["k_I", "k_love", "k_cats"].map((label, i) => (
                      <g key={`kt${i}`}>
                        <rect
                          x={i * 68}
                          y="0"
                          width="60"
                          height="92"
                          rx="4"
                          fill={C.blue}
                          fillOpacity="0.3"
                          stroke={C.blue}
                          strokeWidth="1.5"
                        />
                        <text x={i * 68 + 30} y="50" fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                          {label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="385" y="74" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    =
                  </text>

                  {/* Scores 3x3 */}
                  <g transform="translate(410, 28)">
                    <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Scores (3×3)
                    </text>
                    {[0, 1, 2].map((r) => {
                      const rowDim = r < 2;
                      return (
                        <g key={`sr${r}`}>
                          {[0, 1, 2].map((c) => (
                            <rect
                              key={`sc${r}-${c}`}
                              x={c * 90}
                              y={r * 32}
                              width="86"
                              height="28"
                              rx="4"
                              fill={rowDim ? "#444" : "#e040fb"}
                              fillOpacity={rowDim ? 0.1 : 0.5}
                              stroke={rowDim ? "#555" : "#e040fb"}
                              strokeWidth={rowDim ? 1 : 2}
                            />
                          ))}
                          {[0, 1, 2].map((c) => (
                            <text
                              key={`st${r}-${c}`}
                              x={c * 90 + 43}
                              y={r * 32 + 18}
                              fill={rowDim ? C.dim : "#fff"}
                              fontSize="11"
                              textAnchor="middle"
                            >
                              {rowDim ? "(already)" : `q_cats·${["k_I", "k_love", "k_cats"][c]}`}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </g>

                  <text x="340" y="155" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
                    ↑ only this row is new: 3 dot products (not 9)
                  </text>

                  <text x="340" y="190" fill="#b8a9ff" fontSize="14" fontWeight="700" textAnchor="middle">
                    Output = softmax(Scores) · V
                  </text>

                  {/* Scores (compressed) */}
                  <g transform="translate(20, 204)">
                    <text x="50" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Scores (3×3)
                    </text>
                    {[0, 1, 2].map((r) => {
                      const rowDim = r < 2;
                      return (
                        <rect
                          key={`scl${r}`}
                          x="0"
                          y={r * 32}
                          width="100"
                          height="28"
                          rx="4"
                          fill={rowDim ? "#444" : "#e040fb"}
                          fillOpacity={rowDim ? 0.1 : 0.5}
                          stroke={rowDim ? "#555" : "#e040fb"}
                          strokeWidth={rowDim ? 1 : 2}
                        />
                      );
                    })}
                    {["row_I (old)", "row_love (old)", "row_cats (NEW)"].map((label, i) => (
                      <text
                        key={`slt${i}`}
                        x="50"
                        y={i * 32 + 18}
                        fill={i < 2 ? C.dim : "#fff"}
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight={i === 2 ? 700 : 400}
                      >
                        {label}
                      </text>
                    ))}
                  </g>

                  <text x="135" y="250" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    ·
                  </text>

                  {/* V matrix - all rows bright */}
                  <g transform="translate(155, 204)">
                    <text x="100" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      V (3×d)
                    </text>
                    {["v_I", "v_love", "v_cats"].map((label, i) => (
                      <g key={`v${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="200"
                          height="28"
                          rx="4"
                          fill={C.green}
                          fillOpacity="0.3"
                          stroke={C.green}
                          strokeWidth="1.5"
                        />
                        <text x="100" y={i * 32 + 18} fill="#fff" fontSize="13" textAnchor="middle" fontWeight="700">
                          {label} (all needed)
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="385" y="250" fill={C.dim} fontSize="22" textAnchor="middle" fontWeight="700">
                    =
                  </text>

                  {/* Output 3xd */}
                  <g transform="translate(410, 204)">
                    <text x="135" y="-4" fill={C.dim} fontSize="12" textAnchor="middle">
                      Output (3×d)
                    </text>
                    {[
                      { label: "out_I (old, discarded)", dim: true },
                      { label: "out_love (old, discarded)", dim: true },
                      { label: "out_cats (the ONLY one we need)", dim: false },
                    ].map((row, i) => (
                      <g key={`o${i}`}>
                        <rect
                          x="0"
                          y={i * 32}
                          width="270"
                          height="28"
                          rx="4"
                          fill={row.dim ? "#444" : "#e040fb"}
                          fillOpacity={row.dim ? 0.1 : 0.5}
                          stroke={row.dim ? "#555" : "#e040fb"}
                          strokeWidth={row.dim ? 1 : 2}
                        />
                        <text
                          x="135"
                          y={i * 32 + 18}
                          fill={row.dim ? C.dim : "#fff"}
                          fontSize="12"
                          textAnchor="middle"
                          fontWeight={row.dim ? 400 : 700}
                        >
                          {row.label}
                        </text>
                      </g>
                    ))}
                  </g>

                  <text x="340" y="340" fill="#e040fb" fontSize="13" fontWeight="700" textAnchor="middle">
                    ↑ only this row is new: 1 weighted sum (not 3)
                  </text>
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                Counting cells at step 3
              </T>
              <div style={{ marginTop: 8, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Without cache", val: "18 cells", sub: "9 score + 9 output", c: C.red },
                  { label: "Actually needed", val: "6 cells", sub: "3 score + 3 output", c: C.green },
                  { label: "Wasted", val: "12 cells (66%)", sub: "", c: C.orange },
                ].map((x) => (
                  <div
                    key={x.label}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      background: `${x.c}10`,
                      border: `1px solid ${x.c}30`,
                      minWidth: 150,
                      textAlign: "center",
                    }}
                  >
                    <T color={x.c} bold size={13}>
                      {x.label}
                    </T>
                    <T color={C.dim} size={16} bold style={{ marginTop: 4 }}>
                      {x.val}
                    </T>
                    {x.sub && (
                      <T color={C.dim} size={11} style={{ marginTop: 2 }}>
                        {x.sub}
                      </T>
                    )}
                  </div>
                ))}
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Cost per step scales as N² without cache. With cache, cost per step stays O(N). Now we just need to
                figure out what to save so we can skip the gray rows.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(2)}

      {/* ── Sub 3: What to Save, What to Throw Away ── */}
      <Reveal when={sub >= 3}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            What to Save, What to Throw Away
          </T>
          <T color="#90caf9" size={16} style={{ marginTop: 8 }}>
            We compute three things per token: Q, K, V. For each, do we need the OLD ones to build the new output row?
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              {
                name: "Q",
                color: C.purple,
                hex: "#b8a9ff",
                verdict: "Don't cache",
                icon: "✗",
                iconColor: C.red,
                desc: "Only the new query q_cats appears in the new output row's formula. Old queries q_I and q_love are never used again.",
                tag: "dead weight",
              },
              {
                name: "K",
                color: C.blue,
                hex: "#90caf9",
                verdict: "Cache it",
                icon: "✓",
                iconColor: C.green,
                desc: "The new row of Scores = q_new · every old K. Missing one key = missing one attention score.",
                tag: "every old K needed",
              },
              {
                name: "V",
                color: C.green,
                hex: "#a5d6a7",
                verdict: "Cache it",
                icon: "✓",
                iconColor: C.green,
                desc: "The new output row = weighted sum of every old V. Missing one value = losing that token's contribution.",
                tag: "every old V needed",
              },
            ].map(({ name, color, hex, verdict, icon, iconColor, desc, tag }) => (
              <div
                key={name}
                style={{
                  flex: "1 1 200px",
                  maxWidth: 260,
                  padding: 14,
                  borderRadius: 10,
                  background: `${color}10`,
                  border: `2px solid ${color}40`,
                  textAlign: "center",
                }}
              >
                <T color={hex} bold center size={22}>
                  {name}
                </T>
                <div style={{ fontSize: 48, color: iconColor, fontWeight: 700, lineHeight: 1 }}>{icon}</div>
                <T color={hex} bold size={16} style={{ marginTop: 4 }}>
                  {verdict}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 6 }}>
                  {tag}
                </T>
                <T color={C.dim} size={13} style={{ marginTop: 8 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                That is why it is called the <span style={{ color: "#fff176" }}>KV cache</span>.
              </T>
              <T color="#fff176" center size={15} style={{ marginTop: 4 }}>
                We save K and V. Never Q.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(3)}

      {/* ── Sub 4: The Cache Is a Growing Notebook ── */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The Cache Is a Growing Notebook
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 8 }}>
            The KV cache is literally two tables that grow by exactly one row at every step. Nothing moves, nothing gets
            recomputed. We just append to the notebook.
          </T>

          {inner(
            C.green,
            <>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 4, overflowX: "auto" }}>
                <svg data-viz="notebook" width="720" height="240" viewBox="0 0 720 240">
                  <desc>
                    Three frame growing notebook diagram showing the K cache and V cache tables appending one row per
                    generation step: after I has 1 row, after love has 2 rows with the older row dimmed, after cats has
                    3 rows with only the newest row highlighted
                  </desc>
                  <defs>
                    <marker
                      id="kv-arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5d6a7" />
                    </marker>
                  </defs>
                  {[
                    {
                      x: 10,
                      title: "After 'I'",
                      k: [{ val: "[0.3, 0.4]", bright: true }],
                      v: [{ val: "[0.8, 0.3]", bright: true }],
                    },
                    {
                      x: 250,
                      title: "After 'love'",
                      k: [
                        { val: "[0.3, 0.4]", bright: false },
                        { val: "[0.7, 0.2]", bright: true },
                      ],
                      v: [
                        { val: "[0.8, 0.3]", bright: false },
                        { val: "[0.1, 0.9]", bright: true },
                      ],
                    },
                    {
                      x: 490,
                      title: "After 'cats'",
                      k: [
                        { val: "[0.3, 0.4]", bright: false },
                        { val: "[0.7, 0.2]", bright: false },
                        { val: "[0.5, 0.3]", bright: true },
                      ],
                      v: [
                        { val: "[0.8, 0.3]", bright: false },
                        { val: "[0.1, 0.9]", bright: false },
                        { val: "[0.45, 0.6]", bright: true },
                      ],
                    },
                  ].map(({ x, title, k, v }, frameIdx) => (
                    <g key={`frame${frameIdx}`} transform={`translate(${x}, 10)`}>
                      <text x="110" y="14" fill="#a5d6a7" fontSize="13" fontWeight="700" textAnchor="middle">
                        {title}
                      </text>
                      <text x="50" y="36" fill={C.blue} fontSize="11" textAnchor="middle" fontWeight="700">
                        K cache
                      </text>
                      {k.map((row, i) => (
                        <g key={`k${frameIdx}-${i}`}>
                          <rect
                            x="10"
                            y={44 + i * 26}
                            width="80"
                            height="22"
                            rx="3"
                            fill={C.blue}
                            fillOpacity={row.bright ? 0.45 : 0.12}
                            stroke={C.blue}
                            strokeWidth={row.bright ? 2 : 1}
                          />
                          <text
                            x="50"
                            y={60 + i * 26}
                            fill={row.bright ? "#fff" : C.dim}
                            fontSize="10"
                            textAnchor="middle"
                            fontWeight={row.bright ? 700 : 400}
                          >
                            {row.val}
                          </text>
                        </g>
                      ))}
                      <text x="170" y="36" fill={C.green} fontSize="11" textAnchor="middle" fontWeight="700">
                        V cache
                      </text>
                      {v.map((row, i) => (
                        <g key={`v${frameIdx}-${i}`}>
                          <rect
                            x="130"
                            y={44 + i * 26}
                            width="80"
                            height="22"
                            rx="3"
                            fill={C.green}
                            fillOpacity={row.bright ? 0.45 : 0.12}
                            stroke={C.green}
                            strokeWidth={row.bright ? 2 : 1}
                          />
                          <text
                            x="170"
                            y={60 + i * 26}
                            fill={row.bright ? "#fff" : C.dim}
                            fontSize="10"
                            textAnchor="middle"
                            fontWeight={row.bright ? 700 : 400}
                          >
                            {row.val}
                          </text>
                        </g>
                      ))}
                      {frameIdx < 2 && (
                        <g>
                          <line
                            x1="225"
                            y1="120"
                            x2="245"
                            y2="120"
                            stroke="#a5d6a7"
                            strokeWidth="2"
                            markerEnd="url(#kv-arrow)"
                          />
                          <text x="235" y="110" fill="#a5d6a7" fontSize="10" textAnchor="middle" fontWeight="700">
                            append
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                One append per step. The existing rows don't move, don't change, don't get recomputed. They just sit
                there in memory, ready to be read.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(4)}

      {/* ── Sub 5: Before vs After - Step 3 Side by Side ── */}
      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Before vs After - Step 3 Side by Side
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 8 }}>
            Generating "cats" with and without the cache. Identical output, very different amounts of work.
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Without cache */}
            <div
              style={{
                flex: "1 1 280px",
                padding: 14,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}30`,
              }}
            >
              <T color="#ef9a9a" bold center size={16}>
                Without Cache
              </T>
              <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                Recompute everything from scratch
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  { code: "q_I = W_Q · x_I", wasted: true },
                  { code: "q_love = W_Q · x_love", wasted: true },
                  { code: "q_cats = W_Q · x_cats", wasted: false },
                  { code: "k_I = W_K · x_I", wasted: true },
                  { code: "k_love = W_K · x_love", wasted: true },
                  { code: "k_cats = W_K · x_cats", wasted: false },
                  { code: "v_I = W_V · x_I", wasted: true },
                  { code: "v_love = W_V · x_love", wasted: true },
                  { code: "v_cats = W_V · x_cats", wasted: false },
                ].map(({ code, wasted }, i) => (
                  <div
                    key={`w${i}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px 8px",
                      borderRadius: 3,
                      background: wasted ? `${C.red}10` : "transparent",
                      textDecoration: wasted ? "line-through" : "none",
                    }}
                  >
                    <code style={{ color: wasted ? C.red : C.green, fontSize: 12 }}>{code}</code>
                    <span style={{ color: wasted ? C.red : C.green, fontSize: 10, fontWeight: 700 }}>
                      {wasted ? "wasted" : "used"}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.red}12`,
                  textAlign: "center",
                }}
              >
                <T color="#ef9a9a" bold size={13}>
                  9 projections + 9 score cells + 3 output rows
                </T>
                <T color="#ef9a9a" size={13}>
                  <strong>15 operations wasted</strong>
                </T>
              </div>
            </div>

            {/* With cache */}
            <div
              style={{
                flex: "1 1 280px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}30`,
              }}
            >
              <T color="#a5d6a7" bold center size={16}>
                With Cache
              </T>
              <T color={C.dim} size={12} center style={{ marginTop: 4 }}>
                Read old rows, compute only the new one
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.blue}10` }}>
                  <T color={C.blue} size={12} bold>
                    Read from cache: k_I, k_love, v_I, v_love
                  </T>
                </div>
                <div style={{ padding: "4px 8px", marginTop: 4 }}>
                  <T color={C.dim} size={11} bold>
                    Compute only for new token:
                  </T>
                </div>
                {[
                  { code: "q_cats = W_Q · x_cats", c: C.purple },
                  { code: "k_cats = W_K · x_cats", c: C.blue },
                  { code: "v_cats = W_V · x_cats", c: C.green },
                ].map(({ code, c }, i) => (
                  <code key={`wc${i}`} style={{ color: c, fontSize: 12, padding: "2px 8px" }}>
                    {code}
                  </code>
                ))}
                <div style={{ padding: "4px 8px", marginTop: 4, borderTop: `1px solid ${C.dim}20` }}>
                  <T color={C.dim} size={11} bold>
                    Append k_cats, v_cats to cache. Then:
                  </T>
                </div>
                <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
                  scores = q_cats · Kᵀ (last row only, 1×N)
                </code>
                <code style={{ color: C.dim, fontSize: 12, padding: "2px 8px" }}>
                  output_cats = softmax(scores) · V (1×d)
                </code>
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" bold size={13}>
                  3 projections + 3 score cells + 1 output row
                </T>
                <T color="#a5d6a7" size={13}>
                  <strong>0 operations wasted</strong>
                </T>
              </div>
            </div>
          </div>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                The output vector for "cats" is identical in both.
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
                Same numbers come out. The cache just changes where the old K and V values come from (freshly recomputed
                vs memory read).
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(5)}

      {/* ── Sub 6: Trace It with Real Numbers ── */}
      <Reveal when={sub >= 6}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#f48fb1" bold center size={20}>
            Trace It with Real Numbers (d = 2)
          </T>
          <T color="#f48fb1" size={16} style={{ marginTop: 8 }}>
            Let's walk through the complete computation with tiny 2-dim vectors, watching the cache fill up and seeing
            the identical output that the naive method would have produced.
          </T>

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={14}>
                Embeddings (d = 2) and weights
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_I = [1.0, 0.0]</code>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_love = [0.0, 1.0]</code>
                  <code style={{ color: C.cyan, fontSize: 13, display: "block" }}>x_cats = [0.5, 0.5]</code>
                </div>
                <div style={{ textAlign: "center" }}>
                  <code style={{ color: C.purple, fontSize: 12, display: "block" }}>
                    W_Q rows: [0.5, 0.1] [0.2, 0.6]
                  </code>
                  <code style={{ color: C.blue, fontSize: 12, display: "block" }}>W_K rows: [0.3, 0.7] [0.4, 0.2]</code>
                  <code style={{ color: C.green, fontSize: 12, display: "block" }}>
                    W_V rows: [0.8, 0.1] [0.3, 0.9]
                  </code>
                </div>
              </div>
            </>,
          )}

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={14}>
                Step 1: process "I"
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_I = W_Q · [1.0, 0.0] = [0.5, 0.2]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_I = W_K · [1.0, 0.0] = [0.3, 0.4]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_I = W_V · [1.0, 0.0] = [0.8, 0.3]</code>
              </div>
              <div
                style={{
                  marginTop: 4,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.blue}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.dim} size={12}>
                  Cache after step 1:
                </T>
                <T color={C.blue} size={12} bold>
                  K = [[0.3, 0.4]]
                </T>
                <T color={C.green} size={12} bold>
                  V = [[0.8, 0.3]]
                </T>
              </div>
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Step 2: process "love" (reuse cache for "I")
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_love = W_Q · [0.0, 1.0] = [0.1, 0.6]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_love = W_K · [0.0, 1.0] = [0.7, 0.2]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_love = W_V · [0.0, 1.0] = [0.1, 0.9]</code>
              </div>
              <div
                style={{
                  marginTop: 4,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.blue}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.blue} size={12} bold>
                  K = [[0.3, 0.4], [0.7, 0.2]]
                </T>
                <T color={C.green} size={12} bold>
                  V = [[0.8, 0.3], [0.1, 0.9]]
                </T>
              </div>
            </>,
          )}

          {inner(
            C.green,
            <>
              <T color="#a5d6a7" bold center size={14}>
                Step 3: process "cats" and compute full attention
              </T>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <code style={{ color: C.purple, fontSize: 12 }}>q_cats = W_Q · [0.5, 0.5] = [0.3, 0.4]</code>
                <code style={{ color: C.blue, fontSize: 12 }}>k_cats = W_K · [0.5, 0.5] = [0.5, 0.3]</code>
                <code style={{ color: C.green, fontSize: 12 }}>v_cats = W_V · [0.5, 0.5] = [0.45, 0.6]</code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.purple}08`,
                  textAlign: "center",
                }}
              >
                <T color={C.purple} size={12} bold>
                  Scores (last row only): q_cats · each key
                </T>
                <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
                  q_cats · k_I = 0.3×0.3 + 0.4×0.4 = 0.25
                </code>
                <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
                  q_cats · k_love = 0.3×0.7 + 0.4×0.2 = 0.29
                </code>
                <code style={{ color: C.dim, fontSize: 11, display: "block" }}>
                  q_cats · k_cats = 0.3×0.5 + 0.4×0.3 = 0.27
                </code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.yellow}08`,
                  textAlign: "center",
                }}
              >
                <T color="#fff176" size={12} bold>
                  Scale by √2, then softmax:
                </T>
                <code style={{ color: "#fff176", fontSize: 12, display: "block", marginTop: 2 }}>
                  softmax = [0.329, 0.338, 0.333]
                </code>
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 6,
                  borderRadius: 4,
                  background: `${C.green}12`,
                  textAlign: "center",
                }}
              >
                <T color="#a5d6a7" size={12} bold>
                  Weighted sum of values:
                </T>
                <code style={{ color: C.dim, fontSize: 11, display: "block", marginTop: 2 }}>
                  0.329 × [0.8, 0.3] + 0.338 × [0.1, 0.9] + 0.333 × [0.45, 0.6]
                </code>
                <code style={{ color: "#a5d6a7", fontSize: 14, display: "block", marginTop: 4, fontWeight: 700 }}>
                  output_cats = [0.447, 0.603]
                </code>
              </div>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={13}>
                This exact [0.447, 0.603] would also come out without the cache. The cache never changes what is
                computed. It only changes where k_I, k_love, v_I, v_love came from (cached vs recomputed).
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(6)}

      {/* ── Sub 7: The Cost - 10.7 GB Per Conversation ── */}
      <Reveal when={sub >= 7}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Cost - 10.7 GB Per Conversation
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 8 }}>
            The cache isn't free. It has a specific memory cost that depends on model size and sequence length.
          </T>

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={14}>
                The formula
              </T>
              {mono("#ef9a9a", "cache_bytes = 2 (K+V) × layers × d_model × seq_len × bytes_per_param", 13)}
            </>,
          )}

          {inner(
            C.orange,
            <>
              <T color="#ffcc80" bold center size={14}>
                Example: LLaMA 70B
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "layers", val: "80", c: C.green },
                  { label: "d_model", val: "8,192", c: C.purple },
                  { label: "seq_len (max)", val: "4,096 tokens", c: C.cyan },
                  { label: "precision", val: "FP16 (2 bytes)", c: C.orange },
                ].map(({ label, val, c }) => (
                  <div key={label} style={{ display: "flex", gap: 8, padding: "2px 8px" }}>
                    <T color={c} bold size={13} style={{ minWidth: 110 }}>
                      {label}:
                    </T>
                    <T color={C.dim} size={13}>
                      {val}
                    </T>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.25)",
                  textAlign: "center",
                }}
              >
                <code style={{ color: C.dim, fontSize: 13 }}>2 × 80 × 8,192 × 4,096 × 2 bytes</code>
                <T color="#ef9a9a" bold size={18} style={{ marginTop: 4 }}>
                  = 10.7 GB per sequence
                </T>
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "center", overflowX: "auto" }}>
                <svg data-viz="memory-bar" width="520" height="110" viewBox="0 0 520 110">
                  <desc>
                    Horizontal memory meter filling with gradient showing KV cache memory cost scaling with sequence
                    length, with tick marks at 1024 4096 and 32768 tokens and GB values 2.7 10.7 and 86 for LLaMA 70B
                    sized models
                  </desc>
                  <defs>
                    <linearGradient id="memgrad" x1="0" x2="1">
                      <stop offset="0" stopColor={C.green} stopOpacity="0.5" />
                      <stop offset="0.3" stopColor={C.yellow} stopOpacity="0.5" />
                      <stop offset="1" stopColor={C.red} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="20"
                    y="40"
                    width="480"
                    height="24"
                    rx="4"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <rect x="20" y="40" width="480" height="24" rx="4" fill="url(#memgrad)" />
                  {[
                    { x: 50, tokens: "1K", gb: "2.7 GB" },
                    { x: 180, tokens: "4K", gb: "10.7 GB" },
                    { x: 420, tokens: "32K", gb: "86 GB" },
                  ].map(({ x, tokens, gb }) => (
                    <g key={`tick${x}`}>
                      <line x1={x} y1="64" x2={x} y2="72" stroke={C.dim} strokeWidth="1" />
                      <text x={x} y="86" fill={C.dim} fontSize="11" textAnchor="middle">
                        {tokens}
                      </text>
                      <text x={x} y="100" fill="#ef9a9a" fontSize="12" textAnchor="middle" fontWeight="700">
                        {gb}
                      </text>
                    </g>
                  ))}
                  <text x="20" y="28" fill={C.dim} fontSize="12">
                    KV cache size grows with sequence length (LLaMA 70B, FP16)
                  </text>
                </svg>
              </div>
            </>,
          )}

          {inner(
            C.red,
            <>
              <T color="#ef9a9a" bold center size={15}>
                And every concurrent user needs their own cache
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "1 user", val: "10.7 GB" },
                  { label: "10 users", val: "107 GB" },
                  { label: "100 users", val: "1,070 GB" },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      background: `${C.red}10`,
                      border: `1px solid ${C.red}30`,
                      minWidth: 110,
                      textAlign: "center",
                    }}
                  >
                    <T color={C.dim} size={12}>
                      {label}
                    </T>
                    <T color="#ef9a9a" size={14} bold>
                      {val}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
                Long-context models (128K tokens) consume enormous memory. This is a major reason why serving LLMs is
                expensive, and why techniques like grouped-query attention exist to shrink the cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
      {subBtn(7)}

      {/* ── Sub 8: The Deal - Memory for Speed ── */}
      <Reveal when={sub >= 8}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Deal - Memory for Speed
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            The KV cache is a trade. It costs memory and pays back speed. Here's the final ledger.
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 240px",
                padding: 14,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}30`,
              }}
            >
              <T color="#ef9a9a" bold center size={16}>
                Without KV Cache
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
                    Speed:
                  </T>
                  <T color={C.dim} size={14}>
                    slow, O(N²) per step, O(N³) total
                  </T>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
                    Memory:
                  </T>
                  <T color={C.dim} size={14}>
                    low, nothing stored
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 240px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}30`,
              }}
            >
              <T color="#a5d6a7" bold center size={16}>
                With KV Cache
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.green} size={14} bold style={{ minWidth: 70 }}>
                    Speed:
                  </T>
                  <T color={C.dim} size={14}>
                    fast, O(N) per step, O(N²) total
                  </T>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <T color={C.red} size={14} bold style={{ minWidth: 70 }}>
                    Memory:
                  </T>
                  <T color={C.dim} size={14}>
                    GB-scale, grows per token
                  </T>
                </div>
              </div>
            </div>
          </div>

          {inner(
            C.yellow,
            <>
              <T color="#fff176" bold center size={16}>
                At 1000 tokens:
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.red}10`,
                    minWidth: 140,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold size={13}>
                    Without cache
                  </T>
                  <T color={C.dim} size={13}>
                    ~333 million ops
                  </T>
                </div>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    background: `${C.green}10`,
                    minWidth: 140,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold size={13}>
                    With cache
                  </T>
                  <T color={C.dim} size={13}>
                    ~500 thousand ops
                  </T>
                </div>
              </div>
              <T color="#fff176" bold center size={18} style={{ marginTop: 10 }}>
                ~660× faster
              </T>
            </>,
          )}

          {inner(
            C.cyan,
            <>
              <T color="#80deea" bold center size={15}>
                Every fast LLM you've ever used runs on this trick.
              </T>
              <T color="#80deea" size={14} center style={{ marginTop: 4 }}>
                Without it, ChatGPT would take minutes per response instead of seconds.
              </T>
            </>,
          )}

          {inner(
            C.purple,
            <>
              <T color="#b8a9ff" size={13} center>
                A note on scope: the cache only exists at inference time. During training, all tokens are processed in
                parallel, so there's nothing to cache.
              </T>
            </>,
          )}
        </Box>
      </Reveal>
    </div>
  );
};

// ═══════ CH: Why K Transpose? - Making the Shapes Fit ═══════
