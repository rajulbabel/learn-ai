import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function WeightedSum(ctx) {
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
}
