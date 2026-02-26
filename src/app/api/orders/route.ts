import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import '@/models/Product'

// GET /api/orders - Get user orders
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')
        const options: any = {
            limit,
            skip: (page - 1) * limit,
            status
        }
        const orders = await (Order as any).findByUser(userId, options)
        const totalQuery: any = { user: userId }
        if (status) totalQuery.status = status
        const total = await Order.countDocuments(totalQuery)
        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ success: false, message: 'Error fetching orders', error: error.message }, { status: 500 })
    }
}
