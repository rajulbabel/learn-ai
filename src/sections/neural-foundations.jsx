import { C } from "../config.js";
import { Box, T, Reveal, SubBtn } from "../components.jsx";

// Graph helper - extracted for testability
export const Graph = ({
  points,
  color,
  width = 300,
  height = 140,
  xLabel = "",
  yLabel = "",
  title = "",
  desc = "",
  annotations = [],
}) => {
  const pad = { l: 36, r: 12, t: 24, b: 32 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const scaleX = (x) => pad.l + ((x - minX) / (maxX - minX || 1)) * w;
  const scaleY = (y) => pad.t + h - ((y - minY) / (maxY - minY || 1)) * h;
  const polyline = points.map((p) => `${scaleX(p[0])},${scaleY(p[1])}`).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {desc && <desc>{desc}</desc>}
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1={pad.l} y1={pad.t + h} x2={pad.l + w} y2={pad.t + h} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {minY < 0 && maxY > 0 && (
        <line
          x1={pad.l}
          y1={scaleY(0)}
          x2={pad.l + w}
          y2={scaleY(0)}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      )}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={scaleX(p[0])} cy={scaleY(p[1])} r="3.5" fill={color} />
      ))}
      {xLabel && (
        <text x={pad.l + w / 2} y={height - 2} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={4}
          y={pad.t + h / 2}
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          textAnchor="middle"
          transform={`rotate(-90, 4, ${pad.t + h / 2})`}
        >
          {yLabel}
        </text>
      )}
      {title && (
        <text x={pad.l + w / 2} y={18} fill={color} fontSize="11" textAnchor="middle" fontWeight="700">
          {title}
        </text>
      )}
      {points
        .filter((_, i) => i % (points.length > 10 ? 2 : 1) === 0)
        .map((p, i) => (
          <text
            key={`x${i}`}
            x={scaleX(p[0])}
            y={pad.t + h + 16}
            fill="rgba(255,255,255,0.4)"
            fontSize="9"
            textAnchor="middle"
          >
            {p[0]}
          </text>
        ))}
      {annotations.map(({ x, y, text: t, color: ac }, i) => (
        <g key={`a${i}`}>
          <circle cx={scaleX(x)} cy={scaleY(y)} r="6" fill="none" stroke={ac || C.yellow} strokeWidth="1.5" />
          <text x={scaleX(x) + 10} y={scaleY(y) - 8} fill={ac || C.yellow} fontSize="9" fontWeight="600">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const WhatIsNN = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            Pattern Recognition Machines
          </T>
          <div style={{ marginTop: 20 }}>
            <T color="#80deea" bold size={18}>
              You've used AI - ChatGPT, image generators, voice assistants.
            </T>
            <T color="#80deea" size={16} style={{ marginTop: 12 }}>
              But what's actually happening inside?
            </T>
            <T color="#80deea" size={17} style={{ marginTop: 16, lineHeight: 1.6 }}>
              A neural network is a computer program that learns patterns from examples. Not magic, not a brain - just
              math that adjusts itself.
            </T>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 20 }}>
              Example: Spam Detection
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 0, justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    background: `${C.red}06`,
                    border: `1px solid ${C.red}20`,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <T color={C.red} bold size={15}>
                    word count
                  </T>
                  <T color={C.red} size={16} style={{ marginTop: 4, fontWeight: 600 }}>
                    152
                  </T>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    background: `${C.green}06`,
                    border: `1px solid ${C.green}20`,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} bold size={15}>
                    has 'free'
                  </T>
                  <T color={C.green} size={16} style={{ marginTop: 4, fontWeight: 600 }}>
                    yes
                  </T>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    background: `${C.yellow}06`,
                    border: `1px solid ${C.yellow}20`,
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <T color={C.yellow} bold size={15}>
                    links
                  </T>
                  <T color={C.yellow} size={16} style={{ marginTop: 4, fontWeight: 600 }}>
                    12
                  </T>
                </div>
              </div>
              <div style={{ fontSize: 20, color: "#b8a9ff", fontWeight: 600 }}>→</div>
              <div
                style={{
                  padding: 16,
                  background: `${C.purple}06`,
                  borderRadius: 8,
                  border: `1px solid ${C.purple}20`,
                  textAlign: "center",
                  minWidth: 140,
                }}
              >
                <T color={C.purple} bold size={14}>
                  Neural Network
                </T>
                <T color="#b8a9ff" size={13} style={{ marginTop: 6 }}>
                  (math)
                </T>
              </div>
              <div style={{ fontSize: 20, color: "#b8a9ff", fontWeight: 600 }}>→</div>
              <div style={{ padding: 14, background: C.red, borderRadius: 8, textAlign: "center", minWidth: 120 }}>
                <T color={C.bright} bold size={17}>
                  92%
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                  Spam
                </T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 20 }}>
              Two Ways to Make Rules
            </T>
            <div style={{ display: "flex", gap: 16, marginTop: 0 }}>
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  background: `${C.orange}06`,
                  borderRadius: 8,
                  border: `1px solid ${C.orange}20`,
                }}
              >
                <T color={C.orange} bold size={16}>
                  Traditional Programming
                </T>
                <T color="#ffe082" size={15} style={{ marginTop: 12, lineHeight: 1.6 }}>
                  Human writes rules: if email contains 'free' and has more than 5 links then mark as spam.
                </T>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 16,
                  background: `${C.green}06`,
                  borderRadius: 8,
                  border: `1px solid ${C.green}20`,
                }}
              >
                <T color={C.green} bold size={16}>
                  Neural Network
                </T>
                <T color="#80e8a5" size={15} style={{ marginTop: 12, lineHeight: 1.6 }}>
                  Human provides examples (thousands of emails labeled spam/not-spam), the network discovers the rules
                  itself.
                </T>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              What's Inside?
            </T>
            <T color="#ffcc80" size={17} style={{ lineHeight: 1.6 }}>
              It's made of tiny units called neurons connected together. Each connection has a number called a weight.
              These weights are what the network learns during training.
            </T>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
              <svg viewBox="0 0 500 260" style={{ display: "block", width: "100%", maxWidth: 500 }}>
                <desc>
                  Three-layer neural network with input neurons x1 x2 x3, hidden layer h1 h2 h3, and output neurons o1
                  o2, showing fully connected weighted edges between layers
                </desc>
                {/* Column labels */}
                <text x={70} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                  Input
                </text>
                <text x={250} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                  Hidden Layer
                </text>
                <text x={430} y={18} fill="rgba(255,255,255,0.4)" fontSize={12} textAnchor="middle" fontWeight={600}>
                  Output
                </text>

                {/* Edges FIRST (behind nodes) */}
                {/* Input→Hidden: every input to every hidden (fully connected) */}
                {[60, 120, 180].map((iy) =>
                  [60, 120, 180].map((hy) => (
                    <line
                      key={`i${iy}h${hy}`}
                      x1={94}
                      y1={iy}
                      x2={226}
                      y2={hy}
                      stroke={`${iy === 60 ? C.red : iy === 120 ? C.yellow : C.green}${Math.abs(iy - hy) < 10 ? "50" : "25"}`}
                      strokeWidth={1.5}
                    />
                  )),
                )}
                {/* Hidden→Output */}
                {[60, 120, 180].map((hy) =>
                  [90, 150].map((oy) => (
                    <line
                      key={`h${hy}o${oy}`}
                      x1={274}
                      y1={hy}
                      x2={406}
                      y2={oy}
                      stroke={`${C.cyan}${Math.abs(hy - oy) < 40 ? "50" : "25"}`}
                      strokeWidth={1.5}
                    />
                  )),
                )}

                {/* Input neurons - y=60, 120, 180 (r=22, 60px apart = no touching) */}
                <circle cx={70} cy={60} r={22} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} />
                <text x={70} y={65} fill={C.red} fontSize={13} textAnchor="middle" fontWeight={700}>
                  x₁
                </text>

                <circle cx={70} cy={120} r={22} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth={2} />
                <text x={70} y={125} fill={C.yellow} fontSize={13} textAnchor="middle" fontWeight={700}>
                  x₂
                </text>

                <circle cx={70} cy={180} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={70} y={185} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>
                  x₃
                </text>

                {/* Hidden layer dashed box - well around the hidden nodes */}
                <rect
                  x={180}
                  y={30}
                  width={140}
                  height={180}
                  fill="none"
                  stroke={`${C.cyan}30`}
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  rx={8}
                />

                {/* Hidden neurons */}
                <circle cx={250} cy={60} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={65} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>
                  h₁
                </text>

                <circle cx={250} cy={120} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={125} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>
                  h₂
                </text>

                <circle cx={250} cy={180} r={22} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
                <text x={250} y={185} fill={C.cyan} fontSize={13} textAnchor="middle" fontWeight={700}>
                  h₃
                </text>

                {/* Output neurons - y=90, 150 */}
                <circle cx={430} cy={90} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={430} y={95} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>
                  o₁
                </text>

                <circle cx={430} cy={150} r={22} fill={`${C.green}12`} stroke={C.green} strokeWidth={2} />
                <text x={430} y={155} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>
                  o₂
                </text>

                {/* Bottom label - well below all content */}
                <text x={250} y={250} fill="rgba(255,255,255,0.4)" fontSize={11} textAnchor="middle">
                  Every input connects to every hidden neuron
                </text>
              </svg>
            </div>
          </Box>
        </Reveal>
      )}
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

export const InsideNeuron = (ctx) => {
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
                  The bias shifts the result up or down - you will learn more about it in chapter 1.4
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
                  This rule has a name (activation function) - you'll meet it in chapter 1.6
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
                  a simple rule applied at the end (explained in chapter 1.6)
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
};

export const WhatIsLayer = (ctx) => {
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
};

export const WeightsBiases = (ctx) => {
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
};

export const WhyLinear = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20} style={{ marginBottom: 16 }}>
            Lines Can Only Do So Much
          </T>
          <T color={C.bright} bold size={18}>
            A neuron without activation does y = mx + b
          </T>
          <T color={C.bright} size={17} style={{ marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Strip away the activation and a neuron computes: output = (input × weight) + bias. m is the weight (slope),
            b is the bias (y-intercept).
          </T>
          <div
            style={{
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              border: `1px solid ${C.green}25`,
              marginTop: 8,
            }}
          >
            <div
              style={{ textAlign: "center", fontFamily: "monospace", fontSize: 18, color: C.green, fontWeight: 700 }}
            >
              y = mx + b
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: `${C.yellow}15`,
                    borderRadius: 6,
                    border: `1px solid ${C.yellow}25`,
                  }}
                >
                  <code style={{ color: C.yellow, fontSize: 14, fontWeight: 700 }}>m (slope)</code>
                </div>
                <T color="#ffe082" size={15}>
                  = the weight. Controls how steep the line is.
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: `${C.purple}15`,
                    borderRadius: 6,
                    border: `1px solid ${C.purple}25`,
                  }}
                >
                  <code style={{ color: C.purple, fontSize: 14, fontWeight: 700 }}>b (bias)</code>
                </div>
                <T color="#b8a9ff" size={15}>
                  = the bias. Shifts the line up or down.
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: `${C.red}15`,
                    borderRadius: 6,
                    border: `1px solid ${C.red}25`,
                  }}
                >
                  <code style={{ color: C.red, fontSize: 14, fontWeight: 700 }}>x (input)</code>
                </div>
                <T color="#ef9a9a" size={15}>
                  = the input value going in.
                </T>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: `${C.green}15`,
                    borderRadius: 6,
                    border: `1px solid ${C.green}25`,
                  }}
                >
                  <code style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>y (output)</code>
                </div>
                <T color="#80e8a5" size={15}>
                  = the output. Always a straight line.
                </T>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                padding: 10,
                background: `${C.red}06`,
                borderRadius: 6,
                border: `1px solid ${C.red}15`,
                textAlign: "center",
              }}
            >
              <T color="#ef9a9a" bold size={15}>
                Key problem: no matter what m and b are, this is ALWAYS a straight line.
              </T>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              Why is This a Problem? Real Patterns are Curved
            </T>
            <div style={{ display: "flex", gap: 14, marginTop: 0 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    padding: 12,
                    background: `${C.green}06`,
                    border: `1px solid ${C.green}20`,
                    borderRadius: 8,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <desc>Line graph of study hours vs grade showing a linear relationship</desc>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={25} y1={78} x2={118} y2={18} stroke={C.green} strokeWidth={2.5} />
                    <circle cx={25} cy={78} r={3} fill={C.green} />
                    <circle cx={118} cy={18} r={3} fill={C.green} />
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">
                      study hours
                    </text>
                    <text
                      x={8}
                      y={50}
                      fill="rgba(255,255,255,0.4)"
                      fontSize={9}
                      textAnchor="middle"
                      transform="rotate(-90,8,50)"
                    >
                      grade
                    </text>
                  </svg>
                </div>
                <T color={C.green} bold size={14} style={{ textAlign: "center" }}>
                  A straight line can model this ✓
                </T>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    padding: 12,
                    background: `${C.orange}06`,
                    border: `1px solid ${C.orange}20`,
                    borderRadius: 8,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <desc>
                      Curve graph of temperature vs growth showing a parabolic peak pattern that no straight line can
                      fit
                    </desc>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <path d="M 25 70 Q 70 12 118 70" fill="none" stroke={C.orange} strokeWidth={2.5} />
                    <circle cx={25} cy={70} r={3} fill={C.orange} />
                    <circle cx={70} cy={15} r={3} fill={C.orange} />
                    <circle cx={118} cy={70} r={3} fill={C.orange} />
                    <text x={70} y={9} fill={C.yellow} fontSize={9} fontWeight={600} textAnchor="middle">
                      peak
                    </text>
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">
                      temperature
                    </text>
                    <text
                      x={8}
                      y={50}
                      fill="rgba(255,255,255,0.4)"
                      fontSize={9}
                      textAnchor="middle"
                      transform="rotate(-90,8,50)"
                    >
                      growth
                    </text>
                  </svg>
                </div>
                <T color={C.orange} bold size={14} style={{ textAlign: "center" }}>
                  No straight line fits this curve ✗
                </T>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    padding: 12,
                    background: `${C.orange}06`,
                    border: `1px solid ${C.orange}20`,
                    borderRadius: 8,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  <svg width="100%" height={100} viewBox="0 0 140 100" style={{ display: "block" }}>
                    <desc>S-curve graph of drug dose vs effect showing a nonlinear response</desc>
                    <line x1={20} y1={85} x2={125} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={20} y1={10} x2={20} y2={85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <path
                      d="M 25 78 C 50 78 60 20 80 20 C 100 20 110 60 118 60"
                      fill="none"
                      stroke={C.orange}
                      strokeWidth={2.5}
                    />
                    <circle cx={25} cy={78} r={3} fill={C.orange} />
                    <circle cx={80} cy={20} r={3} fill={C.orange} />
                    <circle cx={118} cy={60} r={3} fill={C.orange} />
                    <text x={72} y={98} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">
                      drug dose
                    </text>
                    <text
                      x={8}
                      y={50}
                      fill="rgba(255,255,255,0.4)"
                      fontSize={9}
                      textAnchor="middle"
                      transform="rotate(-90,8,50)"
                    >
                      effect
                    </text>
                  </svg>
                </div>
                <T color={C.orange} bold size={14} style={{ textAlign: "center" }}>
                  Or this S-curve ✗
                </T>
              </div>
            </div>
            <T color="#ffcc80" size={16} style={{ marginTop: 14, lineHeight: 1.7 }}>
              Think about real-world patterns. A 1500 sqft house costs more than 1000 sqft - that's roughly linear. But
              plant growth vs temperature? A plant grows faster as temperature rises from 10°C to 25°C, then STOPS
              growing and DIES above 40°C. No straight line can go up, peak, and then come down. Same with medicine
              dosage: 100mg helps, 200mg helps more, but 1000mg is toxic. These real patterns require curves that bend
              and change direction. A straight line always goes in one direction.
            </T>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>
              The Fatal Problem: Stacking Without Activation
            </T>
            <T color="#ffe082" size={16} style={{ marginBottom: 12 }}>
              Maybe adding more layers helps?
            </T>
            <div
              style={{
                padding: 14,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 15,
                color: "#ffe082",
                lineHeight: 1.9,
                textAlign: "center",
              }}
            >
              <div>Layer 1: output₁ = input × 3 + 1</div>
              <div>Layer 2: output₂ = output₁ × 2 + 5</div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 10 }}>Substitute:</div>
              <div>output₂ = (input × 3 + 1) × 2 + 5</div>
              <div style={{ color: "#ffe082", fontWeight: 600, marginTop: 6 }}>=&gt; output₂ = input × 6 + 7</div>
            </div>
            <div
              style={{
                marginTop: 14,
                padding: 14,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Still just y = 6x + 7. A straight line!
              </T>
              <T color="#ffe082" size={15} style={{ marginTop: 10 }}>
                No matter how many layers: 2 layers, 10 layers, 100 layers - without activation they all collapse into
                one straight line. 100 layers = 1 layer.
              </T>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.green} style={{ width: "100%" }}>
            <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>
              What We Need: a BEND in the Line
            </T>
            <T color="#80e8a5" size={17} style={{ lineHeight: 1.6 }}>
              We need something that adds a bend to the line. Something that breaks the linearity so layers actually DO
              different things when stacked. That something is called an activation function.
            </T>
          </Box>
        </Reveal>
      )}
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

