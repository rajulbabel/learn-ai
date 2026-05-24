import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag, ChapterLink } from "../../components.jsx";

export default function AddNormTwo(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Where we are - just after FFN */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            The Second Add & Norm
          </T>
          <T color="#90caf9" size={16} center style={{ marginTop: 4 }}>
            The FFN just transformed each token's representation. But remember the problem from <ChapterLink to="12.2">chapter 12.2</ChapterLink> - values
            drift in deep networks. We need to stabilize again.
          </T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
              { label: "arrow" },
              { label: "Add & Norm (first)", color: C.blue, bg: `${C.blue}10`, highlight: false },
              { label: "arrow" },
              { label: "FFN", color: C.orange, bg: `${C.orange}10`, highlight: false },
              { label: "arrow" },
              { label: "Add & Norm (second)", color: C.blue, bg: `${C.blue}18`, highlight: true },
              { label: "arrow" },
              { label: "Block Output", color: C.green, bg: `${C.green}10`, highlight: false },
            ].map((item, i) =>
              item.label === "arrow" ? (
                <div key={i} style={{ fontSize: 18, color: C.dim, lineHeight: 1 }}>
                  ↓
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    width: "80%",
                    textAlign: "center",
                    background: item.bg,
                    border: item.highlight ? `2px solid ${item.color}55` : `1px solid ${item.color}20`,
                    boxShadow: item.highlight ? `0 0 12px ${item.color}20` : "none",
                  }}
                >
                  <T color={item.color} bold={item.highlight} center size={item.highlight ? 17 : 15}>
                    {item.label}
                  </T>
                </div>
              ),
            )}
          </div>
          <T color="#90caf9" size={15} center style={{ marginTop: 12 }}>
            This second Add & Norm works exactly the same way as the first - but its input is the FFN output instead of
            the Attention output.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: The Add step - FFN input + FFN output */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The Add - Residual Around FFN
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            Same idea as <ChapterLink to="12.2">chapter 12.2</ChapterLink>: keep the original input by adding it back. The input to FFN was the first Add &
            Norm's output.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: "rgba(0,230,118,0.04)",
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#a5d6a7" bold center size={16}>
              Continuing with "cats":
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag color={C.purple}>FFN input</Tag>
                <code style={{ color: C.purple, fontSize: 15 }}>[-1.36, -0.55, 0.86, 1.06]</code>
              </div>
              <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↓ goes through FFN (<ChapterLink to="12.3">chapter 12.3</ChapterLink>) ↓</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag color={C.orange}>FFN output</Tag>
                <code style={{ color: C.orange, fontSize: 15 }}>[0.51, -0.73, 1.14, 0.22]</code>
              </div>
              <div
                style={{
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 8,
                  background: `${C.green}10`,
                  border: `1px dashed ${C.green}30`,
                }}
              >
                <T color="#a5d6a7" bold center size={16}>
                  The Add Step: FFN input + FFN output
                </T>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <code style={{ color: C.purple, fontSize: 15 }}>[-1.36, -0.55, 0.86, 1.06]</code>
                  <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>+</span>
                  <code style={{ color: C.orange, fontSize: 15 }}>[0.51, -0.73, 1.14, 0.22]</code>
                  <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>=</span>
                  <code style={{ color: C.green, fontSize: 15, fontWeight: 700 }}>[-0.85, -1.28, 2.00, 1.28]</code>
                </div>
              </div>
            </div>
          </div>

          <T color="#a5d6a7" size={15} style={{ marginTop: 10 }}>
            The residual connection ensures that even if the FFN distorts values, the original signal from Add & Norm #1
            survives by being added back.
          </T>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: The Norm step with concrete numbers */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Norm - Stabilize Again
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Same Layer Normalization formula from <ChapterLink to="12.2">chapter 12.2</ChapterLink> - compute mean, subtract, divide by standard deviation,
            scale by gamma, shift by beta.
          </T>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 10,
              background: "rgba(167,139,250,0.04)",
              border: `1px solid ${C.purple}20`,
            }}
          >
            <T color="#b8a9ff" bold center size={16}>
              Normalizing [-0.85, -1.28, 2.00, 1.28]
            </T>

            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ padding: 8, borderRadius: 6, background: `${C.blue}08` }}>
                <T color={C.blue} bold size={14}>
                  mu = (-0.85 + -1.28 + 2.00 + 1.28) / 4 = <strong>0.2875</strong>
                </T>
              </div>
              <div style={{ padding: 8, borderRadius: 6, background: `${C.orange}08` }}>
                <T color={C.orange} bold size={14}>
                  variance = 1.9172, sqrt(variance + epsilon) = <strong>1.3846</strong>
                </T>
              </div>
              <div style={{ padding: 8, borderRadius: 6, background: `${C.green}08` }}>
                <T color={C.green} bold size={14}>
                  Normalize each: (x - mu) / 1.3846
                </T>
                <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                  {[
                    { from: "-0.85", to: "-0.82" },
                    { from: "-1.28", to: "-1.13" },
                    { from: "2.00", to: "1.24" },
                    { from: "1.28", to: "0.72" },
                  ].map(({ from, to }) => (
                    <div
                      key={from}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: `${C.green}08`,
                        border: `1px solid ${C.green}15`,
                      }}
                    >
                      <code style={{ color: C.dim, fontSize: 13 }}>{from}</code>
                      <span style={{ color: C.dim }}> → </span>
                      <code style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>{to}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                padding: 8,
                borderRadius: 6,
                background: `${C.purple}10`,
                border: `1px dashed ${C.purple}30`,
              }}
            >
              <T color="#b8a9ff" bold center size={15}>
                Block output for "cats": [-0.82, -1.13, 1.24, 0.72]
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                With gamma=1.0 and beta=0.0 (initial values). The model will learn optimal gamma and beta during
                training.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: Complete single-block pipeline */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Complete Single Block - All 4 Steps
          </T>
          <T color="#80deea" size={16} center style={{ marginTop: 4 }}>
            Here's "cats" flowing through one entire Transformer block, start to finish:
          </T>

          <div
            data-full-block="true"
            style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            {[
              { step: "Input (cats)", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.dim, tag: "Input" },
              { step: "arrow", label: "Multi-Head Attention" },
              { step: "Attention Output", val: "[0.3, -0.1, 0.2, 0.4]", color: C.pink, tag: "Attn" },
              { step: "arrow", label: "Add & Norm #1" },
              { step: "After 1st Add & Norm", val: "[-1.36, -0.55, 0.86, 1.06]", color: C.blue, tag: "A&N 1" },
              { step: "arrow", label: "Feed-Forward Network" },
              { step: "FFN Output", val: "[0.51, -0.73, 1.14, 0.22]", color: C.orange, tag: "FFN" },
              { step: "arrow", label: "Add & Norm #2" },
              { step: "Block Output", val: "[-0.82, -1.13, 1.24, 0.72]", color: C.green, tag: "A&N 2" },
            ].map((item, i) =>
              item.step === "arrow" ? (
                <div
                  key={i}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}
                >
                  <span style={{ fontSize: 14, color: C.dim }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: C.dim }}>↓</span>
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 8,
                    width: "95%",
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <Tag color={item.color}>{item.tag}</Tag>
                  <T color={item.color} size={13} bold>
                    {item.step}
                  </T>
                  <code style={{ color: `${item.color}bb`, fontSize: 13, marginLeft: "auto" }}>{item.val}</code>
                </div>
              ),
            )}
          </div>

          <T color="#80deea" size={15} center style={{ marginTop: 12 }}>
            One block: Attention moves information between tokens, Add & Norm stabilizes, FFN processes each token's
            knowledge, Add & Norm stabilizes again. This is the heartbeat of every Transformer.
          </T>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Why Add & Norm appears twice */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Why Twice? - One Per Sub-Layer
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 6 }}>
            Add & Norm appears <strong>twice</strong> because each Transformer block has two sub-layers: Attention and
            FFN. Each sub-layer gets its own Add & Norm because each one can independently cause value drift.
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: `${C.pink}08`,
                border: `1px solid ${C.pink}25`,
              }}
            >
              <T color={C.pink} bold center size={15}>
                Sub-layer 1: Attention
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                <T color={C.dim} size={12}>
                  Input x
                </T>
                <T color={C.dim} size={12}>
                  ↓
                </T>
                <T color={C.pink} size={12}>
                  Attention(x)
                </T>
                <T color={C.dim} size={12}>
                  ↓
                </T>
                <T color={C.blue} bold size={12}>
                  Add & Norm #1
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  Stabilizes after attention changes
                </T>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: `${C.orange}08`,
                border: `1px solid ${C.orange}25`,
              }}
            >
              <T color={C.orange} bold center size={15}>
                Sub-layer 2: FFN
              </T>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                <T color={C.dim} size={12}>
                  From A&N #1
                </T>
                <T color={C.dim} size={12}>
                  ↓
                </T>
                <T color={C.orange} size={12}>
                  FFN(x)
                </T>
                <T color={C.dim} size={12}>
                  ↓
                </T>
                <T color={C.blue} bold size={12}>
                  Add & Norm #2
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  Stabilizes after FFN changes
                </T>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" bold center size={15}>
              The Rule
            </T>
            <T color="#fff176" size={15} style={{ marginTop: 4 }}>
              In Transformers, every sub-layer that transforms values gets wrapped with its own residual connection and
              layer norm. This is what makes it possible to stack 96 blocks deep without the signal degrading. If you
              only normalized once at the end of the block, the FFN's output could already be in a bad range before it
              gets stabilized.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
