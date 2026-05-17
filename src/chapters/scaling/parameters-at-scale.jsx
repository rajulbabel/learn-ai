import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function ParametersAtScale(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            What is a parameter?
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Every weight. Every bias. One number = one parameter.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            When people say "LLaMA-7B", they mean 7 billion parameters. 7,000,000,000 floating-point numbers.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Counting parameters in a simple layer:
          </T>
          <div style={{ marginTop: 8, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
            <T color="#80deea" size={14}>
              Input layer: 4 neurons
            </T>
            <T color="#80deea" size={14}>
              Output layer: 3 neurons
            </T>
            <T color="#80deea" size={14} bold style={{ marginTop: 6 }}>
              Weight matrix W: 4 × 3 = <strong>12 weights</strong>
            </T>
            <T color="#80deea" size={14} bold>
              Bias vector b: <strong>3 biases</strong>
            </T>
            <T color={C.green} size={14} bold style={{ marginTop: 4 }}>
              Total: 12 + 3 = <strong>15 parameters</strong>
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            Scaling up to real models:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { model: "LLaMA-7B", params: "7 billion", scale: "Like a notebook of facts" },
              { model: "GPT-3", params: "175 billion", scale: "Like a library" },
              { model: "GPT-4 (estimated)", params: "~1.8 trillion", scale: "Like all of human knowledge" },
            ].map(({ model, params, scale }) => (
              <div
                key={model}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: `${C.orange}08`,
                  border: `1px solid ${C.orange}12`,
                }}
              >
                <T color={C.orange} bold size={14}>
                  {model}
                </T>
                <T color={C.dim} size={13}>
                  {params} - {scale}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Where do the parameters live?
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { component: "Embedding matrix", role: "Token → vector", fraction: "~20%" },
              { component: "Attention (Q, K, V, O)", role: "Query/Key/Value computation", fraction: "~20%" },
              { component: "FFN layers", role: "Feed-forward networks", fraction: "~50%" },
              { component: "Output projection", role: "Vector → logits (token probabilities)", fraction: "~10%" },
            ].map(({ component, role, fraction }) => (
              <div
                key={component}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: `${C.green}08`,
                  border: `1px solid ${C.green}12`,
                }}
              >
                <T color={C.green} bold size={13}>
                  {component}: {fraction}
                </T>
                <T color={C.dim} size={12}>
                  {role}
                </T>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.blue} style={{ width: "100%" }}>
          <T color="#42a5f5" bold center size={20}>
            The critical insight:
          </T>
          <T color="#42a5f5" style={{ marginTop: 8 }}>
            More parameters ≠ smarter.
          </T>
          <T color="#42a5f5" style={{ marginTop: 6 }}>
            Parameters are <strong>capacity</strong>. Like a student with a big brain but no education. Still needs:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3, paddingLeft: 12 }}>
            {["Quality training data (not just volume)", "Proper training time", "Good optimization"].map((item, i) => (
              <T key={i} color="#42a5f5" size={14}>
                • {item}
              </T>
            ))}
          </div>
          <T color="#42a5f5" style={{ marginTop: 6 }}>
            You can have 1 trillion parameters trained poorly (worse than 7B parameters trained well).
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
