import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function Derivatives(ctx) {
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
}
