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
    image?: string
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
  phone?: string
}

function customerName(customer: CustomerInfo) {
  const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
  return name || 'Customer'
}

function money(order: OrderEmailOrder) {
  return `${order.currency} ${Number(order.total || 0).toLocaleString()}`
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function absoluteImageUrl(image: unknown) {
  const value = String(image || '').trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  const base = (process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
  if (!base || !value.startsWith('/')) return value

  return `${base}${value}`
}

function formatAddress(address: OrderEmailOrder['shippingAddress']) {
  if (!address) return 'Not provided'

  return [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(', ') || 'Not provided'
}

function buildItemRows(order: OrderEmailOrder) {
  return (order.items || [])
    .map((item) => {
      const image = absoluteImageUrl(item.image)
      return `
        <tr>
          <td style="padding:12px 12px 12px 0; width:96px; vertical-align:top;">
            ${
              image
                ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(item.name)}" style="display:block; width:84px; height:84px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0;" />`
                : `<div style="width:84px; height:84px; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; color:#64748b; font-size:12px; display:flex; align-items:center; justify-content:center;">No image</div>`
            }
          </td>
          <td style="padding:12px 0; vertical-align:top;">
            <p style="margin:0 0 4px;"><strong>${escapeHtml(item.name)}</strong></p>
            <p style="margin:0;">Quantity: ${Number(item.quantity || 0).toLocaleString()}</p>
            <p style="margin:0;">Unit Price: ${escapeHtml(order.currency)} ${Number(item.price || 0).toLocaleString()}</p>
            <p style="margin:0;">Line Total: ${escapeHtml(order.currency)} ${Number((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
          </td>
        </tr>
      `
    })
    .join('')
}

function ownerEmailAddress() {
  return (
    process.env.OWNER_ORDER_EMAIL ||
    process.env.ORDER_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_USER ||
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
  const itemRows = buildItemRows(order)

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 12px;">${isPayOnDelivery ? 'Order Received' : 'Payment Received'}</h2>
      <p>Hello ${escapeHtml(greeting)},</p>
      <p>${isPayOnDelivery ? 'Your order has been recorded. You can pay when your delivery arrives.' : 'Your payment has been confirmed and your order has been recorded.'}</p>
      <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p><strong>Payment Method:</strong> ${escapeHtml(order.paymentMethod || 'N/A')}</p>
      <p><strong>Status:</strong> ${escapeHtml(order.status)}</p>
      <p><strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus)}</p>
      <p><strong>Delivery:</strong> Free in Lagos and outside Lagos.</p>
      ${itemRows ? `<h3 style="margin:20px 0 8px;">Your Products</h3><table style="border-collapse:collapse; width:100%;">${itemRows}</table>` : ''}
      <p>We will notify you when your order is packed and shipped.</p>
      <p style="margin-top:20px;">Senators Accessories</p>
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
    ...(order.items || []).map(
      (item) =>
        `Product: ${item.name} | Quantity: ${item.quantity} | Unit Price: ${order.currency} ${Number(item.price || 0).toLocaleString()} | Image: ${item.image || 'Not provided'}`
    ),
    `Senators Accessories`,
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
  const subject = `STORE ALERT: New order ${order.orderNumber} from ${customer.email}`
  const greeting = customerName(customer)
  const address = order.shippingAddress
  const addressText = formatAddress(address)
  const phone = customer.phone || address?.phone || 'Not provided'
  const location = [address?.city, address?.state, address?.country]
    .filter(Boolean)
    .map(escapeHtml)
    .join(', ') || 'Not provided'
  const itemRows = buildItemRows(order)

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
      <p style="margin:0 0 12px; padding:10px 12px; background:#ecfeff; border:1px solid #67e8f9; color:#164e63;">
        Store/admin notification for Senators Accessories. A customer just placed an order.
      </p>
      <h2 style="margin:0 0 12px;">New Customer Order</h2>
      <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
      <h3 style="margin:20px 0 8px;">Customer Details</h3>
      <p><strong>Name:</strong> ${escapeHtml(greeting)}</p>
      <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Delivery Address:</strong> ${addressText}</p>
      <h3 style="margin:20px 0 8px;">Order Details</h3>
      <p><strong>Total:</strong> ${money(order)}</p>
      <p><strong>Payment Method:</strong> ${escapeHtml(order.paymentMethod || 'N/A')}</p>
      <p><strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus)}</p>
      ${itemRows ? `<h3 style="margin:20px 0 8px;">Products Ordered</h3><table style="border-collapse:collapse; width:100%;">${itemRows}</table>` : ''}
    </div>
  `

  const text = [
    `New Order Received`,
    `Order Number: ${order.orderNumber}`,
    `Customer Name: ${greeting}`,
    `Customer Email: ${customer.email}`,
    `Phone: ${phone}`,
    `Location: ${[address?.city, address?.state, address?.country].filter(Boolean).join(', ') || 'Not provided'}`,
    `Delivery Address: ${addressText}`,
    `Total: ${money(order)}`,
    `Payment Method: ${order.paymentMethod || 'N/A'}`,
    `Payment Status: ${order.paymentStatus}`,
    ...(order.items || []).map(
      (item) =>
        `Product: ${item.name} | Quantity: ${item.quantity} | Unit Price: ${order.currency} ${Number(item.price || 0).toLocaleString()} | Image: ${item.image || 'Not provided'}`
    ),
  ].join('\n')

  return sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: customer.email,
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
