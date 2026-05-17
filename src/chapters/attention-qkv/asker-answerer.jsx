import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn } from "../../components.jsx";

export default function AskerAnswerer(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.pink} style={{ width: "100%" }}>
          <T color="#ce93d8" bold center size={20}>
            Here's what confuses people:
          </T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>
            In our classroom, every student is both an asker and an answerer, <strong>simultaneously</strong>.
          </T>
          <T color="#ce93d8" style={{ marginTop: 6 }}>
            Riya has a Query (her question), but she also has a Key (what she can offer others) and a Value (her actual
            info). Aman has a Key and Value, but also has his own Query (maybe he's looking for homework help).
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <div
          style={{
            background: C.card,
            borderRadius: 10,
            padding: "14px",
            border: `1px solid ${C.border}`,
            width: "100%",
          }}
        >
          <T color={C.dim} size={14} center style={{ marginBottom: 6 }}>
            Every student produces all three:
          </T>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { name: "Riya", q: '"who has notes?"', k: '"I know Hindi grammar"', v: "her Hindi grammar knowledge" },
              {
                name: "Aman",
                q: '"who can help with homework?"',
                k: '"I have yesterday\'s notes"',
                v: "his actual notes content",
              },
              { name: "Priya", q: '"who knows the schedule?"', k: '"I know the homework"', v: "her homework answers" },
            ].map(({ name, q, k, v }) => (
              <div
                key={name}
                style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr 1fr", gap: 10, alignItems: "center" }}
              >
                <T color={C.bright} bold size={16}>
                  {name}
                </T>
                <div
                  style={{
                    padding: "6px",
                    borderRadius: 6,
                    background: `${C.blue}08`,
                    border: `1px solid ${C.blue}15`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.blue} size={12} bold center>
                    Query
                  </T>
                  <T color={C.dim} size={11} center>
                    {q}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px",
                    borderRadius: 6,
                    background: `${C.orange}08`,
                    border: `1px solid ${C.orange}15`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.orange} size={12} bold center>
                    Key
                  </T>
                  <T color={C.dim} size={11} center>
                    {k}
                  </T>
                </div>
                <div
                  style={{
                    padding: "6px",
                    borderRadius: 6,
                    background: `${C.green}08`,
                    border: `1px solid ${C.green}15`,
                    textAlign: "center",
                  }}
                >
                  <T color={C.green} size={12} bold center>
                    Value
                  </T>
                  <T color={C.dim} size={11} center>
                    {v}
                  </T>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            Same thing happens with words in a Transformer.
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            In the sentence "The cat sat because it was tired", every word simultaneously produces a Query, Key, and
            Value. "cat" asks its own question while also advertising itself and carrying its own information.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            Each student - and each word - simultaneously asks a question and advertises itself and carries information.
          </T>
          <T color="#80e8a5" size={18}>
            But why do we need Key and Value to be <strong>separate</strong>? Why can't they be the same thing?
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
