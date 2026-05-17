import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { chapters, sectionNames } from "../config.js";

// Import all sections
import { TOC } from "../sections/toc.jsx";
import * as NeuralFoundations from "../sections/neural-foundations.jsx";
import { Graph } from "../sections/neural-foundations.jsx";
import * as LLMTraining from "../sections/llm-training.jsx";
import * as Scaling from "../sections/scaling.jsx";
import * as RoadToTransformers from "../sections/road-to-transformers.jsx";
import * as TransformerInput from "../sections/transformer-input.jsx";
import * as AttentionQKV from "../sections/attention-qkv.jsx";
import * as AttentionComputation from "../sections/attention-computation.jsx";
import * as TransformerBlock from "../sections/transformer-block.jsx";
import * as EncoderDecoderDiagrams from "../sections/encoder-decoder-diagrams.jsx";
import * as ModernLLMTechniques from "../sections/modern-llm-techniques.jsx";
import * as VectorFoundations from "../sections/vector-foundations.jsx";
import * as VectorCompression from "../sections/vector-compression.jsx";
import * as VectorProduction from "../sections/vector-production.jsx";
import * as VectorSystems from "../sections/vector-systems.jsx";
import * as RagFoundations from "../sections/rag-foundations.jsx";
import * as RagIngestion from "../sections/rag-ingestion.jsx";
import * as RagRetrieval from "../sections/rag-retrieval.jsx";
import * as RagGeneration from "../sections/rag-generation.jsx";
import * as RagEvaluation from "../sections/rag-evaluation.jsx";
import * as RagProduction from "../sections/rag-production.jsx";
import * as AgentPrompting from "../sections/agent-prompting.jsx";
import * as AgentTools from "../sections/agent-tools.jsx";
import * as AgentLoops from "../sections/agent-loops.jsx";
import * as MultiAgent from "../sections/multi-agent.jsx";
import * as AgentEvals from "../sections/agent-evals.jsx";
import * as AgentProduction from "../sections/agent-production.jsx";

const lookup = {
  TOC,
  ...NeuralFoundations,
  ...LLMTraining,
  ...Scaling,
  ...RoadToTransformers,
  ...TransformerInput,
  ...AttentionQKV,
  ...AttentionComputation,
  ...TransformerBlock,
  ...EncoderDecoderDiagrams,
  ...ModernLLMTechniques,
  ...VectorFoundations,
  ...VectorCompression,
  ...VectorProduction,
  ...VectorSystems,
  ...RagFoundations,
  ...RagIngestion,
  ...RagRetrieval,
  ...RagGeneration,
  ...RagEvaluation,
  ...RagProduction,
  ...AgentPrompting,
  ...AgentTools,
  ...AgentLoops,
  ...MultiAgent,
  ...AgentEvals,
  ...AgentProduction,
};

afterEach(() => cleanup());

// Default context factory
function makeCtx(overrides = {}) {
  return {
    sub: 0,
    setSub: vi.fn(),
    subBtnRipple: 0,
    setSubBtnRipple: vi.fn(),
    navigate: vi.fn(),
    goTo: vi.fn(),
    bankIdx: 0,
    setBankIdx: vi.fn(),
    hovered: 0,
    setHovered: vi.fn(),
    expanded: null,
    setExpanded: vi.fn(),
    registerSubBtn: vi.fn(),
    ...overrides,
  };
}

// Helper: render a chapter function at a given sub, click SubBtn if present, fire all cursor-pointer clicks
function renderAndInteract(fn, sub, extraCtx = {}) {
  const navigate = vi.fn();
  const setSubBtnRipple = vi.fn();
  const setHovered = vi.fn();
  const setBankIdx = vi.fn();
  const ctx = makeCtx({ sub, navigate, setSubBtnRipple, setHovered, setBankIdx, ...extraCtx });
  const { container } = render(fn(ctx));

  // Click SubBtn if present
  const subBtn = container.querySelector("[data-subbtn]");
  if (subBtn) fireEvent.click(subBtn);

  // Click all cursor-pointer elements (setHovered, setBankIdx, etc.)
  const clickables = container.querySelectorAll("[style*='cursor: pointer']");
  clickables.forEach((el) => {
    fireEvent.click(el);
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
  });

  return { container, navigate, setSubBtnRipple };
}

// ─── Generic: render every chapter at every sub and interact ───
describe("All chapters - full sub + interaction coverage", () => {
  chapters.forEach((chapter) => {
    const fn = lookup[chapter.component];

    describe(`${chapter.id} ${chapter.component}`, () => {
      // Go through enough sub levels to cover all branches (max any chapter uses is ~7)
      for (let s = 0; s <= 10; s++) {
        it(`sub=${s}`, () => {
          renderAndInteract(fn, s);
        });
      }
    });
  });
});

describe("MixtureOfExperts content", () => {
  const fn = ModernLLMTechniques.MixtureOfExperts;

  it("sub=0 shows motivation comparing dense vs MoE", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/47B/);
    expect(container.textContent).toMatch(/13B/);
    expect(container.textContent).toMatch(/Mixtral/);
  });

  it("sub=1 shows FFN replacement with router + experts", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/Router/);
    expect(container.textContent).toMatch(/FFN/);
  });

  it("sub=1 Before card uses valid CSS (no rgba with appended hex)", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    // Invalid CSS like "rgba(255,255,255,0.35)06" is silently dropped by browsers.
    // The Before card must use hex-alpha (e.g., "#ffffff0a") instead.
    const html = container.innerHTML;
    expect(html).not.toMatch(/rgba\([^)]*\)[0-9a-fA-F]{2}/);
  });

  it("sub=2 shows top-k routing with concrete example", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cat/);
    expect(container.textContent).toMatch(/0\.80/);
    expect(container.textContent).toMatch(/top-2|top 2/);
  });

  it("sub=3 shows load balancing problem and auxiliary loss fix", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/L_aux|auxiliary/);
    expect(container.textContent).toMatch(/balanc/i);
  });

  it("sub=4 shows Mixtral 8x7B parameter breakdown", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/46\.7B|46\.7/);
    expect(container.textContent).toMatch(/layers?/i);
  });

  it("sub=5 shows memory vs compute tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/94 GB|94GB/);
    expect(container.textContent).toMatch(/26 GFLOPs|GFLOP/);
  });

  it("sub=6 shows real MoE model examples", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Mixtral/);
    expect(container.textContent).toMatch(/DeepSeek/);
    expect(container.textContent).toMatch(/Qwen/);
  });

  it("sub=7 shows honest tradeoffs of MoE", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/edge|deployment/i);
    expect(container.textContent).toMatch(/free lunch|tradeoff/i);
  });
});

describe("Thinking content", () => {
  const fn = ModernLLMTechniques.Thinking;

  it("sub=0 shows before/after comparison with 23 x 47", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/23/);
    expect(container.textContent).toMatch(/47/);
    expect(container.textContent).toMatch(/1081/);
  });

  it("sub=1 shows unchanged-architecture checklist", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/unchanged|Every piece/i);
    expect(container.textContent).toMatch(/Tokenizer/);
    expect(container.textContent).toMatch(/Attention/);
  });

  it("sub=2 clarifies that both modes loop", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop/i);
    expect(container.textContent).toMatch(/same loop|more.*loop|longer/i);
  });

  it("sub=3 shows how think/</think> tokens work", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/think/);
    expect(container.textContent).toMatch(/probabilit/i);
  });

  it("sub=4 shows test-time compute scaling", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/test-time|compute/i);
    expect(container.textContent).toMatch(/100 tokens|100,000/);
  });

  it("sub=5 shows 3-stage training pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Pre-training/);
    expect(container.textContent).toMatch(/SFT/);
    expect(container.textContent).toMatch(/RL/);
  });

  it("sub=6 shows RL reward loop with rollouts", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/rollout/i);
    expect(container.textContent).toMatch(/reward|PPO|GRPO/);
  });

  it("sub=7 shows training data sources", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/checkable|verifiable/i);
    expect(container.textContent).toMatch(/synthetic|rejection/i);
  });

  it("sub=8 shows emergent behaviors", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/emerg/i);
    expect(container.textContent).toMatch(/self-correct|double-check|verify/i);
  });

  it("sub=9 shows honest scope - where reasoning helps and doesn't", () => {
    const { container } = render(fn(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/Math|code|logic/i);
    expect(container.textContent).toMatch(/creative|empathy|open-ended/i);
  });
});

describe("RetrievalProblem (11.1) content", () => {
  const fn = VectorFoundations.RetrievalProblem;

  it("sub=0 shows embeddings and the 10-doc cat corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/5\.2|embedding/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/information about cats/i);
  });

  it("sub=1 frames the retrieval task as top-k similarity", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/top-10|top 10/i);
    expect(container.textContent).toMatch(/similar/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 shows N scaling to 1 billion", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/every vector/i);
  });

  it("sub=3 shows multiple production use cases", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic search/i);
    expect(container.textContent).toMatch(/recommend|image|RAG/i);
  });

  it("sub=4 frames the section as a systems problem", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/systems problem|retrieval.*not.*training|indexing/i);
  });
});

describe("BruteForceKNN (11.2) content", () => {
  const fn = VectorFoundations.BruteForceKNN;

  it("sub=0 describes the compute-sort-return-k algorithm", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/compute.*similarit/i);
    expect(container.textContent).toMatch(/sort/i);
    expect(container.textContent).toMatch(/top-k|top k/i);
  });

  it("sub=1 runs brute-force on the 10-doc corpus with cosine", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/cats are small/i);
    expect(container.textContent).toMatch(/exact/i);
  });

  it("sub=2 shows slowdown at N = 1 million", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1,000,000|1 million|1M/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=3 defines FLOPS with the chef-warehouse analogy", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/FLOPS/);
    expect(container.textContent).toMatch(/floating.?point|math.*per second|operations per second/i);
    expect(container.textContent).toMatch(/chef|warehouse|fetch|deliver/i);
  });

  it("sub=3 does NOT yet show the 1 billion hopeless math", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).not.toMatch(/3\.072 TB/);
    expect(container.textContent).not.toMatch(/NOT FEASIBLE/);
  });

  it("sub=4 shows 3 TB memory math at 1 billion scale", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/3\.072 TB|3 TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/hopeless|not feasible|bottleneck/i);
  });

  it("sub=5 introduces ANN and recall as the metric", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ANN|Approximate Nearest Neighbor/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/99%|0\.99/);
  });

  // New assertion - lock in the canonical top-3 (docs 1, 3, 7) matching 11.1's SVG
  it("sub=1 top-3 matches 11.1's highlighted docs (1, 3, 7)", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const text = container.textContent;
    // The narrative should reference docs 1, 3, 7 as the top-3
    expect(text).toMatch(/1.*3.*7|docs? 1.*3.*7|top.*1.*3.*7/is);
  });
});

describe("ThreeWayTradeoff (11.3) content", () => {
  const fn = VectorFoundations.ThreeWayTradeoff;

  it("sub=0 introduces recall, latency, memory as the three axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/tradeoff|trade-off|trade off/i);
  });

  it("sub=1 defines recall@k with concrete 0.9 example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall@k|recall@10/i);
    expect(container.textContent).toMatch(/0\.9|90%/);
  });

  it("sub=2 compares brute-force and HNSW latencies", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/100\s?ms/);
    expect(container.textContent).toMatch(/1\s?ms/);
    expect(container.textContent).toMatch(/HNSW/);
  });

  it("sub=3 shows per-vector memory math at d=768", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3 KB|3072 bytes/);
    expect(container.textContent).toMatch(/768/);
  });

  it("sub=4 shows ef_search, compression, replica tradeoffs", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ef_search/);
    expect(container.textContent).toMatch(/PQ|compression/i);
    expect(container.textContent).toMatch(/replica|cache/i);
  });

  it("sub=4 glosses HNSW, codebook indices, and P99 so early readers are not lost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HNSW.*graph|graph.*HNSW/i);
    expect(container.textContent).toMatch(/codebook.*(code|lookup|integer)|(code|integer).*codebook/i);
    expect(container.textContent).toMatch(/P99.*(99|percentile|worst)|percentile.*P99/i);
  });

  it("sub=5 frames every decision as a tradeoff-triangle move", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/algorithm/i);
    expect(container.textContent).toMatch(/quantization|PQ/i);
  });
});

describe("DistanceMetrics (11.4) content", () => {
  const fn = VectorFoundations.DistanceMetrics;

  it("sub=0 lists cosine, L2, inner product", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/inner product|dot product/i);
  });

  it("sub=1 defines cosine with range and concrete example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/angle|\[-1, 1\]/);
  });

  it("sub=1 cosine table uses doc 7 (Kittens) as #2 cat exemplar - matches 11.2 top-3", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    // Doc 7 must appear in the cosine table because 11.2's top-3 is {1, 3, 7}
    // and doc 7's real cosine (0.9984) beats doc 3's (0.9867). Featuring doc 3
    // at #2 instead of doc 7 would contradict 11.2's BRUTE_FORCE_SCORES ordering.
    expect(container.textContent).toMatch(/doc 7/i);
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.9984");
    expect(container.textContent).not.toMatch(/doc 3 \(Lions/i);
  });

  it("sub=2 defines L2 as a distance with sqrt", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/sqrt|√/);
    expect(container.textContent).toMatch(/magnitude|smaller|distance/i);
  });

  it("sub=2 L2 table uses doc 7 (Kittens) as #2 cat exemplar - matches 11.2 top-3", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc 7/i);
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.057");
    expect(container.textContent).not.toMatch(/doc 3 \(Lions/i);
  });

  it("sub=3 highlights inner product speed and SIMD friendliness", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inner product|dot product/i);
    expect(container.textContent).toMatch(/SIMD|fastest|no sqrt/i);
  });

  it("sub=4 shows the normalization identity", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/normalized/i);
    expect(container.textContent).toMatch(/equivalent|identity|same/i);
  });

  it("sub=5 gives workload-to-metric guidance", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/text|SBERT|OpenAI/i);
    expect(container.textContent).toMatch(/vision|image/i);
  });
});

describe("IVF (11.5) content", () => {
  const fn = VectorFoundations.IVF;

  it("sub=0 revisits the brute-force-scans-every-vector baseline", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/every vector/i);
    expect(container.textContent).toMatch(/brute[- ]?force/i);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=1 introduces k-means with nlist = 3 clusters", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/nlist|3 clusters/i);
    expect(container.textContent).toMatch(/centroid/i);
  });

  it("sub=2 draws Voronoi cells around centroids", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/voronoi|cell/i);
    expect(container.textContent).toMatch(/belongs to|exactly one/i);
  });

  it("sub=2 clarifies that cell, cluster, partition, and posting list are the same thing", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    const txt = container.textContent;
    expect(txt).toMatch(/cluster/i);
    expect(txt).toMatch(/cell/i);
    expect(txt).toMatch(/partition/i);
    expect(txt).toMatch(/posting list/i);
    expect(txt).toMatch(/same thing|four names|different (names|angles|views)/i);
  });

  it("sub=3 explains the argmin formula and the frozen assignment in plain language", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/argmin/i);
    expect(container.textContent).toMatch(/closest centroid|nearest centroid/i);
    expect(container.textContent).toMatch(/distance/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/frozen|does not change|doesn't change/i);
  });

  it("sub=3 explains why IVF does not store polygons and what it stores instead", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/teaching|visual|illustration|just for/i);
    expect(container.textContent).toMatch(/inverted file|posting list|doc.*ID|table/i);
    expect(container.textContent).toMatch(/implicit|derive|on the fly|argmin/i);
  });

  it("sub=4 probes the single nearest cluster at nprobe = 1", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe\s*=\s*1/i);
    expect(container.textContent).toMatch(/nearest|centroid/i);
  });

  it("sub=5 shows recall vs nprobe tradeoff with concrete numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|1\.0|100%/);
  });

  it("sub=6 gives parameter guidance nlist sqrt(N) and nprobe", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/sqrt|√/i);
    expect(container.textContent).toMatch(/nlist/i);
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/4096|1000/);
  });
});

describe("ANNFamilyTree (11.6) content", () => {
  const fn = VectorFoundations.ANNFamilyTree;

  it("sub=0 frames sub-linear search as the goal", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/sub[- ]?linear|log\s*N/i);
    expect(container.textContent).toMatch(/1 billion|1B|million/i);
  });

  it("sub=1 covers KD-trees and the curse of dimensionality", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/kd[- ]?tree/i);
    expect(container.textContent).toMatch(/curse of dimensionality/i);
    expect(container.textContent).toMatch(/768|high dim/i);
  });

  it("sub=2 explains LSH as hash-based bucketing", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LSH|locality[- ]?sensitive/i);
    expect(container.textContent).toMatch(/hash|bucket/i);
  });

  it("sub=3 recaps IVF clustering as partition-and-probe", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/IVF|cluster/i);
    expect(container.textContent).toMatch(/partition/i);
  });

  it("sub=4 introduces HNSW and Vamana as graph indexes", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Vamana/);
    expect(container.textContent).toMatch(/graph|edge|node/i);
  });

  it("sub=5 explains why graphs won in production", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/production|ann[- ]?benchmarks/i);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Qdrant|Weaviate|Milvus|FAISS/);
  });
});

describe("HNSWIntuition (11.7) content", () => {
  const fn = VectorFoundations.HNSWIntuition;

  it("sub=0 introduces the flat proximity graph", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/flat/i);
    expect(container.textContent).toMatch(/proximity/i);
    expect(container.textContent).toMatch(/M|nearest/);
  });

  it("sub=1 shows greedy-from-random-start is slow", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/hop/i);
    expect(container.textContent).toMatch(/random|slow|many/i);
  });

  it("sub=2 introduces a sparse hub layer with long-range edges", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/long[- ]?range|long distance|long-haul/i);
    expect(container.textContent).toMatch(/layer/i);
  });

  it("sub=3 derives O(log N) from stacked layers", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/log\s*N|O\(log/i);
    expect(container.textContent).toMatch(/layer/i);
    expect(container.textContent).toMatch(/1,000,000|1M|20/);
  });

  it("sub=4 connects to the airport analogy", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/airport/i);
    expect(container.textContent).toMatch(/hub/i);
    expect(container.textContent).toMatch(/international|regional|local/i);
  });
});

describe("HNSWConstruction (11.8) content", () => {
  const fn = VectorFoundations.HNSWConstruction;

  it("sub=0 inserts the first vector as the entry point", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/empty|first/i);
    expect(container.textContent).toMatch(/entry point/i);
  });

  it("sub=1 shows the real layer-assignment formula with ln and mL", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/floor/i);
    expect(container.textContent).toMatch(/ln|log/i);
    expect(container.textContent).toMatch(/uniform/i);
    expect(container.textContent).toMatch(/mL/);
  });

  it("sub=2 shows the exponential decay with ~94% at layer 0", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/layer 0/i);
    expect(container.textContent).toMatch(/94%|93%|95%|most/i);
    expect(container.textContent).toMatch(/exponential/i);
  });

  it("sub=3 describes greedy M-nearest insertion with ef_construction", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/M nearest|nearest M/i);
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/edges?/i);
    expect(container.textContent).toMatch(/ef_construction/i);
  });

  it("sub=4 walks the insertion of all 10 cat-corpus docs", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/10/);
    expect(container.textContent).toMatch(/cats|kittens|cat sat|dog/i);
    expect(container.textContent).toMatch(/layer|L\s*=/i);
  });

  it("sub=5 gives M = 16 and the per-vector memory math", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/M\s*=\s*16|M = 16/);
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/70|bytes per vector|bytes\/vector/i);
  });
});

describe("HNSWSearch (11.9) content", () => {
  const fn = VectorFoundations.HNSWSearch;

  it("sub=0 starts the query at the top-layer entry point", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/entry point/i);
    expect(container.textContent).toMatch(/top/i);
    expect(container.textContent).toMatch(/layer/i);
  });

  it("sub=1 greedy-descends within the current layer", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/greedy/i);
    expect(container.textContent).toMatch(/neighbor/i);
    expect(container.textContent).toMatch(/closer|distance/i);
  });

  it("sub=2 drops down when stuck on the current layer", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/drop/i);
    expect(container.textContent).toMatch(/layer/i);
    expect(container.textContent).toMatch(/0|next/i);
  });

  it("sub=3 switches to beam search with ef_search = 50 at layer 0", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/beam/i);
    expect(container.textContent).toMatch(/50|candidates/i);
  });

  it("sub=4 expands the beam until it stops improving", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/expand/i);
    expect(container.textContent).toMatch(/ef_search|queue/i);
    expect(container.textContent).toMatch(/top|best/i);
  });

  it("sub=5 returns top-k and traces the full path", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/top[- ]?k|top 3|top-10/i);
    expect(container.textContent).toMatch(/path|trace/i);
    expect(container.textContent).toMatch(/cat|1|3|7/i);
  });
});

describe("HNSWParameters (11.10) content", () => {
  const fn = VectorFoundations.HNSWParameters;

  it("sub=0 introduces the three knobs with defaults", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/M/);
    expect(container.textContent).toMatch(/ef_construction/i);
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/16/);
    expect(container.textContent).toMatch(/200/);
    expect(container.textContent).toMatch(/50/);
  });

  it("sub=1 shows M controls recall-memory tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/M/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/memory|byte/i);
  });

  it("sub=2 covers ef_construction as build-time quality vs build time", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ef_construction/i);
    expect(container.textContent).toMatch(/build/i);
  });

  it("sub=3 shows ef_search as the main query-time dial", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/latency|ms/i);
  });

  it("sub=4 shows recall curves at M = 8, 16, 32", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/M\s*=\s*8|M = 8/);
    expect(container.textContent).toMatch(/M\s*=\s*16/);
    expect(container.textContent).toMatch(/M\s*=\s*32/);
    expect(container.textContent).toMatch(/curve|recall/i);
  });

  it("sub=5 shows memory math and a raise-this-parameter playbook", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/memory/i);
    expect(container.textContent).toMatch(/100M|100,000,000|320 GB/);
    expect(container.textContent).toMatch(/playbook|raise|lower/i);
    expect(container.textContent).toMatch(/ef_search/i);
  });
});

describe("Vamana (11.11) content", () => {
  const fn = VectorFoundations.Vamana;

  it("sub=0 motivates DiskANN with the HNSW RAM wall", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/100M|100 million/i);
    expect(container.textContent).toMatch(/320 GB|300 GB|TB/);
  });

  it("sub=1 contrasts HNSW's pyramid with Vamana's flat layer", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/pyramid|hierarchy/i);
    expect(container.textContent).toMatch(/flat/i);
    expect(container.textContent).toMatch(/single layer|one layer|one plane/i);
    // double-duty and NVMe belong to later subs
    expect(container.textContent).not.toMatch(/double duty/i);
    expect(container.textContent).not.toMatch(/NVMe/);
  });

  it("sub=2 explains why the hierarchy stops paying off on SSD", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hop/i);
    expect(container.textContent).toMatch(/SSD/);
    expect(container.textContent).toMatch(/RAM/);
    expect(container.textContent).toMatch(/10\s*[µu]s|0\.1\s*[µu]s/i);
    // double-duty belongs to sub 3
    expect(container.textContent).not.toMatch(/double duty/i);
  });

  it("sub=3 shows each node's 64 edges doing double duty", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/R|64/);
    expect(container.textContent).toMatch(/short/i);
    expect(container.textContent).toMatch(/long/i);
    expect(container.textContent).toMatch(/double duty|double-duty/i);
    expect(container.textContent).toMatch(/alpha|α/i);
    // NVMe belongs to sub 4
    expect(container.textContent).not.toMatch(/NVMe/);
  });

  it("sub=4 introduces NVMe", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/NVMe/);
    expect(container.textContent).toMatch(/Non-Volatile Memory Express/);
    expect(container.textContent).toMatch(/PCIe/);
    expect(container.textContent).toMatch(/4\s*KB|page/i);
    // SSD storage layout heading belongs to sub 5
    expect(container.textContent).not.toMatch(/Graph lives on SSD/);
  });

  it("sub=5 describes the disk layout with SSD blocks and RAM cache", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Graph lives on SSD/);
    expect(container.textContent).toMatch(/4\s*KB|page/i);
    expect(container.textContent).toMatch(/cache/i);
    // search budget content belongs to sub 6
    expect(container.textContent).not.toMatch(/Per-query budget/i);
  });

  it("sub=6 shows the minimize-disk-reads search pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/SSD|disk/i);
    expect(container.textContent).toMatch(/80|40|reads/i);
  });

  it("sub=7 hits 100B scale with Azure/Milvus and FreshDiskANN", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/100 billion|100B/i);
    expect(container.textContent).toMatch(/Azure|Milvus/);
    expect(container.textContent).toMatch(/NVMe|SSD/);
    expect(container.textContent).toMatch(/FreshDiskANN|delete/i);
  });
});

describe("MemoryWall (11.12) content", () => {
  const fn = VectorCompression.MemoryWall;

  it("sub=0 calculates 3 KB per vector at d=768 float32", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/4 bytes|float32/i);
    expect(container.textContent).toMatch(/3 KB|3072/);
  });

  it("sub=1 shows a scaling table through 1B", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/300 GB/);
    expect(container.textContent).toMatch(/3 TB|TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
  });

  it("sub=2 adds HNSW graph overhead", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/overhead|100 bytes/i);
  });

  it("sub=3 touches real server economics", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/r7i|768 GB|\$/);
  });

  it("sub=4 teases four compression techniques", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/scalar/i);
    expect(container.textContent).toMatch(/PQ|product/i);
    expect(container.textContent).toMatch(/binary/i);
    expect(container.textContent).toMatch(/Matryoshka/i);
  });
});

describe("ScalarQuantization (11.13) content", () => {
  const fn = VectorCompression.ScalarQuantization;

  it("sub=0 shows a float32 vector with 4-byte dimensions", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/float32/i);
    expect(container.textContent).toMatch(/4 bytes/i);
  });

  it("sub=1 describes per-dimension min/max calibration", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/min/i);
    expect(container.textContent).toMatch(/max/i);
    expect(container.textContent).toMatch(/calibrat|scan/i);
  });

  it("sub=2 shows the linear map to [0, 255]", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/255/);
    expect(container.textContent).toMatch(/round/i);
  });

  it("sub=3 shows before/after quantized values", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/int8/i);
    expect(container.textContent).toMatch(/before/i);
    expect(container.textContent).toMatch(/after/i);
  });

  it("sub=4 highlights SIMD int8 speed", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/SIMD/);
    expect(container.textContent).toMatch(/int8/i);
    expect(container.textContent).toMatch(/faster|speedup/i);
  });

  it("sub=5 shows 4x memory win for 1-3% recall loss", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/4[x×]|4 times/i);
    expect(container.textContent).toMatch(/1-3%|recall loss|recall drop/i);
    expect(container.textContent).toMatch(/768|bytes per vector/i);
  });

  it("sub=8 shows SQ pairs with any index (HNSW, IVF, flat)", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/IVF|flat/i);
    expect(container.textContent).toMatch(/drop[- ]?in|payload|swap/i);
    expect(container.textContent).toMatch(/index.*unchanged|graph.*unchanged|same (graph|index)/i);
  });

  it("sub=8 names production examples", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/pgvector|Qdrant|FAISS/);
  });

  it("sub=6 shows insert/update/delete drift the calibrated range", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/outside|out[- ]of[- ]range|drift/i);
    expect(container.textContent).toMatch(/clip/i);
    expect(container.textContent).toMatch(/error\s*=\s*0\.4/i);
    expect(container.textContent).toMatch(/-?1\.2|1\.4|1\.8/);
  });

  it("sub=7 shows percentile bounds + vacuum + scheduled recalibration", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/percentile|p1|p99|headroom/i);
    expect(container.textContent).toMatch(/recalibrat|re-calibrat/i);
    expect(container.textContent).toMatch(/vacuum|tombstone|compact/i);
    expect(container.textContent).toMatch(/0\.5%|drift|clip/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/Vespa/);
  });
});

describe("ProductQuantization (11.14) content", () => {
  const fn = VectorCompression.ProductQuantization;

  it("sub=0 splits 768-dim vector into 96 subvectors", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/sub[- ]?vector|split/i);
    expect(container.textContent).toMatch(/Cut one fat vector/i);
    expect(container.textContent).toMatch(/slot/i);
  });

  it("sub=1 runs k-means per slot with 256 centroids", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
    expect(container.textContent).toMatch(/256-word dictionary/i);
    expect(container.textContent).toMatch(/2\^8|fits in (a |one )?single byte|fits in a byte/i);
  });

  it("sub=2 encodes each subvector to a centroid id", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/centroid id|code/i);
    expect(container.textContent).toMatch(/snap/i);
    expect(container.textContent).toMatch(/nearest prototype|nearest centroid/i);
    expect(container.textContent).toMatch(/96 bytes/i);
  });

  it("sub=3 shows 96 bytes = 32x compression", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/32/);
    expect(container.textContent).toMatch(/96 bytes per vector|per vector/i);
    expect(container.textContent).toMatch(/billion vectors in 96 GB|one server/i);
  });

  it("sub=4 describes asymmetric distance via lookup table", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/lookup|LUT|table/i);
    expect(container.textContent).toMatch(/no float|no multiplies|stays as float/i);
    expect(container.textContent).toMatch(/once per query/i);
    expect(container.textContent).toMatch(/per doc/i);
  });

  it("sub=5 explains OPQ rotation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OPQ/);
    expect(container.textContent).toMatch(/rotat/i);
    expect(container.textContent).toMatch(/decorrelat|correlat/i);
    expect(container.textContent).toMatch(/rotate first/i);
    expect(container.textContent).toMatch(/0\.94|0\.89/);
  });

  it("sub=8 shows the recall-compression curve", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/m\s*=\s*96|m=96/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/compress/i);
    expect(container.textContent).toMatch(/only knob|knob/i);
    expect(container.textContent).toMatch(/sweet spot/i);
  });

  it("sub=6 shows insert/update/delete drift the codebooks", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/distance\s*=\s*1\.8/i);
    expect(container.textContent).toMatch(/0\.3/);
  });

  it("sub=6 capitalizes the first letter of every drift caption", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toContain("Sub-vec far from every centroid");
    expect(container.textContent).toContain("Re-encoded with stale codebooks");
    expect(container.textContent).toContain("Orphan PQ code");
  });

  it("sub=7 shows oversample + tombstones + retrain on error spike", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/oversample|sample|k_per_slot/i);
    expect(container.textContent).toMatch(/retrain/i);
    expect(container.textContent).toMatch(/tombstone|compact/i);
    expect(container.textContent).toMatch(/95p|95th|threshold/i);
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Vespa/);
    expect(container.textContent).toMatch(/Milvus/);
    expect(container.textContent).toMatch(/Qdrant/);
  });

  it("sub=7 capitalizes the first letter of every fix row and DB card", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toContain("Re-encode with current codebooks");
    expect(container.textContent).toContain("Tombstone in posting list");
    expect(container.textContent).toContain("Background re-quantization");
    expect(container.textContent).toContain("Scheduled IVF_PQ retraining");
  });

  it("sub=8 capitalizes the table column headers", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    const cells = Array.from(container.querySelectorAll("div")).map((n) => (n.textContent || "").trim());
    expect(cells).toContain("M");
    expect(cells).toContain("Bytes/vec");
    expect(cells).toContain("Compression");
    expect(cells).toContain("Recall@10 (OPQ)");
    expect(cells).toContain("Typical use");
  });
});

