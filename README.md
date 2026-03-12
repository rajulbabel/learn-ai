# Learn AI

An interactive, visual guide to understanding AI — from neural network basics to the Transformer architecture.

**[Read it live →](https://rajulbabel.github.io/learn-ai/)**

## What's Inside

The guide is split into five parts with 48 chapters covering:

1. **Neural Network Foundations** — neurons, weights, biases, activation functions, forward/backward pass, gradient descent
2. **The Road to Transformers** — CNNs, RNNs, their limitations, and why Transformers were needed
3. **Transformer Input Pipeline** — embeddings, positional encoding, and how text becomes numbers
4. **Attention — Understanding Q, K, V** — the intuition behind queries, keys, and values with analogies and worked examples
5. **Attention — The Full Computation** — dot products, scaling, softmax, multi-head attention, and the complete formula

Each chapter uses animations, interactive diagrams, and step-by-step breakdowns to build intuition before showing the math.

## Tech Stack

- [React 18](https://react.dev/) — single-component app with hooks
- [Vite](https://vite.dev/) — build toolchain
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline for automated deployment
- [GitHub Pages](https://pages.github.com/) — hosting

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/learn-ai/ to view locally.

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically build and deploy via GitHub Actions. No manual steps needed.

## License

MIT
