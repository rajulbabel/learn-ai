import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function Vamana(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            HNSW hits a RAM wall around 100M vectors
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            HNSW assumes the entire graph plus every vector lives in RAM. That assumption breaks at production scale. A
            single machine with 384 GB of RAM can just barely hold 100 million 768-dim float32 vectors plus their HNSW
            graph. Beyond that we need either sharding across many machines or a different algorithm.
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
            At N = 100M, d = 768, M = 16:
            <br />
            Vectors: 300 GB
            <br />
            HNSW graph: 20 GB
            <br />
            Total RAM needed: <span style={{ color: C.red }}>320 GB</span>{" "}
            <span style={{ color: C.dim }}>(barely fits on one server)</span>
            <br />
            At N = 1,000,000,000: <span style={{ color: C.red }}>3.2 TB</span>{" "}
            <span style={{ color: C.dim }}>(needs multi-node sharding)</span>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }} center>
            Microsoft hit this wall on Bing. Their answer, published in 2019, is Vamana - a graph index designed from
            the ground up to work when the graph lives on SSD and only a cache slice lives in RAM.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            HNSW has a pyramid, Vamana has one flat layer
          </T>
          <T color="#80deea" style={{ marginTop: 8 }} center>
            HNSW builds a pyramid of layers so it can make fast long-range jumps through the upper hubs. Vamana throws
            the pyramid away and uses a single flat graph - every node sits on one plane with no layer stack above it.
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
            <T color={C.cyan} bold center size={16}>
              Side-by-side: pyramid vs flat layer
            </T>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              <div>
                <svg viewBox="0 0 240 200" style={{ width: "100%", height: "auto", display: "block" }}>
                  <desc>
                    HNSW hierarchical graph with three stacked layers. The top layer holds a single hub node, the middle
                    layer three hub nodes connected by long orange arcs, and the bottom layer eight nodes connected by
                    short green edges. Dashed vertical lines link the same node across layers.
                  </desc>
                  <text x="8" y="34" fill={C.dim} fontSize="11">
                    L2
                  </text>
                  <text x="8" y="94" fill={C.dim} fontSize="11">
                    L1
                  </text>
                  <text x="8" y="169" fill={C.dim} fontSize="11">
                    L0
                  </text>
                  <line x1="120" y1="30" x2="60" y2="90" stroke={C.orange} strokeWidth="1.5" />
                  <line x1="120" y1="30" x2="180" y2="90" stroke={C.orange} strokeWidth="1.5" />
                  <line x1="60" y1="90" x2="120" y2="90" stroke={C.cyan} strokeWidth="1.2" strokeOpacity="0.6" />
                  <line x1="120" y1="90" x2="180" y2="90" stroke={C.cyan} strokeWidth="1.2" strokeOpacity="0.6" />
                  <line x1="30" y1="165" x2="60" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="60" y1="165" x2="90" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="90" y1="165" x2="120" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="120" y1="165" x2="150" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="150" y1="165" x2="180" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="180" y1="165" x2="210" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="60" y1="145" x2="60" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="60" y1="145" x2="90" y2="165" stroke={C.green} strokeWidth="1.3" />
                  <line x1="120" y1="30" x2="120" y2="90" stroke={C.dim} strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="120" y1="90" x2="120" y2="165" stroke={C.dim} strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="60" y1="90" x2="60" y2="145" stroke={C.dim} strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="180" y1="90" x2="180" y2="165" stroke={C.dim} strokeDasharray="3,3" strokeWidth="0.8" />
                  <circle cx="120" cy="30" r="7" fill={C.cyan} />
                  {[60, 120, 180].map((x) => (
                    <circle key={`m${x}`} cx={x} cy={90} r="6" fill={C.cyan} />
                  ))}
                  {[
                    [30, 165],
                    [60, 165],
                    [90, 165],
                    [120, 165],
                    [150, 165],
                    [180, 165],
                    [210, 165],
                    [60, 145],
                  ].map(([x, y], i) => (
                    <circle key={`b${i}`} cx={x} cy={y} r="5" fill={C.cyan} />
                  ))}
                </svg>
                <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                  HNSW: 3 layers, long jumps live on top
                </T>
              </div>
              <div>
                <svg viewBox="0 0 240 200" style={{ width: "100%", height: "auto", display: "block" }}>
                  <desc>
                    Single flat Vamana graph with eight nodes on one plane. Short green edges connect nearby nodes for
                    local precision while long orange edges stretch across the plane, doing the cross-space work
                    HNSW&apos;s upper layers used to do.
                  </desc>
                  <text x="8" y="105" fill={C.dim} fontSize="11">
                    Flat
                  </text>
                  <line x1="40" y1="60" x2="80" y2="40" stroke={C.green} strokeWidth="1.3" />
                  <line x1="80" y1="40" x2="115" y2="85" stroke={C.green} strokeWidth="1.3" />
                  <line x1="115" y1="85" x2="155" y2="55" stroke={C.green} strokeWidth="1.3" />
                  <line x1="155" y1="55" x2="200" y2="70" stroke={C.green} strokeWidth="1.3" />
                  <line x1="60" y1="130" x2="130" y2="150" stroke={C.green} strokeWidth="1.3" />
                  <line x1="130" y1="150" x2="195" y2="140" stroke={C.green} strokeWidth="1.3" />
                  <line x1="115" y1="85" x2="130" y2="150" stroke={C.green} strokeWidth="1.3" />
                  <line x1="40" y1="60" x2="195" y2="140" stroke={C.orange} strokeWidth="1.6" />
                  <line x1="80" y1="40" x2="130" y2="150" stroke={C.orange} strokeWidth="1.6" />
                  <line x1="200" y1="70" x2="60" y2="130" stroke={C.orange} strokeWidth="1.6" />
                  {[
                    [40, 60],
                    [80, 40],
                    [115, 85],
                    [155, 55],
                    [200, 70],
                    [60, 130],
                    [130, 150],
                    [195, 140],
                  ].map(([x, y], i) => (
                    <circle key={`f${i}`} cx={x} cy={y} r="6" fill={C.cyan} />
                  ))}
                </svg>
                <T color={C.dim} size={13} center style={{ marginTop: 4 }}>
                  Vamana: 1 layer, every edge lives here
                </T>
              </div>
            </div>
          </div>
        </Box>
      </Reveal>

      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            Why drop the pyramid? On SSD every hop costs the same
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            HNSW&apos;s pyramid only earns its keep because top-layer hops in RAM are essentially free. Once the graph
            lives on SSD, every hop - whether through a top-layer hub or a bottom-layer neighbor - costs the same 10
            microseconds. The hierarchy stops paying for itself, so Vamana skips it.
          </T>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold size={16} center>
                HNSW in RAM
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                Top-layer jump: ~0.1 &micro;s
              </T>
              <T color={C.bright} size={15} style={{ fontFamily: "monospace" }} center>
                Bottom hop: ~0.1 &micro;s
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6, fontStyle: "italic" }} center>
                Layering saves hops cheaply
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
              <T color={C.red} bold size={16} center>
                Vamana on SSD
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                Any hop: ~10 &micro;s
              </T>
              <T color={C.bright} size={15} style={{ fontFamily: "monospace" }} center>
                Every layer: same cost
              </T>
              <T color={C.dim} size={14} style={{ marginTop: 6, fontStyle: "italic" }} center>
                No free jumps; hierarchy adds nothing
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 12, fontStyle: "italic" }}>
            A 100x speed difference per hop is why HNSW wins in RAM and Vamana wins on SSD.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Each node&apos;s R = 64 edges do double duty
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            Without a pyramid to provide long-range jumps, each Vamana node&apos;s 64 neighbors have to cover both jobs
            at once: some are short-range (for final local precision near the target) and some are long-range (for fast
            cross-space jumps that HNSW used to do on the top layer).
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
            <svg
              viewBox="0 0 420 260"
              style={{ width: "100%", maxWidth: 480, height: "auto", display: "block", margin: "0 auto" }}
            >
              <desc>
                A single focal Vamana node p at the center surrounded by a mix of short green edges fanning to close
                neighbors for local precision and long orange edges shooting across the plane to distant nodes, together
                replacing both HNSW&apos;s bottom-layer edges and its top-layer hub jumps.
              </desc>
              {[
                [180, 110],
                [240, 105],
                [245, 155],
                [175, 160],
              ].map(([x, y], i) => (
                <line key={`sl${i}`} x1="210" y1="130" x2={x} y2={y} stroke={C.green} strokeWidth="1.6" />
              ))}
              {[
                [30, 40],
                [400, 30],
                [30, 230],
                [400, 220],
                [180, 20],
                [240, 240],
              ].map(([x, y], i) => (
                <line key={`ll${i}`} x1="210" y1="130" x2={x} y2={y} stroke={C.orange} strokeWidth="1.6" />
              ))}
              {[
                [100, 70],
                [320, 80],
                [80, 180],
                [330, 200],
              ].map(([x, y], i) => (
                <circle key={`o${i}`} cx={x} cy={y} r="5" fill={C.dim} fillOpacity="0.5" />
              ))}
              {[
                [180, 110],
                [240, 105],
                [245, 155],
                [175, 160],
              ].map(([x, y], i) => (
                <circle key={`sn${i}`} cx={x} cy={y} r="6" fill={C.cyan} />
              ))}
              {[
                [30, 40],
                [400, 30],
                [30, 230],
                [400, 220],
                [180, 20],
                [240, 240],
              ].map(([x, y], i) => (
                <circle key={`ln${i}`} cx={x} cy={y} r="6" fill={C.cyan} />
              ))}
              <circle cx="210" cy="130" r="11" fill={C.green} stroke={C.green} strokeWidth="2" />
              <text x="210" y="134" textAnchor="middle" fill="#08080d" fontSize="12" fontWeight="bold">
                p
              </text>
            </svg>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 18,
                marginTop: 8,
                fontSize: 14,
                flexWrap: "wrap",
                fontFamily: "monospace",
              }}
            >
              <span style={{ color: C.green }}>-- short edges = local precision</span>
              <span style={{ color: C.orange }}>-- long edges = cross-space jumps</span>
            </div>
            <T color={C.bright} size={14} center style={{ marginTop: 6, fontStyle: "italic" }}>
              The short greens do what HNSW&apos;s bottom layer did. The long oranges do what its top layer did. Both
              baked into one node on one flat graph.
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
            R = 64 <span style={{ color: C.dim }}>(default max neighbors per node)</span>
            <br />
            Single flat layer, no hierarchy
            <br />
            Each node&apos;s edges span short + long ranges
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Vamana&apos;s build algorithm, called alpha-pruning, is what picks these 64 edges to be diverse - a mix of
            short for precision and long for cross-space jumps - instead of the 64 closest neighbors which would all
            clump together.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Quick primer: what is NVMe?
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            <b>NVMe</b> stands for <b>Non-Volatile Memory Express</b>. It is the modern protocol that plugs an SSD
            directly into the PCIe bus, skipping the slow older SATA path. Inside the drive, flash is organised into
            fixed-size <b>pages</b> - almost always 4 KB each. One SSD read returns one page; asking for fewer bytes
            still costs a whole page.
          </T>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
            >
              <T color={C.dim} size={14} bold center>
                Older SATA SSD
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                ~500 MB/s
              </T>
              <T color={C.bright} size={15} style={{ fontFamily: "monospace" }} center>
                ~100 &micro;s per random read
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.green}06`,
                border: `1px solid ${C.green}12`,
                textAlign: "center",
              }}
            >
              <T color={C.green} bold size={14} center>
                NVMe SSD (modern)
              </T>
              <T color={C.bright} size={15} style={{ marginTop: 6, fontFamily: "monospace" }} center>
                ~3-7 GB/s
              </T>
              <T color={C.bright} size={15} style={{ fontFamily: "monospace" }} center>
                ~10 &micro;s per random read
              </T>
            </div>
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 12, fontStyle: "italic" }}>
            ~10x faster than SATA. Vamana only works as an online search engine because of NVMe speeds.
          </T>
        </Box>
      </Reveal>

      <Reveal when={sub >= 5}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Graph lives on SSD; a cache slice lives in RAM
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Vamana stores each node&apos;s adjacency list on SSD as a 4 KB block aligned to the NVMe page. Every block
            holds one node&apos;s neighbor list <b>and</b> the vector itself, so a single 4 KB read delivers both the
            edges and the data needed to compute distance - one IO per hop, no waste. A small subset of the graph
            (typically the central high-degree entry-layer nodes) is kept in RAM as a cache.
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
            <svg viewBox="0 0 500 180" style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
              <desc>
                Storage hierarchy diagram: top layer shows a RAM cache holding a small subset of high-degree entry
                nodes; bottom layer shows the SSD storing every graph node as 4 KB blocks aligned to NVMe pages.
              </desc>
              <rect
                x="20"
                y="20"
                width="460"
                height="60"
                fill={`${C.green}10`}
                stroke={C.green}
                strokeWidth="2"
                rx="6"
              />
              <text x="30" y="40" fill={C.green} fontSize="13" fontWeight="bold">
                RAM cache (entry layer)
              </text>
              <text x="30" y="60" fill={C.bright} fontSize="12" fontFamily="monospace">
                ~1-5% of nodes, kept hot for every query
              </text>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={340 + i * 25} cy={50} r={8} fill={C.green} />
              ))}
              <rect
                x="20"
                y="100"
                width="460"
                height="70"
                fill={`${C.orange}10`}
                stroke={C.orange}
                strokeWidth="2"
                rx="6"
              />
              <text x="30" y="122" fill={C.orange} fontSize="13" fontWeight="bold">
                SSD (NVMe)
              </text>
              <text x="30" y="140" fill={C.bright} fontSize="12" fontFamily="monospace">
                4 KB blocks, one per node (vector + adjacency list)
              </text>
              {Array.from({ length: 18 }).map((_, i) => (
                <rect
                  key={i}
                  x={175 + i * 15}
                  y={145}
                  width={11}
                  height={18}
                  fill={C.orange}
                  stroke="#08080d"
                  strokeWidth="0.5"
                />
              ))}
            </svg>
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
            Disk block = 4 KB = 1 vector + neighbor ids
            <br />
            NVMe random read latency: ~10 &micro;s per block
            <br />
            Memory cache: entry-layer nodes (most-traversed)
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            The 4 KB choice is deliberate - it matches NVMe page granularity so we pay for one IO per hop, no more.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 6}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            Search: greedy in RAM, a few SSD fetches, done
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            A Vamana search starts in the RAM cache and greedy-descends there for free (no disk IO). When the greedy
            walk drops off the cached subgraph, every hop costs one SSD read. With a good graph and a well-chosen cache,
            total SSD reads per query stay under 80 - about 800 microseconds of IO plus compute.
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
            <T color={C.green} bold center size={16}>
              Per-query budget at N = 100M, d = 768
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { label: "RAM hops", value: "~20", detail: "Free (nanoseconds each)", color: C.green },
                { label: "SSD reads", value: "40-80", detail: "10 us each on NVMe", color: C.orange },
                { label: "Distance ops", value: "~80", detail: "About 60 ns each", color: C.yellow },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: `${row.color}08`,
                    border: `1px solid ${row.color}18`,
                  }}
                >
                  <T color={row.color} bold center size={14}>
                    {row.label}
                  </T>
                  <T color={row.color} bold center size={24} style={{ marginTop: 4, fontFamily: "monospace" }}>
                    {row.value}
                  </T>
                  <T color={C.bright} size={12} center style={{ marginTop: 4 }}>
                    {row.detail}
                  </T>
                </div>
              ))}
            </div>
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
            Total latency &asymp; 80 &middot; 10 &micro;s + compute &asymp;{" "}
            <span style={{ color: C.green }}>~1 ms per query</span>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            A single-digit-millisecond vector search over a graph that never fits in RAM. That is the whole point of
            DiskANN.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 7}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            100 billion vectors on one machine
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            With R = 64, d = 768, and 1.2 alpha-pruning, a single server with about 128 GB of RAM and 10 TB of NVMe
            holds 100 billion vectors and still answers queries in a few milliseconds. That is more vectors than Google
            indexes for web search. Azure AI Search and Milvus disk mode both ship DiskANN implementations; self-hosted
            OpenSearch-vector and several Milvus deployments use it too.
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
            1 server: 128 GB RAM + 10 TB NVMe
            <br />
            Holds: <span style={{ color: C.yellow }}>100,000,000,000 vectors</span>
            <br />
            Query latency: ~5 ms at recall@10 = 0.95
            <br />
            Cost: ~1/10 of HNSW multi-node cluster at the same scale
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                Where DiskANN is deployed
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                Azure AI Search (core engine for Bing), Milvus disk mode, Weaviate with Vamana backend, self-hosted
                DiskANN deployments at Microsoft, Snowflake, Databricks.
              </T>
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: `${C.yellow}06`,
                border: `1px solid ${C.yellow}12`,
              }}
            >
              <T color={C.yellow} bold center size={16}>
                FreshDiskANN for updates and deletes
              </T>
              <T color={C.bright} size={14} style={{ marginTop: 6 }}>
                The 2021 follow-up paper adds incremental inserts and deletes on top of Vamana, handling the one thing
                the original couldn&apos;t. Production systems use it to avoid periodic full rebuilds.
              </T>
            </div>
          </div>
          <T color="#ffe082" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Vamana is the answer when the graph does not fit in RAM. HNSW is still the production default under 100M
            vectors, but above that, Vamana / DiskANN is the algorithm the large-scale systems reach for.
          </T>
        </Box>
      </Reveal>
      {sub < 5 && (
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
