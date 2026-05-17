import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function FeedForwardNetwork(ctx) {
  const { sub, subBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Where FFN sits in the block */}
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Where Does the Feed-Forward Network Sit?
          </T>
          <T color="#ffcc80" size={16} center style={{ marginTop: 4 }}>
            In chapter 8.2 we covered Add & Norm after Attention. Now let's zoom into the next step.
          </T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            {[
              { label: "Input Embeddings", color: C.dim, bg: "rgba(255,255,255,0.03)", highlight: false },
              { label: "arrow" },
              { label: "Multi-Head Attention", color: C.pink, bg: `${C.pink}10`, highlight: false },
              { label: "arrow" },
              { label: "Add & Norm", color: C.blue, bg: `${C.blue}10`, highlight: false },
              { label: "arrow" },
              { label: "FFN (Feed-Forward Network)", color: C.orange, bg: `${C.orange}18`, highlight: true },
              { label: "arrow" },
              { label: "Add & Norm", color: C.blue, bg: `${C.blue}10`, highlight: false },
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
          <T color="#ffcc80" size={15} center style={{ marginTop: 12 }}>
            The FFN sits between the two Add & Norm layers. It processes each token <strong>independently</strong> - no
            communication between words here. That's what makes it different from Attention.
          </T>
        </Box>
      )}
      {sub === 0 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 1: What FFN actually is - a 2-layer NN */}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            FFN = Two Linear Layers with Activation
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 6 }}>
            You already know what a layer does (chapter 1.19): multiply by a weight matrix W, add bias b. The FFN is
            just <strong>two</strong> of those layers stacked, with an activation function in between.
          </T>

          {/* The formula */}
          <div
            style={{
              margin: "14px 0",
              borderRadius: 14,
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${C.cyan}25`,
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
                The FFN Formula
              </T>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}
              >
                <span style={{ color: C.orange, fontWeight: 800, fontSize: 20 }}>FFN(x)</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>=</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>
                  W<sub>2</sub>
                </span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
                <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18 }}>GELU(</span>
                <span style={{ color: C.pink, fontWeight: 800, fontSize: 18 }}>
                  W<sub>1</sub>
                </span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
                <span style={{ color: C.cyan, fontWeight: 800, fontSize: 18 }}>x</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
                <span style={{ color: C.pink, fontWeight: 800, fontSize: 18 }}>
                  b<sub>1</sub>
                </span>
                <span style={{ color: C.yellow, fontWeight: 700, fontSize: 18 }}>)</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>+</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>
                  b<sub>2</sub>
                </span>
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  { sym: "x", desc: "input from Add & Norm", color: C.cyan },
                  {
                    sym: (
                      <span>
                        W<sub>1</sub>, b<sub>1</sub>
                      </span>
                    ),
                    desc: "first layer weights & bias",
                    color: C.pink,
                  },
                  { sym: "GELU", desc: "activation function", color: C.yellow },
                  {
                    sym: (
                      <span>
                        W<sub>2</sub>, b<sub>2</sub>
                      </span>
                    ),
                    desc: "second layer weights & bias",
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
                    <T color={p.color} bold size={13}>
                      {p.sym}
                    </T>
                    <T color={C.dim} size={12}>
                      {" "}
                      = {p.desc}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <T color="#80deea" size={15} style={{ marginTop: 4 }}>
            That's it. No attention, no softmax, no multi-head anything. Just two matrix multiplies with an activation
            in between - the same building blocks from Section 1.
          </T>
        </Box>
      </Reveal>
      {sub === 1 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 2: The expand-then-compress shape */}
      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            The Expand-Then-Compress Shape
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Here's the interesting part: the first layer <strong>expands</strong> the dimension, and the second layer{" "}
            <strong>compresses</strong> it back. In GPT-2 (d_model = 512):
          </T>

          <div style={{ marginTop: 16, padding: "10px 0", overflowX: "auto" }}>
            {(() => {
              const XI = 70,
                XH = 250,
                XO = 430,
                R = 15;
              const iY = [55, 125, 195];
              const hY = [55, 102, 148, 195];
              const oY = [55, 125, 195];
              return (
                <svg viewBox="0 0 500 240" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
                  <desc>
                    Feed-forward network architecture showing expand-then-compress structure: 512-dim input through W1
                    to 2048-dim hidden with GELU, then W2 back to 512-dim output
                  </desc>

                  {/* === Edges first (behind everything) === */}
                  {iY.map((a) =>
                    hY.map((b) => (
                      <line
                        key={`ih${a}${b}`}
                        x1={XI + R + 2}
                        y1={a}
                        x2={XH - R - 2}
                        y2={b}
                        stroke={`${C.pink}12`}
                        strokeWidth={1}
                      />
                    )),
                  )}
                  {hY.map((a) =>
                    oY.map((b) => (
                      <line
                        key={`ho${a}${b}`}
                        x1={XH + R + 2}
                        y1={a}
                        x2={XO - R - 2}
                        y2={b}
                        stroke={`${C.green}12`}
                        strokeWidth={1}
                      />
                    )),
                  )}

                  {/* === Column labels (top, 30px above first node) === */}
                  <text x={XI} y={18} fill={C.cyan} fontSize={11} textAnchor="middle" fontWeight={700}>
                    Input (512)
                  </text>
                  <text x={XH} y={18} fill={C.yellow} fontSize={11} textAnchor="middle" fontWeight={700}>
                    Hidden (2048)
                  </text>
                  <text x={XO} y={18} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                    Output (512)
                  </text>

                  {/* === W1 box (centered between Input and Hidden columns, vertically at midpoint) === */}
                  <rect
                    x={(XI + XH) / 2 - 28}
                    y={105}
                    width={56}
                    height={36}
                    rx={8}
                    fill={`${C.pink}12`}
                    stroke={C.pink}
                    strokeWidth={1.5}
                  />
                  <text x={(XI + XH) / 2} y={121} fill={C.pink} fontSize={10} fontWeight={700} textAnchor="middle">
                    W&#x2081;
                  </text>
                  <text x={(XI + XH) / 2} y={134} fill={C.dim} fontSize={8} textAnchor="middle">
                    512 x 2048
                  </text>

                  {/* === W2 box (centered between Hidden and Output columns) === */}
                  <rect
                    x={(XH + XO) / 2 - 28}
                    y={105}
                    width={56}
                    height={36}
                    rx={8}
                    fill={`${C.green}12`}
                    stroke={C.green}
                    strokeWidth={1.5}
                  />
                  <text x={(XH + XO) / 2} y={121} fill={C.green} fontSize={10} fontWeight={700} textAnchor="middle">
                    W&#x2082;
                  </text>
                  <text x={(XH + XO) / 2} y={134} fill={C.dim} fontSize={8} textAnchor="middle">
                    2048 x 512
                  </text>

                  {/* === Input neurons === */}
                  {iY.map((y, i) => (
                    <g key={`i${i}`}>
                      <circle cx={XI} cy={y} r={R} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                      <text x={XI} y={y + 4} fill={C.cyan} fontSize={10} fontWeight={700} textAnchor="middle">
                        {["x₁", "x₂", "x₃"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === Hidden neurons (4 shown: h1, h2, h3, h2048) === */}
                  {hY.map((y, i) => (
                    <g key={`h${i}`}>
                      <circle cx={XH} cy={y} r={R} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
                      <text
                        x={XH}
                        y={y + 4}
                        fill={C.yellow}
                        fontSize={i === 3 ? 7 : 10}
                        fontWeight={700}
                        textAnchor="middle"
                      >
                        {["h₁", "h₂", "h₃", "h₂₀₄₈"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === Output neurons === */}
                  {oY.map((y, i) => (
                    <g key={`o${i}`}>
                      <circle cx={XO} cy={y} r={R} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} />
                      <text x={XO} y={y + 4} fill={C.orange} fontSize={10} fontWeight={700} textAnchor="middle">
                        {["y₁", "y₂", "y₃"][i]}
                      </text>
                    </g>
                  ))}

                  {/* === GELU + bottom note (well below last node at y=195) === */}
                  <text x={XH} y={222} fill={C.green} fontSize={10} fontWeight={700} textAnchor="middle">
                    + GELU
                  </text>
                  <text x={250} y={236} fill="rgba(255,255,255,0.2)" fontSize={8} textAnchor="middle">
                    3 of 512 input, 4 of 2048 hidden, 3 of 512 output shown
                  </text>
                </svg>
              );
            })()}
          </div>

          <T color="#b8a9ff" size={15} style={{ marginTop: 6 }}>
            The hidden layer has <strong>4x more neurons</strong> than the input or output. Every input neuron connects
            to every hidden neuron (W<sub>1</sub>), GELU activates each hidden neuron, then every hidden neuron connects
            to every output neuron (W<sub>2</sub>). The data expands into a wider "thinking space" (512 → 2048), then
            compresses back (2048 → 512).
          </T>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}20`,
            }}
          >
            <T color="#b8a9ff" bold center size={16}>
              Why 4x?
            </T>
            <T color="#b8a9ff" size={15} style={{ marginTop: 4 }}>
              Imagine solving a complex problem: you spread your notes across a big desk (expand to 2048), work things
              out, then summarize your answer on a small card (compress back to 512). The 4x ratio was found in the
              original "Attention is All You Need" paper and has become standard across GPT-2, GPT-3, and most
              Transformers.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub === 2 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 3: Step-by-step computation with real numbers */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Step-by-Step: FFN on "cats"
          </T>
          <T color="#a5d6a7" size={16} style={{ marginTop: 6 }}>
            Let's trace "cats" through the FFN. In chapter 8.2, Add & Norm output [-1.36, -0.55, 0.86, 1.06] for "cats".
            We'll use a tiny 4-dim version to show the real math (real models use 512 dims but the process is
            identical).
          </T>

          {/* Step 1: First linear layer */}
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: `${C.pink}08`,
              border: `1px solid ${C.pink}20`,
            }}
          >
            <T color={C.pink} bold size={16}>
              Step 1: Multiply by W<sub>1</sub> + b<sub>1</sub> (expand 4 → 8 dims)
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
              >
                <code style={{ color: C.cyan, fontSize: 14 }}>[-1.36, -0.55, 0.86, 1.06]</code>
                <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>&middot;</span>
                <span style={{ color: C.pink, fontSize: 14 }}>
                  W<sub>1</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>+</span>
                <span style={{ color: C.pink, fontSize: 14 }}>
                  b<sub>1</sub>
                </span>
              </div>
              <T color={C.dim} size={13}>
                Each of the 8 output values is a dot product of the input with one column of W<sub>1</sub>, plus a bias
                - exactly like chapter 1.19.
              </T>
              <div style={{ marginTop: 4, padding: 8, borderRadius: 6, background: `${C.pink}06`, width: "100%" }}>
                <T color={C.pink} bold center size={14}>
                  Result (8 dims):
                </T>
                <code style={{ display: "block", textAlign: "center", color: C.pink, fontSize: 14, marginTop: 4 }}>
                  [0.42, -1.80, 0.95, 2.10, -0.33, 1.47, -0.88, 0.61]
                </code>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 3 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 4: Step-by-step computation continued - Step 2 (GELU) + Step 3 (W2) + summary */}
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#a5d6a7" bold center size={20}>
            Step-by-Step: FFN on "cats" (continued)
          </T>

          {/* Step 2: GELU activation */}
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color={C.yellow} bold size={16}>
              Step 2: Apply GELU activation
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>
              GELU applies to each value independently - similar to ReLU (chapter 1.6) but smoother.
            </T>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
              {[
                { inp: "0.42", out: "0.28", clr: C.green },
                { inp: "-1.80", out: "-0.04", clr: C.red },
                { inp: "0.95", out: "0.77", clr: C.green },
                { inp: "2.10", out: "2.07", clr: C.green },
                { inp: "-0.33", out: "-0.12", clr: C.red },
                { inp: "1.47", out: "1.37", clr: C.green },
                { inp: "-0.88", out: "-0.17", clr: C.red },
                { inp: "0.61", out: "0.44", clr: C.green },
              ].map(({ inp, out, clr }) => (
                <div
                  key={inp}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: `${clr}08`,
                    border: `1px solid ${clr}15`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.dim} size={11}>
                    {inp} →
                  </T>
                  <T color={clr} bold size={12}>
                    {" "}
                    {out}
                  </T>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 6, padding: 6, borderRadius: 6, background: `${C.yellow}06` }}>
              <code style={{ display: "block", textAlign: "center", color: C.yellow, fontSize: 14 }}>
                [0.28, -0.04, 0.77, 2.07, -0.12, 1.37, -0.17, 0.44]
              </code>
            </div>
          </div>

          {/* Step 3: Second linear layer */}
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
            }}
          >
            <T color={C.green} bold size={16}>
              Step 3: Multiply by W<sub>2</sub> + b<sub>2</sub> (compress 8 → 4 dims)
            </T>
            <T color={C.dim} size={13} style={{ marginTop: 4 }}>
              The 8-dim expanded vector gets compressed back to the original 4 dims.
            </T>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}
              >
                <code style={{ color: C.yellow, fontSize: 14 }}>[0.28, -0.04, ..., 0.44]</code>
                <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>&middot;</span>
                <span style={{ color: C.green, fontSize: 14 }}>
                  W<sub>2</sub>
                </span>
                <span style={{ color: C.dim, fontSize: 16, fontWeight: 700 }}>+</span>
                <span style={{ color: C.green, fontSize: 14 }}>
                  b<sub>2</sub>
                </span>
              </div>
              <div style={{ padding: 8, borderRadius: 6, background: `${C.green}06`, width: "100%" }}>
                <T color={C.green} bold center size={14}>
                  FFN output for "cats" (4 dims):
                </T>
                <code
                  style={{
                    display: "block",
                    textAlign: "center",
                    color: C.green,
                    fontSize: 15,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  [0.51, -0.73, 1.14, 0.22]
                </code>
              </div>
            </div>
          </div>

          <T color="#a5d6a7" size={15} center style={{ marginTop: 10 }}>
            Same size in, same size out - but the values have been transformed through a "thinking space" 4x wider. This
            output now goes to the second Add & Norm.
          </T>
        </Box>
      </Reveal>
      {sub === 4 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 5: GELU - the real formula, then vs ReLU */}
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#fff176" bold center size={20}>
            GELU - The Activation Function
          </T>
          <T color="#fff176" size={16} style={{ marginTop: 6 }}>
            In chapter 1.6 we learned ReLU. Modern Transformers use a smoother alternative called GELU (Gaussian Error
            Linear Unit). Here is the real formula:
          </T>

          {/* The GELU formula - styled like the attention formula in 7.8 */}
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
                The GELU Formula
              </T>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}
              >
                <span style={{ color: C.yellow, fontWeight: 800, fontSize: 20 }}>GELU(x)</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>=</span>
                <span style={{ color: C.cyan, fontWeight: 800, fontSize: 20 }}>x</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 20 }}>&middot;</span>
                <span style={{ color: C.green, fontWeight: 800, fontSize: 20 }}>&Phi;(x)</span>
              </div>
              <T color={C.dim} size={14} center style={{ marginTop: 8 }}>
                where &Phi;(x) is the cumulative distribution function of the standard normal distribution:
              </T>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: C.green, fontWeight: 800, fontSize: 18 }}>&Phi;(x)</span>
                <span style={{ color: C.dim, fontWeight: 800, fontSize: 18 }}>=</span>
                <span
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}
                >
                  <span
                    style={{
                      color: C.dim,
                      fontWeight: 700,
                      fontSize: 16,
                      borderBottom: `2px solid ${C.dim}`,
                      paddingBottom: 3,
                    }}
                  >
                    1
                  </span>
                  <span style={{ color: C.dim, fontWeight: 700, fontSize: 16, paddingTop: 3 }}>2</span>
                </span>
                <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>[</span>
                <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>1 + erf(</span>
                <span
                  style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}
                >
                  <span
                    style={{
                      color: C.cyan,
                      fontWeight: 700,
                      fontSize: 16,
                      borderBottom: `2px solid ${C.dim}`,
                      paddingBottom: 3,
                    }}
                  >
                    x
                  </span>
                  <span style={{ color: C.dim, fontWeight: 700, fontSize: 16, paddingTop: 3 }}>&radic;2</span>
                </span>
                <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>)</span>
                <span style={{ color: C.dim, fontWeight: 700, fontSize: 18 }}>]</span>
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {[
                  {
                    sym: "x",
                    desc: "the input value",
                    why: "the raw number coming from the linear layer",
                    color: C.cyan,
                  },
                  {
                    sym: "Φ(x)",
                    desc: 'probability x is "kept"',
                    why: "ranges from 0 (fully blocked) to 1 (fully passed)",
                    color: C.green,
                  },
                  {
                    sym: "erf",
                    desc: "Gauss error function",
                    why: "a smooth S-curve that maps any number to [-1, 1]",
                    color: C.orange,
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

          <T color="#fff176" size={15} style={{ marginTop: 4 }}>
            In plain English: GELU multiplies x by the <strong>probability</strong> that x would be considered "large"
            under a standard normal bell curve. Large positive numbers get through almost fully (&Phi; near 1). Large
            negative numbers get almost fully blocked (&Phi; near 0). Values near zero get <strong>partially</strong>{" "}
            passed - that's the smooth part.
          </T>

          {/* Worked example */}
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 10,
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
            }}
          >
            <T color="#fff176" bold center size={16}>
              Worked Examples
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { x: "2.0", phi: "0.977", result: "1.95", note: "Large positive: almost fully passed", clr: C.green },
                { x: "0.5", phi: "0.691", result: "0.35", note: "Small positive: 69% passed through", clr: C.green },
                { x: "0.0", phi: "0.500", result: "0.00", note: "Zero: exactly half of zero is zero", clr: C.dim },
                { x: "-0.5", phi: "0.309", result: "-0.15", note: "Small negative: 31% leaked through", clr: C.orange },
                { x: "-2.0", phi: "0.023", result: "-0.05", note: "Large negative: almost fully blocked", clr: C.red },
              ].map(({ x, phi, result, note, clr }) => (
                <div
                  key={x}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: `${clr}06`,
                    border: `1px solid ${clr}12`,
                  }}
                >
                  <code style={{ color: C.cyan, fontSize: 14, minWidth: 35, textAlign: "right" }}>{x}</code>
                  <span style={{ color: C.dim, fontSize: 13 }}>&middot;</span>
                  <code style={{ color: C.green, fontSize: 14, minWidth: 40 }}>{phi}</code>
                  <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                  <code style={{ color: clr, fontSize: 14, fontWeight: 700, minWidth: 40 }}>{result}</code>
                  <T color={C.dim} size={12} style={{ marginLeft: 4 }}>
                    {note}
                  </T>
                </div>
              ))}
            </div>
          </div>

          {/* ReLU vs GELU comparison */}
          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: `${C.red}08`,
                border: `1px solid ${C.red}25`,
              }}
            >
              <T color={C.red} bold center size={15}>
                ReLU (chapter 1.6)
              </T>
              <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
                <div style={{ color: C.dim }}>
                  if x {"<"} 0: output = <span style={{ color: C.red, fontWeight: 700 }}>0</span>
                </div>
                <div style={{ color: C.dim }}>
                  if x {">"} 0: output = <span style={{ color: C.green, fontWeight: 700 }}>x</span>
                </div>
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                Hard cutoff. Negative = dead. Gradient = 0 forever.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: `${C.green}08`,
                border: `1px solid ${C.green}25`,
              }}
            >
              <T color={C.green} bold center size={15}>
                GELU (smooth)
              </T>
              <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
                <div style={{ color: C.dim }}>
                  if x {"<"} 0: output = <span style={{ color: C.orange, fontWeight: 700 }}>small leak</span>
                </div>
                <div style={{ color: C.dim }}>
                  if x {">"} 0: output = <span style={{ color: C.green, fontWeight: 700 }}>~x</span>
                </div>
              </div>
              <T color={C.dim} center size={12} style={{ marginTop: 6 }}>
                Smooth transition. Small negatives leak through. Gradient never fully dies.
              </T>
            </div>
          </div>

          {/* Two separate graphs side-by-side: ReLU and GELU */}
          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* ReLU graph */}
            <div
              style={{
                flex: "1 1 220px",
                padding: 12,
                borderRadius: 10,
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${C.red}25`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.red} bold center size={14} style={{ marginBottom: 4 }}>
                ReLU(x) = max(0, x)
              </T>
              <svg viewBox="0 0 280 220" style={{ width: "100%", maxWidth: 320 }}>
                <desc>
                  Line graph of the ReLU activation function over x from -3 to 3. The curve is flat at y equals zero for
                  all negative x, forming a horizontal line along the x-axis, then rises with a hard kink at the origin
                  and continues linearly as y equals x for all positive x. This creates a dead region for negatives
                  where the gradient is exactly zero.
                </desc>
                {/* dashed zero lines */}
                <line
                  x1="40"
                  y1="150"
                  x2="260"
                  y2="150"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <line
                  x1="150"
                  y1="20"
                  x2="150"
                  y2="190"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                {/* outer axes */}
                <line x1="40" y1="190" x2="260" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                {/* x ticks */}
                {[-3, -2, -1, 0, 1, 2, 3].map((xv) => {
                  const px = 150 + xv * 36.67;
                  return (
                    <g key={`rx${xv}`}>
                      <line x1={px} y1="190" x2={px} y2="194" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                      <text x={px} y="206" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">
                        {xv}
                      </text>
                    </g>
                  );
                })}
                {/* y ticks */}
                {[0, 1, 2, 3].map((yv) => {
                  const py = 190 - yv * 40;
                  return (
                    <g key={`ry${yv}`}>
                      <line x1="36" y1={py} x2="40" y2={py} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                      <text x="32" y={py + 3} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">
                        {yv}
                      </text>
                    </g>
                  );
                })}
                {/* axis label */}
                <text x="266" y="194" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="start">
                  x
                </text>
                <text x="32" y="22" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">
                  y
                </text>
                {/* ReLU curve: flat at y=0 for x<=0, then y=x */}
                <polyline
                  points="40,150 150,150 260,30"
                  stroke={C.red}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinejoin="round"
                />
                {/* annotation: dead region */}
                <text x="85" y="142" fill={C.red} fontSize="10" fontWeight="600">
                  dead (gradient = 0)
                </text>
                {/* annotation: hard kink */}
                <circle cx="150" cy="150" r="4" fill="none" stroke={C.yellow} strokeWidth="1.5" />
                <text x="158" y="170" fill={C.yellow} fontSize="10" fontWeight="600">
                  hard kink
                </text>
              </svg>
              <T color={C.dim} center size={11} style={{ marginTop: 4 }}>
                Zero for all negatives. Sharp corner at origin.
              </T>
            </div>

            {/* GELU graph */}
            <div
              style={{
                flex: "1 1 220px",
                padding: 12,
                borderRadius: 10,
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${C.green}25`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <T color={C.green} bold center size={14} style={{ marginBottom: 4 }}>
                GELU(x) = x · Φ(x)
              </T>
              <svg viewBox="0 0 280 220" style={{ width: "100%", maxWidth: 320 }}>
                <desc>
                  Line graph of the GELU activation function over x from -3 to 3. The curve is a smooth S-shape: nearly
                  zero for large negative x, dips slightly below zero around x equals minus one (the leak region),
                  passes smoothly through the origin with a continuous derivative, and asymptotically matches y equals x
                  for large positive x. This smooth shape keeps gradients alive for negative inputs.
                </desc>
                {/* dashed zero lines */}
                <line
                  x1="40"
                  y1="150"
                  x2="260"
                  y2="150"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <line
                  x1="150"
                  y1="20"
                  x2="150"
                  y2="190"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                {/* outer axes */}
                <line x1="40" y1="190" x2="260" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                {/* x ticks */}
                {[-3, -2, -1, 0, 1, 2, 3].map((xv) => {
                  const px = 150 + xv * 36.67;
                  return (
                    <g key={`gx${xv}`}>
                      <line x1={px} y1="190" x2={px} y2="194" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                      <text x={px} y="206" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">
                        {xv}
                      </text>
                    </g>
                  );
                })}
                {/* y ticks */}
                {[0, 1, 2, 3].map((yv) => {
                  const py = 190 - yv * 40;
                  return (
                    <g key={`gy${yv}`}>
                      <line x1="36" y1={py} x2="40" y2={py} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                      <text x="32" y={py + 3} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="end">
                        {yv}
                      </text>
                    </g>
                  );
                })}
                {/* axis label */}
                <text x="266" y="194" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="start">
                  x
                </text>
                <text x="32" y="22" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">
                  y
                </text>
                {/* GELU curve (sampled via 0.5*x*(1+erf(x/sqrt(2)))) mapped into plot area */}
                <polyline
                  points="40,150.14 77,151.82 95.8,154.02 113.3,156.38 132,156.17 150,150 168,137.72 187.3,116.41 205,94.01 224,71.79 242.3,47.47 260,30.17"
                  stroke={C.green}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinejoin="round"
                />
                {/* annotation: leak */}
                <circle cx="113.3" cy="156.38" r="5" fill="none" stroke={C.orange} strokeWidth="1.5" />
                <text x="60" y="178" fill={C.orange} fontSize="10" fontWeight="600">
                  leak (gradient alive)
                </text>
                <line x1="110" y1="158" x2="95" y2="172" stroke={C.orange} strokeWidth="1" />
                {/* annotation: smooth origin */}
                <text x="160" y="142" fill={C.yellow} fontSize="10" fontWeight="600">
                  smooth S
                </text>
              </svg>
              <T color={C.dim} center size={11} style={{ marginTop: 4 }}>
                Small leak below zero. Smooth curve - no corner.
              </T>
            </div>
          </div>

          <T color="#fff176" size={14} style={{ marginTop: 10 }}>
            Why does the smooth curve matter? During backpropagation (chapter 1.15), ReLU's gradient is exactly 0 for
            all negative inputs - the neuron is "dead" and can never recover. GELU's smooth curve means even slightly
            negative values get a small gradient, so neurons can recover. GPT-2 and GPT-3 both use GELU.
          </T>
        </Box>
      </Reveal>
      {sub === 5 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 6: Knowledge vs Routing intro + Example 1 */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#90caf9" bold center size={20}>
            What FFN Stores - Knowledge vs Routing
          </T>
          <T color="#90caf9" size={16} style={{ marginTop: 6 }}>
            Attention and FFN play completely different roles. Think of it this way: attention decides{" "}
            <strong>which words to listen to</strong>, FFN decides <strong>what to do with what it heard</strong>.
          </T>

          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}15`,
            }}
          >
            <T color={C.yellow} bold center size={13}>
              Remember: inside every block, Attention runs first, then FFN
            </T>
            <T color={C.dim} center size={12}>
              FFN never sees the raw input - it always receives attention's output. Attention gathers context from other
              words. Then FFN transforms that context-enriched vector.
            </T>
          </div>

          {/* Example 1: Area/Length/Breadth - implicit knowledge */}
          <T color="#90caf9" bold center size={16} style={{ marginTop: 14 }}>
            Example 1: "The area of this rectangle depends on its length"
          </T>
          <T color={C.dim} center size={12} style={{ marginTop: 2 }}>
            Notice: "breadth" is never mentioned - but the model knows it matters
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}20`,
              }}
            >
              <T color={C.pink} bold center size={15}>
                Attention Runs First
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Q &middot; K scores for "area"
                  </T>
                  <T color={C.dim} size={12}>
                    "area"'s Query asks "what determines me?" "length"'s Key scores high (0.55 after softmax) - they're
                    clearly related. "rectangle"'s Key also matches (0.30) - it tells area what shape we're talking
                    about.
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Weighted sum of Values
                  </T>
                  <T color={C.dim} size={12}>
                    Output = 0.55 &middot; V<sub>length</sub> + 0.30 &middot; V<sub>rectangle</sub> + ... The "area"
                    vector now carries: "I'm the area of a rectangle and length is involved."
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Result: context assembled, but incomplete
                  </T>
                  <T color={C.dim} size={12}>
                    Attention found real connections between words <strong>that exist in the input</strong>. But
                    "breadth" is not in the sentence. Attention can only mix what's there - it cannot add knowledge
                    that's missing from the text.
                  </T>
                </div>
              </div>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
              }}
            >
              <T color={C.orange} bold center size={15}>
                Then FFN Adds Stored Knowledge
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    W<sub>1</sub>: "rectangle-area" detector fires
                  </T>
                  <T color={C.dim} size={12}>
                    FFN receives the attention-enriched "area" vector (which already encodes "rectangle + length"). Row
                    1203 of W<sub>1</sub> was trained on millions of math texts - it detects "area of a rectangle with
                    length mentioned." Dot product:{" "}
                    <code style={{ color: C.orange }}>
                      W<sub>1</sub>[1203] &middot; x = 3.9
                    </code>
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    GELU activates the right knowledge
                  </T>
                  <T color={C.dim} size={12}>
                    GELU(3.9) = 3.89 → neuron 1203 fires strongly. Meanwhile, neuron 502 ("circle-area-pi") got -0.8 →
                    GELU suppresses it. The network knows this is a rectangle, not a circle.
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    W<sub>2</sub>: pushes "area" toward breadth-aware region
                  </T>
                  <T color={C.dim} size={12}>
                    Column 1203 of W<sub>2</sub> shifts the vector into a region of embedding space that encodes "area =
                    length x breadth, breadth is the missing factor." The model now{" "}
                    <strong>implicitly knows breadth matters</strong> - even though the word never appeared in the
                    input.
                  </T>
                </div>
              </div>
              <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: `${C.orange}10` }}>
                <T color={C.orange} bold size={12}>
                  This is what "stored knowledge" means
                </T>
                <T color={C.dim} size={11}>
                  During training, the FFN saw "area = length x breadth" thousands of times. That relationship got baked
                  into W<sub>1</sub> row 1203 (detector) and W<sub>2</sub> column 1203 (output). Attention found the
                  words in the sentence. FFN added what it knows from training.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 6 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 7: Example 2 - factual recall */}
      <Reveal when={sub >= 7}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Example 2: "The capital of India is ___"
          </T>
          <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
            Attention gathers context, FFN recalls the fact
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.pink}06`,
                border: `1px solid ${C.pink}20`,
              }}
            >
              <T color={C.pink} bold center size={15}>
                Attention Runs First
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Q &middot; K scores for "___" position
                  </T>
                  <T color={C.dim} size={12}>
                    "___"'s Query asks "what country am I about?" "India"'s Key scores highest (0.72 after softmax),
                    "capital" gets 0.18, rest get scraps.
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Weighted sum of Values
                  </T>
                  <T color={C.dim} size={12}>
                    Output = 0.72 &middot; V<sub>India</sub> + 0.18 &middot; V<sub>capital</sub> + ... This is a{" "}
                    <strong>blend</strong> - a weighted average. It mixes "India" info into the "___" position.
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.pink}08` }}>
                  <T color={C.pink} bold size={13}>
                    Result: context assembled, but no answer yet
                  </T>
                  <T color={C.dim} size={12}>
                    The "___" vector now encodes "I need the capital of India." But attention can only average existing
                    vectors - it cannot look up a fact. It assembled the question, not the answer.
                  </T>
                </div>
              </div>
            </div>
            <div
              style={{
                flex: "1 1 200px",
                padding: 12,
                borderRadius: 10,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
              }}
            >
              <T color={C.orange} bold center size={15}>
                Then FFN Recalls the Fact
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    W<sub>1</sub>: "capital-of-India" detector fires
                  </T>
                  <T color={C.dim} size={12}>
                    Row 847 of W<sub>1</sub> was trained on millions of geography texts. It detects the
                    "capital-of-India" pattern in the vector that attention assembled. Dot product:{" "}
                    <code style={{ color: C.orange }}>
                      W<sub>1</sub>[847] &middot; x = 4.2
                    </code>
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    GELU: only relevant knowledge survives
                  </T>
                  <T color={C.dim} size={12}>
                    GELU(4.2) = 4.19 → neuron 847 fires. GELU(-1.3) = -0.05 → neuron 200 ("capital-of-France") is
                    suppressed. Of 2048 neurons, maybe 100-300 fire meaningfully for any given input.
                  </T>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 6, background: `${C.orange}08` }}>
                  <T color={C.orange} bold size={13}>
                    W<sub>2</sub>: writes "Delhi" into the vector
                  </T>
                  <T color={C.dim} size={12}>
                    Column 847 of W<sub>2</sub> was trained to shift vectors toward "Delhi." Since neuron 847 fired at
                    4.19, its column dominates the output:{" "}
                    <code style={{ color: C.orange }}>
                      output += 4.19 &middot; W<sub>2</sub>[:,847]
                    </code>
                    . The answer is now in the vector.
                  </T>
                </div>
              </div>
              <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: `${C.orange}10` }}>
                <T color={C.orange} bold size={12}>
                  Key insight: W<sub>1</sub> rows = "what to detect", W<sub>2</sub> columns = "what to output"
                </T>
                <T color={C.dim} size={11}>
                  This is the key-value memory interpretation from research. The FFN is a lookup table: 2048 entries,
                  each asking "does this pattern match?" and outputting the corresponding knowledge.
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 7 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 8: Example 3 - multi-block collaboration */}
      <Reveal when={sub >= 8}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Attention + FFN Across Multiple Blocks
          </T>
          <T color="#b8a9ff" bold center size={16} style={{ marginTop: 6 }}>
            Example 3: "She sat by the river bank"
          </T>
          <T color={C.dim} center size={13} style={{ marginTop: 2 }}>
            Does "bank" mean money or riverbed? Watch attention and FFN collaborate across blocks to resolve the
            ambiguity.
          </T>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}20` }}
            >
              <T color={C.green} bold size={14}>
                Block 1: Basic context gathering
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.pink}06` }}>
                  <T color={C.pink} bold size={12}>
                    Attention
                  </T>
                  <T color={C.dim} size={11}>
                    "bank"'s Query matches "river"'s Key (adjacent words, high positional score). After softmax, "bank"
                    absorbs ~40% of "river"'s Value vector. "sat" gets ~20% (nearby verb). Result: "bank" now carries
                    "I'm next to the word river and someone sat."
                  </T>
                </div>
                <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.orange}06` }}>
                  <T color={C.orange} bold size={12}>
                    FFN (receives attention's output)
                  </T>
                  <T color={C.dim} size={11}>
                    Sees "bank + some river context." W<sub>1</sub> row 310 ("river-location" detector) fires weakly:{" "}
                    <code style={{ color: C.orange }}>1.2</code>. W<sub>1</sub> row 744 ("financial-institution"
                    detector) also fires weakly: <code style={{ color: C.orange }}>0.8</code>. GELU passes both through.
                    W<sub>2</sub> nudges the vector slightly toward both meanings.{" "}
                    <strong>Ambiguity not yet resolved.</strong>
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{ padding: 12, borderRadius: 10, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20` }}
            >
              <T color={C.yellow} bold size={14}>
                Block 5: Deeper semantic understanding
              </T>
              <div style={{ marginTop: 6, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.pink}06` }}>
                  <T color={C.pink} bold size={12}>
                    Attention
                  </T>
                  <T color={C.dim} size={11}>
                    "bank" now attends to "sat" (physical action, not financial), "by" (location preposition), and
                    "river" with much higher scores than Block 1. Why higher? Because Blocks 1-4 FFNs already
                    strengthened the "nature/location" features in "sat" and "river." Their Value vectors are now
                    richer, so the weighted sum gives "bank" a much stronger location signal.
                  </T>
                </div>
                <div style={{ flex: "1 1 180px", padding: "6px 8px", borderRadius: 6, background: `${C.orange}06` }}>
                  <T color={C.orange} bold size={12}>
                    FFN (receives attention's output)
                  </T>
                  <T color={C.dim} size={11}>
                    Now row 310 ("river-location") fires at <code style={{ color: C.orange }}>3.8</code> (strong match).
                    Row 744 ("financial") fires at <code style={{ color: C.orange }}>-1.1</code> → GELU(-1.1) = -0.03,
                    effectively dead. W<sub>2</sub> column 310 shifts the vector hard toward geography/nature features,
                    column 744 contributes almost nothing.{" "}
                    <strong>"Bank" now means "riverbank" - ambiguity resolved.</strong>
                  </T>
                </div>
              </div>
            </div>

            <div
              style={{ padding: 10, borderRadius: 6, background: `${C.purple}08`, border: `1px solid ${C.purple}15` }}
            >
              <T color="#b8a9ff" bold center size={13}>
                Why this takes multiple blocks
              </T>
              <T color={C.dim} size={12} style={{ marginTop: 4 }}>
                Each round, attention provides <strong>better context</strong> because FFN improved the vectors, and FFN
                makes <strong>better decisions</strong> because attention gathered more context. They bootstrap each
                other. Block 1 FFN nudges slightly, Block 2 attention uses that nudge to focus better, Block 2 FFN
                nudges harder, and so on across all 96 blocks.
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
            <T color="#fff176" bold center size={15}>
              Three examples, three types of FFN knowledge:
            </T>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              <T color="#fff176" size={13}>
                <strong>1. Implicit knowledge</strong> (area/breadth) - FFN adds concepts that aren't in the input but
                are related by training data
              </T>
              <T color="#fff176" size={13}>
                <strong>2. Factual recall</strong> (India/Delhi) - FFN looks up a stored fact and writes the answer into
                the vector
              </T>
              <T color="#fff176" size={13}>
                <strong>3. Disambiguation</strong> (bank/river) - FFN resolves ambiguity by suppressing wrong meanings
                and boosting the right one
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      {sub === 8 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 9: Deep Q&A */}
      <Reveal when={sub >= 9}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Deep Questions You Should Be Able to Answer
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                q: "Why can't attention replace FFN?",
                a: 'Attention computes weighted averages of Value vectors - a linear operation. It can mix information from different tokens, but it can never create new features. "If river AND bank are both present, output riverbank" requires non-linearity (GELU). Only FFN has that.',
                color: C.pink,
              },
              {
                q: "Why can't FFN replace attention?",
                a: 'FFN processes each token in complete isolation. It never sees any other word. Without attention first injecting "river" into "bank"\'s vector, FFN would process "bank" identically in "river bank" and "investment bank" - same input, same output, unable to disambiguate.',
                color: C.orange,
              },
              {
                q: 'What exactly does "FFN stores knowledge" mean?',
                a: 'Each row of W₁ is a pattern detector trained during pre-training. Row 847 learned to fire when the input looks like "capital-of-India." The corresponding column of W₂ learned to output a vector that shifts toward "Delhi." This row-column pair is literally one stored fact. GPT-3 has 2048-49152 such detectors per block across 96 blocks.',
                color: C.green,
              },
              {
                q: "How do researchers prove this isn't just a metaphor?",
                a: 'Ablation studies: zero out specific FFN neurons and watch "The capital of India is" stop producing "Delhi" while grammar stays intact. Activate those same neurons artificially and watch "Delhi" appear in unrelated contexts. The knowledge is localized to specific neurons - not distributed across the whole network.',
                color: C.blue,
              },
            ].map(({ q, a, color }, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${color}06`,
                  border: `1px solid ${color}15`,
                }}
              >
                <T color={color} bold size={13}>
                  {q}
                </T>
                <T color={C.dim} size={12} style={{ marginTop: 3 }}>
                  {a}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      {sub === 9 && (
        <SubBtn onClick={() => navigate("forward")} rippleKey={subBtnRipple} registerSubBtn={registerSubBtn} />
      )}

      {/* Sub 10: Where do the parameters live? */}
      <Reveal when={sub >= 10}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            Where Do the Parameters Live?
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            Parameters are all the learnable numbers in the model - every weight and bias that got tuned during training
            (chapter 1.4). They are the model's "memory." More parameters = more capacity to store knowledge.
          </T>

          <T color="#b8a9ff" size={15} style={{ marginTop: 10 }}>
            Here's how they split between Attention and FFN in one Transformer block:
          </T>

          {/* Visual: stacked bar */}
          <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: "rgba(0,0,0,0.25)" }}>
            <T color={C.dim} bold center size={13} style={{ marginBottom: 8 }}>
              One Transformer Block (~3.15M parameters total)
            </T>
            <div style={{ height: 32, borderRadius: 6, overflow: "hidden", display: "flex" }}>
              <div
                style={{
                  width: "33%",
                  background: `${C.pink}60`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="white" bold size={12}>
                  Attention (1/3)
                </T>
              </div>
              <div
                style={{
                  width: "67%",
                  background: `${C.orange}60`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <T color="white" bold size={12}>
                  FFN (2/3)
                </T>
              </div>
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  background: `${C.pink}06`,
                  border: `1px solid ${C.pink}15`,
                }}
              >
                <T color={C.pink} bold center size={12}>
                  Attention: ~1.05M
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  W_Q, W_K, W_V = 3 matrices that create the Queries, Keys, and Values (chapter 6.9)
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 2 }}>
                  W_O = the matrix that blends multi-head outputs (chapter 7.12)
                </T>
                <T color={C.pink} size={11} style={{ marginTop: 4 }}>
                  These learn <strong>how to find relationships</strong> between words
                </T>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  background: `${C.orange}06`,
                  border: `1px solid ${C.orange}15`,
                }}
              >
                <T color={C.orange} bold center size={12}>
                  FFN: ~2.1M
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 4 }}>
                  W<sub>1</sub> (512 x 2048) = expands to thinking space
                </T>
                <T color={C.dim} size={11} style={{ marginTop: 2 }}>
                  W<sub>2</sub> (2048 x 512) = compresses back to model size
                </T>
                <T color={C.orange} size={11} style={{ marginTop: 4 }}>
                  These learn <strong>facts and transformations</strong> - the actual knowledge
                </T>
              </div>
            </div>
          </div>

          <T color={C.dim} size={13} style={{ marginTop: 8 }}>
            GPT-3 has 96 blocks. That's 96 copies of this structure = 96 x 3.15M = ~302M parameters just in one layer
            type - and GPT-3's total is 175 <strong>billion</strong> because d_model is 12,288 (not 512), making each
            matrix vastly larger.
          </T>
        </Box>
      </Reveal>
    </div>
  );
}
