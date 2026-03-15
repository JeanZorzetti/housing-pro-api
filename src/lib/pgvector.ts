import { prisma } from './prisma.js'

const OLLAMA_MODEL = 'nomic-embed-text'

// Generate embedding vector via Ollama (runs on VPS — no external API key needed)
export async function generateEmbedding(text: string): Promise<number[]> {
  const url = process.env.OLLAMA_URL ?? 'http://localhost:11434'

  const res = await fetch(`${url}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt: text.slice(0, 8000) }),
  })

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${await res.text()}`)
  }

  const data = await res.json() as { embedding: number[] }
  return data.embedding
}

// Upsert a post's embedding (insert or update by slug)
export async function upsertPostEmbedding(params: {
  slug: string
  title: string
  summary?: string
  contentForEmbedding: string
}) {
  const { slug, title, summary, contentForEmbedding } = params
  const embedding = await generateEmbedding(`${title}\n\n${contentForEmbedding}`)
  const vector = `[${embedding.join(',')}]`

  await prisma.$executeRaw`
    INSERT INTO "PostEmbedding" (slug, title, summary, embedding, "createdAt", "updatedAt")
    VALUES (
      ${slug},
      ${title},
      ${summary ?? null},
      ${vector}::vector,
      NOW(),
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title       = EXCLUDED.title,
      summary     = EXCLUDED.summary,
      embedding   = EXCLUDED.embedding,
      "updatedAt" = NOW()
  `
}

export interface SearchResult {
  slug: string
  title: string
  summary: string | null
  similarity: number
}

// Find posts similar to a query string
export async function searchPosts(query: string, limit = 5): Promise<SearchResult[]> {
  const embedding = await generateEmbedding(query)
  const vector = `[${embedding.join(',')}]`

  return prisma.$queryRaw<SearchResult[]>`
    SELECT
      slug,
      title,
      summary,
      ROUND((1 - (embedding <-> ${vector}::vector))::numeric, 4) AS similarity
    FROM "PostEmbedding"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> ${vector}::vector
    LIMIT ${limit}
  `
}
