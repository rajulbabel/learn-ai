import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function BackwardPass(ctx) {
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
}
