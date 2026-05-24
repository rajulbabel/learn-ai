import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function GradientDescent(ctx) {
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
}

// ═══════ 1.13 Backprop Through the Real Network ═══════