export const ReLU = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  const neuron1 = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 1],
    [5, 2],
    [6, 3],
    [7, 4],
  ];
  const neuron2 = [
    [0, 5],
    [1, 4],
    [2, 3],
    [3, 2],
    [4, 1],
    [5, 0],
    [6, 0],
    [7, 0],
  ];
  const combined = neuron1.map((p, i) => [p[0], p[1] + neuron2[i][1]]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20} style={{ marginBottom: 16 }}>
            Activation (ReLU)
          </T>
          <T color={C.bright} bold size={18}>
            The ReLU Rule
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12, marginBottom: 16 }}>
            After each neuron's math, apply one simple rule:
          </T>
          <div
            style={{
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              border: `2px solid ${C.yellow}`,
              textAlign: "center",
            }}
          >
            <T color={C.yellow} bold size={17}>
              If negative → 0 | If positive → keep
            </T>
          </div>
          <T
            color="rgba(255,255,255,0.5)"
            size={14}
            style={{ marginTop: 16, textAlign: "center", fontStyle: "italic", fontFamily: "monospace" }}
          >
            Formally: ReLU(x) = max(0, x)
          </T>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: "#ef9a9a",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  -5
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  0
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: "#ef9a9a",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  -100
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  0
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  3
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 170 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>ReLU(</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  950
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>) =</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: "#81c784",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-block",
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  950
                </span>
              </div>
            </div>
          </div>
        </Box>
      )}
      {sub >= 1 && (
        <Reveal when={sub >= 1}>
          <Box color={C.cyan} style={{ width: "100%" }}>
            <T color={C.cyan} bold center size={20} style={{ marginBottom: 16 }}>
              One Neuron with ReLU Gives a BENT Line
            </T>
            <T color="#80deea" size={16} style={{ marginBottom: 14 }}>
              Flat at 0 from inputs 0-3 (ReLU kills negatives), then rises. A bent line, not straight!
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: neuron1,
                color: C.cyan,
                title: "Neuron 1: flat, then rises",
                desc: "Line graph showing ReLU-activated neuron output that is flat at zero then linearly increases, with an annotated bend point",
                annotations: [{ x: 3, y: 0, text: "bend!", color: C.cyan }],
              })}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 2 && (
        <Reveal when={sub >= 2}>
          <Box color={C.yellow} style={{ width: "100%" }}>
            <T color={C.yellow} bold center size={20} style={{ marginBottom: 16 }}>
              A Different Neuron: Different Bend
            </T>
            <T color="#ffe082" size={16} style={{ marginBottom: 14 }}>
              Different weights and bias create a different bend point.
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: neuron2,
                color: C.yellow,
                title: "Neuron 2: slopes down, then flat",
                desc: "Line graph showing a second ReLU neuron with a different bend point, demonstrating how different weights create different activation patterns",
                annotations: [{ x: 5, y: 0, text: "bend!", color: C.yellow }],
              })}
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 3 && (
        <Reveal when={sub >= 3}>
          <Box color={C.purple} style={{ width: "100%" }}>
            <T color={C.purple} bold center size={20} style={{ marginBottom: 16 }}>
              Add Both Neurons Together: a Valley Curve
            </T>
            <T color="#b8a9ff" size={16} style={{ marginBottom: 14 }}>
              Two bent lines create a valley shape - a curve. No straight line can do this.
            </T>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {Graph({
                points: combined,
                color: C.purple,
                title: "Combined: a valley shape",
                desc: "Line graph showing the combined output of two ReLU neurons creating a valley shape that no single straight line could produce",
                annotations: [
                  { x: 3, y: 2, text: "1st bend", color: C.cyan },
                  { x: 5, y: 2, text: "2nd bend", color: C.purple },
                ],
              })}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 15,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  0
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  5
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: C.dim, fontSize: 14 }}>input=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.yellow}15`,
                    borderRadius: 3,
                    color: "#ffe082",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  7
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>, output=</span>
                <span
                  style={{
                    padding: "2px 6px",
                    background: `${C.purple}15`,
                    borderRadius: 3,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
              </div>
            </div>
          </Box>
        </Reveal>
      )}
      {sub >= 4 && (
        <Reveal when={sub >= 4}>
          <Box color={C.orange} style={{ width: "100%" }}>
            <T color={C.orange} bold center size={20} style={{ marginBottom: 16 }}>
              Scale This Up
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  2 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 2 bends → valley/hill
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  10 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 10 bends → waves, zigzags
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  1000 neurons
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → 1000 bends → any curve
                </T>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 8,
                }}
              >
                <T color="#ffcc80" bold size={16}>
                  Millions
                </T>
                <T color="rgba(255,255,255,0.6)" size={15}>
                  → millions of bends → language, images, anything
                </T>
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}20`,
                borderRadius: 8,
              }}
            >
              <T color={C.orange} bold size={16}>
                Without ReLU: 100 layers = 1 layer (straight line)
              </T>
              <T color={C.orange} bold size={16} style={{ marginTop: 10 }}>
                With ReLU: each neuron adds a bend → millions of bends → learn ANY pattern
              </T>
            </div>
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
};

