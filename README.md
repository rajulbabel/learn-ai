# Learn AI

> Free, visual, interactive guide to AI - covers Deep Learning, LLMs, the Transformer, Vector Databases, RAG, and Agents. By Rajul Babel.

**[Read it live →](https://rajulbabel.github.io/learn-ai/)**

## What's inside

28 sections grouped into 6 super-sections. Each chapter uses animations, interactive diagrams, and step-by-step breakdowns to build intuition before showing the math.

1. **Foundations of Deep Learning** - neuron, layer, weights/biases, activations, forward/backward pass, gradient descent, dropout, Adam, weight init, linear algebra, training deep networks.
2. **The Rise of LLMs** - tokenization, self-supervised learning, cross-entropy, SFT, RLHF, scaling laws, distillation, contrastive learning.
3. **The Transformer Era** - CNN/RNN motivation, embeddings, positional encoding (sinusoidal & RoPE), Q/K/V intuition, scaled dot-product attention, multi-head, encoder (Add & Norm, FFN), decoder (causal masking, cross-attention), KV cache, grouped-query attention, mixture of experts, reasoning models.
4. **Vector Databases at Depth** - distance metrics, IVF, HNSW, Vamana, scalar/product/binary quantization, Matryoshka, IVF-PQ, HNSW+PQ, filtering, sharding, hybrid search, rerankers, FAISS, pgvector, Qdrant, Pinecone, Weaviate, Milvus, Chroma.
5. **Retrieval Augmented Generation (RAG)** - naive pipeline and failure modes, ingestion + chunking, embedding choice and domain adaptation, hybrid retrieval, reranker cascade, HyDE, multi-query, query routing, context packing, citations, multi-hop, Self-RAG, CRAG, GraphRAG, agentic RAG, eval (RAGAS, golden datasets), caching, cost, observability.
6. **Agentic AI** - prompt anatomy, system prompts, few-shot, CoT, tool use, JSON schemas, MCP architecture and primitives, A2A, agent loops (ReAct, plan-execute), memory types, multi-agent (orchestrator-worker, supervisor, critic/debate), evals, guardrails, injection defenses, framework picks.

## Tech Stack

- [React 18](https://react.dev/) - hooks-only component tree
- [Vite](https://vite.dev/) - build toolchain
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [GitHub Pages](https://pages.github.com/) - hosting

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/learn-ai/

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically build and deploy via GitHub Actions.

## Author

**Rajul Babel** - [LinkedIn](https://www.linkedin.com/in/rajulbabel) - [GitHub](https://github.com/rajulbabel)

## License

MIT
