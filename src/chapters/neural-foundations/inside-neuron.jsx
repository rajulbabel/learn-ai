import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function InsideNeuron(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20} style={{ marginBottom: 16 }}>
            One Neuron, Three Steps
          </T>
          <T color={C.bright} bold size={18}>
            A neuron is the basic building block.
          </T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            It takes a few numbers in and produces one number out. Think of it as a tiny decision-maker that weighs
            different pieces of evidence.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <svg viewBox="0 0 480 220" style={{ display: "block", width: "100%", maxWidth: 480 }}>
              <desc>
                Single neuron diagram showing 3 weighted inputs feeding into one neuron that produces a single output
                value
              </desc>
              {/* Column labels */}
              <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                Inputs
              </text>
              <text x={240} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                Neuron
              </text>
              <text x={410} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle" fontWeight={600}>
                Output
              </text>

              {/* Edges with weight labels (t=0.8 near destination) */}
              {[
                { sy: 45, w: "0.6", c: C.red },
                { sy: 110, w: "0.3", c: C.yellow },
                { sy: 175, w: "0.1", c: C.green },
              ].map(({ sy, w, c }, i) => {
                const x1 = 92,
                  x2 = 210,
                  dy = 110,
                  t = 0.8;
                const lx = x1 + (x2 - x1) * t;
                const ly = sy + (dy - sy) * t;
                return (
                  <g key={i}>
                    <line x1={x1} y1={sy} x2={x2} y2={dy} stroke={`${c}40`} strokeWidth={1.5} />
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

              {/* Input nodes - r=22, spaced at y=45, 110, 175 (65px apart) */}
              <circle cx={70} cy={45} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
              <text x={70} y={50} fill={C.red} fontSize={14} textAnchor="middle" fontWeight={700}>
                i₁
              </text>

              <circle cx={70} cy={110} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
              <text x={70} y={115} fill={C.yellow} fontSize={14} textAnchor="middle" fontWeight={700}>
                i₂
              </text>

              <circle cx={70} cy={175} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={70} y={180} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                i₃
              </text>

              {/* Central neuron - centered at y=110 */}
              <circle cx={240} cy={110} r={30} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
              <text x={240} y={115} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>
                Neuron
              </text>

              {/* Edge to output */}
              <line x1={270} y1={110} x2={384} y2={110} stroke={`${C.cyan}50`} strokeWidth={1.5} />
              <polygon points="384,110 378,106 378,114" fill={`${C.cyan}50`} />

              {/* Output node - centered at y=110 */}
              <circle cx={410} cy={110} r={26} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
              <text x={410} y={115} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                out
              </text>

              {/* Bottom label */}
              <text x={240} y={215} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                3 inputs → 1 neuron → 1 output
              </text>
            </svg>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.red} style={{ width: "100%" }}>
            <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>
              Example: Detecting Flu from Symptoms
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 0 }}>
              <div
                style={{
                  padding: 14,
                  background: `${C.red}06`,
                  border: `1px solid ${C.red}20`,
                  borderRadius: 8,
                  fontFamily: "monospace",
                }}
              >
                <T color={C.red} bold size={15}>
                  Input 1: fever = 38.5°C
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  weight: 0.6 (very important)
                </T>
              </div>
              <div
                style={{
                  padding: 14,
                  background: `${C.green}06`,
                  border: `1px solid ${C.green}20`,
                  borderRadius: 8,
                  fontFamily: "monospace",
                }}
              >
                <T color={C.green} bold size={15}>
                  Input 2: cough = 1 (yes)
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  weight: 0.3 (somewhat important)
                </T>
              </div>
              <div
                style={{
                  padding: 14,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}20`,
                  borderRadius: 8,
                  fontFamily: "monospace",
                }}
              >
                <T color={C.yellow} bold size={15}>
                  Input 3: fatigue = 0.8
                </T>
                <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                  weight: 0.1 (less important)
                </T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>
              The Step-by-Step Math
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 0 }}>
              <div style={{ padding: 14, background: `${C.red}06`, border: `1px solid ${C.red}20`, borderRadius: 8 }}>
                <T color={C.red} bold size={15}>
                  Step 1: Multiply each input by its weight
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { label: "fever", iv: "38.5", wv: "0.6", r: "23.10" },
                    { label: "cough", iv: "1.0", wv: "0.3", r: "0.30" },
                    { label: "fatigue", iv: "0.8", wv: "0.1", r: "0.08" },
                  ].map(({ label, iv, wv, r }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: C.dim, fontSize: 13, minWidth: 52 }}>{label}:</span>
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
                          background: `${C.cyan}15`,
                          borderRadius: 4,
                          color: C.cyan,
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
                style={{ padding: 14, background: `${C.yellow}06`, border: `1px solid ${C.yellow}20`, borderRadius: 8 }}
              >
                <T color={C.yellow} bold size={15}>
                  Step 2: Sum them up
                </T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {["23.10", "0.30", "0.08"].map((v, i) => (
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
                      background: `${C.yellow}20`,
                      borderRadius: 4,
                      color: C.yellow,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    23.48
                  </span>
                </div>
              </div>
              <div style={{ padding: 14, background: `${C.cyan}06`, border: `1px solid ${C.cyan}20`, borderRadius: 8 }}>
                <T color={C.cyan} bold size={15}>
                  Step 3: Add a bias (a fixed number added every time)
                </T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
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
                    23.48
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
                    (-14.0)
                  </span>
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
                    9.48
                  </span>
                </div>
                <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 4 }}>
                  The bias shifts the result up or down - you will learn more about it in{" "}
                  <ChapterLink to="1.4">chapter 1.4</ChapterLink>
                </T>
              </div>
              <div
                style={{ padding: 14, background: `${C.green}06`, border: `1px solid ${C.green}20`, borderRadius: 8 }}
              >
                <T color={C.green} bold size={15}>
                  Step 4: Apply a rule - if negative, output 0; if positive, keep it
                </T>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
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
                    9.48
                  </span>
                  <span style={{ color: C.dim, fontSize: 14 }}>is positive → keep →</span>
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
                    9.48
                  </span>
                </div>
                <T color="rgba(255,255,255,0.5)" size={13} style={{ marginTop: 4 }}>
                  This rule has a name (activation function) - you'll meet it in{" "}
                  <ChapterLink to="1.6">chapter 1.6</ChapterLink>
                </T>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: 14, background: C.green, borderRadius: 8, textAlign: "center" }}>
              <T color="#000" bold size={16}>
                Output: 9.48 → HIGH flu risk
              </T>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ letterSpacing: 1 }}>
              THE NEURON FORMULA
            </T>
            <div
              style={{
                marginTop: 18,
                padding: 14,
                background: "rgba(0,0,0,0.4)",
                borderRadius: 8,
                border: `1px solid ${C.yellow}25`,
                fontFamily: "monospace",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              <div style={{ color: C.bright }}>
                output = <span style={{ color: C.orange }}>activation</span>({" "}
                <span style={{ color: C.cyan }}>&Sigma;</span>(<span style={{ color: C.red }}>input</span>{" "}
                <span style={{ color: "rgba(255,255,255,0.4)" }}>&times;</span>{" "}
                <span style={{ color: C.yellow }}>weight</span>) + <span style={{ color: C.purple }}>bias</span> )
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.red,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.bright,
                    minWidth: 60,
                  }}
                >
                  input
                </div>
                <T color="#ffe082" size={16}>
                  values coming in (symptoms, pixels, words...)
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.yellow,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000",
                    minWidth: 60,
                  }}
                >
                  weight
                </div>
                <T color="#ffe082" size={16}>
                  how important each input is (learned during training)
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.cyan,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000",
                    minWidth: 60,
                  }}
                >
                  Σ
                </div>
                <T color="#ffe082" size={16}>
                  sum all (input × weight) pairs
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.purple,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.bright,
                    minWidth: 60,
                  }}
                >
                  bias
                </div>
                <T color="#ffe082" size={16}>
                  a fixed number added to shift the result (learned during training)
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.orange,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000",
                    minWidth: 60,
                  }}
                >
                  activation
                </div>
                <T color="#ffe082" size={16}>
                  a simple rule applied at the end (explained in <ChapterLink to="1.6">chapter 1.6</ChapterLink>)
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    background: C.green,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000",
                    minWidth: 60,
                  }}
                >
                  output
                </div>
                <T color="#ffe082" size={16}>
                  this neuron's final value
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
              That's All a Neuron Does
            </T>
            <T color={C.bright} size={17} style={{ lineHeight: 1.6 }}>
              Every neuron in every AI - from ChatGPT to image generators - does this exact same thing: multiply, sum,
              add bias, activate.
            </T>
            <T color={C.green} size={17} style={{ marginTop: 16, fontWeight: 600 }}>
              The magic is in the WEIGHTS - the network learns the right ones during training.
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
