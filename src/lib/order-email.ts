import { sendEmail } from '@/lib/email'

type OrderEmailOrder = {
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  currency: string
  trackingNumber?: string
  createdAt?: Date | string
}

type CustomerInfo = {
  email: string
  firstName?: string
  lastName?: string
}

function customerName(customer: CustomerInfo) {
  const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
  return name || 'Customer'
}

function money(order: OrderEmailOrder) {
  return `${order.currency} ${Number(order.total || 0).toLocaleString()}`
}

export async function sendOrderConfirmationEmail(
  customer: CustomerInfo,
  order: OrderEmailOrder
) {
  const subject = `Order Confirmed: ${order.orderNumber}`
  const greeting = customerName(customer)

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 12px;">Payment Received</h2>
      <p>Hello ${greeting},</p>
      <p>Your payment has been confirmed and your order has been recorded.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      <p>We will notify you when your order is packed and shipped.</p>
      <p style="margin-top:20px;">Timeless Dimension Portal</p>
    </div>
  `

  const text = [
    `Hello ${greeting},`,
    `Your payment has been confirmed and your order has been recorded.`,
    `Order Number: ${order.orderNumber}`,
    `Total: ${money(order)}`,
    `Status: ${order.status}`,
    `Payment Status: ${order.paymentStatus}`,
    `Timeless Dimension Portal`,
  ].join('\n')

  return sendEmail({
    to: customer.email,
    subject,
    html,
    text,
  })
}

export async function sendOrderStatusUpdateEmail(
  customer: CustomerInfo,
  order: OrderEmailOrder,
  previous: {
    status?: string
    paymentStatus?: string
    trackingNumber?: string
  } = {}
) {
  const subject = `Order Update: ${order.orderNumber} (${order.status})`
  const greeting = customerName(customer)

  const statusChanged = previous.status && previous.status !== order.status
  const paymentChanged =
    previous.paymentStatus && previous.paymentStatus !== order.paymentStatus
  const trackingChanged =
    (previous.trackingNumber || '') !== (order.trackingNumber || '')

  const updateLines: string[] = []
  if (statusChanged) updateLines.push(`Fulfillment status: ${previous.status} -> ${order.status}`)
  if (paymentChanged) updateLines.push(`Payment status: ${previous.paymentStatus} -> ${order.paymentStatus}`)
  if (trackingChanged && order.trackingNumber) updateLines.push(`Tracking number: ${order.trackingNumber}`)
  if (updateLines.length === 0) updateLines.push(`Order status: ${order.status}`)

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 12px;">Order Status Update</h2>
      <p>Hello ${greeting},</p>
      <p>There is an update for your order <strong>${order.orderNumber}</strong>.</p>
      <ul>
        ${updateLines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p>Timeless Dimension Portal</p>
    </div>
  `

  return sendEmail({
    to: customer.email,
    subject,
    html,
    text: [`Hello ${greeting},`, `Order update for ${order.orderNumber}:`, ...updateLines].join('\n'),
  })
}
