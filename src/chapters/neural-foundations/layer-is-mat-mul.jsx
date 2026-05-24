import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function LayerIsMatMul(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Connecting the Dots
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            You have already seen everything. A neural network layer is just a matrix multiplication.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 12 }}>
            Let us connect the dots.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            A Layer Has Many Neurons
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>
            If a layer has 3 neurons, you compute 3 separate dot products. Each neuron has its own weights. Stack them
            as matrix rows - now you have a matrix.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <svg viewBox="0 0 380 340" style={{ display: "block", width: "100%", maxWidth: 380 }}>
              <desc>
                Neural network layer with 3 inputs fully connected to 3 neurons with labeled weights and output scores,
                demonstrating that a layer is matrix multiplication
              </desc>
              {/* Column labels */}
              <text x={65} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                Inputs
              </text>
              <text x={290} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                Neurons (Layer)
              </text>

              {/* 9 edges with weight labels near destination (t=0.8) */}
              {[
                { sy: 50, dy: 50, w: "0.6", c: C.red },
                { sy: 160, dy: 50, w: "0.3", c: C.yellow },
                { sy: 270, dy: 50, w: "0.1", c: C.green },
                { sy: 50, dy: 160, w: "0.2", c: C.red },
                { sy: 160, dy: 160, w: "0.8", c: C.yellow },
                { sy: 270, dy: 160, w: "0.5", c: C.green },
                { sy: 50, dy: 270, w: "0.4", c: C.red },
                { sy: 160, dy: 270, w: "0.1", c: C.yellow },
                { sy: 270, dy: 270, w: "0.9", c: C.green },
              ].map(({ sy, dy, w, c }, i) => {
                const x1 = 91,
                  x2 = 262,
                  t = 0.8;
                const lx = x1 + (x2 - x1) * t;
                const ly = sy + (dy - sy) * t;
                return (
                  <g key={i}>
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

              {/* Input nodes */}
              {[
                { y: 50, label: "fever", val: "38.5", c: C.red },
                { y: 160, label: "cough", val: "1", c: C.yellow },
                { y: 270, label: "fatigue", val: "0.8", c: C.green },
              ].map(({ y, label, val, c }) => (
                <g key={label}>
                  <circle cx={65} cy={y} r={26} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text
                    x={65}
                    y={y - 5}
                    fill={c}
                    fontSize={10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight={700}
                  >
                    {label}
                  </text>
                  <text
                    x={65}
                    y={y + 9}
                    fill="rgba(255,255,255,0.5)"
                    fontSize={12}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {val}
                  </text>
                </g>
              ))}

              {/* Neuron nodes */}
              {[
                { y: 50, label: "Flu", out: "23.5", c: C.red, ct: "#ef9a9a" },
                { y: 160, label: "Cold", out: "8.9", c: C.orange, ct: "#ffcc80" },
                { y: 270, label: "Allergy", out: "16.2", c: C.purple, ct: "#b8a9ff" },
              ].map(({ y, label, out, c, ct }) => (
                <g key={label}>
                  <circle cx={290} cy={y} r={28} fill={`${c}12`} stroke={c} strokeWidth={2} />
                  <text
                    x={290}
                    y={y - 5}
                    fill={c}
                    fontSize={11}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight={700}
                  >
                    {label}
                  </text>
                  <text
                    x={290}
                    y={y + 9}
                    fill="rgba(255,255,255,0.5)"
                    fontSize={10}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {out}
                  </text>
                  <text
                    x={332}
                    y={y}
                    fill={ct}
                    fontSize={11}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontWeight={700}
                  >
                    → {out}
                  </text>
                </g>
              ))}

              {/* Bottom label */}
              <text x={190} y={328} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                3 inputs × 3 neurons = matrix multiplication
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            From <ChapterLink to="1.2">Chapter 1.2</ChapterLink>: A Neuron Sums Weighted Inputs
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
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.purple} bold size={14}>
                neuron_output
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.6
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.yellow}15`,
                  borderRadius: 4,
                  color: "#ffe082",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.3
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.purple}15`,
                  borderRadius: 4,
                  color: "#b8a9ff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.red}15`,
                  borderRadius: 4,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.1
              </span>
            </div>
          </div>
          <T size={15} color="#b8a9ff" style={{ marginTop: 12 }}>
            This is a dot product of inputs and weights.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            The Big Picture
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ffe082">
                Neuron
              </T>
              <T size={14} color={C.dim}>
                One dot product (inputs × one weight row)
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ffe082">
                Layer
              </T>
              <T size={14} color={C.dim}>
                Many neurons = many rows = many dot products = matrix multiplication
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ffe082">
                Neural Network
              </T>
              <T size={14} color={C.dim}>
                Stack layers, chain matrix multiplications, apply activation functions
              </T>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 14, textAlign: "center" }}>
            Matrix multiplication is the heartbeat of deep learning.
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
