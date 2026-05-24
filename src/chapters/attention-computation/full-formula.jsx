import { C } from "../../config.js";
import { T, Reveal, SubBtn } from "../../components.jsx";

export default function FullFormula(ctx) {
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
}