export const ForwardPass = (ctx) => {
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

export const LossFunction = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            Measuring Our Mistakes
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>
            Loss is a single number that measures how wrong our prediction was.
          </T>
          <div
            style={{
              margin: "16px 0",
              padding: "16px",
              background: `${C.cyan}06`,
              borderRadius: 12,
              border: `1px solid ${C.cyan}12`,
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.cyan} bold size={16}>
                Loss
              </T>
              <span style={{ color: C.dim, fontSize: 16 }}>=</span>
              <span
                style={{
                  padding: "4px 12px",
                  background: `${C.cyan}12`,
                  borderRadius: 6,
                  border: `1px solid ${C.cyan}25`,
                  color: "#80deea",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                (<span style={{ color: "#ef9a9a" }}>actual</span> − <span style={{ color: "#80deea" }}>predicted</span>
                )²
              </span>
            </div>
          </div>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            We square the error to make all errors positive (so they don't cancel out), and big errors get punished much
            more than small ones.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Our Example Calculation
          </T>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                Predicted: 807k
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
              }}
            >
              <T color={C.red} bold size={16}>
                Actual: 900k
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Loss
              </T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
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
                900
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>−</span>
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
                807
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>)²</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Loss
              </T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                (93)
              </span>
              <span style={{ color: C.dim, fontSize: 14 }}>²</span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.yellow} bold size={18}>
                Loss
              </T>
              <span style={{ color: C.dim, fontSize: 14 }}>=</span>
              <span
                style={{
                  padding: "3px 10px",
                  background: `${C.yellow}15`,
                  borderRadius: 4,
                  color: "#ffe082",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                8,649
              </span>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Key Insight
          </T>
          <T color="#ff8a80" size={16} style={{ marginTop: 12 }}>
            The loss depends on the prediction. The prediction depends on weights and biases. So if we change a weight,
            the prediction changes, and the loss changes.
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>
            There exists some perfect set of weights that makes the loss as small as possible. Our job is to find those
            values.
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            But how do we know which direction to change them? We need to understand derivatives first.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 340 160" style={{ display: "block", width: "100%", maxWidth: 340 }}>
              <desc>
                Bar chart comparing predicted value against actual value with an annotated gap, showing how loss
                measures prediction error
              </desc>
              {/* Baseline */}
              <line x1={30} y1={130} x2={210} y2={130} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

              {/* Predicted bar */}
              <rect
                x={40}
                y={40}
                width={60}
                height={90}
                fill={`${C.yellow}12`}
                stroke={C.yellow}
                strokeWidth={2}
                rx={4}
              />
              <text x={70} y={85} fill={C.yellow} fontSize={16} textAnchor="middle" fontWeight={700}>
                807k
              </text>
              <text x={70} y={148} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={600}>
                Predicted
              </text>

              {/* Actual bar - taller */}
              <rect x={130} y={15} width={60} height={115} fill={`${C.red}12`} stroke={C.red} strokeWidth={2} rx={4} />
              <text x={160} y={75} fill={C.red} fontSize={16} textAnchor="middle" fontWeight={700}>
                900k
              </text>
              <text x={160} y={148} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={600}>
                Actual
              </text>

              {/* Error bracket */}
              <line x1={105} y1={40} x2={125} y2={40} stroke={C.orange} strokeWidth={2} />
              <line x1={115} y1={15} x2={115} y2={40} stroke={C.orange} strokeWidth={2} />
              <polygon points="115,15 112,21 118,21" fill={C.orange} />
              <polygon points="115,40 112,34 118,34" fill={C.orange} />
              <text x={115} y={10} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                93k gap
              </text>

              {/* Chain: weights → prediction → loss */}
              <text x={255} y={50} fill={C.purple} fontSize={11} fontWeight={600} textAnchor="middle">
                weights
              </text>
              <text x={255} y={80} fill={C.dim} fontSize={18} textAnchor="middle">
                ↓
              </text>
              <text x={255} y={100} fill={C.cyan} fontSize={11} fontWeight={600} textAnchor="middle">
                prediction
              </text>
              <text x={255} y={120} fill={C.dim} fontSize={18} textAnchor="middle">
                ↓
              </text>
              <text x={255} y={140} fill={C.orange} fontSize={11} fontWeight={600} textAnchor="middle">
                loss
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Why Square the Error?
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                1. Big Errors Get Punished More
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Error of 2 gives loss of 4. Error of 10 gives loss of 100. A 5x error becomes 25x loss.
              </T>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.orange}06`,
                borderRadius: 8,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                2. Smooth Curve for Derivatives
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                The derivative of x² is 2x (simple, works everywhere). Backpropagation needs smooth derivatives to work
                cleanly.
              </T>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.purple}06`,
                borderRadius: 8,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={16}>
                3. One Clear Minimum
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Squared loss creates a parabolic bowl - one clear lowest point. Gradient descent rolls down smoothly to
                find it.
              </T>
            </div>
          </div>
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

export const WhatIsLearning = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            What Changes During Training?
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            When a neural network is first created, all weights and biases are random numbers. It knows nothing. It
            makes garbage predictions.
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            Our network predicted 807k but the correct answer was 900k. That's how bad random weights are.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            A Network Starts Dumb
          </T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16 }}>
            Learning is adjusting weights and biases until predictions get good. The loop has 4 steps:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.cyan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.cyan} bold size={16}>
                  Forward Pass
                </T>
                <T color={C.dim} size={14}>
                  Feed input through network, get prediction
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.yellow} bold size={16}>
                  Calculate Loss
                </T>
                <T color={C.dim} size={14}>
                  Compare prediction with correct answer
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold size={16}>
                  Backward Pass
                </T>
                <T color={C.dim} size={14}>
                  Figure out which weights caused the error
                </T>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                4
              </div>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold size={16}>
                  Update Weights
                </T>
                <T color={C.dim} size={14}>
                  Nudge each weight to reduce error
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              background: `${C.purple}06`,
              borderRadius: 8,
              border: `1px solid ${C.purple}12`,
            }}
          >
            <T color={C.purple} bold size={16}>
              ↻ Repeat until loss is small enough
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Backpropagation + Gradient Descent
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            This process has a name: "Backpropagation + Gradient Descent."
          </T>
          <div
            style={{
              marginTop: 16,
              padding: "12px",
              background: `${C.orange}06`,
              borderRadius: 8,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <T color={C.orange} bold size={16}>
              Backpropagation
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Step 3 - figuring out which weights to blame for the error
            </T>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: `${C.green}06`,
              borderRadius: 8,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold size={16}>
              Gradient Descent
            </T>
            <T color={C.dim} size={14} style={{ marginTop: 6 }}>
              Step 4 - actually updating the weights
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>
            Together, they are "training." When someone says "training a model," they mean running this loop millions of
            times.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color={C.pink} bold center size={20}>
            After Millions of Loops
          </T>
          <T color="#ffb3e6" size={16} style={{ marginTop: 12 }}>
            After running this loop millions of times, the weights converge to values that make good predictions. The
            network has "learned."
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>
            Those final weight values are the model. When you download GPT-3, you are downloading 175 billion
            carefully-tuned weight values that have been optimized through this exact process.
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

export const Derivatives = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            How Sensitive Is the Output?
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>
            A derivative answers one simple question: "If I nudge the input a tiny bit, how much does the output
            change?"
          </T>
          <T color={C.dim} size={14} style={{ marginTop: 12 }}>
            No Greek symbols, no limits, no complicated math. Just: small change in, how much change out?
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Concrete Example
          </T>
          <T color={C.dim} size={16} style={{ marginBottom: 8 }}>
            Our network: weight = 0.5, input = 1500, bias = 50
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <svg viewBox="0 0 380 100" style={{ display: "block", width: "100%", maxWidth: 380 }}>
              <desc>
                Simple neuron flow diagram showing input connected by weight to a neuron with bias, producing output,
                for derivative computation
              </desc>
              {/* Edge: input → neuron */}
              <line x1={82} y1={50} x2={158} y2={50} stroke={`${C.red}40`} strokeWidth={1.5} />
              <rect
                x={108}
                y={35}
                width={28}
                height={15}
                rx={3}
                fill="#08080dee"
                stroke={`${C.red}30`}
                strokeWidth={0.5}
              />
              <text x={122} y={46} fill={C.red} fontSize={10} textAnchor="middle" fontWeight={600}>
                0.5
              </text>
              {/* Edge: neuron → output */}
              <line x1={222} y1={50} x2={298} y2={50} stroke={`${C.cyan}40`} strokeWidth={1.5} />
              <polygon points="298,50 292,46 292,54" fill={`${C.cyan}40`} />
              {/* Input node */}
              <circle cx={56} cy={50} r={26} fill={`${C.orange}12`} stroke={C.orange} strokeWidth={2} />
              <text x={56} y={47} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                input
              </text>
              <text x={56} y={62} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">
                1500
              </text>
              {/* Neuron node */}
              <circle cx={190} cy={50} r={32} fill={`${C.purple}12`} stroke={C.purple} strokeWidth={2} />
              <text x={190} y={46} fill={C.purple} fontSize={12} textAnchor="middle" fontWeight={700}>
                Neuron
              </text>
              <text x={190} y={61} fill="rgba(255,255,255,0.45)" fontSize={10} textAnchor="middle">
                b=50
              </text>
              {/* Output node */}
              <circle cx={324} cy={50} r={26} fill={`${C.cyan}12`} stroke={C.cyan} strokeWidth={2} />
              <text x={324} y={47} fill={C.cyan} fontSize={11} textAnchor="middle" fontWeight={700}>
                output
              </text>
              <text x={324} y={62} fill="rgba(255,255,255,0.5)" fontSize={12} textAnchor="middle">
                800
              </text>
            </svg>
          </div>
          <div
            style={{
              padding: "12px",
              background: `${C.cyan}06`,
              borderRadius: 8,
              marginBottom: 12,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <T color={C.cyan} bold size={14}>
                Prediction
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                1500
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
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
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
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
                50
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                800
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <T color={C.cyan} bold size={14}>
                Actual
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                900
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.cyan} bold size={14}>
                Loss
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                (900
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
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
                800)²
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                10,000
              </span>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginBottom: 16 }}>
            Now what if we nudge the weight to 0.6?
          </T>
          <div
            style={{
              padding: "12px",
              background: `${C.yellow}06`,
              borderRadius: 8,
              border: `1px solid ${C.yellow}12`,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <T color={C.yellow} bold size={14}>
                New Prediction
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                1500
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
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
                0.6
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
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
                50
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                950
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <T color={C.yellow} bold size={14}>
                New Loss
              </T>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                (900
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
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
                950)²
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                2,500
              </span>
            </div>
          </div>
          <div
            style={{ padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12` }}
          >
            <T color={C.green} size={16}>
              Weight changed by +0.1 → Loss changed by -7,500. Increasing the weight made loss go DOWN. Good direction!
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Derivative Ratio
          </T>
          <T color="#ff8a80" size={16} style={{ marginBottom: 16, marginTop: 12 }}>
            The derivative is this ratio:
          </T>
          <div
            style={{
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold size={18} style={{ fontFamily: "monospace", marginBottom: 12 }}>
              ∂ Loss / ∂ weight
            </T>
            <T color={C.dim} size={14}>
              how much loss changed / how much weight changed
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "14px",
              background: `${C.yellow}06`,
              borderRadius: 10,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={15} style={{ marginBottom: 10 }}>
              Plugging in our numbers:
            </T>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <div
                style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
              >
                <T color={C.purple} bold size={15}>
                  ∂Loss / ∂weight
                </T>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
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
                  (2,500 - 10,000)
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>/</span>
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
                  (0.6 - 0.5)
                </span>
              </div>
              <div
                style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
              >
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
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
                  -7,500
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>/</span>
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
                  0.1
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
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
                  -75,000
                </span>
              </div>
            </div>
            <T color={C.dim} size={14} style={{ marginTop: 10, textAlign: "center" }}>
              Negative = increasing weight decreases loss. The magnitude (75,000) tells us it's very sensitive.
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>
            The ∂ symbol (read "partial") just means "tiny change in." So ∂Loss/∂weight means "the tiny change in loss
            caused by a tiny change in weight."
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            What the Derivative Tells Us
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                Negative (-)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Increasing weight → loss goes DOWN → increase the weight!
              </T>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.orange}06`,
                borderRadius: 8,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Positive (+)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Increasing weight → loss goes UP → decrease the weight!
              </T>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.yellow}06`,
                borderRadius: 8,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Large Number
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Loss is very sensitive to this weight → matters a lot
              </T>
            </div>
            <div
              style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, border: `1px solid ${C.cyan}12` }}
            >
              <T color={C.cyan} bold size={16}>
                Small Number
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Loss barely changes → matters little
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            The Derivative is Your Compass
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            The derivative tells us which direction to adjust each weight to reduce loss.
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 16 }}>
            With multiple weights, we turn one knob at a time. ∂L/∂w means "how does loss change when we nudge only w,
            holding everything else constant?" That is what "partial" means - changing one thing, leaving everything
            else still.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 320 200" maxWidth="100%" style={{ maxWidth: 320 }}>
              <desc>
                Parabolic loss curve with a marked current point, tangent line labeled slope equals derivative, and an
                arrow toward the minimum
              </desc>
              {/* Axes */}
              <line x1={40} y1={160} x2={280} y2={160} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <line x1={40} y1={160} x2={40} y2={30} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Axis labels */}
              <text x={260} y={175} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>
                weight
              </text>
              <text x={20} y={25} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>
                loss
              </text>

              {/* Parabola (loss curve) */}
              <path
                d="M 50 140 Q 80 70 110 60 Q 140 55 160 60 Q 190 70 220 140"
                fill="none"
                stroke={C.purple}
                strokeWidth={2.5}
              />

              {/* Current point on curve */}
              <circle cx={110} cy={60} r={5} fill={C.yellow} stroke={C.bright} strokeWidth={2} />
              <text x={110} y={40} fill={C.yellow} fontSize={12} textAnchor="middle" fontWeight={700}>
                current
              </text>

              {/* Tangent line (derivative) */}
              <line x1={70} y1={90} x2={150} y2={30} stroke={C.red} strokeWidth={2} />

              {/* Slope annotation */}
              <text x={150} y={15} fill={C.red} fontSize={12} fontWeight={700}>
                slope = derivative
              </text>

              {/* Direction arrow showing negative slope */}
              <path d="M 160 25 L 180 35" stroke={C.green} strokeWidth={2} />
              <polygon points="180,35 176,32 179,38" fill={C.green} />
              <text x={190} y={30} fill={C.green} fontSize={11} fontWeight={600}>
                → go this way
              </text>

              {/* Minimum point */}
              <circle cx={160} cy={60} r={4} fill={C.cyan} stroke={C.bright} strokeWidth={1.5} />
              <text x={160} y={75} fill={C.cyan} fontSize={11} textAnchor="middle">
                minimum
              </text>
            </svg>
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
};

export const BackwardPass = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Tracing the Blame Backwards
          </T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16, marginTop: 12 }}>
            There are MULTIPLE steps between weight and loss. We have to trace through all of them:
          </T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "weight", val: "w = 0.5", c: C.red },
              { label: "compute", val: "1500 × w + 50", c: C.orange },
              { label: "prediction", val: "800", c: C.cyan },
              { label: "subtract actual", val: "800 - 900", c: C.yellow },
              { label: "error", val: "-100", c: C.purple },
              { label: "square it", val: "(-100)²", c: C.green },
              { label: "loss", val: "10,000", c: C.red },
            ].map(({ label, val, c }, i) => (
              <div key={label} style={{ display: "contents" }}>
                {i > 0 && (
                  <T color={C.dim} bold size={18}>
                    →
                  </T>
                )}
                <div
                  style={{
                    padding: "8px 10px",
                    background: `${c}06`,
                    borderRadius: 8,
                    border: `1px solid ${c}12`,
                    textAlign: "center",
                    minWidth: 70,
                  }}
                >
                  <T color={C.dim} size={11} center>
                    {label}
                  </T>
                  <T color={c} bold size={14} center style={{ marginTop: 2 }}>
                    {val}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            The Chain Rule: Work Backwards
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 12 }}>
            Work backwards, one step at a time. Multiply all the derivatives together.
          </T>
          {/* Chain rule formula SVG */}
          <div
            style={{
              margin: "14px 0",
              padding: "16px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.purple}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <T color={C.dim} size={12} center style={{ textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              The Chain Rule Formula
            </T>
            <svg viewBox="0 0 460 70" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
              <desc>
                Chain rule formula as partial derivatives showing the three backward pass steps in different colors
              </desc>
              {/* ∂Loss/∂weight = */}
              <line x1={8} y1={32} x2={68} y2={32} stroke={C.bright} strokeWidth={1.2} />
              <text x={38} y={24} fill={C.purple} fontSize={14} fontFamily="serif" textAnchor="middle" fontWeight={700}>
                ∂Loss
              </text>
              <text x={38} y={48} fill={C.purple} fontSize={14} fontFamily="serif" textAnchor="middle" fontWeight={700}>
                ∂weight
              </text>
              <text x={84} y={37} fill={C.dim} fontSize={18} fontFamily="serif">
                =
              </text>
              {/* ∂Loss/∂error */}
              <line x1={102} y1={32} x2={162} y2={32} stroke={C.bright} strokeWidth={1.2} />
              <text x={132} y={24} fill={C.red} fontSize={14} fontFamily="serif" textAnchor="middle" fontWeight={700}>
                ∂Loss
              </text>
              <text x={132} y={48} fill={C.red} fontSize={14} fontFamily="serif" textAnchor="middle" fontWeight={700}>
                ∂error
              </text>
              {/* × */}
              <text x={178} y={37} fill={C.dim} fontSize={16} fontFamily="serif" textAnchor="middle">
                ×
              </text>
              {/* ∂error/∂pred */}
              <line x1={194} y1={32} x2={268} y2={32} stroke={C.bright} strokeWidth={1.2} />
              <text
                x={231}
                y={24}
                fill={C.orange}
                fontSize={14}
                fontFamily="serif"
                textAnchor="middle"
                fontWeight={700}
              >
                ∂error
              </text>
              <text
                x={231}
                y={48}
                fill={C.orange}
                fontSize={14}
                fontFamily="serif"
                textAnchor="middle"
                fontWeight={700}
              >
                ∂pred
              </text>
              {/* × */}
              <text x={284} y={37} fill={C.dim} fontSize={16} fontFamily="serif" textAnchor="middle">
                ×
              </text>
              {/* ∂pred/∂weight */}
              <line x1={300} y1={32} x2={380} y2={32} stroke={C.bright} strokeWidth={1.2} />
              <text
                x={340}
                y={24}
                fill={C.yellow}
                fontSize={14}
                fontFamily="serif"
                textAnchor="middle"
                fontWeight={700}
              >
                ∂pred
              </text>
              <text
                x={340}
                y={48}
                fill={C.yellow}
                fontSize={14}
                fontFamily="serif"
                textAnchor="middle"
                fontWeight={700}
              >
                ∂weight
              </text>
            </svg>
            <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
              Each fraction is one step. Multiply them all to get the final answer.
            </T>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                Step 1: Loss with respect to Error
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                loss = error²
              </T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>
                  derivative = 2 x error = 2 x (-100) = <strong style={{ color: C.red }}>-200</strong>
                </T>
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.orange}06`,
                borderRadius: 8,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Step 2: Error with respect to Prediction
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                error = prediction - 900
              </T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>
                  derivative = <strong style={{ color: C.orange }}>1</strong>
                </T>
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.yellow}06`,
                borderRadius: 8,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Step 3: Prediction with respect to Weight
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                prediction = 1500 x w + 50
              </T>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>
                <T color={C.dim} size={14}>
                  derivative = <strong style={{ color: C.yellow }}>1500</strong>
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Multiply Them Together
          </T>
          <T color="#5eb3ff" size={16} style={{ marginBottom: 16, marginTop: 12 }}>
            Now multiply them all together (that is the chain rule):
          </T>
          <div
            style={{
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>∂Loss/∂weight =</span>
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
                -200
              </span>
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>×</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.blue}15`,
                  borderRadius: 4,
                  color: "#5eb3ff",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                1
              </span>
              <span style={{ color: C.purple, fontSize: 16, fontWeight: 700 }}>×</span>
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
              <span style={{ color: C.purple, fontSize: 18, fontWeight: 700 }}>=</span>
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
                -300,000
              </span>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>
            This is negative - increasing weight will decrease loss. The magnitude (300,000) tells us the loss is very
            sensitive to this weight.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Same for Bias
          </T>
          <T color="#80e8a5" size={16} style={{ marginBottom: 12, marginTop: 12 }}>
            The same process works for bias:
          </T>
          <div
            style={{
              padding: "12px",
              background: `${C.cyan}06`,
              borderRadius: 8,
              border: `1px solid ${C.cyan}12`,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            <T color={C.cyan} bold size={16} style={{ fontFamily: "monospace" }}>
              ∂Loss/∂bias = -200 × 1 × 1 = -200
            </T>
          </div>
          <T color={C.dim} size={16} style={{ marginBottom: 12 }}>
            The prediction formula is prediction = 1500w + bias. So the derivative of prediction with respect to bias is
            1 (bias is directly added).
          </T>
          <T color={C.bright} size={16} style={{ marginTop: 12 }}>
            Now we have a gradient for every learnable parameter: weight and bias. Time to update them.
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

export const GradientDescent = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Reveal when={sub >= 0}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            The Weight Update Rule
          </T>
          <T color="#80deea" size={16} style={{ marginBottom: 16, marginTop: 12 }}>
            Each weight gets updated using this rule:
          </T>
          <div
            style={{
              padding: "16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.green}25`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={18} style={{ fontFamily: "monospace" }}>
              new_weight = old_weight - learning_rate × gradient
            </T>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, paddingLeft: 12 }}>
            {[
              { label: "old_weight", desc: "the weight's current value (before this update)", c: C.red },
              {
                label: "gradient",
                desc: "how much loss changes when this weight changes (from backward pass)",
                c: C.yellow,
              },
              { label: "learning_rate", desc: "a small number (like 0.001) that controls step size", c: C.purple },
              { label: "new_weight", desc: "the updated value we'll use going forward", c: C.green },
            ].map(({ label, desc, c }) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    padding: "4px 10px",
                    background: `${c}10`,
                    borderRadius: 6,
                    border: `1px solid ${c}20`,
                    minWidth: 130,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <code style={{ color: c, fontSize: 14, fontWeight: 700 }}>{label}</code>
                </div>
                <T color={C.dim} size={15} style={{ paddingTop: 3 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 14 }}>
            We move in the OPPOSITE direction of the gradient. If the gradient says "loss increases when you go right,"
            we go left.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <svg viewBox="0 0 340 195" style={{ display: "block", width: "100%", maxWidth: 340 }}>
              <desc>
                Gradient descent visualization showing a U-shaped loss curve with labeled steps rolling downhill toward
                the minimum
              </desc>
              {/* Axes */}
              <line x1={45} y1={168} x2={310} y2={168} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <line x1={45} y1={168} x2={45} y2={15} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
              <text x={290} y={183} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>
                weight
              </text>
              <text x={18} y={18} fill="rgba(255,255,255,0.4)" fontSize={11} fontWeight={600}>
                loss
              </text>

              {/* Loss curve - parabola y=160-0.005*(x-195)^2, many points for smooth shape */}
              <path
                d={`M 55,62 L 65,76 L 75,88 L 85,100 L 95,110 L 105,120 L 115,128 L 125,136 L 135,142 L 145,148 L 155,152 L 165,156 L 175,158 L 185,160 L 195,160 L 205,160 L 215,158 L 225,156 L 235,152 L 245,148 L 255,142 L 265,136 L 275,128 L 285,120 L 295,110 L 305,100`}
                fill="none"
                stroke={C.cyan}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Curved arrows between steps */}
              <path d="M 88,98 Q 112,130 133,143" stroke={`${C.red}90`} strokeWidth={1.5} fill="none" />
              <polygon points="133,143 127,136 135,137" fill={C.red} />
              <path d="M 148,150 Q 165,158 178,160" stroke={`${C.red}90`} strokeWidth={1.5} fill="none" />
              <polygon points="178,160 172,154 173,162" fill={C.red} />

              {/* Step 1 ball ON curve at x=80, y=94 */}
              <circle cx={80} cy={94} r={8} fill={C.orange} stroke={C.bright} strokeWidth={2} />
              <text x={80} y={84} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                step 1
              </text>

              {/* Step 2 ball ON curve at x=140, y=145 */}
              <circle cx={140} cy={145} r={8} fill={C.yellow} stroke={C.bright} strokeWidth={2} />
              <text x={140} y={135} fill={C.yellow} fontSize={11} textAnchor="middle">
                step 2
              </text>

              {/* Step N ball ON curve at x=185, y=160 (near minimum) */}
              <circle cx={185} cy={160} r={8} fill={C.green} stroke={C.bright} strokeWidth={2} />
              <text x={185} y={150} fill={C.green} fontSize={11} textAnchor="middle">
                step N
              </text>

              {/* Minimum annotation */}
              <line x1={195} y1={160} x2={195} y2={140} stroke={`${C.cyan}60`} strokeWidth={1} strokeDasharray="3,2" />
              <text x={195} y={135} fill={C.cyan} fontSize={11} fontWeight={600} textAnchor="middle">
                minimum
              </text>
            </svg>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Learning Rate Scaling
          </T>
          <T color="#b8a9ff" size={16} style={{ marginBottom: 12, marginTop: 12 }}>
            Our gradient is -300,000. If applied directly: new_w = 0.5 - (-300,000) = 300,000.5. Insane!
          </T>
          <T color={C.dim} size={16} style={{ marginBottom: 16 }}>
            The learning rate (like 0.0000001) scales the step to something reasonable:
          </T>
          <div
            style={{
              padding: "12px",
              background: `${C.yellow}06`,
              borderRadius: 8,
              border: `1px solid ${C.yellow}12`,
              marginBottom: 12,
            }}
          >
            <T color={C.yellow} bold size={14}>
              Weight update:
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_w =</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.yellow}15`,
                  borderRadius: 3,
                  color: "#ffe082",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ color: C.dim, fontSize: 13 }}>(</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.blue}15`,
                  borderRadius: 3,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.0000001
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.red}15`,
                  borderRadius: 3,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                -300,000
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_w =</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.yellow}15`,
                  borderRadius: 3,
                  color: "#ffe082",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.green}15`,
                  borderRadius: 3,
                  color: "#81c784",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.03
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.green}15`,
                  borderRadius: 3,
                  color: "#81c784",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                0.53
              </span>
            </div>
          </div>
          <div style={{ padding: "12px", background: `${C.cyan}06`, borderRadius: 8, border: `1px solid ${C.cyan}12` }}>
            <T color={C.cyan} bold size={14}>
              Bias update:
            </T>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_b =</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.cyan}15`,
                  borderRadius: 3,
                  color: "#80deea",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                50
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>−</span>
              <span style={{ color: C.dim, fontSize: 13 }}>(</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.blue}15`,
                  borderRadius: 3,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.0000001
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>×</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.red}15`,
                  borderRadius: 3,
                  color: "#ef9a9a",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                -200
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ color: C.dim, fontSize: 13 }}>new_b =</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.cyan}15`,
                  borderRadius: 3,
                  color: "#80deea",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                50
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>+</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.green}15`,
                  borderRadius: 3,
                  color: "#81c784",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.00002
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>≈</span>
              <span
                style={{
                  padding: "2px 6px",
                  background: `${C.cyan}15`,
                  borderRadius: 3,
                  color: "#80deea",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                50.00002
              </span>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Verify the Improvement
          </T>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", marginTop: 12 }}>
            <div
              style={{
                padding: "12px",
                background: `${C.red}06`,
                borderRadius: 8,
                border: `1px solid ${C.red}12`,
                flex: 1,
                minWidth: 180,
              }}
            >
              <T color={C.red} bold size={14}>
                Before Update
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>w=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.red}15`,
                      borderRadius: 3,
                      color: "#ef9a9a",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    0.5
                  </span>
                  <span style={{ color: C.dim, fontSize: 13 }}>, b=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.red}15`,
                      borderRadius: 3,
                      color: "#ef9a9a",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    50
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>pred=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.red}15`,
                      borderRadius: 3,
                      color: "#ef9a9a",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    800
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>loss=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.red}15`,
                      borderRadius: 3,
                      color: C.red,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    10,000
                  </span>
                </div>
              </div>
            </div>
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
              <T color={C.green} bold size={14}>
                After Update
              </T>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>w=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    0.53
                  </span>
                  <span style={{ color: C.dim, fontSize: 13 }}>, b≈</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    50
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                  <span style={{ color: C.dim, fontSize: 13 }}>pred=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    1500
                  </span>
                  <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    0.53
                  </span>
                  <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    50
                  </span>
                  <span style={{ color: C.dim, fontSize: 13 }}>=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: "#81c784",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    845
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>loss=</span>
                  <span
                    style={{
                      padding: "2px 6px",
                      background: `${C.green}15`,
                      borderRadius: 3,
                      color: C.green,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    3,025
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ padding: "12px", background: `${C.bright}20`, borderRadius: 8, border: `1px solid ${C.bright}40` }}
          >
            <T color={C.bright} size={16}>
              Loss dropped from 10,000 to 3,025! Repeat thousands of times and loss approaches zero.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            The Landscape Analogy
          </T>
          <T color="#ffe082" size={16} style={{ marginBottom: 16, marginTop: 12 }}>
            Imagine you are blindfolded on a hilly landscape. Height represents loss. You want to reach the lowest
            valley.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px", background: `${C.red}06`, borderRadius: 8, border: `1px solid ${C.red}12` }}>
              <T color={C.red} bold size={16}>
                Start (w=0.5)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                High up on the hill, loss is 10,000
              </T>
            </div>
            <div
              style={{
                padding: "12px",
                background: `${C.orange}06`,
                borderRadius: 8,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={16}>
                Gradient tells us the slope
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Which direction is downhill? That is what the derivative shows.
              </T>
            </div>
            <div
              style={{ padding: "12px", background: `${C.green}06`, borderRadius: 8, border: `1px solid ${C.green}12` }}
            >
              <T color={C.green} bold size={16}>
                Goal (minimum loss)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6 }}>
                Weights that make excellent predictions, loss near zero
              </T>
            </div>
          </div>
          <T color={C.dim} size={16} style={{ marginTop: 16 }}>
            Learning rate too big: you jump over the valley. Learning rate too small: takes forever. Just right: steady
            descent to the minimum.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            The Full Picture
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            That is backpropagation + gradient descent!
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.cyan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                1
              </div>
              <T color={C.dim} size={16}>
                Forward - Feed input through network → get prediction
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                2
              </div>
              <T color={C.dim} size={16}>
                Loss - Compare prediction with correct answer
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.orange,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                3
              </div>
              <T color={C.dim} size={16}>
                Backward - Chain rule to find gradients
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#08080d",
                }}
              >
                4
              </div>
              <T color={C.dim} size={16}>
                Update - Nudge weights opposite to gradient
              </T>
            </div>
          </div>
          <T color={C.bright} size={16} style={{ marginTop: 16 }}>
            In real networks with millions of weights, the exact same process happens - just with longer chains and more
            derivatives. The math scales, the idea stays identical.
          </T>
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
};

// ═══════ 1.13 Backprop Through the Real Network ═══════

export const BackpropRealNetwork = (ctx) => {
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
            In chapter 1.7, we traced a forward pass. The network predicted a house price:
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
            This is the same network from chapter 1.7. Every weight is labeled on its edge. The backward pass will
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
};

// ═══════ 1.14 Gradients in Action - The Full Training Loop ═══════

export const GradientsInAction = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: We have all gradients - now apply them */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            We Have the Gradients - Now Use Them
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>
            Backprop gave us a gradient for every parameter. Now we apply gradient descent to ALL of them
            simultaneously. Same formula from chapter 1.12:
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={18} style={{ fontFamily: "monospace" }}>
              new_weight = old_weight - learning_rate x gradient
            </T>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Learning rate = 0.0000001 (very small because our gradients are huge numbers like -223,200)
          </T>
        </Box>
      )}

      {/* Sub 1: Apply updates */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Updating Every Weight at Once
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            Learning rate = 0.0000001. Each weight gets nudged in the opposite direction of its gradient:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { p: "w₁₁", old: "0.500", grad: "-223,200", nw: "0.522", c: C.red, big: true },
              { p: "w₂₁", old: "50.000", grad: "-446.4", nw: "50.000", c: C.yellow, big: false },
              { p: "b₁", old: "50.000", grad: "-148.8", nw: "50.000", c: C.purple, big: false },
              { p: "w₁₂", old: "0.100", grad: "-55,800", nw: "0.106", c: C.red, big: true },
              { p: "w₂₂", old: "10.000", grad: "-111.6", nw: "10.000", c: C.yellow, big: false },
              { p: "b₂", old: "5.000", grad: "-37.2", nw: "5.000", c: C.purple, big: false },
              { p: "w_o1", old: "0.800", grad: "-176,700", nw: "0.818", c: C.cyan, big: true },
              { p: "w_o2", old: "0.200", grad: "-34,410", nw: "0.203", c: C.orange, big: true },
              { p: "b_o", old: "10.000", grad: "-186", nw: "10.000", c: C.green, big: false },
            ].map(({ p, old, grad, nw, c, big }) => (
              <div
                key={p}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  padding: "7px 10px",
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
                    padding: "3px 6px",
                    background: `${c}12`,
                    borderRadius: 5,
                    textAlign: "center",
                    minWidth: 52,
                    flexShrink: 0,
                  }}
                >
                  {p}
                </code>
                <span style={{ color: C.dim, fontSize: 14, marginLeft: 8 }}>=</span>
                <span style={{ color: C.mid, fontSize: 14, marginLeft: 6 }}>{old}</span>
                <span style={{ color: C.dim, fontSize: 13, marginLeft: 6 }}>- lr ×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    marginLeft: 4,
                    background: big ? `${C.red}10` : "rgba(255,255,255,0.03)",
                    borderRadius: 4,
                    color: big ? "#ef9a9a" : C.dim,
                    fontSize: 13,
                    fontWeight: big ? 600 : 400,
                  }}
                >
                  {grad}
                </span>
                <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                <span
                  style={{
                    padding: "4px 12px",
                    marginLeft: 8,
                    background: `${C.green}18`,
                    borderRadius: 6,
                    color: C.green,
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  {nw}
                </span>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            Weights with large gradients (w₁₁, w_o1) changed the most. Biases barely moved because their gradients are
            small. All 9 parameters updated simultaneously - one step of training.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Forward pass with new weights */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Forward Pass with Updated Weights
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            Let's run the network again with the new weights and see if it improved:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={15}>
                h₁ = ReLU(1500 x 0.522 + 3 x 50 + 50) = ReLU(983) = 983
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={15}>
                h₂ = ReLU(1500 x 0.106 + 3 x 10 + 5) = ReLU(194) = 194
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={15}>
                y = 983 x 0.818 + 194 x 0.203 + 10 = 854
              </T>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <div
              style={{
                padding: "10px 16px",
                background: `${C.red}08`,
                borderRadius: 8,
                border: `1px solid ${C.red}20`,
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={12}>
                Before
              </T>
              <T color={C.red} bold size={16}>
                y = 807
              </T>
              <T color={C.red} bold size={14}>
                Loss = 8,649
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <T color={C.bright} bold size={20}>
                →
              </T>
            </div>
            <div
              style={{
                padding: "10px 16px",
                background: `${C.green}08`,
                borderRadius: 8,
                border: `1px solid ${C.green}20`,
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={12}>
                After 1 step
              </T>
              <T color={C.green} bold size={16}>
                y = 854
              </T>
              <T color={C.green} bold size={14}>
                Loss = 2,116
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            Loss dropped from 8,649 to 2,116. Prediction moved from 807 to 854 - closer to the target of 900. One single
            step of backprop + gradient descent already cut the loss by 75%!
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Multiple iterations */}
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Repeat - Watch the Network Converge
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            Keep repeating: forward pass, compute loss, backprop, update weights. Each step gets closer:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { step: "Step 0 (initial)", pred: "807", loss: "8,649", bar: 100, c: C.red },
              { step: "Step 1", pred: "854", loss: "2,116", bar: 24, c: C.orange },
              { step: "Step 2", pred: "877", loss: "529", bar: 6, c: C.yellow },
              { step: "Step 3", pred: "889", loss: "121", bar: 1.4, c: C.green },
              { step: "Step 4", pred: "895", loss: "25", bar: 0.3, c: C.green },
              { step: "Step 10", pred: "899.8", loss: "0.04", bar: 0, c: C.green },
            ].map(({ step, pred, loss, bar, c }) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                <T color={C.dim} size={13} style={{ minWidth: 95, textAlign: "right" }}>
                  {step}
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
                    style={{
                      width: `${Math.max(bar, 0.5)}%`,
                      height: "100%",
                      background: c,
                      borderRadius: 4,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <T color={c} bold size={13} style={{ minWidth: 50, textAlign: "right" }}>
                  y={pred}
                </T>
                <T color={C.dim} size={12} style={{ minWidth: 65, textAlign: "right" }}>
                  loss={loss}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 12 }}>
            After just 10 steps, the network predicts 899.8 - nearly perfect. Loss went from 8,649 to 0.04. This is
            gradient descent: small, calculated steps downhill until you reach the minimum.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: The complete training loop diagram */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            The Complete Training Loop
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Every neural network in the world trains using this exact loop:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                step: "1",
                label: "Forward Pass",
                desc: "Feed input through network, get prediction",
                c: C.cyan,
                icon: "→",
              },
              { step: "2", label: "Compute Loss", desc: "How wrong was the prediction?", c: C.red, icon: "?" },
              {
                step: "3",
                label: "Backward Pass",
                desc: "Chain rule: compute gradient for every weight",
                c: C.purple,
                icon: "←",
              },
              {
                step: "4",
                label: "Update Weights",
                desc: "Nudge each weight opposite to its gradient",
                c: C.green,
                icon: "↓",
              },
              { step: "↻", label: "Repeat", desc: "Thousands to billions of times", c: C.yellow, icon: "↻" },
            ].map(({ step, label, desc, c, icon }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <div
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `${c}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: c,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <T color={c} bold size={16}>
                    {label}
                  </T>
                  <T color={C.dim} size={14}>
                    {desc}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            GPT-4 runs this loop trillions of times on billions of text examples. Each loop adjusts millions of weights
            by tiny amounts. After enough loops, the model can write poetry, answer questions, and write code - all
            because of this simple loop: predict, measure error, trace blame, fix weights, repeat.
          </T>
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
};

