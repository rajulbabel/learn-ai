import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function GradientsInAction(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Sub 0: We have all gradients - now apply them */}
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={20}>
            We Have the Gradients - Now Use Them
          </T>
          <T color="#80deea" size={16} style={{ marginTop: 12 }}>
            Backprop gave us a gradient for every parameter. Now we apply gradient descent to ALL of them
            simultaneously. Same formula from chapter 2.5:
          </T>
          <div
            style={{
              marginTop: 10,
              padding: "12px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              border: `1px solid ${C.green}25`,
              textAlign: "center",
            }}
          >
            <T color={C.green} bold size={18} style={{ fontFamily: "monospace" }}>
              new_weight = old_weight - learning_rate x gradient
            </T>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10 }}>
            Learning rate = 0.0000001 (very small because our gradients are huge numbers like -223,200)
          </T>
        </Box>
      )}

      {/* Sub 1: Apply updates */}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={20}>
            Updating Every Weight at Once
          </T>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            Learning rate = 0.0000001. Each weight gets nudged in the opposite direction of its gradient:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { p: "w₁₁", old: "0.500", grad: "-223,200", nw: "0.522", c: C.red, big: true },
              { p: "w₂₁", old: "50.000", grad: "-446.4", nw: "50.000", c: C.yellow, big: false },
              { p: "b₁", old: "50.000", grad: "-148.8", nw: "50.000", c: C.purple, big: false },
              { p: "w₁₂", old: "0.100", grad: "-55,800", nw: "0.106", c: C.red, big: true },
              { p: "w₂₂", old: "10.000", grad: "-111.6", nw: "10.000", c: C.yellow, big: false },
              { p: "b₂", old: "5.000", grad: "-37.2", nw: "5.000", c: C.purple, big: false },
              { p: "w_o1", old: "0.800", grad: "-176,700", nw: "0.818", c: C.cyan, big: true },
              { p: "w_o2", old: "0.200", grad: "-34,410", nw: "0.203", c: C.orange, big: true },
              { p: "b_o", old: "10.000", grad: "-186", nw: "10.000", c: C.green, big: false },
            ].map(({ p, old, grad, nw, c, big }) => (
              <div
                key={p}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  padding: "7px 10px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <code
                  style={{
                    color: c,
                    fontWeight: 800,
                    fontSize: 15,
                    padding: "3px 6px",
                    background: `${c}12`,
                    borderRadius: 5,
                    textAlign: "center",
                    minWidth: 52,
                    flexShrink: 0,
                  }}
                >
                  {p}
                </code>
                <span style={{ color: C.dim, fontSize: 14, marginLeft: 8 }}>=</span>
                <span style={{ color: C.mid, fontSize: 14, marginLeft: 6 }}>{old}</span>
                <span style={{ color: C.dim, fontSize: 13, marginLeft: 6 }}>- lr ×</span>
                <span
                  style={{
                    padding: "2px 8px",
                    marginLeft: 4,
                    background: big ? `${C.red}10` : "rgba(255,255,255,0.03)",
                    borderRadius: 4,
                    color: big ? "#ef9a9a" : C.dim,
                    fontSize: 13,
                    fontWeight: big ? 600 : 400,
                  }}
                >
                  {grad}
                </span>
                <span style={{ color: C.dim, fontSize: 14, marginLeft: 6 }}>=</span>
                <span
                  style={{
                    padding: "4px 12px",
                    marginLeft: 8,
                    background: `${C.green}18`,
                    borderRadius: 6,
                    color: C.green,
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  {nw}
                </span>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10 }}>
            Weights with large gradients (w₁₁, w_o1) changed the most. Biases barely moved because their gradients are
            small. All 9 parameters updated simultaneously - one step of training.
          </T>
        </Box>
      </Reveal>

      {/* Sub 2: Forward pass with new weights */}
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={20}>
            Forward Pass with Updated Weights
          </T>
          <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
            Let's run the network again with the new weights and see if it improved:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.cyan}06`,
                border: `1px solid ${C.cyan}12`,
              }}
            >
              <T color={C.cyan} bold size={15}>
                h₁ = ReLU(1500 x 0.522 + 3 x 50 + 50) = ReLU(983) = 983
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <T color={C.orange} bold size={15}>
                h₂ = ReLU(1500 x 0.106 + 3 x 10 + 5) = ReLU(194) = 194
              </T>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <T color={C.green} bold size={15}>
                y = 983 x 0.818 + 194 x 0.203 + 10 = 854
              </T>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <div
              style={{
                padding: "10px 16px",
                background: `${C.red}08`,
                borderRadius: 8,
                border: `1px solid ${C.red}20`,
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={12}>
                Before
              </T>
              <T color={C.red} bold size={16}>
                y = 807
              </T>
              <T color={C.red} bold size={14}>
                Loss = 8,649
              </T>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <T color={C.bright} bold size={20}>
                →
              </T>
            </div>
            <div
              style={{
                padding: "10px 16px",
                background: `${C.green}08`,
                borderRadius: 8,
                border: `1px solid ${C.green}20`,
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={12}>
                After 1 step
              </T>
              <T color={C.green} bold size={16}>
                y = 854
              </T>
              <T color={C.green} bold size={14}>
                Loss = 2,116
              </T>
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 12 }}>
            Loss dropped from 8,649 to 2,116. Prediction moved from 807 to 854 - closer to the target of 900. One single
            step of backprop + gradient descent already cut the loss by 75%!
          </T>
        </Box>
      </Reveal>

      {/* Sub 3: Multiple iterations */}
      <Reveal when={sub >= 3}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Repeat - Watch the Network Converge
          </T>
          <T color="#ffe082" size={16} style={{ marginTop: 10 }}>
            Keep repeating: forward pass, compute loss, backprop, update weights. Each step gets closer:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { step: "Step 0 (initial)", pred: "807", loss: "8,649", bar: 100, c: C.red },
              { step: "Step 1", pred: "854", loss: "2,116", bar: 24, c: C.orange },
              { step: "Step 2", pred: "877", loss: "529", bar: 6, c: C.yellow },
              { step: "Step 3", pred: "889", loss: "121", bar: 1.4, c: C.green },
              { step: "Step 4", pred: "895", loss: "25", bar: 0.3, c: C.green },
              { step: "Step 10", pred: "899.8", loss: "0.04", bar: 0, c: C.green },
            ].map(({ step, pred, loss, bar, c }) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                <T color={C.dim} size={13} style={{ minWidth: 95, textAlign: "right" }}>
                  {step}
                </T>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(bar, 0.5)}%`,
                      height: "100%",
                      background: c,
                      borderRadius: 4,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <T color={c} bold size={13} style={{ minWidth: 50, textAlign: "right" }}>
                  y={pred}
                </T>
                <T color={C.dim} size={12} style={{ minWidth: 65, textAlign: "right" }}>
                  loss={loss}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 12 }}>
            After just 10 steps, the network predicts 899.8 - nearly perfect. Loss went from 8,649 to 0.04. This is
            gradient descent: small, calculated steps downhill until you reach the minimum.
          </T>
        </Box>
      </Reveal>

      {/* Sub 4: The complete training loop diagram */}
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color={C.blue} bold center size={20}>
            The Complete Training Loop
          </T>
          <T color="#5eb3ff" size={16} style={{ marginTop: 10 }}>
            Every neural network in the world trains using this exact loop:
          </T>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                step: "1",
                label: "Forward Pass",
                desc: "Feed input through network, get prediction",
                c: C.cyan,
                icon: "→",
              },
              { step: "2", label: "Compute Loss", desc: "How wrong was the prediction?", c: C.red, icon: "?" },
              {
                step: "3",
                label: "Backward Pass",
                desc: "Chain rule: compute gradient for every weight",
                c: C.purple,
                icon: "←",
              },
              {
                step: "4",
                label: "Update Weights",
                desc: "Nudge each weight opposite to its gradient",
                c: C.green,
                icon: "↓",
              },
              { step: "↻", label: "Repeat", desc: "Thousands to billions of times", c: C.yellow, icon: "↻" },
            ].map(({ step, label, desc, c, icon }) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${c}06`,
                  border: `1px solid ${c}12`,
                }}
              >
                <div
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `${c}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: c,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <T color={c} bold size={16}>
                    {label}
                  </T>
                  <T color={C.dim} size={14}>
                    {desc}
                  </T>
                </div>
              </div>
            ))}
          </div>
          <T color="#5eb3ff" size={16} style={{ marginTop: 12 }}>
            GPT-4 runs this loop trillions of times on billions of text examples. Each loop adjusts millions of weights
            by tiny amounts. After enough loops, the model can write poetry, answer questions, and write code - all
            because of this simple loop: predict, measure error, trace blame, fix weights, repeat.
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

// ═══════ 1.15 Why Deep Backprop Gets Hard ═══════
