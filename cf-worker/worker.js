// Cloudflare Worker that proxies embed requests to Workers AI's
// @cf/baai/bge-base-en-v1.5 model. The static site (rajulbabel.github.io)
// posts JSON { text } here; we return { vector } - a 768-float array on the
// same vector space as embeddings.bin so cosine similarity stays valid.
//
// Deploy:
//   cd cf-worker
//   npx wrangler deploy
//
// Then set VITE_EMBED_API_URL in the GitHub Actions deploy workflow to the
// worker URL (https://learn-ai-embed.<account>.workers.dev) and rebuild.
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid JSON" }, 400);
    }
    const text = typeof body?.text === "string" ? body.text : null;
    if (!text || !text.trim()) {
      return json({ error: "missing text" }, 400);
    }
    try {
      const result = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: [text] });
      // Workers AI returns { shape: [...], data: [[...768 floats...]] }
      const vector = Array.isArray(result?.data) ? result.data[0] : null;
      if (!Array.isArray(vector)) {
        return json({ error: "unexpected AI response" }, 502);
      }
      return json({ vector });
    } catch (e) {
      return json({ error: e?.message || "AI run failed" }, 500);
    }
  },
};

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders(), "content-type": "application/json" },
  });
}
