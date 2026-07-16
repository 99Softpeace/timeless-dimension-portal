import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import '@/models/Product'
import { findFlutterwaveChargeByReference } from '@/lib/flutterwave-v4'

async function reconcilePendingBankTransfer(order: any) {
    if (order.paymentMethod !== 'bank_transfer' || order.paymentStatus !== 'pending' || !order.paymentReference) return

    const charge = await findFlutterwaveChargeByReference(String(order.paymentReference))
    if (!charge || charge.status !== 'succeeded') return

    const amountMatches = Number.isFinite(Number(charge.amount)) && Math.abs(Number(charge.amount) - Number(order.total)) < 0.01
    const currencyMatches = String(charge.currency || '').toUpperCase() === String(order.currency || '').toUpperCase()
    const referenceMatches = String(charge.reference || '') === String(order.paymentReference)
    if (!amountMatches || !currencyMatches || !referenceMatches) {
        console.error('Flutterwave transfer reconciliation mismatch', { orderId: String(order._id), chargeId: String(charge.id || '') })
        return
    }

    order.paymentStatus = 'paid'
    if (order.status === 'pending') order.status = 'processing'
    if (charge.id) order.paymentIntentId = String(charge.id)
    await order.save()
}

// GET /api/orders/[id] - Get single order
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const { id } = params
        const order = await Order.findOne({ _id: id, user: userId }).populate('items.product', 'name image slug')
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
        }
        try {
            await reconcilePendingBankTransfer(order)
        } catch (reconciliationError) {
            console.error('Bank transfer reconciliation error:', reconciliationError)
        }
        return NextResponse.json({ success: true, data: order })
    } catch (error: any) {
        console.error('Error fetching order:', error)
        return NextResponse.json({ success: false, message: 'Error fetching order', error: error.message }, { status: 500 })
    }
}