// ═══════ 1.15 Why Deep Backprop Gets Hard ═══════

export const WhyBackpropHard = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Our network was easy - only 2 layers */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            Our 2-Layer Network Was the Easy Case
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>
            For w₁₁, the chain had 4 multiplications: dLoss/dy x dy/dh₁ x dReLU/dz₁ x dz₁/dw₁₁. That is manageable.
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            But modern networks have 50, 100, or even 1000+ layers. GPT-4 has 120 layers. For a weight in layer 1 of a
            120-layer network, the chain rule has 120+ multiplications.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {["Layer 1", "Layer 2", "Layer 3", "Layer 4", "Layer 5"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}30`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={13}>
                    {label}
                  </T>
                </div>
                {i < 4 && (
                  <T color={C.dim} size={14}>
                    ×
                  </T>
                )}
              </div>
            ))}
            <T color={C.dim} size={14} style={{ margin: "0 4px" }}>
              ... ×
            </T>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: `${C.red}10`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={13}>
                Loss
              </T>
            </div>
          </div>
          <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
            120 multiplications chained together
          </T>
        </Box>
      )}

      {/* Sub 1: Vanishing gradients */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Vanishing Gradient Problem
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            If each derivative in the chain is less than 1, the product shrinks exponentially:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layers: "2 layers", calc: "0.5 x 0.5", result: "0.25", bar: 25 },
              { layers: "5 layers", calc: "0.5\u2075", result: "0.031", bar: 3.1 },
              { layers: "10 layers", calc: "0.5\u00B9\u2070", result: "0.001", bar: 0.5 },
              { layers: "50 layers", calc: "0.5\u2075\u2070", result: "0.000000000000001", bar: 0 },
            ].map(({ layers, calc: _calc, result, bar }) => (
              <div key={layers} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
                <T color={C.dim} size={13} style={{ minWidth: 75, textAlign: "right" }}>
                  {layers}
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
                  <div
                    style={{
                      width: `${Math.max(bar, 0.3)}%`,
                      height: "100%",
                      background: C.red,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <T color={C.red} bold size={12} style={{ minWidth: 120, textAlign: "right" }}>
                  {result}
                </T>
              </div>
            ))}
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            At 50 layers, the gradient is essentially zero. The early layers never learn because the gradient signal has
            completely vanished by the time it reaches them. It is like whispering a message through 50 people - by the
            end, nothing is left.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Exploding gradients */}
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            The Exploding Gradient Problem
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            The opposite problem: if each derivative is greater than 1, the product grows exponentially:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layers: "2 layers", calc: "2 x 2", result: "4", bar: 0.4 },
              { layers: "5 layers", calc: "2\u2075", result: "32", bar: 3.2 },
              { layers: "10 layers", calc: "2\u00B9\u2070", result: "1,024", bar: 20 },
              { layers: "50 layers", calc: "2\u2075\u2070", result: "1,125,899,906,842,624", bar: 100 },
            ].map(({ layers, calc: _calc, result, bar }) => (
              <div key={layers} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
                <T color={C.dim} size={13} style={{ minWidth: 75, textAlign: "right" }}>
                  {layers}
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
                  <div
                    style={{
                      width: `${Math.min(bar, 100)}%`,
                      height: "100%",
                      background: C.orange,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <T color={C.orange} bold size={12} style={{ minWidth: 140, textAlign: "right" }}>
                  {result}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            At 50 layers, the gradient is astronomically large. Weight updates become wild jumps that overshoot the
            minimum and the network diverges - the loss goes to infinity instead of zero. Training crashes.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Solutions */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Solutions That Made Deep Learning Work
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            These problems held back AI for decades. Here is what finally solved them:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                ReLU Activation (instead of sigmoid)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Sigmoid's derivative is at most 0.25 - guaranteed to vanish. ReLU's derivative is exactly 1 for positive
                inputs - no shrinkage. This alone was a breakthrough.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Residual Connections (Skip Connections)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Instead of output = f(input), use output = input + f(input). The gradient for "input" is always 1 - it
                flows straight through the skip connection, no matter how deep the network. The Transformer uses this
                everywhere.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={16}>
                Layer Normalization
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Keep activations in a stable range at every layer. Prevents both tiny and huge values from accumulating
                through the network. We will see this in Section 8.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={16}>
                Careful Weight Initialization
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Start weights in a range that keeps gradients close to 1. Too large = explosion. Too small = vanishing.
                Methods like "He initialization" and "Xavier initialization" solve this mathematically.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Why this matters */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Why This Matters for Everything Ahead
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Every architecture choice in the Transformer - residual connections, layer normalization, scaled dot-product
            attention - exists partly to solve these gradient problems. When you see "Add & Norm" in the Transformer
            diagram, you will know exactly why it is there: to keep gradients healthy so backprop works through 120
            layers.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.blue}25`,
            }}
          >
            <T color={C.bright} size={16} center>
              Backpropagation is the single most important algorithm in deep learning. Every model you have ever used -
              GPT, DALL-E, AlphaGo - learned through this exact process: forward pass, compute loss, chain rule
              backward, update weights, repeat.
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
};

