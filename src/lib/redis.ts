import Redis from 'ioredis'

let client: Redis | null = null

export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null

  if (!client) {
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: false,
    })

    client.on('error', (err) => {
      console.error('[redis] connection error:', err.message)
    })

    client.on('connect', () => {
      console.log('[redis] connected')
    })
  }

  return client
}

export async function disconnectRedis() {
  if (client) {
    await client.quit()
    client = null
  }
}
