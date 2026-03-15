import { Hono } from 'hono'
import { prisma } from '../lib/prisma.js'
import { getResend, FROM_ADDRESS, NOTIFY_ADDRESS } from '../lib/resend.js'
import { contactRatelimit } from '../middleware/ratelimit.js'
import { createElement } from 'react'

const contact = new Hono()

contact.post('/', contactRatelimit, async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, company, phone, interest, message, source } = body

    if (!name || !email) {
      return c.json({ error: 'Nome e e-mail são obrigatórios.' }, 400)
    }

    const record = await prisma.contact.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        company: company ? String(company).slice(0, 200) : null,
        phone: phone ? String(phone).slice(0, 50) : null,
        interest: interest ? String(interest).slice(0, 100) : null,
        message: message ? String(message).slice(0, 5000) : null,
        source: source ? String(source).slice(0, 50) : 'api',
      },
    })

    if (process.env.RESEND_API_KEY) {
      // Import email templates dynamically to avoid build issues if not needed
      const [{ default: ContactNotification }, { default: ContactConfirmation }] =
        await Promise.all([
          import('../emails/ContactNotification.js'),
          import('../emails/ContactConfirmation.js'),
        ])

      await Promise.allSettled([
        getResend().emails.send({
          from: FROM_ADDRESS,
          to: NOTIFY_ADDRESS,
          subject: `Novo contato: ${name}${interest ? ` — ${interest}` : ''}`,
          react: createElement(ContactNotification, { name, email, company, phone, interest, message, source }),
        }),
        getResend().emails.send({
          from: FROM_ADDRESS,
          to: email,
          subject: 'Recebemos sua mensagem — Housing PRO',
          react: createElement(ContactConfirmation, { name, interest }),
        }),
      ])
    }

    return c.json({ success: true, id: record.id }, 201)
  } catch (err) {
    console.error('[contact] error:', err)
    return c.json({ error: 'Erro interno. Tente novamente.' }, 500)
  }
})

export default contact
