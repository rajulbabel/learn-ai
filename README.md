# Learn AI

> Free, visual, interactive guide to AI - covers Model Internals, the Transformer, RAG, Vector Databases, and Agent Frameworks. By Rajul Babel.

**[Read it live →](https://rajulbabel.github.io/learn-ai/)**

## What's inside

11 sections, 130+ chapters. Each chapter uses animations, interactive diagrams, and step-by-step breakdowns to build intuition before showing the math.

1. **Neural Network Foundations** - neurons, weights, biases, activations, forward/backward pass, gradient descent, dropout, Adam, weight init.
2. **How LLMs Train** - tokenization, self-supervised learning, cross-entropy, SFT, RLHF, DPO.
3. **Scaling & Modern Techniques** - scaling laws, batch training, distillation, CLIP, the full pipeline.
4. **Road to Transformers** - CNN, RNN, RNN's flaws, the Transformer.
5. **Transformer Input Pipeline** - embeddings, positional encoding (sinusoidal & RoPE).
6. **Attention - Q, K, V** - intuition behind queries, keys, values.
7. **Attention - Full Computation** - dot products, scaling, softmax, multi-head, the complete formula.
8. **The Encoder** - Add & Norm, FFN, residuals, pre-norm vs post-norm, batch norm vs layer norm.
9. **The Decoder** - decoder-only LLMs, causal masking, cross-attention.
10. **Modern LLM Techniques** - KV cache, grouped-query attention, mixture of experts, reasoning models.
11. **Vector Databases** - HNSW, IVF, Vamana, scalar / product / binary quantization, IVF-PQ, HNSW+PQ, hybrid search, rerankers, FAISS, pgvector, Qdrant, Pinecone, Weaviate, Milvus, Chroma. Includes RAG and Agent Frameworks (LangGraph).

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
