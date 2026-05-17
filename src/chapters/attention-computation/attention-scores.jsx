import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function AttentionScores(ctx) {
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
}
