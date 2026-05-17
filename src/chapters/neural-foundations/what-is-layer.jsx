import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhatIsLayer(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>
            A Group of Neurons Working Together
          </T>
          <T color={C.bright} bold size={18}>
            One neuron finds one pattern.
          </T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            But to understand something complex, you need to detect many patterns at the same time. A layer is a group
            of neurons working side by side.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 520 260" style={{ display: "block", width: "100%", maxWidth: 520 }}>
              <desc>
                Neural network layer with 3 inputs connected to 3 neurons producing output scores, showing how a layer
                processes all inputs simultaneously
              </desc>
              {/* Column labels */}
              <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Inputs
              </text>
              <text x={260} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Layer (3 neurons)
              </text>
              <text x={450} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                Outputs
              </text>

              {/* Edges input→layer (behind nodes, all 9 connections) */}
              <line x1={94} y1={70} x2={236} y2={70} stroke={`${C.red}40`} strokeWidth={1.5} />
              <line x1={94} y1={70} x2={236} y2={130} stroke={`${C.red}25`} strokeWidth={1.5} />
              <line x1={94} y1={70} x2={236} y2={190} stroke={`${C.red}20`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={70} stroke={`${C.yellow}25`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={130} stroke={`${C.yellow}40`} strokeWidth={1.5} />
              <line x1={94} y1={130} x2={236} y2={190} stroke={`${C.yellow}25`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={70} stroke={`${C.green}20`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={130} stroke={`${C.green}25`} strokeWidth={1.5} />
              <line x1={94} y1={190} x2={236} y2={190} stroke={`${C.green}40`} strokeWidth={1.5} />

              {/* Edges layer→output (1:1 mapping) */}
              <line x1={284} y1={70} x2={426} y2={70} stroke={`${C.red}40`} strokeWidth={1.5} />
              <line x1={284} y1={130} x2={426} y2={130} stroke={`${C.yellow}40`} strokeWidth={1.5} />
              <line x1={284} y1={190} x2={426} y2={190} stroke={`${C.purple}40`} strokeWidth={1.5} />

              {/* Input neurons - y=70, 130, 190 */}
              <circle cx={70} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={70} y={75} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                fever
              </text>

              <circle cx={70} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={70} y={135} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>
                cough
              </text>

              <circle cx={70} cy={190} r={24} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={70} y={195} fill={C.green} fontSize={12} textAnchor="middle" fontWeight={700}>
                fatigue
              </text>

              {/* Layer dashed box */}
              <rect
                x={170}
                y={34}
                width={180}
                height={190}
                fill="none"
                stroke={`${C.purple}30`}
                strokeWidth={2}
                strokeDasharray="5,5"
                rx={8}
              />

              {/* Layer neurons - y=70, 130, 190 matching inputs */}
              <circle cx={260} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={260} y={75} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                Flu
              </text>

              <circle cx={260} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={260} y={135} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>
                Cold
              </text>

              <circle cx={260} cy={190} r={24} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
              <text x={260} y={195} fill="#d8a9ff" fontSize={12} textAnchor="middle" fontWeight={700}>
                Allergy
              </text>

              {/* Output neurons - same y positions */}
              <circle cx={450} cy={70} r={24} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={450} y={75} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>
                9.48
              </text>

              <circle cx={450} cy={130} r={24} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={450} y={135} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>
                3.51
              </text>

              <circle cx={450} cy={190} r={24} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
              <text x={450} y={195} fill="#d8a9ff" fontSize={13} textAnchor="middle" fontWeight={700}>
                0.26
              </text>

              {/* Bottom label */}
              <text x={260} y={248} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">
                Each neuron looks at all inputs but with different weights
              </text>
            </svg>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color="#b8a9ff" bold center size={20} style={{ marginBottom: 8 }}>
              Three Neurons, Same Inputs, Different Weights
            </T>
            <T color="#b8a9ff" size={16} style={{ marginBottom: 12, lineHeight: 1.6 }}>
              Each neuron gets all 3 inputs but has its own weights. The weights determine what each neuron "cares
              about."
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 380 340" style={{ display: "block", width: "100%", maxWidth: 380 }}>
                <desc>
                  Detailed weight connection diagram showing 3 inputs mapped to 3 neurons with 9 individually labeled
                  weights
                </desc>
                {/* Column labels */}
                <text x={65} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                  Inputs
                </text>
                <text x={290} y={16} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                  Neurons
                </text>

                {/* 9 edges with weight labels near destination (t=0.8) */}
                {[
                  { sy: 50, dy: 50, w: "0.6", c: C.red },
                  { sy: 160, dy: 50, w: "0.3", c: C.yellow },
                  { sy: 270, dy: 50, w: "0.1", c: C.green },
                  { sy: 50, dy: 160, w: "0.1", c: C.red },
                  { sy: 160, dy: 160, w: "0.5", c: C.yellow },
                  { sy: 270, dy: 160, w: "0.2", c: C.green },
                  { sy: 50, dy: 270, w: "0.0", c: C.red },
                  { sy: 160, dy: 270, w: "0.2", c: C.yellow },
                  { sy: 270, dy: 270, w: "0.7", c: C.green },
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
                  { y: 50, label: "Fever", val: "38.5", c: C.red },
                  { y: 160, label: "Cough", val: "1", c: C.yellow },
                  { y: 270, label: "Fatigue", val: "0.8", c: C.green },
                ].map(({ y, label, val, c }) => (
                  <g key={label}>
                    <circle cx={65} cy={y} r={26} fill={`${c}12`} stroke={c} strokeWidth={2} />
                    <text x={65} y={y - 2} fill={c} fontSize={10} textAnchor="middle" fontWeight={700}>
                      {label}
                    </text>
                    <text x={65} y={y + 13} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">
                      {val}
                    </text>
                  </g>
                ))}

                {/* Neuron nodes with bias */}
                {[
                  { y: 50, label: "Flu", bias: "-14", out: "9.48", c: C.red, ct: "#ef9a9a" },
                  { y: 160, label: "Cold", bias: "-1", out: "3.51", c: C.orange, ct: "#ffcc80" },
                  { y: 270, label: "Allergy", bias: "-0.5", out: "0.26", c: C.purple, ct: "#b8a9ff" },
                ].map(({ y, label, bias, out, c, ct }) => (
                  <g key={label}>
                    <circle cx={290} cy={y} r={28} fill={`${c}12`} stroke={c} strokeWidth={2} />
                    <text x={290} y={y - 3} fill={c} fontSize={11} textAnchor="middle" fontWeight={700}>
                      {label}
                    </text>
                    <text x={290} y={y + 11} fill="rgba(255,255,255,0.45)" fontSize={9} textAnchor="middle">
                      b={bias}
                    </text>
                    <text x={332} y={y + 4} fill={ct} fontSize={11} textAnchor="start" fontWeight={700}>
                      → {out}
                    </text>
                  </g>
                ))}

                {/* Bottom insight */}
                <text x={190} y={328} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">
                  Flu cares about fever (0.6) | Allergy focuses on fatigue (0.7)
                </text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>
              The Output of a Layer is a List
            </T>
            <T color="#ffe082" size={17} style={{ lineHeight: 1.6 }}>
              One number from each neuron. The input is a list. The output is also a list. A layer transforms one list
              of numbers into a different list of numbers.
            </T>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}12`,
                  borderRadius: 8,
                }}
              >
                <T color={C.red} bold size={14}>
                  Input
                </T>
                <T color="#ef9a9a" size={16} style={{ fontFamily: "monospace", marginTop: 4 }}>
                  [38.5, 1, 0.8]
                </T>
              </div>
              <T color={C.dim} bold size={20}>
                →
              </T>
              <div
                style={{
                  padding: "10px 14px",
                  background: `${C.cyan}06`,
                  border: `1px solid ${C.cyan}12`,
                  borderRadius: 8,
                }}
              >
                <T color={C.cyan} bold size={14}>
                  Layer
                </T>
                <T color="#80deea" size={14} style={{ marginTop: 4 }}>
                  3 neurons process
                </T>
              </div>
              <T color={C.dim} bold size={20}>
                →
              </T>
              <div
                style={{
                  padding: "10px 14px",
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}12`,
                  borderRadius: 8,
                }}
              >
                <T color={C.green} bold size={14}>
                  Output
                </T>
                <T color="#80e8a5" size={16} style={{ fontFamily: "monospace", marginTop: 4 }}>
                  [9.48, 3.51, 0.26]
                </T>
              </div>
            </div>
            <T color="#ffe082" size={16} style={{ marginTop: 14, textAlign: "center", lineHeight: 1.6 }}>
              The highest number wins - <span style={{ color: "#ef9a9a", fontWeight: 700 }}>Flu (9.48)</span> scores
              highest, so the network predicts <span style={{ color: "#ef9a9a", fontWeight: 700 }}>Flu</span>.
            </T>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              Stacking Layers
            </T>
            <T color={C.orange} size={17} style={{ marginBottom: 18, lineHeight: 1.6 }}>
              The output of Layer 1 becomes the input to Layer 2. Each layer builds on what the previous one found.
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Input", val: "[38.5, 1, 0.8]", c: C.red, ct: "#ef9a9a" },
                { label: "Layer 1", val: "[9.48, 3.51, 0.26]", c: C.cyan, ct: "#80deea" },
                { label: "Layer 2", val: "[0.91]", c: C.purple, ct: "#b8a9ff" },
                { label: "Result", val: "91% flu", c: C.green, ct: "#000", solid: true },
              ].map(({ label, val, c, ct, solid }, i) => (
                <div key={label} style={{ display: "contents" }}>
                  {i > 0 && (
                    <T color={C.dim} bold size={20}>
                      →
                    </T>
                  )}
                  <div
                    style={{
                      padding: "8px 12px",
                      background: solid ? c : `${c}06`,
                      border: solid ? "none" : `1px solid ${c}12`,
                      borderRadius: 8,
                      textAlign: "center",
                    }}
                  >
                    <T color={solid ? ct : c} bold size={13}>
                      {label}
                    </T>
                    <div
                      style={{
                        marginTop: 3,
                        fontFamily: "monospace",
                        fontSize: 14,
                        color: solid ? ct : ct,
                        fontWeight: solid ? 700 : 400,
                      }}
                    >
                      {val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>
              What is a Layer Physically?
            </T>
            <T color="#80deea" size={17} style={{ lineHeight: 1.6 }}>
              It's not something you can touch. It's a group of math operations that happen at the same time. On modern
              GPUs, thousands of neurons compute simultaneously. A layer is just how we organize and think about these
              parallel computations.
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
