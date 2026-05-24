import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function BatchTraining(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Why batch training? Efficiency and stability.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Imagine training on 1 trillion tokens. Do we update weights after every single token? No - that's wasteful
            and noisy.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            Instead, we group examples into <strong>batches</strong>, compute loss for all of them, then update once.
            This is faster and more stable.
          </T>
        </Box>
      )}

      <Reveal when={sub >= 1}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Online vs Batch training - a concrete example
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            Say we have 3 training examples. Each produces a loss.
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                method: "Online (update after each example)",
                steps: [
                  "Ex1: loss=1.2 → compute gradients → update weights",
                  "Ex2: loss=0.8 → compute gradients → update weights",
                  "Ex3: loss=1.5 → compute gradients → update weights",
                ],
                upd_count: "3 weight updates",
                speed: "Slow. GPU not fully utilized.",
                stability: "Noisy. One bad example can derail training.",
                color: C.red,
              },
              {
                method: "Batch (update after all examples)",
                steps: [
                  "Ex1: loss=1.2",
                  "Ex2: loss=0.8",
                  "Ex3: loss=1.5",
                  "Avg loss = (1.2+0.8+1.5)/3 = 1.17 → compute gradients ONCE → update weights",
                ],
                upd_count: "1 weight update",
                speed: "Fast. GPU fully parallelized.",
                stability: "Smooth. Noise averages out.",
                color: C.green,
              },
            ].map(({ method, steps, upd_count, speed, stability, color }) => (
              <div
                key={method}
                style={{ padding: "12px", borderRadius: 8, background: `${color}06`, border: `1px solid ${color}12` }}
              >
                <T color={color} bold size={17}>
                  {method}
                </T>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                  {steps.map((step, i) => (
                    <T key={i} color={C.dim} size={14}>
                      • {step}
                    </T>
                  ))}
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                  <T color={C.mid} size={13}>
                    <strong>Updates:</strong> {upd_count}
                  </T>
                  <T color={C.mid} size={13}>
                    <strong>Speed:</strong> {speed}
                  </T>
                </div>
                <T color={C.mid} size={13} style={{ marginTop: 6 }}>
                  <strong>Stability:</strong> {stability}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            Gradient averaging in batches
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Each example computes its own gradient. With batching, we average them before updating.
          </T>
          <div
            style={{
              marginTop: 12,
              fontFamily: "monospace",
              padding: "12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                "Ex1: gradient w.r.t weight = [0.05, -0.02, 0.08]",
                "Ex2: gradient w.r.t weight = [0.01, 0.03, -0.01]",
                "Ex3: gradient w.r.t weight = [0.02, 0.02, 0.04]",
                "",
                "Batch avg gradient = sum / 3 = [0.027, 0.010, 0.037]",
                "",
                "Update: weight -= lr * avg_gradient",
                "         (usually lr = 0.0001 to 0.001)",
              ].map((line, i) => (
                <T key={i} color={line.includes("avg") ? C.yellow : C.dim} size={14}>
                  {line}
                </T>
              ))}
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            How batch size affects training
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            Batch size is a key hyperparameter. Different sizes have tradeoffs:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                batch: "Batch size = 1",
                speed: "Very slow",
                memory: "Minimal",
                noise: "High (noisy gradient)",
                quality: "Can get stuck",
                use: "Research only",
              },
              {
                batch: "Batch size = 32",
                speed: "Slow",
                memory: "Low",
                noise: "Medium",
                quality: "Reasonable",
                use: "Small GPUs",
              },
              {
                batch: "Batch size = 256",
                speed: "Fast",
                memory: "Medium",
                noise: "Low (smooth)",
                quality: "Good",
                use: "Standard",
              },
              {
                batch: "Batch size = 1024+",
                speed: "Very fast",
                memory: "High",
                noise: "Very low",
                quality: "Excellent",
                use: "Large-scale training",
              },
            ].map(({ batch, speed, memory, noise, quality, use }) => (
              <div key={batch} style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}>
                <T color={C.green} bold size={15}>
                  {batch}
                </T>
                <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.dim }}>Speed: {speed}</span>
                  <span style={{ fontSize: 12, color: C.dim }}>Memory: {memory}</span>
                  <span style={{ fontSize: 12, color: C.dim }}>Noise: {noise}</span>
                  <span style={{ fontSize: 12, color: C.dim }}>Quality: {quality}</span>
                  <span style={{ fontSize: 12, color: C.mid }}>({use})</span>
                </div>
              </div>
            ))}
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
