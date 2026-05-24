import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function PosEncodingProblem(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>
            The Transformer sees all words at the same time.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            It receives three embedding vectors simultaneously. Nothing tells it which is first, second, or third.
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
            <T color={C.dim} size={18}>
              "I love cats" → [vec_I, vec_love, vec_cats]
            </T>
            <T color={C.dim} size={18}>
              "cats love I" → [vec_cats, vec_love, vec_I]
            </T>
            <T color={C.red} size={18} bold center style={{ marginTop: 4 }}>
              Same vectors, different order - but model can't see order!
            </T>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Why simple solutions fail:
          </T>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>
                ❌ Use [1,1,...], [2,2,...], [3,3,...]?
              </T>
              <T color={C.dim} size={16}>
                Values grow forever. At position 1000, you add 1000 to every dimension - drowns out the word meaning.
              </T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>
                ❌ Use pos/max_length (0.0, 0.01, 0.02...)?
              </T>
              <T color={C.dim} size={16}>
                Step size depends on sentence length. Model can't learn consistent patterns.
              </T>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06` }}>
              <T color="#ff8a80" bold center size={18}>
                ❌ Use random vectors?
              </T>
              <T color={C.dim} size={16}>
                No relationship between positions. Can't learn "pos 5 is near pos 6".
              </T>
            </div>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            We need: bounded values, unique per position, relative distances learnable.
          </T>
          <T color="#80e8a5" center size={18} style={{ marginTop: 4 }}>
            Solution: Sine & Cosine waves →
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
