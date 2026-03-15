import { Hono } from 'hono'
import { searchPosts, upsertPostEmbedding } from '../lib/pgvector.js'

const search = new Hono()

// POST /search — semantic search on blog posts
// Body: { query: string, limit?: number }
search.post('/', async (c) => {
  if (!process.env.OLLAMA_URL) {
    return c.json({ error: 'Semantic search not configured (missing OLLAMA_URL).' }, 503)
  }

  try {
    const { query, limit } = await c.req.json()

    if (!query || typeof query !== 'string') {
      return c.json({ error: 'Campo "query" é obrigatório.' }, 400)
    }

    const results = await searchPosts(query.slice(0, 500), Math.min(Number(limit) || 5, 20))
    return c.json({ results })
  } catch (err) {
    console.error('[search] error:', err)
    return c.json({ error: 'Erro interno ao realizar busca.' }, 500)
  }
})

// POST /search/sync — upsert embedding for a single post
// Body: { slug, title, summary?, content }
// Intended to be called by the Next.js app or a script when posts are published/updated
search.post('/sync', async (c) => {
  if (!process.env.OLLAMA_URL) {
    return c.json({ error: 'Embeddings not configured (missing OLLAMA_URL).' }, 503)
  }

  try {
    const { slug, title, summary, content } = await c.req.json()

    if (!slug || !title || !content) {
      return c.json({ error: 'Campos "slug", "title" e "content" são obrigatórios.' }, 400)
    }

    await upsertPostEmbedding({
      slug: String(slug).slice(0, 200),
      title: String(title).slice(0, 300),
      summary: summary ? String(summary).slice(0, 500) : undefined,
      contentForEmbedding: String(content).slice(0, 8000),
    })

    return c.json({ success: true, slug })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[search/sync] error:', msg)
    return c.json({ error: msg }, 500)
  }
})

export default search
