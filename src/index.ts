import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import health from './routes/health.js'
import contact from './routes/contact.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

// Routes
app.route('/health', health)
app.route('/contact', contact)

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Start
const port = Number(process.env.PORT ?? 3001)
console.log(`Housing PRO API running on port ${port}`)

serve({ fetch: app.fetch, port })
