import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhyEightHeads(ctx) {
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
}
