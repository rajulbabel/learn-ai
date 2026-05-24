import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function WhyNotDirectDot(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center size={20}>
            We can't just dot product the raw word numbers.
          </T>
          <T color="#ff8a80" style={{ marginTop: 6 }}>
            In "I love cats": "I" = pronoun, "love" = verb, "cats" = noun. Their raw meanings aren't similar at all -
            the dot product of "I" and "love" would be low.
          </T>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <Tag color={C.red}>"I" = pronoun, self-reference</Tag>
            <Tag color={C.purple}>"love" = verb, emotion</Tag>
          </div>
          <T color="#ff8a80" style={{ marginTop: 10 }}>
            But they are related - "I" is the one who loves! Their <strong>meanings</strong> are different, but their{" "}
            <strong>relationship</strong> is strong. Raw dot product can't capture this.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center>
            We need to compare on a different basis:
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Instead of comparing what words mean, compare what one is <strong>looking for</strong> vs what the other{" "}
            <strong>offers</strong>:
          </T>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  textAlign: "right",
                  padding: "10px",
                  borderRadius: 8,
                  background: `${C.blue}10`,
                  border: `1px solid ${C.blue}20`,
                }}
              >
                <T color={C.blue} bold size={18} style={{ textAlign: "right" }}>
                  "love" is looking for
                </T>
                <T color={C.dim} size={16} style={{ textAlign: "right" }}>
                  "who is doing the loving?"
                </T>
                <T color={C.dim} size={14} style={{ textAlign: "right" }}>
                  (a subject, a person)
                </T>
              </div>
              <T color={C.yellow} size={26} center>
                ↔
              </T>
              <div
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  background: `${C.orange}10`,
                  border: `1px solid ${C.orange}20`,
                }}
              >
                <T color={C.orange} bold size={18}>
                  "I" OFFERS
                </T>
                <T color={C.dim} size={16}>
                  "I am a subject, a person"
                </T>
                <T color={C.green} size={14} bold>
                  → HIGH MATCH!
                </T>
              </div>
            </div>
          </div>
          <T color="#ffe082" style={{ marginTop: 10 }}>
            Not "what do these words mean?" but "what is one <strong>looking for</strong> vs what does the other{" "}
            <strong>offer</strong>?"
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green}>
          <T color="#80e8a5" bold center>
            That's why we need three separate views of each word →
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
