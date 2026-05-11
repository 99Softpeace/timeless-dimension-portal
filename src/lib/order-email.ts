import { sendEmail } from '@/lib/email'

type OrderEmailOrder = {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  total: number
  currency: string
  trackingNumber?: string
  createdAt?: Date | string
  items?: {
    name: string
    quantity: number
    price: number
  }[]
  shippingAddress?: {
    firstName?: string
    lastName?: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  }
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

function ownerEmailAddress() {
  return (
    process.env.OWNER_ORDER_EMAIL ||
    process.env.ORDER_NOTIFICATION_EMAIL ||
    process.env.EMAIL_USER ||
    process.env.ADMIN_EMAIL ||
    'senatorsaccessories@gmail.com'
  )
}

export async function sendOrderConfirmationEmail(
  customer: CustomerInfo,
  order: OrderEmailOrder
) {
  const isPayOnDelivery = order.paymentMethod === 'cash_on_delivery'
  const subject = `Order Confirmed: ${order.orderNumber}`
  const greeting = customerName(customer)

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 12px;">${isPayOnDelivery ? 'Order Received' : 'Payment Received'}</h2>
      <p>Hello ${greeting},</p>
      <p>${isPayOnDelivery ? 'Your order has been recorded. You can pay when your delivery arrives.' : 'Your payment has been confirmed and your order has been recorded.'}</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      <p><strong>Delivery:</strong> Free in Lagos and outside Lagos.</p>
      <p>We will notify you when your order is packed and shipped.</p>
      <p style="margin-top:20px;">Timeless Dimension Portal</p>
    </div>
  `

  const text = [
    `Hello ${greeting},`,
    isPayOnDelivery
      ? `Your order has been recorded. You can pay when your delivery arrives.`
      : `Your payment has been confirmed and your order has been recorded.`,
    `Order Number: ${order.orderNumber}`,
    `Total: ${money(order)}`,
    `Payment Method: ${order.paymentMethod || 'N/A'}`,
    `Status: ${order.status}`,
    `Payment Status: ${order.paymentStatus}`,
    `Delivery: Free in Lagos and outside Lagos.`,
    `Timeless Dimension Portal`,
  ].join('\n')

  return sendEmail({
    to: customer.email,
    subject,
    html,
    text,
  })
}

export async function sendOwnerOrderNotificationEmail(
  customer: CustomerInfo,
  order: OrderEmailOrder
) {
  const to = ownerEmailAddress()
  const subject = `New Order: ${order.orderNumber}`
  const greeting = customerName(customer)
  const address = order.shippingAddress
  const addressText = address
    ? [
        address.address1,
        address.address2,
        address.city,
        address.state,
        address.postalCode,
        address.country,
      ].filter(Boolean).join(', ')
    : 'Not provided'
  const itemRows = (order.items || [])
    .map((item) => `<li>${item.name} x ${item.quantity} - ${order.currency} ${Number(item.price || 0).toLocaleString()}</li>`)
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 12px;">New Order Received</h2>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Customer:</strong> ${greeting} (${customer.email})</p>
      <p><strong>Phone:</strong> ${address?.phone || 'Not provided'}</p>
      <p><strong>Delivery Address:</strong> ${addressText}</p>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      ${itemRows ? `<p><strong>Items:</strong></p><ul>${itemRows}</ul>` : ''}
    </div>
  `

  const text = [
    `New Order Received`,
    `Order Number: ${order.orderNumber}`,
    `Customer: ${greeting} (${customer.email})`,
    `Phone: ${address?.phone || 'Not provided'}`,
    `Delivery Address: ${addressText}`,
    `Total: ${money(order)}`,
    `Payment Method: ${order.paymentMethod || 'N/A'}`,
    `Payment Status: ${order.paymentStatus}`,
  ].join('\n')

  return sendEmail({
    to,
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
