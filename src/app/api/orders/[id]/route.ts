import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import '@/models/Product'

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
        return NextResponse.json({ success: true, data: order })
    } catch (error: any) {
        console.error('Error fetching order:', error)
        return NextResponse.json({ success: false, message: 'Error fetching order', error: error.message }, { status: 500 })
    }
}
