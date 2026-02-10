import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
// import { getUserIdFromRequest } from '@/lib/auth' // TODO: Implement JWT auth extraction

// GET /api/orders/[id] - Get single order
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
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
