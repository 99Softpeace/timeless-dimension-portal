import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import { getFlutterwaveClient } from '@/lib/flutterwave'
import Order from '@/models/Order'
import { allProducts } from '@/lib/products'
import User from '@/models/User'
import { sendOrderConfirmationEmail } from '@/lib/order-email'

type PaymentVerification = {
  id?: number | string
  status?: string
  amount?: number | string
  currency?: string
  tx_ref?: string
  customer?: {
    email?: string
  }
}

type CheckoutCartItem = {
  id: string
  name?: string
  price?: number
  image?: string
  quantity: number
  slug?: string
}

type CheckoutAddress = {
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

type VerifyPaymentBody = {
  transactionId?: number | string
  txRef?: string
  currency?: string
  cartItems?: CheckoutCartItem[]
  shippingAddress?: CheckoutAddress
  billingAddress?: CheckoutAddress
}

const STATIC_PRODUCT_MAP = new Map(allProducts.map((product) => [product.id, product]))

function normalizeCurrency(value: unknown) {
  return String(value || '').trim().toUpperCase()
}

function isMongoObjectId(value: string) {
  return /^[a-fA-F0-9]{24}$/.test(value)
}

function toAmount(value: unknown) {
  const num = Number(value)
  return Number.isFinite(num) ? num : NaN
}

function amountsMatch(expected: number, actual: number) {
  return Math.abs(expected - actual) < 0.01
}

function generateOrderNumber() {
  return `TDP-${Date.now()}-${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')}`
}

function buildAddress(address: CheckoutAddress | undefined, fallbackPhone?: string) {
  const normalized = {
    firstName: String(address?.firstName || '').trim(),
    lastName: String(address?.lastName || '').trim(),
    address1: String(address?.address1 || '').trim(),
    address2: String(address?.address2 || '').trim(),
    city: String(address?.city || '').trim(),
    state: String(address?.state || '').trim(),
    postalCode: String(address?.postalCode || '').trim(),
    country: String(address?.country || 'Nigeria').trim() || 'Nigeria',
    phone: String(address?.phone || fallbackPhone || '').trim(),
  }

  const requiredFields: (keyof typeof normalized)[] = [
    'firstName',
    'lastName',
    'address1',
    'city',
    'state',
    'postalCode',
    'country',
  ]

  const missing = requiredFields.find((field) => !normalized[field])
  if (missing) {
    throw new Error(`Missing required address field: ${missing}`)
  }

  return normalized
}

function buildOrderItems(cartItems: CheckoutCartItem[]) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  let subtotal = 0

  const items = cartItems.map((cartItem) => {
    const quantity = Number(cartItem.quantity)
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for item ${cartItem.id}`)
    }

    const product = STATIC_PRODUCT_MAP.get(String(cartItem.id))
    if (!product) {
      throw new Error(`Unknown cart item: ${cartItem.id}`)
    }

    subtotal += product.price * quantity

    return {
      ...(isMongoObjectId(String(cartItem.id)) ? { product: String(cartItem.id) } : {}),
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    }
  })

  return { items, subtotal }
}

async function verifyFlutterwaveTransaction(transactionId: string) {
  const flw = getFlutterwaveClient()
  const response = await flw.Transaction.verify({ id: transactionId })
  return (response?.data || {}) as PaymentVerification
}

function buildPaymentSummary(data: PaymentVerification) {
  return {
    transactionId: data.id ? String(data.id) : null,
    txRef: data.tx_ref || null,
    status: data.status || null,
    amount: toAmount(data.amount),
    currency: normalizeCurrency(data.currency) || null,
    customerEmail: data.customer?.email || null,
  }
}

async function finalizePendingOrderFromVerification(
  verified: PaymentVerification,
  txRefFromRequest?: string | null
) {
  const txRef = String(txRefFromRequest || verified.tx_ref || '').trim()
  const paymentIntentId = verified.id ? String(verified.id) : ''

  if (!txRef) {
    return null
  }

  await dbConnect()

  if (paymentIntentId) {
    const existingByPaymentId = await Order.findOne({ paymentIntentId })
    if (existingByPaymentId) {
      return existingByPaymentId
    }
  }

  const order = await Order.findOne({ paymentReference: txRef })
  if (!order) {
    return null
  }

  const wasPaid = order.paymentStatus === 'paid'

  const paidAmount = toAmount(verified.amount)
  if (!Number.isFinite(paidAmount) || !amountsMatch(Number(order.total), paidAmount)) {
    throw new Error('Amount mismatch for pending order')
  }

  const orderCurrency = normalizeCurrency(order.currency)
  const paymentCurrency = normalizeCurrency(verified.currency)
  if (orderCurrency && paymentCurrency && orderCurrency !== paymentCurrency) {
    throw new Error('Currency mismatch for pending order')
  }

  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid'
  }

  if (order.status === 'pending') {
    order.status = 'processing'
  }

  if (paymentIntentId) {
    order.paymentIntentId = paymentIntentId
  }

  order.paymentReference = txRef

  const txRefNote = verified.tx_ref ? `Flutterwave tx_ref: ${verified.tx_ref}` : ''
  if (txRefNote && !String(order.notes || '').includes(txRefNote)) {
    order.notes = String(order.notes || '').trim()
      ? `${String(order.notes).trim()} | ${txRefNote}`
      : txRefNote
  }

  await order.save()

  if (!wasPaid && order.paymentStatus === 'paid') {
    try {
      const user = await (User as any).findById(order.user).select(
        'email firstName lastName isActive'
      )
      if (user?.email && user?.isActive !== false) {
        await sendOrderConfirmationEmail(
          {
            email: String(user.email),
            firstName: user.firstName,
            lastName: user.lastName,
          },
          {
            orderNumber: String(order.orderNumber),
            status: String(order.status),
            paymentStatus: String(order.paymentStatus),
            total: Number(order.total || 0),
            currency: String(order.currency || 'NGN'),
            createdAt: (order as any).createdAt,
          }
        )
      }
    } catch (emailError) {
      console.error('Order confirmation email error:', emailError)
    }
  }

  return order
}

// GET /api/payment/verify
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const transaction_id = searchParams.get('transaction_id')
    const tx_ref = searchParams.get('tx_ref')
    const finalize =
      searchParams.get('finalize') === '1' ||
      searchParams.get('finalize') === 'true'

    if (!transaction_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Transaction ID is required',
        },
        { status: 400 }
      )
    }

    const data = await verifyFlutterwaveTransaction(transaction_id)
    const summary = buildPaymentSummary(data)

    if (tx_ref && data.tx_ref && tx_ref !== data.tx_ref) {
      return NextResponse.json(
        {
          success: false,
          message: 'Transaction reference mismatch',
          data: summary,
        },
        { status: 400 }
      )
    }

    if (!finalize) {
      return NextResponse.json({
        success: true,
        data: summary,
        message: 'Payment verified successfully',
      })
    }

    if (data.status !== 'successful') {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment is not successful',
          data: summary,
        },
        { status: 400 }
      )
    }

    const order = await finalizePendingOrderFromVerification(data, tx_ref)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pending order not found for transaction reference',
          data: { payment: summary },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: summary,
        order,
      },
      message: 'Payment verified and order finalized',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// POST /api/payment/verify
// Verifies a Flutterwave payment and creates the order if it has not already been recorded.
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = (await req.json()) as VerifyPaymentBody
    const transactionId = String(body.transactionId || '').trim()
    const expectedCurrency = normalizeCurrency(body.currency || 'NGN')

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const verified = await verifyFlutterwaveTransaction(transactionId)
    const paymentSummary = buildPaymentSummary(verified)

    if (verified.status !== 'successful') {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment is not successful',
          data: paymentSummary,
        },
        { status: 400 }
      )
    }

    if (body.txRef && verified.tx_ref && body.txRef !== verified.tx_ref) {
      return NextResponse.json(
        {
          success: false,
          message: 'Transaction reference mismatch',
          data: paymentSummary,
        },
        { status: 400 }
      )
    }

    if (expectedCurrency && normalizeCurrency(verified.currency) !== expectedCurrency) {
      return NextResponse.json(
        {
          success: false,
          message: 'Currency mismatch',
          data: paymentSummary,
        },
        { status: 400 }
      )
    }

    await dbConnect()

    const existingOrder = await Order.findOne({
      paymentIntentId: String(verified.id || transactionId),
    })

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: 'Payment was already verified',
        data: {
          payment: paymentSummary,
          order: existingOrder,
        },
      })
    }

    const pendingOrder = await finalizePendingOrderFromVerification(
      verified,
      body.txRef || verified.tx_ref || null
    )

    if (pendingOrder) {
      if (String(pendingOrder.user) !== String(userId)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and pending order finalized',
        data: {
          payment: paymentSummary,
          order: pendingOrder,
        },
      })
    }

    const { items, subtotal } = buildOrderItems(body.cartItems || [])
    const paidAmount = toAmount(verified.amount)

    if (!Number.isFinite(paidAmount) || !amountsMatch(subtotal, paidAmount)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Amount mismatch',
          data: { ...paymentSummary, expectedAmount: subtotal },
        },
        { status: 400 }
      )
    }

    const shippingAddress = buildAddress(
      body.shippingAddress,
      body.shippingAddress?.phone || body.billingAddress?.phone
    )
    const billingAddress = buildAddress(
      body.billingAddress || body.shippingAddress,
      shippingAddress.phone
    )

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId,
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost: 0,
      tax: 0,
      discount: 0,
      total: subtotal,
      currency: expectedCurrency || 'NGN',
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'flutterwave',
      paymentIntentId: String(verified.id || transactionId),
      notes: verified.tx_ref ? `Flutterwave tx_ref: ${verified.tx_ref}` : undefined,
    })

    try {
      const user = await (User as any).findById(userId).select(
        'email firstName lastName isActive'
      )
      if (user?.email && user?.isActive !== false) {
        await sendOrderConfirmationEmail(
          {
            email: String(user.email),
            firstName: user.firstName,
            lastName: user.lastName,
          },
          {
            orderNumber: String(order.orderNumber),
            status: String(order.status),
            paymentStatus: String(order.paymentStatus),
            total: Number(order.total || 0),
            currency: String(order.currency || 'NGN'),
            createdAt: (order as any).createdAt,
          }
        )
      }
    } catch (emailError) {
      console.error('Order confirmation email error:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order created',
      data: {
        payment: paymentSummary,
        order,
      },
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
