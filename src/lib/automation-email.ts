import { sendEmail } from '@/lib/email'

function ownerEmail() { return process.env.OWNER_ORDER_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '' }
function money(value: number) { return `₦${Number(value || 0).toLocaleString()}` }
function esc(value: unknown) { return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function shell(title: string, body: string) { return `<div style="background:#f6f2ec;padding:28px 16px;font-family:Arial,sans-serif;color:#0f172a"><div style="max-width:620px;margin:auto;background:#fff;padding:28px;border-radius:16px;border:1px solid #e2e8f0"><h1 style="margin:0 0 18px">${esc(title)}</h1>${body}<p style="margin-top:24px;color:#64748b;font-size:12px">Senator Accessories</p></div></div>` }

export async function sendLowStockEmail(products: any[]) {
  const to = ownerEmail(); if (!to || !products.length) return
  return sendEmail({ to, subject: `Low-stock alert: ${products.length} product${products.length === 1 ? '' : 's'}`, html: shell('Inventory needs attention', `<ul>${products.map(p => `<li><strong>${esc(p.name)}</strong>: ${p.stockQuantity} remaining</li>`).join('')}</ul>`), text: products.map(p => `${p.name}: ${p.stockQuantity} remaining`).join('\n') })
}
export async function sendStaleOrderEmail(orders: any[]) {
  const to = ownerEmail(); if (!to || !orders.length) return
  return sendEmail({ to, subject: `${orders.length} order${orders.length === 1 ? '' : 's'} need attention`, html: shell('Orders awaiting action', `<ul>${orders.map(o => `<li><strong>${esc(o.orderNumber)}</strong> — ${esc(o.status)} — ${money(o.total)}</li>`).join('')}</ul>`), text: orders.map(o => `${o.orderNumber}: ${o.status}, ${money(o.total)}`).join('\n') })
}
export async function sendReviewRequestEmail(user: any, order: any) {
  const url = `${(process.env.FRONTEND_URL || '').replace(/\/$/,'')}/contact`
  return sendEmail({ to: user.email, subject: `How was your order ${order.orderNumber}?`, html: shell('We’d love your feedback', `<p>Hello ${esc(user.firstName || '')},</p><p>We hope you’re enjoying your purchase. Tell us about your experience.</p><a href="${esc(url)}" style="display:inline-block;background:#0f172a;color:white;padding:12px 20px;border-radius:999px;text-decoration:none">Share feedback</a>`), text: `We hope you are enjoying order ${order.orderNumber}. Share feedback: ${url}` })
}
export async function sendAbandonedCartEmail(user: any, cart: any) {
  const url = `${(process.env.FRONTEND_URL || '').replace(/\/$/,'')}/checkout`
  return sendEmail({ to: user.email, subject: 'You left something in your cart', html: shell('Your cart is waiting', `<p>Hello ${esc(user.firstName || '')},</p><p>You still have ${cart.items.length} item${cart.items.length === 1 ? '' : 's'} in your cart.</p><ul>${cart.items.map((i:any) => `<li>${esc(i.name)} × ${i.quantity}</li>`).join('')}</ul><a href="${esc(url)}" style="display:inline-block;background:#0f172a;color:white;padding:12px 20px;border-radius:999px;text-decoration:none">Return to checkout</a>`), text: `Your cart is waiting. Return to checkout: ${url}` })
}
export async function sendReengagementEmail(user: any) {
  const url = `${(process.env.FRONTEND_URL || '').replace(/\/$/,'')}/new-arrivals`
  return sendEmail({ to: user.email, subject: 'See what’s new at Senator Accessories', html: shell('It’s been a while', `<p>Hello ${esc(user.firstName || '')},</p><p>Discover the newest pieces added since your last visit.</p><a href="${esc(url)}" style="display:inline-block;background:#0f172a;color:white;padding:12px 20px;border-radius:999px;text-decoration:none">Explore new arrivals</a>`), text: `Discover our newest pieces: ${url}` })
}
export async function sendWeeklyReportEmail(report: any) {
  const to = ownerEmail(); if (!to) return
  return sendEmail({ to, subject: 'Senator Accessories weekly store report', html: shell('Your weekly store report', `<p><strong>Orders:</strong> ${report.orders}</p><p><strong>Revenue:</strong> ${money(report.revenue)}</p><p><strong>New customers:</strong> ${report.newCustomers}</p><p><strong>Pending orders:</strong> ${report.pendingOrders}</p><p><strong>Low-stock products:</strong> ${report.lowStock}</p><h2>Best sellers</h2><ol>${report.bestSellers.map((p:any) => `<li>${esc(p.name)} — ${p.quantity} sold</li>`).join('') || '<li>No sales this week</li>'}</ol>`), text: `Orders: ${report.orders}\nRevenue: ${money(report.revenue)}\nNew customers: ${report.newCustomers}\nPending orders: ${report.pendingOrders}\nLow stock: ${report.lowStock}` })
}
