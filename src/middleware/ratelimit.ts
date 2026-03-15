import type { Context, Next } from 'hono'

// Simple in-memory rate limiter (replace with Redis when available on VPS)
// Stores: ip → { count, resetAt }
const store = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 5

export async function contactRatelimit(c: Context, next: Next) {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    c.req.header('x-real-ip') ??
    'anonymous'

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return c.json(
      { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      429,
      { 'Retry-After': String(retryAfter) }
    )
  }

  entry.count++
  return next()
}
