import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
import { getFlutterwaveClient } from '@/lib/flutterwave'

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

    const order = await Order.findOne({ paymentIntentId: String(tx.id) })
    if (!order) {
      return NextResponse.json({
        success: true,
        message: 'Webhook received (no matching order yet)',
      })
    }

    if (tx.status === 'successful') {
      order.paymentStatus = 'paid'
      if (order.status === 'pending') {
        order.status = 'processing'
      }
    } else if (tx.status === 'failed' || tx.status === 'cancelled') {
      order.paymentStatus = 'failed'
    }

    await order.save()

    return NextResponse.json({ success: true, message: 'Webhook processed' })
  } catch (error: any) {
    console.error('Flutterwave webhook error:', error)
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed', error: error.message },
      { status: 500 }
    )
  }
}
