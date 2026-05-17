import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function ForwardPass(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            The Network We Will Trace
          </T>
          <T color={C.bright} size={17} style={{ marginTop: 10, lineHeight: 1.6 }}>
            Let's trace every number through a real network - no skipping, no hand-waving. Weights are on the edges,
            biases inside each neuron.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 480 270" style={{ display: "block", width: "100%", maxWidth: 480 }}>
              <desc>
                Two-layer neural network with labeled weights and biases on every edge, used for tracing a complete
                forward pass computation
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
                { sy: 80, dy: 80, w: "0.5", c: C.red },
                { sy: 80, dy: 200, w: "0.1", c: C.red },
                { sy: 200, dy: 80, w: "50", c: C.yellow },
                { sy: 200, dy: 200, w: "10", c: C.yellow },
              ].map(({ sy, dy, w, c }, i) => {
                const x1 = 86,
                  x2 = 188,
                  t = 0.8;
                const lx = x1 + (x2 - x1) * t;
                const ly = sy + (dy - sy) * t;
                return (
                  <g key={`h${i}`}>
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
                { y: 80, label: "x₁", val: "1500", c: C.red },
                { y: 200, label: "x₂", val: "3", c: C.yellow },
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

              {/* Hidden nodes (r=32, label + bias inside, output outside as arrow) */}
              {[
                { y: 80, label: "h₁", bias: "50", out: "950", c: C.cyan, ct: "#80deea" },
                { y: 200, label: "h₂", bias: "5", out: "185", c: C.orange, ct: "#ffcc80" },
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
                    → {out}
                  </text>
                </g>
              ))}

              {/* Output node (r=32, label + bias inside, output outside as arrow) */}
              <g>
                <circle cx={390} cy={140} r={32} fill={`${C.green}15`} stroke={C.green} strokeWidth={2} />
                <text x={390} y={137} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                  y
                </text>
                <text x={390} y={152} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle">
                  b=10
                </text>
                <text x={434} y={144} fill="#80e8a5" fontSize={11} textAnchor="start" fontWeight={700}>
                  → 807
                </text>
              </g>

              {/* Bottom label */}
              <text x={240} y={258} fill="rgba(255,255,255,0.4)" fontSize={13} textAnchor="middle" fontWeight={600}>
                2 inputs → 2 hidden neurons → 1 output
              </text>
            </svg>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20} style={{ marginBottom: 16 }}>
            LAYER 1: Each Hidden Neuron Processes the Inputs
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 0 }}>
            {[
              {
                name: "Neuron h₁",
                c: C.cyan,
                ct: "#80deea",
                label: "h₁",
                muls: [
                  { input: "x₁", iv: "1500", wv: "0.5", r: "750" },
                  { input: "x₂", iv: "3", wv: "50", r: "150" },
                ],
                sumParts: "750 + 150",
                sumResult: "900",
                biasVal: "50",
                biasResult: "950",
                reluIn: "950",
                reluOut: "950",
                pos: true,
              },
              {
                name: "Neuron h₂",
                c: C.orange,
                ct: "#ffcc80",
                label: "h₂",
                muls: [
                  { input: "x₁", iv: "1500", wv: "0.1", r: "150" },
                  { input: "x₂", iv: "3", wv: "10", r: "30" },
                ],
                sumParts: "150 + 30",
                sumResult: "180",
                biasVal: "5",
                biasResult: "185",
                reluIn: "185",
                reluOut: "185",
                pos: true,
              },
            ].map(
              ({
                name,
                c,
                ct: _ct,
                label,
                muls,
                sumParts,
                sumResult,
                biasVal,
                biasResult,
                reluIn,
                reluOut,
                pos: _pos,
              }) => (
                <div
                  key={name}
                  style={{ padding: "14px", borderRadius: 10, background: `${c}06`, border: `1px solid ${c}15` }}
                >
                  <T color={c} bold size={17} center>
                    {name}
                  </T>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: `${C.red}06`,
                        border: `1px solid ${C.red}12`,
                      }}
                    >
                      <T color={C.red} bold size={14}>
                        Step 1: Multiply
                      </T>
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                        {muls.map(({ input, iv, wv, r }) => (
                          <div key={input} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: C.dim, fontSize: 13, minWidth: 20 }}>{input}:</span>
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
                              {iv}
                            </span>
                            <span style={{ color: C.dim, fontSize: 14 }}>×</span>
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
                              {wv}
                            </span>
                            <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                            <span
                              style={{
                                padding: "2px 8px",
                                background: `${c}15`,
                                borderRadius: 4,
                                color: c,
                                fontSize: 15,
                                fontWeight: 700,
                              }}
                            >
                              {r}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: `${C.yellow}06`,
                        border: `1px solid ${C.yellow}12`,
                      }}
                    >
                      <T color={C.yellow} bold size={14}>
                        Step 2: Sum
                      </T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
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
                          {sumParts}
                        </span>
                        <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                        <span
                          style={{
                            padding: "3px 10px",
                            background: `${C.yellow}20`,
                            borderRadius: 4,
                            color: C.yellow,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {sumResult}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: `${C.purple}06`,
                        border: `1px solid ${C.purple}12`,
                      }}
                    >
                      <T color="#b8a9ff" bold size={14}>
                        Step 3: Add bias
                      </T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
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
                          {sumResult}
                        </span>
                        <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                        <span
                          style={{
                            padding: "2px 8px",
                            background: `${C.purple}15`,
                            borderRadius: 4,
                            color: "#b8a9ff",
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          {biasVal}
                        </span>
                        <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                        <span
                          style={{
                            padding: "3px 10px",
                            background: `${C.purple}20`,
                            borderRadius: 4,
                            color: C.purple,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {biasResult}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: `${C.green}06`,
                        border: `1px solid ${C.green}12`,
                      }}
                    >
                      <T color={C.green} bold size={14}>
                        Step 4: ReLU
                      </T>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            background: `${C.purple}15`,
                            borderRadius: 4,
                            color: "#b8a9ff",
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          {reluIn}
                        </span>
                        <span style={{ color: "#80e8a5", fontSize: 15, fontWeight: 600 }}>is positive → keep →</span>
                        <span
                          style={{
                            padding: "3px 10px",
                            background: `${C.green}20`,
                            borderRadius: 4,
                            color: C.green,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {reluOut}
                        </span>
                        <span style={{ color: C.green, fontSize: 16 }}> ✓</span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      textAlign: "center",
                      padding: "8px",
                      background: `${c}15`,
                      borderRadius: 8,
                    }}
                  >
                    <T color={c} bold size={18}>
                      {label} = {reluOut}
                    </T>
                  </div>
                </div>
              ),
            )}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={18}>
              Layer 1 output: [950, 185]
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20} style={{ marginBottom: 16 }}>
            LAYER 2: The Output Neuron
          </T>
          <T color="#80e8a5" size={16} style={{ marginBottom: 14 }}>
            The output neuron takes Layer 1's output [950, 185] as input.
          </T>
          <div
            style={{ padding: "14px", borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}15` }}
          >
            <T color={C.green} bold size={17} center>
              Output Neuron
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                }}
              >
                <T color={C.red} bold size={14}>
                  Step 1: Multiply
                </T>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { input: "h₁", iv: "950", wv: "0.8", r: "760" },
                    { input: "h₂", iv: "185", wv: "0.2", r: "37" },
                  ].map(({ input, iv, wv, r }) => (
                    <div key={input} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: C.dim, fontSize: 13, minWidth: 20 }}>{input}:</span>
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
                        {iv}
                      </span>
                      <span style={{ color: C.dim, fontSize: 14 }}>×</span>
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
                        {wv}
                      </span>
                      <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          background: `${C.green}15`,
                          borderRadius: 4,
                          color: C.green,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {r}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.yellow} bold size={14}>
                  Step 2: Sum
                </T>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
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
                    760 + 37
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span
                    style={{
                      padding: "3px 10px",
                      background: `${C.yellow}20`,
                      borderRadius: 4,
                      color: C.yellow,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    797
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.purple}06`,
                  border: `1px solid ${C.purple}12`,
                }}
              >
                <T color="#b8a9ff" bold size={14}>
                  Step 3: Add bias
                </T>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
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
                    797
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>+</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.purple}15`,
                      borderRadius: 4,
                      color: "#b8a9ff",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    10
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span
                    style={{
                      padding: "3px 10px",
                      background: `${C.purple}20`,
                      borderRadius: 4,
                      color: C.purple,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    807
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold size={14}>
                  Step 4: ReLU
                </T>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.purple}15`,
                      borderRadius: 4,
                      color: "#b8a9ff",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    807
                  </span>
                  <span style={{ color: "#80e8a5", fontSize: 15, fontWeight: 600 }}>is positive → keep →</span>
                  <span
                    style={{
                      padding: "3px 10px",
                      background: `${C.green}20`,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    807
                  </span>
                  <span style={{ color: C.green, fontSize: 16 }}> ✓</span>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 10,
                textAlign: "center",
                padding: "8px",
                background: `${C.green}15`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold size={18}>
                Output = 807
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={20}>
              Final Prediction: $807k
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>
            Our Prediction vs Actual
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 0 }}>
            <div
              style={{
                flex: 1,
                padding: 14,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <T color={C.yellow} bold size={15}>
                Predicted
              </T>
              <T color={C.yellow} bold size={18} style={{ marginTop: 8 }}>
                $807k
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: 14,
                background: `${C.red}06`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={15}>
                Actual
              </T>
              <T color={C.red} bold size={18} style={{ marginTop: 8 }}>
                $900k
              </T>
            </div>
          </div>
          <T color="rgba(255,255,255,0.5)" size={15} style={{ marginTop: 14, textAlign: "center" }}>
            We're off by $93k
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 16, lineHeight: 1.6 }}>
            How do we measure exactly how wrong we are? And more importantly - how do we IMPROVE? That's what comes
            next.
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
};

// Section 1, Chapters 1.8-1.12
// Loss Function, Learning, Derivatives, Backward Pass, Gradient Descent
