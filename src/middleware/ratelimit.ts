import type { Context, Next } from 'hono'
import { getRedis } from '../lib/redis.js'

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const WINDOW_SEC = 10 * 60        // 10 minutes in seconds
const MAX_REQUESTS = 5

// In-memory fallback (used when Redis is not configured)
const memStore = new Map<string, { count: number; resetAt: number }>()

async function checkRedisSlidingWindow(ip: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return checkMemory(ip)

  const key = `ratelimit:contact:${ip}`
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  // Atomic pipeline: remove old entries, add current, count, set expiry
  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(key, '-inf', windowStart)
  pipeline.zadd(key, now, `${now}-${Math.random()}`)
  pipeline.zcard(key)
  pipeline.expire(key, WINDOW_SEC)

  const results = await pipeline.exec()
  const count = (results?.[2]?.[1] as number) ?? 0

  return count <= MAX_REQUESTS
}

function checkMemory(ip: string): boolean {
  const now = Date.now()
  const entry = memStore.get(ip)

  if (!entry || now > entry.resetAt) {
    memStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_REQUESTS) return false

  entry.count++
  return true
}

export async function contactRatelimit(c: Context, next: Next) {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    c.req.header('x-real-ip') ??
    'anonymous'

  const allowed = await checkRedisSlidingWindow(ip)

  if (!allowed) {
    return c.json(
      { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      429,
      { 'Retry-After': String(WINDOW_SEC) }
    )
  }

  return next()
}
