import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function DotProduct(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Here's the problem.
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            We have three lists of numbers (one per word). We need some mathematical operation that computes "how
            relevant is word A to word B?"
          </T>
          <T color={C.orange} style={{ marginTop: 6 }}>
            The tool is the <strong>dot product</strong> - multiply pairs, add them up. Big result = related. Small
            result = unrelated.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={20}>
            Given two vectors, multiply pairs and sum:
          </T>
          <div style={{ margin: "12px 0", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <Tag color={C.cyan}>A = [1, 2, 3]</Tag>
              <Tag color={C.purple}>B = [4, 5, 6]</Tag>
            </div>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <T color={C.dim} size={18} center>
                Multiply each pair:
              </T>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "10px 0" }}>
                {[
                  [1, 4, 4],
                  [2, 5, 10],
                  [3, 6, 18],
                ].map(([a, b, r], i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div>
                      <span style={{ color: C.cyan, fontSize: 20 }}>{a}</span>
                      <span style={{ color: C.dim, fontSize: 20 }}> × </span>
                      <span style={{ color: C.purple, fontSize: 20 }}>{b}</span>
                    </div>
                    <div style={{ marginTop: 4, color: C.yellow, fontWeight: 700, fontSize: 22 }}>{r}</div>
                  </div>
                ))}
              </div>
              <T color={C.dim} size={18} center>
                Sum them up:
              </T>
              <T color={C.yellow} bold size={29} center>
                4 + 10 + 18 = 32
              </T>
            </div>
          </div>
          <T color="#ffe082" size={18}>
            That's it. Multiply pairs, add them up, get one number.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center>
            What does this number mean?
          </T>
          <T color="#80e8a5" style={{ marginTop: 6 }}>
            It measures <strong>how similar two vectors are in direction</strong>. Think of you and a friend both
            pointing somewhere:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                dir: "→  →",
                label: "Both point same way",
                val: "Large positive",
                desc: '"These are similar!"',
                color: C.green,
              },
              {
                dir: "→  ←",
                label: "Opposite directions",
                val: "Large negative",
                desc: '"These are opposites!"',
                color: C.red,
              },
              {
                dir: "→  ↑",
                label: "Perpendicular (unrelated)",
                val: "Close to zero",
                desc: '"Nothing in common"',
                color: C.dim,
              },
            ].map(({ dir, label, val, desc, color }) => (
              <div
                key={label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${color}08`,
                  border: `1px solid ${color}15`,
                }}
              >
                <span style={{ fontSize: 22, textAlign: "center", fontFamily: "monospace" }}>{dir}</span>
                <div>
                  <T color={color} bold center size={18}>
                    {label} → {val}
                  </T>
                  <T color={C.dim} size={16}>
                    {desc}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.purple}>
          <T color="#b8a9ff" bold center>
            But we can't just dot product the raw word numbers directly.
          </T>
          <T color="#b8a9ff">
            "I" = pronoun, "love" = verb - their raw meanings aren't similar, but they are related (I is the one who
            loves). We need to compare them on a different basis.
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
