import { canSendEmails, sendEmail } from '@/lib/email'
import User from '@/models/User'

type DigestProduct = {
  name: string
  slug?: string
  price: number
  images?: string[]
  category?: string
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  const base = (process.env.FRONTEND_URL || '').replace(/\/+$/, '')
  return base && value.startsWith('/') ? `${base}${value}` : value
}

export async function sendNewArrivalsDigest(products: DigestProduct[]) {
  if (!canSendEmails()) throw new Error('Email is not configured.')
  if (products.length === 0) return { requested: 0, sent: 0, failed: 0 }

  const users = await User.find({ isActive: true, role: { $ne: 'admin' } }).select('email firstName').lean()
  const storeUrl = (process.env.FRONTEND_URL || '').replace(/\/+$/, '')
  const cards = products.map((product) => {
    const image = absoluteUrl(product.images?.[0] || '')
    const link = `${storeUrl}/product/${encodeURIComponent(product.slug || '')}`
    return `<div style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:0 0 18px;">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" style="display:block;width:100%;max-height:340px;object-fit:cover;" />` : ''}<div style="padding:18px;"><p style="margin:0 0 5px;color:#0f766e;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(product.category || 'New arrival')}</p><h2 style="margin:0 0 8px;font-size:21px;">${escapeHtml(product.name)}</h2><p style="margin:0 0 14px;font-size:17px;font-weight:bold;">₦${Number(product.price || 0).toLocaleString()}</p><a href="${escapeHtml(link)}" style="color:#0f172a;font-weight:bold;">View product →</a></div></div>`
  }).join('')
  const productLines = products.map((product) => `- ${product.name}: ₦${Number(product.price || 0).toLocaleString()} (${storeUrl}/product/${encodeURIComponent(product.slug || '')})`).join('\n')
  const subject = products.length === 1 ? `New arrival: ${products[0].name}` : `${products.length} new arrivals at Senator Accessories`
  let sent = 0

  for (let index = 0; index < users.length; index += 5) {
    const outcomes = await Promise.allSettled(users.slice(index, index + 5).map((user: any) => sendEmail({
      to: user.email,
      subject,
      html: `<div style="background:#f6f2ec;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;"><div style="max-width:640px;margin:auto;background:#fff;border-radius:18px;padding:28px;border:1px solid #e2e8f0;"><p style="margin:0 0 8px;color:#0f766e;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Freshly added</p><h1 style="margin:0 0 12px;font-size:29px;">Discover our latest arrivals</h1><p style="margin:0 0 24px;color:#475569;">Hello${user.firstName ? ` ${escapeHtml(user.firstName)}` : ''}, here are the newest pieces added to Senator Accessories.</p>${cards}<a href="${escapeHtml(`${storeUrl}/new-arrivals`)}" style="display:inline-block;margin-top:6px;padding:13px 22px;border-radius:999px;background:#0f172a;color:#fff;text-decoration:none;font-weight:bold;">Shop all new arrivals</a></div></div>`,
      text: `Hello${user.firstName ? ` ${user.firstName}` : ''},\n\nDiscover our latest arrivals:\n${productLines}\n\nShop all new arrivals: ${storeUrl}/new-arrivals`,
    })))
    sent += outcomes.filter((outcome) => outcome.status === 'fulfilled' && outcome.value.sent).length
  }

  return { requested: users.length, sent, failed: users.length - sent }
}
