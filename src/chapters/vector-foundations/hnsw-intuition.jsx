import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";
import { HNSWLayeredGraph } from "../../shared/vector-graphs.jsx";

export default function HNSWIntuition(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            A flat proximity graph: every node linked to its M nearest
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            HNSW starts with one simple idea. Build a graph over the 10 docs where each node links to its M nearest
            neighbors. M is a tuning knob; for this visual we use M = 3 so the picture stays readable. In production M =
            16 is standard.
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            One nuance: because the graph is undirected, a node ends up with <i>at least</i> M edges, not exactly M. If
            another node picks this one among its M nearest, the link is added both ways - so some nodes in the picture
            below have 4 edges instead of 3. Real HNSW caps this at a hard upper bound called M_max (usually 2M),
            pruning older neighbors if a node gets too crowded.
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
            <HNSWLayeredGraph
              mode="flat"
              desc="Flat proximity graph of the 10 cat-corpus documents with each node connected by cyan edges to its two or three nearest neighbors."
            />
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 15,
              color: C.bright,
              lineHeight: 1.9,
            }}
          >
            For each doc d:
            <br />
            &nbsp;&nbsp;neighbors(d) = M nearest docs by distance
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
            Every doc is reachable from every other doc by hopping along edges. The question is how fast we can reach
            the right one.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Greedy from a random start: too many hops
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }} center>
            Greedy search starts somewhere and moves to whichever neighbor is closer to the query. Simple and correct -
            but if the starting node is far from the query, the walk across the flat graph takes many short hops. On N =
            1,000,000 with a random start, greedy-on-flat averages about 1,000 hops. Slow.
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
            <HNSWLayeredGraph
              mode="slowGreedy"
              desc="Flat proximity graph with a dashed red path that meanders through many nodes before converging on the cat cluster near doc 1. Illustrates that random-start greedy search on a flat graph is slow."
              highlightPath={[10, 8, 6, 9, 10, 8, 2, 3, 1]}
            />
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
            Start: doc 10 (birds/fish)
            <br />
            Target: doc 1 (cats)
            <br />
            Hops on this flat graph: <span style={{ color: C.red }}>~8 hops</span> for 10 docs
            <br />
            Extrapolated to N = 1,000,000: <span style={{ color: C.red }}>many hundreds of hops</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Many hops because the flat graph has only local edges. There is no way to jump across the space in one step
            - we have to trudge through every intermediate doc.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Lift a few nodes to a hub layer with long-range edges
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            Now add a sparse second layer above the flat graph. Only a handful of nodes exist on it - we call them hubs.
            Hubs are connected to each other by long-range edges that span the whole dataset. A query enters the graph
            at the hub layer, jumps across the space in one or two long hops, then drops down to the flat layer for the
            final fine-grained search.
          </T>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.yellow}06`,
              border: `1px solid ${C.yellow}12`,
            }}
          >
            <HNSWLayeredGraph
              mode="hubLayer"
              desc="Two-layer HNSW illustration: bottom cyan layer is the flat proximity graph of all 10 docs; top yellow layer holds three hub nodes (docs 1, 6, 10) with yellow long-range edges between them spanning the space."
            />
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Long-range edges
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                Hub-to-hub edges reach across the dataset in one hop. Enter at a hub, pay one long-haul, and we are
                already near the target&apos;s neighborhood.
              </T>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={15}>
                Drop down once close
              </T>
              <T color={C.bright} size={13} style={{ marginTop: 4 }}>
                When no hub is closer to the query, drop to layer 0 and do the last mile on the flat graph&apos;s short
                edges.
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            One sparse hub layer already drops search from N-scale hops to a handful. Stacking one more layer on top
            takes it to log N.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Stack layers exponentially: O(log N) hops total
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Stack a third layer on top, holding only a hub-of-hubs node or two. Searches enter at the top layer, descend
            through each tier with a constant number of hops per layer, and land at layer 0 already right next to the
            target. Because each layer holds roughly 1/M of the nodes beneath it, the number of layers grows with log(N)
            and so does the total hop count.
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
            <HNSWLayeredGraph
              mode="twoLayers"
              desc="Three-layer HNSW illustration: bottom cyan layer is the flat graph of all 10 docs; middle yellow layer has three hub nodes with long-range edges; top red layer has a single hub-of-hubs node providing the global entry point."
            />
          </div>
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
            layers = &lceil;log<sub>M</sub>(N)&rceil;
            <br />
            At M = 16, N = 1,000,000:{"  "}
            <span style={{ color: C.green }}>log&#8321;&#8326;(1,000,000) &asymp; 5 layers</span>
            <br />
            Hops per layer &asymp; constant (~6 with ef_search = 50)
            <br />
            <span style={{ color: C.dim, fontSize: 13 }}>
              ef_search = how many candidates the search keeps in its shortlist at each step (bigger = better recall,
              slower)
            </span>
            <br />
            Total hops &asymp; <span style={{ color: C.green }}>30</span> to find the top-k{"  "}
            <span style={{ color: C.dim }}>vs. ~1000 on flat</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            That is the whole HNSW payoff. Flat graph: O(N) hops. Hierarchical graph: O(log N) hops. Exponential speedup
            for a small memory bump from the upper layers.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            The airport analogy makes it concrete
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            Getting from a small town in India to a small town in Portugal is not one direct flight. You take a local
            cab to the regional airport, a regional flight to an international hub, a long-haul flight across continents
            to another international hub, a regional flight down, and a local cab in. HNSW search does the same thing
            for vectors - the long-haul tier lets us cover enormous distance in one hop.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                title: "Local (layer 0)",
                color: C.cyan,
                light: "#80deea",
                body: "Every city has an airstrip. Many connections to nearby towns. On a flat graph you are stuck using only these.",
                qty: "100% of nodes",
              },
              {
                title: "Regional (layer 1)",
                color: C.yellow,
                light: "#ffe082",
                body: "A handful of regional airports. Reachable from any local airstrip, and connected to each other by medium-range flights.",
                qty: "~6% of nodes (1/M = 1/16)",
              },
              {
                title: "International (layer 2+)",
                color: C.red,
                light: "#ef9a9a",
                body: "A few global hubs. Long-haul flights between continents. Search enters here and drops down as it gets closer to the target.",
                qty: "<1% of nodes",
              },
            ].map((tier) => (
              <div
                key={tier.title}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${tier.color}06`,
                  border: `1px solid ${tier.color}12`,
                }}
              >
                <T color={tier.light} bold center size={16}>
                  {tier.title}
                </T>
                <T color={tier.color} size={13} center style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {tier.qty}
                </T>
                <T color={C.bright} size={13} style={{ marginTop: 6 }}>
                  {tier.body}
                </T>
              </div>
            ))}
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
              The route a query takes
            </T>
            <T color="#b8a9ff" center size={15} style={{ marginTop: 6 }}>
              Long-haul at international layer &rarr; regional hops once you are over the right continent &rarr; short
              local hops to the final neighbor. Same strategy planes use. Same strategy HNSW uses.
            </T>
          </div>
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