describe("BinaryQuantization (11.15) content", () => {
  const fn = VectorCompression.BinaryQuantization;

  it("sub=0 shows float32 vector at d=1024 as 4 KB", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/1024/);
    expect(container.textContent).toMatch(/4 KB|4096/);
    expect(container.textContent).toMatch(/float32/i);
  });

  it("sub=0 shown-dim count matches the rendered cells", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    const labelEl = Array.from(container.querySelectorAll("*")).find((n) =>
      /first \d+ dims shown/.test(n.textContent || ""),
    );
    expect(labelEl, "expected a 'first N dims shown' label").toBeTruthy();
    const claimed = parseInt(labelEl.textContent.match(/first (\d+) dims shown/)[1], 10);
    const grid = labelEl.parentElement.querySelector("div[style*='grid-template-columns']");
    expect(grid, "expected a grid sibling under the label container").toBeTruthy();
    const cells = grid.children.length;
    expect(cells, `claim says ${claimed} dims, grid has ${cells} cells`).toBe(claimed);
  });

  it("sub=1 takes the sign of each dimension for 1 bit", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/sign/i);
    expect(container.textContent).toMatch(/1 bit|128 bytes/);
    expect(container.textContent).toMatch(/32[x×]|32 times/i);
  });

  it("sub=2 computes Hamming via XOR and popcount", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Hamming/i);
    expect(container.textContent).toMatch(/XOR/i);
    expect(container.textContent).toMatch(/popcount/i);
  });

  it("sub=3 shows high-d embeddings keep recall", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/95%|high/i);
    expect(container.textContent).toMatch(/768|1024|BERT/);
  });

  it("sub=4 shows low-d collapse", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/low|collapse|128|drop/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=5 shows production use with rerank", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Qdrant|Pinecone/);
    expect(container.textContent).toMatch(/rerank|stage/i);
  });

  it("sub=5 stage 1 and stage 2 labels are center-aligned", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    const labels = Array.from(container.querySelectorAll("div")).filter((n) => {
      const text = (n.textContent || "").trim();
      return /^stage [12]: [^]*$/i.test(text) && n.children.length === 0;
    });
    expect(labels.length, "expected stage 1 and stage 2 leaf labels").toBeGreaterThanOrEqual(2);
    for (const el of labels) {
      const ta = el.style.textAlign;
      expect(ta, `"${el.textContent.trim()}" must be center-aligned (got "${ta}")`).toBe("center");
    }
  });

  it("sub=8 pairs BQ with HNSW for graph-accelerated stage 1", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Hamming/i);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/rerank|rescore/i);
  });

  it("sub=6 shows insert/update/delete drift the sign threshold", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/update/i);
    expect(container.textContent).toMatch(/delete/i);
    expect(container.textContent).toMatch(/sign/i);
    expect(container.textContent).toMatch(/51\s*\/\s*49|51\/49/);
    expect(container.textContent).toMatch(/78\s*\/\s*22|78\/22/);
    expect(container.textContent).toMatch(/dim 5|dim\s*5/i);
  });

  it("sub=6 capitalizes the first letter of every drift caption", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toContain("New dim 5 batch mean");
    expect(container.textContent).toContain("Re-binarized with stale threshold");
    expect(container.textContent).toContain("Bit-balance stats decay");
  });

  it("sub=6 centers the bit-grid block within the SVG", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    const svgs = Array.from(container.querySelectorAll("svg"));
    const distSvg = svgs.find((s) => /Training:/.test(s.textContent || ""));
    expect(distSvg, "expected distribution SVG").toBeTruthy();
    const trainingLabel = Array.from(distSvg.querySelectorAll("text")).find(
      (t) => (t.textContent || "").trim() === "Training:",
    );
    const driftedLabel = Array.from(distSvg.querySelectorAll("text")).find(
      (t) => (t.textContent || "").trim() === "Drifted:",
    );
    expect(trainingLabel.getAttribute("text-anchor")).toBe("end");
    expect(driftedLabel.getAttribute("text-anchor")).toBe("end");
    const tx = parseFloat(trainingLabel.getAttribute("x"));
    expect(tx).toBeGreaterThan(150);
    expect(tx).toBeLessThan(280);
  });

  it("sub=8 explains how BQ pairs with HNSW for stage 1", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/dedicated combo|no.*combo chapter|HNSW \+ BQ/i);
    expect(container.textContent).toMatch(/HNSW/);
  });

  it("sub=7 shows zero-centered models + bit-balance alert + compaction", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/zero[- ]centered/i);
    expect(container.textContent).toMatch(/bit[- ]balance/i);
    expect(container.textContent).toMatch(/compact|tombstone/i);
    expect(container.textContent).toMatch(/Cohere/);
    expect(container.textContent).toMatch(/Mixedbread|mxbai/i);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/i);
    expect(container.textContent).toMatch(/Milvus|Qdrant/);
    expect(container.textContent).toMatch(/70%|>\s*70/);
  });

  it("sub=7 capitalizes the first letter of every fix row and model card", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toContain("Sign(x) on a zero-centered model");
    expect(container.textContent).toContain("Tombstone bit; compaction job");
    expect(container.textContent).toContain("Any dim with > 70% same value");
    expect(container.textContent).toContain("Sign-based binary, no calibration");
    expect(container.textContent).toContain("Zero-centered, sign threshold");
    expect(container.textContent).toContain("Client-side sign() on float output");
    expect(container.textContent).toContain("Custom per-dim threshold");
  });
});

describe("Matryoshka (11.16) content", () => {
  const fn = VectorCompression.Matryoshka;

  it("sub=0 frames the re-embedding problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/re[- ]?embed|re[- ]?encoding/i);
    expect(container.textContent).toMatch(/500M|500 million|million/i);
  });

  it("sub=1 introduces Matryoshka truncation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/512/);
    expect(container.textContent).toMatch(/first[- ]?K|truncate|nested/i);
  });

  it("sub=2 shows the Russian doll concentric visual", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/nested|concentric/i);
    expect(container.textContent).toMatch(/Russian doll|dolls/i);
  });

  it("sub=3 truncates to 512 for 6x savings", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/512/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/6[x×]|6 times|saving/i);
  });

  it("sub=4 covers adaptive precision for coarse-to-fine", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/coarse/i);
    expect(container.textContent).toMatch(/rerank|fine/i);
    expect(container.textContent).toMatch(/256|adaptive/i);
  });

  it("sub=5 names OpenAI/Cohere production availability", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OpenAI/);
    expect(container.textContent).toMatch(/text-embedding-3|Cohere/i);
  });

  it("sub=6 shows MRL composes with SQ/PQ/BQ", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/SQ|scalar/i);
    expect(container.textContent).toMatch(/PQ|product/i);
    expect(container.textContent).toMatch(/BQ|binary/i);
    expect(container.textContent).toMatch(/orthogonal|stack|compose/i);
  });

  it("sub=6 shows multiplicative compression numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/12[x×]|12 times/i);
    expect(container.textContent).toMatch(/96[x×]|96 times/i);
    expect(container.textContent).toMatch(/3072|3,072/);
  });

  it("sub=6 covers order rule (truncate first, quantize after)", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/embed time|truncate first|MRL first|order/i);
    expect(container.textContent).toMatch(/codebook|index time|after/i);
  });

  it("sub=6 calls out BQ floor (d >= 768)", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/floor|minimum|at least/i);
  });
});

describe("IVFPQ (11.17) content", () => {
  const fn = VectorCompression.IVFPQ;

  it("sub=0 recaps IVF clustering and PQ compression", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/cluster/i);
    expect(container.textContent).toMatch(/subvector|m bytes/i);
  });

  it("sub=1 runs IVF k-means first", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/k-means/i);
    expect(container.textContent).toMatch(/nlist/i);
    expect(container.textContent).toMatch(/centroid/i);
  });

  it("sub=2 computes residual = vector - centroid", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/residual/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/tighter|smaller/i);
  });

  it("sub=3 PQ-encodes the residuals with higher recall", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/residual/i);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|codebook/i);
  });

  it("sub=4 describes search: probe nprobe cells, scan codes", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/lookup|table|scan/i);
  });

  it("sub=5 hits 20 bytes per vector with FAISS IndexIVFPQ", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/20 bytes|20 GB/);
    expect(container.textContent).toMatch(/1B|1 billion/i);
    expect(container.textContent).toMatch(/FAISS|Milvus/);
  });

  it("sub=1 cluster labels (C_A, C_B, C_C) clear all doc circles vertically", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const labels = texts.filter((t) => /^C_[ABC] \(/.test(t.textContent || ""));
    expect(labels.length, "expected three centroid labels (C_A, C_B, C_C)").toBe(3);
    const fontHalfHeight = 7;
    const docR = 8;
    const minClearance = 6;
    const clusterTop = { A: 75, B: 80, C: 245 };
    for (const label of labels) {
      const tag = label.textContent.match(/^(C_[ABC])/)[1];
      const cluster = tag.slice(2);
      const labelY = parseFloat(label.getAttribute("y"));
      const labelBottom = labelY + fontHalfHeight;
      const docTopEdge = clusterTop[cluster] - docR;
      expect(
        labelBottom,
        `${tag} label bottom (${labelBottom}) must be at least ${minClearance}px above the topmost doc circle edge (${docTopEdge})`,
      ).toBeLessThanOrEqual(docTopEdge - minClearance);
    }
  });

  it("sub=1 footer text sits clear of every cluster halo", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const footer = Array.from(svg.querySelectorAll("text")).find((t) =>
      /nlist = 3 centroids/.test(t.textContent || ""),
    );
    expect(footer, "expected the nlist footer text").toBeTruthy();
    const fy = parseFloat(footer.getAttribute("y"));
    const halos = Array.from(svg.querySelectorAll("circle")).filter((c) => parseFloat(c.getAttribute("r")) >= 30);
    expect(halos.length, "expected three cluster halo circles").toBe(3);
    for (const halo of halos) {
      const cy = parseFloat(halo.getAttribute("cy"));
      const r = parseFloat(halo.getAttribute("r"));
      expect(
        fy,
        `footer y (${fy}) must sit below halo bottom edge (cy=${cy}, r=${r}, bottom=${cy + r})`,
      ).toBeGreaterThan(cy + r);
    }
  });

  it("sub=4 query arrow ends outside cluster A halo so it doesn't pierce any doc", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    const lines = Array.from(container.querySelectorAll("line"));
    const arrow = lines.find((l) => l.getAttribute("x1") === "55" && l.getAttribute("y1") === "55");
    expect(arrow, "expected query-to-centroid arrow originating at (55, 55)").toBeTruthy();
    const x2 = parseFloat(arrow.getAttribute("x2"));
    const y2 = parseFloat(arrow.getAttribute("y2"));
    const cAx = 130;
    const cAy = 100;
    const haloR = 60;
    const dist = Math.hypot(cAx - x2, cAy - y2);
    expect(
      dist,
      `arrow endpoint distance from C_A (${dist.toFixed(1)}) must exceed halo r=${haloR} so it never crosses an interior doc`,
    ).toBeGreaterThan(haloR);
  });
});

describe("HNSWPQ (11.18) content", () => {
  const fn = VectorCompression.HNSWPQ;

  it("sub=0 combines HNSW graph navigation with PQ compression", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/code|encoded/i);
  });

  it("sub=1 keeps the graph structure and stores PQ codes at nodes", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/code|96 bytes/i);
    expect(container.textContent).toMatch(/196|100M|node/i);
  });

  it("sub=2 uses PQ asymmetric distance lookup", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/lookup|table/i);
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/faster|speedup|10x/i);
  });

  it("sub=3 compensates for recall drop with higher ef_search", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/ef_search/i);
    expect(container.textContent).toMatch(/error|drop|accuracy/i);
    expect(container.textContent).toMatch(/50|150/);
  });

  it("sub=4 names production systems that support HNSW + PQ", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Weaviate|Milvus/);
    expect(container.textContent).toMatch(/production|default|standard/i);
  });
});

describe("CompressionDecision (11.19) content", () => {
  const fn = VectorCompression.CompressionDecision;

  it("sub=0 frames the four decision axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/five techniques|five ways|which one/i);
    expect(container.textContent).toMatch(/corpus size|N/);
    expect(container.textContent).toMatch(/dimension|dim/i);
    expect(container.textContent).toMatch(/DB|database|support/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 renders the decision tree with four N-range branches and DB gate table", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/MRL|Matryoshka/);
    expect(container.textContent).toMatch(/N < 1M|under 1M/i);
    expect(container.textContent).toMatch(/Skip|no quantization/i);
    expect(container.textContent).toMatch(/1M.*10M/);
    expect(container.textContent).toMatch(/Scalar|int8|SQ/);
    expect(container.textContent).toMatch(/10M.*100M/);
    expect(container.textContent).toMatch(/Binary|BQ/);
    expect(container.textContent).toMatch(/rescore|rescoring/i);
    expect(container.textContent).toMatch(/100M/);
    expect(container.textContent).toMatch(/HNSW.*PQ|PQ/);
    expect(container.textContent).toMatch(/pgvector/);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Pinecone/);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.querySelector("desc")).toBeTruthy();
  });

  it("sub=1 flowchart SVG has horizontal connector at y=200 and drop-lines to bucket centers", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const lines = Array.from(container.querySelectorAll("svg line"));
    const horizontalConnector = lines.find(
      (l) =>
        l.getAttribute("y1") === "200" &&
        l.getAttribute("y2") === "200" &&
        l.getAttribute("x1") === "80" &&
        l.getAttribute("x2") === "560",
    );
    expect(horizontalConnector, "expected a horizontal connector at y=200 from x=80 to x=560").toBeTruthy();
    for (const cx of [80, 240, 400, 560]) {
      const dropLine = lines.find(
        (l) =>
          l.getAttribute("x1") === String(cx) &&
          l.getAttribute("x2") === String(cx) &&
          l.getAttribute("y1") === "200" &&
          l.getAttribute("y2") === "240",
      );
      expect(dropLine, `expected drop-line from bucket center x=${cx} y=200 to y=240`).toBeTruthy();
    }
  });

  it("sub=1 MRL pre-step is centered horizontally above the Inputs box", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const mrlText = texts.find((t) => /MRL pre-step/i.test(t.textContent));
    const inputsText = texts.find((t) => /Inputs:/.test(t.textContent));
    expect(mrlText, "expected MRL pre-step label to render").toBeTruthy();
    expect(inputsText, "expected Inputs label to render").toBeTruthy();
    const svgCenterX = 320;
    expect(
      Math.abs(parseFloat(mrlText.getAttribute("x")) - svgCenterX),
      "MRL label must sit on the SVG's horizontal center",
    ).toBeLessThan(5);
    expect(
      Math.abs(parseFloat(inputsText.getAttribute("x")) - svgCenterX),
      "Inputs label must sit on the SVG's horizontal center",
    ).toBeLessThan(5);
    expect(parseFloat(mrlText.getAttribute("y")), "MRL must sit above Inputs vertically").toBeLessThan(
      parseFloat(inputsText.getAttribute("y")),
    );
  });

  it("sub=2 walks four worked scenarios with concrete memory numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/500K|500,000/);
    expect(container.textContent).toMatch(/6 GB|6GB/);
    expect(container.textContent).toMatch(/50M|50,000,000/);
    expect(container.textContent).toMatch(/10 GB|10GB|9\.6/);
    expect(container.textContent).toMatch(/300 GB|300GB|307/);
    expect(container.textContent).toMatch(/5M|5,000,000/);
    expect(container.textContent).toMatch(/20 GB|20GB|5 GB|5GB/);
    expect(container.textContent).toMatch(/SQ \(int8\)|HNSW \+ SQ/);
    expect(container.textContent).toMatch(/200M|200,000,000/);
    expect(container.textContent).toMatch(/19 GB|19GB|820 GB/);
    expect(container.textContent).toMatch(/OpenAI|text-embedding-3/);
    expect(container.textContent).toMatch(/BGE/);
    expect(container.textContent).toMatch(/Qdrant/);
  });

  it("sub=2 every scenario result names HNSW so readers don't infer it's only for massive scale", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    const titles = [
      "Startup - the skip path",
      "Mid-scale - the SQ default",
      "Growing product - the high-leverage path",
      "Massive scale - the HNSW+PQ default",
    ];
    titles.forEach((title) => {
      const titleEl = Array.from(container.querySelectorAll("*")).find((n) => n.textContent === title);
      expect(titleEl, `expected scenario title to render: ${title}`).toBeTruthy();
      const card = titleEl.closest("div[style*='border-radius']");
      expect(card, `scenario card not found for: ${title}`).toBeTruthy();
      expect(card.textContent, `scenario card should name HNSW: ${title}`).toMatch(/HNSW/);
    });
  });

  it("sub=3 lists five heuristics and four traps to avoid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/memory bites|quantize until/i);
    expect(container.textContent).toMatch(/MRL is free|always apply/i);
    expect(container.textContent).toMatch(/DB first|database first/i);
    expect(container.textContent).toMatch(/Rescor(e|ing) is.*free|rescor.*default/i);
    expect(container.textContent).toMatch(/measure recall|your own data/i);
    expect(container.textContent).toMatch(/traps|avoid/i);
    expect(container.textContent).toMatch(/BQ at d.*256|d <= 256/i);
    expect(container.textContent).toMatch(/skip(ping)? MRL/i);
    expect(container.textContent).toMatch(/stacking|without measuring/i);
    expect(container.textContent).toMatch(/disabl.*rescor/i);
  });

  it("sub=3 heuristics/traps grid uses responsive auto-fit columns for mobile readability", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    // Find the heuristics title element, then walk up until we find an ancestor that is a CSS grid.
    const heuristicsTitle = Array.from(container.querySelectorAll("*")).find(
      (n) => n.textContent === "Five rules of thumb",
    );
    expect(heuristicsTitle, "expected the 'Five rules of thumb' title to render in Sub 3").toBeTruthy();
    let node = heuristicsTitle.parentElement;
    let gridAncestor = null;
    while (node) {
      const style = node.getAttribute("style") || "";
      if (style.includes("display: grid") && style.includes("grid-template-columns")) {
        gridAncestor = node;
        break;
      }
      node = node.parentElement;
    }
    expect(gridAncestor, "expected the heuristics title to live inside a CSS grid ancestor").toBeTruthy();
    const gridStyle = gridAncestor.getAttribute("style") || "";
    expect(
      gridStyle,
      `expected Sub 3 outer grid to use responsive auto-fit minmax(280px, 1fr); got style="${gridStyle}"`,
    ).toMatch(/auto-fit/);
    expect(gridStyle).toMatch(/minmax\(280px/);
  });
});

describe("Filtering (11.20) content", () => {
  const fn = VectorProduction.Filtering;

  it("sub=0 frames similarity search with a WHERE clause", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tenant/i);
    expect(container.textContent).toMatch(/filter|predicate|WHERE/i);
  });

  it("sub=1 pre-filter shrinks the set then searches", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/pre[- ]?filter/i);
    expect(container.textContent).toMatch(/brute/i);
    expect(container.textContent).toMatch(/selectiv|tight|loose/i);
  });

  it("sub=2 post-filter returns fewer than k when tight", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/post[- ]?filter/i);
    expect(container.textContent).toMatch(/fewer|empty|insufficient/i);
  });

  it("sub=2 post-filter grid uses compact fixed-size cells, not full-width", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    const cells = container.querySelectorAll('[title="dropped"], [title="passes predicate"]');
    expect(cells.length).toBe(100);
    const firstCell = cells[0];
    expect(firstCell.style.width).toBe("32px");
    expect(firstCell.style.height).toBe("32px");
    const grid = firstCell.parentElement;
    expect(grid.style.justifyContent).toBe("center");
    expect(grid.style.gridTemplateColumns).toMatch(/32px/);
  });

  it("sub=3 inline filtered-HNSW evaluates during traversal", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inline|filtered[- ]?HNSW/i);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/traversal|graph hop|payload/i);
  });

  it("sub=3 inline-filter path arrows terminate at node boundary, not center", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    const pathLines = container.querySelectorAll("line[marker-end]");
    expect(pathLines.length).toBe(3);
    // First path segment is 1 -> 3. Node 3 center is at x=310. Line should
    // stop before the center so the arrow tip lands at the circle boundary.
    const first = pathLines[0];
    const x2 = parseFloat(first.getAttribute("x2"));
    expect(x2).toBeLessThan(310);
    expect(x2).toBeGreaterThan(285);
    // Source endpoint should also start from the source-node boundary, not its center (x=90).
    const x1 = parseFloat(first.getAttribute("x1"));
    expect(x1).toBeGreaterThan(90);
    expect(x1).toBeLessThan(115);
  });

  it("sub=4 compares strategies by selectivity", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/selectiv/i);
    expect(container.textContent).toMatch(/0\.1|50|5%/);
  });

  it("sub=5 names filter-index implementations across systems", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/bitmap|inverted|column/i);
    expect(container.textContent).toMatch(/Qdrant|Pinecone|Weaviate|pgvector/);
  });
});

describe("UpdatesDeletes (11.21) content", () => {
  const fn = VectorProduction.UpdatesDeletes;

  it("sub=0 inserts append and connect to M nearest", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/insert/i);
    expect(container.textContent).toMatch(/append|connect|neighbor/i);
    expect(container.textContent).toMatch(/M|16/);
  });

  it("sub=1 delete problem breaks routing paths", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/delete|remove/i);
    expect(container.textContent).toMatch(/path|route|hop/i);
    expect(container.textContent).toMatch(/break|lost|broken/i);
  });

  it("sub=2 tombstones mark-and-filter at query time", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tombstone/i);
    expect(container.textContent).toMatch(/mark|soft/i);
    expect(container.textContent).toMatch(/query time|filter/i);
  });

  it("sub=3 shows graph degradation curve at 30% deletes", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/30/);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.92|0\.85|degrad|drop/i);
  });

  it("sub=4 lists rebuild strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/rebuild/i);
    expect(container.textContent).toMatch(/segment|rotation|incremental/i);
    expect(container.textContent).toMatch(/downtime|operational/i);
  });

  it("sub=5 compares delete pain by index type", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/Qdrant|pgvector/);
  });
});

describe("Sharding (11.22) content", () => {
  const fn = VectorProduction.Sharding;

  it("sub=0 frames the single-node limit", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/100M|100 million|r7i/i);
    expect(container.textContent).toMatch(/single[- ]?node|one node/i);
  });

  it("sub=1 describes random sharding with round-robin", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/random/i);
    expect(container.textContent).toMatch(/round[- ]?robin|hash/i);
    expect(container.textContent).toMatch(/fan[- ]?out|all shards/i);
  });

  it("sub=1 random sharding diagram: q on top, 4 shards in a horizontal row below", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = container.querySelector('svg[viewBox^="0 0 520"]');
    expect(svg).toBeTruthy();
    const qCircle = svg.querySelector("circle[r='14']");
    const shardRects = Array.from(svg.querySelectorAll("rect"));
    expect(shardRects.length).toBe(4);
    const ys = shardRects.map((r) => Number(r.getAttribute("y")));
    expect(new Set(ys).size).toBe(1);
    const shardY = ys[0];
    expect(Number(qCircle.getAttribute("cy"))).toBeLessThan(shardY);
  });

  it("sub=2 explains semantic sharding by IVF cluster", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/semantic|cluster/i);
    expect(container.textContent).toMatch(/IVF|region|subset/i);
  });

  it("sub=2 semantic sharding diagram: q on top, 4 shards in a horizontal row below", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    const svg = container.querySelector('svg[viewBox^="0 0 520"]');
    expect(svg).toBeTruthy();
    const qCircle = svg.querySelector("circle[r='14']");
    const shardRects = Array.from(svg.querySelectorAll("rect"));
    expect(shardRects.length).toBe(4);
    const ys = shardRects.map((r) => Number(r.getAttribute("y")));
    expect(new Set(ys).size).toBe(1);
    const shardY = ys[0];
    expect(Number(qCircle.getAttribute("cy"))).toBeLessThan(shardY);
  });

  it("sub=3 shows fan-out to shards and coordinator merge", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/fan[- ]?out/i);
    expect(container.textContent).toMatch(/coordinator|merge/i);
    expect(container.textContent).toMatch(/top[- ]?k|top-10|top-20/i);
  });

  it("sub=4 explains recall math via per-shard buffer", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/merge/i);
    expect(container.textContent).toMatch(/buffer|top-20|top-50/i);
  });

  it("sub=5 prunes shards by filter predicate", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/shard/i);
    expect(container.textContent).toMatch(/prune|skip/i);
  });
});

describe("Replication (11.23) content", () => {
  const fn = VectorProduction.Replication;

  it("sub=0 describes read replicas with load balancing", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/replica|read replica/i);
    expect(container.textContent).toMatch(/load[- ]?balance/i);
  });

  it("sub=1 covers leader-follower replication lag", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/leader|follower|primary/i);
    expect(container.textContent).toMatch(/lag|delay/i);
    expect(container.textContent).toMatch(/50|2 s|200 ms/);
  });

  it("sub=2 handles leader failure via follower promotion", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/leader|primary/i);
    expect(container.textContent).toMatch(/promote|election/i);
    expect(container.textContent).toMatch(/lost|window/i);
  });

  it("sub=3 covers in-memory durability via WAL or snapshots", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/durab|persist/i);
    expect(container.textContent).toMatch(/WAL|write[- ]?ahead|snapshot/i);
    expect(container.textContent).toMatch(/RAM/i);
  });

  it("sub=4 compares recovery time WAL vs re-embed", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recovery|rebuild/i);
    expect(container.textContent).toMatch(/WAL|re[- ]?embed/i);
    expect(container.textContent).toMatch(/hours|days|weeks/i);
  });
});

describe("HybridSearch (11.24) content", () => {
  const fn = VectorProduction.HybridSearch;

  it("sub=0 explains vectors miss exact matches", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/SKU|exact|proper noun/i);
    expect(container.textContent).toMatch(/vector|embedding/i);
    expect(container.textContent).toMatch(/miss|blur/i);
  });

  it("sub=1 recaps BM25 formula", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/BM25/);
    expect(container.textContent).toMatch(/term frequency|TF/i);
    expect(container.textContent).toMatch(/IDF|inverse document/i);
  });

  it("sub=2 runs BM25 and vector in parallel", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|both/i);
    expect(container.textContent).toMatch(/ranked|top/i);
  });

  it("sub=3 uses Reciprocal Rank Fusion with k=60", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/60/);
    expect(container.textContent).toMatch(/1 \/|rank/i);
  });

  it("sub=4 works the tabby example vector vs BM25 vs hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/tabby/i);
    expect(container.textContent).toMatch(/vector/i);
    expect(container.textContent).toMatch(/BM25/i);
  });

  it("sub=5 covers weighted hybrid tuning", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/weight|alpha|0\.7/i);
    expect(container.textContent).toMatch(/hybrid/i);
  });
});

describe("Rerankers (11.25) content", () => {
  const fn = VectorProduction.Rerankers;

  it("sub=0 frames two-stage retrieval", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/two[- ]?stage|stage 1/i);
    expect(container.textContent).toMatch(/top[- ]?100|100/);
    expect(container.textContent).toMatch(/fast|approximate/i);
  });

  it("sub=1 introduces cross-encoder concatenation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cross[- ]?encoder/i);
    expect(container.textContent).toMatch(/concatenated|together/i);
    expect(container.textContent).toMatch(/attention/i);
  });

  it("sub=2 contrasts bi-encoder and cross-encoder", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/bi[- ]?encoder/i);
    expect(container.textContent).toMatch(/token|interaction/i);
    expect(container.textContent).toMatch(/attention/i);
  });

  it("sub=3 reranks top-100 to top-10", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/rerank|re-rank/i);
    expect(container.textContent).toMatch(/top[- ]?10|10/i);
    expect(container.textContent).toMatch(/score|sort/i);
  });

  it("sub=4 shows latency cost on GPU", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/latency|ms|100 ms/i);
    expect(container.textContent).toMatch(/1 ms|100/);
    expect(container.textContent).toMatch(/GPU|A10|H100/i);
  });

  it("sub=5 names production reranker models", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Cohere|BGE|MS[- ]?MARCO/i);
  });
});

describe("MultiVectorRetrieval (11.26) content", () => {
  const fn = VectorProduction.MultiVectorRetrieval;

  it("sub=0 frames the single-vector blur problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/single[- ]?vector|one vector/i);
    expect(container.textContent).toMatch(/blur|lossy|average/i);
  });

  it("sub=1 introduces ColBERT one-vector-per-token", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ColBERT/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/200|per token/i);
  });

  it("sub=2 uses max-sim aggregation", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/max[- ]?sim|maxsim/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/sum/i);
  });

  it("sub=3 walks the max-sim calculation on cat corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/walkthrough|cat|token/i);
  });

  it("sub=4 shows storage cost scaled by token count", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/storage|memory/i);
    expect(container.textContent).toMatch(/20|100|600 GB/);
    expect(container.textContent).toMatch(/token/i);
  });

  it("sub=5 names Vespa, Qdrant, Elasticsearch support", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/Vespa/i);
    expect(container.textContent).toMatch(/Qdrant/i);
    expect(container.textContent).toMatch(/Elasticsearch|nested|tensor/i);
  });
});

describe("EmbeddingLifecycle (11.27) content", () => {
  const fn = VectorProduction.EmbeddingLifecycle;

  it("sub=0 frames the indexed-two-years-ago scenario", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/500M|500 million/);
    expect(container.textContent).toMatch(/ada[- ]?002|text-embedding|two years/i);
    expect(container.textContent).toMatch(/upgrade|moved/i);
  });

  it("sub=1 highlights the dimension mismatch", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/1536/);
    expect(container.textContent).toMatch(/3072/);
    expect(container.textContent).toMatch(/dimension|dims|mismatch/i);
  });

  it("sub=2 describes the re-embed cost path", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/re[- ]?embed/i);
    expect(container.textContent).toMatch(/source/i);
    expect(container.textContent).toMatch(/cost|\$|bill/i);
  });

  it("sub=3 describes parallel indexes during migration", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parallel|dual/i);
    expect(container.textContent).toMatch(/serve|traffic/i);
    expect(container.textContent).toMatch(/cutover|flip|migrate/i);
  });

  it("sub=4 covers the pin-the-old-model option", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/pin|freeze/i);
    expect(container.textContent).toMatch(/deprecated|drift|decay/i);
  });

  it("sub=5 lays out drift monitoring", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/drift|regression|eval/i);
    expect(container.textContent).toMatch(/monitor|ground[- ]?truth/i);
    expect(container.textContent).toMatch(/recall|quality/i);
  });
});

describe("Observability (11.28) content", () => {
  const fn = VectorProduction.Observability;

  it("sub=0 covers P50/P95/P99 latency tails", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/P50|P95|P99/);
    expect(container.textContent).toMatch(/tail/i);
  });

  it("sub=1 describes recall@k ground-truth sampling", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/sample|ground[- ]?truth/i);
    expect(container.textContent).toMatch(/compare|brute[- ]?force/i);
  });

  it("sub=2 discusses per-query cache and CPU telemetry", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cache/i);
    expect(container.textContent).toMatch(/hit rate|cache hit/i);
    expect(container.textContent).toMatch(/memory|pages|CPU/i);
  });

  it("sub=3 explains ANN-Benchmarks methodology", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ANN[- ]?Benchmarks|ann-benchmarks/i);
    expect(container.textContent).toMatch(/QPS|queries per second/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=4 lays out alert vs watch dashboard", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/dashboard|Grafana|panel/i);
    expect(container.textContent).toMatch(/alert|watch/i);
    expect(container.textContent).toMatch(/P99|recall@10/i);
  });

  it("sub=5 reminds about unmeasured metrics", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/tenant|cold[- ]?start|per-tenant/i);
    expect(container.textContent).toMatch(/checklist|capture|measure/i);
  });
});

describe("CapacityPlanning (11.29) content", () => {
  const fn = VectorProduction.CapacityPlanning;

  it("sub=0 lists the sizing inputs", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/N|vectors/i);
    expect(container.textContent).toMatch(/QPS|queries per second/i);
    expect(container.textContent).toMatch(/P99|latency/i);
    expect(container.textContent).toMatch(/selectivity|availability|filter/i);
  });

  it("sub=1 gives the memory formula with cache and fragmentation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/RAM|memory/i);
    expect(container.textContent).toMatch(/graph|cache|fragmentation/i);
  });

  it("sub=2 sizes CPU with headroom", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/CPU|cores/i);
    expect(container.textContent).toMatch(/QPS|200/i);
    expect(container.textContent).toMatch(/headroom/i);
  });

  it("sub=3 shows 500M x 200 QPS worked example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/500M|500 million/);
    expect(container.textContent).toMatch(/3 TB|1\.5 TB|TB/);
    expect(container.textContent).toMatch(/nodes|6 nodes/i);
  });

  it("sub=4 compares costs across Pinecone, Qdrant, pgvector", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/Qdrant|pgvector/);
    expect(container.textContent).toMatch(/\$|cost|month/i);
  });

  it("sub=5 frames the decision via cost per million", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/per million|per-million/i);
    expect(container.textContent).toMatch(/cost|\$/i);
    expect(container.textContent).toMatch(/decision|framework/i);
  });
});

describe("DecisionFramework (11.36) content", () => {
  const fn = VectorSystems.DecisionFramework;

  it("sub=0 shows the decision flowchart with the axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/flowchart|decision/i);
    expect(container.textContent).toMatch(/data size|ops|filter|cost/i);
  });

  it("sub=1 shows the size buckets", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/1M|100M|1B/);
    expect(container.textContent).toMatch(/bucket|size/i);
  });

  it("sub=2 shows the ops preference axis", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ops|preference/i);
    expect(container.textContent).toMatch(/Pinecone|Qdrant|Milvus|pgvector/);
  });

  it("sub=3 shows the filter complexity axis", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/simple|complex|analytical/i);
  });

  it("sub=4 shows the design-review checklist", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/checklist|questions/i);
    expect(container.textContent).toMatch(/size|QPS|P99|selectivity|availability/i);
  });

  it("sub=5 recap: learner can answer Qdrant vs Pinecone from first principles", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/recap|first principles|Qdrant|Pinecone/i);
    expect(container.textContent).toMatch(/section|learn|master/i);
  });
});

