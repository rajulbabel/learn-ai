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

The deploy output prints a URL like
`https://learn-ai-embed.<account-subdomain>.workers.dev`. Copy it.

## Wire it into the site build

Set the env var at build time:

```bash
VITE_EMBED_API_URL=https://learn-ai-embed.<account-subdomain>.workers.dev npm run build
```

For the GitHub Pages workflow, add a repo variable `VITE_EMBED_API_URL`
under Settings → Secrets and variables → Actions → Variables, and pass it
to the build step in `.github/workflows/<deploy>.yml`:

```yaml
- run: npm run build
  env:
    VITE_EMBED_API_URL: ${{ vars.VITE_EMBED_API_URL }}
```

When the variable is set, the site skips the in-browser ONNX worker
entirely - no transformers.js, no 99 MB model download. Search semantic
readiness becomes "as soon as embeddings.bin loads".

## Quotas / cost

Free Workers plan: 100k requests/day. Workers AI free tier: 10k embed
calls/day. Beyond that ~$0.011 per 1k embeds. A docs site rarely
exceeds this even at peak.

## Testing locally

```bash
wrangler dev
# POST http://localhost:8787 with body {"text":"how does attention work"}
```
