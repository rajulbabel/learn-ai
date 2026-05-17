import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PreNormVsPostNorm(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Post-Norm (original 2017 paper) */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Post-Norm (Original 2017 Paper)
          </T>
          <T color="#90caf9" size={16} style={{ marginTop: 6 }}>
            In the original "Attention Is All You Need" paper, LayerNorm comes <strong>after</strong> the residual Add.
            This is what we covered in chapter 8.2. Here is the exact order:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Input x", color: C.cyan, highlight: false },
              { label: "arrow" },
              { label: "Attention(x)", color: C.pink, highlight: false },
              { label: "arrow" },
              { label: "Add: x + Attention(x)", color: C.green, highlight: false },
              { label: "arrow" },
              { label: "LayerNorm", color: C.blue, highlight: true },
              { label: "arrow" },
              { label: "FFN", color: C.orange, highlight: false },
              { label: "arrow" },
              { label: "Add: prev + FFN(prev)", color: C.green, highlight: false },
              { label: "arrow" },
              { label: "LayerNorm", color: C.blue, highlight: true },
            ].map((item, i) =>
              item.label === "arrow" ? (
                <div key={i} style={{ fontSize: 14, color: C.dim, lineHeight: 1 }}>
                  ↓
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    padding: "6px 20px",
                    borderRadius: 6,
                    width: "80%",
                    textAlign: "center",
                    background: item.highlight ? `${item.color}15` : `${item.color}08`,
                    border: item.highlight ? `2px solid ${item.color}50` : `1px solid ${item.color}20`,
                  }}
                >
                  <T color={item.color} bold={item.highlight} center size={14}>
                    {item.label}
                  </T>
                </div>
              ),
            )}
          </div>

          <T color="#90caf9" size={15} center style={{ marginTop: 12 }}>
            Key feature: LayerNorm sits <strong>after</strong> the residual add. The residual path passes through
            LayerNorm before reaching the next sub-layer.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: Pre-Norm (modern approach) */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Pre-Norm (Modern Approach)
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            In pre-norm, LayerNorm comes <strong>before</strong> each sub-layer. The residual add gets the{" "}
            <strong>raw, unnormalized input</strong> - not the normalized version.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Input x", color: C.cyan, highlight: false },
              { label: "arrow" },
              { label: "LayerNorm(x)", color: C.green, highlight: true },
              { label: "arrow" },
              { label: "Attention(LayerNorm(x))", color: C.pink, highlight: false },
              { label: "arrow" },
              { label: "Add: x + Attention(LayerNorm(x))", color: C.green, highlight: false },
              { label: "arrow" },
              { label: "LayerNorm(prev)", color: C.green, highlight: true },
              { label: "arrow" },
              { label: "FFN(LayerNorm(prev))", color: C.orange, highlight: false },
              { label: "arrow" },
              { label: "Add: prev + FFN(LayerNorm(prev))", color: C.green, highlight: false },
            ].map((item, i) =>
              item.label === "arrow" ? (
                <div key={i} style={{ fontSize: 14, color: C.dim, lineHeight: 1 }}>
                  ↓
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    padding: "6px 20px",
                    borderRadius: 6,
                    width: "80%",
                    textAlign: "center",
                    background: item.highlight ? `${item.color}15` : `${item.color}08`,
                    border: item.highlight ? `2px solid ${item.color}50` : `1px solid ${item.color}20`,
                  }}
                >
                  <T color={item.color} bold={item.highlight} center size={14}>
                    {item.label}
                  </T>
                </div>
              ),
            )}
          </div>

          <T color="#a5d6a7" size={15} center style={{ marginTop: 12 }}>
            Key difference: the Add step receives the <strong>raw input x</strong>, not the normalized version.
            LayerNorm only feeds into the sub-layer, not into the skip path.
          </T>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: Side-by-side comparison */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Side-by-Side Comparison
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 6 }}>
            Let's trace input [-0.5, 0.3, 0.7, 0.6] ("cats" embedding) through the Attention sub-layer in both
            approaches:
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}20`,
              }}
            >
              <T color={C.blue} bold center size={15}>
                Post-Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { step: "Input x", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.cyan },
                  { step: "Attention(x)", val: "[0.3, -0.1, 0.2, 0.4]", color: C.pink },
                  { step: "Add: x + Attn", val: "[-0.2, 0.2, 0.9, 1.0]", color: C.green },
                  { step: "LayerNorm", val: "[-1.36, -0.55, 0.86, 1.06]", color: C.blue },
                ].map(({ step, val, color }) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: `${color}06`,
                    }}
                  >
                    <T color={color} size={11} bold style={{ minWidth: 80 }}>
                      {step}
                    </T>
                    <code style={{ color: `${color}bb`, fontSize: 12 }}>{val}</code>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={12} center style={{ marginTop: 6 }}>
                Norm is last. Skip path passes through Norm.
              </T>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={15}>
                Pre-Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { step: "Input x", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.cyan },
                  { step: "LayerNorm(x)", val: "[-1.36, -0.55, 0.86, 1.06]", color: C.green },
                  { step: "Attn(LN(x))", val: "[0.28, -0.12, 0.18, 0.38]", color: C.pink },
                  { step: "Add: x + Attn", val: "[-0.22, 0.18, 0.88, 0.98]", color: C.cyan },
                ].map(({ step, val, color }) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: `${color}06`,
                    }}
                  >
                    <T color={color} size={11} bold style={{ minWidth: 80 }}>
                      {step}
                    </T>
                    <code style={{ color: `${color}bb`, fontSize: 12 }}>{val}</code>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={12} center style={{ marginTop: 6 }}>
                Norm is first. Skip path is clean - just addition.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" size={14} center>
              Notice the critical difference: in post-norm, the skip path goes through LayerNorm. In pre-norm, the skip
              path is just pure addition - no transformations on the highway.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: Why pre-norm wins */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why Pre-Norm Wins
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Two key advantages make pre-norm the clear winner for deep models:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{ padding: 14, borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}20` }}
            >
              <T color={C.green} bold size={16}>
                1. Cleaner Gradient Flow
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                In <strong style={{ color: C.blue }}>post-norm</strong>, the gradient on the skip path must pass through
                LayerNorm at every block. LayerNorm has its own derivative that modifies the gradient - not as bad as
                vanishing, but it adds noise and makes optimization harder.
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                In <strong style={{ color: C.green }}>pre-norm</strong>, the skip path is <strong>pure addition</strong>
                . The gradient flows from the last block to the first block on a clean highway with derivative = 1 at
                every step. No LayerNorm interference on the residual stream.
              </T>
            </div>

            <div
              style={{ padding: 14, borderRadius: 10, background: `${C.orange}06`, border: `1px solid ${C.orange}20` }}
            >
              <T color={C.orange} bold size={16}>
                2. Training Stability
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                <strong style={{ color: C.blue }}>Post-norm</strong> requires very careful learning rate warmup - start
                with a tiny learning rate and slowly increase it over thousands of steps. Without warmup, gradients in
                early training are unstable and the model diverges (loss goes to infinity).
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                <strong style={{ color: C.green }}>Pre-norm</strong> is more forgiving. It works with larger learning
                rates from the start. The clean gradient highway stabilizes training even without careful warmup
                schedules. This makes training faster and less finicky.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Who uses what */}
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Who Uses What
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 14,
                borderRadius: 10,
                background: `${C.blue}06`,
                border: `1px solid ${C.blue}20`,
              }}
            >
              <T color={C.blue} bold center size={16}>
                Post-Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {['"Attention Is All You Need" (2017)', "Early BERT models", "Some early translation models"].map(
                  (m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "flex-start",
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: `${C.blue}06`,
                      }}
                    >
                      <span style={{ color: C.blue, fontSize: 10, marginTop: 4 }}>&#9679;</span>
                      <T color={C.dim} size={13}>
                        {m}
                      </T>
                    </div>
                  ),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                Historical. Used mainly in the original paper.
              </T>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: 14,
                borderRadius: 10,
                background: `${C.green}06`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={16}>
                Pre-Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  "GPT-2, GPT-3, GPT-4",
                  "LLaMA, LLaMA 2, LLaMA 3",
                  "Mistral, Mixtral",
                  "Claude",
                  "Virtually all modern LLMs",
                ].map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: `${C.green}06`,
                    }}
                  >
                    <span style={{ color: C.green, fontSize: 10, marginTop: 4 }}>&#9679;</span>
                    <T color={C.dim} size={13}>
                      {m}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                The industry standard since ~2019.
              </T>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 10,
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}25`,
            }}
          >
            <T color="#ffcc80" bold center size={16}>
              The Field Converged
            </T>
            <T color="#ffcc80" size={15} style={{ marginTop: 6 }}>
              The shift happened because pre-norm trains faster, scales better to deep models, and is more robust. When
              you hear about a modern LLM with 96+ layers, it is almost certainly using pre-norm. The original paper
              used post-norm, but practice proved pre-norm superior for large-scale training.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