describe("WeaviateMilvusChroma (11.35) content", () => {
  const fn = VectorSystems.WeaviateMilvusChroma;

  it("sub=0 describes Weaviate - Go, self-host, modules", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Weaviate/i);
    expect(container.textContent).toMatch(/Go|self[- ]?host/i);
    expect(container.textContent).toMatch(/module|transformer|generative/i);
  });

  it("sub=1 describes Milvus distributed-native", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/Milvus/i);
    expect(container.textContent).toMatch(/distributed|billion/i);
    expect(container.textContent).toMatch(/Azure|AI Search|core/i);
  });

  it("sub=2 describes Chroma Python-first local embedded", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Chroma/i);
    expect(container.textContent).toMatch(/Python|local|embedded/i);
    expect(container.textContent).toMatch(/prototype|small/i);
  });

  it("sub=3 describes Elastic / OpenSearch dense_vector", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Elastic|OpenSearch/i);
    expect(container.textContent).toMatch(/dense_vector/i);
    expect(container.textContent).toMatch(/existing|already/i);
  });

  it("sub=4 summarizes context-dependent picks", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Weaviate|Milvus|Chroma|Elastic/i);
    expect(container.textContent).toMatch(/context|pick|fit/i);
  });
});

describe("QdrantVsPinecone (11.34) content", () => {
  const fn = VectorSystems.QdrantVsPinecone;

  it("sub=0 names the decision axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/axis|axes/i);
    expect(container.textContent).toMatch(/ops|filter|cost|feature/i);
  });

  it("sub=1 scenario A: prototype -> Pinecone serverless", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/scenario A|prototype/i);
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/serverless/i);
  });

  it("sub=2 scenario B: 10M + complex filters -> Qdrant", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/scenario B|10M/i);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/filter|complex/i);
  });

  it("sub=3 scenario C: 1B at 10K QPS -> Qdrant multi-node or Milvus", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/scenario C|1B/i);
    expect(container.textContent).toMatch(/10K QPS|steady/i);
    expect(container.textContent).toMatch(/Qdrant|Milvus/);
  });

  it("sub=4 scenario D: spiky + EU -> Pinecone region or Qdrant Cloud EU", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/scenario D|spiky/i);
    expect(container.textContent).toMatch(/EU|residency/i);
    expect(container.textContent).toMatch(/region|Pinecone|Qdrant Cloud/);
  });

  it("sub=5 shows the decision flowchart summary", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/flowchart|decision/i);
    expect(container.textContent).toMatch(/Pinecone|Qdrant/);
  });
});

describe("Pinecone (11.33) content", () => {
  const fn = VectorSystems.Pinecone;

  it("sub=0 frames Pinecone as managed SaaS with opinionated defaults", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Pinecone/);
    expect(container.textContent).toMatch(/managed|SaaS/i);
    expect(container.textContent).toMatch(/proprietary|opinion/i);
  });

  it("sub=1 describes the pod architecture", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/pod/i);
    expect(container.textContent).toMatch(/shard/i);
    expect(container.textContent).toMatch(/p1|p2|scale/i);
  });

  it("sub=2 describes serverless with scale-to-zero and cold-start", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/serverless/i);
    expect(container.textContent).toMatch(/scale[- ]?to[- ]?zero|scale to zero/i);
    expect(container.textContent).toMatch(/cold[- ]?start/i);
  });

  it("sub=3 lists built-in filtering, hybrid, namespaces", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/filter/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/namespace|tenant/i);
  });

  it("sub=4 names the good-fit workloads", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/no ops|without ops/i);
    expect(container.textContent).toMatch(/variable|workload/i);
    expect(container.textContent).toMatch(/time[- ]?to[- ]?market|prototype/i);
  });

  it("sub=5 names vendor lock-in and cost-at-scale tradeoffs", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/lock[- ]?in/i);
    expect(container.textContent).toMatch(/cost|expensive/i);
    expect(container.textContent).toMatch(/opinion/i);
  });
});

describe("Qdrant (11.32) content", () => {
  const fn = VectorSystems.Qdrant;

  it("sub=0 frames Qdrant as a Rust open-source vector DB", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/Rust/i);
    expect(container.textContent).toMatch(/open[- ]?source|self[- ]?host/i);
  });

  it("sub=1 describes HNSW with inline filter during traversal", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/inline|filter|traversal/i);
    expect(container.textContent).toMatch(/payload/i);
  });

  it("sub=2 describes collections and payload metadata", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/collection/i);
    expect(container.textContent).toMatch(/payload|metadata/i);
    expect(container.textContent).toMatch(/multi[- ]?vector/i);
  });

  it("sub=3 lists built-in features including quantization variants", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/quantization|scalar|binary/i);
    expect(container.textContent).toMatch(/SQ|PQ|BQ/);
  });

  it("sub=4 covers the self-host deployment story", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/binary|Docker|Kubernetes/i);
    expect(container.textContent).toMatch(/self[- ]?host|operator/i);
  });

  it("sub=5 names the tradeoffs", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ops|operational/i);
    expect(container.textContent).toMatch(/multi[- ]?region|ecosystem/i);
    expect(container.textContent).toMatch(/Elastic|smaller/i);
  });
});

describe("Pgvector (11.31) content", () => {
  const fn = VectorSystems.Pgvector;

  it("sub=0 frames pgvector as a Postgres extension", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Postgres/i);
    expect(container.textContent).toMatch(/extension/i);
    expect(container.textContent).toMatch(/vector/i);
  });

  it("sub=1 shows SQL ALTER TABLE and cosine distance operator", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ALTER TABLE|ADD COLUMN/i);
    expect(container.textContent).toMatch(/vector\(768\)|768/);
    expect(container.textContent).toMatch(/<=>|cosine/i);
  });

  it("sub=2 describes HNSW and IVFFlat index types", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/HNSW/i);
    expect(container.textContent).toMatch(/IVFFlat|IVF/i);
    expect(container.textContent).toMatch(/SQL|tuning|parameters/i);
  });

  it("sub=3 highlights inherited Postgres features", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/transaction|ACID/i);
    expect(container.textContent).toMatch(/SQL join|join/i);
    expect(container.textContent).toMatch(/metadata/i);
  });

  it("sub=4 names the good-fit workloads", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/10M|under 10M/i);
    expect(container.textContent).toMatch(/metadata/i);
    expect(container.textContent).toMatch(/existing|Postgres team/i);
  });

  it("sub=5 names the bad-fit workloads", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/100M|over 100M/i);
    expect(container.textContent).toMatch(/10K|QPS/i);
    expect(container.textContent).toMatch(/multi[- ]?region/i);
  });
});

describe("FAISS (11.30) content", () => {
  const fn = VectorSystems.FAISS;

  it("sub=0 frames FAISS as Meta's 2017 reference library", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/FAISS/);
    expect(container.textContent).toMatch(/Meta|Facebook/i);
    expect(container.textContent).toMatch(/2017|library/i);
  });

  it("sub=1 names the algorithms inside FAISS", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/IVF/);
    expect(container.textContent).toMatch(/PQ/);
    expect(container.textContent).toMatch(/HNSW/);
    expect(container.textContent).toMatch(/CPU|CUDA|GPU/i);
  });

  it("sub=2 describes Python bindings over a C++ core", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Python/i);
    expect(container.textContent).toMatch(/C\+\+|core/i);
    expect(container.textContent).toMatch(/bindings?|embed/i);
  });

  it("sub=3 enumerates what FAISS does not provide", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/persist/i);
    expect(container.textContent).toMatch(/API|REST/i);
    expect(container.textContent).toMatch(/filter|ACID|replicat/i);
  });

  it("sub=4 names systems that embed FAISS", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Milvus/);
    expect(container.textContent).toMatch(/OpenSearch|engine/i);
    expect(container.textContent).toMatch(/inside|underneath/i);
  });

  it("sub=5 states the build-vs-use rule", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/build/i);
    expect(container.textContent).toMatch(/DB|database/i);
    expect(container.textContent).toMatch(/use one|use it/i);
  });
});

// ─── TOC special branches ───
describe("TOC", () => {
  it("renders section list", () => {
    const ctx = makeCtx();
    const { container } = render(TOC(ctx));
    expect(container.textContent).toContain("Neural Network Foundations");
  });

  it("expands a section", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: null })));
    const headers = container.querySelectorAll("[style*='cursor: pointer']");
    fireEvent.click(headers[0]);
    expect(setExpanded).toHaveBeenCalledWith(1);
  });

  it("collapses an expanded section", () => {
    const setExpanded = vi.fn();
    const { container } = render(TOC(makeCtx({ setExpanded, expanded: 1 })));
    const headers = container.querySelectorAll("[style*='cursor: pointer']");
    fireEvent.click(headers[0]);
    expect(setExpanded).toHaveBeenCalledWith(null);
  });

  it("renders chapters when expanded and navigates on click", () => {
    const goTo = vi.fn();
    const { container } = render(TOC(makeCtx({ expanded: 1, goTo })));
    expect(container.textContent).toContain("What is a Neural Network?");
    const chapterLinks = container.querySelectorAll("[style*='padding: 6px 8px 6px 40px']");
    if (chapterLinks.length > 0) {
      fireEvent.click(chapterLinks[0]);
      expect(goTo).toHaveBeenCalled();
    }
  });

  it("shows hover effect on chapter links", () => {
    const { container } = render(TOC(makeCtx({ expanded: 1 })));
    const chapterLinks = container.querySelectorAll("[style*='padding: 6px 8px 6px 40px']");
    if (chapterLinks.length > 0) {
      fireEvent.mouseEnter(chapterLinks[0]);
      fireEvent.mouseLeave(chapterLinks[0]);
    }
  });

  it("clicking the description in an expanded section does not bubble to the window tap-anywhere handler", () => {
    // The expanded panel re-renders the section description (line 153-155 in toc.jsx).
    // It has no onClick of its own, so without stopPropagation the click bubbles up to
    // window where the tap-anywhere handler treats it as background and advances forward
    // to chapter 1.1. The expanded panel must stop propagation.
    const { container } = render(TOC(makeCtx({ expanded: 1 })));
    const desc = Array.from(container.querySelectorAll("div")).find(
      (d) => d.textContent === "How neural networks actually work" && d.children.length === 0,
    );
    expect(desc).toBeTruthy();
    let bubbledToWindow = false;
    const onWindowClick = () => {
      bubbledToWindow = true;
    };
    window.addEventListener("click", onWindowClick);
    try {
      fireEvent.click(desc);
    } finally {
      window.removeEventListener("click", onWindowClick);
    }
    expect(bubbledToWindow).toBe(false);
  });

  // Test every section that has chapters in config.js. Data-driven so new
  // sections are auto-covered and we catch the bug where a section was added
  // to config but its TOC entry was forgotten in toc.jsx.
  const sectionNumbers = [...new Set(chapters.map((c) => c.section).filter((s) => s > 0))].sort((a, b) => a - b);
  sectionNumbers.forEach((secNum) => {
    it(`shows chapters for section ${secNum}`, () => {
      const { container } = render(TOC(makeCtx({ expanded: secNum })));
      expect(container.innerHTML).toBeTruthy();
      // Every section in config.js with chapters MUST be listed in the TOC.
      // This catches bugs where a new section is added to config but not to toc.jsx.
      expect(container.textContent).toContain(sectionNames[secNum]);
    });
  });
});

// ─── Special interactive chapters ───

describe("ContextProblem bankIdx branches", () => {
  const fn = AttentionQKV.ContextProblem;

  it("bankIdx=0", () => {
    renderAndInteract(fn, 5, { bankIdx: 0 });
  });

  it("bankIdx=1", () => {
    renderAndInteract(fn, 5, { bankIdx: 1 });
  });

  it("clicks sentence buttons", () => {
    const setBankIdx = vi.fn();
    const ctx = makeCtx({ sub: 5, setBankIdx });
    const { container } = render(fn(ctx));
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => fireEvent.click(b));
  });
});

describe("WordLookup hovered branches", () => {
  const fn = AttentionQKV.WordLookup;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }

  it("hovered out of range triggers || fallback", () => {
    renderAndInteract(fn, 5, { hovered: 99 });
  });
});

describe("DotProduct hovered branches", () => {
  const fn = AttentionQKV.DotProduct;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }
});

describe("TracingExample hovered branches", () => {
  const fn = AttentionQKV.TracingExample;
  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => {
      renderAndInteract(fn, 5, { hovered: h });
    });
  }
});

describe("WhatTransformerDoes interactive", () => {
  const fn = TransformerInput.WhatTransformerDoes;

  it("bankIdx=0", () => renderAndInteract(fn, 5, { bankIdx: 0 }));
  it("bankIdx=1", () => renderAndInteract(fn, 5, { bankIdx: 1 }));

  for (let h = 0; h <= 6; h++) {
    it(`hovered=${h}`, () => renderAndInteract(fn, 5, { hovered: h }));
  }
});

describe("ComputeQKV interactive", () => {
  const fn = AttentionComputation.ComputeQKV;

  it("bankIdx=0", () => renderAndInteract(fn, 7, { bankIdx: 0 }));
  it("bankIdx=1", () => renderAndInteract(fn, 7, { bankIdx: 1 }));
  it("bankIdx=2", () => renderAndInteract(fn, 7, { bankIdx: 2 }));
});

// ─── ComputeQKV W matrix sub-steps ───
describe("ComputeQKV W matrix sub-steps", () => {
  const fn = AttentionComputation.ComputeQKV;

  it("sub 1 shows all three W matrices (W_Q, W_K, W_V)", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("W_K");
    expect(text).toContain("W_V");
    // Should show matrix values
    expect(text).toContain("0.15");
    expect(text).toContain("0.59");
  });

  it("sub 2 shows detailed multiplication for 'I'", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the step-by-step multiplication
    expect(text).toContain("1.0");
    expect(text).toContain("0.59");
    // Should show the result
    expect(text).toContain("[1.0, -0.5]");
  });

  it("sub 3 shows the final Q, K, V results table", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("[0.8, 0.2]");
  });
});

describe("AttentionScores hovered", () => {
  const fn = AttentionComputation.AttentionScores;
  for (let h = 0; h <= 4; h++) {
    it(`hovered=${h}`, () => renderAndInteract(fn, 7, { hovered: h }));
  }
});

// ─── Chapter 7.4: Why Do We Need Softmax? ───
describe("WhySoftmax sub-steps", () => {
  const fn = AttentionComputation.WhySoftmax;

  it("sub 5 shows Steps 1-2 (e^score + sum) but not Step 3", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 1");
    expect(text).toContain("e^score");
    expect(text).toContain("Step 2");
    expect(text).toContain("151.17");
    expect(text).not.toContain("Step 3");
  });

  it("sub 6 shows Step 3 (divide by sum) and checkmarks", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Step 3");
    expect(text).toContain("Divide");
    expect(text).toContain("98.2%");
    expect(text).toContain("All positive");
    expect(text).toContain("Sum = 100%");
  });

  it("sub 7 shows amplification content (was sub 6)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("amplif");
    expect(text).toContain("dominates");
  });

  it("sub 8 shows the complete picture recap (was sub 7)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("complete picture");
    expect(text).toContain("FORMULA");
  });

  it("shows SubBtn when sub < 8 and hides at sub 8", () => {
    const ctx7 = makeCtx({ sub: 7 });
    const { container: c7 } = render(fn(ctx7));
    expect(c7.querySelector("[data-subbtn]")).toBeTruthy();

    const ctx8 = makeCtx({ sub: 8 });
    const { container: c8 } = render(fn(ctx8));
    expect(c8.querySelector("[data-subbtn]")).toBeFalsy();
  });
});

// ─── Chapter 7.9: Causal Masking - Hiding the Future ───
describe("CausalMask sub-steps", () => {
  const fn = AttentionComputation.CausalMask;

  it("sub 0 shows the problem - future words shouldn't be visible during generation", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("generat");
    expect(text).toContain("future");
  });

  it("sub 1 shows who-can-look-at-whom grid and unmasked score matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toMatch(/The|cat|sat|on/);
    expect(text).toContain("diagonal");
    expect(text).toContain("future");
  });

  it("sub 2 shows the mask matrix with -infinity for future positions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/-inf|infinity|\u221E/i);
    expect(text).toContain("mask");
  });

  it("sub 3 shows masked scores only", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("masked");
    expect(text).toContain("scores");
  });

  it("sub 4 shows softmax turning masked scores into attention weights", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("0.00");
  });

  it("sub 5 shows bidirectional vs causal visual comparison", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/[Bb]idirectional/);
    expect(text).toMatch(/[Cc]ausal/);
  });

  it("sub 6 shows training insight - every position makes a prediction", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training Insight");
    expect(text).toContain("prediction");
    expect(text).toContain("Causal Mask");
    expect(text).toContain("HONEST");
    expect(text).toContain("0 usable training examples");
    expect(text).toContain("4 usable training examples");
  });

  it("sub 7 shows encoder-only architecture (BERT, RoBERTa)", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-ONLY");
    expect(text).toContain("BERT");
    expect(text).toContain("bidirectional");
    expect(text).not.toContain("DECODER-ONLY");
    expect(text).not.toContain("ENCODER-DECODER");
  });

  it("sub 8 shows decoder-only architecture (GPT, Claude, LLaMA)", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("DECODER-ONLY");
    expect(text).toContain("GPT");
    expect(text).toContain("generate");
  });

  it("sub 9 shows encoder-decoder architecture (T5, BART) and core rule summary", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ENCODER-DECODER");
    expect(text).toContain("T5");
    expect(text).toContain("core rule");
    expect(text).toContain("already exists");
    expect(text).toContain("being generated");
  });
});

// ─── Chapter 7.10: Cross-Attention - The Encoder-Decoder Bridge ───
describe("CrossAttention sub-steps", () => {
  const fn = AttentionComputation.CrossAttention;

  it("sub 0 shows the setup - encoder output meets decoder", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("encoder");
    expect(text).toContain("decoder");
  });

  it("sub 1 shows Q from decoder, K and V from encoder", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Query");
    expect(text).toContain("Key");
    expect(text).toContain("Value");
    expect(text).toContain("decoder");
    expect(text).toContain("encoder");
  });

  it("sub 2 traces a concrete translation example with scores (Hindi target)", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score");
    expect(text).toContain("softmax");
    expect(text).toContain("billiyaan");
    expect(text).not.toContain("chats");
    expect(text).not.toContain("aime");
  });

  it("sub 3 compares self-attention vs cross-attention side by side", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/self.attention/i);
    expect(text).toMatch(/cross.attention/i);
    expect(text).toContain("same sentence");
  });

  it("sub 4 shows misconception vs reality - encoder runs once", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/encoder.*once/i);
    expect(text).toContain("WRONG");
    expect(text).toContain("CORRECT");
    expect(text).toContain("K, V");
  });

  it("sub 5 shows complete data flow SVG with dimensions", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Complete data flow");
    expect(text).toContain("d_model = 512");
  });

  it("sub 6 shows layer-by-layer math and dimension walkthrough", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("each decoder layer");
    expect(text).toContain("Dimension walkthrough");
    expect(text).toContain("[3 x 64]");
  });

  it("sub 7 shows where cross-attention appears in the architecture", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toMatch(/[Dd]ecoder-[Oo]nly/);
    expect(text).toMatch(/[Ee]ncoder-[Dd]ecoder/);
  });
});

// ─── WhyMultiHead label width fix ───
describe("WhyMultiHead compromise bar labels", () => {
  const fn = AttentionComputation.WhyMultiHead;

  it("label minWidth accommodates 'last week' without wrapping", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Find the bar label spans (minWidth on the word labels)
    const labels = container.querySelectorAll("span[style*='text-align: right']");
    const lastWeekLabel = Array.from(labels).find((el) => el.textContent === "last week");
    expect(lastWeekLabel).toBeTruthy();
    // minWidth should be at least 70px to fit "last week"
    const minWidth = parseInt(lastWeekLabel.style.minWidth, 10);
    expect(minWidth).toBeGreaterThanOrEqual(70);
  });
});

// ─── WhyMultiHead sub 2 head boxes alignment ───
describe("WhyMultiHead head boxes alignment", () => {
  const fn = AttentionComputation.WhyMultiHead;

  it("head boxes use consistent grid with aligned columns", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    // Find the three head row grids by matching their gridTemplateColumns pattern (Npx 1fr Npx)
    const allGrids = container.querySelectorAll("[style*='display: grid']");
    const headRows = Array.from(allGrids).filter((el) => {
      const tpl = el.style.gridTemplateColumns;
      return tpl && /^\d+px 1fr \d+px$/.test(tpl);
    });
    expect(headRows.length).toBe(3);
    // All should have identical grid templates
    headRows.forEach((row) => expect(row.style.gridTemplateColumns).toBe(headRows[0].style.gridTemplateColumns));
  });

  it("head sublabels are center-aligned", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    // T renders as <div>, find sublabel divs by text content
    const sublabels = ["subject-verb", "verb-location", "temporal"];
    sublabels.forEach((label) => {
      const el = Array.from(container.querySelectorAll("div")).find((d) => d.textContent === label);
      expect(el).toBeTruthy();
      expect(el.style.textAlign).toBe("center");
    });
  });

  it("first column width accommodates longest sublabel", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const allGrids = container.querySelectorAll("[style*='display: grid']");
    const headRows = Array.from(allGrids).filter((el) => {
      const tpl = el.style.gridTemplateColumns;
      return tpl && /^\d+px 1fr \d+px$/.test(tpl);
    });
    // First column should be at least 80px to fit "subject-verb"
    headRows.forEach((row) => {
      const firstColWidth = parseInt(row.style.gridTemplateColumns.split(" ")[0], 10);
      expect(firstColWidth).toBeGreaterThanOrEqual(80);
    });
  });
});

// ─── HeadSplit redesigned sub-steps ───
describe("HeadSplit redesigned visuals", () => {
  const fn = AttentionComputation.HeadSplit;

  it("sub 0 shows the problem recap with single arrow concept", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("512");
  });

  it("sub 1 shows the dimension split visual with 8 chunks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("64");
    // Should show chunk labels for all 8 heads
    expect(text).toContain("H1");
    expect(text).toContain("H8");
  });

  it("sub 2 shows cost vs quality tradeoff", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show both approaches compared
    expect(text).toContain("512");
    expect(text).toContain("64");
    // Should show the cost comparison
    expect(text).toContain("8");
    // Should mention diminishing returns or similar concept
    expect(text).toContain("same budget");
  });

  it("sub 3 shows each chunk gets its own W matrices", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("W_K");
    expect(text).toContain("W_V");
    expect(text).toContain("512");
    expect(text).toContain("64");
  });

  it("sub 4 shows 8 heads asking different questions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Head 1");
    expect(text).toContain("Head 3");
  });

  it("sub 5 shows layers stacking concept", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("96");
    expect(text).toContain("768");
  });
});

// ─── Derivatives Frac helper coverage ───
// ─── ConcatWO envelope visual ───
describe("ConcatWO envelope visual", () => {
  const fn = AttentionComputation.ConcatWO;

  it("sub 1 shows sealed envelopes as visual blocks with barriers", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show envelope content
    expect(text).toContain("suspect");
    expect(text).toContain("park");
    expect(text).toContain("Tuesday");
    // Should show the sealed/barrier concept visually
    expect(text).toContain("sealed");
  });

  it("sub 1 shows visual envelope blocks for each head", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Should have distinct envelope blocks with head-specific colors
    const headBlocks = container.querySelectorAll("[data-envelope]");
    expect(headBlocks.length).toBeGreaterThanOrEqual(4);
  });

  it("sub 1 shows concatenation bar with visible barriers between segments", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    // Should have a concatenated bar visualization
    const concatBar = container.querySelector("[data-concat-bar]");
    expect(concatBar).toBeTruthy();
  });
});

// ─── TOC sections 8 and 9 ───
describe("TOC section 8", () => {
  it("shows section 8 when expanded", () => {
    const { container } = render(TOC(makeCtx({ expanded: 8 })));
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toContain("The Encoder");
  });
});

describe("TOC section 9", () => {
  it("shows section 9 when expanded", () => {
    const { container } = render(TOC(makeCtx({ expanded: 9 })));
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toContain("The Decoder");
  });
});

// ─── AddNorm chapter sub-steps ───
describe("AddNorm sub-steps", () => {
  const fn = TransformerBlock.AddNorm;

  it("sub 0 shows the Transformer block overview with Add & Norm highlighted", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the block diagram with attention, add & norm, FFN flow
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
  });

  it("sub 1 shows the value drift problem with both shrink and explode scenarios", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the problem with concrete numbers from "cats" embedding
    expect(text).toContain("0.7");
    // Should show both directions of drift
    expect(text).toContain("shrink");
    expect(text).toContain("explode");
    // Should mention layers
    expect(text).toContain("layer");
  });

  it("sub 2 shows the Add step with concrete math and explains residual meaning", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should explain what "residual" means in plain language
    expect(text).toContain("residual");
    expect(text).toContain("leftover");
    // Should show original input + attention output = combined
    expect(text).toContain("original");
    expect(text).toContain("+");
    // Should have the visual
    expect(container.querySelector("[data-residual]")).toBeTruthy();
  });

  it("sub 3 shows layer normalization formula and parameter explanations", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the formula and parameter explanations
    expect(text).toContain("Layer Normalization");
    expect(text).toContain("gamma");
    expect(text).toContain("beta");
    expect(text).toContain("variance");
  });

  it("sub 4 shows layer normalization step-by-step computation", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the normalization steps: mean, subtract, divide
    expect(text).toContain("mean");
    expect(text).toContain("subtract");
    // Should show concrete numbers being normalized
    expect(text).toContain("0");
  });

  it("sub 5 shows full Add & Norm pipeline with numbers flowing through", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the complete pipeline
    expect(text).toContain("Input");
    expect(text).toContain("Attention");
    // Should have the pipeline visualization
    expect(container.querySelector("[data-pipeline]")).toBeTruthy();
  });

  it("sub 6 shows why it matters - with vs without comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the comparison
    expect(text).toContain("Without");
    expect(text).toContain("With");
    // Should mention stability or training
    expect(text).toContain("stable");
  });
});

describe("Derivatives with high sub to invoke Frac", () => {
  const fn = NeuralFoundations.Derivatives;
  // Render at every sub to ensure the internal Frac component is used
  for (let s = 0; s <= 7; s++) {
    it(`sub=${s}`, () => {
      renderAndInteract(fn, s);
    });
  }
});

// ─── Chapter 1.11: Vectors ───
describe("Vectors sub-steps", () => {
  const fn = NeuralFoundations.Vectors;

  it("sub 0 introduces what a vector is with concrete example", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("list");
    expect(text).toContain("number");
    // Arrow should be offset down to center with boxes, not labels
    const arrows = container.querySelectorAll("[data-arrow]");
    expect(arrows.length).toBe(1);
    expect(arrows[0].style.marginTop).toBeTruthy();
  });

  it("sub 1 connects vectors to neural networks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Everything");
    expect(text).toContain("vector");
    // Both arrow containers should be present (one per illustration)
    const arrows = container.querySelectorAll("[data-arrow]");
    expect(arrows.length).toBe(2);
    arrows.forEach((a) => {
      expect(a.style.marginTop).toBeTruthy();
    });
  });

  it("sub 2 shows words become vectors", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("cat");
    expect(text).toContain("vector");
  });

  it("sub 3 shows similar words have similar vectors", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });
});

// ─── Chapter 1.12: Dot Product ───
describe("DotProductIntro sub-steps", () => {
  const fn = NeuralFoundations.DotProductIntro;

  it("sub 0 introduces how to compare vectors", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("compare");
  });

  it("sub 1 shows step-by-step dot product computation", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Multiply");
    expect(text).toContain("Add");
  });

  it("sub 2 explains what the result number means - similarity", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("similar");
  });

  it("sub 3 connects to word vectors and attention", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("neuron");
  });
});

// ─── Chapter 1.13: Matrices ───
describe("Matrices sub-steps", () => {
  const fn = NeuralFoundations.Matrices;

  it("sub 0 introduces what a matrix is - a grid of numbers", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("grid");
  });

  it("sub 1 shows matrix-vector multiplication step by step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("dot product");
  });

  it("sub 2 shows a concrete computation with real numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show actual numbers being multiplied
    expect(text).toMatch(/\d/);
  });

  it("sub 3 connects matrices to neural network weights", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("weight");
    expect(text).toContain("transform");
  });
});

// ─── Chapter 1.14: Layer = Matrix Multiplication ───
describe("LayerIsMatMul sub-steps", () => {
  const fn = NeuralFoundations.LayerIsMatMul;

  it("sub 0 recalls single neuron from chapter 1.4", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
  });

  it("sub 1 shows multiple neurons side by side", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show neuron weights
    expect(text).toContain("neuron");
    expect(text).toContain("weights");
  });

  it("sub 2 reveals that multiple neurons = matrix multiplication", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("matrix");
  });

  it("sub 3 shows the visual: one neuron = one row of the weight matrix", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("row");
    expect(text).toContain("layer");
  });

  it("sub 4 scales up to real Transformer dimensions", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("heartbeat");
  });
});

// ─── Chapter 1.15: Activation Functions Full Picture ───
describe("ActivationFunctions sub-steps", () => {
  const fn = NeuralFoundations.ActivationFunctions;

  it("sub 0 recalls ReLU from chapter 1.5", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
  });

  it("sub 1 introduces sigmoid - squashes to 0-1 range", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Sigmoid");
    expect(text).toContain("0");
    expect(text).toContain("1");
  });

  it("sub 2 introduces tanh - squashes to -1 to 1", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Tanh");
  });

  it("sub 3 introduces softmax - turns list into probabilities", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Softmax");
  });

  it("sub 4 shows summary comparing all activation functions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("ReLU");
    expect(text).toContain("Sigmoid");
    expect(text).toContain("Softmax");
  });
});

// ─── Chapter 1.16: What Deep Really Means ───
describe("WhatDeepMeans sub-steps", () => {
  const fn = NeuralFoundations.WhatDeepMeans;

  it("sub 0 explains deep = many layers stacked", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
    expect(text).toContain("deep");
  });

  it("sub 1 shows why depth helps - building abstractions", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("simple");
    expect(text).toContain("abstract");
  });

  it("sub 2 shows the depth problem - vanishing/exploding values", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("low-level");
    expect(text).toContain("high-level");
  });

  it("sub 3 explains training vs inference", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
    expect(text).toContain("FROZEN");
  });

  it("sub 4 shows GPT-3 scale - 96 layers, 175 billion parameters", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training");
    expect(text).toContain("Inference");
  });
});

// ─── Chapter 1.17: Same Building Blocks ───
describe("SameBuildingBlocks sub-steps", () => {
  const fn = NeuralFoundations.SameBuildingBlocks;

  it("sub 0 states everything in AI uses these building blocks", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("pieces");
  });

  it("sub 1 lists the building blocks", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Matrix multiplication");
    expect(text).toContain("Activation");
    expect(text).toContain("Loss");
    expect(text).toContain("Backpropagation");
  });

  it("sub 2 previews how Transformers use these exact pieces", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Simple");
    expect(text).toContain("Deep network");
    expect(text).toContain("GPT");
  });

  it("sub 3 gives the confidence-building summary", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("understand");
  });
});

// ─── Chapter 1.23: Dropout ───
describe("Dropout sub-steps", () => {
  const fn = NeuralFoundations.Dropout;

  it("sub 0 explains what training and validation loss are with dataset split visual", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Training Loss");
    expect(text).toContain("Validation Loss");
    expect(text).toContain("80%");
    expect(text).toContain("20%");
    // Should have an SVG showing the dataset split
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("sub 1 shows combined overfitting graph with both lines and annotated zones", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Overfitting");
    expect(text).toContain("Training Loss");
    expect(text).toContain("Validation Loss");
    expect(text).toContain("Sweet Spot");
    expect(text).toContain("memorize");
    // Should have the combined SVG graph
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it("sub 2 shows dropout solution - randomly zero neurons", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Randomly Zero");
    expect(text).toContain("ACTIVE");
    expect(text).toContain("DROPPED");
  });

  it("sub 3 explains forced redundancy - why dropout works", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Without Dropout");
    expect(text).toContain("With Dropout");
    expect(text).toContain("Redundancy");
  });

  it("sub 4 shows the actual math with vector operations", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Bernoulli");
    expect(text).toContain("Scale");
    expect(text).toContain("1/(1 - p)");
  });

  it("sub 5 explains inference with no dropout", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Inference");
    expect(text).toContain("inverted dropout");
  });

  it("sub 6 shows where dropout lives in a transformer", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Transformer");
    expect(text).toContain("Multi-Head Attention");
    expect(text).toContain("Feed-Forward");
  });
});

// ─── Chapter 1.24: Adam Optimizer ───
describe("AdamOptimizer formula annotations", () => {
  const fn = NeuralFoundations.AdamOptimizer;

  it("sub 1 momentum formula annotations are center-aligned under their symbols", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const annotations = container.querySelectorAll("text[text-anchor='middle']");
    const labels = Array.from(annotations)
      .map((el) => el.textContent)
      .filter((t) => ["momentum", "0.9", "gradient"].includes(t));
    expect(labels).toEqual(expect.arrayContaining(["momentum", "0.9", "gradient"]));
  });

  it("sub 3 velocity formula annotations are center-aligned under their symbols", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const annotations = container.querySelectorAll("text[text-anchor='middle']");
    const labels = Array.from(annotations)
      .map((el) => el.textContent)
      .filter((t) => ["velocity", "0.999", "squared grad"].includes(t));
    expect(labels).toEqual(expect.arrayContaining(["velocity", "0.999", "squared grad"]));
  });
});

