import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag, ChapterLink } from "../../components.jsx";

export default function ResidualHighway(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: The problem - vanishing gradients in deep networks */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Problem: Gradients Vanish in Deep Networks
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
            In <ChapterLink to="2.8">chapter 2.8</ChapterLink>, we learned that gradients shrink as they travel backward through layers. During
            backpropagation, each layer multiplies the gradient by its derivative. If that derivative is even slightly
            below 1.0, the gradient shrinks exponentially.
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
            }}
          >
            <T color="#ef9a9a" bold center size={16}>
              Multiplying through 96 layers:
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                {
                  factor: "0.99",
                  result: "0.99^96 = 0.38",
                  pct: 38,
                  clr: C.yellow,
                  note: "Even near-perfect derivatives lose 62% of the gradient",
                },
                {
                  factor: "0.9",
                  result: "0.9^96 = 0.0000396",
                  pct: 1,
                  clr: C.orange,
                  note: "Gradient is effectively zero by layer 1",
                },
                {
                  factor: "0.5",
                  result: "0.5^96 = 1.3 x 10^-29",
                  pct: 0.3,
                  clr: C.red,
                  note: "Completely gone - no learning possible",
                },
              ].map(({ factor, result, pct, clr, note }) => (
                <div
                  key={factor}
                  style={{ padding: "8px 12px", borderRadius: 8, background: `${clr}06`, border: `1px solid ${clr}12` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Tag color={clr}>F'(x) = {factor}</Tag>
                    <code style={{ color: clr, fontSize: 14, fontWeight: 700 }}>{result}</code>
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      height: 14,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.04)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{ width: `${Math.max(pct, 0.5)}%`, height: "100%", borderRadius: 3, background: clr }}
                    />
                  </div>
                  <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                    {note}
                  </T>
                </div>
              ))}
            </div>
          </div>

          <T color="#ef9a9a" size={16} style={{ marginTop: 12 }}>
            GPT-3 has 96 layers. Without a fix, the gradient arriving at layer 1 from layer 96 would be{" "}
            <strong>essentially zero</strong>. Layer 1 would never learn. The model would be dead on arrival.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: The residual connection: F(x) + x */}
      <Reveal when={sub >= 1}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The Residual Connection: output = F(x) + x
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            The fix is deceptively simple: <strong>add the input directly to the output</strong>. The "+ x" creates a
            shortcut path that bypasses the entire layer.
          </T>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 14,
                borderRadius: 10,
                background: `${C.red}06`,
                border: `1px solid ${C.red}20`,
              }}
            >
              <T color={C.red} bold center size={15}>
                Path A: Without Residual
              </T>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                {[
                  { label: "input x", color: C.cyan },
                  { label: "arrow" },
                  { label: "weight1", color: C.pink },
                  { label: "arrow" },
                  { label: "activation", color: C.yellow },
                  { label: "arrow" },
                  { label: "weight2", color: C.pink },
                  { label: "arrow" },
                  { label: "activation", color: C.yellow },
                  { label: "arrow" },
                  { label: "output", color: C.red },
                ].map((item, i) =>
                  item.label === "arrow" ? (
                    <div key={i} style={{ fontSize: 14, color: C.dim, lineHeight: 1 }}>
                      ↓
                    </div>
                  ) : (
                    <div
                      key={i}
                      style={{
                        padding: "4px 16px",
                        borderRadius: 6,
                        background: `${item.color}08`,
                        border: `1px solid ${item.color}15`,
                        textAlign: "center",
                      }}
                    >
                      <T color={item.color} size={13}>
                        {item.label}
                      </T>
                    </div>
                  ),
                )}
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                Gradient must travel through every layer. It shrinks at each step.
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
              <T color={C.green} bold center size={15}>
                Path B: With Residual
              </T>
              <div style={{ marginTop: 10, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                  {[
                    { label: "input x", color: C.cyan },
                    { label: "arrow" },
                    { label: "weight1", color: C.pink },
                    { label: "arrow" },
                    { label: "activation", color: C.yellow },
                    { label: "arrow" },
                    { label: "weight2", color: C.pink },
                    { label: "arrow" },
                    { label: "activation", color: C.yellow },
                    { label: "arrow" },
                    { label: "F(x) + x", color: C.green },
                  ].map((item, i) =>
                    item.label === "arrow" ? (
                      <div key={i} style={{ fontSize: 14, color: C.dim, lineHeight: 1 }}>
                        ↓
                      </div>
                    ) : (
                      <div
                        key={i}
                        style={{
                          padding: "4px 16px",
                          borderRadius: 6,
                          background: `${item.color}08`,
                          border: `1px solid ${item.color}15`,
                          textAlign: "center",
                        }}
                      >
                        <T color={item.color} size={13}>
                          {item.label}
                        </T>
                      </div>
                    ),
                  )}
                </div>
                {/* Skip connection arrow */}
                <div
                  style={{
                    position: "absolute",
                    right: -8,
                    top: 0,
                    bottom: 0,
                    width: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: 2, height: "90%", background: C.green, borderRadius: 2 }} />
                  <div style={{ color: C.green, fontSize: 14, marginTop: -4 }}>↓</div>
                </div>
                <div style={{ position: "absolute", right: -30, top: "50%", transform: "translateY(-50%)" }}>
                  <T color={C.green} bold size={11}>
                    skip!
                  </T>
                </div>
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                The "+ x" adds a direct highway that bypasses all layers.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: Why it solves vanishing gradients - the math */}
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Why It Solves Vanishing Gradients
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 6 }}>
            The math is elegant. Take the derivative of the residual output:
          </T>

          <div
            style={{
              margin: "14px 0",
              borderRadius: 14,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.yellow}25`,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "18px 20px", textAlign: "center" }}>
              <T
                color={C.dim}
                size={14}
                center
                style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}
              >
                The Residual Gradient
              </T>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}
              >
                <span
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}
                >
                  <span
                    style={{
                      color: C.yellow,
                      fontWeight: 700,
                      fontSize: 17,
                      borderBottom: `2px solid ${C.dim}`,
                      paddingBottom: 3,
                    }}
                  >
                    d
                  </span>
                  <span style={{ color: C.yellow, fontWeight: 700, fontSize: 17, paddingTop: 3 }}>dx</span>
                </span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>[</span>
                <span style={{ color: C.orange, fontWeight: 800, fontSize: 20 }}>F(x)</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>+ x</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>]</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>=</span>
                <span style={{ color: C.orange, fontWeight: 800, fontSize: 20 }}>F'(x)</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>+ 1</span>
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  {
                    sym: "F'(x)",
                    desc: "gradient through the layer weights",
                    why: "can shrink toward 0",
                    color: C.orange,
                  },
                  {
                    sym: "+ 1",
                    desc: "gradient through the skip connection",
                    why: "ALWAYS exactly 1, no matter what",
                    color: C.green,
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{
                      background: `${p.color}08`,
                      borderRadius: 6,
                      padding: "6px 10px",
                      border: `1px solid ${p.color}15`,
                    }}
                  >
                    <T color={p.color} bold size={14}>
                      {p.sym}
                    </T>
                    <T color={C.dim} size={12}>
                      {" "}
                      = {p.desc}
                    </T>
                    <div>
                      <T color={p.color} size={12}>
                        {p.why}
                      </T>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <T color="#fff176" size={16} style={{ marginTop: 4 }}>
            That <strong style={{ color: C.green }}>+ 1</strong> is everything. Even if F'(x) approaches 0, the total
            gradient is at least 1. The gradient through the skip connection is <strong>always 1</strong>, regardless of
            what the layer weights do.
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <div
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
              }}
            >
              <T color={C.red} bold center size={14}>
                Without residual
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 4 }}>
                Gradient = F'(x)
              </T>
              <T color={C.dim} center size={13}>
                If F'(x) = 0.01, gradient = 0.01
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
              }}
            >
              <T color={C.green} bold center size={14}>
                With residual
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 4 }}>
                Gradient = F'(x) + 1
              </T>
              <T color={C.dim} center size={13}>
                If F'(x) = 0.01, gradient = <strong style={{ color: C.green }}>1.01</strong>
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: Visual - the gradient highway */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Gradient Highway
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 6 }}>
            Visualize a 6-layer transformer. Gradients travel backward from Layer 6 to Layer 1 via two paths:
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
            {[6, 5, 4, 3, 2, 1].map((layer, idx) => (
              <div key={layer}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: `${C.cyan}06`,
                    border: `1px solid ${C.cyan}12`,
                  }}
                >
                  <Tag color={C.cyan}>Layer {layer}</Tag>
                  <div style={{ flex: 1, display: "flex", gap: 8 }}>
                    <div
                      style={{
                        flex: 1,
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: `${C.orange}08`,
                        border: `1px solid ${C.orange}15`,
                        textAlign: "center",
                      }}
                    >
                      <T color={C.orange} size={11}>
                        Through weights
                      </T>
                      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", marginTop: 3 }}>
                        <div
                          style={{
                            width: `${Math.max(100 * Math.pow(0.7, idx), 1)}%`,
                            height: "100%",
                            borderRadius: 3,
                            background: C.orange,
                          }}
                        />
                      </div>
                      <T color={C.dim} size={10}>
                        {Math.pow(0.7, idx).toFixed(2)}
                      </T>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: `${C.green}08`,
                        border: `1px solid ${C.green}15`,
                        textAlign: "center",
                      }}
                    >
                      <T color={C.green} size={11}>
                        Through skip: always 1.0
                      </T>
                      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", marginTop: 3 }}>
                        <div style={{ width: "100%", height: "100%", borderRadius: 3, background: C.green }} />
                      </div>
                      <T color={C.dim} size={10}>
                        1.00
                      </T>
                    </div>
                  </div>
                </div>
                {idx < 5 && (
                  <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>↑ gradient flows backward ↑</div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
            }}
          >
            <T color="#80deea" size={15} center>
              Through weights: 0.7^5 = <strong style={{ color: C.orange }}>0.17</strong> (lost 83% of the signal).
              Through skip connections: <strong style={{ color: C.green }}>1.00</strong> (full signal preserved). The
              skip path delivers the gradient from layer 6 to layer 1 without any multiplication.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Why critical for transformers */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Why This Is Critical for Transformers
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Modern transformers are absurdly deep. Without residual connections, training them would be impossible.
          </T>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { model: "GPT-2", layers: 12, residuals: 24, color: C.green },
              { model: "GPT-3", layers: 96, residuals: 192, color: C.orange },
              { model: "GPT-4 (est.)", layers: 120, residuals: 240, color: C.red },
            ].map(({ model, layers, residuals, color }) => (
              <div
                key={model}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                }}
              >
                <T color={color} bold size={14} style={{ minWidth: 100 }}>
                  {model}
                </T>
                <T color={C.dim} size={13}>
                  {layers} layers
                </T>
                <T color={C.dim} size={13} bold style={{ marginLeft: "auto" }}>
                  {residuals} gradient highways
                </T>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}25`,
            }}
          >
            <T color="#b8a9ff" bold center size={16}>
              TWO residual connections per block
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
              Every transformer block has two sub-layers: Attention and FFN. Each gets its own residual connection
              (<ChapterLink to="12.2">chapter 12.2</ChapterLink>). That means GPT-3's 96 blocks have <strong>192 gradient highways</strong> - one around
              every Attention layer and one around every FFN layer.
            </T>

            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {[
                { label: "Input", color: C.cyan },
                { label: "arrow" },
                { label: "Attention + Residual #1", color: C.pink },
                { label: "arrow" },
                { label: "FFN + Residual #2", color: C.orange },
                { label: "arrow" },
                { label: "Block Output", color: C.green },
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
                      background: `${item.color}08`,
                      border: `1px solid ${item.color}20`,
                      textAlign: "center",
                    }}
                  >
                    <T color={item.color} size={13}>
                      {item.label}
                    </T>
                  </div>
                ),
              )}
            </div>
          </div>

          <T color="#b8a9ff" size={15} style={{ marginTop: 12 }}>
            Without residual connections, gradients would vanish by layer 3. With them, gradients flow freely through
            all 96 layers on the skip path, letting even the earliest layers learn from the loss signal. This is what
            makes deep transformers trainable.
          </T>
        </Box>
      </Reveal>
    </div>
  );
}
