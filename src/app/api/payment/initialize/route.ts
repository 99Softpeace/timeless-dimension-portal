import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import {
  amountsMatch,
  buildAddress,
  buildOrderItems,
  generateOrderNumber,
  generatePaymentReference,
  normalizeCurrency,
  toAmount,
  type CheckoutAddress,
  type CheckoutCartItem,
} from '@/lib/order-utils'

type InitializePaymentBody = {
  amount?: number | string
  currency?: string
  email?: string
  phonenumber?: string
  phone_number?: string
  name?: string
  firstName?: string
  lastName?: string
  cartItems?: CheckoutCartItem[]
  shippingAddress?: CheckoutAddress
  billingAddress?: CheckoutAddress
}

// POST /api/payment/initialize
// Creates a pending order, then initializes Flutterwave hosted checkout using a server-generated tx_ref.
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = (await req.json()) as InitializePaymentBody
    const email = String(body.email || '').trim()
    const currency = normalizeCurrency(body.currency)
    const phone = String(body.phonenumber || body.phone_number || '').trim()
    const name = String(
      body.name || `${body.firstName || ''} ${body.lastName || ''}`
    ).trim()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Customer email is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const { items, subtotal } = await buildOrderItems(body.cartItems)
    const clientAmount = toAmount(body.amount)

    if (Number.isFinite(clientAmount) && !amountsMatch(subtotal, clientAmount)) {
      return NextResponse.json(
        { success: false, message: 'Amount mismatch' },
        { status: 400 }
      )
    }

    const shippingAddress = buildAddress(
      body.shippingAddress,
      phone || body.billingAddress?.phone
    )
    const billingAddress = buildAddress(body.billingAddress || body.shippingAddress, shippingAddress.phone)

    const tx_ref = generatePaymentReference('FLW')

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
      currency,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'flutterwave',
      paymentReference: tx_ref,
      notes: 'Flutterwave checkout initialized (pending payment)',
    })

    const frontendBase = (process.env.FRONTEND_URL || req.nextUrl.origin).replace(/\/+$/, '')

    const payload = {
      tx_ref,
      amount: subtotal,
      currency,
      payment_options: 'card,ussd,banktransfer',
      redirect_url: `${frontendBase}/payment/callback`,
      customer: {
        email,
        phonenumber: phone || shippingAddress.phone || '',
        name,
      },
      meta: {
        source: 'timeless-dimension-portal',
        order_id: String(order._id),
        order_number: order.orderNumber,
        user_id: userId,
      },
      customizations: {
        title: 'Timeless Dimension Portal',
        description: `Payment for order ${order.orderNumber}`,
        logo: 'https://assets.piedpiper.com/logo.png',
      },
    }

    const secretKey = process.env.FLW_SECRET_KEY
    if (!secretKey) {
      throw new Error('FLW_SECRET_KEY is missing')
    }

    const flutterwaveRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const response = await flutterwaveRes.json()

    if (!flutterwaveRes.ok || response?.status !== 'success') {
      throw new Error(
        response?.message || `Flutterwave initialize failed (${flutterwaveRes.status})`
      )
    }

    const checkoutLink = response?.data?.link

    if (!checkoutLink) {
      return NextResponse.json(
        { success: false, message: 'Flutterwave checkout link was not returned' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        tx_ref,
        amount: subtotal,
        currency,
        checkoutLink,
        orderId: String(order._id),
        orderNumber: order.orderNumber,
      },
    })
  } catch (error: any) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Payment initialization failed',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