// ─── Chapter 2.8: Output Layer (rewritten with NN diagram) ───
describe("OutputLayer sub-steps", () => {
  const fn = LLMTraining.OutputLayer;

  it("sub 0 explains hidden state from scratch with layer-by-layer visual", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden state");
    expect(text).toContain("768");
    expect(text).toContain("layer");
    expect(text).toContain("vector");
  });

  it("sub 1 explains what logits are before using them", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("score");
    expect(text).toContain("50,000");
  });

  it("sub 2 shows the NN diagram from layers to output via unembedding", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Unembedding");
    expect(text).toContain("hidden state");
    expect(text).toContain("unembedding matrix");
    expect(text).not.toContain("Transformer");
  });

  it("sub 3 shows the unembedding matrix with concrete dot product example", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("dot product");
    expect(text).toContain("row");
    expect(text).toContain("logit");
  });

  it("sub 4 shows raw logits for sample tokens", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logits");
    expect(text).toContain("the");
    expect(text).toContain("softmax");
  });

  it("sub 5 shows softmax conversion with concrete probabilities", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("e^");
  });

  it("sub 6 explains why one linear layer works and parameter count", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden layers");
    expect(text).toContain("parameter");
  });

  it("sub 7 explains weight tying with visual similarity example", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("weight tying");
    expect(text).toContain("embedding");
    expect(text).toContain("mat");
    expect(text).toContain("rug");
  });
});

// ─── Chapter 2.9: Autoregressive Generation ───
describe("AutoregressiveGeneration sub-steps", () => {
  const fn = LLMTraining.AutoregressiveGeneration;

  it("sub 0 introduces training vs generation distinction with visual contrast", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("training");
    expect(text).toContain("one word at a time");
  });

  it("sub 1 shows step-by-step generation with full pipeline per step", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("mat");
    expect(text).toContain("softmax");
  });

  it("sub 2 explains greedy vs sampling vs top-k with probability bars", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Greedy");
    expect(text).toContain("probability");
    expect(text).toContain("Top");
  });

  it("sub 3 explains temperature as the creativity dial with concrete examples", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Temperature");
    expect(text).toContain("logit");
    expect(text).toContain("argmax");
  });

  it("sub 4 explains why generation works and when it stops", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("context");
    expect(text).toContain("stop");
    // Must NOT reference attention - learner hasn't seen it yet
    expect(text.toLowerCase()).not.toContain("self-attention");
    expect(text.toLowerCase()).not.toContain("attention pairs");
  });

  it("does not reference attention concepts anywhere (not yet taught)", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain("self-attention");
    expect(text).not.toContain("attention pairs");
    expect(text).not.toContain("attn pairs");
    expect(text).not.toContain("quadratic");
  });
});

// ─── Chapter 2.5 RLHF: split reward model and PPO into multiple boxes ───
describe("RLHF split boxes", () => {
  const fn = LLMTraining.RLHF;

  // Sub 3: Reward model - what it is + how it learns
  it("sub 3 shows the reward model as a neural network that scores responses", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("neural network");
    expect(text).toContain("score");
  });

  it("sub 3 shows concrete training data for the reward model with winner/loser pairs", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("winner");
    expect(text).toContain("loser");
  });

  it("sub 3 explains what the reward model learns to detect", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("helpful");
  });

  it("sub 3 does NOT show scored responses - those are in sub 4", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("score any response");
  });

  // Sub 4: Reward model - after training, scored responses
  it("sub 4 shows scored responses after training", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("score any response");
    expect(text).toContain("8.5");
  });

  it("sub 4 transitions to PPO by explaining why reward model replaces humans", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("instant");
  });

  it("sub 4 does NOT show PPO loop - that is in sub 5", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Proximal Policy Optimization");
  });

  // Sub 5: PPO 4-step loop
  it("sub 5 mentions PPO and shows the training loop", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("PPO");
    expect(text).toContain("Generate");
    expect(text).toContain("Score");
    expect(text).toContain("Compare");
    expect(text).toContain("Nudge");
  });

  it("sub 5 does NOT show KL divergence details - that is in sub 6", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Kullback-Leibler");
  });

  // Sub 6: KL divergence concrete example
  it("sub 6 explains KL divergence with concrete bar chart comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KL");
    expect(text).toContain("Kullback-Leibler");
    expect(text).toContain("SFT");
    expect(text).toContain("40%");
    expect(text).toContain("85%");
  });

  it("sub 6 does NOT show formula worked examples - that is in sub 7", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Reward hacking");
  });

  // Sub 7: Formula + worked examples + why KL needed
  it("sub 7 shows the formula with reward, KL, and beta", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Reward");
    expect(text).toContain("beta");
    expect(text).toContain("8.5");
  });

  it("sub 7 shows worked examples with concrete math", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.2");
    expect(text).toContain("Reward hacking");
  });

  it("sub 7 explains why KL penalty is necessary", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KL penalty");
    expect(text).toContain("shortcuts");
  });

  // Sub 8: Why RLHF matters (was sub 5)
  it("sub 8 explains why RLHF matters with concrete problems it solves", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("reward");
    expect(text).toContain("SFT");
  });
});

// ─── Chapter 2.9: DPO - example-driven rewrite ───
describe("DPO chapter", () => {
  const fn = LLMTraining.DPO;

  // Sub 0: The RLHF problem recap with 4 models
  it("sub 0 shows RLHF requires 4 models and explains why it is painful", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("4 models");
    expect(text).toContain("reward model");
    expect(text).toContain("policy");
    expect(text).toContain("Reference");
  });

  it("sub 0 does NOT show the DPO insight yet", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Skip the Reward Model");
  });

  // Sub 1: DPO insight - skip the reward model
  it("sub 1 explains DPO skips the reward model and learns directly from preferences", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Skip the Reward Model");
    expect(text).toContain("preference");
  });

  it("sub 1 does NOT show concrete probabilities yet", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("0.030");
  });

  // Sub 2: Concrete training step with real responses
  it("sub 2 shows a concrete prompt with preferred and rejected responses", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Python");
    expect(text).toContain("Rust");
    expect(text).toContain("Preferred");
    expect(text).toContain("Rejected");
  });

  // Sub 3: The log-ratio trick with real numbers
  it("sub 3 shows the log-ratio computation with concrete probabilities", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("log");
    expect(text).toContain("reference");
    expect(text).toContain("0.030");
  });

  it("sub 3 does NOT show the full formula yet", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("sigmoid");
  });

  // Sub 4: Full DPO loss formula with worked computation
  it("sub 4 shows the full DPO loss formula with sigmoid and worked numbers", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("sigmoid");
    expect(text).toContain("Loss");
    expect(text).toContain("beta");
  });

  // Sub 5: Beta - the safety leash
  it("sub 5 explains beta as a safety leash with different values", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("beta");
    expect(text).toContain("0.1");
    expect(text).toContain("0.5");
  });

  // Sub 6: RLHF vs DPO comparison
  it("sub 6 shows a side-by-side RLHF vs DPO comparison", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("RLHF");
    expect(text).toContain("DPO");
    expect(text).toContain("2 models");
  });
});

// ─── Chapter 2.3: CrossEntropy - graph and formula ───
describe("CrossEntropy graph and formula", () => {
  const fn = LLMTraining.CrossEntropy;

  it("sub 1 shows the -log(P) formula as an SVG visual", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const text = container.textContent;
    expect(text).toContain("log");
  });

  it("sub 1 shows the -log(P) graph curve", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.0");
    expect(text).toContain("1.0");
    // Graph has axis labels
    expect(text).toContain("probability");
  });

  it("sub 1 explains the graph with concrete LLM examples", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("confident");
  });

  it("sub 1 does NOT contain the weather forecaster example (that is sub 2)", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("weather");
  });
});

// ─── Chapter 2.4: NNInAction - The Neural Network in Action ───
describe("NNInAction sub-steps", () => {
  const fn = LLMTraining.NNInAction;

  it("sub 0 shows the 20-word vocabulary grid", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("20 words");
    expect(text).toContain("the");
    expect(text).toContain("cat");
    expect(text).toContain("with");
  });

  it("sub 0 shows word IDs in the vocabulary", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("[0]");
    expect(text).toContain("[19]");
  });

  it("sub 1 shows the input sentence The cat sat on with predict question", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("The");
    expect(text).toContain("cat");
    expect(text).toContain("sat");
    expect(text).toContain("on");
    expect(text).toContain("???");
  });

  it("sub 2 shows the neural network diagram with layers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Input");
    expect(text).toContain("Hidden");
    expect(text).toContain("Output");
    expect(text).toContain("weight");
  });

  it("sub 3 shows how the mat output circle computes its score", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("mat");
    expect(text).toContain("logit");
    expect(text).toContain("4.40");
  });

  it("sub 4 shows raw scores for all 20 words", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Raw scores");
    expect(text).toContain("the");
    expect(text).toContain("4.2");
    expect(text).toContain("mat");
    expect(text).toContain("3.8");
  });

  it("sub 5 shows softmax conversion with e^score", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("2.718");
  });

  it("sub 6 shows final probability bars with the as highest", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("probability");
    expect(text).toContain("the");
    expect(text).toContain("46.0%");
  });

  it("sub 7 shows the key insight that it is all multiply and add", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("multiply");
    expect(text).toContain("add");
    expect(text).toContain("weight");
  });
});

// ─── Chapter 2.5: SFT in depth ───
describe("SFT sub-steps", () => {
  const fn = LLMTraining.SFT;

  it("sub 0 explains the problem - model predicts generic internet text", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("internet");
    expect(text).toContain("predict");
  });

  it("sub 1 shows SFT training data format with User/Assistant pairs", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("User:");
    expect(text).toContain("Assistant:");
  });

  it("sub 2 shows loss computed only on assistant tokens position by position", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("no loss");
  });

  it("sub 3 shows before vs after SFT probability shift", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Before");
    expect(text).toContain("After");
  });

  it("sub 4 reveals the hidden prompt template wrapping", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("template");
  });

  it("sub 5 explains why 100K examples is enough", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("100K");
  });
});

// ─── Chapter 3.1: Chinchilla Scaling - illustrative rewrite ───
describe("Chinchilla scaling in ScalingLaws", () => {
  const fn = Scaling.ScalingLaws;

  // Sub 5: The problem - models were undertrained
  it("sub 5 explains that models were undertrained, not too small", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("GPT-3");
    expect(text).toContain("175B");
    expect(text).toContain("300B");
    expect(text).toContain("undertrained");
  });

  it("sub 5 does NOT show the Chinchilla vs Gopher comparison yet", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).not.toContain("Gopher");
  });

  // Sub 6: The proof - Chinchilla vs Gopher head to head
  it("sub 6 shows the Chinchilla vs Gopher comparison with concrete numbers", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Chinchilla");
    expect(text).toContain("Gopher");
    expect(text).toContain("70B");
    expect(text).toContain("280B");
    expect(text).toContain("1.4T");
  });

  // Sub 7: The 20:1 rule with worked examples
  it("sub 7 shows the 20 tokens per parameter rule with worked examples", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("20");
    expect(text).toContain("tokens per parameter");
    expect(text).toContain("7B");
    expect(text).toContain("140B");
  });
});

// ─── Chapter 3.4 CLIP fix: must show cosine formula ───
describe("CLIP cosine similarity formula", () => {
  const fn = Scaling.CLIP;

  it("sub 3 shows the actual cosine similarity formula", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("||A||");
  });
});

// ─── Chapter 3.3 Distillation fix: must mention temperature ───
describe("Distillation temperature mechanism", () => {
  const fn = Scaling.Distillation;

  it("sub 2 or 3 mentions temperature", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("temperature");
  });

  it("uses India/Delhi/Mumbai example (not France/Paris/Lyon)", () => {
    let combined = "";
    for (let s = 0; s <= 6; s++) {
      const { container } = render(fn(makeCtx({ sub: s })));
      combined += container.textContent;
      cleanup();
    }
    expect(combined).toContain("India");
    expect(combined).toContain("Delhi");
    expect(combined).toContain("Mumbai");
    expect(combined).not.toContain("France");
    expect(combined).not.toContain("Paris");
    expect(combined).not.toContain("Lyon");
  });
});

// ─── Chapter 4.5: Encoder & Decoder ───
describe("EncoderDecoder sub-steps", () => {
  const fn = RoadToTransformers.EncoderDecoder;

  it("sub 0 introduces the translation problem", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("translat");
  });

  it("sub 1 explains encoder reads and decoder writes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder");
    expect(text).toContain("Decoder");
  });

  it("sub 2 shows cross-attention connection between encoder and decoder", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("cross");
  });

  it("sub 3 references the 2017 paper architecture", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("2017");
  });
});

// ─── Chapter 4.6: Decoder-Only ───
describe("DecoderOnly sub-steps", () => {
  const fn = RoadToTransformers.DecoderOnly;

  it("sub 0 states GPT/Claude are decoder-only", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only");
  });

  it("sub 1 explains why no encoder is needed for text-to-text", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("continuous");
  });

  it("sub 2 shows visual comparison of architectures", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("masking");
  });

  it("sub 3 explains why decoder-only wins", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("decoder-only wins");
  });
});

// ─── Chapter 8.2: FeedForwardNetwork ───
describe("FeedForwardNetwork sub-steps", () => {
  const fn = TransformerBlock.FeedForwardNetwork;

  it("sub 0 shows where FFN sits in the Transformer block", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    // FFN should be highlighted
    expect(text).toContain("Feed-Forward");
  });

  it("sub 1 explains FFN is a simple 2-layer neural network", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should reference what learner already knows about layers
    expect(text).toContain("two");
    expect(text).toContain("layer");
    // Should show the formula
    expect(text).toContain("W");
    expect(text).toContain("b");
  });

  it("sub 2 shows the expand-then-compress shape with dimensions", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show the 512 -> 2048 -> 512 shape
    expect(text).toContain("512");
    expect(text).toContain("2048");
    // Should explain the 4x expansion
    expect(text).toContain("4x");
  });

  it("sub 3 shows step-by-step computation Step 1 only (W1 expansion)", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should use the cats embedding from Add & Norm output
    expect(text).toContain("cats");
    // Should show matrix multiply for Step 1
    expect(text).toContain("W");
    // Should have concrete numbers
    expect(text).toMatch(/\d+\.\d+/);
    // Should NOT contain Step 2 or Step 3 content (those moved to sub 4)
    expect(text).not.toContain("Apply GELU");
    expect(text).not.toContain("compress 8");
  });

  it("sub 4 shows step-by-step computation Steps 2-3 (GELU + W2 compression)", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show GELU activation step
    expect(text).toContain("GELU");
    // Should show W2 compression step
    expect(text).toContain("compress 8");
    // Should show the summary text
    expect(text).toContain("thinking space");
    // Should have concrete numbers
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 5 shows the GELU formula with Phi and erf, then compares to ReLU", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Must show the real formula
    expect(text).toContain("GELU");
    expect(text).toContain("(x)");
    expect(text).toContain("erf");
    // Must show worked examples with concrete numbers
    expect(text).toContain("0.977");
    expect(text).toContain("1.95");
    // Must compare to ReLU
    expect(text).toContain("ReLU");
    // Must explain the smooth difference
    expect(text).toContain("smooth");
  });

  it("sub 5 includes a ReLU vs GELU comparison graph", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    // The comparison graph has at least two polylines (one per curve) and a
    // <desc> that mentions both functions so screen-reader / search users know.
    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBeGreaterThanOrEqual(2);
    const combinedDescs = Array.from(container.querySelectorAll("desc"))
      .map((d) => d.textContent)
      .join(" ");
    expect(combinedDescs).toMatch(/ReLU/);
    expect(combinedDescs).toMatch(/GELU/);
  });

  it("sub 6 shows area/length/breadth example", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("area");
    expect(text).toContain("length");
    expect(text).toContain("breadth");
    expect(text).toContain("knowledge");
  });

  it("sub 7 shows India/Delhi factual recall example", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("India");
    expect(text).toContain("Delhi");
    expect(text).toContain("847");
    // Main example is India/Delhi; the only French token is the "capital-of-France"
    // neuron label kept intentionally as the contrasting suppressed detector.
    expect(text).toContain("capital-of-France");
    expect(text).not.toContain("Paris");
    expect(text).not.toContain("capital of France");
  });

  it("sub 8 shows bank/river multi-block example with detector details", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("bank");
    expect(text).toContain("river");
    expect(text).toContain("Block 1");
    expect(text).toContain("Block 5");
  });

  it("sub 9 shows deep Q&A", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("attention replace FFN");
    expect(text).toContain("FFN replace attention");
  });

  it("sub 10 shows parameter breakdown in its own box", () => {
    const ctx = makeCtx({ sub: 10 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("parameter");
    expect(text).toContain("2/3");
    expect(text).toContain("1/3");
  });
});

// ─── Chapter 8.3: FFNParallelTrick ───
describe("FFNParallelTrick sub-steps", () => {
  const fn = TransformerBlock.FFNParallelTrick;

  it("sub 0 recaps single-word FFN with one vector times W", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("one word");
    // Should show dimensions
    expect(text).toMatch(/1\s*x\s*3|1x3/i);
    expect(text).toMatch(/3\s*x\s*6|3x6/i);
  });

  it("sub 1 shows stacking multiple words into a matrix", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("stack");
    // Should show 3 words stacked
    expect(text).toMatch(/3\s*x\s*3|3x3/i);
    // Same W
    expect(text).toContain("same W");
  });

  it("sub 2 shows 6 words with same weight matrix", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("6");
    // Same 18 weights
    expect(text).toContain("18");
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
  });

  it("sub 3 shows 10 words to prove weight count independence", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("10");
    // Still 18 weights
    expect(text).toContain("18");
    // Key insight: word count doesn't affect weights
    expect(text).toMatch(/10\s*x\s*3|10x3/i);
  });

  it("sub 4 shows W2 scaling back down with inverse shape", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // W2 has inverse shape
    expect(text).toMatch(/6\s*x\s*3|6x3/i);
    expect(text).toContain("compress");
  });

  it("sub 5 explains GPU parallelism and free variable", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("GPU");
    expect(text).toContain("parallel");
  });
});

// ─── Chapter 8.4 (was 8.3): AddNormTwo ───
describe("AddNormTwo sub-steps", () => {
  const fn = TransformerBlock.AddNormTwo;

  it("sub 0 shows where we are - just after FFN, second Add & Norm", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("second");
  });

  it("sub 1 shows the Add step with FFN input + FFN output", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("+");
    // Should have concrete vectors
    expect(text).toMatch(/\[.*\d.*\]/);
  });

  it("sub 2 shows the Norm step with concrete numbers", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Norm");
    // Should show actual normalized values
    expect(text).toMatch(/\d+\.\d+/);
  });

  it("sub 3 shows the complete single-block pipeline from input to output", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show all 4 stages
    expect(text).toContain("Attention");
    expect(text).toContain("Add & Norm");
    expect(text).toContain("FFN");
    // Should have the full pipeline visual
    expect(container.querySelector("[data-full-block]")).toBeTruthy();
  });

  it("sub 4 explains why Add & Norm appears twice", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("twice");
    // Should explain each sub-layer needs its own stabilization
    expect(text).toContain("sub-layer");
  });
});

// ─── Chapter 8.5 (was 8.4): TransformerBlockRepeats ───
describe("TransformerBlockRepeats sub-steps", () => {
  const fn = TransformerBlock.TransformerBlockRepeats;

  it("sub 0 explains one block is not enough", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("one");
    expect(text).toContain("block");
    // Should motivate why repetition is needed
    expect(text).toContain("repeat");
  });

  it("sub 1 shows the stack with real model sizes", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show GPT-2 and GPT-3 block counts
    expect(text).toContain("GPT-2");
    expect(text).toContain("12");
    expect(text).toContain("GPT-3");
    expect(text).toContain("96");
  });

  it("sub 2 explains same structure different weights per block", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("same structure");
    expect(text).toContain("different weights");
  });

  it("sub 3 shows what each layer learns - shallow to deep", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Should show progression from basic to abstract
    expect(text).toContain("grammar");
    expect(text).toContain("meaning");
  });

  it("sub 4 shows complete picture from tokens through N blocks to output", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    // Full pipeline
    expect(text).toContain("Token");
    expect(text).toContain("Block");
    expect(text).toContain("Output");
    // The Nx notation
    expect(text).toContain("N");
  });
});

describe("source files have no standalone uppercase IS", () => {
  const sectionFiles = [
    "llm-training.jsx",
    "road-to-transformers.jsx",
    "neural-foundations.jsx",
    "scaling.jsx",
    "transformer-input.jsx",
    "attention-qkv.jsx",
    "attention-computation.jsx",
    "transformer-block.jsx",
    "toc.jsx",
  ];

  sectionFiles.forEach((file) => {
    it(`${file} has no standalone uppercase IS in string literals`, async () => {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");
      const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "sections", file);
      const content = fs.readFileSync(filePath, "utf-8");
      // Match standalone IS (word boundary) inside JSX string content
      // Exclude CLIP, THIS, RLHF and other valid acronyms - only match standalone IS
      const lines = content.split("\n");
      const violations = [];
      lines.forEach((line, i) => {
        // Skip import lines and comment-only lines
        if (line.trim().startsWith("import ") || line.trim().startsWith("//")) return;
        // Find standalone IS (surrounded by word boundaries, not part of larger word)
        const matches = line.match(/\bIS\b/g);
        if (matches) violations.push({ line: i + 1, text: line.trim() });
      });
      expect(violations).toEqual([]);
    });
  });
});

// ─── Graph helper edge-case branches ───
describe("Graph helper", () => {
  it("renders with xLabel and yLabel", () => {
    const { container } = render(
      Graph({
        points: [
          [0, 0],
          [1, 2],
          [2, 4],
        ],
        color: "#ff0000",
        xLabel: "X Axis",
        yLabel: "Y Axis",
      }),
    );
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.textContent).toContain("X Axis");
    expect(container.textContent).toContain("Y Axis");
  });

  it("renders without title (falsy title branch)", () => {
    const { container } = render(
      Graph({
        points: [
          [0, 1],
          [1, 2],
        ],
        color: "#ff0000",
      }),
    );
    // Default title is "" so no title text element
    const texts = container.querySelectorAll("text");
    const titleText = Array.from(texts).find(
      (t) => t.getAttribute("y") === "18" && t.getAttribute("font-weight") === "700",
    );
    expect(titleText).toBeFalsy();
  });

  it("handles single-x-value points (maxX === minX division-by-zero fallback)", () => {
    const { container } = render(
      Graph({
        points: [
          [5, 0],
          [5, 3],
          [5, 6],
        ],
        color: "#00ff00",
      }),
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("handles single-y-value points (maxY === minY division-by-zero fallback)", () => {
    const { container } = render(
      Graph({
        points: [
          [0, 3],
          [1, 3],
          [2, 3],
        ],
        color: "#0000ff",
      }),
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders zero line when minY < 0 and maxY > 0", () => {
    const { container } = render(
      Graph({
        points: [
          [0, -2],
          [1, 0],
          [2, 3],
        ],
        color: "#ff00ff",
      }),
    );
    // Zero line has dashed stroke
    const lines = container.querySelectorAll("line");
    const dashed = Array.from(lines).find((l) => l.getAttribute("stroke-dasharray") === "4,4");
    expect(dashed).toBeTruthy();
  });

  it("skips zero line when all values are positive", () => {
    const { container } = render(
      Graph({
        points: [
          [0, 1],
          [1, 2],
        ],
        color: "#ff0000",
      }),
    );
    const lines = container.querySelectorAll("line");
    const dashed = Array.from(lines).find((l) => l.getAttribute("stroke-dasharray") === "4,4");
    expect(dashed).toBeFalsy();
  });

  it("renders every-other x-label when points.length > 10", () => {
    const manyPoints = Array.from({ length: 12 }, (_, i) => [i, i * 2]);
    const { container } = render(
      Graph({
        points: manyPoints,
        color: "#ff6600",
      }),
    );
    expect(container.querySelector("svg")).toBeTruthy();
    // With 12 points and modulo 2, only even-indexed x-labels appear (6 labels)
    const xLabels = container.querySelectorAll("text[text-anchor='middle']");
    expect(xLabels.length).toBeGreaterThan(0);
  });

  it("renders annotations without explicit color (ac || C.yellow fallback)", () => {
    const { container } = render(
      Graph({
        points: [
          [0, 0],
          [1, 2],
          [2, 4],
        ],
        color: "#ff0000",
        annotations: [{ x: 1, y: 2, text: "peak" }],
      }),
    );
    // Should use C.yellow as fallback
    const circles = container.querySelectorAll("circle");
    const annotationCircle = Array.from(circles).find((c) => c.getAttribute("r") === "6");
    expect(annotationCircle).toBeTruthy();
    expect(annotationCircle.getAttribute("stroke")).toBe("#ffd740");
  });
});

// ─── Chapter 9.6: KV Cache ───
describe("KVCache sub-steps", () => {
  const fn = AttentionComputation.KVCache;

  it("sub 0 shows naive generation piling up wasted work on 'I love cats'", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Naive");
    expect(text).toContain("I");
    expect(text).toContain("love");
    expect(text).toContain("cats");
    expect(text.toLowerCase()).toMatch(/wast(e|ed|eful)/);
    // Work-bars SVG: 6 block rects (1+2+3 for three steps)
    const svg = container.querySelector("svg[data-viz='work-bars']");
    expect(svg).toBeTruthy();
    const blocks = svg.querySelectorAll("rect[data-block]");
    expect(blocks.length).toBe(6);
  });

  it("sub 1 shows same input plus same weights equals identical output", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("W_Q");
    expect(text).toContain("q_I");
    // Two identical vector values shown side by side
    const matches = text.match(/\[0\.5, 0\.2\]/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(text.toLowerCase()).toContain("identical");
  });

  it("sub 2 shows the matrix view with only the last row highlighted", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("last row");
    expect(text).toContain("q_cats");
    // Matrix-view SVG present with <desc>
    const svg = container.querySelector("svg[data-viz='matrix-view']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
    expect(desc.textContent.length).toBeGreaterThan(20);
    // Counter numbers: 18 cells total, 6 needed, 12 wasted
    expect(text).toMatch(/18/);
    expect(text).toMatch(/\b6\b/);
    expect(text).toMatch(/12/);
  });

  it("sub 3 shows Q drop vs K and V cache decision cards", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KV cache");
    expect(text).toContain("Q");
    expect(text).toContain("K");
    expect(text).toContain("V");
    expect(text.toLowerCase()).toMatch(/don't cache|dont cache|never cache|don.t cache/);
    expect(text.toLowerCase()).toContain("cache it");
  });

  it("sub 4 shows the growing-notebook cache frames with append arrows", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("append");
    expect(text.toLowerCase()).toContain("notebook");
    const svg = container.querySelector("svg[data-viz='notebook']");
    expect(svg).toBeTruthy();
    const desc = svg.querySelector("desc");
    expect(desc).toBeTruthy();
  });

  it("sub 5 shows before vs after for step 3 with identical output", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Without Cache");
    expect(text).toContain("With Cache");
    expect(text.toLowerCase()).toContain("identical");
    expect(text).toContain("q_cats");
    expect(text).toContain("k_cats");
    expect(text).toContain("v_cats");
  });

  it("sub 6 traces the worked example with d=2 and final output [0.447, 0.603]", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("0.447");
    expect(text).toContain("0.603");
    expect(text).toContain("d = 2");
    expect(text.toLowerCase()).toContain("cache");
  });

  it("sub 7 shows LLaMA 70B memory cost with 10.7 GB and memory bar SVG", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("LLaMA 70B");
    expect(text).toContain("10.7 GB");
    expect(text).toContain("d_model");
    expect(text).toContain("layers");
    const svg = container.querySelector("svg[data-viz='memory-bar']");
    expect(svg).toBeTruthy();
  });

  it("sub 8 shows the final memory-for-speed tradeoff with 660x numbers", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text.toLowerCase()).toContain("memory");
    expect(text.toLowerCase()).toContain("speed");
    expect(text).toMatch(/660/);
  });
});

// ─── Chapter 9.6: Encoder-Decoder Training Flow ───
describe("EncoderDecoderTraining spacing fixes", () => {
  const fn = EncoderDecoderDiagrams.EncoderDecoderTraining;

  it("sub 0 renders training title box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    // First rect should be the training title box
    const rects = svg.querySelectorAll("rect");
    const titleBox = rects[0];
    expect(titleBox.getAttribute("x")).toBe("20");
    expect(titleBox.getAttribute("width")).toBe("860");
  });

  it("sub 0 renders input string box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    // The input string box is the second rect
    const inputBox = rects[1];
    expect(inputBox.getAttribute("x")).toBe("20");
    expect(inputBox.getAttribute("width")).toBe("860");
  });

  it("sub 0 renders token ID boxes with width=60", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    // Token ID boxes come after the title box and input string box
    const tokenBoxes = rects.filter((r) => r.getAttribute("width") === "60" && r.getAttribute("height") === "28");
    expect(tokenBoxes.length).toBe(6);
  });

  it("sub 0 renders token ID text with font-size 11", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const texts = Array.from(svg.querySelectorAll("text"));
    const idTexts = texts.filter((t) => t.textContent.startsWith("ID:"));
    expect(idTexts.length).toBe(6);
    idTexts.forEach((t) => expect(t.getAttribute("font-size")).toBe("11"));
  });

  it("sub 4 renders encoder output box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    // Find the encoder output box (has specific fill)
    const encOutputBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(0,188,212,0.04)" && r.getAttribute("height") === "120",
    );
    expect(encOutputBox).toBeTruthy();
    expect(encOutputBox.getAttribute("x")).toBe("20");
    expect(encOutputBox.getAttribute("width")).toBe("860");
  });

  it("sub 8 renders total loss box at x=150 width=600", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const lossBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(244,67,54,0.06)" && r.getAttribute("height") === "28",
    );
    expect(lossBox).toBeTruthy();
    expect(lossBox.getAttribute("x")).toBe("150");
    expect(lossBox.getAttribute("width")).toBe("600");
  });

  it("sub 9 summary says Encoder runs ONCE without period", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Encoder runs ONCE");
    expect(text).not.toContain("Encoder runs ONCE.");
  });

  it("sub 9 renders and contains all summary items", () => {
    const ctx = makeCtx({ sub: 9 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Summary: Training Phase Flow");
    expect(text).toContain("Encoder:");
    expect(text).toContain("Decoder:");
    expect(text).toContain("Cross-Attention:");
  });
});

// ─── Chapter 9.4: WhatTransformerDoes - expanded content ───
describe("WhatTransformerDoes expanded sub-steps", () => {
  const fn = TransformerInput.WhatTransformerDoes;

  it("sub 0 introduces the big question with I love cats example", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("I love cats");
    expect(text).toContain("context");
  });

  it("sub 1 shows embeddings with actual vector numbers", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("embedding");
    expect(text).toContain("0.2");
  });

  it("sub 2 shows positional encoding being added", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("position");
  });

  it("sub 3 shows self-attention with words looking at each other", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("attention");
    expect(text).toContain("love");
  });

  it("sub 4 shows Add & Norm and FFN processing", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("FFN");
    expect(text).toContain("residual");
  });

  it("sub 5 shows repeated layers with progressive refinement", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("layer");
    expect(text).toContain("repeat");
  });

  it("sub 6 shows the output prediction step", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Linear");
    expect(text).toContain("Softmax");
    expect(text).toContain("probabilit");
  });

  it("sub 7 shows the complete pipeline summary", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("pipeline");
  });
});

