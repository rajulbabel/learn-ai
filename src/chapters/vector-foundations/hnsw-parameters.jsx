import { Box, T, Reveal, SubBtn } from "../../components.jsx";
import { C } from "../../config.js";

export default function HNSWParameters(ctx) {
  const { sub, subBtnRipple, setSubBtnRipple, registerSubBtn, navigate } = ctx;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sub >= 0 && (
        <Box color={C.purple} style={{ width: "100%" }}>
          <T color={C.purple} bold center size={22}>
            Three knobs, three defaults
          </T>
          <T color="#b8a9ff" style={{ marginTop: 8 }}>
            HNSW exposes exactly three parameters. M controls the graph shape (build-time structural choice).
            ef_construction controls how hard we work to pick good neighbors during insert (build-time effort).
            ef_search controls how wide a net we cast at query time (query-time recall dial). The defaults below work
            for most text-embedding workloads out of the box.
          </T>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              {
                name: "M",
                value: "16",
                color: C.cyan,
                light: "#80deea",
                when: "Build time (fixed)",
                trades: "Recall vs memory",
              },
              {
                name: "ef_construction",
                value: "200",
                color: C.yellow,
                light: "#ffe082",
                when: "Build time (one-off)",
                trades: "Recall vs build time",
              },
              {
                name: "ef_search",
                value: "50",
                color: C.green,
                light: "#80e8a5",
                when: "Query time (per query)",
                trades: "Recall vs latency",
              },
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: `${p.color}06`,
                  border: `1px solid ${p.color}12`,
                }}
              >
                <T color={p.light} bold center size={16} style={{ fontFamily: "monospace" }}>
                  {p.name}
                </T>
                <T color={p.color} bold center size={28} style={{ marginTop: 4, fontFamily: "monospace" }}>
                  {p.value}
                </T>
                <T color={C.dim} size={13} center style={{ marginTop: 6 }}>
                  {p.when}
                </T>
                <T color={C.bright} size={13} center style={{ marginTop: 4 }}>
                  trades: {p.trades}
                </T>
              </div>
            ))}
          </div>
          <T color="#b8a9ff" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Change one knob at a time and measure. Changing two at once makes it impossible to tell which mattered.
          </T>
        </Box>
      )}
      <Reveal when={sub >= 1}>
        <Box color={C.cyan} style={{ width: "100%" }}>
          <T color={C.cyan} bold center size={22}>
            M: more edges means better recall, more memory
          </T>
          <T color="#80deea" style={{ marginTop: 8 }}>
            M is the cap on neighbors per node at layer 0. Doubling M roughly doubles the per-vector graph memory and
            gives a small but measurable recall bump. The relationship is nearly linear; at some point the returns
            flatten and you are just burning memory.
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
              Measured at ef_search = 50, N = 1M, d = 768
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
              <T color={C.cyan} bold size={13}>
                M
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                Recall@10
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                Graph bytes/vec
              </T>
              <T color={C.cyan} bold size={13} style={{ textAlign: "center" }}>
                Memory at N = 1M
              </T>
              {[
                { m: 8, recall: "0.93", bpv: "~35", total: "35 MB" },
                { m: 16, recall: "0.97", bpv: "~70", total: "70 MB" },
                { m: 32, recall: "0.99", bpv: "~140", total: "140 MB" },
                { m: 48, recall: "0.995", bpv: "~210", total: "210 MB" },
              ].flatMap((row) => [
                <T key={`m-${row.m}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }} center>
                  {row.m}
                </T>,
                <T
                  key={`mr-${row.m}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`mb-${row.m}`}
                  color={C.bright}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.bpv}
                </T>,
                <T
                  key={`mt-${row.m}`}
                  color={C.yellow}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.total}
                </T>,
              ])}
            </div>
          </div>
          <T color="#80deea" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            M = 16 is the sweet spot for text. Drop to 8 when RAM is tight; go to 32 or 48 when recall is critical and
            memory is available.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 2}>
        <Box color={C.yellow} style={{ width: "100%" }}>
          <T color={C.yellow} bold center size={22}>
            ef_construction: how hard to work while building
          </T>
          <T color="#ffe082" style={{ marginTop: 8 }}>
            ef_construction is the candidate pool size during insertion. A larger pool finds better neighbors for every
            new node, which yields a better graph and therefore better recall at query time. The cost is longer build
            times. Once the index is built, ef_construction no longer matters - it is a one-time cost paid up front.
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
            <T color={C.yellow} bold center size={16}>
              Build-time tradeoff at N = 1M, d = 768, M = 16
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "130px 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.yellow} bold size={13}>
                ef_construction
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                Build time
              </T>
              <T color={C.yellow} bold size={13} style={{ textAlign: "center" }}>
                Recall@10 ceiling
              </T>
              {[
                { ef: 100, time: "~5 min", recall: "0.95" },
                { ef: 200, time: "~9 min", recall: "0.97" },
                { ef: 500, time: "~20 min", recall: "0.98" },
                { ef: 1000, time: "~35 min", recall: "0.985" },
              ].flatMap((row) => [
                <T key={`e-${row.ef}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }} center>
                  {row.ef}
                </T>,
                <T
                  key={`et-${row.ef}`}
                  color={C.orange}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.time}
                </T>,
                <T
                  key={`er-${row.ef}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
              ])}
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
            ef_construction = 200 is the recommended starting point.
            <br />
            Returns diminish sharply past 500 on most text datasets.
          </div>
        </Box>
      </Reveal>
      <Reveal when={sub >= 3}>
        <Box color={C.green} style={{ width: "100%" }}>
          <T color={C.green} bold center size={22}>
            ef_search: the one knob you tune per workload
          </T>
          <T color="#80e8a5" style={{ marginTop: 8 }}>
            ef_search is the only knob you change after deployment. Raising it expands the beam at layer 0 - more
            candidate nodes explored per query, higher recall, higher latency. Lowering it does the opposite. This is
            the knob production teams reach for when they need a quick recall bump.
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
              Query-time sweep (M = 16, N = 1M, d = 768, single CPU core)
            </T>
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "100px 1fr 1fr",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 14,
                color: C.bright,
              }}
            >
              <T color={C.green} bold size={13}>
                ef_search
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "center" }}>
                Recall@10
              </T>
              <T color={C.green} bold size={13} style={{ textAlign: "center" }}>
                Latency
              </T>
              {[
                { ef: 10, recall: "0.85", ms: "0.5 ms" },
                { ef: 50, recall: "0.97", ms: "1.2 ms" },
                { ef: 200, recall: "0.995", ms: "3.0 ms" },
                { ef: 500, recall: "0.999", ms: "6.0 ms" },
              ].flatMap((row) => [
                <T key={`s-${row.ef}`} color={C.bright} size={13} style={{ fontFamily: "monospace" }} center>
                  {row.ef}
                </T>,
                <T
                  key={`sr-${row.ef}`}
                  color={C.green}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.recall}
                </T>,
                <T
                  key={`sm-${row.ef}`}
                  color={C.orange}
                  size={13}
                  style={{ fontFamily: "monospace", textAlign: "center" }}
                >
                  {row.ms}
                </T>,
              ])}
            </div>
          </div>
          <T color="#80e8a5" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Start at ef_search = 50. Bump to 100 or 200 if recall is low. Drop to 10-20 only when sub-millisecond
            latency matters more than a 1-2% recall drop.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 4}>
        <Box color={C.orange} style={{ width: "100%" }}>
          <T color={C.orange} bold center size={22}>
            Pick M first, then tune ef_search
          </T>
          <T color="#ffcc80" style={{ marginTop: 8 }}>
            Each M value traces its own recall curve as ef_search varies. Higher M lets the curve flatten closer to 1.0
            before latency gets painful. These numbers are empirical, measured on a laptop with SIFT-1M - not exact for
            every dataset, but illustrative of the shape.
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
            <T color={C.orange} bold center size={16}>
              Recall@10 curves vs ef_search
            </T>
            <svg
              viewBox="0 0 570 280"
              style={{ width: "100%", maxWidth: 590, height: "auto", display: "block", marginTop: 8 }}
            >
              <desc>
                Line chart plotting recall@10 on the vertical axis against ef_search on a log horizontal axis, with
                three curves for M = 8, M = 16, and M = 32. Higher M curves converge closer to 1.0 but require more
                memory; M = 16 is the standard compromise.
              </desc>
              <line x1="60" y1="30" x2="60" y2="230" stroke={C.dim} strokeWidth="1" />
              <line x1="60" y1="230" x2="500" y2="230" stroke={C.dim} strokeWidth="1" />
              <text x="55" y="40" fill={C.dim} fontSize="11" textAnchor="end">
                1.0
              </text>
              <text x="55" y="234" fill={C.dim} fontSize="11" textAnchor="end">
                0.80
              </text>
              <text x="60" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                10
              </text>
              <text x="180" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                50
              </text>
              <text x="330" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                200
              </text>
              <text x="480" y="258" fill={C.dim} fontSize="11" textAnchor="middle">
                500
              </text>
              <text x="280" y="275" fill={C.dim} fontSize="12" textAnchor="middle">
                ef_search (log scale)
              </text>
              {/* M=8 curve (cyan) */}
              <polyline points="60,180 180,90 330,60 480,45" fill="none" stroke={C.cyan} strokeWidth="2.5" />
              <text x="490" y="49" fill={C.cyan} fontSize="12" fontWeight="bold">
                M = 8
              </text>
              {/* M=16 curve (yellow) */}
              <polyline points="60,160 180,70 330,38 480,30" fill="none" stroke={C.yellow} strokeWidth="2.5" />
              <text x="490" y="32" fill={C.yellow} fontSize="12" fontWeight="bold">
                M = 16
              </text>
              {/* M=32 curve (green) */}
              <polyline points="60,150 180,55 330,33 480,28" fill="none" stroke={C.green} strokeWidth="2.5" />
              <text x="490" y="18" fill={C.green} fontSize="12" fontWeight="bold">
                M = 32
              </text>
            </svg>
          </div>
          <T color="#ffcc80" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            Moving along one curve is cheap (change ef_search). Switching curves is expensive (rebuild the graph with
            new M). That asymmetry is why M is a fixed architectural choice.
          </T>
        </Box>
      </Reveal>
      <Reveal when={sub >= 5}>
        <Box color={C.red} style={{ width: "100%" }}>
          <T color={C.red} bold center size={22}>
            Memory math and a playbook of which knob to raise
          </T>
          <T color="#ef9a9a" style={{ marginTop: 8 }}>
            At production scale (N = 100M, d = 768, M = 16), the total memory is dominated by vectors, with a small but
            real graph overhead on top. Compression knocks the vector portion way down. The playbook below tells you
            which knob to raise when a specific metric goes wrong.
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
              lineHeight: 1.9,
            }}
          >
            Memory &asymp; N &middot; (d &middot; 4 + M &middot; 8) bytes
            <br />
            At N = 100M, d = 768, M = 16:
            <br />
            100M &middot; (3072 + 128) &asymp; <span style={{ color: C.red }}>320 GB</span>{" "}
            <span style={{ color: C.dim }}>(300 GB vectors + 20 GB graph)</span>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: `${C.red}06`,
              border: `1px solid ${C.red}12`,
            }}
          >
            <T color={C.red} bold center size={17}>
              The playbook: which knob to raise or lower
            </T>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  symptom: "Recall is too low",
                  action: "Raise ef_search first, then raise M (rebuild required)",
                  color: C.green,
                },
                {
                  symptom: "Memory is too high",
                  action: "Lower M (rebuild), then apply PQ compression",
                  color: C.yellow,
                },
                {
                  symptom: "Build time is too slow",
                  action: "Lower ef_construction first, then lower M",
                  color: C.cyan,
                },
                {
                  symptom: "Query latency is too high",
                  action: "Lower ef_search - recall drops, queries get faster",
                  color: C.orange,
                },
              ].map((row) => (
                <div
                  key={row.symptom}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: `${row.color}08`,
                  }}
                >
                  <T color={row.color} bold size={14}>
                    {row.symptom}
                  </T>
                  <T color={C.bright} size={14}>
                    {row.action}
                  </T>
                </div>
              ))}
            </div>
          </div>
          <T color="#ef9a9a" size={16} style={{ marginTop: 10, fontStyle: "italic" }}>
            ef_search is the only knob you can change without a rebuild. That makes it the default tool for any incident
            response. Everything else requires planning ahead.
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
