import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WeightInit(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Why Not Start at Zero?
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            If all weights start at zero, every neuron in a layer computes the exact same output. All gradients are
            identical. No neuron ever becomes different from any other. The network is stuck forever.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 440 210" style={{ display: "block", width: "100%", maxWidth: 440 }}>
              <desc>
                Diagram showing the symmetry problem when all weights are zero: three neurons all produce identical
                output
              </desc>
              <text x={220} y={16} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle" fontWeight={600}>
                All Weights = 0: The Symmetry Problem
              </text>
              {/* Input */}
              <rect
                x={15}
                y={70}
                width={70}
                height={55}
                rx={8}
                fill={`${C.cyan}15`}
                stroke={C.cyan}
                strokeWidth={1.5}
              />
              <text x={50} y={93} fill={C.cyan} fontSize={12} textAnchor="middle" fontWeight={600}>
                Input
              </text>
              <text x={50} y={110} fill={C.dim} fontSize={10} textAnchor="middle">
                [1.0, 0.5]
              </text>

              {/* Arrows to neurons */}
              {[50, 100, 150].map((y) => (
                <g key={y}>
                  <line x1={85} y1={97} x2={145} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                  <text x={112} y={y < 100 ? 66 : y > 100 ? 135 : 90} fill={C.red} fontSize={9} textAnchor="middle">
                    [0,0]
                  </text>
                </g>
              ))}

              {/* 3 neurons */}
              {[
                { y: 50, label: "n1" },
                { y: 100, label: "n2" },
                { y: 150, label: "n3" },
              ].map(({ y, label }) => (
                <g key={label}>
                  <circle cx={170} cy={y} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={1.5} />
                  <text x={170} y={y - 4} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                    {label}
                  </text>
                  <text x={170} y={y + 12} fill={C.dim} fontSize={9} textAnchor="middle">
                    w=[0,0]
                  </text>
                </g>
              ))}

              {/* Arrows to outputs */}
              {[50, 100, 150].map((y) => (
                <line key={`out${y}`} x1={194} y1={y} x2={240} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              ))}

              {/* Outputs */}
              {[50, 100, 150].map((y) => (
                <g key={`oval${y}`}>
                  <rect
                    x={240}
                    y={y - 16}
                    width={55}
                    height={32}
                    rx={6}
                    fill={`${C.yellow}12`}
                    stroke={C.yellow}
                    strokeWidth={1}
                  />
                  <text x={267} y={y + 5} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>
                    0.0
                  </text>
                </g>
              ))}

              {/* Arrow to "identical" */}
              <line x1={295} y1={50} x2={335} y2={82} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <line x1={295} y1={100} x2={335} y2={95} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <line x1={295} y1={150} x2={335} y2={112} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text x={380} y={90} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                All
              </text>
              <text x={380} y={107} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                identical!
              </text>

              {/* Bottom */}
              <text x={220} y={195} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle">
                Same weights, same outputs, same gradients, stuck forever
              </text>
            </svg>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            This is called the "symmetry problem." Every neuron is a clone of every other. No matter how long you train,
            they will never differentiate.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Too Small - Numbers Shrink to Zero
          </T>
          <T color="#ffcc80" size={17} style={{ marginTop: 12 }}>
            If weights are initialized with very small random values (std = 0.001), the numbers flowing through the
            network shrink toward zero at every layer. Each layer multiplies the previous output by tiny weights, so the
            values get smaller and smaller.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
            {[
              { layer: "Input", values: "[1.0, 0.5]", mag: "1.0", bar: 100 },
              { layer: "After Layer 1", values: "[0.002, -0.001]", mag: "0.002", bar: 0.2 },
              { layer: "After Layer 3", values: "[~0.000004, ~0.000002]", mag: "0.000004", bar: 0 },
              { layer: "After Layer 5", values: "[~0, ~0]", mag: "~0", bar: 0 },
            ].map(({ layer, values, mag: _mag, bar }) => (
              <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px" }}>
                <T color="#ffcc80" size={13} style={{ minWidth: 100, textAlign: "right" }}>
                  {layer}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ width: `${Math.max(bar, 0.5)}%`, height: "100%", background: C.orange, borderRadius: 4 }}
                  />
                </div>
                <T color={C.dim} size={12} style={{ minWidth: 100, textAlign: "right" }}>
                  {values}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 12 }}>
            Each layer multiplies by tiny weights, shrinking the output exponentially. By layer 5-10, every value is
            effectively zero. Gradients also vanish - the network cannot learn. The network is "dead."
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Too Large - Numbers Explode
          </T>
          <T color="#ffcc80" size={17} style={{ marginTop: 12 }}>
            If weights are initialized with large random values (std = 5.0), the numbers flowing through the network
            grow uncontrollably at every layer. Each layer multiplies by large weights, so the values skyrocket.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
            {[
              { layer: "Input", values: "[1.0, 0.5]", bar: 0.01 },
              { layer: "After Layer 1", values: "[8.5, -12.3]", bar: 0.1 },
              { layer: "After Layer 3", values: "[~450, ~-820]", bar: 8 },
              { layer: "After Layer 5", values: "[~45000, ~-89000]", bar: 100 },
            ].map(({ layer, values, bar }) => (
              <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px" }}>
                <T color="#ffcc80" size={13} style={{ minWidth: 100, textAlign: "right" }}>
                  {layer}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ width: `${Math.min(bar, 100)}%`, height: "100%", background: C.red, borderRadius: 4 }}
                  />
                </div>
                <T color={C.dim} size={12} style={{ minWidth: 130, textAlign: "right" }}>
                  {values}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 12 }}>
            The values overflow, activations saturate, gradients explode, and training produces NaN within a few steps.
            The network is unstable from the very first forward pass.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Xavier/Glorot - The "Just Right" Scale
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            Scale random weights so the variance of the output matches the variance of the input. The key: divide by the
            square root of the number of inputs (fan_in).
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={18} style={{ fontFamily: "monospace" }}>
              std = sqrt(2 / (fan_in + fan_out))
            </T>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#80e8a5" bold size={15}>
              Example: a 512 to 512 layer
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>
                std = sqrt(2 / (512 + 512)) = sqrt(2 / 1024) = sqrt(0.00195) =
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: C.green,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                0.044
              </span>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            With this scale, the signal variance stays approximately 1.0 through many layers:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
            {[
              { layer: "Layer 1", var: "~1.0", bar: 100 },
              { layer: "Layer 3", var: "~0.98", bar: 98 },
              { layer: "Layer 5", var: "~0.95", bar: 95 },
              { layer: "Layer 10", var: "~0.90", bar: 90 },
            ].map(({ layer, var: v, bar }) => (
              <div key={layer} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px" }}>
                <T color="#80e8a5" size={13} style={{ minWidth: 70, textAlign: "right" }}>
                  {layer}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: `${bar}%`, height: "100%", background: C.green, borderRadius: 4 }} />
                </div>
                <T color={C.green} bold size={13} style={{ minWidth: 50, textAlign: "right" }}>
                  {v}
                </T>
              </div>
            ))}
          </div>
          <T color="#80e8a5" size={15} style={{ marginTop: 10 }}>
            Stable signal - no vanishing, no exploding. Named after Xavier Glorot, who proved this mathematically in
            2010.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            He Initialization - Designed for ReLU
          </T>
          <T color="#b8a9ff" size={17} style={{ marginTop: 12 }}>
            ReLU sets all negative values to zero, which kills roughly half the neurons' outputs. This halves the
            variance at each layer. To compensate, multiply Xavier's scale by sqrt(2).
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.purple}25`,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold size={18} style={{ fontFamily: "monospace" }}>
              std = sqrt(2 / fan_in)
            </T>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.purple}08`,
              border: `1px solid ${C.purple}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#b8a9ff" bold size={15}>
              Example: a layer with 512 inputs
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 14 }}>std = sqrt(2 / 512) = sqrt(0.00391) =</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.purple}15`,
                  borderRadius: 4,
                  color: "#b8a9ff",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                0.0625
              </span>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Compare Xavier: 0.044. He is about 42% larger to compensate for ReLU's halving.
            </T>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ef9a9a" bold size={14} center>
                Xavier + ReLU
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 6 }}>
                {[
                  { l: "L1", v: "1.0", b: 100 },
                  { l: "L5", v: "0.5", b: 50 },
                  { l: "L10", v: "0.25", b: 25 },
                ].map(({ l, v, b }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <T color={C.dim} size={11} style={{ minWidth: 22 }}>
                      {l}
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ width: `${b}%`, height: "100%", background: C.red, borderRadius: 3 }} />
                    </div>
                    <T color={C.dim} size={11} style={{ minWidth: 26, textAlign: "right" }}>
                      {v}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.red} size={12} style={{ marginTop: 4 }}>
                Variance shrinks - signal fades
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T color="#80e8a5" bold size={14} center>
                He + ReLU
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 6 }}>
                {[
                  { l: "L1", v: "1.0", b: 100 },
                  { l: "L5", v: "0.98", b: 98 },
                  { l: "L10", v: "0.95", b: 95 },
                ].map(({ l, v, b }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <T color={C.dim} size={11} style={{ minWidth: 22 }}>
                      {l}
                    </T>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ width: `${b}%`, height: "100%", background: C.green, borderRadius: 3 }} />
                    </div>
                    <T color={C.dim} size={11} style={{ minWidth: 26, textAlign: "right" }}>
                      {v}
                    </T>
                  </div>
                ))}
              </div>
              <T color={C.green} size={12} style={{ marginTop: 4 }}>
                Variance stable - signal preserved
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.purple}25`,
              marginTop: 14,
            }}
          >
            <T color="#b8a9ff" size={16}>
              Named after Kaiming He (2015). Most modern networks with ReLU activations use He initialization.
              Transformers often use a variant scaled by 1/sqrt(depth) for the residual connections.
            </T>
          </div>
        </Box>
      </Reveal>

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
