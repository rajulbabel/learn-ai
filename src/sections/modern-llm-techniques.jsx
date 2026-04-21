import { Box, T, Reveal, SubBtn } from "../components.jsx";
import { C } from "../config.js";

export const MixtureOfExperts = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The problem - more brain, same effort per token
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Training a bigger model means more knowledge, but every token pays the full compute cost. What if most of
            the brain could nap while the relevant part does the work?
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold center size={18}>
                Dense 47B model
              </T>
              <T color="#ef9a9a" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.red} bold center size={22} style={{ marginTop: 2 }}>
                47B (all of it)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Every FFN, every attention head, every layer fires for every token.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold center size={18}>
                MoE model (Mixtral 8x7B)
              </T>
              <T color="#80e8a5" size={16} center style={{ marginTop: 6 }}>
                Active params per token:
              </T>
              <T color={C.green} bold center size={22} style={{ marginTop: 2 }}>
                ~13B (only 2 of 8 experts)
              </T>
              <T color={C.dim} size={14} center style={{ marginTop: 4 }}>
                Same 47B total capacity loaded in memory, but only a slice runs per token.
              </T>
            </div>
          </div>
        </Box>
      )}
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

export const Thinking = () => (
  <Box color={C.cyan} style={{ width: "100%" }}>
    <T color={C.cyan} bold center size={20}>
      Placeholder - implemented in later tasks
    </T>
  </Box>
);
