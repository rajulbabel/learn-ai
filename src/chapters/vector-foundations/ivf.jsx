import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { IVFScatter, IVF_CLUSTERS } from "../../shared/vector-graphs.jsx";

export default function IVF(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Brute force touches every vector
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            Brute force is correct but slow because it reads every single stored vector for every query. Here are our 10
            cat-corpus docs in a 2D view, with the query in the middle and an arrow from the query to every vector.
            Nothing is skipped.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <IVFScatter
              variant="bare"
              desc="Scatter plot of the 10 cat-corpus documents with the query vector at the center. Faint red lines fan out from the query to every document, showing that brute-force kNN compares the query to every vector."
            />
            <T color={C.dim} size={14} center style={{ marginTop: 6, fontStyle: "italic" }}>
              Every line is a distance computation. At N = 10 this is nothing; at N = 1 billion it balloons to the 3 TB
              of scans per query that brute force cannot afford.
            </T>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            Brute force: read every vector, every query
            <br />
            cost = N &middot; d per query
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
            The IVF trick is simple in hindsight: group the vectors ahead of time so at query time we only look inside
            the group the query landed in.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            Cluster the corpus with k-means
          </T>
          <T color="#80deea" style={{ marginTop: 8 }} center>
            Before we accept any queries, run k-means on the stored vectors. Pick the number of clusters nlist = 3 and
            let the algorithm find three centroids that minimize the average distance from each doc to its closest
            centroid. Each doc gets assigned to exactly one cluster.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.cyan}06`,
              border: `1px solid ${C.cyan}12`,
            }}
          >
            <IVFScatter
              variant="clustered"
              desc="The same 10 docs colored by cluster after k-means with nlist = 3. Purple centroid A sits in the cat-doc cluster, yellow centroid B in the dog-doc group, and cyan centroid C in the birds and fish group. Each doc inherits its cluster color."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {IVF_CLUSTERS.map((cl) => (
              <div
                key={cl.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${cl.color}06`,
                  border: `1px solid ${cl.color}12`,
                }}
              >
                <T color={cl.light} bold center size={15}>
                  Cluster {cl.id} - {cl.label}
                </T>
                <T color={C.bright} size={13} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  Docs {cl.docs.join(", ")}
                </T>
                <T color={cl.color} size={12} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  Centroid ({cl.centroid.x}, {cl.centroid.y})
                </T>
              </div>
            ))}
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            nlist is a tuning knob. Small nlist means few large clusters; large nlist means many tiny clusters. 3 is
            drawable; production picks roughly sqrt(N).
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Voronoi cells: every doc belongs to exactly one cell
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Draw the region of space closer to centroid A than to any other centroid. That is centroid A&apos;s Voronoi
            cell. Repeat for B and C and the whole plane is divided into three cells. Every stored doc sits in exactly
            one cell, and the cell it sits in is its cluster assignment.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <IVFScatter
              variant="cells"
              desc="Voronoi cells drawn as dashed colored rectangles behind the 10 docs, showing the region of space that each centroid owns. Every doc belongs to exactly one cell."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={17}>
              Heads up: four names, one thing
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
              IVF papers and code swap these words as if they are interchangeable, because they are. All four describe
              the same group of docs from a different angle:
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>Cluster</div>
                The k-means view. &quot;These docs landed near the same centroid.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>Cell (Voronoi cell)</div>
                The geometric view. &quot;The region of space closer to centroid A than any other.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>Partition</div>
                The set-theory view. &quot;The dataset split into nlist disjoint groups, every doc in exactly one.&quot;
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontSize: 14,
                  color: C.bright,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: "#80e8a5", fontWeight: 700, marginBottom: 4 }}>Posting list (inverted list)</div>
                The storage view. &quot;The on-disk array of doc IDs assigned to centroid A.&quot; This is why it is
                called an Inverted File index.
              </div>
            </div>
            <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
              One centroid owns one cell owns one cluster owns one posting list. Centroid = representative. Cell =
              territory. Cluster = group. Posting list = the stored IDs.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            The cell formula and what IVF stores
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            One short formula decides which cell a point falls into, and one tiny pair of tables is everything IVF keeps
            on disk.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 15, color: C.bright }}>
              Cell(p) = argmin over i of &#124;&#124;p &minus; centroid<sub>i</sub>&#124;&#124;
            </div>
            <div style={{ fontSize: 14, color: "#80e8a5", marginTop: 4 }}>
              In words: cell of point p is the index of the closest centroid. ||p &minus; centroid<sub>i</sub>|| is the
              distance from p to centroid i; argmin picks the i that makes that distance smallest.
            </div>
            <div style={{ height: 10 }} />
            <div style={{ fontFamily: "monospace", fontSize: 15, color: C.bright }}>
              Every doc: cluster assignment fixed after training
            </div>
            <div style={{ fontSize: 14, color: "#80e8a5", marginTop: 4 }}>
              &quot;Training&quot; here is the k-means step that picked the centroids. Once it ends, every doc gets its
              cell label written down once and that label is frozen. New queries do not move docs around; they only
              choose which cell to scan. Assignments only change if you retrain the centroids later.
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.green}06`,
              border: `1px solid ${C.green}12`,
            }}
          >
            <T color={C.green} bold center size={17}>
              What IVF actually stores on disk
            </T>
            <T color="#80e8a5" size={16} style={{ marginTop: 8 }}>
              The dashed cell polygons in the previous step are just for teaching - they help you picture the partition.
              Real IVF code never builds those shapes. It stores only two tiny things:
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: "#80e8a5", marginBottom: 4 }}>1. Centroid list</div>
                A: [1.3, 1.1]
                <br />
                B: [3.1, 1.0]
                <br />
                C: [3.5, 2.3]
              </div>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  fontFamily: "monospace",
                  fontSize: 14,
                  color: C.bright,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: "#80e8a5", marginBottom: 4 }}>2. Inverted file (posting lists)</div>
                A → [1, 3, 4, 5, 7]
                <br />
                B → [2, 8]
                <br />C → [6, 9, 10]
              </div>
            </div>
            <T color="#80e8a5" size={16} style={{ marginTop: 10 }}>
              That is it - no polygons, no boundary geometry. The boundaries are implicit: any time you need to know
              which cell a point falls into, run the argmin formula above on the fly. The centroids alone fully define
              the partition.
            </T>
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            nprobe = 1: probe only the nearest cell
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            A query arrives. Compute the distance from the query to each of the nlist centroids - just 3 distances, not
            10. Pick the nearest centroid and scan only the docs inside its cell. The other 2 cells are skipped
            entirely. This is how IVF buys its speedup.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.orange}06`,
              border: `1px solid ${C.orange}12`,
            }}
          >
            <IVFScatter
              variant="probe"
              nprobe={1}
              desc="Query vector with an orange arrow pointing at centroid A, the nearest centroid. Cluster A's docs are highlighted while clusters B and C are dimmed, showing that only cluster A's docs are scanned when nprobe = 1."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.orange}06`,
                border: `1px solid ${C.orange}12`,
                textAlign: "center",
              }}
            >
              <T color={C.orange} bold size={15} center>
                Work with nprobe = 1
              </T>
              <T color="#ffcc80" bold size={22} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                3 + 5 = 8 dot products
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                3 to pick the nearest centroid, 5 to scan cluster A
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.red}06`,
                border: `1px solid ${C.red}12`,
                textAlign: "center",
              }}
            >
              <T color={C.red} bold size={15} center>
                Brute force
              </T>
              <T color="#ef9a9a" bold size={22} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                10 dot products
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }} center>
                Scan every doc every query
              </T>
            </div>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            At N = 10, 8 vs 10 looks tiny. At N = 1M with nlist = 1000, IVF at nprobe = 1 scans about N/1000 = 1000 docs
            instead of a million. That is a thousand-times speedup, and it is where IVF earns its keep.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            nprobe is the recall-latency knob
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            nprobe = 1 is fastest but fragile: if the true neighbor sits just across a cell boundary, the probe misses
            it. Raising nprobe tells IVF to scan the top-nprobe closest cells, not just the closest one. More cells
            scanned means higher recall and higher latency - a direct move on the tradeoff triangle.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { nprobe: 1, label: "probe 1 cell", ratio: "1/3 of corpus" },
              { nprobe: 2, label: "probe 2 cells", ratio: "2/3 of corpus" },
              { nprobe: 3, label: "probe all cells", ratio: "Full corpus" },
            ].map((v) => (
              <div
                key={v.nprobe}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: `${C.yellow}06`,
                  border: `1px solid ${C.yellow}12`,
                }}
              >
                <T color={C.yellow} bold center size={15} style={{ fontFamily: "monospace" }}>
                  nprobe = {v.nprobe}
                </T>
                <div style={{ marginTop: 6 }}>
                  <IVFScatter
                    variant="probe"
                    nprobe={v.nprobe}
                    showQuery
                    desc={`IVF scatter with nprobe = ${v.nprobe}; ${v.label}.`}
                  />
                </div>
                <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                  {v.ratio}
                </T>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <T color={C.yellow} bold center size={16}>
              Measured recall and cost at a realistic scale (N = 1M, nlist = 1000)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.yellow} bold size={13}>
                nprobe
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                Recall@10
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                Docs scanned
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                Latency vs brute
              </T>
              {[
                { n: 1, recall: "0.80", scanned: "1,000", speed: "1000x" },
                { n: 4, recall: "0.93", scanned: "4,000", speed: "250x" },
                { n: 8, recall: "0.97", scanned: "8,000", speed: "125x" },
                { n: 32, recall: "0.995", scanned: "32,000", speed: "31x" },
              ].flatMap((row) => [
                <T key={`n-${row.n}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }} center>
                  {row.n}
                </T>,
                <T
                  key={`r-${row.n}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`s-${row.n}`}
                  color={C.bright}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.scanned}
                </T>,
                <T
                  key={`v-${row.n}`}
                  color={C.yellow}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.speed}
                </T>,
              ])}
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            nprobe is the single most important IVF knob. Pick it to hit your recall target, then accept the latency
            that comes with it.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Sizing IVF in production
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Two rules of thumb cover 90 percent of IVF deployments. Pick nlist to keep each cell small enough that
            scanning it is fast, and pick nprobe from a recall curve measured on your own data.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 16,
              color: C.bright,
              lineHeight: 2,
            }}
          >
            nlist &asymp; &radic;N <span style={{ color: C.dim }}>(FAISS default rule)</span>
            <br />N = 1,000,000 &rarr; sqrt(N) &asymp; 1000 &rarr; FAISS rounds up to{" "}
            <span style={{ color: C.purple }}>4096</span>
            <br />N = 100,000,000 &rarr; sqrt(N) &asymp; 10,000 &rarr; <span style={{ color: C.purple }}>32,768</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                nprobe = 8
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                A sensible starting point that typically reaches 97% recall on text embeddings. Raise to 16 or 32 for
                recall-critical workloads, drop to 4 or less when latency is tight.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.purple}06`,
                border: `1px solid ${C.purple}12`,
              }}
            >
              <T color={C.purple} bold center size={17}>
                Memory overhead
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Each centroid is d=768 float32 numbers = 3 KB, so nlist centroids cost nlist &middot; 3 KB. At
                nlist=4096 that is 12 MB total, negligible next to the vector dataset itself.
              </T>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.purple}06`,
              border: `1px solid ${C.purple}12`,
              textAlign: "center",
            }}
          >
            <T color={C.purple} bold center size={17}>
              The tradeoff IVF makes
            </T>
            <T color="#b8a9ff" center size={15} style={{ marginTop: 6 }}>
              IVF trades a tiny bit of recall (docs near cell boundaries can be missed) and a fixed one-time clustering
              cost for a massive per-query speedup. Memory overhead is trivial. This is why IVF is the FAISS default for
              million-scale static corpora.
            </T>
          </div>
        </Box>
      </Reveal>
      {sub < 6 && (
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
