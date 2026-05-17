import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function LossFunction(ctx) {
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
}
