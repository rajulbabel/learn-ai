import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function ActivationFunctions(ctx) {
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
}
