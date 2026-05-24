import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function AdamOptimizer(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Problem with Plain SGD
          </T>
          <T color="#ef9a9a" size={17} style={{ marginTop: 12 }}>
            In gradient descent (<ChapterLink to="2.5">chapter 2.5</ChapterLink>), every parameter gets the same learning rate. But a neural network has
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
              <text
                x="18"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                momentum
              </text>
              <text
                x="82"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                0.9
              </text>
              <text
                x="335"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
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
              <text
                x="12"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                velocity
              </text>
              <text
                x="80"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                0.999
              </text>
              <text
                x="335"
                y="64"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
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
}
