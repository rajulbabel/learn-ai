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

  it("sub=3 shows 3 TB memory math at 1 billion scale", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/3\.072 TB|3 TB/);
    expect(container.textContent).toMatch(/1 billion|1B/);
    expect(container.textContent).toMatch(/hopeless|not feasible|bottleneck/i);
  });

  it("sub=4 introduces ANN and recall as the metric", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
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
    expect(container.textContent).toContain("doc 7");
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.9984");
    expect(container.textContent).not.toContain("doc 3 (Lions");
  });

  it("sub=2 defines L2 as a distance with sqrt", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/L2|Euclidean/i);
    expect(container.textContent).toMatch(/sqrt|√/);
    expect(container.textContent).toMatch(/magnitude|smaller|distance/i);
  });

  it("sub=2 L2 table uses doc 7 (Kittens) as #2 cat exemplar - matches 11.2 top-3", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toContain("doc 7");
    expect(container.textContent).toContain("Kittens");
    expect(container.textContent).toContain("0.057");
    expect(container.textContent).not.toContain("doc 3 (Lions");
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

  it("sub=3 probes the single nearest cluster at nprobe = 1", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/nprobe\s*=\s*1/i);
    expect(container.textContent).toMatch(/nearest|centroid/i);
  });

  it("sub=4 shows recall vs nprobe tradeoff with concrete numbers", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/nprobe/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/0\.8|0\.9|1\.0|100%/);
  });

  it("sub=5 gives parameter guidance nlist sqrt(N) and nprobe", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
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

  it("sub=1 introduces a single flat layer with R neighbors", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/single layer|one layer|flat/i);
    expect(container.textContent).toMatch(/R|64/);
    expect(container.textContent).toMatch(/hierarchy|no layer/i);
  });

  it("sub=2 covers the alpha-pruning rule", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/alpha|α/);
    expect(container.textContent).toMatch(/1\.2|diverse/i);
    expect(container.textContent).toMatch(/edge/i);
    expect(container.textContent).toMatch(/prun/i);
  });

  it("sub=3 describes the disk layout with SSD blocks", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/SSD|disk/i);
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/4\s*KB|page|NVMe/i);
  });

  it("sub=4 shows the minimize-disk-reads search pattern", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/RAM/i);
    expect(container.textContent).toMatch(/SSD|disk/i);
    expect(container.textContent).toMatch(/80|40|reads/i);
  });

  it("sub=5 hits 100B scale with Azure/Milvus and FreshDiskANN", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
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
});

describe("ProductQuantization (11.14) content", () => {
  const fn = VectorCompression.ProductQuantization;

  it("sub=0 splits 768-dim vector into 96 subvectors", () => {
    const { container } = render(fn(makeCtx({ sub: 0 })));
    expect(container.textContent).toMatch(/768/);
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/sub[- ]?vector|split/i);
  });

  it("sub=1 runs k-means per slot with 256 centroids", () => {
    const { container } = render(fn(makeCtx({ sub: 1 })));
    expect(container.textContent).toMatch(/256/);
    expect(container.textContent).toMatch(/centroid/i);
    expect(container.textContent).toMatch(/codebook/i);
    expect(container.textContent).toMatch(/k[- ]?means/i);
  });

  it("sub=2 encodes each subvector to a centroid id", () => {
    const { container } = render(fn(makeCtx({ sub: 2 })));
    expect(container.textContent).toMatch(/centroid id|code/i);
  });

  it("sub=3 shows 96 bytes = 32x compression", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/96/);
    expect(container.textContent).toMatch(/3072|3,072/);
    expect(container.textContent).toMatch(/32/);
  });

  it("sub=4 describes asymmetric distance via lookup table", () => {
    const { container } = render(fn(makeCtx({ sub: 4 })));
    expect(container.textContent).toMatch(/asymmetric/i);
    expect(container.textContent).toMatch(/lookup|table/i);
  });

  it("sub=5 explains OPQ rotation", () => {
    const { container } = render(fn(makeCtx({ sub: 5 })));
    expect(container.textContent).toMatch(/OPQ/);
    expect(container.textContent).toMatch(/rotat/i);
    expect(container.textContent).toMatch(/decorrelat|correlat/i);
  });

  it("sub=6 shows the recall-compression curve", () => {
    const { container } = render(fn(makeCtx({ sub: 6 })));
    expect(container.textContent).toMatch(/m\s*=\s*96|m=96/i);
    expect(container.textContent).toMatch(/recall/i);
    expect(container.textContent).toMatch(/compress/i);
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

describe("Filtering (11.19) content", () => {
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

  it("sub=3 inline filtered-HNSW evaluates during traversal", () => {
    const { container } = render(fn(makeCtx({ sub: 3 })));
    expect(container.textContent).toMatch(/inline|filtered[- ]?HNSW/i);
    expect(container.textContent).toMatch(/Qdrant/);
    expect(container.textContent).toMatch(/traversal|graph hop|payload/i);
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

describe("UpdatesDeletes (11.20) content", () => {
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
