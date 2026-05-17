import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function ScaleByRootDk(ctx) {
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
}
