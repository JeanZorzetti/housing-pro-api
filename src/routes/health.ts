import { Hono } from 'hono'
import { prisma } from '../lib/prisma.js'

const health = new Hono()

health.get('/', async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime(),
      ts: new Date().toISOString(),
    })
  } catch {
    return c.json({ status: 'error', db: 'disconnected' }, 503)
  }
})

export default health
