import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WeightsBiases(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
            Every Connection Has a Weight
          </T>
          <T color={C.bright} bold size={18}>
            Weight = how important is this input?
          </T>
          <T color={C.bright} size={17} style={{ marginTop: 12, lineHeight: 1.6 }}>
            Think of a doctor diagnosing flu. They look at symptoms: Fever - very important (high weight). Headache -
            somewhat important (medium weight). Shoe color - irrelevant (weight close to 0). A weight is a number that
            says how much to care about this input.
          </T>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>
              Bias = a Baseline Shift
            </T>
            <T color="#b8a9ff" size={17} style={{ marginBottom: 12, lineHeight: 1.6 }}>
              House price example: without bias, price = sqft × weight. This forces price to zero when sqft is zero. But
              even a tiny plot has land value!
            </T>
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>Without bias:</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: C.green,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                price
              </span>
              <span style={{ color: C.dim }}>=</span>
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
                sqft
              </span>
              <span style={{ color: C.dim }}>×</span>
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
                weight
              </span>
            </div>
            <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 8 }}>
              Forces price = 0 when sqft = 0
            </T>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>With bias:</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: C.green,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                price
              </span>
              <span style={{ color: C.dim }}>=</span>
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
                sqft
              </span>
              <span style={{ color: C.dim }}>×</span>
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
                weight
              </span>
              <span style={{ color: C.dim }}>+</span>
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
                bias
              </span>
            </div>
            <T color="#b8a9ff" size={13} style={{ marginTop: 8, fontWeight: 600 }}>
              bias adds base amount regardless of input
            </T>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              A Neuron with Labeled Parts
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 520 190" style={{ display: "block", width: "100%", maxWidth: 520 }}>
                <desc>
                  Labeled neuron anatomy diagram showing inputs with weights, sum plus bias, activation function, and
                  output
                </desc>
                {/* Layout: inputs at x=55, sum at x=190, activation at x=310, output at x=440. Center y=80. */}

                {/* Edges FIRST (behind everything) */}
                <line x1={79} y1={50} x2={162} y2={72} stroke={C.red} strokeWidth={2} />
                <line x1={79} y1={110} x2={162} y2={88} stroke={C.yellow} strokeWidth={2} />
                <line x1={218} y1={80} x2={282} y2={80} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                <polygon points="282,80 276,76 276,84" fill="rgba(255,255,255,0.3)" />
                <line x1={338} y1={80} x2={410} y2={80} stroke={C.green} strokeWidth={2} />
                <polygon points="410,80 404,76 404,84" fill={C.green} />

                {/* Bias dashed line */}
                <line x1={190} y1={108} x2={190} y2={142} stroke={C.purple} strokeWidth={1.5} strokeDasharray="4,3" />
                <polygon points="190,108 187,115 193,115" fill={C.purple} />

                {/* Input nodes */}
                <circle cx={55} cy={50} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
                <text x={55} y={45} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>
                  x₁
                </text>
                <text x={55} y={60} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">
                  1500
                </text>

                <circle cx={55} cy={110} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
                <text x={55} y={105} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>
                  x₂
                </text>
                <text x={55} y={120} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle">
                  3
                </text>

                {/* Weight labels ABOVE edges (offset from line) */}
                <text x={118} y={48} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                  w=0.5
                </text>
                <text x={118} y={118} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>
                  w=50
                </text>

                {/* Sum node */}
                <circle cx={190} cy={80} r={28} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={190} y={76} fill={C.cyan} fontSize={17} textAnchor="middle" fontWeight={700}>
                  Σ
                </text>
                <text x={190} y={92} fill={C.cyan} fontSize={10} textAnchor="middle">
                  +bias
                </text>

                {/* Bias label */}
                <rect
                  x={158}
                  y={145}
                  width={64}
                  height={18}
                  rx={4}
                  fill={`${C.purple}12`}
                  stroke={`${C.purple}30`}
                  strokeWidth={1}
                />
                <text x={190} y={158} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>
                  bias = 50
                </text>

                {/* Activation node - larger, just says "f" */}
                <circle cx={310} cy={80} r={28} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} />
                <text x={310} y={86} fill={C.orange} fontSize={16} textAnchor="middle" fontWeight={700}>
                  f(x)
                </text>
                <text x={310} y={46} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={600}>
                  activation
                </text>

                {/* Output node */}
                <circle cx={440} cy={80} r={28} fill={`${C.green}15`} stroke={C.green} strokeWidth={2} />
                <text x={440} y={86} fill={C.green} fontSize={18} textAnchor="middle" fontWeight={700}>
                  950
                </text>
                <text x={440} y={46} fill={C.green} fontSize={11} textAnchor="middle" fontWeight={600}>
                  output
                </text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>
              Step by Step: Multiply, Sum, Add Bias, Activate
            </T>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Step 1: Multiply each input by its weight
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, paddingLeft: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 13, minWidth: 24 }}>x₁:</span>
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
                    1500
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>×</span>
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
                    0.5
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.red}15`,
                      borderRadius: 4,
                      color: C.red,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    750
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 13, minWidth: 24 }}>x₂:</span>
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
                    3
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
                    50
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      background: `${C.yellow}15`,
                      borderRadius: 4,
                      color: C.yellow,
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    150
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={16}>
                Step 2: Sum
              </T>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {["750", "150"].map((v, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    {i > 0 && <span style={{ color: C.dim, fontSize: 14 }}>+</span>}
                    <span
                      style={{
                        padding: "2px 8px",
                        background: `${C.cyan}15`,
                        borderRadius: 4,
                        color: C.cyan,
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {v}
                    </span>
                  </span>
                ))}
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <span
                  style={{
                    padding: "3px 10px",
                    background: `${C.cyan}20`,
                    borderRadius: 4,
                    color: C.cyan,
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  900
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color="#b8a9ff" bold size={16}>
                Step 3: Add bias
              </T>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
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
                  900
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
                  50
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <span
                  style={{
                    padding: "3px 10px",
                    background: `${C.purple}20`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  950
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                Step 4: Activation
              </T>
              <div style={{ marginTop: 6, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>
                  950 is positive → keep it
                </T>
              </div>
              <div
                style={{
                  marginTop: 8,
                  textAlign: "center",
                  padding: "6px 10px",
                  background: `${C.green}10`,
                  borderRadius: 6,
                }}
              >
                <T color={C.green} bold size={16}>
                  Output = $950k
                </T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>
              Key Takeaway
            </T>
            <T color="#80e8a5" size={17} style={{ lineHeight: 1.6 }}>
              A neuron is just: multiply, sum, add bias, activate. The weights and bias are what the network LEARNS.
              Everything else is fixed math.
            </T>
          </Box>
        </Reveal>
      )}
      {sub < 4 && (
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
