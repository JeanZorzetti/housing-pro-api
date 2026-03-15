import { Hono } from 'hono'
import { prisma } from '../lib/prisma.js'
import { getRedis } from '../lib/redis.js'

const health = new Hono()

health.get('/', async (c) => {
  const [dbResult, redisResult] = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    getRedis()?.ping(),
  ])

  const dbOk = dbResult.status === 'fulfilled'
  const redisConfigured = !!process.env.REDIS_URL
  const redisOk = redisConfigured
    ? redisResult.status === 'fulfilled' && redisResult.value === 'PONG'
    : null

  const status = dbOk ? 'ok' : 'degraded'

  return c.json(
    {
      status,
      db: dbOk ? 'connected' : 'disconnected',
      redis: redisConfigured ? (redisOk ? 'connected' : 'disconnected') : 'not configured',
      uptime: process.uptime(),
      ts: new Date().toISOString(),
    },
    dbOk ? 200 : 503
  )
})

export default health
