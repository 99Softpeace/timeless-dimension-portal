import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import User from '@/models/User'
import { getFlutterwaveClient } from '@/lib/flutterwave'
import { sendOwnerOrderNotificationEmail, sendOrderConfirmationEmail } from '@/lib/order-email'

function isValidHmacSignature(rawBody: string, signature: string, secret: string) {
  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex')

  if (digest.length !== signature.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

function isValidWebhookRequest(req: NextRequest, rawBody: string) {
  const webhookSecret = process.env.FLW_WEBHOOK_HASH

  if (!webhookSecret) {
    return false
  }

  const hmacSignature = req.headers.get('flutterwave-signature')
  if (hmacSignature) {
    return isValidHmacSignature(rawBody, hmacSignature, webhookSecret)
  }

  const legacyHash = req.headers.get('verif-hash')
  if (legacyHash) {
    return legacyHash === webhookSecret
  }

  return false
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    if (!isValidWebhookRequest(req, rawBody)) {
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)
    const transactionId = payload?.data?.id

    if (!transactionId) {
      return NextResponse.json({ success: true, message: 'Webhook received' })
    }

    const flw = getFlutterwaveClient()
    const verification = await flw.Transaction.verify({ id: String(transactionId) })
    const tx = verification?.data

    if (!tx?.id) {
      return NextResponse.json({ success: true, message: 'Webhook received' })
    }

    await dbConnect()

    const order = await Order.findOne({
      $or: [
        { paymentIntentId: String(tx.id) },
        { paymentReference: String(tx.tx_ref || '') },
      ],
    })
    if (!order) {
      return NextResponse.json({
        success: true,
        message: 'Webhook received (no matching order yet)',
      })
    }

    const wasPaid = order.paymentStatus === 'paid'

    if (tx.status === 'successful') {
      order.paymentStatus = 'paid'
      if (order.status === 'pending') {
        order.status = 'processing'
      }
      order.paymentIntentId = String(tx.id)
    } else if (tx.status === 'failed' || tx.status === 'cancelled') {
      order.paymentStatus = 'failed'
    }

    await order.save()

    if (!wasPaid && order.paymentStatus === 'paid') {
      try {
        const user = await (User as any).findById(order.user).select('email firstName lastName isActive')
        const customer = {
          email: String(user?.email || tx.customer?.email || ''),
          firstName: user?.firstName,
          lastName: user?.lastName,
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
          })),
          shippingAddress: order.shippingAddress,
        }
        if (user?.email && user?.isActive !== false) {
          await sendOrderConfirmationEmail(customer, orderSummary)
        }
        await sendOwnerOrderNotificationEmail(customer, orderSummary)
      } catch (emailError) {
        console.error('Webhook order email error:', emailError)
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })
  } catch (error: any) {
    console.error('Flutterwave webhook error:', error)
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed', error: error.message },
      { status: 500 }
    )
  }
}
