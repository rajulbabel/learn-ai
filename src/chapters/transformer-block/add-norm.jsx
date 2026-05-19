import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function AddNorm(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Where does Add & Norm sit? - Block overview diagram */}
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            Inside one Transformer block, there are 4 steps:
          </T>
          <T color="#90caf9" size={16} center style={{ marginTop: 4 }}>
            Now let's zoom out and see what happens after attention inside a single Transformer block.
          </T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Input Embeddings", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
              { label: "arrow" },
              { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
              { label: "arrow" },
              { label: "Add & Norm", color: C.blue, bg: `${C.blue}18`, highlight: true },
              { label: "arrow" },
              { label: "FFN (Feed-Forward Network)", color: C.orange, bg: `${C.orange}10`, highlight: false },
              { label: "arrow" },
              { label: "Add & Norm", color: C.blue, bg: `${C.blue}18`, highlight: true },
              { label: "arrow" },
              { label: "Output", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
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
            Notice: Add & Norm appears <strong>twice</strong> in every block - once after Attention, once after FFN.
            It's the stabilizer that keeps everything in check.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: The Problem - Why we need residual connections */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={20}>
            The Problem: Values Drift in Deep Networks
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
            GPT-3 has 96 layers. Each layer multiplies values by weights (we learned this in chapters 1.4-1.6). The
            result depends on the weights - if they're slightly below 1.0, values shrink. If slightly above, values
            explode. Keeping them perfectly balanced across 96 layers is nearly impossible.
          </T>

          <T color="#ef9a9a" bold center size={16} style={{ marginTop: 14 }}>
            Take 0.7 from "cats" embedding. Two scenarios:
          </T>
          <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <T color={C.red} bold center size={14}>
                If weights average 0.9 (shrink)
              </T>
              {[
                { layer: "Start", val: "0.7", pct: 70, clr: C.green },
                { layer: "Layer 10", val: "0.24", pct: 24, clr: C.yellow },
                { layer: "Layer 50", val: "0.004", pct: 2, clr: C.red },
                { layer: "Layer 96", val: "0.00003", pct: 0.5, clr: C.red },
              ].map(({ layer, val, pct, clr }) => (
                <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 12, minWidth: 55, textAlign: "right" }}>{layer}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 14,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.04)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, 1)}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: clr,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <code style={{ color: clr, fontSize: 12, minWidth: 50, textAlign: "right" }}>{val}</code>
                </div>
              ))}
              <T color={C.dim} center size={12} style={{ marginTop: 2 }}>
                Value vanishes to nearly zero
              </T>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <T color={C.orange} bold center size={14}>
                If weights average 1.1 (grow)
              </T>
              {[
                { layer: "Start", val: "0.7", pct: 7, clr: C.green },
                { layer: "Layer 10", val: "1.8", pct: 18, clr: C.yellow },
                { layer: "Layer 50", val: "82", pct: 82, clr: C.orange },
                { layer: "Layer 96", val: "4,838", pct: 100, clr: C.red },
              ].map(({ layer, val, pct, clr }) => (
                <div key={layer} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 12, minWidth: 55, textAlign: "right" }}>{layer}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 14,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.04)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, 1)}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: clr,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <code style={{ color: clr, fontSize: 12, minWidth: 50, textAlign: "right" }}>{val}</code>
                </div>
              ))}
              <T color={C.dim} center size={12} style={{ marginTop: 2 }}>
                Value explodes to thousands
              </T>
            </div>
          </div>

          <T color="#ef9a9a" bold center size={16} style={{ marginTop: 12 }}>
            Both are <Tag color={C.red}>broken</Tag>. Whether the value goes to 0.00003 or 4,838 - it's no longer a
            useful embedding. And gradients during backpropagation (chapter 2.2) drift the same way, so the model can't
            learn either.
          </T>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: The Add - Residual Connection */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            The "Add" - Keep the Original
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            The fix is beautifully simple: <strong>add the original input back to the output.</strong> That's it. The
            fancy name for this is "residual connection" - "residual" just means "leftover." You're keeping the leftover
            original so it never gets lost.
          </T>

          <div
            data-residual="true"
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 10,
              background: "rgba(0,230,118,0.04)",
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color="#a5d6a7" bold center size={16}>
              How it works for "cats" (embedding = [-0.5, 0.3, 0.7, 0.6]):
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Step 1: Input goes through attention */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag color={C.cyan}>original input</Tag>
                <code style={{ color: C.cyan, fontSize: 15 }}>[-0.5, 0.3, 0.7, 0.6]</code>
              </div>
              <div style={{ textAlign: "center", color: C.dim, fontSize: 14 }}>
                ↓ goes through Multi-Head Attention ↓
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag color={C.pink}>attention output</Tag>
                <code style={{ color: C.pink, fontSize: 15 }}>[0.3, -0.1, 0.2, 0.4]</code>
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
                  The Add Step: original + attention output
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
                  <code style={{ color: C.cyan, fontSize: 15 }}>[-0.5, 0.3, 0.7, 0.6]</code>
                  <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>+</span>
                  <code style={{ color: C.pink, fontSize: 15 }}>[0.3, -0.1, 0.2, 0.4]</code>
                  <span style={{ color: C.green, fontSize: 20, fontWeight: 700 }}>=</span>
                  <code style={{ color: C.green, fontSize: 15, fontWeight: 700 }}>[-0.2, 0.2, 0.9, 1.0]</code>
                </div>
              </div>
            </div>
          </div>

          <T color="#a5d6a7" size={16} style={{ marginTop: 12 }}>
            Think of it as a <strong>highway</strong>: even if the attention layer learns nothing useful, the original
            embedding still passes through untouched. During backpropagation (chapter 2.2), the error can travel
            backward along this highway without shrinking to zero.
          </T>

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
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
                Without the Add
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 4 }}>
                Input → Attention → Output
              </T>
              <T color={C.dim} center size={13}>
                If attention messes up, values are lost
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
                With the Add
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 4 }}>
                Input → Attention → Output + Input
              </T>
              <T color={C.dim} center size={13}>
                Original values always survive
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: The Norm - Layer Normalization step by step with full formula */}
      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The "Norm" - Layer Normalization
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            After adding, values can drift to unpredictable ranges. Layer Norm rescales them to a stable range. Here is
            the actual formula used in every Transformer:
          </T>

          {/* The real formula - styled like attention formula (7.8) */}
          <div
            style={{
              margin: "12px 0",
              borderRadius: 14,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.purple}25`,
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
                The Layer Normalization Formula
              </T>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}
              >
                <span style={{ color: C.purple, fontWeight: 800, fontSize: 20 }}>
                  LayerNorm(x<sub style={{ fontSize: 14 }}>i</sub>) =
                </span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>&gamma;</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
                <span
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}
                >
                  <span
                    style={{
                      color: C.cyan,
                      fontWeight: 700,
                      fontSize: 17,
                      borderBottom: `2px solid ${C.dim}`,
                      paddingBottom: 3,
                    }}
                  >
                    x<sub>i</sub> - <span style={{ color: C.blue }}>&mu;</span>
                  </span>
                  <span style={{ color: C.orange, fontWeight: 700, fontSize: 17, paddingTop: 3 }}>
                    &radic;(<span style={{ color: C.orange }}>&sigma;</span>
                    <sup>2</sup> + <span style={{ color: C.red }}>&epsilon;</span>)
                  </span>
                </span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
                <span style={{ color: C.yellow, fontWeight: 800, fontSize: 20 }}>&beta;</span>
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  {
                    sym: (
                      <span>
                        x<sub>i</sub>
                      </span>
                    ),
                    desc: "each value in the vector",
                    why: "the raw input we want to normalize",
                    color: C.cyan,
                  },
                  {
                    sym: "μ (mu)",
                    desc: "average of all values",
                    why: "centers the data around zero",
                    color: C.blue,
                  },
                  {
                    sym: "σ² (sigma squared)",
                    desc: "variance of all values",
                    why: "measures how spread out values are",
                    color: C.orange,
                  },
                  {
                    sym: "ε (epsilon)",
                    desc: "tiny number (1e-5)",
                    why: "prevents division by zero if all values are identical",
                    color: C.red,
                  },
                  {
                    sym: "γ (gamma)",
                    desc: "learnable scale (starts at 1.0)",
                    why: "lets the model stretch or shrink the range",
                    color: C.green,
                  },
                  {
                    sym: "β (beta)",
                    desc: "learnable shift (starts at 0.0)",
                    why: "lets the model move the center up or down",
                    color: C.yellow,
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
                    <T color={p.color} bold size={13}>
                      {p.sym}
                    </T>
                    <T color={C.dim} size={12}>
                      {" "}
                      = {p.desc}
                    </T>
                    <div>
                      <T color={p.color} size={11} style={{ opacity: 0.7 }}>
                        {p.why}
                      </T>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <T color="#b8a9ff" size={15} style={{ marginTop: 4 }}>
            gamma and beta are <strong>learned during training</strong> - they let the model undo the normalization if
            needed. They let the model stretch, shrink, or shift the normalized values to whatever range works best for
            each dimension.
          </T>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: The Norm computation - step by step with real numbers */}
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Computing Layer Norm - Step by Step
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Let's apply the formula to real numbers. We're normalizing the result from the Add step:
          </T>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: "rgba(167,139,250,0.04)",
              border: `1px solid ${C.purple}20`,
            }}
          >
            <T color="#b8a9ff" bold center size={16}>
              Normalizing [-0.2, 0.2, 0.9, 1.0] (the result from Add)
            </T>

            {/* Step 1: Mean */}
            <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: `${C.blue}08` }}>
              <T color={C.blue} bold size={15}>
                Step 1: Compute the mean (mu)
              </T>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <T color={C.dim} size={14}>
                  mu = (-0.2 + 0.2 + 0.9 + 1.0) / 4 =
                </T>
                <Tag color={C.blue}>0.475</Tag>
              </div>
            </div>

            {/* Step 2: Subtract mean */}
            <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.orange}08` }}>
              <T color={C.orange} bold size={15}>
                Step 2: subtract the mean from each value (x<sub>i</sub> - mu)
              </T>
              <pre
                style={{
                  marginTop: 6,
                  fontFamily: "monospace",
                  fontSize: 14,
                  lineHeight: 1.7,
                  textAlign: "center",
                  margin: "6px 0 0 0",
                  padding: 0,
                  background: "none",
                  border: "none",
                  overflow: "visible",
                }}
              >
                {[
                  ["-0.2 - 0.475", "-0.675"],
                  [" 0.2 - 0.475", "-0.275"],
                  [" 0.9 - 0.475", " 0.425"],
                  [" 1.0 - 0.475", " 0.525"],
                ].map(([l, r]) => (
                  <span key={l}>
                    <span style={{ color: C.dim }}>{l}</span>
                    <span style={{ color: C.dim }}> = </span>
                    <span style={{ color: C.orange, fontWeight: 600 }}>{r}</span>
                    {"\n"}
                  </span>
                ))}
              </pre>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Centered: [-0.675, -0.275, 0.425, 0.525]
              </T>
            </div>

            {/* Step 3: Variance and divide by sqrt(variance + epsilon) */}
            <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.green}08` }}>
              <T color={C.green} bold size={15}>
                Step 3: Compute variance, then divide by sqrt({"σ²"} + {"ε"})
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                variance = mean of squared deviations: (0.675 squared + 0.275 squared + 0.425 squared + 0.525 squared) /
                4 = 0.2469
              </T>
              <T color={C.dim} size={13}>
                sqrt(0.2469 + 0.00001) = 0.4969 (epsilon = 1e-5 prevents division by zero if all values were identical)
              </T>
              <pre
                style={{
                  marginTop: 6,
                  fontFamily: "monospace",
                  fontSize: 14,
                  lineHeight: 1.7,
                  textAlign: "center",
                  margin: "6px 0 0 0",
                  padding: 0,
                  background: "none",
                  border: "none",
                  overflow: "visible",
                }}
              >
                {[
                  ["-0.675 / 0.4969", "-1.36"],
                  ["-0.275 / 0.4969", "-0.55"],
                  [" 0.425 / 0.4969", " 0.86"],
                  [" 0.525 / 0.4969", " 1.06"],
                ].map(([l, r]) => (
                  <span key={l}>
                    <span style={{ color: C.dim }}>{l}</span>
                    <span style={{ color: C.dim }}> = </span>
                    <span style={{ color: C.green, fontWeight: 600 }}>{r}</span>
                    {"\n"}
                  </span>
                ))}
              </pre>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                After this step: [-1.36, -0.55, 0.86, 1.06] - centered at 0, unit variance.
              </T>
            </div>

            {/* Step 4: Scale by gamma + shift by beta */}
            <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: `${C.yellow}08` }}>
              <T color={C.yellow} bold size={15}>
                Step 4: Scale by gamma, shift by beta
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                gamma and beta are <strong>per-dimension learnable parameters</strong>. Initially gamma=1.0 and
                beta=0.0, so at first this step does nothing. During training, the model learns optimal values.
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                With initial gamma=1.0, beta=0.0:
              </T>
              <pre
                style={{
                  marginTop: 4,
                  fontFamily: "monospace",
                  fontSize: 14,
                  lineHeight: 1.7,
                  textAlign: "center",
                  margin: "4px 0 0 0",
                  padding: 0,
                  background: "none",
                  border: "none",
                  overflow: "visible",
                }}
              >
                {[
                  ["1.0", "-1.36", "0.0", "-1.36"],
                  ["1.0", "-0.55", "0.0", "-0.55"],
                  ["1.0", " 0.86", "0.0", " 0.86"],
                  ["1.0", " 1.06", "0.0", " 1.06"],
                ].map(([g, n, b, f]) => (
                  <span key={n}>
                    <span style={{ color: C.dim }}>
                      {g} x {n} + {b}
                    </span>
                    <span style={{ color: C.dim }}> = </span>
                    <span style={{ color: C.yellow, fontWeight: 600 }}>{f}</span>
                    {"\n"}
                  </span>
                ))}
              </pre>
              <T color={C.dim} size={13} style={{ marginTop: 6 }}>
                Why have gamma and beta if they start as identity? Because during training, the model may learn that
                some dimensions need more spread (gamma {">"} 1) or a non-zero center (beta != 0). Without them,
                normalization would be too rigid.
              </T>
            </div>

            <div
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 6,
                background: `${C.purple}10`,
                border: `1px dashed ${C.purple}30`,
              }}
            >
              <T color="#b8a9ff" bold center size={15}>
                Final output: [-1.36, -0.55, 0.86, 1.06]
              </T>
              <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
                Values centered around 0 with controlled spread. Gamma and beta will adjust these during training to
                whatever the model needs.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 4 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 5: Full pipeline visualization with numbers flowing through */}
      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The Complete Add & Norm Pipeline
          </T>
          <T color="#80deea" size={16} center style={{ marginTop: 4 }}>
            Watch "cats" flow through the entire Add & Norm after Attention:
          </T>

          <div
            data-pipeline="true"
            style={{ marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            {[
              { step: "Input (cats embedding)", val: "[-0.5, 0.3, 0.7, 0.6]", color: C.cyan, tag: "Input" },
              { step: "arrow", label: "goes into Attention" },
              { step: "Attention Output", val: "[0.3, -0.1, 0.2, 0.4]", color: C.pink, tag: "Attention" },
              { step: "arrow", label: "Add: input + output" },
              { step: "After Add", val: "[-0.2, 0.2, 0.9, 1.0]", color: C.green, tag: "Add" },
              { step: "arrow", label: "Normalize" },
              { step: "After Norm", val: "[-1.36, -0.55, 0.86, 1.06]", color: C.purple, tag: "Norm" },
              { step: "arrow", label: "ready for FFN" },
              { step: "To FFN", val: "[-1.36, -0.55, 0.86, 1.06]", color: C.orange, tag: "Next" },
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
                    padding: "8px 14px",
                    borderRadius: 8,
                    width: "90%",
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <Tag color={item.color}>{item.tag}</Tag>
                  <T color={item.color} size={14} bold>
                    {item.step}
                  </T>
                  <code style={{ color: `${item.color}bb`, fontSize: 14, marginLeft: "auto" }}>{item.val}</code>
                </div>
              ),
            )}
          </div>

          <T color="#80deea" size={15} center style={{ marginTop: 12 }}>
            This exact same Add & Norm happens again after FFN. Every Transformer block does this twice - once after
            Attention, once after FFN.
          </T>
        </Box>
      </Reveal>
      {sub === 5 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 6: Why it matters - with vs without */}
      <Reveal when={sub >= 6}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            Why It Matters - The Big Picture
          </T>

          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}25`,
              }}
            >
              <T color={C.red} bold center size={16}>
                Without Add & Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { l: "Layer 1", v: "0.7", w: 70 },
                  { l: "Layer 10", v: "0.24", w: 24 },
                  { l: "Layer 50", v: "0.004", w: 2 },
                  { l: "Layer 96", v: "~0", w: 0.5 },
                ].map(({ l, v, w }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.dim, fontSize: 12, minWidth: 60 }}>{l}</span>
                    <div style={{ flex: 1, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                      <div
                        style={{
                          width: `${Math.max(w, 1)}%`,
                          height: "100%",
                          borderRadius: 3,
                          background: C.red,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <code style={{ color: C.red, fontSize: 11, minWidth: 30 }}>{v}</code>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
                Values drift to extremes. Model stops learning.
              </T>
            </div>

            <div
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}25`,
              }}
            >
              <T color={C.green} bold center size={16}>
                With Add & Norm
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { l: "Layer 1", v: 0.7, w: 100 },
                  { l: "Layer 10", v: 0.67, w: 95 },
                  { l: "Layer 50", v: 0.62, w: 88 },
                  { l: "Layer 96", v: 0.57, w: 82 },
                ].map(({ l, v, w }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: C.dim, fontSize: 12, minWidth: 60 }}>{l}</span>
                    <div style={{ flex: 1, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                      <div
                        style={{
                          width: `${Math.max(w, 1)}%`,
                          height: "100%",
                          borderRadius: 3,
                          background: C.green,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <code style={{ color: C.green, fontSize: 11, minWidth: 30 }}>{v}</code>
                  </div>
                ))}
              </div>
              <T color={C.dim} center size={13} style={{ marginTop: 8 }}>
                Values stay <strong style={{ color: C.green }}>stable</strong>. Gradients flow. Training works even at
                96 layers deep.
              </T>
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
            <T color="#fff176" bold center size={16}>
              In one sentence:
            </T>
            <T color="#fff176" center size={16} style={{ marginTop: 4 }}>
              Add & Norm is the reason Transformers can be 96 layers deep without losing information. The "Add"
              preserves the original values, and the "Norm" keeps them in a stable range for the next layer.
            </T>
          </div>
        </Box>
      </Reveal>
    </div>
  );
}