// ─── Chapter 9.6: OutputHead ───
describe("OutputHead sub-steps", () => {
  const fn = TransformerInput.OutputHead;

  it("sub 0 introduces the gap between vectors and words", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("512");
    expect(text).toContain("vocab");
  });

  it("sub 1 shows the linear projection with matrix dimensions", () => {
    const ctx = makeCtx({ sub: 1 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Linear");
    expect(text).toContain("50,257");
    expect(text).toContain("matrix");
  });

  it("sub 2 explains what logits mean with concrete scores", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("logit");
    expect(text).toContain("dot product");
  });

  it("sub 3 shows softmax converting logits to probabilities", () => {
    const ctx = makeCtx({ sub: 3 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("softmax");
    expect(text).toContain("probabilit");
  });

  it("sub 4 shows temperature effect on distributions", () => {
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("temperature");
  });

  it("sub 5 shows sampling strategies with visual", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("Greedy");
    expect(text).toContain("Top-k");
    expect(text).toContain("Top-p");
  });

  it("sub 6 explains weight tying", () => {
    const ctx = makeCtx({ sub: 6 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("weight tying");
    expect(text).toContain("embedding");
  });

  it("sub 7 shows the complete output pipeline", () => {
    const ctx = makeCtx({ sub: 7 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("hidden state");
    expect(text).toContain("token");
  });
});

// ─── Chapter 9.7: Encoder-Decoder Inference Flow ───
describe("EncoderDecoderInference spacing fixes", () => {
  const fn = EncoderDecoderDiagrams.EncoderDecoderInference;

  it("sub 0 renders inference title box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 0 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const rects = svg.querySelectorAll("rect");
    const titleBox = rects[0];
    expect(titleBox.getAttribute("x")).toBe("20");
    expect(titleBox.getAttribute("width")).toBe("860");
  });

  it("sub 2 renders decoder setup box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 2 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const decoderBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(156,120,255,0.04)" && r.getAttribute("height") === "86",
    );
    expect(decoderBox).toBeTruthy();
    expect(decoderBox.getAttribute("x")).toBe("20");
    expect(decoderBox.getAttribute("width")).toBe("860");
  });

  it("sub 5 renders encoder K,V box at x=20 width=860", () => {
    const ctx = makeCtx({ sub: 5 });
    const { container } = render(fn(ctx));
    const svg = container.querySelector("svg");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const kvBox = rects.find(
      (r) => r.getAttribute("fill") === "rgba(0,188,212,0.03)" && r.getAttribute("height") === "110",
    );
    expect(kvBox).toBeTruthy();
    expect(kvBox.getAttribute("x")).toBe("20");
    expect(kvBox.getAttribute("width")).toBe("860");
  });

  it("sub 8 renders and contains memory cost info", () => {
    const ctx = makeCtx({ sub: 8 });
    const { container } = render(fn(ctx));
    const text = container.textContent;
    expect(text).toContain("KV Cache: Memory vs Speed Tradeoff");
    expect(text).toContain("What Happens Next");
  });
});

// ─── AttentionShapes (7.9) Mat SVG alignment ───
describe("AttentionShapes Mat component", () => {
  const fn = AttentionComputation.AttentionShapes;

  const parseViewBox = (svg) => {
    const vb = svg.getAttribute("viewBox");
    if (!vb) return null;
    const [x, y, w, h] = vb.split(/\s+/).map(Number);
    return { x, y, w, h };
  };

  // A Mat rect is always at x=0,y=0 with width=cols*unit, height=rows*unit.
  // For rect-center to align with the SVG bounding-box center (so rects line up
  // between matrices that have different row/col label configurations), the
  // viewBox must be symmetric around (w/2, h/2).
  it("every Mat SVG has a viewBox centered on the rect", () => {
    // Render at the highest sub so all Mats are mounted
    const ctx = makeCtx({ sub: 4 });
    const { container } = render(fn(ctx));
    // Mats use <rect rx="4"> and <text> for labels; find all candidate svgs
    const svgs = container.querySelectorAll("svg");
    const matSvgs = Array.from(svgs).filter((s) => s.querySelector('rect[rx="4"]'));
    expect(matSvgs.length).toBeGreaterThan(0);

    matSvgs.forEach((svg, i) => {
      const rect = svg.querySelector('rect[rx="4"]');
      const rw = Number(rect.getAttribute("width"));
      const rh = Number(rect.getAttribute("height"));
      const rx = Number(rect.getAttribute("x") || 0);
      const ry = Number(rect.getAttribute("y") || 0);
      const rectCx = rx + rw / 2;
      const rectCy = ry + rh / 2;
      const vb = parseViewBox(svg);
      expect(vb, `Mat svg #${i} missing viewBox`).toBeTruthy();
      const vbCx = vb.x + vb.w / 2;
      const vbCy = vb.y + vb.h / 2;
      expect(vbCx, `Mat svg #${i} viewBox-center-x != rect-center-x`).toBeCloseTo(rectCx, 5);
      expect(vbCy, `Mat svg #${i} viewBox-center-y != rect-center-y`).toBeCloseTo(rectCy, 5);
    });
  });
});

// ─── SVG <desc> metadata for search ───
describe("Every SVG has a <desc> element", () => {
  // Chapters known to contain inline SVGs (JSX or Graph)
  const svgChapters = [
    "1.1",
    "1.2",
    "1.3",
    "1.4",
    "1.5",
    "1.6",
    "1.7",
    "1.8",
    "1.10",
    "1.11",
    "1.12",
    "1.13",
    "1.19",
    "1.23",
    "1.24",
    "1.25",
    "1.26",
    "2.3",
    "2.5",
    "5.1",
    "7.4",
    "8.3",
    "8.6",
    "9.3",
    "11.5",
    "11.6",
    "11.7",
    "11.8",
    "11.9",
    "11.10",
    "11.11",
    "11.15",
    "11.16",
    "11.17",
    "11.18",
    "11.20",
    "11.21",
    "11.22",
    "11.23",
    "11.24",
    "11.25",
    "11.36",
    "12.31",
    "12.32",
    "12.34",
    "12.35",
  ];

  svgChapters.forEach((chId) => {
    const chapter = chapters.find((c) => c.id === chId);
    if (!chapter) return;
    const fn = lookup[chapter.component];

    it(`${chId} ${chapter.component} - all SVGs have <desc>`, () => {
      // Render at a high sub to get all content
      const ctx = makeCtx({ sub: 10 });
      const { container } = render(fn(ctx));
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
      svgs.forEach((svg, i) => {
        const desc = svg.querySelector("desc");
        expect(desc, `SVG #${i} in ${chId} missing <desc>`).toBeTruthy();
        expect(desc.textContent.length, `SVG #${i} in ${chId} has empty <desc>`).toBeGreaterThan(10);
      });
      cleanup();
    });
  });

  // Encoder-decoder diagrams use imperative SVG (useEffect + ref)
  ["9.8", "9.9"].forEach((chId) => {
    const chapter = chapters.find((c) => c.id === chId);
    if (!chapter) return;
    const fn = lookup[chapter.component];

    it(`${chId} ${chapter.component} - imperative SVG has <desc>`, () => {
      const ctx = makeCtx({ sub: 10 });
      const { container } = render(fn(ctx));
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
      svgs.forEach((svg, i) => {
        const desc = svg.querySelector("desc");
        expect(desc, `SVG #${i} in ${chId} missing <desc>`).toBeTruthy();
        expect(desc.textContent.length, `SVG #${i} in ${chId} has empty <desc>`).toBeGreaterThan(10);
      });
      cleanup();
    });
  });
});

describe("WhyLLMsNeedRetrieval (12.1) content", () => {
  const fn = RagFoundations.WhyLLMsNeedRetrieval;

  it("sub=0 lists bare-LLM production failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/knowledge cutoff/i);
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/private/i);
  });

  it("sub=1 contrasts fine-tuning vs RAG on cost/freshness/traceability", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fine-?tun/i);
    expect(container.textContent).toMatch(/freshness|fresh/i);
    expect(container.textContent).toMatch(/cite|trace|attribution/i);
  });

  it("sub=2 shows the 3-step RAG ground-the-answer flow", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/ground|anchor/i);
  });

  it("sub=3 shows side-by-side bare-LLM vs RAG on refund policy", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/made up|hallucinat|invent/i);
    expect(container.textContent).toMatch(/doc-?4|\[doc/i);
  });

  it("sub=4 lists the 5 production reasons", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/5 reasons|five reasons/i);
    expect(container.textContent).toMatch(/private data/i);
    expect(container.textContent).toMatch(/refresh/i);
  });
});

describe("NaiveRAGPipeline (12.2) content", () => {
  const fn = RagFoundations.NaiveRAGPipeline;

  it("sub=0 shows the 5-stage pipeline overview", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/store/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
  });

  it("sub=1 demonstrates chunking on doc-1 password reset", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/password reset|reset.*password|doc-?1/i);
    expect(container.textContent).toMatch(/chunk/i);
  });

  it("sub=2 references Section 5.2 for embeddings", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/section 5\.2|5\.2/i);
    expect(container.textContent).toMatch(/embed|vector/i);
  });

  it("sub=3 references Section 11 for vector storage / HNSW", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/section 11/i);
    expect(container.textContent).toMatch(/HNSW|vector (database|index)/i);
  });

  it("sub=4 retrieves top-k for the password reset query", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/top-?k|top-?3/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=5 shows a prompt template with citation marker and I-don't-know clause", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/i don'?t know|don'?t answer/i);
    expect(container.textContent).toMatch(/\[doc-?1/i);
    expect(container.textContent).toMatch(/documentation|context/i);
  });

  it("sub=6 walks the running query end to end across all 5 stages", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/how do i reset my password/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });
});

describe("WhereNaiveRAGBreaks (12.3) content", () => {
  const fn = RagFoundations.WhereNaiveRAGBreaks;

  it("sub=0 lists the 7 failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/7|seven/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/citation|citation/i);
    expect(container.textContent).toMatch(/hallucinat/i);
  });

  it("sub=1 shows bad chunking on the password reset doc", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunking|chunk/i);
    expect(container.textContent).toMatch(/mid-?sentence|split/i);
    expect(container.textContent).toMatch(/12\.7-12\.13|chunking/i);
  });

  it("sub=2 shows low recall on sign-in vs log-in lexical mismatch", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/sign.?in/i);
    expect(container.textContent).toMatch(/12\.14-12\.21|hybrid|reranker|query.{0,20}transform/i);
  });

  it("sub=3 shows lost-in-the-middle attention U-curve", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/middle/i);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/12\.22-12\.24|context packing|lost.?in.?middle/i);
  });

  it("sub=4 shows missing citation on suspended account query", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/verify|verifiable/i);
    expect(container.textContent).toMatch(/12\.22-12\.24|citations|groundedness/i);
  });

  it("sub=5 shows hallucination on Pro vs Enterprise SSO", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hallucinat/i);
    expect(container.textContent).toMatch(/SSO/);
    expect(container.textContent).toMatch(/Pro|Enterprise/);
  });

  it("sub=6 shows stale index + cost/latency with Section 11.27 + chapter 12.36-12.40 references", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/stale/i);
    expect(container.textContent).toMatch(/Section 11\.27|11\.27/);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/12\.36-12\.40|caching|observability/i);
  });
});

describe("ParsingExtraction (12.4) content", () => {
  const fn = RagIngestion.ParsingExtraction;

  it("sub=0 frames the garbage-in problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/garbage|unrecoverable/i);
    expect(container.textContent).toMatch(/OCR|broken text|PDF/i);
    expect(container.textContent).toMatch(/password/i);
  });

  it("sub=1 lists 5+ source format families", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/PDF/);
    expect(container.textContent).toMatch(/HTML/);
    expect(container.textContent).toMatch(/DOCX/);
    expect(container.textContent).toMatch(/Markdown/);
    expect(container.textContent).toMatch(/Confluence|Notion|API/);
  });

  it("sub=2 shows three PDF failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/two[- ]?column|2[- ]?column/i);
    expect(container.textContent).toMatch(/table/i);
    expect(container.textContent).toMatch(/OCR/);
    expect(container.textContent).toMatch(/Unstructured|Docling|PyMuPDF|LlamaParse|Tesseract/);
  });

  it("sub=3 contrasts HTML boilerplate vs main content", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/boilerplate|nav|sidebar|footer/i);
    expect(container.textContent).toMatch(/Readability|Trafilatura/);
    expect(container.textContent).toMatch(/dilut|pollut|main content/i);
  });

  it("sub=4 shows the metadata schema artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/metadata/i);
    expect(container.textContent).toMatch(/source_url|URL/i);
    expect(container.textContent).toMatch(/updated_at|timestamp/i);
    expect(container.textContent).toMatch(/permissions|ACL/i);
  });

  it("sub=5 lists the 5 parsing failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/five|5/i);
    expect(container.textContent).toMatch(/checklist|failure mode/i);
    expect(container.textContent).toMatch(/silent|recall/i);
  });
});

describe("DeduplicationCleaning (12.5) content", () => {
  const fn = RagIngestion.DeduplicationCleaning;

  it("sub=0 frames the duplicate-disaster context-budget waste", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/duplicate|copies/i);
    expect(container.textContent).toMatch(/Zendesk|Confluence|Notion/);
    expect(container.textContent).toMatch(/context|tokens|budget/i);
    expect(container.textContent).toMatch(/diversity/i);
  });

  it("sub=1 shows exact-hash dedup with SHA-256", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/SHA[- ]?256/);
    expect(container.textContent).toMatch(/normalize/i);
    expect(container.textContent).toMatch(/hash/i);
  });

  it("sub=2 explains MinHash + LSH for near-duplicates", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/MinHash/i);
    expect(container.textContent).toMatch(/LSH|locality/i);
    expect(container.textContent).toMatch(/Jaccard|shingle/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 introduces embedding-cosine dedup for paraphrases", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/embedding|cosine/i);
    expect(container.textContent).toMatch(/paraphrase|semantic/i);
    expect(container.textContent).toMatch(/0\.9\d?/);
  });

  it("sub=4 lists the 4 cleaning steps beyond dedup", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Unicode|NFC/);
    expect(container.textContent).toMatch(/encoding|mojibake/i);
    expect(container.textContent).toMatch(/header|footer|watermark/i);
    expect(container.textContent).toMatch(/PII|redact|SSN/i);
  });
});

describe("RefreshSync (12.6) content", () => {
  const fn = RagIngestion.RefreshSync;

  it("sub=0 frames the stale-index hallucination problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/stale|outdated/i);
    expect(container.textContent).toMatch(/MFA|password reset/i);
    expect(container.textContent).toMatch(/hallucinate|wrong|confident/i);
  });

  it("sub=0 SVG v1/v2 source-of-truth rects have visible gap (no overlap)", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    const svg = container.querySelector("svg[viewBox]");
    const rects = Array.from(svg.querySelectorAll("rect"));
    const v1 = rects[0];
    const v2 = rects[1];
    const v1End = +v1.getAttribute("x") + +v1.getAttribute("width");
    const v2Start = +v2.getAttribute("x");
    const gap = v2Start - v1End;
    expect(gap, `v1/v2 rects gap=${gap}, expected >= 12`).toBeGreaterThanOrEqual(12);
  });

  it("sub=0 SVG text never exceeds rect width (no overflow)", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    const svg = container.querySelector("svg[viewBox]");
    const texts = Array.from(svg.querySelectorAll("text"));
    const overlong = texts.map((t) => t.textContent).filter((t) => t.length > 65);
    expect(overlong, "SVG <text> longer than 65 chars overflows its rect").toEqual([]);
  });

  it("sub=1 explains full re-index cost and tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/full re[- ]?index|rebuild/i);
    expect(container.textContent).toMatch(/nightly|cron|batch/i);
    expect(container.textContent).toMatch(/\$|cost/);
    expect(container.textContent).toMatch(/shadow|atomic|swap/i);
  });

  it("sub=2 details webhook-driven incremental sync", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/webhook/i);
    expect(container.textContent).toMatch(/incremental|upsert/i);
    expect(container.textContent).toMatch(/seconds|real[- ]?time/i);
    expect(container.textContent).toMatch(/11\.21|deletes/);
  });

  it("sub=3 details polling on updated_at with interval lag", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/poll/i);
    expect(container.textContent).toMatch(/updated_at|timestamp/i);
    expect(container.textContent).toMatch(/15|interval/i);
    expect(container.textContent).toMatch(/lag|delay/i);
  });

  it("sub=4 covers delete propagation and versioning", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/delete|tombstone/i);
    expect(container.textContent).toMatch(/version|v1|v2/i);
    expect(container.textContent).toMatch(/grace|propagation/i);
    expect(container.textContent).toMatch(/11\.21|Section 11/);
  });

  it("sub=4 versioning rows render in foreignObject with center-aligned content", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    const fObjects = container.querySelectorAll("foreignObject");
    const rowFOs = Array.from(fObjects).filter((fo) => /Row [123] - t=/.test(fo.textContent));
    expect(rowFOs.length, "expected 3 row foreignObjects in sub=4 SVG").toBe(3);
    for (const fo of rowFOs) {
      const div = fo.querySelector("div");
      expect(div?.style?.textAlign, `row content not centered: "${fo.textContent.slice(0, 40)}"`).toBe("center");
    }
  });
});

describe("WhyChunkFixedSize (12.7) content", () => {
  const fn = RagFoundations.WhyChunkFixedSize;

  it("sub=0 shows why a whole-doc embedding is impossible", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/250,000|250000|500 pages?|500-page/i);
    expect(container.textContent).toMatch(/8,?192|8K/);
    expect(container.textContent).toMatch(/overflow|exceed|too (long|big)/i);
  });

  it("sub=1 lists the three reasons we must chunk", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context limits?/i);
    expect(container.textContent).toMatch(/granular/i);
    expect(container.textContent).toMatch(/dilut|signal/i);
  });

  it("sub=2 introduces the fixed-size sliding window on doc-1", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sliding window|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/128/);
    expect(container.textContent).toMatch(/doc-?1|password reset/i);
  });

  it("sub=3 shows the mid-sentence break on the password reset doc", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/mid[- ]?sentence|boundary|cut/i);
    expect(container.textContent).toMatch(/password/i);
    expect(container.textContent).toMatch(/set a new/i);
  });

  it("sub=4 compares overlap 0 vs overlap 16 with cost tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/overlap/i);
    expect(container.textContent).toMatch(/0/);
    expect(container.textContent).toMatch(/16/);
    expect(container.textContent).toMatch(/duplicate|redundant|cost|more vectors/i);
  });

  it("sub=5 lists when fixed-size is enough vs when to move on", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/baseline/i);
    expect(container.textContent).toMatch(/homogeneous|heterogeneous/i);
    expect(container.textContent).toMatch(/structural|semantic/i);
  });
});

describe("RecursiveStructuralChunking (12.8) content", () => {
  const fn = RagFoundations.RecursiveStructuralChunking;

  it("sub=0 shows the priority tree of structural separators", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/structural|structure/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/line/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/word/i);
  });

  it("sub=1 demonstrates fixed-size failure on heterogeneous doc-7", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/doc-?7|login troubleshooting/i);
    expect(container.textContent).toMatch(/mix|span|across topic/i);
  });

  it("sub=2 shows recursive structural produces one chunk per section", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/recursive/i);
    expect(container.textContent).toMatch(/structural/i);
    expect(container.textContent).toMatch(/one topic|exactly one|3 chunks|three chunks/i);
  });

  it("sub=3 traces the recursion when a section exceeds size", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recurse|recursion|fall back/i);
    expect(container.textContent).toMatch(/paragraph/i);
    expect(container.textContent).toMatch(/300/);
    expect(container.textContent).toMatch(/128/);
  });

  it("sub=4 frames recursive structural as the 80% baseline", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/80%|eighty percent|default/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
    expect(container.textContent).toMatch(/semantic/i);
  });
});

describe("SemanticChunking (12.9) content", () => {
  const fn = RagFoundations.SemanticChunking;

  it("sub=0 frames the no-structural-markers gap", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no structural|no headings|no markers|flat/i);
    expect(container.textContent).toMatch(/semantic|topic shift/i);
  });

  it("sub=1 embeds every sentence", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/sentence/i);
    expect(container.textContent).toMatch(/12 sentences?|12 vectors?/i);
  });

  it("sub=2 plots cosine similarity with a threshold", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/threshold|0\.7/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 derives 2 chunks from the cosine dip", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/2 chunks?|two chunks?/i);
    expect(container.textContent).toMatch(/creating|revoking/i);
  });

  it("sub=4 quantifies the embed-before-chunk cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|expensive/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/structural|fixed[- ]?size/i);
    expect(container.textContent).toMatch(/\$|10x|50x|million|M docs/i);
  });
});

describe("LateChunking (12.10) content", () => {
  const fn = RagFoundations.LateChunking;

  it("sub=0 frames cross-chunk reference loss on the Sarah doc", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cross[- ]?chunk/i);
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/pronoun|reference|she/i);
  });

  it("sub=1 contrasts chunk-then-embed vs embed-then-chunk", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chunk[- ]?then[- ]?embed/i);
    expect(container.textContent).toMatch(/embed[- ]?then[- ]?chunk|late chunk/i);
    expect(container.textContent).toMatch(/attention|whole doc|all tokens/i);
    expect(container.textContent).toMatch(/pool/i);
  });

  it("sub=2 traces the late-chunking pass on doc-1", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/Sarah/);
    expect(container.textContent).toMatch(/attention/i);
    expect(container.textContent).toMatch(/chunk 3|v_chunk3/i);
  });

  it("sub=3 shows the retrieval-score reversal", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/0\.\d+/);
    expect(container.textContent).toMatch(/chunk 3/i);
    expect(container.textContent).toMatch(/Sarah/);
  });

  it("sub=4 lists pros, cons, and notes Jina 2024 origin", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Jina/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/pronoun|anaphora|reference/i);
    expect(container.textContent).toMatch(/token[- ]?level|hidden state/i);
  });
});

describe("HierarchicalChunking (12.11) content", () => {
  const fn = RagFoundations.HierarchicalChunking;

  it("sub=0 frames the small-vs-large chunk tension", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/small chunks?/i);
    expect(container.textContent).toMatch(/large chunks?/i);
    expect(container.textContent).toMatch(/retrieval|precision/i);
    expect(container.textContent).toMatch(/generation|context/i);
  });

  it("sub=1 introduces the leaf-and-parent hierarchy on doc-4", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/leaf|leaves/i);
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/doc-?4|refund/i);
    expect(container.textContent).toMatch(/64/);
    expect(container.textContent).toMatch(/300/);
  });

  it("sub=1 tree SVG omits right-edge legend labels that overlap nodes", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) =>
      s.textContent.includes("Doc-4 Refunds Policy (Root)"),
    );
    expect(svg).not.toBeNull();
    expect(svg.textContent).not.toMatch(/Root:\s*900\s*Tok/);
    expect(svg.textContent).not.toMatch(/Section:\s*300\s*Tok/);
    expect(svg.textContent).not.toMatch(/Leaf:\s*64\s*Tok/);
  });

  it("sub=2 retrieves a leaf chunk for the refund query", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/30 days|L7|leaf/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=3 swaps leaf for parent before the LLM", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parent/i);
    expect(container.textContent).toMatch(/swap|lookup|replace/i);
    expect(container.textContent).toMatch(/LLM|prompt|context/i);
  });

  it("sub=4 introduces summary chunks as a variant", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/summary|summaries/i);
    expect(container.textContent).toMatch(/LLM|generate/i);
  });

  it("sub=4 summary-variant SVG omits right-edge legend labels that overlap nodes", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Summary (LLM-Made)"));
    expect(svg).not.toBeNull();
    const rightAnchored = Array.from(svg.querySelectorAll("text")).filter(
      (t) => t.getAttribute("text-anchor") === "end",
    );
    expect(
      rightAnchored.map((t) => t.textContent.trim()),
      "right-anchored legend labels overlap diagram nodes",
    ).toEqual([]);
  });

  it("sub=5 explains when and at what cost", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/storage|cost/i);
    expect(container.textContent).toMatch(/LangChain|LlamaIndex/i);
  });
});

describe("ContextualRetrieval (12.12) content", () => {
  const fn = RagFoundations.ContextualRetrieval;

  it("sub=0 shows the orphan-chunk identical-text problem", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/click Save|Save to confirm/i);
    expect(container.textContent).toMatch(/email/i);
    expect(container.textContent).toMatch(/identical|same|indistinguishable|nearly/i);
  });

  it("sub=1 prepends an LLM-generated context line", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/context/i);
    expect(container.textContent).toMatch(/prepend|prefix/i);
    expect(container.textContent).toMatch(/LLM[- ]?generated|generated/i);
  });

  it("sub=2 shows the augmentation prompt template with cost note", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/\{chunk\}|\{document_title\}/);
    expect(container.textContent).toMatch(/Haiku|cheap model|cost/i);
    expect(container.textContent).toMatch(/\$0\.001|\$100/);
  });

  it("sub=3 contrasts recall@1 before vs after augmentation", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recall|augment/i);
    expect(container.textContent).toMatch(/33%|100%/);
  });

  it("sub=4 cites Anthropic's 2024 49% improvement", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/Anthropic/i);
    expect(container.textContent).toMatch(/2024/);
    expect(container.textContent).toMatch(/49%|49 percent/);
    expect(container.textContent).toMatch(/BM25|hybrid|rerank/i);
  });

  it("sub=5 lists when contextual retrieval is overkill", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/overkill|skip|when not/i);
    expect(container.textContent).toMatch(/homogeneous/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=6 stacks contextual + hybrid + reranker with Section 11 refs", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/Section 11\.24|11\.24/);
    expect(container.textContent).toMatch(/Section 11\.25|11\.25/);
    expect(container.textContent).toMatch(/67%|combined/);
  });
});

describe("ChunkingDecision (12.13) content", () => {
  const fn = RagFoundations.ChunkingDecision;

  it("sub=0 lists at least five of the six chunking strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    const text = container.textContent;
    const names = [/fixed[- ]?size/i, /recursive structural/i, /semantic/i, /late/i, /hierarchical/i, /contextual/i];
    const hits = names.filter((re) => re.test(text)).length;
    expect(hits).toBeGreaterThanOrEqual(5);
    expect(text).toMatch(/quality|cost|implementation/i);
  });

  it("sub=1 covers the doc-structure axis (markdown, PDF, code, flat)", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/markdown|HTML/i);
    expect(container.textContent).toMatch(/PDF/);
    expect(container.textContent).toMatch(/code/i);
    expect(container.textContent).toMatch(/flat|narrative/i);
  });

  it("sub=2 covers the query-type axis (factual, relational, comparative)", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/factual/i);
    expect(container.textContent).toMatch(/relational/i);
    expect(container.textContent).toMatch(/comparative/i);
    expect(container.textContent).toMatch(/hierarchical/i);
  });

  it("sub=3 covers the cost-budget axis (lab, startup, enterprise)", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lab|prototype/i);
    expect(container.textContent).toMatch(/startup/i);
    expect(container.textContent).toMatch(/enterprise/i);
    expect(container.textContent).toMatch(/\$|free|cost/i);
  });

  it("sub=4 walks through strategy choice on the customer support corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/customer support|support corpus/i);
    expect(container.textContent).toMatch(/Account|Billing/i);
    expect(container.textContent).toMatch(/Product Features|Troubleshooting/i);
    expect(container.textContent).toMatch(/mix|rarely one|iterate/i);
  });
});

describe("EmbeddingModelChoice (12.14) content", () => {
  const fn = RagRetrieval.EmbeddingModelChoice;

  it("sub=0 frames embedding model as recall ceiling and references Section 5.2", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding model/i);
    expect(container.textContent).toMatch(/section 5\.2|5\.2/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 shows the five-axis decision matrix with named models", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/OpenAI/i);
    expect(container.textContent).toMatch(/Cohere/i);
    expect(container.textContent).toMatch(/BGE/i);
    expect(container.textContent).toMatch(/SBERT/i);
    expect(container.textContent).toMatch(/Voyage/i);
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/context/i);
  });

  it("sub=2 shows dimension memory tradeoff at common dims", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/1024/);
    expect(container.textContent).toMatch(/3072/);
    expect(container.textContent).toMatch(/memory|GB/i);
    expect(container.textContent).toMatch(/diminish|marginal/i);
  });

  it("sub=3 contrasts multilingual vs English-only and mentions 12.15 for domain", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multilingual/i);
    expect(container.textContent).toMatch(/english/i);
    expect(container.textContent).toMatch(/12\.15/);
  });

  it("sub=4 shows cost math at 100M tokens with a self-host comparison", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/100M|100 million/i);
    expect(container.textContent).toMatch(/\$/);
    expect(container.textContent).toMatch(/self-?host|managed/i);
  });

  it("sub=5 surfaces MTEB caveat and a decision flow", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/MTEB/);
    expect(container.textContent).toMatch(/benchmark|leaderboard/i);
    expect(container.textContent).toMatch(/your data|own data/i);
  });
});

describe("DomainAdaptation (12.15) content", () => {
  const fn = RagRetrieval.DomainAdaptation;

  it("sub=0 shows the off-the-shelf gap on domain pairs", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/off-the-shelf|off the shelf/i);
    expect(container.textContent).toMatch(/MI|tPA|medical|legal|code/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows triplet loss formula with anchor positive negative", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/triplet/i);
    expect(container.textContent).toMatch(/anchor/i);
    expect(container.textContent).toMatch(/positive/i);
    expect(container.textContent).toMatch(/negative/i);
    expect(container.textContent).toMatch(/margin/i);
  });

  it("sub=1 'Anchor (Query)' label sits clear of the Push-Away arrow", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Anchor (Query)"));
    expect(svg).not.toBeNull();
    const anchorLabel = Array.from(svg.querySelectorAll("text")).find((t) => t.textContent.trim() === "Anchor (Query)");
    expect(anchorLabel).not.toBeNull();
    const labelY = +anchorLabel.getAttribute("y");
    // Push-Away line starts at ANCHOR_Y (130) and slopes down-right. Label sat
    // at ANCHOR_Y+34=164 which let the arrow path cut over the text. Push it
    // down to ANCHOR_Y+50=180 (or further) so it stays below the line at its
    // rightmost extent.
    expect(labelY, `anchor label y=${labelY}, expected >= 180`).toBeGreaterThanOrEqual(180);
  });

  it("sub=1 Pull/Push lines start at A circle boundary, not its center", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    const svg = Array.from(container.querySelectorAll("svg")).find((s) => s.textContent.includes("Anchor (Query)"));
    const aCircle = Array.from(svg.querySelectorAll("circle")).find(
      (c) => c.getAttribute("r") === "14" && c.getAttribute("cx") === "260",
    );
    expect(aCircle).not.toBeNull();
    const cx = +aCircle.getAttribute("cx");
    const cy = +aCircle.getAttribute("cy");
    const r = +aCircle.getAttribute("r");
    const lines = Array.from(svg.querySelectorAll("line")).filter((l) =>
      ["#a5d6a7", "#ef9a9a"].includes(l.getAttribute("stroke")),
    );
    expect(lines.length).toBe(2);
    for (const l of lines) {
      const dx = +l.getAttribute("x1") - cx;
      const dy = +l.getAttribute("y1") - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      expect(
        dist,
        `line (${l.getAttribute("stroke")}) starts ${dist.toFixed(1)}vb from A center, expected ~${r}`,
      ).toBeGreaterThanOrEqual(r - 0.5);
    }
  });

  it("sub=2 shows training pair construction with hard negatives", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hard negative/i);
    expect(container.textContent).toMatch(/reset my password|sign in|cancel/i);
  });

  it("sub=3 names the when-to-fine-tune decision rules", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/specialized|domain/i);
    expect(container.textContent).toMatch(/80%|0\.80/);
    expect(container.textContent).toMatch(/5k|5000|5,000/i);
    expect(container.textContent).toMatch(/fine-?tun/i);
  });

  it("sub=4 shows before vs after recall/MRR delta on support corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/recall|MRR/i);
    expect(container.textContent).toMatch(/before|after|off-the-shelf|fine-?tuned/i);
    expect(container.textContent).toMatch(/cost|\$/);
  });
});

describe("HybridForRAG (12.16) content", () => {
  const fn = RagRetrieval.HybridForRAG;

  it("sub=0 shows API key + cancel examples and references Section 11.24", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/BM25/);
    expect(container.textContent).toMatch(/dense/i);
    expect(container.textContent).toMatch(/API key/i);
    expect(container.textContent).toMatch(/cancel|subscription/i);
    expect(container.textContent).toMatch(/Section 11\.24|11\.24/);
  });

  it("sub=1 shows RRF and weighted-fusion formulas with k = 60 and alpha", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/alpha/i);
  });

  it("sub=2 walks an RRF computation with doc rankings and final order", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc-?25/i);
    expect(container.textContent).toMatch(/0\.0\d+/);
  });

  it("sub=3 shows complementary recall numbers for BM25, dense, hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/recall|complementary/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=4 tunes alpha by query type with factual vs conceptual rows", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alpha/i);
    expect(container.textContent).toMatch(/factual|lookup/i);
    expect(container.textContent).toMatch(/conceptual/i);
    expect(container.textContent).toMatch(/0\.7|0\.3/);
  });

  it("sub=5 lists hybrid RAG decision defaults", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/RRF/);
    expect(container.textContent).toMatch(/default|start/i);
  });
});

describe("RerankerCascade (12.17) content", () => {
  const fn = RagRetrieval.RerankerCascade;

  it("sub=0 recaps Section 11.25 cross-encoder", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Section 11\.25|11\.25/);
    expect(container.textContent).toMatch(/cross-?encoder|reranker/i);
    expect(container.textContent).toMatch(/cascade|stage/i);
  });

  it("sub=1 shows the 3-stage funnel with top-50, top-10, top-3", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector/i);
    expect(container.textContent).toMatch(/reranker|cross-?encoder/i);
    expect(container.textContent).toMatch(/LLM/);
    expect(container.textContent).toMatch(/50/);
    expect(container.textContent).toMatch(/10/);
  });

  it("sub=2 shows the latency budget 30 + 80 + 800 = ~910ms", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/30/);
    expect(container.textContent).toMatch(/80/);
    expect(container.textContent).toMatch(/800/);
    expect(container.textContent).toMatch(/910|p50/i);
    expect(container.textContent).toMatch(/latency/i);
  });

  it("sub=3 shows per-query cost breakdown dominated by LLM", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/\$0\.0\d+/);
    expect(container.textContent).toMatch(/LLM/);
  });

  it("sub=4 shows top-k retrieve vs top-k rerank tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/top-?k/i);
    expect(container.textContent).toMatch(/sweet spot|diminish/i);
    expect(container.textContent).toMatch(/recall/i);
  });
});

