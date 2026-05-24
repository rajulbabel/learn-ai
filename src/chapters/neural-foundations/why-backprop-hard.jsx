import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function WhyBackpropHard(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: Our network was easy - only 2 layers */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            Our 2-Layer Network Was the Easy Case
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>
            For w₁₁, the chain had 4 multiplications: dLoss/dy x dy/dh₁ x dReLU/dz₁ x dz₁/dw₁₁. That is manageable.
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 8 }}>
            But modern networks have 50, 100, or even 1000+ layers. GPT-4 has 120 layers. For a weight in layer 1 of a
            120-layer network, the chain rule has 120+ multiplications.
          </T>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {["Layer 1", "Layer 2", "Layer 3", "Layer 4", "Layer 5"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: `${C.cyan}10`,
                    border: `1px solid ${C.cyan}30`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.cyan} bold size={13}>
                    {label}
                  </T>
                </div>
                {i < 4 && (
                  <T color={C.dim} size={14}>
                    ×
                  </T>
                )}
              </div>
            ))}
            <T color={C.dim} size={14} style={{ margin: "0 4px" }}>
              ... ×
            </T>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: `${C.red}10`,
                border: `1px solid ${C.red}30`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={13}>
                Loss
              </T>
            </div>
          </div>
          <T color={C.dim} size={13} center style={{ marginTop: 8 }}>
            120 multiplications chained together
          </T>
        </Box>
      )}

      {/* Sub 1: Vanishing gradients */}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={20}>
            The Vanishing Gradient Problem
          </T>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            If each derivative in the chain is less than 1, the product shrinks exponentially:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layers: "2 layers", calc: "0.5 x 0.5", result: "0.25", bar: 25 },
              { layers: "5 layers", calc: "0.5\u2075", result: "0.031", bar: 3.1 },
              { layers: "10 layers", calc: "0.5\u00B9\u2070", result: "0.001", bar: 0.5 },
              { layers: "50 layers", calc: "0.5\u2075\u2070", result: "0.000000000000001", bar: 0 },
            ].map(({ layers, calc: _calc, result, bar }) => (
              <div key={layers} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
                <T color={C.dim} size={13} style={{ minWidth: 75, textAlign: "right" }}>
                  {layers}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(bar, 0.3)}%`,
                      height: "100%",
                      background: C.red,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <T color={C.red} bold size={12} style={{ minWidth: 120, textAlign: "right" }}>
                  {result}
                </T>
              </div>
            ))}
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10 }}>
            At 50 layers, the gradient is essentially zero. The early layers never learn because the gradient signal has
            completely vanished by the time it reaches them. It is like whispering a message through 50 people - by the
            end, nothing is left.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Exploding gradients */}
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            The Exploding Gradient Problem
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            The opposite problem: if each derivative is greater than 1, the product grows exponentially:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { layers: "2 layers", calc: "2 x 2", result: "4", bar: 0.4 },
              { layers: "5 layers", calc: "2\u2075", result: "32", bar: 3.2 },
              { layers: "10 layers", calc: "2\u00B9\u2070", result: "1,024", bar: 20 },
              { layers: "50 layers", calc: "2\u2075\u2070", result: "1,125,899,906,842,624", bar: 100 },
            ].map(({ layers, calc: _calc, result, bar }) => (
              <div key={layers} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px" }}>
                <T color={C.dim} size={13} style={{ minWidth: 75, textAlign: "right" }}>
                  {layers}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(bar, 100)}%`,
                      height: "100%",
                      background: C.orange,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <T color={C.orange} bold size={12} style={{ minWidth: 140, textAlign: "right" }}>
                  {result}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            At 50 layers, the gradient is astronomically large. Weight updates become wild jumps that overshoot the
            minimum and the network diverges - the loss goes to infinity instead of zero. Training crashes.
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Solutions */}
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Solutions That Made Deep Learning Work
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            These problems held back AI for decades. Here is what finally solved them:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={16}>
                ReLU Activation (instead of sigmoid)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Sigmoid's derivative is at most 0.25 - guaranteed to vanish. ReLU's derivative is exactly 1 for positive
                inputs - no shrinkage. This alone was a breakthrough.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold size={16}>
                Residual Connections (Skip Connections)
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Instead of output = f(input), use output = input + f(input). The gradient for "input" is always 1 - it
                flows straight through the skip connection, no matter how deep the network. The Transformer uses this
                everywhere.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold size={16}>
                Layer Normalization
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Keep activations in a stable range at every layer. Prevents both tiny and huge values from accumulating
                through the network. We will see this in Section 8.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={16}>
                Careful Weight Initialization
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 4 }}>
                Start weights in a range that keeps gradients close to 1. Too large = explosion. Too small = vanishing.
                Methods like "He initialization" and "Xavier initialization" solve this mathematically.
              </T>
            </div>
          </div>
        </Box>
      </Reveal>

      {/* Sub 4: Why this matters */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            Why This Matters for Everything Ahead
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Every architecture choice in the Transformer - residual connections, layer normalization, scaled dot-product
            attention - exists partly to solve these gradient problems. When you see "Add & Norm" in the Transformer
            diagram, you will know exactly why it is there: to keep gradients healthy so backprop works through 120
            layers.
          </T>
          <div
            style={{
              marginTop: 12,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.blue}25`,
            }}
          >
            <T color={C.bright} size={16} center>
              Backpropagation is the single most important algorithm in deep learning. Every model you have ever used -
              GPT, DALL-E, AlphaGo - learned through this exact process: forward pass, compute loss, chain rule
              backward, update weights, repeat.
            </T>
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
