import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import { retrieveFlutterwaveCharge } from '@/lib/flutterwave-v4'
import Order from '@/models/Order'
import User from '@/models/User'
import {
  sendOwnerOrderNotificationEmail,
  sendOrderConfirmationEmail,
} from '@/lib/order-email'
import {
  amountsMatch,
  buildAddress,
  buildOrderItems,
  generateOrderNumber,
  normalizeCurrency,
  toAmount,
  reduceInventory,
  type CheckoutAddress,
  type CheckoutCartItem,
} from '@/lib/order-utils'

type PaymentVerification = {
  id?: number | string
  status?: string
  amount?: number | string
  currency?: string
  reference?: string
  customer?: {
    email?: string
  }
}

type VerifyPaymentBody = {
  transactionId?: number | string
  txRef?: string
  currency?: string
  cartItems?: CheckoutCartItem[]
  shippingAddress?: CheckoutAddress
  billingAddress?: CheckoutAddress
}

async function verifyFlutterwaveTransaction(transactionId: string) {
  return (await retrieveFlutterwaveCharge(transactionId)) as PaymentVerification
}

function buildPaymentSummary(data: PaymentVerification) {
  return {
    transactionId: data.id ? String(data.id) : null,
    txRef: data.reference || null,
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
  const txRef = String(txRefFromRequest || verified.reference || '').trim()
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

  const txRefNote = verified.reference ? `Flutterwave V4 reference: ${verified.reference}` : ''
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
      const customer = {
        email: String(user?.email || verified.customer?.email || ''),
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: order.shippingAddress?.phone,
      }
      const orderSummary = {
        orderNumber: String(order.orderNumber),
        status: String(order.status),
        paymentStatus: String(order.paymentStatus),
        paymentMethod: String(order.paymentMethod || 'flutterwave'),
        total: Number(order.total || 0),
        currency: String(order.currency || 'NGN'),
        createdAt: (order as any).createdAt,
        items: order.items.map((item: any) => ({
          name: String(item.name),
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
          image: String(item.image || ''),
          selectedColor: String(item.selectedColor || ''),
        })),
        shippingAddress: order.shippingAddress,
      }
      try {
        await sendOwnerOrderNotificationEmail(customer, orderSummary)
      } catch (ownerEmailError) {
        console.error('Owner order notification email error:', ownerEmailError)
      }

      if (user?.email && user?.isActive !== false) {
        try {
          await sendOrderConfirmationEmail(customer, orderSummary)
        } catch (customerEmailError) {
          console.error('Customer order confirmation email error:', customerEmailError)
        }
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

    if (tx_ref && data.reference && tx_ref !== data.reference) {
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

    if (data.status !== 'succeeded') {
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

    if (verified.status !== 'succeeded') {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment is not successful',
          data: paymentSummary,
        },
        { status: 400 }
      )
    }

    if (body.txRef && verified.reference && body.txRef !== verified.reference) {
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
      body.txRef || verified.reference || null
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

    const { items, subtotal } = await buildOrderItems(body.cartItems || [])
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
      paymentMethod: 'card',
      paymentIntentId: String(verified.id || transactionId),
      notes: verified.reference ? `Flutterwave V4 reference: ${verified.reference}` : undefined,
    })

    await reduceInventory(order.items as any)

    try {
      const user = await (User as any).findById(userId).select(
        'email firstName lastName isActive'
      )
      const customer = {
        email: String(user?.email || verified.customer?.email || ''),
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: order.shippingAddress?.phone,
      }
      const orderSummary = {
        orderNumber: String(order.orderNumber),
        status: String(order.status),
        paymentStatus: String(order.paymentStatus),
        paymentMethod: String(order.paymentMethod || 'flutterwave'),
        total: Number(order.total || 0),
        currency: String(order.currency || 'NGN'),
        createdAt: (order as any).createdAt,
        items: order.items.map((item: any) => ({
          name: String(item.name),
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
          image: String(item.image || ''),
          selectedColor: String(item.selectedColor || ''),
        })),
        shippingAddress: order.shippingAddress,
      }
      try {
        await sendOwnerOrderNotificationEmail(customer, orderSummary)
      } catch (ownerEmailError) {
        console.error('Owner order notification email error:', ownerEmailError)
      }

      if (user?.email && user?.isActive !== false) {
        try {
          await sendOrderConfirmationEmail(customer, orderSummary)
        } catch (customerEmailError) {
          console.error('Customer order confirmation email error:', customerEmailError)
        }
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