export const Vectors = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            From One Number to Many
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A vector is just a list of numbers.
          </T>
          <div style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Scalar (one number)
              </T>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: `${C.cyan}15`,
                  border: `1px solid ${C.cyan}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <T size={24} bold color={C.cyan}>
                  42
                </T>
              </div>
            </div>
            <div data-arrow style={{ marginTop: 25 }}>
              <T size={28} color={C.mid}>
                →
              </T>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Vector (list)
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[3, 7, 2, 5].map((num, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 70,
                      background: `${[C.cyan, C.green, C.yellow, C.orange][i]}15`,
                      border: `1px solid ${[C.cyan, C.green, C.yellow, C.orange][i]}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                    }}
                  >
                    <T size={20} bold color={[C.cyan, C.green, C.yellow, C.orange][i]}>
                      {num}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>
            A single number describes one thing. A vector bundles multiple numbers together.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            In Neural Networks, Everything is Vectors
          </T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 12 }}>
            Inputs? A vector. Hidden layer outputs? Vectors. Every layer takes a vector in and produces a vector out.
          </T>
          <div style={{ marginTop: 18, display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Input Vector
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[1500, 3].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 50,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      fontSize: 14,
                      color: C.green,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <div data-arrow style={{ marginTop: 25 }}>
              <T size={24} color={C.mid}>
                →
              </T>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Output Vector
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[950, 185].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 70,
                      height: 50,
                      background: `${C.orange}20`,
                      border: `1px solid ${C.orange}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      fontSize: 14,
                      color: C.orange,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            Words Become Vectors
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 12 }}>
            A word like "cat" can't go into a neural network as letters. Instead, it becomes a vector of 512 numbers,
            where each number captures some aspect of meaning.
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 10 }}>
              The word "cat" - first 8 of 512 numbers:
            </T>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[0.8, -0.2, 0.5, 0.1, -0.7, 0.3, 0.9, -0.4].map((num, i) => {
                const bgColor = num > 0 ? C.green : C.red;
                return (
                  <div
                    key={i}
                    style={{
                      background: `${bgColor}25`,
                      border: `1px solid ${bgColor}40`,
                      padding: "6px 10px",
                      borderRadius: 4,
                      color: bgColor,
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {num.toFixed(1)}
                  </div>
                );
              })}
            </div>
            <T size={13} color={C.dim} style={{ marginTop: 8 }}>
              ...504 more numbers
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Similar Words Have Similar Vectors
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.green}>
                "cat"
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[0.8, -0.2, 0.5, 0.1].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.green}>
                "kitten"
              </T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>
                Very similar to cat
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[0.75, -0.18, 0.48, 0.08].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.green}20`,
                      border: `1px solid ${C.green}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.green,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} bold color={C.red}>
                "pizza"
              </T>
              <T size={13} color={C.dim} style={{ marginBottom: 8 }}>
                Completely different
              </T>
              <div style={{ display: "flex", gap: 6 }}>
                {[-0.3, 0.6, -0.1, 0.9].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: `${C.red}20`,
                      border: `1px solid ${C.red}40`,
                      padding: 8,
                      borderRadius: 4,
                      color: C.red,
                      fontSize: 13,
                      fontFamily: "monospace",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {n.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 16, textAlign: "center" }}>
            The network learns these numbers during training. Similar meanings lead to similar vectors.
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

export const DotProductIntro = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Multiplying Vectors Together
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            How do you compare two vectors? The dot product.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            It is the most important operation in all of AI.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            The Recipe: Multiply Matching Positions, Then Add Up
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 16px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
            }}
          >
            <T size={17} bold color={C.purple}>
              A = [2, 3] B = [4, 1]
            </T>
            <div style={{ marginTop: 12, fontSize: 15 }}>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <T color="#b8a9ff" bold size={15}>
                  Step 1:
                </T>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  2
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  4
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                  8
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.purple}15`,
                    borderRadius: 4,
                    color: "#b8a9ff",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  1
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                  3
                </span>
              </div>
              <div
                style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}
              >
                <T color="#b8a9ff" bold size={15}>
                  Step 2:
                </T>
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
                  8
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>+</span>
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
                  3
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                  11
                </span>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.purple}30` }}>
              <T size={18} bold color={C.purple}>
                A · B = 11
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            What Does It Mean?
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [4, 6] = 26
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.green}40`, borderRadius: 4 }} />
              <T size={13} color={C.green} style={{ marginTop: 6 }}>
                Same direction (similar)
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [4, 1] = 11
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.yellow}40`, borderRadius: 4 }} />
              <T size={13} color={C.yellow} style={{ marginTop: 6 }}>
                Somewhat similar
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [0, 0] = 0
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.mid}40`, borderRadius: 4 }} />
              <T size={13} color={C.mid} style={{ marginTop: 6 }}>
                Zero vector
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#ef9a9a" style={{ marginBottom: 6 }}>
                [2, 3] · [-2, -3] = -13
              </T>
              <div style={{ width: "100%", height: 14, background: `${C.red}40`, borderRadius: 4 }} />
              <T size={13} color={C.red} style={{ marginTop: 6 }}>
                Opposite direction
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 12px",
              background: `${C.red}06`,
              border: `1px solid ${C.red}15`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T size={14} color={C.dim}>
              <span style={{ color: "#ef9a9a", fontWeight: "bold" }}>Note on cosine similarity:</span> The dot product
              is affected by magnitude. When you only care about direction, normalize to length 1 first. That is cosine
              similarity.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Wait - This is What a Neuron Does!
          </T>
          <T color="#ffe082" size={15} style={{ marginTop: 12 }}>
            A neuron takes inputs [38.5, 1.0, 0.8] and weights [0.6, 0.3, 0.1] and computes:
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.orange}15`,
                  borderRadius: 4,
                  color: "#ffcc80",
                  fontSize: 14,
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
                  fontSize: 14,
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
                  fontSize: 14,
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
                  fontSize: 14,
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
                  fontSize: 14,
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
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                0.1
              </span>
              <span style={{ color: C.dim, fontSize: 13 }}>=</span>
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
                23.48
              </span>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 12 }}>
            That is a dot product! A neuron is a dot product machine.
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

export const Matrices = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            From 1D to 2D: The Grid
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A matrix is a grid of numbers arranged in rows and columns.
          </T>
          <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center", marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                A vector is 1D
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[38.5, 1.0, 0.8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 54,
                      height: 54,
                      background: `${C.cyan}15`,
                      border: `1px solid ${C.cyan}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ color: C.cyan, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 32, color: C.mid, paddingTop: 20 }}>→</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                A matrix is 2D
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  [0.6, 0.3, 0.1],
                  [0.1, 0.5, 0.2],
                  [0.0, 0.2, 0.7],
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div
                        key={j}
                        style={{
                          width: 54,
                          height: 54,
                          background: `${C.cyan}15`,
                          border: `1px solid ${C.cyan}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                        }}
                      >
                        <span style={{ color: C.cyan, fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <T size={15} color="#80deea" style={{ marginTop: 18, textAlign: "center" }}>
            The matrix on the right is 3 rows × 3 columns. We write this as a 3×3 matrix.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            A Matrix Transforms a Vector Into a New Vector
          </T>
          <T color="#b8a9ff" size={15} style={{ marginTop: 10 }}>
            Each ROW does a dot product with the input vector.
          </T>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Weights (3 neurons)
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  [0.6, 0.3, 0.1],
                  [0.1, 0.5, 0.2],
                  [0.0, 0.2, 0.7],
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 4 }}>
                    {row.map((n, j) => (
                      <div
                        key={j}
                        style={{
                          width: 48,
                          height: 48,
                          background: `${C.purple}15`,
                          border: `1px solid ${C.purple}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          color: C.purple,
                          borderRadius: 6,
                        }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <T size={20} color={C.mid} style={{ paddingTop: 20 }}>
              ×
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Inputs
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[38.5, 1.0, 0.8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 48,
                      height: 48,
                      background: `${C.purple}25`,
                      border: `1px solid ${C.purple}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: C.purple,
                      borderRadius: 6,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <T size={20} color={C.mid} style={{ paddingTop: 20 }}>
              =
            </T>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <T size={14} color={C.mid}>
                Outputs
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[23.48, 4.51, 0.76].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      width: 54,
                      height: 48,
                      background: `${C.orange}15`,
                      border: `1px solid ${C.orange}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      color: C.orange,
                      borderRadius: 6,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            The Math Step-by-Step
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Flu neuron [0.6, 0.3, 0.1] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
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
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                23.1
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.3
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.08
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
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
                23.48
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Cold neuron [0.1, 0.5, 0.2] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
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
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                3.85
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.16
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
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
                4.51
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Allergy neuron [0.0, 0.2, 0.7] · [38.5, 1.0, 0.8]:
            </T>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
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
                0.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                38.5
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                1.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
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
                0.7
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>×</span>
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
                0.8
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.0
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.2
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>+</span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: "#80e8a5",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                0.56
              </span>
              <span style={{ color: C.dim, fontSize: 12 }}>=</span>
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
                0.76
              </span>
            </div>
          </div>
          <T size={15} color="#ef9a9a" style={{ marginTop: 14 }}>
            Result: [23.48, 4.51, 0.76] - the raw scores before bias and activation.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            This is What a Layer Does!
          </T>
          <T color="#ffe082" size={15} style={{ marginTop: 10 }}>
            In chapter 1.3, a layer with weights [[0.6, 0.3, 0.1], [0.1, 0.5, 0.2], [0.0, 0.2, 0.7]] transforming input
            [38.5, 1.0, 0.8] is matrix multiplication.
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <T size={16} color={C.yellow} bold style={{ fontFamily: "monospace", marginBottom: 8 }}>
              Layer weights are a matrix.
            </T>
            <T size={14} color={C.dim}>
              Passing input through a layer is matrix multiplication.
            </T>
          </div>
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

export const LayerIsMatMul = (ctx) => {
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
            From Chapter 1.2: A Neuron Sums Weighted Inputs
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
};

export const ActivationFunctions = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Beyond ReLU: The Full Menu
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A layer is matrix multiplication: output = W · input.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            But layers alone are linear. To compute anything interesting, we need nonlinearity. That is where activation
            functions come in.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            ReLU (Rectified Linear Unit)
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.purple}25`,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            <T color={C.purple} bold size={18}>
              ReLU(x) = max(0, x)
            </T>
          </div>
          <T size={15} color="#b8a9ff" style={{ marginTop: 12 }}>
            If x is negative, output 0. If x is positive, output x. That is it.
          </T>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff" style={{ marginBottom: 8 }}>
                ReLU(-2.5)
              </T>
              <T size={13} color={C.dim}>
                max(0, -2.5) = 0
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff" style={{ marginBottom: 8 }}>
                ReLU(1.3)
              </T>
              <T size={13} color={C.dim}>
                max(0, 1.3) = 1.3
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            Why ReLU? It Creates the Bend
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>
            Multiple linear layers stacked together are still just one big linear function. ReLU breaks that. It creates
            folds and corners. That is how networks learn nonlinear patterns.
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              Without activation:
            </T>
            <T size={14} color={C.dim}>
              Layer1(x) = W1·x, Layer2(y) = W2·y
            </T>
            <T size={13} color={C.dim} style={{ marginTop: 6 }}>
              Combined: (W2·W1)·x → still linear!
            </T>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}08`,
              border: `1px solid ${C.red}20`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <T size={14} color="#ef9a9a" style={{ marginBottom: 8 }}>
              With ReLU:
            </T>
            <T size={14} color={C.dim}>
              Layer1(x) = ReLU(W1·x), Layer2(y) = ReLU(W2·y)
            </T>
            <T size={13} color={C.dim} style={{ marginTop: 6 }}>
              Combined: ReLU(W2·ReLU(W1·x)) → nonlinear!
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Other Activation Functions
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
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>
                Sigmoid
              </T>
              <T size={13} color={C.dim}>
                σ(x) = 1 / (1 + e^-x) - squashes output to [0, 1]
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
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>
                Tanh
              </T>
              <T size={13} color={C.dim}>
                tanh(x) = (e^x - e^-x) / (e^x + e^-x) - squashes to [-1, 1]
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
              <T size={15} color="#ffe082" style={{ marginBottom: 4 }}>
                Softmax
              </T>
              <T size={13} color={C.dim}>
                Normalizes a vector to probabilities summing to 1
              </T>
            </div>
          </div>
          <T size={15} color="#ffe082" style={{ marginTop: 14, textAlign: "center" }}>
            ReLU dominates modern networks because it is simple and works well.
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

export const WhatDeepMeans = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Layers on Layers on Layers
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            A "deep" network has many layers stacked on top of each other.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            The depth is the number of layers.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            Shallow vs Deep
          </T>
          <div style={{ display: "flex", gap: 16, marginTop: 14, alignItems: "flex-start" }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>
                Shallow (1-2 layers)
              </T>
              <T size={13} color={C.dim}>
                Input → Hidden → Output
              </T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>
                Limited feature learning. Can only learn simple patterns.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={15} color="#b8a9ff" style={{ marginBottom: 10 }}>
                Deep (50+ layers)
              </T>
              <T size={13} color={C.dim}>
                Input → H1 → H2 → ... → H50 → Output
              </T>
              <T size={13} color={C.dim} style={{ marginTop: 8 }}>
                Each layer learns richer, more abstract features.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            Feature Abstraction Through Depth
          </T>
          <T color="#ef9a9a" size={15} style={{ marginTop: 10 }}>
            Early layers learn low-level features. Later layers learn high-level concepts.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Layer 1
              </T>
              <T size={13} color={C.dim}>
                Detects edges, colors, simple shapes
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Layers 2-5
              </T>
              <T size={13} color={C.dim}>
                Detects textures, parts (eyes, ears, nose)
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Layers 6+
              </T>
              <T size={13} color={C.dim}>
                Detects objects (cat, dog, person)
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            Why Does Depth Matter?
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
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Composability
              </T>
              <T size={13} color={C.dim}>
                Each layer builds on the previous. Layers can reuse and combine earlier features.
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
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Efficiency
              </T>
              <T size={13} color={C.dim}>
                Deep networks solve problems with fewer parameters than shallow ones.
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
              <T size={14} color="#ffe082" style={{ marginBottom: 4 }}>
                Expressiveness
              </T>
              <T size={13} color={C.dim}>
                Some functions cannot be learned by shallow networks at all.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={19}>
            Training vs Inference
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>
                Training
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Update weights
                  </T>
                  <T size={12} color={C.dim}>
                    Backprop changes every parameter
                  </T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Dropout active
                  </T>
                  <T size={12} color={C.dim}>
                    Random units deactivated
                  </T>
                </div>
              </div>
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
              <T size={14} color="#80e8a5" style={{ marginBottom: 8 }}>
                Inference
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Weights FROZEN
                  </T>
                  <T size={12} color={C.dim}>
                    No changes, no gradients
                  </T>
                </div>
                <div>
                  <T size={13} color="#80e8a5" style={{ fontWeight: "bold" }}>
                    Dropout off
                  </T>
                  <T size={12} color={C.dim}>
                    All units active
                  </T>
                </div>
              </div>
            </div>
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
};

export const SameBuildingBlocks = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            One Architecture, Many Applications
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 12 }}>
            Every neural network, no matter how big or complex, is built from the same pieces.
          </T>
          <T size={15} color="#80deea" style={{ marginTop: 10 }}>
            You now understand them all.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={19}>
            The Universal Pieces
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff">
                1. Matrix multiplication
              </T>
              <T size={13} color={C.dim}>
                Transforms a vector into a new vector via weights
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff">
                2. Activation function
              </T>
              <T size={13} color={C.dim}>
                Introduces nonlinearity (ReLU, Sigmoid, Tanh)
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff">
                3. Loss function
              </T>
              <T size={13} color={C.dim}>
                Measures error between output and target
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff">
                4. Backpropagation
              </T>
              <T size={13} color={C.dim}>
                Computes gradients via the chain rule
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#b8a9ff">
                5. Gradient descent
              </T>
              <T size={13} color={C.dim}>
                Updates weights to reduce loss
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ef9a9a" bold center size={19}>
            From Simple to Complex
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Linear regression
              </T>
              <T size={13} color={C.dim}>
                One matrix × input, no activation
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Simple network
              </T>
              <T size={13} color={C.dim}>
                Input → Hidden (matrix + ReLU) → Output
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                Deep network
              </T>
              <T size={13} color={C.dim}>
                Many layers stacked, same pieces repeated
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <T size={14} color="#ef9a9a">
                GPT (Large Language Model)
              </T>
              <T size={13} color={C.dim}>
                Thousands of layers, same matrix + activation pattern
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={19}>
            You Now Understand the Foundation
          </T>
          <T color="#ffe082" size={15} style={{ marginTop: 10 }}>
            Everything in deep learning builds on these concepts. Transformers, RNNs, CNNs, attention mechanisms - they
            are all variations on the same core ideas you just learned.
          </T>
          <div
            style={{
              padding: "14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              marginTop: 14,
              textAlign: "center",
            }}
          >
            <T size={16} color={C.yellow} bold>
              You are ready for the next level.
            </T>
          </div>
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

