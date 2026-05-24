import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function TracingExample(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            Sentence: "The cat sat" - let's trace "sat" attending to "cat"
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { w: '"The"', v: "[0.1, 0.8, -0.2, 0.5]", c: C.dim },
              { w: '"cat"', v: "[0.7, -0.3, 0.6, 0.1]", c: C.purple },
              { w: '"sat"', v: "[-0.4, 0.5, 0.2, 0.9]", c: C.cyan },
            ].map(({ w, v, c }) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: `${c}06`,
                }}
              >
                <span style={{ color: c, fontWeight: 700, fontSize: 18, minWidth: 36 }}>{w}</span>
                <code style={{ color: `${c}bb`, fontSize: 16 }}>{v}</code>
              </div>
            ))}
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center>
            Creating Q, K, V for "cat" (via matrix multiplication):
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
              <T color={C.blue} bold center size={18}>
                Q_cat = embedding × W_Q = [0.4, 0.8]
              </T>
              <T color={C.dim} size={16}>
                "cat is looking for words related to actions/verbs"
              </T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.orange}06` }}>
              <T color={C.orange} bold center size={18}>
                K_cat = embedding × W_K = [0.9, 0.3]
              </T>
              <T color={C.dim} size={16}>
                "I can be found as: a noun, a subject, an animal"
              </T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.green}06` }}>
              <T color={C.green} bold center size={18}>
                V_cat = embedding × W_V = [0.6, -0.2]
              </T>
              <T color={C.dim} size={16}>
                Rich semantic content about "cat" - the actual information
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            "sat" makes its Query:
          </T>
          <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 6, background: `${C.blue}06` }}>
            <T color={C.blue} bold center size={18}>
              Q_sat = embedding × W_Q = [0.2, 0.7]
            </T>
            <T color={C.dim} size={16}>
              "Who is performing this action? I'm looking for a subject."
            </T>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <T color={C.dim} size={18} center>
              Score = dot product: Q_sat · K_cat
            </T>
            <T color={C.yellow} size={19} center style={{ marginTop: 4 }}>
              (0.2 × 0.9) + (0.7 × 0.3) = 0.18 + 0.21 = <strong style={{ fontSize: 22 }}>0.39</strong> → HIGH MATCH!
            </T>
          </div>
          <T color="#80deea" size={18} style={{ marginTop: 8 }}>
            "sat"'s question (<em>"who is my subject?"</em>) matched with "cat"'s ad (<em>"I'm a subject noun"</em>). So
            "sat" pays high attention to "cat" and absorbs cat's <strong>Value</strong> - the actual semantic content.
          </T>
          <T color="#80deea" size={18} style={{ marginTop: 6 }}>
            After this, "sat" knows: <strong>"I'm an action being performed by a cat."</strong>
          </T>
        </Box>
      </Reveal>
      {sub < 2 && (
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
