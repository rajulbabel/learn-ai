import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhyLinear(ctx) {
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
}
