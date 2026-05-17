import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, Tag } from "../../components.jsx";

export default function WhyKVDifferent(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={20}>
            Think about ordering food at a restaurant.
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.orange}08`,
                border: `1px solid ${C.orange}18`,
              }}
            >
              <span style={{ fontSize: 34, flexShrink: 0 }}>📋</span>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold center size={19}>
                  The menu description <Tag color={C.orange}>= Key</Tag>
                </T>
                <T color={C.dim} size={18} style={{ marginTop: 4 }}>
                  "Paneer Tikka Masala - rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"
                </T>
                <T color={C.orange} size={16} style={{ marginTop: 4 }}>
                  This helped you <strong>decide</strong> - yes, this matches what I'm craving. It's optimized for{" "}
                  <strong>matching</strong> your preference (your Query) to the right dish.
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}08`,
                border: `1px solid ${C.green}18`,
              }}
            >
              <span style={{ fontSize: 34, flexShrink: 0 }}>🍛</span>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold center size={19}>
                  The actual food on your plate <Tag color={C.green}>= Value</Tag>
                </T>
                <T color={C.dim} size={18} style={{ marginTop: 4 }}>
                  The smoky charred paneer cubes, the creamy gravy, the aroma, the nourishment
                </T>
                <T color={C.green} size={16} style={{ marginTop: 4 }}>
                  This is the <strong>actual content</strong> you receive. What you actually consume.
                </T>
              </div>
            </div>
          </div>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color="#ff8a80" bold center>
            If Key and Value were the same thing:
          </T>
          <div
            style={{
              marginTop: 8,
              padding: "12px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 34 }}>🍽️</span>
            <T color="#ff8a80" style={{ marginTop: 6 }}>
              The waiter brings a plate with the words:
              <br />
              <em style={{ color: C.dim }}>
                "rich tomato-based gravy, smoky grilled paneer, mildly spiced, served with naan"
              </em>
              <br />
              printed on it.
            </T>
            <T color={C.red} bold center style={{ marginTop: 6 }}>
              That's useless! You wanted the ACTUAL FOOD, not the description.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center>
            Now let's connect this back to the Transformer.
          </T>
          <T color="#80deea" style={{ marginTop: 6 }}>
            Take the sentence: "The cat sat because <strong>it</strong> was tired." The word "it" needs to find what it
            refers to. It finds "cat". Now:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>📋</span>
              <div style={{ flex: 1 }}>
                <T color={C.orange} bold center size={18}>
                  "cat"'s Key <span style={{ color: C.dim, fontWeight: 400 }}>(the menu description)</span>
                </T>
                <T color={C.dim} size={16} style={{ marginTop: 2 }}>
                  Encodes: "I'm a noun, I'm a subject, I'm animate" - this is what helped "it" <strong>find</strong>{" "}
                  "cat" in the first place. Optimized for matching.
                </T>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>🍛</span>
              <div style={{ flex: 1 }}>
                <T color={C.green} bold center size={18}>
                  "cat"'s Value <span style={{ color: C.dim, fontWeight: 400 }}>(the actual food)</span>
                </T>
                <T color={C.dim} size={16} style={{ marginTop: 2 }}>
                  Carries: rich semantic content - small, furry, four-legged, alive, domesticated - this is the{" "}
                  <strong>actual information</strong> that "it" absorbs after finding the match.
                </T>
              </div>
            </div>
          </div>
          <T color="#80deea" size={18} bold center style={{ marginTop: 10 }}>
            Key helped "it" FIND "cat" (menu description). Value is what "it" actually GOT from "cat" (the actual food).
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
