import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function BackpropRealNetwork(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Recap the network from ch 1.7 */}
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Our Network Got It Wrong - Now Fix It
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 12 }}>
            In <ChapterLink to="1.7">chapter 1.7</ChapterLink>, we traced a forward pass. The network predicted a house price:
          </T>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {[
                { label: "Inputs", val: "x\u2081=1500, x\u2082=3", c: C.red },
                { label: "Hidden", val: "h\u2081=950, h\u2082=185", c: C.cyan },
                { label: "Output", val: "y=807", c: C.green },
              ].map(({ label, val, c }) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 16px",
                    background: `${c}06`,
                    borderRadius: 8,
                    border: `1px solid ${c}12`,
                    textAlign: "center",
                    minWidth: 110,
                  }}
                >
                  <T color={C.dim} size={12} center>
                    {label}
                  </T>
                  <T color={c} bold size={16} center style={{ marginTop: 4 }}>
                    {val}
                  </T>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <div
                style={{
                  padding: "10px 16px",
                  background: `${C.yellow}06`,
                  borderRadius: 8,
                  border: `1px solid ${C.yellow}12`,
                  textAlign: "center",
                  minWidth: 110,
                }}
              >
                <T color={C.dim} size={12} center>
                  Target
                </T>
                <T color={C.yellow} bold size={16} center style={{ marginTop: 4 }}>
                  900
                </T>
              </div>
              <div
                style={{
                  padding: "10px 16px",
                  background: `${C.red}08`,
                  borderRadius: 8,
                  border: `1px solid ${C.red}20`,
                  textAlign: "center",
                  minWidth: 150,
                }}
              >
                <T color={C.dim} size={12} center>
                  Loss = (807 - 900)²
                </T>
                <T color={C.red} bold size={20} center style={{ marginTop: 4 }}>
                  8,649
                </T>
              </div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 12 }}>
            The network predicted 807 but the real price is 900. Loss = 8,649. How do we fix this? We need to figure out
            which weights are to blame and how to adjust each one.
          </T>
        </Box>
      )}

      {/* Sub 1: The network diagram - same style as ch 1.7 */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            The Network - Now We Trace Backwards
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            This is the same network from <ChapterLink to="1.7">chapter 1.7</ChapterLink>. Every weight is labeled on its edge. The backward pass will
            compute a gradient for each one.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <svg viewBox="0 0 480 270" style={{ display: "block", width: "100%", maxWidth: 480 }}>
              <desc>
                Two-layer neural network annotated with all weights, biases, intermediate outputs, target, loss, and
                backward gradient flow for backpropagation tracing
              </desc>
              {/* Column labels */}
              <text x={60} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Input
              </text>
              <text x={220} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Hidden
              </text>
              <text x={390} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Output
              </text>

              {/* Input→Hidden edges with weight labels near destination (t=0.8) */}
              {[
                { sy: 80, dy: 80, w: "0.5", wn: "w\u2081\u2081", c: C.red },
                { sy: 80, dy: 200, w: "0.1", wn: "w\u2081\u2082", c: C.red },
                { sy: 200, dy: 80, w: "50", wn: "w\u2082\u2081", c: C.yellow },
                { sy: 200, dy: 200, w: "10", wn: "w\u2082\u2082", c: C.yellow },
              ].map(({ sy, dy, w, wn: _wn, c }, i) => {
                const x1 = 86,
                  x2 = 188,
                  t = 0.75;
                const lx = x1 + (x2 - x1) * t;
                const ly = sy + (dy - sy) * t;
                return (
                  <g key={`h${i}`}>
                    <line x1={x1} y1={sy} x2={x2} y2={dy} stroke={`${c}30`} strokeWidth={1.2} />
                    <rect
                      x={lx - 18}
                      y={ly - 9}
                      width={36}
                      height={17}
                      rx={3}
                      fill="#08080dee"
                      stroke={`${c}30`}
                      strokeWidth={0.5}
                    />
                    <text x={lx} y={ly + 4} fill={c} fontSize={9} textAnchor="middle" fontWeight={600}>
                      {w}
                    </text>
                  </g>
                );
              })}

              {/* Hidden→Output edges with weight labels near destination (t=0.8) */}
              {[
                { sy: 80, w: "0.8", c: C.cyan },
                { sy: 200, w: "0.2", c: C.orange },
              ].map(({ sy, w, c }, i) => {
                const x1 = 252,
                  x2 = 358,
                  dy = 140,
                  t = 0.8;
                const lx = x1 + (x2 - x1) * t;
                const ly = sy + (dy - sy) * t;
                return (
                  <g key={`o${i}`}>
                    <line x1={x1} y1={sy} x2={x2} y2={dy} stroke={`${c}30`} strokeWidth={1.2} />
                    <rect
                      x={lx - 14}
                      y={ly - 8}
                      width={28}
                      height={15}
                      rx={3}
                      fill="#08080dee"
                      stroke={`${c}30`}
                      strokeWidth={0.5}
                    />
                    <text x={lx} y={ly + 4} fill={c} fontSize={10} textAnchor="middle" fontWeight={600}>
                      {w}
                    </text>
                  </g>
                );
              })}

              {/* Input nodes (r=26) */}
              {[
                { y: 80, label: "x\u2081", val: "1500", c: C.red },
                { y: 200, label: "x\u2082", val: "3", c: C.yellow },
              ].map(({ y, label, val, c }) => (
                <g key={label}>
                  <circle cx={60} cy={y} r={26} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text x={60} y={y - 2} fill={c} fontSize={14} textAnchor="middle" fontWeight={700}>
                    {label}
                  </text>
                  <text x={60} y={y + 13} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">
                    {val}
                  </text>
                </g>
              ))}

              {/* Hidden nodes (r=32) */}
              {[
                { y: 80, label: "h\u2081", bias: "50", out: "950", c: C.cyan, ct: "#80deea" },
                { y: 200, label: "h\u2082", bias: "5", out: "185", c: C.orange, ct: "#ffcc80" },
              ].map(({ y, label, bias, out, c, ct }) => (
                <g key={label}>
                  <circle cx={220} cy={y} r={32} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text x={220} y={y - 3} fill={c} fontSize={14} textAnchor="middle" fontWeight={700}>
                    {label}
                  </text>
                  <text x={220} y={y + 12} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle">
                    b={bias}
                  </text>
                  <text x={266} y={y + 4} fill={ct} fontSize={11} textAnchor="start" fontWeight={700}>
                    {"→ "}
                    {out}
                  </text>
                </g>
              ))}

              {/* Output node (r=32) */}
              <g>
                <circle cx={390} cy={140} r={32} fill={`${C.green}15`} stroke={C.green} strokeWidth={2} />
                <text x={390} y={137} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                  y
                </text>
                <text x={390} y={152} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle">
                  b=10
                </text>
                <text x={434} y={144} fill="#80e8a5" fontSize={11} textAnchor="start" fontWeight={700}>
                  {"→ 807"}
                </text>
              </g>

              {/* Loss and target annotations */}
              <text x={390} y={196} fill={C.yellow} fontSize={11} textAnchor="middle">
                target = 900
              </text>
              <text x={390} y={212} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                Loss = 8,649
              </text>

              {/* Backward arrow annotation */}
              <text x={240} y={258} fill={C.red} fontSize={11} textAnchor="middle" fontWeight={600}>
                {"← Gradients flow backwards through this network ←"}
              </text>
            </svg>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 8 }}>
            The chain rule traces backward through every operation, multiplying derivatives at each step. Think of it
            like tracing blame: "Loss, who caused you? The prediction. Prediction, who caused you? The weights and
            hidden neurons..."
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Start at the end - dLoss/dy */}
      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Step 1: How Does Loss Change with y?
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            Start at the very end. Loss = (y - target)². How much does loss change when y changes by a tiny amount?
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.red}25`,
            }}
          >
            <T color={C.dim} size={12} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Derivative of Loss with respect to y
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <T color={C.dim} size={16}>
                loss = (y - target)²
              </T>
              <T color={C.dim} size={16}>
                dLoss/dy = 2 x (y - target)
              </T>
              <div
                style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "center" }}
              >
                <T color={C.dim} size={16}>
                  dLoss/dy = 2 x (
                </T>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: C.green,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  807
                </span>
                <T color={C.dim} size={16}>
                  -
                </T>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.yellow}15`,
                    borderRadius: 4,
                    color: C.yellow,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  900
                </span>
                <T color={C.dim} size={16}>
                  ) = 2 x (-93) =
                </T>
                <span
                  style={{
                    padding: "3px 10px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  -186
                </span>
              </div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 12 }}>
            This is negative (-186). It means: if we increased y by 1 unit, loss would decrease by 186. Makes sense - y
            = 807 is too low, so pushing it up reduces the error.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Output layer weight gradients */}
      <Reveal when={sub >= 3}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            Step 2: Output Layer Weight Gradients
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Now trace one step further back. y = h₁ x w_o1 + h₂ x w_o2 + b_o. How does each output weight affect loss?
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                name: "w_o1",
                formula: "dLoss/dy x dy/dw_o1 = dLoss/dy x h\u2081",
                calc: "-186 x 950",
                result: "-176,700",
                c: C.cyan,
              },
              {
                name: "w_o2",
                formula: "dLoss/dy x dy/dw_o2 = dLoss/dy x h\u2082",
                calc: "-186 x 185",
                result: "-34,410",
                c: C.orange,
              },
              {
                name: "b_o",
                formula: "dLoss/dy x dy/db_o = dLoss/dy x 1",
                calc: "-186 x 1",
                result: "-186",
                c: C.purple,
              },
            ].map(({ name, formula, calc, result, c }) => (
              <div
                key={name}
                style={{ padding: "10px 12px", borderRadius: 8, background: `${c}06`, border: `1px solid ${c}12` }}
              >
                <T color={c} bold size={16}>
                  dLoss/d{name}:
                </T>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  {formula}
                </T>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <T color={C.dim} size={15}>
                    = {calc} =
                  </T>
                  <span
                    style={{
                      padding: "2px 10px",
                      background: `${c}15`,
                      borderRadius: 4,
                      color: c,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {result}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Why is the gradient for w_o1 five times larger than w_o2? Because h₁ = 950 is five times larger than h₂ =
            185. A bigger input means the weight has more influence on the output.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: How gradient reaches the hidden layer */}
      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Step 3: How Does Gradient Reach the Hidden Layer?
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            The output layer is done. But what about the hidden layer weights (w₁₁, w₂₁, etc.)? They are TWO steps away
            from loss. The gradient must flow backward through the output neuron first.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={16}>
                How much does loss care about h₁?
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                y = h₁ x w_o1 + ..., so dy/dh₁ = w_o1 = 0.8
              </T>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <T color={C.dim} size={15}>
                  dLoss/dh₁ = dLoss/dy x w_o1 = -186 x 0.8 =
                </T>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.cyan}15`,
                    borderRadius: 4,
                    color: C.cyan,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  -148.8
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                How much does loss care about h₂?
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                y = ... + h₂ x w_o2 + ..., so dy/dh₂ = w_o2 = 0.2
              </T>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <T color={C.dim} size={15}>
                  dLoss/dh₂ = dLoss/dy x w_o2 = -186 x 0.2 =
                </T>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.orange}15`,
                    borderRadius: 4,
                    color: C.orange,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  -37.2
                </span>
              </div>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            Notice: h₁ gets 4x more gradient than h₂ because w_o1 (0.8) is 4x bigger than w_o2 (0.2). The weight
            connecting h₁ to the output is like a pipe - a bigger weight means a wider pipe that carries more gradient
            backward.
          </T>
        </Box>
      </Reveal>

      {/* Sub 5: Through ReLU */}
      <Reveal when={sub >= 5}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Step 4: Through ReLU - The Gate
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            Before reaching the hidden layer weights, the gradient must pass through ReLU. Remember: h₁ = ReLU(z₁) where
            z₁ is the pre-activation value.
          </T>
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <div
              style={{
                padding: "12px",
                background: `${C.green}06`,
                borderRadius: 8,
                border: `1px solid ${C.green}12`,
                flex: 1,
                minWidth: 180,
              }}
            >
              <T color={C.green} bold center size={16}>
                ReLU Derivative
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.green, fontSize: 14, fontWeight: 600 }}>If z &gt; 0:</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.green}15`,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    derivative = 1
                  </span>
                </div>
                <T color="#80e8a5" size={13}>
                  Gradient passes through unchanged
                </T>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{ color: C.red, fontSize: 14, fontWeight: 600 }}>If z ≤ 0:</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.red}15`,
                      borderRadius: 4,
                      color: C.red,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    derivative = 0
                  </span>
                </div>
                <T color="#ef9a9a" size={13}>
                  Gradient is completely blocked. Dead.
                </T>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={15}>
                Neuron h₁: z₁ = 950 (positive) - ReLU derivative = 1
              </T>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <T color={C.dim} size={15}>
                  dLoss/dz₁ = dLoss/dh₁ x 1 = -148.8 x 1 =
                </T>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.cyan}15`,
                    borderRadius: 4,
                    color: C.cyan,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  -148.8
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={15}>
                Neuron h₂: z₂ = 185 (positive) - ReLU derivative = 1
              </T>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <T color={C.dim} size={15}>
                  dLoss/dz₂ = dLoss/dh₂ x 1 = -37.2 x 1 =
                </T>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.orange}15`,
                    borderRadius: 4,
                    color: C.orange,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  -37.2
                </span>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            Both neurons had positive pre-activation values, so ReLU let the full gradient through. But if z had been
            negative (like -50), ReLU would have output 0 during the forward pass, and the gradient would be completely
            blocked during backprop. That neuron would learn nothing from this example - a "dead neuron."
          </T>
        </Box>
      </Reveal>

      {/* Sub 6: Hidden layer weight gradients */}
      <Reveal when={sub >= 6}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Step 5: Hidden Layer Weight Gradients
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Now we are at the hidden layer weights. z₁ = x₁ x w₁₁ + x₂ x w₂₁ + b₁. So dz₁/dw₁₁ = x₁, dz₁/dw₂₁ = x₂,
            dz₁/db₁ = 1.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              borderRadius: 10,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <T color={C.cyan} bold size={16} center>
              Neuron h₁ weights (dLoss/dz₁ = -148.8)
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "w₁₁", formula: "dL/dz₁ × x₁(1500)", calc: "-148.8 × 1500", result: "-223,200", c: C.red },
                { name: "w₂₁", formula: "dL/dz₁ × x₂(3)", calc: "-148.8 × 3", result: "-446.4", c: C.yellow },
                { name: "b₁", formula: "dL/dz₁ × 1", calc: "-148.8 × 1", result: "-148.8", c: C.purple },
              ].map(({ name, formula, calc, result, c }) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: `${c}06`,
                    border: `1px solid ${c}12`,
                  }}
                >
                  <code
                    style={{
                      color: c,
                      fontWeight: 800,
                      fontSize: 15,
                      padding: "4px 8px",
                      background: `${c}12`,
                      borderRadius: 5,
                      textAlign: "center",
                      minWidth: 80,
                      flexShrink: 0,
                    }}
                  >
                    dL/d{name}
                  </code>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 8 }}>=</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>{formula}</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                  <span style={{ color: C.mid, fontSize: 14, marginLeft: 6 }}>{calc}</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                  <span
                    style={{
                      padding: "4px 14px",
                      marginLeft: 8,
                      background: `${c}18`,
                      borderRadius: 6,
                      color: c,
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "12px",
              borderRadius: 10,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold size={16} center>
              Neuron h₂ weights (dLoss/dz₂ = -37.2)
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "w₁₂", formula: "dL/dz₂ × x₁(1500)", calc: "-37.2 × 1500", result: "-55,800", c: C.red },
                { name: "w₂₂", formula: "dL/dz₂ × x₂(3)", calc: "-37.2 × 3", result: "-111.6", c: C.yellow },
                { name: "b₂", formula: "dL/dz₂ × 1", calc: "-37.2 × 1", result: "-37.2", c: C.purple },
              ].map(({ name, formula, calc, result, c }) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: `${c}06`,
                    border: `1px solid ${c}12`,
                  }}
                >
                  <code
                    style={{
                      color: c,
                      fontWeight: 800,
                      fontSize: 15,
                      padding: "4px 8px",
                      background: `${c}12`,
                      borderRadius: 5,
                      textAlign: "center",
                      minWidth: 80,
                      flexShrink: 0,
                    }}
                  >
                    dL/d{name}
                  </code>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 8 }}>=</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>{formula}</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                  <span style={{ color: C.mid, fontSize: 14, marginLeft: 6 }}>{calc}</span>
                  <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                  <span
                    style={{
                      padding: "4px 14px",
                      marginLeft: 8,
                      background: `${c}18`,
                      borderRadius: 6,
                      color: c,
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Notice w₁₁ has a gradient of -223,200 while w₂₁ has only -446.4. Why? Because x₁ = 1500 is 500x larger than
            x₂ = 3. The gradient for a weight is proportional to its input - bigger inputs create bigger gradients.
          </T>
        </Box>
      </Reveal>

      {/* Sub 7: The full chain illustrated */}
      <Reveal when={sub >= 7}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            The Full Chain for w₁₁
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            Let's trace the COMPLETE chain from loss all the way back to w₁₁. This is four multiplications - the chain
            rule in action:
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.orange}25`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <span style={{ color: C.orange, fontSize: 15, fontWeight: 700 }}>dLoss/dw₁₁ =</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                dLoss/dy
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.cyan}15`,
                  borderRadius: 4,
                  color: "#80deea",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                dy/dh₁
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                dReLU/dz₁
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.yellow}15`,
                  borderRadius: 4,
                  color: "#ffe082",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                dz₁/dw₁₁
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                flexWrap: "wrap",
                marginBottom: 10,
              }}
            >
              <span style={{ color: C.dim, fontSize: 15 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                -186
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.cyan}15`,
                  borderRadius: 4,
                  color: "#80deea",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                1
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>x</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.yellow}15`,
                  borderRadius: 4,
                  color: "#ffe082",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                1500
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ color: C.dim, fontSize: 18 }}>=</span>
              <span
                style={{
                  padding: "3px 12px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: C.red,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                -223,200
              </span>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            Four multiplications. Each one traces through one operation in the computational graph. This is why it is
            called the "chain" rule - you chain derivatives together, link by link, all the way from loss back to each
            weight.
          </T>
        </Box>
      </Reveal>

      {/* Sub 8: Complete gradient table */}
      <Reveal when={sub >= 8}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Complete Gradient Table - Every Parameter
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            We just computed the gradient for ALL 9 learnable parameters in our network:
          </T>
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto auto auto",
                gap: 4,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              {["Parameter", "Value", "Gradient", "Meaning"].map((h) => (
                <T
                  key={h}
                  color={C.bright}
                  bold
                  size={13}
                  center
                  style={{ padding: "4px 6px", borderBottom: `1px solid ${C.green}30` }}
                >
                  {h}
                </T>
              ))}
              {[
                { p: "w₁₁", v: "0.5", g: "-223,200", m: "Increase a lot" },
                { p: "w₂₁", v: "50", g: "-446.4", m: "Increase a bit" },
                { p: "b₁", v: "50", g: "-148.8", m: "Increase a bit" },
                { p: "w₁₂", v: "0.1", g: "-55,800", m: "Increase" },
                { p: "w₂₂", v: "10", g: "-111.6", m: "Increase a bit" },
                { p: "b₂", v: "5", g: "-37.2", m: "Increase a bit" },
                { p: "w_o1", v: "0.8", g: "-176,700", m: "Increase a lot" },
                { p: "w_o2", v: "0.2", g: "-34,410", m: "Increase" },
                { p: "b_o", v: "10", g: "-186", m: "Increase a bit" },
              ].map(({ p, v, g, m }) => (
                <div key={p} style={{ display: "contents" }}>
                  <T color={C.cyan} bold size={13} center style={{ padding: "3px 6px" }}>
                    {p}
                  </T>
                  <T color={C.dim} size={13} center style={{ padding: "3px 6px" }}>
                    {v}
                  </T>
                  <T color={C.red} bold size={13} center style={{ padding: "3px 6px" }}>
                    {g}
                  </T>
                  <T color={C.green} size={12} center style={{ padding: "3px 6px" }}>
                    {m}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            Every gradient is negative. This means: increasing any weight will decrease the loss. That makes sense - the
            prediction (807) was too low, so the network needs to push everything up to get closer to 900.
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 8 }}>
            This is backpropagation. Start at the loss, trace backward through every operation, multiply derivatives at
            each step. Every weight gets a gradient that tells it exactly how to change.
          </T>
        </Box>
      </Reveal>

      {sub < 8 && (
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

// ═══════ 1.14 Gradients in Action - The Full Training Loop ═══════