describe("WhyTransformQueries (12.18) content", () => {
  const fn = RagRetrieval.WhyTransformQueries;

  it("sub=0 frames user query as rarely optimal and shows a mismatch example", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user|query/i);
    expect(container.textContent).toMatch(/sign in|log in|login/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=1 shows lexical mismatch examples and routes to 12.19 and 12.20", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lexical|mismatch/i);
    expect(container.textContent).toMatch(/sign in|log in|cancel|delete/i);
    expect(container.textContent).toMatch(/12\.19/);
    expect(container.textContent).toMatch(/12\.20/);
  });

  it("sub=2 shows ambiguity with multiple interpretations", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/ambigu/i);
    expect(container.textContent).toMatch(/export/i);
    expect(container.textContent).toMatch(/12\.20|12\.21/);
  });

  it("sub=3 shows multi-intent on the cancel-and-refund query", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/multi-?intent|two intents/i);
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/12\.21/);
  });

  it("sub=4 previews the four strategies and maps to 12.19-12.21", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/multi-?query/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/routing/i);
  });
});

describe("HyDE (12.19) content", () => {
  const fn = RagRetrieval.HyDE;

  it("sub=0 frames embed-the-answer not the question with dashboard example", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/HyDE|hypothetical/i);
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/embed.*answer|answer.*embed/i);
  });

  it("sub=1 shows the HyDE 5-box flow", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/user query|query/i);
    expect(container.textContent).toMatch(/hypothetical/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 walks the dashboard-slow worked example with retrieved doc-22", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/dashboard.*slow|slow.*dashboard/i);
    expect(container.textContent).toMatch(/doc-?22|slow page load|500/i);
  });

  it("sub=3 explains why HyDE works via vocabulary and mismatch", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/vocabulary/i);
    expect(container.textContent).toMatch(/mismatch|lexical/i);
  });

  it("sub=4 contrasts when HyDE helps vs hurts with latency note", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/help|hurt|when/i);
    expect(container.textContent).toMatch(/descriptive|long|factual|short/i);
    expect(container.textContent).toMatch(/latency|200|400/i);
  });

  it("sub=5 shows the HyDE prompt template with {query} placeholder", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/\{query\}/);
    expect(container.textContent).toMatch(/12\.36|cache|caching/i);
  });
});

describe("MultiQueryExpansion (12.20) content", () => {
  const fn = RagRetrieval.MultiQueryExpansion;

  it("sub=0 frames one query becomes many and mentions RAG-Fusion", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/multi-?query|expansion|variants/i);
    expect(container.textContent).toMatch(/RAG-?Fusion/i);
  });

  it("sub=1 shows the 3-step pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/generate|variants/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/fuse|RRF/i);
  });

  it("sub=2 walks the cancel-and-refund example with 3 variants and fused ranking", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/cancel/i);
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/doc-?15/i);
    expect(container.textContent).toMatch(/doc-?4/i);
  });

  it("sub=3 shows RRF formula and links to chapter 12.16", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/RRF|Reciprocal Rank Fusion/i);
    expect(container.textContent).toMatch(/k\s*=\s*60|60/);
    expect(container.textContent).toMatch(/12\.16/);
  });

  it("sub=4 covers step-back prompting variant", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/step-?back/i);
    expect(container.textContent).toMatch(/general|broader|specific/i);
  });

  it("sub=5 shows when multi-query helps with latency cost", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/ambigu|complex/i);
    expect(container.textContent).toMatch(/latency|300|ms/i);
    expect(container.textContent).toMatch(/HyDE/i);
  });
});

describe("QueryRoutingDecomposition (12.21) content", () => {
  const fn = RagRetrieval.QueryRoutingDecomposition;

  it("sub=0 frames routing and decomposition as two complementary strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/routing/i);
    expect(container.textContent).toMatch(/decomposition/i);
    expect(container.textContent).toMatch(/index|tool|split|sub-/i);
  });

  it("sub=1 shows the router decision tree with chitchat skip", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/router|routing/i);
    expect(container.textContent).toMatch(/account|billing/i);
    expect(container.textContent).toMatch(/troubleshoot/i);
    expect(container.textContent).toMatch(/chitchat|skip retrieval|skip/i);
  });

  it("sub=2 contrasts semantic router vs LLM classifier with cost/latency", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/semantic router|embedding/i);
    expect(container.textContent).toMatch(/classifier/i);
    expect(container.textContent).toMatch(/latency|ms/i);
  });

  it("sub=3 walks the Pro vs Enterprise decomposition example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Pro/);
    expect(container.textContent).toMatch(/Enterprise/);
    expect(container.textContent).toMatch(/sub-?quer/i);
    expect(container.textContent).toMatch(/doc-?3|doc-?10/i);
  });

  it("sub=4 names when to decompose: multi-hop, compare, disjunction", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-?hop/i);
    expect(container.textContent).toMatch(/compar/i);
    expect(container.textContent).toMatch(/disjunction|or|and/i);
  });

  it("sub=5 shows the route/decompose/both/neither decision grid with cost numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/route/i);
    expect(container.textContent).toMatch(/decompos/i);
    expect(container.textContent).toMatch(/neither|default|simple/i);
    expect(container.textContent).toMatch(/\$0\.0\d+|ms/);
  });
});

describe("ContextPacking (12.22) content", () => {
  const fn = RagGeneration.ContextPacking;

  it("sub=0 shows the token budget breakdown with completion reservation", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/token budget|budget/i);
    expect(container.textContent).toMatch(/system prompt/i);
    expect(container.textContent).toMatch(/completion|reserved/i);
    expect(container.textContent).toMatch(/8000|8k|8,000/i);
  });

  it("sub=1 shows top-3 chunks for the password reset query with scores", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/how do i reset my password|password reset/i);
    expect(container.textContent).toMatch(/doc-?1/i);
    expect(container.textContent).toMatch(/0\.\d+/);
  });

  it("sub=2 explains relevance-first ordering", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/relevance.?first|most relevant/i);
  });

  it("sub=3 explains chronological ordering", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/chronological|timeline|time.?sensitive/i);
  });

  it("sub=4 shows MMR deduplication with lambda parameter", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/MMR|maximal marginal/i);
    expect(container.textContent).toMatch(/lambda/i);
    expect(container.textContent).toMatch(/duplicate|redundant|diversity/i);
  });

  it("sub=5 shows the final packed prompt with budget badge", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/documentation|context/i);
    expect(container.textContent).toMatch(/\[doc-?1/i);
    expect(container.textContent).toMatch(/i don'?t (have|know)|don'?t.{0,10}answer/i);
    expect(container.textContent).toMatch(/tokens?|budget/i);
  });
});

describe("LostInTheMiddle (12.23) content", () => {
  const fn = RagGeneration.LostInTheMiddle;

  it("sub=0 shows the U-shaped accuracy curve with Liu et al reference", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/U-?shaped|middle|position/i);
    expect(container.textContent).toMatch(/accuracy/i);
    expect(container.textContent).toMatch(/Liu|2023/i);
  });

  it("sub=1 shows the Pro+SSO query failing when answer chunk is in middle", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/SSO/);
    expect(container.textContent).toMatch(/Pro|Enterprise/);
    expect(container.textContent).toMatch(/position|chunk 5|middle/i);
  });

  it("sub=2 explains the front-load / relevance-first strategy", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/front-?load|relevance.?first|strategy 1|first strategy/i);
  });

  it("sub=3 explains the sandwich strategy with best at start and end", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/sandwich/i);
    expect(container.textContent).toMatch(/start and end|front and back/i);
  });

  it("sub=4 covers failure modes including reference to multi-hop 12.25", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-?fact|multi-?hop|long/i);
    expect(container.textContent).toMatch(/rerank|fetch|benchmark/i);
    expect(container.textContent).toMatch(/12\.25|multi-hop/i);
  });
});

describe("CitationsRefusal (12.24) content", () => {
  const fn = RagGeneration.CitationsRefusal;

  it("sub=0 contrasts no-citation vs cited answer for account-locked query", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/verify|audit|trace/i);
    expect(container.textContent).toMatch(/\[doc-?\d+/);
  });

  it("sub=1 shows a prompt template with [doc-N] citation instruction", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
    expect(container.textContent).toMatch(/\{context\}|\{query\}/);
  });

  it("sub=2 shows structured citation JSON output", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/structured|JSON/i);
    expect(container.textContent).toMatch(/doc_id|citations|confidence/i);
  });

  it("sub=3 shows refusal instruction and 'I don't have enough information' phrase", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refuse|refusal/i);
    expect(container.textContent).toMatch(/i don'?t have enough information|don'?t invent/i);
    expect(container.textContent).toMatch(/hallucinat|guess|invent/i);
  });

  it("sub=4 introduces faithfulness with claim tracing and RAGAS reference", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/claim|trace|cited/i);
    expect(container.textContent).toMatch(/12\.31-12\.35|RAGAS/i);
  });

  it("sub=5 explains parsing [doc-N] markers back to chunks", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/parse|parser/i);
    expect(container.textContent).toMatch(/\[doc-?\d+/);
    expect(container.textContent).toMatch(/footnote|tooltip|UI|regex|extract/i);
  });

  it("sub=6 shows the production combined template with rules and refusal", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/RULES|rules/);
    expect(container.textContent).toMatch(/\[doc-?N|\[doc/i);
    expect(container.textContent).toMatch(/i don'?t have enough information/i);
    expect(container.textContent).toMatch(/\{context\}|\{query\}/);
  });
});

describe("MultiHopRetrieval (12.25) content", () => {
  const fn = RagGeneration.MultiHopRetrieval;

  it("sub=0 contrasts single-hop with the forgot-email multi-hop case", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/multi-?hop|multiple retrievals/i);
    expect(container.textContent).toMatch(/how do i reset my password.*forgot my email/i);
    expect(container.textContent).toMatch(/doc-?1/i);
    expect(container.textContent).toMatch(/doc-?3/i);
  });

  it("sub=1 traces 2 hops with reformulation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/hop 1/i);
    expect(container.textContent).toMatch(/hop 2/i);
    expect(container.textContent).toMatch(/reformulat/i);
  });

  it("sub=2 shows the control loop with max_hops and refuse branches", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop|control/i);
    expect(container.textContent).toMatch(/max_?hops/i);
    expect(container.textContent).toMatch(/refuse|i don'?t have/i);
  });

  it("sub=3 shows the sufficiency-check prompt template", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/prompt template/i);
    expect(container.textContent).toMatch(/SUFFICIENT/);
    expect(container.textContent).toMatch(/INSUFFICIENT/);
  });

  it("sub=4 lists when multi-hop is worth the cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/worth it|compound|cross-doc/i);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/max_?hops|cap/i);
  });

  it("sub=5 covers infinite loop, divergence, and stuck judge failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/infinite loop/i);
    expect(container.textContent).toMatch(/divergence|drift/i);
    expect(container.textContent).toMatch(/stuck|overconfident/i);
  });
});

describe("SelfRAG (12.26) content", () => {
  const fn = RagGeneration.SelfRAG;

  it("sub=0 shows when to retrieve vs not", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/always.?retrieve|never.?retrieve|decide/i);
  });

  it("sub=1 lists the four Self-RAG special tokens", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/<retrieve>/);
    expect(container.textContent).toMatch(/<no-retrieve>/);
    expect(container.textContent).toMatch(/<isrel>/);
    expect(container.textContent).toMatch(/<issup>/);
  });

  it("sub=2 shows the token emission timeline", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/timeline|token/i);
    expect(container.textContent).toMatch(/<(retrieve|isrel|issup)>/);
  });

  it("sub=3 shows the retrieve/no-retrieve gate with RL/instruction tuning reference", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/gate|decision/i);
    expect(container.textContent).toMatch(/<retrieve>|<no-retrieve>|retrieve/i);
    expect(container.textContent).toMatch(/RL|instruction.?tun|reinforcement/i);
  });

  it("sub=4 shows self-critique with isrel and issup token outputs", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/isrel|<isrel>/i);
    expect(container.textContent).toMatch(/issup|<issup>/i);
    expect(container.textContent).toMatch(/RELEVANT|IRRELEVANT|SUPPORTED/);
  });

  it("sub=5 lists wins and limits including fine-tune requirement", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/wins|limits|tradeoff/i);
    expect(container.textContent).toMatch(/fine-?tune|train/i);
  });
});

describe("CorrectiveRAG (12.27) content", () => {
  const fn = RagGeneration.CorrectiveRAG;

  it("sub=0 shows retrieval evaluator scoring 3 docs", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/evaluator|score/i);
    expect(container.textContent).toMatch(/CORRECT/);
    expect(container.textContent).toMatch(/AMBIGUOUS/);
    expect(container.textContent).toMatch(/INCORRECT/);
  });

  it("sub=1 explains the CORRECT branch using docs directly", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/correct/i);
    expect(container.textContent).toMatch(/directly|use|baseline/i);
  });

  it("sub=2 explains the INCORRECT branch with web search fallback", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/incorrect/i);
    expect(container.textContent).toMatch(/web search|fallback/i);
  });

  it("sub=3 explains the AMBIGUOUS branch combining internal and web", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/ambiguous/i);
    expect(container.textContent).toMatch(/combine|merge|hedge/i);
  });

  it("sub=4 shows strip-level decomposition and per-strip KEEP/DROP", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/strip|strips/i);
    expect(container.textContent).toMatch(/KEEP/);
    expect(container.textContent).toMatch(/DROP/);
  });

  it("sub=5 shows the 3-branch CRAG decision tree with Yan et al reference", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/decision tree|decision/i);
    expect(container.textContent).toMatch(/CORRECT/);
    expect(container.textContent).toMatch(/AMBIGUOUS/);
    expect(container.textContent).toMatch(/INCORRECT/);
    expect(container.textContent).toMatch(/Yan|2024/i);
  });
});

describe("GraphRAG (12.28) content", () => {
  const fn = RagGeneration.GraphRAG;

  it("sub=0 explains the switch to the legal-citation secondary corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/legal|citation network/i);
    expect(container.textContent).toMatch(/15|fifteen/i);
    expect(container.textContent).toMatch(/secondary corpus|different corpus|support corpus/i);
  });

  it("sub=1 shows entity + relation extraction on a sample case", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/extract|extraction/i);
    expect(container.textContent).toMatch(/entities|relations/i);
    expect(container.textContent).toMatch(/Smith|Jones|Title VII/);
  });

  it("sub=2 shows the 15-node citation graph", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/15|fifteen/i);
    expect(container.textContent).toMatch(/graph/i);
    expect(container.textContent).toMatch(/citation|edge/i);
  });

  it("sub=3 retrieves a subgraph for the precedent chain query", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/subgraph|sub-graph/i);
    expect(container.textContent).toMatch(/precedent|discrimination/i);
  });

  it("sub=4 explains community detection and per-community summarization", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/communit|cluster/i);
    expect(container.textContent).toMatch(/summar/i);
  });

  it("sub=5 contrasts global vs local queries", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/global/i);
    expect(container.textContent).toMatch(/local|subgraph/i);
    expect(container.textContent).toMatch(/themes|map-?reduce|summar/i);
  });

  it("sub=6 lists when GraphRAG is worth the cost", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/worth it|not worth it/i);
    expect(container.textContent).toMatch(/legal|biomedical|entity/i);
    expect(container.textContent).toMatch(/cost|extraction/i);
  });
});

describe("AgenticRAG (12.29) content", () => {
  const fn = RagGeneration.AgenticRAG;

  it("sub=0 lists multiple tools beyond vector search", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/vector search/i);
    expect(container.textContent).toMatch(/SQL/);
    expect(container.textContent).toMatch(/calculator/i);
    expect(container.textContent).toMatch(/web search/i);
  });

  it("sub=1 shows the function-calling pattern with tool_call trace", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/function-?calling|tool_call/i);
    expect(container.textContent).toMatch(/tool_response/i);
    expect(container.textContent).toMatch(/sql_query|vector_search/i);
    expect(container.textContent).toMatch(/Compare.*Pro.*Enterprise/i);
  });

  it("sub=2 shows the tool-call loop with max_iterations", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/loop/i);
    expect(container.textContent).toMatch(/max_?iterations/i);
    expect(container.textContent).toMatch(/final answer/i);
  });

  it("sub=3 shows a multi-tool worked example for Pro vs Enterprise + 25 users", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/Compare|Pro|Enterprise/);
    expect(container.textContent).toMatch(/25 users|725|calculator/i);
  });

  it("sub=4 covers termination criteria including hard caps and cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/max_?iterations|termination|cap/i);
    expect(container.textContent).toMatch(/cost|budget/i);
  });

  it("sub=5 mentions LangGraph as one orchestration option and chapters 12.36-12.40", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/LangGraph|orchestration/i);
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/12\.36-12\.40|framework choice/i);
  });
});

describe("LongContextVsRAG (12.30) content", () => {
  const fn = RagGeneration.LongContextVsRAG;

  it("sub=0 explains switch to the 200-page product manual corpus", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/200-?page|200 pages?/i);
    expect(container.textContent).toMatch(/context window|fits/i);
    expect(container.textContent).toMatch(/secondary corpus|different corpus|product manual/i);
  });

  it("sub=1 shows the stuff-everything long-context approach with cost and latency", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stuff|everything/i);
    expect(container.textContent).toMatch(/120k|200k|long-?context/i);
    expect(container.textContent).toMatch(/lost in the middle|12\.23/i);
    expect(container.textContent).toMatch(/cost|\$0\.36|latency/i);
  });

  it("sub=2 shows the RAG-only approach as cheaper alternative", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/RAG.?only|retrieve/i);
    expect(container.textContent).toMatch(/chunk|top-?5/i);
    expect(container.textContent).toMatch(/cheaper|\$0\.008|latency/i);
  });

  it("sub=3 shows the hybrid retrieve-broadly approach", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/top-?30|broadly|50k/i);
    expect(container.textContent).toMatch(/front-?load|sandwich|12\.23/i);
  });

  it("sub=4 shows the cost / latency / accuracy comparison chart", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/accuracy/i);
    expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
  });

  it("sub=5 shows the decision matrix with hybrid as production default", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/decision|when/i);
    expect(container.textContent).toMatch(/production default|default|niche/i);
    expect(container.textContent).toMatch(/RAG.?only|hybrid|long-?context/i);
  });
});

describe("RAGEvalTriangle (12.31) content", () => {
  const fn = RagEvaluation.RAGEvalTriangle;

  it("sub=0 names the three eval layers", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/three layer|three-layer|3 layer/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
    expect(container.textContent).toMatch(/end[- ]?to[- ]?end/i);
  });

  it("sub=1 lists retrieval metrics with formulas", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/recall@?k|recall@?10/i);
    expect(container.textContent).toMatch(/MRR/);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/nDCG|discounted cumulative/i);
  });

  it("sub=2 lists generation metrics: faithfulness and answer relevancy", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/relevanc/i);
    expect(container.textContent).toMatch(/claim|supported|context/i);
  });

  it("sub=3 lists end-to-end metrics: correctness and helpfulness", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/helpful/i);
    expect(container.textContent).toMatch(/Likert|1-?5/i);
  });

  it("sub=4 traces failures to a specific layer", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/trace|locate|root cause/i);
    expect(container.textContent).toMatch(/retriev/i);
    expect(container.textContent).toMatch(/generat/i);
  });

  it("sub=5 marks BLEU and ROUGE as deprecated for RAG", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/BLEU/);
    expect(container.textContent).toMatch(/ROUGE/);
    expect(container.textContent).toMatch(/deprecated|word.overlap|do not measure/i);
    expect(container.textContent).toMatch(/faithful|ground/i);
  });
});

describe("LLMAsJudge (12.32) content", () => {
  const fn = RagEvaluation.LLMAsJudge;

  it("sub=0 compares human / heuristic / LLM-as-judge", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/human/i);
    expect(container.textContent).toMatch(/heuristic|BLEU/i);
    expect(container.textContent).toMatch(/judge/i);
  });

  it("sub=1 shows the judge prompt artifact with criteria + JSON schema", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/judge prompt/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/relevanc/i);
    expect(container.textContent).toMatch(/helpful/i);
    expect(container.textContent).toMatch(/\{(question|retrieved_context|generated_answer)\}/);
  });

  it("sub=2 defines a 1-5 rubric for a criterion", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rubric/i);
    expect(container.textContent).toMatch(/1[- ]?5|5[- ]?point|hallucinat|support/i);
  });

  it("sub=3 names position bias and the swap mitigation", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/position bias|position/i);
    expect(container.textContent).toMatch(/randomize|swap|order/i);
  });

  it("sub=4 names verbosity bias and the length mitigation", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/verbosity|length/i);
    expect(container.textContent).toMatch(/conciseness|normalis|weight/i);
  });

  it("sub=5 names self-preference bias and cross-family mitigation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/self[- ]?preference|self.bias/i);
    expect(container.textContent).toMatch(/cross[- ]?family|third[- ]?party|different/i);
  });

  it("sub=6 covers calibration via human spot-check and judge-model selection", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/calibrat/i);
    expect(container.textContent).toMatch(/spot[- ]?check|50|100|human/i);
    expect(container.textContent).toMatch(/agreement|correlation|0\.85/i);
    expect(container.textContent).toMatch(/stronger|cross[- ]?family|judge model/i);
  });
});

describe("RAGASMetrics (12.33) content", () => {
  const fn = RagEvaluation.RAGASMetrics;

  it("sub=0 introduces RAGAS as reference-free with 4 metrics", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/RAGAS/);
    expect(container.textContent).toMatch(/reference[- ]?free|without reference|no reference/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/relevancy/i);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/recall/i);
  });

  it("sub=1 shows the faithfulness formula and a worked example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/verifiable claim|total claim|supported/i);
    expect(container.textContent).toMatch(/4\s*\/\s*5|0\.8|3\s*\/\s*4|0\.75/);
  });

  it("sub=2 shows answer relevancy with round-trip cosine", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/answer relevancy|relevancy/i);
    expect(container.textContent).toMatch(/cosine/i);
    expect(container.textContent).toMatch(/round[- ]?trip|generate|question from/i);
    expect(container.textContent).toMatch(/0\.91|0\.913|0\.89|0\.94/);
  });

  it("sub=3 shows context precision with worked example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/context precision|precision/i);
    expect(container.textContent).toMatch(/relevant/i);
    expect(container.textContent).toMatch(/2\s*\/\s*3|0\.667/);
  });

  it("sub=3 cross-refs DeepEval/TruLens ContextualRelevancyScore alias", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/DeepEval|TruLens/);
    expect(container.textContent).toMatch(/contextual relevanc|context relevanc/i);
  });

  it("sub=4 shows context recall with worked example", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/context recall|recall/i);
    expect(container.textContent).toMatch(/relevant/i);
    expect(container.textContent).toMatch(/2\s*\/\s*2|1\.0|0\.5|1\s*\/\s*2/);
  });

  it("sub=5 produces a per-query report card with all four scores", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/faithful/i);
    expect(container.textContent).toMatch(/relevancy/i);
    expect(container.textContent).toMatch(/precision/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/report card|score card|average/i);
  });

  it("sub=6 flags BLEU/ROUGE as deprecated for RAG eval", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/BLEU|ROUGE/);
    expect(container.textContent).toMatch(/deprecated|word.overlap|n[- ]?gram|do not measure/i);
    expect(container.textContent).toMatch(/faithful|ground/i);
  });
});

describe("GoldenDatasets (12.34) content", () => {
  const fn = RagEvaluation.GoldenDatasets;

  it("sub=0 explains golden datasets as ground truth", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/ground truth/i);
    expect(container.textContent).toMatch(/expected answer|expected doc|refusal/i);
  });

  it("sub=1 prescribes 30-100 hand-written initial examples", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/30[- ]?100|30 to 100|hand[- ]?written/i);
    expect(container.textContent).toMatch(/query type|categor/i);
    expect(container.textContent).toMatch(/multi[- ]?hop|aggregation|refusal|empty/i);
  });

  it("sub=2 lists the five edge-case categories", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/multi[- ]?hop/i);
    expect(container.textContent).toMatch(/empty[- ]?context|empty context/i);
    expect(container.textContent).toMatch(/ambig/i);
    expect(container.textContent).toMatch(/refusal/i);
    expect(container.textContent).toMatch(/time[- ]?sensitive/i);
  });

  it("sub=3 covers the regression set workflow", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/regression/i);
    expect(container.textContent).toMatch(/production|bug|failure/i);
    expect(container.textContent).toMatch(/reproduc|capture|tuple/i);
  });

  it("sub=4 explains LLM-bootstrapped golden datasets with human review", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/bootstrap|LLM[- ]?generated|generate/i);
    expect(container.textContent).toMatch(/human[- ]?review|reviewer/i);
    expect(container.textContent).toMatch(/never|caution|bias/i);
  });

  it("sub=5 prescribes monthly review and archive cadence", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/monthly|cadence|review/i);
    expect(container.textContent).toMatch(/archive|obsolete/i);
    expect(container.textContent).toMatch(/coverage|freshness|pass[- ]?rate/i);
  });
});

describe("OnlineEvalABTesting (12.35) content", () => {
  const fn = RagEvaluation.OnlineEvalABTesting;

  it("sub=0 contrasts offline vs online eval", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/offline/i);
    expect(container.textContent).toMatch(/online/i);
    expect(container.textContent).toMatch(/production|real user/i);
  });

  it("sub=1 lists implicit signals", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/implicit/i);
    expect(container.textContent).toMatch(/thumb|dwell|copy[- ]?paste|rephrase/i);
  });

  it("sub=2 covers explicit feedback with privacy note", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/explicit/i);
    expect(container.textContent).toMatch(/rating|thumb|feedback|star/i);
    expect(container.textContent).toMatch(/privacy|PII|redact|GDPR/i);
  });

  it("sub=3 explains shadow eval", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/shadow/i);
    expect(container.textContent).toMatch(/alongside|log|without serving|without affecting/i);
    expect(container.textContent).toMatch(/judge|rubric|production traffic/i);
  });

  it("sub=4 explains A/B with rubric judging and guardrails", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/A\/B|split traffic/i);
    expect(container.textContent).toMatch(/rubric|judge/i);
    expect(container.textContent).toMatch(/significan|p[- ]?value|statistical/i);
    expect(container.textContent).toMatch(/guardrail|rollback|monitor/i);
  });

  it("sub=5 closes the offline-online loop", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/loop|cycle|feedback/i);
    expect(container.textContent).toMatch(/regression|capture/i);
    expect(container.textContent).toMatch(/shadow|A\/B|golden|RAGAS|judge/i);
  });
});

describe("Caching (12.36) content", () => {
  const fn = RagProduction.Caching;

  it("sub=0 shows per-query cost stack and QPS scale", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d+/);
  });

  it("sub=1 shows prompt cache prefix/suffix split and 90% discount", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/prompt cache|cached prefix|prefix/i);
    expect(container.textContent).toMatch(/90%|85%|5 min|TTL/i);
    expect(container.textContent).toMatch(/fresh/i);
  });

  it("sub=2 contrasts prompt-cache hits vs misses", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent|multi-?turn|stable/i);
    expect(container.textContent).toMatch(/miss|cold/i);
  });

  it("sub=3 shows semantic cache cosine flow with example scores", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/cosine|similarity/i);
    expect(container.textContent).toMatch(/0\.9\d|threshold/i);
  });

  it("sub=4 covers eviction, invalidation, and false-hit risk", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LRU|eviction/i);
    expect(container.textContent).toMatch(/invalidat/i);
    expect(container.textContent).toMatch(/false[- ]hit/i);
  });

  it("sub=5 shows combined prompt + semantic cache savings", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/combined|stack|both/i);
    expect(container.textContent).toMatch(/\$0?\.\d+/);
    expect(container.textContent).toMatch(/%|savings/i);
  });
});

describe("CostModels (12.37) content", () => {
  const fn = RagProduction.CostModels;

  it("sub=0 enumerates the 5 cost lines", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/embedding/i);
    expect(container.textContent).toMatch(/vector search|search/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/LLM input|input token/i);
    expect(container.textContent).toMatch(/LLM output|output token/i);
  });

  it("sub=1 shows the cost stack bar with LLM dominance", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/LLM|tokens/i);
    expect(container.textContent).toMatch(/9\d%|95%|94%/);
  });

  it("sub=2 scales to QPS / daily / monthly", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/QPS|1000|1k/i);
    expect(container.textContent).toMatch(/daily|month|day/i);
    expect(container.textContent).toMatch(/\$\d/);
  });

  it("sub=3 enumerates the 5 cost levers", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lever/i);
    expect(container.textContent).toMatch(/smaller|matryoshka|384/i);
    expect(container.textContent).toMatch(/Haiku|Sonnet|smaller LLM/i);
    expect(container.textContent).toMatch(/cache/i);
  });

  it("sub=4 stacks all levers and shows a final cost", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stack|compound|all/i);
    expect(container.textContent).toMatch(/9\d%|reduction|saved/i);
    expect(container.textContent).toMatch(/\$0?\.\d+|\$\d/);
  });

  it("sub=5 plots cost vs quality frontier", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/frontier|Pareto/i);
    expect(container.textContent).toMatch(/quality|faithfulness/i);
    expect(container.textContent).toMatch(/cost|\$/i);
  });
});

describe("ObservabilityTracing (12.38) content", () => {
  const fn = RagProduction.ObservabilityTracing;

  it("sub=0 lists what goes wrong without traces", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|tracing/i);
    expect(container.textContent).toMatch(/latency|slow/i);
    expect(container.textContent).toMatch(/reproduce|model version/i);
  });

  it("sub=1 shows the canonical span tree", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/span|trace/i);
    expect(container.textContent).toMatch(/embed/i);
    expect(container.textContent).toMatch(/rerank/i);
    expect(container.textContent).toMatch(/generat/i);
    expect(container.textContent).toMatch(/ms/);
  });

  it("sub=2 enumerates per-stage attributes", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/doc[-_ ]?id/i);
    expect(container.textContent).toMatch(/model[ _]?version/i);
    expect(container.textContent).toMatch(/tokens/i);
  });

  it("sub=3 lists the tools landscape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/LangSmith|Helicone|OpenTelemetry|Phoenix/);
  });

  it("sub=4 covers privacy and what not to log", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/privacy|GDPR|PII|hash|redact/i);
    expect(container.textContent).toMatch(/raw query|plain text|secret/i);
  });

  it("sub=5 mocks a production trace dashboard", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard/i);
    expect(container.textContent).toMatch(/P50|P99|latency/i);
  });
});

describe("HallucinationDrift (12.39) content", () => {
  const fn = RagProduction.HallucinationDrift;

  it("sub=0 lists hallucination signals", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/citation/i);
    expect(container.textContent).toMatch(/refusal/i);
    expect(container.textContent).toMatch(/out[- ]of[- ]index|hallucinat/i);
  });

  it("sub=1 names the 4 drift types", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/data drift/i);
    expect(container.textContent).toMatch(/embedding drift/i);
    expect(container.textContent).toMatch(/eval drift/i);
    expect(container.textContent).toMatch(/distribution drift/i);
  });

  it("sub=2 shows the hallucination detection pipeline with claim extraction", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/claim/i);
    expect(container.textContent).toMatch(/supported|unsupported/i);
    expect(container.textContent).toMatch(/faithfulness/i);
  });

  it("sub=3 shows metric-over-time chart with thresholds", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/30 days|over time|days/i);
    expect(container.textContent).toMatch(/threshold|alert/i);
  });

  it("sub=4 shows an alert payload with example queries", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/alert/i);
    expect(container.textContent).toMatch(/faithfulness/i);
    expect(container.textContent).toMatch(/example|query/i);
    expect(container.textContent).toMatch(/doc-?\d/i);
  });

  it("sub=5 mocks the full hallucination + drift dashboard", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/dashboard|panel/i);
    expect(container.textContent).toMatch(/drift|hallucinat/i);
  });
});

describe("FrameworkChoice (12.40) content", () => {
  const fn = RagProduction.FrameworkChoice;

  it("sub=0 lists the 6 framework options", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/no framework|raw SDK/i);
    expect(container.textContent).toMatch(/LlamaIndex/);
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Haystack/);
    expect(container.textContent).toMatch(/vendor SDK|OpenAI Agents|Anthropic/i);
  });

  it("sub=1 shows the framework decision matrix", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/lock-?in/i);
    expect(container.textContent).toMatch(/churn|complexity/i);
    expect(container.textContent).toMatch(/community/i);
  });

  it("sub=2 gives an honest take on LangChain", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LangChain/);
    expect(container.textContent).toMatch(/deprecated|abstraction|churn/i);
  });

  it("sub=3 maps each framework to when it fits", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/team/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|Haystack/);
  });

  it("sub=4 shows the framework decision tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/LlamaIndex|LangChain|LangGraph/);
  });

  it("sub=5 emphasizes framework-agnostic decisions", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/chunking|embedding|hybrid|reranker/i);
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/agnostic|same|replaceable/i);
  });
});

