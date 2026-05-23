import { C } from "../../config.js";
import { Box, T, Reveal, SubBtn, ChapterLink } from "../../components.jsx";

export default function CLIP(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color="#b8a9ff" bold center size={20}>
            A weird question to start with
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            You see a photo of a golden retriever catching a frisbee on a beach.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 6 }}>
            Someone asks: "Which caption goes with this photo?"
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                background: `${C.green}10`,
                border: `1px solid ${C.green}25`,
              }}
            >
              <T color={C.green} size={14}>
                A) "A dog catching a frisbee on a beach"
              </T>
            </div>
            <div
              style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}15` }}
            >
              <T color={C.red} size={14}>
                B) "A car parked in a garage"
              </T>
            </div>
            <div
              style={{ padding: "8px 10px", borderRadius: 6, background: `${C.red}06`, border: `1px solid ${C.red}15` }}
            >
              <T color={C.red} size={14}>
                C) "A person cooking dinner"
              </T>
            </div>
          </div>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Obviously A. Your brain instantly matched the image to the right words.
          </T>
          <T color="#b8a9ff" style={{ marginTop: 4 }}>
            But how do you teach a computer to do this? Images are pixels. Text is words. They're completely different
            things. How do you even compare them?
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color="#80deea" bold center size={20}>
            The idea: translate both into the same language
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            You can't directly compare a photo to a sentence. But what if you could convert both into numbers?
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{ width: 80, padding: "8px", borderRadius: 6, background: `${C.cyan}12`, textAlign: "center" }}
              >
                <T color={C.cyan} bold size={13}>
                  Photo
                </T>
                <T color={C.dim} size={11}>
                  dog + beach
                </T>
              </div>
              <T color={C.dim} size={16}>
                →
              </T>
              <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.yellow}10` }}>
                <T color={C.yellow} size={11}>
                  Image Encoder
                </T>
              </div>
              <T color={C.dim} size={16}>
                →
              </T>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: `${C.green}10`,
                  border: `1px solid ${C.green}20`,
                }}
              >
                <T color={C.green} size={12}>
                  [0.8, 0.3, -0.5, 0.9, ...]
                </T>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{ width: 80, padding: "8px", borderRadius: 6, background: `${C.purple}12`, textAlign: "center" }}
              >
                <T color={C.purple} bold size={13}>
                  Caption
                </T>
                <T color={C.dim} size={11}>
                  "dog on beach"
                </T>
              </div>
              <T color={C.dim} size={16}>
                →
              </T>
              <div style={{ padding: "4px 8px", borderRadius: 4, background: `${C.yellow}10` }}>
                <T color={C.yellow} size={11}>
                  Text Encoder
                </T>
              </div>
              <T color={C.dim} size={16}>
                →
              </T>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: `${C.green}10`,
                  border: `1px solid ${C.green}20`,
                }}
              >
                <T color={C.green} size={12}>
                  [0.79, 0.31, -0.48, 0.88, ...]
                </T>
              </div>
            </div>
          </div>
          <T color="#80deea" style={{ marginTop: 10 }}>
            Two separate translators (encoders) convert images and text into lists of numbers (vectors).
          </T>
          <T color="#80deea" style={{ marginTop: 4 }}>
            If the image and text describe the same thing, their numbers end up <strong>almost identical</strong>.
            Notice how close the two rows of numbers are above!
          </T>
          <T color="#80deea" style={{ marginTop: 4 }}>
            This system is called <strong>CLIP</strong> (Contrastive Language-Image Pretraining), built by OpenAI.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color="#ffe082" bold center size={20}>
            How does CLIP learn? The matching game
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Collect millions of image + caption pairs from the internet. Then play a matching game:
          </T>
          <T color="#ffe082" style={{ marginTop: 6 }}>
            Here are 4 images and 4 captions. Which goes with which?
          </T>
          <div style={{ marginTop: 10, padding: "10px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr 1fr", gap: 4, alignItems: "center" }}>
              <div />
              <T color={C.dim} size={11} center>
                "dog on beach"
              </T>
              <T color={C.dim} size={11} center>
                "red car"
              </T>
              <T color={C.dim} size={11} center>
                "sunset"
              </T>
              <T color={C.dim} size={11} center>
                "birthday cake"
              </T>

              <T color={C.dim} size={11}>
                dog photo
              </T>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}>
                <T color={C.green} bold size={13}>
                  YES
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>

              <T color={C.dim} size={11}>
                car photo
              </T>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}>
                <T color={C.green} bold size={13}>
                  YES
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>

              <T color={C.dim} size={11}>
                sunset photo
              </T>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}>
                <T color={C.green} bold size={13}>
                  YES
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>

              <T color={C.dim} size={11}>
                cake photo
              </T>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.red}10`, textAlign: "center" }}>
                <T color={C.red} size={12}>
                  no
                </T>
              </div>
              <div style={{ padding: "4px", borderRadius: 4, background: `${C.green}25`, textAlign: "center" }}>
                <T color={C.green} bold size={13}>
                  YES
                </T>
              </div>
            </div>
          </div>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            The green diagonal = correct matches. Everything else = wrong.
          </T>
          <T color="#ffe082" style={{ marginTop: 4 }}>
            The model adjusts until matching pairs produce similar numbers and non-matching pairs produce very different
            numbers. This is called <strong>contrastive learning</strong> - learning by contrast (what matches vs what
            doesn't).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color="#ffcc80" bold center size={20}>
            How "similar" are two vectors?
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            After encoding, we get two lists of numbers. We need a way to check: are they similar?
          </T>
          <T color="#ffcc80" style={{ marginTop: 6 }}>
            The method is called <strong>cosine similarity</strong>. Here is the actual formula:
          </T>
          <div
            style={{
              margin: "12px 0",
              padding: "14px 16px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${C.orange}25`,
              textAlign: "center",
            }}
          >
            <T color={C.orange} bold size={18} center>
              cos(A, B) = (A · B) / (||A|| x ||B||)
            </T>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {[
                { sym: "A · B", desc: <>dot product (<ChapterLink to="2.7">chapter 2.7</ChapterLink>)</>, color: C.blue },
                { sym: "||A||", desc: "magnitude of A = sqrt(sum of a_i squared)", color: C.cyan },
                { sym: "||B||", desc: "magnitude of B = sqrt(sum of b_i squared)", color: C.purple },
              ].map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: `${p.color}08`,
                    borderRadius: 6,
                    padding: "3px 8px",
                    border: `1px solid ${p.color}15`,
                  }}
                >
                  <T color={p.color} bold size={12}>
                    {p.sym}
                  </T>
                  <T color={C.dim} size={11}>
                    {" "}
                    = {p.desc}
                  </T>
                </div>
              ))}
            </div>
            <T color={C.dim} size={13} style={{ marginTop: 8 }}>
              Dividing by the magnitudes removes the effect of vector length - only the DIRECTION matters. Result is
              always between -1 (opposite) and +1 (identical direction).
            </T>
          </div>
          <T color="#ffcc80" size={15} style={{ marginTop: 4 }}>
            Quick example: A = [0.8, 0.3] and B = [0.79, 0.31]
          </T>
          <div style={{ marginTop: 6, padding: "8px 12px", borderRadius: 8, background: `${C.orange}06` }}>
            <T color={C.dim} size={13}>
              A · B = (0.8 x 0.79) + (0.3 x 0.31) = 0.632 + 0.093 = 0.725
            </T>
            <T color={C.dim} size={13}>
              ||A|| = sqrt(0.64 + 0.09) = 0.854
            </T>
            <T color={C.dim} size={13}>
              ||B|| = sqrt(0.624 + 0.096) = 0.849
            </T>
            <T color={C.orange} bold size={14}>
              cos(A, B) = 0.725 / (0.854 x 0.849) = <strong>0.9998</strong> - nearly identical!
            </T>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                score: "0.95",
                pair: 'dog photo + "dog on beach"',
                verdict: "Almost identical!",
                color: C.green,
                width: "95%",
              },
              {
                score: "0.40",
                pair: 'dog photo + "animal playing"',
                verdict: "Somewhat related",
                color: C.yellow,
                width: "40%",
              },
              {
                score: "0.05",
                pair: 'dog photo + "red sports car"',
                verdict: "Completely different",
                color: C.red,
                width: "5%",
              },
            ].map(({ score, pair, verdict, color, width }, i) => (
              <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: `${color}08` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <T color={C.dim} size={12}>
                    {pair}
                  </T>
                  <T color={color} bold size={14}>
                    {score}
                  </T>
                </div>
                <div
                  style={{
                    marginTop: 4,
                    height: 10,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width, height: "100%", background: color, borderRadius: 4 }} />
                </div>
                <T color={C.dim} size={11} style={{ marginTop: 2 }}>
                  {verdict}
                </T>
              </div>
            ))}
          </div>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            During training, the model is rewarded for making correct pairs score HIGH and wrong pairs score LOW.
            Millions of image-caption pairs later, it becomes incredibly good at understanding what images and text
            mean.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color="#80e8a5" bold center size={20}>
            Why this changes everything
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Once images and text live in the same number space, you can do magical things:
          </T>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{ padding: "10px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}15` }}
            >
              <T color={C.cyan} bold size={15}>
                Google Image Search
              </T>
              <T color={C.dim} size={13}>
                You type "fluffy cat sleeping" → encode text to numbers → find photos with the closest numbers. No one
                manually tagged those photos - CLIP just knows they match.
              </T>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.purple}08`,
                border: `1px solid ${C.purple}15`,
              }}
            >
              <T color={C.purple} bold size={15}>
                DALL-E / Midjourney
              </T>
              <T color={C.dim} size={13}>
                You type "astronaut riding a horse on Mars" → text becomes numbers → image generator creates pixels that
                produce those same numbers. The shared space is the bridge.
              </T>
            </div>
            <div
              style={{
                padding: "10px",
                borderRadius: 8,
                background: `${C.yellow}08`,
                border: `1px solid ${C.yellow}15`,
              }}
            >
              <T color={C.yellow} bold size={15}>
                ChatGPT / Claude understanding photos
              </T>
              <T color={C.dim} size={13}>
                You upload a photo to ChatGPT → image encoder converts it to numbers → those numbers go into the same
                space as text → now the model can "read" the image as if it were words.
              </T>
            </div>
          </div>
          <T color="#80e8a5" style={{ marginTop: 10 }}>
            Every time AI "sees" an image, contrastive learning is behind it. It's the reason AI can understand photos,
            generate art, and search billions of images by typing words.
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
