import { C, chapters } from "../../config.js";
import { Box, T } from "../../components.jsx";
export default function TOC(ctx) {
  const { goTo, expanded, setExpanded } = ctx;
  const sections = [
    {
      num: 1,
      name: "Neural Networks - The Mechanics",
      color: "#ff6b6b",
      desc: "Neuron, layer, weights/biases, linear, ReLU, forward pass",
    },
    {
      num: 2,
      name: "Learning & Backprop",
      color: "#ff8a80",
      desc: "Loss, derivatives, backward pass, gradient descent, why deep backprop is hard",
    },
    {
      num: 3,
      name: "Linear Algebra for Deep Learning",
      color: "#ef9a9a",
      desc: "Vectors, dot product, matrices, layer = matmul, activation functions",
    },
    {
      num: 4,
      name: "Training Deep Networks",
      color: "#e57373",
      desc: "What deep means, building blocks, dropout, Adam, LR warmup, weight init",
    },
    {
      num: 5,
      name: "How LLMs Actually Train",
      color: "#00b8d4",
      desc: "Tokenization, self-supervised learning, cross-entropy, SFT, RLHF, batches",
    },
    {
      num: 6,
      name: "Scaling & Modern Techniques",
      color: "#ffd740",
      desc: "Scaling laws, parameters at scale, distillation, contrastive learning",
    },
    {
      num: 7,
      name: "The Road to Transformers",
      color: "#a78bfa",
      desc: "CNN → RNN → why RNN fails → the Transformer arrives",
    },
    {
      num: 8,
      name: "Transformer Input Pipeline",
      color: "#ffab40",
      desc: "Architecture overview, embeddings, positional encoding",
    },
    {
      num: 9,
      name: "Attention - Understanding Q, K, V",
      color: "#00e676",
      desc: "Why attention works, Query/Key/Value concepts, analogies",
    },
    {
      num: 10,
      name: "Computing Attention",
      color: "#e040fb",
      desc: "Step-by-step math: Q-K-V dot products, scaling, softmax, weighted sum, full formula",
    },
    {
      num: 11,
      name: "Multi-Head Attention",
      color: "#ce93d8",
      desc: "Why multi-head, head split, inside each head, concat + W_O, shapes, complete picture",
    },
    { num: 12, name: "The Encoder", color: "#42a5f5", desc: "Encoder architecture, Add & Norm, FFN, layer stacking" },
    {
      num: 13,
      name: "The Decoder",
      color: "#ef5350",
      desc: "Decoder-only, causal masking, cross-attention, full walkthrough",
    },
    {
      num: 14,
      name: "Modern LLM Techniques",
      color: "#26a69a",
      desc: "KV cache, grouped-query attention, mixture of experts, reasoning models",
    },
    {
      num: 15,
      name: "Vector Search - From Brute Force to ANN",
      color: "#f06292",
      desc: "Retrieval problem, distance metrics, IVF, HNSW, Vamana",
    },
    {
      num: 16,
      name: "Vector Compression - Quantization & Matryoshka",
      color: "#ec407a",
      desc: "Memory wall, scalar/product/binary quantization, Matryoshka, IVF-PQ, HNSW+PQ",
    },
    {
      num: 17,
      name: "Vector DBs in Production",
      color: "#d81b60",
      desc: "Filtering, updates, sharding, replication, hybrid search, rerankers, lifecycle",
    },
    {
      num: 18,
      name: "Picking a Vector Database",
      color: "#ad1457",
      desc: "FAISS, pgvector, Qdrant, Pinecone, Weaviate/Milvus/Chroma, decision framework",
    },
    {
      num: 19,
      name: "The RAG Pipeline - Why & How It Breaks",
      color: "#9ccc65",
      desc: "Why LLMs need retrieval, naive RAG pipeline, where it breaks",
    },
    {
      num: 20,
      name: "RAG Data Prep - Ingestion & Chunking",
      color: "#66bb6a",
      desc: "Parsing, deduplication, refresh, all chunking strategies, decision matrix",
    },
    {
      num: 21,
      name: "RAG Retrieval - Embeddings, Hybrid & Query Tricks",
      color: "#4db6ac",
      desc: "Embedding model picking, domain adaptation, hybrid, reranker cascade, HyDE, multi-query, routing",
    },
    {
      num: 22,
      name: "RAG Generation - Naive to Advanced Patterns",
      color: "#00897b",
      desc: "Context packing, citations, multi-hop, Self-RAG, CRAG, GraphRAG, agentic RAG, long-context",
    },
    {
      num: 23,
      name: "RAG in Production - Eval, Cost & Shipping",
      color: "#2e7d32",
      desc: "Eval triangle, RAGAS, golden datasets, caching, cost, observability, hallucination, framework choice",
    },
    {
      num: 24,
      name: "Prompting LLMs - The Foundation",
      color: "#4fc3f7",
      desc: "Anatomy of LLM call, system prompts, few-shot, CoT, prompt vs tune vs RAG vs agent, context engineering",
    },
    {
      num: 25,
      name: "Tools & Protocols - MCP, A2A",
      color: "#1976d2",
      desc: "Tool use, JSON schemas, lifecycle, parallel tools, errors, MCP architecture/primitives/security, A2A",
    },
    {
      num: 26,
      name: "Agent Mechanics - Loops & Memory",
      color: "#5c6bc0",
      desc: "Workflow vs agent, agent loop, ReAct, plan-execute, termination, memory types, context management",
    },
    {
      num: 27,
      name: "Multi-Agent Systems",
      color: "#7e57c2",
      desc: "Orchestrator-worker, supervisor, handoffs, critic/debate, failure modes, agentic RAG",
    },
    {
      num: 28,
      name: "Shipping Agents - Eval, Safety, Frameworks",
      color: "#5e35b3",
      desc: "Eval dimensions, judges, trace evals, observability, cost, latency, guardrails, injection defenses, LangGraph/CrewAI/SDKs",
    },
  ];
  const sectionChapters = {};
  chapters.forEach((c, i) => {
    if (c.section > 0) {
      if (!sectionChapters[c.section]) sectionChapters[c.section] = [];
      sectionChapters[c.section].push({ ...c, idx: i });
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Box color={C.purple} style={{ width: "100%" }}>
        <T color="#b8a9ff" bold size={21} center>
          Your roadmap to understanding AI from scratch.
        </T>
        <T color="#b8a9ff" center style={{ marginTop: 6 }}>
          {chapters.length - 1} chapters. Zero prerequisites. Every concept built on the one before it.
        </T>
      </Box>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {sections.map((p) => {
          const isOpen = expanded === p.num;
          const chs = sectionChapters[p.num];
          return (
            <div
              key={p.num}
              style={{
                borderRadius: 10,
                background: `${p.color}06`,
                border: `1px solid ${isOpen ? `${p.color}35` : `${p.color}15`}`,
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              <div
                onClick={() => setExpanded(isOpen ? null : p.num)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      background: `${p.color}20`,
                      color: p.color,
                      fontWeight: 800,
                      fontSize: 21,
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <T color={p.color} bold size={18}>
                      {p.name}
                    </T>
                    {!isOpen && (
                      <T color={C.dim} size={12}>
                        {p.desc}
                      </T>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <T color={C.dim} size={12}>
                    {chs.length} Chapters
                  </T>
                  <span
                    style={{
                      color: C.dim,
                      fontSize: 14,
                      transition: "transform 0.3s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <T color={C.dim} size={12} style={{ marginBottom: 4, paddingLeft: 40 }}>
                    {p.desc}
                  </T>
                  {chs.map((c) => (
                    <div
                      key={c.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(c.idx);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 8px 6px 40px",
                        borderRadius: 6,
                        cursor: "pointer",
                        background: "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${p.color}10`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ color: `${p.color}88`, fontSize: 14, fontWeight: 700, minWidth: 24 }}>{c.id}</span>
                      <T color={C.mid} size={16}>
                        {c.title}
                      </T>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <T color={C.dim} size={16} center style={{ marginTop: 4 }}>
        Tap any section to expand, tap a chapter to jump there.
      </T>
    </div>
  );
}