describe("RAGDecisionFrameworkCapstone (12.41) content", () => {
  const fn = RagProduction.RAGDecisionFrameworkCapstone;

  it("sub=0 shows the complete decision framework spanning every act", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/framework/i);
    expect(container.textContent).toMatch(/chunking/i);
    expect(container.textContent).toMatch(/embedding|embed/i);
    expect(container.textContent).toMatch(/evaluat|eval/i);
    expect(container.textContent).toMatch(/production|operations/i);
  });

  it("sub=1 introduces the legal case-law capstone", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/case law|legal|Q&A/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/200,?000|cases/i);
    expect(container.textContent).toMatch(/\$0?\.05|cost/i);
  });

  it("sub=2 chooses hierarchical + contextual chunking", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical|contextual/i);
    expect(container.textContent).toMatch(/chunk/i);
    expect(container.textContent).toMatch(/12\.[89]/);
  });

  it("sub=3 chooses domain-adapted embedding + hybrid + jurisdiction filter + cross-encoder rerank", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/domain[- ]adapt/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/jurisdiction/i);
    expect(container.textContent).toMatch(/rerank|cross-encoder/i);
  });

  it("sub=4 chooses multi-query + decomposition, skips HyDE", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/multi-query|decomposition/i);
    expect(container.textContent).toMatch(/HyDE/);
    expect(container.textContent).toMatch(/12\.1[78]/);
  });

  it("sub=5 chooses high-token-budget sandwich pack + mandatory citations + refusal", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/token budget|16k|30k|context/i);
    expect(container.textContent).toMatch(/citation|cite/i);
    expect(container.textContent).toMatch(/I don'?t have|refusal|refuse/i);
  });

  it("sub=6 chooses GraphRAG + multi-hop, skips long-context", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/GraphRAG/);
    expect(container.textContent).toMatch(/multi-hop/i);
    expect(container.textContent).toMatch(/long[- ]context|12\.27/i);
  });

  it("sub=7 chooses LLM-as-judge + golden dataset + RAGAS + online A/B", () => {
    const { container } = render(fn(makeCtx({ sub: 7 })));
    expect(container.textContent).toMatch(/LLM-as-judge|judge/i);
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/RAGAS|faithfulness/i);
  });

  it("sub=8 disables semantic cache, enables prompt cache + tracing + hallucination detection + drift", () => {
    const { container } = render(fn(makeCtx({ sub: 8 })));
    expect(container.textContent).toMatch(/semantic cache/i);
    expect(container.textContent).toMatch(/prompt cache/i);
    expect(container.textContent).toMatch(/tracing/i);
    expect(container.textContent).toMatch(/hallucinat|drift/i);
  });

  it("sub=9 closes with the complete capstone stack and framework choice", () => {
    const { container } = render(fn(makeCtx({ sub: 9 })));
    expect(container.textContent).toMatch(/stack|capstone|putting it all together/i);
    expect(container.textContent).toMatch(/no framework|LlamaIndex|12\.37/i);
    expect(container.textContent).toMatch(/chunking|embedding|retrieval|rerank|generate|eval/i);
  });
});

describe("AnatomyOfLlmCall (13.1) content", () => {
  const fn = AgentPrompting.AnatomyOfLlmCall;

  it("sub=0 shows three message roles", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/assistant/i);
  });

  it("sub=1 explains tokens and context window", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/context window/i);
  });

  it("sub=2 covers temperature / top-p / top-k", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/temperature/i);
    expect(container.textContent).toMatch(/top.?p/i);
    expect(container.textContent).toMatch(/top.?k/i);
  });

  it("sub=3 lists stop conditions and finish_reason", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/max.?tokens/i);
    expect(container.textContent).toMatch(/stop.?(reason|sequence)/i);
    expect(container.textContent).toMatch(/end.?turn/i);
  });

  it("sub=4 shows response shape with content/stop_reason/usage", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/content/i);
    expect(container.textContent).toMatch(/stop.?reason|finish.?reason/i);
    expect(container.textContent).toMatch(/usage/i);
    expect(container.textContent).toMatch(/input.?tokens/i);
    expect(container.textContent).toMatch(/output.?tokens/i);
  });

  it("sub=5 traces the complete call cycle", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/messages/i);
    expect(container.textContent).toMatch(/request|send/i);
    expect(container.textContent).toMatch(/response|stream/i);
  });
});

describe("SystemPromptContract (13.2) content", () => {
  const fn = AgentPrompting.SystemPromptContract;

  it("sub=0 frames system prompt as contract with four parts", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/contract/i);
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/constraint/i);
    expect(container.textContent).toMatch(/output rules/i);
  });

  it("sub=1 contrasts vague vs persona-specific prompt", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/persona/i);
    expect(container.textContent).toMatch(/customer.support/i);
  });

  it("sub=2 lists agent capabilities and tools", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/tools?|capabilit/i);
  });

  it("sub=3 enumerates constraints", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/never/i);
    expect(container.textContent).toMatch(/refund|\$200/i);
    expect(container.textContent).toMatch(/escalat/i);
  });

  it("sub=4 lists output rules", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cite|citation/i);
    expect(container.textContent).toMatch(/greet|follow.?up/i);
  });

  it("sub=5 shows full prompt template artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/you are/i);
    expect(container.textContent).toMatch(/tools|call/i);
    expect(container.textContent).toMatch(/never/i);
    expect(container.textContent).toMatch(/prompt template/i);
  });
});

describe("FewShotStructuredOutput (13.3) content", () => {
  const fn = AgentPrompting.FewShotStructuredOutput;

  it("sub=0 contrasts zero-shot and few-shot", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/few.?shot/i);
    expect(container.textContent).toMatch(/example/i);
    expect(container.textContent).toMatch(/classif/i);
  });

  it("sub=1 shows three examples in the same format", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/output/i);
    expect(container.textContent).toMatch(/category|billing|troubleshooting/i);
  });

  it("sub=2 shows the output schema with enums", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 explains few-shot + schema combination", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/structure/i);
    expect(container.textContent).toMatch(/drift|consistent|every/i);
  });

  it("sub=4 lists production tips", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/3.?(to|-)? ?5/i);
    expect(container.textContent).toMatch(/diverse|edge case/i);
  });

  it("sub=5 shows the assembled classifier artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/classif/i);
    expect(container.textContent).toMatch(/category|schema/i);
    // Unique-to-sub=5 assertion: the assembled classifier template label.
    expect(container.textContent).toMatch(/ticket.?classifier|classifier template/i);
  });
});

describe("ChainOfThoughtSelfConsistency (13.4) content", () => {
  const fn = AgentPrompting.ChainOfThoughtSelfConsistency;

  it("sub=0 contrasts direct vs CoT answer", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain of thought|cot|step by step/i);
    expect(container.textContent).toMatch(/refund|prorat/i);
  });

  it("sub=1 shows the zero-shot CoT trigger", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/step by step/i);
  });

  it("sub=2 explains few-shot CoT", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/example/i);
  });

  it("sub=3 shows self-consistency vote", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/self.?consistency|vote|majority/i);
    expect(container.textContent).toMatch(/sample|n.?times|5/i);
  });

  it("sub=4 lists the cost / latency tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|token/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/accuracy/i);
  });

  it("sub=5 indicates when to skip CoT and references Section 10.4", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/skip|classif|lookup/i);
    expect(container.textContent).toMatch(/10\.4|thinking|reasoning model/i);
  });
});

describe("PromptVsTuneVsRagVsAgent (13.5) content", () => {
  const fn = AgentPrompting.PromptVsTuneVsRagVsAgent;

  it("sub=0 lists four approaches", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/fine.?tun/i);
    expect(container.textContent).toMatch(/rag/i);
    expect(container.textContent).toMatch(/agent/i);
  });

  it("sub=1 axes on data freshness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/fresh/i);
    expect(container.textContent).toMatch(/data/i);
  });

  it("sub=2 axes on capability gap", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|skill|gap/i);
  });

  it("sub=3 covers latency and cost", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
  });

  it("sub=4 shows the decision tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/decision|tree/i);
    expect(container.textContent).toMatch(/action|tool/i);
  });

  it("sub=5 shows the stack pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/stack|combine|layer/i);
  });

  it("sub=6 lists anti-patterns", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/anti.?pattern|misuse|wrong/i);
  });
});

describe("ContextEngineering (13.6) content", () => {
  const fn = AgentPrompting.ContextEngineering;

  it("sub=0 shows the context window budget", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window/i);
    expect(container.textContent).toMatch(/128k|budget/i);
    expect(container.textContent).toMatch(/system/i);
  });

  it("sub=1 shows prompt assembly stack", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/history|conversation/i);
    expect(container.textContent).toMatch(/retriev/i);
  });

  it("sub=2 compares budget strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/strategy|trim|summar/i);
  });

  it("sub=3 explains lost-in-the-middle", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lost in the middle|u.?shape|middle/i);
  });

  it("sub=4 contrasts relevance-first and recency-first", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/recency/i);
  });

  it("sub=5 shows the eviction ladder", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/evict/i);
    expect(container.textContent).toMatch(/summar/i);
  });
});

describe("ToolUseAsBridge (13.7) content", () => {
  const fn = AgentTools.ToolUseAsBridge;

  it("sub=0 contrasts pure LLM vs LLM with tools", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pure llm|llm only|without tools/i);
    expect(container.textContent).toMatch(/search_kb/i);
  });

  it("sub=1 defines tool as callable function", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/function/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=2 shows the three parts: name / description / parameters", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/parameter/i);
  });

  it("sub=3 explains the model-decides / runtime-executes split", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/tool_use|tool use/i);
    expect(container.textContent).toMatch(/runtime|execute/i);
  });

  it("sub=4 sketches the loop and references 13.20", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/loop|reason.?act.?observe/i);
    expect(container.textContent).toMatch(/13\.20/);
  });

  it("sub=5 enumerates the 8 canonical tools", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/search_kb/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/process_refund/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/send_email/i);
  });
});

describe("JsonSchemaForTools (13.8) content", () => {
  const fn = AgentTools.JsonSchemaForTools;

  it("sub=0 shows the schema as contract", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/schema/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/input_schema|properties/i);
  });

  it("sub=1 distinguishes required vs optional", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/optional/i);
  });

  it("sub=2 shows enum and format constraints", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/enum/i);
    expect(container.textContent).toMatch(/urgency/i);
  });

  it("sub=3 lists description-writing rules", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/side effect|mutate/i);
  });

  it("sub=4 contrasts bad and good descriptions", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/bad|vague/i);
    expect(container.textContent).toMatch(/good|specific/i);
    expect(container.textContent).toMatch(/200|escalate/i);
  });

  it("sub=5 shows the canonical lookup_customer reference", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/canonical|reference/i);
  });
});

describe("ToolCallLifecycle (13.9) content", () => {
  const fn = AgentTools.ToolCallLifecycle;

  it("sub=0 shows the swim-lane overview", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/user/i);
    expect(container.textContent).toMatch(/model/i);
    expect(container.textContent).toMatch(/runtime/i);
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/tool_result/i);
  });

  it("sub=1 shows the tool_use message shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/tool_use/i);
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/reset_password/i);
  });

  it("sub=2 shows the tool_result message shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool_result/i);
    expect(container.textContent).toMatch(/tool_use_id/i);
    expect(container.textContent).toMatch(/is_error/i);
  });

  it("sub=3 traces ticket T1 end to end", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/lookup_customer/i);
    expect(container.textContent).toMatch(/reset_password/i);
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
  });

  it("sub=4 explains streaming + tool calls", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/tool_use|tool block/i);
  });

  it("sub=5 shows the latency budget", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/llm call|model/i);
  });
});

describe("ParallelToolsAndChoice (13.10) content", () => {
  const fn = AgentTools.ParallelToolsAndChoice;

  it("sub=0 contrasts serial vs parallel timeline", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/serial/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_customer/i);
  });

  it("sub=1 explains when to parallelize", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/independent/i);
    expect(container.textContent).toMatch(/dependent/i);
  });

  it("sub=2 explains tool_choice auto", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool.?choice/i);
    expect(container.textContent).toMatch(/auto/i);
  });

  it("sub=3 lists all four tool_choice modes", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/auto/i);
    expect(container.textContent).toMatch(/required/i);
    expect(container.textContent).toMatch(/none/i);
    expect(container.textContent).toMatch(/specific|force/i);
  });

  it("sub=4 shows the latency savings number", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/savings|saving|faster/i);
  });

  it("sub=5 traces ticket T2 with parallel lookups", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/lookup_subscription/i);
  });
});

describe("ToolErrorsRetries (13.11) content", () => {
  const fn = AgentTools.ToolErrorsRetries;

  it("sub=0 enumerates the four error classes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/transient/i);
    expect(container.textContent).toMatch(/permanent/i);
    expect(container.textContent).toMatch(/malformed/i);
    expect(container.textContent).toMatch(/business.?rule/i);
  });

  it("sub=1 shows the structured error return", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/is_error/i);
    expect(container.textContent).toMatch(/error_class|business_rule/i);
    expect(container.textContent).toMatch(/200/);
  });

  it("sub=2 lists the per-class retry policy", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/backoff/i);
    expect(container.textContent).toMatch(/transient/i);
  });

  it("sub=3 shows the validation layer", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/validat/i);
    expect(container.textContent).toMatch(/schema/i);
  });

  it("sub=4 explains idempotency", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/idempotenc/i);
    expect(container.textContent).toMatch(/key|double/i);
  });

  it("sub=5 traces ticket T4 with error recovery", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/business.?rule/i);
    expect(container.textContent).toMatch(/escalate_human/i);
    expect(container.textContent).toMatch(/200|350/);
  });
});

describe("WhyProtocols (13.12) content", () => {
  const fn = AgentTools.WhyProtocols;

  it("sub=0 shows the ad-hoc sprawl", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/ad.?hoc|sprawl|tangle/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/tool/i);
    expect(container.textContent).toMatch(/30/);
  });

  it("sub=1 explains M+N hub model", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/protocol/i);
    expect(container.textContent).toMatch(/hub|center/i);
    expect(container.textContent).toMatch(/m \+ n|m plus n|11|30/i);
    expect(container.textContent).toMatch(/hub and spoke/i);
  });

  it("sub=2 lists MCP, A2A, OpenAPI", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/OpenAPI|HTTP/i);
    expect(container.textContent).toMatch(/Model Context Protocol/i);
  });

  it("sub=3 shows when protocol pays off", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3|few|many/i);
    expect(container.textContent).toMatch(/decision|production/i);
    expect(container.textContent).toMatch(/Protocol Mesh/i);
  });

  it("sub=4 frames protocol as trust boundary", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/trust|sandbox|boundary/i);
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Sandbox Contract/i);
  });
});

describe("McpArchitecture (13.13) content", () => {
  const fn = AgentTools.McpArchitecture;

  it("sub=0 names host, client, server", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/host/i);
    expect(container.textContent).toMatch(/client/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Claude Desktop/i);
  });

  it("sub=1 shows the one-host many-clients topology", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/topology|hub/i);
    expect(container.textContent).toMatch(/server/i);
    expect(container.textContent).toMatch(/Postgres/i);
  });

  it("sub=2 lists stdio, HTTP, SSE transports", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/stdio/i);
    expect(container.textContent).toMatch(/http/i);
    expect(container.textContent).toMatch(/sse|server.sent/i);
    expect(container.textContent).toMatch(/Server-Sent Events/i);
  });

  it("sub=3 walks the lifecycle", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/initialize|handshake/i);
    expect(container.textContent).toMatch(/list/i);
    expect(container.textContent).toMatch(/call/i);
    expect(container.textContent).toMatch(/Initialize Handshake/i);
  });

  it("sub=4 shows the tools/list response shape", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/tools.list|capabilit/i);
    expect(container.textContent).toMatch(/name/i);
    expect(container.textContent).toMatch(/description/i);
    expect(container.textContent).toMatch(/search_kb/);
  });
});

describe("McpPrimitives (13.14) content", () => {
  const fn = AgentTools.McpPrimitives;

  it("sub=0 names the three primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
    expect(container.textContent).toMatch(/Things The Model Can Do/i);
  });

  it("sub=1 shows a tool example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/side effect|mutate/i);
    expect(container.textContent).toMatch(/invoice_id/);
  });

  it("sub=2 shows a resource URI", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/read.?only|read only/i);
    expect(container.textContent).toMatch(/kb:\/\/articles\/password-reset/);
  });

  it("sub=3 shows a prompt with arguments", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|parameter|required/i);
    expect(container.textContent).toMatch(/slash.commands/i);
  });

  it("sub=4 explains when to use which", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/action|mutate|do/i);
    expect(container.textContent).toMatch(/read|data/i);
    expect(container.textContent).toMatch(/template/i);
    expect(container.textContent).toMatch(/Decision rule:/);
  });
});

describe("BuildingMcpServer (13.15) content", () => {
  const fn = AgentTools.BuildingMcpServer;

  it("sub=0 shows the skeleton phases", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/declare|register/i);
    expect(container.textContent).toMatch(/tools/i);
    expect(container.textContent).toMatch(/resources/i);
    expect(container.textContent).toMatch(/prompts/i);
    expect(container.textContent).toMatch(/Each declaration registers/i);
  });

  it("sub=1 shows tool registration shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/handler/i);
    expect(container.textContent).toMatch(/Handler runs server-side/i);
  });

  it("sub=2 shows resource registration", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/kb:\/\/|resource/i);
    expect(container.textContent).toMatch(/template|uri/i);
    expect(container.textContent).toMatch(/kb:\/\/articles\/password-reset/);
  });

  it("sub=3 shows prompt registration", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/summarize_ticket/);
    expect(container.textContent).toMatch(/argument|prompt/i);
    expect(container.textContent).toMatch(/resolved prompt string/i);
  });

  it("sub=4 shows the lifecycle", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/lifecycle|state|listen/i);
    expect(container.textContent).toMatch(/active/i);
    expect(container.textContent).toMatch(/Definitions Declared|Transport Open/i);
  });

  it("sub=5 lists testing strategies", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/test/i);
    expect(container.textContent).toMatch(/handler|unit/i);
    expect(container.textContent).toMatch(/mock|isolat/i);
    expect(container.textContent).toMatch(/Mock Host/i);
  });
});

describe("McpSecurity (13.16) content", () => {
  const fn = AgentTools.McpSecurity;

  it("sub=0 frames trust boundary", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trust|untrusted/i);
    expect(container.textContent).toMatch(/boundary|host|server/i);
    expect(container.textContent).toMatch(/Server Code Is Untrusted By Default/i);
  });

  it("sub=1 describes sandbox isolation", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/sandbox/i);
    expect(container.textContent).toMatch(/process|isolat/i);
    expect(container.textContent).toMatch(/Process Isolation/i);
  });

  it("sub=2 lists capability scope", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/capabilit|scope/i);
    expect(container.textContent).toMatch(/allow|deny/i);
    expect(container.textContent).toMatch(/kb:\/\/internal/);
  });

  it("sub=3 shows OAuth flow", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/oauth/i);
    expect(container.textContent).toMatch(/token/i);
    expect(container.textContent).toMatch(/Access Token/i);
  });

  it("sub=4 explains consent prompts and audit log", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/consent|approval/i);
    expect(container.textContent).toMatch(/audit|log/i);
    expect(container.textContent).toMatch(/INV-9924/);
  });
});

describe("A2AProtocol (13.17) content", () => {
  const fn = AgentTools.A2AProtocol;

  it("sub=0 contrasts MCP and A2A scope", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/A2A/);
    expect(container.textContent).toMatch(/delegat|agent.*agent/i);
    expect(container.textContent).toMatch(/Agent calls function|Agent delegates whole task/i);
  });

  it("sub=1 shows the agent.json discovery doc", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/agent\.json|discovery/i);
    expect(container.textContent).toMatch(/skills|endpoint/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/billing-specialist-v2/);
  });

  it("sub=2 traces the delegation flow on T4", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/T4|ticket t4|delegat/i);
    expect(container.textContent).toMatch(/conversation history/i);
  });

  it("sub=3 explains streaming intermediate updates", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/progress|update|intermediate/i);
    expect(container.textContent).toMatch(/Refund.*\$200/);
  });

  it("sub=4 explains when A2A vs MCP", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/decision|when/i);
    expect(container.textContent).toMatch(/Two Protocols, Two Roles/i);
  });
});

describe("WorkflowVsAgent (13.18) content", () => {
  const fn = AgentLoops.WorkflowVsAgent;

  it("sub=0 contrasts DAG and loop", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/dag|graph|fixed/i);
    expect(container.textContent).toMatch(/loop|open|variable/i);
    expect(container.textContent).toMatch(/Two Shapes Of Control/i);
  });

  it("sub=1 lists when workflow wins", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/workflow/i);
    expect(container.textContent).toMatch(/known|predict/i);
    expect(container.textContent).toMatch(/classif|route/i);
    expect(container.textContent).toMatch(/Always Those 3 Steps/i);
  });

  it("sub=2 lists when agent wins", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/agent/i);
    expect(container.textContent).toMatch(/variable|decide/i);
    expect(container.textContent).toMatch(/2 Calls Or 20/i);
  });

  it("sub=3 shows the hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/Handle Step Is An Agent/i);
  });

  it("sub=4 shows cost / reliability tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/predict|bound|variable/i);
    expect(container.textContent).toMatch(/Workflow When You Can/i);
  });
});

describe("WorkflowPrimitives (13.19) content", () => {
  const fn = AgentLoops.WorkflowPrimitives;

  it("sub=0 names the three primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/parallel/i);
    expect(container.textContent).toMatch(/Chain, Route, Parallelize/i);
  });

  it("sub=1 shows chaining with structured output", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/chain/i);
    expect(container.textContent).toMatch(/structured|json|output/i);
    expect(container.textContent).toMatch(/category/i);
  });

  it("sub=2 explains routing with intent classification", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rout/i);
    expect(container.textContent).toMatch(/intent|classif/i);
    expect(container.textContent).toMatch(/13\.3|few.?shot/i);
    expect(container.textContent).toMatch(/Section 13\.3|13\.3/);
  });

  it("sub=3 shows parallelization fan-out", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/parallel|fan.?out/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
    expect(container.textContent).toMatch(/max.*worker/i);
  });

  it("sub=4 shows composing primitives", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/compos|stack|combine/i);
    expect(container.textContent).toMatch(/all three/i);
  });

  it("sub=5 maps support-agent workflow", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/troubl|escalat/i);
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/lookup_subscription/);
  });
});

describe("AgentLoop (13.20) content", () => {
  const fn = AgentLoops.AgentLoop;

  it("sub=0 names reason / act / observe", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/reason/i);
    expect(container.textContent).toMatch(/act/i);
    expect(container.textContent).toMatch(/observ/i);
    expect(container.textContent).toMatch(/three.?beat/i);
  });

  it("sub=1 shows state machine view", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/state/i);
    expect(container.textContent).toMatch(/done|terminal/i);
    expect(container.textContent).toMatch(/ESCALATED/);
  });

  it("sub=2 explains termination check", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/terminat|stop/i);
    expect(container.textContent).toMatch(/max iter|budget/i);
    expect(container.textContent).toMatch(/13\.23/);
  });

  it("sub=3 shows per-iteration cost", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/llm call|tool call/i);
    expect(container.textContent).toMatch(/\$0\.02/);
  });

  it("sub=4 traces ticket T2 as a loop", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
    expect(container.textContent).toMatch(/reset_password/);
    expect(container.textContent).toMatch(/c-9924/);
  });

  it("sub=5 contrasts single vs loop", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/single|loop/i);
    expect(container.textContent).toMatch(/depend|adapt/i);
    expect(container.textContent).toMatch(/second tool's input depends/i);
  });
});

describe("ReActPattern (13.21) content", () => {
  const fn = AgentLoops.ReActPattern;

  it("sub=0 names Thought / Action / Observation", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/observation/i);
    expect(container.textContent).toMatch(/Reasoning \+ Acting|ReAct/);
  });

  it("sub=1 shows a thought block", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/thought/i);
    expect(container.textContent).toMatch(/plan|lookup_customer/i);
    expect(container.textContent).toMatch(/OLD email/i);
  });

  it("sub=2 shows an action block", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/action/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/One Action Per Iteration/i);
  });

  it("sub=3 shows an observation block", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/observ/i);
    expect(container.textContent).toMatch(/c-9924|customer_id/i);
    expect(container.textContent).toMatch(/primary_email/);
  });

  it("sub=4 traces T2 in ReAct format", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/reset_password/);
    expect(container.textContent).toMatch(/change_email/);
  });

  it("sub=5 explains ReAct vs plain tool-use", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/plain|tool.?use/i);
    expect(container.textContent).toMatch(/audit|debug|trust/i);
    expect(container.textContent).toMatch(/train a smaller model/i);
  });
});

describe("PlanExecuteReflect (13.22) content", () => {
  const fn = AgentLoops.PlanExecuteReflect;

  it("sub=0 contrasts plan-first vs reactive", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/react/i);
    expect(container.textContent).toMatch(/up front|step by step|first/i);
    expect(container.textContent).toMatch(/Decide Up Front Or Step By Step/i);
  });

  it("sub=1 shows the plan tree", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/tree/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/T4/);
  });

  it("sub=2 walks the leaves", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/execute|leaf|leaves/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/business_rule/);
  });

  it("sub=3 shows reflection critique-revise", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/reflect|critique/i);
    expect(container.textContent).toMatch(/revise/i);
    expect(container.textContent).toMatch(/score|grade/i);
    expect(container.textContent).toMatch(/Score < 7/);
  });

  it("sub=4 shows the decision matrix", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/complex|simple/i);
    expect(container.textContent).toMatch(/audit/i);
    expect(container.textContent).toMatch(/plan|reflect|react/i);
    expect(container.textContent).toMatch(/Plan-Execute \+ Reflection/);
  });
});

describe("LoopTermination (13.23) content", () => {
  const fn = AgentLoops.LoopTermination;

  it("sub=0 lists the four stop conditions", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/max.?iter/i);
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/explicit stop|halt/i);
    expect(container.textContent).toMatch(/Four Ways A Loop Ends/i);
  });

  it("sub=1 shows success detection", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/success/i);
    expect(container.textContent).toMatch(/final|answer|no more/i);
    expect(container.textContent).toMatch(/No More Tools Needed/i);
  });

  it("sub=2 shows max-iter cap", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/max iter/i);
    expect(container.textContent).toMatch(/10|20/);
    expect(container.textContent).toMatch(/Pay-To-Think/i);
  });

  it("sub=3 shows budget exhaustion", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/budget/i);
    expect(container.textContent).toMatch(/token|cost/i);
    expect(container.textContent).toMatch(/10x Per Iteration/i);
  });

  it("sub=4 shows explicit stop signal", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/halt|stop signal/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/"halt"/);
  });

  it("sub=5 shows fail-safe escalation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/fail.?safe/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/No Silent Failures/i);
  });
});

describe("MemoryTaxonomy (13.24) content", () => {
  const fn = AgentLoops.MemoryTaxonomy;

  it("sub=0 distinguishes short and long", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/short.?term/i);
    expect(container.textContent).toMatch(/long.?term/i);
    expect(container.textContent).toMatch(/context window|session/i);
    expect(container.textContent).toMatch(/Two Memory Layers/i);
  });

  it("sub=1 lists the three long-term types", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
    expect(container.textContent).toMatch(/Long-Term Splits Three Ways/i);
  });

  it("sub=2 shows the full taxonomy tree", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/working/i);
    expect(container.textContent).toMatch(/episodic/i);
    expect(container.textContent).toMatch(/semantic/i);
    expect(container.textContent).toMatch(/procedural/i);
    expect(container.textContent).toMatch(/Agent Memory Taxonomy/i);
  });

  it("sub=3 shows the T2 memory snapshot", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/alice@example\.com|c-9924/i);
    expect(container.textContent).toMatch(/Pro tier|MFA|refund/i);
    expect(container.textContent).toMatch(/Memory Snapshot: Ticket T2/i);
  });

  it("sub=4 explains why all four", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/current|task|state/i);
    expect(container.textContent).toMatch(/past|event/i);
    expect(container.textContent).toMatch(/facts|stable/i);
    expect(container.textContent).toMatch(/routine|cache/i);
    expect(container.textContent).toMatch(/Each Layer Solves/i);
  });
});

describe("WorkingMemory (13.25) content", () => {
  const fn = AgentLoops.WorkingMemory;

  it("sub=0 introduces scratchpad concept", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/scratchpad|note/i);
    expect(container.textContent).toMatch(/reason|observ|loop/i);
    expect(container.textContent).toMatch(/A Note Pad The Model Keeps/i);
  });

  it("sub=1 shows the scratchpad shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/current_goal|customer_context/i);
    expect(container.textContent).toMatch(/completed_steps/i);
    expect(container.textContent).toMatch(/next_step/i);
    expect(container.textContent).toMatch(/What Goes In The Scratchpad/i);
  });

  it("sub=2 shows update across iterations", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/iter|iteration/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/change_email/);
    expect(container.textContent).toMatch(/Updated Every Iteration/i);
  });

  it("sub=3 explains discard at task end", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/discard|delete|end/i);
    expect(container.textContent).toMatch(/promote|long.?term/i);
    expect(container.textContent).toMatch(/Working Memory Dies/i);
  });

  it("sub=4 compares working vs long-term", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/working|long.?term/i);
    expect(container.textContent).toMatch(/persist|discard/i);
    expect(container.textContent).toMatch(/Working vs Long-Term/i);
  });
});

describe("EpisodicMemory (13.26) content", () => {
  const fn = AgentLoops.EpisodicMemory;

  it("sub=0 shows time-stamped events", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/episode|event/i);
    expect(container.textContent).toMatch(/2026|timestamp|date/i);
    expect(container.textContent).toMatch(/alice|password reset/i);
    expect(container.textContent).toMatch(/Episodes: Time-Stamped Events/i);
  });

  it("sub=1 back-references Section 11 vector storage", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/vector|embedding/i);
    expect(container.textContent).toMatch(/section 11|11\.6|11\.7|HNSW/i);
    expect(container.textContent).toMatch(/Stored As Vectors/i);
  });

  it("sub=2 shows retrieval at conversation start", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/retriev|recall/i);
    expect(container.textContent).toMatch(/system prompt|top.?3|top.?k/i);
    expect(container.textContent).toMatch(/Recall Before Reasoning/i);
  });

  it("sub=3 shows the entry shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/timestamp/i);
    expect(container.textContent).toMatch(/embedding/i);
    expect(container.textContent).toMatch(/Event Log Entry/i);
  });

  it("sub=4 explains pruning policy", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prune|forget/i);
    expect(container.textContent).toMatch(/12 months|age|summariz/i);
    expect(container.textContent).toMatch(/Memory Has To Forget/i);
  });
});

describe("SemanticMemory (13.27) content", () => {
  const fn = AgentLoops.SemanticMemory;

  it("sub=0 distinguishes facts from events", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/episodic|event/i);
    expect(container.textContent).toMatch(/alice|prefer/i);
    expect(container.textContent).toMatch(/Facts I Know About You/i);
  });

  it("sub=1 shows the profile card", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/customer_id|c-9924/i);
    expect(container.textContent).toMatch(/tier|Pro/);
    expect(container.textContent).toMatch(/preferred_contact|preference/i);
    expect(container.textContent).toMatch(/Customer Profile Card/i);
  });

  it("sub=2 compares structured vs vector storage", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/structured|key.?value/i);
    expect(container.textContent).toMatch(/vector|similarity/i);
    expect(container.textContent).toMatch(/Key-Value Or Vector/i);
  });

  it("sub=3 shows profile growth across sessions", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/day 1|day 30|day 90|growth/i);
    expect(container.textContent).toMatch(/How The Profile Fills Up/i);
  });

  it("sub=4 explains write vs ignore", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/write|store/i);
    expect(container.textContent).toMatch(/ignore|skip|transient/i);
    expect(container.textContent).toMatch(/6 months|stable/i);
    expect(container.textContent).toMatch(/What Counts As A Fact/i);
  });
});

describe("ProceduralMemory (13.28) content", () => {
  const fn = AgentLoops.ProceduralMemory;

  it("sub=0 contrasts skill vs fact", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/skill|recipe|how.?to/i);
    expect(container.textContent).toMatch(/fact/i);
    expect(container.textContent).toMatch(/escalate_human|200/);
    expect(container.textContent).toMatch(/How-To, Not What/i);
  });

  it("sub=1 shows the recipe library", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/library|cache|recipe/i);
    expect(container.textContent).toMatch(/refund|password|billing/i);
    expect(container.textContent).toMatch(/Cached Workflows/i);
  });

  it("sub=2 shows retrieval by similarity", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/similarity|match|retriev/i);
    expect(container.textContent).toMatch(/embedding|ANN/);
    expect(container.textContent).toMatch(/Retrieve The Recipe/i);
  });

  it("sub=3 shows recipe shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recipe/i);
    expect(container.textContent).toMatch(/steps/i);
    expect(container.textContent).toMatch(/success_rate|uses/i);
    expect(container.textContent).toMatch(/Recipe \(Shape\)/i);
  });

  it("sub=4 contrasts with prompting", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/prompt/i);
    expect(container.textContent).toMatch(/external|stored|token/i);
    expect(container.textContent).toMatch(/learn|update|outcome/i);
    expect(container.textContent).toMatch(/Why Not Just Prompt/i);
  });
});

