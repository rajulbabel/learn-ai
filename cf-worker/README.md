# learn-ai-embed (Cloudflare Worker)

Proxy that lets the static site query Cloudflare Workers AI's BGE-base
embedding model without bundling the 99 MB ONNX model.

## Deploy

```bash
cd cf-worker
npm i -g wrangler            # if not installed
wrangler login               # opens browser, links your Cloudflare account
wrangler deploy              # publishes the worker
```

The deploy output prints the URL (e.g.
`https://learn-ai-embed.rajul-babel.workers.dev`). This URL is already
hardcoded as `REMOTE_EMBED_URL` in `src/search.js` and as
`DEFAULT_EMBED_API_URL` in `scripts/embed-chunks-remote.mjs`, so no env
wiring is needed for builds. If you fork to a different Cloudflare
account, update those two constants.

## Quotas / cost

Free Workers plan: 100k requests/day. Workers AI free tier: 10k embed
calls/day. Beyond that ~$0.011 per 1k embeds. A docs site rarely
exceeds this even at peak.

## Testing locally

```bash
wrangler dev
# POST http://localhost:8787 with body {"text":"how does attention work"}
# To run scripts against the local worker:
EMBED_API_URL=http://localhost:8787 npm run search:embed
```

## Re-embed the corpus

Whenever chapter content changes, the embedding bin must be rebuilt:

```bash
npm run search:embed
```

This pulls the deployed worker URL from the script's hardcoded constant
(override with `EMBED_API_URL` to point elsewhere). Outputs:

- `src/data/embeddings.bin` (int8 Matryoshka 256-dim, packed scale per row)
- `src/data/embeddings-manifest.json` (chunkId index per vector)
- `public/models/bge-base-en-v1.5-q4/model-meta.json` (checksum stamped
  `cf256:*` so the browser IndexedDB cache invalidates)

After running this, the query side (browser → Worker) and the corpus
side (this script → Worker) hit the identical model, so cosine
similarity is consistent across both paths.
