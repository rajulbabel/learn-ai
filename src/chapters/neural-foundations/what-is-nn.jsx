import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhatIsNN(ctx) {
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
}