export const Dropout = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            What Are Training Loss and Validation Loss?
          </T>
          <T color="#90caf9" size={17} style={{ marginTop: 12 }}>
            Before training, we split our data into two groups. The model only ever learns from one group - the other is
            kept hidden as an honest test.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 90" style={{ display: "block", width: "100%", maxWidth: 380 }}>
              <desc>
                Dataset split bar showing 80% training data in green and 20% validation data in orange, with labeled
                counts
              </desc>
              {/* Full bar background */}
              <rect x={10} y={18} width={340} height={36} rx={6} fill="rgba(255,255,255,0.04)" />
              {/* Training portion - 80% */}
              <rect x={10} y={18} width={272} height={36} rx={6} fill={`${C.green}25`} stroke={C.green} strokeWidth={1.5} />
              <text x={146} y={41} fill={C.green} fontSize={13} textAnchor="middle" fontWeight={700}>
                Training Data (80%)
              </text>
              {/* Validation portion - 20% */}
              <rect x={282} y={18} width={68} height={36} rx={6} fill={`${C.orange}25`} stroke={C.orange} strokeWidth={1.5} />
              <text x={316} y={41} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={700}>
                20%
              </text>
              {/* Labels below */}
              <text x={146} y={72} fill={C.green} fontSize={11} textAnchor="middle">
                800 examples
              </text>
              <text x={316} y={72} fill={C.orange} fontSize={11} textAnchor="middle">
                200 examples
              </text>
              {/* Total label */}
              <text x={180} y={12} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle">
                1,000 total examples
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            <div
              style={{
                flex: 1,
                padding: "14px",
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold size={17} center>
                Training Loss
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg viewBox="0 0 120 50" style={{ width: 120, height: 50 }}>
                  <desc>Icon showing an open eye with a checkmark, representing data the model sees during training</desc>
                  {/* Eye icon - open */}
                  <ellipse cx={60} cy={25} rx={30} ry={16} fill="none" stroke={C.green} strokeWidth={2} />
                  <circle cx={60} cy={25} r={8} fill={`${C.green}30`} stroke={C.green} strokeWidth={1.5} />
                  <circle cx={60} cy={25} r={3} fill={C.green} />
                </svg>
              </div>
              <T color="#80e8a5" size={15} style={{ marginTop: 8 }}>
                Error measured on data the model trains on. The model sees these examples, makes predictions, and adjusts
                its weights.
              </T>
              <div
                style={{
                  padding: "6px 10px",
                  background: `${C.green}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.green}20`,
                  marginTop: 10,
                }}
              >
                <T color={C.green} bold size={14} center>
                  Always goes down with more training
                </T>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px",
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.orange} bold size={17} center>
                Validation Loss
              </T>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg viewBox="0 0 120 50" style={{ width: 120, height: 50 }}>
                  <desc>
                    Icon showing a closed eye with a lock, representing held-out data the model never sees during training
                  </desc>
                  {/* Eye icon - closed/hidden */}
                  <path d="M 30 25 Q 60 40 90 25" fill="none" stroke={C.orange} strokeWidth={2} />
                  <path d="M 30 25 Q 60 10 90 25" fill="none" stroke={C.orange} strokeWidth={2} strokeDasharray="4,3" />
                  <line x1={42} y1={32} x2={38} y2={40} stroke={C.orange} strokeWidth={2} />
                  <line x1={60} y1={35} x2={60} y2={44} stroke={C.orange} strokeWidth={2} />
                  <line x1={78} y1={32} x2={82} y2={40} stroke={C.orange} strokeWidth={2} />
                </svg>
              </div>
              <T color="#ffcc80" size={15} style={{ marginTop: 8 }}>
                Error measured on data the model has NEVER seen. These examples are hidden during training - they are the
                honest test.
              </T>
              <div
                style={{
                  padding: "6px 10px",
                  background: `${C.orange}10`,
                  borderRadius: 6,
                  border: `1px solid ${C.orange}20`,
                  marginTop: 10,
                }}
              >
                <T color={C.orange} bold size={14} center>
                  The real measure of learning
                </T>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.blue}08`,
              border: `1px solid ${C.blue}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#90caf9" size={16}>
              Training loss tells you how well the model memorizes. Validation loss tells you how well it generalizes to
              new, unseen data. The gap between them is everything.
            </T>
          </div>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Overfitting Problem
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            Watch what happens as training continues. The model starts to memorize the training data instead of learning
            general patterns.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 220" style={{ display: "block", width: "100%", maxWidth: 400 }}>
              <desc>
                Combined line graph showing training loss and validation loss over 14 epochs, with annotated zones for
                both improving, sweet spot, and overfitting region where the curves diverge
              </desc>
              {/* Axes */}
              <line x1={45} y1={18} x2={45} y2={175} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <line x1={45} y1={175} x2={345} y2={175} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              {/* Y-axis label */}
              <text x={8} y={100} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle" transform="rotate(-90, 8, 100)">
                Loss
              </text>
              {/* X-axis label */}
              <text x={195} y={195} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle">
                Epoch
              </text>
              {/* X-axis ticks */}
              {[0, 2, 4, 6, 8, 10, 12, 14].map((v) => {
                const x = 45 + (v / 14) * 300;
                return (
                  <text key={v} x={x} y={188} fill="rgba(255,255,255,0.35)" fontSize={9} textAnchor="middle">
                    {v}
                  </text>
                );
              })}
              {/* Zone backgrounds */}
              {/* Both improving zone (epoch 0-6) */}
              <rect x={45} y={18} width={128} height={157} fill={`${C.green}06`} />
              {/* Overfitting zone (epoch 6-14) */}
              <rect x={173} y={18} width={172} height={157} fill={`${C.red}06`} />
              {/* Sweet spot line */}
              <line x1={173} y1={18} x2={173} y2={175} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="5,4" />
              {/* Zone labels */}
              <text x={109} y={210} fill={C.green} fontSize={10} textAnchor="middle" fontWeight={600}>
                Both improving
              </text>
              <text x={259} y={210} fill={C.red} fontSize={10} textAnchor="middle" fontWeight={600}>
                Overfitting zone
              </text>
              {/* Sweet spot label */}
              <text x={173} y={13} fill={C.yellow} fontSize={10} textAnchor="middle" fontWeight={700}>
                Sweet Spot
              </text>
              {/* Training loss line (green) - keeps dropping */}
              {(() => {
                const trainPts = [
                  [0, 2.5], [2, 1.8], [4, 1.2], [6, 0.7], [8, 0.3], [10, 0.1], [12, 0.05], [14, 0.02],
                ];
                const sx = (v) => 45 + (v / 14) * 300;
                const sy = (v) => 28 + ((3.0 - v) / 3.0) * 145;
                const line = trainPts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
                return (
                  <g>
                    <polyline points={line} fill="none" stroke={C.green} strokeWidth={2.5} strokeLinejoin="round" />
                    {trainPts.map((p, i) => (
                      <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={3} fill={C.green} />
                    ))}
                  </g>
                );
              })()}
              {/* Validation loss line (red) - drops then rises */}
              {(() => {
                const valPts = [
                  [0, 2.6], [2, 1.9], [4, 1.4], [6, 1.1], [8, 1.3], [10, 1.8], [12, 2.3], [14, 2.8],
                ];
                const sx = (v) => 45 + (v / 14) * 300;
                const sy = (v) => 28 + ((3.0 - v) / 3.0) * 145;
                const line = valPts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
                return (
                  <g>
                    <polyline points={line} fill="none" stroke={C.red} strokeWidth={2.5} strokeLinejoin="round" />
                    {valPts.map((p, i) => (
                      <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={3} fill={C.red} />
                    ))}
                  </g>
                );
              })()}
              {/* Gap annotation at epoch 14 */}
              {(() => {
                const sx = 45 + (14 / 14) * 300;
                const syTrain = 28 + ((3.0 - 0.02) / 3.0) * 145;
                const syVal = 28 + ((3.0 - 2.8) / 3.0) * 145;
                return (
                  <g>
                    <line x1={sx + 6} y1={syTrain} x2={sx + 6} y2={syVal} stroke={C.yellow} strokeWidth={2} />
                    <polygon points={`${sx + 6},${syVal} ${sx + 3},${syVal + 6} ${sx + 9},${syVal + 6}`} fill={C.yellow} />
                    <polygon points={`${sx + 6},${syTrain} ${sx + 3},${syTrain - 6} ${sx + 9},${syTrain - 6}`} fill={C.yellow} />
                    <text x={sx + 14} y={(syTrain + syVal) / 2 + 4} fill={C.yellow} fontSize={10} fontWeight={700}>
                      GAP
                    </text>
                  </g>
                );
              })()}
              {/* Legend */}
              <line x1={60} y1={33} x2={80} y2={33} stroke={C.green} strokeWidth={2.5} />
              <circle cx={70} cy={33} r={3} fill={C.green} />
              <text x={84} y={37} fill={C.green} fontSize={10} fontWeight={600}>
                Training Loss
              </text>
              <line x1={185} y1={33} x2={205} y2={33} stroke={C.red} strokeWidth={2.5} />
              <circle cx={195} cy={33} r={3} fill={C.red} />
              <text x={209} y={37} fill={C.red} fontSize={10} fontWeight={600}>
                Validation Loss
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}15`,
                borderRadius: 8,
              }}
            >
              <T color={C.green} bold size={15} center>
                Training: 0.02
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Memorized everything perfectly
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}15`,
                borderRadius: 8,
              }}
            >
              <T color={C.red} bold size={15} center>
                Validation: 2.80
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Fails completely on new data
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" size={16}>
              Like a student who memorizes every answer in the textbook but cannot solve a new problem on the exam. The
              network scores perfectly on data it has seen, but fails on anything new.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            The Solution - Randomly Zero Out Neurons
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            During training, randomly set some neurons to zero. Every forward pass uses a different random subset of the
            network.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 120" style={{ display: "block", width: "100%", maxWidth: 360 }}>
              <desc>Six-neuron layer with dropout showing alternating active and dropped neurons during training</desc>
              <text x={180} y={14} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle" fontWeight={600}>
                6-Neuron Layer with Dropout (p = 0.5)
              </text>
              {[
                { x: 30, active: true },
                { x: 90, active: false },
                { x: 150, active: true },
                { x: 210, active: false },
                { x: 270, active: true },
                { x: 330, active: false },
              ].map(({ x, active }, i) => (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={65}
                    r={22}
                    fill={active ? `${C.green}20` : "rgba(255,255,255,0.03)"}
                    stroke={active ? C.green : "rgba(255,255,255,0.15)"}
                    strokeWidth={2}
                  />
                  {active ? (
                    <text x={x} y={70} fill={C.green} fontSize={14} textAnchor="middle" fontWeight={700}>
                      n{i + 1}
                    </text>
                  ) : (
                    <g>
                      <line x1={x - 10} y1={55} x2={x + 10} y2={75} stroke={C.red} strokeWidth={3} />
                      <line x1={x + 10} y1={55} x2={x - 10} y2={75} stroke={C.red} strokeWidth={3} />
                    </g>
                  )}
                  <text
                    x={x}
                    y={105}
                    fill={active ? C.green : C.red}
                    fontSize={10}
                    textAnchor="middle"
                    fontWeight={600}
                  >
                    {active ? "ACTIVE" : "DROPPED"}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.green}08`,
              border: `1px solid ${C.green}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#80e8a5" size={16}>
              Dropout rate p = 0.5 means each neuron has a 50% chance of being zeroed out on each forward pass. Every
              training step sees a different random subset of the network.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Why This Works - Forced Redundancy
          </T>
          <T color="#b8a9ff" size={17} style={{ marginTop: 12 }}>
            No single neuron can become a "lone specialist" that the network depends on entirely. Every neuron must be
            useful even when its neighbors are missing.
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T color="#b8a9ff" bold size={16} center>
                Without Dropout
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                Neuron 3 memorizes a specific pattern. If neuron 3 fails, the network breaks. Knowledge is fragile and
                concentrated.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}20`,
                borderRadius: 8,
              }}
            >
              <T color="#b8a9ff" bold size={16} center>
                With Dropout
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                All neurons learn overlapping representations. Any 3 of 6 can carry the signal. Knowledge is distributed
                and robust.
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" size={16}>
              Think of a team of 6 people where any 3 might be absent on any given day. Everyone must learn everyone
              else's job. The team becomes resilient - no single point of failure.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The Actual Math
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 12 }}>
            Start with an input vector and apply a random binary mask, then scale up:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffe082" bold size={15}>
                Step 1: Input vector
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {[0.8, 0.3, 0.5, 0.2, 0.7, 0.4].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: `${C.cyan}15`,
                      borderRadius: 4,
                      color: "#80deea",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffe082" bold size={15}>
                Step 2: Random Bernoulli mask (p = 0.5)
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[1, 0, 1, 0, 1, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v ? `${C.green}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v ? C.green : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffe082" bold size={15}>
                Step 3: Multiply element-wise
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[0.8, 0, 0.5, 0, 0.7, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v > 0 ? `${C.green}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v > 0 ? C.green : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.orange}08`,
                border: `1px solid ${C.orange}20`,
                borderRadius: 8,
              }}
            >
              <T color="#ffcc80" bold size={15}>
                Step 4: Scale by 1/(1 - p) = 1/0.5 = 2
              </T>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[1.6, 0, 1.0, 0, 1.4, 0].map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "3px 8px",
                      background: v > 0 ? `${C.orange}15` : `${C.red}15`,
                      borderRadius: 4,
                      color: v > 0 ? "#ffcc80" : C.red,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.yellow}25`,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" bold size={16}>
              Why scale?
            </T>
            <T color="#ffe082" size={15} style={{ marginTop: 4 }}>
              Without scaling, the expected output is only 0.5 x original (half the neurons are zero). Scaling by 2
              restores the expected value to match the original. This way, the network sees the same magnitude at
              training and inference.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            At Inference - No Dropout
          </T>
          <T color="#80deea" size={17} style={{ marginTop: 12 }}>
            When the model is deployed and making predictions, dropout is completely turned off. All neurons are active,
            no mask is applied, no scaling is needed.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 360 100" style={{ display: "block", width: "100%", maxWidth: 360 }}>
              <desc>
                Six-neuron layer at inference showing all neurons active, illustrating that dropout is turned off during
                prediction
              </desc>
              <text x={180} y={14} fill="rgba(255,255,255,0.5)" fontSize={11} textAnchor="middle" fontWeight={600}>
                All 6 Neurons Active at Inference
              </text>
              {[30, 90, 150, 210, 270, 330].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={55} r={22} fill={`${C.cyan}20`} stroke={C.cyan} strokeWidth={2} />
                  <text x={x} y={60} fill={C.cyan} fontSize={14} textAnchor="middle" fontWeight={700}>
                    n{i + 1}
                  </text>
                  <text x={x} y={92} fill={C.green} fontSize={10} textAnchor="middle" fontWeight={600}>
                    ACTIVE
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#80deea" size={16}>
              The scaling during training (multiplying by 1/(1 - p)) already compensated for the missing neurons. So at
              inference, using all neurons with their original weights produces the correct expected output. This is
              called "inverted dropout."
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 6}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Where Dropout Lives in a Transformer
          </T>
          <T color="#ffcc80" size={17} style={{ marginTop: 12 }}>
            Dropout is applied at two key locations inside each transformer block:
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <svg viewBox="0 0 280 320" style={{ display: "block", width: "100%", maxWidth: 280 }}>
              <desc>
                Vertical transformer block diagram showing where dropout is applied: after attention and after FFN
              </desc>
              {/* Input */}
              <rect
                x={70}
                y={5}
                width={140}
                height={30}
                rx={6}
                fill={`${C.cyan}15`}
                stroke={C.cyan}
                strokeWidth={1.5}
              />
              <text x={140} y={25} fill={C.cyan} fontSize={11} textAnchor="middle" fontWeight={600}>
                Input
              </text>

              {/* Arrow */}
              <line x1={140} y1={35} x2={140} y2={50} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Multi-Head Attention */}
              <rect
                x={50}
                y={50}
                width={180}
                height={35}
                rx={6}
                fill={`${C.purple}15`}
                stroke={C.purple}
                strokeWidth={1.5}
              />
              <text x={140} y={72} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>
                Multi-Head Attention
              </text>

              {/* Arrow */}
              <line x1={140} y1={85} x2={140} y2={100} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* DROPOUT 1 */}
              <rect x={60} y={100} width={160} height={30} rx={6} fill={`${C.red}25`} stroke={C.red} strokeWidth={2} />
              <text x={140} y={120} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                DROPOUT (p = 0.1)
              </text>

              {/* Arrow */}
              <line x1={140} y1={130} x2={140} y2={145} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Add & Norm */}
              <rect
                x={60}
                y={145}
                width={160}
                height={30}
                rx={6}
                fill={`${C.blue}15`}
                stroke={C.blue}
                strokeWidth={1.5}
              />
              <text x={140} y={165} fill={C.blue} fontSize={11} textAnchor="middle" fontWeight={600}>
                Add & Norm
              </text>

              {/* Arrow */}
              <line x1={140} y1={175} x2={140} y2={190} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* FFN */}
              <rect
                x={50}
                y={190}
                width={180}
                height={35}
                rx={6}
                fill={`${C.yellow}15`}
                stroke={C.yellow}
                strokeWidth={1.5}
              />
              <text x={140} y={212} fill={C.yellow} fontSize={11} textAnchor="middle" fontWeight={600}>
                Feed-Forward Network
              </text>

              {/* Arrow */}
              <line x1={140} y1={225} x2={140} y2={240} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* DROPOUT 2 */}
              <rect x={60} y={240} width={160} height={30} rx={6} fill={`${C.red}25`} stroke={C.red} strokeWidth={2} />
              <text x={140} y={260} fill={C.red} fontSize={12} textAnchor="middle" fontWeight={700}>
                DROPOUT (p = 0.1)
              </text>

              {/* Arrow */}
              <line x1={140} y1={270} x2={140} y2={285} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

              {/* Add & Norm 2 */}
              <rect
                x={60}
                y={285}
                width={160}
                height={30}
                rx={6}
                fill={`${C.blue}15`}
                stroke={C.blue}
                strokeWidth={1.5}
              />
              <text x={140} y={305} fill={C.blue} fontSize={11} textAnchor="middle" fontWeight={600}>
                Add & Norm
              </text>
            </svg>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}20`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffcc80" size={16}>
              Typical dropout rate in transformers: p = 0.1 (drop only 10%). This is much lower than the 0.5 used in
              earlier networks because transformers are already heavily regularized by their architecture.
            </T>
          </div>
        </Box>
      </Reveal>

      {sub < 6 && (
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

export const AdamOptimizer = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Problem with Plain SGD
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            In gradient descent (chapter 1.12), every parameter gets the same learning rate. But a neural network has
            millions of parameters, and they are not all equal. Some get massive gradients. Others get tiny ones. One
            learning rate cannot fit both.
          </T>
          <T color="#ef9a9a" bold size={16} style={{ marginTop: 14 }}>
            Imagine two parameters in the same network:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
              }}
            >
              <T color="#ef9a9a" bold size={16}>
                Parameter A - an embedding weight
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                Gradients are huge because many tokens flow through it.
              </T>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ color: C.dim, fontSize: 15 }}>step = </span>
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
                  0.001
                </span>
                <span style={{ color: C.dim, fontSize: 15 }}> x </span>
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
                  -50.0
                </span>
                <span style={{ color: C.dim, fontSize: 15 }}> = </span>
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
                  0.05
                </span>
              </div>
              <T color="#ef9a9a" size={14} style={{ marginTop: 6 }}>
                A step of 0.05 might be way too big - it could overshoot the minimum.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
              }}
            >
              <T color="#ef9a9a" bold size={16}>
                Parameter B - a deep layer bias
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 6 }}>
                Gradients are tiny because the signal gets diluted through many layers.
              </T>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ color: C.dim, fontSize: 15 }}>step = </span>
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
                  0.001
                </span>
                <span style={{ color: C.dim, fontSize: 15 }}> x </span>
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
                  -0.0003
                </span>
                <span style={{ color: C.dim, fontSize: 15 }}> = </span>
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
                  0.0000003
                </span>
              </div>
              <T color="#ef9a9a" size={14} style={{ marginTop: 6 }}>
                A step of 0.0000003 is almost nothing - this parameter barely learns.
              </T>
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#ef9a9a" bold size={16} center>
              The core problem
            </T>
            <T color="#ef9a9a" size={16} style={{ marginTop: 6 }}>
              Parameter A's step is 170,000x bigger than Parameter B's. If we lower the learning rate to fix A, B learns
              even slower. If we raise it to fix B, A explodes. SGD has no way to treat each parameter differently.
            </T>
          </div>
          <T color="#ef9a9a" size={17} style={{ marginTop: 14 }}>
            Adam solves this with two ideas: momentum (smoothing noisy gradients) and adaptive rates (giving each
            parameter its own effective learning rate). Let's build it up step by step.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Idea 1 - Momentum
          </T>
          <T color="#5eb3ff" size={17} style={{ marginTop: 12 }}>
            Instead of using only the current gradient, keep a running average called m (for "first moment"). This
            smooths out noisy zigzags and builds speed in consistent directions.
          </T>

          {/* SVG formula for momentum */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.blue}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 480 70" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
              <desc>
                Momentum formula: m_t equals beta_1 times m_(t-1) plus (1 minus beta_1) times g_t, showing exponential
                moving average of gradients
              </desc>
              {/* m_t */}
              <text x="10" y="38" fill={C.blue} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                m
              </text>
              <text x="26" y="46" fill={C.blue} fontSize="14" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* = */}
              <text x="50" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                =
              </text>
              {/* β₁ */}
              <text x="75" y="38" fill={C.purple} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="92" y="46" fill={C.purple} fontSize="14" fontFamily="serif">
                1
              </text>
              {/* · */}
              <text x="112" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                ·
              </text>
              {/* m_{t-1} */}
              <text x="130" y="38" fill={C.blue} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                m
              </text>
              <text x="148" y="46" fill={C.blue} fontSize="12" fontFamily="serif" fontStyle="italic">
                t-1
              </text>
              {/* + */}
              <text x="185" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                +
              </text>
              {/* (1 - β₁) */}
              <text x="210" y="38" fill={C.dim} fontSize="18" fontFamily="serif">
                (
              </text>
              <text x="220" y="38" fill={C.bright} fontSize="20" fontFamily="serif">
                1
              </text>
              <text x="236" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                -
              </text>
              <text x="258" y="38" fill={C.purple} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="275" y="46" fill={C.purple} fontSize="14" fontFamily="serif">
                1
              </text>
              <text x="288" y="38" fill={C.dim} fontSize="18" fontFamily="serif">
                )
              </text>
              {/* · */}
              <text x="305" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                ·
              </text>
              {/* g_t */}
              <text x="325" y="38" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                g
              </text>
              <text x="342" y="46" fill={C.green} fontSize="14" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* Annotations */}
              <text x="18" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                momentum
              </text>
              <text x="82" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                0.9
              </text>
              <text x="335" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                gradient
              </text>
            </svg>
          </div>

          <T color="#5eb3ff" size={16} style={{ marginTop: 4 }}>
            The default is β₁ = 0.9. That means 90% of the momentum comes from history, 10% from the current gradient.
            Think of it like a heavy ball rolling downhill: it does not change direction instantly.
          </T>

          <T color="#5eb3ff" bold size={17} style={{ marginTop: 16 }}>
            Concrete walkthrough - 4 gradient steps:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {[
              { step: 1, g: "+0.8", prev: "0", calc: "0.9 x 0 + 0.1 x 0.8", m: "+0.080" },
              { step: 2, g: "+0.6", prev: "0.08", calc: "0.9 x 0.08 + 0.1 x 0.6", m: "+0.132" },
              { step: 3, g: "-0.9", prev: "0.132", calc: "0.9 x 0.132 + 0.1 x (-0.9)", m: "+0.029" },
              { step: 4, g: "+0.7", prev: "0.029", calc: "0.9 x 0.029 + 0.1 x 0.7", m: "+0.096" },
            ].map(({ step, g, calc, m }) => (
              <div
                key={step}
                style={{
                  padding: "8px 12px",
                  background: `${C.blue}06`,
                  border: `1px solid ${C.blue}12`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.blue}15`,
                    borderRadius: 4,
                    color: "#5eb3ff",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  t = {step}
                </span>
                <span style={{ color: C.dim, fontSize: 14 }}>
                  g = <span style={{ color: C.green, fontWeight: 600 }}>{g}</span>
                </span>
                <span style={{ color: C.dim, fontSize: 13 }}>{calc}</span>
                <span style={{ color: C.dim, fontSize: 14 }}>=</span>
                <span
                  style={{
                    padding: "2px 8px",
                    background: `${C.cyan}15`,
                    borderRadius: 4,
                    color: C.cyan,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  m = {m}
                </span>
              </div>
            ))}
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 14 }}>
            At step 3, the gradient flips to -0.9, but momentum does not panic - it barely moves to +0.029. By step 4,
            when the positive signal returns, momentum recovers quickly. This is exactly what we want: smooth out noise,
            keep moving in the overall direction.
          </T>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.blue}06`,
              border: `1px solid ${C.blue}12`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#5eb3ff" bold size={15}>
              Why "exponential" moving average?
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              Each past gradient is weighted by 0.9 raised to a power: the gradient from 1 step ago gets weight 0.9,
              from 2 steps ago gets 0.81, from 10 steps ago gets 0.35. Recent gradients matter most, old ones fade
              exponentially.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Idea 2 - Adaptive Learning Rates
          </T>
          <T color="#b8a9ff" size={17} style={{ marginTop: 12 }}>
            Track the squared gradient magnitude for each parameter individually. This is called v (the "second
            moment"). Parameters with large gradients get smaller steps. Parameters with small gradients get larger
            steps.
          </T>

          {/* SVG formula for v */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.purple}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 500 70" style={{ width: "100%", maxWidth: 460, height: "auto" }}>
              <desc>
                Adaptive learning rate formula: v_t equals beta_2 times v_(t-1) plus (1 minus beta_2) times g_t squared,
                tracking average squared gradient magnitude per parameter
              </desc>
              {/* v_t */}
              <text x="10" y="38" fill={C.purple} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                v
              </text>
              <text x="24" y="46" fill={C.purple} fontSize="14" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* = */}
              <text x="48" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                =
              </text>
              {/* β₂ */}
              <text x="73" y="38" fill={C.orange} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="90" y="46" fill={C.orange} fontSize="14" fontFamily="serif">
                2
              </text>
              {/* · */}
              <text x="110" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                ·
              </text>
              {/* v_{t-1} */}
              <text x="128" y="38" fill={C.purple} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                v
              </text>
              <text x="144" y="46" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                t-1
              </text>
              {/* + */}
              <text x="183" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                +
              </text>
              {/* (1 - β₂) */}
              <text x="208" y="38" fill={C.dim} fontSize="18" fontFamily="serif">
                (
              </text>
              <text x="218" y="38" fill={C.bright} fontSize="20" fontFamily="serif">
                1
              </text>
              <text x="234" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                -
              </text>
              <text x="256" y="38" fill={C.orange} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="273" y="46" fill={C.orange} fontSize="14" fontFamily="serif">
                2
              </text>
              <text x="286" y="38" fill={C.dim} fontSize="18" fontFamily="serif">
                )
              </text>
              {/* · */}
              <text x="303" y="38" fill={C.dim} fontSize="22" fontFamily="serif">
                ·
              </text>
              {/* g_t² */}
              <text x="323" y="38" fill={C.green} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                g
              </text>
              <text x="340" y="46" fill={C.green} fontSize="14" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="354" y="26" fill={C.green} fontSize="16" fontFamily="serif" fontWeight="700">
                2
              </text>
              {/* Annotations */}
              <text x="12" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                velocity
              </text>
              <text x="80" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                0.999
              </text>
              <text x="335" y="64" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                squared grad
              </text>
            </svg>
          </div>

          <T color="#b8a9ff" size={16} style={{ marginTop: 4 }}>
            The default is β₂ = 0.999. This tracks how "large" gradients typically are for each parameter by averaging
            their squares over time.
          </T>

          <T color="#b8a9ff" bold size={17} style={{ marginTop: 16 }}>
            How does v create per-parameter learning rates?
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 6 }}>
            In the final update, we divide by √v. Watch what happens:
          </T>

          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
              }}
            >
              <T color="#ef9a9a" bold size={16} center>
                Parameter A
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                Typical gradient: 50
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                v tracks 50² = 2,500
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                Divide by √2500 = 50
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: "4px 8px",
                  background: `${C.red}10`,
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <T color={C.red} bold size={15}>
                  Effective rate: lr / 50
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Big gradients get tamed automatically.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
              }}
            >
              <T color="#80e8a5" bold size={16} center>
                Parameter B
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 8 }}>
                Typical gradient: 0.01
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                v tracks 0.01² = 0.0001
              </T>
              <T color={C.dim} size={15} style={{ marginTop: 4 }}>
                Divide by √0.0001 = 0.01
              </T>
              <div
                style={{
                  marginTop: 8,
                  padding: "4px 8px",
                  background: `${C.green}10`,
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <T color={C.green} bold size={15}>
                  Effective rate: lr / 0.01
                </T>
              </div>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Small gradients get boosted automatically.
              </T>
            </div>
          </div>

          <div
            style={{
              padding: "10px 14px",
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#b8a9ff" size={16}>
              The result: Parameter A's effective learning rate is 5,000x smaller than Parameter B's. Each parameter
              automatically gets a step size proportional to its gradient scale. The same learning rate α works for both
              - √v handles the rest.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Bias Correction - Fixing the Cold Start
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            Both m and v are initialized to zero before training begins. In the first few steps, these running averages
            are biased toward zero because they have not had enough data to "warm up." Adam applies a mathematical
            correction to fix this.
          </T>

          <T color="#80e8a5" bold size={16} style={{ marginTop: 14 }}>
            Why is this a problem?
          </T>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <T color={C.dim} size={15}>
              At step 1 with β₁ = 0.9, the momentum formula gives m₁ = 0.9 x 0 + 0.1 x g₁ = 0.1 x g₁. We only captured
              10% of the true gradient. The other 90% was multiplied by zero (the initialization). Our estimate of the
              gradient direction is 10x too small.
            </T>
          </div>

          {/* SVG formula for bias correction */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.green}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 380 90" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
              <desc>
                Bias correction formulas: m-hat_t equals m_t divided by (1 minus beta_1 to the power t), and v-hat_t
                equals v_t divided by (1 minus beta_2 to the power t), correcting for zero initialization
              </desc>
              {/* m-hat_t = m_t / (1 - β₁^t) */}
              <text x="10" y="30" fill={C.blue} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                m
              </text>
              <text x="27" y="18" fill={C.blue} fontSize="14" fontFamily="serif">
                ^
              </text>
              <text x="35" y="38" fill={C.blue} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="58" y="30" fill={C.dim} fontSize="20" fontFamily="serif">
                =
              </text>
              {/* fraction */}
              <text
                x="130"
                y="20"
                fill={C.blue}
                fontSize="20"
                fontFamily="serif"
                fontStyle="italic"
                textAnchor="middle"
              >
                m
              </text>
              <text x="144" y="26" fill={C.blue} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <line x1="85" y1="30" x2="185" y2="30" stroke={C.bright} strokeWidth="1.2" />
              <text x="94" y="50" fill={C.dim} fontSize="16" fontFamily="serif">
                1 -
              </text>
              <text x="128" y="50" fill={C.purple} fontSize="18" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="144" y="56" fill={C.purple} fontSize="11" fontFamily="serif">
                1
              </text>
              <text x="155" y="40" fill={C.bright} fontSize="14" fontFamily="serif" fontWeight="700">
                t
              </text>

              {/* v-hat_t = v_t / (1 - β₂^t) */}
              <text x="200" y="30" fill={C.purple} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                v
              </text>
              <text x="215" y="18" fill={C.purple} fontSize="14" fontFamily="serif">
                ^
              </text>
              <text x="223" y="38" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="246" y="30" fill={C.dim} fontSize="20" fontFamily="serif">
                =
              </text>
              <text
                x="318"
                y="20"
                fill={C.purple}
                fontSize="20"
                fontFamily="serif"
                fontStyle="italic"
                textAnchor="middle"
              >
                v
              </text>
              <text x="330" y="26" fill={C.purple} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <line x1="272" y1="30" x2="375" y2="30" stroke={C.bright} strokeWidth="1.2" />
              <text x="282" y="50" fill={C.dim} fontSize="16" fontFamily="serif">
                1 -
              </text>
              <text x="316" y="50" fill={C.orange} fontSize="18" fontFamily="serif" fontStyle="italic" fontWeight="700">
                β
              </text>
              <text x="332" y="56" fill={C.orange} fontSize="11" fontFamily="serif">
                2
              </text>
              <text x="343" y="40" fill={C.bright} fontSize="14" fontFamily="serif" fontWeight="700">
                t
              </text>

              {/* Annotations */}
              <text x="10" y="78" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                corrected momentum
              </text>
              <text x="200" y="78" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                corrected velocity
              </text>
            </svg>
          </div>

          <T color="#80e8a5" bold size={16} style={{ marginTop: 4 }}>
            How much does the correction actually change?
          </T>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.yellow} bold size={16} center>
                t = 1 (first step)
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                <T color={C.dim} size={15}>
                  1 - β₁¹ = 1 - 0.9 = 0.1
                </T>
                <T color={C.dim} size={15}>
                  m-hat = m₁ / 0.1
                </T>
                <div
                  style={{
                    marginTop: 4,
                    padding: "3px 8px",
                    background: `${C.yellow}10`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  <T color={C.yellow} bold size={15}>
                    10x boost
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  The correction is massive - m only captured 10% of the true value, so we multiply by 10 to compensate.
                </T>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
                borderRadius: 8,
              }}
            >
              <T color={C.cyan} bold size={16} center>
                t = 1000 (late training)
              </T>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                <T color={C.dim} size={15}>
                  1 - 0.9¹⁰⁰⁰ = 1 - 0 = 1.0
                </T>
                <T color={C.dim} size={15}>
                  m-hat = m₁₀₀₀ / 1.0
                </T>
                <div
                  style={{
                    marginTop: 4,
                    padding: "3px 8px",
                    background: `${C.cyan}10`,
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={15}>
                    No change
                  </T>
                </div>
                <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                  After many steps, 0.9¹⁰⁰⁰ is essentially 0. The denominator is 1, so the correction vanishes
                  completely.
                </T>
              </div>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 14 }}>
            The same logic applies to v-hat with β₂ = 0.999. At t = 1, the correction is 1,000x. By t = 5000, it is
            gone. Bias correction is only significant during the first few hundred steps.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 4}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            The Full Adam Update Rule
          </T>
          <T color="#ffe082" size={17} style={{ marginTop: 12 }}>
            Combine momentum, adaptive rates, and bias correction into one formula:
          </T>

          {/* SVG formula for full Adam update */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.yellow}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 440 100" style={{ width: "100%", maxWidth: 420, height: "auto" }}>
              <desc>
                Full Adam update rule: theta_(t+1) equals theta_t minus alpha times m-hat_t divided by (square root of
                v-hat_t plus epsilon), combining momentum, adaptive rates, and bias correction
              </desc>
              {/* θ_{t+1} */}
              <text x="10" y="50" fill={C.cyan} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                θ
              </text>
              <text x="28" y="58" fill={C.cyan} fontSize="12" fontFamily="serif" fontStyle="italic">
                t+1
              </text>
              {/* = */}
              <text x="60" y="50" fill={C.dim} fontSize="22" fontFamily="serif">
                =
              </text>
              {/* θ_t */}
              <text x="85" y="50" fill={C.cyan} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                θ
              </text>
              <text x="103" y="58" fill={C.cyan} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* - */}
              <text x="125" y="50" fill={C.dim} fontSize="22" fontFamily="serif">
                -
              </text>
              {/* α */}
              <text x="148" y="50" fill={C.purple} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                α
              </text>
              {/* · */}
              <text x="168" y="50" fill={C.dim} fontSize="22" fontFamily="serif">
                ·
              </text>
              {/* Fraction: m-hat_t / (√v-hat_t + ε) */}
              {/* Numerator */}
              <text
                x="280"
                y="35"
                fill={C.blue}
                fontSize="22"
                fontFamily="serif"
                fontStyle="italic"
                fontWeight="700"
                textAnchor="middle"
              >
                m
              </text>
              <text x="295" y="22" fill={C.blue} fontSize="14" fontFamily="serif">
                ^
              </text>
              <text x="303" y="40" fill={C.blue} fontSize="12" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* Fraction line */}
              <line x1="195" y1="48" x2="370" y2="48" stroke={C.bright} strokeWidth="1.5" />
              {/* Denominator: √v-hat_t + ε */}
              <text x="208" y="72" fill={C.bright} fontSize="20" fontFamily="serif">
                √
              </text>
              <text x="230" y="72" fill={C.green} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                v
              </text>
              <text x="245" y="60" fill={C.green} fontSize="12" fontFamily="serif">
                ^
              </text>
              <text x="253" y="76" fill={C.green} fontSize="11" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="278" y="72" fill={C.dim} fontSize="20" fontFamily="serif">
                +
              </text>
              <text x="308" y="72" fill={C.orange} fontSize="22" fontFamily="serif" fontStyle="italic" fontWeight="700">
                ε
              </text>
              {/* Annotations */}
              <text x="10" y="92" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                new weight
              </text>
              <text x="85" y="92" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                old weight
              </text>
              <text x="143" y="92" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                learning rate
              </text>
            </svg>
          </div>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { sym: "θ", desc: "the parameter value (a single weight or bias)", c: C.cyan },
              { sym: "α", desc: "learning rate (typically 0.001)", c: C.purple },
              { sym: "m-hat", desc: "bias-corrected momentum - which direction to go", c: C.blue },
              { sym: "v-hat", desc: "bias-corrected velocity - how much to scale the step", c: C.green },
              { sym: "ε", desc: "tiny constant (1e-8) to prevent division by zero", c: C.orange },
            ].map(({ sym, desc, c }) => (
              <div key={sym} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    padding: "3px 10px",
                    background: `${c}10`,
                    borderRadius: 6,
                    border: `1px solid ${c}20`,
                    minWidth: 74,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: c, fontSize: 15, fontWeight: 700, fontStyle: "italic", fontFamily: "serif" }}>
                    {sym}
                  </span>
                </div>
                <T color={C.dim} size={15} style={{ paddingTop: 2 }}>
                  {desc}
                </T>
              </div>
            ))}
          </div>

          <T color="#ffe082" bold size={17} style={{ marginTop: 18 }}>
            Full numerical walkthrough (t = 1):
          </T>
          <div
            style={{
              padding: "12px 14px",
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <T color={C.dim} size={15}>
                <span style={{ color: C.cyan, fontWeight: 600 }}>θ = 0.500</span>,{" "}
                <span style={{ color: C.green, fontWeight: 600 }}>g₁ = 0.4</span>,{" "}
                <span style={{ color: C.purple, fontWeight: 600 }}>α = 0.001</span>
              </T>

              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                <span style={{ color: "#5eb3ff" }}>Step 1:</span> m₁ = 0.9 x 0 + 0.1 x 0.4 ={" "}
                <span style={{ color: C.blue, fontWeight: 600 }}>0.04</span>
              </T>
              <T color={C.dim} size={14}>
                <span style={{ color: "#5eb3ff" }}>Step 2:</span> v₁ = 0.999 x 0 + 0.001 x 0.4² = 0.001 x 0.16 ={" "}
                <span style={{ color: C.green, fontWeight: 600 }}>0.00016</span>
              </T>
              <T color={C.dim} size={14}>
                <span style={{ color: "#5eb3ff" }}>Step 3:</span> m-hat = 0.04 / (1 - 0.9) = 0.04 / 0.1 ={" "}
                <span style={{ color: C.blue, fontWeight: 600 }}>0.4</span>
              </T>
              <T color={C.dim} size={14}>
                <span style={{ color: "#5eb3ff" }}>Step 4:</span> v-hat = 0.00016 / (1 - 0.999) = 0.00016 / 0.001 ={" "}
                <span style={{ color: C.green, fontWeight: 600 }}>0.16</span>
              </T>
              <T color={C.dim} size={14}>
                <span style={{ color: "#5eb3ff" }}>Step 5:</span> update = 0.001 x 0.4 / (√0.16 + 1e-8) = 0.001 x 0.4 /
                0.4 = <span style={{ color: C.purple, fontWeight: 600 }}>0.001</span>
              </T>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ color: C.dim, fontSize: 15 }}>θ₂ = 0.500 - 0.001 = </span>
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
                  0.499
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <T color="#ffe082" bold size={15}>
              Notice something remarkable
            </T>
            <T color={C.dim} size={15} style={{ marginTop: 4 }}>
              At t = 1 with bias correction, the effective step is almost exactly α = 0.001 regardless of the gradient
              magnitude. That is the beauty of Adam: the step size is naturally bounded near α, while the direction
              comes from momentum.
            </T>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            AdamW - Weight Decay Done Right
          </T>
          <T color="#ffcc80" size={17} style={{ marginTop: 12 }}>
            Weight decay is a regularization technique that shrinks all weights slightly each step, preventing them from
            growing too large. The original Adam paper mixed weight decay into the gradient, but this was a mistake.
          </T>

          <T color="#ffcc80" bold size={16} style={{ marginTop: 14 }}>
            The problem with L2 regularization in Adam
          </T>
          <T color="#ffcc80" size={16} style={{ marginTop: 6 }}>
            Standard L2 adds a decay term (λ x θ) to the gradient before Adam processes it. But Adam divides by √v - and
            that √v includes the decay term. So parameters with large v (large gradients) barely feel the decay, while
            parameters with small v get too much. The decay is not applied equally.
          </T>

          {/* SVG formula for AdamW */}
          <div
            style={{
              margin: "16px 0",
              padding: "18px 12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: `1px solid ${C.orange}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 480 100" style={{ width: "100%", maxWidth: 450, height: "auto" }}>
              <desc>
                AdamW update rule: theta_(t+1) equals theta_t minus alpha times (m-hat_t divided by (square root of
                v-hat_t plus epsilon) plus lambda times theta_t), with decoupled weight decay applied directly
              </desc>
              {/* θ_{t+1} */}
              <text x="10" y="48" fill={C.cyan} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                θ
              </text>
              <text x="26" y="56" fill={C.cyan} fontSize="11" fontFamily="serif" fontStyle="italic">
                t+1
              </text>
              {/* = */}
              <text x="55" y="48" fill={C.dim} fontSize="20" fontFamily="serif">
                =
              </text>
              {/* θ_t */}
              <text x="78" y="48" fill={C.cyan} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                θ
              </text>
              <text x="94" y="56" fill={C.cyan} fontSize="11" fontFamily="serif" fontStyle="italic">
                t
              </text>
              {/* - α · ( */}
              <text x="115" y="48" fill={C.dim} fontSize="20" fontFamily="serif">
                -
              </text>
              <text x="136" y="48" fill={C.purple} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                α
              </text>
              <text x="155" y="48" fill={C.dim} fontSize="20" fontFamily="serif">
                ·
              </text>
              <text x="168" y="48" fill={C.dim} fontSize="22" fontFamily="serif">
                (
              </text>
              {/* Fraction: m-hat / (√v-hat + ε) */}
              <text
                x="240"
                y="32"
                fill={C.blue}
                fontSize="18"
                fontFamily="serif"
                fontStyle="italic"
                fontWeight="700"
                textAnchor="middle"
              >
                m
              </text>
              <text x="253" y="22" fill={C.blue} fontSize="11" fontFamily="serif">
                ^
              </text>
              <text x="260" y="36" fill={C.blue} fontSize="10" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <line x1="195" y1="42" x2="295" y2="42" stroke={C.bright} strokeWidth="1.2" />
              <text x="200" y="64" fill={C.bright} fontSize="16" fontFamily="serif">
                √
              </text>
              <text x="218" y="64" fill={C.green} fontSize="16" fontFamily="serif" fontStyle="italic" fontWeight="700">
                v
              </text>
              <text x="230" y="54" fill={C.green} fontSize="10" fontFamily="serif">
                ^
              </text>
              <text x="237" y="68" fill={C.green} fontSize="10" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="254" y="64" fill={C.dim} fontSize="16" fontFamily="serif">
                +
              </text>
              <text x="276" y="64" fill={C.orange} fontSize="18" fontFamily="serif" fontStyle="italic" fontWeight="700">
                ε
              </text>
              {/* + λ · θ_t ) */}
              <text x="310" y="48" fill={C.dim} fontSize="20" fontFamily="serif">
                +
              </text>
              <text x="336" y="48" fill={C.red} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                λ
              </text>
              <text x="356" y="48" fill={C.dim} fontSize="20" fontFamily="serif">
                ·
              </text>
              <text x="374" y="48" fill={C.cyan} fontSize="20" fontFamily="serif" fontStyle="italic" fontWeight="700">
                θ
              </text>
              <text x="390" y="56" fill={C.cyan} fontSize="11" fontFamily="serif" fontStyle="italic">
                t
              </text>
              <text x="408" y="48" fill={C.dim} fontSize="22" fontFamily="serif">
                )
              </text>
              {/* Annotations */}
              <text x="195" y="88" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                Adam step (unchanged)
              </text>
              <text x="330" y="88" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="sans-serif">
                decay (separate)
              </text>
            </svg>
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                borderRadius: 8,
              }}
            >
              <T color="#ef9a9a" bold size={16} center>
                L2 in Adam
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Decay is added to the gradient, then divided by √v.
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Parameters with large v feel almost no decay.
              </T>
              <T color={C.red} bold size={14} style={{ marginTop: 6 }}>
                Decay strength varies per parameter - unintended.
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                borderRadius: 8,
              }}
            >
              <T color="#80e8a5" bold size={16} center>
                AdamW
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 8 }}>
                Decay is applied directly to θ, outside of Adam.
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Every parameter gets the exact same decay rate λ.
              </T>
              <T color={C.green} bold size={14} style={{ marginTop: 6 }}>
                Clean separation - decay is uniform as intended.
              </T>
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#ffcc80" bold size={16}>
              Why this matters in practice
            </T>
            <T color="#ffcc80" size={16} style={{ marginTop: 6 }}>
              GPT, BERT, LLaMA, Gemini, Claude - virtually all modern transformers use AdamW with β₁ = 0.9, β₂ = 0.999,
              ε = 1e-8, and λ between 0.01 and 0.1. The 2017 paper by Loshchilov and Hutter showed that decoupled weight
              decay consistently improves generalization. AdamW is not just an option - it is the default optimizer for
              deep learning.
            </T>
          </div>

          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <T color="#ffcc80" bold size={16}>
              The complete Adam/AdamW recipe:
            </T>
            {[
              { step: "1", text: "Compute gradient g for the current mini-batch", c: C.green },
              { step: "2", text: "Update momentum: m = β₁ x m + (1 - β₁) x g", c: C.blue },
              { step: "3", text: "Update velocity: v = β₂ x v + (1 - β₂) x g²", c: C.purple },
              { step: "4", text: "Bias-correct: m-hat = m / (1 - β₁ᵗ), v-hat = v / (1 - β₂ᵗ)", c: C.green },
              { step: "5", text: "Update: θ = θ - α x (m-hat / (√v-hat + ε) + λ x θ)", c: C.yellow },
            ].map(({ step, text, c }) => (
              <div key={step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    padding: "2px 8px",
                    background: `${c}10`,
                    borderRadius: 6,
                    border: `1px solid ${c}20`,
                    minWidth: 28,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: c, fontSize: 14, fontWeight: 700 }}>{step}</span>
                </div>
                <T color={C.dim} size={15} style={{ paddingTop: 1 }}>
                  {text}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      {sub < 5 && (
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

export const LRWarmupDecay = (ctx) => {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            Why a Constant Learning Rate Fails
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            No single learning rate works well for the entire training process. Too high and you diverge. Too low and
            you never converge.
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.red}08`,
                border: `1px solid ${C.red}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.red}15`,
                    borderRadius: 4,
                    color: C.red,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.01
                </span>
                <T color={C.dim} size={15}>
                  Loss explodes to NaN after a few steps
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", height: "100%", background: `${C.red}60`, borderRadius: 4 }} />
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.yellow}15`,
                    borderRadius: 4,
                    color: C.yellow,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.0001
                </span>
                <T color={C.dim} size={15}>
                  Training crawls - still not converged after 100K steps
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "20%", height: "100%", background: `${C.yellow}60`, borderRadius: 4 }} />
              </div>
            </div>
            <div
              style={{
                padding: "10px 14px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    padding: "2px 10px",
                    background: `${C.green}15`,
                    borderRadius: 4,
                    color: C.green,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  lr = 0.001
                </span>
                <T color={C.dim} size={15}>
                  Works OK... but still not optimal for the whole run
                </T>
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 10,
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "65%", height: "100%", background: `${C.green}60`, borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 14 }}>
            The best learning rate changes over the course of training. Early on you need small steps. In the middle,
            larger steps. Near the end, small steps again.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Warmup - Start Tiny, Ramp Up
          </T>
          <T color="#5eb3ff" size={17} style={{ marginTop: 12 }}>
            At step 1, weights are random garbage. Gradients are noisy and unreliable. A large learning rate plus bad
            gradients equals immediate divergence.
          </T>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Graph
              points={[
                [0, 0],
                [400, 0.0002],
                [800, 0.0004],
                [1200, 0.0006],
                [1600, 0.0008],
                [2000, 0.001],
              ]}
              color={C.blue}
              width={300}
              height={140}
              xLabel="Step"
              yLabel="LR"
              title="Linear Warmup (2000 steps)"
              desc="Line graph showing learning rate increasing linearly from zero during warmup phase over 2000 training steps"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.blue}15`,
                  borderRadius: 4,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 0
              </span>
              <T color={C.dim} size={14}>
                lr = 0 (no updates yet)
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.blue}15`,
                  borderRadius: 4,
                  color: "#5eb3ff",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 1000
              </span>
              <T color={C.dim} size={14}>
                lr = 0.0005 (halfway to peak)
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "2px 8px",
                  background: `${C.green}15`,
                  borderRadius: 4,
                  color: C.green,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Step 2000
              </span>
              <T color={C.dim} size={14}>
                lr = 0.001 (peak reached)
              </T>
            </div>
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            Small LR lets the model "find its footing" before taking bigger steps. The gradients stabilize as the
            weights move toward a reasonable region of the loss landscape.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Cosine Decay - Smooth Descent
          </T>
          <T color="#80e8a5" size={17} style={{ marginTop: 12 }}>
            After warmup, smoothly decrease the LR following a cosine curve. The formula:
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
            <T color={C.green} bold size={16} style={{ fontFamily: "monospace" }}>
              lr = lr_min + 0.5 x (lr_max - lr_min) x (1 + cos(pi x step / total))
            </T>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Graph
              points={[
                [0, 0],
                [500, 0.00025],
                [1000, 0.0005],
                [1500, 0.00075],
                [2000, 0.001],
                [3000, 0.000927],
                [4000, 0.000854],
                [5000, 0.000691],
                [6000, 0.0005],
                [7000, 0.000309],
                [8000, 0.000146],
                [9000, 0.000024],
                [10000, 0],
              ]}
              color={C.green}
              width={320}
              height={150}
              xLabel="Step"
              yLabel="LR"
              title="Warmup + Cosine Decay"
              desc="Line graph showing learning rate with linear warmup to a peak then smooth cosine decay to zero, illustrating the complete LR schedule"
              annotations={[{ x: 2000, y: 0.001, text: "Peak", color: C.yellow }]}
            />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: `${C.blue}08`,
                border: `1px solid ${C.blue}20`,
                borderRadius: 8,
              }}
            >
              <T color="#5eb3ff" bold size={14} center>
                Warmup Phase
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Steps 0-2000: Linear ramp from 0 to peak
              </T>
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: `${C.green}08`,
                border: `1px solid ${C.green}20`,
                borderRadius: 8,
              }}
            >
              <T color="#80e8a5" bold size={14} center>
                Decay Phase
              </T>
              <T color={C.dim} size={13} style={{ marginTop: 4 }}>
                Steps 2000+: Cosine curve gently reduces to minimum
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Real-World Schedule: GPT-3
          </T>
          <T color="#ffe082" size={17} style={{ marginTop: 12 }}>
            Here is the actual schedule used to train GPT-3 (175 billion parameters):
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {[
              { label: "Warmup", value: "375M tokens (~2,000 steps)", color: C.blue },
              { label: "Peak LR", value: "6 x 10^-4 (0.0006)", color: C.green },
              { label: "Decay over", value: "300B tokens (cosine schedule)", color: C.purple },
              { label: "Min LR", value: "6 x 10^-5 (10% of peak)", color: C.orange },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  padding: "10px 14px",
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  borderRadius: 8,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "4px 12px",
                    background: `${color}15`,
                    borderRadius: 4,
                    minWidth: 100,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <T color={color} bold size={14}>
                    {label}
                  </T>
                </div>
                <T color={C.dim} size={15}>
                  {value}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: `${C.yellow}08`,
              border: `1px solid ${C.yellow}20`,
              borderRadius: 8,
              marginTop: 14,
            }}
          >
            <T color="#ffe082" bold size={16}>
              Why cosine and not linear decay?
            </T>
            <T color="#ffe082" size={15} style={{ marginTop: 6 }}>
              Cosine spends more time at useful learning rates (the middle range) and approaches zero very gradually.
              Linear decay spends equal time at every LR, wasting steps at near-zero rates where no meaningful learning
              occurs.
            </T>
          </div>
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

export const WeightInit = (ctx) => {
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
};