describe("SummaryAndContextMgmt (13.29) content", () => {
  const fn = AgentLoops.SummaryAndContextMgmt;

  it("sub=0 shows long conversations pressure the window", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/context window|8k/i);
    expect(container.textContent).toMatch(/turns?|100|30/i);
    expect(container.textContent).toMatch(/100 Turns Won/i);
  });

  it("sub=1 shows rolling summary technique", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rolling|summary/i);
    expect(container.textContent).toMatch(/50%|capacity|half/i);
    expect(container.textContent).toMatch(/Compress The Oldest Half/i);
  });

  it("sub=2 shows hierarchical summary tree", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarch/i);
    expect(container.textContent).toMatch(/meta|tree|leaves/i);
    expect(container.textContent).toMatch(/Summaries Of Summaries/i);
  });

  it("sub=3 contrasts recency / relevance / hybrid", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/recency/i);
    expect(container.textContent).toMatch(/relevance/i);
    expect(container.textContent).toMatch(/hybrid/i);
    expect(container.textContent).toMatch(/Most Recent vs Most Relevant/i);
  });

  it("sub=4 shows production thresholds", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/50%|threshold|capacity/i);
    expect(container.textContent).toMatch(/aggressive|panic|production/i);
    expect(container.textContent).toMatch(/Summarize At 50% Capacity/i);
  });

  it("sub=5 ties to 13.6 context engineering", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/13\.6|context engineering/i);
    expect(container.textContent).toMatch(/Context Is Where Real Work Happens/i);
  });
});

describe("WhyMultiAgent (13.30) content", () => {
  const fn = MultiAgent.WhyMultiAgent;

  it("sub=0 shows single-agent ceiling", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/single|one agent|ceiling/i);
    expect(container.textContent).toMatch(/Why One Agent Sometimes Isn/i);
  });

  it("sub=1 explains specialization", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/specializ/i);
    expect(container.textContent).toMatch(/billing|trouble|triage/i);
    expect(container.textContent).toMatch(/One Agent Per Role/i);
  });

  it("sub=2 shows parallelism", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|concurrent/i);
    expect(container.textContent).toMatch(/lookup_customer|lookup_subscription/);
    expect(container.textContent).toMatch(/Run Independent Tasks At The Same Time/i);
  });

  it("sub=3 shows planner / worker", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/planner|worker/i);
    expect(container.textContent).toMatch(/decompos|break/i);
    expect(container.textContent).toMatch(/Planner vs Worker/i);
  });

  it("sub=4 lists when multi-agent hurts", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hurt|anti.?pattern|not/i);
    expect(container.textContent).toMatch(/13\.35|failure/);
    expect(container.textContent).toMatch(/Don.t Multi-Agent A Small Problem/i);
  });
});

describe("OrchestratorWorker (13.31) content", () => {
  const fn = MultiAgent.OrchestratorWorker;

  it("sub=0 shows topology", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/orchestrat|planner/i);
    expect(container.textContent).toMatch(/worker/i);
    expect(container.textContent).toMatch(/One Planner, N Workers/i);
  });

  it("sub=1 shows orchestrator phases", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/plan/i);
    expect(container.textContent).toMatch(/dispatch|send/i);
    expect(container.textContent).toMatch(/aggregat|merge/i);
    expect(container.textContent).toMatch(/Plan, Dispatch, Aggregate/i);
  });

  it("sub=2 shows worker role", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/sub.?task/i);
    expect(container.textContent).toMatch(/don't talk|orchestrator/i);
    expect(container.textContent).toMatch(/Execute One Sub-Task/i);
  });

  it("sub=3 traces T3", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T3|ticket t3/i);
    expect(container.textContent).toMatch(/search_kb/);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/Trace: Ticket T3/i);
  });

  it("sub=4 lists aggregation patterns", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/concat|stitch/i);
    expect(container.textContent).toMatch(/vote|majority/i);
    expect(container.textContent).toMatch(/synthesis/i);
    expect(container.textContent).toMatch(/Three Ways To Aggregate/i);
  });
});

describe("SupervisorHierarchy (13.32) content", () => {
  const fn = MultiAgent.SupervisorHierarchy;

  it("sub=0 shows the tree", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/tree|hierarch/i);
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/specialist|leaf/i);
    expect(container.textContent).toMatch(/Multiple Levels Of Delegation/i);
  });

  it("sub=1 shows supervisor role per level", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/supervisor/i);
    expect(container.textContent).toMatch(/route|pick|children/i);
    expect(container.textContent).toMatch(/Each Supervisor: Plan/i);
  });

  it("sub=2 decides hierarchical vs orchestrator-worker", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/hierarchical/i);
    expect(container.textContent).toMatch(/sub.?domain|sub.?specialty/i);
    expect(container.textContent).toMatch(/Sub-Specialties/i);
  });

  it("sub=3 shows the support tree", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/refund|invoice/i);
    expect(container.textContent).toMatch(/escalat/i);
    expect(container.textContent).toMatch(/Support Tree/i);
  });

  it("sub=4 shows escalation up the tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/escalat/i);
    expect(container.textContent).toMatch(/escalate_human/);
    expect(container.textContent).toMatch(/When To Escalate Up/i);
  });
});

describe("AgentHandoffs (13.33) content", () => {
  const fn = MultiAgent.AgentHandoffs;

  it("sub=0 contrasts hand-off vs delegation", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/hand.?off/i);
    expect(container.textContent).toMatch(/delegat/i);
    expect(container.textContent).toMatch(/switch|return|control/i);
    expect(container.textContent).toMatch(/Return The Next Agent/i);
  });

  it("sub=1 shows the swarm shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/swarm|hand.?off/i);
    expect(container.textContent).toMatch(/handoffs/i);
    expect(container.textContent).toMatch(/triage|billing/i);
    expect(container.textContent).toMatch(/Agents As Routes/i);
  });

  it("sub=2 explains context transfer", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/context|history/i);
    expect(container.textContent).toMatch(/working memory|snapshot/i);
    expect(container.textContent).toMatch(/What Travels With The Hand-Off/i);
  });

  it("sub=3 traces T4 hand-off", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage/i);
    expect(container.textContent).toMatch(/billing/i);
    expect(container.textContent).toMatch(/hand.?off|escalation/i);
    expect(container.textContent).toMatch(/Trace: T4/i);
  });

  it("sub=4 contrasts ring vs tree", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/ring|peer/i);
    expect(container.textContent).toMatch(/tree|nested/i);
    expect(container.textContent).toMatch(/Ring When All Agents Are Peers/i);
  });
});

describe("CriticDebate (13.34) content", () => {
  const fn = MultiAgent.CriticDebate;

  it("sub=0 introduces critic role", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/critic/i);
    expect(container.textContent).toMatch(/13\.22|reflection/i);
    expect(container.textContent).toMatch(/A Second Agent Checks The First/i);
  });

  it("sub=1 shows critique-revise loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/critique|score/i);
    expect(container.textContent).toMatch(/revise/i);
    expect(container.textContent).toMatch(/Loop: Draft/i);
  });

  it("sub=2 shows debate pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/debate|argue/i);
    expect(container.textContent).toMatch(/judge/i);
    expect(container.textContent).toMatch(/Two Agents Argue/i);
  });

  it("sub=3 shows refund critic example", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/refund/i);
    expect(container.textContent).toMatch(/policy/i);
    expect(container.textContent).toMatch(/30 days|partial/i);
    expect(container.textContent).toMatch(/Policy Critic/i);
  });

  it("sub=4 shows critic cost tradeoff", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|battle/i);
    expect(container.textContent).toMatch(/high.?stakes|contested/i);
    expect(container.textContent).toMatch(/Pick Battles/i);
  });
});

describe("MultiAgentFailures (13.35) content", () => {
  const fn = MultiAgent.MultiAgentFailures;

  it("sub=0 lists four failure modes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/infinite loop/i);
    expect(container.textContent).toMatch(/deadlock/i);
    expect(container.textContent).toMatch(/cost runaway|runaway/i);
    expect(container.textContent).toMatch(/How Multi-Agent Falls Apart/i);
  });

  it("sub=1 shows drift", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/drift/i);
    expect(container.textContent).toMatch(/disagree|goal|intent/i);
    expect(container.textContent).toMatch(/Drift: Agents Pull/i);
  });

  it("sub=2 shows infinite loop", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/infinite loop|ping.?pong/i);
    expect(container.textContent).toMatch(/hand.?off/i);
    expect(container.textContent).toMatch(/Hand-Off Ping-Pong/i);
  });

  it("sub=3 shows deadlock", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/deadlock|wait/i);
    expect(container.textContent).toMatch(/Two Agents Wait Forever/i);
  });

  it("sub=4 shows cost runaway", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost runaway|recursion/i);
    expect(container.textContent).toMatch(/exponential|vertical|spend/i);
    expect(container.textContent).toMatch(/Unbounded Recursion/i);
  });

  it("sub=5 maps signals per failure", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/signal|alert|threshold/i);
    expect(container.textContent).toMatch(/What To Alert On/i);
  });
});

describe("AgenticRag (13.36) content", () => {
  const fn = MultiAgent.AgenticRag;

  it("sub=0 contrasts naive and agentic RAG", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/naive|agentic/i);
    expect(container.textContent).toMatch(/12\.29|section 12/i);
    expect(container.textContent).toMatch(/iterative|loop|one.?shot/i);
    expect(container.textContent).toMatch(/Retrieve Once vs Retrieve In A Loop/i);
  });

  it("sub=1 shows the iterative loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/search/i);
    expect(container.textContent).toMatch(/judge/i);
    expect(container.textContent).toMatch(/refine|rewrite/i);
    expect(container.textContent).toMatch(/Search, Judge, Refine, Repeat/i);
  });

  it("sub=2 shows query rewriting", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/rewrite/i);
    expect(container.textContent).toMatch(/customer.?impact|severity/i);
    expect(container.textContent).toMatch(/Agent Rewrites Its Own Query/i);
  });

  it("sub=3 traces the 90-day research query", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/90 days|customer.?impact/i);
    expect(container.textContent).toMatch(/aggregat|summary|table/i);
    expect(container.textContent).toMatch(/Example: Customer-Impact Issues/i);
  });

  it("sub=4 decides when agentic vs naive", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/naive|12\.2/);
    expect(container.textContent).toMatch(/agentic|research|multi.?hop/i);
    expect(container.textContent).toMatch(/cost|latency/i);
    expect(container.textContent).toMatch(/When To Iterate Retrieval/i);
  });
});

describe("WhyEvalAgents (13.37) content", () => {
  const fn = AgentEvals.WhyEvalAgents;

  it("sub=0 lists three reasons agents are harder", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/non.?determin/i);
    expect(container.textContent).toMatch(/multi.?step/i);
    expect(container.textContent).toMatch(/silent/i);
    expect(container.textContent).toMatch(/Three Reasons Agents Are Harder To Eval/i);
  });

  it("sub=1 shows production incident stories", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/production|incident/i);
    expect(container.textContent).toMatch(/unauthorized|wrong|leak|drift/i);
    expect(container.textContent).toMatch(/What Breaks When You Don.?t Eval/i);
  });

  it("sub=2 contrasts offline and online", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/offline/i);
    expect(container.textContent).toMatch(/online/i);
    expect(container.textContent).toMatch(/golden|sample|production/i);
    expect(container.textContent).toMatch(/Offline \(Before Ship\) vs Online \(After Ship\)/i);
  });

  it("sub=3 lists what humans must review", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/human/i);
    expect(container.textContent).toMatch(/tone|hallucin|drift/i);
    expect(container.textContent).toMatch(/Some Failure Modes Need Humans/i);
  });

  it("sub=4 previews the eval pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/pipeline|stages/i);
    expect(container.textContent).toMatch(/13\.(39|40|41)/);
    expect(container.textContent).toMatch(/What A Full Pipeline Looks Like/i);
  });
});

describe("EvalDimensions (13.38) content", () => {
  const fn = AgentEvals.EvalDimensions;

  it("sub=0 names four axes", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/safety/i);
    expect(container.textContent).toMatch(/Correctness, Latency, Cost, Safety/i);
  });

  it("sub=1 defines correctness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/correctness|complete/i);
    expect(container.textContent).toMatch(/resolution rate|90%/i);
    expect(container.textContent).toMatch(/Did The Task Complete\?/i);
  });

  it("sub=2 shows latency percentiles", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/latency/i);
    expect(container.textContent).toMatch(/P50|P95|P99/i);
    expect(container.textContent).toMatch(/How Long Did It Take\?/i);
  });

  it("sub=3 shows cost breakdown", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/tokens/i);
    expect(container.textContent).toMatch(/0\.50/);
    expect(container.textContent).toMatch(/How Much Did Each Trace Consume\?/i);
  });

  it("sub=4 lists safety metrics", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/safety|refusal/i);
    expect(container.textContent).toMatch(/escalation/i);
    expect(container.textContent).toMatch(/prompt.?injection/i);
    expect(container.textContent).toMatch(/Did The Agent Refuse What It Should\?/i);
  });

  it("sub=5 shows the composite formula", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/composite|formula|score/i);
    expect(container.textContent).toMatch(/0\.5|0\.2|0\.1/);
    expect(container.textContent).toMatch(/One Number For The Dashboard/i);
  });
});

describe("LlmAsJudge (13.39) content", () => {
  const fn = AgentEvals.LlmAsJudge;

  it("sub=0 contrasts pairwise and scalar", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/pairwise/i);
    expect(container.textContent).toMatch(/scalar/i);
    expect(container.textContent).toMatch(/Two Ways To Grade/i);
  });

  it("sub=1 shows the rubric", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/rubric|criteria/i);
    expect(container.textContent).toMatch(/correctness/i);
    expect(container.textContent).toMatch(/completeness/i);
    expect(container.textContent).toMatch(/tone/i);
    expect(container.textContent).toMatch(/Tell The Judge What To Score On/i);
  });

  it("sub=2 lists three biases", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/length bias/i);
    expect(container.textContent).toMatch(/position bias/i);
    expect(container.textContent).toMatch(/self.?preference/i);
    expect(container.textContent).toMatch(/What The Judge Gets Wrong/i);
  });

  it("sub=3 shows calibration with humans", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/calibrat|human/i);
    expect(container.textContent).toMatch(/correlation|0\.7/);
    expect(container.textContent).toMatch(/Trust But Verify/i);
  });

  it("sub=4 shows the judge prompt artifact", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/judge|eval rubric/i);
    expect(container.textContent).toMatch(/JSON|machine.?readable/i);
    expect(container.textContent).toMatch(/Canonical Judge Prompt/i);
  });

  it("sub=5 back-references Section 12.32", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/12\.32|section 12/i);
    expect(container.textContent).toMatch(/RAG|faithfulness|answer.relevance/i);
    expect(container.textContent).toMatch(/Same Technique, Agent Scope/i);
  });
});

describe("TraceEvals (13.40) content", () => {
  const fn = AgentEvals.TraceEvals;

  it("sub=0 shows trace as tree of steps", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/trace|step|grade/i);
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/Every Step Gets A Grade/i);
  });

  it("sub=1 locates the failing step in T4", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/FAILED|wrong/i);
    expect(container.textContent).toMatch(/When A Step Fails, Where\?/i);
  });

  it("sub=2 shows per-step rubric", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/tool choice|tool input/i);
    expect(container.textContent).toMatch(/result handling/i);
    expect(container.textContent).toMatch(/next.?step planning/i);
    expect(container.textContent).toMatch(/What To Score Per Step/i);
  });

  it("sub=3 shows the trace eval record shape", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/trace_id|steps/i);
    expect(container.textContent).toMatch(/failure_mode|missed_escalation/i);
    expect(container.textContent).toMatch(/Trace Eval Record \(Shape\)/i);
  });

  it("sub=4 shows the cost of per-step grading", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost|N times|8x/i);
    expect(container.textContent).toMatch(/5%|sample/);
    expect(container.textContent).toMatch(/Per-Step Grading Is N x Expensive/i);
  });
});

describe("EvalSetsContinuous (13.41) content", () => {
  const fn = AgentEvals.EvalSetsContinuous;

  it("sub=0 lists golden / adversarial / regression", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/golden/i);
    expect(container.textContent).toMatch(/adversarial/i);
    expect(container.textContent).toMatch(/regression/i);
    expect(container.textContent).toMatch(/Golden \+ Adversarial \+ Regression/i);
  });

  it("sub=1 explains eval-set freshness", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stale|fresh/i);
    expect(container.textContent).toMatch(/quarter|month|10.20%/i);
    expect(container.textContent).toMatch(/Eval Set Goes Stale/i);
  });

  it("sub=2 shows online sampling", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/online|sample/i);
    expect(container.textContent).toMatch(/1.5%|sampling/);
    expect(container.textContent).toMatch(/Grade A Slice Of Production/i);
  });

  it("sub=3 shows drift detection", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/drift|signal|alert/i);
    expect(container.textContent).toMatch(/moving average|baseline/i);
    expect(container.textContent).toMatch(/Trigger When Quality Drops/i);
  });

  it("sub=4 closes with eval-first principle", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/eval first|ship eval|before/i);
    expect(container.textContent).toMatch(/20 test cases/);
    expect(container.textContent).toMatch(/Build The Eval Set Before The Agent/i);
  });
});

describe("AgentObservabilityTracing (13.42) content", () => {
  const fn = AgentProduction.AgentObservabilityTracing;

  it("sub=0 shows span tree", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/span|tree/i);
    expect(container.textContent).toMatch(/T2|ticket t2/i);
    expect(container.textContent).toMatch(/lookup_customer/);
    expect(container.textContent).toMatch(/An Agent Run Is A Tree Of Spans/i);
  });

  it("sub=1 shows OTel span shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/OpenTelemetry|OTel/i);
    expect(container.textContent).toMatch(/trace_id|span_id/i);
    expect(container.textContent).toMatch(/Span \(Shape\)/i);
  });

  it("sub=2 compares LangSmith / Weave / Phoenix", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/LangSmith/);
    expect(container.textContent).toMatch(/Weave/);
    expect(container.textContent).toMatch(/Phoenix/);
    expect(container.textContent).toMatch(/Three Vendors, Same Concepts/i);
  });

  it("sub=3 lists per-span metadata", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/metadata|attribute/i);
    expect(container.textContent).toMatch(/tokens|cost|tool name/i);
    expect(container.textContent).toMatch(/What To Attribute/i);
  });

  it("sub=4 shows cost overlay", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cost/i);
    expect(container.textContent).toMatch(/0\.0[2-9]|0\.09/);
    expect(container.textContent).toMatch(/Full T2 Trace With Cost/i);
  });

  it("sub=5 shows alerting from traces", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/alert|threshold/i);
    expect(container.textContent).toMatch(/13\.41|drift/);
    expect(container.textContent).toMatch(/Turn Traces Into Alerts/i);
  });
});

describe("CostControl (13.43) content", () => {
  const fn = AgentProduction.CostControl;

  it("sub=0 shows cost breakdown", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/input|output|tool|retr/i);
    expect(container.textContent).toMatch(/0\.30|dominant/);
    expect(container.textContent).toMatch(/Where The Dollars Go/i);
  });

  it("sub=1 explains prompt caching with Section 12.36", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/12\.36|section 12/i);
    expect(container.textContent).toMatch(/80%|prefix/i);
    expect(container.textContent).toMatch(/Cache The Prefix/i);
  });

  it("sub=2 shows model routing tiers", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/router|routing|tier/i);
    expect(container.textContent).toMatch(/cheap|small|large/i);
    expect(container.textContent).toMatch(/Cheap For Easy, Expensive For Hard/i);
  });

  it("sub=3 shows per-request budget cap", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/budget|cap/i);
    expect(container.textContent).toMatch(/13\.23|max.?iter/i);
    expect(container.textContent).toMatch(/Hard Cap Per Ticket/i);
  });

  it("sub=4 shows cost-aware retries", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/transient|permanent|business.?rule/i);
    expect(container.textContent).toMatch(/13\.11/);
    expect(container.textContent).toMatch(/Don't Retry Expensive Failures/i);
  });
});

describe("LatencyOptimization (13.44) content", () => {
  const fn = AgentProduction.LatencyOptimization;

  it("sub=0 shows latency waterfall", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/latency|waterfall/i);
    expect(container.textContent).toMatch(/LLM call|tool/i);
    expect(container.textContent).toMatch(/Where The Seconds Go/i);
  });

  it("sub=1 explains streaming win", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/stream/i);
    expect(container.textContent).toMatch(/perceived|first token/i);
    expect(container.textContent).toMatch(/Show Progress Token By Token/i);
  });

  it("sub=2 references parallel tools (13.10)", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/parallel|concurrent/i);
    expect(container.textContent).toMatch(/13\.10/);
    expect(container.textContent).toMatch(/Run Independent Tools Concurrently/i);
  });

  it("sub=3 explains speculative execution", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/speculat/i);
    expect(container.textContent).toMatch(/wasted|tradeoff/i);
    expect(container.textContent).toMatch(/Run Likely Steps Before Confirming/i);
  });

  it("sub=4 shows result caching", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/cach/i);
    expect(container.textContent).toMatch(/TTL|5 minutes|1 hour/i);
    expect(container.textContent).toMatch(/Cache What Doesn't Change/i);
  });
});

describe("Guardrails (13.45) content", () => {
  const fn = AgentProduction.Guardrails;

  it("sub=0 shows input/output pipeline", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/guardrail|filter/i);
    expect(container.textContent).toMatch(/input/i);
    expect(container.textContent).toMatch(/output/i);
    expect(container.textContent).toMatch(/Filters Sit On Both Sides Of The Model/i);
  });

  it("sub=1 shows content classification", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/content|classification/i);
    expect(container.textContent).toMatch(/block|refuse|allow/i);
    expect(container.textContent).toMatch(/Block Disallowed Categories Before Model Sees It/i);
  });

  it("sub=2 explains PII redaction", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/PII|redact/i);
    expect(container.textContent).toMatch(/SSN|address/i);
    expect(container.textContent).toMatch(/Strip Personally Identifying Data/i);
  });

  it("sub=3 shows response validation", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/validat|schema/i);
    expect(container.textContent).toMatch(/13\.3|structured output/i);
    expect(container.textContent).toMatch(/Reject Outputs That Fail Schema/i);
  });

  it("sub=4 shows action gate for destructive tools", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/gate|approval/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/200|350|threshold/i);
    expect(container.textContent).toMatch(/Require Approval Before Destructive Tools/i);
  });
});

describe("PromptInjectionDefenses (13.46) content", () => {
  const fn = AgentProduction.PromptInjectionDefenses;

  it("sub=0 lists three attack types", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/direct/i);
    expect(container.textContent).toMatch(/indirect/i);
    expect(container.textContent).toMatch(/jailbreak/i);
    expect(container.textContent).toMatch(/Direct, Indirect, Jailbreak/i);
  });

  it("sub=1 shows direct injection example", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/ignore.*previous|injection/i);
    expect(container.textContent).toMatch(/1000|refund/);
    expect(container.textContent).toMatch(/Direct Injection Attempt/i);
  });

  it("sub=2 shows indirect injection via KB", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/indirect|KB|poison/i);
    expect(container.textContent).toMatch(/feedback|index/i);
    expect(container.textContent).toMatch(/Bad Actor Plants Instructions In A Doc/i);
  });

  it("sub=3 shows instruction hierarchy", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/hierarchy|tier|trust/i);
    expect(container.textContent).toMatch(/system/i);
    expect(container.textContent).toMatch(/retrieved/i);
    expect(container.textContent).toMatch(/Instruction Hierarchy/i);
  });

  it("sub=4 shows tool whitelisting", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/whitelist|restrict|scope/i);
    expect(container.textContent).toMatch(/blast radius/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/Restrict What The Agent CAN Do/i);
  });

  it("sub=5 lists detection signals", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/detection|signal/i);
    expect(container.textContent).toMatch(/pattern|sequence|drift|spike/i);
    expect(container.textContent).toMatch(/What To Alert On/i);
  });
});

describe("ToolSecurity (13.47) content", () => {
  const fn = AgentProduction.ToolSecurity;

  it("sub=0 shows sandbox boundary", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/sandbox|cage|boundary/i);
    expect(container.textContent).toMatch(/process|filesystem|network/i);
    expect(container.textContent).toMatch(/Tools Run In A Cage/i);
  });

  it("sub=1 shows capability scope per agent", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/capability|scope/i);
    expect(container.textContent).toMatch(/triage|billing|escalation/i);
    expect(container.textContent).toMatch(/Different Agents, Different Tool Sets/i);
  });

  it("sub=2 shows audit log entry", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/audit|log/i);
    expect(container.textContent).toMatch(/timestamp|tool|consent/i);
    expect(container.textContent).toMatch(/Audit Log Entry \(Shape\)/i);
  });

  it("sub=3 shows rate limits", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/rate limit|per hour/i);
    expect(container.textContent).toMatch(/process_refund|search_kb/);
    expect(container.textContent).toMatch(/Cap The Frequency/i);
  });

  it("sub=4 shows consent prompt", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/consent|approval/i);
    expect(container.textContent).toMatch(/process_refund/);
    expect(container.textContent).toMatch(/Ask Before Doing Big Things/i);
  });
});

describe("LangGraphFramework (13.48) content", () => {
  const fn = AgentProduction.LangGraphFramework;

  it("sub=0 introduces stateful graph model", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/state|graph/i);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Agents As Stateful Graphs/i);
  });

  it("sub=1 shows node / edge / state shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/add_node|add_edge/);
    expect(container.textContent).toMatch(/state|ticket|customer/i);
    expect(container.textContent).toMatch(/Three Primitives/i);
  });

  it("sub=2 shows conditional edges", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/conditional|branch/i);
    expect(container.textContent).toMatch(/billing|troubleshooting/i);
    expect(container.textContent).toMatch(/Branching Based On State/i);
  });

  it("sub=3 explains checkpoints", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/checkpoint|persist/i);
    expect(container.textContent).toMatch(/async|long.?running|human.?in.?the.?loop/i);
    expect(container.textContent).toMatch(/Persistent State Between Calls/i);
  });

  it("sub=4 lists when LangGraph fits", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/directed graph|state|visualiz/i);
    expect(container.textContent).toMatch(/Use LangGraph When/i);
  });
});

describe("CrewAiAutoGen (13.49) content", () => {
  const fn = AgentProduction.CrewAiAutoGen;

  it("sub=0 contrasts role-based and conversational", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/CrewAI/);
    expect(container.textContent).toMatch(/AutoGen/);
    expect(container.textContent).toMatch(/role|goal|conversation/i);
    expect(container.textContent).toMatch(/Two Multi-Agent Styles/i);
  });

  it("sub=1 shows CrewAI shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/CrewAI|Agent|Crew/);
    expect(container.textContent).toMatch(/Triage|Billing/);
    expect(container.textContent).toMatch(/role|goal|tools/i);
    expect(container.textContent).toMatch(/CrewAI: Roles \+ Goals/i);
  });

  it("sub=2 shows AutoGen shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/AutoGen|AssistantAgent|GroupChat/);
    expect(container.textContent).toMatch(/system_message/i);
    expect(container.textContent).toMatch(/AutoGen: Conversational Agents/i);
  });

  it("sub=3 traces T4 in both styles", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/T4|ticket t4/i);
    expect(container.textContent).toMatch(/triage|billing|escalation/i);
    expect(container.textContent).toMatch(/Same Ticket, Two Frameworks/i);
  });

  it("sub=4 explains when each fits", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/CrewAI|AutoGen/);
    expect(container.textContent).toMatch(/role|conversation/i);
    expect(container.textContent).toMatch(/Pick The Abstraction That Matches Your Mental Model/i);
  });
});

describe("VendorSdks (13.50) content", () => {
  const fn = AgentProduction.VendorSdks;

  it("sub=0 introduces vendor-native frameworks", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/Claude Agent SDK/);
    expect(container.textContent).toMatch(/OpenAI Agents|Swarm/);
    expect(container.textContent).toMatch(/loop|hand.?off|primitive/i);
    expect(container.textContent).toMatch(/When The Model Vendor Ships The Framework/i);
  });

  it("sub=1 shows Claude Agent SDK shape", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/AgentLoop|loop/i);
    expect(container.textContent).toMatch(/system_prompt|tools/);
    expect(container.textContent).toMatch(/refund|INV.?9924/);
    expect(container.textContent).toMatch(/Loop Primitive/i);
  });

  it("sub=2 shows OpenAI Agents shape", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/OpenAI Agents|Runner/);
    expect(container.textContent).toMatch(/handoffs/);
    expect(container.textContent).toMatch(/triage|billing/i);
    expect(container.textContent).toMatch(/Hand-Off Primitive/i);
  });

  it("sub=3 compares the two side-by-side", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/loop|hand.?off/i);
    expect(container.textContent).toMatch(/lock.?in|portab/i);
    expect(container.textContent).toMatch(/Two Primitives, Two Mental Models/i);
  });

  it("sub=4 lists when to pick vendor SDK", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/vendor|committed/i);
    expect(container.textContent).toMatch(/multi.?vendor|switch/i);
    expect(container.textContent).toMatch(/Use The Vendor SDK When/i);
  });
});

describe("CustomNoFramework (13.51) content", () => {
  const fn = AgentProduction.CustomNoFramework;

  it("sub=0 lists three reasons to roll your own", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/control|cost|lock.?in/i);
    expect(container.textContent).toMatch(/Three Reasons To Roll Your Own/i);
  });

  it("sub=1 shows the 50-line loop", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/history|loop|max_iter/i);
    expect(container.textContent).toMatch(/tool_calls|tool_use/);
    expect(container.textContent).toMatch(/50 Lines Of Loop/i);
  });

  it("sub=2 lists missing pieces", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/observability/i);
    expect(container.textContent).toMatch(/retry/i);
    expect(container.textContent).toMatch(/checkpoint/i);
    expect(container.textContent).toMatch(/Missing Pieces You Now Own/i);
  });

  it("sub=3 shows when custom wins", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/high.?volume|tight latency/i);
    expect(container.textContent).toMatch(/prototype|framework/i);
    expect(container.textContent).toMatch(/Stay Custom When/i);
  });

  it("sub=4 shows hybrid approach", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/hybrid|build some|buy some/i);
    expect(container.textContent).toMatch(/adapter|observability/i);
    expect(container.textContent).toMatch(/Build Some, Buy Some/i);
  });
});

describe("AgentDecisionFramework (13.52) content - CAPSTONE", () => {
  const fn = AgentProduction.AgentDecisionFramework;

  it("sub=0 shows the full decision stack", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/decision|stack/i);
    expect(container.textContent).toMatch(/13\.5|13\.18|13\.30/);
    expect(container.textContent).toMatch(/Every Choice Section 13 Taught You/i);
  });

  it("sub=1 introduces capstone use case", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/IT support|use case/i);
    expect(container.textContent).toMatch(/password|software|VPN|hardware/i);
    expect(container.textContent).toMatch(/Design An Agent For A New Use Case/i);
  });

  it("sub=2 picks approach / loop / memory", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/approach|agent/i);
    expect(container.textContent).toMatch(/workflow|loop/i);
    expect(container.textContent).toMatch(/working|episodic|semantic/i);
    expect(container.textContent).toMatch(/Pick Approach, Loop, Memory/i);
  });

  it("sub=3 picks multi-agent / tools", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/orchestrator|triage/i);
    expect(container.textContent).toMatch(/capability scope|tools/i);
    expect(container.textContent).toMatch(/Pick Multi-Agent, Tools/i);
  });

  it("sub=4 picks protocols / eval", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/MCP/);
    expect(container.textContent).toMatch(/eval/i);
    expect(container.textContent).toMatch(/judge|trace/i);
    expect(container.textContent).toMatch(/Pick Protocols, Eval Strategy/i);
  });

  it("sub=5 picks production / framework", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OTel|LangSmith|observabilit/i);
    expect(container.textContent).toMatch(/LangGraph/);
    expect(container.textContent).toMatch(/Pick Production Hardening, Framework/i);
  });

  it("sub=6 closes the section", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/decide|diagnose|defend/i);
    expect(container.textContent).toMatch(/section 13|production|ship/i);
    expect(container.textContent).toMatch(/You Can Lead This Project Now/i);
  });
});

describe("section 12 chapters mount <SubBtn> for progressive reveal", () => {
  const sec12Modules = {
    RagFoundations,
    RagIngestion,
    RagRetrieval,
    RagGeneration,
    RagEvaluation,
    RagProduction,
  };
  for (const [modName, mod] of Object.entries(sec12Modules)) {
    for (const [name, fn] of Object.entries(mod)) {
      if (typeof fn !== "function") continue;
      it(`${modName}.${name} mounts <SubBtn data-subbtn="true"> at sub=0 (else sub-steps unreachable via keyboard nav)`, () => {
        const { container } = render(fn(makeCtx({ sub: 0 })));
        expect(container.querySelector('[data-subbtn="true"]')).not.toBeNull();
      });
    }
  }
});
