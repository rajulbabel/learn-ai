import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function SameBuildingBlocks(ctx) {
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
}
